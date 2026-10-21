---
name: client-brief
description: "Brief di intelligence prima di una call con un cliente: timeline, promesse vs consegne, pendenze, ultima conversazione e 3 punti d'agenda. Riusa contesto + riunioni + dati dell'AsernetBrain."
argument-hint: "Nome del cliente su cui preparare il brief"
---

Prepara un **brief pre-call di 5 minuti** su un cliente, leggendo tutto ciò che
l'AsernetBrain sa di lui. Serve al consulente per arrivare alla riunione preparato.
Rispondi in italiano, denso e scremato — è un brief, non un report.

Cliente: **$ARGUMENTS**
Se non è stato indicato un cliente, chiedi **solo** il nome e fermati.

## 1. Individua il cliente e raccogli tutto ciò che AsernetBrain sa di lui
Funziona da qualsiasi cartella del brain **anche senza aver lanciato `/prime`**:
1. Cerca lo `<slug>` del cliente in `clients/index.md` o tramite `qmd-asernet` (`-c asernet-clients`).
2. Nella cartella `clients/<slug>/` (e nelle sorgenti correlate disponibili), leggi:
   - **Contesto e Stato** — `clients/<slug>/index.md` (storia, stack, pacchetto), `clients/<slug>/state.md` (priorità attuali, accordi), `clients/<slug>/purpose.md` (diagnosi AserMind e decisioni), `clients/<slug>/contacts.md` e `clients/<slug>/projects.md`.
   - **Metriche e Dati** — `clients/<slug>/key-metrics.md` e `clients/<slug>/data/database.db` (record cliente, importi, fatture, pipeline) se presenti.
   - **Riunioni e Storico** — `clients/<slug>/log.md` e tabella `meetings` in `clients/<slug>/data/database.db` (data, riassunto, **action items** e decisioni).
   - **Automazioni/Connettori** — `clients/<slug>/connectors/config.yaml` ed eventuali script in `actions/`.

Se non trovi nulla su quel nome né in `clients/` né tramite QMD, dillo esplicitamente e chiedi se il nome è scritto diversamente, invece di inventare.

## 2. Segnala la qualità del quadro
In testa al brief, una riga onesta: su cosa ti basi e cosa manca.
Es.: `Basato su: 3 riunioni + scheda cliente. Manca: dati di fatturato.`

## 3. Produci il brief — questo formato
**Cliente** — nome · pacchetto/relazione in una riga · da quando è cliente (se noto)

**Timeline della relazione** — 3-5 tappe chiave in ordine, dalla prima traccia a oggi.

**Promesse vs consegne** — cosa è stato promesso al cliente (o da lui) e cosa è
stato effettivamente fatto. Evidenzia gli scostamenti.

**Pendenze aperte** — action items non ancora chiusi (da chi, da quando).
Ordina per urgenza.

**Ultima conversazione** — data + sintesi in 2-3 righe di cosa ci si è detti
l'ultima volta e cosa era rimasto in sospeso.

**Priorità dichiarate dal cliente** — cosa gli sta a cuore, con parole sue se le hai.

**Segnali di attenzione & Questioni Aperte (`QUESTION` OIDA)** — rischi o tensioni (ritardi, promesse non mantenute, silenzi, pagamenti) + le `QUESTION` aperte a più alta gravità epistemica in `purpose.md`.

**😈 Devil's Advocate per la Call** — le **2-3 obiezioni o domande più scomode** che il cliente potrebbe sollevare oggi (basate su scostamenti, ritardi o punti aperti) + la **contromisura / risposta fattuale pronta** per ciascuna.

**3 punti da mettere in agenda** — le tre cose più utili da affrontare in questa call, derivate da pendenze + priorità + `QUESTION` aperte sopra.

## Regole
- Ogni affermazione deve poggiare su un dato trovato: se inferisci, marcalo come ipotesi (regola anti-*Appearance of Knowing*, Baum). Mai inventare fatti su un cliente reale.
- Brevità: il consulente lo legge in 5 minuti prima di entrare in call.
- Non proporre strategie elaborate: il brief orienta, non decide. Per stressare una decisione strategica ad alto impatto, rimanda a `/challenge` (Cognitos Sum).

