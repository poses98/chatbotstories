import React, { useState, useLayoutEffect, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  FlatList,
} from 'react-native';
import Colors from '../constants/Colors';
import Ionicons from '@expo/vector-icons/Ionicons';
import { ScrollView } from 'react-native-gesture-handler';
import { SafeAreaView } from 'react-native-safe-area-context';
import ChapterApi from '../api/chapter';
import { ChapterItem } from '../components/ChapterItem';
import LoadingScreen from './LoadingScreen';

export default ({ navigation, route }) => {
  const [chapterList, setChapterList] = useState([]);
  const { shouldRefresh, newItem } = route.params;
  // get chapters api
  useEffect(() => {
    ChapterApi.getChaptersForStory(route.params.storyId).then((response) => {
      console.log(response);
      setChapterList(response);
    });
  }, [newItem, shouldRefresh]);

  /**
   * This function renders the right icon in the stack bar and
   * updates database when the icon is pressed
   */
  const renderStackBarIconRight = (addItemToLists) => {
    return (
      <View style={{ flexDirection: 'row' }}>
        <TouchableOpacity
          onPress={() => {
            navigation.navigate('ChapterDetails', {
              storyId: route.params.storyId,
              addItemToLists: addItemToLists,
            });
          }}
          style={{ paddingRight: 5 }}
        >
          <Ionicons name="add-circle-outline" size={26} color={Colors.black} />
        </TouchableOpacity>
      </View>
    );
  };

  const addItemToLists = () => {
    console.log('received');
  };

  const removeItemFromLists = (id) => {
    // remove chapter
  };

  const updateItemFromLists = (id, item) => {
    // update chapter list
  };

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => renderStackBarIconRight(navigation, addItemToLists),
      headerRightContainerStyle: {
        paddingRight: 10,
      },
    });
  });

  return chapterList ? (
    <View style={styles.container}>
      <FlatList
        data={chapterList}
        renderItem={({ item: { title, description, _id }, index }) => {
          return (
            <ChapterItem
              title={title}
              onPress={() => {
                navigation.navigate('Chat', {
                  chapterId: _id,
                  title: title,
                  storyId: route.params.storyId,
                  saveChanges: addItemToLists,
                });
              }}
              id={_id}
              navigation={navigation}
              onDelete={() => removeItemFromLists(_id)}
              index={index}
              finished={true}
              list={true}
            />
          );
        }}
      />
    </View>
  ) : (
    <LoadingScreen />
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  icon: {
    padding: 5,
    fontSize: 32,
    color: 'white',
  },
  buttonText: {
    fontSize: 17,
    fontWeight: 'normal',
    paddingLeft: 15,
  },
  settingsButton: {
    flex: 1,
    minHeight: 30,
    paddingHorizontal: 15,
    fontSize: 20,
    marginVertical: 5,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  numberText: {
    fontSize: 14,
    color: Colors.gray,
  },
});
