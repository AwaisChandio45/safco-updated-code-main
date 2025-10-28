
import Geolocation from '@react-native-community/geolocation';
import GeolocationService from 'react-native-geolocation-service';
import {Alert, PermissionsAndroid, Platform} from 'react-native';
export const getCurrentLocation = async (callback) => {
  if (Platform.OS == 'android') {
    const granted_ACCESS_FINE_LOCATION = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
    );
    if (granted_ACCESS_FINE_LOCATION === PermissionsAndroid.RESULTS.GRANTED) {
      GeolocationService.getCurrentPosition(
        (position) => {
          callback(position);
        },
        (error) => {
          callback(null, false);
        },
        {enableHighAccuracy: true, timeout: 20000, maximumAge: 0},
      );
    } else {
      Alert.alert(
        'Location Error',
        "Can't get You Location, Please Give permission for Location",
        [{text: 'OK', onPress: () => callback(null)}],
        {cancelable: false},
      );
    }
  } else {
    Geolocation.getCurrentPosition(
      (position) => {
        callback(position);
      },
      (error) => {
        callback(null, false);
      },
      {enableHighAccuracy: false, timeout: 60000, maximumAge: 1000},
    );
  }
};
 
