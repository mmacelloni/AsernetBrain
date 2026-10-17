# 🧠 AsernetBrain — Company Brain & AI Operating System

**AsernetBrain** è il repository aziendale condiviso che unifica in un'unica architettura multi-utente:
1. **FullBrain** — struttura pulita multi-dominio (`wiki/`, `topics/`, `clients/`), Query Router QMD locale e recupero **Zero-Friction** (chiedi di qualsiasi cliente da qualsiasi cartella, anche senza lanciare `/prime`).
2. **AsernetOS (`v1.3.0`)** — server MCP Git sicuro (`vault-asernet` con controllo anti-sovrapposizione `L ∩ R`), registro identità (`_meta/authors.md`), provenance crittografica di `raw/` e governance OKF per la documentazione interna.
3. **AIOS-Datapyx (`v0.7.1`)** — i 5 livelli operativi per ogni cliente (ContextOS, DataOS, IntelOS, AutomationOS DOE, DashboardOS), diagnostica sistemica **DataPyx**, gate epistemologico `/challenge` (Cognitos) e motore di apprendimento continuo `aios-learn` (`/contribuisci`, `/rivedi-proposte`).

---

## 🚀 Setup Rapido per i Colleghi (1-Click)

Ogni collega clona il repository dalla VPS aziendale e lancia l'installer automatico per il proprio sistema operativo:

- **Windows:** doppio click su `setup-windows.bat` (oppure `node tools/setup.js --user <id>`)
- **macOS / Linux:** doppio click su `setup-mac.command` (oppure `node tools/setup.js --user <id>`)

Cosa fa `tools/setup.js` in automatico sulla macchina del collega:
1. Configura il merge driver Git locale (`merge.ours.driver = true`) e verifica l'identità in `_meta/authors.md`.
2. Controlla o installa `@tobilu/qmd` in locale e crea l'indice dedicato **`asernetbrain`** con 3 collection:
   - `asernet-wiki` (`wiki/`)
   - `asernet-clients` (`clients/`)
   - `asernet-topics` (`topics/`)
   - `asernet-personal` (`personal/`, riservato in locale al singolo utente)
3. Inizializza la cartella **`personal/`** (`personal/index.md` e `personal/tasks-clickup.md`), esclusa da Git ma indicizzata dal QMD locale.
4. Registra in **Claude Code** e **Claude Desktop** i due server MCP:
   - **`vault-asernet`** (`tools/vault-mcp/server.js`) → sincronizzazione Git sicura e trigger automatico di `qmd update` ad ogni pull/publish.
   - **`qmd-asernet`** (`qmd mcp --index asernetbrain`) → ricerca ibrida locale BM25 + vettoriale.

---

## 📂 Architettura delle Cartelle

```text
AsernetBrain/
├── CLAUDE.md                   # Costituzione globale + Query Router Zero-Friction
├── _meta/
│   └── authors.md              # Registro identità aziendali (marco, sara, anna) + agenti
├── raw/                        # [SOLO LOCALE, ignorata da Git] Fonti grezze mai cancellate
│   ├── wiki/                   # Documenti grezzi per la wiki
│   └── clients/<slug>/         # Documenti grezzi per cliente (tracciati via provenance)
├── wiki/                       # ZONA GOVERNATA (OKF) — Procedure, SOP, prodotti, partner
│   ├── index.md                # Catalogo centrale wiki
│   ├── log.md                  # Log cronologico append-only
│   ├── sources/                # Sintesi fonti con provenance (user + raw_path + sha256)
│   ├── entities/               # Prodotti, partner, organizzazioni
│   ├── concepts/               # Metodologie, SOP e processi aziendali
│   └── queries/                # Analisi archiviate
├── topics/                     # Domini tecnici verticali (networking, dev, AI, marketing)
├── clients/                    # ZONA OPERATIVA (AIOS) — Un cliente = una sottocartella
│   ├── CLAUDE.md               # Regole operative clienti
│   ├── index.md                # Catalogo globale clienti
│   ├── log.md                  # Log globale attività clienti
│   ├── _template/              # Template standard per onboarding nuovo cliente
│   └── <slug>/                 # Cartella isolata del singolo cliente
│       ├── index.md            # Contesto STABILE (identità, offerta, stack, brand, lezioni)
│       ├── state.md            # Contesto VOLATILE (priorità 30-90gg, stato, accordi)
│       ├── purpose.md          # Diagnosi DataPyx, punti di leva e verdetti /challenge
│       ├── key-metrics.md      # AUTOGENERATO da data/refresh.py (committato in Git)
│       ├── contacts.md         # Referenti e ruoli
│       ├── projects.md         # Progetti attivi e Roadmap Automazioni cliente
│       ├── log.md              # Riunioni (IntelOS), debrief e decisioni — append-only
│       ├── connectors/         # config.yaml + script Python per sistemi esterni del cliente
│       └── data/               # database.db SQLite (locale, ignorato da Git) + refresh.py
├── actions/                    # AutomationOS (DOE) — Azioni divise per scope
│   ├── README.md               # Regole DOE e Metodo 3C
│   ├── shared/                 # Automazioni condivise dal team (con gate 3C ≥ 9/10)
│   └── users/<id>/             # Automazioni personali per singolo collega (marco, sara, anna)
├── personal/                   # [SOLO LOCALE, ignorata da Git] L'angolino riservato dell'utente
│   ├── README.md               # Guida allo spazio privato e al collegamento ClickUp personale
│   ├── index.md                # [SOLO LOCALE] Cruscotto privato, obiettivi e note rapide
│   ├── tasks-clickup.md        # [SOLO LOCALE] I tuoi task personali sincronizzati da ClickUp
│   ├── notes/                  # [SOLO LOCALE] Appunti riservati e bozze
│   ├── connectors/             # [SOLO LOCALE] Connettore ClickUp / Calendario personale
│   └── data/                   # [SOLO LOCALE] personal.db SQLite + refresh_personal.py
└── tools/
    ├── setup.js                # Auto-installer locale (Git MCP + QMD MCP + personal/)
    └── vault-mcp/server.js     # Server MCP Git + auto-aggiornamento QMD
```

---

## ⚡ Comandi e Skill Principali

| Comando / Skill | Ambito | Cosa fa |
|---|---|---|
| *(Chat libera)* | Globale (Zero-Friction) | Chiedi di qualsiasi cliente, progetto o SOP da qualunque cartella senza bisogno di `/prime`: Claude risolve `clients/<slug>/` o `wiki/` via `qmd-asernet` e `index.md` |
| `/prime [cliente]` | Globale o Cliente | Sincronizza il repo (`vault_sync`), mostra lo stato generale o carica la scheda completa del cliente con le prospettive proattive |
| `/ingest <file>` | `raw/` → `wiki/` o `clients/` | Acquisisce un documento da `raw/`, lascia il file originale in locale sul PC dell'utente e scrive `provenance: [{ user, raw_path, sha256, date }]` |
| `/chiedi <domanda>` | `wiki/`, `clients/`, `topics/` | Ricerca ibrida su `qmd-asernet` con citazione delle fonti e soglia di astensione sulla Zona Governata |
| `aios` | `clients/<slug>/` | Orchestratore guidato dei 5 livelli AIOS (Contesto, Dati, Intelligence, Automazioni, Dashboard) per un cliente |
| `datapyx` | `clients/<slug>/purpose.md` | Assistente diagnostico sistemico (5 fasi) per analizzare la sfida reale del cliente, punti di leva e scenari |
| `/challenge` | `clients/<slug>/purpose.md` | Gate epistemologico (**Cognitos**): red-team di una diagnosi o decisione ad alto rischio prima di agire |
| `/client-brief <cliente>` | `clients/<slug>/` | Prepara in 5 minuti il brief pre-call (timeline, promesse vs consegne, pendenze, 3 punti d'agenda) |
| `/debrief [cliente]` | `clients/<slug>/` | Consolida a fine giornata avanzamenti, blocchi e decisioni in `state.md` e `log.md` |
| `/contribuisci` e `/rivedi-proposte` | `clients/<slug>/` | Raccolta contributi dal campo con contradiction-gate automatico e revisione del curatore (`aios-learn`) |
| `/lint` | Globale | Verifica integrità frontmatter, provenance `raw/`, identità `_meta/authors.md`, link morti e fusioni silenziose |
| `/pubblica` | Git (VPS) + QMD | Verifica assenza di conflitti (`L ∩ R`), committa, fa push sulla VPS e aggiorna l'indice QMD locale |
