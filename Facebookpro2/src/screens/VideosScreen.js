import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  TextInput,
  ActivityIndicator
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { db } from '../services/firebase';
import { ref, onValue } from 'firebase/database';
import Video from 'react-native-video';

const VideosScreen = ({ navigation }) => {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  useEffect(() => {
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
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const categories = [
    { id: 'all', name: 'All', icon: 'apps' },
    { id: 'trending', name: 'Trending', icon: 'flame' },
    { id: 'new', name: 'New', icon: 'newspaper' },
    { id: 'music', name: 'Music', icon: 'musical-notes' },
    { id: 'comedy', name: 'Comedy', icon: 'happy' },
    { id: 'education', name: 'Education', icon: 'school' },
  ];

  const filterVideos = () => {
    let filtered = videos;

    if (searchQuery) {
      filtered = filtered.filter(video => 
        video.title?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (selectedCategory !== 'all') {
      filtered = filtered.filter(video => 
        video.category === selectedCategory
      );
    }

    return filtered;
  };

  const renderVideoItem = ({ item }) => (
    <TouchableOpacity 
      style={styles.videoCard}
      onPress={() => navigation.navigate('VideoDetail', { video: item })}
    >
      <Image source={{ uri: item.thumbnail }} style={styles.thumbnail} />
      <View style={styles.durationBadge}>
        <Text style={styles.durationText}>
          {Math.floor(item.duration / 60)}:{(item.duration % 60).toString().padStart(2, '0')}
        </Text>
      </View>
      <View style={styles.videoInfo}>
        <Text style={styles.videoTitle} numberOfLines={2}>
          {item.title || 'Untitled Video'}
        </Text>
        <View style={styles.videoStats}>
          <View style={styles.statItem}>
            <Icon name="eye" size={14} color="#65676B" />
            <Text style={styles.statText}>{item.views || 0}</Text>
          </View>
          <View style={styles.statItem}>
            <Icon name="heart" size={14} color="#65676B" />
            <Text style={styles.statText}>{item.likes || 0}</Text>
          </View>
          <View style={styles.statItem}>
            <Icon name="download" size={14} color="#65676B" />
            <Text style={styles.statText}>{item.downloads || 0}</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );

  const renderCategoryItem = ({ item }) => (
    <TouchableOpacity
      style={[
        styles.categoryItem,
        selectedCategory === item.id && styles.categoryItemActive
      ]}
      onPress={() => setSelectedCategory(item.id)}
    >
      <Icon 
        name={item.icon} 
        size={20} 
        color={selectedCategory === item.id ? '#1877F2' : '#65676B'} 
      />
      <Text 
        style={[
          styles.categoryName,
          selectedCategory === item.id && styles.categoryNameActive
        ]}
      >
        {item.name}
      </Text>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#1877F2" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <Icon name="search" size={20} color="#65676B" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search videos..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholderTextColor="#999"
        />
        {searchQuery ? (
          <TouchableOpacity onPress={() => setSearchQuery('')}>
            <Icon name="close-circle" size={20} color="#65676B" />
          </TouchableOpacity>
        ) : null}
      </View>

      {/* Categories */}
      <FlatList
        horizontal
        data={categories}
        renderItem={renderCategoryItem}
        keyExtractor={item => item.id}
        showsHorizontalScrollIndicator={false}
        style={styles.categoriesList}
        contentContainerStyle={styles.categoriesContent}
      />

      {/* Videos Grid */}
      <FlatList
        data={filterVideos()}
        renderItem={renderVideoItem}
        keyExtractor={item => item.id}
        numColumns={2}
        contentContainerStyle={styles.videosGrid}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Icon name="videocam" size={60} color="#ccc" />
            <Text style={styles.emptyText}>No videos found</Text>
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    margin: 15,
    paddingHorizontal: 15,
    borderRadius: 25,
    elevation: 2,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 12,
    fontSize: 16,
    color: '#1C1E21',
  },
  categoriesList: {
    maxHeight: 50,
    marginBottom: 10,
  },
  categoriesContent: {
    paddingHorizontal: 15,
  },
  categoryItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 8,
    marginRight: 10,
    borderRadius: 20,
    backgroundColor: 'white',
    elevation: 1,
  },
  categoryItemActive: {
    backgroundColor: '#E7F3FF',
  },
  categoryName: {
    marginLeft: 5,
    fontSize: 14,
    color: '#65676B',
  },
  categoryNameActive: {
    color: '#1877F2',
    fontWeight: '600',
  },
  videosGrid: {
    padding: 10,
  },
  videoCard: {
    flex: 1,
    margin: 5,
    backgroundColor: 'white',
    borderRadius: 10,
    overflow: 'hidden',
    elevation: 2,
  },
  thumbnail: {
    width: '100%',
    height: 120,
    resizeMode: 'cover',
  },
  durationBadge: {
    position: 'absolute',
    top: 5,
    right: 5,
    backgroundColor: 'rgba(0,0,0,0.7)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  durationText: {
    color: 'white',
    fontSize: 11,
    fontWeight: '600',
  },
  videoInfo: {
    padding: 8,
  },
  videoTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: '#1C1E21',
    marginBottom: 5,
  },
  videoStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statText: {
    fontSize: 11,
    color: '#65676B',
    marginLeft: 3,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 50,
  },
  emptyText: {
    fontSize: 16,
    color: '#999',
    marginTop: 10,
  },
});

export default VideosScreen;