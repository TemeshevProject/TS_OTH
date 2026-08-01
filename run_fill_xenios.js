const path = require('path');
const { execFileSync } = require('child_process');
const { PROJECT_ROOT, TEMPLATE_FILE, equipmentDir, assertFiles } = require('./lib/paths');

const folderName = 'Консоль Xenios для ЭКМО РК-МТ-022292';
const folder = equipmentDir(folderName);
const template = TEMPLATE_FILE;
const componentsFile = path.join(folder, 'xenios_components.json');
const block2File = path.join(folder, 'block2.txt');
const output = path.join(folder, `ТС ${folderName}.doc`);

try {
  console.log('Start Xenios build');
  console.log('Project:', PROJECT_ROOT);

  assertFiles('Xenios', [
    path.join(PROJECT_ROOT, 'fill_xenios_word.ps1'),
    path.join(PROJECT_ROOT, 'fill_ts_helpers.ps1'),
    path.join(folder, 'xenios_main.json'),
    componentsFile,
    block2File,
    path.join(folder, 'section4.txt'),
    template,
  ]);

  console.log('Template:', template);
  console.log('Output:', output);

  process.env.XENIOS_FOLDER = folder;
  process.env.XENIOS_TEMPLATE = template;
  process.env.XENIOS_OUTPUT = output;
  process.env.XENIOS_COMPONENTS = componentsFile;
  process.env.XENIOS_BLOCK2_FILE = block2File;
  process.env.XENIOS_SECTION4_FILE = path.join(folder, 'section4.txt');
  process.env.XENIOS_TRADE_NAME = 'Консоль Xenios для ЭКМО с принадлежностями';
  process.env.TS_BLOCK4_MATCH = 'Требования условиям эксплуатации';

  execFileSync(
    'powershell',
    ['-NoProfile', '-ExecutionPolicy', 'Bypass', '-File', path.join(PROJECT_ROOT, 'fill_xenios_word.ps1')],
    { stdio: 'inherit', env: process.env }
  );

  console.log('\nDone:', output);
} catch (err) {
  console.error('\nERROR:\n' + (err.message || err));
  process.exit(1);
}
