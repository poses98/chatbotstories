import React, { useLayoutEffect, useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, ScrollView, TouchableOpacity, FlatList, ImageBackground } from 'react-native';
import ProfileHeader from '../components/Profile/ProfileHeader';
import Colors from '../constants/Colors';
import Ionicons from "@expo/vector-icons/Ionicons"
import { firestore, auth } from "firebase";

const images = {
    terror: require("../assets/terror.jpg"),
    adventure: require("../assets/adventure.jpg"),
    drama: require("../assets/drama.jpg"),
    snow: require("../assets/snow.jpg")
}

const StoryContainer = ({ color, interactive, title, description, views, time, image, likes, id, onPress }) => {
    const handleError = (e) => { console.log(e.nativeEvent.error); };
    return (
        <TouchableOpacity onPress={onPress} activeOpacity={0.8} delayPressIn={10}>
            <ImageBackground source={image} resizeMode="cover" onError={handleError} style={styles.image}>
                <View style={[styles.storyContainer]}>{/**{ backgroundColor: `${color}` } */}

                    <View style={styles.storyBar}>
                        {interactive && (
                            <View style={[styles.storyTag, { backgroundColor: Colors.green }]}>
                                <Text style={{ color: Colors.lightGray }}>Interactive</Text>
                            </View>
                        )}
                        <View style={styles.storyTag}>
                            <Text style={{ color: Colors.lightGray }}>Terror</Text>
                        </View>
                        <View style={styles.storyTag}>
                            <Text style={{ color: Colors.lightGray }}>Drama</Text>
                        </View>

                    </View>
                    <View style={styles.storyMainInfoContainer}>
                        <Text style={styles.storyTitle}>{title}</Text>
                        <Text style={styles.storyDescription}>"Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras at condimentum ex, ut tristique magna. Proin vitae ligula eu lectus mollis eleifend non ut dui. Fusce condimentum auctor nunc, in aliquam."</Text>
                    </View>
                    <View style={{ alignSelf: "flex-end" }}>
                        <View style={{ flexDirection: "row", alignItems: "center" }}>
                            <View style={styles.storyStats}>
                                <Ionicons name="eye-outline" size={20} color={Colors.lightGray} />
                                <Text style={{ color: Colors.lightGray }}>{views}</Text>
                            </View>
                            <View style={styles.storyStats}>
                                <Ionicons name="time-outline" size={20} color={Colors.lightGray} />
                                <Text style={{ color: Colors.lightGray }}>{time} min</Text>
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
    //Get user information
    const userRef =
        firestore()
            .collection("users")

    useEffect(() => {
        const unsubscribe = firestore().collection("users").doc(auth().currentUser.uid)
            .onSnapshot((doc) => {
                console.log("Profile data fetched: ", doc.data());
                setdata(doc.data())
            });
        return unsubscribe;
    }, [])

    useLayoutEffect(() => {
        navigation.setOptions({
            title: data.username
        })
    })


    return (
        <ScrollView style={styles.container}>
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

            <FlatList
                data={[
                    { color: Colors.blue, interactive: true, title: "1908", description: "", views: 98, time: 15, likes: 90, id: 0, image: images.drama },
                    { color: Colors.green, interactive: false, title: "Moby-Dick", description: "", views: 98, time: 15, likes: 90, id: 1, image: images.terror },
                    { color: Colors.purple, interactive: true, title: "Mac Beth", description: "", views: 98, time: 15, likes: 90, id: 2, image: images.snow },
                    { color: Colors.purple, interactive: false, title: "Indiana Jones", description: "", views: 140, time: 15, likes: 90, id: 3, image: images.adventure },
                ]}
                renderItem={({ item: { color, interactive, title, description, views, time, likes, id, image } }) => {
                    return (
                        <StoryContainer
                            color={color}
                            interactive={interactive}
                            title={title}
                            description={description}
                            views={views}
                            time={time}
                            likes={likes}
                            id={id}
                            image={image}
                            onPress={() => {
                                navigation.navigate("StoryInfo", { title })
                            }}
                        />
                    );
                }}
            />

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
        alignItems: "center",
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
        marginRight: 15,
        alignItems: "center",

    }
});