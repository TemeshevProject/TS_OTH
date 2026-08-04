const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');
const { PROJECT_ROOT, TEMPLATE_FILE, equipmentDir } = require('./lib/paths');

const folderName = 'HyLED C8 РК-МИ-027894';
const folder = equipmentDir(folderName);
const template = TEMPLATE_FILE;
const componentsFile = path.join(folder, 'hyled_components.json');
const block2File = path.join(folder, 'block2.txt');
const output = path.join(folder, `ТС ${folderName}.doc`);

if (!fs.existsSync(template)) throw new Error(`Template not found: ${template}`);
if (!fs.existsSync(componentsFile)) throw new Error(`Components not found: ${componentsFile}`);
if (!fs.existsSync(path.join(folder, 'hyled_main.json'))) throw new Error('Run fetch_ndda.js first');

process.env.HYLED_FOLDER = folder;
process.env.HYLED_TEMPLATE = template;
process.env.HYLED_OUTPUT = output;
process.env.HYLED_COMPONENTS = componentsFile;
process.env.HYLED_BLOCK2_FILE = block2File;
process.env.HYLED_SECTION4_FILE = path.join(folder, 'section4.txt');
process.env.HYLED_TRADE_NAME = 'Светодиодный хирургический светильник HyLED C8/C8';

execFileSync(
  'powershell',
  ['-NoProfile', '-ExecutionPolicy', 'Bypass', '-File', path.join(PROJECT_ROOT, 'fill_hyled_word.ps1')],
  { stdio: 'inherit', env: process.env }
);

console.log('Done:', output);
