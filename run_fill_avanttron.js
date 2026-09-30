const path = require('path');
const { execFileSync } = require('child_process');
const { PROJECT_ROOT, TEMPLATE_FILE, equipmentDir, assertFiles } = require('./lib/paths');

const folderName = 'Авантрон Про РК-МИ-030034';
const folder = equipmentDir(folderName);
const template = TEMPLATE_FILE;
const componentsFile = path.join(folder, 'avanttron_components.json');
const block2File = path.join(folder, 'block2.txt');
const output = path.join(folder, `ТС ${folderName}.doc`);

try {
  console.log('Start Avanttron Pro build');
  console.log('Project:', PROJECT_ROOT);

  require(path.join(folder, 'build_avanttron_components.js'));

  assertFiles('Avanttron Pro', [
    path.join(PROJECT_ROOT, 'fill_avanttron_word.ps1'),
    path.join(PROJECT_ROOT, 'fill_ts_helpers.ps1'),
    path.join(folder, 'avanttron_main.json'),
    componentsFile,
    block2File,
    path.join(folder, 'section4.txt'),
    template,
  ]);

  console.log('Template:', template);
  console.log('Output:', output);

  process.env.AVANTTRON_FOLDER = folder;
  process.env.AVANTTRON_TEMPLATE = template;
  process.env.AVANTTRON_OUTPUT = output;
  process.env.AVANTTRON_COMPONENTS = componentsFile;
  process.env.AVANTTRON_BLOCK2_FILE = block2File;
  process.env.AVANTTRON_SECTION4_FILE = path.join(folder, 'section4.txt');
  process.env.AVANTTRON_TRADE_NAME =
    'Система экстракорпоральной магнитной стимуляяции нервно-мышечного аппарата тазового дна «Авантрон Про" в варианте исполнения Терапевтическое кресло ММЦМ.941569.201 с наличием электрическкого подьемного механизма терапевтического кресла и ручного пульта управления подьемным механизмом';
  process.env.TS_BLOCK4_MATCH = 'Требования условиям эксплуатации';

  execFileSync(
    'powershell',
    ['-NoProfile', '-ExecutionPolicy', 'Bypass', '-File', path.join(PROJECT_ROOT, 'fill_avanttron_word.ps1')],
    { stdio: 'inherit', env: process.env }
  );

  console.log('\nDone:', output);
} catch (err) {
  console.error('\nERROR:\n' + (err.message || err));
  process.exit(1);
}
