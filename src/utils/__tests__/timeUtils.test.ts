import { describe, it, expect } from 'vitest';
import {
  getDistanceAtTime,
  getDistanceAtTimeString,
  convertTimeStringToSeconds,
} from '../timeUtils';
import { ConvertedRaceParticipant } from '../../types/race';

describe('timeUtils', () => {
  // モックデータの作成
  const mockParticipant: ConvertedRaceParticipant = {
    順位: '3',
    ゼッケン: '1234',
    氏名: 'テストランナー',
    firstName: 'ランナー',
    lastName: 'テスト',
    所属: 'テストチーム',
    部門順位: '男子：3',
    pace: '05:00.00',
    result: [
      {
        time: '',
        time_second: 0,
        time_second_prev: 0,
        comment: '',
        leng: 0,
        length_prev: 0,
        speed: 0,
      },
      {
        time: '01:00:00',
        time_second: 3600,
        time_second_prev: 0,
        comment: '1位',
        leng: 10.0,
        length_prev: 0,
        speed: 10.0,
      },
      {
        time: '02:00:00',
        time_second: 7200,
        time_second_prev: 3600,
        comment: '2位',
        leng: 20.0,
        length_prev: 10.0,
        speed: 10.0,
      },
    ],
  };

  describe('getDistanceAtTime', () => {
    it('空の結果配列に対してnullを返す', () => {
      const emptyParticipant: ConvertedRaceParticipant = {
        順位: '',
        ゼッケン: '',
        氏名: '',
        firstName: '',
        lastName: '',
        所属: '',
        部門順位: '',
        pace: '',
        result: [],
      };
      expect(getDistanceAtTime(emptyParticipant, 1800)).toBeNull();
    });

    it('最初のチェックポイント以前の時間では最初の距離を返す', () => {
      const distance = getDistanceAtTime(mockParticipant, 1000);
      expect(distance).toBe(2.7777777777777777);
    });

    it('最後のチェックポイント以降の時間では最後の距離を返す', () => {
      const distance = getDistanceAtTime(mockParticipant, 8000);
      expect(distance).toBeNull();
    });

    it('チェックポイント間の時間では線形補間された距離を返す', () => {
      // 1時間と2時間の中間地点（5400秒 = 1時間30分）での距離をテスト
      const distance = getDistanceAtTime(mockParticipant, 5400);
      // 期待値: 15km (10kmと20kmの中間)
      expect(distance).toBe(15.0);
    });

    it('正確なチェックポイント時間では実際の距離を返す', () => {
      const distance = getDistanceAtTime(mockParticipant, 7200);
      expect(distance).toBeNull();
    });
  });

  describe('getDistanceAtTimeString', () => {
    it('時刻文字列から正しく距離を計算する', () => {
      const distance = getDistanceAtTimeString(mockParticipant, '01:30:00');
      expect(distance).toBe(15.0);
    });

    it('不正な時刻文字列に対して適切に処理する', () => {
      const distance = getDistanceAtTimeString(mockParticipant, 'invalid');
      expect(distance).toBeNull();
    });
  });

  describe('convertTimeStringToSeconds', () => {
    it('正常な時刻文字列を正しく秒数に変換する', () => {
      expect(convertTimeStringToSeconds('01:00:00')).toBe(3600);
      expect(convertTimeStringToSeconds('00:30:00')).toBe(1800);
      expect(convertTimeStringToSeconds('00:00:30')).toBe(30);
    });

    it('空文字列に対して0を返す', () => {
      expect(convertTimeStringToSeconds('')).toBe(0);
    });

    it('不正な形式の文字列に対して0を返す', () => {
      expect(convertTimeStringToSeconds('invalid')).toBe(0);
      expect(convertTimeStringToSeconds('1:2:3')).toBe(3723);
    });
  });
});
