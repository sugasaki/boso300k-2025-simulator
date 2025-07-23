import { Input, Button, Typography } from 'antd';
import { useState, useEffect } from 'react';
import { useRaceStore } from '../store';

const { TextArea } = Input;
const { Text } = Typography;

export const FocusNumberInput = () => {
  const { focusNumberArray, setFocusNumberArray } = useRaceStore();
  const [inputValue, setInputValue] = useState('');

  // 配列を文字列に変換（表示用）
  const arrayToString = (arr: string[]) => {
    return arr.join(' ');
  };

  // 初期表示時にfocusNumberArrayの値をテキストボックスに表示
  useEffect(() => {
    setInputValue(arrayToString(focusNumberArray));
  }, [focusNumberArray]);

  // 入力値の変更を処理
  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = e.target.value;
    setInputValue(newValue);
  };

  // 入力値を配列に変換して保存（Enterキーが押されたときやフォーカスが外れたとき）
  const handleInputConfirm = () => {
    if (inputValue.trim()) {
      // 空白で区切って配列に変換
      const newArray = inputValue
        .split(/\s+/)
        .filter(item => item.trim() !== '');

      setFocusNumberArray(newArray);
    } else {
      // 入力が空の場合は空の配列をセット
      setFocusNumberArray([]);
    }
  };

  // 配列をクリア
  const clearArray = () => {
    setFocusNumberArray([]);
    setInputValue('');
  };

  return (
    <div className="mb-4">
      <div className="mb-2">
        <Text>表示対象のゼッケン番号または名前を入力（空白区切り）</Text>
      </div>
      <TextArea
        value={inputValue}
        onChange={handleInputChange}
        onPressEnter={handleInputConfirm}
        onBlur={handleInputConfirm}
        placeholder="例: 2151 2114 5 1008"
        autoSize={{ minRows: 2, maxRows: 4 }}
        className="mb-2"
      />
      <div className="flex justify-end">
        <Button danger onClick={clearArray}>
          クリア
        </Button>
      </div>
      <div className="mt-2 text-xs text-gray-500">
        現在の表示対象:{' '}
        {focusNumberArray.length > 0 ? arrayToString(focusNumberArray) : 'なし'}
      </div>
    </div>
  );
};
