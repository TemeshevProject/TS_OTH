const fs = require('fs');
const path = require('path');
const { post, get } = require('./lib/ndda');
const { equipmentDir, ensureDir } = require('./lib/paths');

const folderName = 'Navigator DR Care РК-МИ-028212';
const folder = ensureDir(equipmentDir(folderName));
const reg = 'РК МИ (МТ)-0№028212';

(async () => {
  let item = null;
  const list = await post('/list', { regNumber: reg, page: 1, pageSize: 10, regTypeId: 2 });
  item = list?.data?.[0] ?? list?.[0];
  if (!item?.id) {
    const list2 = await post('/list', { searchText: '028212', page: 1, pageSize: 20, regTypeId: 2 });
    item = (list2?.data ?? list2 ?? []).find((x) => (x.regNumber || '').includes('028212'));
  }
  if (!item?.id) {
    const list3 = await post('/list', { searchText: 'Navigator', page: 1, pageSize: 20, regTypeId: 2 });
    console.log('Navigator hits:', (list3?.data ?? list3 ?? []).map((x) => x.regNumber + ' | ' + (x.tradeName || '').slice(0, 80)));
    item = (list3?.data ?? list3 ?? []).find((x) => (x.regNumber || '').includes('028212'));
  }
  if (!item?.id) throw new Error('Register item not found');

  const id = item.id;
  console.log('registerId', id, item.regNumber);

  const main = await get(`/MtMainGetById?Id=${id}`);
  const complect = await get(`/MtComplectList?registerId=${id}`);

  fs.writeFileSync(path.join(folder, 'navigator_main.json'), JSON.stringify(main, null, 2), 'utf8');
  fs.writeFileSync(path.join(folder, 'navigator_complect.json'), JSON.stringify(complect, null, 2), 'utf8');
  console.log('tradeName:', main.tradeName);
  console.log('purpose:', main.purpose?.slice(0, 200));
  console.log('shortTech:', main.shortTechnicalCharacteristicsRu?.slice(0, 1500));
  console.log('complect:', complect?.length);

  const names = complect.map((c) => c.productName);
  for (const q of ['стол', 'пульт', 'щит', 'фантом', 'Navigator', 'маммог']) {
    const m = names.filter((n) => n.toLowerCase().includes(q.toLowerCase()));
    if (m.length) console.log(q + ':', m.join(' | '));
  }
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
