import { registerMvuSchema } from 'https://testingcf.jsdelivr.net/gh/StageDog/tavern_resource/dist/util/mvu_zod.js';

const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));

const nonNegativeInt = z.coerce.number().catch(0).transform(v => Math.max(0, Math.trunc(v)));
const clamped100 = z.coerce.number().catch(0).transform(v => clamp(Math.trunc(v), 0, 100));
const signed100 = z.coerce.number().catch(0).transform(v => clamp(Math.trunc(v), -100, 100));

const HpSchema = z.object({
  当前: nonNegativeInt.prefault(0),
  最大: nonNegativeInt.prefault(0)
}).prefault({});

const StageSchema = z.object({
  当前: nonNegativeInt.prefault(1),
  总: nonNegativeInt.prefault(3)
}).prefault({});

const CharacterStatusSchema = z.object({
  姓名: z.string().prefault(''),
  神态: z.string().prefault(''),
  动作: z.string().prefault(''),
  希望: z.string().prefault(''),
  内心: z.string().prefault(''),
  体力: clamped100.prefault(100),
  精神稳定: clamped100.prefault(100),
  污染值: clamped100.prefault(0),
  伤势: z.enum(['无', '轻微', '中等', '严重', '濒危']).prefault('无'),
  衣着_上: z.string().prefault(''),
  衣着_下: z.string().prefault(''),
  衣着_内: z.string().prefault(''),
  备注: z.string().prefault('')
}).prefault({});

const MapPointSchema = z.object({
  类型: z.enum(['past', 'normal', 'current', 'goal', 'danger']).prefault('normal'),
  emoji: z.string().prefault('📍'),
  备注: z.string().prefault('无')
}).prefault({});

const CombatAllySchema = z.object({
  HP: z.string().prefault('0/0'),
  HP数值: HpSchema.prefault({}),
  异能分类: z.string().prefault('无'),
  暴走状态: z.string().prefault('无'),
  备注: z.string().prefault('无')
}).prefault({});

const CombatEnemySchema = z.object({
  威胁: z.enum(['未知', '低', '中', '高', '极危']).prefault('未知'),
  HP: z.string().prefault('0/0'),
  HP数值: HpSchema.prefault({}),
  备注: z.string().prefault('无')
}).prefault({});

const WeaponDetailSchema = z.object({
  余弹: nonNegativeInt.prefault(0),
  最大余弹: nonNegativeInt.prefault(0),
  耐久: clamped100.prefault(100),
  状态: z.enum(['可用', '损坏', '失效', '遗失']).prefault('可用'),
  备注: z.string().prefault('无')
}).prefault({});

const InfoItemSchema = z.object({
  描述: z.string().prefault('无'),
  状态: z.string().prefault('无'),
  数量: nonNegativeInt.prefault(0),
  备注: z.string().prefault('无')
}).prefault({});

const CrisisItemSchema = z.object({
  类型: z.enum(['感染', '暴走', '重伤', '中毒', '精神崩溃']).prefault('感染'),
  对象: z.string().prefault(''),
  数值: z.string().prefault('无'),
  危机值: nonNegativeInt.prefault(0),
  阶段: z.string().prefault('1/3'),
  阶段数据: StageSchema.prefault({}),
  症状: z.string().prefault('无'),
  处置: z.string().prefault('无'),
  倒计时: z.string().prefault('无'),
  倒计时数: nonNegativeInt.prefault(0),
  倒计时单位: z.enum(['无', '回合', '小时', '天']).prefault('无'),
  状态: z.enum(['进行中', '缓解', '稳定', '解除', '恶化']).prefault('进行中'),
  备注: z.string().prefault('')
}).prefault({});

const NpcSchema = z.object({
  性别: z.string().prefault('未知'),
  年龄: z.string().prefault('未知'),
  所属: z.string().prefault('未知'),
  异能: z.string().prefault('无'),
  威胁: z.string().prefault('未知'),
  外貌: z.string().prefault('无'),
  性格: z.string().prefault('未知'),
  意图: z.string().prefault('无'),
  备注: z.string().prefault('无')
}).prefault({});

const MonsterSchema = z.object({
  性别: z.string().prefault('无'),
  阶级: z.string().prefault('低阶'),
  所属: z.string().prefault('克锐特'),
  核心: z.string().prefault('未显露'),
  威胁: z.enum(['低', '中', '高', '极危']).prefault('低'),
  形态: z.string().prefault('无'),
  行为模式: z.string().prefault('本能'),
  当前状态: z.string().prefault('潜伏'),
  弱点: z.string().prefault('无'),
  备注: z.string().prefault('无')
}).prefault({});

const RelationItemSchema = z.object({
  数值: signed100.prefault(0),
  标签: z.string().prefault('无'),
  最近事件: z.string().prefault('无'),
  备注: z.string().prefault('无')
}).prefault({});

const PlanItemSchema = z.object({
  对象: z.string().prefault('未知'),
  计划内容: z.string().prefault('无'),
  时间: z.string().prefault('未知'),
  状态: z.enum(['待完成', '进行中', '已完成', '失败', '搁置']).prefault('待完成'),
  优先级: z.enum(['低', '中', '高', '紧急']).prefault('中'),
  备注: z.string().prefault('无'),
  $time: nonNegativeInt.prefault(0)
}).prefault({});

const OpeningStateSchema = z.object({
  已选择角色: z.string().prefault(''),
  已选择线路: z.string().prefault(''),
  已完成角色同步: z.coerce.boolean().catch(false).prefault(false),
  已进入正式剧情: z.coerce.boolean().catch(false).prefault(false),
  开局来源: z.string().prefault('unknown'),
  开局摘要: z.string().prefault('')
}).prefault({});

export const Schema = z.object({
  开局状态: OpeningStateSchema.prefault({}),

  世界: z.object({
    年份: nonNegativeInt.prefault(2030),
    世界基准时间: z.string().prefault('2030年韩国末世'),
    单视角模式: z.coerce.boolean().catch(true).prefault(true),
    允许NSFW: z.coerce.boolean().catch(false).prefault(false),
    高风险判定状态: z.coerce.boolean().catch(false).prefault(false),
    当前判定规则: z.string().prefault('D20')
  }).prefault({}),

  世界信息: z.object({
    时间: z.string().prefault(''),
    季节: z.string().prefault(''),
    场所: z.string().prefault(''),
    天气: z.string().prefault(''),
    遭遇事件: z.string().prefault('无'),
    第几天: nonNegativeInt.prefault(1),
    是否战斗中: z.coerce.boolean().catch(false).prefault(false),
    当前场景标签: z.array(z.string()).prefault([]),
    备注: z.string().prefault('无')
  }).prefault({}),

  判定状态: z.object({
    最近类型: z.string().prefault('无'),
    最近属性: z.string().prefault('无'),
    最近骰点: z.coerce.number().catch(0).prefault(0),
    最终结果: z.coerce.number().catch(0).prefault(0),
    结果等级: z.string().prefault('无'),
    附加后果: z.string().prefault('无'),
    是否已结算: z.coerce.boolean().catch(true).prefault(true)
  }).prefault({}),

  通用状态栏: z.object({
    角色A: CharacterStatusSchema.prefault({}),
    角色B: CharacterStatusSchema.prefault({}),
    队伍: z.record(z.string().describe('角色名'), CharacterStatusSchema).prefault({}),
    地图: z.record(z.string().describe('地点名称'), MapPointSchema).prefault({})
  }).prefault({}),

  战斗面板: z.object({
    回合: nonNegativeInt.prefault(0),
    地点: z.string().prefault('无'),
    我方: z.record(z.string().describe('角色名'), CombatAllySchema).prefault({}),
    敌方: z.record(z.string().describe('敌人名'), CombatEnemySchema).prefault({}),
    行动: z.string().prefault('无'),
    状态: z.string().prefault('无'),
    战斗结果摘要: z.string().prefault('无')
  }).prefault({}),

  背包栏: z.object({
    武器: z.record(z.string().describe('武器名'), z.string().describe('兼容旧模板')).prefault({}),
    武器详情: z.record(z.string().describe('武器名'), WeaponDetailSchema).prefault({}),
    医疗: z.record(z.string().describe('物品名'), nonNegativeInt.describe('数量')).prefault({}),
    食物水: z.record(z.string().describe('物品名'), nonNegativeInt.describe('数量')).prefault({}),
    异能道具: z.record(z.string().describe('物品名'), nonNegativeInt.describe('数量')).prefault({}),
    情报道具: z.record(z.string().describe('物品名'), z.string().describe('兼容旧模板')).prefault({}),
    情报道具详情: z.record(z.string().describe('物品名'), InfoItemSchema).prefault({}),
    本轮变化: z.string().prefault('无变化')
  }).prefault({}),

  危机面板: z.record(z.string().describe('危机ID'), CrisisItemSchema).prefault({}),
  NPC档案: z.record(z.string().describe('NPC名或编号'), NpcSchema).prefault({}),
  怪物档案: z.record(z.string().describe('怪物名或代号'), MonsterSchema).prefault({}),

  调试状态: z.object({
    开启DEBUG: z.coerce.boolean().catch(false).prefault(false)
  }).prefault({}),

  关系面板: z.object({
    视角角色: z.string().prefault(''),
    当前主CP: z.string().prefault(''),
    好感: signed100.prefault(0),
    羁绊: z.string().prefault('无'),
    盟友: z.record(z.string().describe('角色名'), signed100.describe('好感度')).prefault({}),
    敌对: z.record(z.string().describe('角色名'), signed100.describe('敌意度')).prefault({}),
    角色关系: z.record(z.string().describe('角色名'), RelationItemSchema).prefault({}),
    当前关系事件: z.string().prefault('无')
  }).prefault({}),

  NSFW状态栏: z.object({
    攻方: z.string().prefault('未知'),
    受方: z.string().prefault('未知'),
    爱爱进度: clamped100.prefault(0),
    当前阶段: z.string().prefault('无'),
    勃起度: clamped100.prefault(0),
    龟头状态: z.string().prefault('平软收缩'),
    柱身状态: z.string().prefault('松弛自然'),
    射精临近度: clamped100.prefault(0),
    攻方内心: z.string().prefault('无'),
    受方勃起度: clamped100.prefault(0),
    前端状态: z.string().prefault('平软'),
    后穴状态: z.string().prefault('紧闭'),
    前列腺快感度: clamped100.prefault(0),
    高潮临近度: clamped100.prefault(0),
    受方内心: z.string().prefault('无'),
    总结骚话: z.string().prefault('无')
  }).prefault({}),

  计划列表: z.record(z.string().describe('计划唯一标识'), PlanItemSchema).prefault({})
}).prefault({});

registerMvuSchema(Schema);