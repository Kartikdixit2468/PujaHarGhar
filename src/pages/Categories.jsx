import React, { useEffect, useState } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  Dimensions,
  Pressable,
  Text,
  ActivityIndicator,
  FlatList,
  ImageBackground,
  Image,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import FAIcon from 'react-native-vector-icons/FontAwesome5';
import { SERVER_IP } from '@env';
import AsyncStorage from '@react-native-async-storage/async-storage';

const width = Dimensions.get('window').width;

const Categories = ({ navigation }) => {
  const [pujaCategories, setPujaCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchPujaCategories();
  }, []);

  const fetchPujaCategories = async () => {
    try {
      setLoading(true);
      setError(null);
      const token = await AsyncStorage.getItem('authToken');

      const response = await fetch(`${SERVER_IP}/api/client/pujas/Category`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();
      if (data.success) {
        setPujaCategories(data.data);
      } else {
        setError(data.message || 'Failed to fetch categories');
      }
    } catch (error) {
      console.error('Error fetching puja categories:', error);
      setError(error.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const getCategoryColor = (index) => {
    const colors = [
      '#ff6b9d', // Pink
      '#ffcf00', // Yellow
      '#10b981', // Green
      '#f59e0b', // Orange
      '#3b82f6', // Blue
      '#8b5cf6', // Purple
      '#ec4899', // Rose
      '#06b6d4', // Cyan
    ];
    return colors[index % colors.length];
  };

  const renderCategoryCard = ({ item, index }) => (
    <Pressable
      style={styles.categoryCard}
      onPress={() => navigation.navigate('CategoryPujas', { category: item })}
    >
      {item.image ? (
        
        <ImageBackground
          source={{ uri: `${SERVER_IP}/uploads/category/${item.image}` }}
          style={styles.categoryImageBg}
          imageStyle={{ borderRadius: 12 }}
        >
          <View style={styles.categoryOverlay}>
            <Text style={styles.categoryName}>{item.name}</Text>
            <View style={styles.categoryFooter}>
              <Text style={styles.categoryCount}>{item.count || '0'} Pujas</Text>
              <View style={[styles.arrowButton, { backgroundColor: getCategoryColor(index) }]}>
                <Icon name="arrow-forward" size={16} color="#fff" />
              </View>
            </View>
          </View>
        </ImageBackground>
      ) : (
        <View
          style={[
            styles.categoryImageBg,
            { backgroundColor: getCategoryColor(index) + '20' },
          ]}
        >
          <View style={styles.categoryOverlay}>
            <View
              style={[
                styles.categoryIconLarge,
                { backgroundColor: getCategoryColor(index) },
              ]}
            >
              <FAIcon name="om" size={32} color="#fff" />
            </View>
            <Text style={styles.categoryName}>{item.name}</Text>
            <View style={styles.categoryFooter}>
              <Text style={styles.categoryCount}>{item.count || '0'} Pujas</Text>
              <View style={[styles.arrowButton, { backgroundColor: getCategoryColor(index) }]}>
                <Icon name="arrow-forward" size={16} color="#fff" />
              </View>
            </View>
          </View>
        </View>
      )}
    </Pressable>
  );

  if (loading) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Pressable onPress={() => navigation.goBack()}>
            <Icon name="arrow-back" size={28} color="#000" />
          </Pressable>
          <View style={styles.headerContent}>
            <FAIcon name="om" size={24} color="#ffcf00" />
            <Text style={styles.headerTitle}>Puja Categories</Text>
          </View>
          <View style={{ width: 28 }} />
        </View>
        <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
          <ActivityIndicator size="large" color="#ffcf00" />
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Pressable onPress={() => navigation.goBack()}>
          <Icon name="arrow-back" size={28} color="#000" />
        </Pressable>
        <View style={styles.headerContent}>
          <FAIcon name="om" size={24} color="#ffcf00" />
          <Text style={styles.headerTitle}>Puja Categories</Text>
        </View>
        <View style={{ width: 28 }} />
      </View>

      {/* Spiritual Banner */}
      <View style={styles.spiritualBanner}>
        <FAIcon name="hands" size={20} color="#ff6b9d" />
        <Text style={styles.bannerText}>
          Discover sacred pujas tailored for your spiritual journey
        </Text>
      </View>

      {/* Categories Grid */}
      {error && !pujaCategories.length ? (
        <View style={styles.errorContainer}>
          <FAIcon name="exclamation-circle" size={50} color="#ef4444" />
          <Text style={styles.errorTitle}>Unable to Load</Text>
          <Text style={styles.errorSubtext}>{error}</Text>
          <Pressable style={styles.retryButton} onPress={fetchPujaCategories}>
            <Icon name="refresh" size={20} color="#fff" />
            <Text style={styles.retryButtonText}>Try Again</Text>
          </Pressable>
        </View>
      ) : pujaCategories.length === 0 ? (
        <View style={styles.emptyContainer}>
          <FAIcon name="inbox" size={50} color="#d1d5db" />
          <Text style={styles.emptyTitle}>No Categories</Text>
          <Text style={styles.emptySubtext}>
            No puja categories available at the moment
          </Text>
        </View>
      ) : (
        <FlatList
          data={pujaCategories}
          renderItem={({ item, index }) => renderCategoryCard({ item, index })}
          keyExtractor={(item, index) => (item.id || index).toString()}
          contentContainerStyle={styles.listContent}
          numColumns={2}
          columnWrapperStyle={styles.columnWrapper}
          scrollEnabled={true}
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9f7f9',
  },

  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
    paddingTop: 20,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },

  headerContent: {
    alignItems: 'center',
    gap: 6,
  },

  headerTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#000',
  },

  spiritualBanner: {
    marginHorizontal: 16,
    marginTop: 16,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff6e7',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#ff6b9d',
    gap: 10,
  },

  bannerText: {
    fontSize: 12,
    color: '#92400e',
    fontWeight: '600',
    flex: 1,
    lineHeight: 16,
  },

  listContent: {
    paddingHorizontal: 12,
    paddingVertical: 16,
  },

  columnWrapper: {
    justifyContent: 'space-between',
    marginBottom: 12,
  },

  categoryCard: {
    width: (width - 56) / 2,
    height: 240,
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 5,
    elevation: 5,
  },

  categoryImageBg: {
    flex: 1,
    justifyContent: 'space-between',
    paddingBottom: 0,
  },

  categoryOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 14,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
  },

  categoryIconLarge: {
    width: 44,
    height: 44,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
  },

  categoryName: {
    fontSize: 20,
    fontWeight: '800',
    color: '#fff',
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
    marginBottom: 16,
    letterSpacing: 0.5,
  },

  categoryFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    marginTop: 'auto',
  },

  categoryCount: {
    fontSize: 11,
    color: '#fff',
    fontWeight: '600',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },

  arrowButton: {
    width: 28,
    height: 28,
    borderRadius: 6,
    justifyContent: 'center',
    alignItems: 'center',
  },

  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },

  errorTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#000',
    marginTop: 16,
    marginBottom: 8,
  },

  errorSubtext: {
    fontSize: 13,
    color: '#6b7280',
    textAlign: 'center',
    marginBottom: 24,
  },

  retryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ff6b9d',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 10,
    gap: 8,
  },

  retryButtonText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#fff',
  },

  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },

  emptyTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#000',
    marginTop: 16,
    marginBottom: 8,
  },

  emptySubtext: {
    fontSize: 13,
    color: '#6b7280',
    textAlign: 'center',
  },
});

export default Categories;
