---
description: "Avvio sessione AsernetBrain: sincronizza Git (main + personal/ via vault_sync), identifica l'utente attivo, calcola la Gravità Epistemica (Decadimento Inverso OIDA) delle QUESTION aperte e carica il contesto del cliente o aziendale."
argument-hint: "[opzionale: slug del cliente, es. shopincasa]"
---

# Avvio Sessione — `/prime` (AsernetBrain)

Target richiesto: **$ARGUMENTS**

Rispondi sempre in italiano. Esegui questi passi in ordine all'inizio della sessione:

## 1. Sincronizzazione Git obbligatoria (`main` + `personal/`)
- Se è disponibile la tool MCP **`vault_sync`**, chiamala subito (sincronizza sia il repo principale sia il sub-repo privato `personal/` e aggiorna QMD).
- Altrimenti esegui `git pull --ff-only`.
- Se il pull segnala `DIVERGED`, `AHEAD` o un conflitto bloccante: **fermati subito**, mostralo all'utente e chiedi di chiudere prima con `/pubblica`.

## 2. Identificazione Utente, Angolino Personale (`personal/`) e Actions (DOE)
1. Leggi `git config user.email` e confrontala con `_meta/authors.md` per ricavare l'`id` dell'utente attivo (`marco`, `raffaele`, `domenico`, `pasquale`, `anna`).
2. Leggi il sub-repo privato **`personal/`** dell'utente:
   - `personal/index.md` (priorità e note riservate dell'utente)
   - `personal/tasks-clickup.md` (task personali ClickUp dell'utente)
3. Controlla `actions/users/<id>/roadmap.md` e `actions/shared/roadmap.md` (automazioni DOE).

## 3. Calcolo Gravità Epistemica OIDA (`QUESTION` a Decadimento Inverso)
- Leggi `wiki/questions.md` (e, se è specificato un cliente, la tabella `## ❓ 1. Questioni Aperte` in `clients/<slug>/purpose.md`).
- Per ogni `QUESTION` con stato `open`, calcola la **Gravità Epistemica**:
  $$\text{Gravità} = \max(1, \text{giorni trascorsi da Aperta il}) \times \text{Peso (1..3)}$$
- Ordina le `QUESTION` aperte dalla gravità più alta alla più bassa: **ciò che l'organizzazione non sa acquista urgenza col passare dei giorni** e va mostrato in evidenza nel briefing di apertura!

## 4. Caricamento del Contesto (Cliente + Personale vs Brain Aziendale)
- **Se `$ARGUMENTS` indica un cliente** (es. `/prime acme` → cartella `clients/acme/`):
  1. Leggi i file condivisi del cliente in `clients/<slug>/`:
     - `index.md` (contesto stabile: identità, storia, stack, brand, lezioni)
     - `state.md` (contesto volatile: priorità attuali, blocchi)
     - `purpose.md` (Questioni Aperte `QUESTION`, diagnosi `asermind` con griglia Cognitive Core e decisioni `DECISION` / verdetti `/challenge`)
     - `key-metrics.md` (numeri vivi da DataOS, se presente)
     - prime 20 righe di `log.md` (ultime attività/riunioni)
  2. Filtra da `personal/tasks-clickup.md` eventuali task personali dell'utente collegati a questo cliente.
  3. Presenta il riepilogo unificato mettendo in cima:
     - 🔴 **Questioni Aperte (`QUESTION`) a più alta Gravità Epistemica** da risolvere sul cliente;
     - 🟢 **Decisioni in vigore (`DECISION`) e Stato attuale (`state.md`)**;
     - 📋 **I tuoi task personali ClickUp su questo cliente** e le metriche chiave.
  4. **Prospettive proattive:** invoca internamente la skill `client-learn` per verificare se emergono prospettive proattive sul cliente.
- **Se `$ARGUMENTS` è vuoto (sessione generale AsernetBrain):**
  1. Leggi `wiki/index.md`, `wiki/questions.md`, `clients/index.md` e le prime 5 entry di `wiki/log.md` e `clients/log.md`.
  2. Saluta l'utente (`<id>`) con un riepilogo sintetico che unisce **Aziendale + Epistemico + Personale**:
     - Stato del sync Git (`main` + `personal/`) e ultime attività del team;
     - 🔴 **Top Questioni Aperte (`QUESTION` OIDA)** ordinate per Gravità Epistemica;
     - 📋 **I tuoi task personali in scadenza** da `personal/tasks-clickup.md` e `personal/index.md`;
     - 🚀 **Clienti attivi** in `clients/index.md`.
