import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  Platform,
  Image,
  StyleSheet,
  Alert,
  Dimensions,
  Keyboard,
} from 'react-native';
import { Colors, Icons } from '../../theme';
import { useNavigation } from '@react-navigation/native';
import NetInfo from '@react-native-community/netinfo';
import * as Animatable from 'react-native-animatable';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Feather from 'react-native-vector-icons/Feather';
import { AppStatusBar, CustomButton, TextView, Loader } from '../../components';
const { height, width } = Dimensions.get('window');
import LinearGradient from 'react-native-linear-gradient';
import { onSignIn } from '../../apis_auth/apis';
import { connect, useSelector } from 'react-redux';
import { checkCustomerInfo, getCustomerLoginInfo, insertCustomerLoginData, UpdateLoginData } from '../../sqlite/sqlitedb';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useBatteryLevel ,useBatteryLevelIsLow ,useDeviceName ,useIsEmulator} from 'react-native-device-info';
import DeviceInfo from 'react-native-device-info'


const SignInScreen = (props) => {
  let deviceJSON ={};
  const navigation = useNavigation();
  const [data, setData] = React.useState({
    username: '',
    password: '',
    deviceId:'',
    check_textInputChange: false,
    secureTextEntry: true,
    isValidUser: true,
    isValidPassword: true,
  });
  const [fetchUserdata, setUserData] = React.useState(null);
  const [isProgress, setProgress] = React.useState(false);

  React.useEffect(()=>{
    let getUniqueId = DeviceInfo.getUniqueId();

    setData({...data, deviceId:getUniqueId})
  },[])


  const textInputChange = val => {
    if (val.trim().length >= 4) {
      setData({
        ...data,
        username: val,
        check_textInputChange: true,
        isValidUser: true,
      });
    } else {
      setData({
        ...data,
        username: val,
        check_textInputChange: false,
        isValidUser: false,
      });
    }
  };

  const handlePasswordChange = val => {
    if (val.trim().length >= 6) {
      setData({
        ...data,
        password: val,
        isValidPassword: true,
      });
    } else {
      setData({
        ...data,
        password: val,
        isValidPassword: false,
      });
    }
  };

  const updateSecureTextEntry = () => {
    setData({
      ...data,
      secureTextEntry: !data.secureTextEntry,
    });
  };

  const handleValidUser = val => {
    if (val.trim().length >= 4) {
      setData({
        ...data,
        isValidUser: true,
      });
    } else {
      setData({
        ...data,
        isValidUser: false,
      });
    }
  };

  const loginHandle = async (userName, password) => {
    if (data.username.length == 0) {
      Alert.alert(
        'Wrong Input!',
        'Username field cannot be empty.',
        [{ text: 'Okay' }],
      );
      return;
    }
    Keyboard.dismiss();
    NetInfo.fetch().then(state => {
      //console.log('Connection type', state.type);
      //console.log('Is connected?', state.isConnected);
      if (!state.isConnected) {
        setProgress(true)
        getCustomerLoginInfo(data.username, data.password).then((value) => {

          if (value?.length > 0) {
            var parser = JSON.parse(value[0].LoginData);
            props.UpdateUserData(parser)
            // console.log('LoginData', parser)
            props.StationData({ stationId: parser.StationId, stationName: parser.StationName })
            AsyncStorage.setItem("@station", JSON.stringify({ stationId: parser?.StationId, stationName: parser?.StationName }));
            setProgress(false)

            navigation.replace('Drawer');
          } else {
            setProgress(false)
            Alert.alert(
              'Wrong Credentials!',
              'Try again with correct information.',
              [{ text: 'Okay' }],

            );
         

            return;
          }
        })
      } else {
        setProgress(true)
        onSignIn(
          data.username,
          data.password,
          data.deviceId,
          `${DeviceInfo.getBrand()} ${DeviceInfo.getModel()}`,
          setUserData,
        ).then((values) => {
          // alert(JSON.stringify(values.FirstName))
          if (values) {
            getCustomerLoginInfo(data.username, data.password).then((value) => {

              if (value?.length > 0) {
                props.UpdateUserData(values)
            props.StationData({ stationId: values?.StationId, stationName: values?.StationName })
            AsyncStorage.setItem("@station", JSON.stringify({ stationId: values?.StationId, stationName: values?.StationName }));
            UpdateLoginData(JSON.stringify(values), values?.EmployeeId).then((rees) => {
              // console.log('UpdateLoginData', rees)
            })
                setProgress(false)
                navigation.replace('Drawer');
              } else {
                insertCustomerLoginData(values, data.username, data.password).then((response) => {
                  if (response) {
                    props.UpdateUserData(values)
            props.StationData({ stationId: values?.StationId, stationName: values?.StationName })
            AsyncStorage.setItem("@station", JSON.stringify({ stationId: values?.StationId, stationName: values?.StationName }));
                    setProgress(false)
                    navigation.replace('Drawer');
                  }
                }).catch(() => {
                  setProgress(false)

                })
              }
            })


          }

        }).catch((err) => {
          if(err=="invalid"){
            Alert.alert("Invalid Credentials", "Please enter valid credentials", [{ text: 'Okay' }])
            setProgress(false)
            return;
          }
          checkCustomerInfo(data.username).then((value) => {

            if (value?.length > 0) {
              setProgress(true)

              getCustomerLoginInfo(data.username, data.password).then((value) => {

                if (value?.length > 0) {
                  var parser = JSON.parse(value[0].LoginData);
                  props.UpdateUserData(parser)
            props.StationData({ stationId: parser.StationId, stationName: parser.StationName })
            AsyncStorage.setItem("@station", JSON.stringify({ stationId: parser.StationId, stationName: parser.StationName }));
                  
                  setProgress(false)
      
                  navigation.replace('Drawer');
                } else {
                  setProgress(false)
                  Alert.alert(
                    'Wrong Credentials!',
                    'Try again with correct information.',
                    [{ text: 'Okay' }],
      
                  );
               
      
                  return;
                }
              })
            } else {
              setProgress(false)
          Alert.alert('Connection Timeout!', 'Try again after few minutes \n' + err);

              // Alert.alert(
              //   'Wrong Credentials!',
              //   'Try again with correct information.',
              //   [{ text: 'Okay' }],
  
              // );
           
  
              return;
            }
          })

          setProgress(false)

        });


        // //console.log('hahahah?',fetchUserdata);
      }
      //console.log('---ALL', state);
    });



  };


  return (
    <View style={[styles.container, { backgroundColor:Colors.primary }]}>
      <AppStatusBar></AppStatusBar>
      <View style={styles.header}>
        <Image
          style={{
            height: 200,
            width: 200,

            resizeMode: 'contain',
            alignSelf: 'center',
          }}
          source={Icons.safcologo}></Image>
        {/* <TextView
      text='Welcome!'
      type={'headingMid'}
        style={{color: "#fff"}}
      /> */}
      </View>
      <Animatable.View
        animation="fadeInUpBig"
        style={[
          styles.footer,
          {
            backgroundColor: Colors.backgroundColor,
          },
        ]}>
        <TextView
          text="Username"
          type={'normalRg'}
          style={{ color: Colors.text }}
        />
        <View style={styles.action}>
          <FontAwesome name="user-o" color={Colors.text} size={20} />
          <TextInput
            placeholder="Your Username"
            placeholderTextColor="#cdcdcd"
            style={[
              styles.textInput,
              {
                color: Colors.darkGreenColor,
              },
            ]}
            autoCapitalize="none"
            onChangeText={val => textInputChange(val)}
            onEndEditing={e => handleValidUser(e.nativeEvent.text)}
          />
          {data.check_textInputChange ? (
            <Animatable.View animation="bounceIn">
              <Feather name="check-circle" color="green" size={20} />
            </Animatable.View>
          ) : null}
        </View>
        {data.isValidUser ? null : (
          <Animatable.View animation="fadeInLeft" duration={500}>
            <Text style={styles.errorMsg}>
              Username must be 4 characters long.
            </Text>
          </Animatable.View>
        )}

        <TextView
          text="Password"
          type={'normalRg'}
          style={{ color: Colors.text, marginTop: 20 }}
        />

        <View style={styles.action}>
          <Feather name="lock" color={Colors.text} size={20} />
          <TextInput
            placeholder="Your Password"
            placeholderTextColor="#cdcdcd"
            secureTextEntry={data.secureTextEntry ? true : false}
            style={[
              styles.textInput,
              {
                color: Colors.darkGreenColor,
              },
            ]}
            autoCapitalize="none"
            onChangeText={val => handlePasswordChange(val)}
          />
          <TouchableOpacity onPress={updateSecureTextEntry}>
            {data.secureTextEntry ? (
              <Feather name="eye-off" color="grey" size={20} />
            ) : (
              <Feather name="eye" color="grey" size={20} />
            )}
          </TouchableOpacity>
        </View>
        {data.isValidPassword ? null : (
          <Animatable.View animation="fadeInLeft" duration={500}>
            <Text style={styles.errorMsg}>
              Password must be 6 characters long.
            </Text>
          </Animatable.View>
        )}

        <TouchableOpacity>
          {/* <Text style={{color: '#009387', marginTop:15}}>Forgot password?</Text> */}
        </TouchableOpacity>

        <View style={styles.button}>
          <CustomButton
            style={styles.signIn}
            onPress={() => {
              loginHandle(data.username, data.password);
            }}
            text={'Sign In'}></CustomButton>

          {isProgress && <Loader></Loader>}
        </View>
      </Animatable.View>
    </View>
  );
};

const mapDispatchToProps = dispatch => {
  return {
    UpdateUserData: Data => {
      dispatch({
        type: 'UserData',
        payload: Data,
      });
    },
    StationData: Data => {
      dispatch({
        type: 'STATION',
        payload: Data,
      });
    },
  };
};
export default connect(null, mapDispatchToProps)(SignInScreen);

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flex: 1,
    justifyContent: 'flex-end',
    paddingHorizontal: 20,
    paddingBottom: 0,
    marginTop: 100,
  },
  footer: {
    flex: 3,
    backgroundColor: '#fff',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingHorizontal: 20,
    paddingVertical: 30,
  },
  text_header: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 30,
  },
  text_footer: {
    color: '#05375a',
    fontSize: 18,
  },
  action: {
    flexDirection: 'row',
    marginTop: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#f2f2f2',
    paddingBottom: 5,
  },
  actionError: {
    flexDirection: 'row',
    marginTop: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#FF0000',
    paddingBottom: 5,
  },
  textInput: {
    flex: 1,
    marginTop: Platform.OS === 'ios' ? 0 : -12,
    paddingLeft: 10,
    color: '#05375a',
  },
  errorMsg: {
    color: '#FF0000',
    fontSize: 14,
  },
  button: {
    alignItems: 'center',
    marginTop: 50,
  },
  signIn: {
    width: '100%',
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
  },
  textSign: {
    fontSize: 18,
    fontWeight: 'bold',
  },
});
