import React from 'react';
import { StyleSheet, Text, View, TextInput } from 'react-native';
import Colors from "../constants/Colors";


export default ({ labelStyle, label, errorMessage, inputStyle, text, onChangeText, ...inputProps }) => {
    return (
        <View style={styles.container}>
            <View style={styles.labelContainer}>
                <Text style={labelStyle}>{label}</Text>
            </View>
            <TextInput
                underlineColorAndroid="transparent"
                style={[styles.input, inputStyle]}
                value={text}
                onChangeText={onChangeText}
                onSubmitEditing={() => {}}
                {...inputProps} 
            />
            <View style={styles.labelContainer}>
                <Text style={styles.error}>
                    {errorMessage && `*${errorMessage}`}
                </Text>
            </View>
        </View>
    )
}


const styles = StyleSheet.create({
    container: {
        paddingHorizontal: 8,
        margin: 1,
    },
    labelContainer: {flex:1, flexDirection: "row", marginBottom: 0,marginLeft:15 },
    error: {
        color: Colors.red,
        fontSize: 12,
        marginHorizontal:15
    },
    input: {
        backgroundColor:'#f8f8f8',
        borderColor: Colors.lightGray,
        borderWidth: 1,
        borderRadius: 5 ,
        padding: 8,
        fontSize: 16,
        color: Colors.black,
        marginRight: 15,
        marginLeft: 15
    },
});