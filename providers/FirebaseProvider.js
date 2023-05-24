import React, { useState, useEffect, createContext } from 'react';
import { getAuth, getIdToken } from 'firebase/auth';
import { auth } from '../firebase';
import { getData, storeData } from '../services/dataStorage';
// create a context for the Firebase user and ID token
export const FirebaseContext = createContext();

const FirebaseProvider = ({ children }) => {
  const [user, setUser] = useState(getAuth().currentUser || null);
  const [idToken, setIdToken] = useState(user ? getIdToken(user) : null);

  // initialize Firebase authentication
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setUser(user);
        user
          .getIdToken()
          .then((token) => {
            storeData('idToken', token);
            setIdToken(token);
          })
          .catch((error) => {
            console.error(error);
          });
      } else {
        setUser(null);
        setIdToken(null);
      }
    });

    // unsubscribe from Firebase authentication when the component unmounts
    return () => {
      unsubscribe();
    };
  }, []);

  useEffect(() => {
    try {
      const token = getData('idToken');
      if (token !== null) {
        if (!user) {
          console.log(token);
          /* signInWithCustomToken(token)
            .then((userCredential) => {})
            .catch((e) => {
              console.error(e);
            }); */
        }
      }
    } catch (e) {
      console.error(e);
    }
  });

  return (
    <FirebaseContext.Provider value={{ user, idToken }}>
      {children}
    </FirebaseContext.Provider>
  );
};

export default FirebaseProvider;
