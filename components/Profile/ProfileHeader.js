import * as React from 'react';
import { View, Text, StyleSheet, Image,Link, Linking } from 'react-native';
import { Colors } from '../../constants/Colors';
import Button from "../Button";
import A from 'react-native-a'

export default ({ profilePic, name, web, description, posts, followers, following, ...data }) => {

    return (
            <View style={styles.profileInfo}>
                {/* Header profile */}
                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: "center" }}>
                    <Image
                        style={styles.profilePic}
                        source={require("../../assets/profilepicplaceholder.png")}
                    />
                    <View style={styles.itemContainer}>
                        <View style={styles.infoBox}>
                            <Text style={styles.numberInfo}>{posts}</Text>
                            <Text style={styles.textInfo}>Posts</Text>
                        </View>
                        <View style={styles.infoBox}>
                            <Text style={styles.numberInfo}>{followers}</Text>
                            <Text style={styles.textInfo}>Followers</Text>
                        </View>
                        <View style={styles.infoBox}>
                            <Text style={styles.numberInfo}>{following}</Text>
                            <Text style={styles.textInfo}>Following</Text>
                        </View>
                    </View>

                </View>
                <View style={styles.bioBox}>
                    {/* Profile name  */}
                    <Text style={styles.profileName}>{name}</Text>
                    {/* Web  */}
                    <A style={styles.profileWeb} href="google.com"><Text>{web}</Text></A>
                    {/* Bio  */}
                    <Text style={styles.profileDescription}>{description}</Text>
                </View>
                <Button
                    text="Edit profile"
                    textStyle={{fontWeight:"bold"}}
                />
            </View>
      
    )
}

const styles = StyleSheet.create({
    profileInfo: {
        flex: 0.43,
        alignItems: 'stretch',
        flexDirection: 'column',
    },
    itemContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        flex: 1,
        height:90,
        margin: 15,
    },
    profilePic: {
        width: 90,
        height: 90,
        borderRadius: 50,
        marginTop: 15,
        marginLeft: 15
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
        paddingHorizontal:15,
        paddingVertical:5
    },
    profileName: {
        fontWeight: "bold",
        fontSize: 15,
    },
    profileWeb:{
        fontSize: 15,
    },
    profileDescription:{
        fontSize: 15,
        justifyContent: 'center',
        alignItems: 'stretch'
    }
});