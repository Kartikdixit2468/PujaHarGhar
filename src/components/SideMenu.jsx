/import React, { useState, useEffect, useRef } from 'react';
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
