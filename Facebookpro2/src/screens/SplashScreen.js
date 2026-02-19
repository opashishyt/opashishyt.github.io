import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  Animated,
  Easing
} from 'react-native';
import { COLORS } from '../utils/constants';

const SplashScreen = ({ navigation }) => {
  const fadeAnim = new Animated.Value(0);
  const scaleAnim = new Animated.Value(0.5);

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 1000,
        easing: Easing.elastic(1),
        useNativeDriver: true,
      })
    ]).start();

    // Navigate to Home after 3 seconds
    setTimeout(() => {
      navigation.replace('Home');
    }, 3000);
  }, []);

  return (
    <View style={styles.container}>
      <Animated.View
        style={[
          styles.logoContainer,
          {
            opacity: fadeAnim,
            transform: [{ scale: scaleAnim }]
          }
        ]}
      >
        <View style={styles.logo}>
          <Text style={styles.logoText}>FB</Text>
          <Text style={styles.logoTextPro}>PRO 2</Text>
        </View>
        <Text style={styles.appName}>Facebook Pro 2</Text>
        <Text style={styles.tagline}>Stories • Videos • Downloads</Text>
      </Animated.View>

      <Animated.View style={[styles.footer, { opacity: fadeAnim }]}>
        <Text style={styles.developer}>by OP Ashish YT</Text>
        <View style={styles.socialIcons}>
          <Text style={styles.socialIcon}>📱</Text>
          <Text style={styles.socialIcon}>📸</Text>
          <Text style={styles.socialIcon}>📨</Text>
        </View>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoContainer: {
    alignItems: 'center',
  },
  logo: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  logoText: {
    fontSize: 60,
    fontWeight: 'bold',
    color: 'white',
  },
  logoTextPro: {
    fontSize: 30,
    fontWeight: 'bold',
    color: 'rgba(255,255,255,0.9)',
    marginLeft: 5,
  },
  appName: {
    fontSize: 24,
    fontWeight: '600',
    color: 'white',
    marginTop: 10,
  },
  tagline: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.8)',
    marginTop: 5,
  },
  footer: {
    position: 'absolute',
    bottom: 30,
    alignItems: 'center',
  },
  developer: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.7)',
    marginBottom: 10,
  },
  socialIcons: {
    flexDirection: 'row',
  },
  socialIcon: {
    fontSize: 20,
    marginHorizontal: 10,
    color: 'white',
  },
});

export default SplashScreen;