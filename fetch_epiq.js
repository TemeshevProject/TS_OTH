const fs = require('fs');
const path = require('path');
const { fetchRegistryData } = require('./lib/ndda');
const { equipmentDir, ensureDir } = require('./lib/paths');

const folderName = 'EPIQ РК МИ-027246';
const folder = ensureDir(equipmentDir(folderName));

(async () => {
  const { main, complect } = await fetchRegistryData({
    regNumber: 'РК МИ (МТ)-0№027246',
    searchDigits: '027246',
    searchText: 'EPIQ',
  });

  fs.writeFileSync(path.join(folder, 'epiq_main.json'), JSON.stringify(main, null, 2), 'utf8');
  fs.writeFileSync(path.join(folder, 'epiq_complect.json'), JSON.stringify(complect, null, 2), 'utf8');

  const block2Path = path.join(folder, 'block2.txt');
  if (!fs.existsSync(block2Path)) {
    fs.writeFileSync(block2Path, (main.purpose || '').trim(), 'utf8');
  }

  console.log('Saved to', folder);
  console.log('tradeName:', main.tradeName);
})().catch((e) => {
  console.error(e);
  process.exit(1);
});