import React from 'react';
import {
  Image,
  StyleSheet,
  View,
  Text,
  TextInput,
  Button,
  TouchableHighlight,
  TouchableOpacity,
} from 'react-native';
import {useState} from 'react';
import {SafeAreaView} from 'react-native-safe-area-context';
import {styles} from '../css/style';

const SignUp = () => {
  const [email, onChangeEmail] = useState('Enter your email');
  const [number, onChangeNumber] = useState('9876543210');
  const [countryCode, onChangeCountryCode] = useState('+91');

  return (
    <SafeAreaView style={styles_signup.container}>
      <View style={styles_signup.progressBar}>
        <View style={styles_signup.bar}></View>
        <View style={[styles_signup.bar, {backgroundColor: 'white'}]}></View>
      </View>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          // borderWidth: 2,
        }}>
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
          ]}>
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
          ]}>
          for Divine Positivity{' '}
        </Text>
      </View>

      <View style={styles.signupForm}>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'flex-start',
            paddingHorizontal: 10,
          }}>
          <TextInput
            style={[styles.emailInput, styles.input]}
            value={email}
            onChangeEmail={onChangeEmail}></TextInput>
        </View>
        <View
          style={{
            flexDirection: 'row',
            // borderWidth: 2,
            width: '100%',
            paddingHorizontal: 10,
          }}>
          <TextInput
            value={countryCode}
            onChangeCountryCode={onChangeCountryCode}
            style={[styles.countryCode, styles.input]}></TextInput>
          <TextInput
            value={number}
            onChangeNumber={onChangeNumber}
            style={[styles.phoneNum, styles.input]}></TextInput>
        </View>
      </View>

      <View style={styles_signup.priestImg}>
        <Image
          style={{resizeMode: 'contain', width: '80%'}}
          source={require('../assets/images/pandit-img.png')}
        />
      </View>

      <View style={[{margin: 5, padding: 30, alignItems: "center"}, styles.buttons]}>
        <TouchableOpacity
          //  onPress={}
          style={{
            padding: 10,
            backgroundColor: '#ffcf00',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: 30,
            width: "100%",
          }}>
          <Text style={styles_signup.buttonText}>Continue</Text>
        </TouchableOpacity>
        <Text style={{margin: 10, fontFamily: "Fredoka-Bold", fontSize: 20}}>OR</Text>

        <View style={[styles_signup.signupAlternates, {width:"100%", justifyContent: "space-between"}]}>
          <View>
            {/* Icon have to be added */}
            <Text style={styles_signup.signup_option}>Sign up with Google</Text>
          </View>
          <View>
            {/* Icon have to be added */}
            <Text style={styles_signup.signup_option}>Sign up with Google</Text>
          </View>
        </View>
      </View>
    </SafeAreaView>
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
    maxWidth: '50%',
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
    alignItems: "center",
    justifyContent: "space-between",
    // borderWidth: 2, 
  },
  signup_option: {
    backgroundColor: "white",
    padding: 15,
    fontSize: 12,
  }
});
export default SignUp;
