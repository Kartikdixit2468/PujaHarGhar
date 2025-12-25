import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  FlatList,
  Pressable,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import FAIcon from 'react-native-vector-icons/FontAwesome5';

const Support = ({ navigation }) => {
  // Mock data for recent bookings
  const recentBookings = [
    {
      id: 1,
      status: 'Completed',
      date: 'Placed at 3rd Dec 2025, 10:42 pm',
      amount: '₹155.25',
      images: [
        require('../assets/images/imagesCategory/GaneshJiPooja.webp'),
        require('../assets/images/imagesCategory/Lakshmiji.jpg'),
      ],
    },
    {
      id: 2,
      status: 'Completed',
      date: 'Placed at 2nd Dec 2025, 05:47 pm',
      amount: '₹187',
      images: [
        require('../assets/images/imagesCategory/ShivjiPooja.jpg'),
        require('../assets/images/imagesCategory/matarani.png'),
      ],
    },
  ];

  // FAQ Categories
  const faqCategories = [
    { id: 1, title: 'General Inquiry', icon: 'help-outline' },
    { id: 2, title: 'Payment Related', icon: 'payment' },
    { id: 3, title: 'Order / Bookings Related', icon: 'shopping-cart' },
    { id: 4, title: 'Feedback & Suggestions', icon: 'feedback' },
    { id: 5, title: 'Coupons & Offers', icon: 'local-offer' },
  ];

  const handleFAQPress = (category) => {
    navigation.navigate('FAQDetail', { category });
  };

  const handleContactPress = () => {
    navigation.navigate('ContactSupport');
  };

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Pressable onPress={() => navigation.goBack()}>
          <Icon name="arrow-back" size={28} color="#000" />
        </Pressable>
        <Text style={styles.headerTitle}>Help & Support</Text>
        <View style={{ width: 28 }} />
      </View>

      {/* Get Help on Bookings Section */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Get Help on Bookings</Text>
          <TouchableOpacity>
            <Text style={styles.seeAllText}>See All</Text>
          </TouchableOpacity>
        </View>

        {recentBookings.map((booking) => (
          <View key={booking.id} style={styles.bookingCard}>
            <View style={styles.bookingHeader}>
              <View>
                <View style={styles.statusBadge}>
                  <FAIcon name="check-circle" size={16} color="#10b981" />
                  <Text style={styles.statusText}>{booking.status}</Text>
                </View>
                <Text style={styles.bookingDate}>{booking.date}</Text>
              </View>
              <Text style={styles.bookingAmount}>{booking.amount}</Text>
            </View>

            <View style={styles.bookingImages}>
              {booking.images.map((image, index) => (
                <Image
                  key={index}
                  source={image}
                  style={styles.bookingImage}
                />
              ))}
            </View>
          </View>
        ))}
      </View>

      {/* FAQs Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>FAQs</Text>

        {faqCategories.map((category) => (
          <TouchableOpacity
            key={category.id}
            style={styles.faqCategoryItem}
            onPress={() => handleFAQPress(category)}
          >
            <View style={styles.faqCategoryContent}>
              <Icon name={category.icon} size={24} color="#ffcf00" />
              <Text style={styles.faqCategoryTitle}>{category.title}</Text>
            </View>
            <Icon name="chevron-right" size={28} color="#ff6b9d" />
          </TouchableOpacity>
        ))}
      </View>

      {/* Contact Support Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Need More Help?</Text>
        <Pressable
          style={styles.contactButton}
          onPress={handleContactPress}
        >
          <FAIcon name="headset" size={20} color="#fff" style={styles.contactIcon} />
          <View style={styles.contactButtonContent}>
            <Text style={styles.contactButtonText}>Contact Our Support Team</Text>
            <Text style={styles.contactButtonSubtext}>Raise a ticket and get instant support</Text>
          </View>
          <Icon name="chevron-right" size={28} color="#fff" />
        </Pressable>
      </View>

      <View style={{ height: 30 }} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9f7f9',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
    paddingTop: 20,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#000',
  },

  // Section Styles
  section: {
    marginTop: 20,
    paddingHorizontal: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#000',
    marginBottom: 12,
  },
  seeAllText: {
    fontSize: 14,
    color: '#ff6b9d',
    fontWeight: '600',
  },

  // Booking Card Styles
  bookingCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 14,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  bookingHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  statusText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#10b981',
    marginLeft: 6,
  },
  bookingDate: {
    fontSize: 12,
    color: '#6b7280',
  },
  bookingAmount: {
    fontSize: 20,
    fontWeight: '700',
    color: '#000',
  },
  bookingImages: {
    flexDirection: 'row',
    gap: 8,
  },
  bookingImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
    backgroundColor: '#f3f4f6',
  },

  // FAQ Category Styles
  faqCategoryItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingVertical: 16,
    paddingHorizontal: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  faqCategoryContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  faqCategoryTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
    marginLeft: 12,
  },

  // Contact Button Styles
  contactButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffcf00',
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 14,
    marginTop: 12,
  },
  contactIcon: {
    marginRight: 12,
  },
  contactButtonContent: {
    flex: 1,
  },
  contactButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#000',
    marginBottom: 2,
  },
  contactButtonSubtext: {
    fontSize: 12,
    color: '#6b7280',
    fontWeight: '500',
  },
});

export default Support;
