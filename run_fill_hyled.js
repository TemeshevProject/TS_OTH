const path = require('path');
const { execFileSync } = require('child_process');
const { PROJECT_ROOT, TEMPLATE_FILE, equipmentDir, assertFiles } = require('./lib/paths');

const folderName = 'HyLED C8 РК-МТ-027894';
const folder = equipmentDir(folderName);
const template = TEMPLATE_FILE;
const componentsFile = path.join(folder, 'hyled_components.json');
const block2File = path.join(folder, 'block2.txt');
const output = path.join(folder, `ТС ${folderName}.doc`);

try {
  console.log('Start HyLED C8 build');
  console.log('Project:', PROJECT_ROOT);

  assertFiles('HyLED C8', [
    path.join(PROJECT_ROOT, 'fill_hyled_word.ps1'),
    path.join(PROJECT_ROOT, 'fill_ts_helpers.ps1'),
    path.join(folder, 'hyled_main.json'),
    componentsFile,
    block2File,
    path.join(folder, 'section4.txt'),
    template,
  ]);

  console.log('Template:', template);
  console.log('Output:', output);

  process.env.HYLED_FOLDER = folder;
  process.env.HYLED_TEMPLATE = template;
  process.env.HYLED_OUTPUT = output;
  process.env.HYLED_COMPONENTS = componentsFile;
  process.env.HYLED_BLOCK2_FILE = block2File;
  process.env.HYLED_SECTION4_FILE = path.join(folder, 'section4.txt');
  process.env.HYLED_TRADE_NAME = 'Светодиодный хирургический светильник HyLED C8/C8';
  process.env.TS_BLOCK4_MATCH = 'Требования условиям эксплуатации';

  execFileSync(
    'powershell',
    ['-NoProfile', '-ExecutionPolicy', 'Bypass', '-File', path.join(PROJECT_ROOT, 'fill_hyled_word.ps1')],
    { stdio: 'inherit', env: process.env }
  );

  console.log('\nDone:', output);
} catch (err) {
  console.error('\nERROR:\n' + (err.message || err));
  process.exit(1);
}
