# Registro identità e utenti — AsernetBrain

Registro delle identità che operano in **AsernetBrain**. Vive alla radice del vault.
L'`id` è in kebab-case ed è **stabile**: compare in:
- `provenance:` (`user: <id>`) per indicare su quale PC/utente risiede il file grezzo in `raw/`;
- `authored_by` e `reviewed_by` nella Zona Governata (`wiki/`, `topics/`);
- il percorso delle Actions personali (`actions/users/<id>/`);
- i log operativi.

## Identità registrate

| id | tipo | nome | email git | Cartella Actions Personali |
|---|---|---|---|---|
| `sara` | human | Sara Romano | sara.romano.15@gmail.com | `actions/users/sara/` |
| `anna` | human | Anna Angeloro | annaangeloro11@gmail.com | `actions/users/anna/` |
| `marco` | human | Marco Macelloni | info@bitsite.it | `actions/users/marco/` |
| `claude-ingest` | agent | Claude — operazioni di `/ingest` sul vault | — | — |

## Regola di disambiguazione

- **`authored_by`** = chi ha prodotto il testo (se l'ha scritto un LLM nella Zona Governata è `claude-ingest`).
- **`reviewed_by`** = l'umano (`marco`, `sara`, `anna`) che ha validato la pagina. Un agente non valida mai sé stesso.
- **`provenance.user`** = l'identità umana sul cui disco locale risiede il file originale in `raw/` (poiché `raw/` resta locale e non viene committato in Git).
