import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Alert,
  Image,
  Dimensions,
  ScrollView,
  Button,
  Linking,
} from 'react-native';
import React, {useEffect, useState, useRef} from 'react';
import {useIsFocused, useNavigation} from '@react-navigation/native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import {connect, useSelector} from 'react-redux';
import {Modalize} from 'react-native-modalize';
import TextView from './TextView';
import {openDatabase} from 'react-native-sqlite-storage';
import {Table, Row} from 'react-native-table-component';
import axios from 'axios';
let dbb = openDatabase({name: 'UserDatabase.dbb'});

const ViewTask = () => {
  const [location, setLocation] = useState(null);
  const [userList, setUserList] = useState([]);
  //console.log('data-all userlist--------->>>>>',userList);
  const [selectedItem, setSelectedItem] = useState(null);
  const modalizeRef = useRef(null);
  const {height, width} = Dimensions.get('window');
  const isFocused = useIsFocused();
  const [filteredUserList, setFilteredUserList] = useState([]);
  const [taskSynced, setTaskSynced] = useState([]);
  const EmployeeIdRedux = useSelector(
    state => state.UserData?.UserData?.EmployeeId,
  );

  useEffect(() => {
    if (userList && EmployeeIdRedux) {
      const filteredList = userList
        .filter(user => user.employeeid === EmployeeIdRedux)
        .map(item => {
          const {locations, ...rest} = item;
          const location = JSON.parse(item.locations);
          // Parse status to convert it into number
          const status = parseInt(item.status);
          return {
            ...rest,
            status, // Set the parsed status
            location,
          };
        });
      setFilteredUserList(filteredList);
    }
  }, [userList, EmployeeIdRedux]);

  useEffect(() => {
    getData();
  }, [isFocused]);

  const getData = () => {
    dbb.transaction(tx => {
      tx.executeSql('SELECT * FROM table_user', [], (tx, results) => {
        var temp = [];
        for (let i = 0; i < results.rows.length; ++i)
          temp.push(results.rows.item(i));
        setUserList(temp);
      });
    });
  };
  const onOpen = item => {
    console.log('Selected item:--->>', item);
    sendDataToAPI(item); // Pass the selected item to the function
    setSelectedItem(item);
    modalizeRef.current?.open();
  };
  let deleteUser = id => {
    Alert.alert(
      'Are you sure?',
      'Are you really want to delete?',
      [
        {
          text: 'Cancel',
          onPress: () => console.log('Cancel Pressed'),
          style: 'cancel',
        },
        {
          text: 'OK',
          onPress: () => {
            dbb.transaction(
              tx => {
                tx.executeSql(
                  'DELETE FROM table_user where to_do_taskId_id=?',
                  [id],
                  (tx, results) => {
                    console.log('Results', results.rowsAffected);
                    if (results.rowsAffected > 0) {
                      // User deleted successfully
                      getData(); // Update data
                    } else {
                      // No rows affected, alert for invalid User ID
                      alert('Please insert a valid User Id');
                    }
                  },
                );
              },
              error => {
                console.error('Transaction error: ', error.message);
              },
              () => {},
            );
          },
        },
      ],
      {cancelable: false},
    );
  };

  const handleButtonPress = () => {
    try {
      if (!selectedItem || !selectedItem.location) {
        // Update to selectedItem.location
        console.error('Location data is missing.');
        return;
      }
      const {latitude, longitude} = selectedItem.location; // Update to selectedItem.location
      if (!latitude || !longitude) {
        console.error('Latitude or longitude is missing in location data.');
        return;
      }
      setLocation({
        latitude: latitude,
        longitude: longitude,
      });
      openMap(latitude, longitude);
    } catch (error) {
      console.error('Error parsing location data:', error);
    }
  };

  const openMap = (latitude, longitude) => {
    const url = `https://www.google.com/maps?q=${latitude},${longitude}`;
    Linking.openURL(url).catch(err => console.error('Error opening map:', err));
  };

  const sendDataToAPI = async item => {
    try {
      if (
        !item ||
        !item.location ||
        !item.location.latitude ||
        !item.location.longitude
      ) {
        throw new Error('Item or location is undefined or incomplete');
      }
      const {latitude, longitude} = item.location;
      const formattedData = {
        tabdata: {
          ...item,
          location: {latitude, longitude},
        },
      };

      let formattedStartDate = new Date(
        formattedData.tabdata.start_date.toString(),
      );
      let formattedEndDate = new Date(
        formattedData.tabdata.end_date.toString(),
      );

      // console.log("Formatted Start Date : ",formattedStartDate.toString());
      // console.log("Formatted End Date : ",formattedEndDate.toString());

      formattedData.tabdata.start_date = formattedStartDate.toString();
      formattedData.tabdata.end_date = formattedEndDate.toString();

      console.log('object------>>:', formattedData);
      const headers = {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      };

      const response = await postToAPI(formattedData, headers);
      console.log('Response from API:', response.data);
      setTaskSynced(true);
      Alert.alert('Response from API', response.data.message);
    } catch (error) {
      console.error('Error in sendDataToAPI:', error);
      throw error;
    }
  };

  const postToAPI = async (data, headers) => {
    try {
      const response = await axios.post(
        'http://hr.safcomicrofinance.com.pk/hr/employees/tasktrackersapi.php',
        //azaan local 'http://192.168.100.23/safco-hrms/hr/employees/tasktrackersapi.php',

        JSON.stringify(data),
        {headers},
      );
      return response;
    } catch (error) {
      console.error('Error in postToAPI:', error);
      throw error;
    }
  };
  const handleSyncButtonPress = () => {
    if (taskSynced) {
      Alert.alert('Already synced', 'You already synced this task.');
    } else {
      if (selectedItem) {
        sendDataToAPI(selectedItem);
      }
    }
  };
  return (
    <View style={styles.container}>
      <FlatList
        data={filteredUserList}
        showsVerticalScrollIndicator={false}
        renderItem={({item}) => (
          <View style={styles.cardContainer}>
            <Text style={styles.itemText}>
              {[
                <Text style={{fontWeight: 'bold', marginLeft: 4}}>
                  Task Name :{' '}
                </Text>,
                item.taskname,
              ]}
            </Text>
            <Text style={styles.itemText}>
              {[
                <Text style={{fontWeight: 'bold', marginLeft: 4}}>
                  Status :{' '}
                </Text>,
                item.status === 1 ? 'Open' : item.status,
              ]}
            </Text>
            <View style={styles.buttonContainer}>
              <TouchableOpacity
                onPress={() => onOpen(item)}
                style={styles.Viewbuttton}>
                <Text style={{color: 'white'}}>View Button</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.syncUpButton}
                onPress={handleSyncButtonPress}>
                <FontAwesome5 name="sync" color={'#ffffff'} size={15} />
              </TouchableOpacity>
            </View>
            <TouchableOpacity
              style={styles.deleteIcon}
              onPress={() => deleteUser(item.to_do_taskId_id)}>
              <MaterialCommunityIcons
                name="delete"
                color={'#245e46'}
                size={20}
              />
            </TouchableOpacity>
          </View>
        )}
        keyExtractor={(item, index) => index.toString()}
      />

      <Modalize ref={modalizeRef} snapPoint={height / 1.8}>
        <ScrollView showsVerticalScrollIndicator={false}>
          {selectedItem && (
            <View style={{padding: 20}}>
              <Table
                borderStyle={{
                  borderWidth: 1,
                  borderColor: '#C1C0B9',
                  marginBottom: 20,
                }}>
                <Row
                  data={[
                    <Text style={{fontWeight: 'bold', marginLeft: 4}}>
                      User Name
                    </Text>,
                    selectedItem.firstname,
                  ]}
                  textStyle={styles.text}
                />
                <Row
                  data={[
                    <Text style={{fontWeight: 'bold', marginLeft: 4}}>
                      Destination
                    </Text>,
                    selectedItem.destination,
                  ]}
                  textStyle={styles.text}
                />
                <Row
                  data={[
                    <Text style={{fontWeight: 'bold', marginLeft: 4}}>
                      Branch Name
                    </Text>,
                    selectedItem.branchname,
                  ]}
                  textStyle={styles.text}
                />
                <Row
                  data={[
                    <Text style={{fontWeight: 'bold', marginLeft: 4}}>
                      Start Date
                    </Text>,
                    selectedItem.start_date,
                  ]}
                  textStyle={styles.text}
                />
                <Row
                  data={[
                    <Text style={{fontWeight: 'bold', marginLeft: 4}}>
                      End date
                    </Text>,
                    selectedItem.end_date,
                  ]}
                  textStyle={styles.text}
                />
                <Row
                  data={[
                    <Text style={{fontWeight: 'bold', marginLeft: 4}}>
                      Description
                    </Text>,
                    selectedItem.description,
                  ]}
                  textStyle={styles.text}
                />
              </Table>
              <TouchableOpacity
                style={styles.ViewbutttonLocation}
                onPress={handleButtonPress}>
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    paddingHorizontal: 10,
                  }}>
                  <Text style={{color: 'white', marginRight: 5}}>
                    Current Location
                  </Text>
                  <FontAwesome name="location-arrow" color={'#fff'} size={20} />
                </View>
              </TouchableOpacity>
            </View>
          )}
        </ScrollView>
      </Modalize>
    </View>
  );
};
export default ViewTask;

const styles = StyleSheet.create({
  container: {flex: 1, marginHorizontal: 10},
  btnText: {color: '#fff', fontSize: 18},
  userItem: {width: '100%', backgroundColor: '#fff', padding: 10},
  belowView: {
    flexDirection: 'row',
    width: '100%',
    alignItems: 'center',
    justifyContent: 'space-evenly',
    marginTop: 20,
    borderRadius: 10,
    height: 50,
    backgroundColor: '#f2f2f2',
  },
  icons: {width: 24, height: 24},
  cardContainer: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 15,
    marginBottom: 15,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  itemText: {
    fontWeight: '500',
    flex: 1.8,
    color: '#3d3d3d',
    top: 1,
    marginBottom: 5,
  },
  deleteIcon: {position: 'absolute', top: 5, right: 5},
  Viewbuttton: {
    backgroundColor: '#245e46',
    padding: 8,
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
    width: '40%',
  },
  syncUpButton: {
    backgroundColor: '#245e46',
    padding: 8,
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  ViewbutttonLocation: {
    backgroundColor: '#245e46',
    padding: 10,
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
    width: '50%',
    marginTop: 10,
  },
  text: {margin: 8},
});
