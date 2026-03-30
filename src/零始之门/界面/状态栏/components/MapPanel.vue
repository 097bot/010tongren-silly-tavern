<template>
  <section v-if="points.length || plans.length" class="grid">
    <FoldSection
      v-if="points.length"
      title="地图点位"
      eyebrow="地图标注"
      :meta="`${points.length} 点`"
      tone="green"
      :open="true"
    >
      <div class="list">
        <div v-for="point in points" :key="point.title" class="point-card">
          <strong>{{ point.title }}</strong>
          <small>{{ point.eyebrow }}</small>
          <div class="rows compact">
            <div v-for="row in point.rows" :key="`${point.title}-${row.label}`" class="row">
              <span>{{ row.label }}</span>
              <strong>{{ row.value }}</strong>
            </div>
          </div>
        </div>
      </div>
    </FoldSection>

    <FoldSection
      v-if="plans.length"
      title="推进路径"
      eyebrow="路线推进"
      :meta="`${plans.length} 条`"
      tone="gold"
    >
      <div class="list">
        <div v-for="plan in plans" :key="plan.title" class="point-card">
          <strong>{{ plan.title }}</strong>
          <small>{{ plan.eyebrow }}</small>
          <div class="rows compact">
            <div v-for="row in plan.rows" :key="`${plan.title}-${row.label}`" class="row">
              <span>{{ row.label }}</span>
              <strong>{{ row.value }}</strong>
            </div>
          </div>
        </div>
      </div>
    </FoldSection>
  </section>

  <div v-else class="empty">地图和路径还没有写入变量。</div>
</template>

<script setup lang="ts">
import FoldSection from './FoldSection.vue';

defineProps<{
  points: {
    title: string;
    eyebrow: string;
    rows: { label: string; value: string }[];
  }[];
  plans: {
    title: string;
    eyebrow: string;
    rows: { label: string; value: string }[];
  }[];
}>();
</script>

<style scoped lang="scss">
.grid {
  columns: 17rem;
  column-gap: var(--zg-space-2);
}

.grid > * {
  break-inside: avoid;
  display: block;
  width: 100%;
  margin: 0 0 var(--zg-space-2);
}

.row span,
small {
  font-family: "IBM Plex Mono", "Courier New", monospace;
}

.list,
.rows {
  display: grid;
  gap: var(--zg-space-2);
}

.compact {
  margin-top: var(--zg-space-3);
}

.point-card {
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
}

.row {
  display: grid;
  gap: var(--zg-space-1);
}

.row span {
  font-size: var(--zg-fs-2xs);
  color: var(--zg-muted);
  letter-spacing: 0.12em;
}

.row strong {
  font-size: var(--zg-fs-md);
  line-height: 1.55;
}

.empty {
  padding: var(--zg-space-4);
  border-radius: 4px;
  border: 1px dashed rgba(138, 122, 80, 0.28);
  color: var(--zg-muted);
}
</style>
