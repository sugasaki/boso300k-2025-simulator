/**
 * GeoJSON の型定義
 * GeoJSON 形式のデータを扱うための型定義
 */

/**
 * GeoJSON ジオメトリの型定義
 * 様々な座標形式に対応するための柔軟な型
 */
export interface GeoJSONGeometry {
  type: string;
  coordinates: number[] | number[][] | number[][][] | number[][][][];
}

/**
 * GeoJSON フィーチャーの型定義
 */
export interface GeoJSONFeature {
  type: string;
  properties: Record<string, unknown>;
  geometry: GeoJSONGeometry;
}

/**
 * GeoJSON オブジェクトの型定義
 */
export interface GeoJSON {
  type: string;
  features: GeoJSONFeature[];
}