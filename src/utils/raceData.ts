import { getPositionAtDistance } from '../utils/pathUtils';
import { getDistanceAtTime } from '../utils/timeUtils';
import { Scatterplot2D } from '../types/scatterplot';
import { ConvertedRaceParticipant, ConvertedRaceData } from '../types/race';
import { getFeatureData } from '../utils/mapDataLoader';
import { categoryToColor, categoryToFontColor } from './colorTable';
import { Coordinate } from '../types/geo';
import { RaceInfo } from '../types/race';
import { GeoJSONFeature } from '../types/geojson';

/**
 * レースデータから各参加者の現在位置を計算し、表示用のデータを生成する
 *
 * @param raceData 変換済みのレースデータ
 * @param currentTime 現在の時間（UNIXタイムスタンプ）
 * @param raceInfo レース情報
 * @returns 表示用の散布図データ
 */
export const createData = (
  raceData: ConvertedRaceData,
  currentTime: number,
  raceInfo: RaceInfo
): Scatterplot2D[] => {
  try {
    // 各カテゴリごとにデータを処理し、結果を一つの配列に結合
    return raceData.flatMap((category, categoryIndex) => {
      // カテゴリ名を取得
      const categoryName = category.category;

      // カテゴリのスタート時間を取得
      const categoryStartTime = findCategoryStartTime(raceInfo, categoryName);

      // カテゴリ内の経過時間を計算（現在時刻 - カテゴリのスタート時間）
      const elapsedTimeInCategory = currentTime - (categoryStartTime || 0);

      // カテゴリの色を取得
      const color = categoryToColor(categoryName);
      const fontColor = categoryToFontColor(categoryName);

      // カテゴリに対応するコースデータを取得
      const courseFeature = getFeatureData(categoryName);

      // コースデータが見つからない場合は空配列を返す
      if (!courseFeature) {
        console.error(`コースデータが見つかりません: ${categoryName}`);
        return [];
      }

      // 各参加者の位置データを計算
      return calculateParticipantsPositions(
        category.results,
        courseFeature,
        elapsedTimeInCategory,
        color,
        fontColor,
        categoryIndex
      );
    });
  } catch (error) {
    console.error('レースデータの作成中にエラーが発生しました:', error);
    return [];
  }
};

/**
 * レース情報からカテゴリのスタート時間を取得
 */
function findCategoryStartTime(
  raceInfo: RaceInfo,
  categoryName: string
): number | undefined {
  return raceInfo.categories.find(c => c.name === categoryName)
    ?.start_unixtime_jst;
}

/**
 * カテゴリ内の全参加者の位置を計算
 */
function calculateParticipantsPositions(
  participants: ConvertedRaceParticipant[],
  courseFeature: GeoJSONFeature,
  elapsedTime: number,
  color: number[],
  fontColor: number[],
  categoryIndex: number
): Scatterplot2D[] {
  // 各参加者の位置を計算し、無効な位置（nullの結果）をフィルタリング
  return participants
    .map(participant =>
      calculateParticipantPosition(
        courseFeature,
        participant,
        elapsedTime,
        color,
        fontColor,
        categoryIndex
      )
    )
    .filter((position): position is Scatterplot2D => position !== null);
}

/**
 * 個々の参加者の位置を計算
 */
function calculateParticipantPosition(
  courseFeature: GeoJSONFeature,
  participant: ConvertedRaceParticipant,
  elapsedTime: number,
  color: number[],
  fontColor: number[],
  categoryIndex: number
): Scatterplot2D | null {
  try {
    // 経過時間から走行距離を計算（キロメートル単位）
    const distanceKm = getDistanceAtTime(participant, elapsedTime);
    // console.log(distanceKm, 'distanceKm');

    if (distanceKm === null) return null;
    if (distanceKm === 0) return null;

    // キロメートルをメートルに変換
    const distanceMeters = distanceKm * 1000;

    // コース上の距離に対応する位置を取得
    const position3D = getPositionAtDistance(courseFeature, distanceMeters);
    if (position3D === null) return null;

    // 3D座標から2D座標（経度・緯度）を抽出
    const position: Coordinate = [position3D[0], position3D[1]];

    // 散布図データを作成して返す
    return {
      position,
      size: 100,
      color,
      fontColor: fontColor,
      no: participant.ゼッケン,
      name: participant.lastName,
      category: participant.順位,
      categoryIndex: categoryIndex, // Add category index for filtering
      distanceMeters: distanceKm,
    };
  } catch (error) {
    console.error('位置計算中にエラーが発生しました:', error);
    return null;
  }
}
