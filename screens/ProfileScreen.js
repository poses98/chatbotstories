import React, { useState, useEffect, useLayoutEffect } from 'react';
import { View, Text, StyleSheet, Image, ScrollView } from 'react-native';
import ProfileHeader from '../components/Profile/ProfileHeader';
import StoryContainer from '../components/StoryContainer';
import Colors from '../constants/Colors';
import UserApi from '../api/user';
import StoryApi from '../api/story';
import useAuth from '../hooks/useAuth';
import useStories from '../hooks/useStories';

export default ({ route, navigation }) => {
  const { authUser, fetchUser } = useAuth();
  const { userStories } = useStories();
  const [owned, setOwned] = useState(null);
  const [stories, setStories] = useState(null);
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [image, setImage] = useState(null);
  const [following, setFollowing] = useState(false);

  //Get user information
  useEffect(() => {
    if (authUser && owned) {
      setData(authUser);
    }
  }, [authUser, owned]);

  useEffect(() => {
    if (userStories && owned) {
      setStories(userStories);
    }
  }, [userStories, owned]);

  useEffect(() => {
    if (data && stories) {
      setIsLoading(false);
    }
  }, [data, stories, owned]);

  useEffect(() => {
    if (owned === false) {
      StoryApi.getUserStories(route.params.uid).then((response) => {
        setStories(response);
      });
      UserApi.getUserById(route.params.uid).then((response) => {
        setData(response);
      });
    }
  }, [owned]);

  useEffect(() => {
    console.log('Checking params');
    if (route.params?.uid !== null && route.params?.uid !== undefined) {
      console.log('Route params not empty..');
      if (route.params.uid !== authUser._id) {
        console.log('Not owned profile');
        setOwned(false);
      } else {
        console.log('Owned profile');
        setOwned(true);
      }
    } else {
      setOwned(true);
    }

    return () => {
      setOwned(null);
    };
  }, [route.params?.uid, authUser._id]);

  useEffect(() => {
    if (!owned) {
      authUser.following.forEach((follow) => {
        if (follow.user === route.params?.uid) {
          setFollowing(true);
        }
      });
    }
    return () => {
      setFollowing(false);
    };
  }, [owned]);

  const handleFollow = async () => {
    if (!owned) {
      let t_followers = [];
      if (data.followers.length > 0) {
        data.followers.forEach((follow) => {
          if (follow.user !== authUser._id && following) {
            t_followers.push(follow);
          }
        });
      } else {
        t_followers.push({ user: authUser._id });
      }

      setData({ ...data, followers: t_followers });
      console.log('Hey');
      setFollowing(!following);
      UserApi.followUser(
        route.params.uid,
        authUser._id,
        following ? 'unfollow' : 'follow'
      )
        .then((response) => {
          fetchUser();
          console.log(response);
        })
        .catch((err) => {
          setFollowing(!following);
          console.error(err);
        });
    }
  };

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
              posts={stories.length || 0}
              followersStats={data.followers.length || 0}
              followingStats={data.following.length || 0}
              navigation={navigation}
              userId={data.userId}
              image={image}
              owned={owned}
              followUser={handleFollow}
              following={following}
            />
            {stories &&
              stories.map((item) => (
                <StoryContainer
                  key={item.storyId}
                  interactive={item.interactive}
                  title={item.title}
                  description={item.description}
                  id={item.storyId}
                  genre={item.genre}
                  date={item.date}
                  likes={item.likes.count}
                  views="0"
                  onPress={() => {
                    navigation.push('StoryInfo', {
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
