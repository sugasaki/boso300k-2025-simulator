// ペースデータ
export interface PaceRecord {
  time: string; // ペース（MM:SS.mm形式）
  time_second: string; // 同じペース値（文字列形式）
}

// チェックポイントでの記録データ（変換後）
export interface RaceTimeResult {
  leng: number; // 距離
  length_prev: number; // 前のチェックポイントまでの距離
  time: string; // 通過時間（HH:MM:SS形式）
  time_second: number; // 通過時間（秒）
  time_second_prev: number; // 前のチェックポイントの通過時間（秒）
  comment: string; // コメント（順位など）
  speed: number; // 区間の平均時速（km/h）
}

// 変換後の参加者データ
export interface ConvertedRaceParticipant {
  順位: string;
  ゼッケン: string;
  氏名: string;
  firstName: string;
  lastName: string;
  所属: string;
  部門順位: string;
  result: RaceTimeResult[]; // チェックポイントごとの記録
  pace: string; // ペース
}

// 変換後のレースカテゴリーのデータ
export interface ConvertedRaceCategory {
  category: string;
  results: ConvertedRaceParticipant[];
}

// 変換後のレースデータ全体
export type ConvertedRaceData = ConvertedRaceCategory[];

// レース情報の型定義
export interface RaceInfoCategory {
  name: string;
  start_unixtime_jst: number;
  end_unixtime_jst: number;
}

export interface RaceInfo {
  name: string;
  start: string;
  end: string;
  start_unixtime_jst: number;
  end_unixtime_jst: number;
  json_name: string;
  categories: RaceInfoCategory[];
}
