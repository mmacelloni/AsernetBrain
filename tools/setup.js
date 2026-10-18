#!/usr/bin/env node
'use strict';

/**
 * setup.js — Installer automatico one-click per i colleghi di AsernetBrain (Windows & macOS).
 *
 * Cosa configura in automatico sulla macchina del collega:
 *   1. Imposta `git config --local merge.ours.driver true` sul repository locale.
 *   2. Verifica se `@tobilu/qmd` è installato in locale; se manca, lo installa via `npm install -g @tobilu/qmd`.
 *   3. Crea/aggiorna l'indice QMD locale dedicato `asernetbrain` con le 3 collection:
 *      - `asernet-wiki`    -> `<vault>/wiki`
 *      - `asernet-clients` -> `<vault>/clients`
 *      - `asernet-topics`  -> `<vault>/topics`
 *      ed esegue `qmd --index asernetbrain update` (+ `embed`).
 *   4. Configura automaticamente Claude Desktop (`claude_desktop_config.json`) iniettando
 *      con percorsi assoluti (anti-bug PATH su Windows/Mac) entrambi i server MCP locali:
 *      - `vault-asernet` (operazioni Git sicure su AsernetBrain)
 *      - `qmd-asernet`   (ricerca ibrida BM25 + vettoriale su AsernetBrain)
 */

const { execSync, spawnSync } = require('child_process');
const fs = require('fs');
const os = require('os');
const path = require('path');

const VAULT_PATH = path.resolve(__dirname, '..');
const IS_WIN = process.platform === 'win32';
const HOME = os.homedir();

// Parsing argomento --user <id> (es. node tools/setup.js --user marco)
let userArg = null;
for (let i = 2; i < process.argv.length; i++) {
  if (process.argv[i] === '--user' && process.argv[i + 1]) {
    userArg = process.argv[i + 1].trim().toLowerCase();
    i++;
  } else if (process.argv[i].startsWith('--user=')) {
    userArg = process.argv[i].split('=')[1].trim().toLowerCase();
  }
}

function parseAuthors() {
  const authorsFile = path.join(VAULT_PATH, '_meta', 'authors.md');
  const map = {};
  if (!fs.existsSync(authorsFile)) return map;
  const lines = fs.readFileSync(authorsFile, 'utf8').split(/\r?\n/);
  for (const line of lines) {
    const m = line.match(/^\|\s*`([^`]+)`\s*\|\s*human\s*\|\s*([^|]+?)\s*\|\s*([^|\s]+@[^|\s]+)\s*\|/i);
    if (m) {
      map[m[1].trim().toLowerCase()] = {
        id: m[1].trim().toLowerCase(),
        name: m[2].trim(),
        email: m[3].trim(),
      };
    }
  }
  return map;
}

function log(step, msg) {
  console.log(`\x1b[36m[${step}]\x1b[0m ${msg}`);
}

function ok(msg) {
  console.log(`  \x1b[32m✓\x1b[0m ${msg}`);
}

function warn(msg) {
  console.log(`  \x1b[33m⚠\x1b[0m ${msg}`);
}

function whichBin(cmd) {
  try {
    const checkCmd = IS_WIN ? `where ${cmd}` : `which ${cmd}`;
    const out = execSync(checkCmd, { encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] })
      .trim()
      .split(/\r?\n/);
    if (IS_WIN) {
      const cmdFile = out.find((p) => p.toLowerCase().endsWith('.cmd') || p.toLowerCase().endsWith('.exe'));
      return cmdFile || out[0];
    }
    if (out[0]) return out[0];
  } catch {
    // fallback per macOS Finder (dove /opt/homebrew/bin non è nel PATH base)
  }
  if (!IS_WIN) {
    for (const dir of ['/opt/homebrew/bin', '/usr/local/bin', path.join(HOME, '.local', 'bin')]) {
      const candidate = path.join(dir, cmd);
      if (fs.existsSync(candidate)) return candidate;
    }
  }
  return null;
}

console.log('\n====================================================');
console.log('   🚀 Setup Automatico AsernetBrain (Git MCP + QMD)');
console.log('====================================================');
console.log(`  Sistema : ${process.platform} (${os.hostname()})`);
console.log(`  Vault   : ${VAULT_PATH}`);
if (userArg) console.log(`  Utente  : ${userArg}`);
console.log('');

// ------------------------------------------------------------------ 1. Git local config
log('1/4', 'Configurazione Git locale (merge driver, git hooks per personal/ e identità _meta/authors.md)...');
try {
  execSync('git config --local merge.ours.driver true', { cwd: VAULT_PATH, stdio: 'ignore' });
  execSync('git config --local core.hooksPath .githooks', { cwd: VAULT_PATH, stdio: 'ignore' });
  ok('git config --local merge.ours.driver = true & core.hooksPath = .githooks');
} catch (e) {
  warn(`Impossibile impostare config Git locale: ${e.message}`);
}

const authors = parseAuthors();
if (userArg && authors[userArg]) {
  const a = authors[userArg];
  try {
    execSync(`git config --local user.name "${a.name}"`, { cwd: VAULT_PATH, stdio: 'ignore' });
    execSync(`git config --local user.email "${a.email}"`, { cwd: VAULT_PATH, stdio: 'ignore' });
    ok(`Identità Git locale impostata da _meta/authors.md: ${a.id} -> ${a.name} <${a.email}>`);
  } catch (e) {
    warn(`Impossibile configurare user.name/email locale: ${e.message}`);
  }
} else if (userArg && !authors[userArg]) {
  warn(`Utente "${userArg}" non trovato in _meta/authors.md (utenti registrati: ${Object.keys(authors).join(', ')})`);
}

try {
  const email = execSync('git config user.email', { cwd: VAULT_PATH, encoding: 'utf8' }).trim();
  if (email) {
    const matched = Object.values(authors).find((a) => a.email.toLowerCase() === email.toLowerCase());
    if (matched) {
      if (!userArg) userArg = matched.id;
      ok(`Identità Git attiva verificata in _meta/authors.md: ${matched.id} (${email})`);
    } else {
      warn(`git config user.email (${email}) non corrisponde a _meta/authors.md. Passa --user <id> (es. node tools/setup.js --user marco).`);
    }
  } else {
    warn('git config user.email è vuoto! Esegui: node tools/setup.js --user <id>');
  }
} catch {
  warn('git config user.email non configurato! Esegui: node tools/setup.js --user <id>');
}

function resolveQmdJs(qmdBinPath) {
  const candidates = [];
  if (qmdBinPath) {
    const binDir = path.dirname(qmdBinPath);
    candidates.push(path.join(binDir, 'node_modules', '@tobilu', 'qmd', 'dist', 'cli', 'qmd.js'));
    candidates.push(path.join(binDir, '..', 'lib', 'node_modules', '@tobilu', 'qmd', 'dist', 'cli', 'qmd.js'));
  }
  try {
    const npmRoot = execSync('npm root -g', { encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] }).trim();
    if (npmRoot) {
      candidates.push(path.join(npmRoot, '@tobilu', 'qmd', 'dist', 'cli', 'qmd.js'));
    }
  } catch {
    // ignore
  }
  for (const c of candidates) {
    if (fs.existsSync(c)) return c;
  }
  return null;
}

const nodeBin = process.execPath || whichBin('node') || 'node';

// ------------------------------------------------------------------ 2. QMD install check
log('2/4', 'Verifica installazione motore di ricerca locale QMD (@tobilu/qmd)...');
let qmdBin = whichBin('qmd');
let qmdJs = resolveQmdJs(qmdBin);
if (!qmdBin && !qmdJs) {
  console.log('  → QMD non trovato sulla macchina. Installazione automatica con npm install -g @tobilu/qmd...');
  try {
    execSync('npm install -g @tobilu/qmd', { stdio: 'inherit' });
    qmdBin = whichBin('qmd');
    qmdJs = resolveQmdJs(qmdBin);
    ok(`QMD installato con successo: ${qmdJs || qmdBin || 'qmd'}`);
  } catch (e) {
    warn(`Installazione automatica QMD fallita (${e.message}). Riprova manualmente con: npm install -g @tobilu/qmd`);
  }
} else {
  ok(`QMD già presente: ${qmdJs || qmdBin}`);
}

function runQmd(args, opts = {}) {
  if (qmdJs) {
    return spawnSync(nodeBin, [qmdJs, ...args], {
      cwd: VAULT_PATH,
      encoding: 'utf8',
      ...opts,
    });
  }
  return spawnSync(qmdBin || 'qmd', args, {
    cwd: VAULT_PATH,
    encoding: 'utf8',
    shell: IS_WIN,
    ...opts,
  });
}

// ------------------------------------------------------------------ 2b. Inizializzazione & Sync Sub-Repo Privato (personal/)
log('2b/4', 'Configurazione Sub-Repo Git Privato (personal/ -> /srv/git/personal/<utente>.git)...');
const personalDir = path.join(VAULT_PATH, 'personal');
const personalGitDir = path.join(personalDir, '.git');
const personalRemote = userArg ? `git@152.228.134.98:/srv/git/personal/${userArg}.git` : null;

if (personalRemote && !fs.existsSync(personalGitDir)) {
  if (!fs.existsSync(personalDir) || fs.readdirSync(personalDir).length === 0) {
    console.log(`  → Tentativo clone di ${personalRemote} in personal/...`);
    const cl = spawnSync('git', ['clone', personalRemote, personalDir], { cwd: VAULT_PATH, encoding: 'utf8' });
    if (cl.status === 0) {
      ok(`Clonato sub-repo personale da ${personalRemote}`);
    }
  }
  if (!fs.existsSync(personalGitDir)) {
    fs.mkdirSync(personalDir, { recursive: true });
    spawnSync('git', ['init', '-b', 'main'], { cwd: personalDir, stdio: 'ignore' });
    spawnSync('git', ['remote', 'add', 'origin', personalRemote], { cwd: personalDir, stdio: 'ignore' });
    const f = spawnSync('git', ['fetch', 'origin'], { cwd: personalDir, encoding: 'utf8' });
    if (f.status === 0 && f.stderr && f.stderr.includes('main')) {
      spawnSync('git', ['reset', '--mixed', 'origin/main'], { cwd: personalDir, stdio: 'ignore' });
      spawnSync('git', ['branch', '--set-upstream-to=origin/main', 'main'], { cwd: personalDir, stdio: 'ignore' });
    }
    ok(`Inizializzato sub-repo Git personale collegato a ${personalRemote}`);
  }
} else if (fs.existsSync(personalGitDir)) {
  spawnSync('git', ['pull', '--ff-only'], { cwd: personalDir, stdio: 'ignore' });
  ok('Sub-repo personale (personal/.git) sincronizzato con la VPS.');
}

for (const sub of ['notes', 'connectors', 'data']) {
  const p = path.join(personalDir, sub);
  if (!fs.existsSync(p)) fs.mkdirSync(p, { recursive: true });
  const gk = path.join(p, '.gitkeep');
  if (!fs.existsSync(gk)) fs.writeFileSync(gk, '', 'utf8');
}

const personalGitignore = path.join(personalDir, '.gitignore');
if (!fs.existsSync(personalGitignore)) {
  fs.writeFileSync(
    personalGitignore,
    `# Escludi database SQLite e segreti dal sub-repo personale\n*.db\n*.db-journal\n*.db-wal\n*.sqlite\n.env\n.env.*\n__pycache__/\n`,
    'utf8'
  );
}

if (userArg && authors[userArg] && fs.existsSync(personalGitDir)) {
  const a = authors[userArg];
  spawnSync('git', ['config', '--local', 'user.name', a.name], { cwd: personalDir, stdio: 'ignore' });
  spawnSync('git', ['config', '--local', 'user.email', a.email], { cwd: personalDir, stdio: 'ignore' });
}

const personalIndex = path.join(personalDir, 'index.md');
if (!fs.existsSync(personalIndex)) {
  fs.writeFileSync(
    personalIndex,
    `---\ntitle: "Angolino Personale (${userArg || 'utente'})"\nuser: "${userArg || 'utente'}"\ntype: personal-dashboard\nupdated: ${new Date().toISOString().slice(0, 10)}\n---\n\n# 🔒 Spazio Riservato Personale (${userArg || 'utente'})\n\n> Questo file vive nel tuo sub-repo Git privato (\`/srv/git/personal/${userArg || 'utente'}.git\`, inaccessibile agli altri colleghi) ed è indicizzato dal tuo QMD locale (\`asernet-personal\`).\n\n## Priorità Personali\n- \n\n## Note Rapide\n- \n`,
    'utf8'
  );
  ok('Creato personal/index.md');
}
const personalClickup = path.join(personalDir, 'tasks-clickup.md');
if (!fs.existsSync(personalClickup)) {
  fs.writeFileSync(
    personalClickup,
    `---\ntitle: "I Miei Task ClickUp"\nuser: "${userArg || 'utente'}"\ntype: personal-tasks\nupdated: ${new Date().toISOString().slice(0, 10)}\n---\n\n# 📋 Task Personali ClickUp (Solo Tuoi)\n\n> File autogenerato dal connettore ClickUp personale (\`personal/data/refresh_personal.py\`). Sincronizzato tra i tuoi dispositivi tramite \`/srv/git/personal/${userArg || 'utente'}.git\`.\n\n| Stato | Scadenza | Task | Cliente / Progetto | Priorità |\n|---|---|---|---|---|\n| *(In attesa di sincronizzazione ClickUp personale)* | — | — | — | — |\n`,
    'utf8'
  );
  ok('Creato personal/tasks-clickup.md');
}

if (fs.existsSync(personalGitDir) && personalRemote) {
  spawnSync('git', ['add', '-A'], { cwd: personalDir, stdio: 'ignore' });
  const st = spawnSync('git', ['status', '--porcelain'], { cwd: personalDir, encoding: 'utf8' });
  if (st.stdout && st.stdout.trim().length > 0) {
    spawnSync('git', ['commit', '-m', `${new Date().toISOString().slice(0, 10)} | ${userArg || 'user'} | personal | Init/update personal workspace`], { cwd: personalDir, stdio: 'ignore' });
  }
  const ps = spawnSync('git', ['push', '-u', 'origin', 'main'], { cwd: personalDir, encoding: 'utf8' });
  if (ps.status === 0) {
    ok(`Sub-repo personale pushato su ${personalRemote}`);
  }
}

// ------------------------------------------------------------------ 3. QMD collections & index
log('3/4', 'Configurazione indice locale QMD (--index asernetbrain) e collection...');
const collections = [
  {
    name: 'asernet-wiki',
    dir: path.join(VAULT_PATH, 'wiki'),
    context: 'Knowledge base aziendale Asernet governata (OKF): SOP, procedure interne, prodotti, partner, concetti e fonti validate.',
  },
  {
    name: 'asernet-clients',
    dir: path.join(VAULT_PATH, 'clients'),
    context: 'Schede operative clienti Asernet (AIOS + DataPyx): contesto stabile (index.md), stato volatile (state.md), diagnosi (purpose.md), metriche (key-metrics.md), contatti, progetti e log riunioni.',
  },
  {
    name: 'asernet-topics',
    dir: path.join(VAULT_PATH, 'topics'),
    context: 'Domini tecnici verticali Asernet: networking, sviluppo software, AI, marketing e best practice tecniche.',
  },
  {
    name: 'asernet-personal',
    dir: path.join(VAULT_PATH, 'personal'),
    context: 'Spazio privato locale del singolo utente: task personali sincronizzati da ClickUp (tasks-clickup.md), cruscotto personale (index.md) e appunti riservati.',
  },
];

if (qmdJs || qmdBin) {
  for (const c of collections) {
    if (fs.existsSync(c.dir)) {
      const res = runQmd(['--index', 'asernetbrain', 'collection', 'add', c.dir, '--name', c.name]);
      if (res.status === 0 || (res.stderr && res.stderr.includes('already'))) {
        ok(`Collection registrata: ${c.name} -> ${c.dir}`);
      } else {
        ok(`Collection verificata: ${c.name}`);
      }
      if (c.context) {
        runQmd(['--index', 'asernetbrain', 'context', 'add', `qmd://${c.name}/`, c.context]);
      }
    }
  }

  console.log('  → Aggiornamento indice QMD (qmd --index asernetbrain update & embed)...');
  runQmd(['--index', 'asernetbrain', 'update'], { stdio: 'inherit' });
  runQmd(['--index', 'asernetbrain', 'embed'], { stdio: 'inherit' });
} else {
  warn('Salto configurazione collection QMD (binario qmd non disponibile).');
}

// ------------------------------------------------------------------ 4. Claude Desktop MCP config
log('4/4', 'Registrazione automatica Server MCP (vault-asernet + qmd-asernet) in Claude Desktop...');

const IS_MAC = process.platform === 'darwin';
const claudeConfigPath = IS_WIN
  ? path.join(process.env.APPDATA || path.join(HOME, 'AppData', 'Roaming'), 'Claude', 'claude_desktop_config.json')
  : IS_MAC
    ? path.join(HOME, 'Library', 'Application Support', 'Claude', 'claude_desktop_config.json')
    : path.join(HOME, '.config', 'Claude', 'claude_desktop_config.json');

try {
  fs.mkdirSync(path.dirname(claudeConfigPath), { recursive: true });
  let cfg = {};
  if (fs.existsSync(claudeConfigPath)) {
    const raw = fs.readFileSync(claudeConfigPath, 'utf8');
    // Backup di sicurezza
    fs.writeFileSync(`${claudeConfigPath}.bak-asernetbrain`, raw, 'utf8');
    cfg = JSON.parse(raw);
  }
  if (!cfg.mcpServers || typeof cfg.mcpServers !== 'object') {
    cfg.mcpServers = {};
  }

  const serverJs = path.join(VAULT_PATH, 'tools', 'vault-mcp', 'server.js');
  const qmdMcpJs = path.join(VAULT_PATH, 'tools', 'qmd-mcp.js');
  const qmdDbPath = path.join(HOME, '.cache', 'qmd', 'asernetbrain.sqlite');
  const unixPath = `/opt/homebrew/bin:/usr/local/bin:${process.env.PATH || '/usr/bin:/bin:/usr/sbin:/sbin'}`;

  cfg.mcpServers['vault-asernet'] = {
    command: nodeBin,
    args: [serverJs],
    env: IS_WIN
      ? { VAULT_PATH: VAULT_PATH }
      : { VAULT_PATH: VAULT_PATH, HOME: HOME, PATH: unixPath },
  };

  cfg.mcpServers['qmd-asernet'] = {
    command: nodeBin,
    args: [qmdMcpJs],
    env: IS_WIN
      ? { HOME: HOME, INDEX_PATH: qmdDbPath }
      : { HOME: HOME, INDEX_PATH: qmdDbPath, PATH: unixPath },
  };

  fs.writeFileSync(claudeConfigPath, JSON.stringify(cfg, null, 2) + '\n', 'utf8');
  ok(`Claude Desktop configurato: ${claudeConfigPath}`);
  ok(`  • MCP Git : vault-asernet (${serverJs})`);
  ok(`  • MCP QMD : qmd-asernet   (${qmdMcpJs})`);
} catch (e) {
  warn(`Impossibile aggiornare automaticamente claude_desktop_config.json: ${e.message}`);
}

console.log('\n====================================================');
console.log('   ✅ Setup AsernetBrain completato!');
console.log('   Riavvia Claude Desktop (Cmd+Q su Mac / Esci dalla tray su Windows) per attivare i 2 server MCP.');
console.log('====================================================\n');
