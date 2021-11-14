import React, { useState, useLayoutEffect, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  FlatList,
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
import { ScrollView } from "react-native-gesture-handler";

/**Chapter item to be populated */
const ChapterItem = ({ title, description, index, onPress, id }) => {
  return (
    <TouchableOpacity onPress={onPress} style={styles.settingsButton}>
      <Text style={styles.buttonText}>{title}</Text>
    </TouchableOpacity>
  );
};

/**
 * This function renders the right icon in the stack bar and
 * updates database when the icon is pressed
 */
const renderStackBarIconRight = (navigation, addItemToLists) => {
  return (
    <View style={{ flexDirection: "row" }}>
      <TouchableOpacity
        onPress={() => {
          navigation.navigate("ChapterSettings", {
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
  const chapterListRef = firestore()
    .collection("stories")
    .doc(route.params.storyId)
    .collection("chapters");

  useEffect(() => {
    onSnapshot(
      chapterListRef,
      (newLists) => {
        setChapterList(newLists);
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

  const addItemToLists = ({
    title,
    description,
    lastUpdate,
    status,
    author,
  }) => {
    const index =
      chapterList.length >= 1
        ? chapterList[chapterList.length -1 ].index + 1
        : 0;
        console.log("Chapter list length: " + chapterList.length)
    console.log(title,
      description,
      lastUpdate,
      status,
      author,
      index);

    addDoc(chapterListRef, {
      title,
      description,
      lastUpdate,
      status,
      author,
      index,
    });
  };

  const removeItemFromLists = (id) => {
    removeDoc(chapterListRef, id);
  };

  const updateItemFromLists = (id, item) => {
    updateDoc(chapterListRef, id, item);
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
    <ScrollView style={styles.container}>
      <FlatList
        data={chapterList}
        renderItem={({ item: { title, description, id } }) => {
          return (
            <ChapterItem
              title={title}
              onPress={() => {
                navigation.navigate("ChapterSettings", {
                  chapterId: id,
                  saveChanges: addItemToLists,
                });
              }}
              id={id}
              navigation={navigation}
              onDelete={() => removeItemFromLists(id)}
            />
          );
        }}
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  icon: {
    padding: 5,
    fontSize: 32,
    color: "white",
  },
  buttonText: {
    fontSize: 17,
    fontWeight: "normal",
    paddingLeft: 15,
  },
  settingsButton: {
    flex: 1,
    minHeight: 30,
    paddingHorizontal: 15,
    fontSize: 20,
    marginVertical: 5,
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
  },
});