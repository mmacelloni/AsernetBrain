# Clients — Schema Operativo (FullBrain + AIOS)

Ogni cliente vive in una propria sottocartella isolata `clients/<slug>/` che unisce la scheda anagrafica/storica di FullBrain con i moduli operativi di AIOS (DataOS, IntelOS, AserMind).

---

## 1. Struttura della Cartella Cliente (`clients/<slug>/`)

```text
clients/<slug>/
├── index.md            # Contesto STABILE: chi è, settore, stack, contatti chiave, brand
├── state.md            # Contesto VOLATILE: priorità attuali, problemi aperti, accordi (aggiornato da /debrief)
├── purpose.md          # Diagnosi /asermind, tesi in evoluzione, verdetti /challenge (con supersessione)
├── key-metrics.md      # AUTOGENERATO da data/refresh.py (/refresh-data) — mai modificare a mano
├── contacts.md         # Rubrica persone e ruoli del cliente
├── projects.md         # Progetti attivi/storici + roadmap automazioni specifiche del cliente
├── log.md              # Storico cronologico append-only (riunioni IntelOS, chiamate, decisioni)
├── connectors/         # Connettori Python verso i sistemi esterni DEL CLIENTE (CRM, ERP, Sheet, GA4...)
│   └── config.yaml     # Mappa delle sorgenti dati del cliente (senza segreti!)
└── data/               # (Git-ignored per i .db)
    ├── database.db     # SQLite locale del cliente (metriche + transcript meeting IntelOS)
    └── refresh.py      # Script che interroga connectors/, aggiorna database.db e rigenera key-metrics.md
```

---

## 2. Connessione ai Sistemi Dati Esterni per Cliente

Ogni cliente ha sistemi esterni diversi (es. Shopify, PerfexCRM, Fatture in Cloud, Google Sheets, Meta Ads, DB MySQL).
Per evitare conflitti e non esporre mai credenziali nel repository Git:

1. **Configurazione dichiarativa (`clients/<slug>/connectors/config.yaml`):**
   - Versionata in Git. Descrive *quali* sorgenti dati ha quel cliente, quali tabelle aggiornano e con quale frequenza.
2. **Script Connettori (`clients/<slug>/connectors/<sorgente>.py`):**
   - Versionati in Git (pattern DOE: logica deterministica in Python, auto-correggibile).
3. **Credenziali e Segreti (`.env`):**
   - Le chiavi API del cliente vivono in `clients/<slug>/.env` (oppure nel gestore credenziali della VPS / n8n) con prefisso cliente, **tassativamente escluse da Git** tramite `.gitignore`.
4. **Dati grezzi vs Metriche sintetizzate:**
   - Il database `clients/<slug>/data/database.db` (che può crescere con migliaia di righe e transcript) **resta fuori da Git** (generato localmente o interrogato sulla VPS).
   - Il file `clients/<slug>/key-metrics.md` (pochi KB di sintesi leggibile da Claude a inizio sessione) **è versionato in Git**, così tutto il team autorizzato vede i numeri aggiornati del cliente senza dover scaricare il DB o avere le API key sul proprio PC!
