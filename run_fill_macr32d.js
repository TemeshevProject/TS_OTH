const path = require('path');
const { execFileSync } = require('child_process');
const { PROJECT_ROOT, TEMPLATE_FILE, equipmentDir, assertFiles } = require('./lib/paths');

const folderName = 'MAC-R32D РК-МТ-020631';
const folder = equipmentDir(folderName);
const template = TEMPLATE_FILE;
const componentsFile = path.join(folder, 'macr32d_components.json');
const block2File = path.join(folder, 'block2.txt');
const output = path.join(folder, `ТС ${folderName}.doc`);

try {
  console.log('Start MAC-R32D build');
  console.log('Project:', PROJECT_ROOT);

  require(path.join(folder, 'build_macr32d_components.js'));

  assertFiles('MAC-R32D', [
    path.join(PROJECT_ROOT, 'fill_macr32d_word.ps1'),
    path.join(PROJECT_ROOT, 'fill_ts_helpers.ps1'),
    path.join(folder, 'macr32d_main.json'),
    componentsFile,
    block2File,
    path.join(folder, 'section4.txt'),
    template,
  ]);

  console.log('Template:', template);
  console.log('Output:', output);

  process.env.MACR32D_FOLDER = folder;
  process.env.MACR32D_TEMPLATE = template;
  process.env.MACR32D_OUTPUT = output;
  process.env.MACR32D_COMPONENTS = componentsFile;
  process.env.MACR32D_BLOCK2_FILE = block2File;
  process.env.MACR32D_SECTION4_FILE = path.join(folder, 'section4.txt');
  process.env.MACR32D_TRADE_NAME =
    'Передвижной рентгеновский аппарат MAC: вариант исполнения MAC-R32D';
  process.env.TS_BLOCK4_MATCH = 'Требования условиям эксплуатации';

  execFileSync(
    'powershell',
    ['-NoProfile', '-ExecutionPolicy', 'Bypass', '-File', path.join(PROJECT_ROOT, 'fill_macr32d_word.ps1')],
    { stdio: 'inherit', env: process.env }
  );

  console.log('\nDone:', output);
} catch (err) {
  console.error('\nERROR:\n' + (err.message || err));
  process.exit(1);
}
