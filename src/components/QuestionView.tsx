import React, {memo} from 'react';
import {
  View,
  Text,
  TextInput,
  Dimensions,
  StyleSheet,
  Alert,
} from 'react-native';
import {connect, useSelector} from 'react-redux';
import {TextView} from '.';
import {FONTS} from '../theme/Fonts';
import LottieView from 'lottie-react-native';
import Dropdownlist from './Dropdownlist';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
const {height, width} = Dimensions.get('window');
import ModalDropdown from 'react-native-modal-dropdown';
import { questionsno1 } from '../utilis/RequiredArrays';
import { Colors } from '../theme';
const QuestionView = ({
  text,
label,
questions,
onSelect
  
}) => {
  let numOfLinesCompany = 0;
  return (
    <View style={{marginBottom:0}}>
      <View style={styles.row}>
      <TextView type={'formLabel'} text={text} 
      style={{color:Colors.darkGreenColor,marginLeft:10}}></TextView>
      </View>
      <View style={styles.row}>
          <TextView style={styles.ans} type={"formLabel"} text="Ans"></TextView>
          <ModalDropdown 
          defaultValue={label}
        //   onSelect={onSelect}
        //   dropdownStyle={styles.dropdownStyles}
        //   textStyle={styles.textStyle}
        //   defaultTextStyle={styles.defaultTextStyle}
          showsVerticalScrollIndicator={false}
        //   dropdownTextStyle={styles.dropdownTextStyle}
          style={styles.styless}
        //   options={questions}
          />
           {/* <MaterialCommunityIcons name="menu-down"  
         color={'#000'} size={26}></MaterialCommunityIcons> */}
          </View>
  
    </View>
  );
};
const styles = StyleSheet.create({
  ans:{marginLeft:20,marginTop:10,color:'#787878'},
  row:{flexDirection: 'row',alignItems: 'center'},
  textStyle:{color:'#727272',fontFamily:FONTS.FONT_REGULAR,fontSize:12},
  defaultTextStyle:{color:'#727272',fontFamily:FONTS.FONT_REGULAR,fontSize:12},
  dropdownTextStyle:{fontSize:12,fontFamily:FONTS.FONT_REGULAR},
  styless:{width:width/1.5,marginLeft:20,marginTop:10},
  dropdownStyles:{width:width/1.5,marginTop:-50}
});
export default memo(QuestionView);
