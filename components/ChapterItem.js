import React from "react";
import {
  StyleSheet,
  Text,
  TouchableOpacity,
} from "react-native";
import Colors from "../constants/Colors";
import Ionicons from "@expo/vector-icons/Ionicons";
export const ChapterItem = ({ title, description, index, onPress, id, currentIndex, finished, list }) => {

  return (
    <TouchableOpacity onPress={onPress} style={styles.settingsButton} disabled={currentIndex < index}>
      {(currentIndex >= index) || (index === 0) || finished ? (
        <Text style={[styles.numberText, { color: currentIndex < index ? Colors.lightGray : Colors.black }]}>{index + 1}</Text>
      ) : (
        <Ionicons name="lock-closed-outline" size={12} style={{ color: Colors.red }} />
      )}
      <Text style={[styles.buttonText, { color: currentIndex < index ? Colors.gray : Colors.black }]}>{title}</Text>
      {((currentIndex > index) || finished) && (!list) && (
        <Ionicons name="checkmark-outline" size={17} style={{ color: Colors.green, marginLeft: 5 }} />
      )}
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
