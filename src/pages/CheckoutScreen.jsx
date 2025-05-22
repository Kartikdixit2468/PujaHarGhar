import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Linking
} from 'react-native';
import { Checkbox } from 'react-native-paper';


export default CheckoutScreen = ({ route, navigation }) => {
  //   const { priest, dateOption, selectedDate } = route.params;
  const { priest, dateOption, selectedDate, package_id} = route.params 
  console.log("hey!")
  console.log("here -> ", route.params)

  // Mock Puja/Package Details
  const pujaDetails = {
    name: 'Satyanarayan Puja',
    description:
      'A traditional Hindu puja to seek blessings for happiness and prosperity.',
    package: {
      name: 'Premium Package',
      features: [
        'Puja Samagri included',
        '2 Hours Duration',
        'Personalized Guidance',
        'Sanskrit Mantras Explained',
      ],
      price: 2500,
    },
    travelCost: 500,
    tax: 0.1, // 10%
  };

  const [agree, setAgree] = useState(false);

  const totalCost = pujaDetails.package.price + pujaDetails.travelCost;
  const taxAmount = totalCost * pujaDetails.tax;
  const finalAmount = totalCost + taxAmount;

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Puja Info */}
        <Text style={styles.heading}>{pujaDetails.name}</Text>
        <Text style={styles.description}>{pujaDetails.description}</Text>

        {/* Package Details */}
        <View style={styles.section}>
          <Text style={styles.subheading}>{pujaDetails.package.name}</Text>
          {pujaDetails.package.features.map((feature, index) => (
            <Text key={index} style={styles.featureText}>
              • {feature}
            </Text>
          ))}
        </View>

        {/* Cost Breakdown */}
        <View style={styles.section}>
          <Text style={styles.subheading}>Cost Breakdown</Text>
          <View style={styles.row}>
            <Text style={styles.label}>Puja Base Price</Text>
            <Text style={styles.value}>₹{pujaDetails.package.price}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Intra-State Travel Cost</Text>
            <Text style={styles.value}>₹{pujaDetails.travelCost}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>GST (10%)</Text>
            <Text style={styles.value}>₹{taxAmount.toFixed(0)}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Selected Date</Text>
            <Text style={styles.value}>
              {selectedDate
                ? new Date(selectedDate).toLocaleDateString()
                : 'We’ll help you decide'}
            </Text>
          </View>
          <View style={styles.rowTotal}>
            <Text style={styles.totalLabel}>Total</Text>
            <Text style={styles.totalValue}>₹{finalAmount.toFixed(0)}</Text>
          </View>

          <View style={styles.rowTotal}>
            <Text style={styles.totalLabel}>Current Payable (50%)</Text>
            <Text style={styles.totalValue}>
              ₹{(finalAmount / 2).toFixed(0)}
            </Text>
          </View>
        </View>

        <View style={styles.checkboxContainer}>
        <Checkbox
          status={agree ? 'checked' : 'unchecked'}
          onPress={() => setAgree(!agree)}
          color="#4F46E5" // Indigo
        />
        <Text style={styles.checkboxText}>
          I agree to the{' '}
          <Text style={styles.link} onPress={() => Linking.openURL('https://kartikdixit.vercel.app')}>
            Terms & Conditions
          </Text>
          ,{' '}
          <Text style={styles.link} onPress={() => Linking.openURL('https://kartikdixit.vercel.app')}>
            Privacy Policy
          </Text>{' '}
          and{' '}
          <Text style={styles.link} onPress={() => Linking.openURL('https://kartikdixit.vercel.app')}>
            Refund Policy
          </Text>.
        </Text>
      </View>

      </ScrollView>

      {/* Footer */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.button}
          onPress={() => {
            // Handle Payment Navigation
            navigation.navigate('Payment', { finalAmount });
          }}

        >
          <Text style={styles.buttonText}>
            Proceed to Pay ₹{finalAmount.toFixed(0)}
          </Text>
        </TouchableOpacity>
        <Text style={styles.note}>
          Note: A small advance will be collected now. Remaining amount is
          payable after confirmation.
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollContent: {
    padding: 16,
    marginBottom: 100, // to avoid overlapping the button
  },
  heading: {
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 6,
    color: '#333',
  },
  description: {
    fontSize: 14,
    color: '#666',
    marginBottom: 20,
  },
  section: {
    marginBottom: 20,
  },
  subheading: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 10,
    color: '#222',
  },
  featureText: {
    fontSize: 14,
    color: '#555',
    marginLeft: 10,
    marginBottom: 4,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 6,
  },
  rowTotal: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 12,
    borderTopWidth: 1,
    borderColor: '#eee',
    marginTop: 8,
  },
  label: {
    fontSize: 14,
    color: '#444',
  },
  value: {
    fontSize: 14,
    fontWeight: '500',
    color: '#000',
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: '700',
  },
  totalValue: {
    fontSize: 16,
    fontWeight: '700',
    color: '#000',
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    padding: 16,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderColor: '#eee',
  },
  button: {
    backgroundColor: '#FFD700',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    fontWeight: '700',
    fontSize: 16,
    color: '#000',
  },
  note: {
    marginTop: 10,
    fontSize: 13,
    color: '#777',
    textAlign: 'center',
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginTop: 24,
    gap: 8, // Optional: adjust for spacing between checkbox and text
    paddingRight: 16,
    maxWidth: '90%',
  },
  checkboxText: {
    flex: 1,
    fontSize: 14,
    color: '#374151', // Tailwind's gray-700
  },
  link: {
    color: '#4F46E5', // Indigo-600
    textDecorationLine: 'underline',
  },

});
