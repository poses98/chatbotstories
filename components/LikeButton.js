import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import Colors from '../constants/Colors';
import Ionicons from '@expo/vector-icons/Ionicons';

export default function LikeButton({ canLike, likeStory, styles }) {
  return (
    <View>
      <TouchableOpacity style={styles} onPress={likeStory}>
        <Ionicons
          name={canLike ? 'heart-outline' : 'heart'}
          size={30}
          color={canLike ? Colors.black : Colors.red}
        />
      </TouchableOpacity>
    </View>
  );
}
