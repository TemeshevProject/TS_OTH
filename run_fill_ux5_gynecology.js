const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');
const { PROJECT_ROOT, TEMPLATE_FILE } = require('./lib/paths');

const folderName = fs.readdirSync(PROJECT_ROOT).find(
  (n) => n.startsWith('UX5') && n.includes('030869') && n.includes('гинекология')
);
if (!folderName) throw new Error('UX5 gynecology folder not found');

const folder = path.join(PROJECT_ROOT, folderName);
const template = TEMPLATE_FILE;
const componentsFile = path.join(folder, 'ux5_gynecology_components.json');
const block2File = path.join(folder, 'block2.txt');
const output = path.join(folder, `ТС ${folderName}.doc`);

if (!fs.existsSync(template)) throw new Error(`Template not found: ${template}`);
if (!fs.existsSync(componentsFile)) throw new Error('Run build_ux5_gynecology.js first');

process.env.UX5_FOLDER = folder;
process.env.UX5_TEMPLATE = template;
process.env.UX5_OUTPUT = output;
process.env.UX5_COMPONENTS = componentsFile;
process.env.UX5_BLOCK2_FILE = block2File;

execFileSync(
  'powershell',
  ['-NoProfile', '-ExecutionPolicy', 'Bypass', '-File', path.join(PROJECT_ROOT, 'fill_ux5_word.ps1')],
  { stdio: 'inherit', env: process.env }
);

console.log('Done:', output);
