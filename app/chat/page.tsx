"use client";

import { useRouter } from "next/navigation";
import Header from "@/components/Header";
import { mockChatRooms } from "@/lib/mockData";
import Image from "next/image";

export default function ChatListPage() {
  const router = useRouter();

  const formatTime = (date: Date) => {
    const d = new Date(date);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (d.toDateString() === today.toDateString()) {
      const hours = d.getHours().toString().padStart(2, "0");
      const minutes = d.getMinutes().toString().padStart(2, "0");
      return `${hours}:${minutes}`;
    } else if (d.toDateString() === yesterday.toDateString()) {
      return "昨日";
    } else {
      return `${d.getMonth() + 1}/${d.getDate()}`;
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <Header />

      <div className="lg:max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
        <div className="mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold text-[#333333] mb-2">
            チャット
          </h1>
          <p className="text-sm text-[#666666]">
            企業とのやり取りを管理できます
          </p>
        </div>

        {mockChatRooms.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm p-12 text-center">
            <p className="text-[#666666] text-lg mb-2">
              チャットはありません
            </p>
            <p className="text-sm text-[#666666] mb-6">
              企業詳細ページから提携を申し込むと、チャットが開始されます
            </p>
            <button
              onClick={() => router.push("/browse/company")}
              className="px-6 py-3 bg-[#003366] hover:bg-[#00294f] text-white font-semibold rounded-lg transition-colors"
            >
              企業を探す
            </button>
          </div>
        ) : (
          <div className="space-y-2">
            {mockChatRooms.map((room) => (
              <div
                key={room.companyId}
                onClick={() => router.push(`/chat/${room.companyId}`)}
                className="bg-white rounded-lg shadow-sm border border-[#E6ECF3] hover:shadow-md transition-shadow cursor-pointer p-4"
              >
                <div className="flex items-start gap-4">
                  <Image
                    src={room.companyLogoUrl}
                    alt={room.companyName}
                    width={56}
                    height={56}
                    className="rounded-full flex-shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between mb-1">
                      <div className="flex-1 min-w-0">
                        <h3 className="text-base font-bold text-[#333333] truncate">
                          {room.companyName}
                        </h3>
                        <p className="text-xs text-[#666666] truncate">
                          {room.contactName} ・ {room.contactRole}
                        </p>
                      </div>
                      <div className="flex flex-col items-end gap-1 ml-2">
                        <span className="text-xs text-[#666666] whitespace-nowrap">
                          {formatTime(room.lastMessageTime)}
                        </span>
                        {room.unreadCount > 0 && (
                          <span className="px-2 py-0.5 bg-[#003366] text-white text-xs font-semibold rounded-full">
                            {room.unreadCount}
                          </span>
                        )}
                      </div>
                    </div>
                    <p className="text-sm text-[#666666] line-clamp-2 mt-2">
                      {room.lastMessage}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

