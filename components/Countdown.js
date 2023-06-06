import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Animated, Button } from 'react-native';
import Colors from '../constants/Colors';

const Countdown = ({ initialCount, handleTimeout }) => {
  const [count, setCount] = useState(initialCount);
  const [progress] = useState(new Animated.Value(0));

  useEffect(() => {
    if (count === -1) {
      handleTimeout();
    } else {
      const animation = Animated.timing(progress, {
        toValue: 100,
        duration: count * 1000,
        useNativeDriver: false,
      });

      const timer = setTimeout(() => {
        setCount((prevCount) => prevCount - 1);
        animation.start();
      }, 1000);
      return () => {
        clearTimeout(timer);
      };
    }
  }, [count]);

  return (
    <View style={styles.container}>
      <Button title="Next story" />
      <View style={styles.progressBarContainer}>
        <Animated.View
          style={[
            styles.progressBar,
            {
              width: progress.interpolate({
                inputRange: [0, 100],
                outputRange: ['0%', '100%'],
                extrapolate: 'identity',
              }),
            },
          ]}
        ></Animated.View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  countdownText: {
    color: Colors.gray,
    marginVertical: 2,
  },
  progressBarContainer: {
    width: '80%',
    height: 10,
    borderRadius: 5,
    backgroundColor: '#e0e0e0',
  },
  progressBar: {
    height: '100%',
    borderRadius: 5,

    backgroundColor: Colors.darkGray,
  },
});

export default Countdown;
