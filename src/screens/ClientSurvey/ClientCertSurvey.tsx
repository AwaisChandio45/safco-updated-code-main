import React, {useState, useEffect} from 'react';
import {Text, SafeAreaView, View, StyleSheet, TouchableOpacity, Pressable} from 'react-native'
import {AppStatusBar, HeaderwithoutDialoge, TextView,Nodata} from '../../components';
import {Colors, GlobalStyles} from '../../theme';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { SwipeListView } from 'react-native-swipe-list-view';
import { DeleteClientForms, getSurveyData } from '../../sqlite/sqlitedb';

const ClientCertSurvey= ({navigation})=>{
    const [getArray, setArray] = useState(false);
    const [noData, setNoData] = useState(false);

    React.useEffect(() => {

      const unsubscribe = navigation.addListener('focus', () => {
      // The screen is focused
      getSurveyData(setArray, setNoData);   
      // Call any action
      });
      // Return the function to unsubscribe from the event so it gets removed on unmount
      
      return unsubscribe;
      
      }, [navigation]);


      const renderItem = ({item, index})=>{
        return (
             <Pressable style={styles.square} onPress = {()=>
             navigation.navigate('ClientSurveyForm',{item:item})}>
                    <View style={
                        {flex:1, 
                        padding:10, 
                        borderLeftWidth:2, 
                        borderLeftColor:Colors.darkGreenColor,
                        flexDirection:'column',
                        justifyContent:'center',
                        alignItems:'center'
                        }}>
                        <MaterialCommunityIcons
                            name="account-circle"
                            size={50}
                            color={Colors.parrotGreenColor}>
                        </MaterialCommunityIcons></View>
                    <View style={{flex:2, padding:10,}}>
                        <View style={{flex:1}}>
                            <Text 
                            style={{fontSize:15,fontWeight:'bold'}}>
                              {item.username}</Text>
                        </View>
                        <View style={{flex:1}}>
                            <Text>{item.user_cnic}</Text>
                        </View>
                    </View>
                </Pressable>
        )
    }

    return (
        <SafeAreaView style={{flex:1, backgroundColor:'#fff'}}>
        <AppStatusBar></AppStatusBar>
        <View style={GlobalStyles.row}>
            <HeaderwithoutDialoge style={{flex:1}} Theme={Colors} back={true}></HeaderwithoutDialoge>
            <TextView
            type={'mini_heading22'}
            style={{paddingHorizontal: 0, marginTop: 55, fontSize:15,marginRight:20}}
            text="Client Satisfication Survey Form"></TextView>
        </View>
        <View style={{flex:1, marginTop:10, padding:20,}}>
            
        {noData && <Nodata></Nodata>}
        <SwipeListView
            style={{ marginBottom: 0 }}
            data={getArray}
            renderItem={renderItem}
            renderHiddenItem={(item, index) => (
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  marginLeft: 20,
                  marginRight: 0,
                  marginTop: 20,
                  
                }}
              >
                <View style={{ flex: 1 }}></View>
                <View style={{}}>
                  <TouchableOpacity
                    onPress={() => {
                      index[item.item.key].closeRow()
                      // alert(JSON.stringify(item.item.user_cnic))
                      // return
                      DeleteClientForms(item.item.user_cnic).then((vales)=>{
                        let get2 = getArray;
                        get2.splice(item.index, 1);
                        setArray({...get2});
      getSurveyData(setArray, setNoData);   

                      }).catch((error)=>{})
                     

                      

                    }}
                  >
                    <View
                      style={{
                        justifyContent: "center",
                        height: 50,
                        width: 50,
                        borderRadius: 10,
                      }}
                    >
                      <MaterialCommunityIcons
                        name="delete-outline"
                        color={"#FF0000"}
                        size={26}
                      />
                    </View>
                  </TouchableOpacity>

                </View>
              </View>
            )}
            rightOpenValue={-75}
          />
                
        </View>
        <View style={styles.buttonCont}>
            <Pressable style={styles.pressableBtn}
                onPress = {()=>navigation.navigate('ClientSurveyForm',{item:undefined})}>
                <MaterialCommunityIcons
                      name="plus"
                      size={30}
                      color={Colors.parrotGreenColor}>
                 </MaterialCommunityIcons>
            </Pressable>
        </View>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    square:{
        flexDirection:'row',  
        marginTop:20, 
        borderRadius:10, 
        padding:10,
        margin:10,
        // shadowColor: "black",
        alignSelf: "center",
        backgroundColor: "#fff",
        elevation:5
    },
    buttonCont:{
        position:'absolute',
        bottom:0,
        width:'100%',
        alignItems:'flex-end'
    },
    pressableBtn:{
        flexDirection:'column',
        justifyContent:'center',
        alignItems:'center',
        backgroundColor:'#fff',
        borderRadius:50,
        width:65,
        height:65,
        marginBottom:15,
        marginRight:15,
        elevation:15
    },
})

export default ClientCertSurvey;