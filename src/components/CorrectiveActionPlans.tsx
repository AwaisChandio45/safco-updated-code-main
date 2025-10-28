import React,{memo} from 'react';
import { TextInput, View ,Pressable,StyleSheet} from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import EvilIcons from 'react-native-vector-icons/EvilIcons';
import {TextView} from '../components'
import { connect,useSelector } from 'react-redux';

import { RadioButton } from 'react-native-paper';
import {useNavigation} from '@react-navigation/native';
import { Card } from 'react-native-paper';

const CorrectiveActionPlans = ({text,onChangeText,onChangeTexttwo,value,valuetwo}) => {

 return(
  
    <View style={[styles.row3,{marginTop:10}]}>
   <TextInput 
   onChangeText={onChangeText}
   style={styles.inputContainer}
   placeholder={text}
   value={value}
   placeholderTextColor={"#cdcdcd"}
   ></TextInput>
   <TextInput 
   value={valuetwo}
   onChangeText={onChangeTexttwo}
   style={styles.inputContainer2}></TextInput>

    </View>

 )
    
};
const styles = StyleSheet.create({
    row3: {
        marginTop: 0,
        flexDirection: 'row',
        justifyContent: 'space-between',
      },
      inputContainer: {
        height: 40,flex:1,
        backgroundColor: '#EBEBEB',
        justifyContent: 'center',
        borderRadius: 20,
        paddingLeft: 20,
        marginTop:10,
      },
      inputContainer2: {
        height: 40,flex:0.7,
        backgroundColor: '#EBEBEB',
        justifyContent: 'center',
        borderRadius: 20,
        paddingLeft: 20,
        marginLeft:20,
        marginTop:10,
      },
})
export default memo(CorrectiveActionPlans);