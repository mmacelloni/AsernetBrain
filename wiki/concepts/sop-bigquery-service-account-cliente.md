---
title: "SOP — Collegare il BigQuery di un cliente al brain (service account Asernet)"
type: concept
epistemic_class: SOP
status: draft
scope: "global"
authored_by: claude-ingest
reviewed_by: ""
created: 2026-10-21
updated: 2026-10-21
tags: [bigquery, gcp, service-account, dataos, vps, sop]
provenance:
  - user: "marco"
    raw_path: "— (procedura eseguita in sessione il 2026-10-21 su un cliente pilota)"
    date: 2026-10-21
---

# SOP — Collegare il BigQuery di un cliente al brain

> **Stato:** 🟡 bozza, eseguita una volta (cliente pilota, 21/10/2026). Diventa `in_force` dopo la revisione di un umano diverso dall'autore.
> **Obiettivo:** una sola identità tecnica Asernet che legge il BigQuery di ogni cliente dalla VPS, senza che ogni collega colleghi il proprio account Google.

---

## 0. Cosa esiste già (una tantum, NON rifarlo)

| Elemento | Valore |
|---|---|
| Account Google proprietario | `asernet.promo@gmail.com` (Gmail, nessuna organizzazione → nessun blocco sulla creazione delle chiavi) |
| Progetto GCP Asernet | `asernetbrainbigquery` — **nessuna fatturazione collegata**, serve solo a contenere il service account |
| Service account | `asernetbrain-bq@asernetbrainbigquery.iam.gserviceaccount.com` — **nessun ruolo** nel proprio progetto |
| Chiave JSON | **solo** sulla VPS: `/srv/secrets/bigquery/asernetbrain-bq.json` (`640 root:git`, cartelle `750 root:git`) |

**Regola dei costi (decisione A):** BigQuery addebita la query al progetto in cui il job gira. Le query girano nel progetto del cliente → **paga il cliente**, il progetto Asernet resta a costo zero.

Per un **nuovo cliente** si parte dal §2. Il §1 serve solo se la chiave va rigenerata o persa.

---

## 1. (Solo se necessario) Ricreare il service account e la chiave

Console <https://console.cloud.google.com> con `asernet.promo@gmail.com`, progetto `asernetbrainbigquery` selezionato in alto.

1. ☰ → **IAM e amministrazione → Account di servizio → + Crea account di servizio**. Nome `asernetbrain-bq`. **Non** assegnare ruoli → *Continua* → *Fine*.
2. Clic sull'account → scheda **Chiavi → Aggiungi chiave → Crea nuova chiave → JSON**. Il file finisce in `Download`. Non aprirlo, non metterlo in cartelle sincronizzate.
3. Copia sulla VPS e blocca i permessi (PowerShell sul PC):
   ```powershell
   scp "$HOME\Downloads\asernetbrainbigquery-*.json" asernet-admin:/tmp/asernetbrain-bq.json
   ssh asernet-admin "sudo mkdir -p /srv/secrets/bigquery && sudo mv /tmp/asernetbrain-bq.json /srv/secrets/bigquery/asernetbrain-bq.json && sudo chown -R root:git /srv/secrets && sudo chmod 750 /srv/secrets /srv/secrets/bigquery && sudo chmod 640 /srv/secrets/bigquery/asernetbrain-bq.json"
   ```
4. Cancella la copia locale: `Remove-Item "$HOME\Downloads\asernetbrainbigquery-*.json"` (PowerShell non passa dal cestino).
5. Se sostituisci una chiave esistente: nella scheda **Chiavi** elimina quella vecchia.

> ⚠️ Se la console dice *"Service account key creation is disabled"*: c'è la policy `iam.disableServiceAccountKeyCreation`. Con un Gmail non dovrebbe succedere; se succede, fermarsi.

---

## 2. Collegare un nuovo cliente (per ogni cliente)

### 2.1 Trovare il progetto GCP del cliente
- Annotare `project_id` e chi ne è **Proprietario**. Il progetto non "sta" da nessuna parte: è visibile solo agli account Google con un permesso su di esso.
- Verifica rapida, aprendo con l'account candidato: `https://console.cloud.google.com/iam-admin/iam?project=<PROJECT_ID>`. Se dice "Non hai l'autorizzazione", è l'account sbagliato.
- Serve un account **Proprietario** o **Amministratore IAM progetto**: se manca il pulsante *Concedi l'accesso*, non basta.

### 2.2 Job User sul progetto (eseguire le query, a carico del cliente)
IAM del progetto cliente → **Concedi l'accesso** → entità `asernetbrain-bq@asernetbrainbigquery.iam.gserviceaccount.com` → ruolo **Utente job BigQuery** → *Salva*.

### 2.3 Data Viewer **solo sui dataset necessari**
BigQuery Studio → per **ogni** dataset utile: ⋮ → **Condivisione → Autorizzazioni → Aggiungi entità** → stesso indirizzo → ruolo **Visualizzatore dati BigQuery** → **Salva** (in fondo al pannello: è facile chiuderlo senza salvare).
- Escludere i dataset tecnici (es. `airbyte_internal`).
- Scorciatoia sconsigliata: il ruolo a livello di progetto dà accesso a **tutti** i dataset, anche futuri.

### 2.4 Verificare dalla VPS
Dal PC (Git Bash), sostituendo `P` e la lista `DS`. Gira come utente `git`, cioè con gli stessi permessi del futuro tool `bq_query`; non serve installare librerie Google (usa `jwt`, `cryptography`, `requests` già presenti).
```bash
ssh asernet-admin 'sudo -n -u git python3 -' <<'PY'
import json, time, jwt, requests
k = json.load(open("/srv/secrets/bigquery/asernetbrain-bq.json"))
now = int(time.time())
a = jwt.encode({"iss": k["client_email"], "scope": "https://www.googleapis.com/auth/bigquery", "aud": k["token_uri"], "iat": now, "exp": now + 600}, k["private_key"], algorithm="RS256")
h = {"Authorization": "Bearer " + requests.post(k["token_uri"], data={"grant_type": "urn:ietf:params:oauth:grant-type:jwt-bearer", "assertion": a}).json()["access_token"]}
P  = "<PROJECT_ID>"
DS = ["<dataset1>", "<dataset2>"]
for ds in DS:
    q = {"query": f"SELECT COUNT(*) n, SUM(IFNULL(size_bytes,0)) b FROM `{P}.{ds}.__TABLES__`", "useLegacySql": False, "maximumBytesBilled": "100000000"}
    j = requests.post(f"https://bigquery.googleapis.com/bigquery/v2/projects/{P}/queries", headers=h, json=q).json()
    if "rows" in j:
        n, b = (c["v"] for c in j["rows"][0]["f"]); print(f"{ds:22} OK  tabelle={n:>4}  {int(b or 0)/1e9:.2f} GB")
    else:
        print(f"{ds:22} NEGATO: " + j.get("error", {}).get("message", "")[:90])
PY
```

| Esito | Causa | Rimedio |
|---|---|---|
| Errore sul token | Chiave assente/revocata | §1 |
| `bigquery.jobs.create` negato | Manca il Job User | §2.2 |
| `bigquery.datasets.get denied` / *User does not have permission* su un dataset | Data Viewer non salvato, o assegnato all'account/progetto sbagliato | §2.3, ricontrollare *Autorizzazioni* del dataset |
| Tutti OK | — | annotare tabelle e GB (servono per il tetto di costo) |

### 2.5 Registrare nel brain
- `clients/<slug>/connectors/config.yaml`, sorgente BigQuery: `auth: "service_account"`, `service_account`, `key_path` (percorso sulla VPS, **mai** la chiave), `project_id`, `datasets` autorizzati, `billing: "progetto cliente"`, **`bq_users: [id, ...]`** (chi può interrogare: id di `_meta/authors.md`), dimensione dei dataset grandi.
- `clients/<slug>/index.md` (Data warehouse): `project_id` e account proprietario del progetto.
- Voce in `clients/<slug>/log.md` e in `clients/log.md`, poi `/pubblica`.

---

## 3. Regole e insidie

- **Mai** la chiave nel repo, sui PC, in chat o via email. Esiste solo in `/srv/secrets/bigquery/`.
- **Tetto ai byte letti obbligatorio** su ogni query (`maximumBytesBilled`): un export GA4 pesa decine di GB (es. 50+ GB) e il gratuito è 1 TB/mese per account di fatturazione.
- Google Ads (`ads_*`): `_DATA_DATE = _LATEST_DATE` **solo** sulle tabelle di metadata, mai sulle `*Stats` (usare `segments_date`).
- **Location dei dataset:** BigQuery non unisce in una query dataset di regioni diverse (es. GA4 ed e-commerce in `us-west2`, Google Ads in `EU`, Search Console in `europe-west4`) e lo segnala con un "Access Denied" fuorviante. `bq_schema` senza dataset mostra la location di ciascuno; `bq_query` rifiuta subito in chiaro. Si fanno query separate e si confrontano i risultati.
- **Fine rapporto con un cliente:** togliere il service account da IAM e dalle autorizzazioni dei dataset del suo progetto, e la sorgente da `config.yaml`.
- Il connettore BigQuery nativo di Claude resta **personale** (un account per utente): utile per esplorare, non è la soluzione condivisa.

## 4. Interrogare i dati: `bq_schema` e `bq_query`
Dal 2026-10-21 il server MCP `vault-asernet` (≥ 1.4.0) espone due tool che girano **sulla VPS** con questo service account. Basta la chiave SSH del repo; dopo il pull va riavviato Claude Desktop per vederli.
- `bq_schema(cliente, dataset?, table?)` → dataset ammessi con la loro location, tabelle, colonne.
- `bq_query(cliente, sql, max_rows?)` → una `SELECT`/`WITH`, max 1000 righe, 60 s.
- Il cliente è interrogabile **solo** se in `config.yaml` la sorgente BigQuery ha `enabled: true` e `auth: service_account` (§2.5): quella sezione è l'interruttore.
- **Chi può interrogarlo (decisione B, 2026-10-21):** solo gli utenti in `bq_users`. Elenco assente o vuoto = nessuno. L'utente lo stabilisce la chiave SSH, non il PC. Per abilitare un collega si aggiunge il suo id e si pubblica: la modifica resta tracciata in `git log`.
- Rifiuti automatici: DML/DDL, più statement, tabelle fuori dai dataset ammessi, stima oltre **10 GB** (su GA4 filtrare `_TABLE_SUFFIX`).
- Ogni chiamata è registrata in `/var/log/asernet-bq/queries.log` con l'utente della chiave SSH.
- Dettagli tecnici e reinstallazione: `tools/vault-mcp/README.md`.

**Prossimo passo fuori da questa SOP:** refresh automatico di `key-metrics.md` con lo stesso service account (Gate 9/10 DOE prima dello scheduling).

## 5. Clienti collegati

| Cliente | Progetto GCP | Dataset autorizzati | Collegato il | Da |
|---|---|---|---|---|
| *(nessuno: si registra qui ogni cliente collegato)* | — | — | — | — |
