import React, { useEffect } from 'react';
import { SafeAreaView, Alert } from 'react-native';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import DotsLoader from '../components/DotsLoader';
import SignUpStage0 from '../components/SignUpStage0';
import SignUpStage1 from '../components/SignUpStage1';
import SignUpStage2 from '../components/SignUpStage2';
import { useSignUpState } from '../hooks/useSignUpState';
import * as authService from '../services/authService';
import * as storageService from '../services/storageService';

const SignUp = ({ navigation }) => {
  const signupState = useSignUpState();

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
        '842164284838-nuqnp2moeos51tki7r5l8ee3tnvn3inc.apps.googleusercontent.com',
    });
  }, []);

  /**
   * Handle Google Sign-In
   */
  const handleGoogleSignin = async () => {
    signupState.setDisplayDotLoader(true);
    try {
      await GoogleSignin.hasPlayServices();
      const userInfo = await GoogleSignin.signIn();
      const user_data = userInfo.data.user;

      const response = await authService.registerUserGoogle(user_data);

      if (response.success) {
        await storageService.saveToken(response.token);
        // Save email and phone for later profile fetching
        console.log("User Data: ", user_data);
        await storageService.saveValue('userEmail', user_data.email);
        await storageService.saveValue('userPhone', user_data.phoneNumber || '');
        signupState.setDisplayDotLoader(false);
        navigation.navigate('Home');
      } else {
        signupState.setDisplayDotLoader(false);
        Alert.alert(
          'Login Failed',
          'Server refused the sign in request!'
        );
      }
    } catch (error) {
      signupState.setDisplayDotLoader(false);
      console.error('Google Sign-In Error:', error);
      Alert.alert('Login Failed', error.message);
    }
  };

  /**
   * Handle Facebook Sign-In
   */
  const handleFacebookSignin = async () => {
    signupState.setDisplayDotLoader(true);
    try {
      // TODO: Implement Facebook Sign-In logic
      // For now, show a placeholder alert
      Alert.alert(
        'Coming Soon',
        'Facebook Sign-In will be implemented soon!'
      );
      signupState.setDisplayDotLoader(false);
    } catch (error) {
      signupState.setDisplayDotLoader
      (false);
      console.error('Facebook Sign-In Error:', error);
      Alert.alert('Login Failed', error.message);
    }
  };

  /**
   * Handle Manual Sign-In (Email & Phone)
   */
  const handleManualSignin = async () => {
    signupState.setDisplayDotLoader(true);

    if (!signupState.email || !signupState.number) {
      signupState.setDisplayDotLoader(false);
      Alert.alert('Invalid Content', 'Please fill all details & Try Again!');
      return;
    }

    try {
      // Send OTP to phone
      const otp_phone_response = await authService.sendOTPPhone(
        signupState.number
      );

      // Send verification email
      const email_response = await authService.sendVerificationMail(
        signupState.email
      );

      if (otp_phone_response.type === 'success') {
        const messageIDPhone = otp_phone_response.message;

        await storageService.saveValue('phoneOTPMessageID', messageIDPhone);

        signupState.setDisplayDotLoader(false);
        signupState.setSignUpStage(1);
        signupState.startResendTimer();
      } else {
        signupState.setDisplayDotLoader(false);
        Alert.alert(
          'Error',
          'Server unable to send OTP. Try again later!'
        );
      }
    } catch (error) {
      signupState.setDisplayDotLoader(false);
      console.error('Error in manual signin:', error);
      Alert.alert('Error', error.message);
    }
  };

  /**
   * Handle OTP Verification (Phone Only)
   */
  const handleOTPVerification = async () => {
    signupState.setDisplayDotLoader(true);

    try {
      const messageIDPhone = await storageService.getValue('phoneOTPMessageID');

      const responsePhoneOTP = await authService.verifyPhoneOTP(
        signupState.PhoneOTP,
        messageIDPhone
      );

      if (responsePhoneOTP) {
        const user_exist = await authService.checkUserExists(
          signupState.email,
          signupState.number
        );
        console.log("User Exist Response: ", user_exist);

        if (user_exist.exist) {
          // User exists, perform login
          console.log("User exists:", user_exist);
          console.log("User exists, performing login at OTP verification", user_exist);
          const login_response = await authService.loginUser(signupState.email, signupState.number);

          if (login_response.success) {
            await storageService.saveToken(login_response.token);
            signupState.setDisplayDotLoader(false);
            navigation.navigate('Home');
          } else {
            signupState.setDisplayDotLoader(false);
            Alert.alert(
              'Account not found!',
              'Try again later or recheck your Email & Phone.'
            );
          }
        } else {
          // New user, proceed to stage 2
          console.log("New user, proceeding to stage 2 at OTP verification");
          signupState.setDisplayDotLoader(false);
          signupState.setSignUpStage(2);
        }
      } else {
        signupState.setDisplayDotLoader(false);
        Alert.alert('Invalid OTP!', 'Please try again by rechecking the OTP.');
      }
    } catch (error) {
      signupState.setDisplayDotLoader(false);
      console.error('Error in OTP verification:', error);
      Alert.alert('Error', error.message);
    }
  };

  /**
   * Complete Sign-Up Process
   */
  const finishSignUp = async () => {
    if (
      !signupState.firstName ||
      !signupState.lastName ||
      !signupState.birth ||
      !signupState.gender ||
      !signupState.isChecked
    ) {
      Alert.alert('Error!', 'Please fill out all fields and agree to terms.');
      return;
    }

    signupState.setDisplayDotLoader(true);

    const user_data = {
      email: signupState.email,
      name: `${signupState.firstName} ${signupState.lastName}`,
      photo: 'none',
      phone: signupState.number,
      dob: signupState.birth,
      gender: signupState.gender,
      e_verified: false,
    };

    try {
      const response = await authService.registerUserManual(user_data);

      if (response.success) {
        await storageService.saveToken(response.token);
        // Save email and phone for later profile fetching
        await storageService.saveValue('userEmail', signupState.email);
        await storageService.saveValue('userPhone', signupState.number);
        signupState.setDisplayDotLoader(false);
        navigation.navigate('Home');
      } else {
        signupState.setDisplayDotLoader(false);
        Alert.alert(
          'Registration Failed',
          'Server refused the registration request!'
        );
      }
    } catch (error) {
      signupState.setDisplayDotLoader(false);
      console.error('Error in signup:', error);
      Alert.alert('Registration Failed', error.message);
    }
  };

  return (
    <SafeAreaView style={{ borderWidth: 5, flex: 1 }}>
      {signupState.DisplayDotLoader && <DotsLoader />}

      <SignUpStage0
        email={signupState.email}
        setEmail={signupState.setEmail}
        number={signupState.number}
        setNumber={signupState.setNumber}
        countryCode={signupState.countryCode}
        onContinue={handleManualSignin}
        onGoogleSignin={handleGoogleSignin}
        onFacebookSignin={handleFacebookSignin}
        isLoading={signupState.DisplayDotLoader}
        signUpStage={signupState.signUpStage}
      />

      <SignUpStage1
        PhoneOTP={signupState.PhoneOTP}
        setPhoneOTP={signupState.setPhoneOTP}
        resendActive={signupState.resendActive}
        resendTimer={signupState.resendTimer}
        onVerify={handleOTPVerification}
        onBack={signupState.resetToStage0}
        onResend={handleManualSignin}
        signUpStage={signupState.signUpStage}
      />

      <SignUpStage2
        firstName={signupState.firstName}
        setFirstName={signupState.setFirstName}
        lastName={signupState.lastName}
        setLastName={signupState.setLastName}
        birth={signupState.birth}
        setBirth={signupState.setBirth}
        gender={signupState.gender}
        setGender={signupState.setGender}
        showGenderPicker={signupState.showGenderPicker}
        setShowGenderPicker={signupState.setShowGenderPicker}
        showPicker={signupState.showPicker}
        setShowPicker={signupState.setShowPicker}
        isChecked={signupState.isChecked}
        setIsChecked={signupState.setIsChecked}
        onComplete={finishSignUp}
        onBack={signupState.resetToStage0}
        signUpStage={signupState.signUpStage}
      />
    </SafeAreaView>
  );
};

export default SignUp;