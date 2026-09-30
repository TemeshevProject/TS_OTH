const path = require('path');
const { execFileSync } = require('child_process');
const { PROJECT_ROOT, TEMPLATE_FILE, equipmentDir, assertFiles } = require('./lib/paths');

const folderName = 'EXTRON 5 РК-МИ-027833';
const folder = equipmentDir(folderName);
const template = TEMPLATE_FILE;
const componentsFile = path.join(folder, 'extron5_components.json');
const block2File = path.join(folder, 'block2.txt');
const output = path.join(folder, `ТС ${folderName}.doc`);

try {
  console.log('Start EXTRON 5 build');
  console.log('Project:', PROJECT_ROOT);

  require(path.join(folder, 'build_extron5_components.js'));

  assertFiles('EXTRON 5', [
    path.join(PROJECT_ROOT, 'fill_extron5_word.ps1'),
    path.join(PROJECT_ROOT, 'fill_ts_helpers.ps1'),
    path.join(folder, 'extron5_main.json'),
    componentsFile,
    block2File,
    path.join(folder, 'section4.txt'),
    template,
  ]);

  console.log('Template:', template);
  console.log('Output:', output);

  process.env.EXTRON5_FOLDER = folder;
  process.env.EXTRON5_TEMPLATE = template;
  process.env.EXTRON5_OUTPUT = output;
  process.env.EXTRON5_COMPONENTS = componentsFile;
  process.env.EXTRON5_BLOCK2_FILE = block2File;
  process.env.EXTRON5_SECTION4_FILE = path.join(folder, 'section4.txt');
  process.env.EXTRON5_TRADE_NAME =
    'Мобильная рентгенологическая флюороскопическая/рентгеноскопическая система типа С-дуга EXTRON 5';
  process.env.TS_BLOCK4_MATCH = 'Требования условиям эксплуатации';

  execFileSync(
    'powershell',
    ['-NoProfile', '-ExecutionPolicy', 'Bypass', '-File', path.join(PROJECT_ROOT, 'fill_extron5_word.ps1')],
    { stdio: 'inherit', env: process.env }
  );

  console.log('\nDone:', output);
} catch (err) {
  console.error('\nERROR:\n' + (err.message || err));
  process.exit(1);
}
