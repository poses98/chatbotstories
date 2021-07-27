
import React from 'react';
import { StyleSheet, Text, TouchableOpacity } from 'react-native';
import Colors from "../constants/Colors";

export default ({ buttonStyle, textStyle, onPress, text }) => {
    return (
        <TouchableOpacity
            style={[styles.button, buttonStyle]}
            onPress={onPress}
        >
            <Text style={[styles.text, textStyle]}>{text}</Text>
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    button: {
        flexDirection: "row",
        borderWidth: 1,
        borderColor: Colors.lightGray,
        borderRadius: 5,
        backgroundColor: "transparent",
        height: 35,
        justifyContent: "center",
        alignItems: "center",
    },
    text: {
        color: Colors.black,
        fontSize: 14
    },
});