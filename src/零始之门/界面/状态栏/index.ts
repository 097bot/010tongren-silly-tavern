import { createApp } from 'vue';
import { createPinia } from 'pinia';
import App from './App.vue';
import './global.css';

let syncRaf = 0;
let syncInterval = 0;
let lastHostFontSize = 0;

async function waitForRuntimeReady() {
  const runtime = globalThis as Record<string, any>;
  if (typeof runtime.waitGlobalInitialized !== 'function') return;

  try {
    await Promise.race([
      runtime.waitGlobalInitialized('Mvu'),
      new Promise(resolve => window.setTimeout(resolve, 1500)),
    ]);
  } catch (error) {
    console.warn('[zero-gate-status] runtime wait skipped', error);
  }
}

function syncHostFontScale(force = false) {
  try {
    const hostWin = (window.parent && window.parent !== window) ? window.parent : window;
    const hostDoc = hostWin.document;

    const candidates = [
      hostDoc.querySelector('.mes_text'),
      hostDoc.querySelector('.mes_reasoning'),
      hostDoc.querySelector('#send_textarea'),
      hostDoc.querySelector('#chat'),
      hostDoc.querySelector('.chat'),
      hostDoc.body,
      hostDoc.documentElement,
    ].filter(Boolean) as HTMLElement[];

    let hostSize = 16;

    for (const el of candidates) {
      const size = Number.parseFloat(hostWin.getComputedStyle(el).fontSize);
      if (size && !Number.isNaN(size)) {
        hostSize = size;
        break;
      }
    }

    if (force || Math.abs(hostSize - lastHostFontSize) > 0.05 || !document.documentElement.style.fontSize) {
      document.documentElement.style.fontSize = `${hostSize}px`;
      lastHostFontSize = hostSize;
    }
  } catch (error) {
    if (force && !document.documentElement.style.fontSize) {
      document.documentElement.style.fontSize = '16px';
      lastHostFontSize = 16;
    }
    console.warn('[zero-gate-status] host font sync skipped', error);
  }
}

function getElementHeight(element: HTMLElement | null | undefined) {
  if (!element) return 0;

  const rectHeight = element.getBoundingClientRect().height;

  return Math.max(
    Math.ceil(rectHeight),
    element.scrollHeight,
    element.offsetHeight,
  );
}

function measureContentHeight() {
  const app = document.getElementById('app');
  const shell = app?.firstElementChild instanceof HTMLElement ? app.firstElementChild : null;

  return Math.max(
    getElementHeight(shell),
    getElementHeight(app),
    1,
  );
}

function syncHostHeight() {
  try {
    const html = document.documentElement;
    const frame = window.frameElement as HTMLElement | null;
    const parent = frame?.parentElement instanceof HTMLElement ? frame.parentElement : null;

    // Keep the document itself free so the measured height can shrink back down.
    document.body.style.height = 'auto';
    document.body.style.minHeight = '0px';
    html.style.height = 'auto';
    html.style.minHeight = '0px';

    const height = measureContentHeight();

    if (frame) {
      frame.style.height = `${height}px`;
      frame.style.minHeight = `${height}px`;
      frame.style.maxHeight = 'none';
      frame.setAttribute('height', String(height));
    }

    if (parent) {
      parent.style.height = `${height}px`;
      parent.style.minHeight = `${height}px`;
      parent.style.maxHeight = 'none';
    }
  } catch (error) {
    console.warn('[zero-gate-status] host height sync skipped', error);
  }
}

function scheduleHostSync(force = false) {
  if (syncRaf) {
    window.cancelAnimationFrame(syncRaf);
  }

  syncRaf = window.requestAnimationFrame(() => {
    syncHostFontScale(force);
    syncHostHeight();
  });
}

function installHostSync() {
  const app = document.getElementById('app');
  scheduleHostSync(true);

  window.addEventListener('resize', () => scheduleHostSync(), { passive: true });

  if (typeof ResizeObserver === 'function') {
    const observer = new ResizeObserver(() => scheduleHostSync());
    observer.observe(document.documentElement);
    if (document.body) observer.observe(document.body);
    if (app) observer.observe(app);
  }

  if (typeof MutationObserver === 'function' && app) {
    const observer = new MutationObserver(() => scheduleHostSync());
    observer.observe(app, {
      childList: true,
      subtree: true,
      characterData: true,
      attributes: true,
    });
  }

  syncInterval = window.setInterval(() => {
    scheduleHostSync();
  }, 800);
}

async function boot() {
  await waitForRuntimeReady();
  createApp(App).use(createPinia()).mount('#app');
  installHostSync();
}

if (typeof globalThis.$ === 'function') {
  $(boot);
} else if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    void boot();
  }, { once: true });
} else {
  void boot();
}
