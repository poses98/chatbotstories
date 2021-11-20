import React, { useState, useLayoutEffect } from "react";
import { CommonActions } from "@react-navigation/native";
import { StyleSheet, View, FlatList, TouchableOpacity } from "react-native";
import Colors from "../constants/Colors";
import { updateDoc } from "../services/collections";
import Ionicons from "@expo/vector-icons/Ionicons";
import { AuthorButtonSelector } from "../components/AuthorButtonSelector";
import LabeledInput from "../components/LabeledInput";
import Button from "../components/Button";
import * as Analytics from 'expo-firebase-analytics';


export default ({ navigation, route }) => {
  const [messageBody, setMessageBody] = useState(route.params.messageBody);
  const [sender, setSender] = useState(route.params.sender);
  const [index, setIndex] = useState(route.params.index);
  const [id, setId] = useState(route.params.id);
  const [isValid, setValidity] = useState(true);

  const characterList = route.params.characterList;

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => renderStackBarIconRight(navigation),
      headerRightContainerStyle: {
        paddingRight: 10,
      },
    });
  });

  const renderStackBarIconRight = () => {
    return (
      <View style={{ flexDirection: "row" }}>
        <TouchableOpacity
          onPress={() => {
            console.log("Saving changes...");
            if (messageBody.length > 1) {
              route.params.saveChanges({
                id: id,
                messageBody: messageBody,
                sender: sender,
                index: index,
              });
              navigation.dispatch(CommonActions.goBack());
            } else {
              console.log("ERROR: Message body length < 1");
              setValidity(false);
            }
          }}
          style={{ paddingRight: 5 }}
        >
          <Ionicons name="checkmark-outline" size={26} color={Colors.black} />
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {/**Message input */}
      <LabeledInput
        label="Message"
        text={messageBody}
        onChangeText={(text) => {
          setMessageBody(text);
          console.log(messageBody.length);
        }}
        errorMessage="* Message cannot be empty!"
        placeholder="Message"
        maxLength={500}
        multiline={true}
        inputStyle={{ color: Colors.black, marginBottom: 15 }}
      />
      {/**Author selector */}
      <View
        style={{
        }}
      >
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
                  setSender(id);
                }}
                selectedId={sender}
              />
            );
          }}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 5,
  },
  input: {
    color: Colors.darkGray,
    borderBottomColor: Colors.lightGray,
    borderBottomWidth: 0.5,
    marginHorizontal: 5,
    padding: 3,
    height: 30,
  },
  saveButton: {
    borderRadius: 25,
    backgroundColor: Colors.darkGray,
    height: 48,
    margin: 16,
    justifyContent: "center",
    alignItems: "center",
  },
  label: {
    color: Colors.black,
    marginBottom: 8,
  },
});
