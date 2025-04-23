import AsyncStorage from '@react-native-async-storage/async-storage';
import CheckBox from '@react-native-community/checkbox';
import { OTPWidget } from '@msg91comm/sendotp-react-native';
import { React, useState, useEffect } from 'react';
import DateTimePicker from '@react-native-community/datetimepicker';
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
import { styles } from '../css/style';
import { GoogleSignin } from '@react-native-google-signin/google-signin';

const tokenAuth = '447695T9MQQ9m86807c6ffP1';

const saveValue = async (key, value) => {
  try {
    await AsyncStorage.setItem(key, value);
  } catch (error) {
    console.error('Error saving value', error);
  }
};

const saveToken = async (token) => {
  try {
    await AsyncStorage.setItem('authToken', token);
  } catch (error) {
    console.error('Error saving token', error);
  }
};

const sendOTPPhone = async (number) => {
  console.log('entered function');
  const PhoneWidgetId = '356476684d37333431323031';
  OTPWidget.initializeWidget(PhoneWidgetId, tokenAuth); //Widget initialization

  const data = {
    identifier: `91${number}`,
  };
  console.log('here');

  console.log('sending otp');
  const otp_response = await OTPWidget.sendOTP(data);
  return otp_response;
};

const sendOTPEmail = async (email) => {
  console.log('entered function');
  const PhoneWidgetId = '356476764375383138393037';
  OTPWidget.initializeWidget(PhoneWidgetId, tokenAuth); //Widget initialization

  const data = {
    identifier: email,
  };

  console.log('sending otp');
  const otp_response = await OTPWidget.sendOTP(data);
  return otp_response;
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

      try {
        const response = await fetch(
          'http://192.168.31.166:3000/api/client/register/user',
          // 'http://192.168.31.118:3000/api/client/register/user',
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
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
    } catch (error) {
      console.error('Google Sign-In Error:', error);
      Alert.alert('Login Failed', error.message);
      return error.message;
    }
  };

  const handleManualSignin = async () => {
    if (email && number) {
      const otp_phone_response = await sendOTPPhone(number);
      const otp_email_response = await sendOTPEmail(email);

      if (
        otp_phone_response.type == 'success' &&
        otp_email_response.type == 'success'
      ) {
        const messageIDPhone = otp_phone_response.message;
        const messageIDEmail = otp_email_response.message;
        await saveValue('phoneOTPMessageID', messageIDPhone);
        await saveValue('emailOTPMessageID', messageIDEmail);
        console.log('starting verification screen');
        setSignUpStage(1);
      } else {
        Alert.alert('Error', 'Server Unable to send OTP, Try Again later!');
      }
    } else {
      Alert.alert('Invalid Content', 'Please fill all details & Try Again!');
    }
  };

  const handleOTPVerification = async () => {
    console.log('Entered Verification');
    const messageIDPhone = await AsyncStorage.getItem('phoneOTPMessageID');
    const messageIDEmail = await AsyncStorage.getItem('emailOTPMessageID');
    console.log(messageIDPhone);
    // console.log(messageIDEmail)
    const body_phone = {
      reqId: messageIDPhone,
      otp: PhoneOTP,
    };
    const body_email = {
      reqId: messageIDEmail,
      otp: EmailOTP,
    };
    const responsePhoneOTP = await OTPWidget.verifyOTP(body_phone);
    const responseEmailOTP = await OTPWidget.verifyOTP(body_email);

    if (
      responsePhoneOTP.type == 'success' &&
      responseEmailOTP.type == 'success'
    ) {
      setSignUpStage(2);
    }
  };

  // Sign stage changer + tracker, Initial signUP stage : 0
  const [signUpstage, setSignUpStage] = useState(2);

  // For SignUp Stage 0
  const [email, setEmail] = useState('');
  const [number, setNumber] = useState('');
  const countryCode = '+91';

  // For SignUp Stage 1
  const [EmailOTP, setEmailOTP] = useState(null);
  const [PhoneOTP, setPhoneOTP] = useState(null);

  // For SignUp Stage 2
  const [isChecked, setIsChecked] = useState(false);
  const [firstName, setFirstName] = useState(null);
  const [lastName, setLastName] = useState(null);
  const [birth, setBirth] = useState(new Date());
  const [pass, setPass] = useState(null);
  const [confirmPass, setConfirmPass] = useState(null);
  const [date, setDate] = useState(new Date());

  const [showPicker, setShowPicker] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);

  const handleDateChange = (event, selectedDate) => {
    setShowPicker(false);
    if (selectedDate) {
      const formatted = selectedDate.toLocaleDateString(); // Format it your way
      setBirth(formatted);
    }
  };

  // const handleBirth = (event, selectedDate) => {
  //   // const onChangeDate = (event, selectedDate) => {
  //   setShowPicker(false);
  //   if (selectedDate) {
  //     setDate(selectedDate);
  //     setSelectedDate(selectedDate.toLocaleDateString()); // You can format as needed
  //   }
  // };

  return (
    <SafeAreaView>
      {/* Sign Up section Part 0 starts from here */}
      <View
        style={
          signUpstage != 0
            ? [styles_signup.container, styles_signup.fade_screen]
            : styles_signup.container
        }
      >
        <View style={styles_signup.progressBar}>
          <View
            style={[styles_signup.bar, { backgroundColor: 'white' }]}
          ></View>
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
              onChangeText={(value) => {
                setEmail(value);
              }}
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
              style={[styles.countryCode, styles.input]}
            ></TextInput>
            <TextInput
              value={number}
              placeholder="Phone Number"
              onChangeText={(value) => {
                setNumber(value);
              }}
              keyboardType="number-pad"
              maxLength={10} // optional, limit digits
              style={[styles.phoneNum, styles.input]}
            ></TextInput>
          </View>
        </View>

        <View style={[styles_signup.priestImg]}>
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
            onPress={handleManualSignin}
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
          <Text
            style={{ margin: 10, fontFamily: 'Fredoka-Bold', fontSize: 20 }}
          >
            OR
          </Text>

          <View style={{ flexDirection: 'row', maxWidth: '100%' }}>
            <TouchableOpacity
              onPress={handleSignin}
              style={[styles_signup.signupAlternates]}
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
      </View>

      {/* Sign Up section Part 1 starts from here */}
      <View
        style={
          signUpstage == 1 ? styles_signup.PopUpScreen : styles_signup.hide
        }
      >
        <View
          style={{ flexDirection: 'row', alignItems: 'center', padding: 2 }}
        >
          <TouchableOpacity
            onPress={() => {
              setSignUpStage(0);
            }}
            style={{ height: 40, width: '11%' }}
          >
            <Image
              source={require('../assets/images/back_btn.png')}
              style={{ height: '100%', width: '100%' }}
              resizeMode="contain"
            />
          </TouchableOpacity>
          <View style={{ flex: 1, alignItems: 'center' }}>
            <Text
              style={{
                color: '#ffbc00',
                fontFamily: 'Fredoka-SemiBold',
                fontSize: 28,
                letterSpacing: 2,
              }}
            >
              Enter 4 digit code
            </Text>
          </View>
        </View>
        <View style={styles_signup.stage2Form}>
          <View style={{ width: '90%', left: 20 }}>
            <Text style={{ color: '#aaaaaa' }}>Sent on email*</Text>
            <TextInput
              value={EmailOTP}
              onChangeText={(value) => {
                setEmailOTP(value);
              }}
              keyboardType="number-pad"
              maxLength={4} // optional, limit digits
              placeholder="----"
              style={[
                styles.input,
                {
                  borderRadius: 25,
                  margin: 0,
                  marginTop: 5,
                  height: 60,
                  fontSize: 28,
                  letterSpacing: 5,
                  paddingHorizontal: '10%',
                },
              ]}
            ></TextInput>
          </View>

          <View style={{ width: '90%', left: 20 }}>
            <Text style={{ color: '#aaaaaa' }}>Sent on phone*</Text>
            <TextInput
              value={PhoneOTP}
              onChangeText={(value) => {
                setPhoneOTP(value);
              }}
              keyboardType="number-pad"
              maxLength={4} // optional, limit digits
              placeholder="----"
              style={[
                styles.input,
                {
                  borderRadius: 25,
                  margin: 0,
                  marginTop: 5,
                  height: 60,
                  fontSize: 28,
                  letterSpacing: 5,
                  paddingHorizontal: '10%',
                },
              ]}
            ></TextInput>
          </View>

          <TouchableOpacity
            onPress={handleOTPVerification}
            style={{
              marginTop: 30,
              padding: 8,
              backgroundColor: '#ffcf00',
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: 20,
              width: '95%',
              alignSelf: 'center',
              height: 60,
            }}
          >
            <Text style={styles_signup.buttonText}>Verify</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Sign Up section Part 2 starts from here */}

      <View
        style={
          signUpstage == 2 ? styles_signup.PopUpScreen : styles_signup.hide
        }
      >
        <View
          style={{ flexDirection: 'row', alignItems: 'center', padding: 2 }}
        >
          <TouchableOpacity
            onPress={() => {
              setSignUpStage(0);
            }}
            style={{ height: 40, width: '11%' }}
          >
            <Image
              source={require('../assets/images/back_btn.png')}
              style={{ height: '100%', width: '100%' }}
              resizeMode="contain"
            />
          </TouchableOpacity>
          <View style={{ flex: 1, alignItems: 'center' }}>
            <Text
              style={{
                color: '#ffbc00',
                fontFamily: 'Fredoka-SemiBold',
                fontSize: 28,
                letterSpacing: 2,
              }}
            >
              Finishing signing up
            </Text>
          </View>
        </View>
        <View style={styles_signup.stage2Form}>
          <View style={{ width: '90%', left: 20 }}>
            <TextInput
              value={firstName}
              onChangeNumber={(value) => {
                setFirstName(value);
              }}
              keyboardType="default"
              placeholder="Fisrt Name*"
              style={[styles.input, styles_signup.finalFormInput]}
            ></TextInput>
          </View>

          <View style={{ width: '90%', left: 20 }}>
            <TextInput
              value={lastName}
              onChangeNumber={(value) => {
                setLastName(value);
              }}
              // keyboardType="number-pad"
              placeholder="Last Name*"
              style={[styles.input, styles_signup.finalFormInput]}
            ></TextInput>
          </View>

          <View style={{ width: '90%', left: 20 }}>
            <TouchableOpacity
              onPress={() => setShowPicker(true)}
              // onPress={handleBirth}
              // keyboardType="number-pad"
              placeholder="Birthday"
              style={[styles.input, styles_signup.finalFormInput, ""]}
            >
              <Text style={{ color: birth ? '#000' : '#999' }}>
                Birthday
              </Text>
            </TouchableOpacity>
            {showPicker && (
              <DateTimePicker
                value={birth ? new Date(birth) : new Date(2000, 0, 1)}
                mode="date"
                display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                maximumDate={new Date()}
                onChange={handleDateChange}
              />
            )}
          </View>

          <View style={{ width: '90%', left: 20 }}>
            <TextInput
              value={pass}
              onChangeNumber={(value) => {
                setPass(value);
              }}
              // keyboardType="number-pad"
              placeholder="Password*"
              style={[styles.input, styles_signup.finalFormInput]}
            ></TextInput>
          </View>

          <View style={{ width: '90%', left: 20 }}>
            <TextInput
              value={confirmPass}
              onChangeNumber={(value) => {
                setConfirmPass(value);
              }}
              // keyboardType="number-pad"
              placeholder="Confirm Password*"
              style={[styles.input, styles_signup.finalFormInput]}
            ></TextInput>
          </View>

          <View style={sty}>
            <CheckBox
              // value={isChecked}[[]]
              onValueChange={setIsChecked}
              tintColors={{ true: '#007aff', false: '#aaa' }}
            />

            <Text style={{ color: '#aaaaaa' }}>
              By Selecting Agree & Continue, I agree with{' '}
              <Text style={{ color: '#38b6ff' }}>
                Terms and Conditions, Payment Terms of Service and Privacy
                Policies.
              </Text>
            </Text>
          </View>

          <TouchableOpacity
            // onPress={}
            style={{
              marginTop: 30,
              padding: 8,
              backgroundColor: '#ffcf00',
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: 20,
              width: '95%',
              alignSelf: 'center',
              height: 60,
            }}
          >
            <Text style={styles_signup.buttonText}>Verify</Text>
          </TouchableOpacity>
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
    maxWidth: '55%',
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
    backgroundColor: 'grey',
    opacity: 0.3,
    zIndex: -99,
  },
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
  stage2Form: {
    marginTop: 20,
    width: '100%',
    height: '50%',
    gap: 15,
  },
  hide: {
    display: 'none',
  },
  finalFormInput: {
    borderRadius: 25,
    fontFamily: 'Fredoka-Medium',
    margin: 0,
    marginTop: 5,
    height: 60,
    fontSize: 18,
    letterSpacing: 2,
    paddingHorizontal: '10%',
    color: '#aaaaaa',
  },
});

export default SignUp;
