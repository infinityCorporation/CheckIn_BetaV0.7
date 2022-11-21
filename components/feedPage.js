import * as React from 'react';
import { useState } from 'react';
import { Text, FlatList, View, StyleSheet, Platform, Dimensions } from 'react-native';

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
                    You've reached the end of the line! Maybe take a break from your phone for a bit. :)
                </Text>
            </View>
            );
        } else if (Platform.OS === 'ios') {
        return(
        <View
        style={{
            backgroundColor: '#1DA1F2'
        }}>
            <FlatList
            contentContainerStyle={{
                paddingTop: 14,
                paddingBottom: 10,
                paddingLeft: 10
            }}
            data={data}
            renderItem={ ({item}) => 
                <View 
                style={{
                    height: 150,
                    width: postViewSizeWidth,
                    borderWidth: 3,
                    borderColor: 'black',
                    borderRadius: 15,
                    margin: 6,
                    backgroundColor: 'white'
                }}>
                    <Text
                    style={{
                        position: 'absolute',
                        top: 10,
                        left: 4,
                        fontSize: 18
                    }}>
                        {item.username}
                    </Text>
                    <Text
                    style={{
                        position: 'absolute',
                        top: 45,
                        left: 4,
                    }}>
                        {item.content}
                    </Text>
                    <Text
                    style={{
                        position: 'absolute',
                        top: 10,
                        right: 8
                    }}
                    >
                        {item.likes}
                    </Text>
                </View>
            }
            />
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
    }
});