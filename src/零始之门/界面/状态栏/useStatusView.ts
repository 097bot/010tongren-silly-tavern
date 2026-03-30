import { computed } from 'vue';
import { useStatusDataStore } from './store';

type Row = { label: string; value: string };
type MeterInfo = { label: string; value: number; text: string; tone: string };
type StatusCard = { title: string; eyebrow: string; tone?: string; meters: MeterInfo[]; rows: Row[] };
type InventorySlotTone = 'weapon' | 'medical' | 'ration' | 'artifact' | 'intel';
type InventorySlot = { id: string; title: string; tone: InventorySlotTone; summary: string; meta?: string };
type InventoryCategory = {
  key: InventorySlotTone;
  title: string;
  tone: 'blue' | 'red' | 'green' | 'violet' | 'gold';
  eyebrow: string;
  slots: InventorySlot[];
};
type InventoryDetailGroup = {
  key: string;
  title: string;
  tone: 'blue' | 'gold';
  eyebrow: string;
  description: string;
  items: StatusCard[];
};
type FactionBar = {
  name: string;
  value: number;
  text: string;
  percent: number;
  tone: 'green' | 'red';
};
type RouteNodeTone = 'past' | 'normal' | 'current' | 'goal' | 'danger';
type RouteNode = {
  id: string;
  title: string;
  icon: string;
  tone: RouteNodeTone;
  typeLabel: string;
  note: string;
  summary: string;
  isCurrent: boolean;
};

const QUIET_TEXTS = new Set([
  '',
  '未同步',
  '无变化',
  '待命',
  '待机',
  '暂无推进',
  '暂无关系推进',
  '剧情待同步',
  '场景等待同步。',
  '等待同步',
  '时间待同步',
]);

const MAP_TYPE_LABELS: Record<string, string> = {
  past: '已走区域',
  normal: '常规节点',
  current: '当前位置',
  goal: '目标节点',
  danger: '危险区域',
};

function plain(value: unknown) {
  return _.isPlainObject(value) ? (value as Record<string, any>) : {};
}

function asEntries(value: unknown) {
  return Object.entries(plain(value));
}

function display(value: unknown, fallback = '未同步') {
  if (value === null || value === undefined) return fallback;
  if (typeof value === 'string') return value.trim() || fallback;
  if (typeof value === 'number' || typeof value === 'boolean') return String(value);
  if (Array.isArray(value)) return value.length ? value.map(item => display(item, '')).filter(Boolean).join(' / ') : fallback;
  if (_.isPlainObject(value)) {
    return Object.entries(value as Record<string, any>)
      .slice(0, 3)
      .map(([key, item]) => `${key} ${display(item, '')}`.trim())
      .filter(Boolean)
      .join(' · ') || fallback;
  }
  return String(value);
}

function normalizeText(value: string) {
  return value.replace(/\s+/g, ' ').trim();
}

function isMeaningfulText(value: string) {
  const text = normalizeText(value);
  return text !== '' && !QUIET_TEXTS.has(text);
}

function displayQuiet(value: unknown, quietValues: string[] = ['无', '未知', '未记录']) {
  const text = normalizeText(display(value, ''));
  if (!text) return '';

  const quiet = quietValues.map(item => normalizeText(item));
  return quiet.includes(text) ? '' : text;
}

function uniqueTextParts(parts: unknown[], fallback = '') {
  const seen = new Set<string>();
  const result: string[] = [];

  parts.forEach(part => {
    const text = normalizeText(typeof part === 'string' ? part : display(part, ''));
    if (!isMeaningfulText(text)) return;

    const key = text.toLowerCase();
    if (seen.has(key)) return;

    seen.add(key);
    result.push(text);
  });

  return result.join(' · ') || fallback;
}

function compactRows(rows: Row[]) {
  const seen = new Set<string>();

  return rows
    .map(row => ({ ...row, value: normalizeText(row.value) }))
    .filter(row => {
      if (!row.label || !isMeaningfulText(row.value)) return false;

      const key = `${row.label}:${row.value.toLowerCase()}`;
      if (seen.has(key)) return false;

      seen.add(key);
      return true;
    });
}

function clamp(value: unknown, min: number, max: number) {
  const num = Number(value);
  if (!Number.isFinite(num)) return min;
  return Math.max(min, Math.min(max, num));
}

function hasContent(value: unknown) {
  return display(value, '') !== '';
}

function rowValue(rows: Row[], label: string, fallback = '') {
  return rows.find(item => item.label === label)?.value || fallback;
}

function meter(label: string, value: unknown, tone: string, max = 100) {
  const current = clamp(value, 0, max);
  return {
    label,
    value: current,
    text: `${Math.round(current)} / ${max}`,
    tone,
  };
}

function ratioMeter(label: string, current: unknown, total: unknown, tone: string) {
  const max = Number(total);
  if (!Number.isFinite(max) || max <= 0) return null;

  const now = clamp(current, 0, max);
  return {
    label,
    value: Math.round((now / max) * 100),
    text: `${Math.round(now)} / ${Math.round(max)}`,
    tone,
  };
}

function buildFactionBar(name: string, value: unknown, tone: 'green' | 'red') {
  const raw = Number(value);
  if (!Number.isFinite(raw)) return null;

  const rounded = Math.trunc(raw);
  return {
    name,
    value: rounded,
    text: `${rounded > 0 ? '+' : ''}${rounded}`,
    percent: clamp(Math.abs(rounded), 0, 100),
    tone,
  };
}

function hpMeta(source: unknown) {
  const hpData = plain(source);
  const current = Number(hpData['当前']);
  const max = Number(hpData['最大']);
  if (!Number.isFinite(current) || !Number.isFinite(max) || max <= 0) return null;

  return {
    text: `${Math.max(0, Math.trunc(current))} / ${Math.max(0, Math.trunc(max))}`,
    meter: ratioMeter('HP', current, max, 'red'),
  };
}

function planPriorityRank(value: unknown) {
  const order: Record<string, number> = {
    紧急: 0,
    高: 1,
    中: 2,
    低: 3,
  };

  return order[display(value, '')] ?? 9;
}

function planStatusRank(value: unknown) {
  const order: Record<string, number> = {
    进行中: 0,
    待完成: 1,
    搁置: 2,
    已完成: 3,
    失败: 4,
  };

  return order[display(value, '')] ?? 9;
}

function stageSummary(source: unknown) {
  const item = plain(source);
  const stage = displayQuiet(item['阶段']);
  const stageData = plain(item['阶段数据']);
  const current = Number(stageData['当前']);
  const total = Number(stageData['总']);
  const numericStage =
    Number.isFinite(current) && Number.isFinite(total) && current > 0 && total > 0 ? `${Math.trunc(current)} / ${Math.trunc(total)}` : '';

  return uniqueTextParts([stage, numericStage]);
}

function countdownSummary(source: unknown) {
  const item = plain(source);
  const countdown = displayQuiet(item['倒计时']);
  const amount = Number(item['倒计时数']);
  const unit = displayQuiet(item['倒计时单位'], ['无']);
  const numericCountdown = Number.isFinite(amount) && amount > 0 ? `${Math.trunc(amount)}${unit || ''}` : '';

  return uniqueTextParts([countdown, numericCountdown]);
}

function mapTypeLabel(value: unknown) {
  const type = display(value, 'normal');
  return MAP_TYPE_LABELS[type] || type;
}

function mapTypeTone(value: unknown): RouteNodeTone {
  const type = display(value, 'normal');
  if (type === 'past') return 'past';
  if (type === 'current') return 'current';
  if (type === 'goal') return 'goal';
  if (type === 'danger') return 'danger';
  return 'normal';
}

function mapTypeRank(value: unknown) {
  const type = display(value, 'normal');
  const order: Record<string, number> = {
    past: 0,
    normal: 1,
    current: 2,
    goal: 3,
    danger: 4,
  };

  return order[type] ?? 9;
}

function buildCharacterCard(title: string, source: unknown, tone = '') {
  const info = plain(source);
  const name = display(info['姓名'], '');
  if (!name && !['神态', '动作', '希望', '内心', '备注'].some(key => hasContent(info[key]))) {
    return null;
  }

  const attire = [info['衣着_上'], info['衣着_下'], info['衣着_内']]
    .map(item => display(item, ''))
    .filter(Boolean)
    .join(' / ');

  return {
    title: name || title,
    eyebrow: attire || '',
    tone,
    meters: [
      { ...meter('体力', info['体力'], 'blue'), text: `${clamp(info['体力'], 0, 100)} / 100` },
      { ...meter('精神稳定', info['精神稳定'], 'green'), text: `${clamp(info['精神稳定'], 0, 100)} / 100` },
      { ...meter('污染值', info['污染值'], 'red'), text: `${clamp(info['污染值'], 0, 100)} / 100` },
    ],
    rows: compactRows([
      { label: '神态', value: displayQuiet(info['神态']) },
      { label: '动作', value: displayQuiet(info['动作']) },
      { label: '伤势', value: display(info['伤势'], '') },
      { label: '希望', value: displayQuiet(info['希望']) },
      { label: '内心', value: displayQuiet(info['内心']) },
      { label: '备注', value: displayQuiet(info['备注']) },
    ]),
  };
}

function stageNote(stage: string) {
  const notes: Record<string, string> = {
    张力: '气氛刚刚发烫，重点在视线、呼吸和欲望前奏。',
    探索: '互动进入试探区，亲密感和身体反应都在靠近。',
    升温: '接触频率和情绪强度都在上升，适合写得更黏稠。',
    临界前: '已经贴近边缘，压迫感和失控感最容易成立。',
    释放: '进入爆发区，节奏和结算要顺着剧情落下去。',
    余韵: '重点转向安抚、占有余温和关系回落。',
  };
  return notes[stage] || '';
}

export function useStatusView() {
  const store = useStatusDataStore();

  const data = computed(() => plain(store.data));
  const info = computed(() => plain(data.value['世界信息']));
  const judgement = computed(() => plain(data.value['判定状态']));
  const common = computed(() => plain(data.value['通用状态栏']));
  const combat = computed(() => plain(data.value['战斗面板']));
  const bag = computed(() => plain(data.value['背包栏']));
  const crisis = computed(() => plain(data.value['危机面板']));
  const npc = computed(() => plain(data.value['NPC档案']));
  const monster = computed(() => plain(data.value['怪物档案']));
  const relation = computed(() => plain(data.value['关系面板']));
  const nsfw = computed(() => plain(data.value['NSFW状态栏']));
  const plans = computed(() => plain(data.value['计划列表']));

  const currentCp = computed(() => display(relation.value['当前主CP'], display(plain(common.value['角色B'])['姓名'], '未同步')));
  const relationViewpoint = computed(() => displayQuiet(relation.value['视角角色']));
  const relationEvent = computed(() => displayQuiet(relation.value['当前关系事件'], ['无']));
  const bond = computed(() => displayQuiet(relation.value['羁绊'], ['无']));
  const favor = computed(() => _.clamp(Number(relation.value['好感'] || 0), -100, 100));
  const sceneTitle = computed(() => display(info.value['场所'], '未知区域'));

  const overviewTitle = computed(() => sceneTitle.value);
  const overviewMeta = computed(() =>
    uniqueTextParts(
      [
        display(info.value['时间'], ''),
        display(info.value['第几天'], '') ? `第${display(info.value['第几天'], '')}天` : '',
      ],
      '时间待同步',
    ),
  );

  const planCards = computed(() =>
    asEntries(plans.value)
      .sort(([, left], [, right]) => {
        const leftItem = plain(left);
        const rightItem = plain(right);
        const statusGap = planStatusRank(leftItem['状态']) - planStatusRank(rightItem['状态']);
        if (statusGap !== 0) return statusGap;

        const priorityGap = planPriorityRank(leftItem['优先级']) - planPriorityRank(rightItem['优先级']);
        if (priorityGap !== 0) return priorityGap;

        return Number(rightItem['$time'] || 0) - Number(leftItem['$time'] || 0);
      })
      .map(([title, item]) => {
        const plan = plain(item);
        const status = displayQuiet(plan['状态']) || '待完成';
        const rows = compactRows([
          { label: '对象', value: displayQuiet(plan['对象']) },
          { label: '计划', value: displayQuiet(plan['计划内容']) || title },
          { label: '时间', value: displayQuiet(plan['时间']) },
          { label: '备注', value: displayQuiet(plan['备注']) },
        ]);

        if (!isMeaningfulText(title) && !rows.length) return null;

        return {
          title,
          status,
          eyebrow: uniqueTextParts(
            [
              status,
              displayQuiet(plan['优先级']) ? `优先级 ${displayQuiet(plan['优先级'])}` : '',
            ],
            '计划',
          ),
          rows,
        };
      })
      .filter(Boolean),
  );

  const currentPlan = computed(() => {
    const first =
      planCards.value.find(plan => !['已完成', '失败'].includes(plan.status)) ||
      planCards.value[0];
    if (!first) return '暂无推进';

    return uniqueTextParts(
      [rowValue(first.rows, '计划', first.title), rowValue(first.rows, '时间')],
      first.title || '暂无推进',
    );
  });

  const characters = computed(() => {
    const cards = [
      buildCharacterCard('角色A', common.value['角色A']),
      buildCharacterCard('角色B', common.value['角色B'], 'violet'),
    ].filter(Boolean) as NonNullable<ReturnType<typeof buildCharacterCard>>[];

    const exists = new Set(cards.map(item => item.title));
    asEntries(common.value['队伍']).forEach(([name, item]) => {
      const card = buildCharacterCard(name, item);
      if (card && !exists.has(card.title)) cards.push(card);
    });

    return cards;
  });

  const characterSummary = computed<Row[]>(() => []);

  const relationTeamCards = computed(() =>
    asEntries(common.value['队伍'])
      .map(([name, item]) => buildCharacterCard(name, item, 'blue'))
      .filter(Boolean) as NonNullable<ReturnType<typeof buildCharacterCard>>[],
  );

  const weaponDetailCards = computed(() => {
    const detail = plain(bag.value['武器详情']);
    const compat = plain(bag.value['武器']);

    return Array.from(new Set([...Object.keys(detail), ...Object.keys(compat)]))
      .map(name => {
        const item = plain(detail[name]);
        const ammoMeter = ratioMeter('余弹', item['余弹'], item['最大余弹'], 'blue');
        const durabilityMeter =
          item['耐久'] === undefined ? null : { ...meter('耐久', item['耐久'], 'gold'), text: `${clamp(item['耐久'], 0, 100)} / 100` };
        const rows = compactRows([
          { label: '状态', value: displayQuiet(item['状态'], ['可用']) || displayQuiet(compat[name], ['可用']) },
          {
            label: '余弹',
            value: ammoMeter ? '' : uniqueTextParts([displayQuiet(item['余弹']), displayQuiet(compat[name])]),
          },
          { label: '备注', value: displayQuiet(item['备注']) },
        ]);

        if (!ammoMeter && !durabilityMeter && !rows.length) return null;

        return {
          title: name,
          eyebrow: displayQuiet(item['状态'], ['可用']) || '武器状态',
          meters: [ammoMeter, durabilityMeter].filter(Boolean) as MeterInfo[],
          rows,
        };
      })
      .filter(Boolean) as StatusCard[];
  });

  const intelDetailCards = computed(() => {
    const detail = plain(bag.value['情报道具详情']);
    const compat = plain(bag.value['情报道具']);

    return Array.from(new Set([...Object.keys(detail), ...Object.keys(compat)]))
      .map(name => {
        const item = plain(detail[name]);
        const rows = compactRows([
          { label: '描述', value: displayQuiet(item['描述']) },
          { label: '状态', value: displayQuiet(item['状态']) || displayQuiet(compat[name]) },
          { label: '数量', value: Number(item['数量'] || 0) > 0 ? `×${Math.trunc(Number(item['数量']))}` : '' },
          { label: '备注', value: displayQuiet(item['备注']) },
        ]);

        if (!rows.length) return null;

        return {
          title: name,
          eyebrow: displayQuiet(item['状态']) || '情报记录',
          meters: [],
          rows,
        };
      })
      .filter(Boolean) as StatusCard[];
  });

  const bagCategories = computed<InventoryCategory[]>(() => {
    const weaponSlots: InventorySlot[] = Array.from(
      new Set([...Object.keys(plain(bag.value['武器详情'])), ...Object.keys(plain(bag.value['武器']))]),
    ).map(name => {
      const item = plain(plain(bag.value['武器详情'])[name]);
      return {
        id: `weapon-${name}`,
        title: name,
        tone: 'weapon',
        meta: displayQuiet(item['状态'], ['可用']) || undefined,
        summary: uniqueTextParts(
          [
            item['最大余弹'] !== undefined ? `${display(item['余弹'], '0')} / ${display(item['最大余弹'], '0')}` : '',
            item['耐久'] === undefined ? '' : `耐久 ${clamp(item['耐久'], 0, 100)}`,
            displayQuiet(plain(bag.value['武器'])[name], ['可用']),
          ],
          '已收纳',
        ),
      };
    });

    const medicalSlots: InventorySlot[] = asEntries(bag.value['医疗'])
      .filter(([, amount]) => Number(amount) > 0)
      .map(([name, amount]) => ({
        id: `medical-${name}`,
        title: name,
        tone: 'medical',
        summary: `×${Math.trunc(Number(amount))}`,
      }));

    const rationSlots: InventorySlot[] = asEntries(bag.value['食物水'])
      .filter(([, amount]) => Number(amount) > 0)
      .map(([name, amount]) => ({
        id: `ration-${name}`,
        title: name,
        tone: 'ration',
        summary: `×${Math.trunc(Number(amount))}`,
      }));

    const artifactSlots: InventorySlot[] = asEntries(bag.value['异能道具'])
      .filter(([, amount]) => Number(amount) > 0)
      .map(([name, amount]) => ({
        id: `artifact-${name}`,
        title: name,
        tone: 'artifact',
        summary: `×${Math.trunc(Number(amount))}`,
      }));

    const intelSlots: InventorySlot[] = Array.from(
      new Set([...Object.keys(plain(bag.value['情报道具详情'])), ...Object.keys(plain(bag.value['情报道具']))]),
    ).map(name => {
      const item = plain(plain(bag.value['情报道具详情'])[name]);
      return {
        id: `intel-${name}`,
        title: name,
        tone: 'intel',
        meta: displayQuiet(item['状态']) || undefined,
        summary: uniqueTextParts(
          [
            Number(item['数量'] || 0) > 0 ? `×${Math.trunc(Number(item['数量']))}` : '',
            displayQuiet(plain(bag.value['情报道具'])[name], ['可读取', '无']),
          ],
          '已归档',
        ),
      };
    });

    return [
      { key: 'weapon', title: '武器', tone: 'blue', eyebrow: '枪灰蓝格位', slots: weaponSlots },
      { key: 'medical', title: '医疗', tone: 'red', eyebrow: '暗红应急格', slots: medicalSlots },
      { key: 'ration', title: '食物水', tone: 'green', eyebrow: '军绿补给格', slots: rationSlots },
      { key: 'artifact', title: '异能道具', tone: 'violet', eyebrow: '暗紫封存格', slots: artifactSlots },
      { key: 'intel', title: '情报道具', tone: 'gold', eyebrow: '黄铜档案格', slots: intelSlots },
    ].filter(group => group.slots.length);
  });

  const bagDetailGroups = computed<InventoryDetailGroup[]>(() =>
    [
      {
        key: 'weapon-details',
        title: '武器详情',
        tone: 'blue',
        eyebrow: '下沉详情',
        description: '',
        items: weaponDetailCards.value,
      },
      {
        key: 'intel-details',
        title: '情报道具详情',
        tone: 'gold',
        eyebrow: '下沉详情',
        description: '格子负责收纳概览，这里只补描述、备注和独有状态。',
        items: intelDetailCards.value,
      },
    ].filter(group => group.items.length),
  );

  const bagSummary = computed(() => {
    const countOf = (key: InventorySlotTone) => bagCategories.value.find(group => group.key === key)?.slots.length ?? 0;
    const total = bagCategories.value.reduce((sum, group) => sum + group.slots.length, 0);

    return compactRows([
      { label: '收纳总数', value: `${total} 格` },
      { label: '武器', value: `${countOf('weapon')} 格` },
      { label: '医疗', value: `${countOf('medical')} 格` },
      { label: '食物水', value: `${countOf('ration')} 格` },
      { label: '异能道具', value: `${countOf('artifact')} 格` },
      { label: '情报道具', value: `${countOf('intel')} 格` },
      { label: '本轮变化', value: displayQuiet(bag.value['本轮变化'], ['无变化']) || '当前无变化' },
    ]);
  });

  const sceneRows = computed(() =>
    compactRows([
      { label: '遭遇', value: displayQuiet(info.value['遭遇事件']) },
      { label: '天气', value: displayQuiet(info.value['天气']) },
      { label: '季节', value: displayQuiet(info.value['季节']) },
      {
        label: '场景标签',
        value: Array.isArray(info.value['当前场景标签']) ? uniqueTextParts(info.value['当前场景标签']) : '',
      },
      { label: '战斗状态', value: info.value['是否战斗中'] ? '战斗中' : '' },
      { label: '备注', value: displayQuiet(info.value['备注']) },
    ]),
  );

  const judgementRows = computed(() => {
    const rows = compactRows([
      { label: '类型', value: displayQuiet(judgement.value['最近类型']) },
      { label: '属性', value: displayQuiet(judgement.value['最近属性']) },
      { label: '骰点', value: Number(judgement.value['最近骰点'] || 0) > 0 ? String(judgement.value['最近骰点']) : '' },
      { label: '结果', value: Number(judgement.value['最终结果'] || 0) > 0 ? String(judgement.value['最终结果']) : '' },
      { label: '等级', value: displayQuiet(judgement.value['结果等级']) },
      { label: '后果', value: displayQuiet(judgement.value['附加后果']) },
      { label: '结算', value: judgement.value['是否已结算'] === false ? '待结算' : '' },
    ]);

    return rows;
  });

  const routeNodes = computed<RouteNode[]>(() =>
    asEntries(common.value['地图'])
      .map(([title, item]) => {
        const info = plain(item);
        const note = displayQuiet(info['备注']) || mapTypeLabel(info['类型']);
        return {
          id: title,
          title,
          icon: display(info['emoji'], '📍'),
          tone: mapTypeTone(info['类型']),
          typeLabel: mapTypeLabel(info['类型']),
          note,
          summary: uniqueTextParts([mapTypeLabel(info['类型']), note], mapTypeLabel(info['类型'])),
          isCurrent: display(info['类型'], 'normal') === 'current',
        };
      })
      .sort((left, right) => mapTypeRank(left.tone) - mapTypeRank(right.tone)),
  );

  const routeCurrentNode = computed(() => routeNodes.value.find(node => node.isCurrent) || routeNodes.value[0] || null);

  const relationCards = computed(() =>
    asEntries(relation.value['角色关系']).map(([title, item]) => ({
      title,
      eyebrow: display(plain(item)['标签'], '关系'),
      rows: compactRows([
        { label: '数值', value: display(plain(item)['数值'], '') },
        { label: '最近事件', value: displayQuiet(plain(item)['最近事件']) },
        { label: '备注', value: displayQuiet(plain(item)['备注']) },
      ]),
    })),
  );

  const allies = computed(() => asEntries(relation.value['盟友']).map(([name, value]) => `${name} +${value}`));
  const enemies = computed(() => asEntries(relation.value['敌对']).map(([name, value]) => `${name} ${value}`));
  const allyRelations = computed(() =>
    asEntries(relation.value['盟友'])
      .map(([name, value]) => buildFactionBar(name, value, 'green'))
      .filter(Boolean)
      .sort((left, right) => right.percent - left.percent) as FactionBar[],
  );
  const enemyRelations = computed(() =>
    asEntries(relation.value['敌对'])
      .map(([name, value]) => buildFactionBar(name, value, 'red'))
      .filter(Boolean)
      .sort((left, right) => right.percent - left.percent) as FactionBar[],
  );

  const combatSummary = computed(() =>
    compactRows([
      { label: '回合', value: Number(combat.value['回合'] || 0) > 0 ? String(combat.value['回合']) : '' },
      { label: '地点', value: displayQuiet(combat.value['地点']) },
      { label: '行动', value: displayQuiet(combat.value['行动']) },
      { label: '状态', value: displayQuiet(combat.value['状态']) },
      { label: '结果摘要', value: displayQuiet(combat.value['战斗结果摘要']) },
    ]),
  );

  const combatAllies = computed(() =>
    asEntries(combat.value['我方']).map(([title, item]) => {
        const hp = hpMeta(plain(item)['HP数值']);
        return {
          title,
          eyebrow: uniqueTextParts(
            [
              displayQuiet(plain(item)['异能分类']),
              displayQuiet(plain(item)['暴走状态'], ['无']),
            ],
            '我方状态',
          ),
          meters: hp?.meter ? [hp.meter] : [],
          rows: compactRows([
          { label: 'HP', value: hp?.text || displayQuiet(plain(item)['HP'], ['0/0']) },
          { label: '异能分类', value: displayQuiet(plain(item)['异能分类']) },
          { label: '暴走状态', value: displayQuiet(plain(item)['暴走状态'], ['无']) },
          { label: '备注', value: displayQuiet(plain(item)['备注']) },
        ]),
      };
    }),
  );

  const combatEnemies = computed(() =>
    asEntries(combat.value['敌方']).map(([title, item]) => {
      const hp = hpMeta(plain(item)['HP数值']);
        return {
          title,
          eyebrow: uniqueTextParts(
            [
              displayQuiet(plain(item)['威胁'], ['未知']),
            ],
            '敌方情报',
          ),
          meters: hp?.meter ? [hp.meter] : [],
          rows: compactRows([
          { label: 'HP', value: hp?.text || displayQuiet(plain(item)['HP'], ['0/0']) },
          { label: '威胁', value: displayQuiet(plain(item)['威胁'], ['未知']) },
          { label: '备注', value: displayQuiet(plain(item)['备注']) },
        ]),
      };
    }),
  );

  const crisisCards = computed(() =>
    asEntries(crisis.value).map(([title, item]) => ({
      title: displayQuiet(plain(item)['对象']) ? `${display(plain(item)['对象'], '')} / ${display(plain(item)['类型'], '危机')}` : title,
      eyebrow: uniqueTextParts(
        [
          displayQuiet(plain(item)['状态']),
          stageSummary(item),
        ],
        display(plain(item)['类型'], '危机'),
      ),
      rows: compactRows([
        { label: '数值', value: displayQuiet(plain(item)['数值']) },
        { label: '危机值', value: Number(plain(item)['危机值'] || 0) > 0 ? String(plain(item)['危机值']) : '' },
        { label: '阶段', value: stageSummary(item) },
        { label: '症状', value: displayQuiet(plain(item)['症状']) },
        { label: '处置', value: displayQuiet(plain(item)['处置']) },
        { label: '倒计时', value: countdownSummary(item) },
        { label: '备注', value: displayQuiet(plain(item)['备注']) },
      ]),
    })),
  );

  const npcCards = computed(() =>
    asEntries(npc.value).map(([title, item]) => ({
      title,
      eyebrow: uniqueTextParts(
        [
          displayQuiet(plain(item)['所属']),
          displayQuiet(plain(item)['威胁'], ['未知']),
        ],
        '人物档案',
      ),
      rows: compactRows([
        { label: '性别', value: displayQuiet(plain(item)['性别'], ['未知']) },
        { label: '年龄', value: displayQuiet(plain(item)['年龄'], ['未知']) },
        { label: '所属', value: displayQuiet(plain(item)['所属']) },
        { label: '异能', value: displayQuiet(plain(item)['异能'], ['无']) },
        { label: '威胁', value: displayQuiet(plain(item)['威胁'], ['未知']) },
        { label: '外貌', value: displayQuiet(plain(item)['外貌'], ['无']) },
        { label: '性格', value: displayQuiet(plain(item)['性格'], ['未知']) },
        { label: '意图', value: displayQuiet(plain(item)['意图'], ['无']) },
        { label: '备注', value: displayQuiet(plain(item)['备注'], ['无']) },
      ]),
    })),
  );

  const monsterCards = computed(() =>
    asEntries(monster.value).map(([title, item]) => ({
      title,
      eyebrow: uniqueTextParts(
        [
          displayQuiet(plain(item)['所属']),
          displayQuiet(plain(item)['威胁'], ['低']),
        ],
        '怪物档案',
      ),
      rows: compactRows([
        { label: '阶级', value: displayQuiet(plain(item)['阶级'], ['低阶']) },
        { label: '所属', value: displayQuiet(plain(item)['所属']) },
        { label: '核心', value: displayQuiet(plain(item)['核心'], ['未显露']) },
        { label: '威胁', value: displayQuiet(plain(item)['威胁'], ['低']) },
        { label: '形态', value: displayQuiet(plain(item)['形态'], ['无']) },
        { label: '行为模式', value: displayQuiet(plain(item)['行为模式'], ['本能']) },
        { label: '当前状态', value: displayQuiet(plain(item)['当前状态'], ['潜伏']) },
        { label: '弱点', value: displayQuiet(plain(item)['弱点'], ['无']) },
        { label: '备注', value: displayQuiet(plain(item)['备注'], ['无']) },
      ]),
    })),
  );

  const nsfwActive = computed(() => {
    return [
      displayQuiet(nsfw.value['当前阶段'], ['无']),
      displayQuiet(nsfw.value['攻方'], ['未知']),
      displayQuiet(nsfw.value['受方'], ['未知']),
      displayQuiet(nsfw.value['攻方内心'], ['无']),
      displayQuiet(nsfw.value['受方内心'], ['无']),
      displayQuiet(nsfw.value['总结骚话'], ['无']),
    ].some(Boolean) || Number(nsfw.value['爱爱进度'] || 0) > 0;
  });

  const nsfwPhase = computed(() => displayQuiet(nsfw.value['当前阶段'], ['无']) || '待机');
  const nsfwProgress = computed(() => clamp(nsfw.value['爱爱进度'], 0, 100));
  const nsfwActor = computed(() => displayQuiet(nsfw.value['攻方'], ['未知']) || '主动方未指定');
  const nsfwReceiver = computed(() => displayQuiet(nsfw.value['受方'], ['未知']) || '承受方未指定');
  const nsfwActorMind = computed(() => displayQuiet(nsfw.value['攻方内心'], ['无']) || '暂无');
  const nsfwReceiverMind = computed(() => displayQuiet(nsfw.value['受方内心'], ['无']) || '暂无');
  const nsfwStageNote = computed(() => stageNote(nsfwPhase.value));
  const nsfwSummaryNote = computed(() => displayQuiet(nsfw.value['总结骚话'], ['无']));
  const nsfwActorRows = computed(() => [
    { label: '内心', value: nsfwActorMind.value },
    { label: '龟头状态', value: display(nsfw.value['龟头状态'], '平软收缩') },
    { label: '柱身状态', value: display(nsfw.value['柱身状态'], '松弛自然') },
  ]);
  const nsfwReceiverRows = computed(() => [
    { label: '内心', value: nsfwReceiverMind.value },
    { label: '前端状态', value: display(nsfw.value['前端状态'], '平软') },
    { label: '后穴状态', value: display(nsfw.value['后穴状态'], '紧闭') },
  ]);
  const nsfwActorMeters = computed(() => [
    meter('勃起度', nsfw.value['勃起度'], 'violet'),
    meter('射精临近度', nsfw.value['射精临近度'], 'pink'),
  ]);
  const nsfwReceiverMeters = computed(() => [
    meter('受方勃起度', nsfw.value['受方勃起度'], 'pink'),
    meter('前列腺快感度', nsfw.value['前列腺快感度'], 'romance'),
    meter('高潮临近度', nsfw.value['高潮临近度'], 'rose'),
  ]);

  return {
    data,
    info,
    currentCp,
    currentPlan,
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
    judgementRows,
    routeNodes,
    routeCurrentNode,
    combatSummary,
    combatAllies,
    combatEnemies,
    crisisCards,
    relationCards,
    relationTeamCards,
    allies,
    enemies,
    allyRelations,
    enemyRelations,
    npcCards,
    monsterCards,
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
    nsfw,
  };
}
