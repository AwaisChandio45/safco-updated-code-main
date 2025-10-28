import React, { useState, memo, useRef } from 'react';
import type { Node } from 'react';
import {
  View,
  Pressable,
  KeyboardAvoidingView,
  Dimensions,
  ScrollView,
  Alert,
  Image,
  TouchableOpacity,
  StyleSheet,
  Modal,
  PermissionsAndroid,
  Text,
  SafeAreaView,
} from 'react-native';
import RNAndroidLocationEnabler from 'react-native-android-location-enabler';
import { getCurrentLocation } from '../../utilis/Locationgetter';

import RNFS from 'react-native-fs';
import Camera from 'react-native-camera';
import {
  DateSelector,
  FormInputs,
  BottomButton,
  CustomRadio,
  TextView,
  CnicInputoptions,
  BarcodeScreen,
  QrcodeScreen,
  CustomDropdown,
  CustomProgressDialoge,
  Nodata,
} from '../../components';
import { Checkbox } from 'react-native-paper';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import * as Animatable from 'react-native-animatable';
import Dropdownlist from '../../components/Dropdownlist';
const { height, width } = Dimensions.get('window');
import { NativeModules } from 'react-native';
const { FingerModule } = NativeModules;
import ImagePicker from 'react-native-image-crop-picker';
import SelectPhotosDialoge from '../../components/SelectPhotosDialoge';
import { Colors, GlobalStyles } from '../../theme';
import {
  Regions,
  Religion,
  HouseStatus,
  HouseType,
  Benificary,
  UserType,
  EducationList,
  KinArray,
  PhysicalHealth,
  FoundIllness,
  ClientDisease,
  LabourtyTest,
} from '../../utilis/RequiredArrays';
import moment from 'moment';
import { useSelector, useDispatch, connect } from 'react-redux';
import Toast from '../../components/Toast';
import Geolocation from '@react-native-community/geolocation';
import values from 'core-js/fn/array/values';
import { checkingCustomerByCnic, getCustomerImages, getEmployeesRegionArray, insertAndDeleteTempForms, insertCustomerFromDataWithRow, insertCustomerImages, updateCustomerFromDataWithRow, updateCustomerFromDataWithRowAndCustomerAwnsers, updateCustomerImages, updateCustomerImagesfromCustomersPage } from '../../sqlite/sqlitedb';
import { getOrganizationArray, getFingerPrintFromDevice } from '../../sqlite/sqlitedb';
import ZoomableImage from '../../components/ZoomableImage';
import { RadioButton } from 'react-native-paper';


const Customerinfo: () => Node = props => {

  const array_index = 0;
  var regionId = 2;
  const dispatch = useDispatch();
  const UpdateReducer = useSelector(state => state.UpdateReducer);
  const TempFormReducer = useSelector(state => state.TempFormReducer);
  const CustomerAnsReducer = useSelector((state) => state.CustomerAnsReducer.answerArray);
  const UserLocation = useSelector(state => state.UserLocation.UserLocation);
  const EmpRegionsReducer = useSelector(state => state.EmpRegionsReducer.regions);
  const [customerLocation, setCustomerLocation] = React.useState(undefined);
  const [cnicUpdatefor, setCninupdatefor] = React.useState(0)
  var updateCheck = UpdateReducer.updateCheck.value;
  var updateCheckTemp = TempFormReducer.tempForm.value;
  const [isLoading, setLoading] = React.useState(false);
  // const forms = useSelector((state) => state.forms);
  // console.log('EmpRegionsReducer', EmpRegionsReducer);
  const CustomGetDataModule = useSelector(state => state.RequiredReducer.CustomGetDataModule);
  const [regions, setRegions] = React.useState(EmpRegionsReducer);
  const [religion, setReligion] = React.useState(Religion);
  const [houseStatus, setHouseStatus] = React.useState(HouseStatus);
  const [houseType, setHouseType] = React.useState(HouseType);
  const [isBenificary, setBenificary] = React.useState(Benificary);
  const [userType, setUsertype] = React.useState(UserType);
  const [kinRelation, setKinRelation] = React.useState(KinArray);
  const [physicalHealth, setPhysicalHealth] = React.useState(PhysicalHealth);
  const [foundIllness, setFoundIllness] = React.useState(FoundIllness);
  const [clientdisease, setClientDisease] = React.useState(ClientDisease);
  const [laboratoryTest, setLaboratoryTest] = React.useState(LabourtyTest);
  const [education, setEducation] = React.useState(EducationList);
  const [allDataobj, setAlldataobj] = React.useState(
    updateCheck ? props.item : updateCheckTemp ? props.item : CustomGetDataModule,
  );
  const Data =
    allDataobj != undefined
      ? allDataobj.customerInfo[array_index]
      : CustomGetDataModule.customerInfo[array_index];
      //console.log('customer data------>>>>>>>',Data)
  const [getImage, setImage] = React.useState('');
  const [DOBvalue, setDOB] = React.useState('');
  const [getFingerImage, setFingerImage] = React.useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [dialoge, setDialoge] = React.useState(false);
  const [checkedforAddress, setCheckedAddress] = React.useState(false);
  const [checkedforDisable, setCheckedforDisable] = React.useState(false);
  const [activeTab, setActiveTab] = React.useState(4);
  const [torchOn, setTorchOn] = React.useState(false);
  const [QrcodeOn, setQrcodeOn] = React.useState(false);
  const [editable, setEditable] = React.useState(false);
  const [noData, setNoData] = React.useState(false)
  const [organizationRegions, setOrganizationRegions] = React.useState({})
  const [getRegions, setGetRegions] = React.useState([])
  const [districts, setDistricts] = React.useState([])
  const [taluka, setTaluka] = React.useState([])
  const [uc, setUc] = React.useState([])
  const [mohalla, setMohalla] = React.useState([])
  const [IsEbanking, setIsEbanking] = React.useState(props.isEbanking)
  const [ebankingData, setEbankingData] = React.useState(props.ebankingData)
  // console.log("Data.ok.value =-=-=-=-=?>>",allDataobj )
  React.useEffect(() => {


    getOrganizationArray(setNoData).then(async (e) => {
      // console.log(e)
      setGetRegions(e)

      let setRegions = e.filter(selProvinces);

      setOrganizationRegions(setRegions)


    });
    //  console.log("---->IsEbanking",allDataobj);
    // console.log("---->IsEbankingData",ebankingData);
    // alert(JSON.stringify(props.fingerPrint))
    if (props.fingerPrint != undefined) {
      let get = allDataobj;
      get.customerInfo[array_index].customer_biomatric = props.fingerPrint;
      setAlldataobj({ ...get })
    }
    setEbankingCustomerData(IsEbanking, ebankingData)
  }, [])
  //This function add characters between strings
  String.prototype.insert = function (index, string) {
    if (index > 0) {
      return this.substring(0, index) + string + this.substr(index);
    }

    return string + this;
  };

  const setEbankingCustomerData = async (check, value) => {
    if (value != undefined) {
      if (check == "1") {
        let get = allDataobj;
        get.customerInfo[array_index].customer_cnicNumber.value = value?.NICNumber
        get.customerInfo[array_index].customer_name.value = value?.FirstName + " " + value?.LastName
        get.customerInfo[array_index].customer_gender = value?.Gender == "M" ? "Male" : "Female"
        get.customerInfo[array_index].customer_mobileNumber.value = value?.MobileNumber.insert(4, "-")
        get.loanInfo[array_index].IsEbanking = "1"
        setAlldataobj({ ...get })

      }
    }
  }



  function selProvinces(reg) {

    return reg.RegionTypeId == 2;

  }
  function selDistricts(reg) {

    return reg.RegionParentId == regionId;

  }

  const [toast, setToast] = useState({ value: "", type: "" });
  var regex = /^[a-zA-Z ]*$/;
  let speacial = /[^a-zA-Z0-9-]/g;
  var numericandAlphabets = new RegExp(/^[a-zA-Z0-9 ]+$/);

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
  const _customerTab9 = () => {
    if (activeTab == 9) {
      setActiveTab(0);
    } else {
      setActiveTab(9);
    }
  };
  const _customerTab10 = () => {
    if (activeTab == 10) {
      setActiveTab(0);
    } else {
      setActiveTab(10);
    }
  };
  const _fingerPrint = async (value) => {

    try {

      const eventId = await FingerModule.showToast();

      var parser = JSON.parse(eventId);

      //console.log(`Created a new event with id ${eventId}`);
      // var data = await RNFS.readFile(eventId, 'base64')
      // var temp=`data:image/gif;base64,${encodedBase64}`
      // setFingerImage(parser.imageValue);
      if (value == 1) {
        let get = allDataobj;

        get.customerInfo[array_index].customer_biomatric = parser;


        setAlldataobj({ ...get });
      } else if (value == 2) {
        let get = allDataobj;

        get.customerInfo[array_index].customer_supportingPerson_fingerprint = parser;

        setAlldataobj({ ...get });

      }

      // setTemp(parser.imageTemp)
    } catch (e) {
      // console.error(e);
    }
  };
  const _resetDevices = async (value) => {
    await FingerModule.resetDevice();
    if (value == 1) {
      let get = allDataobj;

      get.customerInfo[array_index].customer_biomatric = undefined;


      setAlldataobj({ ...get });
    } else if (value == 2) {
      let get = allDataobj;

      get.customerInfo[array_index].customer_supportingPerson_fingerprint = undefined;

      setAlldataobj({ ...get });

    }
  };
  const _openGallery = async () => {
    onDialoge();
  };
  const onDialoge = () => {
    setDialoge(true);
  };
  const closeDialog = () => {
    setDialoge(false);
  };
  const takePhoto = i => {
    setDialoge(false);
    ImagePicker.openCamera({
      width: 300,
      height: 400,
      compressImageQuality: 0.5,
      cropping: false,
    }).then(async (image) => {
      let get = allDataobj;
      var data = await RNFS.readFile(image.path, 'base64').then(res => { return res });
      get.customerInfo[array_index].customer_img = data;
      // alert(JSON.stringify(data))
      setAlldataobj(get);
      setImage(data);
    }).catch((e) => {
      console.log(e)
    });
  };

  const takePhotoforJobCard = i => {

    ImagePicker.openCamera({
      width: 300,
      height: 400,
      compressImageQuality: 0.5,
      cropping: false,
    }).then(async (image) => {
      let get = allDataobj;
      var data = await RNFS.readFile(image.path, 'base64').then(res => { return res });
      get.customerInfo[array_index].customer_jobCard = data;
      setAlldataobj({ ...get });
    });
  };


  //this methode is getting image from gallery
  const takePhotofromGallery = () => {
    setDialoge(false);
    ImagePicker.openPicker({
      width: 300,
      height: 400,
      cropping: false,
    }).then(async (image) => {
      var data = await RNFS.readFile(image.path, 'base64').then(res => { return res });
      let get = allDataobj;
      get.customerInfo[array_index].customer_img = data;
      setAlldataobj({ ...get });
      setImage(data);
    });
  };

  const pickImges = () => {
    takePhotofromGallery();
  };
  const capture = () => {
    takePhoto();
  };
  const _onClickNext = () => {
    if (updateCheck == false && allDataobj.customerInfo[array_index].customer_location == undefined) {
      setToast({ message: "Please Turn on your Location.", type: "error" })
      requestLocationPermission();
      return
      
    }
    // for fingureprint condition
    
    else if (Data.customer_biomatric == undefined) {
        setActiveTab(4);
        setToast({
            type: "error",
            message: "Please do Bio Matric first!",
          });
          return
        }
    // for fingureprint condition end 
    
        var date1: any = new Date(Data.customer_cnicissueDate?.replace(/\//g, "-"));
        const date2: any = new Date(Data.customer_cnicExpireDate?.replace(/\//g, "-"));
        //current date=
        const date3: any = new Date()
        //console.log(moment.duration(date2 - date1).years());
        const diffDays = moment.duration(date2 - date1).years();
        var getExpirance = Number(Data.numberOfyear.value);
        if (allDataobj.customerInfo[array_index].transferType === "IBFT") {
          if (allDataobj.customerInfo[array_index].accountNumber.value === "") {
            setActiveTab(10); // Update tab to 10 where IBFT related fields are located
            let get = allDataobj;
            get.customerInfo[array_index].accountNumber.error = true;
            setAlldataobj({ ...get });
            setToast({
              type: "error",
              message: "Account Number is required",
            });
            return;
          } else if (allDataobj.customerInfo[array_index].accountType.value === "") {
            setActiveTab(10); // Update tab to 10
            let get = allDataobj;
            get.customerInfo[array_index].accountType.error = true;
            setAlldataobj({ ...get });
            setToast({
              type: "error",
              message: "Account Type is required",
            });
            return;
          } else if (allDataobj.customerInfo[array_index].accountTitle.value === "") {
            setActiveTab(10); // Update tab to 10
            let get = allDataobj;
            get.customerInfo[array_index].accountTitle.error = true;
            setAlldataobj({ ...get });
            setToast({
              type: "error",
              message: "Account Title is required",
            });
            return;
          } else if (allDataobj.customerInfo[array_index].bankName.value === "") {
            setActiveTab(10); // Update tab to 10
            let get = allDataobj;
            get.customerInfo[array_index].bankName.error = true;
            setAlldataobj({ ...get });
            setToast({
              type: "error",
              message: "Bank Name is required",
            });
            return;
          }else if (allDataobj.customerInfo[array_index].branchName.value === "") {
            setActiveTab(10); // Update tab to 10
            let get = allDataobj;
            get.customerInfo[array_index].branchName.error = true;
            setAlldataobj({ ...get });
            setToast({
              type: "error",
              message: "Branch Name is required",
            });
            return;
          }else if (allDataobj.customerInfo[array_index].bankCode.value === "") {
            setActiveTab(10); // Update tab to 10
            let get = allDataobj;
            get.customerInfo[array_index].bankCode.error = true;
            setAlldataobj({ ...get });
            setToast({
              type: "error",
              message: "Bank Code is required",
            });
            return;
          }
        } 
        
        if (Data.customer_img == undefined) {
          setToast({
            type: "error",
            message: 'Please insert Customer Image!',
          });
          setActiveTab(4);
          
          return;
        }
        if (Data.customer_name.value == '') {
      setActiveTab(1);
      let get = allDataobj;
      get.customerInfo[array_index].customer_name.error = true;
      setAlldataobj({ ...get });
      return;
    } else if (Data.customer_surname.value == '') {
      setActiveTab(1);
      let get = allDataobj;
      get.customerInfo[array_index].customer_surname.error = true;
      setAlldataobj({ ...get });
      return;
    }

    else if (Data.customer_dob == undefined) {
      setActiveTab(1);
      setToast({
        type: "error",
        message: 'Please Select Customer Date of Birth!',
      });

      return;
    } else if (Data.customer_gender == undefined) {
      setActiveTab(1);
      setToast({
        type: "error",
        message: 'Please Select Customer Gender!',
      });

      return;
    } else if (Data.customer_mobileNumber.value == "") {
      setActiveTab(2);
      let get = allDataobj;
      get.customerInfo[array_index].customer_mobileNumber.error = true;
      setAlldataobj({ ...get });
      return;
    } else if (Data.customer_mobileNumber.value.length < 11) {
      setActiveTab(2);
      let get = allDataobj;
      get.customerInfo[array_index].customer_mobileNumber.error = true;
      setAlldataobj({ ...get });
      setToast({
        type: "error",
        message: "Please put valid Mobile Number",
      });
      return;
    }

    else if (Data.customer_motherName.value == "") {
      setActiveTab(2);
      let get = allDataobj;
      get.customerInfo[array_index].customer_motherName.error = true;
      setAlldataobj({ ...get });
      return;
    }
    else if (Data.customer_cnicNumber.value == "") {
      setActiveTab(2);
      let get = allDataobj;
      get.customerInfo[array_index].customer_cnicNumber.error = true;
      setAlldataobj({ ...get });
      return;
    }
    else if (Data.customer_cnicNumber.value.length < 15 || Data.customer_cnicNumber.value == "00000-0000000-0") {
      setActiveTab(2);
      let get = allDataobj;
      get.customerInfo[array_index].customer_cnicNumber.error = true;
      setAlldataobj({ ...get });
      setToast({
        type: "error",
        message: "Please put valid CNIC",
      });
      return;
    }
    else if (Data.customer_cnicNumber.value == Data.customer_nextKinCnic.value) {
      setActiveTab(5);
      let get = allDataobj;
      get.customerInfo[array_index].customer_cnicNumber.error = true;
      setAlldataobj({ ...get });
      setToast({
        type: "error",
        message: "KIN's can't contain Customer CNIC",
      });
      return;
    }
    else if (Data.customer_cnicNumber.value == Data.customer_supportingPerson_cnic.value) {
      setActiveTab(9);
      let get = allDataobj;
      get.customerInfo[array_index].customer_cnicNumber.error = true;
      setAlldataobj({ ...get });
      setToast({
        type: "error",
        message: "Supporting Person can't contain Customer CNIC",
      });
      return;
    }
    
    else if (Data.customer_cnicNumber.value == Data.customer_guardianceCnic.value) {
      setActiveTab(3);
      let get = allDataobj;
      get.customerInfo[array_index].customer_cnicNumber.error = true;
      setAlldataobj({ ...get });
      setToast({
        type: "error",
        message: "Guardiance Cnic can't contain Customer CNIC",
      });
      return;
    }
 
  

    else if (Data.customer_region == undefined) {
      setActiveTab(3);
      setToast({
        type: "error",
        message: "Please select Customer Region",
      });
      return;
    }
    else if (Data.customer_region == "Select Region") {
      setActiveTab(3);
      setToast({
        type: "error",
        message: "Please select Customer Region",
      });
      return;
    }
    else if (Data.customer_religion == undefined) {
      setActiveTab(2);
      setToast({
        type: "error",
        message: "Please select Customer Religion",
      });
      return;
    }
    else if (Data.customer_cnicissueDate == undefined) {
      setActiveTab(2);
      setToast({
        type: "error",
        message: "Please select Customer CNIC Issue Date",
      });
      return;
    } else if (Data.customer_cnicExpireDate == undefined) {
      setActiveTab(2);
      setToast({
        type: "error",
        message: "Please select Customer CNIC Expire Date",
      });
      return;
    } else if (diffDays < 5) {
      setToast({
        type: "error",
        message: 'Sorry! Years between NIC Issuance and Expiry date must be greater than equal to 5 year',
      });
      return;
    }
    else if (diffDays > 14) {
      setToast({
        type: "error",
        message: 'Sorry! Years between NIC Issuance and Expiry date must be greater than equal to 5 year or less than 15 years',
      });
      return;
    }
    else if (Data.customer_maritialStatus == undefined) {
      setActiveTab(2);
      setToast({
        type: "error",
        message: "Please select Maritial Status",
      });
      return;
    } else if (date2.getTime() <= date3.getTime()) {
      setToast({
        type: "error",
        message: 'Sorry! You can not Apply for Loan , Your NIC will Expire within 15 days',
      });
      return
    }
    // else if (Data.FamilyNumber.value == "") {
    //   setActiveTab(2);
    //   setToast({
    //     type: "error",
    //     message: "Please enter FamilyNumber"
    //   });
    //   return;
    // }
    // else if (Data.FamilyNumber.value.length > 6 || Data.FamilyNumber.value.length < 6) {
    //   setActiveTab(2);
    //   setToast({
    //     type: "error",
    //     message: "Please enter valid FamilyNumber"
    //   });
    //   return;
    // }
    else if (Data.customer_fatherName.value == '') {
      setActiveTab(2);
      let get = allDataobj;
      get.customerInfo[array_index].customer_fatherName.error = true;
      setAlldataobj({ ...get });
      return;
    }
    else if (Data.customer_houseStatus == undefined) {
      setActiveTab(3);
      setToast({
        type: "error",
        message: "Please select House Status",
      });
      return;
    } else
      if (Data.customer_houseStatus == "Select House Status") {
        setActiveTab(3);
        setToast({
          type: "error",
          message: "Please select House Status",
        });
        return;
      }
      else if (Data.customer_houseType == undefined) {
        setActiveTab(3);
        setToast({
          type: "error",
          message: "Please select House Type",
        });
        return;
      }
      else
        if (Data.customer_houseType == "Select House Type") {
          setActiveTab(3);
          setToast({
            type: "error",
            message: "Please select House Type",
          });

          return;
        }
        else if (Data.customer_userType == undefined) {
          setActiveTab(3);
          setToast({
            type: "error",
            message: "Please select User Type",
          });
          return;
        }
        else if (Data.customer_userType == "Select User type") {
          setActiveTab(3);
          setToast({
            type: "error",
            message: "Please select User Type",
          });
          return;
        }
        else if (Data.customer_gender != "Male" && Data.customer_guardianceCnic.value == "") {
          setActiveTab(3);
          let get = allDataobj;
          get.customerInfo[array_index].customer_guardianceCnic.error = true;
          setAlldataobj({ ...get });
          return;
        }
        else if (Data.customer_gender != "Male" && Data.customer_guardianceCnic.value.length < 15 || Data.customer_guardianceCnic.value === "00000-0000000-0") {
          setActiveTab(3);
          let get = allDataobj;
          get.customerInfo[array_index].customer_guardianceCnic.error = true;
          setAlldataobj({ ...get });
          setToast({
            type: "error",
            message: "Please put valid Guardiance CNIC",
          });
          return;
        }
        else if (Data.customer_guardianceOf == undefined) {
          setActiveTab(2);
          setToast({
            type: "error",
            message: "Please select Guardian of",
          });
          return;
        }
        else
          if (Data.customer_guardianceOfName.value == "") {
            setActiveTab(2);
            let get = allDataobj;
            get.customerInfo[array_index].customer_guardianceOfName.error = true;
            setAlldataobj({ ...get });
            return;
          }
          else if (Data.customer_education == undefined) {
            setActiveTab(2);
            setToast({
              type: "error",
              message: "Please select Customer Education",
            });
            return;
          }
          else if (Data.customer_education == "Education") {

            setActiveTab(2);
            setToast({
              type: "error",
              message: "Please select Customer Education",
            });
            return;
          }
          else if (Data.customer_nextKinName.value == "") {
            setActiveTab(5);
            let get = allDataobj;
            get.customerInfo[array_index].customer_nextKinName.value ;
            setAlldataobj({ ...get });
            setToast({
              type: "error",
              message: "Please put  Kin Name",
            });
            return;
          } 
      
          else if (Data.customer_nextKinRelation == undefined) {
            setActiveTab(5);
            setToast({
              type: "error",
              message: "Please select Kin Relation",
            });
            return;
          }
          else if (Data.customer_nextKinRelation == "Select Kin's Relation") {
            setActiveTab(5);
            setToast({
              type: "error",
              message: "Please select Kin Relation",
            });
            return;
          }
          else if (Data.customer_nextKinRelation != undefined && Data.customer_nextKinRelation == "Select Kin's Relation") {
            setActiveTab(5);
            setToast({
              type: "error",
              message: "Please select Kin Relation",
            });
            return;
          }

          else if (Data.customer_nextKinOtherRelation == undefined) {
            setActiveTab(5);
            setToast({
              type: "error",
              message: "Please select Kin Relation",
            });
            return;
          }
          else if (Data.customer_nextKinOtherRelation == "Select Kin's Relation") {
            setActiveTab(5);
            setToast({
              type: "error",
              message: "Please select Kin Relation",
            });
            return;
          }
          else if (Data.customer_nextKinOtherRelation != undefined && Data.customer_nextKinOtherRelation == "Select Kin's Relation") {
            setActiveTab(5);
            setToast({
              type: "error",
              message: "Please select Kin Relation",
            });
            return;
          }
          else if (Data.customer_nextKinCnic.value == "") {
            setActiveTab(5);
            let get = allDataobj;
            get.customerInfo[array_index].customer_nextKinCnic.value ;
            setAlldataobj({ ...get });
            setToast({
              type: "error",
              message: "Please put  Kin CNIC",
            });
            return;
          } 
          else if (Data.customer_nextKinCnic.length < 15 || Data.customer_nextKinCnic.value == "00000-0000000-0") {
            setActiveTab(5);
            let get = allDataobj;
            get.customerInfo[array_index].customer_nextKinCnic.value ;
            setAlldataobj({ ...get });
            setToast({
              type: "error",
              message: "Please put valid Kin CNIC",
            });
            return;
          }
          else if (Data.customer_pre_country.value == "") {
            setActiveTab(6);
            let get = allDataobj;
            get.customerInfo[array_index].customer_pre_country.error = true;
            setAlldataobj({ ...get });
            return;
          } else if (Data.customer_pre_stateProvince.value == "") {
            setActiveTab(6);

            setToast({
              type: "error",
              message: "Select Province first",
            });
            return;
          } else if (Data.customer_pre_district.value == "") {
            setActiveTab(6);
            let get = allDataobj;
            get.customerInfo[array_index].customer_pre_district.error = true;
            setAlldataobj({ ...get });
            return;
          } else if (Data.customer_pre_taluka.value == "") {
            setActiveTab(6);
            let get = allDataobj;
            get.customerInfo[array_index].customer_pre_taluka.error = true;
            setAlldataobj({ ...get });
            return;
          } else if (Data.customer_pre_uc.value == "") {
            setActiveTab(6);
            let get = allDataobj;
            get.customerInfo[array_index].customer_pre_uc.error = true;
            setAlldataobj({ ...get });
            return;
          } else if (Data.customer_pre_mohalla.value == "") {
            setActiveTab(6);
            let get = allDataobj;
            get.customerInfo[array_index].customer_pre_mohalla.error = true;
            setAlldataobj({ ...get });
            return;
          } else if (Data.customer_pre_city.value == "") {
            setActiveTab(6);
            let get = allDataobj;
            get.customerInfo[array_index].customer_pre_city.error = true;
            setAlldataobj({ ...get });
            return;
          } else if (Data.customer_pre_address.value == "") {
            setActiveTab(6);
            let get = allDataobj;
            get.customerInfo[array_index].customer_pre_address.error = true;
            setAlldataobj({ ...get });
            return;
          }
          //////////////////////////////////
          else if (Data.customer_per_country.value == "") {
            setActiveTab(6);
            let get = allDataobj;
            get.customerInfo[array_index].customer_per_country.error = true;
            setAlldataobj({ ...get });
            return;
          }
          else if (Data.customer_per_stateProvince.value == '') {
            setActiveTab(6);
            setToast({
              type: "error",
              message: "Select Province first",
            });
            return;
          }
          else if (Data.customer_physicalHealth.value == undefined) {

            // console.log("--->update without customer answer"+JSON.stringify(Data));
            setActiveTab(8);
            let get = allDataobj;
            get.customerInfo[array_index].customer_physicalHealth.error = true;
            setAlldataobj({ ...get });
            setToast({
              type: "error",
              message: "Please Provide Health Information",
            });
          }


          else if (Data.customer_per_district.value == "") {
            setActiveTab(6);
            let get = allDataobj;
            get.customerInfo[array_index].customer_per_district.error = true;
            setAlldataobj({ ...get });
            return;
          } else if (Data.customer_per_taluka.value == "") {
            setActiveTab(6);
            let get = allDataobj;
            get.customerInfo[array_index].customer_per_taluka.error = true;
            setAlldataobj({ ...get });
            return;
          } else if (Data.customer_per_uc.value == "") {
            setActiveTab(6);
            let get = allDataobj;
            get.customerInfo[array_index].customer_per_uc.error = true;
            setAlldataobj({ ...get });
            return;
          } else if (Data.customer_per_mohalla.value == "") {
            setActiveTab(6);
            let get = allDataobj;
            get.customerInfo[array_index].customer_per_mohalla.error = true;
            setAlldataobj({ ...get });
            return;
          } else if (Data.customer_per_city.value == "") {
            setActiveTab(6);
            let get = allDataobj;
            get.customerInfo[array_index].customer_per_city.error = true;
            setAlldataobj({ ...get });
            return;
          } else if (Data.customer_per_address.value == "") {
            setActiveTab(6);
            let get = allDataobj;
            get.customerInfo[array_index].customer_per_address.error = true;
            setAlldataobj({ ...get });
            return;
          } else if (Data.numberOfyear.value == "") {
            setActiveTab(6);
            let get = allDataobj;
            get.customerInfo[array_index].numberOfyear.error = true;
            setAlldataobj({ ...get });
            return;
          } else if (getExpirance < 2) {
            setActiveTab(6);
            let get = allDataobj;
            get.customerInfo[array_index].numberOfyear.error = true;
            setAlldataobj({ ...get });
            setToast({
              type: "error",
              message: "Experiance must be greater than equal to 2!",
            });
            return;
          } else if (Data.customer_labourtytestintwoyear != undefined && Data.customer_labourtytestintwoyear.value == "Yes" && Data.customer_health.value == "") {
            setActiveTab(8);
            let get = allDataobj;
            get.customerInfo[array_index].customer_health.error = true;
            setAlldataobj({ ...get });
            return;
          }

          else {
            var finalDataobj = allDataobj;
            finalDataobj.customerInfo[array_index] = Data;
            var getdate = moment().format('l');

            var cnic = finalDataobj.customerInfo[array_index].customer_cnicNumber.value;

            var name = finalDataobj.customerInfo[array_index].customer_name.value;

            var user_contactNumber = finalDataobj.customerInfo[array_index].customer_mobileNumber.value;

            var user_businessAddress = "";

            var user_address = finalDataobj.customerInfo[array_index].customer_pre_address.value

            var documentsArray = "";

            var customerType = "";

            var assetsArray = "";

            var spliter = allDataobj.customerInfo[0].customer_location;
            var Latitude = "";
            var Longitudes = "";
            if (spliter != undefined) {
              var spliter2 = spliter.split(",");
              Latitude = spliter2[0];
              Longitudes = spliter2[1];
            }
  
            if(allDataobj.customerInfo[array_index].customer != "old"){
              console.log("customer new ===>>",allDataobj.customerInfo[array_index].customer)
               if (Data.customer_supportingRequiredPerson_name.value == "") {
                setActiveTab(9);
                let get = allDataobj;
                get.customerInfo[array_index].customer_supportingRequiredPerson_name = true;
                setAlldataobj({ ...get });
                return;
              }else if (Data.customer_supportingRequiredPerson_fathername.value== "") {
                setActiveTab(9);
                let get = allDataobj;
                get.customerInfo[array_index].customer_supportingRequiredPerson_fathername.error = true;
                setAlldataobj({ ...get });
                return;
              }else if (Data.customer_supportingPerson_relation == "") {
                setActiveTab(9);
                let get = allDataobj;
                get.customerInfo[array_index].customer_supportingPerson_relation.value = true;
                setAlldataobj({ ...get });
                return;
              }else if (Data.customer_supportingPerson_name.value == "") {
                setActiveTab(9);
                let get = allDataobj;
                get.customerInfo[array_index].customer_supportingPerson_name.error = true;
                setAlldataobj({ ...get });
                return;
              } else if (Data.customer_supportingPerson_cnic.value == "") {
                setActiveTab(9);
                let get = allDataobj;
                get.customerInfo[array_index].customer_supportingPerson_cnic.value;
                setAlldataobj({ ...get });
                setToast({
                  type: "error",
                  message: "Please put  supporting Person CNIC",
                });
                return;
              } else if (Data.customer_supportingPerson_cnic.value.length < 15 ||  Data.customer_supportingPerson_cnic.value == "00000-0000000-0") {
                setActiveTab(9);
                let get = allDataobj;
                get.customerInfo[array_index].customer_supportingPerson_cnic.value;
                setAlldataobj({ ...get });
                setToast({
                  type: "error",
                  message: "Please put Valid Kin CNIC",
                });
                return;
              }
            }


            if(Data.customer_nextKinCnic.value == Data.customer_supportingPerson_cnic.value){
              if( Data.customer_nextKinName.value != Data.customer_supportingPerson_name.value){
                setActiveTab(9);
                setToast({
                  type: "error",
                  message: "Use same CNIC and Name in kin's",
                });
                return;
              }
              } 
              if( Data.customer_nextKinName.value == Data.customer_supportingPerson_name.value){
                  if(Data.customer_nextKinCnic.value != Data.customer_supportingPerson_cnic.value){ 
                  setActiveTab(9);
                  setToast({
                    type: "error",
                    message: "Use same CNIC and Name in Supporting Person",
                  });
                  return;
                }
                } 

            //insert customerImages

            if (!updateCheck) {
              // insertCustomerImages(
              //   finalDataobj.customerInfo[array_index].customer_cnicNumber.value,

              //   finalDataobj.customerInfo[array_index].customer_img==undefined?'':finalDataobj.customerInfo[array_index].customer_img,

              //   finalDataobj.customerInfo[array_index].customer_biomatric==undefined?'':finalDataobj.customerInfo[array_index].customer_biomatric,

              //   finalDataobj.customerInfo[array_index].customer_supportingPerson_fingerprint==undefined?'':finalDataobj.customerInfo[array_index].customer_supportingPerson_fingerprint,

              //   finalDataobj.customerInfo[array_index].evrisys_customerImage==undefined?'':finalDataobj.customerInfo[array_index].evrisys_customerImage,

              //   finalDataobj.customerInfo[array_index].customer_jobCard==undefined?'':finalDataobj.customerInfo[array_index].customer_jobCard,


              //   ).then((res) => {
              //     finalDataobj.customerInfo[array_index].customer_img=undefined
              //     finalDataobj.customerInfo[array_index].customer_biomatric=undefined
              //     finalDataobj.customerInfo[array_index].customer_supportingPerson_fingerprint=undefined 
              //     finalDataobj.customerInfo[array_index].evrisys_customerImage==undefined
              //     finalDataobj.customerInfo[array_index].customer_jobCard=undefined

              //   }).catch((e)=>{
              //     console.log("error in insertCustomerImages"+e);
              //   })


              if (allDataobj.customerInfo[array_index].resetId == undefined) {
                insertCustomerFromDataWithRow(JSON.stringify(finalDataobj), getdate, cnic, name, user_businessAddress, user_contactNumber, user_address, customerType, "", JSON.stringify(CustomerAnsReducer), Latitude, Longitudes, "", "0").then((res) => {
                  console.log("res", res.id);
                  finalDataobj.customerInfo[array_index].resetId = res.id;
                  setAlldataobj({ ...finalDataobj });
                  props.UpdateUserData(finalDataobj);
                  props.onPressNext();
                }).catch((err) => {
                  console.log(err);

                });
              } else {

                if (UpdateReducer.updateCheck.customerAnswer) {
                  updateCustomerFromDataWithRow(JSON.stringify(finalDataobj), name, user_contactNumber, user_address, Latitude, Longitudes, UpdateReducer.updateCheck.id)
                  console.log("--->update without customer answer")
                } else {
                  updateCustomerFromDataWithRowAndCustomerAwnsers(JSON.stringify(finalDataobj), name, user_contactNumber, user_address, Latitude, Longitudes, allDataobj.customerInfo[array_index].resetId ? allDataobj.customerInfo[array_index].resetId : UpdateReducer.updateCheck.id, JSON.stringify(CustomerAnsReducer))
                  console.log("--->update with customer answer")
                }
                props.UpdateUserData(finalDataobj);
                props.onPressNext();
              }


              insertAndDeleteTempForms(Data.customer_cnicNumber.value, JSON.stringify(finalDataobj));


            } else {
              // updateCustomerImagesfromCustomersPage(
              //   finalDataobj.customerInfo[array_index].customer_cnicNumber.value,

              //   finalDataobj.customerInfo[array_index].customer_img==undefined?'':finalDataobj.customerInfo[array_index].customer_img,

              //   finalDataobj.customerInfo[array_index].customer_biomatric==undefined?'':finalDataobj.customerInfo[array_index].customer_biomatric,

              //   finalDataobj.customerInfo[array_index].customer_supportingPerson_fingerprint==undefined?'':finalDataobj.customerInfo[array_index].customer_supportingPerson_fingerprint,

              //   // finalDataobj.customerInfo[array_index].evrisys_customerImage==undefined?'':JSON.stringify(finalDataobj.customerInfo[array_index].evrisys_customerImage),

              //   finalDataobj.customerInfo[array_index].customer_jobCard==undefined?'':finalDataobj.customerInfo[array_index].customer_jobCard,


              //   ).then((res) => {
              //     finalDataobj.customerInfo[array_index].customer_img=undefined
              //     finalDataobj.customerInfo[array_index].customer_biomatric=undefined
              //     finalDataobj.customerInfo[array_index].customer_supportingPerson_fingerprint=undefined
              //     finalDataobj.customerInfo[array_index].customer_jobCard=undefined


              //   }).catch((e)=>{
              //     console.log("error in updateCustomerImages"+e);
              //   })
              if (UpdateReducer.updateCheck.customerAnswer) {
                updateCustomerFromDataWithRow(JSON.stringify(finalDataobj), name, user_contactNumber, user_address, Latitude, Longitudes, UpdateReducer.updateCheck.id)
                console.log("--->update without customer answer")
              } else {
                updateCustomerFromDataWithRowAndCustomerAwnsers(JSON.stringify(finalDataobj), name, user_contactNumber, user_address, Latitude, Longitudes, allDataobj.customerInfo[array_index].resetId ? allDataobj.customerInfo[array_index].resetId : UpdateReducer.updateCheck.id, JSON.stringify(CustomerAnsReducer))
                console.log("--->update with customer answer")
              }
              props.UpdateUserData(finalDataobj);
              props.onPressNext();

            }

          }
  };
  const checkForPermentAddress = () => {
    setCheckedAddress(!checkedforAddress);
    if (!checkedforAddress) {
      let get = allDataobj;
      get.customerInfo[array_index].customer_per_country.value =
        get.customerInfo[array_index].customer_pre_country.value;
      get.customerInfo[array_index].customer_per_stateProvince.value =
        get.customerInfo[array_index].customer_pre_stateProvince.value;
      get.customerInfo[array_index].customer_per_district.value =
        get.customerInfo[array_index].customer_pre_district.value;
      get.customerInfo[array_index].customer_per_taluka.value =
        get.customerInfo[array_index].customer_pre_taluka.value;
      get.customerInfo[array_index].customer_per_uc.value =
        get.customerInfo[array_index].customer_pre_uc.value;
      get.customerInfo[array_index].customer_per_mohalla.value =
        get.customerInfo[array_index].customer_pre_mohalla.value;
      get.customerInfo[array_index].customer_per_city.value =
        get.customerInfo[array_index].customer_pre_city.value;
      get.customerInfo[array_index].customer_per_address.value =
        get.customerInfo[array_index].customer_pre_address.value;

      setAlldataobj({ ...get });
    } else {
      let get = allDataobj;
      get.customerInfo[array_index].customer_per_country.value = '';
      get.customerInfo[array_index].customer_per_stateProvince = { value: '', index: '' };
      get.customerInfo[array_index].customer_per_district.value = '';
      get.customerInfo[array_index].customer_per_taluka.value = '';
      get.customerInfo[array_index].customer_per_uc.value = '';
      get.customerInfo[array_index].customer_per_mohalla.value = '';
      get.customerInfo[array_index].customer_per_city.value = '';
      get.customerInfo[array_index].customer_per_address.value = '';

      setAlldataobj({ ...get });
    }
  };
  const _onPressforCnicoption = () => {
    setDialoge(true);
  };
  React.useEffect(() => {
    requestLocationPermission();


  }, []);
  async function requestLocationPermission() {
    if (UserLocation != undefined) {
      setCustomerLocation(UserLocation);
      if (updateCheck == false) {
        let get = allDataobj;
        get.customerInfo[array_index].customer_location = UserLocation;
        setAlldataobj({ ...get });
      } else if (updateCheck && allDataobj.customerInfo[array_index].customer_location == undefined) {
        let get = allDataobj;
        get.customerInfo[array_index].customer_location = UserLocation;
        setAlldataobj({ ...get });
      }
    } else {
      try {
        // setLoading(true);
        getCurrentLocation(async (position, mocked) => {
          if (position) {

            var lat = position.coords.latitude;
            var lon = position.coords.longitude;
            var loc = lat + "," + lon;
            setLoading(false);
            console.log(loc);
            setCustomerLocation(loc);
            if (updateCheck == false) {
              let get = allDataobj;
              get.customerInfo[array_index].customer_location = loc;
              setAlldataobj({ ...get });

            }

          } else {
            setLoading(false);
            Alert.alert(
              'Sorry!',
              'Could not get your location, you cannot proceed',
            );

          }
          //   alert(JSON.stringify(position.coords.latitude))
        });
        // const granted = await PermissionsAndroid.request(
        //   PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        //   {
        //     title: 'This App',
        //     message: 'This App access to your location ',
        //     buttonPositive: 'OK',
        //   },
        // );
        // if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        //   RNAndroidLocationEnabler.promptForEnableLocationIfNeeded({
        //     interval: 10000,
        //     fastInterval: 5000,
        //   })
        //     .then(data => {

        //       Geolocation.getCurrentPosition(info => {
        //         var lat = info.coords.latitude;
        //         var lon = info.coords.longitude;
        //         var loc = lat + "," + lon;
        //         console.log(loc);
        //         setCustomerLocation(loc);
        //         if (updateCheck == false) {
        //           let get = allDataobj;
        //           get.customerInfo[array_index].customer_location = loc;
        //           setAlldataobj({ ...get });
        //         }
        //       });


        //     })
        //     .catch(err => {
        //       //console.log(err)

        //     });
        // } else {
        // }
      } catch (err) {
        console.warn(err);
        setLoading(true);
      }
    }

  }

  // return
  return (
    <SafeAreaView>

      <ScrollView
        // style={{flex:1}}

        showsVerticalScrollIndicator={false}>

        {/* <KeyboardAvoidingView behavior='padding'> */}

        {allDataobj != undefined && (

          <View>

            <View style={[styles.box]}>

              <TouchableOpacity onPressIn={_customerTab4} style={styles.buttomheader}>

                <TextView

                  type={'Light'}

                  text="Customer Images"

                  style={{ color: Colors.white }}></TextView>

                <TouchableOpacity onPressIn={_customerTab4}>

                  {activeTab == 4 ? (

                    <MaterialCommunityIcons

                      name="minus"
                      color={Colors.white}

                      size={26}></MaterialCommunityIcons>

                  ) : (

                    <MaterialCommunityIcons

                      name="plus"
                      color={Colors.white}

                      size={26}></MaterialCommunityIcons>

                  )}

                </TouchableOpacity>

              </TouchableOpacity>

              {activeTab == 4 ? (

                <View style={styles.bounceview}>

                  <View style={styles.row2}>

                    <View

                      style={{

                        height: 200,

                        width: width / 2.5,

                        justifyContent: 'center',

                      }}>

                      <TextView
                        style={{ alignSelf: 'center' }}
                        type={'small'}
                        text="Biomatric Verification"></TextView>

                      {allDataobj.customerInfo[array_index].customer_biomatric ==
                        undefined ? (
                        <MaterialCommunityIcons
                          style={{ alignSelf: 'center' }}
                          name="fingerprint"
                          size={56}></MaterialCommunityIcons>
                      ) : (
                        <Image
                          style={{
                            height: 150,
                            width: 150,
                            resizeMode: 'cover',
                            alignSelf: 'center',
                          }}
                          source={{
                            uri: `data:image/gif;base64,${allDataobj.customerInfo[array_index].customer_biomatric.imageValue}`,
                          }}></Image>
                      )}

                      <View
                        style={{
                          flexDirection: 'row',
                          alignItems: 'center',
                          marginTop: 20,
                          justifyContent: 'space-around',
                        }}>
                        <Pressable
                          onPressIn={() => _fingerPrint(1)}
                          style={{
                            height: 30,
                            width: width / 5,

                            borderRadius: 30,
                            backgroundColor: Colors.backgroundColor,
                            justifyContent: 'center',
                          }}>
                          <TextView
                            style={{ textAlign: 'center' }}
                            type={'small'}
                            text="Register"></TextView>
                        </Pressable>
                        <Pressable
                          onPressIn={() => _resetDevices(1)}
                          style={{
                            height: 30,
                            width: width / 5,
                            borderRadius: 30,
                            marginLeft: 5,
                            backgroundColor: Colors.backgroundColor,
                            justifyContent: 'center',
                          }}>
                          <TextView
                            style={{ textAlign: 'center' }}
                            type={'small'}
                            text="Refresh"></TextView>
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
                        style={{ alignSelf: 'center' }}
                        type={'small'}
                        text="Customer Image"></TextView>
                      {allDataobj.customerInfo[array_index].customer_img ==
                        undefined ? (
                        <MaterialCommunityIcons
                          style={{ alignSelf: 'center' }}
                          name="google-photos"
                          size={56}></MaterialCommunityIcons>
                      ) : (
                        <ZoomableImage
                          images={`data:image/gif;base64,${allDataobj.customerInfo[array_index].customer_img}`}

                        />

                      )}

                      <View
                        style={{
                          flexDirection: 'row',
                          alignItems: 'center',
                          marginTop: 20,
                          justifyContent: 'space-around',
                        }}>
                        {/*<Pressable
                          onPressIn={pickImges}
                          style={{
                            height: 30,
                            width: width / 6,
                            borderRadius: 30,
                            backgroundColor: Colors.backgroundColor,
                            justifyContent: 'center',
                          }}>
                          <TextView
                            style={{ textAlign: 'center' }}
                            type={'small'}
                            text="Gallery"></TextView>
                        </Pressable> */}
                        <Pressable
                          onPressIn={capture}
                          style={{
                            height: 30,
                            width: width / 4,
                            borderRadius: 10,
                            backgroundColor: Colors.backgroundColor,
                            justifyContent: 'center',
                          }}>
                          <TextView
                            style={{ textAlign: 'center' }}
                            type={'small'}
                            text="Camera"></TextView>
                        </Pressable>
                      </View>
                    </View>
                  </View>
                </View>
              ) : (
                <View></View>
              )}
            </View>
            {/* //-==-----------------------Custoer info------------------------- */}
            <View style={[styles.box]}>
              <TouchableOpacity onPressIn={_customerTab} style={styles.buttomheader}>
                <TextView
                  type={'Light'}
                  text="Customer Information"
                  style={{ color: Colors.white }}></TextView>
                <Pressable onPressIn={_customerTab}>
                  {activeTab == 1 ? (
                    <MaterialCommunityIcons
                      name="minus"
                      color={Colors.white}

                      size={26}></MaterialCommunityIcons>
                  ) : (
                    <MaterialCommunityIcons
                      name="plus"
                      color={Colors.white}

                      size={26}></MaterialCommunityIcons>
                  )}
                </Pressable>
              </TouchableOpacity>

              {activeTab == 1 && (
                <View style={[styles.bounceview, { paddingBottom: 10 }]}>
                  <View style={styles.row2}>
                    <FormInputs
                      text={'First Name'}
                      required={true}
                      editable={true}
                      error={
                        allDataobj.customerInfo[array_index].customer_name.error
                      }
                      value={
                        allDataobj.customerInfo[array_index].customer_name.value
                      }
                      onChangeText={(value: string) => {
                        if (!regex.test(value)) {
                          return
                        }
                        let get = allDataobj;
                        get.customerInfo[array_index].customer_name.value = value;
                        get.customerInfo[array_index].customer_supportingRequiredPerson_name.value = value;
                        get.assestsInfo[array_index].assetOwner.value = value;


                        get.customerInfo[array_index].customer_name.error = false;

                        setAlldataobj({ ...get });
                      }}></FormInputs>

                    <FormInputs
                      text={'Surname'}
                      required={true}
                      editable={true}
                      error={
                        allDataobj.customerInfo[array_index].customer_surname
                          .error
                      }
                      value={
                        allDataobj.customerInfo[array_index].customer_surname
                          .value
                      }
                      onChangeText={(value: string) => {
                        if (!regex.test(value)) {
                          return
                        }
                        let get = allDataobj;
                        get.customerInfo[array_index].customer_surname.value =
                          value;
                        get.customerInfo[array_index].customer_surname.error =
                          false;

                        setAlldataobj({ ...get });
                      }}></FormInputs>
                  </View>
                  <View style={styles.row2}>

                    <View style={{ marginRight: 4, marginTop: 4 }}>
                      <DateSelector
                        title={
                          allDataobj.customerInfo[array_index].customer_dob ==
                            undefined
                            ? 'Date of Birth'
                            : allDataobj.customerInfo[array_index].customer_dob
                        }
                        setAlldataobj={setAlldataobj}
                        allDataobj={allDataobj}
                        setToast={setToast}
                        array_index={array_index}
                        fieldName={1}></DateSelector>
                    </View>
                  </View>
                  <CustomRadio
                    editable={true}
                    twofield={3}
                    title="Gender Selection"
                    firstoption="Male"
                    secondoption="Female"
                    thirdoption="Transgender"
                    variable={1}
                    // setAlldataobj={setAlldataobj}
                    allDataobj={allDataobj}
                    array_index={array_index}></CustomRadio>
                </View>
              )}
            </View>
            {/* //-==-----------------------Personal------------------------- */}

            <View style={[styles.box]}>
              <TouchableOpacity onPressIn={_customerTab2} style={styles.buttomheader}>
                <TextView
                  type={'Light'}
                  text="Customer Personal Information"
                  style={{ color: Colors.white }}></TextView>
                <Pressable onPressIn={_customerTab2}>
                  {activeTab == 2 ? (
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
              </TouchableOpacity>

              {activeTab == 2 && (
                <View style={styles.bounceview}>

                  <View style={styles.row2}>
                    <FormInputs
                      required={true}
                      maxLength={11}
                      editable={true}
                      clearDataButton={false}
                      clearText={() => {
                        let get = allDataobj;
                        get.customerInfo[
                          array_index
                        ].customer_mobileNumber.value = "";

                        setAlldataobj({ ...get });
                      }}
                      keyboardtype={'phone-pad'}
                      text={'Mobile Number'}
                      error={
                        allDataobj.customerInfo[array_index].customer_mobileNumber
                          .error
                      }
                      value={
                        allDataobj.customerInfo[array_index].customer_mobileNumber
                          .value
                      }
                      onChangeText={(value: string) => {
                        if (speacial.test(value)) {
                          return
                        }
                        // let regexp = new RegExp('^[0-9+]{4}-[0-9+]{7}$');
                        // if (value.length == 4) {
                        //   let get = allDataobj;
                        //   get.customerInfo[
                        //     array_index
                        //   ].customer_mobileNumber.value = value + '-';

                        //   get.customerInfo[
                        //     array_index
                        //   ].customer_mobileNumber.error = !regexp.test(value) ? true : false
                        //   setAlldataobj({ ...get });
                        // }
                        //  else {
                        let get = allDataobj;
                        get.customerInfo[
                          array_index
                        ].customer_mobileNumber.value = value;
                        get.customerInfo[
                          array_index
                        ].customer_mobileNumber.error = false

                        // ].customer_mobileNumber.error = !regexp.test(value) ? true : false

                        setAlldataobj({ ...get });
                        // }

                      }}></FormInputs>

                    <FormInputs
                      required={true}
                      text={'Mother Name'}
                      error={
                        allDataobj.customerInfo[array_index].customer_motherName
                          .error
                      }
                      value={
                        allDataobj.customerInfo[array_index].customer_motherName
                          .value
                      }
                      onChangeText={(value: string) => {
                        if (!regex.test(value)) {
                          return
                        }
                        let get = allDataobj;
                        get.customerInfo[array_index].customer_motherName.value =
                          value;
                        get.customerInfo[array_index].customer_motherName.error =
                          false;
                        setAlldataobj({ ...get });
                      }}></FormInputs>
                  </View>

                  <View style={styles.row2}>
                    <CnicInputoptions
                      required={true}
                      _onPress={() => {
                        setCninupdatefor(0)
                        _onPressforCnicoption()


                      }}
                      error={
                        allDataobj.customerInfo[array_index].customer_cnicNumber
                          .error
                      }
                      keyboardtype={'number-pad'}
                      text={'CNIC Number'}

                      value={
                        allDataobj.customerInfo[array_index].customer_cnicNumber
                          .value
                      }
                      editable={false}
                      clearText={() => {
                        let get = allDataobj;
                        get.customerInfo[
                          array_index
                        ].customer_cnicNumber.value = "";

                        setAlldataobj({ ...get });
                      }}
                      onChangeText={(value: string) => {
                        if (speacial.test(value)) {
                          return
                        }
                        var regexp = new RegExp('^[0-9+]{5}-[0-9+]{7}-[0-9]{1}$');
                        if (value.length < 16) {
                          if (value.length == 5 || value.length == 13) {
                            let get = allDataobj;
                            get.customerInfo[
                              array_index
                            ].customer_cnicNumber.value = value + '-';

                            get.customerInfo[
                              array_index
                            ].customer_cnicNumber.error = !regexp.test(value) ? true : false
                            setAlldataobj({ ...get });
                          } else {
                            // console.log("-->cnic",props.user_cnic)

                            if (value.length == 15 && props.user_cnic == value) {
                              let get = allDataobj;
                              get.customerInfo[
                                array_index
                              ].customer_cnicNumber.value = value;
                              get.customerInfo[
                                array_index
                              ].customer_cnicNumber.error = !regexp.test(value) ? true : false

                              setAlldataobj({ ...get });

                            } else if (value.length == 15) {
                              checkingCustomerByCnic(value)
                                .then((res) => {
                                  console.log("--->3", res)
                                  if (res == 0) { //not finded
                                    let get = allDataobj;
                                    get.customerInfo[
                                      array_index
                                    ].customer_cnicNumber.value = value;
                                    get.customerInfo[
                                      array_index
                                    ].customer_cnicNumber.error = !regexp.test(value) ? true : false

                                    setAlldataobj({ ...get });
                                  } else {
                                    let get = allDataobj;
                                    get.customerInfo[
                                      array_index
                                    ].customer_cnicNumber.value = "";
                                    get.customerInfo[
                                      array_index
                                    ].customer_cnicNumber.error = true

                                    setAlldataobj({ ...get });
                                    Alert.alert("Sorry!", "Cnic Already exits")
                                  }
                                })
                                .catch((error) => { console.log("-->", error) })

                            }
                            let get = allDataobj;
                            get.customerInfo[
                              array_index
                            ].customer_cnicNumber.value = value;
                            get.customerInfo[
                              array_index
                            ].customer_cnicNumber.error = !regexp.test(value) ? true : false
                            setAlldataobj({ ...get });

                          }
                        }
                      }}></CnicInputoptions>

                    <View style={{ marginTop: 0 }}>

                      <CustomDropdown
                        text={"Religion"}
                        required={true}
                        tempdata={religion}
                        label={
                          allDataobj.customerInfo[array_index].customer_religion ==
                            undefined
                            ? 'Select Religion'
                            : allDataobj.customerInfo[array_index].customer_religion.value
                        }
                        onSelect={async (value, underindex) => {
                          let get = allDataobj;
                          get.customerInfo[array_index].customer_religion = { value: religion[underindex], index: underindex }
                          setAlldataobj({ ...get });
                        }}

                      />



                    </View>
                  </View>

                  <View style={styles.row2}>
                    <View style={{ marginRight: 4, marginTop: 4 }}>
                      <View>
                        <TextView type={'formLabel'} style={{
                          fontSize: 12, color: '#737373', marginLeft: 10, backgroundColor: '#f1f1f1'
                        }} text={'CNIC Issue Date'} />
                      </View>
                      <DateSelector
                        title={
                          allDataobj.customerInfo[array_index]
                            .customer_cnicissueDate == undefined
                            ? 'CNIC issue date'
                            : allDataobj.customerInfo[array_index]
                              .customer_cnicissueDate
                        }
                        setAlldataobj={setAlldataobj}
                        allDataobj={allDataobj}
                        array_index={array_index}
                        setToast={setToast}
                        fieldName={2}></DateSelector>
                    </View>
                    <View style={{ marginRight: 4, marginTop: 4 }}>
                      <View>
                        <TextView type={'formLabel'} style={{
                          fontSize: 12, color: '#737373', marginLeft: 10, backgroundColor: '#f1f1f1'
                        }} text={'CNIC Expiry Date'} />
                      </View>
                      <DateSelector
                        title={
                          allDataobj.customerInfo[array_index]
                            .customer_cnicExpireDate == undefined
                            ? 'CNIC Expire date'
                            : allDataobj.customerInfo[array_index]
                              .customer_cnicExpireDate
                        }
                        setAlldataobj={setAlldataobj}
                        allDataobj={allDataobj}
                        array_index={array_index}
                        setToast={setToast}
                        fieldName={3}></DateSelector>
                    </View>
                  </View>

                  <View style={[styles.row2, { marginTop: 10 }]}>
                    <FormInputs
                      required={false}
                      maxLength={6}
                      // keyboardtype={''}
                      text={'Family Number'}
                      editable={true}
                      error={
                        allDataobj.customerInfo[array_index].FamilyNumber
                          .error
                      }
                      value={
                        allDataobj.customerInfo[array_index].FamilyNumber
                          .value
                      }
                      onChangeText={(value: string) => {
                        if (speacial.test(value)) {
                          return
                        }
                        let get = allDataobj;
                        get.customerInfo[
                          array_index
                        ].FamilyNumber.value = value;
                        get.customerInfo[
                          array_index
                        ].FamilyNumber.error = value.length < 6 ? true : false;
                        setAlldataobj({ ...get });
                      }}></FormInputs>
                    <CustomDropdown
                      text={"Education"}
                      required={true}
                      tempdata={education}
                      label={
                        allDataobj.customerInfo[array_index].customer_education == undefined
                          ? 'Select Education'
                          : allDataobj.customerInfo[array_index].customer_education.value
                      }
                      onSelect={async (value, underindex) => {
                        let get = allDataobj;
                        get.customerInfo[array_index].customer_education = { value: education[underindex], index: underindex }
                        //education[index];
                        setAlldataobj({ ...get });
                      }}

                    />
                  </View>
                  <View style={styles.row2}>
                    <FormInputs
                      text={'Father Name'}
                      required={true}
                      editable={true}
                      error={
                        allDataobj.customerInfo[array_index].customer_fatherName
                          .error
                      }
                      value={
                        allDataobj.customerInfo[array_index].customer_fatherName
                          .value
                      }
                      onChangeText={(value: string) => {
                        let get = allDataobj;
                        get.customerInfo[array_index].customer_fatherName.value =
                          value;
                        get.customerInfo[array_index].customer_fatherName.error =
                          false;
                        get.customerInfo[array_index].customer_supportingRequiredPerson_fathername.value = value
                        if (allDataobj.customerInfo[array_index].customer_gender == "Male") {
                          get.customerInfo[array_index].customer_guardianceOfName.value = value
                        }
                        if (allDataobj.customerInfo[array_index].customer_gender == "Female" &&
                          allDataobj.customerInfo[array_index].customer_maritialStatus == "Single") {
                          get.customerInfo[array_index].customer_guardianceOfName.value = value
                        }
                        setAlldataobj({ ...get });
                      }}></FormInputs>
                  </View>
                  <CustomRadio
                    twofield={allDataobj.customerInfo[array_index].customer_gender == "Male" ? 2 : 4}
                    title="Maritial Status"
                    firstoption="Single"
                    secondoption="Married"
                    thirdoption="Divorced"
                    fourthoption="Widow"
                    variable={2}
                    setAlldataobj={setAlldataobj}
                    allDataobj={allDataobj}
                    array_index={array_index}></CustomRadio>


                  {allDataobj.customerInfo[array_index].customer_gender == "Male" &&
                    <CustomRadio
                      twofield={1}
                      txtfield={true}
                      // title={"Guardian of"}
                      firstoption="S/O"
                      variable={3}
                      setAlldataobj={setAlldataobj}
                      allDataobj={allDataobj}
                      array_index={array_index}></CustomRadio>}

                  {allDataobj.customerInfo[array_index].customer_gender == "Female" &&
                    allDataobj.customerInfo[array_index].customer_maritialStatus == "Single" &&
                    <CustomRadio
                      twofield={1}
                      txtfield={true}
                      // title={"Guardian of"}
                      firstoption="D/O"
                      variable={3}
                      setAlldataobj={setAlldataobj}
                      allDataobj={allDataobj}
                      array_index={array_index}></CustomRadio>}

                  {allDataobj.customerInfo[array_index].customer_gender == "Female" &&
                    allDataobj.customerInfo[array_index].customer_maritialStatus == "Married" &&
                    <CustomRadio
                      twofield={1}
                      txtfield={true}
                      // title={"Guardian of"} 
                      firstoption="W/O"
                      variable={3}
                      setAlldataobj={setAlldataobj}
                      allDataobj={allDataobj}
                      array_index={array_index}></CustomRadio>}

                  {allDataobj.customerInfo[array_index].customer_gender == "Female" &&
                    allDataobj.customerInfo[array_index].customer_maritialStatus == "Widow" &&
                    <CustomRadio
                      twofield={2}
                      txtfield={true}
                      // title={"Guardian of"}
                      firstoption="D/O"
                      secondoption="W/O"

                      variable={3}
                      setAlldataobj={setAlldataobj}
                      allDataobj={allDataobj}
                      array_index={array_index}></CustomRadio>}


                  {allDataobj.customerInfo[array_index].customer_gender == "Female" &&
                    allDataobj.customerInfo[array_index].customer_maritialStatus == "Divorced" &&
                    <CustomRadio
                      twofield={1}
                      txtfield={true}
                      // title={"Guardian of"}
                      firstoption="D/O"
                      variable={3}
                      setAlldataobj={setAlldataobj}
                      allDataobj={allDataobj}
                      array_index={array_index}></CustomRadio>}

                  {allDataobj.customerInfo[array_index].customer_gender == "Transgender" &&
                    <CustomRadio
                      twofield={3}
                      txtfield={true}
                      // title={"Guardian of"}
                      firstoption="S/O"
                      secondoption="D/O"
                      thirdoption="W/O"
                      variable={3}
                      setAlldataobj={setAlldataobj}
                      allDataobj={allDataobj}
                      array_index={array_index}></CustomRadio>}
                </View>
              )}
            </View>

            {/* //-==-----------------------additional------------------------- */}

            <View style={[styles.box]}>
              <TouchableOpacity onPressIn={_customerTab3} style={styles.buttomheader}>
                <TextView
                  type={'Light'}
                  text="Customer Additional Information"
                  style={{ color: Colors.white }}></TextView>
                <Pressable onPressIn={_customerTab3}>
                  {activeTab == 3 ? (
                    <MaterialCommunityIcons
                      name="minus"
                      color={Colors.white}

                      size={26}></MaterialCommunityIcons>
                  ) : (
                    <MaterialCommunityIcons
                      name="plus"
                      color={Colors.white}

                      size={26}></MaterialCommunityIcons>
                  )}
                </Pressable>
              </TouchableOpacity>

              {activeTab == 3 && (
                <View style={styles.bounceview}>
                  <View style={styles.row2}>
                    <View style={{ marginTop: 0 }}>



                      <CustomDropdown
                        text={"Region"}
                        required={true}
                        tempdata={EmpRegionsReducer}
                        label={
                          allDataobj.customerInfo[array_index].customer_region ==
                            undefined
                            ? 'Select Region'
                            : allDataobj.customerInfo[array_index].customer_region
                        }
                      // onSelect={async (value, underindex) => {
                      //   let get = allDataobj;
                      //   get.customerInfo[array_index].customer_region =
                      //     regions[underindex];
                      //   setAlldataobj({ ...get });
                      // }}

                      />
                    </View>
                    <View style={{ marginTop: 0 }}>

                      <CustomDropdown
                        text={"House Status"}
                        required={true}
                        tempdata={houseStatus}
                        label={
                          allDataobj.customerInfo[array_index]
                            .customer_houseStatus == undefined
                            ? 'Select House Status'
                            : allDataobj.customerInfo[array_index]
                              .customer_houseStatus.value
                        }
                        onSelect={async (value, underindex) => {
                          let get = allDataobj;
                          get.customerInfo[array_index].customer_houseStatus = { value: houseStatus[underindex], index: underindex }
                          //houseStatus[index];
                          setAlldataobj({ ...get });
                        }}

                      />

                    </View>
                  </View>
                  <View style={styles.row2}>
                    <View style={{ marginTop: 0 }}>


                      <CustomDropdown
                        text={"House Type"}
                        required={true}
                        tempdata={houseType}
                        label={
                          allDataobj.customerInfo[array_index].customer_houseType ==
                            undefined
                            ? 'Select House Type'
                            : allDataobj.customerInfo[array_index]
                              .customer_houseType.value
                        }
                        onSelect={async (value, underindex) => {
                          let get = allDataobj;
                          get.customerInfo[array_index].customer_houseType = { value: houseType[underindex], index: underindex }
                          //houseType[index];
                          setAlldataobj({ ...get });
                        }}

                      />

                    </View>
                    <View style={{ marginTop: 0 }}>
                      {/*-------- old dropdown------------------ */}

                      <TextView type={'formLabel'} text={"BISP Beneficiary"}
                        style={{ color: '#737373', marginLeft: 10, width: width / 3, marginBottom: -20 }}></TextView>
                      <Dropdownlist
                        data={isBenificary}
                        label={
                          allDataobj.customerInfo[array_index]
                            .customer_bispBeneficary == undefined
                            ? 'BISP Beneficiary'
                            : allDataobj.customerInfo[array_index]
                              .customer_bispBeneficary.value
                        }
                        RT={1}
                        onSelect={async value => {
                          let get = allDataobj;
                          get.customerInfo[array_index].customer_bispBeneficary = { value: isBenificary[value], index: value }
                          setAlldataobj({ ...get });
                        }}></Dropdownlist>
                      {/*------------ old dorpdown end------- */}
                    </View>
                  </View>

                  <View style={styles.row2}>
                    <View style={{ marginTop: 0 }}>
                      {/* old dropdown */}
                      <TextView type={'formLabel'} text={"User Type"}
                        style={{ color: '#737373', marginLeft: 10, width: width / 3, marginBottom: -20 }}></TextView>
                      <Dropdownlist
                        required={true}
                        data={userType}
                        RT={2}
                        label={
                          allDataobj.customerInfo[array_index].customer_userType ==
                            undefined
                            ? 'Select User Type'
                            : allDataobj.customerInfo[array_index].customer_userType.value
                        }
                        onSelect={async (index, value) => {
                          let get = allDataobj;

                          get.customerInfo[array_index].customer_userType =
                            { value: userType[index], index: index }
                          setAlldataobj({ ...get });
                        }}></Dropdownlist>
                      {/* old dropdown end */}
                    </View>
                    {allDataobj.customerInfo[array_index].customer_gender != "Male" && <FormInputs
                      required={true}
                      text={'Guardian CNIC'}
                      keyboardtype={'number-pad'}
                      error={
                        allDataobj.customerInfo[array_index]
                          .customer_guardianceCnic.error
                      }
                      value={
                        allDataobj.customerInfo[array_index]
                          .customer_guardianceCnic.value
                      }
                      onChangeText={(value: string) => {
                        var regexp = new RegExp('^[0-9+]{5}-[0-9+]{7}-[0-9]{1}$');
                        if (value.length < 16) {
                          if (value.length == 5 || value.length == 13) {
                            let get = allDataobj;
                            get.customerInfo[
                              array_index
                            ].customer_guardianceCnic.value = value + '-';

                            get.customerInfo[
                              array_index
                            ].customer_guardianceCnic.error = !regexp.test(value) ? true : false
                            setAlldataobj({ ...get });
                          } else {
                            let get = allDataobj;
                            get.customerInfo[
                              array_index
                            ].customer_guardianceCnic.value = value;
                            get.customerInfo[
                              array_index
                            ].customer_guardianceCnic.error = !regexp.test(value) ? true : false

                            setAlldataobj({ ...get });
                          }
                        }
                        ///////////////////////////////
                      }}
                      clearDataButton={true}
                      clearText={() => {
                        let get = allDataobj;
                        get.customerInfo[
                          array_index
                        ].customer_guardianceCnic.value = ""

                        setAlldataobj({ ...get });
                      }}
                    ></FormInputs>}
                  </View>


                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      marginTop: 10,
                      marginBottom: 10,
                      marginLeft: 10,
                    }}>
                    <Checkbox
                      color={Colors.parrotGreenColor}
                      status={
                        allDataobj.customerInfo[array_index].customer_isEmployeed
                          ? 'checked'
                          : 'unchecked'
                      }
                      onPress={() => {
                        let get = allDataobj;

                        get.customerInfo[array_index].customer_jobCard = undefined;

                        get.customerInfo[array_index].customer_isEmployeed =

                          allDataobj.customerInfo[array_index].customer_isEmployeed ? false : true;

                        setAlldataobj({ ...get });

                      }}
                    />
                    <TextView
                      style={{ marginLeft: 10 }}
                      type={'small'}
                      text={'Are you Employed?'}></TextView>
                  </View>
                  {allDataobj.customerInfo[array_index].customer_isEmployeed &&

                    (
                      <View style={{ marginBottom: 20 }}>
                        <TextView
                          style={{ alignSelf: 'center', marginTop: 20 }}
                          type={'small'}
                          text="Job Card / Salary Slip"></TextView>
                        {allDataobj.customerInfo[array_index].customer_jobCard ==
                          undefined ? (
                          <MaterialCommunityIcons
                            style={{ alignSelf: 'center' }}
                            name="google-photos"
                            size={56}></MaterialCommunityIcons>
                        ) : (
                          <ZoomableImage
                            images={`data:image/gif;base64,${allDataobj.customerInfo[array_index].customer_jobCard}`}

                          />

                        )}
                        <Pressable
                          onPressIn={takePhotoforJobCard}
                          style={{
                            height: 30,
                            width: width / 4,
                            alignSelf: 'center',
                            borderRadius: 10,
                            backgroundColor: Colors.backgroundColor,
                            justifyContent: 'center',
                          }}>
                          <TextView
                            style={{ textAlign: 'center' }}
                            type={'small'}
                            text="Camera"></TextView>
                        </Pressable>
                      </View>

                    )


                  }
                </View>
              )}
            </View>

            {/* //-==-----------------------Kins's Realtions------------------------- */}

            {allDataobj.customerInfo[array_index].customer == 'old' ?

              <View style={[styles.box]}>
                <TouchableOpacity onPressIn={_customerTab5} style={styles.buttomheader}>
                  <TextView
                    type={'Light'}
                    text="Kin's Information"
                    style={{ color: Colors.white }}></TextView>
                  <Pressable onPressIn={_customerTab5}>
                    {activeTab == 5 ? (
                      <MaterialCommunityIcons
                        name="minus"
                        color={Colors.white}

                        size={26}></MaterialCommunityIcons>
                    ) : (
                      <MaterialCommunityIcons
                        name="plus"
                        color={Colors.white}

                        size={26}></MaterialCommunityIcons>
                    )}
                  </Pressable>
                </TouchableOpacity>

                {activeTab == 5 && (
                  <View style={styles.bounceview}>
                    <View style={styles.row2}>
                      <FormInputs
                        text={'Next of Kin Name'}
                        required={true}
                        editable={true}
                        error={
                          allDataobj.customerInfo[array_index].customer_nextKinName.error
                        }
                        value={
                          allDataobj.customerInfo[array_index].customer_nextKinName.value
                        }
                        onChangeText={(value: string) => {
                          if (!regex.test(value)) {
                            return
                          }
                          let get = allDataobj;
                          get.customerInfo[array_index].customer_nextKinName.value = value;
                          get.customerInfo[array_index].customer_supportingRequiredPerson_name.error =
                            false;

                          setAlldataobj({ ...get });
                        }}></FormInputs>
                      <View style={{ marginTop: 0 }}>

                        {/* <CustomDropdown
                        text={"Kins Relation"}
                        required={true}
                        tempdata={kinRelation}
                        label={
                          allDataobj.customerInfo[array_index].customer_nextKinOtherRelation.value ==
                            ''
                            ? 'Select Kins Relation'
                            : allDataobj.customerInfo[array_index].customer_nextKinOtherRelation.value
                        }
                        type={2}
                        onSelect={async (value, underindex) => {
                          let get = allDataobj;
                          get.customerInfo[
                            array_index
                          ].customer_nextKinOtherRelation = { value: '', index:'' }

                          setAlldataobj({ ...get })


                        }}

                      /> */}

                        <CustomDropdown
                          text={"Kins Relation"}
                          required={true}
                          tempdata={kinRelation}

                          label={
                            allDataobj.customerInfo[array_index]
                              .customer_nextKinRelation == undefined
                              ? "Select Kin's Relation"
                              : allDataobj.customerInfo[array_index]
                                .customer_nextKinRelation.value
                          }
                          onSelect={async (value, underindex) => {
                            let get = allDataobj;
                            get.customerInfo[array_index].customer_nextKinRelation = { value: kinRelation[underindex], index: underindex }
                            //kinRelation[index];
                            setAlldataobj({ ...get });
                          }}

                        />

                        {/*---------- old dropdown--------------- */}
                        {/* <TextView type={'formLabel'} text={"Kin's Relation"}
      style={{color:'#737373',marginLeft:10,width:width/3,marginBottom:-20}}></TextView>
                      <Dropdownlist
                    required={true}
                    data={kinRelation}
                    RT={1}
                    label={
                      allDataobj.customerInfo[array_index]
                        .customer_nextKinRelation == undefined
                        ? "Select Kin's Relation"
                        : allDataobj.customerInfo[array_index]
                            .customer_nextKinRelation
                    }
                    onSelect={async value => {
                      let get = allDataobj;
                      get.customerInfo[array_index].customer_nextKinRelation =
                        kinRelation[value];
                      setAlldataobj({...get});
                    }}></Dropdownlist> */}
                        {/*---------- old dropdown end------------------- */}
                      </View>
                    </View>

                    <View style={styles.row2}>
                      <FormInputs

                        error={
                          allDataobj.customerInfo[array_index].customer_nextKinCnic.error
                        }
                        keyboardtype={'number-pad'}
                        required={true}
                        editable={true}
                        text={'Kin CNIC Number'}
                        value={
                          allDataobj.customerInfo[array_index].customer_nextKinCnic.value
                        }
                        onChangeText={(value: string) => {
                          if (speacial.test(value)) {
                            return
                          }
                          var regexp = new RegExp('^[0-9+]{5}-[0-9+]{7}-[0-9]{1}$');
                          if (value.length < 16) {
                            if (value.length == 5 || value.length == 13) {
                             

                              let get = allDataobj;
                              get.customerInfo[
                                array_index
                              ].customer_nextKinCnic.value = value + '-';

                              get.customerInfo[
                                array_index
                              ].customer_nextKinCnic.value = value + '-';
                              setAlldataobj({ ...get });
                            } else {
                              let get = allDataobj;
                              get.customerInfo[
                                array_index
                              ].customer_nextKinCnic.value = value;
                              get.customerInfo[
                                array_index
                              ].customer_nextKinCnic.value = value;

                              setAlldataobj({ ...get });
                            }
                          }
                          // }
                        }}

                      ></FormInputs>

                      {allDataobj.customerInfo[array_index]
                        .customer_nextKinRelation != undefined &&
                        allDataobj.customerInfo[array_index]
                          .customer_nextKinRelation.value == 'Other' && (
                          <FormInputs
                            required={true}
                            text={'Write Relation here'}
                            error={
                              allDataobj.customerInfo[array_index]
                                .customer_nextKinOtherRelation.error
                            }
                            value={
                              allDataobj.customerInfo[array_index]
                                .customer_nextKinOtherRelation.value
                            }
                            onChangeText={(value: string) => {
                              if (!regex.test(value)) {
                                return
                              }
                              let get = allDataobj;
                              get.customerInfo[
                                array_index
                              ].customer_nextKinOtherRelation.value = value;
                              get.customerInfo[
                                array_index
                              ].customer_nextKinOtherRelation.error = false;
                              setAlldataobj({ ...get });
                            }}></FormInputs>
                        )}

                    </View>
                  </View>
                )}
              </View>


              :
              <View style={[styles.box]}>
                <TouchableOpacity onPressIn={_customerTab5} style={styles.buttomheader}>
                  <TextView
                    type={'Light'}
                    text="Kin's Information"
                    style={{ color: Colors.white }}></TextView>
                  <Pressable onPressIn={_customerTab5}>
                    {activeTab == 5 ? (
                      <MaterialCommunityIcons
                        name="minus"
                        color={Colors.white}

                        size={26}></MaterialCommunityIcons>
                    ) : (
                      <MaterialCommunityIcons
                        name="plus"
                        color={Colors.white}

                        size={26}></MaterialCommunityIcons>
                    )}
                  </Pressable>
                </TouchableOpacity>

                {activeTab == 5 && (
                  <View style={styles.bounceview}>
                    <View style={styles.row2}>
                      <FormInputs
                        text={'Next of Kin Name'}
                        required={true}
                        editable={true}
                        error={
                          allDataobj.customerInfo[array_index].customer_nextKinName.error
                        }
                        value={
                          allDataobj.customerInfo[array_index].customer_nextKinName.value
                        }
                        onChangeText={(value: string) => {
                          if (!regex.test(value)) {
                            return
                          }
                          let get = allDataobj;

                          get.customerInfo[array_index].customer_nextKinName .value= value;
                          get.customerInfo[array_index].customer_nextKinName.error = false;

                          setAlldataobj({ ...get });
                        }}></FormInputs>
                      <View style={{ marginTop: 0 }}>

                        {/* <CustomDropdown
                        text={"Kins Relation"}
                        required={true}
                        tempdata={kinRelation}
                        label={
                          allDataobj.customerInfo[array_index].customer_nextKinOtherRelation.value ==
                            ''
                            ? 'Select Kins Relation'
                            : allDataobj.customerInfo[array_index].customer_nextKinOtherRelation.value
                        }
                        type={2}
                        onSelect={async (value, underindex) => {
                          let get = allDataobj;
                          get.customerInfo[
                            array_index
                          ].customer_nextKinOtherRelation = { value: '', index:'' }

                          setAlldataobj({ ...get })


                        }}

                      /> */}

                        <CustomDropdown
                          text={"Kins Relation"}
                          required={true}
                          tempdata={kinRelation}

                          label={
                            allDataobj.customerInfo[array_index]
                              .customer_nextKinRelation == undefined
                              ? "Select Kin's Relation"
                              : allDataobj.customerInfo[array_index]
                                .customer_nextKinRelation.value
                          }
                          onSelect={async (value, underindex) => {
                            let get = allDataobj;
                            get.customerInfo[array_index].customer_nextKinRelation = { value: kinRelation[underindex], index: underindex }
                            //kinRelation[index];
                            setAlldataobj({ ...get });
                          }}

                        />

                        {/*---------- old dropdown--------------- */}
                        {/* <TextView type={'formLabel'} text={"Kin's Relation"}
      style={{color:'#737373',marginLeft:10,width:width/3,marginBottom:-20}}></TextView>
                      <Dropdownlist
                    required={true}
                    data={kinRelation}
                    RT={1}
                    label={
                      allDataobj.customerInfo[array_index]
                        .customer_nextKinRelation == undefined
                        ? "Select Kin's Relation"
                        : allDataobj.customerInfo[array_index]
                            .customer_nextKinRelation
                    }
                    onSelect={async value => {
                      let get = allDataobj;
                      get.customerInfo[array_index].customer_nextKinRelation =
                        kinRelation[value];
                      setAlldataobj({...get});
                    }}></Dropdownlist> */}
                        {/*---------- old dropdown end------------------- */}
                      </View>
                    </View>

                    <View style={styles.row2}>
                      <FormInputs

                        error={
                          allDataobj.customerInfo[array_index].customer_nextKinCnic.error
                        }
                        keyboardtype={'number-pad'}
                        required={true}

                        text={'Kin CNIC Number'}
                        value={
                          allDataobj.customerInfo[array_index].customer_nextKinCnic.value
                        }
                        onChangeText={(value: string) => {
                          if (speacial.test(value)) {
                            return
                          }
                          var regexp = new RegExp('^[0-9+]{5}-[0-9+]{7}-[0-9]{1}$');
                          if (value.length < 16) {
                            if (value.length == 5 || value.length == 13) {

                              let get = allDataobj;
                              get.customerInfo[
                                array_index
                              ].customer_nextKinCnic.value = value + '-';

                              get.customerInfo[
                                array_index
                              ].customer_nextKinCnic.value = value + '-';
                              setAlldataobj({ ...get });
                            } else {
                              let get = allDataobj;
                              get.customerInfo[
                                array_index
                              ].customer_nextKinCnic.value = value;
                              get.customerInfo[
                                array_index
                              ].customer_nextKinCnic.value = value;

                              setAlldataobj({ ...get });
                            }
                          }
                          // }
                        }}

                      ></FormInputs>

                      {allDataobj.customerInfo[array_index]
                        .customer_nextKinRelation != undefined &&
                        allDataobj.customerInfo[array_index]
                          .customer_nextKinRelation.value == 'Other' && (
                          <FormInputs
                            required={true}
                            text={'Write Relation here'}
                            error={
                              allDataobj.customerInfo[array_index]
                                .customer_nextKinOtherRelation.error
                            }
                            value={
                              allDataobj.customerInfo[array_index]
                                .customer_nextKinOtherRelation.value
                            }
                            onChangeText={(value: string) => {
                              if (!regex.test(value)) {
                                return
                              }
                              let get = allDataobj;
                              get.customerInfo[
                                array_index
                              ].customer_nextKinOtherRelation.value = value;
                              get.customerInfo[
                                array_index
                              ].customer_nextKinOtherRelation.error = false;
                              setAlldataobj({ ...get });
                            }}></FormInputs>
                        )}

                    </View>
                  </View>
                )}
              </View>

            }



            {/* //-==-----------------------Supporting Person Undertaking------------------------- */}

            {allDataobj.customerInfo[array_index].customer == 'old' ?

              <View style={[styles.box]}>
                <TouchableOpacity onPressIn={_customerTab9} style={styles.buttomheader}>
                  <TextView
                    type={'Light'}
                    text="Supporting Person Undertaking"
                    style={{ color: Colors.white }}></TextView>
                  <Pressable onPressIn={_customerTab9}>
                    {activeTab == 9 ? (
                      <MaterialCommunityIcons
                        name="minus"
                        color={Colors.white}

                        size={26}></MaterialCommunityIcons>
                    ) : (
                      <MaterialCommunityIcons
                        name="plus"
                        color={Colors.white}

                        size={26}></MaterialCommunityIcons>
                    )}
                  </Pressable>
                </TouchableOpacity>

                {activeTab == 9 && (
                  <View style={styles.bounceview}>
                    <TextView style={{ fontSize: 14, alignSelf: 'center' }}
                      text={"اقرار نامون گهر جي سربراھ/وارث/قرض استعمال ڪندڙ لاءِ"}></TextView>

                    <View style={[styles.row2, { marginTop: 30 }]}>
                      <FormInputs
                        style={{ flex: 0.1 }}
                        text={''}
                        required={true}
                        error={
                          allDataobj.customerInfo[array_index]?.customer_supportingRequiredPerson_name
                            .error
                        }
                        value={
                          allDataobj.customerInfo[array_index]?.customer_supportingRequiredPerson_name
                            .value
                        }
                        onChangeText={(value: string) => {
                          if (!regex.test(value)) {
                            return
                          }
                          let get = allDataobj;
                          get.customerInfo[array_index].customer_supportingRequiredPerson_name.value =
                            value;
                          get.customerInfo[array_index].customer_supportingRequiredPerson_name.error =
                            false;
                          setAlldataobj({ ...get });
                        }}></FormInputs>
                      <TextView style={{ fontSize: 14, marginTop: 30, flex: 0.9 }}
                        text={"اقرار نامون گهر جي سربراھ/وارث/قرض استعمال ڪندڙ لاءِ"}></TextView>
                    </View>

                    <View style={{ marginTop: 20, flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end' }}>


                      <FormInputs
                        text={''}
                        required={true}
                        error={
                          allDataobj.customerInfo[array_index]?.customer_supportingRequiredPerson_fathername
                            .error
                        }
                        value={
                          allDataobj.customerInfo[array_index]?.customer_supportingRequiredPerson_fathername
                            .value
                        }
                        onChangeText={(value: string) => {
                          if (!regex.test(value)) {
                            return
                          }
                          let get = allDataobj;
                          get.customerInfo[array_index].customer_supportingRequiredPerson_fathername.value =
                            value;
                          get.customerInfo[array_index].customer_supportingRequiredPerson_fathername.error =
                            false;
                          setAlldataobj({ ...get });
                        }}></FormInputs>
                      <TextView style={{ fontSize: 14, marginTop: 30 }}
                        text={"ولد"}></TextView>
                    </View>

                    <View style={[styles.row2, { marginTop: 30 }]}>

                      <FormInputs
                        text={''}
                        required={false}
                        style={{ flex: 0.1 }}
                        error={
                          allDataobj.customerInfo[array_index]?.customer_supportingPerson_relation.error

                        }
                        value={
                          allDataobj.customerInfo[array_index]?.customer_supportingPerson_relation.value

                        }
                        onChangeText={(value: string) => {
                          if (!regex.test(value)) {
                            return
                          }
                          let get = allDataobj;
                          get.customerInfo[array_index].customer_supportingPerson_relation.value =
                            value;
                          get.customerInfo[array_index].customer_supportingPerson_relation.error =
                          false;
                          setAlldataobj({ ...get });
                        }}></FormInputs>
                      <TextView style={{ fontSize: 14, marginTop: 10, flex: 0.9 }}
                        text={"جو زميدار آھيان، درخواستگذار سان منھنجو"}></TextView>
                    </View>

                    <TextView style={{ fontSize: 14, marginTop: 10 }}
                      text={"رشتو آھي،"}></TextView>

                    <TextView style={{ fontSize: 14, marginTop: 10 }}
                      text={"  مونکي قرض بابت ڄاڻ آھي، قرض جي رٿيل قسط مطابق پابندي سان ادائيگي ڪرائڻ جو پڻ زميدار آھيان ۽ آئون ان ڳالھ جي به ضمانت ڏيان ٿو ته سافڪو سپورٽ فائونڊيشن کان ورتل قرض جا پئسا ڪنھن به ممنوع ڪاروبار/سرگرمين ۾ استعمال نه ڪيا ويندا "}></TextView>

                    <View style={{ marginTop: 20, flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end' }}>


                      <FormInputs
                        text={''}
                        required={true}
                        error={
                          allDataobj.customerInfo[array_index]?.customer_supportingPerson_name.error
                            
                        }
                        value={
                          allDataobj.customerInfo[array_index]?.customer_supportingPerson_name.value
                        }
                        onChangeText={(value: string) => {
                          if (!regex.test(value)) {
                            return
                          }
                          let get = allDataobj;
                          get.customerInfo[array_index].customer_supportingPerson_name.value =
                            value;
                          get.customerInfo[array_index].customer_supportingPerson_name.error =
                            false;
                          setAlldataobj({ ...get });
                        }}></FormInputs>
                      <TextView style={{ fontSize: 14, marginTop: 30 }}
                        text={"سربراھ جو نالو"}></TextView>
                    </View>


                    <View style={{ marginTop: 20, flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end' }}>


                       <FormInputs

                        error={
                          allDataobj.customerInfo[array_index].customer_supportingPerson_cnic.error
                        }
                        keyboardtype={'number-pad'}
                        required={true}
                        editable={true}
                        text={'Kin CNIC Number'}
                        value={
                          allDataobj.customerInfo[array_index].customer_supportingPerson_cnic.value
                        }
                        onChangeText={(value: string) => {
                          if (speacial.test(value)) {
                            return
                          }
                          var regexp = new RegExp('^[0-9+]{5}-[0-9+]{7}-[0-9]{1}$');
                          if (value.length < 16) {
                            if (value.length == 5 || value.length == 13) {

                              let get = allDataobj;
                              get.customerInfo[
                                array_index
                              ].customer_supportingPerson_cnic.value = value + '-';

                              get.customerInfo[
                                array_index
                              ].customer_supportingPerson_cnic.value = value + '-';
                              setAlldataobj({ ...get });
                            } else {
                              let get = allDataobj;
                              get.customerInfo[
                                array_index
                              ].customer_supportingPerson_cnic.value= value;
                              get.customerInfo[
                                array_index
                              ].customer_supportingPerson_cnic.value = value;

                              setAlldataobj({ ...get });
                            }
                          }
                          // }
                        }}

                      ></FormInputs>
                      <TextView style={{ fontSize: 14, marginTop: 30 }}
                        text={"شناّختي ڪارڊ نمبر "}></TextView>
                    </View>

                    <View

                      style={{
                        marginBottom: 10, marginTop: 10,
                        alignSelf: 'center',
                        height: 200,

                        width: width / 2,

                        justifyContent: 'center',

                      }}>

                      <TextView
                        style={{ alignSelf: 'center' }}
                        type={'small'}
                        text="سربراھ جي آنڱوٺي جو نشان"></TextView>

                      {allDataobj.customerInfo[array_index]?.customer_supportingPerson_fingerprint ==
                        undefined ? (
                        <MaterialCommunityIcons
                          style={{ alignSelf: 'center' }}
                          name="fingerprint"
                          size={56}></MaterialCommunityIcons>
                      ) : (
                        <Image
                          style={{
                            height: 150,
                            width: 150,
                            resizeMode: 'cover',
                            alignSelf: 'center',
                          }}
                          source={{
                            uri: `data:image/gif;base64,${allDataobj.customerInfo[array_index].customer_supportingPerson_fingerprint?.imageValue}`,
                          }}></Image>
                      )}

                      <View
                        style={{
                          flexDirection: 'row',
                          alignItems: 'center',
                          marginTop: 20,
                          justifyContent: 'space-around',
                        }}>
                        <Pressable
                          onPressIn={() => _fingerPrint(2)}
                          style={{
                            height: 30,
                            width: width / 6,
                            borderRadius: 30,
                            backgroundColor: Colors.backgroundColor,
                            justifyContent: 'center',
                          }}>
                          <TextView
                            style={{ textAlign: 'center' }}
                            type={'small'}
                            text="Register"></TextView>
                        </Pressable>
                        <Pressable
                          onPressIn={() => _resetDevices(2)}
                          style={{
                            height: 30,
                            width: width / 6,
                            borderRadius: 30,
                            backgroundColor: Colors.backgroundColor,
                            justifyContent: 'center',
                          }}>
                          <TextView
                            style={{ textAlign: 'center' }}
                            type={'small'}
                            text="Refresh"></TextView>
                        </Pressable>
                      </View>
                    </View>
                  </View>
                )}



              </View>
              :
              <View style={[styles.box]}>
                <TouchableOpacity onPressIn={_customerTab9} style={styles.buttomheader}>
                  <TextView
                    type={'Light'}
                    text="Supporting Person Undertaking"
                    style={{ color: Colors.white }}></TextView>
                  <Pressable onPressIn={_customerTab9}>
                    {activeTab == 9 ? (
                      <MaterialCommunityIcons
                        name="minus"
                        color={Colors.white}

                        size={26}></MaterialCommunityIcons>
                    ) : (
                      <MaterialCommunityIcons
                        name="plus"
                        color={Colors.white}

                        size={26}></MaterialCommunityIcons>
                    )}
                  </Pressable>
                </TouchableOpacity>

                {activeTab == 9 && (
                  <View style={styles.bounceview}>
                    <TextView style={{ fontSize: 14, alignSelf: 'center' }}
                      text={"اقرار نامون گهر جي سربراھ/وارث/قرض استعمال ڪندڙ لاءِ"}></TextView>

                    <View style={[styles.row2, { marginTop: 30 }]}>
                      <FormInputs
                        style={{ flex: 0.1 }}
                        text={''}
                        required={true}
                        error={
                          allDataobj.customerInfo[array_index]?.customer_supportingRequiredPerson_name
                            .error
                        }
                        value={
                          allDataobj.customerInfo[array_index]?.customer_supportingRequiredPerson_name
                            .value
                        }
                        onChangeText={(value: string) => {
                          if (!regex.test(value)) {
                            return
                          }
                          let get = allDataobj;
                          get.customerInfo[array_index].customer_supportingRequiredPerson_name.value =
                            value;
                          get.customerInfo[array_index].customer_supportingRequiredPerson_name.error =
                            false;
                          setAlldataobj({ ...get });
                        }}></FormInputs>
                      <TextView style={{ fontSize: 14, marginTop: 30, flex: 0.9 }}
                        text={"اقرار نامون گهر جي سربراھ/وارث/قرض استعمال ڪندڙ لاءِ"}></TextView>
                    </View>

                    <View style={{ marginTop: 20, flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end' }}>


                      <FormInputs
                        text={''}
                        required={true}
                        error={
                          allDataobj.customerInfo[array_index]?.customer_supportingRequiredPerson_fathername
                            .error
                        }
                        value={
                          allDataobj.customerInfo[array_index]?.customer_supportingRequiredPerson_fathername
                            .value
                        }
                        onChangeText={(value: string) => {
                          if (!regex.test(value)) {
                            return
                          }
                          let get = allDataobj;
                          get.customerInfo[array_index].customer_supportingRequiredPerson_fathername.value =
                            value;
                          get.customerInfo[array_index].customer_supportingRequiredPerson_fathername.error =
                            false;
                          setAlldataobj({ ...get });
                        }}></FormInputs>
                      <TextView style={{ fontSize: 14, marginTop: 30 }}
                        text={"ولد"}></TextView>
                    </View>

                    <View style={[styles.row2, { marginTop: 30 }]}>

                      <FormInputs
                        text={''}
                        required={false}
                        style={{ flex: 0.1 }}
                        error={
                          allDataobj.customerInfo[array_index]?.customer_supportingPerson_relation.error

                        }
                        value={
                          allDataobj.customerInfo[array_index]?.customer_supportingPerson_relation.value

                        }
                        onChangeText={(value: string) => {
                          if (!regex.test(value)) {
                            return
                          }
                          let get = allDataobj;
                          get.customerInfo[array_index].customer_supportingPerson_relation.value =
                            value;
                          get.customerInfo[array_index].customer_supportingPerson_relation.error =
                            false;
                          setAlldataobj({ ...get });
                        }}></FormInputs>
                      <TextView style={{ fontSize: 14, marginTop: 10, flex: 0.9 }}
                        text={"جو زميدار آھيان، درخواستگذار سان منھنجو"}></TextView>
                    </View>

                    <TextView style={{ fontSize: 14, marginTop: 10 }}
                      text={"رشتو آھي،"}></TextView>

                    <TextView style={{ fontSize: 14, marginTop: 10 }}
                      text={"  مونکي قرض بابت ڄاڻ آھي، قرض جي رٿيل قسط مطابق پابندي سان ادائيگي ڪرائڻ جو پڻ زميدار آھيان ۽ آئون ان ڳالھ جي به ضمانت ڏيان ٿو ته سافڪو سپورٽ فائونڊيشن کان ورتل قرض جا پئسا ڪنھن به ممنوع ڪاروبار/سرگرمين ۾ استعمال نه ڪيا ويندا "}></TextView>

                    <View style={{ marginTop: 20, flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end' }}>


                      <FormInputs
                        text={''}
                        required={true}
                        error={
                          allDataobj.customerInfo[array_index]?.customer_supportingPerson_name
                            .error
                        }
                        value={
                          allDataobj.customerInfo[array_index]?.customer_supportingPerson_name.value
                        }
                        onChangeText={(value: string) => {
                          if (!regex.test(value)) {
                            return
                          }
                          let get = allDataobj;
                          get.customerInfo[array_index].customer_supportingPerson_name.value =
                            value;
                          get.customerInfo[array_index].customer_supportingPerson_name.error =
                            false;
                          setAlldataobj({ ...get });
                        }}></FormInputs>
                      <TextView style={{ fontSize: 14, marginTop: 30 }}
                        text={"سربراھ جو نالو"}></TextView>
                    </View>


                    <View style={{ marginTop: 20, flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end' }}>


                      <FormInputs
                        text={''}
                        required={true}
                        keyboardtype={'number-pad'}
                        error={
                          allDataobj.customerInfo[array_index]?.customer_supportingPerson_cnic
                            .error
                        }
                        value={
                          allDataobj.customerInfo[array_index]?.customer_supportingPerson_cnic.value

                        }
                        onChangeText={(value: string) => {
                          if (speacial.test(value)) {
                            return
                          }
                          var regexp = new RegExp('^[0-9+]{5}-[0-9+]{7}-[0-9]{1}$');
                          if (value.length < 16) {
                            if (value.length == 5 || value.length == 13) {

                              let get = allDataobj;
                              get.customerInfo[
                                array_index
                              ].customer_supportingPerson_cnic.value = value + '-';

                              get.customerInfo[
                                array_index
                              ].customer_supportingPerson_cnic.value = value + '-';
                              setAlldataobj({ ...get });
                            } else {
                              let get = allDataobj;
                              get.customerInfo[
                                array_index
                              ].customer_supportingPerson_cnic.value = value;
                              get.customerInfo[
                                array_index
                              ].customer_supportingPerson_cnic.value = value;

                              setAlldataobj({ ...get });
                            }
                          }

                        }}
                      ></FormInputs>
                      <TextView style={{ fontSize: 14, marginTop: 30 }}
                        text={"شناّختي ڪارڊ نمبر "}></TextView>
                    </View>

                    <View

                      style={{
                        marginBottom: 10, marginTop: 10,
                        alignSelf: 'center',
                        height: 200,

                        width: width / 2,

                        justifyContent: 'center',

                      }}>

                      <TextView
                        style={{ alignSelf: 'center' }}
                        type={'small'}
                        text="سربراھ جي آنڱوٺي جو نشان"></TextView>

                      {allDataobj.customerInfo[array_index]?.customer_supportingPerson_fingerprint ==
                        undefined ? (
                        <MaterialCommunityIcons
                          style={{ alignSelf: 'center' }}
                          name="fingerprint"
                          size={56}></MaterialCommunityIcons>
                      ) : (
                        <Image
                          style={{
                            height: 150,
                            width: 150,
                            resizeMode: 'cover',
                            alignSelf: 'center',
                          }}
                          source={{
                            uri: `data:image/gif;base64,${allDataobj.customerInfo[array_index].customer_supportingPerson_fingerprint?.imageValue}`,
                          }}></Image>
                      )}

                      <View
                        style={{
                          flexDirection: 'row',
                          alignItems: 'center',
                          marginTop: 20,
                          justifyContent: 'space-around',
                        }}>
                        <Pressable
                          onPressIn={() => _fingerPrint(2)}
                          style={{
                            height: 30,
                            width: width / 6,
                            borderRadius: 30,
                            backgroundColor: Colors.backgroundColor,
                            justifyContent: 'center',
                          }}>
                          <TextView
                            style={{ textAlign: 'center' }}
                            type={'small'}
                            text="Register"></TextView>
                        </Pressable>
                        <Pressable
                          onPressIn={() => _resetDevices(2)}
                          style={{
                            height: 30,
                            width: width / 6,
                            borderRadius: 30,
                            backgroundColor: Colors.backgroundColor,
                            justifyContent: 'center',
                          }}>
                          <TextView
                            style={{ textAlign: 'center' }}
                            type={'small'}
                            text="Refresh"></TextView>
                        </Pressable>
                      </View>
                    </View>
                  </View>
                )}



              </View>
            }
            <View style={[styles.box, {}]}>
  <Pressable onPressIn={_customerTab10} style={styles.buttomheader}>
    <TextView
      type={'Bold'}
      text="Customer Bank Information"
      style={{
        color: Colors.white,
        alignSelf: 'center',
        fontSize: 14,
        borderBottomColor: 'transparent', // Removed the border
        borderBottomWidth: 0, // Removed the border
        paddingBottom: 3,
      }}
    />
    <Pressable onPressIn={_customerTab10}>
      {activeTab == 10 ? (
        <MaterialCommunityIcons
          name="minus"
          color={Colors.white}
          size={26}
        />
      ) : (
        <MaterialCommunityIcons
          name="plus"
          color={Colors.white}
          size={26}
        />
      )}
    </Pressable>
  </Pressable>

  {activeTab == 10 && (
  <View style={styles.bounceview}>
    {/* Radio Buttons for COC and IBFT */}
    <View style={styles.row2}>
      <RadioButton.Group
        onValueChange={(value) => {
          let get = { ...allDataobj };
          if (!get.customerInfo?.[array_index]) get.customerInfo[array_index] = {};
          get.customerInfo[array_index].transferType = value; // Update transfer type in the state
          setAlldataobj(get);
        }}
        value={allDataobj?.customerInfo?.[array_index]?.transferType || 'COC'} // Default to 'COC'
      >
        <View style={styles.row2}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <RadioButton value="COC" />
            <Text style={{ marginLeft: 5 }}>COC</Text>
          </View>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <RadioButton value="IBFT" />
            <Text style={{ marginLeft: 5 }}>IBFT</Text>
          </View>
        </View>
      </RadioButton.Group>
    </View>

    {/* Input Fields */}
    <View style={styles.row2}>
      <FormInputs
       keyboardtype={'default'}
        required={allDataobj?.customerInfo?.[array_index]?.transferType === 'IBFT'}
        text={'Account Number'}
        error={allDataobj?.customerInfo?.[array_index]?.accountNumber?.error || false}
        value={allDataobj?.customerInfo?.[array_index]?.accountNumber?.value || ''}
        onChangeText={(value: string) => {
         

          let get = { ...allDataobj };
          if (!get.customerInfo?.[array_index]) get.customerInfo[array_index] = {};
          get.customerInfo[array_index].accountNumber = get.customerInfo[array_index].accountNumber || { value: '', error: false };
          get.customerInfo[array_index].accountNumber.value = value;
          get.customerInfo[array_index].accountNumber.error =
            get.customerInfo[array_index].transferType === 'IBFT' && !value.trim();
          setAlldataobj(get);
        }}
      />

      <FormInputs
        keyboardtype={'default'}
        required={allDataobj?.customerInfo?.[array_index]?.transferType === 'IBFT'}
        text={'Account Type'}
        error={allDataobj?.customerInfo?.[array_index]?.accountType?.error || false}
        value={allDataobj?.customerInfo?.[array_index]?.accountType?.value || ''}
        onChangeText={(value: string) => {
          let get = { ...allDataobj };
          if (!get.customerInfo?.[array_index]) get.customerInfo[array_index] = {};
          get.customerInfo[array_index].accountType = get.customerInfo[array_index].accountType || { value: '', error: false };
          get.customerInfo[array_index].accountType.value = value;
          get.customerInfo[array_index].accountType.error =
            get.customerInfo[array_index].transferType === 'IBFT' && !value.trim();
          setAlldataobj(get);
        }}
      />
    </View>

    <View style={styles.row2}>
      <FormInputs
        keyboardtype={'default'}
        required={allDataobj?.customerInfo?.[array_index]?.transferType === 'IBFT'}
        text={'Account Title'}
        error={allDataobj?.customerInfo?.[array_index]?.accountTitle?.error || false}
        value={allDataobj?.customerInfo?.[array_index]?.accountTitle?.value || ''}
        onChangeText={(value: string) => {
          let get = { ...allDataobj };
          if (!get.customerInfo?.[array_index]) get.customerInfo[array_index] = {};
          get.customerInfo[array_index].accountTitle = get.customerInfo[array_index].accountTitle || { value: '', error: false };
          get.customerInfo[array_index].accountTitle.value = value;
          get.customerInfo[array_index].accountTitle.error =
            get.customerInfo[array_index].transferType === 'IBFT' && !value.trim();
          setAlldataobj(get);
        }}
      />

      <FormInputs
        keyboardtype={'default'}
        required={allDataobj?.customerInfo?.[array_index]?.transferType === 'IBFT'}
        text={'Bank Name'}
        error={allDataobj?.customerInfo?.[array_index]?.bankName?.error || false}
        value={allDataobj?.customerInfo?.[array_index]?.bankName?.value || ''}
        onChangeText={(value: string) => {
          let get = { ...allDataobj };
          if (!get.customerInfo?.[array_index]) get.customerInfo[array_index] = {};
          get.customerInfo[array_index].bankName = get.customerInfo[array_index].bankName || { value: '', error: false };
          get.customerInfo[array_index].bankName.value = value;
          get.customerInfo[array_index].bankName.error =
            get.customerInfo[array_index].transferType === 'IBFT' && !value.trim();
          setAlldataobj(get);
        }}
      />
    </View>

    <View style={styles.row2}>
      <FormInputs
        keyboardtype={'default'}
        required={allDataobj?.customerInfo?.[array_index]?.transferType === 'IBFT'}
        text={'Branch Name'}
        error={allDataobj?.customerInfo?.[array_index]?.branchName?.error || false}
        value={allDataobj?.customerInfo?.[array_index]?.branchName?.value || ''}
        onChangeText={(value: string) => {
          let get = { ...allDataobj };
          if (!get.customerInfo?.[array_index]) get.customerInfo[array_index] = {};
          get.customerInfo[array_index].branchName = get.customerInfo[array_index].branchName || { value: '', error: false };
          get.customerInfo[array_index].branchName.value = value;
          get.customerInfo[array_index].branchName.error =
            get.customerInfo[array_index].transferType === 'IBFT' && !value.trim();
          setAlldataobj(get);
        }}
      />

<FormInputs
        keyboardtype={'default'}
        required={allDataobj?.customerInfo?.[array_index]?.transferType === 'IBFT'}
        text={'Bank Code'}
        error={allDataobj?.customerInfo?.[array_index]?.bankCode?.error || false}
        value={allDataobj?.customerInfo?.[array_index]?.bankCode?.value || ''}
        onChangeText={(value: string) => {
          let get = { ...allDataobj };
          if (!get.customerInfo?.[array_index]) get.customerInfo[array_index] = {};
          get.customerInfo[array_index].bankCode = get.customerInfo[array_index].bankCode || { value: '', error: false };
          get.customerInfo[array_index].bankCode.value = value;
          get.customerInfo[array_index].bankCode.error =
            get.customerInfo[array_index].transferType === 'IBFT' && !value.trim();
          setAlldataobj(get);
        }}
      />
    </View>
  </View>
)}

</View>

            {/* //-==-----------------------Pemanent Address------------------------- */}

            <View style={[styles.box]}>
              <Pressable onPressIn={_customerTab6} style={styles.buttomheader}>
                <TextView
                  type={'Light'}
                  text="Customer Address"
                  style={{ color: Colors.white }}></TextView>
                <Pressable onPressIn={_customerTab6}>
                  {activeTab == 6 ? (
                    <MaterialCommunityIcons
                      name="minus"
                      color={Colors.white}

                      size={26}></MaterialCommunityIcons>
                  ) : (
                    <MaterialCommunityIcons
                      name="plus"
                      color={Colors.white}

                      size={26}></MaterialCommunityIcons>
                  )}
                </Pressable>
              </Pressable>

              {activeTab == 6 && (
                <View style={{ flex: 1 }}>
                  <View style={styles.bounceview}>

                    <View style={styles.row2}>
                      <FormInputs
                        text={'Country'}
                        required={true}
                        editable={false}
                        error={
                          allDataobj.customerInfo[array_index]
                            .customer_pre_country.error
                        }
                        value={
                          allDataobj.customerInfo[array_index]
                            .customer_pre_country.value
                        }
                        onChangeText={(value: string) => {
                          let get = allDataobj;
                          get.customerInfo[
                            array_index
                          ].customer_pre_country.value = value;
                          get.customerInfo[
                            array_index
                          ].customer_pre_country.error = false;
                          setAlldataobj({ ...get });
                        }}></FormInputs>
                      {/* <FormInputs
                        required={true}
                        text={'State/Province'}
                        error={
                          allDataobj.customerInfo[array_index]
                            .customer_pre_stateProvince.error
                        }
                        value={
                          allDataobj.customerInfo[array_index]
                            .customer_pre_stateProvince.value
                        }
                        onChangeText={(value: string) => {
                          let get = allDataobj;
                          get.customerInfo[
                            array_index
                          ].customer_pre_stateProvince.value = value;
                          setAlldataobj({ ...get });
                          get.customerInfo[
                            array_index
                          ].customer_pre_stateProvince.error = false;
                        }}></FormInputs> */}

                      <CustomDropdown
                        text={"State/Province"}
                        required={true}
                        tempdata={organizationRegions}
                        label={
                          allDataobj.customerInfo[array_index].customer_pre_stateProvince.value ==
                            ''
                            ? 'State/Province'
                            : allDataobj.customerInfo[array_index].customer_pre_stateProvince.value
                        }
                        type={2}
                        onSelect={async (value, underindex) => {
                          regionId = value.RegionId;
                          let get = allDataobj;

                          setDistricts([{ name: '' }])
                          setTaluka([{ name: '' }])
                          setUc([{ name: '' }])
                          setMohalla([{ name: '' }])

                          get.customerInfo[
                            array_index
                          ].customer_pre_district = { value: '', index: '' }

                          get.customerInfo[
                            array_index
                          ].customer_pre_taluka = { value: '', index: '' }

                          get.customerInfo[
                            array_index
                          ].customer_pre_uc = { value: '', index: '' }
                          get.customerInfo[
                            array_index
                          ].customer_pre_mohalla = { value: '', index: '' }
                          get.customerInfo[
                            array_index
                          ].customer_pre_stateProvince = { value: value.name, index: underindex }

                          setAlldataobj({ ...get });
                          let setDistrcit = getRegions.filter(selDistricts);

                          setDistricts(setDistrcit)


                        }}

                      />
                    </View>

                    <View style={styles.row2}>
                      {/* <FormInputs
                        required={true}
                        text={'District'}
                        error={
                          allDataobj.customerInfo[array_index]
                            .customer_pre_district.error
                        }
                        value={
                          allDataobj.customerInfo[array_index]
                            .customer_pre_district.value
                        }
                        onChangeText={(value: string) => {
                          let get = allDataobj;
                          get.customerInfo[
                            array_index
                          ].customer_pre_district.value = value;
                          get.customerInfo[
                            array_index
                          ].customer_pre_district.error = false;
                          setAlldataobj({ ...get });
                        }}></FormInputs> */}
                      <CustomDropdown
                        text={"District"}
                        required={true}
                        tempdata={districts}
                        label={
                          allDataobj.customerInfo[array_index].customer_pre_district.value ==
                            ''
                            ? 'Select District'
                            : allDataobj.customerInfo[array_index].customer_pre_district.value
                        }
                        type={2}
                        onSelect={async (value, underindex) => {
                          regionId = value.RegionId
                          let get = allDataobj;

                          setTaluka([{ name: '' }])
                          setUc([{ name: '' }])
                          setMohalla([{ name: '' }])

                          get.customerInfo[
                            array_index
                          ].customer_pre_taluka = { value: '', index: '' }

                          get.customerInfo[
                            array_index
                          ].customer_pre_uc = { value: '', index: '' }
                          get.customerInfo[
                            array_index
                          ].customer_pre_mohalla = { value: '', index: '' }
                          get.customerInfo[
                            array_index
                          ].customer_pre_district = { value: value.name, index: underindex }

                          setAlldataobj({ ...get });
                          let setTalukas = getRegions.filter(selDistricts);
                          setTaluka(setTalukas)

                        }}
                      />
                      {/* <FormInputs
                        required={true}
                        text={'Taluka'}
                        error={
                          allDataobj.customerInfo[array_index].customer_pre_taluka
                            .error
                        }
                        value={
                          allDataobj.customerInfo[array_index].customer_pre_taluka
                            .value
                        }
                        onChangeText={(value: string) => {
                          let get = allDataobj;
                          get.customerInfo[
                            array_index
                          ].customer_pre_taluka.value = value;
                          get.customerInfo[
                            array_index
                          ].customer_pre_taluka.error = false;
                          setAlldataobj({ ...get });
                        }}></FormInputs> */}

                      <CustomDropdown
                        text={"Taluka"}
                        required={true}
                        tempdata={taluka}
                        label={
                          allDataobj.customerInfo[array_index].customer_pre_taluka.value ==
                            ''
                            ? 'Select Taluka'
                            : allDataobj.customerInfo[array_index].customer_pre_taluka.value
                        }
                        type={2}
                        onSelect={async (value, underindex) => {
                          regionId = value.RegionId
                          let get = allDataobj;

                          setUc([{ name: '' }])
                          setMohalla([{ name: '' }])

                          get.customerInfo[
                            array_index
                          ].customer_pre_uc = { value: '', index: '' }

                          get.customerInfo[
                            array_index
                          ].customer_pre_mohalla = { value: '', index: '' }

                          get.customerInfo[
                            array_index
                          ].customer_pre_taluka = { value: value.name, index: underindex }

                          setAlldataobj({ ...get });
                          let setuc = getRegions.filter(selDistricts);
                          setUc(setuc)
                          setMohalla([{ name: '' }])

                        }}
                      />

                    </View>

                    <View style={styles.row2}>
                      {/* <FormInputs
                        required={true}
                        text={'UC'}
                        value={
                          allDataobj.customerInfo[array_index].customer_pre_uc
                            .value
                        }
                        error={
                          allDataobj.customerInfo[array_index].customer_pre_uc
                            .error
                        }
                        onChangeText={(value: string) => {
                          let get = allDataobj;
                          get.customerInfo[array_index].customer_pre_uc.value =
                            value;
                          get.customerInfo[array_index].customer_pre_uc.error =
                            false;
                          setAlldataobj({ ...get });
                        }}></FormInputs> */}

                      <CustomDropdown
                        text={"UC"}
                        required={true}
                        tempdata={uc}
                        label={
                          allDataobj.customerInfo[array_index].customer_pre_uc.value ==
                            ''
                            ? 'Select UC'
                            : allDataobj.customerInfo[array_index].customer_pre_uc.value
                        }
                        type={2}
                        onSelect={async (value, underindex) => {
                          regionId = value.RegionId
                          setMohalla([{ name: '' }])
                          let get = allDataobj;

                          get.customerInfo[
                            array_index
                          ].customer_pre_uc = { value: value.name, index: underindex }

                          get.customerInfo[
                            array_index
                          ].customer_pre_mohalla = { value: '', index: '' }

                          setAlldataobj({ ...get });
                          let setMohala = getRegions.filter(selDistricts);
                          setMohalla(setMohala)
                        }}
                      />

                      {/* <FormInputs
                        required={true}
                        text={'Mohalla/Village'}
                        error={
                          allDataobj.customerInfo[array_index]
                            .customer_pre_mohalla.error
                        }
                        value={
                          allDataobj.customerInfo[array_index]
                            .customer_pre_mohalla.value
                        }
                        onChangeText={(value: string) => {
                          let get = allDataobj;
                          get.customerInfo[
                            array_index
                          ].customer_pre_mohalla.value = value;
                          get.customerInfo[
                            array_index
                          ].customer_pre_mohalla.error = false;
                          setAlldataobj({ ...get });
                        }}></FormInputs> */}
                      <CustomDropdown
                        text={"Mohalla/Village"}
                        required={true}
                        tempdata={mohalla}
                        label={
                          allDataobj.customerInfo[array_index].customer_pre_mohalla.value ==
                            ''
                            ? 'Select Mohalla/Village'
                            : allDataobj.customerInfo[array_index].customer_pre_mohalla.value
                        }
                        type={2}
                        onSelect={async (value, underindex) => {
                          regionId = value.RegionId
                          let get = allDataobj;
                          get.customerInfo[
                            array_index
                          ].customer_pre_mohalla = { value: value.name, index: underindex }

                          setAlldataobj({ ...get });

                        }}
                      />
                    </View>
                    <View style={styles.row2}>
                      <FormInputs
                        required={true}
                        text={'City'}
                        editable={false}
                        error={
                          allDataobj.customerInfo[array_index].customer_pre_city
                            .error
                        }
                        value={
                          allDataobj.customerInfo[array_index].customer_pre_city
                            .value
                        }
                        onChangeText={(value: string) => {
                          let get = allDataobj;
                          get.customerInfo[array_index].customer_pre_city.value =
                            value;
                          get.customerInfo[array_index].customer_pre_city.error =
                            false;
                          setAlldataobj({ ...get });
                        }}></FormInputs>
                      <FormInputs
                        required={true}
                        editable={false}
                        text={'Address'}
                        error={
                          allDataobj.customerInfo[array_index]
                            .customer_pre_address.error
                        }
                        value={
                          allDataobj.customerInfo[array_index]
                            .customer_pre_address.value
                        }
                        onChangeText={(value: string) => {
                          let get = allDataobj;
                          get.customerInfo[
                            array_index
                          ].customer_pre_address.value = value;
                          get.customerInfo[
                            array_index
                          ].customer_pre_address.error = false;
                          setAlldataobj({ ...get });
                        }}></FormInputs>
                    </View>
                  </View>
                  {/* //----------------------Permanent address-------------------- */}
                  <View style={styles.bounceview}>
                    <View
                      style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        marginTop: 10,
                        marginBottom: 10,
                        marginLeft: 10,
                      }}>
                      <Checkbox
                        color={Colors.parrotGreenColor}
                        status={checkedforAddress ? 'checked' : 'unchecked'}
                        onPress={checkForPermentAddress}
                      />
                      <TextView
                        style={{ marginLeft: 10 }}
                        type={'small'}
                        text={'Same as Permanent Address'}></TextView>
                    </View>
                    <View style={styles.row2}>
                      <FormInputs
                        error={
                          allDataobj.customerInfo[array_index]
                            .customer_per_country.error
                        }
                        required={true}
                        editable={false}
                        text={'Country'}
                        value={
                          allDataobj.customerInfo[array_index]
                            .customer_per_country.value
                        }
                        onChangeText={(value: string) => {
                          let get = allDataobj;
                          get.customerInfo[
                            array_index
                          ].customer_per_country.value = value;
                          get.customerInfo[
                            array_index
                          ].customer_per_country.error = false;
                          setAlldataobj({ ...get });
                        }}></FormInputs>
                      {/* <FormInputs
                        required={true}
                        text={'State/Province'}
                        error={
                          allDataobj.customerInfo[array_index]
                            .customer_per_stateProvince.error
                        }
                        value={
                          allDataobj.customerInfo[array_index]
                            .customer_per_stateProvince.value
                        }
                        onChangeText={(value: string) => {
                          let get = allDataobj;
                          get.customerInfo[
                            array_index
                          ].customer_per_stateProvince.value = value;
                          get.customerInfo[
                            array_index
                          ].customer_per_stateProvince.error = false;
                          setAlldataobj({ ...get });
                        }}></FormInputs> */}
                      <CustomDropdown
                        text={"State/Province"}
                        required={true}
                        tempdata={organizationRegions}
                        label={
                          allDataobj.customerInfo[array_index].customer_per_stateProvince.value ==
                            ''
                            ? 'State/Province'
                            : allDataobj.customerInfo[array_index].customer_per_stateProvince.value
                        }
                        type={2}
                        onSelect={async (value, underindex) => {
                          regionId = value.RegionId;
                          let get = allDataobj;

                          setDistricts([{ name: '' }])
                          setTaluka([{ name: '' }])
                          setUc([{ name: '' }])
                          setMohalla([{ name: '' }])

                          get.customerInfo[
                            array_index
                          ].customer_per_district = { value: '', index: '' }

                          get.customerInfo[
                            array_index
                          ].customer_per_taluka = { value: '', index: '' }

                          get.customerInfo[
                            array_index
                          ].customer_per_uc = { value: '', index: '' }

                          get.customerInfo[
                            array_index
                          ].customer_per_mohalla = { value: '', index: '' }

                          get.customerInfo[
                            array_index
                          ].customer_per_stateProvince = { value: value.name, index: underindex }

                          setAlldataobj({ ...get });
                          let setDistrcit = getRegions.filter(selDistricts);

                          setDistricts(setDistrcit)


                        }}

                      />
                    </View>

                    <View style={styles.row2}>
                      {/* <FormInputs
                        required={true}
                        text={'District'}
                        error={
                          allDataobj.customerInfo[array_index]
                            .customer_pre_district.error
                        }
                        value={
                          allDataobj.customerInfo[array_index]
                            .customer_pre_district.value
                        }
                        onChangeText={(value: string) => {
                          let get = allDataobj;
                          get.customerInfo[
                            array_index
                          ].customer_pre_district.value = value;
                          get.customerInfo[
                            array_index
                          ].customer_pre_district.error = false;
                          setAlldataobj({ ...get });
                        }}></FormInputs> */}
                      <CustomDropdown
                        text={"District"}
                        required={true}
                        tempdata={districts}
                        label={
                          allDataobj.customerInfo[array_index].customer_per_district.value ==
                            ''
                            ? 'Select District'
                            : allDataobj.customerInfo[array_index].customer_per_district.value
                        }
                        type={2}
                        onSelect={async (value, underindex) => {
                          regionId = value.RegionId
                          let get = allDataobj;

                          setTaluka([{ name: '' }])
                          setUc([{ name: '' }])
                          setMohalla([{ name: '' }])

                          get.customerInfo[
                            array_index
                          ].customer_per_taluka = { value: '', index: '' }

                          get.customerInfo[
                            array_index
                          ].customer_per_uc = { value: '', index: '' }

                          get.customerInfo[
                            array_index
                          ].customer_per_mohalla = { value: '', index: '' }

                          get.customerInfo[
                            array_index
                          ].customer_per_district = { value: value.name, index: underindex }

                          setAlldataobj({ ...get });
                          let setTalukas = getRegions.filter(selDistricts);
                          setTaluka(setTalukas)

                        }}
                      />
                      {/* <FormInputs
                        required={true}
                        text={'Taluka'}
                        error={
                          allDataobj.customerInfo[array_index].customer_pre_taluka
                            .error
                        }
                        value={
                          allDataobj.customerInfo[array_index].customer_pre_taluka
                            .value
                        }
                        onChangeText={(value: string) => {
                          let get = allDataobj;
                          get.customerInfo[
                            array_index
                          ].customer_pre_taluka.value = value;
                          get.customerInfo[
                            array_index
                          ].customer_pre_taluka.error = false;
                          setAlldataobj({ ...get });
                        }}></FormInputs> */}

                      <CustomDropdown
                        text={"Taluka"}
                        required={true}
                        tempdata={taluka}
                        label={
                          allDataobj.customerInfo[array_index].customer_per_taluka.value ==
                            ''
                            ? 'Select Taluka'
                            : allDataobj.customerInfo[array_index].customer_per_taluka.value
                        }
                        type={2}
                        onSelect={async (value, underindex) => {
                          regionId = value.RegionId
                          let get = allDataobj;

                          setUc([{ name: '' }])
                          setMohalla([{ name: '' }])

                          get.customerInfo[
                            array_index
                          ].customer_per_uc = { value: '', index: '' }

                          get.customerInfo[
                            array_index
                          ].customer_per_mohalla = { value: '', index: '' }

                          get.customerInfo[
                            array_index
                          ].customer_per_taluka = { value: value.name, index: underindex }

                          setAlldataobj({ ...get });
                          let setuc = getRegions.filter(selDistricts);
                          setUc(setuc)


                        }}
                      />

                    </View>

                    <View style={styles.row2}>
                      {/* <FormInputs
                        required={true}
                        text={'UC'}
                        error={
                          allDataobj.customerInfo[array_index].customer_per_uc
                            .error
                        }
                        value={
                          allDataobj.customerInfo[array_index].customer_per_uc
                            .value
                        }
                        onChangeText={(value: string) => {
                          let get = allDataobj;
                          get.customerInfo[array_index].customer_per_uc.value =
                            value;
                          get.customerInfo[array_index].customer_per_uc.error =
                            false;
                          setAlldataobj({ ...get });
                        }}></FormInputs> */}
                      <CustomDropdown
                        text={"UC"}
                        required={true}
                        tempdata={uc}
                        label={
                          allDataobj.customerInfo[array_index].customer_per_uc.value ==
                            ''
                            ? 'Select UC'
                            : allDataobj.customerInfo[array_index].customer_per_uc.value
                        }
                        type={2}
                        onSelect={async (value, underindex) => {
                          regionId = value.RegionId
                          setMohalla([{ name: '' }])
                          let get = allDataobj;
                          get.customerInfo[
                            array_index
                          ].customer_per_mohalla = { value: '', index: '' }
                          get.customerInfo[
                            array_index
                          ].customer_per_uc = { value: value.name, index: underindex }

                          setAlldataobj({ ...get });
                          let setMohala = getRegions.filter(selDistricts);
                          setMohalla(setMohala)
                        }}
                      />
                      {/* <FormInputs
                        required={true}
                        text={'Mohalla/Village'}
                        error={
                          allDataobj.customerInfo[array_index]
                            .customer_per_mohalla.error
                        }
                        value={
                          allDataobj.customerInfo[array_index]
                            .customer_per_mohalla.value
                        }
                        onChangeText={(value: string) => {
                          let get = allDataobj;
                          get.customerInfo[
                            array_index
                          ].customer_per_mohalla.value = value;
                          get.customerInfo[
                            array_index
                          ].customer_per_mohalla.error = false;
                          setAlldataobj({ ...get });
                        }}></FormInputs> */}
                      <CustomDropdown
                        text={"Mohalla/Village"}
                        required={true}
                        tempdata={mohalla}
                        label={
                          allDataobj.customerInfo[array_index].customer_per_mohalla.value ==
                            ''
                            ? 'Select Mohalla/Village'
                            : allDataobj.customerInfo[array_index].customer_per_mohalla.value
                        }
                        type={2}
                        onSelect={async (value, underindex) => {
                          regionId = value.RegionId
                          let get = allDataobj;
                          get.customerInfo[
                            array_index
                          ].customer_per_mohalla = { value: value.name, index: underindex }

                          setAlldataobj({ ...get });

                        }}
                      />
                    </View>
                    <View style={styles.row2}>
                      <FormInputs
                        text={'City'}
                        required={true}
                        error={
                          allDataobj.customerInfo[array_index].customer_per_city
                            .error
                        }
                        value={
                          allDataobj.customerInfo[array_index].customer_per_city
                            .value
                        }
                        onChangeText={(value: string) => {
                          let get = allDataobj;
                          get.customerInfo[array_index].customer_per_city.value =
                            value;
                          get.customerInfo[array_index].customer_per_city.error =
                            false;
                          setAlldataobj({ ...get });
                        }}></FormInputs>
                      <FormInputs
                        text={'Address'}
                        required={true}
                        error={
                          allDataobj.customerInfo[array_index]
                            .customer_per_address.error
                        }
                        value={
                          allDataobj.customerInfo[array_index]
                            .customer_per_address.value
                        }
                        onChangeText={(value: string) => {
                          let get = allDataobj;
                          get.customerInfo[
                            array_index
                          ].customer_per_address.value = value;
                          get.customerInfo[
                            array_index
                          ].customer_per_address.error = false;
                          setAlldataobj({ ...get });
                        }}></FormInputs>
                    </View>



                    <View style={styles.row2}>
                      <FormInputs
                        text={'Number of years at present address'}
                        // keyboardtype={"decimal-pad"}
                        required={true}
                        error={
                          allDataobj.customerInfo[array_index]
                            .numberOfyear.error
                        }
                        value={
                          allDataobj.customerInfo[array_index]
                            .numberOfyear.value
                        }
                        onChangeText={(value: string) => {
                          var format = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/;
                          if (format.test(value)) {
                            return
                          }
                          let get = allDataobj;
                          get.customerInfo[
                            array_index
                          ].numberOfyear.value = value;
                          get.customerInfo[
                            array_index
                          ].numberOfyear.error = false;
                          setAlldataobj({ ...get });
                        }}></FormInputs>
                      <FormInputs
                        text={'Notes'}
                        error={
                          allDataobj.customerInfo[array_index]
                            .addressnotes.error
                        }
                        value={
                          allDataobj.customerInfo[array_index]
                            .addressnotes.value
                        }
                        onChangeText={(value: string) => {

                          if (!numericandAlphabets.test(value)) {
                            return
                          }
                          let get = allDataobj;
                          get.customerInfo[
                            array_index
                          ].addressnotes.value = value;
                          setAlldataobj({ ...get });
                          get.customerInfo[
                            array_index
                          ].addressnotes.error = false;
                        }}></FormInputs>
                    </View>


                  </View>
                </View>
              )}
            </View>

            {/* //-==-----------------------Health ------------------------- */}

            <View style={[styles.box, {}]}>
              <Pressable onPressIn={_customerTab8} style={styles.buttomheader}>
                <TextView
                  type={'Light'}
                  text="Customer Health Information"
                  style={{ color: Colors.white }}></TextView>
                <Pressable onPressIn={_customerTab8}>
                  {activeTab == 8 ? (
                    <MaterialCommunityIcons
                      name="minus"
                      color={Colors.white}

                      size={26}></MaterialCommunityIcons>
                  ) : (
                    <MaterialCommunityIcons
                      name="plus"
                      color={Colors.white}

                      size={26}></MaterialCommunityIcons>
                  )}
                </Pressable>
              </Pressable>

              {activeTab == 8 && (
                <View style={styles.bounceview}>
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      marginTop: 10,
                      marginBottom: 10,
                      marginLeft: 10,
                    }}>
                    <Checkbox
                      color={Colors.parrotGreenColor}
                      status={
                        allDataobj.customerInfo[array_index].customer_disable
                          ? 'checked'
                          : 'unchecked'
                      }
                      onPress={() => {
                        let get = allDataobj;
                        get.customerInfo[array_index].customer_disable =
                          checkedforDisable ? false : true;
                        setAlldataobj({ ...get });
                        setCheckedforDisable(!checkedforDisable);
                      }}
                    />
                    <TextView
                      style={{ marginLeft: 10 }}
                      type={'small'}
                      text={'Is Disable ?'}></TextView>
                  </View>
                  <View style={styles.row2}>
                    {
                      allDataobj.customerInfo[array_index].customer_labourtytestintwoyear != undefined &&
                      allDataobj.customerInfo[array_index].customer_labourtytestintwoyear.value == "Yes" &&
                      <FormInputs
                        required={true}
                        error={
                          allDataobj.customerInfo[array_index].customer_health.error
                        }
                        text={'Mention client health tests'}
                        value={
                          allDataobj.customerInfo[array_index].customer_health.value
                        }
                        onChangeText={(value: string) => {
                          if (!numericandAlphabets.test(value)) {
                            return
                          }
                          let get = allDataobj;
                          get.customerInfo[array_index].customer_health.value =
                            value;
                          setAlldataobj({ ...get });
                        }}></FormInputs>
                    }
                    <View style={{ marginTop: 0 }}>

                      {/* <CustomDropdown
                          // text={"The physical health condition of the applicant"}
                          required={true}
                          tempdata={physicalHealth}
                          label={
                            allDataobj.customerInfo[array_index]
                            .customer_physicalHealth == undefined
                            ? 'The physical health condition of the applicant '
                            : allDataobj.customerInfo[array_index]
                              .customer_physicalHealth.value
                          }
                          onSelect={async (value, underindex) => {
                            let get = allDataobj;
                          get.customerInfo[array_index].customer_physicalHealth = { value: physicalHealth[underindex], index: underindex }
                          //physicalHealth[index];
                          setAlldataobj({ ...get });
                          }}

                          /> */}

                      {/*------- old dropdown---------------- */}
                      <TextView type={'formLabel'} text={"The physical health condition of the applicant"}
                        style={{ color: '#737373', marginLeft: 10, width: width / 3, marginBottom: -20 }}></TextView>
                      <Dropdownlist
                        data={physicalHealth}

                        required={true}
                        RT={1}
                        label={
                          allDataobj.customerInfo[array_index]
                            .customer_physicalHealth == undefined
                            ? 'Select'
                            : allDataobj.customerInfo[array_index]
                              .customer_physicalHealth.value
                        }


                        onSelect={async value => {
                          let get = allDataobj;
                          get.customerInfo[array_index].customer_physicalHealth =
                            { value: physicalHealth[value], index: value }
                          setAlldataobj({ ...get });
                        }}></Dropdownlist>
                      {/* old dropdown end */}
                    </View>
                  </View>

                  <View style={styles.row2}>
                    <View style={{ marginTop: 0 }}>

                      {/*-------- old dropdown------------ */}
                      <TextView type={'formLabel'} text={"Found in any illness/disease"}
                        style={{ color: '#737373', marginLeft: 10, width: width / 3, marginBottom: -20 }}></TextView>
                      <Dropdownlist
                        required={true}
                        data={foundIllness}
                        RT={2}
                        label={
                          allDataobj.customerInfo[array_index]
                            .customer_anyillness == undefined
                            ? 'Select'
                            : allDataobj.customerInfo[array_index]
                              .customer_anyillness.value
                        }
                        onSelect={async value => {
                          let get = allDataobj;

                          get.customerInfo[array_index].customer_anyillness = { value: foundIllness[value], index: value }
                          setAlldataobj({ ...get });
                        }}></Dropdownlist>
                      {/*----- end old dropdown---------- */}
                    </View>

                    <View style={{ marginTop: 0 }}>

                      {/*-------------old dropdown---------------*/}
                      <TextView type={'formLabel'} text={"Laboratory test in last 2 years"}
                        style={{ color: '#737373', marginLeft: 10, width: width / 3, marginBottom: -20 }}></TextView>
                      <Dropdownlist
                        required={true}
                        data={laboratoryTest}
                        RT={1}
                        label={
                          allDataobj.customerInfo[array_index]
                            .customer_labourtytestintwoyear == undefined
                            ? 'Select'
                            : allDataobj.customerInfo[array_index]
                              .customer_labourtytestintwoyear.value
                        }
                        onSelect={async value => {
                          let get = allDataobj;

                          get.customerInfo[
                            array_index
                          ].customer_labourtytestintwoyear = { value: laboratoryTest[value], index: value };

                          setAlldataobj({ ...get });
                        }}></Dropdownlist>
                      {/*------------ old dropdown end-------------- */}
                    </View>
                  </View>


                  {allDataobj.customerInfo[array_index].customer_anyillness != undefined && allDataobj.customerInfo[array_index]
                    .customer_anyillness.value == "Yes" &&
                    <View style={styles.row2}>
                      <View style={{ marginTop: 0 }}>

                        {/*-------- old dropdown------------ */}
                        <TextView type={'formLabel'} text={"Client Disease"}
                          style={{ color: '#737373', marginLeft: 10, width: width / 3, marginBottom: -20 }}></TextView>
                        <Dropdownlist
                          data={ClientDisease}
                          RT={2}
                          label={
                            allDataobj.customerInfo[array_index]
                              .customer_disease == undefined
                              ? 'Select'
                              : allDataobj.customerInfo[array_index]
                                .customer_disease.value
                          }
                          onSelect={async value => {
                            let get = allDataobj;
                            get.customerInfo[
                              array_index
                            ].customer_disease = { value: ClientDisease[value], index: value };
                            setAlldataobj({ ...get });
                          }}></Dropdownlist>
                        {/*----- end old dropdown---------- */}
                      </View>

                      <View style={{ marginTop: 0 }}>


                      </View>
                    </View>
                  }
                </View>
              )}

            </View>
          </View>
        )}
        {/* //-----------------------Bottom Buttom */}

        {/* //-----------------------Dialogs */}
        <SelectPhotosDialoge
          dialogVisible={dialoge}
          onBarcode={() => {
            setTorchOn(true);
            setDialoge(false);
          }}
          onQrcode={() => {
            setQrcodeOn(true);
            setDialoge(false);
          }}
          closeModal={() => {
            setDialoge(false);
          }}
          enableInput={() => {
            setEditable(true);

          }}
          onPress={closeDialog}></SelectPhotosDialoge>
        {/* //---------------------------------- */}
        {torchOn && (
          <BarcodeScreen
            visible={torchOn}
            setVisible={setTorchOn}
            setAlldataobj={setAlldataobj}
            allDataobj={allDataobj}
            array_index={array_index}
            cnicFor={cnicUpdatefor}

          />
        )}
        {QrcodeOn && <QrcodeScreen visible={QrcodeOn}
          setVisible={setQrcodeOn}
          setAlldataobj={setAlldataobj}
          allDataobj={allDataobj}
          array_index={array_index}
          cnicFor={cnicUpdatefor}
        />}
        {/* </KeyboardAvoidingView> */}
        <BottomButton onPressNext={_onClickNext}
          show={updateCheck.value ? 4 : 1}
        ></BottomButton>
      </ScrollView>
      <CustomProgressDialoge
        dialogVisible={isLoading}
        setDialogVisible={setLoading}
        title={"Getting Location..."}
      />
      <Toast {...toast} onDismiss={() => setToast({ message: "", type: "" })} />

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
export default connect(null, mapDispatchToProps)(memo(Customerinfo));
const styles = StyleSheet.create({
  row2: {
    marginTop: 0,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingBottom: 20
  },
  preview: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  text: {},
  bounceview: GlobalStyles.bounceview,
  buttomheader: GlobalStyles.buttomheader,
  box: GlobalStyles.box
});
