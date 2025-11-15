import { NextRequest, NextResponse } from 'next/server';
import { PrismaChatRepository } from '../../../../../../src/infrastructure/repositories/PrismaChatRepository';
import { GetChatMessagesUseCase } from '../../../../../../src/application/use-cases/GetChatMessagesUseCase';
import { SendChatMessageUseCase } from '../../../../../../src/application/use-cases/SendChatMessageUseCase';

const chatRepository = new PrismaChatRepository();
const getChatMessagesUseCase = new GetChatMessagesUseCase(chatRepository);
const sendChatMessageUseCase = new SendChatMessageUseCase(chatRepository);

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    if (!id) {
      return NextResponse.json(
        { error: 'チャットルームIDが指定されていません' },
        { status: 400 }
      );
    }

    const messages = await getChatMessagesUseCase.execute(id);

    return NextResponse.json(messages, { status: 200 });
  } catch (error) {
    console.error('メッセージ取得エラー:', error);
    return NextResponse.json(
      { error: 'メッセージの取得に失敗しました', message: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();

    const { senderType, senderUserId, senderContactId, message } = body;

    if (!senderType || !message) {
      return NextResponse.json(
        { error: '送信者タイプとメッセージが必須です' },
        { status: 400 }
      );
    }

    const chatMessage = await sendChatMessageUseCase.execute({
      chatRoomId: id,
      senderType,
      senderUserId,
      senderContactId,
      message,
    });

    return NextResponse.json(chatMessage, { status: 201 });
  } catch (error) {
    console.error('メッセージ送信エラー:', error);
    return NextResponse.json(
      { error: 'メッセージの送信に失敗しました', message: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

