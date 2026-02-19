import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Linking,
  Alert
} from 'react-native';
import { SOCIAL_LINKS, COLORS, APP_INFO } from '../utils/constants';
import { signInAnonymous } from '../services/firebase';

const HomeScreen = ({ navigation }) => {
  useEffect(() => {
    // Anonymous sign in on app start
    signInAnonymous();
  }, []);

  const openLink = async (url, type) => {
    try {
      const supported = await Linking.canOpenURL(url);
      if (supported) {
        await Linking.openURL(url);
      } else {
        Alert.alert('Error', `Cannot open ${type} link`);
      }
    } catch (error) {
      Alert.alert('Error', 'Something went wrong');
    }
  };

  const SocialCard = ({ icon, title, username, url, color }) => (
    <TouchableOpacity
      style={[styles.socialCard, { backgroundColor: color }]}
      onPress={() => openLink(url, title)}
    >
      <View style={styles.socialIcon}>
        <Text style={styles.iconText}>{icon}</Text>
      </View>
      <View style={styles.socialInfo}>
        <Text style={styles.socialTitle}>{title}</Text>
        <Text style={styles.socialUsername}>{username}</Text>
      </View>
    </TouchableOpacity>
  );

  const FeatureCard = ({ title, icon, onPress }) => (
    <TouchableOpacity style={styles.featureCard} onPress={onPress}>
      <Text style={styles.featureIcon}>{icon}</Text>
      <Text style={styles.featureTitle}>{title}</Text>
    </TouchableOpacity>
  );

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Image
          source={require('../assets/logo.png')}
          style={styles.logo}
        />
        <Text style={styles.appName}>Facebook Pro 2</Text>
        <Text style={styles.version}>Version 1.0.0</Text>
      </View>

      {/* Developer Info */}
      <View style={styles.devCard}>
        <Text style={styles.devName}>👨‍💻 OP Ashish YT</Text>
        <TouchableOpacity onPress={() => openLink(`mailto:${APP_INFO.email}`)}>
          <Text style={styles.devEmail}>{APP_INFO.email}</Text>
        </TouchableOpacity>
      </View>

      {/* Features Section */}
      <Text style={styles.sectionTitle}>📱 App Features</Text>
      <View style={styles.featuresGrid}>
        <FeatureCard
          title="Stories"
          icon="📸"
          onPress={() => navigation.navigate('Stories')}
        />
        <FeatureCard
          title="Videos"
          icon="🎥"
          onPress={() => navigation.navigate('Videos')}
        />
        <FeatureCard
          title="Downloads"
          icon="⬇️"
          onPress={() => navigation.navigate('Downloads')}
        />
        <FeatureCard
          title="Profile"
          icon="👤"
          onPress={() => navigation.navigate('Profile')}
        />
      </View>

      {/* Social Links Section */}
      <Text style={styles.sectionTitle}>🌐 Connect With Us</Text>
      
      <SocialCard
        icon="📱"
        title="WhatsApp Group"
        username="Join Group"
        url={SOCIAL_LINKS.whatsapp}
        color={COLORS.whatsapp}
      />
      
      <SocialCard
        icon="📸"
        title="Instagram"
        username="@_op_ashiah_yt__"
        url={SOCIAL_LINKS.instagram}
        color={COLORS.instagram}
      />
      
      <SocialCard
        icon="📨"
        title="Telegram"
        username="OP Ashish YT Channel"
        url={SOCIAL_LINKS.telegram}
        color={COLORS.telegram}
      />
      
      <SocialCard
        icon="🌐"
        title="Website"
        username="ashish-microbiologiat.github.io"
        url={SOCIAL_LINKS.website}
        color={COLORS.website}
      />
      
      <SocialCard
        icon="📧"
        title="Email"
        username={APP_INFO.email}
        url={`mailto:${APP_INFO.email}`}
        color="#EA4335"
      />

      {/* Footer */}
      <View style={styles.footer}>
        <Text style={styles.footerText}>
          Made with ❤️ by OP Ashish YT
        </Text>
        <Text style={styles.footerSubText}>
          © 2024 All Rights Reserved
        </Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F0F2F5',
  },
  header: {
    backgroundColor: COLORS.primary,
    padding: 30,
    alignItems: 'center',
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  logo: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'white',
    marginBottom: 10,
  },
  appName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },
  version: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.8)',
    marginTop: 5,
  },
  devCard: {
    backgroundColor: 'white',
    margin: 15,
    padding: 15,
    borderRadius: 12,
    alignItems: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  devName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  devEmail: {
    fontSize: 14,
    color: COLORS.darkGray,
    marginTop: 5,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 15,
    marginTop: 10,
    marginBottom: 10,
    color: '#1C1E21',
  },
  featuresGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 10,
    justifyContent: 'space-between',
  },
  featureCard: {
    backgroundColor: 'white',
    width: '48%',
    padding: 20,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 10,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  featureIcon: {
    fontSize: 32,
    marginBottom: 10,
  },
  featureTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1C1E21',
  },
  socialCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    marginHorizontal: 15,
    marginVertical: 5,
    padding: 15,
    borderRadius: 12,
    elevation: 2,
  },
  socialIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  iconText: {
    fontSize: 24,
    color: 'white',
  },
  socialInfo: {
    flex: 1,
  },
  socialTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
  },
  socialUsername: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.9)',
    marginTop: 2,
  },
  footer: {
    padding: 20,
    alignItems: 'center',
    marginTop: 20,
  },
  footerText: {
    fontSize: 14,
    color: COLORS.darkGray,
  },
  footerSubText: {
    fontSize: 12,
    color: '#999',
    marginTop: 5,
  },
});

export default HomeScreen;