import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Linking,
} from 'react-native';
import { SERVER_IP } from '@env';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Checkbox } from 'react-native-paper';

export default CheckoutScreen = ({ navigation, route }) => {
  //   const { priest, dateOption, selectedDate } = route.params;
  const { priest_id, dateOption, selectedDate, package_id } = route.params;

  const BookingObject = { 
    package_id: package_id,
    dateOption: dateOption, 
    date: new Date(selectedDate).toLocaleDateString(),
    priest_id: priest_id
  }

  const [checkoutInfo, setCheckoutInfo] = useState({});
  const [orderInfo, setOrderInfo] = useState({});
  const [agree, setAgree] = useState(false);

  const tax = 0.18;
  const [finalAmount, setFinalAmount] = useState(null);
  const [totalCost, setTotalCost] = useState(null);
  const [taxAmount, setTaxAmount] = useState(null);
  const [discount, setDiscount] = useState(null);


  useEffect(() => {
    const fetchCheckoutInfo = async () => {
      try {
        const token = await AsyncStorage.getItem('authToken');
        const response = await fetch(
          `${SERVER_IP}/api/client/fetch/checkout/${package_id}`,
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
          const fetchedData = data.data;
          const _totalCost = fetchedData.package_price + fetchedData.travel_cost;
          const _taxAmount = _totalCost * tax;
          const _discount = _taxAmount;
          const _finalAmount = _totalCost + _taxAmount - _discount;
          console.log(_finalAmount)
    
          setCheckoutInfo(fetchedData);
          setTotalCost(_totalCost);
          setTaxAmount(_taxAmount);
          setDiscount(_discount);
          setFinalAmount(_finalAmount);

          await fetchPaymentInfo(_finalAmount);
        }
      } catch (error) {
        console.error('Error fetching puja Packages:', error);
      }
    };

    const fetchPaymentInfo = async (amount) => {
      console.log("final amount is: ", amount);
      try {
        const token = await AsyncStorage.getItem('authToken');
        const res = await fetch(`${SERVER_IP}/api/payment/create-order/`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ amount: (amount*100) / 2 }), // Half payment
        });
    
        const data = await res.json();
        setOrderInfo(data.data);
        console.log("Order info:", data.data);
      } catch (err) {
        console.error('Failed to fetch Razorpay order:', err);
      }
    };
    

    fetchCheckoutInfo();
  }, []);

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Puja Info */}
        <Text style={styles.heading}>{checkoutInfo.puja_name}</Text>
        <Text style={styles.description}>{checkoutInfo.puja_desc}</Text>

        {/* Package Details */}
        <View style={styles.section}>
          <Text style={styles.subheading}>{checkoutInfo.package_name}</Text>

          {Array.isArray(checkoutInfo.features) &&
            checkoutInfo.features.map((feature, i) => (
              <Text key={i} style={styles.featureText}>
                • {feature}
              </Text>
            ))}
        </View>

        {/* Cost Breakdown */}
        <View style={styles.section}>
          <Text style={styles.subheading}>Cost Breakdown</Text>
          <View style={styles.row}>
            <Text style={styles.label}>Puja Base Price</Text>
            <Text style={styles.value}>₹{checkoutInfo.package_price}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Intra-State Travel Cost</Text>
            <Text style={styles.value}>₹{checkoutInfo.travel_cost}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>GST (18%)</Text>
            <Text style={styles.value}>₹{taxAmount}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Discount</Text>
            <Text style={styles.value}>₹{discount}</Text>
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
            <Text style={styles.totalValue}>₹{finalAmount}</Text>
          </View>

          <View style={styles.rowTotal}>
            <Text style={styles.totalLabel}>Current Payable (50%)</Text>
            <Text style={styles.totalValue}>
              ₹{(finalAmount / 2)}
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
            <Text
              style={styles.link}
              onPress={() => Linking.openURL('https://kartikdixit.vercel.app')}
            >
              Terms & Conditions
            </Text>
            ,{' '}
            <Text
              style={styles.link}
              onPress={() => Linking.openURL('https://kartikdixit.vercel.app')}
            >
              Privacy Policy
            </Text>{' '}
            and{' '}
            <Text
              style={styles.link}
              onPress={() => Linking.openURL('https://kartikdixit.vercel.app')}
            >
              Refund Policy
            </Text>
            .
          </Text>
        </View>
      </ScrollView>

      {/* Footer */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.button}
          onPress={() => {
            // Handle Payment Navigation
            navigation.navigate('Payment', { finalAmount:finalAmount*100, currentAmount: (finalAmount/2)*100, orderInfo: orderInfo , BookingObject:BookingObject});
          }}
        >
          <Text style={styles.buttonText}>
            Proceed to Pay ₹{(finalAmount/2)}
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
