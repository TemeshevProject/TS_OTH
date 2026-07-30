const fs = require('fs');
const path = require('path');
const { PROJECT_ROOT, resolveTemplateFile, equipmentDir } = require('./lib/paths');

const folderName = 'PerfoX 3000B-1 РК-МИ-026055';
const folder = equipmentDir(folderName);

const checks = [
  ['Node.js', process.version],
  ['Папка проекта', PROJECT_ROOT],
  ['run_fill_perfox.js', fs.existsSync(path.join(PROJECT_ROOT, 'run_fill_perfox.js'))],
  ['fill_perfox_word.ps1', fs.existsSync(path.join(PROJECT_ROOT, 'fill_perfox_word.ps1'))],
  ['fill_ts_helpers.ps1', fs.existsSync(path.join(PROJECT_ROOT, 'fill_ts_helpers.ps1'))],
  ['build-perfox.bat', fs.existsSync(path.join(PROJECT_ROOT, 'build-perfox.bat'))],
  ['Папка комплекта', fs.existsSync(folder)],
  ['perfox_main.json', fs.existsSync(path.join(folder, 'perfox_main.json'))],
  ['perfox_components.json', fs.existsSync(path.join(folder, 'perfox_components.json'))],
  ['block2.txt', fs.existsSync(path.join(folder, 'block2.txt'))],
  ['section4.txt', fs.existsSync(path.join(folder, 'section4.txt'))],
  ['Шаблон Word', fs.existsSync(resolveTemplateFile())],
];

console.log('\n=== Проверка проекта PerfoX ===\n');
let ok = true;
for (const [name, value] of checks) {
  const pass = value === true || (typeof value === 'string' && value);
  const mark = pass ? 'OK' : 'НЕТ';
  if (value === true) console.log(`[${mark}] ${name}`);
  else if (value === false) { console.log(`[${mark}] ${name}`); ok = false; }
  else console.log(`[OK] ${name}: ${value}`);
}
console.log(ok ? '\nВсё на месте. Запускайте: build-perfox.bat\n' : '\nЕсть проблемы. Скачайте обновлённый ZIP проекта.\n');
process.exit(ok ? 0 : 1);
