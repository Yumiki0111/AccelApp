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
    throw new Error(`フィルタの取得に失敗しました: ${response.statusText}`);
  }

  return response.json();
}

