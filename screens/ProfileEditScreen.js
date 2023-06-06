import React, { useState, useLayoutEffect, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  Alert,
  Platform,
} from 'react-native';
import LabeledInput from '../components/LabeledInput';
import { CommonActions } from '@react-navigation/native';
import Colors from '../constants/Colors';
import Ionicons from '@expo/vector-icons/Ionicons';
import * as ImagePicker from 'expo-image-picker';
import UserApi from '../api/user';
import useAuth from '../hooks/useAuth';
import { getStorage, ref, uploadBytes } from 'firebase/storage';

export default ({ navigation }) => {
  const { authUser, fetchUser } = useAuth();
  const [hasBeenChanges, setHasBeenChanges] = useState(false);
  const [data, setData] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (authUser) {
      UserApi.getUserById(authUser._id)
        .then((response) => {
          setData(response);
        })
        .catch((err) => {
          console.error(err);
        });
    }
  }, [authUser]);

  useLayoutEffect(() => {
    const renderStackBarIconRight = () => {
      return (
        <View style={{ flexDirection: 'row' }}>
          <TouchableOpacity
            onPress={async () => {
              let usernameAvailable = true;

              if (data.username !== authUser.username) {
                usernameAvailable = await UserApi.checkUsername(data.username);
              }
              if (!usernameAvailable.exists) {
                UserApi.updateUser(authUser._id, data)
                  .then((response) => {
                    fetchUser();
                    uploadImage();
                    navigation.navigate('Profile');
                  })
                  .catch((err) => {
                    console.error(err);
                  });
              } else {
                setErrorMessage('Username is taken');
              }
            }}
            style={{ paddingRight: 5 }}
          >
            <Ionicons name="checkmark-outline" size={26} color={Colors.black} />
          </TouchableOpacity>
        </View>
      );
    };

    const backButtonProfileEdit = () => {
      return (
        <View style={{ flexDirection: 'row' }}>
          <TouchableOpacity
            onPress={() => {
              if (hasBeenChanges) {
                changesWillNotBeSavedAlert();
              } else {
                navigation.dispatch(CommonActions.goBack());
              }
            }}
            style={{ paddingLeft: 10 }}
          >
            <Ionicons name="close-outline" size={26} color={Colors.black} />
          </TouchableOpacity>
        </View>
      );
    };

    navigation.setOptions({
      headerRight: renderStackBarIconRight,
      headerLeft: backButtonProfileEdit,
      headerRightContainerStyle: {
        paddingRight: 10,
      },
    });
  }, [data, navigation, authUser, hasBeenChanges]);

  const changesWillNotBeSavedAlert = () =>
    Alert.alert(
      'Changes will not be saved',
      'Are you sure?',
      [
        {
          text: 'Cancel',
          onPress: () => console.log('Cancel Pressed'),
          style: 'cancel',
        },
        {
          text: 'OK',
          onPress: () => {
            navigation.dispatch(CommonActions.goBack());
          },
        },
      ],
      { cancelable: true }
    );

  useEffect(() => {
    (async () => {
      if (Platform.OS !== 'web') {
        const { status } =
          await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
          alert('Sorry, we need camera roll permissions to make this work!');
        }
      }
    })();
  }, []);

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.1,
      allowsMultipleSelection: false,
    });

    if (!result.cancelled) {
      setData({ ...data, image: result.uri });
      setHasBeenChanges(true);
    }
  };

  const uploadImage = () => {
    uploadImageAsync(data.image, authUser._id);
    navigation.dispatch(CommonActions.goBack());
  };

  async function uploadImageAsync(uri, name) {
    const blob = await new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.onload = function () {
        resolve(xhr.response);
      };
      xhr.onerror = function (e) {
        console.log(e);
        reject(new TypeError('Network request failed'));
      };
      xhr.responseType = 'blob';
      xhr.open('GET', uri, true);
      xhr.send(null);
    });
    const storage = getStorage();
    const ref = ref(storage, 'profilePictures/' + name);
    console.log(ref);
    const snapshot = await uploadBytes(ref, blob);

    console.log('state: ' + snapshot.state);

    blob.close();

    return await snapshot.ref.getDownloadURL();
  }

  return (
    <ScrollView style={styles.container}>
      {!loading && data && (
        <View>
          <Image
            style={styles.profilePic}
            source={
              data.image
                ? { uri: data.image }
                : require('../assets/profilepicplaceholder.png')
            }
          />
          <TouchableOpacity onPress={pickImage}>
            <Text style={styles.changeProfilePicText}>
              Change profile picture
            </Text>
          </TouchableOpacity>
          <LabeledInput
            label="Name"
            text={data.name}
            onChangeText={(text) => {
              setData({ ...data, name: text });
              setHasBeenChanges(true);
            }}
            autoCompleteType={'name'}
            placeholder="Your name"
            maxLength={30}
            defaultValue={data.name}
          />
          <LabeledInput
            label="Username"
            text={data.username}
            errorMessage={errorMessage}
            onChangeText={(text) => {
              setData({ ...data, username: text });
              setHasBeenChanges(true);
            }}
            placeholder="Your username"
            maxLength={20}
            autoCapitalize="none"
            value={data.username}
          />
          <LabeledInput
            label="Website"
            text={data.website}
            onChangeText={(text) => {
              setData({ ...data, website: text });
              setHasBeenChanges(true);
            }}
            placeholder="Your personal or professional website"
            maxLength={60}
            autoCapitalize="none"
            value={data.website}
          />
          <LabeledInput
            label={`Description ${
              data.description ? data.description.length : 0
            }/200`}
            text={data.description}
            onChangeText={(text) => {
              setData({ ...data, description: text });
              setHasBeenChanges(true);
            }}
            placeholder="Present yourself to other people"
            maxLength={200}
            value={data.description}
            multiline={true}
            numberOfLines={6}
            maxHeight={120}
            inputStyle={{ padding: 7.9, textAlignVertical: 'top' }}
          />
          {/* Rest of the code remains the same */}
        </View>
      )}
      {loading && (
        <View
          style={{
            flex: 1,
            backgroundColor: '#fff',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <Image
            source={require('../assets/loading.gif')}
            style={{ width: 100, height: 100 }}
          />
        </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  profilePic: {
    width: 90,
    height: 90,
    borderRadius: 50,
    alignItems: 'center',
    alignSelf: 'center',
    marginVertical: 15,
  },
  changeProfilePicText: {
    alignSelf: 'center',
    color: Colors.blue,
    fontSize: 16,
    marginBottom: 15,
  },
  icon: {
    padding: 5,
    fontSize: 24,
  },
  centeredView: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 50,
  },
  modalView: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  infoBox: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  textInfo: {
    fontSize: 14,
    marginTop: 3,
  },
  numberInfo: {
    fontWeight: 'bold',
    fontSize: 18,
  },
  bioBox: {
    flex: 1,
    paddingHorizontal: 15,
    paddingVertical: 5,
  },
  profileName: {
    fontWeight: 'bold',
    fontSize: 15,
  },
  profileWeb: {
    fontSize: 15,
  },
  profileDescription: {
    fontSize: 15,
    justifyContent: 'center',
    alignItems: 'stretch',
  },
});
