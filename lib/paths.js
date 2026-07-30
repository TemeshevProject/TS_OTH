const fs = require('fs');
const path = require('path');

/** Корень проекта (репозиторий TS_OTH). */
const PROJECT_ROOT = path.resolve(__dirname, '..');

/** Папка с шаблоном Word. Положите сюда `Шаблон.doc` или задайте TS_TEMPLATE. */
const TEMPLATE_DIR = process.env.TS_TEMPLATE_DIR || path.join(PROJECT_ROOT, 'template');

function resolveTemplateFile() {
  if (process.env.TS_TEMPLATE && fs.existsSync(process.env.TS_TEMPLATE)) {
    return process.env.TS_TEMPLATE;
  }
  const preferred = path.join(TEMPLATE_DIR, 'Шаблон.doc');
  if (fs.existsSync(preferred)) return preferred;
  if (fs.existsSync(TEMPLATE_DIR)) {
    const doc = fs.readdirSync(TEMPLATE_DIR).find((f) => f.toLowerCase().endsWith('.doc'));
    if (doc) return path.join(TEMPLATE_DIR, doc);
  }
  return preferred;
}

const TEMPLATE_FILE = resolveTemplateFile();

function equipmentDir(folderName) {
  return path.join(PROJECT_ROOT, folderName);
}

function ensureDir(dir) {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  return dir;
}

function assertFiles(label, files) {
  const missing = files.filter((f) => !fs.existsSync(f));
  if (missing.length) {
    const msg = [
      `${label}: не найдены файлы:`,
      ...missing.map((f) => `  - ${f}`),
      '',
      'Скачайте обновлённый проект:',
      'https://github.com/TemeshevProject/TS_OTH/archive/refs/heads/cursor/setup-ts-oth-project-ae1b.zip',
    ].join('\n');
    throw new Error(msg);
  }
}

module.exports = {
  PROJECT_ROOT,
  TEMPLATE_DIR,
  TEMPLATE_FILE,
  resolveTemplateFile,
  equipmentDir,
  ensureDir,
  assertFiles,
};
