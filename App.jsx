import {
  StyleSheet,
  Text,
  View,
  Dimensions,
  Image,
  ScrollView,
  ImageBackground,
  TouchableOpacity,
  FlatList,
} from 'react-native';
import React from 'react';
// import { SafeAreaView } from 'react-native-safe-area-context';

const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;
const CARD_WIDTH = width * 0.7; // Adjust for two cards per screen
const CARD_HEIGHT = 160;

const data = [
  {
    id: '1',
    title: 'Holika Dahan Pooja',
    subtitle: 'Grah Dosh aur Vastu Dosh ki Nivaran',
    date: '13 Mar 2025',
  },
  {
    id: '2',
    title: 'Hanuman Pooja',
    subtitle: 'Bajrang Bali ka Raksha Kavach',
    date: '14 Mar 2025',
  },
  {
    id: '3',
    title: 'Shivratri Pooja',
    subtitle: "Lord Shiva's Blessings",
    date: '15 Mar 2025',
  },
  {
    id: '4',
    title: 'Holika Dahan Pooja',
    subtitle: 'Grah Dosh aur Vastu Dosh ki Nivaran',
    date: '13 Mar 2025',
  },
  {
    id: '5',
    title: 'Hanuman Pooja',
    subtitle: 'Bajrang Bali ka Raksha Kavach',
    date: '14 Mar 2025',
  },
  {
    id: '6',
    title: 'Diwali Lakshmi Pooja',
    subtitle: 'Wealth & Prosperity Ritual',
    date: '16 Mar 2025',
  },
];

const App = () => {
  return (
    <ScrollView style={styles.container}>
      {/* <View style={styles.safeareabar}></View> */}
      <View style={styles.topbar}>
        <Text style={styles.topbar_title}>
          Info@PujaHarGhar.in | 798-567-1212
        </Text>
        {/* <FontAwesomeIcon icon="fa-solid fa-phone" /> */}
        {/* <Icon name="user" size={100} color="white" /> */}
      </View>
      <View style={styles.header}>
        <View style={styles.menu_ico}>
          <View style={[styles.menu_ico_bar, styles.bar1]}></View>
          <View style={[styles.menu_ico_bar, styles.bar2]}></View>
          <View style={[styles.menu_ico_bar, styles.bar3]}></View>
        </View>
        <View style={styles.logo_container}>
          <Image
            style={styles.logo}
            resizeMode="contain"
            source={require('./assets/Logo.png')}
          />
        </View>
        <View style={styles.flowerbar}>
          <Image
            style={styles.flowerbar_ico}
            resizeMode="contain"
            source={require('./assets/flower_bar.png')}
          />
        </View>
        <View style={styles.search_ico}>
          <Image
            style={styles.search_ico_img}
            // resizeMode="contain"
            source={require('./assets/search.png')}
          />
        </View>
      </View>

      {/* HOME SECTION  */}
      <View style={styles.home_section}>
        <ImageBackground
          source={require('./assets/background-img-main.png')} // Replace with your image path
          style={styles.background}>
          <Text style={styles.top_heading}>
            Perform your puja at your place with
          </Text>
          <Image
            style={styles.verified_img}
            source={require('./assets/pandit_verified.png')}
          />
          <Text style={styles.glow_heading}>From</Text>
          <Image
            style={styles.vrindavan_img}
            source={require('./assets/vrindavan-main-png.png')}
          />
        </ImageBackground>
      </View>

      <View style={styles.section}>
        <View style={styles.section_heading}>
          <Text style={styles.heading_text}>Trending Now</Text>
          <Image
            style={styles.swastik}
            source={require('./assets/swastik.png')}
          />
        </View>
        <Image
          style={styles.heading_underline}
          source={require('./assets/underline.png')}
        />
        {/* <FlatList style={styles.puja_slider}> */}
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
              <View style={styles.card_image}>
                <Image
                  source={require('./assets/1.png')}
                  style={styles.image}
                />
                <Text style={styles.specialTag}>Holi Special 🎉</Text>
                <View style={styles.overlay} />
              </View>
              <View style={styles.bottomRow}>
                <Text style={styles.title}>{item.title}</Text>
                <TouchableOpacity style={styles.bookNowContainer}>
                  <Text style={styles.bookNow}>Book Now →</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        />
      </View>

      <View style={styles.section}>
        <View style={styles.section_heading}>
          <Text style={styles.heading_text}>By Category</Text>
          <Image
            style={styles.swastik}
            source={require('./assets/swastik.png')}
          />
        </View>
        <Image
          style={styles.heading_underline}
          source={require('./assets/underline.png')}
        />
      </View>
      {/* <FlatList style={styles.puja_slider}> */}
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
            <View style={styles.card_image}>
              <Image source={require('./assets/1.png')} style={styles.image} />
              <Text style={styles.specialTag}>Holi Special 🎉</Text>
              <View style={styles.overlay} />
            </View>
            <View style={styles.bottomRow}>
              <Text style={styles.title}>{item.title}</Text>
              <TouchableOpacity style={styles.bookNowContainer}>
                <Text style={styles.bookNow}>Book Now →</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff7ea',
    padding: 0,
  },
  topbar_title: {
    color: 'white',
  },
  safeareabar: {
    top: 0,
    height: 25,
    width: '100%',
    backgroundColor: 'grey',
  },
  topbar: {
    backgroundColor: '#ffbc00',
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 5,
  },
  header: {
    // flex: 1,
    flexDirection: 'row',
    backgroundColor: '#f9f7f9',
    paddingHorizontal: 5,
    alignItems: 'center',
    justifyContent: 'center',
    maxHeight: 60,
    height: '100%',
  },
  menu_ico: {
    flex: 2,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 3,
    width: '50%',
    maxHeight: 120,
  },
  menu_ico_bar: {
    maxWidth: 45,
    backgroundColor: '#f08c1f',
    maxHeight: 8,
    height: '10%',
    width: '90%',
    margin: 2,
    borderRadius: 20,
    alignSelf: 'flex-start',
  },
  bar1: {
    width: '90%',
  },
  bar2: {
    width: '75%',
  },
  bar3: {
    width: '50%',
  },
  logo_container: {
    height: '100%',
    flex: 7,
    paddingHorizontal: 5,
  },
  logo: {
    width: '100%',
    height: '100%',
  },
  flowerbar: {
    flex: 7,
    overflow: 'hidden',
    height: '90%',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 2,
  },
  flowerbar_ico: {
    resizeMode: 'contain',
    height: 100,
    width: '100%',
  },
  search_ico: {
    flex: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  search_ico_img: {
    resizeMode: 'contain',
    height: '80%',
    width: '70%',
    zIndex: 99,
    // borderWidth: 2,
    // borderColor: "black",
  },
  title: {
    color: 'white',
    fontWeight: 400,
  },
  background: {
    resizeMode: 'contain', // or 'contain', 'stretch'
    height: '100%',
    paddingHorizontal: 10,
  },
  home_section: {
    maxWidth: '100%',
    maxHeight: '45%',
    overflow: 'hidden',
    // borderWidth: 6,
    // borderColor: "green",
  },
  top_heading: {
    marginTop: 20,
    marginVertical: 10,
    color: 'white',
    fontSize: 25,
    maxWidth: '70%',
    fontFamily: 'Fredoka-SemiBold',
    // borderWidth: 4,
    // borderColor: "green",
  },
  verified_img: {
    // position: "absolute",
    // resizeMode: 'stretch', // or 'contain', 'stretch'
    marginTop: -15,
    left: -6,
    maxWidth: '75%',
    maxHeight: 80,
    // borderWidth: 2,
    // borderColor: "red",
  },
  glow_heading: {
    marginTop: -30,
    marginHorizontal: 10,
    color: 'white',
    fontSize: 40,
    fontFamily: 'Fredoka-Bold',
    fontWeight: 500,
    textShadowColor: 'rgba(255, 255, 255, 0.8)', // Glow effect
    textShadowOffset: {width: 0, height: 0},
    textShadowRadius: 30, // Adjust for a stronger glow
    // borderWidth: 4,
    // borderColor: "purple",
  },
  vrindavan_img: {
    resizeMode: 'contain',
    marginVertical: 5,
    maxHeight: 100,
    maxWidth: '90%',
    // borderWidth: 4,
    // borderColor: "green",
  },
  section: {
    margin: 10,
    maxHeight: height*0.35,
    // borderWidth: 2,
    // borderColor: 'green',
  },
  section_heading: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    // borderWidth: 4,
    // borderColor: 'green',
  },
  heading_text: {
    margin: 4,
    color: '#ffbc00',
    fontSize: 30,
    fontFamily: 'bernoru-blackultraexpanded',
    fontWeight: 'bold',
  },
  swastik: {
    marginTop: 5,
    resizeMode: 'contain',
    marginHorizontal: 5,
    height: 40,
    width: 40,
    // borderWidth: 4,
    // borderColor: 'green',
  },
  heading_underline: {
    marginBottom: 10,
    resizeMode: 'cover',
    maxWidth: '60%',
    maxHeight: 10,
    // borderWidth: 4,
    // borderColor: "yellow",
  },
  puja_slider: {
    borderWidth: 4,
    borderColor: 'red',
  },
  listContainer: {
    paddingHorizontal: 5,
  },
  card: {
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
    backgroundColor: '#fff',
    borderRadius: 15,
    overflow: 'hidden',
    marginHorizontal: 10,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 3},
    shadowOpacity: 0.2,
    shadowRadius: 4,
    position: 'relative',
    overflow: 'hidden',
    paddingBottom: 0,
  },
  image: {
    width: '100%',
    height: '100%', // Reduced height to fit text
    resizeMode: 'cover',
  },
  card_image: {
    height: CARD_HEIGHT * 0.7,
    // borderWidth: 3,
  },
  bottomRow: {
    // flex: 3, // Takes available space
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 10,
    maxHeight: CARD_HEIGHT * 0.3,
    paddingHorizontal: 10,
    marginBottom: 0,
    // borderWidth: 3,
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '55%',
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    zIndex: -1,
  },
  specialTag: {
    position: 'absolute',
    marginTop: 15,
    fontSize: 12,
    fontWeight: 'bold',
    color: 'white',
    backgroundColor: '#aa53d1',
    padding: 5,
    paddingLeft: 20,
    borderTopRightRadius: 20,
    borderBottomRightRadius: 20,
  },
  title: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#555555',
    fontFamily: 'Fredoka-SemiBold',
    marginVertical: 1,
    paddingVertical: 10,
  },
  bookNow: {
    fontSize: 15,
    fontWeight: 'bold',
    color: 'white',
    // fontFamily: 'Fredoka_Condensed-Bold',
    fontFamily: 'Fredoka-SemiBold',
  },
  bookNowContainer: {
    alignContent: 'center',
    justifyContent: 'center',
    // padding: 6,
    paddingHorizontal: 10,
    backgroundColor: '#ffbc00',
    borderRadius: 20,
    height: '80%',
    marginLeft: 10,
    marginRight: 0,
    flex: 1,
    // borderWidth: 2,
  },
});

export default App;
