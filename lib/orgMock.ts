export interface OrganizationMember {
  id: string;
  name: string;
  role: "代表" | "副代表" | "広報" | "財務" | "メンバー";
  email: string;
  status: "active" | "pending" | "invited";
  lastActive: string;
  university?: string;
  faculty?: string;
  department?: string;
  grade?: number;
}

export interface SponsorshipSummary {
  id: string;
  company: string;
  title: string;
  status: "交渉中" | "申請済み" | "協賛決定";
  lastUpdate: string;
  valueEstimate: string;
}

export interface OrganizationInsight {
  label: string;
  value: string;
  trend?: {
    type: "up" | "down" | "steady";
    description: string;
  };
  description: string;
}

export interface OrganizationOnboardingStep {
  id: number;
  title: string;
  detail: string;
  completed: boolean;
}

export interface OrganizationProfile {
  id: string;
  name: string;
  tagline: string;
  description: string;
  joinCode: string;
  campus: string;
  logoUrl?: string;
  createdAt: string;
  contacts: {
    representative: string;
    email: string;
    phone: string;
  };
}

export interface OrganizationDashboardData {
  profile: OrganizationProfile;
  insights: OrganizationInsight[];
  members: OrganizationMember[];
  pendingRequests: OrganizationMember[];
  sponsorships: SponsorshipSummary[];
  onboarding: OrganizationOnboardingStep[];
  announcements: {
    id: string;
    title: string;
    content: string;
    date: string;
  }[];
}

export const mockOrganizationDashboard: OrganizationDashboardData = {
  profile: {
    id: "org-001",
    name: "NEXT Innovators",
    tagline: "学生と企業の共創をつなぐソーシャルイノベーション団体",
    description:
      "関東圏の大学生を中心にテクノロジー・ビジネス・社会課題をテーマとしたプロジェクトを年間15件運営。企業との共創プログラムを通じ、学生の挑戦機会を創出しています。",
    joinCode: "NEXT-5824",
    campus: "首都圏5大学連合",
    logoUrl: "/logos/organization-next-innovators.svg",
    createdAt: "2021/04/01",
    contacts: {
      representative: "代表：山本 大輝",
      email: "team@next-innovators.jp",
      phone: "03-1234-5678",
    },
  },
  insights: [
    {
      label: "所属メンバー",
      value: "48名",
      trend: {
        type: "up",
        description: "先月比 +5 名",
      },
      description: "アクティブメンバー + 招待承認済みの人数です。",
    },
    {
      label: "申請中メンバー",
      value: "7名",
      trend: {
        type: "steady",
        description: "審査待ち：5 / 本人確認待ち：2",
      },
      description: "承認が必要な参加リクエスト数。",
    },
    {
      label: "協賛応募数 (直近90日)",
      value: "12件",
      trend: {
        type: "up",
        description: "成功率 58%",
      },
      description: "直近3ヶ月の協賛申請数と決定率。",
    },
    {
      label: "学生アカウント認証率",
      value: "92%",
      trend: {
        type: "down",
        description: "未認証：4名",
      },
      description: "本人確認メールを完了したメンバーの割合。",
    },
  ],
  members: [
    {
      id: "user-001",
      name: "山本 大輝",
      role: "代表",
      email: "daiki@next-innovators.jp",
      status: "active",
      lastActive: "15分前",
      university: "東京大学",
      faculty: "工学部",
      department: "情報工学科",
      grade: 4,
    },
    {
      id: "user-002",
      name: "佐藤 七海",
      role: "副代表",
      email: "nanami@next-innovators.jp",
      status: "active",
      lastActive: "2時間前",
      university: "早稲田大学",
      faculty: "商学部",
      department: "経営学科",
      grade: 3,
    },
    {
      id: "user-003",
      name: "高橋 翔",
      role: "広報",
      email: "sho@next-innovators.jp",
      status: "active",
      lastActive: "5時間前",
      university: "慶應義塾大学",
      faculty: "経済学部",
      department: "経済学科",
      grade: 3,
    },
    {
      id: "user-004",
      name: "伊藤 美咲",
      role: "財務",
      email: "misaki@next-innovators.jp",
      status: "active",
      lastActive: "昨日",
      university: "明治大学",
      faculty: "商学部",
      department: "会計学科",
      grade: 2,
    },
    {
      id: "user-005",
      name: "鈴木 陸",
      role: "メンバー",
      email: "riku@next-innovators.jp",
      status: "active",
      lastActive: "3日前",
      university: "一橋大学",
      faculty: "商学部",
      department: "経営学科",
      grade: 1,
    },
  ],
  pendingRequests: [
    {
      id: "user-101",
      name: "小林 春菜",
      role: "メンバー",
      email: "haruna@example.jp",
      status: "pending",
      lastActive: "未認証",
      university: "東京工業大学",
      faculty: "工学部",
      department: "機械工学科",
      grade: 2,
    },
    {
      id: "user-102",
      name: "田村 光",
      role: "メンバー",
      email: "hikari@example.jp",
      status: "pending",
      lastActive: "本人確認中",
      university: "京都大学",
      faculty: "工学部",
      department: "情報学科",
      grade: 3,
    },
  ],
  sponsorships: [
    {
      id: "sp-001",
      company: "BluePeak Inc.",
      title: "大学連携イベント共同開催",
      status: "協賛決定",
      lastUpdate: "2025/11/02",
      valueEstimate: "30万円 + メンタリング",
    },
    {
      id: "sp-002",
      company: "エコライフパートナーズ",
      title: "地域清掃プロジェクト協賛",
      status: "交渉中",
      lastUpdate: "2025/10/28",
      valueEstimate: "物品提供 (エコグッズ)",
    },
    {
      id: "sp-003",
      company: "テックイノベーション",
      title: "学生向けハッカソン共催",
      status: "申請済み",
      lastUpdate: "2025/10/20",
      valueEstimate: "技術メンタリング",
    },
  ],
  onboarding: [
    {
      id: 1,
      title: "個人アカウントの本人確認",
      detail: "大学メールアドレスで登録し、届いたメールから認証します。",
      completed: true,
    },
    {
      id: 2,
      title: "団体代表によるメンバー承認",
      detail: "代表者が承認すると団体メンバーに追加されます。",
      completed: false,
    },
    {
      id: 3,
      title: "団体プロフィールの設定",
      detail: "活動内容やSNSリンクを設定し、企業にアピールしましょう。",
      completed: true,
    },
  ],
  announcements: [
    {
      id: "ann-001",
      title: "11月度 協賛応募スケジュール",
      content:
        "11/15 締切：BluePeak Inc. 共同イベント\n11/22 締切：フィナンシャルブリッジ ビジコン協賛",
      date: "2025/11/05",
    },
    {
      id: "ann-002",
      title: "本人確認未完了メンバーへのリマインド",
      content:
        "本人確認が完了していないメンバーが4名います。今週中に完了するようリマインドしてください。",
      date: "2025/11/03",
    },
  ],
};

