const BASE = 'https://oldregister.ndda.kz/register-backend/RegisterService';

async function post(path, body) {
  const r = await fetch(BASE + path, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    body: JSON.stringify(body),
  });
  const text = await r.text();
  if (!r.ok) throw new Error(path + ' ' + r.status + ' ' + text.slice(0, 200));
  return JSON.parse(text);
}

async function get(path) {
  const r = await fetch(BASE + path, { headers: { Accept: 'application/json' } });
  const text = await r.text();
  if (!r.ok) throw new Error(path + ' ' + r.status + ' ' + text.slice(0, 200));
  return JSON.parse(text);
}

async function findRegisterItem({ regNumber, searchDigits, searchText }) {
  if (regNumber) {
    const list = await post('/list', { regNumber, page: 1, pageSize: 10, regTypeId: 2 });
    const item = list?.data?.[0] ?? list?.[0] ?? list?.items?.[0];
    if (item?.id) return item;
  }

  if (searchDigits) {
    const list2 = await post('/list', { searchText: searchDigits, page: 1, pageSize: 20, regTypeId: 2 });
    const items = list2?.data ?? list2 ?? [];
    const item = items.find((x) => (x.regNumber || '').includes(searchDigits));
    if (item?.id) return item;
  }

  if (searchText) {
    const list3 = await post('/list', { searchText, page: 1, pageSize: 20, regTypeId: 2 });
    const items = list3?.data ?? list3 ?? [];
    if (searchDigits) {
      const item = items.find((x) => (x.regNumber || '').includes(searchDigits));
      if (item?.id) return item;
    }
    const item = items[0];
    if (item?.id) return item;
  }

  return null;
}

async function fetchRegistryData({ regNumber, searchDigits, searchText }) {
  const item = await findRegisterItem({ regNumber, searchDigits, searchText });
  if (!item?.id) throw new Error('Register item not found');

  const id = item.id;
  const main = await get(`/MtMainGetById?Id=${id}`);
  const complect = await get(`/MtComplectList?registerId=${id}`);

  return { item, id, main, complect };
}

module.exports = { post, get, findRegisterItem, fetchRegistryData };
