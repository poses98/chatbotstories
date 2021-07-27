import React, { useState, useLayoutEffect } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView,Alert } from 'react-native';
import { CommonActions } from "@react-navigation/native";
import Colors from '../constants/Colors';
import A from 'react-native-a'
import LabeledInput from '../components/LabeledInput';
import Ionicons from "@expo/vector-icons/Ionicons"

const renderStackBarIconRight = (navigation) => {
    return (
        <View style={{ flexDirection: "row" }}>
            <TouchableOpacity
                onPress={() => {
                    //Push changes to the database
                    navigation.dispatch(CommonActions.goBack());
                }}
                style={{ paddingRight: 5 }}>
                <Ionicons name="checkmark-outline" size={26} color={Colors.black} />
            </TouchableOpacity>

        </View>
    )
}
const backButtonProfileEdit = (navigation) => {
    return (
        <View style={{ flexDirection: "row" }}>
            <TouchableOpacity
                onPress={() => {
                    changesWillNotBeSavedAlert(navigation)
                }}
                style={{ paddingLeft: 10 }}>
                <Ionicons name="close-outline" size={26} color={Colors.black} />
            </TouchableOpacity>

        </View>
    )
}

const changesWillNotBeSavedAlert = (navigation) =>
    Alert.alert(
      "Changes will not be saved",
      "Are you sure?",
      [
        {
          text: "Cancel",
          onPress: () => console.log("Cancel Pressed"),
          style: "cancel"
        },
        { text: "OK", onPress: () => {
            navigation.dispatch(CommonActions.goBack());
        } },
        
      ],{cancelable:true}
    );

export default ({ navigation }) => {


    const [inputName, setInputName] = useState({
        text: "",
        errorMessage: ""
    })
    const [usernameInput, setUsernameInput] = useState({
        text: "",
        errorMessage: ""
    })

    const [websiteInput, setWebsiteInput] = useState({
        text: "",
    })

    const [descriptionInput, setdescriptionInput] = useState({
        text: "",
        errorMessage: ""
    })

    useLayoutEffect(() => {
        navigation.setOptions({
            headerRight: () => renderStackBarIconRight(navigation),
            headerLeft: () => backButtonProfileEdit(navigation),
            headerRightContainerStyle: {
                paddingRight: 10
            }
        })
    })

    return (
        <ScrollView style={styles.container}>
            <Image
                style={styles.profilePic}
                source={require("../assets/profilepicplaceholder.png")}
            />
            <TouchableOpacity onPress={() => {
                //Upload new pic function
            }}>
                <Text style={styles.changeProfilePicText}>
                    Change profile picture
                </Text>
            </TouchableOpacity>

            {/**Name */}
            <LabeledInput
                label="Name"
                text={inputName.text}
                onChangeText={(text) => {
                    setInputName(text);
                }}
                autoCompleteType={"name"}
                placeholder="Your name"
                maxLength={30}
            />
            {/**User name */}
            <LabeledInput
                label="Username"
                text={inputName.text}
                onChangeText={(text) => {
                    setInputName(text);
                }}
                placeholder="Your username"
                maxLength={20}
            />
            {/**Web */}
            <LabeledInput
                label="Website"
                text={inputName.text}
                onChangeText={(text) => {
                    setInputName(text);
                }}
                placeholder="Your personal or professional website"
                maxLength={60}
                autoCapitalize="none"
            />
            {/**Description */}
            <LabeledInput
                label="Description"
                text={inputName.text}
                onChangeText={(text) => {
                    setInputName(text);
                }}
                placeholder="Present yourself to other people"
                maxLength={200}
            />


        </ScrollView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
    },
    profilePic: {
        width: 90,
        height: 90,
        borderRadius: 50,
        alignItems: 'center',
        alignSelf: "center",
        marginTop: 40,
    },
    changeProfilePicText: {
        alignSelf: "center",
        color: Colors.blue,
        fontSize: 16,
    },
    icon: {
        padding: 5,
        fontSize: 24,
    },
    centeredView: {
        justifyContent: "center",
        alignItems: "center",
        marginTop: 50,
    },
    modalView: {
        backgroundColor: "white",
        borderRadius: 20,
        padding: 35,
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    infoBox: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    textInfo: {
        fontSize: 14,
        marginTop: 3
    },
    numberInfo: {
        fontWeight: 'bold',
        fontSize: 18
    },
    bioBox: {
        flex: 1,
        paddingHorizontal: 15,
        paddingVertical: 5
    },
    profileName: {
        fontWeight: "bold",
        fontSize: 15,
    },
    profileWeb: {
        fontSize: 15,
    },
    profileDescription: {
        fontSize: 15,
        justifyContent: 'center',
        alignItems: 'stretch'
    }
});