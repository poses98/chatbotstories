import React, { useState } from 'react';
import { View, TextInput, Button, StyleSheet, Text } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import Colors from '../constants/Colors';

const ChoicesEditor = ({ choices, chapters, onUpdate }) => {
  const [choice1, setChoice1] = useState(choices[0]?.text || '');
  const [choice2, setChoice2] = useState(choices[1]?.text || '');
  const [nextChapter1, setNextChapter1] = useState(
    choices[0]?.nextChapter || ''
  );
  const [nextChapter2, setNextChapter2] = useState(
    choices[1]?.nextChapter || ''
  );

  const handleUpdateChoices = () => {
    const updatedChoices = [
      { text: choice1.trim(), nextChapter: nextChapter1 },
      { text: choice2.trim(), nextChapter: nextChapter2 },
    ];
    onUpdate(updatedChoices);
  };

  const handleClearChoices = () => {
    onUpdate([]);
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.choiceText}
        placeholder="Choice 1"
        value={choice1}
        onChangeText={setChoice1}
      />
      <Picker
        style={styles.picker}
        selectedValue={nextChapter1}
        onValueChange={(value) => setNextChapter1(value)}
      >
        {chapters.map((chapter) => (
          <Picker.Item
            key={chapter._id}
            label={chapter.title}
            value={chapter._id}
          />
        ))}
      </Picker>
      <TextInput
        style={styles.choiceText}
        placeholder="Choice 2"
        value={choice2}
        onChangeText={setChoice2}
      />
      <Picker
        style={styles.picker}
        selectedValue={nextChapter2}
        onValueChange={(value) => setNextChapter2(value)}
      >
        {chapters.map((chapter) => (
          <Picker.Item
            key={chapter._id}
            label={chapter.title}
            value={chapter._id}
          />
        ))}
      </Picker>
      <Button title="Save Choices" onPress={handleUpdateChoices} />
      <Button
        title="Clear choices"
        color={Colors.red}
        onPress={handleClearChoices}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 5,
    paddingBottom: 30,
    width: '100%',
  },
  choiceText: {
    marginBottom: 0,
    borderWidth: 1,
    borderColor: 'gray',
    padding: 8,
    borderRadius: 4,
  },
  picker: {
    marginBottom: 0,
  },
});

export default ChoicesEditor;
