<template>
  <section class="overview" :class="[tone]">
    <div class="overview-head">
      <span class="overview-left">
        <span class="overview-icon">▣</span>
        <span class="overview-copy">
          <span class="title">{{ title }}</span>
          <span class="meta">{{ meta }}</span>
        </span>
      </span>

      <span class="overview-glow"></span>
    </div>
  </section>
</template>

<script setup lang="ts">
defineProps<{
  title: string;
  meta: string;
  tone?: string;
}>();
</script>

<style scoped lang="scss">
.overview {
  --overview-accent: rgba(102, 136, 88, 0.8);
  position: relative;
  width: 100%;
  overflow: hidden;
  border-radius: 3px;
  border: 1px solid rgba(138, 122, 80, 0.38);
  background:
    radial-gradient(circle at top right, rgba(255, 255, 255, 0.06), transparent 26%),
    rgba(8, 14, 8, 0.92);
  box-shadow: none;
  transition: border-color 0.22s ease, background 0.22s ease;

  &::before {
    content: "";
    position: absolute;
    left: 0;
    top: 0;
    bottom: 0;
    width: 2px;
    background: linear-gradient(180deg, transparent, var(--overview-accent), transparent);
    opacity: 0.8;
    pointer-events: none;
    z-index: 1;
  }

  &::after {
    content: "";
    position: absolute;
    inset: 0;
    pointer-events: none;
    background:
      linear-gradient(90deg, rgba(255, 255, 255, 0.012) 1px, transparent 1px),
      linear-gradient(rgba(255, 255, 255, 0.012) 1px, transparent 1px);
    background-size: 18px 18px;
    opacity: 0.12;
    z-index: 0;
  }

  &.gold {
    --overview-accent: rgba(200, 168, 74, 0.8);
  }

  &.blue {
    --overview-accent: rgba(95, 141, 180, 0.82);
  }

  &.red {
    --overview-accent: rgba(200, 96, 96, 0.84);
  }

  &.rose {
    --overview-accent: rgba(207, 143, 175, 0.82);
  }

  &.violet {
    --overview-accent: rgba(143, 121, 201, 0.82);
  }
}

.overview-head {
  position: relative;
  z-index: 2;
  width: 100%;
  text-align: left;
  display: flex;
  gap: var(--zg-space-2);
  align-items: center;
  padding: var(--zg-space-4) var(--zg-space-5);
  background: rgba(74, 103, 65, 0.1);
  overflow: hidden;
  transition: background 0.2s ease;

  &:hover {
    background: rgba(74, 103, 65, 0.16);
  }
}

.overview-left {
  display: inline-flex;
  align-items: center;
  gap: var(--zg-space-3);
  min-width: 0;
  position: relative;
  z-index: 2;
  width: 100%;
}

.meta,
.title {
  font-family: "IBM Plex Mono", "Courier New", monospace;
}

.overview-icon {
  width: 22px;
  height: 22px;
  flex: 0 0 auto;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border: 1px solid rgba(138, 122, 80, 0.28);
  border-radius: 2px;
  background: rgba(138, 122, 80, 0.06);
  color: #c8a84a;
  font-size: var(--zg-fs-sm);
  box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.01);
}

.overview-copy {
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 1px;
}

.title {
  color: var(--zg-head);
  font-size: var(--zg-fs-sm);
  font-weight: 700;
  letter-spacing: 0.14em;
  line-height: 1.16;
  white-space: normal;
}

.meta {
  color: rgba(221, 214, 196, 0.76);
  font-size: var(--zg-fs-sm);
  line-height: 1.42;
  white-space: normal;
}

.overview-glow {
  position: absolute;
  inset: 0;
  background: linear-gradient(
    90deg,
    transparent 0%,
    rgba(160, 180, 190, 0) 28%,
    rgba(160, 180, 190, 0.03) 50%,
    rgba(160, 180, 190, 0) 72%,
    transparent 100%
  );
  pointer-events: none;
  z-index: 1;
}

@media (max-width: 720px) {
  .overview-head {
    gap: var(--zg-space-2);
    padding: var(--zg-space-3);
  }

  .overview-left {
    width: 100%;
    gap: var(--zg-space-2);
  }

  .meta {
    white-space: normal;
  }

  .title {
    letter-spacing: 0.14em;
  }
}

@media (max-width: 480px) {
  .title {
    font-size: var(--zg-fs-xs);
  }

  .meta {
    font-size: var(--zg-fs-xs);
    line-height: 1.45;
  }
}
</style>
