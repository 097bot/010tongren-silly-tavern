<template>
  <section v-if="rows.length" class="grid">
    <FoldSection
      title="判定状态"
      eyebrow="最新判定"
      :meta="`${rows.length} 项`"
      tone="blue"
      :storage-key="'zero_gate.status.vue.v5.section.judgement.main'"
    >
      <div class="rows">
        <div v-for="row in rows" :key="row.label" class="row">
          <span>{{ row.label }}</span>
          <strong>{{ row.value }}</strong>
        </div>
      </div>
    </FoldSection>
  </section>

  <div v-else class="empty">当前还没有可显示的判定状态。</div>
</template>

<script setup lang="ts">
import FoldSection from './FoldSection.vue';

defineProps<{
  rows: { label: string; value: string }[];
}>();
</script>

<style scoped lang="scss">
.grid {
  display: grid;
  gap: var(--zg-space-2);
}

.row span {
  font-family: "IBM Plex Mono", "Courier New", monospace;
  font-size: var(--zg-fs-2xs);
  color: var(--zg-muted);
  letter-spacing: 0.12em;
}

.rows {
  display: grid;
  gap: var(--zg-space-2);
}

.row {
  display: grid;
  gap: var(--zg-space-1);
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
