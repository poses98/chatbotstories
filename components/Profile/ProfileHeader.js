import * as React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import A from 'react-native-a';
import Button from '../Button';

export default ({
  profilePic,
  name,
  web,
  description,
  posts,
  followers,
  following,
  image,
  navigation,
  ...data
}) => {
  const EditProfileButton = () => {
    return (
      <Button
        text="Edit profile"
        textStyle={{ fontWeight: 'bold' }}
        onPress={() => {
          navigation.navigate('ProfileEdit');
        }}
        buttonStyle={{ marginTop: 10 }}
      />
    );
  };

  return (
    <View style={styles.profileInfo}>
      {/* Header profile */}
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Image
          style={styles.profilePic}
          source={
            image
              ? { uri: image }
              : require('../../assets/profilepicplaceholder.png')
          }
        />
      </View>
      <View style={styles.itemContainer}>
        <View style={styles.infoBox}>
          <Text style={styles.numberInfo}>{posts}</Text>
          <Text style={styles.textInfo}>Stories</Text>
        </View>
        <View style={styles.infoBox}>
          <Text style={styles.numberInfo}>{followers}</Text>
          <Text style={styles.textInfo}>Followers</Text>
        </View>
        <View style={styles.infoBox}>
          <Text style={styles.numberInfo}>{following}</Text>
          <Text style={styles.textInfo}>Following</Text>
        </View>
      </View>
      <View style={styles.bioBox}>
        {/* Profile name  */}
        <Text style={styles.profileName}>{name}</Text>
        {/* Web  */}
        {web != '' && (
          <A style={styles.profileWeb} href={web}>
            <Text>{web}</Text>
          </A>
        )}
        {/* Bio  */}
        {description != '' && (
          <Text style={styles.profileDescription}>{description}</Text>
        )}
        <EditProfileButton />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  profileInfo: {
    alignItems: 'stretch',
    flexDirection: 'column',
    marginBottom: 15,
  },
  itemContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    margin: 0,
  },
  profilePic: {
    width: 90,
    height: 90,
    borderRadius: 50,
    marginVertical: 15,
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
    fontSize: 20,
  },
  bioBox: {
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
