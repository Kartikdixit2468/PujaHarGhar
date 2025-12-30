import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Dimensions,
  useWindowDimensions,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAuth } from '../context/AuthContext';

const { width } = Dimensions.get('window');

const menuItems = [
  { label: 'Home', icon: 'home-outline', route: 'Home' }, // Ionicons
  { label: 'Profile', icon: 'person-outline', route: 'Profile' },
  { label: 'Categories', icon: 'grid-outline', route: 'Categories' },
  { label: 'Bookings', icon: 'calendar-outline', route: 'Bookings' },
  { label: 'My Tickets', icon: 'ticket-outline', route: 'Tickets' },
  { label: 'Support', icon: 'help-circle-outline', route: 'Support' },
];

const SideMenu = ({ visible, onCloseComplete, onSelect }) => {
  const { setIsLoggedIn } = useAuth();
  const [activeTab, setActiveTab] = useState('Home');
  const { width: screenWidth } = useWindowDimensions();
  const slideAnim = useRef(new Animated.Value(-screenWidth * 0.75)).current;
  const navigation = useNavigation();

  useEffect(() => {
    if (visible) {
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(slideAnim, {
        toValue: -screenWidth * 0.75,
        duration: 300,
        useNativeDriver: true,
      }).start(() => {
        onCloseComplete?.();
      });
    }
  }, [visible, screenWidth]);

  const handlePress = (item) => {
    setActiveTab(item.label);
    onSelect?.(); // Close menu
    setTimeout(() => {
      navigation.navigate(item.route);
    }, 100);
  };

  const logout = async () => {
    console.log('Logging out...');
    await AsyncStorage.removeItem('authToken');
    await AsyncStorage.removeItem('userEmail');
    await AsyncStorage.removeItem('userPhone');
    setIsLoggedIn(false);
    console.log('Logged out successfully!');
    onSelect?.(); // Close menu
    setTimeout(() => {
      navigation.navigate('WelcomeScreen');
    }, 100);
  };

  return (
    <Animated.View
      style={[
        styles.container,
        {
          transform: [{ translateX: slideAnim }],
          width: screenWidth * 0.75,
        },
      ]}
    >
      {menuItems.map((item) => {
        const isActive = item.label === activeTab;

        return (
          <TouchableOpacity
            key={item.label}
            style={[styles.menuItem, isActive && styles.activeMenuItem]}
            onPress={() => handlePress(item)}
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
        onPress={logout}
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
    height: '70%',
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
