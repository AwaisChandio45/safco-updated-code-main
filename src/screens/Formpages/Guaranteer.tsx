import React, { memo } from 'react';
import type { Node } from 'react';
import { View, Alert, Pressable, KeyboardAvoidingView, StyleSheet, Dimensions, ScrollView, Image, SafeAreaView } from 'react-native';
import { DateSelector, FormInputs, Tabsitems, TextView, BottomButton, CustomProgressDialoge } from '../../components';
import { Checkbox } from 'react-native-paper';
import { connect, useSelector } from 'react-redux';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import * as Animatable from 'react-native-animatable';
import { Dropdownlist, CustomDropdown } from '../../components';
const { height, width } = Dimensions.get('window');
import { NativeModules, TouchableOpacity } from 'react-native';
const { FingerModule } = NativeModules;
import ImagePicker from 'react-native-image-crop-picker';
import SelectPhotosDialoge from '../../components/SelectPhotosDialoge';
import { JOBTypes } from '../../utilis/RequiredArrays'

import moment from 'moment'
import { SwipeListView, SwipeRow } from "react-native-swipe-list-view";
import { Colors, GlobalStyles } from '../../theme';
import { useNavigation } from '@react-navigation/native';

import { useDispatch } from "react-redux";

import { DeleteAssetsImages, DeleteCustomersFormsTemp, DeleteDocImages, getCustomerFromsbyCnicforchecking, getGroupGurantors, getGroupsFromsforMembers, insertAssetsDocumentsImages, insertAssetsImagesArray, insertCustomerFromData, insertDocumentsImages, insertDocumentsImagesArray, UpdateAssetsImages, UpdateCustomerForms, UpdateDocsImages, UpdateGroupGurantors, UpdateGroupGurantorsCNIC } from '../../sqlite/sqlitedb';
import Toast from '../../components/Toast';
import CustomerAnswer from '../BottomTabs/CustomerAnswer';

const Guaranteer: () => Node = (props) => {
  const navigation = useNavigation();
  const dispatch = useDispatch()
  const [oneTime,setOneTime]=React.useState(true) //this state is make for run only one time
  const fromData = useSelector((state) => state.FormsReducer);
  const UpdateReducer = useSelector((state) => state.UpdateReducer);
  const TempFormReducer = useSelector(state => state.TempFormReducer);
  var updateCheckTemp = TempFormReducer.tempForm.value;

  const CustomerAnsReducer = useSelector((state) => state.CustomerAnsReducer.answerArray);
  var updateCheck = UpdateReducer.updateCheck
  const CustomGetDataModule = useSelector(state => state.RequiredReducer.CustomGetDataModule);
  const [allDataobj, setAlldataobj] = React.useState(updateCheck.value ? props.item : CustomGetDataModule);
  // console.log("---aby Garanter========================>", allDataobj)
  const DataArray = updateCheck.value ? props.item.guarantorInfo : CustomGetDataModule.guarantorInfo
  const [toast, setToast] = React.useState({ value: "", type: "" });
  const [progress, setProgresss] = React.useState(false)
  const [title, setTitle] = React.useState("Adding Customer..")
  const [jobType, setjobType] = React.useState(JOBTypes)
   const [checkedforDisable, setCheckedforDisable] = React.useState(false);
  const [UserData, setUserData] = React.useState(undefined);
  const getUserData = useSelector((state) => state.UserData);
  const StationReducer = useSelector((state) => state.StationReducer);

  var regex = /^[a-zA-Z ]*$/;
  let speacial = /[^a-zA-Z0-9-]/g;
  var numericandAlphabets = new RegExp(/^[a-zA-Z0-9 ]+$/);

  React.useEffect(async () => {

    setUserData(getUserData);
    if(oneTime){
     
      getGroupGurantors(props.user_cnic, allDataobj, setAlldataobj)
      setOneTime(false)
  }
  }, []);


  const _addNewAssets = () => {
    var get = allDataobj;
    get.guarantorInfo.push({
      key: Math.random(),
      activeTab: false,
      guarantor_fullname: { value: "", error: false },
      guarantor_cnic: { value: "", error: false },
      guarantor_address: { value: "", error: false },
      guarantor_contactno: { value: "", error: false },
      guarantor_jobDescription: { value: "", error: false },
      guarantor_businessAddress: { value: "", error: false },
      guarantor_jobType: undefined,
      guarantor_businessNote: { value: "", error: false },
      guarantor_businessStatus: false

    });
    // get.assestsInfo.push()
    setAlldataobj({ ...get })

  }
  // **************** Recursion for add Document Images ****************


  function recursionForAddDocuments(user_cnic, date, fromNumber, members) {
    // //console.log("*********>",members[fromNumber-1].imgName)
    // //console.log("*********>",user_cnic)
    // //console.log("*********>",date)
    // // //console.log("*********>",members[fromNumber-1].imgValue)

    const promise = new Promise((resolve, reject) => {

      insertDocumentsImages(user_cnic, JSON.stringify(members[fromNumber - 1].imgName), JSON.stringify(members[fromNumber - 1].imgValue), JSON.stringify(date))

        .then(() => {

          let nextNumber = fromNumber - 1;

          if (nextNumber > 0) {

            recursionForAddDocuments(user_cnic, date, nextNumber, members);

          } else {

            resolve(user_cnic)
            // setTitle("Adding Customer..")

            setProgresss(true)
            var finalDataobj = fromData.forms;

            finalDataobj.guarantorInfo = DataArray;

            props.UpdateUserData(finalDataobj)

            var date2 = moment().format('l');

            var cnic = fromData.forms.customerInfo[0].customer_cnicNumber.value;

            var name = fromData.forms.customerInfo[0].customer_name.value;

            var user_contactNumber = fromData.forms.customerInfo[0].customer_mobileNumber.value;

            var user_businessAddress = fromData.forms.loanInfo[0].businessAddress.value

            var user_address = fromData.forms.customerInfo[0].customer_pre_address.value

            var documentsArray = fromData.forms.loanInfo[0].loan_customerImage;

            var customerType = fromData.forms.loanInfo[0].customerLoan_type?.index

            var assetsArray = fromData.forms.assestsInfo;

            var spliter = allDataobj.customerInfo[0].customer_location;
            console.log("spliter", spliter)

            var Latitude = ""
            var Longitudes = ""
            if (spliter != undefined) {
              var spliter2 = spliter.split(",");
              Latitude = spliter2[0];
              Longitudes = spliter2[1];
            }

            //console.log("--->DOcuments lemngth", documentsArray.length)

            //console.log("--->assetsArray lemngth", assetsArray.length)

            if (finalDataobj.loanInfo[0].loanType != undefined &&

              finalDataobj.loanInfo[0].loanType.value === "Live Stock") {

              setProgresss(true)

              DeleteAssetsImages(cnic).then(() => {

                recursionForAddAssets(cnic, date, assetsArray.length, assetsArray);
              })

            } else {

              saveAndUpdate(finalDataobj, date2, cnic, name, user_businessAddress, user_contactNumber, user_address, Latitude, Longitudes, customerType)

            }

            // Alert.alert("Done","Success",[{text:"OK",onPress:()=>{
            //   props.navigation.goBack();
            // }}])

          }
        }).catch((error) => {

          reject(error)
        })
    })

    return promise;

  };

  // **************** Recursion for add Document Images ****************


  // **************** Recursion for add Assets Images ****************
  const recursionForAddAssetstwo = (user_cnic, index, date, fromNumber, members) => {
    const promise = new Promise((resolve, reject) => {
      insertAssetsDocumentsImages(user_cnic, index, JSON.stringify(members[fromNumber - 1].imgName), JSON.stringify(members[fromNumber - 1].imgValue), JSON.stringify(date))
        .then(() => {
          let nextNumber = fromNumber - 1;

          if (nextNumber > 0) {
            recursionForAddAssetstwo(user_cnic, index, date, nextNumber, members);
          } else {
            resolve("success")

            // setProgresss(false)
            // Alert.alert("Done","Success",[{text:"OK",onPress:()=>{
            //   props.navigation.goBack();
            // }}])

          }
        }).catch((error) => {
          reject(error)
        })
    })

    return promise;
  }
  const recursionForAddAssets = (user_cnic, date, fromNumber, members) => {

    recursionForAddAssetstwo(user_cnic, fromNumber, date, members[fromNumber - 1].assets_Image.length, members[fromNumber - 1].assets_Image)

    let nextNumber = fromNumber - 1;

    if (nextNumber > 0) {

      recursionForAddAssets(user_cnic, date, nextNumber, members);

    } else {

      var finalDataobj = fromData.forms;

      finalDataobj.guarantorInfo = DataArray;

      props.UpdateUserData(finalDataobj)

      var date2 = moment().format('l');

      var cnic = fromData.forms.customerInfo[0].customer_cnicNumber.value;

      var name = fromData.forms.customerInfo[0].customer_name.value;

      var user_contactNumber = fromData.forms.customerInfo[0].customer_mobileNumber.value;

      var user_businessAddress = fromData.forms.loanInfo[0].businessAddress.value

      var user_address = fromData.forms.customerInfo[0].customer_pre_address.value

      var documentsArray = fromData.forms.loanInfo[0].loan_customerImage;

      var customerType = fromData.forms.loanInfo[0].customerLoan_type?.index

      var assetsArray = fromData.forms.assestsInfo;

      var spliter = allDataobj.customerInfo[0].customer_location;
      var Latitude = "";
      var Longitudes = "";
      if (spliter != undefined) {
        var spliter2 = spliter.split(",");
        Latitude = spliter2[0];
        Longitudes = spliter2[1];
      }
      // ************ THIS MAP CLEAR ALL IMAGES of assets FROM ARRAY for less load in object

      assetsArray.map((item, index) => {

        finalDataobj.assestsInfo[index].assets_Image = [{ key: 1, activeTab: false, imgName: { value: '', error: false }, imgValue: undefined, }]

      })
      //          // ************ THIS MAP CLEAR ALL IMAGES of assets FROM ARRAY for less load in object

      saveAndUpdate(finalDataobj, date2, cnic, name, user_businessAddress, user_contactNumber, user_address, Latitude, Longitudes, customerType)


    }


  };

  // **************** Recursion for add Document Images ****************

  const saveAndUpdate = (finalDataobj, date, cnic, name, user_businessAddress, user_contactNumber, user_address, Latitude, Longitudes, customerType) => {
    let getter = finalDataobj.guarantorInfo;
    let filterGroupMembers = [];
    let filterNotGroupMembers = [];

    //============== THSI MAP FUCTION MAKE TWO ARRAY OF GURANTORS ONE FOR CUSTOMER OWN ADDED GURANTOR 
    // AND OTHER ONE IS GROUP MEMEBERS ADDED AS A GURANTOR 

    getter.map((checkItem, checkindex) => {
      //console.log("====>checkItem" + checkItem.isGroupMember)
      if (checkItem?.isGroupMember) {
        filterGroupMembers.push(checkItem);

      } else {
        filterNotGroupMembers.push(checkItem)
      }

     
     }
     
    )

      finalDataobj.guarantorInfo = filterNotGroupMembers;
      //console.log("====>filterNotGroupMembers=>" + filterNotGroupMembers.length)
      //console.log("====>filterGroupMembers=>" + filterGroupMembers.length)
  
  
      if (updateCheck.value) {
        setTitle("Updating Customer..")
  
        setProgresss(true)
        finalDataobj.loanInfo[0].loan_customerImage = [{ key: 1, activeTab: false, imgName: { value: '', error: false }, imgValue: undefined, }]
        if (filterGroupMembers.length > 0) {
          recursion_for_Update_Gurantors(filterGroupMembers, filterGroupMembers.length)
        }
  
        UpdateCustomerForms(JSON.stringify(finalDataobj), updateCheck.id, cnic, name, user_businessAddress, user_contactNumber, user_address, customerType)
  
        props.Updatecheck({ value: false, id: "" })
  
      } else {
        setTitle("Adding Customer..")
  
        setProgresss(true)
        finalDataobj.loanInfo[0].loan_customerImage = [{ key: 1, activeTab: false, imgName: { value: '', error: false }, imgValue: undefined, }]
        UpdateCustomerForms(JSON.stringify(finalDataobj),finalDataobj.customerInfo[0].resetId, cnic, name, user_businessAddress, user_contactNumber, user_address, customerType)
  
        // insertCustomerFromData(JSON.stringify(finalDataobj), date, cnic, name, user_businessAddress, user_contactNumber, user_address, customerType, "", JSON.stringify(CustomerAnsReducer), Latitude, Longitudes, "", "0")
        DeleteCustomersFormsTemp();
        dispatch({
          type: 'SET_TempFormReducer',
          payload: ({ value: false, id: null })
        });
      }
  
      // ======================= RESET ALL VALUES =====================
      dispatch({
        type: 'CustomGetDataModule',
        payload: {
          customerInfo: [
            {
              resetId: undefined,
              //-------------------------------Customer immage
              customer_biomatric: undefined,
              customer_img: undefined,
              //-------------------------------Customer  info
              customer_name: { value: '', error: false },
              customer_surname: { value: '', error: false },
              customer_fatherName: { value: '', error: false },
              customer_dob: undefined,
              customer_gender: undefined,
              customer_location: undefined,
              //-------------------------------Customer personal info
              customer_mobileNumber: { value: '', error: false },
              customer_motherName: { value: '', error: false },
              customer_cnicNumber: { value: '', error: false },
              customer_region: undefined,
              customer_cnicissueDate: undefined,
              customer_cnicExpireDate: undefined,
              customer_maritialStatus: undefined,
              FamilyNumber: { value: '', error: false },
              //---------------------------------------Customer Additional info
              customer_religion: undefined,
              customer_houseStatus: undefined,
              customer_houseType: undefined,
              customer_bispBeneficary: undefined,
              customer_userType: undefined,
              customer_guardianceCnic: { value: '', error: false },
              customer_guardianceOf: undefined,
              customer_guardianceOfName: { value: '', error: false },
              customer_education: undefined,
              //-------------------------------------------Customer Kin
              customer_nextKinName: { value: '', error: false },
              customer_nextKinRelation: undefined,
              customer_nextKinCnic: { value: '', error: false },
              customer_nextKinOtherRelation: { value: '', error: false },
  
              //---------------------------------------------Customer Present
              customer_pre_country: { value: 'Pakistan', error: false },
              customer_pre_stateProvince: {value:'',index:''},
              customer_pre_district: {value:'',index:''},
              customer_pre_taluka: {value:'',index:''},
              customer_pre_uc: {value:'',index:''},
              customer_pre_mohalla: { value: '',index:'' },
              customer_pre_city: { value: '', error: false },
              customer_pre_address: { value: '', error: false },
              //-------------------------------Customer permenant
              customer_per_country: { value: 'Pakistan', error: false },
              customer_per_stateProvince: { value: '', index: '' },
              customer_per_district:{value:'',index:''},
              customer_per_taluka: {value:'',index:''},
              customer_per_uc: {value:'',index:''},
              customer_per_mohalla: { value: '',index:'' },
              customer_per_city: { value: '', error: false },
              customer_per_address: { value: '', error: false },
              numberOfyear: { value: '', error: false },
              addressnotes: { value: '', error: false },
  
              customer_isEmployeed: false,
              customer_jobCard: undefined,
              // ********************************Evrisys
              evrisys_customerImage: undefined,
  
              //-------------------------------Supporting Person Undertaking
              customer_supportingPerson_name: { value: '', error: false },
              customer_supportingRequiredPerson_name: { value: '', error: false },
              customer_supportingRequiredPerson_fathername: { value: '', error: false },
              customer_supportingPerson_cnic: { value: '', error: false },
              customer_supportingPerson_relation: { value: '', error: false },
              customer_supportingPerson_fingerprint: undefined,
  
              //--------------------------------Customer Health
              customer_disable: false,
              customer_health: { value: '', error: false },
              customer_physicalHealth: undefined,
              customer_anyillness: undefined,
              customer_disease: undefined,
              customer_token: { value: '', error: false },
              customer_labourtytestintwoyear: undefined,
            },
          ],
          loanInfo: [
            {
              //-----------------------------------Loan info
              customerLoan_type: undefined,
              selectRepaymentFrequency: undefined,
              loanType: undefined,
              loanSubType: undefined,
              loanPercentage: { value: '0', error: false },
              calculatedPercentage: { value: '0', error: false },
              requestedLoan: { value: '0', error: false },
              approvedLoan: { value: '0', error: false },
              numericalValue: { value: '0', error: false }, //my  codde new
              loanTerm: { value: '', error: false },
              loanStatus: { value: 'Processed', index: 0 },
              personalCapitalinBusiness: { value: '', error: false },
              amountRequiredforBusiness: { value: '', error: false },
              expectedMonthlyIncome: { value: '', error: false },
              incomeFromSales: { value: '', error: false },
              rentalIncome: { value: '', error: false },
              monthlyIncome: { value: '', error: false },
              businessAddress: { value: '', error: false },
              businessName: { value: '', error: false },
              experianceinBusiness: { value: '', error: false },
              loanDate: undefined,
              loanNote: { value: '', error: false },
              doyouwantTopupLoan: undefined,
              doyouwantSolarTopupLoan: 0,
              topupLoantype: undefined,
              topupLoanValue: 0,
              topupLoanQty: undefined,
              occupation: { value: '', error: false },
              occupationType: undefined,
              vendorCnic: { value: '', error: false },
              vendorName: { value: '', error: false },
              vendorShopName: { value: '', error: false },
              vendorMobileNumber: { value: '', error: false },
              vendorProductName: { value: '', error: false },
              vendorProductPrice: { value: '', error: false },
              ProductCompanyName: { value: '', error: false },
              vendorCnicImages:[{
                cnicFront:{imgValue:''},
                cnicBack:{imgValue:''},
              }],
              no_of_emploee: { value: '', error: false },
              PersonalJobDepartment: undefined,
              PersonalJobDesignation: { value: '', error: false },
              PersonalLoanJobType: undefined,
              IsAutofinance: "0",
              AutofinanceDefaultPercentage: 0,
              AutofinanceProductPercentage: "0",
              AutofinanceProductPercentagevalue: { value: '0', error: false },
              AutofinanceProductPrice: '',
              IsEbanking:"0",
  
              //--------------------------------Monthly Expenses
              rawMaterialpurchase: { value: '', error: false },
              utilityExpense: { value: '', error: false },
              salariesandLabourCharges: { value: '', error: false },
              otherExpenses: { value: '', error: false },
              monthlyExpenses: { value: '', error: false },
              //-------------------------------------Libailty
              monthlyInstallment: { value: '', error: false },
              anyOtherMonthly: { value: '', error: false },
              liability: { value: '', error: false },
              businessSavings: { value: '', error: false },
  
              //------------------------------------MonthlyHouseHold Income
              incomefromOtherSource: { value: '', error: false },
              otherFamilyIncome: { value: '', error: false },
              anyOtherIncome: { value: '', error: false },
              monthlyHouseholdIncome: { value: '', error: false },
              //---------------------------------MonthlyHouseHold Expense
              kitchenExpense: { value: '', error: false },
              childrenExpense: { value: '', error: false },
              utilityExpenses: { value: '', error: false },
              anyOtherExpenses: { value: '', error: false },
              monthlyHouseholdExpense: { value: '', error: false },
              householdLiability: { value: '', error: false },
              householdSavings: { value: '', error: false },
  
              //---------------------------------------Customer RiskProfile RIsk
  
              geographicrisk: undefined,
              customerandproductrisk: undefined,
              peprisk: undefined,
              loanUtilizationrisk: undefined,
              loanUtilizationriskname: { value: '', error: false },
              loanUtilizationriskfatherHusbandName: { value: '', error: false },
              loanUtilizationriskcnic: { value: '', error: false },
              borrowerriskprofile: 1,
  
              geographicriskRemarks: { value: '', error: false },
              customerandProductriskRemarks: { value: '', error: false },
              pepriskRemakrs: { value: '', error: false },
              loanUtilizationriskRemarks: { value: '', error: false },
              loan_customerImage: [{
                key: 1,
                activeTab: false,
                imgName: { value: '', error: false },
                imgValue: undefined,
                addedBy: '',
              }],

              //---------------------------------------Customer RiskProfile RIsk

              EsmProductRisk: undefined,
              EsmProductItemRisk: undefined,
              EsmProductRiskValue:undefined,
  
              //-------------------------------Poverty card
              questionsno1: undefined,
              questionsno2: undefined,
              questionsno3: undefined,
              questionsno4: undefined,
              questionsno5: undefined,
              questionsno6: undefined,
              questionsno7: undefined,
              questionsno8: undefined,
              questionsno9: undefined,
              questionsno10: undefined,
              questionsno11: undefined,
              questionsno12: undefined,
              questionsno13: undefined,
  
  
  
  
            },
          ],
          assestsInfo: [
            {
              key: 1,
              activeTab: false,
              assetName: { value: '', error: false },
              assetQuantity: { value: '1', error: false },
              assetValue: { value: '', error: false },
              assetOwner: { value: '', error: false },
              assetNote: { value: '', error: false },
              assetTagSize: { value: '', error: false },
              assetTagId: { value: '', error: false },
              assetTagName: { value: undefined, error: false },
              assets_Image: [{
                key: 1,
                activeTab: false,
                imgName: { value: '', error: false },
                imgValue: undefined,
              }],
            },
          ],
          familyMemberInfo: [
            // {
            //   key: 1,
            //   activeTab: false,
            //   familyMember_fullname: { value: '', error: false },
            //   familyMember_cnic: { value: '', error: false },
            //   familyMember_relation: { value: '', error: false },
            //   familyMember_age: { value: '', error: false },
            //   familyMember_education: { value: '', error: false },
            //   familyMember_montlyEarning: { value: '', error: false },
            //   familyMember_sourceIncome: { value: '', error: false },
            //   familyMember_businessAddress: { value: '', error: false },
            //   familyMember_genderSelection: { value: '', error: false },
            // },
          ],
          guarantorInfo: [
            // {
            //   key: 1,
            //   activeTab: false,
            //   guarantor_fullname: { value: '', error: false },
            //   guarantor_cnic: { value: '', error: false },
            //   guarantor_address: { value: '', error: false },
            //   guarantor_contactno: { value: '', error: false },
            //   guarantor_jobDescription: { value: '', error: false },
            //   guarantor_businessAddress: { value: '', error: false },
            //   guarantor_jobType: undefined,
            //   guarantor_businessNote: { value: '', error: false },
            //   guarantor_businessStatus: false,
            //   isGroupMember: false
            // },
          ],
        }
      });
      dispatch({
        type: 'ANSWERARRAY',
        payload: {
          fingerPrint: undefined,
          answerArray: [
            {
              value: 0,
              question: 'چا هي فندر كنهن اهڑي پرابكت جي تياري با سرگرمي یا کاروبار لاء استعمال نیندا. جيكي پاكستان جي قانون و ضابطي يا بين الاقوامی کنوینشتن به معاهدن تحت غیرقانوني چاٹایل آهن؟ چا هي فندز كنهن دواسازي با کاروبار پر اهژین دوائن جیت مار دوائن ہون او زون کي ختر كندر مادي جي تياري. پولي كلر بائفنیل (ذهريلي بو؛ واري مركب) جي تياري يا انهن جي واپار بر استعمال                               ',
              checkedone: 1,
              checkedtwo: 0,
            },
  
            {
              value: 0,
              question: "چا هي فندز كنهن دواسازي با کاروبار پر اهژین دوائن جیت مار دوائن ہون او زون کي ختر كندر مادي جي تياري. پولي كلر بائفنیل (ذهريلي بو؛ واري مركب) جي تياري يا انهن جي واپار بر استعمال كيا ويندا. جيكي عالمي سطح تي خارج قرار ڈنل یا پابندي مرهيل آهن؟",
              checkedone: 1,
              checkedtwo: 0,
            },
            {
              value: 0,
              question: 'چا هي فند اهژي جهنگلي جيوت جي واپار یا ان جي مصنوعات لاء استعمال نیندا. جيكي خطري هيث آیل نسلن جي واپار بابت عالمی کنوینشن جي ضابطن هیث آندل آهن؟',
              checkedone: 1,
              checkedtwo: 0,
            },
            {
              value: 0,
              question: 'چا هي فند هشیارن ؟ گولا بارود جي تياري، بر استعمال نیندا؟',
              checkedone: 1,
              checkedtwo: 0,
            },
            {
              value: 0,
              question: ' چاهي فندز الكوحل وارن شربتن شر ابن جي تياري یا واپار تي خرچ كيا ويندا؟',
              checkedone: 1,
              checkedtwo: 0,
            },
            {
              value: 0,
              question: 'چا هي فندز تماك جې پیداوار یا واپار لاء استمال نیندا؟',
              checkedone: 1,
              checkedtwo: 0,
            },
            {
              value: 0,
              question: ' چا هي فندز جويا جي اذن و اهري قسم جي كاروباري ادارن لاء استعمال نیندا؟',
              checkedone: 1,
              checkedtwo: 0,
            },
            {
              value: 0,
              question: 'ما هي فندز تابکار مدادي جي تياري یا واپار لاء استعمال تیندا (اهو طبي ساز و سامان، معیاري ضابطن جي پرک واري سامان توژي پئي جنهن سامان جي خريداري، تي لاگو نئو نئي، جتي تابکاري، چې سببن کی معمولی یا مناسب طور تي بال طور سمجهيو وچی ثو؟ ',
              checkedone: 1,
              checkedtwo: 0,
            },
            {
              value: 0,
              question: 'چا هي فندز ردي يا ردي، مان تیار ئیل سامان جي سرحد پار و اپار لاوم باسل کنوینشن ؟ بنیادی ضابطن تي عمل كرن کانسواء استعمال كيا ويندا؟ ',
              checkedone: 1,
              checkedtwo: 0,
            },
            {
              value: 0,
              question: 'چا هي فندز ایسبیتس (نہ گرندژ) کلیل فائبر، ریشن جي پیداوار یا واپار لاء استعمال نیندا؟',
              checkedone: 1,
              checkedtwo: 0,
            },
            {
              value: 0,
              question: 'چا هي فندز غیر مستحضر ماهیگیري، جي طريقن لاء استعمال نیندا، جهراوي بجلي جي جهنكن. ذماكیدار مواد یا سامو ندي ماحول پر ادائي كلومیٹر کان بگھو م سنهو چار استعمال كرن؟',
              checkedone: 1,
              checkedtwo: 0,
            },
            {
              value: 0,
              question: 'جا هي فند غیر منظم / قدرتي پيلن مان كان وبن یا ان مان سامان جي تياري با آن چي کاروبار لاء استعمال نیندا؟',
              checkedone: 1,
              checkedtwo: 0,
            },
            {
              value: 0,
              question: 'چاهی فندر جبري پورهئی یا نقصانكار و استحصالی صورت و ارین پیداواری سرگرمین لاء استعمال نیندا؟',
              checkedone: 1,
              checkedtwo: 0,
            },
            {
              value: 0,
              question: 'چاهي فئېز اهڑی زمین حاصل كرن جي سرگرمين یا پابندي، باوجود اهڑی زمین استعمال كرن لاء خرچ كيا ويندا. جنهن جي نتيجي بر لذپلان تئي بیا معاشي مسئلا پيدا ثين؟',
              checkedone: 1,
              checkedtwo: 0,
            },
            {
              value: 0,
              question: 'چا هي فندز كن اهترین سرگرمين جي استعمال نیندا. جن سان خاص حیثیت وارن قدرتي و خاص ماگن ء تكائن جي حيثيت ہر گھنائي يا تبديلي شامل هجي يا قانوني طور محفوظ قرار ڈنل علائقي مر اهلي كا سرگرمي هجي؟',
              serialNo: 1,
              checkedone: 1,
              checkedtwo: 0,
            },
            {
              value: 0,
              question: 'چا فندر جو استعمال خطرناك كيميكلز جي خاص مقدار پر تیاري، واپار، ذخیرہ اندوزي، یا چرپر یا نقصانكار كيميكلز (پیٹرول، گاسلیت پین پیٹرولیم شین, تیكسٹائل رنگن و غیره) جي واپاري پيماني تي استعمال لاء كيو ويندو؟',
              serialNo: 1,
              checkedone: 1,
              checkedtwo: 0,
            },
            {
              value: 0,
              question: 'چا هي فندز اهزي پیداوار یا سرگرمین لاو استمال كيا ويندا. جن جي نتيجي بر مقامي مائهن جي  لذپلان ئي، سندن زمین، قدرتي وسيلن، اهر ثقافتي ورثي و استعمال هين رهندز روایتي ملكيتن تي منفي اثر پوي؟ ',
              serialNo: 1,
              checkedone: 1,
              checkedtwo: 0,
            },
            {
              value: 0,
              question: 'چا هي فندز اهزي پیداوار یا سرگرمین لاو استمال كيا ويندا. جن جي نتيجي بر مقامي مائهن جي  لذپلان ئي، سندن زمین، قدرتي وسيلن، اهر ثقافتي ورثي و استعمال هين رهندز روایتي ملكيتن تي منفي اثر پوي؟',
              serialNo: 1,
              checkedone: 1,
              checkedtwo: 0,
            },
            {
              value: 0,
              question: 'چا هي فندز گري ختر نہ نیندڑ پیکنگ مٹیریل جهزوك استير وفور ؛ پلاستك جي تيلهين جي تياري اه ا ء واپار لاو استعمال نیندا؟',
              serialNo: 1,
              checkedone: 1,
              checkedtwo: 0,
            },
          ]
        }
      });
      // ======================= RESET ALL VALUES =====================
      setProgresss(false)
  
      props.onPressNext();
  
      props.UpdateUserData([])
      if (updateCheckTemp) {
        navigation.replace('Drawer', { userData: UserData, station: StationReducer.station });
      } else {
  
        navigation.goBack();
      }
  
    
    

  }

  const _onClickNext = () => {

    var fullnameerror = true;

    var cnincerror = true;

    var relationerror = true;

    var ageerror = true;

    var eduerror = true;

    var monthlyerror = true;

    var souceincomerror = true;

    var gendererror = true;



    for (let i = 0; i < DataArray.length; i++) {

      if (DataArray[i].guarantor_fullname.value == '') {

        let get = allDataobj;

        get.guarantorInfo[i].guarantor_fullname.error = true;

        get.guarantorInfo[i].activeTab = true;

        setAlldataobj({ ...get });

        fullnameerror = false;

      } else {

        let get = allDataobj;

        get.guarantorInfo[i].guarantor_fullname.error = false;

        setAlldataobj({ ...get });
      }

      if (DataArray[i].guarantor_cnic.value == '') {

        let get = allDataobj;

        get.guarantorInfo[i].guarantor_cnic.error = true;

        get.guarantorInfo[i].activeTab = true;


        setAlldataobj({ ...get });

        cnincerror = false;

      } else {

        let get = allDataobj;

        get.guarantorInfo[i].guarantor_cnic.error = false;

        setAlldataobj({ ...get });

      }

      if (DataArray[i].guarantor_cnic.value.length < 15 || DataArray[i].guarantor_cnic.value == "00000-0000000-0") {

        let get = allDataobj;

        get.guarantorInfo[i].guarantor_cnic.error = true;

        get.guarantorInfo[i].activeTab = true;

        setAlldataobj({ ...get });

        setToast({

          type: "error",

          message: 'Please put valid Cnic Number',

        });

        cnincerror = false;

      } else {

        let get = allDataobj;

        get.guarantorInfo[i].guarantor_cnic.error = false;

        setAlldataobj({ ...get });
      }

      if (DataArray[i].guarantor_address.value == '') {

        let get = allDataobj;

        get.guarantorInfo[i].guarantor_address.error = true;

        get.guarantorInfo[i].activeTab = true;

        setAlldataobj({ ...get });

        relationerror = false;

      } else {

        let get = allDataobj;

        get.guarantorInfo[i].guarantor_address.error = false;

        setAlldataobj({ ...get });
      }

      if (DataArray[i].guarantor_contactno.value == '') {

        let get = allDataobj;

        get.guarantorInfo[i].guarantor_contactno.error = true;

        get.guarantorInfo[i].activeTab = true;

        setAlldataobj({ ...get });

        ageerror = false;

      } else {

        let get = allDataobj;

        get.guarantorInfo[i].guarantor_contactno.error = false;

        setAlldataobj({ ...get });
      }

      if (DataArray[i].guarantor_jobType == undefined) {

        let get = allDataobj;

        get.guarantorInfo[i].activeTab = true;

        setToast({

          type: "error",

          message: 'Select Gurantor job type',

        });

        setAlldataobj({ ...get });

        eduerror = false;

      } else if (DataArray[i].guarantor_jobType == "Select Job Type") {

        let get = allDataobj;

        get.guarantorInfo[i].activeTab = true;

        setToast({

          type: "error",

          message: 'Select Gurantor job type',

        });

        setAlldataobj({ ...get });

        eduerror = false;


      } else {

        let get = allDataobj;

        setAlldataobj({ ...get });

      }



    }
    if (

      fullnameerror &&

      cnincerror &&

      relationerror &&

      ageerror &&

      eduerror &&

      monthlyerror &&

      souceincomerror &&

      gendererror

    ) {


      var finalDataobj = fromData.forms;

      finalDataobj.guarantorInfo = DataArray;

      if (finalDataobj.loanInfo[0].customerLoan_type.value != "Normal" && DataArray.length == 0) {
        setToast({

          type: "error",

          message: "You need to add at least one Gurantor",

        });
        return
      }
      // console.log( fromData.forms.customerInfo[0].evrisys_customerImage)
      // return

      props.UpdateUserData(finalDataobj)

      var date = moment().format('LLL');

      var cnic = fromData.forms.customerInfo[0].customer_cnicNumber.value;

      var name = fromData.forms.customerInfo[0].customer_name.value;

      var user_contactNumber = fromData.forms.customerInfo[0].customer_mobileNumber.value;

      var user_businessAddress = fromData.forms.loanInfo[0].businessAddress.value

      var user_address = fromData.forms.customerInfo[0].customer_pre_address.value

      var documentsArray = fromData.forms.loanInfo[0].loan_customerImage;

      var assetsArray = fromData.forms.assestsInfo;


      //console.log("--->DOcuments lemngth", documentsArray.length)

      //console.log("--->assetsArray lemngth", assetsArray.length)


      // ======================= Checking CNIC is update of not =====================
      if (updateCheck.value) {

        let allData = props.user_cnic;

        if (allData != cnic) {

          setProgresss(true)

          setTitle("Updating Customer..")

          DeleteDocImages(allData).then((values) => {

            DeleteAssetsImages(allData).then(() => {
              getGroupsFromsforMembers(setProgresss, allData, cnic)

                .then((value) => {
                  UpdateGroupGurantorsCNIC(cnic, allData).then(() => {
                    console.log("member update in Gurantos table")
                    if (documentsArray.length > 0) {

                      setProgresss(true)


                      setTitle("Updating Customer..")

                      DeleteDocImages(cnic).then((values) => {

                        recursionForAddDocuments(cnic, date, documentsArray.length, documentsArray)
                      })


                    }
                  })


                }).catch((error) => {
                  //console.log("--->Error", error)
                })
            })
          })

        }
        else {

          if (documentsArray.length > 0) {

            setProgresss(true)

            setTitle("Updating Customer..")

            DeleteDocImages(cnic).then((values) => {

              recursionForAddDocuments(cnic, date, documentsArray.length, documentsArray)

            })

          }
        }
      }
      else {
        if (documentsArray.length > 0) {

          setProgresss(true)
          setTitle("Adding Customer..")

          setProgresss(true)

          recursionForAddDocuments(cnic, date, documentsArray.length, documentsArray)
          return
          getCustomerFromsbyCnicforchecking(setProgresss, cnic).then((values) => {

            if (values > 0) {
              setToast({

                type: "error",

                message: 'Please change CNIC Number, this one is already in use',

              });

              return
            } else {
              setTitle("Adding Customer..")

              setProgresss(true)

              recursionForAddDocuments(cnic, date, documentsArray.length, documentsArray)
            }

          }).catch((error) => {

            setProgresss(false)

            Alert.alert("Sorry!", "" + error)

          })



        }else{
          setProgresss(false)
          setToast({

            type: "error",

            message: 'Documenst are required',

          });
        }
      }

      // ======================= Checking CNIC is update of not =====================

      //  alert(JSON.stringify(name))



    }
  };
  const _deleteRow = (item, index) => {
    var finalDataobj = fromData.forms;
    console.log("===>", finalDataobj.loanInfo[0].customerLoan_type.value)
    if (item.item.isGroupMember) {
      setToast({

        type: "error",

        message: "You cannot delete Group Memeber Gurantor",

      });
      return
    }
    // return
    index[item.item.key].closeRow()
    // let get = allDataobj;
    // get.assestsInfo[item.index].activeTab = false;
    // setAlldataobj({...get});

    let get2 = allDataobj;
    get2.guarantorInfo.splice(item.index, 1);
    setAlldataobj({ ...get2 });

  }
  const renderItem = ({ item, index }) => (


    <View style={[styles.box, { marginBottom: index == DataArray.length - 1 ? 10 : 0 }]}>

      <Pressable onPressIn={() => {

        let get = allDataobj;

        get.guarantorInfo[index].activeTab = get.guarantorInfo[index].activeTab

          ? false

          : true;

        setAlldataobj({ ...get });

      }} style={styles.buttomheader}>

        <TextView type={'Light'} text="Guaranteer Information" style={{ color: Colors.white }}></TextView>

        <Pressable onPressIn={() => {

          let get = allDataobj;

          get.guarantorInfo[index].activeTab = get.guarantorInfo[index].activeTab

            ? false

            : true;

          setAlldataobj({ ...get });

        }}>

          {item.activeTab ?

            <MaterialCommunityIcons name="minus" color={Colors.white} size={26}></MaterialCommunityIcons>

            :

            <MaterialCommunityIcons name="plus" color={Colors.white} size={26}></MaterialCommunityIcons>


          }

        </Pressable>

      </Pressable>


      {item.activeTab &&

        <View style={styles.bounceview}>

          <View style={styles.row2}>

            <FormInputs text={'Full Name'}

              required={true}

              error={item.guarantor_fullname.error}

              value={item.guarantor_fullname.value}

              onChangeText={(value: string) => {
                if (!regex.test(value)) {
                  return
                }
                let get = allDataobj;

                get.guarantorInfo[index].guarantor_fullname.value = value;

                setAlldataobj({ ...get });

              }}

            ></FormInputs>


            <FormInputs keyboardtype={'number-pad'}

              text={'CNIC Number'}

              required={true}

              error={item.guarantor_cnic.error}

              value={item.guarantor_cnic.value}

              onChangeText={(value: string) => {
                if (speacial.test(value)) {
                  return
                }
                if (item.isGroupMember) {
                  setToast({ message: "Sorry You cannot edit Group Member Gurantor CNIC Number" })
                  return
                }
                var regexp = new RegExp('^[0-9+]{5}-[0-9+]{7}-[0-9]{1}$');

                if (value.length < 16) {

                  if (value.length == 5 || value.length == 13) {

                    let get = allDataobj;

                    get.guarantorInfo[index].guarantor_cnic.value = value + '-';

                    get.guarantorInfo[index].guarantor_cnic.error = !regexp.test(value) ? true : false

                    setAlldataobj({ ...get });
                  } else {

                    let get = allDataobj;

                    get.guarantorInfo[index].guarantor_cnic.value = value;

                    get.guarantorInfo[index].guarantor_cnic.error = !regexp.test(value) ? true : false

                    setAlldataobj({ ...get });
                  }
                }
                // --------------------

              }}

              clearDataButton={true}

              clearText={() => {
                let get = allDataobj;
                get.guarantorInfo[index].guarantor_cnic.value = ""

                setAlldataobj({ ...get });
              }}
            ></FormInputs>

          </View>

          <View style={styles.row2}>

            <FormInputs text={'Address'}

              required={true}

              error={item.guarantor_address.error}

              value={item.guarantor_address.value}

              onChangeText={(value: string) => {

                let get = allDataobj;

                get.guarantorInfo[index].guarantor_address.value = value;

                setAlldataobj({ ...get });

              }}

            ></FormInputs>

            <FormInputs keyboardtype={'number-pad'}

              text={'Contact Number'}

              maxLength={11}

              required={true}
              clearDataButton={true}
              clearText={() => {
                let get = allDataobj;
                get.guarantorInfo[
                  index
                ].guarantor_contactno.value = "";

                setAlldataobj({ ...get });
              }}
              error={item.guarantor_contactno.error}

              value={item.guarantor_contactno.value}

              onChangeText={(value: string) => {
                // let regexp = new RegExp('^[0-9+]{4}-[0-9+]{7}$');
                // if (value.length == 4) {
                //   let get = allDataobj;
                //   get.guarantorInfo[
                //     index
                //   ].guarantor_contactno.value = value + '-';

                //   get.guarantorInfo[
                //     index
                //   ].guarantor_contactno.error = !regexp.test(value) ? true : false
                //   setAlldataobj({ ...get });
                // } else {
                  let get = allDataobj;

                  get.guarantorInfo[index].guarantor_contactno.value = value;
                  get.guarantorInfo[index].guarantor_contactno.error = false
                  
                  // get.guarantorInfo[index].guarantor_contactno.error = !regexp.test(value) ? true : false


                  setAlldataobj({ ...get });
                // }


              }}

            ></FormInputs>

          </View>

          <View style={styles.row2}>

            <FormInputs text={'Job Description'}

              error={item.guarantor_jobDescription.error}

              value={item.guarantor_jobDescription.value}

              onChangeText={(value: string) => {

                if(!numericandAlphabets.test(value)){
                return
                }

                let get = allDataobj;

                get.guarantorInfo[index].guarantor_jobDescription.value = value;

                setAlldataobj({ ...get });

              }}

            ></FormInputs>

            <FormInputs text={'Business Address'}

              error={item.guarantor_businessAddress.error}

              value={item.guarantor_businessAddress.value}

              onChangeText={(value: string) => {

                let get = allDataobj;

                get.guarantorInfo[index].guarantor_businessAddress.value = value;

                setAlldataobj({ ...get });

              }}

            ></FormInputs>

          </View>

          <View style={styles.row2}>

            <CustomDropdown

              text={"Job Type"}

              required={true}

              tempdata={jobType}

              label={

                item.guarantor_jobType ==

                  undefined

                  ? 'Job Type'

                  : item.guarantor_jobType.value

              }

              onSelect={async (value, underindex) => {

                let get = allDataobj;

                get.guarantorInfo[index].guarantor_jobType = { value: jobType[underindex], index: underindex }

                setAlldataobj({ ...get });

              }}

            />

            <FormInputs text={'Notes'}

              error={item.guarantor_businessNote.error}

              value={item.guarantor_businessNote.value}

              onChangeText={(value: string) => {
                if(!numericandAlphabets.test(value)){
                  return
                  }
                let get = allDataobj;

                get.guarantorInfo[index].guarantor_businessNote.value = value;

                setAlldataobj({ ...get });

              }}

            ></FormInputs>

          </View>
          <View style={styles.row2}>
            {/* 
            <View style={{ flexDirection: "row", alignItems: 'center', marginTop: 10, marginBottom: 10, marginLeft: 10 }}>
              <Checkbox
                color={Colors.parrotGreenColor}
                status={item.guarantor_businessStatus ? 'checked' : 'unchecked'}
                onPress={() => {
                  let get = allDataobj;
                  get.guarantorInfo[index].guarantor_businessStatus =
                    checkedforDisable ? false : true;
                  setAlldataobj({ ...get });
                  setCheckedforDisable(!checkedforDisable);
                }}
              />
              <TextView
                style={{ marginLeft: 10 }}
                type={'small'}
                text={"Business Status"}></TextView>
            </View> */}


          </View>
        </View>
      }



    </View>


  );
  const recursion_for_Update_Gurantors = (memebers, fromNumber) => {
    UpdateGroupGurantors(
      memebers[fromNumber - 1].guarantor_fullname.value,
      memebers[fromNumber - 1].guarantor_businessNote.value,
      memebers[fromNumber - 1].guarantor_jobType.value,
      memebers[fromNumber - 1].guarantor_businessStatus,
      memebers[fromNumber - 1].guarantor_cnic.value,
      memebers[fromNumber - 1].guarantor_address.value,
      memebers[fromNumber - 1].guarantor_contactno.value,
      memebers[fromNumber - 1].guarantor_jobDescription.value,
      memebers[fromNumber - 1].guarantor_businessAddress.value,
      memebers[fromNumber - 1].key,
    ).then(() => {
      let nextnumber = fromNumber - 1;
      if (nextnumber > 0) {
        recursion_for_Update_Gurantors(memebers, nextnumber)
      } else {

      }
    }).catch(() => {

    })
  }

  return (
    <SafeAreaView>
      <ScrollView showsVerticalScrollIndicator={false}>
        <KeyboardAvoidingView behavior='padding'>

          <View>

            <View
              style={{
                marginRight: 10,
                marginTop: 4,
                marginLeft: 10,
                justifyContent: 'space-between',
                flexDirection: 'row',
                alignItems: 'center',
              }}>
              <View>

                <TextView text={""} style={{}}></TextView>
              </View>
              {UserData != undefined && UserData.UserData.EmployeeTypeName != "Branch Manager" && <Pressable onPressIn={_addNewAssets}>

                <View style={[GlobalStyles.row, styles.addnewButton]}>
                  <MaterialCommunityIcons
                    name="plus"
                    size={26}></MaterialCommunityIcons>
                  {/* <View
                style={}>
                <TextView type="small" style={{textAlign: 'center'}} text="New Asset"></TextView>
              </View> */}
                </View>
              </Pressable>}

            </View>

            <SwipeListView
              style={{ marginBottom: 0 }}
              data={DataArray}
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
                      onPress={() => _deleteRow(item, index)}
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
            <BottomButton
              onPressNext={_onClickNext}
              onPressPrev={props.onPressPrev}
              show={updateCheck.value ? 4 : 3}
            ></BottomButton>
          </View>

        </KeyboardAvoidingView>
      </ScrollView>
      <Toast {...toast} onDismiss={() => setToast({ message: "", type: "" })} />
      <CustomProgressDialoge
        dialogVisible={progress}
        setDialogVisible={setProgresss}
        title={title}
      />
    </SafeAreaView>
  );
};
const mapDispatchToProps = (dispatch) => {
  return {
    UpdateUserData: (Data) => {
      dispatch({
        type: 'FORM',
        payload: Data
      });
    },
    Updatecheck: (Data) => {
      dispatch({
        type: 'SET_UPDATECHECK',
        payload: Data
      });
    },

  };
};

export default connect(null, mapDispatchToProps)(memo(Guaranteer));
const styles = StyleSheet.create({
  row2: { marginTop: 0,  flexDirection: 'row',  alignItems: 'center', justifyContent: 'space-between',   },
  addnewButton: {  backgroundColor: '#FFF',  height: 40,  elevation: 15,  width: 50,  borderRadius: 10, justifyContent: 'center',  },
  text: {},
  bounceview: GlobalStyles.bounceview,
  buttomheader: GlobalStyles.buttomheader,
  box: GlobalStyles.box
});
