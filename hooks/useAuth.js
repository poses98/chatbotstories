import { useContext } from 'react';
import { AuthContext } from '../providers/AuthProvider';

const useAuth = () => {
  const { authUser, fetchUser } = useContext(AuthContext);

  return { authUser, fetchUser };
};

export default useAuth;
