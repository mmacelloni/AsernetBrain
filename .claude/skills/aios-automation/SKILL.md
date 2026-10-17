---
name: aios-automation
description: Costruisce il livello Automazioni (AutomationOS) di un AIOS aziendale. Fa un audit dei task ripetitivi area per area (marketing, vendite, clienti, finanza, operations, dati) partendo dai file di contesto, produce una roadmap prioritizzata delle opportunità di automazione, e per ognuna chiede se costruirla ora (comando slash + script + eventuali tabelle nel database) o rimandarla come task futuro. Esempio tipico: generazione fatture con numerazione progressiva. Usa quando l'utente vuole automatizzare task operativi, mappare cosa automatizzare, o dopo aver costruito i livelli Contesto/Dati/Intelligence.
argument-hint: "Nome azienda o automazione da creare (opzionale)"
---

# AIOS — Livello 4: AutomationOS (Azioni Per-Utente, Condivise e Per-Cliente)

Mappi i task ripetitivi e li trasformi in automazioni richiamabili secondo l'architettura **DOE (Direttiva, Orchestrazione, Esecuzione)** e il **Metodo 3C** di Asernet.

In **AsernetBrain** ogni automazione ha uno **scope preciso** (chiedi o deduci sempre quale dei 3):
1. **Personale per Utente (`actions/users/<id-utente>/<nome-action>/`)** — automazioni personali di `marco`, `sara`, `anna` (es. report mattutini personali, bozze email, script individuali).
2. **Condivisa Aziendale (`actions/shared/<nome-action>/`)** — automazioni usate da tutto il team Asernet (es. generazione preventivi, controlli trasversali). Richiede **Gate Metodo 3C** (comprensione ≥ 9/10 prima del codice e KPI ex-post in `roadmap.md`).
3. **Specifica di un Cliente (`clients/<slug>/projects.md` + `clients/<slug>/connectors/`)** — automazioni verticali legate al DB o ai sistemi esterni di un singolo cliente.

Leggi `references/audit-guide.md` prima dell'audit e `references/build-guide.md` prima di costruire un'automazione.

## Disciplina DOE — affidabilità del layer deterministico

| Livello DOE | In AsernetBrain |
|---|---|
| **Direttiva** (cosa fare) | `actions/users/<id>/<nome>/SKILL.md` oppure `.claude/commands/<nome>.md` |
| **Orchestrazione** (decidere) | Claude che legge la direttiva, risolve `clients/<slug>/`, raccoglie input e chiama lo script |
| **Esecuzione** (fare) | `actions/{users/<id>,shared}/<nome>/*.py` o `clients/<slug>/connectors/*.py` — script **deterministico** |

Regole non negoziabili:
1. **La business logic deterministica va nello script Python, mai improvvisata dall'LLM.**
2. **Auto-correzione:** se uno script fallisce, correggi lo **script** e aggiorna la **direttiva**, poi ri-testa.
3. **Gate Metodo 3C (per `actions/shared/`):** prima di scrivere codice per un'automazione aziendale condivisa, dichiara il punteggio di comprensione (`1-10`) su Contesto, Criteri di successo e Casi limite; procedi solo se **≥ 9/10** con conferma umana (HITL).

## Flusso

### 1. Contesto (Zero-Friction)
- Se l'automazione è per un **cliente**, risolvi `clients/<slug>/` tramite `clients/index.md` o `qmd-asernet` (anche senza `/prime`) e leggi `index.md`, `state.md`, `purpose.md`, `projects.md` e `connectors/config.yaml`.
- Se l'automazione è **interna Asernet** (`actions/shared/` o `actions/users/<id>/`), leggi `actions/README.md` e `wiki/index.md`.

### 2. Audit area per area
Segui `references/audit-guide.md`. Per ogni area (marketing, vendite, gestione clienti, operations, finanza, dati) individua i **task ripetitivi** e le **opportunità di automazione**. Una domanda alla volta, mai assunzioni.

### 3. Roadmap
Scrivi/aggiorna la roadmap nel posto giusto:
- Per un cliente → sezione `## 3. Roadmap Automazioni Cliente (AutomationOS)` in **`clients/<slug>/projects.md`**.
- Per automazioni aziendali condivise → **`actions/shared/roadmap.md`** (includendo valore atteso, stato `⬜ da fare` / `✅ fatta` e metriche KPI ex-post).
- Per automazioni personali di un utente → **`actions/users/<id>/roadmap.md`**.

### 4. Per ogni automazione — chiedi conferma
Partendo dalla più prioritaria, **chiedi all'utente se costruirla ora** o lasciarla `⬜ da fare` nella roadmap. Non costruire nulla senza conferma esplicita.

### 5. Costruzione di una automazione
Segui `references/build-guide.md`:
- Prima di costruire, fai le **domande di rito** (formato, vincoli, on-demand vs schedulata, e **chi riceve l'output**).
- Se il destinatario è fuori dall'azienda, l'automazione si ferma alla bozza e l'invio resta umano (eventuali deroghe vanno registrate in `clients/<slug>/connectors/config.yaml`).
- Segreti solo in `.env`.

### 6. Verifica e chiusura
Per ogni automazione costruita esegui un **test reale** e mostra l'output. Aggiorna la roadmap e appendi una riga al log (`clients/<slug>/log.md` o `wiki/log.md`). Suggerisci `/pubblica` per versionare.

Contenuti generati per aziende italiane: **in italiano**.

## Feedback di processo

Se durante questo livello l'utente segnala che **una domanda o uno step è
superfluo, confuso o sbagliato** (attrito nell'uso di AIOS, non un fatto sul suo
business), **invoca la skill `aios-learn`**: registra la frizione in
`.claude/aios-feedback-prodotto.md` per la revisione del maintainer. `aios-learn`
classifica e chiede conferma prima di scrivere — non è una lezione di business e
non va in `lezioni.md`.
