import React from 'react';
import { View, StyleSheet, ScrollView, Dimensions} from 'react-native';
import { CategoryCard } from '../components/Card';
import { catData } from '../../data/data';


const width = Dimensions.get('window').width
const height = Dimensions.get('window').height
const CARD_WIDTH = width * 0.35; // Adjust for two cards per screen
const CARD_HEIGHT = height/2.8;

const Categories = () => {
  return(
    <ScrollView style={localStyles.cardContainer} keyboardShouldPersistTaps="handled">
        <CategoryCard type='grid' data={catData} CARD_HEIGHT={CARD_HEIGHT} CARD_WIDTH={CARD_WIDTH} />
  </ScrollView>
)};



const localStyles = StyleSheet.create({
  cardContainer: {
    paddingVertical: 10,
  }
})
export default Categories;
