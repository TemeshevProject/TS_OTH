const path = require('path');
const { execFileSync } = require('child_process');
const { PROJECT_ROOT, TEMPLATE_FILE, equipmentDir, assertFiles } = require('./lib/paths');

const folderName = 'BD FACSLyric РК-МИ-028782';
const folder = equipmentDir(folderName);
const template = TEMPLATE_FILE;
const componentsFile = path.join(folder, 'faclyric_components.json');
const block2File = path.join(folder, 'block2.txt');
const output = path.join(folder, `ТС ${folderName}.doc`);

try {
  console.log('Start BD FACSLyric build');
  console.log('Project:', PROJECT_ROOT);

  require(path.join(folder, 'build_faclyric_components.js'));

  assertFiles('BD FACSLyric', [
    path.join(PROJECT_ROOT, 'fill_faclyric_word.ps1'),
    path.join(PROJECT_ROOT, 'fill_ts_helpers.ps1'),
    path.join(folder, 'faclyric_main.json'),
    componentsFile,
    block2File,
    path.join(folder, 'section4.txt'),
    template,
  ]);

  console.log('Template:', template);
  console.log('Output:', output);

  process.env.FACLYRIC_FOLDER = folder;
  process.env.FACLYRIC_TEMPLATE = template;
  process.env.FACLYRIC_OUTPUT = output;
  process.env.FACLYRIC_COMPONENTS = componentsFile;
  process.env.FACLYRIC_BLOCK2_FILE = block2File;
  process.env.FACLYRIC_SECTION4_FILE = path.join(folder, 'section4.txt');
  process.env.FACLYRIC_TRADE_NAME =
    'Система BD FACSLyric™ для проточной цитометрии с принадлежностями и расходными материалами';
  process.env.TS_BLOCK4_MATCH = 'Требования условиям эксплуатации';

  execFileSync(
    'powershell',
    ['-NoProfile', '-ExecutionPolicy', 'Bypass', '-File', path.join(PROJECT_ROOT, 'fill_faclyric_word.ps1')],
    { stdio: 'inherit', env: process.env }
  );

  console.log('\nDone:', output);
} catch (err) {
  console.error('\nERROR:\n' + (err.message || err));
  process.exit(1);
}
