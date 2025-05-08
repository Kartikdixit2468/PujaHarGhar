import React from 'react';
import HomeScreen from './src/pages/Home';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import SignUp from './src/pages/signUp';
import Search from './src/components/Search';
import Categories from './src/pages/Categories';
import Profile from './src/pages/Profile';
import Bookings from './src/pages/Bookings';
import Support from './src/pages/support';
import PujaPage from './src/pages/PujaPage';
import WelcomeScreen from './src/pages/WelcomScreen';
import { Text, View } from 'react-native';
import DotsLoader from './src/components/DotsLoader';

function MenuNavigation() {

  const [isLoggedIn, setIsLoggedIn] = useState(null);
  useEffect(()=>{
    const checkLogIn =async () => {
      const token = await AsyncStorage.getItem('authToken')
      if (token){
        const verifyToken = await fetch('http://192.168.31.118:3000/api/client/user/verify/securitytoken',
        // const verifyToken = await fetch('http://192.168.31.166:3000/api/client/user/verify/securitytoken',
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            // body: JSON.stringify(completeUserData),
            body: JSON.stringify({token: token}),
          }
        );

        const isTokenValid = await verifyToken.json()

        if (isTokenValid){       
          setIsLoggedIn(true)
        }
        else{
          setIsLoggedIn(false)
        }
      }
      else{
        setIsLoggedIn(false)
      }
    };
    checkLogIn()
  }, [])

  const Stack = createNativeStackNavigator();

  console.log(isLoggedIn)

  if (isLoggedIn === null) {
    return ( // or a splash/loading spinner
        // <Text>Loading</Text>
        <View/>
    )
  }
  
  return (
    <Stack.Navigator
      // initialRouteName="Home"
      initialRouteName={isLoggedIn ? "HomeScreen" : "WelcomeScreen"}
      screenOptions={{
        headerTintColor: '#ffcf00', // 🔵 Change back arrow color
        headerTitleStyle: {
          fontFamily: 'Fredoka-SemiBold',
          fontSize: 25,
        },
      }}
    >
      <Stack.Screen
        name="WelcomeScreen"
        component={WelcomeScreen}
        options={{ headerShown: false }}
      />

      <Stack.Screen
        name="HomeScreen"
        component={HomeScreen}
        options={{ headerShown: false }}
      />

      <Stack.Screen
        name="SignUp"
        component={SignUp}
        options={{ headerShown: false }}
      />

      <Stack.Screen
        name="Search"
        component={Search}
        options={{
          title: 'Search',
          headerStyle: { backgroundColor: '#fff7ea' },
        }}
      />

      <Stack.Screen
        name="Profile"
        component={Profile}
        options={{
          title: 'Profile',
          headerStyle: { backgroundColor: '#f9f7f9' },
          headerTitleStyle: {
            fontFamily: 'Fredoka-SemiBold',
            fontSize: 40,
          },
        }}
      />

      <Stack.Screen
        name="Bookings"
        component={Bookings}
        options={{
          title: 'Bookings',
          headerStyle: { backgroundColor: '#fff7ea' },
        }}
      />

      <Stack.Screen
        name="PujaPage"
        component={PujaPage}
        options={{
          title: 'Puja Details',
          headerStyle: { backgroundColor: '#f7f7f7' },
          // headerShown: false
        }}
      />

      <Stack.Screen
        name="Support"
        component={Support}
        options={{
          title: 'Support',
          headerStyle: { backgroundColor: '#fff7ea' },
        }}
      />

      <Stack.Screen
        name="Categories"
        component={Categories}
        options={{
          title: 'Categories',
          headerStyle: {
            backgroundColor: '#fff7ea',
            fontFamily: 'Fredoka-SemiBold',
            fontSize: 35,
          },
        }}
      />
    </Stack.Navigator>
  );
}

const App = () => {
  return (
    <NavigationContainer>
      <MenuNavigation />
    </NavigationContainer>
    // <DotsLoader/>
  );
};

export default App;
