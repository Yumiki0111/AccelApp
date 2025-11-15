/**
 * フィルタ選択肢API呼び出し
 */

export interface FilterOptions {
  industries: { id: string; label: string }[];
  sponsorshipTypes: { value: string; label: string }[];
  regions: { id: string; code: string; name: string }[];
}

/**
 * フィルタ選択肢を取得
 */
export async function getFilters(): Promise<FilterOptions> {
  const response = await fetch('/api/filters');
  
  if (!response.ok) {
    let errorMessage = `フィルタの取得に失敗しました: ${response.statusText}`;
    let errorDetails: any = null;
    
    try {
      const errorData = await response.json();
      errorDetails = errorData;
      
      // 詳細なエラーメッセージを構築
      if (errorData.error) {
        if (errorData.details) {
          errorMessage = `${errorData.error}: ${errorData.details}`;
        } else {
          errorMessage = errorData.error;
        }
      }
      
      // エラーの種類を表示
      if (errorData.type) {
        console.error('フィルタ取得エラー:', {
          type: errorData.type,
          code: errorData.code,
          message: errorData.error,
          details: errorData.details,
        });
      }
    } catch (parseError) {
      // JSON解析に失敗した場合、レスポンスのテキストを取得
      try {
        const text = await response.text();
        if (text) {
          errorMessage = `フィルタの取得に失敗しました: ${text}`;
          console.error('フィルタ取得エラー（テキスト）:', text);
        }
      } catch (textError) {
        // テキスト取得にも失敗した場合は、デフォルトメッセージを使用
        console.error('エラーレスポンスの解析に失敗:', textError);
      }
    }
    
    // エラー詳細をコンソールに出力（デバッグ用）
    if (errorDetails) {
      console.error('フィルタ取得エラー詳細:', errorDetails);
    }
    
    throw new Error(errorMessage);
  }

  return response.json();
}

