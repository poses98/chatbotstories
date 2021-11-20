import React, { useLayoutEffect, useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  TouchableOpacity,
  FlatList,
  ImageBackground,
} from "react-native";
import ProfileHeader from "../components/Profile/ProfileHeader";
import StoryContainer from "../components/StoryContainer";
import Colors from "../constants/Colors";
import Ionicons from "@expo/vector-icons/Ionicons";
import { firestore, auth } from "firebase";
import GENRES from "../constants/Genres";
import * as firebase from "firebase";
import "firebase/storage";
import * as Analytics from 'expo-firebase-analytics';

const images = {
  terror: require("../assets/terror.jpg"),
  adventure: require("../assets/adventure.jpg"),
  drama: require("../assets/drama.jpg"),
  snow: require("../assets/snow.jpg"),
};

export default ({ navigation }) => {
  const [stories, setStories] = useState([]);
  const [data, setdata] = useState({});
  const [loading, setloading] = useState(true);
  const [storyCount,setStoryCount] = useState(0)
  //Get user information
  const storyRef = firestore().collection("stories");

  useEffect(() => {
    const unsubscribeStories = firestore()
      .collection("users")
      .doc(auth().currentUser.uid) // TODO ESTO HAY QUE CAMBIARLO POR EL ID DE USUARIO!
      .collection("savedStories")
      .orderBy("date", "desc")
      .onSnapshot(
        (querySnapshot) => {
          var fetchedStories = [];
          if (querySnapshot.size === 0) {
            setloading(false);
          }
          console.log("Stories found: " + querySnapshot.size);
          setStoryCount(querySnapshot.size);
          console.log("Story count: " + storyCount);
          querySnapshot.forEach((doc) => {
            //Fetching every story from DB
            storyRef
              .doc(doc.id)
              .get()
              .then((doc) => {
                if (doc.exists) {
                  fetchedStories.push(doc.data());
                  console.log("Story loaded with id: ", doc.id);
                  setStories(fetchedStories);
                  setloading(false);
                } else {
                  // doc.data() will be undefined in this case
                  setloading(false);
                  console.log("No such document!");
                }
              })
              .catch((error) => {
                console.log("Error getting document:", error);
              });
          });

          console.log(stories);
        },
        (error) => {
          setloading(false);
          console.log(error);
        }
      );

    return unsubscribeStories;
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
                  author
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
                      navigation.navigate("StoryInfo", {
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
                justifyContent: "center",
                alignContent: "center",
                alignSelf: "center",
                opacity: 0.5,
                alignItems: "center",
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
    flexDirection: "column",
    justifyContent: "space-between",
    height: 230,
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
    borderColor: "#fafafa", //TODO
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
    flex: 1,
    alignItems: "flex-start",
    alignContent: "center",
    justifyContent: "center",
    flexDirection: "column",
    color: "#fafafa",
  },
  storyStats: {
    flexDirection: "row",
    marginRight: 15,
    alignItems: "center",
  },
});
