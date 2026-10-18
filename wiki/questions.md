---
title: "Registro Questioni Aperte — Ignoranza Modellata (OIDA QUESTION)"
type: registry
epistemic_class: QUESTION
updated: 2026-10-18
---

# ❓ Registro Questioni Aperte (`QUESTION` — Ignoranza Modellata OIDA)

> **Principio del Decadimento Inverso (OIDA):**
> A differenza dei normali documenti (che perdono rilevanza col tempo), **ciò che l'organizzazione sa di *non* sapere (`QUESTION`) acquista urgenza ogni giorno che passa senza risposta**.
> - **Gravità Epistemica** = $\text{Giorni di apertura} \times \text{Peso (1=Normale, 2=Alto, 3=Critico)}$.
> - I comandi **`/prime`**, **`/client-brief`** e **`/lint`** calcolano la gravità e mostrano in cima le `QUESTION` con punteggio più alto finché non vengono risolte e trasformate in una **`DECISION`**.

## Come ciclo di vita di una `QUESTION`
1. **Apertura (`status: open`):** nasce quando `/chiedi` rileva evidenza insufficiente, oppure quando `/asermind` o `/challenge` (Cognitive Core) rilevano `evidence_missing` / contraddizioni tra reparti.
2. **Risoluzione (`status: resolved`):** quando il referente umano prende la decisione o fornisce la fonte mancante, la `QUESTION` viene chiusa indicando `resolved_by_decision:` (link alla pagina o sezione `DECISION`).

---

## 🔴 Questioni Aperte Aziendali (`scope: global` / `wiki/`)

| ID | Aperta il | Peso (1-3) | Ambito (`scope`) | Domanda / Lacuna Epistemica (`QUESTION`) | Owner / Chi può rispondere | Stato |
|---|---|---|---|---|---|---|
| `Q-WIKI-001` | 2026-10-18 | 2 | `global` | Qual è il primo cliente pilota su cui validare l'intero flusso `/onboarding` → `/asermind` → `/challenge`? | `marco` | `open` |

---

## ✅ Questioni Risolte (Storico → Trasformate in `DECISION`)

| ID | Aperta il | Risolta il | Domanda | Risolta da (`DECISION`) |
|---|---|---|---|---|
| `Q-WIKI-000` | 2026-10-18 | 2026-10-18 | Come tipizzare e governare la conoscenza organizzativa in AsernetBrain evitando l'*Appearance of Knowing*? | [[architettura-epistemica-asernetbrain]] (`marco`) |
