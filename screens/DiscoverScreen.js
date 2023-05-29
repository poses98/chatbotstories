import * as React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import SwipeableComponent from '../components/misc/SwipeableComponent';

export default () => {
  const leftContent = <Text>Pull to activate</Text>;

  const rightButtons = [
    <TouchableOpacity key="button1">
      <Text>Button 1</Text>
    </TouchableOpacity>,
    <TouchableOpacity key="button2">
      <Text>Button 2</Text>
    </TouchableOpacity>,
  ];

  return (
    <SwipeableComponent
      onRightSwipe={() => {
        console.log('Right');
      }}
      leftSwipeComponent={rightButtons}
      rightSwipeComponent={rightButtons}
    >
      <Text>My swipeable content</Text>
    </SwipeableComponent>
  );
};
