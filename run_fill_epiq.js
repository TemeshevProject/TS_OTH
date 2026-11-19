const path = require('path');
const { execFileSync } = require('child_process');
const { PROJECT_ROOT, TEMPLATE_FILE, equipmentDir, assertFiles } = require('./lib/paths');

const folderName = 'EPIQ РК МИ-027246';
const folder = equipmentDir(folderName);
const template = TEMPLATE_FILE;
const componentsFile = path.join(folder, 'epiq_components.json');
const block2File = path.join(folder, 'block2.txt');
const output = path.join(folder, `ТС ${folderName}.doc`);

try {
  console.log('Start EPIQ build');
  console.log('Project:', PROJECT_ROOT);

  require(path.join(folder, 'build_epiq_components.js'));

  assertFiles('EPIQ', [
    path.join(PROJECT_ROOT, 'fill_epiq_word.ps1'),
    path.join(PROJECT_ROOT, 'fill_ts_helpers.ps1'),
    path.join(folder, 'epiq_main.json'),
    componentsFile,
    block2File,
    path.join(folder, 'section4.txt'),
    template,
  ]);

  process.env.EPIQ_FOLDER = folder;
  process.env.EPIQ_TEMPLATE = template;
  process.env.EPIQ_OUTPUT = output;
  process.env.EPIQ_COMPONENTS = componentsFile;
  process.env.EPIQ_BLOCK2_FILE = block2File;
  process.env.EPIQ_SECTION4_FILE = path.join(folder, 'section4.txt');
  process.env.EPIQ_TRADE_NAME =
    'Система ультразвуковая диагностическая с принадлежностями, в варианте исполнения: EPIQ';
  process.env.TS_BLOCK4_MATCH = 'Требования условиям эксплуатации';

  execFileSync(
    'powershell',
    ['-NoProfile', '-ExecutionPolicy', 'Bypass', '-File', path.join(PROJECT_ROOT, 'fill_epiq_word.ps1')],
    { stdio: 'inherit', env: process.env }
  );

  console.log('\nDone:', output);
} catch (err) {
  console.error('\nERROR:\n' + (err.message || err));
  process.exit(1);
}