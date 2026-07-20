import React, { useEffect } from 'react';
import useGameStore from './stores/useGameStore';
import usePlayerStore from './stores/usePlayerStore';

import SplashScreen from './screens/SplashScreen';
import AuthScreen from './screens/AuthScreen';
import MainMenuScreen from './screens/MainMenuScreen';
import BattleScreen from './screens/BattleScreen';
import GarageScreen from './screens/GarageScreen';
import ShopScreen from './screens/ShopScreen';
import AdminScreen from './screens/AdminScreen';

function App() {
  const { screen } = useGameStore();
  const { isLoggedIn } = usePlayerStore();

  useEffect(() => {
    const requestFullscreen = async () => {
      try {
        if (document.documentElement.requestFullscreen) {
          await document.documentElement.requestFullscreen();
        } else if (document.documentElement.webkitRequestFullscreen) {
          await document.documentElement.webkitRequestFullscreen();
        }
      } catch (e) {}
    };

    const handleFirstTouch = () => {
      requestFullscreen();
      document.removeEventListener('touchstart', handleFirstTouch);
      document.removeEventListener('click', handleFirstTouch);
    };

    document.addEventListener('touchstart', handleFirstTouch);
    document.addEventListener('click', handleFirstTouch);

    return () => {
      document.removeEventListener('touchstart', handleFirstTouch);
      document.removeEventListener('click', handleFirstTouch);
    };
  }, []);

  return (
    <>
      {screen === 'splash' && <SplashScreen />}
      {screen === 'auth' && <AuthScreen />}
      {screen === 'mainMenu' && <MainMenuScreen />}
      {screen === 'battle' && <BattleScreen />}
      {screen === 'garage' && <GarageScreen />}
      {screen === 'shop' && <ShopScreen />}
      {screen === 'admin' && <AdminScreen />}
    </>
  );
}

export default App;
