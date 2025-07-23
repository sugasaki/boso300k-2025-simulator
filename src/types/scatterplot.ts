import { Coordinate } from './geo';

export type Scatterplot2D = {
  position: Coordinate;
  size: number;
  color?: number[];
  fontColor?: number[];
  // Additional properties for participant information
  no?: string;
  name?: string;
  category?: string;
  categoryIndex?: number; // Add category index for filtering
  distanceMeters?: number;
};
