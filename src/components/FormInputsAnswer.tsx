import React, {memo} from 'react';
import {
  View,
  Text,
  TextInput,
  Dimensions,
  StyleSheet,
  Alert,
  Pressable,
} from 'react-native';
import {connect, useSelector} from 'react-redux';
import {TextView} from '.';
import {FONTS} from '../theme/Fonts';
import LottieView from 'lottie-react-native';
import  EvilIcons from 'react-native-vector-icons/EvilIcons'
import AntDesign from 'react-native-vector-icons/AntDesign'
import { TouchableOpacity } from 'react-native-gesture-handler';
const {height, width} = Dimensions.get('window');
const TextInputform = ({
  textstyle,
  text,
  onPress,
  style,
  keyboardtype,
  editable = true,
  ref,
  _onSubmit,
  value,
  maxLength,
  onChangeText,
  error,
  required=false,
  clearDataButton = false,
  clearText,
  dropDownButton = false,
  dropdownshow
}) => {
  let numOfLinesCompany = 0;
  return (
    <View style={{marginBottom:0}}>
      <View style={{flexDirection: 'row',alignItems: 'center'}}>
      <TextView type={'formLabel'} text={text} 
      style={{color:'#737373',marginLeft:10,width:width/3}}></TextView>
      {required && <Text style={{color:'#FF0000',marginLeft:5,marginTop:-10}}>*</Text>} 
      </View>
      <View style={[styles.textInputContainer,style, {borderBottomColor:error?'#ff0000':'#cdcdcd'}]}>
      <TextInput
        label={text}
        maxLength={maxLength}
        multiline={true}
        ref={ref}
        error={error}
        contextMenuHidden={true}
        blurOnSubmit={false}
        onSubmitEditing={_onSubmit}
        value={value}
        // onChangeText={(v)=>setValue(v)}
        returnKeyType="next"
        editable={editable}
        keyboardType={keyboardtype}
        onChangeText={onChangeText}
        // email-address
        // number-pad
        theme={{
          colors: {primary: 'green', underlineColor: 'transparent'},
          fonts: {
            regular: {
              fontFamily: FONTS.FONT_REGULAR,
            },
          },
        }}
        style={[styles.textInput]}
        // outlineColor={Colors.parrotGreenColor}
        // selectionColor={Colors.parrotGreenColor}
        // mode={'outlined'}
        // value={""}
        // onChangeText={}
      />
      {clearDataButton && value.length > 0 &&(
            <Pressable 
            style={{marginTop:'4%', marginRight:10}}
            onPress={clearText}
            >
              
              <EvilIcons name="close" color='#7d7d7d' size={20} style={{marginRight:10}} />
            
            </Pressable>
          )}
          {dropDownButton &&(
            <TouchableOpacity 
            style={{marginTop:'4%', marginRight:10}}
            onPress={dropdownshow}
            >
              
              <AntDesign name="caretdown" color='#7d7d7d' size={20} style={{marginRight:10}} />
            
            </TouchableOpacity>
          )}
          </View>
    </View>
  );
};
const styles = StyleSheet.create({
    textInputContainer: {
        flexDirection: 'column', // Changed from 'row' to 'column' for vertical alignment
        backgroundColor: '#f1f1f1',
        width: width / 1.2,
        borderBottomWidth: 1,
        borderBottomColor: '#000', // You can change the color as needed
        marginBottom: 10,
        borderRadius: 3,
        padding: 10, // Added padding for better spacing
        height: 150, // Set a fixed height for the container
      },
      textInput: {
        flex: 1,
        color: '#1d1d1d',
        padding: 0, // Ensure no padding inside the TextInput
        fontSize: 15,
        textAlignVertical: 'top', // Ensure text starts from the top
      },
});
export default memo(TextInputform);
