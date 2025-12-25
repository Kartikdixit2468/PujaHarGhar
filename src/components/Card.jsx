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
import { SERVER_IP } from '@env';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialIcons'; // at top

const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;


function TrendingCard({ data }) {
  const navigation = useNavigation();
  const CARD_WIDTH = screenWidth * 0.65;
  const CARD_HEIGHT = CARD_WIDTH * 0.6;

  return (
    <FlatList
      data={data}
      horizontal
      showsHorizontalScrollIndicator={false}
      keyExtractor={(item) => item.puja_id}
      pagingEnabled
      snapToInterval={CARD_WIDTH + 20}
      contentContainerStyle={local_styles.listContainer}
      renderItem={({ item }) => (
        <View
          style={[
            local_styles.card,
            { width: CARD_WIDTH, height: CARD_HEIGHT },
          ]}
        >
          {/* Top: Image Section */}
          <View
            style={[local_styles.imageWrapper, { height: CARD_HEIGHT * 0.65 }]}
          >
            <Image
              // source={require('../assets/images/puja3.jpg')}
              source={{uri: `${SERVER_IP}/uploads/pujas/${item.img1}`}}
              // source={{uri: `http://192.168.10.128:3000/uploads/pujas/${item.img1}`}}

              style={local_styles.image}
            />
            

            {/* Booking Tag */}
            <View style={local_styles.tagContainer}>
              <Text style={local_styles.tagText}>
                🔥Most Famous
              </Text>
            </View>
          </View>

          {/* Bottom: Title and Button */}
          <View
            style={[local_styles.bottomRow, { height: CARD_HEIGHT * 0.35 }]}
          >
            <Text style={local_styles.title}>{item.name}</Text>
            {/* Inside renderItem */}
            <TouchableOpacity style={local_styles.bookNowButton}
            onPress={()=>{navigation.navigate('PujaPage', {id: item.puja_id})}}            
            >
              <Text style={local_styles.bookNowText}>Book Now</Text>
              <Icon
                name="chevron-right"
                size={20}
                color="#fff"
                style={{ marginLeft: 4 }}
              />
            </TouchableOpacity>
          </View>
        </View>
      )}
    />
  );
}

function CategoryCard({ data, type }) {
  const CARD_HEIGHT = screenHeight * 0.35;
  const CARD_WIDTH = CARD_HEIGHT * 0.6;

  const localStyles = StyleSheet.create({
    categoryGridContainer: {
      alignSelf: 'center',
      width: screenWidth - (screenWidth / 10) * 0.5,
      marginBottom: 50,
    },
    categoryContainer: {
      maxHeight: screenHeight * 0.4,
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
              Alert.alert('Welcome to a dedicate page for ' + item.name);
            }}
          >
            <View style={styles.category_card_image}>
              <Image
                source={{uri: `${SERVER_IP}/uploads/category/${item.image}`}}
                // source={{uri: `http://10.51.2.157:3000/uploads/category/${item.image}`}}
                style={styles.catCard_image}
              />
              {/* <View style={[styles.overlay]} /> */}
            </View>
            <View style={styles.bottomRowCategory}>
              <Text style={styles.title}>{item.name}</Text>
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
        contentContainerStyle={[localStyles.categoryGridContainer]}
        renderItem={({ item }) => (
          <Pressable
            style={[styles.catCard, localStyles.catCard]}
            onPress={() => {
              Alert.alert('Welcome to a dedicate page for ' + item.name);
            }}
          >
            <View style={styles.category_card_image}>
              <Image
                source={{uri: `http://192.168.10.128:3000/uploads/category/${item.image}`}}
                // source={require('../assets/images/imagesCategory/1.jpg')}
                style={styles.catCard_image}
              />
              {/* <View style={[styles.overlay]} /> */}
            </View>
            <View style={styles.bottomRowCategory}>
              <Text style={[styles.title, localStyles.title]}>{item.name}</Text>
            </View>
          </Pressable>
        )}
      />
    );
  }
}

const local_styles = StyleSheet.create({
  listContainer: {
    paddingLeft: 15,
    paddingRight: 5,
    // borderWidth: 3,
  },
  card: {
    backgroundColor: '#fff',
    // backgroundColor: '#fff6e7',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#ddd',
    overflow: 'hidden',
    marginRight: 20,
  },
  imageWrapper: {
    width: '100%',
    overflow: 'hidden',
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  tagContainer: {
    position: 'absolute',
    top: 8,
    left: 0,
    backgroundColor: '#FFE600',
    paddingVertical: 4,
    paddingHorizontal: 12,
    borderTopRightRadius: 20,
    borderBottomRightRadius: 20,
  },
  tagText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#333',
  },
  bottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
  },
  title: {
    fontWeight: 'bold',
    fontSize: 14,
    flex: 1,
    color: '#222',
  },
  bookNowButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFA500',
    paddingHorizontal: 8,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  bookNowText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
});

export { TrendingCard, CategoryCard };
