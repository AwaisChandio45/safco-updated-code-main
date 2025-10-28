import React, {useEffect, memo} from 'react';
import type {Node} from 'react';
import {
  SafeAreaView,
  Image,
  StatusBar,
  StyleSheet,
  Text,
  Dimensions,
  useColorScheme,
  View,
  Animated,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import * as Animatable from 'react-native-animatable';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {AppStatusBar, TextView} from '../components';
import {Colors, Icons} from '../theme';
import {connect, useSelector} from 'react-redux';
const {height, width} = Dimensions.get('window');
import {NativeModules} from 'react-native';
import {
  onquestionsArray,
  initDatabase,
  getLoanTopupLoanArray,
  getEmployeesRegionArray,
  getAssetsDocuments,
  getCustomersFormsTemp,
  DeleteCustomersFormsTemp,
} from '../sqlite/sqlitedb';
import {
  CreateDatabaseManually,
  CreateRepaymentLogTable,
} from '../sqlite/RepaymentDataBase';
import {getPermission} from '../utilis/GetPermission';
import AskingDialoge from '../components/AskingDialoge';
import AskingDialogeSplash from '../components/AskingDialogeSplash';
import {ApplicationVersion, releaseDate} from '../utilis/ContsValues';
//import { getEmpRegion } from '../sqlite/sqlitedb';
const {FingerModule} = NativeModules;

const Splash: () => Node = props => {
  const navigation = useNavigation();
  const [getQuestion, setQuestion] = React.useState([]);
  const [noData, setNoData] = React.useState([]);
  const [startAnimation, setStartAnimation] = React.useState(true);
  const [dialogVisible, setDialogeVisible] = React.useState(false);
  const [tempData, setTempData] = React.useState(undefined);
  const [userData, setUserData] = React.useState(undefined);
  const [stations, setStations] = React.useState(undefined);
  const [getter, setter] = React.useState(undefined);

  useEffect(async () => {
    // ********************** INITIALIZE FINGER PRINT ************************************
    try {
      await FingerModule.gettingusbPermission();
    } catch (e) {
      //console.log("splash catch", e)
    }
    // ********************** INITIALIZE FINGER PRINT ************************************

    setTimeout(() => {
      getEmployeesRegionArray().then(regions => {
        props.GETRegions(regions);
        letsGo(get, parser, parser2);
      });
      // getCustomersFormsTemp().then((customers) => {
      //   if (customers) {
      //     if (customers.length > 0) {
      //       var parser = JSON.parse(customers[0].tempForms)
      //       setTempData(parser)
      //       setDialogeVisible(true)
      //       // console.log("customers", parser.customerInfo)

      //     } else {
      //       letsGo(get, parser, parser2)
      //     }
      //   }
      // }).catch((error) => {
      //   console.log("error", error)
      // });
    }, 3000);
    let get = await AsyncStorage.getItem('@userData');
    setter(get);
    let get2 = await AsyncStorage.getItem('@station');
    let syncDown = await AsyncStorage.getItem('@syncDown');
    let parser3 = JSON.parse(syncDown);
    if (syncDown != null) {
      // console.log("syncDown-1",parser3)
      props.SyncDown('1');
    } else {
      // console.log("syncDown-2",syncDown)
    }
    let parser = JSON.parse(get);
    setUserData(JSON.parse(get));
    let parser2 = '';
    if (get2) {
      parser2 = JSON.parse(get2);
      setStations(JSON.parse(get2));
    }
    props.UpdateUserData(parser);
    props.Station(parser2);
    onquestionsArray().then(async response => {
      if (response) {
        props.GETQuestions(response);
      } else {
      }
    });
    getLoanTopupLoanArray()
      .then(values => {
        props.GETTopup(values);
      })
      .catch(error => {
        alert(JSON.stringify(error));
      });
  }, []);
  const _onYesPress = () => {
    setDialogeVisible(false);
    props.Updatecheck({value: true, id: null});
    props.navigation.navigate('AddForm', {item: tempData});
  };
  const _onCanclePress = () => {
    setDialogeVisible(false);
    props.Updatecheck({value: false, id: null});
    DeleteCustomersFormsTemp();
    letsGo(getter, userData, stations);
  };
  const letsGo = async (get, parser, parser2) => {
    props.Updatecheck({value: false, id: null});
    getPermission()
      .then(valid => {
        if (get) {
          // my code- when you want without login then chnge login to drawerr
          navigation.replace('Login', {userData: parser, station: parser2});
        } else {
          navigation.replace('Login', {userData: parser, station: parser2});
        }
      })
      .catch(e =>
        navigation.replace('PermissionScreen', {
          userData: parser,
          station: parser2,
        }),
      );
  };
  return (
    <SafeAreaView
      style={[styles.safeview, {backgroundColor: Colors.backgroundColor}]}>
      <AppStatusBar></AppStatusBar>
      <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
        {startAnimation && (
          <Animatable.View
            duration={2800}
            style={{height: 160}}
            animation="flipInY">
            <Image
              style={{
                height: 200,
                width: 200,
                resizeMode: 'contain',
                borderRadius: 20,
              }}
              source={Icons.applogo}></Image>
          </Animatable.View>
        )}
      </View>
      <View style={{alignItems: 'center', borderWidth: 0, marginBottom: 10}}>
        {startAnimation && (
          <Animatable.View
            duration={2500}
            easing={'linear'}
            animation={'fadeInUp'}>
            <View style={{alignItems: 'center'}}>
              <TextView
                text={'version :' + ApplicationVersion}
                style={styles.bottomText}
              />
              <TextView
                text={'release date :' + releaseDate}
                style={styles.bottomText}
              />
            </View>
          </Animatable.View>
        )}
      </View>
      <AskingDialogeSplash
        h1="Await!"
        h2="Application is closed while submitting Customer Form do you want to continue?"
        dialogVisible={dialogVisible}
        setDialogVisible={setDialogeVisible}
        onPressCancle={_onCanclePress}
        onPress={_onYesPress}
      />
    </SafeAreaView>
  );
};
const styles = StyleSheet.create({
  safeview: {
    justifyContent: 'center',
    flex: 1,
  },
  bottomText: {fontWeight: 'bold', fontSize: 14, color: '#cdcdcd'},
});
const mapDispatchToProps = dispatch => {
  return {
    UpdateUserData: Data => {
      dispatch({
        type: 'UserData',
        payload: Data,
      });
    },
    Station: Data => {
      dispatch({
        type: 'STATION',
        payload: Data,
      });
    },
    GETQuestions: Data => {
      dispatch({
        type: 'QUESTION',
        payload: Data,
      });
    },
    GETTopup: Data => {
      dispatch({
        type: 'TOPUPLOAN',
        payload: Data,
      });
    },
    GETRegions: Data => {
      dispatch({
        type: 'REGIONS',
        payload: Data,
      });
    },
    Updatecheck: Data => {
      dispatch({
        type: 'SET_TempFormReducer',
        payload: Data,
      });
    },
    SyncDown: Data => {
      dispatch({
        type: 'SYNCDOWN',
        payload: Data,
      });
    },
  };
};
export default connect(null, mapDispatchToProps)(memo(Splash));
