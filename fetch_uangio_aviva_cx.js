const fs = require('fs');
const path = require('path');
const { fetchRegistryData } = require('./lib/ndda');
const { equipmentDir, ensureDir } = require('./lib/paths');

const folderName = 'uAngio AVIVA CX РК МИ-030885';
const folder = ensureDir(equipmentDir(folderName));

(async () => {
  const { main, complect } = await fetchRegistryData({
    regNumber: 'РК МИ (МТ)-0№030885',
    searchDigits: '030885',
    searchText: 'uAngio',
  });

  fs.writeFileSync(path.join(folder, 'uangio_main.json'), JSON.stringify(main, null, 2), 'utf8');
  fs.writeFileSync(path.join(folder, 'uangio_complect.json'), JSON.stringify(complect, null, 2), 'utf8');

  const block2Path = path.join(folder, 'block2.txt');
  if (!fs.existsSync(block2Path)) {
    fs.writeFileSync(block2Path, (main.purpose || '').trim(), 'utf8');
  }

  console.log('Saved to', folder);
  console.log('tradeName:', main.tradeName);
  console.log('shortTech:', (main.shortTech || '').slice(0, 200));
})().catch((e) => {
  console.error(e);
  process.exit(1);
});