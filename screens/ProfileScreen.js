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

const images = {
  terror: require("../assets/terror.jpg"),
  adventure: require("../assets/adventure.jpg"),
  drama: require("../assets/drama.jpg"),
  snow: require("../assets/snow.jpg"),
};


export default ({ navigation }) => {
  // TODO loading for every single item from DB to be totally loaded!
  const testId = "dOS86iiJmcPbVKi4nP9m8BAUr0g2"
  const TEST = false;
  const [owned, setOwned] = useState(false)
  const [stories, setStories] = useState([]);
  const [storyCont, setStoryCont] = useState(0)
  const [data, setdata] = useState({});
  const [loading, setloading] = useState(true);
  const [image, setImage] = useState(null);
  //Get user information
  const userRef = firestore().collection("users");
  const storyRef = firestore().collection("stories");
  
  useEffect(() => {
    const unsubscribe = userRef
      .doc(TEST ? testId : auth().currentUser.uid) // TODO ESTO HAY QUE CAMBIARLO POR EL ID DE USUARIO!
      .onSnapshot((doc) => {
        console.log("Profile data fetched: ", doc.data());
        setdata(doc.data());
        downloadImage(TEST ? testId : auth().currentUser.uid);
      });
    return unsubscribe;
  }, []);
  
  useEffect(() => {
    const unsubscribeStories = firestore()
      .collection("users")
      .doc(TEST ? testId : auth().currentUser.uid) // TODO ESTO HAY QUE CAMBIARLO POR EL ID DE USUARIO!
      .collection("stories")
      .orderBy("date", "desc")
      .limit(100)
      .onSnapshot(
        (querySnapshot) => {
          var fetchedStories = [];
          if (querySnapshot.size === 0) {
            setloading(false);
          }else{
            setStoryCont(querySnapshot.size)
          }
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
  
  async function downloadImage(userId) {
    const ref = firebase
      .storage()
      .ref()
      .child("profilePictures/" + userId);

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
          case "storage/object-not-found":
            console.log("ERROR GETTING IMAGE: Storage doesn't exist");
            break;

          case "storage/unauthorized":
            // User doesn't have permission to access the object
            console.log(
              "ERROR GETTING IMAGE: User doesn't have permission to access the file."
            );
            break;

          case "storage/canceled":
            // User canceled the upload
            console.log("ERROR GETTING IMAGE: User cancelled operation");
            break;

          case "storage/unknown":
            // Unknown error occurred, inspect the server response
            console.log("ERROR GETTING IMAGE: Unkwon error occurred");
            break;
        }
      });
  }
  

  return (
    <ScrollView style={styles.container}>
      {!loading && (
        <View>
          <ProfileHeader
            name={data.name}
            web={data.website}
            description={data.description}
            posts={storyCont}
            followers="673"
            following="1.965"
            navigation={navigation}
            userId={auth().currentUser.uid}
            image={image}
          />
          {console.log(stories.length)}
          {!(stories.length == 0) && (
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
                        username: data.username,
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
                justifyContent: "center",
                alignContent: "center",
                alignSelf: "center",
                opacity: 0.5,
                alignItems: "center",
                height: 300,
              }}
            >
              <Text>Write some stories and they will show up here!</Text>
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
          {/** TODO Change loading to loading bars */}
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
