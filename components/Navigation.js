import * as React from 'react'
import { getFocusedRouteNameFromRoute } from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'

import Ionicons from "@expo/vector-icons/Ionicons"
import Colors from '../constants/Colors'
import HomeScreen from '../screens/HomeScreen'
import DiscoverScreen from '../screens/DiscoverScreen'
import NotificationsScreen from '../screens/NotificationsScreen'
import ProfileScreen from '../screens/ProfileScreen'
import ProfileEditScreen from '../screens/ProfileEditScreen'
import StoryCreateScreen from '../screens/StoryCreateScreen'
import StoryInfoScreen from '../screens/StoryInfoScreen'
import ChapterEditScreen from '../screens/ChapterEditScreen'
import ChapterReadScreen from '../screens/ChapterReadScreen'
import LoginScreen from '../screens/LoginScreen'
import LoadingScreen from '../screens/LoadingScreen'


const getHeaderTitle = (route) => {

    const routeName = getFocusedRouteNameFromRoute(route) ?? 'Feed';

    switch (routeName) {
        case 'Home':
            return 'News feed';
        case 'Profile':
            return 'My profile';
        case 'Notifications':
            return 'Notifications';
        case 'Discover':
            return 'Discover';
        case 'Create':
            return 'Create new story';
    }
}

const Tab = createBottomTabNavigator();

const MainTabNavigation = () => {
    return (
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
                        size = 40
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
            <Tab.Screen name="Home" component={HomeScreen} />
            <Tab.Screen name="Discover" component={DiscoverScreen} />
            <Tab.Screen name="Create" component={StoryCreateScreen} />
            <Tab.Screen name="Notifications" component={NotificationsScreen} />
            <Tab.Screen name="Profile" component={ProfileScreen} />
        </Tab.Navigator>
    )
}

const LoadingStack = createStackNavigator();
export const LoadingStackScreen = () => {
    return (

        <LoadingStack.Navigator screenOptions={{headerShown: false}}>
            <LoadingStack.Screen name="Loading" component={LoadingScreen} />
            <LoadingStack.Screen name="Home" component={HomeStackScreen} />
            <LoadingStack.Screen name="Login" component={AuthStackScreen} />
        </LoadingStack.Navigator>

    )
}



const AuthStack = createStackNavigator();
export const AuthStackScreen = () => {
    return (

        <AuthStack.Navigator>
            <AuthStack.Screen name="Login" component={LoginScreen} />
        </AuthStack.Navigator>

    )
}


const RootStack = createStackNavigator();
export const RootStackScreen = () => {
    return (
        <RootStack.Navigator>
            <RootStack.Screen
                name="Home"
                component={MainTabNavigation}
                options={({ route }) => ({
                    headerTitle: getHeaderTitle(route),
                })} />
            <RootStack.Screen
                name="ProfileEdit"
                component={ProfileEditScreen}
                options={{ title: "Edit profile" }} />
            <RootStack.Screen
                name="StoryInfo"
                component={StoryInfoScreen}
                options={({ route }) => {
                    return {
                        title: route.params.title,
                    };
                }}
            />
            <RootStack.Screen
                name="StoryCreate"
                component={StoryCreateScreen}
                options={({ route }) => {
                    return {
                        title: "Create story",
                    };
                }}
            />
            <RootStack.Screen
                name="ChapterEdit"
                component={ChapterEditScreen}
                options={({ route }) => {
                    return {
                        title: route.params.title + " chapter creation",
                    };
                }}
            />
        </RootStack.Navigator>

    );
}

