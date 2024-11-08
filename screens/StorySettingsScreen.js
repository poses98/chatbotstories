import React, { useLayoutEffect, useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  TouchableOpacity,
  FlatList,
  Switch,
} from 'react-native';
import { StackActions } from '@react-navigation/native';

import Colors from '../constants/Colors';
import GENRES from '../constants/Genres';
import LANGUAGES from '../constants/Languages';
import _STATUS_ from '../constants/StoryStatus';
import Ionicons from '@expo/vector-icons/Ionicons';
import LabeledInput from '../components/LabeledInput';
import { Picker } from '@react-native-picker/picker';
import Button from '../components/Button';
import { Label } from '../components/Label';

export default ({ navigation, route }) => {
  const storyId = route.params.storyId;
  return (
    <ScrollView style={styles.container}>
      <TouchableOpacity
        onPress={() => {
          navigation.navigate('StoryCreate', {
            storyId: storyId,
          });
        }}
        style={styles.settingsButton}
      >
        <Ionicons name="options-outline" size={29} color={Colors.black} />
        <Text style={styles.buttonText}>Story details</Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => {
          navigation.navigate('ChapterList', {
            storyId: storyId,
          });
        }}
        style={styles.settingsButton}
      >
        <Ionicons name="list-outline" size={29} color={Colors.black} />
        <Text style={styles.buttonText}>Chapters</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: 15,
  },

  genrePic: {
    width: 70,
    height: 70,
    borderRadius: 50,
  },
  genreContainer: {
    alignItems: 'center',
    paddingVertical: 5,
    borderRadius: 50,
  },
  labelContainer: {
    flex: 1,
    flexDirection: 'row',
    paddingLeft: 15,
    paddingVertical: 10,
    alignItems: 'center',
  },
  genreText: {
    fontSize: 10,
    marginTop: 5,
    textTransform: 'uppercase',
    color: Colors.black,
    fontWeight: 'bold',
  },
  genrePicSelected: {
    width: 70,
    height: 70,
    borderRadius: 50,
    borderWidth: 3,
    borderColor: Colors.teal,
  },
  settingsButton: {
    flex: 1,
    minHeight: 30,
    paddingHorizontal: 15,
    fontSize: 20,
    marginVertical: 5,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 17,
    fontWeight: 'normal',
    paddingLeft: 15,
  },
});
