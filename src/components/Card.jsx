import React from 'react';
import {
  Image,
  View,
  Text,
  Pressable,
  Alert,
  Dimensions,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import {styles} from '../css/style';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';

function TrendingCard({data}) {
  const width = Dimensions.get('window').width;
  // const height = Dimensions.get('window').height;
  const CARD_WIDTH = width * 0.7; // Adjust for two cards per screen
  // const CARD_HEIGHT = 160;

  return (
    <FlatList
      data={data}
      horizontal
      showsHorizontalScrollIndicator={false}
      keyExtractor={item => item.id}
      pagingEnabled
      snapToInterval={CARD_WIDTH + 20}
      contentContainerStyle={styles.listContainer}
      renderItem={({item}) => (
        <View style={styles.card}>
          <View style={styles.trending_card_image}>
            <Image source={require('../assets/1.png')} style={styles.image} />
            <Text style={styles.specialTag}>{item.specialTag}</Text>
            <View style={styles.overlay} />
          </View>
          <View style={styles.bottomRow}>
            <Text style={styles.title}>{item.title}</Text>
            <TouchableOpacity style={styles.bookNowContainer}>
              <Text style={[styles.bookNow, {fontSize: CARD_WIDTH * 0.05}]}>
                Book Now →
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    />
  );
}

function CategoryCard({data, CARD_WIDTH, CARD_HEIGHT}) {

  return (
    <FlatList
      style={{marginHorizontal: 10}}
      data={data}
      horizontal
      showsHorizontalScrollIndicator={false}
      keyExtractor={item => item.id.toString()}
      pagingEnabled
      snapToInterval={CARD_WIDTH + 20}
      contentContainerStyle={styles.categoryContainer}
      renderItem={({item}) => (
        <Pressable
        style={{...styles.catCard}}
        onPress={() => {
          Alert.alert('Welcome to a dedicate page for ' + item.Name);
        }}>
          <View style={styles.category_card_image}>
            <Image
              source={require("../assets/images/imagesCategory/1.jpg")}
              // source={require(item.Image_URL)} // ❌ Fetching image dynamically from data
              style={styles.catCard_image}
            />
            {/* <View style={[styles.overlay]} /> */}
          </View>
          <View style={styles.bottomRowCategory}>
            <Text style={styles.title}>{item.Name}</Text>
          </View>
        </Pressable>
      )}
    />
  );
}

export {TrendingCard, CategoryCard};