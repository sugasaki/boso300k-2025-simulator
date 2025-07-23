import { create } from 'zustand';
import { ConvertedRaceData, RaceInfo } from '../../types/race';

type RaceState = {
  runnerIds: string[];
  categoryNo: number;
  raceData: ConvertedRaceData;
  raceInfo: RaceInfo | null;
  isRaceDataLoading: boolean;
  isRaceInfoLoading: boolean;
  raceDataError: string | null;
  raceInfoError: string | null;
  focusNumberArray: string[];
};

export const useRaceStore = create<
  RaceState & {
    setRunnerIds: (ids: string[]) => void;
    setCategoryNo: (category: number) => void;
    setRaceData: (data: ConvertedRaceData) => void;
    setRaceInfo: (data: RaceInfo) => void;
    setRaceDataLoading: (isLoading: boolean) => void;
    setRaceInfoLoading: (isLoading: boolean) => void;
    setRaceDataError: (error: string | null) => void;
    setRaceInfoError: (error: string | null) => void;
    setFocusNumberArray: (numbers: string[]) => void;
  }
>(set => ({
  runnerIds: [],
  categoryNo: 0,
  raceData: [],
  raceInfo: null,
  isRaceDataLoading: true,
  isRaceInfoLoading: true,
  raceDataError: null,
  raceInfoError: null,
  focusNumberArray: [
    'A043', // 宮本
    'A048', // 山﨑 
    'A009', // 池田
    'A020', // 窪田
    'A027', // 菅崎
    'B126', // 佐藤
    'B105', // 島田
    'B110', // 宮崎裕子
  ],
  setRunnerIds: ids => set({ runnerIds: ids }),
  setCategoryNo: categoryNo => set({ categoryNo }),
  setRaceData: data => set({ raceData: data }),
  setRaceInfo: data => set({ raceInfo: data }),
  setRaceDataLoading: isLoading => set({ isRaceDataLoading: isLoading }),
  setRaceInfoLoading: isLoading => set({ isRaceInfoLoading: isLoading }),
  setRaceDataError: error => set({ raceDataError: error }),
  setRaceInfoError: error => set({ raceInfoError: error }),
  setFocusNumberArray: (numbers: string[]) =>
    set({ focusNumberArray: numbers }),
}));
