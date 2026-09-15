const path = require('path');
const { execFileSync } = require('child_process');
const { PROJECT_ROOT, TEMPLATE_FILE, equipmentDir, assertFiles } = require('./lib/paths');

const folderName = 'NeuroHelper РК-МИ-030033';
const folder = equipmentDir(folderName);
const template = TEMPLATE_FILE;
const componentsFile = path.join(folder, 'neurohelper_components.json');
const block2File = path.join(folder, 'block2.txt');
const output = path.join(folder, `ТС ${folderName}.doc`);

try {
  console.log('Start NeuroHelper build');
  console.log('Project:', PROJECT_ROOT);

  require(path.join(folder, 'build_neurohelper_components.js'));

  assertFiles('NeuroHelper', [
    path.join(PROJECT_ROOT, 'fill_neurohelper_word.ps1'),
    path.join(PROJECT_ROOT, 'fill_ts_helpers.ps1'),
    path.join(folder, 'neurohelper_main.json'),
    componentsFile,
    block2File,
    path.join(folder, 'section4.txt'),
    template,
  ]);

  console.log('Template:', template);
  console.log('Output:', output);

  process.env.NEUROHELPER_FOLDER = folder;
  process.env.NEUROHELPER_TEMPLATE = template;
  process.env.NEUROHELPER_OUTPUT = output;
  process.env.NEUROHELPER_COMPONENTS = componentsFile;
  process.env.NEUROHELPER_BLOCK2_FILE = block2File;
  process.env.NEUROHELPER_SECTION4_FILE = path.join(folder, 'section4.txt');
  process.env.NEUROHELPER_TRADE_NAME =
    'Роботизированный комплекс локомоторной терапии и реабилитации нижних конечностей «NeuroHelper», модификация «Расширенный»';
  process.env.TS_BLOCK4_MATCH = 'Требования условиям эксплуатации';

  execFileSync(
    'powershell',
    ['-NoProfile', '-ExecutionPolicy', 'Bypass', '-File', path.join(PROJECT_ROOT, 'fill_neurohelper_word.ps1')],
    { stdio: 'inherit', env: process.env }
  );

  console.log('\nDone:', output);
} catch (err) {
  console.error('\nERROR:\n' + (err.message || err));
  process.exit(1);
}
