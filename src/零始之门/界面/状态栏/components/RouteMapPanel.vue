<template>
  <section v-if="nodes.length" class="map-shell">
    <FoldSection
      title="地图"
      eyebrow="横向路线链"
      :meta="`${nodes.length} 点`"
      tone="gold"
      :storage-key="'zero_gate.status.vue.v6.section.map.route'"
    >
      <div class="route-layout">
        <div v-if="focusNode" class="focus-panel" :class="`tone-${focusNode.tone}`">
          <div class="focus-kicker">ROUTE FOCUS</div>
          <div class="focus-main">
            <span class="focus-icon">{{ focusNode.icon }}</span>
            <div class="focus-copy">
              <h3>{{ focusNode.title }}</h3>
              <div class="focus-type">{{ focusNode.typeLabel }}</div>
            </div>
          </div>
          <p class="focus-note">{{ focusNode.note }}</p>
        </div>

        <div class="rail-shell">
          <div class="rail-mask left"></div>
          <div class="rail-mask right"></div>

          <div ref="scrollEl" class="rail-scroll">
            <div class="rail-chain">
              <template v-for="(node, index) in nodes" :key="node.id">
                <button
                  :ref="setNodeRef(node.id)"
                  type="button"
                  class="route-node"
                  :class="[
                    `tone-${node.tone}`,
                    { current: node.isCurrent, selected: node.id === focusNode?.id },
                  ]"
                  @click="focusNodeId = node.id"
                >
                  <span class="node-core">
                    <span class="node-icon">{{ node.icon }}</span>
                  </span>
                  <span class="node-name">{{ node.title }}</span>
                  <span class="node-type">{{ node.typeLabel }}</span>
                  <span v-if="node.isCurrent" class="node-note">{{ node.note }}</span>
                </button>

                <span
                  v-if="index < nodes.length - 1"
                  class="route-link"
                  :class="`tone-${linkTone(nodes[index], nodes[index + 1])}`"
                ></span>
              </template>
            </div>
          </div>
        </div>
      </div>
    </FoldSection>
  </section>

  <div v-else class="empty">当前还没有可显示的地图路线。</div>
</template>

<script setup lang="ts">
import { computed, nextTick, ref, watch } from 'vue';
import FoldSection from './FoldSection.vue';

type RouteNode = {
  id: string;
  title: string;
  icon: string;
  tone: 'past' | 'normal' | 'current' | 'goal' | 'danger';
  typeLabel: string;
  note: string;
  summary: string;
  isCurrent: boolean;
};

const props = defineProps<{
  nodes: RouteNode[];
  currentNode: RouteNode | null;
}>();

const focusNodeId = ref('');
const scrollEl = ref<HTMLElement | null>(null);
const nodeRefs = new Map<string, HTMLElement>();

const focusNode = computed(() => {
  const picked = props.nodes.find(node => node.id === focusNodeId.value);
  return picked || props.currentNode || props.nodes[0] || null;
});

function setNodeRef(id: string) {
  return (element: Element | null) => {
    if (element instanceof HTMLElement) {
      nodeRefs.set(id, element);
      return;
    }

    nodeRefs.delete(id);
  };
}

function syncFocusNode() {
  focusNodeId.value = props.currentNode?.id || props.nodes[0]?.id || '';
}

function centerCurrentNode(behavior: ScrollBehavior = 'auto') {
  const scroller = scrollEl.value;
  const targetId = props.currentNode?.id || focusNode.value?.id;
  const target = targetId ? nodeRefs.get(targetId) : null;
  if (!scroller || !target) return;

  const targetCenter = target.offsetLeft + target.offsetWidth / 2;
  const left = targetCenter - scroller.clientWidth / 2;
  const maxLeft = Math.max(0, scroller.scrollWidth - scroller.clientWidth);

  scroller.scrollTo({
    left: Math.max(0, Math.min(left, maxLeft)),
    behavior,
  });
}

function linkTone(left: RouteNode, right: RouteNode) {
  if (left.tone === 'danger' || right.tone === 'danger') return 'danger';
  if (left.tone === 'current' || right.tone === 'current') return 'current';
  if (left.tone === 'goal' || right.tone === 'goal') return 'goal';
  if (left.tone === 'past' && right.tone === 'past') return 'past';
  return 'normal';
}

watch(
  () => props.nodes,
  () => {
    syncFocusNode();
    nextTick(() => centerCurrentNode());
  },
  { immediate: true, deep: true },
);

watch(
  () => props.currentNode?.id,
  () => {
    nextTick(() => centerCurrentNode('smooth'));
  },
);
</script>

<style scoped lang="scss">
.map-shell {
  display: grid;
  gap: var(--zg-space-2);
}

.route-layout {
  display: grid;
  gap: var(--zg-space-3);
}

.focus-panel {
  --focus-accent: rgba(120, 150, 104, 0.46);
  padding: var(--zg-space-4);
  border: 1px solid rgba(132, 122, 86, 0.38);
  border-radius: 4px;
  background:
    linear-gradient(180deg, rgba(255, 255, 255, 0.03), transparent 56%),
    rgba(8, 15, 10, 0.9);
  box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.015);

  &.tone-past {
    --focus-accent: rgba(116, 112, 100, 0.34);
  }

  &.tone-normal {
    --focus-accent: rgba(112, 132, 97, 0.42);
  }

  &.tone-goal {
    --focus-accent: rgba(94, 149, 91, 0.5);
  }

  &.tone-current,
  &.tone-danger {
    --focus-accent: rgba(191, 150, 86, 0.54);
  }
}

.focus-kicker,
.focus-type,
.node-type {
  font-family: "IBM Plex Mono", "Courier New", monospace;
}

.focus-kicker {
  margin-bottom: var(--zg-space-2);
  color: rgba(211, 198, 161, 0.72);
  font-size: var(--zg-fs-2xs);
  letter-spacing: 0.18em;
}

.focus-main {
  display: flex;
  align-items: center;
  gap: var(--zg-space-3);
}

.focus-icon {
  width: 42px;
  height: 42px;
  flex: 0 0 auto;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  border: 1px solid rgba(176, 160, 111, 0.44);
  background:
    radial-gradient(circle at 30% 30%, rgba(255, 255, 255, 0.08), transparent 60%),
    rgba(16, 23, 15, 0.94);
  color: var(--zg-head);
  font-size: 1rem;
  box-shadow: 0 0 0 1px rgba(255, 255, 255, 0.02), inset 0 0 18px rgba(0, 0, 0, 0.24);
}

.focus-copy h3 {
  color: var(--zg-head);
  font-size: clamp(0.92rem, 0.88rem + 0.2vw, 1.08rem);
  line-height: 1.1;
  font-weight: 700;
}

.focus-type {
  margin-top: 0.18rem;
  color: rgba(215, 202, 167, 0.78);
  font-size: var(--zg-fs-2xs);
  letter-spacing: 0.12em;
}

.focus-note {
  margin-top: var(--zg-space-3);
  color: var(--zg-soft);
  font-size: var(--zg-fs-sm);
  line-height: 1.6;
  padding-top: var(--zg-space-2);
  border-top: 1px solid rgba(138, 122, 80, 0.18);
}

.rail-shell {
  position: relative;
}

.rail-mask {
  position: absolute;
  top: 0;
  bottom: 14px;
  width: clamp(1rem, 2vw, 1.6rem);
  z-index: 2;
  pointer-events: none;
}

.rail-mask.left {
  left: 0;
  background: linear-gradient(90deg, rgba(8, 15, 10, 0.98), rgba(8, 15, 10, 0));
}

.rail-mask.right {
  right: 0;
  background: linear-gradient(270deg, rgba(8, 15, 10, 0.98), rgba(8, 15, 10, 0));
}

.rail-scroll {
  overflow-x: auto;
  overflow-y: hidden;
  padding: var(--zg-space-2) 0 var(--zg-space-3);
  scrollbar-width: thin;
  scrollbar-color: rgba(198, 173, 109, 0.9) rgba(18, 28, 18, 0.95);

  &::-webkit-scrollbar {
    height: 12px;
  }

  &::-webkit-scrollbar-track {
    background:
      linear-gradient(180deg, rgba(28, 42, 28, 0.96), rgba(14, 22, 14, 0.96));
    border: 1px solid rgba(98, 116, 84, 0.34);
    border-radius: 999px;
    box-shadow: inset 0 1px 4px rgba(0, 0, 0, 0.4);
  }

  &::-webkit-scrollbar-thumb {
    border-radius: 999px;
    border: 1px solid rgba(125, 103, 54, 0.82);
    background:
      linear-gradient(180deg, rgba(211, 191, 128, 0.96), rgba(154, 128, 71, 0.96));
    box-shadow:
      inset 0 1px 1px rgba(255, 248, 226, 0.18),
      inset 0 -2px 3px rgba(74, 58, 26, 0.28),
      0 0 8px rgba(125, 103, 54, 0.12);
  }

  &::-webkit-scrollbar-thumb:hover {
    background:
      linear-gradient(180deg, rgba(225, 206, 142, 0.98), rgba(173, 145, 82, 0.98));
  }

  &::-webkit-scrollbar-thumb:active {
    background:
      linear-gradient(180deg, rgba(189, 169, 108, 0.98), rgba(141, 116, 64, 0.98));
  }
}

.rail-chain {
  display: inline-flex;
  align-items: center;
  min-width: 100%;
  gap: var(--zg-space-2);
  padding: 0 var(--zg-space-3);
}

.route-link {
  flex: 0 0 clamp(2.8rem, 8vw, 4.4rem);
  height: 2px;
  border-radius: 999px;
  background: linear-gradient(90deg, rgba(122, 134, 116, 0.2), rgba(178, 164, 120, 0.56), rgba(122, 134, 116, 0.2));
  box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.04);

  &.tone-past {
    opacity: 0.34;
  }

  &.tone-normal {
    opacity: 0.78;
  }

  &.tone-goal {
    background: linear-gradient(90deg, rgba(93, 118, 81, 0.3), rgba(130, 171, 111, 0.72), rgba(93, 118, 81, 0.3));
  }

  &.tone-current,
  &.tone-danger {
    background: linear-gradient(90deg, rgba(122, 102, 72, 0.3), rgba(196, 160, 95, 0.8), rgba(122, 102, 72, 0.3));
  }
}

.route-node {
  --node-accent: rgba(116, 132, 108, 0.56);
  flex: 0 0 auto;
  min-width: 104px;
  max-width: 124px;
  padding: var(--zg-space-3);
  border: 1px solid rgba(124, 134, 117, 0.26);
  border-radius: 6px;
  background:
    linear-gradient(180deg, rgba(255, 255, 255, 0.025), transparent 64%),
    rgba(11, 18, 12, 0.94);
  color: var(--zg-text);
  display: grid;
  gap: var(--zg-space-1);
  justify-items: center;
  text-align: center;
  cursor: pointer;
  transition: transform 0.18s ease, border-color 0.18s ease, background 0.18s ease, opacity 0.18s ease;

  &:hover {
    transform: translateY(-1px);
    border-color: rgba(180, 169, 124, 0.38);
  }

  &.selected {
    border-color: rgba(214, 192, 135, 0.5);
    box-shadow: 0 0 0 1px rgba(214, 192, 135, 0.08);
  }

  &.current {
    min-width: 156px;
    max-width: 182px;
    transform: scale(1.04);
    border-color: rgba(196, 160, 95, 0.5);
    background:
      linear-gradient(180deg, rgba(255, 255, 255, 0.045), transparent 60%),
      rgba(15, 19, 13, 0.98);
  }

  &.tone-past {
    opacity: 0.58;
    --node-accent: rgba(105, 103, 95, 0.42);
  }

  &.tone-normal {
    --node-accent: rgba(116, 132, 108, 0.56);
  }

  &.tone-goal {
    --node-accent: rgba(112, 160, 96, 0.68);
  }

  &.tone-current,
  &.tone-danger {
    --node-accent: rgba(188, 151, 90, 0.72);
  }
}

.node-core {
  width: 36px;
  height: 36px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  border: 1px solid rgba(163, 149, 108, 0.3);
  background:
    radial-gradient(circle at 34% 30%, rgba(255, 255, 255, 0.08), transparent 60%),
    rgba(15, 22, 15, 0.92);
  box-shadow:
    0 0 0 1px rgba(255, 255, 255, 0.02),
    inset 0 0 14px rgba(0, 0, 0, 0.26),
    0 0 14px var(--node-accent);
}

.current .node-core {
  width: 48px;
  height: 48px;
}

.node-icon {
  font-size: 0.95rem;
}

.node-name {
  color: var(--zg-head);
  font-size: var(--zg-fs-sm);
  font-weight: 700;
  line-height: 1.15;
}

.current .node-name {
  font-size: clamp(0.84rem, 0.8rem + 0.2vw, 0.98rem);
}

.node-type {
  color: rgba(212, 201, 172, 0.72);
  font-size: var(--zg-fs-3xs);
  letter-spacing: 0.12em;
}

.node-note {
  color: var(--zg-soft);
  font-size: var(--zg-fs-2xs);
  line-height: 1.45;
}

.empty {
  padding: var(--zg-space-4);
  border-radius: 4px;
  border: 1px dashed rgba(138, 122, 80, 0.28);
  color: var(--zg-muted);
}

@media (max-width: 720px) {
  .rail-chain {
    padding: 0 var(--zg-space-2);
  }

  .route-node {
    min-width: 96px;
  }

  .route-node.current {
    min-width: 136px;
  }
}
</style>
