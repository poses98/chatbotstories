import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  KeyboardAvoidingView,
  ScrollView,
} from 'react-native';
import Button from '../components/Button';
import LabeledInput from '../components/LabeledInput';
import Colors from '../constants/Colors';
import validator from 'validator';
import {
  GoogleAuthProvider,
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from 'firebase/auth';
import UserApi from '../api/user';
import useFirebase from '../hooks/useFirebase';
import { useNavigation, StackActions } from '@react-navigation/native';

const validateFields = (email, password) => {
  const isValid = {
    email: validator.isEmail(email),
    password: validator.isStrongPassword(password, {
      minLength: 8,
      minLowercase: 1,
      minUppercase: 1,
      minNumbers: 1,
    }),
  };

  return isValid;
};

export default () => {
  const auth = getAuth();
  const { user, isLoading } = useFirebase();
  const navigation = useNavigation();

  const [isCreateMode, setCreateMode] = useState(false);
  const [emailField, setEmailField] = useState({
    text: '',
    errorMessage: '',
  });
  const [passwordField, setPasswordField] = useState({
    text: '',
    errorMessage: '',
  });
  const [passwordConfirmationField, setPasswordConfirmationField] = useState({
    text: '',
    errorMessage: '',
  });
  const [name, setName] = useState({
    text: '',
    errorMessage: '',
  });
  const [userName, setUserName] = useState({
    text: '',
    errorMessage: '',
  });

  useEffect(() => {
    if (!isLoading && user) {
      navigation.dispatch(StackActions.replace('Home'));
    }
  }, [user, isLoading]);
  const login = (email, password) => {
    const data = {
      name: name.text,
      username: userName.text,
      description: '',
      website: '',
    };
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        const user = userCredential.user;
      })
      .catch((e) => {
        console.error(e);
        setPasswordField({ errorMessage: e.message });
      });
  };
  const createAccount = (email, password, data) => {
    // sign up firebase
    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        // Signed in
        const user = userCredential.user;
        // create account API
        UserApi.createUser(data)
          .then((response) => {
            console.log('Response');
            console.log(response);
          })
          .catch((e) => {
            console.error(e);
          });
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.error(errorMessage);
      });
  };

  const handleSubmit = () => {
    const isValid = validateFields(emailField.text, passwordField.text);
    let isAllValid = true;
    if (!isValid.email) {
      setEmailField({
        ...emailField,
        errorMessage: 'Introduce un email válido',
      });
      isAllValid = false;
    }
    if (!isValid.password) {
      setPasswordField({
        ...passwordField,
        errorMessage:
          'Introduce una contraseña con al menos 8 caracteres con mayúsculas, minísculas y números',
      });
      isAllValid = false;
    }
    if (isCreateMode && passwordConfirmationField.text != passwordField.text) {
      passwordConfirmationField.errorMessage = 'Las contraseñas no coinciden';
      setPasswordConfirmationField({
        ...passwordConfirmationField,
      });
      isAllValid = false;
    }
    if (isAllValid) {
      const data = {
        name: name.text,
        username: userName.text,
        description: '',
        website: '',
      };
      isCreateMode
        ? createAccount(emailField.text, passwordField.text, data)
        : login(emailField.text, passwordField.text);
    }
  };
  return (
    <ScrollView style={{ flex: 1, flexDirection: 'column' }}>
      <View style={styles.container}>
        <View style={styles.headerBox}>
          <Text style={styles.header}>Bookster</Text>
        </View>
        <View style={styles.form}>
          {isCreateMode && (
            <View>
              <LabeledInput
                label="Name"
                text={name.text}
                onChangeText={(text) => {
                  setName({ text });
                }}
                errorMessage={name.errorMessage}
                labelStyle={styles.label}
                autoCompleteType={'name'}
              />
              <LabeledInput
                label="Username"
                text={userName.text}
                onChangeText={(text) => {
                  setUserName({ text });
                }}
                errorMessage={userName.errorMessage}
                labelStyle={styles.label}
                autoCompleteType={'username'}
              />
            </View>
          )}

          <LabeledInput
            label="Email"
            text={emailField.text}
            onChangeText={(text) => {
              setEmailField({ text });
            }}
            errorMessage={emailField.errorMessage}
            labelStyle={styles.label}
            autoCompleteType={'email'}
            autoCapitalize="none"
          />
          <LabeledInput
            label="Contraseña"
            text={passwordField.text}
            onChangeText={(text) => {
              setPasswordField({ text });
            }}
            secureTextEntry={true}
            errorMessage={passwordField.errorMessage}
            labelStyle={styles.label}
            autoCompleteType={'password'}
          />
          {isCreateMode && (
            <View>
              <LabeledInput
                label="Confirma la contraseña"
                text={passwordConfirmationField.text}
                onChangeText={(text) => {
                  setPasswordConfirmationField({ text });
                }}
                secureTextEntry={true}
                errorMessage={passwordConfirmationField.errorMessage}
                labelStyle={styles.label}
                autoCompleteType={'password'}
              />
            </View>
          )}
          <TouchableOpacity
            onPress={() => {
              setCreateMode(!isCreateMode);
            }}
          >
            <Text
              style={{
                alignSelf: 'center',
                color: Colors.blue,
                fontSize: 16,
              }}
            >
              {isCreateMode ? '¿Ya tienes una cuenta?' : 'Crear una cuenta'}
            </Text>
          </TouchableOpacity>
        </View>
        <KeyboardAvoidingView
          style={styles.bottomBar}
          behavior="height"
          enabled
        >
          <Button
            text={isCreateMode ? 'Crear cuenta' : 'Iniciar sesión'}
            textStyle={{ color: 'white', textTransform: 'uppercase' }}
            buttonStyle={{ backgroundColor: Colors.blue }}
            onPress={() => {
              handleSubmit();
            }}
          />
        </KeyboardAvoidingView>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'space-between',
    alignItems: 'stretch',
  },
  label: {
    fontSize: 16,
    color: Colors.black,
    marginLeft: 15,
  },
  header: {
    fontSize: 35,
    color: '#fff',
    marginVertical: 15,
  },
  headerBox: {
    flex: 0.5,
    alignSelf: 'center',
    flexDirection: 'column-reverse',
    alignItems: 'center',
    backgroundColor: Colors.blue,
    alignSelf: 'stretch',
  },
  form: {
    flex: 0.5,
    flexDirection: 'column',
    marginVertical: 15,
  },
  bottomBar: {
    flex: 0.3,
    flexDirection: 'column-reverse',
  },
});
