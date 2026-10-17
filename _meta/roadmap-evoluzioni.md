---
title: "Roadmap ed Evoluzioni Architetturali — AsernetBrain"
type: meta-roadmap
updated: 2026-10-17
---

# 🚀 Evoluzioni Architetturali Future (`AsernetBrain`)

Questo documento traccia le evoluzioni pianificate per l'infrastruttura dati di **AsernetBrain**, così da mantenere l'architettura attuale snella e pronta per gli sviluppi futuri.

---

## 1. Gestione Dati Tabellari Clienti (BigQuery, GA4, SEO, Screaming Frog)

### Stato Attuale (Fase 1 — Attiva)
- **BigQuery come sorgente primaria per cliente:** I clienti hanno già **Google BigQuery** configurato. Per ciascun cliente prepariamo in `clients/<slug>/connectors/` gli script Python con le **query SQL ad hoc** che interrogano direttamente BigQuery (es. dati GA4, Search Console, campagne, e-commerce).
- **SQLite locale + Sintesi Git (`key-metrics.md`):**
  - Gli script salvano eventuali tabelle di lavoro in locale (`clients/<slug>/data/database.db`, escluso da Git) e rigenerano `clients/<slug>/key-metrics.md` (committato in Git e indicizzato da QMD in `asernet-clients`), rendendo subito visibili i KPI a tutti i colleghi.
  - Per analisi puntuali come export CSV di **Screaming Frog** o **Audit SEO**, il file grezzo viene messo in `raw/clients/<slug>/` (locale con tracciamento `provenance`) ed elaborato tramite script Python / SQLite locale producendo le sintesi markdown nella scheda del cliente.

---

### Evoluzione Futura (Fase 2 — Piattaforma con DB Centralizzato Condiviso)
Quando sarà disponibile la piattaforma aziendale con Database centralizzato sulla VPS (MySQL / PostgreSQL):

1. **Architettura Dati a 3 Livelli sulla VPS:**
   - **Livello 1 — Sintesi Markdown in Git (`clients/<slug>/key-metrics.md`):** resta invariato per la consultazione rapida e la ricerca semantica su QMD.
   - **Livello 2 — Database Condiviso su Piattaforma/VPS (`client_<slug>`):**
     - Gli export tabellari pesanti che non risiedono su BigQuery (es. crawl completi di **Screaming Frog** con storico `crawl_date`, audit tecnici SEO, tabelle custom) e le viste aggregate estratte da BigQuery/GA4/GSC verranno inviate al DB centralizzato sulla piattaforma.
     - **Beneficio per il team:** tutti i colleghi (Marco, Sara, Anna) potranno interrogare dal proprio Claude le tabelle complete (es. `JOIN` tra le 50.000 URL di Screaming Frog e le performance di Search Console) senza dover scambiare file `.db` o CSV locali.
   - **Livello 3 — Separazione dal DB Personale:**
     - Il DB dei clienti diventerà condiviso sulla piattaforma, mentre il DB dell'angolino privato (`personal/data/personal.db` per i task ClickUp personali dell'utente) resterà rigorosamente in **SQLite locale** sulla macchina del singolo collega.
