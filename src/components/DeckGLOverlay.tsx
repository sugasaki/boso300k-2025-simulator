import { DeckProps } from 'deck.gl';
import { useControl } from 'react-map-gl/maplibre';
import { MapboxOverlay as DeckOverlay } from '@deck.gl/mapbox';

export const DeckGLOverlay = (props: DeckProps) => {
  const overlay = useControl(() => new DeckOverlay(props));

  overlay.setProps(props);
  return null;
};
