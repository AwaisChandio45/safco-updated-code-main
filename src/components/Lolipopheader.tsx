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
const {height, width} = Dimensions.get('window');

const Lolipopheader=({name,linestyle,onPress,check})=>{

return (
    <Pressable onPressIn={onPress}>
  
  <View style={{flexDirection:'row'}}>
      <View style={[styles.line,linestyle]}>
        <TextView></TextView>
      </View>
      <View style={{alignItems:'center',marginTop:-12,marginLeft:0}}>
      <View style={[styles.circle]}>
          {check ?
      <Feather name={"check-circle"} style={{alignSelf:'center'}} color="green" size={12} />
      :
      <FontAwesome name={"circle-thin"} style={{alignSelf:'center'}} color="green" size={12} />

          }
        
      </View>
      <TextView type={'small'} text={name}></TextView>
      </View>
      </View>
     
</Pressable>
)
}
const styles = StyleSheet.create({
    circle:{height:30,width:30,borderRadius:100,justifyContent:'center',
      backgroundColor:'#f1f1f1'},
      line:{height:5,width:width/8,borderRadius:10}

})
export default memo(Lolipopheader);