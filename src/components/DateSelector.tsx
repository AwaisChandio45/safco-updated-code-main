import React, { memo, useState } from 'react';
import { View, Dimensions, Modal, StyleSheet, Pressable, Text } from 'react-native';
import { Card } from 'react-native-paper';
const { height, width } = Dimensions.get('window');
import { Calendar } from 'react-native-calendars';
import { connect, useSelector } from 'react-redux';
import TextView from './TextView';
import { GlobalStyles } from '../theme';
import moment from 'moment';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import { FONTS } from '../theme/Fonts';
// here 1=DOB
// here 2=(cnic) issue date
// here 3=(cnic) expire
// here 4=loan date

const DateSelector = ({
  title,
  setAlldataobj,
  allDataobj,
  array_index,
  fieldName,
  setToast,
  style,
}) => {
  const [calendarVisible, setCalendarVisible] = React.useState(false);

  const [markedDates, setmarkedDates] = useState([]);

  const [selectedDate, setselectedDate] = useState([]);
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);

  const showDatePicker = () => {
    setDatePickerVisibility(true);
  };

  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };
  const diffInMonths = (end, start) => {
    var timeDiff = Math.abs(end.getTime() - start.getTime());
    return Math.round(timeDiff / (2e3 * 3600 * 365.25));
 }
  const handleConfirm = date => {
    console.warn('A date has been picked: ', moment(date).format('MMM Do YY'));
    let get = allDataobj;
    if (fieldName == 1) {
      hideDatePicker();
      return
      if (moment().diff(date, 'years') <= 18) {
        hideDatePicker();
        setToast({
          type: "error",
          message: 'Sorry! Customer age must be greater than 18',
        });
        return;
      }
      if (moment().diff(date, 'years') > 62) {
        hideDatePicker();
        setToast({
          type: "error",
          message: 'Sorry! Customer age must be less than 62',
        });
        return;
      }
      get.customerInfo[array_index].customer_dob =
        // moment(date).format('MMM Do YY');
        moment(date).format("YYYY/MM/DD");

    } else if (fieldName == 2) {
      var varDate = new Date(date)
      console.log("varDate", varDate)
      var today = new Date();

      if (varDate >= today) {
        hideDatePicker();
        setToast({
          type: "error",
          message: 'Sorry! Date must not be greater than current date',
        });
        return;
      }
      get.customerInfo[array_index].customer_cnicissueDate =
        // moment(date).format('L');
        moment(date).format("YYYY/MM/DD");

      //get.customerInfo[array_index].customer_cnicExpireDate = undefined;
      
    } else if (fieldName == 3) {
      hideDatePicker();
      // return
      var dateOne=get.customerInfo[array_index].customer_cnicissueDate.replace(/\//g,"-");
      var date1=new Date(dateOne);
      var date2=new Date(date);
      console.log("date2",date2)
    //  var check= moment(date).diff(moment(dateOne), 'years')
    //     console.log("dateehree",dateehree);
    //     console.log("date2",dateTwo);
    //     console.log("check",check);
    //     hideDatePicker();
    //     return;

      
      //CNIC EXPIRE DATE -------------------------------
      // const date1: any = new Date(
      //   get.customerInfo[array_index].customer_cnicissueDate,
      // );
      // const date2: any = new Date(
      //   // moment(date).format('L')
      //   moment(date).format("YYYY/MM/DD")

      //   );
        //current date=
        const date3:any=new Date()
        console.log("date3",date3)
    //  const daysBetween = moment.duration(date2 - date3).days();
    // var daysBetween = Math.abs(date2-date3);
    
  
      const diffDays = moment.duration(date2 - date1).years();

      if (get.customerInfo[array_index].customer_cnicissueDate == undefined) {
        hideDatePicker();
        setToast({
          type: "error",
          message: 'Sorry! First Select CNIC Issue Date',
        });
        return;
      } else if (diffDays < 5) {
        hideDatePicker();
        setToast({
          type: "error",
          message: 'Sorry! Years between NIC Issuance and Expiry date must be greater than equal to 5 year',
        });
        return;
      } else if (diffDays > 15) {
        hideDatePicker();
        setToast({
          type: "error",
          message: 'Sorry! Years between NIC Issuance and Expiry date must be greater than equal to 5 year or less than 15 years',
        });
        return;
      }else if (diffDays > 15) {
        hideDatePicker();
        setToast({
          type: "error",
          message: 'Sorry! Years between NIC Issuance and Expiry date must be greater than equal to 5 year or less than 15 years',
        });
        return;
      }
      console.log(date2.getTime() +"<="+ date3.getTime());
      if(date2.getTime() <= date3.getTime())  {
         hideDatePicker();
        setToast({
          type: "error",
          message: 'Sorry! You can not Apply for Loan , Your NIC will Expire within 15 days',
        });
        return
      }
      get.customerInfo[array_index].customer_cnicExpireDate =
        // moment(date).format('L');
        moment(date).format("YYYY/MM/DD");

    } else if (fieldName == 4) {
      var varDate = new Date(date)
      var today = new Date();

      if (varDate >= today) {
        hideDatePicker();
        setToast({
          type: "error",
          message: 'Sorry! Loan Date must not be greater than current date.',
        });
        return;
      }else if (diffInMonths(varDate,today)>3){
        hideDatePicker();
        setToast({
          type: "error",
          message: 'Months between given date and current date must be  less than 3',
        });
        return;
      }
      get.loanInfo[array_index].loanDate = moment(date).format('MMM Do YY');
    }else if(fieldName == 5){
      var varDate = new Date(date).getDate()
      console.log("varDate", varDate)
      var today = new Date().getDate();
      console.log("today", today)

      if (varDate < today) {
        hideDatePicker();
        setToast({
          type: "error",
          message: 'Sorry! Date must be greater than or equal to current date',
        });
        return;
      }
      get.startingDate=date

    }
    else if (fieldName ==6) {
      if (moment().diff(date, 'years') <= 18) {
        hideDatePicker();
        setToast({
          type: "error",
          message: 'Sorry! Customer age must be greater than 18',
        });
        return;
      }
      if (moment().diff(date, 'years') > 62) {
        hideDatePicker();
        setToast({
          type: "error",
          message: 'Sorry! Customer age must be less than 62',
        });
        return;
      }
      get.customerDateOfBirth.value =
        // moment(date).format('MMM Do YY');
        moment(date).format("YYYY-MM-DD");

    } else if (fieldName == 7) {
      var varDate = new Date(date)
      console.log("varDate", varDate)
      var today = new Date();

      if (varDate < today) {
        hideDatePicker();
        setToast({
          type: "error",
          message: 'Sorry! Date must be greater than current date',
        });
        return;
      }
      get.customerNicExpiryDate.value =
        // moment(date).format('L');
        moment(date).format("YYYY-MM-DD");
    } else if (fieldName == 8) {
      var varDate = new Date(date)

      get.loanApplicationDate.value =
        // moment(date).format('L');
        moment(date).format("YYYY-MM-DD");
    }
    else if(fieldName == 9){
      var varDate = new Date(date).getDate()
      console.log("varDate", varDate)
      var today = new Date().getDate();
      console.log("today", today)

      if (varDate < today) {
        hideDatePicker();
        setToast({
          type: "error",
          message: 'Sorry! Date must be greater than or equal to current date',
        });
        return;
      }
      get.RepaymentStartDate=date

    }

    setAlldataobj({ ...get });

    hideDatePicker();
  };

  return (
    <View style={[styles.textInput,style]}>
      <View style={{ position: 'absolute', right: 1 }}>
        <Text style={{ color: '#FF0000' }}>*</Text>
      </View>
      <Pressable onPressIn={() => setDatePickerVisibility(true)}>
        <View
          style={[
            GlobalStyles.row,
            { justifyContent: 'space-between', paddingTop: 15 },
          ]}>
          <TextView
            style={{ color: '#727272', marginLeft: 10 }}
            type={'normalMini'}
            text={title}></TextView>
          <MaterialCommunityIcons
            name="calendar"
            color={'#245e46'}
            size={26}></MaterialCommunityIcons>
        </View>
      </Pressable>
      <DateTimePickerModal
        isVisible={isDatePickerVisible}
        mode="date"
        onConfirm={handleConfirm}
        onCancel={hideDatePicker}
      />
      {/* {calendarVisible && (
        <Modal
          animationType={'fade'}
          transparent={true}
          visible={calendarVisible}
          onRequestClose={() => {
            setCalendarVisible(false);
            //console.log('Modal has been closed.');
          }}>
            <Card style={styles.modal}>
          <View >
            <Calendar
              // Enable horizontal scrolling, default = false
              horizontal={true}
              markingType={'period'}
              markedDates={markedDates}
              onDayPress={day => {
                const _selectedDay = day.dateString;
                let selected = true;
                if (markedDates[_selectedDay]) {
                  selected = !markedDates[_selectedDay].selected;
                }
                const updatedMarkedDates = {
                  ..._selectedDay,
                  ...{[_selectedDay]: {selected, selectedColor: Colors.parrotGreenColor}},
                };
                if (selected) {
                  var newArray = [];
                  newArray.push(_selectedDay);
                  setselectedDate([...newArray]);
                  let get=allDataobj;
                  if(fieldName==1){
                    get.customerInfo[array_index].customer_dob=newArray[0];
                }else if(fieldName==2){
                  get.customerInfo[array_index].customer_cnicissueDate=newArray[0];
                }else if(fieldName==3){
                  get.customerInfo[array_index].customer_cnicExpireDate=newArray[0];
                }else if(fieldName==4){
                  get.loanInfo[array_index].loanDate=newArray[0];
                }
                
  setAlldataobj({...get})

                } else {
                  var newArray = [];
                  newArray.pop();
                  let get=allDataobj;
                  if(fieldName==1){
                    get.customerInfo[array_index].customer_dob=newArray[0];

                  }else if(fieldName==2){
                    get.customerInfo[array_index].customer_cnicissueDate=newArray[0];
                  }else if(fieldName==3){
                    get.customerInfo[array_index].customer_cnicExpireDate=newArray[0];
                  }else if(fieldName==4){
                    get.loanInfo[array_index].loanDate=newArray[0];
                  }
  setAlldataobj({...get})
                  setselectedDate([...newArray]);
                }

                setCalendarVisible(false);
                setmarkedDates(updatedMarkedDates);
              }}
              pastScrollRange={24}
              futureScrollRange={24}
              markingType={'custom'}
            
            />
          </View>
          </Card>
        </Modal>
      )} */}
    </View>
  );
};

const styles = StyleSheet.create({
  modal: {
    height: height / 2,
    width: width / 1.5,
    alignSelf: 'center',
    marginTop: 100,
    alignItems: 'center',
    padding: 10,
    elevation: 20,
    borderRadius: 20,
    justifyContent: 'center',
  },
  absolute: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
  },
  textInput: {
    backgroundColor: '#f1f1f1',
    height: 55,
    paddingRight: 5,
    marginTop: 5,
    borderBottomColor: '#cdcdcd',
    borderBottomWidth: 1,
    marginBottom: 15,
    width: width / 2.5,
    borderRadius: 3,
  },
  textContainer: {
    marginTop: 0,
    marginLeft: 0,
    marginRight: 0,
    textAlignVertical: 'center',
  },
});
export default memo(DateSelector);
