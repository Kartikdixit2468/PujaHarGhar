import React, { useState, useEffect} from 'react';
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
import {SERVER_IP} from '@env';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/MaterialIcons';
import FAIcon from 'react-native-vector-icons/FontAwesome5';
import { styles } from '../css/style';
import { CategoryCard, TrendingCard } from '../components/Card';
import SideMenu from '../components/SideMenu';

const Home = ({ navigation }) => {

  console.log("here yes")

  const [trendingPujas, setTrendingPujas] = useState([]);
  const [pujaCategories, setPujaCategories] = useState([]);
  const [userData, setUserData] = useState(null);
  const [loadingUser, setLoadingUser] = useState(true);

  const fetchUserData = async () => {
    try {
      setLoadingUser(true);
      const token = await AsyncStorage.getItem('authToken');
      const storedEmail = await AsyncStorage.getItem('userEmail');
      const storedPhone = await AsyncStorage.getItem('userPhone');

      console.log('Fetching user details - Email:', storedEmail, 'Phone:', storedPhone);

      if (!token || !(storedEmail || storedPhone)) {
        console.warn('Missing token or credentials');
        setLoadingUser(false);
        return;
      }

      const response = await fetch(`${SERVER_IP}/api/client/user/details/fetch`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: storedEmail,
          phone: storedPhone,
        }),
      });
      console.log('Fetch user details response status:', response.status);

      const data = await response.json();
      console.log('User details response:', data);

      if (data && data.data) {
        setUserData(data.data);
        console.log("User Data Set: ", data.data);
      } else if (data && data.success) {
        setUserData(data);
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
    } finally {
      setLoadingUser(false);
    }
  };

  useEffect(() => {
    console.log("Use Effect Called - Home Page");
    fetchUserData();
    const fetchTrendingPujas = async () => {
      try {
        const token = await AsyncStorage.getItem('authToken');
        console.log("token here - ", token)
        const response = await fetch(`${SERVER_IP}/api/client/trending/pujas`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });
        const data = await response.json();
        if (data.success){
        setTrendingPujas(data.data);
        }
      } catch (error) {
        console.error('Error fetching trending pujas:', error);
      }
    };
    
      const fetchPujaCategories = async () => {
        try {
          const token = await AsyncStorage.getItem('authToken');
          const response = await fetch(`${SERVER_IP}/api/client/pujas/Category`, {
            method: 'GET',
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          });
    
        const data = await response.json();
        if (data.success){
        setPujaCategories(data.data);
        }
      } catch (error) {
        console.error('Error fetching puja categories:', error);
      }
    };

  
    fetchTrendingPujas();
    fetchPujaCategories();
  }, []);
  


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
    }
  }

  // Format name to show maximum 2 words
  const formatUserName = (name) => {
    if (!name) return 'User';
    const words = name.trim().split(/\s+/);
    return words.slice(0, 2).join(' ');
  };

  // console.log("Trending Pujas: ", trendingPujas);
  console.log("userData: here -----------------------------------> ", userData);

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
            <Text style={local_styles.name}>{formatUserName(userData?.name)}</Text>
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
              navigation.navigate('Search', { page: 'Home' });
            }}
          />
          <Image
            source={userData?.photo && userData.photo.trim() !== '' 
              ? { uri: userData.photo }
              : require('../assets/images/profile_icon.png')}
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
          {userData && (
            <View style={[
              local_styles.alertBox,
              userData.profile_completed ? local_styles.alertBoxCompleted : local_styles.alertBoxIncomplete
            ]}>
              <View style={local_styles.alertRow}>
                <FAIcon 
                  name={userData.profile_completed ? "check-circle" : "exclamation-triangle"}
                  size={24} 
                  color={userData.profile_completed ? "#10b981" : "#fbb50a"}
                />
                <Text style={[
                  local_styles.alertTitle,
                  userData.profile_completed && local_styles.alertTitleCompleted
                ]}>
                  {userData.profile_completed ? 'Profile Completed' : 'Incomplete Profile'}
                </Text>
              </View>
              <Text style={[
                local_styles.alertDescription,
                userData.profile_completed && local_styles.alertDescriptionCompleted
              ]}>
                {userData.profile_completed 
                  ? 'Your profile is all set! You can now book pujas.'
                  : 'Your profile isn\'t completed. You will need to complete your profile before continuing to book for any event. '
                }
                {!userData.profile_completed && (
                  <Text
                    style={local_styles.alertLink}
                    onPress={() =>
                      navigation.navigate('Profile')
                    }
                  >
                    click here.
                  </Text>
                )}
              </Text>
            </View>
          )}

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
            <TrendingCard data={trendingPujas} />
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

            <CategoryCard type="scroll" data={pujaCategories} />
          </View>
        </>
      )}
    </ScrollView>
  );
};

const local_styles = StyleSheet.create({
  container: {
    padding: 10,
    paddingTop: 20,
    backgroundColor: '#F9FAFB',
    flexGrow: 1,
    // borderWidth: 2,
    // borderColor: 'red',
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    padding: 10,
    zIndex: 10,
    // borderWidth: 2,
    // borderColor: 'green',
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
    // borderWidth: 2,
    // borderColor: 'blue',
  },
  hello: {
    fontSize: 18,
    color: '#6B7280',
    fontWeight: '500',
  },
  name: {
    fontSize: 32,
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
    marginTop: 15,
    marginBottom: 15,
    padding: 12,
    marginHorizontal: 5,
    backgroundColor: '#fff6e7',
    borderRadius: 12,
    borderWidth: 0.5,
    borderColor: '#FCD34D',
  },
  alertBoxIncomplete: {
    backgroundColor: '#fff6e7',
    borderColor: '#FCD34D',
  },
  alertBoxCompleted: {
    backgroundColor: '#d1fae5',
    borderColor: '#6ee7b7',
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
    color: '#00000',
    textDecorationLine: 'underline',
  },
  alertTitleCompleted: {
    color: '#059669',
    textDecorationLine: 'none',
  },
  alertDescription: {
    padding: 1,
    color: '#78350F',
    fontSize: 14,
  },
  alertDescriptionCompleted: {
    color: '#059669',
  },
  alertLink: {
    textDecorationLine: 'underline',
    color: '#2563EB',
  },
});

export default Home;
