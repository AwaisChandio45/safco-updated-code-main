import React, { useState } from "react";
import { Button, View, Pressable, Alert } from "react-native";
import { FONTS } from "../theme/Fonts";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import moment from "moment";
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { TextView } from ".";
import { Colors } from "../theme";

const CustomCalender = ({boxStyle, setDate,container,text,variable}) => {
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);

  const showDatePicker = () => {
    if(variable==2){
      if(container.startDate){
        setDatePickerVisibility(true);
      }else{
        Alert.alert('Please select Start date first!')
      }
    }else{
      setDatePickerVisibility(true);
    }
    
  };

  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };

  const handleConfirm = (date) => {
    //let getdate = new moment()
    if(variable=="1"){
      setDate({...container,startDate:date,endDate:""})
    }else if(variable=="2"){
      var d1 = new Date(container.startDate);
      var d2 = new Date(date);
      if(d1.getTime() > d2.getTime()){
         Alert.alert('','End date must be greater then Start date!')
      }else{
        setDate({...container,endDate:date});
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
            <TextView style={{color: '#1d1d1d', fontsFamily:FONTS.FONT_REGULAR, fontSize:12}} text={moment(text).format('MMM Do YY')=='Invalid date'?'Select Date':moment(text).format('MMM Do YY')}></TextView>
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

export default CustomCalender;