import React from 'react';
import {
  Image,
  View,
  Text,
  Pressable,
  Alert,
  FlatList,
  TouchableOpacity,
} from 'react-native';

import { styles } from '../css/style';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';

import {
  faArrowAltCircleUp,
  faArrowUp,
  faGreaterThan,
} from '@fortawesome/free-solid-svg-icons';

const SideMenu = ({
  showMenu,
  setShowMenu,
  MobileWidth,
  MobileHeight,
  navigation,
}) => {
  return (
    <View
      style={{ ...styles.sideBar, display: 'flex', flexDirection: 'column' }}
    >
      <View style={{ ...styles.header, borderColor: 'grey', minHeight: '8%' }}>
        <Pressable
          style={{ ...styles.menu_ico, marginTop: 6 }}
          onPress={() => {
            setShowMenu(!showMenu);
          }}
        >
          <View style={[styles.menu_ico_bar, styles.bar11]}></View>
          <View style={[styles.menu_ico_bar, styles.bar11]}></View>
          <View style={[styles.menu_ico_bar, styles.bar11]}></View>
        </Pressable>

        <View style={styles.logo_container}>
          <Image
            style={styles.logo}
            resizeMode="contain"
            source={require('../assets/Logo.png')}
          />
        </View>

        <View style={styles.search_ico}>
          <Image
            style={styles.search_ico_img}
            // resizeMode="contain"
            source={require('../assets/search.png')}
          />
        </View>
      </View>
      <Image
        style={{
          ...styles.heading_underline,
          minWidth: '80%',
          marginHorizontal: 'auto',
        }}
        source={require('../assets/underline.png')}
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
        }}
        onPress={() => {
          navigation.navigate('SignUp');
        }}
      >
        <Text style={{ fontSize: MobileWidth * 0.048, fontWeight: 'bold' }}>
          Signup/Login
        </Text>
      </Pressable>

      <View>
        <TouchableOpacity style={{ ...styles.sideBarServices }}>
          <FontAwesomeIcon
            icon={faGreaterThan}
            size={MobileWidth * 0.06}
            color="black"
            style={{ transform: [{ rotate: '-90deg' }] }}
          />
          <Pressable
            onPress={()=> {navigation.navigate('Profile')}}
            >
            <Text style={{ fontSize: MobileWidth * 0.05 }}>Profile</Text>
          </Pressable>
        </TouchableOpacity>
        <TouchableOpacity style={{ ...styles.sideBarServices }}>
          <FontAwesomeIcon
            icon={faGreaterThan}
            size={MobileWidth * 0.06}
            color="black"
            style={{ transform: [{ rotate: '-90deg' }] }}
          />
          <Pressable 
          onPress={()=> {navigation.navigate('Bookings')}}
          > 
            <Text style={{ fontSize: MobileWidth * 0.05 }}>My Bookings</Text>
          </Pressable>
        </TouchableOpacity>{' '}
        <TouchableOpacity style={{ ...styles.sideBarServices }}>
          <FontAwesomeIcon
            icon={faGreaterThan}
            size={MobileWidth * 0.06}
            color="black" 
            style={{ transform: [{ rotate: '-90deg' }] }}
          />
          <Pressable 
          onPress={()=> {navigation.navigate('Categories')}}
          >
            <Text style={{ fontSize: MobileWidth * 0.05 }}>Categories</Text>
          </Pressable>
        </TouchableOpacity>{' '}
        <TouchableOpacity style={{ ...styles.sideBarServices }}>
          <FontAwesomeIcon
            icon={faGreaterThan}
            size={MobileWidth * 0.06}
            color="black"
            style={{ transform: [{ rotate: '-90deg' }] }}
          />
          <Pressable
          onPress={()=> {navigation.navigate('Support')}}
          >
            <Text style={{ fontSize: MobileWidth * 0.05 }}>Support</Text>
          </Pressable>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default SideMenu;
