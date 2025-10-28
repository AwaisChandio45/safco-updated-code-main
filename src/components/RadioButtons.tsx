import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { RadioButton } from 'react-native-paper';
import { Colors } from '../theme';

const CustomRadioButton = ({ onPress, selected }) => {
  return (
    <View style={styles.radioButtonContainer}>
      <RadioButton.Item
        label="5 - Very Satisfied"
        value={5}
        status={selected === 5 ? 'checked' : 'unchecked'}
        onPress={() => onPress(5)}
        color={Colors.parrotGreenColor}
        uncheckedColor="#cdcdcd"
        labelStyle={styles.radioButtonText}
      />
      <RadioButton.Item
        label="4 - Satisfied"
        value={4}
        status={selected === 4 ? 'checked' : 'unchecked'}
        onPress={() => onPress(4)}
        color={Colors.parrotGreenColor}
        uncheckedColor="#cdcdcd"
        labelStyle={styles.radioButtonText}
      />
      <RadioButton.Item
        label="3 - Neither Satisfied nor Dissatisfied"
        value={3}
        status={selected === 3 ? 'checked' : 'unchecked'}
        onPress={() => onPress(3)}
        color={Colors.parrotGreenColor}
        uncheckedColor="#cdcdcd"
        labelStyle={styles.radioButtonText}
      />
      <RadioButton.Item
        label="2 - Dissatisfied"
        value={2}
        status={selected === 2 ? 'checked' : 'unchecked'}
        onPress={() => onPress(2)}
        color={Colors.parrotGreenColor}
        uncheckedColor="#cdcdcd"
        labelStyle={styles.radioButtonText}
      />
      <RadioButton.Item
        label="1 - Very Dissatisfied"
        value={1}
        status={selected === 1 ? 'checked' : 'unchecked'}
        onPress={() => onPress(1)}
        color={Colors.parrotGreenColor}
        uncheckedColor="#cdcdcd"
        labelStyle={styles.radioButtonText}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  radioButtonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  radioButtonText: {
    fontSize: 16,
    marginLeft: 8,
    padding: 5,
  },
});

export default CustomRadioButton;
