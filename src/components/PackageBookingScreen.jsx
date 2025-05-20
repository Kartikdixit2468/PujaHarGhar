import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';

const packages = [
  {
    name: 'Basic Package',
    features: [
      'Includes 10 essential puja items',
      'Suitable for home puja',
      'Digital darshan access',
    ],
  },
  {
    name: 'Standard Package',
    features: [
      'Includes 15+ puja items',
      'Experienced priest guided puja',
      'Video recording shared',
    ],
  },
  {
    name: 'Premium Package',
    features: [
      'Complete puja kit with all items',
      'Personalized puja with priest',
      'Live video call & HD recording',
    ],
  },
];

const PackageBookingScreen = ({ navigation }) => {
  const [selected, setSelected] = useState(null);

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.heading}>Choose Your Package</Text>
      {packages.map((pkg, index) => (
        <TouchableOpacity
          key={index}
          onPress={() => setSelected(index)}
          style={[
            styles.card,
            selected === index && styles.selectedCard
          ]}
        >
          <Text style={styles.packageName}>{pkg.name}</Text>
          {pkg.features.map((feature, i) => (
            <Text key={i} style={styles.feature}>• {feature}</Text>
          ))}
        </TouchableOpacity>
      ))}

      <TouchableOpacity
        style={styles.button}
        disabled={selected === null}
        onPress={() => {
          if (selected !== null) {
            const selectedPackage = packages[selected];
            // You can pass this to next screen or handle accordingly
            navigation.navigate('BookingDetails', { selectedPackage });
          }
        }}
      >
        <Text style={styles.buttonText}>Continue</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
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
});

export default PackageBookingScreen;
