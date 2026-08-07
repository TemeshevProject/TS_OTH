const fs = require('fs');
const path = require('path');
const { fetchRegistryData } = require('./lib/ndda');
const { equipmentDir, ensureDir } = require('./lib/paths');

const folderName = 'MAC-R32D РК-МТ-020631';
const folder = ensureDir(equipmentDir(folderName));

(async () => {
  const { main, complect } = await fetchRegistryData({
    regNumber: 'РК-МТ-5№020631',
    searchDigits: '020631',
    searchText: 'MAC-R32D',
  });

  fs.writeFileSync(path.join(folder, 'macr32d_main.json'), JSON.stringify(main, null, 2), 'utf8');
  fs.writeFileSync(path.join(folder, 'macr32d_complect.json'), JSON.stringify(complect, null, 2), 'utf8');
  console.log('Saved to', folder);
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
