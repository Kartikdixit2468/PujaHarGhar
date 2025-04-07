import {
  Text,
  View,
  Dimensions,
  Image,
  ScrollView,
  ImageBackground,
  Pressable,
  Alert,
  TextInput,
} from 'react-native';
import React, { useState } from 'react';
import { catData, data } from '../../data/data';
import { styles } from '../css/style';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faXmark } from '@fortawesome/free-solid-svg-icons';
import { CategoryCard, TrendingCard } from '../components/Card';
import SideMenu from '../components/SideMenu';

const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;
const TREND_CARD_WIDTH = width * 0.75; // Adjust for two cards per screen
const TREND_CARD_HEIGHT = 160;
const CAT_CARD_WIDTH = width * 0.55; // Adjust for two cards per screen
const CAT_CARD_HEIGHT = height/2.2;

const Home = ({ navigation }) => {
  const [showMenu, setShowMenu] = useState(false);
  const [isSearch, setSearch] = useState(false);
  const [searchVal, setSearchVal] = useState('');
  const handleSearch = () => {
    if (isSearch) {
      searchVal.length == 0
        ? setSearch(false)
        : Alert.alert(`Making Searcing... for Key=${searchVal}`);
    } else {
      setSearch(true);
    }
  };
  return (
    <ScrollView style={styles.container} keyboardShouldPersistTaps="handled">
      {showMenu && (
        <View
          style={{
            position: 'absolute',
            width: '100%',
            height: '100%',
            backgroundColor: 'rgba(0, 0, 0, 0.3)', // Dark overlay (fake blur effect)
            zIndex: 1,
          }}
        ></View>
      )}

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
          }}
        >
          <View style={[styles.menu_ico_bar, styles.bar1]}></View>
          <View style={[styles.menu_ico_bar, styles.bar2]}></View>
          <View style={[styles.menu_ico_bar, styles.bar3]}></View>
        </Pressable>

        {/* If the Search is On then this will not render */}
        {!isSearch && (
          <>
            <View style={styles.logo_container}>
              <Image
                style={styles.logo}
                resizeMode="contain"
                source={require('../assets/Logo.png')}
              />
            </View>
            <View style={styles.flowerbar}>
              <Image
                style={styles.flowerbar_ico}
                resizeMode="contain"
                source={require('../assets/flower_bar.png')}
              />
            </View>
          </>
        )}
        {isSearch && (
          <>
            <TextInput
              value={searchVal}
              placeholder="Search..."
              onChangeText={(searchVal) => {
                setSearchVal(searchVal);
              }} // ✅ Fixed
              style={[
                styles.topbar_input,
                styles.input,
                { padding: 0, paddingLeft: '2%' },
              ]}
              returnKeyType="search"
              onSubmitEditing={handleSearch}
            />

            <Pressable
              style={{
                borderLeftWidth: 0,
                width: '10%',
                justifyContent: 'center',
                height: '80%',
                color: 'black',
                borderWidth: 1,
                backgroundColor: 'white',
                borderColor: '#badada',
              }}
              onPress={() => {
                setSearchVal('');
                setSearch(!isSearch);
              }}
            >
              <FontAwesomeIcon icon={faXmark} size={30} color="red" />
            </Pressable>
          </>
        )}

        <Pressable style={styles.search_ico} onPress={handleSearch}>
          <Image
            style={styles.search_ico_img}
            // resizeMode="contain"
            source={require('../assets/search.png')}
          />
        </Pressable>
      </View>

      {/* SIde Bar SECTION  */}

      {showMenu && (
        <SideMenu
          setShowMenu={setShowMenu}
          showMenu={showMenu}
          MobileWidth={width}
          MobileHeight={height}
          navigation={navigation}
        />
      )}

      {/* HOME SECTION  */}
      <View style={styles.home_section}>
        <ImageBackground
          source={require('../assets/background-img-main.png')} // Replace with your image path
          style={styles.background}
        >
          <Text style={styles.top_heading}>
            Perform your puja at your place with
          </Text>
          <Image
            style={styles.verified_img}
            source={require('../assets/pandit_verified.png')}
          />
          <Text style={styles.glow_heading}>From</Text>
          <Image
            style={styles.vrindavan_img}
            source={require('../assets/vrindavan-main-png.png')}
          />
        </ImageBackground>
      </View>

      {/* Trending section Starts from Here  */}

      <View style={[styles.section, styles.trending_section]}>
        <View style={styles.section_heading}>
          <Text style={styles.heading_text}>Trending Now</Text>
          <Image
            style={styles.swastik}
            source={require('../assets/swastik.png')}
          />
        </View>
        <Image
          style={styles.heading_underline}
          source={require('../assets/underline.png')}
        />
        <TrendingCard
          data={data}
          CARD_HEIGHT={TREND_CARD_HEIGHT}
          CARD_WIDTH={TREND_CARD_WIDTH}
        />
      </View>

      {/* Category section Starts from Here  */}

      <View style={[styles.section, styles.category_section]}>
        <View style={styles.section_heading}>
          <Text style={styles.heading_text}>By Category</Text>
          <Image
            style={styles.swastik}
            source={require('../assets/swastik.png')}
          />
        </View>
        {/* <View style={{borderWidth: 2}}> */}
        <Image
          style={styles.heading_underline}
          source={require('../assets/underline.png')}
        />
        {/* </View> */}
        <CategoryCard
          type="scroll"
          data={catData}
          CARD_WIDTH={CAT_CARD_WIDTH}
          CARD_HEIGHT={CAT_CARD_HEIGHT}
        />
      </View>
    </ScrollView>
  );
};

export default Home;
