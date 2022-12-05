import * as React from 'react';
import { useState, useEffect } from 'react';
import { Text, View, Button, Dimensions, Image } from 'react-native';
import { SearchBar } from 'react-native-elements';

import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Octicons } from '@expo/vector-icons';

import FeedPage from './components/feedPage.js';
import ProfilePage from './components/profilePage.js';
import pfp from './assets/pfp.png';

import auth from './firebase.js';
import LoginPage from './components/loginPage.js'
import MainAppBuild from './components/mainApp.js';

import { initializeApp } from 'firebase/app';
import { initializeAuth } from 'firebase/auth';
import { getReactNativePersistence } from 'firebase/auth/react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import firebaseConfig from './firebase.js';


/*
const app = initializeApp(firebaseConfig);
initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage)
})
*/

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <NavigationContainer
      independent="true"
    >
      <Stack.Navigator>
        <Stack.Screen
          name="Login/Register"
          component={LoginScreen}
        />
        <Stack.Screen
          name="Main_App"
          component={AppMain}
        />
      </Stack.Navigator>
    </NavigationContainer> 
  );
};

/*
   <View>
    <LoginPage/>
   </View>
*/

//Concept for profile button
/*
  <Stack.Navigator>
        <Stack.Screen
          name="Profile"
          component={Profile}
        />
        <Stack.Screen
          name="Settings"
          component={Settings}
        />
      </Stack.Navigator>
*/

const LoginScreen = ({ navigation }) => {
  return (
    <View>
      <Button
        title="to Main"
        onPress={() => navigation.navigate("Main_App")}
      />
      <LoginPage/>
    </View>
  )
}

const AppMain = ({ navigation }) => {
  return (
    <View>
      <MainAppBuild/>
    </View>
  )
}

//Not sure where to put this at the moment
const Settings = ({ navigation }) => {
  return(
    <View>
      <Text>
        This is the settings page.
      </Text>
      <Button>
        Sign Out
      </Button>
    </View>
  )
}