import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  Pressable,
  LayoutAnimation,
  UIManager,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

// Enable LayoutAnimation for Android
if (UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

// Mock FAQ data for different categories
const faqData = {
  'General Inquiry': [
    {
      id: 1,
      question: 'What is PujaHarGhar?',
      answer: 'PujaHarGhar is a platform that helps you book puja services from qualified priests. We connect you with experienced spiritual guides for various religious ceremonies and rituals.',
    },
    {
      id: 2,
      question: 'How do I book a puja?',
      answer: 'Simply browse through our puja categories, select the puja you want, choose your preferred date and time, and proceed to checkout. Our priests will confirm your booking.',
    },
    {
      id: 3,
      question: 'What types of pujas do you offer?',
      answer: 'We offer a wide range of pujas including Satyanarayan Puja, Durga Puja, Ganesh Puja, Shiva Puja, Marriage ceremonies, and many more.',
    },
    {
      id: 4,
      question: 'How do I contact a priest?',
      answer: 'You can contact our support team through the "Contact Our Team" option. They will help you connect with a priest for your specific needs.',
    },
  ],
  'Payment Related': [
    {
      id: 1,
      question: 'What payment methods are accepted?',
      answer: 'We accept all major credit/debit cards, UPI, net banking, and digital wallets for secure payments.',
    },
    {
      id: 2,
      question: 'Is my payment information secure?',
      answer: 'Yes, all payments are processed through encrypted secure gateways. Your payment information is completely safe with us.',
    },
    {
      id: 3,
      question: 'Do you offer refunds?',
      answer: 'Refunds are processed based on our cancellation policy. Please contact support for refund-related queries.',
    },
    {
      id: 4,
      question: 'Can I use promo codes?',
      answer: 'Yes! We regularly offer promotional codes and discounts. Check the Coupons & Offers section in Help & Support.',
    },
  ],
  'Order / Bookings Related': [
    {
      id: 1,
      question: 'Can I reschedule my booking?',
      answer: 'Yes, you can reschedule your booking up to 24 hours before the scheduled puja. Go to your bookings and select reschedule.',
    },
    {
      id: 2,
      question: 'What is the cancellation policy?',
      answer: 'Cancellations made 24 hours before the puja are eligible for full refund. Cancellations within 24 hours may incur charges.',
    },
    {
      id: 3,
      question: 'How will I know when the priest arrives?',
      answer: 'You will receive notifications and can track the priest in real-time once they start their journey to your location.',
    },
    {
      id: 4,
      question: 'Can I see my booking history?',
      answer: 'Yes, you can view all your past and upcoming bookings in the Profile section of the app.',
    },
  ],
  'Feedback & Suggestions': [
    {
      id: 1,
      question: 'How can I provide feedback?',
      answer: 'You can provide feedback through the "Feedback & Suggestions" option in Help & Support after completing your puja.',
    },
    {
      id: 2,
      question: 'What should I rate?',
      answer: 'You can rate the priest\'s behavior, punctuality, knowledge, and overall experience. Your feedback helps us maintain quality.',
    },
    {
      id: 3,
      question: 'Will my feedback be anonymous?',
      answer: 'Your feedback is primarily used to improve our services. We treat all reviews with confidentiality.',
    },
  ],
  'Coupons & Offers': [
    {
      id: 1,
      question: 'How do I apply a coupon code?',
      answer: 'Enter the coupon code in the "Apply Coupon" field during checkout to get your discount.',
    },
    {
      id: 2,
      question: 'Are there any restrictions on coupon usage?',
      answer: 'Some coupons may have minimum order value requirements or category restrictions. Check the terms while applying.',
    },
    {
      id: 3,
      question: 'Can I combine multiple offers?',
      answer: 'Usually, only one coupon can be applied per booking. Promotional offers from the platform are automatically applied.',
    },
  ],
};

const FAQDetail = ({ route, navigation }) => {
  const { category } = route.params;
  const [expandedId, setExpandedId] = useState(null);
  const faqs = faqData[category.title] || [];

  const toggleExpand = (id) => {
    LayoutAnimation.easeInEaseOut();
    setExpandedId(expandedId === id ? null : id);
  };

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Pressable onPress={() => navigation.goBack()}>
          <Icon name="arrow-back" size={28} color="#000" />
        </Pressable>
        <Text style={styles.headerTitle}>Help</Text>
        <View style={{ width: 28 }} />
      </View>

      {/* Category Title */}
      <View style={styles.titleSection}>
        <Icon name={category.icon} size={32} color="#ffcf00" />
        <Text style={styles.categoryTitle}>{category.title}</Text>
      </View>

      {/* FAQ Items */}
      <View style={styles.faqContainer}>
        {faqs.map((faq) => (
          <View key={faq.id} style={styles.faqItem}>
            <Pressable
              style={styles.faqQuestion}
              onPress={() => toggleExpand(faq.id)}
            >
              <Text style={styles.questionText}>{faq.question}</Text>
              <Icon
                name={expandedId === faq.id ? 'expand-less' : 'chevron-right'}
                size={24}
                color="#ff6b9d"
              />
            </Pressable>

            {expandedId === faq.id && (
              <View style={styles.answerContainer}>
                <Text style={styles.answerText}>{faq.answer}</Text>
              </View>
            )}
          </View>
        ))}
      </View>

      {/* Contact Support CTA */}
      <View style={styles.ctaSection}>
        <Text style={styles.ctaText}>Couldn't find what you're looking for?</Text>
        <Pressable
          style={styles.contactCtaButton}
          onPress={() => navigation.navigate('ContactSupport')}
        >
          <Text style={styles.contactCtaButtonText}>Contact Our Team</Text>
          <Icon name="arrow-forward" size={20} color="#fff" />
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

  titleSection: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 20,
    gap: 12,
  },
  categoryTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#000',
  },

  faqContainer: {
    paddingHorizontal: 16,
    marginTop: 10,
  },
  faqItem: {
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    overflow: 'hidden',
  },
  faqQuestion: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 14,
  },
  questionText: {
    flex: 1,
    fontSize: 15,
    fontWeight: '600',
    color: '#000',
    marginRight: 10,
  },
  answerContainer: {
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
    paddingVertical: 12,
    paddingHorizontal: 14,
    backgroundColor: '#f9f7f9',
  },
  answerText: {
    fontSize: 14,
    color: '#6b7280',
    lineHeight: 20,
  },

  ctaSection: {
    marginTop: 30,
    paddingHorizontal: 16,
    paddingBottom: 20,
  },
  ctaText: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 12,
    textAlign: 'center',
  },
  contactCtaButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ffcf00',
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 20,
    gap: 8,
  },
  contactCtaButtonText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#000',
  },
});

export default FAQDetail;
