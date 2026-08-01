const fs = require('fs');
const path = require('path');
const { fetchRegistryData } = require('./lib/ndda');
const { equipmentDir, ensureDir } = require('./lib/paths');

const folderName = 'Консоль Xenios для ЭКМО РК-МТ-022292';
const folder = ensureDir(equipmentDir(folderName));

(async () => {
  const { main, complect } = await fetchRegistryData({
    regNumber: 'РК-МТ-5№022292',
    searchDigits: '022292',
    searchText: 'Xenios',
  });

  fs.writeFileSync(path.join(folder, 'xenios_main.json'), JSON.stringify(main, null, 2), 'utf8');
  fs.writeFileSync(path.join(folder, 'xenios_complect.json'), JSON.stringify(complect, null, 2), 'utf8');

  const block2 = [
    (main.purpose || '').trim(),
    '',
    'Обеспечивает выполнение следующих медицинских услуг:',
    '- Экстракорпоральная мембранная оксигенация, детей.',
  ].join('\n');

  fs.writeFileSync(path.join(folder, 'block2.txt'), block2, 'utf8');
  console.log('Saved to', folder);
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
