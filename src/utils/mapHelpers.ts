import maplibregl from 'maplibre-gl';
import { GeoJSON } from '../types/geojson';

/** GeoJSONのルートに合わせて、マップの表示範囲を調整する */
export function adjustMapBounds(map: maplibregl.Map, geojson: GeoJSON): void {
  if (geojson.features.length === 0) return;
  // コースは LineString 前提のため [lon, lat] の座標配列として扱う
  const coords = geojson.features[0].geometry.coordinates as [number, number][];
  if (!coords || coords.length === 0) return;
  const bounds = coords.reduce(
    (b: maplibregl.LngLatBounds, coord: [number, number]) => b.extend(coord),
    new maplibregl.LngLatBounds(coords[0], coords[0])
  );
  map.fitBounds(bounds, { padding: 30 });
}
