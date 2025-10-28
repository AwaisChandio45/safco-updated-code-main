import React, {useEffect, useState} from 'react';
import type {Node} from 'react';
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
  Modal,
} from 'react-native';
import RNFS from 'react-native-fs';
import moment from 'moment';
import {Card} from 'react-native-paper';
import {
  AppStatusBar,
  CustomerRecorditems,
  CustomProgressDialoge,
  Header,
  Nodata,
  Search,
  TextView,
} from '../../components';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Entypo from 'react-native-vector-icons/Entypo';
import LottieView from 'lottie-react-native';
import {useNavigation} from '@react-navigation/native';
import {SwipeListView, SwipeRow} from 'react-native-swipe-list-view';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {connect, useSelector} from 'react-redux';
import {ProgressDialog} from 'react-native-simple-dialogs';
import {
  DeleteAssetsImages,
  DeleteCustomerForms,
  DeleteDocImages,
  getAssetsDocuments,
  getAssetsDocumentsforSyncup,
  getCustomerFroms,
  getLoanDocuments,
} from '../../sqlite/sqlitedb';
import {Colors, GlobalStyles} from '../../theme';
var {height, width} = Dimensions.get('window');
import {useDispatch} from 'react-redux';
import {
  CallforTags,
  CheckingTags,
  uploadingAssetsImage,
  uploadingCustomerdata,
  uploadingDocs,
} from '../../apis_auth/apis';
import Toast from '../../components/Toast';
import DateChips from '../../components/DateChips';
import CustomerAnswer from './CustomerAnswer';
import {color} from 'react-native-elements/dist/helpers';
const Customer: () => Node = props => {
  const [getForms, setFroms] = useState(null);
  const [getFormsOrignal, setFromsOrignal] = useState(null);

  const [noData, setNoData] = useState(false);

  const [dialogeCount, setDialogeCount] = useState('Syncing up');

  const StationReducer = useSelector(state => state.StationReducer);

  const [progressVisible, setprogressVisible] = useState(false);

  const [loading, setLoading] = useState(true);

  const [title, setTitle] = useState('Syncing up..');

  const [toast, setToast] = React.useState({value: '', type: ''});

  const [refreshing, setRefreshing] = useState(false);

  const [modalVisible, setModalVisible] = useState(false);

  const dispatch = useDispatch();

  const [searchData, setSearchData] = React.useState([]);

  const [container, setContainer] = React.useState({
    topBar: true,
    startDate: '',
    endDate: '',
    Cnic: '',
    activeInput: true,
  });
  const [UserData, setUserData] = React.useState(undefined);

  const getUserData = useSelector(state => state.UserData);

  var imagesCounter = 1;
  React.useEffect(async () => {
    setUserData(getUserData);
  }, []);

  useEffect(() => {
    const unsubscribe = props.navigation.addListener('focus', async () => {
      fetchData();
    });
  }, []);

  const fetchData = () => {
    getCustomerFroms(setFroms, setFromsOrignal, setNoData, setLoading);
  };
  // **************************************************************************
  //============================ SYNCUP PROCESS ==============================START
  // **************************************************************************
  const Syncup = (item, index) => {
    var parser = JSON.parse(item.forms);

    var Commentsparser = JSON.parse(item.Comments);

    if (Commentsparser) {
    } else {
      setToast({
        type: 'error',

        message: 'Please insert comments first!',
      });

      return;
    }
    let make = [];
    //////////////////////////////////////////////////////////////////////////////
    //Getting Tags for checking...
    /////////////////////////////////////////////////////////////////////
    if (parser) {
      var temp = parser.assestsInfo;

      temp.map((underitem, undexindex) => {
        if (
          underitem.assetTagName.value != undefined &&
          underitem.assetTagId.value.length > 0
        ) {
          make.push({
            AssetTagId: underitem.assetTagId.value,
            AssetTagName: underitem.assetTagName.value,
          });
        }
      });
    } else {
      return;
    }
    //////////////////////////////////////////////////////////////////////////////
    //Send array of tags for checking already exist or not ...(CheckingTags)
    /////////////////////////////////////////////////////////////////////
    setTitle('Checking Tags..');
    setprogressVisible(true);

    CheckingTags(make, setprogressVisible)
      .then(value => {
        console.log('CheckingTags==>' + value);

        if (value.length > 0) {
          setToast({
            type: 'error',

            message: '' + value,
          });
          setTitle('Updating Tags..');
          setprogressVisible(true);
          CallforTags(
            StationReducer.station.stationId,
            setprogressVisible,
          ).then(values => {
            setprogressVisible(false);
          });
        } else {
          setTitle('Uploading Documents..');

          //////////////////////////////////////////////////////////////////////////////
          //Gettings Docs of loan
          /////////////////////////////////////////////////////////////////////
          console.log('===>item.user_cnic', JSON.stringify(item.user_cnic));

          let docs = [];

          getLoanDocuments(item.user_cnic)
            .then(value => {
              if (value) {
                if (value.length > 0) {
                  value.map((underitem, underindex) => {
                    docs.push({
                      CustomerId: item.id,
                      DocumentId: underindex,
                      Image: underitem.imgValue,
                      LoanId: index,
                      NicNumber: item.user_cnic,
                      UniqueCode: '4813_16' + Math.random(),
                      ImageName: underitem.imgName.value,
                    });
                  });
                  //////////////////////////////////////////////////////////////////////////////
                  //(Uploading docs) (recursivecountDocsuploading)
                  /////////////////////////////////////////////////////////////////////
                  // GettingCustomerData(item,index)
                  console.log(
                    '==============================> LOGS ==============>',
                  );
                  console.log(docs);
                  console.log(docs.length);

                  console.log(
                    '==============================> LOGS ==============>',
                  );

                  setTitle('Uploading Docs..');
                  imagesCounter = 1;
                  recursivecountDocsuploading(docs, docs.length, item, index);
                } else {
                  setToast({
                    type: 'error',

                    message: 'Sorry! Documents not found.',
                  });
                }
              }
            })
            .catch(error => {
              console.log('catch works', JSON.stringify(error));
            });
        }
      })
      .catch(error => {
        console.log(error);

        setToast({
          type: 'error',
          message: '' + error,
        });

        setDialogeCount('Syncing up');
      });
  };
  //////////////////////////////////////////////////////////////////////////////
  //Recursive function for uploading form Docs images...
  /////////////////////////////////////////////////////////////////////
  const recursivecountDocsuploading = async (
    docs,
    docsIndx,
    topItem,
    topindex,
  ) => {
    // setDialogeCount("Documents Uploading " + docsIndx)

    uploadingDocs(docs[docsIndx - 1], imagesCounter, setprogressVisible)
      .then(value => {
        imagesCounter++;
        console.log('--response' + value);

        let nextNumber = docsIndx - 1;

        if (nextNumber > 0) {
          recursivecountDocsuploading(docs, nextNumber, topItem, topindex);
        } else {
          // setToast({
          //   type: "success",
          //   message: "You can continue",
          // });
          setTitle('Syncing up');

          GettingCustomerData(topItem, topindex);
          // alert("Successfull Delete Gurantor")
          // props.navigation.goBack();
        }
      })
      .catch(error => {});
  };

  //////////////////////////////////////////////////////////////////////////////
  //Recursive function for uploading form Assets images...
  /////////////////////////////////////////////////////////////////////
  const recursivecountAssetsuploading = async (
    docs,
    docsIndx,
    topItem,
    topindex,
  ) => {
    // setDialogeCount("Documents Uploading " + docsIndx)
    uploadingAssetsImage(docs[docsIndx - 1], docsIndx, setprogressVisible)
      .then(value => {
        console.log('--response' + value);

        let nextNumber = docsIndx - 1;

        if (nextNumber > 0) {
          recursivecountAssetsuploading(docs, nextNumber, topItem, topindex);
        } else {
          setToast({
            type: 'success',
            message: 'Syncup successfully!',
          });

          DeleteCustomerForms(topItem.id, topItem.user_cnic)
            .then(value => {
              DeleteDocImages(topItem.user_cnic).then(() => {
                DeleteAssetsImages(topItem.user_cnic).then(() => {
                  setprogressVisible(false);

                  setTitle('Syncing up..');

                  setToast({
                    type: 'success',
                    message: 'Successfully Delete',
                  });
                  let get2 = getForms;
                  get2.splice(topindex, 1);
                  setFroms(get2);
                  setFromsOrignal(get2);
                  fetchData();
                  setTitle('Updating Tags..');
                  setprogressVisible(true);
                  CallforTags(
                    StationReducer.station.stationId,
                    setprogressVisible,
                  ).then(values => {
                    setprogressVisible(false);
                  });
                });
              });
            })
            .catch(() => {});
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
      .catch(error => {});
  };
  //////////////////////////////////////////////////////////////////////////////
  //Getting Data of Customer...
  /////////////////////////////////////////////////////////////////////
  const GettingCustomerData = async (item, index) => {
    var parser = JSON.parse(item.forms);
    var converter = item.CustomerAnswers;
    var parser2 = JSON.parse(converter);
    var CustomerAns = parser2.answerArray;
    var Commentsparser = JSON.parse(item.Comments);

    let assets = [];
    let assets_Image = [];
    //////////////////////////////////////////////////////////////////////////////
    //Getting Assets form vlaues...
    /////////////////////////////////////////////////////////////////////
    parser.assestsInfo.map((underitem, underindex) => {
      assets.push({
        AssetName: '' + underitem.assetName.value,
        AssetOwner: '' + underitem.assetOwner.value,
        AssetQuantity: '' + underitem.assetQuantity.value,
        AssetTagId: '' + underitem.assetTagId.value,
        AssetTagName: '' + underitem.assetTagName.value,
        AssetValue: '' + underitem.assetValue.value,
        CustomerAssetId: '' + underindex,
        CustomerId: '' + item.id,
        Notes: '' + underitem.assetNote.value,
        _CustomerAssetNameId: underindex,
      });
      getAssetsDocumentsforSyncup(item.user_cnic)
        .then(value => {
          if (value) {
            if (value.length > 0) {
              value.map((imageitem, imageindex) => {
                assets_Image.push({
                  AssetsDocumentId: imageindex,
                  Assets_Id: imageitem.assets_id,
                  Image: JSON.parse(imageitem.imgValue),
                  NicNumber: item.user_cnic,
                  assets_tag: underitem.assetTagName.value,
                  Unique_Code: '4813_16' + Math.random(),
                  ImageName: imageitem.imgName.value,
                });
              });
            }
          }
        })
        .catch(() => {});
    });
    var customerInfo = parser.customerInfo[0];
    //////////////////////////////////////////////////////////////////////////////
    //Getting customer form vlaues...
    /////////////////////////////////////////////////////////////////////
    // console.log("customerInfo.evrisys_customerImage",customerInfo.evrisys_customerImage)
    var customer = {
      Address_Permanent_Address: customerInfo.customer_per_address.value,
      Address_Permanent_City: customerInfo.customer_per_city.value,
      Address_Permanent_Country: customerInfo.customer_per_country.value,
      Address_Permanent_District_Name: customerInfo.customer_per_district.value,
      Address_Permanent_Mohalla_Village:
        customerInfo.customer_per_mohalla.value,
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
      ClientDisease:
        customerInfo.customer_disease == undefined
          ? 0
          : customerInfo.customer_disease.index,
      CommentImageStr: Commentsparser.groupImage,
      CommentImageTemp: Commentsparser.groupImage,

      JobSalaryCardImage:
        customerInfo.customer_jobCard == undefined
          ? ''
          : customerInfo.customer_jobCard,
      E_VerisysVerficationImage:
        customerInfo.evrisys_customerImage == undefined
          ? ''
          : customerInfo.evrisys_customerImage,
      IsEmployed: customerInfo.customer_isEmployeed ? 1 : 0,

      CustomerAddedBy: Commentsparser.addedBy.value,
      CustomerAddedByComment: Commentsparser.commentOfAddedby.value,
      CustomerAddedByDesignation: Commentsparser.addedByDesignation.value,
      CustomerId: item.id,
      CustomerType:
        customerInfo.customer_userType == undefined
          ? 0
          : customerInfo.customer_userType.index,
      CustomerVerifiedBy: Commentsparser.verifiedBy.value,
      CustomerVerifiedByComment: Commentsparser.commentsofVerifiedby.value,
      CustomerVerifiedByDesignation: Commentsparser.verifiedByDesignation.value,
      DateOfBirth: customerInfo.customer_dob,
      DiseaseValue:
        customerInfo.customer_disease == undefined
          ? 0
          : customerInfo.customer_disease.index,
      Education:
        customerInfo.customer_education == undefined
          ? 0
          : customerInfo.customer_education.index,
      FPImageStr:
        customerInfo.customer_biomatric == undefined
          ? ''
          : customerInfo.customer_biomatric.imageValue,
      FPImageTemp:
        customerInfo.customer_biomatric == undefined
          ? ''
          : customerInfo.customer_biomatric.imageTemp,
      FamilyNumber: customerInfo.FamilyNumber.value,
      FirstName: customerInfo.customer_name.value,
      Gender:
        customerInfo.customer_gender == 'Male'
          ? 'M'
          : customerInfo.customer_gender == 'Female'
          ? 'F'
          : 'T',
      Guardian: customerInfo.customer_guardianceOfName.value,
      GuardianNICNumber: customerInfo.customer_guardianceCnic.value,
      GuardianType:
        customerInfo.customer_guardianceOf == undefined
          ? 0
          : customerInfo.customer_guardianceOf == 'S/O'
          ? 0
          : customerInfo.customer_guardianceOf == 'D/O'
          ? 1
          : customerInfo.customer_guardianceOf == 'W/O'
          ? 2
          : 0,
      HouseStatus:
        customerInfo.customer_houseStatus == undefined
          ? 0
          : customerInfo.customer_houseStatus.index,
      HouseType:
        customerInfo.customer_houseType == undefined
          ? 0
          : customerInfo.customer_houseType.index,
      IsActivated: false,
      IsDeceased: '0',
      IsDisabled:
        customerInfo.customer_disable == undefined
          ? 0
          : customerInfo.customer_disable
          ? 1
          : 0,
      LastName: customerInfo.customer_surname.value,
      MaritalStatus:
        customerInfo.customer_maritialStatus == undefined
          ? 0
          : customerInfo.customer_maritialStatus == 'Single'
          ? 0
          : customerInfo.customer_maritialStatus == 'Married'
          ? 1
          : customerInfo.customer_maritialStatus == 'Divorced'
          ? 2
          : 3,
      MobileNumber: customerInfo.customer_mobileNumber.value,
      MotherName: customerInfo.customer_motherName.value,
      NICExpiryDate: '' + customerInfo.customer_cnicExpireDate,
      NICIssueDate: '' + customerInfo.customer_cnicissueDate,
      NICNumber: item.user_cnic,
      NICType: 'null',
      NextOfKinCNIC: customerInfo.customer_nextKinCnic.value,
      // NextOfKinnRelation: customerInfo.customer_nextKinRelation == undefined ? customerInfo.customer_nextKinOtherRelation == undefined ? 0 : customerInfo.customer_nextKinOtherRelation.value : customerInfo.customer_nextKinRelation.index,
      NextOfKinnRelation:
        customerInfo.customer_nextKinRelation == undefined
          ? 0
          : Number(customerInfo.customer_nextKinRelation.index + 1),
      NumberOfChildren: 0,
      NumberOfSchoolGoingChildren: 0,
      ProfileImageStr:
        customerInfo.customer_img == undefined ? '' : customerInfo.customer_img,
      ProfileImageTemp:
        customerInfo.customer_img == undefined ? '' : customerInfo.customer_img,
      RSKRiskProfile: 0,
      Religion:
        customerInfo.customer_religion == undefined
          ? 0
          : customerInfo.customer_religion.index,
      SupportingPersonFPImageStr:
        customerInfo.customer_supportingPerson_fingerprint == undefined
          ? ''
          : customerInfo.customer_supportingPerson_fingerprint.imageValue,
      SupportingPersonFPImageTemp:
        customerInfo.customer_supportingPerson_fingerprint == undefined
          ? ''
          : customerInfo.customer_supportingPerson_fingerprint.imageTemp,
      TestValue:
        customerInfo.customer_labourtytestintwoyear == undefined
          ? '0'
          : customerInfo.customer_labourtytestintwoyear.index,
      TokenNumber: '',
      bispValue:
        customerInfo.customer_bispBeneficary == undefined
          ? 0
          : customerInfo.customer_bispBeneficary.index,
      clientCurrentStatus:
        customerInfo.customer_physicalHealth == undefined
          ? 0
          : customerInfo.customer_physicalHealth.index,
      clientHealthTests: customerInfo.customer_health.value,
      customerGPSLocation:
        customerInfo.customer_location == undefined
          ? '25.394759, 68.3312667'
          : customerInfo.customer_location,
      groupReceivedFromAPK: 'R_SAFCO APK',
      nextOfKinName: customerInfo.customer_nextKinName.value,
      regionName:
        '' + customerInfo.customer_region == undefined
          ? 'region'
          : customerInfo.customer_region,
      stationId: StationReducer.station.stationId,
      stationName: StationReducer.station.stationName,
      status: 0,
      syncStatus: 0,
    };

    //////////////////////////////////////////////////////////////////////////////
    //Getting HALFNAME form vlaues...
    /////////////////////////////////////////////////////////////////////
    var customerAnswers = [
      {
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
      },
    ];
    //////////////////////////////////////////////////////////////////////////////
    //Getting customerBMChecklistAnswers form vlaues...
    /////////////////////////////////////////////////////////////////////
    var customerBMChecklistAnswers = [
      {
        CustomerId: item.id,
        appraisalPlaceValue: Commentsparser.socialAppraisal.index,
        borrowerVisitValue: Commentsparser.visitedBorrower.index, //1
        cusActionPlan1: Commentsparser.riskAssementno1.value, //""
        cusActionPlan2: Commentsparser.riskAssementno2.value, //""
        cusActionPlan3: Commentsparser.riskAssementno3.value, //""
        cusAddress: Commentsparser.borrowerAddress.value, //""
        cusBMChecklistAns1: Commentsparser.counductPhysicalVisit.value, //0,
        cusBMChecklistAns10: Commentsparser.socialandManagmentPolicy.value, //0,
        cusBMChecklistAns11: Commentsparser.verifiedCIBPolicy.value, //0,
        cusBMChecklistAns12: Commentsparser.doesBorrowerEnivro.value, //0,
        cusBMChecklistAns13: Commentsparser.doesEnterprise.value, //0,
        cusBMChecklistAns2: Commentsparser.verifiedreApparisal.value, //0,
        cusBMChecklistAns3: Commentsparser.verifiedRepaymentHistory.value, //0,
        cusBMChecklistAns4: Commentsparser.criticalAssetsValuation.value, //0,
        cusBMChecklistAns5: Commentsparser.verifiedbyContactNumber.value, //0,
        cusBMChecklistAns6: Commentsparser.meetwithSocialResponsible.value, //0,
        cusBMChecklistAns7: Commentsparser.meetwithPersonalGuarantee.value, //0,
        cusBMChecklistAns8: Commentsparser.verifiedProvidedDoc.value, //0,
        cusBMChecklistAns9: Commentsparser.amlPolicyandProcedure.value, //0,
        cusContact: Commentsparser.borrowerPhone.value, //"22222222222",
        cusImplTimeline1: Commentsparser.riskAssementTimelineone.value, //0,
        cusImplTimeline2: Commentsparser.riskAssementTimelinetwo.value, //0,
        cusImplTimeline3: Commentsparser.riskAssementTimelinethree.value, //0,
        cusNICNumber: item.user_cnic, //"41355-8889990-0",
        cusName: Commentsparser.borrowerName.value, //"w",
        cusReason: Commentsparser.borrowerRemarks.value, //"56",
        decisionValue: Commentsparser.borrowerApproval.index, //2,
        remarksValue: Commentsparser.borrowerStaification.index, //
      },
    ];
    //////////////////////////////////////////////////////////////////////////////
    //Getting familyMember form vlaues...
    /////////////////////////////////////////////////////////////////////
    let familyMembers = [];
    parser.familyMemberInfo.map((underitem, underindex) => {
      console.log('======familyMembers======>');
      console.log('======familyMembers======>');
      console.log('======familyMembers======>');
      console.log('======familyMembers======>');

      // console.log(""+underitem.familyMember_genderSelection==="Male"?"M":underitem.familyMember_genderSelection==="Female"?"F":"T")
      console.log('=====familyMembers=======>');
      console.log('======familyMembers======>');
      console.log('======familyMembers======>');
      console.log('======familyMembers======>');

      familyMembers.push({
        Age: '' + underitem.familyMember_age.value,
        BusinessAddress: '' + underitem.familyMember_businessAddress.value,
        CustomerFamilyMemberId: underindex,
        CustomerId: '' + item.id,
        Education: '' + underitem.familyMember_education.value,
        FullName: '' + underitem.familyMember_fullname.value,
        Gender:
          '' + underitem.familyMember_genderSelection == 'Male'
            ? 'M'
            : underitem.familyMember_genderSelection == 'Female'
            ? 'F'
            : 'T',
        MonthlyEarning: '' + underitem.familyMember_montlyEarning.value,
        NICNumber: '' + underitem.familyMember_cnic.value,
        RelationshipWithCustomer: '' + underitem.familyMember_relation.value,
        SourceOfIncome: '' + underitem.familyMember_sourceIncome.value,
      });
    });
    //////////////////////////////////////////////////////////////////////////////
    //Getting guaranteers form vlaues...
    //////////////////////////////////////////////////////////////////////
    let guaranteers = [];
    parser.guarantorInfo.map((underitem, underindex) => {
      guaranteers.push({
        Address: '' + underitem.guarantor_address.value,
        BusinessAddress: '' + underitem.guarantor_businessAddress.value,
        ContactNumber: '' + underitem.guarantor_contactno.value,
        CustomerGuaranteerId: '' + index,
        CustomerId: item.id,
        FullName: '' + underitem.guarantor_fullname.value,
        JobDescription: '' + underitem.guarantor_jobDescription.value,
        JobType: '' + underitem.guarantor_jobType.value,
        LoanId: '' + index,
        NICNumber: '' + underitem.guarantor_cnic.value,
        Notes: '' + underitem.guarantor_businessNote.value,
        Status: 1,
      });
    });
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
      EsmProductItemRisk: loanInfo.EsmProductItemRisk,
      EsmProductRiskValue: loanInfo.EsmProductRiskValue,
      BusinessAddress: loanInfo.businessAddress.value,
      ChildrenEducationExpense: loanInfo.childrenExpense.value,
      CustomerProductRisk:
        loanInfo.customerandproductrisk == undefined
          ? 0
          : loanInfo.customerandproductrisk.index,
      CustomerProductRiskRemarks: loanInfo.customerandProductriskRemarks.value,
      ExistingBusiness: loanInfo.businessName.value,
      ExpectedMonthlyIncomeFromBusiness: loanInfo.expectedMonthlyIncome.value,
      ExperienceInBusiness: loanInfo.experianceinBusiness.value,
      GeographicRisk:
        loanInfo.geographicrisk == undefined
          ? 0
          : loanInfo.geographicrisk?.index,
      GeographicRiskRemarks: loanInfo.geographicriskRemarks.value,
      HouseholdExpense: loanInfo.monthlyHouseholdExpense.value,
      HouseholdLiability: loanInfo.householdLiability.value,
      Household_MonthlyExpense: loanInfo.monthlyHouseholdExpense.value,
      Household_MonthlyIncome: loanInfo.monthlyHouseholdIncome.value,
      Household_Savings: loanInfo.householdSavings.value,
      IncomeFromOtherExpense: loanInfo.incomefromOtherSource.value,
      IncomeFromSales: loanInfo.incomeFromSales.value,
      Liability: loanInfo.liability.value,
      LoanStatus:
        loanInfo.loanStatus == undefined ? '' : loanInfo.loanStatus.value,
      LoanSubType:
        loanInfo.loanSubType == undefined ? '' : loanInfo.loanSubType.value,
      LoanTerm: loanInfo.loanTerm.value,
      LoanTypeId: loanInfo.loanType == undefined ? 0 : loanInfo.loanType.value,
      LoanTypeValue:
        loanInfo.loanType == undefined ? 0 : loanInfo.loanType.index,
      LoanUtilizationRisk:
        loanInfo.loanUtilizationrisk == undefined
          ? 0
          : loanInfo.loanUtilizationrisk.index, //""
      LoanUtilizationRiskRemarks: loanInfo.loanUtilizationriskRemarks.value, //''
      MonthlyExpense: loanInfo.monthlyExpenses.value,
      MonthlyIncome: loanInfo.monthlyIncome.value,
      MonthlyInstallmentFromLender: loanInfo.monthlyInstallment.value, //""
      NoOfEmployees: loanInfo.no_of_emploee.value,
      Notes: loanInfo.loanNote.value,
      OtherExpense: loanInfo.otherExpenses.value,
      OtherFamilyIncome: loanInfo.otherFamilyIncome.value,
      OtherMonthlyLiability: loanInfo.anyOtherMonthly.value,
      OtherUtilityExpense: loanInfo.utilityExpense.value,
      PEPRisk: loanInfo.peprisk == undefined ? 0 : loanInfo.peprisk.index,
      PEPRiskRemarks: loanInfo.pepriskRemakrs.value,
      PersonalCapitalInBusiness: loanInfo.personalCapitalinBusiness.value,
      ProcessingFeesStatus: '',
      RawMaterialPurchasing: loanInfo.rawMaterialpurchase.value,
      RentalOrAnyOtherIncome: loanInfo.rentalIncome.value,
      RepaymentFrequency:
        loanInfo.selectRepaymentFrequency == undefined
          ? ''
          : loanInfo.selectRepaymentFrequency?.index,
      RequestedLoanAmount: loanInfo.requestedLoan.value,
      numericalValue: loanInfo.numericalValue.value, //my code
      SalariesAndLabourCharges: loanInfo.salariesandLabourCharges.value,
      Savings: loanInfo.businessSavings.value,
      SubTypeValue:
        loanInfo.loanSubType == undefined ? '' : loanInfo.loanSubType.value,
      TopUpLoan:
        loanInfo.doyouwantTopupLoan == undefined
          ? ''
          : loanInfo.doyouwantTopupLoan,
      TopUpLoanAmount: loanInfo.topupLoanValue.value,
      TopUpLoanType:
        loanInfo.topupLoantype == undefined ? '' : loanInfo.topupLoantype.index,
      TopUpQuantity:
        loanInfo.topupLoanQty == undefined ? '' : loanInfo.topupLoanQty,
      UtilityExpense: loanInfo.utilityExpense.value,
      addedDateTime: moment(new Date()).format('YYYY-MM-DD'),
      customerId: item.id,
      customerLoanTypeId: loanInfo.customerLoan_type?.index,
      PersonalJobDepartment: loanInfo.PersonalJobDepartment?.index,
      PersonalJobDesignation: loanInfo.PersonalJobDepartment?.value,
      PersonalLoanJobType: loanInfo.PersonalLoanJobType?.index,
      loanId: index,
      occupation: '' + loanInfo.occupation.value,
      PersonalLoanOccupationType:
        '' + loanInfo.occupationType == undefined
          ? ''
          : loanInfo.occupationType,
      AutofinanceProductPrice: '' + loanInfo.AutofinanceProductPrice,
      AutofinanceProductPercentage:
        '' + loanInfo.AutofinanceProductPercentagevalue.value,
      IsAutofinance: '' + loanInfo.IsAutofinance,
      PreviousLoanStatus: '' + loanInfo.doyouwantSolarTopupLoan,
      IsEbanking: 'IsEbanking' in loanInfo ? loanInfo.IsEbanking : 0,
    };
    console.log('==================================>Loan');
    console.log('=========================>>' + JSON.stringify(Loan));

    console.log('==================================>Loan');
    // return

    /////////////////////////////////////////////////////////////////////////////////
    //Getting values of poverty questions....
    ///////////////////////////////////////////////////////////////////////////////////////////////
    var questionnaireAnswer = {
      Answer1: '' + loanInfo.questionsno1,
      Answer2: '' + loanInfo.questionsno2,
      Answer3: '' + loanInfo.questionsno3,
      Answer4: '' + loanInfo.questionsno4,
      Answer5: '' + loanInfo.questionsno5,
      Answer6: '' + loanInfo.questionsno6,
      Answer7: '' + loanInfo.questionsno7,
      Answer8: '' + loanInfo.questionsno8,
      Answer9: '' + loanInfo.questionsno9,
      Answer10: '' + loanInfo.questionsno10,
      Answer11: '' + loanInfo.questionsno11,
      Answer12: '' + loanInfo.questionsno12,
      Answer13: '' + loanInfo.questionsno13,
      CustomerId: item.id,
      Loan_Id: index,
      QuestionnaireFormId: 1,
    };
    /////////////////////////////////////////////////////////////////////////////////
    //Making object of loanSyncUpDatas
    ///////////////////////////////////////////////////////////////////////////////////////////////

    let loanSyncUpDatas = [
      {
        Loan: Loan,
        questionnaireAnswer: questionnaireAnswer,
      },
    ];

    /////////////////////////////////////////////////////////////////////////////////
    //Making object of customerSyncUpDatas
    ///////////////////////////////////////////////////////////////////////////////////////////////

    var customerSyncUpDatas = [
      {
        assets,
        customer,
        customerAnswers,
        customerBMChecklistAnswers,
        familyMembers,
        guaranteers,
        loanSyncUpDatas,
      },
    ];

    /////////////////////////////////////////////////////////////////////////////////
    //Making object of group
    ///////////////////////////////////////////////////////////////////////////////////////////////
    console.log('username----?', item.user_name);
    var group = {
      Group_Added_By: 'Added_By',
      Group_Added_By_Comment: 'Added_By_Comment',
      Group_Added_By_Designation: 'Added_By_Designation',
      Group_Name: '' + item.user_name,
      Group_Note: 'note',
      Group_Status: 'Processed',
      Group_Verified_By: 'Verified_By',
      Group_Verified_By_Comment: 'Verified_By_Comment',
      Group_Verified_By_Designation: 'Verified_By_Designation',
      groupId: 0,
      BMLocation:
        Commentsparser.user_location == undefined
          ? '25.394759-68.3312667'
          : Commentsparser.user_location,
      syncUpStatus: 0,
    };
    /////////////////////////////////////////////////////////////////////////////////
    //Making object of group
    ///////////////////////////////////////////////////////////////////////////////////////////////

    let groupBMChecklistAnswers = [];
    /////////////////////////////////////////////////////////////////////////////////
    //Making object of groupMembers
    ///////////////////////////////////////////////////////////////////////////////////////////////

    let groupMembers = [
      {
        CustomerGroupId: 0,
        CustomerGroupMemberId: 0,
        CustomerId: item.id,
        Fullname: item.user_name,
        IsGroupLeader: true,
        NicNumber: item.user_cnic,
      },
    ];

    /////////////////////////////////////////////////////////////////////////////////
    //Making object of final Object
    ///////////////////////////////////////////////////////////////////////////////////////////////
    var Uploading: any = {
      customerSyncUpDatas: customerSyncUpDatas,
      group: group,
      groupBMChecklistAnswers: groupBMChecklistAnswers,
      groupMembers: groupMembers,
    };
    // *******************************************************************WRITE FILE
    // const granted = await PermissionsAndroid.request(
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
    uploadingCustomerdata(Uploading, setprogressVisible)
      .then(value => {
        // *******************************************************************WRITE FILE
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
        console.log('--->IN THE END', value);
        if (value === 'Success') {
          //////////////////////////////////////////////////////////////////////////////
          // (Uploading AssetsImage) (recursivecountAssetsuploading)
          /////////////////////////////////////////////////////////////////////
          setTitle('Uploading Assets Images..');
          recursivecountAssetsuploading(
            assets_Image,
            assets_Image.length,
            item,
            index,
          );
        } else {
          setToast({
            type: 'error',
            message: '' + value,
          });
        }
      })

      .catch(error => {});
  };

  // **************************************************************************
  //============================ SYNCUP PROCESS ==============================END
  // **************************************************************************

  // ******************************************* SERACH
  const searchText = e => {
    let text = e.toLowerCase();
    let filteredName = getFormsOrignal.filter(item => {
      if (item.user_name.toLowerCase().match(text)) {
        return item.user_name.toLowerCase().match(text);
      } else {
      }
    });
    if (!text || text === '') {
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
    const location = `${latitude},${Longitudes}`;
    const url = Platform.select({
      ios: `maps:${location}`,
      android: `geo:${location}?center=${location}&q=${location}&z=16`,
    });
    Linking.openURL(url);
  };
  // ************************************
  const removeChip = index => {
    setFroms([]);
    setSearchData([]);
    setLoading(true);
    fetchData();
  };

  const renderItem = ({item, index}) => (
    <CustomerRecorditems
      item={item}
      UserData={UserData}
      onPressIn={() => {
        if (StationReducer.station == '') {
          Alert.alert(
            'Process Stop!',
            'Please Syncdown first.',
            [{text: 'OK', onPress: () => console.log('OK Pressed')}],
            {cancelable: false},
          );
          return;
        }
        Alert.alert('Await!', 'Do you really want to Syncup ?', [
          {text: 'Yes', onPress: () => Syncup(item, index)},
          {text: 'No'},
        ]);
      }}
      onPresscomment={() =>
        props.navigation.navigate('Comments', {
          item: JSON.parse(item.Comments),
          id: item.id,
        })
      }
      onPress={async () => {
        if (StationReducer.station == '') {
          Alert.alert(
            'Process Stop!',
            'Please Syncdown first.',
            [{text: 'OK', onPress: () => console.log('OK Pressed')}],
            {cancelable: false},
          );
          return;
        }
        var parser = JSON.parse(item.forms);
        props.Updatecheck({value: true, id: item.id});
        props.navigation.navigate('AddForm', {
          item: parser,
          user_cnic: item.user_cnic,
        });
      }}
      onPressNavigation={() => {
        handleNavigation(item.Latitude, item.Longitudes);
      }}
      setModalVisible={setModalVisible}
    />
  );
  return (
    <SafeAreaView style={styles.safeview}>
      <AppStatusBar></AppStatusBar>
      <Header Theme={''}></Header>
      <View>
        <Search
          Theme={''}
          filterData={container}
          setFilterData={setContainer}
          setSearchData={setSearchData}
          onChangeText={e => searchText(e)}
          Data={getForms}
          setData={setFroms}
          variable={1}
          setNoData={setNoData}
          setLoading={setLoading}
          text={'Search Customer by name..'}
        />
        <DateChips clearFilter={removeChip} searchData={searchData} />
        {loading && (
          <ActivityIndicator
            style={{marginTop: 30}}
            color={Colors.parrotGreenColor}
          />
        )}
        {noData && <Nodata></Nodata>}

        {getCustomerFroms != null && (
          <SwipeListView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{paddingBottom: 300}}
            style={{marginTop: 20, marginLeft: 20, marginRight: 20}}
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
                  flexDirection: 'row',
                  alignItems: 'center',
                  marginRight: 0,
                  marginTop: 20,
                }}>
                <View style={{flex: 1}}></View>
                <View style={{}}>
                  <TouchableOpacity
                    onPress={() => {
                      Alert.alert('Delete!', 'Do you really want to delete?', [
                        {
                          text: 'Cancel',
                          onPress: () => console.log('Cancel Pressed'),
                          style: 'cancel',
                        },
                        {
                          text: 'OK',
                          onPress: () => {
                            setprogressVisible(true);
                            setTitle('Deleting...');
                            DeleteCustomerForms(
                              item.item.id,
                              item.item.user_cnic,
                            )
                              .then(value => {
                                DeleteDocImages(item.item.user_cnic).then(
                                  () => {
                                    DeleteAssetsImages(
                                      item.item.user_cnic,
                                    ).then(() => {
                                      setprogressVisible(false);
                                      setTitle('Syncing up..');
                                      setToast({
                                        type: 'success',
                                        message: 'Successfully Delete',
                                      });
                                      let get2 = getForms;
                                      get2.splice(index, 1);
                                      setFroms(get2);
                                      setFromsOrignal(get2);
                                      fetchData();
                                    });
                                  },
                                );
                              })
                              .catch(() => {});
                            // let get = allDataobj;
                            // get.assestsInfo[item.index].activeTab = false;
                            // setAlldataobj({...get});
                          },
                        },
                      ]);
                    }}>
                    <View
                      style={{
                        justifyContent: 'center',
                        height: 50,
                        width: 50,
                        borderRadius: 10,
                      }}>
                      <MaterialCommunityIcons
                        name="delete-outline"
                        color={'#FF0000'}
                        size={26}
                      />
                    </View>
                  </TouchableOpacity>
                </View>
              </View>
            )}
            rightOpenValue={-75}
          />
        )}
      </View>
      <CustomProgressDialoge
        dialogVisible={progressVisible}
        setDialogVisible={setprogressVisible}
        title={title}
      />
      <Toast {...toast} onDismiss={() => setToast({message: '', type: ''})} />

      <Modal
        //animationType={'fade'}
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(false);
          //console.log('Modal has been closed.');
        }}></Modal>
    </SafeAreaView>
  );
};
const mapDispatchToProps = dispatch => {
  return {
    Updatecheck: Data => {
      dispatch({
        type: 'SET_UPDATECHECK',
        payload: Data,
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
    marginTop: 10,
    marginLeft: 30,
    marginRight: 30,
    paddingLeft: 10,
  },
  row: {flexDirection: 'row', alignItems: 'center'},
  circle: {
    height: 30,
    width: 30,
    borderRadius: 100,
    marginLeft: 0,
    marginRight: 10,
    justifyContent: 'center',
    backgroundColor: '#f1f1f1',
  },
});
