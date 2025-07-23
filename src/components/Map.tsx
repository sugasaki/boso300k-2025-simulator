import { useEffect } from 'react';
import {
  fetchAndStoreRaceData,
  fetchAndStoreRaceInfo,
} from '../utils/raceDataLoader';
import { DeckGLMap } from '../components/DeckGLMap';
import { AnimationFrame } from '../components/AnimationFrame';
import { AnimationControls } from '../components/AnimationControls';
import { RaceTimeline } from '../components/RaceTimeline';
import { useResultData } from '../hooks/useResultData';
import { useAnimationStore } from '../store/animation/animationStore';
import { useRaceStore } from '../store/race/raceStore';
import { useMapStore } from '../store';
import { getAllCategoryIndices } from '../utils/categoryUtils';

const url = './data/race_6881_converted.json';
const race_info_url = './data/race_info.json';

export const Map = () => {
  const { animationFrameValue } = useAnimationStore();
  const { createResultData } = useResultData();

  const { raceInfo } = useRaceStore();
  const { setVisibleCategories } = useMapStore();

  useEffect(() => {
    if (raceInfo && raceInfo.categories) {
      // Initially set all categories as checked
      const allCategoryIndices = getAllCategoryIndices(raceInfo);
      setVisibleCategories(allCategoryIndices);
    }
  }, [raceInfo, setVisibleCategories]);

  useEffect(() => {
    (async () => {
      // レース情報を読み込む
      await fetchAndStoreRaceInfo(race_info_url);

      // レースデータを読み込む
      await fetchAndStoreRaceData(url);
    })();
  }, []);

  useEffect(() => {
    // animationFrameValueに応じた各選手の位置情報を計算
    createResultData(animationFrameValue);
  }, [animationFrameValue, createResultData]);

  return (
    <div className="app-container dark:bg-gray-900 dark:text-white">
      {/* Map as background */}
      <div className="map-container">
        <DeckGLMap />
      </div>

      {/* Overlay content */}
      <div className="overlay-container">
        <div className="play-container">
          <AnimationControls />
        </div>

        {/* Timeline at the bottom */}
        <div
          className="timeline-container"
          style={{
            position: 'fixed',
            bottom: '0.5rem',
            left: '1rem',
            right: '1rem',
            zIndex: 20,
          }}
        >
          <AnimationFrame />
          <RaceTimeline />
        </div>
      </div>
    </div>
  );
};
