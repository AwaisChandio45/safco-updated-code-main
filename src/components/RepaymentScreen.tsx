import React, { useState, useEffect, memo,useRef } from "react";
import { StyleSheet, Image, View,Dimensions, ScrollView,SafeAreaView,TextInput,Pressable } from "react-native";
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
const { FingerModule } = NativeModules;
import { NativeModules } from 'react-native';
import { CustomButton, TextView } from ".";
import { Colors } from "../theme";
import DetailReportPicker from "./DetailReportPicker";
import ModalDropdown from 'react-native-modal-dropdown';
import { FONTS } from "../theme/Fonts";
var {height, width} = Dimensions.get('window');
import Toast from '../components/Toast';
import AsyncStorage from "@react-native-async-storage/async-storage";

const RepaymentScreen = ({ 
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
    console.log("lol=>"+setCnicNumber)
   
    // **********************************************************************
////////// FNINGER PRINT WORK
// **********************************************************************
const _fingerPrint = async () => {
    try {
      const eventId = await FingerModule.showToast();
      var parser = JSON.parse(eventId);
      //console.log("==================>");
      //console.log("----->",parser.imageTemp);
      //console.log("==================>");
    //   AsyncStorage.setItem('@userFinger', JSON.stringify(parser));

      // var data = await RNFS.readFile(eventId, 'base64')
      // var temp=`data:image/gif;base64,${encodedBase64}`
      //-----------
      setFingerImage(parser);
    //   let get = allDataobj;
    //   get.fingerPrint= parser;
    //   setAlldataobj({ ...get });
    //---------------
      // setTemp(parser.imageTemp)
    } catch (e) {
      console.error(e);
    }
  };
  const _resetDevices = async () => {
    await FingerModule.resetDevice();
  };
// -------------------------------------------------------------------------

  /////////////////////////////Setting TextInput State////
  const [activityArray, setActivityArray]  = useState(['CNIC', 'Loan Id'])
  const modalDropdown=useRef();
  const input=useRef();
  return (
      
    <SafeAreaView style={[styles.mainContainer,{marginTop:50, marginBottom:20}]}>
          
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
                            :
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
                        <View>
                            <TextView
                            style={{color:'#cdcdcd',fontSize:width/42,}}
                            text={"---------------------- OR --------------------- "}
                            ></TextView>
                        </View>
                        <View style={{marginTop:20}}>
                            <TextView
                            style={{color:'#cdcdcd'}}
                            text={"Search by fingerprint"}
                            ></TextView>
                            
                            {fingerPrint ==
                        undefined ? (
                        <MaterialCommunityIcons
                          style={{ alignSelf: 'center' }}
                          name="fingerprint"
                          size={100}></MaterialCommunityIcons>
                      ) : (
                        <Image
                          style={{
                            height: 150,
                            width: 150,
                            resizeMode: 'cover',
                            alignSelf: 'center',
                          }}
                          source={{
                            uri: `data:image/gif;base64,${fingerPrint.imageValue}`,
                          }}></Image>
                      )}
                        </View>

                        <View  style={{width:'100%', flexDirection:'row',
                         marginTop:20,justifyContent:'center'}}>
                            <Pressable 
                             onPressIn={_resetDevices}
                             style={[styles.bottomnewBtn,{marginRight:20}]}>
                                <TextView
                                    style={{alignSelf:'center', color:'#000',fontSize:12}}
                                    text={"Retry"}
                                ></TextView>
                            </Pressable>
                            <Pressable 
                             onPressIn={_fingerPrint}
                            style={styles.bottomnewBtn}>
                                <TextView
                                    style={{alignSelf:'center', color:'#000',fontSize:12}}
                                    text={"Capture"}
                                ></TextView>
                            </Pressable>
                          
                        </View>
                        <CustomButton 
                        onPress={_onSubmit}
                        
                        text={"Submit"} 
                        style={{padding:10, borderRadius:20, alignItems:'center', width:'90%'}} 
                        textStyle={{fontSize:17}} 
                        />
                       
                        
                    </View>
                </View>
                </ScrollView>
                <Toast  {...toast} onDismiss={() => setToast({ message: "", type: "" })} />

            </View>

    </SafeAreaView>
  
 );
};



export default memo(RepaymentScreen);

const styles = StyleSheet.create({
    mainContainer:{
       padding:20,
      flex:1, 
      flexDirection:'column', 
      justifyContent:'center'
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