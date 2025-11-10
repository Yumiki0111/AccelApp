export default function Header() {
  return (
    <header className="sticky top-0 z-50 bg-white border-b border-[#E6ECF3]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-[72px]">
          {/* ロゴ */}
          <div className="flex items-center">
            <h1 className="text-2xl font-bold text-[#003366]">Accel</h1>
          </div>

          {/* ナビゲーション */}
          <nav className="hidden md:flex items-center space-x-8">
            <a
              href="#"
              className="text-[#666666] hover:text-[#003366] transition-colors"
            >
              案件一覧
            </a>
            <a
              href="#"
              className="text-[#003366] font-semibold border-b-2 border-[#003366] pb-1"
            >
              企業一覧
            </a>
            <a
              href="#"
              className="text-[#666666] hover:text-[#003366] transition-colors"
            >
              ダッシュボード
            </a>
          </nav>

          {/* ユーザー情報 */}
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-full bg-[#003366] flex items-center justify-center text-white font-semibold">
              学
            </div>
            <span className="hidden sm:inline text-[#333333] font-medium">
              サンプル学生団体
            </span>
          </div>
        </div>
      </div>
    </header>
  );
}

