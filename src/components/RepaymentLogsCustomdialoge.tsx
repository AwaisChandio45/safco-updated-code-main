import React, { memo, useEffect, useState } from 'react';
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
import { DeletRepaymentLogsRow, getTotalRepaymentPaid, insertRepaymentLogData, updateRepaymentAmount } from '../sqlite/RepaymentDataBase';
import moment from 'moment';

const { height, width } = Dimensions.get('window');
const RepaymentLogsCustomdialoge = ({
  filterModal,
  setfilterModal,
  props,
  type
}) => {
  const [updateAmount, setUpdate] = useState(undefined)
  const _onSubmit = () => {
    if (updateAmount == "") {
      Alert.alert("Stop!", "Please enter mandatory fields")
      return
    } else {
      setfilterModal(false)
      updateRepaymentAmount(props.repaymentLog_id, updateAmount).then((value) => {
        Alert.alert("Success", "" + value)
      }).catch((error) => {
        Alert.alert("Stop!", "" + error)

      })
    }

  }
const _Delete=()=>{
  Alert.alert("Await!","Do you really want to delete?",[{text:"Yes",onPress:()=>{
DeletRepaymentLogsRow(props.repaymentLog_id).then((value)=>{
  setfilterModal(false)

  Alert.alert("Success", "" + value)
}).catch((error)=>{
  setfilterModal(false)

  Alert.alert("Stop!", "" + error)
})
  }},{text:"No",onPress:()=>{

  }}])
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
                  <ScrollView
                    keyboardShouldPersistTaps={'handled'}
                  >
                    <View>
                      <TextView text={'Repayment Logs'} style={{ color: "#cdcdcd", alignSelf: 'center' }} />
                    </View>
                    <View style={{ borderColor: Colors.darkGreenColor, padding: 5, marginTop: 15 }}>
                      <View style={styles.rows}>
                        <View style={styles.labelColumn}>
                          <TextView style={styles.rowstext} text={'Customer Name'} />
                        </View>
                        <View style={styles.valueColumn}>
                          <TextView text={type == 1 ? props.custFullName : props.customerName} style={styles.customerInfoText} /></View>
                      </View>
                      <View style={styles.rows}>
                        <View style={styles.labelColumn}>
                          <TextView style={styles.rowstext} text={'Loan Id'} />
                        </View>
                        <View style={styles.valueColumn}>
                          <TextView text={props.loanId} style={styles.customerInfoText} />
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
                          <TextView style={styles.rowstext} text={'Repayment Date'} />
                        </View>
                        <View style={styles.valueColumn}>
                          <TextView text={props.RepaymentDateTime} style={styles.customerInfoText} />
                        </View>
                      </View>
                      <View style={styles.rows}>
                        <View style={styles.labelColumn}>
                          <TextView style={styles.rowstext} text={'Penalty'} />
                        </View>
                        <View style={styles.valueColumn}>
                          <TextView text={props.Penalty} style={styles.customerInfoText} />
                        </View>
                      </View>
                      <View style={{ flexDirection: 'row', padding: 6 }}>
                        <View style={styles.labelColumn}>
                          <TextView style={styles.rowstext} text={'Processing Fees'} />
                        </View>
                        <View style={styles.valueColumn}>
                          <TextView text={props.ProccessingFees} style={styles.customerInfoText} />
                        </View>
                      </View>
                      <View style={{ marginTop: 20, marginBottom: 10 }}>
                        <View>
                          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <TextView text={'Repayment Amount:'} style={[styles.inputLabel, { flex: 1 }]} />

                            <TextView text={'*'} style={{ color: Colors.red, alignSelf: 'center', marginRight: 20 }} />

                          </View>

                          <TextInput
                          keyboardType={'decimal-pad'}
                          editable={props.IsSyncedUp==0?true:false}
                            value={updateAmount == undefined ? props.RepaymentAmount : updateAmount}
                            onChangeText={(value) => {
                              setUpdate(value)
                            }}
                            style={styles.inputText}>

                          </TextInput>
                        </View>

                      </View>
                    </View>
                    <View style={{ alignItems: 'center' }}>
                    {props.IsSyncedUp==0?<CustomButton
                        onPress={_onSubmit}
                        text={"Update"}
                        style={{ padding: 10, borderRadius: 20, alignItems: 'center', width: '90%' }}
                        textStyle={{ fontSize: 17 }}
                      />
                      :
                      <Pressable
                      onPress={_Delete}
                        style={{ backgroundColor: Colors.red, padding: 10, borderRadius: 20, alignItems: 'center', width: '75%' }}

                      >
                        <TextView
                          text={"Delete"}
                          type={'Login'}
                          style={[{ color: "#fff", fontSize: 17 }]}
                        >

                        </TextView>
                      </Pressable>
                    }
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
export default memo(RepaymentLogsCustomdialoge);
