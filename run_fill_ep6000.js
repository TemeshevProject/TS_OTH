const path = require('path');
const { execFileSync } = require('child_process');
const { PROJECT_ROOT, TEMPLATE_FILE, equipmentDir, assertFiles } = require('./lib/paths');

const folderName = 'EP-6000 РК-МТ-020540';
const folder = equipmentDir(folderName);
const template = TEMPLATE_FILE;
const componentsFile = path.join(folder, 'ep6000_components.json');
const block2File = path.join(folder, 'block2.txt');
const output = path.join(folder, `ТС ${folderName}.doc`);

try {
  console.log('Start EP-6000 build');
  console.log('Project:', PROJECT_ROOT);

  assertFiles('EP-6000', [
    path.join(PROJECT_ROOT, 'fill_ep6000_word.ps1'),
    path.join(PROJECT_ROOT, 'fill_ts_helpers.ps1'),
    path.join(folder, 'ep6000_main.json'),
    componentsFile,
    block2File,
    path.join(folder, 'section4.txt'),
    template,
  ]);

  console.log('Template:', template);
  console.log('Output:', output);

  process.env.EP6000_FOLDER = folder;
  process.env.EP6000_TEMPLATE = template;
  process.env.EP6000_OUTPUT = output;
  process.env.EP6000_COMPONENTS = componentsFile;
  process.env.EP6000_BLOCK2_FILE = block2File;
  process.env.EP6000_SECTION4_FILE = path.join(folder, 'section4.txt');
  process.env.EP6000_TRADE_NAME = 'Эндоскопическая видеоинформационная система EP-6000';
  process.env.TS_BLOCK4_MATCH = 'Требования условиям эксплуатации';

  execFileSync(
    'powershell',
    ['-NoProfile', '-ExecutionPolicy', 'Bypass', '-File', path.join(PROJECT_ROOT, 'fill_ep6000_word.ps1')],
    { stdio: 'inherit', env: process.env }
  );

  console.log('\nDone:', output);
} catch (err) {
  console.error('\nERROR:\n' + (err.message || err));
  process.exit(1);
}
