---
title: "Diagnosi, Questioni Aperte e Decisioni (Purpose) — Nome Azienda Cliente"
type: client-purpose
epistemic_class: DECISION
scope: "client:_template"
client: _template
updated: 2026-10-18
---

# 🧠 Diagnosi AserMind, Questioni OIDA & Decision Lineage (`purpose.md`)

> Questo file è l'infrastruttura epistemica del cliente:
> 1. **`QUESTION` (OIDA — Decadimento Inverso):** ciò che sappiamo di *non* sapere sul cliente. Più giorni resta aperta, più sale di urgenza (`gravità = giorni_aperti × peso`).
> 2. **`HYPOTHESIS` (AserMind + Cognitive Core `Reflect`):** diagnosi sistemiche con distinzione esplicita tra `established` (fatti provati), `assumed` (ipotesi), `evidence_missing` (prove mancanti) e `load_bearing_fact` (fatto portante).
> 3. **`DECISION` (Decision Registry + Verdetti `/challenge`):** decisioni approvate in vigore (`in_force`). Quando una decisione cambia, la precedente non si cancella: viene marcata `> ⚠️ Superata il YYYY-MM-DD da [ID-DECISION]`.

---

## ❓ 1. Questioni Aperte (`QUESTION` — Ignoranza Modellata a Decadimento Inverso)

| ID | Aperta il | Peso (1-3) | Domanda / Evidenza Mancante (`evidence_missing`) | Owner | Stato (`open` / `resolved`) |
|---|---|---|---|---|---|
| `Q-001` | YYYY-MM-DD | 2 | *(Esempio: Qual è il margine netto per linea di prodotto?)* | `marco` | `open` |

---

## 🧭 2. Tesi in Evoluzione (`HYPOTHESIS` — Diagnosi `/asermind` + Griglia Cognitive Core)

### [YYYY-MM-DD] Tesi Diagnostica Atto 1
- **Problema Reale Diagnosticato:** 
- **Punti di Leva:** 
- **Griglia Epistemica (Cognitive Core `Reflect`):**
  - **Stabilito dalle fonti (`established`):** 
  - **Assunto senza prove (`assumed`):** 
  - **Evidenze mancanti (`evidence_missing` → generano `QUESTION` sopra):** 
  - **Fatto portante (`load_bearing_fact`):** 
- **Coherence Flags attivi:** `NESSUNO` *(oppure `UNRESOLVED_EVIDENCE_GAPS`, `UNWARRANTED_RECOMMENDATION`, ecc.)*

---

## 🏛️ 3. Registro Decisioni Governate (`DECISION` & Verdetti `/challenge`)

### [DEC-001] YYYY-MM-DD — Titolo Decisione
- **Stato:** `in_force` *(oppure `superseded by DEC-00X`)*
- **Ambito (`scope`):** `client:<slug>`
- **Approvata da:** `<id-utente>`
- **Verdetto Cognitos (`/challenge`):** 🟢 Regge / 🟡 Da rinforzare / 🔴 Da rivedere
- **Sostituisce (`supersedes`):** —
- **Decisione e Razionale:** 
