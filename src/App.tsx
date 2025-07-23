import { Map } from './components/Map';
import { DrawerBottomMenu } from './components/DrawerBottomMenu';
import { QueryParamHandler } from './components/QueryParamHandler';
import { DrawerOpenButton } from './components/DrawerOpenButton';
import './App.css';
import { Title } from './components/Title';
import { DrawerLeftMenu } from './components/DrawerLeftMenu';
import { DrawerOpenLeftButton } from './components/DrawerOpenLeftButton';

function App() {
  return (
    <>
      {/* QueryParamHandler to handle URL parameters */}
      <QueryParamHandler />

      <DrawerOpenLeftButton />
      <DrawerOpenButton />
      <DrawerLeftMenu />
      <DrawerBottomMenu />

      <Title />

      <Map />
    </>
  );
}

export default App;
