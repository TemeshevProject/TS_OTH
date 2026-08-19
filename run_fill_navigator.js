const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');
const { PROJECT_ROOT, TEMPLATE_FILE, equipmentDir } = require('./lib/paths');

const folderName = 'Navigator DR Care РК-МИ-028212';
const folder = equipmentDir(folderName);
const template = TEMPLATE_FILE;
const componentsFile = path.join(folder, 'navigator_components.json');
const block2File = path.join(folder, 'block2.txt');
const output = path.join(folder, `ТС ${folderName}.doc`);

if (!fs.existsSync(template)) throw new Error(`Template not found: ${template}`);
if (!fs.existsSync(componentsFile)) throw new Error(`Components not found: ${componentsFile}`);
if (!fs.existsSync(path.join(folder, 'navigator_main.json'))) throw new Error('Run fetch_navigator.js first');

process.env.NAVIGATOR_FOLDER = folder;
process.env.NAVIGATOR_TEMPLATE = template;
process.env.NAVIGATOR_OUTPUT = output;
process.env.NAVIGATOR_COMPONENTS = componentsFile;
process.env.NAVIGATOR_BLOCK2_FILE = block2File;
process.env.NAVIGATOR_SECTION4_FILE = path.join(folder, 'section4.txt');
process.env.NAVIGATOR_TRADE_NAME =
  'Цифровая рентгеновская маммографическая система Navigator DR Care';

execFileSync(
  'powershell',
  ['-NoProfile', '-ExecutionPolicy', 'Bypass', '-File', path.join(PROJECT_ROOT, 'fill_navigator_word.ps1')],
  { stdio: 'inherit', env: process.env }
);

console.log('Done:', output);
