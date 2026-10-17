---
description: "Avvio sessione AsernetBrain: sincronizza Git (pull --ff-only via vault_sync), identifica l'utente attivo, carica le sue Actions personali e il contesto del cliente (clients/<slug>/) o della wiki aziendale."
argument-hint: "[opzionale: slug del cliente, es. shopincasa]"
---

# Avvio Sessione — `/prime` (AsernetBrain)

Target richiesto: **$ARGUMENTS**

Rispondi sempre in italiano. Esegui questi passi in ordine all'inizio della sessione:

## 1. Sincronizzazione Git obbligatoria (`pull --ff-only`)
- Se è disponibile la tool MCP **`vault_sync`**, chiamala subito.
- Altrimenti esegui `git pull --ff-only`.
- Se il pull segnala `DIVERGED`, `AHEAD` o un conflitto bloccante: **fermati subito**, mostralo all'utente e chiedi di chiudere prima con `/pubblica`. Non fare mai merge o rebase automatici.

## 2. Identificazione Utente e Actions Personali
1. Leggi `git config user.email` e confrontala con `_meta/authors.md` per ricavare l'`id` dell'utente attivo (`marco`, `sara`, `anna`). Se non impostata, chiedi all'utente chi è.
2. Controlla `actions/users/<id>/roadmap.md` e `actions/shared/roadmap.md` (se esistono) per sapere quali azioni/automazioni personali e condivise ha a disposizione l'utente.

## 3. Caricamento del Contesto (Cliente vs Brain Aziendale)
- **Se `$ARGUMENTS` indica un cliente** (es. `/prime acme` → cartella `clients/acme/`):
  1. Leggi i file del cliente in `clients/<slug>/`:
     - `index.md` (contesto stabile: identità, storia, stack, brand)
     - `state.md` (contesto volatile: priorità attuali, blocchi)
     - `purpose.md` / `decisioni.md` (diagnosi DataPyx e verdetti `/challenge`)
     - `key-metrics.md` (numeri vivi da DataOS, se presente)
     - `lezioni.md` (se presente)
     - prime 20 righe di `log.md` (ultime attività/riunioni)
  2. Presenta un riepilogo sintetico: utente attivo, stato del cliente, priorità correnti, metriche chiave e eventuali proposte in attesa (`enrichment/proposals/`).
  3. **Prospettive proattive:** invoca internamente la skill `aios-learn` per verificare se emergono prospettive proattive sul cliente.
- **Se `$ARGUMENTS` è vuoto (sessione generale AsernetBrain):**
  1. Leggi `wiki/index.md`, `clients/index.md` e le prime 5 entry di `wiki/log.md` e `clients/log.md`.
  2. Saluta l'utente (`<id>`) con un riepilogo sintetico: stato del sync Git, clienti attivi in `clients/index.md`, ultime attività e azioni personali aperte in `actions/users/<id>/`. Chiedi su quale cliente o area aziendale vuole lavorare.
