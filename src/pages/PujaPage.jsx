import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Pressable,
  Alert,
} from 'react-native';
import { SERVER_IP } from '@env';
import AsyncStorage from '@react-native-async-storage/async-storage';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useRoute } from '@react-navigation/native';
import Swiper from 'react-native-swiper';
import { Dimensions } from 'react-native';

const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;

export default function PujaDetails({navigation}) {
  const route = useRoute();
  const { id } = route.params;

  const [pujaDetails, setPujaDetails] = useState([]);

  useEffect(() => {
    const fetchPujaDetails = async () => {
      try {
        const token = await AsyncStorage.getItem('authToken');
        const response = await fetch(
          `${SERVER_IP}/api/client/fetch/puja/details/${id}`,
          {
            method: 'GET',
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          }
        );

        const data = await response.json();
        if (data.success) {
          setPujaDetails(data.data);
        }
      } catch (error) {
        console.error('Error fetching puja details:', error);
      }
    };

    fetchPujaDetails();
  }, []);

  const imageUrls = [pujaDetails.img1, pujaDetails.img2, pujaDetails.img3];

  return (
    <ScrollView style={styles.container}>
      {/* Header */}

      {/* Image Carousel */}
      <View style={styles.pujaDetailsContainer}>
        <Text style={styles.sideTitle}>Puja Details</Text>
        <View style={styles.swiperContainer}>
          <Swiper
            style={styles.swiper}
            height={250}
            showsButtons={true}
            dotColor="white"
            activeDotColor="#f7b731"
            showsPagination={true}
            dot={<View style={styles.dot} />}
            activeDot={<View style={[styles.dot, styles.activeDot]} />}
            nextButton={<Text style={styles.arrowButtons}>›</Text>}
            prevButton={<Text style={styles.arrowButtons}>‹</Text>}
            autoplay
          >
            {imageUrls.map((url, index) => (
              <View
                key={index}
                style={{
                  width: 0.6 * width,
                  borderRadius: 40,
                  marginHorizontal: 'auto',
                  height: 0.55 * width,
                  position: 'absolute',
                  top: 0,
                  left: 0.2 * width,
                  overflow: 'hidden',
                }}
              >
                <Image
                  source={{
                    uri: `http://192.168.31.166:3000/uploads/pujas/${url}`,
                  }}
                  style={{ ...styles.image }}
                  resizeMode="cover"
                />
              </View>
            ))}
          </Swiper>
          <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
            {imageUrls.map((url, index) => (
              <Image
                key={index}
                // source={require('../assets/1.png')} // Replace with your image
                source={{
                  uri: `http://192.168.31.166:3000/uploads/pujas/${url}`,
                }}
                style={{
                  ...styles.image,
                  width: 0.12 * width,
                  height: 0.12 * width,
                  margin: 5,
                }}
                resizeMode="contain"
              />
            ))}
          </View>
        </View>

        {/* Title */}
        <Text style={styles.title}>{pujaDetails.NAME}</Text>
        <Text style={styles.titleAfter} />
        <View
          style={{
            display: 'flex',
            flexDirection: 'row',
            marginTop: 10,
            marginLeft: 15,
          }}
        >
          {[100, 100, 100, 7].map((item, index) =>
            item == 100 ? (
              <Ionicons name="star" key={index} size={20} color={'yellow'} />
            ) : (
              <Ionicons
                name="star-half"
                key={index}
                size={20}
                color={'yellow'}
              />
            )
          )}
        </View>
        {/* Description */}
        <Text style={styles.description}>
          {/* Ganesh Utsav Puja is a revered pujan festival dedicated to Lord
          Ganesha Lorem ipsum dolor sit amet consectetur adipisicing elit. Odio
          aliquam at. */}
          {pujaDetails.Description}
        </Text>

        {/* Book Now Button */}
        <TouchableOpacity 
        onPress={()=> {navigation.navigate('PackageSelectionScreen', {id: pujaDetails.PUJA_ID})}}
        style={styles.bookNow}
        >
          <Text style={styles.bookNowText}>Book Now</Text>
        </TouchableOpacity>

        {/* Benefits */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Benefits of the Pooja</Text>
          <Text style={styles.bullet}>
            • Mata Gauri kirpa se married women sada suhagan rahe
          </Text>
          <Text style={styles.bullet}>
            • Vastu dosh hata ke sukh samruddhi aye
          </Text>
          <Text style={styles.bullet}>
            • Sakat chauth ki pooja se santaan sukh mile
          </Text>
        </View>

        {/* How the pooja will be performed */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            How the Pooja will be performed?
          </Text>
          <Text style={styles.bullet}>• Pooja will be held live</Text>
          <Text style={styles.bullet}>
            • Videos will be shared in WhatsApp/Telegram
          </Text>
          <Text style={styles.bullet}>
            • Pandit will perform your name gotra sankalp
          </Text>
        </View>
      </View>

      {/* Promises */}
      <View style={styles.promisesContainer}>
        <Text style={styles.title}> Our Promises</Text>
        <Text style={{ ...styles.titleAfter, width: 0.4 * width }} />

        <View style={styles.promises}>
          {[
            { promise: 'Experienced Pandits', image: 'color-filter' },
            { promise: 'Vedic Standards and Procedures', image: 'library' },
            { promise: '100% Puja Benifits', image: 'ribbon' },
            { promise: 'High Quality Samagri', image: 'logo-electron' },
            {
              promise: 'Professional Guidance and Support',
              image: 'person-sharp',
            },
          ].map((item, index) => (
            <View
              key={index}
              style={{
                alignItems: 'center',
                justifyContent: 'center',
                width: '20%',
              }}
            >
              <Ionicons name={item.image} size={25} color="#ffcf00" />
              <Text
                style={{
                  fontWeight: '700',
                  fontFamily: 'Fredoka-SemiBold',
                  color: '#000',
                  fontSize: 10,
                  textAlign: 'center',
                }}
              >
                {item.promise}
              </Text>
            </View>
          ))}
        </View>
      </View>

      {/* Customer Reviews */}
      <View style={styles.customerReviewsContainer}>
        <Text style={styles.title}>Customers Reviews</Text>
        <Text style={{ ...styles.titleAfter, width: '55%' }} />

        <ScrollView
          horizontal={true}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 10 }}
          style={styles.customerReviews}
        >
          {[
            {
              name: 'Vrinda',
              review:
                'My Experience with Puja Har Ghar was amazing. I booked Ganesh Utsav Puja and the pandit was very knowledgeable and performed the rituals with utmost devotion. Highly recommend!',
              image: '../../assets/images/vrindiiiiiii.jpeg',
              rating: 4.5,
            },
            {
              name: 'Palak',
              review:
                'My Experience with Puja Har Ghar was amazing. I booked Ganesh Utsav Puja and the pandit was very knowledgeable and performed the rituals with utmost devotion. Highly recommend!',
              image: '../../assets/images/vrindiiiiiii.jpeg',
              rating: 4.5,
            },
            {
              name: 'Vrinda',
              review:
                'My Experience with Puja Har Ghar was amazing. I booked Ganesh Utsav Puja and the pandit was very knowledgeable and performed the rituals with utmost devotion. Highly recommend!',
              image: '../../assets/images/vrindiiiiiii.jpeg',
              rating: 2.5,
            },
            {
              name: 'Vrinda',
              review:
                'My Experience with Puja Har Ghar was amazing. I booked Ganesh Utsav Puja and the pandit was very knowledgeable and performed the rituals with utmost devotion. Highly recommend!',
              image: '../../assets/images/vrindiiiiiii.jpeg',
              rating: 4.5,
            },
            {
              name: 'Shreya',
              review:
                'My Experience with Puja Har Ghar was amazing. I booked Ganesh Utsav Puja and the pandit was very knowledgeable and performed the rituals with utmost devotion. Highly recommend!',
              image: '../../assets/images/vrindiiiiiii.jpeg',
              rating: 3.5,
            },
          ].map((item, index) => (
            <View key={index} style={styles.reviewCard}>
              <View
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginTop: 5,
                }}
              >
                <MaterialCommunityIcons
                  name={
                    item.rating >= 3
                      ? 'emoticon-happy'
                      : 'emoticon-neutral'
                      // ? 'emoticon-happy-outline'
                      // : 'emoticon-neutral-outline'
                  }
                  key={index}
                  size={50}
                  // color="#ffcf00"
                  color="#ffd52e"
                  style={{
                    marginBottom: 5,
                  }}
                />

                <Text
                  style={{
                    fontSize: 20,
                    fontWeight: 'bold',
                    marginLeft: 10,
                    marginTop: -10,
                  }}
                >
                  {item.name}
                </Text>
                <View style={{ display: 'flex', flexDirection: 'row' }}>
                  {[...Array(5).keys()].map((num, index) =>
                    num < item.rating - 1 ? (
                      <Ionicons
                        name="star"
                        key={index}
                        size={18}
                        color={'#ffd52e'}
                      />
                    ) : num - item.rating == 0.5 ? (
                      <Ionicons
                        name="star-outline"
                        key={index}
                        size={18}
                        color={'#ffd52e'}
                      />
                    ) : (
                      <Ionicons
                        name="star-half"
                        key={index}
                        size={18}
                        color={'#ffd52e'}
                      />
                    )
                  )}
                </View>
              </View>
              <Text
                style={{
                  fontSize: 11.5,
                  // letterSpacing: 0.5,
                  textAlign: "center",
                  color: '#333',
                  margin: 'auto',
                  paddingHorizontal: 8,
                  fontWeight: "500"
                }}
              >
                {item.review}
              </Text>
            </View>
          ))}
        </ScrollView>

        <Text
          style={{
            width: 0.2 * width,
            margin: 'auto',
            marginBottom: 50,
            height: 5,
            backgroundColor: '#FFEA00',
          }}
        />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  pujaDetailsContainer: {
    marginTop: 5,
  },
  swiperContainer: {
    marginTop: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#fff',
  },
  headerTitle: { fontSize: 18, fontWeight: 'bold', color: '#222' },
  swiper: {
    marginBottom: 16,

    color: 'yellow',
  },
  image: {
    width: '100%',
    height: '100%',
    borderRadius: 10,
  },
  title: {
    fontSize: 0.055 * width,
    fontWeight: '900',
    paddingHorizontal: 16,
    marginTop: 10,
  },

  description: {
    fontSize: 14,
    paddingHorizontal: 16,
    marginTop: 8,
    color: '#555',
  },
  bookNow: {
    backgroundColor: '#FFcf00',
    margin: 16,
    paddingVertical: 8,
    borderRadius: 8,
    alignItems: 'center',
  },
  bookNowText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 0.045 * width,
  },
  section: { paddingHorizontal: 16, marginTop: 20 },
  sectionTitle: { fontSize: 16, fontWeight: 'bold', marginBottom: 8 },
  bullet: { fontSize: 14, marginBottom: 4, color: '#444' },
  sideTitle: {
    padding: 14,
    paddingStart: 50,
    marginLeft: -24,
    marginTop: 15,
    backgroundColor: '#ffcf00',
    maxWidth: width * 0.45,
    fontSize: 0.045 * width,
    borderRadius: 50,
    fontWeight: 900,
    borderStartStartRadius: 50,
    borderTopEndRadius: 50,
  },
  arrowButtons: {
    color: '#f7b731',
    fontSize: 0.18 * width,
  },
  titleAfter: {
    width: 0.7 * width,
    marginLeft: 15,
    height: height * 0.003,

    backgroundColor: '#f7b731',
  },
  dot: {
    backgroundColor: '#ccc', // Inactive dot color
    width: 8,
    height: 8,
    borderRadius: 4,
    margin: 4,
    marginTop: 20,
  },
  activeDot: {
    backgroundColor: '#FFD700', // Active dot color (yellow/gold)
    borderRadius: 5,
  },
  promisesContainer: {
    paddingVertical: 8,
  },
  promises: {
    width: 0.9 * width,
    height: 0.1 * height,
    backgroundColor: '#fffaf1',
    borderRadius: 20,
    margin: 'auto',
    marginTop: 10,
    display: 'flex',
    flexDirection: 'row',
    paddingHorizontal: 5,
    overflow: 'hidden',
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#fcd34d',
  },
  reviewCard: {
    display: 'flex',
    width: 0.4 * width,
    height: 0.25 * height,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#f7b731',
    backgroundColor: '#fffaf1',
    margin: 10,
    alignContent: 'center',
    flexDirection: 'column',
    padding: 5,
    overflow: 'hidden',
  },
  customerReviewsContainer: {
    display: 'flex',
    flexDirection: 'column',
  },
  customerReviews: {
    paddingVertical: 8,
    marginTop: 10,

    borderRadius: 20,
    margin: 'auto',
    display: 'flex',
    flexDirection: 'row',
    paddingHorizontal: 5,
    // overflow:'hidden',
  },
});
