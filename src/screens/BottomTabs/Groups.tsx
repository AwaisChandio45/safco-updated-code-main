

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
  RefreshControl
} from 'react-native';
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
import { DeleteAssetsImages, DeleteCustomerForms, DeleteCustomerFormsbyCnic, DeleteCustomerGurantorsbyId, DeleteDocImages, DeleteGroupsForms, DeleteSelectedGurantors, getAllGroupGurantors, getAssetsDocumentsforSyncup, getCustomerFroms, getCustomerFromsByidforGroupSyncup, getGroupGurantors, getGroupsFroms, getLoanDocuments } from '../../sqlite/sqlitedb';
import { Colors } from '../../theme';
var { height, width } = Dimensions.get('window');
import { useDispatch } from "react-redux";
import GroupRecorditems from '../../components/GroupRecorditems';
import { CallforTags, CheckingTags, uploadingAssetsImage, uploadingCustomerdata, uploadingDocs } from '../../apis_auth/apis';
import Toast from '../../components/Toast';
import DateChips from '../../components/DateChips';
import { Item } from 'react-native-paper/lib/typescript/components/List/List';
import { text } from 'stream/consumers';
const Groups: () => Node = (props) => {
  let customerSyncUpDatas = [];
  let asstesTags = [];
  let Docs = [];
  let assets_Image = [];
  let groupGurantors = [];
  let obj = {};
  var convert = {};
  let processItem = {};
  const [title, setTitle] = React.useState([])
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
  const [container, setContainer] = React.useState(
    {
      topBar: true,
      startDate: '',
      endDate: "",
      Cnic: "",
      activeInput: true
    })

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

  const dispatch = useDispatch();
  // *********************************************************************
  // ========================== SYNC UP Process Start ==============================
  // *********************************************************************

  const GroupSyncup = (item, index) => {

    setProgresss(true)

    setTitle("Checking Tags..")
    
    processItem = item
    
    var parser = item.groupForm
    
    var fromPraser = JSON.parse(parser);
    
    convert = fromPraser.groupMembers;
    
    GettingCustomertags(convert.length, convert)
    
    getAllGroupGurantors(item.group_id).then((value: Array) => {
    
      // console.log("ALL GURANTOS",value)
    
      groupGurantors = value;
    
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
          console.log("nextNumber", nextNumber)
          if (nextNumber > 0) {
          
            GettingCustomerDoc(nextNumber, members);
          
          } else {
            console.log("Docs=======>", Docs.length)
            //////////////////////////////////////////////////////////////////////////////
            //(Uploading docs) (recursivecountDocsuploading)
            /////////////////////////////////////////////////////////////////////
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

  //Recursion for getting all customer tags
  const GettingCustomertags = async (fromNumber, members) => {
    getCustomerFromsByidforGroupSyncup(setNull, members[fromNumber - 1].NicNumber).then((values) => {
      var parser = JSON.parse(values[0].forms);
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
      
            CallforTags(StationReducer.station.stationId,setProgresss).then(()=>{
      
              setProgresss(false)
      
            }).catch(()=>{
      
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
  //Recursion for getting all customer data and upload
  const GettingCustomerDataRecursive = async (fromNumber, members, fromPraser, index) => {

    setDialogeCount("Syncing up..")

    console.log("---->", members[fromNumber - 1].NicNumber + "<----")

    getCustomerFromsByidforGroupSyncup(setProgresss, members[fromNumber - 1].NicNumber).then(async(values) => {

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
          BMLocation:fromPraser.groupLocation==undefined?"25.394759-68.3312667":fromPraser.groupLocation,
          syncUpStatus: 0,
        }
        console.log("=====================group-------------------->")
        console.log("==>", group)
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

        /////////////////////////////////////////////////////////////////////////////////
        //Making object of final Object
        ///////////////////////////////////////////////////////////////////////////////////////////////
        var Uploading = {
          customerSyncUpDatas: customerSyncUpDatas,
          group: group,
          groupBMChecklistAnswers: groupBMChecklistAnswers,
          groupMembers: groupMembers

        }
        // console.log("--->IN THE END",groupMembers);
 // *******************************************************************WRITE FILE
//  const granted = await PermissionsAndroid.request(
//   PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
//   {
//     title: 'Storage Permission',
//     message: 'App needs access to memory to download the file ',
//   },
// );
// if (granted === PermissionsAndroid.RESULTS.GRANTED) {
//   const AppFolder = 'Safco_reactapp';
//   const DirectoryPath =
//     RNFS.ExternalStorageDirectoryPath + '/' + AppFolder;
//   RNFS.mkdir(DirectoryPath);
//   RNFS.getAllExternalFilesDirs()

//   RNFS.writeFile(
//     DirectoryPath + '/' + 'Syncup.txt',
//     JSON.stringify(Uploading),
//     'utf8',
//   )
//     .then(() => {


//     })
//   //-------------------------write file

//   // -----------------------------
// } else {
//   Alert.alert(
//     'Permission Denied!',
//     'You need to give storage permission to download the file',
//   );
//   return;
// }

// **********************************************************************
        /////////////////////////////////////////////////////////////////////////////////
        //(Uploading)
        ///////////////////////////////////////////////////////////////////////////////////////////////
        //  return
        uploadingCustomerdata(Uploading, setProgresss)
          .then((value) => {


            console.log("--->IN THE END", value);

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

  };
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
              assets_Image.push({
                AssetsDocumentId: imageindex,
                Assets_Id: imageitem.assets_id,
                Image: JSON.parse(imageitem.imgValue),
                NicNumber: item.user_cnic,
                assets_tag: underitem.assetTagName.value,
                Unique_Code: "4813_16" + Math.random(),
                ImageName: imageitem.imgName.value,
              })
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
      Address_Permanent_State:customerInfo.customer_per_stateProvince.value,

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
      CommentImageTemp:obj?.fromPraser?.groupImage,
      JobSalaryCardImage:  customerInfo.customer_jobCard == undefined ? "" : customerInfo.customer_jobCard,
      E_VerisysVerficationImage: customerInfo.evrisys_customerImage == undefined ? "" : customerInfo.evrisys_customerImage,
      IsEmployed:customerInfo.customer_isEmployeed?1:0,

      CustomerId: item.id,
      CustomerType: customerInfo.customer_userType == undefined ? 0 : customerInfo.customer_userType.index,
      DateOfBirth: customerInfo.customer_dob,
      DiseaseValue: customerInfo.customer_disease == undefined ? 0 : customerInfo.customer_disease.index,
      Education: customerInfo.customer_education == undefined ? 0 : customerInfo.customer_education.index,
      FPImageStr: customerInfo.customer_biomatric == undefined ? "" : customerInfo.customer_biomatric.imageValue,
      FPImageTemp: customerInfo.customer_biomatric == undefined ? "" : customerInfo.customer_biomatric.imageTemp,
      FamilyNumber: customerInfo.FamilyNumber.value,
      FirstName: customerInfo.customer_name.value,
      Gender: customerInfo.customer_gender=="Male"?"M":customerInfo.customer_gender=="Female"?"F":"T",
      Guardian: customerInfo.customer_guardianceOfName.value,
      GuardianNICNumber: customerInfo.customer_guardianceCnic.value,
      GuardianType: customerInfo.customer_guardianceOf == undefined ? 0 : customerInfo.customer_guardianceOf == "S/O" ? 0 : customerInfo.customer_guardianceOf == "D/O" ? 1 : customerInfo.customer_guardianceOf == "W/O" ? 2 : 0,
      HouseStatus: customerInfo.customer_houseStatus == undefined ? 0 : customerInfo.customer_houseStatus.index,
      HouseType: customerInfo.customer_houseType == undefined ? 0 : customerInfo.customer_houseType.index,
      IsActivated: false,
      IsDeceased: "0",
      IsDisabled: customerInfo.customer_disable == undefined ? 0 : customerInfo.customer_disable?1:0,      
      LastName: customerInfo.customer_surname.value,
      MaritalStatus: customerInfo.customer_maritialStatus == undefined ? 0 : customerInfo.customer_maritialStatus=="Single"?0:customerInfo.customer_maritialStatus=="Married"?1:customerInfo.customer_maritialStatus=="Divorced"?2:3,
      MobileNumber: customerInfo.customer_mobileNumber.value,
      MotherName: customerInfo.customer_motherName.value,
      NICExpiryDate: customerInfo.customer_cnicExpireDate,
      NICIssueDate: customerInfo.customer_cnicissueDate,
      NICNumber: item.user_cnic,
      NICType: "null",
      NextOfKinCNIC: customerInfo.customer_nextKinCnic.value,
      // NextOfKinnRelation: customerInfo.customer_nextKinRelation == undefined ? customerInfo.customer_nextKinOtherRelation == undefined ? 0 : customerInfo.customer_nextKinOtherRelation.value : customerInfo.customer_nextKinRelation.index,
      NextOfKinnRelation: customerInfo.customer_nextKinRelation == undefined ? 0 : Number(customerInfo.customer_nextKinRelation.index+1),
      NumberOfChildren: 0,
      NumberOfSchoolGoingChildren: 0,
      ProfileImageStr: customerInfo.customer_img == undefined ? "" : customerInfo.customer_img,
      ProfileImageTemp: customerInfo.customer_img == undefined ? "" : customerInfo.customer_img,
      RSKRiskProfile: 0,
      Religion: customerInfo.customer_religion == undefined ? 0 : customerInfo.customer_religion.index,
      SupportingPersonFPImageStr: customerInfo.customer_supportingPerson_fingerprint == undefined ? "" : customerInfo.customer_supportingPerson_fingerprint.imageValue,
      SupportingPersonFPImageTemp: customerInfo.customer_supportingPerson_fingerprint == undefined ? "" : customerInfo.customer_supportingPerson_fingerprint.imageTemp,
      TestValue: customerInfo.customer_labourtytestintwoyear == undefined ? "0" : customerInfo.customer_labourtytestintwoyear.index,
      TokenNumber: "",
      bispValue: customerInfo.customer_bispBeneficary == undefined ? 0 : customerInfo.customer_bispBeneficary.index,
      clientCurrentStatus: customerInfo.customer_physicalHealth == undefined ? 0 : customerInfo.customer_physicalHealth.index,
      clientHealthTests: customerInfo.customer_health.value,
      customerGPSLocation: customerInfo.customer_location == undefined ? "25.394759, 68.3312667" : customerInfo.customer_location,
      groupReceivedFromAPK: "R_SAFCO APK",
      nextOfKinName: customerInfo.customer_nextKinName.value,
      regionName: customerInfo.customer_region == undefined ? "" : customerInfo.customer_region,
      stationId: StationReducer.station.stationId,
      stationName: StationReducer.station.stationName,
      status: 0,
      syncStatus: 0,
    }
    console.log("==================================>customer")
    console.log("customerInfo.evrisys_customerImage",customerInfo.evrisys_customerImage)
    
    // console.log("=========================" + JSON.stringify(customerInfo.customer_img))

    console.log("==================================>customer")
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
          Gender: '' + underitem.familyMember_genderSelection=="Male"?"M":underitem.familyMember_genderSelection=="Female"?"F":"T",
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

      console.log(removerItem.guarantor_cnic.value + "========" + customerInfo.customer_cnicNumber.value)

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
    console.log("=================== GURANTORS ====================")
    console.log("=>", guaranteers)
    console.log("=================== GURANTORS ====================")

    //////////////////////////////////////////////////////////////////////////////
    //Getting Loan form vlaues...
    //////////////////////////////////////////////////////////////////////
    var loanInfo = parser.loanInfo[0];
    var Loan = {
      AmountRequiredForBusiness: loanInfo.amountRequiredforBusiness.value,
      AnyOtherExpense: loanInfo.anyOtherExpenses.value,
      AnyOtherRentalIncome: loanInfo.rentalIncome.value,
      ApprovedLoanAmount: loanInfo.approvedLoan.value,
      BorrowerRiskProfile: loanInfo.borrowerriskprofile,
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
      RepaymentFrequency: loanInfo.selectRepaymentFrequency == undefined ? "" : loanInfo.selectRepaymentFrequency.index,
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
      PersonalJobDepartment:loanInfo.PersonalJobDepartment?.index,
      PersonalJobDesignation: loanInfo.PersonalJobDepartment?.value,
      PersonalLoanJobType:loanInfo.PersonalLoanJobType?.index,
      loanId: index,
      occupation: "" + loanInfo.occupation.value,
      PersonalLoanOccupationType: "" + loanInfo.occupationType == undefined ? '' : loanInfo.occupationType,
      AutofinanceProductPrice:""+loanInfo.AutofinanceProductPrice,
      AutofinanceProductPercentage:''+loanInfo.AutofinanceProductPercentagevalue.value,
      IsAutofinance:''+loanInfo.IsAutofinance,
      PreviousLoanStatus: '' + loanInfo.doyouwantSolarTopupLoan,
      IsEbanking:'IsEbanking' in loanInfo ? loanInfo.IsEbanking : 0,
    }


    /////////////////////////////////////////////////////////////////////////////////
    //Getting values of poverty questions....
    ///////////////////////////////////////////////////////////////////////////////////////////////
    var questionnaireAnswer = {
      Answer1: "" + loanInfo.questionsno1,
      Answer2: "" + loanInfo.questionsno2,
      Answer3: "" + loanInfo.questionsno3,
      Answer4: "" + loanInfo.questionsno4,
      Answer5: "" + loanInfo.questionsno5,
      Answer6: "" + loanInfo.questionsno6,
      Answer7: "" + loanInfo.questionsno7,
      Answer8: "" + loanInfo.questionsno8,
      Answer9: "" + loanInfo.questionsno9,
      Answer10: "" + loanInfo.questionsno10,
      Answer11: "" + loanInfo.questionsno11,
      Answer12: "" + loanInfo.questionsno12,
      Answer13: "" + loanInfo.questionsno13,
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

    uploadingDocs(docs[docsIndx - 1], docsIndx, setProgresss)

      .then((value) => {
        // console.log("--response of Documents" + value)
        let nextNumber = docsIndx - 1;

        if (nextNumber > 0) {

          recursivecountDocsuploading(docs, nextNumber);

        } else {
          //           alert(JSON.stringify(allData))
          setTitle("Syncing up..")

          console.log("------>ROW" + obj.length + "<--->" + obj.members + "<--->" + obj.fromPraser + "<--->" + obj.index,)

          GettingCustomerDataRecursive(obj.length, obj.members, obj.fromPraser, obj.index)

        }
      })
      .catch((error) => { });

  };

  //////////////////////////////////////////////////////////////////////////////
  //Recursive function for uploading form Docs images...
  /////////////////////////////////////////////////////////////////////
  const recursivecountAssetsuploading = async (docs, docsIndx) => {
    setDialogeCount("Assets Documents Uploading " + docsIndx)
    uploadingAssetsImage(docs[docsIndx - 1], docsIndx, setProgresss)
      .then((value) => {
        // console.log("--response" + value)
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
      .catch((error) => { });

  };

  // *********************************************************************
  // ========================== SYNC UP Process END ==============================
  // *********************************************************************
  useEffect(() => {
    const unsubscribe = props.navigation.addListener("focus", () => {
      fetchData();
    });
  }, [])
  //-------------------------recursive methodes for delete gurantours
  const recursivecountDownOne = async (members, fromNumber, groupId, item,type) => {

    console.log("---->", members[fromNumber - 1].NicNumber + "<----")

    DeleteSelectedGurantors(groupId, members[fromNumber - 1].NicNumber).then(() => {

      let nextNumber = fromNumber - 1;

      if (nextNumber > 0) {

        recursivecountDownOne(members, nextNumber, groupId, item,type);

      } else {

        DeleteGroupsForms(groupId).then((value) => {

          console.log("--->", value)

          setProgresss(false)

          setToast({

            type: "success",

            message: type==1?"Syncup successfully!":"Successfully Deleted",

          });

          customerSyncUpDatas = [];

          asstesTags = [];

          Docs = [];

          assets_Image = [];

          obj = {};
          setTitle("Updating Tags..")

            setProgresss(true)
          
            CallforTags(StationReducer.station.stationId,setProgresss).then(()=>{
          
              setProgresss(false)
          
            }).catch(()=>{
              setProgresss(false)
            })

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

    console.log("====================>deleteAllRelated");
    
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

  const [UserData, setUserData] = React.useState(undefined);

  const getUserData = useSelector((state) => state.UserData);

  React.useEffect(async () => {

    setUserData(getUserData);
  }, []);
  // ********************* Login User Data****************************

  //-------------------------------------
  const fetchData = () => {
   getGroupsFroms(setFroms,setFromsOrignal, setNoData, setLoading);

  }
  const handleSyncup = (item,index) => {
    if(StationReducer.station==""){
            
      Alert.alert(
          "Process Stop!","Please Syncdown first.",
          [
          
            { text: "OK", onPress: () => console.log("OK Pressed") }
          ],
          { cancelable: false }
        );
      return
  }
  var parser = JSON.parse(item.groupForm)

  if (parser?.borrowerStaification.value == '') {
  
  
    Alert.alert("Stop!","Please fill Branch Manager Checklist.")
  
    return;
  }
    Alert.alert("Syncup?","do you really want to syncup?",[
      {text:'Yes',onPress:()=>{GroupSyncup(item, index)}},
    {text:"No"}
    ])
  }
  const renderItem = ({ item, index }) => (

    <GroupRecorditems item={item}

      UserData={UserData}

      onPressSyncup={() => {
       handleSyncup(item, index)
        
      }}

      onPress={
        async () => {

          var parser = JSON.parse(item.groupForm)

          props.Updatecheck({ value: true, id: item.group_id })

          props.navigation.navigate('AddGroup', { item: parser })
        }
      } />
  );
  const deleteRow = (item) => {

    var groupform = item.item.groupForm;

    var coverter = JSON.parse(groupform);

    var groupMembers = coverter.groupMembers;

    console.log("--->", groupMembers);

    setProgresss(true)

    setTitle("Deleting Group")

    recursivecountDownOne(groupMembers, groupMembers.length, item.item.group_id, item,2)
  }
  const deleteRow2 = (item) => {
    var groupform = item.groupForm;
    var coverter = JSON.parse(groupform);
    var groupMembers = coverter.groupMembers;
    console.log("--->", groupMembers);
    setProgresss(true)
    setTitle("Deleting Group")
    recursivecountDownOne(groupMembers, groupMembers.length, item.group_id, item,1)
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

          text={'Search Groups by name..'}

        />

        <DateChips clearFilter={removeChip} searchData={searchData} setSearchData={setSearchData} />

        {loading && <ActivityIndicator style={{ marginTop: 30 }} color={Colors.parrotGreenColor} />}


        {noData && <Nodata></Nodata>}

        {getCustomerFroms != null && <SwipeListView

        showsVerticalScrollIndicator={false}
        
        contentContainerStyle={{ paddingBottom: 220 }}

        keyExtractor={(item, index) => index.toString()}

          style={{ marginBottom: 0, marginTop: 20, marginLeft: 20, marginRight: 20 }}

          data={getForms}

          renderItem={renderItem}

          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={()=>fetchData()}
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

                            deleteRow(item)


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
export default connect(null, mapDispatchToProps)(Groups);

const styles = StyleSheet.create({
  safeview: {
    flex: 1
  },
  card: {
    marginTop: 10, marginLeft: 30, marginRight: 30, paddingLeft: 10
  },
  row: { flexDirection: "row", alignItems: 'center' },
  circle: {
    height: 30, width: 30, borderRadius: 100, marginLeft: 0, marginRight: 10,
    justifyContent: 'center', backgroundColor: '#f1f1f1'
  }
})

