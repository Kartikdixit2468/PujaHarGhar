// DotsLoader.js
import React from 'react';
import { View, StyleSheet } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSequence,
  withTiming,
  withDelay,
  withRepeat,
} from 'react-native-reanimated';

const Dot = ({ delay }) => {
  const scale = useSharedValue(0.8);

  React.useEffect(() => {
    scale.value = withDelay(
      delay,
      withRepeat(
        withSequence(
          withTiming(1.2, { duration: 750 }),
          withTiming(0.8, { duration: 750 })
        ),
        -1, // repeat forever
        true // reverse on each loop
      )
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }],
    };
  });

  return (
    <Animated.View style={[styles.dot, animatedStyle]} />
  );
};

const DotsLoader = () => {
  const delays = [0, 150, 300, 500, 700];

  return (
    <View style={styles.container}>
      {delays.map((delay, idx) => (
        <Dot key={idx} delay={delay} />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
    width: '100%',
  },
  dot: {
    width: 20,
    height: 20,
    marginRight: 10,
    borderRadius: 10,
    backgroundColor: '#ffcf00',
  },
});

export default DotsLoader;
