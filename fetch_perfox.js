const fs = require('fs');
const path = require('path');
const { fetchRegistryData } = require('./lib/ndda');
const { equipmentDir, ensureDir } = require('./lib/paths');

const folderName = 'PerfoX 3000B-1 РК-МИ-026055';
const folder = ensureDir(equipmentDir(folderName));

(async () => {
  const { main, complect } = await fetchRegistryData({
    regNumber: 'РК МИ (МТ)-0№026055',
    searchDigits: '026055',
    searchText: 'PerfoX',
  });

  fs.writeFileSync(path.join(folder, 'perfox_main.json'), JSON.stringify(main, null, 2), 'utf8');
  fs.writeFileSync(path.join(folder, 'perfox_complect.json'), JSON.stringify(complect, null, 2), 'utf8');
  fs.writeFileSync(path.join(folder, 'block2.txt'), main.purpose || '', 'utf8');
  console.log('Saved to', folder);
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
