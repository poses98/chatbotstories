import React, { useState, useLayoutEffect, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  Alert,
} from "react-native";
import { CommonActions } from "@react-navigation/native";
import Colors from "../constants/Colors";
import A from "react-native-a";
import LabeledInput from "../components/LabeledInput";
import Ionicons from "@expo/vector-icons/Ionicons";
import { firestore, auth,storage } from "firebase";
import { updateDoc, removeDoc } from "../services/collections";
import { doc, getDoc } from "firebase/firestore";
import * as ImagePicker from "expo-image-picker";
import * as firebase from "firebase";
import "firebase/storage";

export default ({ navigation }) => {
  const [hasBeenChanges, setHasBeenChanges] = useState(false);
  const [data, setdata] = useState({
    username: {
      errorMessage: "",
    },
  });
  const [errorMessage, seterrorMessage] = useState("");
  const [loading, setloading] = useState(true);
  const [oldUsername, setoldUsername] = useState("");
  const docRef = firestore().collection("users");
  const userRef = firestore().collection("usernames");
  /**
   * Getting the user data to show in the form
   */
  useEffect(() => {
    docRef
      .doc(auth().currentUser.uid)
      .get()
      .then((doc) => {
        if (doc.exists) {
          console.log("Document loaded");
          setoldUsername(doc.data().username);
          setdata(doc.data());
          setloading(false);
        } else {
          // doc.data() will be undefined in this case
          console.log("No such document!");
        }
      })
      .catch((error) => {
        console.log("Error getting document:", error);
      });
  }, []);
  /**
   * This function renders the icons in headerbar
   */
  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => renderStackBarIconRight(navigation),
      headerLeft: () => backButtonProfileEdit(navigation),
      headerRightContainerStyle: {
        paddingRight: 10,
      },
    });
  });
  /**
   * This function renders the right icon in the stack bar and
   * updates database when the icon is pressed
   */
  const renderStackBarIconRight = () => {
    return (
      <View style={{ flexDirection: "row" }}>
        <TouchableOpacity
          onPress={() => {
            data.description = data.description.replace(/\r?\n|\r/, "").trim();
            setdata({ ...data });
            userRef
              .doc(data.username.toLowerCase())
              .get()
              .then((doc) => {
                let available = false;
                if (doc.exists) {
                  console.log(doc.data());
                  if (doc.data().uid === auth().currentUser.uid) {
                    available = true;
                  } else {
                    available = false;
                  }
                } else {
                  available = true;
                }

                if (available) {
                  console.log(`deleting last username: ${oldUsername}`);
                  removeDoc(userRef, oldUsername.toLowerCase());
                  console.log("username available, updating object...");
                  firestore()
                    .collection("usernames")
                    .doc(data.username.toLowerCase())
                    .set({ uid: auth().currentUser.uid });

                  updateDoc(docRef, auth().currentUser.uid, data);
                  uploadImage();
                } else {
                  console.log(
                    "USERNAME NOT AVAILABLE. PROCEEDING TO HANDLE THIS."
                  );

                  seterrorMessage("Username is not available 💔");
                }
              })
              .catch((error) => {
                console.log("Error getting document:", error);
              });
          }}
          style={{ paddingRight: 5 }}
        >
          <Ionicons name="checkmark-outline" size={26} color={Colors.black} />
        </TouchableOpacity>
      </View>
    );
  };
  /**
   * This function renders the back button in the stack screen
   */
  const backButtonProfileEdit = () => {
    return (
      <View style={{ flexDirection: "row" }}>
        <TouchableOpacity
          onPress={() => {
            if (hasBeenChanges) {
              changesWillNotBeSavedAlert(navigation);
            } else {
              navigation.dispatch(CommonActions.goBack());
            }
          }}
          style={{ paddingLeft: 10 }}
        >
          <Ionicons name="close-outline" size={26} color={Colors.black} />
        </TouchableOpacity>
      </View>
    );
  };
  /**
   * This functioin shows an alert box alerting that changes won't be saved
   */
  const changesWillNotBeSavedAlert = () =>
    Alert.alert(
      "Changes will not be saved",
      "Are you sure?",
      [
        {
          text: "Cancel",
          onPress: () => console.log("Cancel Pressed"),
          style: "cancel",
        },
        {
          text: "OK",
          onPress: () => {
            navigation.dispatch(CommonActions.goBack());
          },
        },
      ],
      { cancelable: true }
    );
  //State variable for the image that will be uploaded to firebase storage
  const [image, setImage] = useState(null);
  //Checking for the media permission
  useEffect(() => {
    (async () => {
      if (Platform.OS !== "web") {
        const { status } =
          await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== "granted") {
          alert("Sorry, we need camera roll permissions to make this work!");
        }
      }
    })();
  }, []);
  /** Function that selects an image form the library */
  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images, //type of media that is uploading
      allowsEditing: true, //Only android iOS default 1:1
      aspect: [1, 1], //aspect ratio for the pic.
      quality: 0.1, //from 0 to 1 where 1 is max. quality
      allowsMultipleSelection: false,
    });

    console.log(result);

    if (!result.cancelled) {
      setImage(result.uri);
      setHasBeenChanges(true);
    }
  };
  const uploadImage = () => {
    storage
    .ref()
    .child("images/" + auth().currentUser.uid).putFile(image)

     
    task.on("state_changed", (taskSnapshot) => {
      console.log(
        `${taskSnapshot.bytesTransferred} transferred out of ${taskSnapshot.totalBytes}`
      );
    });

    task.then(() => {
      console.log("Image uploaded to the bucket!");
      navigation.dispatch(CommonActions.goBack());
    });
  };
  return (
    <ScrollView style={styles.container}>
      {!loading && data && (
        <View>
          <Image
            style={styles.profilePic}
            source={
              image
                ? { uri: image }
                : require("../assets/profilepicplaceholder.png")
            }
          />
          <TouchableOpacity
            onPress={() => {
              pickImage();
            }}
          >
            <Text style={styles.changeProfilePicText}>
              Change profile picture
            </Text>
          </TouchableOpacity>

          {/**Name */}
          <LabeledInput
            label="Name"
            text={data.name}
            onChangeText={(text) => {
              setdata({ ...data, name: text });
              setHasBeenChanges(true);
            }}
            autoCompleteType={"name"}
            placeholder="Your name"
            maxLength={30}
            defaultValue={data.name}
          />
          {/**User name */}
          <LabeledInput
            label="Username"
            text={data.username}
            errorMessage={errorMessage}
            onChangeText={(text) => {
              setdata({ ...data, username: text });
              setHasBeenChanges(true);
            }}
            placeholder="Your username"
            maxLength={20}
            autoCapitalize="none"
            value={data.username}
          />
          {/**Web */}
          <LabeledInput
            label="Website"
            text={data.name}
            onChangeText={(text) => {
              setdata({ ...data, website: text });
              setHasBeenChanges(true);
            }}
            placeholder="Your personal or professional website"
            maxLength={60}
            autoCapitalize="none"
            value={data.website}
          />
          {/**Description */}
          <LabeledInput
            label={`Description ${data.description.length}/200`}
            text={data.description}
            onChangeText={(text) => {
              setdata({ ...data, description: text });
              setHasBeenChanges(true);
            }}
            placeholder="Present yourself to other people"
            maxLength={200}
            value={data.description}
            multiline={true}
            numberOfLines={6}
            maxHeight={120}
            inputStyle={{ padding: 7.9, textAlignVertical: "top" }}
          />
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
            source={require("../assets/loading_simple.gif")}
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
  profilePic: {
    width: 90,
    height: 90,
    borderRadius: 50,
    alignItems: "center",
    alignSelf: "center",
    marginVertical: 15,
  },
  changeProfilePicText: {
    alignSelf: "center",
    color: Colors.blue,
    fontSize: 16,
    marginBottom: 15,
  },
  icon: {
    padding: 5,
    fontSize: 24,
  },
  centeredView: {
    justifyContent: "center",
    alignItems: "center",
    marginTop: 50,
  },
  modalView: {
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  infoBox: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  textInfo: {
    fontSize: 14,
    marginTop: 3,
  },
  numberInfo: {
    fontWeight: "bold",
    fontSize: 18,
  },
  bioBox: {
    flex: 1,
    paddingHorizontal: 15,
    paddingVertical: 5,
  },
  profileName: {
    fontWeight: "bold",
    fontSize: 15,
  },
  profileWeb: {
    fontSize: 15,
  },
  profileDescription: {
    fontSize: 15,
    justifyContent: "center",
    alignItems: "stretch",
  },
});
