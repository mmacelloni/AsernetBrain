---
title: "Roadmap Automazioni DOE — Nome Azienda Cliente"
type: client-actions-roadmap
epistemic_class: SOP
status: active
scope: "client:_template"
updated: 2026-10-18
---

# ⚙️ Roadmap Automazioni DOE — Nome Azienda Cliente

> Tutte le automazioni specifiche di questo cliente seguono il **[DOE Pattern](../../../wiki/concepts/doe-pattern.md)** (*Direttiva / Orchestrazione / Esecuzione* + *Self-Annealing*) e il **Gate 9/10 HITL (*Metodo 3C*)**.
> - **Direttive (SOP)**: in `clients/<slug>/actions/<nome-azione>.md`
> - **Script Deterministici**: in `clients/<slug>/actions/<nome-azione>.py` (o `.js`)
> - **Connettori Dati (Livello 2)**: in `clients/<slug>/connectors/`

---

## 📊 Mappa Automazioni del Cliente

| ID | Nome Automazione | Livello Autonomia (`1..4`) | Stato (`idea` · `attiva` · `schedulata`) | Gate 9/10 HITL | KPI di Valore Verificato (Ex-Post) | Ultimo Self-Annealing |
|---|---|---|---|---|---|---|
| `ACT-01` | *Esempio: Digest settimanale KPI e anomalie* | `L1` (On-Demand) | `idea` | Bozza report approvata dall'account prima dell'invio | Tempo risparmiato / errori evitati | — |

---

## 🛠️ Criterio di Atomicità & Regole Operative
1. **Un processo alla volta**: non schedulare mai un'automazione (`L2`/`L3`) finché non ha girato almeno 3 volte on-demand (`L1`) senza errori.
2. **Gate 9/10 HITL**: qualsiasi invio al cliente o scrittura sul CRM del cliente si ferma al 90% per la conferma umana (a meno di deroga esplicita in `connectors/config.yaml`).
3. **Self-Annealing**: ogni errore di esecuzione aggiorna sia lo script sia la direttiva Markdown corrispondente in `clients/<slug>/actions/`.
