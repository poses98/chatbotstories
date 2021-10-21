import * as React from "react";
import { getFocusedRouteNameFromRoute } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { View, Text, TouchableOpacity } from "react-native";

import Ionicons from "@expo/vector-icons/Ionicons";
import Colors from "../constants/Colors";

import HomeScreen from "../screens/HomeScreen";
import DiscoverScreen from "../screens/DiscoverScreen";
import SavedStoriesScreen from "../screens/SavedStoriesScreen";
import ProfileScreen from "../screens/ProfileScreen";
import ProfileEditScreen from "../screens/ProfileEditScreen";
import StoryCreateScreen from "../screens/StoryCreateScreen";
import StoryInfoScreen from "../screens/StoryInfoScreen";
import ChapterEditScreen from "../screens/ChapterEditScreen";
import ChapterReadScreen from "../screens/ChapterReadScreen";
import LoginScreen from "../screens/LoginScreen";
import LoadingScreen from "../screens/LoadingScreen";
import StorySettingsScreen from "../screens/StorySettingsScreen";

const getHeaderTitle = (route) => {
  const routeName = getFocusedRouteNameFromRoute(route) ?? "Home";

  switch (routeName) {
    case "Home":
      return "News feed";
    case "Profile":
      return "My profile";
    case "SavedStories":
      return "Saved Stories";
    case "Discover":
      return "Discover";
    case "Create":
      return "Create new story";
  }
};

const getHeaderButton = (route, navigation) => {
  const routeName = getFocusedRouteNameFromRoute(route) ?? "Home";

  switch (routeName) {
    case "Home":
      return <View></View>;
    case "Profile":
      return (
        <View>
          <TouchableOpacity onPress={() => navigation.navigate("StoryCreate")}>
            <Ionicons
              name="add-circle-outline"
              size={26}
              color={Colors.black}
            />
          </TouchableOpacity>
        </View>
      );
    case "SavedStories":
      return (
        <View>
          <Text></Text>
        </View>
      );
    case "Discover":
      return (
        <View>
          <Text></Text>
        </View>
      );
    case "Create":
      return (
        <View>
          <Text></Text>
        </View>
      );
  }
};

const StoriesStack = createStackNavigator();
const StoriesStackScreen = () => {
  return (
    <StoriesStack.Navigator headerMode="none">
      <StoriesStack.Screen name="Create" component={StoryCreateScreen} />
      <StoriesStack.Screen
        name="StoryInfo"
        component={StoryInfoScreen}
        options={({ route }) => {
          return {
            title: route.params.title,
          };
        }}
      />
      <StoriesStack.Screen
        name="ChapterEdit"
        component={ChapterEditScreen}
        options={({ route }) => {
          return {
            title: route.params.title + " chapter creation",
          };
        }}
      />
    </StoriesStack.Navigator>
  );
};

const Tab = createBottomTabNavigator();

const MainTabNavigation = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === "Home") {
            iconName = focused ? "home" : "home";
          } else if (route.name === "Discover") {
            iconName = focused ? "search" : "search";
          } else if (route.name === "Create") {
            iconName = focused ? "add-circle-outline" : "add-circle-outline";
            size = 40;
          } else if (route.name === "SavedStories") {
            iconName = focused ? "heart" : "heart";
          } else if (route.name === "Profile") {
            iconName = focused ? "person" : "person";
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
      <Tab.Screen name="SavedStories" component={SavedStoriesScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
};

const LoadingStack = createStackNavigator();
export const LoadingStackScreen = () => {
  return (
    <LoadingStack.Navigator screenOptions={{ headerShown: false }}>
      <LoadingStack.Screen name="Loading" component={LoadingScreen} />
      <LoadingStack.Screen name="Home" component={HomeStackScreen} />
      <LoadingStack.Screen name="Login" component={AuthStackScreen} />
    </LoadingStack.Navigator>
  );
};

const AuthStack = createStackNavigator();
export const AuthStackScreen = () => {
  return (
    <AuthStack.Navigator>
      <AuthStack.Screen name="Login" component={LoginScreen} />
    </AuthStack.Navigator>
  );
};

const RootStack = createStackNavigator();
export const RootStackScreen = () => {
  return (
    <RootStack.Navigator>
      <RootStack.Screen
        name="Home"
        component={MainTabNavigation}
        options={({ route, navigation }) => ({
          headerTitle: getHeaderTitle(route),
          headerRight: () => getHeaderButton(route, navigation),
          headerRightContainerStyle: {
            paddingRight: 15,
          },
        })}
      />
      <RootStack.Screen
        name="ProfileEdit"
        component={ProfileEditScreen}
        options={{ title: "Edit profile" }}
      />
      <RootStack.Screen
        name="StoryInfo"
        component={StoryInfoScreen}
        options={({ route }) => {
          return {
            title: route.params.title,
            storyId: route.params.storyId,
          };
        }}
      />
      <RootStack.Screen
        name="StoryCreate"
        component={StoryCreateScreen}
        options={({ route }) => {
          return {
            title: "",
          };
        }}
      />

      <RootStack.Screen
        name="StorySettings"
        component={StorySettingsScreen}
        options={({ route }) => {
          return {
            title: "Story settings",
          };
        }}
      />

      <RootStack.Screen
        name="ChapterEdit"
        component={ChapterEditScreen}
        options={({ route }) => {
          return {
            title: "Chapter creation",
          };
        }}
      />
    </RootStack.Navigator>
  );
};
