import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, TouchableOpacity, View ,Dimensions} from 'react-native';
import { Gyroscope } from 'expo-sensors';
import { Subscription } from 'expo-sensors/build/Pedometer';
import { SafeAreaView } from 'react-native-safe-area-context';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from 'react-native-reanimated';

export default function App() {
  const [{ x, y, z }, setData] = useState({
    x: 0,
    y: 0,
    z: 0,
  });

  const [isLarge, setIsLarge] = useState(false);
  const [subscription, setSubscription] = useState<Subscription | null>(null); // Specify type explicitly
  const [ballPosition, setBallPosition] = useState({x: 0,y: 0,z: 0});
  const {width, height} = Dimensions.get('window');
  const size = useSharedValue(isLarge ? width * 0.4 : width * 0.1);


  const _subscribe = () => {
    const newSubscription = Gyroscope.addListener(gyroscopeData => {
      setData(gyroscopeData);
      setBallPosition(prevPositioin => ({
        x: prevPositioin.x - gyroscopeData.y * 2,
        y: prevPositioin.y + gyroscopeData.x * 2,
        z: 0,
      }));
    });
    setSubscription(newSubscription);
  };

  const _unsubscribe = () => {
    subscription && subscription.remove();
    setSubscription(null);
  };

  const ballStyle = useAnimatedStyle(() => ({
    width: size.value,
    height: size.value,
    borderRadius: size.value / 2,
    top: height / 2 - 110,
    left: width /2 - 30,
    transform: [{ translateX: withSpring(ballPosition.x) }, { translateY: withSpring(ballPosition.y) }],
  }));

  const toggleSize = () => {
    setIsLarge((prev) => !prev);
  };

  useEffect(() => {
    _subscribe();
    return () => _unsubscribe();
  }, []); // Make sure to include subscription in dependency array to unsubscribe properly

  return (
 
    <SafeAreaView style={styles.container}>
      <View style={styles.buttonContainer}>
        <TouchableOpacity  onPress={toggleSize} style={[styles.button, styles.middleButton]}>
          <Text>{isLarge ? 'Switch to Small' : 'Switch to Large'}</Text>
        </TouchableOpacity>
      </View>
      <Animated.View style={[styles.bubble, ballStyle]} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 10,
  },
  text: {
    textAlign: 'center',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
    top:0
  },
  bubble: {
    width: 60,
    height: 60,
    borderRadius:30,
    position: 'absolute',
    backgroundColor: 'rgba(205, 10, 85, 1)',
    shadowColor: 'rgba(255, 255, 255, 0.6)',
    shadowOffset: {
      width: 1,
      height: 1
    },
    shadowOpacity: 1,
    shadowRadius: 30
  },
  button: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#eee',
    bottom: 0,
    padding: 10,
  },
  middleButton: {
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderColor: '#ccc',
    width:45
  },
});