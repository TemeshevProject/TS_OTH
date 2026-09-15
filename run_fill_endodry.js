const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');
const { PROJECT_ROOT, TEMPLATE_FILE, equipmentDir } = require('./lib/paths');

const folderName = 'ENDODRY РК-МТ-022898';
const folder = equipmentDir(folderName);
const template = TEMPLATE_FILE;
const componentsFile = path.join(folder, 'endodry_components.json');
const block2File = path.join(folder, 'block2.txt');
const output = path.join(folder, `ТС ${folderName}.doc`);

if (!fs.existsSync(template)) throw new Error(`Template not found: ${template}`);
if (!fs.existsSync(componentsFile)) throw new Error(`Components not found: ${componentsFile}`);
if (!fs.existsSync(path.join(folder, 'endodry_main.json'))) throw new Error('Run fetch_endodry.js first');

process.env.ENDODRY_FOLDER = folder;
process.env.ENDODRY_TEMPLATE = template;
process.env.ENDODRY_OUTPUT = output;
process.env.ENDODRY_COMPONENTS = componentsFile;
process.env.ENDODRY_BLOCK2_FILE = block2File;
process.env.ENDODRY_SECTION4_FILE = path.join(folder, 'section4.txt');
process.env.ENDODRY_TRADE_NAME =
  'Шкаф для сушки и хранения гибких эндоскопов серии ENDODRY';

execFileSync(
  'powershell',
  ['-NoProfile', '-ExecutionPolicy', 'Bypass', '-File', path.join(PROJECT_ROOT, 'fill_endodry_word.ps1')],
  { stdio: 'inherit', env: process.env }
);

console.log('Done:', output);
