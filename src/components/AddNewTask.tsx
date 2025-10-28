import React, {useEffect, useState} from 'react';
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
  Alert,
} from 'react-native';
import {GlobalStyles, Colors} from '../theme';
import {FONTS} from '../theme/Fonts';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {getUserComplain, ComplainMis} from '../apis_auth/apis';
const {height, width} = Dimensions.get('window');
import {useNavigation} from '@react-navigation/native';
import TextView from './TextView';
import FormInputs from './FormInputs';
import DateSelector from './DateSelector';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import {connect, useSelector} from 'react-redux';
import Geolocation from '@react-native-community/geolocation';
import {openDatabase} from 'react-native-sqlite-storage';
let dbb = openDatabase({name: 'UserDatabase.dbb'});

export default function AddNewTask() {
  const navigation = useNavigation();
  const [taskname, setTaskName] = useState(''); //task name
  const [destination, setDestination] = useState(''); // destination
  const [branchname, setBranchName] = useState(''); //branchname
  const [description, setDescription] = useState(''); //description
  const [status, setStatus] = useState(1);
  const [start_date, setSelectedDate] = useState(null); // Hold the selected date
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);

  const [end_date, setSelectedEndDate] = useState(null); // Hold the selected date
  const [isDatePickerVisibleend, setDatePickerVisibilityEnd] = useState(false);
  const [currentDate, setCurrentDate] = useState('');
  const firstNameRedux = useSelector(
    state => state.UserData?.UserData?.FirstName,
  ); // Get the first name from Redux state
  const [firstname, setFirstName] = useState(firstNameRedux); // Initialize local state with the first name from Redux
  const [location, setLocation] = useState({latitude: null, longitude: null});
  const employeeid = useSelector(state => state.UserData?.UserData?.EmployeeId);
  // console.log('data---------->>>>>',EmployeeId);
  //console.log('longitite+ latitude=======>',location)

  const handleAddTask = () => {
    if (!taskname || !destination || !branchname || !start_date || !end_date) {
      Alert.alert('Error', 'Please fill out all fields are required.');
      return;
    }
    const locations = JSON.stringify(location);
    //console.log('Task Data all :======>',locations)
    dbb.transaction(function (tx) {
      tx.executeSql(
        'INSERT INTO table_user (taskname, destination, branchname, start_date, end_date, firstname, status, description, locations, employeeid) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
        [
          taskname,
          destination,
          branchname,
          start_date,
          end_date,
          firstname,
          status,
          description,
          locations,
          employeeid,
        ],
        (tx, results) => {
          console.log('Results', results.rowsAffected);
          if (results.rowsAffected > 0) {
            Alert.alert(
              'Success',
              'Your Task added Successfully',
              [
                {
                  text: 'Ok',
                  onPress: () => navigation.navigate('ViewTask'),
                },
              ],
              {cancelable: false},
            );
          } else {
            Alert.alert(
              'Error',
              'Registration Failed',
              [
                {
                  text: 'Ok',
                },
              ],
              {cancelable: false},
            );
          }
        },
        error => {
          console.log(error);
          Alert.alert(
            'Error',
            'An error occurred while adding the task',
            [
              {
                text: 'Ok',
              },
            ],
            {cancelable: false},
          );
        },
      );
    });
  };
  useEffect(() => {
    dbb.transaction(txn => {
      txn.executeSql(
        "SELECT name FROM sqlite_master WHERE type='table' AND name='table_user'",
        [],
        (tx, res) => {
          console.log('item:', res.rows.length);
          if (res.rows.length == 0) {
            txn.executeSql('DROP TABLE IF EXISTS table_user', []);
            txn.executeSql(
              'CREATE TABLE IF NOT EXISTS table_user(to_do_taskId_id INTEGER PRIMARY KEY AUTOINCREMENT, taskname VARCHAR(20), destination VARCHAR(50), branchname VARCHAR(100) , start_date VARCHAR(100), end_date VARCHAR(100),  firstname VARCHAR(50), status VARCHAR(10) , description VARCHAR(100) , locations VARCHAR(100),  employeeid VARCHAR(100))',
              [],
            );
          }
        },
        error => {
          console.log(error);
        },
      );
    });
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
    setSelectedDate(date); // Update selected date
    hideDatePicker();
  };

  // end_date code
  const showDatePickerend = () => {
    setDatePickerVisibilityEnd(true);
  };

  const hideDatePickerend = () => {
    setDatePickerVisibilityEnd(false);
  };

  const handleConfirmEnd = date => {
    setSelectedEndDate(date); // Update selected date
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
      const mapsUrl = `geo:${latitude},${longitude}`;
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
              required={true}
              value={taskname}
              onChangeText={txt => setTaskName(txt)}></FormInputs>

            <FormInputs
              style={{position: 'relative', left: 5}}
              text={'Destination'}
              required={true}
              value={destination}
              onChangeText={txt => setDestination(txt)}></FormInputs>
          </View>

          <View style={styles.row2}>
            <FormInputs
              text={'Branch Name'}
              required={true}
              value={branchname}
              onChangeText={txt => setBranchName(txt)}></FormInputs>

            <Pressable onPressIn={() => setDatePickerVisibility(true)}>
              <View style={[GlobalStyles.row, styles.inputdesign]}>
                <TextView
                  style={{color: '#727272', marginLeft: 10}}
                  type={'normalMini'}
                  text={
                    start_date ? start_date.toLocaleDateString() : 'Start Date'
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
            <Pressable onPressIn={() => setDatePickerVisibilityEnd(true)}>
              <View style={[GlobalStyles.row, styles.inputdesign]}>
                <TextView
                  style={{color: '#727272', marginLeft: 10}}
                  type={'normalMini'}
                  text={
                    end_date ? end_date.toLocaleDateString() : 'End Date'
                  }></TextView>
                <MaterialCommunityIcons
                  name="calendar"
                  color={'#245e46'}
                  size={26}></MaterialCommunityIcons>
              </View>
            </Pressable>
            <DateTimePickerModal
              isVisible={isDatePickerVisibleend}
              mode="date"
              onConfirm={handleConfirmEnd}
              onCancel={hideDatePickerend}
            />

            <FormInputs
              style={{position: 'relative', left: 5}}
              text={'User Name'}
              value={firstname}
              onChangeText={value => setFirstName(value)}
              editable={false}
            />
          </View>

          <View style={styles.row2}>
            <FormInputs
              value={status === 1 ? 'Open' : 'Close'}
              text={'Status'}
              editable={false}
            />

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

          <TouchableOpacity style={styles.button} onPress={handleAddTask}>
            <TextView
              style={{color: '#FFF', alignSelf: 'center'}}
              text="Add task"></TextView>
          </TouchableOpacity>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
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
