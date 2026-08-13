const path = require('path');
const { execFileSync } = require('child_process');
const { PROJECT_ROOT, TEMPLATE_FILE, equipmentDir, assertFiles } = require('./lib/paths');

const folderName = 'U1 РК-МТ-025853';
const folder = equipmentDir(folderName);
const template = TEMPLATE_FILE;
const componentsFile = path.join(folder, 'u1_components.json');
const block2File = path.join(folder, 'block2.txt');
const output = path.join(folder, `ТС ${folderName}.doc`);

try {
  console.log('Start U1 build');
  console.log('Project:', PROJECT_ROOT);

  require(path.join(folder, 'build_u1_components.js'));

  assertFiles('U1', [
    path.join(PROJECT_ROOT, 'fill_u1_word.ps1'),
    path.join(PROJECT_ROOT, 'fill_ts_helpers.ps1'),
    path.join(folder, 'u1_main.json'),
    componentsFile,
    block2File,
    path.join(folder, 'section4.txt'),
    template,
  ]);

  console.log('Template:', template);
  console.log('Output:', output);

  process.env.U1_FOLDER = folder;
  process.env.U1_TEMPLATE = template;
  process.env.U1_OUTPUT = output;
  process.env.U1_COMPONENTS = componentsFile;
  process.env.U1_BLOCK2_FILE = block2File;
  process.env.U1_SECTION4_FILE = path.join(folder, 'section4.txt');
  process.env.U1_TRADE_NAME = 'Система камеры эндоскопа U1 в комплекте с принадлежностями';
  process.env.TS_BLOCK4_MATCH = 'Требования условиям эксплуатации';

  execFileSync(
    'powershell',
    ['-NoProfile', '-ExecutionPolicy', 'Bypass', '-File', path.join(PROJECT_ROOT, 'fill_u1_word.ps1')],
    { stdio: 'inherit', env: process.env }
  );

  console.log('\nDone:', output);
} catch (err) {
  console.error('\nERROR:\n' + (err.message || err));
  process.exit(1);
}
