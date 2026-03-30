<template>
  <details class="fold" :class="[tone]" :open="currentOpen" @toggle="handleToggle">
    <summary>
      <span class="fold-left">
        <span class="fold-icon">{{ icon }}</span>
        <span class="fold-text">
          <span class="fold-title">{{ title }}</span>
          <span v-if="eyebrow" class="fold-sub">{{ eyebrow }}</span>
        </span>
      </span>

      <span class="fold-right">
        <span v-if="meta" class="fold-meta">{{ meta }}</span>
        <span class="fold-arrow">▼</span>
      </span>

      <span class="fold-glow"></span>
    </summary>

    <div class="fold-body">
      <div class="fold-inner">
        <slot />
      </div>
    </div>
  </details>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';

const props = withDefaults(
  defineProps<{
    title: string;
    eyebrow?: string;
    meta?: string;
    icon?: string;
    tone?: string;
    open?: boolean;
    storageKey?: string;
  }>(),
  {
    eyebrow: '',
    meta: '',
    icon: '▣',
    tone: '',
    open: false,
    storageKey: '',
  },
);

function readStoredOpen(key: string) {
  try {
    if (!globalThis.localStorage) return null;
    const stored = globalThis.localStorage.getItem(key);
    if (stored === null) return null;
    return stored === 'true';
  } catch {
    return null;
  }
}

function writeStoredOpen(key: string, value: boolean) {
  try {
    if (!globalThis.localStorage) return;
    globalThis.localStorage.setItem(key, value ? 'true' : 'false');
  } catch {
    // Ignore storage write failures and keep the in-memory state usable.
  }
}

function resolveOpenState() {
  if (!props.storageKey) return props.open;
  const stored = readStoredOpen(props.storageKey);
  return stored ?? props.open;
}

const currentOpen = ref(resolveOpenState());

watch(
  () => props.storageKey,
  () => {
    currentOpen.value = resolveOpenState();
  },
);

watch(
  () => props.open,
  value => {
    if (!props.storageKey || readStoredOpen(props.storageKey) === null) {
      currentOpen.value = value;
    }
  },
);

function handleToggle(event: Event) {
  const next = (event.currentTarget as HTMLDetailsElement | null)?.open ?? false;
  currentOpen.value = next;

  if (props.storageKey) {
    writeStoredOpen(props.storageKey, next);
  }
}
</script>

<style scoped lang="scss">
.fold {
  --fold-accent: rgba(74, 103, 65, 0.72);
  position: relative;
  width: 100%;
  overflow: hidden;
  border: 1px solid rgba(138, 122, 80, 0.38);
  border-radius: 3px;
  background: rgba(8, 14, 8, 0.92);
  box-shadow: none;
  transition: border-color 0.22s ease, background 0.22s ease;

  &::before {
    content: "";
    position: absolute;
    left: 0;
    top: 0;
    bottom: 0;
    width: 2px;
    background: linear-gradient(180deg, transparent, var(--fold-accent), transparent);
    opacity: 0.8;
    pointer-events: none;
    z-index: 1;
  }

  &::after {
    content: "";
    position: absolute;
    inset: 0;
    pointer-events: none;
    background:
      linear-gradient(90deg, rgba(255, 255, 255, 0.012) 1px, transparent 1px),
      linear-gradient(rgba(255, 255, 255, 0.012) 1px, transparent 1px);
    background-size: 18px 18px;
    opacity: 0.12;
    z-index: 0;
  }

  &.gold {
    --fold-accent: rgba(138, 122, 80, 0.84);
  }

  &.green {
    --fold-accent: rgba(74, 103, 65, 0.84);
  }

  &.blue {
    --fold-accent: rgba(95, 141, 180, 0.84);
  }

  &.red {
    --fold-accent: rgba(200, 96, 96, 0.82);
  }

  &.violet {
    --fold-accent: rgba(122, 92, 191, 0.72);
  }

  &.rose {
    --fold-accent: rgba(180, 60, 90, 0.74);
  }

  &:hover {
    border-color: rgba(138, 122, 80, 0.52);
  }
}

summary {
  position: relative;
  z-index: 2;
  list-style: none;
  cursor: pointer;
  user-select: none;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: var(--zg-space-3);
  padding: var(--zg-space-2) var(--zg-space-4);
  background: rgba(74, 103, 65, 0.1);
  border-bottom: 1px solid rgba(138, 122, 80, 0.18);
  overflow: hidden;
  transition: background 0.2s ease;

  &:hover {
    background: rgba(74, 103, 65, 0.16);
  }

  &::marker,
  &::-webkit-details-marker {
    display: none;
  }
}

.fold[open] summary {
  background: rgba(74, 103, 65, 0.16);
}

.fold-left,
.fold-right {
  display: inline-flex;
  align-items: center;
  gap: var(--zg-space-2);
  min-width: 0;
  position: relative;
  z-index: 1;
}

.fold-right {
  flex: 0 0 auto;
}

.fold-title,
.fold-sub,
.fold-meta,
.fold-arrow {
  font-family: "IBM Plex Mono", "Courier New", monospace;
}

.fold-icon {
  width: 22px;
  height: 22px;
  flex: 0 0 auto;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border: 1px solid rgba(138, 122, 80, 0.28);
  border-radius: 2px;
  background: rgba(138, 122, 80, 0.06);
  color: #c8a84a;
  font-size: var(--zg-fs-sm);
  box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.01);
}

.fold-text {
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 1px;
}

.fold-title {
  color: var(--zg-head);
  font-size: var(--zg-fs-sm);
  font-weight: 700;
  letter-spacing: 0.14em;
  line-height: 1.16;
  white-space: normal;
}

.fold-sub {
  display: inline-flex;
  align-items: center;
  width: fit-content;
  max-width: 100%;
  padding: 0 var(--zg-space-2);
  border-radius: 2px;
  border: 1px solid var(--zg-chip-border);
  background: var(--zg-chip-bg);
  color: var(--zg-chip-text);
  font-size: var(--zg-fs-3xs);
  letter-spacing: 0.08em;
  line-height: 1.4;
  white-space: normal;
}

.fold-meta {
  color: rgba(221, 214, 196, 0.76);
  font-size: var(--zg-fs-2xs);
  letter-spacing: 0.08em;
}

.fold-arrow {
  font-size: var(--zg-fs-xs);
  color: rgba(138, 122, 80, 0.5);
  transition: transform 0.25s ease;
  display: inline-block;
}

.fold[open] .fold-arrow {
  transform: rotate(180deg);
}

.fold-glow {
  position: absolute;
  inset: 0;
  background: linear-gradient(
    90deg,
    transparent 0%,
    rgba(160, 180, 190, 0) 28%,
    rgba(160, 180, 190, 0.03) 50%,
    rgba(160, 180, 190, 0) 72%,
    transparent 100%
  );
  pointer-events: none;
  z-index: 1;
}

.fold-body {
  display: grid;
  grid-template-rows: 0fr;
  transition: grid-template-rows 0.28s ease;
  position: relative;
  z-index: 2;
}

.fold[open] .fold-body {
  grid-template-rows: 1fr;
}

.fold-inner {
  min-height: 0;
  overflow: hidden;
  padding: 0 var(--zg-space-4);
  opacity: 0;
  transform: translateY(-4px);
  transition: opacity 0.2s ease, transform 0.24s ease, padding 0.24s ease;
}

.fold[open] .fold-inner {
  padding: var(--zg-space-3) var(--zg-space-4) var(--zg-space-4);
  opacity: 1;
  transform: translateY(0);
}

@media (max-width: 720px) {
  summary {
    gap: var(--zg-space-2);
    padding: var(--zg-space-2) var(--zg-space-3);
    align-items: flex-start;
  }

  .fold-left {
    gap: var(--zg-space-2);
    flex: 1 1 auto;
  }

  .fold-right {
    gap: var(--zg-space-1);
    max-width: 42%;
    flex-wrap: wrap;
    justify-content: flex-end;
  }

  .fold-meta {
    white-space: normal;
    text-align: right;
  }

  .fold-inner {
    padding: 0 var(--zg-space-3);
  }

  .fold[open] .fold-inner {
    padding: var(--zg-space-3) var(--zg-space-3) calc(var(--zg-space-3) + 0.05rem);
  }
}

@media (max-width: 480px) {
  .fold-title {
    font-size: var(--zg-fs-xs);
    letter-spacing: 0.14em;
  }

  .fold-sub,
  .fold-meta {
    font-size: var(--zg-fs-3xs);
  }

  .fold-right {
    max-width: 48%;
  }
}

</style>
