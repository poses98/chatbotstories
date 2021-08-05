import React, { useLayoutEffect, useState, useEffect } from 'react';
import { View, TouchableOpacity, StyleSheet, Text, Image, ImageBackground } from 'react-native';
import Ionicons from "@expo/vector-icons/Ionicons"
import Colors from '../constants/Colors';
import { firestore, auth } from "firebase";

import GENRES from '../constants/Genres'
import LANGUAGES from '../constants/Languages'
import { ScrollView } from 'react-native-gesture-handler';


export default ({ navigation, route }) => {
    const [isSaved, setIsSaved] = useState(false)
    const [loading, setloading] = useState(true)
    const [data, setdata] = useState({})
    const [storyId, setstoryId] = useState(route.params.storyId || "")
    const [owned, setowned] = useState(false)
    const [notloaded, setnotloaded] = useState(false)
    //Get story information
    const storyRef =
        firestore()
            .collection("stories")

    useEffect(() => {
        if (storyId != "") {
            storyRef.doc(storyId).get().then((doc) => {
                if (doc.exists) {
                    console.log("Story loaded: ", doc.data());
                    setdata(doc.data())
                    if (doc.data().author === auth().currentUser.uid) {
                        setowned(true)
                    }
                    setloading(false)
                } else {
                    // doc.data() will be undefined in this case
                    console.log("No such document!");
                }
            }).catch((error) => {
                console.log("Error getting document:", error);
            });
        } else {
            setnotloaded(true);
            setloading(false);
        }
    }, [])



    const renderStackBarIconRight = () => {
        return (
            <View style={{ flexDirection: "row" }}>
                {/**Only render if it's not owner*/}
                {!owned && !notloaded && (
                    <TouchableOpacity
                        onPress={() => {
                            setIsSaved(!isSaved)
                            /** Save story into user's account */
                        }}
                        style={{ paddingRight: 5 }}>
                        <Ionicons name={!isSaved ? "bookmark-outline" : "bookmark"} size={26} color={Colors.black} />
                    </TouchableOpacity>
                )}
                {/**Only render if it's owner*/}
                {owned && !notloaded && (
                    <TouchableOpacity
                        onPress={() => { /** setEditMode */ }}
                        style={{ paddingRight: 5 }}>
                        <Ionicons name="pencil-outline" size={26} color={Colors.black} />
                    </TouchableOpacity>
                )}

            </View >
        )
    }

    useLayoutEffect(() => {
        navigation.setOptions({
            headerRight: () => renderStackBarIconRight(),
            headerRightContainerStyle: {
                paddingRight: 10
            }
        })
    })

    return (
        <ScrollView style={styles.container}>
            {!loading && !notloaded && (
                <View>
                    {/**Description */}
                    <ImageBackground source={GENRES[data.categoryMain].image} resizeMode="cover" onError={() => { }} style={styles.image}>
                        <View style={styles.storyContainer}>
                            <Text style={styles.storyTitle}>{data.title}</Text>
                            <Text style={styles.storyDescription}>"{data.description}"</Text>
                        </View>
                    </ImageBackground>
                    {/** Likes */}
                    <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingHorizontal: 15 }}>
                        <View style={styles.storyStats}>
                            <Ionicons name="eye-outline" size={25} color={Colors.black} />
                            <Text style={{ color: Colors.black }}>55</Text>
                        </View>
                        <View style={styles.storyStats}>
                            <Ionicons name="heart" size={25} color={Colors.red} />
                            <Text style={{ color: Colors.black }}>15</Text>
                        </View>

                    </View>
                    {/**Chapters list */}
                </View>
            )}
            {!loading && notloaded && (
                <View style={{alignItems:'center',flex:1,padding:15,justifyContent: 'center'}}>
                    <Text>We are sorry!😭</Text>
                    <Text> There has been an error while loading your story😥</Text>
                    <Text> Try again later</Text>
                </View>
            )}
            {loading && (
                <View style={{
                    flex: 1,
                    backgroundColor: "#fff",
                    justifyContent: "center",
                    alignItems: "center",
                }}>
                    <Image source={require('../assets/loading.gif')} style={{ width: 100, height: 100 }} />
                </View>
            )}
        </ScrollView>

    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        
        backgroundColor: "#fff",
    },
    image: {
        flex: 1,
        justifyContent: "center",
        height: 230,
        width: '100%',

    },
    storyContainer: {
        flex: 1,
        justifyContent: "space-between",
        alignItems: "center",
        justifyContent: "center",
        padding: 15,
        borderColor: Colors.gray,
        backgroundColor: 'rgba(52, 52, 52, 0.6)'
    },
    storyBar: {
        alignSelf: "flex-start",
        padding: 0,
        flexDirection: 'row',
    },
    storyTag: {
        borderWidth: 1,
        borderColor: Colors.lightGray,
        padding: 5,
        borderRadius: 5,
        marginHorizontal: 3
    },
    storyTitle: {
        fontSize: 26,
        fontWeight: 'bold',
        color: "#fafafa"
    },
    storyDescription: {
        color: Colors.lightGray,
    },
    storyMainInfoContainer: {
        flexDirection: 'column',
        color: "#fafafa"
    },
    storyStats: {
        flexDirection: 'row',
        alignItems: "center",

    }
});