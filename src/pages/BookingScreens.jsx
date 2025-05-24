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
} from 'react-native';
import { SERVER_IP } from '@env';
import AsyncStorage from '@react-native-async-storage/async-storage';
import DateTimePicker from '@react-native-community/datetimepicker';

export const PackageSelectionScreen = ({ route, navigation }) => {
  const { id } = route.params;

  const [packages, setPackages] = useState([]);

  useEffect(() => {
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
          setPackages(data.data);
        }
      } catch (error) {
        console.error('Error fetching puja Packages:', error);
      }
    };

    fetchPackages();
  }, []);


  const [selected, setSelected] = useState(null);

  return (
    <ScrollView style={stylesPackageScreen.container}>
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
            <Text style={stylesPackageScreen.packageName}>{pkg.name}</Text>
            <Text style={stylesPackageScreen.packagePrice}>₹{pkg.price}</Text>
          </View>

          {/* 👈 Added this line */}
          {pkg.features.map((feature, i) => (
            <Text key={i} style={stylesPackageScreen.feature}>
              • {feature}
            </Text>
          ))}
        </TouchableOpacity>
      ))}

      <TouchableOpacity
        style={stylesPackageScreen.button}
        disabled={selected === null}
        onPress={() => {
          if (selected !== null) {
            // You can pass this to next screen or handle accordingly
            navigation.navigate('PreistSelectionScreen', {
              package_id: selected,
            });
          }
        }}
      >
        <Text style={stylesPackageScreen.buttonText}>Continue</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const stylesPackageScreen = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#fff',
  },
  heading: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#333',
  },
  card: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    backgroundColor: '#fafafa',
  },
  selectedCard: {
    borderColor: '#FFD700',
    backgroundColor: '#fffbe6',
  },
  packageName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#222',
  },
  feature: {
    fontSize: 14,
    color: '#555',
    marginLeft: 8,
  },
  button: {
    backgroundColor: '#FFD700',
    paddingVertical: 14,
    borderRadius: 8,
    marginTop: 24,
    alignItems: 'center',
    opacity: 1,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  
  packagePrice: {
    fontSize: 17,
    fontWeight: '600',
    color: '#333',
  },
});

export const PreistSelectionScreen = ({ route, navigation }) => {


  const { package_id } = route.params;

  const [priestList, setPriestList] = useState([]);

  useEffect(() => {
    const fetchPriestList = async () => {
      try {
        const token = await AsyncStorage.getItem('authToken');
        const response = await fetch(`${SERVER_IP}/api/client/fetch/priest/`, {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        const data = await response.json();
        if (data.success) {
          setPriestList(data.data);
        }
      } catch (error) {
        console.error('Error fetching puja Packages:', error);
      }
    };

    fetchPriestList();
  }, []);

  const [selectedPriest, setSelectedPriest] = useState(null);
  const [dateOption, setDateOption] = useState('specific'); // "help" or "specific"
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [isOpen, setIsOpen] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);

  const handleSelect = (priest) => {
    setSelectedPriest(priest);
    setIsOpen(false);
  };

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
    <View style={stylesPreistSelection.container}>
      <ScrollView contentContainerStyle={stylesPreistSelection.scrollContent}>
        <View style={stylesPreistSelection.dropdownContainer}>
          <Text style={stylesPreistSelection.label}>Choose Priest</Text>

          <TouchableOpacity
            onPress={() => setIsOpen(!isOpen)}
            style={stylesPreistSelection.dropdown}
          >
            {selectedPriest ? (
              <View style={stylesPreistSelection.item}>
                <Image
                  source={{
                    uri: `http://192.168.31.166:3000/uploads/priest/${selectedPriest.img}`,
                  }}
                  style={stylesPreistSelection.image}
                />
                <View>
                  <Text style={stylesPreistSelection.name}>
                    Shri {selectedPriest.name}
                  </Text>
                  <Text style={stylesPreistSelection.experience}>
                    {selectedPriest.exp} years of experience
                  </Text>
                </View>
              </View>
            ) : (
              <Text style={stylesPreistSelection.placeholder}>
                Select a priest
              </Text>
            )}
          </TouchableOpacity>

          {isOpen && (
            <View style={stylesPreistSelection.dropdownList}>
              {priestList.map((priest) => (
                <TouchableOpacity
                  key={priest.id}
                  style={stylesPreistSelection.item}
                  onPress={() => handleSelect(priest)}
                >
                  <Image
                    source={{
                      uri: `http://192.168.31.166:3000/uploads/priest/${priest.img}`,
                    }}
                    style={stylesPreistSelection.image}
                  />
                  <View>
                    <Text style={stylesPreistSelection.name}>
                      {priest.gender === 'female' ? 'Shrimat' : 'Shri'}{' '}
                      {priest.name}
                    </Text>
                    <Text style={stylesPreistSelection.experience}>
                      {priest.exp} years of experience
                    </Text>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          )}

          <Text style={stylesPreistSelection.heading}>
            Select Date Preference
          </Text>

          <View style={stylesPreistSelection.optionRow}>
            <TouchableOpacity
              style={[
                stylesPreistSelection.optionButton,
                dateOption === 'help' && stylesPreistSelection.optionSelected,
              ]}
              onPress={() => setDateOption('help')}
            >
              <Text style={stylesPreistSelection.optionText}>
                Let us help you
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                stylesPreistSelection.optionButton,
                dateOption === 'specific' &&
                  stylesPreistSelection.optionSelected,
              ]}
              onPress={() => setDateOption('specific')}
            >
              <Text style={stylesPreistSelection.optionText}>
                Choose a specific date
              </Text>
            </TouchableOpacity>
          </View>

          {dateOption === 'specific' && (
            <TouchableOpacity
              onPress={() => setShowDatePicker(true)}
              style={stylesPreistSelection.datePickerButton}
            >
              <Text style={stylesPreistSelection.datePickerText}>
                {`Selected Date: ${formatDate(selectedDate)}`}
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

      <View style={stylesPreistSelection.footer}>
        <TouchableOpacity
          style={stylesPreistSelection.button}
          onPress={() => {
            navigation.navigate('Checkout', {
              priest_id: selectedPriest.id,
              dateOption,
              selectedDate: dateOption === 'specific' ? selectedDate : null,
              package_id: package_id,
            });
          }}
        >
          <Text style={stylesPreistSelection.buttonText}>Checkout</Text>
        </TouchableOpacity>

        <Text style={stylesPreistSelection.note}>
          Note: You’ll be asked to pay partially now, and the rest as we proceed
          further.
        </Text>
      </View>
    </View>
  );
};

const stylesPreistSelection = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    padding: 8,
    flex: 1,
    maxHeight: '100%',
  },
  heading: {
    fontSize: 18,
    fontWeight: 'bold',
    marginVertical: 12,
    color: '#333',
  },
  dropdownContainer: {
    margin: 15,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    marginBottom: 20,
    padding: 8,
    height: '95%',
  },
  optionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10,
    marginVertical: 10,
  },
  optionButton: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ccc',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    backgroundColor: '#f9f9f9',
  },
  optionSelected: {
    borderColor: '#FFD700',
    backgroundColor: '#fffbe6',
  },
  optionText: {
    color: '#333',
    fontSize: 14,
    fontWeight: '500',
  },
  datePickerButton: {
    padding: 12,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    marginTop: 10,
  },
  datePickerText: {
    fontSize: 14,
    color: '#222',
  },
  button: {
    backgroundColor: '#FFD700',
    paddingVertical: 14,
    borderRadius: 8,
    marginTop: 30,
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
  },
  note: {
    marginTop: 12,
    color: '#777',
    fontSize: 13,
    textAlign: 'center',
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
    padding: 5,
  },
  dropdown: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    padding: 10,
    backgroundColor: '#fff',
  },
  placeholder: {
    color: '#aaa',
    fontSize: 14,
    padding: 5,
  },
  dropdownList: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    backgroundColor: '#fff',
    marginTop: 5,
    elevation: 2,
    paddingVertical: 5,
  },
  item: {
    flexDirection: 'row',
    padding: 10,
    alignItems: 'center',
    borderBottomColor: '#eee',
    borderBottomWidth: 1,
  },
  image: {
    width: 42,
    height: 42,
    borderRadius: 21,
    marginRight: 12,
  },
  name: {
    fontSize: 15,
    fontWeight: '500',
  },
  experience: {
    fontSize: 12,
    color: '#777',
  },
  scrollContent: {
    paddingBottom: 100, // make space for footer
  },
  footer: {
    padding: 16,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderColor: '#eee',
  },
});
