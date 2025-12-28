import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Dimensions,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
// import LottieView from 'lottie-react-native';

const { width } = Dimensions.get('window');

const BookingSuccess = ({ navigation, route }) => {
  const { BookingObject, orderInfo } = route.params || {};

  useEffect(() => {
    // Auto navigate to home after 5 seconds if user doesn't tap
    const timer = setTimeout(() => {
      // Optional: auto-navigate (commented out so user can see the page)
      // navigation.navigate('Home');
    }, 5000);

    return () => clearTimeout(timer);
  }, [navigation]);

  const handleBackToHome = () => {
    navigation.reset({
      index: 0,
      routes: [{ name: 'Home' }],
    });
  };

  return (
    <View style={styles.wrapper}>
      {/* Custom Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          onPress={handleBackToHome}
          style={styles.headerButton}
        >
          <Ionicons name="chevron-back" size={26} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Booking Status</Text>
        <View style={styles.headerButton} />
      </View>

      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Success Animation/Icon */}
        <View style={styles.iconContainer}>
          <View style={styles.successIcon}>
            <Ionicons name="checkmark-circle" size={80} color="#ce8123" />
          </View>
        </View>

        {/* Success Message */}
        <Text style={styles.mainTitle}>Booking Confirmed! 🎉</Text>
        <Text style={styles.subtitle}>
          Your puja booking has been successfully confirmed
        </Text>

        {/* Booking Details Card */}
        <View style={styles.detailsCard}>
          <View style={styles.detailRow}>
            <View style={styles.detailIconCircle}>
              <Ionicons name="calendar" size={20} color="#ce8123" />
            </View>
            <View style={styles.detailContent}>
              <Text style={styles.detailLabel}>Booking Date</Text>
              <Text style={styles.detailValue}>
                {BookingObject?.date || 'Flexible Date'}
              </Text>
            </View>
          </View>

          <View style={styles.divider} />

          <View style={styles.detailRow}>
            <View style={styles.detailIconCircle}>
              <Ionicons name="person" size={20} color="#ce8123" />
            </View>
            <View style={styles.detailContent}>
              <Text style={styles.detailLabel}>Priest</Text>
              <Text style={styles.detailValue}>
                {BookingObject?.priest_id ? `Priest ID: ${BookingObject.priest_id}` : 'To be assigned'}
              </Text>
            </View>
          </View>

          <View style={styles.divider} />

          <View style={styles.detailRow}>
            <View style={styles.detailIconCircle}>
              <Ionicons name="wallet" size={20} color="#ce8123" />
            </View>
            <View style={styles.detailContent}>
              <Text style={styles.detailLabel}>Payment Status</Text>
              <Text style={[styles.detailValue, styles.paidText]}>✓ Paid</Text>
            </View>
          </View>

          <View style={styles.divider} />

          <View style={styles.detailRow}>
            <View style={styles.detailIconCircle}>
              <Ionicons name="ticket" size={20} color="#ce8123" />
            </View>
            <View style={styles.detailContent}>
              <Text style={styles.detailLabel}>Order ID</Text>
              <Text style={styles.detailValue}>
                {orderInfo?.id ? `#${orderInfo.id.substring(0, 8)}...` : '#PENDING'}
              </Text>
            </View>
          </View>
        </View>

        {/* What's Next Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>📋 What's Next?</Text>
          
          <View style={styles.stepContainer}>
            <View style={styles.stepNumber}>
              <Text style={styles.stepNumberText}>1</Text>
            </View>
            <View style={styles.stepContent}>
              <Text style={styles.stepTitle}>Confirmation Email</Text>
              <Text style={styles.stepDescription}>
                You'll receive a confirmation email with all booking details
              </Text>
            </View>
          </View>

          <View style={styles.stepContainer}>
            <View style={styles.stepNumber}>
              <Text style={styles.stepNumberText}>2</Text>
            </View>
            <View style={styles.stepContent}>
              <Text style={styles.stepTitle}>Priest Assignment</Text>
              <Text style={styles.stepDescription}>
                Our team will assign a qualified priest within 24 hours
              </Text>
            </View>
          </View>

          <View style={styles.stepContainer}>
            <View style={styles.stepNumber}>
              <Text style={styles.stepNumberText}>3</Text>
            </View>
            <View style={styles.stepContent}>
              <Text style={styles.stepTitle}>Puja Performance</Text>
              <Text style={styles.stepDescription}>
                Puja will be performed on your selected date
              </Text>
            </View>
          </View>
        </View>

        {/* Features List */}
        <View style={styles.featuresSection}>
          <Text style={styles.sectionTitle}>✨ Your Benefits</Text>
          <View style={styles.featuresList}>
            <View style={styles.featureItem}>
              <Ionicons name="checkmark-circle" size={18} color="#ce8123" />
              <Text style={styles.featureText}>Expert priest assigned</Text>
            </View>
            <View style={styles.featureItem}>
              <Ionicons name="checkmark-circle" size={18} color="#ce8123" />
              <Text style={styles.featureText}>Authentic rituals performed</Text>
            </View>
            <View style={styles.featureItem}>
              <Ionicons name="checkmark-circle" size={18} color="#ce8123" />
              <Text style={styles.featureText}>Full service report</Text>
            </View>
            <View style={styles.featureItem}>
              <Ionicons name="checkmark-circle" size={18} color="#ce8123" />
              <Text style={styles.featureText}>24/7 customer support</Text>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Footer Button */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.button}
          onPress={handleBackToHome}
        >
          <Text style={styles.buttonText}>Go to Home</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 2,
    borderBottomColor: '#ce8123',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 3,
  },
  headerButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#000',
    flex: 1,
    textAlign: 'center',
  },
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 120,
  },
  iconContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 20,
  },
  successIcon: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#fff8f2',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    borderWidth: 2,
    borderColor: '#ce8123',
  },
  mainTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: '#ce8123',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 22,
  },
  detailsCard: {
    borderWidth: 1.5,
    borderColor: '#E8E3DD',
    borderRadius: 16,
    padding: 16,
    backgroundColor: '#FAFAF8',
    marginBottom: 24,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
  },
  detailIconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#fff8f2',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  detailContent: {
    flex: 1,
  },
  detailLabel: {
    fontSize: 12,
    color: '#888',
    fontWeight: '500',
    marginBottom: 2,
  },
  detailValue: {
    fontSize: 15,
    color: '#1a1a1a',
    fontWeight: '600',
  },
  paidText: {
    color: '#10B981',
    fontWeight: '700',
  },
  divider: {
    height: 1,
    backgroundColor: '#E8E3DD',
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1a1a1a',
    marginBottom: 16,
  },
  stepContainer: {
    flexDirection: 'row',
    marginBottom: 16,
    alignItems: 'flex-start',
  },
  stepNumber: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#ce8123',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  stepNumberText: {
    color: '#fff',
    fontWeight: '800',
    fontSize: 16,
  },
  stepContent: {
    flex: 1,
    paddingTop: 2,
  },
  stepTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1a1a1a',
    marginBottom: 4,
  },
  stepDescription: {
    fontSize: 13,
    color: '#666',
    lineHeight: 18,
  },
  featuresSection: {
    marginBottom: 24,
  },
  featuresList: {
    gap: 10,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    backgroundColor: '#fff8f2',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#E8E3DD',
    gap: 10,
  },
  featureText: {
    fontSize: 14,
    color: '#333',
    fontWeight: '500',
    flex: 1,
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 16,
    paddingBottom: 20,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E8E3DD',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
  button: {
    backgroundColor: '#ce8123',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#ce8123',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  buttonText: {
    fontWeight: '700',
    fontSize: 16,
    color: '#fff',
  },
});

export default BookingSuccess;