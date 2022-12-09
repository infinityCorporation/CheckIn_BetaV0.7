//Imports for general react assets and components
import * as React from 'react';
import { useState, useEffect, useReducer, useMemo } from 'react';
import { Text, View, Button, KeyboardAvoidingView, TouchableOpacity } from 'react-native';
import { StyleSheet, TextInput } from 'react-native';
import { SearchBar } from 'react-native-elements';

//Imports for react navigation components
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Octicons } from '@expo/vector-icons';

//Imports for app exports
import SplashScreen from './components/splashPage.js';
import FeedPage from './components/feedPage';
import ProfilePage from './components/profilePage';

//Imports necessary for firebase authentication flow
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged } from 'firebase/auth';
import * as SecureStore from 'expo-secure-store';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();
const AuthContext = React.createContext();

export default function App() {
  //This is essentially a state changing function that will change the state
  //when a given action occurs. The action, and therefore the reducer, is 
  //called by the dispatch command
  const [state, dispatch] = useReducer(
    (prevState, action) => {
      switch (action.type) {
        case 'RESTORE_TOKEN':
          return {
            ...prevState,
            userToken: action.token,
            isLoading: false,
          };
        case 'SIGN_IN':
          return {
            ...prevState,
            isSignout: false,
            userToken: action.token,
          };
        case 'SIGN_OUT':
          return {
            ...prevState,
            isSignout: true,
            userToken: null,
          };
      }
    },
    {
      isLoading: true,
      isSignout: false,
      userToken: null,
    }
  );

  //This is our initial check to see if the user
  //was previously logged in
  useEffect(() => {
    const bootstrapAsync = async() => {
      let savedToken;

      try {
        savedToken = await SecureStore.getItemAsync('user');
        const user = JSON.parse(savedToken)
        console.log(savedToken)
        console.log("User Logged in under email:", user.email);
      } catch (error) {
        console.log(error);
      };

      dispatch({ type: 'RESTORE_TOKEN', token: savedToken });
    }

    bootstrapAsync();
  }, [])

  //This is our command bank for the general authentication
  //flow. We can call our commends from here which will in 
  //turn fire the authentication calls to firebase and send
  //a state change dispatch to the reducer
  const authContext = useMemo(() => ({
    signIn: async ( email, password) => {
      let userLogin;
      signInWithEmailAndPassword(email, password)
            .then(userCredential => {
                const user = userCredential.user;
                console.log("Logged in with: ", user.email);
                
                SecureStore.setItemAsync('user', JSON.stringify(user));
                userLogin = JSON.parse(user);
            })
            .catch((error) => {
                const errorCode = error.code;
                const errorMessage = error.message;
                console.log(errorCode, ' ', errorMessage);
            })

      dispatch({ type: 'SIGN_IN', token: userLogin })
    },
    signUp: async (email, password) => {
      let userSignUp;
      createUserWithEmailAndPassword(email, password)
            .then(userCredential => {
                const user = userCredential.user;
                console.log("New User logged in with: ", user.email)
                
                SecureStore.setItemAsync('user', JSON.stringify(user));
                userSignUp = JSON.parse(user);
            })
            .catch((error) => {
                const errorCode = error.code;
                const errorMessage = error.message;
                console.log(errorCode, ' ', errorMessage);
            })
      dispatch({ type: 'SIGN_IN', token: userSignUp })
    },
    signOut: () => dispatch({ type: 'SIGN_OUT' })
  }), []
  );

  //If checking for the user state, we show a loading screen
  if (state.isLoading) {
    return (
      <View>
        <SplashScreen/>
      </View>
    )
  }

  //Main navigation for authentication flow and main app
  return (
    <NavigationContainer>
      <AuthContext.Provider
        value={authContext}
        >
          {state.userToken == null ? (
            <Stack.Navigator>
              <Stack.Screen name="Login" component={LoginPage} />
            </Stack.Navigator>
          ) : (
            <Tab.Navigator
              screenOptions={({ route }) => ({
                tabBarIcon: ({ focused, color, size }) => {
                let iconName;
                
                if (route.name === 'Home') {
                    iconName = focused ? 'home' : 'home';
                } else if (route.name === 'Profile') {
                    iconName = focused ? 'person' : 'person';
                } else if (route.name === 'Search') {
                    iconName = focused ? 'search' : 'search';
                }
      
                return <Octicons name={iconName} color={color} size={size} />;
                },
                tabBarActiveTintColor: 'black',
                tabBarInactiveTintColor: 'grey',
              })}
            >
              <Tab.Screen name="Home" component={FeedPage} />
              <Tab.Screen name="Search" component={Search} />
              <Tab.Screen name="Profile" component={Profile} />
            </Tab.Navigator>
          )}
      </AuthContext.Provider>
    </NavigationContainer>
  );
};

//Main calls for our navigation to create and import our
//components
const MainFeed = ({ navigation }) => {
  return (
    <View>
      <FeedPage/>
    </View>
  )
}

const Profile = ({ navigation }) => {
  return (
    <View>
      <ProfilePage/>
    </View>
  )
}

const Search = ({ navigation }) => {
  const [search, setSearch] = useState('');

  const updateText = (search) => {
    setSearch(search)
  }

  return(
    <View>
      <SearchBar
      placeholder="Search..."
      onChangeText={updateText}
      value={search}
      />
    </View>
  )
}

const LoginPage = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const { signIn } = React.useContext(AuthContext);
  const { signUp } = React.useContext(AuthContext);

  return (
      <KeyboardAvoidingView
          style={styles.container}
          behavior="padding"
      >
          <View
              style={styles.inputContainer}
          >
              <TextInput
                  placeholder="Email"
                  value={email}
                  onChangeText={text => setEmail(text)}
                  style={styles.input}
              />
              <TextInput
                  placeholder='Password'
                  value={password}
                  onChangeText={text => setPassword(text)}
                  style={styles.input}
                  secureTextEntry
              />
          </View>
          <View
              style={styles.buttonContainer}
          >
              <TouchableOpacity
                  onPress={() => signIn({ email, password})}
                  style={styles.button}
              >
                  <Text
                      style={styles.buttonText}
                  >
                      Login
                  </Text>
              </TouchableOpacity>
              <TouchableOpacity
                  onPress={() => signUp({ email, password })}
                  style={[styles.buttonText, styles.buttonOutline]}
              >
                  <Text
                      style={styles.buttonOutlineText}
                  >
                      Register
                  </Text>
              </TouchableOpacity>
          </View>
      </KeyboardAvoidingView>
  )
};

const styles = StyleSheet.create({
  container: {
      flex: 1,
      top: 100,
      justifyContent: 'center',
      alignItems: 'center',
  },
  inputContainer: {
      width: '80%',
      position: 'absolute',
      top: 100
  },
  input: {
      backgroundColor: 'white',
      paddingHorizontal: 15,
      paddingVertical: 10,
      borderRadius: 10,
      marginTop: 5
  },
  buttonContainer: {
      width: '80%',
      justifyContent: 'center',
      alignItems: 'center',
      position: 'absolute',
      top: 200
  },
  button: {
      backgroundColor: '#0782F9',
      width: '100%',
      padding: 15,
      borderRadius: 10
  },
  buttonOutline: {
      padding: 15,
      borderRadius: 10,
      width: '100%',
      backgroundColor: 'white',
      marginTop: 5,
      borderColor: '#0782F9',
      borderWidth: 2
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
  }

})

//Below is a test space and holding space for temporarily unused code:
/*

*/