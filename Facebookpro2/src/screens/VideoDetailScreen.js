import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Share,
  Alert,
  PermissionsAndroid,
  ActivityIndicator
} from 'react-native';
import Video from 'react-native-video';
import Icon from 'react-native-vector-icons/Ionicons';
import RNFS from 'react-native-fs';
import { db, auth } from '../services/firebase';
import { ref, push, set, update } from 'firebase/database';

const VideoDetailScreen = ({ route, navigation }) => {
  const { video } = route.params;
  const [paused, setPaused] = useState(false);
  const [liked, setLiked] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [progress, setProgress] = useState(0);
  const videoRef = useRef(null);

  const formatNumber = (num) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num.toString();
  };

  const handleLike = async () => {
    setLiked(!liked);
    try {
      const videoRef = ref(db, `videos/${video.id}/likes`);
      const newLikes = (video.likes || 0) + (liked ? -1 : 1);
      await update(ref(db, `videos/${video.id}`), { likes: newLikes });
    } catch (error) {
      console.log('Error updating likes:', error);
    }
  };

  const requestStoragePermission = async () => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
        {
          title: 'Storage Permission',
          message: 'App needs storage permission to download videos',
          buttonNeutral: 'Ask Me Later',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        }
      );
      return granted === PermissionsAndroid.RESULTS.GRANTED;
    } catch (err) {
      return false;
    }
  };

  const handleDownload = async () => {
    try {
      const hasPermission = await requestStoragePermission();
      if (!hasPermission) {
        Alert.alert('Permission denied', 'Cannot download without storage permission');
        return;
      }

      setDownloading(true);
      
      // Random filename without username
      const fileName = `video_${Date.now()}_${Math.random().toString(36).substring(7)}.mp4`;
      const downloadPath = `${RNFS.DownloadDirectoryPath}/${fileName}`;

      const download = RNFS.downloadFile({
        fromUrl: video.url,
        toFile: downloadPath,
        progress: (res) => {
          const percent = (res.bytesWritten / res.contentLength) * 100;
          setProgress(percent);
        },
      });

      const result = await download.promise;
      
      if (result.statusCode === 200) {
        // Update download count
        await update(ref(db, `videos/${video.id}`), {
          downloads: (video.downloads || 0) + 1
        });

        // Save to downloads history
        const downloadData = {
          videoId: video.id,
          userId: auth.currentUser?.uid || 'anonymous',
          fileName: fileName,
          filePath: downloadPath,
          downloadedAt: Date.now(),
          status: 'completed'
        };

        const downloadsRef = ref(db, 'downloads');
        const newDownloadRef = push(downloadsRef);
        await set(newDownloadRef, downloadData);

        Alert.alert('Success', `Video downloaded as: ${fileName}`);
      }
    } catch (error) {
      Alert.alert('Error', 'Download failed: ' + error.message);
    } finally {
      setDownloading(false);
      setProgress(0);
    }
  };

  const handleShare = async () => {
    try {
      const result = await Share.share({
        title: 'Share Video',
        message: `Check out this video: ${video.title || 'Untitled'}`,
        url: video.url,
      });

      if (result.action === Share.sharedAction) {
        // Update share count
        await update(ref(db, `videos/${video.id}`), {
          shares: (video.shares || 0) + 1
        });
      }
    } catch (error) {
      Alert.alert('Error', error.message);
    }
  };

  return (
    <View style={styles.container}>
      {/* Video Player */}
      <View style={styles.videoContainer}>
        <Video
          ref={videoRef}
          source={{ uri: video.url }}
          style={styles.video}
          paused={paused}
          resizeMode="contain"
          repeat={false}
          controls={true}
        />
      </View>

      {/* Video Info */}
      <View style={styles.infoContainer}>
        <Text style={styles.title}>{video.title || 'Untitled Video'}</Text>
        
        <View style={styles.statsRow}>
          <View style={styles.stat}>
            <Icon name="eye" size={16} color="#65676B" />
            <Text style={styles.statText}>{formatNumber(video.views || 0)} views</Text>
          </View>
          <View style={styles.stat}>
            <Icon name="time" size={16} color="#65676B" />
            <Text style={styles.statText}>
              {Math.floor(video.duration / 60)}:{(video.duration % 60).toString().padStart(2, '0')}
            </Text>
          </View>
        </View>

        <Text style={styles.description}>
          {video.description || 'No description available.'}
        </Text>

        {/* Action Buttons */}
        <View style={styles.actions}>
          <TouchableOpacity style={styles.actionButton} onPress={handleLike}>
            <Icon 
              name={liked ? 'heart' : 'heart-outline'} 
              size={24} 
              color={liked ? '#E4405F' : '#65676B'} 
            />
            <Text style={styles.actionText}>{formatNumber(video.likes || 0)}</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionButton} onPress={handleDownload}>
            {downloading ? (
              <ActivityIndicator size="small" color="#1877F2" />
            ) : (
              <Icon name="download-outline" size={24} color="#65676B" />
            )}
            <Text style={styles.actionText}>
              {downloading ? `${Math.round(progress)}%` : formatNumber(video.downloads || 0)}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionButton} onPress={handleShare}>
            <Icon name="share-outline" size={24} color="#65676B" />
            <Text style={styles.actionText}>{formatNumber(video.shares || 0)}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  videoContainer: {
    width: '100%',
    height: 250,
    backgroundColor: '#000',
  },
  video: {
    width: '100%',
    height: '100%',
  },
  infoContainer: {
    flex: 1,
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    marginTop: -20,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1C1E21',
    marginBottom: 10,
  },
  statsRow: {
    flexDirection: 'row',
    marginBottom: 15,
  },
  stat: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 20,
  },
  statText: {
    fontSize: 14,
    color: '#65676B',
    marginLeft: 5,
  },
  description: {
    fontSize: 14,
    color: '#1C1E21',
    lineHeight: 20,
    marginBottom: 20,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 15,
    borderTopWidth: 1,
    borderTopColor: '#F0F2F5',
  },
  actionButton: {
    alignItems: 'center',
  },
  actionText: {
    fontSize: 12,
    color: '#65676B',
    marginTop: 3,
  },
});

export default VideoDetailScreen;