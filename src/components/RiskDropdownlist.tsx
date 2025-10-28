import React, { memo } from 'react';
import { StyleSheet, Dimensions, View, Image, Pressable } from 'react-native';
import ModalDropdown from 'react-native-modal-dropdown';
import { Colors, Icons } from '../theme';
import { FONTS } from '../theme/Fonts';
var { height, width } = Dimensions.get('window');
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import TextView from './TextView';

const RiskDropdownlist = ({
  data,
  label,
  selected,
  RT = 1,
  setAlldataobj,
  allDataobj,
  array_index,
  variable,
  text = "",
  setTopupLoanMultiply
}) => {
  const [riskValue, setRisk] = React.useState(
    variable == 1 &&
      allDataobj.loanInfo[array_index].geographicrisk != undefined
      ? allDataobj.loanInfo[array_index].geographicrisk
      : variable == 2 &&
        allDataobj.loanInfo[array_index].customerandproductrisk != undefined
        ? allDataobj.loanInfo[array_index].customerandproductrisk
        : variable == 3 && allDataobj.loanInfo[array_index].peprisk != undefined
          ? allDataobj.loanInfo[array_index].peprisk
          : variable == 4 &&
            allDataobj.loanInfo[array_index].loanUtilizationrisk != undefined
            ? allDataobj.loanInfo[array_index].loanUtilizationrisk
            :variable == 6 &&
            allDataobj.loanInfo[array_index].EsmProductRiskValue != undefined
            ? {name:"None", risk:allDataobj.loanInfo[array_index].EsmProductRiskValue} 
            : { name: 'None', risk: 1 },


  );
  console.log("Risk =======>",riskValue)
  const _renderRow = (rowData, rowID, Highlighted) => {
    return (
      <TextView
        type={'Light'}
        style={{
          color: '#787878',
          margin: 10,
          fontSize: 12,
          fontFamily: FONTS.FONT_REGULAR,
        }}
        text={rowData.name}></TextView>
    );
  };
  const _renderButtonText = rowData => {
    return (
      <TextView
        type={'Light'}
        style={{
          color: '#787878',
          margin: 10,
          fontSize: 12,
          fontFamily: FONTS.FONT_REGULAR,
        }}
        text={rowData.name}></TextView>
    );
  };
  const _onSelet = (idx, value) => {
    setRisk(value);
    let get = allDataobj;

    if(variable == 6){
      get.loanInfo[array_index].EsmProductItemRisk = idx
      get.loanInfo[array_index].EsmProductRiskValue = value.risk
      
      setAlldataobj({ ...get });
    
    }else{
      if (variable == 1) {
        get.loanInfo[array_index].geographicrisk = value;
      } else if (variable == 2) {
        get.loanInfo[array_index].customerandproductrisk = value;
      } else if (variable == 3) {
        get.loanInfo[array_index].peprisk = value;
      } else if (variable == 4) {
        get.loanInfo[array_index].loanUtilizationrisk = value;
      }
      else if (variable == 5) {
        get.loanInfo[array_index].topupLoantype = value.name;
        get.loanInfo[array_index].topupLoanValue = value.value;
  
        var getNumber = Number(
          value.value
        );
        
        var multiplier = getNumber * Number(get.loanInfo[array_index].topupLoanQty==undefined?1:get.loanInfo[array_index].topupLoanQty.value);
        get.loanInfo[array_index].topupLoanValue = multiplier;
  
        setAlldataobj({ ...get });
        setTopupLoanMultiply(value.value)
        // setAlldataobj({ ...get });
      }
  
      var one = Number(
        get.loanInfo[array_index].geographicrisk == undefined
          ? 1
          : get.loanInfo[array_index].geographicrisk.risk,
      );
      var two = Number(
        get.loanInfo[array_index].customerandproductrisk == undefined
          ? 1
          : get.loanInfo[array_index].customerandproductrisk.risk,
      );
      var three = Number(
        get.loanInfo[array_index].peprisk == undefined
          ? 1
          : get.loanInfo[array_index].peprisk.risk,
      );
      var four = Number(
        get.loanInfo[array_index].loanUtilizationrisk == undefined
          ? 1
          : get.loanInfo[array_index].loanUtilizationrisk.risk,
      );
      var plus = Number(one + two + three + four);
      if (plus == 5) {
        get.loanInfo[array_index].borrowerriskprofile = 2;
        setAlldataobj({ ...get });
      } else if (plus == 4) {
        get.loanInfo[array_index].borrowerriskprofile = 1;
        setAlldataobj({ ...get });
      } else {
        get.loanInfo[array_index].borrowerriskprofile = 3;
        setAlldataobj({ ...get });
      }
    }
  };
  return (
    <View style={styles.row2}>
      <View style={[styles.textInput, {
        flex: variable != 5 ? 1 : 0, marginTop: variable != 5 ? 0 : 5,
        marginBottom: variable != 5 ? 0 : 15,
      }]}>
        <ModalDropdown
          defaultValue={label}
          textStyle={{
            color: '#727272',
            fontFamily: FONTS.FONT_REGULAR,
            fontSize: 12,
          }}
          defaultTextStyle={{
            color: '#727272',
            fontFamily: FONTS.FONT_REGULAR,
            fontSize: 12,
          }}
          showsVerticalScrollIndicator={false}
          renderRow={_renderRow}
          onSelect={_onSelet}
          renderRowComponent={Pressable}
          renderButtonText={_renderButtonText}
          // dropdownTextStyle={{fontSize: 12, fontFamily: FONTS.FONT_REGULAR}}
          dropdownStyle={[
            styles.dropdown,
            { marginRight: RT == 1 ? -30 : 0, marginLeft: RT == 2 ? -20 : 0 },
          ]}
          style={styles.dropdownstyles}
          options={data}
        />

        <MaterialCommunityIcons
          name="menu-down"
          color={'#000'}
          size={26}></MaterialCommunityIcons>
      </View>
      {variable != 5 &&
        <View
          style={{
            width: width / 2.5,
            height: 55,
            paddingLeft: 0,
            marginTop: 10,
            justifyContent: 'center',
          }}>
          <TextView
            type={'Light'}
            style={{ textAlign: 'center' }}
            text="Risk Profiling"></TextView>
          <View
            style={{
              alignSelf: 'center',
              backgroundColor:
                riskValue.risk == 1
                  ? 'green'
                  : riskValue.risk == 2
                    ? 'yellow'
                    : 'red',
              height: 30,
              width: 100,
              borderRadius: 10,
              justifyContent: 'center',
            }}>
            <TextView
              type={'Light'}
              style={{
                textAlign: 'center',
                color:
                  riskValue.risk == 1
                    ? '#FFF'
                    : riskValue.risk == 2
                      ? '#000'
                      : '#FFF',
              }}
              text={
                riskValue.risk == 1
                  ? 'Low'
                  : riskValue.risk == 2
                    ? 'Medium'
                    : 'High'
              }></TextView>
          </View>
        </View>
      }
    </View>
  );
};
export default memo(RiskDropdownlist);
const styles = StyleSheet.create({
  textInput: {
    backgroundColor: '#f1f1f1',
    height: 55,
    paddingLeft: 0,

    borderBottomColor: '#cdcdcd',
    borderBottomWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    width: width / 2.5,
    borderRadius: 3,
  },
  row2: {
    marginTop: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  dropdown: { height: 100, width: width / 2.5, marginTop: -20 },
  dropdownstyles: { marginLeft: 20, flex: 1 },
  img: { width: width / 20, height: width / 20, resizeMode: 'contain' },
});
