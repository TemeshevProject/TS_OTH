const path = require('path');
const { execFileSync } = require('child_process');
const { PROJECT_ROOT, TEMPLATE_FILE, equipmentDir, assertFiles } = require('./lib/paths');

const folderName = 'Logiq P9 РК-МТ-015866';
const folder = equipmentDir(folderName);
const template = TEMPLATE_FILE;
const componentsFile = path.join(folder, 'logiqp9_components.json');
const block2File = path.join(folder, 'block2.txt');
const output = path.join(folder, `ТС ${folderName}.doc`);

try {
  console.log('Start Logiq P9 build');
  console.log('Project:', PROJECT_ROOT);

  assertFiles('Logiq P9', [
    path.join(PROJECT_ROOT, 'fill_logiqp9_word.ps1'),
    path.join(PROJECT_ROOT, 'fill_ts_helpers.ps1'),
    path.join(folder, 'logiqp9_main.json'),
    componentsFile,
    block2File,
    path.join(folder, 'section4.txt'),
    template,
  ]);

  console.log('Template:', template);
  console.log('Output:', output);

  process.env.LOGIQP9_FOLDER = folder;
  process.env.LOGIQP9_TEMPLATE = template;
  process.env.LOGIQP9_OUTPUT = output;
  process.env.LOGIQP9_COMPONENTS = componentsFile;
  process.env.LOGIQP9_BLOCK2_FILE = block2File;
  process.env.LOGIQP9_SECTION4_FILE = path.join(folder, 'section4.txt');
  process.env.LOGIQP9_TRADE_NAME =
    'Система ультразвуковая диагностическая медицинская Logiq P, вариант исполнения P9';
  process.env.TS_BLOCK4_MATCH = 'Требования условиям эксплуатации';

  execFileSync(
    'powershell',
    ['-NoProfile', '-ExecutionPolicy', 'Bypass', '-File', path.join(PROJECT_ROOT, 'fill_logiqp9_word.ps1')],
    { stdio: 'inherit', env: process.env }
  );

  console.log('\nDone:', output);
} catch (err) {
  console.error('\nERROR:\n' + (err.message || err));
  process.exit(1);
}
