import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Button, Dimensions } from 'react-native';
import { Gyroscope } from 'expo-sensors';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from 'react-native-reanimated';

const { width, height } = Dimensions.get('window');

const BallMazeApp: React.FC = () => {
  const [isLarge, setIsLarge] = useState(false);
  const size = useSharedValue(isLarge ? width * 0.3 : width * 0.1);
  const positionX = useSharedValue(width / 2 - size.value / 2);
  const positionY = useSharedValue(height / 2 - size.value / 2);

  useEffect(() => {
    Gyroscope.addListener((gyroscopeData) => {
      positionX.value += gyroscopeData.x * 2;
      positionY.value += gyroscopeData.y * 2;

      // Ensure ball stays within screen bounds
      positionX.value = Math.max(0, Math.min(width - size.value, positionX.value));
      positionY.value = Math.max(0, Math.min(height - size.value, positionY.value));
    });

    return () => {
      Gyroscope.removeAllListeners();
    };
  }, []);

  const ballStyle = useAnimatedStyle(() => ({
    width: size.value,
    height: size.value,
    borderRadius: size.value / 2,
    backgroundColor: 'blue',
    transform: [{ translateX: withSpring(positionX.value) }, { translateY: withSpring(positionY.value) }],
  }));

  const toggleSize = () => {
    setIsLarge((prev) => !prev);
  };

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.ball, ballStyle]} />
      <Button title={isLarge ? 'Switch to Small' : 'Switch to Large'} onPress={toggleSize} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
  },
  ball: {
    position: 'absolute',
  },
});

export default BallMazeApp;