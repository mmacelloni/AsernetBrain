# Log Wiki (`wiki/log.md`)

> Registro cronologico append-only. Nuove voci sempre in cima.

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
