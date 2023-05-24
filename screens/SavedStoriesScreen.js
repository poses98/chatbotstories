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

const images = {
  terror: require('../assets/terror.jpg'),
  adventure: require('../assets/adventure.jpg'),
  drama: require('../assets/drama.jpg'),
  snow: require('../assets/snow.jpg'),
};

export default ({ navigation }) => {
  const [stories, setStories] = useState([]);
  const [data, setdata] = useState({});
  const [loading, setloading] = useState(true);
  const [storyCount, setStoryCount] = useState(0);
  //Get user information

  useEffect(() => {
    // get liked stories metadata
  }, []);

  return (
    <ScrollView style={styles.container}>
      {!loading && (
        <View>
          {console.log(stories)}
          {!(storyCount === 0) && (
            <FlatList
              data={stories}
              renderItem={({
                item: {
                  interactive,
                  title,
                  description,
                  storyId,
                  date,
                  categoryMain,
                  author,
                },
              }) => {
                return (
                  <StoryContainer
                    interactive={interactive}
                    title={title}
                    description={description}
                    id={storyId}
                    categoryMain={categoryMain}
                    date={date}
                    onPress={() => {
                      navigation.navigate('StoryInfo', {
                        title,
                        storyId,
                        username: author,
                      });
                    }}
                  />
                );
              }}
            />
          )}
          {storyCount == 0 && (
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
              <Text>Save some stories and they will show up here! 💾</Text>
            </View>
          )}
        </View>
      )}
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
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  image: {
    flex: 1,
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
    backgroundColor: 'rgba(52, 52, 52, 0.6)',
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
});
