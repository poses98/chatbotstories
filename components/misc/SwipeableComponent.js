import React, { useRef, useState } from 'react';
import { View, Animated, PanResponder, Text } from 'react-native';

const SwipeableComponent = ({
  onLeftSwipe,
  onRightSwipe,
  children,
  rightSwipeComponent,
  leftSwipeComponent,
}) => {
  const [rightComponentVisible, setRightComponentVisible] = useState(false);
  const [leftComponentVisible, setLeftComponentVisible] = useState(false);

  const rightOffsetVisible = 50;
  const leftOffsetVisible = -50;

  const swipeX = useRef(new Animated.Value(0)).current;

  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: () => true,
      onPanResponderMove: (_, gestureState) => {
        swipeX.setValue(gestureState.dx);
        if (onRightSwipe) {
          if (gestureState.dx > rightOffsetVisible) {
            setLeftComponentVisible(true);
          } else if (
            gestureState.dx < rightOffsetVisible &&
            gestureState.dx > leftOffsetVisible
          ) {
            setLeftComponentVisible(false);
          }
        } else if (gestureState.dx > 0) {
          swipeX.setValue(0);
        }
        if (onLeftSwipe) {
          if (gestureState.dx < leftOffsetVisible) {
            setRightComponentVisible(true);
          } else if (
            gestureState.dx > leftOffsetVisible &&
            gestureState.dx < rightOffsetVisible
          ) {
            setRightComponentVisible(false);
          }
        } else if (gestureState.dx < 0) {
          swipeX.setValue(0);
        }
      },
      onPanResponderRelease: (_, gestureState) => {
        if (gestureState.dx > 50 && onRightSwipe) {
          Animated.timing(swipeX, {
            toValue: 200,
            duration: 100,
            useNativeDriver: false,
          }).start(() => {
            if (onRightSwipe) {
              onRightSwipe();
            }
            setLeftComponentVisible(false);
            swipeX.setValue(0);
          });
        } else if (gestureState.dx < -50 && onLeftSwipe) {
          Animated.timing(swipeX, {
            toValue: -200,
            duration: 100,
            useNativeDriver: false,
          }).start(() => {
            if (onLeftSwipe) {
              onLeftSwipe();
            }
            setRightComponentVisible(false);
            swipeX.setValue(0);
          });
        } else {
          Animated.timing(swipeX, {
            toValue: 0,
            duration: 100,
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
      {leftComponentVisible && leftSwipeComponent && (
        <View style={{ position: 'absolute', top: 0, left: 0 }}>
          {leftSwipeComponent}
        </View>
      )}

      <Animated.View
        style={[{ flex: 1 }, animatedStyle]}
        {...panResponder.panHandlers}
      >
        {children}
      </Animated.View>
      {rightComponentVisible && rightSwipeComponent && (
        <View style={{ position: 'absolute', top: 0, right: 0 }}>
          {rightSwipeComponent}
        </View>
      )}
    </View>
  );
};

export default SwipeableComponent;
