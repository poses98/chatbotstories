import React from "react";
import {
  View,
} from "react-native";
import Colors from "../constants/Colors";
import _STATUS_ from "../constants/StoryStatus";
import Button from "../components/Button";
import { Label } from "../components/Label";

/**
 * 
 * @param {state} status - state variable for selector
 * @param {function} updateStatus - function to update the status 
 * @returns 
 */
export const StatusSelector = ({status,updateStatus,text}) => {
    return(
      <View>
      <View style={{ flexDirection: "column", marginTop: 0 }}>
        <Label text={text} icon="list-outline" />
        <Button
          text={_STATUS_[0].verboseName}
          textStyle={{ fontWeight: "bold", textTransform:"uppercase" }}
          onPress={() => {
            updateStatus(_STATUS_[0].statusId);
            console.log(
              "State of the story has changed: ",
              _STATUS_[0].verboseName
            );
          }}
          buttonStyle={{
            flex: 0.5,
            marginTop: 15,
            marginHorizontal: 15,
            height: 45,
            backgroundColor:
              status === _STATUS_[0].statusId
                ? Colors.yellow
                : "transparent",
            borderColor:
              status === _STATUS_[0].statusId ? "#fafafa" : Colors.gray,
          }}
          textStyle={{
            color:
              status === _STATUS_[0].statusId ? "#fafafa" : Colors.gray,
          }}
        />
        <Button
          text={_STATUS_[1].verboseName}
          textStyle={{ fontWeight: "bold" }}
          onPress={() => {
            updateStatus(_STATUS_[1].statusId);
            console.log(
              "State of the story has changed: ",
              _STATUS_[1].verboseName
            );
          }}
          buttonStyle={{
            flex: 0.5,
            marginTop: 15,
            marginHorizontal: 15,
            height: 45,
            backgroundColor:
              status === _STATUS_[1].statusId
                ? Colors.red
                : "transparent",
            borderColor:
              status === _STATUS_[1].statusId ? "#fafafa" : Colors.gray,
          }}
          textStyle={{
            color:
              status === _STATUS_[1].statusId ? "#fafafa" : Colors.gray,
          }}
        />
        <Button
          text={_STATUS_[2].verboseName}
          textStyle={{ fontWeight: "bold" }}
          onPress={() => {
            updateStatus(_STATUS_[2].statusId);
            console.log(
              "State of the story has changed: ",
              _STATUS_[2].verboseName
            );
          }}
          buttonStyle={{
            flex: 0.5,
            marginTop: 15,
            marginHorizontal: 15,
            height: 45,
            backgroundColor:
              status === _STATUS_[2].statusId
                ? Colors.green
                : "transparent",
            borderColor:
              status === _STATUS_[2].statusId ? "#fafafa" : Colors.gray,
          }}
          textStyle={{
            color:
              status === _STATUS_[2].statusId ? "#fafafa" : Colors.gray,
          }}
        />
      </View>
    </View>
    )
  }