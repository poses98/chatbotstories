import React from 'react';
import { Text, TouchableOpacity } from 'react-native';
import Colors from '../../constants/Colors';

export const AuthorButtonSelector = ({
  _id,
  onPress,
  onLongPress,
  name,
  color,
  selectedId,
}) => {
  let selected = selectedId === _id;
  return (
    <TouchableOpacity
      style={{
        borderWidth: 1,
        borderRadius: 15,
        paddingVertical: 5,
        paddingHorizontal: 8,
        borderColor: color ? color : Colors.blue,
        marginVertical: 5,
        marginHorizontal: 5,
        backgroundColor: selected ? color : '#fafafa',
      }}
      onPress={onPress}
      onLongPress={onLongPress}
    >
      <Text style={{ color: selected ? '#fafafa' : color }}>{name}</Text>
    </TouchableOpacity>
  );
};
