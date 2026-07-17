const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');
const { PROJECT_ROOT, TEMPLATE_FILE, equipmentDir } = require('./lib/paths');

const folderName = 'GIOTTO IMAGE 3DL РК-МТ-7№014713';
const folder = equipmentDir(folderName);
const template = TEMPLATE_FILE;
const componentsFile = path.join(folder, 'giotto_components.json');
const block2File = path.join(folder, 'block2.txt');
const output = path.join(folder, `ТС ${folderName}.doc`);

if (!fs.existsSync(template)) throw new Error(`Template not found: ${template}`);
if (!fs.existsSync(componentsFile)) throw new Error(`Components not found: ${componentsFile}`);
if (!fs.existsSync(path.join(folder, 'giotto_main.json'))) throw new Error('Run fetch or ensure giotto_main.json exists');

process.env.GIOTTO_FOLDER = folder;
process.env.GIOTTO_TEMPLATE = template;
process.env.GIOTTO_OUTPUT = output;
process.env.GIOTTO_COMPONENTS = componentsFile;
process.env.GIOTTO_BLOCK2_FILE = block2File;
process.env.GIOTTO_SECTION4_FILE = path.join(folder, 'section4.txt');
process.env.GIOTTO_TRADE_NAME =
  'Установка рентгеновская маммографическая GIOTTO IMAGE 3DL';

execFileSync(
  'powershell',
  ['-NoProfile', '-ExecutionPolicy', 'Bypass', '-File', path.join(PROJECT_ROOT, 'fill_giotto_word.ps1')],
  { stdio: 'inherit', env: process.env }
);

console.log('Done:', output);
