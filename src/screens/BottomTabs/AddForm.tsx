import React, {useRef, useEffect, memo} from 'react';
import type {Node} from 'react';
import RNAndroidLocationEnabler from 'react-native-android-location-enabler';

import {
  View,
  SafeAreaView,
  StyleSheet,
  Dimensions,
  PermissionsAndroid,
} from 'react-native';
import {AppStatusBar, Header, Tabsitems, TextView} from '../../components';
import {Card} from 'react-native-paper';
import {connect, useSelector, useDispatch} from 'react-redux';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Lolipopheader from '../../components/Lolipopheader';
import StepIndicator from 'react-native-step-indicator';

import Swiper from 'react-native-swiper';
import {
  Customerinfo,
  Familymembers,
  Guaranteer,
  Assets,
  Loanform,
} from '../Formpages';
import {Colors, GlobalStyles} from '../../theme';
import {getEmployeesRegionArray} from '../../sqlite/sqlitedb';

const {height, width} = Dimensions.get('window');
const AddForm: () => Node = props => {
  const {item, user_cnic, IsEbanking, IsEbankingData, fingerPrint} =
    props.route.params;

  const swiper = useRef(null);
  const [noData, setNodata] = React.useState(false);
  const [ebaningCustomer, setEbankingCustomer] = React.useState('0');
  const [ebankingCustomerData, setEbankingCustomerData] =
    React.useState(undefined);
  const [activeTab, setActiveTab] = React.useState(1);
  const [currentPage, setCurrentPage] = React.useState<number>(0);

  const dispatch = useDispatch();
  const getUserData = useSelector(state => state.UserData);
  const OrganizationType = Number(getUserData?.UserData?.OrganizationType);
  const loanLabel = OrganizationType === 2 ? 'Finance Facility' : 'Loan';

  useEffect(() => {
    // requestLocationPermission();/
    // console.log("---->IsEbanking",IsEbanking);
    // console.log("---->IsEbankingData",IsEbankingData);
    // setEbankingCustomer(IsEbanking)
    // setEbankingCustomerData(IsEbankingData)
  }, []);

  const PAGES = [1, 2, 3, 4, 5];

  const secondIndicatorStyles = {
    stepIndicatorSize: 30,
    currentStepIndicatorSize: 40,
    separatorStrokeWidth: 2,
    currentStepStrokeWidth: 3,
    stepStrokeCurrentColor: Colors.parrotGreenColor,
    stepStrokeWidth: 3,
    separatorStrokeFinishedWidth: 4,
    stepStrokeFinishedColor: Colors.parrotGreenColor,
    stepStrokeUnFinishedColor: '#aaaaaa',
    separatorFinishedColor: Colors.parrotGreenColor,
    separatorUnFinishedColor: '#aaaaaa',
    stepIndicatorFinishedColor: Colors.parrotGreenColor,
    stepIndicatorUnFinishedColor: '#ffffff',
    stepIndicatorCurrentColor: '#ffffff',
    stepIndicatorLabelFontSize: 13,
    currentStepIndicatorLabelFontSize: 13,
    stepIndicatorLabelCurrentColor: Colors.parrotGreenColor,
    stepIndicatorLabelFinishedColor: '#ffffff',
    stepIndicatorLabelUnFinishedColor: '#aaaaaa',
    labelColor: '#999999',
    labelSize: 13,
    currentStepLabelColor: Colors.parrotGreenColor,
  };
  const onPressNextone = () => {
    setCurrentPage(1);
    swiper.current.scrollTo(1, true);
  };
  const onPressNexttwo = () => {
    setCurrentPage(2);
    swiper.current.scrollTo(2, true);
  };
  const onPressNextthree = () => {
    setCurrentPage(3);
    swiper.current.scrollTo(3, true);
  };
  const onPressNextfour = () => {
    setCurrentPage(4);
    swiper.current.scrollTo(4, true);
  };
  const onPressNextfive = () => {
    setCurrentPage(5);
    swiper.current.scrollTo(5, true);
  };

  const onPressPrevone = () => {
    // alert(currentPage)
    setCurrentPage(0);
    swiper.current.scrollTo(0);
  };
  const onPressPrevtwo = () => {
    // alert(currentPage)

    setCurrentPage(1);
    swiper.current.scrollTo(1);
  };
  const onPressPrevthree = () => {
    // alert(currentPage)
    setCurrentPage(2);
    swiper.current.scrollTo(2);
  };
  const onPressPrevfour = () => {
    // alert(currentPage)
    setCurrentPage(3);
    swiper.current.scrollTo(3);
  };

  const onStepPress = (position: number) => {
    // if(getUserData.UserData.EmployeeTypeName == "Branch Manager" || getUserData.UserData.EmployeeTypeName == "Verification Officer"){
    //   setCurrentPage(position);
    // }
    //setCurrentPage(position);
  };

  const renderViewPagerPage = (data: any) => {
    return (
      <View key={data} style={{marginLeft: 10, marginRight: 10}}>
        {data == 1 && (
          <Customerinfo
            onPressNext={onPressNextone}
            item={item}
            user_cnic={user_cnic}
            isEbanking={IsEbanking}
            fingerPrint={fingerPrint}
            ebankingData={IsEbankingData}></Customerinfo>
        )}
        {data == 2 && (
          <Loanform
            onPressNext={onPressNexttwo}
            onPressPrev={onPressPrevone}
            IsEbanking={IsEbanking}
            ebankingData={IsEbankingData}
            item={item}></Loanform>
        )}
        {data == 3 && (
          <Assets
            onPressNext={onPressNextthree}
            onPressPrev={onPressPrevtwo}
            item={item}></Assets>
        )}
        {data == 4 && (
          <Familymembers
            onPressNext={onPressNextfour}
            onPressPrev={onPressPrevthree}
            item={item}></Familymembers>
        )}
        {data == 5 && (
          <Guaranteer
            onPressNext={onPressNextfive}
            onPressPrev={onPressPrevfour}
            user_cnic={user_cnic}
            item={item}></Guaranteer>
        )}
      </View>
    );
  };

  const getStepIndicatorIconConfig = ({
    position,
    stepStatus,
  }: {
    position: number;
    stepStatus: string;
  }) => {
    const iconConfig = {
      name: 'feed',
      color: stepStatus === 'finished' ? '#ffffff' : '#cdcdcd',
      size: 15,
    };
    switch (position) {
      case 0: {
        iconConfig.name = 'person';
        break;
      }
      case 1: {
        iconConfig.name = 'payment';
        break;
      }
      case 2: {
        iconConfig.name = 'assessment';
        break;
      }
      case 3: {
        iconConfig.name = 'group';
        break;
      }
      case 4: {
        iconConfig.name = 'badge';
        break;
      }
      default: {
        break;
      }
    }
    return iconConfig;
  };
  const renderStepIndicator = (params: any) => (
    <MaterialIcons {...getStepIndicatorIconConfig(params)} />
  );

  return (
    <View style={styles.container}>
      <AppStatusBar></AppStatusBar>
      <View style={[GlobalStyles.row, {backgroundColor: '#FFF'}]}>
        <Header Theme={Colors} back={true} screenNo={1}></Header>
        <TextView
          type={'mini_heading22'}
          style={{paddingHorizontal: 30, marginTop: 55}}
          text=""></TextView>
      </View>
      <View style={styles.stepIndicator}>
        <StepIndicator
          customStyles={secondIndicatorStyles}
          currentPosition={currentPage}
          onPress={onStepPress}
          renderStepIndicator={renderStepIndicator}
          labels={['Customer', loanLabel, 'Asset', 'Family Member', 'Guaranteer']}
        />
      </View>

      <Swiper
        ref={swiper}
        style={{flexGrow: 1}}
        loop={false}
        index={currentPage}
        autoplay={false}
        scrollEnabled={false}
        activeDotStyle={{backgroundColor: 'transparent'}}
        dotStyle={{backgroundColor: 'transparent'}}
        showsButtons={false}
        // onIndexChanged={(page) => {
        //   setCurrentPage(page);
        // }}
      >
        {PAGES.map(page => renderViewPagerPage(page))}
      </Swiper>
    </View>
  );
};
const mapDispatchToProps = dispatch => {
  return {
    GETRegions: Data => {
      dispatch({
        type: 'REGIONS',

        payload: Data,
      });
    },
  };
};
// export default AddForm;
export default connect(null, mapDispatchToProps)(memo(AddForm));

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  stepIndicator: {
    marginTop: 20,
    marginBottom: 20,
  },
  page: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  stepLabel: {
    fontSize: 12,
    textAlign: 'center',
    fontWeight: '500',
    color: '#999999',
  },
  stepLabelSelected: {
    fontSize: 12,
    textAlign: 'center',
    fontWeight: '500',
    color: '#4aae4f',
  },
});
