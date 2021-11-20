import React from "react";
import { StyleSheet, View,Image , Text } from "react-native";
import * as Analytics from 'expo-firebase-analytics';


export default () => {
    
    return (
        <View style={styles.container}>
            <Image source={require('../assets/loading.gif')} style={{width:200,height:200}}/>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
        justifyContent: "center",
        alignItems: "center",
    }
})