import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Image,
  StyleSheet,
  Alert
} from 'react-native';
import { db, auth } from '../services/firebase';
import { ref, onValue, push, set } from 'firebase/database';
import * as ImagePicker from 'react-native-image-picker';

const StoriesScreen = ({ navigation }) => {
  const [stories, setStories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Stories fetch from Firebase
    const storiesRef = ref(db, 'stories');
    const unsubscribe = onValue(storiesRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const storiesList = Object.keys(data).map(key => ({
          id: key,
          ...data[key]
        }));
        // Filter active stories (24 hours)
        const now = Date.now();
        const activeStories = storiesList.filter(
          story => story.expiryTime > now
        );
        setStories(activeStories);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const createStory = () => {
    ImagePicker.launchImageLibrary({
      mediaType: 'mixed',
      quality: 0.8,
    }, (response) => {
      if (response.assets) {
        const storyData = {
          userId: auth.currentUser?.uid || 'anonymous',
          userName: 'User_' + Math.random().toString(36).substring(7),
          mediaUrl: response.assets[0].uri,
          mediaType: response.assets[0].type.includes('video') ? 'video' : 'image',
          createdAt: Date.now(),
          expiryTime: Date.now() + 86400000, // 24 hours
          views: 0
        };

        const storiesRef = ref(db, 'stories');
        const newStoryRef = push(storiesRef);
        set(newStoryRef, storyData)
          .then(() => Alert.alert('Success', 'Story uploaded!'))
          .catch(error => Alert.alert('Error', error.message));
      }
    });
  };

  const viewStory = (story) => {
    navigation.navigate('StoryViewer', { story });
  };

  const renderStory = ({ item }) => (
    <TouchableOpacity style={styles.storyCard} onPress={() => viewStory(item)}>
      <Image source={{ uri: item.mediaUrl }} style={styles.storyImage} />
      <View style={styles.storyOverlay}>
        <View style={styles.userInfo}>
          <View style={styles.userAvatar}>
            <Text style={styles.avatarText}>
              {item.userName?.charAt(0).toUpperCase()}
            </Text>
          </View>
          <Text style={styles.userName}>{item.userName}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Stories</Text>
        <TouchableOpacity style={styles.addButton} onPress={createStory}>
          <Text style={styles.addButtonText}>+ Add Story</Text>
        </TouchableOpacity>
      </View>

      {stories.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No stories available</Text>
          <Text style={styles.emptySubText}>Add a story to get started</Text>
        </View>
      ) : (
        <FlatList
          data={stories}
          renderItem={renderStory}
          keyExtractor={item => item.id}
          numColumns={2}
          contentContainerStyle={styles.storiesGrid}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F0F2F5',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#E4E6EB',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1877F2',
  },
  addButton: {
    backgroundColor: '#1877F2',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
  },
  addButtonText: {
    color: 'white',
    fontWeight: '600',
  },
  storiesGrid: {
    padding: 8,
  },
  storyCard: {
    flex: 1,
    margin: 8,
    height: 200,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: 'white',
    elevation: 3,
  },
  storyImage: {
    width: '100%',
    height: '100%',
  },
  storyOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 10,
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  userAvatar: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#1877F2',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  avatarText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 14,
  },
  userName: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#65676B',
  },
  emptySubText: {
    fontSize: 14,
    color: '#999',
    marginTop: 5,
  },
});

export default StoriesScreen;