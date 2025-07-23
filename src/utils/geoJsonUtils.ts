import { GeoJsonLayer } from 'deck.gl';

/**
 * GeoJSONデータからDeckGL用のGeoJsonLayerを生成する
 * @param geojson GeoJSONデータ
 * @param options レイヤーのオプション設定（オプショナル）
 * @returns 設定済みのGeoJsonLayerインスタンス
 */
export const createGeoJsonLayer = (
  geojson: any,
  options: Partial<ConstructorParameters<typeof GeoJsonLayer>[0]> = {}
) => {
  const id = Math.random().toString(32).substring(2);

  return new GeoJsonLayer({
    id: 'geojson-layer' + id,
    data: geojson,
    pickable: false,
    stroked: false,
    filled: true,
    extruded: true,
    lineWidthScale: 1,
    lineWidthMinPixels: 1,
    autoHighlight: true,
    getLineColor: [255, 255, 0, 150],
    // highlightColor: [255, 200, 0],
    getPointRadius: 100,
    getLineWidth: 20,
    // opacity: 0.5,
    lineCapRounded: true, //丸いキャップを描画します。
    lineJointRounded: true, //丸いジョイントを描画します。
    // lineBillboard: true, //
    extensions: [],
    ...options, // カスタムオプションで上書き可能
  });
};

/**
 * エイドステーションなどの補助ポイント用のGeoJsonLayerを生成する
 * @param geojson GeoJSONデータ
 * @param id レイヤーのID接尾辞
 * @param color ポイントの色 [R, G, B, A] (0-255)
 * @param radius ポイントの半径（ピクセル）
 * @param options その他のオプション設定（オプショナル）
 * @returns 設定済みのGeoJsonLayerインスタンス
 */
export const createAidPointLayer = (
  geojson: any,
  id: string = '',
  color: number[] = [255, 0, 0, 200],
  radius: number = 300,
  options: Partial<ConstructorParameters<typeof GeoJsonLayer>[0]> = {}
) => {
  return new GeoJsonLayer({
    id: 'aid-layer' + id,
    data: geojson,
    pickable: true,
    stroked: false,
    filled: true,
    extruded: true,
    getFillColor: () => color as [number, number, number, number],
    fillColor: color,
    getPointRadius: radius,
    pointRadiusMinPixels: 2,
    pointRadiusMaxPixels: 100,
    opacity: 0.5,
    ...options,
  });
};
