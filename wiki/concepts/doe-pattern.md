---
title: "DOE Pattern — Direttiva / Orchestrazione / Esecuzione e Self-Annealing"
type: concept
epistemic_class: SOP
status: reviewed
scope: "global"
authored_by: claude-ingest
reviewed_by: marco
created: 2026-10-18
updated: 2026-10-18
tags: [doe, automazione, architettura-agenti, self-annealing, metodo-3c]
---

# DOE Pattern — Direttiva / Orchestrazione / Esecuzione

Architettura a 3 livelli utilizzata in **AsernetBrain** (`actions/` e `clients/<slug>/connectors/`) per separare il ragionamento probabilistico dell'LLM dall'esecuzione deterministica del codice, affiancata dal ciclo di **Self-Annealing** e dal **Gate 9/10 HITL**.

---

## 1. Il Problema Matematico della Affidabilità Composta

Gli LLM sono probabilistici, mentre la logica operativa aziendale richiede coerenza deterministica. Se un LLM gestisce direttamente 5 passaggi operativi consecutivi con il 90% di accuratezza per singolo passo, l'affidabilità complessiva crolla al **59%** ($0.9^5 = 0.59$).

Per portare l'affidabilità oltre il 99%, **DOE** separa nettamente tre livelli:

```text
Livello 1: DIRETTIVA (Cosa fare)        →  SOP in Markdown (actions/.../directive.md)
                  ↓
Livello 2: ORCHESTRAZIONE (Decidere)    →  Claude come router intelligente e gestore eccezioni
                  ↓
Livello 3: ESECUZIONE (Fare)            →  Script Python deterministici (script.py + .env)
```

---

## 2. I 3 Livelli in AsernetBrain

### Livello 1 — Direttiva (`SOP`)
- Istruzioni strutturate in Markdown (`directive.md` o pagine `epistemic_class: SOP` in `wiki/concepts/`).
- Definiscono: **Obiettivo**, **Input richiesti**, **Script da invocare**, **Output atteso**, **Vincoli e Casi Limite noti**.

### Livello 2 — Orchestrazione
- Claude legge la Direttiva, verifica gli input, invoca lo script deterministico nell'ordine corretto e controlla l'output.
- Non improvvisa calcoli o trasformazioni dati a mente.

### Livello 3 — Esecuzione
- Script Python (`>= 3.12`) deterministici, testabili e idempotenti (`actions/shared/`, `actions/users/<id>/`, `clients/<slug>/data/refresh.py`).
- Credenziali e chiavi API lette esclusivamente da `.env` (mai hardcoded).

---

## 3. Self-Annealing (Auto-Riparazione Obbligatoria)

Ogni volta che un'automazione o uno script fallisce o incontra un caso limite non previsto:
1. **Diagnosi dell'errore** (input malformato, API cambiata, timeout, vincolo di business).
2. **Fix e Test** dello script Python (`Livello 3`).
3. **Aggiornamento Permanente della Direttiva (`Livello 1`):** il caso limite scoperto viene documentato nella sezione *Casi Limite / Lezioni Apprese* di `directive.md`.
4. Il sistema non commette mai due volte lo stesso errore.

---

## 4. Gate 9/10 HITL e Verifica Ex-Post (Innesto Metodo 3C)

1. **Atomicità del Task:** entra in roadmap (`projects.md` o `actions/`) solo un task atomico (1 input → 1 trasformazione → 1 output verificabile).
2. **Gate 9/10 prima dello Scheduling o della Condivisione (`actions/shared/`):**
   - Ogni nuova automazione nasce in modalità **Human-in-the-Loop (HITL)** nello spazio dell'autore (`actions/users/<id>/`).
   - Può essere schedulata in automatico (cron/N8N) o promossa in `actions/shared/` solo dopo **almeno 9 esecuzioni reali su 10 consecutive senza errori**.
3. **KPI Ex-Post:** ogni automazione traccia sia il *Valore Atteso* (tempo risparmiato stimato) sia il *Valore Verificato* dopo 30 giorni di utilizzo reale.
