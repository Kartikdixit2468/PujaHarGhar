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

const SignUpStage1 = ({
  PhoneOTP,
  setPhoneOTP,
  resendActive,
  resendTimer,
  onVerify,
  onBack,
  onResend,
  signUpStage,
}) => {
  return (
    <View
      style={
        signUpStage === 1
          ? styles_stage1.PopUpScreen
          : styles_stage1.hide
      }
    >
      {/* Header with Back Button */}
      <View style={{ flexDirection: 'row', alignItems: 'center', padding: 2 }}>
        <TouchableOpacity
          onPress={onBack}
          style={{ height: 40, width: '11%' }}
        >
          <Image
            source={require('../assets/images/back_btn.png')}
            style={{ height: '100%', width: '100%' }}
            resizeMode="contain"
          />
        </TouchableOpacity>
        <View style={{ flex: 1, alignItems: 'center' }}>
          <Text style={styles_stage1.headerText}>Enter 4 digit code</Text>
        </View>
      </View>

      {/* Form Container */}
      <View style={styles_stage1.stage1Form}>
        {/* Phone OTP Input */}
        <View style={{ width: '90%', left: 20 }}>
          <Text style={{ color: '#aaaaaa' }}>Enter OTP sent on your phone*</Text>
          <TextInput
            value={PhoneOTP}
            onChangeText={setPhoneOTP}
            keyboardType="number-pad"
            maxLength={4}
            placeholder="----"
            style={[
              styles.input,
              styles_stage1.otpInput,
            ]}
          />
        </View>

        {/* Resend OTP Section */}
        <View style={{ left: 10, maxWidth: '32%' }}>
          {resendActive ? (
            <TouchableOpacity onPress={onResend}>
              <Text style={styles_stage1.resendActiveText}>
                Resend OTP
              </Text>
            </TouchableOpacity>
          ) : (
            <Text style={styles_stage1.resendInactiveText}>
              Resend OTP in {resendTimer}
            </Text>
          )}
        </View>

        {/* Verify Button */}
        <TouchableOpacity
          onPress={onVerify}
          style={styles_stage1.verifyButton}
        >
          <Text style={styles_stage1.buttonText}>Verify</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles_stage1 = StyleSheet.create({
  PopUpScreen: {
    top: '10%',
    position: 'relative',
    height: '90%',
    width: '99%',
    alignSelf: 'center',
    backgroundColor: '#fff7ea',
    borderTopLeftRadius: 50,
    borderTopRightRadius: 50,
    padding: 20,
  },
  hide: {
    display: 'none',
  },
  headerText: {
    color: '#ffbc00',
    fontFamily: 'Fredoka-SemiBold',
    fontSize: 28,
    letterSpacing: 2,
  },
  stage1Form: {
    marginTop: 20,
    width: '100%',
    height: '50%',
    gap: 15,
  },
  otpInput: {
    borderRadius: 25,
    margin: 0,
    marginTop: 5,
    height: 60,
    fontSize: 28,
    letterSpacing: 5,
    paddingHorizontal: '10%',
  },
  resendActiveText: {
    color: '#3a86ff',
    textDecorationLine: 'underline',
    width: 'auto',
  },
  resendInactiveText: {
    color: '#adb5bd',
    width: 'auto',
  },
  verifyButton: {
    marginTop: 30,
    padding: 8,
    backgroundColor: '#ffcf00',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 20,
    width: '95%',
    alignSelf: 'center',
    height: 60,
  },
  buttonText: {
    color: 'white',
    fontSize: 20,
    letterSpacing: 2,
    paddingVertical: 4,
    fontFamily: 'Fredoka-Bold',
  },
});

export default SignUpStage1;
