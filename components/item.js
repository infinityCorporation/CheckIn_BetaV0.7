//General React Imports
import * as React from 'react';
import { useState } from 'react';

//React component imports
import { Text, FlatList, View, StyleSheet, Platform, Dimensions, TouchableOpacity } from 'react-native';

//Expo module imports
import { LinearGradient } from 'expo-linear-gradient';
import { Octicons } from '@expo/vector-icons';

const windowWidth = Dimensions.get('window').width;
const postViewSizeWidth = windowWidth - 25;


export default function Item({ likesText, icon, color, item, onPress}) {
    return(
    <View
        style={itemStyle.itemView}
    >
        <Text
            style={itemStyle.itemTextOne}
        >
            {item.username}
        </Text>
        <Text
            style={itemStyle.itemTextTwo}
        >
            {item.content}
        </Text>
        <TouchableOpacity
            style={itemStyle.itemTouchableOpacity}
            onPress={onPress}
        >
            <Octicons
            name={icon} 
            size={20}
            color={color}
            />
        </TouchableOpacity>
        <Text
        style={itemStyle.itemTextThree}
        >
            {likesText}
        </Text>
    </View>
)}

const itemStyle = StyleSheet.create({
    itemView: {
        height: 150,
        width: postViewSizeWidth,
        borderWidth: 3,
        borderColor: 'black',
        borderRadius: 14,
        margin: 6,
        backgroundColor: 'white'
    },
    itemTextOne: {
        position: 'absolute',
        top: 8,
        left: 8,
        fontSize: 18
    },
    itemTextTwo: {
        position: 'absolute',
        top: 40,
        left: 8,
    },
    itemTouchableOpacity: {
        position: 'absolute',
        top: 120,
        right: 22
    },
    itemTextThree: {
        position: 'absolute',
        top: 118,
        right: 8,
        fontSize: 15
    }
});