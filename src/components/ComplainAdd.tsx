import React, {useEffect, useState} from 'react';
import {
  SafeAreaView,
  View,
  StyleSheet,
  Dimensions,
  ScrollView,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import {AppStatusBar, HeaderwithoutDialoge, TextView, DateSelector} from '.';
import {GlobalStyles, Colors} from '../theme';
import {CustomButton} from '.';
import ClientDueDateComponent from './ClientDueDateComponent';
import DetailReportPicker from './DetailReportPicker';
import {FONTS} from '../theme/Fonts';
import ModalListComponent from './ModalListComponent';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {connect, useSelector} from 'react-redux';
import {CustomDropdown, FormInputs, CustomProgressDialoge} from '../components';
import {Complains_status} from '../utilis/RequiredArrays';
import {
  getUserComplain,
  ComplainMis,
  getComplainDesignation,
  EditComplain,
} from '../apis_auth/apis';
const {height, width} = Dimensions.get('window');
import Toast from './Toast';
import {useNavigation} from '@react-navigation/native';
import {Priority} from '../utilis/RequiredArrays';
import {useRoute} from '@react-navigation/native';
export default function ComplainAdd() {
  const [title, setTitle] = React.useState('Saving Complaint');
  const getUserData = useSelector(state => state.UserData);
  const [name, setName] = useState(getUserData.UserData.FirstName);
  const [EmployeeId, setEmployeeId] = useState(getUserData.UserData.EmployeeId);
  console.log('LOGIN EMOPLOYEE', EmployeeId);
  const [status, setstatus] = React.useState('Select Status');
  const [CompTypes, setCompTypes] = React.useState(null);
  const [selectedCompTypes, setSelectedCompTypes] = React.useState([]);
  const [prio, setprio] = React.useState('Select Types');
  const [compDesignation, setCompDesignation] = React.useState(null);
  console.log('COMPDESIGNTSION', compDesignation);
  const [Complain, setComplain] = React.useState(Complains_status);
  const [allComplainTypes, setAllComplainTypes] = React.useState([]);
  const [Description, setDescription] = useState('');
  const [toast, setToast] = React.useState({value: '', type: ''});
  const [editable, setEditable] = React.useState(false);
  const [priority, setpriority] = React.useState(Priority);
  const [progress, setProgresss] = useState(false);
  const navigation = useNavigation();
  const [data, setData] = useState([]);
  const [selectedValue, setSelectedValue] = useState(null);
  const [complainDesignationData, setComplainDesignationData] = React.useState(
    [],
  );
  const route = useRoute();
  const [selectedComplainDesignation, setSelectedComplainDesignation] =
    useState(null);
  const [complainViewDesignationData, setComplainViewDesignationData] =
    useState([]);
  const [selectedData, setSelectedData] = useState(null);
  const complainData = route?.params?.complainData;
  useEffect(() => {
    if (route.params && route.params.editMode && complainData) {
      setprio(complainData.ComplainPriority);
      setDescription(complainData.ComplainDescription);
      const selectedDesignation = complainViewDesignationData.find(
        item => item.id === complainData.ComDesignation,
      );
      setCompDesignation(selectedDesignation);
    }
  }, [route.params, complainData, complainViewDesignationData]);

  useEffect(() => {
    if (!CompTypes) {
      getUserComplain().then(response => {
        const setComplainTypes = response.message.map(item => ({
          name: item.EmployeeComplainType,
          ComplainTypesId: item.EmployeeComplainTypeId,
        }));
        if (complainData && route.params.editMode) {
          const result = setComplainTypes.find(
            item => item.name == complainData.EmployeeComplainType,
          );
          setSelectedCompTypes(result);
        }
      });
    }
  }, [CompTypes, complainData, route.params]);
  useEffect(() => {
    getUserComplain().then(response => {
      const setComplainTypes = response.message.map(item => ({
        name: item.EmployeeComplainType,
        ComplainTypesId: item.EmployeeComplainTypeId,
      }));
      setCompTypes(setComplainTypes);
    });
  }, []);
  useEffect(() => {
    getComplainDesignation()
      .then(data => {
        setComplainViewDesignationData(data);
      })
      .catch(error => {
        console.error('Error fetching complain designations:', error.message);
      });
  }, []);

  useEffect(() => {
    if (!compDesignation) {
      getComplainDesignation()
        .then(data => {
          setComplainDesignationData(data);
          if (complainData && route.params.editMode) {
            const selectedIndex = data.findIndex(
              item => item.id === complainData.ComDesignation,
            );
            setCompDesignation(
              selectedIndex !== -1 ? data[selectedIndex] : null,
            );
          }
        })
        .catch(error => {
          console.error('Error fetching complain designation:', error.message);
        });
    }
  }, [compDesignation, complainData, route.params]);

  const handlePress = () => {
    const isITOfficer = complainDesignationData.some(
      item => item.id === EmployeeId,
    );
    if (isITOfficer) {
      setToast({value: "IT Officers can't submit complains", type: 'error'});
      return;
    }
    if (!CompTypes || !prio || !compDesignation || !Description) {
      console.error('All fields are required');
      return;
    }
    setProgresss(true);
    ComplainMis(
      selectedCompTypes.ComplainTypesId,
      'Open',
      prio,
      name,
      Description,
      EmployeeId,
      setProgresss,
      compDesignation.id,
    )
      .then(res => {
        console.log('API RESPONSE', res);
        if (res.statusCode == 200) {
          setTitle('Complain Saved');
          setToast({value: res.message, type: 'success'});
        } else {
          setTitle('Error');
          setToast({value: 'Error saving complain', type: 'error'});
          console.error('Error saving complain:', res.message);
        }
      })
      .catch(error => {
        setTitle('Error');
        setToast({value: 'Error saving complain', type: 'error'});
        console.error('Error submitting complain:', error);
      })
      .finally(() => {
        setProgresss(false);
      });
  };
  const handleEditComplain = () => {
    EditComplain(
      selectedCompTypes.ComplainTypesId,
      'Open',
      prio,
      name,
      Description,
      EmployeeId,
      setProgresss,
      compDesignation.id,
      complainData.ComplainId,
    )
      .then(res => {
        console.log('API RESPONSE', res);
        if (res.statusCode == 200) {
          setTitle('Complaint Saved');
          setToast({value: res.message, type: 'success'});
        } else {
          setTitle('Error');
          setToast({value: 'Error saving complaint', type: 'error'});
          console.error('Error saving complaint:', res.message);
        }
      })
      .catch(error => {
        setTitle('Error');
        setToast({value: 'Error saving complaint', type: 'error'});
        console.error('Error submitting complaint:', error);
      })
      .finally(() => {
        setProgresss(false);
      });
  };

  return (
    <SafeAreaView style={{flex: 1, padding: 17, backgroundColor: '#fff'}}>
      {route.params && route.params.editMode && (
        <>
          <AppStatusBar />
          <View style={styles.headerContainer}>
            <HeaderwithoutDialoge
              Theme={Colors}
              back={true}></HeaderwithoutDialoge>
          </View>
          <View style={styles.EditHeading}>
            <View style={styles.editHeadingTextContainer}>
              <MaterialCommunityIcons
                name="pencil"
                color={Colors.primary}
                size={22}
                style={styles.pencilIcon}
              />
              <TextView
                type={'headingMid'}
                style={styles.editHeadingText}
                text="Edit Complain"></TextView>
            </View>
          </View>
        </>
      )}
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
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={styles.row2}>
            <FormInputs
              value={'Open'}
              text={'Complain Added By'}
              value={name}
              editable={false}></FormInputs>

            <FormInputs
              style={{position: 'relative', left: 5}}
              value={'Open'}
              text={'Status'}
              editable={false}></FormInputs>
          </View>
          <View style={styles.row2}>
            <CustomDropdown
              text={'Complain Type'}
              tempdata={CompTypes}
              label={selectedCompTypes?.name || 'Select Type'}
              type={2}
              onSelect={value => setSelectedCompTypes(value)}
            />
            <CustomDropdown
              text={'Priority'}
              tempdata={priority}
              label={prio || 'Select Type'}
              onSelect={value => setprio(value)}
            />
          </View>
          <View style={styles.row2}>
            <CustomDropdown
              text={'Complain Designation'}
              tempdata={complainDesignationData}
              label={compDesignation?.name || 'Select Type'}
              type={2}
              onSelect={value => setCompDesignation(value)}
            />
          </View>
          <TextView style={styles.textnote} text="Description"></TextView>
          <View style={styles.row}>
            <TextInput
              style={styles.notes}
              value={Description}
              multiline={true}
              onChangeText={setDescription}></TextInput>
          </View>
          <TouchableOpacity
            style={styles.button}
            onPress={() => {
              route.params && route.params.editMode
                ? handleEditComplain()
                : handlePress();
            }}
            disabled={progress}>
            <TextView
              style={{color: '#FFF', alignSelf: 'center'}}
              text={
                route.params && route.params.editMode
                  ? 'Edit Complain'
                  : 'Submit'
              }
            />
          </TouchableOpacity>
        </ScrollView>
      </View>
      <CustomProgressDialoge
        dialogVisible={progress}
        setDialogVisible={setProgresss}
        title={title}
      />
      <Toast
        type={toast.type}
        message={toast.value}
        onDismiss={() => setToast({value: '', type: ''})}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  headerContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    zIndex: 1,
  },
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
  formContainer: {
    backgroundColor: '#fff',
    elevation: 10,
    padding: 20,
    marginTop: 30,
    borderRadius: 10,
  },
  inputContainer: {
    marginTop: 13,
  },
  textViewStyle: {
    fontSize: 12,
    marginLeft: 10,
    fontFamily: FONTS.FONT_REGULAR,
  },
  textContainer: {
    padding: 10,
    borderWidth: 1,
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
  row2: {
    marginTop: 0,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingBottom: 20,
  },
  row3: {},
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
  textnote: {
    color: '#7d7d7d',
    fontSize: 12,
    marginTop: 10,
    marginLeft: 20,
  },
  button: {
    backgroundColor: Colors.parrotGreenColor,
    width: width / 2.5,
    height: 60,
    justifyContent: 'center',
    borderRadius: 10,
    elevation: 10,
    alignSelf: 'center',
    marginTop: 5,
  },
});
