import React,{memo} from 'react';
import {
  View,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Image,
  Dimensions,
  Pressable,
} from 'react-native';
import {TextView} from '../../components';
import AppStatusBar from '../../components/AppStatusBar';
import {Colors} from '../../theme';
import {GlobalStyles} from '../../theme';
import {HeaderwithoutDialoge} from '../../components';
import ImageViewer from 'react-native-image-zoom-viewer';
import {Modal} from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { useNavigation } from '@react-navigation/native';
import { useSelector, useDispatch, connect } from 'react-redux';


const SafcoCustomerDetail = (props) => {
  const {width, height} = Dimensions.get('window');
  const {item} = props.route.params;
  const [openImage, setOpenImage] = React.useState(false);
  const navigation = useNavigation();
  const CustomGetDataModule = useSelector(state => state.RequiredReducer.CustomGetDataModule);
  const [allDataobj, setAlldataobj] = React.useState(CustomGetDataModule)


  const images = [
    {
      url: item.imagePath,
      freeHeight: true,
    },
  ];
  const [error,setError]=React.useState(false)
  const _onImageLoadError = (event) => {
    setError(true)
}

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: '#FFF'}}>
      <AppStatusBar></AppStatusBar>

      <View style={GlobalStyles.row}>
        <HeaderwithoutDialoge Theme={Colors} back={true}></HeaderwithoutDialoge>

        <TextView
          type={'mini_heading22'}
          style={{paddingHorizontal: 30, marginTop: 55, fontSize: 15}}
          text="E-Banking Customer Detail"></TextView>
      </View>

      <ScrollView style={{}}>
        <Pressable
          style={{
            borderColor: '#cdcdcd',
            elevation: 10,
            borderWidth: 1,
            width: width / 1.2,
            height: height / 2,
            alignSelf: 'center',
            marginTop: 20,
            alignItems: 'center',
          }}
          onPress={() => {
            if(!error){
              setOpenImage(true)
            }
            }}>
         {error==false ? <Image
          onError={_onImageLoadError}
            source={{uri: item.imagePath}}
            style={{width: '100%', height: '100%', resizeMode: 'stretch'}}
          />
          :
          <Image
            source={require('../../assests/images/placeholder.png')}
            style={{width: '100%', height: '100%', resizeMode: 'stretch'}}
          />
          }
          {/*  */}
        </Pressable>

        <View style={styles.tableContainer}>
          {/* <View style={{marginTop:10}}> */}

          <View style={styles.rowOne}>
            <View style={{flex: 1, padding: 10}}>
              <TextView text={'CIB Status'} style={{fontSize: 12}} />
            </View>

            <View style={{flex: 1, padding: 10}}>
              <TextView text={`${item.CIBStatus}`} style={{fontSize: 12}} />
            </View>
          </View>

          <View style={styles.rowTwo}>
            <View style={{flex: 1, padding: 10}}>
              <TextView text={'E-Banking Customer Id'} style={{fontSize: 12}} />
            </View>

            <View style={{flex: 1, padding: 10}}>
              <TextView
                text={`${item.EBankingCustomerId}`}
                style={{fontSize: 12}}
              />
            </View>
          </View>

          <View style={styles.rowOne}>
            <View style={{flex: 1, padding: 10}}>
              <TextView text={'E-Banking Loan Id'} style={{fontSize: 12}} />
            </View>

            <View style={{flex: 1, padding: 10}}>
              <TextView
                text={`${item.EBankingLoanId}`}
                style={{fontSize: 12}}
              />
            </View>
          </View>

          <View style={styles.rowTwo}>
            <View style={{flex: 1, padding: 10}}>
              <TextView text={'Customer Id'} style={{fontSize: 12}} />
            </View>

            <View style={{flex: 1, padding: 10}}>
              <TextView text={`${item.CustomerId}`} style={{fontSize: 12}} />
            </View>
          </View>

          <View style={styles.rowOne}>
            <View style={{flex: 1, padding: 10}}>
              <TextView text={'Firstname'} style={{fontSize: 12}} />
            </View>

            <View style={{flex: 1, padding: 10}}>
              <TextView text={`${item.FirstName}`} style={{fontSize: 12}} />
            </View>
          </View>

          <View style={styles.rowTwo}>
            <View style={{flex: 1, padding: 10}}>
              <TextView text={'Lastname'} style={{fontSize: 12}} />
            </View>

            <View style={{flex: 1, padding: 10}}>
              <TextView text={`${item.LastName}`} style={{fontSize: 12}} />
            </View>
          </View>

          <View style={styles.rowOne}>
            <View style={{flex: 1, padding: 10}}>
              <TextView text={'Gender'} style={{fontSize: 12}} />
            </View>

            <View style={{flex: 1, padding: 10}}>
              <TextView text={`${item.Gender}`} style={{fontSize: 12}} />
            </View>
          </View>

          <View style={styles.rowTwo}>
            <View style={{flex: 1, padding: 10}}>
              <TextView text={'Mobile Number'} style={{fontSize: 12}} />
            </View>

            <View style={{flex: 1, padding: 10}}>
              <TextView text={`${item.MobileNumber}`} style={{fontSize: 12}} />
            </View>
          </View>

          <View style={styles.rowOne}>
            <View style={{flex: 1, padding: 10}}>
              <TextView text={'CNIC Number'} style={{fontSize: 12}} />
            </View>

            <View style={{flex: 1, padding: 10}}>
              <TextView text={`${item.NICNumber}`} style={{fontSize: 12}} />
            </View>
          </View>

          <View style={styles.rowTwo}>
            <View style={{flex: 1, padding: 10}}>
              <TextView text={'Occupation'} style={{fontSize: 12}} />
            </View>

            <View style={{flex: 1, padding: 10}}>
              <TextView text={`${item.Occupation}`} style={{fontSize: 12}} />
            </View>
          </View>

          <View style={styles.rowOne}>
            <View style={{flex: 1, padding: 10}}>
              <TextView text={'Present Address'} style={{fontSize: 12}} />
            </View>

            <View style={{flex: 1, padding: 10}}>
              <TextView
                text={`${item.PresentAddress}`}
                style={{fontSize: 12}}
              />
            </View>
          </View>

          <View style={styles.rowTwo}>
            <View style={{flex: 1, padding: 10}}>
              <TextView text={'Loan Added Date Time'} style={{fontSize: 12}} />
            </View>

            <View style={{flex: 1, padding: 10}}>
              <TextView
                text={`${item.LoanAddedDateTime}`}
                style={{fontSize: 12}}
              />
            </View>
          </View>

          <View style={styles.rowOne}>
            <View style={{flex: 1, padding: 10}}>
              <TextView text={'Loan Amount'} style={{fontSize: 12}} />
            </View>

            <View style={{flex: 1, padding: 10}}>
              <TextView text={`${item.LoanAmount}`} style={{fontSize: 12}} />
            </View>
          </View>

          <View style={styles.rowTwo}>
            <View style={{flex: 1, padding: 10}}>
              <TextView text={'Loan Institute'} style={{fontSize: 12}} />
            </View>

            <View style={{flex: 1, padding: 10}}>
              <TextView text={`${item.LoanInstitute}`} style={{fontSize: 12}} />
            </View>
          </View>

          <View style={styles.rowOne}>
            <View style={{flex: 1, padding: 10}}>
              <TextView text={'Loan Status'} style={{fontSize: 12}} />
            </View>

            <View style={{flex: 1, padding: 10}}>
              <TextView text={`${item.LoanStatus}`} style={{fontSize: 12}} />
            </View>
          </View>

          <View style={styles.rowTwo}>
            <View style={{flex: 1, padding: 10}}>
              <TextView text={'Loan Year'} style={{fontSize: 12}} />
            </View>

            <View style={{flex: 1, padding: 10}}>
              <TextView text={`${item.LoanYear}`} style={{fontSize: 12}} />
            </View>
          </View>

          <View style={styles.rowOne}>
            <View style={{flex: 1, padding: 10}}>
              <TextView text={'Required Loan Amount'} style={{fontSize: 12}} />
            </View>

            <View style={{flex: 1, padding: 10}}>
              <TextView
                text={`${item.RequiredLoanAmount}`}
                style={{fontSize: 12}}
              />
            </View>
          </View>

          <View style={styles.rowTwo}>
            <View style={{flex: 1, padding: 10}}>
              <TextView text={'Station Id'} style={{fontSize: 12}} />
            </View>

            <View style={{flex: 1, padding: 10}}>
              <TextView text={`${item.StationId}`} style={{fontSize: 12}} />
            </View>
          </View>

          <View style={styles.rowOne}>
            <View style={{flex: 1, padding: 10}}>
              <TextView text={'Station Name'} style={{fontSize: 12}} />
            </View>

            <View style={{flex: 1, padding: 10}}>
              <TextView text={`${item.StationName}`} style={{fontSize: 12}} />
            </View>
          </View>

          <View style={styles.rowTwo}>
            <View style={{flex: 1, padding: 10}}>
              <TextView text={'Transaction Number'} style={{fontSize: 12}} />
            </View>

            <View style={{flex: 1, padding: 10}}>
              <TextView
                text={`${item.TransactionNumber}`}
                style={{fontSize: 12}}
              />
            </View>
          </View>

          <View style={styles.rowOne}>
            <View style={{flex: 1, padding: 10}}>
              <TextView text={'Processing Channel'} style={{fontSize: 12}} />
            </View>

            <View style={{flex: 1, padding: 10}}>
              <TextView text={`E-Credit`} style={{fontSize: 12}} />
            </View>
          </View>
          {/* <View style={{backgroundColor:'#fff', height:20}}>

          </View> */}

          {/* </View> */}
        </View>
      </ScrollView>
      <TouchableOpacity
      activeOpacity={0.8}
      onPress={() => {
      //  console.log('clicked==>', JSON.stringify(allDataobj.customerInfo[0].eCreditCutomer));
      //  return
       const get = allDataobj;

       get.customerInfo[0].eCreditCutomer = true

       setAlldataobj({...get})

       props.UpdateUserData(get);
       
      //return
       navigation.navigate('AddForm',{IsEbanking:"1",IsEbankingData:item})
       
      }}
      style={{height:60,borderTopRightRadius:30,borderTopLeftRadius:30,backgroundColor:Colors.parrotGreenColor,justifyContent:'center'}}>
        <TextView text={'Process'} style={{color:'#fff',fontSize:20,alignSelf:'center'}} />

      </TouchableOpacity>

      <Modal visible={openImage} transparent={true}>
        <View style={{flex: 1, backgroundColor: '#000'}}>
          <Pressable
            style={{alignSelf: 'flex-end', padding: 10}}
            onPress={() => setOpenImage(false)}>
            <AntDesign name="close" size={20} color="#fff" />
          </Pressable>
          <ImageViewer imageUrls={images} />
        </View>
      </Modal>
    </SafeAreaView>
  );
};
const mapDispatchToProps = dispatch => {
  return {
    UpdateUserData: Data => {
      dispatch({
        type: 'FORM',
        payload: Data,
      });
    },
  };
};
export default connect(null, mapDispatchToProps)(memo(SafcoCustomerDetail));

const styles = StyleSheet.create({
  tableContainer: {
    marginBottom: 20,
    backgroundColor: '#fff',
    marginTop: 15,
    elevation: 0,
    borderRadius: 5,
  },

  rowOne: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderColor: '#cdcdcd',
  },
  rowTwo: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderColor: '#cdcdcd',
    backgroundColor: '#DCDCDC',
  },
});
