import { Drawer, Space, Button } from 'antd';
import { useAppStore } from '../store';
import { DrawerMenu } from './DrawerMenu';

export const DrawerBottomMenu = () => {
  const { isDrawerMenuOpen, setIsDrawerMenuOpen } = useAppStore();

  const onClose = () => {
    setIsDrawerMenuOpen(false);
  };

  return (
    <>
      <Drawer
        title="Action Menu"
        placement="bottom"
        onClose={onClose}
        open={isDrawerMenuOpen}
        height={400}
        extra={
          <Space>
            <Button type="primary" onClick={onClose}>
              OK
            </Button>
          </Space>
        }
      >
        <DrawerMenu />
      </Drawer>
    </>
  );
};
