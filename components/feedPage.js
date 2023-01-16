//General React Imports
import * as React from 'react';
import { useState } from 'react';

//React component imports
import { Text, FlatList, View, StyleSheet, Platform, Dimensions, TouchableOpacity, Touchable } from 'react-native';
import Item from './item.js';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

//Expo module imports
import { LinearGradient } from 'expo-linear-gradient';
import { Octicons } from '@expo/vector-icons';
import { Button } from 'react-native-elements';

const windowHeight = Dimensions.get('window').height;
const windowWidth = Dimensions.get('window').width;
const postViewSize = windowWidth + 100;
const postViewSizeWidth = windowWidth - 25;
const postSquareDimensions = windowWidth - 29.5;
const usernameTop = windowWidth - 25;
const descriptionTop = windowWidth + 7.5;
const likesTop = descriptionTop - 30;

 const FeedPage = ({ navigation }) => {
    const [loadState, setLoadState] = useState(0)
    const [data, setData] = useState([])
    
    const [selectedId, setSelectedId] = useState(null);

    const renderItem = ({ item }) => {
        const color = item._id === selectedId ? ('red') : ('black');
        const icon = item._id === selectedId ? ('heart-fill') : ('heart');
        var likes = item.likes;

        if (selectedId === item._id) {
            likes = likes + 1
        }

        return(
            <Item
                item={item}
                onPress={() => setSelectedId(item._id)}
                color={color}
                icon={icon}
                likesText={likes}
            />
        );
    };
    
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
                    <View
                        style={{
                            position: 'fixed',
                            backgroundColor: 'black',
                            height: 80,
                            width: windowWidth
                        }}
                    >
                        <Text
                            style={{
                                position: 'fixed',
                                color: "white",
                                fontSize: 20,
                                fontWeight: 'bold',
                                top: 45,
                                left: 18
                            }}
                        >
                            CheckIn.
                        </Text>
                        <TouchableOpacity
                            style={{
                                position: 'fixed',
                                height: 30,
                                width: 90,
                                backgroundColor: 'white',
                                top: 12,
                                left: 280,
                                borderRadius: 8,
                                justifyContent: 'center',
                                alignItems: 'center'
                            }}
                            onPress={() => navigation.navigate('AddPost')}
                        >
                            <Text
                                style={{
                                    fontWeight: 'bold',
                                    fontSize: 13
                                }}
                            >
                                Add
                            </Text>
                        </TouchableOpacity>
                    </View>
                    <FlatList
                    style={{
                        top: 0
                    }}
                    contentContainerStyle={{
                        paddingBottom: 167,
                        paddingLeft: 3,
                        paddingTop: 10
                    }}
                    data={data}
                    renderItem={renderItem}
                    keyExtractor={(item) => item.id}
                    extraData={selectedId}
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

export default FeedPage;