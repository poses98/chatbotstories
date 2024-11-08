import React, { useState, useEffect, createContext } from 'react';
import useFirebase from '../hooks/useFirebase';
import UserApi from '../api/user';
// create a context for the Firebase user and ID token
export const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [authUser, setAuthUser] = useState(null);
  const { user } = useFirebase();

  const fetchUser = () => {
    if (user) {
      UserApi.getUserById(user.uid)
        .then((response) => {
          setAuthUser(response);
        })
        .catch((err) => {
          /**TODO Handle error */
          console.log(err);
        });
    }
  };

  useEffect(() => {
    if (user) {
      UserApi.getUserById(user.uid)
        .then((response) => {
          setAuthUser(response);
        })
        .catch((err) => {
          /**TODO Handle error */
          console.log(err);
        });
    }
  }, [user]);

  return (
    <AuthContext.Provider value={{ authUser, fetchUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
