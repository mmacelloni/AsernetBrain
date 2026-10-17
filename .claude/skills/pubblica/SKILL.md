---
name: pubblica
description: Pubblica sul repository Git aziendale (VPS) il lavoro dell'operazione appena conclusa tramite il server MCP vault-asernet. Prima verifica che nessun collega abbia toccato gli stessi file nel frattempo (L ∩ R); se c'è sovrapposizione si ferma e chiede all'utente. Aggiorna anche l'indice QMD locale.
argument-hint: "[opzionale: messaggio di commit]"
allowed-tools: Read, Glob, Grep, Bash
disable-model-invocation: true
---

# Pubblica il lavoro (`/pubblica`)

Messaggio proposto: `$ARGUMENTS` (se vuoto, ricavalo dall'ultima voce di log in `wiki/log.md` o `clients/log.md`)

Questa skill chiude un'operazione e la rende visibile ai colleghi sul repository Git aziendale, aggiornando al contempo l'indice locale QMD (`--index asernetbrain`).

## 1. Come si eseguono le operazioni Git
La scrittura passa dalla tool **`vault_publish`** esposta dal server MCP `vault-asernet`:
1. Rifiuta se `git config user.email` è vuota;
2. Costruisce **R** dall'antenato comune e calcola **L ∩ R** (escludendo `index.md` e `*log.md` che ogni operazione tocca);
3. Se l'intersezione non è vuota **non scrive niente** e restituisce `OVERLAP`;
4. Altrimenti committa i path passati, fonde con `merge` (mai `rebase`), fa `push` e lancia `qmd --index asernetbrain update`.

Bash è concesso **solo in lettura** (`git status`, `git diff`, `git log`, `git show`, `git config`). Vietati `push --force`, `reset`, `checkout`, `rebase`.

## 2. Procedura

1. **Controlla lo stato con `vault_status`:**
   - Identifica i file modificati o nuovi (**L**). Se non c'è nulla da pubblicare (`untracked` e `modified` vuoti e `ahead == 0`), dillo e fermati.
   - Se `merge_ours_driver` non è `ok`, chiama prima **`vault_setup`**.
2. **Verifica che `index.md` e `log.md` siano aggiornati:**
   - Se hai toccato `wiki/`, verifica che `wiki/index.md` e `wiki/log.md` includano la modifica.
   - Se hai toccato `clients/<slug>/`, verifica che `clients/<slug>/log.md` (ed eventualmente `clients/index.md` / `clients/log.md`) siano aggiornati.
3. **Pubblica con `vault_publish`:**
   - Formato messaggio: `YYYY-MM-DD | <utente> | <ambito> | <titolo>`
   - Chiama `vault_publish(files: <L>, message: "<messaggio>")`.
4. **Gestione esito:**
   - `PUBLISHED`: conferma all'utente i file pubblicati, l'hash del commit e lo stato dell'aggiornamento QMD locale (`qmd_update`).
   - `OVERLAP` o `CONFLICT`: mostra in modo chiaro quali file sono stati modificati nel frattempo dal collega, mostra il diff in sola lettura e chiedi all'utente come procedere senza mai forzare.
