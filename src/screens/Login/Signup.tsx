

import React from 'react';
import type {Node} from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
} from 'react-native';



const Signup: () => Node = () => {
  return (
   <SafeAreaView style={styles.safeview}>

   </SafeAreaView>
  );
}
const styles=StyleSheet.create({
    safeview: {
        justifyContent:'center',flex:1
    }
})
export default Signup;
