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
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, color, size }) => {
            let iconName;
            
            if (route.name === 'Feed') {
              iconName = focused ? 'home' : 'home';
            } else if (route.name === 'Profile') {
              iconName = focused ? 'person' : 'person';
            } else if (route.name === 'Search') {
              iconName = focused ? 'search' : 'search';
            }

            return <Octicons name={iconName} color={color} size={size} />;
          },
          tabBarActiveTintColor: 'gray',
          tabBarInactiveTintColor: 'gray',
        })}
      >
        <Tab.Screen 
          name="Feed"
          component={Feed}/>
        <Tab.Screen
          name="Search"
          component={Search}/>
        <Tab.Screen
          name="Profile"
          component={Profile}/>
      </Tab.Navigator>
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

const Feed = ({ navigation }) => {
  return (
    <View>
      <FeedPage/>
    </View>
  )
}

const Profile = ({ navigation }) => {
  return (
    <View>
      <ProfilePage/>
    </View>
  )
}

const Search = ({ navigation }) => {
  const [search, setSearch] = useState('');

  const updateText = (search) => {
    setSearch(search)
  }

  return(
    <View>
      <SearchBar
      placeholder="Search..."
      onChangeText={updateText}
      value={search}
      />
    </View>
  )
}

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