import React, {useEffect, useState} from 'react';
import { View, StyleSheet, ScrollView, Dimensions} from 'react-native';
import { CategoryCard } from '../components/Card';
import {SERVER_IP} from '@env';
// import { catData } from '../../data/data';
import AsyncStorage from '@react-native-async-storage/async-storage';


const width = Dimensions.get('window').width
const height = Dimensions.get('window').height
const CARD_WIDTH = width * 0.35; // Adjust for two cards per screen
const CARD_HEIGHT = height/2.8;

const Categories = () => {


  const [pujaCategories, setPujaCategories] = useState([]);

  useEffect(() => {
    
      const fetchPujaCategories = async () => {
        try {
          const token = await AsyncStorage.getItem('authToken');
          const response = await fetch(`${SERVER_IP}/api/client/pujas/Category`, {
            method: 'GET',
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          });
    
        const data = await response.json();
        if (data.success){
          console.log("category fetching successfull")
        setPujaCategories(data.data);
        }
      } catch (error) {
        console.error('Error fetching puja categories:', error);
      }
    };

  
    fetchPujaCategories();
  }, []);
  

  return(
    // <ScrollView style={localStyles.cardContainer} keyboardShouldPersistTaps="handled">
    <View style={localStyles.cardContainer} keyboardShouldPersistTaps="handled">
        <CategoryCard type='grid' data={pujaCategories} CARD_HEIGHT={CARD_HEIGHT} CARD_WIDTH={CARD_WIDTH} />
  </View>
  // {/* </ScrollView> */}
)};


const localStyles = StyleSheet.create({
  cardContainer: {
    paddingVertical: 10,
  }
})
export default Categories;
