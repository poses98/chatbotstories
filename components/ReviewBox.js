import React, { useState } from 'react';
import { View, TouchableOpacity, Text, Animated } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import Colors from '../constants/Colors';

export default function ReviewBox({
  username,
  authorId,
  date,
  body,
  handleReport,
  handleProfileNavigate,
  navigation,
}) {
  const [rotationUp, setRotationUp] = useState(new Animated.Value(0));
  const [rotationDown, setRotationDown] = useState(new Animated.Value(0));

  const handleLike = () => {
    Animated.timing(rotationUp, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start(() => {
      setRotationUp(new Animated.Value(0));
    });
  };

  const startAnimationDown = () => {
    Animated.timing(rotationDown, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start(() => {
      setRotationDown(new Animated.Value(0));
    });
  };

  const rotateInterpolationUp = rotationUp.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  const rotateInterpolationDown = rotationDown.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '-360deg'],
  });

  const navigateToAuthorProfile = () => {
    if (authorId) {
      navigation.push('UserProfile', {
        uid: authorId,
        username: username,
      });
    }
  };

  function humanizeDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleString();
  }
  return (
    <View
      style={{
        width: '95%',
        padding: 20,
        marginLeft: '2.5%',
      }}
    >
      <View
        style={{
          flex: 1,
          flexDirection: 'row',
          width: '100%',
          alignContent: 'center',
          marginBottom: 10,
        }}
      >
        <TouchableOpacity>
          <Text
            style={{ fontSize: 19, color: Colors.blueGray }}
            onPress={navigateToAuthorProfile}
          >
            {username}
          </Text>
        </TouchableOpacity>
        <View
          style={{
            flex: 1,
            alignSelf: 'flex-end',
          }}
        >
          <Text
            style={{
              alignSelf: 'flex-end',
              paddingRight: 5,
              color: Colors.gray,
            }}
          >
            {humanizeDate(date)}
          </Text>
        </View>
      </View>
      <View
        style={{
          width: '100%',
          alignContent: 'center',
          justifyContent: 'center',
          paddingLeft: 4,
        }}
      >
        <Text style={{ color: Colors.gray }}>{body}</Text>
      </View>
      {/** */}
      <View
        style={{
          marginTop: 20,
          flexDirection: 'row',
          flex: 1,
          width: '100%',
        }}
      >
        <View
          style={{
            margin: 0,
            flexDirection: 'row',
            width: '25%',
            justifyContent: 'space-between',
          }}
        >
          <TouchableOpacity onPress={handleLike}>
            <Animated.View
              style={{ transform: [{ rotate: rotateInterpolationUp }] }}
            >
              <Ionicons
                name="thumbs-up-outline"
                size={25}
                color={Colors.gray}
              />
            </Animated.View>
          </TouchableOpacity>

          <TouchableOpacity onPress={startAnimationDown}>
            <Animated.View
              style={{ transform: [{ rotate: rotateInterpolationDown }] }}
            >
              <Ionicons
                name="thumbs-down-outline"
                size={25}
                color={Colors.gray}
              />
            </Animated.View>
          </TouchableOpacity>
        </View>
        <View
          style={{
            flex: 1,
            alignSelf: 'flex-end',
          }}
        >
          <TouchableOpacity>
            <Ionicons
              style={{ alignSelf: 'flex-end', paddingRight: 5 }}
              name="flag-outline"
              size={25}
              color={Colors.red}
            />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}
