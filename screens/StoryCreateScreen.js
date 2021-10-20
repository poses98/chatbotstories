import React, { useLayoutEffect, useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  TouchableOpacity,
  FlatList,
  Switch,
} from "react-native";
import { firestore, auth } from "firebase";
import { StackActions } from "@react-navigation/native";

import Colors from "../constants/Colors";
import GENRES from "../constants/Genres";
import LANGUAGES from "../constants/Languages";
import _STATUS_ from "../constants/StoryStatus";
import Ionicons from "@expo/vector-icons/Ionicons";
import LabeledInput from "../components/LabeledInput";
import { Picker } from "@react-native-picker/picker";
import Button from "../components/Button";
import { updateDoc, addDoc } from "../services/collections";

export const Label = ({ text, icon, ...props }) => {
  return (
    <View style={[styles.labelContainer, { ...props.labelStyle }]}>
      <Ionicons name={icon} size={15} color={Colors.gray} />
      <Text style={[{ color: Colors.black }, { ...props.textStyle }]}>
        {" "}
        {text}
      </Text>
    </View>
  );
};

export default ({ route, navigation }) => {
  /** STORY ID IN CASE IS UPDATE MODE */
  const [storyId, setStoryId] = useState(
    route.params ? route.params.storyId : ""
  );
  const [isEditMode, setEditMode] = useState(false);
  /**  */
  /** STATE ATRIBUTTES */
  const [owned, setowned] = useState(false); // owner of the story
  const [data, setdata] = useState({}); // metadata of the story
  const [loading, setloading] = useState(true); // is loading or not
  const [notloaded, setnotloaded] = useState(false); // couldnt load the data
  const [nameField, setnameField] = useState({
    // story name field
    errorMessage: "",
    text: "",
  });
  const [categoryMain, setcategoryMain] = useState(0); // category of the story
  const [oldCategory, setOldCategory] = useState(0); // category of the story

  const [descriptionField, setdescriptionField] = useState({
    // description of the story
    errorMessage: "",
    text: "",
  });
  const [interactive, setinteractive] = useState(false); // interactivity of the story
  const [oldInteractive, setOldInteractive] = useState(false); //check variable for old interactivity
  const [status, setstatus] = useState(0); // status of the story
  const [language, setlanguage] = useState(0); // language of the story

  const storyRef = firestore().collection("stories");

  /** Getting the metadata of the story */
  useEffect(() => {
    if (storyId != "") {
      storyRef
        .doc(storyId)
        .get()
        .then((doc) => {
          if (doc.exists) {
            console.log("Story loaded: ", doc.data());

            if (doc.data().author === auth().currentUser.uid) {
              console.log("edit mode enable");
              setEditMode(true);
              console.log("user is owner");
              setowned(true);
              console.log("data fetched into state variable:");
              setdata(doc.data());
              console.log(data);
              nameField.text = doc.data().title;
              setnameField({ ...nameField });
              descriptionField.text = doc.data().description;
              setdescriptionField({ ...descriptionField });
              setcategoryMain(doc.data().categoryMain);
              setOldCategory(doc.data().categoryMain);
              setinteractive(doc.data().interactive);
              setOldInteractive(doc.data().interactive);
              setlanguage(doc.data().language);
            } else {
              setStoryId("");
            }
            setloading(false);
          } else {
            // doc.data() will be undefined in this case
            setnotloaded(true);
            console.log("No such document! (METADATA)");
          }
        })
        .catch((error) => {
          console.log("Error getting document:", error);
        });
    } else {
      setloading(false);
    }
  }, []);
  /**Creates a new story from the data written by the user in the form
   *
   * @param {form data}} data
   */
  const createStory = (data) => {
    firestore()
      .collection("stories")
      .add(data)
      .then((docRef) => {
        //Creating storyId field in the story doc
        firestore()
          .collection("stories")
          .doc(docRef.id)
          .update({ storyId: docRef.id });
        const statsRef = firestore().collection("storyStats");
        const categoryRef = firestore().collection("storyCategories");
        //Creating the story doc in stats collection
        statsRef.doc(docRef.id).set({
          views: 0,
          likes: 0,
        });
        //Adding story to the respecting category
        categoryRef
          .doc(`${data.categoryMain}`)
          .collection("stories")
          .doc(docRef.id)
          .set({ id: false });
        //if story is intereactive adding it to the interactive category
        if (interactive) {
          categoryRef
            .doc("i")
            .collection("stories")
            .doc(docRef.id)
            .set({ id: false });
        }
        console.log("Document written with ID: ", docRef.id);
        //Creating reference to the story in user's collection
        firestore()
          .collection("users")
          .doc(auth().currentUser.uid)
          .collection("stories")
          .doc(docRef.id)
          .set({ date: data.date })
          .then(() => {
            navigation.dispatch(
              StackActions.replace("StoryInfo", {
                title: nameField.text,
                storyId: docRef.id,
              })
            );
          })
          .catch((error) => {
            console.error("Error adding document: ", error);
          });
      })
      .catch((error) => {
        console.error("Error adding document: ", error);
      });
  };
  /**Updates an existing story with the new data provided in the form
   *
   * @param {form data} data
   */
  const updateStory = (data) => {
    data.storyId = storyId;
    setdata({ ...data });
    updateDoc(storyRef, storyId, data);
    console.log("old category:", oldCategory);
    console.log("new category:", categoryMain);
    //checking if the category of the story has changed
    if (oldCategory != data.categoryMain) {
      console.log("proceeding to delete old category");
      const categoryRef = firestore().collection("storyCategories");
      //Adding story to the respecting category
      categoryRef
        .doc(`${data.categoryMain}`)
        .collection("stories")
        .doc(storyId)
        .set({ id: false });
      categoryRef
        .doc(`${oldCategory}`)
        .collection("stories")
        .doc(storyId)
        .delete();
    }
    //checking if the interactivity of the story has changed
    if (oldInteractive != data.interactive) {
      console.log(
        "interactivity has changed, proceeding to make changes on the db"
      );
      const categoryRef = firestore().collection("storyCategories");
      //if the new interactivity is true it means that we just need to add
      //the story to the interactive category ("i"). Otherwise we need to delete
      //it from that same category.
      if (data.interactive) {
        categoryRef
          .doc("i")
          .collection("stories")
          .doc(storyId)
          .set({ id: false });
      } else if (!data.interactive) {
        categoryRef
          .doc("i")
          .collection("stories")
          .doc(storyId)
          .delete();
      } else {
        console.log("Unexpected input.");
      }
    }
    //Creating reference to the story in user's collection
    firestore()
      .collection("users")
      .doc(auth().currentUser.uid)
      .collection("stories")
      .doc(storyId)
      .set({ date: data.date })
      .then(() => {
        navigation.dispatch(
          StackActions.replace("StoryInfo", {
            title: nameField.text,
            storyId: storyId,
          })
        );
      })
      .catch((error) => {
        console.error("Error adding document: ", error);
      });
  };
  /** GENRE BUBBLE TEMPLATE */
  const GenreBubble = ({ image, verboseName, genreKey }) => {
    return (
      <View style={{ flex: 1, flexDirection: "row", marginHorizontal: 10 }}>
        <TouchableOpacity
          style={styles.genreContainer}
          onPress={() => {
            setcategoryMain(genreKey);
          }}
        >
          <Image
            style={
              genreKey == categoryMain
                ? styles.genrePicSelected
                : styles.genrePic
            }
            source={image}
          />
          <Text style={styles.genreText}>{verboseName}</Text>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <ScrollView style={styles.container}>
      {!loading && !notloaded && (
        <View>
          {/** TITLE FIELD */}
          <LabeledInput
            label="Name"
            text={nameField.text}
            onChangeText={(text) => {
              setnameField({ text });
            }}
            errorMessage={nameField.errorMessage}
            placeholder="The perfect name for your story"
            maxLength={30}
            labelStyle={{ color: Colors.black }}
          />
          {/** DESCRIPTION FIELD */}
          <LabeledInput
            label={`Description ${descriptionField.text.length}/200`}
            labelStyle={{ color: Colors.black }}
            text={descriptionField.text}
            errorMessage={descriptionField.errorMessage}
            onChangeText={(text) => {
              setdescriptionField({ text });
            }}
            placeholder="A catchy description that everybody will love"
            maxLength={200}
            multiline={true}
            numberOfLines={6}
            maxHeight={120}
            inputStyle={{ padding: 7.9, textAlignVertical: "top" }}
          />

          <Label text="Choose main category " icon="layers-outline" />
          {/** GENRE BUBBLES FILLED FROM CONSTANT FILE */}
          <FlatList
            horizontal
            showsHorizontalScrollIndicator={false}
            data={GENRES}
            keyExtractor={(item) => item.genreKey.toString()}
            renderItem={({ item: { image, verboseName, genreKey } }) => {
              return (
                <GenreBubble
                  verboseName={verboseName}
                  image={image}
                  genreKey={genreKey}
                />
              );
            }}
          />
          {/** INTERACTIVE SWITCH */}
          <View style={{ flexDirection: "row", marginTop: 15 }}>
            <Label text="Will it be interactive?" icon="people-outline" />
            <Switch
              trackColor={{ false: "#767577", true: Colors.green }}
              thumbColor={interactive ? "#f4f3f4" : "#f4f3f4"}
              ios_backgroundColor="#3e3e3e"
              onValueChange={() => {
                setinteractive(!interactive);
              }}
              value={interactive}
              style={{ marginRight: 15 }}
            />
          </View>
          {/** PICKER FOR STATUS */}
          <View style={{ flexDirection: "column", marginTop: 15 }}>
            <Label text="Story status" icon="list-outline" />
            <Picker
              enabled={isEditMode}
              style={{
                marginHorizontal: 15,
                color: isEditMode ? Colors.black : Colors.lightGray,
                borderWidth: 1,
                borderColor: Colors.lightGray,
              }}
              dropdownIconColor={isEditMode ? Colors.black : Colors.lightGray}
              selectedValue={status}
              onValueChange={(itemValue, itemIndex) => setstatus(itemValue)}
            >
              <Picker.Item
                label={_STATUS_[0].verboseName}
                value={_STATUS_[0].statusId}
              />
              <Picker.Item
                label={_STATUS_[1].verboseName}
                value={_STATUS_[1].statusId}
              />
            </Picker>
          </View>
          {/** PICKER FOR LANGUAGE */}
          <View style={{ flexDirection: "column", marginTop: 15 }}>
            <Label text="Language" icon="list-outline" />
            <Picker
              enabled={true}
              style={{
                marginHorizontal: 15,
                color: Colors.black,
                borderWidth: 1,
                borderColor: Colors.black,
              }}
              dropdownIconColor={Colors.black}
              selectedValue={language}
              onValueChange={(itemValue, itemIndex) => setlanguage(itemValue)}
            >
              <Picker.Item
                label={LANGUAGES.en.verboseName}
                value={LANGUAGES.en.statusId}
              />
              <Picker.Item
                label={LANGUAGES.es.verboseName}
                value={LANGUAGES.es.statusId}
              />
            </Picker>
          </View>
          {/** CREATE STORY BUTTON */}
          <Button
            text={isEditMode ? "Save" : "Create"}
            textStyle={{ fontWeight: "bold" }}
            onPress={() => {
              let validation = true;
              if (nameField.text.length === 0) {
                validation = false;
                nameField.errorMessage = "Name can't be empty!";
                setnameField({ ...nameField });
              }
              if (descriptionField.text.length === 0) {
                validation = false;
                descriptionField.errorMessage = "Description can't be empty!";
                setdescriptionField({ ...descriptionField });
              }
              if (validation) {
                const data = {
                  title: nameField.text,
                  description: descriptionField.text.replace(
                    /(\r\n|\n|\r)/gm,
                    ""
                  ),
                  categoryMain: categoryMain,
                  date: Date.now(),
                  author: auth().currentUser.uid,
                  interactive: interactive,
                  status: status,
                  language: language,
                };
                if (!isEditMode) {
                  //create story
                  createStory(data);
                  console.log("Creating new story! : " + data);
                } else if (isEditMode) {
                  updateStory(data);
                  console.log("Updating an existing story! : " + data);
                }
              }
            }}
            buttonStyle={{
              marginVertical: 40,
              marginHorizontal: 15,
              height: 45,
              borderColor: Colors.black,
            }}
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
    paddingTop: 15,
  },

  genrePic: {
    width: 70,
    height: 70,
    borderRadius: 50,
  },
  genreContainer: {
    alignItems: "center",
    paddingVertical: 5,
    borderRadius: 50,
  },
  labelContainer: {
    flex: 1,
    flexDirection: "row",
    paddingLeft: 15,
    paddingVertical: 10,
    alignItems: "center",
  },
  genreText: {
    fontSize: 10,
    marginTop: 5,
    textTransform: "uppercase",
    color: Colors.black,
    fontWeight: "bold",
  },
  genrePicSelected: {
    width: 70,
    height: 70,
    borderRadius: 50,
    borderWidth: 3,
    borderColor: Colors.teal,
  },
});
