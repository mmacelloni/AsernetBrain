# 🔒 `personal/` — L'Angolino Riservato dell'Utente

Questa cartella è lo **spazio privato e strettamente personale** del singolo utente sulla propria macchina locale.

## Come funziona l'isolamento ("Privato in Git, Unificato in Locale")

1. **Escluso da Git (`.gitignore`):**
   - Tutti i file dentro `personal/` (ad eccezione di questo `README.md`) sono **ignorati da Git**.
   - Nulla di ciò che salvi o sincronizzi qui (i tuoi task personali di ClickUp, la tua agenda, i tuoi appunti privati, le tue bozze) sale mai sul repository Git della VPS aziendale né viene visto dagli altri colleghi.
2. **Indicizzato dal tuo QMD Locale (`asernet-personal`):**
   - Poiché il motore di ricerca `qmd-asernet` gira in locale sul tuo PC, indicizza anche `personal/` nella collection **`asernet-personal`**.
   - Quando fai una domanda a Claude o lanci `/prime`, Claude incrocia **in automatico** le informazioni aziendali condivise (`clients/`, `wiki/`, `topics/`) con il tuo angolino personale (`personal/`).
   - *Esempio:* se chiedi *"Cosa devo fare oggi per il cliente X?"*, Claude legge sia la scheda condivisa `clients/<slug>/state.md` (visibile a tutti) sia i tuoi task personali in `personal/tasks-clickup.md` (visibili solo a te).

---

## Struttura Creata in Automatico da `setup.js` sul tuo PC

Quando lanci `setup-windows.bat` o `setup-mac.command`, lo script inizializza in locale (senza mai committarli):

```text
personal/
├── README.md                 # Questo file (unico tracciato in Git)
├── index.md                  # [SOLO LOCALE] Il tuo cruscotto privato, obiettivi e preferenze
├── tasks-clickup.md          # [SOLO LOCALE] Task personali sincronizzati dal tuo ClickUp
├── notes/                    # [SOLO LOCALE] Appunti privati, bozze, promemoria personali
├── connectors/
│   ├── config.yaml           # [SOLO LOCALE] Configurazione tuo ClickUp / Google Calendar personale
│   └── clickup_personal.py   # [SOLO LOCALE] Script che scarica i tuoi task da ClickUp in personal.db
└── data/
    ├── personal.db           # [SOLO LOCALE] SQLite personale (task ClickUp, scadenze personali)
    └── refresh_personal.py   # [SOLO LOCALE] Rigenera personal/tasks-clickup.md dal tuo DB locale
```

---

## Collegare il proprio ClickUp Personale

1. Inserisci nel file `.env` (anch'esso solo locale) la tua chiave API personale ClickUp:
   ```ini
   CLICKUP_PERSONAL_API_KEY=pk_...
   CLICKUP_PERSONAL_USER_ID=...
   ```
2. Usa la skill `aios-data` o `aios-automation` chiedendo: *"Configura il mio connettore ClickUp personale in `personal/`"*.
3. Lo script `personal/data/refresh_personal.py` aggiornerà `personal/tasks-clickup.md` associando, quando presente nel nome/lista/tag del task, lo `<slug>` del cliente aziendale (`clients/<slug>/`), così Claude collegherà al volo i tuoi task personali ai clienti del Brain aziendale!
