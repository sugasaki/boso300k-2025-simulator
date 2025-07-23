import { GeoJSONFeature } from 'maplibre-gl';

/**
 * GeoJSON経路と位置計算に関連する型定義
 */

// 経度・緯度の2次元座標
export type Coordinate = [number, number]; // [longitude, latitude]

// 経度・緯度・標高の3次元座標
export type Coordinate3D = [number, number, number]; // [longitude, latitude, elevation]

// // GeoJSONの基本構造（必要に応じて拡張可能）
// export type GeoJSONFeature = {
//   type: string;
//   properties: Record<string, any>;
//   geometry: {
//     type: string;
//     coordinates: Coordinate3D[] | Coordinate3D[][] | Coordinate3D[][][];
//   };
// };

export type GeoJSON = {
  type: string;
  features: GeoJSONFeature[];
};

// 累積距離計算結果の型
export type PointWithDistance = {
  point: Coordinate | Coordinate3D;
  distance: number;
};

// パスキャッシュのデータ構造
export type PathData = {
  coordinates: Coordinate3D[];
  lookup: PointWithDistance[];
  totalDistance: number;
};

// getPositionAtDistanceが返す型
export type PositionAtDistance = Coordinate3D | null;
