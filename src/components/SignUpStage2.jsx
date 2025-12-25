import React from 'react';
import {
  View,
  Text,
  Image,
  TextInput,
  TouchableOpacity,
  Modal,
  StyleSheet,
  Platform,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Checkbox } from 'react-native-paper';
import { styles } from '../css/style';

const GenderPickerModal = ({ visible, selectedGender, onSelect, onClose }) => {
  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles_stage2.genderModalOverlay}>
        <View style={styles_stage2.genderModalContent}>
          <Text style={{ fontSize: 18, marginBottom: 10 }}>
            Select Gender
          </Text>

          {['Male', 'Female', 'Other'].map((item) => (
            <TouchableOpacity
              key={item}
              onPress={() => onSelect(item)}
              style={{ paddingVertical: 10 }}
            >
              <Text style={{ fontSize: 16 }}>{item}</Text>
            </TouchableOpacity>
          ))}

          <TouchableOpacity
            onPress={onClose}
            style={{ marginTop: 20, alignItems: 'center' }}
          >
            <Text style={{ color: 'red' }}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const SignUpStage2 = ({
  firstName,
  setFirstName,
  lastName,
  setLastName,
  birth,
  setBirth,
  gender,
  setGender,
  showGenderPicker,
  setShowGenderPicker,
  showPicker,
  setShowPicker,
  isChecked,
  setIsChecked,
  onComplete,
  onBack,
  signUpStage,
}) => {
  const handleDateChange = (event, selectedDate) => {
    setShowPicker(false);
    if (selectedDate) {
      const formatted = selectedDate.toLocaleDateString();
      setBirth(formatted);
    }
  };

  return (
    <View
      style={
        signUpStage === 2
          ? styles_stage2.PopUpScreen
          : styles_stage2.hide
      }
    >
      {/* Header with Back Button */}
      <View style={{ flexDirection: 'row', alignItems: 'center', padding: 2 }}>
        <TouchableOpacity
          onPress={onBack}
          style={{ height: 40, width: '11%' }}
        >
          <Image
            source={require('../assets/images/back_btn.png')}
            style={{ height: '100%', width: '100%' }}
            resizeMode="contain"
          />
        </TouchableOpacity>
        <View style={{ flex: 1, alignItems: 'center' }}>
          <Text style={styles_stage2.headerText}>
            Finishing signing up
          </Text>
        </View>
      </View>

      {/* Form Container */}
      <View style={styles_stage2.stage2Form}>
        {/* First Name Input */}
        <View style={{ width: '90%', left: 20 }}>
          <TextInput
            value={firstName}
            onChangeText={setFirstName}
            keyboardType="default"
            placeholder="First Name*"
            style={[styles.input, styles_stage2.finalFormInput]}
          />
        </View>

        {/* Last Name Input */}
        <View style={{ width: '90%', left: 20 }}>
          <TextInput
            value={lastName}
            onChangeText={setLastName}
            placeholder="Last Name*"
            style={[styles.input, styles_stage2.finalFormInput]}
          />
        </View>

        {/* Birthday Picker */}
        <View style={{ width: '90%', left: 20 }}>
          <TouchableOpacity onPress={() => setShowPicker(true)}>
            <Text
              style={[
                styles.input,
                styles_stage2.finalFormInput,
                { color: '#626262' },
              ]}
            >
              {birth || 'Birthday*'}
            </Text>
          </TouchableOpacity>
          {showPicker && (
            <DateTimePicker
              value={birth ? new Date(birth) : new Date(2000, 0, 1)}
              mode="date"
              display={Platform.OS === 'ios' ? 'spinner' : 'default'}
              maximumDate={new Date()}
              onChange={handleDateChange}
            />
          )}
        </View>

        {/* Gender Picker */}
        <View style={{ width: '90%', left: 20 }}>
          <TouchableOpacity
            onPress={() => setShowGenderPicker(true)}
            style={[
              styles.input,
              styles_stage2.finalFormInput,
              { justifyContent: 'center' },
            ]}
          >
            <Text style={{ color: gender ? '#000' : '#626262' }}>
              {gender || 'Gender*'}
            </Text>
          </TouchableOpacity>

          <GenderPickerModal
            visible={showGenderPicker}
            selectedGender={gender}
            onSelect={(selectedGender) => {
              setGender(selectedGender);
              setShowGenderPicker(false);
            }}
            onClose={() => setShowGenderPicker(false)}
          />
        </View>

        {/* Terms and Conditions */}
        <View
          style={{
            flexDirection: 'row',
            maxWidth: '80%',
            alignSelf: 'center',
          }}
        >
          <Checkbox
            status={isChecked ? 'checked' : 'unchecked'}
            onPress={() => setIsChecked(!isChecked)}
            color="#007aff"
          />

          <Text style={{ color: '#aaaaaa' }}>
            By Selecting Agree & Continue, I agree with{' '}
            <Text style={{ color: '#38b6ff' }}>
              Terms and Conditions, Payment Terms of Service and Privacy
              Policies.
            </Text>
          </Text>
        </View>

        {/* Complete Sign Up Button */}
        <TouchableOpacity
          onPress={onComplete}
          style={styles_stage2.completeButton}
        >
          <Text style={[styles_stage2.buttonText, { fontSize: 20 }]}>
            Complete Sign Up
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles_stage2 = StyleSheet.create({
  PopUpScreen: {
    top: '10%',
    position: 'relative',
    height: '90%',
    width: '99%',
    alignSelf: 'center',
    backgroundColor: '#fff7ea',
    borderTopLeftRadius: 50,
    borderTopRightRadius: 50,
    padding: 20,
  },
  hide: {
    display: 'none',
  },
  headerText: {
    color: '#ffbc00',
    fontFamily: 'Fredoka-SemiBold',
    fontSize: 28,
    letterSpacing: 2,
  },
  stage2Form: {
    marginTop: 20,
    width: '100%',
    height: '60%',
    gap: 15,
  },
  finalFormInput: {
    borderRadius: 25,
    fontFamily: 'Fredoka-Medium',
    margin: 0,
    marginTop: 5,
    height: 60,
    fontSize: 18,
    letterSpacing: 2,
    paddingHorizontal: '10%',
    color: '#aaaaaa',
  },
  genderModalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  genderModalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    width: '80%',
  },
  completeButton: {
    marginTop: 30,
    padding: 8,
    backgroundColor: '#ffcf00',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 20,
    width: '95%',
    alignSelf: 'center',
    height: 60,
  },
  buttonText: {
    color: 'white',
    letterSpacing: 2,
    paddingVertical: 4,
    fontFamily: 'Fredoka-Bold',
  },
});

export default SignUpStage2;
