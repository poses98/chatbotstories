import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, View, FlatList, DEVICE_WIDTH, Text } from 'react-native';
import {
  ScrollView,
  TouchableHighlight,
  TouchableOpacity,
} from 'react-native-gesture-handler';
import { MessageBubble } from '../components/MessageBubble';
import Button from '../components/Button';
import Colors from '../constants/Colors';
import StoryStatus from '../constants/StoryStatus';
import ChapterApi from '../api/chapter';
import StoryApi from '../api/story';
import ReadStatusApi from '../api/readstatus';
import * as Haptics from 'expo-haptics';

export default ({ navigation, route }) => {
  const [messages, setMessages] = useState(null);
  const [characterList, setCharacterList] = useState(null);
  const [readingMessages, setReadingMessages] = useState([]);
  const [readingIndex, setReadingIndex] = useState(0);
  const [finished, setFinished] = useState(false);
  const [nextChapterId, setNextChapterId] = useState('');
  const [isEnded, setIsEnded] = useState(true);

  const nextChapter = () => {
    const { chapterList, chapterIndex, readStatus } = route.params;
    console.log(chapterIndex);
    let isFinished = true;
    const nextIndex = chapterIndex + 1;
    console.log(`Finding nextIndex:${chapterIndex + 1}`);
    const nextChapter = chapterList[nextIndex];
    console.log(`NextChapter: ${nextChapter ? nextChapter.title : NaN}`);
    console.log(readStatus.finished);
    if (nextChapter) {
      console.log('setting next chapter');
      setIsEnded(false);
      isFinished = false;
      setNextChapterId(nextChapter._id);
      // Make the API call to update the read status
      if (!readStatus.finished) {
        updateReadStatus(nextChapter._id);
      }
    }
    if ((isFinished || readStatus.finished) && !nextChapter) {
      setIsEnded(true);
      setNextChapterId(null);
      updateReadStatus(chapterList[0], isFinished);
    }
  };

  const updateReadStatus = (chapterId, finished) => {
    const { readStatus, setReadStatus } = route.params;
    if (!readStatus.finished) {
      const updatedReadStatus = {
        ...readStatus,
        previousChapter: route.params.chapterId,
        nextChapter: route.params.chapterId,
        finished: finished,
      };
      ReadStatusApi.updateReadStatusById(readStatus._id, updatedReadStatus)
        .then((response) => {
          console.log(response);
          // Update the readStatus object in the parent component's state
          setReadStatus(updatedReadStatus);
        })
        .catch((error) => {
          console.error(error);
          // Handle error
        });
    }
  };

  const scrollViewRef = useRef();

  /**Getting the characters from the db */
  useEffect(() => {
    if (route.params && route.params.storyId && !characterList) {
      StoryApi.getStoryById(route.params.storyId)
        .then((response) => {
          setCharacterList(response.characters);
        })
        .catch((err) => {
          /**TODO handle error */
          console.error(err);
        });
    }
  });
  /**Getting the messages from the db */
  useEffect(() => {
    if (route.params && route.params.chapterId && !messages) {
      ChapterApi.getChapterById(route.params.chapterId).then((response) => {
        setMessages(response.messages);
      });
    }
  });

  const updateReadingMessages = () => {
    if (!finished) {
      if (messages && messages.length > readingIndex) {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        let temp_readMessages = [...readingMessages];
        temp_readMessages.push(messages[readingIndex]);
        setReadingMessages(temp_readMessages);
        setReadingIndex(readingIndex + 1);
      } else if (messages && messages.length === readingMessages.length) {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
        setFinished(true);
        nextChapter();
      }
    }
  };
  return (
    <View
      style={{ flex: 1, backgroundColor: '#fafafa' }}
      onStartShouldSetResponder={() => updateReadingMessages()}
    >
      {/**MESSAGE SCROLLVIEW */}
      <ScrollView
        ref={scrollViewRef}
        onContentSizeChange={() =>
          scrollViewRef.current.scrollToEnd({ animated: true })
        }
      >
        {readingMessages.map(({ _id, body, sender }) => (
          <MessageBubble
            key={_id.toString()}
            messageBody={body}
            sender={sender}
            characterList={characterList}
          />
        ))}
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
                alignSelf: 'center',
                color: Colors.gray,
                textTransform: 'uppercase',
              }}
            >
              {isEnded && !nextChapterId
                ? '- End of the story -'
                : '- End of the chapter -'}
            </Text>
            {!isEnded && nextChapter && (
              <Button
                text="Next chapter"
                buttonStyle={{
                  maxHeight: 100,
                  minHeight: 50,
                  marginTop: 15,
                }}
                onPress={() => {
                  navigation.replace('ChatRead', {
                    storyName: route.params.storyName,
                    chapterIndex: route.params.chapterIndex + 1,
                    storyId: route.params.storyId,
                    chapterId: nextChapterId,
                    chapterList: route.params.chapterList,
                    readStatus: route.params.readStatus,
                    setReadStatus: route.params.setReadStatus,
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
