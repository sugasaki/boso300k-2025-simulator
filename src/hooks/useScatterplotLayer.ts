import { ScatterplotLayer } from 'deck.gl';
import { useMapStore } from '../store/map/mapStore';

export const useScatterplotLayer = () => {
  const { personLocation, visibleCategories, pointSize } = useMapStore();

  const getScatterplotLayer = () => {
    // Filter data based on visible categories
    // 空の配列の場合は何も表示しない
    const filteredData = personLocation
      ? personLocation
        .filter(
          person =>
            typeof person.categoryIndex === 'number' &&
            visibleCategories.includes(person.categoryIndex)
        )
        .map(person => ({
          ...person,
          size: pointSize, // Apply the global point size to each point
        }))
      : [];

    const scatterplotLayer = new ScatterplotLayer({
      id: 'scatterplot-layer',
      data: filteredData,
      billboard: true, // trueの場合、レンダリングされた円は常にカメラの方向を向きます。
      pickable: true,
      opacity: 0.8,
      stroked: false,
      filled: true,
      radiusScale: 1,
      radiusMinPixels: 1,
      radiusMaxPixels: 100,
      lineWidthMinPixels: 0,
      getPosition: d => d.position,
      getRadius: d => d.size,
      getFillColor: d => d.color,
      getLineColor: d =>
        d.distanceMeters > 210 ? [0, 0, 0, 255] : [255, 0, 0, 0],
      getLineWidth: 0,
    });
    return scatterplotLayer;
  };

  return { getScatterplotLayer };
};
