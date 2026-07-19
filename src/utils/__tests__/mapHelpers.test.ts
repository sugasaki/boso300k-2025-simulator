// @vitest-environment node

import { describe, expect, it, vi } from 'vitest';
import type { GeoJSON } from '../../types/geojson';
import { adjustMapBounds } from '../mapHelpers';

function createMapMock() {
  const fitBounds = vi.fn();
  const map = { fitBounds } as unknown as Parameters<
    typeof adjustMapBounds
  >[0];

  return { map, fitBounds };
}

function createGeoJSON(
  type: string,
  coordinates: GeoJSON['features'][number]['geometry']['coordinates']
): GeoJSON {
  return {
    type: 'FeatureCollection',
    features: [
      {
        type: 'Feature',
        properties: {},
        geometry: { type, coordinates },
      },
    ],
  };
}

describe('adjustMapBounds', () => {
  it('LineString の座標に合わせて表示範囲を調整する', () => {
    const { map, fitBounds } = createMapMock();
    const geojson = createGeoJSON('LineString', [
      [139.0, 35.0],
      [140.0, 36.0],
    ]);

    adjustMapBounds(map, geojson);

    expect(fitBounds).toHaveBeenCalledOnce();
    expect(fitBounds).toHaveBeenCalledWith(expect.anything(), { padding: 30 });
  });

  it('LineString 以外の geometry は処理しない', () => {
    const { map, fitBounds } = createMapMock();
    const geojson = createGeoJSON('Point', [139.0, 35.0]);

    adjustMapBounds(map, geojson);

    expect(fitBounds).not.toHaveBeenCalled();
  });

  it('不正な LineString 座標は処理しない', () => {
    const { map, fitBounds } = createMapMock();
    const geojson = createGeoJSON('LineString', [
      [139.0, 35.0],
      [140.0],
    ]);

    adjustMapBounds(map, geojson);

    expect(fitBounds).not.toHaveBeenCalled();
  });
});
