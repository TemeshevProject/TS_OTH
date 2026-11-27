const fs = require('fs');
const path = require('path');
const { equipmentDir, ensureDir } = require('./lib/paths');

const folderName = 'uAngio AVIVA CX РК МИ-030885 (комплект 2)';
const sourceFolder = equipmentDir('uAngio AVIVA CX РК МИ-030885');
const folder = ensureDir(equipmentDir(folderName));

function copyIfExists(name) {
  const src = path.join(sourceFolder, name);
  const dest = path.join(folder, name);
  if (fs.existsSync(src)) {
    fs.copyFileSync(src, dest);
    return true;
  }
  return false;
}

if (!copyIfExists('uangio_main.json') || !copyIfExists('uangio_complect.json')) {
  require('./fetch_uangio_aviva_cx.js');
  copyIfExists('uangio_main.json');
  copyIfExists('uangio_complect.json');
}
copyIfExists('section4.txt');
copyIfExists('block2.txt');

console.log('Ready:', folder);