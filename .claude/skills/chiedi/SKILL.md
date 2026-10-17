---
name: chiedi
description: Interroga AsernetBrain (wiki aziendale, domini tecnici o clienti) usando il motore di ricerca ibrido locale QMD (MCP qmd-asernet) e gli index.md. Risponde citando le pagine con provenienza, oppure dichiara esplicitamente che il vault non copre l'argomento invece di improvvisare.
argument-hint: "[la domanda]"
allowed-tools: Read, Glob, Grep, Bash
---

# Query su AsernetBrain (`/chiedi`)

Domanda: `$ARGUMENTS`

## 1. Zero-Friction (Nessun blocco su `/prime`)
Non bloccare mai l'utente se non ha eseguito `/prime` in questa sessione:
- Se necessario e disponibile, esegui un rapido `vault_sync` (o `git pull --ff-only` silenzioso) in autonomia, oppure procedi direttamente alla ricerca locale.
- Se la domanda riguarda un **cliente**, risolvilo automaticamente tramite `qmd-asernet` (`-c asernet-clients`) e `clients/index.md`, caricando direttamente i file in `clients/<slug>/` (`index.md`, `state.md`, `purpose.md`, `key-metrics.md`, `log.md`).

## 2. Procedura di Ricerca (Query Router QMD Locale + Index)

1. **Ricerca ibrida locale con QMD (`--index asernetbrain`):**
   - Usa gli strumenti del server MCP **`qmd-asernet`** (oppure via CLI `qmd --index asernetbrain query "<domanda>" --json -n 8`) scegliendo la collection più adatta:
     - `asernet-clients` → schede clienti, stato, diagnosi DataPyx, contatti, progetti, storico (`clients/`)
     - `asernet-personal` → task ClickUp personali dell'utente, scadenze e note private (`personal/`, solo locale)
     - `asernet-wiki` → procedure aziendali, SOP, prodotti, concetti (`wiki/`)
     - `asernet-topics` → domini tecnici verticali (`topics/`)
     - *(nessun filtro `-c` per domande trasversali o che uniscono stato aziendale + task personali)*
2. **Fallback strutturale:**
   - Se lo score di QMD è basso (`< 0.3`) o per navigazione panoramica, leggi `clients/index.md`, `personal/tasks-clickup.md`, `wiki/index.md` o `topics/index.md`.
3. **Lettura mirata:**
   - Apri **solo** le pagine rilevanti (massimo 6 pagine; se la domanda è troppo ampia, chiedi di restringerla).

## 3. Soglia di astensione (regola non derogabile per la Zona Governata `wiki/`)

Prima di scrivere la risposta su procedure o documentazione aziendale, poniti questa domanda: *l'affermazione centrale della mia risposta è scritta in una pagina che ho aperto, oppure la sto costruendo io mettendo insieme frammenti debolmente pertinenti?*

Nel secondo caso la risposta corretta è:
> AsernetBrain non contiene ancora una risposta documentata a questa domanda.

seguita da cosa manca e quale fonte servirebbe per colmarlo. Se aggiungi una risposta basata sulla tua conoscenza generale, mettila in un blocco **separato e chiaramente marcato come esterno al vault**.

## 4. Formato della risposta

```markdown
<risposta chiara e concisa, con [link](percorso.md) alle pagine da cui proviene ogni affermazione>

---
**Fonti nel vault:** <elenco pagine aperte + eventuale `provenance.user` se il documento grezzo è in `raw/`>
**Confidenza:** alta | media | bassa — <perché>
```
