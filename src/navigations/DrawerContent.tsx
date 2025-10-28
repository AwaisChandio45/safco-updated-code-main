import {memo, useEffect, useState} from 'react';
import React from 'react';
import {
  Image,
  StyleSheet,
  View,
  Alert,
  Pressable,
  Dimensions,
  PermissionsAndroid,
} from 'react-native';
import {createStackNavigator} from '@react-navigation/stack';
import {
  DrawerItem,
  createDrawerNavigator,
  DrawerContentScrollView,
} from '@react-navigation/drawer';
import {Icons, Colors, GlobalStyles} from '../theme';
import LinearGradient from 'react-native-linear-gradient';
var {height, width} = Dimensions.get('window');
import Animated from 'react-native-reanimated';
import Tabs from './Tabs';
var {height, width} = Dimensions.get('window');
import {connect, useSelector} from 'react-redux';
import Feather from 'react-native-vector-icons/Feather';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Octicons from 'react-native-vector-icons/Octicons';
import {
  CreateDatabaseauto,
  DeletRepayment,
  getRepaymentData,
  InsertIntoTables,
} from '../sqlite/RepaymentDataBase';
import {
  TextView,
  ModalView,
  CustomProgressDialoge,
  AskingQuestion,
} from '../components';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {CallforTags, repaymentSyncdown, SyncDown} from '../apis_auth/apis';
import {
  getAllemployees,
  getEmployeesRegionArray,
  getLoanTypesArray,
  getStationArray,
  insertAllTags,
  getStationData,
  checkExportSffDatabase,
  updateEmplyeesRegionArray,
} from '../sqlite/sqlitedb';
import {NativeModules, TouchableOpacity} from 'react-native';
const {FingerModule} = NativeModules;
import {checkExportRepaymentDatabase} from '../sqlite/RepaymentDataBase';
import axios from 'axios';
import RNFS from 'react-native-fs';

import {useDispatch} from 'react-redux';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import {ProgressDialog} from 'react-native-simple-dialogs';
import {ApplicationVersion, releaseDate} from '../utilis/ContsValues';
const DrawerContent = props => {
  const [notifications, setNotifications] = useState([]);
  const [notificationCount, setNotificationsCount] = useState(0);
  const getUserData = useSelector(state => state.UserData);
  const OrganizationType = Number(getUserData?.UserData?.OrganizationType);
  const loanLabel = OrganizationType === 2 ? 'Finance Facility' : 'Loan';
  const StationReducer = useSelector(state => state.StationReducer);

  const dispatch = useDispatch();

  const [UserData, setUserData] = React.useState(undefined);
  const [station, setStation] = React.useState(undefined);
  const [dialogVisible, setDialogeVisible] = React.useState(false);
  // const [getStationArray, setStationArray] = React.useState([])
  // const [getStationsID, setStationsID] = React.useState([])
  // const [getEmployeesRegion, setEmployeesRegion] = React.useState([])
  // const [getTopupTypes, setTopupTypes] = React.useState([]);
  // const [getQuestion, setQuestion] = React.useState([]);
  const [title, setTitle] = React.useState([]);
  const [getValuefromModule, setValuefromModule] = React.useState();
  const [getSyncUpValueFromModule, setSyncUpValModule] = React.useState();
  const [confirmDialoge, setConfirmDialoge] = React.useState(false);
  const [syncUpDialoge, setSyncUpDialoge] = React.useState(false);
  const [exportSffDialoge, setExportSffDialoge] = React.useState(false);
  const [importSffDialoge, setImportSffDialoge] = React.useState(false);
  const [exportRepaymentDialoge, setExpRepaymentDialoge] =
    React.useState(false);
  const [importRepaymentDialoge, setImpRepaymentDialoge] =
    React.useState(false);
  const [progressVisible, setProgressVisible] = React.useState(false);
  const [progressDialoge, setProgressDialoge] = React.useState(false);
  ////////Getting station array ////////////////
  const [getArray, setArray] = React.useState([]);
  const [noData, setNoData] = React.useState(false);
  /////////////////////////////////////////
  // const _onSavedClick = () => {
  //   if (getValuefromModule == undefined) {
  //     alert("Please Select Station first!")
  //     return
  //   }
  //   var station_name = "";
  //   var station_id = "";
  //   getStationArray.map((item, index) => {
  //     if (item.label == getValuefromModule) {
  //       station_name = item.label
  //       station_id = getStationsID[index].id
  //     }
  //   })
  //   var obj = { stationId: station_id, stationName: station_name }
  //   setTitle("Syncing Down..")
  //   CallforTags(station_id, setProgressVisible).then((values) => {
  //     console.log("callfortags promise" + values.getEmployeesRegion.length)
  //     let maker = [];
  //     getEmployeesRegion.map((item, index) => {
  //       // console.log("item.StationId"+JSON.stringify(item.StationId)+"<--->" + station_id)
  //       if (item.StationId == station_id) {
  //         maker.push(item.RegionName)
  //       } else if ((index + 1) == getEmployeesRegion.length) {
  //         if (item.StationId == station_id) {
  //           maker.push(item.RegionName)
  //         }
  //         console.log("--->maker" + maker.length);
  //         updateEmplyeesRegionArray(JSON.stringify(maker))
  //           .then(() => {
  //             // maker=[];
  //             insertAllTags(JSON.stringify(values)).then((val) => {
  //               //console.log("insertAllTags promise" + val)
  //               AsyncStorage.setItem("@station", JSON.stringify(obj));
  //               //REMOVE DUPLICATION
  //               maker = maker.filter(function (x, i, a) {
  //                 return a.indexOf(x) == i;
  //               });
  //               dispatch({
  //                 type: 'STATION',
  //                 payload: obj,
  //               });
  //               dispatch({
  //                 type: 'REGIONS',
  //                 payload: maker,
  //               });
  //               dispatch({
  //                 type: 'TOPUPLOAN',
  //                 payload: getTopupTypes,
  //               });
  //               dispatch({
  //                 type: 'QUESTION',
  //                 payload: getQuestion,
  //               });
  //               maker = [];
  //               setDialogeVisible(false)
  //               setProgressVisible(false)
  //             }).catch((val) => {
  //               alert("-->" + val)
  //               maker = [];
  //               setDialogeVisible(false)
  //             })
  //           })
  //           .catch((e) => {
  //             alert(e)
  //             setDialogeVisible(false)
  //           })
  //       }
  //     })
  //   }).catch((error) => {
  //     alert(error)
  //     setDialogeVisible(false)
  //   })
  //   // props.Station(getValuefromModule)
  // }
  ////////////////Sync up module method////////

  /////////////////////////////////////////////////////////////////////////////////////////////////////////
  const _syncUp = async () => {
    // if (getSyncUpValueFromModule == undefined) {
    //   alert('Please select a value');
    // } else {
    var station_name = StationReducer.station.stationName;
    var station_id = StationReducer.station.stationId;
    console.log('--->', JSON.stringify(StationReducer.station));
    // return
    // getArray.map((item, index) => {
    //   if (item.label == getSyncUpValueFromModule) {
    //     station_name = item.label
    //     station_id = item.id
    //   }
    // })
    setTitle('Syncing Down..');
    repaymentSyncdown(station_id, UserData.MobileToken, setProgressVisible)
      .then(async values => {
        //console.log("--->values", values);
        if (values.length == 20) {
          setDialogeVisible(false);
          setProgressVisible(false);
          setSyncUpDialoge(false);
          Alert.alert(station_name, 'Sorry! this station have no any data.', [
            {text: 'OK', onPress: () => {}},
          ]);
          return;
        }
        DeletRepayment()
          .then(value => {
            //console.log("--->", value);
            InsertIntoTables(values)
              .then(() => {
                setDialogeVisible(false);
                setProgressVisible(false);
                setSyncUpDialoge(false);
                Alert.alert('Done', 'Successfully Syncdown!', [
                  {text: 'OK', onPress: () => {}},
                ]);
              })
              .catch(error => {
                //console.log("--->", error);
                setDialogeVisible(false);
              });
          })
          .catch(() => {
            setDialogeVisible(false);
          });
      })
      .catch(() => {
        setDialogeVisible(false);
      });
  };
  ////////////////////////////////////
  React.useEffect(() => {
    setUserData(getUserData.UserData);
    setStation(
      StationReducer == undefined ? '' : StationReducer.station.stationName,
    );
  });

  //  ************************* EXPORT / IMPORT DATABASE **********************
  const handleExport = async () => {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
      {
        title: 'Storage Permission',
        message: 'App needs access to memory to download the file ',
      },
    );

    if (granted === PermissionsAndroid.RESULTS.GRANTED) {
      // setTitle("Exporting...")

      // setProgressDialoge(true);
      let get = await FingerModule.exportDatabaseSSF(1);
      console.log('--->', get);
      if (get == 0) {
        // setProgressDialoge(false);
        Alert.alert('Done', 'Exported Successfully!');
      } else {
        // setProgressDialoge(false);
        Alert.alert('Stop!', 'Exported Failed!');
      }

      return;

      const AppFolder = 'Safco_reactapp';

      const DirectoryPath = RNFS.ExternalStorageDirectoryPath + '/' + AppFolder;

      RNFS.mkdir(DirectoryPath);

      RNFS.readFile(
        '/data/data/com.safcomicrofinance/databases/safcoapp.db',

        'base64',
      ).then(value => {
        RNFS.getAllExternalFilesDirs()

          .then(path =>
            RNFS.writeFile(
              DirectoryPath + '/' + 'database_copy.db',

              value,

              'base64',
            ),
          )

          .then(() => {
            setProgressDialoge(false);

            Alert.alert('Done', 'Exported fully!');
          })
          .catch(error => {
            setProgressDialoge(false);

            Alert.alert('Error!', '' + error);
          });
        //-------------------------write file
      });

      // -----------------------------
    } else {
      Alert.alert(
        'Permission Denied!',

        'You need to give storage permission to download the file',
      );

      return;
    }
  };
  //this methode use for import

  const handleImport = async () => {
    // setProgressDialoge(true);

    // setTitle("Importing ...")

    let get = await FingerModule.exportDatabaseSSF(2);
    console.log('--->', get);
    if (get == 0) {
      // setProgressDialoge(false);
      Alert.alert('Done', 'Imported Successfully!');
    } else {
      // setProgressDialoge(false);
      Alert.alert('Stop!', 'Imported Failed!');
    }

    return;

    const AppFolder = 'Safco_reactapp';

    const DirectoryPath =
      RNFS.ExternalStorageDirectoryPath + '/' + AppFolder + '/database_copy.db';

    //getting database file
    try {
      RNFS.readFile(DirectoryPath, 'base64')
        .then(value =>
          RNFS.getAllExternalFilesDirs()

            .then(path =>
              RNFS.writeFile(
                '/data/data/com.safcomicrofinance/databases/safcoapp.db',

                value,

                'base64',
              ),
            )

            .then(() => {
              setProgressDialoge(false);

              Alert.alert('Done', 'Imported Successfully!');
            })
            .catch(() => {
              setProgressDialoge(false);

              Alert.alert('Sorry!', 'Backup not found');

              // Toast.show({text:'Sorry! Backup not found.'})
            }),
        )
        .catch(() => {
          setProgressDialoge(false);

          Alert.alert('Sorry!', 'Backup not found');

          // Toast.show({text:'Sorry! Backup not found.'})
        });
    } catch (error) {
      setProgressDialoge(false);

      Alert.alert('Sorry!', 'Backup not found');
    }
  };

  const handleRepaymentExport = async () => {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,

      {
        title: 'Storage Permission',

        message: 'App needs access to memory to download the file ',
      },
    );

    if (granted === PermissionsAndroid.RESULTS.GRANTED) {
      // setTitle("Exporting...")

      // setProgressVisible(true);
      let get = await FingerModule.exportDatabaseSSF(3);
      console.log('--->', get);
      if (get == 0) {
        // setProgressDialoge(false);
        Alert.alert('Done', 'Exported Successfully!');
      } else {
        // setProgressDialoge(false);
        Alert.alert('Stop!', 'Exported Failed!');
      }

      return;
      const AppFolder = 'Safco_reactapp';

      const DirectoryPath = RNFS.ExternalStorageDirectoryPath + '/' + AppFolder;

      RNFS.mkdir(DirectoryPath);

      RNFS.readFile(
        '/data/data/com.safcomicrofinance/databases/SafcoMicrofinance_Main_Database.db',

        'base64',
      ).then(value => {
        RNFS.getAllExternalFilesDirs()

          .then(path =>
            RNFS.writeFile(
              DirectoryPath + '/' + 'safcoappRepayment.db',

              value,

              'base64',
            ),
          )

          .then(() => {
            setProgressVisible(false);

            Alert.alert('Done', 'Exported Successfully!');
          })
          .catch(error => {
            setProgressVisible(false);

            Alert.alert('Error!', '' + error);
          });
        //-------------------------write file
      });

      // -----------------------------
    } else {
      Alert.alert(
        'Permission Denied!',

        'You need to give storage permission to download the file',
      );
      return;
    }
  };
  //this methode use for import
  const handleRepaymentImport = async () => {
    // setProgressVisible(true);

    // setTitle("Importing ...")

    let get = await FingerModule.exportDatabaseSSF(4);
    console.log('--->', get);
    if (get == 0) {
      // setProgressDialoge(false);
      Alert.alert('Done', 'Imported Successfully!');
    } else {
      // setProgressDialoge(false);
      Alert.alert('Stop!', 'Imported Failed!');
    }

    return;
    const AppFolder = 'Safco_reactapp';

    const DirectoryPath =
      RNFS.ExternalStorageDirectoryPath +
      '/' +
      AppFolder +
      '/safcoappRepayment.db';

    //getting database file
    RNFS.readFile(DirectoryPath, 'base64')
      .then(value =>
        RNFS.getAllExternalFilesDirs()

          .then(path =>
            RNFS.writeFile(
              '/data/data/com.safcomicrofinance/databases/SafcoMicrofinance_Main_Database.db',

              value,

              'base64',
            ),
          )

          .then(() => {
            setProgressVisible(false);

            Alert.alert('Done', 'Imported Successfully!');
          })
          .catch(() => {
            setProgressVisible(false);

            Alert.alert('Sorry!', 'Backup not found');

            // Toast.show({text:'Sorry! Backup not found.'})
          }),
      )
      .catch(() => {
        setProgressVisible(false);

        Alert.alert('Sorry!', 'Backup not found');

        // Toast.show({text:'Sorry! Backup not found.'})
      });
  };

  //  ************************* EXPORT / IMPORT DATABASE **********************

  const _handleSyncDown = async () => {
    setConfirmDialoge(false);

    setProgressVisible(true);

    setTitle('Syncing Down');

    SyncDown(UserData.MobileToken, UserData.StationId, setProgressVisible)
      .then(values => {
        // alert(JSON.stringify(values))

        // setStationArray(values.filedata)

        // setStationsID(values.stationId)

        // setEmployeesRegion(values.EmployeesRegion)

        // setTopupTypes(values.TopUpTypes)

        // setQuestion(values.Questions)

        // setDialogeVisible(true)

        console.log('station id==>', StationReducer.station.stationId);
        CallforTags(StationReducer.station.stationId, setProgressVisible)
          .then(valuesS => {
            console.log('callfortags promise' + values.EmployeesRegion.length);
            let maker = [];
            values.EmployeesRegion.map((item, index) => {
              // console.log("item.StationId"+JSON.stringify(item.StationId)+"<--->" + StationReducer.station.stationId)
              if (item.StationId == StationReducer.station.stationId) {
                maker.push(item.RegionName);
              }
              if (index == values.EmployeesRegion.length - 1) {
                console.log('--->maker' + maker.length);
                // console.log("--->maker" + JSON.stringify(valuesS));
                updateEmplyeesRegionArray(JSON.stringify(maker))
                  .then(() => {
                    // maker=[];
                    insertAllTags(JSON.stringify(valuesS))
                      .then(val => {
                        console.log('insertAllTags promise' + val);

                        //REMOVE DUPLICATION
                        maker = maker.filter(function (x, i, a) {
                          return a.indexOf(x) == i;
                        });

                        AsyncStorage.setItem('@syncDown', JSON.stringify(1));

                        dispatch({
                          type: 'SYNCDOWN',
                          payload: '1',
                        });
                        console.log('--->dispatch syncDown');

                        dispatch({
                          type: 'REGIONS',
                          payload: maker,
                        });

                        dispatch({
                          type: 'TOPUPLOAN',
                          payload: values.TopUpTypes,
                        });

                        dispatch({
                          type: 'QUESTION',
                          payload: values.Questions,
                        });
                        maker = [];
                        setDialogeVisible(false);

                        setProgressVisible(false);
                        Alert.alert('Done', 'Synced Down Successfully!');
                      })
                      .catch(val => {
                        // alert("-->"+val)
                        maker = [];
                        setDialogeVisible(false);
                      });
                  })
                  .catch(e => {
                    alert(e);
                    console.log('--->' + e);
                    setDialogeVisible(false);
                  });
              }
            });
          })
          .catch(error => {
            alert(error);
            console.log('--->' + error);
            setDialogeVisible(false);
          });
      })
      .catch(error => {
        console.log('--->' + error);
        setDialogeVisible(false);
      });
  };
  return (
    <DrawerContentScrollView
      {...props}
      showsVerticalScrollIndicator={false}
      scrollEnabled={true}
      contentContainerStyle={{marginBottom: 20}}>
      <View style={{marginBottom: 20}}>
        <View style={{}}>
          <View style={[styles.circleimg, {alignSelf: 'center'}]}>
            {/* <Octicons

              style={{ alignSelf: 'center' }}

              name="person" color={Colors.darkGreenColor} size={26} /> */}
            <Image
              style={{
                height: 60,
                width: 60,
                alignSelf: 'center',
                resizeMode: 'cover',
                borderRadius: 50,
              }}
              source={require('../assests/images/oval.png')}></Image>
          </View>

          <TextView
            text={UserData && UserData.FirstName}
            type={'Light'}
            style={{
              textAlign: 'center',
              color: '#FFF',
              marginTop: 5,
              alignSelf: 'center',
            }}></TextView>

          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              alignSelf: 'center',
            }}>
            <MaterialIcons
              style={{color: Colors.white, marginRight: 5, fontSize: 20}}
              name="person-pin"
            />

            <TextView
              text={UserData && UserData.EmployeeTypeName}
              type={'Light'}
              style={{
                textAlign: 'center',
                color: '#FFF',
                marginTop: 5,
                alignSelf: 'center',
              }}></TextView>
          </View>

          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              alignSelf: 'center',
            }}>
            <FontAwesome5
              style={{color: Colors.white, marginRight: 10}}
              name="network-wired"></FontAwesome5>

            <TextView
              text={station != undefined ? station : ''}
              type={'Light'}
              style={{
                textAlign: 'center',
                color: '#FFF',
                marginTop: 5,
                alignSelf: 'center',
              }}></TextView>
          </View>

          <Pressable
            onPressIn={() => {
              AsyncStorage.setItem('@userData', '');

              props.navigation.replace('Login');
            }}>
            <View style={styles.logout}>
              <AntDesign
                style={{alignSelf: 'center', marginRight: 10}}
                name="logout"
                size={18}
                color="#000"
              />

              <TextView
                text="Logout"
                type={'Light'}
                style={{
                  textAlign: 'center',
                  color: '#000',
                  marginTop: 5,
                  alignSelf: 'center',
                }}></TextView>
            </View>
          </Pressable>
        </View>

        {/* //------------------HOME */}

        <Pressable
          onPress={() => props.navigation.navigate('Dashboard')}
          style={{marginTop: 20}}>
          <View style={styles.drawerItem}>
            <View style={[styles.circle, {backgroundColor: Colors.Color1}]}>
              <Ionicons
                style={{alignSelf: 'center'}}
                name="home"
                size={22}
                color="#FFF"
              />
            </View>

            <TextView
              style={styles.drawerLabel}
              type="normalRg"
              text={'Home'}
            />
          </View>
        </Pressable>

        {/* //------------------Sync Down */}
        <Pressable
          onPress={() => {
            setConfirmDialoge(true);
          }}
          style={{marginTop: 0}}>
          <View style={styles.drawerItem}>
            <View style={[styles.circle, {backgroundColor: Colors.Color1}]}>
              <Ionicons
                style={{alignSelf: 'center'}}
                name="sync"
                size={22}
                color="#FFF"
              />
            </View>

            <TextView
              type={'normalRg'}
              style={styles.drawerLabel}
              text={'Sycn Down'}
            />
          </View>
        </Pressable>

        {/* //------------------BM Sync Down */}
        {getUserData.UserData.EmployeeTypeName == 'Branch Manager' && (
          <Pressable
            onPress={() => {
              if (StationReducer.station.stationName == undefined) {
                Alert.alert('Stop!', 'Please select station');
              } else {
                props.navigation.navigate('BmData', {
                  item: StationReducer.station,
                  verfication: false,
                });
              }
            }}
            style={{marginTop: 0}}>
            <View style={styles.drawerItem}>
              <View style={[styles.circle, {backgroundColor: Colors.Color1}]}>
                <Ionicons
                  style={{alignSelf: 'center'}}
                  name="sync"
                  size={22}
                  color="#FFF"
                />
              </View>

              <TextView
                type={'normalRg'}
                style={styles.drawerLabel}
                text={'Pending Users'}
              />
            </View>
          </Pressable>
        )}

        {getUserData.UserData.EmployeeTypeName == 'Verification Officer' && (
          <Pressable
            onPress={() => {
              if (StationReducer.station.stationName == undefined) {
                Alert.alert('Stop!', 'Please select station');
              } else {
                props.navigation.navigate('BmData', {
                  item: StationReducer.station,
                  verfication: true,
                });
              }
            }}
            style={{marginTop: 0}}>
            <View style={styles.drawerItem}>
              <View style={[styles.circle, {backgroundColor: Colors.Color1}]}>
                <Ionicons
                  style={{alignSelf: 'center'}}
                  name="sync"
                  size={22}
                  color="#FFF"
                />
              </View>

              <TextView
                type={'normalRg'}
                style={styles.drawerLabel}
                text={'Pending Users'}
              />
            </View>
          </Pressable>
        )}
        {/* ///////////////////////////////////////////////////////// */}

        {(getUserData.UserData.EmployeeTypeName == 'Area Manager' ||
          getUserData.UserData.EmployeeTypeName == 'Manager Operation') && (
          <Pressable
            onPress={() => {
              if (StationReducer.station.stationName == undefined) {
                Alert.alert('Stop!', 'Please select station');
              } else {
                props.navigation.navigate('RegionalZonalData', {
                  item: StationReducer.station,
                  verfication: true,
                });
              }
            }}
            style={{marginTop: 0}}>
            <View style={styles.drawerItem}>
              <View style={[styles.circle, {backgroundColor: Colors.Color1}]}>
                <Ionicons
                  style={{alignSelf: 'center'}}
                  name="sync"
                  size={22}
                  color="#FFF"
                />
              </View>

              <TextView
                type={'normalRg'}
                style={styles.drawerLabel}
                text={'Pending visits'}
              />
            </View>
          </Pressable>
        )}

        {/* //------------------New File */}
        <Pressable
          onPress={() => props.navigation.navigate('ClientCertSurvey')}
          style={{marginTop: 0}}>
          <View style={styles.drawerItem}>
            <View style={[styles.circle, {backgroundColor: Colors.Color1}]}>
              <FontAwesome
                style={{alignSelf: 'center'}}
                name="wpforms"
                size={22}
                color="#FFF"
              />
            </View>

            <TextView
              type={'normalRg'}
              style={styles.drawerLabel}
              text={'Client Satisfication'}
            />
          </View>
        </Pressable>




        <Pressable
          onPress={() => props.navigation.navigate('EmployeeSurvey')}
          style={{marginTop: 0}}>
          <View style={styles.drawerItem}>
            <View style={[styles.circle, {backgroundColor: Colors.Color1}]}>
              <FontAwesome
                style={{alignSelf: 'center'}}
                name="wpforms"
                size={22}
                color="#FFF"
              />
            </View>

            <TextView
              type={'normalRg'}
              style={styles.drawerLabels}
              text={'Employee Satisfication'}
            />
          </View>
        </Pressable>




        {/* ///////////////////////////////////////////////////////// */}
        {/* //------------------Cib File */}
        {/* <Pressable

          onPress={() => props.navigation.navigate('Cib')}

          style={{ marginTop: 0 }}>

          <View style={styles.drawerItem}>

            <View style={[styles.circle, { backgroundColor: Colors.Color1 }]}>

              <Octicons style={{ alignSelf: 'center' }} name="unverified" size={22} color="#FFF" />

            </View>

            <TextView

              type={'normalRg'}

              style={styles.drawerLabel}

              text={'CIB'}
            />
          </View>
        </Pressable> */}

        {/* ///////////////////////////////////////////////////////// */}
        {/* //------------------Cir File */}
        {/* <Pressable
          onPress={() => props.navigation.navigate('Cir')}
          style={{ marginTop: 0 }}>
          <View style={styles.drawerItem}>
            <View style={[styles.circle, { backgroundColor: Colors.Color1 }]}>
              <Octicons style={{ alignSelf: 'center' }} name="unverified" size={22} color="#FFF" />
            </View>
            <TextView
              type={'normalRg'}
              style={styles.drawerLabel}
              text={'CIR'}
            />
          </View>
        </Pressable> */}
        {/* ///////////////////////////////////////////////////////// */}
        {/* //------------------CIB REPORT*/}
        {/* { <Pressable
          onPress={() => props.navigation.navigate('CIBReport')}
          style={{ marginTop: 0 }}>
          <View style={styles.drawerItem}>
            <View style={[styles.circle, { backgroundColor: Colors.Color1 }]}>
              <MaterialCommunityIcons style={{ alignSelf: 'center' }} name="text-box-check-outline" size={22} color="#FFF" />
            </View>

            <TextView

              type={'normalRg'}

              style={styles.drawerLabel}

              text={'CIB Report'}

            />

          </View>

        </Pressable>} */}
        {/* ///////////////////////////////////////////////////////// */}

        {/* //------------------Loan Verification */}
        <Pressable
          onPress={() => props.navigation.navigate('LoanCalculator')}
          style={{marginTop: 0}}>
          <View style={styles.drawerItem}>
            <View style={[styles.circle, {backgroundColor: Colors.Color1}]}>
              <MaterialCommunityIcons
                style={{alignSelf: 'center'}}
                name="calculator"
                size={22}
                color="#FFF"
              />
            </View>

            <TextView
              type={'normalRg'}
              style={styles.drawerLabel}
              text={`${loanLabel} Calculator`}
            />
          </View>
        </Pressable>




         {/* //------------------Loan Officer Status Report */}
         <Pressable
          onPress={() => props.navigation.navigate('LoanStatusReport')}
          style={{marginTop: 0}}>
          <View style={styles.drawerItem}>
            <View style={[styles.circle, {backgroundColor: Colors.Color1}]}>
            <Ionicons
                style={{alignSelf: 'center'}}
                name="md-documents-outline"
                size={22}
                color="#FFF"
              />
            </View>

            <TextView
              type={'normalRg'}
              style={styles.drawerLabel}
              text={`${loanLabel} Status Report`}
            />
          </View>
        </Pressable>
        {/* ///////////////////////////////////////////////////////// */}
        {/* ///////////////////////////////////////////////////////// */}
        {/* //------------------Due Deatail Report */}
        <Pressable
          onPress={() => {
            if (StationReducer.station.stationName == undefined) {
              Alert.alert('Stop!', 'Please select station');
            } else {
              props.navigation.navigate('DueDetalReport');
            }
          }}
          style={{marginTop: 0}}>
          <View style={styles.drawerItem}>
            <View style={[styles.circle, {backgroundColor: Colors.Color1}]}>
              <Ionicons
                style={{alignSelf: 'center'}}
                name="md-documents-outline"
                size={22}
                color="#FFF"
              />
            </View>

            <TextView
              type={'normalRg'}
              style={styles.drawerLabel}
              text={'Detail Reports'}
            />
          </View>
        </Pressable>
        {/* ///////////////////////////////////////////////////////// */}

        {/* //------------------Daily Collection */}
        {(getUserData.UserData.EmployeeTypeName == 'Credit Officer' ||
          getUserData.UserData.EmployeeTypeName == 'Branch Manager' ||
          getUserData.UserData.EmployeeTypeName == 'Area Manager' ||
          getUserData.UserData.EmployeeTypeName == 'Manager Operation') && (
          <Pressable
            onPress={() => {
              if (StationReducer.station.stationName == undefined) {
                Alert.alert('Stop!', 'Please select station');
              } else {
                props.navigation.navigate('DailyCollectionReport');
              }
            }}
            style={{marginTop: 0}}>
            <View style={styles.drawerItem}>
              <View style={[styles.circle, {backgroundColor: Colors.Color1}]}>
                <Ionicons
                  style={{alignSelf: 'center'}}
                  name="md-documents-outline"
                  size={22}
                  color="#FFF"
                />
              </View>

              <TextView
                type={'normalRg'}
                style={styles.drawerLabel}
                text={'Daily Collection'}
              />
            </View>
          </Pressable>
        )}
        {/* ///////////////////////////////////////////////////////// */}

        {/* //------------------Repayment sync up */}
        <Pressable
          onPress={() => {
            Alert.alert(
              'Do you want to Sync down ?',
              'PERVIOUS REPAYMENTS WILL BE DELETE',
              [
                {
                  text: 'okay',
                  onPress: () => {
                    setSyncUpDialoge(true);

                    getStationData(setArray, setNoData);
                  },
                },
                {
                  text: 'cancel',
                  onPress: () => {
                    setSyncUpDialoge(false);
                  },
                },
              ],
            );
          }}
          style={{marginTop: 0}}>
          <View style={styles.drawerItem}>
            <View style={[styles.circle, {backgroundColor: Colors.Color1}]}>
              <Ionicons
                style={{alignSelf: 'center'}}
                name="sync"
                size={22}
                color="#FFF"
              />
            </View>

            <TextView
              type={'normalRg'}
              style={styles.drawerLabel}
              text={'Repayment \n Sync Down'}
            />
          </View>
        </Pressable>
        {/* ///////////////////////////////////////////////////////// */}

        {/* //------------------Repayment */}
        <Pressable
          onPress={() => props.navigation.navigate('Repayment')}
          style={{marginTop: 0}}>
          <View style={styles.drawerItem}>
            <View style={[styles.circle, {backgroundColor: Colors.Color1}]}>
              <MaterialIcons
                style={{alignSelf: 'center'}}
                name="payments"
                size={22}
                color="#FFF"
              />
            </View>

            <TextView
              type={'normalRg'}
              style={styles.drawerLabel}
              text={'Repayment'}
            />
          </View>
        </Pressable>
        {/* /////////////////////////////////////////////////////////// */}

        <Pressable
          onPress={() => props.navigation.navigate('LoanVerification')}
          style={{marginTop: 0}}>
          <View style={styles.drawerItem}>
            <View style={[styles.circle, {backgroundColor: Colors.Color1}]}>
              <Ionicons
                style={{alignSelf: 'center'}}
                name="md-documents-outline"
                size={22}
                color="#FFF"
              />
            </View>

            <TextView
              type={'normalRg'}
              style={styles.drawerLabel}
              text={`${loanLabel} Verification`}
            />
          </View>
        </Pressable>
        {/* } */}
        {/* /////////////////////////////////////////////////////////// */}

        {/* //------------------Client Consent */}
        <Pressable
          onPress={() => props.navigation.navigate('ClientConsent')}
          style={{marginTop: 0}}>
          <View style={styles.drawerItem}>
            <View style={[styles.circle, {backgroundColor: Colors.Color1}]}>
              <FontAwesome5
                style={{alignSelf: 'center'}}
                name="file-signature"
                size={22}
                color="#FFF"
              />
            </View>

            <TextView
              type={'normalRg'}
              style={styles.drawerLabel}
              text={'Client Consent'}
            />
          </View>
        </Pressable>
        {/* /////////////////////////////////////////////////////////// */}

        {/* //------------------Complain System */}
        <Pressable
          onPress={() => props.navigation.navigate('Complain')}
          style={{marginTop: 0}}>
          <View style={styles.drawerItem}>
            <View style={[styles.circle, {backgroundColor: Colors.Color1}]}>
              <AntDesign
                style={{alignSelf: 'center'}}
                name="exclefile1"
                size={22}
                color="#FFF"
              />
            </View>

            <TextView
              type={'normalRg'}
              style={styles.drawerLabel}
              text={'Complain '}
            />
          </View>
        </Pressable>


  {/* //------------------HrmsComplain System */}
  {/* <Pressable
          onPress={() => props.navigation.navigate('HrmsComplain')}
          style={{marginTop: 0}}>
          <View style={styles.drawerItem}>
            <View style={[styles.circle, {backgroundColor: Colors.Color1}]}>
              <AntDesign
                style={{alignSelf: 'center'}}
                name="exclefile1"
                size={22}
                color="#FFF"
              />
            </View>

            <TextView
              type={'normalRg'}
              style={styles.drawerLabel}
              text={'HrmsComplain '}
            />
          </View>
        </Pressable> */}


        {/* //------------------TO DO TASK */}
        <Pressable
          onPress={() => props.navigation.navigate('ToDoTask')}
          style={{marginTop: 0}}>
          <View style={styles.drawerItem}>
            <View style={[styles.circle, {backgroundColor: Colors.Color1}]}>
              <FontAwesome
                style={{alignSelf: 'center'}}
                name="tasks"
                size={22}
                color="#FFF"
              />
            </View>
            <TextView
              type={'normalRg'}
              style={styles.drawerLabel}
              text={'Add Task '}
            />
          </View>
        </Pressable>

        {/* //-------=============____organization_salary_payslips_______================------------*/}

        <Pressable
          onPress={() => props.navigation.navigate('SalaryPaySlip')}
          style={{marginTop: 0}}>
          <View style={styles.drawerItem}>
            <View style={[styles.circle, {backgroundColor: Colors.Color1}]}>
              <Ionicons
                style={{alignSelf: 'center'}}
                name="document-text-sharp"
                size={22}
                color="#FFF"
              />
            </View>

            <TextView
              type={'normalRg'}
              style={styles.drawerLabel}
              text={'Salary PaySlip '}
            />
          </View>
        </Pressable>

        <Pressable
          onPress={() => props.navigation.navigate('faqs')}
          style={{marginTop: 0}}>
          <View style={styles.drawerItem}>
            <View style={[styles.circle, {backgroundColor: Colors.Color1}]}>
              <FontAwesome
                style={{alignSelf: 'center'}}
                name="wpforms"
                size={22}
                color="#FFF"
              />
            </View>

            <TextView
              type={'normalRg'}
              style={styles.drawerLabels}
              text={'FAQS'}
            />
          </View>
        </Pressable>

        {/* /////////////////////////////////////////////////////////// */}

        {/* ///////////////////////////////////////////////////////// */}

        <View
          style={{
            marginLeft: 20,
            marginTop: 10,
            flexDirection: 'row',
            alignItems: 'center',
          }}>
          <View
            style={{
              borderColor: '#FFF',
              borderWidth: 1,
              borderRadius: 1,
              borderStyle: 'dashed',
              height: 0.5,
              flex: 1,
            }}
          />

          <TextView style={{color: '#FFF', marginTop: 5}} text=" X " />

          <View
            style={{
              borderColor: '#FFF',
              borderWidth: 1,
              borderRadius: 1,
              borderStyle: 'dashed',
              height: 0.5,
              flex: 1,
            }}
          />
        </View>
        {/* //------------------database SFF -export */}
        <Pressable
          onPress={async () => {
            checkExportSffDatabase().then(e => {
              if (e > 0) {
                setExportSffDialoge(true);
              } else {
                Alert.alert('Stop!', 'You cannot export empty database');
              }
            });
          }}
          style={{marginTop: 0}}>
          <View style={styles.drawerItem}>
            <View style={[styles.circle, {backgroundColor: Colors.Color1}]}>
              <MaterialCommunityIcons
                style={{alignSelf: 'center'}}
                name="database-export"
                size={22}
                color="#FFF"
              />
            </View>

            <TextView
              type={'normalRg'}
              style={styles.drawerLabel}
              text={'Export SFF Database'}
            />
          </View>
        </Pressable>
        {/* ///////////////////////////////////////////////////////// */}

        {/* ///////////////////////////////////////////////////////// */}
        {/* //------------------database SSF -import  */}
        <Pressable
          onPress={() => {
            setImportSffDialoge(true);
            //handleImport
          }}
          style={{marginTop: 0}}>
          <View style={styles.drawerItem}>
            <View style={[styles.circle, {backgroundColor: Colors.Color1}]}>
              <MaterialCommunityIcons
                style={{alignSelf: 'center'}}
                name="database-import"
                size={22}
                color="#FFF"
              />
            </View>

            <TextView
              type={'normalRg'}
              style={styles.drawerLabel}
              text={'Import SSF Database'}
            />
          </View>
        </Pressable>
        {/* ///////////////////////////////////////////////////////// */}
        {/* //------------------database Repayment -export */}
        <Pressable
          onPress={
            () => {
              {
                checkExportRepaymentDatabase().then(e => {
                  if (e > 0) {
                    setExpRepaymentDialoge(true);
                  } else {
                    Alert.alert('Stop!', 'You cannot export empty database');
                  }
                });
              }
            }
            //handleRepaymentExport
          }
          style={{marginTop: 0}}>
          <View style={styles.drawerItem}>
            <View style={[styles.circle, {backgroundColor: Colors.Color1}]}>
              <MaterialCommunityIcons
                style={{alignSelf: 'center'}}
                name="database-export"
                size={22}
                color="#FFF"
              />
            </View>

            <TextView
              type={'normalRg'}
              style={styles.drawerLabel}
              text={'Export Repayment Database'}
            />
          </View>
        </Pressable>
        {/* ///////////////////////////////////////////////////////// */}

        {/* ///////////////////////////////////////////////////////// */}
        {/* //------------------database Repayment -import  */}

        <Pressable
          onPress={
            () => {
              setImpRepaymentDialoge(true);
            }

            //handleRepaymentImport
          }
          style={{marginTop: 0}}>
          <View style={styles.drawerItem}>
            <View style={[styles.circle, {backgroundColor: Colors.Color1}]}>
              <MaterialCommunityIcons
                style={{alignSelf: 'center'}}
                name="database-import"
                size={22}
                color="#FFF"
              />
            </View>

            <TextView
              type={'normalRg'}
              style={styles.drawerLabel}
              text={'Import Repayment Database'}
            />
          </View>
        </Pressable>
        {/* ///////////////////////////////////////////////////////// */}
      </View>
      {/* //Dialoges//////////////// */}

      <AskingQuestion
        title="Do you really want to Sync down ?"
        message="May be its takes 1,2 minutes.."
        dialogVisible={confirmDialoge}
        setDialogVisible={setConfirmDialoge}
        onPress={() => _handleSyncDown()}
      />
      {/* //////// Export SFF Database Dialog */}

      <AskingQuestion
        title="Do you really want to Export SFF Database ?"
        message=""
        dialogVisible={exportSffDialoge}
        setDialogVisible={setExportSffDialoge}
        onPress={() => {
          setExportSffDialoge(false);
          handleExport();
        }}
      />

      {/* //////// Import SFF Database Dialog */}
      <AskingQuestion
        title="Do you really want to Import SFF Database ?"
        message=""
        dialogVisible={importSffDialoge}
        setDialogVisible={setImportSffDialoge}
        onPress={() => {
          setImportSffDialoge(false);
          handleImport();
        }}
      />

      {/* //////// Export Repayment Database Dialog */}

      <AskingQuestion
        title="Do you really want to Export Repayment Database ?"
        message=""
        dialogVisible={exportRepaymentDialoge}
        setDialogVisible={setExpRepaymentDialoge}
        onPress={() => {
          setExpRepaymentDialoge(false);
          handleRepaymentExport();
        }}
      />

      {/* //////// Import Repayment Database Dialog */}

      <AskingQuestion
        title="Do you really want to Import Repayment Database ?"
        message=""
        dialogVisible={importRepaymentDialoge}
        setDialogVisible={setImpRepaymentDialoge}
        onPress={() => {
          setImpRepaymentDialoge(false);
          handleRepaymentImport();
        }}
      />

      <CustomProgressDialoge
        dialogVisible={progressVisible}
        setDialogVisible={setProgressVisible}
        title={title}
      />
      <ProgressDialog
        visible={progressDialoge}
        title={title}
        message="Please, wait..."
        activityIndicatorColor={Colors.darkGreenColor}
      />

      {/* //-------------------------------------MODAL */}

      <ModalView
        visible={dialogVisible}
        setVisible={setDialogeVisible}
        setValuefromModule={setValuefromModule}
        getValuefromModule={getValuefromModule}
        stations={getStationArray}
        text={'Choose Station'}
        // onPress={_onSavedClick}
      ></ModalView>
      {/* --------------------------------------------- */}

      {/* //--------------------------------sync up MODAL */}

      <ModalView
        visible={syncUpDialoge}
        setVisible={setSyncUpDialoge}
        setValuefromModule={setSyncUpValModule}
        getValuefromModule={getSyncUpValueFromModule}
        stations={getArray}
        text={`Selected Station : ${StationReducer.station.stationName}`}
        onPress={_syncUp}></ModalView>
      <View style={{alignItems: 'center', margin: 10}}>
        <TextView
          text={'version :' + ApplicationVersion}
          style={styles.bottomText}
        />
        <TextView
          text={'release date :' + releaseDate}
          style={styles.bottomText}
        />
      </View>
    </DrawerContentScrollView>
  );
};

export default memo(DrawerContent);
const styles = StyleSheet.create({
  stack: {
    flex: 1,
    // shadowColor: '#FFF',
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.44,
    shadowRadius: 10.32,
    elevation: 5,
    // overflow: 'scroll',
    // borderWidth: 1,
  },
  drawerStyles: {
    flex: 1,
    width: '50%',
    backgroundColor: 'transparent',
  },
  drawerItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 15,
    marginTop: 15,
  },
  drawerLabel: {
    color: 'white',
    marginLeft: 20,
    alignSelf: 'center',
    marginTop: 5,
  },
  drawerLabels: {
    color: 'white',
    marginLeft: 18,
    alignSelf: 'center',
    marginTop: 5,
    fontSize:11.5,
  },
  circle: {
    borderRadius: 100,
    height: 40,
    width: 40,
    justifyContent: 'center',
  },
  circleimg: {
    borderRadius: 100,
    marginLeft: 0,
    marginTop: 50,
    height: 60,
    width: 60,
    backgroundColor: '#FFF',
    justifyContent: 'center',
  },
  logout: {
    height: 30,
    width: 100,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    alignSelf: 'center',
    marginTop: 5,
    borderRadius: 20,
    justifyContent: 'center',
  },
  bottomText: {
    fontSize: 11,
    color: '#cdcdcd',
  },
  notificationBadge: {
    position: 'absolute',
    top: -5,
    right: -5,
    backgroundColor: 'red',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    minWidth: 20,
    minHeight: 20,
  },
  notificationText: {
    color: 'white',
    fontSize: 12,
  },
});
