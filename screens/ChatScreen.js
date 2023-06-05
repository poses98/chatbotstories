import React, { useState, useEffect, useRef, useLayoutEffect } from 'react';
import { moderateScale } from 'react-native-size-matters';
import {
  StyleSheet,
  View,
  TouchableOpacity,
  FlatList,
  KeyboardAvoidingView,
  Alert,
  Keyboard,
} from 'react-native';
import Colors from '../constants/Colors';
import Ionicons from '@expo/vector-icons/Ionicons';

import { ScrollView, TextInput } from 'react-native-gesture-handler';
import { MessageBubble } from '../components/MessageBubble';
import { AuthorButtonSelector } from '../components/ChatScreen/AuthorButtonSelector';
import CharacterApi from '../api/character';
import MessageApi from '../api/message';
import StoryApi from '../api/story';
import SwipeableComponent from '../components/misc/SwipeableComponent';
import ChapterApi from '../api/chapter';
import * as Haptics from 'expo-haptics';

export default ({ navigation, route }) => {
  const [messages, setMessages] = useState([]);
  const [refreshChat, setRefreshChat] = useState(false);
  const [characterList, setCharacterList] = useState(null);
  const [senderId, setSenderId] = useState('');
  const [messageEdit, setMessageEdit] = useState('');
  const [messageEditId, setMessageEditId] = useState('');
  const [messageEditIndex, setMessageEditIndex] = useState(0);
  const [messageEditMode, setMessageEditMode] = useState(false);
  const { storyId, chapterId } = route.params;
  const scrollViewRef = useRef();
  const textInputRef = useRef(null);

  /** Rendering the top bar icons */
  const renderStackBarIconRight = () => {
    return (
      <View style={{ flexDirection: 'row' }}>
        <TouchableOpacity
          onPress={() => {
            navigation.navigate('ChapterDetails', {
              storyId: storyId,
              chapterId: chapterId,
            });
          }}
          style={{ paddingRight: 8 }}
        >
          <Ionicons name="settings-outline" size={26} color={Colors.black} />
        </TouchableOpacity>
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

  const handleKeyboardShow = () => {
    // Keyboard is shown
  };

  /**Getting the characters from the db */
  useEffect(() => {
    StoryApi.getStoryById(storyId)
      .then((response) => {
        const characterListTmp = response.characters;
        setCharacterList(characterListTmp);
        setRefreshChat(false);
      })
      .catch((err) => {
        console.error(err);
      });
  }, [refreshChat]);

  /**Getting the messages from the db */
  useEffect(() => {
    ChapterApi.getChapterById(chapterId).then((response) => {
      setMessages(response.messages);
      setRefreshChat(false);
    });
  }, [refreshChat]);

  const getCanBeMain = () => {
    characterList.forEach((element) => {
      if (element.isMain) {
        return false;
      }
    });
    return true;
  };

  /**
   * Function that shows an alert box
   */
  const changesWillNotBeSavedAlert = (id) =>
    Alert.alert(
      'This action cannot be undone',
      'Are you sure?',
      [
        {
          text: 'Cancel',
          onPress: () => console.log('Cancel Pressed'),
          style: 'cancel',
        },
        {
          text: 'Delete',
          onPress: () => removeMessage(id),
        },
      ],
      { cancelable: true }
    );

  const updateCharacterList = ({ id, name, color, main }) => {
    const character = { _id: id, name: name, color: color, isMain: main };
    CharacterApi.updateCharacterForStory(storyId, character._id, character)
      .then((response) => {
        setRefreshChat(!refreshChat);
        console.log(response);
      })
      .catch((err) => {
        console.error(err);
      });
  };

  const addCharacterToList = ({ name, color, main }) => {
    const character = { name: name, color: color, isMain: main };
    console.log(`Creating character: ${character}`);
    CharacterApi.createCharacterForStory(storyId, character)
      .then((response) => {
        setRefreshChat(!refreshChat);
        console.log(response);
      })
      .catch((err) => {
        console.error(err);
      });
  };

  const updateMessage = ({ id, messageBody, sender }) => {
    const message = { id, body: messageBody, sender };
    MessageApi.updateMessage(chapterId, id, message)
      .then((response) => {
        let messages_copy = messages;
        setMessages(null);
        messages_copy.forEach((e) => {
          if (e._id === id) {
            e.body = messageBody;
            e.sender = sender;
          }
        });
        setMessages(messages_copy);
      })
      .catch((err) => {
        console.error(err);
      });
  };

  useEffect(() => {
    if (messages) console.log(messages);
  }, [messages]);

  const addMessageToList = ({ messageBody, sender }) => {
    const index =
      messages.length >= 1 ? messages[messages.length - 1].index + 1 : 0;
    const message = { body: messageBody, sender, index };
    MessageApi.createMessageForChapter(chapterId, message).then((response) => {
      setRefreshChat(true);
    });
  };

  const removeMessage = ({ id }) => {};

  return (
    <View style={{ flex: 1, backgroundColor: '#fafafa' }}>
      {/**MESSAGE SCROLLVIEW */}
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={{ marginBottom: 100 }}
        keyboardVerticalOffset={180}
      >
        <ScrollView
          ref={scrollViewRef}
          contentContainerStyle={{ flexGrow: 1 }}
          keyboardShouldPersistTaps={'handled'}
          onContentSizeChange={() =>
            scrollViewRef.current.scrollToEnd({ animated: true })
          }
        >
          {messages &&
            messages.map(({ _id, body, sender }) => (
              <SwipeableComponent
                onRightSwipe={() => {
                  setMessageEditId(_id);
                  setMessageEditMode(true);
                  setMessageEdit(body);
                  setSenderId(sender);
                }}
                leftSwipeComponent={<Ionicons name="create" size={24} />}
              >
                <MessageBubble
                  key={_id.toString()}
                  messageBody={body}
                  sender={sender}
                  characterList={characterList}
                />
              </SwipeableComponent>
            ))}
        </ScrollView>
      </KeyboardAvoidingView>
      <KeyboardAvoidingView
        style={styles.typeBar}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={90}
      >
        {/**INPUT BAR & AUTHOR SELECTOR */}
        {/**AUTHOR SELECTOR */}
        <View
          style={{
            flexDirection: 'row',
            flex: 1,
            alignItems: 'center',
            paddingBottom: 7,
          }}
        >
          <FlatList
            keyboardDismissMode="on-drag"
            keyboardShouldPersistTaps={'always'}
            horizontal
            showsHorizontalScrollIndicator={false}
            data={characterList}
            keyExtractor={(item) => item._id.toString()}
            renderItem={({ item: { name, color, _id, main } }) => {
              return (
                <AuthorButtonSelector
                  name={name}
                  color={color}
                  _id={_id}
                  onPress={() => {
                    setSenderId(_id);
                  }}
                  onLongPress={() => {
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                    navigation.navigate('CharacterCreation', {
                      saveChanges: updateCharacterList,
                      characterName: name,
                      characterColor: color,
                      characterId: _id,
                      isMain: main ? true : false,
                      canBeMain: getCanBeMain(),
                    });
                  }}
                  selectedId={senderId}
                />
              );
            }}
          />

          <TouchableOpacity
            onPress={() => {
              navigation.navigate('CharacterCreation', {
                saveChanges: addCharacterToList,
                canBeMain: getCanBeMain(),
                isMain: false,
              });
            }}
          >
            <Ionicons name="add-circle-outline" size={24} />
          </TouchableOpacity>
        </View>
        {/**TEXT INPUT */}
        <View style={{ flexDirection: 'row', flex: 1 }}>
          <TextInput
            style={styles.messageInput}
            value={messageEdit}
            onChangeText={(text) => {
              setMessageEdit(text);
            }}
            placeholder={'Message'}
            multiline={true}
          />
          <TouchableOpacity
            style={styles.sendButton}
            onPress={() => {
              Keyboard.dismiss();
              if (messageEdit.length > 0 && !(senderId === '')) {
                console.log('MessageId:' + messageEditId);
                if (messageEditId === '') {
                  addMessageToList({
                    messageBody: messageEdit,
                    sender: senderId,
                  });
                  setMessageEdit('');
                } else {
                  updateMessage({
                    id: messageEditId,
                    sender: senderId,
                    messageBody: messageEdit,
                    index: messageEditIndex,
                  });
                  setMessageEdit('');
                  setMessageEditId('');
                  setMessageEditIndex(0);
                  setMessageEditMode(false);
                }
                setMessageEdit('');
              }
            }}
          >
            <Ionicons
              name={messageEditId === '' ? 'send-outline' : 'save-outline'}
              size={moderateScale(25, 1)}
            />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
};

const styles = StyleSheet.create({
  text: {
    color: 'white',
    fontWeight: 'bold',
    backgroundColor: 'transparent',
    paddingLeft: 25,
  },
  input: {
    backgroundColor: 'rgba(255, 255, 255, 0.4)',
    height: 40,
    color: '#ffffff',
  },
  image: {
    width: 40,
    height: 40,
  },
  typeBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'column',
    flex: 0.2,
    justifyContent: 'space-around',
    marginHorizontal: 10,
    paddingBottom: 20,
    backgroundColor: '#fafafa',
  },
  sendButton: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 0,
    borderWidth: 0,
    borderRadius: 50,
    padding: 8,
    marginLeft: 5,
  },
  messageInput: {
    backgroundColor: '#c4c4c4dd',
    flex: 1,
    padding: 8,
    borderRadius: 20,
    maxHeight: 100,
  },
});
