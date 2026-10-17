---
name: aios-intel
description: Costruisce il livello Intelligence (IntelOS) di un AIOS aziendale. Fa discovery del tool di registrazione meeting (Fireflies, Fathom, Zoom, Google Meet...), ne verifica le API cercandone la documentazione, e crea uno script che raccoglie i transcript delle riunioni in una tabella meetings del database SQLite (lo stesso di DataOS). Auto-classifica i meeting, li rende interrogabili in chat e aggiunge i comandi /collect-meetings e /catchup. Usa quando l'utente vuole portare le riunioni/comunicazioni nell'AIOS, ritrovare decisioni prese nei meeting, o dopo aver costruito i livelli Contesto e Dati.
argument-hint: "Nome azienda (opzionale)"
---

# AIOS — Livello 3: IntelOS (Meeting & Call per Cliente in AsernetBrain)

Porti i transcript delle riunioni dentro `clients/<slug>/`, sia in una tabella SQLite interrogabile (`clients/<slug>/data/database.db`) sia come sintesi strutturate in `clients/<slug>/log.md`. Claude può così ritrovare decisioni prese, action items e con chi hai parlato da qualsiasi cartella del brain.

Leggi `references/discovery-guide.md` prima dell'intervista e `references/build-guide.md` prima di costruire.

## Flusso

### 1. Prerequisiti (Zero-Friction)
- **Individua il cliente (`clients/<slug>/`).** Risolvilo da `$ARGUMENTS`, dalla conversazione o tramite `clients/index.md` / `qmd-asernet` (`-c asernet-clients`).
- **Python.** Verifica `python --version`.
- **Database.** IntelOS usa `clients/<slug>/data/database.db` di DataOS. Se non esiste, crealo tu. Se esiste già la tabella `meetings`, opera in modalità update.
- **Contesto.** Leggi `clients/<slug>/index.md` e `clients/<slug>/contacts.md` per conoscere team e referenti: aiuta la classificazione e le sintesi.

### 2. Discovery + ricerca API
Segui `references/discovery-guide.md`:
- chiedi **quale tool** usa per registrare i meeting (Fireflies, Fathom, Zoom, Google Meet, trascrizioni salvate in `raw/clients/<slug>/`…);
- **cerca la documentazione API** di quel tool (WebSearch/WebFetch) se si usa un connettore automatico;
- chiedi la **frequenza di raccolta**.

### 3. Piano
Prima di scrivere codice presenta: tool scelto, schema della tabella `meetings` in `clients/<slug>/data/database.db`, file da creare in `clients/<slug>/connectors/meetings.py`, e cosa serve in `.env`. Ottieni conferma.

### 4. Costruzione in `clients/<slug>/`
Segui `references/build-guide.md`. Crea:

```text
clients/<slug>/
├── connectors/
│   ├── config.yaml               # Registra il connettore meeting (scope: lettura)
│   └── meetings.py               # Scarica i transcript nel DB e aggiorna log.md
├── data/
│   └── database.db               # Tabella meetings (git-ignorato)
└── log.md                        # Sintesi riunioni, decisioni e action items (committato in Git)
```

- **Tabella `meetings`**: id, sorgente, titolo, data, ora inizio, durata, partecipanti (con email), transcript, riassunto, action items, url, e campo **classificazione**.
- **Sincronizzazione con il team (`log.md`)**: poiché `database.db` è locale, ogni meeting significativo importato o riassunto scrive anche una voce sintetica (data, partecipanti, decisioni, action items) in `clients/<slug>/log.md`, così è subito indicizzato da QMD (`asernet-clients`) e visibile a tutti i colleghi!
- **Segreti** solo in `.env`.

### 5. Verifica e chiusura
- Esegui una raccolta e mostra i meeting entrati nel DB e in `clients/<slug>/log.md`.
- Fai una **query di prova** (es. "elenca in ordine di priorità le decisioni dell'ultimo meeting").
- Verifica che la sorgente collegata sia registrata in `clients/<slug>/connectors/config.yaml`.
- Suggerisci `/pubblica` per condividere il log aggiornato con il team.

Contenuti generati per aziende italiane: **in italiano**.

## Feedback di processo

Se durante questo livello l'utente segnala che **una domanda o uno step è
superfluo, confuso o sbagliato** (attrito nell'uso di AIOS, non un fatto sul suo
business), **invoca la skill `aios-learn`**: registra la frizione in
`.claude/aios-feedback-prodotto.md` per la revisione del maintainer. `aios-learn`
classifica e chiede conferma prima di scrivere — non è una lezione di business e
non va in `lezioni.md`.
