import React from "react";
import { moderateScale } from "react-native-size-matters";
import {
  StyleSheet,
  Text,
  View,

} from "react-native";
import Colors from "../constants/Colors";

export const MessageBubble = ({ messageBody, sender, color }) => {
    return (
      <View style={[styles.item, sender ? styles.itemIn : styles.itemOut]}>
        <View style={[styles.balloon, { backgroundColor: sender ? Colors.gray : "#1084ff"}]}>
          {sender && (
            <Text
              style={{
                paddingTop: 0,
                color: color ? color : Colors.green,
                fontWeight: "bold",
              }}
            >
              {sender}
            </Text>
          )}
          <Text style={{ paddingTop: 1, color: "white" }}>{messageBody}</Text>
          
        </View>
      </View>
    );
  };

const styles = StyleSheet.create({
    item: {
      marginVertical: moderateScale(4, 2),
      flexDirection: "row",
    },
    itemIn: {
      alignSelf: "flex-start",
      marginLeft: 10,
    },
    itemOut: {
      alignSelf: "flex-end",
      marginRight: 10,
    },
    balloon: {
      maxWidth: moderateScale(260, 1),
      paddingRight: moderateScale(10, 1),
      paddingLeft: moderateScale(10, 1),
      paddingTop: moderateScale(6, 2),
      paddingBottom: moderateScale(8, 2),
      borderRadius: 20,
    },
    arrowContainer: {
      position: "absolute",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      zIndex: -1,
      flex: 1,
    },
    arrowLeftContainer: {
      justifyContent: "flex-end",
      alignItems: "flex-start",
    },
  
    arrowRightContainer: {
      justifyContent: "flex-end",
      alignItems: "flex-end",
    },
  
    arrowLeft: {
      left: moderateScale(-6, 0.5),
    },
  
    arrowRight: {
      right: moderateScale(-6, 0.5),
    },
    inputContainer: {
        position:"absolute",
        flex:1,
        flexDirection:"column-reverse",
        alignSelf:"baseline"
    }
  });