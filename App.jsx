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
  TextInput,
} from 'react-native';
import SignUp from './src/components/signUp';
import React, { useState } from 'react';
import { catData, data } from './data/data';
import { styles } from './src/css/style';
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { CategoryCard, TrendingCard } from './src/components/Card';
import SideMenu from './src/components/SideMenu';

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
  const [isSearch, setSearch] = useState(true);
  const [searchVal, setSearchVal] = useState("");
  const handleSearch = () => {
    if (isSearch) {
      searchVal.length == 0 ? setSearch(false) : Alert.alert(`Making Searcing... for Key=${searchVal}`);
    }
    else {
      setSearch(true)
    }

  }
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

        {/* If the Search is On then this will not render */}
        {!isSearch &&
          <>
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
          </>
        }
        {
          isSearch &&
          <>
            <TextInput
              value={searchVal}
              onChangeText={(searchVal) => { setSearchVal(searchVal) }}// ✅ Fixed
              style={[styles.topbar_input, styles.input,
              { padding: 0, paddingLeft: "2%" }
              ]}
              returnKeyType="search"
              onSubmitEditing={handleSearch}
            />

            <Pressable style={{ borderLeftWidth: 0, width: "10%", justifyContent: "center", height: "80%", color: "black", borderWidth: 1, backgroundColor: "white", borderColor: "#badada" }} onPress={() => { setSearchVal(""); setSearch(!isSearch) }}>

              <FontAwesomeIcon icon={faXmark} size={30} color="red" />

            </Pressable>
          </>
        }

        <Pressable style={styles.search_ico} onPress={handleSearch} >
          <Image
            style={styles.search_ico_img}
            // resizeMode="contain"
            source={require('./src/assets/search.png')}
          />
        </Pressable>
      </View>

      {/* SIde Bar SECTION  */}

      {showMenu
        && 
        <SideMenu setShowMenu={setShowMenu} showMenu={showMenu}/>}

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
        <TrendingCard data={data} CARD_HEIGHT={CARD_HEIGHT} CARD_WIDTH={CARD_WIDTH} />
      </View>

      <View style={styles.section}>
        <View style={styles.section_heading}>
          <Text style={styles.heading_text}>By Category</Text>
          <Image
            style={styles.swastik}
            source={require('./src/assets/swastik.png')}
          />
        </View>
        <View style={{ marginBottom: -90, marginLeft: 10 }}>
          <Image
            style={styles.heading_underline}
            source={require('./src/assets/underline.png')}
          />
        </View>
      </View>
      {/* <FlatList style={styles.puja_slider}> */}
      <CategoryCard data={catData} CARD_WIDTH={CARD_WIDTH} CARD_HEIGHT={CARD_HEIGHT} />
    </ScrollView>
  );
};



export default App;
