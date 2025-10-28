

import React, { useEffect, useState, } from 'react';
import type { Node } from 'react';
import {
  SafeAreaView,
  ScrollView,
  PermissionsAndroid,
  Alert,
  Linking,
  StyleSheet,
  ActivityIndicator,
  Dimensions,
  Platform,
  TextInput,
  View,
  TouchableOpacity,
  RefreshControl,
  NativeModules,
  Modal,
  Pressable,
  Text,
  FlatList
} from 'react-native';
const { FingerModule } = NativeModules;

import RNFS from 'react-native-fs';
import moment from 'moment';
import { Card } from 'react-native-paper'
import { AppStatusBar, CustomerRecorditems, CustomProgressDialoge, Header, Nodata, Search, TextView } from '../../components';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Entypo from 'react-native-vector-icons/Entypo';
import EvilIcons from 'react-native-vector-icons/EvilIcons'
import LottieView from 'lottie-react-native';
import { useNavigation } from '@react-navigation/native';
import { SwipeListView, SwipeRow } from "react-native-swipe-list-view";
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { connect, useSelector } from 'react-redux';
import { ProgressDialog } from 'react-native-simple-dialogs';
import { getCustomerFromsOnly, DeleteAssetsImages, DeleteCustomerForms, DeleteDocImages, getAssetsDocuments, getAssetsDocumentsforSyncup, getCustomerFroms, getLoanDocuments, getSelectedCustomerFrom, getCustomerFromsAndAnswers, gettingCibReport, getFingerPrintFromDevice ,getCustomer} from '../../sqlite/sqlitedb';
import { Colors, GlobalStyles } from '../../theme';
var { height, width } = Dimensions.get('window');
import { useDispatch } from "react-redux";
import { CallforTags, checkingLoanDataCnic, CheckingTags, sendObjectbyLoanOfficer, sendTempCustomerAssetsImages, sendTempCustomerDocsimages, uploadingAssetsImage, uploadingCustomerdata, uploadingDocs, checkCustomerByThumbPrint, customerMatchedFromLiveDb, checkApplicationVersion ,CustomerCreditScoringReport } from '../../apis_auth/apis';
import Toast from '../../components/Toast';
import DateChips from '../../components/DateChips';
import { color } from 'react-native-elements/dist/helpers';
import CIBView from '../../components/CIBView';
import CirView from '../../components/CirView';
import CustomerViews from '../../components/CustomerViews';
import { ApplicationVersion, releaseDate } from '../../utilis/ContsValues';
import { SavingAmount } from '../../apis_auth/apis';
import { SavingBusinessoptions } from '../../apis_auth/apis';
import {oTpSyncUp} from '../../apis_auth/apis';


const Customer: () => Node = (props) => {

  let docs = [];
  let imagesCounter = 0;
  let compositeKey = '';
  const array_index = 0;
  const [getForms, setFroms] = useState(null)
  const [getFormsOrignal, setFromsOrignal] = useState(null)
  const [noData, setNoData] = useState(false)
  const [dialogeCount, setDialogeCount] = useState("Syncing up")
  const StationReducer = useSelector((state) => state.StationReducer);
  const SyncdownReducer = useSelector((state) => state.SyncdownReducer);
  const [progressVisible, setprogressVisible] = useState(false)
  const [loading, setLoading] = useState(true)
  const [title, setTitle] = useState("Syncing up..");
  const [toast, setToast] = React.useState({ value: "", type: "" });

  const [refreshing, setRefreshing] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [customerModalVisible, setCustomerModalVisible] = useState(false);
  const [getReportName, setReportName] = useState(null);
  const [hasCibData, setHasCibData] = useState(true);
  const [cibReportResponse, setCibReportResponse] = useState(undefined);
  const [CustomeerView, setCustomeerViewResponse] = useState(undefined);
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const [searchData, setSearchData] = React.useState([])
  const [container, setContainer] = React.useState(
    {
      topBar: true,
      startDate: '',
      endDate: "",
      Cnic: "",
      activeInput: true

    })
  const [UserData, setUserData] = React.useState(undefined);
  const getUserData = useSelector((state) => state.UserData);


 //new code for call data from api savingBusinessoptions
  const [savingBusinessoptions, setsavingBusinessoptions] = useState([]);
  useEffect(() => {
    async function fetchData() {
      const data = await SavingBusinessoptions();
     //console.log('API response   2---->:', data);
      setsavingBusinessoptions(data);
    }
    fetchData();
  }, []);

  const BusinessSavingPersonalValue = savingBusinessoptions.find(item => Object.keys(item)[0] === "BusinessSavingPersonal");
  const valuePersonal = BusinessSavingPersonalValue?.BusinessSavingPersonal;
  var valuePersonalValue = Number(valuePersonal);
  //console.log('valueBusinessSavingPersonal Value:', valuePersonalValue || 'Value not found.');

  const businessSavingNormalValue = savingBusinessoptions.find(item => Object.keys(item)[0] === "BusinessSavingNormal");
  const valueNormal = businessSavingNormalValue?.BusinessSavingNormal;
  var valueNormalValue = Number(valueNormal);
  //console.log('BusinessSavingNormal Value:', valueNormal || 'Value not found.');

  const BusinessSavingIndividualandIslamicValue = savingBusinessoptions.find(item => Object.keys(item)[0] === "BusinessSavingIndividualandIslamic");
  const valueIndividualandIslamic = BusinessSavingIndividualandIslamicValue?.BusinessSavingIndividualandIslamic;
  var valueIndividualIslamicValue = Number(valueIndividualandIslamic);
  //console.log('valueBusinessSavingIndividualandIslamic Value:', valueIndividualandIslamic || 'Value not found.');
 
//new code for call data from api businessamount
  const [businessAmount, setSavingAmountData] = useState('');
  var savingAmountNumber = Number(businessAmount);
  useEffect(() => {
    SavingAmount()
      .then(responseData => {
        //console.log('API response---->:', responseData);
        setSavingAmountData(responseData);
      })
      .catch(error => {
        console.log('Error:', error);
      });
  }, []);
 // console.log('API response-1--->:', savingAmountNumber);

  React.useEffect(async () => {
    setUserData(getUserData);
  }, []);

  useEffect(() => {
    const unsubscribe = props.navigation.addListener("focus", async () => {
      fetchData();
    });
  }, [])

  const fetchData = () => {

    getCustomerFroms(setFroms, setFromsOrignal, setNoData, setLoading);

  }

  //============================ LOAN OFFICER SYNCUP PROCESS ==============================START
  // **************************************************************************
  const Syncup = async (parser, item, index) => {

    docs = [];
    imagesCounter = 0;
    compositeKey='';
    var customer = parser.customerInfo[0];
    var loanInfo = parser.loanInfo[0];
    var assestsInfo = parser.assestsInfo[0];
    var guarantorInfo = parser.guarantorInfo[0];
    
  //  console.log('data loaninfoo--------------->',valuePersonalValue)
  //  console.log('data loaninfoo--------------->',loanInfo.customerLoan_type.value)
  //  console.log('data requestedLoan--------------->',  loanInfo.customerLoan_type.value == 'Personal')
 
    // my code condition when syncpup , data comes from api savingsAmountnumber

    // if (Number(loanInfo.businessSavings.value) > savingAmountNumber) {
    //   setToast({
    //     type: "error",
    //     message: "Savings should not be greater than 2 lac ",
    //   });
    //   return;
    // }

    // if (Number(loanInfo.householdSavings.value) > savingAmountNumber) {
      // setToast({
      //   type: "error",
      //   message: "Savings should not be greater than 2 lac ",
      // });
      // return;
    // }


 // condition on requestedloan
    if (loanInfo.customerLoan_type.value == 'Personal') {
      if(loanInfo.requestedLoan.value > 500000 ){
       setToast({
       type: "error",
        message: "Requested Personal Loan Type Limit is High",
      });
       return;
      }
     }

     if (loanInfo.customerLoan_type.value == 'Normal') {
      if(loanInfo.requestedLoan.value > 200000 ){
       setToast({
       type: "error",
        message: "Requested Normal Loan Type Limit is High",
      });
       return;
      }
     }

    

     if (loanInfo.customerLoan_type.value == 'Islamic Finance') {
      if(loanInfo.requestedLoan.value > 1500000 ){
       setToast({
       type: "error",
        message: "Requested Islamic Loan Type Limit is High",
      });
       return;
      }
     }

     if (loanInfo.customerLoan_type.value == 'Individual') {
      if(loanInfo.requestedLoan.value > 1500000 ){
       setToast({
       type: "error",
        message: "Requested Individual Loan Type Limit is High",
      });
       return;
      }
     }

//condition for businesssaving

if (loanInfo.customerLoan_type.value == 'Personal') {
  if (Number(loanInfo.businessSavings.value) > valuePersonalValue) {
    setToast({
      type: "error",
      message: "BusinessSavings is greater then your limit ",
    });
    return;
  }
 }

 if (loanInfo.customerLoan_type.value == 'Normal') {
  if (Number(loanInfo.businessSavings.value) > valueNormalValue) {
    setToast({
      type: "error",
      message: "BusinessSavings is greater then your limit ",
    });
    return;
  }
 }

 if (loanInfo.customerLoan_type.value == 'Islamic Finance') {
  if (Number(loanInfo.businessSavings.value) > valueIndividualIslamicValue) {
    setToast({
      type: "error",
      message: "BusinessSavings is greater then your limit ",
    });
    return;
  }
 }

if (loanInfo.customerLoan_type.value == 'Individual') {
  if (Number(loanInfo.businessSavings.value) > valueIndividualIslamicValue) {
    setToast({
      type: "error",
      message: "BusinessSavings is greater then your limit ",
    });
    return;
  }
 }

//condition for  householdsaving

if (loanInfo.customerLoan_type.value == 'Personal') {
  if (Number(loanInfo.householdSavings.value) > valuePersonalValue) {
    setToast({
      type: "error",
      message: "HouseHoldSavings is greater then your limit ",
    });
    return;
  }
 }

 if (loanInfo.customerLoan_type.value == 'Normal') {
  if (Number(loanInfo.householdSavings.value) > valueNormalValue) {
    setToast({
      type: "error",
      message: "HouseHoldSavings is greater then your limit ",
    });
    return;
  }
 }

 if (loanInfo.customerLoan_type.value == 'Islamic Finance') {
  if (Number(loanInfo.householdSavings.value) > valueIndividualIslamicValue) {
    setToast({
      type: "error",
      message: "HouseHoldSavings is greater then your limit ",
    });
    return;
  }
 }

if (loanInfo.customerLoan_type.value == 'Individual') {
  if (Number(loanInfo.householdSavings.value) > valueIndividualIslamicValue) {
    setToast({
      type: "error",
      message: "HouseHoldSavings is greater then your limit ",
    });
    return;
  }
 }
//the end savings conditions




    else if (loanInfo.loanType == undefined) {
      setToast({
        type: "error",
        message: "Please fill loan information first!",

      });
      return
    }



    if (assestsInfo.assetName.value == "") {
      setToast({

        type: "error",

        message: "Please fill assets information first!",

      });
      return
    }
    if (customer.evrisys_customerImage == undefined) {

      setToast({

        type: "error",

        message: "Please upload E-Vrisys  image first>>>",

      });
      return
    }
    if (guarantorInfo == undefined) {
      setToast({

        type: "error",

        message: "Please add Gurantor information first!",

      });
      return
    }
    var Commentsparser = JSON.parse(item.Comments)

    if (!Commentsparser) {


      setToast({

        type: "error",

        message: "Please insert comments first!",

      });

      return

    }

      // setTitle("Checking Fingerprint")
      // setprogressVisible(true)
      
    let make = [];
    //////////////////////////////////////////////////////////////////////////////
    //Getting Tags for checking...
    /////////////////////////////////////////////////////////////////////
    
    if (parser) {

      var temp = parser.assestsInfo;
      

      temp.map((underitem, undexindex) => {

        if (underitem.assetTagName.value != undefined && underitem.assetTagId.value.length > 0) {

          make.push({ AssetTagId: underitem.assetTagId.value, AssetTagName: underitem.assetTagName.value })
        }
      })


    } else {

      return

    }
    // let insertArray=[];
    // insertArray.push(item.user_cnic)
    // checkingLoanDataCnic(insertArray).then(async (res) => {
    //   console.log("--->respose",res?.status)
    //   if(res?.status==false){

    //     setToast({

    //       type: "error",

    //       message: "" + res?.message,

    //     });
    //     return
    //   }else{

    //   }

    // })
    //   .catch((err) => {
    //     Alert.alert("Error", err.message)
    //     console.log("--->err",err)
    //     })
    //////////////////////////////////////////////////////////////////////////////
    //Send array of tags for checking already exist or not ...(CheckingTags)
    /////////////////////////////////////////////////////////////////////

    var fingerPrint = customer?.customer_biomatric?.imageTemp;
    var userCnic = customer?.customer_cnicNumber.value;
 
    let AllCustomerFingerPrint = [{customerFingerPrint:fingerPrint, customerCnic:userCnic}]
     

    setprogressVisible(true)
    await checkApplicationVersion().then(async(res)=>{
      
      if ((res?.StatusCode == 200 && res?.Version == ApplicationVersion) || res?.StatusCode == 201) {
        try {
          setprogressVisible(true);
          setTitle("Checking Tags..");
          setprogressVisible(true);
      
          CheckingTags(make, setprogressVisible).then((value) => {
            console.log("CheckingTags" + value);
      
            if (value.length > 0) {
              setToast({
                type: "error",
                message: "" + value,
              });
              setTitle("Updating Tags..");
              setprogressVisible(true);
      
              CallforTags(StationReducer.station.stationId, setprogressVisible)
                .then((values) => {
                  setprogressVisible(false);
                });
            } else {
              console.log("===>item.user_cnic", JSON.stringify(item.user_cnic));
              setprogressVisible(true);
              setTitle("Uploading Docs..");
      
              getLoanDocuments(item.user_cnic).then((value) => {
                if (value) {
                  if (value.length > 0) {
                    value.map((underitem, underindex) => {
                      docs.push({
                        CustomerId: item.id,
                        DocumentId: underindex,
                        Image: underitem.imgValue,
                        LoanId: index,
                        addedBy: "addedBy" in underitem ? underitem.addedBy : "",
                        NicNumber: item.user_cnic,
                        UniqueCode: "4813_16" + Math.random(),
                        ImageName: underitem.imgName.value,
                      });
                    });
                    setTitle("Syncing up");
                    var converter = item.CustomerAnswers;
                    var parser2 = JSON.parse(converter);
                    var CustomerAns = parser2.answerArray;
      
                    // **************** REMOVING IMAGES
                    parser.customerInfo[0].customer_cnicNumber.value = item.user_cnic;
                    parser.loanInfo[0].loan_customerImage = [{ key: 1, activeTab: false, imgName: { value: '', error: false }, imgValue: undefined }];
                    parser.assestsInfo.map((assetsitem, indexer) => {
                      parser.assestsInfo[indexer].assets_Image = [{ key: 1, activeTab: false, imgName: { value: '', error: false }, imgValue: undefined }];
                    });
                    // **************** REMOVING IMAGES
      
                    var removeQuestioninSindhi = CustomerAns;
                    removeQuestioninSindhi.map((item, index) => {
                      removeQuestioninSindhi[index].question = "";
                    });
                    item.CustomerAnswers = removeQuestioninSindhi;
      
                    GettingCustomerData(item, index, parser);
                  } else {
                    setprogressVisible(false);
                    setToast({
                      type: "error",
                      message: "Sorry! Documents not found.",
                    });
                  }
                }
              }).catch((error) => {
                setprogressVisible(false);
                console.log("catch works", JSON.stringify(error));
              });
            }
          }).catch((error) => {
            console.log(error);
            setprogressVisible(false);
            if (error) {
              setToast({
                type: "error",
                message: "" + error,
              });
            }
          });
        } catch (error) {
          setprogressVisible(false);
        }
      }
      
      else{
        setprogressVisible(false)
        setToast({
          type: "error",
          message: "You are using older version of this application. Please update and try again",
        });
      }
    })
    .catch((e)=>{
      setprogressVisible(false)
      console.log("checking Version Error")
    }) 
  }
  //////////////////////////////////////////////////////////////////////////////
  //Getting Data of Customer...
  /////////////////////////////////////////////////////////////////////
  const GettingCustomerData = async (item, index, parser) => {
    compositeKey = item.user_cnic

    //console.log('compositet key====>',item.user_cnic)

    let assets = []
    let assets_Image = [];
    //////////////////////////////////////////////////////////////////////////////
    //Getting Assets form vlaues...
    /////////////////////////////////////////////////////////////////////
    parser.assestsInfo.map((underitem, underindex) => {
      assets.push(
        {
          AssetName: '' + underitem.assetName.value,
          AssetOwner: '' + underitem.assetOwner.value,
          AssetQuantity: '' + underitem.assetQuantity.value,
          AssetTagId: '' + underitem.assetTagId.value,
          AssetTagName: '' + underitem.assetTagName.value,
          AssetValue: '' + underitem.assetValue.value,
          CustomerAssetId: '' + underindex,
          CustomerId: '' + item.id,
          Notes: '' + underitem.assetNote.value,
          _CustomerAssetNameId: underindex
        }
      )
      getAssetsDocumentsforSyncup(item.user_cnic).then((value) => {

        if (value) {

          imagesCounter = 0;

          compositeKey += Math.floor(Math.random() * 1000000);

          setTitle("Uploading Docs.. \n" + imagesCounter + "/" + docs.length)

          if (value.length > 0) {

            value.map((imageitem, imageindex) => {
              console.log("imgName==>", imageitem.imgName)
              if ((underindex + 1) == imageitem.assets_id) {
                assets_Image.push({
                  AssetsDocumentId: imageindex,
                  Assets_Id: imageitem.assets_id,
                  Image: JSON.parse(imageitem.imgValue),
                  NicNumber: item.user_cnic,
                  assets_tag: underitem.assetTagName.value,
                  Unique_Code: "4813_16" + Math.random(),
                  ImageName: JSON.parse(imageitem.imgName),
                })
              }
            })
            // BigChangeMethode(item,assets_Image)
            if(underindex==parser.assestsInfo.length-1){
              console.log("docs==>", docs.length)
              console.log("docassets_Images==>", assets_Image.length)
              uploadingMultipleDocsImages(docs, docs.length, compositeKey, item, assets_Image, parser)
            }
          } else {
            if(underindex==parser.assestsInfo.length-1){
              console.log("docs==>", docs.length)
              console.log("docassets_Images==>", assets_Image.length)
              uploadingMultipleDocsImages(docs, docs.length, compositeKey, item, assets_Image, parser)
              }
            // BigChangeMethode(item,assets_Image)
          }
        }
      }).catch(() => { })
    });
    // if(assets_Image.length<=0){
    //   console.log("No Images Found")
    //   alert("No Images Found")
    //   setLoading
    //   return
    // }
    return console.log("wrokingg")
  }


  const uploadingMultipleDocsImages = async (allData, indexer, user_cnic, item, assets_Image, parser) => {

    sendTempCustomerDocsimages(allData[indexer - 1], user_cnic)
      .then((value) => {
        if (value == "Success") {
          imagesCounter++;

          setTitle("Uploading Docs.. \n" + imagesCounter + "/" + docs.length)

          let nextNumber = indexer - 1

          if (nextNumber > 0) {

            uploadingMultipleDocsImages(allData, nextNumber, user_cnic, item, assets_Image, parser)

          } else {
            if("CustomerCib" in item && item.CustomerCib!=null && item.CustomerCib.length > 0){
              var parserobject=item?.CustomerCib;
              var parserSave=JSON.parse(parserobject)
              item["CustomerCib"]=parserSave;
            }
            // console.log("chacking==>>", parser.loanInfo[0].approvedLoan)
            // parser.loanInfo[0].approvedLoan.value = Number(parser.loanInfo[0].approvedLoan.value) + Number(parser.loanInfo[0].numericalValue.value)
            // parser.loanInfo[0].approvedLoan.value = parser.loanInfo[0].approvedLoan.value.toString()
            // parser.loanInfo[0].approvedLoan.status = 1;
            // console.log("chacking amrat==>>",JSON.stringify(parser))
            let maker = item;
            maker["forms"] = parser;
     
      // return
            maker["ApplicationVersion"]=''+ApplicationVersion+"("+releaseDate+")"
              BigChangeMethode(maker, assets_Image, user_cnic, parser)
            }
        }

      })
      .catch((error) => { })
  }

  const uploadingMultipleAssetsImages = async (allDataa, indexerr, user_cnicc, Topitemm) => {
    sendTempCustomerAssetsImages(allDataa[indexerr - 1], user_cnicc)
      .then((value) => {
        if (value == "Success") {
          imagesCounter++;
          setTitle("Uploading Assets Docs.. \n" + imagesCounter + "/" + allDataa.length)

          let nextNumber = indexerr - 1

          if (nextNumber > 0) {

            uploadingMultipleAssetsImages(allDataa, nextNumber, user_cnicc, Topitemm)

          } else {
            setToast({
              type: "success",
              message: "Syncup successfully!",
            });
            deleteMechanism(Topitemm)

          }
        } else {
          setprogressVisible(false)
          Alert.alert("Error", "" + value)
        }

      })
      .catch((error) => {
        setprogressVisible(false)
        Alert.alert("Error", "" + error)
      })
  }
  const BigChangeMethode = (item, assets_Image, user_cnic, parser) => {
    setprogressVisible(true)
    setTitle("Syncing up..")
    // **************** BIG CHANGES START **************************
    let CustomerDataObject = [];
    CustomerDataObject.push(item)
    var sendingObject = {
      "CustomerId": item.id,
      "CustomerDataObject": CustomerDataObject,
      // "CustomerDocImages": docs,
      // "CustomerAssetsImages": assets_Image,
      "LoanOfficer": UserData?.userData?.user_id,
    }
    console.log("**********************sendingObject***************************")
    //  console.log("",JSON.stringify(sendingObject))
    console.log("**********************sendingObject***************************")
    sendObjectbyLoanOfficer(sendingObject, 0, user_cnic, StationReducer.station.stationId)
      .then(async (value) => {
        CustomerDataObject = [];
        // *******************************************************************WRITE FILE


        // const granted = await PermissionsAndroid.request(
        //   PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
        //   {
        //     title: 'Storage Permission',
        //     message: 'App needs access to memory to download the file ',
        //   },
        // );
        // if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        //   let get=await FingerModule.writeToFile(JSON.stringify(sendingObject),"SyncupbyLoanOfficer");
        //   console.log("--->write file",get);
        //   CustomerDataObject = [];

        //   // -----------------------------
        // } else {
        //   Alert.alert(
        //     'Permission Denied!',
        //     'You need to give storage permission to download the file',
        //   );
        //   CustomerDataObject = [];
        //   return;
        // }

        // **********************************************************************
        console.log("--->IN THE END", value);
        if (value === "Success") {
          var loanInfo = parser.loanInfo[0];

          if (assets_Image.length > 0 && loanInfo.loanType.value == "Live Stock") {
            imagesCounter = 0;
            uploadingMultipleAssetsImages(assets_Image, assets_Image.length, user_cnic, item)

          } else {
            setToast({
              type: "success",
              message: "Syncup successfully!",
            });
            deleteMechanism(item)
          }

        } else {

          setprogressVisible(false)

          setToast({
            type: "error",
            message: "" + value,
          });

        }


      })

      .catch((error) => {

      })
    // **************** BIG CHANGES END**************************
  }
  const deleteMechanism = (item) => {
    compositeKey = "";
    DeleteCustomerForms(item.id, item.user_cnic)


      .then((value) => {

        DeleteDocImages(item.user_cnic).then(() => {

          DeleteAssetsImages(item.user_cnic).then(() => {



            setToast({
              type: "success",
              message: "Successfully Delete",
            });
            let get2 = getForms;
            get2.splice(item, 1);
            setFroms(get2);
            setFromsOrignal(get2);
            fetchData()
            setTitle("Updating Tags..")
            setprogressVisible(true)
            CallforTags(StationReducer.station.stationId, setprogressVisible)
              .then((values) => {
                docs = [];

                setprogressVisible(false)

              })
          })
        })
      })
      .catch(() => {

      })
  }

  // **************************************************************************
  //============================ SYNCUP PROCESS ==============================END
  // **************************************************************************

  // ******************************************* SERACH
  const searchText = (e) => {

    let text = e.toLowerCase();
    let filteredName = getFormsOrignal.filter((item) => {
      if (item.user_name.toLowerCase().match(text)) {
        return item.user_name.toLowerCase().match(text);
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
      setFroms([...filteredName]);
    }

  };
  // *****************************************************

  // ***********************************  handle navigation
  const handleNavigation = (latitude, Longitudes) => {
    const location = `${latitude},${Longitudes}`
    const url = Platform.select({
      ios: `maps:${location}`,
      android: `geo:${location}?center=${location}&q=${location}&z=16`,
    });
    Linking.openURL(url);
  }
  // ************************************

  const GettingData = async (item, index) => {
    getCustomerFromsOnly(item.user_cnic).then((value) => {
      var parser = JSON.parse(value[0].forms)
      Syncup(parser, item, index)
    });
  }

  const removeChip = (index) => {
    setFroms([])
    setSearchData([])
    setLoading(true)
    fetchData()
  }

  const renderItem = ({ item, index }) => (
    <CustomerRecorditems item={item}
      UserData={UserData}
      onPressIn={() => {
        if (StationReducer.station == "") {

          Alert.alert(
            "Process Stop!", "Please Syncdown first.",
            [

              { text: "OK", onPress: () => console.log("OK Pressed") }
            ],
            { cancelable: false }
          );
          return
        }
        // Alert.alert("Await!", "Do you really want to Syncup ?",  OTP SYNC UP CODE
        //   [{ 
        //     text: "Yes", 
        //     onPress:  async () => {
        //       try {
        //         await oTpSyncUp(item.user_cnic, item.mobilenumber);
        //         props.navigation.navigate('OTPScreen', { item, index });
        //       } catch (error) {
        //         console.error("Error occurred while syncing up:", error);
        //       }
        //     },
        //   },
        //     { text: 'No' },
        //   ]
        // );
        Alert.alert("Await!", "Do you really want to Syncup?",
        [{ text: "Yes", onPress: () => GettingData(item, index) }, { text: 'No' }])
      }}
      onPresscomment={() => props.navigation.navigate('Comments', { item: JSON.parse(item.Comments), id: item.id })}
      onPress={
        async () => {
          if (SyncdownReducer.syncDown == "") {

            Alert.alert(
              "Process Stop!", "Please Syncdown first.",
              [

                { text: "OK", onPress: () => console.log("OK Pressed") }
              ],
              { cancelable: false }
            );
            return
          }
          // getSelectedCustomerFrom(item.user_cnic)
          // return

          Alert.alert("Await!", "Do you really want to update ?",
            [{
              text: "Yes", onPress: () => {

                getCustomerFromsAndAnswers(item.user_cnic).then((value) => {
                  var parser = JSON.parse(value[0].forms)
                  
                  const customerAnswer = value[0].CustomerAnswers
                  console.log("--->", customerAnswer.length)
                  // return
                  if(customerAnswer.length>0){
                  
                    props.Updatecheck({ value: true, id: item.id,customerAnswer:true })
                    props.navigation.navigate('AddForm', { item: parser, user_cnic: item.user_cnic })
                  }else{
                   
                    props.Updatecheck({ value: true, id: item.id,customerAnswer:false })
                    
                    props.navigation.navigate('HalafNama', { item: parser, user_cnic: item.user_cnic })
                  }
                  
                  //
    
                });
              }
            }, { text: 'No' }])

        }
      }
      onPressNavigation={() => {
        handleNavigation(item.Latitude, item.Longitudes)
        // console.log("here")
      }}
      getCibPress = {() => getCibReport(item.user_cnic)}

      getCreditScoringReport = {() => getCreditScoringReport(item.user_cnic )}
      onPressView={
        async() => {
          getCustomerView(item.user_cnic)
        }
      }

    />
  );
   const getCreditScoringReport = (userCnic  ) => {

     CustomerCreditScoringReport(userCnic).then((res) => {                   
      if (res.StatusCode == 201) {
          navigation.navigate('CreditScoringReport', { res });    
      } else {
          setToast({
              type: "error",
              message: 'New Customer!',
          });
      }


  })

  }

  const getCibReport = (userCnic) => {

 
    
    gettingCibReport(userCnic, hasCibData).then((value) => {
      
      // console.log("Hit Here--->", value)
      if("CustomerCib" in value[0] && value[0].CustomerCib != null && value[0].CustomerCib.length>0){
        
        var parser=JSON.parse(value[0]?.CustomerCib)

         var message=parser.Message;
         if(message.search(/CIB/)<0){
       
            if(parser?.CreditReport!=undefined){
            
              setCibReportResponse(undefined)
              setCibReportResponse({...parser})

              setReportName("CIR")
              setModalVisible(true)
             //console.log(parser)
             
            }else{
              
              Alert.alert("Stop!","CIR Not Found..")
    
            }
         }else{
          //console.log(message.substr(0,3));
          if(parser?.CreditReport!=undefined){
            
            setCibReportResponse(undefined)
            setCibReportResponse({...parser})
            
            setReportName("CIB")
            setModalVisible(true)
             //console.log(parser)
             
          }else{
            Alert.alert("Stop!","CIB Not Found..")
  
          }
         }
             return
         
       }else{
         Alert.alert("Stop!","Report Not Found..")
       }
        // console.log("--->", parser?.CreditReport?.)
       

       
        
      })

  }
  
  const getCustomerView = (userCnic) =>{
    getCustomer(userCnic).then((res)=>{
      console.log('rabshaa',res)
      if("forms" in res[0] && res[0].forms != null && res[0].forms.length>0){
        var parser=JSON.parse(res[0]?.forms)
        console.log("parser========>",JSON.stringify(parser))

        setCustomeerViewResponse({...parser})
        setCustomerModalVisible(true)

      }else{
        setToast({
          type: "error",
          message: "Customer Data Error",
        });
      }


    }).catch((error)=>{
      console.log(error)
    })
  }

  return (
    <SafeAreaView style={styles.safeview}>
      <AppStatusBar></AppStatusBar>
      <Header Theme={""}
      ></Header>
      <View>  


        <Search
          Theme={""}
          filterData={container}
          setFilterData={setContainer}
          setSearchData={setSearchData}
          onChangeText={(e) => searchText(e)}
          Data={getForms}
          setData={setFroms}
          variable={1}
          setNoData={setNoData}
          setLoading={setLoading}
          text={'Search Customer by name..'}
        />
        <DateChips clearFilter={removeChip} searchData={searchData} />
        {loading && <ActivityIndicator style={{ marginTop: 30 }} color={Colors.parrotGreenColor} />}
        {noData && <Nodata></Nodata>}

        {getCustomerFroms != null && <SwipeListView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 300 }}
          style={{ marginTop: 20, marginLeft: 20, marginRight: 20 }}
          data={getForms}
          keyboardShouldPersistTaps="handled"
          keyExtractor={(item, index) => index.toString()}
          renderItem={renderItem}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={() => fetchData()}
              colors={[Colors.kulfa]}
            />
          }
          renderHiddenItem={(item, index) => (
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                marginRight: 0,
                marginTop: 20,

              }}
            >
              <View style={{ flex: 1 }}></View>
              <View style={{ }}>
                <TouchableOpacity
                  onPress={() => {
                    Alert.alert(
                      "Delete!",
                      "Do you really want to delete?",
                      [
                        {
                          text: "Cancel",
                          onPress: () => console.log("Cancel Pressed"),
                          style: "cancel"
                        },
                        {
                          text: "OK", onPress: () => {
                            setprogressVisible(true)
                            setTitle("Deleting...")
                            DeleteCustomerForms(item.item.id, item.item.user_cnic)
                              .then((value) => {
                                DeleteDocImages(item.item.user_cnic).then(() => {
                                  DeleteAssetsImages(item.item.user_cnic).then(() => {
                                    setprogressVisible(false)
                                    setTitle("Syncing up..")
                                    setToast({
                                      type: "success",
                                      message: "Successfully Delete",
                                    });
                                    let get2 = getForms;
                                    get2.splice(index, 1);
                                    setFroms(get2);
                                    setFromsOrignal(get2);
                                    fetchData()
                                  })
                                })
                              })
                              .catch(() => {

                              })
                            // let get = allDataobj;
                            // get.assestsInfo[item.index].activeTab = false;
                            // setAlldataobj({...get});



                          }
                        }
                      ]
                    );

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
        />}
      </View>

      <CustomProgressDialoge
        dialogVisible={progressVisible}
        setDialogVisible={setprogressVisible}
        title={title}
      />
      <Toast {...toast} onDismiss={() => setToast({ message: "", type: "" })} />

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
              <CirView reportDetail={cibReportResponse} />
              
            }
            </ScrollView>
            </View>
{/* 


        {/* </View> */}




      </Modal>

      <Modal
        animationType={'fade'}
        //transparent={true}
        visible={customerModalVisible}
        onRequestClose={() => {
          setCustomerModalVisible(false);
          //console.log('Modal has been closed.');
        }}>
        {/* <View style={{flex:1}}> */}
        
          <Pressable style={{alignItems:'flex-end', padding:20}}
          onPress={()=>setCustomerModalVisible(false)}
          >
             <EvilIcons name={'close'} size={30} color={'red'} />
          </Pressable>

          <View style={{paddingTop:30, flex:1 }}>
            <ScrollView>
            
           
              <CustomerViews customertDetails={CustomeerView} />
         
            </ScrollView>
            </View>
{/* 


        {/* </View> */}




      </Modal>

    </SafeAreaView>
  );
}
const mapDispatchToProps = (dispatch) => {
  return {
    Updatecheck: (Data) => {
      dispatch({
        type: 'SET_UPDATECHECK',
        payload: Data
      });
    },

  };
};
export default connect(null, mapDispatchToProps)(Customer);

const styles = StyleSheet.create({
  safeview: {
    flex: 1,
  },
  card: {
    marginTop: 10, marginLeft: 30, marginRight: 30, paddingLeft: 10
  },
  row: { flexDirection: "row", alignItems: 'center' },
  circle: {
    height: 30, width: 30, borderRadius: 100, marginLeft: 0, marginRight: 10,
    justifyContent: 'center', backgroundColor: '#f1f1f1'
  },
  modal:{

  }
})

