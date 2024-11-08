import React, { useState } from 'react';
import { Platform, Animated } from 'react-native';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ImageBackground,
} from 'react-native';
import Colors from '../constants/Colors';
import Ionicons from '@expo/vector-icons/Ionicons';
import GENRES from '../constants/Genres_';
import OldBookBackground from './OldBookBackground';

export default StoryContainer = ({
  interactive,
  title,
  description,
  storyId,
  onPress,
  genre,
  readStatus,
  likes,
  views,
}) => {
  const [scaleValue] = useState(new Animated.Value(1));

  const handlePressIn = () => {
    Animated.spring(scaleValue, {
      toValue: 0.95,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleValue, {
      toValue: 1,
      useNativeDriver: true,
    }).start();
  };

  const animatedStyle = {
    transform: [{ scale: scaleValue }],
  };
  const handleError = (e) => {
    console.log(e.nativeEvent.error);
  };
  return (
    <TouchableOpacity
      style={[styles.container, animatedStyle]}
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      activeOpacity={0.8}
    >
      <View
        style={{
          justifyContent: 'center',
          height: 350,
          width: 230,
          backgroundColor: GENRES[genre].color,
        }}
      >
        <ImageBackground
          source={require('../assets/old_notebook_texture.png')}
          resizeMode="cover"
          onError={handleError}
          style={styles.textureOverlay}
        >
          <View style={[styles.storyContainer]}>
            {/**CATEGORIES */}
            <View style={styles.storyBar}>
              {interactive && (
                <View
                  style={[styles.storyTag, { backgroundColor: Colors.green }]}
                >
                  <Text style={{ color: Colors.lightGray }}>Interactive</Text>
                </View>
              )}
              <View style={styles.storyTag}>
                <Text style={{ color: Colors.lightGray }}>
                  {GENRES[genre].name}
                </Text>
              </View>
            </View>
            {/**STORY TITLE & DESCRIPTION */}
            <View style={styles.storyMainInfoContainer}>
              {/**<Text style={styles.readStatusText}>{/**readStatus*In progress</Text>}*/}
              <Text style={styles.storyTitle}>{title}</Text>
              <Text style={styles.storyDescription}>"{description}"</Text>
            </View>
            {/**STATS */}
            <View style={{ alignSelf: 'flex-end' }}>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                }}
              >
                <View style={styles.storyStats}>
                  <Ionicons
                    name="eye-outline"
                    size={20}
                    color={Colors.lightGray}
                  />
                  <Text style={{ color: Colors.lightGray }}>{views}</Text>
                </View>
                <View style={styles.storyStats}>
                  <Ionicons name="heart" size={20} color={Colors.red} />
                  <Text style={{ color: Colors.lightGray }}>{likes}</Text>
                </View>
              </View>
            </View>
            {/**TODO --> STATUS BAND */}
          </View>
        </ImageBackground>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    width: 230,
    margin: 6,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 2, height: 2 },
        shadowOpacity: 0.8,
        shadowRadius: 3,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  image: {
    justifyContent: 'center',
    height: 350,
    width: 230,
  },
  storyContainer: {
    width: 230,
    flexDirection: 'column',
    margin: 0,
    height: 350,
    padding: 15,
    borderColor: Colors.gray,
    /* backgroundColor: 'rgba(52, 52, 52, 0.6)', */
  },
  storyBar: {
    alignSelf: 'flex-start',
    padding: 0,
    flexDirection: 'row',
  },
  storyTag: {
    borderWidth: 1,
    borderColor: '#fafafa', //TODO
    padding: 5,
    borderRadius: 5,
    marginHorizontal: 3,
  },
  storyTitle: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#fafafa',
  },
  storyDescription: {
    color: Colors.lightGray,
  },
  storyMainInfoContainer: {
    flex: 1,
    alignItems: 'flex-start',
    alignContent: 'center',
    justifyContent: 'center',
    paddingBottom: 35,
    flexDirection: 'column',
    color: '#fafafa',
  },
  storyStats: {
    flexDirection: 'row',
    marginRight: 15,
    alignItems: 'center',
  },
  readStatusText: {
    fontSize: 12,
    color: Colors.lightGray,
  },
  textureOverlay: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.2)', // Adjust the opacity to control the texture intensity
  },
});
