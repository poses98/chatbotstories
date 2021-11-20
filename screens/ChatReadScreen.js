import React, { useState, useEffect, useRef } from "react";
import { StyleSheet, View, FlatList, DEVICE_WIDTH, Text } from "react-native";
import { addDoc, onSnapshot, updateDoc } from "../services/collections";
import { firestore, auth } from "firebase";
import {
  ScrollView,
  TouchableHighlight,
  TouchableOpacity,
} from "react-native-gesture-handler";
import { MessageBubble } from "../components/MessageBubble";
import Button from "../components/Button";
import Colors from "../constants/Colors";
import StoryStatus from "../constants/StoryStatus";
import * as Analytics from 'expo-firebase-analytics';


export default ({ navigation, route }) => {
  const [messages, setMessages] = useState([]);
  const [characterList, setCharacterList] = useState([]);
  const [readingMessages, setReadingMessages] = useState([]);
  const [readingIndex, setReadingIndex] = useState(0);
  const [finished, setFinished] = useState(false);
  const [nextChapterId, setNextChapterId] = useState("");
  const [isEnded, setIsEnded] = useState(true)


  const nextChapter = () => {
    let thisChapterIndex = "";
    let isFinished = true;
    route.params.chapterList.forEach((element) => {
      if (route.params.chapterId === element.id) {
        thisChapterIndex = element.index;
      }
      if (element.index === thisChapterIndex + 1) {
        setIsEnded(false)
        isFinished = false
        setNextChapterId(element.id);
        updateReadingStoriesFromUser(isFinished, element.id);
      }
    });
    if (isFinished) {
      setNextChapterId(null);
      updateReadingStoriesFromUser(isFinished, null);
    }
  };
  const readingStoriesRef = firestore()
    .collection("users")
    .doc(auth().currentUser.uid)
    .collection("startedStories")


  const updateReadingStoriesFromUser = (isEnded, p_nextChapterId) => {
    try {
      updateDoc(readingStoriesRef.doc(route.params.storyId), route.params.storyId, {
        lastChapterId: route.params.chapterId,
        nextChapterId: p_nextChapterId,
        date: Date.now(),
        finished: isEnded
      });
    } catch (e) {
      addDoc(readingStoriesRef, {
        id: route.params.storyId, nextChapterId: p_nextChapterId,
        date: Date.now(), finished: isEnded, lastChapterId: route.params.chapterId
      });
    }
  };

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
        if (newLists.length > readingIndex) {
          setReadingMessages([newLists[readingIndex]]);
          console.log(readingMessages);
          setReadingIndex(readingIndex + 1);
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

  const updateReadingMessages = () => {
    if (!finished) {
      Analytics.logEvent('SpawnMessageInReadingChat', {
        sender: 'screen tap',
        user: auth().currentUser.uid,
        screen: 'chatReadScreen',
        purpose: 'Tap the screen to spawn a new message',
      });
      if (messages.length > readingIndex) {
        let temp_readMessages = [...readingMessages];
        temp_readMessages.push(messages[readingIndex]);
        setReadingMessages(temp_readMessages);
        setReadingIndex(readingIndex + 1);
      } else if (messages.length === readingMessages.length) {
        setFinished(true);
        console.log("Se ha terminado el capitulo: " + true);
        nextChapter()
      }
    }
  };
  return (
    <View
      style={{ flex: 1, backgroundColor: "#fafafa" }}
      onStartShouldSetResponder={() => updateReadingMessages()}
    >
      {/**MESSAGE SCROLLVIEW */}
      <ScrollView
        ref={scrollViewRef}
        onContentSizeChange={() =>
          scrollViewRef.current.scrollToEnd({ animated: true })
        }
      >
        <FlatList
          data={readingMessages}
          keyExtractor={(item) => item.id.toString()}
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
        {finished && (
          <View
            style={{
              marginVertical: 20,
              flex: 1,
              borderTopWidth: 1,
              borderColor: Colors.lightGray,
              paddingTop: 15,
              marginHorizontal: 15,
            }}
          >
            <Text
              style={{
                alignSelf: "center",
                color: Colors.gray,
                textTransform: "uppercase",
              }}
            >
              {isEnded ? "- End of the story -" : "- End of the chapter -"}
            </Text>
            {!isEnded && (
              <Button
                text="Next chapter"
                buttonStyle={{
                  maxHeight: 100,
                  minHeight: 50,
                  marginTop: 15,
                }}
                onPress={() => {
                  navigation.replace("ChatRead", {
                    storyName: route.params.storyName,
                    storyId: route.params.storyId,
                    chapterId: nextChapterId,
                    chapterList: route.params.chapterList
                  })
                  Analytics.logEvent('NextChapter', {
                    sender: 'button',
                    user: auth().currentUser.uid,
                    screen: 'chatReadScreen',
                    purpose: 'Tap the next chapter button',
                  });
                }}
              />
            )}
          </View>
        )}
      </ScrollView>
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
  typeBar: {
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
  },
  sendButton: {
    alignItems: "center",
    justifyContent: "center",
    padding: 0,
    borderWidth: 0,
    borderRadius: 50,
    padding: 8,
    marginLeft: 5,
  },
  messageInput: {
    backgroundColor: "#c4c4c4dd",
    flex: 1,
    padding: 8,
    borderRadius: 20,
    maxHeight: 100,
  },
});
