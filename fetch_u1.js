const fs = require('fs');
const path = require('path');
const { fetchRegistryData } = require('./lib/ndda');
const { equipmentDir, ensureDir } = require('./lib/paths');

const folderName = 'U1 РК-МТ-025853';
const folder = ensureDir(equipmentDir(folderName));

(async () => {
  const { main, complect } = await fetchRegistryData({
    regNumber: 'РК МИ (МТ)-0№025853',
    searchDigits: '025853',
    searchText: 'U1',
  });

  fs.writeFileSync(path.join(folder, 'u1_main.json'), JSON.stringify(main, null, 2), 'utf8');
  fs.writeFileSync(path.join(folder, 'u1_complect.json'), JSON.stringify(complect, null, 2), 'utf8');
  console.log('Saved to', folder, 'complect items:', complect?.length ?? 0);
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
