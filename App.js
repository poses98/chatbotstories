import React, { useState, useEffect } from 'react';
import Expo from 'expo'
import { NavigationContainer, DarkTheme } from '@react-navigation/native';
import { AuthStackScreen } from './components/Navigation';
import firebase from "firebase/app";
import { firebaseConfig } from "./config";
import { RootStackScreen } from './components/Navigation';
import LoadingScreen from './screens/LoadingScreen';
import * as ScreenOrientation from 'expo-screen-orientation';


async function changeScreenOrientation() {
  await ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT_UP);
}

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(undefined);
  const [isLoading, setIsLoading] = useState(true)
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
    return <LoadingScreen />
  }

  return (
    <NavigationContainer>
      {!isAuthenticated ? <AuthStackScreen /> : <RootStackScreen />}
    </NavigationContainer>
  );
}

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
} else {
  firebase.app(); // if already initialized, use that one
}
