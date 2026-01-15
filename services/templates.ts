import { ItineraryData } from "../types";

export const TEMPLATES: Record<string, ItineraryData> = {
  "winter-6d": {
    template_code: "XJ-ALTAY-6D5N-DEPTH-001",
    title: "冬季阿勒泰深度游·6天5晚｜纯玩小团·S21沙漠高速·住进禾木",
    mode: "A",
    route_overview: "乌鲁木齐 → S21沙漠高速 → 乌伦古湖 → 喀纳斯 → 禾木 → 魔鬼城 → 奎屯 → 乌鲁木齐",
    tags: ["纯玩小团", "不走回头路", "深度游"],
    duration_days: 6,
    duration_nights: 5,
    defaults: {
      transport: "7座商务车/14座2+1（按人数匹配）",
      target_audience: "时间有限但想深度游玩的旅客"
    },
    itinerary: [
      {
        day_no: 1,
        title: "乌鲁木齐接机 - 入住酒店",
        highlights: ["接机", "自由活动"],
        segments: [{ type: "transfer", description: "24小时免费接送机 → 入住酒店 → 自由活动" }],
        stay: "乌鲁木齐（精选舒适/豪华酒店）",
        meals: { breakfast: "自理", lunch: "自理", dinner: "自理" },
        tips: ["推荐前往国际大巴扎体验异域风情"]
      },
      {
        day_no: 2,
        title: "穿越S21沙漠高速 - 乌伦古湖",
        highlights: ["S21沙漠公路", "乌伦古湖"],
        segments: [{ type: "sight", description: "穿越S21沙漠高速（不走回头路） → 游览乌伦古湖（海上魔鬼城）" }],
        stay: "布尔津/福海（当地精选酒店）",
        meals: { breakfast: "含", lunch: "自理", dinner: "自理" },
        tips: ["沙漠公路风光壮丽，适合拍摄公路大片"]
      },
      {
        day_no: 3,
        title: "喀纳斯神仙湾 - 月亮湾 - 卧龙湾",
        highlights: ["喀纳斯三湾", "雪景"],
        segments: [{ type: "sight", description: "前往喀纳斯景区 → 游览三湾（神仙湾/月亮湾/卧龙湾）" }],
        stay: "喀纳斯景区/贾登峪（精选酒店）",
        meals: { breakfast: "含", lunch: "自理", dinner: "自理" },
        tips: ["冬季喀纳斯宛如水墨画，注意保暖"]
      },
      {
        day_no: 4,
        title: "禾木玩雪 - 坐马拉爬犁 - 看璀璨星空",
        highlights: ["禾木玩雪", "马拉爬犁", "星空"],
        segments: [{ type: "experience", description: "前往禾木 → 体验马拉爬犁（可选） → 玩雪 → 夜观星空" }],
        stay: "禾木景区内（精选木屋/酒店）",
        meals: { breakfast: "含", lunch: "自理", dinner: "自理" },
        tips: ["住在景区内，方便第二天看晨雾"]
      },
      {
        day_no: 5,
        title: "魔鬼城 - 奎屯",
        highlights: ["世界魔鬼城", "雅丹地貌"],
        segments: [{ type: "sight", description: "前往乌尔禾世界魔鬼城 → 观赏雅丹地貌 → 前往奎屯" }],
        stay: "奎屯（精选舒适/豪华酒店）",
        meals: { breakfast: "含", lunch: "自理", dinner: "自理" },
        tips: ["魔鬼城日落非常出片"]
      },
      {
        day_no: 6,
        title: "乌鲁木齐送机",
        highlights: [],
        segments: [{ type: "transfer", description: "返回乌鲁木齐 → 根据航班时间送机" }],
        stay: "温馨的家",
        meals: { breakfast: "含", lunch: "自理", dinner: "自理" },
        tips: ["结束愉快的阿勒泰之旅"]
      }
    ],
    includes: [
      "门票：喀纳斯、禾木、魔鬼城一票全含",
      "交通：全程正规旅游车（S21不走回头路）",
      "住宿：5晚精选舒适/豪华酒店（含禾木景区住宿）",
      "接送：24小时免费接送机"
    ],
    excludes: [
      "用餐：正餐自理（司机可推荐美食）",
      "大交通：往返新疆机票",
      "娱乐：马拉爬犁、雪地摩托等个人消费"
    ],
    notes: [
      "冬季路况/天气影响较大，行程会在不降低体验的前提下灵活微调",
      "喀纳斯/禾木早晚更冷：手套、帽子、雪地靴、暖宝宝强烈建议",
      "行程顺序可能会根据天气/路况进行调整"
    ],
    signature: ""
  },
  "winter-8d-classic": {
    template_code: "XJ-TWINLAKES-8D7N-CLASSIC",
    title: "尊享双湖·8天7晚｜含禾木真旅拍·赛湖UTV越野·陆地头等舱",
    mode: "A",
    route_overview: "乌鲁木齐 → S21 → 阿勒泰 → 喀纳斯 → 禾木 → 乌尔禾 → 赛里木湖 → 乌鲁木齐",
    tags: ["含旅拍妆造", "赛湖UTV", "大窗雪景房", "陆地头等舱"],
    duration_days: 8,
    duration_nights: 7,
    defaults: {
      transport: "1+1陆地头等舱（带腿托+按摩座椅）",
      target_audience: "初次来疆/摄影/滑雪体验/高品质"
    },
    itinerary: [
      {
        day_no: 1,
        title: "出发地 - 乌鲁木齐（24H接机/站）",
        highlights: [],
        segments: [{ type: "transfer", description: "专车接机 → 入住【严选五钻/四钻酒店】 → 自由活动" }],
        stay: "乌鲁木齐（亚欧/温德姆或同级五钻）",
        meals: { breakfast: "自理", lunch: "自理", dinner: "自理" },
        tips: ["赠送西域公主奢享早餐体验（次日）"]
      },
      {
        day_no: 2,
        title: "乌鲁木齐 - S21沙漠公路 - 将军山落日 - 阿勒泰",
        highlights: ["S21沙漠公路", "将军山落日"],
        segments: [{ type: "sight", description: "穿越S21沙漠公路 → 赠送【将军山落日缆车】(看绝美夕阳) → 夜滑(雪票自理)" }],
        stay: "阿勒泰/布尔津（当地高标酒店）",
        meals: { breakfast: "含", lunch: "自理", dinner: "自理" },
        tips: ["将军山日落是阿勒泰的名片，非常出片"]
      },
      {
        day_no: 3,
        title: "阿勒泰 - 喀纳斯三湾 - 喀纳斯大窗雪景房",
        highlights: ["喀纳斯三湾", "雪蘑菇"],
        segments: [{ type: "sight", description: "前往喀纳斯景区 → 神仙湾/月亮湾/卧龙湾 → 入住【景区内稀缺大窗户】木屋" }],
        stay: "喀纳斯景区内（升级稀缺大窗户雪景房）",
        meals: { breakfast: "含", lunch: "自理", dinner: "自理" },
        tips: ["坐在房间阳台就能拍出北欧森林美照"]
      },
      {
        day_no: 4,
        title: "喀纳斯 - 禾木 - 吉克普林滑雪 - 篝火晚会",
        highlights: ["吉克普林滑雪", "篝火晚会"],
        segments: [{ type: "experience", description: "前往禾木 → 赠送【吉克普林初级滑雪4小时】(含雪具) → 赠送【禾木篝火晚会】" }],
        stay: "禾木景区内（升级雪景童话木屋）",
        meals: { breakfast: "含", lunch: "自理", dinner: "自理" },
        tips: ["包含雪鞋、雪板、雪杖，魔毯"]
      },
      {
        day_no: 5,
        title: "禾木晨雾 - 赠送真旅拍 - 乌尔禾",
        highlights: ["禾木晨雾", "真旅拍"],
        segments: [{ type: "experience", description: "观禾木晨雾 → 赠送【禾木真旅拍】(含妆造，6大系列任选) → 前往乌尔禾" }],
        stay: "克拉玛依/乌尔禾（严选四钻/五钻）",
        meals: { breakfast: "含", lunch: "自理", dinner: "自理" },
        tips: ["旅拍含服装、造型、精修，让你美爆朋友圈"]
      },
      {
        day_no: 6,
        title: "克拉玛依 - 赛里木湖UTV越野 - 围炉煮茶",
        highlights: ["赛湖UTV", "围炉煮茶"],
        segments: [{ type: "sight", description: "环游赛里木湖 → 赠送【UTV雪地越野车】(地形穿越) → 露台围炉煮茶" }],
        stay: "赛里木湖/博乐（升级星空房/野奢营地）",
        meals: { breakfast: "含", lunch: "自理", dinner: "自理" },
        tips: ["UTV体验非常刺激，带你深入雪原"]
      },
      {
        day_no: 7,
        title: "赛里木湖二进 - 乌鲁木齐",
        highlights: ["赛里木湖日出"],
        segments: [{ type: "sight", description: "二进赛里木湖（看日出/冰泡）→ 返回乌鲁木齐" }],
        stay: "乌鲁木齐（严选五钻/四钻酒店）",
        meals: { breakfast: "含", lunch: "自理", dinner: "自理" },
        tips: ["行程圆满结束，享用最后的西域美食"]
      },
      {
        day_no: 8,
        title: "乌鲁木齐 - 温暖的家",
        highlights: [],
        segments: [{ type: "transfer", description: "专车送机，结束愉快旅程" }],
        stay: "温暖的家",
        meals: { breakfast: "含", lunch: "自理", dinner: "自理" },
        tips: []
      }
    ],
    includes: [
       "【住宿】全程城市酒店严选三选一 + 喀纳斯/禾木景区内大窗木屋 + 赛里木湖星空房",
       "【旅拍】赠送禾木真旅拍（含妆造，6大系列主题任选）",
       "【滑雪】赠送吉克普林初级滑雪票（4小时，含雪具）",
       "【观景】赠送将军山落日缆车，看阿勒泰绝美夕阳",
       "【玩乐】赠送赛里木湖UTV雪地越野车体验 + 禾木篝火晚会",
       "【影像】配备无人机+单反（赠送20张照片+2段15s视频）",
       "【用车】1+1陆地头等舱（28-30寸行李无忧，带按摩座椅）",
       "【好礼】赠送暖宝宝、雪地百宝箱（指星笔/仙女棒）"
    ],
    excludes: ["正餐自理", "大交通", "个人消费", "单房差"],
    notes: [
       "严选标准：坚决不进购物店，纯玩无套路",
       "明星领队：全程陪玩，会拍照，好评率高",
       "特别提示：冬季新疆室内外温差大，请备好穿脱方便的衣物"
    ],
    signature: ""
  },
  "winter-8d-hemu2n": {
    template_code: "XJ-TWINLAKES-8D7N-HEMU2N",
    title: "冬日小确幸·8天7晚｜连住2晚禾木·赛里木湖蓝冰·围炉煮茶",
    mode: "A",
    route_overview: "乌鲁木齐 → S21 → 阿勒泰 → 禾木(连住2晚) → 乌尔禾 → 赛里木湖 → 乌鲁木齐",
    tags: ["连住禾木", "漫游", "蓝冰煮茶", "不进喀纳斯"],
    duration_days: 8,
    duration_nights: 7,
    defaults: {
      transport: "7座商务车/14座2+1",
      target_audience: "亲子/情侣/喜欢慢节奏/不想折腾"
    },
    itinerary: [
      {
        day_no: 1,
        title: "出发地 - 乌鲁木齐（接机服务）",
        highlights: [],
        segments: [{ type: "transfer", description: "接机 → 入住【严选四钻/五钻酒店】 → 自由活动" }],
        stay: "乌鲁木齐（严选酒店）",
        meals: { breakfast: "自理", lunch: "自理", dinner: "自理" },
        tips: ["管家服务：每日提供行程攻略"]
      },
      {
        day_no: 2,
        title: "乌鲁木齐 - S21沙漠公路 - 将军山 - 阿勒泰",
        highlights: [],
        segments: [{ type: "sight", description: "S21沙漠公路 → 赠送【将军山落日缆车】 → 夜滑(可选)" }],
        stay: "阿勒泰/布尔津",
        meals: { breakfast: "含", lunch: "自理", dinner: "自理" },
        tips: ["不走回头路，直达雪都"]
      },
      {
        day_no: 3,
        title: "阿勒泰 - 禾木（第一晚） - 篝火晚会",
        highlights: ["禾木雪景", "篝火晚会"],
        segments: [{ type: "sight", description: "途观喀纳斯三湾（不进景区，远眺）→ 入住【禾木景区内小木屋】 → 赠送【篝火晚会】" }],
        stay: "禾木景区内（童话小木屋）",
        meals: { breakfast: "含", lunch: "自理", dinner: "自理" },
        tips: ["直接住进禾木，省去换房折腾，体验慢生活"]
      },
      {
        day_no: 4,
        title: "禾木（第二晚） - 吉克普林滑雪 - 深度玩雪",
        highlights: ["吉克普林", "深度玩雪"],
        segments: [{ type: "experience", description: "全天禾木自由活动 → 赠送【吉克普林初级滑雪】 → 雪地摩托(自理) → 围炉煮茶" }],
        stay: "禾木景区内（童话小木屋）",
        meals: { breakfast: "含", lunch: "自理", dinner: "自理" },
        tips: ["连住两晚，免去收拾行李，睡到自然醒"]
      },
      {
        day_no: 5,
        title: "禾木晨雾 - 乌尔禾 - 魔鬼城",
        highlights: [],
        segments: [{ type: "free", description: "禾木晨雾 → 赠送【旅拍】(9张简修) → 下山前往乌尔禾 → 游览魔鬼城" }],
        stay: "乌尔禾/克拉玛依",
        meals: { breakfast: "含", lunch: "自理", dinner: "自理" },
        tips: ["旅拍记录美好瞬间"]
      },
      {
        day_no: 6,
        title: "乌尔禾 - 赛里木湖（360度环湖）- 蓝冰煮茶",
        highlights: ["蓝冰", "围炉煮茶"],
        segments: [{ type: "sight", description: "前往赛里木湖 → 寻找蓝冰/冰裂纹 → 赠送【蓝冰围炉煮茶】" }],
        stay: "赛里木湖/博乐（野奢营地/酒店）",
        meals: { breakfast: "含", lunch: "自理", dinner: "自理" },
        tips: ["在冰湖上喝茶，体验感拉满"]
      },
      {
        day_no: 7,
        title: "赛里木湖二进 - 乌鲁木齐",
        highlights: [],
        segments: [{ type: "sight", description: "再次进入赛里木湖（视天气）→ 返回乌鲁木齐" }],
        stay: "乌鲁木齐",
        meals: { breakfast: "含", lunch: "自理", dinner: "自理" },
        tips: []
      },
      {
        day_no: 8,
        title: "乌鲁木齐 - 送机",
        highlights: [],
        segments: [{ type: "transfer", description: "送机返程" }],
        stay: "温馨的家",
        meals: { breakfast: "含", lunch: "自理", dinner: "自理" },
        tips: ["贴心好礼：干果零食小包"]
      }
    ],
    includes: [
       "【住宿】禾木景区内连住2晚（免去进出折腾，深度体验慢生活）",
       "【独家】赛里木湖蓝冰围炉煮茶，茶香撞见冰湖之境",
       "【滑雪】赠送吉克普林初级滑雪票（含雪具）",
       "【观景】赠送将军山落日缆车 + 禾木篝火晚会",
       "【旅拍】赠送专业旅拍（含9张简修照片）",
       "【影像】无人机航拍（赠送2段15s以上视频）",
       "【服务】管家级服务，每日提供攻略，24H接送站",
       "【好礼】随车附赠干果零食包、生日小蛋糕（需提前报备）"
    ],
    excludes: ["喀纳斯门票(不进)", "正餐", "滑雪教练费"],
    notes: ["如遇大雪封路，行程将启动应急预案", "此线路主打休闲，不进喀纳斯景区"],
    signature: ""
  },
  "winter-9d": {
    template_code: "XJ-WINTER-9D8N-001",
    title: "冬恋喀禾·9天8晚｜粉雪阿勒泰·喀纳斯禾木·赛里木湖蓝冰",
    mode: "A",
    route_overview: "乌鲁木齐 → S21沙漠公路 → 乌伦古湖 → 布尔津 → 喀纳斯三湾 → 禾木 → 吉克普林滑雪 → 魔鬼城 → 赛里木湖蓝冰环湖 → 乌鲁木齐",
    tags: ["亲子", "情侣", "摄影", "冬季松弛感"],
    duration_days: 9,
    duration_nights: 8,
    defaults: {
      transport: "7座商务车/14座2+1（按人数匹配）+ 资深司机",
      target_audience: "亲子/情侣/闺蜜/摄影/小团私定（冬季松弛感拉满）"
    },
    itinerary: [
      {
        day_no: 1,
        title: "全国各地 → 乌鲁木齐：落地新疆，先把松弛感拉满",
        highlights: [],
        segments: [{ type: "transfer", description: "接机/接站 → 入住酒店 → 自由活动（推荐：国际大巴扎/夜市）" }],
        stay: "乌鲁木齐（参考：{乌市酒店} 或同级）",
        meals: { breakfast: "自理", lunch: "自理", dinner: "自理" },
        tips: ["晚到也不赶行程，当天以休整为主"]
      },
      {
        day_no: 2,
        title: "乌鲁木齐 → S21沙漠公路 → 乌伦古湖 → 布尔津",
        highlights: [],
        segments: [{ type: "sight", description: "S21沙漠高速（冬季风光）→ 乌伦古湖观景 → 抵达布尔津" }],
        stay: "布尔津（参考：{布尔津酒店} 或同级）",
        meals: { breakfast: "含", lunch: "自理", dinner: "自理" },
        tips: ["今日路程偏长，但一路景色很有“荒野电影感”"]
      },
      {
        day_no: 3,
        title: "布尔津 → 喀纳斯三湾：神仙湾·月亮湾·卧龙湾（秋冬都很绝）",
        highlights: [],
        segments: [{ type: "sight", description: "前往喀纳斯 → 三湾栈道轻徒步 → 观景打卡" }],
        stay: "喀纳斯（亮点：{喀纳斯大窗观景房/木屋同级}）",
        meals: { breakfast: "含", lunch: "自理", dinner: "自理" },
        tips: ["冬季早晚温差大，拍照建议备暖宝宝/手套"]
      },
      {
        day_no: 4,
        title: "喀纳斯 → 禾木：入住童话雪村 + 吉克普林滑雪（可选强度）",
        highlights: [],
        segments: [{ type: "experience", description: "喀纳斯 → 禾木 → 吉克普林滑雪/玩雪（初学友好，可请教练）" }],
        stay: "禾木（亮点：{禾木小木屋大窗户户型/同级}）",
        meals: { breakfast: "含", lunch: "自理", dinner: "自理" },
        tips: ["滑雪是可选模块，不滑雪也能在禾木慢慢拍、慢慢玩"]
      },
      {
        day_no: 5,
        title: "禾木：日出晨雾 + 自由活动（最治愈的一天）",
        highlights: [],
        segments: [{ type: "free", description: "禾木观景台日出 → 村落漫步 → 咖啡/围炉/雪地拍照 → 下午前往布尔津" }],
        stay: "布尔津（参考：{布尔津酒店} 或同级）",
        meals: { breakfast: "含", lunch: "自理", dinner: "自理" },
        tips: ["这天安排“留白”，体验感会明显更高级"]
      },
      {
        day_no: 6,
        title: "布尔津 → 乌尔禾世界魔鬼城 → 奎屯",
        highlights: [],
        segments: [{ type: "sight", description: "前往乌尔禾 → 魔鬼城（日落非常出片）→ 奎屯" }],
        stay: "奎屯（参考：{奎屯酒店} 或同级）",
        meals: { breakfast: "含", lunch: "自理", dinner: "自理" },
        tips: ["魔鬼城风大，帽子围巾要带好"]
      },
      {
        day_no: 7,
        title: "奎屯 → 赛里木湖：限定蓝冰 + 环湖自驾",
        highlights: [],
        segments: [{ type: "sight", description: "前往赛里木湖 → 蓝冰/冰泡/冰裂纹打卡 → 环湖自驾（按路况）" }],
        stay: "赛湖景区门口/清水河（参考：{赛湖酒店} 或同级）",
        meals: { breakfast: "含", lunch: "自理", dinner: "自理" },
        tips: ["赛湖体感更冷，建议羽绒+雪地靴"]
      },
      {
        day_no: 8,
        title: "赛里木湖 →（可选独山子大峡谷）→ 乌鲁木齐",
        highlights: [],
        segments: [{ type: "transfer", description: "赛湖出发 → 可选独山子大峡谷（按季节开放与路况）→ 返回乌鲁木齐" }],
        stay: "乌鲁木齐（参考：{乌市酒店} 或同级）",
        meals: { breakfast: "含", lunch: "自理", dinner: "自理" },
        tips: ["这天为回程缓冲日，避免赶飞机太累"]
      },
      {
        day_no: 9,
        title: "乌鲁木齐 → 送机/送站：带着新疆的雪景回家",
        highlights: [],
        segments: [{ type: "transfer", description: "根据航班/车次时间送机/送站" }],
        stay: "温馨的家",
        meals: { breakfast: "含", lunch: "自理", dinner: "自理" },
        tips: []
      }
    ],
    includes: [
      "用车：全程商务车/旅游车（按人数匹配）+ 油费/过路费/停车费",
      "接送：乌鲁木齐接送机/站",
      "门票：{禾木/喀纳斯/赛里木湖/魔鬼城（按你实际包含勾选）}",
      "赠送：{滑雪票4小时初级（按你的实际产品）}",
      "保险：旅游意外险（可选/含）"
    ],
    excludes: [
      "酒店住宿费用（可代订/可按档位打包）",
      "用餐（除行程标注含早）",
      "景区内娱乐项目：雪地摩托/马拉雪橇/表演/教练等",
      "个人消费及不可抗力产生的额外费用"
    ],
    notes: [
      "冬季路况/天气影响较大，行程会在不降低体验的前提下灵活微调",
      "喀纳斯/禾木早晚更冷：手套、帽子、雪地靴、暖宝宝强烈建议",
      "滑雪/冰面活动请务必遵守安全提示（可协助安排教练）"
    ],
    signature: ""
  },
  "autumn-10d": {
    template_code: "XJ-AUTUMN-10D9N-001",
    title: "秋季北疆大环线 10天9晚｜湖泊草原森林一次看够",
    mode: "A",
    route_overview: "乌鲁木齐 → 可可托海 → 布尔津 → 禾木 → 喀纳斯 → 乌尔禾魔鬼城 → 赛里木湖 → 伊宁 → 那拉提 → 独库公路 → 乌鲁木齐",
    tags: ["摄影", "情侣", "亲子", "小团私定"],
    duration_days: 10,
    duration_nights: 9,
    defaults: {
      transport: "7座商务车/14座2+1（按人数匹配）",
      target_audience: "摄影/情侣/亲子/小团私定"
    },
    itinerary: [
      {
        day_no: 1,
        title: "抵达乌鲁木齐 · 接机入住",
        highlights: [],
        segments: [{ type: "transfer", description: "接机 → 入住酒店 → 自由活动" }],
        stay: "乌鲁木齐（{乌市酒店}）",
        meals: { breakfast: "自理", lunch: "自理", dinner: "自理" },
        tips: []
      },
      {
        day_no: 2,
        title: "乌鲁木齐 → 可可托海（秋色天花板）",
        highlights: ["白桦林", "峡谷秋色"],
        segments: [{ type: "sight", description: "前往可可托海风景区 → 额尔齐斯大峡谷" }],
        stay: "富蕴/可可托海（{酒店}）",
        meals: { breakfast: "含", lunch: "自理", dinner: "自理" },
        tips: []
      },
      {
        day_no: 3,
        title: "可可托海 → 布尔津（童话小城）",
        highlights: ["额尔齐斯河畔日落"],
        segments: [{ type: "sight", description: "游览五彩滩（可选） → 抵达布尔津" }],
        stay: "布尔津（{酒店}）",
        meals: { breakfast: "含", lunch: "自理", dinner: "自理" },
        tips: []
      },
      {
        day_no: 4,
        title: "布尔津 → 禾木（进入童话世界）",
        highlights: ["禾木村落", "木屋", "白桦林"],
        segments: [{ type: "sight", description: "前往禾木 → 禾木桥 → 白桦林漫步" }],
        stay: "禾木（{小木屋/同级}）",
        meals: { breakfast: "含", lunch: "自理", dinner: "自理" },
        tips: []
      },
      {
        day_no: 5,
        title: "禾木 → 喀纳斯（三湾秋色）",
        highlights: ["神仙湾", "月亮湾", "卧龙湾"],
        segments: [{ type: "sight", description: "禾木晨雾 → 前往喀纳斯 → 游览三湾" }],
        stay: "喀纳斯（{观景房/同级}）",
        meals: { breakfast: "含", lunch: "自理", dinner: "自理" },
        tips: []
      },
      {
        day_no: 6,
        title: "喀纳斯 → 乌尔禾（魔鬼城）",
        highlights: ["雅丹地貌", "日落"],
        segments: [{ type: "sight", description: "喀纳斯观鱼台（可选） → 乌尔禾魔鬼城" }],
        stay: "克拉玛依/乌尔禾（{酒店}）",
        meals: { breakfast: "含", lunch: "自理", dinner: "自理" },
        tips: []
      },
      {
        day_no: 7,
        title: "乌尔禾 → 赛里木湖（蓝宝石湖）",
        highlights: ["环湖自驾", "草原湖岸"],
        segments: [{ type: "sight", description: "前往赛里木湖 → 深度环湖游览" }],
        stay: "赛湖/清水河（{酒店}）",
        meals: { breakfast: "含", lunch: "自理", dinner: "自理" },
        tips: []
      },
      {
        day_no: 8,
        title: "赛里木湖 → 伊宁（薰衣草/六星街）",
        highlights: ["城市慢生活", "美食"],
        segments: [{ type: "sight", description: "果子沟大桥（途观） → 薰衣草庄园（季节）→ 伊宁六星街" }],
        stay: "伊宁（{酒店}）",
        meals: { breakfast: "含", lunch: "自理", dinner: "自理" },
        tips: []
      },
      {
        day_no: 9,
        title: "伊宁 → 那拉提（空中草原）",
        highlights: ["草原秋色", "木栈道"],
        segments: [{ type: "sight", description: "前往那拉提草原 → 空中草原/河谷草原" }],
        stay: "那拉提（{酒店}）",
        meals: { breakfast: "含", lunch: "自理", dinner: "自理" },
        tips: []
      },
      {
        day_no: 10,
        title: "那拉提 → 乌鲁木齐（独库开通则走独库）",
        highlights: [],
        segments: [{ type: "transfer", description: "方案A：独库公路返回；方案B：走高速返回 → 送机" }],
        stay: "温暖的家",
        meals: { breakfast: "含", lunch: "自理", dinner: "自理" },
        tips: []
      }
    ],
    includes: [
       "用车：全程旅游包车+油费+过路费",
       "住宿：全程精选酒店/民宿",
       "门票：行程所列首道大门票",
       "保险：旅行意外险"
    ],
    excludes: [
       "大交通：往返新疆机票/火车票",
       "用餐：正餐自理",
       "娱乐项目及个人消费"
    ],
    notes: [
       "独库公路受天气影响大，如未开通需绕行",
       "秋季新疆景色短暂，建议提前预订"
    ],
    signature: ""
  }
};
