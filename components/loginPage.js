import * as React from 'react';
import { View, Text } from 'react-native';
import { useAuth0, Auth0Provider } from 'react-native-auth0';
import { Button } from 'react-native-elements';

export default function LoginPage() {
    const {authorize} = useAuth0();

    const onPress = async () => {
        try {
            await authorize();
        } catch (e) {
            console.log(e);
        }
    }
    
    return (
        <View>
            <Button
            onPress={onPress}
            title="Log In"
            />
        </View>
    )
}