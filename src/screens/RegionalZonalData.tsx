import React, {useRef} from 'react';
import {
  Pressable,
  ActivityIndicator,
  TextInput,
  Alert,
  StyleSheet,
  Dimensions,
  FlatList,
  View,
  TouchableOpacity,
  Image,
} from 'react-native';
import {
  AppStatusBar,
  CustomProgressDialoge,
  HeaderwithoutDialoge,
  Nodata,
  Tabsitems,
  TextView,
} from '../components';
import {Colors, GlobalStyles} from '../theme';
import {connect, useSelector} from 'react-redux';
import {useNavigation} from '@react-navigation/native';
import {
  downloadRegioalZonalData,
  getBmData,
  getObjectbyBranchManager,
  getRegioalZonalData,
  postCommentbyManagerOperation,
  UpdateLoanAmount,
  RejectuploadingCustomerdataRMZM,
  RejectuploadingCustomerdata,
} from '../apis_auth/apis';
import BMCustomersRecord from '../components/BMCustomersRecord';
import {GroupSyncdown, SingleCustomerSyncdown} from '../process/CommonProcess';
import {
  DeleteRegionalDownloadedData,
  checkingCustomerByCnic,
  checkingGroupsbyCompositekey,
  getAllDownloadedDataforRegional,
  getCommentsforRegionalById,
  getDownloadedDataforRegional,
  insertCustomerVisits,
  UpdateCustomerVisit,
} from '../sqlite/sqlitedb';
import Toast from '../components/Toast';
import {Modalize} from 'react-native-modalize';
import {ScrollView} from 'react-native-gesture-handler';
import ZoomableImage from '../components/ZoomableImage';
import {Dialog} from 'react-native-simple-dialogs';
const {height, width} = Dimensions.get('window');
import {Button} from 'react-native-paper';
import AntDesign from 'react-native-vector-icons/AntDesign';
import ModalListComponent from '../components/ModalListComponent';
import RejectCommentModal from '../components/RejectCommentModal';
import ImagePicker from 'react-native-image-crop-picker';
import Geolocation from '@react-native-community/geolocation';
import RNAndroidLocationEnabler from 'react-native-android-location-enabler';
import RNFS from 'react-native-fs';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Entypo from 'react-native-vector-icons/Entypo';
import {getCurrentLocation} from '../utilis/Locationgetter';
import {SwipeListView} from 'react-native-swipe-list-view';
import {
  DateSelector,
  FormInputs,
  VerificationIndicator,
  MyChipcomponent,
  CorrectiveActionPlans,
  Dropdownlist,
  Search,
} from '../components';

const RegionalZonalData = props => {
  const {item, verfication} = props.route.params;

  const navigation = useNavigation();
  const [index, setIndex] = React.useState(1);
  const [downloadedGroups, setDownloadedGroups] = React.useState(undefined);
  const [groups, setGroups] = React.useState(undefined);
  const [progressVisible, setProgressVisible] = React.useState(false);
  const [noData, setNoData] = React.useState(false);
  const [toast, setToast] = React.useState({value: '', type: ''});
  const [loader, setLoader] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [getImage, setImage] = React.useState(undefined);
  const getUserData = useSelector(state => state.UserData);

  const modalizeRef = useRef<Modalize>(null);
  const [refreshing, setRefreshing] = React.useState(false);
  const [selectedData, setSelectedData] = React.useState(undefined);
  const [comment, setComment] = React.useState(null);
  const [moComment, setCommentMO] = React.useState(null);
  const [dialoge, setDialoge] = React.useState(false);
  const [dialogeData, setDialogeData] = React.useState({});
  const [upadtingLoader, setUpdatingLoader] = React.useState(false);
  const [selectedStation, setSelectedStation] = React.useState(undefined);
  const [getStation, setStation] = React.useState([]);
  const gettingStations = getUserData.UserData.EmployeeStation;
  const [title, setTitle] = React.useState([]);
  const [progress, setProgresss] = React.useState(false);
  const [visitTypeArray, setVisitType] = React.useState([
    'Physical Visit',
    'Non-Physical Visit',
  ]);
  const [modalVisiblereject, setModalVisibleReject] = React.useState(false);
  const [rejectComment, setRejectComment] = React.useState('');
  const [rejectTargetGroupId, setRejectTargetGroupId] = React.useState<string | undefined>(undefined);
  const [rejectedGroupIds, setRejectedGroupIds] = React.useState<string[]>([]);
  const UpdateReducer = useSelector(state => state.UpdateReducer);
  var updateCheck = UpdateReducer.updateCheck;
  const CustomGetDataModule = useSelector(
    state => state.GroupArrayReducer.groupArray,
  );

  const [allDataobj, setAlldataobj] = React.useState(
    updateCheck.value ? item : CustomGetDataModule,
  );

  const onOpen = () => {
    modalizeRef.current?.open();
  };

  React.useEffect(() => {
    // console.log('station===>>>', gettingStations)
    settingUpStations();
    // gettingStationwiseData(item.stationId);
    // const unsubscribe = props.navigation.addListener('focus', () => {
    // });
    // // Return the function to unsubscribe from the event so it gets removed on unmount
    // return unsubscribe;
  }, [navigation]);

  const settingUpStations = () => {
    let temp = [];
    gettingStations.map((item, index) => {
      temp.push({label: item.StationName, stationId: item.StationId});
    });
    setStation([...temp]);
  };

  const gettingStationwiseData = async stationId => {
    setProgressVisible(true);
    setGroups(undefined);
    //setSelectedData({})

    console.log('gettingStationwiseData', stationId);
    getDownloadedData(stationId);
    getRegioalZonalData(stationId)
      .then(res => {
        if (res) {
          if (res === 'No data Found') {
            setToast({
              message: 'Sorry! data not found on this station.',
              type: 'error',
            });
            setProgressVisible(true);
            setNoData(true);
            return;
          } else {
            setNoData(false);
          }
          // let parser=JSON.parse(res);
          console.log(
            '<=====================customers Objet==========================>',
          );
          console.log('customers Objet==>', res);
          console.log(
            '<=====================customers Objet==========================>',
          );
          let making = [];
          res?.map((item, index) => {
            getDownloadedDataforRegional(item.CustomerGroupId)
              .then(count => {
                if (count == 0) {
                  making.push({...item, alreadySynced: false});
                } else {
                  making.push({...item, alreadySynced: true});
                }
                if (index == res.length - 1) {
                  console.log('making', making);
                  setGroups(making);
                  setProgressVisible(false);
                }
              })
              .catch(err => {
                console.log('err==>', err);
              });
            setProgressVisible(false);
          });
        } else {
          console.log('Result is null');
          setProgressVisible(false);
        }
      })
      .catch(error => {
        console.log('catch works=>' + error);
        setProgressVisible(false);
      });
  };

  const getDownloadedData = async id => {
    getAllDownloadedDataforRegional(id)
      .then(res => {
        setDownloadedGroups([...res]);
      })
      .catch(err => {});
  };

  const renderItemGroups = ({item, indexx}) => (
    <View style={{position: 'relative'}}>
      <BMCustomersRecord
        FirstName={item.GroupName.replace(/  /g, '')}
        NICNumber={''}
        iconName={'account-group'}
        indexer={index}
        onPress={() => {
          if (index == 2) {
            var parser = JSON.parse(item.GroupData);
            var adder = parser?.groupObject;
            adder['alreadySynced'] = true;
            if (item?.Comments != null) {
              adder['commentSubmit'] = true;
              var parser2 = JSON.parse(item?.Comments);
              setComment(parser2.group_comments);
              setImage(parser2.groupImage);
            } else {
              setImage(undefined);
              setComment(null);
              adder['commentSubmit'] = false;
            }
            setSelectedData(adder);
            onOpen();
          } else {
            setSelectedData(item);
            onOpen();
          }
        }}
        type={'2'}
        icons={true}
        progressVisible={item.loading}
        alreadySynced={item.alreadySynced}></BMCustomersRecord>

      {index == 2 && (getUserData?.UserData?.EmployeeTypeId == '8' || getUserData?.UserData?.EmployeeTypeId == 8 || getUserData?.UserData?.EmployeeTypeId == '3' || getUserData?.UserData?.EmployeeTypeId == 3) && (
        <TouchableOpacity
          onPress={() => {
            const groupId = item?.CustomerGroupId || item?.item?.CustomerGroupId || item?.GroupId || item?.groupId || item?.CustomerGroupID;
            const resolvedGroupId = groupId ? groupId : (JSON.parse(item.GroupData)?.groupObject?.CustomerGroupId);
            if (rejectedGroupIds.includes(resolvedGroupId)) {
              Alert.alert('Already Rejected', 'This group is already rejected.');
              return;
            }
            setRejectTargetGroupId(resolvedGroupId);
            setRejectComment('');
            setModalVisibleReject(true);
          }}
          style={{position: 'absolute', right: 15, top: 54}}>
          <Entypo name="block" color={Colors.parrotGreenColor} size={20} />
        </TouchableOpacity>
      )}
    </View>
  );

  const _onPressDetails = item => {
    if (index != 2) {
      setDialoge(true);
      setDialogeData(item);
    } else {
      modalizeRef.current?.close();
      Alert.alert(
        'Are you sure?',
        'Do you want to open the customer details..',
        [
          {
            text: 'Yes',
            onPress: () => {
              var itemer = {
                NicNumber: item?.NicNumber,
                CustomerGroupId: selectedData?.CustomerGroupId,
              };
              console.log('itemer==>', item)
              navigation.navigate('UserDetailForZM', {item: itemer});
            },
          },
          {text: 'No'},
        ],
      );
    }
  };
  const _onPressSubmit = () => {
    if (getUserData.UserData.EmployeeTypeName == 'Area Manager') {
      if (comment == null) {
        Alert.alert('Stop!', 'Please enter comment');
      } else if (
        getImage == undefined &&
        allDataobj?.visitType?.value != 'Non-Physical Visit'
      ) {
        Alert.alert('Stop!', 'Please insert Image for Verification');
      } else if (comment.length <= 0) {
        Alert.alert('Stop!', 'Please enter comment');
      } else if (comment.length > 1) {
        setProgresss(true);
        setTitle('Getting Location..');
        getCurrentLocation(async (position, mocked) => {
          if (position) {
            var lat = position.coords.latitude;
            var lon = position.coords.longitude;
            var loc = lat + '-' + lon;
            console.log('loc==>', loc);
            var maker = {
              employee_id: getUserData.UserData.EmployeeId,
              employee_typeid: getUserData.UserData.EmployeeTypeId,
              group_id: selectedData.CustomerGroupId,
              group_comments: comment,
              group_commentsMO: moComment,
              loc: loc,
              groupImage: getImage,
              visitType: allDataobj.visitType,
            };
            setProgresss(false);
            // setLoading(true);
            UpdateCustomerVisit(
              JSON.stringify(maker),
              selectedData.CustomerGroupId,
            )
              .then(res => {
                console.log('-->Res', res);
              })
              .catch(err => {
                console.log('error-->', err);
              });
            setImage(undefined);
            gettingStationwiseData(selectedStation?.stationId);
            modalizeRef.current.close();
          } else {
            setProgresss(false);
            Alert.alert(
              'Sorry!',
              'Could not get your location, you cannot proceed',
            );
          }
          //   alert(JSON.stringify(position.coords.latitude))
        });
      }
    } else {
      if (moComment == null) {
        Alert.alert('Stop!', 'Please  enter comment');
      } else if (
        getImage == undefined &&
        allDataobj?.visitType?.value != 'Non-Physical Visit'
      ) {
        Alert.alert('Stop!', 'Please insert Image for Verification');
      } else if (moComment.length <= 0) {
        Alert.alert('Stop!', 'Please enter comment');
      } else if (moComment.length > 1) {
        setProgresss(true);
        setTitle('Getting Location..');

        getCurrentLocation(async (position, mocked) => {
          if (position) {
            var lat = position.coords.latitude;
            var lon = position.coords.longitude;
            var loc = lat + '-' + lon;
            console.log('loc==>', loc);
            var maker = {
              employee_id: getUserData.UserData.EmployeeId,
              employee_typeid: getUserData.UserData.EmployeeTypeId,
              group_id: selectedData.CustomerGroupId,
              group_comments: comment,
              group_commentsMO: moComment,
              loc: loc,
              groupImage: getImage,
              visitType: allDataobj.visitType,
            };

            setProgresss(false);
            // setLoading(true);
            UpdateCustomerVisit(
              JSON.stringify(maker),
              selectedData.CustomerGroupId,
            )
              .then(res => {
                console.log('-->Res', res);
              })
              .catch(err => {
                console.log('error-->', err);
              });

            setImage(undefined);
            gettingStationwiseData(selectedStation?.stationId);
            modalizeRef.current.close();
          } else {
            setProgresss(false);
            Alert.alert(
              'Sorry!',
              'Could not get your location, you cannot proceed',
            );
          }
          //   alert(JSON.stringify(position.coords.latitude))
        });
      }
    }
  };
  const _onPressSyncup = () => {
    getCommentsforRegionalById(selectedData.CustomerGroupId)
      .then(res => {
        var parser = JSON.parse(res[0].Comments);
        // console.log('res==>', parser.employee_id)

        var maker = {
          employee_id: parser.employee_id,
          employee_typeid: parser.employee_typeid,
          group_id: parser.group_id,
          group_comments: comment,
          moComment: moComment,
          loc: parser.loc,
          groupImage: getImage,
          visitType: allDataobj.visitType.value,
        };

        postCommentbyManagerOperation(maker)
          .then(res => {
            setLoading(false);
            setToast({message: res?.msg, type: 'success'});
            modalizeRef.current?.close();
            if (res.msg == 'Token/Check has been Generate Successfully') {
              DeleteRegionalDownloadedData(res.id);
            }
          })
          .catch(error => {
            setLoading(false);
            Alert.alert('Error', error);
          });
      })
      .catch(err => {});
  };
  const _onPresshandleUpdate = () => {
    setLoading(true);
    getCommentsforRegionalById(selectedData.CustomerGroupId)
      .then(res => {
        var parser = JSON.parse(res[0].Comments);
        console.log('res==>', parser.employee_id);

        var maker = {
          employee_id: parser.employee_id,
          employee_typeid: parser.employee_typeid,
          group_id: parser.group_id,
          group_comments: comment,
          group_commentsMO: moComment,
          loc: parser.loc,
          groupImage: getImage,
          visitType: allDataobj.visitType,
        };
        // console.log("After Update=====>"+JSON.stringify (maker))
        UpdateCustomerVisit(JSON.stringify(maker), selectedData.CustomerGroupId)
          .then(res => {
            console.log('-->Res', res);
          })
          .catch(err => {
            console.log('error-->', err);
          });

        setImage(undefined);
        setLoading(false);
        gettingStationwiseData(selectedStation?.stationId);
        modalizeRef.current.close();
      })
      .catch(err => {
        console.log('err==>', err);
        setLoading(false);
      });
  };

  const _handleUpdateAmount = () => {
    const {LoanId, ApprovedLoanAmount} = dialogeData;
    if (ApprovedLoanAmount <= 0) {
      Alert.alert('Stop!', 'Please enter valid amount');
    } else if (ApprovedLoanAmount.length < 0) {
      Alert.alert('Stop!', 'Please enter valid amount');
    } else {
      Alert.alert('Await!', 'Do you really want to update amount?', [
        {
          text: 'Yes',
          onPress: () => {
            console.log('LoanId', LoanId);
            console.log('ApprovedLoanAmount', ApprovedLoanAmount);
            updateAmount(dialogeData);
          },
        },
        {
          text: 'No',
          onPress: () => {},
        },
      ]);
    }
  };
  const updateAmount = itemm => {
    setUpdatingLoader(true);
    UpdateLoanAmount(itemm)
      .then(res => {
        console.log('res', res);
        setUpdatingLoader(false);
        setDialoge(false);
        setDialogeData({});
        modalizeRef.current?.close();
        gettingStationwiseData(selectedStation?.stationId);
      })
      .catch(error => {
        Alert.alert('Error', error);
        setUpdatingLoader(false);
        setDialoge(false);
        setDialogeData({});
        modalizeRef.current?.close();
      });
  };

  const downloadGroup = itemx => {
    setLoading(true);
    var maker = [];
    var customerNic = itemx.Customers[0].NicNumber;
    console.log('here we go==-===>' + JSON.stringify(itemx));

    maker.push(itemx.CustomerGroupId);

    downloadRegioalZonalData(maker, selectedData?.Customers.length, customerNic)
      .then(res => {
        var name = itemx.GroupName.replace(/  /g, '');
        res[0]['groupObject'] = itemx;
        insertCustomerVisits(
          name,
          JSON.stringify(res[0]),
          itemx.CustomerGroupId,
          selectedStation?.stationId,
          selectedStation?.label,
        )
          .then(result => {
            // console.log("insert",result)
            setLoading(false);
            modalizeRef.current?.close();
            gettingStationwiseData(selectedStation?.stationId);
          })
          .catch(error => {
            setLoading(false);
            console.log('error', error);
            Alert.alert('Stop!', 'No data found!');
          });
      })
      .catch(error => {
        console.log('error', error);
        setLoader(false);
      });
  };
  const capture = () => {
    takePhoto();
  };
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
        setImage(data);
      })
      .catch(e => {});
  };

  return (
    <>
      <AppStatusBar></AppStatusBar>
      <View style={GlobalStyles.row}>
        <HeaderwithoutDialoge Theme={Colors} back={true}></HeaderwithoutDialoge>
        <TextView
          type={'mini_heading22'}
          style={{paddingHorizontal: 30, marginTop: 55, fontSize: 15}}
          text="Pending visits"></TextView>
      </View>

      <View
        style={{margin: 20, alignItems: 'center', borderTopRightRadius: 10}}>
        <ModalListComponent
          text={''}
          required={false}
          type={2}
          tempdata={getStation}
          //stylesfrom={{padding:10}}
          label={
            selectedStation == undefined
              ? 'Select Station'
              : selectedStation.label
          }
          onSelect={async (value, underindex) => {
            //console.log(value)
            gettingStationwiseData(value.stationId);
            setSelectedStation(value);
          }}
        />
      </View>

      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}>
        <Tabsitems
          text={'All'}
          active={index == 1 ? true : false}
          onPress={() => {
            setIndex(1);
          }}
        />

        <Tabsitems
          text={'Downloaded'}
          active={index == 2 ? true : false}
          onPress={() => {
            setIndex(2);
          }}
        />
      </View>

      {progressVisible && (
        <ActivityIndicator
          style={{margin: 20}}
          size="large"
          color={Colors.parrotGreenColor}
        />
      )}
      {noData && <Nodata></Nodata>}

      {index == 1 && (
        <View style={{flex: 1, margin: 20}}>
          {groups != undefined && (
            <FlatList
              data={groups}
              refreshing={refreshing}
              onRefresh={() => {
                gettingStationwiseData(selectedStation?.stationId);
              }}
              showsVerticalScrollIndicator={false}
              renderItem={renderItemGroups}
              keyExtractor={item => item.id}
            />
          )}
        </View>
      )}

      {index == 2 && (
        <View style={{flex: 1, margin: 20}}>
          {downloadedGroups != undefined && (
            <SwipeListView
              refreshing={refreshing}
              onRefresh={() => {
                gettingStationwiseData(selectedStation?.stationId);
              }}
              showsVerticalScrollIndicator={false}
              style={{}}
              data={downloadedGroups}
              renderItem={renderItemGroups}
              keyExtractor={item => item.id}
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
                  {(getUserData?.UserData?.EmployeeTypeId == '8' || getUserData?.UserData?.EmployeeTypeId == 8 || getUserData?.UserData?.EmployeeTypeId == '3' || getUserData?.UserData?.EmployeeTypeId == 3) && (
                    <View style={{marginRight: 10}}>
                      <TouchableOpacity
                        onPress={() => {
                          const groupId = item?.item?.CustomerGroupId;
                          if (rejectedGroupIds.includes(groupId)) {
                            Alert.alert('Already Rejected', 'This group is already rejected.');
                            return;
                          }
                          setRejectTargetGroupId(groupId);
                          setRejectReason('');
                          setRejectDialogVisible(true);
                        }}>
                        <View
                          style={{
                            justifyContent: 'center',
                            height: 50,
                            width: 50,
                            borderRadius: 10,
                            backgroundColor: '#ffe6e6',
                          }}>
                          <MaterialCommunityIcons
                            name="close-octagon-outline"
                            color={'#FF0000'}
                            size={26}
                          />
                        </View>
                      </TouchableOpacity>
                    </View>
                  )}
                  <View style={{}}>
                    <TouchableOpacity
                      onPress={() => {
                        DeleteRegionalDownloadedData(
                          item?.item?.CustomerGroupId,
                        ).then(res => {
                          index[item.item.key].closeRow();
                          let get2 = downloadedGroups;
                          get2.splice(item.index, 1);
                          setDownloadedGroups([...get2]);
                          gettingStationwiseData(selectedStation?.stationId);
                        });
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
              rightOpenValue={-130}
            />
          )}
        </View>
      )}
      <Modalize ref={modalizeRef} snapPoint={height / 1.8}>
        <ScrollView showsVerticalScrollIndicator={false}>
          {selectedData != undefined && (
            <View style={{paddingTop: 30, paddingBottom: 30}}>
              <TextView
                text={selectedData.GroupName.replace(/  /g, '')}
                style={{color: '#7d7d7d', marginLeft: 20}}></TextView>

              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  marginTop: 20,
                }}>
                <TextView
                  text="Customer Name"
                  style={{
                    fontWeight: 'bold',
                    flex: 1,
                    fontSize: 12,
                    color: '#000',
                    marginRight: 20,
                    marginLeft: 20,
                  }}></TextView>
                <TextView
                  text="Cnic Number"
                  style={{
                    fontWeight: 'bold',
                    flex: 0.8,
                    fontSize: 12,
                    color: '#000',
                    marginRight: 20,
                    marginLeft: 20,
                  }}></TextView>
                <TextView
                  text="RSKRiskProfile"
                  style={{
                    fontWeight: 'bold',
                    flex: 0.8,
                    fontSize: 12,
                    color: '#000',
                    marginRight: 20,
                    marginLeft: 20,
                  }}></TextView>
                <TextView
                  text="ApprovedLoanAmount"
                  style={{
                    fontWeight: 'bold',
                    flex: 1.3,
                    fontSize: 12,
                    color: '#000',
                    marginRight: 20,
                    marginLeft: 20,
                  }}></TextView>
              </View>
              {selectedData.Customers != undefined &&
                selectedData.Customers.map((item, index) => {
                  return (
                    <TouchableOpacity
                      onPress={() => _onPressDetails(item)}
                      style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        marginTop: 20,
                        backgroundColor: '#f1f1f1',
                        height: 80,
                      }}>
                      <TextView
                        text={item.Fullname}
                        style={{
                          flex: 1,
                          fontSize: 12,
                          color: '#000',
                          marginRight: 20,
                          marginLeft: 20,
                        }}></TextView>
                      <TextView
                        text={item.NicNumber}
                        style={{
                          flex: 1,
                          fontSize: 12,
                          color: '#000',
                          marginRight: 20,
                          marginLeft: 20,
                        }}></TextView>
                      <TextView
                        text={
                          item.RSKRiskProfile == 0
                            ? 'Low'
                            : item.RSKRiskProfile == 0.5
                            ? 'Medium'
                            : 'High'
                        }
                        style={{
                          textAlign: 'center',
                          flex: 0.8,
                          fontSize: 12,
                          color: '#000',
                          marginRight: 20,
                          marginLeft: 20,
                        }}></TextView>
                      <TextView
                        text={item.ApprovedLoanAmount}
                        style={{
                          flex: 1.2,
                          fontSize: 12,
                          color: '#000',
                          marginRight: 20,
                          marginLeft: 20,
                        }}></TextView>
                    </TouchableOpacity>
                  );
                })}

              {index == 2 && (
                <View>
                  <View
                    style={{
                      height: 250,
                      alignSelf: 'center',
                      marginTop: 30,
                      width: width / 2.5,
                      justifyContent: 'center',
                    }}>
                    {allDataobj.visitType.value == 'Physical Visit' && (
                      <TextView
                        style={{alignSelf: 'center', marginTop: 100}}
                        type={'small'}
                        text="Group Image"></TextView>
                    )}
                    {getImage == undefined ? (
                      allDataobj.visitType.value == 'Physical Visit' && (
                        <MaterialCommunityIcons
                          style={{alignSelf: 'center'}}
                          name="google-photos"
                          size={56}></MaterialCommunityIcons>
                      )
                    ) : (
                      <ZoomableImage
                        images={`data:image/gif;base64,${getImage}`}
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
                      {allDataobj.visitType.value == 'Physical Visit' && (
                        <Pressable
                          onPressIn={capture}
                          style={{
                            height: 30,
                            width: width / 6,
                            borderRadius: 30,
                            marginBottom: 20,
                            backgroundColor: '#f1f1f1',
                            justifyContent: 'center',
                          }}>
                          <TextView
                            style={{textAlign: 'center'}}
                            type={'small'}
                            text="Camera"></TextView>
                        </Pressable>
                      )}
                    </View>
                  </View>
                  <View style={{flexDirection: 'row', position: 'absolute'}}>
                    <TextView
                      style={{
                        alignSelf: 'center',
                        marginLeft: 50,
                        marginRight: 100,
                      }}
                      type={'small'}
                      text="Visit Type"></TextView>

                    <Dropdownlist
                      data={visitTypeArray}
                      label={
                        allDataobj?.visitType?.value == ''
                          ? 'Non-Physical'[0]
                          : allDataobj?.visitType?.value
                      }
                      onSelect={async value => {
                        let get = allDataobj;
                        get.visitType = {value: visitTypeArray[value]};
                        setAlldataobj({...get});
                      }}></Dropdownlist>
                  </View>
                  {/* for Area Manager View */}

                  {getUserData.UserData.EmployeeTypeName == 'Area Manager' && (
                    <TextView
                      style={{
                        alignSelf: 'flex-start',
                        marginTop: 0,
                        marginLeft: 25,
                        top: 20,
                      }}
                      type={'small'}
                      text="Comment by Field Officer"></TextView>
                  )}
                  {getUserData.UserData.EmployeeTypeName == 'Area Manager' && (
                    <TextInput
                      value={selectedData.fieldofficerComment}
                      editable={false}
                      multiline={true}
                      placeholder={'Comment by field officer'}
                      style={styles.commentAreaZm}></TextInput>
                  )}

                  {getUserData.UserData.EmployeeTypeName == 'Area Manager' && (
                    <TextView
                      style={{
                        alignSelf: 'flex-start',
                        marginTop: 0,
                        marginLeft: 25,
                        top: 20,
                      }}
                      type={'small'}
                      text="Comment by Branch Manager"></TextView>
                  )}

                  {getUserData.UserData.EmployeeTypeName == 'Area Manager' && (
                    <TextInput
                      value={selectedData.branchManagerComment}
                      editable={false}
                      multiline={true}
                      placeholder={'Comment by Branch Manager'}
                      style={styles.commentAreaZm}></TextInput>
                  )}

                  {getUserData.UserData.EmployeeTypeName == 'Area Manager' && (
                    <TextView
                      style={{
                        alignSelf: 'flex-start',
                        marginTop: 0,
                        marginLeft: 25,
                        top: 20,
                      }}
                      type={'small'}
                      text="Comment by Verification Officer"></TextView>
                  )}
                  {getUserData.UserData.EmployeeTypeName == 'Area Manager' && (
                    <TextInput
                      value={selectedData.voComment}
                      editable={false}
                      multiline={true}
                      placeholder={'Comment by Verification Officer'}
                      style={styles.commentAreaZm}></TextInput>
                  )}

                  {getUserData.UserData.EmployeeTypeName == 'Area Manager' && (
                    <TextView
                      style={{
                        alignSelf: 'flex-start',
                        marginTop: 45,
                        marginLeft: 25,
                      }}
                      type={'small'}
                      text="Comment by Area Manager"></TextView>
                  )}
                  {getUserData.UserData.EmployeeTypeName == 'Area Manager' && (
                    <TextInput
                      value={comment}
                      editable={true}
                      multiline={true}
                      onChangeText={text => setComment(text)}
                      placeholder={'Comment by Area Manager'}
                      style={styles.commentArea}></TextInput>
                  )}
                  {/* end here */}
                  {getUserData.UserData.EmployeeTypeName ==
                    'Manager Operation' && (
                    <TextView
                      style={{
                        alignSelf: 'flex-start',
                        marginTop: 0,
                        marginLeft: 25,
                        top: 20,
                      }}
                      type={'small'}
                      text="Comment by Field Officer"></TextView>
                  )}
                  {getUserData.UserData.EmployeeTypeName ==
                    'Manager Operation' && (
                    <TextInput
                      value={selectedData.fieldofficerComment}
                      editable={false}
                      multiline={true}
                      placeholder={'Comment by Field Officer'}
                      style={styles.commentAreaZm}></TextInput>
                  )}

                  {getUserData.UserData.EmployeeTypeName ==
                    'Manager Operation' && (
                    <TextView
                      style={{
                        alignSelf: 'flex-start',
                        marginTop: 0,
                        marginLeft: 25,
                        top: 20,
                      }}
                      type={'small'}
                      text="Comment by Branch Manager"></TextView>
                  )}

                  {getUserData.UserData.EmployeeTypeName ==
                    'Manager Operation' && (
                    <TextInput
                      value={selectedData.branchManagerComment}
                      editable={false}
                      multiline={true}
                      placeholder={'Comment by Branch Manager'}
                      style={styles.commentAreaZm}></TextInput>
                  )}

                  {getUserData.UserData.EmployeeTypeName ==
                    'Manager Operation' && (
                    <TextView
                      style={{
                        alignSelf: 'flex-start',
                        marginTop: 0,
                        marginLeft: 25,
                        top: 20,
                      }}
                      type={'small'}
                      text="Comment by Verification Officer"></TextView>
                  )}
                  {getUserData.UserData.EmployeeTypeName ==
                    'Manager Operation' && (
                    <TextInput
                      value={selectedData.voComment}
                      editable={false}
                      multiline={true}
                      placeholder={'Comment by Verification Officer'}
                      style={styles.commentAreaZm}></TextInput>
                  )}

                  {getUserData.UserData.EmployeeTypeName ==
                    'Manager Operation' && (
                    <TextView
                      style={{
                        alignSelf: 'flex-start',
                        marginTop: 0,
                        marginLeft: 25,
                        top: 20,
                      }}
                      type={'small'}
                      text="Comment by Area Manager"></TextView>
                  )}
                  {getUserData.UserData.EmployeeTypeName ==
                    'Manager Operation' && (
                    <TextInput
                      value={selectedData.rmComment}
                      editable={false}
                      multiline={true}
                      placeholder={'Comment by Area Manager'}
                      style={styles.commentAreaZm}></TextInput>
                  )}

                  {getUserData.UserData.EmployeeTypeName ==
                    'Manager Operation' && (
                    <TextView
                      style={{
                        alignSelf: 'flex-start',
                        marginTop: 0,
                        marginLeft: 25,
                        top: 20,
                      }}
                      type={'small'}
                      text="Comment by Credite Officer"></TextView>
                  )}
                  {getUserData.UserData.EmployeeTypeName ==
                    'Manager Operation' && (
                    <TextInput
                      value={selectedData.committeeComments}
                      editable={false}
                      multiline={true}
                      placeholder={'Comment by Area Manager'}
                      style={styles.commentCredite}></TextInput>
                  )}

{getUserData.UserData.EmployeeTypeName ==
                    'Manager Operation' && (
                    <TextView
                      style={{
                        alignSelf: 'flex-start',
                        marginTop: 0,
                        marginLeft: 25,
                        top: 20,
                      }}
                      type={'small'}
                      text="Comment by Operation Manager"></TextView>
                  )}

                  {getUserData.UserData.EmployeeTypeName ==
                    'Manager Operation' && (
                    <TextInput
                      value={moComment}
                      multiline={true}
                      onChangeText={text => setCommentMO(text)}
                      placeholder={'Comment by Operation Manager'}
                      style={styles.commentBox}></TextInput>
                  )}

                  {loading && (
                    <ActivityIndicator
                      style={{margin: 20}}
                      size="large"
                      color={Colors.parrotGreenColor}
                    />
                  )}

                  {selectedData?.commentSubmit == false ? (
                    <TouchableOpacity
                      onPress={_onPressSubmit}
                      activeOpacity={0.8}
                      style={styles.button}>
                      <TextView
                        style={{color: '#FFF'}}
                        text={'Submit'}></TextView>
                    </TouchableOpacity>
                  ) : (
                    <View>
                      <TouchableOpacity
                        onPress={_onPresshandleUpdate}
                        activeOpacity={0.8}
                        style={styles.button}>
                        <TextView
                          style={{color: '#FFF'}}
                          text={'Update'}></TextView>
                      </TouchableOpacity>
                      <TouchableOpacity
                        onPress={_onPressSyncup}
                        activeOpacity={0.8}
                        style={styles.button}>
                        <TextView
                          style={{color: '#FFF'}}
                          text={'Syncup'}></TextView>
                      </TouchableOpacity>
                    </View>
                  )}
                </View>
              )}
              {!selectedData?.alreadySynced && (
                <View>
                  {loading && (
                    <ActivityIndicator
                      style={{margin: 20}}
                      size="large"
                      color={Colors.parrotGreenColor}
                    />
                  )}

                  <TouchableOpacity
                    onPress={() => downloadGroup(selectedData)}
                    activeOpacity={0.8}
                    style={styles.button}>
                    <TextView
                      style={{color: '#FFF'}}
                      text={'Download Group'}></TextView>
                  </TouchableOpacity>
                </View>
              )}
            </View>
          )}
        </ScrollView>
      </Modalize>

      <RejectCommentModal
        onPress={() => {
          if (!rejectComment || rejectComment.trim().length === 0) {
            Alert.alert('Stop!', 'Please enter reject reason');
            return;
          }
          if (!rejectTargetGroupId) {
            setModalVisibleReject(false);
            return;
          }
          const empType = getUserData?.UserData?.EmployeeTypeId;
          const groupId = rejectTargetGroupId;
          setModalVisibleReject(false);
          setProgresss(true);
          const onDone = () => {
            setProgresss(false);
            setRejectedGroupIds(prev => [...prev, groupId]);
            DeleteRegionalDownloadedData(groupId)
              .then(() => {
                if (modalizeRef.current) {
                  modalizeRef.current.close();
                }
                setDownloadedGroups(prev =>
                  Array.isArray(prev)
                    ? prev.filter(g =>
                        (g?.CustomerGroupId ?? g?.groupId ?? g?.CustomerGroupID) !== groupId,
                      )
                    : prev,
                );
                gettingStationwiseData(selectedStation?.stationId);
              })
              .catch(() => {
                gettingStationwiseData(selectedStation?.stationId);
              });
            Alert.alert('Success', 'Group has been rejected successfully');
          };
          const onError = (e) => {
            setProgresss(false);
            Alert.alert('Error', 'Unable to reject group.');
          };
          if (empType == '8' || empType == 8 || empType == '3' || empType == 3) {
            RejectuploadingCustomerdataRMZM(groupId, rejectComment)
              .then(onDone)
              .catch(onError);
          } else if (empType == '33' || empType == 33 || empType == '5' || empType == 5) {
            RejectuploadingCustomerdata(groupId, rejectComment)
              .then(onDone)
              .catch(onError);
          } else {
            RejectuploadingCustomerdataRMZM(groupId, rejectComment)
              .then(onDone)
              .catch(onError);
          }
        }}
        modalVisiblereject={modalVisiblereject}
        setModalVisibleReject={setModalVisibleReject}
        setCommentRecject={setRejectComment}
        comment={rejectComment}
      />

      <Dialog
        visible={dialoge}
        title=""
        dialogStyle={{
          width: width / 1.2,
          height: height / 2.5,
          alignSelf: 'center',
          borderRadius: 20,
          elevation: 20,
        }}
        onTouchOutside={() => setDialoge(false)}>
        <View>
          <TouchableOpacity
            onPress={() => {
              setDialoge(false);
            }}
            style={{alignSelf: 'flex-end'}}>
            <AntDesign
              size={30}
              color={Colors.red}
              name="closecircleo"></AntDesign>
          </TouchableOpacity>
          <TextView text={dialogeData.Fullname}></TextView>
          {index != 2 && (
            <View>
              <TextInput
                style={{
                  backgroundColor: '#f1f1f1',
                  borderRadius: 20,
                  marginTop: 10,
                  padding: 10,
                  height: height / 12,
                }}
                value={dialogeData.ApprovedLoanAmount}
                onChangeText={text =>
                  setDialogeData({...dialogeData, ApprovedLoanAmount: text})
                }></TextInput>
              {upadtingLoader && (
                <ActivityIndicator
                  style={{margin: 20}}
                  size="large"
                  color={Colors.parrotGreenColor}
                />
              )}
              {/* *****************  Update Loan Amount  STARTS************************************** */}

              <TouchableOpacity
                style={{
                  borderRadius: 10,
                  elevation: 20,
                  margin: 20,
                  width: width / 2,
                  height: height / 20,
                  backgroundColor: Colors.parrotGreenColor,
                  alignSelf: 'center',
                  justifyContent: 'center',
                }}
                onPress={() => _handleUpdateAmount()}>
                <TextView
                  style={{
                    fontSize: 14,
                    color: '#FFF',
                    textAlign: 'center',
                    alignSelf: 'center',
                  }}
                  text={'Update Loan Amount'}></TextView>
              </TouchableOpacity>
              {/* *****************  Update Loan Amount  END************************************** */}

              {false && (
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    alignSelf: 'center',
                    margin: 20,
                  }}>
                  <View>
                    <TextView text={'-'} style={{color: '#cdcdcd'}}></TextView>
                  </View>
                  <View>
                    <TextView text={'-'} style={{color: '#cdcdcd'}}></TextView>
                  </View>
                  <View>
                    <TextView text={'-'} style={{color: '#cdcdcd'}}></TextView>
                  </View>
                  <View>
                    <TextView text={'-'} style={{color: '#cdcdcd'}}></TextView>
                  </View>
                  <View>
                    <TextView text={'-'} style={{color: '#cdcdcd'}}></TextView>
                  </View>
                  <View>
                    <TextView text={'OR'} style={{color: '#cdcdcd'}}></TextView>
                  </View>

                  <View>
                    <TextView text={'-'} style={{color: '#cdcdcd'}}></TextView>
                  </View>
                  <View>
                    <TextView text={'-'} style={{color: '#cdcdcd'}}></TextView>
                  </View>
                  <View>
                    <TextView text={'-'} style={{color: '#cdcdcd'}}></TextView>
                  </View>
                  <View>
                    <TextView text={'-'} style={{color: '#cdcdcd'}}></TextView>
                  </View>
                  <View>
                    <TextView text={'-'} style={{color: '#cdcdcd'}}></TextView>
                  </View>
                </View>
              )}
            </View>
          )}
          {/* *****************  Loan Details  STARTS************************************** */}

          {index == 2 && (
            <TouchableOpacity
              style={{
                borderRadius: 10,
                elevation: 20,
                margin: 20,
                width: width / 2,
                height: height / 20,
                backgroundColor: Colors.parrotGreenColor,
                alignSelf: 'center',
                justifyContent: 'center',
              }}
              onPress={() => {
                setDialoge(false);
                modalizeRef.current.close();
                setTimeout(() => {
                  var item = {
                    NicNumber: dialogeData?.NicNumber,
                    CustomerGroupId: selectedData?.CustomerGroupId,
                  };
                  navigation.navigate('UserDetailForZM', {item: item});
                }, 50);
              }}>
              <TextView
                style={{
                  fontSize: 14,
                  color: '#FFF',
                  textAlign: 'center',
                  alignSelf: 'center',
                }}
                text={'Show Loan Details'}></TextView>
            </TouchableOpacity>
          )}
          {/* *****************  ULoan Details  STARTS************************************** */}
        </View>
      </Dialog>
      <CustomProgressDialoge
        dialogVisible={progress}
        setDialogVisible={setProgresss}
        title={title}
      />
      <Toast {...toast} onDismiss={() => setToast({message: '', type: ''})} />
    </>
  );
};
export default RegionalZonalData;
const styles = StyleSheet.create({
  commentArea: {
    height: 120,
    width: width / 1.2,
    textAlignVertical: 'top',
    backgroundColor: '#f1f1f1',
    padding: 10,
    borderRadius: 10,
    elevation: 10,
    margin: 30,
    alignSelf: 'center',
  },
  commentAreaZm: {
    height: 'auto',
    width: width / 1.2,
    textAlignVertical: 'top',
    backgroundColor: '#f1f1f1',
    padding: 10,
    borderRadius: 10,
    elevation: 10,
    margin: 30,
    alignSelf: 'center',
  },
  commentCredite: {
    height: 50,
    width: width / 1.2,
    textAlignVertical: 'top',
    backgroundColor: '#f1f1f1',
    padding: 10,
    borderRadius: 10,
    elevation: 10,
    margin: 30,
    alignSelf: 'center',
  },
  commentBox: {
    height: 120,
    width: width / 1.2,
    textAlignVertical: 'top',
    backgroundColor: '#f1f1f1',
    padding: 10,
    borderRadius: 10,
    elevation: 10,
    margin: 40,
    alignSelf: 'center',
  },
  button: {
    height: 60,
    width: 200,
    alignSelf: 'center',
    marginTop: 20,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.parrotGreenColor,
    padding: 10,
    borderRadius: 20,
    elevation: 10,
  },
});
