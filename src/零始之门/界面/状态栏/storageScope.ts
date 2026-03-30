const runtime = globalThis as Record<string, any>;

export function getStatusMessageScope() {
  try {
    if (typeof runtime.getCurrentMessageId === 'function') {
      const messageId = runtime.getCurrentMessageId();
      if (messageId !== null && messageId !== undefined) {
        const text = String(messageId).trim();
        if (text) return text;
      }
    }
  } catch {
    // Ignore runtime lookup failures and fall back to preview scope.
  }

  return 'preview';
}

export function scopeStatusStorageKey(key: string) {
  const trimmed = key.trim();
  if (!trimmed) return '';
  return `${trimmed}.${getStatusMessageScope()}`;
}
