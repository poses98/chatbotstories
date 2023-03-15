import React, { useState, useEffect } from 'react';
import Expo from 'expo';
import { NavigationContainer, DarkTheme } from '@react-navigation/native';
import { AuthStackScreen } from './components/Navigation';
import * as firebase from '@react-native-firebase/app';
//import { firebaseConfig } from "./config";
import { RootStackScreen } from './components/Navigation';
import LoadingScreen from './screens/LoadingScreen';
import * as ScreenOrientation from 'expo-screen-orientation';

async function changeScreenOrientation() {
  await ScreenOrientation.lockAsync(
    ScreenOrientation.OrientationLock.PORTRAIT_UP
  );
}

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(undefined);
  const [isLoading, setIsLoading] = useState(true);
  changeScreenOrientation();

  useEffect(() => {
    if (firebase.auth().currentUser) {
      setIsAuthenticated(true);
    }
    const subscribe = firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        setIsAuthenticated(true);
        setIsLoading(false);
      } else {
        setIsAuthenticated(false);
        setIsLoading(false);
      }
    });
    return subscribe;
  }, []);

  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <NavigationContainer>
      {!isAuthenticated ? <AuthStackScreen /> : <RootStackScreen />}
    </NavigationContainer>
  );
}

const firebaseConfig = {
  apiKey: 'AIzaSyCpitxa6of07zmFhubpG6AH1o9BcGWI4GQ',
  authDomain: 'chatbotstories.firebaseapp.com',
  projectId: 'chatbotstories',
  storageBucket: 'chatbotstories.appspot.com',
  messagingSenderId: '355055867626',
  appId: '1:355055867626:web:b192912fd935da751be993',
  measurementId: 'G-H9MZ3606L3',
};

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
} else {
  firebase.app(); // if already initialized, use that one
}
