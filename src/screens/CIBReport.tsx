import React, { useEffect, useState, useRef } from "react";
import { ActivityIndicator, Alert, Dimensions, SafeAreaView, ScrollView, StyleSheet, TextInput , Text } from "react-native";
import { View } from "react-native-animatable";
import { AppStatusBar, CnicInputoptions, CustomDropdown, CustomRadio, DateSelector, FormInputs, Header, HeaderwithoutDialoge, TextView } from "../components";
import {Checkbox} from "react-native-paper";
import { Colors, GlobalStyles } from "../theme";
const { width, height } = Dimensions.get("window");
import { RadioButton } from 'react-native-paper';
import { TouchableOpacity } from "react-native-gesture-handler";
import { useSelector, useDispatch, connect } from 'react-redux';
import { getEmployeesAccordStationId, insertCustomerFromDataWithRow, insertCibReport, getCustomerFromsAndAnswers } from "../sqlite/sqlitedb";
import { getAllRegion, getAllDistrict, checkingCIBCustomerbyCnic, generatingCIB, fetchCIBReport, generatingCIR, fetchCIRReport, checkingCIRCustomerbyCnic, getCustomerNextKin, getDonorData } from "../apis_auth/apis";
import Toast from "../components/Toast";
import { useNavigation } from '@react-navigation/native';
import { Modalize } from 'react-native-modalize';
import CIBView from "../components/CIBView";
import { parse } from "react-native-svg";
import Dropdownlist from '../components/Dropdownlist';
import CirView from "../components/CirView";
import axios from "axios";

const CIBReport = (props) => {
     const [filteredData, setFilteredData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
    const [data, setData] = useState(null);
    const navigation = useNavigation();
    const CIBReportObject = useSelector(state => state.CIBReportReducer.CIBReportObject);
    const getUserData = useSelector((state) => state.UserData);
    const gettingStations = getUserData.UserData.EmployeeStation
    const [loader, setLoader] = useState(false)
    const [CIBReportData, setCIBReport] = useState(CIBReportObject);
   // console.log("=CIBReportObject==================================>,",CIBReportObject)
    // const [checkingCnic, setCheckingCnic] = useState("41201-7742757-9")
    const [checkingCnic, setCheckingCnic] = useState("")
    const [getStation, setStation] = React.useState([])
    const [EmployeeArray, setEmployeeArray] = React.useState([])
    const [noData, setNoData] = React.useState(true)
    const [allRegions, setAllRegions] = React.useState(undefined)
    const [selectedRegion, setSelectedRegion] = React.useState(undefined)
    const [allDistrict, setAllDistrict] = React.useState(undefined)
    const [showMessage, setShowMessage] = React.useState(undefined)
    const [toast, setToast] = React.useState({ value: "", type: "" });
    let speacial = /[^a-zA-Z0-9-]/g;
    const [checkingLoader, setCheckingLoader] = React.useState(false)
    const [checkEnquiryAdded, setCheckEnquiryAdded] = React.useState(false)
    const [cibReportResponse, setCibReportResponse] = React.useState(undefined)
    const CustomGetDataModule = useSelector(state => state.RequiredReducer.CustomGetDataModule);
    const CustomerAnsReducer = useSelector((state) => state.CustomerAnsReducer.answerArray);
    const [allDataobj, setAlldataobj] = React.useState(CustomGetDataModule);
    const [reportType, setReportType] = React.useState(undefined);
    const [disableReportType, setDisableReportType] = React.useState(false);
    const [isRequiredSelected, setIsRequiredSelected] = useState(false);
    const [alertMessage, setAlertMessage] = useState('');
    //my code
    // const [fieldSets, setFieldSets] = useState(1);
    // const [isRequiredSelected, setIsRequiredSelected] = useState(false);
    // const handleAddButtonPress = () => {
    //   if (fieldSets < 4) {
    //     setFieldSets(fieldSets + 1);
    //   }
    // };

    const OrganizationType = Number(getUserData?.UserData?.OrganizationType);
    const loanLabel = OrganizationType === 2 ? 'Finance Facility' : 'Loan';
   
    
    const _newFunction = (CnicNumber) => {

        var data = new FormData();
        data.append('CnicNumber', CnicNumber);

        axios.post('http://mms.safcomicrofinance.com.pk/employees/ReactData/checkloantaken.php', data)
        .then(response => {
            
            console.log('Full Response:', response);
            
            
            const responseData = response.data;
            
           
            console.log('Response Data:', responseData);
            if (responseData.Status) {
                setAlertMessage(responseData.Status); 
            } else {
                setAlertMessage(''); 
            }
        })
        .catch(error => {
            
            console.error('Error:', error);
        });
    };
   
    
    const array_index = 0;
    let temp = []
    let setDistrictArray = []
    const modalizeRef = useRef<Modalize>(null);
    const cibModalizeRef = useRef<Modalize>(null);
    const onOpen = () => {

        modalizeRef.current?.open();

    };
    const showCirReport = () => {

        cibModalizeRef.current?.open();

    }
    React.useEffect(() => {

       // console.log("test=iam======>>>", allDistrict)
        // console.log("test=======>>>",getUserData.UserData.StationId)

        //     fetchCIBReport('41308-3493070-2').
        //     then((e) => {
        //         setToast({
        //             type: "success",
        //             message: e?.Message,
        //         });
        //         setCibReportResponse(e)
        //         // console.log("CibResponseReport===<",e)
        //         setCheckEnquiryAdded(true)

        //         setLoader(false) 
        //     }).
        //     catch((e) => {
        //         console.log("generatingCIBError===>",e)
        //         setToast({
        //             type: "error",
        //             message: e?.Message,
        //         });
        //  setLoader(false) 
        //     });


        getAllDistrict().then((district) => {
            district.map((item) => {
                setDistrictArray.push({ name: item.DistrictName, districtId: item.DistrictId })
            })

            setAllDistrict([...setDistrictArray])
        })

        getAllRegion().then((regions) => {
            // console.log("---<",regions)
            setAllRegions(regions)
        })
        gettingStations.map((item, index) => {
            temp.push({ name: item.StationName, stationId: item.StationId })
        })

        //console.log('station===>>>', temp)
        setStation([...temp])

    }, []);

    const setCustomerRegion = (empId) => {

        let temp = []

        allRegions?.map((item) => {
            if (empId == item.EmployeeId) {
                temp.push({ name: item.RegionName, RegionId: item.RegionId, EmployeeId: item.EmployeeId, StationId: item.StationId, EmployeeRegionId: item.EmployeeRegionId })
            }
        })

        setSelectedRegion(temp);
        //console.log(getCustomerRegion)

    }

    //----------- COMMON METHODS ------------//

    const _handleShowData = () => {
        // alert(JSON.stringify(showMessage?.object?.sLastName))
        // console.log("showMessage===>>>", CIBReportData)
        let get = CIBReportData;
        get.customerFirstName.value = showMessage?.object?.sFirstName;
        get.customerStation.value = showMessage?.object?.sStationName;
        get.customerStation.id = showMessage?.object?.iStationId;

        get.customerNicNumber.value = showMessage?.object?.sNICNumber;
        get.customerSurname.value = showMessage?.object?.sLastName;
        get.customerFamilyNumber.value = showMessage?.object?.sFamilyNumber;
        get.customerSonOf.text = showMessage?.object?.sGuardian;
        get.customerGender.value = showMessage?.object?.cGender == "M" ? "1" : showMessage?.object?.cGender == "F" ? 2 : 3;
        get.customerAddress.value = showMessage?.object?.sAddress;
        get.customerCity.value = showMessage?.object?.sCity;
        get.customerRegion.value = showMessage?.object?.sRegionName;
        get.customerRegion.id = showMessage?.object?.iRegionId;

        get.customerMobileNumber.value = showMessage?.object?.sMobileNumber;
        get.customerPhoneNumber.value = showMessage?.object?.sPhoneNumber;
        get.customerEmail.value = showMessage?.object?.sEmailAddress;
        get.customerNicExpiryDate.value = showMessage?.object?.dNICExpiryDate;
        get.customerDateOfBirth.value = showMessage?.object?.dDateOfBirth;
        get.customerDistrict.value = showMessage?.object?.sDistrictName;
        get.customerDistrict.id = showMessage?.object?.iDistrictId;

        get.customerType.value = showMessage?.object?.iCustomerType == 1 ? "Urban" : "Rural";
        get.loanRequestedAmount.value = showMessage?.object?.dRequestedAmount;
        get.loanApplicationDate.value = showMessage?.object?.dApplicationDate;
        get.loanStatus.value = showMessage?.object?.iStatus == 1 ? "Approved" : "Rejected";

        setCIBReport({ ...get })
    }
    const updateCustomer = () => {

        const cutomerCnic = CIBReportData.customerNicNumber.value;

        getCustomerFromsAndAnswers(cutomerCnic).then((value) => {
            var parser = JSON.parse(value[0].forms)
            var customerId = JSON.parse(value[0].id)
            const customerAnswer = value[0].CustomerAnswers

            if (customerAnswer.length > 0) {
                props.Updatecheck({ value: true, id: customerId, customerAnswer: true })
                props.navigation.navigate('AddForm', { item: parser, user_cnic: cutomerCnic })
            } else {
                props.Updatecheck({ value: true, id: customerId, customerAnswer: false })

                props.navigation.navigate('HalafNama', { item: parser, user_cnic: cutomerCnic })
            }
        });

    }
    const addCustomer = (cibReportData, e) => {
        console.log(" data===>addCustomer")
        let get = CIBReportData;
        let geet = e;
        let getCustomerData = allDataobj;

        // //-------------------Set Customer Reducer for Customer Form-------------------//

        getCustomerData.customerInfo[
            array_index
        ].customer_name.value = get.customerFirstName.value;
        getCustomerData.customerInfo[
            array_index
        ].customer_supportingRequiredPerson_name.value = get.customerFirstName.value;
        getCustomerData.assestsInfo[
            array_index
        ].assetOwner.value = get.customerFirstName.value;

        getCustomerData.customerInfo[
            array_index
        ].customer_surname.value = get.customerSurname.value;

        getCustomerData.customerInfo[
            array_index
        ].customer_cnicExpireDate = get.customerNicExpiryDate.value;

        getCustomerData.customerInfo[
            array_index
        ].FamilyNumber.value = get.customerFamilyNumber.value;

        getCustomerData.customerInfo[
            array_index
        ].customer_fatherName.value = get.customerSonOf.value == 1 ? get.customerSonOf.text : "";

        getCustomerData.customerInfo[
            array_index
        ].customer_region = get.customerRegion.value

        getCustomerData.customerInfo[
            array_index
        ].customer_pre_district.value = get.customerDistrict.value

        getCustomerData.customerInfo[
            array_index
        ].customer_pre_city.value = get.customerCity.value

        getCustomerData.customerInfo[
            array_index
        ].customer_mobileNumber.value = get.customerMobileNumber.value

        getCustomerData.customerInfo[
            array_index
        ].customer_pre_address.value = get.customerAddress.value;

        getCustomerData.customerInfo[
            array_index
        ].customer_cnicNumber.value = get.customerNicNumber.value

        getCustomerData.customerInfo[
            array_index
        ].customer_dob = get.customerDateOfBirth.value

        getCustomerData.customerInfo[
            array_index
        ].customer_gender = get.customerGender.value == 1 ? "Male" : get.customerGender.value == 2 ? "Female" : "Transgender"

        getCustomerData.customerInfo[
            array_index
        ].customer_nextKinCnic.value = ""

        getCustomerData.customerInfo[
            array_index
        ].customer_nextKinName.value = ""

        getCustomerData.customerInfo[
            array_index
        ].customer_nextKinOtherRelation.value = ""
        //support

        getCustomerData.customerInfo[
            array_index
        ].customer_supportingPerson_name.value = ""

        getCustomerData.customerInfo[
            array_index
        ].customer_supportingPerson_cnic.value = ""

        getCustomerData.customerInfo[
            array_index
        ].customer_supportingPerson_relation.value = ""


        setAlldataobj({ ...getCustomerData });

        // return


        // console.log("Before Insert====>>"+JSON.stringify(getCustomerData) )
        // return

        //---------------------------------------------------------------------------

        insertCustomerFromDataWithRow(JSON.stringify(allDataobj), '', getCustomerData.customerInfo[array_index].customer_cnicNumber.value, getCustomerData.customerInfo[array_index].customer_name.value, "", getCustomerData.customerInfo[array_index].customer_mobileNumber.value, getCustomerData.customerInfo[array_index].customer_pre_address.value, "", "", "", "", "", "", "0").then((res) => {
            console.log("res", res.id);

            insertCibReport(JSON.stringify(cibReportData), get.customerNicNumber.value).then(() => {

                setCheckEnquiryAdded(true)

                setLoader(false)
                //navigation.goBack()

            })
        }).catch((err) => {
            console.log("--->", err);
        });

        //    }    
    }

    const addCustomer2 = (cibReportData, e) => {

        let get = CIBReportData;
        let geet = e;
        let getCustomerData = allDataobj;

        // //-------------------Set Customer Reducer for Customer Form-------------------//

        getCustomerData.customerInfo[
            array_index
        ].customer_name.value = get.customerFirstName.value;
        getCustomerData.customerInfo[
            array_index
        ].customer_supportingRequiredPerson_name.value = get.customerFirstName.value;
        getCustomerData.assestsInfo[
            array_index
        ].assetOwner.value = get.customerFirstName.value;

        getCustomerData.customerInfo[
            array_index
        ].customer_surname.value = get.customerSurname.value;

        getCustomerData.customerInfo[
            array_index
        ].customer_cnicExpireDate = get.customerNicExpiryDate.value;

        getCustomerData.customerInfo[
            array_index
        ].FamilyNumber.value = get.customerFamilyNumber.value;

        getCustomerData.customerInfo[
            array_index
        ].customer_fatherName.value = get.customerSonOf.value == 1 ? get.customerSonOf.text : "";

        getCustomerData.customerInfo[
            array_index
        ].customer_region = get.customerRegion.value

        getCustomerData.customerInfo[
            array_index
        ].customer_pre_district.value = get.customerDistrict.value

        getCustomerData.customerInfo[
            array_index
        ].customer_pre_city.value = get.customerCity.value

        getCustomerData.customerInfo[
            array_index
        ].customer_mobileNumber.value = get.customerMobileNumber.value

        getCustomerData.customerInfo[
            array_index
        ].customer_pre_address.value = get.customerAddress.value;

        getCustomerData.customerInfo[
            array_index
        ].customer_cnicNumber.value = get.customerNicNumber.value

        getCustomerData.customerInfo[
            array_index
        ].customer_dob = get.customerDateOfBirth.value

        getCustomerData.customerInfo[
            array_index
        ].customer_gender = get.customerGender.value == 1 ? "Male" : get.customerGender.value == 2 ? "Female" : "Transgender"

        getCustomerData.customerInfo[
            array_index
        ].customer_nextKinCnic.value = geet.NextOfKinCNIC

        getCustomerData.customerInfo[
            array_index
        ].customer_nextKinName.value = geet.nextOfKinName

        getCustomerData.customerInfo[
            array_index
        ].customer_nextKinRelation = geet.NextOfKinnRelation
        //support

        getCustomerData.customerInfo[
            array_index
        ].customer_supportingPerson_name.value = geet.SupportingPersonName

        getCustomerData.customerInfo[
            array_index
        ].customer_supportingPerson_cnic.value = geet.SupportingPersonCnic

        getCustomerData.customerInfo[
            array_index
        ].customer_supportingPerson_relation.value = geet.SupportingPersonRelation

        getCustomerData.customerInfo[
            array_index
        ].customer = geet.customer

        setAlldataobj({ ...getCustomerData });
        // console.log("Before Insert====>>"+JSON.stringify(getCustomerData.customerInfo) )
        // return

        //---------------------------------------------------------------------------

        insertCustomerFromDataWithRow(JSON.stringify(allDataobj), '', getCustomerData.customerInfo[array_index].customer_cnicNumber.value, getCustomerData.customerInfo[array_index].customer_name.value, "", getCustomerData.customerInfo[array_index].customer_mobileNumber.value, getCustomerData.customerInfo[array_index].customer_pre_address.value, "", "", "", "", "", "", "0").then((res) => {
            console.log("res", res.id);

            insertCibReport(JSON.stringify(cibReportData), get.customerNicNumber.value).then(() => {

                setCheckEnquiryAdded(true)

                setLoader(false)
                //navigation.goBack()

            })
        }).catch((err) => {
            console.log("--->", err);
        });

        //    }    
    }

    //----------- COMMON METHODS END ------------//

    // ---------- CIB Report Methods ------------

    const submitEnquiryProcess = () => {
        let get = CIBReportData;   
       // console.log('response cib---------------->>>>',get);


        if (get.customerStation.value == "") {
            setToast({
                type: "error",
                message: 'Sorry! Please select your station first',
            });

        } else if (get.customerRegion.value == "") {

            setToast({
                type: "error",
                message: 'Sorry! Please select your region first',
            });

        } else if (get.customerType.value == "") {

            setToast({
                type: "error",
                message: 'Sorry! Please select customer type first',
            });

        } else if (get.customerFirstName.value == "") {

            get.customerFirstName.error = true

            setToast({
                type: "error",
                message: 'Sorry! Please type your firstname',
            });

        } else if (get.customerSurname.value == "") {

            get.customerSurname.error = true

            setToast({
                type: "error",
                message: 'Sorry! Please type your surname',
            });

        } else if (get.customerStation.value == "") {

            setToast({
                type: "error",
                message: 'Sorry! Please select your station first',
            });

        } else if (get.customerDateOfBirth.value == "") {

            setToast({
                type: "error",
                message: 'Sorry! Please select your date of birth first',
            });

        }
        //  else if (get.customerFamilyNumber.value == "") {

        //     get.customerFamilyNumber.error = true

        //     setToast({
        //         type: "error",
        //         message: 'Sorry! Please select your family number',
        //     });

        // }
        else if (get.customerNicNumber.value == "") {

            get.customerNicNumber.error = true

            setToast({
                type: "error",
                message: 'Sorry! Please type your CNIC number',
            });

        } else if (get.customerNicExpiryDate.value == "") {

            setToast({
                type: "error",
                message: 'Sorry! Please select your CNIC expiry date',
            });

        } else if (get.customerAddress.value == "") {

            get.customerAddress.error = true

            setToast({
                type: "error",
                message: 'Sorry! Please type your address',
            });

        } else if (get.customerCity.value == "") {

            get.customerCity.error = true

            setToast({
                type: "error",
                message: 'Sorry! Please type your city name',
            });

        } else if (get.customerDistrict.value == "") {

            setToast({
                type: "error",
                message: 'Sorry! Please select your district first',
            });

        } else if (get.customerStation.value == "") {

            setToast({
                type: "error",
                message: 'Sorry! Please select your station first',
            });

        } else if (get.loanRequestedAmount.value == "" || get.loanRequestedAmount.value == undefined) {

            get.loanRequestedAmount.error = true

            setToast({
                type: "error",
                message: 'Sorry! Please select your requested amount first',
            });

        } else if (get.loanApplicationDate.value == "" || get.loanApplicationDate.value == undefined) {

            setToast({
                type: "error",
                message: 'Sorry! Please select your application date first',
            });

        } else if (get.loanStatus.value == "" || get.loanStatus.value == undefined) {

            setToast({
                type: "error",
                message: 'Sorry! Please select your status first',
            });

        } else if (get.loanAssociationType.value == "" || get.loanAssociationType.value == undefined) {

            setToast({
                type: "error",
                message: 'Sorry! Please select association type first',
            });

        }else if (get.KinFirstName.value == "" || get.KinFirstName.value == undefined) {

            setToast({
                type: "error",
                message: 'Sorry! Please write Kin First Name',
            });

        }else if (get.KinMiddleName.value == "" || get.KinMiddleName.value == undefined) {

            setToast({
                type: "error",
                message: 'Sorry! Please write Kin Middle Name',
            });

        }else if (get.KinLastName.value == "" || get.KinLastName.value == undefined) {

            setToast({
                type: "error",
                message: 'Sorry! Please write Kin Last Name',
            });

        }else if (get.KinNicNumber.value == "" || get.KinNicNumber.value == undefined) {

            setToast({
                type: "error",
                message: 'Sorry! Please write Kin NIC',
            });

        }  else if (get.customerMobileNumber.value == "") {
            setToast({
                type: "error",
                message: 'Sorry! Please type your mobile number',
            });
        } else {
            setLoader(true)

            var getCnic = get.customerNicNumber.value;
            var maker = getCnic?.split("-");

            const originalNic = get.KinNicNumber.value;
            const formattedNic = originalNic.replace(/-/g, '');

            const originalNic2 = get.KinSecondNicNumber.value;
            const formattedNic2 = originalNic2.replace(/-/g, '');

            const originalNic3 = get.KinThirdNicNumber.value;
            const formattedNic3 = originalNic3.replace(/-/g, '');

            const originalNic4 = get.KinFourNicNumber.value;
            const formattedNic4 = originalNic4.replace(/-/g, '');


            var enquiryData = {
                txtFirstName: get.customerFirstName.value,
                txtLastName: get.customerSurname.value,
                txtNICNumber1: maker[0],
                txtNICNumber2: maker[1],
                txtNICNumber3: maker[2],
                txtApplicationDate: get.loanApplicationDate.value,
                txtRequestedAmount: get.loanRequestedAmount.value,
                selStation: get.customerStation.id,
                selStatus: get.loanStatus.index,
                txtNotes: get.customerNotes.value,
                selRegion: get.customerRegion.id,
                selCustomerType: get.customerType.index,
                selGuardianType: get.customerSonOf.value,
                txtGuardian: get.customerSonOf.text,
                selGender: get.customerGender.text,
                txtDateOfBirth: get.customerDateOfBirth.value,
                txtFamilyNumber: get.customerFamilyNumber.value,
                txtNICExpiryDate: get.customerNicExpiryDate.value,
                txtAddress: get.customerAddress.value,
                txtCity: get.customerCity.value,
                selDistrict: get.customerDistrict.id,
                selAccountType: get.loanAccountType.index,
                selAssociationType: get.loanAssociationType.index,
                txtGroupId: get.loanGroupId.value,
                  //my code
                CO_FIRST_NAME_1: get.KinFirstName.value,
                CO_MID_NAME_1: get.KinMiddleName.value,
                CO_LAST_NAME_1: get.KinLastName.value,
                CO_CNIC_1: formattedNic,
         
                CO_FIRST_NAME_2: get.KinsecondFirstName.value,
                CO_MID_NAME_2: get.KinsecondMiddleName.value,
                CO_LAST_NAME_2: get.KinsecondLastName.value,
                CO_CNIC_2: formattedNic2,

                CO_FIRST_NAME_3: get.KinThirdFirstName.value,
                CO_MID_NAME_3: get.KinThirdMiddleName.value,
                CO_LAST_NAME_3: get.KinThirdLastName.value,
                CO_CNIC_3: formattedNic3,

                CO_FIRST_NAME_4: get.KinFourFirstName.value,
                CO_MID_NAME_4: get.KinFourMiddleName.value,
                CO_LAST_NAME_4: get.KinFourLastName.value,
                CO_CNIC_4: formattedNic4,

                txtMobileNumber: get.customerMobileNumber.value,
                txtPhoneNumber: get.customerPhoneNumber.value,
                txtEmailAddress: get.customerEmail.value,
                txtAddedBy: get.customerAddedBy.id,        
            };
           // console.log("==============================<",enquiryData)
             //return
            generatingCIB(enquiryData, getUserData.UserData.OrganizationType)
                .then((e) => {

                    if (e?.Return) {
                        getCustomerNextKin(get.customerNicNumber.value).
                            then((response) => {
                                fetchCIBReport(get.customerNicNumber.value).
                                    then((e) => {
                                        setToast({
                                            type: "success",
                                            message: e?.Message,
                                        });
                                        if (response.statusCode == 201) {
                                            setCibReportResponse(e, response)
                                            addCustomer(e, response)
                                        } else {
                                            setCibReportResponse(e, response)
                                            addCustomer2(e, response)
                                        }
                                    })
                            }).
                            catch((e) => {
                                console.log("generatingCIBError===>", e)
                                setToast({
                                    type: "error",
                                    message: e?.Message,
                                });
                                setLoader(false)
                            });
                    } else {
                        console.log("generatingCIBError Else from backkk===>", e)
                        setToast({
                            type: "error",
                            message: e?.Message,
                        });
                        setLoader(false)
                    }
                })
                .catch((e) => {
                    console.log("==>", e)
                    setLoader(false)
                })
        }
    }

    

    const _handleCnic = (value) => {
        if (speacial.test(value)) {
            return
        }
        var regexp = new RegExp('^[0-9+]{5}-[0-9+]{7}-[0-9]{1}$');
        if (value?.length < 16) {
            if (value?.length == 5 || value?.length == 13) {


                let get = checkingCnic;
                get = value + '-';
                setCheckingCnic(get)

            } else {

                let get = checkingCnic;
                get = value;
                setCheckingCnic(get)


            }
            if (value?.length == 15) {
                setCheckingLoader(true)
                checkingCIBCustomerbyCnic({ CNICNumber: value }).then((res) => {
                    setCheckingLoader(false)
                    if (res?.Return) {
                        setShowMessage({ msg: res?.Message, value: true, object: res?.AppData })
                    } else {
                        setShowMessage({ msg: res?.Message, value: false, object: undefined })
                        console.log("res-->", res)

                    }

                }).catch((err) => {
                    setCheckingLoader(false)
                })
            }
        }



    }


    // ---------- CIR Report Methods ------------


    const submitCirEnquiryProcess = () => {

        let get = CIBReportData;

        if (get.customerStation.value == "") {

            setToast({
                type: "error",
                message: 'Sorry! Please select your station first',
            });

        } else if (get.customerRegion.value == "") {

            setToast({
                type: "error",
                message: 'Sorry! Please select your region first',
            });

        } else if (get.customerType.value == "") {

            setToast({
                type: "error",
                message: 'Sorry! Please select customer type first',
            });

        } else if (get.customerFirstName.value == "") {

            get.customerFirstName.error = true

            setToast({
                type: "error",
                message: 'Sorry! Please type your firstname',
            });

        } else if (get.customerSurname.value == "") {

            get.customerSurname.error = true

            setToast({
                type: "error",
                message: 'Sorry! Please type your surname',
            });

        } else if (get.customerStation.value == "") {

            setToast({
                type: "error",
                message: 'Sorry! Please select your station first',
            });

        } else if (get.customerDateOfBirth.value == "") {

            setToast({
                type: "error",
                message: 'Sorry! Please select your date of birth first',
            });

        }
        //  else if (get.customerFamilyNumber.value == "") {

        //     get.customerFamilyNumber.error = true

        //     setToast({
        //         type: "error",
        //         message: 'Sorry! Please select your family number',
        //     });

        // }
        else if (get.customerNicNumber.value == "") {

            get.customerNicNumber.error = true

            setToast({
                type: "error",
                message: 'Sorry! Please type your CNIC number',
            });

        } else if (get.customerNicExpiryDate.value == "") {

            setToast({
                type: "error",
                message: 'Sorry! Please select your CNIC expiry date',
            });

        } else if (get.customerAddress.value == "") {

            get.customerAddress.error = true

            setToast({
                type: "error",
                message: 'Sorry! Please type your address',
            });

        } else if (get.customerCity.value == "") {

            get.customerCity.error = true

            setToast({
                type: "error",
                message: 'Sorry! Please type your city name',
            });

        } else if (get.customerDistrict.value == "") {

            setToast({
                type: "error",
                message: 'Sorry! Please select your district first',
            });

        } else if (get.customerStation.value == "") {

            setToast({
                type: "error",
                message: 'Sorry! Please select your station first',
            });

        } else if (get.loanRequestedAmount.value == "" || get.loanRequestedAmount.value == undefined) {

            get.loanRequestedAmount.error = true

            setToast({
                type: "error",
                message: 'Sorry! Please select your requested amount first',
            });

        } else if (get.loanApplicationDate.value == "" || get.loanApplicationDate.value == undefined) {

            setToast({
                type: "error",
                message: 'Sorry! Please select your application date first',
            });

        } else if (get.loanStatus.value == "" || get.loanStatus.value == undefined) {

            setToast({
                type: "error",
                message: 'Sorry! Please select your status first',
            });

        } else if (get.loanAssociationType.value == "" || get.loanAssociationType.value == undefined) {

            setToast({
                type: "error",
                message: 'Sorry! Please select association type first',
            });

        } else if (get.customerMobileNumber.value == "") {
            setToast({
                type: "error",
                message: 'Sorry! Please type your mobile number',
            });
        } else {
            setLoader(true)

            var getCnic = get.customerNicNumber.value;
            var maker = getCnic?.split("-");

            var enquiryData = {
                txtFirstName: get.customerFirstName.value,
                txtLastName: get.customerSurname.value,
                txtNICNumber1: maker[0],
                txtNICNumber2: maker[1],
                txtNICNumber3: maker[2],
                txtApplicationDate: get.loanApplicationDate.value,
                txtRequestedAmount: get.loanRequestedAmount.value,
                selStation: get.customerStation.id,
                selStatus: get.loanStatus.index,
                txtNotes: get.customerNotes.value,
                selRegion: get.customerRegion.id,
                selCustomerType: get.customerType.index,
                selGuardianType: get.customerSonOf.value,
                txtGuardian: get.customerSonOf.text,
                selGender: get.customerGender.text,
                txtDateOfBirth: get.customerDateOfBirth.value,
                txtFamilyNumber: get.customerFamilyNumber.value,
                txtNICExpiryDate: get.customerNicExpiryDate.value,
                txtAddress: get.customerAddress.value,
                txtCity: get.customerCity.value,
                selDistrict: get.customerDistrict.id,
                selAccountType: get.loanAccountType.index,
                selAssociationType: get.loanAssociationType.index,
                txtGroupId: get.loanGroupId.value,
                txtMobileNumber: get.customerMobileNumber.value,
                txtPhoneNumber: get.customerPhoneNumber.value,
                txtEmailAddress: get.customerEmail.value,
                txtAddedBy: get.customerAddedBy.id,
            };

            // console.log("===<",enquiryData)

            // return

            generatingCIR(enquiryData, getUserData.UserData.OrganizationType)
                .then((e) => {


                    if (e?.Return) {

                        getCustomerNextKin(get.customerNicNumber.value).
                            then((response) => {
                                console.log("Cir Kins lol" + JSON.stringify(response))

                                fetchCIRReport(get.customerNicNumber.value).
                                    then((e) => {

                                        setToast({
                                            type: "success",
                                            message: e?.Message,
                                        });

                                        if (response.statusCode == 201) {

                                            setCibReportResponse(e, response)

                                            addCustomer(e, response)
                                        } else {
                                            setCibReportResponse(e, response)

                                            addCustomer2(e, response)
                                        }


                                    })
                            }).
                            catch((e) => {
                                console.log("generatingCIRError============>", e)
                                setToast({
                                    type: "error",
                                    message: e?.Message,
                                });

                                setLoader(false)

                            });

                    } else {
                        setToast({
                            type: "error",
                            message: e?.Message,
                        });

                        setLoader(false)

                    }
                    setToast({
                        type: "error",
                        message: e?.Message,
                    });


                })
                .catch((e) => {
                    console.log("==>", e)
                    setLoader(false)
                })
        }
    }
    const _handleCirCnic = (value) => {
        if (speacial.test(value)) {
            return
        }
        var regexp = new RegExp('^[0-9+]{5}-[0-9+]{7}-[0-9]{1}$');
        if (value?.length < 16) {
            if (value?.length == 5 || value?.length == 13) {


                let get = checkingCnic;
                get = value + '-';
                setCheckingCnic(get)

            } else {

                let get = checkingCnic;
                get = value;
                setCheckingCnic(get)


            }
            if (value?.length == 15) {
                setCheckingLoader(true)
                if (reportType == "CIR") {
                    checkingCIRCustomerbyCnic({ CNICNumber: value }).then((res) => {
                        setCheckingLoader(false)
                        if (res?.Return) {
                            setShowMessage({ msg: res?.Message, value: true, object: res?.AppData })
                        } else {
                            setShowMessage({ msg: res?.Message, value: false, object: undefined })
                            console.log("res-->", res)

                        }

                    }).catch((err) => {
                        setCheckingLoader(false)
                    })
                } else {
                    checkingCIBCustomerbyCnic({ CNICNumber: value }).then((res) => {
                        setCheckingLoader(false)
                        if (res?.Return) {
                            setShowMessage({ msg: res?.Message, value: true, object: res?.AppData })
                        } else {
                            setShowMessage({ msg: res?.Message, value: false, object: undefined })
                            console.log("res-->", res)

                        }

                    }).catch((err) => {
                        setCheckingLoader(false)
                    })
                }
            }
        }



    }

    //------------------End CIR REPORT METHOD----------------------

    return (
        <SafeAreaView style={{ backgroundColor: "#FFF", flex: 1 }}>
            <AppStatusBar />
            <View style={GlobalStyles.row}>

                <Header screenNo={4} Theme={Colors} back={true}></Header>

                <TextView
                    type={'mini_heading22'}
                    style={{ paddingHorizontal: 30, marginTop: 55, fontSize: 15, }}
                    text={"Report"}></TextView>

            </View>
            {reportType != undefined ? <ScrollView
                showsVerticalScrollIndicator={false}
            >
                <View>
                    <TextView
                        style={styles.text1}
                        text={"Check Customer Cnic"}
                    ></TextView>

{/* <TextInput
                        value={checkingCnic}
                        placeholder={'Enter Cnic'}
                        onChangeText={(text) => reportType == "CIB" ? _handleCnic(text) : _handleCirCnic(text)}
                        keyboardType={'number-pad'}
                        style={styles.textInput1} /> */}
{/* {alertMessage !== '' && (
                <TextView style={{ textAlign: 'center', fontSize: 14, margin: 10, color: 'red' }} text={alertMessage} />
            )} */}
                    <TextInput
                        value={checkingCnic}
                        placeholder={'Enter Cnic'}
                        onChangeText={(text) => {
                            if (reportType == "CIB") {
                              _handleCnic(text);
                              _newFunction(text);
                            } else {
                              _handleCirCnic(text);
                            }
                            if(text.length == 15){
                                _newFunction(text);
                            }
                          }}
                        keyboardType={'number-pad'}
                        style={styles.textInput1} />

                    {checkingLoader && <ActivityIndicator style={{ margin: 20 }} size="small" color={Colors.parrotGreenColor} />}
                    {showMessage != undefined && <TextView style={{ textAlign: 'center', fontSize: 14, margin: 10, color: '#7f7f7f' }} text={showMessage?.msg}></TextView>}
                    {showMessage?.value && <TouchableOpacity
                        onPress={_handleShowData}
                        activeOpacity={0.7}>
                            {alertMessage !== '' && (
                <TextView style={{ textAlign: 'center', fontSize: 14, margin: 10, color: 'red' }} text={alertMessage} />
            )}
                        <TextView style={{ textAlign: 'center', fontSize: 14, margin: 10, color: Colors.parrotGreenColor }} text={"Show Customer Data"}></TextView>
                    </TouchableOpacity>
                    }


                    <TextView
                        style={[styles.text1]}
                        text={"Customer Information"}
                    ></TextView>

                    <View style={[styles.row, { marginTop: 30, marginLeft: 10, marginRight: 10 }]}>

                        <CustomDropdown
                            text={"Customer Added By"}
                            required={false}
                            tempdata={EmployeeArray}
                            label={

                                CIBReportData.customerAddedBy.value == "" ? 'Select Employee' : CIBReportData.customerAddedBy.value
                            }
                            type={2}
                            onSelect={async (value, underindex) => {

                                let get = CIBReportData;
                                get.customerRegion.value = ""
                                get.customerRegion.index = 0
                                get.customerRegion.id = ""


                                get.customerAddedBy.value = value.name;
                                get.customerAddedBy.index = underindex;
                                get.customerAddedBy.id = EmployeeArray[underindex].id

                                setCIBReport({ ...get })

                                setCustomerRegion(value.id)
                            }}
                        />

                        <CustomDropdown
                            text={"Station"}
                            required={true}
                            tempdata={getStation}
                            label={
                                CIBReportData.customerStation.value == "" ? "Select Station" : CIBReportData.customerStation.value
                            }
                            type={2}
                            onSelect={async (value, underindex) => {

                                getEmployeesAccordStationId(setEmployeeArray, setNoData, value.stationId)

                                let get = CIBReportData;
                                get.customerStation.value = value.name;
                                get.customerStation.id = getStation[underindex].stationId;
                                get.customerStation.index = underindex;
                                get.customerAddedBy.value = ""
                                get.customerAddedBy.index = 0
                                get.customerRegion.value = ""
                                get.customerRegion.index = 0
                                get.customerRegion.id = ""

                                setCIBReport({ ...get })

                                // setSelectedStation(value)
                                // setSelectedEmployee(undefined)

                            }}
                        />
                    </View>

                    <View style={[styles.row, { marginTop: 0, marginLeft: 10, marginRight: 10 }]}>

                        <CustomDropdown
                            text={"Region"}
                            required={true}
                            tempdata={selectedRegion}
                            label={
                                CIBReportData.customerRegion.value == "" ? 'Select Region' : CIBReportData.customerRegion.value
                            }
                            type={2}
                            onSelect={async (value, underindex) => {
                                console.log(selectedRegion[underindex].RegionId)
                                let get = CIBReportData;
                                get.customerRegion.value = value.name
                                get.customerRegion.index = underindex
                                get.customerRegion.id = selectedRegion[underindex].RegionId

                                setCIBReport({ ...get })

                            }}
                        />

                        <CustomDropdown
                            text={"Customer Type"}
                            required={true}
                            tempdata={["Urban", "Rural"]}
                            label={
                                CIBReportData.customerType.value == "" ? 'Select Customer Type' : CIBReportData.customerType.value
                            }
                            //type={2}
                            onSelect={async (value, underindex) => {

                                let get = CIBReportData;
                                get.customerType.value = value
                                get.customerType.index = underindex
                                setCIBReport({ ...get })

                            }}
                        />
                    </View>


                    <TextView
                        style={[styles.text1]}
                        text={"Customer Personal Information "}
                    ></TextView>
                    <View style={[styles.row, { marginTop: 20, marginLeft: 10, marginRight: 10 }]}>
                        <FormInputs
                            keyboardtype={'default'}
                            required={true}
                            text={'First Name'}
                            error={CIBReportData?.customerFirstName?.error}
                            value={CIBReportData?.customerFirstName?.value}
                            onChangeText={(value: string) => {
                                let get = CIBReportData;
                                get.customerFirstName.value = value;
                                setCIBReport({ ...get })
                            }}></FormInputs>

                        <FormInputs
                            keyboardtype={'default'}
                            required={true}
                            text={'Surname'}
                            error={CIBReportData?.customerSurname?.error}
                            value={CIBReportData?.customerSurname?.value}
                            onChangeText={(value: string) => {
                                let get = CIBReportData;
                                get.customerSurname.value = value;
                                setCIBReport({ ...get })
                            }}></FormInputs>
                    </View>


                    <View style={[styles.row, { marginTop: 0, marginLeft: 10, marginRight: 10 }]}>
                        <View style={styles.row}>
                            <View style={styles.sonOf}>
                                <TextView
                                    style={styles.sonOftext}
                                    text="S/O"></TextView>
                                <RadioButton
                                    value={"S/O"}
                                    uncheckedColor={'#cdcdcd'}
                                    color={Colors.parrotGreenColor}
                                    status={CIBReportData.customerSonOf.value == 1 ? "checked" : "unchecked"}
                                    onPress={() => {

                                        let get = CIBReportData;
                                        get.customerSonOf.value = 1;
                                        // get.customerSonOf.text = "S/O";
                                        setCIBReport({ ...get })

                                    }}
                                />
                            </View>
                            <View
                                style={styles.sonOf}>
                                <TextView
                                    style={styles.sonOftext}
                                    text="D/O"></TextView>
                                <RadioButton
                                    value={"D/O"}
                                    uncheckedColor={'#cdcdcd'}
                                    color={Colors.parrotGreenColor}
                                    status={CIBReportData.customerSonOf.value == 2 ? "checked" : "unchecked"}
                                    onPress={() => {

                                        let get = CIBReportData;
                                        get.customerSonOf.value = 2;
                                        // get.customerSonOf.text = "D/O"
                                        setCIBReport({ ...get })
                                    }}
                                />
                            </View>
                            <View style={styles.sonOf}>
                                <TextView style={styles.sonOftext} text="W/O"></TextView>
                                <RadioButton
                                    value={"W/O"}
                                    uncheckedColor={'#cdcdcd'}
                                    color={Colors.parrotGreenColor}
                                    status={CIBReportData.customerSonOf.value == 3 ? "checked" : "unchecked"}
                                    onPress={() => {

                                        let get = CIBReportData;
                                        get.customerSonOf.value = 3;
                                        // get.customerSonOf.text = "W/O"
                                        setCIBReport({ ...get })
                                    }}
                                />
                            </View>

                        </View>

                        <FormInputs
                            keyboardtype={'default'}
                            text={''}
                            required={true}
                            error={CIBReportData.customerSonOf.error}
                            value={CIBReportData.customerSonOf.text}
                            onChangeText={(value: string) => {

                                let get = CIBReportData;
                                get.customerSonOf.text = value;
                                setCIBReport({ ...get })

                            }}></FormInputs>
                    </View>

                    <View style={[styles.row, { marginTop: 10, marginLeft: 10, marginRight: 10 }]}>

                        <View style={styles.row}>

                            <View
                                style={styles.sonOf}>
                                <TextView
                                    style={styles.sonOftext}
                                    text="Male"></TextView>
                                <RadioButton
                                    value={"Male"}
                                    uncheckedColor={'#cdcdcd'}
                                    color={Colors.parrotGreenColor}
                                    status={CIBReportData.customerGender.value == 1 ? 'checked' : "unchecked"}
                                    onPress={() => {

                                        let get = CIBReportData;
                                        get.customerGender.value = 1;
                                        get.customerGender.text = "M";
                                        setCIBReport({ ...get })

                                    }}
                                />
                            </View>
                            <View style={styles.sonOf}>
                                <TextView style={styles.sonOftext} text="Female"></TextView>
                                <RadioButton
                                    value={"Female"}
                                    uncheckedColor={'#cdcdcd'}
                                    color={Colors.parrotGreenColor}
                                    status={CIBReportData.customerGender.value == 2 ? 'checked' : "unchecked"}
                                    onPress={() => {

                                        let get = CIBReportData;
                                        get.customerGender.value = 2;
                                        get.customerGender.text = "F";
                                        setCIBReport({ ...get })

                                    }}
                                />

                            </View>
                            <View style={styles.sonOf}>
                                <TextView style={styles.sonOftext} text="Other"></TextView>
                                <RadioButton
                                    value={"Other"}
                                    uncheckedColor={'#cdcdcd'}
                                    color={Colors.parrotGreenColor}
                                    status={CIBReportData.customerGender.value == 3 ? 'checked' : "unchecked"}
                                    onPress={() => {

                                        let get = CIBReportData;
                                        get.customerGender.value = 3;
                                        get.customerGender.text = "O";
                                        setCIBReport({ ...get })

                                    }}
                                />

                            </View>

                        </View>

                        <DateSelector
                            title={
                                CIBReportData.customerDateOfBirth?.value == "" ? "Date of Birth" : CIBReportData.customerDateOfBirth.value
                            }

                            setAlldataobj={setCIBReport}
                            allDataobj={CIBReportData}
                            setToast={setToast}
                            //array_index={array_index}
                            fieldName={6}></DateSelector>
                    </View>



                    <View style={[styles.row, { marginTop: 20, marginLeft: 10, marginRight: 10 }]}>
                        <FormInputs
                            keyboardtype={'number-pad'}
                            text={'Family Number'}
                            required={true}
                            error={CIBReportData.customerFamilyNumber.error}
                            value={CIBReportData.customerFamilyNumber.value}
                            onChangeText={(value: string) => {
                                console.log(value)
                                let get = CIBReportData;
                                get.customerFamilyNumber.value = value;
                                setCIBReport({ ...get })

                            }}></FormInputs>

                        <FormInputs
                            keyboardtype={'number-pad'}
                            text={'NIC Number'}
                            required={true}
                            error={CIBReportData.customerNicNumber.error}
                            value={CIBReportData.customerNicNumber.value}
                            onChangeText={(value: string) => {

                                var regexp = new RegExp('^[0-9+]{5}-[0-9+]{7}-[0-9]{1}$');
                                if (value.length < 16) {
                                    if (value.length == 5 || value.length == 13) {

                                        let get = CIBReportData;
                                        get.customerNicNumber.value = value + '-';

                                        get.customerNicNumber.error = !regexp.test(value) ? true : false

                                        setCIBReport({ ...get })

                                    } else {
                                        let get = CIBReportData;

                                        get.customerNicNumber.value = value;

                                        get.customerNicNumber.error = !regexp.test(value) ? true : false

                                        setCIBReport({ ...get })

                                        // ------------------Set Customer Data Reducer For Customer Form------------------

                                        let getCustomerData = allDataobj;

                                        getCustomerData.customerInfo[
                                            array_index
                                        ].customer_cnicNumber.value = value


                                        setAlldataobj({ ...getCustomerData });

                                        //------------------------------------------------------------------------------
                                    }
                                }

                            }}></FormInputs>


                    </View>

                    <View style={[styles.row, { marginTop: 20, marginLeft: 10, marginRight: 10 }]}>


                        <DateSelector
                            title={
                                CIBReportData.customerNicExpiryDate.value == "" ? "NIC Expiry Date" : CIBReportData.customerNicExpiryDate.value
                            }
                            setAlldataobj={setCIBReport}
                            allDataobj={CIBReportData}
                            setToast={setToast}
                            //array_index={array_index}
                            fieldName={7}></DateSelector>

                        <FormInputs
                            // keyboardtype={'number-pad'}
                            text={'Address'}
                            required={true}
                            error={CIBReportData.customerAddress.error}
                            value={CIBReportData.customerAddress.value}
                            onChangeText={(value: string) => {

                                let get = CIBReportData;
                                get.customerAddress.value = value;
                                setCIBReport({ ...get })

                            }}></FormInputs>

                    </View>

                    <View style={[styles.row, { marginTop: 30, marginLeft: 10, marginRight: 10 }]}>

                        <CustomDropdown
                            text={"District"}
                            required={true}
                            tempdata={allDistrict}
                            label={

                                CIBReportData.customerDistrict.value == "" ? 'Select District' : CIBReportData.customerDistrict.value
                            }
                            type={2}
                            onSelect={async (value, underindex) => {

                                // console.log("-->",allDistrict[underindex].districtId)

                                let get = CIBReportData;
                                get.customerDistrict.value = value.name;
                                get.customerDistrict.index = underindex;
                                get.customerDistrict.id = allDistrict[underindex].districtId;
                                setCIBReport({ ...get })

                            }}
                        />

                        <FormInputs
                            // keyboardtype={'number-pad'}
                            text={'City'}
                            required={true}
                            error={CIBReportData.customerCity.error}
                            value={CIBReportData.customerCity.value}
                            onChangeText={(value: string) => {

                                let get = CIBReportData;
                                get.customerCity.value = value;
                                setCIBReport({ ...get })

                            }}></FormInputs>
                    </View>


                    <TextView
                        style={[styles.text1]}
                        text={`${loanLabel} Information`}
                    ></TextView>

                    <View style={[styles.row, { marginTop: 30, marginLeft: 10, marginRight: 10 }]}>



                        <FormInputs
                            // keyboardtype={'number-pad'}
                            required={true}
                            text={'Requested Amount'}
                            error={CIBReportData.loanRequestedAmount.error}
                            value={CIBReportData.loanRequestedAmount.value}
                            onChangeText={(value: string) => {

                                let get = CIBReportData;
                                get.loanRequestedAmount.value = value;
                                setCIBReport({ ...get })

                            }}></FormInputs>

                        <DateSelector
                            title={
                                CIBReportData.loanApplicationDate.value == "" ? "Application Date" : CIBReportData.loanApplicationDate.value
                            }
                            setAlldataobj={setCIBReport}
                            allDataobj={CIBReportData}
                            //setToast={setToast}
                            //array_index={array_index}
                            fieldName={8}></DateSelector>
                    </View>

                    <View style={[styles.row, { marginTop: 0, marginLeft: 10, marginRight: 10 }]}>

                        <CustomDropdown
                            text={"Status"}
                            required={true}
                            //Requirement from Nevved status Only Inquiry Processing
                            // tempdata={["Rejected", "Inquiry Processing", "Granted"]}
                            tempdata={["", "Inquiry Processing"]}
                            label={

                                CIBReportData.loanStatus.value == "" || CIBReportData.loanStatus.value == undefined ? 'Select Status' : CIBReportData.loanStatus.value
                            }
                            // type={2}
                            onSelect={async (value, underindex) => {

                                // alert(underindex)

                                let get = CIBReportData;
                                get.loanStatus.value = value;
                                get.loanStatus.index = underindex;
                                setCIBReport({ ...get })

                            }}
                        />

                        <CustomDropdown
                            text={"Account Type"}
                            required={false}
                            tempdata={["IN", "HI", "ED", "PC", "OT", "TF", "HP", "CC", "OD", "RM", "TF", "AL", "PL", "MT", "BL", "NC", "AG", "OT"]}
                            label={

                                CIBReportData.loanAccountType.value == "" ? 'Select Account Type' : CIBReportData.loanAccountType.value
                            }
                            //type={2}
                            onSelect={async (value, underindex) => {
                                //alert(underindex)
                                let get = CIBReportData;
                                get.loanAccountType.value = value;
                                get.loanAccountType.index = underindex;
                                setCIBReport({ ...get })

                            }}
                        />
                    </View>

                    <View style={[styles.row, { marginTop: 0, marginLeft: 10, marginRight: 10 }]}>

                        <CustomDropdown
                            text={"Association Type"}
                            required={true}
                            tempdata={["PRN", "CBG", "CBR", "GRN", "GRP", "COS", "JNT", "NOX",]}
                            label={

                                CIBReportData.loanAssociationType.value == "" ? 'Select Association Type' : CIBReportData.loanAssociationType.value
                            }
                            //type={2}
                            onSelect={async (value, underindex) => {
                                //alert(underindex)
                                let get = CIBReportData;
                                get.loanAssociationType.value = value;
                                get.loanAssociationType.index = underindex;
                                setCIBReport({ ...get })


                            }}
                        />
                        <FormInputs
                            // keyboardtype={'number-pad'}
                            text={'Group Id'}
                            error={CIBReportData.loanGroupId.error}
                            value={CIBReportData.loanGroupId.value}
                            onChangeText={(value: string) => {

                                let get = CIBReportData;
                                get.loanGroupId.value = value;
                                setCIBReport({ ...get })

                            }}></FormInputs>

                    </View>






     
                    {reportType === 'CIB' && (
        <>


          <TextView style={[styles.text1]} text={'Kins Information'}></TextView>
          <View style={{ flexDirection: 'row', alignItems: 'center', left: 12 }}>
            <Checkbox  color={'green'} status={isRequiredSelected ? 'checked' : 'unchecked'}
               onPress={() => setIsRequiredSelected((prevState) => !prevState)}/>
               <Text>Mark fields as required</Text>
          </View>

            <TextView style={[styles.text1]} text={'First Kin Information'}></TextView> 
          <View style={[styles.row, { marginTop: 20, marginLeft: 10, marginRight: 10 }]}>
            <FormInputs
              keyboardtype={'default'}
              required={isRequiredSelected}
              text={'First Name'}
              error={CIBReportData?.KinFirstName?.error}
              value={CIBReportData?.KinFirstName?.value}
              onChangeText={(value: string) => {
                let get = CIBReportData;
                get.KinFirstName.value = value;
                setCIBReport({ ...get })
              }}
            />

            <FormInputs
              keyboardtype={'default'}
              required={isRequiredSelected}
              text={'Middle Name'}
              error={CIBReportData?.KinMiddleName?.error}
              value={CIBReportData?.KinMiddleName?.value}
              onChangeText={(value: string) => {
                let get = CIBReportData;
                get.KinMiddleName.value = value;
                setCIBReport({ ...get })
              }}
            />
          </View>

          <View style={[styles.row, { marginTop: 20, marginLeft: 10, marginRight: 10 }]}>
            <FormInputs
              keyboardtype={'default'}
              required={isRequiredSelected}
              text={'Last Name'}
              error={CIBReportData?.KinLastName?.error}
              value={CIBReportData?.KinLastName?.value}
              onChangeText={(value: string) => {
                let get = CIBReportData;
                get.KinLastName.value = value;
                setCIBReport({ ...get });
              }}
            />

            <FormInputs
              keyboardtype={'number-pad'}
              required={isRequiredSelected}
              text={'Kin NIC Number'}
              error={CIBReportData.KinNicNumber.error}
              value={CIBReportData.KinNicNumber.value}
              onChangeText={(value: string) => {
                var regexp = new RegExp('^[0-9+]{5}-[0-9+]{7}-[0-9]{1}$');
                if (value.length < 16) {
                  if (value.length === 5 || value.length === 13) {
                    let get = CIBReportData;
                    get.KinNicNumber.value = value + '-';
                    get.KinNicNumber.error = !regexp.test(value) ? true : false;
                    setCIBReport({ ...get });
                  } else {
                    let get = CIBReportData;
                    get.KinNicNumber.value = value;
                    get.KinNicNumber.error = !regexp.test(value) ? true : false;
                    setCIBReport({ ...get });
                    let getCustomerData = allDataobj;
                    getCustomerData.customerInfo[array_index].customer_cnicNumber.value = value;
                    setAlldataobj({ ...getCustomerData });
                  }
                }
              }}
            />
          </View>


          <TextView style={[styles.text1]} text={'Second Kin Information'}></TextView>
          <View style={[styles.row, { marginTop: 20, marginLeft: 10, marginRight: 10 }]}>
            <FormInputs
              keyboardtype={'default'}
              text={'First Name'}
              error={CIBReportData?.KinsecondFirstName?.error}
              value={CIBReportData?.KinsecondFirstName?.value}
              onChangeText={(value: string) => {
                let get = CIBReportData;
                get.KinsecondFirstName.value = value;
                setCIBReport({ ...get })
              }}
            />

            <FormInputs
              keyboardtype={'default'}
              text={'Middle Name'}
              error={CIBReportData?.KinsecondMiddleName?.error}
              value={CIBReportData?.KinsecondMiddleName?.value}
              onChangeText={(value: string) => {
                let get = CIBReportData;
                get.KinsecondMiddleName.value = value;
                setCIBReport({ ...get })
              }}
            />
          </View>

          <View style={[styles.row, { marginTop: 20, marginLeft: 10, marginRight: 10 }]}>
            <FormInputs
              keyboardtype={'default'}
              text={'Last Name'}
              error={CIBReportData?.KinsecondLastName?.error}
              value={CIBReportData?.KinsecondLastName?.value}
              onChangeText={(value: string) => {
                let get = CIBReportData;
                get.KinsecondLastName.value = value;
                setCIBReport({ ...get });
              }}
            />

            <FormInputs
              keyboardtype={'number-pad'}
              text={'Kin NIC Number'}
              error={CIBReportData.KinSecondNicNumber.error}
              value={CIBReportData.KinSecondNicNumber.value}
              onChangeText={(value: string) => {
                var regexp = new RegExp('^[0-9+]{5}-[0-9+]{7}-[0-9]{1}$');
                if (value.length < 16) {
                  if (value.length === 5 || value.length === 13) {
                    let get = CIBReportData;
                    get.KinSecondNicNumber.value = value + '-';
                    get.KinSecondNicNumber.error = !regexp.test(value) ? true : false;
                    setCIBReport({ ...get });
                  } else {
                    let get = CIBReportData;
                    get.KinSecondNicNumber.value = value;
                    get.KinSecondNicNumber.error = !regexp.test(value) ? true : false;
                    setCIBReport({ ...get });
                    let getCustomerData = allDataobj;
                    getCustomerData.customerInfo[array_index].customer_cnicNumber.value = value;
                    setAlldataobj({ ...getCustomerData });
                  }
                }
              }}
            />
          </View>

          <TextView style={[styles.text1]} text={'Third Kin Information'}></TextView>
          <View style={[styles.row, { marginTop: 20, marginLeft: 10, marginRight: 10 }]}>
            <FormInputs
              keyboardtype={'default'}
              text={'First Name'}
              error={CIBReportData?.KinThirdFirstName?.error}
              value={CIBReportData?.KinThirdFirstName?.value}
              onChangeText={(value: string) => {
                let get = CIBReportData;
                get.KinThirdFirstName.value = value;
                setCIBReport({ ...get })
              }}
            />

            <FormInputs
              keyboardtype={'default'}
              text={'Middle Name'}
              error={CIBReportData?.KinThirdMiddleName?.error}
              value={CIBReportData?.KinThirdMiddleName?.value}
              onChangeText={(value: string) => {
                let get = CIBReportData;
                get.KinThirdMiddleName.value = value;
                setCIBReport({ ...get })
              }}
            />
          </View>

          <View style={[styles.row, { marginTop: 20, marginLeft: 10, marginRight: 10 }]}>
            <FormInputs
              keyboardtype={'default'}
              text={'Last Name'}
              error={CIBReportData?.KinThirdLastName?.error}
              value={CIBReportData?.KinThirdLastName?.value}
              onChangeText={(value: string) => {
                let get = CIBReportData;
                get.KinThirdLastName.value = value;
                setCIBReport({ ...get });
              }}
            />

            <FormInputs
              keyboardtype={'number-pad'}
              text={'Kin NIC Number'}
              error={CIBReportData.KinThirdNicNumber.error}
              value={CIBReportData.KinThirdNicNumber.value}
              onChangeText={(value: string) => {
                var regexp = new RegExp('^[0-9+]{5}-[0-9+]{7}-[0-9]{1}$');
                if (value.length < 16) {
                  if (value.length === 5 || value.length === 13) {
                    let get = CIBReportData;
                    get.KinThirdNicNumber.value = value + '-';
                    get.KinThirdNicNumber.error = !regexp.test(value) ? true : false;
                    setCIBReport({ ...get });
                  } else {
                    let get = CIBReportData;
                    get.KinThirdNicNumber.value = value;
                    get.KinThirdNicNumber.error = !regexp.test(value) ? true : false;
                    setCIBReport({ ...get });
                    let getCustomerData = allDataobj;
                    getCustomerData.customerInfo[array_index].customer_cnicNumber.value = value;
                    setAlldataobj({ ...getCustomerData });
                  }
                }
              }}
            />
          </View>

          <TextView style={[styles.text1]} text={'Four Kin Information'}></TextView>
          <View style={[styles.row, { marginTop: 20, marginLeft: 10, marginRight: 10 }]}>
            <FormInputs
              keyboardtype={'default'}
              text={'First Name'}
              error={CIBReportData?.KinFourFirstName?.error}
              value={CIBReportData?.KinFourFirstName?.value}
              onChangeText={(value: string) => {
                let get = CIBReportData;
                get.KinFourFirstName.value = value;
                setCIBReport({ ...get })
              }}
            />

            <FormInputs
              keyboardtype={'default'}
              text={'Middle Name'}
              error={CIBReportData?.KinFourMiddleName?.error}
              value={CIBReportData?.KinFourMiddleName?.value}
              onChangeText={(value: string) => {
                let get = CIBReportData;
                get.KinFourMiddleName.value = value;
                setCIBReport({ ...get })
              }}
            />
          </View>

          <View style={[styles.row, { marginTop: 20, marginLeft: 10, marginRight: 10 }]}>
            <FormInputs
              keyboardtype={'default'}
              text={'Last Name'}
              error={CIBReportData?.KinFourLastName?.error}
              value={CIBReportData?.KinFourLastName?.value}
              onChangeText={(value: string) => {
                let get = CIBReportData;
                get.KinFourLastName.value = value;
                setCIBReport({ ...get });
              }}
            />

            <FormInputs
              keyboardtype={'number-pad'}
              text={'Kin NIC Number'}
              error={CIBReportData.KinFourNicNumber.error}
              value={CIBReportData.KinFourNicNumber.value}
              onChangeText={(value: string) => {
                var regexp = new RegExp('^[0-9+]{5}-[0-9+]{7}-[0-9]{1}$');
                if (value.length < 16) {
                  if (value.length === 5 || value.length === 13) {
                    let get = CIBReportData;
                    get.KinFourNicNumber.value = value + '-';
                    get.KinFourNicNumber.error = !regexp.test(value) ? true : false;
                    setCIBReport({ ...get });
                  } else {
                    let get = CIBReportData;
                    get.KinFourNicNumber.value = value;
                    get.KinFourNicNumber.error = !regexp.test(value) ? true : false;
                    setCIBReport({ ...get });
                    let getCustomerData = allDataobj;
                    getCustomerData.customerInfo[array_index].customer_cnicNumber.value = value;
                    setAlldataobj({ ...getCustomerData });
                  }
                }
              }}
            />
          </View>
        </>
      )}

   {/* my code */}

    {/* {reportType === 'CIB' && (
        <>
          <TextView style={[styles.text1]} text={'Kins Information'}></TextView>

          <View style={[styles.row, { marginTop: 20, marginLeft: 10, marginRight: 10 }]}>
                        <FormInputs
                            keyboardtype={'default'}
                            required={true}
                            text={'First Name'}
                            error={CIBReportData?.KinFirstName?.error}
                            value={CIBReportData?.KinFirstName?.value}
                            onChangeText={(value: string) => {
                                let get = CIBReportData;
                                get.KinFirstName.value = value;
                                setCIBReport({ ...get })
                            }}></FormInputs>

                        <FormInputs
                            keyboardtype={'default'}
                            required={true}
                            text={'Middle Name'}
                            error={CIBReportData?.KinMiddleName?.error}
                            value={CIBReportData?.KinMiddleName?.value}
                            onChangeText={(value: string) => {
                                let get = CIBReportData;
                                get.KinMiddleName.value = value;
                                setCIBReport({ ...get })
                            }}></FormInputs>
                    </View>

                    <View style={[styles.row, { marginTop: 20, marginLeft: 10, marginRight: 10 }]}>
                <FormInputs
                  keyboardtype={'default'}
                  required={true}
                  text={'Last Name'}
                  error={CIBReportData?.KinLastName?.error}
                  value={CIBReportData?.KinLastName?.value}
                  onChangeText={(value: string) => {
                    let get = CIBReportData;
                    get.KinLastName.value = value;
                    setCIBReport({ ...get });
                  }}
                />

                <FormInputs
                  keyboardtype={'number-pad'}
                  required={true}
                  text={'Kin NIC Number'}
                  error={CIBReportData.KinNicNumber.error}
                  value={CIBReportData.KinNicNumber.value}
                  onChangeText={(value: string) => {
                    var regexp = new RegExp('^[0-9+]{5}-[0-9+]{7}-[0-9]{1}$');
                    if (value.length < 16) {
                      if (value.length === 5 || value.length === 13) {
                        let get = CIBReportData;
                        get.KinNicNumber.value = value + '-';
                        get.KinNicNumber.error = !regexp.test(value) ? true : false;
                        setCIBReport({ ...get });
                      } else {
                        let get = CIBReportData;
                        get.KinNicNumber.value = value;
                        get.KinNicNumber.error = !regexp.test(value) ? true : false;
                        setCIBReport({ ...get });
                        let getCustomerData = allDataobj;
                        getCustomerData.customerInfo[array_index].customer_cnicNumber.value = value;
                        setAlldataobj({ ...getCustomerData });
                      }
                    }
                  }}
                />
               </View>


       </>
        )}      */}
          
         
        
                    <TextView
                        style={[styles.text1]}
                        text={"Contact Information"}
                    ></TextView>
                    <View style={[styles.row, { marginTop: 30, marginLeft: 10, marginRight: 10 }]}>

                        <FormInputs
                            // keyboardtype={'number-pad'}
                            text={'Phone Number'}
                            error={CIBReportData.customerPhoneNumber.error}
                            value={CIBReportData.customerPhoneNumber.value}
                            onChangeText={(value: string) => {

                                let get = CIBReportData;
                                get.customerPhoneNumber.value = value;
                                setCIBReport({ ...get })

                            }}></FormInputs>
                        <FormInputs
                            // keyboardtype={'number-pad'}
                            required={true}
                            text={'Mobile Number'}
                            keyboardtype={'phone-pad'}
                            error={CIBReportData.customerMobileNumber.error}
                            value={CIBReportData.customerMobileNumber.value}
                            onChangeText={(value: string) => {

                                if (value.length < 12) {

                                    let get = CIBReportData;

                                    get.customerMobileNumber.value = value;

                                    setCIBReport({ ...get });

                                }

                            }}></FormInputs>

                    </View>

                    <View style={[styles.row, { marginTop: 0, marginLeft: 10, marginRight: 10 }]}>

                        <FormInputs
                            // keyboardtype={'number-pad'}
                            text={'Email'}
                            error={CIBReportData.customerEmail.error}
                            value={CIBReportData.customerEmail.value}
                            onChangeText={(value: string) => {

                                let get = CIBReportData;
                                get.customerEmail.value = value;
                                setCIBReport({ ...get })

                            }}></FormInputs>


                    </View>

                    <TextView
                        style={[styles.text1]}
                        text={"Extra Information"}
                    ></TextView>
                    <TextView style={styles.textnote} text="Notes"></TextView>

                    <TextInput
                        style={styles.notes}
                        value={CIBReportData.customerNotes.value}
                        multiline={true}
                        onChangeText={(value) => {

                            let get = CIBReportData;
                            get.customerNotes.value = value;
                            setCIBReport({ ...get })

                        }} />

                    {loader && <ActivityIndicator color={Colors.parrotGreenColor} />}
                    <TouchableOpacity
                        style={styles.button}
                        onPress={() => reportType == 'CIB' ? submitEnquiryProcess() : submitCirEnquiryProcess()}
                    >
                        <TextView style={{ color: '#FFF', alignSelf: 'center' }} text={"Enquiry Process"}></TextView>
                    </TouchableOpacity>

                    {checkEnquiryAdded &&

                        <View style={{ justifyContent: 'center', flexDirection: 'row', alignItems: 'center', marginLeft: 20, marginRight: 20 }}>
                            {reportType == "CIB" ?

                                <TouchableOpacity
                                    style={styles.button2}
                                    onPress={() => onOpen()}
                                >
                                    <TextView style={{ color: '#FFF', alignSelf: 'center' }} text={"Show CIB Report"}></TextView>
                                </TouchableOpacity>

                                :

                                <TouchableOpacity
                                    style={styles.button2}
                                    onPress={() => showCirReport()}
                                >
                                    <TextView style={{ color: '#FFF', alignSelf: 'center' }} text={"Show CIR Report"}></TextView>
                                </TouchableOpacity>

                            }
                            <TouchableOpacity
                                style={styles.button2}
                                onPress={() => updateCustomer()}
                            >
                                <TextView style={{ color: '#FFF', alignSelf: 'center' }} text={"Update Customer"}></TextView>
                            </TouchableOpacity>
                        </View>
                    }
                </View>
            </ScrollView>
                :
                <View>
                    <TextView text={"Selection of Report"}
                        style={{
                            color: Colors.light_dark_gray,
                            fontSize: 20, marginTop: height / 4, marginLeft: 30
                        }}></TextView>
                    <View style={{
                        flexDirection: 'row'
                        , alignItems: 'center', justifyContent: 'space-between', margin: 20
                    }}>

                        <TouchableOpacity
                            onPress={() => setReportType("CIB")}
                            style={styles.selectionButton}>

                            <TextView text={"Data Check"} style={styles.selectiontxt}></TextView>
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={() => setReportType("CIR")}

                            style={styles.selectionButton}>
                            <TextView text={"Tasdeeq"} style={styles.selectiontxt}></TextView>

                        </TouchableOpacity>


                    </View>
                </View>
            }
            <Modalize ref={modalizeRef}
                snapPoint={height / 1.8}
            >
                <View style={{ paddingTop: 30 }}>
                    <CIBView reportDetail={cibReportResponse} />
                </View>
            </Modalize>

            <Modalize ref={cibModalizeRef}
                snapPoint={height / 1.8}
            >
                <View style={{ paddingTop: 30 }}>

                    <CirView reportDetail={cibReportResponse} />

                </View>
            </Modalize>

            <Toast {...toast} onDismiss={() => setToast({ message: "", type: "" })} />

        </SafeAreaView>

    )
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
export default connect(null, mapDispatchToProps)(CIBReport);
const styles = StyleSheet.create({
    text1: { marginTop: 40, marginLeft: 20, fontSize: 18 },
    textInput1: { color: "#000", textAlign: 'center', marginTop: 20, height: 40, width: width / 1.8, alignSelf: 'center', padding: 10, elevation: 10, borderRadius: 10, backgroundColor: '#FFF' },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    }, sonOf: { marginLeft: 10, marginRight: 10, justifyContent: 'center', alignItems: "center" },
    sonOftext: { fontSize: 16, color: '#7d7d7d' },
    notes: {
        borderRadius: 10, borderWidth: 1, borderColor: '#cdcdcd', marginBottom: 30, textAlignVertical
            : 'top',
        marginLeft: 20, marginRight: 20, marginTop: 10, height: 100, padding: 10,
    },
    textnote: { color: '#7d7d7d', fontSize: 12, marginTop: 10, marginLeft: 20 },
    button: {
        borderRadius: 10, backgroundColor: Colors.parrotGreenColor, width: width / 2, marginTop: 10,
        margin: 10, alignSelf: 'center', padding: 10, justifyContent: 'center'
    },
    button2: {
        borderRadius: 10, backgroundColor: Colors.parrotGreenColor, marginTop: 10,
        margin: 10, alignSelf: 'center', padding: 10, justifyContent: 'center'
    },
    selectionButton: {
        borderRadius: 10,
        elevation: 10, height: 50, width: width / 2.5, backgroundColor: '#FFF',
        borderWidth: 1, borderColor: Colors.green, justifyContent: 'center'
    },
    selectiontxt: { fontSize: 20, alignSelf: 'center', color: Colors.green },
    addButton: {  width: 40, height: 40,  backgroundColor: '#130C52',borderRadius: 5, alignItems: 'center', justifyContent: 'center',  },         
    addButtonText: {  fontSize: 30, fontWeight: 'bold', color: 'white'},   
    heading: {fontSize: 18,fontWeight: 'bold',marginBottom: 10,},
})