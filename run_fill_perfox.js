const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');
const { PROJECT_ROOT, TEMPLATE_FILE, equipmentDir, assertFiles } = require('./lib/paths');

const LOG_FILE = path.join(PROJECT_ROOT, 'build-perfox-log.txt');

function log(msg) {
  const line = `[${new Date().toISOString()}] ${msg}`;
  console.log(msg);
  fs.appendFileSync(LOG_FILE, line + '\n', 'utf8');
}

try {
  fs.writeFileSync(LOG_FILE, '', 'utf8');
  log('Start PerfoX build');
  log(`Project: ${PROJECT_ROOT}`);

  const folderName = 'PerfoX 3000B-1 РК-МИ-026055';
  const folder = equipmentDir(folderName);
  const template = TEMPLATE_FILE;
  const componentsFile = path.join(folder, 'perfox_components.json');
  const block2File = path.join(folder, 'block2.txt');
  const output = path.join(folder, `ТС ${folderName}.doc`);

  assertFiles('PerfoX', [
    path.join(PROJECT_ROOT, 'run_fill_perfox.js'),
    path.join(PROJECT_ROOT, 'fill_perfox_word.ps1'),
    path.join(PROJECT_ROOT, 'fill_ts_helpers.ps1'),
    path.join(folder, 'perfox_main.json'),
    componentsFile,
    block2File,
    path.join(folder, 'section4.txt'),
    template,
  ]);

  log(`Template: ${template}`);
  log(`Output: ${output}`);

  process.env.PERFOX_FOLDER = folder;
  process.env.PERFOX_TEMPLATE = template;
  process.env.PERFOX_OUTPUT = output;
  process.env.PERFOX_COMPONENTS = componentsFile;
  process.env.PERFOX_BLOCK2_FILE = block2File;
  process.env.PERFOX_SECTION4_FILE = path.join(folder, 'section4.txt');
  process.env.PERFOX_TRADE_NAME =
    'Система цифровой рентгенографии PerfoX 3000B-1 в комплекте с принадлежностями';
  process.env.TS_BLOCK4_MATCH = 'Требования условиям эксплуатации';

  execFileSync(
    'powershell',
    ['-NoProfile', '-ExecutionPolicy', 'Bypass', '-File', path.join(PROJECT_ROOT, 'fill_perfox_word.ps1')],
    { stdio: 'inherit', env: process.env }
  );

  log(`Done: ${output}`);
  console.log('\nГотово:', output);
} catch (err) {
  const text = err && err.message ? err.message : String(err);
  log(`ERROR: ${text}`);
  console.error('\nОШИБКА:\n' + text);
  console.error('\nПодробности в файле: build-perfox-log.txt');
  process.exit(1);
}
