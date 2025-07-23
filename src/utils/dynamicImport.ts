/**
 * Viteでの動的インポート用ユーティリティ
 * 
 * 注意: このファイルはViteの仕様に合わせて実装されています。
 * import.meta.globはビルド時に静的に解決される必要があります。
 */

// GeoJSONファイルを直接インポート
// Viteではimport.meta.globは静的なパターンである必要があります
const geojsonModules = import.meta.glob('../data/2025/geojson/*.json', { eager: true });

/**
 * 指定されたディレクトリからJSONファイルをインポートする
 * @returns ファイル名をキーとしたJSONオブジェクトのマップ
 */
export function importGeoJsonFiles<T>(): Record<string, T> {
  const files: Record<string, T> = {};
  
  // 各モジュールを処理
  Object.entries(geojsonModules).forEach(([path, module]) => {
    // ファイルパスからファイル名を抽出
    const fileName = path.split('/').pop() || '';
    // 拡張子を削除
    const key = fileName.replace(/\.json$/, '');
    
    // defaultエクスポートがある場合はそれを使用、なければモジュール全体を使用
    const content = (module as Record<string, unknown>).default || module;
    
    // ファイル名をキーとしてデータを保存
    files[key] = content as T;
  });
  
  return files;
}
