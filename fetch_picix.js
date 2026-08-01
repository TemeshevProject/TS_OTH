const fs = require('fs');
const path = require('path');
const { fetchRegistryData } = require('./lib/ndda');
const { equipmentDir, ensureDir } = require('./lib/paths');

const folderName = 'PIC iX РК-МИ (МТ)-027750';
const folder = ensureDir(equipmentDir(folderName));

(async () => {
  const { main, complect } = await fetchRegistryData({
    regNumber: 'РК МИ (МТ)-0№027750',
    searchDigits: '027750',
    searchText: 'PIC iX',
  });

  fs.writeFileSync(path.join(folder, 'picix_main.json'), JSON.stringify(main, null, 2), 'utf8');
  fs.writeFileSync(path.join(folder, 'picix_complect.json'), JSON.stringify(complect, null, 2), 'utf8');

  const block2 = [
    (main.useArea || main.purpose || '').trim(),
    '',
    'Обеспечивает выполнение следующих медицинских услуг:',
    '- Системное мониторирование жизненно важных показателей.',
  ].join('\n');

  fs.writeFileSync(path.join(folder, 'block2.txt'), block2, 'utf8');
  console.log('Saved to', folder);
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
