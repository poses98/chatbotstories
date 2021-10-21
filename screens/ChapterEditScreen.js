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
import { Label } from "../components/Label";

export default ({ route, navigation }) => {
  const [Owned, setOwned] = useState(false);
  const [Data, setData] = useState([]);
  const [isEditMode, setEditMode] = useState(false);
  const [storyId, setStoryId] = useState(
    route.params ? route.params.storyId : ""
  );
  const [nameField, setnameField] = useState({
    // story name field
    errorMessage: "",
    text: "",
  });
  const [descriptionField, setdescriptionField] = useState({
    // description of the story
    errorMessage: "",
    text: "",
  });
  const [memberNumber, setMemberNumber] = useState(2);
  const [index, setIndex] = useState(0);

  const chaptersRef = firestore()
    .collection("stories")
    .doc(storyId)
    .collection("chapters");
  /**CHECKING IF THIS IS FIRST CHAPTER */
  useEffect(() => {
    chaptersRef.onSnapshot((querySnapshot) => {
      if (querySnapshot) {
        console.log("Number of chapters: " + querySnapshot.size);
        return querySnapshot.size;
      }
    });
  }, []);
  /** MEMBER ADD COMPONENT WITH +/- ICONS */
  const MemberAddComponent = () => {
    return (
      <View
        style={{
          flex: 1,
          flexDirection: "row",
          marginHorizontal: 50,
          justifyContent: "space-between",
          marginVertical: 10,
        }}
      >
        {/**MINUS BUTTON */}
        <TouchableOpacity
          onPress={() => {
            //Sum 1 to the active members
            if (memberNumber > 2) {
              setMemberNumber(memberNumber - 1);
            }
          }}
        >
          <Ionicons
            name="remove-circle-outline"
            size={40}
            color={Colors.black}
          />
        </TouchableOpacity>
        {/**NUMBER */}
        <Text style={{ fontSize: 35 }}>{memberNumber}</Text>
        {/**PLUS BUTTON */}
        <TouchableOpacity
          onPress={() => {
            //Sum 1 to the active members
            if (memberNumber < 8) {
              setMemberNumber(memberNumber + 1);
            }
          }}
        >
          <Ionicons name="add-circle-outline" size={40} color={Colors.black} />
        </TouchableOpacity>
      </View>
    );
  };
  /** SEND CHAPTER TO FIRESTORE */
  const createChapter = (data) => {
    addDoc(chaptersRef, { data });
  };
  return (
    <ScrollView style={styles.container}>
      {/**TITLE INPUT */}
      <LabeledInput
        label="Chapter name"
        text={nameField.text}
        onChangeText={(text) => {
          setnameField({ text });
        }}
        errorMessage={nameField.errorMessage}
        placeholder="Choose a good name for your chapter"
        maxLength={30}
        labelStyle={{ color: Colors.black }}
        inputStyle={{ color: Colors.black }}
      />
      {/**DESCRIPTION */}
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
        inputStyle={{
          padding: 7.9,
          textAlignVertical: "top",
          color: Colors.black,
        }}
      />
      {/** NUMBER OF MEMBERS OF THE CHAPTER */}
      <Label
        text="Number of participants "
        icon="people-outline"
        labelStyle={{}}
      />
      <MemberAddComponent />
      {/**INPUT POPULATED FROM THE NUMBER */}
      {/**CREATE CHAPTER BUTTON */}
      <Button
        text={isEditMode ? "Save" : "Create"}
        textStyle={{ fontWeight: "bold" }}
        onPress={() => {
          let validation = true;
          if (nameField.text.length === 0) {
            validation = false;
            nameField.errorMessage = "Title can't be empty!";
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
              description: descriptionField.text.replace(/(\r\n|\n|\r)/gm, ""),
              date: Date.now(),
              author: auth().currentUser.uid,
            };
            if (!isEditMode) {
              createChapter(data);
            } else if (isEditMode) {
              //update chapter
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
