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
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import { useRoute } from '@react-navigation/native';
import Swiper from 'react-native-swiper';
import { Dimensions } from 'react-native';
import { useProfileGuard } from '../components/useProfileGuard';
import { useAuth } from '../context/AuthContext';

const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;

export default function PujaDetails({ navigation }) {
  const guardProfile = useProfileGuard();

  const { isLoggedIn, profileCompleted } = useAuth();
  const route = useRoute();
  const { id } = route.params;

  const [pujaDetails, setPujaDetails] = useState([]);

  useEffect(() => {
    const fetchPujaDetails = async () => {
      try {
        const token = await AsyncStorage.getItem('authToken');
        console.log(SERVER_IP);
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
        console.log('Check it here!');
        console.log(data);
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

  const handleBookNow = () => {
    if (!guardProfile()) return;
    navigation.navigate('PackageSelectionScreen', { id: pujaDetails.puja_id });
  };

  return (
    <View style={styles.container}>
      {/* Custom Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.headerButton}
        >
          <Ionicons name="chevron-back" size={28} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Puja Details</Text>
        <View style={styles.headerButton} />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        style={styles.scrollContent}
      >
        {/* Image Carousel */}
        <View style={styles.swiperContainer}>
          <Swiper
            style={styles.swiper}
            height={280}
            showsButtons={false}
            dotColor="#D4A574"
            activeDotColor="#8B7355"
            showsPagination={true}
            dot={<View style={styles.dot} />}
            activeDot={<View style={[styles.dot, styles.activeDot]} />}
            autoplay
          >
            {imageUrls.map((url, index) => (
              <View key={index} style={styles.swiperImageWrapper}>
                <Image
                  source={{ uri: `${SERVER_IP}/uploads/pujas/${url}` }}
                  style={styles.swiperImage}
                  resizeMode="cover"
                />
              </View>
            ))}
          </Swiper>
        </View>

        {/* Title & Description Section */}
        <View style={styles.titleSection}>
          <Text style={styles.title}>{pujaDetails.name}</Text>
          <Text style={styles.description}>{pujaDetails.description}</Text>
        </View>

        {/* Book Now Button */}
        <TouchableOpacity onPress={handleBookNow} style={styles.bookNow}>
          <FontAwesome5 name="calendar-alt" size={16} color="#fff" />
          <Text style={styles.bookNowText}>Book Now</Text>
        </TouchableOpacity>

        {/* Benefits Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>✨ Benefits of the Pooja</Text>
          <View style={styles.benefitsWrapper}>
            <View style={styles.benefitItem}>
              <View style={styles.benefitDot} />
              <Text style={styles.benefitText}>
                Mata Gauri kirpa se married women sada suhagan rahe
              </Text>
            </View>
            <View style={styles.benefitItem}>
              <View style={styles.benefitDot} />
              <Text style={styles.benefitText}>
                Vastu dosh hata ke sukh samruddhi aye
              </Text>
            </View>
            <View style={styles.benefitItem}>
              <View style={styles.benefitDot} />
              <Text style={styles.benefitText}>
                Sakat chauth ki pooja se santaan sukh mile
              </Text>
            </View>
          </View>
        </View>

        {/* How Pooja Performed */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>🙏 How the Pooja is Performed</Text>
          <View style={styles.benefitsWrapper}>
            <View style={styles.benefitItem}>
              <View style={styles.benefitDot} />
              <Text style={styles.benefitText}>Pooja will be held live</Text>
            </View>
            <View style={styles.benefitItem}>
              <View style={styles.benefitDot} />
              <Text style={styles.benefitText}>
                Videos will be shared in WhatsApp/Telegram
              </Text>
            </View>
            <View style={styles.benefitItem}>
              <View style={styles.benefitDot} />
              <Text style={styles.benefitText}>
                Pandit will perform your name gotra sankalp
              </Text>
            </View>
          </View>
        </View>

        {/* Our Promises Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>⭐ Our Promises</Text>
          <View style={styles.promisesGrid}>
            {[
              { promise: 'Experienced\nPandits', icon: 'user-tie' },
              { promise: 'Vedic\nStandards', icon: 'book-open' },
              { promise: '100% Puja\nBenefits', icon: 'check-circle' },
              { promise: 'High Quality\nSamagri', icon: 'sparkles' },
              {
                promise: 'Professional\nGuidance',
                icon: 'headset',
              },
            ].map((item, index) => (
              <View key={index} style={styles.promiseCard}>
                <FontAwesome5 name={item.icon} size={28} color="#8B7355" />
                <Text style={styles.promiseText}>{item.promise}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Customer Reviews Section */}
        <View style={styles.reviewsSection}>
          <Text style={styles.sectionTitle}>💬 Customer Reviews</Text>
          <ScrollView
            horizontal={true}
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.reviewsScrollContent}
            style={styles.reviewsScroll}
          >
            {[
              {
                name: 'Vrinda',
                review:
                  'My Experience with Puja Har Ghar was amazing. I booked Ganesh Utsav Puja and the pandit was very knowledgeable and performed the rituals with utmost devotion. Highly recommend!',
                sentiment: 'happy',
              },
              {
                name: 'Palak',
                review:
                  'My Experience with Puja Har Ghar was amazing. I booked Ganesh Utsav Puja and the pandit was very knowledgeable and performed the rituals with utmost devotion. Highly recommend!',
                sentiment: 'happy',
              },
              {
                name: 'Shreya',
                review:
                  'My Experience with Puja Har Ghar was amazing. I booked Ganesh Utsav Puja and the pandit was very knowledgeable and performed the rituals with utmost devotion. Highly recommend!',
                sentiment: 'happy',
              },
              {
                name: 'Anjali',
                review:
                  'My Experience with Puja Har Ghar was amazing. I booked Ganesh Utsav Puja and the pandit was very knowledgeable and performed the rituals with utmost devotion. Highly recommend!',
                sentiment: 'happy',
              },
            ].map((item, index) => (
              <View key={index} style={styles.modernReviewCard}>
                <View style={styles.reviewHeader}>
                  <View style={styles.reviewNameSection}>
                    <View style={styles.avatarCircle}>
                      <Text style={styles.avatarText}>
                        {item.name.charAt(0)}
                      </Text>
                    </View>
                    <View>
                      <Text style={styles.reviewName}>{item.name}</Text>
                      <MaterialCommunityIcons
                        name={
                          item.sentiment === 'happy'
                            ? 'emoticon-happy'
                            : 'emoticon-neutral'
                        }
                        size={20}
                        color="#8B7355"
                      />
                    </View>
                  </View>
                </View>
                <Text style={styles.modernReviewText}>"{item.review}"</Text>
              </View>
            ))}
          </ScrollView>
        </View>

        <View style={styles.spacer} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAF9F7',
  },
  scrollContent: {
    flex: 1,
  },
  // Header Styles
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FAF9F7',
    borderBottomWidth: 1,
    borderBottomColor: '#E8E3DD',
  },
  headerButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#000',
    flex: 1,
    textAlign: 'center',
  },
  // Swiper Section
  swiperContainer: {
    marginTop: 20,
    marginHorizontal: 16,
  },
  swiper: {
    marginBottom: 8,
  },
  swiperImageWrapper: {
    width: '100%',
    height: 280,
    borderRadius: 24,
    overflow: 'hidden',
    backgroundColor: '#E8E3DD',
  },
  swiperImage: {
    width: '100%',
    height: '100%',
  },
  dot: {
    backgroundColor: '#D4A574',
    width: 6,
    height: 6,
    borderRadius: 3,
    margin: 4,
  },
  activeDot: {
    backgroundColor: '#8B7355',
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  // Title & Description
  titleSection: {
    paddingHorizontal: 16,
    marginTop: 24,
    marginBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: '#2C2C2C',
    marginBottom: 12,
    lineHeight: 32,
  },
  description: {
    fontSize: 15,
    color: '#5C5C5C',
    lineHeight: 24,
    fontWeight: '400',
  },
  // Book Now Button
  bookNow: {
    marginHorizontal: 16,
    marginBottom: 28,
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 16,
    backgroundColor: '#ce8123ff',
    // backgroundColor: '#ffcf00',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 10,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
  },
  bookNowText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 16,
  },
  // Section Styling
  section: {
    paddingHorizontal: 16,
    marginBottom: 28,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#2C2C2C',
    marginBottom: 16,
  },
  benefitsWrapper: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E8E3DD',
  },
  benefitItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 14,
  },
  benefitDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#ffcf00',
    marginTop: 8,
    marginRight: 12,
  },
  benefitText: {
    fontSize: 14,
    color: '#5C5C5C',
    flex: 1,
    lineHeight: 20,
    fontWeight: '400',
  },
  // Promises Grid
  promisesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 12,
    borderWidth: 1,
    borderColor: '#E8E3DD',
  },
  promiseCard: {
    width: '32%',
    backgroundColor: '#FAF9F7',
    borderRadius: 12,
    padding: 14,
    alignItems: 'center',
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#E8E3DD',
  },
  promiseText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#2C2C2C',
    textAlign: 'center',
    marginTop: 10,
    lineHeight: 16,
  },
  // Reviews Section
  reviewsSection: {
    paddingHorizontal: 16,
    marginBottom: 20,
  },
  reviewsScroll: {
    marginHorizontal: -16,
  },
  reviewsScrollContent: {
    paddingHorizontal: 16,
  },
  modernReviewCard: {
    width: width * 0.75,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginRight: 12,
    borderWidth: 1,
    borderColor: '#E8E3DD',
  },
  reviewHeader: {
    marginBottom: 12,
  },
  reviewNameSection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#D4A574',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  avatarText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 16,
  },
  reviewName: {
    fontSize: 14,
    fontWeight: '700',
    color: '#2C2C2C',
  },
  modernReviewText: {
    fontSize: 13,
    color: '#5C5C5C',
    lineHeight: 20,
    fontWeight: '400',
    fontStyle: 'italic',
  },
  spacer: {
    height: 30,
  },
});
