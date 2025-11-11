export interface Company {
  id: string;
  name: string;
  logoUrl: string;
  heroImageUrl: string;
  industryTags: string[];
  rating: number;
  reviewCount: number;
  contact: {
    name: string;
    role: string;
  };
  plan: {
    title: string;
    summary: string;
    imageUrl: string;
  };
  conditions: {
    cashSupport: { available: boolean; detail: string };
    goodsSupport: { available: boolean; detail: string };
    mentoring: { available: boolean; detail: string };
    cohostEvent: { available: boolean; detail: string };
  };
  achievements: {
    organizationName: string;
    eventName: string;
    description: string;
    logoUrl: string;
  }[];
  philosophy: string;
  coverageArea: string;
  sponsorshipTypes: string[];
}

export const mockCompanies: Company[] = [
  {
    id: "1",
    name: "BluePeak Inc.",
    logoUrl: "/logos/bluepeak.svg",
    heroImageUrl: "/company/bluepeak-team.svg",
    industryTags: ["IT", "人材", "教育"],
    rating: 4.9,
    reviewCount: 60,
    contact: {
      name: "加藤 大雅",
      role: "採用マネージャー",
    },
    plan: {
      title: "大学連携の共同イベント協賛",
      summary: "学生団体の挑戦を応援する企業プラン",
      imageUrl: "/plans/event-collaboration.jpg",
    },
    conditions: {
      cashSupport: { available: true, detail: "上限30万円まで" },
      goodsSupport: { available: true, detail: "ノベルティ・飲料提供" },
      mentoring: { available: true, detail: "週1回打合せ可能" },
      cohostEvent: { available: true, detail: "大学内イベント共催" },
    },
    achievements: [
      {
        organizationName: "東京大学起業サークル",
        eventName: "スタートアップピッチ2024",
        description: "50名規模のピッチイベントを共同開催",
        logoUrl: "/logos/university-tokyo.svg",
      },
      {
        organizationName: "早稲田ビジネスコンテスト実行委員会",
        eventName: "ビジコン決勝大会",
        description: "審査員派遣と賞金協賛",
        logoUrl: "/logos/university-waseda.svg",
      },
    ],
    philosophy: "学生の挑戦を応援し、次世代リーダーを育成します。",
    coverageArea: "全国 / 東京中心",
    sponsorshipTypes: ["金銭協賛", "イベント共催"],
  },
  {
    id: "2",
    name: "クリエイティブソリューションズ",
    logoUrl: "/logos/creative-solutions.svg",
    heroImageUrl: "/company/creative-solutions-team.svg",
    industryTags: ["広告", "デザイン", "メディア"],
    rating: 4.7,
    reviewCount: 42,
    contact: {
      name: "田中 美咲",
      role: "ブランドマネージャー",
    },
    plan: {
      title: "学生イベントの広報支援プラン",
      summary: "デザイン制作とSNS拡散をサポート",
      imageUrl: "/plans/creative-support.jpg",
    },
    conditions: {
      cashSupport: { available: false, detail: "" },
      goodsSupport: { available: true, detail: "印刷物・ポスター制作" },
      mentoring: { available: true, detail: "デザインレビュー対応" },
      cohostEvent: { available: false, detail: "" },
    },
    achievements: [
      {
        organizationName: "慶應義塾大学文化祭実行委員会",
        eventName: "三田祭2024",
        description: "メインビジュアル制作と広報協力",
        logoUrl: "/logos/university-keio.svg",
      },
    ],
    philosophy: "クリエイティブで学生の想いを形にします。",
    coverageArea: "東京 / オンライン",
    sponsorshipTypes: ["物品提供", "メンタリング"],
  },
  {
    id: "3",
    name: "グローバルフーズ株式会社",
    logoUrl: "/logos/global-foods.svg",
    heroImageUrl: "/company/global-foods-team.svg",
    industryTags: ["食品", "メーカー"],
    rating: 4.8,
    reviewCount: 35,
    contact: {
      name: "佐藤 健太",
      role: "マーケティング部長",
    },
    plan: {
      title: "飲料・食品提供プラン",
      summary: "イベント参加者への飲料・軽食を無償提供",
      imageUrl: "/plans/food-support.jpg",
    },
    conditions: {
      cashSupport: { available: false, detail: "" },
      goodsSupport: { available: true, detail: "飲料500本・お菓子セット" },
      mentoring: { available: false, detail: "" },
      cohostEvent: { available: true, detail: "試食ブース出展可" },
    },
    achievements: [
      {
        organizationName: "明治大学ボランティアセンター",
        eventName: "地域交流フェスティバル",
        description: "飲料300本提供と試食ブース出展",
        logoUrl: "/logos/university-meiji.svg",
      },
    ],
    philosophy: "食を通じて学生と地域をつなぎます。",
    coverageArea: "関東全域",
    sponsorshipTypes: ["物品提供", "イベント共催"],
  },
  {
    id: "4",
    name: "テックイノベーション",
    logoUrl: "/logos/tech-innovation.svg",
    heroImageUrl: "/company/tech-innovation-team.svg",
    industryTags: ["IT", "SaaS"],
    rating: 4.6,
    reviewCount: 28,
    contact: {
      name: "山田 拓也",
      role: "エンジニアリングマネージャー",
    },
    plan: {
      title: "技術メンタリング＋ツール提供",
      summary: "開発ツール無償提供とエンジニアメンタリング",
      imageUrl: "/plans/tech-mentoring.jpg",
    },
    conditions: {
      cashSupport: { available: true, detail: "最大10万円" },
      goodsSupport: { available: true, detail: "SaaSツール無償提供" },
      mentoring: { available: true, detail: "月2回技術相談" },
      cohostEvent: { available: false, detail: "" },
    },
    achievements: [
      {
        organizationName: "京都大学ハッカソン実行委員会",
        eventName: "京大ハック2024",
        description: "技術メンター派遣と賞金提供",
        logoUrl: "/logos/university-kyoto.svg",
      },
    ],
    philosophy: "技術で学生のアイデアを加速します。",
    coverageArea: "全国 / オンライン",
    sponsorshipTypes: ["金銭協賛", "メンタリング"],
  },
  {
    id: "5",
    name: "エコライフパートナーズ",
    logoUrl: "/logos/ecolife-partners.svg",
    heroImageUrl: "/company/ecolife-partners-team.svg",
    industryTags: ["環境", "社会貢献"],
    rating: 4.9,
    reviewCount: 51,
    contact: {
      name: "鈴木 綾香",
      role: "CSR推進室長",
    },
    plan: {
      title: "社会貢献イベント協賛プラン",
      summary: "環境・社会課題に取り組む学生団体を支援",
      imageUrl: "/plans/eco-partnership.jpg",
    },
    conditions: {
      cashSupport: { available: true, detail: "上限50万円" },
      goodsSupport: { available: true, detail: "エコグッズ提供" },
      mentoring: { available: true, detail: "CSR専門家によるアドバイス" },
      cohostEvent: { available: true, detail: "環境イベント共催" },
    },
    achievements: [
      {
        organizationName: "大阪大学環境サークル",
        eventName: "SDGsフェスタ2024",
        description: "50万円協賛と環境ワークショップ共催",
        logoUrl: "/logos/university-osaka.svg",
      },
    ],
    philosophy: "持続可能な未来を学生と共に創ります。",
    coverageArea: "全国",
    sponsorshipTypes: ["金銭協賛", "イベント共催", "メンタリング"],
  },
  {
    id: "6",
    name: "フィナンシャルブリッジ",
    logoUrl: "/logos/financial-bridge.svg",
    heroImageUrl: "/company/financial-bridge-team.svg",
    industryTags: ["金融", "コンサルティング"],
    rating: 4.5,
    reviewCount: 38,
    contact: {
      name: "高橋 雄一",
      role: "人事部採用担当",
    },
    plan: {
      title: "ビジネスコンテスト協賛",
      summary: "ビジコン・ケースコンペへの賞金提供",
      imageUrl: "/plans/business-contest.jpg",
    },
    conditions: {
      cashSupport: { available: true, detail: "賞金20万円" },
      goodsSupport: { available: false, detail: "" },
      mentoring: { available: true, detail: "ビジネスプラン壁打ち" },
      cohostEvent: { available: false, detail: "" },
    },
    achievements: [
      {
        organizationName: "一橋大学ビジネスコンテスト",
        eventName: "Hitotsubashi BC 2024",
        description: "最優秀賞スポンサーとして賞金提供",
        logoUrl: "/logos/university-hitotsubashi.svg",
      },
    ],
    philosophy: "学生の起業家精神を全力でサポートします。",
    coverageArea: "東京 / オンライン",
    sponsorshipTypes: ["金銭協賛", "メンタリング"],
  },
];

export const industryOptions = ["IT", "人材", "教育", "広告", "デザイン", "メディア", "食品", "メーカー", "SaaS", "環境", "社会貢献", "金融", "コンサルティング"];
export const sponsorshipTypeOptions = ["金銭協賛", "物品提供", "メンタリング", "イベント共催"];
export const regionOptions = ["全国", "東京", "関西", "関東全域", "オンライン"];
export const sortOptions = [
  { value: "rating", label: "評価が高い" },
  { value: "new", label: "新着順" },
  { value: "reviewCount", label: "募集数が多い" },
];

