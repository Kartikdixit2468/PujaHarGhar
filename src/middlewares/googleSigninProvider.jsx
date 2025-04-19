import React, {useEffect} from 'react';
import {View, Button, Alert} from 'react-native';
import {GoogleSignin} from '@react-native-google-signin/google-signin';

const GoogleSignInScreen = () => {
useEffect(() => {
  GoogleSignin.configure({
    webClientId:
      '858127099824-ubpru6f4glhq1u0s7fifuknlj79icjm0.apps.googleusercontent.com', // Get this from the JSON file
    offlineAccess: true,
  });
}, []);

const signIn = async () => {
  try {
    await GoogleSignin.hasPlayServices();
    const userInfo = await GoogleSignin.signIn();
    console.log('User Info:', userInfo);
    Alert.alert('Login Success', JSON.stringify(userInfo));
    return JSON.stringify(userInfo);
  } catch (error) {
    console.error('Google Sign-In Error:', error);
    Alert.alert('Login Failed', error.message);
    return error.message;
  }
};

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Button title="Sign in with Google" onPress={signIn} />
    </View>
  );
};

export default GoogleSignInScreen;
