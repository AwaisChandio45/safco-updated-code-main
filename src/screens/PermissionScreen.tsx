import React from 'react'
import { 
    View, 
    SafeAreaView, 
    Pressable, 
    StyleSheet, 
    Dimensions,
    Platform,
    PermissionsAndroid 
} from 'react-native'
import { TextView } from '../components'
import { AppStatusBar } from '../components'
import {Colors} from '../theme'
import { useSelector, useDispatch, connect } from "react-redux";
import { Alert } from 'react-native'

const PermissionScreen = ({navigation, route})=>{
  const dispatch = useDispatch();
    
    const {userData, station} = route.params

    const {width, height} = Dimensions.get('window')
    
    const getPermission = async()=>{
       
        console.log('===>',station)
         if (Platform.OS == 'android') {
            const granted_ACCESS_FINE_LOCATION = await PermissionsAndroid.request(
              PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
            );

            console.log(granted_ACCESS_FINE_LOCATION);
            
            if (granted_ACCESS_FINE_LOCATION === PermissionsAndroid.RESULTS.GRANTED) {
                console.log('<======>Location permision success')
                const cameraPermission = await PermissionsAndroid.request(
                    PermissionsAndroid.PERMISSIONS.CAMERA,
                )
                
                if(cameraPermission === PermissionsAndroid.RESULTS.GRANTED){
                    console.log('camera permission success')
                    const writeStoragePermission = await PermissionsAndroid.request(
                        PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
                    )

                    if(writeStoragePermission === PermissionsAndroid.RESULTS.GRANTED){
                        console.log('write storage permission success')
                        const readStoragePermission = await PermissionsAndroid.request(
                            PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
                        )
                        if(readStoragePermission === PermissionsAndroid.RESULTS.GRANTED){
                          
                            if(station==101){
                                dispatch({
                                    type: 'SET_UPDATECHECK',
                                    payload:{value:false, id: null}
                                  });
                                  navigation.replace('HalafNama',{item:{}})
                            }else{
                                if(userData==null){
                                    console.log('read storage permission success==>',userData)
                                    navigation.replace('Login', { userData:userData, station: station }); 
                                }else{
                                    console.log('read storage permission success==>',userData)
                                    navigation.replace('Login', { userData:userData, station: station }); 
                                }

                            }
                          
                        
                        }else{
                            
                            console.log('read storage permission failed')
                        }
                    }else{
                        
                        console.log('write storage permission failed')
                    }
                    
                }else{
                    
                    console.log('camera permission failed')
                
                }
            } else {
                
                console.log('Location permission failed')
            
            }
    }
    }
    const onPressSkip=()=>{
        if(station==101){
        navigation.goBack()
        }else{
            Alert.alert("Sorry!","You can't skip this step")
        }
        // if(station==101){
        //     dispatch({
        //         type: 'SET_UPDATECHECK',
        //         payload:{value:false, id: null}
        //       });
        //       navigation.navigate('HalafNama',{item:{}})
        // }else{
        //     console.log('read storage permission success==>',userData)
        //     navigation.replace('Drawer', { userData:userData, station: station }); 
        // }
    }
    
    return(
        <SafeAreaView style={styles.container}>
             <AppStatusBar></AppStatusBar>
            
            <View style={{flex:1, backgroundColor:Colors.darkGreenColor, flexDirection:'column', justifyContent:'center', alignItems:'center'}}>
                <View style={{width:width/1.2, height:height/1.5, backgroundColor:'#fff', elevation:10, borderRadius:10, padding:10, alignItems:'center' }}>
                    <TextView type={'text'} text={"PERMISSION REQUIRED"} style={{color:Colors.darkGreenColor, fontWeight:'bold', fontSize:18}} />
                    
                    <View style={{padding:10}}>
                        <View style={{flexDirection:'row'}}>
                            <View style={{flexDirection:'column', justifyContent:'center'}}>
                                <View style={{width:6, height:6, borderRadius:360, backgroundColor:'#000'}}></View>
                            </View>
                            <TextView type={'text'} text={"LOCATION"} style={{fontSize:15, fontWeight:'800', marginLeft:10, color:Colors.darkGreenColor}} />
                        </View>
                        <View style={{marginTop:10}}>
                            <TextView type={'text'} style={{fontSize:12,}} text={'The approximate location from which you’re logging in \n You (via your IP address – we do not receive any GPS information) \n Performing the Services, maintaining the quality or safety of the Services, internal research, debugging, auditing and analysis of user interactions, advancing our commercial or economic interests, Short Term Use'} />
                        </View>
                    </View>

                    <View style={{padding:10}}>
                        <View style={{flexDirection:'row'}}>
                            <View style={{flexDirection:'column', justifyContent:'center'}}>
                                <View style={{width:6, height:6, borderRadius:360, backgroundColor:'#000'}}></View>
                            </View>
                            <TextView type={'text'} text={"STORAGE"} style={{fontSize:15, fontWeight:'800', marginLeft:10, color:Colors.darkGreenColor}} />
                        </View>
                        <View style={{marginTop:10}}>
                            <TextView type={'text'} style={{fontSize:12,}} text={'Photographs, videos, audio files, electronic communications, Customer Data \n Performing the Services, maintaining the quality or safety of the Services, debugging, auditing and analysis of user interactions, Short Term Use'} />
                        </View>
                    </View>                
                
                <View style={{flexDirection:"row", justifyContent:'flex-end', marginBottom:8, width:'100%', position:'absolute', bottom:5}}>
                
                    <Pressable 
                    onPress={()=>onPressSkip()}
                    style={{marginRight:20, }}>
                        <TextView type={"text"} text={"SKIP"} style={{fontSize:18, padding:8, color:Colors.darkGreenColor, fontWeight:'900'}} />
                    </Pressable>

                    <Pressable style={{}}
                    onPress={()=>getPermission()}
                    >
                        <TextView type={"text"} text={"NEXT"} style={{fontSize:18, padding:8, color:Colors.darkGreenColor}} />
                    </Pressable>
                
                </View>

                </View>
            </View> 
            
            
            
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container:{
        flex:1

    }
})
const mapDispatchToProps = (dispatch) => {
    return {
        UpdateCheck: (Data) => {
        dispatch({
          type: 'SET_UPDATECHECK',
          payload:Data
        });
      },
    };
  };
  export default connect(null, mapDispatchToProps)(PermissionScreen);
