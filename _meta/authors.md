# Registro identità e utenti — AsernetBrain

Registro delle identità che operano in **AsernetBrain**. Vive alla radice del vault.
L'`id` è in kebab-case ed è **stabile**: compare in:
- `provenance:` (`user: <id>`) per indicare su quale PC/utente risiede il file grezzo in `raw/`;
- `authored_by` e `reviewed_by` nella Zona Governata (`wiki/`, `topics/`);
- il percorso delle Actions personali (`actions/users/<id>/`);
- i log operativi.

## Server Git Remoto Condiviso (VPS Aziendale)

- **Nome Server:** `N8N Asernet`
- **IP / Host:** `152.228.134.98` (alias SSH consigliato: `asernet-vps`)
- **Utente SSH:** `ubuntu`
- **Percorso Repository Bare:** `/srv/git/asernetbrain.git`
- **URL Remote Git:** `ubuntu@152.228.134.98:/srv/git/asernetbrain.git` (oppure `asernet-vps:/srv/git/asernetbrain.git`)

## Convenzione Email & Identità Registrate

Tutte le identità umane aziendali utilizzano l'email nominativa con dominio **`@asernet.it`** nel formato `<iniziale>.<cognome>@asernet.it`:

| id | tipo | nome | email git (`@asernet.it`) | Cartella Actions Personali |
|---|---|---|---|---|
| `marco` | human | Marco Macelloni | m.macelloni@asernet.it | `actions/users/marco/` |
| `sara` | human | Sara Romano | s.romano@asernet.it | `actions/users/sara/` |
| `anna` | human | Anna Angeloro | a.angeloro@asernet.it | `actions/users/anna/` |
| `claude-ingest` | agent | Claude — operazioni di `/ingest` sul vault | — | — |

## Regola di disambiguazione

- **`authored_by`** = chi ha prodotto il testo (se l'ha scritto un LLM nella Zona Governata è `claude-ingest`).
- **`reviewed_by`** = l'umano (`marco`, `sara`, `anna`) che ha validato la pagina. Un agente non valida mai sé stesso.
- **`provenance.user`** = l'identità umana sul cui disco locale risiede il file originale in `raw/` (poiché `raw/` resta locale e non viene committato in Git).
