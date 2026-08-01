const path = require('path');
const { execFileSync } = require('child_process');
const { PROJECT_ROOT, TEMPLATE_FILE, equipmentDir, assertFiles } = require('./lib/paths');

const folderName = 'PIC iX РК-МИ (МТ)-027750';
const folder = equipmentDir(folderName);
const template = TEMPLATE_FILE;
const componentsFile = path.join(folder, 'picix_components.json');
const block2File = path.join(folder, 'block2.txt');
const output = path.join(folder, `ТС ${folderName}.doc`);

try {
  console.log('Start PIC iX build');
  console.log('Project:', PROJECT_ROOT);

  assertFiles('PIC iX', [
    path.join(PROJECT_ROOT, 'fill_picix_word.ps1'),
    path.join(PROJECT_ROOT, 'fill_ts_helpers.ps1'),
    path.join(folder, 'picix_main.json'),
    componentsFile,
    block2File,
    path.join(folder, 'section4.txt'),
    template,
  ]);

  console.log('Template:', template);
  console.log('Output:', output);

  process.env.PICIX_FOLDER = folder;
  process.env.PICIX_TEMPLATE = template;
  process.env.PICIX_OUTPUT = output;
  process.env.PICIX_COMPONENTS = componentsFile;
  process.env.PICIX_BLOCK2_FILE = block2File;
  process.env.PICIX_SECTION4_FILE = path.join(folder, 'section4.txt');
  process.env.PICIX_TRADE_NAME =
    'Информационный центр наблюдения за пациентом Patient Information Center iX (PIC iX) с принадлежностями';
  process.env.TS_BLOCK4_MATCH = 'Требования условиям эксплуатации';

  execFileSync(
    'powershell',
    ['-NoProfile', '-ExecutionPolicy', 'Bypass', '-File', path.join(PROJECT_ROOT, 'fill_picix_word.ps1')],
    { stdio: 'inherit', env: process.env }
  );

  console.log('\nDone:', output);
} catch (err) {
  console.error('\nERROR:\n' + (err.message || err));
  process.exit(1);
}
