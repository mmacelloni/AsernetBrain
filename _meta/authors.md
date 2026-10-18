# Registro identità e utenti — AsernetBrain

Registro delle identità che operano in **AsernetBrain**. Vive alla radice del vault.
L'`id` è in kebab-case ed è **stabile**: compare in:
- `provenance:` (`user: <id>`) per indicare su quale PC/utente risiede il file grezzo in `raw/`;
- `authored_by` e `reviewed_by` nella Zona Governata (`wiki/`, `topics/`);
- il percorso delle Actions personali (`actions/users/<id>/`);
- i log operativi.

## Server Git Remoto Condiviso (VPS Aziendale — Blindato SSH Key-Only)

- **Nome Server:** `N8N Asernet` (`152.228.134.98`)
- **Sicurezza SSH:** `PasswordAuthentication no` (accesso con password disabilitato; solo chiavi pubbliche autorizzate).
- **Utente Admin VPS (solo Marco):** `ubuntu` (`ssh asernet-admin`) con chiave admin separata.
- **Utente Git per i Colleghi (senza shell):** `git` (confinato in `/usr/local/bin/asernet-git-shell`, zero accesso al terminale o al sistema).
- **Percorso Repository Aziendale Condiviso:** `git@152.228.134.98:/srv/git/asernetbrain.git`
- **Percorso Sub-Repo Personale Isolato (`personal/`):** `git@152.228.134.98:/srv/git/personal/<id>.git` (ogni utente può leggere/scrivere **solo** il proprio `/srv/git/personal/<id>.git`; il tentativo di accedere a quello di un collega viene bloccato a livello SSH da `asernet-git-shell`).

### Aggiunta Chiave SSH per un Nuovo Utente / Dispositivo (es. Mac o PC Collega)
Ogni collega (o un nuovo dispositivo come il Mac) genera la propria chiave `ssh-keygen -t ed25519 -N "" -f ~/.ssh/id_ed25519_asernetbrain` e invia la sola chiave pubblica (`.pub`) all'admin, che la associa all'`<id>` dell'utente (`marco`, `raffaele`, `domenico`, `pasquale`, `anna`) in `/home/git/.ssh/authorized_keys`:
```bash
# Sostituisci <id> con: marco, raffaele, domenico, pasquale o anna
{ printf 'command="/usr/local/bin/asernet-git-guard <id>",no-port-forwarding,no-agent-forwarding,no-X11-forwarding,no-pty '; cat chiave_utente.pub; } \
  | ssh asernet-admin 'sudo -u git tee -a /home/git/.ssh/authorized_keys'
```

## Convenzione Email & Identità Registrate

Tutte le identità umane aziendali utilizzano l'email nominativa con dominio **`@asernet.it`** nel formato `<iniziale>.<cognome>@asernet.it`:

| id | tipo | nome | email git (`@asernet.it`) | Cartella Actions Personali |
|---|---|---|---|---|
| `marco` | human | Marco Macelloni | m.macelloni@asernet.it | `actions/users/marco/` |
| `raffaele` | human | Raffaele Tortora | r.tortora@asernet.it | `actions/users/raffaele/` |
| `domenico` | human | Domenico Palma Valente | d.palma@asernet.it | `actions/users/domenico/` |
| `pasquale` | human | Pasquale Cipriani | p.cipriani@asernet.it | `actions/users/pasquale/` |
| `anna` | human | Anna Angeloro | a.angeloro@asernet.it | `actions/users/anna/` |
| `claude-ingest` | agent | Claude — operazioni di `/ingest` sul vault | — | — |

## Regola di disambiguazione

- **`authored_by`** = chi ha prodotto il testo (se l'ha scritto un LLM nella Zona Governata è `claude-ingest`).
- **`reviewed_by`** = l'umano (`marco`, `raffaele`, `domenico`, `pasquale`, `anna`) che ha validato la pagina. Un agente non valida mai sé stesso.
- **`provenance.user`** = l'identità umana sul cui disco locale risiede il file originale in `raw/` (poiché `raw/` resta locale e non viene committato in Git).
