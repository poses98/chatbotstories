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
import { ChapterItem } from '../components/ChapterItem';

/**
 * This function renders the right icon in the stack bar and
 * updates database when the icon is pressed
 */
const renderStackBarIconRight = (navigation, addItemToLists) => {
  return (
    <View style={{ flexDirection: 'row' }}>
      <TouchableOpacity
        onPress={() => {
          navigation.navigate('ChapterDetails', {
            saveChanges: addItemToLists,
          });
        }}
        style={{ paddingRight: 5 }}
      >
        <Ionicons name="add-circle-outline" size={26} color={Colors.black} />
      </TouchableOpacity>
    </View>
  );
};

export default ({ navigation, route }) => {
  const [newItem, setNewItem] = useState();
  const [chapterList, setChapterList] = useState([]);

  // get chapters api
  useEffect(() => {}, []);

  const addItemToLists = ({
    title,
    description,
    lastUpdate,
    status,
    author,
  }) => {
    const index =
      chapterList.length >= 1
        ? chapterList[chapterList.length - 1].index + 1
        : 0;
    // add chapter
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

  if (newItem) {
    chapterList = [newItem, ...chapterList];
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={chapterList}
        renderItem={({ item: { title, description, id, index } }) => {
          return (
            <ChapterItem
              title={title}
              onPress={() => {
                navigation.navigate('Chat', {
                  chapterId: id,
                  storyId: route.params.storyId,
                  saveChanges: addItemToLists,
                });
              }}
              id={id}
              navigation={navigation}
              onDelete={() => removeItemFromLists(id)}
              index={index}
              finished={true}
              list={true}
            />
          );
        }}
      />
    </View>
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
