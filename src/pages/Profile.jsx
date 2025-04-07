import React from 'react';
import { Pressable, StyleSheet, View, Text } from 'react-native';
import { stickyWorkers } from '../../metro.config';
import { styles } from '../css/style';

const Profile = () => {
  return (
    <View>
      <View style={styles.profile_icons}></View>

      <View style={styles.profile_icons}></View>

      <View style={styles.profile_main_section}>
        <View style={styles.ProfileImg}></View>
        <View style={styles.ProfileNameContainer}>
          <View style={styles.ProfileHeading}>
            <View style={styles.ProfileName}></View>
            <View style={styles.NameUderline}></View>
            <View style={styles.ProfileEmail}></View>
          </View>
          <Pressable style={styles.NameEditButton}></Pressable>
        </View>
        <Pressable style={styles.ProfileEditButton}></Pressable>
      </View>

      <View style={styles.AccountDetailsSection}>
        <Text>Account Info</Text>
        <View style={styles.DetailsContainer}></View>
      </View>
      <View style={styles.MoreDetailsSection}>
        <Text>More Details</Text>
        <View style={styles.DetailsContainer}></View>
      </View>
    </View>
  );
};

const LocalStyles = StyleSheet.create({});

export default Profile;
