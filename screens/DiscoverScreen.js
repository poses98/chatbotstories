import * as React from 'react';
import { View, Text } from 'react-native';
import { TouchableHighlight } from 'react-native';
import SwipeableComponent from '../components/misc/SwipeableComponent';

export default () => {
  const leftContent = <Text>Pull to activate</Text>;

  const rightButtons = [
    <TouchableHighlight>
      <Text>Button 1</Text>
    </TouchableHighlight>,
    <TouchableHighlight>
      <Text>Button 2</Text>
    </TouchableHighlight>,
  ];
  return (
    <SwipeableComponent
      onRightSwipe={() => {
        console.log('Right swipe');
      }}
    >
      <Text>My swipeable content</Text>
    </SwipeableComponent>
  );
};
