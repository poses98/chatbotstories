import React, { useState, useEffect, useRef, useLayoutEffect } from 'react';
import { moderateScale } from 'react-native-size-matters';
import {
  StyleSheet,
  Text,
  Button,
  View,
  TouchableOpacity,
  FlatList,
  KeyboardAvoidingView,
  Alert,
  Keyboard,
} from 'react-native';
import Colors from '../constants/Colors';
import Ionicons from '@expo/vector-icons/Ionicons';
import CustomModal from '../components/CustomModal';
import { ScrollView, TextInput } from 'react-native-gesture-handler';
import { MessageBubble } from '../components/MessageBubble';
import { AuthorButtonSelector } from '../components/ChatScreen/AuthorButtonSelector';
import CharacterApi from '../api/character';
import MessageApi from '../api/message';
import StoryApi from '../api/story';
import SwipeableComponent from '../components/misc/SwipeableComponent';
import ChapterApi from '../api/chapter';
import * as Haptics from 'expo-haptics';
import ChoicesEditor from '../components/ChoicesEditor';
import LoadingScreen from './LoadingScreen';

export default ({ navigation, route }) => {
  const [choices, setChoices] = useState([]);
  const [messages, setMessages] = useState([]);
  const [chapters, setChapters] = useState(null);
  const [refreshChat, setRefreshChat] = useState(false);
  const [characterList, setCharacterList] = useState(null);
  const [senderId, setSenderId] = useState('');
  const [messageEdit, setMessageEdit] = useState('');
  const [messageEditId, setMessageEditId] = useState('');
  const [messageEditIndex, setMessageEditIndex] = useState(0);
  const [messageEditMode, setMessageEditMode] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [loading, setLoading] = useState(true);
  const { storyId, chapterId } = route.params;
  const scrollViewRef = useRef();
  const textInputRef = useRef(null);

  /**Getting the characters from the db */
  useEffect(() => {
    StoryApi.getStoryAndChaptersById(storyId)
      .then((response) => {
        const characterListTmp = response.characters;
        setChapters(response.chapters);
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
      if (response.choices) {
        setChoices(response.choices);
        console.log(response.choices);
      }
      setRefreshChat(false);
    });
  }, [refreshChat]);

  useEffect(() => {
    if (choices && characterList && chapters && messages) {
      setLoading(false);
    }
  }, [choices, chapters, characterList, messages]);

  /** Rendering the top bar icons */
  const renderStackBarIconRight = () => {
    return (
      !loading && (
        <View style={{ flexDirection: 'row' }}>
          <TouchableOpacity
            onPress={() => {
              handleOpenModal();
            }}
            style={{ paddingRight: 8 }}
          >
            <Ionicons
              name="git-network-outline"
              size={26}
              color={choices.length === 2 ? Colors.green : Colors.red}
            />
          </TouchableOpacity>
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
      )
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

  const handleOpenModal = () => {
    setModalVisible(true);
  };

  const handleCloseModal = () => {
    setModalVisible(false);
  };

  const handleKeyboardShow = () => {
    // Keyboard is shown
  };

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

  const addMessageToList = ({ messageBody, sender }) => {
    const index =
      messages.length >= 1 ? messages[messages.length - 1].index + 1 : 0;
    const message = { body: messageBody, sender, index };
    MessageApi.createMessageForChapter(chapterId, message).then((response) => {
      setRefreshChat(true);
    });
  };

  const updateChoices = (choices) => {
    if (choices.length === 2) {
      setChoices(choices);
      ChapterApi.updateChapter(chapterId, { choices }).then((response) => {
        console.log(response);
        handleCloseModal();
      });
    }
  };

  const removeMessage = (id) => {
    MessageApi.deleteMessage(chapterId, id).then((response) => {
      console.log(response);
      setMessages(response.messages);
    });
  };

  return !loading ? (
    <View style={{ flex: 1 }}>
      <CustomModal visible={modalVisible} onClose={handleCloseModal}>
        {chapters && (
          <ChoicesEditor
            chapters={chapters}
            onUpdate={updateChoices}
            choices={choices}
          />
        )}
      </CustomModal>
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
                leftSwipeComponent={
                  <View
                    style={{
                      backgroundColor: Colors.orange,
                      flex: 1,
                      width: '100%',
                      justifyContent: 'center',
                      alignItems: 'center',
                      position: 'relative',
                      height: '100%',
                    }}
                  >
                    <Ionicons name="create-outline" size={24} />
                  </View>
                }
                onLeftSwipe={() => {
                  removeMessage(_id);
                }}
                rightSwipeComponent={
                  <Ionicons name="trash-outline" size={24} />
                }
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
  ) : (
    <LoadingScreen />
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
