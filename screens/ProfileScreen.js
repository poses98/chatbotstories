import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  FlatList,
} from 'react-native';
import ProfileHeader from '../components/Profile/ProfileHeader';
import StoryContainer from '../components/StoryContainer';
import Colors from '../constants/Colors';
import Lottie from 'lottie-react-native';
import UserApi from '../api/user';
import useFirebase from '../hooks/useFirebase';

const images = {
  terror: require('../assets/terror.jpg'),
  adventure: require('../assets/adventure.jpg'),
  drama: require('../assets/drama.jpg'),
  snow: require('../assets/snow.jpg'),
};

export default ({ navigation }) => {
  // TODO loading for every single item from DB to be totally loaded!
  const testId = '';
  const TEST = false;
  const { user } = useFirebase();
  const [owned, setOwned] = useState(false);
  const [stories, setStories] = useState([]);
  const [storyCont, setStoryCont] = useState(0);
  const [data, setdata] = useState({});
  const [loading, setloading] = useState(true);
  const [image, setImage] = useState(null);
  //Get user information
  useEffect(() => {
    if (!data)
      UserApi.getUserById(user.uid)
        .then((response) => {
          console.log(response);
        })
        .catch((err) => {
          console.log(err);
        });
  }, [user]);

  useEffect(() => {
    // get user stories
  }, []);

  async function downloadImage(userId) {
    const ref = firebase
      .storage()
      .ref()
      .child('profilePictures/' + userId);

    await ref
      .getDownloadURL()
      .then(function (url) {
        setImage(url);
        setloading(false);
      })
      .catch(function (error) {
        setloading(false);
        // A full list of error codes is available at
        // https://firebase.google.com/docs/storage/web/handle-errors
        switch (error.code) {
          case 'storage/object-not-found':
            console.log("ERROR GETTING IMAGE: Storage doesn't exist");
            break;

          case 'storage/unauthorized':
            // User doesn't have permission to access the object
            console.log(
              "ERROR GETTING IMAGE: User doesn't have permission to access the file."
            );
            break;

          case 'storage/canceled':
            // User canceled the upload
            console.log('ERROR GETTING IMAGE: User cancelled operation');
            break;

          case 'storage/unknown':
            // Unknown error occurred, inspect the server response
            console.log('ERROR GETTING IMAGE: Unkwon error occurred');
            break;
        }
      });
  }

  return (
    <>
      <ScrollView style={styles.container}>
        <View>
          <ProfileHeader
            name={data.name || ''}
            web={data.website || ''}
            description={data.description || ''}
            posts={storyCont || ''}
            followers={data.followers || ''}
            following={data.following || ''}
            navigation={navigation}
            userId={data.userId}
            image={image}
          />
          {console.log(stories.length)}
          {!(stories.length == 0) && (
            <FlatList
              data={stories}
              keyExtractor={(item) => item.storyId}
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
          {stories.length == 0 && (
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
              <Text>Write some stories and they will show up here!</Text>
            </View>
          )}
        </View>
      </ScrollView>
    </>
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
