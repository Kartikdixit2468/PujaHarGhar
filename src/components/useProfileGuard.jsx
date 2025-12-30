import { Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../context/AuthContext';

export const useProfileGuard = () => {
  const { profileCompleted } = useAuth();
  const navigation = useNavigation();

  const guard = () => {
    if (!profileCompleted) {
      Alert.alert(
        'Complete Profile',
        'Please complete your profile first to continue'
      );
      navigation.navigate('Profile');
      return false;
    }
    return true;
  };

  return guard;
};
