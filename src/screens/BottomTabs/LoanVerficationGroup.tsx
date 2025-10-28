import React, { useEffect, useState } from 'react';
import type { Node } from 'react';
import {
  SafeAreaView,
  ScrollView,
  Pressable,
  PermissionsAndroid,
  StyleSheet,
  Dimensions,
  Alert,
  TextInput,
  ActivityIndicator,
  View, TouchableOpacity,
  RefreshControl,
  NativeModules
} from 'react-native';
const { FingerModule } = NativeModules;
import RNFS from 'react-native-fs';

import moment from 'moment'
import { Card } from 'react-native-paper'
import { AppStatusBar, CustomerRecorditems, CustomProgressDialoge, Header, Nodata, Search, TextView } from '../../components';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Entypo from 'react-native-vector-icons/Entypo';
import LottieView from 'lottie-react-native';
import { useNavigation } from '@react-navigation/native';
import { SwipeListView, SwipeRow } from "react-native-swipe-list-view";
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { connect, useSelector } from 'react-redux';
import { checkingCustomerByCnic, DeleteAssetsImages, DeleteCustomerForms, DeleteCustomerFormsbyCnic, DeleteCustomerGurantorsbyId, DeleteDocImages, DeleteGroupsForms, DeleteSelectedGurantors, DeleteSelectedGurantorsbyBM, getAllGroupGurantors, getAssetsDocumentsforSyncup, getCustomerFroms, getCustomerFromsByidforGroupSyncup, getGroupGurantors, getGroupsFroms, getGroupsFromsforBM, getLoanDocuments, insertCustomerFromDatawithPromise, insertGroupFromData, insertMultipleAssetsImages, insertMultipleDocumentsImages, insert_Group_Gurantors } from '../../sqlite/sqlitedb';
import { Colors } from '../../theme';
var { height, width } = Dimensions.get('window');
import { useDispatch } from "react-redux";
import GroupRecorditems from '../../components/GroupRecorditems';
import { CallforTags, CheckingTags, deleteLoanOfficerdata, getObjectbyBranchManager, sendObjectbyBM, sendTempCustomerAssetsImagesbyBm, updateTempCustomerDocsimagesbyBm, uploadingAssetsImage, uploadingCustomerdata, RejectuploadingCustomerdata,uploadingDocs, VerifyUser, checkApplicationVersion } from '../../apis_auth/apis';
import Toast from '../../components/Toast';
import DateChips from '../../components/DateChips';
import { ApplicationVersion, releaseDate } from '../../utilis/ContsValues';
import { Item } from 'react-native-paper/lib/typescript/components/List/List';
import RejectCommentModal from '../../components/RejectCommentModal';
const LoanVerficationGroup: () => Node = (props) => {
  let customerSyncUpDatas = [];
  let asstesTags = [];
  let Docs = [];
  let assets_Image = [];
  let groupGurantors = [];
  let AllCustomer = [];
  var imagesCounter = 0;
  let check = 0;
  let obj = {};
  var convert = {};
  let processItem = {};
  var processStatus=0;
  const [title, setTitle] = React.useState('')
  const [getForms, setFroms] = useState(null)
  const [getFormsOrignal, setFromsOrignal] = useState(null)
  const [noData, setNoData] = useState(false)
  const [progress, setProgresss] = useState(false)
  const [Null, setNull] = useState(false)
  const [loading, setLoading] = useState(true)
  const [allData, setAllData] = useState({});
  const StationReducer = useSelector((state) => state.StationReducer);
  const [toast, setToast] = React.useState({ value: "", type: "" });
  const [dialogeCount, setDialogeCount] = useState("Syncing up")
  const [searchData, setSearchData] = React.useState([])
  const [refreshing, setRefreshing] = React.useState(false);
  const [DeleteChecker, setDeleteChecker] = React.useState(true)
  const [RejectChecker, setRejectChecker] = React.useState(true)
  const [UserData, setUserData] = React.useState(undefined);
  const getUserData = useSelector((state) => state.UserData);

  React.useEffect(async () => {

    setUserData(getUserData);
  }, []);
  const [container, setContainer] = React.useState(
    {
      topBar: true,
      startDate: '',
      endDate: "",
      Cnic: "",
      activeInput: true
    })

  const dispatch = useDispatch();

  useEffect(() => {
    const unsubscribe = props.navigation.addListener("focus", () => {
      fetchData();
    });
  }, [])
  // ******************************************* SERACH
  const searchText = (e) => {

    let text = e.toLowerCase();

    let filteredName = getFormsOrignal.filter((item) => {
      if (item.group_name.toLowerCase().match(text)) {
        return item.group_name.toLowerCase().match(text);
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


//my code
  const [commentReject, setCommentRecject] = useState('');
  const [modalVisiblereject, setModalVisibleReject] = useState(false);
 // console.log("-=-=-=-=-=->>>>>",modalVisiblereject)
  const handleOpenModal = () => {
    setModalVisibleReject(true);
  };

  // *********************************************************************
  // ========================== SYNC UP IN MIS Process Start ==============================
  // *********************************************************************
  const GroupSyncup = (item, index) => {
    
   
    processStatus=1;
    //refresh all varibales 
    customerSyncUpDatas = [];
    asstesTags = [];
    Docs = [];
    assets_Image = [];
    groupGurantors = [];
    AllCustomer = [];
    imagesCounter = 0;
    check = 0;
    obj = {};
    convert = {};
    processItem = {};
    //refresh all varibales 

    setProgresss(true)

    setTitle("Checking Tags..")

    processItem = item

    var parser = item.groupForm

    var fromPraser = JSON.parse(parser);

    convert = fromPraser.groupMembers;

    GettingCustomertags(convert.length, convert)

    getAllGroupGurantors(item.composite_key).then((value: Array) => {

      groupGurantors = value;
      // console.log("groupGurantors", value)

    })
    obj = { length: convert.length, members: convert, fromPraser: fromPraser, index: index }

    // setAllData({...obj})

    // GettingCustomerDataRecursive(convert.length,convert,fromPraser,index)


  }


  //Recursion for getting all customer Images
  const GettingCustomerDoc = async (fromNumber, members) => {
    getLoanDocuments(members[fromNumber - 1].NicNumber).then((value) => {

      if (value) {

        if (value.length > 0) {

          value.map((underitem, underindex) => {

            Docs.push({
              CustomerId: members[fromNumber - 1].id,
              DocumentId: underindex,
              Image: underitem.imgValue,
              AddedByDesignation:"addedBy" in  underitem ? underitem.addedBy:"",
              LoanId: members[fromNumber - 1].id,
              NicNumber: members[fromNumber - 1].NicNumber,
              UniqueCode: "4813_16" + Math.random(),
              ImageName: underitem.imgName.value,

            })
          })
          //////////////////////////////////////////////////////////////////////////////
          //(Uploading docs) (recursivecountDocsuploading)
          /////////////////////////////////////////////////////////////////////
          //----------------------
          let nextNumber = fromNumber - 1;

          // console.log("nextNumber", nextNumber)
          // console.log("nextNumber", nextNumber)
          if (nextNumber > 0) {

            GettingCustomerDoc(nextNumber, members);

          } else {
            console.log("Docs=======>", Docs.length)
            //////////////////////////////////////////////////////////////////////////////
            //(Uploading docs) (recursivecountDocsuploading)
            /////////////////////////////////////////////////////////////////////
            imagesCounter = 0;
            setTitle("Uploading Docs..")
            recursivecountDocsuploading(Docs, Docs.length)

          }

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
  };
  const RejectGettingCustomerDoc = async (fromNumber, members) => {

    getLoanDocuments(members[fromNumber - 1].NicNumber).then((value) => {

      if (value) {

        if (value.length > 0) {

          value.map((underitem, underindex) => {

            Docs.push({
              CustomerId: members[fromNumber - 1].id,
              DocumentId: underindex,
              Image: underitem.imgValue,
              AddedByDesignation:"addedBy" in  underitem ? underitem.addedBy:"",
              LoanId: members[fromNumber - 1].id,
              NicNumber: members[fromNumber - 1].NicNumber,
              UniqueCode: "4813_16" + Math.random(),
              ImageName: underitem.imgName.value,

            })
          })
          //////////////////////////////////////////////////////////////////////////////
          //(Uploading docs) (recursivecountDocsuploading)
          /////////////////////////////////////////////////////////////////////
          //----------------------
          let nextNumber = fromNumber - 1;

          // console.log("nextNumber", nextNumber)
          // console.log("nextNumber", nextNumber)
          if (nextNumber > 0) {

            RejectGettingCustomerDoc(nextNumber, members);

          } else {
            console.log("Docs=======>", Docs.length)
            //////////////////////////////////////////////////////////////////////////////
            //(Uploading docs) (recursivecountDocsuploading)
            /////////////////////////////////////////////////////////////////////
            imagesCounter = 0;
            setTitle("Uploading Docs..")
            RejectrecursivecountDocsuploading(Docs, Docs.length)

          }

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
  };

  //Recursion for getting all customer tags
  const GettingCustomertags = async (fromNumber, members) => {
    getCustomerFromsByidforGroupSyncup(setNull, members[fromNumber - 1].NicNumber).then((values) => {
      var parser = JSON.parse(values[0].forms);
      var loanInfo = parser.loanInfo[0];

      var assestsInfo = parser.assestsInfo[0];

      var guarantorInfo = parser.guarantorInfo[0];
      var customer=parser.customerInfo[0];


      console.log("--->LOanOfficerSyncup", JSON.stringify(loanInfo.loanType))

      if (loanInfo.loanType == undefined) {
        setProgresss(false)
        setToast({

          type: "error",

          message: "Please fill loan information first!",

        });
        return
      }

      if (assestsInfo.assetName.value == "") {
        setProgresss(false)
        setToast({

          type: "error",

          message: "Please fill assets information first!",

        });
        return
      }
      if(customer.evrisys_customerImage == undefined){
        setProgresss(false)
        setToast({
  
          type: "error",
  
          message: "Please upload E-Vrisys  image first!",
  
        });
        return
      }
      if (loanInfo.customerLoan_type.value != "Normal" && guarantorInfo == undefined) {
        setProgresss(false)
        setToast({

          type: "error",

          message: "Please fill Gurantor information first. Because you have selected loan type as " + loanInfo.customerLoan_type.value,

        });
        return
      }
      //////////////////////////////////////////////////////////////////////////////
      //Getting Tags for checking...
      /////////////////////////////////////////////////////////////////////

      var temp = parser.assestsInfo;
      // console.log("temp=======>",temp)

      temp.map((underitem, undexindex) => {
        if (underitem.assetTagName.value && underitem.assetTagId.value) {
          asstesTags.push({ AssetTagId: underitem.assetTagId.value, AssetTagName: underitem.assetTagName.value })

        }
      })

      //----------------------
      let nextNumber = fromNumber - 1;

      if (nextNumber > 0) {

        GettingCustomertags(nextNumber, members);

      } else {

        console.log("Tags=======>", asstesTags)

        CheckingTags(asstesTags, setNull).then((value) => {

          console.log("error" + value)


          if (value.length > 0) {

            setToast({

              type: "error",

              message: "" + value,

            });

            setTitle("Updating Tags..")

            setProgresss(true)

            CallforTags(StationReducer.station.stationId, setProgresss).then(() => {

              setProgresss(false)

            }).catch(() => {

              setProgresss(false)

            })

          } else {

            asstesTags = [];
            // return
            setTitle("Uploading Customers Docs..")

            GettingCustomerDoc(convert.length, convert)

          }
        }).catch((error) => {

          Alert.alert("Check your internet.", "Try Again! \n" + error, [{ text: "ok", onPress: () => { } }])

        })
      }

    })

      .catch((error) => {

      })



  };

  const RejectGettingCustomertags = async (fromNumber, members) => {
    getCustomerFromsByidforGroupSyncup(setNull, members[fromNumber - 1].NicNumber).then((values) => {
      var parser = JSON.parse(values[0].forms);
      var loanInfo = parser.loanInfo[0];

      var assestsInfo = parser.assestsInfo[0];

      var guarantorInfo = parser.guarantorInfo[0];
      var customer=parser.customerInfo[0];
      

    

      if (loanInfo.loanType == undefined) {
        setProgresss(false)
        setToast({

          type: "error",

          message: "Please fill loan information first!",

        });
        return
      }

      if (assestsInfo.assetName.value == "") {
        setProgresss(false)
        setToast({

          type: "error",

          message: "Please fill assets information first!",

        });
        return
      }
      if(customer.evrisys_customerImage == undefined){
        setProgresss(false)
        setToast({
  
          type: "error",
  
          message: "Please upload E-Vrisys  image first!",
  
        });
        return
      }
      if (loanInfo.customerLoan_type.value != "Normal" && guarantorInfo == undefined) {
        setProgresss(false)
        setToast({

          type: "error",

          message: "Please fill Gurantor information first. Because you have selected loan type as " + loanInfo.customerLoan_type.value,

        });
        return
      }
      //////////////////////////////////////////////////////////////////////////////
      //Getting Tags for checking...
      /////////////////////////////////////////////////////////////////////

      var temp = parser.assestsInfo;
      // console.log("temp=======>",temp)

      temp.map((underitem, undexindex) => {
        if (underitem.assetTagName.value && underitem.assetTagId.value) {
          asstesTags.push({ AssetTagId: underitem.assetTagId.value, AssetTagName: underitem.assetTagName.value })

        }
      })
      //----------------------
      let nextNumber = fromNumber - 1;
      
      if (nextNumber > 0) {
        
        RejectGettingCustomertags(nextNumber, members);
     

      } else {

        console.log("Tags=======>", asstesTags)
        CheckingTags(asstesTags, setNull).then((value) => {
          
          console.log("error" + value)
          
          
          if (value.length > 0) {
            
            setToast({
              
              type: "error",
              
              message: "" + value,
              
            });
            
            setTitle("Updating Tags..")
            
            setProgresss(true)
           

            CallforTags(StationReducer.station.stationId, setProgresss).then(() => {

              setProgresss(false)

            }).catch(() => {

              setProgresss(false)

            })

          } else {

            asstesTags = [];
            // return
            setTitle("Uploading Customers Docs..")

            RejectGettingCustomerDoc(convert.length, convert)

          }
        }).catch((error) => {

          Alert.alert("Check your internet.", "Try Again! \n" + error, [{ text: "ok", onPress: () => { } }])

        })
      }

    })

      .catch((error) => {

      })



  };
  //Recursion for getting all customer data and upload
  const GettingCustomerDataRecursive = async (fromNumber, members, fromPraser, index) => {

    setDialogeCount("Syncing up..")

    console.log("---->", members[fromNumber - 1].NicNumber + "<----")

    getCustomerFromsByidforGroupSyncup(setProgresss, members[fromNumber - 1].NicNumber).then(async (values) => {

      // console.log("---customer Data===>",values[0].)
      
      GettingCustomerData(values[0], fromNumber)
      //running---------------------------------

      let nextNumber = fromNumber - 1;

      if (nextNumber > 0) {

        GettingCustomerDataRecursive(nextNumber, members, fromPraser, index);

      } else {
        /////////////////////////////////////////////////////////////////////////////////
        //Making object of group
        ///////////////////////////////////////////////////////////////////////////////////////////////

        var group = {

          Group_Added_By: fromPraser.addedBy.value,
          Group_Added_By_Comment: fromPraser.commentOfAddedby.value,
          Group_Added_By_Designation: fromPraser.addedByDesignation.value,
          Group_Name: fromPraser.groupName.value,
          Group_Note: fromPraser.groupNote.value,
          Group_Status: fromPraser.groupStatus.value,
          Group_Verified_By: fromPraser.verifiedBy.value,
          Group_Verified_By_Comment: fromPraser.commentsofVerifiedby.value,
          Group_Verified_By_Designation: fromPraser.verifiedByDesignation.value,
          groupId: index,
          BMLocation: fromPraser.groupLocation == undefined ? "25.394759-68.3312667" : fromPraser.groupLocation,
          VerificationOfficerLocation: fromPraser?.verificationOffLoc == undefined ? "25.394759-68.3312667" : fromPraser?.verificationOffLoc,
          GroupImagebyVerificationOff: fromPraser?.groupImagebyVerificationOff == undefined ? "" : fromPraser?.groupImagebyVerificationOff,
          VisitType: fromPraser.visitType?.value == "Physical Visit" ? 1 : 0,
          VerificationOfficerComment: fromPraser?.verificationComments?.value,
          VerificationByDesignation: fromPraser?.verificationByDesignation?.value,
          VerificationOfficerName: fromPraser?.verificationofficerName?.value,
          VerificationOfficerDate: moment(new Date()).format('YYYY-MM-DD HH:mm:ss'),
          syncUpStatus: 0,
        }
        console.log("=====================group-------------------->")
        // console.log("==>", group)
        console.log("=====================group-------------------->")

        let groupBMChecklistAnswers = [
          {
            Group_Id: index,
            gAppraisalPlaceValue: fromPraser.socialAppraisal.value,
            gBorrowerVisitValue: fromPraser.visitedBorrower.value,//1
            groupActionPlan1: fromPraser.riskAssementno1.value,//""
            groupActionPlan2: fromPraser.riskAssementno2.value,//""
            groupActionPlan3: fromPraser.riskAssementno3.value,//""
            bmGAddress: fromPraser.borrowerAddress.value,//""
            groupBMChecklistAns1: fromPraser.counductPhysicalVisit.value,//0,
            groupBMChecklistAns10: fromPraser.socialandManagmentPolicy.value,//0,
            groupBMChecklistAns11: fromPraser.verifiedCIBPolicy.value,//0,
            groupBMChecklistAns12: fromPraser.doesBorrowerEnivro.value,//0,
            groupBMChecklistAns13: fromPraser.doesEnterprise.value,//0,

            groupBMChecklistAns15: "borrowerCashFlow" in fromPraser ? fromPraser.borrowerCashFlow.value : 1,
            groupBMChecklistAns16: "supportingCnicForFemale" in fromPraser ? fromPraser.supportingCnicForFemale.value : 1,
            groupBMChecklistAns17: "borrowerRepaymentCapacity" in fromPraser ? fromPraser.borrowerRepaymentCapacity.value : 1,
            groupBMChecklistAns18: "borrowerBusinessORHome" in fromPraser ? fromPraser.borrowerBusinessORHome.value : 1,
            groupBMChecklistAns19: "repaymentCapacityAnalysis" in fromPraser ? fromPraser.repaymentCapacityAnalysis.value : 1,
            groupBMChecklistAns20: "isTheLoanPricingIsClearlyDisclosed" in fromPraser ? fromPraser.isTheLoanPricingIsClearlyDisclosed.value : 1,
            groupBMChecklistAns21: "isTheBorrowerInformedAboutTheGrievance" in fromPraser ? fromPraser.isTheBorrowerInformedAboutTheGrievance.value : 1,
            groupBMChecklistAns22: "isTheBorrowerAwareAboutTheCollateral" in fromPraser ? fromPraser.isTheBorrowerAwareAboutTheCollateral.value : 1,
            groupBMChecklistAns23: "anyMajorRisksInvolvedInBusiness" in fromPraser ? fromPraser.anyMajorRisksInvolvedInBusiness.value : 1,
            groupBMChecklistAns23Desc: "anyMajorRisksInvolvedInBusiness" in fromPraser ? fromPraser.anyMajorRisksInvolvedInBusiness.detail : null,
           
            groupBMChecklistAns2: fromPraser.verifiedreApparisal.value,//0,
            groupBMChecklistAns3: fromPraser.verifiedRepaymentHistory.value,//0,
            groupBMChecklistAns4: fromPraser.criticalAssetsValuation.value,//0,
            groupBMChecklistAns5: fromPraser.verifiedbyContactNumber.value,//0,
            groupBMChecklistAns6: fromPraser.meetwithSocialResponsible.value,//0,
            groupBMChecklistAns7: fromPraser.meetwithPersonalGuarantee.value,//0,
            groupBMChecklistAns8: fromPraser.verifiedProvidedDoc.value,//0,
            groupBMChecklistAns9: fromPraser.amlPolicyandProcedure.value,//0,
            groupImplTimeline1: fromPraser.riskAssementTimelineone.value,//0,
            groupImplTimeline2: fromPraser.riskAssementTimelinetwo.value,//0,
            groupImplTimeline3: fromPraser.riskAssementTimelinethree.value,//0,
            bmGName: fromPraser.borrowerName.value,//"w",
            groupReason: fromPraser.borrowerRemarks.value,//"56",
            gDecisionValue: fromPraser.borrowerApproval.value,//2,
            gRemarksValue: fromPraser.borrowerStaification.value,//
          }
        ];
        /////////////////////////////////////////////////////////////////////////////////
        //Making object of groupMembers
        ///////////////////////////////////////////////////////////////////////////////////////////////
        let groupMembers = [];
        members.map((i, ix) => {
          groupMembers.push({
            CustomerGroupId: index + 1,
            CustomerGroupMemberId: i.CustomerGroupMemberId,
            CustomerId: i.CustomerGroupMemberId,
            Fullname: i.Fullname,
            IsGroupLeader: i.IsGroupLeader,
            NicNumber: i.NicNumber,
          })
        })
        console.log("=====================Uploading-------------------->")

        /////////////////////////////////////////////////////////////////////////////////
        //Making object of final Object
        ///////////////////////////////////////////////////////////////////////////////////////////////
        var Uploading = {
          customerSyncUpDatas: customerSyncUpDatas,
          group: group,
          groupBMChecklistAnswers: groupBMChecklistAnswers,
          groupMembers: groupMembers

        }
       
        console.log("=====================Uploading-------------------->")
        uploadingCustomerdata(Uploading, setProgresss)
          .then(async(value) => {
 // console.log("--->IN THE END",groupMembers);
        // *******************************************************************WRITE FILE
        // const granted = await PermissionsAndroid.request(
        //       PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
        //       {
        //         title: 'Storage Permission',
        //         message: 'App needs access to memory to download the file ',
        //       },
        //     );
        //     if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        //       let get=await FingerModule.writeToFile(JSON.stringify(Uploading),"SyncupGroupbyBMtoMIS");
        //       console.log("--->write file",get);
    
        //       // -----------------------------
        //     } else {
        //       Alert.alert(
        //         'Permission Denied!',
        //         'You need to give storage permission to download the file',
        //       );
        //       return;
        //      }

        // **********************************************************************
        /////////////////////////////////////////////////////////////////////////////////
        //(Uploading)
        ///////////////////////////////////////////////////////////////////////////////////////////////
        //  return

            console.log("--->IN THE END", value);

            customerSyncUpDatas = [];

            if (value === "Success") {
              //////////////////////////////////////////////////////////////////////////////
              // (Uploading AssetsImage) (recursivecountAssetsuploading)
              /////////////////////////////////////////////////////////////////////
              setTitle("Uploading Assets Docs..")
              imagesCounter = 0;
              recursivecountAssetsuploading(assets_Image, assets_Image.length)
            } else {

              setToast({

                type: "error",

                message: "" + value,

              });
            }


          })

          .catch((error) => {

          })

        // props.navigation.goBack();
      }
    })

  };

//   const RejectGettingCustomerDataRecursive = async (fromNumber, members, fromPraser, index) => {

//     setDialogeCount("Rejectiong Case...")
   

//     console.log("---->", members[fromNumber - 1].NicNumber + "<----")

//     getCustomerFromsByidforGroupSyncup(setProgresss, members[fromNumber - 1].NicNumber).then(async (values) => {

//       // console.log("---customer Data===>",values[0].)
      
//       GettingCustomerData(values[0], fromNumber)
//       //running---------------------------------

//       let nextNumber = fromNumber - 1;

//       if (nextNumber > 0) {

//         RejectGettingCustomerDataRecursive(nextNumber, members, fromPraser, index);

//       } else {
//         /////////////////////////////////////////////////////////////////////////////////
//         //Making object of group
//         ///////////////////////////////////////////////////////////////////////////////////////////////

//         var group = {

//           Group_Added_By: fromPraser.addedBy.value,
//           Group_Added_By_Comment: fromPraser.commentOfAddedby.value,
//           Group_Added_By_Designation: fromPraser.addedByDesignation.value,
//           Group_Name: fromPraser.groupName.value,
//           Group_Note: fromPraser.groupNote.value,
//           Group_Status: fromPraser.groupStatus.value,
//           Group_Verified_By: fromPraser.verifiedBy.value,
//           Group_Verified_By_Comment: fromPraser.commentsofVerifiedby.value,
//           Group_Verified_By_Designation: fromPraser.verifiedByDesignation.value,
//           groupId: index,
//           BMLocation: fromPraser.groupLocation == undefined ? "25.394759-68.3312667" : fromPraser.groupLocation,
//           VerificationOfficerLocation: fromPraser?.verificationOffLoc == undefined ? "25.394759-68.3312667" : fromPraser?.verificationOffLoc,
//           GroupImagebyVerificationOff: fromPraser?.groupImagebyVerificationOff == undefined ? "" : fromPraser?.groupImagebyVerificationOff,
//           VisitType: fromPraser.visitType?.value == "Physical Visit" ? 1 : 0,
//           VerificationOfficerComment: fromPraser?.verificationComments?.value,
//           VerificationByDesignation: fromPraser?.verificationByDesignation?.value,
//           VerificationOfficerName: fromPraser?.verificationofficerName?.value,
//           VerificationOfficerDate:moment(new Date()).format('YYYY-MM-DD'),
//           syncUpStatus: 0,
//         }
//         console.log("=====================group-------------------->")
//         // console.log("==>", group)
//         console.log("=====================group-------------------->")

//         let groupBMChecklistAnswers = [
//           {
//             Group_Id: index,
//             gAppraisalPlaceValue: fromPraser.socialAppraisal.value,
//             gBorrowerVisitValue: fromPraser.visitedBorrower.value,//1
//             groupActionPlan1: fromPraser.riskAssementno1.value,//""
//             groupActionPlan2: fromPraser.riskAssementno2.value,//""
//             groupActionPlan3: fromPraser.riskAssementno3.value,//""
//             bmGAddress: fromPraser.borrowerAddress.value,//""
//             groupBMChecklistAns1: fromPraser.counductPhysicalVisit.value,//0,
//             groupBMChecklistAns10: fromPraser.socialandManagmentPolicy.value,//0,
//             groupBMChecklistAns11: fromPraser.verifiedCIBPolicy.value,//0,
//             groupBMChecklistAns12: fromPraser.doesBorrowerEnivro.value,//0,
//             groupBMChecklistAns13: fromPraser.doesEnterprise.value,//0,

//             groupBMChecklistAns15: "borrowerCashFlow" in fromPraser ? fromPraser.borrowerCashFlow.value : 1,
//             groupBMChecklistAns16: "supportingCnicForFemale" in fromPraser ? fromPraser.supportingCnicForFemale.value : 1,
//             groupBMChecklistAns17: "borrowerRepaymentCapacity" in fromPraser ? fromPraser.borrowerRepaymentCapacity.value : 1,
//             groupBMChecklistAns18: "borrowerBusinessORHome" in fromPraser ? fromPraser.borrowerBusinessORHome.value : 1,
//             groupBMChecklistAns19: "repaymentCapacityAnalysis" in fromPraser ? fromPraser.repaymentCapacityAnalysis.value : 1,
//             groupBMChecklistAns20: "isTheLoanPricingIsClearlyDisclosed" in fromPraser ? fromPraser.isTheLoanPricingIsClearlyDisclosed.value : 1,
//             groupBMChecklistAns21: "isTheBorrowerInformedAboutTheGrievance" in fromPraser ? fromPraser.isTheBorrowerInformedAboutTheGrievance.value : 1,
//             groupBMChecklistAns22: "isTheBorrowerAwareAboutTheCollateral" in fromPraser ? fromPraser.isTheBorrowerAwareAboutTheCollateral.value : 1,
//             groupBMChecklistAns23: "anyMajorRisksInvolvedInBusiness" in fromPraser ? fromPraser.anyMajorRisksInvolvedInBusiness.value : 1,
//             groupBMChecklistAns23Desc: "anyMajorRisksInvolvedInBusiness" in fromPraser ? fromPraser.anyMajorRisksInvolvedInBusiness.detail : null,
           
//             groupBMChecklistAns2: fromPraser.verifiedreApparisal.value,//0,
//             groupBMChecklistAns3: fromPraser.verifiedRepaymentHistory.value,//0,
//             groupBMChecklistAns4: fromPraser.criticalAssetsValuation.value,//0,
//             groupBMChecklistAns5: fromPraser.verifiedbyContactNumber.value,//0,
//             groupBMChecklistAns6: fromPraser.meetwithSocialResponsible.value,//0,
//             groupBMChecklistAns7: fromPraser.meetwithPersonalGuarantee.value,//0,
//             groupBMChecklistAns8: fromPraser.verifiedProvidedDoc.value,//0,
//             groupBMChecklistAns9: fromPraser.amlPolicyandProcedure.value,//0,
//             groupImplTimeline1: fromPraser.riskAssementTimelineone.value,//0,
//             groupImplTimeline2: fromPraser.riskAssementTimelinetwo.value,//0,
//             groupImplTimeline3: fromPraser.riskAssementTimelinethree.value,//0,
//             bmGName: fromPraser.borrowerName.value,//"w",
//             groupReason: fromPraser.borrowerRemarks.value,//"56",
//             gDecisionValue: fromPraser.borrowerApproval.value,//2,
//             gRemarksValue: fromPraser.borrowerStaification.value,//
//           }
//         ];
//         /////////////////////////////////////////////////////////////////////////////////
//         //Making object of groupMembers
//         ///////////////////////////////////////////////////////////////////////////////////////////////
//         let groupMembers = [];
//         members.map((i, ix) => {
//           groupMembers.push({
//             CustomerGroupId: index + 1,
//             CustomerGroupMemberId: i.CustomerGroupMemberId,
//             CustomerId: i.CustomerGroupMemberId,
//             Fullname: i.Fullname,
//             IsGroupLeader: i.IsGroupLeader,
//             NicNumber: i.NicNumber,
//           })
//         })
//         console.log("=====================Uploading-------------------->")

//         /////////////////////////////////////////////////////////////////////////////////
//         //Making object of final Object
//         ///////////////////////////////////////////////////////////////////////////////////////////////
//         var Uploading = {
//           customerSyncUpDatas: customerSyncUpDatas,
//           group: group,
//           groupBMChecklistAnswers: groupBMChecklistAnswers,
//           groupMembers: groupMembers

//         }
       
//         console.log("=====================Uploading-------------------->12",Uploading)
//         // return
//         RejectuploadingCustomerdata(Uploading, setProgresss)
//           .then(async(value) => {
//  // console.log("--->IN THE END",groupMembers);
//         // *******************************************************************WRITE FILE
//         // const granted = await PermissionsAndroid.request(
//         //       PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
//         //       {
//         //         title: 'Storage Permission',
//         //         message: 'App needs access to memory to download the file ',
//         //       },
//         //     );
//         //     if (granted === PermissionsAndroid.RESULTS.GRANTED) {
//         //       let get=await FingerModule.writeToFile(JSON.stringify(Uploading),"SyncupGroupbyBMtoMIS");
//         //       console.log("--->write file",get);
    
//         //       // -----------------------------
//         //     } else {
//         //       Alert.alert(
//         //         'Permission Denied!',
//         //         'You need to give storage permission to download the file',
//         //       );
//         //       return;
//         //      }

//         // **********************************************************************
//         /////////////////////////////////////////////////////////////////////////////////
//         //(Uploading)
//         ///////////////////////////////////////////////////////////////////////////////////////////////
//         //  return

//             console.log("--->IN THE END", value);

//             customerSyncUpDatas = [];

//             if (value === "Success") {
//               //////////////////////////////////////////////////////////////////////////////
//               // (Uploading AssetsImage) (recursivecountAssetsuploading)
//               /////////////////////////////////////////////////////////////////////
//               setTitle("Uploading Assets Docs..")
//               imagesCounter = 0;
//               recursivecountAssetsuploading(assets_Image, assets_Image.length)
//             } else {

//               setToast({

//                 type: "error",

//                 message: "" + value,

//               });
//             }


//           })

//           .catch((error) => {

//           })

//         // props.navigation.goBack();
//       }
//     })

//   };
  //////////////////////////////////////////////////////////////////////////////
  //Getting Customer Data ...
  /////////////////////////////////////////////////////////////////////
  const GettingCustomerData = (item, index) => {
    var parser = JSON.parse(item.forms)
    var converter = item.CustomerAnswers
    var parser2 = JSON.parse(converter)
    var CustomerAns = parser2.answerArray
    // console.log("xxxxx?",CustomerAns)


    let assets = []
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
          CustomerAssetId: '' + underindex+1,
          CustomerId: '' + item.id,
          Notes: '' + underitem.assetNote.value,
          _CustomerAssetNameId: underindex
        }
      )
      getAssetsDocumentsforSyncup(item.user_cnic).then((value) => {
        if (value) {
          if (value.length > 0) {
            value.map((imageitem, imageindex) => {
              console.log((underindex+1) +"=^="+ imageitem.assets_id)
              if ((underindex+1) == imageitem.assets_id) {
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
      // underitem.assets_Image.map((imageitem, imageindex) => {
      //   assets_Image.push({
      //     AssetsDocumentId: imageindex,
      //     Assets_Id: underindex,
      //     Image: imageitem.imgValue,
      //     NicNumber: item.user_cnic,
      //     assets_tag: underitem.assetTagName.value,
      //     Unique_Code: "4813_16" + Math.random(),
      //     ImageName: imageitem.imgName.value,
      //   })
      // })
    });
    var customerInfo = parser.customerInfo[0];
    //////////////////////////////////////////////////////////////////////////////
    //Getting customer form vlaues...
    /////////////////////////////////////////////////////////////////////
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
      CommentImageStr: obj?.fromPraser?.groupImage,
      CommentImageTemp: obj?.fromPraser?.groupImage,
      JobSalaryCardImage: customerInfo.customer_jobCard == undefined ? "" : customerInfo.customer_jobCard,
      E_VerisysVerficationImage: customerInfo.evrisys_customerImage == undefined ? "" : customerInfo.evrisys_customerImage,
      IsEmployed: customerInfo.customer_isEmployeed ? 1 : 0,

      CustomerId: item.id,
      CustomerType: customerInfo.customer_userType == undefined ? 0 : customerInfo.customer_userType.index,
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
      NICExpiryDate: customerInfo.customer_cnicExpireDate,
      NICIssueDate: customerInfo.customer_cnicissueDate,
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
      regionName: customerInfo.customer_region == undefined ? "" : customerInfo.customer_region,
      stationId: parser?.StationId,
      stationName: parser?.StationName,
      status: 0,
      syncStatus: 0,
    }
    console.log("==================================>customer")
    console.log("==================================>parser.StationId",parser?.StationId)
    console.log("==================================>parser.StationId",parser?.StationName)
    console.log("==================================>customer")

    // console.log("customerInfo.evrisys_customerImage", customerInfo.evrisys_customerImage)

    // console.log("=========================" + JSON.stringify(customerInfo.customer_img))

    // console.log("==================================>customer")
    // return
    //////////////////////////////////////////////////////////////////////////////
    //Getting HALFNAME form vlaues...
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
    //Getting familyMember form vlaues...
    /////////////////////////////////////////////////////////////////////
    let familyMembers = []
    parser.familyMemberInfo.map((underitem, underindex) => {
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
    //Getting guaranteers form vlaues...
    //////////////////////////////////////////////////////////////////////
    let guaranteers = [];
    let maker = parser.guarantorInfo;
    let remover = [];
    //---------------------REMOVING SELF FROM GURANTORS 
    groupGurantors.map((removerItem, removerindex) => {

      // console.log(removerItem.guarantor_cnic.value + "========" + customerInfo.customer_cnicNumber.value)

      if (removerItem.guarantor_cnic.value != item.user_cnic) {

        remover.push(removerItem)

      }
    })

    let temp = maker.concat(remover)

    temp.map((underitem, underindex) => {

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
    // console.log("=================== GURANTORS ====================")
    // console.log("=>", guaranteers)
    // console.log("=================== GURANTORS ====================")

    //////////////////////////////////////////////////////////////////////////////
    //Getting Loan form vlaues...
    //////////////////////////////////////////////////////////////////////
    var loanInfo = parser.loanInfo[0];
    var Loan = {
      AmountRequiredForBusiness: loanInfo.amountRequiredforBusiness.value,
      AnyOtherExpense: loanInfo.anyOtherExpenses.value,
      AnyOtherRentalIncome: loanInfo.rentalIncome.value,
      ApprovedLoanAmount: loanInfo.approvedLoan.value,
      BorrowerRiskProfile: loanInfo.borrowerriskprofile == 1 ? 0 : loanInfo.borrowerriskprofile == 2 ? 0.5 : loanInfo.borrowerriskprofile == 3 && 1,
      EsmProductRisk: loanInfo.EsmProductRisk,
      EsmProductItemRisk:loanInfo.EsmProductItemRisk,
      EsmProductRiskValue:loanInfo.EsmProductRiskValue,
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
      RepaymentFrequency: loanInfo.selectRepaymentFrequency == undefined ? "" : loanInfo.selectRepaymentFrequency.index + 1,
      RequestedLoanAmount: loanInfo.requestedLoan.value,
      NumericalValue: loanInfo.numericalValue.value , //my code
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
      IsEbanking:'IsEbanking' in loanInfo ? loanInfo.IsEbanking : 0,
      PreviousLoanStatus: '' + loanInfo.doyouwantSolarTopupLoan,
      ApplicationVersion:''+ApplicationVersion+"("+releaseDate+")",
    }


    /////////////////////////////////////////////////////////////////////////////////
    //Getting values of poverty questions....
    ///////////////////////////////////////////////////////////////////////////////////////////////
    var questionnaireAnswer = {
      Answer1: "" + loanInfo.questionsno1.replace("u003E",">").replace("u003C","<"),
      Answer2: "" + loanInfo.questionsno2.replace("u003E",">").replace("u003C","<"),
      Answer3: "" + loanInfo.questionsno3.replace("u003E",">").replace("u003C","<"),
      Answer4: "" + loanInfo.questionsno4.replace("u003E",">").replace("u003C","<"),
      Answer5: "" + loanInfo.questionsno5.replace("u003E",">").replace("u003C","<"),
      Answer6: "" + loanInfo.questionsno6.replace("u003E",">").replace("u003C","<"),
      Answer7: "" + loanInfo.questionsno7.replace("u003E",">").replace("u003C","<"),
      Answer8: "" + loanInfo.questionsno8.replace("u003E",">").replace("u003C","<"),
      Answer9: "" + loanInfo.questionsno9.replace("u003E",">").replace("u003C","<"),
      Answer10: "" + loanInfo.questionsno10.replace("u003E",">").replace("u003C","<"),
      Answer11: "" + loanInfo.questionsno11.replace("u003E",">").replace("u003C","<"),
      Answer12: "" + loanInfo.questionsno12.replace("u003E",">").replace("u003C","<"),
      Answer13: "" + loanInfo.questionsno13.replace("u003E",">").replace("u003C","<"),
      CustomerId: item.id,
      Loan_Id: index,
      QuestionnaireFormId: 1,
    }
    /////////////////////////////////////////////////////////////////////////////////
    //Making object of loanSyncUpDatas
    ///////////////////////////////////////////////////////////////////////////////////////////////

    let loanSyncUpDatas = [{
      Loan: Loan,
      questionnaireAnswer: questionnaireAnswer
    }]

    /////////////////////////////////////////////////////////////////////////////////
    //Making object of customerSyncUpDatas
    ///////////////////////////////////////////////////////////////////////////////////////////////
    customerSyncUpDatas.push({
      assets,
      customer,
      customerAnswers,
      familyMembers,
      guaranteers,
      loanSyncUpDatas
    })


  }
  //////////////////////////////////////////////////////////////////////////////
  //Recursive function for uploading form Docs images...
  /////////////////////////////////////////////////////////////////////
  const recursivecountDocsuploading = async (docs, docsIndx) => {

    // setDialogeCount("Documents Uploading " + docsIndx)

    // Debug: Log Docs at the final stage before uploading
    if (docsIndx === docs.length) {
      console.log("[DEBUG] Final Docs array before upload:", docs);
      return; // Prevent further execution for debugging
    }

    uploadingDocs(docs[docsIndx - 1], docsIndx, setProgresss)

      .then((value) => {
        var coverter=JSON.parse(value)
        if(coverter==="Success"){
          imagesCounter++;
        setTitle("Uploading Docs..\n" + imagesCounter + "/" + docs.length + "")
        let nextNumber = docsIndx - 1;

        if (nextNumber > 0) {

          recursivecountDocsuploading(docs, nextNumber);

        } else {
          //           alert(JSON.stringify(allData))
          setTitle("Syncing up..")

          // console.log("------>ROW" + obj.length + "<--->" + obj.members + "<--->" + obj.fromPraser + "<--->" + obj.index,)

          GettingCustomerDataRecursive(obj.length, obj.members, obj.fromPraser, obj.index)

        }
        }else{
          setProgresss(false)
          Alert.alert("Stop!",JSON.stringify(value))
        }
      })
      .catch((error) => {
        setProgresss(false)

        setToast({

          type: "error",

          message: JSON.stringify(error),

        });
      });

  };
  const RejectrecursivecountDocsuploading = async (docs, docsIndx) => {


    // setDialogeCount("Documents Uploading " + docsIndx)

    uploadingDocs(docs[docsIndx - 1], docsIndx, setProgresss)

      .then((value) => {
        var coverter=JSON.parse(value)
        if(coverter==="Success"){
          imagesCounter++;
        setTitle("Uploading Docs..\n" + imagesCounter + "/" + docs.length + "")
        let nextNumber = docsIndx - 1;

        if (nextNumber > 0) {

          recursivecountDocsuploading(docs, nextNumber);

        } else {
          //           alert(JSON.stringify(allData))
          setTitle("Syncing up..")

          // console.log("------>ROW" + obj.length + "<--->" + obj.members + "<--->" + obj.fromPraser + "<--->" + obj.index,)

          GettingCustomerDataRecursive(obj.length, obj.members, obj.fromPraser, obj.index)

        }
        }else{
          setProgresss(false)
          Alert.alert("Stop!",JSON.stringify(value))
        }
      })
      .catch((error) => {
        setProgresss(false)

        setToast({

          type: "error",

          message: JSON.stringify(error),

        });
      });

  };
  

  //////////////////////////////////////////////////////////////////////////////
  //Recursive function for uploading form Docs images...
  /////////////////////////////////////////////////////////////////////
  const recursivecountAssetsuploading = async (docs, docsIndx) => {
    setDialogeCount("Assets Documents Uploading " + docsIndx)
    uploadingAssetsImage(docs[docsIndx - 1], docsIndx, setProgresss)
      .then((value) => {
        // console.log("--response" + value)
        imagesCounter++;
        setTitle("Uploading Assets..\n" + imagesCounter + "/" + docs.length + "")
        let nextNumber = docsIndx - 1;

        if (nextNumber > 0) {
          recursivecountAssetsuploading(docs, nextNumber);
        } else {
          deleteAllRelated(processItem)

          // deleteRow2(processItem);

          // setDialogeCount("Syncing up")

          // alert("Successfull Delete Gurantor")
          // props.navigation.goBack();
        }
      })
      .catch((error) => {
        setProgresss(false)

        setToast({

          type: "error",

          message: JSON.stringify(error),

        });
      });

  };

  // *********************************************************************
  // ========================== SYNC UP MIS Process END ==============================
  // *********************************************************************

  // *********************************************************************
  // ========================== SYNC UP TEMP Process Start ==============================
  // *********************************************************************

  const GroupSyncupforVerification = (item, index) => {
    processStatus=0;
    //refresh all varibales 
    customerSyncUpDatas = [];
    asstesTags = [];
    Docs = [];
    assets_Image = [];
    groupGurantors = [];
    AllCustomer = [];
    imagesCounter = 0;
    check = 0;
    obj = {};
    convert = {};
    processItem = {};
    //refresh all varibales 

    setProgresss(true)

    setTitle("Checking Tags..")

    processItem = item

    var parser = item.groupForm

    var fromPraser = JSON.parse(parser);

    convert = fromPraser.groupMembers;
  

    GettingCustomertagss(convert.length, convert)

    getAllGroupGurantors(item.composite_key).then((value: Array) => {

      // console.log("ALL GURANTOS",value)

      groupGurantors = value;

    })
    obj = { length: convert.length, members: convert, fromPraser: fromPraser, index: index, groupRow: item, composite_key: item.composite_key }

    // setAllData({...obj})

    // GettingCustomerDataRecursive(convert.length,convert,fromPraser,index)


  }

  const rejectGroupSyncupforVerification = (item, index) => {
   
    processStatus=0;
    //refresh all varibales 
    customerSyncUpDatas = [];
    asstesTags = [];
    Docs = [];
    assets_Image = [];
    groupGurantors = [];
    AllCustomer = [];
    imagesCounter = 0;
    check = 0;
    obj = {};
    convert = {};
    processItem = {};
    //refresh all varibales 

    setProgresss(true)

    setTitle("Checking Tags..")

    processItem = item

    var parser = item.groupForm

    var fromPraser = JSON.parse(parser);

    convert = fromPraser.groupMembers;
  

    rejectGettingCustomertagss(convert.length, convert)

    getAllGroupGurantors(item.composite_key).then((value: Array) => {

      // console.log("ALL GURANTOS",value)

      groupGurantors = value;

    })
    obj = { length: convert.length, members: convert, fromPraser: fromPraser, index: index, groupRow: item, composite_key: item.composite_key }

    // setAllData({...obj})

    // GettingCustomerDataRecursive(convert.length,convert,fromPraser,index)


  }
  //Recursion for getting all customer Images
  const GettingCustomerDocs = async (fromNumber, members) => {


    getLoanDocuments(members[fromNumber - 1].NicNumber).then((value) => {

      if (value) {

        if (value.length > 0) {

          value.map((underitem, underindex) => {

            Docs.push({
              CustomerId: members[fromNumber - 1].CustomerGroupMemberId,
              DocumentId: underindex,
              Image: underitem.imgValue,
              LoanId: members[fromNumber - 1].CustomerGroupMemberId,
              addedBy:"addedBy" in  underitem ? underitem.addedBy:"",
              NicNumber: members[fromNumber - 1].NicNumber,
              UniqueCode: "4813_16" + Math.random(),
              ImageName: underitem.imgName.value,

            })
          })
          //////////////////////////////////////////////////////////////////////////////
          //(Uploading docs) (recursivecountDocsuploading)
          /////////////////////////////////////////////////////////////////////
          //----------------------
          let nextNumber = fromNumber - 1;

          // console.log("nextNumber", nextNumber)
          console.log("nextNumber", nextNumber)
          if (nextNumber > 0) {

            GettingCustomerDocs(nextNumber, members);

          } else {
            console.log("Docs=======>", Docs.length)
            //////////////////////////////////////////////////////////////////////////////
            //(Uploading docs) (recursivecountDocsuploading)
            /////////////////////////////////////////////////////////////////////
            // recursivecountDocsuploading(Docs, Docs.length)
            setTitle("Uploading  Docs.." + imagesCounter + "/" + Docs.length)

            console.log("------>ROW" + obj.length + "<--->" + obj.members + "<--->" + obj.fromPraser + "<--->" + obj.index,)

            rejectGettingCustomerDataRecursivee(obj.length, obj.members, obj.fromPraser, obj.index)

          }

        } else {
          setToast({
            type: "error",
            message: "Sorry! Documents not found.",
          });
        }
      }
    }).catch((error) => {
      console.log("catch works", JSON.stringify(error))
      Alert.alert("Check your internet.", "Try Again! \n" + error, [{ text: "ok", onPress: () => { } }])


    })
  };

  const rejectGettingCustomerDocs = async (fromNumber, members) => {
  


    getLoanDocuments(members[fromNumber - 1].NicNumber).then((value) => {

      if (value) {

        if (value.length > 0) {

          value.map((underitem, underindex) => {

            Docs.push({
              CustomerId: members[fromNumber - 1].CustomerGroupMemberId,
              DocumentId: underindex,
              Image: underitem.imgValue,
              LoanId: members[fromNumber - 1].CustomerGroupMemberId,
              addedBy:"addedBy" in  underitem ? underitem.addedBy:"",
              NicNumber: members[fromNumber - 1].NicNumber,
              UniqueCode: "4813_16" + Math.random(),
              ImageName: underitem.imgName.value,

            })
          })
          //////////////////////////////////////////////////////////////////////////////
          //(Uploading docs) (recursivecountDocsuploading)
          /////////////////////////////////////////////////////////////////////
          //----------------------
          let nextNumber = fromNumber - 1;

          // console.log("nextNumber", nextNumber)
          console.log("nextNumber", nextNumber)
          if (nextNumber > 0) {

            rejectGettingCustomerDocs(nextNumber, members);

          } else {
            console.log("Docs=======>", Docs.length)
            //////////////////////////////////////////////////////////////////////////////
            //(Uploading docs) (recursivecountDocsuploading)
            /////////////////////////////////////////////////////////////////////
            // recursivecountDocsuploading(Docs, Docs.length)
            setTitle("Uploading  Docs for rejection.." + imagesCounter + "/" + Docs.length)

            console.log("------>ROW" + obj.length + "<--->" + obj.members + "<--->" + obj.fromPraser + "<--->" + obj.index,)

            rejectGettingCustomerDataRecursivee(obj.length, obj.members, obj.fromPraser, obj.index)

          }

        } else {
          setToast({
            type: "error",
            message: "Sorry! Documents not found.",
          });
        }
      }
    }).catch((error) => {
      console.log("catch works", JSON.stringify(error))
      Alert.alert("Check your internet.", "Try Again! \n" + error, [{ text: "ok", onPress: () => { } }])


    })
  };

  //Recursion for getting all customer tags
  const GettingCustomertagss = async (fromNumber, members) => {
   
    getCustomerFromsByidforGroupSyncup(setNull, members[fromNumber - 1].NicNumber).then((values) => {
      var parser = JSON.parse(values[0].forms);
      var loanInfo = parser.loanInfo[0];

      var assestsInfo = parser.assestsInfo[0];

      var guarantorInfo = parser.guarantorInfo[0];

      var customer=parser.customerInfo[0];


     

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
      if(customer.evrisys_customerImage == undefined){
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
      //////////////////////////////////////////////////////////////////////////////
      //Getting Tags for checking...
      /////////////////////////////////////////////////////////////////////

      var temp = parser.assestsInfo;
      // console.log("temp=======>",temp)

      temp.map((underitem, undexindex) => {
        if (underitem.assetTagName.value && underitem.assetTagId.value) {
          asstesTags.push({ AssetTagId: underitem.assetTagId.value, AssetTagName: underitem.assetTagName.value })

        }
      })

      //----------------------
      let nextNumber = fromNumber - 1;

      if (nextNumber > 0) {

        GettingCustomertagss(nextNumber, members);

      } else {

        console.log("Tags=======>", asstesTags)

        CheckingTags(asstesTags, setNull).then((value) => {

          // console.log("error" + value)


          if (value.length > 0) {

            setToast({

              type: "error",

              message: "" + value,

            });

            setTitle("Updating Tags..")

            setProgresss(true)

            CallforTags(StationReducer.station.stationId, setProgresss).then(() => {

              setProgresss(false)

            }).catch(() => {

              setProgresss(false)

            })

          } else {

            asstesTags = [];
            // return
            setTitle("Uploading Customers Docs..")

            GettingCustomerDocs(convert.length, convert)

          }
        }).catch((error) => {
          setProgresss(false)
          Alert.alert("Check your internet.", "Try Again! \n" + error, [{ text: "ok", onPress: () => { } }])

        })
      }

    })

      .catch((error) => {

      })



  };
  const rejectGettingCustomertagss = async (fromNumber, members) => {
    
    getCustomerFromsByidforGroupSyncup(setNull, members[fromNumber - 1].NicNumber).then((values) => {
      var parser = JSON.parse(values[0].forms);
      var loanInfo = parser.loanInfo[0];

      var assestsInfo = parser.assestsInfo[0];

      var guarantorInfo = parser.guarantorInfo[0];

      var customer=parser.customerInfo[0];


     

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
      if(customer.evrisys_customerImage == undefined){
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
      //////////////////////////////////////////////////////////////////////////////
      //Getting Tags for checking...
      /////////////////////////////////////////////////////////////////////

      var temp = parser.assestsInfo;
      // console.log("temp=======>",temp)

      temp.map((underitem, undexindex) => {
        if (underitem.assetTagName.value && underitem.assetTagId.value) {
          asstesTags.push({ AssetTagId: underitem.assetTagId.value, AssetTagName: underitem.assetTagName.value })

        }
      })

      //----------------------
      let nextNumber = fromNumber - 1;

      if (nextNumber > 0) {

        rejectGettingCustomertagss(nextNumber, members);

      } else {

        console.log("Tags=======>", asstesTags)

        CheckingTags(asstesTags, setNull).then((value) => {

          // console.log("error" + value)


          if (value.length > 0) {

            setToast({

              type: "error",

              message: "" + value,

            });

            setTitle("Updating Tags..")

            setProgresss(true)

            CallforTags(StationReducer.station.stationId, setProgresss).then(() => {

              setProgresss(false)

            }).catch(() => {

              setProgresss(false)

            })

          } else {

            asstesTags = [];
            // return
            setTitle("Rejecting Group..")
            
           rejectGettingCustomerDocs(convert.length, convert)

          }
        }).catch((error) => {
          setProgresss(false)
          Alert.alert("Check your internet.", "Try Again! \n" + error, [{ text: "ok", onPress: () => { } }])

        })
      }

    })

      .catch((error) => {

      })



  };
  
  //Recursion for getting all customer data and upload
  const GettingCustomerDataRecursivee = async (fromNumber, members, fromPraser, index) => {

    setDialogeCount("Syncing up..")

    console.log("---->", members[fromNumber - 1].NicNumber + "<----")

    getCustomerFromsByidforGroupSyncup(setProgresss, members[fromNumber - 1].NicNumber).then(async (values) => {

      // console.log("---customer Data===>",values[0].)

      GettingCustomerDataa(values[0], fromNumber).then(async (value) => {
        //running---------------------------------

        let nextNumber = fromNumber - 1;

        if (nextNumber > 0) {

          GettingCustomerDataRecursivee(nextNumber, members, fromPraser, index);

        } else {
          console.log("assets_Image=======>", assets_Image.length)
          console.log("StationId=======>", fromPraser?.StationId)


          // return
          /////////////////////////////////////////////////////////////////////////////////
          //Making object of final Object
          ///////////////////////////////////////////////////////////////////////////////////////////////
          var sendingObject = {
            "CustomerDataObject": AllCustomer,
            // "CustomerDocImages": Docs,
            // "CustomerAssetsImages": assets_Image,
            "LoanOfficer": UserData?.userData?.user_id,
            "GroupGurantors": groupGurantors,
            "Group": obj.groupRow,
            "StationId":fromPraser?.StationId
          }
          // console.log("--->IN THE END",groupMembers);
          // *******************************************************************WRITE FILE
         
          console.log("--->Docs", Docs.length);
          imagesCounter = 0;

          uploadingMultipleDocsImagess(Docs, Docs.length, obj.composite_key, sendingObject, setProgresss)
          // BigChangeMethode(sendingObject, setProgresss)
          //(Uploading)
          ///////////////////////////////////////////////////////////////////////////////////////////////
          return
          uploadingCustomerdata(Uploading, setProgresss)
            .then((value) => {
              console.log("--->IN THE END", value);
              customerSyncUpDatas = [];
              if (value === "Success") {
                // (Uploading AssetsImage) (recursivecountAssetsuploading)
                /////////////////////////////////////////////////////////////////////
                setTitle("Uploading Assets Docs..")
                recursivecountAssetsuploading(assets_Image, assets_Image.length)
              } else {
                setToast({
                  type: "error",
                  message: "" + value,
                });
              }
            })
            .catch((error) => {
            })
          // props.navigation.goBack();
        }
      })
    })
  };
  const rejectGettingCustomerDataRecursivee = async (fromNumber, members, fromPraser, index) => {
    setDialogeCount("Rejecting...")
    console.log("---->", members[fromNumber - 1].NicNumber + "<----")
  
    getCustomerFromsByidforGroupSyncup(setProgresss, members[fromNumber - 1].NicNumber).then(async (values) => {
      // console.log("---customer Data===>",values[0].)
      GettingCustomerDataa(values[0], fromNumber).then(async (value) => {
        //running---------------------------------
        let nextNumber = fromNumber - 1;
        if (nextNumber > 0) {
          rejectGettingCustomerDataRecursivee(nextNumber, members, fromPraser, index);
        } else {
          // console.log("assets_Image=======>", assets_Image.length)
          // console.log("StationId=======>", fromPraser?.StationId)
          /////////////////////////////////////////////////////////////////////////////////
          //Making object of final Object
          ///////////////////////////////////////////////////////////////////////////////////////////////
          var sendingObject = {
            "CustomerDataObject": AllCustomer,
            // "CustomerDocImages": Docs,
            // "CustomerAssetsImages": assets_Image,
            "LoanOfficer": UserData?.userData?.user_id,
            "GroupGurantors": groupGurantors,
            "Group": obj.groupRow,
            "StationId":fromPraser?.StationId
          }
          // console.log("--->IN THE END",groupMembers);
          // *******************************************************************WRITE FILE
         
          console.log("--->Docs", Docs.length);
          imagesCounter = 0;

          rejectuploadingMultipleDocsImagess(Docs, Docs.length, obj.composite_key, sendingObject, setProgresss)
          // BigChangeMethode(sendingObject, setProgresss)
          // **********************************************************************
          /////////////////////////////////////////////////////////////////////////////////
          //(Uploading)
          ///////////////////////////////////////////////////////////////////////////////////////////////
  
          uploadingCustomerdata(Uploading, setProgresss)
            .then((value) => {          
              customerSyncUpDatas = [];
              if (value === "Success") {
                //////////////////////////////////////////////////////////////////////////////
                // (Uploading AssetsImage) (recursivecountAssetsuploading)
                /////////////////////////////////////////////////////////////////////
                setTitle("Uploading Assets Docs..")
                recursivecountAssetsuploading(assets_Image, assets_Image.length)
              } else {
                setToast({
                  type: "error",
                  message: "" + value,
                });
              }
            })
            .catch((error) => {
            })
          // props.navigation.goBack();
        }
      })
    })

  };
  const uploadingMultipleDocsImagess = async (allData, indexer, user_cnic, sendingObject, setProgresss) => {
    updateTempCustomerDocsimagesbyBm(allData[indexer - 1], user_cnic)
      .then((value) => {
        if (value == "Success") {
          imagesCounter++;
          setTitle("Uploading Docs.. \n" + imagesCounter + "/" + Docs.length)
          let nextNumber = indexer - 1
          if (nextNumber > 0) {
            uploadingMultipleDocsImagess(allData, nextNumber, user_cnic, sendingObject, setProgresss)
          } else {
            BigChangeMethode(sendingObject, setProgresss, user_cnic)
          }
        } else {
          setToast({
            type: "error",
            message: "" + value,
          });
          setProgresss(false)
        }
      })
      .catch((error) => {
        Alert.alert("Check your internet.", "Try Again! \n" + error, [{ text: "ok", onPress: () => { } }])
      })
  }
  const rejectuploadingMultipleDocsImagess = async (allData, indexer, user_cnic, sendingObject, setProgresss) => {
    updateTempCustomerDocsimagesbyBm(allData[indexer - 1], user_cnic)
      .then((value) => {
        if (value == "Success") {
          imagesCounter++;
          setTitle("Uploading reject Docs.. \n" + imagesCounter + "/" + Docs.length)
          let nextNumber = indexer - 1
          if (nextNumber > 0) {
            rejectuploadingMultipleDocsImagess(allData, nextNumber, user_cnic, sendingObject, setProgresss)
          } else {
            BigChangeMethode(sendingObject, setProgresss, user_cnic)
          }
        } else {
          setToast({
            type: "error",
            message: "" + value,
          });
          setProgresss(false)
        }
      })
      .catch((error) => {
        Alert.alert("Check your internet.", "Try Again! \n" + error, [{ text: "ok", onPress: () => { } }])
      })
  }

  const uploadingMultipleAssetsImagess = async (allData, indexer, user_cnic) => {
    sendTempCustomerAssetsImagesbyBm(allData[indexer - 1], user_cnic)
      .then((value) => {
        if (value == "Success") {
          imagesCounter++;
          setTitle("Uploading Assets Docs.. \n" + imagesCounter + "/" + assets_Image.length)
          let nextNumber = indexer - 1
          if (nextNumber > 0) {
            uploadingMultipleAssetsImagess(allData, nextNumber, user_cnic)
          } else {
            setToast({
              type: "success",
              message: "Syncup successfully!",
            });
            deleteAllRelated(processItem)
          }
        } else {
          setToast({
            type: "error",
            message: "" + value,
          });
          setProgresss(false)
        }
      })
      .catch((error) => {
        setToast({
          type: "error",
          message: "" + error,
        });
        setProgresss(false)
      })
  }
  const BigChangeMethode = (sendingObject, setProgress, user_cnic) => {
    setTitle("Syncing up..")

    // **************** BIG CHANGES START **************************

    console.log("**********************BMsendingObject***************************")
    //  console.log("",JSON.stringify(sendingObject))
    console.log("**********************BmsendingObject***************************")

    setProgress(true)
    sendObjectbyBM(sendingObject, 1, user_cnic, sendingObject?.StationId)
      .then(async (value) => {
        AllCustomer = [];
        // *******************************************************************WRITE FILE
        // const granted = await PermissionsAndroid.request(
        //       PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
        //       {
        //         title: 'Storage Permission',
        //         message: 'App needs access to memory to download the file ',
        //       },
        //     );
        //     if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        //       let get=await FingerModule.writeToFile(JSON.stringify(sendingObject),"SyncupGroupbyBMtoTemp");
        //       console.log("--->write file",get);
    
        //       // -----------------------------
        //     } else {
        //       Alert.alert(
        //         'Permission Denied!',
        //         'You need to give storage permission to download the file',
        //       );
        //       return;
        //     }

        // **********************************************************************
        console.log("--->IN THE END", value);
        if (value === "Success") {
          imagesCounter = 0;
          if (assets_Image.length > 0) {
            uploadingMultipleAssetsImagess(assets_Image, assets_Image.length, user_cnic)
          } else {
            setToast({
              type: "success",
              message: "Syncup successfully!",
            });

            deleteAllRelated(processItem)


          }

        } else {
          setToast({
            type: "error",
            message: "" + value,
          });
          setProgresss(false)
        }


      })

      .catch((error) => {

      })
    // **************** BIG CHANGES END**************************
  }
  //////////////////////////////////////////////////////////////////////////////
  //Getting Customer Data ...
  /////////////////////////////////////////////////////////////////////
  const GettingCustomerDataa = (item, index) => {
    const promise = new Promise((resolve, reject) => {
      var parser = JSON.parse(item.forms)
      var converter = item.CustomerAnswers
      var parser2 = JSON.parse(converter)
      var CustomerAns = parser2.answerArray
      parser.customerInfo[0].customer_cnicNumber.value=item.user_cnic
      parser.loanInfo[0].loan_customerImage = [{ key: 1, activeTab: false, imgName: { value: '', error: false }, imgValue: undefined, }]
      parser.assestsInfo.map((assetsitem, indexer) => {
        parser.assestsInfo[indexer].assets_Image = [{ key: 1, activeTab: false, imgName: { value: '', error: false }, imgValue: undefined, }]
      })
      // console.log("xxxxx?",CustomerAns)
      var removeQuestioninSindhi = CustomerAns;
      removeQuestioninSindhi.map((item, index) => {
        removeQuestioninSindhi[index].question = ""
      });

      item.CustomerAnswers = removeQuestioninSindhi;
      //////////////////////////////////////////////////////////////////////////////

      let assets = []
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
            CustomerAssetId: '' + underindex+1,
            CustomerId: '' + item.id,
            Notes: '' + underitem.assetNote.value,
            _CustomerAssetNameId: underindex
          }
        )
        console.log("try with--->", item.user_cnic)
        console.log("loan Type", parser.loanInfo[0].loanType.value)
        if(parser.loanInfo[0].loanType.value == "Live Stock"){ 
        getAssetsDocumentsforSyncup(item.user_cnic).then((value) => {
          if (value) {
            if (value.length > 0) {
              console.log("try with--->", item.user_cnic + "length", value.length)
              value.map((imageitem, imageindex) => {
                console.log((underindex+1) +"=^="+ imageitem.assets_id)
                if ((underindex+1) == imageitem.assets_id) {
                  console.log("collected")
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
            }
            //             returnCustomerImages(item.user_cnic,parser).then((value) => {

            //             }).catch((error) => {
            // console.log("error",error)
            //             })
          

          }
        }).catch((e) => { reject(e)})
      }
      if(underindex==parser.assestsInfo.length-1){
        if("CustomerCib" in item && item.CustomerCib!=null && item.CustomerCib.length > 0){
          var parserobject=item?.CustomerCib;
          var parserSave=JSON.parse(parserobject)
          item["CustomerCib"]=parserSave;
        }
        item.forms = parser
        AllCustomer.push(item)
        resolve(true)
      }
      });



    })
    return promise;


  }

  // *********************************************************************
  // ========================== SYNC UP IN TEMP Process END ==============================
  // *********************************************************************

  //Recursion for getting all customers and verification
  const GettingCustomersforVerification = async (fromNumber, members, item, index) => {
    getCustomerFromsByidforGroupSyncup(setNull, members[fromNumber - 1].NicNumber)
      .then((values) => {
        var parser = JSON.parse(values[0].forms);
        var loanInfo = parser.loanInfo[0];

        console.log("cnic", values[0].user_cnic)
        AllCustomer.push({nic:values[0].user_cnic,amount:loanInfo.approvedLoan.value,risk:loanInfo.borrowerriskprofile})

        // // *************************************
        // if (loanInfo.approvedLoan.value > 100000) {
        //   // Alert.alert("Go in TEMP DATABASE 1")
        //   console.log("user_cnic", values[0].user_cnic + "Amount is greater than 100000")
        //   check = 1;
        //   // TEMP DATABASE
        // }
        // if (loanInfo.loanType.value == "Auto Finance" || loanInfo.loanType.value == "Education" || loanInfo.loanType.value == "Personal") {
        //   // Alert.alert("Go in TEMP DATABASE 2")
        //   // TEMP DATABASE
        //   check = 1;
        //   console.log("user_cnic", values[0].user_cnic + check + "Type is Auto Finance")
        // }
        // if (loanInfo.borrowerriskprofile > 1) {
        //   // Alert.alert("Go in TEMP DATABASE 3")
        //   // TEMP DATABASE
        //   console.log("user_cnic", values[0].user_cnic + "Hight Risk")

        //   check = 1;
        // }
        let nextNumber = fromNumber - 1;

        if (nextNumber > 0) {
          GettingCustomersforVerification(nextNumber, members, item, index)
        } else {
          // console.log("user_cnic", AllCustomer)
          // if (check > 0) {
          //   //need to go in temp 
          //   GroupSyncupforVerification(item, index)
          // } else 
          // {
            console.log("user_cnic", AllCustomer)
            setTitle("Verifying Customer..")
            setProgresss(true)
            VerifyUser(JSON.stringify(AllCustomer)).then((value) => { 
              setProgresss(false)
              if (value.Status>0) {
                // alert("Need to go in temp")
                // console.log("Finall temp",item)
                // return
                GroupSyncupforVerification(item, index)
              }else{
                // alert("Need to go in MIS")
                // return
                GroupSyncup(item, index)
              }
            }).catch((error) => { 
              Alert.alert("Error", error)
              setProgresss(false)
            })
            
          // }//end of else
        }
      }
      )
      .catch((error) => {
        alert("Error in getting customer")
      })
  }

  const rejectGettingCustomersforVerification = async (fromNumber, members, item, index) => { 
    getCustomerFromsByidforGroupSyncup(setNull, members[fromNumber - 1].NicNumber)
      .then((values) => {
        var parser = JSON.parse(values[0].forms);
        var loanInfo = parser.loanInfo[0];
        console.log("cnic", values[0].user_cnic)
        AllCustomer.push({nic:values[0].user_cnic,amount:loanInfo.approvedLoan.value,risk:loanInfo.borrowerriskprofile})

        // // *************************************


        // if (loanInfo.approvedLoan.value > 100000) {
        //   // Alert.alert("Go in TEMP DATABASE 1")
        //   console.log("user_cnic", values[0].user_cnic + "Amount is greater than 100000")
        //   check = 1;
        //   // TEMP DATABASE
        // }
        // if (loanInfo.loanType.value == "Auto Finance" || loanInfo.loanType.value == "Education" || loanInfo.loanType.value == "Personal") {
        //   // Alert.alert("Go in TEMP DATABASE 2")
        //   // TEMP DATABASE

        //   check = 1;
        //   console.log("user_cnic", values[0].user_cnic + check + "Type is Auto Finance")

        // }
        // if (loanInfo.borrowerriskprofile > 1) {
        //   // Alert.alert("Go in TEMP DATABASE 3")
        //   // TEMP DATABASE
        //   console.log("user_cnic", values[0].user_cnic + "Hight Risk")

        //   check = 1;
        // }
        let nextNumber = fromNumber - 1;
        if (nextNumber > 0) {
          rejectGettingCustomersforVerification(nextNumber, members, item, index)
        } else {
          // console.log("user_cnic", AllCustomer)
          // if (check > 0) {
          //   //need to go in temp 
          //   GroupSyncupforVerification(item, index)
          // } else 
          // {
            console.log("user_cnic", AllCustomer)
            setTitle("Verifying Customer..")
            setProgresss(true)
            VerifyUser(JSON.stringify(AllCustomer)).then((value) => { 
              setProgresss(false)
              if (value.Status>0) {
                // console.log("Finall temp",item)
                // alert("Need to go in temp")
                // return                
                rejectGroupSyncupforVerification(item, index)
              }else{
                alert("Need to go in MIS")
                return
                GroupSyncup(item, index)
              }
            }).catch((error) => { 
              Alert.alert("Error", error)
              setProgresss(false)
            })       
          // }//end of else
        }
      }
      )
      .catch((error) => {
        alert("Error in getting customer")
      })
  }
  //-------------------------recursive methodes for delete gurantours
  const recursivecountDownOne = async (members, fromNumber, groupId, item, type, deleteChecker) => {
    console.log("---->", members[fromNumber - 1].NicNumber + "<----")
    DeleteSelectedGurantorsbyBM(groupId, members[fromNumber - 1].NicNumber).then(() => {
      let nextNumber = fromNumber - 1;
      if (nextNumber > 0) {
        recursivecountDownOne(members, nextNumber, groupId, item, type, deleteChecker);
      } else {
        DeleteGroupsForms(groupId).then((value) => {
          // console.log("--->", value)
          setProgresss(false)
          setToast({
            type: "success",
            // message: type == 1 ? "Case Reject successfully!" : "Successfully Deleted",
            //my code
            message: type == 1 ? "Case successfully SyncedUp!" : "Successfully Delete",
          });
          //refresh all varibales 
          customerSyncUpDatas = [];
          asstesTags = [];
          Docs = [];
          assets_Image = [];
          groupGurantors = [];
          AllCustomer = [];
          imagesCounter = 0;
          check = 0;
          obj = {};
          convert = {};
          processItem = {};
          //refresh all varibales 
          if (deleteChecker) {
            setTitle("Updating Tags..")
            setProgresss(true)
            CallforTags(StationReducer.station.stationId, setProgresss).then(() => {
              // setProgresss(false)
              if(processStatus==1){
                setTitle("Delete All Related..")
                setProgresss(true)
                deleteLoanOfficerdata(item.composite_key).then(() => {
                  setProgresss(false)
                }).catch((error) => {
                  setProgresss(false)
                  console.log("error in delete loan officer data", error)
                });
              }else{
                setProgresss(false)
              }         
            }).catch(() => {
              setProgresss(false)
            })
          }
        }).catch((eror) => {
        })
        let get2 = getForms;
        get2.splice(item.index, 1);
        setFroms(get2);
        setFromsOrignal(get2)
        fetchData()
      }
    })
  };

  // ==================== RECURSIVE METHODE FOR DELETE CUSTOMER DATA=======================
  const recursiveforDeleteCustomerData = (members, fromNumber, item) => {

    DeleteCustomerFormsbyCnic(members[fromNumber - 1].NicNumber)
      .then((value) => {

        DeleteDocImages(members[fromNumber - 1].NicNumber).then(() => {

          DeleteAssetsImages(members[fromNumber - 1].NicNumber).then(() => {

            let nextNumber = fromNumber - 1;

            if (nextNumber > 0) {

              recursiveforDeleteCustomerData(members, nextNumber, item);

            } else {

              deleteRow2(processItem)

            }

          })
        })
      })
      .catch(() => {

      })
  }
  // ==================== RECURSIVE METHODE FOR DELETE CUSTOMER DATA=======================

  const deleteAllRelated = (item) => {

    // console.log("====================>deleteAllRelated");

    var groupform = item.groupForm;

    var coverter = JSON.parse(groupform);

    var groupMembers = coverter.groupMembers;

    console.log("====================>groupMembers");


    console.log("--->", groupMembers);

    console.log("====================>groupMembers");

    setProgresss(true)

    setTitle("Deleting Group..")

    recursiveforDeleteCustomerData(groupMembers, groupMembers.length, item)


  }


  // ********************* Login User Data****************************

  //-------------------------------------
  const fetchData = () => {
    getGroupsFromsforBM(setFroms, setFromsOrignal, setNoData, setLoading,getUserData.UserData.EmployeeTypeName == "Branch Manager"?1:2);


  }
  const handleSyncup = (item, index) => {
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
    var parser = JSON.parse(item.groupForm)

    if (parser?.borrowerStaification.value == '') {


      Alert.alert("Stop!", "Please fill Branch Manager Checklist.")

      return;
    }
    if(getUserData.UserData.EmployeeTypeName=="Verification Officer" && parser.verificationComments.value==""){
     
      setToast({

        type: "error",

        message: "Please fill Verification Officer Comments first!",

      });
      return
    }
    Alert.alert("Syncup?", "Do you really want to syncup?", [
      { text: 'Yes', onPress: () => { handleVerification(item, index) } },
      { text: "No" }
    ])
  }

//my code previous
  // const handleReject = (item) => {
  //   RejectuploadingCustomerdata (item.group_id, commentReject).then(async(res)=>{
  //     console.log("here i'am now",res.data.StatusCode)
  //     if(res.data.StatusCode == 200){
  //       deleteRow2(item, false)
  //     }else(
  //       alert("Already Reject...")
  //     )
  //   })
  // }


//my code



    // Alert.alert("Syncup?", "Do you really want to Reject?", [
    //   { text: 'Yes', onPress: () => { RejectuploadingCustomerdata (item.group_id) } },
    //   { text: "No" }
    // ])
  

  // const handleReject =(item, index) => {
  //   var parser = JSON.parse(item.groupForm)
   

  //   Alert.alert("Reject?", "Do you really want to Reject this case?", [
  //     { text: 'Yes', onPress: () => { RejecthandleVerification(item, index) } },
  //     { text: "No" }
  //   ])
  // }

  const handleVerification = async (item, index) => {
   
    
    // GroupSyncup(item, index)
    await checkApplicationVersion().then(async(res)=>{
      if((res?.StatusCode == 200 && res?.Version == ApplicationVersion) || res?.StatusCode == 201){
        
      if(getUserData.UserData.EmployeeTypeName == "Verification Officer"){
        GroupSyncup(item, index)  // MIS
      }else{

      var parser = item.groupForm

      var fromPraser = JSON.parse(parser);

      convert = fromPraser.groupMembers;
      console.log("convert-=-=-=->", convert)
      // return
      GettingCustomersforVerification(convert.length, convert, item, index);

      }
    
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

  const RejecthandleVerification = async (item, index) => {
    
    // GroupSyncup(item, index)
    await checkApplicationVersion().then(async(res)=>{
      if((res?.StatusCode == 200 && res?.Version == ApplicationVersion) || res?.StatusCode == 201){
        
      const employeeTypeId = getUserData?.UserData?.EmployeeTypeId;
      // Allow BM (commonly 5) and VO (33) to reject; block others
      if (employeeTypeId != 5 && employeeTypeId != 33) {
       alert("You don't have permission to reject cases")
      } else {

      var parser = item.groupForm

      var fromPraser = JSON.parse(parser);

      convert = fromPraser.groupMembers;
      console.log("convert-=-=-=->", convert)
      // return
      rejectGettingCustomersforVerification(convert.length, convert, item, index);

      }
    
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
 
  const renderItem = ({ item, index }) => (

    <GroupRecorditems item={item}

      UserData={UserData}

      onPressSyncup={() => {
        handleSyncup(item, index)

      }}

      // my code for group rejection
      comment={commentReject}
      setCommentRecject={val=>setCommentRecject(val)}
      onPressReject={() => {   
      
        RejectuploadingCustomerdata (item.group_id, commentReject).then(async(res)=>{
          console.log("here i'am now",res.data.StatusCode)
          if(res.data.StatusCode == 200){
            deleteRow2(item, false)
          }else(
            alert("Already Reject...")
          )
        })
      }}
      //my code

      onPress={
        async () => {

          var parser = JSON.parse(item.groupForm)

          props.Updatecheck({ value: true, id: item.group_id, composite_key: item.composite_key })

          props.navigation.navigate('AddGroup', { item: parser })
        }
      } />
  );
  const deleteRow = (item, deleteChecker) => {
    console.log("delete obj==>",item)

    var groupform = item.item.groupForm;

    var coverter = JSON.parse(groupform);

    var groupMembers = coverter.groupMembers;

    console.log("--->", groupMembers);

    setProgresss(true)

    setTitle("Deleting Group")

    recursivecountDownOne(groupMembers, groupMembers.length, item.item.group_id, item, 2, deleteChecker)
  }
  const deleteRow2 = (item) => {
    var groupform = item.groupForm;
    var coverter = JSON.parse(groupform);
    var groupMembers = coverter.groupMembers;
    // console.log("--->", groupMembers);
    setProgresss(true)
    setTitle("Rejecting Group")
    recursivecountDownOne(groupMembers, groupMembers.length, item.group_id, item, 1, true)
  }

  const removeChip = (index) => {

    setFroms([])

    setFromsOrignal([])

    setSearchData([])

    setLoading(true)

    fetchData()
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

          variable={2}


          setNoData={setNoData}

          setLoading={setLoading}

          text={'Search Groups bm vo by name..'}

        />

        <DateChips clearFilter={removeChip} searchData={searchData} setSearchData={setSearchData} />

        {loading && <ActivityIndicator style={{ marginTop: 30 }} color={Colors.parrotGreenColor} />}


        {noData && <Nodata></Nodata>}

        {getCustomerFroms != null && <SwipeListView

          showsVerticalScrollIndicator={false}

          contentContainerStyle={{ paddingBottom: 220 }}

          style={{ marginBottom: 0, marginTop: 20, marginLeft: 20, marginRight: 20 }}

          data={getForms}

          keyExtractor={(item, index) => index.toString()}

          renderItem={renderItem}

          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={() => {
                fetchData()
              }}
              colors={[Colors.kulfa]}
            />
          }
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
                            setDeleteChecker(false)
                            deleteRow(item, false)
                          }
                        }
                      ]
                    );
                  }}
                >
                  <MaterialCommunityIcons
                    name="delete-outline"
                    color={"#FF0000"}
                    size={26}
                  />
                </TouchableOpacity>
              </View>
            </View>
          )}
          rightOpenValue={-75}
        />}
      </View>

      <Toast {...toast} onDismiss={() => setToast({ message: "", type: "" })} />

      <CustomProgressDialoge
        dialogVisible={progress}
        setDialogVisible={setProgresss}
        title={title}
      />
      {/* <ProgressDialog
        activityIndicatorColor={Colors.darkGreenColor}
        visible={progress}
        onTouchOutside={{}
          // () =>
          //  setprogressVisible(false)
          }
        title={dialogeCount}
        message="Please, wait..."
      /> */}
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
export default connect(null, mapDispatchToProps)(LoanVerficationGroup);

const styles = StyleSheet.create({
  safeview: {flex: 1},
    
  
  card: {
    marginTop: 10, marginLeft: 30, marginRight: 30, paddingLeft: 10
  },
  row: { flexDirection: "row", alignItems: 'center' },
  circle: {
    height: 30, width: 30, borderRadius: 100, marginLeft: 0, marginRight: 10,
    justifyContent: 'center', backgroundColor: '#f1f1f1'
  }
})

