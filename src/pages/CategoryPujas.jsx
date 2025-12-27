import React, { useEffect, useState } from 'react';
import {
  View,
  StyleSheet,
  Pressable,
  Text,
  ActivityIndicator,
  FlatList,
  Image,
  Dimensions,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import FAIcon from 'react-native-vector-icons/FontAwesome5';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SERVER_IP } from '@env';

const { width } = Dimensions.get('window');

const CategoryPujas = ({ route, navigation }) => {
  const { category } = route.params;
  const [pujas, setPujas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchCategoryPujas();
  }, []);

  const fetchCategoryPujas = async () => {
    try {
      setLoading(true);
      setError(null);

      const token = await AsyncStorage.getItem('authToken');

      if (!token) {
        setError('Authentication token not found');
        setLoading(false);
        return;
      }

      const response = await fetch(
        `${SERVER_IP}/api/client/pujas/bycategory/${category.id}`,
        {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      const data = await response.json();
      console.log('Category pujas response:', data);

      if (data.success && Array.isArray(data.data) && data.data.length > 0) {
        setPujas(data.data);
      } else if (Array.isArray(data.data) && data.data.length > 0) {
        setPujas(data.data);
      } else if (data.error === 'Dataset Empty' || !data.data || (Array.isArray(data.data) && data.data.length === 0)) {
        setPujas([]);
      } else {
        setError(data.message || 'Failed to fetch pujas');
      }
    } catch (err) {
      console.error('Error fetching category pujas:', err);
      setError(err.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const renderPujaCard = ({ item, index }) => (
    <Pressable
      style={styles.pujaCard}
      onPress={() => navigation.navigate('PujaPage', { id: item.puja_id })}
    >
      {/* Image Section */}
      <View style={styles.imageContainer}>
        {item.img1 ? (
          <Image
            source={{ uri: `${SERVER_IP}/uploads/pujas/${item.img1}` }}
            style={styles.pujaImage}
            resizeMode="cover"
          />
        ) : (
          <View style={[styles.pujaImage, styles.imagePlaceholder]}>
            <FAIcon name="om" size={40} color="#ffcf00" />
          </View>
        )}

        {/* Badge */}
        {item.is_date_assured && (
          <View style={styles.badge}>
            <FAIcon name="shield-alt" size={12} color="#fff" />
            <Text style={styles.badgeText}>Date Assured</Text>
          </View>
        )}
      </View>

      {/* Content Section */}
      <View style={styles.contentSection}>
        <Text style={styles.pujaName} numberOfLines={2}>
          {item.name}
        </Text>

        {/* Description */}
        {item.description && (
          <Text style={styles.description} numberOfLines={3}>
            {item.description}
          </Text>
        )}

        {/* Packages Badge */}
        <View style={styles.packagesBadge}>
          <FAIcon name="gift" size={12} color="#fff" />
          <Text style={styles.packagesText}>3 Packages</Text>
        </View>
      </View>

      {/* Arrow Button */}
      <View style={styles.arrowContainer}>
        <Icon name="chevron-right" size={24} color="#ffcf00" />
      </View>
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
            <Text style={styles.headerTitle}>{category.name}</Text>
            <Text style={styles.headerSubtitle}>Loading pujas...</Text>
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
          <Text style={styles.headerTitle}>{category.name}</Text>
          <Text style={styles.headerSubtitle}>{pujas.length} Pujas</Text>
        </View>
        <View style={{ width: 28 }} />
      </View>

      {/* Spiritual Banner */}
      <View style={styles.spiritualBanner}>
        <FAIcon name="om" size={18} color="#ff6b9d" />
        <Text style={styles.bannerText}>
          Select your preferred puja and proceed to booking
        </Text>
      </View>

      {/* Content */}
      {error && !pujas.length ? (
        <View style={styles.errorContainer}>
          <FAIcon name="exclamation-circle" size={50} color="#ef4444" />
          <Text style={styles.errorTitle}>Unable to Load</Text>
          <Text style={styles.errorSubtext}>{error}</Text>
          <Pressable style={styles.retryButton} onPress={fetchCategoryPujas}>
            <Icon name="refresh" size={20} color="#fff" />
            <Text style={styles.retryButtonText}>Try Again</Text>
          </Pressable>
        </View>
      ) : pujas.length === 0 ? (
        <View style={styles.emptyContainer}>
          <FAIcon name="inbox" size={50} color="#d1d5db" />
          <Text style={styles.emptyTitle}>No Pujas Available</Text>
          <Text style={styles.emptySubtext}>
            This category doesn't have any pujas yet. Please check back later.
          </Text>
        </View>
      ) : (
        <FlatList
          data={pujas}
          renderItem={({ item, index }) => renderPujaCard({ item, index })}
          keyExtractor={(item, index) => (item.id || index).toString()}
          contentContainerStyle={styles.listContent}
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
  },

  headerTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#000',
  },

  headerSubtitle: {
    fontSize: 12,
    color: '#6b7280',
    marginTop: 2,
  },

  spiritualBanner: {
    marginHorizontal: 16,
    marginTop: 14,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff6e7',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderLeftWidth: 4,
    borderLeftColor: '#ff6b9d',
    gap: 8,
  },

  bannerText: {
    fontSize: 12,
    color: '#92400e',
    fontWeight: '600',
    flex: 1,
    lineHeight: 16,
  },

  listContent: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },

  pujaCard: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 3,
    elevation: 2,
  },

  imageContainer: {
    position: 'relative',
    width: 100,
    height: 120,
  },

  pujaImage: {
    width: '100%',
    height: '100%',
  },

  imagePlaceholder: {
    backgroundColor: '#f3f4f6',
    justifyContent: 'center',
    alignItems: 'center',
  },

  badge: {
    position: 'absolute',
    top: 6,
    left: 6,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#10b981',
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 4,
    gap: 2,
  },

  badgeText: {
    fontSize: 9,
    color: '#fff',
    fontWeight: '600',
  },

  contentSection: {
    flex: 1,
    paddingHorizontal: 12,
    paddingVertical: 10,
    justifyContent: 'flex-start',
  },

  pujaName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#000',
    marginBottom: 6,
    lineHeight: 20,
  },

  priceSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 6,
  },

  price: {
    fontSize: 16,
    fontWeight: '700',
    color: '#ffcf00',
  },

  discountBadge: {
    backgroundColor: '#fef3c7',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },

  discountText: {
    fontSize: 10,
    color: '#ca8a04',
    fontWeight: '600',
  },

  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 4,
  },

  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },

  infoText: {
    fontSize: 11,
    color: '#6b7280',
    fontWeight: '500',
  },

  description: {
    fontSize: 12,
    color: '#9ca3af',
    lineHeight: 16,
    marginBottom: 8,
  },

  packagesBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ff6b9d',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 6,
    gap: 5,
    alignSelf: 'flex-start',
  },

  packagesText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#fff',
  },

  arrowContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingRight: 8,
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

export default CategoryPujas;
