/**
 * 時間に関するユーティリティ関数
 * 時間からレース参加者の距離を計算する機能を提供
 */
import { ConvertedRaceParticipant } from '../types/race';

/**
 * 指定した時間（秒）における距離を線形補間で計算する
 * チェックポイント間の関係を time_second_prev と length_prev を使用して計算
 * @param participant レース参加者データ
 * @param timeSeconds 計算したい時間（秒）
 * @returns 計算された距離（km）、または未定義の場合は null
 */
export function getDistanceAtTime(
  participant: ConvertedRaceParticipant,
  timeSeconds: number
): number | null {
  // const results = participant.result;
  // console.log(participant, 'participant');
  const results = participant.result;

  // 結果がない、または1つしかない場合はnullを返す
  if (!results || results.length <= 1) {
    return null;
  }

  // 時間が最初のチェックポイント以前の場合はnullを返す
  if (timeSeconds <= results[0].time_second) {
    // 最初のチェックポイントの距離を返す（線形補間）
    return null;
  }

  // 時間が最後のチェックポイント以降の場合はnullを返す
  const lastResult = results[results.length - 1];
  if (timeSeconds >= lastResult.time_second) {
    return null;
  }

  // 適切なチェックポイントを見つける
  // time_second と time_second_prev を使用して区間を特定
  for (let i = 1; i < results.length; i++) {
    const current = results[i];
    // console.log('current', current);

    if (
      current.time_second_prev <= timeSeconds &&
      timeSeconds <= current.time_second
    ) {
      // 線形補間を行う
      // console.log('線形補間を行う', current);
      const timeRange = current.time_second - current.time_second_prev;
      const timeRatio = (timeSeconds - current.time_second_prev) / timeRange;
      const distanceRange = current.leng - current.length_prev;
      return current.length_prev + distanceRange * timeRatio;
    }
  }

  // 何らかの理由で見つからなかった場合
  // console.warn('指定された時間に対応するチェックポイントが見つかりませんでした');
  return null;
}

/**
 * 指定した時間（時:分:秒形式）における距離を線形補間で計算する
 * @param participant レース参加者データ
 * @param timeString 計算したい時間（HH:MM:SS形式）
 * @returns 計算された距離（km）、または未定義の場合は null
 */
export function getDistanceAtTimeString(
  participant: ConvertedRaceParticipant,
  timeString: string
): number | null {
  // 時:分:秒形式から秒に変換
  const timeSeconds = convertTimeStringToSeconds(timeString);
  // 無効な時間文字列の場合はnullを返す
  if (timeSeconds === 0 && timeString !== '' && timeString !== '00:00:00') {
    return null;
  }
  return getDistanceAtTime(participant, timeSeconds);
}

/**
 * 時:分:秒形式の文字列を秒数に変換する
 * @param timeString 時間文字列（HH:MM:SS形式）
 * @returns 秒数
 */
export function convertTimeStringToSeconds(timeString: string): number {
  if (!timeString) return 0;

  const parts = timeString.split(':');
  if (parts.length !== 3) {
    console.warn('不正な時間形式です:', timeString);
    return 0;
  }

  const hours = parseInt(parts[0], 10);
  const minutes = parseInt(parts[1], 10);
  const seconds = parseInt(parts[2], 10);

  return hours * 3600 + minutes * 60 + seconds;
}
