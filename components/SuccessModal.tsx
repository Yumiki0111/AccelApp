"use client";

interface SuccessModalProps {
  companyName: string;
  onClose: () => void;
}

export default function SuccessModal({ companyName, onClose }: SuccessModalProps) {
  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl max-w-md w-full p-8 text-center space-y-6 animate-[slideUp_0.3s_ease-out]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* 成功アイコン */}
        <div className="w-20 h-20 mx-auto bg-[#27AE60] rounded-full flex items-center justify-center">
          <svg
            className="w-12 h-12 text-white"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={3}
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>

        {/* メッセージ */}
        <div className="space-y-2">
          <h3 className="text-2xl font-bold text-[#333333]">送信完了</h3>
          <p className="text-[#666666]">
            <span className="font-semibold text-[#003366]">{companyName}</span>
            に通知しました
          </p>
          <p className="text-sm text-[#666666]">
            企業からの返信をお待ちください。<br />
            ダッシュボードで進捗状況を確認できます。
          </p>
        </div>

        {/* ボタン */}
        <div className="space-y-3">
          <button
            onClick={onClose}
            className="w-full py-3 bg-[#003366] hover:bg-[#00294f] text-white font-semibold rounded-2xl transition-colors"
          >
            OK
          </button>
          <a
            href="#"
            className="block text-sm text-[#003366] hover:underline"
          >
            ダッシュボードで確認 →
          </a>
        </div>
      </div>
    </div>
  );
}

