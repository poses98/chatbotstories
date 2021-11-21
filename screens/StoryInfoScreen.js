import React, { useLayoutEffect, useState, useEffect } from "react";
import {
  View,
  TouchableOpacity,
  StyleSheet,
  Text,
  Image,
  ImageBackground,
  Share,
  FlatList
} from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import Colors from "../constants/Colors";
import { firestore, auth } from "firebase";
import GENRES from "../constants/Genres";
import { ScrollView } from "react-native-gesture-handler";
import Button from "../components/Button";
import LANGUAGES from "../constants/Languages";
import MONTHS from "../constants/Months";
import STORY_STATUS from "../constants/StoryStatus";
import { StackActions } from "@react-navigation/native";
import { onSnapshot } from "../services/collections";
import { ChapterItem } from "../components/ChapterItem";
import { moderateScale } from "react-native-size-matters";
import * as Analytics from 'expo-firebase-analytics';


export default ({ navigation, route }) => {
  /** STATE OBJECTS */
  const [isSaved, setIsSaved] = useState(false);
  const [loading, setloading] = useState(true);
  const [loadingMetadata, setLoadingMetadata] = useState(true)
  const [loadingChapterList, setLoadingChapterList] = useState(true)
  const [loadingReviewList, setLoadingReviewList] = useState(true)
  const [loadingStats, setLoadingStats] = useState(true)
  const [data, setdata] = useState({});
  const [storyId, setstoryId] = useState(route.params.storyId || "");
  const [owned, setowned] = useState(false);
  const [notloaded, setnotloaded] = useState(false);
  const [stats, setstats] = useState({});
  const [canLike, setcanLike] = useState(true);
  const [authorUserName, setAuthorUserName] = useState("")
  const [chapterId, setChapterId] = useState("")
  const [chapterIndex, setChapterIndex] = useState(0)
  const [ended, setEnded] = useState(false)

  //Refs to firestore
  const storyRef = firestore().collection("stories");
  const statsRef = firestore().collection("storyStats");
  const userRef = firestore().collection("users");

  var date = new Date(data.date);
  var month = date.getMonth();
  var year = date.getFullYear();
  var day = date.getDate();
  /**Getting the author name */
  useEffect(() => {
    if (storyId != "") {
      userRef
        .doc(route.params.username)
        .get()
        .then((doc) => {
          if (doc.exists) {
            setAuthorUserName(doc.data().username)
          } else {
            // doc.data() will be undefined in this case
            console.log("No such document! (USER)");
          }
        })
        .catch((error) => {
          console.log("Error getting document:", error);
        });
    } else {
      console.log("No storyId associated");
      setnotloaded(true);
      setloading(false);
      setLoadingMetadata(false)
    }
  }, []);
  /** Getting the metadata of the story */
  useEffect(() => {
    if (storyId != "") {
      storyRef
        .doc(storyId)
        .get()
        .then((doc) => {
          if (doc.exists) {
            setdata(doc.data());
            if (doc.data().author === auth().currentUser.uid) {
              setowned(true);
            }
            setLoadingMetadata(false)
          } else {
            // doc.data() will be undefined in this case
            console.log("No such document! (METADATA)");
          }
        })
        .catch((error) => {
          console.log("Error getting document:", error);
        });
    } else {
      console.log("No storyId associated");
      setnotloaded(true);
      setloading(false);
      setLoadingMetadata(false)
    }
  }, []);
  /** Getting the stats of the story */
  useEffect(() => {
    if (storyId != "") {
      statsRef
        .doc(storyId)
        .get()
        .then((doc) => {
          if (doc.exists) {
            setstats(doc.data());
            // UPDATE VIEW WILL BE IN START READING BUTTON (AD WILL BE SHOWN)
            // statsRef.doc(storyId).update({ views: doc.data().views + 1 })
            setLoadingStats(false)
          } else {
            // doc.data() will be undefined in this case
            console.log("No such document! (STATS)");
          }
        })
        .catch((error) => {
          console.log("Error getting document:", error);
        });
    } else {
      setnotloaded(true);
      setloading(false);
    }
  }, []);
  /** Finding out if the user has already liked this story to enable the like button */
  useEffect(() => {
    if (storyId != "") {
      userRef
        .doc(auth().currentUser.uid)
        .collection("likedStories")
        .doc(storyId)
        .get()
        .then((doc) => {
          if (doc.exists) {
            setcanLike(false);
          } else {
            // doc.data() will be undefined in this case
          }
        })
        .catch((error) => {
          console.log("Error getting document:", error);
        });
    } else {
      setnotloaded(true);
      setloading(false);
    }
  }, []);
  /** Finding out if the user has already saved this story to check the saved button */
  useEffect(() => {
    if (storyId != "") {
      userRef
        .doc(auth().currentUser.uid)
        .collection("savedStories")
        .doc(storyId)
        .get()
        .then((doc) => {
          if (doc.exists) {
            setIsSaved(true);
          } else {
            // doc.data() will be undefined in this case
          }
        })
        .catch((error) => {
          console.log("Error getting document:", error);
        });
    } else {
      setnotloaded(true);
      setloading(false);
    }
  }, []);
  /** Rendering the top bar icons */
  const renderStackBarIconRight = () => {
    return (
      <View style={{ flexDirection: "row" }}>
        {/** save story button */}
        {!notloaded && !loadingChapterList && !loadingMetadata && !loadingStats && (
          <TouchableOpacity
            onPress={() => {
              setIsSaved(!isSaved);
              /**TODO Save story into user's account */
              if (!isSaved) {
                firestore()
                  .collection("users")
                  .doc(auth().currentUser.uid)
                  .collection("savedStories")
                  .doc(storyId)
                  .set({ date: Date.now() });
              } else if (isSaved) {
                firestore()
                  .collection("users")
                  .doc(auth().currentUser.uid)
                  .collection("savedStories")
                  .doc(storyId)
                  .delete();
              }
            }}
            style={{ paddingRight: 8 }}
          >
            <Ionicons
              name={!isSaved ? "bookmark-outline" : "bookmark"}
              size={26}
              color={Colors.black}
            />
          </TouchableOpacity>
        )}
        {/**Only render if it's owner*/}
        {owned && !notloaded && !loadingChapterList && !loadingMetadata && !loadingStats && (
          <TouchableOpacity
            onPress={() => {
              navigation.navigate("StorySettings", { storyId: storyId })
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
  /** Likes a story if it is possible, if it is already liked deletes the like */
  const likeStory = () => {
    if (canLike) {
      stats.likes += 1;
      statsRef.doc(storyId).update({ likes: stats.likes });
      userRef
        .doc(auth().currentUser.uid)
        .collection("likedStories")
        .doc(storyId)
        .set({ liked: true });
    } else {
      stats.likes -= 1;
      statsRef.doc(storyId).update({ likes: stats.likes });
      userRef
        .doc(auth().currentUser.uid)
        .collection("likedStories")
        .doc(storyId)
        .delete();
    }
    setcanLike(!canLike);
    setstats({ ...stats });
  };
  /** Share function to open share options in phone */
  const onShare = async () => {
    try {
      const result = await Share.share({
        message: `Hey! I have found ${data.title} in BookCraft and I think you\'re gonna love it!`,
        url: "",
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
      console.log(error.message);
      alert(error.message);
    }
  };
  /** Finding out if the user has already started this story to continue reading */
  useEffect(() => {
    if (storyId != "") {
      userRef
        .doc(auth().currentUser.uid)
        .collection("startedStories")
        .doc(storyId)
        .get()
        .then((doc) => {
          if (doc.exists) {
            setChapterId(doc.data().nextChapterId)
            onSnapshot(
              chapterListRef,
              (newLists) => {
                let i = 0;
                newLists.forEach(element => {
                  console.log("%s %s i=%d", element.id, doc.data().nextChapterId, i)
                  element.index = i;
                  const _i = i
                  i++
                  if (element.id === doc.data().nextChapterId && !(doc.data().nextChapterId === null)) {
                    setChapterIndex(_i)
                    console.log("chapter index set to: " + _i)
                  } else if (doc.data().nextChapterId === null || doc.data().finished) {
                    setChapterIndex(doc.data().lastChapterId)
                    setEnded(true)
                    console.log("chapter index set to: " + doc.data().lastChapterId)
                  }
                });
                setLoadingChapterList(false)
                setChapterList(newLists)
              },
              {
                sort: (a, b) => {
                  if (a.index < b.index) {
                    return -1;
                  }

                  if (a.index > b.index) {
                    return 1;
                  }

                  return 0;
                },
              }
            );
            console.log("Story has been started by the user and left on chapter: " + doc.data().nextChapterId);
          } else {
            setLoadingChapterList(false)
          }
        })
        .catch((error) => {
          console.log("Error getting document:", error);
        });
    } else {
      setnotloaded(true);
      setloading(false);
    }
  }, []);
  /**Chapter list */
  const [chapterList, setChapterList] = useState([]);
  const chapterListRef = firestore()
    .collection("stories")
    .doc(route.params.storyId)
    .collection("chapters");
  useEffect(() => {
    onSnapshot(
      chapterListRef,
      (newLists) => {
        let i = 0;
        newLists.forEach(element => {
          element.index = i;
          i++
        });
        setChapterList(newLists)
      },
      {
        sort: (a, b) => {
          if (a.index < b.index) {
            return -1;
          }

          if (a.index > b.index) {
            return 1;
          }

          return 0;
        },
      }
    );

  }, [])

  /**Review list */
  const [reviewList, setReviewList] = useState([])
  const reviewListRef = firestore()
    .collection("stories")
    .doc(route.params.storyId)
    .collection("reviews");
  useEffect(() => {
    onSnapshot(
      reviewListRef,
      (newLists) => {
        setReviewList(newLists)
        setLoadingReviewList(false)
        console.log("Review: %s",reviewList[0])
      },
      {
        sort: (a, b) => {
          if (a.date < b.date) {
            return -1;
          }

          if (a.date > b.date) {
            return 1;
          }

          return 0;
        },
      }
    );
  }, []);
  return (
    <ScrollView style={styles.container}>
      {!loadingChapterList && !loadingMetadata && !loadingStats && !notloaded && (
        <View>
          {/**HEADER */}
          <ImageBackground
            source={GENRES[data.categoryMain].image}
            resizeMode="cover"
            onError={() => { }}
            style={styles.image}
          >
            <View style={styles.storyContainer}>
              {/**STORY NAME */}
              <Text style={styles.storyTitle}>{data.title} </Text>
              {/**STORY AUTHOR */}
              <Text
                style={[
                  styles.storyDescription,
                  { fontStyle: "italic", fontSize: 12, marginBottom: 5 },
                ]}
              >
                Written by {authorUserName}
              </Text>
              {/**STORY STATUS */}

              {/**STORY STATS */}
              <View style={{ flexDirection: "row" }}>
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
                  <Text style={{ color: Colors.lightGray }}>{stats.likes}</Text>
                </View>
              </View>
              {/**STORY DESCRIPTION */}
              <Text style={styles.storyDescription}>"{data.description}"</Text>
              {/** CONTINUE/START READING BUTTON */}
              <Button
                text={(chapterId === "") ? "Start reading" : ended ? "Read again" : "Continue reading"}
                textStyle={{ fontWeight: "bold", color: Colors.lightGray }}
                onPress={() => {
                  //TODO admob
                  navigation.navigate("ChatRead", {
                    storyName: data.title,
                    storyId: storyId,
                    chapterId: !(chapterId === "") ? chapterId : chapterList[0].id,
                    chapterList: chapterList
                  })
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
              flexDirection: "row",
              flex: 1,
              alignItems: "center",
              marginVertical: 10,
              marginHorizontal:15
            }}
          >
            {/**LIKE BUTTON */}
            <View>
              <TouchableOpacity style={styles.storyStats} onPress={likeStory}>
                <Ionicons
                  name={canLike ? "heart-outline" : "heart"}
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
            <View
              style={{ flex: 1, alignItems: "flex-end"}}
            >
              <Text>
                {day} {MONTHS[month]} {year}
              </Text>
            </View>
          </View>

          {/**Chapter list */}
          <Text
            style={{ marginHorizontal: 15, fontSize: 15, color: Colors.gray, textTransform:"uppercase" }}
          >Chapter list</Text>
          <View style={{ maxHeight: 250, minHeight: 200, marginHorizontal: 15, borderWidth: 1, borderColor:Colors.black, borderRadius:10 }}>
            <FlatList
              data={chapterList}
              renderItem={({ item: { title, description, id, index } }) => {
                return (
                  <ChapterItem
                    title={title}
                    onPress={() => {
                      //TODO admob
                      navigation.navigate("ChatRead", {
                        storyName: data.title,
                        storyId: storyId,
                        chapterId: id,
                        chapterList: chapterList
                      })
                    }}
                    id={id}
                    navigation={navigation}
                    onDelete={() => removeItemFromLists(id)}
                    index={index}
                    currentIndex={chapterIndex}
                    finished={ended}
                    list={false}

                  />
                );
              }}
            />
          </View>
          {/**Reviews */}
          <Text
            style={{ marginHorizontal: 15,marginVertical:15, fontSize: 15, color: Colors.gray, textTransform:"uppercase" }}
          >Reviews</Text>

        </View>
      )}
      {!loadingChapterList && !loadingMetadata && !loadingStats && notloaded && (
        <View
          style={{
            alignItems: "center",
            flex: 1,
            padding: 15,
            justifyContent: "center",
          }}
        >
          <Text>We are sorry!😭</Text>
          <Text> There has been an error while loading your story😥</Text>
          <Text> We hope to fix it as soon as possible</Text>
          <Text> Try again later</Text>
        </View>
      )}
      {loadingChapterList && loadingMetadata && loadingStats && loading && (
        <View
          style={{
            flex: 1,
            backgroundColor: "#fff",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Image
            source={require("../assets/loading.gif")}
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

    backgroundColor: "#fff",
  },
  image: {
    flex: 1,
    justifyContent: "center",
    minHeight: moderateScale(230, 0.45),
    width: "100%",
  },
  storyContainer: {
    flex: 1,
    justifyContent: "space-between",
    alignItems: "center",
    justifyContent: "center",
    padding: 15,
    borderColor: Colors.gray,
    backgroundColor: "rgba(52, 52, 52, 0.6)"
  },
  storyBar: {
    alignSelf: "flex-start",
    padding: 0,
    flexDirection: "row",
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
    fontWeight: "bold",
    color: "#fafafa",
  },
  storyDescription: {
    color: Colors.lightGray,
  },
  storyMainInfoContainer: {
    flexDirection: "column",
    color: "#fafafa",
  },
  storyStats: {
    flexDirection: "row",
    alignItems: "center",
  },
});
