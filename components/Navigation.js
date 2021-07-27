import * as React from 'react';
import { Button, Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeScreen from '../screens/HomeScreen'
import DiscoverScreen from '../screens/DiscoverScreen'
import CreateScreen from '../screens/CreateScreen'
import NotificationsScreen from '../screens/NotificationsScreen'
import ProfileScreen from '../screens/ProfileScreen'
import Ionicons from "@expo/vector-icons/Ionicons"
import Colors from '../constants/Colors';


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
                            iconName = focused ? 'home' : 'home';
                        } else if (route.name === 'Discover') {
                            iconName = focused ? 'search' : 'search';
                        } else if (route.name === 'Create') {
                            iconName = focused ? 'add-circle-outline' : 'add-circle-outline';
                        } else if (route.name === 'Notifications') {
                            iconName = focused ? 'heart' : 'heart';
                        } else if (route.name === 'Profile') {
                            iconName = focused ? 'person' : 'person';
                        }
                        return <Ionicons name={iconName} size={size} color={color} />;
                    },
                })}
                tabBarOptions={{
                    activeTintColor: Colors.black,
                    inactiveTintColor: Colors.gray,
                    showLabel: false,
                }}
            >
                <Tab.Screen name="Home" component={HomeStackScreen} />
                <Tab.Screen name="Discover" component={DiscoverStackScreen} />
                <Tab.Screen name="Create" component={CreateStackScreen} />
                <Tab.Screen name="Notifications" component={NotificationsStackScreen} options={{tabBarBadge:15}}/>
                <Tab.Screen name="Profile" component={ProfileStackScreen} />
            </Tab.Navigator>
        </NavigationContainer>
    );
}