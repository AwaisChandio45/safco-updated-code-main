import * as React from 'react';
import {View, Dimensions, StyleSheet} from 'react-native';
import {RadioButton} from 'react-native-paper';
import TextView from './TextView';
const {height, width} = Dimensions.get('window');
import {connect, useSelector} from 'react-redux';
import {Colors, GlobalStyles} from '../theme';
import FormInputs from './FormInputs';
// here 1=gender selection
// here 2=martial selection
// here 3=Guardian selection
// here 4=gender selection for family

const MyComponent = ({
  txtfield = false,
  twofield = 3,
  title,
  firstoption,
  secondoption,
  thirdoption,
  fourthoption,
  setAlldataobj,
  allDataobj,
  array_index,
  variable,
}) => {
  const [checked, setChecked] = React.useState(
    variable == 1
      ? allDataobj.customerInfo[array_index].customer_gender
      : variable == 2
      ? allDataobj.customerInfo[array_index].customer_maritialStatus
      : variable == 3
      ? allDataobj.customerInfo[array_index].customer_guardianceOf
      : allDataobj.familyMemberInfo[array_index].familyMember_genderSelection,
  );
  //  const[name,setName]=React.useState("")
  var name = '';
  var regex = /^[a-zA-Z ]*$/;

  const [index, setIndex] = React.useState(0);
  const checker = value => {
    setIndex(value);
    if (value == 1) {
      let get = allDataobj;
      if (variable == 1) {
        get.customerInfo[array_index].customer_guardianceOf = undefined;
        get.customerInfo[array_index].customer_gender = firstoption;
      } else if (variable == 2) {
        get.customerInfo[array_index].customer_maritialStatus = firstoption;
      } else if (variable == 3) {
        get.customerInfo[array_index].customer_guardianceOf = firstoption;
      } else if (variable == 4) {
        get.familyMemberInfo[array_index].familyMember_genderSelection =
          firstoption;
      }

      setAlldataobj({...get});
      setChecked(firstoption);
    } else if (value == 2) {
      let get = allDataobj;
      if (variable == 1) {
        get.customerInfo[array_index].customer_guardianceOf = undefined;
        get.customerInfo[array_index].customer_gender = secondoption;
      } else if (variable == 2) {
        get.customerInfo[array_index].customer_maritialStatus = secondoption;
      } else if (variable == 3) {
        get.customerInfo[array_index].customer_guardianceOf = secondoption;
      } else if (variable == 4) {
        get.familyMemberInfo[array_index].familyMember_genderSelection =
          secondoption;
      }
      setAlldataobj({...get});
      setChecked(secondoption);
    } else if (value == 3) {
      let get = allDataobj;
      if (variable == 1) {
        get.customerInfo[array_index].customer_guardianceOf = undefined;
        get.customerInfo[array_index].customer_gender = thirdoption;
      } else if (variable == 2) {
        get.customerInfo[array_index].customer_maritialStatus = thirdoption;
      } else if (variable == 3) {
        get.customerInfo[array_index].customer_guardianceOf = thirdoption;
      } else if (variable == 4) {
        get.familyMemberInfo[array_index].familyMember_genderSelection =
          thirdoption;
      }
      setAlldataobj({...get});
      setChecked(thirdoption);
    } else if (value == 4) {
      let get = allDataobj;
      if (variable == 1) {
        get.customerInfo[array_index].customer_guardianceOf = undefined;
        get.customerInfo[array_index].customer_gender = fourthoption;
      } else if (variable == 2) {
        get.customerInfo[array_index].customer_maritialStatus = fourthoption;
      } else if (variable == 3) {
        get.customerInfo[array_index].customer_guardianceOf = fourthoption;
      } else if (variable == 4) {
        get.familyMemberInfo[array_index].familyMember_genderSelection =
          fourthoption;
      }
      setAlldataobj({...get});
      setChecked(fourthoption);
    }
  };
  return (
    <View style={[styles.textInput, {marginTop: 20}]}>
     <View style={{flexDirection: 'row',alignItems:'center'}}>

     <TextView
        style={{color: '#808080', marginBottom: 10}}
        type={'normalRg'}
        text={title}></TextView>
        <TextView style={{color:'#FF0000',marginLeft:10,marginTop:-20}} text={"*"}></TextView>
      </View>
    
      <View style={styles.mainView}>
        <View style={GlobalStyles.row}>
          <RadioButton
            value={firstoption}
            uncheckedColor={'#cdcdcd'}
            color={Colors.parrotGreenColor}
            status={checked === firstoption ? 'checked' : 'unchecked'}
            onPress={() => checker(1)}
          />
          <TextView type={'normalRg'} text={firstoption}></TextView>
        </View>
       {twofield >=2 && <View style={[GlobalStyles.row, {marginLeft: 10}]}>
          <RadioButton
            value={secondoption}
            uncheckedColor={'#cdcdcd'}
            color={Colors.parrotGreenColor}
            status={checked === secondoption ? 'checked' : 'unchecked'}
            onPress={() => checker(2)}
          />
          <TextView type={'normalRg'} text={secondoption}></TextView>
        </View>}

        {twofield >= 3 && (
          <View style={[GlobalStyles.row, {marginLeft: 10}]}>
            <RadioButton
              value={thirdoption}
              uncheckedColor={'#cdcdcd'}
              color={Colors.parrotGreenColor}
              status={checked === thirdoption ? 'checked' : 'unchecked'}
              onPress={() => checker(3)}
            />
            <TextView type={'normalRg'} text={thirdoption}></TextView>
          </View>
        )}

        {twofield >= 4 && (
          <View style={[GlobalStyles.row, {marginLeft: 10}]}>
            <RadioButton
              value={fourthoption}
              uncheckedColor={'#cdcdcd'}
              color={Colors.parrotGreenColor}
              status={checked === fourthoption ? 'checked' : 'unchecked'}
              onPress={() => checker(4)}
            />
            <TextView type={'normalRg'} text={fourthoption}></TextView>
          </View>
        )}
        {txtfield && (
          <FormInputs
            required={true}
            text={''}
            error={allDataobj.customerInfo[array_index].customer_guardianceOfName.error}
            value={
              allDataobj.customerInfo[array_index].customer_guardianceOfName.value
            }
            onChangeText={(value: string) => {
              if(!regex.test(value)){
                return
                }
              let get = allDataobj;
              get.customerInfo[array_index].customer_guardianceOfName.value = value;
              get.customerInfo[array_index].customer_guardianceOfName.error =
              false;
              setAlldataobj({...get});
            }}></FormInputs>
        )}
      </View>
    </View>
  );
};
const styles = StyleSheet.create({
  textInput: {
    backgroundColor: '#f1f1f1',
    padding: 5,
    marginRight: 5,
    marginLeft: 5,
    marginTop: 10,
    borderRadius: 5,
  },
  mainView: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f1f1f1',
    borderRadius: 3,
  },
});
export default MyComponent;
