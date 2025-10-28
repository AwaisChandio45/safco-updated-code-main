

import React,{useState} from 'react';
import type {Node} from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Dimensions,
  TextInput,
  View,
  Pressable,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  Text,
  Modal,
} from 'react-native';
import {Button, Card} from 'react-native-paper'
import { AppStatusBar,Search,Nodata,Header } from '../../components';
const {height, width} = Dimensions.get('window');
import EvilIcons from 'react-native-vector-icons/EvilIcons';
import Feather from 'react-native-vector-icons/Feather';
import LottieView from 'lottie-react-native';

import { connect,useSelector } from 'react-redux';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { Colors } from '../../theme';
import { TextView } from '../../components';
import DateChips from '../../components/DateChips';
import { getSafcoCustomer } from '../../apis_auth/apis';
import { SwipeListView } from 'react-native-swipe-list-view';
import { BackgroundImage } from 'react-native-elements/dist/config';
import Fontisto from 'react-native-vector-icons/Fontisto';
import SafcoCustomersRecord from '../../components/SafcoCustomersRecord';
import CIBView from '../../components/CIBView';
// import CirView from '../../components/CirView';
import { getCustomerFromsOnly, DeleteAssetsImages, DeleteCustomerForms, DeleteDocImages, getAssetsDocuments, getAssetsDocumentsforSyncup, getCustomerFroms, getLoanDocuments, getSelectedCustomerFrom, getCustomerFromsAndAnswers, gettingCibReport, getFingerPrintFromDevice } from '../../sqlite/sqlitedb';
const SafcoCustomer: () => Node = (props) => {
  
  const [progressVisible, setProgressVisible] = React.useState();
  const [customerData, setCustomerData] = React.useState([])
  const [customerDataOrignal, setCustomerDataOrignal] = React.useState([])
  const StationReducer = useSelector((state) => state.StationReducer);
  const getUserData = useSelector((state) => state.UserData);

  const [modalVisible, setModalVisible] = useState(false);
  const [cibReportResponse, setCibReportResponse] = useState(undefined);
  const [getReportName, setReportName] = useState(null);
  
  const [searchData, setSearchData] = React.useState([])
  const [noData, setNoData] = useState(false)
  const [container,setContainer]=React.useState( 
    {
        topBar:true,
        startDate:'',
        endDate:"",
        Cnic:"",
        activeInput:true

    })
 ///////////////Fetching data from api//////
   React.useEffect(() => {
    fetchData()
    console.log("stationId---->",StationReducer.station.stationId)
    console.log("getUserData---->",getUserData.UserData.Gender)

   },[])

   const fetchData = async () => {
    getSafcoCustomer(setProgressVisible,StationReducer.station.stationId,getUserData.UserData.Gender).then((records)=>{
      console.log("SafcoCustomer=======respose chnage>", records.length)
      if(records.length==0){
        setNoData(true)
      }else{
        setNoData(false)
      } 

      setCustomerData([...records])
      setCustomerDataOrignal([...records])
      // console.log(records)
    });
   }

  const renderItem = ({item, index})=>{
    return(

      <SafcoCustomersRecord item={item} onPress={()=>props.navigation.navigate("SafcoCustomerDetail",{item:item}) }  getCibPress = {() => getCibReport({item:item})}/>

      
    )
  }
    // ******************************************* SERACH
    const searchText = (e) => {

      let text = e.toLowerCase();
      let filteredName = customerDataOrignal.filter((item) => {
        if (item.FirstName.toLowerCase().match(text)) {
          return item.FirstName.toLowerCase().match(text);
        } else {
        }
      });
      if (!text || text === "") {
        fetchData();
      } else if (!Array.isArray(filteredName) && !filteredName.length) {
        // set no data flag to true so as to render flatlist conditionally
        // this.setState({
        //   noData: true
        // })
      } else if (Array.isArray(filteredName)) {
        // this.setState({
        //   noData: false,
        //   data: filteredName
        // })
        setCustomerData([...filteredName]);
      }
  
    };
// *****************************************************
const removeChip=(index)=>{
  
  setSearchData([])
}

const getCibReport = (item) => {

 console.log("here=================>",item)
 setReportName("CIB")
 setCibReportResponse(item.item)
  setModalVisible(true)
}

  return (
   <SafeAreaView style={styles.safeview}>
    
     <AppStatusBar></AppStatusBar>
     <Header Theme={Colors}
     ></Header>
     <View>
     <Search
      Theme={""} 
      filterData={container}
      setFilterData={setContainer}
      setSearchData={setSearchData}
      onChangeText={(e)=>searchText(e)} 
      Data={customerData} 
      setData={setCustomerData} 
      variable={3}
      filtershow={false}
      setNoData={setNoData}
      setLoading={setProgressVisible}
      text={'Search Safco Customers by name..'}
    />
    <DateChips searchData={searchData} setSearchData={setSearchData} />
    {progressVisible && <ActivityIndicator style={{marginTop:30}} color={Colors.parrotGreenColor} />}
    {noData && <Nodata></Nodata>}
     {customerData.length > 0 && 
     
     <SwipeListView
          contentContainerStyle={{ paddingBottom: 200 }}
          style={{ marginTop: 20, marginLeft: 30, marginRight: 30 }}
          data={customerData}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          renderItem={renderItem}
          keyExtractor={(item, index) => index.toString()}
          renderHiddenItem={(item, index) => (

            <View
              style={{

                flexDirection: "row",

                alignItems: "center",

                marginRight: 10,

                marginTop: 20,


              }}
            >
              <View style={{ flex: 1 }}></View>

              <View style={{}}>

                <TouchableOpacity

                  onPress={() => {
                    props.navigation.navigate('AddForm',{IsEbanking:"1",IsEbankingData:item.item})
                    //console.log()
                   
                  }}
                >
                  <MaterialIcons

                    name="loop"

                    color={Colors.parrotGreenColor}

                    size={26}

                  />
                </TouchableOpacity>

              </View>
            </View>
          )}
          rightOpenValue={-75}
        />}
     
     </View>
     <Modal
        animationType={'fade'}
        //transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(false);
          //console.log('Modal has been closed.');
        }}>
        {/* <View style={{flex:1}}> */}
        
          <Pressable style={{alignItems:'flex-end', padding:20}}
          onPress={()=>setModalVisible(false)}
          >
             <EvilIcons name={'close'} size={30} color={'red'} />
          </Pressable>

          <View style={{paddingTop:30, flex:1 }}>
            <ScrollView>
            
            {cibReportResponse != undefined &&
              
              getReportName == "CIB" ? 
              
              <CIBView reportDetail={cibReportResponse} />
            :
              <CIBView reportDetail={cibReportResponse} />
              
            }
            </ScrollView>
            </View>

        {/* </View> */}




      </Modal>

   </SafeAreaView>
  );
}
const styles=StyleSheet.create({
    safeview: {
        flex:1
    },
    card: {
      marginTop:10,marginLeft:30,marginRight:30,paddingLeft:10
    },
    row:{flexDirection:"row",alignItems:'center'},
    circle: {height:30,width:30,borderRadius:100,marginLeft:0,marginRight:10,
      justifyContent:'center',backgroundColor:'#f1f1f1'},
    
})
export default SafcoCustomer;
