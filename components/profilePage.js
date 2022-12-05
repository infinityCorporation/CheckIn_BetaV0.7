import * as React from 'react';
import { useState, useEffect } from 'react';
import { Text, View, Platform, Image, FlatList, Dimensions, } from 'react-native';

import AsyncStorage from '@react-native-async-storage/async-storage';

import PostOne from '../assets/icon.png'
import pfp from "../assets/pfp.png"

const windowWidthLess = Dimensions.get('window').width - 11.5;
const profileHeight = 355;
const flatListHeight = Dimensions.get('window').height - profileHeight;
const windowHeight = Dimensions.get('window').height - 250;
const windowHeightFull = Dimensions.get('window').height + 5;
const windowWidth = Dimensions.get('window').width;

//Most recent try: Pulling the posts from the database grab instead of getting them from the posts grab function

export default function ProfilePage() {
  const [loadState, setLoadState] = useState(0);
  const [data, setData] = useState([]);
  const [posts, setPosts] = useState([]);
    
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
    /*
    console.log(posts)
    console.log(data.posts);
    console.log(data.posts[0].content);
    */
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

//Image display code
/*
<Image
                source={item.img}
                style={{
                height: 96,
                width: 96,
                position: 'absolute',
                top: 2,
                left: 2
                }}/>
*/

//Test DATA Code
/*
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
*/