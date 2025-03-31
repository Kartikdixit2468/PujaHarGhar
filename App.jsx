import React from 'react';
import HomeScreen from './src/pages/Home';
// import { createStaticNavigation } from '@react-navigation/native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import SignUp from './src/pages/signUp';


function MenuNavigation() {
  const Stack = createNativeStackNavigator();

  return (
    <Stack.Navigator initialRouteName="Home">
      <Stack.Screen name="Home" component={HomeScreen}/>
      <Stack.Screen name="SignUp" component={SignUp} />
    </Stack.Navigator>
  );
}


const App = () => {
  return (
    <NavigationContainer>
      <MenuNavigation />
    </NavigationContainer>  );
}

export default App;
