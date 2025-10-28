

import React, { useEffect, useState } from 'react';
import type { Node } from 'react';
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
  RefreshControl
} from 'react-native';
import RNFS from 'react-native-fs';
import moment from 'moment';
import { Card } from 'react-native-paper'
import { AppStatusBar, CustomerRecorditems, CustomProgressDialoge, Header, Nodata, Search, TextView } from '../../components';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Entypo from 'react-native-vector-icons/Entypo';
import LottieView from 'lottie-react-native';
import { useNavigation } from '@react-navigation/native';
import { SwipeListView, SwipeRow } from "react-native-swipe-list-view";
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { connect, useSelector } from 'react-redux';
import { ProgressDialog } from 'react-native-simple-dialogs';
import { checkingCustomerByCnic, DeleteAssetsImages, DeleteCustomerForms, DeleteDocImages, getAssetsDocuments, getAssetsDocumentsforSyncup, getCustomerFroms, getCustomerFromsForBM, getCustomerFromsOnly, getLoanDocuments, insertCustomerFromData, insertCustomerFromDatawithPromise, insertMultipleAssetsImages, insertMultipleDocumentsImages } from '../../sqlite/sqlitedb';
import { Colors, GlobalStyles } from '../../theme';
var { height, width } = Dimensions.get('window');
import { useDispatch } from "react-redux";
import { CallforTags, CheckingTags, deleteLoanOfficerdata, getObjectbyBranchManager, sendObjectbyBM, sendTempCustomerAssetsImagesbyBm, updateTempCustomerDocsimagesbyBm, uploadingAssetsImage, uploadingCustomerdata, uploadingDocs } from '../../apis_auth/apis';
import Toast from '../../components/Toast';
import DateChips from '../../components/DateChips';
import CustomerAnswer from './CustomerAnswer';
import { color } from 'react-native-elements/dist/helpers';
const Customer: () => Node = (props) => {

  let docs = [];
  const [getForms, setFroms] = useState(null)
  const [getFormsOrignal, setFromsOrignal] = useState(null)

  const [noData, setNoData] = useState(false)

  const [dialogeCount, setDialogeCount] = useState("Syncing up")

  const StationReducer = useSelector((state) => state.StationReducer);
  const SyncdownReducer = useSelector((state) => state.SyncdownReducer);
  const [progressVisible, setprogressVisible] = useState(false)

  const [loading, setLoading] = useState(true)

  const [title, setTitle] = useState("Syncing up..");

  const [toast, setToast] = React.useState({ value: "", type: "" });

  const [refreshing, setRefreshing] = useState(false);

  const dispatch = useDispatch();

  const [searchData, setSearchData] = React.useState([])

  const [container, setContainer] = React.useState(
    {
      topBar: true,
      startDate: '',
      endDate: "",
      Cnic: "",
      activeInput: true

    })
  const [UserData, setUserData] = React.useState(undefined);

  const getUserData = useSelector((state) => state.UserData);

  var imagesCounter = 0;

  React.useEffect(async () => {

    setUserData(getUserData);


  }, []);

  useEffect(() => {

    const unsubscribe = props.navigation.addListener("focus", async () => {

      fetchData();

    });
  }, [])



  const fetchData = () => {

    getCustomerFromsForBM(setFroms, setFromsOrignal, setNoData, setLoading);



  }
  // **************************************************************************
  //============================ SYNCUP PROCESS ==============================START
  // **************************************************************************
  const Syncup = (parser, item, index) => {


    var loanInfo = parser.loanInfo[0];

    var assestsInfo = parser.assestsInfo[0];

    var guarantorInfo = parser.guarantorInfo[0];
    var customer=parser.customerInfo[0];


    console.log("--->LOanOfficerSyncup", JSON.stringify(loanInfo.loanType))

    if (loanInfo.loanType == undefined) {
      setToast({

        type: "error",

        message: "Please fill loan information first!",

      });
      return
    }

    if (assestsInfo.assetName.value == "") {
      setToast({

        type: "error",

        message: "Please fill assets information first!",

      });
      return
    }
    if (customer.evrisys_customerImage == undefined) {
      setToast({

        type: "error",

        message: "Please upload E-Vrisys  image first!",

      });
      return
    }
    if (loanInfo.customerLoan_type.value != "Normal" && guarantorInfo == undefined) {
      setToast({

        type: "error",

        message: "Please fill Gurantor information first. Because you have selected loan type as " + loanInfo.customerLoan_type.value,

      });
      return
    }
    var Commentsparser = JSON.parse(item.Comments)

    if (!Commentsparser) {


      setToast({

        type: "error",

        message: "Please insert comments first!",

      });

      return

    }
    let make = [];
    //////////////////////////////////////////////////////////////////////////////
    //Getting Tags for checking...
    /////////////////////////////////////////////////////////////////////
    if (parser) {

      var temp = parser.assestsInfo;

      temp.map((underitem, undexindex) => {

        if (underitem.assetTagName.value != undefined && underitem.assetTagId.value.length > 0) {

          make.push({ AssetTagId: underitem.assetTagId.value, AssetTagName: underitem.assetTagName.value })
        }
      })


    } else {

      return

    }

    //////////////////////////////////////////////////////////////////////////////
    //Send array of tags for checking already exist or not ...(CheckingTags)
    /////////////////////////////////////////////////////////////////////
    setTitle("Checking Tags..")
    setprogressVisible(true)

    CheckingTags(make, setprogressVisible).then((value) => {

      console.log("CheckingTags" + value)

      if (value.length > 0) {

        setToast({

          type: "error",

          message: "" + value,

        });
        setTitle("Updating Tags..")
        setprogressVisible(true)
        CallforTags(StationReducer.station.stationId, setprogressVisible)
          .then((values) => {
            setprogressVisible(false)

          })
      } else {

        console.log("===>item.user_cnic", JSON.stringify(item.user_cnic))
        setprogressVisible(true)
        setTitle("Uploading Docs..")


        getLoanDocuments(item.user_cnic).then((value) => {

          if (value) {

            if (value.length > 0) {

              value.map((underitem, underindex) => {

                docs.push({
                  CustomerId: item.id,
                  DocumentId: underindex,
                  Image: underitem.imgValue,
                  LoanId: index,
                  NicNumber: item.user_cnic,
                  UniqueCode: "4813_16" + Math.random(),
                  ImageName: underitem.imgName.value,

                })
              })


              setTitle("Syncing up")


              var converter = item.CustomerAnswers

              var parser2 = JSON.parse(converter)

              var CustomerAns = parser2.answerArray
              // **************** REMOVING IMAGES
              parser.customerInfo[0].customer_cnicNumber.value=item.user_cnic
              parser.loanInfo[0].loan_customerImage = [{ key: 1, activeTab: false, imgName: { value: '', error: false }, imgValue: undefined, }]
              parser.assestsInfo.map((assetsitem, indexer) => {
                parser.assestsInfo[indexer].assets_Image = [{ key: 1, activeTab: false, imgName: { value: '', error: false }, imgValue: undefined, }]
              })
              // **************** REMOVING IMAGES
              var removeQuestioninSindhi = CustomerAns;
              removeQuestioninSindhi.map((item, index) => {
                removeQuestioninSindhi[index].question = ""
              });

              item.CustomerAnswers = removeQuestioninSindhi;

              GettingCustomerData(item, index, parser);

            } else {
              setprogressVisible(false)

              setToast({

                type: "error",

                message: "Sorry! Documents not found.",
              });
            }
          }
        }).catch((error) => {

          console.log("catch works", JSON.stringify(error))

        })





      }

    }).catch((error) => {

      console.log(error)
      setprogressVisible(false)
      if (error) {
        setToast({
          type: "error",
          message: "" + error,
        });
      }


      // setDialogeCount("Syncing up")
    })
  }


  //////////////////////////////////////////////////////////////////////////////
  //Getting Data of Customer...
  /////////////////////////////////////////////////////////////////////

  const GettingCustomerData = async (item, index, parser) => {

    // var parser = JSON.parse(item.forms)
    // compositeKey = item.user_cnic

    let assets = []
    let assets_Image = [];
    //////////////////////////////////////////////////////////////////////////////
    //Getting Assets form vlaues...
    /////////////////////////////////////////////////////////////////////
    parser.assestsInfo.map((underitem, underindex) => {
      assets.push(
        {
          AssetName: '' + underitem.assetName.value,
          AssetOwner: '' + underitem.assetOwner.value,
          AssetQuantity: '' + underitem.assetQuantity.value,
          AssetTagId: '' + underitem.assetTagId.value,
          AssetTagName: '' + underitem.assetTagName.value,
          AssetValue: '' + underitem.assetValue.value,
          CustomerAssetId: '' + underindex,
          CustomerId: '' + item.id,
          Notes: '' + underitem.assetNote.value,
          _CustomerAssetNameId: underindex
        }
      )
      getAssetsDocumentsforSyncup(item.user_cnic).then((value) => {

        if (value) {

          imagesCounter = 0;

          // compositeKey += Math.floor(Math.random() * 1000);

          setTitle("Uploading Docs.. \n" + imagesCounter + "/" + docs.length)

          if (value.length > 0) {

            value.map((imageitem, imageindex) => {
              console.log("imgName==>", imageitem.imgName)
              assets_Image.push({
                AssetsDocumentId: imageindex,
                Assets_Id: imageitem.assets_id,
                Image: JSON.parse(imageitem.imgValue),
                NicNumber: item.user_cnic,
                assets_tag: underitem.assetTagName.value,
                Unique_Code: "4813_16" + Math.random(),
                ImageName: JSON.parse(imageitem.imgName),
              })
            })
            // BigChangeMethode(item,assets_Image)

            console.log("docs==>", docs.length)
            console.log("item.CompositeKey==>", item.CompositeKey)
            console.log("docassets_Images==>", assets_Image.length)




            uploadingMultipleDocsImages(docs, docs.length, item.CompositeKey, item, assets_Image, parser)

          } else {

            console.log("docs==>", docs.length)
            console.log("docassets_Images==>", assets_Image.length)


            uploadingMultipleDocsImages(docs, docs.length, item.CompositeKey, item, assets_Image, parser)

            // BigChangeMethode(item,assets_Image)
          }
        }
      }).catch(() => { })

    });
    // if(assets_Image.length<=0){
    //   console.log("No Images Found")
    //   alert("No Images Found")
    //   setLoading
    //   return
    // }


  }


  const uploadingMultipleDocsImages = async (allData, indexer, user_cnic, item, assets_Image, parser) => {
    updateTempCustomerDocsimagesbyBm(allData[indexer - 1], user_cnic)
      .then((value) => {
        if (value == "Success") {
          imagesCounter++;

          setTitle("Uploading Docs.. \n" + imagesCounter + "/" + docs.length)

          let nextNumber = indexer - 1

          if (nextNumber > 0) {

            uploadingMultipleDocsImages(allData, nextNumber, user_cnic, item, assets_Image, parser)

          } else {
            let maker = item;
            maker["forms"] = parser;
            BigChangeMethode(maker, assets_Image, user_cnic, parser)
          }
        }

      })
      .catch((error) => { })
  }

  const uploadingMultipleAssetsImages = async (allDataa, indexerr, user_cnicc, Topitemm) => {
    sendTempCustomerAssetsImagesbyBm(allDataa[indexerr - 1], user_cnicc)
      .then((value) => {
        if (value == "Success") {
          imagesCounter++;
          setTitle("Uploading Assets Docs.. \n" + imagesCounter + "/" + allDataa.length)

          let nextNumber = indexerr - 1

          if (nextNumber > 0) {

            uploadingMultipleAssetsImages(allDataa, nextNumber, user_cnicc, Topitemm)

          } else {
            setToast({
              type: "success",
              message: "Syncup successfully!",
            });
            deleteMechanism(Topitemm)

          }
        } else {
          setprogressVisible(false)
          Alert.alert("Error", "" + value)
        }

      })
      .catch((error) => {
        setprogressVisible(false)
        Alert.alert("Error", "" + error)
      })
  }
  const BigChangeMethode = (item, assets_Image, user_cnic, parser) => {
    setprogressVisible(true)
    setTitle("Syncing up..")
    // **************** BIG CHANGES START **************************
    let CustomerDataObject = [];
    CustomerDataObject.push(item)
    var sendingObject = {
      "CustomerId": item.id,
      "CustomerDataObject": CustomerDataObject,
      // "CustomerDocImages": docs,
      // "CustomerAssetsImages": assets_Image,
      "LoanOfficer": UserData?.userData?.user_id,
    }
    console.log("**********************sendingObject***************************")
    //  console.log("",JSON.stringify(sendingObject))
    console.log("**********************sendingObject***************************")
    sendObjectbyBM(sendingObject, 0, user_cnic, StationReducer.station.stationId)
      .then(async (value) => {
        CustomerDataObject = [];
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
        //     DirectoryPath + '/' + 'SyncupLoanOfficer.txt',
        //     JSON.stringify(sendingObject),
        //     'utf8',
        //   )
        //     .then(() => {
        //       // alert('success')
        //       CustomerDataObject = [];

        //     })
        //   //-------------------------write file

        //   // -----------------------------
        // } else {
        //   Alert.alert(
        //     'Permission Denied!',
        //     'You need to give storage permission to download the file',
        //   );
        //   CustomerDataObject = [];
        //   return;
        // }

        // **********************************************************************
        console.log("--->IN THE END", value);
        if (value === "Success") {
          var loanInfo = parser.loanInfo[0];

          if (assets_Image.length > 0 && loanInfo.loanType.value == "Live Stock") {
            imagesCounter = 0;
            uploadingMultipleAssetsImages(assets_Image, assets_Image.length, user_cnic, item)

          } else {
            setToast({
              type: "success",
              message: "Syncup successfully!",
            });
            deleteMechanism(item)
          }

        } else {

          setprogressVisible(false)

          setToast({
            type: "error",
            message: "" + value,
          });

        }


      })

      .catch((error) => {

      })
    // **************** BIG CHANGES END**************************
  }
  const deleteMechanism = (item) => {
    // compositeKey="";
    DeleteCustomerForms(item.id, item.user_cnic)


      .then((value) => {

        DeleteDocImages(item.user_cnic).then(() => {

          DeleteAssetsImages(item.user_cnic).then(() => {



            setToast({
              type: "success",
              message: "Successfully Delete",
            });
            let get2 = getForms;
            get2.splice(item, 1);
            setFroms(get2);
            setFromsOrignal(get2);
            fetchData()
            setTitle("Updating Tags..")
            setprogressVisible(true)
            CallforTags(StationReducer.station.stationId, setprogressVisible)
              .then((values) => {
                docs = [];

                setprogressVisible(false)

              })
          })
        })
      })
      .catch(() => {

      })
  }

  // **************************************************************************
  //============================ SYNCUP PROCESS ==============================END
  // **************************************************************************


  // ******************************************* SERACH
  const searchText = (e) => {

    let text = e.toLowerCase();
    let filteredName = getFormsOrignal.filter((item) => {
      if (item.user_name.toLowerCase().match(text)) {
        return item.user_name.toLowerCase().match(text);
      } else {
      }
    });
    if (!text || text === "") {
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
    const location = `${latitude},${Longitudes}`
    const url = Platform.select({
      ios: `maps:${location}`,
      android: `geo:${location}?center=${location}&q=${location}&z=16`,
    });
    Linking.openURL(url);
  }
  // ************************************

  const GettingData = async (item, index) => {
    getCustomerFromsOnly(item.user_cnic).then((value) => {
      var parser = JSON.parse(value[0].forms)
      Syncup(parser, item, index)
    });
  }

  const removeChip = (index) => {
    setFroms([])
    setSearchData([])
    setLoading(true)
    fetchData()
  }

  const renderItem = ({ item, index }) => (
    <CustomerRecorditems item={item}
      UserData={UserData}
      onPressIn={() => {
        if (SyncdownReducer.syncDown == "") {

          Alert.alert(
            "Process Stop!", "Please Syncdown first.",
            [

              { text: "OK", onPress: () => console.log("OK Pressed") }
            ],
            { cancelable: false }
          );
          return
        }
        var Commentsparser = JSON.parse(item.Comments)


        if (Commentsparser?.borrowerStaification.value == '') {


          Alert.alert("Stop!", "Please fill Branch Manager Checklist.")

          return;
        }
        Alert.alert("Await!", "Do you really want to Syncup?",
          [{ text: "Yes", onPress: () => GettingData(item, index) }, { text: 'No' }])
      }}
      onPresscomment={() => props.navigation.navigate('Comments', { item: JSON.parse(item.Comments), id: item.id })}
      onPress={
        async () => {
          if (SyncdownReducer.syncDown == "") {

            Alert.alert(
              "Process Stop!", "Please Syncdown first.",
              [

                { text: "OK", onPress: () => console.log("OK Pressed") }
              ],
              { cancelable: false }
            );
            return
          }
          Alert.alert("Await!", "Do you really want to Update?",
            [{
              text: "Yes", onPress: () => {

                getCustomerFromsOnly(item.user_cnic).then((value) => {
                  var parser = JSON.parse(value[0].forms)
                  props.Updatecheck({ value: true, id: item.id })
                  props.navigation.navigate('AddForm', { item: parser, user_cnic: item.user_cnic })

                });
              }
            }, { text: 'No' }])

        }
      }
      onPressNavigation={() => {
        handleNavigation(item.Latitude, item.Longitudes)
        
      }}
      
    />
  );
  return (
    <SafeAreaView style={styles.safeview}>
      <AppStatusBar></AppStatusBar>
      <Header Theme={""}
      ></Header>
      <View>
        <Search
          Theme={""}
          filterData={container}
          setFilterData={setContainer}
          setSearchData={setSearchData}
          onChangeText={(e) => searchText(e)}
          Data={getForms}
          setData={setFroms}
          variable={1}
          setNoData={setNoData}
          setLoading={setLoading}
          text={'Search Customer by name for BM..'}
        />
        <DateChips clearFilter={removeChip} searchData={searchData} />
        {loading && <ActivityIndicator style={{ marginTop: 30 }} color={Colors.parrotGreenColor} />}
        {noData && <Nodata></Nodata>}

        {getCustomerFromsForBM != null && <SwipeListView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 300 }}
          style={{ marginTop: 20, marginLeft: 20, marginRight: 20 }}
          data={getForms}
          keyboardShouldPersistTaps="handled"
          renderItem={renderItem}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={() => {
                // **************************************************************************
                fetchData();
              }}
              colors={[Colors.kulfa]}
            />
          }
          renderHiddenItem={(item, index) => (
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                marginRight: 0,
                marginTop: 20,

              }}
            >
              <View style={{ flex: 1 }}></View>
              <View style={{}}>
                <TouchableOpacity
                  onPress={() => {
                    Alert.alert(
                      "Delete!",
                      "Do you really want to delete?",
                      [
                        {
                          text: "Cancel",
                          onPress: () => console.log("Cancel Pressed"),
                          style: "cancel"
                        },
                        {
                          text: "OK", onPress: () => {
                            if (item.item.isGroupMember) {
                              Alert.alert("Stop!", "You can't delete group member")
                              return
                            }
                            setprogressVisible(true)
                            setTitle("Deleting...")

                            DeleteCustomerForms(item.item.id, item.item.user_cnic)
                              .then((value) => {
                                DeleteDocImages(item.item.user_cnic).then(() => {
                                  DeleteAssetsImages(item.item.user_cnic).then(() => {
                                    setprogressVisible(false)
                                    setTitle("Deleting..")
                                    setToast({
                                      type: "success",
                                      message: "Successfully Delete",
                                    });
                                    let get2 = getForms;
                                    get2.splice(index, 1);
                                    setFroms(get2);
                                    setFromsOrignal(get2);
                                    fetchData()
                                  })
                                })
                              })
                              .catch(() => {

                              })
                            // let get = allDataobj;
                            // get.assestsInfo[item.index].activeTab = false;
                            // setAlldataobj({...get});



                          }
                        }
                      ]
                    );

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
        />}
      </View>

      <CustomProgressDialoge
        dialogVisible={progressVisible}
        setDialogVisible={setprogressVisible}
        title={title}
      />
      <Toast {...toast} onDismiss={() => setToast({ message: "", type: "" })} />

    </SafeAreaView>
  );
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
export default connect(null, mapDispatchToProps)(Customer);

const styles = StyleSheet.create({
  safeview: {
    flex: 1
  },
  card: {
    marginTop: 10, marginLeft: 30, marginRight: 30, paddingLeft: 10
  },
  row: { flexDirection: "row", alignItems: 'center' },
  circle: {
    height: 30, width: 30, borderRadius: 100, marginLeft: 0, marginRight: 10,
    justifyContent: 'center', backgroundColor: '#f1f1f1'
  }
})

