import React, { useRef, useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import LottieView from 'lottie-react-native';

export default ({ small }) => {
  const animation = useRef(null);

  const lottieSource = small
    ? require('../assets/lottie/99589-small-loader.json')
    : require('../assets/lottie/29311-chat-loader.json');

  return (
    <View style={styles.container}>
      <LottieView
        autoPlay
        ref={animation}
        style={{
          width: 130,
          height: 130,
        }}
        source={lottieSource}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'transparent',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
