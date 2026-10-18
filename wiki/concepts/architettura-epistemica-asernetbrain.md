---
title: "Architettura Epistemica e Operativa di AsernetBrain (DOE + Cognitos + OIDA + Cognitive Core + Baum)"
type: concept
epistemic_class: DECISION
status: reviewed
scope: "global"
authored_by: claude-ingest
reviewed_by: marco
created: 2026-10-18
updated: 2026-10-18
tags: [architettura, epistemologia, doe, cognitos, oida, cognitive-core, baum, governance]
---

# Architettura Epistemica e Operativa di AsernetBrain

**AsernetBrain** governa sia il **fare** (esecuzione, codice, automazioni) sia il **sapere e decidere** (conoscenza aziendale, diagnosi clienti, decisioni strategiche) riconoscendo che un sistema AI aziendale è diviso in due metà strutturalmente diverse:
1. **La Metà Deterministica (Esecuzione):** dove un errore del 10% a ogni passo diventa il 41% di fallimento su 5 passi (`0.9^5 = 0.59`).
2. **La Metà Probabilistica (Conoscenza e Giudizio):** dove il rischio non è un crash del codice, ma l'**"Apparenza di Sapere" (*Appearance of Knowing*, Baum 2026)** e l'**errore silenzioso (*silent error*, Cognitive Core 2026)** — cioè agire con sicurezza su un'ipotesi plausibile ma non verificata o su una decisione superata.

Per presidiare entrambe le metà, AsernetBrain unifica **5 framework complementari**:

```text
                        ┌──────────────────────────────────────────────┐
                        │                ASERNETBRAIN                  │
                        └──────────────────────┬───────────────────────┘
                                               │
                 ┌─────────────────────────────┴─────────────────────────────┐
                 ▼                                                           ▼
   ⚙️ METÀ DETERMINISTICA (Fare)                               🧠 METÀ PROBABILISTICA (Sapere & Decidere)
   ─────────────────────────────                               ──────────────────────────────────────────
   1. DOE Pattern (Direttiva/Orchestrazione/Esecuzione)        2. Baum (Anti-"Appearance of Knowing")
      + Self-Annealing (ogni errore aggiorna la SOP)           3. OIDA (Tipizzazione Epistemica, Scope,
      + Gate 9/10 HITL (Metodo 3C prima dello scheduling)         Supersessione e QUESTION a Decadimento Inverso)
                                                               4. Cognitive Core (Reflect: Established vs Assumed
                                                                  vs Missing + Coherence Flags)
                                                               5. Cognitos Sum (/challenge: Costituzione a 7 Principi,
                                                                  Red Team, Decostruzione Bias e Metacognizione)
```

---

## 1. Il Presidio contro "The Appearance of Knowing" (Baum, 2026)

Secondo Joel A. C. Baum (*The Appearance of Knowing: Why Epistemic Technologies Demand New Organization Theory*, 2026), l'IA generativa non abbassa il costo della vera cognizione, ma abbassa il costo dell'**apparenza di sapere**: produce proposizioni fluide e convincenti che circolano in azienda come fatti accertati prima che esista una verifica delle fonti o un responsabile umano (*accountability*).

**Come AsernetBrain neutralizza l'Apparenza di Sapere:**
- **Disaccoppiamento Autore/Revisore (`_meta/authors.md`):** nessuna pagina prodotta da un agente (`authored_by: claude-ingest`) può auto-validarsi (`reviewed_by` deve essere un umano registrato: `marco`, `raffaele`, `domenico`, `pasquale`, `anna`).
- **Provenienza Crittografica (`provenance`):** ogni sintesi punta al file grezzo in `raw/` tramite utente detentore, percorso e hash `sha256`.
- **Badge Epistemico Obbligatorio nelle risposte (`/chiedi`, `/client-brief`, `/asermind`):** Claude non risponde mai con prosa indistinta, ma dichiara sempre lo stato epistemico della risposta:
  - 🟢 **`[IN VIGORE · DECISION / FACT]`** — supportato da decisione approvata o fonte verificata.
  - 🟡 **`[IPOTESI / BOZZA · HYPOTHESIS / DRAFT]`** — tesi diagnostica o documento non ancora validato.
  - 🔴 **`[IGNORANZA MODELLATA · QUESTION]`** — evidenza insufficiente; attiva il meccanismo `QUESTION` di OIDA.

---

## 2. Tipizzazione Epistemica e Ignoranza Modellata (OIDA, 2026)

Ispirato a **OIDA** (*Retrieval Is Not Enough: Why Organizational AI Needs Epistemic Infrastructure*, Bottino et al., Torino 2026), AsernetBrain supera il semplice recupero semantico (QMD) tipizzando la conoscenza in **5 Classi Epistemiche (`epistemic_class`)**:

| Classe (`epistemic_class`) | Significato in AsernetBrain | Decadimento nel tempo | Dove vive |
|---|---|---|---|
| **`DECISION`** | Decisione vincolante approvata (`in_force` o `superseded`) | Stabile finché non sostituita (`supersedes`) | `wiki/`, `clients/<slug>/purpose.md` |
| **`SOP`** | Direttiva operativa standardizzata (Livello 1 DOE) | Evolve per *Self-Annealing* | `wiki/concepts/`, `actions/*/directive.md` |
| **`FACT`** | Fatto empirico, metrica o sintesi di fonte con `provenance` | Decadimento standard (richiede refresh) | `wiki/sources/`, `wiki/entities/`, `key-metrics.md` |
| **`HYPOTHESIS`** | Tesi diagnostica di `/asermind` da validare sul campo | Decadimento rapido se non testata | `clients/<slug>/purpose.md` |
| **`QUESTION`** | **Ignoranza Modellata**: domanda aperta / decisione mancante | **Decadimento Inverso (Urgenza Crescente!)** | `wiki/questions.md`, `clients/<slug>/purpose.md` |

### Metadati di Risoluzione dello Stato (State Resolution OIDA)
Ogni oggetto decisionale o regola in AsernetBrain porta tre proprietà computabili:
1. **`scope`**: dove si applica (es. `global`, `reparto:tecnico`, `client:acme-corp`). Una regola valida per un cliente non inquina gli altri.
2. **`supersedes`**: quale decisione o versione precedente sostituisce (tracciando la catena evolutiva senza cancellare la storia).
3. **`contradicts`**: eventuali conflitti aperti con altre fonti o reparti.

### Il Meccanismo `QUESTION` a Decadimento Inverso (*Inverse Decay*)
In tutte le organizzazioni i dubbi irrisolti vengono dimenticati nei thread. In AsernetBrain una **`QUESTION`** (ciò che sappiamo di *non* sapere) ha **decadimento inverso**:
$$\text{Gravità Epistemica} = \text{Giorni di apertura} \times \text{Peso strategico (1..3)}$$
Più giorni una `QUESTION` resta aperta senza essere trasformata in una `DECISION`, più sale in cima ai report di **`/prime`**, **`/client-brief`** e **`/lint`**.

---

## 3. Stato Epistemico a 3 Livelli e Coherence Flags (Cognitive Core, 2026)

Dal framework **Cognitive Core** (*Governed Reasoning for Institutional AI*, Diouf Seck, 2026), AsernetBrain adotta dentro **`/asermind`** e **`/challenge`** la separazione strutturale tra segnali meccanici, giudizio e coerenza per azzerare gli *errori silenziosi*:

### A. La Griglia Metacognitiva `Reflect`
Ogni diagnosi (`/asermind`) o verifica (`/challenge`) deve esplicitare 4 elementi:
1. **`established` (Stabilito):** ciò che è provato da fonti/dati citati nel vault.
2. **`assumed` (Assunto):** ciò che viene ipotizzato senza evidenza diretta.
3. **`evidence_missing` (Prove Mancanti):** i dati che mancano (ogni voce genera automaticamente una `QUESTION` OIDA!).
4. **`load_bearing_fact` (Fatto Portante):** il singolo pilastro fattuale su cui poggia tutta la raccomandazione; se si dimostra falso, la decisione cade.

### B. I Coherence Flags (Freno a mano automatico)
Prima di raccomandare un'azione, il sistema verifica 4 bandiere di coerenza:
- 🚩 `UNRESOLVED_EVIDENCE_GAPS`: si propone un'azione ma esistono `evidence_missing` critiche non risolte.
- 🚩 `UNWARRANTED_RECOMMENDATION`: la raccomandazione poggia su `assumed` anziché su `established`.
- 🚩 `SCOPE_MISMATCH`: si applica una regola/decisione fuori dal suo `scope` (es. da un cliente diverso).
- 🚩 `VERIFY_DELIBERATE_TENSION`: il Red Team (`/challenge`) ha trovato una vulnerabilità strutturale ma la proposta procede come se nulla fosse.

Se un flag critico è attivo, lo stato è **`warranted: false`** (Escalation obbligatoria al decisore umano).

---

## 4. Cognitos Sum (`/challenge`) — L'Agente Epistemologico Costituzionale

Presidia il momento del giudizio critico in AsernetBrain (`/challenge`). A differenza degli agenti operativi (che ottimizzano per *completare* un task), **Cognitos Sum** ottimizza per **rigore e falsificazione** (trovare i difetti di un'idea prima che li trovi il mercato):
- **Costituzione a 7 Principi:** Chiarezza Assoluta (dialogo socratico preliminare), Neutralità Radicale, Apertura Intellettuale, Rigore Evidenziale, Memoria Contestuale, Umiltà Epistemica, Evoluzione Metodologica.
- **Decostruzione delle Cornici Cognitive:** spiega il *meccanismo psicologico/organizzativo* per cui un bias rende convincente una tesi fragile.
- **Red Team Avversario + Pre-Mortem:** costruisce il contro-argomento più forte possibile e lo scenario concreto di fallimento a 6 mesi.
- **Metacognizione:** a fine analisi propone come migliorare il processo decisionale o la SOP (speculare al *Self-Annealing* di DOE).

### 4b. Devil's Advocate nei Processi (Stress-Test Continuo *Embedded*)
Mentre `/challenge` (**Cognitos Sum**) è il gate profondo on-demand per le decisioni strategiche, il **😈 Devil's Advocate di Processo** (*3 motivi specifici di fallimento/obiezione + contromisura pratica per ciascuno*) è **integrato nativamente dentro i 4 flussi operativi quotidiani**:
1. **Pre-Call (`/client-brief`):** anticipa le 2-3 obiezioni o domande più scomode che il cliente potrebbe fare in call e prepara la risposta fattuale.
2. **Post-Call (`/debrief`):** prima di salvare gli impegni presi, segnala colli di bottiglia nascosti, conflitti con `DECISION` attive o nuove `QUESTION` da aprire.
3. **Kickoff Progetto (`client-project-kickoff` / `/onboarding`):** isola 3 rischi specifici di slittamento del progetto e la contromisura preventiva.
4. **Costruzione Automazioni (`client-automation` DOE):** individua 3 casi reali di rottura in produzione e li codifica subito nello script e nella Direttiva.

---

## 5. DOE Pattern — Il Presidio della Metà Deterministica (`actions/` e `connectors/`)

Quando una decisione è validata e diventa un processo ripetibile, esce dalla metà probabilistica ed entra in **DOE (Direttiva / Orchestrazione / Esecuzione)**:
1. **Direttiva (`SOP` in Markdown):** definisce obiettivo, input, casi limite e regole.
2. **Orchestrazione (Claude):** legge la direttiva, prepara i parametri e gestisce le eccezioni.
3. **Esecuzione (Script Python deterministico):** esegue query, chiamate API e calcoli con errore zero.
4. **Self-Annealing + Gate 9/10 (Metodo 3C):** ogni errore aggiorna la Direttiva; nessuna automazione viene schedulata senza supervisione umana finché non raggiunge almeno **9 esecuzioni reali su 10 corrette**.
