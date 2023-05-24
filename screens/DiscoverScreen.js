import * as React from 'react';
import { View, Text } from 'react-native';
import { TouchableHighlight } from 'react-native';
import Swipeable from 'react-native-swipeable';

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
    <Swipeable leftContent={leftContent} rightButtons={rightButtons}>
      <Text>My swipeable content</Text>
    </Swipeable>
  );
};
