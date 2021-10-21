import React from "react";
import { View, Text, StyleSheet } from "react-native";

import Colors from "../constants/Colors";
import Ionicons from "@expo/vector-icons/Ionicons";

export const Label = ({ text, icon, ...props }) => {
  return (
    <View style={[styles.labelContainer, { ...props.labelStyle }]}>
      <Ionicons name={icon} size={15} color={Colors.gray} />
      <Text style={[{ color: Colors.black }, { ...props.textStyle }]}>
        {" "}
        {text}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  labelContainer: {
    flex: 1,
    flexDirection: "row",
    paddingLeft: 15,
    paddingVertical: 10,
    alignItems: "center",
  },
});
