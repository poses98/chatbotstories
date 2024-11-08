import React from 'react';
import { Appearance } from 'react-native';
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

export default StoryContainer = ({
  interactive,
  title,
  description,
  onPress,
  genre,
  readStatus,
  likes,
  views,
}) => {
  const handleError = (e) => {
    console.log(e.nativeEvent.error);
  };
  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.8} delayPressIn={10}>
      <View
        resizeMode="cover"
        onError={handleError}
        style={[styles.image, { backgroundColor: GENRES[genre].color }]}
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
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    height: 230,
  },
  image: {
    justifyContent: 'center',
    height: 230,
    width: '100%',
  },
  storyContainer: {
    flexDirection: 'column',
    justifyContent: 'space-between',
    height: 230,
    padding: 15,
    borderColor: Colors.gray,
    backgroundColor: 'rgba(52, 52, 52, 0.2)',
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
});
