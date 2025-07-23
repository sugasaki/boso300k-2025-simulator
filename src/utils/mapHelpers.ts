import maplibregl from 'maplibre-gl';

/** GeoJSONのルートに合わせて、マップの表示範囲を調整する */
export function adjustMapBounds(map: maplibregl.Map, geojson: any): void {
  if (geojson.features.length === 0) return;
  const coords = geojson.features[0].geometry.coordinates;
  if (!coords || coords.length === 0) return;
  const bounds = coords.reduce(
    (b: maplibregl.LngLatBounds, coord: [number, number]) => b.extend(coord),
    new maplibregl.LngLatBounds(coords[0], coords[0])
  );
  map.fitBounds(bounds, { padding: 30 });
}
