import * as React from 'react';
import { useState, useEffect } from 'react';
import { Text, View, Platform, Image, FlatList, Dimensions, } from 'react-native';
import PostOne from '../assets/icon.png'

const windowWidth = Dimensions.get('window').width - 11.5;
const profileHeight = 355;
const flatListHeight = Dimensions.get('window').height - profileHeight;

const DATA = [
    {
      img: PostOne,
      description: "This is my first post."
    },
    {
      img: PostOne,
      description: "This is my second post."
    },
    {
      img: PostOne,
      description: "This is my third post."
    },
    {
      img: PostOne,
      description: "This is my fourth post."
    },
    {
      img: PostOne,
      description: "This is my fifth post."
    },
    {
      img: PostOne,
      description: "This is my sixth post."
    },
    {
      img: PostOne,
      description: "This is my sixth post."
    },
    {
      img: PostOne,
      description: "This is my sixth post."
    },
    {
      img: PostOne,
      description: "This is my sixth post."
    },
    {
      img: PostOne,
      description: "This is my sixth post."
    },
    {
      img: PostOne,
      description: "This is my sixth post."
    }
  ]

export default function ProfilePage() {
    return(
        <View>
            <FlatList
            style={{
                right: 10,
                height: flatListHeight
            }}
            contentContainerStyle={{
                paddingBottom: 50
            }}
            data={DATA}
            renderItem={ ({item}) => 
            <View
            style={{
                height: 100,
                width: windowWidth,
                borderWidth: 2,
                borderRadius: 10,
                margin: 4,
                left: 1,
                backgroundColor: 'white'
            }}>
                <Image
                source={item.img}
                style={{
                height: 96,
                width: 96,
                position: 'absolute',
                top: 2,
                left: 2
                }}/>
                <Text
                style={{
                position: 'absolute',
                left: 108
                }}>
                {item.description}
                </Text>
            </View>
            }
            /> 
        </View>
    )
}