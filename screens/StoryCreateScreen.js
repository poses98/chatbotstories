import React, { useLayoutEffect, useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, ScrollView, TouchableOpacity, FlatList, Switch } from 'react-native';
import Colors from '../constants/Colors';
import Ionicons from "@expo/vector-icons/Ionicons"
import { firestore, auth } from "firebase"
import LabeledInput from "../components/LabeledInput"
import { Picker } from '@react-native-picker/picker';
import Button from '../components/Button';
import { updateDoc, addDoc } from '../services/collections';

const GENRES = [
    { genreKey: 0, verboseName: "Drama", image: require("../assets/drama.jpg") },
    { genreKey: 1, verboseName: "Terror", image: require("../assets/terror.jpg") },
    { genreKey: 2, verboseName: "Adventure", image: require("../assets/adventure.jpg") },
    { genreKey: 3, verboseName: "Test", image: require("../assets/snow.jpg") },
    { genreKey: 4, verboseName: "Test", image: require("../assets/adventure.jpg") },
]
const _STATUS_ = {
    draft: { statusId: 0, verboseName: "Draft" },
    public: { statusId: 1, verboseName: "Public" },
    private: { statusId: 2, verboseName: "Private" },
}

export const Label = ({ text, icon, ...props }) => {
    return (
        <View style={[styles.labelContainer, { ...props.labelStyle }]}>
            <Ionicons name={icon} size={15} color={Colors.gray} />
            <Text style={[{ color: Colors.black }, { ...props.textStyle }]}> {text}</Text>
        </View>
    )
}




export default ({ navigation }) => {
    const [nameField, setnameField] = useState({
        errorMessage: "",
        text: ""
    })
    const [categoryMain, setcategoryMain] = useState(0)
    const [descriptionField, setdescriptionField] = useState({
        errorMessage: "",
        text: ""
    })
    const [interactive, setinteractive] = useState(false)
    const [status, setstatus] = useState(0)


    const createStory = (data) => {
        firestore().collection("stories").add(data)
            .then((docRef) => {
                console.log("Document written with ID: ", docRef.id);
                firestore().
                    collection('users').
                    doc(auth().currentUser.uid).
                    collection('stories').
                    doc(docRef.id).set({ exists: true }).then(() => {
                        navigation.navigate("ChapterEdit", { title: nameField.text })
                    })

            })
            .catch((error) => {
                console.error("Error adding document: ", error);
            });

    }

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
                    <Ionicons name="people-outline" size={26} color={Colors.black} />
                </TouchableOpacity>
            </View >
        )
    }

    const GenreBubble = ({ image, verboseName, genreKey }) => {
        return (
            <View style={{ flex: 1, flexDirection: "row", marginHorizontal: 10 }}>
                <TouchableOpacity style={styles.genreContainer} onPress={() => {
                    setcategoryMain(genreKey)
                }}>
                    <Image
                        style={genreKey == categoryMain ? styles.genrePicSelected : styles.genrePic}
                        source={image}
                    />
                    <Text style={styles.genreText}>{verboseName}</Text>
                </TouchableOpacity>
            </View>
        )
    }

    return (
        <ScrollView style={styles.container}>
            <LabeledInput
                label="Name"
                text={nameField.text}
                onChangeText={(text) => {
                    setnameField({ text })
                }}
                errorMessage={nameField.errorMessage}
                placeholder="The perfect name for your story"
                maxLength={30}
                labelStyle={{ color: Colors.black }}
            />

            <LabeledInput
                label={`Description ${descriptionField.text.length}/200`}
                labelStyle={{ color: Colors.black }}
                text={descriptionField.text}
                errorMessage={descriptionField.errorMessage}
                onChangeText={(text) => {
                    setdescriptionField({ text })
                }}
                placeholder="A catchy description that everybody will love"
                maxLength={200}
                multiline={true}
                numberOfLines={6}
                inputStyle={{ padding: 7.9, textAlignVertical: 'top' }}
            />

            <Label text="Choose main category " icon="layers-outline" />
            <FlatList
                horizontal
                showsHorizontalScrollIndicator={false}
                data={GENRES}
                keyExtractor={item => item.genreKey.toString()}
                renderItem={({ item: { image, verboseName, genreKey } }) => {
                    return (
                        <GenreBubble
                            verboseName={verboseName}
                            image={image}
                            genreKey={genreKey}
                        />
                    );
                }}
            />

            <View style={{ flexDirection: "row", marginTop: 15 }}>
                <Label text="Will it be interactive?" icon="people-outline" />
                <Switch
                    trackColor={{ false: "#767577", true: Colors.green }}
                    thumbColor={interactive ? "#f4f3f4" : "#f4f3f4"}
                    ios_backgroundColor="#3e3e3e"
                    onValueChange={() => { setinteractive(!interactive) }}
                    value={interactive}
                    style={{ marginRight: 15 }}
                />
            </View>
            <View style={{ flexDirection: "column", marginTop: 15 }}>
                <Label text="Story status" icon="list-outline" />
                <Picker
                    enabled={false}
                    style={{ marginHorizontal: 15, color: Colors.lightGray, borderWidth: 1, borderColor: Colors.lightGray }}
                    dropdownIconColor={Colors.lightGray}
                    selectedValue={status}
                    onValueChange={(itemValue, itemIndex) =>
                        setstatus(itemValue)
                    }>
                    <Picker.Item label={_STATUS_.draft.verboseName} value={_STATUS_.draft.statusId} />
                    <Picker.Item label={_STATUS_.public.verboseName} value={_STATUS_.public.statusId} />
                    <Picker.Item label={_STATUS_.private.verboseName} value={_STATUS_.private.statusId} />
                </Picker>
            </View>
            <Button
                text="Create story"
                textStyle={{ fontWeight: "bold" }}
                onPress={() => {
                    let validation = true;
                    if (nameField.text.length === 0) {
                        validation = false;
                        nameField.errorMessage = "Name can't be empty!";
                        setnameField({ ...nameField });
                    }
                    if (descriptionField.text.length === 0) {
                        validation = false;
                        descriptionField.errorMessage = "Description can't be empty!";
                        setdescriptionField({ ...descriptionField });
                    }
                    if (validation) {
                        const data = {
                            name: nameField.text,
                            description: descriptionField.text,
                            categoryMain: categoryMain,
                            createdAt: Date.now(),
                            createdBy: auth().currentUser.uid,
                            interactive: interactive,
                            status: status
                        };
                        createStory(data);
                        console.log(data)
                    }
                }}
                buttonStyle={{ marginVertical: 40, marginHorizontal: 15, height: 45, borderColor: Colors.black }}
            />
        </ScrollView>
    )
}




const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
        paddingTop: 15
    },

    genrePic: {
        width: 70,
        height: 70,
        borderRadius: 50,
    },
    genreContainer: {
        alignItems: 'center',
        paddingVertical: 5,
        borderRadius: 50
    },
    labelContainer: {
        flex: 1,
        flexDirection: "row",
        paddingLeft: 15,
        paddingVertical: 10,
        alignItems: "center"
    },
    genreText: {
        fontSize: 10,
        marginTop: 5,
        textTransform: "uppercase",
        color:Colors.black,
        fontWeight:"bold"
    },
    genrePicSelected: {
        width: 70,
        height: 70,
        borderRadius: 50,
        borderWidth: 3,
        borderColor: Colors.teal
    }
});