import Link from "next/link";

export default function Header() {
  return (
    <header className="sticky top-0 z-50 bg-[#003366] shadow-sm">
      <div className="lg:max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-[72px]">
          {/* ブランド */}
          <div className="flex items-center">
            <Link
              href="/browse/company"
              className="text-2xl font-bold text-white"
            >
              Accel
            </Link>
          </div>

          {/* マイページへのショートカット */}
          <Link
            href="/organization"
            className="flex items-center space-x-3 group"
          >
            <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-[#003366] font-semibold transition-transform group-hover:scale-105">
              学
            </div>
            <span className="hidden sm:inline text-white font-medium group-hover:underline">
              サンプル学生団体
            </span>
          </Link>
        </div>
      </div>
    </header>
  );
}

