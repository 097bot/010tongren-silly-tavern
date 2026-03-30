<template>
  <section class="layout">
    <FoldSection
      v-if="summary.length"
      class="section-wide"
      title="背包总览"
      :meta="`${totalSlots} 格`"
      tone="gold"
      :storage-key="'zero_gate.status.vue.v5.section.bag.summary'"
    >
      <div v-if="compactSummary.length" class="summary-strip">
        <template v-for="(row, index) in compactSummary" :key="row.label">
          <div class="summary-row">
            <span>{{ row.label }}</span>
            <strong>{{ row.value }}</strong>
          </div>
          <span v-if="index < compactSummary.length - 1" class="summary-divider">|</span>
        </template>
      </div>

      <div v-if="changeSummary" class="summary-change">
        <span>{{ changeSummary.label }}</span>
        <strong>{{ changeSummary.value }}</strong>
      </div>
    </FoldSection>

    <div v-if="categories.length" class="category-grid">
      <FoldSection
        v-for="group in categories"
        :key="group.key"
        :title="group.title"
        :meta="`${group.slots.length} 格`"
        :tone="group.tone"
        :storage-key="`zero_gate.status.vue.v5.section.bag.category.${group.key}`"
      >
        <div class="slot-grid">
          <div v-for="slot in group.slots" :key="slot.id" class="slot" :class="slot.tone">
            <small v-if="slot.meta">{{ slot.meta }}</small>
            <strong>{{ slot.title }}</strong>
            <span>{{ slot.summary }}</span>
          </div>
        </div>
      </FoldSection>
    </div>

    <div v-if="details.length" class="detail-grid">
      <FoldSection
        v-for="group in details"
        :key="group.key"
        :title="group.title"
        :meta="`${group.items.length} 项`"
        :tone="group.tone"
        :storage-key="`zero_gate.status.vue.v5.section.bag.detail.${group.key}`"
      >
        <div class="list">
          <div v-for="card in group.items" :key="card.title" class="list-card">
            <strong>{{ card.title }}</strong>
            <div v-if="card.meters.length" class="meters">
              <div v-for="item in card.meters" :key="item.label" class="meter">
                <div class="meter-meta"><span>{{ item.label }}</span><span>{{ item.text }}</span></div>
                <div class="meter-track"><span class="meter-fill" :class="item.tone" :style="{ width: `${item.value}%` }"></span></div>
              </div>
            </div>
            <div v-if="card.rows.length" class="rows compact">
              <div v-for="row in card.rows" :key="`${card.title}-${row.label}`" class="row">
                <span>{{ row.label }}</span>
                <strong>{{ row.value }}</strong>
              </div>
            </div>
          </div>
        </div>
      </FoldSection>
    </div>

    <div v-if="!categories.length" class="empty">当前背包为空。</div>
  </section>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import FoldSection from './FoldSection.vue';

const props = defineProps<{
  summary: { label: string; value: string }[];
  categories: {
    key: string;
    title: string;
    tone: string;
    eyebrow: string;
    slots: { id: string; title: string; tone: string; summary: string; meta?: string }[];
  }[];
  details: {
    key: string;
    title: string;
    tone: string;
    eyebrow: string;
    description: string;
    items: {
      title: string;
      eyebrow: string;
      meters: { label: string; text: string; value: number; tone: string }[];
      rows: { label: string; value: string }[];
    }[];
  }[];
}>();

const totalSlots = computed(() => props.categories.reduce((sum, group) => sum + group.slots.length, 0));
const changeSummary = computed(() => props.summary.find(row => row.label === '本轮变化'));
const compactSummary = computed(() => props.summary.filter(row => row.label !== '本轮变化'));
</script>

<style scoped lang="scss">
.layout {
  display: grid;
  gap: var(--zg-space-2);
}

.section-wide {
  width: 100%;
}

.category-grid {
  display: grid;
  gap: var(--zg-space-2);
  grid-template-columns: repeat(auto-fit, minmax(min(100%, 16rem), 1fr));
  grid-auto-flow: dense;
  align-items: start;
}

.detail-grid {
  display: grid;
  gap: var(--zg-space-2);
}

.row span,
.meter-meta,
.slot small,
.summary-row span,
.summary-divider,
.summary-change span {
  font-family: "IBM Plex Mono", "Courier New", monospace;
}

.rows,
.list,
.meters {
  display: grid;
  gap: var(--zg-space-2);
}

.summary-strip {
  display: flex;
  flex-wrap: wrap;
  align-items: baseline;
  gap: var(--zg-space-1) var(--zg-space-2);
}

.summary-row {
  display: inline-flex;
  align-items: baseline;
  gap: var(--zg-space-1);
  min-width: 0;
}

.summary-divider {
  color: rgba(200, 168, 74, 0.52);
  font-size: var(--zg-fs-xs);
}

.summary-change {
  margin-top: var(--zg-space-3);
  display: grid;
  gap: var(--zg-space-1);
}

.compact {
  margin-top: var(--zg-space-3);
}

.row {
  display: grid;
  gap: var(--zg-space-1);
}

.row span,
.meter-meta,
.slot small,
.summary-row span,
.summary-change span {
  font-size: var(--zg-fs-2xs);
  color: var(--zg-muted);
  letter-spacing: 0.12em;
}

.row strong,
.summary-row strong,
.summary-change strong {
  font-size: var(--zg-fs-md);
  line-height: 1.55;
}

.slot-grid {
  display: grid;
  gap: var(--zg-space-2);
  grid-template-columns: repeat(auto-fit, minmax(6.5rem, 1fr));
  grid-auto-flow: dense;
  align-items: start;
}

.slot {
  position: relative;
  padding: var(--zg-space-2) var(--zg-space-3) calc(var(--zg-space-2) - 0.05rem) var(--zg-space-4);
  border-radius: 3px;
  border: 1px solid rgba(138, 122, 80, 0.2);
  background:
    linear-gradient(180deg, rgba(255, 255, 255, 0.04), transparent 48%),
    linear-gradient(90deg, rgba(255, 255, 255, 0.012) 1px, transparent 1px),
    rgba(8, 14, 8, 0.72);
  background-size: auto, 16px 16px, auto;
  display: grid;
  gap: var(--zg-space-1);
  box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.018);

  &::before {
    content: "";
    position: absolute;
    left: 0;
    top: 8px;
    bottom: 8px;
    width: 2px;
    border-radius: 999px;
    background: currentColor;
    opacity: 0.76;
  }

  &.weapon {
    color: #8fa8c3;
    border-color: rgba(122, 154, 190, 0.28);
    background-color: rgba(23, 35, 48, 0.58);
  }

  &.medical {
    color: #b56a6a;
    border-color: rgba(181, 106, 106, 0.28);
    background-color: rgba(52, 24, 24, 0.58);
  }

  &.ration {
    color: #79956f;
    border-color: rgba(121, 149, 111, 0.28);
    background-color: rgba(24, 39, 22, 0.58);
  }

  &.artifact {
    color: #8f79c9;
    border-color: rgba(143, 121, 201, 0.28);
    background-color: rgba(34, 26, 52, 0.58);
  }

  &.intel {
    color: #d1b46b;
    border-color: rgba(209, 180, 107, 0.28);
    background-color: rgba(58, 45, 18, 0.58);
  }
}

.slot strong {
  color: var(--zg-text);
  font-size: var(--zg-fs-md);
  line-height: 1.28;
}

.slot span {
  color: var(--zg-soft);
  font-size: var(--zg-fs-xs);
  line-height: 1.45;
}

.list-card {
  padding: var(--zg-space-4);
  border-radius: 4px;
  border: 1px solid rgba(138, 122, 80, 0.18);
  background:
    linear-gradient(180deg, rgba(255, 255, 255, 0.04), transparent 55%),
    rgba(255, 255, 255, 0.025);

  strong {
    display: block;
    font-size: var(--zg-fs-lg);
    color: var(--zg-text);
  }
}

.meter {
  display: grid;
  gap: var(--zg-space-1);
}

.meter-meta {
  display: flex;
  justify-content: space-between;
  gap: var(--zg-space-2);
}

.meter-track {
  height: 8px;
  border-radius: 999px;
  overflow: hidden;
  background: rgba(255, 255, 255, 0.08);
}

.meter-fill {
  display: block;
  height: 100%;
  border-radius: 999px;

  &.blue {
    background: linear-gradient(90deg, #4f74a4, var(--zg-blue));
  }

  &.gold {
    background: linear-gradient(90deg, #856834, var(--zg-gold));
  }
}

.empty {
  padding: var(--zg-space-4);
  border-radius: 4px;
  border: 1px dashed rgba(138, 122, 80, 0.28);
  background: rgba(255, 255, 255, 0.02);
  color: var(--zg-muted);
  line-height: 1.7;
}

@media (max-width: 560px) {
  .summary-strip {
    gap: var(--zg-space-1) var(--zg-space-2);
  }

  .summary-row {
    gap: var(--zg-space-1);
  }

  .slot-grid {
    grid-template-columns: repeat(auto-fit, minmax(5.75rem, 1fr));
  }

  .slot {
    padding: var(--zg-space-2) var(--zg-space-2) calc(var(--zg-space-2) - 0.05rem) var(--zg-space-3);
  }
}
</style>
