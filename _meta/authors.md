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
- **Utente Git per i Colleghi (senza shell):** `git` (confinato in `/usr/bin/git-shell`, zero accesso al terminale o al sistema).
- **Percorso Repository Bare:** `/srv/git/asernetbrain.git` (`core.sharedRepository 0640`)
- **URL Remote Git:** `git@152.228.134.98:/srv/git/asernetbrain.git` (oppure `asernet-git:/srv/git/asernetbrain.git`)

### Aggiunta Chiave SSH per un Nuovo Utente / Dispositivo
Ogni collega (o nuova macchina, es. Mac) genera la propria chiave `ssh-keygen -t ed25519 -f ~/.ssh/id_ed25519_asernetbrain` e invia la sola chiave pubblica (`.pub`) all'admin, che la aggiunge in append a `/home/git/.ssh/authorized_keys` con i flag di restrizione:
```bash
{ printf 'no-port-forwarding,no-agent-forwarding,no-X11-forwarding,no-pty '; cat chiave_utente.pub; } \
  | ssh asernet-admin 'sudo -u git tee -a /home/git/.ssh/authorized_keys'
```

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
