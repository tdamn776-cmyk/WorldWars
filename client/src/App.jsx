import React, { useEffect } from 'react';
import { Capacitor } from '@capacitor/core';
import { StatusBar } from '@capacitor/status-bar';
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
    if (Capacitor.isNativePlatform()) {
      StatusBar.hide().catch(e => console.warn('Could not hide status bar', e));
    }
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
