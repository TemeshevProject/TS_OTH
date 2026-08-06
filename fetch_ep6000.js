const fs = require('fs');
const path = require('path');
const { fetchRegistryData } = require('./lib/ndda');
const { equipmentDir, ensureDir } = require('./lib/paths');

const folderName = 'EP-6000 РК-МТ-020540';
const folder = ensureDir(equipmentDir(folderName));

(async () => {
  const { main, complect } = await fetchRegistryData({
    regNumber: 'РК-МТ-5№020540',
    searchDigits: '020540',
    searchText: 'EP-6000',
  });

  fs.writeFileSync(path.join(folder, 'ep6000_main.json'), JSON.stringify(main, null, 2), 'utf8');
  fs.writeFileSync(path.join(folder, 'ep6000_complect.json'), JSON.stringify(complect, null, 2), 'utf8');
  fs.writeFileSync(path.join(folder, 'block2.txt'), main.purpose || '', 'utf8');
  console.log('Saved to', folder);
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
