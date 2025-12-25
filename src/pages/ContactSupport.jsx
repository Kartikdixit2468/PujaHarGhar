import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  Pressable,
  TextInput,
  Alert,
  ActivityIndicator,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import FAIcon from 'react-native-vector-icons/FontAwesome5';

const ContactSupport = ({ navigation }) => {
  const [ticketSubject, setTicketSubject] = useState('');
  const [ticketCategory, setTicketCategory] = useState('');
  const [ticketMessage, setTicketMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const categories = [
    'General Inquiry',
    'Booking Issue',
    'Payment Problem',
    'Feedback',
    'Other',
  ];

  const handleSubmit = async () => {
    if (!ticketSubject.trim()) {
      Alert.alert('Error', 'Please enter a subject');
      return;
    }
    if (!ticketCategory) {
      Alert.alert('Error', 'Please select a category');
      return;
    }
    if (!ticketMessage.trim()) {
      Alert.alert('Error', 'Please enter your message');
      return;
    }

    setLoading(true);
    // Simulate API call - Replace with actual backend integration
    setTimeout(() => {
      Alert.alert(
        'Success',
        'Your support ticket has been submitted. Our team will get back to you soon.',
        [
          {
            text: 'OK',
            onPress: () => {
              setLoading(false);
              setTicketSubject('');
              setTicketCategory('');
              setTicketMessage('');
              navigation.goBack();
            },
          },
        ]
      );
    }, 1500);
  };

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Pressable onPress={() => navigation.goBack()}>
          <Icon name="arrow-back" size={28} color="#000" />
        </Pressable>
        <Text style={styles.headerTitle}>Contact Support</Text>
        <View style={{ width: 28 }} />
      </View>

      {/* Info Section */}
      <View style={styles.infoSection}>
        <View style={styles.infoBox}>
          <FAIcon name="headset" size={24} color="#ffcf00" />
          <View style={styles.infoTextContainer}>
            <Text style={styles.infoTitle}>Need Help?</Text>
            <Text style={styles.infoSubtext}>
              Fill out the form below and our support team will assist you as soon as possible.
            </Text>
          </View>
        </View>
      </View>

      {/* Form Section */}
      <View style={styles.formSection}>
        {/* Subject Input */}
        <View style={styles.formGroup}>
          <Text style={styles.label}>Subject *</Text>
          <TextInput
            style={styles.input}
            placeholder="Brief description of your issue"
            placeholderTextColor="#999"
            value={ticketSubject}
            onChangeText={setTicketSubject}
          />
        </View>

        {/* Category Selection */}
        <View style={styles.formGroup}>
          <Text style={styles.label}>Category *</Text>
          <View style={styles.categoryContainer}>
            {categories.map((cat) => (
              <Pressable
                key={cat}
                style={[
                  styles.categoryButton,
                  ticketCategory === cat && styles.categoryButtonActive,
                ]}
                onPress={() => setTicketCategory(cat)}
              >
                <Text
                  style={[
                    styles.categoryButtonText,
                    ticketCategory === cat && styles.categoryButtonTextActive,
                  ]}
                >
                  {cat}
                </Text>
              </Pressable>
            ))}
          </View>
        </View>

        {/* Message Input */}
        <View style={styles.formGroup}>
          <Text style={styles.label}>Message *</Text>
          <TextInput
            style={[styles.input, styles.messageInput]}
            placeholder="Please describe your issue in detail..."
            placeholderTextColor="#999"
            value={ticketMessage}
            onChangeText={setTicketMessage}
            multiline
            numberOfLines={6}
            textAlignVertical="top"
          />
        </View>

        {/* Submit Button */}
        <Pressable
          style={[styles.submitButton, loading && styles.submitButtonDisabled]}
          onPress={handleSubmit}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#000" size="small" />
          ) : (
            <>
              <FAIcon name="paper-plane" size={18} color="#000" />
              <Text style={styles.submitButtonText}>Submit Ticket</Text>
            </>
          )}
        </Pressable>
      </View>

      {/* FAQ Link */}
      <View style={styles.faqLinkSection}>
        <Text style={styles.faqLinkText}>Can't find an answer?</Text>
        <Pressable
          onPress={() => navigation.navigate('Support')}
          style={styles.faqLink}
        >
          <Text style={styles.faqLinkButtonText}>Check FAQs</Text>
          <Icon name="arrow-forward" size={18} color="#ff6b9d" />
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

  infoSection: {
    paddingHorizontal: 16,
    paddingVertical: 20,
  },
  infoBox: {
    flexDirection: 'row',
    backgroundColor: '#fff6e7',
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: '#fcd34d',
    gap: 12,
  },
  infoTextContainer: {
    flex: 1,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#000',
    marginBottom: 4,
  },
  infoSubtext: {
    fontSize: 13,
    color: '#6b7280',
    lineHeight: 18,
  },

  formSection: {
    paddingHorizontal: 16,
    marginTop: 10,
  },
  formGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '700',
    color: '#000',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 14,
    color: '#000',
  },
  messageInput: {
    minHeight: 120,
    paddingTop: 12,
  },

  categoryContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  categoryButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#d1d5db',
  },
  categoryButtonActive: {
    backgroundColor: '#ffcf00',
    borderColor: '#ffcf00',
  },
  categoryButtonText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#6b7280',
  },
  categoryButtonTextActive: {
    color: '#000',
  },

  submitButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ffcf00',
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 20,
    marginTop: 10,
    gap: 8,
  },
  submitButtonDisabled: {
    opacity: 0.7,
  },
  submitButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#000',
  },

  faqLinkSection: {
    marginTop: 30,
    paddingHorizontal: 16,
    paddingBottom: 20,
    alignItems: 'center',
  },
  faqLinkText: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 10,
  },
  faqLink: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  faqLinkButtonText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#ff6b9d',
  },
});

export default ContactSupport;
