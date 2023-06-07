import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity } from 'react-native';
import Colors from '../constants/Colors';
import Button from './Button';
import ReviewApi from '../api/review';
import useAuth from '../hooks/useAuth';

export default function ReviewForm({ storyId, handleFormSubmit }) {
  const [haveUserLikedStory, setHaveUserLikedStory] = useState(null);
  const [body, setBody] = useState('');
  const { authUser } = useAuth();

  const handleLikeChange = (value) => {
    setHaveUserLikedStory(value);
  };

  const handleBodyChange = (text) => {
    setBody(text);
  };

  const handleSubmit = () => {
    // Perform any necessary actions with the form data
    console.log('Liked Story:', haveUserLikedStory);
    const formatBody = formatBodyText(body);
    const payload = {
      body: formatBody,
      haveUserLikedStory: haveUserLikedStory === 'Yes' ? true : false,
      user: authUser._id,
      story: storyId,
    };
    ReviewApi.createReview(payload)
      .then(() => {
        handleFormSubmit();
      })
      .catch((err) => {
        console.error(err);
      });
  };

  const formatBodyText = (text) => {
    // Replace multiple empty lines with a single empty line
    const formattedText = text.replace(/(\n\s*){2,}/g, '\n\n');

    return formattedText;
  };

  return (
    <View style={{ width: '100%', padding: 20 }}>
      <Text style={{ fontSize: 25, fontWeight: '300', color: Colors.darkGray }}>
        Submit review
      </Text>
      <View
        style={{
          flex: 1,
          flexDirection: 'row',
          justifyContent: 'space-evenly',
          marginTop: 25,
        }}
      >
        <Text style={{ flex: 1, alignSelf: 'flex-start' }}>
          Did you like the story?
        </Text>
        <View
          style={{
            flex: 1,
            flexDirection: 'row',
            justifyContent: 'space-around',
          }}
        >
          <TouchableOpacity
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              marginRight: 10,
            }}
            onPress={() => handleLikeChange('yes')}
          >
            <View
              style={{
                height: 20,
                width: 20,
                borderRadius: 10,
                marginRight: 5,
                borderWidth: 2,
                borderColor:
                  haveUserLikedStory === 'yes' ? Colors.green : Colors.gray,
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              {haveUserLikedStory === 'yes' && (
                <View
                  style={{
                    height: 12,
                    width: 12,
                    borderRadius: 6,
                    backgroundColor: Colors.green,
                  }}
                />
              )}
            </View>
            <Text>Yes</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={{
              flexDirection: 'row',
              alignItems: 'center',
            }}
            onPress={() => handleLikeChange('no')}
          >
            <View
              style={{
                height: 20,
                width: 20,
                borderRadius: 10,
                borderWidth: 2,
                marginRight: 5,
                borderColor: haveUserLikedStory === 'no' ? Colors.red : 'gray',
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              {haveUserLikedStory === 'no' && (
                <View
                  style={{
                    height: 12,
                    width: 12,
                    borderRadius: 6,
                    backgroundColor: Colors.red,
                  }}
                />
              )}
            </View>
            <Text>No</Text>
          </TouchableOpacity>
        </View>
      </View>
      <Text style={{ marginTop: 25 }}>Explain yourself</Text>
      <TextInput
        style={{
          height: 100,
          backgroundColor: Colors.lightGray,
          borderColor: Colors.gray,
          borderWidth: 0.2,
          borderRadius: 5,
          marginTop: 5,
          padding: 5,
        }}
        multiline
        onChangeText={handleBodyChange}
        value={body}
      />
      <Button
        text={'Submit'}
        onPress={handleSubmit}
        buttonStyle={{
          marginTop: 25,
          borderColor: Colors.gray,
          borderWidth: 1,
        }}
        textStyle={{ textTransform: 'uppercase', fontWeight: '600' }}
      />
    </View>
  );
}
