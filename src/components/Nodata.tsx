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

const Nodata=({style,text,onPress})=>{

return (
<View style={{marginTop:100}}>
<LottieView
   
   // source={{uri:'https://assets9.lottiefiles.com/temp/lf20_ybprWS.json'}}
   source={require('../assests/anim/spaceship.json')}
   // colorFilters={[{
   //   keypath: "button",
   //   color: "#F00000"
   // },{
   //   keypath: "Sending Loader",
   //   color: "#F00000"
   // }]}
   style={{alignSelf: 'center',height:100,width:100}}
   autoPlay
   loop
 />
 <TextView style={{textAlign: 'center',margin:20,color:'#787878'}} type={'small'} text={"No Record founded!"}></TextView>

</View>
    )
}
const styles = StyleSheet.create({
    main: {
        justifyContent: 'center',flex:1,
        alignSelf: "center",
        // margin:20,
        height:300
        
       
      },
})
export default memo(Nodata);