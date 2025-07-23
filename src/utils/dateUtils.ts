import { format } from 'date-fns';

/**
 * unixtimeを日付形式に変換する関数
 * @param unixtime UNIXタイムスタンプ（秒単位）
 * @returns フォーマットされた日付文字列
 */
export const formatUnixTime = (unixtime: number): string => {
  const date = new Date(unixtime * 1000); // JavaScriptのDateはミリ秒単位なので1000倍する
  return format(date, 'yyyy/MM/dd HH:mm:ss');
};
