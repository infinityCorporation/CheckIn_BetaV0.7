import * as React from 'react';
import { useState, useEffect } from 'react';
import { Text, View, Platform, Image, FlatList, Dimensions, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

import AsyncStorage from '@react-native-async-storage/async-storage';

import pfp from "../assets/pfp.png"

const profileHeight = 380;
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
        style={styles.mainView}
        >
          <View
            style={styles.fixedView}
          >
            <Text
              style={styles.topText}
            >
              Profile
            </Text>
          </View>
          <ScrollView>
            <LinearGradient
              colors={['transparent', 'rgba(0,0,0,0.7)']}
              style={{
                width: '100%',
                height: '100%'
              }}
            >
            <View
              style={styles.secondaryView}
            >
              <Image
                source={pfp}
                style={styles.image}
              />
              <Text
                style={styles.nameText}
              > 
                {data.name} 
              </Text>
              <Text
                style={styles.descriptionText}
              > 
                {data.description} 
              </Text>
              <TouchableOpacity
                style={[styles.buttonOutline, styles.buttonText]}
              >
                <Text
                  style={styles.buttonOutlineText}
                >
                  Follow
                </Text>
              </TouchableOpacity>
            </View>
            <View>
              <FlatList
                style={styles.flatlist}
                contentContainerStyle={{
                    paddingLeft: 4,
                    paddingBottom: 25,
                    paddingTop: 10
                }}
                data={data.posts}
                renderItem={ ({item}) => 
                  <View
                    style={styles.thirdView}
                  > 
                    <Text
                      style={styles.postText}
                    >
                      {item.content}
                    </Text>
                  </View>
                  }
              />
            </View>
            </LinearGradient>
          </ScrollView>
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

const styles = StyleSheet.create({
  mainView: {
    backgroundColor: '#A6F6E7',
    //height: windowHeightFull,
    width: windowWidth + 100,
    //position: 'absolute',
  },
  secondaryView: {
    position: 'static',
    borderBottomWidth: 3,
    borderBottomColor: 'black',
    height: 270,
    left: 0,
    top: -10,
    width: windowWidth,
    backgroundColor: 'white'
  },
  image: {
    height: 100,
    width: 100,
    borderRadius: 65,
    borderColor: 'black',
    borderWidth: 1,
    position: 'absolute',
    top: 25,
    left: 15
  },
  nameText: {
    position: 'absolute',
    top: 130,
    left: 15,
    fontSize: 18
  },
  descriptionText: {
    position: 'absolute',
    top: 158,
    left: 15
  },
  flatlist: {
    top: -10,
    height: windowHeightFull,
  },
  thirdView: {
    height: 100,
    width: windowWidth - 17,
    borderWidth: 2,
    borderRadius: 10,
    margin: 4,
    left: 1,
    backgroundColor: 'white'
  },
  postText: {
    position: 'absolute',
    left: 10
  },
  buttonOutline: {
    padding: 10,
    borderRadius: 10,
    width: '80%',
    backgroundColor: 'white',
    top: 210,
    borderColor: '#0782F9',
    borderWidth: 2,
    alignItems: 'center',
    left: 15
  },
  buttonText: {
    color: 'white',
    fontWeight: '700',
    fontSize: 16
  },
  buttonOutlineText: {
    color: '#0782F9',
    fontWeight: '700',
    fontSize: 16
  },
  fixedView: {
    position: 'fixed',
    height: 80,
    backgroundColor: 'black',
    width: '80%',
    alignItems: 'center',
  },
  topText: {
    color: 'white',
    top: 45,
    fontSize: 18,
    fontWeight: 'bold'
  }
})