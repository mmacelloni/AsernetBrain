# Actions — Architettura delle Automazioni (DOE)

In **AsernetBrain** le azioni/automazioni sono divise in **3 ambiti distinti** per evitare che le automazioni personali di un utente si mescolino con quelle di un collega o con quelle specifiche di un cliente:

1. **`actions/users/<slug-utente>/` — Actions Personali dell'Utente**
   - Routine individuali (es. organizzazione giornata, filtro email personale, debrief personale, stile di scrittura).
   - Ogni utente (`marco`, `sara`, `anna`, ecc.) ha la propria `roadmap.md` e i propri script/direttive DOE.
2. **`actions/shared/` — Actions Aziendali Condivise (Asernet)**
   - Procedure automatizzate valide per tutta l'azienda (es. onboarding nuovo cliente, generazione report standard, controllo qualità).
   - Governate dal Metodo 3C: criterio di atomicità, **gate HITL 9/10** prima dello scheduling automatico e verifica del **valore verificato (KPI ex-post)** in `actions/shared/roadmap.md`.
3. **`clients/<slug-cliente>/connectors/` & `projects.md` — Actions Specifiche del Cliente**
   - Connettori dati e automazioni costruite su misura per un singolo cliente, isolate dentro la cartella di quel cliente.
