import React, { useEffect, useState } from 'react';
import { SafeAreaView, View, StyleSheet, ScrollView, TextInput, TouchableOpacity, Modal, Pressable, Dimensions, Alert } from 'react-native';
import { TextView, CustomDropdown, FormInputs } from '.'; // Adjust the import path
import { Complains_status, ComplaintBy, ComplaintTo, Officers } from '../utilis/RequiredArrays';
import { Calendar } from 'react-native-calendars';
import { Text } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {FONTS} from '../theme/Fonts';
import {GlobalStyles, Colors} from '../theme';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import { useSelector } from 'react-redux';
import { getEmployeeComplain } from '../apis_auth/apis';
import Dropdown from './Dropdown';
import axios from 'axios';
const {height, width} = Dimensions.get('window');
const HrmsComplainAdd = ({ onSubmit }) => {
  const getUserData = useSelector(state => state.UserData);
  const [name, setName] = useState(getUserData.UserData.FirstName);
  const [EmployeeId, setEmployeeId] = useState(getUserData?.UserData?.HrId);
  const [HRId, setHRId] = useState(getUserData?.UserData?.HrId);
  console.log('LOGIN EMOPLOYEE', EmployeeId);
  
  const [complainId, setComplainId] = useState('');
  const [complaintBy, setComplaintBy] =  useState(getUserData.UserData.EmployeeId);
  const [complaintTitle, setComplaintTitle] = useState('');
  const [complaintDate, setComplaintDate] = useState('');
  const [showCalendar, setShowCalendar] = useState(false);

  const [complaintTo, setComplaintTo] = useState([]);
 
  const [status, setStatus] = useState('');
  const [description, setDescription] = useState('');
 
  const [notes, setNotes] = useState('');
  const [complainAddedBy, setComplainAddedBy] = useState(name);
  const [start_date, setSelectedDate] = useState(null); // Hold the selected date
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);

  const [end_date, setSelectedEndDate] = useState(null); // Hold the selected date
  const [isDatePickerVisibleend, setDatePickerVisibilityEnd] = useState(false);
  const [currentDate, setCurrentDate] = useState('');
  const [officers, setOfficers] = useState([]);
  const [complaintAgainst, setComplaintAgainst] = useState([]);
  const showDatePicker = () => {
    setDatePickerVisibility(true);
  };

  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };

  

  // end_date code
  const showDatePickerend = () => {
    setDatePickerVisibilityEnd(true);
  };

  const hideDatePickerend = () => {
    setDatePickerVisibilityEnd(false);
  };

  const handleConfirmEnd = date => {
    setSelectedEndDate(date); // Update selected date
    hideDatePicker();
  };

  const handleConfirm = date => {
    setSelectedDate(date); // Update selected date
    setComplaintDate(date.toISOString().split('T')[0]); // Update complaintDate with selected date
    hideDatePicker();
  };

  const handleSubmit = async () => {
    const newComplaint = {
      ComplaintBy: complaintBy,
      Title: complaintTitle,
      ComplaintDate: complaintDate,
      ComplaintTo: complaintTo,
      Description: description,
      Status: status,
      Notes: notes,
      ComplaintAddedOn: new Date().toISOString().split('T')[0], // Current date in YYYY-MM-DD format
      ComplainAddedBy: complainAddedBy,
      HRId:HRId,
    };

    console.log('Submitting complaint:', newComplaint);

    const data = new FormData();
    data.append('action', 'AddStaffComplain');
    data.append('data', JSON.stringify(newComplaint));

    try {
      const response = await axios({
        method: 'post',
        url: 'http://hr.safcomicrofinance.com.pk/hr/employees/staff_complains_api.php',
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        data: data,
      });

      console.log('Success:', response.data);
      resetForm();
    } catch (error) {
      console.error('Error:', error);
      Alert.alert('Error', 'Failed to submit complaint');
    }
  };

  const resetForm = () => {
    setComplaintBy(name);
    setComplaintTitle('');
    setComplaintDate('');
    setComplaintTo([]);
    setStatus('');
    setDescription('');
    setNotes('');
    setComplainAddedBy(name);
    setSelectedDate(null); // Reset date picker
  };

  return (
    
    <SafeAreaView style={{flex: 1,  backgroundColor: '#fff'}}>
      
          
      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        <View style={styles.formContainer}>
        <View style={styles.logoContainer}>
          <View style={styles.logoContainerSecondLayer}>
            <MaterialCommunityIcons
              name="clipboard-text-outline"
              color="#fff"
              size={50}
            />
          </View>
          </View>

          <TextView style={styles.textnote} text="Complain Id"></TextView>
          <TextView
            style={styles.input}
            text={'(Automatically Assigned)'}
           
          />
           
           <View style={styles.row2}>
           <FormInputs
              value={'Open'}
              text={'Complain By *'}
              value={name}
              editable={false}  style={styles.dropdown}></FormInputs>

           {/* <CustomDropdown
            text={'Complaint by'}
            tempdata={ComplaintBy}
            label={complainBy.join(', ') || 'Select Officers'}
            onSelect={value => setComplainBy([...complainBy, value])}
            style={styles.dropdown}
          /> */}

<Pressable onPressIn={showDatePicker}>
              <View style={[GlobalStyles.row, styles.inputdesign]}>
                <TextView
                  style={{ color: '#727272', marginLeft: 10 }}
                  type={'normalMini'}
                  text={complaintDate || 'Select Date *'}
                />
                <MaterialCommunityIcons name="calendar" color={'#245e46'} size={26} />
              </View>
            </Pressable>
            <DateTimePickerModal
              isVisible={isDatePickerVisible}
              mode="date"
              onConfirm={handleConfirm}
              onCancel={hideDatePicker}
            />
          </View>

          <TextView style={styles.textnote} text="Complain Title *"></TextView>
          <TextInput
            style={styles.input}
            value={complaintTitle}
            onChangeText={setComplaintTitle}
            placeholder="Complain Title"
          />
           <TextView style={styles.textnote} text="Complain Against *"></TextView>
     <Dropdown

  value={complaintTo}
  onSelect={value => setComplaintTo(value)}
  style={styles.dropdown}
/>
          <View style={styles.row2}>
         
          
          <CustomDropdown
            text="Status *"
            tempdata={Complains_status}
            label={status || 'Select Status'}
            onSelect={value => setStatus(value)}
            style={styles.dropdown}
          />
           </View>
          
       
          <TextView style={styles.textnote} text="Description *"></TextView>
         <TextInput
            style={styles.notes}
            value={description}
            multiline={true}
            onChangeText={setDescription}
            placeholder="Description"
           
          />
          <TextView style={styles.textnote} text="Extra Information"></TextView>
          <TextInput
            style={styles.notes}
            value={notes}
            multiline={true}
            onChangeText={setNotes}
            placeholder="Extra Information"
           
          />

<View style={styles.textContainer}>
    <TextView style={styles.textnote} text={'Complain Added By'} />
    <TextView style={styles.input} text={name} />
  </View>

<TextView style={styles.textnote} text="Complain Added On"></TextView>
          <TextView
            style={styles.input}
            text={complaintDate || 'Select Date'} // Display selected complaint date
          />
          <TouchableOpacity style={styles.button} onPress={handleSubmit}>
            <TextView style={styles.buttonText} text="Submit" />
          </TouchableOpacity>
        </View>
        
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  EditHeading: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    backgroundColor: '#fff',
    marginTop: 50,
  },
  editHeadingTextContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  editHeadingText: {
    fontSize: 20,
    marginRight: 10,
    color: Colors.primary,
    fontFamily: FONTS.FONT_BOLD,
  },
  pencilIcon: {
    padding: 5,
  },
  logoContainer: {
    alignItems: 'center',
  },
  logoContainerSecondLayer: {
    backgroundColor: Colors.parrotGreenColor,
    elevation: 10,
    width: 80,
    height: 80,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 50,
    marginTop: '-19%',
  },
  inputdesign: {
    justifyContent: 'space-between',
   
    backgroundColor: '#f1f1f1',
    height: 52,
    width:160,
    marginVertical: 10,
   marginTop:30,
   marginLeft:5
   
    
    
    
  },
  textnote: {
    color: '#7d7d7d',
    fontSize: 12,
marginTop:10,
    marginLeft: 20,
  },
  container: {
    flex: 1,
    backgroundColor: '#f0f4f8',
  },
  scrollViewContent: {
    padding: 20,
  },
  formContainer: {
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 15,
    marginTop: 25,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 5,
  },
  input: {
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#d1d9e6',
    marginBottom: 15,
    padding: 12,
    backgroundColor: '#ffffff',
    marginTop:10,
    fontSize:15,
  },
  notes: {
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#cdcdcd',
    marginBottom: 30,
    textAlignVertical: 'top',
    marginTop: 10,
    height: 100,
    padding: 10,
    width: width / 1.3,
  },
  
  dropdown: {
    marginVertical: 10,
   
  },
  calendarContainer: {
    marginBottom: 15,
  },
  calendarToggle: {
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#d1d9e6',
    backgroundColor: '#ffffff',
    marginBottom: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  calendarText: {
    color: '#333',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  calendarWrapper: {
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  closeButton: {
    marginTop: 20,
    padding: 10,
    borderRadius: 12,
    backgroundColor: '#6c757d',
  },
  closeButtonText: {
    color: '#ffffff',
    fontWeight: 'bold',
  },
  row2: {
    marginTop: 0,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    
    
  },
  button: {
    backgroundColor: Colors.parrotGreenColor,
    height: 50,
    justifyContent: 'center',
    borderRadius: 12,
    elevation: 3,
    alignSelf: 'center',
    marginTop: 15,
    paddingHorizontal: 30,
  },
  buttonText: {
    color: '#ffffff',
    fontWeight: 'bold',
  },
});

export default HrmsComplainAdd;
