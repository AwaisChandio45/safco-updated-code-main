import React, {memo} from 'react';
import {
  View,
  TextInput,
  Dimensions,
  StyleSheet,
  Alert,
  Pressable,
} from 'react-native';
import {connect, useSelector} from 'react-redux';
import {TextView} from '.';
import {FONTS} from '../theme/Fonts';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import EvilIcons from 'react-native-vector-icons/EvilIcons';
import LottieView from 'lottie-react-native';
const {height, width} = Dimensions.get('window');
const CnicInputoptions = ({
  textstyle,
  text,
  onPress,
  style,
  keyboardtype,
  editable = true,
  refer,
  _onSubmit,
  value,
  onChangeText,
  error,
  _onPress,
  required = false,
  clearText,
}) => {
  let numOfLinesCompany = 0;
  return (
    <Pressable>
      <View style={{marginBottom: 0}}>
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <TextView
            type={'formLabel'}
            text={text}
            style={{
              color: '#737373',
              marginLeft: 10,
              width: width / 3,
            }}></TextView>
          {required && (
            <TextView style={{color: '#FF0000', marginLeft: 5, marginTop: -10}}>
              *
            </TextView>
          )}
        </View>
        <View
          style={{
            flexDirection: 'row',
            borderBottomWidth: 1,
            borderBottomColor: error ? '#ff0000' : '#cdcdcd',
            paddingLeft: 20,
            marginBottom: 10,
            //fontSize: 12,
            width: width / 2.4,
            borderRadius: 3,
          }}>
          <TextInput
            label={text}
            ref={refer}
            error={error}
            blurOnSubmit={false}
            onSubmitEditing={_onSubmit}
            value={value}
            // autoFocus={true}
            // focusable={editable}
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
            style={[
              styles.textInput /*{ borderBottomColor:error?'#ff0000':'#cdcdcd'}*/,
            ]}
            // outlineColor={Colors.parrotGreenColor}
            // selectionColor={Colors.parrotGreenColor}
            // mode={'outlined'}
            // value={""}
            // onChangeText={}
          />
          {editable && value.length > 0 && (
            <Pressable
              style={{flexDirection: 'column', justifyContent: 'center'}}
              onPress={clearText}>
              <EvilIcons
                name="close"
                color="#7d7d7d"
                size={20}
                style={{marginRight: 10}}
              />
            </Pressable>
          )}
          <MaterialCommunityIcons
            onPress={_onPress}
            name="qrcode-scan"
            size={20}></MaterialCommunityIcons>
        </View>
      </View>
    </Pressable>
  );
};
const styles = StyleSheet.create({
  textInput: {
    backgroundColor: '#f1f1f1',
    color: '#1d1d1d',
    //borderBottomWidth:1,

    // paddingLeft: 20,
    // marginBottom:10,
    fontSize: 12,
    width: width / 3.5,
    // borderRadius: 3,
  },
  textContainer: {
    marginTop: 0,
    marginLeft: 0,
    marginRight: 0,
    textAlignVertical: 'center',
  },
});
export default memo(CnicInputoptions);
