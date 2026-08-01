const fs = require('fs');
const path = require('path');
const { post, get } = require('./lib/ndda');
const { equipmentDir, ensureDir } = require('./lib/paths');

const regVariants = [
  'РК МТ-0№022898',
  'РК МИ (МТ)-0№022898',
  'РК-МТ-0№022898',
];
const folderName = 'ENDODRY РК-МТ-022898';
const folder = ensureDir(equipmentDir(folderName));

(async () => {
  let item = null;
  for (const reg of regVariants) {
    const list = await post('/list', { regNumber: reg, page: 1, pageSize: 10, regTypeId: 2 });
    item = list?.data?.[0] ?? list?.[0];
    if (item?.id) {
      console.log('found by regNumber:', reg);
      break;
    }
  }
  if (!item?.id) {
    const list3 = await post('/list', { searchText: '022898', page: 1, pageSize: 20, regTypeId: 2 });
    item = (list3?.data ?? list3 ?? []).find((x) => (x.regNumber || '').includes('022898'));
    console.log('search by 022898', item?.regNumber);
  }
  if (!item?.id) {
    const list4 = await post('/list', { searchText: 'ENDODRY', page: 1, pageSize: 20, regTypeId: 2 });
    console.log('ENDODRY hits:', (list4?.data ?? list4 ?? []).map((x) => x.regNumber + ' ' + (x.tradeName || '').slice(0, 60)));
    item = (list4?.data ?? list4 ?? []).find((x) => (x.regNumber || '').includes('022898'));
  }
  if (!item?.id) throw new Error('Register item not found');

  const id = item.id;
  console.log('registerId', id, item.regNumber);

  const main = await get(`/MtMainGetById?Id=${id}`);
  const complect = await get(`/MtComplectList?registerId=${id}`);

  fs.writeFileSync(path.join(folder, 'endodry_main.json'), JSON.stringify(main, null, 2), 'utf8');
  fs.writeFileSync(path.join(folder, 'endodry_complect.json'), JSON.stringify(complect, null, 2), 'utf8');
  console.log('Saved. tradeName:', main.tradeName?.slice(0, 100));
  console.log('complect items:', complect?.length);
  const names = complect.map((c) => c.productName);
  for (const q of ['сканер', 'штрих', 'шнур', 'пневм', 'руковод', 'LAN', 'кабель']) {
    const m = names.filter((n) => n.toLowerCase().includes(q.toLowerCase()));
    if (m.length) console.log(q + ':', m.join(' | '));
  }
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
