import AsyncStorage from '@react-native-async-storage/async-storage';
import { React, useState, useEffect } from 'react';
import {
  SafeAreaView,
  Image,
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
} from 'react-native';
// import {signIn} from '../middlewares/googleSigninProvider';
import { styles } from '../css/style';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
// import data from '../../data/data';

const saveToken = async (token) => {
  try {
    await AsyncStorage.setItem('authToken', token);
  } catch (error) {
    console.error('Error saving token', error);
  }
};

const SignUp = ({ navigation }) => {
  
  useEffect(() => {
    GoogleSignin.configure({
      scopes: [
        'https://www.googleapis.com/auth/user.phonenumbers.read',
        'https://www.googleapis.com/auth/user.gender.read',
        'https://www.googleapis.com/auth/user.addresses.read',
        'https://www.googleapis.com/auth/user.birthday.read',
        'https://www.googleapis.com/auth/userinfo.profile',
        'https://www.googleapis.com/auth/userinfo.email',
      ],
      ClientId:
        '842164284838-nuqnp2moeos51tki7r5l8ee3tnvn3inc.apps.googleusercontent.com', // Get this from the JSON file
    });
  }, []);

  const handleSignin = async () => {
    try {
      await GoogleSignin.hasPlayServices();
      const userInfo = await GoogleSignin.signIn();
      const user_data = userInfo.data.user;
      // // From Here
      // const tokens = await GoogleSignin.getTokens(); // gets accessToken
      // const accessToken = tokens.accessToken;

      // // Fetch extra user details from People API
      // const peopleResponse = await fetch(
      //   'https://people.googleapis.com/v1/people/me?personFields=genders,birthdays,addresses,phoneNumbers',
      //   {
      //     headers: {
      //       Authorization: `Bearer ${accessToken}`,
      //     },
      //   }
      // );

      // const extraDetails = await peopleResponse.json();
      // console.log('Extra Details:', extraDetails);

      // Combine both
      // const completeUserData = {
      //   ...user_data, // from GoogleSignin.signIn()
      //   ...extraDetails, // from People API
      // };

      try {
        const response = await fetch(
          'http://192.168.31.118:3000/api/client/register/user',
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            // body: JSON.stringify(completeUserData),
            body: JSON.stringify(user_data),
          }
        );

        const data = await response.json();

        // Setting Up session token and storing in AsyncStorage
        if (data.success) {
          await saveToken(data.token);
          console.log(data.token);
          navigation.navigate('HomeScreen');
        } else {
          Alert.alert(
            'Login Failed Server refused the sign in request!',
            error.message
          );
        }
      } catch (error) {
        Alert.alert(
          'Login Failed Server refused the sign in request!',
          error.message
        );
        console.error(error);
      }
      // Alert.alert('Login Success', JSON.stringify(userInfo));
      // return JSON.stringify(userInfo);

      // Backend code here '
    } catch (error) {
      console.error('Google Sign-In Error:', error);
      Alert.alert('Login Failed', error.message);
      return error.message;
    }
  };

  // For SignUp Stage 1
  const [email, setEmail] = useState('Enter your email');
  const [number, setNumber] = useState('9876543210');
  const countryCode = '+91';

  
  // For SignUp Stage 2
  const [signUpstage, setSignUpStage] = useState(0);
  const [EmailOTP, setEmailOTP] = useState(null);
  const [PhoneOTP, setPhoneOTP] = useState(null);


  const onChangeEmailOTP = () => {
    //
  }

  const onChangePhoneOTP = () => {
    //
  }

  const onChangeEmail = (value) => {
    setEmail(value);
    console.log('Email updated:', value); // or add validation logic here
  }

  const onChangeNumber = (value) => {
    setNumber(value);
  }



  return (
    <>
    <SafeAreaView style={signUpstage != 0 ? [styles_signup.container, styles_signup.fade_screen]: styles_signup.container}>
      <View style={styles_signup.progressBar}>
        <View style={[styles_signup.bar, { backgroundColor: 'white' }]}></View>
        <View style={styles_signup.bar}></View>
      </View>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          // borderWidth: 2,
        }}
      >
        <Text
          style={[
            {
              alignItems: 'center',
              borderRadius: 2,
              padding: 8,
              backgroundColor: '#ffcf00',
              borderBottomRightRadius: 30,
              borderTopRightRadius: 30,
              color: 'white',
            },
            styles.signup_title,
          ]}
        >
          {' '}
          Join Us{' '}
        </Text>
        <Text
          style={[
            {
              margin: 2,
              color: '#ffcf00',
            },
            styles.signup_title,
          ]}
        >
          for Divine Positivity{' '}
        </Text>
      </View>

      <View style={styles.signupForm}>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'flex-start',
            paddingHorizontal: 10,
          }}
        >
          <TextInput
            style={[styles.emailInput, styles.input]}
            value={email}
            onChangeText={setEmail}
            ></TextInput>
        </View>
        <View
          style={{
            flexDirection: 'row',
            // borderWidth: 2,
            width: '100%',
            paddingHorizontal: 10,
          }}
        >
          <TextInput
            value={countryCode}
            // onChangeText={onChangeCountryCode}
            style={[styles.countryCode, styles.input]}
          ></TextInput>
          <TextInput
            value={number}
            onChangeText={(value) => {    setEmail(value)            }}
            style={[styles.phoneNum, styles.input]}
          ></TextInput>
        </View>
      </View>

      <View style={styles_signup.priestImg}>
        <Image
          style={{ resizeMode: 'contain', width: '80%' }}
          source={require('../assets/images/pandit-img.png')}
        />
      </View>

      <View
        style={[
          { margin: 5, padding: 30, alignItems: 'center' },
          styles.buttons,
        ]}
      >
        <TouchableOpacity
          //  onPress={}
          style={{
            padding: 10,
            backgroundColor: '#ffcf00',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: 30,
            width: '100%',
          }}
        >
          <Text style={styles_signup.buttonText}>Continue</Text>
        </TouchableOpacity>
        <Text style={{ margin: 10, fontFamily: 'Fredoka-Bold', fontSize: 20 }}>
          OR
        </Text>

        <View style={{flexDirection: "row", maxWidth:"100%"}}>
          <TouchableOpacity
            onPress={handleSignin}
            style={[
              styles_signup.signupAlternates,
            ]}
          >
            <View>
              {/* Icon have to be added */}
              <Text style={styles_signup.signup_option}>
                Sign up with Google
              </Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={handleSignin}
            style={[
              styles_signup.signupAlternates,
              { width: '100%', justifyContent: 'space-between' },
            ]}
          >
            <View>
              <Text style={styles_signup.signup_option}>
                Sign up with Facebook
              </Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>


    <SafeAreaView style={signUpstage == 1 ? styles_signup.otpPopUpScreen: styles_signup.hide}>

      <View style={{flexDirection:'row' ,alignItems:"center", padding:2}}>

       <TouchableOpacity style={{height: 40, width:"11%"}}>
        <Image source={require('../assets/images/back_btn.png')} style={{height: "100%", width:"100%",}} resizeMode='contain'/>
        </TouchableOpacity>
        <View style={{flex:1, alignItems: "center"}}>
        <Text style={{color: "#ffbc00" , fontFamily: 'Fredoka-SemiBold', fontSize:28, letterSpacing: 2}}> Enter 4 digit code </Text>
        </View>

      </View>
      <View style={styles_signup.stage2Form}>

        <View>
          <Text></Text>
          <TextInput
            value={EmailOTP}
            onChangeNumber={onChangeEmailOTP}
            style={[styles.phoneNum, styles.input]}
          ></TextInput>
        </View>

      </View>
    </SafeAreaView>

    </>
  );
};

const styles_signup = StyleSheet.create({
  container: {
    backgroundColor: '#fff7ea',
  },

  progressBar: {
    flexDirection: 'row',
    alignItems: 'space-between',
    justifyContent: 'space-between',
    // borderWidth: 2,
    maxWidth: '60%',
    padding: 10,
    paddingVertical: 20,
  },
  bar: {
    height: 10,
    width: '45%',
    backgroundColor: '#ffcf00',
    borderRadius: 20,
    borderWidth: 0.2,
  },
  priestImg: {
    padding: 5,
    maxHeight: '40%',
    alignItems: 'center',
    justifyContent: 'center',
    // borderWidth: 3,
  },
  buttonText: {
    color: 'white',
    fontSize: 30,
    letterSpacing: 2,
    paddingVertical: 4,
    fontFamily: 'Fredoka-Bold',
    // fontWeight: "bold"
  },
  signupAlternates: {
    padding: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    maxWidth: "55%",
    // borderWidth: 2,
  },
  signup_option: {
    backgroundColor: 'white',
    padding: 15,
    fontSize: 12,
    alignSelf: 'center',
  },
  fade_screen: {
    position: 'absolute',
    backgroundColor: "grey",
    opacity: 0.3,
    zIndex: -99,
  },
  otpPopUpScreen: {
    top: "10%",
    position: 'relative',
    height: "90%",
    width: "99%",
    alignSelf: "center",
    backgroundColor: "#fff7ea",
    borderTopLeftRadius: 50,
    borderTopRightRadius: 50,
    padding: 20,
  },
  hide: {
    display: 'none',
  }
});

export default SignUp;
