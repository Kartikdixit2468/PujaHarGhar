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
import Config from 'react-native-config';

const SERVER_IP = Config.SERVER_IP;
const MyTickets = ({ navigation }) => {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchTickets();
  }, []);

  const fetchTickets = async () => {
    try {
      setLoading(true);
      setError(null);

      const userEmail = await AsyncStorage.getItem('userEmail');
      const userPhone = await AsyncStorage.getItem('userPhone');
      const token = await AsyncStorage.getItem('authToken');

      if (!userEmail && !userPhone) {
        setError('User credentials not found');
        setLoading(false);
        return;
      }

      if (!token) {
        setError('Authentication token not found');
        setLoading(false);
        return;
      }
      console.log('Fetching tickets for:', userEmail, userPhone);

      // Make POST request with email and phone in body
      const response = await fetch(
        `${SERVER_IP}/api/tickets/user/all/`,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email: userEmail,
            phone: userPhone,
          }),
        }
      );

      console.log('Tickets response status:', response.status);

      const data = await response.json();
      console.log('Tickets response:', data);

      if (data.success && Array.isArray(data.tickets)) {
        setTickets(data.tickets);
      } else if (Array.isArray(data)) {
        // Handle if response is directly an array
        setTickets(data);
      } else {
        setError(data.message || 'Failed to fetch tickets');
      }
    } catch (err) {
      console.error('Error fetching tickets:', err);
      setError(err.message || 'An error occurred while fetching tickets');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleRefresh = () => {
    setRefreshing(true);
    fetchTickets();
  };

  const getStatusColor = (status) => {
    const numStatus = parseInt(status);
    if (numStatus === 0) return '#ef4444'; // Pending - Red
    if (numStatus === 1) return '#f59e0b'; // Open - Orange
    if (numStatus === 2) return '#10b981'; // Closed - Green
    return '#6b7280'; // Default - Gray
  };

  const getStatusIcon = (status) => {
    const numStatus = parseInt(status);
    if (numStatus === 0) return 'radio-button-unchecked'; // Pending
    if (numStatus === 1) return 'schedule'; // Open
    if (numStatus === 2) return 'check-circle'; // Closed
    return 'help-outline'; // Default
  };

  const getStatusLabel = (status) => {
    const numStatus = parseInt(status);
    if (numStatus === 0) return 'Pending';
    if (numStatus === 1) return 'Open';
    if (numStatus === 2) return 'Closed';
    return 'Unknown';
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      // Parse DATETIME format from database (YYYY-MM-DD HH:MM:SS)
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return 'N/A';
      return date.toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      });
    } catch (err) {
      return 'N/A';
    }
  };

  const renderTicketCard = ({ item }) => (
    <Pressable style={styles.ticketCard}>
      <View style={styles.ticketHeader}>
        <View style={styles.ticketTitleSection}>
          <Text style={styles.ticketSubject} numberOfLines={2}>
            {item.subject}
          </Text>
          <Text style={styles.ticketId}>ID: {item.ticket_id || item.id}</Text>
        </View>
        <View
          style={[
            styles.statusBadge,
            { backgroundColor: getStatusColor(item.status) + '20' },
          ]}
        >
          <Icon
            name={getStatusIcon(item.status)}
            size={16}
            color={getStatusColor(item.status)}
          />
          <Text
            style={[
              styles.statusBadgeText,
              { color: getStatusColor(item.status) },
            ]}
          >
            {getStatusLabel(item.status)}
          </Text>
        </View>
      </View>

      <View style={styles.ticketDivider} />

      <View style={styles.ticketDetails}>
        <View style={styles.detailRow}>
          <Icon name="category" size={16} color="#6b7280" />
          <Text style={styles.detailLabel}>{item.category}</Text>
        </View>

        <View style={styles.detailRow}>
          <Icon name="event" size={16} color="#6b7280" />
          <Text style={styles.detailLabel}>
            {formatDate(item.created_at || item.date)}
          </Text>
        </View>

        <View style={styles.detailRow}>
          <FAIcon name="comment-dots" size={14} color="#6b7280" />
          <Text style={styles.detailLabel} numberOfLines={1}>
            {item.message || 'No message'}
          </Text>
        </View>
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
          <Text style={styles.headerTitle}>My Tickets</Text>
          <View style={{ width: 28 }} />
        </View>
        <View style={[styles.centerContainer, { justifyContent: 'center' }]}>
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
        <Text style={styles.headerTitle}>My Tickets</Text>
        <Pressable onPress={handleRefresh} disabled={refreshing}>
          <Icon
            name="refresh"
            size={28}
            color="#000"
            style={refreshing && { opacity: 0.5 }}
          />
        </Pressable>
      </View>

      {/* Content */}
      {error && !tickets.length ? (
        <View style={styles.centerContainer}>
          <FAIcon name="exclamation-circle" size={50} color="#ef4444" />
          <Text style={styles.errorTitle}>Unable to Load Tickets</Text>
          <Text style={styles.errorSubtext}>{error}</Text>
          <Pressable style={styles.retryButton} onPress={fetchTickets}>
            <Icon name="refresh" size={20} color="#fff" />
            <Text style={styles.retryButtonText}>Try Again</Text>
          </Pressable>
        </View>
      ) : tickets.length === 0 ? (
        <View style={styles.centerContainer}>
          <FAIcon name="inbox" size={50} color="#d1d5db" />
          <Text style={styles.emptyTitle}>No Tickets Yet</Text>
          <Text style={styles.emptySubtext}>
            You haven't raised any support tickets. If you need help, contact
            our team!
          </Text>
          <Pressable
            style={styles.createTicketButton}
            onPress={() => navigation.navigate('ContactSupport')}
          >
            <Icon name="add" size={20} color="#000" />
            <Text style={styles.createTicketButtonText}>Create New Ticket</Text>
          </Pressable>
        </View>
      ) : (
        <FlatList
          data={tickets}
          renderItem={renderTicketCard}
          keyExtractor={(item, index) =>
            (item.ticket_id || item.id || index).toString()
          }
          contentContainerStyle={styles.listContent}
          scrollEnabled={false}
          refreshing={refreshing}
          onRefresh={handleRefresh}
        />
      )}

      {/* Floating Action Button */}
      {tickets.length > 0 && (
        <Pressable
          style={styles.fab}
          onPress={() => navigation.navigate('ContactSupport')}
        >
          <Icon name="add" size={28} color="#000" />
        </Pressable>
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

  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },

  listContent: {
    paddingHorizontal: 16,
    paddingVertical: 16,
  },

  ticketCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 14,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },

  ticketHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 10,
  },

  ticketTitleSection: {
    flex: 1,
    marginRight: 10,
  },

  ticketSubject: {
    fontSize: 15,
    fontWeight: '700',
    color: '#000',
    marginBottom: 4,
    lineHeight: 20,
  },

  ticketId: {
    fontSize: 11,
    color: '#9ca3af',
    fontWeight: '500',
  },

  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 6,
    borderRadius: 6,
    gap: 4,
  },

  statusBadgeText: {
    fontSize: 11,
    fontWeight: '600',
  },

  ticketDivider: {
    height: 1,
    backgroundColor: '#f3f4f6',
    marginVertical: 10,
  },

  ticketDetails: {
    gap: 8,
    marginBottom: 10,
  },

  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },

  detailLabel: {
    fontSize: 12,
    color: '#6b7280',
    fontWeight: '500',
    flex: 1,
  },

  ticketFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: 6,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#f3f4f6',
  },

  viewDetailsText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#ffcf00',
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
    marginBottom: 24,
    lineHeight: 18,
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

  createTicketButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffcf00',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 10,
    gap: 8,
  },

  createTicketButtonText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#000',
  },

  fab: {
    position: 'absolute',
    bottom: 24,
    right: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#ffcf00',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
});

export default MyTickets;
