import * as Calendar from 'expo-calendar';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useEffect, useState } from 'react';
import {
  Alert,
  Animated,
  Easing,
  Image,
  Linking,
  Platform,
  Share,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from 'react-native';

const Card = () => {
  const { width } = useWindowDimensions();
  const isMobile = width < 768;
  const [countdown, setCountdown] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [calendarPermissionsGranted, setCalendarPermissionsGranted] = useState(false);
  const [age, setAge] = useState(0);
  
  // Animation values
  const fadeAnim = useState(new Animated.Value(0))[0];
  const scaleAnim = useState(new Animated.Value(0.9))[0];
  const slideUpAnim = useState(new Animated.Value(30))[0];
  const countdownAnim = useState(new Animated.Value(0))[0];
  const glowAnim = useState(new Animated.Value(0))[0];

  // Countdown digit animations
  const [digitAnims] = useState({
    days: new Animated.Value(0),
    hours: new Animated.Value(0),
    minutes: new Animated.Value(0),
    seconds: new Animated.Value(0)
  });

  // Calculate age and countdown to next birthday
  useEffect(() => {
    const birthYear = 1999;
    const birthdayMonth = 10;
    const birthdayDay = 13;
    const birthdayHour = 0;
    const birthdayMinute = 0;

    const updateCountdownAndAge = () => {
      const now = new Date();
      let ageCalc = now.getFullYear() - birthYear;
      const currentMonth = now.getMonth();
      const currentDay = now.getDate();
      if (birthdayMonth > currentMonth || (birthdayMonth === currentMonth && birthdayDay > currentDay)) {
        ageCalc--;
      }
      setAge(ageCalc);

      let nextBirthday = new Date(now.getFullYear(), birthdayMonth, birthdayDay, birthdayHour, birthdayMinute, 0);
      if (nextBirthday < now) {
        nextBirthday.setFullYear(now.getFullYear() + 1);
      }
      const eventDate = nextBirthday.getTime();
      const difference = eventDate - now.getTime();

      if (difference > 0) {
        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((difference % (1000 * 60)) / 1000);
        
        // Animate countdown changes
        Animated.sequence([
          Animated.timing(countdownAnim, {
            toValue: 1,
            duration: 300,
            useNativeDriver: true,
          }),
          Animated.timing(countdownAnim, {
            toValue: 0,
            duration: 300,
            useNativeDriver: true,
          })
        ]).start();
        
        setCountdown({ days, hours, minutes, seconds });
      } else {
        setCountdown({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      }
    };

    updateCountdownAndAge();
    const interval = setInterval(updateCountdownAndAge, 1000);
    return () => clearInterval(interval);
  }, []);

  // Start animations
  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 800,
        easing: Easing.out(Easing.back(1.5)),
        useNativeDriver: true,
      }),
      Animated.timing(slideUpAnim, {
        toValue: 0,
        duration: 700,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.loop(
        Animated.sequence([
          Animated.timing(glowAnim, {
            toValue: 1,
            duration: 2000,
            easing: Easing.inOut(Easing.sin),
            useNativeDriver: true,
          }),
          Animated.timing(glowAnim, {
            toValue: 0,
            duration: 2000,
            easing: Easing.inOut(Easing.sin),
            useNativeDriver: true,
          })
        ])
      )
    ]).start();

    // Staggered countdown digit animations
    Animated.stagger(150, [
      Animated.timing(digitAnims.days, {
        toValue: 1,
        duration: 600,
        easing: Easing.out(Easing.back(1.2)),
        useNativeDriver: true,
      }),
      Animated.timing(digitAnims.hours, {
        toValue: 1,
        duration: 600,
        easing: Easing.out(Easing.back(1.2)),
        useNativeDriver: true,
      }),
      Animated.timing(digitAnims.minutes, {
        toValue: 1,
        duration: 600,
        easing: Easing.out(Easing.back(1.2)),
        useNativeDriver: true,
      }),
      Animated.timing(digitAnims.seconds, {
        toValue: 1,
        duration: 600,
        easing: Easing.out(Easing.back(1.2)),
        useNativeDriver: true,
      })
    ]).start();
  }, []);

  // Request permissions
  useEffect(() => {
    if (Platform.OS !== 'web') {
      (async () => {
        const { status } = await Calendar.requestCalendarPermissionsAsync();
        setCalendarPermissionsGranted(status === 'granted');
      })();
    }
  }, []);

  const formatDateForGoogle = (date: Date): string => {
    return date.toISOString().slice(0, -1).replace(/[-:]/g, '');
  };

  const getNextBirthday = () => {
    const birthdayMonth = 10;
    const birthdayDay = 13;
    const now = new Date();
    let nextBirthday = new Date(now.getFullYear(), birthdayMonth, birthdayDay, 0, 0, 0);
    if (nextBirthday < now) {
      nextBirthday.setFullYear(now.getFullYear() + 1);
    }
    return nextBirthday;
  };

  const handleAddToCalendar = async () => {
    try {
      const startDate = getNextBirthday();
      const endDate = new Date(startDate.getTime() + 24 * 60 * 60 * 1000);

      if (Platform.OS === 'web') {
        const googleText = encodeURIComponent(`Subhasmita's Birthday ✨`);
        const upcomingAge = age + 1;
        const googleDetails = encodeURIComponent(`Celebrating Subhasmita Priyadarshini's birthday! Turning ${upcomingAge}`);
        const googleDates = `${formatDateForGoogle(startDate)}/${formatDateForGoogle(endDate)}`;
        const googleUrl = `https://calendar.google.com/calendar/u/0/r/eventedit?text=${googleText}&dates=${googleDates}&details=${googleDetails}&recur=RRULE:FREQ=YEARLY`;
        Linking.openURL(googleUrl);
        Alert.alert('📅 Calendar', 'Reminder ready!');
        return;
      }

      if (!calendarPermissionsGranted) {
        Alert.alert('Permission', 'Calendar access needed.');
        return;
      }

      const upcomingAge = age + 1;
      const eventData = {
        title: `Subhasmita's Birthday ✨`,
        startDate,
        endDate,
        timeZone: 'Asia/Kolkata',
        allDay: true,
        notes: `Celebrating Subhasmita Priyadarshini's birthday! Turning ${upcomingAge}`,
        alarms: [{ relativeOffset: 0 }],
        recurrenceRule: { frequency: Calendar.Frequency.YEARLY, interval: 1 },
      };

      const result = await Calendar.createEventInCalendarAsync(eventData);
      if (result.action === 'saved' || result.action === 'done') {
        Alert.alert('✨ Added', 'Reminder set!');
      }
    } catch (error) {
      Alert.alert('Error', 'Unable to add event.');
    }
  };

  const handleShare = async () => {
    try {
      const upcomingAge = age + 1;
      const shareMessage = `Celebrating Subhasmita Priyadarshini's birthday! 🎉 Turning ${upcomingAge}! Join the celebration!`;
      await Share.share({ message: shareMessage });
    } catch (error) {
      Alert.alert('Error', 'Unable to share.');
    }
  };

  return (
    <LinearGradient
      colors={['#0A0A2A', '#1A1A4A', '#2A2A6A']}
      style={styles.gradientBackground}
    >
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
      
      {/* Animated background elements */}
      <View style={styles.backgroundElements}>
        <Animated.View 
          style={[
            styles.floatingOrb, 
            styles.orb1,
            {
              transform: [{
                translateY: glowAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0, -20]
                })
              }]
            }
          ]} 
        />
        <Animated.View 
          style={[
            styles.floatingOrb, 
            styles.orb2,
            {
              transform: [{
                translateY: glowAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0, 15]
                })
              }]
            }
          ]} 
        />
        <Animated.View 
          style={[
            styles.floatingOrb, 
            styles.orb3,
            {
              transform: [{
                translateY: glowAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0, -10]
                })
              }]
            }
          ]} 
        />
        <Animated.View 
          style={[
            styles.floatingOrb, 
            styles.orb4,
            {
              transform: [{
                translateY: glowAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0, 12]
                })
              }]
            }
          ]} 
        />
      </View>
      
      <Animated.View 
        style={[
          styles.container, 
          { 
            width: isMobile ? '100%' : '38%',
            maxWidth: 420,
            opacity: fadeAnim,
            transform: [
              { scale: scaleAnim },
              { translateY: slideUpAnim }
            ]
          }
        ]}
      >
        {/* Main Card */}
        <View style={styles.card}>
          
          {/* Header Section */}
          <LinearGradient
            colors={['#667eea', '#764ba2', '#5A4FCF']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.header}
          >
            <View style={styles.headerContent}>
              <Text style={styles.name}>Subhasmita Priyadarshini</Text>
              {/* <Text style={styles.age}>Turning {age + 1} ✨</Text> */}
            </View>
            <View style={styles.headerPattern} />
          </LinearGradient>

          {/* Profile Section */}
          <View style={styles.profileSection}>
            <Animated.View 
              style={[
                styles.imageContainer,
                {
                  transform: [{
                    scale: fadeAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: [0.8, 1]
                    })
                  }]
                }
              ]}
            >
              <Image
             source={require("@/assets/images/Subhasmita.jpg")}
                style={styles.image}
              />
              <Animated.View 
                style={[
                  styles.imageGlow,
                  {
                    opacity: glowAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: [0.2, 0.5]
                    })
                  }
                ]}
              />
            </Animated.View>
          </View>

          {/* Content Section */}
          <View style={styles.content}>
            {/* Message */}
            <Text style={styles.message}>
              "Every year is a new chapter, every birthday a new beginning. Here's to writing another beautiful story! ✨"
            </Text>

            {/* Countdown Section - Overlapping Balls */}
            <Animated.View style={[styles.countdownContainer, { opacity: fadeAnim }]}>
              <Text style={styles.countdownTitle}>Countdown to Celebration</Text>
              <View style={styles.countdownOverlapContainer}>
                {[
                  { value: countdown.days, label: 'DAYS', color: '#8B5FBF', zIndex: 40 },
                  { value: countdown.hours, label: 'HOURS', color: '#FF6B95', zIndex: 30 },
                  { value: countdown.minutes, label: 'MINS', color: '#4ECDC4', zIndex: 20 },
                  { value: countdown.seconds, label: 'SECS', color: '#FFD93D', zIndex: 10 },
                ].map((item, index) => (
                  <View 
                    key={index} 
                    style={[
                      styles.countdownOverlapItem,
                      { 
                        zIndex: item.zIndex,
                        marginLeft: index === 0 ? 0 : -15 // Overlap by pushing each item to the left
                      }
                    ]}
                  >
                    <LinearGradient
                      colors={[item.color, `${item.color}CC`]}
                      style={styles.countdownCircle}
                    >
                      <Text style={styles.countdownValue}>{item.value}</Text>
                    </LinearGradient>
                    <Text style={styles.countdownLabel}>{item.label}</Text>
                  </View>
                ))}
              </View>
            </Animated.View>

            {/* Action Buttons - Now Vertical */}
            <View style={styles.buttonContainer}>
              <TouchableOpacity
                onPress={handleAddToCalendar}
                activeOpacity={0.8}
                style={styles.buttonTouchable}
              >
                <LinearGradient
                  colors={['#667eea', '#764ba2']}
                  style={styles.button}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                >
                  <View style={styles.buttonContent}>
                    <Text style={styles.buttonIcon}>📅</Text>
                    <Text style={styles.buttonText}>Add to Calendar</Text>
                  </View>
                  <View style={styles.buttonGlow} />
                </LinearGradient>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={handleShare}
                activeOpacity={0.8}
                style={styles.buttonTouchable}
              >
                <LinearGradient
                  colors={['#FF6B95', '#FF8E53']}
                  style={styles.button}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                >
                  <View style={styles.buttonContent}>
                    <Text style={styles.buttonIcon}>🎉</Text>
                    <Text style={styles.buttonText}>Share Celebration</Text>
                  </View>
                  <View style={styles.buttonGlow} />
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </View>

          {/* Footer */}
          <View style={styles.footer}>
            <Text style={styles.footerText}>Made with ❤️ for Subhasmita</Text>
          </View>
        </View>
      </Animated.View>
    </LinearGradient>
  );
};

export default Card;

const styles = StyleSheet.create({
  gradientBackground: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  backgroundElements: {
    position: 'absolute',
    width: '100%',
    height: '100%',
  },
  floatingOrb: {
    position: 'absolute',
    borderRadius: 50,
  },
  orb1: {
    width: 140,
    height: 140,
    backgroundColor: '#FF6B95',
    top: '15%',
    left: '5%',
    opacity: 0.4,
    filter: 'blur(20px)',
  },
  orb2: {
    width: 100,
    height: 100,
    backgroundColor: '#667eea',
    bottom: '20%',
    right: '8%',
    opacity: 0.3,
    filter: 'blur(15px)',
  },
  orb3: {
    width: 80,
    height: 80,
    backgroundColor: '#764ba2',
    top: '65%',
    left: '15%',
    opacity: 0.35,
    filter: 'blur(12px)',
  },
  orb4: {
    width: 60,
    height: 60,
    backgroundColor: '#FF8E53',
    top: '25%',
    right: '20%',
    opacity: 0.4,
    filter: 'blur(10px)',
  },
  container: {
    borderRadius: 28,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 25 },
    shadowOpacity: 0.5,
    shadowRadius: 40,
    elevation: 20,
  },
  card: {
    backgroundColor: 'rgba(25, 25, 45, 0.85)',
    backdropFilter: 'blur(20px)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.15)',
    overflow: 'hidden',
  },
  header: {
    paddingVertical: 30,
    paddingHorizontal: 24,
    alignItems: 'center',
    position: 'relative',
  },
  headerPattern: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(255,255,255,0.05)',
    opacity: 0.3,
  },
  headerContent: {
    alignItems: 'center',
    zIndex: 2,
  },
  name: {
    fontSize: 20,
    fontWeight: '800',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 12,
    textShadowColor: 'rgba(0, 0, 0, 0.4)',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 5,
    letterSpacing: 0.5,
  },
  age: {
    fontSize: 16,
    color: '#FFFFFF',
    fontWeight: '700',
    textAlign: 'center',
    opacity: 0.95,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  profileSection: {
    alignItems: 'center',
    marginTop: -40,
    zIndex: 10,
  },
  imageContainer: {
    position: 'relative',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 15,
  },
  image: {
    width: 90,
    height: 90,
    borderRadius: 45,
    borderWidth: 4,
    borderColor: 'rgba(255, 255, 255, 0.4)',
    zIndex: 2,
  },
  imageGlow: {
    position: 'absolute',
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#667eea',
    top: -5,
    left: -5,
    zIndex: 1,
  },
  content: {
    padding: 24,
  },
  message: {
    fontSize: 15,
    color: 'rgba(255, 255, 255, 0.85)',
    textAlign: 'center',
    marginBottom: 18,
    fontWeight: '500',
    fontStyle: 'italic',
    letterSpacing: 0.3,
  },
  // Countdown Section with Overlapping Balls
  countdownContainer: {
    marginBottom: 25,
    alignItems: 'center',
  },
  countdownTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 20,
    letterSpacing: 0.5,
  },
  countdownOverlapContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  countdownOverlapItem: {
    alignItems: 'center',
  },
  countdownCircle: {
    width: 70,
    height: 70,
    borderRadius: 35,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.4,
    shadowRadius: 15,
    elevation: 12,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  countdownValue: {
    fontSize: 18,
    fontWeight: '800',
    color: '#FFFFFF',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  countdownLabel: {
    fontSize: 11,
    color: '#B0B0B0',
    fontWeight: '700',
    letterSpacing: 0.5,
    textAlign: 'center',
    marginTop: 4,
  },
  // Updated Button Styles for Vertical Layout
  buttonContainer: {
    flexDirection: 'column',
    gap: 12,
  },
  buttonTouchable: {
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 15,
    elevation: 10,
  },
  button: {
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 16,
    alignItems: 'center',
    position: 'relative',
    overflow: 'hidden',
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 2,
  },
  buttonIcon: {
    fontSize: 18,
    marginRight: 8,
  },
  buttonText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 15,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
    letterSpacing: 0.5,
  },
  buttonGlow: {
    position: 'absolute',
    top: 0,
    left: '-100%',
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    transform: [{ skewX: '-20deg' }],
  },
  footer: {
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.1)',
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
  },
  footerText: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.6)',
    textAlign: 'center',
    fontWeight: '500',
  },
});