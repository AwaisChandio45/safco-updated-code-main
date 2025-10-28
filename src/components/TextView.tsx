import React,{memo} from "react";
import LinearGradient from 'react-native-linear-gradient';
import {
    View,
    Text,
    Pressable,
    TextInput,
    Dimensions,
    StyleSheet,
    Alert,
  } from "react-native";
const {height, width} = Dimensions.get('window');
import { connect,useSelector } from 'react-redux';
import {FONTS} from '../theme/Fonts'
import Fontisto from 'react-native-vector-icons/Fontisto';
const TextView=({style,text,type,Icon})=>{
  let styleByType = getStyleByType(type);

return (

      <Text
      adjustsFontSizeToFit
      style={[styleByType,style]}
      >
    {text}
    {Icon}
      </Text>

)
}
let getStyleByType = type => {
    switch (type) {
      case 'heading':
        return styles.heading;
  
      case 'mini_heading22':
        return styles.mini_heading;
  
      case 'description13':
        return styles.description;
  
      case 'mini_description':
        return styles.mini_description;
  
      case 'normalRg':
        return styles.normalRg;
  
      case 'normalRg':
        return styles.normalRg;
  
      case 'headingMid':
        return styles.headingMid;
      case 'heading_20':
        return styles.heading_20;
      case 'small':
        return styles.small;
      case 'normalMini':
        return styles.normalMini;
      case 'bottomtext':
        return styles.bottomtext;
      case 'Login':
        return styles.Login;
        case 'Light':
          return styles.extraLight;
          case 'formLabel':
          return styles.formLabel;
  
      default:
        return styles.normal;
    }
  };
const styles = StyleSheet.create({
    textSign: {
        fontSize: 18,
        fontWeight: "bold",
      },
      heading: {
        // fontSize: 26,
        fontSize: width / 20,
        fontFamily: FONTS.FONT_BOLD,
      },
      headingMid: {
        // fontSize: 18,
        fontSize: width / 22,
        fontFamily: FONTS.FONT_SEMI_BOLD,
        // fontFamily: 'PoppinsLight',
      },
      mini_heading: {
        // fontSize: 22, fontFamily: 'PoppinsLight', textAlign: 'center'
        fontSize: width / 18.5,
        fontFamily:FONTS.FONT_BOLD,
        // fontFamily: 'PoppinsBold',
        textAlign: 'center',
      },
      heading_20: {
        fontSize: width / 25,
        fontFamily: FONTS.FONT_SEMI_BOLD,
        textAlign: 'center',
      },
      description: {
        // fontSize: 13, fontFamily: 'PoppinsRegular', textAlign: 'center', color: "#666666"
        fontSize: width / 30,
        fontFamily: FONTS.FONT_REGULAR,
        textAlign: 'center',
        color: '#9B9B9B',
      },
      mini_description: {
        // fontSize: 12, fontFamily: 'PoppinsRegular', color: "#9F9F9F"
        fontSize: width / 30,
        // fontFamily: 'PoppinsRegular',
        color: '#9F9F9F',
      },
      normalRg: {
        fontSize: width / 33,
        fontFamily: FONTS.FONT_REGULAR,
        // fontFamily: "PoppinsRegular"
      },
    
      normalMd: {
        // fontSize: 14,
        fontSize: width / 30,
        // fontFamily: "PoppinsMedium"
      },
    
      normalMini: {
        fontSize: 14, 
        fontFamily:FONTS.FONT_REGULAR
      },
    
      normal: {
        // fontSize: 16, fontFamily: 'PoppinsRegular',
        fontSize: width / 25,
        fontFamily:FONTS.FONT_REGULAR
      },
    
      small: {
        fontSize: width / 28,
        fontFamily: FONTS.FONT_LIGHT,
      },
    
      extraLight: {
        fontFamily: FONTS.FONT_LIGHT,
        fontSize: 14, // fontFamily: 'extraLight'
      },
      formLabel: {
        fontFamily: FONTS.FONT_REGULAR,
        fontSize: 12, // fontFamily: 'extraLight'
      },
      bottomtext: {
        fontSize: 13,
      },
      Login: {
        fontFamily:FONTS.FONT_MEDIUM,
        fontSize: 25,
      },

})
export default memo(TextView);