import React, {useRef, useState, memo} from 'react';
import type {Node} from 'react';
import {
  SafeAreaView,
  ScrollView,
  KeyboardAvoidingView,
  StyleSheet,
  Dimensions,
  ActivityIndicator,
  Pressable,
  Image,
  TouchableOpacity,
  PermissionsAndroid,
  TextInput,
  View,
  Alert,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import moment from 'moment';
import {Card} from 'react-native-paper';
import {
  AppStatusBar,
  CheckboxCustomer,
  CustomButton,
  CustomProgressDialoge,
  Header,
  Nodata,
} from '../../components';
const {height, width} = Dimensions.get('window');
import EvilIcons from 'react-native-vector-icons/EvilIcons';
import Feather from 'react-native-vector-icons/Feather';
import {connect, useSelector} from 'react-redux';
import {Colors, GlobalStyles} from '../../theme';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import ImagePicker from 'react-native-image-crop-picker';
import Geolocation from '@react-native-community/geolocation';
import RNAndroidLocationEnabler from 'react-native-android-location-enabler';
import {
  DateSelector,
  FormInputs,
  VerificationIndicator,
  TextView,
  MyChipcomponent,
  CorrectiveActionPlans,
  Dropdownlist,
  Search,
} from '../../components';
import {Chip} from 'react-native-paper';
import {
  VisitedList,
  Remarks,
  Decision,
  Officers,
} from '../../utilis/RequiredArrays';
import {Modalize} from 'react-native-modalize';
import RNFS from 'react-native-fs';
import {useDispatch} from 'react-redux';
import {
  DeleteCustomerGurantorsbyId,
  DeleteCustomerGurantorsbySelf,
  DeleteGroup_Gurantors,
  DeleteSelectedGurantors,
  getCustomerFroms,
  getCustomerFromsbyId,
  getCustomerFromsforSelection,
  insertGroupFromData,
  insert_Group_Gurantors,
  UpdateCustomerFormsforGurantor,
  updateGroupsForm,
} from '../../sqlite/sqlitedb';
import {getCurrentLocation} from '../../utilis/Locationgetter';
import ZoomableImage from '../../components/ZoomableImage';

const AddGroup: () => Node = props => {
  //console.log("here the groups data--->",JSON.stringify( props))   // not show item in this props

  const {item} = props.route.params;
  const inputRef = useRef([]);
  const array_index = 0;
  const dispatch = useDispatch();

  // ***************************************
  // ------- Reason of code variable is when user press on update button then first we delete
  // all gurantor then add again all gurantors so while delete we need to stop add gurantor methode
  // so code  variable help us for this operation
  var code = 0;
  // **************************************
  const [groupStatus, setGroupStatus] = React.useState(['Processed']);
  const [visitedBorrow, setVisitedBorrow] = React.useState(VisitedList);
  const [remarks, setRemarks] = React.useState(Remarks);
  const [desicion, setDecision] = React.useState(Decision);
  const [Modalizer, SetModalizer] = React.useState(false);
  const [visitTypeArray, setVisitType] = React.useState([
    'Physical Visit',
    'Non-Physical Visit',
  ]);
  const [membersTemp, setMembersTemp] = React.useState([]);
  const [title, setTitle] = React.useState([]);
  const [progress, setProgresss] = useState(false);
  const [loading, setLoading] = React.useState(true);
  const [getImage, setImage] = React.useState('');
  const [getForms, setFroms] = useState([]);
  const [noData, setNoData] = useState(false);
  const [getData, setData] = useState('');
  const UpdateReducer = useSelector(state => state.UpdateReducer);
  var updateCheck = UpdateReducer.updateCheck;
  const CustomGetDataModule = useSelector(
    state => state.GroupArrayReducer.groupArray,
  );
  const [allDataobj, setAlldataobj] = React.useState(
    updateCheck.value ? item : CustomGetDataModule,
  );
  const [members, setMembers] = React.useState(
    updateCheck.value ? item.groupMembers : [],
  );
  //console.log("group dataaaaa in item------->",members)
  const getUserData = useSelector(state => state.UserData);
  var regex = /^[a-zA-Z ]*$/;
  let speacial = /[^a-zA-Z0-9-]/g;
  // console.log("group dataaaaa in item------->",JSON.stringify( props))    // shown empty item
  const [activeTab, setActiveTab] = React.useState(1);
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
  function focusNextField(nextField) {
    try {
      inputRef[nextField].focus();
    } catch (e) {
      //console.log('error=>', e);
    }
  }
  const takePhoto = i => {
    ImagePicker.openCamera({
      width: 300,
      height: 400,
      compressImageQuality: 0.5,

      cropping: false,
    })
      .then(async image => {
        let get = allDataobj;
        var data = await RNFS.readFile(image.path, 'base64').then(res => {
          return res;
        });
        if (getUserData.UserData.EmployeeTypeName == 'Verification Officer') {
          get.groupImagebyVerificationOff = data;
        } else {
          get.groupImage = data;
        }
        setAlldataobj({...get});
        setImage(data);
      })
      .catch(e => {});
  };

  //this methode is getting image from gallery
  const takePhotofromGallery = () => {
    ImagePicker.openPicker({
      width: 300,
      height: 400,
      cropping: false,
    }).then(async image => {
      let get = allDataobj;
      var data = await RNFS.readFile(image.path, 'base64').then(res => {
        return res;
      });
      get.groupImage = data;
      setAlldataobj({...get});
      setImage(data);
    });
  };

  const pickImges = () => {
    takePhotofromGallery();
  };
  const capture = () => {
    takePhoto();
  };
  const handleSaveGroup = () => {
    if (members.length <= 0) {
      setActiveTab(2);
      alert('Please add at least 3 members');
      return;
    } else {
      let get = allDataobj;
      get.groupMembers = members;
      setAlldataobj({...get});
    }
    var count = 0;
    members.map((underitem, underIndex) => {
      if (underitem.IsGroupLeader == true) {
        count++;
      }
    });
    if (count == 0) {
      alert('Please Select Leader');
      return;
    } else if (members.length < 3) {
      alert('Please Select at least 3 members');
      return;
    } else if (members.length > 7) {
      alert('You can not select more than 7 Members');
      return;
    } else if (allDataobj.groupName.value == '') {
      setActiveTab(1);
      let get = allDataobj;
      get.groupName.error = true;
      setAlldataobj({...get});
      return;
    } else if (allDataobj.groupStatus.value == '') {
      setActiveTab(1);
      let get = allDataobj;
      get.groupStatus.error = true;
      alert('Please Select Group Status');
      setAlldataobj({...get});
      return;
    } else if (allDataobj.commentOfAddedby.value == '') {
      setActiveTab(3);
      let get = allDataobj;
      get.commentOfAddedby.error = true;
      setAlldataobj({...get});
      return;
    } else if (
      getUserData.UserData.EmployeeTypeName == 'Branch Manager' &&
      allDataobj.groupImage == undefined
    ) {
      setActiveTab(3);
      Alert.alert('Stop!', 'Please insert Group Image');
      return;
    } else if (getUserData.UserData.EmployeeTypeName == 'Branch Manager') {
      loadMore();
    } else if (
      getUserData.UserData.EmployeeTypeName == 'Verification Officer' &&
      allDataobj.groupImagebyVerificationOff == undefined &&
      allDataobj?.visitType?.value != 'Non-Physical Visit'
    ) {
      Alert.alert('Stop!', 'Please insert Image for Verification');
    } else if (
      getUserData.UserData.EmployeeTypeName == 'Verification Officer'
    ) {
      loadMore();
    } else {
      UpdateAndSave();
    }
  };
  const handleLocation = () => {
    if (
      allDataobj.groupLocation == undefined &&
      getUserData.UserData.EmployeeTypeName == 'Branch Manager'
    ) {
      setProgresss(true);
      setTitle('Getting Location..');

      getCurrentLocation(async (position, mocked) => {
        if (position) {
          var lat = position.coords.latitude;
          var lon = position.coords.longitude;
          var loc = lat + '-' + lon;
          if (allDataobj.groupLocation == undefined) {
            let get = allDataobj;
            get.groupLocation = loc;
            setAlldataobj({...get});
            console.log('update loc');
          }
          UpdateAndSave();
        } else {
          setProgresss(false);
          Alert.alert(
            'Sorry!',
            'Could not get your location, you cannot proceed',
          );
        }
        //   alert(JSON.stringify(position.coords.latitude))
      });
    } else if (
      allDataobj.verificationOffLoc == undefined &&
      getUserData.UserData.EmployeeTypeName == 'Verification Officer'
    ) {
      setProgresss(true);
      setTitle('Getting Location..');

      getCurrentLocation(async (position, mocked) => {
        if (position) {
          var lat = position.coords.latitude;
          var lon = position.coords.longitude;
          var loc = lat + '-' + lon;
          if (allDataobj.verificationOffLoc == undefined) {
            let get = allDataobj;
            get.verificationOffLoc = loc;
            setAlldataobj({...get});
            console.log('update verificationOffLoc loc');
          }
          UpdateAndSave();
        } else {
          setProgresss(false);
          Alert.alert(
            'Sorry!',
            'Could not get your location, you cannot proceed',
          );
        }
        //   alert(JSON.stringify(position.coords.latitude))
      });
    } else {
      UpdateAndSave();
      return;
    }
  };

  const loadMore = () => {
    if (allDataobj.commentsofVerifiedby.value == '') {
      setActiveTab(3);
      let get = allDataobj;
      get.commentsofVerifiedby.error = true;
      Alert.alert('Stop!', 'Please add comment');
      setAlldataobj({...get});
      return;
    } else if (allDataobj.visitedBorrower.value == '') {
      setActiveTab(4);
      let get = allDataobj;
      get.visitedBorrower.error = true;
      alert('Please Select Visited Borrow');
      setAlldataobj({...get});
      return;
    } else if (allDataobj.borrowerName.value == '') {
      setActiveTab(4);
      let get = allDataobj;
      get.borrowerName.error = true;
      setAlldataobj({...get});
      return;
    } else if (allDataobj.borrowerAddress.value == '') {
      setActiveTab(4);
      let get = allDataobj;
      get.borrowerAddress.error = true;
      setAlldataobj({...get});
      return;
    } else if (allDataobj.borrowerPhone.value == '') {
      setActiveTab(4);
      let get = allDataobj;
      get.borrowerPhone.error = true;
      setAlldataobj({...get});
      return;
    } else if (allDataobj.borrowerPhone.value.length < 10) {
      setActiveTab(4);
      let get = allDataobj;
      get.borrowerPhone.error = true;
      alert('Please insert valid Phone Number');
      setAlldataobj({...get});
      return;
    } else if (allDataobj.borrowerStaification.value == '') {
      setActiveTab(4);
      alert('Please Select Remarks');
      return;
    } else if (allDataobj.socialAppraisal.value == '') {
      setActiveTab(4);
      alert('Please Select Social Apprasial');
      return;
    } else if (allDataobj.borrowerApproval.value == '') {
      setActiveTab(5);
      alert('Please Select Decision');
      return;
    } else if (allDataobj.borrowerRemarks.value == '') {
      setActiveTab(5);
      let get = allDataobj;
      get.borrowerRemarks.error = true;
      setAlldataobj({...get});
      return;
    } else if (
      getUserData.UserData.EmployeeTypeName == 'Verification Officer' &&
      allDataobj?.verificationofficerName?.value == ''
    ) {
      // setToast({
      //   type: "error",
      //   message: "Please enter Verification Officer Name!",
      // });
      let get = allDataobj;
      get.verificationofficerName.error = true;
      setAlldataobj({...get});
      return;
    } else if (
      getUserData.UserData.EmployeeTypeName == 'Verification Officer' &&
      allDataobj?.verificationComments?.value == null
    ) {
      // setToast({
      //   type: "error",
      //   message: "Please enter Verification Officer Comments!",
      // });
      setActiveTab(6);
      Alert.alert('Stop!', 'Please insert Verification Officer Comments');
      let get = allDataobj;
      get.verificationComments.error = true;
      setAlldataobj({...get});
      return;
    } else if (
      allDataobj?.visitType?.value == 'Physical Visit' &&
      allDataobj?.groupImagebyVerificationOff == undefined
    ) {
      // setToast({
      //   type: "error",
      //   message: "Please enter Verification Officer Comments!",
      // });
      setActiveTab(6);
      Alert.alert('Stop!', 'Please take a picture of customer!');
      let get = allDataobj;
      get.verificationComments.error = true;
      setAlldataobj({...get});
      return;
    }

    handleLocation();
  };
  const UpdateAndSave = () => {
    if (allDataobj.addedBy.value == '') {
      let get = allDataobj;
      get.addedBy.value =
        (getUserData.UserData.EmployeeTypeName != 'Branch Manager' ||
          getUserData.UserData.EmployeeTypeName != 'Verification Officer') &&
        getUserData.UserData.FirstName + ' ' + getUserData.UserData.LastName;
      setAlldataobj({...get});
      // return;
    }
    if (allDataobj.verifiedBy.value == '') {
      let get = allDataobj;
      get.verifiedBy.value =
        getUserData.UserData.EmployeeTypeName == 'Branch Manager' &&
        getUserData.UserData.FirstName + ' ' + getUserData.UserData.LastName;
      setAlldataobj({...get});
      // return;
    }
    if (allDataobj?.verificationofficerName?.value == '') {
      let get = allDataobj;
      get.verificationofficerName = {
        value:
          getUserData.UserData.EmployeeTypeName == 'Verification Officer' &&
          getUserData.UserData.FirstName + ' ' + getUserData.UserData.LastName,
        error: false,
      };
      setAlldataobj({...get});
      // return;
    }
    // *********************************************************
    // Update Group
    // ****************************************************

    if (updateCheck.value) {
      //first delete gurantors
      code = 0;
      console.log('---->call i then' + code);
      setTitle('Updating..');
      setProgresss(true);
      DeleteGroup_Gurantors(
        getUserData.UserData.EmployeeTypeName == 'Branch Manager'
          ? updateCheck.composite_key
          : getUserData.UserData.EmployeeTypeName == 'Verification Officer'
          ? updateCheck.composite_key
          : updateCheck.id,
      ).then(() => {
        recursionInsertion(
          members,
          members.length,
          getUserData.UserData.EmployeeTypeName == 'Branch Manager'
            ? updateCheck.composite_key
            : getUserData.UserData.EmployeeTypeName == 'Verification Officer'
            ? updateCheck.composite_key
            : updateCheck.id,
        );
      });
      // recursivecountDownOne(members, members.length)
      // props.Updatecheck({value:false,id:""})
    }

    // INSERTING Group
    else {
      setTitle('Inserting..');
      setProgresss(true);
      var date = moment().format('l');
      insertGroupFromData(
        null,
        null,
        allDataobj.groupName.value,
        JSON.stringify(allDataobj),
        date,
        '',
        0,
      )
        .then(vales => {
          //    alert("" + JSON.stringify(vales.group_id))
          // countDownOne(members.length, members).
          recursionInsertion(members, members.length, vales.group_id);
          // props.navigation.goBack();
        })
        .catch(error => {});
    }
    //previous not paas null instead of id
  };
  const modalizeRef = useRef<Modalize>(null);

  const onOpen = () => {
    SetModalizer(true);
    modalizeRef.current?.open();
    fetchData();
  };
  const _onPressCheckBox = (item, index) => {
    var obj = {
      CustomerGroupId: '',
      CustomerGroupMemberId: index + 1,
      CustomerId: item.id,
      Fullname: item.user_name,
      IsGroupLeader: false,
      NicNumber: item.user_cnic,
      user_businessAddress: item.user_businessAddress,
      user_contactNumber: item.user_contactNumber,
      user_address: item.user_address,
    };
    // var parser=JSON.parse(item.forms)
    if (item.isCheck) {
      var get = getForms;
      get[index].isCheck = false;
      setFroms([...get]);

      var getList = members;
      getList.splice(item, 1);
      console.log('--->', JSON.stringify(getList));

      setMembersTemp([...getList]);
    } else {
      var get = getForms;
      get[index].isCheck = true;
      setFroms([...get]);

      var getList = members;
      getList.push(obj);
      console.log('--->', JSON.stringify(getList));
      setMembersTemp([...getList]);
    }
  };
  React.useEffect(() => {
    const unsubscribe = props.navigation.addListener('focus', () => {
      fetchData();
    });
    setValues();
  }, []);

  const recursionInsertion = (members, fromNumber, group_id) => {
    var guarantor_fullname = members[fromNumber - 1].Fullname;
    var guarantor_cnic = members[fromNumber - 1].NicNumber;
    var guarantor_businessStatus = true;
    var guarantor_jobType = 'Private';
    var guarantor_address = members[fromNumber - 1].user_address;
    var user_contactNumber = members[fromNumber - 1].user_contactNumber;
    var guarantor_businessNote = '';
    var guarantor_jobDescription = '';
    var guarantor_businessAddress =
      members[fromNumber - 1].user_businessAddress;

    insert_Group_Gurantors(
      group_id,
      false,
      guarantor_fullname,
      guarantor_businessNote,
      guarantor_jobType,
      guarantor_businessStatus,
      guarantor_cnic,
      guarantor_address,
      user_contactNumber,
      guarantor_jobDescription,
      guarantor_businessAddress,
    ).then(() => {
      let nextNumber = fromNumber - 1;
      if (nextNumber > 0) {
        recursionInsertion(members, nextNumber, group_id);
      } else {
        updateGroupsForm(
          allDataobj.groupName.value,
          JSON.stringify(allDataobj),
          updateCheck.id,
        )
          .then(value => {
            resetValue();
            setProgresss(false);
            Alert.alert('Group Updated!', 'Successfully', [
              {
                text: 'OK',
                onPress: () => {
                  props.navigation.goBack();
                },
              },
            ]);
          })
          .catch(error => {
            alert(error + 'error');
          });
      }
    });
  };
  const resetValue = () => {
    // ======================= RESET ALL VALUES =====================
    props.Updatecheck({value: false, id: ''});
    dispatch({
      type: 'GROUPARRAY',
      payload: {
        groupName: {value: '', error: false},
        groupStatus: {value: 'Processed', error: false},
        groupNote: {value: '', error: false},
        groupMembers: [],
        ///////////////////////////comment
        addedBy: {value: '', error: false},
        addedByDesignation: {value: 'Field Officer', error: false},
        commentOfAddedby: {value: '', error: false},
        verifiedBy: {value: '', error: false},
        verifiedByDesignation: {value: 'Branch Manager', error: false},
        commentsofVerifiedby: {value: '', error: false},
        groupImage: undefined,
        //-------------------------------Verify Indicator
        counductPhysicalVisit: {value: 1, error: false},
        verifiedreApparisal: {value: 1, error: false},
        verifiedRepaymentHistory: {value: 1, error: false},
        criticalAssetsValuation: {value: 1, error: false},
        verifiedbyContactNumber: {value: 1, error: false},
        meetwithSocialResponsible: {value: 1, error: false},
        meetwithPersonalGuarantee: {value: 1, error: false},
        verifiedProvidedDoc: {value: 1, error: false},
        borrowerCashFlow: {value: 1, error: false},
        supportingCnicForFemale: {value: 1, error: false},
        borrowerRepaymentCapacity: {value: 1, error: false},
        borrowerBusinessORHome: {value: 1, error: false},
        repaymentCapacityAnalysis: {value: 1, error: false},
        isTheLoanPricingIsClearlyDisclosed: {value: 1, error: false},
        isTheBorrowerInformedAboutTheGrievance: {value: 1, error: false},
        isTheBorrowerAwareAboutTheCollateral: {value: 1, error: false},
        anyMajorRisksInvolvedInBusiness: {value: 1, error: false, detail: null},
        //----------------------------Compailance
        amlPolicyandProcedure: {value: 1, error: false},
        socialandManagmentPolicy: {value: 1, error: false},
        verifiedCIBPolicy: {value: 1, error: false},
        doesBorrowerEnivro: {value: 1, error: false},
        doesEnterprise: {value: 1, error: false},
        //////////////////////////////---S RISK--------
        riskAssementno1: {value: '', error: false},
        riskAssementno2: {value: '', error: false},
        riskAssementno3: {value: '', error: false},
        riskAssementTimelineone: {value: '', error: false},
        riskAssementTimelinetwo: {value: '', error: false},
        riskAssementTimelinethree: {value: '', error: false},
        visitedBorrower: {value: '', error: false},
        borrowerName: {value: '', error: false},
        borrowerAddress: {value: '', error: false},
        borrowerPhone: {value: '', error: false},
        borrowerStaification: {value: '', error: false},
        socialAppraisal: {value: '', error: false},
        borrowerApproval: {value: '', error: false},
        borrowerRemarks: {value: '', error: false},
        //-----------   Loan Verification
        verificationofficerName: {value: '', error: false},
        verificationByDesignation: {
          value: 'Verification Officer',
          error: false,
        },
        verificationComments: {value: '', error: false},
        visitType: {value: '', index: 0},
        groupImagebyVerificationOff: undefined,
        verificationOffLoc: undefined,
      },
    });

    // ======================= RESET ALL VALUES =====================
  };

  const checkingMembers = itemm => {
    if (!Modalizer) {
      return;
    }
    console.log('isGroupMember' + itemm.user_cnic);
    var value = false;
    members.map((item, index) => {
      if (itemm.user_cnic == item.NicNumber) {
        value = true;
      } else {
      }
    });
    return value;
  };

  const fetchData = () => {
    setLoading(true);
    getCustomerFromsforSelection(
      setFroms,
      setNoData,
      setLoading,
      getUserData.UserData.EmployeeTypeName == 'Branch Manager'
        ? '1'
        : getUserData.UserData.EmployeeTypeName == 'Verification Officer'
        ? '2'
        : '0',
    );
  };
  const setValues = () => {
    if (getUserData.UserData.EmployeeTypeName == 'Verification Officer') {
      let get = allDataobj;
      get['verificationofficerName'] = {
        value:
          getUserData.UserData.FirstName + ' ' + getUserData.UserData.LastName,
        error: false,
      };
      get['verificationByDesignation'] = {
        value: getUserData.UserData.EmployeeTypeName,
      };
      // get["visitType"] = { value: 'Non-Physical Visit' };
      setAlldataobj({...get});
    }
  };
  return (
    <SafeAreaView style={styles.safeview}>
      <AppStatusBar></AppStatusBar>
      <View style={GlobalStyles.row}>
        <Header Theme={Colors} back={true} screenNo={2}></Header>

        <TextView
          type={'mini_heading22'}
          style={{paddingHorizontal: 30, marginTop: 55}}
          text="Add Group"></TextView>
      </View>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* <KeyboardAvoidingView behavior="padding"> */}
        <View style={{marginTop: 30}}>
          <View style={[styles.box]}>
            <Pressable onPressIn={_customerTab} style={styles.buttomheader}>
              <TextView
                type={'Light'}
                text="Group info"
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
                  <FormInputs
                    required={true}
                    text={'Group Name'}
                    error={allDataobj.groupName.error}
                    value={allDataobj.groupName.value}
                    onChangeText={(value: string) => {
                      if (!regex.test(value)) {
                        return;
                      }
                      let get = allDataobj;
                      get.groupName.value = value;
                      get.groupName.error = false;

                      setAlldataobj({...get});
                    }}></FormInputs>
                  <View style={{marginTop: 3}}>
                    <Dropdownlist
                      data={groupStatus}
                      required={true}
                      label={
                        allDataobj.groupStatus.value == ''
                          ? 'Group Status'
                          : allDataobj.groupStatus.value
                      }
                      onSelect={async value => {
                        let get = allDataobj;
                        get.groupStatus.value = groupStatus[value];
                        setAlldataobj({...get});
                      }}></Dropdownlist>
                  </View>
                </View>
                <View style={styles.row2}>
                  <FormInputs
                    ref={el => (inputRef.current[3 + 'three'] = el)}
                    _onSubmit={() => focusNextField(4 + 'three')}
                    error={allDataobj.groupNote.error}
                    value={allDataobj.groupNote.value}
                    onChangeText={(value: string) => {
                      let get = allDataobj;
                      get.groupNote.value = value;
                      get.groupNote.error = false;
                      setAlldataobj({...get});
                    }}
                    text={'Note'}></FormInputs>
                </View>
              </View>
            )}
          </View>
          {/* /////////////////////////////////// */}

          <View style={[styles.box]}>
            <Pressable onPressIn={_customerTab2} style={styles.buttomheader}>
              <TextView
                type={'Light'}
                text="Group Members"
                style={{color: Colors.white}}></TextView>
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
            </Pressable>

            {activeTab == 2 && (
              <View style={styles.bounceview}>
                <Chip
                  icon={'plus'}
                  style={{marginBottom: 5}}
                  onPress={() => {
                    onOpen();
                  }}>
                  <TextView
                    type={'Light'}
                    style={{}}
                    text={'Add Member'}></TextView>
                </Chip>

                {members.map((item, index) => {
                  console.log('here we go --->', members);
                  return (
                    <MyChipcomponent
                      value={item.NicNumber}
                      isLeader={item.IsGroupLeader}
                      onPressLeader={() => {
                        if (item.IsGroupLeader) {
                          let get = members;
                          get[index].IsGroupLeader = false;
                          setMembers([...get]);
                        } else {
                          let get = members;
                          // get[index].IsGroupLeader=true
                          members.map((underitem, underIndex) => {
                            if (underitem.NicNumber == item.NicNumber) {
                              get[underIndex].IsGroupLeader = true;
                            } else {
                              get[underIndex].IsGroupLeader = false;
                            }
                          });
                          console.log('--->', get);
                          setMembers([...get]);
                        }
                      }}
                      // onChangeText={value => {
                      //   let temp = members;
                      //   temp[index].cnic = value;
                      //   setMembers([...temp]);
                      // }}
                      onClose={() => {
                        Alert.alert(
                          'Remove!',
                          'Do you really want to remove this member?',
                          [
                            {
                              text: 'Cancel',
                              onPress: () => console.log('Cancel Pressed'),
                              style: 'cancel',
                            },
                            {
                              text: 'OK',
                              onPress: () => {
                                code = 0;
                                // recursionfordeleteSelfone(members, members.length, index);
                                DeleteSelectedGurantors(
                                  updateCheck.id,
                                  item.NicNumber,
                                ).then(() => {
                                  let temp = members;
                                  temp.splice(index, 1);
                                  setMembers([...temp]);
                                });
                              },
                            },
                          ],
                        );
                      }}></MyChipcomponent>
                  );
                })}
              </View>
            )}
          </View>
          {/* /////////////////////////////////// */}

          <View style={[styles.box]}>
            <Pressable onPressIn={_customerTab3} style={styles.buttomheader}>
              <TextView
                type={'Light'}
                text="Comments"
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

            {activeTab == 3 && (
              <View style={styles.bounceview}>
                <View style={styles.row2}>
                  <FormInputs
                    text={'Added By'}
                    required={true}
                    error={allDataobj.addedBy.error}
                    value={
                      allDataobj?.addedBy.value == ''
                        ? getUserData.UserData.EmployeeTypeName !=
                            'Branch Manager' &&
                          getUserData.UserData.FirstName +
                            ' ' +
                            getUserData.UserData.LastName
                        : allDataobj?.addedBy.value
                    }
                    onChangeText={(value: string) => {
                      if (
                        getUserData.UserData.EmployeeTypeName ==
                          'Branch Manager' ||
                        getUserData.UserData.EmployeeTypeName ==
                          'Verification Officer'
                      ) {
                        Alert.alert(
                          'Stop!',
                          'Only Loan Officer can update this data',
                        );
                        return;
                      }
                      if (!regex.test(value)) {
                        return;
                      }
                      let get = allDataobj;
                      get.addedBy.value = value;
                      get.addedBy.error = false;
                      setAlldataobj({...get});
                    }}></FormInputs>
                  <View style={{marginTop: 0}}>
                    <TextView
                      type={'formLabel'}
                      text={'Added by Designation'}
                      style={{
                        color: '#737373',
                        marginLeft: 10,
                        width: width / 3,
                        marginBottom: -20,
                      }}></TextView>
                    <Dropdownlist
                      data={Officers}
                      required={true}
                      label={
                        allDataobj.addedByDesignation.value == ''
                          ? getUserData.UserData.EmployeeTypeName
                          : allDataobj.addedByDesignation.value
                      }
                      onSelect={async value => {
                        if (
                          getUserData.UserData.EmployeeTypeName ==
                            'Branch Manager' ||
                          getUserData.UserData.EmployeeTypeName ==
                            'Verification Officer'
                        ) {
                          Alert.alert(
                            'Stop!',
                            'Only Loan Officer can update this data',
                          );
                          return;
                        }
                        let get = allDataobj;
                        get.addedByDesignation.value = Officers[value];
                        setAlldataobj({...get});
                      }}></Dropdownlist>
                  </View>
                </View>
                <View style={styles.row2}>
                  <FormInputs
                    required={true}
                    error={allDataobj.commentOfAddedby.error}
                    value={allDataobj.commentOfAddedby.value}
                    onChangeText={(value: string) => {
                      if (
                        getUserData.UserData.EmployeeTypeName ==
                          'Branch Manager' ||
                        getUserData.UserData.EmployeeTypeName ==
                          'Verification Officer'
                      ) {
                        Alert.alert(
                          'Stop!',
                          'Only Loan Officer can update this data',
                        );
                        return;
                      }
                      let get = allDataobj;
                      get.commentOfAddedby.value = value;
                      get.commentOfAddedby.error = false;

                      setAlldataobj({...get});
                    }}
                    ref={el => (inputRef.current[3 + 'three'] = el)}
                    _onSubmit={() => focusNextField(4 + 'three')}
                    text={'Comments of Added By'}></FormInputs>
                </View>
                {(getUserData.UserData.EmployeeTypeName == 'Branch Manager' ||
                  getUserData.UserData.EmployeeTypeName ==
                    'Verification Officer') && (
                  <View>
                    <View style={styles.row2}>
                      <FormInputs
                        ref={el => (inputRef.current[3 + 'three'] = el)}
                        _onSubmit={() => focusNextField(4 + 'three')}
                        text={'Verified By'}
                        error={allDataobj.verifiedBy.error}
                        value={
                          allDataobj.verifiedBy.value == ''
                            ? getUserData.UserData.EmployeeTypeName ==
                                'Branch Manager' &&
                              getUserData.UserData.FirstName +
                                ' ' +
                                getUserData.UserData.LastName
                            : allDataobj.verifiedBy.value
                        }
                        onChangeText={(value: string) => {
                          if (
                            getUserData.UserData.EmployeeTypeName !=
                            'Branch Manager'
                          ) {
                            Alert.alert(
                              'Stop!',
                              'Only Branch Manager can update this data',
                            );
                            return;
                          }
                          let get = allDataobj;
                          get.verifiedBy.value = value;
                          get.verifiedBy.error = false;
                          setAlldataobj({...get});
                        }}></FormInputs>

                      <View style={{marginTop: 0}}>
                        <TextView
                          type={'formLabel'}
                          text={'Verified By Designation'}
                          style={{
                            color: '#737373',
                            marginLeft: 10,
                            width: width / 3,
                            marginBottom: -20,
                          }}></TextView>
                        <Dropdownlist
                          data={Officers}
                          label={
                            allDataobj.verifiedByDesignation.value == ''
                              ? 'Field Officer'
                              : allDataobj.verifiedByDesignation.value
                          }
                          onSelect={async value => {
                            if (
                              getUserData.UserData.EmployeeTypeName !=
                              'Branch Manager'
                            ) {
                              Alert.alert(
                                'Stop!',
                                'Only Branch Manager can update this data',
                              );
                              return;
                            }
                            let get = allDataobj;
                            get.verifiedByDesignation.value = Officers[value];
                            setAlldataobj({...get});
                          }}></Dropdownlist>
                      </View>
                    </View>

                    <View style={styles.row2}>
                      <FormInputs
                        required={true}
                        ref={el => (inputRef.current[3 + 'three'] = el)}
                        _onSubmit={() => focusNextField(4 + 'three')}
                        text={'Comments of Verified By'}
                        error={allDataobj.commentsofVerifiedby.error}
                        value={allDataobj.commentsofVerifiedby.value}
                        onChangeText={(value: string) => {
                          if (
                            getUserData.UserData.EmployeeTypeName !=
                            'Branch Manager'
                          ) {
                            Alert.alert(
                              'Stop!',
                              'Only Branch Manager can update this data',
                            );
                            return;
                          }
                          let get = allDataobj;
                          get.commentsofVerifiedby.value = value;
                          get.commentsofVerifiedby.error = false;
                          setAlldataobj({...get});
                        }}></FormInputs>
                    </View>

                    <View style={styles.bounceview}>
                      <View
                        style={{
                          marginTop: 0,
                          flexDirection: 'row',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}>
                        <View
                          style={{
                            height: 200,
                            width: width / 2.5,
                            justifyContent: 'center',
                          }}>
                          <TextView
                            style={{alignSelf: 'center'}}
                            type={'small'}
                            text="Group Image"></TextView>
                          {allDataobj.groupImage == undefined ? (
                            <MaterialCommunityIcons
                              style={{alignSelf: 'center'}}
                              name="google-photos"
                              size={56}></MaterialCommunityIcons>
                          ) : (
                            <ZoomableImage
                              images={`data:image/gif;base64,${allDataobj.groupImage}`}
                            />
                          )}

                          <View
                            style={{
                              flexDirection: 'row',
                              alignItems: 'center',
                              marginTop: 20,
                              justifyContent: 'space-around',
                            }}>
                            {/* <Pressable
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
                                width: width / 6,
                                borderRadius: 30,
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
                  </View>
                )}
              </View>
            )}
          </View>
          {/* /////////////////////////////////// */}

          {(getUserData.UserData.EmployeeTypeName == 'Branch Manager' ||
            getUserData.UserData.EmployeeTypeName ==
              'Verification Officer') && (
            <View style={[styles.box]}>
              <Pressable onPressIn={_customerTab4} style={styles.buttomheader}>
                <TextView
                  type={'Light'}
                  text="Branch Manager Verfication CheckList"
                  style={{color: Colors.white}}></TextView>
                <Pressable onPressIn={_customerTab4}>
                  {activeTab == 4 ? (
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

              {activeTab == 4 && (
                <View style={styles.bounceview}>
                  <View style={styles.row3}>
                    <TextView
                      style={{flex: 1}}
                      type={'normalRg'}
                      text={'Verification Indicators'}></TextView>

                    <View style={styles.row3}>
                      <TextView
                        style={{marginRight: 20}}
                        type={'normalRg'}
                        text={'Yes'}></TextView>
                      <TextView
                        style={{marginRight: 5}}
                        type={'normalRg'}
                        text={'No'}></TextView>
                    </View>
                  </View>
                  <View style={styles.line}>
                    <TextView
                      style={styles.nulltext}
                      type={'normalRg'}
                      text={''}></TextView>
                  </View>
                  <VerificationIndicator
                    value={allDataobj.counductPhysicalVisit.value}
                    onPress={value => {
                      if (
                        getUserData.UserData.EmployeeTypeName !=
                        'Branch Manager'
                      ) {
                        Alert.alert(
                          'Stop!',
                          'Only Branch Manager can update this data',
                        );
                        return;
                      }
                      let get = allDataobj;
                      get.counductPhysicalVisit.value = value;
                      setAlldataobj({...get});
                    }}
                    text={'Conducted Borrower Physical Visit'}
                  />

                  <VerificationIndicator
                    value={allDataobj.verifiedreApparisal.value}
                    onPress={value => {
                      if (
                        getUserData.UserData.EmployeeTypeName !=
                        'Branch Manager'
                      ) {
                        Alert.alert(
                          'Stop!',
                          'Only Branch Manager can update this data',
                        );
                        return;
                      }
                      let get = allDataobj;
                      get.verifiedreApparisal.value = value;
                      setAlldataobj({...get});
                    }}
                    text={
                      'Verified borrower appraisal information during re appraisal'
                    }
                  />

                  <VerificationIndicator
                    value={allDataobj.verifiedRepaymentHistory.value}
                    onPress={value => {
                      if (
                        getUserData.UserData.EmployeeTypeName !=
                        'Branch Manager'
                      ) {
                        Alert.alert(
                          'Stop!',
                          'Only Branch Manager can update this data',
                        );
                        return;
                      }
                      let get = allDataobj;
                      get.verifiedRepaymentHistory.value = value;
                      setAlldataobj({...get});
                    }}
                    text={
                      'Verified borrower repayment history (For repeat clients only)'
                    }
                  />

                  <VerificationIndicator
                    value={allDataobj.criticalAssetsValuation.value}
                    onPress={value => {
                      if (
                        getUserData.UserData.EmployeeTypeName !=
                        'Branch Manager'
                      ) {
                        Alert.alert(
                          'Stop!',
                          'Only Branch Manager can update this data',
                        );
                        return;
                      }
                      let get = allDataobj;
                      get.criticalAssetsValuation.value = value;
                      setAlldataobj({...get});
                    }}
                    text={
                      'Critically Verified borrower assets and conducted asset valuation'
                    }
                  />

                  <VerificationIndicator
                    value={allDataobj.verifiedbyContactNumber.value}
                    onPress={value => {
                      if (
                        getUserData.UserData.EmployeeTypeName !=
                        'Branch Manager'
                      ) {
                        Alert.alert(
                          'Stop!',
                          'Only Branch Manager can update this data',
                        );
                        return;
                      }
                      let get = allDataobj;
                      get.verifiedbyContactNumber.value = value;
                      setAlldataobj({...get});
                    }}
                    text={'Verified Borrower provided Contact Numbers'}
                  />

                  <VerificationIndicator
                    value={allDataobj.meetwithSocialResponsible.value}
                    onPress={value => {
                      if (
                        getUserData.UserData.EmployeeTypeName !=
                        'Branch Manager'
                      ) {
                        Alert.alert(
                          'Stop!',
                          'Only Branch Manager can update this data',
                        );
                        return;
                      }
                      let get = allDataobj;
                      get.meetwithSocialResponsible.value = value;
                      setAlldataobj({...get});
                    }}
                    text={
                      'Meet with all group members and ensured the social responsibility'
                    }
                  />

                  <VerificationIndicator
                    value={allDataobj.meetwithPersonalGuarantee.value}
                    onPress={value => {
                      if (
                        getUserData.UserData.EmployeeTypeName !=
                        'Branch Manager'
                      ) {
                        Alert.alert(
                          'Stop!',
                          'Only Branch Manager can update this data',
                        );
                        return;
                      }
                      let get = allDataobj;
                      get.meetwithPersonalGuarantee.value = value;
                      setAlldataobj({...get});
                    }}
                    text={
                      'Meet with borrower guarantor and ensured the personal guarantee'
                    }
                  />

                  <VerificationIndicator
                    value={allDataobj.verifiedProvidedDoc.value}
                    onPress={value => {
                      if (
                        getUserData.UserData.EmployeeTypeName !=
                        'Branch Manager'
                      ) {
                        Alert.alert(
                          'Stop!',
                          'Only Branch Manager can update this data',
                        );
                        return;
                      }
                      let get = allDataobj;
                      get.verifiedProvidedDoc.value = value;
                      setAlldataobj({...get});
                    }}
                    text={
                      'Verified the provided documents by the borrower and guarantor'
                    }
                  />
                  {/* //////////////////////// NEW QUESTIONS /////////////////////////////// */}

                  <VerificationIndicator
                    value={
                      'borrowerCashFlow' in allDataobj
                        ? allDataobj?.borrowerCashFlow?.value
                        : 1
                    }
                    onPress={value => {
                      if (
                        getUserData.UserData.EmployeeTypeName !=
                        'Branch Manager'
                      ) {
                        Alert.alert(
                          'Stop!',
                          'Only Branch Manager can update this data',
                        );
                        return;
                      }
                      let get = allDataobj;
                      get['borrowerCashFlow'] = {value: value, error: false};
                      setAlldataobj({...get});
                    }}
                    text={"Borrower's Cash Flow"}
                  />

                  <VerificationIndicator
                    value={
                      'supportingCnicForFemale' in allDataobj
                        ? allDataobj?.supportingCnicForFemale?.value
                        : 1
                    }
                    onPress={value => {
                      if (
                        getUserData.UserData.EmployeeTypeName !=
                        'Branch Manager'
                      ) {
                        Alert.alert(
                          'Stop!',
                          'Only Branch Manager can update this data',
                        );
                        return;
                      }
                      let get = allDataobj;
                      get['supportingCnicForFemale'] = {
                        value: value,
                        error: false,
                      };
                      setAlldataobj({...get});
                    }}
                    text={'Supporting CNIC (For Female Clients Only)'}
                  />

                  <VerificationIndicator
                    value={
                      'borrowerRepaymentCapacity' in allDataobj
                        ? allDataobj?.borrowerRepaymentCapacity?.value
                        : 1
                    }
                    onPress={value => {
                      if (
                        getUserData.UserData.EmployeeTypeName !=
                        'Branch Manager'
                      ) {
                        Alert.alert(
                          'Stop!',
                          'Only Branch Manager can update this data',
                        );
                        return;
                      }
                      let get = allDataobj;
                      get['borrowerRepaymentCapacity'] = {
                        value: value,
                        error: false,
                      };
                      setAlldataobj({...get});
                    }}
                    text={
                      "Borrower's Repayment Capacity Analysis (Net Business Saving/Expected Monthly loan Inst). (Principle+ Fin Inc)"
                    }
                  />

                  <VerificationIndicator
                    value={
                      'borrowerBusinessORHome' in allDataobj
                        ? allDataobj?.borrowerBusinessORHome?.value
                        : 1
                    }
                    onPress={value => {
                      if (
                        getUserData.UserData.EmployeeTypeName !=
                        'Branch Manager'
                      ) {
                        Alert.alert(
                          'Stop!',
                          'Only Branch Manager can update this data',
                        );
                        return;
                      }
                      let get = allDataobj;
                      get['borrowerBusinessORHome'] = {
                        value: value,
                        error: false,
                      };
                      setAlldataobj({...get});
                    }}
                    text={"Borrower's Business/Home "}
                  />

                  <VerificationIndicator
                    value={
                      'repaymentCapacityAnalysis' in allDataobj
                        ? allDataobj?.repaymentCapacityAnalysis?.value
                        : 1
                    }
                    onPress={value => {
                      if (
                        getUserData.UserData.EmployeeTypeName !=
                        'Branch Manager'
                      ) {
                        Alert.alert(
                          'Stop!',
                          'Only Branch Manager can update this data',
                        );
                        return;
                      }
                      let get = allDataobj;
                      get['repaymentCapacityAnalysis'] = {
                        value: value,
                        error: false,
                      };
                      setAlldataobj({...get});
                    }}
                    text={
                      'Repayment Capacity Analysis Based on Business Condition:'
                    }
                  />

                  <VerificationIndicator
                    value={
                      'isTheLoanPricingIsClearlyDisclosed' in allDataobj
                        ? allDataobj?.isTheLoanPricingIsClearlyDisclosed?.value
                        : 1
                    }
                    onPress={value => {
                      if (
                        getUserData.UserData.EmployeeTypeName !=
                        'Branch Manager'
                      ) {
                        Alert.alert(
                          'Stop!',
                          'Only Branch Manager can update this data',
                        );
                        return;
                      }
                      let get = allDataobj;
                      get['isTheLoanPricingIsClearlyDisclosed'] = {
                        value: value,
                        error: false,
                      };
                      setAlldataobj({...get});
                    }}
                    text={
                      'Is the loan pricing is clearly disclosed to the borrower'
                    }
                  />

                  <VerificationIndicator
                    value={
                      'isTheBorrowerInformedAboutTheGrievance' in allDataobj
                        ? allDataobj?.isTheBorrowerInformedAboutTheGrievance
                            ?.value
                        : 1
                    }
                    onPress={value => {
                      if (
                        getUserData.UserData.EmployeeTypeName !=
                        'Branch Manager'
                      ) {
                        Alert.alert(
                          'Stop!',
                          'Only Branch Manager can update this data',
                        );
                        return;
                      }
                      let get = allDataobj;
                      get['isTheBorrowerInformedAboutTheGrievance'] = {
                        value: value,
                        error: false,
                      };
                      setAlldataobj({...get});
                    }}
                    text={
                      'Is the borrower informed about the Grievance Redressal Mechanism?'
                    }
                  />

                  <VerificationIndicator
                    value={
                      'isTheBorrowerAwareAboutTheCollateral' in allDataobj
                        ? allDataobj?.isTheBorrowerAwareAboutTheCollateral
                            ?.value
                        : 1
                    }
                    onPress={value => {
                      if (
                        getUserData.UserData.EmployeeTypeName !=
                        'Branch Manager'
                      ) {
                        Alert.alert(
                          'Stop!',
                          'Only Branch Manager can update this data',
                        );
                        return;
                      }
                      let get = allDataobj;
                      get['isTheBorrowerAwareAboutTheCollateral'] = {
                        value: value,
                        error: false,
                      };
                      setAlldataobj({...get});
                    }}
                    text={'Is the borrower aware about the collateral policy?'}
                  />

                  <VerificationIndicator
                    value={
                      'anyMajorRisksInvolvedInBusiness' in allDataobj
                        ? allDataobj?.anyMajorRisksInvolvedInBusiness?.value
                        : 1
                    }
                    onPress={value => {
                      if (
                        getUserData.UserData.EmployeeTypeName !=
                        'Branch Manager'
                      ) {
                        Alert.alert(
                          'Stop!',
                          'Only Branch Manager can update this data',
                        );
                        return;
                      }
                      let get = allDataobj;
                      get['anyMajorRisksInvolvedInBusiness'] = {
                        value: value,
                        error: false,
                        detail: null,
                      };
                      setAlldataobj({...get});
                    }}
                    text={
                      'Any Major Risks involved in Business, that may occur; If Yes Please Mention Details in Deviations Box :'
                    }
                  />
                  {'anyMajorRisksInvolvedInBusiness' in allDataobj &&
                  allDataobj?.anyMajorRisksInvolvedInBusiness?.value == 0 ? (
                    <TextInput
                      keyboardType={'default'}
                      multiline={true}
                      value={
                        allDataobj?.anyMajorRisksInvolvedInBusiness?.detail
                      }
                      style={{
                        color: '#000',
                        borderWidth: 1,
                        borderColor: '#cdcdcd',
                        borderRadius: 10,
                        fontSize: 12,
                        height: 100,
                        textAlignVertical: 'top',
                        paddingLeft: 10,
                        backgroundColor: Colors.white,
                      }}
                      placeholder={'Please Mention Details'}
                      placeholderTextColor={Colors.light_dark_gray}
                      onChangeText={value => {
                        let get = allDataobj;
                        get['anyMajorRisksInvolvedInBusiness'].detail = value;
                        setAlldataobj({...get});
                      }}
                    />
                  ) : null}

                  {/* ////////////////////////// NEW QUESTIONS END /////////////////////////////// */}

                  <View style={styles.row3}>
                    <TextView
                      style={{flex: 1, marginTop: 20}}
                      type={'normalRg'}
                      text={
                        'Conducted Borrower Due Deligence in Complicated with:'
                      }></TextView>
                  </View>
                  <View style={styles.line}>
                    <TextView
                      style={styles.nulltext}
                      type={'normalRg'}
                      text={''}></TextView>
                  </View>
                  {/* /////////////////////////////////// */}
                  <VerificationIndicator
                    value={allDataobj.amlPolicyandProcedure.value}
                    onPress={value => {
                      if (
                        getUserData.UserData.EmployeeTypeName !=
                        'Branch Manager'
                      ) {
                        Alert.alert(
                          'Stop!',
                          'Only Branch Manager can update this data',
                        );
                        return;
                      }
                      let get = allDataobj;
                      get.amlPolicyandProcedure.value = value;
                      setAlldataobj({...get});
                    }}
                    text={'AML/CFT Policy and Procedures'}
                  />

                  <VerificationIndicator
                    value={allDataobj.socialandManagmentPolicy.value}
                    onPress={value => {
                      if (
                        getUserData.UserData.EmployeeTypeName !=
                        'Branch Manager'
                      ) {
                        Alert.alert(
                          'Stop!',
                          'Only Branch Manager can update this data',
                        );
                        return;
                      }
                      let get = allDataobj;
                      get.socialandManagmentPolicy.value = value;
                      setAlldataobj({...get});
                    }}
                    text={'Social and Enviromental Management System Policy'}
                  />

                  <VerificationIndicator
                    value={allDataobj.verifiedCIBPolicy.value}
                    onPress={value => {
                      if (
                        getUserData.UserData.EmployeeTypeName !=
                        'Branch Manager'
                      ) {
                        Alert.alert(
                          'Stop!',
                          'Only Branch Manager can update this data',
                        );
                        return;
                      }
                      let get = allDataobj;
                      get.verifiedCIBPolicy.value = value;
                      setAlldataobj({...get});
                    }}
                    text={
                      'Verified CIB Report of the borrower in complaince with CIB Disbursment Policy'
                    }
                  />

                  <VerificationIndicator
                    value={allDataobj.doesBorrowerEnivro.value}
                    onPress={value => {
                      if (
                        getUserData.UserData.EmployeeTypeName !=
                        'Branch Manager'
                      ) {
                        Alert.alert(
                          'Stop!',
                          'Only Branch Manager can update this data',
                        );
                        return;
                      }
                      let get = allDataobj;
                      get.doesBorrowerEnivro.value = value;
                      setAlldataobj({...get});
                    }}
                    text={
                      'Does the borrower have required goverment issued permits enviromental,labour,health and safety'
                    }
                  />

                  <VerificationIndicator
                    value={allDataobj.doesEnterprise.value}
                    onPress={value => {
                      if (
                        getUserData.UserData.EmployeeTypeName !=
                        'Branch Manager'
                      ) {
                        Alert.alert(
                          'Stop!',
                          'Only Branch Manager can update this data',
                        );
                        return;
                      }
                      let get = allDataobj;
                      get.doesEnterprise.value = value;
                      setAlldataobj({...get});
                    }}
                    text={
                      'Does enterprise engage in activities on the list of excuted activities'
                    }
                  />
                  <View style={styles.row3}>
                    <TextView
                      style={{flex: 1, marginTop: 20}}
                      type={'normalRg'}
                      text={
                        'Corrective Action Plans\n(on the basis of E and S\nRisk Assessment)'
                      }></TextView>
                    <TextView
                      style={{marginTop: 20}}
                      type={'normalRg'}
                      text={'Implementation Timeline'}></TextView>
                  </View>
                  <View style={styles.line}>
                    <TextView
                      style={styles.nulltext}
                      type={'normalRg'}
                      text={''}></TextView>
                  </View>
                  {/* /////////////////////////////////// */}

                  <CorrectiveActionPlans
                    value={allDataobj.riskAssementno1.value}
                    valuetwo={allDataobj.riskAssementTimelineone.value}
                    onChangeText={value => {
                      if (
                        getUserData.UserData.EmployeeTypeName !=
                        'Branch Manager'
                      ) {
                        Alert.alert(
                          'Stop!',
                          'Only Branch Manager can update this data',
                        );
                        return;
                      }
                      let get = allDataobj;
                      get.riskAssementno1.value = value;
                      setAlldataobj({...get});
                    }}
                    onChangeTexttwo={value => {
                      if (
                        getUserData.UserData.EmployeeTypeName !=
                        'Branch Manager'
                      ) {
                        Alert.alert(
                          'Stop!',
                          'Only Branch Manager can update this data',
                        );
                        return;
                      }
                      let get = allDataobj;
                      get.riskAssementTimelineone.value = value;
                      setAlldataobj({...get});
                    }}
                    text="1."
                  />
                  <CorrectiveActionPlans
                    value={allDataobj.riskAssementno2.value}
                    valuetwo={allDataobj.riskAssementTimelinetwo.value}
                    onChangeText={value => {
                      if (
                        getUserData.UserData.EmployeeTypeName !=
                        'Branch Manager'
                      ) {
                        Alert.alert(
                          'Stop!',
                          'Only Branch Manager can update this data',
                        );
                        return;
                      }
                      let get = allDataobj;
                      get.riskAssementno2.value = value;
                      setAlldataobj({...get});
                    }}
                    onChangeTexttwo={value => {
                      if (
                        getUserData.UserData.EmployeeTypeName !=
                        'Branch Manager'
                      ) {
                        Alert.alert(
                          'Stop!',
                          'Only Branch Manager can update this data',
                        );
                        return;
                      }
                      let get = allDataobj;
                      get.riskAssementTimelinetwo.value = value;
                      setAlldataobj({...get});
                    }}
                    text="2."
                  />
                  <CorrectiveActionPlans
                    value={allDataobj.riskAssementno3.value}
                    valuetwo={allDataobj.riskAssementTimelinethree.value}
                    onChangeText={value => {
                      if (
                        getUserData.UserData.EmployeeTypeName !=
                        'Branch Manager'
                      ) {
                        Alert.alert(
                          'Stop!',
                          'Only Branch Manager can update this data',
                        );
                        return;
                      }
                      let get = allDataobj;
                      get.riskAssementno3.value = value;
                      setAlldataobj({...get});
                    }}
                    onChangeTexttwo={value => {
                      if (
                        getUserData.UserData.EmployeeTypeName !=
                        'Branch Manager'
                      ) {
                        Alert.alert(
                          'Stop!',
                          'Only Branch Manager can update this data',
                        );
                        return;
                      }
                      let get = allDataobj;
                      get.riskAssementTimelinethree.value = value;
                      setAlldataobj({...get});
                    }}
                    text="3."
                  />

                  <View style={styles.row3}>
                    <TextView
                      style={{flex: 1, marginTop: 26}}
                      type={'normalRg'}
                      text={'Visited Borrower at'}></TextView>
                    <View style={{marginTop: 0}}>
                      <Dropdownlist
                        data={visitedBorrow}
                        required={true}
                        label={
                          allDataobj.visitedBorrower.value == ''
                            ? 'Select'
                            : allDataobj.visitedBorrower.value
                        }
                        onSelect={async value => {
                          if (
                            getUserData.UserData.EmployeeTypeName !=
                            'Branch Manager'
                          ) {
                            Alert.alert(
                              'Stop!',
                              'Only Branch Manager can update this data',
                            );
                            return;
                          }
                          let get = allDataobj;
                          get.visitedBorrower.value = visitedBorrow[value];
                          setAlldataobj({...get});
                        }}></Dropdownlist>
                    </View>
                  </View>
                  {/* /////////////////////////////////// */}

                  <View style={styles.row3}>
                    <TextView
                      style={{flex: 1, marginTop: 20}}
                      type={'normalRg'}
                      text={
                        'Conduct Borrower Social Appraisal from the following person(s) during physical verification'
                      }></TextView>
                  </View>
                  <View style={styles.line}>
                    <TextView
                      style={styles.nulltext}
                      type={'normalRg'}
                      text={''}></TextView>
                  </View>

                  <View style={[styles.row2, {marginTop: 20}]}>
                    <FormInputs
                      required={true}
                      error={allDataobj.borrowerName.error}
                      value={allDataobj.borrowerName.value}
                      onChangeText={(value: string) => {
                        if (
                          getUserData.UserData.EmployeeTypeName !=
                          'Branch Manager'
                        ) {
                          Alert.alert(
                            'Stop!',
                            'Only Branch Manager can update this data',
                          );
                          return;
                        }
                        let get = allDataobj;
                        get.borrowerName.value = value;
                        get.borrowerName.error = false;
                        setAlldataobj({...get});
                      }}
                      ref={el => (inputRef.current[3 + 'three'] = el)}
                      _onSubmit={() => focusNextField(4 + 'three')}
                      text={'Name'}></FormInputs>

                    <FormInputs
                      required={true}
                      error={allDataobj.borrowerAddress.error}
                      value={allDataobj.borrowerAddress.value}
                      onChangeText={(value: string) => {
                        if (
                          getUserData.UserData.EmployeeTypeName !=
                          'Branch Manager'
                        ) {
                          Alert.alert(
                            'Stop!',
                            'Only Branch Manager can update this data',
                          );
                          return;
                        }
                        let get = allDataobj;
                        get.borrowerAddress.value = value;
                        setAlldataobj({...get});
                      }}
                      ref={el => (inputRef.current[3 + 'three'] = el)}
                      _onSubmit={() => focusNextField(4 + 'three')}
                      text={'Address'}></FormInputs>
                  </View>

                  <View style={styles.row2}>
                    <FormInputs
                      required={true}
                      maxLength={11}
                      error={allDataobj.borrowerPhone.error}
                      value={allDataobj.borrowerPhone.value}
                      onChangeText={(value: string) => {
                        if (
                          getUserData.UserData.EmployeeTypeName !=
                          'Branch Manager'
                        ) {
                          Alert.alert(
                            'Stop!',
                            'Only Branch Manager can update this data',
                          );
                          return;
                        }
                        // let get = allDataobj;
                        // get.borrowerPhone.value = value;
                        // get.borrowerPhone.error = false;
                        // setAlldataobj({ ...get });
                        // let regexp = new RegExp('^[0-9+]{4}-[0-9+]{7}$');
                        // if (value.length == 4) {
                        //   let get = allDataobj;
                        //   get.borrowerPhone.value = value + '-';

                        //   get.borrowerPhone.error = !regexp.test(value) ? true : false
                        //   setAlldataobj({ ...get });
                        // } else {
                        let get = allDataobj;

                        get.borrowerPhone.value = value;
                        get.borrowerPhone.error = false;

                        // get.borrowerPhone.error = !regexp.test(value) ? true : false

                        setAlldataobj({...get});
                        // }
                      }}
                      keyboardtype={'number-pad'}
                      ref={el => (inputRef.current[3 + 'three'] = el)}
                      _onSubmit={() => focusNextField(4 + 'three')}
                      text={'Contact Number'}></FormInputs>
                    <View style={{marginTop: 3}}>
                      <TextView
                        type={'formLabel'}
                        text={'Remarks'}
                        style={{
                          color: '#737373',
                          marginLeft: 10,
                          width: width / 3,
                          marginBottom: -20,
                        }}></TextView>
                      <Dropdownlist
                        data={remarks}
                        required={true}
                        label={
                          allDataobj.borrowerStaification.value == ''
                            ? 'Select'
                            : allDataobj.borrowerStaification.value
                        }
                        onSelect={async value => {
                          if (
                            getUserData.UserData.EmployeeTypeName !=
                            'Branch Manager'
                          ) {
                            Alert.alert(
                              'Stop!',
                              'Only Branch Manager can update this data',
                            );
                            return;
                          }
                          let get = allDataobj;
                          get.borrowerStaification.value = remarks[value];
                          setAlldataobj({...get});
                        }}></Dropdownlist>
                    </View>
                  </View>

                  <View style={styles.row3}>
                    <TextView
                      style={{flex: 1, marginTop: 36}}
                      type={'normalRg'}
                      text={'Social Apprasial Place'}></TextView>
                    <View style={{marginTop: 0}}>
                      <Dropdownlist
                        data={visitedBorrow}
                        label={
                          allDataobj.socialAppraisal.value == ''
                            ? 'Select'
                            : allDataobj.socialAppraisal.value
                        }
                        onSelect={async value => {
                          if (
                            getUserData.UserData.EmployeeTypeName !=
                            'Branch Manager'
                          ) {
                            Alert.alert(
                              'Stop!',
                              'Only Branch Manager can update this data',
                            );
                            return;
                          }
                          let get = allDataobj;
                          get.socialAppraisal.value = visitedBorrow[value];
                          setAlldataobj({...get});
                        }}></Dropdownlist>
                    </View>
                  </View>
                  {/* /////////////////////////////////// */}
                </View>
              )}
            </View>
          )}

          {(getUserData.UserData.EmployeeTypeName == 'Branch Manager' ||
            getUserData.UserData.EmployeeTypeName ==
              'Verification Officer') && (
            <View style={[styles.box, {marginBottom: 0}]}>
              <Pressable onPressIn={_customerTab5} style={styles.buttomheader}>
                <TextView
                  type={'Light'}
                  text="Undertaking by Branch Manager"
                  style={{color: Colors.white}}></TextView>
                <Pressable onPressIn={_customerTab5}>
                  {activeTab == 5 ? (
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

              {activeTab == 5 && (
                <View style={styles.bounceview}>
                  <View style={styles.row3}>
                    <TextView
                      style={{flex: 1, marginTop: 20}}
                      type={'normalRg'}
                      text={
                        'All the provided information about the client is verified by during the appraisal conducted,the provided information is true and loan is recommended for further .'
                      }></TextView>
                  </View>
                  <View style={styles.line}>
                    <TextView
                      style={styles.nulltext}
                      type={'normalRg'}
                      text={''}></TextView>
                  </View>
                  <View style={styles.row2}>
                    <View style={{marginTop: 3}}>
                      <TextView
                        type={'formLabel'}
                        text={'Decision'}
                        style={{
                          color: '#737373',
                          marginLeft: 10,
                          width: width / 3,
                          marginBottom: -20,
                        }}></TextView>
                      <Dropdownlist
                        required={true}
                        data={desicion}
                        label={
                          allDataobj.borrowerApproval.value == ''
                            ? 'Select'
                            : allDataobj.borrowerApproval.value
                        }
                        onSelect={async value => {
                          if (
                            getUserData.UserData.EmployeeTypeName !=
                            'Branch Manager'
                          ) {
                            Alert.alert(
                              'Stop!',
                              'Only Branch Manager can update this data',
                            );
                            return;
                          }
                          let get = allDataobj;
                          get.borrowerApproval.value = desicion[value];
                          setAlldataobj({...get});
                        }}></Dropdownlist>
                    </View>
                    <FormInputs
                      required={true}
                      error={allDataobj.borrowerRemarks.error}
                      value={allDataobj.borrowerRemarks.value}
                      onChangeText={(value: string) => {
                        if (
                          getUserData.UserData.EmployeeTypeName !=
                          'Branch Manager'
                        ) {
                          Alert.alert(
                            'Stop!',
                            'Only Branch Manager can update this data',
                          );
                          return;
                        }
                        let get = allDataobj;
                        get.borrowerRemarks.value = value;
                        get.borrowerRemarks.error = false;
                        setAlldataobj({...get});
                      }}
                      text={'Reson/Remarks'}></FormInputs>
                  </View>
                </View>
              )}
            </View>
          )}
          {/* /////////////////////////////////// */}
          {getUserData.UserData.EmployeeTypeName == 'Verification Officer' && (
            <View style={[styles.box, {marginBottom: 20}]}>
              <Pressable onPressIn={_customerTab6} style={styles.buttomheader}>
                <TextView
                  type={'Light'}
                  text="Undertaking by Loan Verification Officer"
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
                  <View style={styles.row2}>
                    <FormInputs
                      ref={el => (inputRef.current[3 + 'three'] = el)}
                      _onSubmit={() => focusNextField(4 + 'three')}
                      text={'Loan Verification Name'}
                      error={allDataobj?.verificationofficerName?.error}
                      value={
                        allDataobj?.verificationofficerName?.value == ''
                          ? getUserData.UserData.EmployeeTypeName ==
                              'Verification Officer' &&
                            getUserData.UserData.FirstName +
                              ' ' +
                              getUserData.UserData.LastName
                          : allDataobj?.verificationofficerName?.value
                      }
                      onChangeText={(value: string) => {
                        console.log(value);
                        let get = allDataobj;
                        get.verificationofficerName = {
                          value: value == '' ? null : value,
                          error: false,
                        };
                        setAlldataobj({...get});
                      }}></FormInputs>

                    <View style={{marginTop: 0}}>
                      <TextView
                        type={'formLabel'}
                        text={'Verified By Designation'}
                        style={{
                          color: '#737373',
                          marginLeft: 10,
                          width: width / 3,
                          marginBottom: -20,
                        }}></TextView>
                      <Dropdownlist
                        data={Officers}
                        label={
                          allDataobj?.verificationByDesignation?.value == ''
                            ? 'Verification Officer'
                            : allDataobj?.verificationByDesignation?.value
                        }
                        onSelect={async value => {
                          let get = allDataobj;
                          get.verificationByDesignation = {
                            value: Officers[value],
                          };
                          setAlldataobj({...get});
                        }}></Dropdownlist>
                    </View>
                  </View>

                  <View style={styles.row2}>
                    <FormInputs
                      required={true}
                      ref={el => (inputRef.current[3 + 'three'] = el)}
                      _onSubmit={() => focusNextField(4 + 'three')}
                      text={'Comments of Verification Officer'}
                      error={allDataobj?.verificationComments?.error}
                      value={allDataobj?.verificationComments?.value}
                      onChangeText={(value: string) => {
                        let get = allDataobj;
                        get.verificationComments = {
                          value: value == '' ? null : value,
                          error: false,
                        };
                        setAlldataobj({...get});
                      }}></FormInputs>

                    <View style={{marginTop: 0}}>
                      <TextView
                        type={'formLabel'}
                        text={'Visit Type'}
                        style={{
                          color: '#737373',
                          marginLeft: 10,
                          width: width / 3,
                          marginBottom: -20,
                        }}></TextView>
                      <Dropdownlist
                        data={visitTypeArray}
                        label={
                          allDataobj?.visitType?.value == ''
                            ? 'Non-Physical'
                            : allDataobj?.visitType?.value
                        }
                        onSelect={async value => {
                          let get = allDataobj;
                          get.visitType = {value: visitTypeArray[value]};
                          setAlldataobj({...get});
                        }}></Dropdownlist>
                    </View>
                  </View>

                  <View style={styles.bounceview}>
                    <View
                      style={{
                        marginTop: 0,
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}>
                      <View
                        style={{
                          height: 200,
                          width: width / 2.5,
                          justifyContent: 'center',
                        }}>
                        <TextView
                          style={{alignSelf: 'center'}}
                          type={'small'}
                          text="Comment Image"></TextView>
                        {allDataobj?.groupImagebyVerificationOff ==
                        undefined ? (
                          <MaterialCommunityIcons
                            style={{alignSelf: 'center'}}
                            name="google-photos"
                            size={56}></MaterialCommunityIcons>
                        ) : (
                          <ZoomableImage
                            images={`data:image/gif;base64,${allDataobj?.groupImagebyVerificationOff}`}
                          />
                        )}

                        <View
                          style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            marginTop: 20,
                            justifyContent: 'space-around',
                          }}>
                          {/* <Pressable
                            onPressIn={pickImges}
                            style={{
                              height: 30,
                              width: width / 6,
                              borderRadius: 30,
                              backgroundColor: Colors.backgroundColor,
                              justifyContent: 'center',
                            }}>
                            <TextView
                              style={{textAlign: 'center'}}
                              type={'small'}
                              text="Gallery"></TextView>
                          </Pressable> */}
                          <Pressable
                            onPressIn={capture}
                            style={{
                              height: 30,
                              width: width / 6,
                              borderRadius: 30,
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
                </View>
              )}
            </View>
          )}

          <View style={[styles.row2, {marginRight: 10}]}>
            <View></View>
            <TouchableOpacity activeOpacity={0.7} onPressIn={handleSaveGroup}>
              <View style={styles.row2}>
                <TextView
                  type={'heading_20'}
                  style={{color: Colors.parrotGreenColor, marginTop: 3}}
                  text={
                    updateCheck.value ? 'UPDATE' : 'Assign Leader & SAVE'
                  }></TextView>
                <Ionicons
                  name="ios-caret-forward"
                  style={{color: Colors.parrotGreenColor}}
                  size={26}></Ionicons>
              </View>
            </TouchableOpacity>
          </View>
        </View>
        {/* </KeyboardAvoidingView> */}
      </ScrollView>
      {/* //-------------------------------------MODAL */}
      <Modalize
        onClosed={() => {
          SetModalizer(false);
        }}
        ref={modalizeRef}>
        <View style={{padding: 20}}>
          <Search
            filtershow={false}
            Theme={Colors}
            text={'Search Members..'}></Search>
          {loading && (
            <ActivityIndicator
              style={{marginTop: 20}}
              color={Colors.parrotGreenColor}
            />
          )}
          {noData && (
            <TextView
              style={{
                alignSelf: 'center',
                marginTop: 20,
                fontSize: 16,
                color: '#7d7d7d',
              }}
              text={'No user available'}></TextView>
          )}
          <View style={{marginTop: 20}}>
            {getForms.length > 0 &&
              getForms.map((item, index) => {
                var check = checkingMembers(item);
                return (
                  !check && (
                    <CheckboxCustomer
                      item={item}
                      onPresscheckBox={() =>
                        _onPressCheckBox(item, index)
                      }></CheckboxCustomer>
                  )
                );
              })}
            {/*          
            <CustomButton
              onPress={() => {
                // if (membersTemp.length < 3) {
                //   alert("Please Select at least 3 members")
                // } else if (membersTemp.length < 3) {
                //   alert("You can not select more than 7 Members")
                // } else {
                  setMembers([...membersTemp])
                  modalizeRef.current.close()
                // }
              }}
              style={{ height: 60, width: '80%', margin: 20, borderRadius: 10, alignSelf: 'center', justifyContent: 'center' }}
              textStyle={{ textAlign: 'center' }}
              text={'Add Members'}></CustomButton>
          */}
          </View>
        </View>
      </Modalize>
      <CustomProgressDialoge
        dialogVisible={progress}
        setDialogVisible={setProgresss}
        title={title}
      />
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

export default connect(null, mapDispatchToProps)(memo(AddGroup));
const styles = StyleSheet.create({
  safeview: {flex: 1},
  nulltext: {flex: 1, marginTop: 20},
  line: {height: 1, backgroundColor: '#cdcdcd', marginTop: 10},
  row2: {
    marginTop: 0,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  row3: {marginTop: 0, flexDirection: 'row', justifyContent: 'space-between'},
  text: {},
  bounceview: {marginTop: 20, marginBottom: 10, padding: 10},
  buttomheader: GlobalStyles.buttomheader,
  box: {
    width: '90%',
    borderRadius: 8,
    backgroundColor: '#f1f1f1',
    alignSelf: 'center',
    marginTop: 10,
  },
});
