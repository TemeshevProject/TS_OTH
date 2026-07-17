const fs = require('fs');
const path = require('path');

/** Корень проекта (репозиторий TS_OTH). */
const PROJECT_ROOT = path.resolve(__dirname, '..');

/** Папка с шаблоном Word. Положите сюда `Шаблон.doc` или задайте TS_TEMPLATE. */
const TEMPLATE_DIR = process.env.TS_TEMPLATE_DIR || path.join(PROJECT_ROOT, 'template');
const TEMPLATE_FILE = process.env.TS_TEMPLATE || path.join(TEMPLATE_DIR, 'Шаблон.doc');

function equipmentDir(folderName) {
  return path.join(PROJECT_ROOT, folderName);
}

function ensureDir(dir) {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  return dir;
}

module.exports = {
  PROJECT_ROOT,
  TEMPLATE_DIR,
  TEMPLATE_FILE,
  equipmentDir,
  ensureDir,
};
