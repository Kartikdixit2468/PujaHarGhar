import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Dimensions,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

const { width } = Dimensions.get('window');

const BookingFailure = ({ navigation, route }) => {
  const { errorMessage, orderInfo } = route.params || {};

  const handleBackToHome = () => {
    navigation.reset({
      index: 0,
      routes: [{ name: 'Home' }],
    });
  };

  const handleRetry = () => {
    navigation.goBack();
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
        {/* Failure Icon */}
        <View style={styles.iconContainer}>
          <View style={styles.failureIcon}>
            <Ionicons name="close-circle" size={80} color="#EF4444" />
          </View>
        </View>

        {/* Failure Message */}
        <Text style={styles.mainTitle}>Booking Failed 😞</Text>
        <Text style={styles.subtitle}>
          Unfortunately, your booking could not be completed
        </Text>

        {/* Error Details Card */}
        <View style={styles.errorCard}>
          <View style={styles.errorHeader}>
            <Ionicons name="alert-circle" size={24} color="#EF4444" />
            <Text style={styles.errorTitle}>What Went Wrong?</Text>
          </View>
          <Text style={styles.errorMessage}>
            {errorMessage || 'An unexpected error occurred during the booking process. Please try again.'}
          </Text>
        </View>

        {/* Troubleshooting Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>🔧 Troubleshooting Tips</Text>
          
          <View style={styles.tipContainer}>
            <View style={styles.tipIcon}>
              <Ionicons name="wifi" size={18} color="#ce8123" />
            </View>
            <View style={styles.tipContent}>
              <Text style={styles.tipTitle}>Check Internet Connection</Text>
              <Text style={styles.tipDescription}>
                Ensure you have a stable internet connection
              </Text>
            </View>
          </View>

          <View style={styles.tipContainer}>
            <View style={styles.tipIcon}>
              <Ionicons name="wallet" size={18} color="#ce8123" />
            </View>
            <View style={styles.tipContent}>
              <Text style={styles.tipTitle}>Verify Payment Method</Text>
              <Text style={styles.tipDescription}>
                Check if your card/account has sufficient balance
              </Text>
            </View>
          </View>

          <View style={styles.tipContainer}>
            <View style={styles.tipIcon}>
              <Ionicons name="time" size={18} color="#ce8123" />
            </View>
            <View style={styles.tipContent}>
              <Text style={styles.tipTitle}>Wait a Moment</Text>
              <Text style={styles.tipDescription}>
                Sometimes it takes a few moments to process
              </Text>
            </View>
          </View>

          <View style={styles.tipContainer}>
            <View style={styles.tipIcon}>
              <Ionicons name="help-circle" size={18} color="#ce8123" />
            </View>
            <View style={styles.tipContent}>
              <Text style={styles.tipTitle}>Contact Support</Text>
              <Text style={styles.tipDescription}>
                Reach out to our team for immediate assistance
              </Text>
            </View>
          </View>
        </View>

        {/* Important Notice */}
        <View style={styles.noticeCard}>
          <Ionicons name="information-circle" size={20} color="#3B82F6" />
          <View style={styles.noticeContent}>
            <Text style={styles.noticeTitle}>Important</Text>
            <Text style={styles.noticeText}>
              No amount has been deducted from your account. Your previous payment details are safe.
            </Text>
          </View>
        </View>
      </ScrollView>

      {/* Footer Buttons */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.retryButton}
          onPress={handleRetry}
        >
          <Ionicons name="refresh" size={20} color="#fff" style={{ marginRight: 8 }} />
          <Text style={styles.buttonText}>Try Again</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.homeButton}
          onPress={handleBackToHome}
        >
          <Text style={styles.homeButtonText}>Go to Home</Text>
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
    paddingBottom: 140,
  },
  iconContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 20,
  },
  failureIcon: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#FEE2E2',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    borderWidth: 2,
    borderColor: '#EF4444',
  },
  mainTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: '#EF4444',
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
  errorCard: {
    borderWidth: 1.5,
    borderColor: '#FECACA',
    borderRadius: 16,
    padding: 16,
    backgroundColor: '#FEF2F2',
    marginBottom: 24,
  },
  errorHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  errorTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#EF4444',
    marginLeft: 10,
  },
  errorMessage: {
    fontSize: 14,
    color: '#7F1D1D',
    lineHeight: 20,
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
  tipContainer: {
    flexDirection: 'row',
    marginBottom: 14,
    alignItems: 'flex-start',
  },
  tipIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#fff8f2',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    borderWidth: 1.5,
    borderColor: '#E8E3DD',
  },
  tipContent: {
    flex: 1,
    paddingTop: 2,
  },
  tipTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1a1a1a',
    marginBottom: 4,
  },
  tipDescription: {
    fontSize: 13,
    color: '#666',
    lineHeight: 18,
  },
  noticeCard: {
    flexDirection: 'row',
    padding: 14,
    backgroundColor: '#EFF6FF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#BFDBFE',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  noticeContent: {
    flex: 1,
    marginLeft: 12,
  },
  noticeTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1E40AF',
    marginBottom: 2,
  },
  noticeText: {
    fontSize: 13,
    color: '#1E40AF',
    lineHeight: 18,
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
  retryButton: {
    backgroundColor: '#ce8123',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 10,
    shadowColor: '#ce8123',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  homeButton: {
    backgroundColor: '#F3F4F6',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: '#E8E3DD',
  },
  homeButtonText: {
    fontWeight: '700',
    fontSize: 16,
    color: '#333',
  },
  buttonText: {
    fontWeight: '700',
    fontSize: 16,
    color: '#fff',
  },
});

export default BookingFailure;