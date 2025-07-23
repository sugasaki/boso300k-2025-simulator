import { RaceInfo } from '../types/race';

/**
 * Creates category options from race info categories
 * @param raceInfo The race information containing categories
 * @returns An array of category options with label and value properties
 */
export const createCategoryOptions = (raceInfo: RaceInfo) => {
  if (!raceInfo || !raceInfo.categories) {
    return [];
  }

  return raceInfo.categories.map((category, index) => ({
    label: category.name,
    value: index,
  }));
};

/**
 * Gets all category indices from race info
 * @param raceInfo The race information containing categories
 * @returns An array of all category indices
 */
export const getAllCategoryIndices = (raceInfo: RaceInfo) => {
  const options = createCategoryOptions(raceInfo);
  return options.map(option => option.value);
};
