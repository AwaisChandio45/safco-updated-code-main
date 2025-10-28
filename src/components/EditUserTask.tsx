import {
  SafeAreaView,
  Text,
  View,
  StyleSheet,
  Dimensions,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Pressable,
  Linking,
  PermissionsAndroid,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {openDatabase} from 'react-native-sqlite-storage';
import {connect, useSelector} from 'react-redux';

import {useNavigation, useRoute} from '@react-navigation/native';
let dbb = openDatabase({name: 'UserDatabase.dbb'});
const EditUserTask = () => {
  const route = useRoute();
  console.log(route.params.data);
  const navigation = useNavigation();
  const [taskname, setTaskName] = useState('');
  const [destination, setDestination] = useState('');
  const [branchname, setBranchName] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState('Open');
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [currentDate, setCurrentDate] = useState('');

  const firstNameRedux = useSelector(
    state => state.UserData?.UserData?.FirstName,
  );
  const [firstName, setFirstName] = useState(firstNameRedux);

  const [location, setLocation] = useState({latitude: null, longitude: null});
  const updateUser = () => {
    dbb.transaction(tx => {
      tx.executeSql(
        'UPDATE table_user set taskname=?, destination=? , branchname=? , selectedDate=? , currentDate=? , firstName=? , status=? , description=? , location=?   where user_id=?',
        [
          taskname,
          destination,
          branchname,
          selectedDate,
          currentDate,
          firstName,
          status,
          description,
          location,
          route.params.data.id,
        ],
        (tx, results) => {
          console.log('Results', results.rowsAffected);
          if (results.rowsAffected > 0) {
            Alert.alert(
              'Success',
              'User updated successfully',
              [
                {
                  text: 'Ok',
                  onPress: () => navigation.navigate('ViewTask'),
                },
              ],
              {cancelable: false},
            );
          } else alert('Updation Failed');
        },
      );
    });
  };
  useEffect(() => {
    setTaskName(route.params.data.taskname);
    setDestination(route.params.data.destination);
    setBranchName(route.params.data.branchname);
    setSelectedDate(route.params.data.selectedDate);

    setCurrentDate(route.params.data.currentDate);
    setFirstName(route.params.data.firstName);
    setStatus(route.params.data.status);
    setDescription(route.params.data.description);
    setLocation(route.params.data.location);
  }, []);

  useEffect(() => {
    setFirstName(firstNameRedux);
  }, [firstNameRedux]);

  useEffect(() => {
    const date = new Date().toLocaleDateString();
    setCurrentDate(date);
  }, []);

  const showDatePicker = () => {
    setDatePickerVisibility(true);
  };

  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };

  const handleConfirm = date => {
    setSelectedDate(date);
    hideDatePicker();
  };

  useEffect(() => {
    requestLocationPermission();
  }, []);

  const requestLocationPermission = async () => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        {
          title: 'Location Permission',
          message: 'App needs access to your location.',
          buttonNeutral: 'Ask Me Later',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        },
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        getCurrentLocation();
      } else {
        console.log('Location permission denied');
      }
    } catch (err) {
      console.warn(err);
    }
  };

  const getCurrentLocation = () => {
    Geolocation.getCurrentPosition(
      position => {
        const {latitude, longitude} = position.coords;
        setLocation({latitude, longitude});
      },
      error => {
        console.log(error.message);
      },
      {enableHighAccuracy: true, timeout: 20000, maximumAge: 1000},
    );
  };

  const openMaps = () => {
    const {latitude, longitude} = location;
    if (latitude !== null && longitude !== null) {
      const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}`;

      Linking.openURL(mapsUrl).catch(err =>
        console.error('Error opening maps:', err),
      );
    } else {
      console.log('Latitude and longitude are not available yet.');
    }
  };
  return (
    <SafeAreaView style={{flex: 1, padding: 17, backgroundColor: '#fff'}}>
      <View style={styles.formContainer}>
        <View style={styles.logoContainer}>
          <View style={styles.logoContainerSecondLayer}>
            <MaterialCommunityIcons
              name="clipboard-text-outline"
              color="#fff"
              size={50}
            />
          </View>
        </View>
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={styles.row2}>
            <FormInputs
              text={'Task Name'}
              value={taskname}
              onChangeText={txt => setTaskName(txt)}></FormInputs>

            <FormInputs
              style={{position: 'relative', left: 5}}
              text={'Destination'}
              value={destination}
              onChangeText={txt => setDestination(txt)}></FormInputs>
          </View>

          <View style={styles.row2}>
            <FormInputs
              text={'Branch Name'}
              value={branchname}
              onChangeText={txt => setBranchName(txt)}></FormInputs>

            <Pressable onPressIn={() => setDatePickerVisibility(true)}>
              <View style={[GlobalStyles.row, styles.inputdesign]}>
                <TextView
                  style={{color: '#727272', marginLeft: 10}}
                  type={'normalMini'}
                  text={
                    selectedDate
                      ? selectedDate.toLocaleDateString()
                      : 'From to Date'
                  }></TextView>
                <MaterialCommunityIcons
                  name="calendar"
                  color={'#245e46'}
                  size={26}></MaterialCommunityIcons>
              </View>
            </Pressable>
            <DateTimePickerModal
              isVisible={isDatePickerVisible}
              mode="date"
              onConfirm={handleConfirm}
              onCancel={hideDatePicker}
            />
          </View>

          <View style={styles.row2}>
            <FormInputs
              text={'Auto Current Date'}
              value={currentDate}
              onChangeText={txt => setCurrentDate(txt)}
              editable={false}
            />

            <FormInputs
              style={{position: 'relative', left: 5}}
              text={'User Name'}
              value={firstName}
              onChangeText={value => setFirstName(value)}
              editable={false}
            />
          </View>

          <View style={styles.row2}>
            <FormInputs value={status} text={'Status'} editable={false} />

            <TouchableOpacity onPress={openMaps}>
              <FormInputs
                style={{position: 'relative', left: 5}}
                text={'Current Location'}
                value={'Location'}
                editable={false}></FormInputs>
            </TouchableOpacity>
          </View>

          <TextView style={styles.textnote} text="Description"></TextView>
          <View>
            <TextInput
              style={styles.notes}
              value={description}
              multiline={true}
              onChangeText={txt => setDescription(txt)}></TextInput>
          </View>

          <TouchableOpacity
            style={styles.addBtn}
            onPress={() => {
              updateUser();
            }}>
            <TextView
              style={{color: '#FFF', alignSelf: 'center'}}
              text="Save task"></TextView>
          </TouchableOpacity>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

export default EditUserTask;
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  input: {
    width: '80%',
    height: 50,
    borderRadius: 10,
    borderWidth: 0.3,
    alignSelf: 'center',
    paddingLeft: 20,
    marginTop: 100,
  },
  addBtn: {
    backgroundColor: 'purple',
    width: '80%',
    height: 50,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 30,
    alignSelf: 'center',
  },
  btnText: {
    color: '#fff',
    fontSize: 18,
  },
  formContainer: {
    backgroundColor: '#fff',
    elevation: 10,
    padding: 20,
    marginTop: 30,
    borderRadius: 10,
  },
  inputContainer: {marginTop: 13},
  textViewStyle: {fontSize: 12, marginLeft: 10, fontFamily: FONTS.FONT_REGULAR},
  textContainer: {padding: 10, borderWidth: 1},
  logoContainer: {alignItems: 'center'},
  logoContainerSecondLayer: {
    backgroundColor: Colors.parrotGreenColor,
    elevation: 10,
    width: 80,
    height: 80,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 50,
    marginTop: '-19%',
  },
  row2: {
    marginTop: 0,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingBottom: 20,
  },
  row3: {marginBottom: -25},
  notes: {
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#cdcdcd',
    marginBottom: 30,
    textAlignVertical: 'top',
    marginTop: 10,
    height: 100,
    padding: 10,
    width: width / 1.3,
  },
  textnote: {color: '#7d7d7d', fontSize: 12, marginTop: 10, marginLeft: 20},
  button: {
    backgroundColor: Colors.parrotGreenColor,
    width: width / 2.5,
    height: 60,
    justifyContent: 'center',
    borderRadius: 10,
    elevation: 10,
    alignSelf: 'center',
    marginTop: 5,
  },
  inputdesign: {
    justifyContent: 'space-between',
    paddingTop: 15,
    backgroundColor: '#f1f1f1',
    height: 50,
    paddingRight: 15,
    marginTop: 5,
    borderBottomColor: '#cdcdcd',
    borderBottomWidth: 1,
    marginBottom: 15,
    width: width / 2.5,
    borderRadius: 3,
    position: 'relative',
    left: 5,
    top: 10,
  },
});
