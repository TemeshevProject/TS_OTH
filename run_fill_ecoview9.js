const path = require('path');
const { execFileSync } = require('child_process');
const { PROJECT_ROOT, TEMPLATE_FILE, equipmentDir, assertFiles } = require('./lib/paths');

const folderName = 'EcoView 9 РК-МТ-010772';
const folder = equipmentDir(folderName);
const template = TEMPLATE_FILE;
const componentsFile = path.join(folder, 'ecoview9_components.json');
const block2File = path.join(folder, 'block2.txt');
const output = path.join(folder, `ТС ${folderName}.doc`);

try {
  console.log('Start EcoView 9 build');
  console.log('Project:', PROJECT_ROOT);

  assertFiles('EcoView 9', [
    path.join(PROJECT_ROOT, 'fill_ecoview9_word.ps1'),
    path.join(PROJECT_ROOT, 'fill_ts_helpers.ps1'),
    path.join(folder, 'ecoview9_main.json'),
    componentsFile,
    block2File,
    path.join(folder, 'section4.txt'),
    template,
  ]);

  console.log('Template:', template);
  console.log('Output:', output);

  process.env.ECOVIEW9_FOLDER = folder;
  process.env.ECOVIEW9_TEMPLATE = template;
  process.env.ECOVIEW9_OUTPUT = output;
  process.env.ECOVIEW9_COMPONENTS = componentsFile;
  process.env.ECOVIEW9_BLOCK2_FILE = block2File;
  process.env.ECOVIEW9_SECTION4_FILE = path.join(folder, 'section4.txt');
  process.env.ECOVIEW9_TRADE_NAME = 'Система цифровой рентгенографии/флюорографии EcoView 9';
  process.env.TS_BLOCK4_MATCH = 'Требования условиям эксплуатации';

  execFileSync(
    'powershell',
    ['-NoProfile', '-ExecutionPolicy', 'Bypass', '-File', path.join(PROJECT_ROOT, 'fill_ecoview9_word.ps1')],
    { stdio: 'inherit', env: process.env }
  );

  console.log('\nDone:', output);
} catch (err) {
  console.error('\nERROR:\n' + (err.message || err));
  process.exit(1);
}
