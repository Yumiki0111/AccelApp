export default function Home() {
  return (
    <div className="min-h-screen bg-white flex items-center justify-center">
      <div className="text-center space-y-6 p-8">
        <h1 className="text-4xl font-bold text-[#003366]">Accel</h1>
        <p className="text-lg text-[#666666] max-w-md">
          学生団体と企業をつなぐ協賛プラットフォーム
        </p>
        <a
          href="/browse/company"
          className="inline-block px-8 py-4 bg-[#003366] hover:bg-[#00294f] text-white font-semibold rounded-2xl transition-colors"
        >
          企業を探す
        </a>
      </div>
    </div>
  );
}
