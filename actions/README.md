# Actions — Architettura delle Automazioni (DOE)

In **AsernetBrain** le azioni/automazioni sono divise in **3 ambiti distinti** per evitare che le automazioni personali di un utente si mescolino con quelle di un collega o con quelle specifiche di un cliente:

1. **`actions/users/<slug-utente>/` — Actions Personali dell'Utente**
   - Routine individuali (es. organizzazione giornata, filtro email personale, debrief personale, stile di scrittura).
   - Ogni utente (`marco`, `raffaele`, `domenico`, `pasquale`, `anna`) ha la propria `roadmap.md` e i propri script/direttive DOE.
2. **`actions/shared/` — Actions Aziendali Condivise (Vault Asernet)**
   - Procedure automatizzate valide per tutta l'azienda (es. onboarding nuovo cliente, generazione report standard, controllo qualità).
   - Governate dal Metodo 3C e dal [DOE Pattern](../wiki/concepts/doe-pattern.md): criterio di atomicità, **gate HITL 9/10** prima dello scheduling automatico e verifica del **valore verificato (KPI ex-post)** in `actions/shared/roadmap.md`.
3. **`clients/<slug-cliente>/actions/` & `connectors/` — Actions Specifiche del Cliente**
   - Direttive DOE (`.md`), script deterministici (`.py`/`.js`) e `clients/<slug-cliente>/actions/roadmap.md` costruiti su misura per un singolo cliente, affiancati dai connettori dati in `clients/<slug-cliente>/connectors/`.
