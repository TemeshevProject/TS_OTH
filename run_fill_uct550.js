const path = require('path');
const { execFileSync } = require('child_process');
const { PROJECT_ROOT, TEMPLATE_FILE, equipmentDir, assertFiles } = require('./lib/paths');

const folderName = 'uCT 550 РК-МТ-021991';
const folder = equipmentDir(folderName);
const template = TEMPLATE_FILE;
const componentsFile = path.join(folder, 'uct550_components.json');
const block2File = path.join(folder, 'block2.txt');
const output = path.join(folder, `ТС ${folderName}.doc`);

try {
  console.log('Start uCT 550 build');
  console.log('Project:', PROJECT_ROOT);

  assertFiles('uCT 550', [
    path.join(PROJECT_ROOT, 'fill_uct550_word.ps1'),
    path.join(PROJECT_ROOT, 'fill_ts_helpers.ps1'),
    path.join(folder, 'uct550_main.json'),
    componentsFile,
    block2File,
    path.join(folder, 'section4.txt'),
    template,
  ]);

  console.log('Template:', template);
  console.log('Output:', output);

  process.env.UCT550_FOLDER = folder;
  process.env.UCT550_TEMPLATE = template;
  process.env.UCT550_OUTPUT = output;
  process.env.UCT550_COMPONENTS = componentsFile;
  process.env.UCT550_BLOCK2_FILE = block2File;
  process.env.UCT550_SECTION4_FILE = path.join(folder, 'section4.txt');
  process.env.UCT550_TRADE_NAME = 'Компьютерный Томограф uCT 550';
  process.env.TS_BLOCK4_MATCH = 'Требования условиям эксплуатации';

  execFileSync(
    'powershell',
    ['-NoProfile', '-ExecutionPolicy', 'Bypass', '-File', path.join(PROJECT_ROOT, 'fill_uct550_word.ps1')],
    { stdio: 'inherit', env: process.env }
  );

  console.log('\nDone:', output);
} catch (err) {
  console.error('\nERROR:\n' + (err.message || err));
  process.exit(1);
}
