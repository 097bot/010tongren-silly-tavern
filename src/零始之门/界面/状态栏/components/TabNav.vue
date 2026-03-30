<template>
  <nav class="tabs" :class="selectedTone">
    <label class="field">
      <span class="select-wrap">
        <select
          class="select"
          :value="modelValue"
          @change="$emit('update:modelValue', ($event.target as HTMLSelectElement).value)"
        >
          <option v-for="tab in tabs" :key="tab.id" :value="tab.id">
            {{ tab.label }}
          </option>
        </select>
        <span class="arrow">▾</span>
      </span>
    </label>
  </nav>
</template>

<script setup lang="ts">
import { computed } from 'vue';

const props = defineProps<{
  tabs: { id: string; label: string; tone: string }[];
  modelValue: string;
}>();

defineEmits<{
  'update:modelValue': [value: string];
}>();

const selectedTone = computed(() => props.tabs.find(tab => tab.id === props.modelValue)?.tone ?? 'green');
</script>

<style scoped lang="scss">
.tabs {
  --tab-accent: rgba(74, 103, 65, 0.72);
  width: 100%;
}

.tabs.gold {
  --tab-accent: rgba(200, 168, 74, 0.82);
}

.tabs.blue {
  --tab-accent: rgba(95, 141, 180, 0.82);
}

.tabs.red {
  --tab-accent: rgba(200, 96, 96, 0.84);
}

.tabs.rose {
  --tab-accent: rgba(207, 143, 175, 0.84);
}

.tabs.violet {
  --tab-accent: rgba(143, 121, 201, 0.84);
}

.field {
  display: block;
}

.select,
.arrow {
  font-family: "IBM Plex Mono", "Courier New", monospace;
}

.select-wrap {
  position: relative;
  display: block;
  overflow: hidden;
  border: 1px solid rgba(126, 147, 113, 0.34);
  border-radius: 3px;
  background:
    linear-gradient(180deg, rgba(255, 255, 255, 0.03), transparent 54%),
    rgba(10, 16, 10, 0.94);
  transition: border-color 0.18s ease, background 0.18s ease;

  &::before {
    content: "";
    position: absolute;
    inset: 0;
    pointer-events: none;
    background:
      linear-gradient(90deg, rgba(255, 255, 255, 0.012) 1px, transparent 1px),
      linear-gradient(rgba(255, 255, 255, 0.012) 1px, transparent 1px);
    background-size: 16px 16px;
    opacity: 0.12;
  }

  &::after {
    content: "";
    position: absolute;
    left: 0;
    top: 0;
    bottom: 0;
    width: 2px;
    background: linear-gradient(180deg, transparent, var(--tab-accent), transparent);
    pointer-events: none;
    opacity: 0.86;
  }

  &:hover {
    border-color: rgba(170, 193, 158, 0.4);
    background:
      linear-gradient(180deg, rgba(255, 255, 255, 0.04), transparent 54%),
      rgba(12, 19, 12, 0.96);
  }
}

.select {
  appearance: none;
  width: 100%;
  padding: var(--zg-space-4) calc(var(--zg-space-5) + 1.4rem) var(--zg-space-4) var(--zg-space-4);
  border: 0;
  background: transparent;
  color: var(--zg-head);
  font-size: var(--zg-fs-sm);
  font-weight: 700;
  letter-spacing: 0.12em;
  line-height: 1.15;
  cursor: pointer;
  transition: color 0.18s ease, background 0.18s ease;

  &:hover {
    color: rgba(212, 205, 184, 0.96);
  }

  &:focus-visible {
    outline: none;
  }
}

.select option {
  background: #0c120d;
  color: var(--zg-text);
}

.arrow {
  position: absolute;
  right: var(--zg-space-4);
  top: 50%;
  transform: translateY(-50%);
  color: rgba(188, 203, 177, 0.72);
  font-size: var(--zg-fs-sm);
  pointer-events: none;
}

@media (max-width: 720px) {
  .select {
    padding: var(--zg-space-3) calc(var(--zg-space-4) + 1.35rem) var(--zg-space-3) var(--zg-space-3);
    font-size: var(--zg-fs-xs);
    letter-spacing: 0.1em;
  }

  .arrow {
    right: var(--zg-space-3);
    font-size: var(--zg-fs-sm);
  }
}

@media (max-width: 480px) {
  .select {
    padding-right: 36px;
    padding-left: 11px;
  }
}
</style>
