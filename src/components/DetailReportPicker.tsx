import React from 'react';
import {Picker} from '@react-native-picker/picker';
import { StyleSheet, Dimensions } from 'react-native';
import { FONTS } from "../theme/Fonts";
import { View } from 'react-native-animatable';
import ModalDropdown from 'react-native-modal-dropdown';

var {height, width} = Dimensions.get('window');

const DetailReportPicker = ({onValueChange,value,data})=>{

   
    return (
        <View style={styles.picker}>
            <ModalDropdown
            defaultValue={value}
            defaultIndex={-1}
            textStyle={{color:'#727272',fontFamily:FONTS.FONT_REGULAR,fontSize:12}}
            defaultTextStyle={{color:'#727272',fontFamily:FONTS.FONT_REGULAR,fontSize:12}}
            showsVerticalScrollIndicator={false}
            dropdownTextStyle={{backgroundColor:'#fafafa',fontSize:12,fontFamily:FONTS.FONT_REGULAR}}
            dropdownStyle={styles.dropdown}/*{marginRight:RT==1?-30:0,marginLeft:RT==2?-20:0}]*/
            style={styles.dropdownstyles}
            onSelect={onValueChange}
            options={data}
            
            />
        </View>
    )}

const styles = StyleSheet.create({
    picker:{
        paddingLeft:0,
        borderColor:'#f1f1f1',
        borderBottomWidth:1,
        width:'100%',
        borderRadius:3
    },
    pickerItem:{
        fontSize:13,
        borderColor:'#f1f1f1',
        borderBottomWidth:1,
        alignItems:'center',
        borderRadius:3,
    },
    dropdown:{
        height:100, 
        width: width / 2.5,
        marginTop:-61,
        //marginLeft:-10,
        backgroundColor:'#F1f1f1'
    },
    dropdownstyles:{
        marginLeft:10,
        flex:1
    },
    img:{ 
        width: width / 20, 
        height: width / 20, 
        resizeMode: "contain" 
    },
})

export default DetailReportPicker;