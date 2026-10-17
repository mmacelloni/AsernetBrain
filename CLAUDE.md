# AsernetBrain — Sistema Operativo Aziendale Condiviso

Questo file governa **AsernetBrain**, il brain aziendale multi-utente che unisce:
- la struttura multi-dominio e la disciplina Git di **FullBrain**;
- il connettore MCP Git (`vault-mcp`), il registro identità e la verifica di **AsernetOS**;
- i moduli operativi di **AIOS-Datapyx** (ContextOS, DataOS, IntelOS, AutomationOS DOE, DashboardOS, DataPyx).

---

## 1. Struttura del Repository

```text
AsernetBrain/
├── CLAUDE.md                   # Costituzione e regole operative globali
├── _meta/
│   └── authors.md              # Registro utenti aziendali e permessi/ruoli
├── raw/                        # Inbox fonti grezze (immutabili in lettura)
│   └── clients/<slug>/         # Documenti grezzi specifici per cliente
├── wiki/                       # ZONA GOVERNATA (OKF) — Knowledge Base aziendale
│   ├── index.md                # Catalogo centrale wiki
│   ├── log.md                  # Log cronologico append-only
│   ├── sources/                # Fonti acquisite
│   ├── entities/               # Prodotti, partner, organizzazioni
│   ├── concepts/               # Metodologie, procedure e SOP aziendali
│   └── queries/                # Analisi e risposte archiviate
├── topics/                     # Conoscenze verticali tecniche (networking, dev, marketing)
├── clients/                    # ZONA OPERATIVA (AIOS) — Un'azienda = una sottocartella
│   ├── CLAUDE.md               # Schema operativo clienti + DataOS/IntelOS per cliente
│   ├── index.md                # Catalogo globale clienti (con routing ID)
│   ├── log.md                  # Log globale attività clienti
│   └── <slug-cliente>/         # Cartella isolata del singolo cliente
│       ├── index.md            # Contesto STABILE (identità, storia, stack, brand)
│       ├── state.md            # Contesto VOLATILE (priorità attuali, accordi, stato)
│       ├── purpose.md          # Diagnosi DataPyx, obiettivi, tesi in evoluzione e /challenge
│       ├── key-metrics.md      # AUTOGENERATO da DataOS (refresh.py) — non editare a mano
│       ├── contacts.md         # Persone e ruoli
│       ├── projects.md         # Progetti attivi, storici e roadmap automazioni cliente
│       ├── log.md              # Riunioni (IntelOS), debrief, decisioni — append-only
│       ├── connectors/         # Script Python di connessione ai sistemi dati del cliente
│       └── data/               # SQLite locale (database.db, ignorato da git) + refresh.py
├── actions/                    # AutomationOS (DOE) — Azioni per-utente e condivise
│   ├── shared/                 # Automazioni aziendali condivise (roadmap.md + script DOE)
│   └── users/<slug-utente>/    # Azioni personali di ciascun utente aziendale
└── tools/
    └── vault-mcp/              # Server MCP per Claude Desktop (Git + routing)
```

---

## 2. Governance a Doppio Binario

1. **Zona Governata (`wiki/`, `topics/`, `_meta/`) — Regime OKF:**
   - Ogni pagina ha frontmatter con `authored_by` e `reviewed_by` (confrontati con `_meta/authors.md`).
   - L'agente non può validare sé stesso (`authored_by` ≠ `reviewed_by`).
   - Soglia di astensione: se il wiki non copre una procedura interna, lo si dichiara senza inventare.
2. **Zona Operativa (`clients/`, `actions/`) — Regime AIOS:**
   - Pensata per la velocità operativa quotidiana (`/prime`, `/debrief`, `/datapyx`, `/challenge`, `/refresh-data`).
   - Nessun blocco `reviewed_by` obbligatorio per aggiornare stato, debrief o metriche di un cliente.
   - Separazione netta tra **contesto stabile** (`index.md`) e **contesto volatile** (`state.md` + `key-metrics.md`).

---

## 3. Disciplina Multi-Utente e Git (Claude Code & Claude Desktop via MCP)

- **Inizio sessione (`SessionStart` / `/prime`):**
  1. Identifica l'utente attivo (da configurazione locale o `_meta/authors.md`).
  2. Esegue sempre `git pull --ff-only` (direttamente o tramite `vault-mcp`).
  3. Se il pull fallisce per history divergente: **fermarsi e segnalare immediatamente**. Vietati `push --force`, `reset --hard` o `rebase` ciechi.
- **Fine operazione / sessione (`/commit` o `/pubblica`):**
  1. `git status` per verificare i file toccati.
  2. Commit con formato: `YYYY-MM-DD | <utente> | <ambito> | <titolo>` e `git push`.
- **Segreti e Database:**
  - Nessuna chiave API o credenziale dei clienti va mai scritta nei file markdown o committata: vive solo in `.env` (globale o locale al cliente, escluso da `.gitignore`).
  - I file SQLite (`*.db`) vivono in locale o sulla VPS e sono esclusi dal repository Git per mantenere il repo leggerissimo.
