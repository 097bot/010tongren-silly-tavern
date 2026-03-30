import fs from 'node:fs';
import path from 'node:path';

const distFile = 'D:/Silly010/zero_gate_ui/tavern_helper_template-main/dist/零始之门/界面/状态栏/index.html';
const targetFile = 'D:/Silly010/zero_gate_ui/tavern_helper_template-main/src/零始之门/正则/【状态栏】.txt';

let lastWritten = '';
let timer = null;

function wrapHtml(html) {
  return `\`\`\`html\n${html}\n\`\`\`\n`;
}

function sync(reason = 'change') {
  try {
    if (!fs.existsSync(distFile)) {
      console.warn(`[statusbar-inline-sync] dist not found: ${distFile}`);
      return;
    }

    const html = fs.readFileSync(distFile, 'utf8');
    const wrapped = wrapHtml(html);
    if (wrapped === lastWritten) return;

    const prev = fs.existsSync(targetFile) ? fs.readFileSync(targetFile, 'utf8') : '';
    if (prev === wrapped) {
      lastWritten = wrapped;
      return;
    }

    fs.writeFileSync(targetFile, wrapped, 'utf8');
    lastWritten = wrapped;
    console.log(`[statusbar-inline-sync] synced (${reason}) ${new Date().toLocaleString('zh-CN', { hour12: false })}`);
  } catch (error) {
    console.error('[statusbar-inline-sync] sync failed');
    console.error(error);
  }
}

function schedule(reason) {
  clearTimeout(timer);
  timer = setTimeout(() => sync(reason), 150);
}

sync('startup');

const watchDir = path.dirname(distFile);
const watchName = path.basename(distFile);

fs.watch(watchDir, { persistent: true }, (eventType, filename) => {
  if (!filename) return;
  if (String(filename) !== watchName) return;
  schedule(eventType || 'watch');
});

console.log(`[statusbar-inline-sync] watching ${distFile}`);
process.stdin.resume();
