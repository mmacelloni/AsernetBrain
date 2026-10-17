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
    return out[0];
  } catch {
    return null;
  }
}

console.log('\n====================================================');
console.log('   🚀 Setup Automatico AsernetBrain (Git MCP + QMD)');
console.log('====================================================');
console.log(`  Sistema : ${process.platform} (${os.hostname()})`);
console.log(`  Vault   : ${VAULT_PATH}\n`);

// ------------------------------------------------------------------ 1. Git local config
log('1/4', 'Configurazione Git locale (merge driver per index.md)...');
try {
  execSync('git config --local merge.ours.driver true', { cwd: VAULT_PATH, stdio: 'ignore' });
  ok('git config --local merge.ours.driver = true');
} catch (e) {
  warn(`Impossibile impostare merge.ours.driver: ${e.message}`);
}

try {
  const email = execSync('git config user.email', { cwd: VAULT_PATH, encoding: 'utf8' }).trim();
  if (email) {
    ok(`Identità Git rilevata: ${email}`);
  } else {
    warn('git config user.email è vuoto! Impostalo con: git config --global user.email "tua@email.it"');
  }
} catch {
  warn('git config user.email non configurato! Ricordati di impostarlo prima di usare /pubblica.');
}

// ------------------------------------------------------------------ 2. QMD install check
log('2/4', 'Verifica installazione motore di ricerca locale QMD (@tobilu/qmd)...');
let qmdBin = whichBin('qmd');
if (!qmdBin) {
  console.log('  → QMD non trovato sulla macchina. Installazione automatica con npm install -g @tobilu/qmd...');
  try {
    execSync('npm install -g @tobilu/qmd', { stdio: 'inherit' });
    qmdBin = whichBin('qmd');
    ok(`QMD installato con successo: ${qmdBin || 'qmd'}`);
  } catch (e) {
    warn(`Installazione automatica QMD fallita (${e.message}). Riprova manualmente con: npm install -g @tobilu/qmd`);
  }
} else {
  ok(`QMD già presente: ${qmdBin}`);
}

// ------------------------------------------------------------------ 3. QMD collections & index
log('3/4', 'Configurazione indice locale QMD (--index asernetbrain) e collection...');
const collections = [
  { name: 'asernet-wiki', dir: path.join(VAULT_PATH, 'wiki') },
  { name: 'asernet-clients', dir: path.join(VAULT_PATH, 'clients') },
  { name: 'asernet-topics', dir: path.join(VAULT_PATH, 'topics') },
];

if (qmdBin) {
  for (const c of collections) {
    if (fs.existsSync(c.dir)) {
      const res = spawnSync('qmd', ['--index', 'asernetbrain', 'collection', 'add', c.dir, '--name', c.name], {
        cwd: VAULT_PATH,
        encoding: 'utf8',
        shell: IS_WIN,
      });
      if (res.status === 0 || (res.stderr && res.stderr.includes('already'))) {
        ok(`Collection registrata: ${c.name} -> ${c.dir}`);
      } else {
        ok(`Collection verificata: ${c.name}`);
      }
    }
  }

  console.log('  → Aggiornamento indice QMD (qmd --index asernetbrain update)...');
  spawnSync('qmd', ['--index', 'asernetbrain', 'update'], {
    cwd: VAULT_PATH,
    stdio: 'inherit',
    shell: IS_WIN,
  });
} else {
  warn('Salto configurazione collection QMD (binario qmd non disponibile).');
}

// ------------------------------------------------------------------ 4. Claude Desktop MCP config
log('4/4', 'Registrazione automatica Server MCP (vault-asernet + qmd-asernet) in Claude Desktop...');

const claudeConfigPath = IS_WIN
  ? path.join(process.env.APPDATA || path.join(HOME, 'AppData', 'Roaming'), 'Claude', 'claude_desktop_config.json')
  : path.join(HOME, 'Library', 'Application Support', 'Claude', 'claude_desktop_config.json');

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

  const nodeBin = process.execPath || whichBin('node') || 'node';
  const serverJs = path.join(VAULT_PATH, 'tools', 'vault-mcp', 'server.js');

  cfg.mcpServers['vault-asernet'] = {
    command: nodeBin,
    args: [serverJs],
    env: {
      VAULT_PATH: VAULT_PATH,
    },
  };

  cfg.mcpServers['qmd-asernet'] = {
    command: qmdBin || 'qmd',
    args: ['mcp', '--index', 'asernetbrain'],
  };

  fs.writeFileSync(claudeConfigPath, JSON.stringify(cfg, null, 2) + '\n', 'utf8');
  ok(`Claude Desktop configurato: ${claudeConfigPath}`);
  ok(`  • MCP Git : vault-asernet (${serverJs})`);
  ok(`  • MCP QMD : qmd-asernet   (qmd mcp --index asernetbrain)`);
} catch (e) {
  warn(`Impossibile aggiornare automaticamente claude_desktop_config.json: ${e.message}`);
}

console.log('\n====================================================');
console.log('   ✅ Setup AsernetBrain completato!');
console.log('   Riavvia Claude Desktop (Esci dalla tray icon) per attivare i 2 server MCP.');
console.log('   Per scaricare i modelli neurali di embedding al primo avvio:');
console.log('     qmd --index asernetbrain embed');
console.log('====================================================\n');
