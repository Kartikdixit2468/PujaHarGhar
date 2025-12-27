import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  TextInput,
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

const Search = ({ route, navigation }) => {
  const { page } = route.params;
  const [searchQuery, setSearchQuery] = useState('');
  const [allCategories, setAllCategories] = useState([]);
  const [allPujas, setAllPujas] = useState([]);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState('all'); // all, pujas, categories

  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    try {
      setLoading(true);
      const token = await AsyncStorage.getItem('authToken');

      // Fetch Categories
      const catResponse = await fetch(`${SERVER_IP}/api/client/pujas/Category`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      const catData = await catResponse.json();
      if (catData.success) {
        setAllCategories(catData.data);
      }

      // Fetch All Pujas
      const pujaResponse = await fetch(`${SERVER_IP}/api/client/pujas/all/`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      const pujaData = await pujaResponse.json();
      if (Array.isArray(pujaData.data)) {
        setAllPujas(pujaData.data);
      } else if (pujaData.success && Array.isArray(pujaData.data)) {
        setAllPujas(pujaData.data);
      }
    } catch (err) {
      console.error('Error fetching data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (text) => {
    setSearchQuery(text);

    if (text.trim().length === 0) {
      setResults([]);
      return;
    }

    const query = text.toLowerCase();

    // Search in categories
    const categoryMatches = allCategories.filter(cat =>
      cat.name.toLowerCase().includes(query)
    );

    // Search in pujas
    const pujaMatches = allPujas
      .filter(puja =>
        puja.name.toLowerCase().includes(query) ||
        (puja.description && puja.description.toLowerCase().includes(query))
      )
      .map(p => {
        // Find category name for this puja
        const category = allCategories.find(cat => cat.id === p.category_id);
        return {
          ...p,
          categoryName: category?.name || 'Unknown Category',
          categoryId: p.category_id,
        };
      });

    // Combine results
    const combined = [
      ...categoryMatches.map(c => ({ ...c, type: 'category' })),
      ...pujaMatches.map(p => ({ ...p, type: 'puja' })),
    ];

    setResults(combined);
  };

  const getFilteredResults = () => {
    if (activeFilter === 'all') return results;
    return results.filter(r => r.type === activeFilter);
  };

  const renderResultItem = ({ item }) => {
    if (item.type === 'category') {
      return (
        <TouchableOpacity
          style={styles.resultCard}
          onPress={() => {
            navigation.navigate('CategoryPujas', { category: item });
          }}
        >
          <View style={styles.resultImage}>
            {item.image ? (
              <Image
                source={{ uri: `${SERVER_IP}/uploads/category/${item.image}` }}
                style={styles.resultImageContent}
              />
            ) : (
              <View style={styles.imagePlaceholder}>
                <FAIcon name="om" size={24} color="#ffcf00" />
              </View>
            )}
          </View>
          <View style={styles.resultContent}>
            <View style={styles.resultHeader}>
              <Text style={styles.resultTitle}>{item.name}</Text>
              <View style={styles.categoryBadge}>
                <Text style={styles.badgeText}>Category</Text>
              </View>
            </View>
            <Text style={styles.resultMeta}>{item.count || 0} Pujas</Text>
          </View>
          <Icon name="chevron-right" size={24} color="#ffcf00" />
        </TouchableOpacity>
      );
    }

    // Puja Result
    return (
      <TouchableOpacity
        style={styles.resultCard}
        onPress={() => {
          navigation.navigate('PujaPage', { id: item.puja_id });
        }}
      >
        <View style={styles.resultImage}>
          {item.img1 ? (
            <Image
              source={{ uri: `${SERVER_IP}/uploads/pujas/${item.img1}` }}
              style={styles.resultImageContent}
            />
          ) : (
            <View style={styles.imagePlaceholder}>
              <FAIcon name="om" size={24} color="#ffcf00" />
            </View>
          )}
        </View>
        <View style={styles.resultContent}>
          <Text style={styles.resultTitle} numberOfLines={2}>
            {item.name}
          </Text>
          <Text style={styles.resultMeta}>{item.categoryName}</Text>
          {item.description && (
            <Text style={styles.resultDescription} numberOfLines={1}>
              {item.description}
            </Text>
          )}
        </View>
        <Icon name="chevron-right" size={24} color="#ffcf00" />
      </TouchableOpacity>
    );
  };

  const filteredResults = getFilteredResults();

  return (
    <View style={styles.container}>
      {/* Header with back and search */}
      <View style={styles.headerContainer}>
        <TouchableOpacity
          style={styles.backArrow}
          onPress={() => navigation.navigate(page)}
        >
          <Icon name="arrow-back" size={28} color="#000" />
        </TouchableOpacity>
        <View style={styles.searchGroup}>
          <Icon name="search" size={20} color="#6b7280" style={styles.searchIcon} />
          <TextInput
            style={styles.input}
            placeholder="Search pujas or categories..."
            placeholderTextColor="#9ca3af"
            value={searchQuery}
            onChangeText={handleSearch}
            autoFocus
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <Icon name="close" size={20} color="#6b7280" />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Filter Tabs */}
      {searchQuery.length > 0 && (
        <View style={styles.filterContainer}>
          <TouchableOpacity
            style={[
              styles.filterTab,
              activeFilter === 'all' && styles.filterTabActive,
            ]}
            onPress={() => setActiveFilter('all')}
          >
            <Text
              style={[
                styles.filterText,
                activeFilter === 'all' && styles.filterTextActive,
              ]}
            >
              All ({results.length})
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.filterTab,
              activeFilter === 'puja' && styles.filterTabActive,
            ]}
            onPress={() => setActiveFilter('puja')}
          >
            <Text
              style={[
                styles.filterText,
                activeFilter === 'puja' && styles.filterTextActive,
              ]}
            >
              Pujas ({results.filter(r => r.type === 'puja').length})
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.filterTab,
              activeFilter === 'category' && styles.filterTabActive,
            ]}
            onPress={() => setActiveFilter('category')}
          >
            <Text
              style={[
                styles.filterText,
                activeFilter === 'category' && styles.filterTextActive,
              ]}
            >
              Categories ({results.filter(r => r.type === 'category').length})
            </Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Results */}
      {loading ? (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color="#ffcf00" />
        </View>
      ) : searchQuery.length === 0 ? (
        <View style={styles.emptyContainer}>
          <FAIcon name="search" size={50} color="#d1d5db" />
          <Text style={styles.emptyTitle}>Search for Pujas</Text>
          <Text style={styles.emptySubtext}>
            Find your perfect puja by name, category, or description
          </Text>
        </View>
      ) : filteredResults.length === 0 ? (
        <View style={styles.emptyContainer}>
          <FAIcon name="inbox" size={50} color="#d1d5db" />
          <Text style={styles.emptyTitle}>No Results Found</Text>
          <Text style={styles.emptySubtext}>
            Try searching for different keywords or browse all categories
          </Text>
        </View>
      ) : (
        <FlatList
          data={filteredResults}
          renderItem={renderResultItem}
          keyExtractor={(item, index) => `${item.type}-${item.id || index}`}
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

  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 12,
    paddingTop: 16,
    backgroundColor: '#fff',
    gap: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },

  backArrow: {
    padding: 8,
  },

  searchGroup: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f3f4f6',
    borderRadius: 10,
    paddingHorizontal: 12,
    height: 44,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },

  searchIcon: {
    marginRight: 8,
  },

  input: {
    flex: 1,
    height: '100%',
    color: '#000',
    fontSize: 14,
  },

  filterContainer: {
    flexDirection: 'row',
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
    gap: 8,
  },

  filterTab: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    backgroundColor: '#f3f4f6',
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },

  filterTabActive: {
    backgroundColor: '#ff6b9d',
    borderColor: '#ff6b9d',
  },

  filterText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#6b7280',
  },

  filterTextActive: {
    color: '#fff',
  },

  listContent: {
    paddingHorizontal: 12,
    paddingVertical: 12,
  },

  resultCard: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 10,
    overflow: 'hidden',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 3,
    elevation: 2,
    paddingRight: 8,
  },

  resultImage: {
    width: 90,
    height: 90,
    backgroundColor: '#f3f4f6',
  },

  resultImageContent: {
    width: '100%',
    height: '100%',
  },

  imagePlaceholder: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f3f4f6',
  },

  resultContent: {
    flex: 1,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },

  resultHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
  },

  resultTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#000',
    flex: 1,
  },

  categoryBadge: {
    backgroundColor: '#ffcf00',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },

  badgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#000',
  },

  resultMeta: {
    fontSize: 12,
    color: '#6b7280',
    fontWeight: '500',
    marginBottom: 2,
  },

  resultDescription: {
    fontSize: 11,
    color: '#9ca3af',
    lineHeight: 14,
  },

  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
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
    lineHeight: 18,
  },
});

export default Search;
