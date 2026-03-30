<template>
  <section class="atlas-layout">
    <div class="atlas-stage">
      <div class="atlas-head">
        <div>
          <div class="atlas-kicker">KOREA TECH ATLAS</div>
          <h3>韩国地图</h3>
        </div>
        <p>点击城市或区域标记，查看名称与相关介绍。</p>
      </div>

      <div class="atlas-map-frame">
        <svg viewBox="80 60 520 430" class="atlas-svg" xmlns="http://www.w3.org/2000/svg" aria-label="韩国科技地图">
          <defs>
            <filter id="atlas-glow-soft" x="-30%" y="-30%" width="160%" height="160%">
              <feGaussianBlur in="SourceGraphic" stdDeviation="2.2" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          <g class="atlas-grid">
            <line x1="140" y1="193" x2="560" y2="193" />
            <line x1="140" y1="283" x2="560" y2="283" />
            <line x1="140" y1="373" x2="560" y2="373" />
            <line x1="305" y1="70" x2="305" y2="460" />
            <line x1="395" y1="70" x2="395" y2="460" />
            <line x1="485" y1="70" x2="485" y2="460" />
          </g>

          <g class="atlas-grid-labels">
            <text x="131" y="196">37°N</text>
            <text x="131" y="286">36°N</text>
            <text x="131" y="376">35°N</text>
            <text x="301" y="462">127°E</text>
            <text x="391" y="462">128°E</text>
            <text x="481" y="462">129°E</text>
          </g>

          <path
            class="atlas-body"
            d="M 242,103
               L 316,94  L 370,89  L 415,86  L 441,85
               L 451,86  L 451,113 L 477,128 L 495,160
               L 522,198 L 522,286 L 517,332 L 503,368
               L 484,368
               L 458,385 L 431,385 L 395,394
               L 368,402 L 332,412 L 307,402
               L 279,394 L 260,412 L 243,422
               L 234,432
               L 224,403 L 251,385 L 251,340
               L 279,305 L 279,286
               L 223,224 L 251,214 L 261,205
               L 289,196
               L 270,169 L 270,150 L 261,132
               L 242,103 Z"
          />

          <polygon
            class="gyeonggi-region"
            :class="{ active: selectedId === 'gyeonggi' }"
            points="242,103 316,94 370,89 415,86 431,100 440,128 428,158 402,172 360,182 323,180 305,172 289,157 270,150 261,132 242,103"
            @click="select('gyeonggi')"
          />

          <g class="atlas-boundaries">
            <polyline points="261,132 270,150 289,157 305,172 323,180 360,182 402,172 428,158 440,128 431,100 415,86" />
            <polyline points="440,128 470,168 490,190 480,220 451,215 428,158" />
            <polyline points="251,286 279,275 340,270 395,268 445,265 490,278 517,286" />
            <polyline points="279,305 340,298 395,295 450,300 490,310 517,332" />
            <polyline points="251,340 279,340 340,338 395,342 440,352 480,360 503,368" />
            <line x1="360" y1="182" x2="350" y2="268" />
          </g>

          <g class="atlas-region-names">
            <text x="467" y="160">강원도</text>
            <text x="312" y="250">충청남도</text>
            <text x="395" y="248">충청북도</text>
            <text x="273" y="350">전라도</text>
            <text x="460" y="300">경상도</text>
            <text x="291" y="458">제주도</text>
          </g>

          <g
            v-for="entry in atlasEntries"
            :key="entry.id"
            class="atlas-marker"
            :class="{ active: selectedId === entry.id }"
            @click="select(entry.id)"
          >
            <circle
              class="marker-ring"
              :cx="entry.x"
              :cy="entry.y"
              :r="entry.id === 'seoul' ? 18 : 15"
              :style="{
                stroke: withAlpha(entry.color, selectedId === entry.id ? 0.8 : 0.22),
                fill: withAlpha(entry.color, selectedId === entry.id ? 0.18 : 0.03),
              }"
            />
            <circle
              class="marker-core"
              :cx="entry.x"
              :cy="entry.y"
              r="8"
              :style="{
                fill: withAlpha(entry.color, selectedId === entry.id ? 0.94 : 0.42),
                stroke: withAlpha(entry.color, selectedId === entry.id ? 0.82 : 0.3),
              }"
              filter="url(#atlas-glow-soft)"
            />
            <text
              class="marker-symbol"
              :x="entry.x"
              :y="entry.y + 2.5"
              text-anchor="middle"
              :style="{ fill: withAlpha(entry.color, selectedId === entry.id ? 1 : 0.46) }"
            >
              {{ entry.symbol }}
            </text>
            <text
              class="marker-name"
              :x="entry.labelX ?? entry.x"
              :y="entry.labelY ?? entry.y + 18"
              text-anchor="middle"
              :style="{ fill: withAlpha(entry.color, selectedId === entry.id ? 0.98 : 0.52) }"
            >
              {{ entry.zh }}
            </text>
          </g>
        </svg>
      </div>

      <div class="atlas-legend">
        <button
          v-for="entry in atlasEntries"
          :key="entry.id"
          type="button"
          class="legend-chip"
          :class="{ active: selectedId === entry.id }"
          :style="{
            '--chip-accent': entry.color,
          }"
          @click="select(entry.id)"
        >
          <span class="legend-symbol">{{ entry.symbol }}</span>
          <span>{{ entry.zh }}</span>
        </button>
      </div>
    </div>

    <aside class="atlas-detail" :style="{ '--detail-accent': selectedEntry.color }">
      <div class="detail-badge">{{ selectedEntry.badge }}</div>
      <div class="detail-title">
        <span class="detail-symbol">{{ selectedEntry.symbol }}</span>
        <div>
          <h4>{{ selectedEntry.zh }}</h4>
          <div class="detail-sub">{{ selectedEntry.ko }} · {{ selectedEntry.en }}</div>
        </div>
      </div>

      <div class="detail-stats">
        <div class="detail-stat">
          <span>类型</span>
          <strong>{{ selectedEntry.type }}</strong>
        </div>
        <div class="detail-stat">
          <span>坐标</span>
          <strong>{{ selectedEntry.coord }}</strong>
        </div>
        <div class="detail-stat">
          <span>人口</span>
          <strong>{{ selectedEntry.pop }}</strong>
        </div>
        <div class="detail-stat">
          <span>面积</span>
          <strong>{{ selectedEntry.area }}</strong>
        </div>
      </div>

      <p class="detail-desc">{{ selectedEntry.desc }}</p>

      <div class="detail-tags">
        <span v-for="tag in selectedEntry.tags" :key="tag" class="detail-tag">
          {{ tag }}
        </span>
      </div>
    </aside>
  </section>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';

type AtlasEntry = {
  id: string;
  zh: string;
  ko: string;
  en: string;
  badge: string;
  type: string;
  color: string;
  symbol: string;
  pop: string;
  area: string;
  coord: string;
  desc: string;
  tags: string[];
  x: number;
  y: number;
  labelX?: number;
  labelY?: number;
};

const atlasEntries: AtlasEntry[] = [
  {
    id: 'seoul',
    zh: '首尔',
    ko: '서울특별시',
    en: 'Seoul',
    badge: 'CAPITAL',
    type: '首都特别市',
    color: '#d8bc6a',
    symbol: '★',
    pop: '约 970 万',
    area: '605 km²',
    coord: 'N37°34′ E126°58′',
    desc:
      '韩国首都与政治文化核心。汉江横贯城市，古宫殿群与现代高楼并存。如今在零始之门世界观里，这里已沦为高危地带，由曙龙以近似灰色秩序维持局部治安与利益网络。',
    tags: ['首都', '韩流中心', '金融核心', '高危区域', '曙龙势力'],
    x: 302,
    y: 142,
    labelY: 162,
  },
  {
    id: 'incheon',
    zh: '仁川',
    ko: '인천광역시',
    en: 'Incheon',
    badge: 'METRO',
    type: '广域市',
    color: '#72bfd4',
    symbol: '⬡',
    pop: '约 300 万',
    area: '1,063 km²',
    coord: 'N37°27′ E126°42′',
    desc:
      '西海岸重要门户，拥有国际机场与大型港口。现在也是陨石坠落点与首道“门”开启之地，周边被洪水与异常环境吞没，只剩永宗岛上的核心异变仍在影响局势。',
    tags: ['国际机场', '自由经济区', '港口', '首道门', '陨石坠落'],
    x: 278,
    y: 153,
    labelY: 171,
  },
  {
    id: 'gyeonggi',
    zh: '京畿道',
    ko: '경기도',
    en: 'Gyeonggi-do',
    badge: 'PROVINCE',
    type: '道（省级）',
    color: '#9e87c8',
    symbol: '◆',
    pop: '约 1,360 万',
    area: '10,192 km²',
    coord: 'N37°16′ E127°15′',
    desc:
      '昔日环抱首尔与仁川的核心省域，曾经汇集韩国最密集的人口与工业带。如今大量难民在此南迁求生，也滋生走私、流亡与临时结盟，是首都圈外最混乱的缓冲区之一。',
    tags: ['首都圈', '三星/LG/现代', '难民带', '工业走廊', '灰色缓冲区'],
    x: 349,
    y: 128,
    labelY: 146,
  },
  {
    id: 'sejong',
    zh: '世宗',
    ko: '세종특별자치시',
    en: 'Sejong',
    badge: 'ADMIN CAPITAL',
    type: '特别自治市',
    color: '#7cbe8c',
    symbol: '◎',
    pop: '约 39 万',
    area: '465 km²',
    coord: 'N36°29′ E127°17′',
    desc:
      '原本作为行政新首都规划建设，如今则是 710 联队的重要驻扎地。作为前线军政枢纽，这里承担着组织觉醒者部队、稳固南部防线与推进北上收复的重要作用。',
    tags: ['710 联队', '行政新城', '智慧城市', '前线驻地', '军政中枢'],
    x: 342,
    y: 242,
    labelY: 230,
  },
  {
    id: 'daejeon',
    zh: '大田',
    ko: '대전광역시',
    en: 'Daejeon',
    badge: 'SCIENCE HUB',
    type: '广域市',
    color: '#d79b5c',
    symbol: '●',
    pop: '约 148 万',
    area: '540 km²',
    coord: 'N36°21′ E127°23′',
    desc:
      '曾经的“科技之都”，大德研究特区、KAIST 与多所国家研究机构曾集中于此。现在特异现象管理厅、研究所和附属医院也设在这里，是官方研究异常现象与觉醒者的重要中心。',
    tags: ['科技之都', 'KAIST', '研究特区', '管理厅', '异常研究'],
    x: 348,
    y: 256,
    labelY: 274,
  },
  {
    id: 'busan',
    zh: '釜山',
    ko: '부산광역시',
    en: 'Busan',
    badge: 'CAPITAL NOW',
    type: '广域市',
    color: '#c57a76',
    symbol: '■',
    pop: '约 340 万',
    area: '770 km²',
    coord: 'N35°10′ E129°04′',
    desc:
      '昔日韩国第二大城市与海洋首都，如今成为大韩民国的新首都。这里秩序冷峻、准入严格，但也是少数能稳定保障生命安全的核心都市区之一。',
    tags: ['现首都', '海洋首都', '国际港口', '严格许可', '相对安全'],
    x: 491,
    y: 357,
    labelY: 376,
  },
  {
    id: 'yeosu',
    zh: '丽水',
    ko: '여수시',
    en: 'Yeosu',
    badge: 'CITY',
    type: '市',
    color: '#6fb4b2',
    symbol: '▲',
    pop: '约 28 万',
    area: '503 km²',
    coord: 'N34°45′ E127°39′',
    desc:
      '南海岸港湾城市，曾以夜景、海鲜与世博会闻名。六年前以刘率为核心逐步重建势力，如今已基本恢复到灾难前的秩序，是韩国南部最重要的稳定据点之一。',
    tags: ['南海港城', '刘率势力', '基本恢复', '旅游名城', '石化基地'],
    x: 363,
    y: 395,
    labelY: 413,
  },
  {
    id: 'geoje',
    zh: '巨济岛',
    ko: '거제도',
    en: 'Geoje Island',
    badge: 'ISLAND',
    type: '岛屿',
    color: '#b788b6',
    symbol: '⬟',
    pop: '约 25 万',
    area: '382 km²',
    coord: 'N34°52′ E128°37′',
    desc:
      '韩国第二大岛，曾以造船工业与海岛旅游闻名。岛屿与近海路线在当前世界观里具有战略撤离与海上转运价值，也因相对封闭而适合建立隐秘据点。',
    tags: ['第二大岛', '造船重镇', '海上节点', '封闭地形', '战略转运'],
    x: 449,
    y: 385,
    labelY: 404,
  },
];

const selectedId = ref('seoul');

const selectedEntry = computed(() => atlasEntries.find(entry => entry.id === selectedId.value) || atlasEntries[0]);

function select(id: string) {
  selectedId.value = id;
}

function withAlpha(hex: string, alpha: number) {
  const value = hex.replace('#', '');
  if (value.length !== 6) return hex;

  const red = Number.parseInt(value.slice(0, 2), 16);
  const green = Number.parseInt(value.slice(2, 4), 16);
  const blue = Number.parseInt(value.slice(4, 6), 16);

  return `rgba(${red}, ${green}, ${blue}, ${alpha})`;
}
</script>

<style scoped lang="scss">
.atlas-layout {
  display: grid;
  grid-template-columns: minmax(0, 1.35fr) minmax(16rem, 0.85fr);
  gap: var(--zg-space-3);
}

.atlas-stage,
.atlas-detail {
  border: 1px solid rgba(122, 128, 100, 0.28);
  border-radius: 4px;
  background:
    linear-gradient(180deg, rgba(255, 255, 255, 0.025), transparent 58%),
    rgba(7, 15, 12, 0.95);
}

.atlas-stage {
  padding: var(--zg-space-4);
  display: grid;
  gap: var(--zg-space-3);
}

.atlas-head {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: var(--zg-space-3);
}

.atlas-kicker,
.detail-badge,
.detail-sub,
.detail-stat span,
.detail-tag,
.legend-chip {
  font-family: "IBM Plex Mono", "Courier New", monospace;
}

.atlas-kicker {
  color: rgba(162, 201, 184, 0.62);
  font-size: var(--zg-fs-2xs);
  letter-spacing: 0.2em;
}

.atlas-head h3 {
  color: var(--zg-head);
  font-size: clamp(0.96rem, 0.92rem + 0.24vw, 1.16rem);
}

.atlas-head p {
  max-width: 17rem;
  color: var(--zg-muted);
  font-size: var(--zg-fs-xs);
  text-align: right;
}

.atlas-map-frame {
  position: relative;
  border: 1px solid rgba(103, 131, 118, 0.28);
  border-radius: 4px;
  overflow: hidden;
  background:
    linear-gradient(180deg, rgba(6, 18, 18, 0.96), rgba(4, 12, 10, 0.98));
  aspect-ratio: 16 / 11;
}

.atlas-map-frame::before {
  content: "";
  position: absolute;
  inset: 0;
  pointer-events: none;
  background-image:
    linear-gradient(rgba(118, 145, 133, 0.08) 1px, transparent 1px),
    linear-gradient(90deg, rgba(118, 145, 133, 0.08) 1px, transparent 1px);
  background-size: 34px 34px;
}

.atlas-svg {
  width: 100%;
  height: 100%;
  display: block;
}

.atlas-grid line {
  stroke: rgba(129, 157, 145, 0.12);
  stroke-width: 0.7;
}

.atlas-grid-labels text,
.atlas-region-names text {
  fill: rgba(150, 181, 167, 0.34);
  font-size: 8px;
  text-anchor: middle;
}

.atlas-body {
  fill: rgba(16, 47, 40, 0.52);
  stroke: rgba(117, 178, 154, 0.54);
  stroke-width: 1.3;
  stroke-linejoin: round;
  stroke-linecap: round;
}

.gyeonggi-region {
  fill: rgba(143, 123, 181, 0.08);
  stroke: rgba(174, 152, 206, 0.42);
  stroke-width: 1.1;
  stroke-dasharray: 6 4;
  cursor: pointer;
  transition: fill 0.18s ease, stroke 0.18s ease;
}

.gyeonggi-region.active,
.gyeonggi-region:hover {
  fill: rgba(143, 123, 181, 0.16);
  stroke: rgba(198, 177, 231, 0.58);
}

.atlas-boundaries polyline,
.atlas-boundaries line {
  fill: none;
  stroke: rgba(122, 161, 146, 0.32);
  stroke-width: 0.8;
  stroke-dasharray: 5 4;
}

.atlas-marker {
  cursor: pointer;
}

.marker-ring,
.marker-core,
.marker-symbol,
.marker-name {
  transition: opacity 0.18s ease, fill 0.18s ease, stroke 0.18s ease;
}

.atlas-marker:hover .marker-ring {
  opacity: 0.92;
}

.atlas-marker:hover .marker-core,
.atlas-marker:hover .marker-symbol,
.atlas-marker:hover .marker-name {
  opacity: 0.88;
}

.atlas-marker.active .marker-ring,
.atlas-marker.active .marker-core,
.atlas-marker.active .marker-symbol,
.atlas-marker.active .marker-name {
  opacity: 1;
}

.marker-symbol {
  font-size: 7px;
  font-weight: 700;
  pointer-events: none;
}

.marker-name {
  font-size: 9px;
  font-weight: 700;
  pointer-events: none;
}

.atlas-legend {
  display: flex;
  flex-wrap: wrap;
  gap: var(--zg-space-2);
}

.legend-chip {
  --chip-accent: rgba(180, 160, 110, 0.72);
  padding: 0.34rem 0.52rem;
  border-radius: 999px;
  border: 1px solid color-mix(in srgb, var(--chip-accent) 44%, transparent);
  background: color-mix(in srgb, var(--chip-accent) 10%, rgba(9, 16, 12, 0.92));
  color: color-mix(in srgb, var(--chip-accent) 82%, #e9e2cc);
  display: inline-flex;
  align-items: center;
  gap: 0.36rem;
  cursor: pointer;
  transition: transform 0.18s ease, border-color 0.18s ease, background 0.18s ease;
}

.legend-chip:hover,
.legend-chip.active {
  transform: translateY(-1px);
  border-color: color-mix(in srgb, var(--chip-accent) 70%, transparent);
}

.legend-symbol {
  font-size: 0.76rem;
}

.atlas-detail {
  --detail-accent: #d8bc6a;
  padding: var(--zg-space-4);
  display: grid;
  align-content: start;
  gap: var(--zg-space-3);
}

.detail-badge {
  width: fit-content;
  padding: 0.18rem 0.44rem;
  border-radius: 999px;
  border: 1px solid color-mix(in srgb, var(--detail-accent) 50%, transparent);
  color: color-mix(in srgb, var(--detail-accent) 86%, #f2ead2);
  background: color-mix(in srgb, var(--detail-accent) 8%, rgba(12, 20, 14, 0.94));
  font-size: var(--zg-fs-3xs);
  letter-spacing: 0.16em;
}

.detail-title {
  display: flex;
  gap: var(--zg-space-3);
  align-items: flex-start;
}

.detail-symbol {
  width: 2.1rem;
  height: 2.1rem;
  border-radius: 50%;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: color-mix(in srgb, var(--detail-accent) 90%, #ffffff);
  border: 1px solid color-mix(in srgb, var(--detail-accent) 52%, transparent);
  background: color-mix(in srgb, var(--detail-accent) 10%, rgba(10, 19, 15, 0.96));
  font-size: 1rem;
}

.detail-title h4 {
  color: var(--zg-head);
  font-size: clamp(1.06rem, 1rem + 0.18vw, 1.18rem);
  line-height: 1.1;
}

.detail-sub {
  margin-top: 0.2rem;
  color: var(--zg-muted);
  font-size: var(--zg-fs-xs);
}

.detail-stats {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: var(--zg-space-2);
}

.detail-stat {
  padding: var(--zg-space-3);
  border-radius: 4px;
  border: 1px solid rgba(122, 128, 100, 0.22);
  background: rgba(255, 255, 255, 0.025);
}

.detail-stat span {
  display: block;
  color: rgba(211, 201, 171, 0.62);
  font-size: var(--zg-fs-3xs);
  letter-spacing: 0.12em;
}

.detail-stat strong {
  display: block;
  margin-top: 0.16rem;
  color: color-mix(in srgb, var(--detail-accent) 70%, var(--zg-head));
  font-size: var(--zg-fs-sm);
  line-height: 1.45;
}

.detail-desc {
  color: var(--zg-soft);
  font-size: var(--zg-fs-sm);
  line-height: 1.72;
}

.detail-tags {
  display: flex;
  flex-wrap: wrap;
  gap: var(--zg-space-2);
}

.detail-tag {
  padding: 0.22rem 0.48rem;
  border-radius: 999px;
  border: 1px solid color-mix(in srgb, var(--detail-accent) 38%, transparent);
  color: color-mix(in srgb, var(--detail-accent) 76%, #ede3c6);
  background: color-mix(in srgb, var(--detail-accent) 9%, rgba(9, 16, 12, 0.92));
  font-size: var(--zg-fs-3xs);
  letter-spacing: 0.08em;
}

@media (max-width: 860px) {
  .atlas-layout {
    grid-template-columns: 1fr;
  }

  .atlas-head {
    align-items: flex-start;
    flex-direction: column;
  }

  .atlas-head p {
    max-width: none;
    text-align: left;
  }
}

@media (max-width: 560px) {
  .detail-stats {
    grid-template-columns: 1fr;
  }
}
</style>
