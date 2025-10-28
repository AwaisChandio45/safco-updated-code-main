import React, {useState, memo, useRef} from 'react';
import {connect, useSelector} from 'react-redux';
import {
  View,
  StyleSheet,
  Text,
  Image,
  TouchableOpacity,
  Dimensions,
  ScrollView,
  Pressable,
  FlatList,
} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {SwipeListView, SwipeRow} from 'react-native-swipe-list-view';
import TextView from './TextView';
import QuestionView from './QuestionView';
import ZoomableImage2 from './ZoomableImage2';
import ZoomableImage from './ZoomableImage';
import {Checkbox} from 'react-native-paper';
import {Colors, GlobalStyles} from '../theme';
import Fontisto from 'react-native-vector-icons/Fontisto';
import ImageComponent from './ImageComponent';
var {height, width} = Dimensions.get('window');

const NameAndTitle = ({style, title, title2, value, value2}) => {
  return (
    <View style={[styles.row, style]}>
      <TextView style={styles.text2} text={title}></TextView>
      <TextView style={styles.text6} text={title2}></TextView>
      <TextView style={styles.text3} text={value}></TextView>
      <TextView style={styles.text7} text={value2}></TextView>
    </View>
  );
};

const CustomeerViews = ({customertDetails}) => {
  const [customerReport, setCustomerReport] = React.useState(customertDetails);
  const [activeTab, setActiveTab] = React.useState(1);
  const GETQuestions = useSelector(
    state => state.QuestionsReducer.questionArray,
  );
  const [questionArray, setQuestionArray] = React.useState(GETQuestions);
  const Data = customerReport != undefined ? customerReport.assestsInfo : [];
  const DataArray =
    customerReport != undefined ? customerReport.familyMemberInfo : [];
  const DataguarantorArray =
    customerReport != undefined ? customerReport.guarantorInfo : [];

    const getUserData = useSelector(state => state.UserData);
    const OrganizationType = Number(getUserData?.UserData?.OrganizationType);
    const loanLabel = OrganizationType === 2 ? 'Finance Facility' : 'Loan';

  //     const UpdateReducer = useSelector(state => state.UpdateReducer);
  //     var updateCheck = UpdateReducer.updateCheck.value;
  //   const [allDataobj, setAlldataobj] = React.useState(
  //     updateCheck ? props.item : updateCheckTemp ? props.item : CustomGetDataModule,
  //   );
  // console.log("Documents images------->",customerReport)

  const renderDocsItems = (item, indexx) => {
    console.log('Itemmm====>', item.imgName);
    return (
      <View
        style={{
          width:
            customerReport.loanInfo[0].loan_customerImage.length <= 1
              ? width / 1.2
              : width / 2.3,
        }}>
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
              width: width / 2.2,
              justifyContent: 'center',
            }}>
            {item.imgValue == undefined ? (
              <MaterialCommunityIcons
                style={{alignSelf: 'center'}}
                name="google-photos"
                size={56}></MaterialCommunityIcons>
            ) : (
              <ImageComponent
                imgValue={item.imgValue}
                error={
                  customerReport?.loanInfo[0]?.loan_customerImage[indexx]
                    .imgName.error
                }
                value={
                  customerReport?.loanInfo[0]?.loan_customerImage[indexx]
                    .imgName.value
                }
              />
            )}
          </View>
        </View>
      </View>
    );
  };
  const renderAssetsItem = (item, index) => {
    return (
      <View
        style={[styles.box, {marginBottom: index == Data.length - 1 ? 10 : 0}]}>
        <View style={[styles.row2]}>
          <NameAndTitle
            style={{flex: 1}}
            title={'Asset Name:'}
            value={
              item.item.assetName == undefined ? '' : item.item.assetName.value
            }></NameAndTitle>

          <NameAndTitle
            title={'Asset Quantity:'}
            value={
              item.item.assetQuantity == undefined
                ? ''
                : item.item.assetQuantity.value
            }></NameAndTitle>
        </View>
        <View style={[styles.row2]}>
          <NameAndTitle
            style={{flex: 1}}
            title={'Asset Value:'}
            value={
              item.item.assetValue == undefined
                ? ''
                : item.item.assetValue.value
            }></NameAndTitle>

          <NameAndTitle
            title={'Asset Owner:'}
            value={
              item.item.assetOwner == undefined
                ? ''
                : item.item.assetOwner.value
            }></NameAndTitle>
        </View>
        <View style={[styles.row2]}>
          <NameAndTitle
            style={{flex: 1}}
            title={'Notes:'}
            value={
              item.item.assetNote == undefined ? '' : item.item.assetNote.value
            }></NameAndTitle>
        </View>
      </View>
    );
  };
  const renderGuaranteerItem = (item, index) => {
    return (
      <View
        style={[
          styles.box,
          {marginBottom: index == DataguarantorArray.length - 1 ? 10 : 0},
        ]}>
        <View style={[styles.row2]}>
          <NameAndTitle
            title={'Name:'}
            value={
              item.item.guarantor_fullname == undefined
                ? ''
                : item.item.guarantor_fullname.value
            }></NameAndTitle>

          <NameAndTitle
            title={'CNIC:'}
            value={
              item.item.guarantor_cnic == undefined
                ? ''
                : item.item.guarantor_cnic.value
            }></NameAndTitle>
        </View>
        <View style={[styles.row2]}>
          <NameAndTitle
            title={'Address:'}
            value={
              item.item.guarantor_address == undefined
                ? ''
                : item.item.guarantor_address.value
            }></NameAndTitle>

          <NameAndTitle
            style={{right: 25}}
            title={'Contact NO:'}
            value={
              item.item.guarantor_contactno == undefined
                ? ''
                : item.item.guarantor_contactno.value
            }></NameAndTitle>
        </View>
        <View style={[styles.row2]}>
          <NameAndTitle
            title={'Job Des:'}
            value={
              item.item.guarantor_jobDescription == undefined
                ? ''
                : item.item.guarantor_jobDescription.value
            }></NameAndTitle>
          <NameAndTitle
            title={'Business Address:'}
            value={
              item.item.guarantor_businessAddress == undefined
                ? ''
                : item.item.guarantor_businessAddress.value
            }></NameAndTitle>
        </View>
        <View style={[styles.row2]}>
          <NameAndTitle
            title={'Job Type:'}
            value={
              item.item.guarantor_jobType == undefined
                ? ''
                : item.item.guarantor_jobType.value
            }></NameAndTitle>
          <NameAndTitle
            title={'Notes:'}
            value={
              item.item.guarantor_businessNote == undefined
                ? ''
                : item.item.guarantor_businessNote.value
            }></NameAndTitle>
        </View>
      </View>
    );
  };
  const renderfamilyMemberItem = (item, index) => {
    console.log('heree====lol>', item);
    return (
      <View
        style={[
          styles.box,
          {marginBottom: index == DataArray.length - 1 ? 10 : 0},
        ]}>
        <View style={[styles.row2]}>
          <NameAndTitle
            style={{flex: 0}}
            title={'Name:'}
            value={
              item.item.familyMember_fullname == undefined
                ? ''
                : item.item.familyMember_fullname.value
            }></NameAndTitle>

          <NameAndTitle
            title={'CNIC:'}
            value={
              item.item.familyMember_cnic == undefined
                ? ''
                : item.item.familyMember_cnic.value
            }></NameAndTitle>
        </View>
        <View style={[styles.row2]}>
          <NameAndTitle
            style={{flex: 1}}
            title={'Relation:'}
            value={
              item.item.familyMember_relation == undefined
                ? ''
                : item.item.familyMember_relation.value
            }></NameAndTitle>

          <NameAndTitle
            title={'Age:'}
            value={
              item.item.familyMember_age == undefined
                ? ''
                : item.item.familyMember_age.value
            }></NameAndTitle>
        </View>
        <View style={[styles.row2]}>
          <NameAndTitle
            style={{flex: 0}}
            title={'Education:'}
            value={
              item.item.familyMember_education == undefined
                ? ''
                : item.item.familyMember_education.value
            }></NameAndTitle>
          <NameAndTitle
            style={{flex: 0}}
            title={'Monthly Earning:'}
            value={
              item.item.familyMember_montlyEarning == undefined
                ? ''
                : item.item.familyMember_montlyEarning.value
            }></NameAndTitle>
        </View>
        <View style={[styles.row2]}>
          <NameAndTitle
            style={{flex: 1}}
            title={'SOI:'}
            value={
              item.item.familyMember_sourceIncome == undefined
                ? ''
                : item.item.familyMember_sourceIncome.value
            }></NameAndTitle>
          <NameAndTitle
            style={{flex: 0}}
            title={'Business Address:'}
            value={
              item.item.familyMember_businessAddress == undefined
                ? ''
                : item.item.familyMember_businessAddress.value
            }></NameAndTitle>
        </View>
        <View style={[styles.row2]}>
          <NameAndTitle
            style={{flex: 1}}
            title={'Gender:'}
            value={
              item.item.familyMember_genderSelection == undefined
                ? ''
                : item.item.familyMember_genderSelection
            }></NameAndTitle>
        </View>
      </View>
    );
  };

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
  const _customerTab11 = () => {
    if (activeTab == 11) {
      setActiveTab(0);
    } else {
      setActiveTab(11);
    }
  };
  const _customerTab12 = () => {
    if (activeTab == 12) {
      setActiveTab(0);
    } else {
      setActiveTab(12);
    }
  };
  const _customerTab13 = () => {
    if (activeTab == 13) {
      setActiveTab(0);
    } else {
      setActiveTab(13);
    }
  };
  const _customerTab14 = () => {
    if (activeTab == 14) {
      setActiveTab(0);
    } else {
      setActiveTab(14);
    }
  };
  const _customerTab15 = () => {
    if (activeTab == 15) {
      setActiveTab(0);
    } else {
      setActiveTab(15);
    }
  };
  const _customerTab16 = () => {
    if (activeTab == 16) {
      setActiveTab(0);
    } else {
      setActiveTab(16);
    }
  };

  // console.log("Riskkkk========>",riskValue)

  return (
    <ScrollView showsHorizontalScrollIndicator={false} horizontal={false}>
      <View style={styles.main}>
        <View style={styles.row}>
          <View
            style={{
              width: 50,
              height: 50,
              borderRadius: 50,
              borderColor: '#cdcdcd',
              borderWidth: 1,
              justifyContent: 'center',
            }}>
            <Fontisto
              name="person"
              color={Colors.parrotGreenColor}
              size={20}
              style={{alignSelf: 'center'}}
            />
          </View>
          <TextView
            style={[styles.text1, {flex: 1}]}
            text={'Customer Form'}></TextView>

          <View>
            {customerReport?.customerInfo[0]?.customer_img == undefined ? (
              <MaterialCommunityIcons
                style={{alignSelf: 'center'}}
                name="google-photos"
                size={56}></MaterialCommunityIcons>
            ) : (
              <ZoomableImage2
                images={`data:image/gif;base64,${customerReport?.customerInfo[0]?.customer_img}`}
              />
            )}
          </View>
        </View>
        <View style={{padding: 5}}>
          <TouchableOpacity
            onPressIn={_customerTab}
            style={[styles.reportheader]}>
            <TextView
              type={'Light'}
              text="Customer Information"
              style={{color: Colors.white}}></TextView>
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
            <View style={{padding: 5}}>
              {/* <TextView style={styles.mainHeading} text={"Customer Information"} /> */}
              <View style={[styles.row3]}>
                <NameAndTitle
                  style={{flex: 1}}
                  title={'Customer Name:'}
                  value={
                    customerReport?.customerInfo[0]?.customer_name.value
                  }></NameAndTitle>

                <NameAndTitle
                  title={'Surname:'}
                  value={
                    customerReport?.customerInfo[0]?.customer_surname.value
                  }></NameAndTitle>
              </View>
              <View style={[styles.row3]}>
                <NameAndTitle
                  style={{flex: 1}}
                  title={'DOB:'}
                  value={
                    customerReport?.customerInfo[0]?.customer_dob
                  }></NameAndTitle>

                <NameAndTitle
                  title={'Gender:'}
                  value={
                    customerReport?.customerInfo[0]?.customer_gender
                  }></NameAndTitle>
              </View>
            </View>
          )}
        </View>
        <View style={{padding: 5}}>
          <TouchableOpacity
            onPressIn={_customerTab2}
            style={[styles.reportheader]}>
            <TextView
              type={'Light'}
              text="Customer Personal Information"
              style={{color: Colors.white}}></TextView>
            <Pressable onPressIn={_customerTab2}>
              {activeTab == 2 ? (
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
          {activeTab == 2 && (
            <View style={{padding: 5}}>
              <View style={[styles.row2]}>
                <NameAndTitle
                  title={'Mobile No:'}
                  value={
                    customerReport?.customerInfo[0]?.customer_mobileNumber.value
                  }></NameAndTitle>
              </View>

              <View style={[styles.row2]}>
                <NameAndTitle
                  title={'Mother Name:'}
                  value={
                    customerReport?.customerInfo[0]?.customer_motherName.value
                  }></NameAndTitle>
              </View>

              <View style={[styles.row2]}>
                <NameAndTitle
                  style={{flex: 0}}
                  title={'CNIC No:'}
                  value={
                    customerReport?.customerInfo[0]?.customer_cnicNumber.value
                  }></NameAndTitle>
              </View>
              <View style={[styles.row2]}>
                <NameAndTitle
                  title={'Religion:'}
                  value={
                    customerReport?.customerInfo[0]?.customer_religion ==
                    undefined
                      ? ''
                      : customerReport?.customerInfo[0]?.customer_religion.value
                  }></NameAndTitle>
              </View>

              <View style={[styles.row2]}>
                <NameAndTitle
                  style={{flex: 1}}
                  title={'CNIC Issue Date/ Expiry Date:'}
                  value={
                    customerReport?.customerInfo[0]?.customer_cnicissueDate +
                    '   ' +
                    customerReport?.customerInfo[0]?.customer_cnicExpireDate
                  }></NameAndTitle>

                {/* <NameAndTitle style={{display:'flex',justifycontent:' space-between',left:5}}  value={customerReport?.customerInfo[0]?.customer_cnicExpireDate}></NameAndTitle> */}
              </View>
              <View style={[styles.row2]}>
                <NameAndTitle
                  style={{flex: 1}}
                  title={'Family Number:'}
                  value={
                    customerReport?.customerInfo[0]?.FamilyNumber.value
                  }></NameAndTitle>
              </View>
              <View style={[styles.row2]}>
                <NameAndTitle
                  title={'Education:'}
                  value={
                    customerReport?.customerInfo[0]?.customer_education ==
                    undefined
                      ? ''
                      : customerReport?.customerInfo[0]?.customer_education
                          .value
                  }></NameAndTitle>
              </View>

              <View style={[styles.row2]}>
                <NameAndTitle
                  style={{flex: 1}}
                  title={'Father Name:'}
                  value={
                    customerReport?.customerInfo[0]?.customer_fatherName.value
                  }></NameAndTitle>
              </View>

              <View style={[styles.row2]}>
                <NameAndTitle
                  title={'Marital Status:'}
                  value={
                    customerReport?.customerInfo[0]?.customer_maritialStatus
                  }></NameAndTitle>
              </View>

              <View style={[styles.row2]}>
                {customerReport?.customerInfo[0]?.customer_gender == 'Male' && (
                  <NameAndTitle
                    style={{flex: 1}}
                    title={'S/O:'}
                    value={
                      customerReport?.customerInfo[0]?.customer_fatherName.value
                    }></NameAndTitle>
                )}
                {(customerReport?.customerInfo[0]?.customer_gender ==
                  'Female' &&
                  customerReport?.customerInfo[0]?.customer_maritialStatus ==
                    'Single') ||
                  (customerReport?.customerInfo[0]?.customer_maritialStatus ==
                    'Divorced' && (
                    <NameAndTitle
                      style={{flex: 1}}
                      title={'D/O:'}
                      value={
                        customerReport?.customerInfo[0]?.customer_fatherName
                          .value
                      }></NameAndTitle>
                  ))}
                {customerReport?.customerInfo[0]?.customer_gender == 'Female' &&
                  customerReport?.customerInfo[0]?.customer_maritialStatus ==
                    'Married' && (
                    <NameAndTitle
                      style={{flex: 1}}
                      title={'W/O:'}
                      value={
                        customerReport?.customerInfo[0]?.customer_fatherName
                          .value
                      }></NameAndTitle>
                  )}
                {customerReport?.customerInfo[0]?.customer_gender == 'Female' &&
                  customerReport?.customerInfo[0]?.customer_maritialStatus ==
                    'Widow' && (
                    <NameAndTitle
                      style={{flex: 1}}
                      title={'D/O  W/O '}
                      value={
                        customerReport?.customerInfo[0]?.customer_fatherName
                          .value
                      }></NameAndTitle>
                  )}
              </View>
            </View>
          )}
        </View>
        <View style={{padding: 5}}>
          <TouchableOpacity
            onPressIn={_customerTab3}
            style={[styles.reportheader]}>
            <TextView
              type={'Light'}
              text="Customer Additional Information"
              style={{color: Colors.white}}></TextView>
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
            <View style={{padding: 5}}>
              <TextView
                style={styles.mainHeading}
                text={'Customer Additional Information'}
              />
              <View style={[styles.row3]}>
                <NameAndTitle
                  style={{flex: 1}}
                  title={'Region:'}
                  value={
                    customerReport?.customerInfo[0]?.customer_region ==
                    undefined
                      ? ''
                      : customerReport?.customerInfo[0]?.customer_region
                  }></NameAndTitle>

                <NameAndTitle
                  title={'House Status:'}
                  value={
                    customerReport?.customerInfo[0]?.customer_houseStatus ==
                    undefined
                      ? ''
                      : customerReport?.customerInfo[0]?.customer_houseStatus
                          .value
                  }></NameAndTitle>
              </View>
              <View style={[styles.row3]}>
                <NameAndTitle
                  style={{flex: 1}}
                  title={'House Type:'}
                  value={
                    customerReport?.customerInfo[0]?.customer_houseType ==
                    undefined
                      ? ''
                      : customerReport?.customerInfo[0]?.customer_houseType
                          .value
                  }></NameAndTitle>

                <NameAndTitle
                  title={'BISP Beneficiary:'}
                  value={
                    customerReport?.customerInfo[0]?.customer_bispBeneficary ==
                    undefined
                      ? ''
                      : customerReport?.customerInfo[0]?.customer_bispBeneficary
                          .value
                  }></NameAndTitle>
              </View>
              <View style={[styles.row3]}>
                <NameAndTitle
                  style={{flex: 0}}
                  title={'User Type:'}
                  value={
                    customerReport?.customerInfo[0]?.customer_userType ==
                    undefined
                      ? ''
                      : customerReport?.customerInfo[0]?.customer_userType.value
                  }></NameAndTitle>
                {customerReport?.customerInfo[0]?.customer_gender ==
                  'Female' && (
                  <NameAndTitle
                    style={{right: 35}}
                    title={'Guardian CNIC:'}
                    value={
                      customerReport?.customerInfo[0]?.customer_guardianceCnic
                        .value
                    }></NameAndTitle>
                )}
              </View>
              <View style={[styles.row2]}>
                <Checkbox
                  color={Colors.parrotGreenColor}
                  status={
                    customerReport?.customerInfo[0]?.customer_isEmployeed
                      ? 'checked'
                      : 'unchecked'
                  }
                />
                <TextView
                  style={{marginLeft: 10}}
                  type={'small'}
                  text={'Are you Employed?'}></TextView>

                {customerReport?.customerInfo[0]?.customer_isEmployeed ==
                  true && (
                  <ZoomableImage
                    images={`data:image/gif;base64,${customerReport?.customerInfo[0]?.customer_img}`}
                  />
                )}
              </View>
            </View>
          )}
        </View>
        <View style={{padding: 5}}>
          <TouchableOpacity
            onPressIn={_customerTab4}
            style={[styles.reportheader]}>
            <TextView
              type={'Light'}
              text="Kin's Information"
              style={{color: Colors.white}}></TextView>
            <Pressable onPressIn={_customerTab4}>
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
            </Pressable>
          </TouchableOpacity>
          {activeTab == 4 && (
            <View style={{padding: 5}}>
              <View style={[styles.row2]}>
                <NameAndTitle
                  style={{flex: 0}}
                  title={'Next of Kin Name:'}
                  value={
                    customerReport?.customerInfo[0]?.customer_nextKinName.value
                  }></NameAndTitle>
              </View>
              <View style={[styles.row2]}>
                <NameAndTitle
                  title={"Kin's Relation:"}
                  value={
                    customerReport?.customerInfo[0]?.customer_nextKinRelation ==
                    undefined
                      ? ''
                      : customerReport?.customerInfo[0]
                          ?.customer_nextKinRelation.value
                  }></NameAndTitle>
              </View>
              <View style={[styles.row2]}>
                <NameAndTitle
                  style={{flex: 1}}
                  title={'Kin CNIC Number:'}
                  value={
                    customerReport?.customerInfo[0]?.customer_nextKinCnic.value
                  }></NameAndTitle>
              </View>
            </View>
          )}
        </View>

        <View style={{padding: 5}}>
          <TouchableOpacity
            onPressIn={_customerTab5}
            style={[styles.reportheader]}>
            <TextView
              type={'Light'}
              text="Supporting Person Undertaking"
              style={{color: Colors.white}}></TextView>
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
            <View style={{padding: 5}}>
              <View style={[styles.row2]}>
                <NameAndTitle
                  value={
                    customerReport?.customerInfo[0]
                      ?.customer_supportingRequiredPerson_name.value
                  }></NameAndTitle>
                <NameAndTitle
                  style={{flex: 1}}
                  title={
                    'اقرار نامون گهر جي سربراھ/وارث/قرض استعمال ڪندڙ لاءِ:'
                  }></NameAndTitle>
              </View>
              <View style={[styles.row2]}>
                <NameAndTitle
                  value={
                    customerReport?.customerInfo[0]
                      ?.customer_supportingPerson_relation.value
                  }></NameAndTitle>
                <NameAndTitle
                  style={{flex: 0, display: 'flex'}}
                  title={
                    'جو زميدار آھيان، درخواستگذار سان منھنجو'
                  }></NameAndTitle>
              </View>

              <View style={[styles.row2]}>
                <NameAndTitle
                  value={
                    customerReport?.customerInfo[0]
                      ?.customer_supportingRequiredPerson_fathername.value
                  }></NameAndTitle>
                <NameAndTitle style={{flex: 1}} title={'ولد'}></NameAndTitle>

                <NameAndTitle
                  value={
                    customerReport?.customerInfo[0]
                      ?.customer_supportingPerson_name.value
                  }></NameAndTitle>
                <NameAndTitle
                  style={{flex: 1}}
                  title={'سربراھ جو نالو'}></NameAndTitle>
              </View>

              <View style={[styles.row2]}>
                {customerReport?.customerInfo[0]
                  ?.customer_supportingPerson_fingerprint == undefined ? (
                  <MaterialCommunityIcons
                    style={{alignSelf: 'center'}}
                    name="fingerprint"
                    size={56}></MaterialCommunityIcons>
                ) : (
                  <Image
                    style={{
                      height: 70,
                      width: 70,
                      resizeMode: 'cover',
                      alignSelf: 'center',
                    }}
                    source={{
                      uri: `data:image/gif;base64,${customerReport?.customerInfo[0]?.customer_supportingPerson_fingerprint?.imageValue}`,
                    }}></Image>
                )}
                <NameAndTitle
                  value={
                    customerReport?.customerInfo[0]
                      ?.customer_supportingPerson_cnic.value
                  }></NameAndTitle>
                <NameAndTitle
                  style={{flex: 1}}
                  title={'شناّختي ڪارڊ نمبر '}></NameAndTitle>
              </View>
            </View>
          )}
        </View>
        <View style={{ padding: 5 }}>
  <TouchableOpacity
    onPressIn={_customerTab10} // Function to handle tab toggle
    style={[styles.reportheader]}
  >
    <TextView
      type={'Light'}
      text="Customer Bank Information"
      style={{ color: Colors.white }}
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
  </TouchableOpacity>

  {activeTab == 10 && (
    <View style={{ padding: 5 }}>
      <View style={[styles.row2]}>
        <NameAndTitle
          style={{ flex: 1 }}
          title={'Transfer Type (COC/IBFT):'}
          value={customerReport?.customerInfo[0]?.transferType || 'COC'}
        />
      </View>

      <View style={[styles.row2]}>
        <NameAndTitle
          style={{ flex: 1 }}
          title={'Account Number:'}
          value={customerReport?.customerInfo[0]?.accountNumber?.value || ''}
        />
      </View>
      <View style={[styles.row2]}>
        <NameAndTitle
          style={{ flex: 1 }}
          title={'Account Type:'}
          value={customerReport?.customerInfo[0]?.accountType?.value || ''}
        />
      </View>

      <View style={[styles.row2]}>
        <NameAndTitle
          style={{ flex: 1 }}
          title={'Account Title:'}
          value={customerReport?.customerInfo[0]?.accountTitle?.value || ''}
        />
      </View>

      <View style={[styles.row2]}>
        <NameAndTitle
          style={{ flex: 1 }}
          title={'Bank Name:'}
          value={customerReport?.customerInfo[0]?.bankName?.value || ''}
        />
      </View>

      <View style={[styles.row2]}>
        <NameAndTitle
          style={{ flex: 1 }}
          title={'Branch Name:'}
          value={customerReport?.customerInfo[0]?.branchName?.value || ''}
        />
      </View>
      <View style={[styles.row2]}>
        <NameAndTitle
          style={{ flex: 1 }}
          title={'Bank Code:'}
          value={customerReport?.customerInfo[0]?.bankCode?.value || ''}
        />
      </View>
    </View>
  )}
</View>

        <View style={{padding: 5}}>
          <TouchableOpacity
            onPressIn={_customerTab6}
            style={[styles.reportheader]}>
            <TextView
              type={'Light'}
              text="Customer Address"
              style={{color: Colors.white}}></TextView>
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
          </TouchableOpacity>
          {activeTab == 6 && (
            <View style={{padding: 5}}>
              <View style={[styles.row2]}>
                <NameAndTitle
                  style={{flex: 1}}
                  title={'Country:'}
                  value={
                    customerReport?.customerInfo[0]?.customer_pre_country.value
                  }></NameAndTitle>

                <NameAndTitle
                  title={'State/Province:'}
                  value={
                    customerReport?.customerInfo[0]?.customer_pre_stateProvince
                      .value == undefined
                      ? ''
                      : customerReport?.customerInfo[0]
                          ?.customer_pre_stateProvince.value
                  }></NameAndTitle>
              </View>
              <View style={[styles.row2]}>
                <NameAndTitle
                  style={{flex: 1}}
                  title={'District:'}
                  value={
                    customerReport?.customerInfo[0]?.customer_pre_district
                      .value == undefined
                      ? ''
                      : customerReport?.customerInfo[0]?.customer_pre_district
                          .value
                  }></NameAndTitle>

                <NameAndTitle
                  title={'Taluka:'}
                  value={
                    customerReport?.customerInfo[0]?.customer_pre_taluka
                      .value == undefined
                      ? ''
                      : customerReport?.customerInfo[0]?.customer_pre_taluka
                          .value
                  }></NameAndTitle>
              </View>
              <View style={[styles.row2]}>
                <NameAndTitle
                  style={{flex: 1}}
                  title={'Uc:'}
                  value={
                    customerReport?.customerInfo[0]?.customer_pre_uc.value ==
                    undefined
                      ? ''
                      : customerReport?.customerInfo[0]?.customer_pre_uc.value
                  }></NameAndTitle>
              </View>
              <View style={[styles.row2]}>
                <NameAndTitle
                  style={{flex: 1}}
                  title={'Mohalla/Village:'}
                  value={
                    customerReport?.customerInfo[0]?.customer_pre_mohalla
                      .value == undefined
                      ? ''
                      : customerReport?.customerInfo[0]?.customer_pre_mohalla
                          .value
                  }></NameAndTitle>
              </View>
              <View style={[styles.row2]}>
                <NameAndTitle
                  style={{flex: 1}}
                  title={'City:'}
                  value={
                    customerReport?.customerInfo[0]?.customer_pre_city.value
                  }></NameAndTitle>
              </View>
              <View style={[styles.row2]}>
                <NameAndTitle
                  style={{flex: 1}}
                  title={'Address:'}
                  value={
                    customerReport?.customerInfo[0]?.customer_pre_address.value
                  }></NameAndTitle>
              </View>
              <View style={[styles.row2]}>
                <NameAndTitle
                  style={{flex: 1}}
                  title={'No of years:'}
                  value={
                    customerReport?.customerInfo[0]?.numberOfyear.value
                  }></NameAndTitle>

                <NameAndTitle
                  style={{flex: 1}}
                  title={'Notes:'}
                  value={
                    customerReport?.customerInfo[0]?.addressnotes.value
                  }></NameAndTitle>
              </View>
            </View>
          )}
        </View>

        <View style={{padding: 5}}>
          <TouchableOpacity
            onPressIn={_customerTab7}
            style={[styles.reportheader]}>
            <TextView
              type={'Light'}
              text="Customer Health Information"
              style={{color: Colors.white}}></TextView>
            <Pressable onPressIn={_customerTab7}>
              {activeTab == 7 ? (
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
          {activeTab == 7 && (
            <View style={{padding: 5}}>
              <View style={[styles.row2]}>
                <NameAndTitle
                  style={{flex: 1}}
                  title={'The Physical health condition of the applicant:'}
                  value={
                    customerReport?.customerInfo[0]?.customer_physicalHealth ==
                    undefined
                      ? ''
                      : customerReport?.customerInfo[0]?.customer_physicalHealth
                          .value
                  }></NameAndTitle>
              </View>
              <View style={[styles.row2]}>
                <NameAndTitle
                  title={'Found in any illness/disease:'}
                  value={
                    customerReport?.customerInfo[0]?.customer_anyillness ==
                    undefined
                      ? ''
                      : customerReport?.customerInfo[0]?.customer_anyillness
                          .value
                  }></NameAndTitle>
              </View>
              <View style={[styles.row2]}>
                <NameAndTitle
                  style={{flex: 1}}
                  title={'Laboratory test in last 2 years:'}
                  value={
                    customerReport?.customerInfo[0]
                      ?.customer_labourtytestintwoyear == undefined
                      ? ''
                      : customerReport?.customerInfo[0]
                          ?.customer_labourtytestintwoyear.value
                  }></NameAndTitle>
              </View>
              <View style={[styles.row2]}>
                {customerReport?.customerInfo[0]?.customer_anyillness ==
                undefined ? (
                  <></>
                ) : (
                  <NameAndTitle
                    style={{flex: 1}}
                    title={'Client Disease:'}
                    value={
                      customerReport?.customerInfo[0]?.customer_disease ==
                      undefined
                        ? ''
                        : customerReport?.customerInfo[0]?.customer_disease
                            .value
                    }></NameAndTitle>
                )}
              </View>
              <View style={[styles.row2]}>
                {customerReport?.customerInfo[0]
                  ?.customer_labourtytestintwoyear == undefined ? (
                  <></>
                ) : (
                  <NameAndTitle
                    style={{flex: 1}}
                    title={'The physical condition of the applicant:'}
                    value={
                      customerReport?.customerInfo[0]
                        ?.customer_labourtytestintwoyear == undefined
                        ? ''
                        : customerReport?.customerInfo[0]
                            ?.customer_labourtytestintwoyear.value
                    }></NameAndTitle>
                )}
              </View>
            </View>
          )}
        </View>
        {/* ****************************************** Loan **********************************  */}
        <View style={styles.row}>
          <View
            style={{
              width: 50,
              height: 50,
              borderRadius: 50,
              borderColor: '#cdcdcd',
              borderWidth: 1,
              justifyContent: 'center',
            }}>
            <Fontisto
              name="credit-card"
              color={Colors.parrotGreenColor}
              size={20}
              style={{alignSelf: 'center'}}
            />
          </View>
          <TextView
            style={[styles.mainHeading2, {flex: 1}]}
            text={`${loanLabel}`}></TextView>
        </View>
        <View style={{padding: 5}}>
          <TouchableOpacity
            onPressIn={_customerTab8}
            style={[styles.reportheader]}>
            <TextView
              type={'Light'}
              text={`${loanLabel} Information`}
              style={{color: Colors.white}}></TextView>
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
          </TouchableOpacity>
          {activeTab == 8 && (
            <View style={{padding: 5}}>
              {/* <TextView style={styles.mainHeading} text={"Loan Information"} /> */}

              <View style={[styles.row2]}>
                <NameAndTitle
                  style={{flex: 1}}
                  
                  title={`Customer ${loanLabel} Type:`}
                  value={
                    customerReport?.loanInfo[0]?.customerLoan_type == undefined
                      ? ''
                      : customerReport?.loanInfo[0]?.customerLoan_type.value
                  }></NameAndTitle>
              </View>
              <View style={[styles.row2]}>
                <NameAndTitle
                  title={'Repayment Frequency:'}
                  value={
                    customerReport?.loanInfo[0]?.selectRepaymentFrequency ==
                    undefined
                      ? ''
                      : customerReport?.loanInfo[0]?.selectRepaymentFrequency
                          .value
                  }></NameAndTitle>
              </View>
              <View style={[styles.row2]}>
                <NameAndTitle
                  title={`${loanLabel} Types:`}
                  value={
                    customerReport?.loanInfo[0]?.loanType == undefined
                      ? 'no'
                      : customerReport?.loanInfo[0]?.loanType.value
                  }></NameAndTitle>
              </View>
              <View style={[styles.row2]}>
                <NameAndTitle
                 title={`${loanLabel} Sub-Type:`}
                  value={
                    customerReport?.loanInfo[0]?.loanSubType == undefined
                      ? ''
                      : customerReport?.loanInfo[0]?.loanSubType.value
                  }></NameAndTitle>
              </View>
              <View style={[styles.row2]}>
                {customerReport?.loanInfo[0]?.loanType != undefined &&
                customerReport?.loanInfo[0]?.loanType.value == 'Live Stock' ? (
                  <></>
                ) : (
                  <NameAndTitle
                    title={
                      'Percentage Loan(' +
                      customerReport?.loanInfo[0]?.loanPercentage.value +
                      '%)'
                    }
                    value={
                      customerReport?.loanInfo[0]?.calculatedPercentage.value
                    }></NameAndTitle>
                )}
              </View>
              <View style={[styles.row2]}>
                {customerReport?.loanInfo[0]?.loanType != undefined &&
                customerReport?.loanInfo[0]?.loanType.value ==
                  'Auto Finance' ? (
                  <NameAndTitle
                    title={
                      'Autofinance Downpaymet Percentage(' +
                      customerReport?.loanInfo[0]
                        ?.AutofinanceProductPercentagevalue.value +
                      '%)'
                    }
                    value={
                      customerReport?.loanInfo[0]
                        ?.AutofinanceProductPercentagevalue.value +
                      '(' +
                      customerReport?.loanInfo[0]
                        ?.AutofinanceProductPercentage +
                      ')'
                    }></NameAndTitle>
                ) : (
                  <></>
                )}
              </View>

              <View style={[styles.row2]}>
                <NameAndTitle
                  title={`Requested ${loanLabel}:`}
                  value={
                    customerReport?.loanInfo[0]?.requestedLoan.value
                  }></NameAndTitle>
              </View>
              <View style={[styles.row2]}>
  <NameAndTitle
    title={`Approved ${loanLabel}:`}
    value={
      customerReport?.loanInfo[0]?.approvedLoan.value !== undefined &&
      customerReport?.loanInfo[0]?.numericalValue !== undefined
        ? (
            parseFloat(customerReport.loanInfo[0].approvedLoan.value) +
            parseFloat(customerReport.loanInfo[0].numericalValue.value)
          ).toString()
        : customerReport?.loanInfo[0]?.approvedLoan.value
    }
    
  />
  <Text style={[styles.text3]}>Including withholding tax</Text>
</View>
<View style={[styles.row2]}>
  <NameAndTitle
    title={'Withholding Tax:'}
    value={
      customerReport?.loanInfo[0]?.numericalValue?.value ?? ''
    }
  />
</View>
              
              {/* <View style={[styles.row2]}>
                <NameAndTitle
                  title={'Approved Loan:'}
                  value={
                    customerReport?.loanInfo[0]?.approvedLoan.value
                  }></NameAndTitle>
              </View>
              <View style={[styles.row2]}> */}
                {/* <NameAndTitle style={{ flex: 1 }} title={"Customer Loan Type:"} value={customerReport?.loanInfo[0]?.customerLoan_type == undefined ? '' : customerReport?.loanInfo[0]?.customerLoan_type.value} ></NameAndTitle> */}
                {/* <NameAndTitle
                  title={'Withholding Tax:'}
                  value={
                    customerReport?.loanInfo[0]?.numericalValue == undefined
                      ? ''
                      : customerReport?.loanInfo[0]?.numericalValue.value
                  }></NameAndTitle>
              </View> */}
              <View style={[styles.row2]}>
                {customerReport?.loanInfo[0]?.loanType?.value ===
                  'Auto Finance' && (
                  <NameAndTitle
                    title={'Dealer Business Name'}
                    value={
                      customerReport?.loanInfo[0]?.DealerBusinessName?.value ||
                      ''
                    }
                  />
                )}
              </View>
              <View style={[styles.row2]}>
                {customerReport?.loanInfo[0]?.loanType?.value ===
                  'Auto Finance' && (
                  <NameAndTitle
                    title={'Dealer Name'}
                    value={customerReport?.loanInfo[0]?.DealerName?.value || ''}
                  />
                )}
              </View>
              <View style={[styles.row2]}>
                {customerReport?.loanInfo[0]?.loanType?.value ===
                  'Auto Finance' && (
                  <NameAndTitle
                    title={'Dealer CNIC'}
                    value={customerReport?.loanInfo[0]?.DealerCnic?.value || ''}
                  />
                )}
              </View>

              <View style={[styles.row2]}>
                <NameAndTitle
                  title={`${loanLabel} Term:`}
                  value={
                    customerReport?.loanInfo[0]?.loanTerm == undefined
                      ? ''
                      : customerReport?.loanInfo[0]?.loanTerm.value
                  }></NameAndTitle>
                <NameAndTitle
                  title={`${loanLabel} Status:`}
                  value={
                    customerReport?.loanInfo[0]?.loanStatus.value
                  }></NameAndTitle>
              </View>

              <View style={[styles.row2]}>
                <NameAndTitle
                  title={'Personal Capital in Business:'}
                  value={
                    customerReport?.loanInfo[0]?.personalCapitalinBusiness.value
                  }></NameAndTitle>
              </View>
              <View style={[styles.row2]}>
                <NameAndTitle
                  title={'Amount Required for Business:'}
                  value={
                    customerReport?.loanInfo[0]?.amountRequiredforBusiness.value
                  }></NameAndTitle>
              </View>

              <View style={[styles.row2]}>
                <NameAndTitle
                  title={'Expected Monthly Income from Business:'}
                  value={
                    customerReport?.loanInfo[0]?.expectedMonthlyIncome.value
                  }></NameAndTitle>
              </View>
              <View style={[styles.row2]}>
                <NameAndTitle
                  title={'Income from Sale/Services:'}
                  value={
                    customerReport?.loanInfo[0]?.incomeFromSales.value
                  }></NameAndTitle>
              </View>

              <View style={[styles.row2]}>
                <NameAndTitle
                  title={'Rental Incom/Any Other Income:'}
                  value={
                    customerReport?.loanInfo[0]?.rentalIncome.value
                  }></NameAndTitle>
              </View>
              <View style={[styles.row2]}>
                <NameAndTitle
                  title={'Monthly Incom:'}
                  value={
                    customerReport?.loanInfo[0]?.monthlyIncome.value
                  }></NameAndTitle>
              </View>
              <View style={[styles.row2]}>
                <NameAndTitle
                  title={'Business Address:'}
                  value={
                    customerReport?.loanInfo[0]?.businessAddress.value
                  }></NameAndTitle>
              </View>
              <View style={[styles.row2]}>
                <NameAndTitle
                  title={'Business Name:'}
                  value={
                    customerReport?.loanInfo[0]?.businessName.value
                  }></NameAndTitle>
              </View>

              <View style={[styles.row2]}>
                <NameAndTitle
                  title={'Experience in Address:'}
                  value={
                    customerReport?.loanInfo[0]?.experianceinBusiness.value
                  }></NameAndTitle>
              </View>
              <View style={[styles.row2]}>
                <NameAndTitle
                 title={`${loanLabel} Date:`}
                  value={
                    customerReport?.loanInfo[0]?.loanDate == undefined
                      ? ''
                      : customerReport?.loanInfo[0]?.loanDate
                  }></NameAndTitle>
              </View>

              <View style={[styles.row2]}>
                <NameAndTitle
                  title={'Notes:'}
                  value={
                    customerReport?.loanInfo[0]?.loanNote.value
                  }></NameAndTitle>
              </View>
              <View style={[styles.row2]}>
                <NameAndTitle
                  
                  title={`want Top-Up Solar ${loanLabel}?:`}
                  value={
                    customerReport?.loanInfo[0]?.doyouwantTopupLoan == undefined
                      ? ''
                      : customerReport?.loanInfo[0]?.doyouwantTopupLoan
                  }></NameAndTitle>
              </View>

              <View style={[styles.row2]}>
                <NameAndTitle
                  title={`Do you want Top-Up Solar ${loanLabel}?:`}
                  value={
                    customerReport?.loanInfo[0]?.doyouwantSolarTopupLoan ==
                    undefined
                      ? ''
                      : customerReport?.loanInfo[0]?.doyouwantSolarTopupLoan ==
                        0
                      ? 'No'
                      : 'Yes'
                  }></NameAndTitle>
              </View>

              {/* <View style={[styles.row2]}>

                                {customerReport?.loanInfo[0]?.customerLoan_type != undefined &&
                                    customerReport?.loanInfo[0]?.customerLoan_type.value == "Personal" ? (
                                    <NameAndTitle title={"Occupation:"} value={customerReport?.loanInfo[0]?.occupation.value}></NameAndTitle>
                                ) : (
                                    <></>
                                )

                                }
                                {customerReport?.loanInfo[0]?.customerLoan_type != undefined &&
                                    customerReport?.loanInfo[0]?.customerLoan_type.value == "Personal" ? (
                                    <NameAndTitle title={"Occupation Type:"} value={customerReport?.loanInfo[0]?.occupationType == undefined ? '' : customerReport?.loanInfo[0]?.occupationType.value}></NameAndTitle>
                                ) : (
                                    <></>
                                )
                                }

                            </View> */}
              <View style={[styles.row2]}>
                {customerReport?.loanInfo[0]?.customerLoan_type != undefined &&
                customerReport?.loanInfo[0]?.customerLoan_type.value ==
                  'Personal' ? (
                  <NameAndTitle
                    title={'Occupation:'}
                    value={customerReport?.loanInfo[0]?.occupation.value}
                  />
                ) : null}
              </View>

              <View style={[styles.row2]}>
                {customerReport?.loanInfo[0]?.customerLoan_type != undefined &&
                customerReport?.loanInfo[0]?.customerLoan_type.value ==
                  'Personal' ? (
                  <NameAndTitle
                    title={'Occupation Type:'}
                    value={
                      customerReport?.loanInfo[0]?.occupationType == undefined
                        ? ''
                        : customerReport?.loanInfo[0]?.occupationType.value
                    }
                  />
                ) : null}
              </View>
              {/* <View style={[styles.row2]}>

                                {customerReport?.loanInfo[0]?.customerLoan_type != undefined &&
                                    customerReport?.loanInfo[0]?.customerLoan_type.value == "Personal" &&
                                    customerReport?.loanInfo[0]?.occupationType != undefined &&
                                    customerReport?.loanInfo[0]?.occupationType.value == "Job" ? (
                                    <NameAndTitle title={"Designation:"} value={customerReport?.loanInfo[0]?.PersonalJobDesignation.value}></NameAndTitle>
                                ) : (
                                    <></>
                                )

                                }
                                {customerReport?.loanInfo[0]?.customerLoan_type != undefined &&
                                    customerReport?.loanInfo[0]?.customerLoan_type.value == "Personal" &&
                                    customerReport?.loanInfo[0]?.occupationType != undefined &&
                                    customerReport?.loanInfo[0]?.occupationType.value == "Job" ? (
                                    <NameAndTitle title={"Select Department:"} value={customerReport?.loanInfo[0]?.PersonalJobDepartment == undefined ? '' : customerReport?.loanInfo[0]?.PersonalJobDepartment.value}></NameAndTitle>
                                ) : (
                                    <></>
                                )
                                }

                            </View> */}

              <View style={[styles.row2]}>
                {customerReport?.loanInfo[0]?.customerLoan_type != undefined &&
                customerReport?.loanInfo[0]?.customerLoan_type.value ==
                  'Personal' &&
                customerReport?.loanInfo[0]?.occupationType != undefined &&
                customerReport?.loanInfo[0]?.occupationType.value == 'Job' ? (
                  <NameAndTitle
                    title={'Designation:'}
                    value={
                      customerReport?.loanInfo[0]?.PersonalJobDesignation.value
                    }
                  />
                ) : null}
              </View>

              <View style={[styles.row2]}>
                {customerReport?.loanInfo[0]?.customerLoan_type != undefined &&
                customerReport?.loanInfo[0]?.customerLoan_type.value ==
                  'Personal' &&
                customerReport?.loanInfo[0]?.occupationType != undefined &&
                customerReport?.loanInfo[0]?.occupationType.value == 'Job' ? (
                  <NameAndTitle
                    title={'Select Department:'}
                    value={
                      customerReport?.loanInfo[0]?.PersonalJobDepartment ==
                      undefined
                        ? ''
                        : customerReport?.loanInfo[0]?.PersonalJobDepartment
                            .value
                    }
                  />
                ) : null}
              </View>

              <View style={[styles.row2]}>
                {(customerReport?.loanInfo[0]?.customerLoan_type != undefined &&
                  customerReport?.loanInfo[0]?.customerLoan_type.value ==
                    'Individual') ||
                (customerReport?.loanInfo[0]?.customerLoan_type != undefined &&
                  customerReport?.loanInfo[0]?.customerLoan_type.value ==
                    'PM Loan') ? (
                  <NameAndTitle
                    title={'Occupation:'}
                    value={
                      customerReport?.loanInfo[0]?.occupation.value
                    }></NameAndTitle>
                ) : (
                  <></>
                )}
                {(customerReport?.loanInfo[0]?.customerLoan_type != undefined &&
                  customerReport?.loanInfo[0]?.customerLoan_type.value ==
                    'Individual') ||
                (customerReport?.loanInfo[0]?.customerLoan_type != undefined &&
                  customerReport?.loanInfo[0]?.customerLoan_type.value ==
                    'PM Loan') ? (
                  <NameAndTitle
                    title={'No of Employess:'}
                    value={
                      customerReport?.loanInfo[0]?.no_of_emploee.value
                    }></NameAndTitle>
                ) : (
                  <></>
                )}

                {customerReport?.loanInfo[0]?.customerLoan_type != undefined &&
                customerReport?.loanInfo[0]?.customerLoan_type.value ==
                  'Personal' ? (
                  <NameAndTitle
                    title={'No of Employess:'}
                    value={
                      customerReport?.loanInfo[0]?.no_of_emploee.value
                    }></NameAndTitle>
                ) : (
                  <></>
                )}
                {customerReport?.loanInfo[0]?.customerLoan_type != undefined &&
                customerReport?.loanInfo[0]?.customerLoan_type.value ==
                  'Personal' &&
                customerReport?.loanInfo[0]?.occupationType != undefined &&
                customerReport?.loanInfo[0]?.occupationType.value == 'Job' ? (
                  <NameAndTitle
                    title={'Job Type:'}
                    value={
                      customerReport?.loanInfo[0]?.PersonalLoanJobType ==
                      undefined
                        ? ''
                        : customerReport?.loanInfo[0]?.PersonalLoanJobType.value
                    }></NameAndTitle>
                ) : (
                  <></>
                )}
              </View>

              <View style={styles.row3}>
                {customerReport?.loanInfo[0]?.customerLoan_type != undefined &&
                  customerReport?.loanInfo[0]?.customerLoan_type.value ==
                    'Islamic Finance' && (
                    <TextView
                      type={'Bold'}
                      text="Vendor Detail"
                      style={styles.textHeading}></TextView>
                  )}
              </View>
              <View style={styles.row2}>
                {customerReport?.loanInfo[0]?.customerLoan_type != undefined &&
                  customerReport?.loanInfo[0]?.customerLoan_type.value ==
                    'Islamic Finance' && (
                    <NameAndTitle
                      title={'CNIC:'}
                      value={
                        customerReport?.loanInfo[0]?.vendorCnic.value
                      }></NameAndTitle>
                  )}
                {customerReport?.loanInfo[0]?.customerLoan_type != undefined &&
                  customerReport?.loanInfo[0]?.customerLoan_type.value ==
                    'Islamic Finance' && (
                    <NameAndTitle
                      title={'Name:'}
                      value={
                        customerReport?.loanInfo[0]?.vendorName.value
                      }></NameAndTitle>
                  )}
              </View>
              <View style={styles.row2}>
                {customerReport?.loanInfo[0]?.customerLoan_type != undefined &&
                  customerReport?.loanInfo[0]?.customerLoan_type.value ==
                    'Islamic Finance' && (
                    <NameAndTitle
                      title={'Shop Name:'}
                      value={
                        customerReport?.loanInfo[0]?.vendorShopName.value
                      }></NameAndTitle>
                  )}
                {customerReport?.loanInfo[0]?.customerLoan_type != undefined &&
                  customerReport?.loanInfo[0]?.customerLoan_type.value ==
                    'Islamic Finance' && (
                    <NameAndTitle
                      title={'Mob/No:'}
                      value={
                        customerReport?.loanInfo[0]?.vendorMobileNumber.value
                      }></NameAndTitle>
                  )}
              </View>
              <View style={styles.row2}>
                {customerReport?.loanInfo[0]?.customerLoan_type != undefined &&
                  customerReport?.loanInfo[0]?.customerLoan_type.value ==
                    'Islamic Finance' && (
                    <NameAndTitle
                      title={'Product Name:'}
                      value={
                        customerReport?.loanInfo[0]?.vendorProductName.value
                      }></NameAndTitle>
                  )}
                {customerReport?.loanInfo[0]?.customerLoan_type != undefined &&
                  customerReport?.loanInfo[0]?.customerLoan_type.value ==
                    'Islamic Finance' && (
                    <NameAndTitle
                      title={'Product Price:'}
                      value={
                        customerReport?.loanInfo[0]?.vendorProductPrice.value
                      }></NameAndTitle>
                  )}
              </View>
              <View style={styles.row2}>
                {customerReport?.loanInfo[0]?.customerLoan_type != undefined &&
                  customerReport?.loanInfo[0]?.customerLoan_type.value ==
                    'Islamic Finance' && (
                    <NameAndTitle
                      title={'Product Company Name:'}
                      value={
                        customerReport?.loanInfo[0]?.ProductCompanyName.value
                      }></NameAndTitle>
                  )}
              </View>
              {customerReport?.loanInfo[0]?.customerLoan_type != undefined &&
                customerReport?.loanInfo[0]?.customerLoan_type.value ==
                  'Islamic Finance' && (
                  <View style={styles.row2}>
                    <View style={{flexDirection: 'row', position: 'relative'}}>
                      {customerReport?.loanInfo[0]?.customerLoan_type !=
                        undefined &&
                        customerReport?.loanInfo[0]?.customerLoan_type.value ==
                          'Islamic Finance' &&
                        (customerReport?.loanInfo[0]?.vendorCnicImages[0]
                          .cnicFront.imgValue == undefined ? (
                          <MaterialCommunityIcons
                            style={{alignSelf: 'center'}}
                            name="google-photos"
                            size={56}></MaterialCommunityIcons>
                        ) : (
                          <ZoomableImage
                            images={`data:image/gif;base64,${customerReport?.loanInfo[0]?.vendorCnicImages[0].cnicFront.imgValue}`}
                          />
                        ))}

                      {customerReport?.loanInfo[0]?.customerLoan_type !=
                        undefined &&
                        customerReport?.loanInfo[0]?.customerLoan_type.value ==
                          'Islamic Finance' &&
                        (customerReport?.loanInfo[0]?.vendorCnicImages[0]
                          .cnicFront.imgValue == undefined ? (
                          <MaterialCommunityIcons
                            style={{alignSelf: 'center'}}
                            name="google-photos"
                            size={56}></MaterialCommunityIcons>
                        ) : (
                          <ZoomableImage
                            images={`data:image/gif;base64,${customerReport?.loanInfo[0]?.vendorCnicImages[0].cnicBack.imgValue}`}
                          />
                        ))}
                    </View>
                  </View>
                )}
              <View style={[styles.row2]}>
                {customerReport?.loanInfo[0]?.doyouwantTopupLoan != undefined &&
                customerReport?.loanInfo[0]?.doyouwantTopupLoan == 'Yes' ? (
                  <NameAndTitle
                    title={'Topup Type Loan:'}
                    value={
                      customerReport?.loanInfo[0]?.topupLoantype == undefined
                        ? ''
                        : customerReport?.loanInfo[0]?.topupLoantype.value
                    }></NameAndTitle>
                ) : (
                  <></>
                )}
                {customerReport?.loanInfo[0]?.customerLoan_type != undefined &&
                customerReport?.loanInfo[0]?.customerLoan_type.value ==
                  'Personal' ? (
                  <NameAndTitle
                    title={'Quantity:'}
                    value={
                      customerReport?.loanInfo[0]?.topupLoanQty == undefined
                        ? '1'
                        : customerReport?.loanInfo[0]?.topupLoanQty.value
                    }></NameAndTitle>
                ) : (
                  <></>
                )}
              </View>
              <View style={[styles.row2]}>
                {customerReport?.loanInfo[0]?.doyouwantTopupLoan != undefined &&
                customerReport?.loanInfo[0]?.doyouwantTopupLoan == 'Yes' ? (
                  <NameAndTitle
                    title={'Topup Type Value:'}
                    value={
                      customerReport?.loanInfo[0]?.topupLoanValue == undefined
                        ? ''
                        : customerReport?.loanInfo[0]?.topupLoanValue
                    }></NameAndTitle>
                ) : (
                  <></>
                )}
              </View>
              <View style={styles.row3}>
                <TextView
                  type={'Bold'}
                  text="Monthly Expense"
                  style={styles.textHeading}></TextView>
              </View>
              <View style={styles.row3}>
                <NameAndTitle
                  title={'Raw/business Material Purchasings:'}
                  value={
                    customerReport?.loanInfo[0]?.rawMaterialpurchase.value
                  }></NameAndTitle>
                <NameAndTitle
                  title={'Salaries/Wages and Labour Charges:'}
                  value={
                    customerReport?.loanInfo[0]?.salariesandLabourCharges.value
                  }></NameAndTitle>
              </View>
              <View style={styles.row3}>
                <NameAndTitle
                  title={'Utility Expenses:'}
                  value={
                    customerReport?.loanInfo[0]?.utilityExpense.value
                  }></NameAndTitle>
                <NameAndTitle
                  title={'Other Expenses:'}
                  value={
                    customerReport?.loanInfo[0]?.otherExpenses.value
                  }></NameAndTitle>
              </View>
              <View style={styles.row3}>
                <NameAndTitle
                  title={'Monthly Expenses:'}
                  value={
                    customerReport?.loanInfo[0]?.monthlyExpenses.value
                  }></NameAndTitle>
              </View>

              <View style={styles.row3}>
                <TextView
                  type={'Bold'}
                  text="Liability"
                  style={styles.textHeading}></TextView>
              </View>
              <View style={styles.row3}>
                <NameAndTitle
                  title={'Monthly Installment from lenders:'}
                  value={
                    customerReport?.loanInfo[0]?.monthlyInstallment.value
                  }></NameAndTitle>
                <NameAndTitle
                  title={'Any Other Monthly Liability:'}
                  value={
                    customerReport?.loanInfo[0]?.anyOtherMonthly.value
                  }></NameAndTitle>
              </View>
              <View style={styles.row3}>
                <NameAndTitle
                  title={'Liability:'}
                  value={
                    customerReport?.loanInfo[0]?.liability.value
                  }></NameAndTitle>
                <NameAndTitle
                  title={'Business Savings:'}
                  value={
                    customerReport?.loanInfo[0]?.businessSavings.value
                  }></NameAndTitle>
              </View>

              <View style={styles.row3}>
                <TextView
                  type={'Bold'}
                  text="Monthly Household Income"
                  style={styles.textHeading}></TextView>
              </View>
              <View style={styles.row3}>
                <NameAndTitle
                  title={'Income from other Source (if any):'}
                  value={
                    customerReport?.loanInfo[0]?.incomefromOtherSource.value
                  }></NameAndTitle>
                <NameAndTitle
                  title={'Other Family Income(If Any):'}
                  value={
                    customerReport?.loanInfo[0]?.otherFamilyIncome.value
                  }></NameAndTitle>
              </View>
              <View style={styles.row3}>
                <NameAndTitle
                  title={'Any Other Income/Rental Income (If any):'}
                  value={
                    customerReport?.loanInfo[0]?.anyOtherIncome.value
                  }></NameAndTitle>
                <NameAndTitle
                  title={'Monthly Household Income:'}
                  value={
                    customerReport?.loanInfo[0]?.monthlyHouseholdIncome.value
                  }></NameAndTitle>
              </View>

              <View style={styles.row3}>
                <TextView
                  type={'Bold'}
                  text="Monthly Household Expense"
                  style={styles.textHeading}></TextView>
              </View>
              <View style={styles.row3}>
                <NameAndTitle
                  title={'Kitchen/Household Expense:'}
                  value={
                    customerReport?.loanInfo[0]?.kitchenExpense.value
                  }></NameAndTitle>
                <NameAndTitle
                  title={'Children Education Expense:'}
                  value={
                    customerReport?.loanInfo[0]?.childrenExpense.value
                  }></NameAndTitle>
                <NameAndTitle
                  title={'Monthly Household Expense:'}
                  value={
                    customerReport?.loanInfo[0]?.monthlyHouseholdExpense.value
                  }></NameAndTitle>
              </View>
              <View style={styles.row3}>
                <NameAndTitle
                  title={'Utility Expense:'}
                  value={
                    customerReport?.loanInfo[0]?.utilityExpenses.value
                  }></NameAndTitle>
                <NameAndTitle
                  title={'Any Other Expenses:'}
                  value={
                    customerReport?.loanInfo[0]?.anyOtherExpenses.value
                  }></NameAndTitle>
              </View>
              <View style={styles.row3}>
                <NameAndTitle
                  title={'Household Liability:'}
                  value={
                    customerReport?.loanInfo[0]?.householdLiability.value
                  }></NameAndTitle>
                <NameAndTitle
                  title={'Household Savings:'}
                  value={
                    customerReport?.loanInfo[0]?.householdSavings.value
                  }></NameAndTitle>
              </View>
            </View>
          )}
        </View>

        <View style={{padding: 5}}>
          <TouchableOpacity
            onPressIn={_customerTab9}
            style={[styles.reportheader]}>
            <TextView
              type={'Light'}
              text="Aml/CFT Customer Risk Profiling"
              style={{color: Colors.white}}></TextView>
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
            <View style={{padding: 5}}>
              <View style={styles.row2}>
                <NameAndTitle
                  style={{flex: 1}}
                  title={'Geographical Risk:'}
                  value={
                    customerReport?.loanInfo[0]?.geographicrisk == undefined
                      ? 'None'
                      : customerReport?.loanInfo[0]?.geographicrisk.name
                  }></NameAndTitle>
                <View
                  style={{
                    width: width / 2.5,
                    height: 55,
                    paddingLeft: 0,
                    marginTop: 10,
                    justifyContent: 'center',
                    left: 35,
                  }}>
                  <TextView
                    type={'Light'}
                    style={{textAlign: 'center'}}
                    text="Risk Profiling"></TextView>
                  <View
                    style={{
                      alignSelf: 'center',
                      backgroundColor:
                        customerReport?.loanInfo[0]?.geographicrisk == undefined
                          ? ''
                          : customerReport?.loanInfo[0]?.geographicrisk.risk ==
                            1
                          ? 'green'
                          : customerReport?.loanInfo[0]?.geographicrisk ==
                            undefined
                          ? ''
                          : customerReport?.loanInfo[0]?.geographicrisk.risk ==
                            2
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
                          customerReport?.loanInfo[0]?.geographicrisk ==
                          undefined
                            ? ''
                            : customerReport?.loanInfo[0]?.geographicrisk
                                .risk == 1
                            ? '#FFF'
                            : customerReport?.loanInfo[0]?.geographicrisk ==
                              undefined
                            ? ''
                            : customerReport?.loanInfo[0]?.geographicrisk
                                .risk == 2
                            ? '#000'
                            : '#FFF',
                      }}
                      text={
                        customerReport?.loanInfo[0]?.geographicrisk == undefined
                          ? ''
                          : customerReport?.loanInfo[0]?.geographicrisk.risk ==
                            1
                          ? 'Low'
                          : customerReport?.loanInfo[0]?.geographicrisk ==
                            undefined
                          ? ''
                          : customerReport?.loanInfo[0]?.geographicrisk.risk ==
                            2
                          ? 'Medium'
                          : 'High'
                      }></TextView>
                  </View>
                </View>
              </View>
              <View style={styles.row2}>
                <NameAndTitle
                  style={{flex: 1}}
                  title={'Customer/Product Risk'}
                  value={
                    customerReport?.loanInfo[0]?.customerandproductrisk ==
                    undefined
                      ? 'None'
                      : customerReport?.loanInfo[0]?.customerandproductrisk.name
                  }></NameAndTitle>
                <View
                  style={{
                    width: width / 2.5,
                    height: 55,
                    paddingLeft: 0,
                    marginTop: 10,
                    justifyContent: 'center',
                    left: 45,
                  }}>
                  <TextView
                    type={'Light'}
                    style={{textAlign: 'center'}}
                    text="Risk Profiling"></TextView>
                  <View
                    style={{
                      alignSelf: 'center',
                      backgroundColor:
                        customerReport?.loanInfo[0]?.customerandproductrisk ==
                        undefined
                          ? ''
                          : customerReport?.loanInfo[0]?.customerandproductrisk
                              .risk == 1
                          ? 'green'
                          : customerReport?.loanInfo[0]
                              ?.customerandproductrisk == undefined
                          ? ''
                          : customerReport?.loanInfo[0]?.customerandproductrisk
                              .risk == 2
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
                          customerReport?.loanInfo[0]?.customerandproductrisk ==
                          undefined
                            ? ''
                            : customerReport?.loanInfo[0]
                                ?.customerandproductrisk.risk == 1
                            ? '#FFF'
                            : customerReport?.loanInfo[0]
                                ?.customerandproductrisk == undefined
                            ? ''
                            : customerReport?.loanInfo[0]
                                ?.customerandproductrisk.risk == 2
                            ? '#000'
                            : '#FFF',
                      }}
                      text={
                        customerReport?.loanInfo[0]?.customerandproductrisk ==
                        undefined
                          ? ''
                          : customerReport?.loanInfo[0]?.customerandproductrisk
                              .risk == 1
                          ? 'Low'
                          : customerReport?.loanInfo[0]
                              ?.customerandproductrisk == undefined
                          ? ''
                          : customerReport?.loanInfo[0]?.customerandproductrisk
                              .risk == 2
                          ? 'Medium'
                          : 'High'
                      }></TextView>
                  </View>
                </View>
              </View>
              <View style={styles.row2}>
                <NameAndTitle
                  style={{flex: 1}}
                  title={'PEP Risk'}
                  value={
                    customerReport?.loanInfo[0]?.peprisk == undefined
                      ? 'None'
                      : customerReport?.loanInfo[0]?.peprisk.name
                  }></NameAndTitle>
                <View
                  style={{
                    width: width / 2.5,
                    height: 55,
                    paddingLeft: 0,
                    marginTop: 10,
                    justifyContent: 'center',
                    left: 35,
                  }}>
                  <TextView
                    type={'Light'}
                    style={{textAlign: 'center'}}
                    text="Risk Profiling"></TextView>
                  <View
                    style={{
                      alignSelf: 'center',
                      backgroundColor:
                        customerReport?.loanInfo[0]?.peprisk == undefined
                          ? ''
                          : customerReport?.loanInfo[0]?.peprisk.risk == 1
                          ? 'green'
                          : customerReport?.loanInfo[0]?.peprisk == undefined
                          ? ''
                          : customerReport?.loanInfo[0]?.peprisk.risk == 2
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
                          customerReport?.loanInfo[0]?.peprisk == undefined
                            ? ''
                            : customerReport?.loanInfo[0]?.peprisk.risk == 1
                            ? '#FFF'
                            : customerReport?.loanInfo[0]?.peprisk == undefined
                            ? ''
                            : customerReport?.loanInfo[0]?.peprisk.risk == 2
                            ? '#000'
                            : '#FFF',
                      }}
                      text={
                        customerReport?.loanInfo[0]?.peprisk == undefined
                          ? ''
                          : customerReport?.loanInfo[0]?.peprisk.risk == 1
                          ? 'Low'
                          : customerReport?.loanInfo[0]?.peprisk == undefined
                          ? ''
                          : customerReport?.loanInfo[0]?.peprisk.risk == 2
                          ? 'Medium'
                          : 'High'
                      }></TextView>
                  </View>
                </View>
              </View>
              <View style={styles.row2}>
                <NameAndTitle
                  style={{flex: 1}}
                  title={'Loan Utilization Risk(Loan UBO)'}
                  value={
                    customerReport?.loanInfo[0]?.loanUtilizationrisk ==
                    undefined
                      ? 'None'
                      : customerReport?.loanInfo[0]?.loanUtilizationrisk.name
                  }></NameAndTitle>
                <View
                  style={{
                    width: width / 2.5,
                    height: 55,
                    paddingLeft: 0,
                    marginTop: 10,
                    justifyContent: 'center',
                    left: 35,
                  }}>
                  <TextView
                    type={'Light'}
                    style={{textAlign: 'center'}}
                    text="Risk Profiling"></TextView>
                  <View
                    style={{
                      alignSelf: 'center',
                      backgroundColor:
                        customerReport?.loanInfo[0]?.loanUtilizationrisk ==
                        undefined
                          ? ''
                          : customerReport?.loanInfo[0]?.loanUtilizationrisk
                              .risk == 1
                          ? 'green'
                          : customerReport?.loanInfo[0]?.loanUtilizationrisk ==
                            undefined
                          ? ''
                          : customerReport?.loanInfo[0]?.loanUtilizationrisk
                              .risk == 2
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
                          customerReport?.loanInfo[0]?.loanUtilizationrisk ==
                          undefined
                            ? ''
                            : customerReport?.loanInfo[0]?.loanUtilizationrisk
                                .risk == 1
                            ? '#FFF'
                            : customerReport?.loanInfo[0]
                                ?.loanUtilizationrisk == undefined
                            ? ''
                            : customerReport?.loanInfo[0]?.loanUtilizationrisk
                                .risk == 2
                            ? '#000'
                            : '#FFF',
                      }}
                      text={
                        customerReport?.loanInfo[0]?.loanUtilizationrisk ==
                        undefined
                          ? ''
                          : customerReport?.loanInfo[0]?.loanUtilizationrisk
                              .risk == 1
                          ? 'Low'
                          : customerReport?.loanInfo[0]?.loanUtilizationrisk ==
                            undefined
                          ? ''
                          : customerReport?.loanInfo[0]?.loanUtilizationrisk
                              .risk == 2
                          ? 'Medium'
                          : 'High'
                      }></TextView>
                  </View>
                </View>
              </View>
              <View style={styles.row2}>
                {customerReport?.loanInfo[0]?.loanUtilizationrisk !=
                  undefined &&
                customerReport?.loanInfo[0]?.loanUtilizationrisk.risk > 1 ? (
                  <NameAndTitle
                    title={'Dealer Name'}
                    value={
                      customerReport?.loanInfo[0]?.loanUtilizationriskname.value
                    }></NameAndTitle>
                ) : (
                  <></>
                )}
                {customerReport?.loanInfo[0]?.loanUtilizationrisk !=
                  undefined &&
                customerReport?.loanInfo[0]?.loanUtilizationrisk.risk > 1 ? (
                  <NameAndTitle
                    title={'Father/Husband Name'}
                    value={
                      customerReport?.loanInfo[0]
                        ?.loanUtilizationriskfatherHusbandName.value
                    }></NameAndTitle>
                ) : (
                  <></>
                )}
              </View>
              <View style={styles.row2}>
                {customerReport?.loanInfo[0]?.loanUtilizationrisk !=
                  undefined &&
                customerReport?.loanInfo[0]?.loanUtilizationrisk.risk > 1 ? (
                  <NameAndTitle
                    title={'CNIC'}
                    value={
                      customerReport?.loanInfo[0]?.loanUtilizationriskcnic.value
                    }></NameAndTitle>
                ) : (
                  <></>
                )}
              </View>
              <View style={styles.row2}>
                <NameAndTitle
                  style={{flex: 1}}
                  title={'Borrow Risk Profile'}></NameAndTitle>
                <View
                  style={{
                    width: width / 2.5,
                    height: 55,
                    paddingLeft: 0,
                    marginTop: 10,
                    justifyContent: 'center',
                    left: 45,
                  }}>
                  <TextView
                    type={'Light'}
                    style={{textAlign: 'center'}}
                    text="Risk Profiling"></TextView>
                  <View
                    style={{
                      alignSelf: 'center',
                      backgroundColor:
                        customerReport?.loanInfo[0]?.borrowerriskprofile ==
                        undefined
                          ? ''
                          : customerReport?.loanInfo[0]?.borrowerriskprofile
                              .risk == 1
                          ? 'green'
                          : customerReport?.loanInfo[0]?.borrowerriskprofile ==
                            undefined
                          ? ''
                          : customerReport?.loanInfo[0]?.borrowerriskprofile
                              .risk == 2
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
                          customerReport?.loanInfo[0]?.borrowerriskprofile ==
                          undefined
                            ? ''
                            : customerReport?.loanInfo[0]?.borrowerriskprofile
                                .risk == 1
                            ? '#FFF'
                            : customerReport?.loanInfo[0]
                                ?.borrowerriskprofile == undefined
                            ? ''
                            : customerReport?.loanInfo[0]?.borrowerriskprofile
                                .risk == 2
                            ? '#000'
                            : '#FFF',
                      }}
                      text={
                        customerReport?.loanInfo[0]?.borrowerriskprofile ==
                        undefined
                          ? ''
                          : customerReport?.loanInfo[0]?.borrowerriskprofile
                              .risk == 1
                          ? 'Low'
                          : customerReport?.loanInfo[0]?.borrowerriskprofile ==
                            undefined
                          ? ''
                          : customerReport?.loanInfo[0]?.borrowerriskprofile
                              .risk == 2
                          ? 'Medium'
                          : 'High'
                      }></TextView>
                  </View>
                </View>
              </View>
              <View style={styles.row3}>
                {customerReport?.loanInfo[0]?.geographicrisk != undefined &&
                customerReport?.loanInfo[0]?.geographicrisk.risk > 1 ? (
                  <NameAndTitle
                    title={'Geographical Risk Remarks'}
                    value={
                      customerReport?.loanInfo[0]?.geographicriskRemarks.value
                    }></NameAndTitle>
                ) : (
                  <></>
                )}
                {customerReport?.loanInfo[0]?.customerandproductrisk !=
                  undefined &&
                customerReport?.loanInfo[0]?.customerandproductrisk.risk > 1 ? (
                  <NameAndTitle
                    title={'Customer Product Risk Remarks'}
                    value={
                      customerReport?.loanInfo[0]?.customerandProductriskRemarks
                        .value
                    }></NameAndTitle>
                ) : (
                  <></>
                )}
              </View>
              <View style={styles.row2}>
                {customerReport?.loanInfo[0]?.peprisk != undefined &&
                customerReport?.loanInfo[0]?.peprisk.risk > 1 ? (
                  <NameAndTitle
                    title={'PEP Risk Remarks'}
                    value={
                      customerReport?.loanInfo[0]?.pepriskRemakrs.value
                    }></NameAndTitle>
                ) : (
                  <></>
                )}
                {customerReport?.loanInfo[0]?.loanUtilizationrisk !=
                  undefined &&
                customerReport?.loanInfo[0]?.loanUtilizationrisk.risk > 1 ? (
                  <NameAndTitle
                    title={'Loan Utilization Risk Remarks'}
                    value={
                      customerReport?.loanInfo[0]?.loanUtilizationriskRemarks
                        .value
                    }></NameAndTitle>
                ) : (
                  <></>
                )}
              </View>
            </View>
          )}
        </View>
        {/* {***********************************ESM Product Wise Risk Profiling****************************************} */}
        <View style={{padding: 5}}>
          <TouchableOpacity
            onPressIn={_customerTab10}
            style={[styles.reportheader]}>
            <TextView
              type={'Light'}
              text="ESM Product Wise Risk Profiling"
              style={{color: Colors.white}}></TextView>
            <Pressable onPressIn={_customerTab10}>
              {activeTab == 10 ? (
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
          {activeTab == 10 && (
            <View style={{padding: 5}}>
              <View style={styles.row2}>
                <NameAndTitle
                  style={{flex: 1}}
                  title={'ECM Risks'}
                  value={
                    customerReport?.loanInfo[0]?.EsmProductRisk == undefined
                      ? 'None'
                      : customerReport?.loanInfo[0]?.EsmProductRisk
                  }></NameAndTitle>
              </View>
            </View>
          )}
        </View>
        {/* {***********************************E-Versis****************************************} */}
        <View style={{padding: 5}}>
          <TouchableOpacity
            onPressIn={_customerTab11}
            style={[styles.reportheader]}>
            <TextView
              type={'Light'}
              text="E-Versis"
              style={{color: Colors.white}}></TextView>
            <Pressable onPressIn={_customerTab11}>
              {activeTab == 11 ? (
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
          {activeTab == 11 && (
            <View style={{padding: 5}}>
              <View style={styles.row4}>
                {customerReport?.customerInfo[0]?.evrisys_customerImage ==
                undefined ? (
                  <MaterialCommunityIcons
                    style={{alignSelf: 'center'}}
                    name="google-photos"
                    size={56}></MaterialCommunityIcons>
                ) : (
                  <ZoomableImage
                    images={`data:image/gif;base64,${customerReport?.customerInfo[0]?.evrisys_customerImage}`}
                  />
                )}
              </View>
            </View>
          )}
        </View>
        {/* {***********************************Documents Images****************************************} */}
        <View style={{padding: 5}}>
          <TouchableOpacity
            onPressIn={_customerTab12}
            style={[styles.reportheader]}>
            <TextView
              type={'Light'}
              text="Documents Images"
              style={{color: Colors.white}}></TextView>
            <Pressable onPressIn={_customerTab12}>
              {activeTab == 12 ? (
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
          {activeTab == 12 && (
            <View style={{padding: 5}}>
              <View style={styles.bounceview}>
                <FlatList
                  data={customerReport?.loanInfo[0].loan_customerImage}
                  renderItem={item => renderDocsItems(item.item, item.index)}
                  keyExtractor={item => item.id}
                  numColumns={2}
                />
              </View>
            </View>
          )}
        </View>
        {/* {***********************************Documents Images****************************************} */}

        <View style={{padding: 5}}>
          <TouchableOpacity
            onPressIn={_customerTab13}
            style={[styles.reportheader]}>
            <TextView
              type={'Light'}
              text="Proverty Score Card"
              style={{color: Colors.white}}></TextView>
            <Pressable onPressIn={_customerTab13}>
              {activeTab == 13 ? (
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
          {activeTab == 13 && (
            <View style={{padding: 5}}>
              {/* <TextView style={styles.mainHeading} text={"Proverty Score Card"} /> */}
              <View style={styles.row2}>
                <QuestionView
                  text={questionArray[0].Question}
                  label={customerReport?.loanInfo[0]?.questionsno1}
                />
              </View>
              <View style={styles.row2}>
                <QuestionView
                  text={questionArray[1].Question}
                  label={customerReport?.loanInfo[0]?.questionsno2}
                />
              </View>
              <View style={styles.row2}>
                <QuestionView
                  text={questionArray[2].Question}
                  label={customerReport?.loanInfo[0]?.questionsno3}
                />
              </View>
              <View style={styles.row2}>
                <QuestionView
                  text={questionArray[4].Question}
                  label={customerReport?.loanInfo[0]?.questionsno5}
                />
              </View>
              <View style={styles.row2}>
                <QuestionView
                  text={questionArray[5].Question}
                  label={customerReport?.loanInfo[0]?.questionsno6}
                />
              </View>
              <View style={styles.row2}>
                <QuestionView
                  text={questionArray[6].Question}
                  label={customerReport?.loanInfo[0]?.questionsno7}
                />
              </View>
              <View style={styles.row2}>
                <QuestionView
                  text={questionArray[7].Question}
                  label={customerReport?.loanInfo[0]?.questionsno8}
                />
              </View>
              <View style={styles.row2}>
                <QuestionView
                  text={questionArray[8].Question}
                  label={customerReport?.loanInfo[0]?.questionsno9}
                />
              </View>
              <View style={styles.row2}>
                <QuestionView
                  text={questionArray[9].Question}
                  label={customerReport?.loanInfo[0]?.questionsno10}
                />
              </View>
              <View style={styles.row2}>
                <QuestionView
                  text={questionArray[10].Question}
                  label={customerReport?.loanInfo[11]?.questionsno11}
                />
              </View>
              <View style={styles.row2}>
                <QuestionView
                  text={questionArray[11].Question}
                  label={customerReport?.loanInfo[12]?.questionsno12}
                />
              </View>
            </View>
          )}
        </View>
        {/* ****************************************** Asset **********************************  */}
        <View style={styles.row}>
          <View
            style={{
              width: 50,
              height: 50,
              borderRadius: 50,
              borderColor: '#cdcdcd',
              borderWidth: 1,
              justifyContent: 'center',
            }}>
            <Fontisto
              name="bar-chart"
              color={Colors.parrotGreenColor}
              size={20}
              style={{alignSelf: 'center'}}
            />
          </View>
          <TextView
            style={[styles.mainHeading2, {flex: 1}]}
            text={'Asset'}></TextView>
        </View>
        <View style={{padding: 5}}>
          <TouchableOpacity
            onPressIn={_customerTab14}
            style={[styles.reportheader]}>
            <TextView
              type={'Light'}
              text="Assets Information"
              style={{color: Colors.white}}></TextView>
            <Pressable onPressIn={_customerTab14}>
              {activeTab == 14 ? (
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
          {activeTab == 14 && (
            <SwipeListView
              style={{}}
              data={customerReport?.assestsInfo}
              renderItem={renderAssetsItem}
              renderHiddenItem={(item, index) => (
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    marginLeft: 20,
                    marginRight: 0,
                    marginTop: 20,
                  }}>
                  <View style={{flex: 1}}></View>
                  <View style={{}}>
                    <TouchableOpacity
                      onPress={() => {
                        if (item.index == 0) {
                          return;
                        }
                        index[item.item.key].closeRow();
                        // let get = allDataobj;
                        // get.assestsInfo[item.index].activeTab = false;
                        // setAlldataobj({...get});

                        //   let get2 = allDataobj;
                        //   get2.assestsInfo.splice(item.index, 1);
                        //   setAlldataobj({ ...get2 });
                      }}></TouchableOpacity>
                  </View>
                </View>
              )}
              // rightOpenValue={-75}
            />
          )}
        </View>
        {/* ****************************************** Family Member **********************************  */}
        <View style={styles.row}>
          <View
            style={{
              width: 50,
              height: 50,
              borderRadius: 50,
              borderColor: '#cdcdcd',
              borderWidth: 1,
              justifyContent: 'center',
            }}>
            <Fontisto
              name="persons"
              color={Colors.parrotGreenColor}
              size={20}
              style={{alignSelf: 'center'}}
            />
          </View>
          <TextView
            style={[styles.mainHeading2, {flex: 1}]}
            text={'Family Member'}></TextView>
        </View>
        <View style={{padding: 5}}>
          <TouchableOpacity
            onPressIn={_customerTab15}
            style={[styles.reportheader]}>
            <TextView
              type={'Light'}
              text="Family Member Information"
              style={{color: Colors.white}}></TextView>
            <Pressable onPressIn={_customerTab15}>
              {activeTab == 15 ? (
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
          {activeTab == 15 && (
            <SwipeListView
              style={{}}
              data={customerReport?.familyMemberInfo}
              renderItem={renderfamilyMemberItem}
              renderHiddenItem={(item, index) => (
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    marginLeft: 20,
                    marginRight: 0,
                    marginTop: 20,
                  }}>
                  <View style={{flex: 1}}></View>
                  <View style={{}}>
                    <TouchableOpacity
                      onPress={() => {
                        if (item.index == 0) {
                          return;
                        }
                        index[item.item.key].closeRow();
                        // let get = allDataobj;
                        // get.assestsInfo[item.index].activeTab = false;
                        // setAlldataobj({...get});

                        //   let get2 = allDataobj;
                        //   get2.assestsInfo.splice(item.index, 1);
                        //   setAlldataobj({ ...get2 });
                      }}></TouchableOpacity>
                  </View>
                </View>
              )}
              // rightOpenValue={-75}
            />
          )}
        </View>

        {/* ****************************************** Guaranteer **********************************  */}
        <View style={styles.row}>
          <View
            style={{
              width: 50,
              height: 50,
              borderRadius: 50,
              borderColor: '#cdcdcd',
              borderWidth: 1,
              justifyContent: 'center',
            }}>
            <Fontisto
              name="wallet"
              color={Colors.parrotGreenColor}
              size={20}
              style={{alignSelf: 'center'}}
            />
          </View>
          <TextView
            style={[styles.mainHeading2, {flex: 1}]}
            text={'Guaranteer'}></TextView>
        </View>
        <View style={{padding: 5}}>
          <TouchableOpacity
            onPressIn={_customerTab16}
            style={[styles.reportheader]}>
            <TextView
              type={'Light'}
              text="Guaranteer Information"
              style={{color: Colors.white}}></TextView>
            <Pressable onPressIn={_customerTab16}>
              {activeTab == 16 ? (
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
          {activeTab == 16 && (
            <SwipeListView
              style={{}}
              data={customerReport?.guarantorInfo}
              renderItem={renderGuaranteerItem}
              renderHiddenItem={(item, index) => (
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    marginLeft: 20,
                    marginRight: 0,
                    marginTop: 20,
                  }}>
                  <View style={{flex: 1}}></View>
                  <View style={{}}>
                    <TouchableOpacity
                      onPress={() => {
                        if (item.index == 0) {
                          return;
                        }
                        index[item.item.key].closeRow();
                        // let get = allDataobj;
                        // get.assestsInfo[item.index].activeTab = false;
                        // setAlldataobj({...get});

                        //   let get2 = allDataobj;
                        //   get2.assestsInfo.splice(item.index, 1);
                        //   setAlldataobj({ ...get2 });
                      }}></TouchableOpacity>
                  </View>
                </View>
              )}
              // rightOpenValue={-75}
            />
          )}
        </View>
      </View>
    </ScrollView>
  );
};
export default memo(CustomeerViews);
const styles = StyleSheet.create({
  main: {flex: 1},
  row: {flexDirection: 'row', alignItems: 'center'},
  row2: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 10,
    marginLeft: 1,
    marginTop: 10,
  },
  row3: {
    flexDirection: 'column',
    marginRight: 10,
    marginLeft: 10,
    marginTop: 0,
  },
  row4: {flexDirection: 'row', alignSelf: 'center', marginLeft: 10},
  text1: {
    fontSize: 12,
    color: '#7d7d7d',
    marginLeft: 10,
    marginRight: 10,
    fontWeight: 'bold',
  },
  text3: {fontSize: 12, color: '#7d7d7d', marginLeft: 10, marginRight: 10},
  text2: {
    fontSize: 12,
    color: '#000',
    marginLeft: 10,
    marginRight: 10,
    fontWeight: 'bold',
  },
  text4: {
    textAlign: 'center',
    fontSize: 12,
    color: '#000',
    marginLeft: 20,
    marginRight: 20,
    marginTop: 20,
    marginBottom: 20,
    fontWeight: 'bold',
  },
  text5: {
    fontSize: 12,
    color: '#000',
    marginLeft: 10,
    marginRight: 10,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  text6: {
    fontSize: 12,
    color: '#000',
    marginLeft: 10,
    marginRight: 10,
    fontWeight: 'bold',
  },
  text7: {
    fontSize: 12,
    color: '#000',
    marginLeft: 10,
    marginRight: 10,
    fontWeight: 'bold',
  },

  image: {
    height: 50,
    width: 50,
    marginRight: 10,
    resizeMode: 'contain',
    marginBottom: 10,
  },
  line: {
    backgroundColor: '#e3e3e3',
    height: 2,
    marginLeft: 10,
    marginRight: 10,
    marginTop: 10,
    borderRadius: 10,
  },
  box: {
    borderRadius: 1,
    elevation: 3,
    paddingBottom: 5,
    backgroundColor: '#FFF',
    borderWidth: 1,
    borderColor: '#7d7d7d',
    margin: 10,
  },
  textWith: {
    width: Dimensions.get('screen').width / 8,
    borderRightWidth: 1,
    borderColor: '#000',
    paddingRight: 5,
  },
  textWith2: {
    width: Dimensions.get('screen').width / 8,
    borderRightWidth: 1,
    borderColor: '#000',
    paddingRight: 5,
  },
  mainHeading: {
    fontSize: 12,
    backgroundColor: '#130C52',
    color: '#fff',
    fontWeight: 'bold',
    padding: 5,
  },
  mainHeading2: {
    fontSize: 12,
    backgroundColor: '#130C52',
    color: '#fff',
    fontWeight: 'bold',
    padding: 10,
  },
  textHeading: {
    color: Colors.darkGreenColor,
    alignSelf: 'center',
    fontSize: 14,
    borderBottomColor: Colors.darkGreenColor,
    borderBottomWidth: 0.5,
    paddingBottom: 3,
    marginBottom: 30,
    marginTop: 10,
  },
  reportheader: {
    flexDirection: 'row',
    elevation: 1,
    alignItems: 'center',
    backgroundColor: Colors.kulfa,
    justifyContent: 'space-between',
    padding: 8,
    borderRadius: 8,
    height: 40,
  },
  bounceview: GlobalStyles.bounceview,
});
