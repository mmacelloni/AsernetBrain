---
name: aios-data
description: Costruisce il livello Dati (DataOS) di un AIOS aziendale. Fa discovery guidata delle sorgenti dati (Google Sheet, CSV, CRM, API), crea un database SQLite locale, script di connessione per sorgente e un refresh che rigenera un key-metrics.md autogenerato (letto dal comando /prime del livello Contesto). Aggiunge un comando /refresh-data on-demand e istruzioni per schedulare l'aggiornamento. Usa quando l'utente vuole collegare le metriche/dati della sua azienda all'AIOS, tracciare numeri chiave (fatturato, clienti, conversion rate), o dopo aver costruito il livello Contesto con aios-context.
argument-hint: "Nome azienda (opzionale)"
---

# AIOS — Livello 2: DataOS (per Cliente in AsernetBrain)

Colleghi a Claude i dati reali di un cliente in `clients/<slug>/`. Ogni volta che si interroga il cliente (o via `/prime`), Claude conosce lo stato attuale dei numeri in `clients/<slug>/key-metrics.md` e può interrogare il database SQLite locale `clients/<slug>/data/database.db`.

Questo è un **workshop di discovery guidato**, non un'installazione muta: intervista, suggerisci, presenta un piano, poi costruisci.

Leggi `references/discovery-guide.md` prima dell'intervista e `references/build-guide.md` prima di generare schema e script.

## Flusso

### 1. Prerequisiti (Zero-Friction)
- **Individua il cliente (`clients/<slug>/`).** Risolvilo da `$ARGUMENTS`, dalla conversazione o tramite `clients/index.md` / `qmd-asernet` (`-c asernet-clients`).
- **Contesto (Livello 1).** Verifica se esistono `clients/<slug>/index.md`, `state.md` e `purpose.md`. Se esistono, leggili: dicono quali metriche contano davvero per questo cliente. Se mancano, chiedi se procedere lo stesso o costruire prima il contesto con `aios-context`.
- **Python.** Verifica `python --version` (o `python3`).
- **Modalità update.** Se esiste già `clients/<slug>/data/database.db`, non ricostruire da zero: leggi lo schema esistente e chiedi cosa aggiungere/cambiare.

### 2. Discovery
Segui `references/discovery-guide.md`. Per ogni metrica che conta:
- chiedi **dove vive il dato** (Google Sheet, CSV, PerfexCRM, GA4, Meta Ads, gestionale, pagamenti…);
- scegli **caso per caso** l'approccio: import Sheet/CSV, inserimento manuale, oppure connettore API;
- copri il funnel: top / middle / bottom.

### 3. Piano
Prima di scrivere codice, presenta:
- l'elenco delle **sorgenti** e per ognuna l'approccio scelto;
- lo **schema del database** (`clients/<slug>/data/database.db`) derivato dalle metriche reali;
- i **file** che creerai in `clients/<slug>/`.
Ottieni conferma.

### 4. Costruzione in `clients/<slug>/`
Segui `references/build-guide.md`. Crea o aggiorna dentro `clients/<slug>/`:

```text
clients/<slug>/
├── key-metrics.md                # AUTOGENERATO da data/refresh.py (committato in Git)
├── connectors/
│   ├── config.yaml               # Registro sorgenti collegate (scope: lettura | scrittura)
│   └── <sorgente>.py             # Connettore Python per sorgente
└── data/
    ├── database.db               # SQLite locale (ignorato da Git via .gitignore)
    └── refresh.py                # Aggrega tutte le sorgenti → DB → rigenera ../key-metrics.md
```

- **Segreti** solo in `.env` (mai in file committati, né in `config.yaml` dove si indica solo il nome della variabile `env_prefix`).
- **`clients/<slug>/key-metrics.md`** è rigenerato da `clients/<slug>/data/refresh.py` a partire dal DB: contiene le metriche chiave in forma leggibile ed è versionato in Git così tutti i colleghi vedono i KPI aggiornati senza dover copiare il file `.db`.

### 5. Refresh e Verifica
- Esegui `python clients/<slug>/data/refresh.py` una volta e mostra il `clients/<slug>/key-metrics.md` risultante.
- Fai una query di esempio sul DB per dimostrare che Claude può interrogare i dati.
- Verifica che ogni sorgente collegata sia registrata in `clients/<slug>/connectors/config.yaml`.
- Appendi una riga a `clients/<slug>/log.md` e `clients/log.md`: `- YYYY-MM-DD · aios-data · Livello 2 Dati costruito (N sorgenti)`.
- Suggerisci `/pubblica` per condividere `key-metrics.md` e gli script con il team.

Contenuti generati per aziende italiane: **in italiano**.

## Feedback di processo

Se durante questo livello l'utente segnala che **una domanda o uno step è
superfluo, confuso o sbagliato** (attrito nell'uso di AIOS, non un fatto sul suo
business), **invoca la skill `aios-learn`**: registra la frizione in
`.claude/aios-feedback-prodotto.md` per la revisione del maintainer. `aios-learn`
classifica e chiede conferma prima di scrivere — non è una lezione di business e
non va in `lezioni.md`.
