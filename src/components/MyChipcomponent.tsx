import React, {memo} from 'react';
import LinearGradient from 'react-native-linear-gradient';
import {
  View,
  TextInput,
  Pressable,
  Dimensions,
  StyleSheet,
  Alert,
} from 'react-native';
import {Card} from 'react-native-paper';
import {connect, useSelector} from 'react-redux';
import {TextView} from '.';
import {FONTS} from '../theme/Fonts';
import LottieView from 'lottie-react-native';
const {height, width} = Dimensions.get('window');
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { Checkbox } from 'react-native-paper';
import { Colors } from '../theme';

const MyChipcomponent = ({
  textstyle,
  value,
  onPress,
  style,
  onChangeText,
  editable = true,
  ref,
  onClose,
  isLeader,
  onPressLeader
}) => {
  let numOfLinesCompany = 0;
  return (
    <View style={styles.inputContainer}>
      <TextInput
        ref={ref}
        value={value}
        editable={false}
        keyboardType={'phone-pad'}
        onChangeText={onChangeText}
        style={styles.textInput}
        placeholder={'Type Cnic'}
        placeholderTextColor={'#cdcdcd'}
       ></TextInput>
        <Checkbox
      color={Colors.green}
      uncheckedColor={Colors.green}
      status={isLeader ? 'checked' : 'unchecked'}
      onPress={onPressLeader}
    />
      <Pressable onPressIn={onClose}>
        <View style={styles.close}>
          <MaterialCommunityIcons
            name="close"
            style={{alignSelf: 'center', color: '#FFF'}}
          />
        </View>
      </Pressable>
    </View>
  );
};
const styles = StyleSheet.create({
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 40,
    backgroundColor: '#EBEBEB',
    justifyContent: 'center',
    borderRadius: 20,
    paddingLeft: 20,
    marginTop:10,
  },
  textInput: {
    flex: 1,fontSize: 12,fontFamily: FONTS.FONT_REGULAR,color:'#7d7d7d'
  },
  textContainer: {
    marginTop: 0,
    marginLeft: 0,
    marginRight: 0,
    textAlignVertical: 'center',
  },
  close: {
    height: 20,
    width: 20,
    borderRadius: 50,
    marginRight: 10,
    marginLeft:10,
    backgroundColor: '#7d7d7d',
    justifyContent: 'center',
  },
});
export default memo(MyChipcomponent);
