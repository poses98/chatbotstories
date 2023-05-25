import * as React from 'react';
import { View, Text } from 'react-native';
import useAuth from '../hooks/useAuth';

export default () => {
  const { authUser } = useAuth();
  React.useEffect(() => {
    if (authUser) {
      console.log(authUser);
    }
  }, [authUser]);
  return (
    <View>
      <Text>Feed screen</Text>
    </View>
  );
};
