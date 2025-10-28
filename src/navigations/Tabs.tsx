import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Fontisto from 'react-native-vector-icons/Fontisto';
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {Card} from 'react-native-paper';
import {
  Dashboard,
  Customer,
  Groups,
  SafcoCustomer,
  AddForm,
  LoanOfficerSyncup,
  BMSyncupandSyncdown,
  LoanOfficerGroups,
  BMGroups,
  LoanVerficationGroup,
  LoanVerficationSyncupandSyncdown,
} from '../screens/BottomTabs';
import {Dimensions, View} from 'react-native';
import {FONTS} from '../theme/Fonts';
const {height, width} = Dimensions.get('window');
import BottomAnim from '../components/BottomAnim';
import {Colors} from '../theme';
import Nullable from '../screens/BottomTabs/Nullable';
import {connect, useSelector} from 'react-redux';

const Tab = createBottomTabNavigator();

const Tabs = () => {
  const customTabBarStyle = {
    keyboardHidesTabBar: true,
    activeTintColor: Colors.primary,
    inactiveTintColor: '#cdcdcd',
    allowFontScaling: true,
    labelStyle: {paddingTop: 2, paddingBottom: 2},
    showLabel: true,
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
    style: {
      borderTopLeftRadius: 21,
      borderTopRightRadius: 21,
      backgroundColor: '#fff',
      position: 'absolute',
      bottom: 0,
      padding: 10,
      height: 64,
      zIndex: 8,
      shadowOpacity: 10,
      shadowRadius: 10,
      elevation: 15,
      shadowOffset: {
        height: 6,
        width: 1,
      },
    },
  };

  const getUserData = useSelector(state => state.UserData);

  return (
    <Tab.Navigator
      initialRouteName="Dashboard"
      tabBarOptions={customTabBarStyle}>
      <Tab.Screen
        name="Dashboard"
        component={Dashboard}
        options={{
          tabBarLabel: 'Dashboard',
          tabBarIcon: ({color}) => (
            <MaterialCommunityIcons
              name="monitor-dashboard"
              color={color}
              size={26}
            />
          ),
        }}
      />
      <Tab.Screen
        name="Customer"
        component={
          getUserData.UserData.EmployeeTypeName == 'Branch Manager'
            ? LoanVerficationSyncupandSyncdown
            : getUserData.UserData.EmployeeTypeName == 'Verification Officer'
            ? LoanVerficationSyncupandSyncdown
            : LoanOfficerSyncup
        }
        options={{
          tabBarLabel: 'Customer',
          tabBarIcon: ({color}) => (
            <Fontisto name="person" color={color} size={26} />
          ),
        }}
      />
      <Tab.Screen
        name="Nullable"
        component={Nullable}
        options={{
          tabBarLabel: '',
          tabBarIcon: ({color}) => (
            <BottomAnim color={Colors.primary} />
            // <Card style={{height:height/12,width:height/12,borderRadius:200,
            // elevation:20,marginBottom:25}}>
            //   <View style={{alignSelf:'center',justifyContent:'center',flex:1}}>
            //   <MaterialIcons name="add" color={color} size={46} />
            //   </View>
            // </Card>
          ),
        }}
      />
      <Tab.Screen
        name="Groups"
        component={
          getUserData.UserData.EmployeeTypeName == 'Branch Manager'
            ? LoanVerficationGroup
            : getUserData.UserData.EmployeeTypeName == 'Verification Officer'
            ? LoanVerficationGroup
            : LoanOfficerGroups
        }
        options={{
          tabBarLabel: 'Groups',
          tabBarIcon: ({color}) => (
            <Fontisto name="persons" color={color} size={26} />
          ),
        }}
      />
      <Tab.Screen
        name="Safco Customer"
        component={SafcoCustomer}
        options={{
          tabBarLabel: 'Safco E-Credit Customers',
          tabBarIcon: ({color}) => (
            <SimpleLineIcons name="people" color={color} size={26} />
          ),
        }}
      />
    </Tab.Navigator>
  );
};
export default Tabs;
