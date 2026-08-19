const fs = require('fs');
const path = require('path');
const { fetchRegistryData } = require('./lib/ndda');
const { equipmentDir, ensureDir } = require('./lib/paths');

const folderName = 'uCT 550 РК-МТ-021991';
const folder = ensureDir(equipmentDir(folderName));

(async () => {
  const { main, complect } = await fetchRegistryData({
    regNumber: 'РК-МТ-5№021991',
    searchDigits: '021991',
    searchText: 'uCT 550',
  });

  fs.writeFileSync(path.join(folder, 'uct550_main.json'), JSON.stringify(main, null, 2), 'utf8');
  fs.writeFileSync(path.join(folder, 'uct550_complect.json'), JSON.stringify(complect, null, 2), 'utf8');
  fs.writeFileSync(path.join(folder, 'block2.txt'), main.purpose || '', 'utf8');
  console.log('Saved to', folder);
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
