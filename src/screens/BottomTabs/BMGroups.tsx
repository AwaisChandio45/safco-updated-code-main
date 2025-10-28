import React, {useEffect, useState} from 'react';
import type {Node} from 'react';
import {
  SafeAreaView,
  ScrollView,
  Pressable,
  PermissionsAndroid,
  StyleSheet,
  Dimensions,
  Alert,
  TextInput,
  ActivityIndicator,
  View,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import RNFS from 'react-native-fs';

import moment from 'moment';
import {Card} from 'react-native-paper';
import {
  AppStatusBar,
  CustomerRecorditems,
  CustomProgressDialoge,
  Header,
  Nodata,
  Search,
  TextView,
} from '../../components';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Entypo from 'react-native-vector-icons/Entypo';
import LottieView from 'lottie-react-native';
import {useNavigation} from '@react-navigation/native';
import {SwipeListView, SwipeRow} from 'react-native-swipe-list-view';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {connect, useSelector} from 'react-redux';
import {
  checkingCustomerByCnic,
  DeleteAssetsImages,
  DeleteCustomerForms,
  DeleteCustomerFormsbyCnic,
  DeleteCustomerGurantorsbyId,
  DeleteDocImages,
  DeleteGroupsForms,
  DeleteSelectedGurantors,
  DeleteSelectedGurantorsbyBM,
  getAllGroupGurantors,
  getAssetsDocumentsforSyncup,
  getCustomerFroms,
  getCustomerFromsByidforGroupSyncup,
  getGroupGurantors,
  getGroupsFroms,
  getGroupsFromsforBM,
  getLoanDocuments,
  insertCustomerFromDatawithPromise,
  insertGroupFromData,
  insertMultipleAssetsImages,
  insertMultipleDocumentsImages,
  insert_Group_Gurantors,
} from '../../sqlite/sqlitedb';
import {Colors} from '../../theme';
var {height, width} = Dimensions.get('window');
import {useDispatch} from 'react-redux';
import GroupRecorditems from '../../components/GroupRecorditems';
import {
  CallforTags,
  CheckingTags,
  deleteLoanOfficerdata,
  getObjectbyBranchManager,
  sendObjectbyBM,
  sendTempCustomerAssetsImagesbyBm,
  sendTempCustomerDocsimages,
  updateTempCustomerDocsimagesbyBm,
  uploadingAssetsImage,
  uploadingCustomerdata,
  uploadingDocs,
} from '../../apis_auth/apis';
import Toast from '../../components/Toast';
import DateChips from '../../components/DateChips';
const Groups: () => Node = props => {
  let customerSyncUpDatas = [];
  let asstesTags = [];
  let Docs = [];
  let assets_Image = [];
  let groupGurantors = [];
  let AllCustomer = [];
  var imagesCounter = 0;

  let obj = {};
  var convert = {};
  let processItem = {};
  const [title, setTitle] = React.useState('');
  const [getForms, setFroms] = useState(null);
  const [getFormsOrignal, setFromsOrignal] = useState(null);
  const [noData, setNoData] = useState(false);
  const [progress, setProgresss] = useState(false);
  const [Null, setNull] = useState(false);
  const [loading, setLoading] = useState(true);
  const [allData, setAllData] = useState({});
  const StationReducer = useSelector(state => state.StationReducer);
  const SyncdownReducer = useSelector(state => state.SyncdownReducer);
  const [toast, setToast] = React.useState({value: '', type: ''});
  const [dialogeCount, setDialogeCount] = useState('Syncing up');
  const [searchData, setSearchData] = React.useState([]);
  const [refreshing, setRefreshing] = React.useState(false);
  const [DeleteChecker, setDeleteChecker] = React.useState(true);
  const [UserData, setUserData] = React.useState(undefined);
  const getUserData = useSelector(state => state.UserData);

  React.useEffect(async () => {
    setUserData(getUserData);
  }, []);
  const [container, setContainer] = React.useState({
    topBar: true,
    startDate: '',
    endDate: '',
    Cnic: '',
    activeInput: true,
  });

  const dispatch = useDispatch();

  useEffect(() => {
    const unsubscribe = props.navigation.addListener('focus', () => {
      fetchData();
    });
  }, []);
  // ******************************************* SERACH
  const searchText = e => {
    let text = e.toLowerCase();

    let filteredName = getFormsOrignal.filter(item => {
      if (item.group_name.toLowerCase().match(text)) {
        return item.group_name.toLowerCase().match(text);
      } else {
      }
    });
    if (!text || text === '') {
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

  // *********************************************************************
  // ========================== SYNC UP Process Start ==============================
  // *********************************************************************

  const GroupSyncup = (item, index) => {
    setProgresss(true);

    setTitle('Checking Tags..');

    processItem = item;

    var parser = item.groupForm;

    var fromPraser = JSON.parse(parser);

    convert = fromPraser.groupMembers;

    GettingCustomertags(convert.length, convert);

    getAllGroupGurantors(item.composite_key).then((value: Array) => {
      // console.log("ALL GURANTOS",value)

      groupGurantors = value;
    });
    obj = {
      length: convert.length,
      members: convert,
      fromPraser: fromPraser,
      index: index,
      groupRow: item,
      composite_key: item.composite_key,
    };

    // setAllData({...obj})

    // GettingCustomerDataRecursive(convert.length,convert,fromPraser,index)
  };
  //Recursion for getting all customer Images
  const GettingCustomerDoc = async (fromNumber, members) => {
    getLoanDocuments(members[fromNumber - 1].NicNumber)
      .then(value => {
        if (value) {
          if (value.length > 0) {
            value.map((underitem, underindex) => {
              Docs.push({
                CustomerId: members[fromNumber - 1].CustomerGroupMemberId,
                DocumentId: underindex,
                Image: underitem.imgValue,
                LoanId: members[fromNumber - 1].CustomerGroupMemberId,
                NicNumber: members[fromNumber - 1].NicNumber,
                UniqueCode: '4813_16' + Math.random(),
                ImageName: underitem.imgName.value,
              });
            });
            //////////////////////////////////////////////////////////////////////////////
            //(Uploading docs) (recursivecountDocsuploading)
            /////////////////////////////////////////////////////////////////////
            //----------------------
            let nextNumber = fromNumber - 1;

            // console.log("nextNumber", nextNumber)
            console.log('nextNumber', nextNumber);
            if (nextNumber > 0) {
              GettingCustomerDoc(nextNumber, members);
            } else {
              console.log('Docs=======>', Docs.length);
              //////////////////////////////////////////////////////////////////////////////
              //(Uploading docs) (recursivecountDocsuploading)
              /////////////////////////////////////////////////////////////////////
              // recursivecountDocsuploading(Docs, Docs.length)
              setTitle('Uploading  Docs..' + imagesCounter + '/' + Docs.length);

              console.log(
                '------>ROW' +
                  obj.length +
                  '<--->' +
                  obj.members +
                  '<--->' +
                  obj.fromPraser +
                  '<--->' +
                  obj.index,
              );

              GettingCustomerDataRecursive(
                obj.length,
                obj.members,
                obj.fromPraser,
                obj.index,
              );
            }
          } else {
            setToast({
              type: 'error',
              message: 'Sorry! Documents not found.',
            });
          }
        }
      })
      .catch(error => {
        console.log('catch works', JSON.stringify(error));
        Alert.alert('Check your internet.', 'Try Again! \n' + error, [
          {text: 'ok', onPress: () => {}},
        ]);
      });
  };

  //Recursion for getting all customer tags
  const GettingCustomertags = async (fromNumber, members) => {
    getCustomerFromsByidforGroupSyncup(
      setNull,
      members[fromNumber - 1].NicNumber,
    )
      .then(values => {
        var parser = JSON.parse(values[0].forms);
        var loanInfo = parser.loanInfo[0];
        var customer = parser.customerInfo[0];
        var assestsInfo = parser.assestsInfo[0];

        var guarantorInfo = parser.guarantorInfo[0];

        console.log('--->LOanOfficerSyncup', JSON.stringify(loanInfo.loanType));

        if (loanInfo.loanType == undefined) {
          setToast({
            type: 'error',

            message: 'Please fill loan information first!',
          });
          return;
        }

        if (assestsInfo.assetName.value == '') {
          setToast({
            type: 'error',

            message: 'Please fill assets information first!',
          });
          return;
        }
        if (customer.evrisys_customerImage == undefined) {
          setToast({
            type: 'error',

            message: 'Please upload E-Vrisys  image first!',
          });
          return;
        }
        if (
          loanInfo.customerLoan_type.value != 'Normal' &&
          guarantorInfo == undefined
        ) {
          setToast({
            type: 'error',

            message:
              'Please fill Gurantor information first. Because you have selected loan type as ' +
              loanInfo.customerLoan_type.value,
          });
          return;
        }
        //////////////////////////////////////////////////////////////////////////////
        //Getting Tags for checking...
        /////////////////////////////////////////////////////////////////////

        var temp = parser.assestsInfo;
        // console.log("temp=======>",temp)

        temp.map((underitem, undexindex) => {
          if (underitem.assetTagName.value && underitem.assetTagId.value) {
            asstesTags.push({
              AssetTagId: underitem.assetTagId.value,
              AssetTagName: underitem.assetTagName.value,
            });
          }
        });

        //----------------------
        let nextNumber = fromNumber - 1;

        if (nextNumber > 0) {
          GettingCustomertags(nextNumber, members);
        } else {
          console.log('Tags=======>', asstesTags);

          CheckingTags(asstesTags, setNull)
            .then(value => {
              // console.log("error" + value)

              if (value.length > 0) {
                setToast({
                  type: 'error',

                  message: '' + value,
                });

                setTitle('Updating Tags..');

                setProgresss(true);

                CallforTags(StationReducer.station.stationId, setProgresss)
                  .then(() => {
                    setProgresss(false);
                  })
                  .catch(() => {
                    setProgresss(false);
                  });
              } else {
                asstesTags = [];
                // return
                setTitle('Uploading Customers Docs..');

                GettingCustomerDoc(convert.length, convert);
              }
            })
            .catch(error => {
              setProgresss(false);
              Alert.alert('Check your internet.', 'Try Again! \n' + error, [
                {text: 'ok', onPress: () => {}},
              ]);
            });
        }
      })

      .catch(error => {});
  };
  //Recursion for getting all customer data and upload
  const GettingCustomerDataRecursive = async (
    fromNumber,
    members,
    fromPraser,
    index,
  ) => {
    setDialogeCount('Syncing up..');

    console.log('---->', members[fromNumber - 1].NicNumber + '<----');

    getCustomerFromsByidforGroupSyncup(
      setProgresss,
      members[fromNumber - 1].NicNumber,
    ).then(async values => {
      // console.log("---customer Data===>",values[0].)

      GettingCustomerData(values[0], fromNumber).then(async value => {
        //running---------------------------------

        let nextNumber = fromNumber - 1;

        if (nextNumber > 0) {
          GettingCustomerDataRecursive(nextNumber, members, fromPraser, index);
        } else {
          console.log('assets_Image=======>', assets_Image.length);

          // return
          /////////////////////////////////////////////////////////////////////////////////
          //Making object of final Object
          ///////////////////////////////////////////////////////////////////////////////////////////////
          var sendingObject = {
            CustomerDataObject: AllCustomer,
            // "CustomerDocImages": Docs,
            // "CustomerAssetsImages": assets_Image,
            LoanOfficer: UserData?.userData?.user_id,
            GroupGurantors: groupGurantors,
            Group: obj.groupRow,
          };
          // console.log("--->IN THE END",groupMembers);
          // *******************************************************************WRITE FILE
          // const granted = await PermissionsAndroid.request(
          // PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
          // {
          // title: 'Storage Permission',
          // message: 'App needs access to memory to download the file ',
          // },
          // );
          // if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          // const AppFolder = 'Safco_reactapp';
          // const DirectoryPath =
          // RNFS.ExternalStorageDirectoryPath + '/' + AppFolder;
          // RNFS.mkdir(DirectoryPath);
          // RNFS.getAllExternalFilesDirs()

          // RNFS.writeFile(
          // DirectoryPath + '/' + 'Syncup34.txt',
          // JSON.stringify(sendingObject),
          // 'utf8',
          // )
          // .then(() => {

          // })
          // // //-------------------------write file

          // // // -----------------------------
          // } else {
          // Alert.alert(
          // 'Permission Denied!',
          // 'You need to give storage permission to download the file',
          // );
          // return;
          // }
          console.log('--->Docs', Docs.length);
          imagesCounter = 0;

          uploadingMultipleDocsImages(
            Docs,
            Docs.length,
            obj.composite_key,
            sendingObject,
            setProgresss,
          );
          // BigChangeMethode(sendingObject, setProgresss)
          // **********************************************************************
          /////////////////////////////////////////////////////////////////////////////////
          //(Uploading)
          ///////////////////////////////////////////////////////////////////////////////////////////////
          return;
          uploadingCustomerdata(Uploading, setProgresss)
            .then(value => {
              console.log('--->IN THE END', value);

              customerSyncUpDatas = [];

              if (value === 'Success') {
                //////////////////////////////////////////////////////////////////////////////
                // (Uploading AssetsImage) (recursivecountAssetsuploading)
                /////////////////////////////////////////////////////////////////////
                setTitle('Uploading Assets Docs..');

                recursivecountAssetsuploading(
                  assets_Image,
                  assets_Image.length,
                );
              } else {
                setToast({
                  type: 'error',

                  message: '' + value,
                });
              }
            })

            .catch(error => {});

          // props.navigation.goBack();
        }
      });
    });
  };
  const uploadingMultipleDocsImages = async (
    allData,
    indexer,
    user_cnic,
    sendingObject,
    setProgresss,
  ) => {
    updateTempCustomerDocsimagesbyBm(allData[indexer - 1], user_cnic)
      .then(value => {
        if (value == 'Success') {
          imagesCounter++;
          setTitle('Uploading Docs.. \n' + imagesCounter + '/' + Docs.length);

          let nextNumber = indexer - 1;

          if (nextNumber > 0) {
            uploadingMultipleDocsImages(
              allData,
              nextNumber,
              user_cnic,
              sendingObject,
              setProgresss,
            );
          } else {
            BigChangeMethode(sendingObject, setProgresss, user_cnic);
          }
        } else {
          setToast({
            type: 'error',

            message: '' + value,
          });

          setProgresss(false);
        }
      })
      .catch(error => {
        Alert.alert('Check your internet.', 'Try Again! \n' + error, [
          {text: 'ok', onPress: () => {}},
        ]);
      });
  };

  const uploadingMultipleAssetsImages = async (allData, indexer, user_cnic) => {
    sendTempCustomerAssetsImagesbyBm(allData[indexer - 1], user_cnic)
      .then(value => {
        if (value == 'Success') {
          imagesCounter++;
          setTitle(
            'Uploading Assets Docs.. \n' +
              imagesCounter +
              '/' +
              assets_Image.length,
          );

          let nextNumber = indexer - 1;

          if (nextNumber > 0) {
            uploadingMultipleAssetsImages(allData, nextNumber, user_cnic);
          } else {
            setToast({
              type: 'success',
              message: 'Syncup successfully!',
            });
            deleteAllRelated(processItem);
          }
        } else {
          setToast({
            type: 'error',

            message: '' + value,
          });

          setProgresss(false);
        }
      })

      .catch(error => {
        setToast({
          type: 'error',

          message: '' + error,
        });

        setProgresss(false);
      });
  };

  const BigChangeMethode = (sendingObject, setProgress, user_cnic) => {
    setTitle('Syncing up..');

    // **************** BIG CHANGES START **************************

    console.log(
      '**********************sendingObject***************************',
    );
    console.log('', JSON.stringify(sendingObject));
    console.log(
      '**********************sendingObject***************************',
    );
    setProgress(true);
    sendObjectbyBM(
      sendingObject,
      1,
      user_cnic,
      StationReducer.station.stationId,
    )
      .then(async value => {
        AllCustomer = [];
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
        //     DirectoryPath + '/' + 'SyncupLoanOfficer1233.txt',
        //     JSON.stringify(sendingObject),
        //     'utf8',
        //   )
        //     .then(() => {
        //       alert('success')

        //     })
        //   //-------------------------write file

        //   // -----------------------------
        // } else {
        //   Alert.alert(
        //     'Permission Denied!',
        //     'You need to give storage permission to download the file',
        //   );
        //   return;
        // }

        // **********************************************************************
        console.log('--->IN THE END', value);
        if (value === 'Success') {
          imagesCounter = 0;
          if (assets_Image.length > 0) {
            uploadingMultipleAssetsImages(
              assets_Image,
              assets_Image.length,
              user_cnic,
            );
          } else {
            setToast({
              type: 'success',
              message: 'Syncup successfully!',
            });

            deleteAllRelated(processItem);
          }
        } else {
          setToast({
            type: 'error',
            message: '' + value,
          });
          setProgresss(false);
        }
      })

      .catch(error => {});
    // **************** BIG CHANGES END**************************
  };
  //////////////////////////////////////////////////////////////////////////////
  //Getting Customer Data ...
  /////////////////////////////////////////////////////////////////////
  const GettingCustomerData = (item, index) => {
    const promise = new Promise((resolve, reject) => {
      var parser = JSON.parse(item.forms);
      var converter = item.CustomerAnswers;
      var parser2 = JSON.parse(converter);
      var CustomerAns = parser2.answerArray;
      parser.customerInfo[0].customer_cnicNumber.value = item.user_cnic;
      parser.loanInfo[0].loan_customerImage = [
        {
          key: 1,
          activeTab: false,
          imgName: {value: '', error: false},
          imgValue: undefined,
        },
      ];
      parser.assestsInfo.map((assetsitem, indexer) => {
        parser.assestsInfo[indexer].assets_Image = [
          {
            key: 1,
            activeTab: false,
            imgName: {value: '', error: false},
            imgValue: undefined,
          },
        ];
      });
      // console.log("xxxxx?",CustomerAns)
      var removeQuestioninSindhi = CustomerAns;
      removeQuestioninSindhi.map((item, index) => {
        removeQuestioninSindhi[index].question = '';
      });

      item.CustomerAnswers = removeQuestioninSindhi;
      //////////////////////////////////////////////////////////////////////////////

      let assets = [];
      //////////////////////////////////////////////////////////////////////////////
      //Getting Assets form vlaues...
      /////////////////////////////////////////////////////////////////////
      parser.assestsInfo.map((underitem, underindex) => {
        assets.push({
          AssetName: '' + underitem.assetName.value,
          AssetOwner: '' + underitem.assetOwner.value,
          AssetQuantity: '' + underitem.assetQuantity.value,
          AssetTagId: '' + underitem.assetTagId.value,
          AssetTagName: '' + underitem.assetTagName.value,
          AssetValue: '' + underitem.assetValue.value,
          CustomerAssetId: '' + underindex,
          CustomerId: '' + item.id,
          Notes: '' + underitem.assetNote.value,
          _CustomerAssetNameId: underindex,
        });
        console.log('try with--->', item.user_cnic);
        getAssetsDocumentsforSyncup(item.user_cnic)
          .then(value => {
            if (value) {
              if (value.length > 0) {
                console.log(
                  'try with--->',
                  item.user_cnic + 'length',
                  value.length,
                );
                value.map((imageitem, imageindex) => {
                  assets_Image.push({
                    AssetsDocumentId: imageindex,
                    Assets_Id: imageitem.assets_id,
                    Image: JSON.parse(imageitem.imgValue),
                    NicNumber: item.user_cnic,
                    assets_tag: underitem.assetTagName.value,
                    Unique_Code: '4813_16' + Math.random(),
                    ImageName: JSON.parse(imageitem.imgName),
                  });
                });
              }
              item.forms = parser;
              AllCustomer.push(item);
              resolve(true);
            }
          })
          .catch(() => {});
        // underitem.assets_Image.map((imageitem, imageindex) => {
        //   assets_Image.push({
        //     AssetsDocumentId: imageindex,
        //     Assets_Id: underindex,
        //     Image: imageitem.imgValue,
        //     NicNumber: item.user_cnic,
        //     assets_tag: underitem.assetTagName.value,
        //     Unique_Code: "4813_16" + Math.random(),
        //     ImageName: imageitem.imgName.value,
        //   })
        // })
      });
    });
    return promise;
  };
  //////////////////////////////////////////////////////////////////////////////
  //Recursive function for uploading form Docs images...
  /////////////////////////////////////////////////////////////////////
  const recursivecountDocsuploading = async (docs, docsIndx) => {
    // setDialogeCount("Documents Uploading " + docsIndx)

    uploadingDocs(docs[docsIndx - 1], docsIndx, setProgresss)
      .then(value => {
        // console.log("--response of Documents" + value)
        let nextNumber = docsIndx - 1;

        if (nextNumber > 0) {
          recursivecountDocsuploading(docs, nextNumber);
        } else {
          //           alert(JSON.stringify(allData))
          setTitle('Syncing up..');

          console.log(
            '------>ROW' +
              obj.length +
              '<--->' +
              obj.members +
              '<--->' +
              obj.fromPraser +
              '<--->' +
              obj.index,
          );

          GettingCustomerDataRecursive(
            obj.length,
            obj.members,
            obj.fromPraser,
            obj.index,
          );
        }
      })
      .catch(error => {});
  };

  //////////////////////////////////////////////////////////////////////////////
  //Recursive function for uploading form Docs images...
  /////////////////////////////////////////////////////////////////////
  const recursivecountAssetsuploading = async (docs, docsIndx) => {
    setDialogeCount('Assets Documents Uploading ' + docsIndx);
    uploadingAssetsImage(docs[docsIndx - 1], docsIndx, setProgresss)
      .then(value => {
        // console.log("--response" + value)
        let nextNumber = docsIndx - 1;

        if (nextNumber > 0) {
          recursivecountAssetsuploading(docs, nextNumber);
        } else {
          deleteAllRelated(processItem);

          // deleteRow2(processItem);

          // setDialogeCount("Syncing up")

          // alert("Successfull Delete Gurantor")
          // props.navigation.goBack();
        }
      })
      .catch(error => {});
  };

  // *********************************************************************
  // ========================== SYNC UP Process END ==============================
  // *********************************************************************

  //-------------------------recursive methodes for delete gurantours
  const recursivecountDownOne = async (
    members,
    fromNumber,
    groupId,
    item,
    type,
    deleteChecker,
  ) => {
    console.log('---->', members[fromNumber - 1].NicNumber + '<----');
    console.log('---->groupId', groupId + '<----');

    DeleteSelectedGurantorsbyBM(
      groupId,
      members[fromNumber - 1].NicNumber,
    ).then(() => {
      let nextNumber = fromNumber - 1;

      if (nextNumber > 0) {
        recursivecountDownOne(
          members,
          nextNumber,
          groupId,
          item,
          type,
          deleteChecker,
        );
      } else {
        DeleteGroupsForms(groupId)
          .then(value => {
            // console.log("--->", value)

            setProgresss(false);

            setToast({
              type: 'success',

              message:
                type == 1 ? 'Syncup successfully!' : 'Successfully Deleted',
            });

            customerSyncUpDatas = [];

            asstesTags = [];

            Docs = [];

            assets_Image = [];

            obj = {};
            if (deleteChecker) {
              setTitle('Updating Tags..');

              setProgresss(true);

              CallforTags(StationReducer.station.stationId, setProgresss)
                .then(() => {
                  setProgresss(false);
                })
                .catch(() => {
                  setProgresss(false);
                });
            }
          })
          .catch(eror => {});

        let get2 = getForms;

        get2.splice(item.index, 1);

        setFroms(get2);
        setFromsOrignal(get2);
        fetchData();
      }
    });
  };

  // ==================== RECURSIVE METHODE FOR DELETE CUSTOMER DATA=======================
  const recursiveforDeleteCustomerData = (members, fromNumber, item) => {
    DeleteCustomerFormsbyCnic(members[fromNumber - 1].NicNumber)
      .then(value => {
        DeleteDocImages(members[fromNumber - 1].NicNumber).then(() => {
          DeleteAssetsImages(members[fromNumber - 1].NicNumber).then(() => {
            let nextNumber = fromNumber - 1;

            if (nextNumber > 0) {
              recursiveforDeleteCustomerData(members, nextNumber, item);
            } else {
              deleteRow2(processItem);
            }
          });
        });
      })
      .catch(() => {});
  };
  // ==================== RECURSIVE METHODE FOR DELETE CUSTOMER DATA=======================

  const deleteAllRelated = item => {
    // console.log("====================>deleteAllRelated");

    var groupform = item.groupForm;

    var coverter = JSON.parse(groupform);

    var groupMembers = coverter.groupMembers;

    // console.log("====================>groupMembers");

    // console.log("--->", groupMembers);

    // console.log("====================>groupMembers");

    setProgresss(true);

    setTitle('Deleting Group..');

    recursiveforDeleteCustomerData(groupMembers, groupMembers.length, item);
  };

  // ********************* Login User Data****************************

  //-------------------------------------
  const fetchData = () => {
    getGroupsFromsforBM(setFroms, setFromsOrignal, setNoData, setLoading);
  };
  const handleSyncup = (item, index) => {
    if (SyncdownReducer.syncDown == '') {
      Alert.alert(
        'Process Stop!',
        'Please Syncdown first.',
        [{text: 'OK', onPress: () => console.log('OK Pressed')}],
        {cancelable: false},
      );
      return;
    }
    var parser = JSON.parse(item.groupForm);

    if (parser?.borrowerStaification.value == '') {
      Alert.alert('Stop!', 'Please fill Branch Manager Checklist.');

      return;
    }
    Alert.alert('Syncup?', 'do you really want to syncup?', [
      {
        text: 'Yes',
        onPress: () => {
          GroupSyncup(item, index);
        },
      },
      {text: 'No'},
    ]);
  };
  const renderItem = ({item, index}) => (
    <GroupRecorditems
      item={item}
      UserData={UserData}
      onPressSyncup={() => {
        handleSyncup(item, index);
      }}
      onPress={async () => {
        var parser = JSON.parse(item.groupForm);

        props.Updatecheck({
          value: true,
          id: item.group_id,
          composite_key: item.composite_key,
        });

        props.navigation.navigate('AddGroup', {item: parser});
      }}
    />
  );
  const deleteRow = (item, deleteChecker) => {
    var groupform = item.item.groupForm;

    var coverter = JSON.parse(groupform);

    var groupMembers = coverter.groupMembers;

    // console.log("--->", groupMembers);

    setProgresss(true);

    setTitle('Deleting Group');

    recursivecountDownOne(
      groupMembers,
      groupMembers.length,
      item.item.group_id,
      item,
      2,
      deleteChecker,
    );
  };
  const deleteRow2 = item => {
    var groupform = item.groupForm;
    var coverter = JSON.parse(groupform);
    var groupMembers = coverter.groupMembers;
    // console.log("--->", groupMembers);
    setProgresss(true);
    setTitle('Deleting Group');
    recursivecountDownOne(
      groupMembers,
      groupMembers.length,
      item.group_id,
      item,
      1,
      true,
    );
  };

  const removeChip = index => {
    setFroms([]);

    setFromsOrignal([]);

    setSearchData([]);

    setLoading(true);

    fetchData();
  };
  return (
    <SafeAreaView style={styles.safeview}>
      <AppStatusBar></AppStatusBar>

      <Header Theme={''}></Header>

      <View>
        <Search
          Theme={''}
          filterData={container}
          setFilterData={setContainer}
          setSearchData={setSearchData}
          onChangeText={e => searchText(e)}
          Data={getForms}
          setData={setFroms}
          variable={2}
          setNoData={setNoData}
          setLoading={setLoading}
          text={'Search Groups by name for BM..'}
        />

        <DateChips
          clearFilter={removeChip}
          searchData={searchData}
          setSearchData={setSearchData}
        />

        {loading && (
          <ActivityIndicator
            style={{marginTop: 30}}
            color={Colors.parrotGreenColor}
          />
        )}

        {noData && <Nodata></Nodata>}

        {getCustomerFroms != null && (
          <SwipeListView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{paddingBottom: 220}}
            style={{
              marginBottom: 0,
              marginTop: 20,
              marginLeft: 20,
              marginRight: 20,
            }}
            data={getForms}
            renderItem={renderItem}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={() => {
                  fetchData();
                }}
                colors={[Colors.kulfa]}
              />
            }
            renderHiddenItem={(item, index) => (
              <View
                style={{
                  flexDirection: 'row',

                  alignItems: 'center',

                  marginRight: 10,

                  marginTop: 20,
                }}>
                <View style={{flex: 1}}></View>

                <View style={{}}>
                  <TouchableOpacity
                    onPress={() => {
                      Alert.alert(
                        'Delete!',

                        'Do you really want to delete?',

                        [
                          {
                            text: 'Cancel',

                            onPress: () => console.log('Cancel Pressed'),

                            style: 'cancel',
                          },
                          {
                            text: 'OK',
                            onPress: () => {
                              setDeleteChecker(false);
                              deleteRow(item, false);
                            },
                          },
                        ],
                      );
                    }}>
                    <MaterialCommunityIcons
                      name="delete-outline"
                      color={'#FF0000'}
                      size={26}
                    />
                  </TouchableOpacity>
                </View>
              </View>
            )}
            rightOpenValue={-75}
          />
        )}
      </View>

      <Toast {...toast} onDismiss={() => setToast({message: '', type: ''})} />

      <CustomProgressDialoge
        dialogVisible={progress}
        setDialogVisible={setProgresss}
        title={title}
      />
      {/* <ProgressDialog
        activityIndicatorColor={Colors.darkGreenColor}
        visible={progress}
        onTouchOutside={{}
          // () =>
          //  setprogressVisible(false)
          }
        title={dialogeCount}
        message="Please, wait..."
      /> */}
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
export default connect(null, mapDispatchToProps)(Groups);

const styles = StyleSheet.create({
  safeview: {
    flex: 1,
  },
  card: {
    marginTop: 10,
    marginLeft: 30,
    marginRight: 30,
    paddingLeft: 10,
  },
  row: {flexDirection: 'row', alignItems: 'center'},
  circle: {
    height: 30,
    width: 30,
    borderRadius: 100,
    marginLeft: 0,
    marginRight: 10,
    justifyContent: 'center',
    backgroundColor: '#f1f1f1',
  },
});
