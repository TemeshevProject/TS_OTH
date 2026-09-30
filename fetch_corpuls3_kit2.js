const fs = require('fs');
const path = require('path');
const { fetchRegistryData } = require('./lib/ndda');
const { equipmentDir, ensureDir } = require('./lib/paths');

const folderName = 'corpuls3 РК-МТ-021680 (комплект 2)';
const sourceFolder = equipmentDir('corpuls3 РК-МТ-021680');
const folder = ensureDir(equipmentDir(folderName));

function copyIfExists(srcName, destName) {
  const src = path.join(sourceFolder, srcName);
  const dest = path.join(folder, destName || srcName);
  if (fs.existsSync(src)) {
    fs.copyFileSync(src, dest);
    return true;
  }
  return false;
}

(async () => {
  if (
    !copyIfExists('corpuls3_main.json') ||
    !copyIfExists('corpuls3_complect.json')
  ) {
    const { main, complect } = await fetchRegistryData({
      regNumber: 'РК-МТ-5№021680',
      searchDigits: '021680',
      searchText: 'corpuls',
    });
    fs.writeFileSync(path.join(folder, 'corpuls3_main.json'), JSON.stringify(main, null, 2), 'utf8');
    fs.writeFileSync(path.join(folder, 'corpuls3_complect.json'), JSON.stringify(complect, null, 2), 'utf8');
  }

  if (!fs.existsSync(path.join(folder, 'section4.txt'))) {
    if (!copyIfExists('section4.txt')) {
      fs.writeFileSync(
        path.join(folder, 'section4.txt'),
        'Температура хранения: от −40 °С до +70 °С. Относительная влажность: до 95 % (без конденсации). Блок питания: 100–240 VAC / 12 VDC, 150 Вт. Батарея: литий-ионная 7,4 V / 5,7 А·ч / 42,2 Вт·ч. Условия эксплуатации: реанимация, скорая медицинская помощь — согласно эксплуатационной документации производителя.\n',
        'utf8'
      );
    }
  }

  const block2Path = path.join(folder, 'block2.txt');
  if (!fs.existsSync(block2Path)) {
    if (!copyIfExists('block2.txt')) {
      const main = JSON.parse(fs.readFileSync(path.join(folder, 'corpuls3_main.json'), 'utf8'));
      const purpose = (main.purpose || '').trim();
      const block2 = `${purpose}\n\nОбеспечивает выполнение следующих медицинских услуг:\n- реанимационное мероприятие дефибриляция (для измерения и мониторинга жизненно важных функций).`;
      fs.writeFileSync(block2Path, block2, 'utf8');
    }
  }

  console.log('Saved to', folder);
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
