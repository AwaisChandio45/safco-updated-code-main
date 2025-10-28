import React, { useState } from 'react';
import {
  SafeAreaView,
  Text,
  View,
  StyleSheet,
  Dimensions,
  Pressable,
  Alert,
  ActivityIndicator, // Import ActivityIndicator
} from 'react-native';
import { Button } from 'react-native-paper';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import moment from 'moment';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { HeaderwithoutDialoge, TextView } from '../../components';  // Make sure to import the header component
import { GlobalStyles, Colors } from '../../theme';
import axios from 'axios';

import { useSelector } from 'react-redux';
import { fetchLoanStatusReport } from '../../apis_auth/apis';
import LoanStatusDetails from './LoanStatusDetails';

const LoanStatusReport = ({ navigation }) => {
  const getUserData = useSelector(state => state.UserData);
  const [EmployeeId, setEmployeeId] = useState(getUserData.UserData.EmployeeId);
  const OrganizationType = Number(getUserData?.UserData?.OrganizationType);
  const loanLabel = OrganizationType === 2 ? 'Finance Facility' : 'Loan';
  const [StationId, setStationId] = useState(getUserData.UserData.StationId);
  console.log('LOGIN EMPLOYEE', EmployeeId);
  console.log('LOGIN STATION ID', StationId);

  const [startDate, setStartDate] = useState(null); // Initially null, no date selected
  const [endDate, setEndDate] = useState(null); // Initially null, no date selected
  const [isStartDatePickerVisible, setStartDatePickerVisibility] = useState(false);
  const [isEndDatePickerVisible, setEndDatePickerVisibility] = useState(false);
  const [progress, setProgress] = useState(false); // Track loading state

  const showStartDatePicker = () => {
    setStartDatePickerVisibility(true);
  };

  const hideStartDatePicker = () => {
    setStartDatePickerVisibility(false);
  };

  const handleStartDateConfirm = (date) => {
    setStartDate(date); 
    hideStartDatePicker();
  };

  const showEndDatePicker = () => {
    setEndDatePickerVisibility(true);
  };

  const hideEndDatePicker = () => {
    setEndDatePickerVisibility(false);
  };

  const handleEndDateConfirm = (date) => {
    setEndDate(date); 
    hideEndDatePicker();
  };

  const generateReport = () => {
   
    if (!startDate || !endDate) {
      Alert.alert('Error', 'Please select both start and end dates.');
      return;
    }

    setProgress(true); 
    
    
    fetchLoanStatusReport(EmployeeId, StationId, startDate, endDate, setProgress)
      .then(response => {
        console.log('Report generated successfully:', response);
        setProgress(false); 
        navigation.navigate('LoanStatusDetails', { reportData: response });
      })
      .catch(error => {
        console.error('Failed to generate report:', error);
        setProgress(false); 
       
      });
  };

  return (
    <SafeAreaView style={styles.container}>
    
      <View style={styles.header}>
        <HeaderwithoutDialoge Theme={Colors} back={true} />
        <TextView
          type="mini_heading22"
          style={styles.headerText}
          text={`Generate ${loanLabel} Status Report`}
        />
      </View>

      <View style={styles.formContainer}>
        <Text style={styles.label}>Start Date:</Text>
        <Pressable
          style={styles.datePicker}
          onPress={showStartDatePicker}
        >
          <Text style={styles.dateText}>
            {startDate ? moment(startDate).format('MMM Do YYYY') : 'Select Start Date'}
          </Text>
          <MaterialCommunityIcons
            name="calendar"
            color="#00796b"
            size={20}
          />
        </Pressable>

        <Text style={styles.label}>End Date:</Text>
        <Pressable
          style={styles.datePicker}
          onPress={showEndDatePicker}
        >
          <Text style={styles.dateText}>
            {endDate ? moment(endDate).format('MMM Do YYYY') : 'Select End Date'}
          </Text>
          <MaterialCommunityIcons
            name="calendar"
            color="#00796b"
            size={20}
          />
        </Pressable>
      </View>

      <View style={styles.buttonContainer}>
        <Button
          mode="contained"
          onPress={generateReport} // Passing selected dates and IDs
          style={[styles.button, { backgroundColor: Colors.primary }]} 
          labelStyle={styles.buttonText}
        >
          Generate Report
        </Button>
      </View>

      {/* Show loader if progress is true */}
      {progress && (
        <ActivityIndicator size="large" color={Colors.primary} style={styles.loader} />
      )}

      {/* Date Pickers */}
      <DateTimePickerModal
        isVisible={isStartDatePickerVisible}
        mode="date"
        onConfirm={handleStartDateConfirm}
        onCancel={hideStartDatePicker}
      />
      <DateTimePickerModal
        isVisible={isEndDatePickerVisible}
        mode="date"
        onConfirm={handleEndDateConfirm}
        onCancel={hideEndDatePicker}
      />
    </SafeAreaView>
  );
};

const { height, width } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  formContainer: {
    marginTop: 30,
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
  },
  datePicker: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderColor: '#cdcdcd',
    paddingVertical: 10,
    alignItems: 'center',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    color: Colors.primary,
  },
  headerText: {
    paddingHorizontal: 30,
    marginTop: 55,
    fontSize: 15,
    color: Colors.primary,
  },
  dateText: {
    flex: 1,
    fontSize: 14,
    color: '#1d1d1d',
    marginLeft: 10,
  },
  buttonContainer: {
    alignItems: 'center',
    marginTop: 30, // Adjust space between the form and button
  },
  button: {
    width: '80%', // Adjust button width to fit form design
    paddingVertical: 12,
    borderRadius: 30,
    justifyContent: 'center',
  },
  buttonText: {
    fontSize: 16,
    color: 'white',
  },
  loader: {
    marginTop: 20,
  },
});

export default LoanStatusReport;
