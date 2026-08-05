const fs = require('fs');
const path = require('path');
const { fetchRegistryData } = require('./lib/ndda');
const { equipmentDir, ensureDir } = require('./lib/paths');

const folderName = 'MEDIVATORS ISA РК-МТ-016998';
const folder = ensureDir(equipmentDir(folderName));

(async () => {
  const { main, complect } = await fetchRegistryData({
    regNumber: 'РК-МТ-5№016998',
    searchDigits: '016998',
    searchText: 'MEDIVATORS ISA',
  });

  fs.writeFileSync(path.join(folder, 'isa_main.json'), JSON.stringify(main, null, 2), 'utf8');
  fs.writeFileSync(path.join(folder, 'isa_complect.json'), JSON.stringify(complect, null, 2), 'utf8');
  console.log('Saved to', folder);
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
