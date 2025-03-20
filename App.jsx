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
  Touchable,
  SafeAreaView,
  Pressable,
  Alert,
} from 'react-native';
import SignUp from './src/components/signUp';
import React, {useState} from 'react';
import {catData, data} from './data/data';
import { styles } from './src/css/style';
// import { SafeAreaView } from 'react-native-safe-area-context';
// import {BlurView} from '@react-native-community/blur';



const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;
const CARD_WIDTH = width * 0.7; // Adjust for two cards per screen
const CARD_HEIGHT = 160;

const App = () => {
  // const [showMenu,setShowMenu]=useState(false);
  // const [showMenu,setShowMenu]== useState(false);
  const [showMenu, setShowMenu] = useState(false);
  return (
    <ScrollView style={styles.container}>
      {showMenu && (
        <View
          style={{
            position: 'absolute',
            width: '100%',
            height: '100%',
            backgroundColor: 'rgba(0, 0, 0, 0.3)', // Dark overlay (fake blur effect)
            zIndex: 1,
          }}></View>
      )}
      {/* <View style={styles.safeareabar}></View> */}
      <View style={styles.topbar}>
        <Text style={styles.topbar_title}>
          Info@PujaHarGhar.in | 798-567-1212 {showMenu ? '(India)' : ''}
        </Text>
        {/* <FontAwesomeIcon icon="fa-solid fa-phone" /> */}
        {/* <Icon name="user" size={100} color="white" /> */}
      </View>
      <View style={styles.header}>
        <Pressable
          style={styles.menu_ico}
          onPress={() => {
            setShowMenu(!showMenu);
          }}>
          <View style={[styles.menu_ico_bar, styles.bar1]}></View>
          <View style={[styles.menu_ico_bar, styles.bar2]}></View>
          <View style={[styles.menu_ico_bar, styles.bar3]}></View>
        </Pressable>
        <View style={styles.logo_container}>
          <Image
            style={styles.logo}
            resizeMode="contain"
            source={require('./src/assets/Logo.png')}
          />
        </View>
        <View style={styles.flowerbar}>
          <Image
            style={styles.flowerbar_ico}
            resizeMode="contain"
            source={require('./src/assets/flower_bar.png')}
          />
        </View>
        <View style={styles.search_ico}>
          <Image
            style={styles.search_ico_img}
            // resizeMode="contain"
            source={require('./src/assets/search.png')}
          />
        </View>
      </View>

      {/* SIde Bar SECTION  */}

      <View
        style={
          showMenu
            ? {...styles.sideBar, display: 'flex', flexDirection: 'column'}
            : {display: 'none'}
        }>
        <View style={{...styles.header, borderColor: 'grey', minHeight: '8%'}}>
          <Pressable
            style={{...styles.menu_ico, marginTop: 6}}
            onPress={() => {
              setShowMenu(!showMenu);
            }}>
            <View style={[styles.menu_ico_bar, styles.bar11]}></View>
            <View style={[styles.menu_ico_bar, styles.bar11]}></View>
            <View style={[styles.menu_ico_bar, styles.bar11]}></View>
          </Pressable>

          <View style={styles.logo_container}>
            <Image
              style={styles.logo}
              resizeMode="contain"
              source={require('./src/assets/Logo.png')}
            />
          </View>

          <View style={styles.search_ico}>
            <Image
              style={styles.search_ico_img}
              // resizeMode="contain"
              source={require('./src/assets/search.png')}
            />
          </View>
        </View>
        <Image
          style={{
            ...styles.heading_underline,
            minWidth: '80%',
            marginHorizontal: 'auto',
          }}
          source={require('./src/assets/underline.png')}
        />

        <Pressable
          style={{
            padding: 22,
            marginLeft: -6,
            marginTop: 15,
            backgroundColor: '#ffbc00',
            width: '60%',
            borderEndEndRadius: 50,
            borderTopEndRadius: 50,
          }}>
          <Text style={{fontSize: 20, fontWeight: 'bold'}}>Signup/Login</Text>
        </Pressable>

        <View>
          <TouchableOpacity style={{...styles.sideBarServices}}>
            <Text style={{fontSize: 22}}>Services</Text>
            <Text style={{fontSize: 35, marginTop: 7}}>^</Text>
          </TouchableOpacity>
          <TouchableOpacity style={{...styles.sideBarServices}}>
            <Text style={{fontSize: 22}}>Category</Text>
            <Text style={{fontSize: 35, marginTop: 7}}>^</Text>
          </TouchableOpacity>{' '}
          <TouchableOpacity style={{...styles.sideBarServices}}>
            <Text style={{fontSize: 22}}>Category</Text>
            <Text style={{fontSize: 35, marginTop: 7}}>^</Text>
          </TouchableOpacity>{' '}
          <TouchableOpacity style={{...styles.sideBarServices}}>
            <Text style={{fontSize: 22}}>Category</Text>
            <Text style={{fontSize: 35, marginTop: 7}}>^</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* HOME SECTION  */}
      <View style={styles.home_section}>
        <ImageBackground
          source={require('./src/assets/background-img-main.png')} // Replace with your image path
          style={styles.background}>
          <Text style={styles.top_heading}>
            Perform your puja at your place with
          </Text>
          <Image
            style={styles.verified_img}
            source={require('./src/assets/pandit_verified.png')}
          />
          <Text style={styles.glow_heading}>From</Text>
          <Image
            style={styles.vrindavan_img}
            source={require('./src/assets/vrindavan-main-png.png')}
          />
        </ImageBackground>
      </View>

      <View style={styles.section}>
        <View style={styles.section_heading}>
          <Text style={styles.heading_text}>Trending Now</Text>
          <Image
            style={styles.swastik}
            source={require('./src/assets/swastik.png')}
          />
        </View>
        <Image
          style={styles.heading_underline}
          source={require('./src/assets/underline.png')}
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
                  source={require('./src/assets/1.png')}
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
            source={require('./src/assets/swastik.png')}
          />
        </View>
        <View style={{marginBottom: -90, marginLeft: 10}}>
          <Image
            style={styles.heading_underline}
            source={require('./src/assets/underline.png')}
          />
        </View>
      </View>
      {/* <FlatList style={styles.puja_slider}> */}
      <FlatList
        style={{marginHorizontal: 10}}
        data={catData}
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
            <View style={styles.catCard_image}>
              <Image
                source={require('./src/assets/images/imagesCategory/ShivjiPooja.jpg')}
                style={styles.image}
              />
              {/* <Text style={styles.specialTag}>Holi Special 🎉</Text> */}
              <View style={styles.overlay} />
            </View>
            <View style={styles.bottomRow}>
              <Text style={styles.title}>{item.Name}</Text>
            </View>
            <View style={styles.container_cat}>
              <View style={styles.glassBox}>
                <Text style={styles.text}>O</Text>
              </View>
            </View>
          </Pressable>
        )}
      />
    </ScrollView>
  );
};


export default SignUp;
