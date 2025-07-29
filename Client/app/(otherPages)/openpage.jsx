import React, { useEffect, useState } from 'react';
import {
  Dimensions,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import Login from "../../src/components/loginpage.jsx";
import Signup from "../../src/components/signuppage.jsx";

const screenWidth = Dimensions.get('window').width;

export default function OpenPage() {
  const [active, setActive] = useState('login');
  const loginOpacity = useSharedValue(1);
  const signupOpacity = useSharedValue(0);

  useEffect(() => {
    loginOpacity.value = withTiming(active === 'login' ? 1 : 0, { duration: 300 });
    signupOpacity.value = withTiming(active === 'signup' ? 1 : 0, { duration: 300 });
  }, [active]);

  const animatedLoginStyle = useAnimatedStyle(() => ({
    backgroundColor: `rgba(185,28,28,${loginOpacity.value})`,
  }));

  const animatedSignupStyle = useAnimatedStyle(() => ({
    backgroundColor: `rgba(185,28,28,${signupOpacity.value})`,
  }));

  return (
    <SafeAreaView  contentContainerStyle={styles.scrollContainer}>
      <View style={styles.mainBox}>
        <View style={styles.contentBox}>
          {
            active === 'login'?<Login/>:<Signup/>
          }
          

          <View style={styles.buttonContainer}>
            <Animated.View style={[styles.button, animatedLoginStyle]}>
              <TouchableOpacity
                style={styles.touch}
                onPress={() => setActive('login')}
              >
                <Text style={styles.text}>LogIn</Text>
              </TouchableOpacity>
            </Animated.View>

            <Animated.View style={[styles.button, animatedSignupStyle]}>
              <TouchableOpacity
                style={styles.touch}
                onPress={() => setActive('signup')}
              >
                <Text style={styles.text}>SignUp</Text>
              </TouchableOpacity>
            </Animated.View>
          </View>
        </View>
      </View>
    </SafeAreaView >
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    display: 'block',
    flex: 1,
    backgroundColor: '#000', // black background
    justifyContent: 'center',
    height:"100vh",
    width: '100vw',
  },
  mainBox: {
    alignItems: 'center',
    padding: 20, 
  },

  contentBox: {
    width: screenWidth * 0.9, // 90% of screen width
    minHeight: 700, // Minimum height for the content box
    borderWidth: 2,
    borderColor: 'white',
    borderRadius: 20,
    padding: 16,
    backgroundColor: '#000',
    alignItems: 'center',
  },
  buttonContainer: {
    marginTop: 20,
    flexDirection: 'row',
    width: '100%',
    gap: 12,
  },
  button: {
    flex: 1,
    borderWidth: 1,
    borderColor: 'white',
    borderRadius: 16,
  },
  touch: {
    paddingVertical: 12,
    alignItems: 'center',
  },
  text: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
});
