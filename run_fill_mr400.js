const path = require('path');
const { execFileSync } = require('child_process');
const { PROJECT_ROOT, TEMPLATE_FILE, equipmentDir, assertFiles } = require('./lib/paths');

const folderName = 'Expression MR400 РК-МТ-019336';
const folder = equipmentDir(folderName);
const template = TEMPLATE_FILE;
const componentsFile = path.join(folder, 'mr400_components.json');
const block2File = path.join(folder, 'block2.txt');
const output = path.join(folder, `ТС ${folderName}.doc`);

try {
  console.log('Start Expression MR400 build');
  console.log('Project:', PROJECT_ROOT);

  assertFiles('Expression MR400', [
    path.join(PROJECT_ROOT, 'fill_mr400_word.ps1'),
    path.join(PROJECT_ROOT, 'fill_ts_helpers.ps1'),
    path.join(folder, 'mr400_main.json'),
    componentsFile,
    block2File,
    path.join(folder, 'section4.txt'),
    template,
  ]);

  console.log('Template:', template);
  console.log('Output:', output);

  process.env.MR400_FOLDER = folder;
  process.env.MR400_TEMPLATE = template;
  process.env.MR400_OUTPUT = output;
  process.env.MR400_COMPONENTS = componentsFile;
  process.env.MR400_BLOCK2_FILE = block2File;
  process.env.MR400_SECTION4_FILE = path.join(folder, 'section4.txt');
  process.env.MR400_TRADE_NAME =
    'Система мониторинга пациента во время магнитно-резонансной томографии Essential 865214 Expression MR400 с принадлежностями';
  process.env.TS_BLOCK4_MATCH = 'Требования условиям эксплуатации';

  execFileSync(
    'powershell',
    ['-NoProfile', '-ExecutionPolicy', 'Bypass', '-File', path.join(PROJECT_ROOT, 'fill_mr400_word.ps1')],
    { stdio: 'inherit', env: process.env }
  );

  console.log('\nDone:', output);
} catch (err) {
  console.error('\nERROR:\n' + (err.message || err));
  process.exit(1);
}
