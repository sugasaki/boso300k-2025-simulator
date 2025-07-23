import { Switch, Divider, Slider } from 'antd';
import { CategoryFilter } from './CategoryFilter';
import { useMapStore } from '../store';
import { useAnimationStore } from '../store';
import { FocusNumberInput } from './FocusNumberInput';

export const DrawerMenu = () => {
  // タッチイベントの拡大を防止するための関数
  const preventZoom = (e: React.TouchEvent) => {
    // マルチタッチジェスチャー時のみ拡大を防止
    if (e.touches && e.touches.length > 1) {
      e.preventDefault();
      e.stopPropagation();
    }
  };
  const {
    isTextLayerVisible,
    toggleTextLayerVisibility,
    pointSize,
    setPointSize,
    fontSize,
    setFontSize,
  } = useMapStore();

  const { animationSpeed, setAnimationSpeed } = useAnimationStore();

  return (
    <div 
      onTouchStart={preventZoom}
      onTouchMove={preventZoom}
    >
      <Divider orientation="center">検索</Divider>

      <FocusNumberInput />

      <Divider orientation="center">カテゴリー</Divider>

      <CategoryFilter />

      <Divider orientation="center">名前表示</Divider>

      <div className="mb-4">
        <div className="flex items-center gap-4 mb-2">
          <span>名前表示</span>
          <Switch
            checked={isTextLayerVisible}
            onChange={toggleTextLayerVisibility}
            checkedChildren="ON"
            unCheckedChildren="OFF"
          />
        </div>

        <Divider orientation="center">ボールサイズ</Divider>

        <div className="mb-4">
          <Slider
            min={5}
            max={400}
            value={pointSize}
            onChange={setPointSize}
            // marks={{
            //   50: '特小',
            //   100: '小',
            //   200: '中',
            //   350: '大',
            //   500: '特大',
            // }}
          />
        </div>

        <Divider orientation="center">フォントサイズ</Divider>

        <div className="mb-4">
          <Slider
            min={8}
            max={24}
            value={fontSize}
            onChange={setFontSize}
            // marks={{
            //   8: '小',
            //   12: '中',
            //   16: '大',
            //   20: '特大',
            //   24: '極大',
            // }}
          />
        </div>

        <Divider orientation="center">アニメーション速度</Divider>

        <div className="mb-4">
          <Slider
            min={1}
            max={50}
            value={animationSpeed}
            onChange={setAnimationSpeed}
            marks={{
              1: '遅い',
              10: '普通',
              30: '速い',
              50: '最速',
            }}
          />
        </div>
      </div>
    </div>
  );
};
