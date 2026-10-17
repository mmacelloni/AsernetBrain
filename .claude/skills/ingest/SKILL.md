---
name: ingest
description: Ingerisce una fonte da raw/ (o raw/clients/<slug>/) in AsernetBrain (wiki/ o clients/<slug>/). Il file in raw/ resta sul disco locale (escluso da Git e mai cancellato), mentre nelle pagine create/aggiornate viene tracciato il blocco provenance (user + raw_path + sha256 + date). Esegue prima un dry run, attende approvazione, risincronizza con vault_sync e scrive solo dopo.
argument-hint: "[percorso del file in raw/ o raw/clients/<slug>/]"
allowed-tools: Read, Write, Edit, Glob, Grep, Bash
disable-model-invocation: true
---

# Ingest di una fonte in AsernetBrain (`raw/` Locale + Provenienza)

File da ingerire: `$ARGUMENTS`

## 1. Regola cardine sulla `raw/` in AsernetBrain

In **AsernetBrain** la cartella `raw/` è **in `.gitignore` e NON viene mai cancellata dopo l'ingest**:
- Il file originale resta sul disco locale dell'utente che esegue l'ingest (`raw/<file>` per la wiki aziendale, oppure `raw/clients/<slug>/<file>` per un cliente specifico).
- Non sale mai sul repository Git della VPS (mantenendo il repo leggerissimo ed evitando di distribuire documenti grezzi).
- Ogni pagina creata o aggiornata durante l'ingest **deve riportare nel frontmatter YAML** chi possiede il file originale, in quale cartella locale si trova e la sua impronta SHA-256 (primi 12 caratteri):
  ```yaml
  provenance:
    - user: "<id-utente>"
      raw_path: "raw/clients/<slug>/<nome-file>"
      sha256: "<12-char-sha256>"
      date: YYYY-MM-DD
  ```

## 2. Precondizioni (verificale prima di iniziare)

1. **Identità attiva (`<id>`):** ricavala da `git config user.email` confrontandola con `_meta/authors.md` (`marco`, `sara`, `anna`). Se non è determinabile, **fermati e chiedila**.
2. **Esistenza e hash del file in `raw/`:** verifica che il file esista in `raw/` e calcolane subito i primi 12 caratteri dello SHA-256 (senza modificare il file!).
3. **Destinazione (Doppio Binario):**
   - Se il file è in `raw/clients/<slug>/...` → l'ingest aggiorna la **Zona Operativa** del cliente (`clients/<slug>/index.md`, `state.md`, `contacts.md`, `projects.md`, `log.md`).
   - Se il file è in `raw/...` (generale) → l'ingest aggiorna la **Zona Governata** (`wiki/sources/`, `wiki/entities/`, `wiki/concepts/`, `wiki/index.md`, `wiki/log.md`) con `authored_by: claude-ingest` e `status: draft`.

---

## FASE A — Dry Run (Nessuna scrittura)

1. Leggi il file sorgente da `raw/`.
2. Leggi `wiki/index.md` (o `clients/<slug>/index.md` se è una fonte cliente) e apri solo le pagine pertinenti per evitare duplicati e rilevare contraddizioni.
3. Presenta il piano all'utente in questo formato:

```markdown
## Fonte Locale (`raw/`)
- **File:** `<raw_path>`
- **Utente detentore (`user`):** `<id>`
- **SHA-256 (12 char):** `<sha256>`
- **Destinazione:** `wiki/` (Zona Governata OKF) | `clients/<slug>/` (Zona Operativa AIOS)

## Takeaway principali
1. … (3-5 punti chiave)

## Creerei
| Path | Tipo | Perché |

## Modificherei
| Path | Cosa cambia in una riga |

## Contraddizioni rilevate
| Pagina | Afferma | La fonte afferma |
```

Poi **fermati e attendi approvazione esplicita**.

---

## FASE A.1 — Risincronizza prima di scrivere (`vault_sync`)

Subito dopo l'approvazione dell'utente e **prima** di scrivere qualsiasi file:
1. Chiama la tool MCP **`vault_sync`** (o `git pull --ff-only` se il server MCP non è attivo).
2. Se `result` è `DIVERGED`, `AHEAD` o `FAILED`, oppure se il pull ha modificato proprio le pagine che stavi per toccare (`R ∩ P ≠ ∅`), **fermati e avvisa l'utente**.

---

## FASE B — Scrittura con Provenienza

1. **Crea/aggiorna le pagine approvate**, aggiungendo sempre nel frontmatter YAML l'entry in `provenance:`:
   ```yaml
   provenance:
     - user: "<id>"
       raw_path: "<percorso-relativo-in-raw>"
       sha256: "<12-char-hash>"
       date: YYYY-MM-DD
   ```
   *(Se la pagina aveva già un array `provenance:`, appendi la nuova fonte senza rimuovere le precedenti).*
2. **NON cancellare e NON spostare il file in `raw/`**: deve rimanere esattamente dov'è sul disco locale dell'utente.
3. **Aggiorna gli indici e i log:**
   - Se `wiki/`: aggiorna `wiki/index.md` e appendi in cima a `wiki/log.md` (indicando anche `user` e `raw_path`).
   - Se `clients/<slug>/`: aggiorna `clients/<slug>/log.md`, `clients/log.md` e la data `updated` in `clients/index.md`.
4. Mostra l'elenco dei file toccati e ricorda all'utente di pubblicare con **`/pubblica`** (o `vault_publish`).
