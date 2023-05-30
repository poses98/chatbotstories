import React, { useState } from 'react';
import { View, FlatList, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import AuthorButtonSelector from './AuthorButtonSelector';

const AuthorSelector = ({
  characterList,
  setSenderId,
  senderId,
  navigation,
  updateCharacterList,
  addCharacterToList,
  getCanBeMain,
}) => {
  const handleCharacterPress = (id) => {
    setSenderId(id);
  };

  const handleCharacterLongPress = (name, color, id, main) => {
    // Perform the necessary logic for a character long press
    // Example: Navigation or any other action
  };

  const handleAddCharacterPress = () => {
    navigation.navigate('CharacterCreation', {
      saveChanges: addCharacterToList,
      canBeMain: getCanBeMain(),
      isMain: false,
    });
  };

  return (
    <View
      style={{
        flexDirection: 'row',
        flex: 1,
        alignItems: 'center',
        paddingBottom: 7,
      }}
    >
      <FlatList
        keyboardDismissMode="on-drag"
        keyboardShouldPersistTaps="always"
        horizontal
        showsHorizontalScrollIndicator={false}
        data={characterList}
        keyExtractor={(item) => item._id.toString()}
        renderItem={({ item }) => (
          <AuthorButtonSelector
            name={item.name}
            color={item.color}
            _id={item._id}
            onPress={() => handleCharacterPress(item._id)}
            onLongPress={() =>
              handleCharacterLongPress(
                item.name,
                item.color,
                item._id,
                item.main
              )
            }
            selectedId={senderId}
          />
        )}
      />
      <TouchableOpacity onPress={handleAddCharacterPress}>
        <Ionicons name="add-circle-outline" size={24} />
      </TouchableOpacity>
    </View>
  );
};

export default AuthorSelector;
