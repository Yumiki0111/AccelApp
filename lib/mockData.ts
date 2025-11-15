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
    heroImageUrl: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&h=600&fit=crop&q=80",
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
    heroImageUrl: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&h=600&fit=crop&q=80",
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
    heroImageUrl: "https://images.unsplash.com/photo-1556910096-6f5e72db6803?w=800&h=600&fit=crop&q=80",
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
    heroImageUrl: "https://images.unsplash.com/photo-1573164713714-d95e436ab8d6?w=800&h=600&fit=crop&q=80",
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
    heroImageUrl: "https://images.unsplash.com/photo-1497435334941-8c899ee9e8e9?w=800&h=600&fit=crop&q=80",
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
    heroImageUrl: "https://images.unsplash.com/photo-1497366754035-f200968a6e72?w=800&h=600&fit=crop&q=80",
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
  {
    id: "7",
    name: "メディアクリエイティブ",
    logoUrl: "/logos/creative-solutions.svg",
    heroImageUrl: "https://images.unsplash.com/photo-1478737270239-2f02b77fc618?w=800&h=600&fit=crop&q=80",
    industryTags: ["メディア", "エンターテインメント", "広告"],
    rating: 4.6,
    reviewCount: 45,
    contact: {
      name: "中村 さくら",
      role: "コンテンツプロデューサー",
    },
    plan: {
      title: "学生イベントの動画制作支援",
      summary: "イベント動画の制作と配信サポート",
      imageUrl: "/plans/creative-support.jpg",
    },
    conditions: {
      cashSupport: { available: false, detail: "" },
      goodsSupport: { available: true, detail: "動画制作機材レンタル" },
      mentoring: { available: true, detail: "動画制作指導" },
      cohostEvent: { available: true, detail: "動画配信イベント共催" },
    },
    achievements: [
      {
        organizationName: "早稲田大学映像制作サークル",
        eventName: "学生映像祭2024",
        description: "動画制作機材提供と制作指導",
        logoUrl: "/logos/university-waseda.svg",
      },
    ],
    philosophy: "学生のクリエイティビティを映像で表現します。",
    coverageArea: "東京 / 関東",
    sponsorshipTypes: ["物品提供", "メンタリング", "イベント共催"],
  },
  {
    id: "8",
    name: "ヘルスケアイノベーション",
    logoUrl: "/logos/tech-innovation.svg",
    heroImageUrl: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=800&h=600&fit=crop&q=80",
    industryTags: ["医療", "ヘルスケア", "IT"],
    rating: 4.8,
    reviewCount: 52,
    contact: {
      name: "小林 健太",
      role: "CSR担当",
    },
    plan: {
      title: "健康イベント協賛プラン",
      summary: "健康・スポーツ関連イベントへの協賛",
      imageUrl: "/plans/eco-partnership.jpg",
    },
    conditions: {
      cashSupport: { available: true, detail: "上限25万円" },
      goodsSupport: { available: true, detail: "健康グッズ提供" },
      mentoring: { available: true, detail: "健康アドバイス" },
      cohostEvent: { available: true, detail: "健康イベント共催" },
    },
    achievements: [
      {
        organizationName: "東京大学健康サークル",
        eventName: "健康フェスタ2024",
        description: "健康グッズ提供とワークショップ開催",
        logoUrl: "/logos/university-tokyo.svg",
      },
    ],
    philosophy: "学生の健康をサポートし、健康的な社会を創ります。",
    coverageArea: "全国",
    sponsorshipTypes: ["金銭協賛", "物品提供", "メンタリング"],
  },
  {
    id: "9",
    name: "リアルエステートパートナーズ",
    logoUrl: "/logos/financial-bridge.svg",
    heroImageUrl: "https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=800&h=600&fit=crop&q=80",
    industryTags: ["不動産", "コンサルティング"],
    rating: 4.4,
    reviewCount: 31,
    contact: {
      name: "松本 悠介",
      role: "マーケティング部長",
    },
    plan: {
      title: "学生向け不動産セミナー開催",
      summary: "不動産に関するセミナーとキャリア支援",
      imageUrl: "/plans/business-contest.jpg",
    },
    conditions: {
      cashSupport: { available: true, detail: "上限15万円" },
      goodsSupport: { available: false, detail: "" },
      mentoring: { available: true, detail: "不動産キャリア相談" },
      cohostEvent: { available: true, detail: "セミナー共催" },
    },
    achievements: [
      {
        organizationName: "慶應義塾大学不動産研究会",
        eventName: "不動産セミナー2024",
        description: "セミナー開催とキャリア相談",
        logoUrl: "/logos/university-keio.svg",
      },
    ],
    philosophy: "学生のキャリア形成を不動産分野でサポートします。",
    coverageArea: "東京 / 関東",
    sponsorshipTypes: ["金銭協賛", "メンタリング", "イベント共催"],
  },
  {
    id: "10",
    name: "ロジスティクスソリューション",
    logoUrl: "/logos/global-foods.svg",
    heroImageUrl: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=800&h=600&fit=crop&q=80",
    industryTags: ["物流", "運輸", "IT"],
    rating: 4.7,
    reviewCount: 41,
    contact: {
      name: "田村 直樹",
      role: "営業部長",
    },
    plan: {
      title: "学生イベントの物流支援",
      summary: "イベント物資の配送・保管サービス",
      imageUrl: "/plans/food-support.jpg",
    },
    conditions: {
      cashSupport: { available: false, detail: "" },
      goodsSupport: { available: true, detail: "配送・保管サービス" },
      mentoring: { available: true, detail: "物流業界説明会" },
      cohostEvent: { available: false, detail: "" },
    },
    achievements: [
      {
        organizationName: "明治大学物流研究会",
        eventName: "物流フェア2024",
        description: "配送サービス提供と業界説明会",
        logoUrl: "/logos/university-meiji.svg",
      },
    ],
    philosophy: "物流を通じて学生の活動をサポートします。",
    coverageArea: "関東全域",
    sponsorshipTypes: ["物品提供", "メンタリング"],
  },
  {
    id: "11",
    name: "ECプラットフォーム",
    logoUrl: "/logos/bluepeak.svg",
    heroImageUrl: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=600&fit=crop&q=80",
    industryTags: ["EC", "小売", "IT"],
    rating: 4.9,
    reviewCount: 67,
    contact: {
      name: "伊藤 美香",
      role: "ブランドマネージャー",
    },
    plan: {
      title: "学生向けECプラットフォーム提供",
      summary: "学生団体向けECサイト構築支援",
      imageUrl: "/plans/tech-mentoring.jpg",
    },
    conditions: {
      cashSupport: { available: true, detail: "上限40万円" },
      goodsSupport: { available: true, detail: "ECプラットフォーム無償提供" },
      mentoring: { available: true, detail: "EC運営指導" },
      cohostEvent: { available: true, detail: "ECイベント共催" },
    },
    achievements: [
      {
        organizationName: "京都大学起業サークル",
        eventName: "学生ECコンテスト2024",
        description: "ECプラットフォーム提供と運営指導",
        logoUrl: "/logos/university-kyoto.svg",
      },
    ],
    philosophy: "学生のビジネスをECでサポートします。",
    coverageArea: "全国 / オンライン",
    sponsorshipTypes: ["金銭協賛", "物品提供", "メンタリング"],
  },
  {
    id: "12",
    name: "グリーンエネルギー",
    logoUrl: "/logos/ecolife-partners.svg",
    heroImageUrl: "https://images.unsplash.com/photo-1509391366360-2e959784a276?w=800&h=600&fit=crop&q=80",
    industryTags: ["エネルギー", "環境", "社会貢献"],
    rating: 4.8,
    reviewCount: 49,
    contact: {
      name: "佐々木 太郎",
      role: "CSR推進室長",
    },
    plan: {
      title: "環境イベント協賛プラン",
      summary: "環境・エネルギー関連イベントへの協賛",
      imageUrl: "/plans/eco-partnership.jpg",
    },
    conditions: {
      cashSupport: { available: true, detail: "上限35万円" },
      goodsSupport: { available: true, detail: "太陽光パネル展示" },
      mentoring: { available: true, detail: "環境エネルギー専門家アドバイス" },
      cohostEvent: { available: true, detail: "環境イベント共催" },
    },
    achievements: [
      {
        organizationName: "大阪大学環境サークル",
        eventName: "環境エネルギー展2024",
        description: "35万円協賛と太陽光パネル展示",
        logoUrl: "/logos/university-osaka.svg",
      },
    ],
    philosophy: "持続可能なエネルギーで未来を創ります。",
    coverageArea: "全国",
    sponsorshipTypes: ["金銭協賛", "物品提供", "イベント共催"],
  },
  {
    id: "13",
    name: "マニュファクチャリング",
    logoUrl: "/logos/global-foods.svg",
    heroImageUrl: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=800&h=600&fit=crop&q=80",
    industryTags: ["製造業", "機械", "ものづくり"],
    rating: 4.5,
    reviewCount: 36,
    contact: {
      name: "渡辺 誠",
      role: "技術部長",
    },
    plan: {
      title: "ものづくりコンテスト協賛",
      summary: "ものづくりコンテストへの協賛と技術支援",
      imageUrl: "/plans/business-contest.jpg",
    },
    conditions: {
      cashSupport: { available: true, detail: "賞金15万円" },
      goodsSupport: { available: true, detail: "工作機械レンタル" },
      mentoring: { available: true, detail: "技術指導" },
      cohostEvent: { available: true, detail: "ものづくりイベント共催" },
    },
    achievements: [
      {
        organizationName: "東京工業大学ものづくりサークル",
        eventName: "ものづくりコンテスト2024",
        description: "賞金提供と技術指導",
        logoUrl: "/logos/university-tokyo.svg",
      },
    ],
    philosophy: "学生のものづくりへの情熱をサポートします。",
    coverageArea: "関東全域",
    sponsorshipTypes: ["金銭協賛", "物品提供", "メンタリング"],
  },
  {
    id: "14",
    name: "インフラコンストラクション",
    logoUrl: "/logos/financial-bridge.svg",
    heroImageUrl: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&h=600&fit=crop&q=80",
    industryTags: ["建設", "インフラ", "コンサルティング"],
    rating: 4.6,
    reviewCount: 43,
    contact: {
      name: "山崎 一郎",
      role: "人事部長",
    },
    plan: {
      title: "建設・インフラセミナー開催",
      summary: "建設業界セミナーとキャリア支援",
      imageUrl: "/plans/business-contest.jpg",
    },
    conditions: {
      cashSupport: { available: true, detail: "上限20万円" },
      goodsSupport: { available: false, detail: "" },
      mentoring: { available: true, detail: "建設業界キャリア相談" },
      cohostEvent: { available: true, detail: "セミナー共催" },
    },
    achievements: [
      {
        organizationName: "一橋大学建設研究会",
        eventName: "建設業界セミナー2024",
        description: "セミナー開催とキャリア相談",
        logoUrl: "/logos/university-hitotsubashi.svg",
      },
    ],
    philosophy: "建設・インフラ分野で学生のキャリアをサポートします。",
    coverageArea: "全国",
    sponsorshipTypes: ["金銭協賛", "メンタリング", "イベント共催"],
  },
  {
    id: "15",
    name: "トラベルアドベンチャー",
    logoUrl: "/logos/creative-solutions.svg",
    heroImageUrl: "https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=800&h=600&fit=crop&q=80",
    industryTags: ["旅行", "観光", "サービス"],
    rating: 4.7,
    reviewCount: 38,
    contact: {
      name: "野口 菜月",
      role: "マーケティング担当",
    },
    plan: {
      title: "学生旅行プラン提供",
      summary: "学生団体向け旅行プランと体験プログラム",
      imageUrl: "/plans/event-collaboration.jpg",
    },
    conditions: {
      cashSupport: { available: false, detail: "" },
      goodsSupport: { available: true, detail: "旅行クーポン提供" },
      mentoring: { available: true, detail: "旅行企画アドバイス" },
      cohostEvent: { available: true, detail: "旅行イベント共催" },
    },
    achievements: [
      {
        organizationName: "早稲田大学旅行サークル",
        eventName: "学生旅行フェア2024",
        description: "旅行クーポン提供と企画アドバイス",
        logoUrl: "/logos/university-waseda.svg",
      },
    ],
    philosophy: "学生の旅への想いを実現します。",
    coverageArea: "全国",
    sponsorshipTypes: ["物品提供", "メンタリング", "イベント共催"],
  },
  {
    id: "16",
    name: "パブリッシングハウス",
    logoUrl: "/logos/creative-solutions.svg",
    heroImageUrl: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=800&h=600&fit=crop&q=80",
    industryTags: ["出版", "メディア", "教育"],
    rating: 4.6,
    reviewCount: 40,
    contact: {
      name: "前田 英樹",
      role: "編集長",
    },
    plan: {
      title: "学生向け出版支援プラン",
      summary: "学生の出版物制作支援と販売サポート",
      imageUrl: "/plans/creative-support.jpg",
    },
    conditions: {
      cashSupport: { available: false, detail: "" },
      goodsSupport: { available: true, detail: "出版物制作支援" },
      mentoring: { available: true, detail: "編集・出版指導" },
      cohostEvent: { available: true, detail: "出版イベント共催" },
    },
    achievements: [
      {
        organizationName: "慶應義塾大学出版サークル",
        eventName: "学生出版フェア2024",
        description: "出版物制作支援と販売サポート",
        logoUrl: "/logos/university-keio.svg",
      },
    ],
    philosophy: "学生の想いを本という形で世に届けます。",
    coverageArea: "東京 / オンライン",
    sponsorshipTypes: ["物品提供", "メンタリング", "イベント共催"],
  },
];

export interface ChatMessage {
  id: string;
  companyId: string;
  sender: "user" | "company";
  message: string;
  timestamp: Date;
  read: boolean;
}

export interface ChatRoom {
  companyId: string;
  companyName: string;
  companyLogoUrl: string;
  contactName: string;
  contactRole: string;
  lastMessage: string;
  lastMessageTime: Date;
  unreadCount: number;
  messages: ChatMessage[];
}

// チャットメッセージのモックデータ
export const mockChatMessages: Record<string, ChatMessage[]> = {
  "1": [
    {
      id: "msg1",
      companyId: "1",
      sender: "user",
      message: "こんにちは。BluePeak Inc.様、初めまして。私たちは東京大学の学生団体で、スタートアップピッチイベントを開催したいと考えています。協賛についてお話しさせていただけますでしょうか？",
      timestamp: new Date("2024-01-15T10:00:00"),
      read: true,
    },
    {
      id: "msg2",
      companyId: "1",
      sender: "company",
      message: "こんにちは。お問い合わせありがとうございます。スタートアップピッチイベント、とても興味深いですね。どのような規模のイベントを予定されていますか？",
      timestamp: new Date("2024-01-15T10:15:00"),
      read: true,
    },
    {
      id: "msg3",
      companyId: "1",
      sender: "user",
      message: "ありがとうございます。参加者数は50名程度、開催日は2024年3月15日を予定しています。金銭協賛と審査員派遣のご協力をお願いできればと思っています。",
      timestamp: new Date("2024-01-15T11:00:00"),
      read: true,
    },
    {
      id: "msg4",
      companyId: "1",
      sender: "company",
      message: "承知いたしました。50名規模のイベントでしたら、当社でも協賛可能です。詳しい企画書や予算計画書を共有していただけますでしょうか？検討させていただきます。",
      timestamp: new Date("2024-01-15T14:30:00"),
      read: true,
    },
    {
      id: "msg5",
      companyId: "1",
      sender: "user",
      message: "ありがとうございます。企画書を準備いたしますので、今週中にお送りさせていただきます。よろしくお願いいたします。",
      timestamp: new Date("2024-01-15T15:00:00"),
      read: false,
    },
  ],
  "2": [
    {
      id: "msg6",
      companyId: "2",
      sender: "user",
      message: "クリエイティブソリューションズ様、こんにちは。慶應義塾大学の文化祭実行委員会です。三田祭の広報について、ご協力をお願いしたいと思い、ご連絡いたしました。",
      timestamp: new Date("2024-01-10T09:00:00"),
      read: true,
    },
    {
      id: "msg7",
      companyId: "2",
      sender: "company",
      message: "こんにちは。三田祭の広報支援、承知いたしました。デザイン制作やSNS拡散など、どのようなサポートが必要でしょうか？",
      timestamp: new Date("2024-01-10T10:00:00"),
      read: true,
    },
    {
      id: "msg8",
      companyId: "2",
      sender: "user",
      message: "メインビジュアルの制作と、SNSでの拡散をお願いしたいです。ポスターやチラシのデザインも含めて、お力をお借りできればと思います。",
      timestamp: new Date("2024-01-10T11:00:00"),
      read: true,
    },
    {
      id: "msg9",
      companyId: "2",
      sender: "company",
      message: "了解いたしました。メインビジュアル制作とSNS拡散、ポスター・チラシデザイン、すべて対応可能です。詳細な要件を伺えればと思います。",
      timestamp: new Date("2024-01-10T14:00:00"),
      read: false,
    },
  ],
  "3": [
    {
      id: "msg10",
      companyId: "3",
      sender: "company",
      message: "こんにちは。グローバルフーズ株式会社です。地域交流フェスティバルについて、飲料提供のご相談をいただいた件、ありがとうございます。",
      timestamp: new Date("2024-01-08T10:00:00"),
      read: true,
    },
    {
      id: "msg11",
      companyId: "3",
      sender: "user",
      message: "ありがとうございます。地域交流フェスティバルは、3月20日に開催予定で、参加者数は約200名を見込んでいます。飲料300本の提供と試食ブースの出展をお願いできればと思います。",
      timestamp: new Date("2024-01-08T11:00:00"),
      read: true,
    },
    {
      id: "msg12",
      companyId: "3",
      sender: "company",
      message: "承知いたしました。200名規模のイベントでしたら、飲料300本の提供と試食ブースの出展、どちらも対応可能です。詳細について、打ち合わせの機会を設けさせていただけますでしょうか？",
      timestamp: new Date("2024-01-08T15:00:00"),
      read: false,
    },
  ],
};

export const mockChatRooms: ChatRoom[] = [
  {
    companyId: "1",
    companyName: "BluePeak Inc.",
    companyLogoUrl: "/logos/bluepeak.svg",
    contactName: "加藤 大雅",
    contactRole: "採用マネージャー",
    lastMessage: "ありがとうございます。企画書を準備いたしますので、今週中にお送りさせていただきます。よろしくお願いいたします。",
    lastMessageTime: new Date("2024-01-15T15:00:00"),
    unreadCount: 0,
    messages: mockChatMessages["1"] || [],
  },
  {
    companyId: "2",
    companyName: "クリエイティブソリューションズ",
    companyLogoUrl: "/logos/creative-solutions.svg",
    contactName: "田中 美咲",
    contactRole: "ブランドマネージャー",
    lastMessage: "了解いたしました。メインビジュアル制作とSNS拡散、ポスター・チラシデザイン、すべて対応可能です。詳細な要件を伺えればと思います。",
    lastMessageTime: new Date("2024-01-10T14:00:00"),
    unreadCount: 1,
    messages: mockChatMessages["2"] || [],
  },
  {
    companyId: "3",
    companyName: "グローバルフーズ株式会社",
    companyLogoUrl: "/logos/global-foods.svg",
    contactName: "佐藤 健太",
    contactRole: "マーケティング部長",
    lastMessage: "承知いたしました。200名規模のイベントでしたら、飲料300本の提供と試食ブースの出展、どちらも対応可能です。詳細について、打ち合わせの機会を設けさせていただけますでしょうか？",
    lastMessageTime: new Date("2024-01-08T15:00:00"),
    unreadCount: 1,
    messages: mockChatMessages["3"] || [],
  },
];

// 応募済み企業
export interface AppliedCompany {
  id: string;
  companyId: string;
  companyName: string;
  companyLogoUrl: string;
  planTitle: string;
  status: "申請済み" | "審査中" | "承認済み" | "却下";
  appliedDate: Date;
  lastMessage?: string;
  lastMessageTime?: Date;
  unreadCount?: number;
}

export const mockAppliedCompanies: AppliedCompany[] = [
  {
    id: "applied-1",
    companyId: "1",
    companyName: "BluePeak Inc.",
    companyLogoUrl: "/logos/bluepeak.svg",
    planTitle: "大学連携の共同イベント協賛",
    status: "審査中",
    appliedDate: new Date("2024-01-10"),
    lastMessage: "企画書を確認させていただきました。詳細についてご相談させていただけますでしょうか？",
    lastMessageTime: new Date("2024-01-15T10:00:00"),
    unreadCount: 0,
  },
  {
    id: "applied-2",
    companyId: "5",
    companyName: "エコライフパートナーズ",
    companyLogoUrl: "/logos/ecolife-partners.svg",
    planTitle: "社会貢献イベント協賛プラン",
    status: "申請済み",
    appliedDate: new Date("2024-01-08"),
    lastMessage: "ありがとうございます。内容を確認いたしました。",
    lastMessageTime: new Date("2024-01-09T14:00:00"),
    unreadCount: 0,
  },
  {
    id: "applied-3",
    companyId: "4",
    companyName: "テックイノベーション",
    companyLogoUrl: "/logos/tech-innovation.svg",
    planTitle: "技術メンタリング＋ツール提供",
    status: "承認済み",
    appliedDate: new Date("2024-01-05"),
    lastMessage: "承認いたしました。今後ともよろしくお願いいたします。",
    lastMessageTime: new Date("2024-01-06T16:00:00"),
    unreadCount: 0,
  },
];

// キープ（お気に入り）企業
export interface KeptCompany {
  id: string;
  companyId: string;
  companyName: string;
  companyLogoUrl: string;
  planTitle: string;
  keptDate: Date;
  industryTags: string[];
  rating: number;
}

export const mockKeptCompanies: KeptCompany[] = [
  {
    id: "kept-1",
    companyId: "2",
    companyName: "クリエイティブソリューションズ",
    companyLogoUrl: "/logos/creative-solutions.svg",
    planTitle: "学生イベントの広報支援プラン",
    keptDate: new Date("2024-01-12"),
    industryTags: ["広告", "デザイン", "メディア"],
    rating: 4.7,
  },
  {
    id: "kept-2",
    companyId: "3",
    companyName: "グローバルフーズ株式会社",
    companyLogoUrl: "/logos/global-foods.svg",
    planTitle: "飲料・食品提供プラン",
    keptDate: new Date("2024-01-11"),
    industryTags: ["食品", "メーカー"],
    rating: 4.8,
  },
  {
    id: "kept-3",
    companyId: "6",
    companyName: "フィナンシャルブリッジ",
    companyLogoUrl: "/logos/financial-bridge.svg",
    planTitle: "ビジネスコンテスト協賛",
    keptDate: new Date("2024-01-09"),
    industryTags: ["金融", "コンサルティング"],
    rating: 4.5,
  },
];

// 閲覧履歴
export interface BrowsedCompany {
  id: string;
  companyId: string;
  companyName: string;
  companyLogoUrl: string;
  planTitle: string;
  browsedDate: Date;
  industryTags: string[];
  rating: number;
}

export const mockBrowsedCompanies: BrowsedCompany[] = [
  {
    id: "browsed-1",
    companyId: "1",
    companyName: "BluePeak Inc.",
    companyLogoUrl: "/logos/bluepeak.svg",
    planTitle: "大学連携の共同イベント協賛",
    browsedDate: new Date("2024-01-15T15:30:00"),
    industryTags: ["IT", "人材", "教育"],
    rating: 4.9,
  },
  {
    id: "browsed-2",
    companyId: "2",
    companyName: "クリエイティブソリューションズ",
    companyLogoUrl: "/logos/creative-solutions.svg",
    planTitle: "学生イベントの広報支援プラン",
    browsedDate: new Date("2024-01-15T14:20:00"),
    industryTags: ["広告", "デザイン", "メディア"],
    rating: 4.7,
  },
  {
    id: "browsed-3",
    companyId: "5",
    companyName: "エコライフパートナーズ",
    companyLogoUrl: "/logos/ecolife-partners.svg",
    planTitle: "社会貢献イベント協賛プラン",
    browsedDate: new Date("2024-01-14T16:00:00"),
    industryTags: ["環境", "社会貢献"],
    rating: 4.9,
  },
  {
    id: "browsed-4",
    companyId: "4",
    companyName: "テックイノベーション",
    companyLogoUrl: "/logos/tech-innovation.svg",
    planTitle: "技術メンタリング＋ツール提供",
    browsedDate: new Date("2024-01-13T10:00:00"),
    industryTags: ["IT", "SaaS"],
    rating: 4.6,
  },
  {
    id: "browsed-5",
    companyId: "3",
    companyName: "グローバルフーズ株式会社",
    companyLogoUrl: "/logos/global-foods.svg",
    planTitle: "飲料・食品提供プラン",
    browsedDate: new Date("2024-01-12T11:00:00"),
    industryTags: ["食品", "メーカー"],
    rating: 4.8,
  },
];

export const industryOptions = ["IT", "人材", "教育", "広告", "デザイン", "メディア", "食品", "メーカー", "SaaS", "環境", "社会貢献", "金融", "コンサルティング", "エンターテインメント", "医療", "ヘルスケア", "不動産", "物流", "運輸", "EC", "小売", "エネルギー", "製造業", "機械", "ものづくり", "建設", "インフラ", "旅行", "観光", "サービス", "出版"];
export const sponsorshipTypeOptions = ["金銭協賛", "物品提供", "メンタリング", "イベント共催"];
export const regionOptions = ["全国", "東京", "関西", "関東全域", "オンライン"];
export const sortOptions = [
  { value: "rating", label: "評価が高い" },
  { value: "new", label: "新着順" },
  { value: "reviewCount", label: "募集数が多い" },
];

