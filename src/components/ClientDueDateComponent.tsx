import React, { useState } from "react";
import { Button, View, Pressable, Alert } from "react-native";
import { FONTS } from "../theme/Fonts";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import moment from "moment";
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { TextView } from ".";
import { Colors } from "../theme";

const ClientDueDateComponent = ({ 
    setDate,
    container,
    text,
    variable,
}) => {
  const [isDatePickerVisible, setDatePickerVisibility] = React.useState(false);
   
    const showDatePicker = () => {
      if(variable==1){
      setDatePickerVisibility(true);
      setDate({...container,disburseDateTo:''})
    }else if(variable==2){
      if(container.disburseDateFrom){
        setDatePickerVisibility(true);
      }else{
        Alert.alert('','Please select disburse date from first')
      }
    }else if(variable==3){
      setDatePickerVisibility(true);
      setDate({...container,recoveryDateTo:''})
    }
    else if(variable==4){
      //console.log('clicked 4');
      if(container.recoveryDateFrom){
        setDatePickerVisibility(true);
      }else{
        Alert.alert('','Please select recovery date from first')
      }
    }
    else{
      setDatePickerVisibility(true);
    }
    
   };

  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };

  const handleConfirm = (date) => {
    if(variable=="1"){
      setDate({...container,disburseDateFrom:date})
    }else if(variable=="2"){
      var d1 = new Date(container.disburseDateFrom);
      var d2 = new Date(date);
      if(d1.getTime() > d2.getTime()){
         Alert.alert('','This Date must be greater then Disburse date from!')
      }else{
        setDate({...container,disburseDateTo:date})
      }
      
    }else if(variable=="3"){
      setDate({...container,recoveryDateFrom:date})
    }
    else if(variable=="4"){
      var d1 = new Date(container.recoveryDateFrom);
      var d2 = new Date(date);
      if(d1.getTime() > d2.getTime()){
         Alert.alert('','This date must be greater then Recovery date from!')
      }else{
        setDate({...container,recoveryDateTo:date})
      }
    }
     hideDatePicker();
  };

  return (
    <View >
      {/* <Button title="Show Date Picker" style={{backgroundColor:'#fff'}} onPress={showDatePicker} /> */}
      <Pressable 
      style={{borderBottomWidth:1, borderColor:'#cdcdcd', flexDirection:'row', marginTop:10, paddingLeft:10}} 
      onPress={showDatePicker}>
          <View style={{flex:1, }} >
            <TextView style={{marginLeft:10,color: '#1d1d1d', fontsFamily:FONTS.FONT_REGULAR, fontSize:12}} text={moment(text).format('MMM Do YY')=='Invalid date'?'Select Date':moment(text).format('MMM Do YY')}></TextView>
          </View>
          <View style={{flex:1, alignItems:'flex-end', paddingRight:10 }}>
            <MaterialCommunityIcons
            name="calendar"
            color={Colors.parrotGreenColor}
            size={20}/>
          </View>
      </Pressable>
      <DateTimePickerModal
        isVisible={isDatePickerVisible}
        mode="date"
        onConfirm={handleConfirm}
        onCancel={hideDatePicker}
        style={{backgroundColor:'#fff'}}
      />
    </View>
  );
};

export default ClientDueDateComponent;