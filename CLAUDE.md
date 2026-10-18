# AsernetBrain — Sistema Operativo Aziendale Condiviso

Questo file governa **AsernetBrain**, il brain aziendale multi-utente che unisce:
- la struttura multi-dominio e la disciplina Git di **FullBrain**;
- il connettore MCP Git (`vault-mcp`), il registro identità e la verifica di **AsernetOS**;
- i moduli operativi di **AIOS-AserMind** (ContextOS, DataOS, IntelOS, AutomationOS DOE, DashboardOS, AserMind).

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
│       ├── purpose.md          # Diagnosi AserMind, obiettivi, tesi in evoluzione e /challenge
│       ├── key-metrics.md      # AUTOGENERATO da DataOS (refresh.py) — non editare a mano
│       ├── contacts.md         # Persone e ruoli
│       ├── projects.md         # Progetti attivi, storici e roadmap automazioni cliente
│       ├── log.md              # Riunioni (IntelOS), debrief, decisioni — append-only
│       ├── connectors/         # Script Python di connessione ai sistemi dati del cliente
│       └── data/               # SQLite locale (database.db, ignorato da git) + refresh.py
├── actions/                    # AutomationOS (DOE) — Azioni per-utente e condivise
│   ├── shared/                 # Automazioni aziendali condivise (roadmap.md + script DOE)
│   └── users/<slug-utente>/    # Azioni personali di ciascun utente aziendale
├── personal/                   # ZONA RISERVATA LOCALE (ignorata da Git, indicizzata in QMD locale)
│   ├── index.md                # Cruscotto privato dell'utente (solo sul suo PC)
│   ├── tasks-clickup.md        # Task personali dal ClickUp dell'utente (solo sul suo PC)
│   ├── notes/                  # Appunti privati, bozze, promemoria
│   ├── connectors/             # Connettori personali (es. ClickUp personale, calendario)
│   └── data/                   # personal.db SQLite + refresh_personal.py
└── tools/
    ├── setup.js                # Installer automatico locale (Git MCP + QMD MCP + personal/)
    └── vault-mcp/              # Server MCP per Claude Desktop (Git + routing)
```

---

## 2. Governance a Doppio Binario, Provenienza (`raw/`) e Spazio Riservato (`personal/`)

1. **Regola della Provenienza (`raw/` locale + puntatore utente/cartella):**
   - A differenza di FullBrain (che cancella `raw/`) e di AsernetOS v1 (che committava `raw/` in Git appesantendo il repo), in **AsernetBrain** la cartella `raw/` è **esclusa da Git** (`.gitignore`) e **NON viene cancellata** dopo l'ingest.
   - I file originali restano sul disco locale dell'utente che ha eseguito l'ingest (organizzati in `raw/wiki/...` o `raw/clients/<slug>/...`).
   - Ogni pagina creata o aggiornata da una fonte in `raw/` registra obbligatoriamente nel frontmatter (e/o nel log) chi ha il file e dove si trova:
     ```yaml
     provenance:
       - user: "marco"
         raw_path: "raw/clients/acme/brief-2026-10.pdf"
         sha256: "a1b2c3d4e5f6"
         date: 2026-10-17
     ```
2. **Zona Governata (`wiki/`, `topics/`, `_meta/`) — Regime OKF:**
   - Ogni pagina ha frontmatter con `authored_by`, `reviewed_by` (confrontati con `_meta/authors.md`) e `provenance`.
   - L'agente non può validare sé stesso (`authored_by` ≠ `reviewed_by`).
   - Soglia di astensione: se il wiki non copre una procedura interna, lo si dichiara senza inventare.
3. **Zona Operativa (`clients/`, `actions/`) — Regime AIOS:**
   - Pensata per la velocità operativa quotidiana (`/prime`, `/debrief`, `/asermind`, `/challenge`, `/refresh-data`).
   - Nessun blocco `reviewed_by` obbligatorio per aggiornare stato, debrief o metriche di un cliente, ma quando si acquisisce un documento in `raw/clients/<slug>/` si traccia sempre il blocco `provenance` (`user` + `raw_path`).
   - Separazione netta tra **contesto stabile** (`index.md`) e **contesto volatile** (`state.md` + `key-metrics.md`).
4. **Zona Riservata Personale (`personal/`) — "Privata in Git, Unificata in Locale":**
   - Ogni utente ha il proprio angolino privato in `personal/` (`personal/tasks-clickup.md`, `personal/index.md`, `personal/notes/`, `personal/data/personal.db`).
   - Tutto il contenuto di `personal/` (eccetto `personal/README.md`) è **escluso da Git** (`.gitignore`): non sale mai sulla VPS e non è mai visibile agli altri colleghi.
   - È però indicizzato dal QMD locale del singolo utente nella collection **`asernet-personal`**: quando l'utente lavora sul proprio PC, Claude incrocia automaticamente i suoi task personali (es. ClickUp personale) con le schede aziendali condivise (`clients/<slug>/` e `wiki/`).

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
  - Nessuna chiave API o credenziale dei clienti o personali va mai scritta nei file markdown o committata: vive solo in `.env` (escluso da `.gitignore`).
  - I file SQLite (`*.db`) vivono in locale e sono esclusi dal repository Git per mantenere il repo leggerissimo.

---

## 4. Risoluzione Proattiva e Query Router (Zero-Friction, stile FullBrain)

> **Regola fondamentale:** L'utente **NON è mai obbligato** a lanciare `/prime` né a spostarsi con `cd` dentro `clients/<slug>/` prima di fare una domanda o invocare un comando su un cliente, sui propri task personali, su un dominio tecnico o su una procedura aziendale.

### 4.1 Auto-Risoluzione del Cliente + Angolino Personale da qualsiasi cartella
Quando l'utente nomina un cliente o chiede cosa deve fare (in chat libera o in comandi come `/client-brief`, `/debrief`, `/challenge`, `/contribuisci`, `/rivedi-proposte`, `aios`, `asermind`), anche se si trova nella radice di `AsernetBrain` e **non ha eseguito `/prime`**:
1. **Individua lo `<slug>` del cliente** cercando in `clients/index.md` oppure interrogando il server MCP locale `qmd-asernet` (`-c asernet-clients`).
2. **Carica al volo il contesto condiviso del cliente** da `clients/<slug>/` (`index.md`, `state.md`, `purpose.md`, `key-metrics.md`, `log.md`).
3. **Incrocia con l'Angolino Personale (`personal/`)** se la richiesta tocca task, scadenze o appunti dell'utente (leggendo `personal/tasks-clickup.md`, `personal/index.md` o interrogando `-c asernet-personal`).
4. **Non bloccare mai l'utente** chiedendo di eseguire `/prime` o cercando la vecchia cartella single-tenant `.claude/context/`.

### 4.2 Query Router Automatico (QMD Locale `--index asernetbrain`)
Ogni volta che l'utente pone una domanda su clienti, task personali, procedure aziendali o tecnologia, classifica la richiesta e interroga proattivamente `qmd-asernet` (o via CLI `qmd --index asernetbrain query ...`):

| Tipo di richiesta | Strategia QMD | Collection (`-c`) | Fallback / Letture dirette |
|---|---|---|---|
| Domanda su un cliente, progetto, stato, call, metriche | `lex` + `vec` | `-c asernet-clients` | `clients/index.md` → `clients/<slug>/{index.md,state.md,purpose.md,key-metrics.md}` |
| Task personali dell'utente (ClickUp personale, agenda, note private) | `lex` + `vec` | `-c asernet-personal` | `personal/tasks-clickup.md`, `personal/index.md`, `personal/notes/` |
| Procedura interna, SOP, prodotto, partner | `lex` o `vec` | `-c asernet-wiki` | `wiki/index.md` → `wiki/concepts/`, `wiki/entities/`, `wiki/sources/` |
| Dominio tecnico verticale (networking, dev, AI, marketing) | `vec` | `-c asernet-topics` | `topics/index.md` → `topics/<dominio>/` |
| Domanda combinata ("cosa devo fare oggi per il cliente X?") | `lex` + `vec` | *(nessun flag `-c`: cerca in tutto, incluso `asernet-personal`)* | `clients/<slug>/state.md` + `personal/tasks-clickup.md` |


