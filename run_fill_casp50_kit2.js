const path = require('path');
const { execFileSync } = require('child_process');
const { PROJECT_ROOT, TEMPLATE_FILE, equipmentDir, assertFiles } = require('./lib/paths');

const folderName = 'CASP-50 РК-МТ-014518 (комплект 2)';
const folder = equipmentDir(folderName);
const template = TEMPLATE_FILE;
const componentsFile = path.join(folder, 'casp50_kit2_components.json');
const block2File = path.join(folder, 'block2.txt');
const output = path.join(folder, `ТС ${folderName}.doc`);

try {
  console.log('Start CASP-50 (komplekt 2) build');
  console.log('Project:', PROJECT_ROOT);

  require(path.join(folder, 'build_casp50_kit2_components.js'));

  assertFiles('CASP-50 (komplekt 2)', [
    path.join(PROJECT_ROOT, 'fill_casp50_kit2_word.ps1'),
    path.join(PROJECT_ROOT, 'fill_ts_helpers.ps1'),
    path.join(folder, 'casp50_main.json'),
    componentsFile,
    block2File,
    path.join(folder, 'section4.txt'),
    template,
  ]);

  console.log('Template:', template);
  console.log('Output:', output);

  process.env.CASP50_KIT2_FOLDER = folder;
  process.env.CASP50_KIT2_TEMPLATE = template;
  process.env.CASP50_KIT2_OUTPUT = output;
  process.env.CASP50_KIT2_COMPONENTS = componentsFile;
  process.env.CASP50_KIT2_BLOCK2_FILE = block2File;
  process.env.CASP50_KIT2_SECTION4_FILE = path.join(folder, 'section4.txt');
  process.env.CASP50_KIT2_TRADE_NAME =
    'Низкотемпературный плазменный стерилизатор CASP с применением перекиси водорода CASP -50';
  process.env.TS_BLOCK4_MATCH = 'Требования условиям эксплуатации';

  execFileSync(
    'powershell',
    ['-NoProfile', '-ExecutionPolicy', 'Bypass', '-File', path.join(PROJECT_ROOT, 'fill_casp50_kit2_word.ps1')],
    { stdio: 'inherit', env: process.env }
  );

  console.log('\nDone:', output);
} catch (err) {
  console.error('\nERROR:\n' + (err.message || err));
  process.exit(1);
}
