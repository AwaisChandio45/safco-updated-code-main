import React, {memo, useRef, useEffect, useState} from 'react';
import type {Node} from 'react';
import {
  View,
  Pressable,
  KeyboardAvoidingView,
  StyleSheet,
  Dimensions,
  ScrollView,
  Text,
  Alert,
  Image,
  FlatList,
  SafeAreaView,
  TextInput,
} from 'react-native';
import {
  DateSelector,
  FormInputs,
  Tabsitems,
  TextView,
  CustomDropdownPicker,
  BottomButton,
  Question,
  MyDropdown,
  ModalViewEverisys,
} from '../../components';
import {useNavigation} from '@react-navigation/native';
import RNFS from 'react-native-fs';
import {WebView} from 'react-native-webview';

import {Checkbox} from 'react-native-paper';
import {connect, useSelector} from 'react-redux';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import * as Animatable from 'react-native-animatable';
import {
  Dropdownlist,
  RiskDropdownlist,
  CnicInputoptions,
} from '../../components';
const {height, width} = Dimensions.get('window');
import {NativeModules} from 'react-native';
import {
  Geographicrisk,
  CustomerandProductRisk,
  PEPRisk,
  LoanUBO,
  CustomerLoantypes,
  TopUpLOAN,
  SolarLOAN,
  topUpLoantype,
  quantity,
  Departments,
  SelectJobs,
  JOBTypes,
  imageNames,
  EsmProductWiseRisk,
  EsmProductWiseRiskList,
} from '../../utilis/RequiredArrays';
import ImagePicker from 'react-native-image-crop-picker';
import {Colors, GlobalStyles} from '../../theme';
import {useDispatch} from 'react-redux';
import {
  getLoanDocuments,
  getLoanTopupLoanArray,
  getLoanTypesArray,
  getDonoretails,
  getquestionsArray,
  getSubLoanTypesArray,
  insertAndDeleteTempForms,
  updateCustomerFromDatawithLoanForm,
  updateCustomerImages,
  updateCustomerImagesfromLoanFormPage,
} from '../../sqlite/sqlitedb';
import Toast from '../../components/Toast';
import {CustomDropdown} from '../../components';
import {e_verisys} from '../../apis_auth/baseUrl';
import Customprogress from '../../components/Customprogress';
import ImageComponent from '../../components/ImageComponent';
import ImageNameList from '../../components/ImageNameList';
import ZoomableImage from '../../components/ZoomableImage';
import {getDonorData} from '../../apis_auth/apis';
import EcmProductWiseModal from '../../components/EcmProductWiseModal';
import axios from 'axios';
const Loanform: () => Node = props => {
  const [mainUrl, setMainUrl] = React.useState({
    uri: e_verisys,
    webview: '',
  });

  const [Everisys, setEverisys] = React.useState(false);
  const [loading, setLoading] = React.useState(true);
  const array_index = 0;
  const [pervious_topupvalue, setPervious_topupValue] = useState(0);
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const loanSpinner = useRef();
  const fromData = useSelector(state => state.FormsReducer);
  const GETQuestions = useSelector(
    state => state.QuestionsReducer.questionArray,
  );
  const UpdateReducer = useSelector(state => state.UpdateReducer);
  const TopupLoanReducer = useSelector(state => state.TopupLoanReducer);
  const CustomGetDataModule = useSelector(
    state => state.RequiredReducer.CustomGetDataModule,
  );
  const getUserData = useSelector(state => state.UserData);
  const OrganizationType = Number(getUserData?.UserData?.OrganizationType);
  const loanLabel = OrganizationType === 2 ? 'Finance Facility' : 'Loan';
  var updateCheck = UpdateReducer.updateCheck.value;
  const TempFormReducer = useSelector(state => state.TempFormReducer);
  var updateCheckTemp = TempFormReducer.tempForm.value;
  const [noData, setNoData] = React.useState(false);

  const scrollView = useRef(null);
  const [customerLoantype, setCustomerloantype] =
    React.useState(CustomerLoantypes);

  const [TopUpLoan, setTopUploan] = React.useState(TopUpLOAN);
  const [occupationType, setoccupationType] = React.useState([
    'Business',
    'Job',
  ]);
  const [topUptype, setTopUpLoantype] = React.useState(
    TopupLoanReducer.topupLoanArray,
  );
  const [geographicrisk, setGeographicrisk] = React.useState(Geographicrisk);
  const [customerandproductrisk, setCustomerandProductRisk] = React.useState(
    CustomerandProductRisk,
  );
  const [peprisk, setPEPRisk] = React.useState(PEPRisk);
  const [loanubo, setLoanUBO] = React.useState(LoanUBO);
  const [focusDescriptionInput, setFocusDescriptionInput] =
    React.useState(false);
  const [getImage, setImage] = React.useState('');
  const [loanTerm, setLoanTerm] = React.useState([
    '6',
    '12',
    '18',
    '24',
    '36',
    '48',
    '60',
  ]);
  const [repayFrequecy, setrepayFrequecy] = React.useState([
    'Monthly',
    'Bi-Monthly',
    'Quarterly',
    'Half Yearly',
    'Yearly',
  ]);
  const [loanType, setLoanType] = React.useState([]);
  const [DonorDetails, setDonorDetails] = React.useState([]);
  const [flexArray, setFlexArray] = React.useState([]);
  const [percentageArray, setPercentageArray] = React.useState([]);
  const [questionArray, setQuestionArray] = React.useState(GETQuestions);
  const [editable, setEditable] = React.useState(true);
  const [subLoanTitle, setSubloanTitle] = React.useState('Loan Sub-Types');
  const [subloanType, setSubLoanType] = React.useState([subLoanTitle]);

  const [ecmRiskProfile, setEcmRiskProfile] = React.useState([]);
  const [ecmSelectedValue, setEcmSelectedValue] = React.useState('');
  const [allDataobj, setAlldataobj] = React.useState(
    updateCheck
      ? props.item
      : updateCheckTemp
      ? props.item
      : CustomGetDataModule,
  );
  const Data =
    allDataobj != undefined
      ? allDataobj.loanInfo[array_index]
      : CustomGetDataModule.loanInfo[array_index];
  const [checkedforDisable, setCheckedforDisable] = React.useState(false);
  const [activeTab, setActiveTab] = React.useState(1);
  const [dialog, setDialog] = React.useState({dialog: false, index: 0});
  const [toast, setToast] = React.useState({value: '', type: ''});
  const [esmProductRsikArray, setEsmProductRsikArray] = React.useState([]);
  const [esmProductRiskSum, setEsmProductRiskSum] = React.useState(0);
  const [esmModal, setSemModal] = React.useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  var regex = /^[a-zA-Z ]*$/;
  let speacial = /^[0-9]*$/;
  var numericandAlphabets = new RegExp(/^[a-zA-Z0-9 ]+$/);

  const [useManualAmount, setUseManualAmount] = useState(false);

  // console.log("here We here images===>",allDataobj.loanInfo[array_index].loan_customerImage)
  //console.log("Here full data===>",JSON.stringify (updateCheck ? props.item :updateCheckTemp?props.item :CustomGetDataModule))
  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {});
    getLoanTypesArray(setLoanType, setNoData, setFlexArray);
    getLoanDocuments(
      allDataobj.customerInfo[array_index].customer_cnicNumber.value,
      allDataobj,
      setAlldataobj,
    );
  }, []);
  const _customerTab = () => {
    if (activeTab == 1) {
      setActiveTab(0);
    } else {
      setActiveTab(1);
    }
  };

  const _customerTab2 = () => {
    if (activeTab == 2) {
      setActiveTab(0);
    } else {
      setActiveTab(2);
    }
  };

  const _customerTab3 = () => {
    if (activeTab == 3) {
      setActiveTab(0);
    } else {
      setActiveTab(3);
    }
  };

  const _customerTab4 = () => {
    if (activeTab == 4) {
      setActiveTab(0);
    } else {
      setActiveTab(4);
    }
  };

  const _customerTab5 = () => {
    if (activeTab == 5) {
      setActiveTab(0);
    } else {
      setActiveTab(5);
    }
  };
  const _customerTab6 = () => {
    if (activeTab == 6) {
      setActiveTab(0);
    } else {
      setActiveTab(6);
    }
  };
  const _customerTab9 = () => {
    if (activeTab == 9) {
      setActiveTab(0);
    } else {
      setActiveTab(9);
    }
  };
  const _customerTab7 = () => {
    if (activeTab == 7) {
      setActiveTab(0);
    } else {
      setActiveTab(7);
    }
  };
  const _customerTab8 = () => {
    if (activeTab == 8) {
      setActiveTab(0);
    } else {
      setActiveTab(8);
    }
  };

  const takePhoto = indexx => {
    ImagePicker.openCamera({
      width: 300,

      height: 400,

      compressImageQuality: 0.5,

      cropping: false,
    }).then(async image => {
      var data = await RNFS.readFile(image.path, 'base64').then(res => {
        return res;
      });

      let get = allDataobj;

      get.loanInfo[array_index].loan_customerImage[indexx].imgValue = data;

      get.loanInfo[array_index].loan_customerImage[indexx].addedBy =
        getUserData.UserData.EmployeeTypeName;

      setAlldataobj({...get});

      setImage(data);
    });
  };

  //this methode is getting image from gallery

  const takePhotofromGallery = index => {
    ImagePicker.openPicker({
      width: 300,

      height: 400,

      cropping: false,
    }).then(async image => {
      var data = await RNFS.readFile(image.path, 'base64').then(res => {
        return res;
      });

      let get = allDataobj;

      get.loanInfo[array_index].loan_customerImage[index].imgValue = data;

      setAlldataobj({...get});

      setImage(data);
    });
  };

  const takePhotofromGallerySetEversisys = () => {
    try {
      ImagePicker.openPicker({
        width: 300,

        height: 400,

        mediaType: 'photo',

        cropping: false,

        compressImageQuality: 0.5,
      })
        .then(async image => {
          if (image.mime.includes('image')) {
            var data = await RNFS.readFile(image.path, 'base64').then(res => {
              return res;
            });

            let get = allDataobj;

            get.customerInfo[array_index].evrisys_customerImage = data;

            setAlldataobj({...get});
          } else {
            setToast({message: 'Please select image', type: 'error'});
          }
        })
        .catch(error => {
          if (error.code === 'E_PICKER_CANCELLED') {
            // here the solution
            return false;
          }
        });
    } catch (e) {}
  };

  const pickImges = index => {
    takePhotofromGallery(index);
  };

  const capture = indexx => {
    takePhoto(indexx);
  };

  const takeCnicImage = imagePostion => {
    ImagePicker.openCamera({
      width: 300,

      height: 400,

      compressImageQuality: 0.5,

      cropping: false,
    }).then(async image => {
      var data = await RNFS.readFile(image.path, 'base64').then(res => {
        return res;
      });

      console.log('=>', imagePostion);

      let get = allDataobj;

      if (imagePostion == 'front') {
        get.loanInfo[array_index].vendorCnicImages[0].cnicFront.imgValue = data;

        setAlldataobj({...get});
      } else {
        get.loanInfo[array_index].vendorCnicImages[0].cnicBack.imgValue = data;

        setAlldataobj({...get});
      }
    });
  };

  const addNewImage = () => {
    var get = allDataobj;

    get.loanInfo[array_index].loan_customerImage.splice(0, 0, {
      key: Math.random(),

      activeTab: false,

      imgName: {value: '', error: false},

      imgValue: undefined,
    });

    // get.assestsInfo.push()

    setAlldataobj({...get});
  };
  const checkVendorForbiddenList = (CnicNumber) => {
    var data = new FormData();
      data.append('CnicNumber', CnicNumber);
  
      axios.post('http://mms.safcomicrofinance.com.pk/employees/ReactData/forbiddenpersoncheck.php', data)
          .then(response => {
              console.log('Full Response:', response);
  
              const responseData = response.data;
              console.log('Response Data:', responseData);
  
              if (responseData.Status) {
                  setAlertMessage({ text: responseData.Status, color: 'red' }); 
              } else {
                setAlertMessage({ text: responseData.Status, color: 'green' }); 
              }
          })
          .catch(error => {
              console.error('Error:', error);
          });
  };
  const deleteImage = index => {
    let len = allDataobj.loanInfo[array_index].loan_customerImage.length;

    if (len > 1) {
      let get2 = allDataobj;

      get2.loanInfo[array_index].loan_customerImage.splice(index, 1);

      setAlldataobj({...get2});
    }
  };
  const _onClickNext = () => {
    var approvedLoan = Number(Data.approvedLoan.value);

    var expectedMonthlyIncome = Number(Data.expectedMonthlyIncome.value);

    var monthlyIncome = Number(Data.monthlyIncome.value);

    var savings = Number(Data.businessSavings.value);
    //console.log('savings--=-=-==-==>>>>', savings)

    var loanTerm = Number(Data.loanTerm.value);

    var monthlyInstallment = approvedLoan / loanTerm;

    if (monthlyIncome > expectedMonthlyIncome) {
      setActiveTab(1);

      setToast({
        type: 'error',

        message: 'Expected Monthly Income must be greater than Monthly Income',
      });

      return;
    } else if (savings < monthlyInstallment) {
      setActiveTab(1);

      setToast({
        type: 'error',

        message: 'Savings should not be less than Monthly Installment',
      });

      return;
    }
    // else if (savings > 50000) {

    //   setActiveTab(1);

    //   setToast({

    //     type: "error",

    //     message: 'Savings should not be greater than fifty thousands',

    //   });

    //   return;
    // }
    else if (Data.customerLoan_type == undefined) {
      setActiveTab(1);
      setToast({
        type: 'error',
        message: 'Please Select Customer Loan Type',
      });
      return;
    } else if (Data.numericalValue == undefined) {
      setActiveTab(1);
      setToast({
        type: 'error',
        message: 'Please Select numerical Value',
      });
      return;
    } else if (Data.customerLoan_type.value == 'Customer Loan Type') {
      setActiveTab(1);

      setToast({
        type: 'error',

        message: 'Please Select Customer Loan Type',
      });

      return;
    } else if (Data.selectRepaymentFrequency == undefined) {
      setActiveTab(1);

      setToast({
        type: 'error',

        message: 'Please Select Repayment Frequency',
      });

      return;
    } else if (Data.selectRepaymentFrequency == 'Select Repayment Frequency') {
      setActiveTab(1);

      setToast({
        type: 'error',

        message: 'Please Select Repayment Frequency',
      });

      return;
    } else if (Data.loanType == undefined) {
      setActiveTab(1);

      setToast({
        type: 'error',

        message: 'Please Select Loan Type',
      });

      return;
    } else if (Data.loanType == 'Select Loan Type') {
      setActiveTab(1);

      setToast({
        type: 'error',

        message: 'Select Loan Type',
      });

      return;
    } else if (Data.loanSubType == undefined) {
      setActiveTab(1);

      setToast({
        type: 'error',
        message: `${loanLabel} Sub-Types`,
      });
      return;
    } else if (Data.loanSubType == `${loanLabel} Sub-Types`) {
      setActiveTab(1);
      setToast({
        type: 'error',
        message: `${loanLabel} Sub-Types`,
      });
      return;
    } else if (Data.requestedLoan.value == '') {
      setActiveTab(1);
      var get = allDataobj;
      get.loanInfo[array_index].requestedLoan.error = true;
      setAlldataobj({...get});
      return;
    } else if (Data.approvedLoan.value == '') {
      setActiveTab(1);
      var get = allDataobj;
      get.loanInfo[array_index].approvedLoan.error = true;
      setAlldataobj({...get});
      return;
    } else if (Data.numericalValue.value == '') {
      setActiveTab(1);
      var get = allDataobj;
      get.loanInfo[array_index].numericalValue.error = true;
      setAlldataobj({...get});
      return;
    } else if (Data.loanTerm.value == '') {
      setActiveTab(1);
      var get = allDataobj;
      get.loanInfo[array_index].loanTerm.error = true;
      setAlldataobj({...get});
      return;
    } else if (approvedLoan < 15000) {
      setActiveTab(1);
      setToast({
        type: 'error',
        message: 'Approved Loan Should not be less than 15000',
      });
      var get = allDataobj;
      get.loanInfo[array_index].loanTerm.error = true;
      setAlldataobj({...get});
      return;
    } else if (Data.loanStatus == undefined) {
      setActiveTab(1);
      setToast({
        type: 'error',
        message: 'Select Loan Status',
      });
      return;
    } else if (Data.loanStatus == 'Loan Status') {
      setActiveTab(1);
      setToast({
        type: 'error',
        message: 'Select Loan Status',
      });
      return;
    } else if (Data.personalCapitalinBusiness.value == '') {
      setActiveTab(1);
      var get = allDataobj;
      get.loanInfo[array_index].personalCapitalinBusiness.error = true;
      setAlldataobj({...get});
      return;
      return;
    } else if (Data.personalCapitalinBusiness.value == '') {
      setActiveTab(1);
      var get = allDataobj;
      get.loanInfo[array_index].personalCapitalinBusiness.error = true;
      setAlldataobj({...get});
      return;
      return;
    } else if (Data.amountRequiredforBusiness.value == '') {
      setActiveTab(1);
      var get = allDataobj;
      get.loanInfo[array_index].amountRequiredforBusiness.error = true;
      setAlldataobj({...get});
      return;
      return;
    } else if (Data.expectedMonthlyIncome.value == '') {
      setActiveTab(1);
      var get = allDataobj;
      get.loanInfo[array_index].expectedMonthlyIncome.error = true;
      setAlldataobj({...get});

      return;
    } else if (
      'vendorCnic' in allDataobj.loanInfo[array_index] &&
      Data.customerLoan_type.value == 'Islamic Finance' &&
      Data.vendorCnic.value == ''
    ) {
      setActiveTab(1);
      var get = allDataobj;
      get.loanInfo[array_index].vendorCnic.error = true;
      setAlldataobj({...get});
      return;
    } else if (
      'vendorCnic' in allDataobj.loanInfo[array_index] &&
      Data.customerLoan_type.value == 'Islamic Finance' &&
      Data.vendorName.value == ''
    ) {
      setActiveTab(1);
      var get = allDataobj;
      get.loanInfo[array_index].vendorName.error = true;
      setAlldataobj({...get});
      return;
    } else if (
      'vendorCnic' in allDataobj.loanInfo[array_index] &&
      Data.customerLoan_type.value == 'Islamic Finance' &&
      Data.vendorShopName.value == ''
    ) {
      setActiveTab(1);
      var get = allDataobj;
      get.loanInfo[array_index].vendorShopName.error = true;
      setAlldataobj({...get});
      return;
    } else if (
      'vendorCnic' in allDataobj.loanInfo[array_index] &&
      Data.customerLoan_type.value == 'Islamic Finance' &&
      Data.vendorMobileNumber.value == ''
    ) {
      setActiveTab(1);
      var get = allDataobj;
      get.loanInfo[array_index].vendorMobileNumber.error = true;
      setAlldataobj({...get});
      return;
    } else if (
      'vendorCnic' in allDataobj.loanInfo[array_index] &&
      Data.customerLoan_type.value == 'Islamic Finance' &&
      Data.vendorProductName.value == ''
    ) {
      setActiveTab(1);
      var get = allDataobj;
      get.loanInfo[array_index].vendorProductName.error = true;
      setAlldataobj({...get});
      return;
    } else if (
      'vendorCnic' in allDataobj.loanInfo[array_index] &&
      Data.customerLoan_type.value == 'Islamic Finance' &&
      Data.vendorProductPrice.value == ''
    ) {
      setActiveTab(1);
      var get = allDataobj;
      get.loanInfo[array_index].vendorProductPrice.error = true;
      setAlldataobj({...get});
      return;
    } else if (
      'vendorCnic' in allDataobj.loanInfo[array_index] &&
      Data.customerLoan_type.value == 'Islamic Finance' &&
      Data.ProductCompanyName.value == ''
    ) {
      setActiveTab(1);
      var get = allDataobj;
      get.loanInfo[array_index].ProductCompanyName.error = true;
      setAlldataobj({...get});
      return;
    } else if (
      'vendorCnic' in allDataobj.loanInfo[array_index] &&
      Data.customerLoan_type.value == 'Islamic Finance' &&
      Data.vendorCnicImages[0].cnicFront.imgValue == ''
    ) {
      setActiveTab(1);
      setToast({
        type: 'error',
        message: 'Please capture front side of CNIC',
      });
      return;
    } else if (
      'vendorCnic' in allDataobj.loanInfo[array_index] &&
      Data.customerLoan_type.value == 'Islamic Finance' &&
      Data.vendorCnicImages[0].cnicBack.imgValue == ''
    ) {
      setActiveTab(1);
      setToast({
        type: 'error',
        message: 'Please capture back side of CNIC',
      });
      return;
    } else if (Data.incomeFromSales.value == '') {
      setActiveTab(1);
      var get = allDataobj;
      get.loanInfo[array_index].incomeFromSales.error = true;
      setAlldataobj({...get});

      return;
    } else if (Data.monthlyIncome.value == '') {
      setActiveTab(1);
      var get = allDataobj;
      get.loanInfo[array_index].monthlyIncome.error = true;
      setAlldataobj({...get});

      return;
    } else if (Data.monthlyIncome.value == '') {
      setActiveTab(1);
      var get = allDataobj;
      get.loanInfo[array_index].monthlyIncome.error = true;
      setAlldataobj({...get});

      return;
    } else if (Data.rawMaterialpurchase.value == '') {
      setActiveTab(2);
      var get = allDataobj;
      get.loanInfo[array_index].rawMaterialpurchase.error = true;
      setAlldataobj({...get});

      return;
    } else if (Data.utilityExpense.value == '') {
      setActiveTab(1);
      var get = allDataobj;
      get.loanInfo[array_index].utilityExpense.error = true;
      setAlldataobj({...get});

      return;
    } else if (Data.monthlyExpenses.value == '') {
      setActiveTab(1);
      var get = allDataobj;
      get.loanInfo[array_index].monthlyExpenses.error = true;
      setAlldataobj({...get});

      return;
    } else if (Data.anyOtherMonthly.value == '') {
      setActiveTab(1);
      var get = allDataobj;
      get.loanInfo[array_index].anyOtherMonthly.error = true;
      setAlldataobj({...get});

      return;
    } else if (Data.liability.value == '') {
      setActiveTab(1);
      var get = allDataobj;
      get.loanInfo[array_index].liability.error = true;
      setAlldataobj({...get});

      return;
    } else if (Data.businessSavings.value == '') {
      setActiveTab(1);
      var get = allDataobj;
      get.loanInfo[array_index].businessSavings.error = true;
      setAlldataobj({...get});

      return;
    } else if (Data.monthlyHouseholdIncome.value == '') {
      setActiveTab(1);
      var get = allDataobj;
      get.loanInfo[array_index].monthlyHouseholdIncome.error = true;
      setAlldataobj({...get});

      return;
    } else if (Data.monthlyHouseholdExpense.value == '') {
      setActiveTab(1);
      var get = allDataobj;
      get.loanInfo[array_index].monthlyHouseholdExpense.error = true;
      setAlldataobj({...get});

      return;
    } else if (Data.householdLiability.value == '') {
      setActiveTab(1);
      var get = allDataobj;
      get.loanInfo[array_index].householdLiability.error = true;
      setAlldataobj({...get});

      return;
    } else if (Data.householdSavings.value == '') {
      setActiveTab(1);
      var get = allDataobj;
      get.loanInfo[array_index].householdSavings.error = true;
      setAlldataobj({...get});

      return;
    } else if (
      Data.loanUtilizationrisk != undefined &&
      Data.loanUtilizationrisk.risk > 1
    ) {
      if (Data.loanUtilizationriskname.value == '') {
        setActiveTab(6);
        var get = allDataobj;
        get.loanInfo[array_index].loanUtilizationriskname.error = true;
        setAlldataobj({...get});

        return;
      } else if (Data.loanUtilizationriskfatherHusbandName.value == '') {
        setActiveTab(6);
        var get = allDataobj;
        get.loanInfo[array_index].loanUtilizationriskfatherHusbandName.error =
          true;
        setAlldataobj({...get});

        return;
      } else if (Data.loanUtilizationriskcnic.value == '') {
        setActiveTab(6);
        var get = allDataobj;
        get.loanInfo[array_index].loanUtilizationriskcnic.error = true;
        setAlldataobj({...get});

        return;
      } else if (Data.loanUtilizationriskcnic.value.length < 15) {
        setActiveTab(6);
        var get = allDataobj;
        get.loanInfo[array_index].loanUtilizationriskcnic.error = true;
        setAlldataobj({...get});
        setToast({
          type: 'error',
          message: 'Please put valid  CNIC',
        });
        return;
      } else {
        moreConditions();
      }
    } else {
      moreConditions();
    }
  };
  const moreConditions = () => {
    var no_of_emploee = Number(Data.no_of_emploee.value);

    if (Data.loanDate == undefined) {
      setActiveTab(1);
      setToast({
        type: 'error',
        message: 'Please Select Loan date.',
      });
    } else if (
      Data.customerLoan_type.value != 'Normal' &&
      Data.customerLoan_type.value != 'Islamic Finance' &&
      Data.occupation.value == ''
    ) {
      setActiveTab(1);
      setToast({
        type: 'error',
        message: 'Please enter Occupation',
      });
      var get = allDataobj;
      get.loanInfo[array_index].occupation.error = true;
      setAlldataobj({...get});
      return;
    } else if (
      Data.occupationType != undefined &&
      Data.occupationType.value == 'Job' &&
      Data.PersonalJobDesignation.value == ''
    ) {
      setActiveTab(1);
      setToast({
        type: 'error',
        message: 'Please enter Designation',
      });
      var get = allDataobj;
      get.loanInfo[array_index].PersonalJobDesignation.error = true;
      setAlldataobj({...get});
      return;
    } else if (
      Data.customerLoan_type.value != 'Normal' &&
      Data.customerLoan_type.value != 'Islamic Finance' &&
      Data.no_of_emploee.value == ''
    ) {
      setActiveTab(1);
      setToast({
        type: 'error',
        message: 'Please enter no of employees',
      });
      var get = allDataobj;
      get.loanInfo[array_index].no_of_emploee.error = true;
      setAlldataobj({...get});
      return;
    } else if (Data.customerLoan_type.value != 'Normal' && no_of_emploee > 10) {
      setActiveTab(1);
      setToast({
        type: 'error',
        message: 'No of employees limit is less than or equal to 10.',
      });
      var get = allDataobj;

      get.loanInfo[array_index].no_of_emploee.error = true;

      setAlldataobj({...get});

      return;
    } else if (Data.loan_customerImage.length < 6) {
      setActiveTab(7);
      setToast({
        type: 'error',
        message: 'Please upload at least six document image',
      });
      return; //
    }
    // else if (allDataobj.customerInfo[array_index].evrisys_customerImage == undefined) {
    //   setActiveTab(3);
    //   setToast({
    //     type: "error",
    //     message: 'Please Upload E-Verysis Verfication Image',
    //   });
    //   return;
    // }
    else if (Data.questionsno1 == undefined) {
      setActiveTab(8);
      setToast({
        type: 'error',
        message: 'Please Select question no 1',
      });
      return;
    } else if (Data.questionsno2 == undefined) {
      setActiveTab(8);
      setToast({
        type: 'error',
        message: 'Please Select question no 2',
      });
      return;
    } else if (Data.questionsno3 == undefined) {
      setActiveTab(8);
      setToast({
        type: 'error',
        message: 'Please Select question no 3',
      });
      return;
    } else if (Data.questionsno4 == undefined) {
      setActiveTab(8);
      setToast({
        type: 'error',
        message: 'Please Select question no 4',
      });
      return;
    } else if (Data.questionsno5 == undefined) {
      setActiveTab(8);
      setToast({
        type: 'error',
        message: 'Please Select question no 5',
      });
      return;
    } else if (Data.questionsno6 == undefined) {
      setActiveTab(8);
      setToast({
        type: 'error',
        message: 'Please Select question no 6',
      });
      return;
    } else if (Data.questionsno7 == undefined) {
      setActiveTab(8);
      setToast({
        type: 'error',
        message: 'Please Select question no 7',
      });
      return;
    } else if (Data.questionsno8 == undefined) {
      setActiveTab(8);
      setToast({
        type: 'error',
        message: 'Please Select question no 8',
      });
      return;
    } else if (Data.questionsno9 == undefined) {
      setActiveTab(8);
      setToast({
        type: 'error',
        message: 'Please Select question no 9',
      });
      return;
    } else if (Data.questionsno10 == undefined) {
      setActiveTab(8);
      setToast({
        type: 'error',
        message: 'Please Select question no 10',
      });
      return;
    } else if (Data.questionsno11 == undefined) {
      setToast({
        type: 'error',
        message: Data.questionsno10,
      });
      setActiveTab(8);
      setToast({
        type: 'error',
        message: 'Please Select question no 11',
      });
      return;
    } else if (Data.questionsno12 == undefined) {
      setActiveTab(8);
      setToast({
        type: 'error',
        message: 'Please Select question no 12',
      });
      return;
    } else if (Data.questionsno13 == undefined) {
      setActiveTab(8);
      setToast({
        type: 'error',
        message: 'Please Select question no 13',
      });
      return;
    } else {
      var imagetitle = true;
      for (let i = 0; i < Data.loan_customerImage.length; i++) {
        if (Data.loan_customerImage[i].imgValue == undefined) {
          setToast({
            type: 'error',
            message: 'Please upload  document image',
          });
          setActiveTab(7);
          imagetitle = false;
        } else if (Data.loan_customerImage[i].imgName.value == '') {
          let get = allDataobj;
          get.loanInfo[array_index].loan_customerImage[i].imgName.error = true;
          setActiveTab(7);
          setAlldataobj({...get});
          imagetitle = false;
        } else {
          let get = allDataobj;
          get.loanInfo[array_index].loan_customerImage[i].imgName.error = false;
          setAlldataobj({...get});
        }
      }
      if (imagetitle) {
        var finalDataobj = fromData.forms;
        finalDataobj.loanInfo[array_index] = Data;
        if (!updateCheck) {
          insertAndDeleteTempForms(
            finalDataobj.customerInfo[0].customer_cnicNumber.value,
            JSON.stringify(finalDataobj),
          );
        }
        console.log('--->', finalDataobj.customerInfo[array_index].resetId);
        console.log('--->', UpdateReducer.updateCheck.id);
        // updateCustomerImagesfromLoanFormPage(
        //   finalDataobj.customerInfo[array_index].customer_cnicNumber.value,
        //   finalDataobj.customerInfo[array_index].evrisys_customerImage==undefined?'':finalDataobj.customerInfo[array_index].evrisys_customerImage,
        //   ).then((res) => {
        //     finalDataobj.customerInfo[array_index].evrisys_customerImage==undefined

        //   }).catch((e)=>{
        //     console.log("error in updateCustomerImages"+e);
        //   })
        updateCustomerFromDatawithLoanForm(
          JSON.stringify(finalDataobj),
          finalDataobj.loanInfo[array_index].customerLoan_type?.index,
          updateCheck
            ? UpdateReducer.updateCheck.id
            : finalDataobj.customerInfo[array_index].resetId,
        );
        props.UpdateUserData(finalDataobj);
        props.onPressNext();
        // return
      }
    }
  };
  const _getSubLoantypes = async (value, underindex) => {
    //loanSpinner.select(0)
    try {
      let get = allDataobj;

      get.loanInfo[array_index].loanType = {
        value: loanType[underindex],
        index: underindex,
      };
      //loanType[index];
      ////console.log(value)
      if (loanType[underindex] != 'Live Stock') {
        get.loanInfo[array_index].loanPercentage.value = '0';

        get.loanInfo[array_index].calculatedPercentage.value = '0';
      }
      get.loanInfo[array_index].loanSubType = undefined;

      setSubLoanType([]);

      getSubLoanTypesArray(
        setSubLoanType,
        setNoData,
        flexArray[underindex],
        setPercentageArray,
      );

      if (allDataobj.loanInfo[array_index].loanType.value != 'Auto Finance') {
        setEditable(true);

        get.loanInfo[array_index].requestedLoan.value = '0';
        get.loanInfo[array_index].IsAutofinance = '0';
        get.loanInfo[array_index].approvedLoan.value = '0';

        setSubloanTitle('Loan Sub-Types');
        setSubLoanType(['Loan Sub-Types']);
      } else {
        setEditable(true);
        setSubloanTitle('Products');
        setSubLoanType(['Select Products']);
      }
      if (allDataobj.loanInfo[array_index].loanType.value == 'Agriculture') {
        // setLoanTerm(["6"])
        get.loanInfo[array_index].loanTerm = {value: '6', index: 0};
      } else if (
        allDataobj.loanInfo[array_index].loanType.value == 'Housing Finance'
      ) {
        // setLoanTerm(["6", "12", "18", "24"])
        get.loanInfo[array_index].loanTerm = {value: '24', index: 3};
      } else {
        // setLoanTerm(["6", "12", "18", "24"])
        get.loanInfo[array_index].loanTerm = {value: '12', index: 1};
      }
      setAlldataobj({...get});
    } catch (err) {
      //console.log(err.message)
    }
  };
  const renderDocsItems = (item, indexx) => {
    return (
      <View
        style={{
          width:
            allDataobj.loanInfo[array_index].loan_customerImage.length <= 1
              ? width / 1.2
              : width / 2.3,
        }}>
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <View style={{flex: 1}}>
            <Text></Text>
          </View>

          {indexx == 0 && (
            <Pressable
              style={{alignSelf: 'flex-end', width: 50}}
              onPressIn={addNewImage}>
              <MaterialCommunityIcons
                name="image-plus"
                size={26}
                style={{color: '#000'}}
              />
            </Pressable>
          )}
          <Pressable onPressIn={() => deleteImage(indexx)}>
            <MaterialCommunityIcons
              name="delete"
              size={23}
              style={{color: '#ff0000'}}
            />
          </Pressable>
        </View>
        <View
          style={{
            marginTop: 20,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: 10,
          }}>
          <View
            style={{
              height: 230,
              padding: 10,
              width: width / 2.5,
              justifyContent: 'center',
            }}>
            {/* <TextView style={{alignSelf: 'center'}} type={'small'} text="Documents Image"></TextView> */}
            {item.imgValue == undefined ? (
              <MaterialCommunityIcons
                style={{alignSelf: 'center'}}
                name="google-photos"
                size={56}></MaterialCommunityIcons>
            ) : (
              <ImageComponent
                imgValue={item.imgValue}
                error={
                  allDataobj.loanInfo[array_index].loan_customerImage[indexx]
                    .imgName.error
                }
                value={
                  allDataobj.loanInfo[array_index].loan_customerImage[indexx]
                    .imgName.value
                }
                dropdownshow={() => {
                  setDialog({dialog: true, index: indexx});
                }}
                onChangeText={(value: string) => {
                  if (!numericandAlphabets.test(value)) {
                    return;
                  }
                  let get = allDataobj;
                  get.loanInfo[array_index].loan_customerImage[
                    indexx
                  ].imgName.value = value;
                  get.loanInfo[array_index].loan_customerImage[
                    indexx
                  ].imgName.error = false;
                  setAlldataobj({...get});
                }}
              />
            )}
            {item.imgValue == undefined && (
              <View style={styles.customerImgconatiner}>
                {/* <Pressable  onPressIn={() => pickImges(indexx)}
                  style={[ styles.capture,  {backgroundColor: Colors.backgroundColor},  ]}>    
                   <TextView style={{textAlign: 'center'}}  type={'small'}  text="Gallery"></TextView>     
              </Pressable> */}
                <Pressable
                  onPressIn={() => {
                    capture(indexx);
                  }}
                  style={[
                    styles.capture,
                    {backgroundColor: Colors.backgroundColor},
                  ]}>
                  <TextView
                    style={{textAlign: 'center'}}
                    type={'small'}
                    text="Camera"></TextView>
                </Pressable>
              </View>
            )}
          </View>
        </View>
      </View>
    );
  };
  const _increment = () => {
    try {
      let get = allDataobj;
      var getone = Number(
        allDataobj.loanInfo[array_index].AutofinanceProductPercentagevalue
          .value,
      );
      var defaultpercentage = Number(
        allDataobj.loanInfo[array_index].AutofinanceDefaultPercentage.MaxLimit,
      );
      if (getone >= defaultpercentage) {
        setToast({
          type: 'error',
          message: `Sorry! ${defaultpercentage}% is Maximum value.`,
        });
        return;
      }
      getone++;

      get.loanInfo[array_index].AutofinanceProductPercentagevalue.value =
        '' + getone;
      setAlldataobj({...get});
      _autoCalucationforAutofinacne(getone);
    } catch (error) {}
  };
  const _decrement = () => {
    try {
      let get = allDataobj;

      var defaultpercentage = Number(
        allDataobj.loanInfo[array_index].AutofinanceDefaultPercentage.MinLimit,
      );
      var getPercentage = Number(
        allDataobj.loanInfo[array_index].AutofinanceProductPercentagevalue
          .value,
      );
      if (getPercentage <= defaultpercentage) {
        setToast({
          type: 'error',
          message: `Sorry! ${defaultpercentage} is minimum value.`,
        });
        return;
      }

      getPercentage--;

      get.loanInfo[array_index].AutofinanceProductPercentagevalue.value =
        '' + getPercentage;

      setAlldataobj({...get});
      _autoCalucationforAutofinacne(getPercentage);
    } catch (error) {}
  };

  const _handlePercentage = value => {
    var MinLimit = Number(
      allDataobj.loanInfo[array_index].AutofinanceDefaultPercentage.MinLimit,
    );

    var MaxLimit = Number(
      allDataobj.loanInfo[array_index].AutofinanceDefaultPercentage.MaxLimit,
    );
    var checker = false;
    if (value > MaxLimit) {
      setToast({
        type: 'error',

        message: `Sorry! ${MaxLimit}% is Maximum value.`,
      });
      checker = true;
      return;
    } else if (value < MinLimit) {
      setToast({
        type: 'error',

        message: `Sorry! ${MinLimit}% is Minimum value.`,
      });
      checker = false;
      return;
    }

    let get = allDataobj;

    get.loanInfo[array_index].AutofinanceProductPercentagevalue.value =
      '' + value;

    setAlldataobj({...get});
    _autoCalucationforAutofinacne(value);
  };

  const _autoCalucationforAutofinacne = DownPaymentPercentage => {
    var get = allDataobj;
    var Price = allDataobj.loanInfo[array_index].AutofinanceProductPrice;

    var cal = _autoCalulatePercenatageforAutofinance(
      Price,
      DownPaymentPercentage,
    );

    var minus = Number(Number(Price) - Number(cal));

    let adder = Number(Number(minus) + Number(pervious_topupvalue));
    get.loanInfo[array_index].approvedLoan.value = '' + adder;
    get.loanInfo[array_index].AutofinanceProductPercentage = cal;
    get.loanInfo[array_index].personalCapitalinBusiness.value = '' + cal;

    setAlldataobj({...get});
    _autoCalculateRequiredAmount();
  };

  const _selectSubloanType = async (value, underindex) => {
    let get = allDataobj;
    get.loanInfo[array_index].loanSubType = {
      value: value.LoanTypeName,
      index: underindex,
    };
    get.loanInfo[array_index].loanPercentage.value =
      percentageArray[underindex] == undefined
        ? 0
        : percentageArray[underindex];
    if (
      allDataobj.loanInfo[array_index].loanType.value == 'Auto Finance' &&
      !useManualAmount
    ) {
      get.loanInfo[array_index].requestedLoan.value = value.Price;
      get.loanInfo[array_index].IsAutofinance = '1';
      get.loanInfo[array_index].AutofinanceProductPrice = value.Price;
      get.loanInfo[array_index].AutofinanceProductPercentagevalue.value =
        value.MinLimit;
      var cal = _autoCalulatePercenatageforAutofinance(
        value.Price,
        value.MinLimit,
      );
      var minus = Number(Number(value.Price) - Number(cal));
      get.loanInfo[array_index].AutofinanceDefaultPercentage = value;
      get.loanInfo[array_index].approvedLoan.value = '' + minus;
      get.loanInfo[array_index].AutofinanceProductPercentage = cal;
      get.loanInfo[array_index].personalCapitalinBusiness.value = '' + cal;
    }
    setAlldataobj({...get});
    _autoCalculateRequiredAmount();
    _autoCalulatePercenatage();
  };
  //getSubLoanTypesArray(setSubLoanType,setNoData,flexArray[0],setPercentageArray)
  const _autoCalculateRequiredAmount = () => {
    let get = allDataobj;

    var getone = Number(get.loanInfo[array_index].requestedLoan.value);

    var gettwo = Number(
      get.loanInfo[array_index].personalCapitalinBusiness.value,
    );

    if (getone < 0) {
      return;
    } else if (gettwo < 0) {
      return;
    }

    var addup = Number(getone + gettwo);
    get.loanInfo[array_index].amountRequiredforBusiness.value =
      JSON.stringify(addup);
    setAlldataobj({...get});
  };
  const _autoCalculateMonthlyIncome = () => {
    let get = allDataobj;
    var getone = Number(get.loanInfo[array_index].incomeFromSales.value);
    var gettwo = Number(get.loanInfo[array_index].rentalIncome.value);

    if (getone < 0) {
      return;
    } else if (gettwo < 0) {
      return;
    }

    var addup = Number(getone + gettwo);
    get.loanInfo[array_index].monthlyIncome.value = JSON.stringify(addup);
    setAlldataobj({...get});
    _autoCalculateBussinessSavings();
    _autoCalulateHouseholdSavings();
  };

  const _autoCalculateMonthlyExpenses = () => {
    let get = allDataobj;
    var getone = Number(get.loanInfo[array_index].rawMaterialpurchase.value);
    var gettwo = Number(get.loanInfo[array_index].utilityExpense.value);
    var getthree = Number(
      get.loanInfo[array_index].salariesandLabourCharges.value,
    );
    var getfour = Number(get.loanInfo[array_index].otherExpenses.value);

    if (getone < 0) {
      return;
    } else if (gettwo < 0) {
      return;
    } else if (getthree < 0) {
      return;
    } else if (getfour < 0) {
      return;
    }

    var addup = Number(getone + gettwo + getthree + getfour);
    get.loanInfo[array_index].monthlyExpenses.value = JSON.stringify(addup);
    setAlldataobj({...get});
    _autoCalculateBussinessSavings();
    _autoCalulateHouseholdSavings();
  };

  const _autoCalculateLaiabilities = () => {
    let get = allDataobj;
    var getone = Number(get.loanInfo[array_index].monthlyInstallment.value);
    var gettwo = Number(get.loanInfo[array_index].anyOtherMonthly.value);

    if (getone < 0) {
      return;
    } else if (gettwo < 0) {
      return;
    }

    var addup = Number(getone + gettwo);
    get.loanInfo[array_index].liability.value = JSON.stringify(addup);
    setAlldataobj({...get});
    _autoCalculateBussinessSavings();
    _autoCalulateHouseholdSavings();
  };

  const _autoCalculateBussinessSavings = () => {
    let get = allDataobj;
    var getone = Number(get.loanInfo[array_index].monthlyIncome.value);
    var gettwo = Number(get.loanInfo[array_index].monthlyExpenses.value);
    var getthree = Number(get.loanInfo[array_index].liability.value);

    if (getone < 0) {
      return;
    } else if (gettwo < 0) {
      return;
    } else if (getthree < 0) {
      return;
    }

    var addup = Number(getone - gettwo - getthree);
    get.loanInfo[array_index].businessSavings.value = JSON.stringify(addup);
    setAlldataobj({...get});
    _autoCalulateMonthlyHouseholdIncome();
    _autoCalulateHouseholdSavings();
  };

  const _autoCalulateMonthlyHouseholdIncome = () => {
    let get = allDataobj;
    var getone = Number(get.loanInfo[array_index].incomefromOtherSource.value);
    var gettwo = Number(get.loanInfo[array_index].otherFamilyIncome.value);
    var getthree = Number(get.loanInfo[array_index].anyOtherIncome.value);
    var getfour = Number(get.loanInfo[array_index].businessSavings.value);

    if (getone < 0) {
      return;
    } else if (gettwo < 0) {
      return;
    } else if (getthree < 0) {
      return;
    } else if (getfour < 0) {
      return;
    }

    var addup = Number(getone + gettwo + getthree + getfour);
    get.loanInfo[array_index].monthlyHouseholdIncome.value =
      JSON.stringify(addup);
    setAlldataobj({...get});
    _autoCalulateHouseholdSavings();
  };

  const _autoCalulateMonthlyHouseholdExpense = () => {
    let get = allDataobj;
    var getone = Number(get.loanInfo[array_index].kitchenExpense.value);
    var gettwo = Number(get.loanInfo[array_index].childrenExpense.value);
    var getthree = Number(get.loanInfo[array_index].utilityExpenses.value);
    var getfour = Number(get.loanInfo[array_index].anyOtherExpenses.value);

    if (getone < 0) {
      return;
    } else if (gettwo < 0) {
      return;
    } else if (getthree < 0) {
      return;
    } else if (getfour < 0) {
      return;
    }

    var addup = Number(getone + gettwo + getthree + getfour);
    get.loanInfo[array_index].monthlyHouseholdExpense.value =
      JSON.stringify(addup);
    setAlldataobj({...get});
    _autoCalulateHouseholdSavings();
  };

  const _autoCalulateHouseholdSavings = () => {
    let get = allDataobj;
    var getone = Number(get.loanInfo[array_index].monthlyHouseholdIncome.value);
    var gettwo = Number(get.loanInfo[array_index].householdLiability.value);
    var getthree = Number(
      get.loanInfo[array_index].monthlyHouseholdExpense.value,
    );

    if (getone < 0) {
      return;
    } else if (gettwo < 0) {
      return;
    } else if (getthree < 0) {
      return;
    }

    var addup = Number(getone - gettwo - getthree);
    get.loanInfo[array_index].householdSavings.value = JSON.stringify(addup);
    setAlldataobj({...get});
  };

  const _autoCalulatePercenatage = () => {
    let get = allDataobj;

    var getone = Number(get.loanInfo[array_index].approvedLoan.value);
    var gettwo = Number(get.loanInfo[array_index].loanPercentage.value);
    var getthree = get.loanInfo[array_index].loanTerm.value;
    var maker = 0;

    if (getone < 0) {
      return;
    } else if (gettwo < 0) {
      return;
    }
    var addup = Number((getone / 100.0) * gettwo);

    if (getthree === '6') {
      maker = Number(addup * 0.5);
    } else if (getthree === '12') {
      maker = Number(addup * 1);
    } else if (getthree === '18') {
      maker = Number(addup * 1.5);
    } else if (getthree === '24') {
      maker = Number(addup * 2);
    } else {
      maker = Number(addup * 1);
    }

    get.loanInfo[array_index].calculatedPercentage.value =
      JSON.stringify(maker);
    setAlldataobj({...get});
  };

  const _autoCalulatePercenatageforAutofinance = (price, defaultpercentage) => {
    let get = allDataobj;
    var getone = Number(price);
    var gettwo = Number(defaultpercentage);

    if (getone < 0) {
      return;
    } else if (gettwo < 0) {
      return;
    }
    var addup = Number((getone / 100.0) * gettwo);
    return addup;
  };

  React.useEffect(() => {
    // alert(JSON.stringify(allDataobj.loanInfo[0]))
  }, []);
  const [topupLoanMultiply, setTopupLoanMultiply] = React.useState();

  return (
    <SafeAreaView>
      <ScrollView
        ref={scrollView}
        contentContainerStyle={{flexGrow: 1}}
        nestedScrollEnabled={true}
        showsVerticalScrollIndicator={false}>
        <View style={{flex: 1}}>
          <View>
            <View style={[styles.box]}>
              <Pressable onPressIn={_customerTab} style={styles.buttomheader}>
                <TextView
                  type={'Light'}
                  text={`${loanLabel} Information`}
                  style={{color: Colors.white}}></TextView>
                <Pressable onPressIn={_customerTab}>
                  {activeTab == 1 ? (
                    <MaterialCommunityIcons
                      color={Colors.white}
                      name="minus"
                      size={26}></MaterialCommunityIcons>
                  ) : (
                    <MaterialCommunityIcons
                      color={Colors.white}
                      name="plus"
                      size={26}></MaterialCommunityIcons>
                  )}
                </Pressable>
              </Pressable>

              {activeTab == 1 && (
                <View style={styles.bounceview}>
                  <View style={styles.row2}>
                    <View style={{marginTop: 0}}>
                      <CustomDropdown
                        text={`Customer ${loanLabel} Type`}
                        required={true}
                        tempdata={customerLoantype}
                        label={
                          allDataobj.loanInfo[array_index].customerLoan_type ==
                          undefined
                          ? `Customer  ${loanLabel} Type`
                            : allDataobj.loanInfo[array_index].customerLoan_type
                                .value
                        }
                        onSelect={async (value, underindex) => {
                          let get = allDataobj;
                          value == 'Islamic Finance'
                            ? (get.loanInfo[array_index].customerLoan_type = {
                                value: customerLoantype[underindex],
                                index: 4,
                              })
                            : (get.loanInfo[array_index].customerLoan_type = {
                                value: customerLoantype[underindex],
                                index: underindex,
                              });

                          //customerLoantype[index];

                          if (customerLoantype[value] == 'Normal') {
                            get.loanInfo[array_index].occupation.value = '';

                            get.loanInfo[array_index].no_of_emploee.value = '';

                            get.loanInfo[array_index].occupationType =
                              undefined;
                          } else if (customerLoantype[value] == 'individual') {
                            get.loanInfo[array_index].occupationType =
                              undefined;
                          }

                          setAlldataobj({...get});
                        }}
                      />
                    </View>

                    <View style={{marginTop: 0}}>
                      <CustomDropdown
                        text={'Repayment Frequency'}
                        required={true}
                        tempdata={repayFrequecy}
                        label={
                          allDataobj.loanInfo[array_index]
                            .selectRepaymentFrequency == undefined
                            ? 'Select Repay Frequency'
                            : allDataobj.loanInfo[array_index]
                                .selectRepaymentFrequency.value
                        }
                        onSelect={async (value, underindex) => {
                          let get = allDataobj;

                          get.loanInfo[array_index].selectRepaymentFrequency = {
                            value: repayFrequecy[underindex],
                            index: underindex,
                          };

                          //repayFrequecy[index];

                          setAlldataobj({...get});
                        }}
                      />
                    </View>
                  </View>

                  <View style={styles.row2}>
                    <View style={{marginTop: 0}}>
                      <CustomDropdown
                        text={`${loanLabel} Types`}
                        required={true}
                        tempdata={loanType}
                        label={
                          allDataobj.loanInfo[array_index].loanType == undefined
                          ? `${loanLabel} Type`
                            : allDataobj.loanInfo[array_index].loanType.value
                        }
                        onSelect={_getSubLoantypes}
                      />
                    </View>

                    <View style={{marginTop: 0}}>
                      <MyDropdown
                        text={`${loanLabel} Sub-Types`}
                        required={true}
                        tempdata={subloanType}
                        label={
                          allDataobj.loanInfo[array_index].loanSubType ==
                          undefined
                          ? `${loanLabel} Sub-Types`
                            : allDataobj.loanInfo[array_index].loanSubType.value
                        }
                        onSelect={async (value, underindex) =>
                          _selectSubloanType(value, underindex)
                        }
                        disabled={
                          allDataobj.loanInfo[array_index].loanType &&
                          allDataobj.loanInfo[array_index].loanType.value === 'Auto Finance' && useManualAmount
                        }
                      />
                    </View>
                  </View>

                  {/* Manual Amount Checkbox and Input for Auto Finance */}
                  {allDataobj.loanInfo[array_index].loanType &&
                    allDataobj.loanInfo[array_index].loanType.value === 'Auto Finance' && (
                      <View style={{marginBottom: 10}}>
                        <TextView
                          type={'formLabel'}
                          text={'Manual Amount'}
                          style={{
                            color: '#737373',
                            marginLeft: 10,
                            width: width / 3,
                            marginBottom: -10,
                          }}
                        />
                        <View style={{flexDirection: 'row', alignItems: 'center', marginBottom: 5, marginLeft: 5}}>
                          <Checkbox
                            status={useManualAmount ? 'checked' : 'unchecked'}
                            onPress={() => {
                              if (useManualAmount) {
                                // Turning OFF manual mode: refresh amount from dropdown selection
                                let get = allDataobj;
                                // If a sub type is selected, use its price; else clear
                                if (
                                  get.loanInfo[array_index].loanSubType &&
                                  get.loanInfo[array_index].loanSubType.value &&
                                  subloanType &&
                                  Array.isArray(subloanType)
                                ) {
                                  // Find the selected sub type object from subloanType array
                                  const selected = subloanType.find(
                                    s => s.LoanTypeName === get.loanInfo[array_index].loanSubType.value
                                  );
                                  if (selected && selected.Price) {
                                    get.loanInfo[array_index].requestedLoan.value = selected.Price;
                                  } else {
                                    get.loanInfo[array_index].requestedLoan.value = '';
                                  }
                                } else {
                                  get.loanInfo[array_index].requestedLoan.value = '';
                                }
                                setAlldataobj({ ...get });
                              }
                              setUseManualAmount(!useManualAmount);
                            }}
                          />
                          <Text style={{marginLeft: 2}}>Enable Manual Amount</Text>
                        </View>
                        <FormInputs
                          required={true}
                          keyboardtype={'number-pad'}
                          text={''}
                          editable={useManualAmount}
                          error={allDataobj.loanInfo[array_index].requestedLoan.error}
                          value={allDataobj.loanInfo[array_index].requestedLoan.value}
                          onChangeText={value => {
                            if (!speacial.test(value)) return;
                            let get = allDataobj;
                            get.loanInfo[array_index].requestedLoan.value = value;
                            // --- Calculation logic for manual amount (same as dropdown) ---
                            if (
                              allDataobj.loanInfo[array_index].loanType.value === 'Auto Finance'
                            ) {
                              get.loanInfo[array_index].IsAutofinance = '1';
                              get.loanInfo[array_index].AutofinanceProductPrice = value;
                              // Use existing percentage if available, else default to 0
                              let minLimit = get.loanInfo[array_index].AutofinanceProductPercentagevalue?.value || 0;
                              get.loanInfo[array_index].AutofinanceProductPercentagevalue.value = minLimit;
                              var cal = _autoCalulatePercenatageforAutofinance(
                                value,
                                minLimit,
                              );
                              var minus = Number(Number(value) - Number(cal));
                              get.loanInfo[array_index].approvedLoan.value = '' + minus;
                              get.loanInfo[array_index].AutofinanceProductPercentage = cal;
                              get.loanInfo[array_index].personalCapitalinBusiness.value = '' + cal;
                            }
                            setAlldataobj({...get});
                            _autoCalculateRequiredAmount();
                          }}
                        />
                      </View>
                  )}

                  {allDataobj.loanInfo[array_index].loanType != undefined &&
                    allDataobj.loanInfo[array_index].loanType.value ===
                      'Live Stock' && (
                      <View style={styles.row2}>
                        <View />

                        <FormInputs
                          keyboardtype={'number-pad'}
                          editable={false}
                          text={
                            'Percentage Loan (' +
                            allDataobj.loanInfo[array_index].loanPercentage
                              .value +
                            '%)'
                          }
                          error={
                            allDataobj.loanInfo[array_index]
                              .calculatedPercentage.error
                          }
                          value={
                            allDataobj.loanInfo[array_index]
                              .calculatedPercentage.value
                          }
                          onChangeText={(value: string) => {
                            let get = allDataobj;

                            get.loanInfo[
                              array_index
                            ].calculatedPercentage.value = value;

                            setAlldataobj({...get});
                          }}></FormInputs>
                      </View>
                    )}
                  {allDataobj.loanInfo[array_index].loanType != undefined &&
                    allDataobj.loanInfo[array_index].loanType.value ===
                      'Auto Finance' && (
                      <View style={[styles.row2, {marginBottom: 10}]}>
                        <View style={{width: width / 2.4}} />

                        <View>
                          <TextView
                            type={'formLabel'}
                            text={
                              'Autofinance Downpaymet Percentage (' +
                              allDataobj.loanInfo[array_index]
                                .AutofinanceProductPercentagevalue.value +
                              '%)'
                            }
                            style={{
                              color: '#737373',
                              marginLeft: 10,
                              width: width / 3,
                              marginBottom: 2,
                            }}></TextView>
                          <View
                            style={{
                              flexDirection: 'row',
                              alignItems: 'center',
                              width: width / 2.4,
                            }}>
                            <Pressable
                              onPress={_decrement}
                              style={styles.incre_decre}>
                              <TextView
                                type={'bold'}
                                style={{
                                  color: Colors.white,
                                  textAlign: 'center',
                                }}
                                text="-"></TextView>
                            </Pressable>

                            <TextInput
                              value={
                                allDataobj.loanInfo[array_index]
                                  .AutofinanceProductPercentagevalue.value
                              }
                              onChangeText={value => _handlePercentage(value)}
                              keyboardType={'numeric'}
                              style={{textAlign: 'center', color: '#737373'}}
                            />

                            <TextView
                              style={{
                                color: '#7d7d7d',
                                fontSize: 14,
                                marginLeft: 0,
                                marginRight: 5,
                              }}
                              text={'%'}
                            />

                            <Pressable
                              onPress={_increment}
                              style={styles.incre_decre}>
                              <TextView
                                style={{
                                  fontSize: 20,
                                  color: Colors.white,
                                  textAlign: 'center',
                                }}
                                text="+"></TextView>
                            </Pressable>

                            <TextView
                              style={{
                                color: '#7d7d7d',
                                fontSize: 14,
                                marginLeft: 10,
                                marginRight: 10,
                              }}
                              text={`(${allDataobj.loanInfo[array_index].AutofinanceProductPercentage})`}
                            />
                          </View>
                        </View>
                      </View>
                    )}
                  {/* Mis Functionality */}
                  {/* <View style={styles.row2}>
                     <FormInputs

                      required={true}

                      keyboardtype={'phone-pad'}

                      text={'Donor'}

                      editable={false}

                      error={allDataobj.loanInfo[array_index].requestedLoan.error}

                      value={allDataobj.loanInfo[array_index].requestedLoan.value}

                      onChangeText={(value: string) => {
                        if (!speacial.test(value)) {
                          return
                        }

                        let get = allDataobj;

                        get.loanInfo[array_index].requestedLoan.value = value;

                        get.loanInfo[array_index].requestedLoan.error = false;


                        setAlldataobj({ ...get });

                        _autoCalculateRequiredAmount()



                      }}></FormInputs>


                       <FormInputs

                      keyboardtype={'number-pad'}

                      text={'Donor Projects'}

                      required={true}

                      editable={false}

                      error={allDataobj.loanInfo[array_index].approvedLoan.error}

                      value={allDataobj.loanInfo[array_index].approvedLoan.value}

                      onChangeText={(value: string) => {
                        if (!speacial.test(value)) {
                          return
                        }
                        let get = allDataobj;

                        get.loanInfo[array_index].approvedLoan.value = value;

                        get.loanInfo[array_index].topupLoantype = undefined;

                        get.loanInfo[array_index].topupLoanValue = 0;

                        get.loanInfo[array_index].topupLoanQty = undefined;


                        get.loanInfo[array_index].approvedLoan.error = false;

                        setAlldataobj({ ...get });

                        _autoCalulatePercenatage()
                      }}></FormInputs>
                      </View> */}

                  {/* // */}

                  <View style={styles.row2}>
                    <FormInputs
                      required={true}
                      keyboardtype={'phone-pad'}
                      text={OrganizationType === 2 ? 'Requested Finance Facility ' : 'Requested Loan'}
                      editable={editable}
                      error={
                        allDataobj.loanInfo[array_index].requestedLoan.error
                      }
                      value={
                        allDataobj.loanInfo[array_index].requestedLoan.value
                      }
                      onChangeText={(value: string) => {
                        if (!speacial.test(value)) {
                          return;
                        }

                        let get = allDataobj;

                        get.loanInfo[array_index].requestedLoan.value = value;

                        get.loanInfo[array_index].requestedLoan.error = false;

                        setAlldataobj({...get});

                        _autoCalculateRequiredAmount();
                      }}></FormInputs>

                    <FormInputs
                      keyboardtype={'number-pad'}
                      text={OrganizationType === 2 ? ' Approved Finance Facility' : 'Approved Loan'}
                      required={true}
                      editable={editable}
                      error={
                        allDataobj.loanInfo[array_index].approvedLoan.error
                      }
                      value={
                        allDataobj.loanInfo[array_index].approvedLoan.value
                      }
                      onChangeText={(value: string) => {
                        if (!speacial.test(value)) {
                          return;
                        }

                       
                        
                        let get = allDataobj;

                        get.loanInfo[array_index].approvedLoan.value = value;

                        get.loanInfo[array_index].topupLoantype = undefined;

                        get.loanInfo[array_index].topupLoanValue = 0;

                        get.loanInfo[array_index].topupLoanQty = undefined;

                        get.loanInfo[array_index].approvedLoan.error = false;

                        setAlldataobj({ ...get });

                        _autoCalulatePercenatage()
                      }}></FormInputs>
                  </View>

                  {allDataobj &&
                    allDataobj.loanInfo &&
                    array_index >= 0 &&
                    array_index < allDataobj.loanInfo.length &&
                    allDataobj.loanInfo[array_index].customerLoan_type
                      ?.value === 'Islamic Finance' && (
                      <View
                        style={[
                          styles.row2,
                          {marginBottom: 10, marginTop: 10},
                        ]}>
                        <FormInputs
                          required={true}
                          keyboardtype={'number-pad'}
                          text={'Withholding Tax:'}
                          error={
                            allDataobj.loanInfo[array_index].numericalValue
                              .error
                          }
                          value={
                            allDataobj.loanInfo[array_index].numericalValue
                              .value
                          }
                          onChangeText={(value: string) => {
                            if (!speacial.test(value)) {
                              return;
                            }
                            let get = allDataobj;
                            get.loanInfo[array_index].numericalValue.value =
                              value;

                            get.loanInfo[array_index].numericalValue.error =
                              false;
                            setAlldataobj({...get});
                          }}></FormInputs>
                      </View>
                    )}

                  {/* {allDataobj.loanInfo[array_index].loanType != undefined
                    && allDataobj.loanInfo[array_index].loanType.value === "Auto Finance" &&
                    <View style={[styles.row2, { marginBottom: 10 }]}>
                      <View style={styles.row2}>
                        <FormInputs
                          text={'Dealer Business Name'}
                          required={false}
                          // error={allDataobj.loanInfo[array_index].DealerBusinessName.error}
                          value={allDataobj.loanInfo[array_index].DealerBusinessName.value}
                          onChangeText={(value: string) => {
                            if (!regex.test(value)) {
                              return
                            }
                            let get = allDataobj;
                            get.loanInfo[array_index].DealerBusinessName.value = value;
                            setAlldataobj({ ...get });
                          }}></FormInputs>

                        <FormInputs
                          text={'Dealer Name'}
                          required={false}
                          error={allDataobj.loanInfo[array_index].DealerName.error}
                          value={allDataobj.loanInfo[array_index].DealerName.value}
                          onChangeText={(value: string) => {
                            if (!regex.test(value)) {
                              return
                            }
                            let get = allDataobj;
                            get.loanInfo[array_index].DealerName.value = value;
                            setAlldataobj({ ...get });
                          }}></FormInputs>
                      </View>
                    </View>} */}
                  {allDataobj &&
                    allDataobj.loanInfo &&
                    array_index >= 0 &&
                    array_index < allDataobj.loanInfo.length &&
                    allDataobj.loanInfo[array_index].loanType?.value ===
                      'Auto Finance' && allDataobj.loanInfo[array_index].customerLoan_type.value !=
                      'Islamic Finance' && (
                      <View style={[styles.row2, {marginBottom: 10}]}>
                        <View style={styles.row2}>
                          <FormInputs
                            text={'Dealer Business Name'}
                            required={false}
                            value={
                              allDataobj.loanInfo[array_index]
                                .DealerBusinessName?.value || ''
                            }
                            onChangeText={(value: string) => {
                              if (!regex.test(value)) {
                                return;
                              }
                              let get = allDataobj;
                              get.loanInfo[
                                array_index
                              ].DealerBusinessName.value = value;
                              setAlldataobj({...get});
                            }}
                          />

                          <FormInputs
                            text={'Dealer Name'}
                            required={false}
                            error={
                              allDataobj.loanInfo[array_index].DealerName
                                ?.error || ''
                            }
                            value={
                              allDataobj.loanInfo[array_index].DealerName
                                ?.value || ''
                            }
                            onChangeText={(value: string) => {
                              if (!regex.test(value)) {
                                return;
                              }
                              let get = allDataobj;
                              get.loanInfo[array_index].DealerName.value =
                                value;
                              setAlldataobj({...get});
                            }}
                          />
                        </View>
                      </View>
                    )}

                  {allDataobj &&
                    allDataobj.loanInfo &&
                    array_index >= 0 &&
                    array_index < allDataobj.loanInfo.length &&
                    allDataobj.loanInfo[array_index].loanType?.value ===
                      'Auto Finance' && allDataobj.loanInfo[array_index].customerLoan_type.value !=
                      'Islamic Finance' && (
                      <View style={[styles.row2, {marginBottom: 10}]}>
                        <FormInputs
                          text={'Dealer CNIC'}
                          required={false}
                          keyboardtype="number-pad"
                          error={
                            allDataobj.loanInfo[array_index].DealerCnic
                              ?.error || ''
                          }
                          value={
                            allDataobj.loanInfo[array_index].DealerCnic
                              ?.value || ''
                          }
                          onChangeText={value => {
                            var regexp = new RegExp(
                              '^[0-9+]{5}-[0-9+]{7}-[0-9]{1}$',
                            );
                            if (value.length < 16) {
                              if (value.length == 5 || value.length == 13) {
                                let get = allDataobj;
                                get.loanInfo[array_index].DealerCnic.value =
                                  value + '-';
                                get.loanInfo[array_index].DealerCnic.error =
                                  !regexp.test(value) ? true : false;
                                setAlldataobj({...get});
                              } else {
                                let get = allDataobj;
                                get.loanInfo[array_index].DealerCnic.value =
                                  value;
                                get.loanInfo[array_index].DealerCnic.error =
                                  !regexp.test(value) ? true : false;
                                setAlldataobj({...get});
                              }
                            }
                          }}
                        />
                      </View>
                    )}

                  {/* {allDataobj.loanInfo[array_index].loanType != undefined
                    && allDataobj.loanInfo[array_index].loanType.value === "Auto Finance" &&
                    <View style={[styles.row2, { marginBottom: 10 }]}>
                      <FormInputs
                        text={'Dealer CNIC'}
                        required={false}
                        keyboardtype="number-pad"
                        error={allDataobj.loanInfo[array_index].DealerCnic.error}
                        value={allDataobj.loanInfo[array_index].DealerCnic.value}
                        onChangeText={(value) => {
                          var regexp = new RegExp('^[0-9+]{5}-[0-9+]{7}-[0-9]{1}$');
                          if (value.length < 16) {
                            if (value.length == 5 || value.length == 13) {
                              let get = allDataobj;
                              get.loanInfo[ array_index ].DealerCnic.value = value + '-';                      
                              get.loanInfo[  array_index  ].DealerCnic.value = value + '-';                            
                              setAlldataobj({ ...get });
                            } else {
                              let get = allDataobj;
                              get.loanInfo[ array_index  ].DealerCnic.value = value;                               
                              get.loanInfo[ array_index].DealerCnic.value = value;                                                            
                             setAlldataobj({ ...get });
                            }
                          }
                        }}>
                      </FormInputs>
                    </View>} */}

                  <View style={styles.row2}>
                    {/* <FormInputs

                      required={true}

                      keyboardtype={'number-pad'}

                      text={'Loan Term'}

                      error={allDataobj.loanInfo[array_index].loanTerm.error}

                      value={allDataobj.loanInfo[array_index].loanTerm.value}

                      onChangeText={(value: string) => {

                        let get = allDataobj;

                        get.loanInfo[array_index].loanTerm.value = value;

                        get.loanInfo[array_index].loanTerm.error = false;


                        setAlldataobj({ ...get });

                      }}></FormInputs> */}
                    <View>
                      <TextView
                        type={'formLabel'}
                        text={`${loanLabel} Term`}
                        style={{
                          color: '#737373',
                          marginLeft: 10,
                          width: width / 3,
                          marginBottom: -20,
                        }}></TextView>

                      <Dropdownlist
                        required={true}
                        data={loanTerm}
                        RT={1}
                        label={
                          allDataobj.loanInfo[array_index].loanTerm.value == ''
                          ? `Select ${loanLabel} Term`
                            : allDataobj.loanInfo[array_index].loanTerm.value
                        }
                        onSelect={async value => {
                          let get = allDataobj;

                          get.loanInfo[array_index].loanTerm = {
                            value: loanTerm[value],
                            index: value,
                          };

                          setAlldataobj({...get});
                          _autoCalulatePercenatage();
                        }}></Dropdownlist>
                    </View>

                    <View style={{marginTop: 0}}>
                      {/*-------- old dropdown----------- */}

                      <FormInputs
                        required={true}
                        editable={false}
                        text={`${loanLabel} Status`}
                        value={
                          allDataobj.loanInfo[array_index].loanStatus.value
                        }></FormInputs>
                    </View>
                  </View>

                  <View style={styles.row2}>
                    <FormInputs
                      required={true}
                      editable={editable}
                      keyboardtype={'number-pad'}
                      text={'Personal Capital in Business'}
                      error={
                        allDataobj.loanInfo[array_index]
                          .personalCapitalinBusiness.error
                      }
                      value={
                        allDataobj.loanInfo[array_index]
                          .personalCapitalinBusiness.value
                      }
                      onChangeText={(value: string) => {
                        if (!speacial.test(value)) {
                          return;
                        }
                        let get = allDataobj;

                        get.loanInfo[
                          array_index
                        ].personalCapitalinBusiness.value = value;

                        get.loanInfo[
                          array_index
                        ].personalCapitalinBusiness.error = false;

                        setAlldataobj({...get});

                        _autoCalculateRequiredAmount();
                      }}></FormInputs>

                    <FormInputs
                      editable={false}
                      required={true}
                      keyboardtype={'number-pad'}
                      text={'Amount Required for Business'}
                      error={
                        allDataobj.loanInfo[array_index]
                          .amountRequiredforBusiness.error
                      }
                      value={
                        allDataobj.loanInfo[array_index]
                          .amountRequiredforBusiness.value
                      }
                      onChangeText={(value: string) => {
                        if (!speacial.test(value)) {
                          return;
                        }
                        let get = allDataobj;

                        get.loanInfo[
                          array_index
                        ].amountRequiredforBusiness.value = value;

                        get.loanInfo[
                          array_index
                        ].amountRequiredforBusiness.error = false;

                        setAlldataobj({...get});
                      }}></FormInputs>
                  </View>

                  <View style={styles.row2}>
                    <FormInputs
                      required={true}
                      keyboardtype={'number-pad'}
                      text={'Expected Monthly Income from Business'}
                      error={
                        allDataobj.loanInfo[array_index].expectedMonthlyIncome
                          .error
                      }
                      value={
                        allDataobj.loanInfo[array_index].expectedMonthlyIncome
                          .value
                      }
                      onChangeText={(value: string) => {
                        if (!speacial.test(value)) {
                          return;
                        }

                        let get = allDataobj;

                        get.loanInfo[array_index].expectedMonthlyIncome.value =
                          value;

                        get.loanInfo[array_index].expectedMonthlyIncome.error =
                          false;

                        setAlldataobj({...get});
                      }}></FormInputs>

                    <FormInputs
                      required={true}
                      keyboardtype={'number-pad'}
                      text={'Income from Sale/Services'}
                      error={
                        allDataobj.loanInfo[array_index].incomeFromSales.error
                      }
                      value={
                        allDataobj.loanInfo[array_index].incomeFromSales.value
                      }
                      onChangeText={(value: string) => {
                        if (!speacial.test(value)) {
                          return;
                        }
                        let get = allDataobj;

                        get.loanInfo[array_index].incomeFromSales.value = value;

                        get.loanInfo[array_index].incomeFromSales.error = false;

                        setAlldataobj({...get});

                        _autoCalculateMonthlyIncome();
                      }}></FormInputs>
                  </View>

                  <View style={styles.row2}>
                    <FormInputs
                      keyboardtype={'number-pad'}
                      text={'Rental Income/Any Other Income'}
                      error={
                        allDataobj.loanInfo[array_index].rentalIncome.error
                      }
                      value={
                        allDataobj.loanInfo[array_index].rentalIncome.value
                      }
                      onChangeText={(value: string) => {
                        if (!speacial.test(value)) {
                          return;
                        }

                        let get = allDataobj;

                        get.loanInfo[array_index].rentalIncome.value = value;

                        setAlldataobj({...get});

                        _autoCalculateMonthlyIncome();
                      }}></FormInputs>
                    <FormInputs
                      required={true}
                      keyboardtype={'number-pad'}
                      text={'Monthly Income'}
                      editable={true}
                      error={
                        allDataobj.loanInfo[array_index].monthlyIncome.error
                      }
                      value={
                        allDataobj.loanInfo[array_index].monthlyIncome.value
                      }
                      onChangeText={(value: string) => {
                        if (!speacial.test(value)) {
                          return;
                        }

                        let get = allDataobj;

                        get.loanInfo[array_index].monthlyIncome.value = value;

                        setAlldataobj({...get});
                      }}></FormInputs>
                  </View>

                  <View style={styles.row2}>
                    <FormInputs
                      text={'Business Address'}
                      error={
                        allDataobj.loanInfo[array_index].businessAddress.error
                      }
                      value={
                        allDataobj.loanInfo[array_index].businessAddress.value
                      }
                      onChangeText={(value: string) => {
                        var format = /^[\u0000-\u007F]*$/;
                        if (!format.test(value)) {
                          return;
                        }
                        let get = allDataobj;
                        get.loanInfo[array_index].businessAddress.value = value;
                        setAlldataobj({...get});
                      }}></FormInputs>
                    <FormInputs
                      text={'Business Name'}
                      error={
                        allDataobj.loanInfo[array_index].businessName.error
                      }
                      value={
                        allDataobj.loanInfo[array_index].businessName.value
                      }
                      onChangeText={(value: string) => {
                        if (!regex.test(value)) {
                          return;
                        }
                        let get = allDataobj;
                        get.loanInfo[array_index].businessName.value = value;
                        setAlldataobj({...get});
                      }}></FormInputs>
                  </View>
                  <View style={styles.row2}>
                    <FormInputs
                      text={'Experience in Business'}
                      error={
                        allDataobj.loanInfo[array_index].experianceinBusiness
                          .error
                      }
                      value={
                        allDataobj.loanInfo[array_index].experianceinBusiness
                          .value
                      }
                      onChangeText={(value: string) => {
                        var format = /^[a-zA-Z-0-9- ]*$/;
                        if (!format.test(value)) {
                          return;
                        }
                        let get = allDataobj;
                        get.loanInfo[array_index].experianceinBusiness.value =
                          value;
                        setAlldataobj({...get});
                      }}></FormInputs>
                    <DateSelector
                      title={
                        allDataobj.loanInfo[array_index].loanDate == undefined
                        ? `${OrganizationType === 2 ? 'Finance Facility' : 'Loan'} Date`
                          : allDataobj.loanInfo[array_index].loanDate
                      }
                      setAlldataobj={setAlldataobj}
                      allDataobj={allDataobj}
                      setToast={setToast}
                      array_index={array_index}
                      fieldName={4}></DateSelector>
                  </View>

                  <View style={styles.row2}>
                    <FormInputs
                      text={'Notes'}
                      error={allDataobj.loanInfo[array_index].loanNote.error}
                      value={allDataobj.loanInfo[array_index].loanNote.value}
                      onChangeText={(value: string) => {
                        var format = /^[a-zA-Z ]*$/;
                        if (!format.test(value)) {
                          return;
                        }
                        let get = allDataobj;
                        get.loanInfo[array_index].loanNote.value = value;
                        setAlldataobj({...get});
                      }}></FormInputs>

                    <View style={{marginTop: 0}}>
                      {/* ----------- old dropdown------------- */}
                      <TextView
                        type={'formLabel'}
                        text={`Do you want Top - up Solar ${OrganizationType === 2 ? 'Finance Facility' : 'Loan'}`}
                        style={{
                          color: '#737373',
                          marginLeft: 10,
                          width: width / 3,
                          marginBottom: -20,
                        }}></TextView>
                      <Dropdownlist
                        data={TopUpLoan}
                        label={
                          allDataobj.loanInfo[array_index].doyouwantTopupLoan ==
                          undefined
                            ? 'No'
                            : allDataobj.loanInfo[array_index]
                                .doyouwantTopupLoan
                        }
                        onSelect={async value => {
                          let get = allDataobj;
                          get.loanInfo[array_index].doyouwantTopupLoan =
                            TopUpLoan[value];
                          setAlldataobj({...get});
                          ////console.log(get.loanInfo[array_index].doyouwantTopupLoan)
                          //  ******************************************************************
                          //////////////////////////// Performing subtraction pervious value and add new value in approved loan //////////////
                          // ********************************************************************
                          let approvedLoan = Number(
                            get.loanInfo[array_index].approvedLoan.value,
                          );

                          if (value == 0) {
                            //console.log("approvedLoan---->" + approvedLoan);
                            //console.log("pervious_topupvalue---->" + pervious_topupvalue);

                            var maker = Number(
                              approvedLoan - pervious_topupvalue,
                            );
                            setPervious_topupValue(0);
                            get.loanInfo[array_index].topupLoantype = undefined;

                            get.loanInfo[array_index].topupLoanValue = 0;

                            get.loanInfo[array_index].topupLoanQty = undefined;

                            //console.log("maker---->" + maker);
                            get.loanInfo[array_index].approvedLoan.value =
                              '' + Number(maker);

                            setAlldataobj({...get});

                            _autoCalulatePercenatage();
                          }

                          //  ******************************************************************
                          //////////////////////////// Performing subtraction pervious value and add new value in approved loan //////////////
                          // ********************************************************************
                        }}></Dropdownlist>

                      {/*----------- old dropdown end------------- */}
                    </View>
                  </View>

                  <View style={styles.row2}>
                    <View>
                      <TextView
                        type={'formLabel'}
                        text={`Do you want Topup ${OrganizationType === 2 ? 'Finance Facility' : 'Loan'}`}
                        style={{
                          color: '#737373',
                          marginLeft: 10,
                          width: width / 3,
                          marginBottom: -20,
                        }}></TextView>
                      <Dropdownlist
                        data={SolarLOAN}
                        label={
                          allDataobj.loanInfo[array_index].doyouwantTopupLoan ==
                          0
                            ? 'No'
                            : allDataobj.loanInfo[array_index]
                                .doyouwantSolarTopupLoan == 0
                            ? 'No'
                            : 'Yes'
                        }
                        onSelect={async value => {
                          let get = allDataobj;
                          get.loanInfo[array_index].doyouwantSolarTopupLoan =
                            value;
                          setAlldataobj({...get});
                        }}></Dropdownlist>
                    </View>
                  </View>

                  {allDataobj.loanInfo[array_index].customerLoan_type !=
                    undefined &&
                    allDataobj.loanInfo[array_index].customerLoan_type.value ==
                      'Personal' && (
                      <View>
                        <View style={styles.row2}>
                          <FormInputs
                            required={true}
                            text={'Occupation'}
                            error={
                              allDataobj.loanInfo[array_index].occupation.error
                            }
                            value={
                              allDataobj.loanInfo[array_index].occupation.value
                            }
                            onChangeText={(value: string) => {
                              if (!regex.test(value)) {
                                return;
                              }
                              let get = allDataobj;
                              get.loanInfo[array_index].occupation.value =
                                value;
                              get.loanInfo[array_index].occupation.error =
                                false;
                              setAlldataobj({...get});
                            }}></FormInputs>

                          <View style={{marginTop: 0}}>
                            {/*---------- old dropdown----------------- */}
                            <TextView
                              type={'formLabel'}
                              text={'Occupation Type'}
                              style={{
                                color: '#737373',
                                marginLeft: 10,
                                width: width / 3,
                                marginBottom: -20,
                              }}></TextView>
                            <Dropdownlist
                              data={occupationType}
                              label={
                                allDataobj.loanInfo[array_index]
                                  .occupationType == undefined
                                  ? 'Oppcupation'
                                  : allDataobj.loanInfo[array_index]
                                      .occupationType.value
                              }
                              onSelect={async value => {
                                let get = allDataobj;
                                get.loanInfo[array_index].occupationType = {
                                  value: occupationType[value],
                                  index: value,
                                };
                                setAlldataobj({...get});
                              }}></Dropdownlist>
                            {/*---------- old dropdown end----------------- */}
                          </View>
                        </View>
                      </View>
                    )}
                  {/* //////////////////////////////////////////////////////////// */}
                  {allDataobj.loanInfo[array_index].customerLoan_type !=
                    undefined &&
                    allDataobj.loanInfo[array_index].customerLoan_type.value ==
                      'Personal' &&
                    allDataobj.loanInfo[array_index].occupationType !=
                      undefined &&
                    allDataobj.loanInfo[array_index].occupationType.value ==
                      'Job' && (
                      <View>
                        <View style={styles.row2}>
                          <FormInputs
                            required={true}
                            text={'Designation'}
                            error={
                              allDataobj.loanInfo[array_index]
                                .PersonalJobDesignation.error
                            }
                            value={
                              allDataobj.loanInfo[array_index]
                                .PersonalJobDesignation.value
                            }
                            onChangeText={(value: string) => {
                              if (!regex.test(value)) {
                                return;
                              }
                              let get = allDataobj;
                              get.loanInfo[
                                array_index
                              ].PersonalJobDesignation.value = value;
                              get.loanInfo[
                                array_index
                              ].PersonalJobDesignation.error = false;
                              setAlldataobj({...get});
                            }}></FormInputs>

                          <View style={{marginTop: 0}}>
                            <CustomDropdown
                              text={'Select Department'}
                              required={false}
                              tempdata={Departments}
                              label={
                                allDataobj.loanInfo[array_index]
                                  .PersonalJobDepartment == undefined
                                  ? 'Select Department'
                                  : allDataobj.loanInfo[array_index]
                                      .PersonalJobDepartment.value
                              }
                              onSelect={async (value, underindex) => {
                                let get = allDataobj;
                                get.loanInfo[
                                  array_index
                                ].PersonalJobDepartment = {
                                  value: Departments[underindex],
                                  index: underindex,
                                };
                                //occupationType[index];
                                setAlldataobj({...get});
                              }}
                            />
                            {/*---------- old dropdown----------------- */}
                            {/* <TextView type={'formLabel'} text={"Select Department"} 
style={{color:'#737373',marginLeft:10,width:width/3,marginBottom:-20}}></TextView>
    <Dropdownlist
  data={Departments}
  label={
    allDataobj.loanInfo[array_index].PersonalJobDepartment ==
          undefined
            ? 'Select Department'
            : allDataobj.loanInfo[array_index].PersonalJobDepartment.value
  }
  onSelect={async (index,value) => {
    let get = allDataobj;
            get.loanInfo[array_index].PersonalJobDepartment = {value:Departments[index], index:index}
            //occupationType[index];
            setAlldataobj({...get});
  }}></Dropdownlist> */}
                            {/*---------- old dropdown end----------------- */}
                          </View>
                        </View>
                      </View>
                    )}
                  {allDataobj.loanInfo[array_index].customerLoan_type !=
                    undefined &&
                    allDataobj.loanInfo[array_index].customerLoan_type.value ==
                      'Personal' && (
                      <View>
                        <View style={styles.row2}>
                          <FormInputs
                            text={'No of Employees'}
                            required={true}
                            keyboardtype={'decimal-pad'}
                            error={
                              allDataobj.loanInfo[array_index].no_of_emploee
                                .error
                            }
                            value={
                              allDataobj.loanInfo[array_index].no_of_emploee
                                .value
                            }
                            onChangeText={(value: string) => {
                              if (!speacial.test(value)) {
                                return;
                              }
                              let get = allDataobj;
                              get.loanInfo[array_index].no_of_emploee.value =
                                value;
                              get.loanInfo[array_index].no_of_emploee.error =
                                false;

                              setAlldataobj({...get});
                            }}></FormInputs>

                          {allDataobj.loanInfo[array_index].customerLoan_type !=
                            undefined &&
                            allDataobj.loanInfo[array_index].customerLoan_type
                              .value == 'Personal' &&
                            allDataobj.loanInfo[array_index].occupationType !=
                              undefined &&
                            allDataobj.loanInfo[array_index].occupationType
                              .value == 'Job' && (
                              <View style={{marginTop: 0}}>
                                <CustomDropdown
                                  text={'Job Type'}
                                  required={true}
                                  tempdata={JOBTypes}
                                  label={
                                    allDataobj.loanInfo[array_index]
                                      .PersonalLoanJobType == undefined
                                      ? 'Select Job'
                                      : allDataobj.loanInfo[array_index]
                                          .PersonalLoanJobType.value
                                  }
                                  onSelect={async (value, underindex) => {
                                    let get = allDataobj;
                                    get.loanInfo[
                                      array_index
                                    ].PersonalLoanJobType = {
                                      value: JOBTypes[underindex],
                                      index: underindex,
                                    };
                                    //occupationType[index];
                                    setAlldataobj({...get});
                                  }}
                                />
                              </View>
                            )}
                        </View>
                      </View>
                    )}
                  {/* ////////////////////////////////////////////////////// */}
                  {((allDataobj.loanInfo[array_index].customerLoan_type !=
                    undefined &&
                    allDataobj.loanInfo[array_index].customerLoan_type.value ==
                      'Individual') ||
                    (allDataobj.loanInfo[array_index].customerLoan_type !=
                      undefined &&
                      allDataobj.loanInfo[array_index].customerLoan_type
                        .value == 'PM Loan')) && (
                    <View>
                      <View style={styles.row2}>
                        <FormInputs
                          text={'Occupation'}
                          required={true}
                          error={
                            allDataobj.loanInfo[array_index].occupation.error
                          }
                          value={
                            allDataobj.loanInfo[array_index].occupation.value
                          }
                          onChangeText={(value: string) => {
                            if (!regex.test(value)) {
                              return;
                            }
                            let get = allDataobj;
                            get.loanInfo[array_index].occupation.value = value;
                            setAlldataobj({...get});
                          }}></FormInputs>

                        <FormInputs
                          text={'No of Employees'}
                          required={true}
                          error={
                            allDataobj.loanInfo[array_index].no_of_emploee.error
                          }
                          value={
                            allDataobj.loanInfo[array_index].no_of_emploee.value
                          }
                          onChangeText={(value: string) => {
                            if (!speacial.test(value)) {
                              return;
                            }
                            let get = allDataobj;
                            get.loanInfo[array_index].no_of_emploee.value =
                              value;
                            setAlldataobj({...get});
                          }}></FormInputs>
                      </View>
                    </View>
                  )}

                  {allDataobj.loanInfo[array_index].customerLoan_type !=
                    undefined &&
                    allDataobj.loanInfo[array_index].customerLoan_type.value ==
                      'Islamic Finance' &&
                    'vendorCnic' in allDataobj.loanInfo[array_index] && (
                      <View>
                        <TextView
                          type={'Bold'}
                          text="Vendor Detail"
                          style={{
                            color: Colors.darkGreenColor,
                            alignSelf: 'center',
                            fontSize: 14,
                            borderBottomColor: Colors.darkGreenColor,
                            borderBottomWidth: 0.5,
                            paddingBottom: 3,
                            marginBottom: 30,
                          }}></TextView>

<View style={{ width: '100%' }}>
<FormInputs
    text={'Vendor CNIC'}
    required={true}
    keyboardtype="number-pad"
    error={allDataobj.loanInfo[array_index]?.vendorCnic.error}
    value={allDataobj.loanInfo[array_index]?.vendorCnic.value}
    onChangeText={value => {
      setAlertMessage(null);
        var regexp = new RegExp('^[0-9+]{5}-[0-9+]{7}-[0-9]{1}$');

        if (value.length < 16) {
            let get = allDataobj;
            if (value.length === 5 || value.length === 13) {
                get.loanInfo[array_index].vendorCnic.value = value + '-';
            } else {
                get.loanInfo[array_index].vendorCnic.value = value;
            }
            get.loanInfo[array_index].vendorCnic.error = !regexp.test(value);
            setAlldataobj({ ...get });
        }

       
        if (regexp.test(value)) {
          checkVendorForbiddenList(value); 
        }
    }}
/>

{alertMessage?.text && (
    <TextView
        style={{textAlign: 'center',fontSize: 14, margin:10, color: alertMessage.color }}
        text={alertMessage.text}
    />
)} 
</View>

<View style={styles.row2}>


                          <FormInputs
                            text={'Vendor Name'}
                            required={true}
                            error={
                              allDataobj.loanInfo[array_index].vendorName.error
                            }
                            value={
                              allDataobj.loanInfo[array_index].vendorName.value
                            }
                            onChangeText={(value: string) => {
                              if (!regex.test(value)) {
                                return;
                              }
                              let get = allDataobj;
                              get.loanInfo[array_index].vendorName.value =
                                value;
                              setAlldataobj({...get});
                            }}></FormInputs>
                        

                        
                          <FormInputs
                            text={'Vendor Shop Name'}
                            required={true}
                            error={
                              allDataobj.loanInfo[array_index].vendorShopName
                                .error
                            }
                            value={
                              allDataobj.loanInfo[array_index].vendorShopName
                                .value
                            }
                            onChangeText={(value: string) => {
                              if (!regex.test(value)) {
                                return;
                              }
                              let get = allDataobj;
                              get.loanInfo[array_index].vendorShopName.value =
                                value;
                              setAlldataobj({...get});
                            }}></FormInputs>
 </View>


<View style={styles.row2}>
                          <FormInputs
                            text={'Vendor Mobile Number'}
                            required={true}
                            keyboardtype={'phone-pad'}
                            error={
                              allDataobj.loanInfo[array_index]
                                .vendorMobileNumber.error
                            }
                            value={
                              allDataobj.loanInfo[array_index]
                                .vendorMobileNumber.value
                            }
                            onChangeText={(value: string) => {
                              // if (!regex.test(value)) {
                              //   return
                              // }
                              let get = allDataobj;
                              get.loanInfo[
                                array_index
                              ].vendorMobileNumber.value = value;
                              setAlldataobj({...get});
                            }}></FormInputs>
                       
                          <FormInputs
                            text={'Vendor Product Name'}
                            required={true}
                            error={
                              allDataobj.loanInfo[array_index].vendorProductName
                                .error
                            }
                            value={
                              allDataobj.loanInfo[array_index].vendorProductName
                                .value
                            }
                            onChangeText={(value: string) => {
                              // if (!regex.test(value)) {
                              //   return
                              // }
                              let get = allDataobj;
                              get.loanInfo[
                                array_index
                              ].vendorProductName.value = value;
                              setAlldataobj({...get});
                            }}></FormInputs>
 </View>
 
 <View style={styles.row2}>
                          <FormInputs
                            text={'Vendor Product Price'}
                            required={true}
                            error={
                              allDataobj.loanInfo[array_index]
                                .vendorProductPrice.error
                            }
                            value={
                              allDataobj.loanInfo[array_index]
                                .vendorProductPrice.value
                            }
                            onChangeText={(value: string) => {
                              // if (!regex.test(value)) {
                              //   return
                              // }
                              let get = allDataobj;
                              get.loanInfo[
                                array_index
                              ].vendorProductPrice.value = value;
                              setAlldataobj({...get});
                            }}></FormInputs>
                       
                          <FormInputs
                            text={'Product Company Name'}
                            required={true}
                            error={
                              allDataobj.loanInfo[array_index]
                                .ProductCompanyName.error
                            }
                            value={
                              allDataobj.loanInfo[array_index]
                                .ProductCompanyName.value
                            }
                            onChangeText={(value: string) => {
                              // if (!regex.test(value)) {
                              //   return
                              // }
                              let get = allDataobj;
                              get.loanInfo[
                                array_index
                              ].ProductCompanyName.value = value;
                              setAlldataobj({...get});
                            }}></FormInputs>
                        </View>

                        <View
                          style={[
                            styles.row2,
                            {marginTop: 15, marginBottom: 35},
                          ]}>
                          <View
                            style={{
                              height: 200,
                              width: width / 2.5,
                              justifyContent: 'center',
                            }}>
                            <TextView
                              style={{alignSelf: 'center'}}
                              type={'small'}
                              text="CNIC Front"></TextView>
                            {allDataobj.loanInfo[array_index]
                              .vendorCnicImages[0].cnicFront.imgValue == '' ? (
                              <MaterialCommunityIcons
                                style={{alignSelf: 'center'}}
                                name="google-photos"
                                size={56}></MaterialCommunityIcons>
                            ) : (
                              <ZoomableImage
                                images={`data:image/gif;base64,${allDataobj.loanInfo[array_index].vendorCnicImages[0].cnicFront.imgValue}`}
                              />
                            )}

                            <View
                              style={{
                                flexDirection: 'row',
                                alignItems: 'center',
                                marginTop: 20,
                                justifyContent: 'space-around',
                              }}>
                              <Pressable
                                onPressIn={() => takeCnicImage('front')}
                                style={{
                                  height: 30,
                                  width: width / 4,
                                  borderRadius: 10,
                                  backgroundColor: Colors.backgroundColor,
                                  justifyContent: 'center',
                                }}>
                                <TextView
                                  style={{textAlign: 'center'}}
                                  type={'small'}
                                  text="Camera"></TextView>
                              </Pressable>
                            </View>
                          </View>

                          <View
                            style={{
                              height: 200,
                              width: width / 2.5,
                              justifyContent: 'center',
                            }}>
                            <TextView
                              style={{alignSelf: 'center'}}
                              type={'small'}
                              text="CNIC Back"></TextView>
                            {allDataobj.loanInfo[array_index]
                              .vendorCnicImages[0].cnicBack.imgValue == '' ? (
                              <MaterialCommunityIcons
                                style={{alignSelf: 'center'}}
                                name="google-photos"
                                size={56}></MaterialCommunityIcons>
                            ) : (
                              <ZoomableImage
                                images={`data:image/gif;base64,${allDataobj.loanInfo[array_index].vendorCnicImages[0].cnicBack.imgValue}`}
                              />
                            )}

                            <View
                              style={{
                                flexDirection: 'row',
                                alignItems: 'center',
                                marginTop: 20,
                                justifyContent: 'space-around',
                              }}>
                              <Pressable
                                onPressIn={() => takeCnicImage('back')}
                                style={{
                                  height: 30,
                                  width: width / 4,
                                  borderRadius: 10,
                                  backgroundColor: Colors.backgroundColor,
                                  justifyContent: 'center',
                                }}>
                                <TextView
                                  style={{textAlign: 'center'}}
                                  type={'small'}
                                  text="Camera"></TextView>
                              </Pressable>
                            </View>
                          </View>
                        </View>
                      </View>
                    )}

                  {allDataobj.loanInfo[array_index].doyouwantTopupLoan !=
                    undefined &&
                    allDataobj.loanInfo[array_index].doyouwantTopupLoan ==
                      'Yes' && (
                      <View style={styles.row2}>
                        <View style={{marginTop: 0}}>
                          {/* <TextView type={'formLabel'} text={"Topup Loan Type"} 
      style={{color:'#737373',marginLeft:10,width:width/3,marginBottom:0}}></TextView> */}
                          <CustomDropdown
                            type={2}
                            text={`Topup ${OrganizationType === 2 ? 'Finance Facility' : 'Loan'} Type`}
                            required={false}
                            tempdata={topUptype}
                            label={
                              allDataobj.loanInfo[array_index].topupLoantype ==
                              undefined
                              ? `Select Topup ${OrganizationType === 2 ? 'Finance Facility' : 'Loan'} Type`
                              : allDataobj.loanInfo[array_index].topupLoantype.value
                            }
                            onSelect={async (value, underindex) => {
                              let get = allDataobj;
                              get.loanInfo[array_index].topupLoantype = {
                                value: value.name,
                                index: underindex,
                              };
                              get.loanInfo[array_index].topupLoanValue =
                                value.value;

                              var getNumber = Number(value.value);

                              var multiplier =
                                getNumber *
                                Number(
                                  get.loanInfo[array_index].topupLoanQty ==
                                    undefined
                                    ? 1
                                    : get.loanInfo[array_index].topupLoanQty
                                        .value,
                                );
                              get.loanInfo[array_index].topupLoanValue =
                                multiplier;

                              //  ******************************************************************
                              //////////////////////////// Performing subtraction pervious value and add new value in approved loan //////////////
                              // ********************************************************************
                              let approvedLoan = Number(
                                get.loanInfo[array_index].approvedLoan.value,
                              );

                              //console.log("approvedLoan---->" + approvedLoan);
                              //console.log("pervious_topupvalue---->" + pervious_topupvalue);

                              let maker = Number(
                                approvedLoan - pervious_topupvalue,
                              );
                              //console.log("maker---->" + maker);
                              //console.log("multiplier---->" + multiplier);

                              get.loanInfo[array_index].approvedLoan.value =
                                '' + Number(maker + multiplier);
                              //console.log("approvedLoan---->" + Number(maker + multiplier));
                              setAlldataobj({...get});
                              setPervious_topupValue(multiplier);
                              //  ******************************************************************
                              //////////////////////////// Performing subtraction pervious value and add new value in approved loan //////////////
                              // ********************************************************************

                              setAlldataobj({...get});
                              setTopupLoanMultiply(value.value);
                              _autoCalulatePercenatage();
                            }}
                          />
                          {/* **************************** OLD ________________ */}
                          {/* <RiskDropdownlist
                     
                      data={topUptype}
                      RT={2}
                      label={
                        allDataobj.loanInfo[array_index].topupLoantype ==
                        undefined
                          ? 'Please Select Loan Type'
                          : allDataobj.loanInfo[array_index].topupLoantype.name
                      }

                      setAlldataobj={setAlldataobj}
                      allDataobj={allDataobj}
                      array_index={array_index}
                      variable={5}
                      setTopupLoanMultiply={setTopupLoanMultiply}
                      >

                      </RiskDropdownlist> */}
                        </View>
                        <View style={{marginTop: 20}}>
                          <CustomDropdown
                            sortingTrue={false}
                            text={'Quantity'}
                            required={true}
                            tempdata={quantity}
                            label={
                              allDataobj.loanInfo[array_index].topupLoanQty ==
                              undefined
                                ? '1'
                                : allDataobj.loanInfo[array_index].topupLoanQty
                                    .value
                            }
                            onSelect={async (value, underindex) => {
                              let get = allDataobj;
                              var getNumber = Number(topupLoanMultiply);
                              var multiplier =
                                getNumber * Number(quantity[underindex]);
                              get.loanInfo[array_index].topupLoanValue =
                                multiplier;
                              get.loanInfo[array_index].topupLoanQty = {
                                value: quantity[underindex],
                                index: underindex,
                              };
                              //  ******************************************************************
                              //////////////////////////// Performing subtraction pervious value and add new value in approved loan //////////////
                              // ********************************************************************
                              let approvedLoan = Number(
                                get.loanInfo[array_index].approvedLoan.value,
                              );

                              //console.log("approvedLoan---->" + approvedLoan);
                              //console.log("pervious_topupvalue---->" + pervious_topupvalue);

                              let maker = Number(
                                approvedLoan - pervious_topupvalue,
                              );
                              //console.log("maker---->" + maker);
                              //console.log("multiplier---->" + multiplier);

                              get.loanInfo[array_index].approvedLoan.value =
                                '' + Number(maker + multiplier);
                              //console.log("approvedLoan---->" + Number(maker + multiplier));
                              setAlldataobj({...get});
                              setPervious_topupValue(multiplier);
                              _autoCalulatePercenatage();

                              //  ******************************************************************
                              //////////////////////////// Performing subtraction pervious value and add new value in approved loan //////////////
                              // ********************************************************************
                            }}
                          />
                        </View>
                      </View>
                    )}
                  {allDataobj.loanInfo[array_index].doyouwantTopupLoan !=
                    undefined &&
                    allDataobj.loanInfo[array_index].doyouwantTopupLoan ==
                      'Yes' && (
                      <View style={styles.row2}>
                        <FormInputs
                          text={'Topup ${loanLabel} Value'}
                          editable={false}
                          //  error={allDataobj.loanInfo[array_index].loanNote.error}
                          value={
                            allDataobj.loanInfo[array_index].topupLoanValue ==
                            undefined
                              ? '0'
                              : '' +
                                allDataobj.loanInfo[array_index].topupLoanValue
                          }></FormInputs>
                      </View>
                    )}

                  {/* ******************************Monthly Expense */}
                  <TextView
                    type={'Bold'}
                    text="Monthly Expense"
                    style={{
                      color: Colors.darkGreenColor,
                      alignSelf: 'center',
                      fontSize: 14,
                      borderBottomColor: Colors.darkGreenColor,
                      borderBottomWidth: 0.5,
                      paddingBottom: 3,
                    }}></TextView>

                  <View style={styles.bounceview}>
                    <View style={styles.row2}>
                      <FormInputs
                        keyboardtype={'number-pad'}
                        required={true}
                        text={'Raw/business Material Purchasings'}
                        error={
                          allDataobj.loanInfo[array_index].rawMaterialpurchase
                            .error
                        }
                        value={
                          allDataobj.loanInfo[array_index].rawMaterialpurchase
                            .value
                        }
                        onChangeText={(value: string) => {
                          if (!speacial.test(value)) {
                            return;
                          }
                          let get = allDataobj;
                          get.loanInfo[array_index].rawMaterialpurchase.value =
                            value;
                          get.loanInfo[array_index].rawMaterialpurchase.error =
                            false;
                          setAlldataobj({...get});
                          _autoCalculateMonthlyExpenses();
                        }}></FormInputs>
                      <FormInputs
                        keyboardtype={'number-pad'}
                        required={true}
                        text={'Utility Expenses'}
                        error={
                          allDataobj.loanInfo[array_index].utilityExpense.error
                        }
                        value={
                          allDataobj.loanInfo[array_index].utilityExpense.value
                        }
                        onChangeText={(value: string) => {
                          if (!speacial.test(value)) {
                            return;
                          }
                          let get = allDataobj;
                          get.loanInfo[array_index].utilityExpense.value =
                            value;
                          setAlldataobj({...get});
                          _autoCalculateMonthlyExpenses();
                        }}></FormInputs>
                    </View>

                    <View style={styles.row2}>
                      <FormInputs
                        keyboardtype={'number-pad'}
                        text={'Salaries/Wages and Labour Charges'}
                        error={
                          allDataobj.loanInfo[array_index]
                            .salariesandLabourCharges.error
                        }
                        value={
                          allDataobj.loanInfo[array_index]
                            .salariesandLabourCharges.value
                        }
                        onChangeText={(value: string) => {
                          if (!speacial.test(value)) {
                            return;
                          }
                          let get = allDataobj;
                          get.loanInfo[
                            array_index
                          ].salariesandLabourCharges.value = value;
                          setAlldataobj({...get});
                          _autoCalculateMonthlyExpenses();
                        }}></FormInputs>
                      <FormInputs
                        keyboardtype={'number-pad'}
                        text={'Other Expenses'}
                        error={
                          allDataobj.loanInfo[array_index].otherExpenses.error
                        }
                        value={
                          allDataobj.loanInfo[array_index].otherExpenses.value
                        }
                        onChangeText={(value: string) => {
                          if (!speacial.test(value)) {
                            return;
                          }
                          let get = allDataobj;
                          get.loanInfo[array_index].otherExpenses.value = value;
                          setAlldataobj({...get});
                          _autoCalculateMonthlyExpenses();
                        }}></FormInputs>
                    </View>
                    <View style={styles.row2}>
                      <FormInputs
                        keyboardtype={'number-pad'}
                        required={true}
                        text={'Monthly Expenses'}
                        error={
                          allDataobj.loanInfo[array_index].monthlyExpenses.error
                        }
                        value={
                          allDataobj.loanInfo[array_index].monthlyExpenses.value
                        }
                        onChangeText={(value: string) => {
                          if (!speacial.test(value)) {
                            return;
                          }
                          let get = allDataobj;
                          get.loanInfo[array_index].monthlyExpenses.value =
                            value;
                          setAlldataobj({...get});
                        }}></FormInputs>
                    </View>
                  </View>

                  {/* ******************* LIABAILTIES  */}
                  <TextView
                    type={'Bold'}
                    text="Liability"
                    style={{
                      color: Colors.darkGreenColor,
                      alignSelf: 'center',
                      fontSize: 14,
                      borderBottomColor: Colors.darkGreenColor,
                      borderBottomWidth: 0.5,
                      paddingBottom: 3,
                    }}></TextView>

                  <View style={styles.bounceview}>
                    <View style={styles.row2}>
                      <FormInputs
                        keyboardtype={'number-pad'}
                        text={'Monthly Installment from lenders'}
                        error={
                          allDataobj.loanInfo[array_index].monthlyInstallment
                            .error
                        }
                        value={
                          allDataobj.loanInfo[array_index].monthlyInstallment
                            .value
                        }
                        onChangeText={(value: string) => {
                          if (!speacial.test(value)) {
                            return;
                          }
                          let get = allDataobj;
                          get.loanInfo[array_index].monthlyInstallment.value =
                            value;
                          setAlldataobj({...get});
                          _autoCalculateLaiabilities();
                        }}></FormInputs>
                      <FormInputs
                        keyboardtype={'number-pad'}
                        required={true}
                        text={'Any Other Monthly Liability'}
                        error={
                          allDataobj.loanInfo[array_index].anyOtherMonthly.error
                        }
                        value={
                          allDataobj.loanInfo[array_index].anyOtherMonthly.value
                        }
                        onChangeText={(value: string) => {
                          if (!speacial.test(value)) {
                            return;
                          }
                          let get = allDataobj;
                          get.loanInfo[array_index].anyOtherMonthly.value =
                            value;
                          setAlldataobj({...get});
                          _autoCalculateLaiabilities();
                        }}></FormInputs>
                    </View>

                    <View style={styles.row2}>
                      <FormInputs
                        required={true}
                        keyboardtype={'number-pad'}
                        text={'Liability'}
                        editable={false}
                        error={allDataobj.loanInfo[array_index].liability.error}
                        value={allDataobj.loanInfo[array_index].liability.value}
                        onChangeText={(value: string) => {
                          if (!speacial.test(value)) {
                            return;
                          }
                          let get = allDataobj;
                          get.loanInfo[array_index].liability.value = value;
                          setAlldataobj({...get});
                        }}></FormInputs>

                      <FormInputs
                        required={true}
                        keyboardtype={'number-pad'}
                        text={'Business Savings'}
                        editable={false}
                        error={
                          allDataobj.loanInfo[array_index].businessSavings.error
                        }
                        value={
                          allDataobj.loanInfo[array_index].businessSavings.value
                        }
                        onChangeText={(value: string) => {
                          if (!speacial.test(value)) {
                            return;
                          }
                          let get = allDataobj;
                          get.loanInfo[array_index].businessSavings.value =
                            value;
                          setAlldataobj({...get});
                        }}></FormInputs>
                    </View>
                  </View>
                  {/* ************************************ Monthly House Hold */}
                  <TextView
                    type={'Bold'}
                    text="Monthly Household Income"
                    style={{
                      color: Colors.darkGreenColor,
                      alignSelf: 'center',
                      fontSize: 14,
                      borderBottomColor: Colors.darkGreenColor,
                      borderBottomWidth: 0.5,
                      paddingBottom: 3,
                    }}></TextView>

                  <View style={styles.bounceview}>
                    <View style={styles.row2}>
                      <FormInputs
                        keyboardtype={'number-pad'}
                        text={'Income from other Source (if any)'}
                        error={
                          allDataobj.loanInfo[array_index].incomefromOtherSource
                            .error
                        }
                        value={
                          allDataobj.loanInfo[array_index].incomefromOtherSource
                            .value
                        }
                        onChangeText={(value: string) => {
                          if (!speacial.test(value)) {
                            return;
                          }
                          let get = allDataobj;
                          get.loanInfo[
                            array_index
                          ].incomefromOtherSource.value = value;
                          setAlldataobj({...get});
                          _autoCalulateMonthlyHouseholdIncome();
                        }}></FormInputs>
                      <FormInputs
                        keyboardtype={'number-pad'}
                        text={'Other Family Income(If Any)'}
                        error={
                          allDataobj.loanInfo[array_index].otherFamilyIncome
                            .error
                        }
                        value={
                          allDataobj.loanInfo[array_index].otherFamilyIncome
                            .value
                        }
                        onChangeText={(value: string) => {
                          if (!speacial.test(value)) {
                            return;
                          }
                          let get = allDataobj;
                          get.loanInfo[array_index].otherFamilyIncome.value =
                            value;
                          setAlldataobj({...get});
                          _autoCalulateMonthlyHouseholdIncome();
                        }}></FormInputs>
                    </View>

                    <View style={styles.row2}>
                      <FormInputs
                        keyboardtype={'number-pad'}
                        text={'Any Other Income/Rental Income (If any)'}
                        error={
                          allDataobj.loanInfo[array_index].anyOtherIncome.error
                        }
                        value={
                          allDataobj.loanInfo[array_index].anyOtherIncome.value
                        }
                        onChangeText={(value: string) => {
                          if (!speacial.test(value)) {
                            return;
                          }
                          let get = allDataobj;
                          get.loanInfo[array_index].anyOtherIncome.value =
                            value;
                          setAlldataobj({...get});
                          _autoCalulateMonthlyHouseholdIncome();
                        }}></FormInputs>

                      <FormInputs
                        keyboardtype={'number-pad'}
                        text={'Monthly Household Income'}
                        required={true}
                        editable={false}
                        error={
                          allDataobj.loanInfo[array_index]
                            .monthlyHouseholdIncome.error
                        }
                        value={
                          allDataobj.loanInfo[array_index]
                            .monthlyHouseholdIncome.value
                        }
                        onChangeText={(value: string) => {
                          if (!speacial.test(value)) {
                            return;
                          }
                          let get = allDataobj;
                          get.loanInfo[
                            array_index
                          ].monthlyHouseholdIncome.value = value;
                          setAlldataobj({...get});
                        }}></FormInputs>
                    </View>
                  </View>
                  {/* ************************************ Monthly Household Expense */}
                  <TextView
                    type={'Bold'}
                    text="Monthly Household Expense"
                    style={{
                      color: Colors.darkGreenColor,
                      alignSelf: 'center',
                      fontSize: 14,
                      borderBottomColor: Colors.darkGreenColor,
                      borderBottomWidth: 0.5,
                      paddingBottom: 3,
                    }}></TextView>
                  <View style={styles.bounceview}>
                    <View style={styles.row2}>
                      <FormInputs
                        keyboardtype={'number-pad'}
                        text={'Kitchen/Household Expense'}
                        error={
                          allDataobj.loanInfo[array_index].kitchenExpense.error
                        }
                        value={
                          allDataobj.loanInfo[array_index].kitchenExpense.value
                        }
                        onChangeText={(value: string) => {
                          if (!speacial.test(value)) {
                            return;
                          }
                          let get = allDataobj;
                          get.loanInfo[array_index].kitchenExpense.value =
                            value;
                          setAlldataobj({...get});
                          _autoCalulateMonthlyHouseholdExpense();
                        }}></FormInputs>
                      <FormInputs
                        keyboardtype={'number-pad'}
                        text={'Children Education Expense'}
                        error={
                          allDataobj.loanInfo[array_index].childrenExpense.error
                        }
                        value={
                          allDataobj.loanInfo[array_index].childrenExpense.value
                        }
                        onChangeText={(value: string) => {
                          if (!speacial.test(value)) {
                            return;
                          }
                          let get = allDataobj;
                          get.loanInfo[array_index].childrenExpense.value =
                            value;
                          setAlldataobj({...get});
                          _autoCalulateMonthlyHouseholdExpense();
                        }}></FormInputs>
                    </View>

                    <View style={styles.row2}>
                      <FormInputs
                        keyboardtype={'number-pad'}
                        text={'Utility Expense'}
                        error={
                          allDataobj.loanInfo[array_index].utilityExpenses.error
                        }
                        value={
                          allDataobj.loanInfo[array_index].utilityExpenses.value
                        }
                        onChangeText={(value: string) => {
                          if (!speacial.test(value)) {
                            return;
                          }
                          let get = allDataobj;
                          get.loanInfo[array_index].utilityExpenses.value =
                            value;
                          setAlldataobj({...get});
                          _autoCalulateMonthlyHouseholdExpense();
                        }}></FormInputs>

                      <FormInputs
                        keyboardtype={'number-pad'}
                        text={'Any Other Expenses'}
                        error={
                          allDataobj.loanInfo[array_index].anyOtherExpenses
                            .error
                        }
                        value={
                          allDataobj.loanInfo[array_index].anyOtherExpenses
                            .value
                        }
                        onChangeText={(value: string) => {
                          if (!speacial.test(value)) {
                            return;
                          }
                          let get = allDataobj;
                          get.loanInfo[array_index].anyOtherExpenses.value =
                            value;
                          setAlldataobj({...get});
                          _autoCalulateMonthlyHouseholdExpense();
                        }}></FormInputs>
                    </View>

                    <View style={styles.row2}>
                      <FormInputs
                        keyboardtype={'number-pad'}
                        required={true}
                        editable={false}
                        text={'Monthly Household Expense'}
                        error={
                          allDataobj.loanInfo[array_index]
                            .monthlyHouseholdExpense.error
                        }
                        value={
                          allDataobj.loanInfo[array_index]
                            .monthlyHouseholdExpense.value
                        }
                        onChangeText={(value: string) => {
                          if (!speacial.test(value)) {
                            return;
                          }
                          let get = allDataobj;
                          get.loanInfo[
                            array_index
                          ].monthlyHouseholdExpense.value = value;
                          setAlldataobj({...get});
                        }}></FormInputs>

                      <FormInputs
                        keyboardtype={'number-pad'}
                        required={true}
                        text={'Household Liability'}
                        error={
                          allDataobj.loanInfo[array_index].householdLiability
                            .error
                        }
                        value={
                          allDataobj.loanInfo[array_index].householdLiability
                            .value
                        }
                        onChangeText={(value: string) => {
                          if (!speacial.test(value)) {
                            return;
                          }
                          let get = allDataobj;
                          get.loanInfo[array_index].householdLiability.value =
                            value;
                          get.loanInfo[array_index].householdLiability.error =
                            false;
                          setAlldataobj({...get});
                          _autoCalulateHouseholdSavings();
                        }}></FormInputs>
                    </View>

                    <View style={styles.row2}>
                      <FormInputs
                        keyboardtype={'number-pad'}
                        required={true}
                        editable={false}
                        text={'Household Savings'}
                        error={
                          allDataobj.loanInfo[array_index].householdSavings
                            .error
                        }
                        value={
                          allDataobj.loanInfo[array_index].householdSavings
                            .value
                        }
                        onChangeText={(value: string) => {
                          if (!speacial.test(value)) {
                            return;
                          }
                          let get = allDataobj;
                          get.loanInfo[array_index].householdSavings.value =
                            value;
                          setAlldataobj({...get});
                        }}></FormInputs>
                    </View>
                  </View>
                </View>
              )}
            </View>

            {/* <View style={[styles.box]}>
              <Pressable onPressIn={_customerTab2} style={styles.buttomheader}>
                <TextView
                  type={'Light'}
                  text="Monthly Expense"
                  required={true}
                  style={{ color: Colors.darkGreenColor }}></TextView>
                <Pressable onPressIn={_customerTab2}>
                  {activeTab == 2 ? (
                    <MaterialCommunityIcons
                      name="minus"
                      size={26}></MaterialCommunityIcons>
                  ) : (
                    <MaterialCommunityIcons
                      name="plus"
                      size={26}></MaterialCommunityIcons>
                  )}
                </Pressable>
              </Pressable>

              {activeTab == 2 && (
              <View></View>
              )}
            </View> */}
            {/* //-----------------LIBALITY */}

            {/* <View style={[styles.box]}>
              <Pressable onPressIn={_customerTab3} style={styles.buttomheader}>
                <TextView
                  type={'Light'}
                  text="Liability"
                  style={{ color: Colors.darkGreenColor }}></TextView>
                <Pressable onPressIn={_customerTab3}>
                  {activeTab == 3 ? (
                    <MaterialCommunityIcons
                      name="minus"
                      size={26}></MaterialCommunityIcons>
                  ) : (
                    <MaterialCommunityIcons
                      name="plus"
                      size={26}></MaterialCommunityIcons>
                  )}
                </Pressable>
              </Pressable>

              {activeTab == 3 && (
              <View/>
              )}
            </View> */}

            {/* //-----------------LIBALITY */}

            {/* <View style={[styles.box]}>
              <Pressable onPressIn={_customerTab4} style={styles.buttomheader}>
                <TextView
                  type={'Light'}
                  text="Monthly Household Income"
                  style={{ color: Colors.darkGreenColor }}></TextView>
                <Pressable onPressIn={_customerTab4}>
                  {activeTab == 4 ? (
                    <MaterialCommunityIcons
                      name="minus"
                      size={26}></MaterialCommunityIcons>
                  ) : (
                    <MaterialCommunityIcons
                      name="plus"
                      size={26}></MaterialCommunityIcons>
                  )}
                </Pressable>
              </Pressable>

              {activeTab == 4 && (
                <></>
              )}
            </View> */}

            {/* //-----------------LIBALITY */}
            {/* 
            <View style={[styles.box]}>
              <Pressable onPressIn={_customerTab5} style={styles.buttomheader}>
                <TextView
                  type={'Light'}
                  text="Monthly Household Expense"
                  style={{ color: Colors.darkGreenColor }}></TextView>
                <Pressable onPressIn={_customerTab5}>
                  {activeTab == 5 ? (
                    <MaterialCommunityIcons
                      name="minus"
                      size={26}></MaterialCommunityIcons>
                  ) : (
                    <MaterialCommunityIcons
                      name="plus"
                      size={26}></MaterialCommunityIcons>
                  )}
                </Pressable>
              </Pressable>

              {activeTab == 5 && (
              <></>
              )}
            </View> */}

            {/* //-----------------AML/CFT Customer Risk Profiling */}

            <View style={[styles.box]}>
              <Pressable onPressIn={_customerTab6} style={styles.buttomheader}>
                <TextView
                  type={'Light'}
                  text="AML/CFT Customer Risk Profiling"
                  style={{color: Colors.white}}></TextView>
                <Pressable onPressIn={_customerTab6}>
                  {activeTab == 6 ? (
                    <MaterialCommunityIcons
                      color={Colors.white}
                      name="minus"
                      size={26}></MaterialCommunityIcons>
                  ) : (
                    <MaterialCommunityIcons
                      color={Colors.white}
                      name="plus"
                      size={26}></MaterialCommunityIcons>
                  )}
                </Pressable>
              </Pressable>

              {activeTab == 6 && (
                <View style={styles.bounceview}>
                  <TextView
                    type={'formLabel'}
                    text={'Geographical Risk'}
                    style={styles.headingText}></TextView>
                  <View style={styles.row2risk}>
                    <RiskDropdownlist
                      data={geographicrisk}
                      RT={2}
                      text={'Geographical Risk'}
                      label={
                        allDataobj.loanInfo[array_index].geographicrisk ==
                        undefined
                          ? 'None'
                          : allDataobj.loanInfo[array_index].geographicrisk.name
                      }
                      setAlldataobj={setAlldataobj}
                      allDataobj={allDataobj}
                      array_index={array_index}
                      variable={1}></RiskDropdownlist>
                  </View>
                  <TextView
                    type={'formLabel'}
                    text={'Customer and Product Risk'}
                    style={styles.headingText}></TextView>
                  <View style={styles.row2risk}>
                    <RiskDropdownlist
                      data={customerandproductrisk}
                      RT={2}
                      text={'Customer and Product Risk'}
                      label={
                        allDataobj.loanInfo[array_index]
                          .customerandproductrisk == undefined
                          ? 'None'
                          : allDataobj.loanInfo[array_index]
                              .customerandproductrisk.name
                      }
                      setAlldataobj={setAlldataobj}
                      allDataobj={allDataobj}
                      editable={false}
                      array_index={array_index}
                      variable={2}></RiskDropdownlist>
                  </View>
                  <TextView
                    type={'formLabel'}
                    text={'PEP RISK'}
                    style={styles.headingText}></TextView>
                  <View style={styles.row2risk}>
                    <RiskDropdownlist
                      data={peprisk}
                      RT={2}
                      text={'PEP Risk'}
                      label={
                        allDataobj.loanInfo[array_index].peprisk == undefined
                          ? 'None'
                          : allDataobj.loanInfo[array_index].peprisk.name
                      }
                      setAlldataobj={setAlldataobj}
                      allDataobj={allDataobj}
                      array_index={array_index}
                      variable={3}></RiskDropdownlist>
                  </View>
                  <TextView
                    type={'formLabel'}
                    text={`${loanLabel} Utilization Risk(${loanLabel} UBO)`}
                    style={styles.headingText}></TextView>
                  <View style={styles.row2risk}>
                    <RiskDropdownlist
                      data={loanubo}
                      RT={2}
                      text={`Loan Utilization Risk(${loanLabel} UBO)`}
                      label={
                        allDataobj.loanInfo[array_index].loanUtilizationrisk ==
                        undefined
                          ? 'Self'
                          : allDataobj.loanInfo[array_index].loanUtilizationrisk
                              .name
                      }
                      setAlldataobj={setAlldataobj}
                      allDataobj={allDataobj}
                      array_index={array_index}
                      variable={4}></RiskDropdownlist>
                  </View>

                  {allDataobj.loanInfo[array_index].loanUtilizationrisk !=
                    undefined &&
                    allDataobj.loanInfo[array_index].loanUtilizationrisk.risk >
                      1 && (
                      <View style={[styles.row2, {marginTop: 20}]}>
                        <FormInputs
                          text={'Name'}
                          required={true}
                          error={
                            allDataobj.loanInfo[array_index]
                              .loanUtilizationriskname.error
                          }
                          value={
                            allDataobj.loanInfo[array_index]
                              .loanUtilizationriskname.value
                          }
                          onChangeText={(value: string) => {
                            if (!regex.test(value)) {
                              return;
                            }
                            let get = allDataobj;
                            get.loanInfo[
                              array_index
                            ].loanUtilizationriskname.value = value;
                            setAlldataobj({...get});
                          }}></FormInputs>
                        <FormInputs
                          text={'Father/Husband Name'}
                          required={true}
                          error={
                            allDataobj.loanInfo[array_index]
                              .loanUtilizationriskfatherHusbandName.error
                          }
                          value={
                            allDataobj.loanInfo[array_index]
                              .loanUtilizationriskfatherHusbandName.value
                          }
                          onChangeText={(value: string) => {
                            if (!regex.test(value)) {
                              return;
                            }
                            let get = allDataobj;
                            get.loanInfo[
                              array_index
                            ].loanUtilizationriskfatherHusbandName.value = value;
                            setAlldataobj({...get});
                          }}></FormInputs>
                      </View>
                    )}

                  {allDataobj.loanInfo[array_index].loanUtilizationrisk !=
                    undefined &&
                    allDataobj.loanInfo[array_index].loanUtilizationrisk.risk >
                      1 && (
                      <View style={styles.row2}>
                        <FormInputs
                          required={true}
                          keyboardtype={'number-pad'}
                          text={'CNIC'}
                          error={
                            allDataobj.loanInfo[array_index]
                              .loanUtilizationriskcnic.error
                          }
                          value={
                            allDataobj.loanInfo[array_index]
                              .loanUtilizationriskcnic.value
                          }
                          onChangeText={(value: string) => {
                            var regexp = new RegExp(
                              '^[0-9+]{5}-[0-9+]{7}-[0-9]{1}$',
                            );
                            if (value.length < 16) {
                              if (value.length == 5 || value.length == 13) {
                                let get = allDataobj;
                                get.loanInfo[
                                  array_index
                                ].loanUtilizationriskcnic.value = value + '-';

                                get.loanInfo[
                                  array_index
                                ].loanUtilizationriskcnic.error = !regexp.test(
                                  value,
                                )
                                  ? true
                                  : false;
                                setAlldataobj({...get});
                              } else {
                                let get = allDataobj;
                                get.loanInfo[
                                  array_index
                                ].loanUtilizationriskcnic.value = value;
                                get.loanInfo[
                                  array_index
                                ].loanUtilizationriskcnic.error = !regexp.test(
                                  value,
                                )
                                  ? true
                                  : false;

                                setAlldataobj({...get});
                              }
                            }
                          }}></FormInputs>
                      </View>
                    )}

                  <View style={styles.row2}>
                    <TextView
                      type={'Light'}
                      style={{
                        textAlign: 'center',
                        marginTop: 10,
                        marginLeft: 20,
                        color: '#000',
                      }}
                      text="Borrow Risk Profile"></TextView>

                    <View
                      style={{
                        width: width / 2.5,
                        height: 55,
                        paddingLeft: 0,
                        marginTop: 10,
                        justifyContent: 'center',
                      }}>
                      {/* <TextView type={'Light'} style={{textAlign: 'center'}} text="Risk Profiling"></TextView> */}
                      <View
                        style={{
                          alignSelf: 'center',
                          backgroundColor:
                            allDataobj.loanInfo[array_index]
                              .borrowerriskprofile == 1
                              ? 'green'
                              : allDataobj.loanInfo[array_index]
                                  .borrowerriskprofile == 2
                              ? 'yellow'
                              : 'red',
                          height: 30,
                          width: 100,
                          borderRadius: 10,
                          justifyContent: 'center',
                        }}>
                        <TextView
                          type={'Light'}
                          style={{
                            textAlign: 'center',
                            color:
                              allDataobj.loanInfo[array_index]
                                .borrowerriskprofile == 1
                                ? '#FFF'
                                : allDataobj.loanInfo[array_index]
                                    .borrowerriskprofile == 2
                                ? '#000'
                                : '#FFF',
                          }}
                          text={
                            allDataobj.loanInfo[array_index]
                              .borrowerriskprofile == 1
                              ? 'Low'
                              : allDataobj.loanInfo[array_index]
                                  .borrowerriskprofile == 2
                              ? 'Medium'
                              : 'High'
                          }></TextView>
                      </View>
                    </View>
                  </View>

                  <View style={[styles.row2, {marginTop: 20}]}>
                    {allDataobj.loanInfo[array_index].geographicrisk !=
                      undefined &&
                      allDataobj.loanInfo[array_index].geographicrisk.risk >
                        1 && (
                        <FormInputs
                          text={'Geographical Risk Remarks'}
                          error={
                            allDataobj.loanInfo[array_index]
                              .geographicriskRemarks.error
                          }
                          value={
                            allDataobj.loanInfo[array_index]
                              .geographicriskRemarks.value
                          }
                          onChangeText={(value: string) => {
                            let get = allDataobj;
                            get.loanInfo[
                              array_index
                            ].geographicriskRemarks.value = value;
                            setAlldataobj({...get});
                          }}></FormInputs>
                      )}
                    {allDataobj.loanInfo[array_index].customerandproductrisk !=
                      undefined &&
                      allDataobj.loanInfo[array_index].customerandproductrisk
                        .risk > 1 && (
                        <FormInputs
                          text={'Customer Product Risk Remarks'}
                          error={
                            allDataobj.loanInfo[array_index]
                              .customerandProductriskRemarks.error
                          }
                          value={
                            allDataobj.loanInfo[array_index]
                              .customerandProductriskRemarks.value
                          }
                          onChangeText={(value: string) => {
                            let get = allDataobj;
                            get.loanInfo[
                              array_index
                            ].customerandProductriskRemarks.value = value;
                            setAlldataobj({...get});
                          }}></FormInputs>
                      )}
                  </View>

                  <View style={styles.row2}>
                    {allDataobj.loanInfo[array_index].peprisk != undefined &&
                      allDataobj.loanInfo[array_index].peprisk.risk > 1 && (
                        <FormInputs
                          text={'PEP Risk Remarks'}
                          error={
                            allDataobj.loanInfo[array_index].pepriskRemakrs
                              .error
                          }
                          value={
                            allDataobj.loanInfo[array_index].pepriskRemakrs
                              .value
                          }
                          onChangeText={(value: string) => {
                            let get = allDataobj;
                            get.loanInfo[array_index].pepriskRemakrs.value =
                              value;
                            setAlldataobj({...get});
                          }}></FormInputs>
                      )}
                    {allDataobj.loanInfo[array_index].loanUtilizationrisk !=
                      undefined &&
                      allDataobj.loanInfo[array_index].loanUtilizationrisk
                        .risk > 1 && (
                        <FormInputs
                          text={'Loan Utilization Risk Remarks'}
                          error={
                            allDataobj.loanInfo[array_index]
                              .loanUtilizationriskRemarks.error
                          }
                          value={
                            allDataobj.loanInfo[array_index]
                              .loanUtilizationriskRemarks.value
                          }
                          onChangeText={(value: string) => {
                            let get = allDataobj;
                            get.loanInfo[
                              array_index
                            ].loanUtilizationriskRemarks.value = value;
                            setAlldataobj({...get});
                          }}></FormInputs>
                      )}
                  </View>
                </View>
              )}
            </View>

            {/* //-----------------ESM Product Wise Risk Profiling */}

            <View style={[styles.box]}>
              <Pressable onPressIn={_customerTab9} style={styles.buttomheader}>
                <TextView
                  type={'Light'}
                  text="ESM Product Wise Risk Profiling"
                  style={{color: Colors.white}}></TextView>
                <Pressable onPressIn={_customerTab9}>
                  {activeTab == 9 ? (
                    <MaterialCommunityIcons
                      color={Colors.white}
                      name="minus"
                      size={26}></MaterialCommunityIcons>
                  ) : (
                    <MaterialCommunityIcons
                      color={Colors.white}
                      name="plus"
                      size={26}></MaterialCommunityIcons>
                  )}
                </Pressable>
              </Pressable>

              {activeTab == 9 && (
                <View style={styles.bounceview}>
                  <View>
                    <TextView
                      type={'formLabel'}
                      text={'ECM Risks'}
                      style={{
                        color: '#737373',
                        marginLeft: 10,
                        width: width / 3,
                        marginBottom: -20,
                      }}></TextView>
                    <Dropdownlist
                      data={EsmProductWiseRisk}
                      label={
                        allDataobj.loanInfo[array_index].EsmProductRisk ==
                        undefined
                          ? 'Select Risk'
                          : EsmProductWiseRisk[
                              allDataobj.loanInfo[array_index].EsmProductRisk
                            ]
                      }
                      onSelect={(index, value) => {
                        let get = allDataobj;

                        setEcmSelectedValue(undefined);

                        get.loanInfo[array_index].EsmProductRisk = undefined;
                        get.loanInfo[array_index].EsmProductItemRisk =
                          undefined;

                        get.loanInfo[array_index].EsmProductRisk = index;

                        let EsmRiskArray = [...EsmProductWiseRiskList[index]];
                        setEcmRiskProfile(EsmRiskArray);

                        setAlldataobj({...get});
                      }}></Dropdownlist>
                  </View>

                  <TextView
                    type={'formLabel'}
                    text={'ECM product wise risk profiling'}
                    style={styles.headingText}></TextView>

                  <View style={styles.row2risk}>
                    <EcmProductWiseModal
                      text={''}
                      required={true}
                      tempdata={ecmRiskProfile}
                      label={''}
                      onSelect={async (value, underindex) => {
                        let getEcmRiskProfile = ecmRiskProfile;
                        getEcmRiskProfile[underindex].checked =
                          !getEcmRiskProfile[underindex].checked;
                        if (getEcmRiskProfile[underindex].checked) {
                          setEsmProductRsikArray([
                            ...esmProductRsikArray,
                            underindex,
                          ]);
                          setEsmProductRiskSum(
                            esmProductRiskSum + parseInt(value.risk),
                          );
                        } else {
                          const index = esmProductRsikArray.indexOf(underindex);

                          if (index > -1) {
                            esmProductRsikArray.splice(index, 1);
                          }

                          setEsmProductRsikArray([...esmProductRsikArray]);
                          setEsmProductRiskSum(
                            esmProductRiskSum - parseInt(value.risk),
                          );
                        }
                      }}
                      type={2}
                      onPressDone={() => {
                        if (ecmRiskProfile.length > 0) {
                          let get = allDataobj;

                          ecmRiskProfile.map(item => {
                            if (item.checked) {
                              item.checked = false;
                            }
                          });

                          get.loanInfo[array_index].EsmProductItemRisk =
                            esmProductRsikArray;
                          get.loanInfo[array_index].EsmProductRiskValue =
                            esmProductRiskSum;
                          setAlldataobj({...get});
                          setSemModal(false);
                        } else {
                          setSemModal(false);
                        }
                      }}
                      filterModal={esmModal}
                      setfilterModal={setSemModal}
                      esmProductRiskSum={esmProductRiskSum}
                      setEsmRsikSum={setEsmProductRiskSum}
                      setEsmRiskArray={setEsmProductRsikArray}
                    />

                    {/* <RiskDropdownlist
                      data={ecmRiskProfile}
                      RT={2}
                      text={'ECM Risk'}
                      label={
                          allDataobj.loanInfo[array_index].EsmProductItemRisk == undefined
                          ? 'None'
                          : EsmProductWiseRiskList[allDataobj.loanInfo[array_index].EsmProductRisk][allDataobj.loanInfo[array_index].EsmProductItemRisk].name
                      }
                      setAlldataobj={setAlldataobj}
                      allDataobj={allDataobj}
                      array_index={array_index}
                      variable={6}></RiskDropdownlist> */}
                  </View>
                </View>
              )}
            </View>
            {/* **************************** E Verisys starts **************************************  */}
            <View style={[styles.box]}>
              <Pressable onPressIn={_customerTab3} style={styles.buttomheader}>
                <TextView
                  type={'Light'}
                  text="E-Versis "
                  style={{color: Colors.white}}></TextView>
                <Pressable onPressIn={_customerTab3}>
                  {activeTab == 3 ? (
                    <MaterialCommunityIcons
                      color={Colors.white}
                      name="minus"
                      size={26}></MaterialCommunityIcons>
                  ) : (
                    <MaterialCommunityIcons
                      color={Colors.white}
                      name="plus"
                      size={26}></MaterialCommunityIcons>
                  )}
                </Pressable>
              </Pressable>

              {activeTab == 3 ? (
                <View style={styles.bounceview}>
                  <View>
                    <View style={{flexDirection: 'row', alignItems: 'center'}}>
                      <View style={{flex: 1}}>
                        <Text></Text>
                      </View>

                      <Pressable
                        onPressIn={() => {
                          let get = allDataobj;
                          get.customerInfo[array_index].evrisys_customerImage =
                            undefined;
                          setAlldataobj({...get});
                        }}>
                        <MaterialCommunityIcons
                          name="delete"
                          size={23}
                          style={{
                            color: '#ff0000',
                          }}
                        />
                      </Pressable>
                    </View>
                    <View
                      style={{
                        marginTop: 10,
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'center',
                        marginBottom: 10,
                      }}>
                      <View
                        style={{
                          height: 200,
                          padding: 10,
                          width: width / 2.5,
                          justifyContent: 'center',
                        }}>
                        {/* <TextView
style={{alignSelf: 'center'}}
type={'small'}
text="Documents Image"></TextView> */}
                        {allDataobj?.customerInfo[array_index]
                          .evrisys_customerImage == undefined ? (
                          <MaterialCommunityIcons
                            style={{alignSelf: 'center'}}
                            name="google-photos"
                            size={56}></MaterialCommunityIcons>
                        ) : (
                          <ZoomableImage
                            images={`data:image/gif;base64,${allDataobj?.customerInfo[array_index].evrisys_customerImage}`}
                          />
                        )}

                        <View style={styles.customerImgconatiner}>
                          <Pressable
                            onPressIn={() => {
                              setEverisys(true);
                            }}
                            style={[
                              styles.capture,
                              {
                                backgroundColor: Colors.backgroundColor,
                                marginRight: 30,
                              },
                            ]}>
                            <TextView
                              style={{textAlign: 'center'}}
                              type={'small'}
                              text={'Open E-Verisys'}></TextView>
                          </Pressable>

                          <Pressable
                            onPressIn={() => takePhotofromGallerySetEversisys()}
                            style={[
                              styles.capture,
                              {backgroundColor: Colors.backgroundColor},
                            ]}>
                            <TextView
                              style={{textAlign: 'center'}}
                              type={'small'}
                              text="Open Gallery"></TextView>
                          </Pressable>
                        </View>
                      </View>
                    </View>
                  </View>
                </View>
              ) : (
                <View></View>
              )}
            </View>
            {/* **************************** E Verisys ends**************************************  */}
            <View style={[styles.box]}>
              <Pressable onPressIn={_customerTab7} style={styles.buttomheader}>
                <TextView
                  type={'Light'}
                  text="Documents Images"
                  style={{color: Colors.white}}></TextView>
                <Pressable onPressIn={_customerTab7}>
                  {activeTab == 7 ? (
                    <MaterialCommunityIcons
                      color={Colors.white}
                      name="minus"
                      size={26}></MaterialCommunityIcons>
                  ) : (
                    <MaterialCommunityIcons
                      color={Colors.white}
                      name="plus"
                      size={26}></MaterialCommunityIcons>
                  )}
                </Pressable>
              </Pressable>

              {activeTab == 7 ? (
                <View style={styles.bounceview}>
                  <FlatList
                    data={allDataobj.loanInfo[array_index].loan_customerImage}
                    renderItem={item => renderDocsItems(item.item, item.index)}
                    keyExtractor={item => item.id}
                    numColumns={2}
                  />
                </View>
              ) : (
                <View></View>
              )}
            </View>

            {/* //--------------------Poverty card */}

            <View style={[styles.box]}>
              <Pressable onPressIn={_customerTab8} style={styles.buttomheader}>
                <TextView
                  type={'Light'}
                  text="Poverty Score Card"
                  style={{color: Colors.white}}></TextView>
                <Pressable onPressIn={_customerTab8}>
                  {activeTab == 8 ? (
                    <MaterialCommunityIcons
                      color={Colors.white}
                      name="minus"
                      size={26}></MaterialCommunityIcons>
                  ) : (
                    <MaterialCommunityIcons
                      color={Colors.white}
                      name="plus"
                      size={26}></MaterialCommunityIcons>
                  )}
                </Pressable>
              </Pressable>

              {activeTab == 8 && (
                <View style={styles.bounceview}>
                  {/* {questionArray.length>0 &&
                
                questionArray.map((item)=>{

                 return <View style={[styles.row2, {marginTop: 20}]}>
                  <Question
                    label={item.Question}
                    questions={item.AnswersList}
                    onSelect={async value => {
                      alert(value)
                      let get = allDataobj;
                      get.loanInfo[array_index].questionsno2 =
                        questionsno2[value];
                      setAlldataobj({...get});
                    }}
                    text={
                      item.Question
                    }></Question>
                </View>


                })
                } */}
                  <View style={styles.row2}>
                    <Question
                      label={Data.questionsno1}
                      questions={questionArray[0].AnswersList}
                      onSelect={async value => {
                        let get = allDataobj;
                        get.loanInfo[array_index].questionsno1 =
                          questionArray[0].AnswersList[value];
                        setAlldataobj({...get});
                      }}
                      text={questionArray[0].Question}></Question>
                  </View>
                  {/* //questionsno2 */}

                  <View style={[styles.row2, {marginTop: 20}]}>
                    <Question
                      label={Data.questionsno2}
                      questions={questionArray[1].AnswersList}
                      onSelect={async value => {
                        let get = allDataobj;
                        get.loanInfo[array_index].questionsno2 =
                          questionArray[1].AnswersList[value];
                        setAlldataobj({...get});
                      }}
                      text={questionArray[1].Question}></Question>
                  </View>

                  {/* //questionsno3 */}

                  <View style={[styles.row2, {marginTop: 20}]}>
                    <Question
                      label={Data.questionsno3}
                      questions={questionArray[2].AnswersList}
                      onSelect={async value => {
                        let get = allDataobj;
                        get.loanInfo[array_index].questionsno3 =
                          questionArray[2].AnswersList[value];
                        setAlldataobj({...get});
                      }}
                      text={questionArray[2].Question}></Question>
                  </View>

                  {/* //questionsno4 */}

                  <View style={[styles.row2, {marginTop: 20}]}>
                    <Question
                      label={Data.questionsno4}
                      questions={questionArray[3].AnswersList}
                      onSelect={async value => {
                        let get = allDataobj;
                        get.loanInfo[array_index].questionsno4 =
                          questionArray[3].AnswersList[value];
                        setAlldataobj({...get});
                      }}
                      text={questionArray[3].Question}></Question>
                  </View>

                  {/* //questionsno5 */}

                  <View style={[styles.row2, {marginTop: 20}]}>
                    <Question
                      label={Data.questionsno5}
                      questions={questionArray[4].AnswersList}
                      onSelect={async value => {
                        let get = allDataobj;
                        get.loanInfo[array_index].questionsno5 =
                          questionArray[4].AnswersList[value];
                        setAlldataobj({...get});
                      }}
                      text={questionArray[4].Question}></Question>
                  </View>

                  {/* //questionsno6 */}

                  <View style={[styles.row2, {marginTop: 20}]}>
                    <Question
                      label={Data.questionsno6}
                      questions={questionArray[5].AnswersList}
                      onSelect={async value => {
                        let get = allDataobj;
                        get.loanInfo[array_index].questionsno6 =
                          questionArray[5].AnswersList[value];
                        setAlldataobj({...get});
                      }}
                      text={questionArray[5].Question}></Question>
                  </View>

                  {/* //questionsno7 */}

                  <View style={[styles.row2, {marginTop: 20}]}>
                    <Question
                      label={Data.questionsno7}
                      questions={questionArray[6].AnswersList}
                      onSelect={async value => {
                        let get = allDataobj;
                        get.loanInfo[array_index].questionsno7 =
                          questionArray[6].AnswersList[value];
                        setAlldataobj({...get});
                      }}
                      text={questionArray[6].Question}></Question>
                  </View>

                  {/* //questionsno8 */}

                  <View style={[styles.row2, {marginTop: 20}]}>
                    <Question
                      label={Data.questionsno8}
                      questions={questionArray[7].AnswersList}
                      onSelect={async value => {
                        let get = allDataobj;
                        get.loanInfo[array_index].questionsno8 =
                          questionArray[7].AnswersList[value];
                        setAlldataobj({...get});
                      }}
                      text={questionArray[7].Question}></Question>
                  </View>

                  {/* //questionsno9 */}

                  <View style={[styles.row2, {marginTop: 20}]}>
                    <Question
                      label={Data.questionsno9}
                      questions={questionArray[8].AnswersList}
                      onSelect={async value => {
                        let get = allDataobj;
                        get.loanInfo[array_index].questionsno9 =
                          questionArray[8].AnswersList[value];
                        setAlldataobj({...get});
                      }}
                      text={questionArray[8].Question}></Question>
                  </View>

                  {/* //questionsno10 */}

                  <View style={[styles.row2, {marginTop: 20}]}>
                    <Question
                      label={Data.questionsno10}
                      questions={questionArray[9].AnswersList}
                      onSelect={async value => {
                        let get = allDataobj;

                        get.loanInfo[array_index].questionsno10 =
                          questionArray[9].AnswersList[value];

                        setAlldataobj({...get});
                      }}
                      text={questionArray[9].Question}></Question>
                  </View>

                  {/* //questionsno11 */}

                  <View style={[styles.row2, {marginTop: 20}]}>
                    <Question
                      label={Data.questionsno11}
                      questions={questionArray[10].AnswersList}
                      onSelect={async value => {
                        let get = allDataobj;
                        get.loanInfo[array_index].questionsno11 =
                          questionArray[10].AnswersList[value];
                        setAlldataobj({...get});
                      }}
                      text={questionArray[10].Question}></Question>
                  </View>

                  {/* //questionsno12 */}

                  <View style={[styles.row2, {marginTop: 20}]}>
                    <Question
                      label={Data.questionsno12}
                      questions={questionArray[11].AnswersList}
                      onSelect={async value => {
                        let get = allDataobj;
                        get.loanInfo[array_index].questionsno12 =
                          questionArray[11].AnswersList[value];
                        setAlldataobj({...get});
                      }}
                      text={questionArray[11].Question}></Question>
                  </View>

                  {/* //questionsno13 */}

                  <View style={[styles.row2, {marginTop: 20}]}>
                    <Question
                      label={Data.questionsno13}
                      questions={questionArray[12].AnswersList}
                      onSelect={async value => {
                        let get = allDataobj;
                        get.loanInfo[array_index].questionsno13 =
                          questionArray[12].AnswersList[value];
                        setAlldataobj({...get});
                      }}
                      text={questionArray[12].Question}></Question>
                  </View>
                </View>
              )}
            </View>
          </View>
          <BottomButton
            onPressNext={_onClickNext}
            onPressPrev={props.onPressPrev}
            show={2}></BottomButton>
        </View>
        <ModalViewEverisys
          visible={Everisys}
          setVisible={setEverisys}
          childerns={
            <View
              style={{
                height: height / 1.2,
                width: '100%',
                backgroundColor: '#000',
                marginTop: 20,
              }}>
              {loading && <Customprogress color={Colors.parrotGreenColor} />}

              <WebView
                source={{uri: mainUrl.uri}}
                ref={ref => {
                  mainUrl.webview = ref;
                }}
                onLoad={e => {
                  setLoading(false);
                  mainUrl.uri = e.nativeEvent.url;
                }}
                startInLoadingState={true}
                scalesPageToFit={false}
                injectedJavaScript={`(function(){
                  document.getElementById('loginForm:usrnam').value = 'naveed.memon@safcomicrofinance.com.pk';
                  document.getElementById('loginForm:usrnam').setAttribute('type','password');
                  
                  document.getElementById('loginForm:pass').value = 'Safco@121it';
                  document.querySelector(".reveal").remove();


                } 
                ());`}
              />
            </View>
          }
        />
        <ImageNameList
          tempdata={imageNames}
          filterModal={dialog.dialog}
          onSelect={value => {
            console.log(value);
            let get = allDataobj;
            get.loanInfo[array_index].loan_customerImage[
              dialog.index
            ].imgName.value = value;
            get.loanInfo[array_index].loan_customerImage[
              dialog.index
            ].imgName.error = false;
            setDialog({...dialog, dialog: false});
            setAlldataobj({...get});
          }}
          onClose={() => {
            setDialog({...dialog, dialog: false});
          }}
        />
      </ScrollView>
      <Toast {...toast} onDismiss={() => setToast({message: '', type: ''})} />
    </SafeAreaView>
  );
};
const mapDispatchToProps = dispatch => {
  return {
    UpdateUserData: Data => {
      dispatch({
        type: 'FORM',
        payload: Data,
      });
    },
  };
};
export default connect(null, mapDispatchToProps)(memo(Loanform));
const styles = StyleSheet.create({
  row2: {
    marginTop: 0,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  customerImgconatiner: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 20,
    justifyContent: 'space-around',
  },
  capture: {
    height: 40,
    width: width / 5,
    borderRadius: 30,
    justifyContent: 'center',
  },
  text: {},
  bounceview: GlobalStyles.bounceview,
  buttomheader: GlobalStyles.buttomheader,
  box: GlobalStyles.box,
  incre_decre: {
    height: 30,
    width: 30,
    margin: 2,
    borderRadius: 10,
    elevation: 10,
    justifyContent: 'center',
    backgroundColor: Colors.kulfa,
  },
  headingText: {
    color: '#737373',
    marginLeft: 10,
    width: width / 3,
    marginBottom: -20,
  },
  row2risk: {
    marginTop: 0,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
});
