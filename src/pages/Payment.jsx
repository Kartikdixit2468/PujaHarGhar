import { View, Text } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SERVER_IP } from '@env';
import React, { useState, useEffect } from 'react';
import RazorpayCheckout from 'react-native-razorpay';

const Payment = ({ navigation, route }) => {
  const { finalAmount, currentAmount, orderInfo, BookingObject } = route.params;

  const VerifyPayment = async (verificationObject) => {
    try {
      const token = await AsyncStorage.getItem('authToken');
      const response = await fetch(`${SERVER_IP}/api/payment/verify-payment/`, {
        method: 'POst',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(verificationObject),
      });

      const data = await response.json();
      console.log(data);
      if (data.success) {
        console.log('Payment was legit.');
        return { success: true };
      }
    } catch (error) {
      console.log('Payment was fraudalent.');
      return { success: false, message: error.message };
    }
  };

  const openRazorpayCheckout = (orderInfo) => {
    const options = {
      description: 'Test Payment',
      image: 'https://your-logo-url.com/logo.png',
      currency: 'INR',
      key: 'rzp_test_SfmVAOU9cCkvjH',
      // amount: orderInfo.amount*100,
      name: 'PujaHarGhar',
      order_id: orderInfo.id,
      prefill: {
        email: 'user@example.com',
        contact: '8595872053',
        name: 'Test User',
      },
      theme: { color: '#53a20e' },
    };

    RazorpayCheckout.open(options)
      .then(async (data) => {
        console.log('In verification');
        const isPaymentLegit = await VerifyPayment(data);
        console.log('In verification II');
        console.log(isPaymentLegit);

        if (isPaymentLegit.success) {
          const BookingDetails = {
            ...BookingObject,
            payment_id: data.razorpay_payment_id,
          };
          console.log(BookingDetails);
          const token = await AsyncStorage.getItem('authToken');
          const response = await fetch(
            `${SERVER_IP}/api/client/create-order/booking/`,
            {
              method: 'POST',
              headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
              },
              body: JSON.stringify(BookingDetails),
            }
          );

          const isBooked = await response.json();

          if (isBooked.success) {
            navigation.navigate('BookingSuccess');
          } else {
            navigation.navigate('BookingFailiure');
          }
        } else {
          console.log(`Payment Error: ${isPaymentLegit.message}`);
          navigation.navigate('BookingFailiure');
        }
      })
      .catch((error) => {
        console.log(`Payment Error: ${error.code} | ${error.description}`);
        navigation.navigate('BookingFailiure');
      });
  };

  // Fetch order info on mount
  useEffect(() => {
    openRazorpayCheckout(orderInfo);
  }, []);

  return (
    <View>
      <Text>see in jsx of payment file.</Text>
    </View>
  );
};

export default Payment;
