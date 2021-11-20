import React from "react";
import {
  StyleSheet,
  Text,
  TouchableOpacity,
} from "react-native";
import Colors from "../constants/Colors";
export const ChapterItem = ({ title, description, index, onPress, id, currentIndex }) => {
  console.log(title + ":" + currentIndex < index)
  return (
    <TouchableOpacity onPress={onPress} style={styles.settingsButton} disabled={currentIndex < index}>
      <Text style={[styles.numberText, { color: currentIndex < index ? Colors.lightGray : Colors.black }]}>{index + 1}</Text>
      <Text style={[styles.buttonText, { color: currentIndex < index ? Colors.lightGray : Colors.black, textDecorationLine: currentIndex > index ? "line-through" : "none"}]}>{title}</Text>
    </TouchableOpacity>
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
  numberText: {
    fontSize: 14,
    color: Colors.gray
  }
});
