const fs = require('fs');
const path = require('path');
const { fetchRegistryData } = require('./lib/ndda');
const { equipmentDir, ensureDir } = require('./lib/paths');

const folderName = 'A7 РК-МИ-029920';
const folder = ensureDir(equipmentDir(folderName));
const reg = 'РК МИ (МТ)-0№029920';

(async () => {
  const { id, main, complect } = await fetchRegistryData({
    regNumber: reg,
    searchDigits: '029920',
  });

  console.log('registerId', id);

  fs.writeFileSync(path.join(folder, 'a7_main.json'), JSON.stringify(main, null, 2), 'utf8');
  fs.writeFileSync(path.join(folder, 'a7_complect.json'), JSON.stringify(complect, null, 2), 'utf8');
  console.log('tradeName:', main.tradeName?.slice(0, 120));
  console.log('purpose:', main.purpose?.slice(0, 300));
  console.log('shortTech:', main.shortTechnicalCharacteristicsRu?.slice(0, 2500));
  console.log('comments:', main.comments);
  console.log('complect:', complect?.length);

  const queries = [
    'A7', '34I-OXY', '34I-AIR', '34I-N2O', 'MOX-3', 'севофлуран', 'абсорбер',
    'VCV', 'PCV', 'SIMV', 'испаритель', 'дисплей', 'аккумулятор', 'контур',
  ];
  const names = complect.map((c) => c.productName);
  for (const q of queries) {
    const m = names.filter((n) => n.toLowerCase().includes(q.toLowerCase()));
    if (m.length) console.log(q + ':', m.slice(0, 5).join(' | ') + (m.length > 5 ? ` (+${m.length - 5})` : ''));
  }
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
