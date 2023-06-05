import React from 'react';
import { View, StyleSheet } from 'react-native';
export default OldBookBackground = () => {
  return (
    <View style={styles.container}>
      <View style={styles.textureOverlay} />
      {/* Add your content here */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9F9F9', // Light shade for the background
  },
  textureOverlay: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.1)', // Adjust the opacity to control the texture intensity
    backgroundImage: 'url("../assets/old_notebook_texture.png")', // Replace with the path to your old book texture image
  },
});
