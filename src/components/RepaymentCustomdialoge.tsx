import React, { memo, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Dimensions,
  StyleSheet,
  Alert,
  Pressable,
  ScrollView,
} from 'react-native';
import { TextView } from '.';
import { FONTS } from '../theme/Fonts';
import LottieView from 'lottie-react-native';
import { Modal } from 'react-native';
import { BlurView } from '@react-native-community/blur';
import { Card } from 'react-native-paper';
import { Colors } from '../theme';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Feather from 'react-native-vector-icons/Feather';
import { CustomButton } from '.';
import { getTotalRepaymentPaid, insertRepaymentLogData } from '../sqlite/RepaymentDataBase';
import moment from 'moment';

const { height, width } = Dimensions.get('window');
const RepaymentCustomdialoge = ({
  filterModal,
  setfilterModal,
  props,
  remainingBalance,
  type
}) => {

  const [values,setValues]=useState({repayment_value:"",penality:'',processFee:''})
  
  var dueInstallment = props == undefined ? 0 : Number(props.CurrentRepaymentAmount);
  
  if (dueInstallment > Number(remainingBalance)) {
    dueInstallment = remainingBalance;
  }
  const _onSubmit = () => {
    if(values.repayment_value==""){
      Alert.alert("Stop!","Please enter mandatory fields")
      return
    }else if(Number(Number(values.repayment_value)>remainingBalance)){
      Alert.alert("Stop!","Repayment Amount can't be greater than Remaining Balance")
      return
    }else{
      var date=moment().format('L');
      // var datesubString=date.substring(0,10);
      insertRepaymentLogData(props.LoanId,props.CustomerGroupId,props.custFullName,props.NICNumber,values.repayment_value,values.penality,values.processFee,date,props.StaionId,"0")
      .then(()=>{
        setValues({repayment_value:"",penality:'',processFee:''})
        Alert.alert("Done","Successfully Submitted!")
        setfilterModal(false)
      })
      .catch(()=>{})
    }
    // if (textField == 0) {
    //   //CNIC

    // } else {
    //   // LOAN ID

    // }
  }
  return (
    <View>
      {filterModal && (
        <Modal
          animationType={'fade'}
          transparent={true}
          visible={filterModal}
          onRequestClose={() => {
            setfilterModal(false);
            //console.log('Modal has been closed.');
          }}>
          <View style={styles.modal}>

            <BlurView
              style={styles.absolute}
              //   viewRef={this.state.viewRef}
              blurType="light"
              blurAmount={10}
              reducedTransparencyFallbackColor="white"
            />
            <View style={{ width: '100%', flexDirection: 'column', alignItems: 'center' }}>

              <Card style={styles.modalcardall}>
                <Pressable
                  onPress={() => { setfilterModal(false) }}
                  style={{ alignSelf: 'flex-end', margin: 10 }}>
                  <MaterialCommunityIcons
                    name={'close'}
                    style={{ color: Colors.red }}
                    size={26}
                  ></MaterialCommunityIcons>
                </Pressable>
                <View style={{ padding: 10 }}>
                  <ScrollView>
                    <View>
                      <TextView text={'Repayment'} style={{ color: "#cdcdcd", alignSelf: 'center' }} />
                    </View>
                    <View style={{ borderColor: Colors.darkGreenColor, padding: 5, marginTop: 15 }}>
                      <View style={styles.rows}>
                        <View style={styles.labelColumn}>
                          <TextView style={styles.rowstext} text={'Customer Name'} />
                        </View>
                        <View style={styles.valueColumn}>
                          <TextView text={type==1?props.custFullName:props.customerName} style={styles.customerInfoText} /></View>
                      </View>
                      <View style={styles.rows}>
                        <View style={styles.labelColumn}>
                          <TextView style={styles.rowstext} text={'Loan Id'} />
                        </View>
                        <View style={styles.valueColumn}>
                          <TextView text={props.LoanId} style={styles.customerInfoText} />
                        </View>
                      </View>
                      <View style={styles.rows}>
                        <View style={styles.labelColumn}>
                          <TextView style={styles.rowstext} text={'CNIC'} />
                        </View>
                        <View style={styles.valueColumn}>
                          <TextView text={props.NICNumber} style={styles.customerInfoText} />
                        </View>
                      </View>
                      <View style={styles.rows}>
                        <View style={styles.labelColumn}>
                          <TextView style={styles.rowstext} text={'Due Instalment'} />
                        </View>
                        <View style={styles.valueColumn}>
                          <TextView text={dueInstallment} style={styles.customerInfoText} />
                        </View>
                      </View>
                      <View style={styles.rows}>
                        <View style={styles.labelColumn}>
                          <TextView style={styles.rowstext} text={'Remaining Balance'} />
                        </View>
                        <View style={styles.valueColumn}>
                          <TextView text={remainingBalance} style={styles.customerInfoText} />
                        </View>
                      </View>
                      <View style={{ flexDirection: 'row', padding: 6 }}>
                        <View style={styles.labelColumn}>
                          <TextView style={styles.rowstext} text={'Last repayment date'} />
                        </View>
                        <View style={styles.valueColumn}>
                          <TextView text={props.LastRepaymentDateTime} style={styles.customerInfoText} />
                        </View>
                      </View>
                      <View style={{ marginTop: 20, marginBottom: 10 }}>
                        <View>
                          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <TextView text={'Repayment Amount:'} style={[styles.inputLabel,{flex:1}]} />

                            <TextView text={'*'} style={{ color: Colors.red, alignSelf: 'center',marginRight:20 }} />

                          </View>
                          <TextInput 
                          keyboardType={'decimal-pad'}
                          value={values.repayment_value}
                          onChangeText={(value)=>{setValues({...values,repayment_value:value})}}
                          style={styles.inputText} />
                        </View>
                        <View style={{ marginTop: 10 }}>
                          <TextView text={'Penalty:'} style={styles.inputLabel} />
                          <TextInput 
                          keyboardType={'decimal-pad'}
                          value={values.penality}
                          onChangeText={(value)=>{setValues({...values,penality:value})}}
                          style={styles.inputText} />
                        </View>
                        <View style={{ marginTop: 10 }}>
                          <TextView text={'Processing Fees:'} style={styles.inputLabel} />
                          <TextInput
                          keyboardType={'decimal-pad'}
                             value={values.processFee}
                             onChangeText={(value)=>{setValues({...values,processFee:value})}}
                          style={styles.inputText} />
                        </View>
                      </View>
                    </View>
                    <View style={{ alignItems: 'center' }}>
                      <CustomButton
                        onPress={_onSubmit}
                        text={"Submit"}
                        style={{ padding: 10, borderRadius: 20, alignItems: 'center', width: '90%' }}
                        textStyle={{ fontSize: 17 }}
                      />
                    </View>
                  </ScrollView>
                </View>
              </Card>



            </View>
          </View>
        </Modal>
      )}
    </View>
  );
};
const styles = StyleSheet.create({
  shareview: { flexDirection: 'row', alignItems: 'center', margin: 5 },
  modalcardtopright: {
    borderRadius: 20,
    height: height / 10,
    width: width / 4,
    elevation: 20,
  },
  dropdownstyles: { marginLeft: 20, flex: 1 },
  modalcardall: {
    borderRadius: 20,

    width: width / 1.3,
    elevation: 20,
  },
  text1: { fontSize: 14, color: '#8E8E93', fontFamily: FONTS.FONT_REGULAR },
  text2: { fontSize: 20, color: '#000', fontFamily: FONTS.FONT_SEMI_BOLD },
  flexrow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 20,
    position: 'absolute',
  },
  circle: {
    height: 30, width: 30, borderRadius: 100, marginLeft: 0, marginRight: 10,
    justifyContent: 'center', backgroundColor: '#f1f1f1'
  },
  name: {
    fontFamily: FONTS.FONT_REGULAR,
    fontSize: 14,
  },
  name2: {
    fontFamily: FONTS.FONT_BOLD,
    fontSize: 24,
  },
  editext: { marginTop: 80, marginLeft: 20 },

  textInput: {
    backgroundColor: '#f1f1f1', height: 55, paddingLeft: 0, marginTop: 5, marginBottom: 33,
    borderBottomColor: '#cdcdcd', borderBottomWidth: 1, flexDirection: 'row', alignItems: 'center',
    width: width / 2.5, borderRadius: 3
  },
  alltext: {
    marginRight: 10,
    fontFamily: FONTS.FONT_REGULAR,
    fontSize: 14,
  },
  historytext: {
    fontFamily: FONTS.FONT_MEDIUM,
    fontSize: 18,
  },
  historyblock: {
    justifyContent: 'center',
    marginTop: 20,
    padding: 20,
    backgroundColor: '#F8F8F9',
    borderRadius: 30,
    width: Dimensions.get('screen').width,
  },
  labelColumn: { flex: 1, borderRightWidth: 0 },
  valueColumn: { flex: 1, alignItems: 'center', borderLeftWidth: 0 },
  rowstext: { fontSize: 14, color: '#7d7d7d' },
  modal: {
    flex: 1,
    alignItems: 'center',
    padding: 20,
    justifyContent: 'center'
  },
  rows: { flexDirection: 'row', padding: 6, borderBottomColor: '#cdcdcd', borderBottomWidth: 1 },
  customerInfoText: { fontSize: 14 },
  inputLabel: { fontSize: 12 },
  inputText: { padding: 5, borderBottomColor: '#cdcdcd', borderBottomWidth: 1, },
  absolute: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
  },
  s_circle: {
    borderRadius: 100, width: 5, height: 5,
    backgroundColor: '#cdcdcd', marginTop: 5
  }
});
export default memo(RepaymentCustomdialoge);
