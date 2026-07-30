const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');
const { PROJECT_ROOT, TEMPLATE_FILE, equipmentDir } = require('./lib/paths');

const folderName = 'PerfoX 3000B-1 РК-МИ-026055';
const folder = equipmentDir(folderName);
const template = TEMPLATE_FILE;
const componentsFile = path.join(folder, 'perfox_components.json');
const block2File = path.join(folder, 'block2.txt');
const output = path.join(folder, `ТС ${folderName}.doc`);

if (!fs.existsSync(template)) throw new Error(`Template not found: ${template}`);
if (!fs.existsSync(componentsFile)) throw new Error(`Components not found: ${componentsFile}`);
if (!fs.existsSync(path.join(folder, 'perfox_main.json'))) throw new Error('perfox_main.json not found');

process.env.PERFOX_FOLDER = folder;
process.env.PERFOX_TEMPLATE = template;
process.env.PERFOX_OUTPUT = output;
process.env.PERFOX_COMPONENTS = componentsFile;
process.env.PERFOX_BLOCK2_FILE = block2File;
process.env.PERFOX_SECTION4_FILE = path.join(folder, 'section4.txt');
process.env.PERFOX_TRADE_NAME =
  'Система цифровой рентгенографии PerfoX 3000B-1 в комплекте с принадлежностями';
process.env.TS_BLOCK4_MATCH = 'Требования условиям эксплуатации';

execFileSync(
  'powershell',
  ['-NoProfile', '-ExecutionPolicy', 'Bypass', '-File', path.join(PROJECT_ROOT, 'fill_perfox_word.ps1')],
  { stdio: 'inherit', env: process.env }
);

console.log('Done:', output);
