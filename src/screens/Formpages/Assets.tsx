import React, { memo, useRef, useEffect, useState } from 'react';
import type { Node } from 'react';
import {
  View,
  Pressable,
  Text,
  StyleSheet,
  Dimensions,
  FlatList,
  ScrollView,
  Image,
  SafeAreaView,
  Alert,
} from 'react-native';
import {
  DateSelector,
  FormInputs,
  Tabsitems,
  TextView,
  BottomButton,
} from '../../components';
import RNFS from 'react-native-fs';

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
import { SwipeListView, SwipeRow } from "react-native-swipe-list-view";
import { Colors, GlobalStyles } from '../../theme';

import { useDispatch } from "react-redux";
import { getAssetsDocuments, getTags, insertAndDeleteTempForms, updateCustomerFromDatawithLoanForm } from '../../sqlite/sqlitedb';
import values from 'core-js/fn/array/values';
import Toast from '../../components/Toast';
import { CustomDropdown } from '../../components';
import ImageComponent from '../../components/ImageComponent';
import ImageNameList from '../../components/ImageNameList';
import { imageNames } from '../../utilis/RequiredArrays';

const Assets: () => Node = (props) => {
  const inputRef = useRef([]);
  const dispatch = useDispatch();
  const fromData = useSelector((state) => state.FormsReducer);
  const UpdateReducer = useSelector((state) => state.UpdateReducer);
  const TempFormReducer = useSelector(state => state.TempFormReducer)
  var updateCheckTemp = TempFormReducer.tempForm.value;
  var updateCheck = UpdateReducer.updateCheck.value
  const CustomGetDataModule = useSelector(state => state.RequiredReducer.CustomGetDataModule);

  const [checkedforDisable, setCheckedforDisable] = React.useState(false);
  const [activeTab, setActiveTab] = React.useState(0);
  const array_index = 0;
  const [TagsNames, setTagsName] = React.useState([])
  const [TagsId, setTagsId] = React.useState([])
  // //console.log('---dbdbdbd??',props.item.ass)
  const [sizes, setSizes] = React.useState(["Large", "Small","Tegmu App"])
  const [allDataobj, setAlldataobj] = React.useState(updateCheck ? props.item : updateCheckTemp ? props.item : CustomGetDataModule);
  const Data = allDataobj != undefined ? allDataobj.assestsInfo : [];
  const [noData, setNoData] = React.useState(false)
  const [toast, setToast] = React.useState({ value: "", type: "" });
  const [UserData, setUserData] = React.useState(undefined);
  const getUserData = useSelector((state) => state.UserData);
  const [dialog, setDialog] = React.useState({ dialog: false, index: 0,underIndex:0 });


  var regex = /^[a-zA-Z ]*$/;
  let speacial = /[^a-zA-Z0-9-]/g;
  var numericandAlphabets = new RegExp(/^[a-zA-Z0-9 ]+$/);
  
  React.useEffect(async () => {

    // let get = await AsyncStorage.getItem('@userData');
    // let parser = JSON.parse(get);
    // alert(JSON.stringify(getUserData.UserData.EmployeeTypeName))
    setUserData(getUserData);
  }, []);
  useEffect(() => {
    // //console.log("-----Formdata-------------",JSON.stringify(fromData))
    getTags(setTagsName, setNoData, setTagsId, 1);
    // if (updateCheck) {
    getAssetsDocuments(allDataobj.customerInfo[array_index].customer_cnicNumber.value, allDataobj, setAlldataobj)
    // }
  }, [])


  const _getTagsaccording = (value, index) => {
    var get = allDataobj;
    //console.log(index)
    get.assestsInfo[index].assetTagName.value = undefined
    get.assestsInfo[index].assetTagId.value = " "
    get.assestsInfo[index].assetTagSize.value = sizes[value]
    setAlldataobj({ ...get });

    getTags(setTagsName, setNoData, setTagsId, value + 1);
  }


  const _customerTab = () => {
    if (activeTab == 1) {
      setActiveTab(0);
    } else {
      setActiveTab(1);
    }
  };
  //------------------>
  const takePhoto = (index, underIndex) => {
    ImagePicker.openCamera({
      width: 300,
      height: 400,
      compressImageQuality: 0.5,
      cropping: false,
    }).then(async (image) => {
      var data = await RNFS.readFile(image.path, 'base64').then(res => { return res });
      let get = allDataobj;
      get.assestsInfo[index].assets_Image[underIndex].imgValue =
        data;
      setAlldataobj({ ...get });
    });
  };

  //this methode is getting image from gallery
  const takePhotofromGallery = (index, underIndex) => {
    ImagePicker.openPicker({
      width: 300,
      height: 400,
      cropping: false,
    }).then(async (image) => {
      var data = await RNFS.readFile(image.path, 'base64').then(res => { return res });
      let get = allDataobj;
      get.assestsInfo[index].assets_Image[underIndex].imgValue = data;
      setAlldataobj({ ...get });
    });
  };

  const pickImges = (index, underIndex) => {
    takePhotofromGallery(index, underIndex);
  };
  const capture = (index, underIndex) => {
    takePhoto(index, underIndex);
  };
  const addNewImage = (index) => {

    var get = allDataobj;
    if (get.assestsInfo[index].assets_Image.length == 3) {
      setToast({
        type: "error",
        message: "You can't upload more than 3 images!",
      });
      return
    }
    get.assestsInfo[index]
      .assets_Image.splice(0, 0, {
        key: Math.random(),
        activeTab: false,
        imgName: { value: '', error: false },
        imgValue: undefined,
      });
    // get.assestsInfo.push()
    setAlldataobj({ ...get });
  };
  const deleteImage = (index, underIndex) => {
    let len = allDataobj.assestsInfo[index].assets_Image.length
    if (len > 1) {
      let get2 = allDataobj;
      get2.assestsInfo[index].assets_Image.splice(underIndex, 1);
      setAlldataobj({ ...get2 });
    }

  }
  //------------------------------>
  function focusNextField(nextField) {
    try {
      inputRef[nextField].focus();
    } catch (e) {
      ////console.log('error=>', e);
    }
  }
  const _addNewAssets = () => {
    let get = allDataobj;
    let make = get.assestsInfo;
    make.push({
      key: Math.random(),
      activeTab: false,
      assetName: { value: "", error: false },
      assetQuantity: { value: "1", error: false },
      assetValue: { value: "", error: false },
      assetOwner: { value: allDataobj.customerInfo[array_index].customer_name.value, error: false },
      assetNote: { value: "", error: false },
      assetTagSize: { value: '', error: false },
      assetTagId: { value: '', error: false },
      assetTagName: { value: undefined, error: false },
      assets_Image: [{
        key: 1,
        activeTab: false,
        imgName: { value: '', error: false },
        imgValue: undefined,
      }],
    });
    // get.assestsInfo.push()
    setAlldataobj({ ...get })

  }
  const renderItem = ({ item, index }) => (
    console.log("Indexxxxxx=========>",index),

    <View style={[styles.box, { marginBottom: index == Data.length - 1 ? 10 : 0 }]}>

      <Pressable

        onPressIn={() => {

          let get = allDataobj;

          get.assestsInfo[index].activeTab = get.assestsInfo[index]

            .activeTab


            ? false

            : true;

          setAlldataobj({ ...get });

        }} style={styles.buttomheader}>

        <TextView

          type={'Light'}

          text="Assets Information"

          style={{ color: Colors.white }}></TextView>

        <Pressable

          onPressIn={() => {

            let get = allDataobj;

            get.assestsInfo[index].activeTab = get.assestsInfo[index].activeTab
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

              required={true}

              ref={el => (inputRef.current[1 + 'three'] = el)}

              _onSubmit={() => focusNextField(2 + 'three')}

              text={'Asset Name'}

              error={item.assetName.error}

              value={item.assetName.value}

              onChangeText={(value: string) => {
                if(!regex.test(value)){
                  return
                }
                let get = allDataobj;

                get.assestsInfo[index].assetName.value = value;

                setAlldataobj({ ...get });

              }}></FormInputs>

            <FormInputs


              required={true}

              ref={el => (inputRef.current[2 + 'three'] = el)}

              _onSubmit={() => focusNextField(3 + 'three')}

              keyboardtype={'number-pad'}

              text={'Asset Quantity'}

              editable={allDataobj.loanInfo[array_index].loanType != undefined &&

                allDataobj.loanInfo[array_index].loanType.value === "Live Stock" ? false : true}

              error={item.assetQuantity.error}

              value={item.assetQuantity.value}

              onChangeText={(value: string) => {

                let get = allDataobj;

                get.assestsInfo[index].assetQuantity.value = value;

                setAlldataobj({ ...get });
              }}></FormInputs>

          </View>

          <View style={styles.row2}>

            <FormInputs

              required={true}

              ref={el => (inputRef.current[3 + 'three'] = el)}

              _onSubmit={() => focusNextField(4 + 'three')}

              keyboardtype={'number-pad'}

              text={'Asset Value'}

              error={item.assetValue.error}

              value={item.assetValue.value}

              onChangeText={(value: string) => {

                let get = allDataobj;

                get.assestsInfo[index].assetValue.value = value;

                setAlldataobj({ ...get });

              }}></FormInputs>

            <FormInputs

              required={true}

              ref={el => (inputRef.current[4 + 'three'] = el)}

              _onSubmit={() => focusNextField(5 + 'three')}

              text={'Asset Owner'}

              error={item.assetOwner.error}

              value={item.assetOwner.value}

              onChangeText={(value: string) => {
                if (!regex.test(value)) {
                  return
                }

                let get = allDataobj;

                get.assestsInfo[index].assetOwner.value = value;


                setAlldataobj({ ...get });

              }}></FormInputs>
          </View>


          <View style={styles.row2}>

            <FormInputs

              ref={el => (inputRef.current[5 + 'three'] = el)}

              _onSubmit={() => focusNextField(6 + 'three')}

              text={'Notes'}

              error={item.assetNote.error}


              value={item.assetNote.value}

              onChangeText={(value: string) => {

                if(!numericandAlphabets.test(value)){
                  return
                }
                let get = allDataobj;

                get.assestsInfo[index].assetNote.value = value;

                setAlldataobj({ ...get });

              }}></FormInputs>

          </View>


          {allDataobj.loanInfo[array_index].loanType != undefined &&

            allDataobj.loanInfo[array_index].loanType.value === "Live Stock" &&

            <View>

              <View style={styles.row2}>

                <View style={{ marginTop: 0 }}>


                  <TextView type={'formLabel'} text={"Assets Size"}

                    style={{ color: '#737373', marginLeft: 10, width: width / 3, marginBottom: -20 }}></TextView>

                  <Dropdownlist

                    required={true}

                    data={sizes}

                    RT={2}

                    label={

                      item.assetTagSize.value == ""

                        ? 'Select Assets Size'

                        : item.assetTagSize.value

                    }

                    onSelect={(userindex, value) => {

                      // console.log("--->",userindex)
                      _getTagsaccording(userindex, index)

                    }}></Dropdownlist>

                </View>

                <View style={{ marginTop: 0 }}>


                  {item.assetTagSize.value != "Tegmu App" && <CustomDropdown

                    text={"Assets Tags"}

                    required={true}


                    tempdata={TagsNames}

                    label={
                      TagsNames[0]==null?"You don't have any asset tags, please add some tags":
                      item.assetTagName.value == undefined

                        ? 'Select Asset Tag'

                        : item.assetTagName.value

                    }


                    onSelect={(value, userindex) => {

                      let get = allDataobj;

                      get.assestsInfo[index].assetTagName.value = TagsNames[userindex];

                      get.assestsInfo[index].assetTagId.value = TagsId[userindex]

                      setAlldataobj({ ...get })

                    }}

                  />}

                </View>

              </View>
              <FlatList
                data={item.assets_Image}
                renderItem={(underitem) => renderAssetsItem(underitem.item, underitem.index, index)}
                keyExtractor={underitem => underitem.id}
                numColumns={2}
              />

            </View>
          }
        </View>
      )}
    </View>

  );
  const renderAssetsItem = (underItem, underIndex, index) => {
    return (

      <View style={{ marginBottom: 20, marginTop: 20, width: allDataobj.assestsInfo[index].assets_Image.length <= 1 ? width / 1.2 : width / 2.3 }}>

        <View

          style={{ flexDirection: 'row', alignItems: 'center' }}>

          <View style={{ flex: 1, }}><Text></Text></View>



          {underIndex == 0 && <Pressable

            style={{

              alignSelf: 'flex-end',

              width: 50,

            }}

            onPressIn={() => { addNewImage(index) }}>


            <MaterialCommunityIcons

              name="image-plus"

              size={26}

              style={{ color: '#000' }}

            />

          </Pressable>}

          <Pressable

            onPressIn={() => deleteImage(index, underIndex)}

          >
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

            marginTop: 20,

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

            {underItem.imgValue == undefined ? (
              <MaterialCommunityIcons
                style={{ alignSelf: 'center' }}
                name="google-photos"
                size={56}></MaterialCommunityIcons>
            ) : (
              <ImageComponent
                imgValue={underItem.imgValue}
                error={ underItem.imgName.error}
                value={  underItem.imgName.value}
                dropdownshow={()=>{
                  setDialog({dialog:true,index:index,underIndex:underIndex})
                }}
                onChangeText={(value: string) => {
                  let get = allDataobj;
                  allDataobj.assestsInfo[index]
                    .assets_Image[underIndex].imgName.value = value;
                  get.assestsInfo[index]
                    .assets_Image[underIndex].imgName.error = false;
                  setAlldataobj({ ...get });
                }}
              />

            )}
            {underItem.imgValue == undefined && (
              <View style={styles.customerImgconatiner}>
                {/* <Pressable
      onPressIn={() => pickImges(index,underIndex)}
      style={[
        styles.capture,
        {backgroundColor: Colors.backgroundColor},
      ]}>
      <TextView
        style={{textAlign: 'center'}}
        type={'small'}
        text="Gallery"></TextView>
    </Pressable> */}
                <Pressable
                  onPressIn={() => {
                    capture(index, underIndex);
                  }}
                  style={[
                    styles.capture,
                    { backgroundColor: Colors.backgroundColor },
                  ]}>
                  <TextView
                    style={{ textAlign: 'center' }}
                    type={'small'}
                    text="Camera"></TextView>
                </Pressable>
              </View>
            )}
          </View>
        </View>
      </View>
    );
  }
  const _onClickNext = () => {
    var assetserror = true;
    var assetsQuanterror = true;
    var assetsValueerror = true;
    var assetsOwnererror = true;
    var assetsTagsSize = true;
    var assetsTagsName = true;
    var assetsTagsId = true
    var imagetitle = true;
    var checkingSame = true;


    for (let i = 0; i < allDataobj.assestsInfo.length; i++) {
      if (Data[i].assetName.value == "") {
        let get = allDataobj;
        get.assestsInfo[i].assetName.error = true;
        get.assestsInfo[i].activeTab = true;

        setAlldataobj({ ...get });
        assetserror = false;
      } else {
        let get = allDataobj;
        get.assestsInfo[i].assetName.error = false;
        setAlldataobj({ ...get });

      }
      if (Data[i].assetQuantity.value == "") {
        let get = allDataobj;
        get.assestsInfo[i].assetQuantity.error = true;
        get.assestsInfo[i].activeTab = true;

        setAlldataobj({ ...get });
        assetsQuanterror = false;
      } else {
        let get = allDataobj;
        get.assestsInfo[i].assetQuantity.error = false;

        setAlldataobj({ ...get });

      }
      if (Data[i].assetValue.value == "") {
        let get = allDataobj;
        get.assestsInfo[i].assetValue.error = true;
        get.assestsInfo[i].activeTab = true;

        setAlldataobj({ ...get });
        assetsValueerror = false;
      } else {
        let get = allDataobj;
        get.assestsInfo[i].assetValue.error = false;
        setAlldataobj({ ...get });

      }
      if (Data[i].assetOwner.value == "") {
        let get = allDataobj;
        get.assestsInfo[i].assetOwner.error = true;
        get.assestsInfo[i].activeTab = true;

        setAlldataobj({ ...get });
        assetsOwnererror = false;
      } else {
        let get = allDataobj;
        get.assestsInfo[i].assetOwner.error = false;
        setAlldataobj({ ...get });

      }
      /////////----------------------//////////////////////
      if (allDataobj.loanInfo[array_index].loanType != undefined && allDataobj.loanInfo[array_index].loanType.value === "Live Stock" && Data[i].assetTagSize.value == undefined && Data[i].assetTagSize.value != "Tegmu App") {
        let get = allDataobj;
        get.assestsInfo[i].activeTab = true;
        setAlldataobj({ ...get });
        setToast({
          type: "error",
          message: "Please Select Assets Tag Size",
        });
        assetsTagsSize = false;
      }
      else {
        let get = allDataobj;
        get.assestsInfo[i].assetTagSize.error = false;
        setAlldataobj({ ...get });
      }
      //////////-------------------------//////
      if (allDataobj.loanInfo[array_index].loanType != undefined && allDataobj.loanInfo[array_index].loanType.value === "Live Stock" && Data[i].assetTagName.value == undefined && Data[i].assetTagSize.value != "Tegmu App") {
        let get = allDataobj;
        get.assestsInfo[i].activeTab = true;
        setAlldataobj({ ...get });
        setToast({
          type: "error",
          message: "Please Select Assets Tag",
        });
        assetsTagsName = false;
      } else {
        let get = allDataobj;
        get.assestsInfo[i].assetTagName.error = false;
        setAlldataobj({ ...get });

      }

      if (allDataobj.loanInfo[array_index].loanType != undefined && allDataobj.loanInfo[array_index].loanType.value === "Live Stock" && Data[i].assets_Image.length < 3) {
        let get = allDataobj;
        get.assestsInfo[i].activeTab = true;
        setAlldataobj({ ...get });
        setToast({
          type: "error",
          message: "Please insert at least 3 Images!",
        });
        assetsTagsName = false;
      }
      for (let j = 0; j < allDataobj.assestsInfo[i].assets_Image.length; j++) {
        if (allDataobj.assestsInfo[i].assets_Image[j].imgName.value == "") {
          let get = allDataobj;
          get.assestsInfo[i].assets_Image[j].imgName.error = true;
          setActiveTab(7)
          setAlldataobj({ ...get });
          imagetitle = false;
        } else {
          let get = allDataobj;
          get.assestsInfo[i].assets_Image[j].imgName.error = false;
          setAlldataobj({ ...get });
        }

      }

      if (allDataobj.loanInfo[array_index].loanType.value != "Live Stock") {
        let get = allDataobj;

        get.assestsInfo[i].assetTagSize.value = ""
        get.assestsInfo[i].assetTagId.value = ""
        get.assestsInfo[i].assetTagName.value = undefined
        get.assestsInfo[i].assetTagName.error = false;
        get.assestsInfo[i].assets_Image = [{
          key: 1,
          activeTab: false,
          imgName: { value: '', error: false },
          imgValue: undefined,
        }]

        setAlldataobj({ ...get });
      }

      var count = 0; ///make for count
      for (let k = 0; k < allDataobj.assestsInfo.length; k++) {

        if ( allDataobj.loanInfo[array_index].loanType.value === "Live Stock" && Data[i].assetTagSize.value != "Tegmu App" && Data[i].assetTagName.value == Data[k].assetTagName.value) {
          count++;
          if (count > 1) {
            checkingSame = false
            setToast({
              type: "error",
              message: "Sorry tags are same",
            });
          }
        }
      }



    }

    if (allDataobj.loanInfo[array_index].loanType != undefined &&

      allDataobj.loanInfo[array_index].loanType.value === "Live Stock") {
      if (assetserror && assetsQuanterror && assetsValueerror &&
        assetsOwnererror && assetsTagsName && imagetitle && checkingSame) {
        var finalDataobj = fromData.forms;
        finalDataobj.assestsInfo = Data;
        //     console.log("checkingSame", JSON.stringify(allDataobj.assestsInfo))
        // return
        if (!updateCheck) {
          insertAndDeleteTempForms(finalDataobj.customerInfo[0].customer_cnicNumber.value, JSON.stringify(finalDataobj));
        }
        updateCustomerFromDatawithLoanForm(JSON.stringify(finalDataobj), finalDataobj.loanInfo[array_index].customerLoan_type.index, updateCheck ? UpdateReducer.updateCheck.id : finalDataobj.customerInfo[array_index].resetId);

        props.UpdateUserData(finalDataobj)
        props.onPressNext();
      }
    } else {
      if (assetserror && assetsQuanterror && assetsValueerror &&
        assetsOwnererror) {
        var finalDataobj = fromData.forms;
        finalDataobj.assestsInfo = Data;
        if (!updateCheck) {
          insertAndDeleteTempForms(finalDataobj.customerInfo[0].customer_cnicNumber.value, JSON.stringify(finalDataobj));
        }
        updateCustomerFromDatawithLoanForm(JSON.stringify(finalDataobj), finalDataobj.loanInfo[array_index].customerLoan_type.index, updateCheck ? UpdateReducer.updateCheck.id : finalDataobj.customerInfo[array_index].resetId);

        props.UpdateUserData(finalDataobj)
        props.onPressNext();
      }
    }

  }
  return (
    <SafeAreaView>
      <ScrollView
        keyboardShouldPersistTaps={"always"}
        showsVerticalScrollIndicator={false}>
        {/* <KeyboardAvoidingView behavior="position"> */}
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
            {UserData != undefined && UserData.UserData.EmployeeTypeName != "Branch Manager" &&

              <Pressable onPressIn={_addNewAssets}>

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
            style={{}}
            data={allDataobj.assestsInfo}
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
                    onPress={() => {
                      if (item.index == 0) {

                        return
                      }
                      index[item.item.key].closeRow()
                      // let get = allDataobj;
                      // get.assestsInfo[item.index].activeTab = false;
                      // setAlldataobj({...get});

                      let get2 = allDataobj;
                      get2.assestsInfo.splice(item.index, 1);
                      setAlldataobj({ ...get2 });

                    }}
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
            show={2}></BottomButton>
        </View>
        {/* </KeyboardAvoidingView> */}
        <ImageNameList
          tempdata={imageNames}
          filterModal={dialog.dialog}
          onSelect={(value) => {
            let get = allDataobj;
            allDataobj.assestsInfo[dialog.index]
              .assets_Image[dialog.underIndex].imgName.value = value;
            get.assestsInfo[dialog.index]
              .assets_Image[dialog.underIndex].imgName.error = false;
            setAlldataobj({ ...get });
            setDialog({ ...dialog, dialog: false });
            setAlldataobj({ ...get });
          }}
          onClose={()=>{setDialog({...dialog,dialog:false})}}
        />
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
export default memo(connect(null, mapDispatchToProps)(memo(Assets)));
const styles = StyleSheet.create({
  row2: {
    marginTop: 0,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  text: {},
  bounceview: GlobalStyles.bounceview,
  buttomheader: GlobalStyles.buttomheader,
  box: GlobalStyles.box,
  addnewButton: {
    backgroundColor: '#FFF',
    height: 40,
    elevation: 15,
    width: 50,
    borderRadius: 10,
    justifyContent: 'center',
  },
  customerImgconatiner: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 20,
    justifyContent: 'space-around',
  },
  capture: {
    height: 30,
    width: width / 6,
    borderRadius: 30,
    justifyContent: 'center',
  },
});
