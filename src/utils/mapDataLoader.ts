import aidPointsJson from '../data/2025/2025-房総半島300K-CP.json';
import { importGeoJsonFiles } from './dynamicImport';
import { GeoJSON, GeoJSONFeature } from '../types/geojson';

/**
 * コースのGeoJSONデータ
 * ファイル名をキーとして管理
 */
// 初期化時に全てのGeoJSONファイルを読み込む
export const courseDataMap: Record<string, GeoJSON> =
  importGeoJsonFiles<GeoJSON>();

export const courseData = courseDataMap['2025-bousou300k'];
/**
 * エイドポイントのGeoJSONデータ
 */
export const aidPointsData = aidPointsJson as unknown as GeoJSON;

/**
 * 皇居の座標 (地図の初期表示位置)
 */
export const IMPERIAL_PALACE_LOCATION = {
  longitude: 139.482339983806,
  latitude: 35.91942991130054,
  zoom: 13,
  bearing: 0,
  pitch: 20,
};

/**
 * マップスタイルのURL
 * @param apiKey MapTilerのAPIキー
 * @returns マップスタイルのURL
 */
export const getMapStyle = (apiKey: string): string => {
  return `https://basemaps.cartocdn.com/gl/dark-matter-nolabels-gl-style/style.json?key=${apiKey}`;
};

/**
 * 利用可能なコースの名前一覧を取得
 * @returns コース名の配列
 */
export const getAvailableCourses = (): string[] => {
  return Object.keys(courseDataMap);
};

export const getFeatureData = (categoryName: string): GeoJSONFeature | null => {
  const featureData = courseDataMap[categoryName].features?.[0];
  return featureData;
};
