const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');
const { PROJECT_ROOT, TEMPLATE_FILE, equipmentDir, assertFiles } = require('./lib/paths');

const folderName = 'OPERA РК-МТ-7№007361';
const folder = equipmentDir(folderName);
const template = TEMPLATE_FILE;
const componentsFile = path.join(folder, 'opera_components.json');
const block2File = path.join(folder, 'block2.txt');
const output = path.join(folder, `ТС ${folderName}.doc`);

try {
  console.log('Start OPERA build');
  console.log('Project:', PROJECT_ROOT);

  assertFiles('OPERA', [
    path.join(PROJECT_ROOT, 'fill_opera_word.ps1'),
    path.join(PROJECT_ROOT, 'fill_ts_helpers.ps1'),
    path.join(folder, 'opera_main.json'),
    componentsFile,
    block2File,
    path.join(folder, 'section4.txt'),
    template,
  ]);

  console.log('Template:', template);
  console.log('Output:', output);

  process.env.OPERA_FOLDER = folder;
  process.env.OPERA_TEMPLATE = template;
  process.env.OPERA_OUTPUT = output;
  process.env.OPERA_COMPONENTS = componentsFile;
  process.env.OPERA_BLOCK2_FILE = block2File;
  process.env.OPERA_SECTION4_FILE = path.join(folder, 'section4.txt');
  process.env.OPERA_TRADE_NAME = 'Система рентгенодиагностическая OPERA в комплекте';
  process.env.TS_BLOCK4_MATCH = 'Требования условиям эксплуатации';

  execFileSync(
    'powershell',
    ['-NoProfile', '-ExecutionPolicy', 'Bypass', '-File', path.join(PROJECT_ROOT, 'fill_opera_word.ps1')],
    { stdio: 'inherit', env: process.env }
  );

  console.log('\nDone:', output);
} catch (err) {
  console.error('\nERROR:\n' + (err.message || err));
  process.exit(1);
}
