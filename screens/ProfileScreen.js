import * as React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import ProfileHeader from '../components/Profile/ProfileHeader';

export default ({ navigation }) => {
    return (
        <View style={styles.container}>
            <ProfileHeader
                name="John Doe"
                web="www.google.com"
                description="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras at condimentum ex, ut tristique magna. Proin vitae ligula eu lectus mollis eleifend non ut dui. Fusce condimentum auctor nunc, in aliquam."
                posts="5"
                followers="673"
                following="1.965"

            />
        </View>
    )
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
    },
    profileInfo: {
        flex: 0.43,
        alignItems: 'stretch',
        flexDirection: 'column',
    },
    itemTitle: { fontSize: 24, padding: 5, color: "white" },
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