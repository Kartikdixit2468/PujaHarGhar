import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  Pressable,
  ActivityIndicator,
  Alert,
  FlatList,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import FAIcon from 'react-native-vector-icons/FontAwesome5';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SERVER_IP } from '@env';

const Bookings = ({ navigation }) => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchAllBookings();
  }, []);

  const fetchAllBookings = async () => {
    try {
      setLoading(true);
      setError(null);

      const token = await AsyncStorage.getItem('authToken');
      const userEmail = await AsyncStorage.getItem('userEmail');
      const userPhone = await AsyncStorage.getItem('userPhone');

      console.log('Fetching bookings for:', userEmail, userPhone);

      if (!token) {
        setError('User credentials not found');
        Alert.alert('Error', 'Please log in again to view bookings.');
        setLoading(false);
        return;
      }

      const response = await fetch(`${SERVER_IP}/api/client/bookings/getall/`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: userEmail,
          phone: userPhone,
        }),
      });

      const data = await response.json();
      console.log('Bookings response:', data);

      if (data.success && data.bookings) {
        setBookings(data.bookings);
      } else {
        setError(data.message || 'Failed to fetch bookings');
      }
    } catch (err) {
      console.error('Error fetching bookings:', err);
      setError(err.message || 'An error occurred while fetching bookings');
    } finally {
      setLoading(false);
    }
  };

  const handleBookingPress = (booking) => {
    navigation.navigate('BookingDetail', { booking });
  };

  const getStatusColor = (isConfirmed) => {
    // return isConfirmed ? '#10b981' : '#f59e0b';
    if (isConfirmed === 1) return '#10b981'; // Confirmed - Green
    if (isConfirmed === 0) return '#f59e0b'; // Pending - Yellow
    if (isConfirmed === -1) return '#ef4444'; // Cancelled - Red
  };

  const getStatusText = (isConfirmed) => {
    if (isConfirmed === 1) return 'Confirmed';
    if (isConfirmed === 0) return 'Pending';
    if (isConfirmed === -1) return 'Cancelled';
  };

  const getStatusIcon = (isConfirmed) => {
    // confirm pending and cancelled
    if (isConfirmed === 1) return 'check-circle';
    if (isConfirmed === 0) return 'clock';
    if (isConfirmed === -1) return 'times-circle';
  };

  const renderBookingCard = ({ item }) => {
    const bookingDate = new Date(item.date);
    const formattedDate = bookingDate.toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
    const formattedTime = bookingDate.toLocaleTimeString('en-IN', {
      hour: '2-digit',
      minute: '2-digit',
    });

    return (
      <Pressable
        style={styles.bookingCard}
        onPress={() => handleBookingPress(item)}
      >
        <View style={styles.cardHeader}>
          <View style={styles.bookingInfo}>
            <Text style={styles.packageName}>{item.name}</Text>
            <View style={styles.dateTimeContainer}>
              <Icon name="event" size={14} color="#6b7280" />
              <Text style={styles.dateTimeText}>{formattedDate}</Text>
              <Icon name="schedule" size={14} color="#6b7280" style={{ marginLeft: 8 }} />
              <Text style={styles.dateTimeText}>{formattedTime}</Text>
            </View>
          </View>
          <Text style={styles.price}>₹{item.price}</Text>
        </View>

        <View style={styles.cardFooter}>
          <View style={styles.statusBadge}>
            <FAIcon
              name={getStatusIcon(item.is_confirmed)}
              size={14}
              color={getStatusColor(item.is_confirmed)}
            />
            <Text style={[styles.statusText, { color: getStatusColor(item.is_confirmed) }]}>
              {getStatusText(item.is_confirmed)}
            </Text>
          </View>

          {item.is_date_assured && (
            <View style={styles.assuredBadge}>
              <FAIcon name="shield-alt" size={14} color="#ffcf00" />
              <Text style={styles.assuredText}>Date Assured</Text>
            </View>
          )}

          <Icon name="chevron-right" size={24} color="#ff6b9d" />
        </View>
      </Pressable>
    );
  };

  const renderEmptyState = () => (
    <View style={styles.emptyContainer}>
      <FAIcon name="calendar" size={60} color="#d1d5db" />
      <Text style={styles.emptyTitle}>No Bookings Yet</Text>
      <Text style={styles.emptySubtext}>
        You haven't booked any pujas yet. Start by exploring our puja categories!
      </Text>
      <Pressable
        style={styles.exploreButton}
        onPress={() => navigation.navigate('Home')}
      >
        <Text style={styles.exploreButtonText}>Explore Pujas</Text>
      </Pressable>
    </View>
  );

  const renderErrorState = () => (
    <View style={styles.errorContainer}>
      <FAIcon name="exclamation-circle" size={50} color="#ef4444" />
      <Text style={styles.errorTitle}>Unable to Load Bookings</Text>
      <Text style={styles.errorSubtext}>{error}</Text>
      <Pressable style={styles.retryButton} onPress={fetchAllBookings}>
        <Icon name="refresh" size={20} color="#fff" />
        <Text style={styles.retryButtonText}>Try Again</Text>
      </Pressable>
    </View>
  );

  if (loading) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color="#ffcf00" />
        <Text style={styles.loadingText}>Loading your bookings...</Text>
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
        <Text style={styles.headerTitle}>My Bookings</Text>
        <View style={{ width: 28 }} />
      </View>

      {/* Content */}
      {error ? (
        renderErrorState()
      ) : bookings.length === 0 ? (
        renderEmptyState()
      ) : (
        <>
          <View style={styles.bookingCountContainer}>
            <Text style={styles.bookingCount}>
              {bookings.length} {bookings.length === 1 ? 'Booking' : 'Bookings'}
            </Text>
          </View>
          <FlatList
            data={bookings}
            renderItem={renderBookingCard}
            keyExtractor={(item) => item.booking_id.toString()}
            scrollEnabled={false}
            contentContainerStyle={styles.listContent}
          />
        </>
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
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#000',
  },

  bookingCountContainer: {
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: '#fff',
  },
  bookingCount: {
    fontSize: 14,
    color: '#6b7280',
    fontWeight: '500',
  },

  listContent: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  bookingCard: {
    backgroundColor: '#fff',
    borderRadius: 14,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    overflow: 'hidden',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingHorizontal: 14,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  bookingInfo: {
    flex: 1,
  },
  packageName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#000',
    marginBottom: 8,
  },
  dateTimeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  dateTimeText: {
    fontSize: 12,
    color: '#6b7280',
    marginRight: 8,
  },
  price: {
    fontSize: 20,
    fontWeight: '700',
    color: '#ffcf00',
  },

  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 12,
    backgroundColor: '#f9f7f9',
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 6,
    backgroundColor: '#fff',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
  },

  assuredBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 6,
    backgroundColor: '#fff6e7',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#fcd34d',
  },
  assuredText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#ca8a04',
  },

  // Empty State
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#000',
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#6b7280',
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 20,
  },
  exploreButton: {
    backgroundColor: '#ffcf00',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 10,
  },
  exploreButtonText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#000',
  },

  // Error State
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
    marginTop: 12,
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

  // Loading
  loadingText: {
    marginTop: 12,
    fontSize: 14,
    color: '#6b7280',
  },
});

export default Bookings;
