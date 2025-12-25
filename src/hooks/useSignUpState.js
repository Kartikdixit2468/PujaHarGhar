import { useState, useEffect } from 'react';

/**
 * Custom hook to manage signup state and logic
 * @returns {Object} Signup state and handlers
 */
export const useSignUpState = () => {
  // Sign stage and loader
  const [signUpStage, setSignUpStage] = useState(0);
  const [DisplayDotLoader, setDisplayDotLoader] = useState(false);

  // Stage 0: Email and Phone
  const [email, setEmail] = useState('kartikdixit2468@gmail.com');
  const [number, setNumber] = useState('9342496564');
  const countryCode = '+91';

  // Stage 1: OTP Verification (Phone Only)
  const [PhoneOTP, setPhoneOTP] = useState(null);
  const [resendActive, setResendActive] = useState(false);
  const [resendTimer, setResendTimer] = useState(10);
  let resendInterval = null;

  // Stage 2: User Details
  const [isChecked, setIsChecked] = useState(false);
  const [firstName, setFirstName] = useState(null);
  const [lastName, setLastName] = useState(null);
  const [birth, setBirth] = useState(null);
  const [showGenderPicker, setShowGenderPicker] = useState(false);
  const [gender, setGender] = useState('');
  const [showPicker, setShowPicker] = useState(false);

  /**
   * Start resend OTP timer
   */
  const startResendTimer = () => {
    setResendActive(false);
    setResendTimer(10);

    resendInterval = setInterval(() => {
      setResendTimer((prev) => {
        if (prev <= 1) {
          clearInterval(resendInterval);
          setResendActive(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  /**
   * Reset to stage 0
   */
  const resetToStage0 = () => {
    setSignUpStage(0);
    setResendActive(false);
    clearInterval(resendInterval);
  };

  /**
   * Reset form for new signup attempt
   */
  const resetForm = () => {
    setEmail('');
    setNumber('');
    setPhoneOTP(null);
    setFirstName(null);
    setLastName(null);
    setBirth(null);
    setGender('');
    setIsChecked(false);
    setSignUpStage(0);
  };

  return {
    // Stage and loader
    signUpStage,
    setSignUpStage,
    DisplayDotLoader,
    setDisplayDotLoader,

    // Stage 0
    email,
    setEmail,
    number,
    setNumber,
    countryCode,

    // Stage 1
    PhoneOTP,
    setPhoneOTP,
    resendActive,
    setResendActive,
    resendTimer,
    setResendTimer,

    // Stage 2
    isChecked,
    setIsChecked,
    firstName,
    setFirstName,
    lastName,
    setLastName,
    birth,
    setBirth,
    showGenderPicker,
    setShowGenderPicker,
    gender,
    setGender,
    showPicker,
    setShowPicker,

    // Utilities
    startResendTimer,
    resetToStage0,
    resetForm,
  };
};
