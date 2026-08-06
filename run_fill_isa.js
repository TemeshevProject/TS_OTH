const path = require('path');
const { execFileSync } = require('child_process');
const { PROJECT_ROOT, TEMPLATE_FILE, equipmentDir, assertFiles } = require('./lib/paths');

const folderName = 'MEDIVATORS ISA РК-МТ-016998';
const folder = equipmentDir(folderName);
const template = TEMPLATE_FILE;
const componentsFile = path.join(folder, 'isa_components.json');
const block2File = path.join(folder, 'block2.txt');
const output = path.join(folder, `ТС ${folderName}.doc`);

try {
  console.log('Start MEDIVATORS ISA build');
  console.log('Project:', PROJECT_ROOT);

  assertFiles('MEDIVATORS ISA', [
    path.join(PROJECT_ROOT, 'fill_isa_word.ps1'),
    path.join(PROJECT_ROOT, 'fill_ts_helpers.ps1'),
    path.join(folder, 'isa_main.json'),
    componentsFile,
    block2File,
    path.join(folder, 'section4.txt'),
    template,
  ]);

  console.log('Template:', template);
  console.log('Output:', output);

  process.env.ISA_FOLDER = folder;
  process.env.ISA_TEMPLATE = template;
  process.env.ISA_OUTPUT = output;
  process.env.ISA_COMPONENTS = componentsFile;
  process.env.ISA_BLOCK2_FILE = block2File;
  process.env.ISA_SECTION4_FILE = path.join(folder, 'section4.txt');
  process.env.ISA_TRADE_NAME =
    'Автомат для мойки, дезинфекции и стерилизации эндоскопов MEDIVATORS ISA';
  process.env.TS_BLOCK4_MATCH = 'Требования условиям эксплуатации';

  execFileSync(
    'powershell',
    ['-NoProfile', '-ExecutionPolicy', 'Bypass', '-File', path.join(PROJECT_ROOT, 'fill_isa_word.ps1')],
    { stdio: 'inherit', env: process.env }
  );

  console.log('\nDone:', output);
} catch (err) {
  console.error('\nERROR:\n' + (err.message || err));
  process.exit(1);
}
