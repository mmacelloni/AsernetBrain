---
name: debrief
description: "Debrief di fine giornata: Claude fa qualche domanda sui progressi e aggiorna il contesto dell'AsernetBrain (context + history.md). Chiude il ciclo /prime → lavoro → /debrief."
argument-hint: "Nota rapida sulla giornata (opzionale)"
---

È fine sessione. Il tuo compito è **consolidare i progressi della giornata**
nell'AsernetBrain del cliente (la cartella corrente), così domani `/prime` riparte dallo
stato aggiornato e non da dove eravamo ieri. Rispondi in italiano.

Nota libera dell'utente (se presente): **$ARGUMENTS**

## 1. Individua il cliente e carica lo stato attuale (silenzioso, anche senza `/prime`)
- Se l'utente ha indicato il cliente in `$ARGUMENTS` o ne stavate parlando nella conversazione, risolvi subito `clients/<slug>/` tramite `clients/index.md` o `qmd-asernet` (`-c asernet-clients`). Se non è chiaro su quale cliente fare il debrief, chiedi solo il nome del cliente.
- Prima di fare domande, leggi in `clients/<slug>/`:
  - `index.md` (contesto stabile), `state.md` (priorità e pendenze attuali), `purpose.md` (diagnosi e decisioni), `projects.md`;
  - `log.md` — le ultime entry (cos'era in sospeso);
  - `key-metrics.md` e `data/database.db` — se presenti.

## 2. Intervista di debrief — UNA domanda alla volta
Non aspettare che l'utente racconti: **fai tu le domande**, mirate sullo stato che
hai appena letto. Copri (adatta all'AsernetBrain reale, salta il non pertinente):

1. **Cosa è avanzato oggi?** — progetti/clienti che si sono mossi e come.
2. **Cosa si è bloccato o è in ritardo?** — e perché.
3. **Decisioni prese** — scelte che cambiano strategia, prezzi, priorità.
4. **Novità sui numeri/persone** — nuovi clienti, importi, cambi nel team.
5. **Azioni aperte** — cosa resta da fare, con eventuale scadenza.

Una domanda alla volta, brevi. Sfida ciò che non torna (una decisione che
contraddice la strategia nei file → chiedi conferma prima di registrarla). Se la
contraddizione è **confermata** dall'utente, **invoca la skill `client-learn`**: può
essere una lezione da ricordare (la strategia sta cambiando, o è emersa una regola
implicita). `client-learn` classifica e chiede conferma prima di scrivere — non
scrivere tu direttamente in `lezioni.md`.

## 3. Recap + 😈 Devil's Advocate di Processo prima di scrivere
Prima di toccare qualsiasi file:
1. Mostra **cosa hai capito** e **l'elenco preciso delle modifiche** che stai per fare (`state.md`, `purpose.md`, `projects.md`, `log.md`).
2. **😈 Check Devil's Advocate (rapido, 3 punti max):** segnala se tra le decisioni o promesse emerse oggi c'è:
   - un impegno con rischio operativo / dipendenza bloccante + **contromisura pratica immediata**;
   - una contraddizione con una `DECISION` (`in_force`) in `purpose.md` (chiedendo se la `supersedes`);
   - una lacuna informativa da registrare come **`QUESTION` OIDA** in `purpose.md`.
3. Ottieni conferma dall'utente prima di scrivere.

## 4. Aggiorna la scheda del cliente in `clients/<slug>/`
Dopo conferma:
- **`clients/<slug>/log.md`** (e una riga sintetica in **`clients/log.md`**) — appendi in cima una entry datata (`## [YYYY-MM-DD] debrief | <utente>`) con: avanzamenti, decisioni, azioni aperte. Append-only: non modificare entry precedenti.
- **`clients/<slug>/state.md`**, **`purpose.md`** (incluse eventuali nuove `DECISION` o `QUESTION` OIDA) o **`projects.md`** — aggiorna quelli pertinenti con i nuovi fatti. **Non** toccare `clients/<slug>/key-metrics.md` (è autogenerato da `refresh.py`).

## 5. Chiusura
- Riepiloga in 3 righe cosa hai registrato.
- Se sono emerse azioni aperte con scadenza o nuove `QUESTION`, elencale come promemoria per domani.
- Suggerisci **`/pubblica`** per sincronizzare subito con la VPS.

## Regole
- Sei un archivista, non un esecutore: qui **non** costruisci automazioni né
  affronti nuove sfide. Registri e basta.
- Mai inventare progressi: se l'utente non risponde a una domanda, salta quel punto.
- Confidenza: se un dato riferito è incerto, segnalalo nel testo che scrivi.

