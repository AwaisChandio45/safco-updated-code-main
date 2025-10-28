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
import { connect,useSelector } from 'react-redux';
import { TextView } from ".";
import LottieView from 'lottie-react-native';
const {height, width} = Dimensions.get('window');

const Loader=({style,text,onPress})=>{

return (
    <View style={styles.main}>
    <LottieView
    source={require('../assests/anim/loadergreen.json')}
    // colorFilters={[{
    //   keypath: "button",
    //   color: "#F00000"
    // },{
    //   keypath: "Sending Loader",
    //   color: "#F00000"
    // }]}
    autoPlay
    loop
  />
  </View>
)
}
const styles = StyleSheet.create({
    main: {
        alignSelf: "center",
        margin:20,
        height:height/5,width:width/5
        
       
      },
})
export default memo(Loader);