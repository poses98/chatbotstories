import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, ScrollView } from 'react-native';
import ProfileHeader from '../components/Profile/ProfileHeader';
import StoryContainer from '../components/StoryContainer';
import Colors from '../constants/Colors';
import UserApi from '../api/user';
import StoryApi from '../api/story';
import useFirebase from '../hooks/useFirebase';
import useAuth from '../hooks/useAuth';

const images = {
  terror: require('../assets/terror.jpg'),
  adventure: require('../assets/adventure.jpg'),
  drama: require('../assets/drama.jpg'),
  snow: require('../assets/snow.jpg'),
};

export default ({ navigation }) => {
  // TODO isLoading for every single item from DB to be totally loaded!
  const testId = '';
  const TEST = false;
  const { authUser } = useAuth();
  const [owned, setOwned] = useState(false);
  const [stories, setStories] = useState(null);
  const [storyCont, setStoryCont] = useState(0);
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [image, setImage] = useState(null);
  //Get user information
  useEffect(() => {
    if (!data && authUser) {
      setData(authUser);
    }
  }, [authUser]);

  useEffect(() => {
    if (!stories && authUser) {
      console.log(authUser._id);
      StoryApi.getUserStories(authUser._id)
        .then((response) => {
          console.log(stories);
          setStories(response);
        })
        .catch((err) => {
          console.log(err);
          /**TODO handle error */
        });
    }
  }, [authUser]);

  useEffect(() => {
    if (data && stories) {
      setIsLoading(false);
    }
  }, [data, stories]);

  async function downloadImage(userId) {
    const ref = firebase
      .storage()
      .ref()
      .child('profilePictures/' + userId);

    await ref
      .getDownloadURL()
      .then(function (url) {
        setImage(url);
        setisLoading(false);
      })
      .catch(function (error) {
        setisLoading(false);
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
        {!isLoading && (
          <View>
            <ProfileHeader
              name={data.name || ''}
              web={data.website || ''}
              description={data.description || ''}
              posts={stories.length || ''}
              followers={data.followers || 0}
              following={data.following || 0}
              navigation={navigation}
              userId={data.userId}
              image={image}
            />
            {stories &&
              stories.map((item) => (
                <StoryContainer
                  key={item.storyId}
                  interactive={item.interactive}
                  title={item.title}
                  description={item.description}
                  id={item.storyId}
                  categoryMain={item.genre}
                  date={item.date}
                  likes={item.likes.count}
                  views="0"
                  onPress={() => {
                    navigation.navigate('StoryInfo', {
                      title: item.title,
                      storyId: item._id,
                      username: item.author,
                    });
                  }}
                />
              ))}
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
        )}
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
