/**
 * 数字の配列に特定の数字が含まれているか判定
 * @param numbers
 * @param target
 * @returns
 */
export const containsNumber = (numberArray: string[], target: string) => {
  if (!numberArray) return false;
  return numberArray.includes(target.toString());
};

/**
 * 文字列を空白で分割して数字の配列に変換
 * @param numbers
 * @param target
 * @returns
 */
export const containsString = (numberArray: string[], target: string) => {
  if (!numberArray) return false;
  // console.log('target', target);
  try {
    // 文字列を空白で分割して数字の配列に変換
    // 配列に特定の数字が含まれているか判定
    const ret = numberArray.find(d => target.indexOf(d) > -1);
    if ((ret?.length ?? 0) > 0) return true;
  } catch (e) {
    console.log(e, 'error1');
    return false;
  }
};

/**
 * 文字列を空白で分割して数字の配列に変換
 * @param numbers
 * @param target
 * @returns
 */
export const containsStringAndNumber = (
  numbers: string[],
  name: string,
  no: string
) => {
  if (!numbers) return false;
  if (numbers[0] == '') return false;
  // console.log(numbers, name, no);

  // 配列に特定の数字が含まれているか判定
  // const numberRet = containsNumber(numbers, no);
  const numberRet = containsNumber(numbers, no);
  if (numberRet) return true;

  // 配列に特定の文字が含まれているか判定
  const stringRet = containsString(numbers, name);
  if (stringRet) return true;

  return false;
};
