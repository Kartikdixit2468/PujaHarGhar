// import React from 'react';
// import {
//   Image,
//   View,
//   Text,
//   Pressable,
//   Alert,
//   FlatList,
//   TouchableOpacity,
// } from 'react-native';
// import { styles } from '../css/style';
// import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import {
//   faArrowAltCircleUp,
//   faArrowUp,
//   faGreaterThan,
// } from '@fortawesome/free-solid-svg-icons';

// const SideMenu = ({
//   showMenu,
//   setShowMenu,
//   MobileWidth,
//   MobileHeight,
//   navigation,
// }) => {
//   return (
//     <View
//       style={{ ...styles.sideBar, display: 'flex', flexDirection: 'column' }}
//     >
//       <View style={{ ...styles.header, borderColor: 'grey', minHeight: '8%' }}>
//         <Pressable
//           style={{ ...styles.menu_ico, marginTop: 6 }}
//           onPress={() => {
//             setShowMenu(!showMenu);
//           }}
//         >
//           <View style={[styles.menu_ico_bar, styles.bar11]}></View>
//           <View style={[styles.menu_ico_bar, styles.bar11]}></View>
//           <View style={[styles.menu_ico_bar, styles.bar11]}></View>
//         </Pressable>

//         <View style={styles.logo_container}>
//           <Image
//             style={styles.logo}
//             resizeMode="contain"
//             source={require('../assets/Logo.png')}
//           />
//         </View>

//         <View style={styles.search_ico}>
//           <Image
//             style={styles.search_ico_img}
//             // resizeMode="contain"
//             source={require('../assets/search.png')}
//           />
//         </View>
//       </View>
//       <Image
//         style={{
//           ...styles.heading_underline,
//           minWidth: '80%',
//           marginHorizontal: 'auto',
//         }}
//         source={require('../assets/underline.png')}
//       />

//       <Pressable
//         style={{
//           padding: 22,
//           marginLeft: -6,
//           marginTop: 15,
//           backgroundColor: '#ffbc00',
//           width: '60%',
//           borderEndEndRadius: 50,
//           borderTopEndRadius: 50,
//         }}
//         onPress={() => {
//           navigation.navigate('Profile');
//         }}
//       >
//         <Text style={{ fontSize: MobileWidth * 0.048, fontWeight: 'bold' }}>
//           Profile
//         </Text>
//       </Pressable>

//       <View>
//         <TouchableOpacity style={{ ...styles.sideBarServices }}>
//           <Icon name="chevron-down" size={MobileWidth * 0.06} color="black" />
//           <Pressable
//             onPress={() => {
//               navigation.navigate('Bookings');
//             }}
//           >
//             <Text style={{ fontSize: MobileWidth * 0.05 }}>My Bookings</Text>
//           </Pressable>
//         </TouchableOpacity>

//         <TouchableOpacity style={{ ...styles.sideBarServices }}>
//           <Icon name="chevron-down" size={MobileWidth * 0.06} color="black" />
//           <Pressable
//             onPress={() => {
//               navigation.navigate('Categories');
//             }}
//           >
//             <Text style={{ fontSize: MobileWidth * 0.05 }}>Categories</Text>
//           </Pressable>
//         </TouchableOpacity>

//         <TouchableOpacity style={{ ...styles.sideBarServices }}>
//           <Icon name="chevron-down" size={MobileWidth * 0.06} color="black" />
//           <Pressable
//             onPress={() => {
//               navigation.navigate('Support');
//             }}
//           >
//             <Text style={{ fontSize: MobileWidth * 0.05 }}>Support</Text>
//           </Pressable>
//         </TouchableOpacity>

//         <TouchableOpacity style={{ ...styles.sideBarServices }}>
//           <Icon name="chevron-down" size={MobileWidth * 0.06} color="black" />
//           <Pressable
//             onPress={async () => {
//               // Add a popup for confirmation  then this
//               await AsyncStorage.removeItem('authToken');
//               navigation.navigate('SignUp');
//             }}
//           >
//             <Text style={{ fontSize: MobileWidth * 0.05 }}>Logout</Text>
//           </Pressable>
//         </TouchableOpacity>
//       </View>
//     </View>
//   );
// };

// export default SideMenu;

import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated, Dimensions } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

const { width } = Dimensions.get('window');


const menuItems = [
  { label: 'Home', icon: 'home-outline' },  // Ionicons
  { label: 'Profile', icon: 'person-outline' },
  { label: 'Booking', icon: 'calendar-outline' },
  { label: 'History', icon: 'time-outline' },
  { label: 'Support', icon: 'help-circle-outline' },
];


const SideMenu = ({ visible, onCloseComplete, onSelect }) => {
  const [activeTab, setActiveTab] = useState('Home');
  const slideAnim = useRef(new Animated.Value(-width)).current;

  useEffect(() => {
    if (visible) {
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(slideAnim, {
        toValue: -width,
        duration: 300,
        useNativeDriver: true,
      }).start(() => {
        onCloseComplete?.(); // Notify parent to unmount
      });
    }
  }, [visible]);

  const handlePress = (label) => {
    setActiveTab(label);
    onSelect?.(label);
  };



  return (
    <Animated.View
      style={[
        styles.container,
        {
          transform: [{ translateX: slideAnim }],
        },
      ]}
    >      
      {menuItems.map((item) => {
        const isActive = item.label === activeTab;

        return (
          <TouchableOpacity
            key={item.label}
            style={[styles.menuItem, isActive && styles.activeMenuItem]}
            onPress={() => handlePress(item.label)}
            activeOpacity={0.7}
          >
            <Ionicons name={item.icon} size={30}  color={isActive ? '#fff' : '#bdc1c6'} />

            <Text style={[styles.menuText, isActive && styles.activeMenuText]}>
              {item.label}
            </Text>
            {isActive && <View style={styles.underline} />}
          </TouchableOpacity>
        );
      })}

    </Animated.View>
    // </View>

  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 10,
    width: "100%",
    backgroundColor: '#F9FAFB',
    paddingVertical: 20,
    paddingHorizontal: 10,
    borderTopRightRadius: 12,
    borderBottomRightRadius: 12,
    borderTopWidth: 1,
    borderColor: "#bdc1c6",
    // elevation: 5,
    flex: 1,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderRadius: 8,
    marginBottom: 18,
    position: 'relative',
  },
  activeMenuItem: {
    backgroundColor: '#ffbc00', // active background color
  },
  menuText: {
    marginLeft: 15,
    fontSize: 18,
    color: '#bdc1c6',
    fontWeight: '600',
  },
  activeMenuText: {
    color: '#fff',
  },
  underline: {
    position: 'absolute',
    bottom: 0,
    left: 10,
    right: 10,
    height: 3,
    backgroundColor: '#fff',
    borderRadius: 2,
  },
});

export default SideMenu;
