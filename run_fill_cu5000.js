const path = require('path');
const { execFileSync } = require('child_process');
const { PROJECT_ROOT, TEMPLATE_FILE, equipmentDir, assertFiles } = require('./lib/paths');

const folderName = 'CU-5000 РК-МТ-013067';
const folder = equipmentDir(folderName);
const template = TEMPLATE_FILE;
const componentsFile = path.join(folder, 'cu5000_components.json');
const block2File = path.join(folder, 'block2.txt');
const output = path.join(folder, `ТС ${folderName}.doc`);

try {
  console.log('Start CU-5000 build');
  console.log('Project:', PROJECT_ROOT);

  assertFiles('CU-5000', [
    path.join(PROJECT_ROOT, 'fill_cu5000_word.ps1'),
    path.join(PROJECT_ROOT, 'fill_ts_helpers.ps1'),
    path.join(folder, 'cu5000_main.json'),
    componentsFile,
    block2File,
    path.join(folder, 'section4.txt'),
    template,
  ]);

  console.log('Template:', template);
  console.log('Output:', output);

  process.env.CU5000_FOLDER = folder;
  process.env.CU5000_TEMPLATE = template;
  process.env.CU5000_OUTPUT = output;
  process.env.CU5000_COMPONENTS = componentsFile;
  process.env.CU5000_BLOCK2_FILE = block2File;
  process.env.CU5000_SECTION4_FILE = path.join(folder, 'section4.txt');
  process.env.CU5000_TRADE_NAME = 'Лор-комбайн модель CU-5000';
  process.env.TS_BLOCK4_MATCH = 'Требования условиям эксплуатации';

  execFileSync(
    'powershell',
    ['-NoProfile', '-ExecutionPolicy', 'Bypass', '-File', path.join(PROJECT_ROOT, 'fill_cu5000_word.ps1')],
    { stdio: 'inherit', env: process.env }
  );

  console.log('\nDone:', output);
} catch (err) {
  console.error('\nERROR:\n' + (err.message || err));
  process.exit(1);
}
