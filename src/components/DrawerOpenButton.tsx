import { useAppStore } from '../store';
import { Button } from 'antd';
import { VerticalAlignTopOutlined } from '@ant-design/icons';

export const DrawerOpenButton = () => {
  const { setIsDrawerMenuOpen } = useAppStore();

  return (
    <div className="fixed bottom-20 right-5 z-10">
      <Button
        ghost
        shape="circle"
        type="default"
        icon={<VerticalAlignTopOutlined />}
        onClick={() => setIsDrawerMenuOpen(true)}
        size="middle" // large | middle | small
      />
    </div>
  );
};
