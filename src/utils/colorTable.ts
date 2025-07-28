//
const colorTable = [
  [255, 0, 0], // 赤
  [0, 255, 0], // 緑
  [0, 0, 255], // 青
  [255, 0, 255], // マゼンタ
  [255, 165, 0], // オレンジ
  [0, 255, 255], // シアン
  [128, 0, 128], // 紫
  [255, 255, 0], // 黄色
  [0, 128, 128], // ティール
  [255, 20, 147], // ピンク
  [127, 255, 0], // 春の緑
  [0, 0, 128], // ネイビー
  // [255, 140, 0], // ダークオレンジ
  [0, 255, 127], // シーグリーン
  [138, 43, 226], // ブルーバイオレット
  [255, 69, 0], // レッドオレンジ
  [70, 130, 180], // スチールブルー
  [152, 251, 152], // ペールグリーン
  [255, 105, 180], // ホットピンク
  [0, 206, 209], // ダークターコイズ
  // [148, 0, 211], // ダークバイオレット
  [173, 255, 47], // グリーンイエロー
  [65, 105, 225], // ロイヤルブルー
  [255, 0, 127], // ローズ
  [124, 252, 0], // ローングリーン
  // [0, 191, 255], // ディープスカイブルー
  [255, 105, 97], // サーモン
  // [75, 0, 130], // インディゴ
  [255, 215, 0], // ゴールド
  [127, 255, 212], // アクアマリン
];

export const getRandomColor = (number: number) => {
  // カラーテーブルの長さで割った余りを使用してインデックスを計算
  const index = number % colorTable.length;
  // console.log(index, 'index');
  return colorTable[index];
};

/// RGBをHEXに変換する
export const rgbToHex = (rgb: number[]) => {
  return `#${rgb
    .map((x: number) => {
      const hex = x.toString(16);
      return hex.length === 1 ? '0' + hex : hex;
    })
    .join('')}`;
};

export const getColor = (no: number) => {
  // console.log(no, 'no');
  const color = getRandomColor(no);
  // console.log(color, 'color');
  return color;
};

// カテゴリと色の対応表を定義
const categoryColors: { [key: string]: number[] } = {
  '2025-bousou300k': [255, 0, 0], // ローズ
  '2025-bousou210k': [0, 255, 255], // シアン
  // 房総半島300K260km: [255, 0, 255], // マゼンタ
  // 小江戸90km: [127, 255, 0], // 春の緑
  // 大江戸ナイトラン115km: [0, 255, 255], // シアン
  // 他のカテゴリと色の対応を追加することができます
};

const categoryFontColors: { [key: string]: number[] } = {
  '2025-bousou300k': [255, 200, 200], // ローズ
  '2025-bousou210k': [0, 255, 255], // シアン
  // 房総半島300K260km: [255, 200, 255], // マゼンタ
  // 小江戸90km: [127, 255, 200], // 春の緑
  // 大江戸ナイトラン115km: [150, 255, 255], // シアン
  // 他のカテゴリと色の対応を追加することができます
};

export const categoryToColor = (categoryName: keyof typeof categoryColors) => {
  // console.log(categoryName, 'categoryName');

  // カテゴリに対応する色を返す、対応する色がない場合はデフォルトの色を返す
  return categoryColors[categoryName] || [255, 255, 255]; // 対応する色がない場合のデフォルトは白
};

export const categoryToFontColor = (
  categoryName: keyof typeof categoryColors
) => {
  // console.log(categoryName, 'categoryName');

  // カテゴリに対応する色を返す、対応する色がない場合はデフォルトの色を返す
  return categoryFontColors[categoryName] || [255, 255, 255]; // 対応する色がない場合のデフォルトは白
};
