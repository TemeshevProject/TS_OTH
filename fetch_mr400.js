const fs = require('fs');
const path = require('path');
const { fetchRegistryData } = require('./lib/ndda');
const { equipmentDir, ensureDir } = require('./lib/paths');

const folderName = 'Expression MR400 РК-МТ-019336';
const folder = ensureDir(equipmentDir(folderName));

(async () => {
  const { main, complect } = await fetchRegistryData({
    regNumber: 'РК-МТ-5№019336',
    searchDigits: '019336',
    searchText: 'MR400',
  });

  fs.writeFileSync(path.join(folder, 'mr400_main.json'), JSON.stringify(main, null, 2), 'utf8');
  fs.writeFileSync(path.join(folder, 'mr400_complect.json'), JSON.stringify(complect, null, 2), 'utf8');

  const block2 = [
    (main.purpose || '').trim(),
    '',
    'Обеспечивает выполнение следующих медицинских услуг:',
    '- Мониторинг жизненно важных показателей во время процедуры МРТ.',
  ].join('\n');

  fs.writeFileSync(path.join(folder, 'block2.txt'), block2, 'utf8');
  console.log('Saved to', folder);
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
