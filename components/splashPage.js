import * as React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function SplashScreen() {
    return(
        <View
            style={styles.mainView}
        >
            <Text
                style={styles.mainText}
            >
                CheckIn
            </Text>
        </View>
    )
}

const styles = StyleSheet.create({
    mainView: {
        background: 'white',
        alignItems: 'center',
        justifyContent: 'center'
    },
    mainText: {
        fontWeight: '800',
        fontColor: 'black',
        fontSize: '18',
    }
})