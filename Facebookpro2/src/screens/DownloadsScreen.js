import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Alert,
  PermissionsAndroid
} from 'react-native';
import RNFS from 'react-native-fs';
import { db, auth } from '../services/firebase';
import { ref, onValue, push, set } from 'firebase/database';

const DownloadsScreen = () => {
  const [downloads, setDownloads] = useState([]);
  const [videos, setVideos] = useState([]);

  useEffect(() => {
    // Fetch available videos
    const videosRef = ref(db, 'videos');
    const unsubscribe = onValue(videosRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const videosList = Object.keys(data).map(key => ({
          id: key,
          ...data[key]
        }));
        setVideos(videosList);
      }
    });

    return () => unsubscribe();
  }, []);

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

  const downloadVideo = async (video) => {
    try {
      const hasPermission = await requestStoragePermission();
      if (!hasPermission) {
        Alert.alert('Permission denied', 'Cannot download without storage permission');
        return;
      }

      // Random filename without username
      const fileName = `video_${Date.now()}_${Math.random().toString(36).substring(7)}.mp4`;
      const downloadPath = `${RNFS.DownloadDirectoryPath}/${fileName}`;

      const download = RNFS.downloadFile({
        fromUrl: video.url,
        toFile: downloadPath,
        progress: (res) => {
          console.log('Progress:', (res.bytesWritten / res.contentLength) * 100);
        },
      });

      const result = await download.promise;
      
      if (result.statusCode === 200) {
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
    }
  };

  const renderVideo = ({ item }) => (
    <View style={styles.videoCard}>
      <View style={styles.videoInfo}>
        <Text style={styles.videoTitle}>{item.title || 'Untitled'}</Text>
        <Text style={styles.videoDuration}>
          {Math.floor(item.duration / 60)}:{item.duration % 60} mins
        </Text>
      </View>
      <TouchableOpacity
        style={styles.downloadButton}
        onPress={() => downloadVideo(item)}
      >
        <Text style={styles.downloadButtonText}>Download</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Video Downloader</Text>
        <Text style={styles.headerSubtitle}>Download without username</Text>
      </View>

      <FlatList
        data={videos}
        renderItem={renderVideo}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.list}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No videos available</Text>
          </View>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F0F2F5',
  },
  header: {
    backgroundColor: '#1877F2',
    padding: 20,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: 'white',
  },
  headerSubtitle: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.8)',
    marginTop: 5,
  },
  list: {
    padding: 15,
  },
  videoCard: {
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    elevation: 2,
  },
  videoInfo: {
    flex: 1,
  },
  videoTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1C1E21',
  },
  videoDuration: {
    fontSize: 14,
    color: '#65676B',
    marginTop: 3,
  },
  downloadButton: {
    backgroundColor: '#42B72A',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 5,
  },
  downloadButtonText: {
    color: 'white',
    fontWeight: '600',
  },
  emptyContainer: {
    padding: 30,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: '#65676B',
  },
});

export default DownloadsScreen;