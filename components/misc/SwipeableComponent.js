import React, { useRef } from 'react';
import { View, Animated, PanResponder } from 'react-native';

const SwipeableComponent = ({ onLeftSwipe, onRightSwipe, children }) => {
  const swipeX = useRef(new Animated.Value(0)).current;

  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: () => true,
      onPanResponderMove: (_, gestureState) => {
        swipeX.setValue(gestureState.dx);
      },
      onPanResponderRelease: (_, gestureState) => {
        if (gestureState.dx > 50) {
          Animated.timing(swipeX, {
            toValue: 200,
            duration: 200,
            useNativeDriver: false,
          }).start(() => {
            if (onRightSwipe) {
              onRightSwipe();
            }
            swipeX.setValue(0);
          });
        } else if (gestureState.dx < -50) {
          Animated.timing(swipeX, {
            toValue: -200,
            duration: 200,
            useNativeDriver: false,
          }).start(() => {
            if (onLeftSwipe) {
              onLeftSwipe();
            }
            swipeX.setValue(0);
          });
        } else {
          Animated.timing(swipeX, {
            toValue: 0,
            duration: 200,
            useNativeDriver: false,
          }).start();
        }
      },
    })
  ).current;

  const animatedStyle = {
    transform: [{ translateX: swipeX }],
  };

  return (
    <View style={{ flex: 1 }}>
      <Animated.View
        style={[{ flex: 1 }, animatedStyle]}
        {...panResponder.panHandlers}
      >
        {children}
      </Animated.View>
    </View>
  );
};

export default SwipeableComponent;
