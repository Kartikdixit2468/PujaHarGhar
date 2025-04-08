import React from 'react';
import HomeScreen from './src/pages/Home';
// import { createStaticNavigation } from '@react-navigation/native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import SignUp from './src/pages/signUp';
import Search from './src/components/Search';
import Categories from './src/pages/Categories';
import Profile from './src/pages/Profile';
import Bookings from './src/pages/bookings';
import Support from './src/pages/support';

function MenuNavigation() {
  const Stack = createNativeStackNavigator();

  return (
    <Stack.Navigator
      // initialRouteName="Home"
      initialRouteName="Profile"
      screenOptions={{
        headerTintColor: '#ffcf00', // 🔵 Change back arrow color
        headerTitleStyle: {
          // fontWeight: 'bold',
          fontFamily: 'Fredoka-SemiBold',
          fontSize: 25,
        },
        // headerStyle: {
        //   height: 200
        // },
      }}
    >
      <Stack.Screen
        name="Home"
        component={HomeScreen}
        options={{ headerShown: false }}
      />

      <Stack.Screen
        name="SignUp"
        component={SignUp}
        options={{
          title: 'Sign Up',
          headerStyle: { backgroundColor: '#fff7ea' },
        }}
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
  );
};

export default App;
