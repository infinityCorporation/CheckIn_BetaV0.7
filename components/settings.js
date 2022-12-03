import * as React from 'react';
import { View, Text, Button} from 'react-native';
import { useAuth0 } from 'react-native-auth0';

export default function settingsPage() {
    const {clearSession} = useAuth0();

    const onPress = async() => {
        try {
            await clearSession();
        } catch (e) {
            console.log(e);
        }
    }

    return (
        <Auth0Provider
        domain={"dev-yrna5lmfp3skyl5x.us.auth0.com"}
        clientId={"suSGQOrsjixmsnkDeBxzRX6wXmw7TXrx"}>
            <View>
                <Button
                onPress={onPress}
                title="Logout"/>
            </View>
        </Auth0Provider>
    )
}