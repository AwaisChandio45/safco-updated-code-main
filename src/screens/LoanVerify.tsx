import React, {useRef} from 'react';
import {
  SafeAreaView,
  Text,
  View,
  TextInput,
  Keyboard,
  Dimensions,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import {AppStatusBar, HeaderwithoutDialoge, TextView} from '../components';
import {GlobalStyles, Colors} from '../theme';
import {useSelector} from 'react-redux';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {CustomButton} from '../components';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
const {height, width} = Dimensions.get('window');
const LoanVerify = () => {
  React.useEffect(() => {
    Keyboard.addListener('keyboardDidHide', () => {});
  }, []);
  const [cincNumber, setCnicNumber] = React.useState();
  const getCnicNum = value => {
    if (value.length < 16) {
      if (value.length == 5 || value.length == 13) {
        var plus = value + '-';
        setCnicNumber(plus);
      } else {
        setCnicNumber(value);
      }
    }
  };
  const getUserData = useSelector(state => state.UserData);
  const OrganizationType = Number(getUserData?.UserData?.OrganizationType);
  const loanLabel = OrganizationType === 2 ? 'Finance Facility' : 'Loan';
  return (
    <SafeAreaView style={{flex: 1, backgroundColor: '#fff'}}>
      <AppStatusBar></AppStatusBar>
      <View style={GlobalStyles.row}>
        <HeaderwithoutDialoge Theme={Colors} back={true}></HeaderwithoutDialoge>
        <TextView
          type={'mini_heading22'}
          style={{paddingHorizontal: 30, marginTop: 55, fontSize: 15}}
          text={`${loanLabel} Verification`}></TextView>
      </View>
      <View style={styles.mainContainer}>
        <View style={styles.Container}>
          <View style={styles.logoContainer}>
            <View style={styles.logoContainerSecondLayer}>
              <MaterialCommunityIcons
                name="card-account-details-star-outline"
                color="#fff"
                size={50}
              />
            </View>
          </View>
          <View style={{marginTop: 20}}>
            <View style={styles.inputContainer}>
              <FontAwesome5
                size={26}
                style={{marginRight: 20, color: Colors.parrotGreenColor}}
                name={'id-card'}
              />
              <TextInput
                style={styles.inputText}
                placeholder="CNIC Number"
                keyboardType={'decimal-pad'}
                value={cincNumber}
                //ref={(input)=>//console.log()}
                onChangeText={text => getCnicNum(text)}
              />
            </View>
            <View style={styles.BtnCont}>
              <CustomButton
                text={'Submit'}
                style={{
                  padding: 10,
                  borderRadius: 20,
                  alignItems: 'center',
                  width: '90%',
                }}
                textStyle={{fontSize: 17}}
              />
              <CustomButton
                text={'Verify'}
                style={{
                  padding: 10,
                  borderRadius: 20,
                  alignItems: 'center',
                  width: '90%',
                }}
                textStyle={{fontSize: 17}}
              />
            </View>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    padding: 20,
    flexDirection: 'column',
    justifyContent: 'center',
  },
  Container: {
    backgroundColor: '#fff',
    borderRadius: 15,
    height: height / 2,
    shadowColor: 'black',
    shadowOpacity: 0.26,
    shadowOffset: {width: 0, height: 2},
    shadowRadius: 10,
    elevation: 20,
  },
  inputContainer: {
    justifyContent: 'center',
    padding: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  logoContainer: {
    alignItems: 'center',
  },
  logoContainerSecondLayer: {
    backgroundColor: Colors.parrotGreenColor,
    elevation: 10,
    width: 80,
    height: 80,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 50,
    marginTop: '-12%',
  },
  inputText: {
    fontFamily: 'PoppinsRegular',
    backgroundColor: '#fff',
    width: '60%',
    paddingLeft: 10,
    alignSelf: 'center',
    borderBottomWidth: 1,
    borderColor: '#c4c4c2',
    marginBottom: 20,
    color: '#1d1d1d',
    fontSize: 14,
  },
  BtnCont: {
    padding: 10,
    alignItems: 'center',
  },
  pressSubmit: {
    margin: 10,
    backgroundColor: Colors.kulfa,
    borderRadius: 10,
    elevation: 5,
  },
  pressVerify: {
    margin: 10,
    backgroundColor: Colors.kulfa,
    borderRadius: 10,
    elevation: 5,
  },
});

export default LoanVerify;
