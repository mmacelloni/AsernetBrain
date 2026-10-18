# Log Wiki (`wiki/log.md`)

> Registro cronologico append-only. Nuove voci sempre in cima.

---

## [2026-10-18] feature | marco | Architettura Epistemica & Operativa a 6 Pilastri (DOE + Cognitos Sum + Devil's Advocate + OIDA + Cognitive Core + Baum)
**Operazione:** Integrazione sistemica della governance epistemica e operativa su tutto `AsernetBrain`:
1. **DOE Pattern (`wiki/concepts/doe-pattern.md`)** — Separazione tra Direttiva (Markdown), Orchestrazione (LLM) ed Esecuzione deterministica (`actions/`, `connectors/`) con ciclo *Self-Annealing* e Gate 9/10 HITL (*Metodo 3C*).
2. **Cognitos Sum (`wiki/concepts/cognitos-sum-agente-epistemologico.md` & `/challenge`)** — I 7 Principi Costituzionali, decostruzione della cornice (*Bias Check*), *Red Team* + *Pre-Mortem* e *Metacognizione* per la metà probabilistica dei giudizi.
3. **😈 Devil's Advocate nei Processi** — Integrato nativamente nei workflow operativi (`/client-brief`, `/debrief`, `client-project-kickoff`, `client-automation`) con 3 punti di rottura/obiezioni e contromisura operativa per ciascuno.
4. **OIDA (`arxiv:2604.11759`)** — Tipizzazione in 5 classi epistemiche (`DECISION`, `SOP`, `FACT`, `HYPOTHESIS`, `QUESTION`), `scope` (`global` vs `client:<slug>`), relazioni `supersedes`/`contradicts` e registro dell'ignoranza modellata (`wiki/questions.md`) con **Inverse Decay** (*Gravità Epistemica* crescente nel tempo).
5. **Cognitive Core (`arxiv:2604.10658`)** — Griglia `Reflect` a 4 campi (`established`, `assumed`, `evidence_missing`, `load_bearing_fact`), `Coherence Flags` automatici e gate `warranted` in `/chiedi`, `/challenge`, `/prime` e `asermind`.
6. **Baum (2026, *The Appearance of Knowing*)** — Badge Epistemici obbligatori (`🟢 IN VIGORE`, `🟡 IPOTESI/BOZZA`, `🔴 EVIDENZA INSUFFICIENTE · QUESTION`) per impedire che la fluenza linguistica mascheri l'assenza di verifiche organizzative.

---

## [2026-10-17] init | marco | Creazione e allineamento architettura AsernetBrain (v0.1.0)
**Operazione:** Fusione di **FullBrain**, **AsernetOS (`v1.3.0`)** e **AserMind (`v0.7.1`)** nel nuovo repository `AsernetBrain`.
**Componenti completati:**
- Struttura multi-dominio (`wiki/`, `topics/`, `clients/<slug>/`, `actions/{shared,users/<id>}`, `personal/`, `_meta/`).
- `raw/` locale esclusa da Git e mai cancellata dopo l'ingest, con tracciamento `provenance: [{ user, raw_path, sha256, date }]`.
- Auto-installer locale per i colleghi (`tools/setup.js`, `setup-windows.bat`, `setup-mac.command`) per registrare `vault-asernet` (Git MCP) + `qmd-asernet` (`qmd mcp --index asernetbrain` con 4 collection: `asernet-wiki`, `asernet-clients`, `asernet-topics`, `asernet-personal`).
- Risoluzione proattiva Zero-Friction stile FullBrain in `CLAUDE.md` e in tutte le skill/comandi (nessun obbligo di `/prime` o `.claude/context/`).
- Spazio riservato per utente in `personal/` (escluso da Git, indicizzato in locale su QMD `asernet-personal`) per task ClickUp personali e note private.
- Roadmap evolutiva in `_meta/roadmap-evoluzioni.md` (Fase 1: query ad hoc su BigQuery cliente; Fase 2: DB condiviso su piattaforma/VPS).
