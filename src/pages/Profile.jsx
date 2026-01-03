import React, { useEffect, useState } from 'react';
import {
  Pressable,
  StyleSheet,
  View,
  Text,
  Image,
  ActivityIndicator,
  Alert,
  TextInput,
  Modal,
  ScrollView,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import FAIcon from 'react-native-vector-icons/FontAwesome5';
import DateTimePicker from '@react-native-community/datetimepicker';
import { styles } from '../css/style';
import * as authService from '../services/authService';
import * as storageService from '../services/storageService';
import { useAuth } from '../context/AuthContext';

const Profile = ({ navigation }) => {
  const { profileCompleted, setProfileCompleted } = useAuth();
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedData, setEditedData] = useState(null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showGenderModal, setShowGenderModal] = useState(false);
  const [emailVerificationLoading, setEmailVerificationLoading] = useState(false);

  // Phone change flow states
  const [showPhoneChangeModal, setShowPhoneChangeModal] = useState(false);
  const [phoneOTP, setPhoneOTP] = useState('');
  const [phoneOTPMessageID, setPhoneOTPMessageID] = useState(null);
  const [phoneOTPAccessToken, setPhoneOTPAccessToken] = useState(null);
  const [phoneChangeStep, setPhoneChangeStep] = useState(1); // 1: Enter OTP, 2: New Phone, 3: Verify New Phone OTP
  const [newPhoneNumber, setNewPhoneNumber] = useState('');
  const [newPhoneOTP, setNewPhoneOTP] = useState('');
  const [newPhoneOTPMessageID, setNewPhoneOTPMessageID] = useState(null);
  const [newPhoneAccessToken, setNewPhoneAccessToken] = useState(null);
  const [phoneChangeLoading, setPhoneChangeLoading] = useState(false);
  const [phoneChangeResendActive, setPhoneChangeResendActive] = useState(false);
  const [phoneChangeResendTimer, setPhoneChangeResendTimer] = useState(10);

  const defaultProfileImage = require('../assets/images/profile_icon.png');

  /**
   * Send verification email to user
   */
  const handleSendVerificationEmail = async (emailToVerify = null) => {
    try {
      setEmailVerificationLoading(true);
      const token = await storageService.getToken();
      const email = emailToVerify || userData?.email;

      if (!email) {
        Alert.alert('Error', 'No email address found');
        return;
      }

      const response = await authService.sendVerificationMail(email, token);

      if (response.success || response.Status === 'Success') {
        Alert.alert('Success', 'Verification email has been sent to you');
      } else {
        Alert.alert('Error', response.message || 'Failed to send verification email');
      }
    } catch (error) {
      console.error('Error sending verification email:', error);
      Alert.alert('Error', `Failed to send verification email: ${error.message}`);
    } finally {
      setEmailVerificationLoading(false);
    }
  };

  /**
   * Start resend OTP timer for phone change
   */
  const startPhoneChangeResendTimer = () => {
    setPhoneChangeResendActive(false);
    setPhoneChangeResendTimer(10);

    let resendInterval = setInterval(() => {
      setPhoneChangeResendTimer((prev) => {
        if (prev <= 1) {
          clearInterval(resendInterval);
          setPhoneChangeResendActive(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  /**
   * Handle phone change button click - initiate OTP sending
   */
  const handleChangePhonePress = async () => {
    try {
      setPhoneChangeLoading(true);
      setShowPhoneChangeModal(true);
      setPhoneChangeStep(1);
      setPhoneOTP('');
      setNewPhoneNumber('');
      setNewPhoneOTP('');

      // Send OTP to current phone number using backend
      const token = await storageService.getToken();
      const otp_response = await authService.sendOTPBackend(userData.phone);

      console.log('OTP response for current phone hereeeeeeeeeeee:', otp_response);

      if (otp_response.success) {
        setPhoneOTPMessageID(otp_response.token);
        startPhoneChangeResendTimer();
        Alert.alert(
          'OTP Sent',
          'OTP has been sent to your current phone number'
        );
      } else {
        Alert.alert('Error', 'Failed to send OTP. Please try again.');
        setShowPhoneChangeModal(false);
      }
    } catch (error) {
      console.error('Error sending OTP:', error);
      Alert.alert('Error', `Failed to send OTP: ${error.message}`);
      setShowPhoneChangeModal(false);
    } finally {
      setPhoneChangeLoading(false);
    }
  };

  /**
   * Verify OTP for current phone and proceed to new phone input
   */
  const handlePhoneOTPVerify = async () => {
    try {
      if (!phoneOTP || phoneOTP.length < 4) {
        Alert.alert('Invalid OTP', 'Please enter a valid 4-digit OTP');
        return;
      }

      setPhoneChangeLoading(true);

      // Verify OTP with backend
      const token = await storageService.getToken();
      const backendVerification = await authService.verifyOTPBackend(
        phoneOTP,
        phoneOTPMessageID
      );

      if (backendVerification.success) {
        setPhoneOTPAccessToken(backendVerification.token);
        setPhoneChangeStep(2); // Move to new phone input
        Alert.alert('OTP Verified', 'Now enter your new phone number');
      } else {
        Alert.alert(
          'Verification Failed',
          backendVerification.message || 'Failed to verify OTP with server'
        );
      }
    } catch (error) {
      console.error('Error verifying OTP:', error);
      Alert.alert('Error', `Failed to verify OTP: ${error.message}`);
    } finally {
      setPhoneChangeLoading(false);
    }
  };

  /**
   * Send OTP to new phone number
   */
  const handleSendNewPhoneOTP = async () => {
    try {
      if (!newPhoneNumber || newPhoneNumber.length < 10) {
        Alert.alert('Invalid Number', 'Please enter a valid phone number');
        return;
      }

      setPhoneChangeLoading(true);

      // Send OTP to new phone number using backend
      const token = await storageService.getToken();
      const otp_response = await authService.sendOTPBackend(newPhoneNumber);

      if (otp_response.success) {
        setNewPhoneOTPMessageID(otp_response.token);
        setPhoneChangeStep(3); // Move to OTP verification for new phone
        startPhoneChangeResendTimer();
        Alert.alert('OTP Sent', 'OTP has been sent to your new phone number');
      } else {
        Alert.alert('Error', 'Failed to send OTP. Please try again.');
      }
    } catch (error) {
      console.error('Error sending OTP to new phone:', error);
      Alert.alert('Error', `Failed to send OTP: ${error.message}`);
    } finally {
      setPhoneChangeLoading(false);
    }
  };

  /**
   * Verify new phone OTP and update phone number
   */
  const handleNewPhoneOTPVerify = async () => {
    try {
      if (!newPhoneOTP || newPhoneOTP.length < 4) {
        Alert.alert('Invalid OTP', 'Please enter a valid 4-digit OTP');
        return;
      }

      setPhoneChangeLoading(true);

      // Update phone number with backend
      const token = await storageService.getToken();
      const updateResponse = await authService.updatePhoneNumberBackend(
        token,
        newPhoneNumber,
        newPhoneOTPMessageID,
        newPhoneOTP
      );

      if (updateResponse.Status === 'Success' || updateResponse.success) {
        // Update userData and storage
        setUserData({ ...userData, phone: newPhoneNumber });
        await storageService.saveValue('userPhone', newPhoneNumber);

        // Reset phone change flow
        setShowPhoneChangeModal(false);
        setPhoneChangeStep(1);
        setPhoneOTP('');
        setNewPhoneNumber('');
        setNewPhoneOTP('');

        Alert.alert('Success', 'Phone number updated successfully!');
      } else {
        Alert.alert(
          'Error',
          updateResponse.message || 'Failed to update phone number'
        );
      }
    } catch (error) {
      console.error('Error updating phone number:', error);
      Alert.alert('Error', `Failed to update phone number: ${error.message}`);
    } finally {
      setPhoneChangeLoading(false);
    }
  };

  /**
   * Close phone change modal
   */
  const handleClosePhoneChangeModal = () => {
    setShowPhoneChangeModal(false);
    setPhoneChangeStep(1);
    setPhoneOTP('');
    setNewPhoneNumber('');
    setNewPhoneOTP('');
  };

  const fetchUserData = async () => {
    try {
      setLoading(true);
      const token = await storageService.getToken();

      if (!token) {
        setError('No authentication token found');
        Alert.alert(
          'Authentication Error',
          'Please log in again to view your profile.'
        );
        setLoading(false);
        return;
      }

      // Get user email and phone from AsyncStorage or initial state
      // You'll need to store these during signup
      // const storedEmail = await storageService.getValue('userEmail');
      // const storedPhone = await storageService.getValue('userPhone');

      // console.log('Stored Email:', storedEmail);
      // console.log('Stored Phone:', storedPhone);

      if (!token) {
        setError('User credentials not found');
        Alert.alert(
          'Error',
          'User credentials not found. Please log in again.'
        );
        setLoading(false);
        return;
      }

      console.log('Token found, fetching user details...');
      const response = await authService.fetchUserDetails(token);

      console.log('Response received:', response);

      if (response && response.data) {
        setUserData(response.data);
        // Sync profile_completed state with context
        if (response.data.profile_completed) {
          console.log('Profile is completed, updating context');
          setProfileCompleted(true);
        } else {
          console.log('Profile is not completed, updating context');
          setProfileCompleted(false);
        }
        setError(null);
      } else if (response && response.success) {
        // Handle different response format
        setUserData(response);
        // Sync profile_completed state with context
        if (response.profile_completed) {
          console.log('Profile is completed, updating context');
          setProfileCompleted(true);
        } else {
          console.log('Profile is not completed, updating context');
          setProfileCompleted(false);
        }
        setError(null);
      } else {
        setError('Invalid response format from server');
        Alert.alert(
          'Error',
          'Failed to fetch user details. Please try refreshing.'
        );
      }
    } catch (err) {
      console.error('Error fetching user data:', err);
      setError(err.message || 'An error occurred while fetching user data');
      Alert.alert('Error', `Failed to load profile: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserData();
    console.log('Profile component mounted, fetching user data...');
    console.log('Profile Completed Status:', profileCompleted);
    console.log('userData state on mount:', userData);
  }, []);

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
      const fieldsToProtect = [
        'name',
        'email',
        'phone',
        'address',
        'gender',
        'dob',
      ];
      let clearedField = null;

      for (const field of fieldsToProtect) {
        const originalValue = userData?.[field];
        const newValue = editedData?.[field];

        // If field had a value and is now empty, flag it
        if (
          originalValue &&
          originalValue.toString().trim() !== '' &&
          (!newValue || newValue.toString().trim() === '')
        ) {
          clearedField = field.charAt(0).toUpperCase() + field.slice(1);
          break;
        }
      }

      if (clearedField) {
        Alert.alert(
          'Cannot Clear Field',
          `${clearedField} cannot be cleared once it has been set.`
        );
        setLoading(false);
        return;
      }

      // Check if email changed
      const emailChanged = editedData.email !== userData.email;

      // Check if all profile fields are filled
      const isProfileComplete =
        editedData?.name &&
        editedData.name.trim() !== '' &&
        editedData?.email &&
        editedData.email.trim() !== '' &&
        editedData?.phone &&
        editedData.phone.toString().trim() !== '' &&
        editedData?.address &&
        editedData.address.trim() !== '' &&
        editedData?.gender &&
        editedData.gender.trim() !== '' &&
        editedData?.dob &&
        editedData.dob.trim() !== '';

      console.log('Profile fields check:', {
        name: editedData?.name,
        email: editedData?.email,
        phone: editedData?.phone,
        address: editedData?.address,
        gender: editedData?.gender,
        dob: editedData?.dob,
        isComplete: isProfileComplete,
      });

      // Prepare update object
      let updateData = {};
      if (emailChanged) {
        updateData = {
          ...editedData,
          e_verified: emailChanged ? 0 : editedData.e_verified,
          profile_completed: 0,
        };
      } else {
        if (editedData.e_verified) {
          updateData = {
            ...editedData,
            e_verified: 1,
            profile_completed: 1,
          };
        } else {
          updateData = {
            ...editedData,
            e_verified: 0,
            profile_completed: 0,
          };
        }
      }

      const token = await storageService.getToken();
      const storedEmail = await storageService.getValue('userEmail');
      const storedPhone = await storageService.getValue('userPhone');

      // Call update API
      console.log('Updating user details with data:', updateData);
      const response = await authService.updateUserDetails(
        token,
        storedEmail,
        storedPhone,
        updateData
      );

      if (response && response.success) {
        // Update local userData with new data
        setUserData(updateData);

        // Sync profile_completed state with context
        if (updateData.profile_completed) {
          console.log('Profile is completed after save, updating context');
          setProfileCompleted(true);
        } else {
          console.log('Profile is not completed after save, updating context');
          setProfileCompleted(false);
        }

        // Update stored emai/senl and phone if they changed
        if (emailChanged) {
          await storageService.saveValue('userEmail', editedData.email);
          // Send verification email to the new email address
          await handleSendVerificationEmail(editedData.email);
        }

        // Check if phone changed and update storage
        const phoneChanged = editedData.phone !== userData.phone;
        if (phoneChanged) {
          await storageService.saveValue('userPhone', editedData.phone);
        }

        setIsEditing(false);
        setEditedData(null);

        if (emailChanged) {
          Alert.alert('Success', 'A verification email has been sent to you');
        } else {
          const message = isProfileComplete
            ? 'Profile updated successfully! Your profile is now complete.'
            : 'Profile updated successfully! Complete all fields to mark profile as complete.';
          Alert.alert('Success', message);
        }
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
      <View
        style={[
          LocalStyles.ProfilePageContainer,
          { justifyContent: 'center', alignItems: 'center' },
        ]}
      >
        <ActivityIndicator size="large" color="#ffcf00" />
      </View>
    );
  }

  // Determine which image to use
  const profileImage =
    userData?.photo && userData.photo.trim() !== ''
      ? { uri: userData.photo }
      : defaultProfileImage;

  return (
    <View style={LocalStyles.ProfilePageContainer}>
      {/* Custom Header */}
      <View style={LocalStyles.customHeader}>
        <Pressable
          onPress={() => navigation?.goBack()}
          style={LocalStyles.backButton}
        >
          <Icon name="arrow-back" size={28} color="#000" />
        </Pressable>
        <Text style={LocalStyles.headerTitle}>My Profile</Text>
        <FAIcon name="user-circle" size={28} color="#ffcf00" />
      </View>
      <ScrollView
        showsVerticalScrollIndicator={false}
        style={LocalStyles.scrollContainer}
      >
        <View style={LocalStyles.scrollContentPadding}>
          <View style={LocalStyles.profileImageContainer}>
            <Image
              style={[styles.ProfileImg, LocalStyles.circularProfileImg]}
              source={profileImage}
            />
          </View>
          <View style={styles.ProfileNameContainer}>
            <View style={[styles.ProfileHeading, LocalStyles.centeredHeading]}>
              <Text style={[styles.ProfileName, LocalStyles.centeredName]}>
                {userData?.name || 'User'}
              </Text>
              <View style={styles.NameUderline}></View>
              <View style={LocalStyles.emailWithVerification}>
                <Text style={styles.ProfileEmail}>
                  {userData?.email || 'email@example.com'}
                </Text>
                {userData?.e_verified == 0 && (
                  <Text style={LocalStyles.unverifiedBadge}> (unverified)</Text>
                )}
              </View>
            </View>
          </View>
          {!isEditing && (
            <Pressable
              style={LocalStyles.modernEditButton}
              onPress={handleEditPress}
            >
              <FAIcon
                name="edit"
                size={16}
                color="#fff"
                style={{ marginRight: 8 }}
              />
              <Text style={LocalStyles.modernEditButtonText}>Edit Profile</Text>
            </Pressable>
          )}
          {isEditing && (
            <View style={LocalStyles.modernActionButtons}>
              <Pressable
                style={LocalStyles.modernSaveButton}
                onPress={handleSaveEdit}
              >
                <FAIcon
                  name="check"
                  size={16}
                  color="#fff"
                  style={{ marginRight: 8 }}
                />
                <Text style={LocalStyles.modernButtonText}>Save</Text>
              </Pressable>
              <Pressable
                style={LocalStyles.modernCancelButton}
                onPress={handleCancelEdit}
              >
                <FAIcon
                  name="times"
                  size={16}
                  color="#fff"
                  style={{ marginRight: 8 }}
                />
                <Text style={LocalStyles.modernButtonText}>Cancel</Text>
              </Pressable>
            </View>
          )}
        </View>

        <View style={LocalStyles.modernSection}>
          <Text style={LocalStyles.modernSectionTitle}>Account Info</Text>
          <View style={LocalStyles.modernDetailsContainer}>
            <View style={styles.DetailsTextContainer}>
              <Text style={styles.DetailsHeadingText}>Name</Text>
              {isEditing ? (
                <TextInput
                  style={[styles.DetailsSubText, LocalStyles.editInput]}
                  value={editedData?.name || ''}
                  onChangeText={(text) =>
                    setEditedData({ ...editedData, name: text })
                  }
                />
              ) : (
                <Text style={styles.DetailsSubText}>
                  {userData?.name || 'N/A'}
                </Text>
              )}
            </View>
            <View style={styles.DetailsTextContainer}>
              <Text style={styles.DetailsHeadingText}>Email</Text>
              {isEditing ? (
                !userData?.phone ? (
                  <View
                    style={[styles.DetailsSubText, LocalStyles.disabledInput]}
                  >
                    <Text style={LocalStyles.disabledText}>
                      {editedData?.email || ''}
                    </Text>
                    <Text style={LocalStyles.disabledHint}>
                      (Cannot change - add phone number first)
                    </Text>
                  </View>
                ) : (
                  <TextInput
                    style={[styles.DetailsSubText, LocalStyles.editInput]}
                    value={editedData?.email || ''}
                    onChangeText={(text) =>
                      setEditedData({ ...editedData, email: text })
                    }
                    keyboardType="email-address"
                  />
                )
              ) : (
                <View style={LocalStyles.phoneFieldWrapper}>
                  <View style={LocalStyles.phoneDisplayBox}>
                    <Text style={LocalStyles.phoneDisplayText}>
                      {userData?.email || 'N/A'}
                    </Text>
                  </View>
                  {!userData?.e_verified && (
                    <Pressable 
                      style={LocalStyles.changePhoneButton}
                      onPress={() => handleSendVerificationEmail(userData?.email)}
                      disabled={emailVerificationLoading}
                    >
                      <Text style={LocalStyles.changePhoneButtonText}>Verify</Text>
                    </Pressable>
                  )}
                </View>
              )}
            </View>
            <View style={styles.DetailsTextContainer}>
              <Text style={styles.DetailsHeadingText}>Phone</Text>
              {isEditing && !userData?.phone ? (
                <TextInput
                  style={[styles.DetailsSubText, LocalStyles.editInput]}
                  value={editedData?.phone || ''}
                  onChangeText={(text) =>
                    setEditedData({ ...editedData, phone: text })
                  }
                  keyboardType="phone-pad"
                />
              ) : (
                <View style={LocalStyles.phoneFieldContainer}>
                  <Text style={styles.DetailsSubText}>
                    {userData?.phone ? `+91 ${userData.phone}` : 'N/A'}
                  </Text>
                  {isEditing && userData?.phone && (
                      <Pressable
                        style={LocalStyles.changePhoneButton}
                        onPress={handleChangePhonePress}
                        disabled={phoneChangeLoading}
                      >
                        <Text style={LocalStyles.changePhoneButtonText}>
                          Change
                        </Text>
                      </Pressable>
                    )}
                </View>
              )}
            </View>
          </View>
        </View>
        <View style={LocalStyles.modernSection}>
          <Text style={LocalStyles.modernSectionTitle}>More Details</Text>
          <View style={LocalStyles.modernDetailsContainer}>
            <View style={styles.DetailsTextContainer}>
              <Text style={styles.DetailsHeadingText}>Address</Text>
              {isEditing ? (
                <TextInput
                  style={[styles.DetailsSubText, LocalStyles.editInput]}
                  value={editedData?.address || ''}
                  onChangeText={(text) =>
                    setEditedData({ ...editedData, address: text })
                  }
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
                    <Text
                      style={{ color: editedData?.gender ? '#000' : '#999' }}
                    >
                      {editedData?.gender || 'Select Gender'}
                    </Text>
                  </Pressable>

                  <Modal
                    visible={showGenderModal}
                    transparent
                    animationType="slide"
                  >
                    <View style={LocalStyles.genderModalOverlay}>
                      <View style={LocalStyles.genderModalContent}>
                        <Text style={LocalStyles.genderModalTitle}>
                          Select Gender
                        </Text>

                        {['Male', 'Female', 'Other'].map((gender) => (
                          <Pressable
                            key={gender}
                            onPress={() => handleGenderSelect(gender)}
                            style={LocalStyles.genderOption}
                          >
                            <Text style={LocalStyles.genderOptionText}>
                              {gender}
                            </Text>
                          </Pressable>
                        ))}

                        <Pressable
                          onPress={() => setShowGenderModal(false)}
                          style={LocalStyles.genderCloseButton}
                        >
                          <Text style={LocalStyles.genderCloseButtonText}>
                            Cancel
                          </Text>
                        </Pressable>
                      </View>
                    </View>
                  </Modal>
                </>
              ) : (
                <Text style={styles.DetailsSubText}>
                  {userData?.gender || 'Not specified'}
                </Text>
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
                      value={
                        editedData?.dob
                          ? new Date(editedData.dob)
                          : new Date(2000, 0, 1)
                      }
                      mode="date"
                      display="default"
                      maximumDate={new Date()}
                      onChange={handleDateChange}
                    />
                  )}
                </>
              ) : (
                <Text style={styles.DetailsSubText}>
                  {userData?.dob || 'Not provided'}
                </Text>
              )}
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Phone Change Modal */}
      <Modal visible={showPhoneChangeModal} transparent animationType="slide">
        <View style={LocalStyles.phoneChangeModalOverlay}>
          <View style={LocalStyles.phoneChangeModalContent}>
            {/* Step 1: Verify Current Phone OTP */}
            {phoneChangeStep === 1 && (
              <>
                <Text style={LocalStyles.phoneChangeModalTitle}>
                  Verify Current Phone
                </Text>
                <Text style={LocalStyles.phoneChangeModalSubtitle}>
                  Enter the OTP sent to{' '}
                  {userData?.phone ? `+91 ${userData.phone}` : 'your phone'}
                </Text>

                <TextInput
                  style={[LocalStyles.phoneChangeOTPInput, styles.input]}
                  placeholder="Enter 4-digit OTP"
                  value={phoneOTP}
                  onChangeText={setPhoneOTP}
                  keyboardType="number-pad"
                  maxLength={4}
                  placeholderTextColor="#999"
                />

                <View style={LocalStyles.phoneChangeResendContainer}>
                  {phoneChangeResendActive ? (
                    <Pressable onPress={handleChangePhonePress}>
                      <Text style={LocalStyles.phoneChangeResendActive}>
                        Resend OTP
                      </Text>
                    </Pressable>
                  ) : (
                    <Text style={LocalStyles.phoneChangeResendInactive}>
                      Resend OTP in {phoneChangeResendTimer}s
                    </Text>
                  )}
                </View>

                <View style={LocalStyles.phoneChangeButtonContainer}>
                  <Pressable
                    style={[
                      LocalStyles.phoneChangeButton,
                      LocalStyles.phoneChangeContinueButton,
                    ]}
                    onPress={handlePhoneOTPVerify}
                    disabled={phoneChangeLoading}
                  >
                    <Text style={LocalStyles.phoneChangeButtonText}>
                      {phoneChangeLoading ? 'Verifying...' : 'Continue'}
                    </Text>
                  </Pressable>
                  <Pressable
                    style={[
                      LocalStyles.phoneChangeButton,
                      LocalStyles.phoneChangeCancelButton,
                    ]}
                    onPress={handleClosePhoneChangeModal}
                    disabled={phoneChangeLoading}
                  >
                    <Text style={LocalStyles.phoneChangeButtonText}>
                      Cancel
                    </Text>
                  </Pressable>
                </View>
              </>
            )}

            {/* Step 2: Enter New Phone Number */}
            {phoneChangeStep === 2 && (
              <>
                <Text style={LocalStyles.phoneChangeModalTitle}>
                  Enter New Phone Number
                </Text>
                <Text style={LocalStyles.phoneChangeModalSubtitle}>
                  You will receive an OTP to verify the new number
                </Text>

                <View style={LocalStyles.newPhoneInputContainer}>
                  <Text style={LocalStyles.countryCodeText}>+91</Text>
                  <TextInput
                    style={[LocalStyles.newPhoneInput, styles.input]}
                    placeholder="Enter new phone number"
                    value={newPhoneNumber}
                    onChangeText={setNewPhoneNumber}
                    keyboardType="phone-pad"
                    maxLength={10}
                    placeholderTextColor="#999"
                  />
                </View>

                <View style={LocalStyles.phoneChangeButtonContainer}>
                  <Pressable
                    style={[
                      LocalStyles.phoneChangeButton,
                      LocalStyles.phoneChangeContinueButton,
                    ]}
                    onPress={handleSendNewPhoneOTP}
                    disabled={phoneChangeLoading || newPhoneNumber.length < 10}
                  >
                    <Text style={LocalStyles.phoneChangeButtonText}>
                      {phoneChangeLoading ? 'Sending...' : 'Send OTP'}
                    </Text>
                  </Pressable>
                  <Pressable
                    style={[
                      LocalStyles.phoneChangeButton,
                      LocalStyles.phoneChangeCancelButton,
                    ]}
                    onPress={handleClosePhoneChangeModal}
                    disabled={phoneChangeLoading}
                  >
                    <Text style={LocalStyles.phoneChangeButtonText}>
                      Cancel
                    </Text>
                  </Pressable>
                </View>
              </>
            )}

            {/* Step 3: Verify New Phone OTP */}
            {phoneChangeStep === 3 && (
              <>
                <Text style={LocalStyles.phoneChangeModalTitle}>
                  Verify New Phone
                </Text>
                <Text style={LocalStyles.phoneChangeModalSubtitle}>
                  Enter the OTP sent to +91 {newPhoneNumber}
                </Text>

                <TextInput
                  style={[LocalStyles.phoneChangeOTPInput, styles.input]}
                  placeholder="Enter 4-digit OTP"
                  value={newPhoneOTP}
                  onChangeText={setNewPhoneOTP}
                  keyboardType="number-pad"
                  maxLength={4}
                  placeholderTextColor="#999"
                />

                <View style={LocalStyles.phoneChangeResendContainer}>
                  {phoneChangeResendActive ? (
                    <Pressable onPress={handleSendNewPhoneOTP}>
                      <Text style={LocalStyles.phoneChangeResendActive}>
                        Resend OTP
                      </Text>
                    </Pressable>
                  ) : (
                    <Text style={LocalStyles.phoneChangeResendInactive}>
                      Resend OTP in {phoneChangeResendTimer}s
                    </Text>
                  )}
                </View>

                <View style={LocalStyles.phoneChangeButtonContainer}>
                  <Pressable
                    style={[
                      LocalStyles.phoneChangeButton,
                      LocalStyles.phoneChangeContinueButton,
                    ]}
                    onPress={handleNewPhoneOTPVerify}
                    disabled={phoneChangeLoading}
                  >
                    <Text style={LocalStyles.phoneChangeButtonText}>
                      {phoneChangeLoading ? 'Updating...' : 'Update Phone'}
                    </Text>
                  </Pressable>
                  <Pressable
                    style={[
                      LocalStyles.phoneChangeButton,
                      LocalStyles.phoneChangeCancelButton,
                    ]}
                    onPress={handleClosePhoneChangeModal}
                    disabled={phoneChangeLoading}
                  >
                    <Text style={LocalStyles.phoneChangeButtonText}>
                      Cancel
                    </Text>
                  </Pressable>
                </View>
              </>
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
};

const LocalStyles = StyleSheet.create({
  ProfilePageContainer: {
    flex: 1,
    backgroundColor: '#fafbfc',
  },
  scrollContainer: {
    backgroundColor: '#fafbfc',
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
    fontSize: 22,
    textAlign: 'center',
    fontWeight: '800',
    marginBottom: 8,
    color: '#000',
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
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: '#fff',
    color: '#000',
    fontSize: 14,
    fontWeight: '500',
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
  // Custom Header Styles
  customHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    elevation: 2,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#000',
    letterSpacing: 0.3,
    flex: 1,
    textAlign: 'center',
  },
  // Scroll Content Padding
  scrollContentPadding: {
    paddingHorizontal: 20,
    paddingVertical: 24,
  },
  // Profile Image Container with Border
  profileImageContainer: {
    alignItems: 'center',
    marginBottom: 20,
    position: 'relative',
  },
  circularProfileImg: {
    borderRadius: 150,
    width: 150,
    height: 150,
    overflow: 'hidden',
    borderWidth: 4,
    borderColor: '#ffcf00',
  },
  // Modern Edit Button
  modernEditButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ff6b9d',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 10,
    marginVertical: 16,
    elevation: 3,
  },
  modernEditButtonText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#fff',
    letterSpacing: 0.3,
  },
  // Modern Action Buttons
  modernActionButtons: {
    flexDirection: 'row',
    gap: 12,
    marginVertical: 16,
  },
  modernSaveButton: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#10b981',
    paddingVertical: 12,
    borderRadius: 10,
    elevation: 3,
  },
  modernCancelButton: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ef4444',
    paddingVertical: 12,
    borderRadius: 10,
    elevation: 3,
  },
  modernButtonText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#fff',
    letterSpacing: 0.3,
  },
  // Modern Section Styling
  modernSection: {
    backgroundColor: '#fff',
    borderRadius: 14,
    marginBottom: 16,
    marginHorizontal: 20,
    paddingHorizontal: 14,
    paddingVertical: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    borderWidth: 1,
    borderColor: '#d5d5d5ff',
  },
  modernSectionTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#000',
    marginBottom: 14,
    letterSpacing: 0.3,
  },
  modernDetailsContainer: {
    gap: 14,
  },
  // Phone Field and Change Button
  phoneFieldContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 8,
    // borderWidth: 5,
    // borderColor: '#3a86ff',
    maxWidth: '78%',
  },
  changePhoneButton: {
    backgroundColor: '#3a86ff',
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 6,
    minWidth: 70,
    alignItems: 'center',
    // borderWidth:5,
    // borderColor: '#000',
  },
  changePhoneButtonText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 0.3,
    // borderWidth:5,
    // borderColor: '#c90404ff',
  },
  // Phone Change Modal Styles
  phoneChangeModalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  phoneChangeModalContent: {
    backgroundColor: '#fff7ea',
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    padding: 24,
    paddingBottom: 32,
    maxHeight: '80%',
  },
  phoneChangeModalTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#ffbc00',
    marginBottom: 8,
    letterSpacing: 0.3,
  },
  phoneChangeModalSubtitle: {
    fontSize: 13,
    color: '#666',
    marginBottom: 20,
    lineHeight: 18,
  },
  phoneChangeOTPInput: {
    borderRadius: 12,
    marginVertical: 16,
    height: 56,
    fontSize: 24,
    letterSpacing: 8,
    paddingHorizontal: 16,
    textAlign: 'center',
    backgroundColor: '#fff',
  },
  phoneChangeResendContainer: {
    alignItems: 'center',
    marginVertical: 12,
  },
  phoneChangeResendActive: {
    color: '#3a86ff',
    textDecorationLine: 'underline',
    fontSize: 13,
    fontWeight: '600',
  },
  phoneChangeResendInactive: {
    color: '#999',
    fontSize: 13,
    fontWeight: '500',
  },
  phoneChangeButtonContainer: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 24,
  },
  phoneChangeButton: {
    flex: 1,
    paddingVertical: 13,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 3,
  },
  phoneChangeContinueButton: {
    backgroundColor: '#ffcf00',
  },
  phoneChangeCancelButton: {
    backgroundColor: '#ef4444',
  },
  phoneChangeButtonText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  newPhoneInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginVertical: 16,
  },
  countryCodeText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
    backgroundColor: '#f5f5f5',
    paddingHorizontal: 12,
    paddingVertical: 13,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ddd',
    minWidth: 50,
    textAlign: 'center',
  },
  newPhoneInput: {
    flex: 1,
    borderRadius: 10,
    height: 50,
    fontSize: 16,
    paddingHorizontal: 16,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ffcf00',
    color: '#000',
  },
});

export default Profile;
