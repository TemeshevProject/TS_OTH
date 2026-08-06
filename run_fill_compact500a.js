const path = require('path');
const { execFileSync } = require('child_process');
const { PROJECT_ROOT, TEMPLATE_FILE, equipmentDir, assertFiles } = require('./lib/paths');

const folderName = 'CompaX 500A РК-МТ-026279';
const folder = equipmentDir(folderName);
const template = TEMPLATE_FILE;
const componentsFile = path.join(folder, 'compact500a_components.json');
const block2File = path.join(folder, 'block2.txt');
const output = path.join(folder, `ТС ${folderName}.doc`);

try {
  console.log('Start CompaX 500A build');
  console.log('Project:', PROJECT_ROOT);

  assertFiles('CompaX 500A', [
    path.join(PROJECT_ROOT, 'fill_compact500a_word.ps1'),
    path.join(PROJECT_ROOT, 'fill_ts_helpers.ps1'),
    path.join(folder, 'compact500a_main.json'),
    componentsFile,
    block2File,
    path.join(folder, 'section4.txt'),
    template,
  ]);

  console.log('Template:', template);
  console.log('Output:', output);

  process.env.COMPACT500A_FOLDER = folder;
  process.env.COMPACT500A_TEMPLATE = template;
  process.env.COMPACT500A_OUTPUT = output;
  process.env.COMPACT500A_COMPONENTS = componentsFile;
  process.env.COMPACT500A_BLOCK2_FILE = block2File;
  process.env.COMPACT500A_SECTION4_FILE = path.join(folder, 'section4.txt');
  process.env.COMPACT500A_TRADE_NAME =
    'Мобильная рентгеновская система CompaX с С-дугой в варианте исполнения CompaX 500A в комплекте с принадлежностями';
  process.env.TS_BLOCK4_MATCH = 'Требования условиям эксплуатации';

  execFileSync(
    'powershell',
    ['-NoProfile', '-ExecutionPolicy', 'Bypass', '-File', path.join(PROJECT_ROOT, 'fill_compact500a_word.ps1')],
    { stdio: 'inherit', env: process.env }
  );

  console.log('\nDone:', output);
} catch (err) {
  console.error('\nERROR:\n' + (err.message || err));
  process.exit(1);
}
