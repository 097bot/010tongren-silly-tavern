<template>
  <section v-if="npc.length || monsters.length" class="grid">
    <FoldSection
      v-if="npc.length"
      title="NPC档案"
      eyebrow="人物记录"
      :meta="`${npc.length} 条`"
      tone="green"
      :open="true"
    >
      <div class="list">
        <div v-for="card in npc" :key="card.title" class="entry-card">
          <strong>{{ card.title }}</strong>
          <small v-if="card.eyebrow">{{ card.eyebrow }}</small>
          <div class="rows compact">
            <div v-for="row in card.rows" :key="`${card.title}-${row.label}`" class="row">
              <span>{{ row.label }}</span>
              <strong>{{ row.value }}</strong>
            </div>
          </div>
        </div>
      </div>
    </FoldSection>

    <FoldSection
      v-if="monsters.length"
      title="怪物档案"
      eyebrow="异变记录"
      :meta="`${monsters.length} 条`"
      tone="violet"
    >
      <div class="list">
        <div v-for="card in monsters" :key="card.title" class="entry-card monster">
          <strong>{{ card.title }}</strong>
          <small v-if="card.eyebrow">{{ card.eyebrow }}</small>
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

  <div v-else class="empty">当前还没有可展示的档案记录。</div>
</template>

<script setup lang="ts">
import FoldSection from './FoldSection.vue';

defineProps<{
  npc: {
    title: string;
    eyebrow: string;
    rows: { label: string; value: string }[];
  }[];
  monsters: {
    title: string;
    eyebrow: string;
    rows: { label: string; value: string }[];
  }[];
}>();
</script>

<style scoped lang="scss">
.grid {
  columns: 17.5rem;
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

.rows,
.list {
  display: grid;
  gap: var(--zg-space-2);
}

.compact {
  margin-top: var(--zg-space-3);
}

.entry-card {
  padding: var(--zg-space-4);
  border-radius: 4px;
  border: 1px solid rgba(138, 122, 80, 0.16);
  background:
    linear-gradient(180deg, rgba(255, 255, 255, 0.04), transparent 55%),
    rgba(255, 255, 255, 0.025);

  &.monster {
    border-color: rgba(159, 139, 222, 0.22);
  }

  strong {
    display: block;
    font-size: var(--zg-fs-lg);
    color: var(--zg-text);
  }

  small {
    display: block;
    margin-top: var(--zg-space-1);
    color: var(--zg-soft);
    font-size: var(--zg-fs-xs);
    line-height: 1.42;
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
  background: rgba(255, 255, 255, 0.02);
  color: var(--zg-muted);
}
</style>
