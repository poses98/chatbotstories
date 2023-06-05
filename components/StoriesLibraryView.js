import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import Colors from '../constants/Colors';
import StoryContainerLibrary from './StoryContainerLibrary';

export default function StoriesLibraryView({
  libraryTitle,
  storyList,
  navigation,
}) {
  return (
    <View>
      <Text style={styles.title}>{libraryTitle}</Text>
      <ScrollView horizontal>
        <View style={{ flexDirection: 'row' }}>
          {storyList.map((story) => {
            const {
              interactive,
              title,
              description,
              _id,
              date,
              genre,
              author,
              likes,
            } = story;
            return (
              <StoryContainerLibrary
                key={_id}
                interactive={interactive}
                title={title}
                description={description}
                id={_id}
                genre={genre}
                date={date}
                onPress={() => {
                  navigation.navigate('StoryInfo', {
                    title,
                    storyId: _id,
                    username: author,
                  });
                }}
                likes={likes.count}
              />
            );
          })}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: 24,
    fontWeight: '200',
    margin: 6,
    width: '70%',
    color: Colors.gray,
  },
});
