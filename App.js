//Imports for general react assets and components
import * as React from 'react';
import { useState, useEffect, useReducer, useMemo } from 'react';
import { Text, View, KeyboardAvoidingView, TouchableOpacity, ActivityIndicator } from 'react-native';
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
import FeedNav from './components/feedNav.js';

//Imports necessary for firebase authentication flow
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged } from 'firebase/auth';
import * as SecureStore from 'expo-secure-store';
import { auth } from './firebase.js';
import { async } from '@firebase/util';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();
const AuthContext = React.createContext();

//NOTES:

//The loading page to register the user with google and the mongoDB should now be working. Further
//testing will be completed. Test on 3 user accounts, obtain a general time that it takes to load.

//Check the response and make sure that it checks out and has not returned an error
//Handle errors better. For example, send back to registration page if the information is bad.
//If the account already exists, send the user to the login page to sign in.
//Get rid of the back button on the loading page, could effect how the hook is handled.


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
            isLoading: false,
            name: null,
            userEmail: null,
            username: null,
            password: null
          };
        case 'USER_LOGIN':
          return {
            ...prevState,
            isSignout: false,
            isLoading: false,
            name: null,
            userEmail: null,
            username: null,
            password: null
          };
        case 'SIGN_OUT':
          SecureStore.deleteItemAsync('user');
          return {
            ...prevState,
            isSignout: true,
            userToken: null,
            name: null,
            userEmail: null,
            username: null,
            password: null
          };
        case 'SEND_JSON':
          return {
            ...prevState,
            name: action.name,
            username: action.username,
            userEmail: action.email,
            password: action.password
          }
      }
    },
    {
      isLoading: true,
      isSignout: false,
      userToken: null,
      name: null,
      username: null,
      userEmail: null,
      password: null
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
    signUp: async (nameReal, usernameInput, email, password) => {
      dispatch({ type:'SEND_JSON', name: nameReal, username: usernameInput, userEmail: email, password: password});
    },
    googleSignUp: async (email, password) => {
      createUserWithEmailAndPassword(auth, email, password)
        .then(userCredential => {
          const user = userCredential.user;
          SecureStore.setItemAsync('user', JSON.stringify(userCredential.user));
          userSignUp = user;
          dispatch({ type: 'SIGN_IN', token: userSignUp })
        })
        .catch((error) => {
          const errorCode = error.code;
          const errorMessage = error.message;
          console.log(errorCode, ' ', errorMessage);
        });
    },
    collectJSON: async () => {
      const name = state.name;
      const username = state.username;
      const email = state.userEmail;
      const password = state.password;
      
      const jsonPack = {
        name: name,
        username: username,
        email: email,
        password: password
      };

      return jsonPack;
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
              <Stack.Screen 
                name="Loading Page"
                component={LoadingPage}
                options={{
                  headershown: true,
                  headerBackTitle: "Register",
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
                tabBarActiveTintColor: 'white',
                tabBarInactiveTintColor: 'grey',
                tabBarStyle: {
                  backgroundColor: 'black'
                }
              })}
            >
              <Tab.Screen 
                name="Home" 
                component={FeedNav}
                options={{
                  headerShown: false
                }}
              />
              <Tab.Screen 
                name="Search" 
                component={Search}
                options={{
                  headerShown: false
                }}
              />
              <Tab.Screen 
                name="Profile" 
                component={ProfilePage} 
                options={{
                  headerShown: false
                }}
              />
              <Tab.Screen 
                name="Settings" 
                component={Settings} 
                options={{ 
                  headerShown: false 
                }} 
              />
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
      <View
        style={styles.fixedView}
      >
        <Text
          style={styles.topText}
        >
          Search
        </Text>
      </View>
      <SearchBar
      placeholder="Search..."
      onChangeText={updateText}
      value={search}
      />
    </View>
  )
}

const NewPost = ({ navigation }) => {
  return(
    <View>
      <Text>
        This is where new posts are added.
      </Text>
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
  const [usernameInput, setUsernameInput] = useState('');
  const [nameReal, setNameReal] = useState('');

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
              placeholder="Name"
              value={nameReal}
              onChangeText={text => setNameReal(text)}
              style={styles.input}
          />
          <TextInput
              placeholder="Username"
              value={usernameInput}
              onChangeText={text => setUsernameInput(text)}
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
              onPress={() => {
                navigation.navigate("Loading Page");
                signUp(nameReal, usernameInput, email, password);
              }}
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

const LoadingPage = ({ navigation }, state) => {
  const [loading, setLoading] = useState(true);

  const [loadState, setLoadState] = useState(0);
  const [data, setData] = useState();

  const { collectJson } = React.useContext(AuthContext);
  const { googleSignUp } = React.useContext(AuthContext);
  const jsonBody = collectJson();

  googleSignUp(jsonBody.username, jsonBody.email);

  console.log(jsonBody);
  console.log("the above object was sent from the registration page to the loading page");
  console.log("If not null, this text can be deleted and the object is ready to be used in a hook");

  if (loadState == 0) {
    var request = new XMLHttpRequest();
    request.onreadystatechange = (e) => {
      if (request.readyState != 4) {
        return;
      };
      if (request.status === 200) {
        console.log('Registration load success', request.responseText);
        const responseObj = JSON.parse(request.response);
        setData(responseObj);
        setLoadState(2);
      } else {
        console.log('some sort of error has occured in the registration hook');
      };
    };
    request.open('POST', 'https://userend.herokuapp.com/add')
    request.send(jsonBody);
    setLoadState(1);
  };

  if ( loadState == 0 || loadState == 1 ) {
    setLoading(true);
  } else if ( loadState == 2 ) {
    setLoading(false);
  };
  
  //Note that when the hook is sent and the response is done loading, you will be automatically taken from the
  //auth stack to the home stack

  return(
    <View>
      {loading ? (
        <ActivityIndicator
          visible={loading}
          textContent={'Loading...'}
          textStyle={{
            color: '#FFF'
          }}
        />
      ) : (
        <>
          <Text>
            Thanks For Waiting!
          </Text>
        </>
      ) }
    </View>
  );
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
      <View
        style={styles.fixedView}
      >
        <Text
          style={styles.topText}
        >
          Settings
        </Text>
      </View>
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
      top: 300
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
  },
  fixedView: {
    position: 'fixed',
    height: 80,
    backgroundColor: 'black',
    width: '100%'
  },
  topText: {
    color: 'white',
    top: 45,
    textAlign: 'center',
    fontSize: 18,
    fontWeight: 'bold'
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
  The below code is the xmlhttprequest to check for existing users and then create a new user upon
  user registration. It may be breaking the hook rules. We are going to try to use fetch and if 
  that does not work then we will need to come up with a more clever way to get around the issue

      if (loadstate == 0) {
          var request = new XMLHttpRequest();
          request.onreadystatechange = (e) => {
            if (request.readyState !== 4) {
              console.log('readyState does not equal 4');
              return;
            } if (request.status == 400) {
              console.log('request was a success in registration form', request.responseText);
              objRes = JSON.parse(request.response);
              setData(objRes);
              setLoadstate(2)
            } else {
              console.log('error of truly unknown origin...')
            }
          }

          request.open('POST', 'https://userend.herokuapp.com/add');
          request.setRequestHeader('Content-Type', 'application/json');
          request.send(JSON.stringify(x));
          setLoadstate(1);

          console.log('The post call has run and is now waiting to either send or recieve')
          return;
        };

        if (loadstate == 2) {
          console.log('The data has been returned and the user is (existing or new):', data);
          return;
        }


        The below code is a fetch version of the above code, it is a bit shorter but I am not totally
        sure if it actually works for what is needed

        async function userSignUpCall(url, data) {
        const response = await fetch(url, {
          method: 'POST',
          mode: 'cors',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(data)
        });
        return response.json();
      };
*/