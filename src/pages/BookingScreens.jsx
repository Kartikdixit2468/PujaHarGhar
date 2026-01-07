import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  Platform,
  FlatList,
  ScrollView,
  Dimensions,
} from 'react-native';
import Config from 'react-native-config';

const SERVER_IP = Config.SERVER_IP;import AsyncStorage from '@react-native-async-storage/async-storage';
import DateTimePicker from '@react-native-community/datetimepicker';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useProfileGuard } from '../components/useProfileGuard';

const width = Dimensions.get('window').width;
// console.log(SERVER_IP)
export const PackageSelectionScreen = ({ route, navigation }) => {

  const guard = useProfileGuard();
  if (!guard()) return;
  
  const { id } = route.params;
  const [packages, setPackages] = useState([]);
  console.log("Everything is going great till here")
  
  useEffect(() => {
    console.log("Everything is going great till here")
    const fetchPackages = async () => {
      try {
        const token = await AsyncStorage.getItem('authToken');
        const response = await fetch(`${SERVER_IP}/api/client/puja/packages/${id}`, {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });
        
        const data = await response.json();
        if (data.success) {
          console.log("Everything is going great till !")
          console.log("Success fetching the package data!")
          setPackages(data.data);
        }
      } catch (error) {
        console.error('Error fetching puja Packages:', error);
        console.log("Failure fetching the package data!")
      }
    };

    fetchPackages();
  }, []);


  const [selected, setSelected] = useState(null);

  const handleContinue = () => {
    console.log('Selected package ID:', selected);
    if (selected !== null) {
      navigation.navigate('DateSelectionScreen', {
        package_id: selected,
      });
    }
  };

  return (
    <View style={stylesPackageScreen.wrapper}>
      {/* Custom Header */}
      <View style={stylesPackageScreen.header}>
        <TouchableOpacity 
          onPress={() => navigation.goBack()}
          style={stylesPackageScreen.headerButton}
        >
          <Ionicons name="chevron-back" size={26} color="#000" />
        </TouchableOpacity>
        <Text style={stylesPackageScreen.headerTitle}>Select Package</Text>
        <View style={stylesPackageScreen.headerButton} />
      </View>

      <ScrollView 
        style={stylesPackageScreen.container}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={stylesPackageScreen.contentContainer}
      >
        <Text style={stylesPackageScreen.heading}>Choose Your Package</Text>
        {packages.map((pkg) => (
          <TouchableOpacity
            key={pkg.id}
            onPress={() => setSelected(pkg.id)}
            style={[
              stylesPackageScreen.card,
              selected === pkg.id && stylesPackageScreen.selectedCard,
            ]}
          >
            <View style={stylesPackageScreen.cardHeader}>
              <View style={stylesPackageScreen.cardTitleSection}>
                <Text style={stylesPackageScreen.packageName}>{pkg.name}</Text>
              </View>
              <View style={stylesPackageScreen.priceTag}>
                <Text style={stylesPackageScreen.packagePrice}>₹{pkg.price}</Text>
              </View>
            </View>

            {pkg.features.map((feature, i) => (
              <View key={i} style={stylesPackageScreen.featureRow}>
                <View style={stylesPackageScreen.featureDot} />
                <Text style={stylesPackageScreen.feature}>{feature}</Text>
              </View>
            ))}

            {selected === pkg.id && (
              <View style={stylesPackageScreen.selectedBadge}>
                <Ionicons name="checkmark-circle" size={20} color="#ce8123" />
                <Text style={stylesPackageScreen.selectedText}>Selected</Text>
              </View>
            )}
          </TouchableOpacity>
        ))}
      </ScrollView>

      <View style={stylesPackageScreen.footerSection}>
        <TouchableOpacity
          style={[
            stylesPackageScreen.button,
            selected === null && stylesPackageScreen.buttonDisabled,
          ]}
          disabled={selected === null}
          onPress={handleContinue}
          activeOpacity={0.8}
        >
          <Text style={stylesPackageScreen.buttonText}>Continue</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};
// };

const stylesPackageScreen = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  // Header Styles
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 2,
    borderBottomColor: '#ce8123',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 3,
  },
  headerButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#000',
    flex: 1,
    textAlign: 'center',
  },
  // Container
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  contentContainer: {
    padding: 16,
    paddingBottom: 100,
  },
  heading: {
    fontSize: 22,
    fontWeight: '800',
    marginBottom: 20,
    color: '#1a1a1a',
  },
  // Card Styles
  card: {
    borderWidth: 1.5,
    borderColor: '#E8E3DD',
    borderRadius: 16,
    padding: 16,
    marginBottom: 14,
    backgroundColor: '#FAFAF8',
  },
  selectedCard: {
    borderColor: '#ce8123',
    backgroundColor: '#fff8f2',
    borderWidth: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 14,
  },
  cardTitleSection: {
    flex: 1,
  },
  packageName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1a1a1a',
    marginBottom: 4,
  },
  priceTag: {
    backgroundColor: '#ce8123',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  packagePrice: {
    fontSize: 16,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  featureRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 10,
  },
  featureDot: {
    width: 5,
    height: 5,
    borderRadius: 2.5,
    backgroundColor: '#ce8123',
    marginTop: 7,
    marginRight: 10,
  },
  feature: {
    fontSize: 13,
    color: '#555',
    flex: 1,
    lineHeight: 18,
    fontWeight: '400',
  },
  selectedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#E8E3DD',
    justifyContent: 'center',
    gap: 6,
  },
  selectedText: {
    color: '#ce8123',
    fontWeight: '700',
    fontSize: 14,
  },
  // Button Styles
  footerSection: {
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E8E3DD',
  },
  button: {
    backgroundColor: '#ce8123',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#ce8123',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 5,
  },
  buttonDisabled: {
    backgroundColor: '#D4C4B4',
    opacity: 0.6,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '800',
    color: '#FFFFFF',
  },
});

export const DateSelectionScreen = ({ route, navigation }) => {
  const guard = useProfileGuard();
  if (!guard()) return;

  const { package_id } = route.params;

  const [dateOption, setDateOption] = useState('specific'); // "help" or "specific"
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);

  const handleDateChange = (event, date) => {
    if (date) {
      setSelectedDate(date);
    }
    setShowDatePicker(false);
  };

  const formatDate = (date) => {
    return date.toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <View style={stylesDateSelection.wrapper}>
      {/* Custom Header */}
      <View style={stylesDateSelection.header}>
        <TouchableOpacity 
          onPress={() => navigation.goBack()}
          style={stylesDateSelection.headerButton}
        >
          <Ionicons name="chevron-back" size={26} color="#000" />
        </TouchableOpacity>
        <Text style={stylesDateSelection.headerTitle}>Select Date</Text>
        <View style={stylesDateSelection.headerButton} />
      </View>

      <ScrollView 
        contentContainerStyle={stylesDateSelection.scrollContent}
        style={stylesDateSelection.container}
        showsVerticalScrollIndicator={false}
      >
        <View style={stylesDateSelection.dropdownContainer}>
          <Text style={stylesDateSelection.heading}>
            📅 Select Date Preference
          </Text>

          <View style={stylesDateSelection.optionRow}>
            <TouchableOpacity
              style={[
                stylesDateSelection.optionButton,
                dateOption === 'help' && stylesDateSelection.optionSelected,
              ]}
              onPress={() => setDateOption('help')}
            >
              <Text style={stylesDateSelection.optionText}>
                Let us help you
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                stylesDateSelection.optionButton,
                dateOption === 'specific' &&
                  stylesDateSelection.optionSelected,
              ]}
              onPress={() => setDateOption('specific')}
            >
              <Text style={stylesDateSelection.optionText}>
                Choose a date
              </Text>
            </TouchableOpacity>
          </View>

          {dateOption === 'specific' && (
            <TouchableOpacity
              onPress={() => setShowDatePicker(true)}
              style={stylesDateSelection.datePickerButton}
            >
              <Text style={stylesDateSelection.datePickerText}>
                {`Selected: ${formatDate(selectedDate)}`}
              </Text>
            </TouchableOpacity>
          )}

          {showDatePicker && (
            <DateTimePicker
              value={selectedDate}
              mode="date"
              display={Platform.OS === 'ios' ? 'spinner' : 'default'}
              onChange={handleDateChange}
              minimumDate={new Date()}
            />
          )}
        </View>
      </ScrollView>

      <View style={stylesDateSelection.footer}>
        <TouchableOpacity
          style={stylesDateSelection.button}
          onPress={() => {
            console.log(selectedDate)
            console.log(formatDate(selectedDate))
            navigation.navigate('Checkout', {
              dateOption,
              selectedDate: dateOption === 'specific' ? selectedDate : null,
              package_id: package_id,
            });
          }}
        >
          <Text style={stylesDateSelection.buttonText}>Proceed to Checkout</Text>
        </TouchableOpacity>

        <Text style={stylesDateSelection.note}>
          💳 Note: Pay a partial amount now, and the rest as we proceed further.
        </Text>
      </View>
    </View>
  );
};

const stylesDateSelection = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  // Header Styles
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 2,
    borderBottomColor: '#ce8123',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 3,
  },
  headerButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#000',
    flex: 1,
    textAlign: 'center',
  },
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  heading: {
    fontSize: 18,
    fontWeight: '700',
    marginVertical: 16,
    color: '#1a1a1a',
  },
  dropdownContainer: {
    margin: 16,
    marginBottom: 80,
    paddingBottom: 20,
  },
  optionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10,
    marginVertical: 12,
  },
  optionButton: {
    flex: 1,
    borderWidth: 1.5,
    borderColor: '#E8E3DD',
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
    backgroundColor: '#FAFAF8',
  },
  optionSelected: {
    borderColor: '#ce8123',
    backgroundColor: '#fff8f2',
    borderWidth: 2,
  },
  optionText: {
    color: '#333',
    fontSize: 14,
    fontWeight: '600',
  },
  datePickerButton: {
    padding: 14,
    borderWidth: 1.5,
    borderColor: '#E8E3DD',
    borderRadius: 12,
    marginTop: 12,
    backgroundColor: '#FAFAF8',
  },
  datePickerText: {
    fontSize: 14,
    color: '#1a1a1a',
    fontWeight: '500',
  },
  button: {
    backgroundColor: '#ce8123',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#ce8123',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 5,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  note: {
    marginTop: 12,
    color: '#777',
    fontSize: 13,
    textAlign: 'center',
    fontWeight: '500',
  },
  scrollContent: {
    paddingBottom: 100,
  },
  footer: {
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E8E3DD',
  },
});
