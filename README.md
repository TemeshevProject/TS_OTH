# ТС ОТХ — технические спецификации медицинской техники

Проект для подготовки технических спецификаций (ТС) по шаблону Word на основе данных [реестра NDDA](https://oldregister.ndda.kz/#/reestr) (Казахстан).

## Что делает проект

1. **Загрузка из реестра** — Node.js-скрипты получают `*_main.json` и `*_complect.json` по номеру РУ.
2. **Описание комплектующих** — тексты в `*_components.json` (раздел 3 ТС).
3. **Заполнение Word** — PowerShell + Microsoft Word (только Windows).

Правила оформления ТС для Cursor заданы в `.cursor/rules/ts-medical-equipment.mdc`.

## Структура

```
├── lib/
│   ├── paths.js          # пути проекта
│   └── ndda.js           # клиент API реестра NDDA
├── template/
│   └── Шаблон.doc        # шаблон Word (добавьте вручную)
├── A7 РК-МИ-029920/      # пример: папка комплекта
│   ├── a7_main.json
│   ├── a7_complect.json
│   ├── a7_components.json
│   └── build_a7_components.js
├── fetch_*.js            # загрузка данных из реестра
├── run_fill_*.js         # сборка и заполнение Word
└── fill_*.ps1            # PowerShell-скрипты для Word
```

## Быстрый старт

### 1. Шаблон Word

Скопируйте файл `Шаблон.doc` в папку `template/` или укажите путь:

```bash
export TS_TEMPLATE="/path/to/Шаблон.doc"
```

### 2. Загрузка данных из реестра (Node.js ≥ 18)

```bash
node fetch_a7.js          # A7 РК-МИ-029920
node fetch_ndda.js        # HyLED C8
node fetch_endodry.js
node fetch_navigator.js
```

### 3. Генерация комплектующих и Word (Windows)

```bash
node "A7 РК-МИ-029920/build_a7_components.js"
node run_fill_a7.js       # требует PowerShell + Word
```

## Примеры запросов в Cursor

- «Загрузи данные из реестра для РУ РК-МИ-029920 и создай папку комплекта»
- «Подготовь описания комплектующих для A7 по реестру и инструкции»
- «Заполни ТС для нового комплекта Evis X1 РК-МТ-029570»

## Ограничения

| Окружение | Загрузка реестра | Заполнение Word |
|-----------|------------------|-----------------|
| Cursor Cloud (Linux) | ✅ | ❌ (нужен Windows + Word) |
| Локальный Windows | ✅ | ✅ |

В облаке агент может готовить JSON, тексты комплектующих и править скрипты; финальный `.doc` собирается на Windows.

## Реестр

API: `https://oldregister.ndda.kz/register-backend/RegisterService`

Веб-интерфейс: https://oldregister.ndda.kz/#/reestr
