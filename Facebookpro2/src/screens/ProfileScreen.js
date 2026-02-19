import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Switch,
  Alert,
  Linking
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { auth } from '../services/firebase';
import { SOCIAL_LINKS, APP_INFO, COLORS } from '../utils/constants';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ProfileScreen = ({ navigation }) => {
  const [user, setUser] = useState(null);
  const [darkMode, setDarkMode] = useState(false);
  const [downloadQuality, setDownloadQuality] = useState('480p');
  const [autoPlay, setAutoPlay] = useState(true);
  const [saveHistory, setSaveHistory] = useState(false);

  useEffect(() => {
    setUser(auth.currentUser);
    loadPreferences();
  }, []);

  const loadPreferences = async () => {
    try {
      const prefs = await AsyncStorage.getItem('userPreferences');
      if (prefs) {
        const parsed = JSON.parse(prefs);
        setDarkMode(parsed.darkMode || false);
        setDownloadQuality(parsed.downloadQuality || '480p');
        setAutoPlay(parsed.autoPlay !== false);
        setSaveHistory(parsed.saveHistory || false);
      }
    } catch (error) {
      console.log('Error loading preferences:', error);
    }
  };

  const savePreference = async (key, value) => {
    try {
      const prefs = await AsyncStorage.getItem('userPreferences');
      const currentPrefs = prefs ? JSON.parse(prefs) : {};
      currentPrefs[key] = value;
      await AsyncStorage.setItem('userPreferences', JSON.stringify(currentPrefs));
    } catch (error) {
      console.log('Error saving preference:', error);
    }
  };

  const toggleDarkMode = (value) => {
    setDarkMode(value);
    savePreference('darkMode', value);
    Alert.alert('Success', 'Theme changed. Restart app to see changes.');
  };

  const openLink = async (url) => {
    try {
      await Linking.openURL(url);
    } catch (error) {
      Alert.alert('Error', 'Cannot open link');
    }
  };

  const MenuItem = ({ icon, title, onPress, rightElement }) => (
    <TouchableOpacity style={styles.menuItem} onPress={onPress}>
      <View style={styles.menuLeft}>
        <Icon name={icon} size={22} color="#1877F2" />
        <Text style={styles.menuTitle}>{title}</Text>
      </View>
      {rightElement || <Icon name="chevron-forward" size={20} color="#999" />}
    </TouchableOpacity>
  );

  const SettingItem = ({ icon, title, value, onValueChange, type = 'switch' }) => (
    <View style={styles.settingItem}>
      <View style={styles.settingLeft}>
        <Icon name={icon} size={22} color="#1877F2" />
        <Text style={styles.settingTitle}>{title}</Text>
      </View>
      {type === 'switch' ? (
        <Switch
          value={value}
          onValueChange={onValueChange}
          trackColor={{ false: '#ddd', true: '#1877F2' }}
        />
      ) : (
        <TouchableOpacity onPress={() => Alert.alert('Select Quality', 'Coming soon')}>
          <Text style={styles.settingValue}>{value}</Text>
        </TouchableOpacity>
      )}
    </View>
  );

  return (
    <ScrollView style={styles.container}>
      {/* Profile Header */}
      <View style={styles.header}>
        <View style={styles.avatarContainer}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>
              {user?.uid ? user.uid.charAt(0).toUpperCase() : 'U'}
            </Text>
          </View>
        </View>
        <Text style={styles.userId}>
          User ID: {user?.uid ? user.uid.substring(0, 10) + '...' : 'Anonymous'}
        </Text>
        <Text style={styles.memberSince}>
          Member since: {new Date().toLocaleDateString()}
        </Text>
      </View>

      {/* Stats Cards */}
      <View style={styles.statsContainer}>
        <View style={styles.statCard}>
          <Icon name="eye" size={24} color="#1877F2" />
          <Text style={styles.statNumber}>0</Text>
          <Text style={styles.statLabel}>Stories Viewed</Text>
        </View>
        <View style={styles.statCard}>
          <Icon name="download" size={24} color="#42B72A" />
          <Text style={styles.statNumber}>0</Text>
          <Text style={styles.statLabel}>Downloads</Text>
        </View>
        <View style={styles.statCard}>
          <Icon name="share" size={24} color="#E4405F" />
          <Text style={styles.statNumber}>0</Text>
          <Text style={styles.statLabel}>Shares</Text>
        </View>
      </View>

      {/* Settings Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>⚙️ Settings</Text>
        
        <SettingItem
          icon="moon"
          title="Dark Mode"
          value={darkMode}
          onValueChange={toggleDarkMode}
        />

        <SettingItem
          icon="videocam"
          title="Auto-play Videos"
          value={autoPlay}
          onValueChange={setAutoPlay}
        />

        <SettingItem
          icon="download"
          title="Download Quality"
          value={downloadQuality}
          onValueChange={() => {}}
          type="select"
        />

        <SettingItem
          icon="history"
          title="Save History"
          value={saveHistory}
          onValueChange={setSaveHistory}
        />
      </View>

      {/* Developer Info */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>👨‍💻 Developer</Text>
        
        <MenuItem
          icon="logo-instagram"
          title="Instagram"
          onPress={() => openLink(SOCIAL_LINKS.instagram)}
        />
        
        <MenuItem
          icon="logo-whatsapp"
          title="WhatsApp Group"
          onPress={() => openLink(SOCIAL_LINKS.whatsapp)}
        />
        
        <MenuItem
          icon="paper-plane"
          title="Telegram"
          onPress={() => openLink(SOCIAL_LINKS.telegram)}
        />
        
        <MenuItem
          icon="globe"
          title="Website"
          onPress={() => openLink(SOCIAL_LINKS.website)}
        />
        
        <MenuItem
          icon="mail"
          title="Email"
          onPress={() => openLink(`mailto:${APP_INFO.email}`)}
        />
      </View>

      {/* App Info */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>ℹ️ App Info</Text>
        
        <MenuItem
          icon="information-circle"
          title="App Version"
          rightElement={<Text style={styles.versionText}>1.0.0</Text>}
          onPress={() => {}}
        />
        
        <MenuItem
          icon="lock-closed"
          title="Privacy Policy"
          onPress={() => Alert.alert('Privacy Policy', 'Coming soon...')}
        />
        
        <MenuItem
          icon="document-text"
          title="Terms of Service"
          onPress={() => Alert.alert('Terms of Service', 'Coming soon...')}
        />
        
        <MenuItem
          icon="star"
          title="Rate App"
          onPress={() => Alert.alert('Rate App', 'Coming soon...')}
        />
        
        <MenuItem
          icon="share"
          title="Share App"
          onPress={() => Alert.alert('Share', 'Coming soon...')}
        />
      </View>

      {/* Footer */}
      <View style={styles.footer}>
        <Text style={styles.footerText}>Made with ❤️ by OP Ashish YT</Text>
        <Text style={styles.copyright}>© 2024 All Rights Reserved</Text>
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
    backgroundColor: '#1877F2',
    padding: 30,
    alignItems: 'center',
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  avatarContainer: {
    marginBottom: 15,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#1877F2',
  },
  userId: {
    fontSize: 16,
    color: 'white',
    fontWeight: '600',
    marginBottom: 5,
  },
  memberSince: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.8)',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: -30,
    marginHorizontal: 20,
    marginBottom: 20,
  },
  statCard: {
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 12,
    alignItems: 'center',
    flex: 1,
    marginHorizontal: 5,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  statNumber: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1C1E21',
    marginTop: 5,
  },
  statLabel: {
    fontSize: 12,
    color: '#65676B',
    marginTop: 2,
  },
  section: {
    backgroundColor: 'white',
    marginHorizontal: 15,
    marginVertical: 10,
    padding: 15,
    borderRadius: 12,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1C1E21',
    marginBottom: 15,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F2F5',
  },
  menuLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  menuTitle: {
    fontSize: 16,
    marginLeft: 12,
    color: '#1C1E21',
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F2F5',
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  settingTitle: {
    fontSize: 16,
    marginLeft: 12,
    color: '#1C1E21',
  },
  settingValue: {
    fontSize: 14,
    color: '#1877F2',
    fontWeight: '600',
  },
  versionText: {
    fontSize: 14,
    color: '#65676B',
  },
  footer: {
    padding: 20,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 14,
    color: '#65676B',
  },
  copyright: {
    fontSize: 12,
    color: '#999',
    marginTop: 5,
  },
});

export default ProfileScreen;