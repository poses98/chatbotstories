import React, { useLayoutEffect, useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, ScrollView, TouchableOpacity, FlatList, ImageBackground } from 'react-native';
import ProfileHeader from '../components/Profile/ProfileHeader';
import Colors from '../constants/Colors';
import Ionicons from "@expo/vector-icons/Ionicons"
import { firestore, auth } from "firebase"
import LabeledInput from "../components/LabeledInput"
import Checkbox from "../components/Checkbox"
import { Picker } from '@react-native-picker/picker';

const GENRES = {
    0: "Drama",
    1: "Fable",
    2: "Fairy Tale",
    3: "Fantasy",
    4: "Fiction",
    5: "Folklore",
    6: "Historical Fiction",
    7: "Horror",
    8: "Humor",
    9: "Mystery",
    10: "Mythology",
    11: "Realistic Fiction",
    12: "Science Fiction",
    13: "Short story",
    14: "Tall Tale",
    200: "Select a genre"
}


export default ({ navigation }) => {
    const [nameField, setnameField] = useState({
        errorMessage: "",
        text: ""
    })
    const [categoryMain, setcategoryMain] = useState({
        errorMessage: "",
        text: ""
    })
    const [categorySecondary, setcategorySecondary] = useState({
        errorMessage: "",
        text: ""
    })
    const [descriptionField, setdescriptionField] = useState({
        errorMessage: "",
        text: ""
    })
    const [mainGenre, setmainGenre] = useState(0)
    const [interactive, setinteractive] = useState(false)
    const [descriptionLength, setdescriptionLength] = useState(0)

    /**
     * Render sign out button (develop only)
     */
    useLayoutEffect(() => {
        navigation.dangerouslyGetParent().setOptions({
            headerRight: () => renderStackBarIconRight(),
            headerRightContainerStyle: {
                paddingRight: 10
            },

        })
    })
    const renderStackBarIconRight = () => {
        return (
            <View style={{ flexDirection: "row" }}>
                <TouchableOpacity
                    onPress={() => { auth().signOut() }}
                    style={{ paddingRight: 5 }}>
                    <Ionicons name="pencil-outline" size={26} color={Colors.black} />
                </TouchableOpacity>
            </View >
        )
    }


    console.log(Date.now())

    return (
        <ScrollView style={styles.container}>
            <LabeledInput
                label="Name"
                text={nameField}
                onChangeText={(text) => {
                    setnameField({ text })
                }}
                placeholder="The perfect name for your story"
                maxLength={30}
            />
            <LabeledInput
                label={`Description ${descriptionField.text.length}/200`}
                text={descriptionField}
                onChangeText={(text) => {
                    setdescriptionField({ text })
                }}
                placeholder="A catchy description that everybody will love ;)"
                maxLength={200}
                multiline={true}
                inputStyle={{ padding: 7.9 }}
            />
            <Checkbox
                isChecked={interactive}
                onChecked={() => { setinteractive(!interactive) }}
                labelText="Interactive"
                helpText={`*Specify if the reader will be able to interact with\n the story`}
            />
            <Picker
                selectedValue={mainGenre}
                onValueChange={(itemValue, itemIndex) =>
                    setmainGenre(itemValue)
                }>
                
                <Picker.Item label="Java" value="java" />
                <Picker.Item label="JavaScript" value="js" />
            </Picker>
        </ScrollView>
    )
}




const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
        paddingTop: 15
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