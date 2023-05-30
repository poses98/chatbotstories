import React, { useEffect, useState } from 'react';
import { StyleSheet, ScrollView, TouchableHighlight, Text } from 'react-native';
import Colors from '../constants/Colors';
import _STATUS_ from '../constants/StoryStatus';
import LabeledInput from '../components/LabeledInput';
import Button from '../components/Button';
import { StatusSelector } from '../components/StatusSelector';
import { CommonActions } from '@react-navigation/native';
import ChapterApi from '../api/chapter';
import useAuth from '../hooks/useAuth';

export default ({ route, navigation }) => {
  const [Owned, setOwned] = useState(false);
  const [data, setData] = useState(null);
  const [isEditMode, setEditMode] = useState(
    route.params.chapterId ? true : false
  );
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
  const { chapterId } = route.params;

  const updateStatus = (value) => {
    setstatus(value);
  };
  const { authUser } = useAuth();

  useEffect(() => {
    if (chapterId)
      ChapterApi.getChapterById(chapterId)
        .then((response) => {
          setData(response);
          setdescriptionField({ text: response.description });
          setnameField({ text: response.title });
          setstatus(response.status);
        })
        .catch((err) => {
          console.error(err);
        });
  }, []);

  const createChapter = (data) => {
    ChapterApi.createChapter(data)
      .then((response) => {
        navigation.navigate('ChapterList', {
          storyId: storyId,
          newItem: true,
        });
      })
      .catch((err) => {
        console.error(err);
      });
  };

  const updateChapter = (data) => {
    ChapterApi.updateChapter(chapterId, data)
      .then((response) => {
        navigation.navigate('Chat', {
          storyId: storyId,
          updated: true,
        });
      })
      .catch((err) => {
        console.error(err);
      });
  };

  const handleChapterDelete = () => {
    ChapterApi.deleteChapter(chapterId)
      .then((response) => {
        navigation.navigate('ChapterList', {
          storyId: storyId,
          shouldRefresh: true,
        });
      })
      .catch((err) => {
        /**TODO handle error */
        console.log('oops');
        console.error(err);
      });
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
            validation = false;
            nameField.errorMessage = 'Title must have at least 3 characters';
            setnameField({ ...nameField });
          }

          if (validation) {
            if (!isEditMode) {
              createChapter({
                story: storyId,
                title: nameField.text,
                description: descriptionField.text.replace(
                  /(\r\n|\n|\r)/gm,
                  ''
                ),
                lastUpdate: Date.now(),
                author: authUser._id,
                status: status,
              });
            } else if (isEditMode) {
              updateChapter({
                title: nameField.text,
                description: descriptionField.text.replace(
                  /(\r\n|\n|\r)/gm,
                  ''
                ),
                lastUpdate: Date.now(),
                status: status,
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

      {/** Delete chapter */}
      {isEditMode && (
        <TouchableHighlight onPress={handleChapterDelete}>
          <Text style={{ color: Colors.red }}>Delete chapter</Text>
        </TouchableHighlight>
      )}
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
