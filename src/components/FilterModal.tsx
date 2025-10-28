import React, { memo } from 'react';
import {
  View,
  Text,
  TextInput,
  Dimensions,
  StyleSheet,
  Alert,
  Pressable,
} from 'react-native';
import { connect, useSelector } from 'react-redux';
import { TextView } from '.';
import { FONTS } from '../theme/Fonts';
import LottieView from 'lottie-react-native';
import { Modal } from 'react-native';
import { BlurView } from '@react-native-community/blur';
import { Card } from 'react-native-paper';
import { Colors } from '../theme';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Feather from 'react-native-vector-icons/Feather';
import CustomCalender from './CustomCalender';
import moment from 'moment'
import { getCustomerFromsbyCnic, getCustomerFromsbyDate, getCustomerFromsbyDateLoanOfficer, getCustomerFromsbyDateVerificationOfficer, getGroupsFromsbyDate, getGroupsFromsbyDateforBM } from '../sqlite/sqlitedb';

const { height, width } = Dimensions.get('window');
const FilterModal = ({
  filterModal,
  setfilterModal,
  container,
  setContainer,
  setSearchData,
  Data, setData, variable,
  setNoData, setLoading
}) => {
  const [getDate, setDate] = React.useState(true)
  const getUserData = useSelector((state) => state.UserData);
  const SetChips = (value) => {

    if (value == 1) {
      setSearchData([moment(container.startDate).format('MMM Do YY'), moment(container.endDate).format('MMM Do YY')])
      if (variable == 1) {
        if (getUserData.UserData.EmployeeTypeName == "Branch Manager"){
          getCustomerFromsbyDate(setData, setNoData, setLoading, container.startDate, container.endDate)
      }else if(getUserData.UserData.EmployeeTypeName == "Verification Officer"){
        getCustomerFromsbyDateVerificationOfficer(setData, setNoData, setLoading, container.startDate, container.endDate)

      }
      else {
        getCustomerFromsbyDateLoanOfficer(setData, setNoData, setLoading, container.startDate, container.endDate)

      }
    
    } else if (variable == 2) {
      if (getUserData.UserData.EmployeeTypeName == "Branch Manager" || getUserData.UserData.EmployeeTypeName == "Verification Officer"){
        getGroupsFromsbyDateforBM(setData, setNoData, setLoading, container.startDate, container.endDate,getUserData.UserData.EmployeeTypeName == "Branch Manager"?1:2)
      }else{
      getGroupsFromsbyDate(setData, setNoData, setLoading, container.startDate, container.endDate)

      }

    }
    else if (variable == 3) {

    }
  }
    else if (value == 2) {
  setSearchData([container.Cnic])
  if (variable == 1) {
    if (getUserData.UserData.EmployeeTypeName == "Branch Manager"){
      console.log(container.Cnic+"go with BM");
    getCustomerFromsbyCnic(setData, setNoData, setLoading, container.Cnic,1)
    }else if(getUserData.UserData.EmployeeTypeName == "Verification Officer"){
      getCustomerFromsbyCnic(setData, setNoData, setLoading, container.Cnic,2)
    }else{
      getCustomerFromsbyCnic(setData, setNoData, setLoading, container.Cnic,0)

    }

  } else if (variable == 2) {

  }
  else if (variable == 3) {

  }

}
setfilterModal(false)
    }
const _handleCnicInput = (value) => {

  if (value.length < 16) {
    //console.log("--"+value.length)
    if (value.length == 5 || value.length == 13) {
      //console.log("--"+value)
      setContainer({ ...container, Cnic: value + '-' })
    } else {
      setContainer({ ...container, Cnic: value })

    }
  }
}
return (
  <View>
    <Feather name="filter"
      style={{ alignSelf: 'center' }}
      onPress={() => setfilterModal(true)}
      color={Colors.parrotGreenColor} size={20} />

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
            <Pressable
              onPress={() => { setfilterModal(false) }}
              style={{ alignSelf: 'flex-end' }}>
              <MaterialCommunityIcons
                name={'close'}
                style={{ color: Colors.red }}
                size={26}
              ></MaterialCommunityIcons>
            </Pressable>
            <Card style={styles.modalcardall}>
              {variable == 1 ?
                <View style={{ flex: 1, padding: 10, }}>
                  {/*///////////////// Date heading */}
                  <View style={{ alignSelf: 'center' }}>
                    <TextView
                      style={{ fontSize: 18, color: '#cdcdcd' }}
                      text={'Filter by'}
                    />
                  </View>
                  <View style={{ flexDirection: 'row', alignItems: 'center', width: '100%' }}>
                    <Pressable
                      style={{ flex: 1, margin: 5, borderBottomWidth: 1.5, borderBottomColor: container.topBar ? Colors.parrotGreenColor : '#cdcdcd' }}
                      onPress={() => setContainer({ ...container, topBar: true })}
                    >
                      <TextView style={{ alignSelf: 'center', marginBottom: 5 }} text="Date"></TextView>
                    </Pressable>

                    <Pressable
                      style={{ flex: 1, margin: 5, borderBottomWidth: 1.5, borderBottomColor: container.topBar ? '#cdcdcd' : Colors.parrotGreenColor }}
                      onPress={(value) => setContainer({ ...container, topBar: false })}
                    >
                      <TextView style={{ alignSelf: 'center', marginBottom: 5 }} text="CNIC"></TextView>

                    </Pressable>
                  </View>
                  {/*/////////////// Selecting By date */}
                  {container.topBar == true ?
                    (<View>
                      <View style={{ flexDirection: 'column', padding: 10, marginTop: 10 }}>

                        <View style={{ width: '100%' }}>
                          <View style={{ flexDirection: 'row', marginBottom: 10 }}>
                            <View style={{ width: '10%', flexDirection: 'column', justifyContent: 'center', }}>
                              <View style={{
                                width: 10, height: 10,
                                backgroundColor: container.activeInput ? Colors.parrotGreenColor : null,
                                borderRadius: 50, borderWidth: 0.6, borderColor: Colors.parrotGreenColor
                              }}></View>
                            </View>
                            <View style={{ width: '90%', marginLeft: 0 }}>
                              <TextView style={{ fontSize: 12 }} text={'Start date'} />
                              <CustomCalender
                                variable={"1"}
                                setDate={setContainer}
                                container={container}
                                text={container.startDate}
                              />
                            </View>
                          </View>
                          <View style={styles.s_circle} />
                          <View style={styles.s_circle} />
                          <View style={styles.s_circle} />

                          <View style={{ flexDirection: 'row' }}>

                            <View style={{ width: '10%', flexDirection: 'column', justifyContent: 'center', }}>
                              <View style={{
                                width: 10, height: 10,
                                backgroundColor: container.startDate ? Colors.parrotGreenColor : null,
                                borderColor: Colors.parrotGreenColor,
                                borderRadius: 50, borderWidth: 0.6
                              }}></View>
                            </View>
                            <View style={{ width: '90%', marginLeft: 0, marginTop: 15 }}>
                              <TextView style={{ fontSize: 12 }} text={'End Date'} />
                              <CustomCalender
                                variable={"2"}
                                setDate={setContainer}
                                container={container}
                                text={container.endDate}
                              />
                            </View>
                          </View>
                        </View>
                      </View>
                      <View style={{ flexDirection: 'row', justifyContent: 'center', marginTop: 15 }}>
                        <Pressable
                          style={{
                            padding: 10, backgroundColor: Colors.parrotGreenColor, width: '30%',
                            borderRadius: 7, elevation: 5
                          }}
                          onPress={() => {
                            if (container.startDate == "") {
                              Alert.alert("Stop!", "Please select Start date.", [{ text: "OK", onPress: () => { } }])
                            }
                            else if (container.endDate == "") {
                              Alert.alert("Stop!", "Please select End date.", [{ text: "OK", onPress: () => { } }])
                            }
                            else {
                              SetChips(1)
                            }
                          }

                          }
                        >
                          <TextView text={"Search"} style={{ color: '#FFF', alignSelf: 'center' }} />
                        </Pressable>
                      </View>
                    </View>)
                    :
                    ////////////////Search by cnic////
                    (
                      <>
                        <View style={{ marginTop: 30, alignSelf: 'center', width: '80%' }}>
                          <View style={{ flexDirection: 'column', justifyContent: 'center' }}>
                            <TextView text={'CNIC Number'} style={{ fontSize: 12 }} />
                          </View>
                          <TextInput
                            placeholder='CNIC Number'
                            value={container.Cnic}
                            style={{ borderBottomWidth: 1, borderColor: '#cdcdcd', width: '100%' }}
                            onChangeText={_handleCnicInput}
                            keyboardType='number-pad'
                          />
                        </View>
                        <View style={{ flexDirection: 'row', justifyContent: 'center', marginTop: 15 }}>
                          <Pressable
                            style={{
                              padding: 10, backgroundColor: Colors.parrotGreenColor, width: '30%',
                              borderRadius: 7, elevation: 5
                            }}
                            onPress={() => {
                              if (container.Cnic == "") {
                                Alert.alert("Stop!", "Please enter Cnic.", [{ text: "OK", onPress: () => { } }])

                              }
                              else if (container.Cnic.length < 15) {
                                Alert.alert("Stop!", "Please enter valid Cnic.", [{ text: "OK", onPress: () => { } }])

                              }
                              else {
                                SetChips(2)

                              }
                            }}
                          >
                            <TextView
                              text={"Search"}
                              style={{ color: '#FFF', alignSelf: 'center' }}
                            />
                          </Pressable>
                        </View>
                      </>)
                  }

                </View>

                :

                <View>
                  <View style={{ flexDirection: 'column', padding: 10, marginTop: 10 }}>

                    <View style={{ width: '100%' }}>
                      <View style={{ flexDirection: 'row', marginBottom: 10 }}>
                        <View style={{ width: '10%', flexDirection: 'column', justifyContent: 'center', }}>
                          <View style={{
                            width: 10, height: 10,
                            backgroundColor: container.activeInput ? Colors.parrotGreenColor : null,
                            borderRadius: 50, borderWidth: 0.6, borderColor: Colors.parrotGreenColor
                          }}></View>
                        </View>
                        <View style={{ width: '90%', marginLeft: 0 }}>
                          <TextView style={{ fontSize: 12 }} text={'Start date'} />
                          <CustomCalender
                            variable={"1"}
                            setDate={setContainer}
                            container={container}
                            text={container.startDate}
                          />
                        </View>
                      </View>
                      <View style={styles.s_circle} />
                      <View style={styles.s_circle} />
                      <View style={styles.s_circle} />

                      <View style={{ flexDirection: 'row' }}>

                        <View style={{ width: '10%', flexDirection: 'column', justifyContent: 'center', }}>
                          <View style={{
                            width: 10, height: 10,
                            backgroundColor: container.startDate ? Colors.parrotGreenColor : null,
                            borderColor: Colors.parrotGreenColor,
                            borderRadius: 50, borderWidth: 0.6
                          }}></View>
                        </View>
                        <View style={{ width: '90%', marginLeft: 0, marginTop: 15 }}>
                          <TextView style={{ fontSize: 12 }} text={'End Date'} />
                          <CustomCalender
                            variable={"2"}
                            setDate={setContainer}
                            container={container}
                            text={container.endDate}
                          />
                        </View>
                      </View>
                    </View>
                  </View>
                  <View style={{ flexDirection: 'row', justifyContent: 'center', marginTop: 15 }}>
                    <Pressable
                      style={{
                        padding: 10, backgroundColor: Colors.parrotGreenColor, width: '30%',
                        borderRadius: 7, elevation: 5
                      }}
                      onPress={() => {
                        if (container.startDate == "") {
                          Alert.alert("Stop!", "Please select Start date.", [{ text: "OK", onPress: () => { } }])
                        }
                        else if (container.endDate == "") {
                          Alert.alert("Stop!", "Please select End date.", [{ text: "OK", onPress: () => { } }])
                        }
                        else {
                          SetChips(1)
                        }
                      }

                      }
                    >
                      <TextView text={"Search"} style={{ color: '#FFF', alignSelf: 'center' }} />
                    </Pressable>
                  </View>
                </View>

              }
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
    height: height / 1.5,
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

  modal: {
    flex: 1,
    alignItems: 'center',
    padding: 20,
  },
  absolute: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
  },
  s_circle: { borderRadius: 100, width: 5, height: 5, backgroundColor: '#cdcdcd', marginTop: 5 }
});
export default FilterModal;
