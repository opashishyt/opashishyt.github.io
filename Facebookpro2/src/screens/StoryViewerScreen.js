import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Dimensions
} from 'react-native';
import Video from 'react-native-video';
import Icon from 'react-native-vector-icons/Ionicons';

const { width, height } = Dimensions.get('window');

const StoryViewerScreen = ({ route, navigation }) => {
  const { story } = route.params;
  const [progress, setProgress] = useState(0);
  const [paused, setPaused] = useState(false);
  const videoRef = useRef(null);

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(timer);
          navigation.goBack();
          return 100;
        }
        return prev + 1;
      });
    }, story.duration ? story.duration / 100 : 100);

    return () => clearInterval(timer);
  }, []);

  const handleLongPress = () => {
    setPaused(true);
  };

  const handlePressOut = () => {
    setPaused(false);
  };

  const handleTap = (evt) => {
    const x = evt.nativeEvent.locationX;
    if (x < width / 2) {
      // Previous story - go back
      navigation.goBack();
    } else {
      // Next story - skip
      setProgress(100);
    }
  };

  return (
    <View style={styles.container}>
      {/* Progress Bar */}
      <View style={styles.progressContainer}>
        <View style={[styles.progressBar, { width: `${progress}%` }]} />
      </View>

      {/* User Info */}
      <View style={styles.userInfo}>
        <View style={styles.userAvatar}>
          <Text style={styles.avatarText}>
            {story.userName?.charAt(0).toUpperCase()}
          </Text>
        </View>
        <Text style={styles.userName}>{story.userName}</Text>
        <TouchableOpacity 
          style={styles.closeButton}
          onPress={() => navigation.goBack()}
        >
          <Icon name="close" size={24} color="white" />
        </TouchableOpacity>
      </View>

      {/* Story Media */}
      <TouchableOpacity
        style={styles.storyContainer}
        activeOpacity={1}
        onLongPress={handleLongPress}
        onPressOut={handlePressOut}
        onPress={handleTap}
      >
        {story.mediaType === 'video' ? (
          <Video
            ref={videoRef}
            source={{ uri: story.mediaUrl }}
            style={styles.media}
            paused={paused}
            resizeMode="contain"
            repeat={false}
          />
        ) : (
          <Image source={{ uri: story.mediaUrl }} style={styles.media} />
        )}
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  progressContainer: {
    position: 'absolute',
    top: 40,
    left: 10,
    right: 10,
    height: 3,
    backgroundColor: 'rgba(255,255,255,0.3)',
    zIndex: 10,
    borderRadius: 2,
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#1877F2',
    borderRadius: 2,
  },
  userInfo: {
    position: 'absolute',
    top: 60,
    left: 20,
    right: 20,
    flexDirection: 'row',
    alignItems: 'center',
    zIndex: 10,
  },
  userAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#1877F2',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  avatarText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  userName: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    flex: 1,
  },
  closeButton: {
    padding: 5,
  },
  storyContainer: {
    flex: 1,
  },
  media: {
    width: '100%',
    height: '100%',
  },
});

export default StoryViewerScreen;