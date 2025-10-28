

import React, { useEffect, useState } from 'react';
import type { Node } from 'react';
import {
  SafeAreaView,
  ScrollView,
  PermissionsAndroid,
  Alert,
  Linking,
  StyleSheet,
  ActivityIndicator,
  Modal,
  Dimensions,
  Platform,
  TextInput,
  View,
  TouchableOpacity,
  RefreshControl,
  NativeModules,
  Pressable,
  Button,
  Text
  
} from 'react-native';
const { FingerModule } = NativeModules;
import RNFS from 'react-native-fs';
import moment from 'moment';
import { AppStatusBar, CustomerRecorditems, CustomProgressDialoge, Header, Nodata, Search, TextView } from '../../components';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Entypo from 'react-native-vector-icons/Entypo';
import LottieView from 'lottie-react-native';
import { useNavigation } from '@react-navigation/native';
import { SwipeListView, SwipeRow } from "react-native-swipe-list-view";
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { connect, useSelector } from 'react-redux';
import { ProgressDialog } from 'react-native-simple-dialogs';
import { checkingCustomerByCnic, DeleteAssetsImages, DeleteCustomerForms, DeleteDocImages, getAssetsDocuments, getAssetsDocumentsforSyncup, getCustomerFroms, getCustomerFromsForBM, getCustomerFromsForLoanVerfiy, getCustomerFromsOnly, getLoanDocuments, gettingCibReport, insertCustomerFromData, insertCustomerFromDatawithPromise, insertMultipleAssetsImages, insertMultipleDocumentsImages ,getCustomer} from '../../sqlite/sqlitedb';
import { Colors, GlobalStyles } from '../../theme';
import EvilIcons from 'react-native-vector-icons/EvilIcons'

var { height, width } = Dimensions.get('window');
import { useDispatch } from "react-redux";
import { CallforTags, CheckingTags, deleteLoanOfficerdata, getObjectbyBranchManager, sendObjectbyBM, sendTempCustomerAssetsImagesbyBm, updateTempCustomerDocsimagesbyBm, uploadingAssetsImage, RejectuploadingCustomerdata,uploadingCustomerdata, uploadingDocs, VerifyUser, checkApplicationVersion ,CustomerCreditScoringReport } from '../../apis_auth/apis';
import Toast from '../../components/Toast';
import DateChips from '../../components/DateChips';
import CustomerAnswer from './CustomerAnswer';
import { color } from 'react-native-elements/dist/helpers';
import { ApplicationVersion, releaseDate } from '../../utilis/ContsValues';
import CIBView from '../../components/CIBView';
import CirView from '../../components/CirView';
import CustomerViews from '../../components/CustomerViews';
import RejectCommentModal from '../../components/RejectCommentModal';

const LoanVerficationSyncupandSyncdown: () => Node = (props) => {

  let docs = [];

  const [getForms, setFroms] = useState(null)
  const [getFormsOrignal, setFromsOrignal] = useState(null)

  const [noData, setNoData] = useState(false)
  const [modalVisible, setModalVisible] = useState(false);

  const [dialogeCount, setDialogeCount] = useState("Syncing up")

  const StationReducer = useSelector((state) => state.StationReducer);

  const [hasCibData, setHasCibData] = useState(true);

  const [getReportName, setReportName] = useState(null);

  const [progressVisible, setprogressVisible] = useState(false)

  const [cibReportResponse, setCibReportResponse] = useState(undefined);

  const [loading, setLoading] = useState(true)

  const [title, setTitle] = useState("Syncing up..");

  const [toast, setToast] = React.useState({ value: "", type: "" });

  const [refreshing, setRefreshing] = useState(false);

  const dispatch = useDispatch();
  const navigation = useNavigation();

  const [searchData, setSearchData] = React.useState([])

  const [customerModalVisible, setCustomerModalVisible] = useState(false);
  const [CustomeerView, setCustomeerViewResponse] = useState(undefined);

  // my code
  const [commentReject, setCommentRecject] = useState('');
  const [modalVisiblereject, setModalVisibleReject] = useState(false);
  const handleOpenModal = () => {
    setModalVisibleReject(true);
  };


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

  var imagesCounter = 0;
  React.useEffect(async () => {

    setUserData(getUserData);


  }, []);

  useEffect(() => {

    const unsubscribe = props.navigation.addListener("focus", async () => {

      fetchData();

    });
  }, [])



  const fetchData = () => {

    if (getUserData.UserData.EmployeeTypeName == "Branch Manager") {
      getCustomerFromsForBM(setFroms, setFromsOrignal, setNoData, setLoading);

    } else {
      getCustomerFromsForLoanVerfiy(setFroms, setFromsOrignal, setNoData, setLoading);

    }



  }
  // **************************************************************************
  //============================ SYNCUP PROCESS FOR BM IN MIS==============================START
  // **************************************************************************
  const Syncup = (parser, item, index) => {

    // var parser = JSON.parse(item.forms)
    console.log("parserrrr",JSON.stringify(parser))
    var loanInfo = parser.loanInfo[0];

    var assestsInfo = parser.assestsInfo[0];

    var guarantorInfo = parser.guarantorInfo[0];
    var customer = parser.customerInfo[0];


    console.log("--->LOanOfficerSyncup find", JSON.stringify(loanInfo.loanType))

    if (loanInfo.loanType == undefined) {
      setprogressVisible(false)
      setToast({

        type: "error",

        message: "Please fill loan information first!",

      });
      return
    }

    if (assestsInfo.assetName.value == "") {
      setprogressVisible(false)
      setToast({

        type: "error",

        message: "Please fill assets information first!",

      });
      return
    }
    if (customer.evrisys_customerImage == undefined) {
      setprogressVisible(false)
      setToast({

        type: "error",

        message: "Please upload E-Vrisys  image first!",

      });
      return
    }
    if (loanInfo.customerLoan_type.value != "Normal" && guarantorInfo == undefined) {
      setprogressVisible(false)
      setToast({

        type: "error",

        message: "Please fill Gurantor information first. Because you have selected loan type as " + loanInfo.customerLoan_type.value,

      });
      return
    }
    var Commentsparser = JSON.parse(item.Comments)

    if (Commentsparser) {

      if (getUserData.UserData.EmployeeTypeName == "Verification Officer" && Commentsparser.verificationComments.value == "") {
        setprogressVisible(false)
        setToast({

          type: "error",

          message: "Please fill Verification Officer Comments first!",

        });
        return
      }

    } else {
      setprogressVisible(false)
      setToast({

        type: "error",

        message: "Please insert comments first!",

      });

      return

    }
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
    //////////////////////////////////////////////////////////////////////////////
    //Send array of tags for checking already exist or not ...(CheckingTags)
    /////////////////////////////////////////////////////////////////////
    setTitle("Checking Tags..")
    setprogressVisible(true)

    CheckingTags(make, setprogressVisible).then((value) => {

      console.log("CheckingTags" + value)

      if (value.length > 0) {

        setToast({

          type: "error",

          message: "" + value,

        });
        setTitle("Updating Tags..")
        setprogressVisible(true)
        CallforTags(StationReducer.station.stationId, setprogressVisible)
          .then((values) => {
            setprogressVisible(false)

          })
      } else {
        setTitle("Uploading Documents..")

        //////////////////////////////////////////////////////////////////////////////
        //Gettings Docs of loan
        /////////////////////////////////////////////////////////////////////
      //  console.log("===>item.user_cnic", JSON.stringify(item.user_cnic))

        let docs = [];

        getLoanDocuments(item.user_cnic).then((value) => {
     
          if (value) {

            if (value.length > 0) {

              value.map((underitem, underindex) => {

                docs.push({
                  CustomerId: item.id,
                  DocumentId: underindex,
                  Image: underitem.imgValue,
                  AddedByDesignation: "addedBy" in underitem ? underitem.addedBy : "",
                  LoanId: index,
                  NicNumber: item.user_cnic,
                  UniqueCode: "4813_16" + Math.random(),
                  ImageName: underitem.imgName.value,
                 // addedDateTime: moment(new Date()).format('YYYY-MM-DD'),
                 DocumentAddedDateTime: moment(new Date()).format('YYYY-MM-DD')

                })
              })
              //////////////////////////////////////////////////////////////////////////////
              //(Uploading docs) (recursivecountDocsuploading)
              /////////////////////////////////////////////////////////////////////
              // GettingCustomerData(item,index)
              // console.log("==============================> LOGS ==============>")
              // console.log(docs);
              console.log(docs.length);

              // console.log("==============================> LOGS ==============>")
//my code
              imagesCounter = 1;
              setTitle("Uploading Docs..\n" + imagesCounter + "/" + docs.length + "")
              recursivecountDocsuploading(docs, docs.length, item, index, parser)
            } else {

              setToast({

                type: "error",

                message: "Sorry! Documents not found.",
              });
            }
          }
        }).catch((error) => {

          console.log("catch works", JSON.stringify(error))

        })




      }

    }).catch((error) => {

      console.log(error)

      setToast({
        type: "error",
        message: "" + error,
      });

      setDialogeCount("Syncing up")
    })
  }
  
  //////////////////////////////////////////////////////////////////////////////
  //Recursive function for uploading form Docs images...
  /////////////////////////////////////////////////////////////////////
  const recursivecountDocsuploading = async (docs, docsIndx, topItem, topindex, parser) => {
    // setDialogeCount("Documents Uploading " + docsIndx)

    uploadingDocs(docs[docsIndx - 1], imagesCounter, setprogressVisible)


      .then((value) => {
        var coverter = JSON.parse(value)
        if (coverter === "Success") {
          imagesCounter++;
          setTitle("Uploading Docs.. \n" + imagesCounter + "/" + docs.length)
          console.log("--response" + value)

          let nextNumber = docsIndx - 1;

          if (nextNumber > 0) {
            recursivecountDocsuploading(docs, nextNumber, topItem, topindex, parser);
          } else {
            // setToast({
            //   type: "success",
            //   message: "You can continue",
            // });
            setTitle("Syncing up")

            GettingCustomerData(topItem, topindex, parser);
            // alert("Successfull Delete Gurantor")
            // props.navigation.goBack();
          }
        } else {
          setprogressVisible(false)
          Alert.alert("Stop!", JSON.stringify(value))
        }
      })
      .catch((error) => {
        setprogressVisible(false)
        Alert.alert("Stop!", JSON.stringify(error))
      });

  };

  const RejectrecursivecountDocsuploading = async (docs, docsIndx, topItem, topindex, parser) => {
    // setDialogeCount("Documents Uploading " + docsIndx)
   

    uploadingDocs(docs[docsIndx - 1], imagesCounter, setprogressVisible)


      .then((value) => {
        var coverter = JSON.parse(value)
        if (coverter === "Success") {
          imagesCounter++;
          setTitle("Uploading Docs for Rejection\n" + imagesCounter + "/" + docs.length)
          console.log("--response" + value)

          let nextNumber = docsIndx - 1;

          if (nextNumber > 0) {
            RejectrecursivecountDocsuploading(docs, nextNumber, topItem, topindex, parser);
          } else {
            // setToast({
            //   type: "success",
            //   message: "You can continue",
            // });
            setTitle("Rejecting Case")
            

            rejectGettingCustomerData(topItem, topindex, parser);
            // alert("Successfull Delete Gurantor")
            // props.navigation.goBack();
          }
        } else {
          setprogressVisible(false)
          Alert.alert("Stop!", JSON.stringify(value))
        }
      })
      .catch((error) => {
        setprogressVisible(false)
        Alert.alert("Stop!", JSON.stringify(error))
      });

  };

  //////////////////////////////////////////////////////////////////////////////
  //Recursive function for uploading form Assets images...
  /////////////////////////////////////////////////////////////////////
  const recursivecountAssetsuploading = async (docs, docsIndx, topItem, topindex) => {
    // setDialogeCount("Documents Uploading " + docsIndx)
    uploadingAssetsImage(docs[docsIndx - 1], docsIndx, setprogressVisible)

      .then((value) => {
        imagesCounter++;
        setTitle("Uploading Assets.. \n" + imagesCounter + "/" + docs.length)
        // console.log("--response" + value)

        let nextNumber = docsIndx - 1;

        if (nextNumber > 0) {

          recursivecountAssetsuploading(docs, nextNumber, topItem, topindex);

        } else {
          setToast({
            type: "success",
            message: "Syncup successfully!",
          });

          DeleteCustomerForms(topItem.id, topItem.user_cnic)


            .then((value) => {

              DeleteDocImages(topItem.user_cnic).then(() => {

                DeleteAssetsImages(topItem.user_cnic).then(() => {

                  setprogressVisible(false)

                  setTitle("Syncing up..")

                  setToast({
                    type: "success",
                    message: "Successfully Delete",
                  });
                  let get2 = getForms;
                  get2.splice(topindex, 1);
                  setFroms(get2);
                  setFromsOrignal(get2);
                  fetchData()
                  setTitle("Updating Tags..")
                  setprogressVisible(true)
                  CallforTags(StationReducer.station.stationId, setprogressVisible)
                    .then((values) => {
                      deleteLoanOfficerdata(topItem.CompositeKey).then(() => {
                        setprogressVisible(false)
                      }).catch((error) => {
                        setprogressVisible(false)
                        console.warn("error in delete loan officer data", error);
                        console.log("error in delete loan officer data", error);


                      })


                    })
                })
              })
            })
            .catch(() => {

            })
          // DeleteCustomerForms(topItem.id)
          // let get2 = getForms;
          // get2.splice(topindex, 1);
          // setFroms([...get2]);
          // fetchData()

          // setDialogeCount("Syncing up")

          // alert("Successfull Delete Gurantor")
          // props.navigation.goBack();
        }
      })
      .catch((error) => { });

  };
  //////////////////////////////////////////////////////////////////////////////
  //Getting Data of Customer...
  /////////////////////////////////////////////////////////////////////
  const GettingCustomerData = async (item, index, parser) => {

    var converter = item.CustomerAnswers
    var parser2 = JSON.parse(converter)
    var CustomerAns = parser2.answerArray
    var Commentsparser = JSON.parse(item.Comments)

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
          if (value.length > 0) {
            value.map((imageitem, imageindex) => {
              if ((underindex + 1) == imageitem.assets_id) {
                assets_Image.push({
                  AssetsDocumentId: imageindex,
                  Assets_Id: imageitem.assets_id,
                  Image: JSON.parse(imageitem.imgValue),
                  NicNumber: item.user_cnic,
                  assets_tag: underitem.assetTagName.value,
                  Unique_Code: "4813_16" + Math.random(),
                  ImageName: imageitem.imgName.value,
                  
                })
              }
            })
          }
        }
      }).catch(() => { })

    });
    var customerInfo = parser.customerInfo[0];
    //////////////////////////////////////////////////////////////////////////////
    //console.log("Getting customer form vlaues...")
    /////////////////////////////////////////////////////////////////////
    // console.log("customerInfo.evrisys_customerImage",customerInfo.evrisys_customerImage)
    var customer = {
      Transfer_Type: customerInfo?.transferType || '', 
      Account_Number: customerInfo?.accountNumber?.value || '',
      Account_Type: customerInfo?.accountType?.value || '',
      Account_Title: customerInfo?.accountTitle?.value || '',
      Bank_Name: customerInfo?.bankName?.value || '',
      Branch_Name: customerInfo?.branchName?.value || '',
      Bank_Code: customerInfo?.bankCode?.value || '',


      Address_Permanent_Address: customerInfo.customer_per_address.value,
      Address_Permanent_City: customerInfo.customer_per_city.value,
      Address_Permanent_Country: customerInfo.customer_per_country.value,
      Address_Permanent_District_Name: customerInfo.customer_per_district.value,
      Address_Permanent_Mohalla_Village: customerInfo.customer_per_mohalla.value,
      Address_Permanent_Taluka_Name: customerInfo.customer_per_taluka.value,
      Address_Permanent_UC_Name: customerInfo.customer_per_uc.value,
      Address_Permanent_State: customerInfo.customer_per_stateProvince.value,

      Address_Present_Address: customerInfo.customer_pre_address.value,
      Address_Present_City: customerInfo.customer_pre_city.value,
      Address_Present_Country: customerInfo.customer_pre_country.value,
      Address_Present_District_Name: customerInfo.customer_pre_district.value,
      Address_Present_Mohalla_Village: customerInfo.customer_pre_mohalla.value,
      Address_Present_NumberOfYears: customerInfo.numberOfyear.value,
      Address_Present_State: customerInfo.customer_pre_stateProvince.value,
      Address_Present_Taluka_Name: customerInfo.customer_pre_taluka.value,
      Address_Present_UC_Name: customerInfo.customer_pre_uc.value,

      BMUndertaking: 1,
      ClientDisease: customerInfo.customer_disease == undefined ? 0 : customerInfo.customer_disease.index,
      CommentImageStr: Commentsparser.groupImage,
      CommentImageTemp: Commentsparser.groupImage,

      JobSalaryCardImage: customerInfo.customer_jobCard == undefined ? "" : customerInfo.customer_jobCard,
      E_VerisysVerficationImage: customerInfo.evrisys_customerImage == undefined ? "" : customerInfo.evrisys_customerImage,
      IsEmployed: customerInfo.customer_isEmployeed ? 1 : 0,

      CustomerAddedBy: Commentsparser.addedBy.value,
      CustomerAddedByComment: Commentsparser.commentOfAddedby.value,
      CustomerAddedByDesignation: Commentsparser.addedByDesignation.value,
      CustomerId: item.id,
      CustomerType: customerInfo.customer_userType == undefined ? 0 : customerInfo.customer_userType.index,
      CustomerVerifiedBy: Commentsparser.verifiedBy.value,
      CustomerVerifiedByComment: Commentsparser.commentsofVerifiedby.value,
      CustomerVerifiedByDesignation: Commentsparser.verifiedByDesignation.value,
      DateOfBirth: customerInfo.customer_dob,
      DiseaseValue: customerInfo.customer_disease == undefined ? 0 : customerInfo.customer_disease.index,
      Education: customerInfo.customer_education == undefined ? 0 : customerInfo.customer_education.index,
      FPImageStr: customerInfo.customer_biomatric == undefined ? "" : customerInfo.customer_biomatric.imageValue,
      FPImageTemp: customerInfo.customer_biomatric == undefined ? "" : customerInfo.customer_biomatric.imageTemp,
      FamilyNumber: customerInfo.FamilyNumber.value,
      FirstName: customerInfo.customer_name.value,
      Gender: customerInfo.customer_gender == "Male" ? "M" : customerInfo.customer_gender == "Female" ? "F" : "T",
      Guardian: customerInfo.customer_guardianceOfName.value,
      GuardianNICNumber: customerInfo.customer_guardianceCnic.value,
      GuardianType: customerInfo.customer_guardianceOf == undefined ? 0 : customerInfo.customer_guardianceOf == "S/O" ? 0 : customerInfo.customer_guardianceOf == "D/O" ? 1 : customerInfo.customer_guardianceOf == "W/O" ? 2 : 0,
      HouseStatus: customerInfo.customer_houseStatus == undefined ? 0 : customerInfo.customer_houseStatus.index,
      HouseType: customerInfo.customer_houseType == undefined ? 0 : customerInfo.customer_houseType.index,
      IsActivated: false,
      IsDeceased: "0",
      IsDisabled: customerInfo.customer_disable == undefined ? 0 : customerInfo.customer_disable ? 1 : 0,
      LastName: customerInfo.customer_surname.value,
      MaritalStatus: customerInfo.customer_maritialStatus == undefined ? 0 : customerInfo.customer_maritialStatus == "Single" ? 0 : customerInfo.customer_maritialStatus == "Married" ? 1 : customerInfo.customer_maritialStatus == "Divorced" ? 2 : 3,
      MobileNumber: customerInfo.customer_mobileNumber.value,
      MotherName: customerInfo.customer_motherName.value,
      NICExpiryDate: '' + customerInfo.customer_cnicExpireDate,
      NICIssueDate: '' + customerInfo.customer_cnicissueDate,
      NICNumber: item.user_cnic,
      NICType: "null",
      NextOfKinCNIC: customerInfo.customer_nextKinCnic.value,
      // NextOfKinnRelation: customerInfo.customer_nextKinRelation == undefined ? customerInfo.customer_nextKinOtherRelation == undefined ? 0 : customerInfo.customer_nextKinOtherRelation.value : customerInfo.customer_nextKinRelation.index,
      NextOfKinnRelation: customerInfo.customer_nextKinRelation == undefined ? 0 : Number(customerInfo.customer_nextKinRelation.index + 1),
      NumberOfChildren: 0,
      NumberOfSchoolGoingChildren: 0,
      ProfileImageStr: customerInfo.customer_img == undefined ? "" : customerInfo.customer_img,
      ProfileImageTemp: customerInfo.customer_img == undefined ? "" : customerInfo.customer_img,
      RSKRiskProfile: 0,
      Religion: customerInfo.customer_religion == undefined ? 0 : customerInfo.customer_religion.index,
      SupportingPersonFPImageStr: customerInfo.customer_supportingPerson_fingerprint == undefined ? "" : customerInfo.customer_supportingPerson_fingerprint.imageValue,
      SupportingPersonFPImageTemp: customerInfo.customer_supportingPerson_fingerprint == undefined ? "" : customerInfo.customer_supportingPerson_fingerprint.imageTemp,
      SupportingPersonCnic: customerInfo.customer_supportingPerson_cnic.value,
      SupportingPersonName: customerInfo.customer_supportingPerson_name.value,
      SupportingPersonRelation: customerInfo.customer_supportingPerson_relation.value,
      TestValue: customerInfo.customer_labourtytestintwoyear == undefined ? "0" : customerInfo.customer_labourtytestintwoyear.index,
      TokenNumber: "",
      bispValue: customerInfo.customer_bispBeneficary == undefined ? 0 : customerInfo.customer_bispBeneficary.index,
      clientCurrentStatus: customerInfo.customer_physicalHealth == undefined ? 0 : customerInfo.customer_physicalHealth.index,
      clientHealthTests: customerInfo.customer_health.value,
      customerGPSLocation: customerInfo.customer_location == undefined ? "25.394759, 68.3312667" : customerInfo.customer_location,
      groupReceivedFromAPK: "R_SAFCO APK",
      nextOfKinName: customerInfo.customer_nextKinName.value,
      regionName: '' + customerInfo.customer_region == undefined ? "region" : customerInfo.customer_region,
      stationId: parser?.StationId,
      stationName: parser?.StationName,
      status: 0,
      syncStatus: 0,
    }


    //////////////////////////////////////////////////////////////////////////////
    //console.log("Getting HALFNAME form vlaues...")
    /////////////////////////////////////////////////////////////////////
    var customerAnswers = [{
      CustomerId: item.id,
      NICNumber: item.user_cnic,
      customerQ10Answer: CustomerAns[9].value,
      customerQ11Answer: CustomerAns[10].value,
      customerQ12Answer: CustomerAns[11].value,
      customerQ13Answer: CustomerAns[12].value,
      customerQ14Answer: CustomerAns[13].value,
      customerQ15Answer: CustomerAns[14].value,
      customerQ16Answer: CustomerAns[15].value,
      customerQ17Answer: CustomerAns[16].value,
      customerQ18Answer: CustomerAns[17].value,
      customerQ19Answer: CustomerAns[18].value,
      customerQ1Answer: CustomerAns[0].value,
      customerQ2Answer: CustomerAns[1].value,
      customerQ3Answer: CustomerAns[2].value,
      customerQ4Answer: CustomerAns[3].value,
      customerQ5Answer: CustomerAns[4].value,
      customerQ6Answer: CustomerAns[5].value,
      customerQ7Answer: CustomerAns[6].value,
      customerQ8Answer: CustomerAns[7].value,
      customerQ9Answer: CustomerAns[8].value,
    }];
    //////////////////////////////////////////////////////////////////////////////
    //console.log("Getting customerBMChecklistAnswers form vlaues...")
    /////////////////////////////////////////////////////////////////////
    var customerBMChecklistAnswers = [{
      CustomerId: item.id,
      appraisalPlaceValue: Commentsparser.socialAppraisal.index,
      borrowerVisitValue: Commentsparser.visitedBorrower.index,//1
      cusActionPlan1: Commentsparser.riskAssementno1.value,//""
      cusActionPlan2: Commentsparser.riskAssementno2.value,//""
      cusActionPlan3: Commentsparser.riskAssementno3.value,//""
      cusAddress: Commentsparser.borrowerAddress.value,//""
      cusBMChecklistAns1: Commentsparser.counductPhysicalVisit.value,//0,
      cusBMChecklistAns10: Commentsparser.socialandManagmentPolicy.value,//0,
      cusBMChecklistAns11: Commentsparser.verifiedCIBPolicy.value,//0,
      cusBMChecklistAns12: Commentsparser.doesBorrowerEnivro.value,//0,
      cusBMChecklistAns13: Commentsparser.doesEnterprise.value,//0,

      cusBMChecklistAns15: "borrowerCashFlow" in Commentsparser ? Commentsparser.borrowerCashFlow.value : 1,
      cusBMChecklistAns16: "supportingCnicForFemale" in Commentsparser ? Commentsparser.supportingCnicForFemale.value : 1,
      cusBMChecklistAns17: "borrowerRepaymentCapacity" in Commentsparser ? Commentsparser.borrowerRepaymentCapacity.value : 1,
      cusBMChecklistAns18: "borrowerBusinessORHome" in Commentsparser ? Commentsparser.borrowerBusinessORHome.value : 1,
      cusBMChecklistAns19: "repaymentCapacityAnalysis" in Commentsparser ? Commentsparser.repaymentCapacityAnalysis.value : 1,
      cusBMChecklistAns20: "isTheLoanPricingIsClearlyDisclosed" in Commentsparser ? Commentsparser.isTheLoanPricingIsClearlyDisclosed.value : 1,
      cusBMChecklistAns21: "isTheBorrowerInformedAboutTheGrievance" in Commentsparser ? Commentsparser.isTheBorrowerInformedAboutTheGrievance.value : 1,
      cusBMChecklistAns22: "isTheBorrowerAwareAboutTheCollateral" in Commentsparser ? Commentsparser.isTheBorrowerAwareAboutTheCollateral.value : 1,
      cusBMChecklistAns23: "anyMajorRisksInvolvedInBusiness" in Commentsparser ? Commentsparser.anyMajorRisksInvolvedInBusiness.value : 1,
      cusBMChecklistAns23Desc: "anyMajorRisksInvolvedInBusiness" in Commentsparser ? Commentsparser.anyMajorRisksInvolvedInBusiness.detail : null,
     
      cusBMChecklistAns2: Commentsparser.verifiedreApparisal.value,//0,
      cusBMChecklistAns3: Commentsparser.verifiedRepaymentHistory.value,//0,
      cusBMChecklistAns4: Commentsparser.criticalAssetsValuation.value,//0,
      cusBMChecklistAns5: Commentsparser.verifiedbyContactNumber.value,//0,
      cusBMChecklistAns6: Commentsparser.meetwithSocialResponsible.value,//0,
      cusBMChecklistAns7: Commentsparser.meetwithPersonalGuarantee.value,//0,
      cusBMChecklistAns8: Commentsparser.verifiedProvidedDoc.value,//0,
      cusBMChecklistAns9: Commentsparser.amlPolicyandProcedure.value,//0,
      cusContact: Commentsparser.borrowerPhone.value,//"22222222222",
      cusImplTimeline1: Commentsparser.riskAssementTimelineone.value,//0,
      cusImplTimeline2: Commentsparser.riskAssementTimelinetwo.value,//0,
      cusImplTimeline3: Commentsparser.riskAssementTimelinethree.value,//0,
      cusNICNumber: item.user_cnic,//"41355-8889990-0",
      cusName: Commentsparser.borrowerName.value,//"w",
      cusReason: Commentsparser.borrowerRemarks.value,//"56",
      decisionValue: Commentsparser.borrowerApproval.index,//2,
      remarksValue: Commentsparser.borrowerStaification.index,//
    }];
    //////////////////////////////////////////////////////////////////////////////
    //console.log("Getting familyMember form vlaues...")
    /////////////////////////////////////////////////////////////////////
    let familyMembers = []
    parser.familyMemberInfo.map((underitem, underindex) => {

      // console.log("======familyMembers======>")

      // console.log(""+underitem.familyMember_genderSelection==="Male"?"M":underitem.familyMember_genderSelection==="Female"?"F":"T")
       console.log("=====familyMembers=======>")




      familyMembers.push(
        {
          Age: '' + underitem.familyMember_age.value,
          BusinessAddress: '' + underitem.familyMember_businessAddress.value,
          CustomerFamilyMemberId: underindex,
          CustomerId: '' + item.id,
          Education: '' + underitem.familyMember_education.value,
          FullName: '' + underitem.familyMember_fullname.value,
          Gender: '' + underitem.familyMember_genderSelection == "Male" ? "M" : underitem.familyMember_genderSelection == "Female" ? "F" : "T",
          MonthlyEarning: '' + underitem.familyMember_montlyEarning.value,
          NICNumber: '' + underitem.familyMember_cnic.value,
          RelationshipWithCustomer: '' + underitem.familyMember_relation.value,
          SourceOfIncome: '' + underitem.familyMember_sourceIncome.value,
        }
      )
    });
    //////////////////////////////////////////////////////////////////////////////
    //console.log("Getting guaranteers form vlaues...")
    //////////////////////////////////////////////////////////////////////
    let guaranteers = [];
    parser.guarantorInfo.map((underitem, underindex) => {
      guaranteers.push(
        {
          Address: '' + underitem.guarantor_address.value,
          BusinessAddress: "" + underitem.guarantor_businessAddress.value,
          ContactNumber: "" + underitem.guarantor_contactno.value,
          CustomerGuaranteerId: '' + index,
          CustomerId: item.id,
          FullName: "" + underitem.guarantor_fullname.value,
          JobDescription: "" + underitem.guarantor_jobDescription.value,
          JobType: "" + underitem.guarantor_jobType.value,
          LoanId: '' + index,
          NICNumber: '' + underitem.guarantor_cnic.value,
          Notes: "" + underitem.guarantor_businessNote.value,
          Status: 1,
        }
      )
    });
    //////////////////////////////////////////////////////////////////////////////
    //console.log("Getting Loan form vlaues...")
    //////////////////////////////////////////////////////////////////////
    var loanInfo = parser.loanInfo[0];
    var Loan = {
      AmountRequiredForBusiness: loanInfo.amountRequiredforBusiness.value,
      AnyOtherExpense: loanInfo.anyOtherExpenses.value,
      AnyOtherRentalIncome: loanInfo.rentalIncome.value,
      ApprovedLoanAmount: loanInfo.approvedLoan.value,
      BorrowerRiskProfile: loanInfo.borrowerriskprofile == 1 ? 0 : loanInfo.borrowerriskprofile == 2 ? 0.5 : loanInfo.borrowerriskprofile == 3 && 1,
      EsmProductRisk: loanInfo.EsmProductRisk,
      EsmProductItemRisk : loanInfo.EsmProductItemRisk, 
      EsmProductRiskValue : loanInfo.EsmProductRiskValue,
      BusinessAddress: loanInfo.businessAddress.value,
      ChildrenEducationExpense: loanInfo.childrenExpense.value,
      CustomerProductRisk: loanInfo.customerandproductrisk == undefined ? 0 : loanInfo.customerandproductrisk.index,
      CustomerProductRiskRemarks: loanInfo.customerandProductriskRemarks.value,
      ExistingBusiness: loanInfo.businessName.value,
      ExpectedMonthlyIncomeFromBusiness: loanInfo.expectedMonthlyIncome.value,
      ExperienceInBusiness: loanInfo.experianceinBusiness.value,
      GeographicRisk: loanInfo.geographicrisk == undefined ? 0 : loanInfo.geographicrisk?.index,
      GeographicRiskRemarks: loanInfo.geographicriskRemarks.value,
      HouseholdExpense: loanInfo.monthlyHouseholdExpense.value,
      HouseholdLiability: loanInfo.householdLiability.value,
      Household_MonthlyExpense: loanInfo.monthlyHouseholdExpense.value,
      Household_MonthlyIncome: loanInfo.monthlyHouseholdIncome.value,
      Household_Savings: loanInfo.householdSavings.value,
      IncomeFromOtherExpense: loanInfo.incomefromOtherSource.value,
      IncomeFromSales: loanInfo.incomeFromSales.value,
      Liability: loanInfo.liability.value,
      LoanStatus: loanInfo.loanStatus == undefined ? "" : loanInfo.loanStatus.value,
      LoanSubType: loanInfo.loanSubType == undefined ? "" : loanInfo.loanSubType.value,
      LoanTerm: loanInfo.loanTerm.value,
      LoanTypeId: loanInfo.loanType == undefined ? 0 : loanInfo.loanType.value,
      LoanTypeValue: loanInfo.loanType == undefined ? 0 : loanInfo.loanType.index,
      LoanUtilizationRisk: loanInfo.loanUtilizationrisk == undefined ? 0 : loanInfo.loanUtilizationrisk.index,//""
      LoanUtilizationRiskRemarks: loanInfo.loanUtilizationriskRemarks.value,//''
      MonthlyExpense: loanInfo.monthlyExpenses.value,
      MonthlyIncome: loanInfo.monthlyIncome.value,
      MonthlyInstallmentFromLender: loanInfo.monthlyInstallment.value,//""
      NoOfEmployees: loanInfo.no_of_emploee.value,
      Notes: loanInfo.loanNote.value,
      OtherExpense: loanInfo.otherExpenses.value,
      OtherFamilyIncome: loanInfo.otherFamilyIncome.value,
      OtherMonthlyLiability: loanInfo.anyOtherMonthly.value,
      OtherUtilityExpense: loanInfo.utilityExpense.value,
      PEPRisk: loanInfo.peprisk == undefined ? 0 : loanInfo.peprisk.index,
      PEPRiskRemarks: loanInfo.pepriskRemakrs.value,
      PersonalCapitalInBusiness: loanInfo.personalCapitalinBusiness.value,
      ProcessingFeesStatus: "",
      RawMaterialPurchasing: loanInfo.rawMaterialpurchase.value,
      RentalOrAnyOtherIncome: loanInfo.rentalIncome.value,
      RepaymentFrequency: loanInfo.selectRepaymentFrequency == undefined ? "" : loanInfo.selectRepaymentFrequency?.index + 1,
      RequestedLoanAmount: loanInfo.requestedLoan.value,
      numericalValue: loanInfo.numericalValue.value , //my code
      SalariesAndLabourCharges: loanInfo.salariesandLabourCharges.value,
      Savings: loanInfo.businessSavings.value,
      SubTypeValue: loanInfo.loanSubType == undefined ? "" : loanInfo.loanSubType.value,
      TopUpLoan: loanInfo.doyouwantTopupLoan == undefined ? "" : loanInfo.doyouwantTopupLoan,
      TopUpLoanAmount: loanInfo.topupLoanValue.value,
      TopUpLoanType: loanInfo.topupLoantype == undefined ? '' : loanInfo.topupLoantype.index,
      TopUpQuantity: loanInfo.topupLoanQty == undefined ? '' : loanInfo.topupLoanQty,
      UtilityExpense: loanInfo.utilityExpense.value,
      addedDateTime: moment(new Date()).format('YYYY-MM-DD'),
      customerId: item.id,
      customerLoanTypeId: loanInfo.customerLoan_type?.index,
      PersonalJobDepartment: loanInfo.PersonalJobDepartment?.index,
      PersonalJobDesignation: loanInfo.PersonalJobDepartment?.value,
      PersonalLoanJobType: loanInfo.PersonalLoanJobType?.index,
      loanId: index,
      occupation: "" + loanInfo.occupation.value,
      PersonalLoanOccupationType: "" + loanInfo.occupationType == undefined ? '' : loanInfo.occupationType,
      AutofinanceProductPrice: "" + loanInfo.AutofinanceProductPrice,
      AutofinanceProductPercentage: '' + loanInfo.AutofinanceProductPercentagevalue.value,
      IsAutofinance: '' + loanInfo.IsAutofinance,
      PreviousLoanStatus: '' + loanInfo.doyouwantSolarTopupLoan,
      IsEbanking: 'IsEbanking' in loanInfo ? loanInfo.IsEbanking : 0,
      ApplicationVersion: '' + ApplicationVersion + "(" + releaseDate + ")",
      // DealerBusinessName: loanInfo.DealerBusinessName.value,
      // DealerName: loanInfo.DealerName.value,
      // DealerCnic: loanInfo.DealerCnic.value,
    }
    console.log("==================================>Loan")
    console.log("=========================>>" + JSON.stringify(Loan))
    console.log("==================================>Loan")
    // return

    /////////////////////////////////////////////////////////////////////////////////
    //console.log("Getting values of poverty questions....")
    ///////////////////////////////////////////////////////////////////////////////////////////////
    var questionnaireAnswer = {
      Answer1: "" + loanInfo.questionsno1.replace("u003E", ">").replace("u003C", "<"),
      Answer2: "" + loanInfo.questionsno2.replace("u003E", ">").replace("u003C", "<"),
      Answer3: "" + loanInfo.questionsno3.replace("u003E", ">").replace("u003C", "<"),
      Answer4: "" + loanInfo.questionsno4.replace("u003E", ">").replace("u003C", "<"),
      Answer5: "" + loanInfo.questionsno5.replace("u003E", ">").replace("u003C", "<"),
      Answer6: "" + loanInfo.questionsno6.replace("u003E", ">").replace("u003C", "<"),
      Answer7: "" + loanInfo.questionsno7.replace("u003E", ">").replace("u003C", "<"),
      Answer8: "" + loanInfo.questionsno8.replace("u003E", ">").replace("u003C", "<"),
      Answer9: "" + loanInfo.questionsno9.replace("u003E", ">").replace("u003C", "<"),
      Answer10: "" + loanInfo.questionsno10.replace("u003E", ">").replace("u003C", "<"),
      Answer11: "" + loanInfo.questionsno11.replace("u003E", ">").replace("u003C", "<"),
      Answer12: "" + loanInfo.questionsno12.replace("u003E", ">").replace("u003C", "<"),
      Answer13: "" + loanInfo.questionsno13.replace("u003E", ">").replace("u003C", "<"),
      CustomerId: item.id,
      Loan_Id: index,
      QuestionnaireFormId: 1,
    }
    /////////////////////////////////////////////////////////////////////////////////
    //Making object of loanSyncUpDatas
    ///////////////////////////////////////////////////////////////////////////////////////////////
    
    var vendorDetail = {};
    if('vendorName' in loanInfo){
      vendorDetail = {
        vendorName:loanInfo.vendorName.value,
        vendorShopName:loanInfo.vendorShopName.value,
        vendorMobileNumber:loanInfo.vendorMobileNumber.value,
        vendorProductName:loanInfo.vendorProductName.value,
        vendorProductPrice:loanInfo.vendorProductPrice.value,
        ProductCompanyName:loanInfo.ProductCompanyName.value,
        vendorCnic:loanInfo.vendorCnic.value,
        vendorCnicImages:loanInfo.vendorCnicImages
      };
    }

    //console.log("===>", vendorDetail)

    //return 

    let loanSyncUpDatas = [{
      Loan: Loan,
      questionnaireAnswer: questionnaireAnswer,
      vendorDetail:vendorDetail
    }]

    /////////////////////////////////////////////////////////////////////////////////
    //Making object of customerSyncUpDatas
    ///////////////////////////////////////////////////////////////////////////////////////////////

    var customerSyncUpDatas = [{
      assets,
      customer,
      customerAnswers,
      customerBMChecklistAnswers,
      familyMembers,
      guaranteers,
      loanSyncUpDatas
    }]

    /////////////////////////////////////////////////////////////////////////////////
    //Making object of group
    ///////////////////////////////////////////////////////////////////////////////////////////////

    // console.log("username----?", item.user_name);
    // console.log("aaaaaaaa===>", item);
    
    // Parse the Comments string into an object
    let parsedComments;
    try {
      parsedComments = typeof item.Comments === 'string' ? JSON.parse(item.Comments) : item.Comments;
    } catch (error) {
      console.error("Error parsing Comments:", error);
      parsedComments = {}; // Fallback to empty object to prevent crashes
    }
    
    // console.log("aaaaaaaabbbb===>", parsedComments);
    
    const group = {
      Group_Added_By: parsedComments?.addedBy?.value || "",
      Group_Added_By_Comment: parsedComments?.commentOfAddedby?.value || "",
      Group_Added_By_Designation: parsedComments?.addedByDesignation?.value || "",
      Group_Name: item.user_name || "",
      Group_Note: parsedComments?.borrowerRemarks?.value || "",
      Group_Status: "Processed",
      Group_Verified_By: parsedComments?.verifiedBy?.value || "",
      Group_Verified_By_Comment: parsedComments?.commentsofVerifiedby?.value || "",
      Group_Verified_By_Designation: parsedComments?.verifiedByDesignation?.value || "",
      groupId: 0,
      // Use item.Latitude and item.Longitudes instead of Commentsparser
      BMLocation: item.Latitude && item.Longitudes ? `${item.Latitude}-${item.Longitudes}` : "25.394759-68.3312667",
      VerificationOfficerLocation: parsedComments?.verificationOffLoc || "25.394759-68.3312667",
      GroupImagebyVerificationOff: parsedComments?.groupImagebyVerificationOff || "",
      VisitType: parsedComments?.visitType?.value === "Physical Visit" ? 1 : 0,
      VerificationOfficerComment: parsedComments?.verificationComments?.value || "",
      VerificationByDesignation: parsedComments?.verificationByDesignation?.value || "",
      VerificationOfficerName: parsedComments?.verificationofficerName?.value || "",
      VerificationOfficerDate: moment(new Date()).format('YYYY-MM-DD HH:mm:ss'),
      syncUpStatus: 0,
    };
    
    //  console.log("username----?", item.user_name)
    // var group = {

    //   Group_Added_By: "Added_By",
    //   Group_Added_By_Comment: "Added_By_Comment",
    //   Group_Added_By_Designation: "Added_By_Designation",
    //   Group_Name: "" + item.user_name,
    //   Group_Note: "note",
    //   Group_Status: "Processed",
    //   Group_Verified_By: "Verified_By",
    //   Group_Verified_By_Comment: "Verified_By_Comment",
    //   Group_Verified_By_Designation: "Verified_By_Designation",
    //   groupId: 0,
    //   BMLocation: Commentsparser.user_location == undefined ? "25.394759-68.3312667" : Commentsparser.user_location,
    //   VerificationOfficerLocation: Commentsparser.verificationOffLoc == undefined ? "25.394759-68.3312667" : Commentsparser.verificationOffLoc,
    //   GroupImagebyVerificationOff: Commentsparser.groupImagebyVerificationOff == undefined ? "" : Commentsparser.groupImagebyVerificationOff,
    //   VisitType: Commentsparser.visitType?.value == "Physical Visit" ? 1 : 0,
    //   VerificationOfficerComment: Commentsparser.verificationComments?.value,
    //   VerificationByDesignation: Commentsparser.verificationByDesignation?.value,
    //   VerificationOfficerName: Commentsparser.verificationofficerName?.value,
    //   VerificationOfficerDate: moment(new Date()).format('YYYY-MM-DD'),
    //   syncUpStatus: 0,
    // }
    /////////////////////////////////////////////////////////////////////////////////
    //Making object of group
    ///////////////////////////////////////////////////////////////////////////////////////////////

    let groupBMChecklistAnswers = [];
    /////////////////////////////////////////////////////////////////////////////////
    //Making object of groupMembers
    ///////////////////////////////////////////////////////////////////////////////////////////////

    let groupMembers = [{
      CustomerGroupId: 0,
      CustomerGroupMemberId: 0,
      CustomerId: item.id,
      Fullname: item.user_name,
      IsGroupLeader: true,
      NicNumber: item.user_cnic,
    }]

    /////////////////////////////////////////////////////////////////////////////////
    //Making object of final Object
    ///////////////////////////////////////////////////////////////////////////////////////////////
    var Uploading: any = {
      customerSyncUpDatas: customerSyncUpDatas,
      group: group,
      groupBMChecklistAnswers: groupBMChecklistAnswers,
      groupMembers: groupMembers

    }
  // *******************************************************************WRITE FILE
        //  const granted = await PermissionsAndroid.request(
        //     PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
        //     {
        //       title: 'Storage Permission',
        //       message: 'App needs access to memory to download the file ',
        //     },
        //   );
        //   if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        //     let get=await FingerModule.writeToFile(JSON.stringify(Uploading),"SyncupbyBMtoMIS");
        //     console.log("--->write file",get);

        //     // -----------------------------
        //   } else {
        //     Alert.alert(
        //       'Permission Denied!',
        //       'You need to give storage permission to download the file',
        //     );
        //     return;
        //   }
//return
        // **********************************************************************
    uploadingCustomerdata(Uploading, setprogressVisible)
      .then(async (value) => {
      
        console.log("--->IN THE END", value);
        if (value === "Success") {
          //////////////////////////////////////////////////////////////////////////////
          // (Uploading AssetsImage) (recursivecountAssetsuploading)
          /////////////////////////////////////////////////////////////////////
          imagesCounter = 0;
          setTitle("Uploading Assets Images..")
          recursivecountAssetsuploading(assets_Image, assets_Image.length, item, index)
        } else {
          setToast({
            type: "error",
            message: "" + value,
          });
        }


      })

      .catch((error) => {

      })
  }

  const rejectGettingCustomerData = async (item, index, parser) => {

    var converter = item.CustomerAnswers
    var parser2 = JSON.parse(converter)
    var CustomerAns = parser2.answerArray
    var Commentsparser = JSON.parse(item.Comments)

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
          if (value.length > 0) {
            value.map((imageitem, imageindex) => {
              if ((underindex + 1) == imageitem.assets_id) {
                assets_Image.push({
                  AssetsDocumentId: imageindex,
                  Assets_Id: imageitem.assets_id,
                  Image: JSON.parse(imageitem.imgValue),
                  NicNumber: item.user_cnic,
                  assets_tag: underitem.assetTagName.value,
                  Unique_Code: "4813_16" + Math.random(),
                  ImageName: imageitem.imgName.value,
                })
              }
            })
          }
        }
      }).catch(() => { })

    });
    var customerInfo = parser.customerInfo[0];
    //////////////////////////////////////////////////////////////////////////////
    //console.log("Getting customer form vlaues...")
    /////////////////////////////////////////////////////////////////////
    // console.log("customerInfo.evrisys_customerImage",customerInfo.evrisys_customerImage)
    var customer = {
      Address_Permanent_Address: customerInfo.customer_per_address.value,
      Address_Permanent_City: customerInfo.customer_per_city.value,
      Address_Permanent_Country: customerInfo.customer_per_country.value,
      Address_Permanent_District_Name: customerInfo.customer_per_district.value,
      Address_Permanent_Mohalla_Village: customerInfo.customer_per_mohalla.value,
      Address_Permanent_Taluka_Name: customerInfo.customer_per_taluka.value,
      Address_Permanent_UC_Name: customerInfo.customer_per_uc.value,
      Address_Permanent_State: customerInfo.customer_per_stateProvince.value,

      Address_Present_Address: customerInfo.customer_pre_address.value,
      Address_Present_City: customerInfo.customer_pre_city.value,
      Address_Present_Country: customerInfo.customer_pre_country.value,
      Address_Present_District_Name: customerInfo.customer_pre_district.value,
      Address_Present_Mohalla_Village: customerInfo.customer_pre_mohalla.value,
      Address_Present_NumberOfYears: customerInfo.numberOfyear.value,
      Address_Present_State: customerInfo.customer_pre_stateProvince.value,
      Address_Present_Taluka_Name: customerInfo.customer_pre_taluka.value,
      Address_Present_UC_Name: customerInfo.customer_pre_uc.value,

      BMUndertaking: 1,
      ClientDisease: customerInfo.customer_disease == undefined ? 0 : customerInfo.customer_disease.index,
      CommentImageStr: Commentsparser.groupImage,
      CommentImageTemp: Commentsparser.groupImage,

      JobSalaryCardImage: customerInfo.customer_jobCard == undefined ? "" : customerInfo.customer_jobCard,
      E_VerisysVerficationImage: customerInfo.evrisys_customerImage == undefined ? "" : customerInfo.evrisys_customerImage,
      IsEmployed: customerInfo.customer_isEmployeed ? 1 : 0,

      CustomerAddedBy: Commentsparser.addedBy.value,
      CustomerAddedByComment: Commentsparser.commentOfAddedby.value,
      CustomerAddedByDesignation: Commentsparser.addedByDesignation.value,
      CustomerId: item.id,
      CustomerType: customerInfo.customer_userType == undefined ? 0 : customerInfo.customer_userType.index,
      CustomerVerifiedBy: Commentsparser.verifiedBy.value,
      CustomerVerifiedByComment: Commentsparser.commentsofVerifiedby.value,
      CustomerVerifiedByDesignation: Commentsparser.verifiedByDesignation.value,
      DateOfBirth: customerInfo.customer_dob,
      DiseaseValue: customerInfo.customer_disease == undefined ? 0 : customerInfo.customer_disease.index,
      Education: customerInfo.customer_education == undefined ? 0 : customerInfo.customer_education.index,
      FPImageStr: customerInfo.customer_biomatric == undefined ? "" : customerInfo.customer_biomatric.imageValue,
      FPImageTemp: customerInfo.customer_biomatric == undefined ? "" : customerInfo.customer_biomatric.imageTemp,
      FamilyNumber: customerInfo.FamilyNumber.value,
      FirstName: customerInfo.customer_name.value,
      Gender: customerInfo.customer_gender == "Male" ? "M" : customerInfo.customer_gender == "Female" ? "F" : "T",
      Guardian: customerInfo.customer_guardianceOfName.value,
      GuardianNICNumber: customerInfo.customer_guardianceCnic.value,
      GuardianType: customerInfo.customer_guardianceOf == undefined ? 0 : customerInfo.customer_guardianceOf == "S/O" ? 0 : customerInfo.customer_guardianceOf == "D/O" ? 1 : customerInfo.customer_guardianceOf == "W/O" ? 2 : 0,
      HouseStatus: customerInfo.customer_houseStatus == undefined ? 0 : customerInfo.customer_houseStatus.index,
      HouseType: customerInfo.customer_houseType == undefined ? 0 : customerInfo.customer_houseType.index,
      IsActivated: false,
      IsDeceased: "0",
      IsDisabled: customerInfo.customer_disable == undefined ? 0 : customerInfo.customer_disable ? 1 : 0,
      LastName: customerInfo.customer_surname.value,
      MaritalStatus: customerInfo.customer_maritialStatus == undefined ? 0 : customerInfo.customer_maritialStatus == "Single" ? 0 : customerInfo.customer_maritialStatus == "Married" ? 1 : customerInfo.customer_maritialStatus == "Divorced" ? 2 : 3,
      MobileNumber: customerInfo.customer_mobileNumber.value,
      MotherName: customerInfo.customer_motherName.value,
      NICExpiryDate: '' + customerInfo.customer_cnicExpireDate,
      NICIssueDate: '' + customerInfo.customer_cnicissueDate,
      NICNumber: item.user_cnic,
      NICType: "null",
      NextOfKinCNIC: customerInfo.customer_nextKinCnic.value,
      // NextOfKinnRelation: customerInfo.customer_nextKinRelation == undefined ? customerInfo.customer_nextKinOtherRelation == undefined ? 0 : customerInfo.customer_nextKinOtherRelation.value : customerInfo.customer_nextKinRelation.index,
      NextOfKinnRelation: customerInfo.customer_nextKinRelation == undefined ? 0 : Number(customerInfo.customer_nextKinRelation.index + 1),
      NumberOfChildren: 0,
      NumberOfSchoolGoingChildren: 0,
      ProfileImageStr: customerInfo.customer_img == undefined ? "" : customerInfo.customer_img,
      ProfileImageTemp: customerInfo.customer_img == undefined ? "" : customerInfo.customer_img,
      RSKRiskProfile: 0,
      Religion: customerInfo.customer_religion == undefined ? 0 : customerInfo.customer_religion.index,
      SupportingPersonFPImageStr: customerInfo.customer_supportingPerson_fingerprint == undefined ? "" : customerInfo.customer_supportingPerson_fingerprint.imageValue,
      SupportingPersonFPImageTemp: customerInfo.customer_supportingPerson_fingerprint == undefined ? "" : customerInfo.customer_supportingPerson_fingerprint.imageTemp,
      SupportingPersonCnic: customerInfo.customer_supportingPerson_cnic.value,
      SupportingPersonName: customerInfo.customer_supportingPerson_name.value,
      SupportingPersonRelation: customerInfo.customer_supportingPerson_relation.value,
      TestValue: customerInfo.customer_labourtytestintwoyear == undefined ? "0" : customerInfo.customer_labourtytestintwoyear.index,
      TokenNumber: "",
      bispValue: customerInfo.customer_bispBeneficary == undefined ? 0 : customerInfo.customer_bispBeneficary.index,
      clientCurrentStatus: customerInfo.customer_physicalHealth == undefined ? 0 : customerInfo.customer_physicalHealth.index,
      clientHealthTests: customerInfo.customer_health.value,
      customerGPSLocation: customerInfo.customer_location == undefined ? "25.394759, 68.3312667" : customerInfo.customer_location,
      groupReceivedFromAPK: "R_SAFCO APK",
      nextOfKinName: customerInfo.customer_nextKinName.value,
      regionName: '' + customerInfo.customer_region == undefined ? "region" : customerInfo.customer_region,
      stationId: parser?.StationId,
      stationName: parser?.StationName,
      status: 0,
      syncStatus: 0,
    }


    //////////////////////////////////////////////////////////////////////////////
    //console.log("Getting HALFNAME form vlaues...")
    /////////////////////////////////////////////////////////////////////
    var customerAnswers = [{
      CustomerId: item.id,
      NICNumber: item.user_cnic,
      customerQ10Answer: CustomerAns[9].value,
      customerQ11Answer: CustomerAns[10].value,
      customerQ12Answer: CustomerAns[11].value,
      customerQ13Answer: CustomerAns[12].value,
      customerQ14Answer: CustomerAns[13].value,
      customerQ15Answer: CustomerAns[14].value,
      customerQ16Answer: CustomerAns[15].value,
      customerQ17Answer: CustomerAns[16].value,
      customerQ18Answer: CustomerAns[17].value,
      customerQ19Answer: CustomerAns[18].value,
      customerQ1Answer: CustomerAns[0].value,
      customerQ2Answer: CustomerAns[1].value,
      customerQ3Answer: CustomerAns[2].value,
      customerQ4Answer: CustomerAns[3].value,
      customerQ5Answer: CustomerAns[4].value,
      customerQ6Answer: CustomerAns[5].value,
      customerQ7Answer: CustomerAns[6].value,
      customerQ8Answer: CustomerAns[7].value,
      customerQ9Answer: CustomerAns[8].value,
    }];
    //////////////////////////////////////////////////////////////////////////////
    //console.log("Getting customerBMChecklistAnswers form vlaues...")
    /////////////////////////////////////////////////////////////////////
    var customerBMChecklistAnswers = [{
      CustomerId: item.id,
      appraisalPlaceValue: Commentsparser.socialAppraisal.index,
      borrowerVisitValue: Commentsparser.visitedBorrower.index,//1
      cusActionPlan1: Commentsparser.riskAssementno1.value,//""
      cusActionPlan2: Commentsparser.riskAssementno2.value,//""
      cusActionPlan3: Commentsparser.riskAssementno3.value,//""
      cusAddress: Commentsparser.borrowerAddress.value,//""
      cusBMChecklistAns1: Commentsparser.counductPhysicalVisit.value,//0,
      cusBMChecklistAns10: Commentsparser.socialandManagmentPolicy.value,//0,
      cusBMChecklistAns11: Commentsparser.verifiedCIBPolicy.value,//0,
      cusBMChecklistAns12: Commentsparser.doesBorrowerEnivro.value,//0,
      cusBMChecklistAns13: Commentsparser.doesEnterprise.value,//0,

      cusBMChecklistAns15: "borrowerCashFlow" in Commentsparser ? Commentsparser.borrowerCashFlow.value : 1,
      cusBMChecklistAns16: "supportingCnicForFemale" in Commentsparser ? Commentsparser.supportingCnicForFemale.value : 1,
      cusBMChecklistAns17: "borrowerRepaymentCapacity" in Commentsparser ? Commentsparser.borrowerRepaymentCapacity.value : 1,
      cusBMChecklistAns18: "borrowerBusinessORHome" in Commentsparser ? Commentsparser.borrowerBusinessORHome.value : 1,
      cusBMChecklistAns19: "repaymentCapacityAnalysis" in Commentsparser ? Commentsparser.repaymentCapacityAnalysis.value : 1,
      cusBMChecklistAns20: "isTheLoanPricingIsClearlyDisclosed" in Commentsparser ? Commentsparser.isTheLoanPricingIsClearlyDisclosed.value : 1,
      cusBMChecklistAns21: "isTheBorrowerInformedAboutTheGrievance" in Commentsparser ? Commentsparser.isTheBorrowerInformedAboutTheGrievance.value : 1,
      cusBMChecklistAns22: "isTheBorrowerAwareAboutTheCollateral" in Commentsparser ? Commentsparser.isTheBorrowerAwareAboutTheCollateral.value : 1,
      cusBMChecklistAns23: "anyMajorRisksInvolvedInBusiness" in Commentsparser ? Commentsparser.anyMajorRisksInvolvedInBusiness.value : 1,
      cusBMChecklistAns23Desc: "anyMajorRisksInvolvedInBusiness" in Commentsparser ? Commentsparser.anyMajorRisksInvolvedInBusiness.detail : null,
     
      cusBMChecklistAns2: Commentsparser.verifiedreApparisal.value,//0,
      cusBMChecklistAns3: Commentsparser.verifiedRepaymentHistory.value,//0,
      cusBMChecklistAns4: Commentsparser.criticalAssetsValuation.value,//0,
      cusBMChecklistAns5: Commentsparser.verifiedbyContactNumber.value,//0,
      cusBMChecklistAns6: Commentsparser.meetwithSocialResponsible.value,//0,
      cusBMChecklistAns7: Commentsparser.meetwithPersonalGuarantee.value,//0,
      cusBMChecklistAns8: Commentsparser.verifiedProvidedDoc.value,//0,
      cusBMChecklistAns9: Commentsparser.amlPolicyandProcedure.value,//0,
      cusContact: Commentsparser.borrowerPhone.value,//"22222222222",
      cusImplTimeline1: Commentsparser.riskAssementTimelineone.value,//0,
      cusImplTimeline2: Commentsparser.riskAssementTimelinetwo.value,//0,
      cusImplTimeline3: Commentsparser.riskAssementTimelinethree.value,//0,
      cusNICNumber: item.user_cnic,//"41355-8889990-0",
      cusName: Commentsparser.borrowerName.value,//"w",
      cusReason: Commentsparser.borrowerRemarks.value,//"56",
      decisionValue: Commentsparser.borrowerApproval.index,//2,
      remarksValue: Commentsparser.borrowerStaification.index,//
    }];
    //////////////////////////////////////////////////////////////////////////////
    //console.log("Getting familyMember form vlaues...")
    /////////////////////////////////////////////////////////////////////
    let familyMembers = []
    parser.familyMemberInfo.map((underitem, underindex) => {

      // console.log("======familyMembers======>")

      // console.log(""+underitem.familyMember_genderSelection==="Male"?"M":underitem.familyMember_genderSelection==="Female"?"F":"T")
       console.log("=====familyMembers=======>")




      familyMembers.push(
        {
          Age: '' + underitem.familyMember_age.value,
          BusinessAddress: '' + underitem.familyMember_businessAddress.value,
          CustomerFamilyMemberId: underindex,
          CustomerId: '' + item.id,
          Education: '' + underitem.familyMember_education.value,
          FullName: '' + underitem.familyMember_fullname.value,
          Gender: '' + underitem.familyMember_genderSelection == "Male" ? "M" : underitem.familyMember_genderSelection == "Female" ? "F" : "T",
          MonthlyEarning: '' + underitem.familyMember_montlyEarning.value,
          NICNumber: '' + underitem.familyMember_cnic.value,
          RelationshipWithCustomer: '' + underitem.familyMember_relation.value,
          SourceOfIncome: '' + underitem.familyMember_sourceIncome.value,
        }
      )
    });
    //////////////////////////////////////////////////////////////////////////////
    //console.log("Getting guaranteers form vlaues...")
    //////////////////////////////////////////////////////////////////////
    let guaranteers = [];
    parser.guarantorInfo.map((underitem, underindex) => {
      guaranteers.push(
        {
          Address: '' + underitem.guarantor_address.value,
          BusinessAddress: "" + underitem.guarantor_businessAddress.value,
          ContactNumber: "" + underitem.guarantor_contactno.value,
          CustomerGuaranteerId: '' + index,
          CustomerId: item.id,
          FullName: "" + underitem.guarantor_fullname.value,
          JobDescription: "" + underitem.guarantor_jobDescription.value,
          JobType: "" + underitem.guarantor_jobType.value,
          LoanId: '' + index,
          NICNumber: '' + underitem.guarantor_cnic.value,
          Notes: "" + underitem.guarantor_businessNote.value,
          Status: 1,
        }
      )
    });
    //////////////////////////////////////////////////////////////////////////////
    //console.log("Getting Loan form vlaues...")
    //////////////////////////////////////////////////////////////////////
    var loanInfo = parser.loanInfo[0];
    var Loan = {
      AmountRequiredForBusiness: loanInfo.amountRequiredforBusiness.value,
      AnyOtherExpense: loanInfo.anyOtherExpenses.value,
      AnyOtherRentalIncome: loanInfo.rentalIncome.value,
      ApprovedLoanAmount: loanInfo.approvedLoan.value,
      BorrowerRiskProfile: loanInfo.borrowerriskprofile == 1 ? 0 : loanInfo.borrowerriskprofile == 2 ? 0.5 : loanInfo.borrowerriskprofile == 3 && 1,
      EsmProductRisk: loanInfo.EsmProductRisk,
      EsmProductItemRisk : loanInfo.EsmProductItemRisk, 
      EsmProductRiskValue : loanInfo.EsmProductRiskValue,
      BusinessAddress: loanInfo.businessAddress.value,
      ChildrenEducationExpense: loanInfo.childrenExpense.value,
      CustomerProductRisk: loanInfo.customerandproductrisk == undefined ? 0 : loanInfo.customerandproductrisk.index,
      CustomerProductRiskRemarks: loanInfo.customerandProductriskRemarks.value,
      ExistingBusiness: loanInfo.businessName.value,
      ExpectedMonthlyIncomeFromBusiness: loanInfo.expectedMonthlyIncome.value,
      ExperienceInBusiness: loanInfo.experianceinBusiness.value,
      GeographicRisk: loanInfo.geographicrisk == undefined ? 0 : loanInfo.geographicrisk?.index,
      GeographicRiskRemarks: loanInfo.geographicriskRemarks.value,
      HouseholdExpense: loanInfo.monthlyHouseholdExpense.value,
      HouseholdLiability: loanInfo.householdLiability.value,
      Household_MonthlyExpense: loanInfo.monthlyHouseholdExpense.value,
      Household_MonthlyIncome: loanInfo.monthlyHouseholdIncome.value,
      Household_Savings: loanInfo.householdSavings.value,
      IncomeFromOtherExpense: loanInfo.incomefromOtherSource.value,
      IncomeFromSales: loanInfo.incomeFromSales.value,
      Liability: loanInfo.liability.value,
      LoanStatus: loanInfo.loanStatus == undefined ? "" : loanInfo.loanStatus.value,
      LoanSubType: loanInfo.loanSubType == undefined ? "" : loanInfo.loanSubType.value,
      LoanTerm: loanInfo.loanTerm.value,
      LoanTypeId: loanInfo.loanType == undefined ? 0 : loanInfo.loanType.value,
      LoanTypeValue: loanInfo.loanType == undefined ? 0 : loanInfo.loanType.index,
      LoanUtilizationRisk: loanInfo.loanUtilizationrisk == undefined ? 0 : loanInfo.loanUtilizationrisk.index,//""
      LoanUtilizationRiskRemarks: loanInfo.loanUtilizationriskRemarks.value,//''
      MonthlyExpense: loanInfo.monthlyExpenses.value,
      MonthlyIncome: loanInfo.monthlyIncome.value,
      MonthlyInstallmentFromLender: loanInfo.monthlyInstallment.value,//""
      NoOfEmployees: loanInfo.no_of_emploee.value,
      Notes: loanInfo.loanNote.value,
      OtherExpense: loanInfo.otherExpenses.value,
      OtherFamilyIncome: loanInfo.otherFamilyIncome.value,
      OtherMonthlyLiability: loanInfo.anyOtherMonthly.value,
      OtherUtilityExpense: loanInfo.utilityExpense.value,
      PEPRisk: loanInfo.peprisk == undefined ? 0 : loanInfo.peprisk.index,
      PEPRiskRemarks: loanInfo.pepriskRemakrs.value,
      PersonalCapitalInBusiness: loanInfo.personalCapitalinBusiness.value,
      ProcessingFeesStatus: "",
      RawMaterialPurchasing: loanInfo.rawMaterialpurchase.value,
      RentalOrAnyOtherIncome: loanInfo.rentalIncome.value,
      RepaymentFrequency: loanInfo.selectRepaymentFrequency == undefined ? "" : loanInfo.selectRepaymentFrequency?.index + 1,
      RequestedLoanAmount: loanInfo.requestedLoan.value,
      numericalValue: loanInfo.numericalValue.value , //my code
      SalariesAndLabourCharges: loanInfo.salariesandLabourCharges.value,
      Savings: loanInfo.businessSavings.value,
      SubTypeValue: loanInfo.loanSubType == undefined ? "" : loanInfo.loanSubType.value,
      TopUpLoan: loanInfo.doyouwantTopupLoan == undefined ? "" : loanInfo.doyouwantTopupLoan,
      TopUpLoanAmount: loanInfo.topupLoanValue.value,
      TopUpLoanType: loanInfo.topupLoantype == undefined ? '' : loanInfo.topupLoantype.index,
      TopUpQuantity: loanInfo.topupLoanQty == undefined ? '' : loanInfo.topupLoanQty,
      UtilityExpense: loanInfo.utilityExpense.value,
      addedDateTime: moment(new Date()).format('YYYY-MM-DD'),
      customerId: item.id,
      customerLoanTypeId: loanInfo.customerLoan_type?.index,
      PersonalJobDepartment: loanInfo.PersonalJobDepartment?.index,
      PersonalJobDesignation: loanInfo.PersonalJobDepartment?.value,
      PersonalLoanJobType: loanInfo.PersonalLoanJobType?.index,
      loanId: index,
      occupation: "" + loanInfo.occupation.value,
      PersonalLoanOccupationType: "" + loanInfo.occupationType == undefined ? '' : loanInfo.occupationType,
      AutofinanceProductPrice: "" + loanInfo.AutofinanceProductPrice,
      AutofinanceProductPercentage: '' + loanInfo.AutofinanceProductPercentagevalue.value,
      IsAutofinance: '' + loanInfo.IsAutofinance,
      PreviousLoanStatus: '' + loanInfo.doyouwantSolarTopupLoan,
      IsEbanking: 'IsEbanking' in loanInfo ? loanInfo.IsEbanking : 0,
      ApplicationVersion: '' + ApplicationVersion + "(" + releaseDate + ")",
      DealerBusinessName: loanInfo.DealerBusinessName.value,
      DealerName: loanInfo.DealerName.value,
      DealerCnic: loanInfo.DealerCnic.value,
    }
    console.log("==================================>Loan")
    console.log("=========================>>" + JSON.stringify(Loan))
    console.log("==================================>Loan")
   

    /////////////////////////////////////////////////////////////////////////////////
    //console.log("Getting values of poverty questions....")
    ///////////////////////////////////////////////////////////////////////////////////////////////
    var questionnaireAnswer = {
      Answer1: "" + loanInfo.questionsno1.replace("u003E", ">").replace("u003C", "<"),
      Answer2: "" + loanInfo.questionsno2.replace("u003E", ">").replace("u003C", "<"),
      Answer3: "" + loanInfo.questionsno3.replace("u003E", ">").replace("u003C", "<"),
      Answer4: "" + loanInfo.questionsno4.replace("u003E", ">").replace("u003C", "<"),
      Answer5: "" + loanInfo.questionsno5.replace("u003E", ">").replace("u003C", "<"),
      Answer6: "" + loanInfo.questionsno6.replace("u003E", ">").replace("u003C", "<"),
      Answer7: "" + loanInfo.questionsno7.replace("u003E", ">").replace("u003C", "<"),
      Answer8: "" + loanInfo.questionsno8.replace("u003E", ">").replace("u003C", "<"),
      Answer9: "" + loanInfo.questionsno9.replace("u003E", ">").replace("u003C", "<"),
      Answer10: "" + loanInfo.questionsno10.replace("u003E", ">").replace("u003C", "<"),
      Answer11: "" + loanInfo.questionsno11.replace("u003E", ">").replace("u003C", "<"),
      Answer12: "" + loanInfo.questionsno12.replace("u003E", ">").replace("u003C", "<"),
      Answer13: "" + loanInfo.questionsno13.replace("u003E", ">").replace("u003C", "<"),
      CustomerId: item.id,
      Loan_Id: index,
      QuestionnaireFormId: 1,
    }
    /////////////////////////////////////////////////////////////////////////////////
    //Making object of loanSyncUpDatas
    ///////////////////////////////////////////////////////////////////////////////////////////////
    
    var vendorDetail = {};
    if('vendorName' in loanInfo){
      vendorDetail = {
        vendorName:loanInfo.vendorName.value,
        vendorShopName:loanInfo.vendorShopName.value,
        vendorMobileNumber:loanInfo.vendorMobileNumber.value,
        vendorProductName:loanInfo.vendorProductName.value,
        vendorProductPrice:loanInfo.vendorProductPrice.value,
        ProductCompanyName:loanInfo.ProductCompanyName.value,
        vendorCnic:loanInfo.vendorCnic.value,
        vendorCnicImages:loanInfo.vendorCnicImages
      };
    }

    //console.log("===>", vendorDetail)

    //return 

    let loanSyncUpDatas = [{
      Loan: Loan,
      questionnaireAnswer: questionnaireAnswer,
      vendorDetail:vendorDetail
    }]

    /////////////////////////////////////////////////////////////////////////////////
    //Making object of customerSyncUpDatas
    ///////////////////////////////////////////////////////////////////////////////////////////////

    var customerSyncUpDatas = [{
      assets,
      customer,
      customerAnswers,
      customerBMChecklistAnswers,
      familyMembers,
      guaranteers,
      loanSyncUpDatas
    }]

    /////////////////////////////////////////////////////////////////////////////////
    //Making object of group
    ///////////////////////////////////////////////////////////////////////////////////////////////
console.log("username----?", item.user_name);
    console.log("aaaaaaaa===>", item);
    
    // Parse the Comments string into an object
    let parsedComments;
    try {
      parsedComments = typeof item.Comments === 'string' ? JSON.parse(item.Comments) : item.Comments;
    } catch (error) {
      console.error("Error parsing Comments:", error);
      parsedComments = {}; // Fallback to empty object to prevent crashes
    }
    
    console.log("aaaaaaaabbbb===>", parsedComments);
    
    const group = {
      Group_Added_By: parsedComments?.addedBy?.value || "",
      Group_Added_By_Comment: parsedComments?.commentOfAddedby?.value || "",
      Group_Added_By_Designation: parsedComments?.addedByDesignation?.value || "",
      Group_Name: item.user_name || "",
      Group_Note: parsedComments?.borrowerRemarks?.value || "",
      Group_Status: "Processed",
      Group_Verified_By: parsedComments?.verifiedBy?.value || "",
      Group_Verified_By_Comment: parsedComments?.commentsofVerifiedby?.value || "",
      Group_Verified_By_Designation: parsedComments?.verifiedByDesignation?.value || "",
      groupId: 0,
      // Use item.Latitude and item.Longitudes instead of Commentsparser
      BMLocation: item.Latitude && item.Longitudes ? `${item.Latitude}-${item.Longitudes}` : "25.394759-68.3312667",
      VerificationOfficerLocation: parsedComments?.verificationOffLoc || "25.394759-68.3312667",
      GroupImagebyVerificationOff: parsedComments?.groupImagebyVerificationOff || "",
      VisitType: parsedComments?.visitType?.value === "Physical Visit" ? 1 : 0,
      VerificationOfficerComment: parsedComments?.verificationComments?.value || "",
      VerificationByDesignation: parsedComments?.verificationByDesignation?.value || "",
      VerificationOfficerName: parsedComments?.verificationofficerName?.value || "",
      VerificationOfficerDate: moment(new Date()).format('YYYY-MM-DD HH:mm:ss'),
      syncUpStatus: 0,
    };
    






    //  console.log("username----?", item.user_name)
    // var group = {

    //   Group_Added_By: "Added_By",
    //   Group_Added_By_Comment: "Added_By_Comment",
    //   Group_Added_By_Designation: "Added_By_Designation",
    //   Group_Name: "" + item.user_name,
    //   Group_Note: "note",
    //   Group_Status: "Processed",
    //   Group_Verified_By: "Verified_By",
    //   Group_Verified_By_Comment: "Verified_By_Comment",
    //   Group_Verified_By_Designation: "Verified_By_Designation",
    //   groupId: 0,
    //   BMLocation: Commentsparser.user_location == undefined ? "25.394759-68.3312667" : Commentsparser.user_location,
    //   VerificationOfficerLocation: Commentsparser.verificationOffLoc == undefined ? "25.394759-68.3312667" : Commentsparser.verificationOffLoc,
    //   GroupImagebyVerificationOff: Commentsparser.groupImagebyVerificationOff == undefined ? "" : Commentsparser.groupImagebyVerificationOff,
    //   VisitType: Commentsparser.visitType?.value == "Physical Visit" ? 1 : 0,
    //   VerificationOfficerComment: Commentsparser.verificationComments?.value,
    //   VerificationByDesignation: Commentsparser.verificationByDesignation?.value,
    //   VerificationOfficerName: Commentsparser.verificationofficerName?.value,
    //   VerificationOfficerDate: moment(new Date()).format('YYYY-MM-DD'),
    //   syncUpStatus: 0,
    // }
    /////////////////////////////////////////////////////////////////////////////////
    //Making object of group
    ///////////////////////////////////////////////////////////////////////////////////////////////

    let groupBMChecklistAnswers = [];
    /////////////////////////////////////////////////////////////////////////////////
    //Making object of groupMembers
    ///////////////////////////////////////////////////////////////////////////////////////////////

    let groupMembers = [{
      CustomerGroupId: 0,
      CustomerGroupMemberId: 0,
      CustomerId: item.id,
      Fullname: item.user_name,
      IsGroupLeader: true,
      NicNumber: item.user_cnic,
    }]

    /////////////////////////////////////////////////////////////////////////////////
    //Making object of final Object
    ///////////////////////////////////////////////////////////////////////////////////////////////
    var Uploading: any = {
      customerSyncUpDatas: customerSyncUpDatas,
      group: group,
      groupBMChecklistAnswers: groupBMChecklistAnswers,
      groupMembers: groupMembers

    }
   
    
  // *******************************************************************WRITE FILE
        //  const granted = await PermissionsAndroid.request(
        //     PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
        //     {
        //       title: 'Storage Permission',
        //       message: 'App needs access to memory to download the file ',
        //     },
        //   );
        //   if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        //     let get=await FingerModule.writeToFile(JSON.stringify(Uploading),"SyncupbyBMtoMIS");
        //     console.log("--->write file",get);

        //     // -----------------------------
        //   } else {
        //     Alert.alert(
        //       'Permission Denied!',
        //       'You need to give storage permission to download the file',
        //     );
        //     return;
        //   }
//return
        // **********************************************************************
        RejectuploadingCustomerdata(Uploading, setprogressVisible)
      .then(async (value) => {
      
        console.log("--->IN THE END", value);
        if (value === "Success") {
          //////////////////////////////////////////////////////////////////////////////
          // (Uploading AssetsImage) (recursivecountAssetsuploading)
          /////////////////////////////////////////////////////////////////////
          imagesCounter = 0;
          setTitle("Uploading Assets Images..")
          recursivecountAssetsuploading(assets_Image, assets_Image.length, item, index)
        } else {
          setToast({
            type: "error",
            message: "" + value,
          });
        }


      })

      .catch((error) => {

      })
  }

  // **************************************************************************
  //============================ SYNCUP PROCESS FOR BM ==============================END
  // **************************************************************************
  // **************************************************************************
  //============================ SYNCUP PROCESS ON TEMP DATABASE==============================START
  // **************************************************************************
  const SyncupforLoanVerification = (parser, item, index) => {


    var loanInfo = parser.loanInfo[0];

    var assestsInfo = parser.assestsInfo[0];

    var guarantorInfo = parser.guarantorInfo[0];

    var customer = parser.customerInfo[0];

    console.log("--->LOanOfficerSyncup okkk", JSON.stringify(loanInfo.loanType))

    if (loanInfo.loanType == undefined) {
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

        message: "Please upload E-Vrisys  image first!",

      });
      return
    }
    if (loanInfo.customerLoan_type.value != "Normal" && guarantorInfo == undefined) {
      setToast({

        type: "error",

        message: "Please fill Gurantor information first. Because you have selected loan type as " + loanInfo.customerLoan_type.value,

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

    //////////////////////////////////////////////////////////////////////////////
    //Send array of tags for checking already exist or not ...(CheckingTags)
    /////////////////////////////////////////////////////////////////////
    setTitle("Checking Tags..")
    setprogressVisible(true)

    CheckingTags(make, setprogressVisible).then((value) => {

      console.log("CheckingTags" + value)

      if (value.length > 0) {

        setToast({

          type: "error",

          message: "" + value,

        });
        setTitle("Updating Tags..")
        setprogressVisible(true)
        CallforTags(StationReducer.station.stationId, setprogressVisible)
          .then((values) => {
            setprogressVisible(false)

          })
      } else {

        console.log("===>item.user_cnic", JSON.stringify(item.user_cnic))
        setprogressVisible(true)
        setTitle("Uploading Docs..")


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

                })
              })


              setTitle("Syncing up")


              var converter = item.CustomerAnswers

              var parser2 = JSON.parse(converter)

              var CustomerAns = parser2.answerArray
              // **************** REMOVING IMAGES
              parser.customerInfo[0].customer_cnicNumber.value = item.user_cnic
              parser.loanInfo[0].loan_customerImage = [{ key: 1, activeTab: false, imgName: { value: '', error: false }, imgValue: undefined, }]
              parser.assestsInfo.map((assetsitem, indexer) => {
                parser.assestsInfo[indexer].assets_Image = [{ key: 1, activeTab: false, imgName: { value: '', error: false }, imgValue: undefined, }]
              })
              // **************** REMOVING IMAGES
              var removeQuestioninSindhi = CustomerAns;
              removeQuestioninSindhi.map((item, index) => {
                removeQuestioninSindhi[index].question = ""
              });

              item.CustomerAnswers = removeQuestioninSindhi;

              GettingCustomerDataforVerification(item, index, parser);

            } else {
              setprogressVisible(false)

              setToast({

                type: "error",

                message: "Sorry! Documents not found.",
              });
            }
          }
        }).catch((error) => {

          console.log("catch works", JSON.stringify(error))

        })





      }

    }).catch((error) => {

      console.log(error)
      setprogressVisible(false)
      if (error) {
        setToast({
          type: "error",
          message: "" + error,
        });
      }


      // setDialogeCount("Syncing up")
    })
  }


  //////////////////////////////////////////////////////////////////////////////
  //Getting Data of Customer...
  /////////////////////////////////////////////////////////////////////

  const GettingCustomerDataforVerification = async (item, index, parser) => {

    // var parser = JSON.parse(item.forms)
    // compositeKey = item.user_cnic

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

          // compositeKey += Math.floor(Math.random() * 1000);

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
            if (underindex == parser.assestsInfo.length - 1) {
              console.log("docs==>", docs.length)
              console.log("item.CompositeKey==>", item.CompositeKey)
              console.log("docassets_Images==>", assets_Image.length)
              uploadingMultipleDocsImages(docs, docs.length, item.CompositeKey, item, assets_Image, parser)
            }





          } else {

            if (underindex == parser.assestsInfo.length - 1) {

              console.log("docs==>", docs.length)
              console.log("docassets_Images==>", assets_Image.length)


              uploadingMultipleDocsImages(docs, docs.length, item.CompositeKey, item, assets_Image, parser)
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


  }


  const uploadingMultipleDocsImages = async (allData, indexer, user_cnic, item, assets_Image, parser) => {
    updateTempCustomerDocsimagesbyBm(allData[indexer - 1], user_cnic)
      .then((value) => {
        if (value == "Success") {
          imagesCounter++;

          setTitle("Uploading Docs.. \n" + imagesCounter + "/" + docs.length)

          let nextNumber = indexer - 1

          if (nextNumber > 0) {

            uploadingMultipleDocsImages(allData, nextNumber, user_cnic, item, assets_Image, parser)

          } else {
            if ("CustomerCib" in item && item.CustomerCib != null && item.CustomerCib.length > 0) {
              var parserobject = item?.CustomerCib;
              var parserSave = JSON.parse(parserobject)
              item["CustomerCib"] = parserSave;
            }
            let maker = item;
            maker["forms"] = parser;
            BigChangeMethode(maker, assets_Image, user_cnic, parser)
          }
        }

      })
      .catch((error) => { })
  }

  const uploadingMultipleAssetsImages = async (allDataa, indexerr, user_cnicc, Topitemm) => {
    sendTempCustomerAssetsImagesbyBm(allDataa[indexerr - 1], user_cnicc)
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
    sendObjectbyBM(sendingObject, 0, user_cnic, parser?.StationId)
      .then(async (value) => {
        CustomerDataObject = [];
        // *******************************************************************WRITE FILE
        //  const granted = await PermissionsAndroid.request(
        //     PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
        //     {
        //       title: 'Storage Permission',
        //       message: 'App needs access to memory to download the file ',
        //     },
        //   );
        //   if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        //     let get=await FingerModule.writeToFile(JSON.stringify(sendingObject),"SyncupbyBMtoTemp");
        //     console.log("--->write file",get);
        //     CustomerDataObject = [];

        //     // -----------------------------
        //   } else {
        //     Alert.alert(
        //       'Permission Denied!',
        //       'You need to give storage permission to download the file',
        //     );
        //     CustomerDataObject = [];
        //     return;
        //   }

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
    // compositeKey="";
    DeleteCustomerForms(item.id, item.user_cnic)


      .then((value) => {

        DeleteDocImages(item.user_cnic).then(() => {

          DeleteAssetsImages(item.user_cnic).then(() => {



            setToast({
              type: "success",
              message: "Syncup Successfully",
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
  //============================ SYNCUP PROCESS ON TEMP DATABASE==============================END
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
   
  await checkApplicationVersion().then(async(res)=>{

    if((res?.StatusCode == 200 && res?.Version == ApplicationVersion) || res?.StatusCode == 201){

      getCustomerFromsOnly(item.user_cnic).then((value) => {

        var parser = JSON.parse(value[0].forms)
        console.log("==<>>>>", JSON.stringify(parser.loanInfo[0].customerLoan_type.value))
        // if(getUserData.UserData.EmployeeTypeName == "Branch Manager" && parser.loanInfo[0].customerLoan_type.value == "Islamic Finance" )
        // {
        //   Syncup(parser, item, index)  // Direct sync to MIS from branch manager if loan type islamic
        // }else{
          if (getUserData.UserData.EmployeeTypeName == "Verification Officer") {
            Syncup(parser, item, index)  // MIS
          } else {
            var loanInfo = parser.loanInfo[0];
    
            
    
            setTitle("Verifying Customer..")
            setprogressVisible(true)
            let maker = [];
            maker.push({ nic: item.user_cnic, amount: loanInfo.approvedLoan.value, risk: loanInfo.borrowerriskprofile })
            VerifyUser(JSON.stringify(maker)).then((res) => {
              console.log("--->", res)
              setprogressVisible(false)
              if (res.Status > 0) {
                // Alert.alert("Need to insert temp");
                SyncupforLoanVerification(parser, item, index); // TEMP DATABASE
              } else {
                // Alert.alert("Need to insert data in MIS");
                Syncup(parser, item, index)  // MIS
    
              }
    
            }).catch((err) => {
              Alert.alert("Stop!", err)
              setprogressVisible(false)
    
            })
    
    
            // }//
          }
        // }
       
        
        // if (getUserData.UserData.EmployeeTypeName == "Verification Officer") {
        //   Syncup(parser, item, index)  // MIS
        // } else {
        //   var loanInfo = parser.loanInfo[0];
  
          // if(loanInfo.approvedLoan.value>100000){
          //   // Alert.alert("Go in TEMP DATABASE 1")
          //   SyncupforLoanVerification(parser, item, index); // TEMP DATABASE
          // }else if(loanInfo.loanType.value=="Auto Finance" || loanInfo.loanType.value=="Education" || loanInfo.loanType.value=="Personal"){
          //   // Alert.alert("Go in TEMP DATABASE 2")
          //   SyncupforLoanVerification(parser, item, index); // TEMP DATABASE
          // }else if(loanInfo.borrowerriskprofile > 1){
          //   // Alert.alert("Go in TEMP DATABASE 3")
          //   SyncupforLoanVerification(parser, item, index); // TEMP DATABASE
          // }else{
  
          // setTitle("Verifying Customer..")
          // setprogressVisible(true)
          // let maker = [];
          // maker.push({ nic: item.user_cnic, amount: loanInfo.approvedLoan.value, risk: loanInfo.borrowerriskprofile })
          // VerifyUser(JSON.stringify(maker)).then((res) => {
          //   console.log("--->", res)
          //   setprogressVisible(false)
          //   if (res.Status > 0) {
          //     // Alert.alert("Need to insert temp");
          //     SyncupforLoanVerification(parser, item, index); // TEMP DATABASE
          //   } else {
          //     // Alert.alert("Need to insert data in MIS");
          //     Syncup(parser, item, index)  // MIS
  
          //   }
  
          // }).catch((err) => {
          //   Alert.alert("Stop!", err)
          //   setprogressVisible(false)
  
          // })
  
  
          // }//
      //   }
  
      });

    }else{
      setToast({
        type: "error",

        message: "You are using older version of this application. Please update and try again",

      });
    }

  }).catch(()=>{
    console.log("checking Version Error")
  })

   
    
  }
  const RejectGettingData = async (item, index) => {
    
   
    await checkApplicationVersion().then(async(res)=>{
  
      if((res?.StatusCode == 200 && res?.Version == ApplicationVersion) || res?.StatusCode == 201){
  
        getCustomerFromsOnly(item.user_cnic).then((value) => {
  
          var parser = JSON.parse(value[0].forms)
          if (getUserData.UserData.EmployeeTypeName == "Branch Manager") {
           
            RejectSyncup(parser, item, index)  // MIS
          } else{
            alert("Only Branch Manager can reject cases...")
          }
    
        });
  
      }else{
        setToast({
          type: "error",
  
          message: "You are using older version of this application. Please update and try again",
  
        });
      }
  
    }).catch(()=>{
      console.log("checking Version Error")
    })  
    }
  const removeChip = (index) => {
    setFroms([])
    setSearchData([])
    setLoading(true)
    fetchData()
  }

  //my code

  const renderItem = ({ item, index }) => (
    <CustomerRecorditems item={item}
      UserData={UserData}
      comment={commentReject}
      setCommentRecject={val=>setCommentRecject(val)}
      onPressReject={()=>{
        if (item.group_id !== '') {
          RejectuploadingCustomerdata(item.group_id, commentReject).then(async(res) => {
           console.log("here I am now===>", res.data.StatusCode);
           if (res.data.StatusCode === 200) {
             setprogressVisible(true);
             setTitle("Rejecting...");
             DeleteCustomerForms(item.id, item.user_cnic)
               .then((value) => {
                 DeleteDocImages(item.user_cnic).then(() => {
                   DeleteAssetsImages(item.user_cnic).then(() => {
                     setprogressVisible(false);
                     setTitle("Deleting..");
                     setToast({
                       type: "success",
                       message: "Reject Customer Successfully",
                     });  
                     let get2 = getForms;
                     get2.splice(index, 1);
                     setFroms(get2);
                     setFromsOrignal(get2);
                     fetchData();
                   });
                 });
               })
               .catch(() => {
                 // Handle error
               });
           } else {
             alert("Already Reject...");
           }
         });

        }
        else{
               alert("Customer which bleongs to a group can not be reajected")
          setToast({
            type: "Alert",
            message: "Customer which belongs to a group cannot be rejected.",
          });
        }
              
      }}
//my code end

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
        var Commentsparser = JSON.parse(item.Comments)
        if (Commentsparser?.borrowerStaification.value == '') {
          Alert.alert("Stop!", "Please fill Branch Manager Checklist.")
          return;
        }
        Alert.alert("Await!", "Do you really want to Syncup ?",
          [{ text: "Yes", onPress: () => GettingData(item, index) }, { text: 'No' }])
      }}
      onPresscomment={() => props.navigation.navigate('Comments', { item: JSON.parse(item.Comments), id: item.id })}
      onPress={
        async () => {
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
          Alert.alert("Await!", "Do you really want to Update?",
            [{
              text: "Yes", onPress: async () => {
               getCustomerFromsOnly(item.user_cnic).then((value) => {
                  var parser = JSON.parse(value[0].forms)
                  props.Updatecheck({ value: true, id: item.id, customerAnswer: true })
                  props.navigation.navigate('AddForm', { item: parser, user_cnic: item.user_cnic })
                });
              }
            }, { text: 'No' }])
        }
      }
      onPressNavigation={() => {
        handleNavigation(item.Latitude, item.Longitudes)
      }}
      getCibPress={() => getCibReport(item.user_cnic)}
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
      console.log('res=-=>'+JSON.stringify(res.StatusCode))                        
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
      console.log("--->", value)

      if ("CustomerCib" in value[0] && value[0].CustomerCib != null && value[0].CustomerCib.length > 0) {

        var parser = JSON.parse(value[0]?.CustomerCib)

        var message = parser.Message;
        if (message.search(/CIB/) < 0) {

          if (parser?.CreditReport != undefined) {

            setCibReportResponse(undefined)
            setCibReportResponse({ ...parser })

            setReportName("CIR")
            setModalVisible(true)
            //console.log(parser)

          } else {

            Alert.alert("Stop!", "CIR Not Found..")

          }
        } else {
          //console.log(message.substr(0,3));
          if (parser?.CreditReport != undefined) {

            setCibReportResponse(undefined)
            setCibReportResponse({ ...parser })

            setReportName("CIB")
            setModalVisible(true)
            //console.log(parser)

          } else {
            Alert.alert("Stop!", "CIB Not Found..")

          }
        }
        return

      } else {
        Alert.alert("Stop!", "Report Not Found..")
      }
      // console.log("--->", parser?.CreditReport?.)    

    })

    gettingCibReport(userCnic, hasCibData).then((value) => {

      // console.log("--->", value)
      if ("CustomerCib" in value[0] && value[0].CustomerCib != null && value[0].CustomerCib.length > 0) {
        var parser = JSON.parse(value[0]?.CustomerCib)
        if (parser?.CreditReport != undefined) {
          setModalVisible(true)
          //console.log(parser)
          setCibReportResponse(undefined)
          setCibReportResponse({ ...parser })
        } else {
          Alert.alert("Stop!", "CIB Not Found..")
        }
      } else {
        Alert.alert("Stop!", "CIB Not Found..")
      }
    })

  }
  const getCustomerView = (userCnic) =>{
    getCustomer(userCnic).then((res)=>{
      if("forms" in res[0] && res[0].forms != null && res[0].forms.length>0){
        var parser=JSON.parse(res[0]?.forms)
        // console.log("parser==>",JSON.stringify(parser))

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

        {getForms != null && <SwipeListView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 300 }}
          style={{ marginTop: 20, marginLeft: 20, marginRight: 20 }}
          data={getForms}
          keyboardShouldPersistTaps="handled"
          renderItem={renderItem}
          keyExtractor={(item, index) => index.toString()}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={() => {
                fetchData();
              }}
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
              <View style={{flexDirection: 'row',alignItems: 'flex-end',left:20}}>
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
                                    setTitle("Deleting..")
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

        <Pressable style={{ alignItems: 'flex-end', padding: 20 }}
          onPress={() => setModalVisible(false)}
        >
          <EvilIcons name={'close'} size={30} color={'red'} />
        </Pressable>

        <View style={{ paddingTop: 30, flex: 1 }}>
          <ScrollView>
            {cibReportResponse != undefined &&

              getReportName == "CIB" ?

              <CIBView reportDetail={cibReportResponse} />
              :
              <CirView reportDetail={cibReportResponse} />

            }

          </ScrollView>
        </View>

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
export default connect(null, mapDispatchToProps)(LoanVerficationSyncupandSyncdown);

const styles = StyleSheet.create({
  safeview: { flex: 1,  }, 
  card: {
    marginTop: 10, marginLeft: 30, marginRight: 30, paddingLeft: 10
  },
  row: { flexDirection: "row", alignItems: 'center' },
  circle: {
    height: 30, width: 30, borderRadius: 100, marginLeft: 0, marginRight: 10,
    justifyContent: 'center', backgroundColor: '#f1f1f1'
  },
  title: {fontSize:20,  marginBottom:20,backgroundColor:'red',color:'white', padding:15,borderRadius:30,
},
})
  
   
    
    
   
    

