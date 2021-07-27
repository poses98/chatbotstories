import React, { useLayoutEffect, useState } from 'react';
import { View, TouchableOpacity, StyleSheet, Text } from 'react-native';
import Ionicons from "@expo/vector-icons/Ionicons"
import Colors from '../constants/Colors';


export default ({ navigation }) => {
    const [isSaved, setIsSaved] = useState(false)

    const renderStackBarIconRight = () => {
        return (
            <View style={{ flexDirection: "row" }}>
                <TouchableOpacity
                    onPress={() => {
                        setIsSaved(!isSaved)
                    }}
                    style={{ paddingRight: 5 }}>
                    <Ionicons name={!isSaved ? "bookmark-outline" : "bookmark"} size={26} color={Colors.black} />
                </TouchableOpacity>
                <TouchableOpacity
                    onPress={() => { }}
                    style={{ paddingRight: 5 }}>
                    <Ionicons name="pencil-outline" size={26} color={Colors.black} />
                </TouchableOpacity>
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
        <View>
            {/**Description */}
            {/** Likes */}
            <View style={styles.storyStats}>
                <Ionicons name="heart-sharp" size={20} color={Colors.red} />
                <Text> </Text>
            </View>
            {/**Chapters list */}
        </View>
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