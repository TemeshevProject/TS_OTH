const fs = require('fs');
const path = require('path');
const { fetchRegistryData } = require('./lib/ndda');
const { equipmentDir, ensureDir } = require('./lib/paths');

const folderName = 'BD FACSLyric РК-МИ-028782';
const folder = ensureDir(equipmentDir(folderName));

(async () => {
  const { main, complect } = await fetchRegistryData({
    regNumber: 'РК МИ (in vitro)-0№028782',
    searchDigits: '028782',
    searchText: 'FACSLyric',
  });

  fs.writeFileSync(path.join(folder, 'faclyric_main.json'), JSON.stringify(main, null, 2), 'utf8');
  fs.writeFileSync(path.join(folder, 'faclyric_complect.json'), JSON.stringify(complect, null, 2), 'utf8');

  const block2Path = path.join(folder, 'block2.txt');
  if (!fs.existsSync(block2Path)) {
    fs.writeFileSync(block2Path, main.purpose || '', 'utf8');
  }

  console.log('Saved to', folder);
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
