//General React Imports
import * as React from 'react';
import { useState } from 'react';

//React component imports
import { Text, FlatList, View, StyleSheet, Platform, Dimensions } from 'react-native';

//Expo module imports
import { LinearGradient } from 'expo-linear-gradient';
import { Octicons } from '@expo/vector-icons';

const windowHeight = Dimensions.get('window').height;
const windowWidth = Dimensions.get('window').width;
const postViewSize = windowWidth + 100;
const postViewSizeWidth = windowWidth - 25;
const postSquareDimensions = windowWidth - 29.5;
const usernameTop = windowWidth - 25;
const descriptionTop = windowWidth + 7.5;
const likesTop = descriptionTop - 30;

export default function FeedPage() {
    const [loadState, setLoadState] = useState(0)
    const [data, setData] = useState([])
    const [liked, setLiked] = useState(false)
    
    if ( loadState == 0 ) {

        /*
        fetch('https://postsbase.herokuapp.com/posts')
            .then((response) => {
                console.log(response);
            })
            .catch((error) => {
                console.log(error);
            })
        */

        var request = new XMLHttpRequest();
        request.onreadystatechange = (e) => {
            if (request.readyState !== 4) {
                return;
            }
            if (request.status === 200) {
                console.log('success', request.responseText);
                ResObj = JSON.parse(request.response)
                setData(ResObj)
                setLoadState(2)
            } else {
                console.warn('error');
            }
        };
        request.open('GET', 'https://postsbase.herokuapp.com/posts');
        request.send()
        setLoadState(1)
        return (
            <View>
                <Text>
                    Loading...
                </Text>
            </View>
        )
    }
    

    if ( loadState == 2 ) {
        if (Platform.OS !== 'ios') {
            return(  
            <View>
                <FlatList
                data={data}
                renderItem={ ({item}) => 
                    <View style={styles.viewConst}>
                        <Text
                        style={styles.postUsername}>
                            {item.username}
                        </Text>
                        <Text
                        style={styles.postDescription}>
                            {item.content}
                        </Text>
                    </View>
                }
                />
                <Text 
                style={{
                    backgroundColor: 'white',
                    height: 100,
                    width: windowWidth,
                    borderRadius: 15,
                    borderWidth: 4,
                    borderColor: 'black'
                }}>
                    You've reached the end of the line! Maybe take a break from your phone for a bit.
                </Text>
            </View>
            );
        } else if (Platform.OS === 'ios') {
        return(
            <View
            style={{
                backgroundColor: 'white'
            }}
            >
                <LinearGradient
                    colors={['rgba(0,0,0,0.8)', 'transparent']}
                    style={styles.gradient}
                >
                
                    <FlatList
                    style={{
                        top: 40
                    }}
                    contentContainerStyle={{
                        paddingBottom: 42,
                        paddingLeft: 3
                    }}
                    data={data}
                    renderItem={ ({item}) => 
                        <View 
                        style={{
                            height: 150,
                            width: postViewSizeWidth,
                            borderWidth: 3,
                            borderColor: 'black',
                            borderRadius: 14,
                            margin: 6,
                            backgroundColor: 'white'
                        }}>
                            <Text
                            style={{
                                position: 'absolute',
                                top: 8,
                                left: 8,
                                fontSize: 18
                            }}>
                                {item.username}
                            </Text>
                            <Text
                            style={{
                                position: 'absolute',
                                top: 40,
                                left: 8,
                            }}>
                                {item.content}
                            </Text>
                            <Octicons
                                name='heart'
                                size={20}
                                style={{
                                    position: 'absolute',
                                    top: 120,
                                    right: 22
                                }}
                            />
                            <Text
                            style={{
                                position: 'absolute',
                                top: 118,
                                right: 8,
                                fontSize: 15
                            }}
                            >
                                {item.likes}
                            </Text>
                        </View>
                    }
                    />
                </LinearGradient>
            </View>
        );}
    }
}

const styles = StyleSheet.create({
    viewConst: {
      height: 150,
      width: 300,
    },
    postImage: {
      height: 140,
      width: 140,
      borderWidth: 2,
      borderColor: 'black',
      position: 'absolute',
      top: 0,
      left: 0
    },
    postUsername: {
      position: 'absolute',
      top: 0,
      left: 150,
      fontSize: 18,
    },
    postDescription: {
      position: 'absolute',
      top: 30,
      left: 150,
    },
    gradient: {
        width: '100%',
        backgroundColor: '#7F66D5',
        alignItems: 'center'
    },
});