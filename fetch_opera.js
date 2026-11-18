const fs = require('fs');
const path = require('path');
const { fetchRegistryData } = require('./lib/ndda');
const { equipmentDir, ensureDir } = require('./lib/paths');

const folderName = 'OPERA РК-МТ-7№007361';
const folder = ensureDir(equipmentDir(folderName));

(async () => {
  const { main, complect } = await fetchRegistryData({
    regNumber: 'РК-МТ-7№007361',
    searchDigits: '007361',
    searchText: 'OPERA',
  });

  fs.writeFileSync(path.join(folder, 'opera_main.json'), JSON.stringify(main, null, 2), 'utf8');
  fs.writeFileSync(path.join(folder, 'opera_complect.json'), JSON.stringify(complect, null, 2), 'utf8');
  fs.writeFileSync(path.join(folder, 'block2.txt'), main.purpose || '', 'utf8');
  console.log('Saved to', folder);
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
