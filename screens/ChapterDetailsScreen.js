import React, { useState } from 'react';
import { StyleSheet, ScrollView } from 'react-native';
import { firestore, auth } from '@react-native-firebase/app';
import Colors from '../constants/Colors';
import _STATUS_ from '../constants/StoryStatus';
import LabeledInput from '../components/LabeledInput';
import Button from '../components/Button';
import { StatusSelector } from '../components/StatusSelector';
import { CommonActions } from '@react-navigation/native';

export default ({ route, navigation }) => {
  const [Owned, setOwned] = useState(false);
  const [Data, setData] = useState([]);
  const [isEditMode, setEditMode] = useState(false);
  const [storyId, setStoryId] = useState(
    route.params ? route.params.storyId : ''
  );
  const [nameField, setnameField] = useState({
    // story name field
    errorMessage: '',
    text: '',
  });
  const [descriptionField, setdescriptionField] = useState({
    // description of the story
    errorMessage: '',
    text: '',
  });
  const [memberNumber, setMemberNumber] = useState(2);
  const [index, setIndex] = useState(0);
  const [status, setstatus] = useState(0); // status of the chapter
  const updateStatus = (value) => {
    setstatus(value);
  };
  const chaptersRef = firestore()
    .collection('stories')
    .doc(storyId)
    .collection('chapters');

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
          textAlignVertical: 'top',
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
        text={isEditMode ? 'Save' : 'Create'}
        textStyle={{ fontWeight: 'bold' }}
        onPress={() => {
          let validation = true;
          if (nameField.text.length < 3) {
            Analytics.logEvent('ChapterNameNoValid', {
              sender: 'verifier',
              user: auth().currentUser.uid,
              screen: 'chapterDetailsScreen',
              purpose: 'Try to create a chapter with less than 3 chars',
            });
            validation = false;
            nameField.errorMessage = 'Title must have at least 3 characters';
            setnameField({ ...nameField });
          }

          if (validation) {
            const data = {
              title: nameField.text,
              description: descriptionField.text.replace(/(\r\n|\n|\r)/gm, ''),
              lastUpdate: Date.now(),
              author: auth().currentUser.uid,
              status: status,
            };

            if (!isEditMode) {
              route.params.saveChanges(data);
              navigation.dispatch(CommonActions.goBack());
              Analytics.logEvent('CreateChapter', {
                sender: 'card',
                user: auth().currentUser.uid,
                screen: 'chapterDetailsScreen',
                purpose: 'Create a chapter',
              });
            } else if (isEditMode) {
              //update chapter
              Analytics.logEvent('UpdateChapter', {
                sender: 'card',
                user: auth().currentUser.uid,
                screen: 'chapterDetailsScreen',
                purpose: 'Update a chapter',
              });
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
    backgroundColor: '#fff',
    paddingTop: 15,
  },

  genrePic: {
    width: 70,
    height: 70,
    borderRadius: 50,
  },
  genreContainer: {
    alignItems: 'center',
    paddingVertical: 5,
    borderRadius: 50,
  },
  labelContainer: {
    flex: 1,
    flexDirection: 'row',
    paddingLeft: 15,
    paddingVertical: 10,
    alignItems: 'center',
  },
  genreText: {
    fontSize: 10,
    marginTop: 5,
    textTransform: 'uppercase',
    color: Colors.black,
    fontWeight: 'bold',
  },
  genrePicSelected: {
    width: 70,
    height: 70,
    borderRadius: 50,
    borderWidth: 3,
    borderColor: Colors.teal,
  },
});
