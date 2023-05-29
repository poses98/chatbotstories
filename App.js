import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { UserStackScreen } from './routes/Navigation';
import * as ScreenOrientation from 'expo-screen-orientation';
import FirebaseProvider from './providers/FirebaseProvider';
import AuthProvider from './providers/AuthProvider';
import { getApps } from 'firebase/app';

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
        <AuthProvider>
          <UserStackScreen />
        </AuthProvider>
      </FirebaseProvider>
    </NavigationContainer>
  );
}
