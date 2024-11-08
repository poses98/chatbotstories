import React, { useLayoutEffect, useState, useEffect } from 'react';
import { View, TouchableOpacity, StyleSheet, Text, Share } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import Colors from '../constants/Colors';
import GENRES from '../constants/Genres_';
import { ScrollView } from 'react-native-gesture-handler';
import Button from '../components/Button';
import MONTHS from '../constants/Months';
import { ChapterItem } from '../components/ChapterItem';
import { moderateScale } from 'react-native-size-matters';
import StoryApi from '../api/story';
import UserApi from '../api/user';
import ReadStatusApi from '../api/readstatus';
import useAuth from '../hooks/useAuth';
import useStories from '../hooks/useStories';
import * as Haptics from 'expo-haptics';
import LoadingScreen from './LoadingScreen';
import LikeButton from '../components/LikeButton';
import ReviewBox from '../components/ReviewBox';
import CustomModal from '../components/CustomModal';
import ReviewForm from '../components/ReviewForm';

export default ({ navigation, route }) => {
  const [isSaved, setIsSaved] = useState(false);
  const [loading, setloading] = useState(true);
  const [user, setUser] = useState(null);
  const [data, setdata] = useState(null);
  const [owned, setowned] = useState(false);
  const [stats, setstats] = useState({});
  const [canLike, setcanLike] = useState(true);
  const [authorUserName, setAuthorUserName] = useState('');
  const [chapterList, setChapterList] = useState(null);
  const [chapterIndex, setChapterIndex] = useState(0);
  const [modalVisible, setModalVisible] = useState(false);
  const [readStatus, setReadStatus] = useState(null);
  const [error, setError] = useState(false);
  const { authUser } = useAuth();
  const { fetchStories } = useStories();
  const { storyId } = route.params;

  /**Getting the author name */
  useEffect(() => {
    if (data)
      if (data.author) {
        UserApi.getUsername(data.author)
          .then((response) => {
            setAuthorUserName(response.username || null);
          })
          .catch((err) => {
            setError(true);
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
          setError(true);
          console.error(err);
        });
  }, [authUser]);
  /** Getting the metadata of the story */
  useEffect(() => {
    if (!data && authUser) {
      StoryApi.getStoryAndChaptersById(storyId)
        .then((response) => {
          setdata(response);
          setChapterList(response.chapters);
          if (authUser._id === response.author) setowned(true);
        })
        .catch((err) => {
          setError(true);
          console.error(err);
        });
    }
  }, [authUser]);
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
      user.savedStories.forEach((savedStory) => {
        if (savedStory.story === storyId) {
          setIsSaved(true);
        }
      });
    }
  }, [storyId, user]);
  /** Rendering the top bar icons */
  const renderStackBarIconRight = () => {
    return (
      <View style={{ flexDirection: 'row' }}>
        {!loading && (
          <>
            {
              <TouchableOpacity
                onPress={() => {
                  Haptics.notificationAsync(
                    Haptics.NotificationFeedbackType.Success
                  );
                  setIsSaved(!isSaved);
                  StoryApi.saveStory(storyId, authUser._id)
                    .then(() => {
                      fetchStories();
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
                  navigation.push('StorySettings', { storyId: storyId });
                }}
                style={{ paddingRight: 8 }}
              >
                <Ionicons
                  name="settings-outline"
                  size={26}
                  color={Colors.black}
                />
              </TouchableOpacity>
            )}
          </>
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
    if (canLike) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    } else {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    }
    StoryApi.likeStory(data._id, authUser._id)
      .then(() => {
        fetchStories();
      })
      .catch((err) => {
        console.error(err);
      });

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
    const readStatusObj = getReadStatus(storyId);
    if (readStatusObj && !readStatus) {
      ReadStatusApi.getReadStatusById(readStatusObj)
        .then((response) => {
          setReadStatus(response);
          console.log(response);
        })
        .catch((err) => {
          setError(true);
          console.error(err);
        });
    } else if (chapterList && user && chapterList && !readStatusObj) {
      createReadStatus();
    }
  }, [user, storyId, chapterList]);

  const createReadStatus = async () => {
    console.log('Creating read status');
    if (chapterList[0]) {
      const newReadStatus = {
        user: user._id,
        story: storyId,
        finished: false,
        nextChapter: chapterList[0]._id,
        previousChapter: null,
      };

      await ReadStatusApi.createReadStatus(newReadStatus).then((response) => {
        setReadStatus(response);
      });
    }
  };

  const getReadStatus = (storyId) => {
    if (user && user.readStatuses) {
      const readStatusObj = user.readStatuses.find((e) => e.story === storyId);
      if (readStatusObj) {
        return readStatusObj.readStatusId;
      } else {
        return undefined;
      }
    }
  };

  useEffect(() => {
    if (data && readStatus) {
      const chapterToRead = data.chapters.findIndex(
        (e) => e._id === readStatus.nextChapter
      );
      console.log(`chapterToRead:${chapterToRead}`);
      setChapterIndex(chapterToRead);
    }
  }, [readStatus, data]);

  const navigateToAuthorProfile = () => {
    if (data.author) {
      navigation.push('UserProfile', {
        uid: data.author,
        username: authorUserName,
      });
    }
  };
  /**Review list */
  const [reviewList, setReviewList] = useState(null);
  /**Check if loaded */
  useEffect(() => {
    if (data && chapterList && authorUserName) {
      setloading(false);
    }
  }, [data, chapterList, readStatus, authorUserName]);

  useEffect(() => {
    if (data && chapterList && authorUserName) {
      StoryApi.getReviews(storyId)
        .then((response) => {
          setReviewList(response.data.reviews);
        })
        .catch((err) => {
          console.error(err);
        });
    }
  }, [data, chapterList, readStatus, authorUserName]);

  const [hasWrittenReview, setHasWrittenReview] = useState(false);
  const [reviewIndex, setReviewIndex] = useState(null);
  useEffect(() => {
    if (reviewList?.length > 0) {
      const hasUserWrittenReview = reviewList.some(
        (review) => review.user._id === authUser._id && review.story === storyId
      );
      setHasWrittenReview(hasUserWrittenReview);
    } else {
      setHasWrittenReview(false);
    }
  }, [reviewList]);

  useEffect(() => {
    if (hasWrittenReview) {
      const index = reviewList.findIndex(
        (review) => review.user._id === authUser._id && review.story === storyId
      );
      setReviewIndex(index);
    }
  }, [hasWrittenReview]);

  const handleOpenModal = () => {
    setModalVisible(true);
  };

  const handleCloseModal = () => {
    setModalVisible(false);
  };

  return !loading ? (
    <ScrollView style={styles.container}>
      <CustomModal visible={modalVisible} onClose={handleCloseModal}>
        <ReviewForm storyId={storyId} handleFormSubmit={handleCloseModal} />
      </CustomModal>
      <View>
        {/**HEADER */}
        <View
          onError={() => {}}
          style={[styles.image, { backgroundColor: GENRES[data.genre].color }]}
        >
          <View style={styles.storyContainer}>
            {/**STORY NAME */}
            <Text style={styles.storyTitle}>{data.title} </Text>
            {/**STORY AUTHOR */}
            <TouchableOpacity onPress={navigateToAuthorProfile}>
              <Text
                style={[
                  styles.storyDescription,
                  { fontStyle: 'italic', fontSize: 12, marginBottom: 5 },
                ]}
              >
                Written by {authorUserName}
              </Text>
            </TouchableOpacity>
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
            {readStatus && !readStatus.finished && (
              <Button
                text={
                  readStatus.nextChapter === ''
                    ? 'Read story'
                    : readStatus.finished
                    ? 'Read again'
                    : 'Read story'
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
                    chapterId: readStatus.nextChapter._id,
                    chapterList: data.chapters,
                    chapterIndex: chapterIndex,
                    readStatus: readStatus,
                    setReadStatus: setReadStatus,
                  });
                }}
                buttonStyle={{
                  marginVertical: 15,
                  marginHorizontal: 15,
                  height: 45,
                  borderColor: Colors.lightGray,
                }}
              />
            )}
          </View>
        </View>
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
          <LikeButton
            styles={styles.storyStats}
            canLike={canLike}
            likeStory={likeStory}
          />

          {/**COMMENT BUTTON */}
          <View>
            <TouchableOpacity
              style={[styles.storyStats, { paddingLeft: 8 }]}
              onPress={() => {
                /** TODO go to comment section */
              }}
            >
              <Ionicons name="chatbox-outline" size={30} color={Colors.black} />
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
            fontSize: 23,
            fontWeight: 200,
            marginTop: 10,
            color: Colors.gray,
            textTransform: 'uppercase',
          }}
        >
          Chapter list
        </Text>

        <ScrollView
          style={{
            maxHeight: 250,
            marginHorizontal: 15,
            borderWidth: 0.5,
            borderColor: Colors.black,
            borderRadius: 10,
            overflow: 'scroll',
          }}
        >
          {chapterList &&
            data &&
            readStatus &&
            chapterList.length > 0 &&
            chapterList.map(({ title, description, _id }, index) => (
              <ChapterItem
                key={_id}
                title={title}
                onPress={() => {
                  navigation.navigate('ChatRead', {
                    storyName: data.title,
                    storyId: storyId,
                    chapterId: _id,
                    chapterList: data.chapters,
                    chapterIndex: index,
                    readStatus: readStatus,
                    setReadStatus: setReadStatus,
                  });
                }}
                id={_id}
                navigation={navigation}
                onDelete={() => removeItemFromLists(id)}
                index={index}
                currentIndex={chapterIndex}
                finished={readStatus.finished}
                list={false}
              />
            ))}
          {chapterList.length === 0 && (
            <View
              style={{
                flex: 1,
                alignItems: 'center',
                justifyContent: 'center',
                color: Colors.gray,
              }}
            >
              <Text>There are no chapters for this story!</Text>
            </View>
          )}
        </ScrollView>

        {/**Reviews */}
        <View
          style={{
            flex: 1,
            flexDirection: 'row',
            justifyContent: 'self-start',
            marginTop: 0,
          }}
        >
          <Text
            style={{
              marginLeft: 15,
              marginRight: 5,
              fontSize: 23,
              fontWeight: 200,
              marginTop: 10,
              color: Colors.gray,
              textTransform: 'uppercase',
            }}
          >
            Reviews
          </Text>
        </View>

        <View
          style={{
            marginBottom: 50,
            width: '100%',
            borderWidth: 0.75,
            borderColor: Colors.lightGray,
          }}
        >
          {/**Add review button */}
          {!hasWrittenReview && reviewList && (
            <View
              style={{
                flex: 1,
                alignSelf: 'center',
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <TouchableOpacity
                onPress={handleOpenModal}
                style={{
                  flex: 1,
                  flexDirection: 'row',
                  justifyContent: 'center',
                  alignContent: 'center',
                  borderWidth: 1,
                  borderRadius: 10,
                  marginVertical: 15,
                  borderColor: Colors.gray,
                  padding: 8,
                  paddingHorizontal: 15,
                }}
              >
                <Ionicons
                  name="add-circle-outline"
                  size={15}
                  color={Colors.gray}
                  style={{ alignSelf: 'center' }}
                />
                <Text
                  style={{
                    alignSelf: 'center',
                    fontSize: 15,
                    color: Colors.gray,
                  }}
                >
                  Add review
                </Text>
              </TouchableOpacity>
            </View>
          )}
          {reviewList?.length > 0 &&
            reviewList.map((review, index) => (
              <React.Fragment key={review._id}>
                <ReviewBox
                  navigation={navigation}
                  username={review.user.username}
                  body={review.body}
                  date={review.lastUpdate.toLocaleString()}
                  authorId={review.user._id}
                />
                {index < reviewList.length - 1 && (
                  <View style={styles.separator} />
                )}
              </React.Fragment>
            ))}
          {!reviewList && <LoadingScreen small />}
        </View>
      </View>
      {error && !loading && (
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
    </ScrollView>
  ) : (
    <LoadingScreen />
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
  separator: {
    borderBottomWidth: 0.75,
    borderBottomColor: Colors.lightGray,
    marginVertical: 10,
  },
});
