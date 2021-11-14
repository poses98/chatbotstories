import React, { useState } from "react";
import { StyleSheet, ScrollView } from "react-native";
import { firestore, auth } from "firebase";
import Colors from "../constants/Colors";
import _STATUS_ from "../constants/StoryStatus";
import LabeledInput from "../components/LabeledInput";
import Button from "../components/Button";
import { StatusSelector } from "../components/StatusSelector";
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
  const [status, setstatus] = useState(0); // status of the chapter
  const updateStatus = (value) => {
    setstatus(value);
  };
  const chaptersRef = firestore()
    .collection("stories")
    .doc(storyId)
    .collection("chapters");

  /** SEND CHAPTER TO FIRESTORE */
  const createChapter = (data) => {
    addDoc(chaptersRef, data);
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
      {/**STATUS SELECTOR */}
      <StatusSelector
        status={status}
        updateStatus={updateStatus}
        text="Chapter status"
      />
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
              lastUpdate: Date.now(),
              author: auth().currentUser.uid,
              status: status
            };
            if (!isEditMode) {
              route.params.saveChanges(data.title,data.description,data.lastUpdate,data.author,data.status)
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
