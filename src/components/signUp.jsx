import React from 'react';
import { Image, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const SignUp = () => {
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
            <Textarea style={styles.emailInput}></Textarea>
            <View>
            <Textarea style={styles.countryCode}></Textarea>
            <Textarea style={styles.phoneNum}></Textarea>

            </View>
        </View>

        <View style={styles.priestImg}>
            <Image source={require('../../assets//images/pandit-img.png')}/>
        </View>

        <View style={styles.buttons}>
        </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({})

export default SignUp;
