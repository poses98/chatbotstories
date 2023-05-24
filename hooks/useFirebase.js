import { useContext } from 'react';
import { FirebaseContext } from '../providers/FirebaseProvider';

const useFirebase = () => {
  const { user, idToken } = useContext(FirebaseContext);

  return { user, idToken };
};

export default useFirebase;
