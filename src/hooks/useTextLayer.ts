import { TextLayer } from '@deck.gl/layers';
import { useMapStore } from '../store/map/mapStore';
import { containsStringAndNumber } from '../utils/containsNumber';
import { useRaceStore } from '../store';
// import { CollisionFilterExtension } from '@deck.gl/extensions';
// import type { CollisionFilterExtensionProps } from '@deck.gl/extensions';

export const useTextLayer = (noOverlap = false) => {
  const { personLocation, visibleCategories, fontSize } = useMapStore();
  const { focusNumberArray } = useRaceStore();

  // const [zoom, setZoom] = useState<number>(10);
  // const scale = 2 ** zoom;
  // const sizeMaxPixels = (scale / 3) * fontSize;
  // const sizeMinPixels = Math.min(scale / 1000, 0.5) * fontSize;

  // Filter data based on visible categories
  const filteredData = personLocation
    ? personLocation.filter(
        person =>
          typeof person.categoryIndex === 'number' &&
          visibleCategories.includes(person.categoryIndex) &&
          (focusNumberArray.length === 0 ||
            containsStringAndNumber(focusNumberArray, person.name!, person.no!))
      )
    : [];

  const getTextLayer = () => {
    const textLayer = new TextLayer({
      id: 'textLayer-layer',
      data: filteredData,
      characterSet: 'auto',
      fontSettings: {
        buffer: 8,
      },

      // TextLayer options
      getText: d => d.name,
      getPosition: d => d.position,
      getColor: d => d.fontColor, //[255, 255, 255],
      getTextAnchor: 'start', // 'start'、'middle'、'end'
      getAlignmentBaseline: 'bottom', // 'top', 'center', 'bottom'
      getSize: fontSize, // Using fontSize from mapStore
      sizeScale: 1,
      // sizeMaxPixels,
      // sizeMinPixels,
      maxWidth: 64 * 12,

      collisionEnabled: noOverlap, // いっぱい表示が重なる時には間引く
      // CollideExtension options
      // getCollisionPriority: d => Math.log10(d.population),
      // collisionTestProps: {
      //   sizeScale: fontSize * 2,
      //   sizeMaxPixels: sizeMaxPixels * 2,
      //   sizeMinPixels: sizeMinPixels * 2,
      // },
      // extensions: [new CollisionFilterExtension()],
    });
    return textLayer;
  };

  return { getTextLayer };
};
