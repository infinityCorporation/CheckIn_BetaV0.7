import * as React from 'react'
import { View, Text, TouchableOpacity } from 'react-native';

export default function AddPage() {
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
            <Text>
                Add Post Content:
            </Text>
            <TextInput
                style={design.inputDesign}
            />
            <TouchableOpacity
                style={design.buttonDesign}
            >
                <Text
                    style={design.buttonText}
                >
                    Post
                </Text>
            </TouchableOpacity>
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
        height: 100,
        width: 200,
        position: 'relative'
    },
    buttonText: {

    },
    inputDesign: {

    }
})