import React, { useState, useLayoutEffect, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  Alert,
} from 'react-native';
import { CommonActions } from '@react-navigation/native';
import Colors from '../constants/Colors';
import A from 'react-native-a';
import LabeledInput from '../components/LabeledInput';
import Ionicons from '@expo/vector-icons/Ionicons';
import * as ImagePicker from 'expo-image-picker';
import UserApi from '../api/user';
import useAuth from '../hooks/useAuth';

export default ({ navigation }) => {
  const { authUser } = useAuth();
  const [hasBeenChanges, setHasBeenChanges] = useState(false);
  const [data, setData] = useState({
    username: {
      errorMessage: '',
    },
  });
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setloading] = useState(false);
  /**
   * Getting the user data to show in the form
   */
  useEffect(() => {
    if (authUser) {
      setData(authUser);
    }
  }, [authUser]);
  /**
   * This function renders the icons in headerbar
   */
  useLayoutEffect(() => {
    const renderStackBarIconRight = () => {
      return (
        <View style={{ flexDirection: 'row' }}>
          <TouchableOpacity
            onPress={() => {
              data.description = data.description
                ? data.description.replace(/\r?\n|\r/, '').trim()
                : '';
              setData({ ...data });
              /**TODO check if username available */
              UserApi.updateUser(authUser._id, data)
                .then((response) => {
                  /**TODO set authUser? */
                })
                .catch((err) => {
                  /**TODO handle error */
                });
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
  }, []);

  /**
   * This functioin shows an alert box alerting that changes won't be saved
   */
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
  //State variable for the image that will be uploaded to firebase storage
  const [image, setImage] = useState(null);
  //Checking for the media permission
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
      mediaTypes: ImagePicker.MediaTypeOptions.Images, //type of media that is uploading
      allowsEditing: true, //Only android iOS default 1:1
      aspect: [1, 1], //aspect ratio for the pic.
      quality: 0.1, //from 0 to 1 where 1 is max. quality
      allowsMultipleSelection: false,
    });

    console.log(result);

    if (!result.cancelled) {
      setImage(result.uri);
      setHasBeenChanges(true);
    }
  };

  const uploadImage = () => {
    uploadImageAsync(image, auth().currentUser.uid);
    navigation.dispatch(CommonActions.goBack());
  };

  async function uploadImageAsync(uri, name) {
    // Why are we using XMLHttpRequest? See:
    // https://github.com/expo/expo/issues/2402#issuecomment-443726662
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

    const ref = firebase
      .storage()
      .ref()
      .child('profilePictures/' + name);
    const snapshot = await ref.put(blob);

    console.log('state: ' + snapshot.state);
    // update user lastUpdate
    // We're done with the blob, close and release it
    blob.close();

    return await snapshot.ref.getDownloadURL();
  }

  /* async function downloadImage(userId) {
    const ref = firebase
      .storage()
      .ref()
      .child('profilePictures/' + userId);

    await ref
      .getDownloadURL()
      .then(function (url) {
        setImage(url);
        setloading(false);
      })
      .catch(function (error) {
        setloading(false);
        // A full list of error codes is available at
        // https://firebase.google.com/docs/storage/web/handle-errors
        switch (error.code) {
          case 'storage/object-not-found':
            console.log("ERROR GETTING IMAGE: Storage doesn't exist");
            break;

          case 'storage/unauthorized':
            // User doesn't have permission to access the object
            console.log(
              "ERROR GETTING IMAGE: User doesn't have permission to access the file."
            );
            break;

          case 'storage/canceled':
            // User canceled the upload
            console.log('ERROR GETTING IMAGE: User cancelled operation');
            break;

          case 'storage/unknown':
            // Unknown error occurred, inspect the server response
            console.log('ERROR GETTING IMAGE: Unkwon error occurred');
            break;
        }
      });
  } */
  return (
    <ScrollView style={styles.container}>
      {!loading && data && (
        <View>
          <Image
            style={styles.profilePic}
            source={
              image
                ? { uri: image }
                : require('../assets/profilepicplaceholder.png')
            }
          />
          <TouchableOpacity
            onPress={() => {
              pickImage();
            }}
          >
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
