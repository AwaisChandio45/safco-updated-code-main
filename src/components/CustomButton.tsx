import React,{memo} from "react";
import LinearGradient from 'react-native-linear-gradient';
import { View,Text,Pressable,Dimensions,Platform,StyleSheet,Alert, } from "react-native";
import { connect,useSelector } from 'react-redux';
import { TextView } from ".";
import { Colors } from "../theme";
const {height, width} = Dimensions.get('window');

const CustomButton=({style,text,onPress,textStyle})=>{

return (
    <Pressable
    style={style}
    onPress={onPress}
    >
    <LinearGradient
      colors={[Colors.darkGreenColor,Colors.primary]}
      start={{ x: 1, y: 1 }}
      end={{ x: 1, y: 0 }}
      style={style}
     >
      <TextView
      text={text}
      type={'Login'}
        style={[{color: "#fff"},textStyle]}
      >

      </TextView>
      </LinearGradient>
  </Pressable>

)
}
const styles = StyleSheet.create({
    textSign: {
        fontSize: 18,
        fontWeight: "bold",
      },
})
export default memo(CustomButton);