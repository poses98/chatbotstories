import React, { useLayoutEffect, useState } from 'react';
import { View, TouchableOpacity, StyleSheet, Text } from 'react-native';
import Ionicons from "@expo/vector-icons/Ionicons"
import Colors from '../constants/Colors';

export default ({navigation}) => {

    const renderStackBarIconRight = () => {
        return (
            <View style={{ flexDirection: "row" }}>
                
                <TouchableOpacity
                    onPress={() => { }}
                    style={{ paddingRight: 5 }}>
                    <Ionicons name="log-out-outline" size={26} color={Colors.black} />
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
            <Text>Notifications screen</Text>
        </View>
    )
}