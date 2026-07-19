import maplibregl from 'maplibre-gl';
import type { GeoJSON } from '../types/geojson';

type LngLatTuple = [number, number];

function isPosition(value: unknown): value is number[] {
  return (
    Array.isArray(value) &&
    value.length >= 2 &&
    typeof value[0] === 'number' &&
    Number.isFinite(value[0]) &&
    typeof value[1] === 'number' &&
    Number.isFinite(value[1])
  );
}

/** GeoJSONのルートに合わせて、マップの表示範囲を調整する */
export function adjustMapBounds(map: maplibregl.Map, geojson: GeoJSON): void {
  const geometry = geojson.features[0]?.geometry;
  if (!geometry || geometry.type !== 'LineString') return;

  const { coordinates } = geometry;
  if (!Array.isArray(coordinates) || coordinates.length === 0) return;

  const coords: LngLatTuple[] = [];
  for (const coordinate of coordinates) {
    if (!isPosition(coordinate)) return;
    coords.push([coordinate[0], coordinate[1]]);
  }

  const bounds = coords.reduce(
    (b: maplibregl.LngLatBounds, coord: LngLatTuple) => b.extend(coord),
    new maplibregl.LngLatBounds(coords[0], coords[0])
  );
  map.fitBounds(bounds, { padding: 30 });
}
