import * as React from 'react';
import { NavigationContainer, getFocusedRouteNameFromRoute } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeScreen from '../screens/HomeScreen'
import DiscoverScreen from '../screens/DiscoverScreen'
import CreateScreen from '../screens/CreateScreen'
import NotificationsScreen from '../screens/NotificationsScreen'
import ProfileScreen from '../screens/ProfileScreen'
import ProfileEditScreen from '../screens/ProfileEditScreen'
import Ionicons from "@expo/vector-icons/Ionicons"
import Colors from '../constants/Colors';



const getHeaderTitle = (route) => {
    // If the focused route is not found, we need to assume it's the initial screen
    // This can happen during if there hasn't been any navigation inside the screen
    // In our case, it's "Feed" as that's the first screen inside the navigator
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
            <Tab.Screen name="Create" component={CreateScreen} />
            <Tab.Screen name="Notifications" component={NotificationsScreen} />
            <Tab.Screen name="Profile" component={ProfileScreen} />
        </Tab.Navigator>
    )
}

const HomeStack = createStackNavigator();
export default () => {
    return (
        <NavigationContainer>
            <HomeStack.Navigator>
                <HomeStack.Screen
                    name="Home"
                    component={MainTabNavigation}
                    options={({ route }) => ({
                        headerTitle: getHeaderTitle(route),
                    })} />
                <HomeStack.Screen
                    name="ProfileEdit"
                    component={ProfileEditScreen}
                    options={{ title: "Edit profile" }} />

            </HomeStack.Navigator>
        </NavigationContainer>
    );
}