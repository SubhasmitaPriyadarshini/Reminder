// import * as Calendar from 'expo-calendar';
// import { LinearGradient } from 'expo-linear-gradient'; // Install with: expo install expo-linear-gradient
// import React, { useEffect, useState } from 'react';
// import {
//   Alert,
//   Image,
//   Linking,
//   Platform,
//   ScrollView,
//   StatusBar,
//   StyleSheet,
//   Text,
//   TouchableOpacity,
//   useWindowDimensions,
//   View,
// } from 'react-native';

// const Card = () => {
//   const { width, height } = useWindowDimensions();
//   const isMobile = width < 768;
//   const [countdown, setCountdown] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

//   // Calculate countdown to event
//   useEffect(() => {
//     const eventDate = new Date('2025-11-10T18:00:00+05:30').getTime();
//     const updateCountdown = () => {
//       const now = Date.now();
//       const difference = eventDate - now;

//       if (difference > 0) {
//         const days = Math.floor(difference / (1000 * 60 * 60 * 24));
//         const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
//         const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
//         const seconds = Math.floor((difference % (1000 * 60)) / 1000);
//         setCountdown({ days, hours, minutes, seconds });
//       } else {
//         setCountdown({ days: 0, hours: 0, minutes: 0, seconds: 0 });
//       }
//     };

//     updateCountdown();
//     const interval = setInterval(updateCountdown, 1000); // Update every second for continuous counting
//     return () => clearInterval(interval);
//   }, []);

//   // Request permissions (calendar only)
//   useEffect(() => {
//     (async () => {
//       const { status } = await Calendar.requestCalendarPermissionsAsync();
//       if (status !== 'granted') {
//         Alert.alert('Permission Required', 'Please allow calendar access to add events.');
//       }
//     })();
//   }, []);

//   // Format date for Google Calendar URL (UTC)
//   const formatDateForGoogle = (date: Date): string => {
//     return date.toISOString().slice(0, -1).replace(/[-:]/g, '');
//   };

//   // Add to Calendar
//   const handleAddToCalendar = async () => {
//     try {
//       const startDate = new Date('2025-11-10T18:00:00+05:30');
//       const endDate = new Date('2025-11-10T21:00:00+05:30');


// //       const startDate = new Date(Date.now() + 2 * 60 * 1000);
// // const endDate = new Date(startDate.getTime() + 60 * 60 * 1000); // 1 hour duration

//       const eventData = {
//         title: "Aarav's 1st Birthday Celebration 🎉",
//         startDate,
//         endDate,
//         timeZone: 'Asia/Kolkata',
//         location: 'The Royal Banquet Hall, Bhubaneswar',
//         notes: 'Join us for Aarav’s special day filled with fun, cake, and memories!',
//         alarms: [{ relativeOffset: -30, method: Calendar.AlarmMethod.ALERT }], // Native reminder 30 min before
//       };

//       const presentationOptions = Platform.OS === 'ios' ? { allowsEditing: true, allowsCalendarCreation: true } : undefined;
//       const result = await Calendar.createEventInCalendarAsync(eventData, );

//       if (result.action === 'saved' || result.action === 'done') {
//         Alert.alert(
//           '🎉 Added to Calendar',
//           'Event saved with reminder! Review and adjust if needed.'
//         );
//       } else {
//         Alert.alert('Canceled', 'Event addition was canceled.');
//       }

//       // ✅ Open Google Calendar app directly (platform-specific deep link)
//       const googleText = encodeURIComponent("Aarav's 1st Birthday Celebration 🎉");
//       const googleDetails = encodeURIComponent('Join us for Aarav’s special day filled with fun, cake, and memories!');
//       const googleLocation = encodeURIComponent('The Royal Banquet Hall, Bhubaneswar');
//       const googleDates = `${formatDateForGoogle(startDate)}/${formatDateForGoogle(endDate)}`;

//       let googleUrl;
//       if (Platform.OS === 'android') {
//         // Android Intent URL to open Google Calendar app directly
//         const intentUri = `http://calendar.google.com/calendar/event?action=TEMPLATE&text=${googleText}&dates=${googleDates}&details=${googleDetails}&location=${googleLocation}`;
//         googleUrl = `intent://details/0?uri=${encodeURIComponent(intentUri)}#Intent;scheme=googlecalendar;package=com.google.android.calendar;S.start=true;end`;
//       } else {
//         // iOS: Use app scheme (falls back to web if app not installed)
//         googleUrl = `googlecalendar://add?text=${googleText}&dates=${googleDates}&details=${googleDetails}&location=${googleLocation}`;
//       }

//       // Check if can open, fallback to web if not
//       const canOpen = await Linking.canOpenURL(googleUrl);
//       if (canOpen) {
//         Linking.openURL(googleUrl);
//       } else {
//         // Fallback to web
//         const fallbackUrl = `https://calendar.google.com/calendar/u/0/r/eventedit?text=${googleText}&dates=${googleDates}&details=${googleDetails}&location=${googleLocation}`;
//         Linking.openURL(fallbackUrl);
//       }
//     } catch (error) {
//       console.error('Error opening calendar:', error);
//       Alert.alert('Error', 'Unable to open calendar.');
//     }
//   };

//   const handleViewOnMap = () => {
//     const mapUrl =
//       'https://www.google.com/maps?q=The+Royal+Banquet+Hall,+Bhubaneswar';
//     Linking.openURL(mapUrl);
//   };

//   return (
//     <LinearGradient
//       colors={['#fff7f0', '#ffebee']}
//       style={styles.gradientBackground}
//     >
//       <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent />
//       <ScrollView contentContainerStyle={styles.scrollContainer}>
//         <View style={[styles.container, { width: isMobile ? '90%' : '60%' }]}>
//           <Image
//             source={{
//               uri: 'https://images.unsplash.com/photo-1610891083658-607ecb3e7aa9?w=800',
//             }}
//             style={[styles.image, { height: isMobile ? 200 : 350 }]}
//           />

//           <Text style={styles.title}>🎂 Aarav’s 1st Birthday 🎉</Text>
//           <Text style={styles.text}>
//             You’re invited to celebrate Aarav’s very first birthday!
//           </Text>

//           {/* Countdown Section */}
//           <View style={styles.countdownContainer}>
//             <Text style={styles.countdownTitle}>Time Until the Party!</Text>
//             <View style={styles.countdownRow}>
//               <View style={styles.countdownItem}>
//                 <Text style={styles.countdownValue}>{countdown.days}</Text>
//                 <Text style={styles.countdownLabel}>Days</Text>
//               </View>
//               <View style={styles.countdownItem}>
//                 <Text style={styles.countdownValue}>{countdown.hours}</Text>
//                 <Text style={styles.countdownLabel}>Hours</Text>
//               </View>
//               <View style={styles.countdownItem}>
//                 <Text style={styles.countdownValue}>{countdown.minutes}</Text>
//                 <Text style={styles.countdownLabel}>Minutes</Text>
//               </View>
//               <View style={styles.countdownItem}>
//                 <Text style={styles.countdownValue}>{countdown.seconds}</Text>
//                 <Text style={styles.countdownLabel}>Seconds</Text>
//               </View>
//             </View>
//           </View>

//           <Text style={styles.detail}>📅 Date: November 10, 2025</Text>
//           <Text style={styles.detail}>🕕 Time: 6:00 PM - 9:00 PM</Text>
//           <Text style={styles.detail}>
//             📍 Venue: The Royal Banquet Hall, Bhubaneswar
//           </Text>

//           <View style={styles.buttonContainer}>
//             <TouchableOpacity style={styles.mapButton} onPress={handleViewOnMap}>
//               <Text style={styles.buttonText}>📍 View on Map</Text>
//             </TouchableOpacity>

//             <TouchableOpacity
//               style={styles.calendarButton}
//               onPress={handleAddToCalendar}>
//               <Text style={styles.buttonText}>📅 Add to Calendar</Text>
//             </TouchableOpacity>
//           </View>

//           <Text style={styles.footer}>Let’s make memories that last forever 💕</Text>
//         </View>
//       </ScrollView>
//     </LinearGradient>
//   );
// };

// export default Card;

// const styles = StyleSheet.create({
//   gradientBackground: {
//     flex: 1,
//   },
//   scrollContainer: {
//     flexGrow: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     paddingVertical: 30,
//     minHeight: '100%',
//   },
//   container: {
//     backgroundColor: 'rgba(255, 255, 255, 0.9)',
//     borderRadius: 20,
//     padding: 20,
//     alignItems: 'center',
//     shadowColor: '#000',
//     shadowOpacity: 0.2,
//     shadowRadius: 8,
//     elevation: 5,
//     maxWidth: 500,
//   },
//   image: {
//     width: '100%',
//     borderRadius: 20,
//     marginBottom: 20,
//   },
//   title: {
//     fontSize: 24,
//     color: '#e91e63',
//     fontWeight: '700',
//     textAlign: 'center',
//     marginBottom: 10,
//   },
//   text: {
//     fontSize: 16,
//     color: '#555',
//     textAlign: 'center',
//     marginVertical: 10,
//     lineHeight: 22,
//   },
//   countdownContainer: {
//     backgroundColor: '#fff3e0',
//     borderRadius: 15,
//     padding: 15,
//     marginVertical: 15,
//     alignItems: 'center',
//     width: '100%',
//   },
//   countdownTitle: {
//     fontSize: 18,
//     fontWeight: '600',
//     color: '#e91e63',
//     marginBottom: 10,
//   },
//   countdownRow: {
//     flexDirection: 'row',
//     justifyContent: 'space-around',
//     width: '100%',
//   },
//   countdownItem: {
//     alignItems: 'center',
//     paddingHorizontal: 5,
//   },
//   countdownValue: {
//     fontSize: 24,
//     fontWeight: 'bold',
//     color: '#e91e63',
//   },
//   countdownLabel: {
//     fontSize: 12,
//     color: '#666',
//     marginTop: 2,
//   },
//   detail: {
//     fontSize: 15,
//     color: '#444',
//     marginTop: 4,
//     textAlign: 'center',
//   },
//   buttonContainer: {
//     flexDirection: 'row',
//     marginTop: 20,
//     justifyContent: 'space-between',
//     width: '100%',
//   },
//   mapButton: {
//     flex: 1,
//     backgroundColor: '#03a9f4',
//     padding: 12,
//     marginRight: 5,
//     borderRadius: 10,
//   },
//   calendarButton: {
//     flex: 1,
//     backgroundColor: '#4caf50',
//     padding: 12,
//     marginLeft: 5,
//     borderRadius: 10,
//   },
//   buttonText: {
//     color: '#fff',
//     fontWeight: '600',
//     textAlign: 'center',
//   },
//   footer: {
//     marginTop: 25,
//     fontSize: 14,
//     color: '#888',
//     fontStyle: 'italic',
//     textAlign: 'center',
//   },
// });



import * as Calendar from 'expo-calendar';
import { LinearGradient } from 'expo-linear-gradient'; // Install with: expo install expo-linear-gradient
import React, { useEffect, useState } from 'react';
import {
  Alert,
  Image,
  Linking,
  Platform,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from 'react-native';

const Card = () => {
  const { width, height } = useWindowDimensions();
  const isMobile = width < 768;
  const [countdown, setCountdown] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  // Calculate countdown to event
  useEffect(() => {
    const eventDate = new Date('2025-11-10T18:00:00+05:30').getTime();
    const updateCountdown = () => {
      const now = Date.now();
      const difference = eventDate - now;

      if (difference > 0) {
        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((difference % (1000 * 60)) / 1000);
        setCountdown({ days, hours, minutes, seconds });
      } else {
        setCountdown({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      }
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000); // Update every second for continuous counting
    return () => clearInterval(interval);
  }, []);

  // Request permissions (calendar only – skips on web)
  useEffect(() => {
    if (Platform.OS !== 'web') {
      (async () => {
        const { status } = await Calendar.requestCalendarPermissionsAsync();
        if (status !== 'granted') {
          Alert.alert('Permission Required', 'Please allow calendar access to add events.');
        }
      })();
    }
  }, []);

  // Format date for Google Calendar URL (UTC)
  const formatDateForGoogle = (date: Date): string => {
    return date.toISOString().slice(0, -1).replace(/[-:]/g, '');
  };

  // Add to Calendar
  const handleAddToCalendar = async () => {
    try {
      const startDate = new Date('2025-11-10T18:00:00+05:30');
      const endDate = new Date('2025-11-10T21:00:00+05:30');

      if (Platform.OS === 'web') {
        // Web fallback: Open Google Calendar web (pre-fills event; user adds reminder there)
        const googleText = encodeURIComponent("Aarav's 1st Birthday Celebration 🎉");
        const googleDetails = encodeURIComponent('Join us for Aarav’s special day filled with fun, cake, and memories! (Reminder: 30 min before)');
        const googleLocation = encodeURIComponent('The Royal Banquet Hall, Bhubaneswar');
        const googleDates = `${formatDateForGoogle(startDate)}/${formatDateForGoogle(endDate)}`;
        const googleUrl = `https://calendar.google.com/calendar/u/0/r/eventedit?text=${googleText}&dates=${googleDates}&details=${googleDetails}&location=${googleLocation}`;
        Linking.openURL(googleUrl);
        Alert.alert(
          '📅 Added to Google Calendar',
          'Event pre-filled in Google Calendar web – save it and add a 30-min reminder!'
        );
        return; // Exit early for web
      }

      // Mobile: Native calendar
      const eventData = {
        title: "Aarav's 1st Birthday Celebration 🎉",
        startDate,
        endDate,
        timeZone: 'Asia/Kolkata',
        location: 'The Royal Banquet Hall, Bhubaneswar',
        notes: 'Join us for Aarav’s special day filled with fun, cake, and memories!',
        alarms: [{ relativeOffset: -30, method: Calendar.AlarmMethod.ALERT }], // Native reminder 30 min before
      };

      const presentationOptions = Platform.OS === 'ios' ? { allowsEditing: true, allowsCalendarCreation: true } : undefined;
      const result = await Calendar.createEventInCalendarAsync(eventData, );

      if (result.action === 'saved' || result.action === 'done') {
        Alert.alert(
          '🎉 Added to Calendar',
          'Event saved with reminder! Review and adjust if needed.'
        );
      } else {
        Alert.alert('Canceled', 'Event addition was canceled.');
      }

      // ✅ Open Google Calendar app directly (platform-specific deep link)
      const googleText = encodeURIComponent("Aarav's 1st Birthday Celebration 🎉");
      const googleDetails = encodeURIComponent('Join us for Aarav’s special day filled with fun, cake, and memories!');
      const googleLocation = encodeURIComponent('The Royal Banquet Hall, Bhubaneswar');
      const googleDates = `${formatDateForGoogle(startDate)}/${formatDateForGoogle(endDate)}`;

      let googleUrl;
      if (Platform.OS === 'android') {
        // Android Intent URL to open Google Calendar app directly
        const intentUri = `http://calendar.google.com/calendar/event?action=TEMPLATE&text=${googleText}&dates=${googleDates}&details=${googleDetails}&location=${googleLocation}`;
        googleUrl = `intent://details/0?uri=${encodeURIComponent(intentUri)}#Intent;scheme=googlecalendar;package=com.google.android.calendar;S.start=true;end`;
      } else {
        // iOS: Use app scheme (falls back to web if app not installed)
        googleUrl = `googlecalendar://add?text=${googleText}&dates=${googleDates}&details=${googleDetails}&location=${googleLocation}`;
      }

      // Check if can open, fallback to web if not
      const canOpen = await Linking.canOpenURL(googleUrl);
      if (canOpen) {
        Linking.openURL(googleUrl);
      } else {
        // Fallback to web
        const fallbackUrl = `https://calendar.google.com/calendar/u/0/r/eventedit?text=${googleText}&dates=${googleDates}&details=${googleDetails}&location=${googleLocation}`;
        Linking.openURL(fallbackUrl);
      }
    } catch (error) {
      console.error('Error opening calendar:', error);
      Alert.alert('Error', 'Unable to open calendar.');
    }
  };

  const handleViewOnMap = () => {
    const mapUrl =
      'https://www.google.com/maps?q=The+Royal+Banquet+Hall,+Bhubaneswar';
    Linking.openURL(mapUrl);
  };

  return (
    <LinearGradient
      colors={['#fff7f0', '#ffebee']}
      style={styles.gradientBackground}
    >
      <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent />
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={[styles.container, { width: isMobile ? '90%' : '60%' }]}>
          <Image
            source={{
              uri: 'https://images.unsplash.com/photo-1610891083658-607ecb3e7aa9?w=800',
            }}
            style={[styles.image, { height: isMobile ? 200 : 350 }]}
          />

          <Text style={styles.title}>🎂 Aarav’s 1st Birthday 🎉</Text>
          <Text style={styles.text}>
            You’re invited to celebrate Aarav’s very first birthday!
          </Text>

          {/* Countdown Section */}
          <View style={styles.countdownContainer}>
            <Text style={styles.countdownTitle}>Time Until the Party!</Text>
            <View style={styles.countdownRow}>
              <View style={styles.countdownItem}>
                <Text style={styles.countdownValue}>{countdown.days}</Text>
                <Text style={styles.countdownLabel}>Days</Text>
              </View>
              <View style={styles.countdownItem}>
                <Text style={styles.countdownValue}>{countdown.hours}</Text>
                <Text style={styles.countdownLabel}>Hours</Text>
              </View>
              <View style={styles.countdownItem}>
                <Text style={styles.countdownValue}>{countdown.minutes}</Text>
                <Text style={styles.countdownLabel}>Minutes</Text>
              </View>
              <View style={styles.countdownItem}>
                <Text style={styles.countdownValue}>{countdown.seconds}</Text>
                <Text style={styles.countdownLabel}>Seconds</Text>
              </View>
            </View>
          </View>

          <Text style={styles.detail}>📅 Date: November 10, 2025</Text>
          <Text style={styles.detail}>🕕 Time: 6:00 PM - 9:00 PM</Text>
          <Text style={styles.detail}>
            📍 Venue: The Royal Banquet Hall, Bhubaneswar
          </Text>

          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.mapButton} onPress={handleViewOnMap}>
              <Text style={styles.buttonText}>📍 View on Map</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.calendarButton}
              onPress={handleAddToCalendar}>
              <Text style={styles.buttonText}>📅 Add to Calendar</Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.footer}>Let’s make memories that last forever 💕</Text>
        </View>
      </ScrollView>
    </LinearGradient>
  );
};

export default Card;

const styles = StyleSheet.create({
  gradientBackground: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 30,
    minHeight: '100%',
  },
  container: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
    maxWidth: 500,
  },
  image: {
    width: '100%',
    borderRadius: 20,
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    color: '#e91e63',
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 10,
  },
  text: {
    fontSize: 16,
    color: '#555',
    textAlign: 'center',
    marginVertical: 10,
    lineHeight: 22,
  },
  countdownContainer: {
    backgroundColor: '#fff3e0',
    borderRadius: 15,
    padding: 15,
    marginVertical: 15,
    alignItems: 'center',
    width: '100%',
  },
  countdownTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#e91e63',
    marginBottom: 10,
  },
  countdownRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
  },
  countdownItem: {
    alignItems: 'center',
    paddingHorizontal: 5,
  },
  countdownValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#e91e63',
  },
  countdownLabel: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
  detail: {
    fontSize: 15,
    color: '#444',
    marginTop: 4,
    textAlign: 'center',
  },
  buttonContainer: {
    flexDirection: 'row',
    marginTop: 20,
    justifyContent: 'space-between',
    width: '100%',
  },
  mapButton: {
    flex: 1,
    backgroundColor: '#03a9f4',
    padding: 12,
    marginRight: 5,
    borderRadius: 10,
  },
  calendarButton: {
    flex: 1,
    backgroundColor: '#4caf50',
    padding: 12,
    marginLeft: 5,
    borderRadius: 10,
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
    textAlign: 'center',
  },
  footer: {
    marginTop: 25,
    fontSize: 14,
    color: '#888',
    fontStyle: 'italic',
    textAlign: 'center',
  },
});