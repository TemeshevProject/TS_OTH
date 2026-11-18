const path = require('path');
const { execFileSync } = require('child_process');
const { PROJECT_ROOT, TEMPLATE_FILE, equipmentDir, assertFiles } = require('./lib/paths');

const folderName = 'Магнитотурботрон ПРО РК-МИ-029840';
const folder = equipmentDir(folderName);
const template = TEMPLATE_FILE;
const componentsFile = path.join(folder, 'magnitoturbotron_components.json');
const block2File = path.join(folder, 'block2.txt');
const output = path.join(folder, `ТС ${folderName}.doc`);

try {
  console.log('Start Magnitoturbotron Pro build');
  console.log('Project:', PROJECT_ROOT);

  require(path.join(folder, 'build_magnitoturbotron_components.js'));

  assertFiles('Magnitoturbotron Pro', [
    path.join(PROJECT_ROOT, 'fill_magnitoturbotron_word.ps1'),
    path.join(PROJECT_ROOT, 'fill_ts_helpers.ps1'),
    path.join(folder, 'magnitoturbotron_main.json'),
    componentsFile,
    block2File,
    path.join(folder, 'section4.txt'),
    template,
  ]);

  console.log('Template:', template);
  console.log('Output:', output);

  process.env.MAGNITOTURBOTRON_FOLDER = folder;
  process.env.MAGNITOTURBOTRON_TEMPLATE = template;
  process.env.MAGNITOTURBOTRON_OUTPUT = output;
  process.env.MAGNITOTURBOTRON_COMPONENTS = componentsFile;
  process.env.MAGNITOTURBOTRON_BLOCK2_FILE = block2File;
  process.env.MAGNITOTURBOTRON_SECTION4_FILE = path.join(folder, 'section4.txt');
  process.env.MAGNITOTURBOTRON_TRADE_NAME =
    'Установка магнитотерапевтическая низкочастотная «Магнитотурботрон ПРО» в варианте исполнения «Люкс» с электрическим приводом ложемента';
  process.env.TS_BLOCK4_MATCH = 'Требования условиям эксплуатации';

  execFileSync(
    'powershell',
    ['-NoProfile', '-ExecutionPolicy', 'Bypass', '-File', path.join(PROJECT_ROOT, 'fill_magnitoturbotron_word.ps1')],
    { stdio: 'inherit', env: process.env }
  );

  console.log('\nDone:', output);
} catch (err) {
  console.error('\nERROR:\n' + (err.message || err));
  process.exit(1);
}
