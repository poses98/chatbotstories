import React, { useLayoutEffect, useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  TouchableOpacity,
  FlatList,
  ImageBackground,
} from 'react-native';
import ProfileHeader from '../components/Profile/ProfileHeader';
import StoryContainer from '../components/StoryContainer';
import Colors from '../constants/Colors';
import Ionicons from '@expo/vector-icons/Ionicons';
import GENRES from '../constants/Genres';
import StoryApi from '../api/story';
import useAuth from '../hooks/useAuth';
import StoryContainerLibrary from '../components/StoryContainerLibrary';

const images = {
  terror: require('../assets/terror.jpg'),
  adventure: require('../assets/adventure.jpg'),
  drama: require('../assets/drama.jpg'),
  snow: require('../assets/snow.jpg'),
};

export default ({ navigation }) => {
  const [stories, setStories] = useState([]);
  const [likedStories, setLikedStories] = useState(null);
  const [savedStories, setSavedStories] = useState(null);
  const [readStories, setReadStories] = useState(null);
  const [data, setdata] = useState({});
  const [loading, setloading] = useState(true);
  const [storyCount, setStoryCount] = useState(0);
  const { authUser } = useAuth();
  //Get user information

  useEffect(() => {
    if (!likedStories && !savedStories && !readStories && authUser) {
      StoryApi.getLikedStories(authUser._id)
        .then((likedResponse) => {
          setLikedStories(likedResponse);
        })
        .catch((err) => {
          console.error(err);
        });
      StoryApi.getReadStories(authUser._id)
        .then((readResponse) => {
          setReadStories(readResponse);
        })
        .catch((err) => {
          console.error(err);
        });
      StoryApi.getSavedStories(authUser._id)
        .then((savedResponse) => {
          setSavedStories(savedResponse);
        })
        .catch((err) => {
          console.error(err);
        });
    }
  }, [authUser]);
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
