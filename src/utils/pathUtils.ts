import { GeoJSONFeature } from 'maplibre-gl';

/**
 * GeoJSON経路上の距離計算と位置算出用のユーティリティ関数
 */
import {
  Coordinate3D,
  PathData,
  PointWithDistance,
  PositionAtDistance,
} from '../types/geo';

// キャッシュを使用して同じGeoJSONに対する計算結果を保存
const pathCache = new WeakMap<GeoJSONFeature, PathData>();

/**
 * 高速な2点間の距離計算（簡易版）
 * 厳密な地球の曲率計算の代わりに平面近似を使用
 *
 * @param point1 始点の座標 [longitude, latitude, elevation]
 * @param point2 終点の座標 [longitude, latitude, elevation]
 * @returns 2点間の距離（メートル）
 */
export const calculate3DDistanceFast = (
  point1: Coordinate3D,
  point2: Coordinate3D
): number => {
  // 緯度1度あたりの距離（メートル）- 約111km
  const LAT_METER_PER_DEGREE = 111000;
  // 経度1度あたりの距離（メートル）- 緯度によって変化するが、近似値として使用
  // 緯度35度付近では約91km
  const LON_METER_PER_DEGREE = 91000;

  // 緯度経度の差分
  const dLat = (point2[1] - point1[1]) * LAT_METER_PER_DEGREE;
  const dLon = (point2[0] - point1[0]) * LON_METER_PER_DEGREE;

  // Z座標（標高）の差分（メートル）
  const dAlt = point2[2] - point1[2];

  // 3次元の距離をピタゴラスの定理で計算
  return Math.sqrt(dLat * dLat + dLon * dLon + dAlt * dAlt);
};

/**
 * 3次元の2点間の距離を計算する
 * @param point1 始点の座標 [longitude, latitude, elevation]
 * @param point2 終点の座標 [longitude, latitude, elevation]
 * @returns 2点間の距離（メートル）
 */
export const calculate3DDistance = (
  point1: Coordinate3D,
  point2: Coordinate3D
): number => {
  // 地球の半径（メートル）
  const R = 6371000;

  // 緯度経度をラジアンに変換
  const lat1 = (point1[1] * Math.PI) / 180;
  const lat2 = (point2[1] * Math.PI) / 180;
  const lon1 = (point1[0] * Math.PI) / 180;
  const lon2 = (point2[0] * Math.PI) / 180;

  // 緯度経度の差分
  const dLat = lat2 - lat1;
  const dLon = lon2 - lon1;

  // Haversine formula for 2D distance
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance2D = R * c;

  // Z座標（標高）の差分（メートル）
  const dAlt = point2[2] - point1[2];

  // 3次元の距離をピタゴラスの定理で計算
  return Math.sqrt(distance2D * distance2D + dAlt * dAlt);
};

/**
 * LineStringの累積距離と各点の情報を計算する
 * @param coordinates LineStringの座標配列 [[lon, lat, elevation], ...]
 * @returns 各点の累積距離と座標情報の配列
 */
export const calculateCumulativeDistances = (
  coordinates: Coordinate3D[]
): PointWithDistance[] => {
  const result: PointWithDistance[] = [];
  let cumulativeDistance = 0;

  if (coordinates.length === 0) {
    return result;
  }

  // 最初の点を追加
  result.push({
    point: coordinates[0],
    distance: 0,
  });

  // 2点目以降の累積距離を計算
  for (let i = 1; i < coordinates.length; i++) {
    const prevPoint = coordinates[i - 1];
    const currentPoint = coordinates[i];
    // 高速版の距離計算を使用
    const segmentDistance = calculate3DDistanceFast(prevPoint, currentPoint);
    cumulativeDistance += segmentDistance;

    result.push({
      point: currentPoint,
      distance: cumulativeDistance,
    });
  }

  return result;
};

/**
 * バイナリサーチを使って指定した距離に最も近いセグメントを見つける
 * @param pointsWithDistances 累積距離配列
 * @param targetDistance 目標距離
 * @returns 該当するセグメントのインデックス
 */
function findSegmentIndexBinarySearch(
  pointsWithDistances: PointWithDistance[],
  targetDistance: number
): number {
  let left = 0;
  let right = pointsWithDistances.length - 2; // 最後のセグメントはindex.length-2まで

  // 範囲外の場合は早期リターン
  if (targetDistance <= pointsWithDistances[0].distance) return 0;
  if (
    targetDistance >=
    pointsWithDistances[pointsWithDistances.length - 1].distance
  )
    return pointsWithDistances.length - 2;

  while (left <= right) {
    const mid = Math.floor((left + right) / 2);

    if (
      pointsWithDistances[mid].distance <= targetDistance &&
      targetDistance < pointsWithDistances[mid + 1].distance
    ) {
      return mid;
    }

    if (pointsWithDistances[mid].distance > targetDistance) {
      right = mid - 1;
    } else {
      left = mid + 1;
    }
  }

  return left;
}

/**
 * GeoJSONのパスデータをキャッシュから取得、または新規計算して保存
 * @param geojson GeoJSONデータ
 * @returns パスデータ（座標、累積距離、総距離）
 */
function getOrCreatePathData(feature: GeoJSONFeature): PathData {
  // キャッシュに存在するか確認
  let pathData = pathCache.get(feature);

  if (!pathData) {
    const coordinates = getCordinates(feature);

    // 累積距離を計算
    const lookup = calculateCumulativeDistances(coordinates as Coordinate3D[]);
    const totalDistance = lookup[lookup.length - 1].distance;

    // 計算結果をキャッシュに保存
    pathData = {
      coordinates: coordinates as Coordinate3D[],
      lookup,
      totalDistance,
    };

    pathCache.set(feature, pathData);
  }

  return pathData;
}

export const getCordinates = (feature: GeoJSONFeature): Coordinate3D[] => {
  // GeoJSONからLineStringの座標を取得するために型チェックを追加
  if (
    !feature.geometry ||
    feature.geometry.type !== 'LineString' ||
    !Array.isArray(feature.geometry.coordinates) ||
    feature.geometry.coordinates.length < 2
  ) {
    throw new Error(
      'Invalid GeoJSON: Expected a LineString geometry with sufficient coordinates'
    );
  }
  return feature.geometry.coordinates as Coordinate3D[];
};

/**
 * 指定した距離の位置の座標を計算する（高速版）
 * 1秒間に1000回以上のコールに対応するよう最適化
 *
 * @param geojson GeoJSONデータ（LineString形式のFeatureCollectionを想定）
 * @param distance 始点からの距離（メートル）
 * @returns 指定した距離における座標 [longitude, latitude, elevation] または null（データが無効な場合）
 */
export const getPositionAtDistance = (
  feature: any,
  distance: number
): PositionAtDistance => {
  try {
    // パスデータを取得（キャッシュから、または新規計算）
    const { lookup, totalDistance, coordinates } = getOrCreatePathData(feature);

    // 距離が範囲外の場合は端点を返す
    if (distance <= 0) return coordinates[0];
    if (distance >= totalDistance) return coordinates[coordinates.length - 1];

    // バイナリサーチでセグメントを特定
    const segmentIndex = findSegmentIndexBinarySearch(lookup, distance);
    const current = lookup[segmentIndex];
    const next = lookup[segmentIndex + 1];

    // セグメント内での比率を計算
    const segmentDistance = next.distance - current.distance;
    const ratio = (distance - current.distance) / segmentDistance;

    // 線形補間で座標を計算
    const lon = current.point[0] + ratio * (next.point[0] - current.point[0]);
    const lat = current.point[1] + ratio * (next.point[1] - current.point[1]);
    const elevation =
      current.point[2]! + ratio * (next.point[2]! - current.point[2]!);

    return [lon, lat, elevation];
  } catch (error) {
    // テスト対応のためエラーログ出力を復活
    console.error('Error calculating position at distance:', error);
    return null;
  }
};

/**
 * GeoJSON経路の総距離を計算する
 * @param geojson GeoJSONデータ（LineString形式のFeatureCollectionを想定）
 * @returns 経路の総距離（メートル）または-1（データが無効な場合）
 */
export const getTotalPathDistance = (feature: any): number => {
  try {
    // キャッシュに存在する場合はそこから取得
    const cachedData = pathCache.get(feature);
    if (cachedData) return cachedData.totalDistance;

    // 存在しない場合は計算してキャッシュに保存
    const { totalDistance } = getOrCreatePathData(feature);
    return totalDistance;
  } catch (error) {
    console.error('Error calculating total path distance:', error);
    return -1;
  }
};
