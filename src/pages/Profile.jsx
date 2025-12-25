import React, { useEffect, useState } from 'react';
import { Pressable, StyleSheet, View, Text, Image, ActivityIndicator, Alert, TextInput, Modal } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { styles } from '../css/style';
import * as authService from '../services/authService';
import * as storageService from '../services/storageService';

const Profile = () => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedData, setEditedData] = useState(null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showGenderModal, setShowGenderModal] = useState(false);

  const defaultProfileImage = require('../assets/images/profile_icon.png');

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      setLoading(true);
      const token = await storageService.getToken();
      
      if (!token) {
        setError('No authentication token found');
        Alert.alert('Authentication Error', 'Please log in again to view your profile.');
        setLoading(false);
        return;
      }

      // Get user email and phone from AsyncStorage or initial state
      // You'll need to store these during signup
      const storedEmail = await storageService.getValue('userEmail');
      const storedPhone = await storageService.getValue('userPhone');

      console.log('Stored Email:', storedEmail);
      console.log('Stored Phone:', storedPhone);

      if (!storedEmail && !storedPhone) {
        setError('User credentials not found');
        Alert.alert('Error', 'User credentials not found. Please log in again.');
        setLoading(false);
        return;
      }

      console.log('Token found, fetching user details...');
      const response = await authService.fetchUserDetails(token, storedEmail, storedPhone);
      
      console.log('Response received:', response);

      if (response && response.data) {
        setUserData(response.data);
        setError(null);
      } else if (response && response.success) {
        // Handle different response format
        setUserData(response);
        setError(null);
      } else {
        setError('Invalid response format from server');
        Alert.alert('Error', 'Failed to fetch user details. Please try refreshing.');
      }
    } catch (err) {
      console.error('Error fetching user data:', err);
      setError(err.message || 'An error occurred while fetching user data');
      Alert.alert('Error', `Failed to load profile: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleEditPress = () => {
    if (!isEditing) {
      // Start editing - copy current data to editable state
      setEditedData({ ...userData });
      setIsEditing(true);
    }
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditedData(null);
  };

  const handleSaveEdit = async () => {
    try {
      setLoading(true);

      // Validate that no previously filled field is being cleared
      const fieldsToProtect = ['name', 'email', 'phone', 'address', 'gender', 'dob'];
      let clearedField = null;

      for (const field of fieldsToProtect) {
        const originalValue = userData?.[field];
        const newValue = editedData?.[field];

        // If field had a value and is now empty, flag it
        if (originalValue && originalValue.toString().trim() !== '' && 
            (!newValue || newValue.toString().trim() === '')) {
          clearedField = field.charAt(0).toUpperCase() + field.slice(1);
          break;
        }
      }

      if (clearedField) {
        Alert.alert('Cannot Clear Field', `${clearedField} cannot be cleared once it has been set.`);
        setLoading(false);
        return;
      }

      // Check if email changed
      const emailChanged = editedData.email !== userData.email;
      
      // Check if all profile fields are filled
      const isProfileComplete = 
        editedData?.name && editedData.name.trim() !== '' &&
        editedData?.email && editedData.email.trim() !== '' &&
        editedData?.phone && editedData.phone.toString().trim() !== '' &&
        editedData?.address && editedData.address.trim() !== '' &&
        editedData?.gender && editedData.gender.trim() !== '' &&
        editedData?.dob && editedData.dob.trim() !== '';

      console.log('Profile fields check:', {
        name: editedData?.name,
        email: editedData?.email,
        phone: editedData?.phone,
        address: editedData?.address,
        gender: editedData?.gender,
        dob: editedData?.dob,
        isComplete: isProfileComplete
      });
      
      // Prepare update object
      const updateData = {
        ...editedData,
        e_verified: emailChanged ? false : editedData.e_verified,
        profile_completed: isProfileComplete ? 1 : 0,
      };

      const token = await storageService.getToken();
      const storedEmail = await storageService.getValue('userEmail');
      const storedPhone = await storageService.getValue('userPhone');

      // Call update API
      const response = await authService.updateUserDetails(token, storedEmail, storedPhone, updateData);

      if (response && response.success) {
        // Update local userData with new data
        setUserData(updateData);
        
        // Update stored email and phone if they changed
        if (emailChanged) {
          await storageService.saveValue('userEmail', editedData.email);
        }
        
        // Check if phone changed and update storage
        const phoneChanged = editedData.phone !== userData.phone;
        if (phoneChanged) {
          await storageService.saveValue('userPhone', editedData.phone);
        }

        setIsEditing(false);
        setEditedData(null);
        const message = isProfileComplete 
          ? 'Profile updated successfully! Your profile is now complete.' 
          : 'Profile updated successfully! Complete all fields to mark profile as complete.';
        Alert.alert('Success', message);
      } else {
        Alert.alert('Error', 'Failed to update profile. Please try again.');
      }
    } catch (err) {
      console.error('Error updating profile:', err);
      Alert.alert('Error', `Failed to update profile: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleDateChange = (event, selectedDate) => {
    if (selectedDate) {
      const formatted = selectedDate.toLocaleDateString('en-GB');
      setEditedData({ ...editedData, dob: formatted });
    }
    setShowDatePicker(false);
  };

  const handleGenderSelect = (selectedGender) => {
    setEditedData({ ...editedData, gender: selectedGender });
    setShowGenderModal(false);
  };

  if (loading) {
    return (
      <View style={[LocalStyles.ProfilePageContainer, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color="#ffcf00" />
      </View>
    );
  }

  // Determine which image to use
  const profileImage = userData?.photo && userData.photo.trim() !== '' 
    ? { uri: userData.photo }
    : defaultProfileImage;

  return (
    <View style={LocalStyles.ProfilePageContainer}>
      <View style={styles.IconBar}>
        <View style={[styles.IconContainer, LocalStyles.settingsIcon]}>
          <Image
            style={styles.ProfileIcon}
            source={require('../assets/images/settings_icon.png')}
          />
        </View>
        <View style={[styles.IconContainer, LocalStyles.notificationIcon]}>
          <Image
            style={styles.ProfileIcon}
            source={require('../assets/images/notification_icon.png')}
          />
        </View>
      </View>

      <View style={styles.ProfileMainSection}>
        <Image
          style={[styles.ProfileImg, LocalStyles.circularProfileImg]}
          source={profileImage}
        />
        <View style={styles.ProfileNameContainer}>
          <View style={[styles.ProfileHeading, LocalStyles.centeredHeading]}>
            <Text style={[styles.ProfileName, LocalStyles.centeredName]}>{userData?.name || 'User'}</Text>
            <View style={styles.NameUderline}></View>
            <View style={LocalStyles.emailWithVerification}>
              <Text style={styles.ProfileEmail}>{userData?.email || 'email@example.com'}</Text>
              {userData?.e_verified === false && (
                <Text style={LocalStyles.unverifiedBadge}>  (unverified)</Text>
              )}
            </View>
          </View>
          <Pressable style={styles.NameEditBtnContainer}>
            <Image
              style={styles.NameEditBtn}
              source={require('../assets/images/edit.png')}
            />
          </Pressable>
        </View>
        {!isEditing && (
          <Pressable style={styles.ProfileEditButton} onPress={handleEditPress}>
            <Text style={styles.ProfileEditButtonText}>Edit Profile</Text>
          </Pressable>
        )}
        {isEditing && (
          <View style={LocalStyles.editButtonsContainer}>
            <Pressable 
              style={[styles.ProfileEditButton, LocalStyles.saveButton]}
              onPress={handleSaveEdit}
            >
              <Text style={styles.ProfileEditButtonText}>Save Changes</Text>
            </Pressable>
            <Pressable 
              style={[styles.ProfileEditButton, LocalStyles.cancelButton]}
              onPress={handleCancelEdit}
            >
              <Text style={styles.ProfileEditButtonText}>Cancel</Text>
            </Pressable>
          </View>
        )}
      </View>

      <View style={styles.DetailsSection}>
        <Text style={styles.DetailsSectionHeading}>Account Info</Text>
        <View style={styles.DetailsContainer}>
          <View style={styles.DetailsTextContainer}>
            <Text style={styles.DetailsHeadingText}>Name</Text>
            {isEditing ? (
              <TextInput
                style={[styles.DetailsSubText, LocalStyles.editInput]}
                value={editedData?.name || ''}
                onChangeText={(text) => setEditedData({...editedData, name: text})}
              />
            ) : (
              <Text style={styles.DetailsSubText}>{userData?.name || 'N/A'}</Text>
            )}
          </View>
          <View style={styles.DetailsTextContainer}>
            <Text style={styles.DetailsHeadingText}>Email</Text>
            {isEditing ? (
              !userData?.phone ? (
                <View style={[styles.DetailsSubText, LocalStyles.disabledInput]}>
                  <Text style={LocalStyles.disabledText}>{editedData?.email || ''}</Text>
                  <Text style={LocalStyles.disabledHint}>(Cannot change - add phone number first)</Text>
                </View>
              ) : (
                <TextInput
                  style={[styles.DetailsSubText, LocalStyles.editInput]}
                  value={editedData?.email || ''}
                  onChangeText={(text) => setEditedData({...editedData, email: text})}
                  keyboardType="email-address"
                />
              )
            ) : (
              <Text style={styles.DetailsSubText}>{userData?.email || 'N/A'}</Text>
            )}
          </View>
          <View style={styles.DetailsTextContainer}>
            <Text style={styles.DetailsHeadingText}>Phone</Text>
            {isEditing && !userData?.phone ? (
              <TextInput
                style={[styles.DetailsSubText, LocalStyles.editInput]}
                value={editedData?.phone || ''}
                onChangeText={(text) => setEditedData({...editedData, phone: text})}
                keyboardType="phone-pad"
              />
            ) : (
              <Text style={styles.DetailsSubText}>{userData?.phone ? `+91 ${userData.phone}` : 'N/A'}</Text>
            )}
          </View>
        </View>
      </View>
      <View style={styles.DetailsSection}>
        <Text style={styles.DetailsSectionHeading}>More Details</Text>
        <View style={styles.DetailsContainer}>
          <View style={styles.DetailsTextContainer}>
            <Text style={styles.DetailsHeadingText}>Address</Text>
            {isEditing ? (
              <TextInput
                style={[styles.DetailsSubText, LocalStyles.editInput]}
                value={editedData?.address || ''}
                onChangeText={(text) => setEditedData({...editedData, address: text})}
                multiline
              />
            ) : (
              <Text style={styles.DetailsSubText}>
                {userData?.address || 'Not provided'}
              </Text>
            )}
          </View>
          <View style={styles.DetailsTextContainer}>
            <Text style={styles.DetailsHeadingText}>Gender</Text>
            {isEditing ? (
              <>
                <Pressable
                  style={[styles.DetailsSubText, LocalStyles.editInput]}
                  onPress={() => setShowGenderModal(true)}
                >
                  <Text style={{ color: editedData?.gender ? '#000' : '#999' }}>
                    {editedData?.gender || 'Select Gender'}
                  </Text>
                </Pressable>

                <Modal visible={showGenderModal} transparent animationType="slide">
                  <View style={LocalStyles.genderModalOverlay}>
                    <View style={LocalStyles.genderModalContent}>
                      <Text style={LocalStyles.genderModalTitle}>Select Gender</Text>

                      {['Male', 'Female', 'Other'].map((gender) => (
                        <Pressable
                          key={gender}
                          onPress={() => handleGenderSelect(gender)}
                          style={LocalStyles.genderOption}
                        >
                          <Text style={LocalStyles.genderOptionText}>{gender}</Text>
                        </Pressable>
                      ))}

                      <Pressable
                        onPress={() => setShowGenderModal(false)}
                        style={LocalStyles.genderCloseButton}
                      >
                        <Text style={LocalStyles.genderCloseButtonText}>Cancel</Text>
                      </Pressable>
                    </View>
                  </View>
                </Modal>
              </>
            ) : (
              <Text style={styles.DetailsSubText}>{userData?.gender || 'Not specified'}</Text>
            )}
          </View>
          <View style={styles.DetailsTextContainer}>
            <Text style={styles.DetailsHeadingText}>Date of Birth</Text>
            {isEditing ? (
              <>
                <Pressable
                  style={[styles.DetailsSubText, LocalStyles.editInput]}
                  onPress={() => setShowDatePicker(true)}
                >
                  <Text style={{ color: editedData?.dob ? '#000' : '#999' }}>
                    {editedData?.dob || 'Select Date'}
                  </Text>
                </Pressable>
                {showDatePicker && (
                  <DateTimePicker
                    value={editedData?.dob ? new Date(editedData.dob) : new Date(2000, 0, 1)}
                    mode="date"
                    display="default"
                    maximumDate={new Date()}
                    onChange={handleDateChange}
                  />
                )}
              </>
            ) : (
              <Text style={styles.DetailsSubText}>{userData?.dob || 'Not provided'}</Text>
            )}
          </View>
        </View>
      </View>
    </View>
  );
};

const LocalStyles = StyleSheet.create({
  ProfilePageContainer: {
    backgroundColor: '#f9f7f9',
    marginTop: 10,
    padding: 10,
  },
  circularProfileImg: {
    borderRadius: 150,
    width: 150,
    height: 150,
    overflow: 'hidden',
  },
  centeredHeading: {
    alignItems: 'center',
  },
  centeredName: {
    fontSize: 20,
    textAlign: 'center',
  },
  emailWithVerification: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  unverifiedBadge: {
    color: '#ff6b6b',
    fontSize: 12,
    fontWeight: 'bold',
  },
  editInput: {
    borderWidth: 1,
    borderColor: '#ffcf00',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 5,
    backgroundColor: '#fff',
    color: '#000',
    justifyContent: 'center',
  },
  editButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 10,
    marginTop: 10,
  },
  saveButton: {
    backgroundColor: '#4CAF50',
    flex: 1,
  },
  cancelButton: {
    backgroundColor: '#f44336',
    flex: 1,
  },
  disabledInput: {
    backgroundColor: '#f5f5f5',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 8,
  },
  disabledText: {
    color: '#666',
    fontSize: 14,
  },
  disabledHint: {
    color: '#999',
    fontSize: 11,
    marginTop: 4,
    fontStyle: 'italic',
  },
  genderModalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  genderModalContent: {
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 20,
    width: '80%',
    alignItems: 'center',
  },
  genderModalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#000',
  },
  genderOption: {
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    width: '100%',
    alignItems: 'center',
  },
  genderOptionText: {
    fontSize: 16,
    color: '#333',
  },
  genderCloseButton: {
    marginTop: 15,
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: '#f44336',
    borderRadius: 8,
  },
  genderCloseButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default Profile;
