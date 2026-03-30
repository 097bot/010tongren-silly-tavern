<template>
  <section class="grid">
    <FoldSection
      :title="active ? '心动总览' : '亲密链路待机'"
      :eyebrow="active ? `阶段 ${phase}` : '待机骨架'"
      :meta="`${progress}/100`"
      tone="rose"
      :storage-key="'zero_gate.status.vue.v5.section.nsfw.summary'"
    >
      <p v-if="active && stageNote" class="desc">
        {{ stageNote }}
      </p>
      <div class="phase-summary">
        <span>当前阶段</span>
        <strong>{{ phase }}</strong>
      </div>
      <div class="meter">
        <div class="meta"><span>爱爱进度</span><span>{{ progress }} / 100</span></div>
        <div class="track"><span class="fill" :style="{ width: `${progress}%` }"></span></div>
      </div>
      <div v-if="summaryNote" class="summary-block">
        <span>总结骚话</span>
        <strong>{{ summaryNote }}</strong>
      </div>
    </FoldSection>

    <FoldSection
      :title="actor"
      eyebrow="主动侧"
      :meta="active ? '进行中' : '待机中'"
      tone="violet"
      :storage-key="'zero_gate.status.vue.v5.section.nsfw.actor'"
    >
      <div v-if="actorMeters.length" class="meters">
        <div v-for="item in actorMeters" :key="item.label" class="meter meter-block">
          <div class="meta"><span>{{ item.label }}</span><span>{{ item.text }}</span></div>
          <div class="track"><span class="fill" :class="item.tone" :style="{ width: `${item.value}%` }"></span></div>
        </div>
      </div>
      <div class="rows">
        <div v-for="row in actorRows" :key="`actor-${row.label}`" class="row">
          <span>{{ row.label }}</span>
          <strong>{{ row.value }}</strong>
        </div>
      </div>
    </FoldSection>

    <FoldSection
      :title="receiver"
      eyebrow="承受侧"
      :meta="active ? '进行中' : '待机中'"
      tone="rose"
      :storage-key="'zero_gate.status.vue.v5.section.nsfw.receiver'"
    >
      <div v-if="receiverMeters.length" class="meters">
        <div v-for="item in receiverMeters" :key="item.label" class="meter meter-block">
          <div class="meta"><span>{{ item.label }}</span><span>{{ item.text }}</span></div>
          <div class="track"><span class="fill" :class="item.tone" :style="{ width: `${item.value}%` }"></span></div>
        </div>
      </div>
      <div class="rows">
        <div v-for="row in receiverRows" :key="`receiver-${row.label}`" class="row">
          <span>{{ row.label }}</span>
          <strong>{{ row.value }}</strong>
        </div>
      </div>
    </FoldSection>
  </section>
</template>

<script setup lang="ts">
import FoldSection from './FoldSection.vue';

defineProps<{
  active: boolean;
  phase: string;
  progress: number;
  stageNote: string;
  summaryNote?: string;
  actor: string;
  receiver: string;
  actorRows: { label: string; value: string }[];
  receiverRows: { label: string; value: string }[];
  actorMeters: { label: string; text: string; value: number; tone: string }[];
  receiverMeters: { label: string; text: string; value: number; tone: string }[];
}>();
</script>

<style scoped lang="scss">
.grid {
  display: grid;
  gap: var(--zg-space-2);
}

.row span,
.meta {
  font-family: "IBM Plex Mono", "Courier New", monospace;
}

.desc {
  color: var(--zg-soft);
  font-size: var(--zg-fs-sm);
  line-height: 1.58;
}

.summary-block {
  margin-top: var(--zg-space-3);
  display: grid;
  gap: var(--zg-space-1);

  span,
  strong {
    font-family: "IBM Plex Mono", "Courier New", monospace;
  }

  span {
    font-size: var(--zg-fs-2xs);
    color: var(--zg-muted);
    letter-spacing: 0.12em;
  }

  strong {
    color: rgba(240, 216, 232, 0.92);
    font-size: var(--zg-fs-sm);
    line-height: 1.56;
    font-weight: 600;
  }
}

.meters,
.rows {
  display: grid;
  gap: var(--zg-space-2);
  margin-top: var(--zg-space-3);
}

.meter {
  margin-top: var(--zg-space-3);
}

.meter-block {
  margin-top: 0;
}

.phase-summary {
  margin-top: var(--zg-space-3);
  display: inline-flex;
  align-items: baseline;
  gap: var(--zg-space-3);
  flex-wrap: wrap;

  span,
  strong {
    font-family: "IBM Plex Mono", "Courier New", monospace;
  }

  span {
    font-size: var(--zg-fs-2xs);
    color: var(--zg-muted);
    letter-spacing: 0.12em;
  }

  strong {
    font-size: var(--zg-fs-lg);
    color: var(--zg-text);
  }
}

.meta {
  display: flex;
  justify-content: space-between;
  gap: var(--zg-space-2);
  margin-bottom: var(--zg-space-1);
  font-size: var(--zg-fs-2xs);
  color: var(--zg-muted);
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
  background: linear-gradient(90deg, var(--zg-violet), var(--zg-pink), #f0d8e8);

  &.violet {
    background: linear-gradient(90deg, #8371ca, var(--zg-violet));
  }

  &.pink {
    background: linear-gradient(90deg, #d283b9, var(--zg-pink));
  }

  &.rose {
    background: linear-gradient(90deg, #e0889d, #ffb8c8);
  }

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
</style>
