import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  Pressable,
  Linking,
  Dimensions,
  ScrollView,
  Alert,
  TouchableOpacity,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import FAIcon from 'react-native-vector-icons/FontAwesome5';
import { catData, data } from '../../data/data';
import { styles } from '../css/style';
import { CategoryCard, TrendingCard } from '../components/Card';
import SideMenu from '../components/SideMenu';

const Home = ({ navigation }) => {
  const [ShowMenu, setShowMenu] = useState(false);
  const [MenuMount, setMenuMount] = useState(false);

  const handleMenuClosed = () =>{
    setShowMenu(false)
  }

  const handleMenu = () =>{
    if (ShowMenu){
      setMenuMount(false)
    }
    else{
      setMenuMount(true)
      setShowMenu(true)
      console.log("Both are true now!")
    }
  }

  return (
    <ScrollView style={local_styles.container}>
      {/* Top Row */}
      <View style={local_styles.topRow}>
        <View style={local_styles.leftSection}>
          {/* Menu Icon in Box */}
          <TouchableOpacity
            style={local_styles.menuWrapper}
            onPress={handleMenu}
          >
            <View style={local_styles.barFull} />
            <View style={local_styles.barSmall} />
            <View style={local_styles.barFull} />
          </TouchableOpacity>

          {/* User Greeting */}
          <View style={local_styles.nameBlock}>
            <Text style={local_styles.hello}>Hello,</Text>
            <Text style={local_styles.name}>Kartik Dixit</Text>
          </View>
        </View>

        {/* Search & Avatar */}
        <View style={local_styles.rightIcons}>
          <Icon
            name="search"
            size={28}
            color="#4B5563"
            style={local_styles.icon}
            onPress={() => {
              navigation.navigate('Search', { page: 'HomeScreen' });
            }}
          />
          <Image
            source={require('../assets/images/profile_icon.png')} // Replace with dynamic URI if needed
            style={local_styles.avatar}
          />
        </View>
      </View>

      {ShowMenu && (
        <SideMenu
        visible={MenuMount}
        onCloseComplete={handleMenuClosed}
        // onSelect={(tab) => {
        //   console.log('Selected Tab:', tab);
        //   closeMenu(); // optional: close on tab selection
        // }} 
        />
      )}

      {!ShowMenu && (
        <>
          <View style={local_styles.alertBox}>
            <View style={local_styles.alertRow}>
              <FAIcon name="exclamation-triangle" size={24} color="#fbb50a" />
              <Text style={local_styles.alertTitle}>Incomplete Profile</Text>
            </View>
            <Text style={local_styles.alertDescription}>
              Your profile isn’t completed. You will need to complete your
              profile before continuing to book for any event.{' '}
              <Text
                style={local_styles.alertLink}
                onPress={() =>
                  Linking.openURL('https://kartikdixit.vercel.app')
                }
              >
                click here.
              </Text>
            </Text>
          </View>

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
            <TrendingCard data={data} />
          </View>

          <View style={[styles.section, styles.category_section]}>
            <View style={styles.section_heading}>
              <Text style={styles.heading_text}>Puja Category</Text>
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

            <CategoryCard type="scroll" data={catData} />
          </View>
        </>
      )}
    </ScrollView>
  );
};

const local_styles = StyleSheet.create({
  container: {
    padding: 10,
    paddingTop: 40,
    backgroundColor: '#F9FAFB',
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    padding: 10,
  },

  leftSection: {
    flexDirection: 'column',
    alignItems: 'flex-start',
  },

  // Menu Icon Box
  menuWrapper: {
    padding: 12,
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    width: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },
  barFull: {
    width: 26,
    height: 3,
    backgroundColor: '#111827',
    borderRadius: 2,
    marginVertical: 2,
  },
  barSmall: {
    width: 16,
    height: 3,
    backgroundColor: '#111827',
    borderRadius: 2,
    marginVertical: 2,
  },

  nameBlock: {
    marginTop: 8,
    marginLeft: 4,
  },
  hello: {
    fontSize: 18,
    color: '#6B7280',
    fontWeight: '500',
  },
  name: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#111827',
  },

  rightIcons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    marginRight: 12,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#E5E7EB',
  },

  alertBox: {
    marginTop: 20,
    padding: 15,
    marginHorizontal: 10,
    backgroundColor: '#fff6e7',
    borderRadius: 16,
    borderWidth: 0.5,
    borderColor: '#FCD34D',
  },
  alertRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  alertTitle: {
    fontWeight: 'bold',
    marginLeft: 8,
    fontSize: 24,
    // color: '#78350F',
    color: '#00000',
    textDecorationLine: 'underline',
  },
  alertDescription: {
    padding: 1,
    color: '#78350F',
    fontSize: 14,
  },
  alertLink: {
    textDecorationLine: 'underline',
    color: '#2563EB',
  },
});

export default Home;
