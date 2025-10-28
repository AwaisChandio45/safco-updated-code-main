//------------------THEMER COLORS---------------------------
// '#5A95D3', '#0F5298'

import {memo} from 'react';
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
import Animated from 'react-native-reanimated';
import Tabs from './Tabs';
import ClientCertSurvey from '../screens/ClientSurvey/ClientCertSurvey';
import ClientSurveyForm from '../screens/ClientSurvey/ClientSurveyForm';
import Cib from '../screens/Cib';
import Cir from '../screens/Cir';
import LoanVerify from '../screens/LoanVerify';
import DueDetalReport from '../screens/DueDetailReportTab/DueDetailReport';
import DailyCollectionReport from '../screens/DueDetailReportTab/DailyCollectionReport';
import Repayment from '../screens/Repayment';
import LoanVerification from '../screens/LoanVerification';
import ModalDropDown from '../components/ModalDropDown';
import GeneratedReport from '../screens/DueDetailReportTab/GeneratedReport';
import GeneratedDailyReport from '../screens/DueDetailReportTab/GeneratedDailyReport';
import Dashbordreport from '../screens/DueDetailReportTab/Dashbordreport';
import BmData from '../screens/BmData';
import RegionalZonalData from '../screens/RegionalZonalData';
import LoanVerificationReport from '../screens/LoanVerificationReport';
import CreditScoringReport from '../screens/CreditScoringReport';

import {SafcoCustomerDetail} from '../screens/BottomTabs';
import CIBView from '../components/CIBView';
import PermissionScreen from '../screens/PermissionScreen';
import UserDetailForZM from '../screens/UserDetailForZM';
import LoanCalculator from '../screens/LoanCalculator';
import Anouncement from '../screens/Anouncement';
import CIBReport from '../screens/CIBReport';
import ClientConsent from '../screens/ClientConsent';
import Complain from '../screens/Complain';
import ToDoTask from '../screens/ToDoTask';
import SalaryPaySlip from '../screens/SalaryPaySlip';
import OTP from '../screens/OTPScreen';
import OTPScreen from '../screens/OTPScreen';
import NotificationDetails from '../components/NotificationDetails';
import HrmsComplain from '../screens/Login/HrmsComplain';
import EmployeeSurvey from '../screens/BottomTabs/EmloyeeSurvey/EmployeeSurvey';
import EmployeeSurveyForm from '../screens/BottomTabs/EmloyeeSurvey/EmployeeSurveyForm';
import LoanStatusReport from '../screens/LoanStatusReportTab/LoanStatusReport';
import LoanStatusDetails from '../screens/LoanStatusReportTab/LoanStatusDetails';
import Faqs from '../screens/Faqs';
import {useSelector} from 'react-redux';

const {interpolate, Extrapolate} = Animated;
// screens

const Stack = createStackNavigator();
const Screens = ({navigation, style}) => {
  const getUserData = useSelector(state => state.UserData);
  const OrganizationType = Number(getUserData?.UserData?.OrganizationType);
  const loanLabel = OrganizationType === 2 ? 'Finance Facility' : 'Loan';
  return (
    <Animated.View style={StyleSheet.flatten([styles.stack, style])}>
      <Stack.Navigator
        screenOptions={{
          headerTransparent: true,
          headerTitle: '',
          headerLeft: () => (
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              {/* <Pressable  onPressIn={() => navigation.openDrawer()}>
                <Feather name="menu" size={28} color={Colors.parrotGreenColor} style={{ paddingHorizontal: 30 }} />
              </Pressable> */}
              {/* <Text>Dashboard</Text> */}
            </View>
          ),
        }}>
        {/* {/* <Stack.Screen name="Dashboard">{props => <Dashboard {...props} />}</Stack.Screen> */}
        <Stack.Screen name="Tabs">{props => <Tabs {...props} />}</Stack.Screen>
        <Stack.Screen name="ClientCertSurvey" component={ClientCertSurvey} />
        <Stack.Screen name="ClientSurveyForm" component={ClientSurveyForm} />
      
        <Stack.Screen name="Cib" component={Cib} />
        <Stack.Screen name="Cir" component={Cir} />
        <Stack.Screen name="EmployeeSurvey" component={EmployeeSurvey} />
        <Stack.Screen name="EmployeeSurveyForm" component={EmployeeSurveyForm} />
        <Stack.Screen
          name="LoanVerify"
          component={LoanVerify}
          options={{title: `${loanLabel} Verification`}}
        />
         <Stack.Screen name="LoanStatusReport" component={LoanStatusReport} />
         <Stack.Screen name="LoanStatusDetails" component={LoanStatusDetails} />
        <Stack.Screen name="DueDetalReport" component={DueDetalReport} />
        <Stack.Screen
          name="DailyCollectionReport"
          component={DailyCollectionReport}
        />
        <Stack.Screen name="Repayment" component={Repayment} />
        <Stack.Screen name="LoanVerification" component={LoanVerification} />
        <Stack.Screen name="ModalDropDown" component={ModalDropDown} />
        <Stack.Screen name="GeneratedReport" component={GeneratedReport} />
        <Stack.Screen
          name="GeneratedDailyReport"
          component={GeneratedDailyReport}
        />
        <Stack.Screen name="Dashbordreport" component={Dashbordreport} />
        <Stack.Screen name="BmData" component={BmData} />
        <Stack.Screen name="RegionalZonalData" component={RegionalZonalData} />
        <Stack.Screen
          name="LoanVerificationReport"
          component={LoanVerificationReport}
        />
        <Stack.Screen
          name="CreditScoringReport"
          component={CreditScoringReport}
        />

        <Stack.Screen
          name="SafcoCustomerDetail"
          component={SafcoCustomerDetail}
        />
        <Stack.Screen name="CIBView" component={CIBView} />
        <Stack.Screen name="PermissionScreen" component={PermissionScreen} />
        <Stack.Screen name="UserDetailForZM" component={UserDetailForZM} />
        <Stack.Screen name="LoanCalculator" component={LoanCalculator} />
        {/* <Stack.Screen name="CIBReport" component={CIBReport}/> */}
        <Stack.Screen name="ClientConsent" component={ClientConsent} />
        <Stack.Screen name="Complain" component={Complain} />
        <Stack.Screen name="HrmsComplain" component={HrmsComplain} />
        <Stack.Screen name="ToDoTask" component={ToDoTask} />
        <Stack.Screen name="SalaryPaySlip" component={SalaryPaySlip} />
        <Stack.Screen name="faqs" component={Faqs} />
        {/* <Stack.Screen name="OTP" component={OTPScreen} /> */}
      </Stack.Navigator>
    </Animated.View>
  );
};

export default memo(Screens);
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
  drawerStyles: {flex: 1, width: '50%', backgroundColor: 'transparent'},
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
  circle: {borderRadius: 100, height: 40, width: 40, justifyContent: 'center'},
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
});
