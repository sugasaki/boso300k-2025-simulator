/**
 * timeUtils関数のパフォーマンスベンチマーク
 */
import { ConvertedRaceParticipant, RaceTimeResult } from '../../types/race';
import { getDistanceAtTime } from '../timeUtils';

// 元の線形探索の実装（比較用）
function getDistanceAtTimeLinear(
  participant: ConvertedRaceParticipant,
  timeSeconds: number
): number | null {
  const results = participant.result;

  if (!results || results.length <= 1) {
    return null;
  }

  if (timeSeconds <= results[0].time_second) {
    return results[0].leng;
  }

  const lastResult = results[results.length - 1];
  if (timeSeconds >= lastResult.time_second) {
    return lastResult.leng;
  }

  for (let i = 0; i < results.length - 1; i++) {
    const current = results[i];
    const next = results[i + 1];

    if (current.time_second <= timeSeconds && timeSeconds < next.time_second) {
      const timeRange = next.time_second - current.time_second;
      const timeRatio = (timeSeconds - current.time_second) / timeRange;
      const distanceRange = next.leng - current.leng;
      return current.leng + distanceRange * timeRatio;
    }
  }

  return null;
}

// テスト用のモックデータを作成
function createMockParticipant(size: number): ConvertedRaceParticipant {
  const results: RaceTimeResult[] = [];

  // サイズに応じたチェックポイントを生成
  for (let i = 0; i < size; i++) {
    results.push({
      leng: i * 10,
      length_prev: i > 0 ? (i - 1) * 10 : 0,
      time: `${Math.floor(i / 60)
        .toString()
        .padStart(2, '0')}:${(i % 60).toString().padStart(2, '0')}:00`,
      time_second: i * 60,
      time_second_prev: i > 0 ? (i - 1) * 60 : 0,
      comment: `CP${i}`,
      speed: 10,
    });
  }

  return {
    順位: '1',
    ゼッケン: '101',
    氏名: 'テスト太郎',
    firstName: '太郎',
    lastName: 'テスト',
    所属: 'テストチーム',
    部門順位: '1',
    pace: '5:00',
    result: results,
  };
}

// ベンチマーク実行関数
function runBenchmark() {
  // 小、中、大のデータセットでテスト
  const sizes = [10, 100, 1000];

  for (const size of sizes) {
    const participant = createMockParticipant(size);

    console.log(`\n===== チェックポイント数: ${size} =====`);

    // 線形探索のベンチマーク
    console.time('線形探索 1000回');
    for (let i = 0; i < 1000; i++) {
      // ランダムな時間を生成（0からsize*60秒の範囲）
      const randomTime = Math.random() * size * 60;
      getDistanceAtTimeLinear(participant, randomTime);
    }
    console.timeEnd('線形探索 1000回');

    // バイナリサーチのベンチマーク
    console.time('バイナリサーチ 1000回');
    for (let i = 0; i < 1000; i++) {
      // 同じシードでランダムな時間を生成
      const randomTime = Math.random() * size * 60;
      getDistanceAtTime(participant, randomTime);
    }
    console.timeEnd('バイナリサーチ 1000回');
  }
}

// Node.jsで実行するためのエクスポート
export { runBenchmark };

// このファイルを直接実行した場合にベンチマークを実行
// Node.jsでは直接実行されたファイルは require.main === module で判定できる
if (typeof require !== 'undefined' && require.main === module) {
  runBenchmark();
}
