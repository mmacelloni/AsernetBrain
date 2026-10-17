---
name: chiedi
description: Interroga AsernetBrain (wiki aziendale, domini tecnici o clienti) usando il motore di ricerca ibrido locale QMD (MCP qmd-asernet) e gli index.md. Risponde citando le pagine con provenienza, oppure dichiara esplicitamente che il vault non copre l'argomento invece di improvvisare.
argument-hint: "[la domanda]"
allowed-tools: Read, Glob, Grep, Bash
---

# Query su AsernetBrain (`/chiedi`)

Domanda: `$ARGUMENTS`

## 1. Precondizione di Sincronizzazione
Assicurati che il vault sia stato sincronizzato in questa sessione (`/prime` o `vault_sync`). Su un vault non sincronizzato rischieresti di dichiarare scoperto un argomento che un collega ha già documentato.

## 2. Procedura di Ricerca (QMD Locale + Index)

1. **Ricerca ibrida locale con QMD (`--index asernetbrain`):**
   - Usa gli strumenti del server MCP **`qmd-asernet`** (oppure via CLI `qmd --index asernetbrain query "<domanda>" --json -n 8`) scegliendo la collection più adatta:
     - `asernet-wiki` → procedure aziendali, SOP, prodotti, concetti (`wiki/`)
     - `asernet-clients` → schede clienti, stato, diagnosi DataPyx, storico (`clients/`)
     - `asernet-topics` → domini tecnici verticali (`topics/`)
     - *(nessun filtro `-c` per domande trasversali)*
2. **Fallback strutturale:**
   - Se lo score di QMD è basso (`< 0.3`) o per navigazione panoramica, leggi `wiki/index.md` e `clients/index.md`.
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
