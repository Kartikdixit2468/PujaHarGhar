import React from 'react';
import { Pressable, StyleSheet, View, Text, Image } from 'react-native';
import { stickyWorkers } from '../../metro.config';
import { styles } from '../css/style';

const Profile = () => {
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
          style={styles.ProfileImg}
          source={require('../assets/images/profile_icon.png')}
        />
        <View style={styles.ProfileNameContainer}>
          <View style={styles.ProfileHeading}>
            <Text style={styles.ProfileName}>Shivam Dixit</Text>
            <View style={styles.NameUderline}></View>
            <Text style={styles.ProfileEmail}>shivamdixit246@gmail.com</Text>
          </View>
          <Pressable style={styles.NameEditBtnContainer}>
            <Image
              style={styles.NameEditBtn}
              source={require('../assets/images/edit.png')}
            />
          </Pressable>
        </View>
        <Pressable style={styles.ProfileEditButton}>
          <Text style={styles.ProfileEditButtonText}>Edit Profile</Text>
        </Pressable>
      </View>

      <View style={styles.DetailsSection}>
        <Text style={styles.DetailsSectionHeading}>Account Info</Text>
        <View style={styles.DetailsContainer}>
          <View style={styles.DetailsTextContainer}>
            <Text style={styles.DetailsHeadingText}>Name</Text>
            <Text style={styles.DetailsSubText}>Shivam Dixit</Text>
          </View>
          <View style={styles.DetailsTextContainer}>
            <Text style={styles.DetailsHeadingText}>Email</Text>
            <Text style={styles.DetailsSubText}>shivamdixit246@gmail.com</Text>
          </View>
          <View style={styles.DetailsTextContainer}>
            <Text style={styles.DetailsHeadingText}>Phone</Text>
            <Text style={styles.DetailsSubText}>+91 8929667423</Text>
          </View>
        </View>
      </View>
      <View style={styles.DetailsSection}>
        <Text style={styles.DetailsSectionHeading}>More Details</Text>
        <View style={styles.DetailsContainer}>
          <View style={styles.DetailsTextContainer}>
            <Text style={styles.DetailsHeadingText}>Address</Text>
            <Text style={styles.DetailsSubText}>
              208 Ratlam Kunj, Near By Gopeshwar Mahadev Temple, Vrindavan,
              281121
            </Text>
          </View>
          <View style={styles.DetailsTextContainer}>
            <Text style={styles.DetailsHeadingText}>Language</Text>
            <Text style={styles.DetailsSubText}>English</Text>
          </View>
          <View style={styles.DetailsTextContainer}>
            <Text style={styles.DetailsHeadingText}>Notifications</Text>
            <Text style={styles.DetailsSubText}>Allowed</Text>
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
});

export default Profile;
