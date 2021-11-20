import React, { useState } from "react";
import { StyleSheet, Text, View, TouchableOpacity, KeyboardAvoidingView, ScrollView } from "react-native";
import Button from "../components/Button";
import LabeledInput from "../components/LabeledInput";
import Colors from "../constants/Colors";
import validator from "validator";
import { auth, firestore } from "firebase"
import * as Analytics from 'expo-firebase-analytics';

const validateFields = (email, password) => {
    const isValid = {
        email: validator.isEmail(email),
        password: validator.isStrongPassword(password, {
            minLength: 8,
            minLowercase: 1,
            minUppercase: 1,
            minNumbers: 1
        })
    }

    return isValid;
}


const login = (email, password) => {
    auth().signInWithEmailAndPassword(email, password)
        .then(() => {
            console.log("login user...")
        })

}




export default () => {
    const [isCreateMode, setCreateMode] = useState(false)
    const [emailField, setEmailField] = useState({
        text: "",
        errorMessage: ""
    })
    const [passwordField, setPasswordField] = useState({
        text: "",
        errorMessage: ""
    })
    const [passwordConfirmationField, setPasswordConfirmationField] = useState({
        text: "",
        errorMessage: ""
    })
    const [name, setName] = useState({
        text: "",
        errorMessage: ""
    })
    const [userName, setUserName] = useState({
        text: "",
        errorMessage: ""
    })
    const createAccount = (email, password, data) => {

        const userRef = firestore().collection('usernames')
        userRef.doc(data.username.toLowerCase()).get().then((doc) => {
            let available = false;
            if (doc.exists) {
                available = false
            } else {
                available = true;
            }
    
            if (available) {
                auth().createUserWithEmailAndPassword(email, password)
                .then(({ user }) => {
                    firestore().
                        collection('users').
                        doc(user.uid).
                        set(data);
                    firestore().
                        collection('usernames').
                        doc(data.username.toLowerCase()).
                        set({ uid: auth().currentUser.uid });
                })
            } else {
                userName.errorMessage = "Username not available :(";
                setUserName({ ...userName });
            }
        }).catch((error) => {
            console.log("Error getting document:", error);
        });
    
       
    }
    return (

        <ScrollView style={{ flex: 1, flexDirection: 'column' }}>
            <View style={styles.container}>
                {/* Header */}
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
                                    setName({ text })
                                }}
                                errorMessage={name.errorMessage}
                                labelStyle={styles.label}
                                autoCompleteType={"name"}
                            />
                            <LabeledInput
                                label="Username"
                                text={userName.text}
                                onChangeText={(text) => {
                                    setUserName({ text })
                                }}
                                errorMessage={userName.errorMessage}
                                labelStyle={styles.label}
                                autoCompleteType={"username"}
                            />
                        </View>
                    )}
                    {/* Email input */}
                    <LabeledInput
                        label="Email"
                        text={emailField.text}
                        onChangeText={(text) => {
                            setEmailField({ text })
                        }}
                        errorMessage={emailField.errorMessage}
                        labelStyle={styles.label}
                        autoCompleteType={"email"}
                        autoCapitalize="none"
                    />
                    {/* Password input */}
                    <LabeledInput
                        label="Contraseña"
                        text={passwordField.text}
                        onChangeText={(text) => {
                            setPasswordField({ text })
                        }}
                        secureTextEntry={true}
                        errorMessage={passwordField.errorMessage}
                        labelStyle={styles.label}
                        autoCompleteType={"password"}
                    />
                    {/* Password confirmation input */}
                    {isCreateMode && (<View>
                        <LabeledInput
                            label="Confirma la contraseña"
                            text={passwordConfirmationField.text}
                            onChangeText={(text) => {
                                setPasswordConfirmationField({ text })
                            }}
                            secureTextEntry={true}
                            errorMessage={passwordConfirmationField.errorMessage}
                            labelStyle={styles.label}
                            autoCompleteType={"password"}
                        />

                    </View>
                    )}
                    {/* Login Toggle */}
                    <TouchableOpacity
                        onPress={() => {
                            setCreateMode(!isCreateMode);
                        }}
                    >
                        <Text
                            style={{
                                alignSelf: "center",
                                color: Colors.blue,
                                fontSize: 16,
                            }}
                        >
                            {isCreateMode
                                ? "¿Ya tienes una cuenta?"
                                : "Crear una cuenta"}
                        </Text>
                    </TouchableOpacity>
                </View>
                <KeyboardAvoidingView style={styles.bottomBar} behavior="height" enabled>
                    {/* Login button / Create account */}
                    <Button
                        text={isCreateMode ? "Crear cuenta" : "Iniciar sesión"}
                        textStyle={{ color: "white", textTransform: 'uppercase' }}
                        buttonStyle={{ backgroundColor: Colors.blue }}
                        onPress={() => {
                            const isValid = validateFields(
                                emailField.text,
                                passwordField.text
                            );
                            let isAllValid = true;
                            if (!isValid.email) {
                                emailField.errorMessage = "Introduce un email válido";
                                setEmailField({ ...emailField });
                                isAllValid = false;
                            }
                            if (!isValid.password) {
                                passwordField.errorMessage = "Introduce una contraseña con al menos 8 caracteres con mayúsculas, minísculas y números";
                                setPasswordField({ ...passwordField });
                                isAllValid = false;
                            }
                            if (isCreateMode && passwordConfirmationField.text != passwordField.text) {
                                passwordConfirmationField.errorMessage = "Las contraseñas no coinciden"
                                setPasswordConfirmationField({ ...passwordConfirmationField })
                                isAllValid = false;
                            }
                            if (isAllValid) {
                                const data = { name: name.text, username: userName.text, description: "", website: "" }
                                isCreateMode ? createAccount(emailField.text, passwordField.text, data) : login(emailField.text, passwordField.text);
                            }
                        }}
                    />
                </KeyboardAvoidingView>
            </View>
        </ScrollView>

    )
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
        justifyContent: "space-between",
        alignItems: "stretch",
    },
    label: {
        fontSize: 16,
        color: Colors.black,
        marginLeft: 15
    },
    header: {
        fontSize: 35,
        color: "#fff",
        marginVertical: 15
    },
    headerBox: {
        flex: 0.5,
        alignSelf: "center",
        flexDirection: "column-reverse",
        alignItems: "center",
        backgroundColor: Colors.blue,
        alignSelf: "stretch",
    },
    form: {
        flex: 0.5,
        flexDirection: "column",
        marginVertical: 15
    },
    bottomBar: {
        flex: 0.3,
        flexDirection: "column-reverse",
    }

});