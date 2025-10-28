/**
 * @author [Mr.Ali Raza khan]
 * @email [ali67744@gmail.com]
 * @create date 2021-06-15 9:50 AM
 */

import 'react-native-gesture-handler';
import type {Node} from 'react';

import * as React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {
  createStackNavigator,
  TransitionSpecs,
  TransitionPresets,
} from '@react-navigation/stack';
import {Splash, Login} from '../screens';
import Drawer from './Drawer';
import Comments from '../screens/Formpages/Comments';
import {AddForm, AddGroup} from '../screens/BottomTabs';
import firebase from '@react-native-firebase/app';
import {FIREBASE_CONFIG} from '../configs/firebaseConfig';
import HalafNama from '../screens/BottomTabs/HalafNama';
import PermissionScreen from '../screens/PermissionScreen';
import CIBReport from '../screens/CIBReport';
import {ComplainAdd} from '../components';
import OTPScreen from '../screens/OTPScreen';
const Stack = createStackNavigator();
//  if (!firebase.apps.length) {
//   firebase.initializeApp(FIREBASE_CONFIG);
// }
const RootNavigator: () => Node = () => {
  return (
    <Stack.Navigator initialRouteName={'Splash'}>
      <Stack.Screen name="Splash" component={Splash} options={options} />
      <Stack.Screen name="Login" component={Login} options={options} />
      <Stack.Screen name="Drawer" component={Drawer} options={options} />
      <Stack.Screen name="AddForm" component={AddForm} options={options} />
      <Stack.Screen name="AddGroup" component={AddGroup} options={options} />
      <Stack.Screen name="HalafNama" component={HalafNama} options={options} />
      <Stack.Screen name="Comments" component={Comments} options={options} />
      <Stack.Screen name="CIBReport" component={CIBReport} options={options} />
      <Stack.Screen
        name="PermissionScreen"
        component={PermissionScreen}
        options={options}
      />
      <Stack.Screen
        name="ComplainAdd"
        component={ComplainAdd}
        options={options}
      />
      {/* <Stack.Screen name="OTPScreen" component={OTPScreen} options={options}/> */}
    </Stack.Navigator>
  );
};

const options = () => ({
  headerShown: false,
  //  ...TransitionPresets.SlideFromRightIOS,
  //  transitionSpec: {
  //    open: TransitionSpecs.TransitionIOSSpec,
  //    close: TransitionSpecs.TransitionIOSSpec,
  //  },
});

export default RootNavigator;
