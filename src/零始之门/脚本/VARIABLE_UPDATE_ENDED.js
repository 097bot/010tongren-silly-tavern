await waitGlobalInitialized('Mvu');

eventOn(Mvu.events.VARIABLE_UPDATE_ENDED, (variables, oldVariables) => {
  const root = _.has(variables, 'stat_data') ? 'stat_data' : '';

  const abs = (path) => (root ? `${root}.${path}` : path);
  const get = (path, def) => _.get(variables, abs(path), def);
  const oldGet = (path, def) => _.get(oldVariables, abs(path), def);
  const set = (path, value) => _.set(variables, abs(path), value);

  const clamp = (v, min, max) => Math.max(min, Math.min(max, Number(v) || 0));

  function ensureObject(path) {
    const v = get(path);
    if (!v || typeof v !== 'object' || Array.isArray(v)) {
      set(path, {});
    }
  }

  function ensureString(path, fallback = '') {
    const v = get(path);
    if (typeof v !== 'string') set(path, fallback);
  }

  function pickNonNegative(obj) {
    if (!obj || typeof obj !== 'object') return {};
    return _.pickBy(obj, (v) => Number(v) > 0);
  }

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

  function guessSceneTags(place, inBattle) {
    const tags = [];
    if (place) {
      if (/710联队|军营|基地|营区|哨所/.test(place)) tags.push('军方');
      if (/病房|医院|医务|留观/.test(place)) tags.push('医疗');
      if (/指挥室|司令部|控制室/.test(place)) tags.push('指挥');
      if (/宿舍|住处|安全屋/.test(place)) tags.push('休整');
      if (/仓库|库房|补给/.test(place)) tags.push('物资');
      if (/实验室|研究所/.test(place)) tags.push('研究');
      if (/街区|城区|商区|市场/.test(place)) tags.push('城市');
      if (/野外|森林|荒野|山/.test(place)) tags.push('野外');
      if (/检查点|关卡/.test(place)) tags.push('警戒');
      if (/港|码头/.test(place)) tags.push('港口');
      if (/地铁|地下|隧道/.test(place)) tags.push('地下');
    }
    if (inBattle) tags.push('战斗中');
    return _.uniq(tags).slice(0, 5);
  }

  function findFirstActiveGoal(planList) {
    if (!planList || typeof planList !== 'object') return '';
    for (const [, plan] of Object.entries(planList)) {
      if (!plan || typeof plan !== 'object') continue;
      const status = String(plan['状态'] || '');
      const content = String(plan['计划内容'] || '');
      const target = String(plan['对象'] || '');
      if (!['待完成', '进行中'].includes(status)) continue;

      const m = content.match(/(?:去|前往|到|抵达)([^，。；]+)/);
      if (m && m[1]) return m[1].trim();
      if (target && /室|区|营|港|站|所|楼|层|街|路|桥|门/.test(target)) return target;
    }
    return '';
  }

  ensureObject('世界信息');
  ensureObject('通用状态栏');
  ensureObject('通用状态栏.角色A');
  ensureObject('通用状态栏.角色B');
  ensureObject('通用状态栏.地图');
  ensureObject('背包栏');
  ensureObject('背包栏.武器');
  ensureObject('背包栏.武器详情');
  ensureObject('背包栏.医疗');
  ensureObject('背包栏.食物水');
  ensureObject('背包栏.异能道具');
  ensureObject('背包栏.情报道具');
  ensureObject('背包栏.情报道具详情');
  ensureObject('计划列表');
  ensureObject('关系面板');

  ensureString('背包栏.本轮变化', '无变化');

  const selectedRole = String(get('开局状态.已选择角色', '') || '').trim();
  const selectedLine = String(get('开局状态.已选择线路', '') || '').trim();
  const pair = inferPartner(selectedRole, selectedLine);

  if (selectedRole && !String(get('通用状态栏.角色A.姓名', '') || '').trim()) {
    set('通用状态栏.角色A.姓名', selectedRole);
  }
  if (selectedRole && !String(get('关系面板.视角角色', '') || '').trim()) {
    set('关系面板.视角角色', selectedRole);
  }
  if (pair.b && !String(get('通用状态栏.角色B.姓名', '') || '').trim()) {
    set('通用状态栏.角色B.姓名', pair.b);
  }
  const currentSummary = String(get('开局状态.开局摘要', '') || '').trim();
  if (selectedRole && !currentSummary) {
    set('开局状态.开局摘要', [selectedRole, selectedLine || '默认线', '待自定义开局或剧情首轮写入'].filter(Boolean).join(' ｜ '));
  }

  const currentRelationEvent = String(get('关系面板.当前关系事件', '') || '').trim();
  if (selectedRole && (!currentRelationEvent || currentRelationEvent === '无')) {
    set('关系面板.当前关系事件', '自定义开局进行中');
  }

  const numFields = [
    '通用状态栏.角色A.体力',
    '通用状态栏.角色A.精神稳定',
    '通用状态栏.角色A.污染值',
    '通用状态栏.角色B.体力',
    '通用状态栏.角色B.精神稳定',
    '通用状态栏.角色B.污染值',
    'NSFW状态栏.爱爱进度',
    'NSFW状态栏.勃起度',
    'NSFW状态栏.射精临近度',
    'NSFW状态栏.受方勃起度',
    'NSFW状态栏.前列腺快感度',
    'NSFW状态栏.高潮临近度'
  ];

  numFields.forEach((path) => {
    const value = get(path, null);
    if (value !== null && value !== undefined && value !== '') {
      set(path, clamp(value, 0, 100));
    }
  });

  const favor = get('关系面板.好感', null);
  if (favor !== null && favor !== undefined && favor !== '') {
    set('关系面板.好感', clamp(favor, -100, 100));
  }

  const place = String(get('世界信息.场所', '') || '').trim();
  const oldPlace = String(oldGet('世界信息.场所', '') || '').trim();
  const inBattle = !!get('世界信息.是否战斗中', false);
  const map = _.cloneDeep(get('通用状态栏.地图', {})) || {};

  if (place) {
    set('开局状态.已进入正式剧情', true);

    const source = String(get('开局状态.开局来源', '') || '').trim();
    if (!source || source === 'unknown') {
      set('开局状态.开局来源', 'customized');
    }

    if (oldPlace && oldPlace !== place && map[oldPlace]) {
      map[oldPlace]['类型'] = 'past';
      map[oldPlace]['备注'] = map[oldPlace]['备注'] || '已离开';
      map[oldPlace]['emoji'] = map[oldPlace]['emoji'] || guessEmoji(oldPlace);
    }

    map[place] = map[place] || {};
    map[place]['类型'] = inBattle ? 'danger' : 'current';
    map[place]['emoji'] = map[place]['emoji'] || guessEmoji(place);
    map[place]['备注'] = map[place]['备注'] || (inBattle ? '当前危险地点' : '当前所在地点');

    Object.entries(map).forEach(([name, info]) => {
      if (name === place) return;
      if (info && info['类型'] === 'current') {
        info['类型'] = 'past';
        info['备注'] = info['备注'] || '已离开';
      }
    });

    const goal = findFirstActiveGoal(get('计划列表', {}));
    if (goal && goal !== place) {
      map[goal] = map[goal] || {};
      if (!map[goal]['类型'] || map[goal]['类型'] === 'normal') {
        map[goal]['类型'] = 'goal';
      }
      map[goal]['emoji'] = map[goal]['emoji'] || guessEmoji(goal);
      map[goal]['备注'] = map[goal]['备注'] || '当前目标地点';
    }

    set('通用状态栏.地图', map);

    const sceneTags = get('世界信息.当前场景标签', []);
    if (!Array.isArray(sceneTags) || sceneTags.length === 0) {
      const fallbackTags = guessSceneTags(place, inBattle);
      if (fallbackTags.length) set('世界信息.当前场景标签', fallbackTags);
    }

    const summaryRole = String(get('开局状态.已选择角色', '') || '').trim();
    const summaryLine = String(get('开局状态.已选择线路', '') || '').trim();
    const summaryTime = String(get('世界信息.时间', '') || '').trim();
    const summaryWeather = String(get('世界信息.天气', '') || '').trim();
    const summaryParts = [summaryRole, summaryLine || '默认线', place];
    if (summaryTime) summaryParts.push(summaryTime);
    if (summaryWeather) summaryParts.push(summaryWeather);
    if (summaryRole) set('开局状态.开局摘要', summaryParts.filter(Boolean).join(' ｜ '));
  }

  set('背包栏.医疗', pickNonNegative(get('背包栏.医疗', {})));
  set('背包栏.食物水', pickNonNegative(get('背包栏.食物水', {})));
  set('背包栏.异能道具', pickNonNegative(get('背包栏.异能道具', {})));

  const intelDetail = _.cloneDeep(get('背包栏.情报道具详情', {})) || {};
  Object.keys(intelDetail).forEach((k) => {
    const item = intelDetail[k];
    if (!item || typeof item !== 'object') {
      delete intelDetail[k];
      return;
    }
    item['数量'] = Math.max(0, Number(item['数量'] || 0));
    if (item['数量'] <= 0) delete intelDetail[k];
  });
  set('背包栏.情报道具详情', intelDetail);

  const intelCompat = {};
  Object.entries(intelDetail).forEach(([k, v]) => {
    intelCompat[k] = `${v['描述']}/${v['状态']}`;
  });
  set('背包栏.情报道具', intelCompat);

  const weaponDetail = _.cloneDeep(get('背包栏.武器详情', {})) || {};
  Object.keys(weaponDetail).forEach((k) => {
    const item = weaponDetail[k];
    if (!item || typeof item !== 'object') {
      delete weaponDetail[k];
      return;
    }
    item['最大余弹'] = Math.max(0, Number(item['最大余弹'] || 0));
    item['余弹'] = Math.max(0, Math.min(item['最大余弹'], Number(item['余弹'] || 0)));
    item['耐久'] = clamp(item['耐久'], 0, 100);
    item['状态'] = ['可用', '损坏', '失效', '遗失'].includes(item['状态']) ? item['状态'] : '可用';
    item['备注'] = String(item['备注'] || '无');
  });
  set('背包栏.武器详情', weaponDetail);

  const weaponCompat = {};
  Object.entries(weaponDetail).forEach(([k, v]) => {
    weaponCompat[k] = `${v['余弹']}/${v['耐久']}/${v['状态']}`;
  });
  set('背包栏.武器', weaponCompat);

  const changeText = String(get('背包栏.本轮变化', '') || '').trim();
  if (!changeText) {
    set('背包栏.本轮变化', '无变化');
  }

  const currentCP = String(get('关系面板.当前主CP', '') || '').trim();
  const roleBName = String(get('通用状态栏.角色B.姓名', '') || '').trim();
  if (currentCP && !roleBName) {
    set('通用状态栏.角色B.姓名', currentCP);
  }
});