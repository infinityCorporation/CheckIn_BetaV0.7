import * as React from 'react';
import { useState, useEffect } from 'react';
import { Text, View, Platform, Image, FlatList, Dimensions, } from 'react-native';

import AsyncStorage from '@react-native-async-storage/async-storage';

import pfp from "../assets/pfp.png"

const profileHeight = 355;
const flatListHeight = Dimensions.get('window').height - profileHeight;
const windowHeightFull = Dimensions.get('window').height + 5;
const windowWidth = Dimensions.get('window').width;

export default function ProfilePage() {
  const [loadState, setLoadState] = useState(0);
  const [data, setData] = useState([]);
    
  if (loadState == 0) {
    var request = new XMLHttpRequest();
    request.onreadystatechange = (e) => {
    if (request.readyState !== 4) {
        return;
    }
    if (request.status === 200) {
        console.log('success', request.responseText);
        ResObj = JSON.parse(request.response);
        setData(ResObj);
        setLoadState(2);
    } else {
        console.warn('error');
    }
    };
    request.open('GET', 'https://userend.herokuapp.com/get_user/636ef181373c83c3a85a2edf');
    request.send()
    setLoadState(1)
    return(
      <View>
        <Text>
          Loading...
        </Text>
      </View>
    )
  }

  if ( loadState == 2 ) {
    if ( Platform.OS === 'ios' ) {
      return (
      <View 
      style={{
        backgroundColor: 'lightgrey',
        padding: 8,
        height: windowHeightFull,
        position: 'absolute',
        top: -2
      }}>
        <View
          style={{
            borderBottomWidth: 3,
            borderBottomColor: 'black',
            height: 220,
            left: -8,
            top: -10,
            width: windowWidth,
            backgroundColor: 'white'
          }}>
            <Image
            source={pfp}
            style={{
              height: 100,
              width: 100,
              borderRadius: 65,
              borderColor: 'black',
              borderWidth: 1,
              position: 'absolute',
              top: 35,
              left: 10
            }}
            />
            <Text
            style={{
              position: 'absolute',
              top: 135,
              left: 10,
              fontSize: 18
            }}> 
              {data.name} 
            </Text>
            <Text
            style={{
              position: 'absolute',
              top: 162.5,
              left: 15
            }}> 
              {data.description} 
            </Text>
        </View>
        <View>
        <FlatList
            style={{
                right: 10,
                height: flatListHeight
            }}
            contentContainerStyle={{
                paddingBottom: 50
            }}
            data={data.posts}
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
                <Text
                style={{
                position: 'absolute',
                left: 10
                }}>
                  {item.content}
                </Text>

            </View>
            }
            />
        </View>
      </View>
      );
    } else {
      return (
        <View>
          <Text>
            Please View on iOS
          </Text>
        </View>
      )
    }
  }
}