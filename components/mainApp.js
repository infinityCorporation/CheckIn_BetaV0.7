import * as React from 'react';
import { Text, View, Button, Dimensions, Image } from 'react-native';
import { SearchBar } from 'react-native-elements';

import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Octicons } from '@expo/vector-icons';

import { useState } from 'react';

import FeedPage from './feedPage';
import ProfilePage from './profilePage';

const Tab = createBottomTabNavigator();

const windowHeight = Dimensions.get('window').height;
const windowWidth = Dimensions.get('window').width;
const postViewSize = windowWidth + 100;
const postViewSizeWidth = windowWidth - 25;
const postSquareDimensions = windowWidth - 29.5;
const usernameTop = windowWidth - 25;
const descriptionTop = windowWidth + 7.5;
const likesTop = descriptionTop - 30;

export default function MainAppBuild() {
    return (
        <NavigationContainer
            independent = "true"
        >
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
                tabBarActiveTintColor: 'black',
                tabBarInactiveTintColor: 'grey',
            })}
            >
                <Tab.Screen 
                    name="Feed"
                    component={MainFeed}/>
                <Tab.Screen
                    name="Search"
                    component={Search}/>
                <Tab.Screen
                    name="Profile"
                    component={Profile}/>
            </Tab.Navigator> 
        </NavigationContainer>
    )
}

const MainFeed = ({ navigation }) => {
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