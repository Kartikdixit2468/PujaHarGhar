import { OTPWidget } from '@msg91comm/sendotp-react-native';
import { SERVER_IP } from '@env';

const tokenAuth = '447695T9MQQ9m86807c6ffP1';
const PhoneWidgetId = '356476684d37333431323031';
const EmailWidgetId = '356476764375383138393037';

/**
 * Send OTP to phone number
 * @param {string} number - Phone number without country code
 * @returns {Promise<Object>} OTP response with type and message
 */
export const sendOTPPhone = async (number) => {
  try {
    OTPWidget.initializeWidget(PhoneWidgetId, tokenAuth);
    const data = {
      identifier: `91${number}`,
    };
    const otp_response = await OTPWidget.sendOTP(data);
    return otp_response;
  } catch (error) {
    console.error('Error sending OTP to phone:', error);
    throw error;
  }
};

/**
 * Send verification email with link
 * @param {string} email - Email address
 * @returns {Promise<Object>} API response
 */
export const sendVerificationMail = async (email) => {
  try {
    // TODO: Implement email verification link sending
    // This will be handled later on the backend
    console.log('Sending verification email to:', email);
    // Placeholder response
    return {
      success: true,
      message: 'Verification email sent',
    };
  } catch (error) {
    console.error('Error sending verification email:', error);
    throw error;
  }
};

/**
 * Verify phone OTP
 * @param {string} phoneOTP - 4-digit OTP
 * @param {string} messageIDPhone - Message ID from OTP send response
 * @returns {Promise<boolean>} True if OTP is valid
 */
export const verifyPhoneOTP = async (phoneOTP, messageIDPhone) => {
  try {
    OTPWidget.initializeWidget(PhoneWidgetId, tokenAuth);
    const body_phone = {
      reqId: messageIDPhone,
      otp: phoneOTP,
    };
    const responsePhoneOTP = await OTPWidget.verifyOTP(body_phone);
    return responsePhoneOTP.type === 'success';
  } catch (error) {
    console.error('Error verifying phone OTP:', error);
    return false;
  }
};

/**
 * Check if user already exists
 * @param {string} email - User email
 * @param {string} phone - User phone number
 * @returns {Promise<Object>} Response with exist flag
 */

export const checkUserExists = async (email, phone) => {
  try {
    const checkIfUserExist = await fetch(
      `${SERVER_IP}/api/client/user/existing/check`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: email, phone: phone }),
      }
    );
    const user_exist = await checkIfUserExist.json();
    return user_exist;
  } catch (error) {
    console.error('Error checking if user exists:', error);
    throw error;
  }
};

/**
 * Login existing user
 * @param {string} email - User email
 * @returns {Promise<Object>} Login response with token and success flag
 */
export const loginUser = async (email) => {
  try {
    const login = await fetch(`${SERVER_IP}/api/client/user/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email: email }),
    });
    const login_response = await login.json();
    return login_response;
  } catch (error) {
    console.error('Error logging in user:', error);
    throw error;
  }
};

/**
 * Register new user with manual signup
 * @param {Object} userData - User data object
 * @returns {Promise<Object>} Registration response with token and success flag
 */
export const registerUserManual = async (userData) => {
  try {
    const response = await fetch(
      `${SERVER_IP}/api/client/register/user/mannual`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      }
    );
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error registering user:', error);
    throw error;
  }
};

/**
 * Register user with Google Sign-In
 * @param {Object} userData - User data from Google
 * @returns {Promise<Object>} Registration response with token and success flag
 */
export const registerUserGoogle = async (userData) => {
  try {
    const response = await fetch(`${SERVER_IP}/api/client/register/user`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error registering with Google:', error);
    throw error;
  }
};
