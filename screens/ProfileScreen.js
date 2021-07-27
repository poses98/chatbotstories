import React, { useLayoutEffect } from 'react';
import { View, Text, StyleSheet, Image, ScrollView, TouchableOpacity } from 'react-native';
import ProfileHeader from '../components/Profile/ProfileHeader';
import Colors from '../constants/Colors';
import Button from "../components/Button";
import Ionicons from "@expo/vector-icons/Ionicons"

const StoryContainer = ({ interactive, title, description, views, time, likes, id }) => {
    return (
        <TouchableOpacity>
            <View style={styles.storyContainer}>
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
                        <View style={styles.storyStats}>
                            <Ionicons name="heart-sharp" size={20} color={Colors.red} />
                            <Text>{likes}</Text>
                        </View>
                        <TouchableOpacity>
                            <View style={[styles.storyStats,{alignSelf:"flex-end"}]}>
                                <Ionicons name="bookmark-outline" size={30} color={Colors.black} />
                            </View>
                        </TouchableOpacity>

                    </View>
                </View>
            </View >
        </TouchableOpacity>
    )
}


export default ({ navigation }) => {
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

            <StoryContainer
                interactive={true}
                title="1984"
                views={1499}
                likes={106}
                time={55}
            />
            <StoryContainer
                interactive={false}
                title="Mac Beth"
                views={55456}
                likes={356}
                time={30}
            />
            <StoryContainer
                interactive={true}
                title="Moby-Dick"
                views={78542}
                likes={546}
                time={17.5}
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
        borderTopWidth: 1,
        borderColor: Colors.gray
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