import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, ScrollView } from 'react-native';
import Colors from '../constants/Colors';
import useStories from '../hooks/useStories';
import StoryContainerLibrary from '../components/StoryContainerLibrary';

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
          <View>
            <Text style={styles.title}>Continue reading</Text>
            <ScrollView horizontal>
              <View style={{ flexDirection: 'row' }}>
                {readStories.map((story) => {
                  const {
                    interactive,
                    title,
                    description,
                    _id,
                    date,
                    genre,
                    author,
                    likes,
                  } = story;
                  return (
                    <StoryContainerLibrary
                      key={_id}
                      interactive={interactive}
                      title={title}
                      description={description}
                      id={_id}
                      genre={genre}
                      date={date}
                      onPress={() => {
                        navigation.navigate('StoryInfo', {
                          title,
                          storyId: _id,
                          username: author,
                        });
                      }}
                      likes={likes.count}
                    />
                  );
                })}
              </View>
            </ScrollView>
          </View>
        )}
        {!loading && likedStories && likedStories.length > 0 && (
          <View>
            <Text style={styles.title}>Liked stories</Text>
            <ScrollView horizontal>
              <View style={{ flexDirection: 'row' }}>
                {likedStories.map((story) => {
                  const {
                    interactive,
                    title,
                    description,
                    _id,
                    date,
                    genre,
                    author,
                    likes,
                  } = story;
                  return (
                    <StoryContainerLibrary
                      key={_id}
                      interactive={interactive}
                      title={title}
                      description={description}
                      id={_id}
                      genre={genre}
                      date={date}
                      onPress={() => {
                        navigation.navigate('StoryInfo', {
                          title,
                          storyId: _id,
                          username: author,
                        });
                      }}
                      likes={likes.count}
                    />
                  );
                })}
              </View>
            </ScrollView>
          </View>
        )}
        {!loading && savedStories && savedStories.length > 0 && (
          <View>
            <View
              styles={{ borderBottomWidth: 1, borderBottomColor: Colors.gray }}
            >
              <Text style={styles.title}>Saved stories</Text>
            </View>
            <ScrollView horizontal>
              <View style={{ flexDirection: 'row' }}>
                {savedStories.map((story) => {
                  const {
                    interactive,
                    title,
                    description,
                    _id,
                    date,
                    genre,
                    author,
                    likes,
                  } = story;
                  return (
                    <StoryContainerLibrary
                      key={_id}
                      interactive={interactive}
                      title={title}
                      description={description}
                      id={_id}
                      genre={genre}
                      date={date}
                      onPress={() => {
                        navigation.navigate('StoryInfo', {
                          title,
                          storyId: _id,
                          username: author,
                        });
                      }}
                      likes={likes.count}
                    />
                  );
                })}
              </View>
            </ScrollView>
          </View>
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
