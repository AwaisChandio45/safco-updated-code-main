import React from 'react';
import { SafeAreaView, View, Dimensions, Pressable, StyleSheet, Image, NativeModules,Alert, ActivityIndicator } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { AppStatusBar, Header, TextView, FormInputs  } from '../components';
import { GlobalStyles, Colors } from '../theme';
import ImageComponent from '../components/ImageComponent';
import { BackgroundImage } from 'react-native-elements/dist/config';
import EvilIcons from 'react-native-vector-icons/EvilIcons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Feather from'react-native-vector-icons/Feather';
import AntDesign from'react-native-vector-icons/AntDesign';
import ImagePicker from 'react-native-image-crop-picker';
import RNFS from 'react-native-fs';
import { Tooltip, Text } from 'react-native-elements';
import { useRef } from 'react';
import { connect, useSelector } from 'react-redux';
import Toast from "../components/Toast";
import { registerClientConsent, getCustomerForConsent } from '../apis_auth/apis';
import { NavigationContainer } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
const {width, height} = Dimensions.get('window');
const { FingerModule } = NativeModules;

const ClientConsent = ({navigation}) => {
  const toolTipRef = useRef(null);
  const [customerImage, setCustomerImage] = React.useState(null);
  const getUserData = useSelector((state) => state.UserData);
  const [UserData, setUserData] = React.useState(undefined);
  const [toast, setToast] = React.useState({ value: "", type: "" });
  const [loader, setLoader] = React.useState(false);
  const [cnicLoader, setCnicLoader] = React.useState(false);
 
  var regex = /^[a-zA-Z ]*$/;
  let speacial = /[^a-zA-Z0-9-]/g;

  const [customerInput, setCustomerInput] = React.useState({
    customerImage:null,
    name:{value:"", error:false},
    sonOf:{value:"", error:false},
    cnic:{value:"", error:false},
    branch:"",
    fingerPrint:{value:"", error:false},
  });

  React.useEffect(() => {
    //setCustomerInput({...customerInput,branch:getUserData.UserData.StationName})

  },[]);


  const takePhoto = () => {
        //setDialoge(false);
        ImagePicker.openCamera({
          width: 300,
          height: 400,
          compressImageQuality: 0.5,
          cropping: false,
        }).then(async (image) => {

          var data = await RNFS.readFile(image.path, 'base64').then(res => { return res });
          
          setCustomerInput({...customerInput,customerImage:data});
         toolTipRef.current.toggleTooltip();
          // alert(JSON.stringify(data))
        }).catch((e) => {
          toolTipRef.current.toggleTooltip();
          console.log(e)
        });
      };

  const _fingerPrint = async () => {

    try {

      const eventId = await FingerModule.showToast();

      var parser = JSON.parse(eventId);

      //await AsyncStorage.setItem("@MyFingerPrint", JSON.stringify(parser));


      //console.log(parser.data);

      //console.log(`Created a new event with id ${eventId}`);
      // var data = await RNFS.readFile(eventId, 'base64')
      // var temp=`data:image/gif;base64,${encodedBase64}`
      //-----------
      //   setFingerImage(parser.imageValue);

      setCustomerInput({...customerInput,fingerPrint:{value:parser.imageValue, error:false}});
      //---------------
      // setTemp(parser.imageTemp)
    } catch (e) {
      // console.error(e);
    }
  };

  const _resetDevices = async () => {

    await FingerModule.resetDevice();
  
  };

  const submitData = async()=>{




    // console.log(MyFingerPrint);

    //return
   
    if(customerInput.customerImage == null){
    
      setToast({
        type: "error",
        message: 'Please take a photo of customer',
      });
    
    }else if(customerInput.name.value == ""){

      let getCustomer = customerInput.name;
      getCustomer.error = true;

      setCustomerInput({...customerInput,name:getCustomer});

      setToast({
        type: "error",
        message: 'Please enter name',
      });

    }else if(customerInput.sonOf.value == ""){

      let getCustomer = customerInput.sonOf;
      getCustomer.error = true;

      setCustomerInput({...customerInput,sonOf:getCustomer});

      setToast({
        type: "error",
        message: 'Please enter father name',
      });

    }else if(customerInput.cnic.value == ""){

      let getCustomer = customerInput.cnic;
      getCustomer.error = true;

      setCustomerInput({...customerInput,cnic:getCustomer});

      setToast({
        type: "error",
        message: 'Please enter CNIC number',
      });

    }else if(customerInput.fingerPrint.value == ""){

      let getCustomer = customerInput.fingerPrint;

      setCustomerInput({...customerInput,fingerPrint:getCustomer});

      setToast({
        type: "error",
        message: 'Please take a finger print',
      });

    }else{
      //console.log(customerInput)
      setLoader(true);
      
      registerClientConsent(customerInput).then(res=>{
        
        setLoader(false);
        
        setToast({
          type: "success",
          message: res,
        });
      

      }).catch((e)=>{

        setLoader(false);
        
        setToast({
          type: "error",
          message: e,
        });

      })



    }
  }

    return (
        <SafeAreaView style={{ backgroundColor: "#FFF", flex: 1 }}>
        <AppStatusBar />
        <View style={GlobalStyles.row}>

            <Header screenNo={4} Theme={Colors} back={true} ></Header>

            <TextView
                type={'mini_heading22'}
                style={{ paddingHorizontal: 30, marginTop: 55, fontSize: 15, }}
                text="Client Consent"></TextView>

        </View>

        <ScrollView>

        
          
            <View style={{marginTop:20,}}>

              <View style={{alignItems:"center",}}>
                  
                  {customerInput.customerImage !=null?
                      
                      <Pressable 
                      //onPress = {() => {takePhoto()}} 
                      style={{width:height/5, height:height/5, borderRadius:360 , elevation:10}}>
    
                        {/* <Image source = {require("../assests/images/placeholder.png")}  style={{width:"100%", height:"100%", borderRadius:360, resizeMode:'cover'}} /> */}
                        <Image source = {{uri:customerInput.customerImage}}  style={{width:"100%", height:"100%", borderRadius:360, resizeMode:'cover'}} /> 
                        
    
                      </Pressable>
    
                          :   
                      <Pressable 
                      //onPress = {() => {takePhoto()}} 
                      style={{width:height/5, height:height/5, borderRadius:360 , elevation:10, flexDirecton:"column", justifyContent:"center", alignItems:"center", backgroundColor:'#fff'}}>
                        
                        <Feather name="camera" size = {40} color = "#cdcdcd" />
    
                      </Pressable>
                  }
  
              
                </View>


           {/* <Tooltip 
            ref = {toolTipRef} 
            backgroundColor='#fff' 
            containerStyle={{height:55} } 
            popover={
                <View style = {{flex:1}}>
                   <Pressable style={{padding:6,}}
                   onPress={() => {takePhoto()}}
                   >
                     <TextView style={{fontSize:12}} text={'Change Image'} />
                   </Pressable>
                </View>

            }>
              
              <View style={{alignItems:"center",}}>
                
              {customerInput.customerImage !=null?
                  
                  <View style={{width:height/5, height:height/5, borderRadius:360 , elevation:10}}>

                    {/* <Image source = {require("../assests/images/placeholder.png")}  style={{width:"100%", height:"100%", borderRadius:360, resizeMode:'cover'}} /> */}
                    {/* <Image source = {{uri:`data:image/gif;base64,${customerInput.customerImage}`}}  style={{width:"100%", height:"100%", borderRadius:360, resizeMode:'cover'}} /> 
                    

                  </View>

                      :   
                  <View style={{width:height/5, height:height/5, borderRadius:360 , elevation:10, flexDirecton:"column", justifyContent:"center", alignItems:"center", backgroundColor:'#fff'}}>
                    
                    <Feather name="camera" size = {40} color = "#cdcdcd" />

                  </View> */}
              {/* } */}

            
              {/* </View>

            </Tooltip> */}
            
            <View style={{padding:20, marginTop:10}}>

              <View style={{flexDirection:'row', justifyContent: 'space-between'}}>      
                <View>
                  
                  <FormInputs
                  keyboardtype={'phone-pad'}
                  required={true}
                  text={'CNIC'}
                  error={customerInput.cnic.error}
                  value={customerInput.cnic.value}
                  onChangeText={(value: string) => {

                    var regexp = new RegExp('^[0-9+]{5}-[0-9+]{7}-[0-9]{1}$');
                      
                    if (value.length < 16) {
                          if (value.length == 5 || value.length == 13) {

                              let get = customerInput;
                              get.cnic.value = value + '-';

                              get.cnic.error = !regexp.test(value) ? true : false

                              setCustomerInput({...get})

                          }else {
                              let get = customerInput;

                              get.cnic.value = value;

                              get.cnic.error = !regexp.test(value) ? true : false

                              setCustomerInput({...get})

                              //------------------------------------------------------------------------------
                          }
                          if(value.length == 15){
                                
                            setCnicLoader(true)

                            getCustomerForConsent(value).then(res=>{

                              let get = customerInput;
                              
                              //console.log("===>",res?.branch);
                              
                              get.customerImage = res?.customerImg;
                              get.name = {value:res?.customerName,error:false};
                              get.sonOf = {value:res?.guardian,error:false};
                              get.branch = res?.branch
                              
                              //console.log("===>",get)
                              setCustomerInput(get)
                              setCnicLoader(false)
                              
                            }).catch((e)=>{
                                setCnicLoader(false)

                                setToast({
                                  type: "error",
                                  message: e,
                                });
                            })


                          }else if(value.length < 15 && customerInput.name.value.length > 0){
                            
                            let get = customerInput;

                            get.customerImage = null;
                            get.name = {value:"",error:false};
                            get.sonOf = {value:"",error:false};
                            get.branch ="";
                            get.fingerPrint = {value:"", error:false};
                            
                            
                            setCustomerInput(get)

                          }
                    }

                  // setCustomerInput({...customerInput, cnic:{value:value, error:false}})
                  }
                
                  }
                  />
                  
                  {cnicLoader &&
                    
                    <ActivityIndicator color={Colors.parrotGreenColor} size="small" style={{marginTop:10, alignSelf:'flex-end', marginRight:10}} />
                  
                  }
                </View>
               
               
                <FormInputs
                keyboardtype={'default'}
                required={true}
                text={'Name'}
                error={customerInput.name.error}
                value={customerInput.name.value}
                onChangeText={(value: string) => {

                  setCustomerInput({...customerInput, name:{value, error:false}})
                
                }}
                />
                
            </View>

            <View style={{flexDirection:'row', marginTop:20, justifyContent: 'space-between'}}>      
                

                <FormInputs
                keyboardtype={'default'}
                required={true}
                text={'S/O'}
                error={customerInput.sonOf.error}
                value={customerInput.sonOf.value}
                onChangeText={(value: string) => {

                  
                  setCustomerInput({...customerInput, sonOf:{value, error:false}})
              

                }}
                />

                <FormInputs
                keyboardtype={'default'}
                required={true}
                text={'Branch'}
                editable={false}
                value={customerInput.branch}
                onChangeText={(value: string) => {

                  
                  setCustomerInput({...customerInput, branch:value})
              

                }}
                />
                
            </View>

            <View style={{marginTop:20}}>

                <TextView style={{fontSize:12, textAlign:'justify'}} text={'This is to inform you that SAFCO Support Foundation SSF is going to be transferred into SAFCO Microfinance Company SMC from 15 June 2022. In this regard, we getting consent from the client that now onward you will be the part of SMC. This is for your information and knowledge.'} />

            </View>

            <View style = {{alignItems:"center", marginTop:10}}>

              {
                customerInput.fingerPrint.value == ""?
                  
                  <MaterialCommunityIcons
                  style={{ alignSelf: 'center' }}
                  name="fingerprint"
                  size={100} />

                  :

                  <Image
                  style={{
                    height: 150,
                    width: 150,
                    resizeMode: 'cover',
                    alignSelf: 'center',
                  }}
                  source={{
                    uri: `data:image/gif;base64,${customerInput.fingerPrint.value.imageValue}`,
                  }}></Image>

              }



            </View>

            {loader && <ActivityIndicator color={Colors.parrotGreenColor} style={{marginTop:10}} />}
            
            <View style={{ flexDirection: 'row', marginTop: 20, height: 50 }}>
            <Pressable
              onPressIn={_fingerPrint}
              style={styles.captureBtn}>
              <TextView
                type={'mini_heading22'}
                style={{ fontSize: 13, color: Colors.white }}
                text="Capture">
              </TextView>
            </Pressable>
            
            <Pressable
              onPressIn={_resetDevices}
              style={styles.retryBtn}>
              <TextView
                type={'mini_heading22'}
                style={{ fontSize: 13, color: Colors.white }}
                text="Retry">
              </TextView>
            </Pressable>
            
            <Pressable
              onPress={() => submitData()}
              style={styles.agreeBtn}>
              <TextView
                type={'mini_heading22'}
                style={{ fontSize: 13, color: Colors.white }}
                text="I Agree">
              </TextView>
            </Pressable>
          </View>        
        
            </View>

            </View>
        
        </ScrollView>
       
          <Toast {...toast} onDismiss={() => setToast({ message: "", type: "" })} />
        </SafeAreaView>
    )
}


const styles = StyleSheet.create({
    captureBtn: {
        flex: 1,
        backgroundColor: Colors.kulfa,
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 5,
        borderRightWidth: 1,
        borderColor: 'white',
        elevation: 10,
        margin: 3
      },

      retryBtn: {
        flex: 1,
        backgroundColor: Colors.kulfa,
        flexDirection: 'column',
        justifyContent: 'center',
        borderRadius: 5,
        borderLeftWidth: 1,
        borderRightWidth: 1,
        borderColor: 'white',
        margin: 3,
        elevation: 10
      },
      agreeBtn: {
        flex: 1,
        backgroundColor: Colors.kulfa,
        flexDirection: 'column',
        justifyContent: 'center',
        borderRadius: 5,
        borderLeftWidth: 1,
        borderColor: 'white',
        margin: 3,
        elevation: 10
    
      }
})

export default ClientConsent;