
import { AppData, Gender, Surname } from './types';

// Top 5 surnames with rich data
const RICH_SURNAMES: Surname[] = [
    {
      id: 's_huang',
      name: '黄',
      origin: '出自嬴姓，以国名为氏。',
      junwangs: [
        { name: '江夏郡', region: '湖北云梦', description: '汉高帝置。' }
      ],
      tanghao: [
        { id: 't_jiangxia', name: '江夏堂', region: '湖北', year: '汉代', origin: '源自郡望', couplet: '江夏世泽，颖川家声' }
      ]
    },
    {
      id: 's_jiang',
      name: '姜',
      origin: '源于炎帝神农氏，兴于封神姜子牙。',
      junwangs: [{ name: '天水郡', region: '甘肃', description: '汉代置。' }],
      tanghao: [{ id: 't_tianshui', name: '天水堂', region: '甘肃', year: '汉代', origin: '源自郡望', couplet: '天水世泽，尚父家声' }]
    },
    {
      id: 's_zhang_ch',
      name: '章',
      origin: '出自姜姓，以封国名为氏。',
      junwangs: [{ name: '河间郡', region: '河北', description: '汉代置。' }],
      tanghao: [{ id: 't_hejian', name: '河间堂', region: '河北', year: '汉代', origin: '源自郡望', couplet: '河间世泽，大雅家声' }]
    },
    {
       id: 's_xiang',
       name: '向',
       origin: '出自祁姓，以国名为氏。',
       junwangs: [{ name: '河南郡', region: '河南', description: '秦代置。' }],
       tanghao: [{ id: 't_henan', name: '河南堂', region: '河南', year: '秦代', origin: '源自郡望', couplet: '河南世泽，向国家声' }]
    }
];

// String containing top ~500 common Chinese surnames (Keeping the original list for completeness)
const COMMON_SURNAMES_STR = `
杨赵周吴徐孙胡朱高林何郭马罗梁宋郑谢韩唐冯于董萧程曹袁邓许傅沈曾彭吕苏卢蒋蔡贾丁魏薛叶阎余潘杜戴夏钟汪田任范方石姚谭廖邹熊金陆郝孔白崔康毛邱秦江史顾侯邵孟龙万段雷钱汤尹黎易常武乔贺赖龚文庞樊兰殷施陶洪翟安颜倪严牛温芦季俞鲁葛伍韦申尤毕聂丛焦向柳邢路岳齐沿梅莫庄辛管祝左涂谷祁时舒耿牟卜詹关苗凌费纪靳盛童欧甄曲成游阳裴席卫查屈鲍位覃霍翁隋植甘景薄单包司柏宁柯阮桂闵解强柴华车冉房边辜吉饶刁瞿戚丘古米池滕晋苑邬臧畅宫来苟全褚廉简娄盖符奚木穆党燕郎邸冀谈姬屠连郜晏栾郁商蒙计喻揭窦迟宇敖糜隗宓蓬郗班仰秋仲伊
宫宁仇栾暴甘钭厉戎祖武符刘景詹束龙叶幸司韶郜黎蓟薄印宿白怀蒲台从鄂索咸籍赖卓蔺屠蒙池乔阴郁胥能苍双闻莘党翟谭贡劳逄姬申扶堵冉宰郦雍郤璩桑桂濮牛寿通边扈燕冀郟浦尚农温别庄晏柴瞿阎充慕连茹习宦艾鱼容向古易慎戈廖庾终暨居衡步都耿满弘匡国文寇广禄阙东欧沃利蔚越夔隆师巩厍聂晁勾敖融冷訾辛阚那简饶空曾毋沙乜养鞠须丰巢关蒯相查后荆红游竺权逯盖益桓公晋楚闫法汝鄢涂钦归海岳帅缑亢况后有琴商牟佘佴伯赏墨哈谯笪年爱阳佟言福
`.replace(/\s/g, '');

const EXISTING_NAMES = new Set(RICH_SURNAMES.map(s => s.name));

// Generate basic entries for remaining surnames
const BASIC_SURNAMES: Surname[] = Array.from(new Set(COMMON_SURNAMES_STR.split('')))
  .filter(char => !EXISTING_NAMES.has(char))
  .map((name, index) => ({
    id: `s_auto_${index}`,
    name: name,
    origin: `${name}姓，中华常见姓氏之一。`,
    junwangs: [],
    tanghao: []
  }));

const ALL_SURNAMES = [...RICH_SURNAMES, ...BASIC_SURNAMES];

export const INITIAL_DATA: AppData = {
  surnames: ALL_SURNAMES,
  families: [
    {
      id: 'f_huang_jiangxia',
      name: '江夏黄氏',
      surnameId: 's_huang',
      tanghaoId: 't_jiangxia',
      founder: '黄香',
      origin: '湖北江夏',
      description: '江夏黄氏，天下黄姓第一大支，以“天下无双”黄香为始祖。黄香以孝道闻名天下，为二十四孝之一“扇枕温衾”的主角。',
      creatorId: 'sys_admin',
      zibei: '金水木土火，世德永流传。文章华国业，忠孝传家宝。',
      motto: '孝悌忠信，礼义廉耻。读书明理，勤俭持家。',
      migration: '始祖香公居江夏。唐末，部分族人随王潮、王审知入闽。宋元时期，分支迁往广东、江西等地。',
      events: [
        { year: '汉代', title: '黄香封侯', description: '始祖黄香任尚书令，以孝廉闻名。' },
        { year: '唐代', title: '入闽始祖', description: '黄氏先祖随军入福建，定居莆田。' },
        { year: '1930', title: '修谱', description: '在宗祠进行第十二次大修谱。' }
      ]
    },
    // External Families for Spouses
    {
        id: 'f_jiang_tianshui',
        name: '天水姜氏',
        surnameId: 's_jiang',
        tanghaoId: 't_tianshui',
        founder: '姜维',
        origin: '甘肃天水',
        description: '外家族：姜珮瑶所属家族。',
        creatorId: 'sys_admin'
    },
    {
        id: 'f_zhang_hejian',
        name: '河间章氏',
        surnameId: 's_zhang_ch',
        tanghaoId: 't_hejian',
        founder: '章邯',
        origin: '河北河间',
        description: '外家族：章若楠所属家族。',
        creatorId: 'sys_admin'
    },
    {
        id: 'f_xiang_henan',
        name: '河南向氏',
        surnameId: 's_xiang',
        tanghaoId: 't_henan',
        founder: '向秀',
        origin: '河南',
        description: '外家族：向涵之所属家族。',
        creatorId: 'sys_admin'
    }
  ],
  members: [
    // Generation 1: Ancestor (Generic)
    {
      id: 'm_huang_zu',
      familyId: 'f_huang_jiangxia',
      name: '黄公',
      gender: Gender.Male,
      generation: 20,
      fatherId: null,
      motherId: null,
      spouseIds: [],
      birthDate: '1930-01-01',
      bio: '家族长辈',
      photo: 'https://picsum.photos/id/1005/100/100'
    },
    // Generation 2: The Protagonist
    {
      id: 'm_huang_jiancheng',
      familyId: 'f_huang_jiangxia',
      name: '黄建成',
      gender: Gender.Male,
      generation: 21,
      fatherId: 'm_huang_zu',
      motherId: null,
      spouseIds: ['m_jiang_peiyao', 'm_zhang_ruonan', 'm_xiang_hanzhi'],
      birthDate: '1960-05-20',
      bio: '家族族长，事业有成，多子多福。',
      photo: 'https://picsum.photos/id/1012/100/100'
    },
    // Spouses (External Families)
    {
        id: 'm_jiang_peiyao',
        familyId: 'f_jiang_tianshui',
        name: '姜珮瑶',
        gender: Gender.Female,
        generation: 21,
        spouseIds: ['m_huang_jiancheng'],
        birthDate: '1962-03-15',
        bio: '黄建成元配，温婉贤淑。',
        photo: 'https://picsum.photos/id/1011/100/100'
    },
    {
        id: 'm_zhang_ruonan',
        familyId: 'f_zhang_hejian',
        name: '章若楠',
        gender: Gender.Female,
        generation: 21,
        spouseIds: ['m_huang_jiancheng'],
        birthDate: '1965-07-22',
        bio: '黄建成二房，才貌双全。',
        photo: 'https://picsum.photos/id/1027/100/100'
    },
    {
        id: 'm_xiang_hanzhi',
        familyId: 'f_xiang_henan',
        name: '向涵之',
        gender: Gender.Female,
        generation: 21,
        spouseIds: ['m_huang_jiancheng'],
        birthDate: '1968-11-11',
        bio: '黄建成三房，机智聪慧。',
        photo: 'https://picsum.photos/id/1025/100/100'
    },

    // Generation 3: Children
    // Children of Jiang Peiyao
    {
        id: 'm_huang_a',
        familyId: 'f_huang_jiangxia',
        name: '黄伯文',
        gender: Gender.Male,
        generation: 22,
        fatherId: 'm_huang_jiancheng',
        motherId: 'm_jiang_peiyao',
        spouseIds: [],
        birthDate: '1982-01-01',
        bio: '姜氏所生长子。',
        photo: 'https://picsum.photos/id/1050/100/100'
    },
    {
        id: 'm_huang_b',
        familyId: 'f_huang_jiangxia',
        name: '黄仲武',
        gender: Gender.Male,
        generation: 22,
        fatherId: 'm_huang_jiancheng',
        motherId: 'm_jiang_peiyao',
        spouseIds: [],
        birthDate: '1984-02-02',
        bio: '姜氏所生次子。',
        photo: 'https://picsum.photos/id/1051/100/100'
    },
    {
        id: 'm_huang_c',
        familyId: 'f_huang_jiangxia',
        name: '黄季兰',
        gender: Gender.Female,
        generation: 22,
        fatherId: 'm_huang_jiancheng',
        motherId: 'm_jiang_peiyao',
        spouseIds: [],
        birthDate: '1986-03-03',
        bio: '姜氏所生长女。',
        photo: 'https://picsum.photos/id/1052/100/100'
    },

    // Children of Zhang Ruonan
    {
        id: 'm_huang_d',
        familyId: 'f_huang_jiangxia',
        name: '黄叔贤',
        gender: Gender.Male,
        generation: 22,
        fatherId: 'm_huang_jiancheng',
        motherId: 'm_zhang_ruonan',
        spouseIds: [],
        birthDate: '1988-04-04',
        bio: '章氏所生长子。',
        photo: 'https://picsum.photos/id/1053/100/100'
    },
    {
        id: 'm_huang_e',
        familyId: 'f_huang_jiangxia',
        name: '黄婉儿',
        gender: Gender.Female,
        generation: 22,
        fatherId: 'm_huang_jiancheng',
        motherId: 'm_zhang_ruonan',
        spouseIds: [],
        birthDate: '1990-05-05',
        bio: '章氏所生长女。',
        photo: 'https://picsum.photos/id/1054/100/100'
    },
    {
        id: 'm_huang_f',
        familyId: 'f_huang_jiangxia',
        name: '黄季德',
        gender: Gender.Male,
        generation: 22,
        fatherId: 'm_huang_jiancheng',
        motherId: 'm_zhang_ruonan',
        spouseIds: [],
        birthDate: '1992-06-06',
        bio: '章氏所生次子。',
        photo: 'https://picsum.photos/id/1055/100/100'
    },

    // Children of Xiang Hanzhi
    {
        id: 'm_huang_g',
        familyId: 'f_huang_jiangxia',
        name: '黄幼安',
        gender: Gender.Male,
        generation: 22,
        fatherId: 'm_huang_jiancheng',
        motherId: 'm_xiang_hanzhi',
        spouseIds: [],
        birthDate: '1994-07-07',
        bio: '向氏所生长子。',
        photo: 'https://picsum.photos/id/1056/100/100'
    },
    {
        id: 'm_huang_h',
        familyId: 'f_huang_jiangxia',
        name: '黄幼薇',
        gender: Gender.Female,
        generation: 22,
        fatherId: 'm_huang_jiancheng',
        motherId: 'm_xiang_hanzhi',
        spouseIds: [],
        birthDate: '1996-08-08',
        bio: '向氏所生长女。',
        photo: 'https://picsum.photos/id/1057/100/100'
    },
    {
        id: 'm_huang_i',
        familyId: 'f_huang_jiangxia',
        name: '黄幼敏',
        gender: Gender.Female,
        generation: 22,
        fatherId: 'm_huang_jiancheng',
        motherId: 'm_xiang_hanzhi',
        spouseIds: [],
        birthDate: '1998-09-09',
        bio: '向氏所生幼女。',
        photo: 'https://picsum.photos/id/1058/100/100'
    }
  ]
};
