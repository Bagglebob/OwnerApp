import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Button } from 'react-native';
import 'react-native-gesture-handler';
import { useState, useEffect } from "react"

import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createDrawerNavigator } from '@react-navigation/drawer';

import Login from './screens/Login';
import CreateListing from './screens/CreateListing';
import ViewListings from './screens/ViewListings';

// To check if user is logged in. 
// This is for showing limited navigation options when no user is logged in
import { getAuth, onAuthStateChanged } from "firebase/auth";


const Drawer = createDrawerNavigator();
const Stack = createStackNavigator();

function HomeTabs() {
  return (
    <Drawer.Navigator initialRouteName="View Listings">
      <Drawer.Screen name="Create Listing" component={CreateListing} />
      <Drawer.Screen name="View Listings" component={ViewListings} />
    </Drawer.Navigator>
  );
}


export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);


  const auth = getAuth();

  useEffect(() => {
    // from firestore documentation.
    onAuthStateChanged(auth, (user) => {
      if (user) {
        // User is signed in, see docs for a list of available properties
        // https://firebase.google.com/docs/reference/js/auth.user
        const uid = user.uid;
        setIsLoggedIn(true)
      } else {
        setIsLoggedIn(false)
      }
    });
  });

  const StackNav = () => (
    <Stack.Navigator initialRouteName="Login">
      <Stack.Screen name="Login" component={Login} options={{ headerShown: false }} />
    </Stack.Navigator>
  );

  const DrawerNav = () => (
    <Drawer.Navigator initialRouteName="View Listings">
      <Drawer.Screen name="Create Listing" component={CreateListing} />
      <Drawer.Screen name="View Listings" component={ViewListings} />
    </Drawer.Navigator>
  );

  // HAVING TROUBLE WITH DRAWER NAVIGATOR. 
  // TRYING TO SHOW ONLY LOGIN WHEN USER ISN'T LOGGED IN, IN DRAWER
  // CreateListing AND ViewListings SHOULD ONLY BE VISIBLE WHEN LOGGED IN
  return (
    // <NavigationContainer>
    //   <Stack.Navigator initialRouteName="Login"
    //     screenOptions={() => ({

    //     })}>
    //     <Stack.Screen name="Login" component={Login} />
    //     <Stack.Screen name="Create Listing" component={CreateListing} />
    //     <Stack.Screen name="View Listings" component={ViewListings} />
    //   </Stack.Navigator>

    //   {/* <Drawer.Navigator initialRouteName="Login" >
    //   {!isLoggedIn && (
    //       <Drawer.Screen name="Login" component={Login} />
    //     )}
    //     {isLoggedIn && (
    //       <>
    //         <Drawer.Screen name="Create Listing" component={CreateListing} />
    //         <Drawer.Screen name="View Listings" component={ViewListings} />
    //       </>
    //     )}
    //   </Drawer.Navigator> */}
    // </NavigationContainer>


    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        {/* // First screen is the Login */}
        <Stack.Screen name="Login" component={Login} />
        {/* Next screen is that Drawer component
      {/* The drawer consists of a create listing and view listings creen */}
        <Stack.Screen name="Home" component={HomeTabs} options={{ headerShown: false }}
        />
      </Stack.Navigator>
    </NavigationContainer>

    // <NavigationContainer>
    //   {isLoggedIn ? <DrawerNav /> : <StackNav />}
    // </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
