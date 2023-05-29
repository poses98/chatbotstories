import React, { useLayoutEffect, useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  TouchableOpacity,
  FlatList,
  Switch,
} from 'react-native';
import { StackActions } from '@react-navigation/native';
import { CommonActions } from '@react-navigation/native';
import Colors from '../constants/Colors';
import GENRES from '../constants/Genres';
import LANGUAGES from '../constants/Languages';
import _STATUS_ from '../constants/StoryStatus';
import Ionicons from '@expo/vector-icons/Ionicons';
import LabeledInput from '../components/LabeledInput';
import { Picker } from '@react-native-picker/picker';
import Button from '../components/Button';
import { Label } from '../components/Label';
import { StatusSelector } from '../components/StatusSelector';
import StoryApi from '../api/story';
import useAuth from '../hooks/useAuth';

export default ({ route, navigation }) => {
  /** STORY ID IN CASE IS UPDATE MODE */
  const [storyId, setStoryId] = useState(
    route.params ? route.params.storyId : ''
  );
  const [isEditMode, setEditMode] = useState(false);

  //navigation.setOptions({ title: storyId ? 'Edit story' : 'Create story' });

  /** STATE ATRIBUTTES */
  const [owned, setowned] = useState(false); // owner of the story
  const [data, setdata] = useState({}); // metadata of the story
  const [loading, setloading] = useState(true); // is loading or not
  const [notloaded, setnotloaded] = useState(false); // couldnt load the data
  const [nameField, setnameField] = useState({
    // story name field
    errorMessage: '',
    text: '',
  });
  const [categoryMain, setcategoryMain] = useState(0); // category of the story
  const [oldCategory, setOldCategory] = useState(0); // category of the story

  const [descriptionField, setdescriptionField] = useState({
    // description of the story
    errorMessage: '',
    text: '',
  });
  const [interactive, setInteractive] = useState(false); // interactivity of the story
  const [oldInteractive, setOldInteractive] = useState(false); //check variable for old interactivity
  const [status, setStatus] = useState(0); // status of the story
  const [language, setLanguage] = useState(0); // language of the story
  const [memberNumber, setMemberNumber] = useState(2); //number of the members of the story
  const { authUser } = useAuth();

  const updateStatus = (value) => {
    setStatus(value);
  };
  /** Getting the metadata of the story */
  useEffect(() => {
    if (storyId != '') {
      setEditMode(true);
      console.log('Getting metada as storyId is not empty');
      StoryApi.getStoryById(storyId)
        .then((response) => {
          console.log(response);
          setLanguage(response.language);
          setStatus(response.status);
          setInteractive(response.interactive);
          setdescriptionField({ text: response.description, errorMessage: '' });
          setcategoryMain(response.genre);
          setnameField({ text: response.title, errorMessage: '' });
          setloading(false);
          setowned(response.author === authUser._id);
        })
        .catch((err) => {
          /**TODO handle error */
        });
    } else {
      setloading(false);
    }
  }, [storyId]);
  /**Creates a new story from the data written by the user in the form
   *
   * @param {form data}} data
   */
  const createStory = (data) => {
    StoryApi.createStory(data)
      .then(() => {
        navigation.dispatch(CommonActions.goBack());
      })
      .catch((err) => {
        console.log(err);
        /**TODO Handle error */
      });
  };

  const updateStory = (data) => {
    console.log(data);
    StoryApi.updateStory(storyId, data).then((response) => {
      console.log(response);
      navigation.dispatch(CommonActions.goBack);
    });
  };
  /** GENRE BUBBLE TEMPLATE */
  const GenreBubble = ({ image, verboseName, genreKey }) => {
    return (
      <View style={{ flex: 1, flexDirection: 'row', marginHorizontal: 10 }}>
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
            inputStyle={{ color: Colors.black }}
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
            inputStyle={{
              padding: 7.9,
              textAlignVertical: 'top',
              color: Colors.black,
            }}
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
          {/** INTERACTIVE BUTTON SELECTOR */}
          <View style={{ flex: 1, marginTop: 15 }}>
            <Label text="Is it interactive?" icon="git-network-outline" />
            <View
              style={{
                flex: 1,
                flexDirection: 'row',
                justifyContent: 'space-between',
              }}
            >
              <Button
                text="Yes"
                onPress={() => {
                  setInteractive(true);
                }}
                buttonStyle={{
                  flex: 0.5,
                  marginTop: 15,
                  marginHorizontal: 15,
                  height: 45,
                  backgroundColor: interactive ? Colors.green : 'transparent',
                  borderColor: interactive ? '#fafafa' : Colors.gray,
                }}
                textStyle={{
                  color: interactive ? '#fafafa' : Colors.gray,
                  fontWeight: 'bold',
                }}
              />
              <Button
                text="No"
                onPress={() => {
                  setInteractive(false);
                }}
                buttonStyle={{
                  flex: 0.5,
                  marginTop: 15,
                  marginHorizontal: 15,
                  height: 45,
                  backgroundColor: !interactive ? Colors.red : 'transparent',
                  borderColor: !interactive ? '#fafafa' : Colors.gray,
                }}
                textStyle={{
                  color: !interactive ? '#fafafa' : Colors.gray,
                  fontWeight: 'bold',
                }}
              />
            </View>
          </View>
          {/** (EDITMODE ONLY) BUTTON SELECTOR FOR STATUS  */}
          {isEditMode && (
            <StatusSelector
              status={status}
              updateStatus={updateStatus}
              text="Story status"
            />
          )}
          {/** PICKER FOR LANGUAGE */}
          <View style={{ flexDirection: 'column', marginTop: 15 }}>
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
              onValueChange={(itemValue, itemIndex) => setLanguage(itemValue)}
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
            text={isEditMode ? 'Save' : 'Create'}
            textStyle={{ fontWeight: 'bold' }}
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
                    ''
                  ),
                  genre: categoryMain,
                  date: Date.now(),
                  author: authUser._id,
                  interactive: interactive,
                  status: status,
                  language: language,
                };
                if (!isEditMode) {
                  //create story
                  createStory(data);
                  console.log('Creating new story! : ' + data);
                } else if (isEditMode) {
                  //update story
                  console.log('Updating an existing story! : ');
                  console.log(data);
                  updateStory(data);
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
      {loading && (
        <View
          style={{
            flex: 1,
            backgroundColor: '#fff',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <Image
            source={require('../assets/loading.gif')}
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
