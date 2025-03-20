import React from 'react';
import {Image, StyleSheet, View, Text, TextInput} from 'react-native';
import {useState} from 'react';
import {SafeAreaView} from 'react-native-safe-area-context';

const SignUp = () => {
  const [email, onChangeEmail] = useState('someone@gmai.com');
  const [number, onChangeNumber] = useState('9876543210');
  const [countryCode, onChangeCountryCode] = useState('+91');

  return (
    <SafeAreaView>
      <View style={styles.progressBar}>
        <View style={styles.bar1}></View>
        <View style={styles.bar2}></View>
      </View>
      <View style={styles.title}>
        <Text> Join US </Text>
        <Text> for Divine Positivity </Text>
      </View>

      <View style={styles.signupForm}>
        <TextInput style={styles.emailInput} value={email} onChangeEmail={onChangeEmail}></TextInput>
        <View>
          <TextInput value={countryCode} onChangeCountryCode={onChangeCountryCode} style={styles.countryCode}></TextInput>
          <TextInput value={number} onChangeNumber={onChangeNumber} style={styles.phoneNum}></TextInput>
        </View>
      </View>

      <View style={styles.priestImg}>
        <Image source={require('../assets/images/pandit-img.png')} />
      </View>

      <View style={styles.buttons}></View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({});

export default SignUp;
