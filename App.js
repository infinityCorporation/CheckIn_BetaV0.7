//Imports for general react assets and components
import * as React from 'react';
import { useState, useEffect, useReducer, useMemo } from 'react';
import { Text, View, Button, KeyboardAvoidingView, TouchableOpacity } from 'react-native';
import { StyleSheet, TextInput } from 'react-native';
import { SearchBar } from 'react-native-elements';
import { LinearGradient } from 'expo-linear-gradient';

//Imports for react navigation components
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Octicons } from '@expo/vector-icons';

//Imports for app exports
import FeedPage from './components/feedPage';
import ProfilePage from './components/profilePage';
import SplashScreen from './components/splashPage.js';

//Imports necessary for firebase authentication flow
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged } from 'firebase/auth';
import * as SecureStore from 'expo-secure-store';
import { auth } from './firebase.js';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();
const AuthContext = React.createContext();

//The concept for the new system of authentication is to use
//the google authentication through firebase to log users in. Then, the 
//state will be stored through a simpler reducer. The firebase modules
//will be moved from the reducer to the actually log in page 
//found below.

//Even if the same system ends up being rebuilt, it will give a better
//understanding of how the system works. The main issue right now is that I
//am completely unable to assign a value to the state. It contiues to
//return that it is a 'readonly' state, even though this is how the 
//documentation continues to show it. 

//---------------------

//Consider moving the dispatch commands into the actual sign in functions
//such that the result may be returned as a value other than 'undefined'
//or 'null'


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
          console.log("The action token is: ", action.token);
          return {
            ...prevState,
            isSignout: false,
            userToken: action.token,
            isLoading: false
          };
        case 'USER_LOGIN':
          return {
            ...prevState,
            isSignout: false,
            isLoading: false
          };
        case 'SIGN_OUT':
          SecureStore.deleteItemAsync('user');
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
      userToken: null
    }
  );

  //This is our initial check to see if the user
  //was previously logged in
  useEffect(() => {
    const bootstrapAsync = async() => {

      try {
        const user = await SecureStore.getItemAsync('user');

        if (user != null) {
          console.log("User Logged in with email:", user.email);

          onAuthStateChanged(auth, (user) => {
            if (user) {
              console.log(user);
            } else {
              console.log("No user is signed in...");
            }
          })

          dispatch({ type: 'RESTORE_TOKEN', token: user });
        } else {
          console.log("User must sign in")
          dispatch({ type: 'USER_LOGIN' })
        };

      } catch (error) {
        console.log(error);
      };

    };

    bootstrapAsync();
    console.log(state.userToken)
  }, []);

  //This is our command bank for the general authentication
  //flow. We can call our commends from here which will in 
  //turn fire the authentication calls to firebase and send
  //a state change dispatch to the reducer

  const authContext = useMemo(() => ({
    signIn: async (email, password) => {
      let userLogin;

      signInWithEmailAndPassword(auth, email, password, userLogin)
        .then(userCredential => {
            const user = userCredential.user;

            SecureStore.setItemAsync('user', JSON.stringify(userCredential.user));
            userLogin = user;

            dispatch({ type: 'SIGN_IN', token: user })
        })
        .catch((error) => {
            console.log({ message: error.message });
            console.log({ code: error.code })
        })

    },
    signUp: async (email, password) => {
      let userSignUp;

      createUserWithEmailAndPassword(auth, email, password)
            .then(userCredential => {
                const user = userCredential.user;
                
                //SecureStore.setItemAsync('user', JSON.stringify(user));
                userSignUp = user;
                dispatch({ type: 'SIGN_IN', token: userSignUp })
            })
            .catch((error) => {
                const errorCode = error.code;
                const errorMessage = error.message;
                console.log(errorCode, ' ', errorMessage);
            })

    },
    signOut: () => {
      dispatch({ type: 'SIGN_OUT' })
    }

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
            <Stack.Navigator 
              initialRouteName="Welcome"
            >
              <Stack.Screen 
                name="Welcome" 
                component={EntryPage}
                options={{headerShown: false}}
              />
              <Stack.Screen 
                name="Register" 
                component={RegistrationPage}
                options={{
                  headerShown: true,
                  headerBackTitle: "Home",
                }}
              />
              <Stack.Screen 
                name="Login" 
                component={LoginPage}
                options={{
                  headerShown: true,
                  headerBackTitle: "Home",
                }} 
              />
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
                } else if (route.name === "Settings" ) {
                  iconName = focused ? 'gear': 'gear';
                }
      
                return <Octicons name={iconName} color={color} size={size} />;
                },
                tabBarActiveTintColor: 'black',
                tabBarInactiveTintColor: 'grey',
              })}
            >
              <Tab.Screen 
                name="Home" 
                component={FeedPage} 
                options={{
                  headerShown: false
                }}
              />
              <Tab.Screen name="Search" component={Search} />
              <Tab.Screen 
                name="Profile" 
                component={ProfilePage} 
                options={{
                  headerShown: false
                }}
              />
              <Tab.Screen name="Settings" component={Settings} />
            </Tab.Navigator>
          )}
      </AuthContext.Provider>
    </NavigationContainer>
  );
};

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

const EntryPage = ({ navigation }) => {
  return(
    <View
      style={entry.mainView}
    >
      <LinearGradient
        colors={['rgba(0,0,0,0.8)', 'transparent']}
        style={entry.gradient}
      >
        <View
          style={entry.contentContainer}
        >
          <Text
            style={entry.mainTextFirst}
          >
            Welcome to
          </Text>
          <Text
            style={entry.mainTextSecond}
          >
            CheckIn.
          </Text>
          <TouchableOpacity
            style={entry.button}
            onPress={() => navigation.navigate("Register")}
          >
            <Text
              style={entry.buttonText}
            >
              Register
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={entry.button}
            onPress={() => navigation.navigate("Login")}
          >
            <Text
              style={entry.buttonText}
            >
              Login
            </Text>
          </TouchableOpacity>
        </View>
      </LinearGradient>
    </View>
  )
}

const RegistrationPage = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');

  const { signUp } = React.useContext(AuthContext);

  return(
    <LinearGradient
      colors={['rgba(0,0,0,0.8)', 'transparent']}
      style={{
        width: '100%',
        height: '100%',
        backgroundColor: '#68D39F'
      }}
    >
      <KeyboardAvoidingView
        style={styles.container}
        behavior='padding'
      >
        <View
          style={styles.inputContainer}
        >
          <TextInput
              placeholder="Username"
              value={username}
              onChangeText={text => setUsername(text)}
              style={styles.input}
          />
          <TextInput
              placeholder="Email"
              value={email}
              onChangeText={text => setEmail(text)}
              style={styles.input}
          />
          <TextInput
              placeholder='Password'
              value={password}
              onChangeText={newText => setPassword(newText)}
              style={styles.input}
              secureTextEntry
          />
        </View>
        <View
            style={styles.buttonContainer}
        >
          <TouchableOpacity
              onPress={() => signUp( email, password )}
              style={[styles.buttonText, styles.button]}
          >
            <Text
              style={styles.buttonText}
            >
              Register
            </Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </LinearGradient>
  )
}

const LoginPage = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const { signIn } = React.useContext(AuthContext);

  return (
    <LinearGradient
      colors={['rgba(0,0,0,0.8)', 'transparent']}
      style={{
        width: '100%',
        height: '100%',
        backgroundColor: '#68C9D3'
      }}
    >
      <KeyboardAvoidingView
          style={styles.container}
          behavior="padding"
      >
        <View
            style={styles.inputContainerLogin}
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
              onChangeText={newText => setPassword(newText)}
              style={styles.input}
              secureTextEntry
          />
        </View>
        <View
            style={styles.buttonContainer}
        >
          <TouchableOpacity
              onPress={() => signIn( email, password )}
              style={styles.button}
          >
            <Text
              style={styles.buttonText}
            >
              Login
            </Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </LinearGradient>
  )
};

const Settings = ({ navigation }) => {
  const { signOut } = React.useContext(AuthContext);

  const user = auth.currentUser;

  return(
    <View
      style={styles.settingsView}
    >
      <Text
        style={styles.settingsTextFirst}
      >
        - Sign Out of Account -
      </Text>
      <TouchableOpacity
        onPress={() => signOut()}
        style={[styles.buttonText, styles.buttonOutlineSettings]}
      >
        <Text
          style={styles.buttonOutlineText}
        >
          Sign Out
        </Text>
      </TouchableOpacity>
      <Text
        style={styles.settingsText}
      >
        - Signed in With Email -
      </Text>
      <View
        style={styles.emailView}
      >
        <Text>
          {user.email}
        </Text>
      </View>
      <Text
        style={styles.settingsText}
      >
        - Change Navigation Bar Color -
      </Text>
    </View>
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
  inputContainerLogin: {
    width: '80%',
    position: 'absolute',
    top: 150
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
      top: 250
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
  buttonOutlineSettings: {
    padding: 15,
    borderRadius: 10,
    width: '90%',
    backgroundColor: 'white',
    marginTop: 5,
    borderColor: '#0782F9',
    borderWidth: 2,
    alignItems: 'center'
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
  },
  settingsView: {
    alignItems: 'center',
    backgroundColor: 'white',
    height: '100%'
  },
  settingsText: {
    textAlign: 'center',
    color: 'black',
    fontWeight: '800',
    fontsize: 14,
    marginTop: 35,
  },
  settingsTextFirst: {
    textAlign: 'center',
    color: 'black',
    fontWeight: '800',
    fontsize: 14,
    marginTop: 20,
    
  },
  emailView: {
    width: '90%',
    height: 60,
    borderRadius: 10,
    borderWidth: 3,
    borderColor: 'black',
    backgroundColor: 'lightgray',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 5
  }
});

const entry = StyleSheet.create({
  mainTextFirst: {
    fontWeight: '700',
    fontSize: '20',
    color: 'white',
    marginBottom: 5
  },
  mainTextSecond: {
    fontWeight: '900',
    fontSize: '32',
    color: 'white',
    marginBottom: 75,
  },
  gradient: {
    width: '100%',
    backgroundColor: '#7F66D5',
    alignItems: 'center'
  },
  mainView: {
    flex: 1,
    alignItems: 'center',
  },
  contentContainer: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center'
  },
  button: {
    backgroundColor: '#0782F9',
    width: '80%',
    padding: 15,
    borderRadius: 10,
    margin: 5,
    
  },
  buttonText: {
    color: 'white',
    fontWeight: '700',
    fontSize: 16,
    textAlign: 'center'
  },
  
  
})

//Below is a test space and holding space for temporarily unused code:
/*

*/