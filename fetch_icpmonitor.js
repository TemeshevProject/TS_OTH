const fs = require('fs');
const path = require('path');
const { fetchRegistryData } = require('./lib/ndda');
const { equipmentDir, ensureDir } = require('./lib/paths');

const folderName = 'ICP-Monitor HDM 29.2 РК-МИ (МТ)-023843';
const folder = ensureDir(equipmentDir(folderName));

(async () => {
  const { main, complect } = await fetchRegistryData({
    regNumber: 'РК МИ (МТ)-0№023843',
    searchDigits: '023843',
    searchText: 'ICP-Monitor',
  });

  fs.writeFileSync(path.join(folder, 'icpmonitor_main.json'), JSON.stringify(main, null, 2), 'utf8');
  fs.writeFileSync(path.join(folder, 'icpmonitor_complect.json'), JSON.stringify(complect, null, 2), 'utf8');
  fs.writeFileSync(path.join(folder, 'block2.txt'), (main.purpose || '').trim(), 'utf8');
  console.log('Saved to', folder);
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
