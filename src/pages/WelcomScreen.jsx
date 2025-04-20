import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  Dimensions,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';

const { width, height } = Dimensions.get('window');
export default function WelcomeScreen({ navigation }) {
  return (
    <SafeAreaView style={styles.container}>
      {/* Double Lines bar */}
      <View style={styles.progressBar}>
        <View style={styles.bar}></View>
        <View style={[styles.bar, { backgroundColor: 'white' }]}></View>
      </View>

      <View style={{ width: width, height: 80, flex: 1, marginTop: '40%' }}>
        {/* Logo  */}
        <View style={styles.imageContainer}>
          <Image
            style={{
              width: width / 1.5,
              justifyContent: 'center',
              alignItems: 'center',
            }}
            source={require('../assets/Logo.png')} // Replace with your image path
            resizeMode="contain"
          />
        </View>

        <View style={styles.textContainer}>
          {/* Welcome Content */}
          <Text style={styles.title}>Welcome to</Text>
          <Text style={styles.title}>PujaHarGhar, let's</Text>
          <Text style={styles.subtitle}>
            Bringing temple peace, timeless traditions, and modern convenience
            into your home.
          </Text>
        </View>

        {/* Proceed Button */}
        <TouchableOpacity
          style={styles.button}
          onPress={() => {
            navigation?.navigate('SignUp');
          }}
        >
          <Text style={styles.buttonText}>Proceed</Text>
        </TouchableOpacity>
      </View>
      {/* FAQ */}
      <Text style={styles.faqText}>
        Having Some Reasonable Doubts?{' '}
        <Text
          style={styles.faqLink}
          onPress={() => navigation?.navigate('FAQ')}
        >
          FAQ
        </Text>
      </Text>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    backgroundColor: '#f9f7f9',
    flex: 1,
    position: 'relative',
    paddingHorizontal: 20,
  },
  progressBar: {
    flexDirection: 'row',
    marginTop: 20,
    height: 10,
    width: '60%',
    justifyContent: "space-between",
    alignSelf: 'flex-start',
    // position:'absolute',
    // left:'5%',
    // top:0,
  },
  bar: {
    // marginRight: 5,
    height: 10,
    width: '45%',
    backgroundColor: '#ffcf00',
    borderRadius: 20,
    borderWidth: 0.2,
  },

  

  imageContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    width: width,
    height: '25%',
    overflow: 'hidden',
    marginBottom: '5%',
    marginTop: '0%',
    // backgroundColor:'red'
  },
  image: {
    width: 200,
    height: 200,
  },
  textContainer: {
    fontFamily: 'Fredoka-SemiBold',

    alignItems: 'center',
    paddingHorizontal: 10,
  },
  title: {
    fontSize: 30,
    fontWeight: '800',
    color: '#000',
  },

  subtitle: {
    marginTop: 10,
    fontSize: 14,
    color: '#888',
    textAlign: 'center',
    paddingHorizontal: 20,
  },
  button: {
    backgroundColor: '#FFBF00',
    paddingVertical: 14,
    paddingHorizontal: 50,
    borderRadius: 50,
    marginTop: 40,
    width: '90%',
    marginHorizontal: 'auto',
  },
  buttonText: {
    textAlign: 'center',
    color: '#fff',
    fontSize: 18,
    fontWeight: '900',
  },
  faqText: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
    marginBottom: 10,
  },
  faqLink: {
    color: '#444',
    textDecorationLine: 'underline',
  },
});
