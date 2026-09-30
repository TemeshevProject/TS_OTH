const path = require('path');
const { execFileSync } = require('child_process');
const { PROJECT_ROOT, TEMPLATE_FILE, equipmentDir, assertFiles } = require('./lib/paths');

const folderName = 'corpuls3 РК-МТ-021680 (комплект 2)';
const folder = equipmentDir(folderName);
const template = TEMPLATE_FILE;
const componentsFile = path.join(folder, 'corpuls3_kit2_components.json');
const block2File = path.join(folder, 'block2.txt');
const output = path.join(folder, `ТС ${folderName}.doc`);

try {
  console.log('Start corpuls3 (komplekt 2) build');
  console.log('Project:', PROJECT_ROOT);

  require(path.join(folder, 'build_corpuls3_kit2_components.js'));

  assertFiles('corpuls3 (komplekt 2)', [
    path.join(PROJECT_ROOT, 'fill_corpuls3_word.ps1'),
    path.join(PROJECT_ROOT, 'fill_ts_helpers.ps1'),
    path.join(folder, 'corpuls3_main.json'),
    componentsFile,
    block2File,
    path.join(folder, 'section4.txt'),
    template,
  ]);

  console.log('Template:', template);
  console.log('Output:', output);

  process.env.CORPULS3_FOLDER = folder;
  process.env.CORPULS3_TEMPLATE = template;
  process.env.CORPULS3_OUTPUT = output;
  process.env.CORPULS3_COMPONENTS = componentsFile;
  process.env.CORPULS3_BLOCK2_FILE = block2File;
  process.env.CORPULS3_SECTION4_FILE = path.join(folder, 'section4.txt');
  process.env.CORPULS3_TRADE_NAME =
    'Монитор-дефибриллятор corpuls3 в исполнении corpuls3 с принадлежностями';
  process.env.TS_BLOCK4_MATCH = 'Требования условиям эксплуатации';

  execFileSync(
    'powershell',
    ['-NoProfile', '-ExecutionPolicy', 'Bypass', '-File', path.join(PROJECT_ROOT, 'fill_corpuls3_word.ps1')],
    { stdio: 'inherit', env: process.env }
  );

  console.log('\nDone:', output);
} catch (err) {
  console.error('\nERROR:\n' + (err.message || err));
  process.exit(1);
}
