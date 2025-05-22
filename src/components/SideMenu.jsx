import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Dimensions,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { faIls } from '@fortawesome/free-solid-svg-icons';

const { width } = Dimensions.get('window');

const menuItems = [
  { label: 'Home', icon: 'home-outline' }, // Ionicons
  { label: 'Profile', icon: 'person-outline' },
  { label: 'Categories', icon: 'grid-outline' },
  { label: 'Bookings', icon: 'calendar-outline' },
  { label: 'History', icon: 'time-outline' },
  { label: 'Support', icon: 'help-circle-outline' },
];

const SideMenu = ({visible, onCloseComplete, onSelect }) => {
  const [activeTab, setActiveTab] = useState('Home');
  const slideAnim = useRef(new Animated.Value(-width)).current;
  const navigation = useNavigation(); // 👈 Fix here


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

    // if (label == 'Home'){
    //   visible = false;
    // }

    setActiveTab(label);
    navigation.navigate(label)

  };

  const logout = async () => {
    await AsyncStorage.removeItem('authToken');
    console.log('it worked!')
    navigation.navigate('WelcomeScreen')
  }

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
            <Ionicons
              name={item.icon}
              size={30}
              color={isActive ? '#fff' : '#888'}
            />

            <Text style={[styles.menuText, isActive && styles.activeMenuText]}>
              {item.label}
            </Text>
          </TouchableOpacity>
        );
      })}

      <TouchableOpacity
        key="logout"
        style={styles.logout}
        onPress={async () => {await logout()}}
      >
        <Ionicons name="chevron-back-circle-outline" size={30} color="#ffff" />

        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>
    </Animated.View>
    // </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 10,
    width: '100%',
    backgroundColor: '#F9FAFB',
    paddingVertical: 20,
    paddingHorizontal: 10,
    borderTopRightRadius: 12,
    borderBottomRightRadius: 12,
    borderTopWidth: 1,
    borderColor: '#bdc1c6',
    // elevation: 5,
    height: '100%',
    // alignItems: 'flex-end',
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
    color: '#888',
    fontWeight: '600',
  },
  logout: {
    backgroundColor: '#ff3131', // active background color
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 8,
    borderRadius: 32,
    width: '60%',
    alignSelf: 'center',
    marginBottom: 0,
    bottom: "0",
    top: "20%"

    // position: 'relative',
  },
  logoutText: {
    marginLeft: 5,
    fontSize: 18,
    color: '#ffff',
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
