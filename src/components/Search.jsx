import { faKey } from '@fortawesome/free-solid-svg-icons';
import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Svg, { G, Path } from 'react-native-svg';

const Search = ({ route, navigation }) => {
  const { page } = route.params;
  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.backArrow}
        onPress={() => {
          navigation.navigate(page);
        }}
      >
        {' '}
        <Icon name="arrow-back" size={32} color="#8a8a8a" />
      </TouchableOpacity>
      <View style={styles.group}>
        <Svg
          style={styles.icon}
          viewBox="0 0 24 24"
          width={22}
          height={22}
          fill="#9e9ea7"
        >
          <G>
            <Path d="M21.53 20.47l-3.66-3.66C19.195 15.24 20 13.214 20 11c0-4.97-4.03-9-9-9s-9 4.03-9 9 4.03 9 9 9c2.215 0 4.24-.804 5.808-2.13l3.66 3.66c.147.146.34.22.53.22s.385-.073.53-.22c.295-.293.295-.767.002-1.06zM3.5 11c0-4.135 3.365-7.5 7.5-7.5s7.5 3.365 7.5 7.5-3.365 7.5-7.5 7.5-7.5-3.365-7.5-7.5z" />
          </G>
        </Svg>
        <TextInput
          style={styles.input}
          placeholder="Search"
          placeholderTextColor="#9e9ea7"
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 5,
    paddingTop: 15,
    display: 'flex',
    flexDirection: 'row',
    // borderWidth: 2,
    gap: 5,
  },
  group: {
    flexDirection: 'row',
    alignItems: 'center',
    position: 'relative',
    backgroundColor: '#f3f3f4',
    borderRadius: 8,
    paddingHorizontal: 16,
    height: 50,
    width: '90%',
    borderWidth: 1,
    borderColor: '#8a8a8a',
  },
  icon: {
    position: 'absolute',
    left: 16,
    top: 12,
  },
  input: {
    flex: 1,
    height: '100%',
    paddingLeft: 32,
    color: '#0d0c22',
  },
  backArrow: {
    padding: 4,
    paddingHorizontal: 10,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#8a8a8a',
    borderRadius: 10,
  },
});

export default Search;
