import React, { useLayoutEffect, useState, useEffect } from 'react';
import {
  View,
  TouchableOpacity,
  StyleSheet,
  Text,
  Image,
  ImageBackground,
  Share,
  FlatList,
} from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import Colors from '../constants/Colors';
import GENRES from '../constants/Genres';
import { ScrollView } from 'react-native-gesture-handler';
import Button from '../components/Button';
import LANGUAGES from '../constants/Languages';
import MONTHS from '../constants/Months';
import STORY_STATUS from '../constants/StoryStatus';
import { StackActions } from '@react-navigation/native';
import { ChapterItem } from '../components/ChapterItem';
import { moderateScale } from 'react-native-size-matters';
import StoryApi from '../api/story';
import UserApi from '../api/user';
import useAuth from '../hooks/useAuth';

export default ({ navigation, route }) => {
  /** STATE OBJECTS */
  const [isSaved, setIsSaved] = useState(false);
  const [loading, setloading] = useState(true);
  const [loadingMetadata, setLoadingMetadata] = useState(true);
  const [loadingChapterList, setLoadingChapterList] = useState(true);
  const [loadingReviewList, setLoadingReviewList] = useState(true);
  const [loadingStats, setLoadingStats] = useState(true);
  const [user, setUser] = useState(null);
  const [data, setdata] = useState(null);
  const [storyId, setstoryId] = useState(route.params.storyId || '');
  const [owned, setowned] = useState(false);
  const [notloaded, setnotloaded] = useState(false);
  const [stats, setstats] = useState({});
  const [canLike, setcanLike] = useState(true);
  const [authorUserName, setAuthorUserName] = useState('');
  const [chapterId, setChapterId] = useState('');
  const [chapterIndex, setChapterIndex] = useState(0);
  const [ended, setEnded] = useState(false);
  const { authUser } = useAuth();

  /**Getting the author name */
  useEffect(() => {
    if (data)
      if (data.author) {
        UserApi.getUsername(data.author)
          .then((response) => {
            setAuthorUserName(response.username || null);
          })
          .catch((err) => {
            console.log(`Getting author name: ${err}`);
          });
      }
  }, [data]);

  useEffect(() => {
    if (authUser)
      UserApi.getUserById(authUser._id)
        .then((response) => {
          setUser(response);
        })
        .catch((err) => {
          /** TODO handle error */
          console.error(err);
        });
  }, [authUser]);

  /** Getting the metadata of the story */
  useEffect(() => {
    if (!data && authUser) {
      StoryApi.getStoryAndChaptersById(storyId)
        .then((response) => {
          var date = new Date(response.date);
          date.month = date.getMonth();
          date.day = date.getDate();
          date.year = date.getFullYear();
          setdata(response);
          setChapterList(response.chapters);
          console.log(response.chapters);

          if (authUser._id === response.author) setowned(true);
          setloading(false);
        })
        .catch((err) => {
          console.error(err);
        });
    }
  }, [authUser]);
  /** Getting the stats of the story */
  useEffect(() => {
    if (storyId != '') {
      // get story stats
    } else {
      setnotloaded(true);
      setloading(false);
    }
  }, []);
  /** Finding out if the user has already liked this story to enable the like button */
  useEffect(() => {
    if (data)
      if (data.likes) {
        data.likes.users.forEach((element) => {
          if (element === authUser._id) {
            setcanLike(false);
          }
        });
      }
  }, [data]);
  /** Finding out if the user has already saved this story to check the saved button */
  useEffect(() => {
    if (user) {
      user.savedStories.forEach((story) => {
        if (story._id === storyId) {
          setIsSaved(true);
        }
      });
    }
  }, [storyId, user]);
  /** Rendering the top bar icons */
  const renderStackBarIconRight = () => {
    return (
      <View style={{ flexDirection: 'row' }}>
        {/** save story button */}
        {
          <TouchableOpacity
            onPress={() => {
              setIsSaved(!isSaved);
              StoryApi.saveStory(storyId, authUser._id)
                .then((response) => {
                  console.log(response);
                })
                .catch((err) => {
                  /**TODO handle error */
                  console.error(err);
                });
            }}
            style={{ paddingRight: 8 }}
          >
            <Ionicons
              name={!isSaved ? 'bookmark-outline' : 'bookmark'}
              size={26}
              color={Colors.black}
            />
          </TouchableOpacity>
        }
        {/**Only render if it's owner*/}
        {owned && (
          <TouchableOpacity
            onPress={() => {
              navigation.navigate('StorySettings', { storyId: storyId });
            }}
            style={{ paddingRight: 8 }}
          >
            <Ionicons name="settings-outline" size={26} color={Colors.black} />
          </TouchableOpacity>
        )}
      </View>
    );
  };
  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => renderStackBarIconRight(),
      headerRightContainerStyle: {
        paddingRight: 10,
      },
    });
  });
  /** Likes a story */
  const likeStory = () => {
    StoryApi.likeStory(data._id, authUser._id)
      .then((response) => {
        console.log(response);
      })
      .catch((err) => {});

    if (canLike) {
      data.likes.count += 1;
    } else {
      data.likes.count -= 1;
    }
    setcanLike(!canLike);
    setstats({ ...stats });
  };
  /** Share function to open share options in phone */
  const onShare = async () => {
    try {
      const result = await Share.share({
        message: `Hey! I have found ${
          data.title || ''
        } in BookCraft and I think you\'re gonna love it!`,
        url: '',
        title: `${data.title} in BookCraft`,
      });
      if (result.action === Share.sharedAction) {
        if (result.activityType) {
          // shared with activity type of result.activityType
        } else {
          // shared
        }
      } else if (result.action === Share.dismissedAction) {
        // dismissed
      }
    } catch (error) {
      console.error(error.message);
    }
  };
  /** Finding out if the user has already started this story to continue reading */
  useEffect(() => {
    if (storyId != '') {
    } else {
      setnotloaded(true);
      setloading(false);
    }
  }, []);
  /**Chapter list */
  const [chapterList, setChapterList] = useState([]);

  useEffect(() => {
    // get chapters and sort them by index
  }, []);

  /**Review list */
  const [reviewList, setReviewList] = useState([]);
  useEffect(() => {
    // get chapter list
  }, []);
  return (
    <ScrollView style={styles.container}>
      {!loading && (
        <View>
          {/**HEADER */}
          <ImageBackground
            source={GENRES[data.genre].image}
            resizeMode="cover"
            onError={() => {}}
            style={styles.image}
          >
            <View style={styles.storyContainer}>
              {/**STORY NAME */}
              <Text style={styles.storyTitle}>{data.title} </Text>
              {/**STORY AUTHOR */}
              <Text
                style={[
                  styles.storyDescription,
                  { fontStyle: 'italic', fontSize: 12, marginBottom: 5 },
                ]}
              >
                Written by {authorUserName}
              </Text>
              {/**STORY STATUS */}

              {/**STORY STATS */}
              <View style={{ flexDirection: 'row' }}>
                <View style={styles.storyStats}>
                  <Ionicons
                    name="eye-outline"
                    size={20}
                    color={Colors.lightGray}
                  />
                  <Text style={{ color: Colors.lightGray }}>{stats.views}</Text>
                </View>
                <View style={styles.storyStats}>
                  <Ionicons name="heart" size={20} color={Colors.red} />
                  <Text style={{ color: Colors.lightGray }}>
                    {data.likes.count}
                  </Text>
                </View>
              </View>
              {/**STORY DESCRIPTION */}
              <Text style={styles.storyDescription}>"{data.description}"</Text>
              {/** CONTINUE/START READING BUTTON */}
              <Button
                text={
                  chapterId === ''
                    ? 'Start reading'
                    : ended
                    ? 'Read again'
                    : 'Continue reading'
                }
                textStyle={{
                  fontWeight: 'bold',
                  color: Colors.lightGray,
                  padding: 10,
                }}
                onPress={() => {
                  //TODO admob
                  navigation.navigate('ChatRead', {
                    storyName: data.title,
                    storyId: storyId,
                    chapterId: !(chapterId === '')
                      ? chapterId
                      : chapterList[0]._id,
                    chapterList: chapterList,
                  });
                }}
                buttonStyle={{
                  marginVertical: 15,
                  marginHorizontal: 15,
                  height: 45,
                  borderColor: Colors.lightGray,
                }}
              />
            </View>
          </ImageBackground>
          {/** SOCIAL INTERACTIONS  */}
          <View
            style={{
              flexDirection: 'row',
              flex: 1,
              alignItems: 'center',
              marginVertical: 10,
              marginHorizontal: 15,
            }}
          >
            {/**LIKE BUTTON */}
            <View>
              <TouchableOpacity style={styles.storyStats} onPress={likeStory}>
                <Ionicons
                  name={canLike ? 'heart-outline' : 'heart'}
                  size={30}
                  color={canLike ? Colors.black : Colors.red}
                />
              </TouchableOpacity>
            </View>

            {/**COMMENT BUTTON */}
            <View>
              <TouchableOpacity
                style={[styles.storyStats, { paddingLeft: 8 }]}
                onPress={() => {
                  /** TODO go to comment section */
                }}
              >
                <Ionicons
                  name="chatbox-outline"
                  size={30}
                  color={Colors.black}
                />
              </TouchableOpacity>
            </View>

            {/**SHARE BUTTON */}
            <View>
              <TouchableOpacity
                style={styles.storyStats}
                onPress={() => {
                  onShare();
                }}
              >
                <Ionicons
                  name="share-social-outline"
                  size={30}
                  color={Colors.black}
                />
              </TouchableOpacity>
            </View>
            {/** DATE */}
            <View style={{ flex: 1, alignItems: 'flex-end' }}>
              <Text>
                {data.day} {MONTHS[data.month]} {data.year}
              </Text>
            </View>
          </View>

          {/**Chapter list */}
          <Text
            style={{
              marginHorizontal: 15,
              fontSize: 15,
              color: Colors.gray,
              textTransform: 'uppercase',
            }}
          >
            Chapter list
          </Text>
          <View
            style={{
              maxHeight: 250,
              minHeight: 200,
              marginHorizontal: 15,
              borderWidth: 1,
              borderColor: Colors.black,
              borderRadius: 10,
            }}
          >
            {chapterList &&
              chapterList.map(({ title, description, _id, index }) => (
                <ChapterItem
                  key={_id}
                  title={title}
                  onPress={() => {
                    // TODO admob
                    navigation.navigate('ChatRead', {
                      storyName: data.title,
                      storyId: storyId,
                      chapterId: _id,
                      chapterList: chapterList,
                    });
                  }}
                  id={_id}
                  navigation={navigation}
                  onDelete={() => removeItemFromLists(id)}
                  index={index}
                  currentIndex={chapterIndex}
                  finished={ended}
                  list={false}
                />
              ))}
          </View>
          {/**Reviews */}
          <Text
            style={{
              marginHorizontal: 15,
              marginVertical: 15,
              fontSize: 15,
              color: Colors.gray,
              textTransform: 'uppercase',
            }}
          >
            Reviews
          </Text>
        </View>
      )}
      {!loadingChapterList &&
        !loadingMetadata &&
        !loadingStats &&
        notloaded && (
          <View
            style={{
              alignItems: 'center',
              flex: 1,
              padding: 15,
              justifyContent: 'center',
            }}
          >
            <Text>Ooops!</Text>
            <Text> There has been an error while loading your story 😥</Text>
            <Text> Try again later</Text>
          </View>
        )}
      {loadingChapterList && loadingMetadata && loadingStats && loading && (
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
    minHeight: moderateScale(230, 0.45),
    width: '100%',
  },
  storyContainer: {
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
    justifyContent: 'center',
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
    borderColor: Colors.lightGray,
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
    flexDirection: 'column',
    color: '#fafafa',
  },
  storyStats: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});
