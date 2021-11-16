import React, { useState, useCallback, useEffect, useRef } from "react";
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

const AuthorButtonSelector = ({
  _id,
  onPress,
  onLongPress,
  name,
  color,
  selectedId,
}) => {
  let selected = selectedId === _id;
  return (
    <TouchableOpacity
      style={{
        borderWidth: 1,
        borderRadius: 15,
        paddingVertical: 5,
        paddingHorizontal: 8,
        borderColor: color ? color : Colors.blue,
        marginVertical: 5,
        marginHorizontal: 5,
        backgroundColor: selected ? color : "#fafafa",
      }}
      onPress={onPress}
      onLongPress={onLongPress}
    >
      <Text style={{ color: selected ? "#fafafa" : color }}>{name}</Text>
    </TouchableOpacity>
  );
};

export default ({ navigation, route }) => {
  const [messages, setMessages] = useState([]);
  const [characterList, setCharacterList] = useState([]);
  const [senderId, setSenderId] = useState("");
  const [messageEdit, setMessageEdit] = useState("");
  const [canBeMain, setCanBeMain] = useState(false);
  /**Firestore references */
  const characterListRef = firestore()
    .collection("stories")
    .doc(route.params.storyId)
    .collection("characters");
  const messageListRef = firestore()
    .collection("stories")
    .doc(route.params.storyId)
    .collection("chapters")
    .doc(route.params.chapterId)
    .collection("messages");
  const scrollViewRef = useRef();

  /**Getting the characters from the db */
  useEffect(() => {
    onSnapshot(
      characterListRef,
      (newLists) => {
        setCharacterList(newLists);
        if (newLists.length > 0) {
          setSenderId(newLists[0].id);
          newLists.forEach((element) => {
            if (element.main) {
              console.log("Characters can't be main, already an existing one")
              setCanBeMain(false);
            }
          });
          console.log("Characters can be main?:" + canBeMain)

        }else{
          setCanBeMain(true)
        }
      },
      {
        sort: (a, b) => {
          if (a.index < b.index) {
            return -1;
          }

          if (a.index > b.index) {
            return 1;
          }

          return 0;
        },
      }
    );
  }, []);

  /**Getting the messages from the db */
  useEffect(() => {
    onSnapshot(
      messageListRef,
      (newLists) => {
        setMessages(newLists);
      },
      {
        sort: (a, b) => {
          if (a.index < b.index) {
            return -1;
          }

          if (a.index > b.index) {
            return 1;
          }

          return 0;
        },
      }
    );
  }, []);

  const getCanBeMain = () =>{
    let check = true;
    characterList.forEach((element) => {
      if (element.main) {
        check = false;
      }
    });
    return check;
  }

  const updateCharacterList = ({ id, name, color, main }) => {
    updateDoc(characterListRef, id, { name, color, main });
  };

  const addCharacterToList = ({ name, color, main }) => {
    addDoc(characterListRef, { name, color, main });
  };

  const addMessageToList = ({ messageBody, sender }) => {
    const index =
      messages.length >= 1 ? messages[messages.length - 1].index + 1 : 0;
    console.log(messageBody);
    addDoc(messageListRef, { messageBody, sender, index });
  };

  return (
    <View style={{ flex: 1, backgroundColor: "#fafafa" }}>
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
            renderItem={({ item: { messageBody, sender } }) => {
              return (
                <MessageBubble
                  messageBody={messageBody}
                  sender={sender}
                  characterList={characterList}
                />
              );
            }}
          />
        </ScrollView>
      </KeyboardAvoidingView>
      <KeyboardAvoidingView
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          flexDirection: "column",
          flex: 0.2,
          justifyContent: "space-around",
          marginHorizontal: 10,
          marginBottom: 0,
          backgroundColor: "#fafafa",
          maxHeight: 100,
        }}
      >
        {/**AUTHOR SELECTOR */}
        <View style={{ flexDirection: "row", flex: 1, alignItems: "center" }}>
          <FlatList
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
                    setSenderId(id)
                  }}
                  onLongPress={() => {
                    navigation.navigate("CharacterCreation", {
                      saveChanges: updateCharacterList,
                      characterName: name,
                      characterColor: color,
                      characterId: id,
                      isMain: main,
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
              navigation.navigate("CharacterCreation", {
                saveChanges: addCharacterToList,
                canBeMain: getCanBeMain(),
                isMain: false
              });
            }}
          >
            <Ionicons name="add-circle-outline" size={24} />
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
            value={messageEdit}
            onChangeText={(text) => {
              setMessageEdit(text);
            }}
            placeholder={"Message"}
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
              if (messageEdit.length > 0) {
                addMessageToList({
                  messageBody: messageEdit,
                  sender: senderId,
                });
                setMessageEdit("");
              }
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
