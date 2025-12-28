import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Linking,
  Dimensions,
} from 'react-native';
import { SERVER_IP } from '@env';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Checkbox } from 'react-native-paper';
import Ionicons from 'react-native-vector-icons/Ionicons';


export default CheckoutScreen = ({ navigation, route }) => {
  //   const { priest, dateOption, selectedDate } = route.params;
  const { priest_id, dateOption, selectedDate, package_id } = route.params;

  const BookingObject = { 
    package_id: package_id,
    dateOption: dateOption, 
    date: new Date(selectedDate).toLocaleDateString(),
    priest_id: priest_id
  }

  console.log("See below!")
  console.log(BookingObject)

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
    <View style={styles.wrapper}>
      {/* Custom Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          onPress={() => navigation.goBack()}
          style={styles.headerButton}
        >
          <Ionicons name="chevron-back" size={26} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Checkout</Text>
        <View style={styles.headerButton} />
      </View>

      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Puja Info */}
        <Text style={styles.heading}>{checkoutInfo.puja_name}</Text>
        <Text style={styles.description}>{checkoutInfo.puja_desc}</Text>

        {/* Package Details */}
        <View style={styles.section}>
          <Text style={styles.subheading}>📦 {checkoutInfo.package_name}</Text>

          {Array.isArray(checkoutInfo.features) &&
            checkoutInfo.features.map((feature, i) => (
              <View key={i} style={styles.featureRow}>
                <View style={styles.featureDot} />
                <Text style={styles.featureText}>{feature}</Text>
              </View>
            ))}
        </View>


        {/* Cost Breakdown */}
        <View style={styles.section}>
          <Text style={styles.subheading}>💰 Cost Breakdown</Text>
          <View style={styles.breakdownCard}>
            <View style={styles.row}>
              <Text style={styles.label}>Puja Base Price</Text>
              <Text style={styles.value}>₹{checkoutInfo.package_price}</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.label}>Travel Cost</Text>
              <Text style={styles.value}>₹{checkoutInfo.travel_cost}</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.label}>GST (18%)</Text>
              <Text style={styles.value}>₹{taxAmount?.toFixed(2)}</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.label}>Discount</Text>
              <Text style={[styles.value, styles.discount]}>-₹{discount?.toFixed(2)}</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.label}>📅 Preferred Date</Text>
              <Text style={styles.value}>
                {selectedDate
                  ? new Date(selectedDate).toLocaleDateString()
                  : 'We\'ll help'}
              </Text>
            </View>

            <View style={styles.divider} />

            <View style={styles.rowTotal}>
              <Text style={styles.totalLabel}>Final Amount</Text>
              <Text style={styles.totalValue}>₹{finalAmount?.toFixed(2)}</Text>
            </View>

            <View style={styles.rowTotal}>
              <Text style={styles.payableLabel}>Current Payable (50%)</Text>
              <Text style={styles.payableValue}>₹{(finalAmount / 2)?.toFixed(2)}</Text>
            </View>
          </View>
        </View>

        <View style={styles.checkboxContainer}>
          <Checkbox
            status={agree ? 'checked' : 'unchecked'}
            onPress={() => setAgree(!agree)}
            color="#ce8123"
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
          style={[
            styles.button,
            !agree && styles.buttonDisabled,
          ]}
          disabled={!agree}
          activeOpacity={agree ? 0.8 : 0.5}
          onPress={() => {
            if (agree) {
              navigation.navigate('Payment', { finalAmount:finalAmount*100, currentAmount: (finalAmount/2)*100, orderInfo: orderInfo , BookingObject:BookingObject});
            }
          }}
        >
          <Text style={styles.buttonText}>
            💳 Proceed to Pay ₹{(finalAmount/2)?.toFixed(2)}
          </Text>
        </TouchableOpacity>
        <Text style={styles.note}>
          ⏱️ Note: A small advance will be collected now. Remaining amount is
          payable after confirmation.
        </Text>
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
  featureRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  featureDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#ce8123',
    marginRight: 8,
  },
  breakdownCard: {
    borderWidth: 1.5,
    borderColor: '#E8E3DD',
    borderRadius: 12,
    padding: 16,
    backgroundColor: '#FAFAF8',
    marginBottom: 12,
  },
  divider: {
    height: 1,
    backgroundColor: '#e0e0e0',
    marginVertical: 12,
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
  payableLabel: {
    fontSize: 16,
    fontWeight: '700',
    color: '#ce8123',
  },
  payableValue: {
    fontSize: 16,
    fontWeight: '700',
    color: '#ce8123',
  },
  discount: {
    color: '#ce8123',
    fontWeight: '600',
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
  buttonDisabled: {
    backgroundColor: '#D4C4B4',
    opacity: 0.6,
    shadowOpacity: 0,
    elevation: 0,
  },
  buttonText: {
    fontWeight: '700',
    fontSize: 16,
    color: '#fff',
  },
  note: {
    marginTop: 12,
    fontSize: 13,
    color: '#777',
    textAlign: 'center',
    fontWeight: '500',
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginTop: 24,
    gap: 8,
    paddingRight: 16,
    maxWidth: '90%',
  },
  checkboxText: {
    flex: 1,
    fontSize: 14,
    color: '#374151',
  },
  link: {
    color: '#4F46E5',
    textDecorationLine: 'underline',
  },
});
