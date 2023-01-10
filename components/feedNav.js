import * as React from 'react';
import { View } from 'react-native';

import FeedPage from './feedPage.js';
import AddPage from './addPage.js';

import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

const Stack = createNativeStackNavigator();

const FeedNav = ({ navigation }) => {
    return(
            <Stack.Navigator>
                <Stack.Screen
                    name="FeedPage"
                    component={FeedPage}
                    options={{
                        headerShown: false
                    }}
                />
                <Stack.Screen
                    name="AddPost"
                    component={AddPage}
                    options={{
                        headerShown: false
                    }}
                />
            </Stack.Navigator>
    )
}

export default FeedNav;