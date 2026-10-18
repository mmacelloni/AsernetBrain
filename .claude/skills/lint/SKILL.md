---
name: lint
description: Health check di AsernetBrain (wiki/, topics/, clients/). Produce un report di anomalie (identità non registrate, autovalidazione agente, provenance raw mancante, orfani, link morti, contraddizioni, fusioni silenziose Git). Non modifica contenuto.
argument-hint: "[opzionale: wiki | topics | clients/<slug> | nome controllo]"
allowed-tools: Read, Glob, Grep, Edit, Bash
disable-model-invocation: true
---

# Lint di AsernetBrain (`/lint`)

Ambito o controllo richiesto: `$ARGUMENTS` (se vuoto, esegui su `wiki/`, `topics/` e `clients/`)

## 1. Regola fondamentale
Il lint **non modifica contenuto**: produce un report strutturato. L'unica correzione automatica ammessa su richiesta è la rottura meccanica (righe di `index.md` disallineate dal frontmatter).
Preferisci `Grep` e `Glob` sul frontmatter all'apertura completa dei file.

Bash è concesso **solo in lettura** per la cronologia Git (`git log`, `git diff`, `git show`, `git merge-base`, `git rev-list`).

## 2. Controlli sulla Zona Governata (`wiki/` e `topics/`)

1. **Conformità Frontmatter e Provenienza (`raw/` locale):**
   - Ogni pagina in `wiki/sources/` deve avere il blocco `provenance:` con `user`, `raw_path`, `sha256`, `date`.
2. **Identità Ignota (`_meta/authors.md`):**
   - `authored_by` o `reviewed_by` con un `id` non registrato in `_meta/authors.md` → **Errore**.
3. **Revisione senza Revisore:**
   - `status: reviewed` senza `reviewed_by` valorizzato → **Errore**.
4. **Autovalidazione di un Agente (Bloccante):**
   - `authored_by` coincide con `reviewed_by` e quell'`id` è di tipo `agent` in `_meta/authors.md` → **Errore bloccante** (il contenuto prodotto da un LLM richiede validazione umana).
5. **Orfani e Link Morti:**
   - Pagine in `wiki/` o `topics/` non elencate in `wiki/index.md` / `topics/index.md` o con link interni verso file inesistenti.
6. **Contraddizioni Aperte & Gravità `QUESTION` (OIDA Decadimento Inverso):**
   - Controlla `wiki/questions.md` e la sezione `## ❓ 1. Questioni Aperte` in `clients/*/purpose.md`: calcola la **Gravità Epistemica** ($\text{giorni aperti} \times \text{peso}$) di ogni `QUESTION` `open` ed elenca in cima quelle più urgenti.
   - Segnala sezioni `> ⚠️ Contraddizione:` o `## Contraddizioni aperte` non risolte da oltre 30 giorni.
7. **Tipizzazione Epistemica (`epistemic_class` e `scope`):**
   - Verifica che le pagine in `wiki/` abbiano `epistemic_class` (`DECISION`, `SOP`, `FACT`, `HYPOTHESIS`, `QUESTION`) e `scope` definiti nel frontmatter.
8. **Fusioni Silenziose (Git):**
   - Controlla `git log --merges --since="30 days ago"` per individuare pagine di contenuto fuse automaticamente da due rami diversi senza revisione umana.

## 3. Controlli sulla Zona Operativa (`clients/`)

1. **Allineamento Catalogo Clienti:**
   - Ogni cartella in `clients/<slug>/` (escluso `_template`) deve avere una riga corrispondente in `clients/index.md`.
2. **Completezza Scheda Cliente:**
   - Verifica la presenza dei file base (`index.md`, `state.md`, `purpose.md`, `contacts.md`, `projects.md`, `log.md`, `connectors/config.yaml`).
3. **Sicurezza Connettori e Segreti:**
   - Verifica che nessun file `.md` o `connectors/config.yaml` contenga chiavi API in chiaro (devono esserci solo riferimenti `env_prefix` verso `.env`).

## 4. Formato del Report e Log

Presenta il report diviso in:
- 🔴 **Errori bloccanti** (autovalidazione, segreti esposti, identità ignote, fusioni silenziose)
- 🟠 **Top `QUESTION` per Gravità Epistemica (OIDA)** (le domande aperte da più giorni senza decisione)
- 🟡 **Avvisi** (provenance o `epistemic_class` incompleta, pagine orfane, `index.md` disallineati, contraddizioni aperte)
- 🟢 **Controlli superati**

Al termine, appendi una voce sintetica in cima a `wiki/log.md` (`## [YYYY-MM-DD] lint | <utente> | Health check AsernetBrain`) e aggiorna l'indice locale QMD (`qmd --index asernetbrain update`).
