import * as React from 'react';
import { Button, Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { DiscoverScreen, HomeScreen, ProfileScreen, NotificationsScreen, CreateScreen } from "../screens"
import Ionicons from "@expo/vector-icons/Ionicons"


const HomeStack = createStackNavigator();

const HomeStackScreen = () => {
    return (
        <HomeStack.Navigator>
            <HomeStack.Screen name="Home" component={HomeScreen} />
        </HomeStack.Navigator>
    );
}

const DiscoverStack = createStackNavigator();

const DiscoverStackScreen = () => {
    return (
        <DiscoverStack.Navigator>
            <DiscoverStack.Screen name="Discover" component={DiscoverScreen} />
        </DiscoverStack.Navigator>
    );
}


const CreateStack = createStackNavigator();

const CreateStackScreen = () => {
    return (
        <CreateStack.Navigator>
            <CreateStack.Screen name="Create" component={CreateScreen} />
        </CreateStack.Navigator>
    );
}

const NotificationsStack = createStackNavigator();

const NotificationsStackScreen = () => {
    return (
        <NotificationsStack.Navigator>
            <NotificationsStack.Screen name="Notifications" component={NotificationsScreen} />
        </NotificationsStack.Navigator>
    );
}

const ProfileStack = createStackNavigator();

const ProfileStackScreen = () => {
    return (
        <ProfileStack.Navigator>
            <ProfileStack.Screen name="Profile" component={ProfileScreen} />
        </ProfileStack.Navigator>
    );
}

const Tab = createBottomTabNavigator();

export default () => {
    return (
        <NavigationContainer>
            <Tab.Navigator
                screenOptions={({ route }) => ({
                    tabBarIcon: ({ focused, color, size }) => {
                        let iconName;

                        if (route.name === 'Home') {
                            iconName = focused ? 'ios-information-circle' : 'ios-information-circle-outline';
                        } else if (route.name === 'Discover') {
                            iconName = focused ? 'ios-list-box' : 'ios-list';
                        } else if (route.name === 'Create') {
                            iconName = focused ? 'ios-list-box' : 'ios-list';
                        } else if (route.name === 'Notifications') {
                            iconName = focused ? 'ios-list-box' : 'ios-list';
                        } else if (route.name === 'Profile') {
                            iconName = focused ? 'ios-list-box' : 'ios-list';
                        }

                        // You can return any component that you like here!
                        return <Ionicons name={iconName} size={size} color={color} />;
                    },
                })}
                tabBarOptions={{
                    activeTintColor: 'tomato',
                    inactiveTintColor: 'gray',
                }}
            >
                <Tab.Screen name="Home" component={HomeStackScreen} />
                <Tab.Screen name="Discover" component={DiscoverStackScreen} />
                <Tab.Screen name="Create" component={CreateStackScreen} />
                <Tab.Screen name="Notifications" component={NotificationsStackScreen} />
                <Tab.Screen name="Profile" component={ProfileStackScreen} />
            </Tab.Navigator>
        </NavigationContainer>
    );
}