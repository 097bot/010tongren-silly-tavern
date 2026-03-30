await waitGlobalInitialized('Mvu');

eventOn(Mvu.events.VARIABLE_INITIALIZED, (variables) => {
  const root = _.has(variables, 'stat_data') ? 'stat_data' : '';
  const abs = (path) => (root ? `${root}.${path}` : path);
  const get = (path, def) => _.get(variables, abs(path), def);
  const set = (path, value) => _.set(variables, abs(path), value);

  const ensureObject = (path) => {
    const v = get(path);
    if (!v || typeof v !== 'object' || Array.isArray(v)) set(path, {});
  };

  const ensureString = (path, fallback = '') => {
    const v = get(path, fallback);
    if (typeof v !== 'string') set(path, fallback);
  };

  const ensureNumber = (path, fallback = 0) => {
    const v = Number(get(path, fallback));
    set(path, Number.isFinite(v) ? v : fallback);
  };

  function inferPartner(role, line) {
    if (role === '周成宰') return { cp: '金义材', b: '金义材' };
    if (role === '金义材') return { cp: '周成宰', b: '周成宰' };

    if (role === '韩佳温') {
      if (line === '成艺彬线') return { cp: '成艺彬', b: '成艺彬' };
      if (line === '朴武镇线') return { cp: '朴武镇', b: '朴武镇' };
      return { cp: '', b: '' };
    }
    if (role === '成艺彬') return { cp: '韩佳温', b: '韩佳温' };
    if (role === '朴武镇') return { cp: '韩佳温', b: '韩佳温' };

    if (role === '刘率') return { cp: '崔诺亚', b: '崔诺亚' };
    if (role === '崔诺亚') return { cp: '刘率', b: '刘率' };

    if (role === '白耀汉') return { cp: '李宇林', b: '李宇林' };
    if (role === '李宇林') return { cp: '白耀汉', b: '白耀汉' };

    if (role === '河载京') return { cp: '徐泰贤', b: '徐泰贤' };
    if (role === '徐泰贤') return { cp: '河载京', b: '河载京' };

    if (role === '申成日') return { cp: '闵时厚', b: '闵时厚' };
    if (role === '闵时厚') return { cp: '申成日', b: '申成日' };

    return { cp: '', b: '' };
  }

  function ensureCharacterDefaults(base) {
    if (!get(`${base}.神态`, '')) set(`${base}.神态`, '保持观察');
    if (!get(`${base}.动作`, '')) set(`${base}.动作`, '待命');
    if (!get(`${base}.希望`, '')) set(`${base}.希望`, '确认当前局势');
    if (!get(`${base}.内心`, '')) set(`${base}.内心`, '先观察，再判断下一步。');
    if (get(`${base}.体力`, null) === null || get(`${base}.体力`, undefined) === undefined) set(`${base}.体力`, 100);
    if (get(`${base}.精神稳定`, null) === null || get(`${base}.精神稳定`, undefined) === undefined) set(`${base}.精神稳定`, 100);
    if (get(`${base}.污染值`, null) === null || get(`${base}.污染值`, undefined) === undefined) set(`${base}.污染值`, 0);
    if (!get(`${base}.伤势`, '')) set(`${base}.伤势`, '无');
    if (!get(`${base}.衣着_上`, '')) set(`${base}.衣着_上`, '');
    if (!get(`${base}.衣着_下`, '')) set(`${base}.衣着_下`, '');
    if (!get(`${base}.衣着_内`, '')) set(`${base}.衣着_内`, '');
    if (!get(`${base}.备注`, '')) set(`${base}.备注`, '');
  }

  function guessEmoji(place) {
    if (!place) return '📍';
    if (/军营|基地|联队|营区|哨所|驻地/.test(place)) return '🪖';
    if (/病房|医院|医务|手术室|留观/.test(place)) return '🩺';
    if (/实验室|研究所|检验/.test(place)) return '🧪';
    if (/仓库|库房|储藏|补给/.test(place)) return '📦';
    if (/检查点|关卡|岗哨|站台/.test(place)) return '🚧';
    if (/港|码头|泊位/.test(place)) return '⚓';
    if (/街区|商区|城区|市场/.test(place)) return '🏙️';
    if (/宿舍|房间|安全屋|住处/.test(place)) return '🛏️';
    if (/古董店|商店|便利店/.test(place)) return '🏪';
    if (/桥|高架/.test(place)) return '🌉';
    if (/地铁|隧道|地下/.test(place)) return '🚇';
    if (/森林|荒野|山|野外/.test(place)) return '🌲';
    if (/温泉|浴场/.test(place)) return '♨️';
    if (/营地|帐篷|驻扎/.test(place)) return '⛺';
    if (/广场|竞技场|球场/.test(place)) return '🏟️';
    return '📍';
  }

  [
    '开局状态',
    '世界',
    '世界信息',
    '判定状态',
    '通用状态栏',
    '通用状态栏.角色A',
    '通用状态栏.角色B',
    '通用状态栏.队伍',
    '通用状态栏.地图',
    '战斗面板',
    '战斗面板.我方',
    '战斗面板.敌方',
    '背包栏',
    '背包栏.武器',
    '背包栏.武器详情',
    '背包栏.医疗',
    '背包栏.食物水',
    '背包栏.异能道具',
    '背包栏.情报道具',
    '背包栏.情报道具详情',
    '危机面板',
    'NPC档案',
    '怪物档案',
    '调试状态',
    '关系面板',
    '关系面板.盟友',
    '关系面板.敌对',
    '关系面板.角色关系',
    'NSFW状态栏',
    '计划列表'
  ].forEach(ensureObject);

  ensureString('背包栏.本轮变化', '无变化');
  ensureString('世界信息.遭遇事件', '无');
  ensureString('世界信息.备注', '无');
  ensureString('战斗面板.地点', '无');
  ensureString('战斗面板.行动', '无');
  ensureString('战斗面板.状态', '无');
  ensureString('战斗面板.战斗结果摘要', '无');
  ensureString('关系面板.羁绊', '无');
  ensureString('关系面板.当前关系事件', '无');
  ensureNumber('世界信息.第几天', 1);
  if (get('世界信息.是否战斗中', null) === null || get('世界信息.是否战斗中', undefined) === undefined) {
    set('世界信息.是否战斗中', false);
  }
  if (get('关系面板.好感', null) === null || get('关系面板.好感', undefined) === undefined) {
    set('关系面板.好感', 0);
  }
  if (get('开局状态.已完成角色同步', null) === null || get('开局状态.已完成角色同步', undefined) === undefined) {
    set('开局状态.已完成角色同步', false);
  }
  if (get('开局状态.已进入正式剧情', null) === null || get('开局状态.已进入正式剧情', undefined) === undefined) {
    set('开局状态.已进入正式剧情', false);
  }
  if (!String(get('开局状态.开局来源', '') || '').trim()) {
    set('开局状态.开局来源', 'unknown');
  }
  const selectedRole = String(get('开局状态.已选择角色', '') || '').trim();
  const selectedLine = String(get('开局状态.已选择线路', '') || '').trim();
  const pair = inferPartner(selectedRole, selectedLine);

  if (selectedRole) {
    set('通用状态栏.角色A.姓名', selectedRole);
    set('关系面板.视角角色', selectedRole);
    if (!get('开局状态.已完成角色同步', false)) set('开局状态.已完成角色同步', true);
  }
  if (pair.b && !String(get('通用状态栏.角色B.姓名', '') || '').trim()) {
    set('通用状态栏.角色B.姓名', pair.b);
  }
  if (pair.cp && !String(get('关系面板.当前主CP', '') || '').trim()) {
    set('关系面板.当前主CP', pair.cp);
  }

  if (selectedRole && !String(get('开局状态.开局摘要', '') || '').trim()) {
    set('开局状态.开局摘要', [selectedRole, selectedLine || '默认线', '待自定义开局或剧情首轮写入'].filter(Boolean).join(' ｜ '));
  }
  if (!String(get('关系面板.当前关系事件', '') || '').trim() || String(get('关系面板.当前关系事件', '无')) === '无') {
    set('关系面板.当前关系事件', selectedRole ? '待进入正式剧情' : '无');
  }

  ensureCharacterDefaults('通用状态栏.角色A');
  if (String(get('通用状态栏.角色B.姓名', '') || '').trim()) {
    ensureCharacterDefaults('通用状态栏.角色B');
  }

  const place = String(get('世界信息.场所', '') || '').trim();
  const map = _.cloneDeep(get('通用状态栏.地图', {})) || {};
  if (place && !map[place]) {
    map[place] = {
      '类型': 'current',
      'emoji': guessEmoji(place),
      '备注': '当前所在地点'
    };
    set('通用状态栏.地图', map);
  }
});