import React, {memo} from 'react';
import {
  View,
  Text,
  TextInput,
  Dimensions,
  StyleSheet,
  Alert,
} from 'react-native';
import {connect, useSelector} from 'react-redux';
import {TextView} from '.';
import {FONTS} from '../theme/Fonts';
import LottieView from 'lottie-react-native';
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
  onChangeText,
  error,
}) => {
  let numOfLinesCompany = 0;
  return (
    <View style={{}}>
      <TextView text="Company"></TextView>
      <TextInput
        label={text}
        ref={ref}
        error={error}
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
        style={styles.textInput}
        // outlineColor={Colors.parrotGreenColor}
        // selectionColor={Colors.parrotGreenColor}
        // mode={'outlined'}
        // value={""}
        // onChangeText={}
      />
    </View>
  );
};
const styles = StyleSheet.create({
  textInput: {
    backgroundColor: '#f1f1f1',
    color: '#1d1d1d',
    paddingLeft: 5,
    fontSize: 12,
    width: width / 2.4,
    borderRadius: 3,
  },
  textContainer: {
    marginTop: 0,
    marginLeft: 0,
    marginRight: 0,
    textAlignVertical: 'center',
  },
});
export default TextInputform;
