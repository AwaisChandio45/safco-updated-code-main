import React, {memo} from 'react';
import LinearGradient from 'react-native-linear-gradient';
import {
  View,
  Text,
  Pressable,
  TextInput,
  Dimensions,
  StyleSheet,
  Alert,
} from 'react-native';
import {Card} from 'react-native-paper';
import {connect, useSelector} from 'react-redux';
import {TextView} from '.';
import LottieView from 'lottie-react-native';
import Colors from '../theme/Colors';
const {height, width} = Dimensions.get('window');

const Tabsitems = ({textstyle, text, onPress, style, active}) => {
  return (
    <Pressable
      style={{
        margin: 10,
        flex: 1,
        marginTop: 10,
        borderBottomColor: Colors.darkGreenColor,
        borderBottomWidth: active ? 1 : 0,
        height: 40,
      }}
      onPressIn={onPress}>
      <TextView
        style={{
          fontSize: 14,
          textAlign: 'center',
          color: active ? Colors.darkGreenColor : Colors.light_dark_gray,
        }}
        text={text}
      />
    </Pressable>
  );
};
const styles = StyleSheet.create({
  card: {
    marginLeft: 5,
    marginRight: 5,
    height: 40,
    borderRadius: 20,
    elevation: 10,
    justifyContent: 'center',
    paddingTop: 10,
  },
  textContainer: {
    marginTop: 0,
    marginLeft: 10,
    marginRight: 10,
    textAlignVertical: 'center',
    textAlign: 'center',
  },
});
export default memo(Tabsitems);
