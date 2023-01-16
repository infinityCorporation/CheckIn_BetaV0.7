import * as React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, TextInput } from 'react-native';
import { useState } from 'react';
import { LinearGradient } from 'expo-linear-gradient';

export default function AddPage() {
    const [text, setText] = useState('');

    return(
        <View
            style={design.mainView}
        >
            <View
                style={{
                    position: 'fixed',
                            backgroundColor: 'black',
                            height: 80,
                            width: '100%'
                }}
            >
                <Text
                    style={{
                        fontSize: 18,
                        fontWeight: 'bold',
                        color: 'white',
                        top: 45,
                        textAlign: 'center'
                    }}
                >
                    Create a Post
                </Text>
            </View>
            <LinearGradient
                    colors={['rgba(0,0,0,0.8)', 'transparent']}
                    style={design.gradient}
                >
                <TextInput
                    multiline
                    maxLength={125}
                    onChangeText={text => setText(text)}
                    style={design.inputDesign}
                />
                <TouchableOpacity
                    style={design.buttonDesign}
                >
                    <Text
                        style={design.buttonText}
                    >
                        Post!
                    </Text>
                </TouchableOpacity>
            </LinearGradient>
        </View>
    )
}

const design = StyleSheet.create({
    mainView: {
        width: '100%',
        height: '100%',
        position: 'absolute',
        alignItems: 'center',
        backgroundColor: 'black',
        color: 'white'
    },
    buttonDesign: {
        height: '7%',
        width: '20%',
        position: 'absolute',
        borderRadius: 10,
        borderWidth: 4,
        borderColor: 'white',
        justifyContent: 'center',
        alignItems: 'center',
        top: 240
    },
    buttonText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: 'white'
    },
    inputDesign: {
        position: 'absolute',
        top: 20,
        width: '80%',
        height: 200,
        borderRadius: 10,
        borderWidth: 4,
        borderColor: 'white',
        color: 'white',
        fontSize: 17,
        fontWeight: '600',
        padding: 5
    },
    gradient: {
        width: '100%',
        backgroundColor: '#7F66D5',
        alignItems: 'center',
        height: '100%'
    },
})