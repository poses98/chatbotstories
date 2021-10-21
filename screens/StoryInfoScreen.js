import React, { useLayoutEffect, useState, useEffect } from "react";
import {
  View,
  TouchableOpacity,
  StyleSheet,
  Text,
  Image,
  ImageBackground,
  Share,
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

export default ({ navigation, route }) => {
  /** STATE OBJECTS */
  const [isSaved, setIsSaved] = useState(false);
  const [loading, setloading] = useState(true);
  const [data, setdata] = useState({});
  const [storyId, setstoryId] = useState(route.params.storyId || "");
  const [owned, setowned] = useState(false);
  const [notloaded, setnotloaded] = useState(false);
  const [stats, setstats] = useState({});
  const [canLike, setcanLike] = useState(true);
  const authorName = route.params.username;

  //Refs to firestore
  const storyRef = firestore().collection("stories");
  const statsRef = firestore().collection("storyStats");
  const userRef = firestore().collection("users");

  var date = new Date(data.date);
  var month = date.getMonth();
  var year = date.getFullYear();
  var day = date.getDate();

  /** Getting the metadata of the story */
  useEffect(() => {
    if (storyId != "") {
      storyRef
        .doc(storyId)
        .get()
        .then((doc) => {
          if (doc.exists) {
            console.log("Story loaded: ", doc.data());
            setdata(doc.data());
            if (doc.data().author === auth().currentUser.uid) {
              setowned(true);
            }
            setloading(false);
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
            console.log("Story stats loaded: ", doc.data());
            setstats(doc.data());
            // UPDATE VIEW WILL BE IN START READING BUTTON (AD WILL BE SHOWN)
            // statsRef.doc(storyId).update({ views: doc.data().views + 1 })
            setloading(false);
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
            console.log("Story has been liked by the user");
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
            console.log("Story has been saved by the user");
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
  /** Fetching the chapter list for this story */

  /** Rendering the top bar icons */
  const renderStackBarIconRight = () => {
    return (
      <View style={{ flexDirection: "row" }}>
        {/** save story button */}
        {!notloaded && !loading && (
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
            style={{ paddingRight: 5 }}
          >
            <Ionicons
              name={!isSaved ? "bookmark-outline" : "bookmark"}
              size={26}
              color={Colors.black}
            />
          </TouchableOpacity>
        )}
        {/**Only render if it's owner*/}
        {owned && !notloaded && !loading && (
          <TouchableOpacity
            onPress={() => {
              /**TODO setEditMode 
              navigation.dispatch(
                StackActions.replace("StoryCreate", {
                  storyId: storyId,
                })
              );*/
              navigation.navigate("StorySettings",{storyId:storyId})
            }}
            style={{ paddingRight: 5 }}
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

  return (
    <ScrollView style={styles.container}>
      {!loading && !notloaded && (
        <View>
          {/**HEADER */}
          <ImageBackground
            source={GENRES[data.categoryMain].image}
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
                  { fontStyle: "italic", fontSize: 12, marginBottom: 5 },
                ]}
              >
                Written by {authorName}
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
            </View>
          </ImageBackground>
          {/** SOCIAL INTERACTIONS  */}
          <View
            style={{
              flexDirection: "row",
              flex: 1,
              alignItems: "center",
              marginVertical: 10,
              paddingLeft: 10,
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
              style={{ flex: 1, alignItems: "flex-end", marginHorizontal: 10 }}
            >
              <Text>
                {day} {MONTHS[month]} {year}
              </Text>
            </View>
          </View>
          {/** CONTINUE/START READING BUTTON */}
          <Button
            text="Start reading"
            textStyle={{ fontWeight: "bold" }}
            onPress={() => {}}
            buttonStyle={{
              marginVertical: 15,
              marginHorizontal: 15,
              height: 45,
              borderColor: Colors.black,
            }}
          />
          {/**Chapters list */}
          <View
            style={{
              justifyContent: "center",
              alignItems: "center",
              marginVertical: 20,
              marginHorizontal: 15,
              flex: 1,
              flexDirection: "row",
            }}
          >
            <Text
              style={{
                textTransform: "uppercase",
                fontWeight: "normal",
                fontSize: 20,
              }}
            >
              Chapter list
              <Text
                style={[
                  styles.storyDescription,
                  {
                    fontStyle: "normal",
                    fontWeight: "normal",
                    fontSize: 10,
                    marginBottom: 1,
                    color: Colors.black,
                  },
                ]}
              >
                ({STORY_STATUS[data.status].verboseName})
              </Text>
            </Text>
            {/** ADD NEW CHAPTER BUTTON */}
            {owned && (
              <View style={{ flex: 1, alignItems: "flex-end" }}>
                <TouchableOpacity
                  style={styles.storyStats}
                  onPress={() => {
                    navigation.navigate("ChapterEdit",{
                      storyId: storyId,
                    });
                  }}
                >
                  <Ionicons
                    name="add-circle-outline"
                    size={30}
                    color={Colors.black}
                  />
                </TouchableOpacity>
              </View>
            )}
          </View>
          <TouchableOpacity>
            <View
              style={{
                flexDirection: "row",
                flex: 1,
                alignItems: "center",
                paddingVertical: 10,
                paddingLeft: 10,
                borderBottomWidth: 1,
                borderColor: Colors.gray,
                marginHorizontal: 20,
              }}
            >
              <View>
                <Text>Chapter name</Text>
              </View>
              <View
                style={{
                  flex: 1,
                  alignItems: "flex-end",
                  marginHorizontal: 10,
                }}
              >
                {/** <Ionicons name="chevron-forward" size={20} color={Colors.black} /> */}
              </View>
            </View>
          </TouchableOpacity>
        </View>
      )}
      {!loading && notloaded && (
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
          <Text> Try again later</Text>
        </View>
      )}
      {loading && (
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
    height: 230,
    width: "100%",
  },
  storyContainer: {
    flex: 1,
    justifyContent: "space-between",
    alignItems: "center",
    justifyContent: "center",
    padding: 15,
    borderColor: Colors.gray,
    backgroundColor: "rgba(52, 52, 52, 0.6)",
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
    paddingHorizontal: 5,
  },
});
