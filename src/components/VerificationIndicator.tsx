import React, {memo} from 'react';
import {TextInput, View, Pressable, StyleSheet} from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import EvilIcons from 'react-native-vector-icons/EvilIcons';
import {TextView} from '../components';
import {connect, useSelector} from 'react-redux';

import {RadioButton} from 'react-native-paper';
import {useNavigation} from '@react-navigation/native';
import {Card} from 'react-native-paper';
import {Colors} from '../theme';

const VerificationIndicator = ({
  text,
  firstoption = 0,
  secondoption = 1,
  onPress,
  value,
}) => {
  const [checked, setChecked] = React.useState(value);

  return (
    <View style={[styles.row3, {marginTop: 10}]}>
      <TextView
        style={{flex: 1, marginTop: 10}}
        type={'Light'}
        text={text}></TextView>
      <View style={styles.row3}>
        <RadioButton
          style={{marginRight: 20}}
          value={firstoption}
          uncheckedColor={'#cdcdcd'}
          color={Colors.parrotGreenColor}
          status={checked === firstoption ? 'checked' : 'unchecked'}
          onPress={() => {
            setChecked(firstoption);
            onPress(firstoption);
          }}
        />
        <RadioButton
          style={{marginLeft: 0}}
          value={secondoption}
          uncheckedColor={'#cdcdcd'}
          color={Colors.parrotGreenColor}
          status={checked === secondoption ? 'checked' : 'unchecked'}
          onPress={() => {
            setChecked(secondoption);

            onPress(secondoption);
          }}
        />
      </View>
    </View>
  );
};
const styles = StyleSheet.create({
  row3: {
    marginTop: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});
export default memo(VerificationIndicator);
