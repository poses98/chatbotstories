import { CommonActions } from '@react-navigation/native';
import React, { useState } from 'react';
import { StyleSheet, View, Switch } from 'react-native';
import Colors from '../constants/Colors';
import ColorSelector from '../components/ColorSelector';
import Button from '../components/Button';
import { Label } from '../components/Label';
import LabeledInput from '../components/LabeledInput';
const colorList = [
  'blue',
  'green',
  'olive',
  'yellow',
  'orange',
  'red',
  'pink',
  'purple',
];

export default ({ navigation, route }) => {
  const [name, setName] = useState(route.params.characterName || '');
  const [color, setColor] = useState(
    route.params.characterColor || Colors.blue
  );
  const [main, setMain] = useState(route.params.isMain || false);
  const [canBeMain, setCanBeMain] = useState(route.params.canBeMain || false);
  const [characterId, setCharacterId] = useState(route.params.characterId);
  const [isEditMode, setIsEditMode] = useState(
    route.params.characterId ? true : false
  );
  const [isValid, setValidity] = useState(true);

  return (
    <View style={styles.container}>
      <View>
        <Label
          text="Character name"
          icon="person-outline"
          labelStyle={{ marginTop: 15 }}
        />
        <LabeledInput
          label=""
          text={name}
          onChangeText={(text) => {
            setName(text);
            console.log(name.length);
          }}
          errorMessage="* Character Name cannot be empty"
          placeholder="Name"
          maxLength={30}
          inputStyle={{ color: Colors.black, marginBottom: 15 }}
        />
        <Label text="Is the main character?" icon="body-outline" />
        <Switch
          trackColor={{ false: '#767577', true: '#2ecc71' }}
          thumbColor={main ? '#f4f3f4' : '#f4f3f4'}
          ios_backgroundColor="#3e3e3e"
          disabled={!canBeMain && !main}
          onValueChange={() => {
            setMain(!main);
            setCanBeMain(!canBeMain);
          }}
          value={main}
        />
        <Label text="Select color" icon="color-palette-outline" />
        <ColorSelector
          onSelect={(color) => {
            setColor(color);
            navigation.dispatch(CommonActions.setParams({ color }));
          }}
          selectedColor={color}
          colorOptions={colorList}
        />
      </View>
      <Button
        text="Save"
        onPress={() => {
          console.log('Saving changes...');
          if (name.length > 1) {
            if (isEditMode) {
              const id = characterId;
              route.params.saveChanges({ id, name, color, main });
            } else {
              route.params.saveChanges({ name, color, main });
            }
            navigation.dispatch(CommonActions.goBack());
          } else {
            console.log('ERROR: Name length < 1');
            setValidity(false);
          }
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 5,
    justifyContent: 'space-between',
  },
  input: {
    color: Colors.darkGray,
    borderBottomColor: Colors.lightGray,
    borderBottomWidth: 0.5,
    marginHorizontal: 5,
    padding: 3,
    height: 30,
  },
  saveButton: {
    borderRadius: 25,
    backgroundColor: Colors.darkGray,
    height: 48,
    margin: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  label: {
    color: Colors.black,
    marginBottom: 8,
  },
});
