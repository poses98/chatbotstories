import React, { useState, useEffect, useRef, useLayoutEffect } from 'react';
import { moderateScale } from 'react-native-size-matters';
import {
  StyleSheet,
  View,
  TouchableOpacity,
  FlatList,
  KeyboardAvoidingView,
  DEVICE_WIDTH,
  Alert,
} from 'react-native';
import Colors from '../constants/Colors';
import Ionicons from '@expo/vector-icons/Ionicons';

import { ScrollView, TextInput } from 'react-native-gesture-handler';
import { MessageBubble } from '../components/MessageBubble';
import { AuthorButtonSelector } from '../components/AuthorButtonSelector';
import Swipeable from 'react-native-swipeable';

export default ({ navigation, route }) => {
  const [messages, setMessages] = useState([]);
  const [characterList, setCharacterList] = useState([]);
  const [senderId, setSenderId] = useState('');
  const [messageEdit, setMessageEdit] = useState('');
  const [messageEditId, setMessageEditId] = useState('');
  const [messageEditIndex, setMessageEditIndex] = useState(0);
  const [messageEditMode, setMessageEditMode] = useState(false);
  const [canBeMain, setCanBeMain] = useState(false);

  const scrollViewRef = useRef();

  /**Getting the characters from the db */
  useEffect(() => {}, []);
  /**Getting the messages from the db */
  useEffect(() => {}, []);

  const getCanBeMain = () => {
    let check = true;
    characterList.forEach((element) => {
      if (element.main) {
        check = false;
      }
    });
    return check;
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

  const updateCharacterList = ({ id, name, color, main }) => {};

  const addCharacterToList = ({ name, color, main }) => {};

  const updateMessage = ({ id, messageBody, sender, index }) => {};

  const addMessageToList = ({ messageBody, sender }) => {
    const index =
      messages.length >= 1 ? messages[messages.length - 1].index + 1 : 0;
    console.log(messageBody);
  };

  const removeMessage = ({ id }) => {};

  return (
    <View style={{ flex: 1, backgroundColor: '#fafafa' }}>
      {/**MESSAGE SCROLLVIEW */}
      <KeyboardAvoidingView style={{ marginBottom: 100 }}>
        <ScrollView
          ref={scrollViewRef}
          onContentSizeChange={() =>
            scrollViewRef.current.scrollToEnd({ animated: true })
          }
        >
          <FlatList
            data={messages}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item: { messageBody, sender, id, index } }) => {
              return (
                <Swipeable
                  rightButtons={[
                    <TouchableOpacity
                      style={{
                        backgroundColor: Colors.orange,
                        justifyContent: 'center',
                        width: 45,
                        height: 45,
                        borderRadius: 15,
                        marginHorizontal: 0,
                      }}
                      onPress={() => {
                        navigation.navigate('MessageEdit', {
                          messageBody: messageBody,
                          sender: sender,
                          id: id,
                          index: index,
                          saveChanges: updateMessage,
                          characterList: characterList,
                        });
                      }}
                    >
                      <Ionicons
                        name="pencil-outline"
                        size={26}
                        style={{ alignSelf: 'center', color: 'white' }}
                      />
                    </TouchableOpacity>,
                    <TouchableOpacity
                      style={{
                        backgroundColor: Colors.red,
                        justifyContent: 'center',
                        width: 45,
                        height: 45,
                        borderRadius: 15,
                      }}
                      onPress={() => {
                        changesWillNotBeSavedAlert({ id });
                      }}
                    >
                      <Ionicons
                        name="trash-bin-outline"
                        size={26}
                        style={{ alignSelf: 'center', color: 'white' }}
                      />
                    </TouchableOpacity>,
                  ]}
                >
                  <MessageBubble
                    messageBody={messageBody}
                    sender={sender}
                    characterList={characterList}
                  />
                </Swipeable>
              );
            }}
          />
        </ScrollView>
      </KeyboardAvoidingView>
      <KeyboardAvoidingView style={styles.typeBar}>
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
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item: { name, color, id, main } }) => {
              return (
                <AuthorButtonSelector
                  name={name}
                  color={color}
                  _id={id}
                  onPress={() => {
                    setSenderId(id);
                  }}
                  onLongPress={() =>
                    navigation.navigate('CharacterCreation', {
                      saveChanges: updateCharacterList,
                      characterName: name,
                      characterColor: color,
                      characterId: id,
                      isMain: main,
                      canBeMain: getCanBeMain(),
                    })
                  }
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
    marginBottom: 0,
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
