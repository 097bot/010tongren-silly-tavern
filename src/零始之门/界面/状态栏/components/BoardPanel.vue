<template>
  <section v-if="cards.length" class="board">
    <FoldSection
      :title="title"
      :eyebrow="eyebrow"
      :meta="`${cards.length} ${countLabel}`"
      :tone="tone"
      :open="open"
      :storage-key="storageKey"
    >
      <div class="card-grid">
        <div
          v-for="(card, index) in cards"
          :key="`${card.title}-${index}`"
          class="entry-card"
          :class="[cardVariant, card.tone]"
        >
          <strong>{{ card.title }}</strong>
          <small v-if="card.eyebrow">{{ card.eyebrow }}</small>

          <div v-if="card.meters?.length" class="meters">
            <div v-for="item in card.meters" :key="item.label" class="meter">
              <div class="meter-meta"><span>{{ item.label }}</span><span>{{ item.text }}</span></div>
              <div class="meter-track"><span class="meter-fill" :class="item.tone" :style="{ width: `${item.value}%` }"></span></div>
            </div>
          </div>

          <div v-if="card.rows?.length" class="rows compact">
            <div v-for="row in card.rows" :key="`${card.title}-${row.label}`" class="row">
              <span>{{ row.label }}</span>
              <strong>{{ row.value }}</strong>
            </div>
          </div>
        </div>
      </div>
    </FoldSection>
  </section>

  <div v-else class="empty">{{ emptyText }}</div>
</template>

<script setup lang="ts">
import FoldSection from './FoldSection.vue';

withDefaults(
  defineProps<{
    title: string;
    eyebrow: string;
    tone?: string;
    cards: {
      title: string;
      eyebrow?: string;
      tone?: string;
      meters?: { label: string; text: string; value: number; tone: string }[];
      rows?: { label: string; value: string }[];
    }[];
    emptyText: string;
    countLabel?: string;
    open?: boolean;
    cardVariant?: string;
    storageKey?: string;
  }>(),
  {
    tone: '',
    countLabel: '条',
    open: false,
    cardVariant: '',
    storageKey: '',
  },
);
</script>

<style scoped lang="scss">
.board {
  width: 100%;
}

.card-grid {
  display: grid;
  gap: var(--zg-space-2);
  grid-template-columns: repeat(auto-fit, minmax(min(100%, 15.5rem), 1fr));
  grid-auto-flow: dense;
  align-items: start;
}

.card-grid > *:last-child:nth-child(odd) {
  grid-column: 1 / -1;
}

.row span,
.meter-meta,
small {
  font-family: "IBM Plex Mono", "Courier New", monospace;
}

.rows,
.meters {
  display: grid;
  gap: var(--zg-space-2);
}

.compact {
  margin-top: var(--zg-space-3);
}

.entry-card {
  padding: var(--zg-space-4);
  border-radius: 3px;
  border: 1px solid rgba(138, 122, 80, 0.16);
  background:
    linear-gradient(180deg, rgba(255, 255, 255, 0.04), transparent 55%),
    rgba(255, 255, 255, 0.025);

  &.danger {
    border-color: rgba(200, 96, 96, 0.24);
    background:
      linear-gradient(180deg, rgba(255, 255, 255, 0.04), transparent 55%),
      rgba(72, 26, 26, 0.24);
  }

  &.team {
    border-color: rgba(95, 141, 180, 0.24);
  }

  &.npc {
    border-color: rgba(102, 136, 88, 0.24);
  }

  &.blue {
    border-color: rgba(95, 141, 180, 0.24);
  }

  &.green {
    border-color: rgba(74, 103, 65, 0.24);
  }

  &.red {
    border-color: rgba(200, 96, 96, 0.24);
  }

  &.gold {
    border-color: rgba(200, 168, 74, 0.24);
  }

  &.violet {
    border-color: rgba(143, 121, 201, 0.24);
  }

  &.rose {
    border-color: rgba(207, 143, 175, 0.24);
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

.meter {
  display: grid;
  gap: var(--zg-space-1);
}

.meter-meta {
  display: flex;
  justify-content: space-between;
  gap: var(--zg-space-2);
  font-size: var(--zg-fs-2xs);
  color: var(--zg-muted);
  letter-spacing: 0.12em;
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

  &.violet {
    background: linear-gradient(90deg, #8371ca, var(--zg-violet));
  }

  &.rose {
    background: linear-gradient(90deg, #e0889d, #ffb8c8);
  }

  &.pink,
  &.romance {
    background: linear-gradient(90deg, #ac7ae6, #f2a8db, #f5d6ea);
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

@media (max-width: 720px) {
  .card-grid {
    grid-template-columns: repeat(auto-fit, minmax(min(100%, 13.5rem), 1fr));
  }

  .card-grid > *:last-child:nth-child(odd) {
    grid-column: auto;
  }
}
</style>
