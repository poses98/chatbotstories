import React, { useState, useEffect, useRef } from 'react';
import {
  StyleSheet,
  View,
  Animated,
  FlatList,
  DEVICE_WIDTH,
  Text,
} from 'react-native';
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
import Countdown from '../components/Countdown';

export default ({ navigation, route }) => {
  const [messages, setMessages] = useState(null);
  const [choices, setChoices] = useState(null);
  const [characterList, setCharacterList] = useState(null);
  const [readingMessages, setReadingMessages] = useState([]);
  const [readingIndex, setReadingIndex] = useState(0);
  const [finished, setFinished] = useState(false);
  const [nextChapterId, setNextChapterId] = useState('');
  const [isEnded, setIsEnded] = useState(true);
  const [selectedChoice, setSelectedChoice] = useState(null);
  const scaleValue1 = useRef(new Animated.Value(1)).current;
  const scaleValue2 = useRef(new Animated.Value(1)).current;
  const scaleSelectedValue = useRef(new Animated.Value(1)).current;
  const { readStatus } = route.params;

  useEffect(() => {
    console.log(readStatus);
  }, [readStatus]);

  const nextChapter = () => {
    const { chapterList, chapterIndex, readStatus } = route.params;
    let isFinished = true;
    const nextIndex = chapterIndex + 1;
    console.log(`Finding nextIndex:${chapterIndex + 1}`);
    const nextChapter = chapterList[nextIndex];
    console.log(`NextChapter: ${nextChapter ? nextChapter.title : NaN}`);
    console.log(readStatus.finished);
    if (nextChapter) {
      setIsEnded(false);
      isFinished = false;
      setNextChapterId(nextChapter._id);
      // Make the API call to update the read status
      if (!readStatus.finished) {
        console.log('setting next chapter ' + nextChapter._id);
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
    const { setReadStatus } = route.params;
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

  useEffect(() => {
    if (selectedChoice) {
      const scaleAnimation = Animated.spring(scaleSelectedValue, {
        toValue: 1.3,
        useNativeDriver: true,
      });

      scaleAnimation.start();

      return () => {
        scaleAnimation.stop();
      };
    }
  }, [scaleSelectedValue, selectedChoice]);

  useEffect(() => {
    const oscillateAnimation = Animated.loop(
      Animated.parallel([
        Animated.sequence([
          Animated.timing(scaleValue1, {
            toValue: 1.05,
            duration: 1000,
            useNativeDriver: true,
          }),
          Animated.timing(scaleValue1, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: true,
          }),
        ]),
        Animated.sequence([
          Animated.timing(scaleValue2, {
            toValue: 0.95,
            duration: 1000,
            useNativeDriver: true,
          }),
          Animated.timing(scaleValue2, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: true,
          }),
        ]),
      ]),
      { iterations: -1 }
    );

    oscillateAnimation.start();

    return () => {
      oscillateAnimation.stop();
    };
  }, [scaleValue1, scaleValue2]);
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
    console.log('Fetching messages');
    if (route.params && route.params.chapterId && !messages) {
      ChapterApi.getChapterById(route.params.chapterId)
        .then((response) => {
          console.log('Chapter fetch');
          setMessages(response.messages);
          if (response.choices.length > 0) {
            setChoices(response.choices);
            console.log('There are choices');
            console.log(response.choices);
          }
        })
        .catch((err) => {
          console.error(err);
        });
    } else {
      if (!route.params) console.log('No route params!');
      if (!route.params?.chapterId) console.log('No route params chapterId');
      if (messages) console.log('Messages not empty!');
    }
  }, [route.params, messages]);

  const nextChapterFromChoice = (choice) => {
    const { setReadStatus } = route.params;
    const updatedReadStatus = {
      ...readStatus,
      previousChapter: route.params.chapterId,
      nextChapter: choice.nextChapter,
      finished: false,
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
  };

  const updateReadingMessages = () => {
    console.log('Updating reading messages..');
    console.log(messages);
    if (!finished) {
      if (messages && messages.length > readingIndex) {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        let temp_readMessages = [...readingMessages];
        temp_readMessages.push(messages[readingIndex]);
        setReadingMessages(temp_readMessages);
        setReadingIndex(readingIndex + 1);
      } else if (
        messages &&
        messages.length === readingMessages.length &&
        !choices
      ) {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
        setFinished(true);
        nextChapter();
      } else if (
        messages &&
        messages.length === readingMessages.length &&
        choices
      ) {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
        setFinished(true);
      }
    } else {
      console.log('Finished');
    }
  };
  return (
    <>
      <View
        style={{ flex: 1, backgroundColor: '#fafafa', marginBottom: 100 }}
        onStartShouldSetResponder={() => updateReadingMessages()}
      >
        {readingMessages.length === 0 && (
          <View
            style={{
              flex: 1,
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Text>Touch the screen to start the story!</Text>
          </View>
        )}
        {/**MESSAGE SCROLLVIEW */}
        <ScrollView
          ref={scrollViewRef}
          onContentSizeChange={() =>
            scrollViewRef.current.scrollToEnd({ animated: true })
          }
          style={{ paddingBottom: 100 }}
        >
          {readingMessages.map(({ _id, body, sender }) => (
            <MessageBubble
              key={_id.toString()}
              messageBody={body}
              sender={sender}
              characterList={characterList}
            />
          ))}

          {finished && !choices && (
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
          {finished && choices && (
            <View
              style={{
                flex: 1,
                justifyContent: 'center',

                alignItems: 'center',
                marginTop: 30,
              }}
            >
              {!selectedChoice && (
                <View>
                  <Animated.View
                    style={{ transform: [{ scale: scaleValue1 }] }}
                  >
                    <TouchableOpacity
                      onPress={() => {
                        setSelectedChoice(choices[0]);
                        nextChapterFromChoice(choices[0]);
                      }}
                    >
                      <MessageBubble
                        messageBody={choices[0]?.text}
                        customStyles={{ alignSelf: 'center' }}
                        customColor={Colors.green}
                      />
                    </TouchableOpacity>
                  </Animated.View>

                  <Animated.View
                    style={{ transform: [{ scale: scaleValue2 }] }}
                  >
                    <TouchableOpacity
                      onPress={() => {
                        setSelectedChoice(choices[1]);
                        nextChapterFromChoice(choices[1]);
                      }}
                    >
                      <MessageBubble
                        messageBody={choices[1]?.text}
                        customStyles={{ alignSelf: 'center' }}
                        customColor={Colors.red}
                      />
                    </TouchableOpacity>
                  </Animated.View>
                </View>
              )}
              {selectedChoice && (
                <Animated.View
                  style={{
                    transform: [{ scale: scaleSelectedValue }],
                    marginTop: 25,
                  }}
                >
                  <MessageBubble
                    messageBody={selectedChoice?.text}
                    customStyles={{ alignSelf: 'center' }}
                  />

                  <Countdown
                    initialCount={5}
                    handleTimeout={() =>
                      navigation.replace('ChatRead', {
                        storyName: route.params.storyName,
                        chapterIndex: route.params.chapterIndex + 1,
                        storyId: route.params.storyId,
                        chapterId: selectedChoice.nextChapter,
                        chapterList: route.params.chapterList,
                        readStatus: route.params.readStatus,
                        setReadStatus: route.params.setReadStatus,
                      })
                    }
                  />
                </Animated.View>
              )}
            </View>
          )}
        </ScrollView>
      </View>
      <View
        style={{
          position: 'absolute',
          height: 100,
          backgroundColor: Colors.lightGray,
          width: '100%',
          bottom: 0,
          alignItems: 'center',
          justifyContent: 'center',
        }}
        onStartShouldSetResponder={() => updateReadingMessages()}
      >
        <TouchableOpacity disabled={finished}>
          <Text
            style={{
              textTransform: 'uppercase',
              color: Colors.blueGray,
              fontSize: 20,
            }}
          >
            {!finished ? 'Next message' : 'No more messages'}
          </Text>
        </TouchableOpacity>
      </View>
    </>
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
