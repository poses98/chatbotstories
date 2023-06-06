import React, { useState } from 'react';
import {
  Modal,
  View,
  ScrollView,
  StyleSheet,
  Button,
  Dimensions,
  Platform,
  TouchableWithoutFeedback,
  KeyboardAvoidingView,
} from 'react-native';

const CustomModal = ({ visible, onClose, children }) => {
  const { height } = Dimensions.get('window');
  const modalHeight = height / 2;
  const handleCloseModal = () => {
    if (visible) {
      onClose();
    }
  };
  return (
    <Modal visible={visible} animationType="slide" transparent>
      <ScrollView contentContainerStyle={[styles.container]} onPress={onClose}>
        <TouchableWithoutFeedback onPress={handleCloseModal}>
          <View style={[styles.modalTop, { height: modalHeight }]}></View>
        </TouchableWithoutFeedback>
        <KeyboardAvoidingView
          style={[
            styles.modalContent,
            { minHeight: modalHeight, maxHeight: height - 200 },
          ]}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          keyboardVerticalOffset={Platform.OS === 'ios' ? 80 : 0}
        >
          {children}
        </KeyboardAvoidingView>
      </ScrollView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.0)',
  },
  modalContent: {
    backgroundColor: '#FFF',
    padding: 16,
    position: 'absolute',
    bottom: 0,
    borderRadius: 20,
    width: '100%',
    alignItems: 'center',
    ...Platform.select({
      ios: {
        shadowColor: 'black',
        shadowOffset: { width: 0, height: -2 },
        shadowOpacity: 0.25,
        shadowRadius: 4,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  modalTop: {
    backgroundColor: 'transparent',
    padding: 16,
    position: 'absolute',
    top: 0,
    borderRadius: 20,
    width: '100%',
    alignItems: 'center',
  },
});

export default CustomModal;
