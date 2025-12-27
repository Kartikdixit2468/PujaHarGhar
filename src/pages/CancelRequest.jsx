import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  Pressable,
  ActivityIndicator,
  Alert,
  TextInput,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import FAIcon from 'react-native-vector-icons/FontAwesome5';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SERVER_IP } from '@env';

const CancelRequest = ({ route, navigation }) => {
  const { booking } = route.params;
  const [reason, setReason] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmitCancelRequest = async () => {
    if (!reason.trim()) {
      Alert.alert('Error', 'Please provide a reason for cancellation');
      return;
    }

    Alert.alert(
      'Submit Cancellation Request',
      'Our team will review your request and get back to you soon. You will receive an update within 24 hours.',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Submit Request',
          style: 'default',
          onPress: submitRequest,
        },
      ]
    );
  };

  const submitRequest = async () => {
    try {
      setLoading(true);
      const token = await AsyncStorage.getItem('authToken');
      const userEmail = await AsyncStorage.getItem('userEmail');
      const userPhone = await AsyncStorage.getItem('userPhone');

      const response = await fetch(`${SERVER_IP}/api/client/booking/request-cancellation`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          booking_id: booking.booking_id,
          email: userEmail,
          phone: userPhone,
          reason: reason.trim(),
        }),
      });

      const data = await response.json();
      setLoading(false);

      if (data.success) {
        Alert.alert(
          'Request Submitted',
          'Your cancellation request has been submitted. Our support team will contact you within 24 hours.',
          [
            {
              text: 'OK',
              onPress: () => navigation.goBack(),
            },
          ]
        );
      } else {
        Alert.alert('Error', data.message || 'Failed to submit cancellation request');
      }
    } catch (err) {
      setLoading(false);
      console.error('Error submitting cancellation request:', err);
      Alert.alert('Error', 'An error occurred while submitting your request');
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <View style={styles.header}>
        <Pressable onPress={() => navigation.goBack()}>
          <Icon name="arrow-back" size={28} color="#000" />
        </Pressable>
        <Text style={styles.headerTitle}>Cancellation Request</Text>
        <View style={{ width: 28 }} />
      </View>

      {/* Info Box */}
      <View style={styles.infoBox}>
        <FAIcon name="info-circle" size={24} color="#3b82f6" />
        <Text style={styles.infoText}>
          Your booking was made recently. We'll review your cancellation request and get back to you within 24 hours.
        </Text>
      </View>

      {/* Booking Summary */}
      <View style={styles.summaryCard}>
        <Text style={styles.summaryTitle}>Booking Summary</Text>

        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Booking ID</Text>
          <Text style={styles.summaryValue}>{booking.booking_id}</Text>
        </View>

        <View style={styles.divider} />

        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Puja</Text>
          <Text style={styles.summaryValue}>{booking.name}</Text>
        </View>

        <View style={styles.divider} />

        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Booked On</Text>
          <Text style={styles.summaryValue}>{formatDate(booking.booked_on)}</Text>
        </View>

        <View style={styles.divider} />

        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Scheduled Date</Text>
          <Text style={styles.summaryValue}>{formatDate(booking.date)}</Text>
        </View>

        <View style={styles.divider} />

        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Amount</Text>
          <Text style={[styles.summaryValue, { color: '#ffcf00' }]}>₹{booking.price}</Text>
        </View>
      </View>

      {/* Reason Section */}
      <View style={styles.reasonSection}>
        <Text style={styles.reasonTitle}>Reason for Cancellation *</Text>
        <Text style={styles.reasonSubtext}>
          Please let us know why you want to cancel this booking. This will help us improve our services.
        </Text>

        <TextInput
          style={styles.reasonInput}
          placeholder="Type your reason here..."
          placeholderTextColor="#999"
          value={reason}
          onChangeText={setReason}
          multiline
          numberOfLines={5}
          textAlignVertical="top"
        />

        <Text style={styles.charCount}>{reason.length}/300 characters</Text>
      </View>

      {/* What Happens Next */}
      <View style={styles.nextSection}>
        <Text style={styles.nextTitle}>What Happens Next?</Text>

        <View style={styles.nextStep}>
          <View style={styles.stepNumber}>
            <Text style={styles.stepNumberText}>1</Text>
          </View>
          <View style={styles.stepContent}>
            <Text style={styles.stepTitle}>Request Received</Text>
            <Text style={styles.stepSubtext}>Your request will be received and reviewed</Text>
          </View>
        </View>

        <View style={styles.nextStep}>
          <View style={styles.stepNumber}>
            <Text style={styles.stepNumberText}>2</Text>
          </View>
          <View style={styles.stepContent}>
            <Text style={styles.stepTitle}>Team Review</Text>
            <Text style={styles.stepSubtext}>Our team will contact you within 24 hours</Text>
          </View>
        </View>

        <View style={styles.nextStep}>
          <View style={styles.stepNumber}>
            <Text style={styles.stepNumberText}>3</Text>
          </View>
          <View style={styles.stepContent}>
            <Text style={styles.stepTitle}>Resolution</Text>
            <Text style={styles.stepSubtext}>We'll finalize the cancellation and process refund</Text>
          </View>
        </View>
      </View>

      {/* Buttons */}
      <View style={styles.buttonSection}>
        <Pressable
          style={[styles.submitButton, loading && styles.submitButtonDisabled]}
          onPress={handleSubmitCancelRequest}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#000" size="small" />
          ) : (
            <>
              <Icon name="send" size={20} color="#000" />
              <Text style={styles.submitButtonText}>Submit Request</Text>
            </>
          )}
        </Pressable>

        <Pressable
          style={styles.goBackButton}
          onPress={() => navigation.goBack()}
          disabled={loading}
        >
          <Text style={styles.goBackButtonText}>Go Back</Text>
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

  infoBox: {
    marginHorizontal: 16,
    marginTop: 16,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#eff6ff',
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: '#93c5fd',
    gap: 12,
  },
  infoText: {
    flex: 1,
    fontSize: 13,
    color: '#1e40af',
    fontWeight: '500',
    lineHeight: 18,
  },

  summaryCard: {
    marginHorizontal: 16,
    marginTop: 16,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  summaryTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#000',
    marginBottom: 12,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
  },
  summaryLabel: {
    fontSize: 13,
    color: '#6b7280',
    fontWeight: '500',
  },
  summaryValue: {
    fontSize: 13,
    fontWeight: '700',
    color: '#000',
  },
  divider: {
    height: 1,
    backgroundColor: '#f3f4f6',
  },

  reasonSection: {
    marginHorizontal: 16,
    marginTop: 20,
  },
  reasonTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#000',
    marginBottom: 6,
  },
  reasonSubtext: {
    fontSize: 13,
    color: '#6b7280',
    marginBottom: 12,
    lineHeight: 18,
  },
  reasonInput: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 14,
    color: '#000',
    minHeight: 120,
  },
  charCount: {
    fontSize: 12,
    color: '#9ca3af',
    marginTop: 8,
    textAlign: 'right',
  },

  nextSection: {
    marginHorizontal: 16,
    marginTop: 24,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  nextTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#000',
    marginBottom: 16,
  },
  nextStep: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  stepNumber: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#ffcf00',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  stepNumberText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#000',
  },
  stepContent: {
    flex: 1,
    justifyContent: 'center',
  },
  stepTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#000',
    marginBottom: 2,
  },
  stepSubtext: {
    fontSize: 12,
    color: '#6b7280',
  },

  buttonSection: {
    marginHorizontal: 16,
    marginTop: 24,
    marginBottom: 20,
  },
  submitButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ffcf00',
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 16,
    gap: 8,
    marginBottom: 10,
  },
  submitButtonDisabled: {
    opacity: 0.6,
  },
  submitButtonText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#000',
  },
  goBackButton: {
    borderWidth: 1.5,
    borderColor: '#d1d5db',
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 16,
    alignItems: 'center',
  },
  goBackButtonText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#6b7280',
  },
});

export default CancelRequest;
