<template>
  <section v-if="cards.length || summary.length" class="layout">
    <FoldSection
      v-if="summary.length"
      class="section-wide"
      title="角色摘要"
      eyebrow="角色概览"
      :meta="`${cards.length} 名`"
      tone="gold"
      :storage-key="'zero_gate.status.vue.v5.section.character.summary'"
    >
      <div class="rows">
        <div v-for="row in summary" :key="row.label" class="row">
          <span>{{ row.label }}</span>
          <strong>{{ row.value }}</strong>
        </div>
      </div>
    </FoldSection>

    <div v-if="cards.length" class="card-grid">
      <FoldSection
        v-for="card in cards"
        :key="card.title"
        :title="card.title"
        :eyebrow="card.eyebrow"
        :tone="card.tone || 'green'"
        :meta="`${card.rows.length} 项`"
        :storage-key="`zero_gate.status.vue.v5.section.character.card.${card.title}`"
      >
        <div v-if="card.meters.length" class="meters">
          <div v-for="item in card.meters" :key="item.label" class="meter">
            <div class="meter-meta"><span>{{ item.label }}</span><span>{{ item.text }}</span></div>
            <div class="meter-track"><span class="meter-fill" :class="item.tone" :style="{ width: `${item.value}%` }"></span></div>
          </div>
        </div>

        <div class="rows">
          <div v-for="row in card.rows" :key="`${card.title}-${row.label}`" class="row">
            <span>{{ row.label }}</span>
            <strong>{{ row.value }}</strong>
          </div>
        </div>
      </FoldSection>
    </div>
  </section>

  <div v-else class="empty">角色变量还没有同步进来。</div>
</template>

<script setup lang="ts">
import FoldSection from './FoldSection.vue';

defineProps<{
  cards: {
    title: string;
    eyebrow: string;
    tone?: string;
    meters: { label: string; text: string; value: number; tone: string }[];
    rows: { label: string; value: string }[];
  }[];
  summary: { label: string; value: string }[];
}>();
</script>

<style scoped lang="scss">
.layout {
  display: grid;
  gap: var(--zg-space-2);
}

.section-wide {
  width: 100%;
}

.card-grid {
  display: grid;
  gap: var(--zg-space-2);
  grid-template-columns: repeat(auto-fit, minmax(min(100%, 16rem), 1fr));
  grid-auto-flow: dense;
  align-items: start;
}

.row span,
.meter-meta {
  font-family: "IBM Plex Mono", "Courier New", monospace;
}

.meters,
.rows {
  display: grid;
  gap: var(--zg-space-2);
}

.meter {
  display: grid;
  gap: var(--zg-space-1);
}

.meter-meta {
  display: flex;
  justify-content: space-between;
  gap: var(--zg-space-2);
  font-size: var(--zg-fs-2xs);
  color: rgba(226, 220, 204, 0.74);
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

  &.green {
    background: linear-gradient(90deg, #55784f, var(--zg-green));
  }

  &.red {
    background: linear-gradient(90deg, #8a4141, var(--zg-red));
  }

  &.gold {
    background: linear-gradient(90deg, #856834, var(--zg-gold));
  }
}

.row {
  display: grid;
  gap: var(--zg-space-1);
}

.row span {
  display: inline-flex;
  justify-self: start;
  align-items: center;
  width: fit-content;
  padding: 1px 6px;
  border-radius: 2px;
  border: 1px solid rgba(138, 122, 80, 0.18);
  background: rgba(9, 15, 10, 0.88);
  font-size: var(--zg-fs-2xs);
  color: rgba(226, 220, 204, 0.82);
  letter-spacing: 0.12em;
}

.row strong {
  font-size: var(--zg-fs-md);
  line-height: 1.55;
}

.empty {
  padding: 12px;
  border-radius: 4px;
  border: 1px dashed rgba(138, 122, 80, 0.28);
  color: var(--zg-muted);
}
</style>
