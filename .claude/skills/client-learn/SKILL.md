---
name: client-learn
description: "Motore interno di apprendimento dell'AsernetBrain. Trasforma correzioni ed errori in regole permanenti per quel cliente (lezioni.md) o in feedback di processo sul prodotto AsernetBrain (onboarding-feedback-prodotto.md), promuove i contributi degli operatori (/contribuisci) nello strato lezioni con contradiction-gate, e ad ogni /prime genera prospettive proattive. NON è un comando esposto all'utente: è invocata internamente da altre skill/comandi (challenge, debrief, asermind, i livelli AsernetBrain, prime, contribuisci, rivedi-proposte). Usa quando un touchpoint segnala una correzione/frizione, quando un operatore invia un contributo, o quando /prime chiede le prospettive."
---

# AsernetBrain — client-learn (motore di apprendimento)

Skill **interna**, invocata da altre skill/comandi sullo stesso principio con cui
l'orchestratore `onboarding` invoca `client-context`/`client-data`/ecc. Non compare in
`/help` come azione primaria e non ha un comando slash dedicato. Contiene
*tutta* la logica di apprendimento: se un criterio o un formato cambia, si edita
solo questo file — i touchpoint restano puntatori stabili.

In **AsernetBrain** lavori direttamente sulla cartella del cliente **`clients/<slug>/`** (risolvendola da `clients/index.md` o `qmd-asernet` senza richiedere `/prime`).

## Due lane — non confondere mai

| Lane | Contenuto | File in AsernetBrain | Chi lo legge |
|---|---|---|---|
| **Lezione cliente** | Regola/pattern su quel business specifico | Sezione `## Lezioni apprese` in `clients/<slug>/index.md` (o `clients/<slug>/lezioni.md` se split) | Ogni query sul cliente e `/prime` |
| **Feedback prodotto** | Frizione di processo su AsernetBrain/AsernetBrain stesso | `_meta/onboarding-feedback-prodotto.md` | Il maintainer del brain, in revisione manuale |

Dati di business restano isolati per cliente in `clients/<slug>/`; segnali sul funzionamento di AsernetBrain vanno in `_meta/onboarding-feedback-prodotto.md`.

## Due modalità — riconosci sempre in quale sei

| | **Consulente** (sincrona) | **Operatore** (async) |
|---|---|---|
| Chi ti invoca | `challenge`, `debrief`, `asermind`, i livelli AsernetBrain, `/prime` | `/contribuisci` |
| Umano presente | Sì, in sessione | No: headless, tipicamente dalla dashboard |
| Gate prima di scrivere | **HITL** su ogni cattura (sotto) | **Contradiction-gate** — leggi `references/operator-mode.md` |

`/rivedi-proposte` è la revisione **sincrona** della coda (`clients/<slug>/proposals/*.md`) col curatore.

## Responsabilità

1. **Classifica il segnale** — lezione di business (→ `clients/<slug>/index.md` / `lezioni.md`) o frizione di processo (→ `_meta/onboarding-feedback-prodotto.md`). Criteri e formati: leggi `references/capture-guide.md`.
2. **Protocollo HITL (obbligatorio in modalità consulente)** — mai scrittura silenziosa quando l'umano è in sessione.
3. **Scrittura append-only** — mai riscrivere o cancellare entry precedenti.
4. **Split dinamico in `clients/<slug>/lezioni.md`** — su soglia, su conferma.
5. **Prospettive proattive per `/prime`** — leggi `references/perspectives-guide.md`.
6. **Contributi degli operatori (modalità operatore)** — classifica, contradiction-check contro `clients/<slug>/{index.md,state.md,purpose.md}`, poi auto-promuovi nello strato lezioni o metti in coda in `clients/<slug>/proposals/`.

## Protocollo HITL (cardine — modalità consulente)

1. Classifica il segnale e prepara **il testo esatto** della entry + il **file di destinazione**.
2. Mostralo all'utente e **attendi conferma esplicita**. Non scrivere prima.
3. Alla conferma → scrivi in **append** (mai sovrascrivere).
4. Al rifiuto → scarta e **non riproporre lo stesso segnale nella sessione corrente**.
