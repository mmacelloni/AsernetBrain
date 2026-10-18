# 📌 TODO — AsernetBrain (Stato di Avanzamento)

> Ultimo aggiornamento: **2026-10-18**

## ✅ Completato (Sessioni 2026-10-17 / 2026-10-18)
- [x] **Struttura base `AsernetBrain`** (`wiki/`, `topics/`, `clients/<slug>/`, `actions/{shared,users}`, `personal/`, `_meta/`).
- [x] **Gestione `raw/` locale con Provenienza**: esclusa da `.gitignore`, mai cancellata dopo `/ingest`, tracciata via `provenance: [{ user, raw_path, sha256, date }]`.
- [x] **Porting e unificazione AIOS (`v0.7.1`) + AsernetOS (`v1.3.0`)**: tutte le skill e i comandi allineati a `clients/<slug>/` e `actions/`.
- [x] **Zero-Friction Retrieval (stile FullBrain)**: rimossi i blocchi su `/prime` e `.claude/context/`; risoluzione automatica dei clienti da qualsiasi cartella tramite `clients/index.md` e `qmd-asernet`.
- [x] **Auto-Installer Locale per i Colleghi (`tools/setup.js`)**: registra `vault-asernet` (Git MCP) + `qmd-asernet` (QMD MCP locale `--index asernetbrain` con `INDEX_PATH` dedicato) e auto-aggiorna QMD su `vault_sync` e `vault_publish`.
- [x] **Angolino Riservato Personale (`personal/`)**: escluso da Git ma indicizzato dal QMD locale (`asernet-personal`) per i task ClickUp personali e gli appunti privati del singolo utente.
- [x] **Strategia Dati Clienti (`_meta/roadmap-evoluzioni.md`)**: Fase 1 con query ad hoc su BigQuery del cliente + `key-metrics.md`; Fase 2 pianificata per DB condiviso su piattaforma/VPS.
- [x] **1. Test Setup Locale (`tools/setup.js --user marco`)**: inizializzato l'indice QMD locale `asernetbrain` (4 collection + vettori GPU) e verificati i server MCP `vault-asernet` e `qmd-asernet`.
- [x] **2. Configurazione Repository Bare Git sulla VPS aziendale (`N8N Asernet`)**:
  - **Host / IP:** `152.228.134.98` (`PasswordAuthentication no`, accesso SSH solo con chiave)
  - **Admin VPS:** `ubuntu` (`asernet-admin`, chiave separata solo admin)
  - **Utente Git Colleghi:** `git` (`asernet-git`, confinato in `/usr/bin/git-shell` con 1 chiave nominativa per utente/macchina in `/home/git/.ssh/authorized_keys`)
  - **Percorso Bare Repo:** `git@152.228.134.98:/srv/git/asernetbrain.git`
  - **Convenzione Email Utenti (`_meta/authors.md`):** email aziendali nominative `@asernet.it` (`m.macelloni@asernet.it`, `r.tortora@asernet.it`, `d.palma@asernet.it`, `p.cipriani@asernet.it`, `a.angeloro@asernet.it`).

---

## 🔜 Prossimi Passi
- [ ] **3. Test Clone & Setup su Mac (`MacBook-Air.local`)**: clonare `git@152.228.134.98:/srv/git/asernetbrain.git` e lanciare `./setup-mac.command --user marco`.
- [ ] **4. Onboarding Primo Cliente Pilota in `clients/<slug>/`**: testare il flusso completo (`aios-context`, `datapyx`, query BigQuery ad hoc in `connectors/bigquery_queries.py`).
- [ ] **5. Connettore ClickUp Personale (`personal/connectors/clickup_personal.py`)**: creare lo script standard che popola `personal/tasks-clickup.md` per ciascun utente.
