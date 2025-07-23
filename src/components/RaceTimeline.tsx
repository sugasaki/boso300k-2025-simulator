import React from 'react';
import { TimelineControl } from './TimelineControl';
import { useAnimationStore } from '../store/animation/animationStore';
import { useRaceStore } from '../store';

interface RaceTimelineProps {
  height?: string;
  customTimeColor?: string;
}

export const RaceTimeline: React.FC<RaceTimelineProps> = ({
  height = '60px',
  customTimeColor = '#FF5733',
}) => {
  const { animationFrameValue, setAnimationFrame } = useAnimationStore();
  const { raceInfo } = useRaceStore();

  // レース情報がない場合のデフォルト値
  const defaultMin = 0;
  const defaultMax = 100;

  // レース情報から開始時間と終了時間を取得
  const yohaku = 1800;
  const min = raceInfo ? raceInfo.start_unixtime_jst - yohaku : defaultMin;
  const max = raceInfo ? raceInfo.end_unixtime_jst + yohaku : defaultMax;

  // タイムラインの時間が変更されたときのハンドラー
  const handleTimeChange = (time: number) => {
    setAnimationFrame(time);
  };

  return (
    <>
      <TimelineControl
        min={min}
        max={max}
        currentTime={animationFrameValue}
        onTimeChange={handleTimeChange}
        height={height}
        customTimeColor={customTimeColor}
      />
    </>
  );
};
