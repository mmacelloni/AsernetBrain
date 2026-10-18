---
name: chiedi
description: Interroga AsernetBrain (wiki aziendale, domini tecnici, clienti o task personali) usando QMD (MCP qmd-asernet) con Risoluzione di Stato OIDA e Badge Epistemico anti-Appearance of Knowing (Baum). Distingue decisioni in vigore, ipotesi/bozze e ignoranza modellata (QUESTION).
argument-hint: "[la domanda]"
allowed-tools: Read, Glob, Grep, Bash, Edit
---

# Query Governata su AsernetBrain (`/chiedi` — OIDA + Baum State Resolution)

Domanda: `$ARGUMENTS`

## 1. Zero-Friction (Nessun blocco su `/prime`)
Non bloccare mai l'utente se non ha eseguito `/prime` in questa sessione:
- Se la domanda riguarda un **cliente**, risolvilo automaticamente tramite `qmd-asernet` (`-c asernet-clients`) e `clients/index.md`, caricando i file in `clients/<slug>/` (`index.md`, `state.md`, `purpose.md`, `key-metrics.md`, `log.md`).
- Se riguarda task personali, incrocia con `personal/tasks-clickup.md` e `personal/index.md`.

## 2. Procedura di Ricerca (Query Router QMD Locale + Risoluzione di Stato OIDA)

1. **Ricerca ibrida locale con QMD (`--index asernetbrain`):**
   - Usa il server MCP **`qmd-asernet`** scegliendo la collection più adatta (`asernet-clients`, `asernet-personal`, `asernet-wiki`, `asernet-topics`).
2. **Risoluzione Epistemica dello Stato (OIDA State Resolution):**
   - Quando apri le pagine candidate (massimo 6), **non trattare tutti i documenti come uguali**. Controlla per ciascuno:
     - **`epistemic_class` e `status`**: è una `DECISION` / `SOP` / `FACT` approvata (`status: reviewed` o `in_force`), oppure è solo una bozza (`draft`), un'ipotesi (`HYPOTHESIS`) o una decisione superata (`superseded`)?
     - **`scope`**: la decisione o procedura trovata si applica davvero all'ambito chiesto dall'utente (`global` vs `client:<slug>`)?
     - **`supersedes` / `contradicts`**: esiste una decisione più recente che ha sostituito quella trovata, o una contraddizione aperta?
   - Controlla anche `wiki/questions.md` (o la sezione `QUESTION` di `clients/<slug>/purpose.md`) per vedere se la domanda corrisponde a una **Questione Aperta (`QUESTION`)** già nota.

## 3. Regola Anti-"Appearance of Knowing" (Baum, 2026) e Soglia di Astensione

È severamente vietato produrre risposte fluide e apparentemente certe quando il vault non contiene una fonte validata o una decisione in vigore per quello specifico `scope`.
Ogni risposta **deve iniziare con uno dei 3 Badge Epistemici**:

- 🟢 **`[STATO: IN VIGORE · DECISION / FACT VALIDATO]`** → La risposta poggia su una decisione approvata (`in_force`) o una pagina `reviewed` con `provenance`. Specifica chi l'ha approvata/validata, a quale `scope` si applica ed eventuale `supersedes`.
- 🟡 **`[STATO: IPOTESI / BOZZA NON VALIDATA]`** → Nel vault esiste solo una pagina in `status: draft`, una proposta in attesa o una `HYPOTHESIS` di `/asermind` non ancora confermata. Riporta il contenuto avvisando chiaramente che **non è ancora una decisione in vigore**.
- 🔴 **`[STATO: EVIDENZA INSUFFICIENTE · QUESTION APERTA]`** → Il vault non copre la domanda per questo `scope` (oppure esistono fonti in contraddizione non risolta).
  - Dichiara esplicitamente: *"AsernetBrain non contiene ancora una decisione o fonte validata su questo punto."*
  - Mostra l'eventuale decisione più vicina spiegando perché non copre il caso (`SCOPE_MISMATCH`).
  - **Meccanismo OIDA `QUESTION`:** proponi subito all'utente:
    > *"Vuoi che registri questa lacuna come `QUESTION` a decadimento inverso in `wiki/questions.md` (o in `clients/<slug>/purpose.md`) assegnandola a `<owner>`?"*

*(Se aggiungi un suggerimento basato sulla tua conoscenza generale esterna al vault, racchiudilo in un box separato intitolato `💡 Conoscenza Generale Esterna (Non Governata da AsernetBrain)`).*

## 4. Formato della Risposta

```markdown
🟢/🟡/🔴 **[STATO: <IN VIGORE | IPOTESI/BOZZA | EVIDENZA INSUFFICIENTE>]** · **Ambito (`scope`):** `<scope>`

<risposta chiara e concisa, con [link](percorso.md) alle pagine da cui proviene ogni affermazione>

---
- **Decisione / Fonte applicata:** `<percorso.md>` (`epistemic_class`, approvata da `<reviewed_by>`, eventuale `supersedes`)
- **Provenienza `raw/`:** `<user>` · `<raw_path>` (`<sha256>`) *(se presente)*
- **Conflitti o Questioni Aperte (`QUESTION`):** Nessuno *(oppure ID della QUESTION attiva)*
```
