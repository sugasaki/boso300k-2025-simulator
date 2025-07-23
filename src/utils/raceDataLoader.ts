/**
 * レースデータを読み込むためのユーティリティ関数
 */
import { useRaceStore } from '../store/race/raceStore';
import { useAnimationStore } from '../store/animation/animationStore';
import { loadRaceData, loadRaceInfo } from './fetcher';
import { ConvertedRaceData } from '../types/race';

/**
 * レースデータを読み込み、ストアに保存する
 * @param path JSONファイルのパス
 */
export async function fetchAndStoreRaceData(path: string): Promise<void> {
  const { setRaceData, setRaceDataLoading, setRaceDataError } =
    useRaceStore.getState();

  try {
    setRaceDataLoading(true);

    const raceData = await loadRaceData(path);
    // console.log('loadRaceData', raceData);

    // 姓名を分割して firstName と lastName を追加
    const processedRaceData: ConvertedRaceData = raceData.map(category => {
      return {
        ...category,
        results: category.results.map(participant => {
          // 全角スペース「　」で名前を分割
          const nameParts = participant.氏名.split('　');
          let lastName = '';
          let firstName = '';

          if (nameParts.length >= 2) {
            // 姓と名が分割できた場合
            lastName = nameParts[0];
            firstName = nameParts[1];
          } else {
            // 分割できなかった場合は名前全体を姓として扱う
            lastName = participant.氏名;
          }

          return {
            ...participant,
            firstName,
            lastName,
          };
        }),
      };
    });

    setRaceData(processedRaceData);

    setRaceDataError(null);
  } catch (err) {
    setRaceDataError('レースデータの読み込みに失敗しました');
    console.error(err);
  } finally {
    setRaceDataLoading(false);
  }
}

/**
 * レース情報を読み込み、ストアに保存する
 * @param path JSONファイルのパス
 */
export async function fetchAndStoreRaceInfo(path: string): Promise<void> {
  const { setRaceInfo, setRaceInfoLoading, setRaceInfoError } =
    useRaceStore.getState();
  const { setAnimationFrame, setAnimationFrameMin, setAnimationFrameMax } =
    useAnimationStore.getState();

  try {
    setRaceInfoLoading(true);

    const raceInfo = await loadRaceInfo(path);
    // console.log('loadRaceInfo', raceInfo);

    setRaceInfo(raceInfo);

    // タイムラインの範囲を設定
    const yohaku = 1800;
    setAnimationFrame(raceInfo.start_unixtime_jst - 0);
    setAnimationFrameMin(raceInfo.start_unixtime_jst - yohaku);
    setAnimationFrameMax(raceInfo.end_unixtime_jst + yohaku);

    setRaceInfoError(null);
  } catch (err) {
    setRaceInfoError('レース情報の読み込みに失敗しました');
    console.error(err);
  } finally {
    setRaceInfoLoading(false);
  }
}
