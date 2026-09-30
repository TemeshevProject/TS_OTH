const fs = require('fs');
const path = require('path');
const { fetchRegistryData } = require('./lib/ndda');
const { equipmentDir, ensureDir } = require('./lib/paths');

const folderName = 'CASP-50 РК-МТ-014518';
const folder = ensureDir(equipmentDir(folderName));

(async () => {
  const { main, complect } = await fetchRegistryData({
    regNumber: 'РК-МТ-7№014518',
    searchDigits: '014518',
    searchText: 'CASP',
  });

  fs.writeFileSync(path.join(folder, 'casp50_main.json'), JSON.stringify(main, null, 2), 'utf8');
  fs.writeFileSync(path.join(folder, 'casp50_complect.json'), JSON.stringify(complect, null, 2), 'utf8');

  const block2Path = path.join(folder, 'block2.txt');
  if (!fs.existsSync(block2Path)) {
    fs.writeFileSync(block2Path, main.purpose || '', 'utf8');
  }

  console.log('Saved to', folder);
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
