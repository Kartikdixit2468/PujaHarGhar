import AsyncStorage from '@react-native-async-storage/async-storage';

/**
 * Save a value to AsyncStorage
 * @param {string} key - Storage key
 * @param {string} value - Value to store
 */
export const saveValue = async (key, value) => {
  try {
    await AsyncStorage.setItem(key, value);
  } catch (error) {
    console.error('Error saving value:', error);
    throw error;
  }
};

/**
 * Retrieve a value from AsyncStorage
 * @param {string} key - Storage key
 * @returns {Promise<string|null>} Stored value or null
 */
export const getValue = async (key) => {
  try {
    return await AsyncStorage.getItem(key);
  } catch (error) {
    console.error('Error retrieving value:', error);
    throw error;
  }
};

/**
 * Save authentication token
 * @param {string} token - Auth token
 */
export const saveToken = async (token) => {
  try {
    await AsyncStorage.setItem('authToken', token);
  } catch (error) {
    console.error('Error saving token:', error);
    throw error;
  }
};

/**
 * Get authentication token
 * @returns {Promise<string|null>} Auth token or null
 */
export const getToken = async () => {
  try {
    return await AsyncStorage.getItem('authToken');
  } catch (error) {
    console.error('Error retrieving token:', error);
    throw error;
  }
};

/**
 * Remove authentication token
 */
export const removeToken = async () => {
  try {
    await AsyncStorage.removeItem('authToken');
  } catch (error) {
    console.error('Error removing token:', error);
    throw error;
  }
};
