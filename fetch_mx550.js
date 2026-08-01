const fs = require('fs');
const path = require('path');
const { fetchRegistryData } = require('./lib/ndda');
const { equipmentDir, ensureDir } = require('./lib/paths');

const folderName = 'IntelliVue MX550 РК-МИ (МТ)-027701';
const folder = ensureDir(equipmentDir(folderName));

(async () => {
  const { main, complect } = await fetchRegistryData({
    regNumber: 'РК МИ (МТ)-0№027701',
    searchDigits: '027701',
    searchText: 'MX550',
  });

  fs.writeFileSync(path.join(folder, 'mx550_main.json'), JSON.stringify(main, null, 2), 'utf8');
  fs.writeFileSync(path.join(folder, 'mx550_complect.json'), JSON.stringify(complect, null, 2), 'utf8');

  const block2 = [
    (main.purpose || '').trim(),
    '',
    'Обеспечивает выполнение следующих медицинских услуг:',
    '- Мониторинг жизненно важных показателей.',
  ].join('\n');

  fs.writeFileSync(path.join(folder, 'block2.txt'), block2, 'utf8');
  console.log('Saved to', folder);
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
