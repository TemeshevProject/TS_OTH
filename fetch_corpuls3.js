const fs = require('fs');
const path = require('path');
const { fetchRegistryData } = require('./lib/ndda');
const { equipmentDir, ensureDir } = require('./lib/paths');

const folderName = 'corpuls3 РК-МТ-021680';
const folder = ensureDir(equipmentDir(folderName));

(async () => {
  const { main, complect } = await fetchRegistryData({
    regNumber: 'РК-МТ-5№021680',
    searchDigits: '021680',
    searchText: 'corpuls',
  });

  fs.writeFileSync(path.join(folder, 'corpuls3_main.json'), JSON.stringify(main, null, 2), 'utf8');
  fs.writeFileSync(path.join(folder, 'corpuls3_complect.json'), JSON.stringify(complect, null, 2), 'utf8');

  const block2Path = path.join(folder, 'block2.txt');
  if (!fs.existsSync(block2Path)) {
    const purpose = (main.purpose || '').trim();
    const block2 = `${purpose}\n\nОбеспечивает выполнение следующих медицинских услуг:\n- реанимационное мероприятие дефибриляция (для измерения и мониторинга жизненно важных функций).`;
    fs.writeFileSync(block2Path, block2, 'utf8');
  }

  console.log('Saved to', folder);
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
