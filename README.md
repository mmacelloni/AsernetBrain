# 🧠 AsernetBrain — Company Brain & AI Operating System

**AsernetBrain** è il repository aziendale condiviso di **Asernet S.r.l.** che unifica in un'unica architettura multi-utente:
1. **FullBrain** — struttura multi-dominio (`wiki/`, `topics/`, `clients/`), Query Router QMD locale e recupero **Zero-Friction** (interroga qualsiasi cliente, procedura o task personale da qualsiasi cartella, anche senza lanciare `/prime`).
2. **AsernetOS (`v1.3.0`)** — server MCP Git sicuro (`vault-asernet` con controllo anti-sovrapposizione `L ∩ R` e sync congiunto `main` + `personal/`), registro identità (`_meta/authors.md`), provenance crittografica di `raw/` e governance OKF per la documentazione interna.
3. **AIOS-Datapyx (`v0.7.1`)** — i 5 livelli operativi per ogni cliente (*ContextOS, DataOS, IntelOS, AutomationOS DOE, DashboardOS*), diagnostica sistemica **DataPyx**, gate epistemologico `/challenge` (**Cognitos**) e motore di apprendimento continuo `aios-learn` (`/contribuisci`, `/rivedi-proposte`).

---

## 👥 Registro Utenti Aziendali (`_meta/authors.md`)

Ogni membro del team è identificato dal proprio `<user_id>` e dalla propria email aziendale `@asernet.it`:

| `<user_id>` | Nome e Cognome | Email Git (`user.email`) | Spazio Azioni | Sub-Repo Privato su VPS |
|---|---|---|---|---|
| `marco` | Marco Macelloni | `m.macelloni@asernet.it` | `actions/users/marco/` | `/srv/git/personal/marco.git` |
| `raffaele` | Raffaele Tortora | `r.tortora@asernet.it` | `actions/users/raffaele/` | `/srv/git/personal/raffaele.git` |
| `domenico` | Domenico Palma Valente | `d.palma@asernet.it` | `actions/users/domenico/` | `/srv/git/personal/domenico.git` |
| `pasquale` | Pasquale Cipriani | `p.cipriani@asernet.it` | `actions/users/pasquale/` | `/srv/git/personal/pasquale.git` |
| `anna` | Anna Angeloro | `a.angeloro@asernet.it` | `actions/users/anna/` | `/srv/git/personal/anna.git` |

> **Sicurezza & Isolamento sulla VPS (`152.228.134.98`):**
> L'accesso Git avviene tramite l'utente `git` protetto da `asernet-git-shell` e `asernet-git-guard <user_id>`. Ogni collega può accedere **solo** al repository condiviso (`/srv/git/asernetbrain.git`) e al **proprio** sub-repository privato (`/srv/git/personal/<user_id>.git`). Nessun collega può leggere o clonare il sub-repository `personal/` di un altro utente.

---

## 🛠️ Istruzioni di Installazione (macOS, Windows, Linux)

### 1. Prerequisiti comuni
Assicurati di avere installati sulla tua macchina:
- **Git** (`>= 2.35`)
- **Node.js** (`>= 20 LTS`, con `npm`)
- **Claude Desktop** e/o **Claude Code CLI** (`npm install -g @anthropic-ai/claude-code`)
- *(Opzionale, per connettori DataOS / ClickUp)* **Python** (`>= 3.11`)

---

### 2. Configurazione Chiave SSH (Una Tantum per ogni computer)

L'accesso alla VPS aziendale (`152.228.134.98`) utilizza esclusivamente chiavi SSH `ed25519` (nessuna password).

#### 🍎 macOS e 🐧 Linux
Apri il Terminale ed esegui:
```bash
# 1. Genera la chiave SSH dedicata (premi Invio per lasciare passphrase vuota)
ssh-keygen -t ed25519 -C "tua.email@asernet.it" -f ~/.ssh/id_ed25519_asernetbrain -N ""

# 2. Configura ~/.ssh/config per usare automaticamente la chiave con la VPS
mkdir -p ~/.ssh && chmod 700 ~/.ssh
cat << 'EOF' >> ~/.ssh/config

Host asernet-git 152.228.134.98
    HostName 152.228.134.98
    User git
    IdentityFile ~/.ssh/id_ed25519_asernetbrain
    IdentitiesOnly yes
EOF
chmod 600 ~/.ssh/config

# 3. Mostra la tua chiave pubblica da inviare all'amministratore (Marco)
cat ~/.ssh/id_ed25519_asernetbrain.pub
```

#### 🪟 Windows (PowerShell)
Apri **PowerShell** ed esegui:
```powershell
# 1. Genera la chiave SSH dedicata
if (!(Test-Path "$HOME\.ssh")) { New-Item -ItemType Directory -Path "$HOME\.ssh" | Out-Null }
ssh-keygen -t ed25519 -C "tua.email@asernet.it" -f "$HOME\.ssh\id_ed25519_asernetbrain" -N '""'

# 2. Configura ~/.ssh/config
Add-Content -Path "$HOME\.ssh\config" -Value @"

Host asernet-git 152.228.134.98
    HostName 152.228.134.98
    User git
    IdentityFile ~/.ssh/id_ed25519_asernetbrain
    IdentitiesOnly yes
"@

# 3. Mostra la tua chiave pubblica (e copiala negli appunti)
Get-Content "$HOME\.ssh\id_ed25519_asernetbrain.pub" | Set-Clipboard
Get-Content "$HOME\.ssh\id_ed25519_asernetbrain.pub"
```

> 📌 **Nota per l'Amministratore (abilitazione chiave su VPS):**
> Una volta ricevuta la chiave pubblica `.pub` del collega (o di un tuo secondo dispositivo come il Mac), aggiungila su `asernet-admin` in `/home/git/.ssh/authorized_keys` preceduta da:
> ```text
> command="/usr/local/bin/asernet-git-guard <user_id>",no-port-forwarding,no-X11-forwarding,no-agent-forwarding,no-pty ssh-ed25519 AAAA... commento
> ```

---

### 3. Clonazione e Setup per Sistema Operativo

Sostituisci `<user_id>` con il tuo ID utente aziendale (`marco`, `raffaele`, `domenico`, `pasquale`, `anna`).

#### 🍎 Installazione su macOS

1. Apri il **Terminale** e verifica se hai Node.js e Git:
   ```bash
   node -v && git --version
   # Se non hai Node.js, installalo con Homebrew: brew install node git
   ```
2. Clona il repository (ad esempio sulla Scrivania o nella tua cartella di lavoro):
   ```bash
   cd ~/Desktop
   git clone git@152.228.134.98:/srv/git/asernetbrain.git AsernetBrain
   cd AsernetBrain
   ```
3. Esegui lo script di installazione automatica (da terminale oppure facendo doppio click su `setup-mac.command`):
   ```bash
   ./setup-mac.command --user <user_id>
   ```
   *(Esempio per Marco: `./setup-mac.command --user marco`)*

---

#### 🪟 Installazione su Windows

1. Apri **PowerShell** e verifica Node.js e Git:
   ```powershell
   node -v; git --version
   # Se mancanti: winget install OpenJS.NodeJS.LTS Git.Git
   ```
2. Clona il repository:
   ```powershell
   cd "$HOME\Desktop"
   git clone git@152.228.134.98:/srv/git/asernetbrain.git AsernetBrain
   cd AsernetBrain
   ```
3. Lancia il setup automatico passando il tuo `<user_id>`:
   ```powershell
   .\setup-windows.bat --user <user_id>
   ```
   *(Oppure fai doppio click su `setup-windows.bat` da Esplora File e inserisci il tuo `<user_id>` quando richiesto).*

---

#### 🐧 Installazione su Linux (Ubuntu / Debian / Fedora)

1. Installa i prerequisiti se non presenti:
   ```bash
   # Ubuntu / Debian
   sudo apt update && sudo apt install -y git nodejs npm python3 python3-venv
   ```
2. Clona il repository ed esegui l'installer:
   ```bash
   cd ~
   git clone git@152.228.134.98:/srv/git/asernetbrain.git AsernetBrain
   cd AsernetBrain
   node tools/setup.js --user <user_id>
   ```

---

### 4. Cosa fa automaticamente `tools/setup.js`

Durante l'esecuzione, l'installer configura l'intero ambiente senza interventi manuali:
1. **Identità Git & Hook Automatici:** imposta `user.name` e `user.email` dal registro `_meta/authors.md`, attiva il merge driver per i log append-only (`merge.ours.driver = true`) e abilita gli hook `.githooks/post-merge` e `.githooks/pre-push`.
2. **Sub-Repository Privato (`personal/`):** clona automaticamente `git@152.228.134.98:/srv/git/personal/<user_id>.git` dentro `personal/` (o vi collega la cartella locale se già esistente) e la sincronizza con la VPS.
3. **Motore di Ricerca QMD (`@tobilu/qmd`):** installa/verifica QMD e costruisce l'indice SQLite isolato (`~/.cache/qmd/asernetbrain.sqlite`) con 4 collection:
   - `asernet-wiki` (`wiki/`)
   - `asernet-clients` (`clients/`)
   - `asernet-topics` (`topics/`)
   - `asernet-personal` (`personal/`, indicizzato solo sul tuo computer)
4. **Server MCP per Claude Desktop e Claude Code:** registra automaticamente:
   - **`vault-asernet`** (`tools/vault-mcp/server.js`) → sincronizzazione Git sicura (`main` + `personal/`) e aggiornamento automatico di QMD.
   - **`qmd-asernet`** → ricerca ibrida locale BM25 + vettoriale.

> 🔄 **Al termine del setup**, riavvia **Claude Desktop** (o apri una nuova sessione `claude` da terminale) per caricare i server MCP.

---

## 📖 Guida all'Uso Quotidiano

### 1. Le 3 Zone di AsernetBrain

```text
AsernetBrain/
├── wiki/                       # 🏛️ ZONA GOVERNATA (OKF) — Procedure, SOP, prodotti, partner aziendali
│   ├── index.md                # Catalogo centrale della Wiki
│   ├── log.md                  # Log cronologico (append-only)
│   ├── sources/                # Sintesi delle fonti acquisite con provenance crittografica
│   ├── entities/               # Prodotti, fornitori, partner, tecnologie
│   ├── concepts/               # Metodologie, SOP e processi interni Asernet
│   └── queries/                # Analisi strutturate archiviate
├── topics/                     # 📚 DOMINI TECNICI — Networking, Sviluppo, AI, Marketing
├── clients/                    # 🚀 ZONA OPERATIVA (AIOS + DataPyx) — 1 cartella per ogni cliente
│   ├── index.md                # Catalogo globale clienti attivi e prospect
│   ├── log.md                  # Registro globale attività clienti
│   ├── _template/              # Template standard per l'onboarding di un nuovo cliente
│   └── <slug>/                 # Cartella del singolo cliente (es. clients/acme-corp/)
│       ├── index.md            # Contesto STABILE (chi è, offerta, stack, tono di voce, lezioni)
│       ├── state.md            # Contesto VOLATILE (priorità 30-90gg, stato attuale, accordi)
│       ├── purpose.md          # Diagnosi sistemica DataPyx, punti di leva e verdetti /challenge
│       ├── key-metrics.md      # KPI autogenerati da data/refresh.py (committato in Git)
│       ├── contacts.md         # Referenti del cliente e ruoli decisionali
│       ├── projects.md         # Progetti attivi e Roadmap Automazioni
│       ├── log.md              # Verbali riunioni (IntelOS), debrief e decisioni (append-only)
│       ├── connectors/         # Script e config per sorgenti esterne del cliente
│       └── data/               # database.db SQLite (solo locale) + refresh.py
├── actions/                    # ⚙️ AUTOMATION OS (DOE)
│   ├── shared/                 # Automazioni condivise dal team (certificate con Metodo 3C ≥ 9/10)
│   └── users/<user_id>/        # Automazioni personali del singolo collega
├── personal/                   # 🔒 SPAZIO PRIVATO UTente (Sub-repo Git personale isolato)
│   ├── index.md                # Cruscotto privato, obiettivi personali e promemoria
│   ├── tasks-clickup.md        # I tuoi task personali sincronizzati da ClickUp
│   ├── notes/                  # Appunti riservati, bozze e riflessioni personali
│   └── connectors/             # Connettori personali (es. ClickUp API personale)
└── raw/                        # 📥 FONTI GREZZE LOCALI (Mai caricate in Git, tracciate via SHA-256)
    ├── wiki/                   # PDF, contratti, slide o doc per la Wiki aziendale
    └── clients/<slug>/         # Materiali grezzi forniti dal cliente
```

---

### 2. Recupero Zero-Friction (Come fare domande a Claude)

Non è necessario ricordarsi in quale sottocartella ci si trova o lanciare comandi speciali per fare una domanda:
- **Domande su un cliente:** *"Quali sono le priorità attuali di `<cliente>` e cosa abbiamo deciso nell'ultima call?"* → Claude risolve automaticamente `clients/<slug>/index.md`, `state.md` e `log.md`.
- **Domande su procedure aziendali:** *"Qual è la procedura standard Asernet per il deploy di un centralino o di un workflow N8N?"* → Claude interroga `qmd-asernet` sulla collection `asernet-wiki` e `asernet-topics`, citando i file sorgente.
- **Domande sui tuoi task personali:** *"Quali sono le mie priorità di oggi su ClickUp e i miei appunti privati?"* → Claude legge `personal/index.md`, `personal/tasks-clickup.md` e cerca nella collection `asernet-personal`.

---

### 3. Sincronizzazione e Merge Automatico (`main` + `personal/`)

In AsernetBrain **ogni operazione di sincronizzazione mantiene allineati contemporaneamente**:
1. Il **repository aziendale condiviso** (`origin/main` → `/srv/git/asernetbrain.git`)
2. Il **tuo sub-repository privato** (`personal/` → `/srv/git/personal/<user_id>.git`)

Questo significa che:
- Quando passi dal **PC Windows** al **Mac** (o viceversa), ritrovi automaticamente sia gli aggiornamenti dei colleghi su `wiki/` e `clients/`, sia tutte le tue note e task privati dentro `personal/`.
- **Da Claude (consigliato):**
  - Digita `/prime` all'inizio del lavoro (esegue `vault_sync`: fa fetch + merge di `main`, fetch + merge di `personal/` e aggiorna l'indice QMD).
  - Digita `/pubblica` quando hai finito una modifica (esegue `vault_publish`: controlla che non ci siano conflitti con i colleghi sul repo principale, committa e fa push sia di `main` sia del tuo `personal/`).
- **Da Terminale (`git pull` / `git push`):**
  - Gli hook automatici in `.githooks/post-merge` e `.githooks/pre-push` (attivati da `setup.js`) eseguono automaticamente il merge e il push anche del sub-repository `personal/` ogni volta che fai `git pull` o `git push` nella cartella principale.

---

### 4. Flusso Operativo Quotidiano Consigliato

#### ☀️ 1. Inizio Giornata (`/prime`)
Apri Claude nella cartella `AsernetBrain` e scrivi:
```text
/prime
```
Claude sincronizzerà il repository condiviso e il tuo spazio `personal/`, mostrerà le ultime modifiche dei colleghi, lo stato dei clienti attivi e le tue priorità personali.
Per entrare in focus su un singolo cliente:
```text
/prime <nome-cliente>
```

#### 📞 2. Prima di una Call con un Cliente (`/client-brief`)
5 minuti prima di una riunione, scrivi:
```text
/client-brief <nome-cliente>
```
Claude genererà una scheda sintetica con:
- Ultimi contatti avuti (chi del team ha parlato con il cliente e quando)
- Promesse fatte vs consegne effettuate
- Problemi aperti o metriche critiche (`key-metrics.md`)
- 3 punti d'agenda consigliati per la call

#### 📝 3. Dopo una Riunione o a Fine Giornata (`/debrief`)
Incolla gli appunti o la trascrizione della call (oppure racconta a voce/testo cosa è stato deciso) e scrivi:
```text
/debrief <nome-cliente>
```
Claude estrarrà decisioni, nuovi task, scadenze e cambi di priorità, aggiornando `clients/<slug>/state.md` e aggiungendo una voce cronologica in `clients/<slug>/log.md` con il tuo `author: <user_id>`.

#### 📥 4. Acquisire un Documento Grezzo (`/ingest`)
Quando ricevi un PDF, preventivo, documento tecnico o trascrizione:
1. Salva il file originale in `raw/wiki/` (se è conoscenza interna aziendale) oppure in `raw/clients/<slug>/` (se riguarda un cliente).
2. Scrivi a Claude:
   ```text
   /ingest raw/clients/<slug>/<nome-file>
   ```
3. Il file pesante **resta in locale sul tuo PC** (non appesantisce Git), mentre Claude crea/aggiorna la scheda markdown strutturata in `wiki/` o `clients/<slug>/` registrando nel frontmatter la **provenance crittografica**:
   ```yaml
   provenance:
     - user: marco
       raw_path: raw/clients/acme/contratto-2026.pdf
       sha256: "..."
       date: "2026-10-18"
   ```
   In questo modo qualsiasi collega sa esattamente chi possiede il file originale e quale versione è stata sintetizzata.

#### 🧭 5. Diagnosi Strategica e Decisioni Critiche (`datapyx` e `/challenge`)
- Quando un cliente presenta un problema complesso o richiede una consulenza strategica, avvia **`datapyx`** per guidare la diagnosi sistemica in 5 fasi e salvarla in `clients/<slug>/purpose.md`.
- Prima di proporre o eseguire una decisione ad alto impatto (architetturale, commerciale o organizzativa), lancia **`/challenge`**: l'agente **Cognitos** eseguirà un red-team rigoroso delle ipotesi per scovare punti ciechi prima di procedere.

#### 📤 6. Condividere il Lavoro con il Team (`/pubblica`)
Quando hai concluso gli aggiornamenti:
```text
/pubblica
```
Il sistema verificherà il formato dei file, eseguirà il merge sicuro con eventuali modifiche pubblicate nel frattempo dai colleghi, farà il push su `origin/main` + `personal/` e riallineerà l'indice di ricerca QMD.

---

## ⚡ Tabella Riepilogativa di Tutti i Comandi

| Comando / Skill | Ambito | Descrizione |
|---|---|---|
| *(Domanda libera)* | Globale (Zero-Friction) | Chiedi di qualsiasi cliente, SOP o task personale da qualunque cartella: Claude risolve automaticamente `clients/<slug>/`, `wiki/`, `topics/` o `personal/`. |
| `/prime [cliente]` | Globale o Cliente | Sincronizza `main` + `personal/` (`vault_sync`), riepiloga le novità del team o carica il dossier completo del cliente. |
| `/client-brief <cliente>` | `clients/<slug>/` | Prepara in 5 minuti il brief pre-call (storico, promesse vs consegne, pendenze, 3 punti d'agenda). |
| `/debrief [cliente]` | `clients/<slug>/` | Consolida a fine riunione o fine giornata avanzamenti, blocchi e decisioni in `state.md` e `log.md`. |
| `/ingest <percorso-raw>` | `raw/` → `wiki/` o `clients/` | Sintetizza un file grezzo da `raw/`, lascia il file originale sul PC locale e registra la firma `provenance` (`user`, `raw_path`, `sha256`, `date`). |
| `/chiedi <domanda>` | `wiki/`, `clients/`, `topics/` | Ricerca ibrida profonda su `qmd-asernet` con citazione rigorosa delle fonti e astensione in assenza di evidenze nella Zona Governata. |
| `aios` | `clients/<slug>/` | Orchestratore guidato dei 5 livelli AIOS (*ContextOS, DataOS, IntelOS, AutomationOS, DashboardOS*) per costruire o evolvere il sistema di un cliente. |
| `datapyx` | `clients/<slug>/purpose.md` | Assistente diagnostico sistemico (5 fasi) per individuare la sfida radice del cliente, i vincoli e i punti di leva. |
| `/challenge` | `clients/<slug>/purpose.md` | Gate epistemologico (**Cognitos**): stress-test e red-team di una diagnosi o decisione ad alto rischio prima di agire. |
| `/contribuisci` | `clients/<slug>/` | Registra un'osservazione o lezione appresa dal campo con controllo automatico delle contraddizioni (`aios-learn`). |
| `/rivedi-proposte` | `clients/<slug>/` | Permette al curatore dell'account di approvare o integrare i contributi proposti dal team. |
| `/lint` | Globale | Verifica l'integrità dei frontmatter YAML, la provenance `raw/`, le identità in `_meta/authors.md` e i link interni. |
| `/pubblica` | Git (VPS) + QMD | Verifica l'assenza di conflitti (`L ∩ R`), committa, fa push di `main` e `personal/` sulla VPS e aggiorna l'indice QMD locale. |

---

## 🔧 Risoluzione dei Problemi (Troubleshooting)

1. **`Permission denied (publickey)` durante `git clone` o `/pubblica`:**
   - Verifica che il file `~/.ssh/id_ed25519_asernetbrain` esista sul computer in uso e che la chiave pubblica `.pub` sia stata aggiunta dall'amministratore su `152.228.134.98` in `/home/git/.ssh/authorized_keys` con il tuo `<user_id>`.
   - Testa la connessione eseguendo: `ssh git@152.228.134.98` (se la chiave è attiva, il server risponderà con il messaggio di `asernet-git-guard` anziché `Permission denied`).
2. **I server MCP (`vault-asernet` o `qmd-asernet`) non compaiono in Claude:**
   - Riesegui `node tools/setup.js --user <tuo_id>` nella cartella `AsernetBrain` e riavvia completamente Claude Desktop.
3. **Ricostruire da zero l'indice di ricerca QMD locale:**
   - Esegui `node tools/setup.js --user <tuo_id>`: lo script aggiornerà le collection e rigenererà gli embedding vettoriali mancanti.
