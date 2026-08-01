const fs = require('fs');
const path = require('path');
const { fetchRegistryData } = require('./lib/ndda');
const { equipmentDir, ensureDir } = require('./lib/paths');

const folderName = 'HyLED C8 РК-МИ-027894';
const folder = ensureDir(equipmentDir(folderName));
const reg = 'РК МИ (МТ)-0№027894';

(async () => {
  const { id, main, complect } = await fetchRegistryData({
    regNumber: reg,
    searchDigits: '027894',
    searchText: 'HyLED',
  });

  console.log('registerId', id, main.regNumber, main.tradeName?.slice(0, 80));

  fs.writeFileSync(path.join(folder, 'hyled_main.json'), JSON.stringify(main, null, 2), 'utf8');
  fs.writeFileSync(path.join(folder, 'hyled_complect.json'), JSON.stringify(complect, null, 2), 'utf8');
  console.log('Saved main and complect, complect items:', complect?.length ?? 'n/a');
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
