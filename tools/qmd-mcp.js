#!/usr/bin/env node
'use strict';

/**
 * Wrapper multipiattaforma (macOS / Windows / Linux) per avviare il server MCP di QMD
 * puntando sempre all'indice isolato `asernetbrain` (~/.cache/qmd/asernetbrain.sqlite).
 *
 * Risolve automaticamente @tobilu/qmd anche quando l'app GUI Claude Desktop su macOS
 * non eredita /opt/homebrew/bin o /usr/local/bin nel PATH.
 */

const { spawn, execSync } = require('child_process');
const fs = require('fs');
const os = require('os');
const path = require('path');

const HOME = os.homedir();
const IS_WIN = process.platform === 'win32';

// Assicura che i percorsi standard macOS (Apple Silicon / Intel) e Linux siano nel PATH
if (!IS_WIN) {
  const extraPaths = ['/opt/homebrew/bin', '/usr/local/bin', path.join(HOME, '.nvm/versions/node')];
  const currentPath = process.env.PATH || '/usr/bin:/bin:/usr/sbin:/sbin';
  process.env.PATH = [...extraPaths, currentPath].join(':');
}

function findQmdJs() {
  const candidates = [];

  if (IS_WIN) {
    const appData = process.env.APPDATA || path.join(HOME, 'AppData', 'Roaming');
    candidates.push(path.join(appData, 'npm', 'node_modules', '@tobilu', 'qmd', 'dist', 'cli', 'qmd.js'));
  } else {
    candidates.push('/opt/homebrew/lib/node_modules/@tobilu/qmd/dist/cli/qmd.js');
    candidates.push('/usr/local/lib/node_modules/@tobilu/qmd/dist/cli/qmd.js');
    candidates.push(path.join(HOME, '.npm-global/lib/node_modules/@tobilu/qmd/dist/cli/qmd.js'));
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

const qmdJs = findQmdJs();
const qmdDbPath = process.env.INDEX_PATH || path.join(HOME, '.cache', 'qmd', 'asernetbrain.sqlite');

const env = {
  ...process.env,
  HOME,
  INDEX_PATH: qmdDbPath,
};

const child = qmdJs
  ? spawn(process.execPath, [qmdJs, '--index', 'asernetbrain', 'mcp'], { stdio: 'inherit', env })
  : spawn(IS_WIN ? 'qmd.cmd' : 'qmd', ['--index', 'asernetbrain', 'mcp'], { stdio: 'inherit', env, shell: IS_WIN });

child.on('exit', (code) => process.exit(code ?? 0));
child.on('error', (err) => {
  console.error(`[qmd-mcp] Errore avvio QMD MCP: ${err.message}`);
  process.exit(1);
});
