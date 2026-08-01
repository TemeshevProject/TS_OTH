const path = require('path');
const { execFileSync } = require('child_process');
const { PROJECT_ROOT, TEMPLATE_FILE, equipmentDir, assertFiles } = require('./lib/paths');

const folderName = 'Panda iRes Warmer РК-МИ (МТ)-028636';
const folder = equipmentDir(folderName);
const template = TEMPLATE_FILE;
const componentsFile = path.join(folder, 'pandaires_components.json');
const block2File = path.join(folder, 'block2.txt');
const output = path.join(folder, `ТС ${folderName}.doc`);

try {
  console.log('Start Panda iRes Warmer build');
  console.log('Project:', PROJECT_ROOT);

  assertFiles('Panda iRes Warmer', [
    path.join(PROJECT_ROOT, 'fill_pandaires_word.ps1'),
    path.join(PROJECT_ROOT, 'fill_ts_helpers.ps1'),
    path.join(folder, 'pandaires_main.json'),
    componentsFile,
    block2File,
    path.join(folder, 'section4.txt'),
    template,
  ]);

  console.log('Template:', template);
  console.log('Output:', output);

  process.env.PANDAIRES_FOLDER = folder;
  process.env.PANDAIRES_TEMPLATE = template;
  process.env.PANDAIRES_OUTPUT = output;
  process.env.PANDAIRES_COMPONENTS = componentsFile;
  process.env.PANDAIRES_BLOCK2_FILE = block2File;
  process.env.PANDAIRES_SECTION4_FILE = path.join(folder, 'section4.txt');
  process.env.PANDAIRES_TRADE_NAME =
    'Комплекс реанимационный открытый с принадлежностями, вариант исполнения Panda iRes Warmer';
  process.env.TS_BLOCK4_MATCH = 'Требования условиям эксплуатации';

  execFileSync(
    'powershell',
    ['-NoProfile', '-ExecutionPolicy', 'Bypass', '-File', path.join(PROJECT_ROOT, 'fill_pandaires_word.ps1')],
    { stdio: 'inherit', env: process.env }
  );

  console.log('\nDone:', output);
} catch (err) {
  console.error('\nERROR:\n' + (err.message || err));
  process.exit(1);
}
