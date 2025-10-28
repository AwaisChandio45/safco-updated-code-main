import React, {useState, useEffect} from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  ScrollView,
  Dimensions,
  Animated,
  Vibration,
} from 'react-native';
import Colors from '../theme/Colors';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AntDesign from 'react-native-vector-icons/AntDesign';
 
const NotificationModal = ({modalVisible, notificationsData, onClose}) => {
  const [vibrateAnimation] = useState(new Animated.Value(0));
  const [vibrationStarted, setVibrationStarted] = useState(false);
  const [imageDimensions, setImageDimessions] = useState({
    width: null,
    height: null,
  });
 
  useEffect(() => {
    let timOutId;
 
    if (modalVisible && !vibrationStarted) {
      startVibrationAnimation();
      timOutId = setTimeout(stopVibrationAnimation, 3000);
      setVibrationStarted(true);
    } else if (!modalVisible) {
      stopVibrationAnimation();
      setVibrationStarted(false);
    }
    return () => clearTimeout(timOutId);
  }, [modalVisible, vibrationStarted]);
 
  const startVibrationAnimation = () => {
    Animated.sequence([
      Animated.timing(vibrateAnimation, {
        toValue: 10,
        duration: 50,
        useNativeDriver: true,
      }),
      Animated.timing(vibrateAnimation, {
        toValue: -10,
        duration: 50,
        useNativeDriver: true,
      }),
      Animated.timing(vibrateAnimation, {
        toValue: 0,
        duration: 50,
        useNativeDriver: true,
      }),
    ]).start(({finished}) => {
      if (finished) {
        for (let i = 0; i < 4 || i < 5; i++) {
          Animated.sequence([
            Animated.timing(vibrateAnimation, {
              toValue: 10,
              duration: 50,
              useNativeDriver: true,
            }),
            Animated.timing(vibrateAnimation, {
              toValue: -10,
              duration: 50,
              useNativeDriver: true,
            }),
            Animated.timing(vibrateAnimation, {
              toValue: 0,
              duration: 50,
              useNativeDriver: true,
            }),
          ]).start();
        }
      }
    });
  };
  const stopVibrationAnimation = () => {
    vibrateAnimation.setValue(0);
    Vibration.cancel();
  };
  const handleImageLoad = event => {
    const {width, height} = event.nativeEvent.source;
    const aspectRatio = width / height;
    const maxWidth = windowWidth * 0.8;
    const calculateHeight = maxWidth / aspectRatio;
    setImageDimessions({width: maxWidth, height: calculateHeight});
  };
  return (
    <Modal
  animationType="slide"
  transparent={true}
  visible={modalVisible}
  onRequestClose={onClose}
>
  <View style={styles.modalContainer}>
    <View style={styles.modalContent}>
      <View style={styles.headerContainer}>
        <Animated.View
          style={[
            styles.iconContainer,
            { transform: [{ translateX: vibrateAnimation }] },
          ]}
        >
          <Ionicons name="notifications" size={50} color="#FFF" />
        </Animated.View>
      </View>
      <ScrollView contentContainerStyle={styles.scrollView}>
        {notificationsData.map((notification) => (
          <View
            key={notification.AnnounceId}
            style={styles.notificationItem}
          >
            <Text style={styles.notificationDescription}>
              {notification.Description}
            </Text>
            {notification.ImagePath ? (
              <View
                style={[
                  styles.imageContainer,
                  {
                    width: imageDimensions.width || '100%',
                    height: imageDimensions.height || undefined,
                  },
                ]}
              >

<Image
                      source={{
                        uri: `http://hr.safcomicrofinance.com.pk/${notification.ImagePath.replace(
                          '../../',
                          '',
                        )}`,
                      }}
              
                  style={[
                    styles.fullImage,
                    {
                      width: imageDimensions.width,
                      height: imageDimensions.height,
                    },
                  ]}
                  resizeMode="contain"
                  onLoad={handleImageLoad}
                />
              </View>
            ) : (
              <View style={styles.noImage} />
            )}
            <Text
              style={{
                fontSize: 16,
                lineHeight: 24,
                marginBottom: 10,
                marginTop: 10,
                color: Colors.black,
                fontWeight: '400',
                alignSelf: 'center',
              }}
            >
              <Text style={{ fontWeight: 'bold', textAlign: 'center' }}>
                AddedOn :{' '}
              </Text>
              {notification.AddedOn}
            </Text>
          </View>
        ))}
      </ScrollView>
      <TouchableOpacity onPress={onClose} style={styles.closeButton}>
        <AntDesign name="closecircle" color={Colors.white} size={22} />
      </TouchableOpacity>
    </View>
  </View>
</Modal>

  );
};
 
const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;
 
const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
  },
  modalContent: {
    backgroundColor: '#FFF',
    borderRadius: 20,
    width: windowWidth * 0.9,
    maxHeight: windowHeight * 0.8,
    paddingVertical: 20,
    paddingHorizontal: 10,
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 10,
    marginBottom: 20,
  },
  headerText: {
    fontSize: 20,
    color: Colors.primary,
    fontFamily: 'YOUR_FONT_BOLD',
  },
  iconContainer: {
    backgroundColor: Colors.parrotGreenColor,
    width: 80,
    height: 80,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 20,
    position: 'absolute',
    top: -50,
  },
  scrollView: {
    flexGrow: 1,
    paddingBottom: 20,
  },
  notificationItem: {
    marginBottom: 20,
    marginTop: 20,
  },
  notificationDescription: {
    fontSize: 16,
    lineHeight: 24,
    alignSelf: 'center',
    marginBottom: 10,
    color: '#1E0342',
    fontWeight: '500',
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  imageContainer: {
    borderRadius: 15,
    overflow: 'hidden',
    justifyContent: 'center',
  },
  fullImage: {
    flex: 1,
  },
  noImage: {
    height: 0,
  },
  closeButton: {
    backgroundColor: Colors.red,
    borderRadius: 25,
    borderColor: Colors.white,
    borderWidth: 3.5,
    padding: 10,
    alignSelf: 'center',
    justifyContent: 'center',
    marginTop: 20,
    position: 'absolute',
    overflow: 'hidden',
    bottom: -25,
  },
});
export default NotificationModal;
 