import React, {useState} from 'react'
import { StyleSheet } from 'react-native';
import { View } from 'react-native-animatable';
import DropDownPicker from 'react-native-dropdown-picker';
import { Dimensions, Text } from 'react-native';
import { TextView } from '.';
import { FONTS } from "../theme/Fonts";
import { border } from 'styled-system';

var {height, width} = Dimensions.get('window');

function DropDown ({label, required, data, onChangeValue}) {
    const [req, setreq] = useState(required)
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(null);
//   const [items, setItems] = useState([
//     {label: 'Apple', value: 'apple'},
//     {label: 'Banana', value: 'banana'}
//   ]);

  return (
    <View style={styles.dropdownCont}>
    <View style={{flexDirection:'row'}}>
        <TextView 
        type={'formLabel'} 
        text={label}
        style={{color:'#737373',width:width/3,}}>

        </TextView>
        <View>
                <Text 
                style={{color:'#ff0000', fontSize:15}}>
                    {req?'*':null}
                </Text>
        </View>
    </View>
    <DropDownPicker
      open={open}
      value={value}
      items={data}
      setOpen={setOpen}
      setValue={setValue}
      //setItems={setItem}
      onChangeValue={onChangeValue}
      disableBorderRadius={true}
      labelStyle={{
        fontSize:12, color:'#727272',fontFamily:FONTS.FONT_REGULAR
      }}
      listMode="SCROLLVIEW"
        scrollViewProps={{
          nestedScrollEnabled: true,
      }}
      style={styles.dropdownStyle}
      containerStyle={{
        width:width/2.5,
      }}
      placeholderStyle={{
        fontSize:12, color:'#727272',fontFamily:FONTS.FONT_REGULAR
      }}
      listItemContainerStyle={{backgroundColor:'#f1f1f1'}}
      listItemLabelStyle={{fontSize:12}}
      selectedItemContainerStyle={{backgroundColor:'#f1f1f1'}}
      dropDownContainerStyle={{backgroundColor:'#f2f2f2'}}
      

    />
    </View>
    
  );
}

const styles = StyleSheet.create({
    dropdownCont:{ marginLeft:10, flex:1,  },
    dropdownStyle:{ backgroundColor:'#f1f1f1', borderWidth:0, height:55, paddingLeft:0, marginTop:5, marginBottom:33,  borderBottomColor:'#cdcdcd',
        borderBottomWidth:1,
        //flexDirection:'row',
        borderRadius:3, fontSize:12,        
    }
})

export default DropDown;