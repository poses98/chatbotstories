import React, { useLayoutEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, ScrollView, TouchableOpacity,FlatList } from 'react-native';
import ProfileHeader from '../components/Profile/ProfileHeader';
import Colors from '../constants/Colors';
import Ionicons from "@expo/vector-icons/Ionicons"

const StoryContainer = ({ color, interactive, title, description, views, time, likes, id, onPress }) => {
    return (
        <TouchableOpacity onPress={onPress}>
            <View style={[styles.storyContainer, { backgroundColor: `${color}` }]}>
                <View style={styles.storyBar}>
                    {interactive && (
                        <View style={[styles.storyTag, { backgroundColor: Colors.green }]}>
                            <Text>Interactive</Text>
                        </View>
                    )}
                    <View style={styles.storyTag}>
                        <Text>Terror</Text>
                    </View>
                    <View style={styles.storyTag}>
                        <Text>Drama</Text>
                    </View>

                </View>
                <View style={styles.storyMainInfoContainer}>
                    <Text style={styles.storyTitle}>{title}</Text>
                    <Text>"Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras at condimentum ex, ut tristique magna. Proin vitae ligula eu lectus mollis eleifend non ut dui. Fusce condimentum auctor nunc, in aliquam."</Text>
                </View>
                <View style={{ alignSelf: "flex-end" }}>
                    <View style={{ flexDirection: "row", alignItems: "center" }}>
                        <View style={styles.storyStats}>
                            <Ionicons name="eye-outline" size={20} color={Colors.black} />
                            <Text>{views}</Text>
                        </View>
                        <View style={styles.storyStats}>
                            <Ionicons name="time-outline" size={20} color={Colors.black} />
                            <Text>{time} min</Text>
                        </View>
                    </View>
                </View>
            </View >
        </TouchableOpacity>
    )
}


export default ({ navigation }) => {
    const [stories, setStories] = useState([])

    return (
        <ScrollView style={styles.container}>
            <ProfileHeader
                name="John Doe"
                web="www.google.com"
                description="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras at condimentum ex, ut tristique magna. Proin vitae ligula eu lectus mollis eleifend non ut dui. Fusce condimentum auctor nunc, in aliquam."
                posts="5"
                followers="673"
                following="1.965"
                navigation={navigation}
            />

            <FlatList
                data={[
                    { color: Colors.blue, interactive: true, title: "1908", description: "", views: 98, time: 15, likes: 90, id: 0 },
                    { color: Colors.green, interactive: false, title: "Moby-Dick", description: "", views: 98, time: 15, likes: 90, id: 0 },
                    { color: Colors.purple, interactive: true, title: "Mac Beth", description: "", views: 98, time: 15, likes: 90, id: 0 },
                ]}
                renderItem={({ item: { color, interactive, title, description, views, time, likes, id } }) => {
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
                            onPress={() => {

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
    storyContainer: {
        flexDirection: "column",
        justifyContent: "space-between",
        alignItems: "center",
        height: 230,
        padding: 15,
        borderColor: Colors.gray,
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
    },
    storyMainInfoContainer: {
        flexDirection: 'column',
    },
    storyStats: {
        flexDirection: 'row',
        marginRight: 15,
        alignItems: "center"
    }
});