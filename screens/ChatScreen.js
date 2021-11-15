import React, { useState, useCallback, useEffect } from "react";
import { GiftedChat } from "react-native-gifted-chat";
import { moderateScale } from "react-native-size-matters";
import Svg, { Path } from "react-native-svg";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  FlatList,
  KeyboardAvoidingView,
  DEVICE_WIDTH,
} from "react-native";
import Colors from "../constants/Colors";
import Ionicons from "@expo/vector-icons/Ionicons";
import {
  onSnapshot,
  addDoc,
  removeDoc,
  updateDoc,
} from "../services/collections";
import { firestore, auth } from "firebase";
import { ScrollView, TextInput } from "react-native-gesture-handler";
import { SafeAreaView } from "react-native-safe-area-context";
import { MessageBubble } from "../components/MessageBubble";
import Button from "../components/Button";
import { NavigationContainer } from "@react-navigation/native";

/**
  * <GiftedChat
      messages={messages}
      onSend={(messages) => onSend(messages)}
      user={{
        _id: 1,
      }}
    />
  * @returns 
  */

const AuthorButtonSelector = ({ _id, onPress, color, selectedId, name }) => {
  return (
    <TouchableOpacity
      style={{
        borderWidth: 1,
        borderRadius: 15,
        padding: 5,
        borderColor: color ? color : Colors.blue,
        marginVertical: 5,
        marginHorizontal:5
      }}
      onPress={onPress}
    >
      <Text style={{color: color ? color : Colors.blue}}>{name}</Text>
    </TouchableOpacity>
  );
};

export default ({navigation, route}) => {
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    setMessages([
      {
        _index: 1,
        text: "Hello developer",
        user: {
          _id: 2,
          name: "React Native",
        },
      },
    ]);
  }, []);

  const PopulateMessages = ({ messageBody, sender, color }) => {};

  const onSend = useCallback((messages = []) => {
    setMessages((previousMessages) =>
      GiftedChat.append(previousMessages, messages)
    );
  }, []);

  return (
    <View style={{ flex: 1,backgroundColor:"#fafafa" }}>
        {/**MESSAGE SCROLLVIEW */}
      <ScrollView>
        <MessageBubble messageBody="Lorem ipsum" />
      </ScrollView>
      <KeyboardAvoidingView
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          flexDirection: "column",
          flex: 1,
          justifyContent: "space-around",
          marginHorizontal: 10,
          marginBottom: 5,
          backgroundColor:"#fafafa"
        }}
      >
          {/**AUTHOR SELECTOR */}
        <View style={{ flexDirection: "row", flex: 1,alignItems:"center" }}>
            <AuthorButtonSelector
                name="Main character"
                color={Colors.green}
            />
            <TouchableOpacity onPress={() => {
                navigation.navigate("CharacterCreation")
            }}>
                <Ionicons name="add-circle-outline" size={24}/>
            </TouchableOpacity>
        </View>
        {/**TEXT INPUT */}
        <View style={{ flexDirection: "row", flex: 1 }}>
          <TextInput
            style={{
              backgroundColor: "#c4c4c4dd",
              flex: 1,
              padding: 8,
              borderRadius: 20,
            }}
          />
          <TouchableOpacity
            style={{
              alignItems: "center",
              justifyContent: "center",
              padding: 0,
              borderWidth: 0,
              borderRadius: 50,
              padding: 8,
              marginLeft: 5,
            }}
            onPress={() => {
              //TODO add message to list + send to firebase
            }}
          >
            <Ionicons name="send-outline" size={moderateScale(25, 1)} />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
};

const styles = StyleSheet.create({
  text: {
    color: "white",
    fontWeight: "bold",
    backgroundColor: "transparent",
    paddingLeft: 25,
  },
  input: {
    backgroundColor: "rgba(255, 255, 255, 0.4)",
    width: DEVICE_WIDTH,
    height: 40,
    color: "#ffffff",
  },
  image: {
    width: 40,
    height: 40,
  },
});
