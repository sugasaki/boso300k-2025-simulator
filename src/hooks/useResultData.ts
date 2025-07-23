import { useRaceStore } from '../store/race/raceStore';
import { useMapStore } from '../store/map/mapStore';
import { createData } from '../utils/raceData';
import { PersonLocation } from '../types/map';
import { useCallback } from 'react';

export const useResultData = () => {
  const { raceData, raceInfo } = useRaceStore();
  const { setPersonLocationData } = useMapStore();

  const createResultData = useCallback((time: number): PersonLocation[] | null => {
    if (!raceData || raceData == null) return null;
    if (!raceInfo || raceInfo == null) return null;

    const result = createData(raceData, time, raceInfo);
    setPersonLocationData(result);
    return result;
  }, [raceData, raceInfo, setPersonLocationData]);

  return { createResultData };
};
