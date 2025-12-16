
import { AppData, Gender, Surname } from './types';

// Top surnames with rich data
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
      id: 's_zhang',
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
    },
    {
       id: 's_yang',
       name: '杨',
       origin: '出自姬姓，以国名为氏。',
       junwangs: [{ name: '弘农郡', region: '河南灵宝', description: '西汉元鼎四年置。' }],
       tanghao: [{ id: 't_hongnong', name: '弘农堂', region: '河南', year: '汉代', origin: '源自郡望', couplet: '关西世泽，四知家声' }]
    },
    {
       id: 's_zhao',
       name: '赵',
       origin: '出自嬴姓，以国名为氏。',
       junwangs: [{ name: '天水郡', region: '甘肃', description: '汉代置。' }],
       tanghao: [{ id: 't_tianshui_zhao', name: '天水堂', region: '甘肃', year: '汉代', origin: '源自郡望', couplet: '天水世泽，半部家声' }]
    },
    {
       id: 's_li',
       name: '李',
       origin: '出自嬴姓，为颛顼帝高阳氏之后。',
       junwangs: [{ name: '陇西郡', region: '甘肃', description: '秦代置。' }],
       tanghao: [{ id: 't_longxi', name: '陇西堂', region: '甘肃', year: '秦代', origin: '源自郡望', couplet: '陇西世泽，道德家声' }]
    },
    {
       id: 's_zhuang',
       name: '庄',
       origin: '源于芈姓，楚庄王之后。',
       junwangs: [{ name: '天水郡', region: '甘肃', description: '汉代置。' }],
       tanghao: [{ id: 't_jinyu', name: '锦绣堂', region: '未知', year: '未知', origin: '源自典故', couplet: '锦绣世泽，因为家声' }]
    },
    {
       id: 's_wang',
       name: '王',
       origin: '出自姬姓，周文王第十五子毕公高之后。',
       junwangs: [
           { name: '琅琊郡', region: '山东', description: '秦代置。' },
           { name: '太原郡', region: '山西', description: '秦代置。' }
       ],
       tanghao: [
           { id: 't_langya', name: '琅琊堂', region: '山东', year: '秦代', origin: '源自郡望', couplet: '琅琊世泽，三槐家声' },
           { id: 't_taiyuan', name: '太原堂', region: '山西', year: '秦代', origin: '源自郡望', couplet: '太原世泽，两晋家声' }
       ]
    },
    {
       id: 's_zhang_common',
       name: '张',
       origin: '出自姬姓，黄帝赐姓。',
       junwangs: [{ name: '清河郡', region: '河北', description: '汉代置。' }],
       tanghao: [{ id: 't_qinghe', name: '清河堂', region: '河北', year: '汉代', origin: '源自郡望', couplet: '清河世泽，百忍家声' }]
    }
];

// String containing top ~500 common Chinese surnames
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
    { id: 'f_jiang_tianshui', name: '天水姜氏', surnameId: 's_jiang', tanghaoId: 't_tianshui', founder: '姜维', origin: '甘肃天水', description: '外家族：姜珮瑶所属家族。', creatorId: 'sys_admin' },
    { id: 'f_zhang_hejian', name: '河间章氏', surnameId: 's_zhang', tanghaoId: 't_hejian', founder: '章邯', origin: '河北河间', description: '外家族：章若楠所属家族。', creatorId: 'sys_admin' },
    { id: 'f_xiang_henan', name: '河南向氏', surnameId: 's_xiang', tanghaoId: 't_henan', founder: '向秀', origin: '河南', description: '外家族：向涵之所属家族。', creatorId: 'sys_admin' },
    // New External Families
    { id: 'f_yang_hongnong', name: '弘农杨氏', surnameId: 's_yang', tanghaoId: 't_hongnong', founder: '杨震', origin: '河南弘农', description: '外家族：杨舒予所属家族。', creatorId: 'sys_admin' },
    { id: 'f_zhao_tianshui', name: '天水赵氏', surnameId: 's_zhao', tanghaoId: 't_tianshui_zhao', founder: '赵充国', origin: '甘肃天水', description: '外家族：赵悦丞所属家族。', creatorId: 'sys_admin' },
    { id: 'f_li_longxi', name: '陇西李氏', surnameId: 's_li', tanghaoId: 't_longxi', founder: '李信', origin: '甘肃陇西', description: '外家族：李芊润所属家族。', creatorId: 'sys_admin' },
    { id: 'f_zhuang_tianshui', name: '天水庄氏', surnameId: 's_zhuang', tanghaoId: 't_jinyu', founder: '庄周', origin: '甘肃天水', description: '外家族：庄宇珊所属家族。', creatorId: 'sys_admin' },
    { id: 'f_wang_langya', name: '琅琊王氏', surnameId: 's_wang', tanghaoId: 't_langya', founder: '王剪', origin: '山东琅琊', description: '外家族：王添艺所属家族。', creatorId: 'sys_admin' },
    { id: 'f_wang_taiyuan', name: '太原王氏', surnameId: 's_wang', tanghaoId: 't_taiyuan', founder: '王翦', origin: '山西太原', description: '外家族：王澜静所属家族。', creatorId: 'sys_admin' },
    { id: 'f_zhang_qinghe', name: '清河张氏', surnameId: 's_zhang_common', tanghaoId: 't_qinghe', founder: '张良', origin: '河北清河', description: '外家族：张雨霏所属家族。', creatorId: 'sys_admin' },
  ],
  members: [
    // Generation 1: Ancestor
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
      spouseIds: [
          'm_jiang_peiyao', 'm_zhang_ruonan', 'm_xiang_hanzhi', 
          'm_yang_shuyu', 'm_zhao_yuecheng', 'm_li_qianrun', 
          'm_zhuang_yushan', 'm_wang_tianyi', 'm_wang_lanjing', 'm_zhang_yufei'
      ],
      birthDate: '1960-05-20',
      bio: '家族族长，事业有成，家族兴旺，十全十美。',
      photo: 'https://picsum.photos/id/1012/100/100'
    },
    // --- Original Spouses ---
    { id: 'm_jiang_peiyao', familyId: 'f_jiang_tianshui', name: '姜珮瑶', gender: Gender.Female, generation: 21, spouseIds: ['m_huang_jiancheng'], birthDate: '1962-03-15', bio: '元配，温婉贤淑。', photo: 'https://picsum.photos/id/1011/100/100' },
    { id: 'm_zhang_ruonan', familyId: 'f_zhang_hejian', name: '章若楠', gender: Gender.Female, generation: 21, spouseIds: ['m_huang_jiancheng'], birthDate: '1965-07-22', bio: '二房，才貌双全。', photo: 'https://picsum.photos/id/1027/100/100' },
    { id: 'm_xiang_hanzhi', familyId: 'f_xiang_henan', name: '向涵之', gender: Gender.Female, generation: 21, spouseIds: ['m_huang_jiancheng'], birthDate: '1968-11-11', bio: '三房，机智聪慧。', photo: 'https://picsum.photos/id/1025/100/100' },
    
    // --- New Spouses ---
    { id: 'm_yang_shuyu', familyId: 'f_yang_hongnong', name: '杨舒予', gender: Gender.Female, generation: 21, spouseIds: ['m_huang_jiancheng'], birthDate: '1970-01-01', bio: '四房，弘农杨氏大家闺秀。', photo: 'https://picsum.photos/id/201/100/100' },
    { id: 'm_zhao_yuecheng', familyId: 'f_zhao_tianshui', name: '赵悦丞', gender: Gender.Female, generation: 21, spouseIds: ['m_huang_jiancheng'], birthDate: '1972-02-02', bio: '五房，天水赵氏，知书达理。', photo: 'https://picsum.photos/id/202/100/100' },
    { id: 'm_li_qianrun', familyId: 'f_li_longxi', name: '李芊润', gender: Gender.Female, generation: 21, spouseIds: ['m_huang_jiancheng'], birthDate: '1974-03-03', bio: '六房，陇西李氏，端庄大方。', photo: 'https://picsum.photos/id/203/100/100' },
    { id: 'm_zhuang_yushan', familyId: 'f_zhuang_tianshui', name: '庄宇珊', gender: Gender.Female, generation: 21, spouseIds: ['m_huang_jiancheng'], birthDate: '1976-04-04', bio: '七房，活泼开朗。', photo: 'https://picsum.photos/id/204/100/100' },
    { id: 'm_wang_tianyi', familyId: 'f_wang_langya', name: '王添艺', gender: Gender.Female, generation: 21, spouseIds: ['m_huang_jiancheng'], birthDate: '1978-05-05', bio: '八房，琅琊王氏，多才多艺。', photo: 'https://picsum.photos/id/206/100/100' },
    { id: 'm_wang_lanjing', familyId: 'f_wang_taiyuan', name: '王澜静', gender: Gender.Female, generation: 21, spouseIds: ['m_huang_jiancheng'], birthDate: '1980-06-06', bio: '九房，太原王氏，静如处子。', photo: 'https://picsum.photos/id/208/100/100' },
    { id: 'm_zhang_yufei', familyId: 'f_zhang_qinghe', name: '张雨霏', gender: Gender.Female, generation: 21, spouseIds: ['m_huang_jiancheng'], birthDate: '1982-07-07', bio: '十房，清河张氏，英姿飒爽。', photo: 'https://picsum.photos/id/209/100/100' },

    // --- Children (Original) ---
    // Jiang Peiyao's Children
    { id: 'm_huang_a', familyId: 'f_huang_jiangxia', name: '黄伯文', gender: Gender.Male, generation: 22, fatherId: 'm_huang_jiancheng', motherId: 'm_jiang_peiyao', spouseIds: [], birthDate: '1982-01-01', bio: '姜氏长子', photo: 'https://picsum.photos/id/1050/100/100' },
    { id: 'm_huang_b', familyId: 'f_huang_jiangxia', name: '黄仲武', gender: Gender.Male, generation: 22, fatherId: 'm_huang_jiancheng', motherId: 'm_jiang_peiyao', spouseIds: [], birthDate: '1984-02-02', bio: '姜氏次子', photo: 'https://picsum.photos/id/1051/100/100' },
    { id: 'm_huang_c', familyId: 'f_huang_jiangxia', name: '黄季兰', gender: Gender.Female, generation: 22, fatherId: 'm_huang_jiancheng', motherId: 'm_jiang_peiyao', spouseIds: [], birthDate: '1986-03-03', bio: '姜氏长女', photo: 'https://picsum.photos/id/1052/100/100' },
    // Zhang Ruonan's Children
    { id: 'm_huang_d', familyId: 'f_huang_jiangxia', name: '黄叔贤', gender: Gender.Male, generation: 22, fatherId: 'm_huang_jiancheng', motherId: 'm_zhang_ruonan', spouseIds: [], birthDate: '1988-04-04', bio: '章氏长子', photo: 'https://picsum.photos/id/1053/100/100' },
    { id: 'm_huang_e', familyId: 'f_huang_jiangxia', name: '黄婉儿', gender: Gender.Female, generation: 22, fatherId: 'm_huang_jiancheng', motherId: 'm_zhang_ruonan', spouseIds: [], birthDate: '1990-05-05', bio: '章氏长女', photo: 'https://picsum.photos/id/1054/100/100' },
    { id: 'm_huang_f', familyId: 'f_huang_jiangxia', name: '黄季德', gender: Gender.Male, generation: 22, fatherId: 'm_huang_jiancheng', motherId: 'm_zhang_ruonan', spouseIds: [], birthDate: '1992-06-06', bio: '章氏次子', photo: 'https://picsum.photos/id/1055/100/100' },
    // Xiang Hanzhi's Children
    { id: 'm_huang_g', familyId: 'f_huang_jiangxia', name: '黄幼安', gender: Gender.Male, generation: 22, fatherId: 'm_huang_jiancheng', motherId: 'm_xiang_hanzhi', spouseIds: [], birthDate: '1994-07-07', bio: '向氏长子', photo: 'https://picsum.photos/id/1056/100/100' },
    { id: 'm_huang_h', familyId: 'f_huang_jiangxia', name: '黄幼薇', gender: Gender.Female, generation: 22, fatherId: 'm_huang_jiancheng', motherId: 'm_xiang_hanzhi', spouseIds: [], birthDate: '1996-08-08', bio: '向氏长女', photo: 'https://picsum.photos/id/1057/100/100' },
    { id: 'm_huang_i', familyId: 'f_huang_jiangxia', name: '黄幼敏', gender: Gender.Female, generation: 22, fatherId: 'm_huang_jiancheng', motherId: 'm_xiang_hanzhi', spouseIds: [], birthDate: '1998-09-09', bio: '向氏次女', photo: 'https://picsum.photos/id/1058/100/100' },

    // --- Children (New Spouses) ---
    // Yang Shuyu (杨舒予) - Theme: Virtue (舒/Shu)
    { id: 'c_yang_1', familyId: 'f_huang_jiangxia', name: '黄舒仁', gender: Gender.Male, generation: 22, fatherId: 'm_huang_jiancheng', motherId: 'm_yang_shuyu', spouseIds: [], birthDate: '1995-01-01', bio: '杨氏所生长子', photo: 'https://picsum.photos/id/301/100/100' },
    { id: 'c_yang_2', familyId: 'f_huang_jiangxia', name: '黄舒义', gender: Gender.Male, generation: 22, fatherId: 'm_huang_jiancheng', motherId: 'm_yang_shuyu', spouseIds: [], birthDate: '1996-01-01', bio: '杨氏所生次子', photo: 'https://picsum.photos/id/302/100/100' },
    { id: 'c_yang_3', familyId: 'f_huang_jiangxia', name: '黄舒雅', gender: Gender.Female, generation: 22, fatherId: 'm_huang_jiancheng', motherId: 'm_yang_shuyu', spouseIds: [], birthDate: '1997-01-01', bio: '杨氏所生长女', photo: 'https://picsum.photos/id/303/100/100' },

    // Zhao Yuecheng (赵悦丞) - Theme: Joy (悦/Yue)
    { id: 'c_zhao_1', familyId: 'f_huang_jiangxia', name: '黄悦风', gender: Gender.Male, generation: 22, fatherId: 'm_huang_jiancheng', motherId: 'm_zhao_yuecheng', spouseIds: [], birthDate: '1996-02-01', bio: '赵氏所生长子', photo: 'https://picsum.photos/id/304/100/100' },
    { id: 'c_zhao_2', familyId: 'f_huang_jiangxia', name: '黄悦颂', gender: Gender.Male, generation: 22, fatherId: 'm_huang_jiancheng', motherId: 'm_zhao_yuecheng', spouseIds: [], birthDate: '1997-02-01', bio: '赵氏所生次子', photo: 'https://picsum.photos/id/305/100/100' },
    { id: 'c_zhao_3', familyId: 'f_huang_jiangxia', name: '黄悦心', gender: Gender.Female, generation: 22, fatherId: 'm_huang_jiancheng', motherId: 'm_zhao_yuecheng', spouseIds: [], birthDate: '1998-02-01', bio: '赵氏所生长女', photo: 'https://picsum.photos/id/306/100/100' },

    // Li Qianrun (李芊润) - Theme: Nature/Moisture (润/Run)
    { id: 'c_li_1', familyId: 'f_huang_jiangxia', name: '黄润泽', gender: Gender.Male, generation: 22, fatherId: 'm_huang_jiancheng', motherId: 'm_li_qianrun', spouseIds: [], birthDate: '1997-03-01', bio: '李氏所生长子', photo: 'https://picsum.photos/id/307/100/100' },
    { id: 'c_li_2', familyId: 'f_huang_jiangxia', name: '黄润东', gender: Gender.Male, generation: 22, fatherId: 'm_huang_jiancheng', motherId: 'm_li_qianrun', spouseIds: [], birthDate: '1998-03-01', bio: '李氏所生次子', photo: 'https://picsum.photos/id/308/100/100' },
    { id: 'c_li_3', familyId: 'f_huang_jiangxia', name: '黄芊芊', gender: Gender.Female, generation: 22, fatherId: 'm_huang_jiancheng', motherId: 'm_li_qianrun', spouseIds: [], birthDate: '1999-03-01', bio: '李氏所生长女', photo: 'https://picsum.photos/id/309/100/100' },

    // Zhuang Yushan (庄宇珊) - Theme: Universe (宇/Yu)
    { id: 'c_zhuang_1', familyId: 'f_huang_jiangxia', name: '黄宇轩', gender: Gender.Male, generation: 22, fatherId: 'm_huang_jiancheng', motherId: 'm_zhuang_yushan', spouseIds: [], birthDate: '1998-04-01', bio: '庄氏所生长子', photo: 'https://picsum.photos/id/310/100/100' },
    { id: 'c_zhuang_2', familyId: 'f_huang_jiangxia', name: '黄宇昂', gender: Gender.Male, generation: 22, fatherId: 'm_huang_jiancheng', motherId: 'm_zhuang_yushan', spouseIds: [], birthDate: '1999-04-01', bio: '庄氏所生次子', photo: 'https://picsum.photos/id/311/100/100' },
    { id: 'c_zhuang_3', familyId: 'f_huang_jiangxia', name: '黄珊珊', gender: Gender.Female, generation: 22, fatherId: 'm_huang_jiancheng', motherId: 'm_zhuang_yushan', spouseIds: [], birthDate: '2000-04-01', bio: '庄氏所生长女', photo: 'https://picsum.photos/id/312/100/100' },

    // Wang Tianyi (王添艺) - Theme: Art/Blessing (添/Tian)
    { id: 'c_wang_t_1', familyId: 'f_huang_jiangxia', name: '黄添福', gender: Gender.Male, generation: 22, fatherId: 'm_huang_jiancheng', motherId: 'm_wang_tianyi', spouseIds: [], birthDate: '1999-05-01', bio: '王氏(添)所生长子', photo: 'https://picsum.photos/id/313/100/100' },
    { id: 'c_wang_t_2', familyId: 'f_huang_jiangxia', name: '黄添寿', gender: Gender.Male, generation: 22, fatherId: 'm_huang_jiancheng', motherId: 'm_wang_tianyi', spouseIds: [], birthDate: '2000-05-01', bio: '王氏(添)所生次子', photo: 'https://picsum.photos/id/314/100/100' },
    { id: 'c_wang_t_3', familyId: 'f_huang_jiangxia', name: '黄艺馨', gender: Gender.Female, generation: 22, fatherId: 'm_huang_jiancheng', motherId: 'm_wang_tianyi', spouseIds: [], birthDate: '2001-05-01', bio: '王氏(添)所生长女', photo: 'https://picsum.photos/id/315/100/100' },

    // Wang Lanjing (王澜静) - Theme: Water/Quiet (静/Jing)
    { id: 'c_wang_l_1', familyId: 'f_huang_jiangxia', name: '黄静波', gender: Gender.Male, generation: 22, fatherId: 'm_huang_jiancheng', motherId: 'm_wang_lanjing', spouseIds: [], birthDate: '2000-06-01', bio: '王氏(澜)所生长子', photo: 'https://picsum.photos/id/316/100/100' },
    { id: 'c_wang_l_2', familyId: 'f_huang_jiangxia', name: '黄静涛', gender: Gender.Male, generation: 22, fatherId: 'm_huang_jiancheng', motherId: 'm_wang_lanjing', spouseIds: [], birthDate: '2001-06-01', bio: '王氏(澜)所生次子', photo: 'https://picsum.photos/id/317/100/100' },
    { id: 'c_wang_l_3', familyId: 'f_huang_jiangxia', name: '黄澜澜', gender: Gender.Female, generation: 22, fatherId: 'm_huang_jiancheng', motherId: 'm_wang_lanjing', spouseIds: [], birthDate: '2002-06-01', bio: '王氏(澜)所生长女', photo: 'https://picsum.photos/id/318/100/100' },

    // Zhang Yufei (张雨霏) - Theme: Rain (雨/Yu)
    { id: 'c_zhang_y_1', familyId: 'f_huang_jiangxia', name: '黄雨晨', gender: Gender.Male, generation: 22, fatherId: 'm_huang_jiancheng', motherId: 'm_zhang_yufei', spouseIds: [], birthDate: '2001-07-01', bio: '张氏(雨)所生长子', photo: 'https://picsum.photos/id/319/100/100' },
    { id: 'c_zhang_y_2', familyId: 'f_huang_jiangxia', name: '黄雨午', gender: Gender.Male, generation: 22, fatherId: 'm_huang_jiancheng', motherId: 'm_zhang_yufei', spouseIds: [], birthDate: '2002-07-01', bio: '张氏(雨)所生次子', photo: 'https://picsum.photos/id/320/100/100' },
    { id: 'c_zhang_y_3', familyId: 'f_huang_jiangxia', name: '黄雨晚', gender: Gender.Female, generation: 22, fatherId: 'm_huang_jiancheng', motherId: 'm_zhang_yufei', spouseIds: [], birthDate: '2003-07-01', bio: '张氏(雨)所生长女', photo: 'https://picsum.photos/id/321/100/100' }
  ]
};
