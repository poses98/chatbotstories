import React, { useState } from 'react';
import {
  View,
  TextInput,
  TouchableOpacity,
  Keyboard,
  StyleSheet,
} from 'react-native';
import { moderateScale } from 'react-native-size-matters';
import { Ionicons } from '@expo/vector-icons';

const TextInputBar = ({
  messageEdit,
  setMessageEdit,
  addMessageToList,
  senderId,
  messageEditId,
  updateMessage,
  messageEditIndex,
  setMessageEditId,
  setMessageEditIndex,
  setMessageEditMode,
}) => {
  const handleSendButtonPress = () => {
    console.log('sending');
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
  };

  return (
    <View style={{ flexDirection: 'row', flex: 1 }}>
      <TextInput
        style={styles.messageInput}
        value={messageEdit}
        onChangeText={setMessageEdit}
        placeholder={'Message'}
        multiline={true}
      />
      <TouchableOpacity
        style={styles.sendButton}
        onPress={handleSendButtonPress}
      >
        <Ionicons
          name={messageEditId === '' ? 'send-outline' : 'save-outline'}
          size={moderateScale(25, 1)}
        />
      </TouchableOpacity>
    </View>
  );
};

export default TextInputBar;

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
    flexDirection: 'column',
    justifyContent: 'space-around',
    paddingHorizontal: 10,
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
