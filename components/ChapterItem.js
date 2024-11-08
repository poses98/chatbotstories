import React from 'react';
import { View, StyleSheet, Text, TouchableOpacity } from 'react-native';
import Colors from '../constants/Colors';
import Ionicons from '@expo/vector-icons/Ionicons';

export const ChapterItem = ({
  title,
  description,
  index,
  onPress,
  id,
  currentIndex,
  finished,
  list,
  choices,
}) => {
  return (
    <View
      style={{
        borderTopWidth: !list && !(index === 0) ? 0.55 : 0,
        borderColor: Colors.gray,
      }}
    >
      <TouchableOpacity
        onPress={onPress}
        style={[styles.settingsButton]}
        disabled={currentIndex < index && !finished}
      >
        {currentIndex >= index || index === 0 || finished ? (
          <Text
            style={[
              styles.numberText,
              {
                color:
                  currentIndex < index && !finished
                    ? Colors.lightGray
                    : Colors.gray,
              },
            ]}
          >
            {index + 1}
          </Text>
        ) : (
          <Ionicons
            name="lock-closed-outline"
            size={12}
            style={{ color: Colors.red }}
          />
        )}
        <Text
          style={[
            styles.buttonText,
            {
              color:
                currentIndex < index && !finished ? Colors.gray : Colors.black,
              textTransform: 'uppercase',
            },
          ]}
        >
          {title}
        </Text>
        {currentIndex > index ||
          (finished && !list && (
            <View style={{ flex: 1, alignItems: 'flex-end' }}>
              <Text
                style={[
                  styles.numberText,
                  {
                    color: Colors.black,
                    fontSize: 10,
                    backgroundColor: Colors.lightGray,
                    padding: 3,
                    borderRadius: 5,
                  },
                ]}
              >
                READED
              </Text>
            </View>
          ))}
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  icon: {
    padding: 5,
    fontSize: 32,
    color: 'white',
  },
  buttonText: {
    fontSize: 17,
    fontWeight: 300,
    paddingLeft: 15,
  },
  settingsButton: {
    paddingHorizontal: 15,
    fontSize: 20,
    paddingVertical: 15,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  numberText: {
    fontSize: 12,
    color: Colors.lightGray,
  },
});
