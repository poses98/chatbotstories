import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, ScrollView } from 'react-native';
import Colors from '../constants/Colors';
import useStories from '../hooks/useStories';
import StoryContainerLibrary from '../components/StoryContainerLibrary';
import StoriesLibraryView from '../components/StoriesLibraryView';

export default ({ navigation }) => {
  const [loading, setloading] = useState(true);

  const { likedStories, readStories, savedStories } = useStories();

  useEffect(() => {
    if (savedStories && likedStories && readStories) {
      setloading(false);
    }
  }, [likedStories, savedStories, readStories]);
  return (
    <ScrollView style={styles.container}>
      <View>
        {!loading && readStories && readStories.length > 0 && (
          <StoriesLibraryView
            libraryTitle="Continue reading"
            storyList={readStories}
            navigation={navigation}
          />
        )}
        {!loading && likedStories && likedStories.length > 0 && (
          <StoriesLibraryView
            libraryTitle="Liked stories"
            storyList={likedStories}
            navigation={navigation}
          />
        )}
        {!loading && savedStories && savedStories.length > 0 && (
          <StoriesLibraryView
            libraryTitle="Saved stories"
            storyList={savedStories}
            navigation={navigation}
          />
        )}

        {!likedStories && !savedStories && !readStories && !loading && (
          <View
            style={{
              flex: 1,
              justifyContent: 'center',
              alignContent: 'center',
              alignSelf: 'center',
              opacity: 0.5,
              alignItems: 'center',
              height: 300,
            }}
          >
            <Text>
              Save, like or read some stories and they will show up here! 💾
            </Text>
          </View>
        )}
      </View>
      {loading && (
        <View
          style={{
            flex: 1,
            backgroundColor: '#fff',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <Image
            source={require('../assets/loading.gif')}
            style={{ width: 100, height: 100 }}
          />
        </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  title: {
    fontSize: 24,
    fontWeight: '200',
    margin: 6,
    width: '70%',
    color: Colors.gray,
  },
});
