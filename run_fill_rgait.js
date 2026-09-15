const path = require('path');
const { execFileSync } = require('child_process');
const { PROJECT_ROOT, TEMPLATE_FILE, equipmentDir, assertFiles } = require('./lib/paths');

const folderName = 'R-GAIT РК-МИ-029694';
const folder = equipmentDir(folderName);
const template = TEMPLATE_FILE;
const componentsFile = path.join(folder, 'rgait_components.json');
const block2File = path.join(folder, 'block2.txt');
const output = path.join(folder, `ТС ${folderName}.doc`);

try {
  console.log('Start R-GAIT build');
  console.log('Project:', PROJECT_ROOT);

  require(path.join(folder, 'build_rgait_components.js'));

  assertFiles('R-GAIT', [
    path.join(PROJECT_ROOT, 'fill_rgait_word.ps1'),
    path.join(PROJECT_ROOT, 'fill_ts_helpers.ps1'),
    path.join(folder, 'rgait_main.json'),
    componentsFile,
    block2File,
    path.join(folder, 'section4.txt'),
    template,
  ]);

  console.log('Template:', template);
  console.log('Output:', output);

  process.env.RGAIT_FOLDER = folder;
  process.env.RGAIT_TEMPLATE = template;
  process.env.RGAIT_OUTPUT = output;
  process.env.RGAIT_COMPONENTS = componentsFile;
  process.env.RGAIT_BLOCK2_FILE = block2File;
  process.env.RGAIT_SECTION4_FILE = path.join(folder, 'section4.txt');
  process.env.RGAIT_TRADE_NAME =
    'Роботизированная система для восстановления двигательной активности, навыков ходьбы и бега R-GAIT с принадлежностями';
  process.env.TS_BLOCK4_MATCH = 'Требования условиям эксплуатации';

  execFileSync(
    'powershell',
    ['-NoProfile', '-ExecutionPolicy', 'Bypass', '-File', path.join(PROJECT_ROOT, 'fill_rgait_word.ps1')],
    { stdio: 'inherit', env: process.env }
  );

  console.log('\nDone:', output);
} catch (err) {
  console.error('\nERROR:\n' + (err.message || err));
  process.exit(1);
}
