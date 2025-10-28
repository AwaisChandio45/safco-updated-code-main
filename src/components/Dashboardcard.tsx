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
  import {Card} from 'react-native-paper'
import { connect,useSelector } from 'react-redux';
import { TextView } from ".";
import LottieView from 'lottie-react-native';
import Feather from "react-native-vector-icons/Feather";
import FontAwesome from "react-native-vector-icons/FontAwesome"
import Octicons from 'react-native-vector-icons/Octicons';
import Ionicons from 'react-native-vector-icons/Ionicons';
const {height, width} = Dimensions.get('window');
import AnimateNumber from 'react-native-animate-number'
import { FONTS } from "../theme/Fonts";
import { Colors } from "../theme";
const Dashboardcard=({name,amount,shade1,shade2,icon,onPress})=>{
 

return (
    <Pressable onPressIn={onPress}>
         <LinearGradient
   colors={[shade1,shade2]}
   start={{ x: 1, y: 0 }}
   end={{ x: 1, y: 1 }}
   style={styles.linear}
  
  >
      
  <View style={styles.carditemTop}>
  <Octicons 
         style={{alignSelf:'center'}}
         name={icon} color={Colors.darkGreenColor} size={26} />
  
  </View>
  
<View style={styles.text}>
          <TextView type={'light'} style={{color:'#FFF',fontSize:width/36}} text={name}></TextView>
          {/* <AnimateNumber style={{color:'#FFF',
         fontSize: width / 20,
         fontFamily: FONTS.FONT_BOLD,
        }}
        countBy={amount/8}
        interval={14}
        timing="linear"
        value={amount}
        formatter={(val) => {
          return parseFloat(val).toFixed(2)
        }}/> */}
      <TextView  style={{color:'#FFF',fontFamily:FONTS.FONT_BOLD,fontSize:width/20}} text={amount}></TextView>
          

      </View>

  </LinearGradient>
  
 

</Pressable>
)
}
const styles = StyleSheet.create({
    card: {
        marginLeft:10,marginRight:10,height:height/5,borderRadius:5,
        elevation:10,padding:10,
        width:width/2.5,
        flex:1
      },
      linear:{
      marginLeft:10,marginRight:10,height:height/5,borderRadius:5,
      elevation:10,padding:10,
      width:width/2.5,
      flex:1
    },
      text:{position:'absolute',bottom:1,marginLeft:20,marginBottom:10,color:'#FFF'},
      carditemTop:
      {borderRadius:100,height:40,width:40,
        alignSelf:'flex-end',
        backgroundColor:'#FFF',margin:5,justifyContent:'center'}
    ,
})
export default memo(Dashboardcard);