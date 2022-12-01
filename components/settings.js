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
        <View>
            <Button
            onPress={onPress}
            title="Logout"/>
        </View>
    )
}