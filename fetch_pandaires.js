const fs = require('fs');
const path = require('path');
const { fetchRegistryData } = require('./lib/ndda');
const { equipmentDir, ensureDir } = require('./lib/paths');

const folderName = 'Panda iRes Warmer РК-МИ (МТ)-028636';
const folder = ensureDir(equipmentDir(folderName));

(async () => {
  const { main, complect } = await fetchRegistryData({
    regNumber: 'РК МИ (МТ)-0№028636',
    searchDigits: '028636',
    searchText: 'Panda',
  });

  fs.writeFileSync(path.join(folder, 'pandaires_main.json'), JSON.stringify(main, null, 2), 'utf8');
  fs.writeFileSync(path.join(folder, 'pandaires_complect.json'), JSON.stringify(complect, null, 2), 'utf8');

  const block2 = [
    (main.purpose || '').trim(),
    '',
    'Обеспечивает выполнение следующих медицинских услуг:',
    '- Реанимационное пособие с подогревом инфракрасным излучением новорожденного.',
  ].join('\n');

  fs.writeFileSync(path.join(folder, 'block2.txt'), block2, 'utf8');
  console.log('Saved to', folder);
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
