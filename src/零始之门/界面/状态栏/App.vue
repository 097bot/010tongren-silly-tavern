<template>
  <div class="shell">
    <TopCards
      :title="overviewTitle"
      :meta="overviewMeta"
      :tone="activeTabTone"
    />

    <div class="toolbar" :class="`tone-${activeTabTone}`">
      <TabNav v-model="activeTab" :tabs="tabs" />
    </div>

    <section class="content">
      <CharacterPanel
        v-if="activeTab === 'character'"
        :cards="characters"
        :summary="characterSummary"
      />

      <BagPanel
        v-else-if="activeTab === 'bag'"
        :summary="bagSummary"
        :categories="bagCategories"
        :details="bagDetailGroups"
      />

      <WorldPanel
        v-else-if="activeTab === 'world'"
        :scene="sceneRows"
      />

      <RouteMapPanel
        v-else-if="activeTab === 'map'"
        :nodes="routeNodes"
        :current-node="routeCurrentNode"
      />

      <WorldAtlasPanel
        v-else-if="activeTab === 'world-map'"
      />

      <BoardPanel
        v-else-if="activeTab === 'plan'"
        title="计划推进"
        eyebrow="推进列表"
        tone="gold"
        count-label="条"
        :cards="planCards"
        :storage-key="sectionStorage.plan"
        empty-text="当前还没有可显示的计划推进。"
      />

      <JudgementPanel
        v-else-if="activeTab === 'judgement'"
        :rows="judgementRows"
      />

      <CombatPanel
        v-else-if="activeTab === 'combat'"
        :summary="combatSummary"
        :allies="combatAllies"
      />

      <BoardPanel
        v-else-if="activeTab === 'enemy'"
        title="敌方情报"
        eyebrow="敌方快照"
        tone="red"
        count-label="名"
        :cards="combatEnemies"
        :storage-key="sectionStorage.enemy"
        empty-text="当前还没有敌方情报接入。"
      />

      <BoardPanel
        v-else-if="activeTab === 'crisis'"
        title="危机面板"
        eyebrow="危机记录"
        tone="gold"
        count-label="项"
        :cards="crisisCards"
        :storage-key="sectionStorage.crisis"
        card-variant="danger"
        empty-text="当前还没有危机面板接入。"
      />

      <RelationPanel
        v-else-if="activeTab === 'relation'"
        :current-cp="currentCp"
        :viewpoint="relationViewpoint"
        :event="relationEvent"
        :bond="bond"
        :favor="favor"
        :ally-relations="allyRelations"
        :enemy-relations="enemyRelations"
        :relation-cards="relationCards"
      />

      <BoardPanel
        v-else-if="activeTab === 'team'"
        title="同行队伍"
        eyebrow="队伍快照"
        tone="blue"
        count-label="名"
        :cards="relationTeamCards"
        :storage-key="sectionStorage.team"
        card-variant="team"
        empty-text="当前还没有同行队伍数据。"
      />

      <BoardPanel
        v-else-if="activeTab === 'npc'"
        title="NPC档案"
        eyebrow="人物记录"
        tone="green"
        count-label="条"
        :cards="npcCards"
        :storage-key="sectionStorage.npc"
        card-variant="npc"
        empty-text="当前还没有 NPC 档案接入。"
      />

      <NsfwPanel
        v-else
        :active="nsfwActive"
        :phase="nsfwPhase"
        :progress="nsfwProgress"
        :stage-note="nsfwStageNote"
        :summary-note="nsfwSummaryNote"
        :actor="nsfwActor"
        :receiver="nsfwReceiver"
        :actor-rows="nsfwActorRows"
        :receiver-rows="nsfwReceiverRows"
        :actor-meters="nsfwActorMeters"
        :receiver-meters="nsfwReceiverMeters"
      />
    </section>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import BagPanel from './components/BagPanel.vue';
import BoardPanel from './components/BoardPanel.vue';
import CharacterPanel from './components/CharacterPanel.vue';
import CombatPanel from './components/CombatPanel.vue';
import JudgementPanel from './components/JudgementPanel.vue';
import NsfwPanel from './components/NsfwPanel.vue';
import RelationPanel from './components/RelationPanel.vue';
import RouteMapPanel from './components/RouteMapPanel.vue';
import TabNav from './components/TabNav.vue';
import TopCards from './components/TopCards.vue';
import WorldPanel from './components/WorldPanel.vue';
import WorldAtlasPanel from './components/WorldAtlasPanel.vue';
import { scopeStatusStorageKey } from './storageScope';
import { useStatusView } from './useStatusView';

const tabs = [
  { id: 'character', label: '角色', tone: 'green' },
  { id: 'bag', label: '背包', tone: 'gold' },
  { id: 'world', label: '场景环境', tone: 'blue' },
  { id: 'map', label: '地图', tone: 'gold' },
  { id: 'world-map', label: '世界地图', tone: 'blue' },
  { id: 'judgement', label: '判定', tone: 'blue' },
  { id: 'plan', label: '计划', tone: 'gold' },
  { id: 'combat', label: '战斗', tone: 'red' },
  { id: 'enemy', label: '敌情', tone: 'red' },
  { id: 'crisis', label: '危机', tone: 'gold' },
  { id: 'relation', label: '关系', tone: 'rose' },
  { id: 'team', label: '队伍', tone: 'blue' },
  { id: 'npc', label: 'NPC', tone: 'green' },
  { id: 'nsfw', label: 'NSFW', tone: 'violet' },
];

function readStoredTab(key: string) {
  try {
    if (!globalThis.localStorage) return '';
    return globalThis.localStorage.getItem(key)?.trim() || '';
  } catch {
    return '';
  }
}

function writeStoredTab(key: string, value: string) {
  try {
    if (!globalThis.localStorage) return;
    globalThis.localStorage.setItem(key, value);
  } catch {
    // Ignore storage write failures and keep the in-memory state usable.
  }
}

const activeTabStorageKey = scopeStatusStorageKey('zero_gate.status.vue.v7.active_tab');
const initialActiveTab = readStoredTab(activeTabStorageKey);
const activeTab = ref(tabs.some(tab => tab.id === initialActiveTab) ? initialActiveTab : 'character');

watch(activeTab, value => {
  writeStoredTab(activeTabStorageKey, value);
});

const activeTabTone = computed(() => tabs.find(tab => tab.id === activeTab.value)?.tone ?? 'green');
const sectionStorage = {
  plan: 'zero_gate.status.vue.v5.section.plan',
  enemy: 'zero_gate.status.vue.v5.section.enemy',
  crisis: 'zero_gate.status.vue.v5.section.crisis',
  team: 'zero_gate.status.vue.v5.section.team',
  npc: 'zero_gate.status.vue.v5.section.npc',
};

const {
  currentCp,
  relationEvent,
  bond,
  favor,
  relationViewpoint,
  overviewTitle,
  overviewMeta,
  planCards,
  characters,
  characterSummary,
  bagSummary,
  bagCategories,
  bagDetailGroups,
  sceneRows,
  routeNodes,
  routeCurrentNode,
  judgementRows,
  combatSummary,
  combatAllies,
  combatEnemies,
  crisisCards,
  relationCards,
  relationTeamCards,
  allyRelations,
  enemyRelations,
  npcCards,
  nsfwActive,
  nsfwPhase,
  nsfwProgress,
  nsfwActor,
  nsfwReceiver,
  nsfwStageNote,
  nsfwSummaryNote,
  nsfwActorRows,
  nsfwReceiverRows,
  nsfwActorMeters,
  nsfwReceiverMeters,
} = useStatusView();
</script>

<style scoped lang="scss">
.shell {
  width: 100%;
  margin: 0;
  padding: 0;
  display: grid;
  gap: var(--zg-space-3);
}

.toolbar {
  padding-bottom: var(--zg-space-3);
  --toolbar-accent: rgba(102, 136, 88, 0.42);

  &::after {
    content: "";
    display: block;
    height: 1px;
    margin-top: var(--zg-space-3);
    background: linear-gradient(90deg, transparent, var(--toolbar-accent) 16%, rgba(209, 180, 96, 0.3) 50%, transparent 84%);
  }
}

.toolbar.tone-gold {
  --toolbar-accent: rgba(200, 168, 74, 0.46);
}

.toolbar.tone-blue {
  --toolbar-accent: rgba(95, 141, 180, 0.42);
}

.toolbar.tone-red {
  --toolbar-accent: rgba(200, 96, 96, 0.46);
}

.toolbar.tone-rose {
  --toolbar-accent: rgba(207, 143, 175, 0.46);
}

.toolbar.tone-violet {
  --toolbar-accent: rgba(143, 121, 201, 0.46);
}

.content {
  padding-bottom: 2px;
  display: grid;
  gap: var(--zg-space-2);
}

@media (max-width: 720px) {
  .shell {
    gap: var(--zg-space-2);
  }

  .toolbar {
    padding-bottom: var(--zg-space-3);
  }

  .toolbar::after {
    margin-top: var(--zg-space-3);
  }
}
</style>
