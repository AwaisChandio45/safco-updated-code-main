import React, { useState, useEffect, memo,useRef } from "react";
import { StyleSheet, Platform, View,Dimensions, ScrollView,SafeAreaView,TextInput,Pressable } from "react-native";
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
const { FingerModule } = NativeModules;
import { NativeModules } from 'react-native';
import { CustomButton, TextView } from ".";
import { Colors } from "../theme";
import DetailReportPicker from "./DetailReportPicker";
import ModalDropdown from 'react-native-modal-dropdown';
import { FONTS } from "../theme/Fonts";
var {height, width} = Dimensions.get('window');
import Toast from './Toast';
import AsyncStorage from "@react-native-async-storage/async-storage";
import DateTimePicker from '@react-native-community/datetimepicker';
import moment from 'moment';

const RepaymentLogsScreen = ({ 
    _onSeacrch,
    _onSubmit, 
    cincNumber, 
    setCnicNumber,
    fingerPrint=undefined,
    setFingerImage,
    textField,
    setTextField,
    toast,
    setToast
     
}) => {
    const [date, setDate] = useState(new Date());
    const [mode, setMode] = useState('date');
    const [show, setShow] = useState(false);
  
    const onChange = (event, selectedDate) => {
      const currentDate = selectedDate || date;
      setShow(Platform.OS === 'ios');
      setDate(currentDate);
      setCnicNumber(moment(currentDate).format('L'));
      console.log(currentDate);
    };
  
    const showMode = (currentMode) => {
      setShow(true);
      setMode(currentMode);
    };
  
    const showDatepicker = () => {
      showMode('date');
    };
  
   
   
  /////////////////////////////Setting TextInput State////
  const [activityArray, setActivityArray]  = useState(['Cnic', 'Loan Id',"Date"])
  const modalDropdown=useRef();
  const input=useRef();
  return (
      
    <SafeAreaView style={[styles.mainContainer,{marginTop:20, marginBottom:20}]}>
          
            <View style={styles.Container}>
                <View style={styles.logoContainer}>
                    <View style={styles.logoContainerSecondLayer}>
                        <MaterialCommunityIcons
                        name="card-account-details-star-outline"
                        color='#fff'
                        size={50}/>
                    </View>
                </View>
                <ScrollView showsVerticalScrollIndicator={false}>
                <View style={{marginTop:20}}>
                    <View style={{flexDirection:'row',alignItems:'center' }}>
                        <View style={styles.inputContainer}>
                        <View style={{
                            width:'30%', 
                            borderBottomWidth:1, 
                            borderBottomColor:'#cdcdcd',
                             }}>
                            {/* <DetailReportPicker onValueChange={()=>{}} value={"DropDown"} data={['Loan Id', 'CNIC', ]} /> */}
                            <View style={{flexDirection:"row", 
                             justifyContent:'space-between', width:'100%'}}>
                            <ModalDropdown
                            ref={modalDropdown}
                                defaultValue={'CNIC'}
                                defaultIndex={-1}
                                textStyle={{color:'#727272',fontFamily:FONTS.FONT_REGULAR,fontSize:14}}
                                defaultTextStyle={{color:'#727272',fontFamily:FONTS.FONT_REGULAR,fontSize:12}}
                                showsVerticalScrollIndicator={false}
                                dropdownTextStyle={{backgroundColor:'#fafafa',
                                
                                fontSize:12,fontFamily:FONTS.FONT_REGULAR}}
                                onSelect={(index)=>{
                                    setCnicNumber("")
                                    setTextField(index)}}
                                dropdownStyle={{  
                                    marginTop:-30,
                                    width: width / 2.4,
                                   backgroundColor:'#fafafa',
                                    marginLeft:-15,}}/*{marginRight:RT==1?-30:0,marginLeft:RT==2?-20:0}]*/
                                style={{paddingLeft:10,paddingBottom:10}}
                                options={activityArray}
            
                            />
                            <Pressable onPress={()=>{
                                modalDropdown.current.show()
                            }}>
                            <MaterialCommunityIcons name="menu-down"  
         color={'#000'} size={26}></MaterialCommunityIcons>
         </Pressable>
                            </View>
                        </View>
                        <View style={{width:'70%',marginTop:-16}}>
                        {/* ------- */}

                        
                        {
                            textField == 0?(
                                <TextInput 
                                ref={input}
                                style={styles.inputText} 
                                placeholder="CNIC Number"
                                keyboardType={'decimal-pad'}
                                value={cincNumber}
                                onChangeText={value=>{
                                    if (value.length < 16) {
                                        if (value.length == 5 || value.length == 13) {
                                        var make= value + '-';
                                        setCnicNumber(make)
                                        
                                        } else {
                                        setCnicNumber(value)
                                        }
                                    }
                                }} 
                                />    
                            )
                            :textField == 1?
                            (
                                <TextInput 
                                style={styles.inputText} 
                                placeholder="Loan Id"
                                keyboardType={'numeric'}
                                value={cincNumber}
                                onChangeText={value=>{
                                    setCnicNumber(value)
                                }} 
                                />
                            )
                            :(
                                <Pressable
                                onPress={(value)=>{
                                    showDatepicker()
                                }} 
                                >
                                <TextInput 
                                style={styles.inputText} 
                                placeholder="Select Date"
                                editable={false}
                                keyboardType={'numeric'}
                                value={cincNumber}
                                
                                />
                                </Pressable>
                            )
                        }

                        {/* ------- */}
                        </View>
                        </View>
                    </View>
                    <View style={styles.BtnCont}>
                        <CustomButton 
                        text={"Search"} 
                        onPress={_onSeacrch}
                        style={{padding:10, borderRadius:20, alignItems:'center', width:"90%"}} 
                        textStyle={{fontSize:17}} />
                       

                        
                       
                        
                    </View>
                </View>
                </ScrollView>
<Toast  {...toast} onDismiss={() => setToast({ message: "", type: "" })} />
{show && (
        <DateTimePicker
          testID="dateTimePicker"
          value={date}
          mode={mode}
          is24Hour={true}
          display="default"
          onChange={onChange}
        />
      )}
            </View>

    </SafeAreaView>
  
 );
};



export default memo(RepaymentLogsScreen);

const styles = StyleSheet.create({
    mainContainer:{
       padding:20,
      flex:1, 
      flexDirection:'column', 
    },
   Container:{
       //width:width/1,
       //margin:20,
       backgroundColor:"#fff", 
       borderRadius:15,
       elevation:10
   },
   inputContainer:{
       flex:1,
       flexDirection:'row',
       alignItems:'center',
       padding:20
   },
   logoContainer:{
       alignItems:'center'
   },
   logoContainerSecondLayer:{
       backgroundColor:Colors.parrotGreenColor, 
       elevation:10, 
       width:80, 
       height:80, 
       flexDirection:'column', 
       justifyContent:'center', 
       alignItems:'center',
       borderRadius:50, 
       marginTop:-40
   },
   inputText:{
       fontFamily: 'PoppinsRegular',
       backgroundColor:'#fff', 
       width:'100%',
       marginLeft:15,
       paddingLeft:10,
       alignSelf:'center',
       borderBottomWidth:1,
       borderColor:'#c4c4c2',
       color: '#1d1d1d',
       fontSize: 14,
   },
   BtnCont:{
       padding:10,
       alignItems:'center'
   },
   pressSubmit:{ 
       margin:10, 
       backgroundColor:Colors.kulfa, 
       borderRadius:10, 
       elevation:5
   },
   pressVerify:{ 
       margin:10, 
       backgroundColor:Colors.kulfa, 
       borderRadius:10, 
       elevation:5
   },
   bottomBtn:{
       width:'30%', 
       backgroundColor:Colors.parrotGreenColor, 
       borderRadius:10, 
       elevation:10,
   },
   bottomnewBtn:{
       height:30,width:100,borderRadius:20,justifyContent:'center',
       backgroundColor:'#FFF',elevation:10,
   }

})