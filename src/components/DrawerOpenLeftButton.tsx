import { useAppStore } from '../store';
import { MenuOutlined } from '@ant-design/icons';

export const DrawerOpenLeftButton = () => {
  const { setIsLeftDrawerMenuOpen } = useAppStore();

  // マウスクリック用ハンドラー
  const handleMouseClick = (e: React.MouseEvent) => {
    // クリックイベントの伝播を止めてズームを防止
    e.preventDefault();
    e.stopPropagation();
    setIsLeftDrawerMenuOpen(true);
  };

  // タッチ用ハンドラー
  const handleTouch = (e: React.TouchEvent) => {
    // タッチイベントの伝播を止めてズームを防止
    e.preventDefault();
    e.stopPropagation();
    setIsLeftDrawerMenuOpen(true);
  };

  return (
    <div className="fixed top-2 left-2 z-10">
      <MenuOutlined
        style={{ fontSize: '18px', color: '#fff' }}
        onClick={handleMouseClick}
        onTouchEnd={handleTouch}
      />
    </div>
  );
};
