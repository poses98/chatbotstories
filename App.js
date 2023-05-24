import React, { useEffect, useState } from 'react';
import { NavigationContainer, DarkTheme } from '@react-navigation/native';
import { AuthStackScreen, UserStackScreen } from './components/Navigation';
import * as ScreenOrientation from 'expo-screen-orientation';
import FirebaseProvider from './providers/FirebaseProvider';
import LoadingScreen from './screens/LoadingScreen';
import { getApps } from 'firebase/app';
import { getAuth } from 'firebase/auth';

async function changeScreenOrientation() {
  await ScreenOrientation.lockAsync(
    ScreenOrientation.OrientationLock.PORTRAIT_UP
  );
}

export default function App() {
  useEffect(() => {
    changeScreenOrientation();
  });

  useEffect(() => {
    getApps();
  });

  return (
    <NavigationContainer>
      <FirebaseProvider>
        <UserStackScreen />
      </FirebaseProvider>
    </NavigationContainer>
  );
}
