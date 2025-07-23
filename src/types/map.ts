// Define types for map-related data

import { Scatterplot2D } from './scatterplot';

// Export Scatterplot2D as PersonLocation for use in the map store
export interface PersonLocation extends Scatterplot2D {
  categoryIndex?: number; // Category index for filtering
}
