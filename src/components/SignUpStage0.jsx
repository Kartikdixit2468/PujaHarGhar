import React from 'react';
import {
  View,
  Text,
  Image,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { styles } from '../css/style';

const SignUpStage0 = ({
  email,
  setEmail,
  number,
  setNumber,
  countryCode,
  onContinue,
  onGoogleSignin,
  onFacebookSignin,
  isLoading,
  signUpStage,
}) => {
  return (
    <View style={[
      styles_stage0.container,
      signUpStage === 0 ? styles_stage0.containerVisible : styles_stage0.containerHidden
    ]}>
      <View style={[{ zIndex: signUpStage !== 0 ? -1 : 1 }]}>
      {/* Progress Bar */}
      <View style={styles_stage0.progressBar}>
        <View style={[styles_stage0.bar, { backgroundColor: 'white' }]}></View>
        <View style={styles_stage0.bar}></View>
      </View>

      {/* Header */}
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
        }}
      >
        <Text
          style={[
            {
              alignItems: 'center',
              borderRadius: 2,
              padding: 12,
              backgroundColor: '#ffcf00',
              borderBottomRightRadius: 30,
              borderTopRightRadius: 30,
              color: 'white',
            },
            styles.signup_title,
          ]}
        >
          Join Us
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
          for Divine Positivity
        </Text>
      </View>

      {/* Form Inputs */}
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
            placeholder="Enter your Email"
            onChangeText={setEmail}
          />
        </View>
        <View
          style={{
            flexDirection: 'row',
            width: '100%',
            paddingHorizontal: 10,
          }}
        >
          <TextInput
            value={countryCode}
            style={[styles.countryCode, styles.input]}
            editable={false}
          />
          <TextInput
            value={number}
            placeholder="Phone Number"
            onChangeText={setNumber}
            keyboardType="number-pad"
            maxLength={10}
            style={[styles.phoneNum, styles.input]}
          />
        </View>
      </View>

      {/* Priest Image */}
      <View style={styles_stage0.priestImg}>
        <Image
          style={{ resizeMode: 'contain', width: '80%' }}
          source={require('../assets/images/pandit-img.png')}
        />
      </View>

      {/* Buttons */}
      <View
        style={[
          { margin: 5, padding: 30, alignItems: 'center' },
          styles.buttons,
        ]}
      >
        <TouchableOpacity
          onPress={onContinue}
          disabled={isLoading}
          style={{
            padding: 10,
            backgroundColor: '#ffcf00',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: 30,
            width: '100%',
          }}
        >
          <Text style={styles_stage0.buttonText}>Continue</Text>
        </TouchableOpacity>
        <Text
          style={{ margin: 10, fontFamily: 'Fredoka-Bold', fontSize: 20 }}
        >
          OR
        </Text>

        <View style={{ flexDirection: 'row', maxWidth: '100%' }}>
          <TouchableOpacity 
            onPress={onGoogleSignin}
            disabled={isLoading}
            style={styles_stage0.signupAlternates}
          >
            <View>
              <Text style={styles_stage0.signup_option}>
                Sign up with Google
              </Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={onFacebookSignin}
            disabled={isLoading}
            style={[
              styles_stage0.signupAlternates,
            ]}
          >
            <View>
              <Text style={styles_stage0.signup_option}>
                Sign up with Facebook
              </Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>
      </View>
      
      {/* Overlay when loading */}
      {signUpStage !== 0 && (
        <View style={styles_stage0.fade_screen}></View>
      )}
    </View>
  );
};

const styles_stage0 = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    height: '100%',
    width: '100%',
    backgroundColor: '#fff7ea',
    zIndex: 50,
  },
  containerVisible: {
    opacity: 1,
    pointerEvents: 'auto',
  },
  containerHidden: {
    opacity: 0,
    pointerEvents: 'none',
  },
  progressBar: {
    flexDirection: 'row',
    alignItems: 'space-between',
    justifyContent: 'space-between',
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
    maxHeight: '38%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 30,
    letterSpacing: 2,
    paddingVertical: 4,
    fontFamily: 'Fredoka-Bold',
  },
  signupAlternates: {
    padding: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    alignSelf: 'center',
    margin: 'auto',    
  },
  signup_option: {
    backgroundColor: 'white',
    padding: 15,
    fontSize: 12,
    alignSelf: 'center',
    borderWidth: 0.5,
    borderColor: 'grey',
    borderRadius: 3,
  },
  fade_screen: {
    position: 'absolute',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    zIndex: 100,
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
});

export default SignUpStage0;
