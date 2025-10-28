import React, {useEffect, useRef, useState} from 'react';
import type {Node} from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Pressable,
  Dimensions,
  Alert,
  Image,
  View,
  Text,
  Modal,
  ToastAndroid,
  PermissionsAndroid,
  BackHandler,
} from 'react-native';
import axios from 'axios';
import NotificationModal from '../../components/NotificationModal';
import RNAndroidLocationEnabler from 'react-native-android-location-enabler';

import {Card} from 'react-native-paper';
import {AppStatusBar, TextView} from '../../components';
const {height, width} = Dimensions.get('window');
import Fontisto from 'react-native-vector-icons/Fontisto';
import Feather from 'react-native-vector-icons/Feather';
import {connect, useSelector} from 'react-redux';
import {useNavigation} from '@react-navigation/native';
import {flex} from 'styled-system';
import {Colors, GlobalStyles} from '../../theme';
import Dashboardcard from '../../components/Dashboardcard';

import {
  LineChart,
  BarChart,
  PieChart,
  ProgressChart,
  ContributionGraph,
  StackedBarChart,
} from 'react-native-chart-kit';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useDispatch} from 'react-redux';
import {getDashboardData} from '../../apis_auth/apis';
import {Modalize} from 'react-native-modalize';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {FONTS} from '../../theme/Fonts';
import {NativeModules} from 'react-native';
import NumberFormater from '../../utilis/NumberFormater';
import {getDailyCollectionReport} from '../../apis_auth/apis';
import {
  getDailyCollectionReportBm,
  getDailyCollectionReportRm,
  getDailyCollectionReportZm,
} from '../../apis_auth/apis';
import {Value} from 'react-native-reanimated';
import NotificationDetails from '../../components/NotificationDetails';

const {FingerModule} = NativeModules;

const Dashboard: () => Node = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [notificationsData, setNotificationsData] = useState([]);
  const [selectedNotification, setSelectedNotification] = useState(null);
  const [toast, setToast] = React.useState({value: '', type: ''});

  const navigation = useNavigation();

  const [UserData, setUserData] = React.useState(undefined);

  const getUserData = useSelector(state => state.UserData);
  const OrganizationType = Number(getUserData?.UserData?.OrganizationType);
  //console.log("dataaaaaa=======>",getUserData)
  const StationReducer = useSelector(state => state.StationReducer);
  const [dueDetailReport, setDailyCollectionReport] = React.useState();
  const [noDueDetialdata, setNoDailyCollectionData] = React.useState(false);
  const [progressVisible, setProgressVisible] = React.useState(false);

  const [exitApp, setExitApp] = React.useState(0);
  const [loCollection, setloCollection] = React.useState('0.00');

  //console.log("dataaaaaa=======>",getUserData?.UserData?.OrganizationType)
  // Define default colors
  let shade1Color = Colors.primary;
  let shade2Color = Colors.darkGreenColor;

  // Override colors if OrganizationType is 2
  if (OrganizationType === 2) {
    shade1Color = Colors.newislamic2;
    shade2Color = Colors.newislamic1;
  }

  if (OrganizationType === 0) {
    shade1Color = Colors.newpmSafco2;
    shade2Color = Colors.newpmSafco;
  }

  const [dashboardObj, setDashboardObj] = React.useState({
    CurrentDues: 0,

    PreparedToken: 0,

    DisbursedLoans: 0,

    RecoveredAmount: 0,

    ActiveLoans: 0,
  });

  const modalizeRef = useRef<Modalize>(null);

  const onOpen = () => {
    modalizeRef.current?.open();
  };
  const backAction = () => {
    setTimeout(() => {
      setExitApp(0);
    }, 2000); // 2 seconds to tap second-time

    if (exitApp === 0) {
      setExitApp(exitApp + 1);

      navigation.goBack();
    } else if (exitApp === 1) {
      Alert.alert(
        'Exit App',

        'Are you sure you want to exit?',

        [
          {
            text: 'Cancel',

            onPress: () => setExitApp(0),

            style: 'cancel',
          },

          {text: 'OK', onPress: () => BackHandler.exitApp()},
        ],

        {cancelable: false},
      );
      // BackHandler.exitApp();
    }
    return true;
  };

  useEffect(() => {
    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',

      backAction,
    );

    return () => backHandler.remove();
  });

  useEffect(async () => {
    setUserData(getUserData);
    //console.log("--------->",JSON.stringify(getUserData))

    setDashboardObj({
      CurrentDues: getUserData?.UserData?.CurrentMonthDues,

      PreparedToken: getUserData?.UserData?.PrepareTokens,

      DisbursedLoans: getUserData?.UserData?.CurrentMonthDisbursment,

      RecoveredAmount: getUserData?.UserData?.CurrentRecoveredClients,

      ActiveLoans: getUserData?.UserData?.ActiveLoans,
    });
  }, []);

  React.useEffect(() => {
    {
      getUserData.UserData.EmployeeTypeName == 'Credit Officer' &&
        getDailyCollectionReport(
          StationReducer.station.stationId,
          getUserData.UserData.EmployeeId,
          getUserData.UserData.EmployeeTypeId,
          setDailyCollectionReport,
          setNoDailyCollectionData,
          setProgressVisible,
        ).then(value => {
          let data = value.data;
          console.log('Here====>', data);

          if (data == 'No Record Found') {
            setToast({
              type: 'error',
              message: '' + data,
            });
          } else {
            // setloCollection(value)
            navigation.navigate('Dashbordreport', {report: value});
          }
        });
    }

    {
      getUserData.UserData.EmployeeTypeName == 'Branch Manager' &&
        getDailyCollectionReportBm(
          StationReducer.station.stationId,
          getUserData.UserData.EmployeeId,
          getUserData.UserData.EmployeeTypeId,
          setDailyCollectionReport,
          setNoDailyCollectionData,
          setProgressVisible,
        ).then(value => {
          let data = value.data;
          if (data == 'No Record Found') {
            setToast({
              type: 'error',
              message: '' + data,
            });
          } else {
            navigation.navigate('Dashbordreport', {report: value});
          }
        });
    }
    {
      getUserData.UserData.EmployeeTypeName == 'Area Manager' &&
        getDailyCollectionReportRm(
          StationReducer.station.stationId,
          getUserData.UserData.EmployeeId,
          getUserData.UserData.EmployeeTypeId,
          setDailyCollectionReport,
          setNoDailyCollectionData,
          setProgressVisible,
        ).then(value => {
          let data = value.data;
          if (data == 'No Record Found') {
            setToast({
              type: 'error',
              message: '' + data,
            });
          } else {
            navigation.navigate('Dashbordreport', {report: value});
          }
        });
    }
    {
      getUserData.UserData.EmployeeTypeName == 'Manager Operation' &&
        getDailyCollectionReportZm(
          StationReducer.station.stationId,
          getUserData.UserData.EmployeeId,
          getUserData.UserData.EmployeeTypeId,
          setDailyCollectionReport,
          setNoDailyCollectionData,
          setProgressVisible,
        ).then(value => {
          let data = value.data;
          if (data == 'No Record Found') {
            setToast({
              type: 'error',
              message: '' + data,
            });
          } else {
            navigation.navigate('Dashbordreport', {report: value});
          }
        });
    }
  }, []);
  React.useEffect(() => {
    requestLocationPermission();
  }, []);
  async function requestLocationPermission() {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        {
          title: 'This App',
          message: 'This App access to your location ',
          buttonPositive: 'OK',
        },
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        RNAndroidLocationEnabler.promptForEnableLocationIfNeeded({
          interval: 10000,
          fastInterval: 5000,
        })
          .then(data => {
            console.log(
              'getUserData?.UserData?.EmployeeId',
              getUserData?.UserData?.EmployeeId,
            );
            //working but comment for disable this location functionality
            // FingerModule.startServies(getUserData?.UserData?.EmployeeId);
          })
          .catch(err => {
            Alert.alert(
              'Please Enable Location',
              'You cannot use this app without enabling location services',
              [
                {
                  text: 'OK',
                  onPress: () => {
                    requestLocationPermission();
                  },
                },
                {
                  text: 'Exit',
                  onPress: () => {
                    BackHandler.exitApp();
                  },
                },
              ],
            );
          });
      } else {
      }
    } catch (err) {
      console.warn(err);
    }
  }
  // const data = {
  //   labels: ['January', 'February', 'March', 'April', 'May', 'June'],
  //   datasets: [
  //     {
  //       data: [20, 45, 28, 80, 99, 43],
  //     },
  //   ],
  // };

  const fetchNotifications = () => {
    axios
      .get(
        // 'http://192.168.100.50/safco-hrms/hr/organization/send_notification.php',

        
'http://hr.safcomicrofinance.com.pk/hr/organization/send_notification.php'
      )
      .then(response => {
        const newNotifications = response.data.map(notification => ({
          ...notification,
          read: false,
        }));
        console.log('AZaaan', response.data);
        setNotificationsData(newNotifications);
        setModalVisible(true);
      })
      .catch(error => {
        if (error.message === 'Network Error') {
        console.log(error)
         
        }
      });
      
  };
 const openModal = ()=> {
  setModalVisible(true);
 };
 const closeModal = () =>{
  setModalVisible(false);
 };
  useEffect(() => {
    fetchNotifications();
  }, []);
  return (
    <SafeAreaView style={styles.safeview}>
      <AppStatusBar></AppStatusBar>

      <Pressable onPressIn={() => navigation.openDrawer()}>
        <Feather
          name="menu"
          size={28}
          color={Colors.primary}
          style={{marginTop: 40, paddingHorizontal: 30}}
        />
      </Pressable>
      <View style={[styles.row, {marginTop: 20, marginBottom: 20}]}>
        <View style={styles.circle}>
          {/* <Fontisto
            style={{ alignSelf: 'center' }}
            name="person"
            color={Colors.darkGreenColor}
            size={26}
          /> */}
          <Image
            style={{
              height: 80,
              width: 80,
              alignSelf: 'center',
              resizeMode: 'cover',
              borderRadius: 50,
            }}
            source={require('../../assests/images/oval.png')}></Image>
        </View>
        <View style={styles.textContainer}>
          {UserData != undefined && (
            <TextView
              type={'heading'}
              text={'Hi ' + UserData.UserData.FirstName + ','}></TextView>
          )}
          <TextView
            type={'normal'}
            text="What do you want to do today?"></TextView>
        </View>
      </View>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View>
          <View
            style={[styles.row, {height: height / 4.5, alignSelf: 'center'}]}>
            {/* //---------------------------Current date */}
            <Dashboardcard
              name={'Current Date Due'}
              amount={NumberFormater(
                Number(dashboardObj?.CurrentDues).toFixed(),
              ).replace(/\d(?=(\d{3})+\.)/g, '$&,')}
              shade1={shade1Color}
              shade2={shade2Color}
              icon="calendar"></Dashboardcard>

            <Dashboardcard
              name={'Prepared Token'}
              amount={NumberFormater(
                Number(dashboardObj?.PreparedTokenNumber).toFixed(),
              ).replace(/\d(?=(\d{3})+\.)/g, '$&,')}
              // shade1={Colors.darkGreenColor}
              // shade2={Colors.primary}
              shade1={shade1Color}
              shade2={shade2Color}
              icon="check"></Dashboardcard>
          </View>
          {/* ////////////////////////////////// */}
          <View
            style={[styles.row, {height: height / 4.5, alignSelf: 'center'}]}>
            {/* //---------------------------Current date */}
            <Dashboardcard
              name={'Disburse of Current Date'}
              amount={NumberFormater(
                Number(dashboardObj?.DisbursedLoans).toFixed(),
              ).replace(/\d(?=(\d{3})+\.)/g, '$&,')}
              shade1={shade1Color}
              shade2={shade2Color}
              icon="calendar"></Dashboardcard>
            <Dashboardcard
              name={'Recovered Clients of Month'}
              amount={NumberFormater(
                Number(dashboardObj?.RecoveredAmount).toFixed(),
              ).replace(/\d(?=(\d{3})+\.)/g, '$&,')}
              shade1={shade1Color}
              shade2={shade2Color}
              icon="person"></Dashboardcard>
          </View>

          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}>
            <TextView
              text={`Active Client Data (${
                dashboardObj?.ActiveLoans == null
                  ? 0
                  : dashboardObj?.ActiveLoans
              })`}
              style={{
                marginTop: 30,
                marginLeft: 40,
                color: '#1d1d1d',
              }}></TextView>
            <TouchableOpacity onPress={() => onOpen()}>
              <TextView style={styles.viewmore} text="View more"></TextView>
            </TouchableOpacity>
          </View>
          <View
            style={{
              height: 1,
              backgroundColor: '#cdcdcd',
              alignSelf: 'center',
              width: width / 1.2,
            }}>
            <TextView text=""></TextView>
          </View>
          <View style={{marginBottom: 50}}>
            <LineChart
              data={{
                labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
                datasets: [
                  {
                    data: [
                      Math.random() * 10,
                      Math.random() * 10,
                      Math.random() * 10,
                      Math.random() * 10,
                      Math.random() * 10,
                      Math.random() * 10,
                    ],
                  },
                ],
              }}
              width={Dimensions.get('window').width / 1.1} // from react-native
              height={height / 4}
              yAxisLabel="Rs"
              yAxisSuffix="Rs"
              yAxisInterval={1} // optional, defaults to 1
              chartConfig={{
                backgroundColor:
                  OrganizationType === 0 ? '#55a630' : Colors.primary,
                backgroundGradientFrom:
                  OrganizationType === 2
                    ? '#FFD700'
                    : OrganizationType === 0
                    ? '#55a630'
                    : Colors.darkGreenColor,
                backgroundGradientTo:
                  OrganizationType === 0 ? '#55a630' : Colors.primary,

                // backgroundGradientTo: OrganizationType === 0  ? '#55a630' : Colors.primary,
                decimalPlaces: 2, // optional, defaults to 2dp
                color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                style: {
                  borderRadius: 16,
                },
                propsForDots: {
                  r: '6',
                  strokeWidth: '2',
                  stroke: '#ffa726',
                },
              }}
              bezier
              style={{
                marginVertical: 8,
                borderRadius: 16,
                marginLeft: 30,
                alignSelf: 'center',
                marginTop: 20,
                marginBottom: 30,
                marginRight: 30,
              }}
            />
          </View>
        </View>
      </ScrollView>
      <Modalize ref={modalizeRef} snapPoint={height / 1.8}>
        <View style={{paddingTop: 30}}>
          <View
            style={[
              GlobalStyles.row,
              {padding: 10, backgroundColor: '#FFF', marginBottom: 10},
            ]}>
            <TextView
              text={'Name: ' + UserData?.UserData?.FirstName}
              style={styles.tablerow4}></TextView>
            <TextView text={'Values'} style={styles.tablerow3}></TextView>
            <TextView text={'Total'} style={styles.tablerow3}></TextView>
          </View>
          <View
            style={[
              GlobalStyles.row,
              {padding: 10, backgroundColor: '#f1f1f1'},
            ]}>
            <TextView text={'Dues'} style={styles.tablerow1}></TextView>
            <TextView
              text={`${NumberFormater(
                Number(UserData?.UserData?.Dues).toFixed(),
              ).replace(/\d(?=(\d{3})+\.)/g, '$&,')}`}
              style={styles.tablerow}></TextView>
            <TextView
              text={`${NumberFormater(
                Number(UserData?.UserData?.Dues).toFixed(),
              ).replace(/\d(?=(\d{3})+\.)/g, '$&,')}`}
              style={styles.tablerow}></TextView>
          </View>
          <View
            style={[
              GlobalStyles.row,
              {padding: 10, backgroundColor: '#cdcdcd'},
            ]}>
            <TextView text={'Achieved'} style={styles.tablerow1}></TextView>
            <TextView
              text={`${NumberFormater(
                Number(UserData?.UserData?.Achieved).toFixed(),
              ).replace(/\d(?=(\d{3})+\.)/g, '$&,')}`}
              style={styles.tablerow}></TextView>
            <TextView
              text={`${NumberFormater(
                Number(UserData?.UserData?.Achieved).toFixed(),
              ).replace(/\d(?=(\d{3})+\.)/g, '$&,')}`}
              style={styles.tablerow}></TextView>
          </View>
          <View
            style={[
              GlobalStyles.row,
              {padding: 10, backgroundColor: '#f1f1f1'},
            ]}>
            <TextView text={'Remaining'} style={styles.tablerow1}></TextView>
            <TextView
              text={`${NumberFormater(
                Number(UserData?.UserData?.Remaining).toFixed(),
              ).replace(/\d(?=(\d{3})+\.)/g, '$&,')}`}
              style={styles.tablerow}></TextView>
            <TextView
              text={`${NumberFormater(
                Number(UserData?.UserData?.Remaining).toFixed(),
              ).replace(/\d(?=(\d{3})+\.)/g, '$&,')}`}
              style={styles.tablerow}></TextView>
          </View>
          <View
            style={[
              GlobalStyles.row,
              {padding: 10, backgroundColor: '#cdcdcd'},
            ]}>
            <TextView
              text={'Dues Achieved Percentage %'}
              style={styles.tablerow1}></TextView>
            <TextView
              text={`${NumberFormater(
                Number(UserData?.UserData?.DuesAchievedPercentage).toFixed(),
              ).replace(/\d(?=(\d{3})+\.)/g, '$&,')}`}
              style={styles.tablerow}></TextView>
            <TextView
              text={`${NumberFormater(
                Number(UserData?.UserData?.DuesAchievedPercentage).toFixed(),
              ).replace(/\d(?=(\d{3})+\.)/g, '$&,')}`}
              style={styles.tablerow}></TextView>
          </View>
          <View
            style={[
              GlobalStyles.row,
              {padding: 10, backgroundColor: '#f1f1f1'},
            ]}>
            <TextView text={'OD'} style={styles.tablerow1}></TextView>
            <TextView
              text={`${NumberFormater(
                Number(UserData?.UserData?.OD).toFixed(),
              ).replace(/\d(?=(\d{3})+\.)/g, '$&,')}`}
              style={styles.tablerow}></TextView>
            <TextView
              text={`${NumberFormater(
                Number(UserData?.UserData?.OD).toFixed(),
              ).replace(/\d(?=(\d{3})+\.)/g, '$&,')}`}
              style={styles.tablerow}></TextView>
          </View>
          <View
            style={[
              GlobalStyles.row,
              {padding: 10, backgroundColor: '#cdcdcd'},
            ]}>
            <TextView text={'OD Achieved'} style={styles.tablerow1}></TextView>
            <TextView
              text={`${NumberFormater(
                Number(UserData?.UserData?.ODAchieved).toFixed(),
              ).replace(/\d(?=(\d{3})+\.)/g, '$&,')}`}
              style={styles.tablerow}></TextView>
            <TextView
              text={`${NumberFormater(
                Number(UserData?.UserData?.ODAchieved).toFixed(),
              ).replace(/\d(?=(\d{3})+\.)/g, '$&,')}`}
              style={styles.tablerow}></TextView>
          </View>
          <View
            style={[
              GlobalStyles.row,
              {padding: 10, backgroundColor: '#f1f1f1'},
            ]}>
            <TextView text={'OD Remaining'} style={styles.tablerow1}></TextView>
            <TextView
              text={`${NumberFormater(
                Number(UserData?.UserData?.ODRemaining).toFixed(),
              ).replace(/\d(?=(\d{3})+\.)/g, '$&,')}`}
              style={styles.tablerow}></TextView>
            <TextView
              text={`${NumberFormater(
                Number(UserData?.UserData?.ODRemaining).toFixed(),
              ).replace(/\d(?=(\d{3})+\.)/g, '$&,')}`}
              style={styles.tablerow}></TextView>
          </View>
          <View
            style={[
              GlobalStyles.row,
              {padding: 10, backgroundColor: '#cdcdcd'},
            ]}>
            <TextView
              text={'OD Percentage %'}
              style={styles.tablerow1}></TextView>
            <TextView
              text={`${NumberFormater(
                Number(UserData?.UserData?.ODPercentage).toFixed(),
              ).replace(/\d(?=(\d{3})+\.)/g, '$&,')}`}
              style={styles.tablerow}></TextView>
            <TextView
              text={`${NumberFormater(
                Number(UserData?.UserData?.ODPercentage).toFixed(),
              ).replace(/\d(?=(\d{3})+\.)/g, '$&,')}`}
              style={styles.tablerow}></TextView>
          </View>
          <View
            style={[
              GlobalStyles.row,
              {padding: 10, backgroundColor: '#f1f1f1'},
            ]}>
            <TextView text={'Prepayment'} style={styles.tablerow1}></TextView>
            <TextView
              text={`${NumberFormater(
                Number(UserData?.UserData?.Prepayment).toFixed(),
              ).replace(/\d(?=(\d{3})+\.)/g, '$&,')}`}
              style={styles.tablerow}></TextView>
            <TextView
              text={`${NumberFormater(
                Number(UserData?.UserData?.Prepayment).toFixed(),
              ).replace(/\d(?=(\d{3})+\.)/g, '$&,')}`}
              style={styles.tablerow}></TextView>
          </View>
        </View>
      </Modalize>
      <NotificationModal 
       modalVisible={modalVisible}
       notificationsData= {notificationsData}
       onClose={closeModal}
     
      />
    </SafeAreaView>
  );
};
const styles = StyleSheet.create({
  safeview: {
    flex: 1,
    backgroundColor: '#FFF',
  },
  card: {
    marginLeft: 10,
    marginRight: 10,
    height: height / 5,
    borderRadius: 5,
    elevation: 10,
    flex: 1,
  },
  carditemTop: {
    borderRadius: 100,
    height: 50,
    width: 50,
    alignSelf: 'flex-end',
    backgroundColor: '#FFF',
    margin: 20,
    justifyContent: 'center',
  },
  row: {
    marginTop: 15,
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 30,
    marginRight: 30,
  },
  textContainer: {marginTop: 5, marginLeft: 20},
  circle: {
    height: 80,
    width: 80,
    borderRadius: 200,
    justifyContent: 'center',
    backgroundColor: '#E7E5E6',
  },
  tablerow1: {
    fontSize: 12,
    width: width / 3,
  },
  tablerow: {
    fontSize: 12,
    width: width / 3,
    textAlign: 'center',
  },
  tablerow3: {
    fontSize: 14,
    width: width / 3,
    textAlign: 'center',
    fontFamily: FONTS.FONT_SEMI_BOLD,
  },
  tablerow4: {
    fontSize: 14,
    width: width / 3,
    fontFamily: FONTS.FONT_SEMI_BOLD,
  },
  viewmore: {
    fontFamily: FONTS.FONT_LIGHT,
    fontSize: 14,
    color: Colors.darkGreenColor,
    marginLeft: 10,
    marginRight: 40,
    marginTop: 30,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Semi-transparent black background
  },
  modalContent: {
    backgroundColor: '#FFF',
    width: '80%',
    borderRadius: 10,
    padding: 20,
    maxHeight: '80%',
  },
  notificationItem: {
    marginBottom: 10,
  },
  notificationDescription: {
    fontSize: 16,
    lineHeight: 24,
  },
});
export default Dashboard;
