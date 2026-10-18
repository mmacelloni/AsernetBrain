---
title: "Roadmap Automazioni Aziendali Condivise (Asernet)"
type: shared-actions-roadmap
epistemic_class: SOP
status: active
scope: global
updated: 2026-10-18
---

# 🏢 Roadmap Automazioni Aziendali Condivise (`actions/shared/`)

> Qui vivono le automazioni **trasversali al Vault Asernet** valide per tutti i colleghi, governate dal **[DOE Pattern](../../wiki/concepts/doe-pattern.md)** (*Direttiva / Orchestrazione / Esecuzione* + *Self-Annealing*).
> - Per automazioni **personali di un singolo utente** → usa `actions/users/<user_id>/`
> - Per automazioni **specifiche di un singolo cliente** → usa `clients/<slug>/actions/`

---

## 📊 Catalogo Automazioni Condivise (`actions/shared/`)

| ID | Nome Automazione | Direttiva (`.md`) | Script Deterministico | Livello (`L1..L4`) | Stato | KPI Ex-Post Verificato |
|---|---|---|---|---|---|---|
| `SHARED-01` | *Onboarding e verifica integrità cliente* | `onboarding-check.md` *(da creare)* | — | `L1` | `idea` | 100% clienti con frontmatter OIDA valido |
| `SHARED-02` | *Audit epistemico settimanale (`/lint`)* | `.claude/skills/lint/SKILL.md` | — | `L1` | `attiva` | Zero `DECISION` contraddittorie o `QUESTION` ad alta gravità ignorate |
