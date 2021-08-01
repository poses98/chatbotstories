import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Colors from "../constants/Colors";

export default ({ isChecked, onChecked, ...props }) => {
    return (
        <TouchableOpacity style={styles.container} onPress={onChecked}>
           
                <View style={styles.checkbox}>
                    <Text style={{ color: Colors.black }}>{isChecked ? "✓" : ""}</Text>
                </View>
                <Text>{props.labelText}</Text>
                <View>
                    <Text style={styles.helpText}>{props.helpText}</Text>
                </View>

        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    checkbox: {
        width: 20,
        height: 20,
        margin: 5,
        backgroundColor: "#fff0",
        color: Colors.lightGray,
        borderWidth: 1,
        borderRadius: 3,
        borderColor: Colors.lightGray,
        alignItems: "center",
        justifyContent: "center",
    },
    helpText:{
        fontSize:10,
        color:Colors.gray
    },
    container:{
        flex: 1,
        flexDirection:"row",
        alignItems:"center",
        marginLeft: 18,
    }
});