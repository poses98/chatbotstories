import React, { useLayoutEffect, useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, ScrollView, TouchableOpacity, FlatList, ImageBackground } from 'react-native';
import ProfileHeader from '../components/Profile/ProfileHeader';
import Colors from '../constants/Colors';
import Ionicons from "@expo/vector-icons/Ionicons"
import { firestore, auth } from "firebase";
import GENRES from '../constants/Genres'

const images = {
    terror: require("../assets/terror.jpg"),
    adventure: require("../assets/adventure.jpg"),
    drama: require("../assets/drama.jpg"),
    snow: require("../assets/snow.jpg")
}

const StoryContainer = ({
    interactive,
    title,
    description,
    storyId,
    onPress,
    categoryMain
}) => {
    const handleError = (e) => { console.log(e.nativeEvent.error); };
    return (
        <TouchableOpacity
            onPress={onPress}
            activeOpacity={0.8}
            delayPressIn={10}>
            <ImageBackground
                source={GENRES[categoryMain].image}
                resizeMode="cover"
                onError={handleError}
                style={styles.image}>
                <View style={[styles.storyContainer]}>{/**{ backgroundColor: `${color}` } */}
                    <View style={styles.storyBar}>
                        {interactive && (
                            <View style={[styles.storyTag, { backgroundColor: Colors.green }]}>
                                <Text style={{ color: Colors.lightGray }}>Interactive</Text>
                            </View>
                        )}
                        <View style={styles.storyTag}>
                            <Text style={{ color: Colors.lightGray }}>
                                {GENRES[categoryMain].verboseName}
                            </Text>
                        </View>


                    </View>
                    <View style={styles.storyMainInfoContainer}>
                        <Text style={styles.storyTitle}>
                            {title}
                        </Text>
                        <Text style={styles.storyDescription}>
                            "{description}"
                        </Text>
                    </View>
                    <View style={{ alignSelf: "flex-end" }}>
                        <View style={{
                            flexDirection: "row",
                            alignItems: "center"
                        }}>
                            <View style={styles.storyStats}>
                                <Ionicons
                                    name="eye-outline"
                                    size={20}
                                    color={Colors.lightGray} />
                                <Text style={{ color: Colors.lightGray }}>44</Text>
                            </View>
                            <View style={styles.storyStats}>
                                <Ionicons
                                    name="heart"
                                    size={20}
                                    color={Colors.red} />
                                <Text style={{ color: Colors.lightGray }}>15</Text>
                            </View>
                        </View>
                    </View>

                </View >
            </ImageBackground>
        </TouchableOpacity>
    )
}


export default ({ navigation }) => {
    const [stories, setStories] = useState([])
    const [data, setdata] = useState({})
    const [loading, setloading] = useState(true)

    //Get user information
    const userRef =
        firestore()
            .collection("users")
    const storyRef =
        firestore()
            .collection("stories")
    useEffect(() => {
        const unsubscribe = userRef.
            doc(auth().currentUser.uid) // TODO ESTO HAY QUE CAMBIARLO POR EL ID DE USUARIO!
            .onSnapshot((doc) => {
                console.log("Profile data fetched: ", doc.data());
                setdata(doc.data())
            });
        return unsubscribe;


    }, [])
    useEffect(() => {

        const unsubscribeStories = firestore().
            collection("users").
            doc(auth().currentUser.uid).  // TODO ESTO HAY QUE CAMBIARLO POR EL ID DE USUARIO!
            collection('stories').
            orderBy("date","desc").
            limit(6).
            onSnapshot((querySnapshot) => {
                var fetchedStories = []
                if (querySnapshot.size === 0) {
                    setloading(false)
                }
                querySnapshot.forEach((doc) => {
                    //Fetching every story from DB
                    storyRef.doc(doc.id).get().then((doc) => {
                        if (doc.exists) {
                            fetchedStories.push(doc.data());
                            console.log("Story loaded with id: ", doc.id)
                            setStories(fetchedStories)
                            setloading(false)
                        } else {
                            // doc.data() will be undefined in this case
                            setloading(false)
                            console.log("No such document!");
                        }
                    }).catch((error) => {
                        console.log("Error getting document:", error);
                    });
                });

                console.log(stories)

            },
                error => {
                    setloading(false)
                    console.log(error)
                });

        return unsubscribeStories;
    }, [])



    return (

        <ScrollView style={styles.container}>
            {!loading && (
                <View>
                    <ProfileHeader
                        name={data.name}
                        web={data.website}
                        description={data.description}
                        posts="5"
                        followers="673"
                        following="1.965"
                        navigation={navigation}
                        userId={auth().currentUser.uid}
                    />
                    {console.log(stories)}
                    {!(stories.length == 0) && (
                        <FlatList
                            data={stories}
                            renderItem={({ item: { interactive, title, description, storyId, date, categoryMain } }) => {
                                return (
                                    <StoryContainer
                                        interactive={interactive}
                                        title={title}
                                        description={description}
                                        id={storyId}
                                        categoryMain={categoryMain}
                                        date={date}
                                        
                                        onPress={() => {
                                            navigation.navigate("StoryInfo", { title, storyId,username:data.username })
                                        }}
                                    />
                                );
                            }}
                        />
                    )}
                    {stories.length == 0 && (
                        <View style={{
                            flex: 1,
                            justifyContent: 'center',
                            alignContent: 'center',
                            alignSelf: 'center',
                            opacity: .5,
                            alignItems: 'center',
                            height: 300
                        }}>
                            <Text>Write some stories and they will show up here!</Text>
                        </View>
                    )}

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
        </ScrollView >


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
        flexDirection: "column",
        justifyContent: "space-between",
        height: 230,
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
        borderColor: "#fafafa", //TODO
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
        flex:1,
        alignItems:"flex-start",
        alignContent:"center",
        justifyContent:"center",
        flexDirection: 'column',
        color: "#fafafa"

    },
    storyStats: {
        flexDirection: 'row',
        marginRight: 15,
        alignItems: "center",

    }
});