<template>
  <section v-if="summary.length || allies.length" class="grid">
    <FoldSection
      v-if="summary.length"
      title="战况总览"
      eyebrow="战况记录"
      :meta="`${summary.length} 项`"
      tone="red"
      :storage-key="'zero_gate.status.vue.v5.section.combat.summary'"
    >
      <div class="rows">
        <div v-for="row in summary" :key="row.label" class="row">
          <span>{{ row.label }}</span>
          <strong>{{ row.value }}</strong>
        </div>
      </div>
    </FoldSection>

    <FoldSection
      v-if="allies.length"
      title="我方状态"
      eyebrow="我方快照"
      :meta="`${allies.length} 名`"
      tone="green"
      :storage-key="'zero_gate.status.vue.v5.section.combat.allies'"
    >
      <div class="list">
        <div v-for="card in allies" :key="card.title" class="entry-card">
          <strong>{{ card.title }}</strong>
          <small>{{ card.eyebrow }}</small>
          <div v-if="card.meters.length" class="meters">
            <div v-for="item in card.meters" :key="item.label" class="meter">
              <div class="meter-meta"><span>{{ item.label }}</span><span>{{ item.text }}</span></div>
              <div class="meter-track"><span class="meter-fill" :class="item.tone" :style="{ width: `${item.value}%` }"></span></div>
            </div>
          </div>
          <div class="rows compact">
            <div v-for="row in card.rows" :key="`${card.title}-${row.label}`" class="row">
              <span>{{ row.label }}</span>
              <strong>{{ row.value }}</strong>
            </div>
          </div>
        </div>
      </div>
    </FoldSection>

  </section>

  <div v-else class="empty">当前没有战斗总览或我方状态接入。</div>
</template>

<script setup lang="ts">
import FoldSection from './FoldSection.vue';

defineProps<{
  summary: { label: string; value: string }[];
  allies: {
    title: string;
    eyebrow: string;
    meters: { label: string; text: string; value: number; tone: string }[];
    rows: { label: string; value: string }[];
  }[];
}>();
</script>

<style scoped lang="scss">
.grid {
  display: grid;
  gap: var(--zg-space-2);
}

.row span,
.meter-meta,
small {
  font-family: "IBM Plex Mono", "Courier New", monospace;
}

.rows,
.list,
.meters {
  display: grid;
  gap: var(--zg-space-2);
}

.list {
  grid-template-columns: repeat(auto-fit, minmax(min(100%, 16rem), 1fr));
  grid-auto-flow: dense;
  align-items: start;
}

.compact {
  margin-top: var(--zg-space-3);
}

.entry-card {
  padding: var(--zg-space-4);
  border-radius: 3px;
  border: 1px solid rgba(138, 122, 80, 0.16);
  background: rgba(255, 255, 255, 0.03);

  strong {
    display: block;
    font-size: var(--zg-fs-lg);
  }

  small {
    display: block;
    margin-top: var(--zg-space-1);
    color: var(--zg-soft);
    font-size: var(--zg-fs-xs);
  }

  &.danger {
    border-color: rgba(200, 96, 96, 0.24);
  }
}

.row {
  display: grid;
  gap: var(--zg-space-1);
}

.row span,
.meter-meta {
  font-size: var(--zg-fs-2xs);
  color: var(--zg-muted);
  letter-spacing: 0.12em;
}

.row strong {
  font-size: var(--zg-fs-md);
  line-height: 1.55;
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

  &.red {
    background: linear-gradient(90deg, #8a4141, var(--zg-red));
  }

  &.green {
    background: linear-gradient(90deg, #55784f, var(--zg-green));
  }
}

.empty {
  padding: var(--zg-space-4);
  border-radius: 4px;
  border: 1px dashed rgba(138, 122, 80, 0.28);
  color: var(--zg-muted);
}
</style>
