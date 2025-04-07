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
  StyleSheet,
} from 'react-native';
import { styles } from '../css/style';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';

const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;

function TrendingCard({ data, CARD_WIDTH, CARD_HEIGHT }) {
  // const CARD_WIDTH = width * 0.7; // Adjust for two cards per screen
  // const CARD_HEIGHT = 160;

  return (
    <FlatList
      data={data}
      horizontal
      showsHorizontalScrollIndicator={false}
      keyExtractor={(item) => item.id}
      pagingEnabled
      snapToInterval={CARD_WIDTH + 20}
      contentContainerStyle={styles.listContainer}
      renderItem={({ item }) => (
        <View
          style={[styles.card, { width: CARD_WIDTH, height: CARD_HEIGHT }]}
        >
          <View
            style={[styles.trending_card_image, { height: CARD_HEIGHT * 0.7 }]}
          >
            <Image source={require('../assets/1.png')} style={styles.image} />
            <Text style={styles.specialTag}>{item.specialTag}</Text>
            <View style={styles.overlay} />
          </View>
          <View style={[styles.bottomRow, { maxHeight: CARD_HEIGHT * 0.3 }]}>
            <Text style={styles.title}>{item.title}</Text>
            <TouchableOpacity style={styles.bookNowContainer}>
              <Text style={[styles.bookNow, { fontSize: CARD_WIDTH * 0.05 }]}>
                Book Now →
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    />
  );
}

function CategoryCard({ data, type, CARD_WIDTH, CARD_HEIGHT }) {
  const localStyles = StyleSheet.create({
    categoryGridContainer: {
      // something special to be coded here
    },
    categoryGridContainer: {
      alignSelf: 'center',
      width: width - (width / 10) * 0.5,
      // borderWidth: 2,
      // justifyContent: 'space-between'
      marginBottom: 50,
    },
    catCard: {
      width: CARD_WIDTH,
      height: CARD_HEIGHT,
      marginBottom: 10,
      flex: 1,
      margin: 20,
    },
  });

  if (type == 'scroll') {
    return (
      <FlatList
        style={{ marginHorizontal: 10 }}
        data={data}
        horizontal
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item) => item.id.toString()}
        pagingEnabled
        snapToInterval={CARD_WIDTH + 20}
        contentContainerStyle={[
          styles.categoryContainer,
          localStyles.categoryContainer,
        ]}
        renderItem={({ item }) => (
          <Pressable
            style={[styles.catCard, localStyles.catCard]}
            onPress={() => {
              Alert.alert('Welcome to a dedicate page for ' + item.Name);
            }}
          >
            <View style={styles.category_card_image}>
              <Image
                source={require('../assets/images/imagesCategory/1.jpg')}
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
  } else if (type == 'grid') {
    return (
      <FlatList
        // style={{ marginHorizontal: 10 }}
        data={data}
        numColumns={2}
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item) => item.id.toString()}
        pagingEnabled
        snapToInterval={CARD_WIDTH + 20}
        contentContainerStyle={[
          styles.categoryContainer,
          localStyles.categoryGridContainer,
        ]}
        renderItem={({ item }) => (
          <Pressable
            style={[styles.catCard, localStyles.catCard]}
            onPress={() => {
              Alert.alert('Welcome to a dedicate page for ' + item.Name);
            }}
          >
            <View style={styles.category_card_image}>
              <Image
                source={require('../assets/images/imagesCategory/1.jpg')}
                // source={require(item.Image_URL)} // ❌ Fetching image dynamically from data
                style={styles.catCard_image}
              />
              {/* <View style={[styles.overlay]} /> */}
            </View>
            <View style={styles.bottomRowCategory}>
              <Text style={[styles.title, localStyles.title]}>{item.Name}</Text>
            </View>
          </Pressable>
        )}
      />
    );
  }
}

export { TrendingCard, CategoryCard };
