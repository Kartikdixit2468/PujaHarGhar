import { OTPWidget } from '@msg91comm/sendotp-react-native';
import { SERVER_IP, TOKEN_AUTH_MSG91, PHONE_WIDGET_ID, EMAIL_WIDGET_ID  } from '@env';

// # fetch from the env file
const tokenAuth = '447695T9MQQ9m86807c6ffP1';
const PhoneWidgetId = '356476684d37333431323031';
const EmailWidgetId = '356476764375383138393037';

console.log("Using SERVER_IP in authService:", SERVER_IP);
console.log("Using TOKEN_AUTH_MSG91 in authService:", tokenAuth);
console.log("Using PHONE_WIDGET_ID in authService:", PhoneWidgetId);
console.log("Using EMAIL_WIDGET_ID in authService:", EmailWidgetId);

/**
 * Send OTP to phone number
 * @param {string} number - Phone number without country code
 * @returns {Promise<Object>} OTP response with type and message
 */
export const sendOTPPhone = async (number) => {
  console.log('Sending OTP to phone number:', number);
  try {
    OTPWidget.initializeWidget(PhoneWidgetId, tokenAuth);
    const data = {
      identifier: `91${number}`,
    };
    const otp_response = await OTPWidget.sendOTP(data);
    console.log('OTP send response:', otp_response);
    return otp_response;
    // return {
    //   type: 'success',
    //   message: 'mocked-message-id-1234',
    // }; // Temporarily bypassing OTP sending

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
    console.log('Phone OTP verification response:', responsePhoneOTP);
    return responsePhoneOTP;
    // return true; // Temporarily bypassing OTP verification
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
    console.log("Check User Exists Response at core function: ", user_exist);
    return user_exist;
  } catch (error) {
    console.error('Error checking if user exists:', error);
    throw error;
  }
};


/**
 * Check if user already exists
 * @param {string} email - User email
 * @param {string} phone - User phone number
 * @returns {Promise<Object>} Response with exist flag
 */

export const checkIfRegtrationAllowed = async (email, phone) => {
  try {
    const checkIfAllowed = await fetch(
      `${SERVER_IP}/api/client/check/register/user/manual`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: email, phone: phone }),
      }
    );
    const user_exist = await checkIfAllowed.json();
    console.log("Check if Registration Allowed Response at core function: ", user_exist);
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
export const loginUser = async (email, phone) => {
  try {
    const login = await fetch(`${SERVER_IP}/api/client/user/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email: email, phone: phone }),
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
      `${SERVER_IP}/api/client/register/user/manual`,
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
    console.log('SERVER_IP being used:', SERVER_IP);
    console.log('Registering user with Google data:', userData);
    
    userData = {...userData,
      e_verified: 1
    }
    
    const response = await fetch(`${SERVER_IP}/api/client/register/user`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
      timeout: 15000, // 15 second timeout
    });
    
    console.log('Google registration response status:', response.status);
    const data = await response.json();
    console.log('Google registration response:', data);
    return data;
  } catch (error) {
    console.error('Error registering with Google:', error);
    console.error('Error message:', error.message);
    console.error('Error stack:', error.stack);
    
    // Provide more detailed error information
    if (error.message.includes('Network request failed')) {
      console.error('❌ NETWORK ERROR: Cannot reach backend server');
      console.error('Check that:');
      console.error('1. Backend server is running');
      console.error('2. SERVER_IP in .env is correct:', SERVER_IP);
      console.error('3. Emulator/Device can reach the IP');
      console.error('4. Firewall is not blocking the port');
    }
    throw error;
  }
};

/**
 * Fetch user profile details
 * @param {string} token - Authentication token
 * @param {string} email - User email
 * @param {string} phone - User phone
 * @returns {Promise<Object>} User details object
 */
export const fetchUserDetails = async (token) => {
  try {
    // console.log('Fetching user details with email:', email, 'phone:', phone);
    const response = await fetch(`${SERVER_IP}/api/client/user/details/fetch`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      // body: JSON.stringify({
      //   email: email,
      //   phone: phone,
      // }),
    });

    console.log('Response status:', response.status);

    if (!response.ok) {
      throw new Error(`Server error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    console.log('User details fetched successfully:', data);
    return data;
  } catch (error) {
    console.error('Error fetching user details:', error);
    throw error;
  }
};

/**
 * Update user profile details
 * @param {string} token - Authentication token
 * @param {string} email - User email
 * @param {string} phone - User phone
 * @param {Object} userData - Updated user data object
 * @returns {Promise<Object>} Update response
 */
export const updateUserDetails = async (token, email, phone, userData) => {
  try {
    console.log('Updating user details:', userData);

    console.log("hereeeeeeeeeeeeee", JSON.stringify(userData))

    userData = {
      id: userData.id,
      address: userData.address,
      dob: userData.dob,
      email: userData.email,
      e_verified: userData.e_verified,  
      gender: userData.gender,
      name: userData.name,
      photo: userData.photo,
      profile_completed: userData.profile_completed,
    }

    const response = await fetch(`${SERVER_IP}/api/client/user/details/update`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(userData),
    });

    console.log('Update response status:', response.status);

    if (!response.ok) {
      throw new Error(`Server error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    console.log('User details updated successfully:', data);
    return data;
  } catch (error) {
    console.error('Error updating user details:', error);
    throw error;
  }
};
/**
 * Verify OTP with backend (for phone number change)
 * @param {string} token - Bearer token from authentication
 * @param {string} accessToken - Access token from OTP send response
 * @returns {Promise<Object>} Verification response
 */
export const verifyOTPWithBackend = async (token, accessToken) => {
  try {
    console.log('Verifying OTP with backend');
    const response = await fetch(`${SERVER_IP}/api/client/otp/verify`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({
        access_token: accessToken,
      }),
    });

    const data = await response.json();

    console.log('OTP verification response status:', response.status);
    console.log('OTP verification response ok:', data);

    if (!data.success) {
      throw new Error(`Server error: ${response.status} ${response.message}`);
    }

    console.log('OTP verified successfully:', data);
    return data;
  } catch (error) {
    console.error('Error verifying OTP with backend:', error);
    throw error;
  }
};

/**
 * Update phone number
 * @param {string} token - Bearer token from authentication
 * @param {string} newPhone - New phone number
 * @param {string} accessToken - Access token from OTP verification
 * @returns {Promise<Object>} Update response
 */
export const updatePhoneNumber = async (token, newPhone, accessToken) => {
  try {
    console.log('Updating phone number:', newPhone);
    const response = await fetch(`${SERVER_IP}/api/client/update/phone`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({
        new_phone: newPhone,
        access_token: accessToken,
      }),
    });

    console.log('Phone update response status:', response.status);
    console.log('Phone update response ok:', response);
    const data = await response.json();

    if (!data.success) {
      return data;
    }

    console.log('Phone number updated successfully:', data);
    return data;
  } catch (error) {
    console.error('Error updating phone number:', error);
    throw error;
  }
};

/**
 * Backend-based: Send OTP to phone number
 * @param {string} token - Bearer token from authentication
 * @param {string} phone - Phone number without country code
 * @returns {Promise<Object>} OTP response with session token in Details
 */
export const sendOTPBackend = async (phone) => {
  try {
    console.log('Sending OTP to phone via backend:', phone);
    const response = await fetch(`${SERVER_IP}/api/otp/send-otp`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        phone: phone,
      }),
    });

    console.log('OTP send response status:', response.status);

    const data = await response.json();
    console.log('OTP send response ok:', data);

    if (!data.success) {
      throw new Error(`Server error: ${response.status} ${response.statusText}`);
    }
    console.log('OTP sent successfully, session token:', data.token);
    return data;
  } catch (error) {
    console.error('Error sending OTP via backend:', error);
    throw error;
  }
};

/**
 * Backend-based: Verify OTP
 * @param {string} token - Bearer token from authentication
 * @param {string} otp - OTP entered by user
 * @param {string} sessionToken - Session token from send-otp response
 * @returns {Promise<Object>} Verification response
 */
export const verifyOTPBackend = async (otp, sessionToken) => {
  try {
    console.log('Verifying OTP via backend with session token:', sessionToken);
    const response = await fetch(`${SERVER_IP}/api/otp/verify-otp`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        otp: otp,
        session_token: sessionToken,
      }),
    });

    console.log('OTP verification response status:', response.status);

    if (!response.ok) {
      throw new Error(`Server error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    console.log('OTP verified successfully:', data);
    return data;
  } catch (error) {
    console.error('Error verifying OTP via backend:', error);
    throw error;
  }
};

/**
 * Backend-based: Update phone number with OTP verification
 * @param {string} token - Bearer token from authentication
 * @param {string} newPhone - New phone number
 * @param {string} sessionToken - Session token from OTP verification
 * @param {string} otp - OTP for phone change
 * @returns {Promise<Object>} Update response
 */
export const updatePhoneNumberBackend = async (token, newPhone, sessionToken, otp) => {
  try {
    console.log('Updating phone number via backend:', newPhone);
    const response = await fetch(`${SERVER_IP}/api/client/update/phone`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({
        phone: newPhone,
        session_token: sessionToken,
        otp: otp,
      }),
    });

    console.log('Phone update response status:', response.status);

    if (!response.ok) {
      throw new Error(`Server error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    console.log('Phone number updated successfully:', data);
    return data;
  } catch (error) {
    console.error('Error updating phone number via backend:', error);
    throw error;
  }
};