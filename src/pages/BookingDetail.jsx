// import React, { useEffect, useState } from 'react';
// import {
//   StyleSheet,
//   View,
//   Text,
//   ScrollView,
//   Pressable,
//   ActivityIndicator,
//   Alert,
// } from 'react-native';
// import Icon from 'react-native-vector-icons/MaterialIcons';
// import FAIcon from 'react-native-vector-icons/FontAwesome5';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import { SERVER_IP } from '@env';

// const BookingDetail = ({ route, navigation }) => {
//     console.log("BookingDetail Screen Loaded");
//   const { booking } = route.params;
//   const [details, setDetails] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   const formatDate = (dateString) => {
//     if (!dateString) return 'N/A';
//     const date = new Date(dateString);
//     return date.toLocaleDateString('en-IN', {
//       day: 'numeric',
//       month: 'short',
//       year: 'numeric',
//     });
//   };

//   useEffect(() => {
//     console.log('Booking passed:', booking);
//     fetchBookingDetails();
//   }, []);

//   const fetchBookingDetails = async () => {
//     try {
//       setLoading(true);
//       setError(null);

//       const token = await AsyncStorage.getItem('authToken');
//       const userEmail = await AsyncStorage.getItem('userEmail');
//       const userPhone = await AsyncStorage.getItem('userPhone');

//       if (!token) {
//         setError('User credentials not found');
//         setLoading(false);
//         return;
//       }

//       const response = await fetch(`${SERVER_IP}/api/client/booking/details`, {
//         method: 'POST',
//         headers: {
//           'Authorization': `Bearer ${token}`,
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({
//           email: userEmail,
//           phone: userPhone,
//           booking_id: booking.booking_id,
//         }),
//       });

//       const data = await response.json();
//       console.log('Booking details response:', data);

//       if (data.success && data.booking) {
//         setDetails(data.booking);
//       } else {
//         setError(data.message || 'Failed to fetch booking details');
//       }
//     } catch (err) {
//       console.error('Error fetching booking details:', err);
//       setError(err.message || 'An error occurred');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const getStatusStage = () => {
//     if (!details) return [];

//     // Handle cancelled bookings
//     if (details.is_confirmed === -1) {
//       return [
//         {
//           id: 1,
//           title: 'Booking Confirmed',
//           subtitle: 'Your booking was confirmed',
//           icon: 'check-circle',
//           completed: true,
//           date: details.booked_on,
//         },
//         {
//           id: 4,
//           title: 'Booking Cancelled',
//           subtitle: 'This booking has been cancelled',
//           icon: 'cancel',
//           completed: true,
//           isCancelled: true,
//           date: details.booked_on,
//         },
//       ];
//     }

//     // Determine which stage is completed based on is_confirmed value
//     const confirmedStage = details.is_confirmed || 0;

//     const stages = [
//       {
//         id: 1,
//         title: 'Booking Confirmed',
//         subtitle: 'Your booking is confirmed',
//         icon: 'check-circle',
//         completed: confirmedStage >= 1,
//         date: details.booked_on,
//       },
//       {
//         id: 2,
//         title: 'Pandit Allotted',
//         subtitle: 'Priest assigned to your puja',
//         icon: 'person-check',
//         completed: confirmedStage >= 2,
//         date: details.date,
//       },
//       {
//         id: 3,
//         title: 'Puja Completed',
//         subtitle: 'Ceremony finished successfully',
//         icon: 'event-note',
//         completed: confirmedStage >= 3,
//         date: details.date,
//       },
//     ];

//     return stages;
//   };

//   const canCancelDirectly = () => {
//     if (!details || !details.booked_on) return false;
//     const bookedDate = new Date(details.booked_on);
//     const today = new Date();
    
//     // Reset time parts to compare dates only
//     bookedDate.setHours(0, 0, 0, 0);
//     today.setHours(0, 0, 0, 0);
    
//     // If booked today, allow direct cancellation
//     return bookedDate.getTime() === today.getTime();
//   };

//   const handleCancelBooking = () => {
//     Alert.alert(
//       'Cancel Booking',
//       'Are you sure you want to cancel this booking?',
//       [
//         {
//           text: 'No',
//           style: 'cancel',
//         },
//         {
//           text: 'Yes, Cancel',
//           style: 'destructive',
//           onPress: () => {
//             if (canCancelDirectly()) {
//               // Direct cancellation for same-day bookings
//               processCancelation();
//             } else {
//               // Redirect to cancellation request page
//               navigation.navigate('CancelRequest', { booking: details });
//             }
//           },
//         },
//       ]
//     );
//   };

//   const processCancelation = async () => {
//     try {
//       setLoading(true);
//       const token = await AsyncStorage.getItem('authToken');
//       const userEmail = await AsyncStorage.getItem('userEmail');
//       const userPhone = await AsyncStorage.getItem('userPhone');

//       const response = await fetch(`${SERVER_IP}/api/client/booking/cancel/`, {
//         method: 'POST',
//         headers: {
//           'Authorization': `Bearer ${token}`,
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({
//           booking_id: details.booking_id,
//           email: userEmail,
//           phone: userPhone,
//         }),
//       });

//       const data = await response.json();
//       setLoading(false);

//       if (data.success) {
//         Alert.alert('Success', 'Booking cancelled successfully', [
//           {
//             text: 'OK',
//             onPress: () => navigation.goBack(),
//           },
//         ]);
//       } else {
//         Alert.alert('Error', data.message || 'Failed to cancel booking');
//       }
//     } catch (err) {
//       setLoading(false);
//       console.error('Error cancelling booking:', err);
//       Alert.alert('Error', 'An error occurred while cancelling the booking');
//     }
//   };

//   if (loading) {
//     return (
//       <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
//         <ActivityIndicator size="large" color="#ffcf00" />
//       </View>
//     );
//   }

//   if (error || !details) {
//     return (
//       <View style={styles.container}>
//         <View style={styles.header}>
//           <Pressable onPress={() => navigation.goBack()}>
//             <Icon name="arrow-back" size={28} color="#000" />
//           </Pressable>
//           <Text style={styles.headerTitle}>Booking Details</Text>
//           <View style={{ width: 28 }} />
//         </View>
//         <View style={styles.errorContainer}>
//           <FAIcon name="exclamation-circle" size={50} color="#ef4444" />
//           <Text style={styles.errorTitle}>Unable to Load Details</Text>
//           <Text style={styles.errorSubtext}>{error}</Text>
//           <Pressable style={styles.retryButton} onPress={fetchBookingDetails}>
//             <Icon name="refresh" size={20} color="#fff" />
//             <Text style={styles.retryButtonText}>Try Again</Text>
//           </Pressable>
//         </View>
//       </View>
//     );
//   }

//   const stages = getStatusStage();

//   return (
//     <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
//       {/* Header */}
//       <View style={styles.header}>
//         <Pressable onPress={() => navigation.goBack()}>
//           <Icon name="arrow-back" size={28} color="#000" />
//         </Pressable>
//         <View style={styles.headerContent}>
//           <Text style={styles.headerTitle}>Booking Details</Text>
//           <Text style={styles.bookingId}>ID: {details.booking_id}</Text>
//         </View>
//         <View style={{ width: 28 }} />
//       </View>

//       {/* Main Info Card */}
//       <View style={styles.mainCard}>
//         <View style={styles.pujaInfo}>
//           <FAIcon name="om" size={32} color="#ffcf00" style={styles.pujaIcon} />
//           <View style={styles.pujaTextContainer}>
//             <Text style={styles.pujaName}>{details.name}</Text>
//             <Text style={styles.bookedDate}>Booked on {formatDate(details.booked_on)}</Text>
//           </View>
//         </View>

//         <View style={styles.divider} />

//         <View style={styles.priceSection}>
//           <View style={styles.priceRow}>
//             <Text style={styles.priceLabel}>Package Price</Text>
//             <Text style={styles.priceValue}>₹{details.price}</Text>
//           </View>
//           <View style={styles.priceRow}>
//             <Text style={styles.priceLabel}>Amount Paid</Text>
//             <Text style={[styles.priceValue, { color: '#10b981' }]}>₹{details.amount_paid}</Text>
//           </View>
//           <View style={styles.priceDivider} />
//           <View style={styles.priceRow}>
//             <Text style={styles.totalLabel}>Total Amount</Text>
//             <Text style={styles.totalValue}>₹{details.price}</Text>
//           </View>
//         </View>

//         {details.is_date_assured && (
//           <View style={styles.assuredContainer}>
//             <FAIcon name="shield-alt" size={16} color="#ffcf00" />
//             <Text style={styles.assuredText}>Date Assured - Your puja is guaranteed on the scheduled date</Text>
//           </View>
//         )}
//       </View>

//       {/* Timeline/Status Section */}
//       <View style={styles.timelineSection}>
//         <Text style={styles.timelineTitle}>Booking Status</Text>

//         {stages.map((stage, index) => (
//           <View key={stage.id}>
//             <View style={styles.timelineItem}>
//               <View style={styles.timelineLeft}>
//                 <View
//                   style={[
//                     styles.timelineCircle,
//                     stage.completed && styles.timelineCircleCompleted,
//                   ]}
//                 >
//                   <Icon
//                     name={stage.icon}
//                     size={20}
//                     color={stage.completed ? '#fff' : '#ccc'}
//                   />
//                 </View>
//                 {index < stages.length - 1 && (
//                   <View
//                     style={[
//                       styles.timelineLine,
//                       index < stages.length - 1 &&
//                         stages[index + 1].completed &&
//                         styles.timelineLineCompleted,
//                     ]}
//                   />
//                 )}
//               </View>

//               <View style={styles.timelineRight}>
//                 <Text style={styles.stageTitle}>{stage.title}</Text>
//                 <Text style={styles.stageSubtitle}>{stage.subtitle}</Text>
//                 {stage.completed && stage.date && (
//                   <Text style={styles.stageDate}>{formatDate(stage.date)}</Text>
//                 )}
//               </View>
//             </View>
//           </View>
//         ))}
//       </View>

//       {/* Booking Info Card */}
//       <View style={styles.infoCard}>
//         <Text style={styles.sectionTitle}>Booking Information</Text>

//         <View style={styles.infoRow}>
//           <View style={styles.infoLabel}>
//             <Icon name="confirmation-number" size={20} color="#ffcf00" />
//             <Text style={styles.infoLabelText}>Booking ID</Text>
//           </View>
//           <Text style={styles.infoValue}>{details.booking_id}</Text>
//         </View>

//         <View style={styles.dividerSmall} />

//         <View style={styles.infoRow}>
//           <View style={styles.infoLabel}>
//             <Icon name="event" size={20} color="#ffcf00" />
//             <Text style={styles.infoLabelText}>Scheduled Date</Text>
//           </View>
//           <Text style={styles.infoValue}>{formatDate(details.date)}</Text>
//         </View>

//         <View style={styles.dividerSmall} />

//         <View style={styles.infoRow}>
//           <View style={styles.infoLabel}>
//             <Icon name="payment" size={20} color="#ffcf00" />
//             <Text style={styles.infoLabelText}>Payment Status</Text>
//           </View>
//           <View
//             style={[
//               styles.paymentBadge,
//               details.payment === 1 && styles.paymentBadgeCompleted,
//             ]}
//           >
//             <Text
//               style={[
//                 styles.paymentBadgeText,
//                 details.payment === 1 && styles.paymentBadgeTextCompleted,
//               ]}
//             >
//               {details.payment === 1 ? 'Paid' : 'Pending'}
//             </Text>
//           </View>
//         </View>

//         <View style={styles.dividerSmall} />

//         <View style={styles.infoRow}>
//           <View style={styles.infoLabel}>
//             <Icon name="check-circle-outline" size={20} color="#ffcf00" />
//             <Text style={styles.infoLabelText}>Confirmation</Text>
//           </View>
//           <View
//             style={[
//               styles.statusBadge,
//               details.is_confirmed && styles.statusBadgeConfirmed,
//             ]}
//           >
//             <Text
//               style={[
//                 styles.statusBadgeText,
//                 details.is_confirmed && styles.statusBadgeTextConfirmed,
//               ]}
//             >
//               {details.is_confirmed ? 'Confirmed' : 'Pending'}
//             </Text>
//           </View>
//         </View>
//       </View>

//       {/* Action Buttons */}
//       <View style={styles.actionSection}>
//         <Pressable style={styles.cancelButton} onPress={handleCancelBooking}>
//           <Icon name="close" size={20} color="#fff" />
//           <Text style={styles.cancelButtonText}>Cancel Booking</Text>
//         </Pressable>

//         <Pressable style={styles.actionButton}>
//           <Icon name="phone" size={20} color="#fff" />
//           <Text style={styles.actionButtonText}>Contact Support</Text>
//         </Pressable>
//       </View>

//       <View style={{ height: 30 }} />
//     </ScrollView>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#f9f7f9',
//   },
//   header: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     paddingHorizontal: 16,
//     paddingVertical: 16,
//     paddingTop: 20,
//     backgroundColor: '#fff',
//     borderBottomWidth: 1,
//     borderBottomColor: '#e5e7eb',
//   },
//   headerContent: {
//     alignItems: 'center',
//   },
//   headerTitle: {
//     fontSize: 24,
//     fontWeight: '700',
//     color: '#000',
//   },
//   bookingId: {
//     fontSize: 12,
//     color: '#6b7280',
//     marginTop: 4,
//   },

//   // Main Info Card
//   mainCard: {
//     marginHorizontal: 16,
//     marginTop: 16,
//     backgroundColor: '#fff',
//     borderRadius: 14,
//     padding: 16,
//     borderWidth: 1,
//     borderColor: '#e5e7eb',
//   },
//   pujaInfo: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginBottom: 14,
//   },
//   pujaIcon: {
//     marginRight: 12,
//   },
//   pujaTextContainer: {
//     flex: 1,
//   },
//   pujaName: {
//     fontSize: 16,
//     fontWeight: '700',
//     color: '#000',
//     marginBottom: 4,
//   },
//   bookedDate: {
//     fontSize: 12,
//     color: '#6b7280',
//   },

//   divider: {
//     height: 1,
//     backgroundColor: '#e5e7eb',
//     marginVertical: 14,
//   },

//   priceSection: {
//     marginTop: 8,
//   },
//   priceRow: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     marginBottom: 10,
//   },
//   priceLabel: {
//     fontSize: 13,
//     color: '#6b7280',
//     fontWeight: '500',
//   },
//   priceValue: {
//     fontSize: 13,
//     fontWeight: '700',
//     color: '#000',
//   },
//   priceDivider: {
//     height: 1,
//     backgroundColor: '#f3f4f6',
//     marginVertical: 10,
//   },
//   totalLabel: {
//     fontSize: 14,
//     fontWeight: '700',
//     color: '#000',
//   },
//   totalValue: {
//     fontSize: 18,
//     fontWeight: '700',
//     color: '#ffcf00',
//   },

//   assuredContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     backgroundColor: '#fff6e7',
//     borderRadius: 8,
//     padding: 10,
//     marginTop: 12,
//     gap: 8,
//   },
//   assuredText: {
//     flex: 1,
//     fontSize: 12,
//     color: '#ca8a04',
//     fontWeight: '500',
//   },

//   // Timeline
//   timelineSection: {
//     marginHorizontal: 16,
//     marginTop: 20,
//     backgroundColor: '#fff',
//     borderRadius: 14,
//     padding: 16,
//     borderWidth: 1,
//     borderColor: '#e5e7eb',
//   },
//   timelineTitle: {
//     fontSize: 16,
//     fontWeight: '700',
//     color: '#000',
//     marginBottom: 16,
//   },
//   timelineItem: {
//     flexDirection: 'row',
//     marginBottom: 16,
//   },
//   timelineLeft: {
//     alignItems: 'center',
//     marginRight: 16,
//   },
//   timelineCircle: {
//     width: 44,
//     height: 44,
//     borderRadius: 22,
//     backgroundColor: '#f3f4f6',
//     borderWidth: 2,
//     borderColor: '#e5e7eb',
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   timelineCircleCompleted: {
//     backgroundColor: '#10b981',
//     borderColor: '#10b981',
//   },
//   timelineLine: {
//     width: 2,
//     height: 40,
//     backgroundColor: '#e5e7eb',
//     marginTop: 4,
//   },
//   timelineLineCompleted: {
//     backgroundColor: '#10b981',
//   },
//   timelineRight: {
//     flex: 1,
//     justifyContent: 'center',
//   },
//   stageTitle: {
//     fontSize: 14,
//     fontWeight: '700',
//     color: '#000',
//     marginBottom: 2,
//   },
//   stageSubtitle: {
//     fontSize: 12,
//     color: '#6b7280',
//     marginBottom: 6,
//   },
//   stageDate: {
//     fontSize: 11,
//     color: '#9ca3af',
//     fontStyle: 'italic',
//   },

//   // Info Card
//   infoCard: {
//     marginHorizontal: 16,
//     marginTop: 16,
//     backgroundColor: '#fff',
//     borderRadius: 14,
//     padding: 16,
//     borderWidth: 1,
//     borderColor: '#e5e7eb',
//   },
//   sectionTitle: {
//     fontSize: 16,
//     fontWeight: '700',
//     color: '#000',
//     marginBottom: 14,
//   },
//   infoRow: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     paddingVertical: 10,
//   },
//   infoLabel: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     gap: 10,
//     flex: 1,
//   },
//   infoLabelText: {
//     fontSize: 13,
//     color: '#6b7280',
//     fontWeight: '500',
//   },
//   infoValue: {
//     fontSize: 13,
//     fontWeight: '700',
//     color: '#000',
//     textAlign: 'right',
//     flex: 1,
//   },
//   dividerSmall: {
//     height: 1,
//     backgroundColor: '#f3f4f6',
//   },

//   paymentBadge: {
//     paddingHorizontal: 10,
//     paddingVertical: 6,
//     backgroundColor: '#fef3c7',
//     borderRadius: 6,
//     borderWidth: 1,
//     borderColor: '#fcd34d',
//   },
//   paymentBadgeCompleted: {
//     backgroundColor: '#d1fae5',
//     borderColor: '#6ee7b7',
//   },
//   paymentBadgeText: {
//     fontSize: 12,
//     fontWeight: '700',
//     color: '#ca8a04',
//   },
//   paymentBadgeTextCompleted: {
//     color: '#059669',
//   },

//   statusBadge: {
//     paddingHorizontal: 10,
//     paddingVertical: 6,
//     backgroundColor: '#fee2e2',
//     borderRadius: 6,
//     borderWidth: 1,
//     borderColor: '#fecaca',
//   },
//   statusBadgeConfirmed: {
//     backgroundColor: '#d1fae5',
//     borderColor: '#6ee7b7',
//   },
//   statusBadgeText: {
//     fontSize: 12,
//     fontWeight: '700',
//     color: '#dc2626',
//   },
//   statusBadgeTextConfirmed: {
//     color: '#059669',
//   },

//   // Actions
//   actionSection: {
//     marginHorizontal: 16,
//     marginTop: 20,
//     marginBottom: 20,
//     gap: 12,
//   },
//   cancelButton: {
//     flexDirection: 'row',
//     justifyContent: 'center',
//     alignItems: 'center',
//     backgroundColor: '#ef4444',
//     borderRadius: 12,
//     paddingVertical: 14,
//     paddingHorizontal: 16,
//     gap: 8,
//   },
//   cancelButtonText: {
//     fontSize: 15,
//     fontWeight: '700',
//     color: '#fff',
//   },
//   actionButton: {
//     flexDirection: 'row',
//     justifyContent: 'center',
//     alignItems: 'center',
//     backgroundColor: '#ff6b9d',
//     borderRadius: 12,
//     paddingVertical: 14,
//     paddingHorizontal: 16,
//     gap: 8,
//   },
//   actionButtonSecondary: {
//     backgroundColor: '#fff',
//     borderWidth: 1.5,
//     borderColor: '#ffcf00',
//   },
//   actionButtonText: {
//     fontSize: 15,
//     fontWeight: '700',
//     color: '#fff',
//   },
//   actionButtonTextSecondary: {
//     color: '#ffcf00',
//   },

//   // Error
//   errorContainer: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     paddingHorizontal: 20,
//   },
//   errorTitle: {
//     fontSize: 18,
//     fontWeight: '700',
//     color: '#000',
//     marginTop: 12,
//     marginBottom: 8,
//   },
//   errorSubtext: {
//     fontSize: 13,
//     color: '#6b7280',
//     textAlign: 'center',
//     marginBottom: 24,
//   },
//   retryButton: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     backgroundColor: '#ff6b9d',
//     paddingHorizontal: 20,
//     paddingVertical: 12,
//     borderRadius: 10,
//     gap: 8,
//   },
//   retryButtonText: {
//     fontSize: 14,
//     fontWeight: '700',
//     color: '#fff',
//   },
// });

// export default BookingDetail;




import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  Pressable,
  ActivityIndicator,
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import FAIcon from 'react-native-vector-icons/FontAwesome5';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SERVER_IP } from '@env';

const BookingDetail = ({ route, navigation }) => {
  console.log("BookingDetail Screen Loaded");
  const { booking } = route.params;
  const [details, setDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };

  useEffect(() => {
    console.log('Booking passed:', booking);
    fetchBookingDetails();
  }, []);

  const fetchBookingDetails = async () => {
    try {
      setLoading(true);
      setError(null);

      const token = await AsyncStorage.getItem('authToken');
      const userEmail = await AsyncStorage.getItem('userEmail');
      const userPhone = await AsyncStorage.getItem('userPhone');

      if (!token) {
        setError('User credentials not found');
        setLoading(false);
        return;
      }

      const response = await fetch(`${SERVER_IP}/api/client/booking/details`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: userEmail,
          phone: userPhone,
          booking_id: booking.booking_id,
        }),
      });

      const data = await response.json();
      console.log('Booking details response:', data);

      if (data.success && data.booking) {
        setDetails(data.booking);
      } else {
        setError(data.message || 'Failed to fetch booking details');
      }
    } catch (err) {
      console.error('Error fetching booking details:', err);
      setError(err.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const getStatusStage = () => {
    if (!details) return [];

    // --- MODIFIED LOGIC FOR CANCELLED BOOKINGS ---
    if (details.is_confirmed === -1) {
      return [
        {
          id: 1,
          title: 'Booking Confirmed',
          subtitle: 'Your booking was received',
          icon: 'check-circle',
          completed: true,
          date: details.booked_on,
          isCancelled: false,
        },
        {
          id: 2,
          title: 'Booking Cancelled',
          subtitle: 'This booking is cancelled',
          icon: 'cancel', // MaterialIcon name
          completed: true, // It is "done" in terms of flow
          isCancelled: true, // Custom flag to trigger Red styling
          date: details.booked_on, // Or cancellation date if available
        },
      ];
    }

    // Standard flow for active bookings
    const confirmedStage = details.is_confirmed || 0;

    const stages = [
      {
        id: 1,
        title: 'Booking Confirmed',
        subtitle: 'Your booking is confirmed',
        icon: 'check-circle',
        completed: confirmedStage >= 1,
        date: details.booked_on,
      },
      {
        id: 2,
        title: 'Pandit Allotted',
        subtitle: 'Priest assigned to your puja',
        icon: 'person-check',
        completed: confirmedStage >= 2,
        date: details.date,
      },
      {
        id: 3,
        title: 'Puja Completed',
        subtitle: 'Ceremony finished successfully',
        icon: 'event-note',
        completed: confirmedStage >= 3,
        date: details.date,
      },
    ];

    return stages;
  };

  const canCancelDirectly = () => {
    if (!details || !details.booked_on) return false;
    const bookedDate = new Date(details.booked_on);
    const today = new Date();
    
    // Reset time parts to compare dates only
    bookedDate.setHours(0, 0, 0, 0);
    today.setHours(0, 0, 0, 0);
    
    // If booked today, allow direct cancellation
    return bookedDate.getTime() === today.getTime();
  };

  const handleCancelBooking = () => {
    Alert.alert(
      'Cancel Booking',
      'Are you sure you want to cancel this booking?',
      [
        {
          text: 'No',
          style: 'cancel',
        },
        {
          text: 'Yes, Cancel',
          style: 'destructive',
          onPress: () => {
            if (canCancelDirectly()) {
              // Direct cancellation for same-day bookings
              processCancelation();
            } else {
              // Redirect to cancellation request page
              navigation.navigate('CancelRequest', { booking: details });
            }
          },
        },
      ]
    );
  };

  const processCancelation = async () => {
    try {
      setLoading(true);
      const token = await AsyncStorage.getItem('authToken');
      const userEmail = await AsyncStorage.getItem('userEmail');
      const userPhone = await AsyncStorage.getItem('userPhone');

      const response = await fetch(`${SERVER_IP}/api/client/booking/cancel/`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          booking_id: details.booking_id,
          email: userEmail,
          phone: userPhone,
        }),
      });

      const data = await response.json();
      
      // Refresh details immediately after cancellation to update UI
      if (data.success) {
        await fetchBookingDetails(); 
      } else {
        setLoading(false);
        Alert.alert('Error', data.message || 'Failed to cancel booking');
      }
    } catch (err) {
      setLoading(false);
      console.error('Error cancelling booking:', err);
      Alert.alert('Error', 'An error occurred while cancelling the booking');
    }
  };

  if (loading) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color="#ffcf00" />
      </View>
    );
  }

  if (error || !details) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Pressable onPress={() => navigation.goBack()}>
            <Icon name="arrow-back" size={28} color="#000" />
          </Pressable>
          <Text style={styles.headerTitle}>Booking Details</Text>
          <View style={{ width: 28 }} />
        </View>
        <View style={styles.errorContainer}>
          <FAIcon name="exclamation-circle" size={50} color="#ef4444" />
          <Text style={styles.errorTitle}>Unable to Load Details</Text>
          <Text style={styles.errorSubtext}>{error}</Text>
          <Pressable style={styles.retryButton} onPress={fetchBookingDetails}>
            <Icon name="refresh" size={20} color="#fff" />
            <Text style={styles.retryButtonText}>Try Again</Text>
          </Pressable>
        </View>
      </View>
    );
  }

  const stages = getStatusStage();
  const isBookingCancelled = details.is_confirmed === -1;

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <View style={styles.header}>
        <Pressable onPress={() => navigation.goBack()}>
          <Icon name="arrow-back" size={28} color="#000" />
        </Pressable>
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>Booking Details</Text>
          <Text style={styles.bookingId}>ID: {details.booking_id}</Text>
        </View>
        <View style={{ width: 28 }} />
      </View>

      {/* Main Info Card */}
      <View style={styles.mainCard}>
        <View style={styles.pujaInfo}>
          <FAIcon name="om" size={32} color="#ffcf00" style={styles.pujaIcon} />
          <View style={styles.pujaTextContainer}>
            <Text style={styles.pujaName}>{details.name}</Text>
            <Text style={styles.bookedDate}>Booked on {formatDate(details.booked_on)}</Text>
          </View>
        </View>

        <View style={styles.divider} />

        <View style={styles.priceSection}>
          <View style={styles.priceRow}>
            <Text style={styles.priceLabel}>Package Price</Text>
            <Text style={styles.priceValue}>₹{details.price}</Text>
          </View>
          <View style={styles.priceRow}>
            <Text style={styles.priceLabel}>Amount Paid</Text>
            <Text style={[styles.priceValue, { color: '#10b981' }]}>₹{details.amount_paid}</Text>
          </View>
          <View style={styles.priceDivider} />
          <View style={styles.priceRow}>
            <Text style={styles.totalLabel}>Total Amount</Text>
            <Text style={styles.totalValue}>₹{details.price}</Text>
          </View>
        </View>

        {details.is_date_assured && !isBookingCancelled && (
          <View style={styles.assuredContainer}>
            <FAIcon name="shield-alt" size={16} color="#ffcf00" />
            <Text style={styles.assuredText}>Date Assured - Your puja is guaranteed on the scheduled date</Text>
          </View>
        )}
      </View>

      {/* Timeline/Status Section */}
      <View style={styles.timelineSection}>
        <Text style={styles.timelineTitle}>Booking Status</Text>

        {stages.map((stage, index) => (
          <View key={stage.id}>
            <View style={styles.timelineItem}>
              <View style={styles.timelineLeft}>
                {/* LOGIC FOR CIRCLE COLOR:
                   1. If stage.isCancelled is true -> RED
                   2. Else if stage.completed is true -> GREEN
                   3. Else -> GRAY
                */}
                <View
                  style={[
                    styles.timelineCircle,
                    stage.completed && styles.timelineCircleCompleted,
                    stage.isCancelled && styles.timelineCircleCancelled, 
                  ]}
                >
                  <Icon
                    name={stage.icon}
                    size={20}
                    // If cancelled -> White icon (on red bg), If completed -> White (on green bg), Else -> Gray
                    color={stage.completed ? '#fff' : '#ccc'}
                  />
                </View>

                {/* Vertical Connector Line */}
                {index < stages.length - 1 && (
                  <View
                    style={[
                      styles.timelineLine,
                      // Logic: If the NEXT stage is completed, the line leading to it is colored.
                      index < stages.length - 1 &&
                        stages[index + 1].completed &&
                        styles.timelineLineCompleted,
                    ]}
                  />
                )}
              </View>

              <View style={styles.timelineRight}>
                <Text style={[
                    styles.stageTitle, 
                    stage.isCancelled && { color: '#ef4444' } // Make text red if cancelled
                ]}>
                    {stage.title}
                </Text>
                <Text style={styles.stageSubtitle}>{stage.subtitle}</Text>
                {stage.completed && stage.date && (
                  <Text style={styles.stageDate}>{formatDate(stage.date)}</Text>
                )}
              </View>
            </View>
          </View>
        ))}
      </View>

      {/* Booking Info Card */}
      <View style={styles.infoCard}>
        <Text style={styles.sectionTitle}>Booking Information</Text>

        <View style={styles.infoRow}>
          <View style={styles.infoLabel}>
            <Icon name="confirmation-number" size={20} color="#ffcf00" />
            <Text style={styles.infoLabelText}>Booking ID</Text>
          </View>
          <Text style={styles.infoValue}>{details.booking_id}</Text>
        </View>

        <View style={styles.dividerSmall} />

        <View style={styles.infoRow}>
          <View style={styles.infoLabel}>
            <Icon name="event" size={20} color="#ffcf00" />
            <Text style={styles.infoLabelText}>Scheduled Date</Text>
          </View>
          <Text style={styles.infoValue}>{formatDate(details.date)}</Text>
        </View>

        <View style={styles.dividerSmall} />

        <View style={styles.infoRow}>
          <View style={styles.infoLabel}>
            <Icon name="payment" size={20} color="#ffcf00" />
            <Text style={styles.infoLabelText}>Payment Status</Text>
          </View>
          <View
            style={[
              styles.paymentBadge,
              details.payment === 1 && styles.paymentBadgeCompleted,
            ]}
          >
            <Text
              style={[
                styles.paymentBadgeText,
                details.payment === 1 && styles.paymentBadgeTextCompleted,
              ]}
            >
              {details.payment === 1 ? 'Paid' : 'Pending'}
            </Text>
          </View>
        </View>

        <View style={styles.dividerSmall} />

        <View style={styles.infoRow}>
          <View style={styles.infoLabel}>
            <Icon name="check-circle-outline" size={20} color="#ffcf00" />
            <Text style={styles.infoLabelText}>Confirmation</Text>
          </View>
          
          {/* Status Badge Handling for Cancelled state */}
          <View
            style={[
              styles.statusBadge,
              details.is_confirmed === 1 && styles.statusBadgeConfirmed,
              details.is_confirmed === -1 && styles.statusBadgeCancelled,
            ]}
          >
            <Text
              style={[
                styles.statusBadgeText,
                details.is_confirmed === 1 && styles.statusBadgeTextConfirmed,
                details.is_confirmed === -1 && styles.statusBadgeTextCancelled,
              ]}
            >
              {details.is_confirmed === 1 
                ? 'Confirmed' 
                : details.is_confirmed === -1 
                    ? 'Cancelled' 
                    : 'Pending'}
            </Text>
          </View>
        </View>
      </View>

      {/* Action Buttons - Hide Cancel button if already cancelled */}
      <View style={styles.actionSection}>
        {!isBookingCancelled && (
            <Pressable style={styles.cancelButton} onPress={handleCancelBooking}>
                <Icon name="close" size={20} color="#fff" />
                <Text style={styles.cancelButtonText}>Cancel Booking</Text>
            </Pressable>
        )}

        <Pressable style={styles.actionButton}>
          <Icon name="phone" size={20} color="#fff" />
          <Text style={styles.actionButtonText}>Contact Support</Text>
        </Pressable>
      </View>

      <View style={{ height: 30 }} />
    </ScrollView>
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
    fontSize: 24,
    fontWeight: '700',
    color: '#000',
  },
  bookingId: {
    fontSize: 12,
    color: '#6b7280',
    marginTop: 4,
  },

  // Main Info Card
  mainCard: {
    marginHorizontal: 16,
    marginTop: 16,
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  pujaInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 14,
  },
  pujaIcon: {
    marginRight: 12,
  },
  pujaTextContainer: {
    flex: 1,
  },
  pujaName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#000',
    marginBottom: 4,
  },
  bookedDate: {
    fontSize: 12,
    color: '#6b7280',
  },

  divider: {
    height: 1,
    backgroundColor: '#e5e7eb',
    marginVertical: 14,
  },

  priceSection: {
    marginTop: 8,
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  priceLabel: {
    fontSize: 13,
    color: '#6b7280',
    fontWeight: '500',
  },
  priceValue: {
    fontSize: 13,
    fontWeight: '700',
    color: '#000',
  },
  priceDivider: {
    height: 1,
    backgroundColor: '#f3f4f6',
    marginVertical: 10,
  },
  totalLabel: {
    fontSize: 14,
    fontWeight: '700',
    color: '#000',
  },
  totalValue: {
    fontSize: 18,
    fontWeight: '700',
    color: '#ffcf00',
  },

  assuredContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff6e7',
    borderRadius: 8,
    padding: 10,
    marginTop: 12,
    gap: 8,
  },
  assuredText: {
    flex: 1,
    fontSize: 12,
    color: '#ca8a04',
    fontWeight: '500',
  },

  // Timeline
  timelineSection: {
    marginHorizontal: 16,
    marginTop: 20,
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  timelineTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#000',
    marginBottom: 16,
  },
  timelineItem: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  timelineLeft: {
    alignItems: 'center',
    marginRight: 16,
  },
  timelineCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#f3f4f6',
    borderWidth: 2,
    borderColor: '#e5e7eb',
    justifyContent: 'center',
    alignItems: 'center',
  },
  timelineCircleCompleted: {
    backgroundColor: '#10b981',
    borderColor: '#10b981',
  },
  // ADDED: Red circle style for cancellation
  timelineCircleCancelled: {
    backgroundColor: '#ef4444',
    borderColor: '#ef4444',
  },
  timelineLine: {
    width: 2,
    height: 40,
    backgroundColor: '#e5e7eb',
    marginTop: 4,
  },
  timelineLineCompleted: {
    backgroundColor: '#10b981',
  },
  timelineRight: {
    flex: 1,
    justifyContent: 'center',
  },
  stageTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#000',
    marginBottom: 2,
  },
  stageSubtitle: {
    fontSize: 12,
    color: '#6b7280',
    marginBottom: 6,
  },
  stageDate: {
    fontSize: 11,
    color: '#9ca3af',
    fontStyle: 'italic',
  },

  // Info Card
  infoCard: {
    marginHorizontal: 16,
    marginTop: 16,
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#000',
    marginBottom: 14,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
  },
  infoLabel: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flex: 1,
  },
  infoLabelText: {
    fontSize: 13,
    color: '#6b7280',
    fontWeight: '500',
  },
  infoValue: {
    fontSize: 13,
    fontWeight: '700',
    color: '#000',
    textAlign: 'right',
    flex: 1,
  },
  dividerSmall: {
    height: 1,
    backgroundColor: '#f3f4f6',
  },

  paymentBadge: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    backgroundColor: '#fef3c7',
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#fcd34d',
  },
  paymentBadgeCompleted: {
    backgroundColor: '#d1fae5',
    borderColor: '#6ee7b7',
  },
  paymentBadgeText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#ca8a04',
  },
  paymentBadgeTextCompleted: {
    color: '#059669',
  },

  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    backgroundColor: '#fee2e2',
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#fecaca',
  },
  statusBadgeConfirmed: {
    backgroundColor: '#d1fae5',
    borderColor: '#6ee7b7',
  },
  // Added cancelled badge styles
  statusBadgeCancelled: {
    backgroundColor: '#fee2e2',
    borderColor: '#ef4444',
  },
  statusBadgeText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#dc2626',
  },
  statusBadgeTextConfirmed: {
    color: '#059669',
  },
  statusBadgeTextCancelled: {
    color: '#ef4444',
  },

  // Actions
  actionSection: {
    marginHorizontal: 16,
    marginTop: 20,
    marginBottom: 20,
    gap: 12,
  },
  cancelButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ef4444',
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 16,
    gap: 8,
  },
  cancelButtonText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#fff',
  },
  actionButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ff6b9d',
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 16,
    gap: 8,
  },
  actionButtonSecondary: {
    backgroundColor: '#fff',
    borderWidth: 1.5,
    borderColor: '#ffcf00',
  },
  actionButtonText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#fff',
  },
  actionButtonTextSecondary: {
    color: '#ffcf00',
  },

  // Error
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
});

export default BookingDetail;