const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');
const { PROJECT_ROOT, TEMPLATE_FILE, equipmentDir } = require('./lib/paths');

const folderName = 'A7 РК-МИ-029920';
const folder = equipmentDir(folderName);

require(path.join(folder, 'build_a7_components.js'));

const template = TEMPLATE_FILE;
const componentsFile = path.join(folder, 'a7_components.json');
const block2File = path.join(folder, 'block2.txt');
const output = path.join(folder, `ТС ${folderName}.doc`);

if (!fs.existsSync(template)) throw new Error(`Template not found: ${template}`);

process.env.A7_FOLDER = folder;
process.env.A7_TEMPLATE = template;
process.env.A7_OUTPUT = output;
process.env.A7_COMPONENTS = componentsFile;
process.env.A7_BLOCK2_FILE = block2File;
process.env.A7_SECTION4_FILE = path.join(folder, 'section4.txt');
process.env.A7_TRADE_NAME =
  'Анестезиологическая система A7 в комплекте с принадлежностями';

execFileSync(
  'powershell',
  ['-NoProfile', '-ExecutionPolicy', 'Bypass', '-File', path.join(PROJECT_ROOT, 'fill_a7_word.ps1')],
  { stdio: 'inherit', env: process.env }
);

console.log('Done:', output);
