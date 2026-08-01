const path = require('path');
const { execFileSync } = require('child_process');
const { PROJECT_ROOT, TEMPLATE_FILE, equipmentDir, assertFiles } = require('./lib/paths');

const folderName = 'ICP-Monitor HDM 29.2 РК-МИ (МТ)-023843';
const folder = equipmentDir(folderName);
const template = TEMPLATE_FILE;
const componentsFile = path.join(folder, 'icpmonitor_components.json');
const block2File = path.join(folder, 'block2.txt');
const output = path.join(folder, `ТС ${folderName}.doc`);

try {
  console.log('Start ICP-Monitor build');
  console.log('Project:', PROJECT_ROOT);

  assertFiles('ICP-Monitor', [
    path.join(PROJECT_ROOT, 'fill_icpmonitor_word.ps1'),
    path.join(PROJECT_ROOT, 'fill_ts_helpers.ps1'),
    path.join(folder, 'icpmonitor_main.json'),
    componentsFile,
    block2File,
    path.join(folder, 'section4.txt'),
    template,
  ]);

  console.log('Template:', template);
  console.log('Output:', output);

  process.env.ICPMONITOR_FOLDER = folder;
  process.env.ICPMONITOR_TEMPLATE = template;
  process.env.ICPMONITOR_OUTPUT = output;
  process.env.ICPMONITOR_COMPONENTS = componentsFile;
  process.env.ICPMONITOR_BLOCK2_FILE = block2File;
  process.env.ICPMONITOR_SECTION4_FILE = path.join(folder, 'section4.txt');
  process.env.ICPMONITOR_TRADE_NAME =
    'Монитор для измерения внутричерепного давления ICP-Monitor (HDM 29.2)';
  process.env.TS_BLOCK4_MATCH = 'Требования условиям эксплуатации';

  execFileSync(
    'powershell',
    ['-NoProfile', '-ExecutionPolicy', 'Bypass', '-File', path.join(PROJECT_ROOT, 'fill_icpmonitor_word.ps1')],
    { stdio: 'inherit', env: process.env }
  );

  console.log('\nDone:', output);
} catch (err) {
  console.error('\nERROR:\n' + (err.message || err));
  process.exit(1);
}
