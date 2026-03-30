<template>
  <section class="grid">
    <FoldSection
      title="主 CP"
      eyebrow="关系焦点"
      :meta="`${favor}/100`"
      tone="rose"
      :storage-key="'zero_gate.status.vue.v5.section.relation.focus'"
    >
      <h2>{{ currentCp }}</h2>
      <div v-if="viewpoint || event || bond" class="rows compact">
        <div v-if="viewpoint" class="row">
          <span>视角</span>
          <strong>{{ viewpoint }}</strong>
        </div>
        <div v-if="event" class="row">
          <span>当前事件</span>
          <strong>{{ event }}</strong>
        </div>
        <div v-if="bond" class="row">
          <span>羁绊</span>
          <strong>{{ bond }}</strong>
        </div>
      </div>
      <div class="meter">
        <div class="meta"><span>关系热度</span><span>{{ favor }}/100</span></div>
        <div class="track"><span class="fill" :style="{ width: `${Math.max(0, Math.min(100, (favor + 100) / 2))}%` }"></span></div>
      </div>
    </FoldSection>

    <FoldSection
      v-if="relationCards.length"
      title="关系事件"
      eyebrow="事件记录"
      :meta="`${relationCards.length} 条`"
      :storage-key="'zero_gate.status.vue.v5.section.relation.events'"
    >
      <div class="archives">
        <div v-for="entry in relationCards" :key="entry.title" class="archive-card">
          <strong>{{ entry.title }}</strong>
          <small>{{ entry.eyebrow }}</small>
          <div class="rows compact">
            <div v-for="row in entry.rows" :key="`${entry.title}-${row.label}`" class="row">
              <span>{{ row.label }}</span>
              <strong>{{ row.value }}</strong>
            </div>
          </div>
        </div>
      </div>
    </FoldSection>

    <FoldSection
      v-if="allyRelations.length || enemyRelations.length"
      title="阵营"
      eyebrow="阵营关系"
      :meta="`${allyRelations.length + enemyRelations.length} 条`"
      tone="gold"
      :storage-key="'zero_gate.status.vue.v5.section.relation.factions'"
    >
      <div class="faction-groups">
        <div v-if="allyRelations.length" class="faction-group">
          <div class="group-title">盟友阵营</div>
          <div class="faction-list">
            <div v-for="item in allyRelations" :key="`ally-${item.name}`" class="faction-card ally">
              <div class="faction-head">
                <strong>{{ item.name }}</strong>
                <small>盟友</small>
              </div>
              <div class="meta"><span>阵营值</span><span>{{ item.text }}</span></div>
              <div class="track"><span class="fill green" :style="{ width: `${item.percent}%` }"></span></div>
            </div>
          </div>
        </div>

        <div v-if="enemyRelations.length" class="faction-group">
          <div class="group-title warn">敌对阵营</div>
          <div class="faction-list">
            <div v-for="item in enemyRelations" :key="`enemy-${item.name}`" class="faction-card enemy">
              <div class="faction-head">
                <strong>{{ item.name }}</strong>
                <small>敌对</small>
              </div>
              <div class="meta"><span>阵营值</span><span>{{ item.text }}</span></div>
              <div class="track"><span class="fill red" :style="{ width: `${item.percent}%` }"></span></div>
            </div>
          </div>
        </div>
      </div>
    </FoldSection>

    <div v-if="!relationCards.length && !allyRelations.length && !enemyRelations.length" class="empty">当前还没有细分关系条目。</div>
  </section>
</template>

<script setup lang="ts">
import FoldSection from './FoldSection.vue';

defineProps<{
  currentCp: string;
  viewpoint?: string;
  event?: string;
  bond?: string;
  favor: number;
  allyRelations: { name: string; value: number; text: string; percent: number; tone: string }[];
  enemyRelations: { name: string; value: number; text: string; percent: number; tone: string }[];
  relationCards: { title: string; eyebrow: string; rows: { label: string; value: string }[] }[];
}>();
</script>

<style scoped lang="scss">
.grid {
  display: grid;
  gap: var(--zg-space-2);
}

.row span,
.meta,
.archive-card small {
  font-family: "IBM Plex Mono", "Courier New", monospace;
}

h2 {
  font-size: var(--zg-fs-xl);
  line-height: 1.1;
}

.rows {
  display: grid;
  gap: var(--zg-space-2);
}

.row {
  display: grid;
  gap: var(--zg-space-1);
}

.row span,
.meta {
  font-size: var(--zg-fs-2xs);
  color: var(--zg-muted);
  letter-spacing: 0.12em;
}

.row strong {
  font-size: var(--zg-fs-md);
  line-height: 1.55;
}

.meter {
  margin-top: var(--zg-space-3);
}

.meta {
  display: flex;
  justify-content: space-between;
  gap: var(--zg-space-2);
  margin-bottom: var(--zg-space-1);
}

.track {
  height: 8px;
  border-radius: 999px;
  overflow: hidden;
  background: rgba(255, 255, 255, 0.08);
}

.fill {
  display: block;
  height: 100%;
  border-radius: 999px;
  background: linear-gradient(90deg, var(--zg-violet), var(--zg-pink));
}

.archives {
  display: grid;
  gap: var(--zg-space-2);
  margin-top: var(--zg-space-3);
  grid-template-columns: repeat(auto-fit, minmax(min(100%, 15.5rem), 1fr));
  grid-auto-flow: dense;
  align-items: start;
}

.compact {
  margin-top: var(--zg-space-3);
}

.archive-card {
  padding: var(--zg-space-3) var(--zg-space-4);
  border-radius: 3px;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(138, 122, 80, 0.16);

  strong {
    display: block;
    font-size: var(--zg-fs-lg);
  }

  small {
    display: block;
    margin-top: var(--zg-space-1);
    color: var(--zg-soft);
    font-size: var(--zg-fs-2xs);
  }
}

.faction-groups {
  display: grid;
  gap: var(--zg-space-3);
}

.faction-group {
  display: grid;
  gap: var(--zg-space-2);
}

.group-title {
  font-family: "IBM Plex Mono", "Courier New", monospace;
  font-size: var(--zg-fs-2xs);
  color: var(--zg-muted);
  letter-spacing: 0.12em;

  &.warn {
    color: #f2b0b0;
  }
}

.faction-list {
  display: grid;
  gap: var(--zg-space-2);
  grid-template-columns: repeat(auto-fit, minmax(min(100%, 14rem), 1fr));
  grid-auto-flow: dense;
  align-items: start;
}

.faction-card {
  padding: var(--zg-space-3) var(--zg-space-4);
  border-radius: 3px;
  border: 1px solid rgba(138, 122, 80, 0.18);
  background: rgba(255, 255, 255, 0.03);

  &.ally {
    border-color: rgba(95, 141, 180, 0.2);
  }

  &.enemy {
    border-color: rgba(200, 96, 96, 0.22);
  }
}

.faction-head {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  gap: var(--zg-space-2);
  margin-bottom: var(--zg-space-2);

  strong {
    font-size: var(--zg-fs-lg);
    color: var(--zg-text);
  }

  small {
    font-family: "IBM Plex Mono", "Courier New", monospace;
    font-size: var(--zg-fs-2xs);
    color: var(--zg-soft);
    letter-spacing: 0.12em;
  }
}

.fill.green {
  background: linear-gradient(90deg, #55784f, var(--zg-green));
}

.fill.red {
  background: linear-gradient(90deg, #8a4141, var(--zg-red));
}

.empty {
  padding: var(--zg-space-4);
  border-radius: 4px;
  border: 1px dashed rgba(138, 122, 80, 0.28);
  color: var(--zg-muted);
}
</style>
