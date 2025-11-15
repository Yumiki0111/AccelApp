"use client";

import { useParams, useRouter } from "next/navigation";
import Header from "@/components/Header";
import { mockCompanies, mockChatMessages, Company } from "@/lib/mockData";
import Image from "next/image";
import { useState, useEffect, useRef } from "react";

export default function ChatPage() {
  const params = useParams();
  const router = useRouter();
  const companyId = params.companyId as string;
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const company = mockCompanies.find((c) => c.id === companyId);
  const [messages, setMessages] = useState(
    mockChatMessages[companyId] || []
  );

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  if (!company) {
    return (
      <div className="min-h-screen bg-white">
        <Header />
        <div className="lg:max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <p className="text-[#666666] text-lg">企業が見つかりませんでした</p>
            <button
              onClick={() => router.push("/browse/company")}
              className="mt-4 px-6 py-2 bg-[#003366] text-white rounded-lg hover:bg-[#00294f] transition-colors"
            >
              企業一覧に戻る
            </button>
          </div>
        </div>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() || isSubmitting) return;

    const newMessage = {
      id: `msg${Date.now()}`,
      companyId: companyId,
      sender: "user" as const,
      message: message.trim(),
      timestamp: new Date(),
      read: false,
    };

    setMessages((prev) => [...prev, newMessage]);
    setMessage("");
    setIsSubmitting(true);

    // シミュレーション：企業からの返信
    await new Promise((resolve) => setTimeout(resolve, 1500));

    const replyMessage = {
      id: `msg${Date.now() + 1}`,
      companyId: companyId,
      sender: "company" as const,
      message: "ありがとうございます。内容を確認いたしました。後日、詳細についてご連絡させていただきます。",
      timestamp: new Date(),
      read: false,
    };

    setMessages((prev) => [...prev, replyMessage]);
    setIsSubmitting(false);
  };

  const formatTime = (date: Date) => {
    const d = new Date(date);
    const hours = d.getHours().toString().padStart(2, "0");
    const minutes = d.getMinutes().toString().padStart(2, "0");
    return `${hours}:${minutes}`;
  };

  const formatDate = (date: Date) => {
    const d = new Date(date);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (d.toDateString() === today.toDateString()) {
      return "今日";
    } else if (d.toDateString() === yesterday.toDateString()) {
      return "昨日";
    } else {
      return `${d.getMonth() + 1}/${d.getDate()}`;
    }
  };

  const groupedMessages = messages.reduce((groups, msg) => {
    const date = formatDate(msg.timestamp);
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(msg);
    return groups;
  }, {} as Record<string, typeof messages>);

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Header />

      <div className="flex-1 flex flex-col lg:max-w-[1200px] mx-auto w-full">
        {/* チャットヘッダー */}
        <div className="bg-white border-b border-[#E6ECF3] px-4 sm:px-6 py-4 sticky top-[72px] z-10">
          <div className="flex items-center gap-4">
            <button
              onClick={() => router.back()}
              className="text-[#666666] hover:text-[#333333] text-xl"
            >
              ←
            </button>
            <Image
              src={company.logoUrl}
              alt={company.name}
              width={48}
              height={48}
              className="rounded-full flex-shrink-0"
            />
            <div className="flex-1 min-w-0">
              <h1 className="text-lg font-bold text-[#333333] truncate">
                {company.name}
              </h1>
              <p className="text-sm text-[#666666] truncate">
                {company.contact.name} ・ {company.contact.role}
              </p>
            </div>
            <button
              onClick={() => router.push(`/browse/company/${companyId}`)}
              className="px-4 py-2 text-sm text-[#003366] hover:bg-[#E6ECF3] rounded-lg transition-colors"
            >
              企業詳細
            </button>
          </div>
        </div>

        {/* メッセージ一覧 */}
        <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-6 space-y-4 bg-[#F9F9F9]">
          {Object.entries(groupedMessages).map(([date, dateMessages]) => (
            <div key={date}>
              {/* 日付セパレーター */}
              <div className="flex items-center justify-center my-4">
                <span className="px-3 py-1 bg-white text-xs text-[#666666] rounded-full border border-[#E6ECF3]">
                  {date}
                </span>
              </div>

              {/* メッセージ */}
              {dateMessages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex mb-4 ${
                    msg.sender === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`flex gap-3 max-w-[70%] sm:max-w-[60%] ${
                      msg.sender === "user" ? "flex-row-reverse" : "flex-row"
                    }`}
                  >
                    {msg.sender === "company" && (
                      <Image
                        src={company.logoUrl}
                        alt={company.name}
                        width={32}
                        height={32}
                        className="rounded-full flex-shrink-0"
                      />
                    )}
                    <div className="flex flex-col">
                      <div
                        className={`px-4 py-2 rounded-2xl ${
                          msg.sender === "user"
                            ? "bg-[#003366] text-white"
                            : "bg-white text-[#333333] border border-[#E6ECF3]"
                        }`}
                      >
                        <p className="text-sm whitespace-pre-wrap break-words">
                          {msg.message}
                        </p>
                      </div>
                      <span
                        className={`text-xs text-[#666666] mt-1 px-2 ${
                          msg.sender === "user" ? "text-right" : "text-left"
                        }`}
                      >
                        {formatTime(msg.timestamp)}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        {/* メッセージ入力欄 */}
        <div className="bg-white border-t border-[#E6ECF3] px-4 sm:px-6 py-4">
          <form onSubmit={handleSubmit} className="flex gap-3">
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="メッセージを入力..."
              rows={1}
              onInput={(e) => {
                const target = e.target as HTMLTextAreaElement;
                target.style.height = "auto";
                target.style.height = `${Math.min(target.scrollHeight, 120)}px`;
              }}
              className="flex-1 px-4 py-3 border border-[#E6ECF3] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#003366] focus:border-transparent resize-none text-sm max-h-[120px]"
            />
            <button
              type="submit"
              disabled={!message.trim() || isSubmitting}
              className="px-6 py-3 bg-[#003366] hover:bg-[#00294f] text-white font-semibold rounded-lg transition-colors disabled:bg-[#E6ECF3] disabled:text-[#666666] disabled:cursor-not-allowed"
            >
              {isSubmitting ? "送信中..." : "送信"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

