import React, {memo} from 'react';
import LinearGradient from 'react-native-linear-gradient';
import {  View,  Text, Dimensions,Platform,StyleSheet,Alert, Pressable,} from 'react-native';
import {TouchableOpacity,TouchableWithoutFeedback} from 'react-native-gesture-handler';
import {connect, useSelector} from 'react-redux';
import {TextView} from '.';
import {Colors, GlobalStyles} from '../theme';
const {height, width} = Dimensions.get('window');
import Ionicons from 'react-native-vector-icons/Ionicons';
const BottomButton = ({style, show=1, onPressNext, onPressPrev}) => {

  return (
    <View
      style={[
        GlobalStyles.row,
        {marginTop: 20, marginBottom: 80, justifyContent: 'space-between'},
      ]}>
      {show!=1 ?
    <TouchableWithoutFeedback
    onPress={onPressPrev}>
      
      <View style={GlobalStyles.row}>
        <Ionicons name="ios-caret-back" style={{color: Colors.parrotGreenColor}}  size={26}></Ionicons> 
        <TextView
          style={{marginTop: 2, color: Colors.parrotGreenColor}}
          type="heading_20"
          text="Previous"></TextView>
      </View>
    </TouchableWithoutFeedback>
    :
    <View></View>  
    }
    <TouchableWithoutFeedback
    onPress={onPressNext}>
      <View style={GlobalStyles.row}>
        <TextView
          style={{marginTop: 2, color: Colors.parrotGreenColor}}
          type="heading_20"
          text={show==3?"Done":show==4?'Update':"Next"}></TextView>
        <Ionicons name="ios-caret-forward" style={{color: Colors.parrotGreenColor}} size={26}></Ionicons>  
      </View>
      </TouchableWithoutFeedback>
    </View>
  );
};
const styles = StyleSheet.create({
  textSign: { fontSize: 18,  fontWeight: 'bold', }, 
});
export default memo(BottomButton);
