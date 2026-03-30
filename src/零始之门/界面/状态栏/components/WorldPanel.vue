<template>
  <section v-if="scene.length" class="grid">
    <FoldSection
      v-if="scene.length"
      title="场景环境"
      eyebrow="现场记录"
      :meta="`${scene.length} 项`"
      tone="green"
      :storage-key="'zero_gate.status.vue.v5.section.world.scene'"
    >
      <div class="rows">
        <div v-for="row in scene" :key="row.label" class="row">
          <span>{{ row.label }}</span>
          <strong>{{ row.value }}</strong>
        </div>
      </div>
    </FoldSection>

  </section>

  <div v-else class="empty">当前还没有可显示的世界信息。</div>
</template>

<script setup lang="ts">
import FoldSection from './FoldSection.vue';

defineProps<{
  scene: { label: string; value: string }[];
}>();
</script>

<style scoped lang="scss">
.grid {
  display: grid;
  gap: var(--zg-space-2);
}

.row span,
small {
  font-family: "IBM Plex Mono", "Courier New", monospace;
}

.rows {
  display: grid;
  gap: var(--zg-space-2);
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
