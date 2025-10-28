import React, { memo } from 'react';
import type { Node } from 'react';
import {
  View,
  Pressable,
  KeyboardAvoidingView,
  StyleSheet,
  Dimensions,
  ScrollView,
  Image,
  SafeAreaView,
} from 'react-native';
import {
  DateSelector,
  FormInputs,
  Tabsitems,
  TextView,
  CustomRadio,
  BottomButton,
} from '../../components';
import { Checkbox } from 'react-native-paper';
import { connect, useSelector } from 'react-redux';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import * as Animatable from 'react-native-animatable';
import Dropdownlist from '../../components/Dropdownlist';
const { height, width } = Dimensions.get('window');
import { NativeModules, TouchableOpacity } from 'react-native';
const { FingerModule } = NativeModules;
import ImagePicker from 'react-native-image-crop-picker';
import SelectPhotosDialoge from '../../components/SelectPhotosDialoge';
import { CustomGetDataModule } from '../../utilis/RequiredArrays';
import { SwipeListView, SwipeRow } from 'react-native-swipe-list-view';
import { Colors, GlobalStyles } from '../../theme';
import Toast from '../../components/Toast';
import { useDispatch } from "react-redux";
import { insertAndDeleteTempForms, updateCustomerFromDatawithLoanForm } from '../../sqlite/sqlitedb';
const Familymembers: () => Node = (props) => {
  const fromData = useSelector((state) => state.FormsReducer);
  const UpdateReducer = useSelector((state) => state.UpdateReducer);
  var updateCheck = UpdateReducer.updateCheck.value
  const TempFormReducer = useSelector(state => state.TempFormReducer)
  var updateCheckTemp = TempFormReducer.tempForm.value;
  const CustomGetDataModule = useSelector(state => state.RequiredReducer.CustomGetDataModule);
  const [toast, setToast] = React.useState({ value: "", type: "" });

  const [allDataobj, setAlldataobj] = React.useState(updateCheck ? props.item : updateCheckTemp ? props.item : CustomGetDataModule);
  const DataArray = allDataobj != undefined ? allDataobj.familyMemberInfo : [];
  const dispatch = useDispatch();
  const [UserData, setUserData] = React.useState(undefined);
  const getUserData = useSelector((state) => state.UserData);
  var regex = /^[a-zA-Z ]*$/;
  let speacial = /[^a-zA-Z0-9-]/g;
  var numericandAlphabets = new RegExp(/^[a-zA-Z0-9 ]+$/);

  React.useEffect(async () => {

    setUserData(getUserData);
  }, []);
  const _addNewAssets = () => {
    var get = allDataobj;
    get.familyMemberInfo.splice(0, 0, {
      key: Math.random(),
      activeTab: false,
      familyMember_fullname: { value: '', error: false },
      familyMember_cnic: { value: '', error: false },
      familyMember_relation: { value: '', error: false },
      familyMember_age: { value: '', error: false },
      familyMember_education: { value: '', error: false },
      familyMember_montlyEarning: { value: '', error: false },
      familyMember_sourceIncome: { value: '', error: false },
      familyMember_businessAddress: { value: '', error: false },
      familyMember_genderSelection: { value: '', error: false },
    });
    // get.familyMemberInfo.push()
    setAlldataobj({ ...get });
  };
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
      if (DataArray[i].familyMember_fullname.value == '') {
        let get = allDataobj;
        get.familyMemberInfo[i].familyMember_fullname.error = true;
        get.familyMemberInfo[i].activeTab = true;

        setAlldataobj({ ...get });
        fullnameerror = false;
      } else {
        let get = allDataobj;
        get.familyMemberInfo[i].familyMember_fullname.error = false;
        setAlldataobj({ ...get });
      }
      if (DataArray[i].familyMember_cnic.value == '') {
        let get = allDataobj;
        get.familyMemberInfo[i].familyMember_cnic.error = true;
        get.familyMemberInfo[i].activeTab = true;

        setAlldataobj({ ...get });
        cnincerror = false;
      } else {
        let get = allDataobj;
        get.familyMemberInfo[i].familyMember_cnic.error = false;

        setAlldataobj({ ...get });
      }
      if (DataArray[i].familyMember_cnic.value.length < 15 || DataArray[i].familyMember_cnic.value == "00000-0000000-0") {
        let get = allDataobj;
        get.familyMemberInfo[i].familyMember_cnic.error = true;
        get.familyMemberInfo[i].activeTab = true;
        setAlldataobj({ ...get });
        setToast({
          type: "error",
          message: 'Please put valid Cnic Number',
        });
        cnincerror = false;
      } else {
        let get = allDataobj;
        get.familyMemberInfo[i].familyMember_cnic.error = false;

        setAlldataobj({ ...get });
      }
      if (DataArray[i].familyMember_relation.value == '') {
        let get = allDataobj;
        get.familyMemberInfo[i].familyMember_relation.error = true;
        get.familyMemberInfo[i].activeTab = true;

        setAlldataobj({ ...get });
        relationerror = false;
      } else {
        let get = allDataobj;
        get.familyMemberInfo[i].familyMember_relation.error = false;
        setAlldataobj({ ...get });
      }
      if (DataArray[i].familyMember_age.value == '') {
        let get = allDataobj;
        get.familyMemberInfo[i].familyMember_age.error = true;
        get.familyMemberInfo[i].activeTab = true;

        setAlldataobj({ ...get });
        ageerror = false;
      } else {
        let get = allDataobj;
        get.familyMemberInfo[i].familyMember_age.error = false;
        setAlldataobj({ ...get });
      }
      if (DataArray[i].familyMember_education.value == '') {
        let get = allDataobj;
        get.familyMemberInfo[i].familyMember_education.error = true;
        get.familyMemberInfo[i].activeTab = true;

        setAlldataobj({ ...get });
        eduerror = false;
      } else {
        let get = allDataobj;
        get.familyMemberInfo[i].familyMember_education.error = false;
        setAlldataobj({ ...get });
      }
      if (DataArray[i].familyMember_montlyEarning.value == '') {
        let get = allDataobj;
        get.familyMemberInfo[i].familyMember_montlyEarning.error = true;
        get.familyMemberInfo[i].activeTab = true;

        setAlldataobj({ ...get });
        monthlyerror = false;
      } else {
        let get = allDataobj;
        get.familyMemberInfo[i].familyMember_montlyEarning.error = false;
        setAlldataobj({ ...get });
      }
      if (DataArray[i].familyMember_sourceIncome.value == '') {
        let get = allDataobj;
        get.familyMemberInfo[i].familyMember_sourceIncome.error = true;
        get.familyMemberInfo[i].activeTab = true;

        setAlldataobj({ ...get });
        souceincomerror = false;
      } else {
        let get = allDataobj;
        get.familyMemberInfo[i].familyMember_sourceIncome.error = false;
        setAlldataobj({ ...get });
      }
      if (DataArray[i].familyMember_genderSelection.value == '') {
        let get = allDataobj;
        get.familyMemberInfo[i].activeTab = true;
        setToast({
          type: "error",
          message: 'Select Gender of family Member',
        });
        setAlldataobj({ ...get });
        gendererror = false;
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
      finalDataobj.familyMemberInfo = DataArray;
      if (!updateCheck) {
        insertAndDeleteTempForms(finalDataobj.customerInfo[0].customer_cnicNumber.value, JSON.stringify(finalDataobj));
      }

      updateCustomerFromDatawithLoanForm(JSON.stringify(finalDataobj), finalDataobj.loanInfo[0].customerLoan_type.index, updateCheck ? UpdateReducer.updateCheck.id : finalDataobj.customerInfo[0].resetId);

      props.UpdateUserData(finalDataobj)

      props.onPressNext();
    }
  };
  const renderItem = ({ item, index }) => (
    <View style={[styles.box, { marginBottom: index == DataArray.length - 1 ? 10 : 0 }]}>

      <Pressable
        onPressIn={() => {
          let get = allDataobj;
          get.familyMemberInfo[index].activeTab = get.familyMemberInfo[index]
            .activeTab
            ? false
            : true;
          setAlldataobj({ ...get });
        }} style={styles.buttomheader}>
        <TextView
          type={'Light'}
          text="Family Member Information"
          style={{ color: Colors.white }}></TextView>
        <Pressable
          onPressIn={() => {
            let get = allDataobj;
            get.familyMemberInfo[index].activeTab = get.familyMemberInfo[index]
              .activeTab
              ? false
              : true;
            setAlldataobj({ ...get });
          }}>
          {item.activeTab ? (
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

      {item.activeTab && (
        <View style={styles.bounceview}>
          <View style={styles.row2}>
            <FormInputs
              text={'Full Name'}
              required={true}
              error={item.familyMember_fullname.error}
              value={item.familyMember_fullname.value}
              onChangeText={(value: string) => {
                if (!regex.test(value)) {
                  return
                }
                let get = allDataobj;
                get.familyMemberInfo[index].familyMember_fullname.value = value;
                setAlldataobj({ ...get });
              }}></FormInputs>

            <FormInputs
              keyboardtype={'number-pad'}
              text={'CNIC Number'}
              required={true}
              error={item.familyMember_cnic.error}
              value={item.familyMember_cnic.value}
              onChangeText={(value: string) => {
                if (speacial.test(value)) {
                  return
                }
                var regexp = new RegExp('^[0-9+]{5}-[0-9+]{7}-[0-9]{1}$');
                if (value.length < 16) {
                  if (value.length == 5 || value.length == 13) {
                    let get = allDataobj;
                    get.familyMemberInfo[index].familyMember_cnic.value =
                      value + '-';
                    get.familyMemberInfo[index].familyMember_cnic.error = !regexp.test(value) ? true : false
                    setAlldataobj({ ...get });
                  } else {
                    let get = allDataobj;
                    get.familyMemberInfo[index].familyMember_cnic.value = value;
                    get.familyMemberInfo[index].familyMember_cnic.error = !regexp.test(value) ? true : false
                    setAlldataobj({ ...get });
                  }
                }
              }}
              clearDataButton={true}
              clearText={() => {
                let get = allDataobj;
                get.familyMemberInfo[index].familyMember_cnic.value = ""

                setAlldataobj({ ...get });
              }}
            ></FormInputs>
          </View>
          <View style={styles.row2}>
            <FormInputs
              text={'Relation'}
              required={true}
              error={item.familyMember_relation.error}
              value={item.familyMember_relation.value}
              onChangeText={(value: string) => {
                if (!regex.test(value)) {
                  return
                }
                let get = allDataobj;
                get.familyMemberInfo[index].familyMember_relation.value = value;
                setAlldataobj({ ...get });
              }}></FormInputs>
            <FormInputs
              text={'Age'}
              required={true}
              error={item.familyMember_age.error}
              value={item.familyMember_age.value}
              onChangeText={(value: string) => {
                if (!numericandAlphabets.test(value)) {
                  return
                }
                let get = allDataobj;
                get.familyMemberInfo[index].familyMember_age.value = value;
                setAlldataobj({ ...get });
              }}></FormInputs>
          </View>
          <View style={styles.row2}>
            <FormInputs
              text={'Education'}
              required={true}
              error={item.familyMember_education.error}
              value={item.familyMember_education.value}
              onChangeText={(value: string) => {
                if (!numericandAlphabets.test(value)) {
                  return
                }
                let get = allDataobj;
                get.familyMemberInfo[index].familyMember_education.value =
                  value;
                setAlldataobj({ ...get });
              }}></FormInputs>
            <FormInputs
              text={'Monthly Earning'}
              required={true}
              keyboardtype={'number-pad'}
              error={item.familyMember_montlyEarning.error}
              value={item.familyMember_montlyEarning.value}
              onChangeText={(value: string) => {
                if (!numericandAlphabets.test(value)) {
                  return
                }
                let get = allDataobj;
                get.familyMemberInfo[index].familyMember_montlyEarning.value =
                  value;
                setAlldataobj({ ...get });
              }}></FormInputs>
          </View>
          <View style={styles.row2}>
            <FormInputs
              text={'Source of Income'}
              required={true}
              error={item.familyMember_sourceIncome.error}
              value={item.familyMember_sourceIncome.value}
              onChangeText={(value: string) => {
                if (!numericandAlphabets.test(value)) {
                  return
                }
                let get = allDataobj;
                get.familyMemberInfo[index].familyMember_sourceIncome.value =
                  value;
                setAlldataobj({ ...get });
              }}></FormInputs>
            <FormInputs
              text={'Business Address'}
              error={item.familyMember_businessAddress.error}
              value={item.familyMember_businessAddress.value}
              onChangeText={(value: string) => {
                let get = allDataobj;
                get.familyMemberInfo[index].familyMember_businessAddress.value =
                  value;
                setAlldataobj({ ...get });
              }}></FormInputs>
          </View>
          <View style={styles.row2}>
            <CustomRadio
              twofield={3}
              required={true}
              title="Gender Selection"
              firstoption="Male"
              secondoption="Female"
              thirdoption="Transgender"
              variable={4}
              setAlldataobj={setAlldataobj}
              allDataobj={allDataobj}
              array_index={index}></CustomRadio>
          </View>
        </View>
      )}
    </View>
  );
  return (
    <SafeAreaView>
      <ScrollView showsVerticalScrollIndicator={false}>
        <KeyboardAvoidingView behavior="padding">
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
                <TextView text={''} style={{}}></TextView>
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
                    flexDirection: 'row',
                    alignItems: 'center',
                    marginLeft: 20,
                    marginRight: 0,
                    marginTop: 20,
                  }}>
                  <View style={{ flex: 1 }}></View>
                  <View style={{}}>
                    <TouchableOpacity
                      onPress={() => {
                        index[item.item.key].closeRow();
                        // let get = allDataobj;
                        // get.familyMemberInfo[item.index].activeTab = false;
                        // setAlldataobj({...get});

                        let get2 = allDataobj;
                        get2.familyMemberInfo.splice(item.index, 1);
                        setAlldataobj({ ...get2 });
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

            <BottomButton
              onPressNext={_onClickNext}
              onPressPrev={props.onPressPrev}
              show={2}></BottomButton>
          </View>
        </KeyboardAvoidingView>
      </ScrollView>
      <Toast {...toast} onDismiss={() => setToast({ message: "", type: "" })} />
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
  };
};
export default connect(null, mapDispatchToProps)(memo(Familymembers));
const styles = StyleSheet.create({
  row2: {
    marginTop: 0,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  text: {},
  addnewButton: {
    backgroundColor: '#FFF',
    height: 40,
    elevation: 15,
    width: 50,
    borderRadius: 10,
    justifyContent: 'center',
  },
  bounceview: GlobalStyles.bounceview,
  buttomheader: GlobalStyles.buttomheader,
  box: GlobalStyles.box
});
