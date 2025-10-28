

import React, { useEffect, useState } from 'react';
import type { Node } from 'react';
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
  View, TouchableOpacity,
  RefreshControl
} from 'react-native';
import RNFS from 'react-native-fs';

import moment from 'moment'
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
import { DeleteAssetsImages, DeleteCustomerForms, DeleteCustomerFormsbyCnic, DeleteCustomerGurantorsbyId, DeleteDocImages, DeleteGroupsForms, DeleteSelectedGurantors, getAllGroupGurantors, getAssetsDocumentsforSyncup, getCustomerFroms, getCustomerFromsByidforGroupSyncup, getGroupGurantors, getGroupsFroms, getLoanDocuments } from '../../sqlite/sqlitedb';
import { Colors } from '../../theme';
var { height, width } = Dimensions.get('window');
import { useDispatch } from "react-redux";
import GroupRecorditems from '../../components/GroupRecorditems';
import { CallforTags, CheckingTags, uploadingAssetsImage, uploadingCustomerdata, uploadingDocs } from '../../apis_auth/apis';
import Toast from '../../components/Toast';
import DateChips from '../../components/DateChips';
import { Item } from 'react-native-paper/lib/typescript/components/List/List';
import { text } from 'stream/consumers';
const Groups: () => Node = (props) => {
  let customerSyncUpDatas = [];
  let asstesTags = [];
  let Docs = [];
  let assets_Image = [];
  let groupGurantors = [];
  let obj = {};
  var convert = {};
  let processItem = {};
  const [title, setTitle] = React.useState([])
  const [getForms, setFroms] = useState(null)
  const [getFormsOrignal, setFromsOrignal] = useState(null)
  const [noData, setNoData] = useState(false)
  const [progress, setProgresss] = useState(false)
  const [Null, setNull] = useState(false)
  const [loading, setLoading] = useState(true)
  const [allData, setAllData] = useState({});
  const StationReducer = useSelector((state) => state.StationReducer);
  const [toast, setToast] = React.useState({ value: "", type: "" });
  const [dialogeCount, setDialogeCount] = useState("Syncing up")
  const [searchData, setSearchData] = React.useState([])
  const [refreshing, setRefreshing] = React.useState(false);
  const [container, setContainer] = React.useState(
    {
      topBar: true,
      startDate: '',
      endDate: "",
      Cnic: "",
      activeInput: true
    })


  const navigation = useNavigation();
  React.useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      navigation.goBack();

    });

    // Return the function to unsubscribe from the event so it gets removed on unmount
    return unsubscribe;
  }, [navigation]);

  const [UserData, setUserData] = React.useState(undefined);

  const getUserData = useSelector((state) => state.UserData);

 


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

          variable={2}


          setNoData={setNoData}

          setLoading={setLoading}

          text={'Search Groups by name..'}

        />


        {loading && <ActivityIndicator style={{ marginTop: 30 }} color={Colors.parrotGreenColor} />}


        {noData && <Nodata></Nodata>}

       

      </View>

      <Toast {...toast} onDismiss={() => setToast({ message: "", type: "" })} />

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
export default connect(null, mapDispatchToProps)(Groups);

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

