import React, { useEffect } from 'react';
import { DarkTheme, NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { UserStackScreen } from './routes/Navigation';
import * as ScreenOrientation from 'expo-screen-orientation';
import FirebaseProvider from './providers/FirebaseProvider';
import AuthProvider from './providers/AuthProvider';
import StoryProvider from './providers/StoryProvider';
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
          <StoryProvider>
            <UserStackScreen />
          </StoryProvider>
        </AuthProvider>
      </FirebaseProvider>
    </NavigationContainer>
  );
}
