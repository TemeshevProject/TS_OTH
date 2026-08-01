const path = require('path');
const { execFileSync } = require('child_process');
const { PROJECT_ROOT, TEMPLATE_FILE, equipmentDir, assertFiles } = require('./lib/paths');

const folderName = 'IntelliVue MX550 РК-МИ (МТ)-027701';
const folder = equipmentDir(folderName);
const template = TEMPLATE_FILE;
const componentsFile = path.join(folder, 'mx550_components.json');
const block2File = path.join(folder, 'block2.txt');
const output = path.join(folder, `ТС ${folderName}.doc`);

try {
  console.log('Start IntelliVue MX550 build');
  console.log('Project:', PROJECT_ROOT);

  assertFiles('IntelliVue MX550', [
    path.join(PROJECT_ROOT, 'fill_mx550_word.ps1'),
    path.join(PROJECT_ROOT, 'fill_ts_helpers.ps1'),
    path.join(folder, 'mx550_main.json'),
    componentsFile,
    block2File,
    path.join(folder, 'section4.txt'),
    template,
  ]);

  console.log('Template:', template);
  console.log('Output:', output);

  process.env.MX550_FOLDER = folder;
  process.env.MX550_TEMPLATE = template;
  process.env.MX550_OUTPUT = output;
  process.env.MX550_COMPONENTS = componentsFile;
  process.env.MX550_BLOCK2_FILE = block2File;
  process.env.MX550_SECTION4_FILE = path.join(folder, 'section4.txt');
  process.env.MX550_TRADE_NAME =
    'Монитор пациента IntelliVue в варианте исполнения MX 550 с принадлежностями';
  process.env.TS_BLOCK4_MATCH = 'Требования условиям эксплуатации';

  execFileSync(
    'powershell',
    ['-NoProfile', '-ExecutionPolicy', 'Bypass', '-File', path.join(PROJECT_ROOT, 'fill_mx550_word.ps1')],
    { stdio: 'inherit', env: process.env }
  );

  console.log('\nDone:', output);
} catch (err) {
  console.error('\nERROR:\n' + (err.message || err));
  process.exit(1);
}
