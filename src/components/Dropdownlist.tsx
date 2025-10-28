import React,{ memo } from "react"
import {StyleSheet,Dimensions,View,Image,Text} from "react-native"
import ModalDropdown from 'react-native-modal-dropdown';
import { Colors, Icons } from "../theme";
import { FONTS } from "../theme/Fonts";
var {height, width} = Dimensions.get('window');
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import TextView from "./TextView";

const Dropdownlist =({data,label,onSelect,RT=1,required=false,text="",ref})=>{
 return <View> 
         
         <TextView type={'formLabel'} text={text.length>20?text.substring(0,20)+"...":text} 
      style={{color:'#737373',marginLeft:10}}></TextView>
   <View style={styles.textInput}>
   {required && <View style={{position:'absolute',right:1,top:-5}}>
        <Text style={{color:'#FF0000'}}>*</Text>
      </View>}
    <ModalDropdown
    ref={ref}
    defaultValue={label}
    defaultIndex={-1}
    textStyle={{color:'#727272',fontFamily:FONTS.FONT_REGULAR,fontSize:12}}
    defaultTextStyle={{color:'#727272',fontFamily:FONTS.FONT_REGULAR,fontSize:12}}
    showsVerticalScrollIndicator={false}
    dropdownTextStyle={{fontSize:12,fontFamily:FONTS.FONT_REGULAR}}
    dropdownStyle={[styles.dropdown,{marginRight:RT==1?-30:0,marginLeft:RT==2?-20:0}]}
    style={styles.dropdownstyles}
    onSelect={onSelect}
    options={data}/>
   
         <MaterialCommunityIcons name="menu-down"  
         color={'#000'} size={26}></MaterialCommunityIcons>
        

 </View>
</View>
}
export default memo(Dropdownlist)
const styles = StyleSheet.create({
  textInput:{backgroundColor:'#f1f1f1',height:55,paddingLeft:0,marginTop:5,marginBottom:33,
    borderBottomColor:'#cdcdcd',borderBottomWidth:1,flexDirection:'row',alignItems:'center',
    width:width/2.5,borderRadius:3},
    
    dropdown:
      {height:100,  width: width / 2.5,marginTop:-20},
      dropdownstyles:{marginLeft:20,flex:1},
      img:{ width: width / 20, height: width / 20, resizeMode: "contain" },
    
})