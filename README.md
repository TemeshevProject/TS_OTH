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

### Сборка Word одним кликом (Windows)

**Рабочий процесс:**

1. В Cursor напишите: *«Подготовь ТС для GIOTTO …»* (или другой комплект).
2. Дождитесь, пока агент сохранит `*_components.json`, `block2.txt`, `section4.txt`.
3. На Windows дважды щёлкните **`Собрать ТС.bat`** — откроется меню выбора комплекта.

   Или сразу по ярлыку:
   - `Собрать ТС GIOTTO.bat`
   - `Собрать ТС A7.bat`
   - `Собрать ТС Navigator.bat`

4. Готовый файл: `ТС {название комплекта}.doc` в папке комплекта.

**Требования:** Windows, Microsoft Word, Node.js, файл `template\Шаблон.doc`.

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
| Локальный Windows | ✅ | ✅ (один клик через `build-ts.bat`) |

В облаке агент может готовить JSON, тексты комплектующих и править скрипты; финальный `.doc` собирается на Windows двойным щелчком по `.bat`.

### Как получать Word сразу в Cursor (без Windows)

Сейчас шаблон заполняется через Microsoft Word (COM). Чтобы агент отдавал готовый файл прямо в чате, нужно перейти на генерацию **без Word** — например, шаблон `.docx` + библиотека `docxtemplater` или LibreOffice в облаке. Это отдельная доработка; если нужно — можно реализовать.

## Реестр

API: `https://oldregister.ndda.kz/register-backend/RegisterService`

Веб-интерфейс: https://oldregister.ndda.kz/#/reestr
