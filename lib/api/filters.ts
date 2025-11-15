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
    try {
      const errorData = await response.json();
      if (errorData.error) {
        errorMessage = errorData.details 
          ? `${errorData.error}: ${errorData.details}`
          : errorData.error;
      }
    } catch (parseError) {
      // JSON解析に失敗した場合、レスポンスのテキストを取得
      try {
        const text = await response.text();
        if (text) {
          errorMessage = `フィルタの取得に失敗しました: ${text}`;
        }
      } catch (textError) {
        // テキスト取得にも失敗した場合は、デフォルトメッセージを使用
        console.error('エラーレスポンスの解析に失敗:', textError);
      }
    }
    throw new Error(errorMessage);
  }

  return response.json();
}

