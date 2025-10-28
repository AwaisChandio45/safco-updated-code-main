import React, {useRef, useEffect} from 'react';
import {
  SafeAreaView,
  ScrollView,
  KeyboardAvoidingView,
  StyleSheet,
  Dimensions,
  Pressable,
  Alert,
  Image,
  PermissionsAndroid,
  TextInput,
  View,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import RNAndroidLocationEnabler from 'react-native-android-location-enabler';
import {getCurrentLocation} from '../../utilis/Locationgetter';

import {Card} from 'react-native-paper';
import {
  AppStatusBar,
  CustomProgressDialoge,
  HeaderwithoutDialoge,
  Nodata,
  Search,
} from '../../components';
const {height, width} = Dimensions.get('window');
import EvilIcons from 'react-native-vector-icons/EvilIcons';
import Feather from 'react-native-vector-icons/Feather';
import {connect, useSelector} from 'react-redux';
import {Colors, GlobalStyles} from '../../theme';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import ImagePicker from 'react-native-image-crop-picker';
import {Checkbox} from 'react-native-paper';
import Toast from '../../components/Toast';
import Geolocation from '@react-native-community/geolocation';

import {
  DateSelector,
  FormInputs,
  VerificationIndicator,
  TextView,
  MyChipcomponent,
  CorrectiveActionPlans,
  Dropdownlist,
} from '../../components';
import {Chip} from 'react-native-paper';
import {
  VisitedList,
  Remarks,
  Decision,
  Officers,
} from '../../utilis/RequiredArrays';
import RNFS from 'react-native-fs';
import {UpdateCustomerFormsforComments} from '../../sqlite/sqlitedb';
import {useDispatch} from 'react-redux';
import ZoomableImage from '../../components/ZoomableImage';

const Comments: () => Node = props => {
  const inputRef = useRef([]);
  const array_index = 0;
  const dispatch = useDispatch();
  const getUserData = useSelector(state => state.UserData);
  const [visitTypeArray, setVisitType] = React.useState([
    'Physical Visit',
    'Non-Physical Visit',
  ]);
  const [visitedBorrow, setVisitedBorrow] = React.useState(VisitedList);
  const [remarks, setRemarks] = React.useState(Remarks);
  const [desicion, setDecision] = React.useState(Decision);
  const [members, setMembers] = React.useState([]);
  const [getImage, setImage] = React.useState('');
  const [progress, setProgresss] = React.useState(false);
  const [title, setTitle] = React.useState('');
  const CustomGetDataModule = useSelector(
    state => state.CommentsReducer.commentsArray,
  );
  var regex = /^[a-zA-Z ]*$/;
  let speacial = /[^a-zA-Z0-9-]/g;
  var numericandAlphabets = new RegExp(/^[a-zA-Z0-9 ]+$/);

  const [allDataobj, setAlldataobj] = React.useState(CustomGetDataModule);
  const [activeTab, setActiveTab] = React.useState(1);
  const [checked, setChecked] = React.useState(false);
  const [id, setId] = React.useState('');
  const [userLocation, setUserCustomerLocation] = React.useState(undefined);

  const [toast, setToast] = React.useState({value: '', type: ''});
  useEffect(() => {
    let {item, id} = props.route.params;
    if (item) {
      setAlldataobj(item);
      setValues(item);
    } else {
      setAlldataobj(CustomGetDataModule);
    }
    // alert(JSON.stringify(CustomGetDataModule?.visitType?.value))
    // let get = allDataobj;
    // get.addedBy.value = getUserData.UserData.FirstName + ' ' + getUserData.UserData.LastName;
    // get.addedBy.error = false;
    // setAlldataobj({ ...get });
    setId(id);
    // setValues()
  }, []);

  const setValues = item => {
    if (getUserData.UserData.EmployeeTypeName == 'Verification Officer') {
      let get = item;
      get['verificationofficerName'] = {
        value:
          getUserData.UserData.FirstName + ' ' + getUserData.UserData.LastName,
        error: false,
      };
      get['verificationByDesignation'] = {
        value: getUserData.UserData.EmployeeTypeName,
      };
      // get["visitType"]={value :'Non-Physical Visit'};

      setAlldataobj({...get});
    }
  };
  // ******************************* LOCATION CODE ***************************************** */

  const handleLocation = () => {
    if (
      allDataobj.user_location == undefined &&
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
          handleSave();
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
            console.log('update loc');
          }
          handleSave();
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
      handleSave();
      return;
    }
  };
  // ******************************* LOCATION CODE ***************************************** */

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
      ////console.log('error=>', e);
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
        var data = await RNFS.readFile(image.path, 'base64').then(res => {
          return res;
        });

        let get = allDataobj;
        if (getUserData.UserData.EmployeeTypeName == 'Verification Officer') {
          get.groupImagebyVerificationOff = data;
        } else {
          get.groupImage = data;
        }
        setAlldataobj({...get});
        setImage(image.path);
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
      var data = await RNFS.readFile(image.path, 'base64').then(res => {
        return res;
      });
      let get = allDataobj;
      get.groupImage = data;
      setAlldataobj({...get});
      setImage(image.path);
    });
  };

  const pickImges = () => {
    takePhotofromGallery();
  };
  const capture = () => {
    takePhoto();
  };
  const handleSaveGroup = () => {
    if (allDataobj.commentOfAddedby.value == '') {
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
      setToast({
        type: 'error',
        message: 'Please insert Group Image!',
      });
      return;
    } else if (getUserData.UserData.EmployeeTypeName == 'Branch Manager') {
      loadMore();
    } else if (
      getUserData.UserData.EmployeeTypeName == 'Verification Officer'
    ) {
      loadMore();
    } else {
      handleSave();
    }
  };
  const loadMore = () => {
    if (allDataobj.commentsofVerifiedby.value == '') {
      setActiveTab(3);
      let get = allDataobj;
      get.commentsofVerifiedby.error = true;
      setToast({
        type: 'error',
        message: 'Please insert comments first!',
      });
      setAlldataobj({...get});
      return;
    } else if (allDataobj.visitedBorrower.value == '') {
      setActiveTab(4);
      let get = allDataobj;
      get.visitedBorrower.error = true;
      setToast({
        type: 'error',
        message: 'Please Select Visited Borrow!',
      });
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
      setToast({
        type: 'error',
        message: 'Please insert valid Phone Number!',
      });
      setAlldataobj({...get});
      return;
    } else if (allDataobj.borrowerStaification.value == '') {
      setActiveTab(4);
      setToast({
        type: 'error',
        message: 'Please Select Remarks!',
      });
      return;
    } else if (allDataobj.socialAppraisal.value == '') {
      setActiveTab(4);
      setToast({
        type: 'error',
        message: 'Please Select Social Apprasial!',
      });
      return;
    } else if (allDataobj.borrowerApproval.value == '') {
      setActiveTab(5);
      setToast({
        type: 'error',
        message: 'Please Select Decision!',
      });
      return;
    } else if (allDataobj.borrowerRemarks.value == '') {
      setActiveTab(5);
      let get = allDataobj;
      get.borrowerRemarks.error = true;
      setAlldataobj({...get});
      return;
    } else if (
      getUserData.UserData.EmployeeTypeName == 'Branch Manager' &&
      !checked
    ) {
      setToast({
        type: 'error',
        message: 'Please agree terms of MFO undertaking!',
      });
      return;
    } else if (
      getUserData.UserData.EmployeeTypeName == 'Verification Officer' &&
      allDataobj?.verificationofficerName?.value == ''
    ) {
      setToast({
        type: 'error',
        message: 'Please enter Verification Officer Name!',
      });
      return;
    } else if (
      getUserData.UserData.EmployeeTypeName == 'Verification Officer' &&
      allDataobj?.verificationComments?.value == null
    ) {
      setToast({
        type: 'error',
        message: 'Please enter Verification Officer Comments!',
      });
      return;
    } else if (
      allDataobj?.visitType?.value == 'Physical Visit' &&
      allDataobj?.groupImagebyVerificationOff == undefined
    ) {
      setToast({
        type: 'error',
        message: 'Please take a picture of customer!',
      });
      return;
    } else {
      handleLocation();
    }
  };

  const handleSave = () => {
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
    UpdateCustomerFormsforComments(JSON.stringify(allDataobj), id)
      .then(values => {
        setToast({
          type: 'success',
          message: 'Successfully Saved',
        });
        // ======================= RESET ALL VALUES =====================
        dispatch({
          type: 'COMMENTARRAY',
          payload: {
            // groupStatus:{value: 'Processed', error: false},
            // groupNote:{value: '', error: false},
            ///////////////////////////comment
            addedBy: {value: '', error: false},
            addedById: {value: ''},
            addedByDesignation: {value: 'Field Officer', error: false},
            commentOfAddedby: {value: '', error: false},
            verifiedBy: {value: '', error: false},
            verifiedByDesignation: {value: 'Field Officer', error: false},
            commentsofVerifiedby: {value: '', error: false},
            bmId: {value: ''},
            groupImage: undefined,
            //-------------------------------Verify Indicator
            counductPhysicalVisit: {value: '1', error: false},
            verifiedreApparisal: {value: '1', error: false},
            verifiedRepaymentHistory: {value: '1', error: false},
            criticalAssetsValuation: {value: '1', error: false},
            verifiedbyContactNumber: {value: '1', error: false},
            meetwithSocialResponsible: {value: '1', error: false},
            meetwithPersonalGuarantee: {value: '1', error: false},
            verifiedProvidedDoc: {value: '1', error: false},
            borrowerCashFlow: {value: 1, error: false},
            supportingCnicForFemale: {value: 1, error: false},
            borrowerRepaymentCapacity: {value: 1, error: false},
            borrowerBusinessORHome: {value: 1, error: false},
            repaymentCapacityAnalysis: {value: 1, error: false},
            isTheLoanPricingIsClearlyDisclosed: {value: 1, error: false},
            isTheBorrowerInformedAboutTheGrievance: {value: 1, error: false},
            isTheBorrowerAwareAboutTheCollateral: {value: 1, error: false},
            anyMajorRisksInvolvedInBusiness: {
              value: 1,
              error: false,
              detail: null,
            },
            //----------------------------Compailance
            amlPolicyandProcedure: {value: '1', error: false},
            socialandManagmentPolicy: {value: '1', error: false},
            verifiedCIBPolicy: {value: '1', error: false},
            doesBorrowerEnivro: {value: '1', error: false},
            doesEnterprise: {value: '1', error: false},
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
            verificationOffId: {value: ''},
          },
        });

        // ======================= RESET ALL VALUES =====================
        props.navigation.goBack();
      })
      .catch(error => {
        setToast({
          type: 'error',
          message: '' + error,
        });
      });
  };
  return (
    <SafeAreaView style={styles.safeview}>
      <AppStatusBar></AppStatusBar>
      <View style={GlobalStyles.row}>
        <HeaderwithoutDialoge
          Theme={Colors}
          back={true}
          screenNo={2}></HeaderwithoutDialoge>

        <TextView
          type={'mini_heading22'}
          style={{paddingHorizontal: 30, marginTop: 55}}
          text="Comments"></TextView>
      </View>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={{marginTop: 30}}>
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
                    error={allDataobj?.addedBy.error}
                    value={
                      allDataobj?.addedBy.value == ''
                        ? (getUserData.UserData.EmployeeTypeName !=
                            'Branch Manager' ||
                            getUserData.UserData.EmployeeTypeName !=
                              'Verification Officer') &&
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
                        setToast({
                          type: 'error',
                          message: 'Only Loan Officer can update this data',
                        });
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
                          setToast({
                            type: 'error',
                            message: 'Only Loan Officer can update this data',
                          });
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
                        setToast({
                          type: 'error',
                          message: 'Only Loan Officer can update this data',
                        });
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
                            setToast({
                              type: 'error',
                              message: 'Only BM can update this data',
                            });
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
                              ? 'Branch Manager'
                              : allDataobj.verifiedByDesignation.value
                          }
                          onSelect={async value => {
                            if (
                              getUserData.UserData.EmployeeTypeName !=
                              'Branch Manager'
                            ) {
                              setToast({
                                type: 'error',
                                message: 'Only BM can update this data',
                              });
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
                            setToast({
                              type: 'error',
                              message: 'Only BM can update this data',
                            });
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
                            text="Comment Image"></TextView>
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
                        setToast({
                          type: 'error',
                          message: 'Only BM can update this data',
                        });
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
                        setToast({
                          type: 'error',
                          message: 'Only BM can update this data',
                        });
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
                        setToast({
                          type: 'error',
                          message: 'Only BM can update this data',
                        });
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
                        setToast({
                          type: 'error',
                          message: 'Only BM can update this data',
                        });
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
                        setToast({
                          type: 'error',
                          message: 'Only BM can update this data',
                        });
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
                        setToast({
                          type: 'error',
                          message: 'Only BM can update this data',
                        });
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
                        setToast({
                          type: 'error',
                          message: 'Only BM can update this data',
                        });
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
                        setToast({
                          type: 'error',
                          message: 'Only BM can update this data',
                        });
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
                        setToast({
                          type: 'error',
                          message: 'Only BM can update this data',
                        });
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
                        setToast({
                          type: 'error',
                          message: 'Only BM can update this data',
                        });
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
                        setToast({
                          type: 'error',
                          message: 'Only BM can update this data',
                        });
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
                        setToast({
                          type: 'error',
                          message: 'Only BM can update this data',
                        });
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
                        setToast({
                          type: 'error',
                          message: 'Only BM can update this data',
                        });
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
                        setToast({
                          type: 'error',
                          message: 'Only BM can update this data',
                        });
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
                        setToast({
                          type: 'error',
                          message: 'Only BM can update this data',
                        });
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
                        setToast({
                          type: 'error',
                          message: 'Only BM can update this data',
                        });
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
                        setToast({
                          type: 'error',
                          message: 'Only BM can update this data',
                        });
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
                        setToast({
                          type: 'error',
                          message: 'Only BM can update this data',
                        });
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
                            setToast({
                              type: 'error',
                              message: 'Only BM can update this data',
                            });
                            return;
                          }
                          let get = allDataobj;
                          get.visitedBorrower.value = visitedBorrow[value];
                          get.visitedBorrower.index = value;
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
                          setToast({
                            type: 'error',
                            message: 'Only BM can update this data',
                          });
                          return;
                        }
                        if (!regex.test(value)) {
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
                          setToast({
                            type: 'error',
                            message: 'Only BM can update this data',
                          });
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
                      error={allDataobj.borrowerPhone.error}
                      value={allDataobj.borrowerPhone.value}
                      onChangeText={(value: string) => {
                        if (
                          getUserData.UserData.EmployeeTypeName !=
                          'Branch Manager'
                        ) {
                          setToast({
                            type: 'error',
                            message: 'Only BM can update this data',
                          });
                          return;
                        }
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
                      maxLength={11}
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
                            ? 'Select Remarks'
                            : allDataobj.borrowerStaification.value
                        }
                        onSelect={async value => {
                          if (
                            getUserData.UserData.EmployeeTypeName !=
                            'Branch Manager'
                          ) {
                            setToast({
                              type: 'error',
                              message: 'Only BM can update this data',
                            });
                            return;
                          }
                          let get = allDataobj;
                          get.borrowerStaification.value = remarks[value];
                          get.borrowerStaification.index = value;
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
                            setToast({
                              type: 'error',
                              message: 'Only BM can update this data',
                            });
                            return;
                          }
                          let get = allDataobj;
                          get.socialAppraisal.value = visitedBorrow[value];
                          get.socialAppraisal.index = value;
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
                            setToast({
                              type: 'error',
                              message: 'Only BM can update this data',
                            });
                            return;
                          }
                          let get = allDataobj;
                          get.borrowerApproval.value = desicion[value];
                          get.borrowerApproval.index = value;
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
                          setToast({
                            type: 'error',
                            message: 'Only BM can update this data',
                          });
                          return;
                        }
                        let get = allDataobj;
                        get.borrowerRemarks.value = value;
                        get.borrowerRemarks.error = false;
                        setAlldataobj({...get});
                      }}
                      text={'Reson/Remarks'}></FormInputs>
                  </View>
                  <View style={{flexDirection: 'row'}}>
                    <Checkbox
                      status={checked ? 'checked' : 'unchecked'}
                      onPress={() => {
                        setChecked(!checked);
                      }}
                      color={Colors.darkGreenColor}
                    />
                    <View
                      style={{
                        flexDirection: 'column',
                        justifyContent: 'center',
                      }}>
                      <TextView
                        type={'formLabel'}
                        text={'Agreed To Above terms MFO Undertaking'}
                      />
                    </View>
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
                      error={
                        'verificationofficerName' in allDataobj &&
                        allDataobj?.verificationofficerName?.error
                      }
                      value={
                        'verificationofficerName' in allDataobj &&
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
            <Pressable onPressIn={handleSaveGroup}>
              <View style={styles.row2}>
                <TextView
                  type={'heading_20'}
                  style={{color: Colors.parrotGreenColor, marginTop: 3}}
                  text="SAVED"></TextView>
                <Ionicons
                  name="ios-caret-forward"
                  style={{color: Colors.parrotGreenColor}}
                  size={26}></Ionicons>
              </View>
            </Pressable>
          </View>
        </View>
      </ScrollView>
      {/* <Toast {...toast} onDismiss={() => setToast({ message: toast.message, type: toast.error })} /> */}
      <Toast {...toast} onDismiss={() => setToast({message: '', type: ''})} />
      <CustomProgressDialoge
        dialogVisible={progress}
        setDialogVisible={setProgresss}
        title={title}
      />
    </SafeAreaView>
  );
};
const styles = StyleSheet.create({
  safeview: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  nulltext: {flex: 1, marginTop: 20},
  line: {height: 1, backgroundColor: '#cdcdcd', marginTop: 10},
  row2: {
    marginTop: 0,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  row3: {
    marginTop: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
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
export default Comments;
