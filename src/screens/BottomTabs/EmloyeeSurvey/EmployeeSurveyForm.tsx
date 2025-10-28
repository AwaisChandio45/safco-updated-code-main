import React,{useEffect, useState} from 'react';
import {
  Text, 
  View , 
  SafeAreaView, 
  StyleSheet, 
  ScrollView, 
  Alert,
  Pressable
} from 'react-native';
import { FormInputs, DateSelector } from '../../../components';
import { EmployeeSurveys } from '../../../utilis/EmployeeSurveys';
import {AppStatusBar, Header, TextView} from '../../../components';
import {Colors, GlobalStyles} from '../../../theme';
import RadioButton from '../../../components/RadioButton';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {connect, useSelector} from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {insertEmployeeSurveyData, updateEmployeeSurveyForm} from '../../../sqlite/sqlitedb';
 import { GettingDataforEmployeesurvey,UploadDataforEmployeesurvey } from '../../../apis_auth/apis';
import { ProgressDialog } from 'react-native-simple-dialogs';
import Toast from '../../../components/Toast';
import FormInputsAnswer from '../../../components/FormInputsAnswer';
import DateTimePickerModal from "react-native-modal-datetime-picker";
import axios from 'axios';

const EmployeeSurveyForm = ({route, navigation})=>{
  const getUserData = useSelector(state => state.UserData);
  const [EmployeeId, setEmployeeId] = useState(getUserData?.UserData?.HrId);
  const [HRId, setHRId] = useState(getUserData?.UserData?.HrId);
  const [StationId, setStationId] = useState(getUserData?.UserData?.StationId);
  console.log("stationid",getUserData?.UserData?.StationId);
  const [name, setName] = useState(getUserData.UserData.FirstName);
  const [Designation, setDesignation] = useState(getUserData.UserData.Designation);
  
  //  console.log('LOGIN EMOPLOYEE', getUserData.UserData);
  
  const [haveData, setHaveData] = useState(null);
  const surveyData = useSelector((state) => state.SurveyDatas);
  const array_index = 0;
  const[progress,setProgress]=useState(false);
  const [UserId, setUserId] = React.useState(undefined);
  const [allDataobj, setAlldataobj] = React.useState();
  const [dialogeTitle, setDialogeTitle] = React.useState("Fetching user data!");
  const [alertMessage, setAlertMessage] = useState('');
  const [toast, setToast] = React.useState({ value: "", type: "" });
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [tenureDates, setTenureDates] = useState({ startDate: null, endDate: null });
  const [selectedDate, setSelectedDate] = useState(null); // Store selected date
  const showDatePicker = () => {
    setDatePickerVisibility(true);
  };

  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };
  const formatDate = (date) => {
    const day = (`0${date.getDate()}`).slice(-2); // Pad day with 0 if necessary
    const month = (`0${date.getMonth() + 1}`).slice(-2); // Pad month with 0 (month is 0-based, so +1)
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  };
  const handleConfirm = (date) => {
    
    const formattedDate = date.toISOString().split('T')[0]; // Format date as needed
    let get = allDataobj;
    get.employeeInfo[array_index].employeeDateOfSurvey.value = formattedDate;
    get.employeeInfo[array_index].employeeDateOfSurvey.error = false;

    setAlldataobj({ ...get });
    setSelectedDate(date); // Store the selected date
    hideDatePicker(); // Hide the date picker


    if (tenureDates.startDate && tenureDates.endDate) {
      // Extract date parts (year, month, day) from startDate and endDate
      const startDate = new Date(tenureDates.startDate).toISOString().split('T')[0];
      const endDate = new Date(tenureDates.endDate).toISOString().split('T')[0];
    
      // Extract date parts from the selected date
      const selectedDate = new Date(date).toISOString().split('T')[0];
    
      // Check if the selected date is within the range including startDate and endDate
      if (selectedDate >= startDate && selectedDate <= endDate) {
        // Valid date, no alert shown
        console.log('Valid date selected:', selectedDate);
        // Proceed with form submission or other logic here
      } else {
        // If the selected date is outside the range, show an alert
        Alert.alert(
          'Invalid Date',
          `You cannot fill the form. Please select a date between ${startDate} and ${endDate}.`,
          [{ text: 'OK' }]
        );
      }
    } else {
      Alert.alert('Error', 'Tenure dates are not available.');
    }
   
  };

  
  React.useEffect(() => {
    let{item}=route.params;
    setHaveData(item)

    if(item){
      var parse=JSON.parse(item.survey_form)
      setAlldataobj({employeeInfo:[...parse]})
    }else{
      setAlldataobj({...surveyData.SurveyDatas})
    }
  }, []);

  
  React.useEffect(async () => {
    let get = await AsyncStorage.getItem('@userData');
    let parser = JSON.parse(get);
    setUserId(parser.HRId);
  }, [])
  useEffect(() => {
    setAlldataobj(prevState => {
      const updatedState = { ...prevState };
      updatedState.employeeInfo[array_index].employeeName.value = name;
      updatedState.employeeInfo[array_index].employeeDesignation.value = Designation;
      return updatedState;
    });
  }, [name, Designation]);



  const checkDate = () => {
    axios.get('http://hr.safcomicrofinance.com.pk/hr/employee_survey/survey_tenure.php')
      .then(response => {
        const responseData = response.data;

        if (responseData.Tenure_Date) {
          const { startDate, endDate } = responseData.Tenure_Date;

          // Convert startDate and endDate to Date objects
          const parsedStartDate = new Date(startDate);
          const parsedEndDate = new Date(endDate);

          // Store the tenure dates in state
          setTenureDates({
            startDate: parsedStartDate,
            endDate: parsedEndDate
          });

        } else {
          Alert.alert('Error', 'No tenure date data found.');
        }
      })
      .catch(error => {
        console.error('Error:', error);
        Alert.alert('Error', 'Failed to fetch survey tenure dates.');
      });
  };

  // Fetch tenure dates when component mounts
  useEffect(() => {
    checkDate(); // Fetch the tenure dates from the backend
  }, []);

// *******************************************************
// Handle Save Complete Survey
// ***************************************************
const checkContactInfo = () => {
  const userData = allDataobj.employeeInfo[array_index];
  console.log('amraaat =====>',JSON.stringify(userData));
  
  // Proceed with form submission
  const surveyForm = JSON.stringify(allDataobj.employeeInfo);
  if (haveData != null) {
    // Update existing survey data
    updateEmployeeSurveyForm(name, surveyForm, HRId)
      .then((value) => {
        alert(value); // Alert success message
        navigation.goBack(); // Navigate back on success
      })
      .catch((error) => {
        alert(error); // Alert error message
      });
  } else {
    // Insert new survey data
    insertEmployeeSurveyData(HRId, userData.employeeDesignation.value, name, surveyForm)
      .then(() => {
        navigation.goBack(); // Navigate back on success
      })
      .catch((error) => {
        alert(error); // Alert error message
      });
  }
};

  
  // Radio Button Methods start
  //section A start
  const PartOfSafco = (item,index) => {    
    let arr=allDataobj;
    let temp=[];
    arr.employeeInfo[0].safcoMicrofinancePart.options.map((isLikedItem)=>{
      isLikedItem.id==item.id
      ?
      temp.push({...isLikedItem, selected: true,})
      :
      temp.push({...isLikedItem, selected: false,})
    })

    let safcoMicrofinancePart = arr.employeeInfo[0]['safcoMicrofinancePart']['options'] = temp;
    safcoMicrofinancePart = arr.employeeInfo[0]['safcoMicrofinancePart']['value'] = index;
     setAlldataobj({...allDataobj, safcoMicrofinancePart});
  };
  const TopManagementpays = (item,index) => {    
    let arr=allDataobj;
    let temp=[];
    arr.employeeInfo[0].TopManagementpays.options.map((isLikedItem)=>{
      isLikedItem.id==item.id
      ?
      temp.push({...isLikedItem, selected: true,})
      :
      temp.push({...isLikedItem, selected: false,})
    })

    let Managementpays = arr.employeeInfo[0]['TopManagementpays']['options'] = temp;
    Managementpays = arr.employeeInfo[0]['TopManagementpays']['value'] = index;
     setAlldataobj({...allDataobj, TopManagementpays});
  };
  
  //Radio Button Section B Start
  const AboutWork = (item,index) => {    
    let arr=allDataobj;
    let temp=[];
    arr.employeeInfo[0].AboutWork.options.map((isLikedItem)=>{
      isLikedItem.id==item.id
      ?
      temp.push({...isLikedItem, selected: true,})
      :
      temp.push({...isLikedItem, selected: false,})
    })

    let AboutWork = arr.employeeInfo[0]['AboutWork']['options'] = temp;
    AboutWork = arr.employeeInfo[0]['AboutWork']['value'] = index;
     setAlldataobj({...allDataobj, AboutWork});
  };
  const  satisfiedJob = (item,index) => {    
    let arr=allDataobj;
    let temp=[];
    arr.employeeInfo[0].satisfiedJob.options.map((isLikedItem)=>{
      isLikedItem.id==item.id
      ?
      temp.push({...isLikedItem, selected: true,})
      :
      temp.push({...isLikedItem, selected: false,})
    })

    let  satisfiedJob = arr.employeeInfo[0]['satisfiedJob']['options'] = temp;
    satisfiedJob = arr.employeeInfo[0]['satisfiedJob']['value'] = index;
     setAlldataobj({...allDataobj,  satisfiedJob});
  };
  const presentJob = (item,index) => {    
    let arr=allDataobj;
    let temp=[];
    arr.employeeInfo[0].presentJob.options.map((isLikedItem)=>{
      isLikedItem.id==item.id
      ?
      temp.push({...isLikedItem, selected: true,})
      :
      temp.push({...isLikedItem, selected: false,})
    })

    let presentJob = arr.employeeInfo[0]['presentJob']['options'] = temp;
    presentJob = arr.employeeInfo[0]['presentJob']['value'] = index;
     setAlldataobj({...allDataobj, presentJob});
  };
  
  const challengingJob  = (item,index) => {    
    let arr=allDataobj;
    let temp=[];
    arr.employeeInfo[0].challengingJob.options.map((isLikedItem)=>{
      isLikedItem.id==item.id
      ?
      temp.push({...isLikedItem, selected: true,})
      :
      temp.push({...isLikedItem, selected: false,})
    })

    let challengingJob = arr.employeeInfo[0]['challengingJob']['options'] = temp;
    challengingJob = arr.employeeInfo[0]['challengingJob']['value'] = index;
     setAlldataobj({...allDataobj, challengingJob});
  };
//Radio Button Section C Start
const satisfiedOpportunities  = (item,index) => {    
  let arr=allDataobj;
  let temp=[];
  arr.employeeInfo[0].satisfiedOpportunities.options.map((isLikedItem)=>{
    isLikedItem.id==item.id
    ?
    temp.push({...isLikedItem, selected: true,})
    :
    temp.push({...isLikedItem, selected: false,})
  })

  let satisfiedOpportunities = arr.employeeInfo[0]['satisfiedOpportunities']['options'] = temp;
  satisfiedOpportunities = arr.employeeInfo[0]['satisfiedOpportunities']['value'] = index;
   setAlldataobj({...allDataobj, satisfiedOpportunities});
};


const   fillVacancies = (item,index) => {    
  let arr=allDataobj;
  let temp=[];
  arr.employeeInfo[0].fillVacancies.options.map((isLikedItem)=>{
    isLikedItem.id==item.id
    ?
    temp.push({...isLikedItem, selected: true,})
    :
    temp.push({...isLikedItem, selected: false,})
  })

  let fillVacancies = arr.employeeInfo[0]['fillVacancies']['options'] = temp;
  fillVacancies = arr.employeeInfo[0]['fillVacancies']['value'] = index;
   setAlldataobj({...allDataobj, fillVacancies});
};



const   Promotion = (item,index) => {    
  let arr=allDataobj;
  let temp=[];
  arr.employeeInfo[0].Promotion.options.map((isLikedItem)=>{
    isLikedItem.id==item.id
    ?
    temp.push({...isLikedItem, selected: true,})
    :
    temp.push({...isLikedItem, selected: false,})
  })

  let Promotion = arr.employeeInfo[0]['Promotion']['options'] = temp;
  Promotion = arr.employeeInfo[0]['Promotion']['value'] = index;
   setAlldataobj({...allDataobj, Promotion});
};


const   developSkills = (item,index) => {    
  let arr=allDataobj;
  let temp=[];
  arr.employeeInfo[0].developSkills.options.map((isLikedItem)=>{
    isLikedItem.id==item.id
    ?
    temp.push({...isLikedItem, selected: true,})
    :
    temp.push({...isLikedItem, selected: false,})
  })

  let  developSkills = arr.employeeInfo[0]['developSkills']['options'] = temp;
  developSkills = arr.employeeInfo[0]['developSkills']['value'] = index;
   setAlldataobj({...allDataobj,  developSkills});
};



const   talkOpenly  = (item,index) => {    
  let arr=allDataobj;
  let temp=[];
  arr.employeeInfo[0].talkOpenly.options.map((isLikedItem)=>{
    isLikedItem.id==item.id
    ?
    temp.push({...isLikedItem, selected: true,})
    :
    temp.push({...isLikedItem, selected: false,})
  })

  let   talkOpenly = arr.employeeInfo[0]['talkOpenly']['options'] = temp;
  talkOpenly = arr.employeeInfo[0]['talkOpenly']['value'] = index;
   setAlldataobj({...allDataobj,   talkOpenly});
};



const   managerPraises   = (item,index) => {    
  let arr=allDataobj;
  let temp=[];
  arr.employeeInfo[0].managerPraises.options.map((isLikedItem)=>{
    isLikedItem.id==item.id
    ?
    temp.push({...isLikedItem, selected: true,})
    :
    temp.push({...isLikedItem, selected: false,})
  })

  let   managerPraises  = arr.employeeInfo[0]['managerPraises']['options'] = temp;
  managerPraises  = arr.employeeInfo[0]['managerPraises']['value'] = index;
   setAlldataobj({...allDataobj,   managerPraises });
};

const   improveMyself   = (item,index) => {    
  let arr=allDataobj;
  let temp=[];
  arr.employeeInfo[0].improveMyself.options.map((isLikedItem)=>{
    isLikedItem.id==item.id
    ?
    temp.push({...isLikedItem, selected: true,})
    :
    temp.push({...isLikedItem, selected: false,})
  })

  let   improveMyself  = arr.employeeInfo[0]['improveMyself']['options'] = temp;
  improveMyself  = arr.employeeInfo[0]['improveMyself']['value'] = index;
   setAlldataobj({...allDataobj,   improveMyself });
};

const   effectiveLeader  = (item,index) => {    
  let arr=allDataobj;
  let temp=[];
  arr.employeeInfo[0].effectiveLeader.options.map((isLikedItem)=>{
    isLikedItem.id==item.id
    ?
    temp.push({...isLikedItem, selected: true,})
    :
    temp.push({...isLikedItem, selected: false,})
  })

  let   effectiveLeader = arr.employeeInfo[0]['effectiveLeader']['options'] = temp;
  effectiveLeader = arr.employeeInfo[0]['effectiveLeader']['value'] = index;
   setAlldataobj({...allDataobj,   effectiveLeader});
};

const   officeMember  = (item,index) => {    
  let arr=allDataobj;
  let temp=[];
  arr.employeeInfo[0]. officeMember.options.map((isLikedItem)=>{
    isLikedItem.id==item.id
    ?
    temp.push({...isLikedItem, selected: true,})
    :
    temp.push({...isLikedItem, selected: false,})
  })

  let    officeMember = arr.employeeInfo[0]['officeMember']['options'] = temp;
  officeMember = arr.employeeInfo[0]['officeMember']['value'] = index;
   setAlldataobj({...allDataobj,    officeMember});
};


const   workPerformance  = (item,index) => {    
  let arr=allDataobj;
  let temp=[];
  arr.employeeInfo[0].workPerformance.options.map((isLikedItem)=>{
    isLikedItem.id==item.id
    ?
    temp.push({...isLikedItem, selected: true,})
    :
    temp.push({...isLikedItem, selected: false,})
  })

  let     workPerformance = arr.employeeInfo[0]['workPerformance']['options'] = temp;
  workPerformance = arr.employeeInfo[0]['workPerformance']['value'] = index;
   setAlldataobj({...allDataobj,  workPerformance});
};


const   linkedPromotions  = (item,index) => {    
  let arr=allDataobj;
  let temp=[];
  arr.employeeInfo[0].linkedPromotions.options.map((isLikedItem)=>{
    isLikedItem.id==item.id
    ?
    temp.push({...isLikedItem, selected: true,})
    :
    temp.push({...isLikedItem, selected: false,})
  })

  let   linkedPromotions = arr.employeeInfo[0]['linkedPromotions']['options'] = temp;
  linkedPromotions = arr.employeeInfo[0]['linkedPromotions']['value'] = index;
   setAlldataobj({...allDataobj,   linkedPromotions});
};



const   lastPerformance  = (item,index) => {    
  let arr=allDataobj;
  let temp=[];
  arr.employeeInfo[0].lastPerformance.options.map((isLikedItem)=>{
    isLikedItem.id==item.id
    ?
    temp.push({...isLikedItem, selected: true,})
    :
    temp.push({...isLikedItem, selected: false,})
  })

  let   lastPerformance = arr.employeeInfo[0]['lastPerformance']['options'] = temp;
  lastPerformance = arr.employeeInfo[0]['lastPerformance']['value'] = index;
   setAlldataobj({...allDataobj,   lastPerformance});
};

const   myOffice  = (item,index) => {    
  let arr=allDataobj;
  let temp=[];
  arr.employeeInfo[0].myOffice.options.map((isLikedItem)=>{
    isLikedItem.id==item.id
    ?
    temp.push({...isLikedItem, selected: true,})
    :
    temp.push({...isLikedItem, selected: false,})
  })

  let   myOffice = arr.employeeInfo[0]['myOffice']['options'] = temp;
  myOffice = arr.employeeInfo[0]['myOffice']['value'] = index;
   setAlldataobj({...allDataobj,   myOffice});
};



const   jobSecure  = (item,index) => {    
  let arr=allDataobj;
  let temp=[];
  arr.employeeInfo[0].jobSecure.options.map((isLikedItem)=>{
    isLikedItem.id==item.id
    ?
    temp.push({...isLikedItem, selected: true,})
    :
    temp.push({...isLikedItem, selected: false,})
  })

  let   jobSecure = arr.employeeInfo[0]['jobSecure']['options'] = temp;
  jobSecure = arr.employeeInfo[0]['jobSecure']['value'] = index;
   setAlldataobj({...allDataobj,   jobSecure});
};


const   reasonableWork  = (item,index) => {    
  let arr=allDataobj;
  let temp=[];
  arr.employeeInfo[0].reasonableWork.options.map((isLikedItem)=>{
    isLikedItem.id==item.id
    ?
    temp.push({...isLikedItem, selected: true,})
    :
    temp.push({...isLikedItem, selected: false,})
  })

  let   reasonableWork = arr.employeeInfo[0]['reasonableWork']['options'] = temp;
  reasonableWork = arr.employeeInfo[0]['reasonableWork']['value'] = index;
   setAlldataobj({...allDataobj,   reasonableWork});
};

const   balanceWork  = (item,index) => {    
  let arr=allDataobj;
  let temp=[];
  arr.employeeInfo[0].balanceWork.options.map((isLikedItem)=>{
    isLikedItem.id==item.id
    ?
    temp.push({...isLikedItem, selected: true,})
    :
    temp.push({...isLikedItem, selected: false,})
  })

  let   balanceWork = arr.employeeInfo[0]['balanceWork']['options'] = temp;
  balanceWork = arr.employeeInfo[0]['balanceWork']['value'] = index;
   setAlldataobj({...allDataobj,   balanceWork});
};



const   satisfiedPay  = (item,index) => {    
  let arr=allDataobj;
  let temp=[];
  arr.employeeInfo[0].satisfiedPay.options.map((isLikedItem)=>{
    isLikedItem.id==item.id
    ?
    temp.push({...isLikedItem, selected: true,})
    :
    temp.push({...isLikedItem, selected: false,})
  })

  let   satisfiedPay = arr.employeeInfo[0]['satisfiedPay']['options'] = temp;
  satisfiedPay = arr.employeeInfo[0]['satisfiedPay']['value'] = index;
   setAlldataobj({...allDataobj,   satisfiedPay});
};

const   employeePrograms  = (item,index) => {    
  let arr=allDataobj;
  let temp=[];
  arr.employeeInfo[0].employeePrograms.options.map((isLikedItem)=>{
    isLikedItem.id==item.id
    ?
    temp.push({...isLikedItem, selected: true,})
    :
    temp.push({...isLikedItem, selected: false,})
  })

  let   employeePrograms = arr.employeeInfo[0]['employeePrograms']['options'] = temp;
  employeePrograms = arr.employeeInfo[0]['employeePrograms']['value'] = index;
   setAlldataobj({...allDataobj,   employeePrograms});
};


const   safcoActivities  = (item,index) => {    
  let arr=allDataobj;
  let temp=[];
  arr.employeeInfo[0].safcoActivities.options.map((isLikedItem)=>{
    isLikedItem.id==item.id
    ?
    temp.push({...isLikedItem, selected: true,})
    :
    temp.push({...isLikedItem, selected: false,})
  })

  let   safcoActivities = arr.employeeInfo[0]['safcoActivities']['options'] = temp;
  safcoActivities = arr.employeeInfo[0]['safcoActivities']['value'] = index;
   setAlldataobj({...allDataobj,   safcoActivities});
};

const   jobRight  = (item,index) => {    
  let arr=allDataobj;
  let temp=[];
  arr.employeeInfo[0].jobRight.options.map((isLikedItem)=>{
    isLikedItem.id==item.id
    ?
    temp.push({...isLikedItem, selected: true,})
    :
    temp.push({...isLikedItem, selected: false,})
  })

  
  
   setAlldataobj({...allDataobj,   jobRight});
};

const    Comfortable = (item,index) => {    
  let arr=allDataobj;
  let temp=[];
  arr.employeeInfo[0].Comfortable.options.map((isLikedItem)=>{
    isLikedItem.id==item.id
    ?
    temp.push({...isLikedItem, selected: true,})
    :
    temp.push({...isLikedItem, selected: false,})
  })

  
  
   setAlldataobj({...allDataobj,   Comfortable});
};

const    Productivity = (item,index) => {    
  let arr=allDataobj;
  let temp=[];
  arr.employeeInfo[0].Productivity.options.map((isLikedItem)=>{
    isLikedItem.id==item.id
    ?
    temp.push({...isLikedItem, selected: true,})
    :
    temp.push({...isLikedItem, selected: false,})
  })

  
  
   setAlldataobj({...allDataobj,   Productivity});
};



const    threeSuggestion = (item,index) => {    
  let arr=allDataobj;
  let temp=[];
  arr.employeeInfo[0].threeSuggestion.options.map((isLikedItem)=>{
    isLikedItem.id==item.id
    ?
    temp.push({...isLikedItem, selected: true,})
    :
    temp.push({...isLikedItem, selected: false,})
  })

  
  
   setAlldataobj({...allDataobj,   threeSuggestion});
};





  
const handleInputChange = (value) => { 
  let get = allDataobj;

  // Directly set the employeeDesignation value
  get.employeeInfo[array_index].employeeDesignation.value = value;
  get.employeeInfo[array_index].employeeDesignation.error = false;
  setAlldataobj({...get});
  
  // Check if value length matches the required length for data retrieval
  
    GettingDataforEmployeesurvey(value, setProgress).then((response) => {
      if (response) {
        if (response[0].Result === 'True') {
          console.log("True--works==>", response);
          let get = allDataobj;
          get.employeeInfo[array_index].HRId.value = response[0].HRId;
          get.employeeInfo[array_index].StationId.value = response[0].StationId;
          get.employeeInfo[array_index].employeeDateOfSurvey.value = response[0].Today;
          get.employeeInfo[array_index].employeeName.value = response[0].employeeName;
          setAlldataobj({...get});
        } else {
          setToast({
            type: "error",
            message: "Sorry! User data not found.",
          });
        }
      } else {
        console.log("else--works==>", response);
      }
      console.log("then--works==>", response);
    }).catch((error) => {
      console.error("Error retrieving data: ", error);
    });
  
}
  

////////Complete Survey ////////////////////////////




// const completeSurvey = () => {
//   const userData = allDataobj.employeeInfo[array_index];
//   console.log('azzaan', JSON.stringify(userData));
//   setDialogeTitle("Submitting Survey Data!");
//   userData.HRId = { value: HRId };
//   console.log('User Data before submission:', userData);
  
//   UploadDataforEmployeesurvey(userData, setProgress)
//     .then((response) => {
//       console.log('API Response:', response);
//       if (response && response.status === "success") {
//         Alert.alert(
//           "Submitted!",
//           `${response.message}`,
//           [{ text: "OK", onPress: () => console.log("OK Pressed") }]
//         );
//         navigation.goBack();
//       } else {
//         Alert.alert(
//           "Error",
//           "Record not inserted",
//           [{ text: "OK", onPress: () => console.log("OK Pressed") }]
//         );
//       }
//     })
//     .catch((error) => {
//       console.log('Error:', error);
//       Alert.alert(
//         "Error",
//         "Record not inserted",
//         [{ text: "OK", onPress: () => console.log("OK Pressed") }]
//       );
//       setToast({
//         type: "error",
//         message: error,
//       });
//     });
// };

const completeSurvey = () => {
  const userData = allDataobj.employeeInfo[array_index];
  
  // Extract values and check for validation
  
  const jobRightAnswer = userData.jobRight.Answer.value.trim();
  const comfortableAnswer = userData.Comfortable.Answer.value.trim();
  const productivityAnswer = userData.Productivity.Answer.value.trim();
  const suggestion1 = userData.threeSuggestion.Answer1.value.trim();
  const suggestion2 = userData.threeSuggestion.Answer2.value.trim();
  const suggestion3 = userData.threeSuggestion.Answer3.value.trim();
  const surveyDate = userData.employeeDateOfSurvey.value.trim();

  

  const selectedSurveyDate = new Date(surveyDate);

  // Check if tenure dates are available (use the tenureDates state set by checkDate)
  if (tenureDates.startDate && tenureDates.endDate) {
    if (selectedSurveyDate < tenureDates.startDate || selectedSurveyDate > tenureDates.endDate) {
      // If the selected date is outside the tenure date range, show an alert
      Alert.alert(
        "Invalid Date",
        `You cannot submit the form. The survey date must be between ${formatDate(tenureDates.startDate)} and ${formatDate(tenureDates.endDate)}.`,
        [{ text: "OK", onPress: () => console.log("OK Pressed") }]
      );
      return; // Exit the function if the date is invalid
    }
  } else {
    // Show alert if tenure dates are not available
    Alert.alert("Error", "Tenure dates are not available. Please try again.");
    return; // Exit if no tenure dates
  }


 


  


  // Perform validation
  if (!jobRightAnswer || !comfortableAnswer || !productivityAnswer || !suggestion1 || !suggestion2 || !suggestion3 || !surveyDate) {
    // Update error states for each field if needed
    const updatedData = { ...userData };
   
    updatedData.jobRight.Answer.error = !jobRightAnswer;
    updatedData.Comfortable.Answer.error = !comfortableAnswer;
    updatedData.Productivity.Answer.error = !productivityAnswer;
    updatedData.threeSuggestion.Answer1.error = !suggestion1;
    updatedData.threeSuggestion.Answer2.error = !suggestion2;
    updatedData.threeSuggestion.Answer3.error = !suggestion3;
    updatedData.employeeDateOfSurvey.error = !surveyDate;
    setAlldataobj({
      ...allDataobj,
      employeeInfo: [
        {
          ...updatedData,
        },
      ],
    });

    Alert.alert(
      "Error",
      "Please fill in all required fields *",
      [{ text: "OK", onPress: () => console.log("OK Pressed") }]
    );
    return; // Exit function if validation fails
  }

  // Set HRId and log user data before submission
  console.log('User Data before submission:', JSON.stringify(userData));
  setDialogeTitle("Submitting Survey Data!");
  userData.HRId = { value: HRId };
  userData.StationId = { value: StationId };

  // Proceed with the API call
  UploadDataforEmployeesurvey(userData, setProgress)
    .then((response) => {
      // console.log('User Data After submission:', JSON.stringify(userData));
      console.log('API Response:', response);
      if (response && response.status === "success") {
        Alert.alert(
          "Submitted!",
          `${response.message}`,
          [{ text: "OK", onPress: () => console.log("OK Pressed") }]
        );
        navigation.goBack();
      } else if (response && response.status === 409) {
        console.log("amrat")
        Alert.alert(
          "Conflict",
          `${response.message}`,
          [{ text: "OK", onPress: () => console.log("OK Pressed") }]
        );
      } else {
        console.log('faaiz',response)
        Alert.alert(
          "Error",
          `${response}`,
          [{ text: "OK", onPress: () => console.log("OK Pressed") }]
        );
      }
    })
    .catch((error) => {
      if(error.response.status === 409  ){
        console.log('azaan')
        Alert.alert(
          "Error",
          `${error.response.data.message}`,
          [{ text: "OK", onPress: () => console.log("OK Pressed") }]
        );
        
        setToast({
          type: "error",
          message: error.message || "An error occurred.",
        });
      }
      
     
    });
  }




//////////////////Complete Survey Form End/////////////

  //Radio Button Methods end 
  const [contactInfo, setHideContact] = React.useState(false);
  const [sectionA, setSectionAhide] = React.useState(false);
  const [sectionB, setSectionBHide] = React.useState(false);
  const [sectionC, setSectionCHide] = React.useState(false);
  const [sectionD, setSectionDHide] = React.useState(false);
  const [sectionE, setSectionEHide] = React.useState(false);
  const [sectionF, setSectionFHide] = React.useState(false);
  const [sectionG, setSectionGHide] = React.useState(false);
  const [sectionH, setSectionHHide] = React.useState(false);
  const [sectionI, setSectionIHide] = React.useState(false);

  return (
      <SafeAreaView style={{flex:1, backgroundColor:'#fff',}}>
        <AppStatusBar></AppStatusBar>
        <View style={GlobalStyles.row}>
        <Header Theme={Colors} back={true} screenNo={5}></Header>
            <TextView
            type={'mini_heading22'}
            style={{paddingHorizontal: 0, marginTop: 55, fontSize:15,marginRight:20}}
            text="Employee Satisfication Survey Form"></TextView>
                          
        </View>
        

        <View style={styles.questionsCont}>
          <ScrollView>
          <Text style={styles.paragraph}>
        Dear all,{'\n\n'}
    We are conducting an Employee satisfaction survey for the year 2022-23 to measure your
    satisfaction level at Safco Microfinance Company Private Limited.
    This survey is aimed at providing us an opportunity to communicate our opinions
    about SSF and the job. We assure you that your responses will be kept in CONFIDENCE.
            </Text>
          <Pressable style={styles.touchableHeadingCont} 
          activeOpacity={0.7} 
          onPress={()=>setHideContact(!contactInfo)}>
            <View style={styles.headerCont}>
              <View style={styles.headingTxtCont}>
              <TextView style={styles.headingTxt} 
              type={'Light'} 
              text="Employee Information">
              </TextView>
              </View>
              <View style={styles.plusBtnCont}>
                    <Text style={styles.plusText}>{contactInfo?
                    <MaterialCommunityIcons
                      name="minus"
                      size={26}
                      color = {Colors.white}
                      >

                    </MaterialCommunityIcons>
                    :
                    <MaterialCommunityIcons
                      name="plus"
                      size={26}
                      color = {Colors.white}
                      >

                    </MaterialCommunityIcons>}
                    </Text>
              </View>
            </View>
          </Pressable>
          
            {/* customer contact information container */}
            {contactInfo &&
            <View style={styles.contactInfoCont}>
              
            <View style= {styles.row2}>


            <FormInputs
        text={'Employee Name'}
        required={false}
        editable={false}
        error={allDataobj.employeeInfo[array_index].employeeName.error}
        value={allDataobj.employeeInfo[array_index].employeeName.value}
        onChangeText={(value) => {
          setName(value);
          setAlldataobj(prevState => {
            const updatedState = { ...prevState };
            updatedState.employeeInfo[array_index].employeeName.value = value;
            updatedState.employeeInfo[array_index].employeeName.error = false;
            return updatedState;
          });
        }}
      ></FormInputs>
      
             <FormInputs
  keyboardtype={'decimal-pad'}
  text={'Employee Designation'}
  editable={false}
 required={false}
  error={allDataobj.employeeInfo[array_index].employeeDesignation.error}
  value={allDataobj.employeeInfo[array_index].employeeDesignation.value || Designation}
  onChangeText={(value) => handleInputChange(value)}></FormInputs>
               
                
                
              </View>
              

               
                <View style= {styles.row2}>
                
                <Pressable onPressIn={showDatePicker}>
                <Text style={styles.textnote}>
      Survey Date <Text style={{ color: 'red' }}>*</Text>
    </Text> 
    <View style={[GlobalStyles.row, styles.inputdesign, allDataobj.employeeInfo[array_index].employeeDateOfSurvey.error ? { borderColor: 'red', borderWidth: 1 } : {}]}>

          <TextView

            style={{ color: '#727272', marginLeft: 10 }}
            
            type={'normalMini'}
            text={allDataobj.employeeInfo[array_index].employeeDateOfSurvey.value || 'Select Date'}
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
            </View>
        }
            <Pressable style={styles.touchableHeadingCont} onPress={()=>setSectionAhide(!sectionA)}>
                <View style={styles.headerCont}>
                  <View style={styles.headingTxtCont}>
                  <TextView style={styles.headingTxt} type={'Light'} text="Section A) About Safco Microfinance Company"></TextView>
                  </View>
                  <View style={styles.plusBtnCont}>
                    <Text style={styles.plusText}>{sectionA?
                    <MaterialCommunityIcons
                      name="minus"
                      size={26}
                      color = {Colors.white}
                      >

                    </MaterialCommunityIcons>
                    :
                    <MaterialCommunityIcons
                      name="plus"
                      size={26}
                      color = {Colors.white}
                      >

                    </MaterialCommunityIcons>}
                    </Text>
                  </View>                 
                </View>
            </Pressable>
                {/* Section A Start */}
                {sectionA &&
                <View style={styles.sectionACont}>
                <View>
                  <View>
                    <Text style={styles.question}>Q. 1. I am proud to tell people that I am the part of Safco Microfinance Company?</Text>
                  </View>
                    <View style={{marginTop:10}}>
                      {allDataobj.employeeInfo[0].safcoMicrofinancePart.options.map((item,index) => (
                        <RadioButton
                        onPress={() => PartOfSafco(item,index)}
                        selected={item.selected}
                        key={item.id}
                      >
                        {item.label}
                      </RadioButton>
                      ))}
                    </View>
                    <FormInputs
                        text={'Comment'}
                        required={false}
                        error={
                          allDataobj.employeeInfo[array_index].safcoMicrofinancePart.comment.error
                        }
                        value={
                          allDataobj.employeeInfo[array_index].safcoMicrofinancePart.comment.value
                        }
                        onChangeText={(value) => {
                          let get = allDataobj;
                          get.employeeInfo[array_index].safcoMicrofinancePart.comment.value =
                            value;
                          get.employeeInfo[array_index].safcoMicrofinancePart.comment.error = false;

                          setAlldataobj({...get});
                        }}></FormInputs>

                   </View>
                  <View style={{marginTop:10}}>
                    <View >
                      <Text style={styles.question}>Q. 2. The top management pays careful attention to employee suggestions? </Text>
                    </View>
                      <View style={{marginTop:10}}>
                        {allDataobj.employeeInfo[0].TopManagementpays.options.map((item,index) => (
                          <RadioButton
                            onPress={() => TopManagementpays(item,index)}
                            selected={item.selected}
                            key={item.id}
                          >
                            {item.label}
                          </RadioButton>
                        ))}
                      </View>
                      <FormInputs
                        text={'Comment'}
                        required={false}
                        error={
                          allDataobj.employeeInfo[array_index].TopManagementpays.comment.error
                        }
                        value={
                          allDataobj.employeeInfo[array_index].TopManagementpays.comment.value
                        }
                        onChangeText={(value) => {
                          let get = allDataobj;
                          get.employeeInfo[array_index].TopManagementpays.comment.value =
                            value;
                          get.employeeInfo[array_index].TopManagementpays.comment.error = false;

                          setAlldataobj({...get});
                        }}></FormInputs>

                    </View>
                    
                    
                    
                    
                    
                    
                </View>
}
                {/* Section B start */}
                <Pressable style={styles.touchableHeadingCont} onPress={()=>setSectionBHide(!sectionB)}>
                <View style={styles.headerCont}>
                  <View style={styles.headingTxtCont}>
                  <TextView style={styles.headingTxt} type={'Light'} text="Section b) About work"></TextView>
                  </View>
                  <View style={styles.plusBtnCont}>
                    <Text style={styles.plusText}>{sectionB?
                    <MaterialCommunityIcons
                      name="minus"
                      size={26}
                      color = {Colors.white}
                      >

                    </MaterialCommunityIcons>
                    :
                    <MaterialCommunityIcons
                      name="plus"
                      size={26}
                      color = {Colors.white}
                      >

                    </MaterialCommunityIcons>}
                    </Text>
                  </View>                  
                </View>
                </Pressable>
                {sectionB &&

                <View style={styles.sectionBCont}>    
                <View>
                      <View>
                        <Text style={styles.question}>
                        Q. 3. I can understand what is expected of(from) me in my work?
                        </Text>
                      </View>
                      <View style={{marginTop:10}}>
                        {allDataobj.employeeInfo[0].AboutWork.options.map((item,index) => (
                          <RadioButton
                          onPress={() => AboutWork(item,index)}
                          selected={item.selected}
                          key={item.id}
                        >
                          {item.label}
                        </RadioButton>
                        ))}
                      </View>
                      <FormInputs
                        text={'Comment'}
                        required={false}
                        error={
                          allDataobj.employeeInfo[array_index].AboutWork.comment.error
                        }
                        value={
                          allDataobj.employeeInfo[array_index].AboutWork.comment.value
                        }
                        onChangeText={(value) => {
                          let get = allDataobj;
                          get.employeeInfo[array_index].AboutWork.comment.value =
                            value;
                          get.employeeInfo[array_index].AboutWork.comment.error = false;

                          setAlldataobj({...get});
                        }}></FormInputs>
                   </View>
                   <View>
                      <View>
                        <Text style={styles.question}>
                        Q. 4. I am satisfied with my job and the kind of work I do?
                        </Text>
                      </View>
                      <View style={{marginTop:10}}>
                        {allDataobj.employeeInfo[0].satisfiedJob.options.map((item,index) => (
                          <RadioButton
                          onPress={() => satisfiedJob(item,index)}
                          selected={item.selected}
                          key={item.id}
                        >
                          {item.label}
                        </RadioButton>
                        ))}
                      </View>
                      <FormInputs
                        text={'Comment'}
                        required={false}
                        error={
                          allDataobj.employeeInfo[array_index].satisfiedJob.comment.error
                        }
                        value={
                          allDataobj.employeeInfo[array_index].satisfiedJob.comment.value
                        }
                        onChangeText={(value) => {
                          let get = allDataobj;
                          get.employeeInfo[array_index].satisfiedJob.comment.value =
                            value;
                          get.employeeInfo[array_index].satisfiedJob.comment.error = false;

                          setAlldataobj({...get});
                        }}></FormInputs>
                   </View>
                   <View>
                      <View>
                        <Text style={styles.question}>
                        Q. 5. My job is challenging and interesting?
                        </Text>
                      </View>
                      <View style={{marginTop:10}}>
                        {allDataobj.employeeInfo[0].challengingJob.options.map((item,index) => (
                          <RadioButton
                          onPress={() => challengingJob(item,index)}
                          selected={item.selected}
                          key={item.id}
                        >
                          {item.label}
                        </RadioButton>
                        ))}
                      </View>
                      <FormInputs
                        text={'Comment'}
                        required={false}
                        error={
                          allDataobj.employeeInfo[array_index].challengingJob.comment.error
                        }
                        value={
                          allDataobj.employeeInfo[array_index].challengingJob.comment.value
                        }
                        onChangeText={(value) => {
                          let get = allDataobj;
                          get.employeeInfo[array_index].challengingJob.comment.value =
                            value;
                          get.employeeInfo[array_index].challengingJob.comment.error = false;

                          setAlldataobj({...get});
                        }}></FormInputs>
                   </View>
                   <View>
                      <View>
                        <Text style={styles.question}>
                        Q. 6. Overall, I am satisfied with my present job?
                        </Text>
                      </View>
                      <View style={{marginTop:10}}>
                        {allDataobj.employeeInfo[0].presentJob.options.map((item,index) => (
                          <RadioButton
                          onPress={() => presentJob(item,index)}
                          selected={item.selected}
                          key={item.id}
                        >
                          {item.label}
                        </RadioButton>
                        ))}
                      </View>
                      <FormInputs
                        text={'Comment'}
                        required={false}
                        error={
                          allDataobj.employeeInfo[array_index].presentJob.comment.error
                        }
                        value={
                          allDataobj.employeeInfo[array_index].presentJob.comment.value
                        }
                        onChangeText={(value) => {
                          let get = allDataobj;
                          get.employeeInfo[array_index].presentJob.comment.value =
                            value;
                          get.employeeInfo[array_index].presentJob.comment.error = false;

                          setAlldataobj({...get});
                        }}></FormInputs>
                   </View>
                          
                </View>
}
                
                 {/* Section C start */}
                 <Pressable style={styles.touchableHeadingCont} onPress={()=>setSectionCHide(!sectionC)}>
                <View style={styles.headerCont}>
                  <View style={styles.headingTxtCont}>
                  <TextView style={styles.headingTxt} type={'Light'} text="Section C) Career and Development"></TextView>
                  </View>
                  <View style={styles.plusBtnCont}>
                    <Text style={styles.plusText}>{sectionC?
                    <MaterialCommunityIcons
                      name="minus"
                      size={26}
                      color = {Colors.white}
                      >

                    </MaterialCommunityIcons>
                    :
                    <MaterialCommunityIcons
                      name="plus"
                      size={26}
                      color = {Colors.white}
                      >

                    </MaterialCommunityIcons>}
                    </Text>
                  </View>                  
                </View>
                </Pressable>
                {sectionC &&

                <View style={styles.sectionCCont}>    
                <View>
                      <View>
                        <Text style={styles.question}>
                        Q. 7. I am satisfied with the opportunities for(Of) training?
                        </Text>
                      </View>
                      <View style={{marginTop:10}}>
                        {allDataobj.employeeInfo[0].satisfiedOpportunities.options.map((item,index) => (
                          <RadioButton
                          onPress={() => satisfiedOpportunities(item,index)}
                          selected={item.selected}
                          key={item.id}
                        >
                          {item.label}
                        </RadioButton>
                        ))}
                      </View>
                      <FormInputs
                        text={'Comment'}
                        required={false}
                        error={
                          allDataobj.employeeInfo[array_index].satisfiedOpportunities.comment.error
                        }
                        value={
                          allDataobj.employeeInfo[array_index].satisfiedOpportunities.comment.value
                        }
                        onChangeText={(value) => {
                          let get = allDataobj;
                          get.employeeInfo[array_index].satisfiedOpportunities.comment.value =
                            value;
                          get.employeeInfo[array_index].satisfiedOpportunities.comment.error = false;

                          setAlldataobj({...get});
                        }}></FormInputs>
                   </View>
                   <View>
                      <View>
                        <Text style={styles.question}>
                        Q. 8. Safco makes every effort to fill vacancies from within before recruiting from outside?
                        </Text>
                      </View>
                      <View style={{marginTop:10}}>
                        {allDataobj.employeeInfo[0].fillVacancies.options.map((item,index) => (
                          <RadioButton
                          onPress={() => fillVacancies(item,index)}
                          selected={item.selected}
                          key={item.id}
                        >
                          {item.label}
                        </RadioButton>
                        ))}
                      </View>
                      <FormInputs
                        text={'Comment'}
                        required={false}
                        error={
                          allDataobj.employeeInfo[array_index].fillVacancies.comment.error
                        }
                        value={
                          allDataobj.employeeInfo[array_index].fillVacancies.comment.value
                        }
                        onChangeText={(value) => {
                          let get = allDataobj;
                          get.employeeInfo[array_index].fillVacancies.comment.value =
                            value;
                          get.employeeInfo[array_index].fillVacancies.comment.error = false;

                          setAlldataobj({...get});
                        }}></FormInputs>
                   </View>
                   <View>
                      <View>
                        <Text style={styles.question}>
                        Q. 9. Promotion goes to those who most deserve it?
                        </Text>
                      </View>
                      <View style={{marginTop:10}}>
                        {allDataobj.employeeInfo[0].Promotion.options.map((item,index) => (
                          <RadioButton
                          onPress={() => Promotion(item,index)}
                          selected={item.selected}
                          key={item.id}
                        >
                          {item.label}
                        </RadioButton>
                        ))}
                      </View>
                      <FormInputs
                        text={'Comment'}
                        required={false}
                        error={
                          allDataobj.employeeInfo[array_index].Promotion.comment.error
                        }
                        value={
                          allDataobj.employeeInfo[array_index].Promotion.comment.value
                        }
                        onChangeText={(value) => {
                          let get = allDataobj;
                          get.employeeInfo[array_index].Promotion.comment.value =
                            value;
                          get.employeeInfo[array_index].Promotion.comment.error = false;

                          setAlldataobj({...get});
                        }}></FormInputs>


                   </View>
                   <View>
                      <View>
                        <Text style={styles.question}>
                        Q. 10. My work at Safco is making me develop my skills & knowledge?
                        </Text>
                      </View>
                      <View style={{marginTop:10}}>
                        {allDataobj.employeeInfo[0].developSkills.options.map((item,index) => (
                          <RadioButton
                          onPress={() =>  developSkills(item,index)}
                          selected={item.selected}
                          key={item.id}
                        >
                          {item.label}
                        </RadioButton>
                        ))}
                      </View>
                      <FormInputs
                        text={'Comment'}
                        required={false}
                        error={
                          allDataobj.employeeInfo[array_index].developSkills.comment.error
                        }
                        value={
                          allDataobj.employeeInfo[array_index].developSkills.comment.value
                        }
                        onChangeText={(value) => {
                          let get = allDataobj;
                          get.employeeInfo[array_index].developSkills.comment.value =
                            value;
                          get.employeeInfo[array_index].developSkills.comment.error = false;

                          setAlldataobj({...get});
                        }}></FormInputs>
                   </View>

            
                </View>
            }


 {/* Section D start */}
 <Pressable style={styles.touchableHeadingCont} onPress={()=>setSectionDHide(!sectionD)}>
                <View style={styles.headerCont}>
                  <View style={styles.headingTxtCont}>
                  <TextView style={styles.headingTxt} type={'Light'} text="Section D) Relationship with Managers / Coworkers"></TextView>
                  </View>
                  <View style={styles.plusBtnCont}>
                    <Text style={styles.plusText}>{sectionD?
                    <MaterialCommunityIcons
                      name="minus"
                      size={26}
                      color = {Colors.white}
                      >

                    </MaterialCommunityIcons>
                    :
                    <MaterialCommunityIcons
                      name="plus"
                      size={26}
                      color = {Colors.white}
                      >

                    </MaterialCommunityIcons>}
                    </Text>
                  </View>                  
                </View>
                </Pressable>
                {sectionD &&

                <View style={styles.sectionDCont}>    
                <View>
                      <View>
                        <Text style={styles.question}>
                        Q. 11. I feel free to talk openly and honestly to my manager?
                        </Text>
                      </View>
                      <View style={{marginTop:10}}>
                        {allDataobj.employeeInfo[0].talkOpenly.options.map((item,index) => (
                          <RadioButton
                          onPress={() =>  talkOpenly(item,index)}
                          selected={item.selected}
                          key={item.id}
                        >
                          {item.label}
                        </RadioButton>
                        ))}
                      </View>
                      <FormInputs
                        text={'Comment'}
                        required={false}
                        error={
                          allDataobj.employeeInfo[array_index].talkOpenly.comment.error
                        }
                        value={
                          allDataobj.employeeInfo[array_index].talkOpenly.comment.value
                        }
                        onChangeText={(value) => {
                          let get = allDataobj;
                          get.employeeInfo[array_index].talkOpenly.comment.value =
                            value;
                          get.employeeInfo[array_index].talkOpenly.comment.error = false;

                          setAlldataobj({...get});
                        }}></FormInputs>
                   </View>
                   <View>
                      <View>
                        <Text style={styles.question}>
                        Q. 12. My manager praises me when I do a good job?
                        </Text>
                      </View>
                      <View style={{marginTop:10}}>
                        {allDataobj.employeeInfo[0].managerPraises.options.map((item,index) => (
                          <RadioButton
                          onPress={() => managerPraises(item,index)}
                          selected={item.selected}
                          key={item.id}
                        >
                          {item.label}
                        </RadioButton>
                        ))}
                      </View>

                      <FormInputs
                        text={'Comment'}
                        required={false}
                        error={
                          allDataobj.employeeInfo[array_index].managerPraises.comment.error
                        }
                        value={
                          allDataobj.employeeInfo[array_index].managerPraises.comment.value
                        }
                        onChangeText={(value) => {
                          let get = allDataobj;
                          get.employeeInfo[array_index].managerPraises.comment.value =
                            value;
                          get.employeeInfo[array_index].managerPraises.comment.error = false;

                          setAlldataobj({...get});
                        }}></FormInputs>
                   </View>
                   <View>
                      <View>
                        <Text style={styles.question}>
                        Q. 13. My manager helps me to improve myself?
                        </Text>
                      </View>
                      <View style={{marginTop:10}}>
                        {allDataobj.employeeInfo[0].improveMyself.options.map((item,index) => (
                          <RadioButton
                          onPress={() => improveMyself(item,index)}
                          selected={item.selected}
                          key={item.id}
                        >
                          {item.label}
                        </RadioButton>
                        ))}
                      </View>
                      <FormInputs
                        text={'Comment'}
                        required={false}
                        error={
                          allDataobj.employeeInfo[array_index].improveMyself.comment.error
                        }
                        value={
                          allDataobj.employeeInfo[array_index].improveMyself.comment.value
                        }
                        onChangeText={(value) => {
                          let get = allDataobj;
                          get.employeeInfo[array_index].improveMyself.comment.value =
                            value;
                          get.employeeInfo[array_index].improveMyself.comment.error = false;

                          setAlldataobj({...get});
                        }}></FormInputs>

                   </View>
                   <View>
                      <View>
                        <Text style={styles.question}>
                        Q. 14. My manager is an effective leader (i.e. shows behavior that is positive &
motivating)?
                        </Text>
                      </View>
                      <View style={{marginTop:10}}>
                        {allDataobj.employeeInfo[0].effectiveLeader.options.map((item,index) => (
                          <RadioButton
                          onPress={() => effectiveLeader(item,index)}
                          selected={item.selected}
                          key={item.id}
                        >
                          {item.label}
                        </RadioButton>
                        ))}
                      </View>
                      <FormInputs
                        text={'Comment'}
                        required={false}
                        error={
                          allDataobj.employeeInfo[array_index].effectiveLeader.comment.error
                        }
                        value={
                          allDataobj.employeeInfo[array_index].effectiveLeader.comment.value
                        }
                        onChangeText={(value) => {
                          let get = allDataobj;
                          get.employeeInfo[array_index].effectiveLeader.comment.value =
                            value;
                          get.employeeInfo[array_index].effectiveLeader.comment.error = false;

                          setAlldataobj({...get});
                        }}></FormInputs>


                   </View>
                
                   <View>
                      <View>
                        <Text style={styles.question}>
                        Q. 15. I feel free to talk openly and honestly with members of my office (Staff)?
                        </Text>
                      </View>
                      <View style={{marginTop:10}}>
                        {allDataobj.employeeInfo[0].officeMember.options.map((item,index) => (
                          <RadioButton
                          onPress={() => officeMember(item,index)}
                          selected={item.selected}
                          key={item.id}
                        >
                          {item.label}
                        </RadioButton>
                        ))}
                      </View>
                      <FormInputs
                        text={'Comment'}
                        required={false}
                        error={
                          allDataobj.employeeInfo[array_index].officeMember.comment.error
                        }
                        value={
                          allDataobj.employeeInfo[array_index].officeMember.comment.value
                        }
                        onChangeText={(value) => {
                          let get = allDataobj;
                          get.employeeInfo[array_index].officeMember.comment.value =
                            value;
                          get.employeeInfo[array_index].officeMember.comment.error = false;

                          setAlldataobj({...get});
                        }}></FormInputs>
                   </View>
            
                </View>
            }

 {/* Section E start */}
 <Pressable style={styles.touchableHeadingCont} onPress={()=>setSectionEHide(!sectionE)}>
                <View style={styles.headerCont}>
                  <View style={styles.headingTxtCont}>
                  <TextView style={styles.headingTxt} type={'Light'} text="Section E) Rewards/ Recognition and Performance"></TextView>
                  </View>
                  <View style={styles.plusBtnCont}>
                    <Text style={styles.plusText}>{sectionE?
                    <MaterialCommunityIcons
                      name="minus"
                      size={26}
                      color = {Colors.white}
                      >

                    </MaterialCommunityIcons>
                    :
                    <MaterialCommunityIcons
                      name="plus"
                      size={26}
                      color = {Colors.white}
                      >

                    </MaterialCommunityIcons>}
                    </Text>
                  </View>                  
                </View>
                </Pressable>
                {sectionE &&

                <View style={styles.sectionECont}>    
                <View>
                      <View>
                        <Text style={styles.question}>
                        Q. 16. Employees are recognized for good work performance?
                        </Text>
                      </View>
                      <View style={{marginTop:10}}>
                        {allDataobj.employeeInfo[0].workPerformance.options.map((item,index) => (
                          <RadioButton
                          onPress={() => workPerformance(item,index)}
                          selected={item.selected}
                          key={item.id}
                        >
                          {item.label}
                        </RadioButton>
                        ))}
                      </View>
                      <FormInputs
                        text={'Comment'}
                        required={false}
                        error={
                          allDataobj.employeeInfo[array_index].workPerformance.comment.error
                        }
                        value={
                          allDataobj.employeeInfo[array_index].workPerformance.comment.value
                        }
                        onChangeText={(value) => {
                          let get = allDataobj;
                          get.employeeInfo[array_index].workPerformance.comment.value =
                            value;
                          get.employeeInfo[array_index].workPerformance.comment.error = false;

                          setAlldataobj({...get});
                        }}></FormInputs>

                   </View>
                   <View>
                      <View>
                        <Text style={styles.question}>
                        Q. 17. Performance is clearly linked to promotions/rewards?
                        </Text>
                      </View>
                      <View style={{marginTop:10}}>
                        {allDataobj.employeeInfo[0].linkedPromotions.options.map((item,index) => (
                          <RadioButton
                          onPress={() => linkedPromotions(item,index)}
                          selected={item.selected}
                          key={item.id}
                        >
                          {item.label}
                        </RadioButton>
                        ))}
                      </View>
                      <FormInputs
                        text={'Comment'}
                        required={false}
                        error={
                          allDataobj.employeeInfo[array_index].linkedPromotions.comment.error
                        }
                        value={
                          allDataobj.employeeInfo[array_index].linkedPromotions.comment.value
                        }
                        onChangeText={(value) => {
                          let get = allDataobj;
                          get.employeeInfo[array_index].linkedPromotions.comment.value =
                            value;
                          get.employeeInfo[array_index].linkedPromotions.comment.error = false;

                          setAlldataobj({...get});
                        }}></FormInputs>
                   </View>
                   <View>
                      <View>
                        <Text style={styles.question}>
                        Q. 18. My last performance appraisal accurately reflected my performance?
                        </Text>
                      </View>
                      <View style={{marginTop:10}}>
                        {allDataobj.employeeInfo[0].lastPerformance.options.map((item,index) => (
                          <RadioButton
                          onPress={() => lastPerformance(item,index)}
                          selected={item.selected}
                          key={item.id}
                        >
                          {item.label}
                        </RadioButton>
                        ))}
                      </View>
                      <FormInputs
                        text={'Comment'}
                        required={false}
                        error={
                          allDataobj.employeeInfo[array_index].lastPerformance.comment.error
                        }
                        value={
                          allDataobj.employeeInfo[array_index].lastPerformance.comment.value
                        }
                        onChangeText={(value) => {
                          let get = allDataobj;
                          get.employeeInfo[array_index].lastPerformance.comment.value =
                            value;
                          get.employeeInfo[array_index].lastPerformance.comment.error = false;

                          setAlldataobj({...get});
                        }}></FormInputs>


                   </View>
                   

            
                </View>
            }


{/* Section F start */}
<Pressable style={styles.touchableHeadingCont} onPress={()=>setSectionFHide(!sectionF)}>
                <View style={styles.headerCont}>
                  <View style={styles.headingTxtCont}>
                  <TextView style={styles.headingTxt} type={'Light'} text="Section F) Working conditions and environment"></TextView>
                  </View>
                  <View style={styles.plusBtnCont}>
                    <Text style={styles.plusText}>{sectionF?
                    <MaterialCommunityIcons
                      name="minus"
                      size={26}
                      color = {Colors.white}
                      >

                    </MaterialCommunityIcons>
                    :
                    <MaterialCommunityIcons
                      name="plus"
                      size={26}
                      color = {Colors.white}
                      >

                    </MaterialCommunityIcons>}
                    </Text>
                  </View>                  
                </View>
                </Pressable>
                {sectionF &&

                <View style={styles.sectionFCont}>    
                <View>
                      <View>
                        <Text style={styles.question}>
                        Q. 19. My office has good, neat, clean and pleasant environment?
                        </Text>
                      </View>
                      <View style={{marginTop:10}}>
                        {allDataobj.employeeInfo[0].myOffice.options.map((item,index) => (
                          <RadioButton
                          onPress={() =>  myOffice(item,index)}
                          selected={item.selected}
                          key={item.id}
                        >
                          {item.label}
                        </RadioButton>
                        ))}
                      </View>
                      <FormInputs
                        text={'Comment'}
                        required={false}
                        error={
                          allDataobj.employeeInfo[array_index]. myOffice.comment.error
                        }
                        value={
                          allDataobj.employeeInfo[array_index]. myOffice.comment.value
                        }
                        onChangeText={(value) => {
                          let get = allDataobj;
                          get.employeeInfo[array_index]. myOffice.comment.value =
                            value;
                          get.employeeInfo[array_index]. myOffice.comment.error = false;

                          setAlldataobj({...get});
                        }}></FormInputs>

                   </View>
                   <View>
                      <View>
                        <Text style={styles.question}>
                        Q. 20. I believe my job is secure?
                        </Text>
                      </View>
                      <View style={{marginTop:10}}>
                        {allDataobj.employeeInfo[0].jobSecure.options.map((item,index) => (
                          <RadioButton
                          onPress={() => jobSecure(item,index)}
                          selected={item.selected}
                          key={item.id}
                        >
                          {item.label}
                        </RadioButton>
                        ))}
                      </View>
                      <FormInputs
                        text={'Comment'}
                        required={false}
                        error={
                          allDataobj.employeeInfo[array_index].jobSecure.comment.error
                        }
                        value={
                          allDataobj.employeeInfo[array_index].jobSecure.comment.value
                        }
                        onChangeText={(value) => {
                          let get = allDataobj;
                          get.employeeInfo[array_index].jobSecure.comment.value =
                            value;
                          get.employeeInfo[array_index].jobSecure.comment.error = false;

                          setAlldataobj({...get});
                        }}></FormInputs>
                   </View>
                   <View>
                      <View>
                        <Text style={styles.question}>
                        Q. 21. My workload is reasonable?
                        </Text>
                      </View>
                      <View style={{marginTop:10}}>
                        {allDataobj.employeeInfo[0].reasonableWork.options.map((item,index) => (
                          <RadioButton
                          onPress={() => reasonableWork(item,index)}
                          selected={item.selected}
                          key={item.id}
                        >
                          {item.label}
                        </RadioButton>
                        ))}
                      </View>
                      <FormInputs
                        text={'Comment'}
                        required={false}
                        error={
                          allDataobj.employeeInfo[array_index].reasonableWork.comment.error
                        }
                        value={
                          allDataobj.employeeInfo[array_index].reasonableWork.comment.value
                        }
                        onChangeText={(value) => {
                          let get = allDataobj;
                          get.employeeInfo[array_index].reasonableWork.comment.value =
                            value;
                          get.employeeInfo[array_index].reasonableWork.comment.error = false;

                          setAlldataobj({...get});
                        }}></FormInputs>


                   </View>
                   


                   <View>
                      <View>
                        <Text style={styles.question}>
                        Q. 22. I can keep a reasonable balance between work and personal life?
                        </Text>
                      </View>
                      <View style={{marginTop:10}}>
                        {allDataobj.employeeInfo[0].balanceWork.options.map((item,index) => (
                          <RadioButton
                          onPress={() => balanceWork(item,index)}
                          selected={item.selected}
                          key={item.id}
                        >
                          {item.label}
                        </RadioButton>
                        ))}
                      </View>
                      <FormInputs
                        text={'Comment'}
                        required={false}
                        error={
                          allDataobj.employeeInfo[array_index].balanceWork.comment.error
                        }
                        value={
                          allDataobj.employeeInfo[array_index].balanceWork.comment.value
                        }
                        onChangeText={(value) => {
                          let get = allDataobj;
                          get.employeeInfo[array_index].balanceWork.comment.value =
                            value;
                          get.employeeInfo[array_index].balanceWork.comment.error = false;

                          setAlldataobj({...get});
                        }}></FormInputs>


                   </View>
                   

            
                </View>
            }

{/* Section G start */}
<Pressable style={styles.touchableHeadingCont} onPress={()=>setSectionGHide(!sectionG)}>
                <View style={styles.headerCont}>
                  <View style={styles.headingTxtCont}>
                  <TextView style={styles.headingTxt} type={'Light'} text="Section G) Compensations and Benefits"></TextView>
                  </View>
                  <View style={styles.plusBtnCont}>
                    <Text style={styles.plusText}>{sectionG?
                    <MaterialCommunityIcons
                      name="minus"
                      size={26}
                      color = {Colors.white}
                      >

                    </MaterialCommunityIcons>
                    :
                    <MaterialCommunityIcons
                      name="plus"
                      size={26}
                      color = {Colors.white}
                      >

                    </MaterialCommunityIcons>}
                    </Text>
                  </View>                  
                </View>
                </Pressable>
                {sectionG &&

                <View style={styles.sectionGCont}>    
                <View>
                      <View>
                        <Text style={styles.question}>
                        Q. 23. I am satisfied with pay, incentive and benefits package?
                        </Text>
                      </View>
                      <View style={{marginTop:10}}>
                        {allDataobj.employeeInfo[0].satisfiedPay.options.map((item,index) => (
                          <RadioButton
                          onPress={() =>  satisfiedPay(item,index)}
                          selected={item.selected}
                          key={item.id}
                        >
                          {item.label}
                        </RadioButton>
                        ))}
                      </View>
                      <FormInputs
                        text={'Comment'}
                        required={false}
                        error={
                          allDataobj.employeeInfo[array_index].satisfiedPay.comment.error
                        }
                        value={
                          allDataobj.employeeInfo[array_index].satisfiedPay.comment.value
                        }
                        onChangeText={(value) => {
                          let get = allDataobj;
                          get.employeeInfo[array_index].satisfiedPay.comment.value =
                            value;
                          get.employeeInfo[array_index].satisfiedPay.comment.error = false;

                          setAlldataobj({...get});
                        }}></FormInputs>
                   </View>
                   <View>
                      <View>
                        <Text style={styles.question}>
                        Q. 24. I am satisfied with the Safco’s employee programs such as rewards, incentives,
insurance and health care, etc?
                        </Text>
                      </View>
                      <View style={{marginTop:10}}>
                        {allDataobj.employeeInfo[0].employeePrograms.options.map((item,index) => (
                          <RadioButton
                          onPress={() => employeePrograms(item,index)}
                          selected={item.selected}
                          key={item.id}
                        >
                          {item.label}
                        </RadioButton>
                        ))}
                      </View>

                      <FormInputs
                        text={'Comment'}
                        required={false}
                        error={
                          allDataobj.employeeInfo[array_index].employeePrograms.comment.error
                        }
                        value={
                          allDataobj.employeeInfo[array_index].employeePrograms.comment.value
                        }
                        onChangeText={(value) => {
                          let get = allDataobj;
                          get.employeeInfo[array_index].employeePrograms.comment.value =
                            value;
                          get.employeeInfo[array_index].employeePrograms.comment.error = false;

                          setAlldataobj({...get});
                        }}></FormInputs>
                   </View>
                   <View>
                      <View>
                        <Text style={styles.question}>
                        Q. 25. I am satisfied with the recreational activities provided by the Safco, e.g. picnics,
exposure, trainings etc?
                        </Text>
                      </View>
                      <View style={{marginTop:10}}>
                        {allDataobj.employeeInfo[0].safcoActivities.options.map((item,index) => (
                          <RadioButton
                          onPress={() => safcoActivities(item,index)}
                          selected={item.selected}
                          key={item.id}
                        >
                          {item.label}
                        </RadioButton>
                        ))}
                      </View>
                      <FormInputs
                        text={'Comment'}
                        required={false}
                        error={
                          allDataobj.employeeInfo[array_index].safcoActivities.comment.error
                        }
                        value={
                          allDataobj.employeeInfo[array_index].safcoActivities.comment.value
                        }
                        onChangeText={(value) => {
                          let get = allDataobj;
                          get.employeeInfo[array_index].safcoActivities.comment.value =
                            value;
                          get.employeeInfo[array_index].safcoActivities.comment.error = false;

                          setAlldataobj({...get});
                        }}></FormInputs>

                   </View>
                   
                
                   
            
                </View>
            }






{/* Section H start */}
<Pressable style={styles.touchableHeadingCont} onPress={()=>setSectionHHide(!sectionH)}>
                <View style={styles.headerCont}>
                  <View style={styles.headingTxtCont}>
                  <TextView style={styles.headingTxt} type={'Light'} text="Section H) Answer these Questions"></TextView>
                  </View>
                  <View style={styles.plusBtnCont}>
                    <Text style={styles.plusText}>{sectionH?
                    <MaterialCommunityIcons
                      name="minus"
                      size={26}
                      color = {Colors.white}
                      >

                    </MaterialCommunityIcons>
                    :
                    <MaterialCommunityIcons
                      name="plus"
                      size={26}
                      color = {Colors.white}
                      >

                    </MaterialCommunityIcons>}
                    </Text>
                  </View>                  
                </View>
                </Pressable>
                {sectionH &&

                <View style={styles.sectionHCont}>    
                <View>
                      <View>
                        <Text style={styles.question}>
                        What you like the most in your job right now?
                        </Text>
                      </View>
                     
                      <FormInputsAnswer
                        text={'Answer'}
                        required={true}
                        
                        error={
                          allDataobj.employeeInfo[array_index].jobRight.Answer.error
                        }
                        value={
                          allDataobj.employeeInfo[array_index].jobRight.Answer.value
                        }
                        onChangeText={(value) => {
                          let get = allDataobj;
                          get.employeeInfo[array_index].jobRight.Answer.value =
                            value;
                          get.employeeInfo[array_index].jobRight.Answer.error = false;

                          setAlldataobj({...get});
                        }}></FormInputsAnswer>
                   </View>
                   <View>
                   <View>
                      <View>
                        <Text style={styles.question}>
                        What is it that you are not comfortable in your job right now?
                        </Text>
                      </View>
                     
                      <FormInputsAnswer
                        text={'Answer'}
                        required={true}
                        
                        error={
                          allDataobj.employeeInfo[array_index].Comfortable.Answer.error
                        }
                        value={
                          allDataobj.employeeInfo[array_index].Comfortable.Answer.value
                        }
                        onChangeText={(value) => {
                          let get = allDataobj;
                          get.employeeInfo[array_index].Comfortable.Answer.value =
                            value;
                          get.employeeInfo[array_index].Comfortable.Answer.error = false;

                          setAlldataobj({...get});
                        }}></FormInputsAnswer>
                   </View>
                   <View>
                      <View>
                        <Text style={styles.question}>
                        How do you need to improve your performance and productivity?
                        </Text>
                      </View>
                     
                      <FormInputsAnswer
                        text={'Answer'}
                        required={true}
                        
                        error={
                          allDataobj.employeeInfo[array_index].Productivity.Answer.error
                        }
                        value={
                          allDataobj.employeeInfo[array_index].Productivity.Answer.value
                        }
                        onChangeText={(value) => {
                          let get = allDataobj;
                          get.employeeInfo[array_index].Productivity.Answer.value =
                            value;
                          get.employeeInfo[array_index].Productivity.Answer.error = false;

                          setAlldataobj({...get});
                        }}></FormInputsAnswer>
                   </View>
                   </View>
            
                </View>
            }







{/* Section I start */}
<Pressable style={styles.touchableHeadingCont} onPress={()=>setSectionIHide(!sectionI)}>
                <View style={styles.headerCont}>
                  <View style={styles.headingTxtCont}>
                  <TextView style={styles.headingTxt} type={'Light'} text="Section I) Expectations/Suggestions"></TextView>
                  </View>
                  <View style={styles.plusBtnCont}>
                    <Text style={styles.plusText}>{sectionI?
                    <MaterialCommunityIcons
                      name="minus"
                      size={26}
                      color = {Colors.white}
                      >

                    </MaterialCommunityIcons>
                    :
                    <MaterialCommunityIcons
                      name="plus"
                      size={26}
                      color = {Colors.white}
                      >

                    </MaterialCommunityIcons>}
                    </Text>
                  </View>                  
                </View>
                </Pressable>
                {sectionI &&

                <View style={styles.sectionICont}>    
                <View>
                      <View>
                        <Text style={styles.question}>
                        Give us at least three suggestions to improve the work environment in Safco? Like Designation,Location,Region/Area etc. 
                        </Text>
                      </View>
                     
                      <FormInputsAnswer
                        text={'Suggestion 1'}
                        required={true}
                        
                        error={
                          allDataobj.employeeInfo[array_index].threeSuggestion.Answer1.error
                        }
                        value={
                          allDataobj.employeeInfo[array_index].threeSuggestion.Answer1.value
                        }
                        onChangeText={(value) => {
                          let get = allDataobj;
                          get.employeeInfo[array_index].threeSuggestion.Answer1.value =
                            value;
                          get.employeeInfo[array_index].threeSuggestion.Answer1.error = false;

                          setAlldataobj({...get});
                        }}></FormInputsAnswer>


<FormInputsAnswer
        text={'Suggestion 2'}
        required={true}
        error={allDataobj.employeeInfo[array_index].threeSuggestion.Answer2.error}
        value={allDataobj.employeeInfo[array_index].threeSuggestion.Answer2.value}
        onChangeText={(value) => {
          let get = allDataobj;
          get.employeeInfo[array_index].threeSuggestion.Answer2.value = value;
          get.employeeInfo[array_index].threeSuggestion.Answer2.error = false;
          setAlldataobj({ ...get });
        }}
      />


<FormInputsAnswer
        text={'Suggestion 3'}
        required={true}
        error={allDataobj.employeeInfo[array_index].threeSuggestion.Answer3.error}
        value={allDataobj.employeeInfo[array_index].threeSuggestion.Answer3.value}
        onChangeText={(value) => {
          let get = allDataobj;
          get.employeeInfo[array_index].threeSuggestion.Answer3.value = value;
          get.employeeInfo[array_index].threeSuggestion.Answer3.error = false;
          setAlldataobj({ ...get });
        }}
      />
                   </View>
                   </View>
                   
                      
          
            }






            

              </ScrollView>
          </View>
          <View style={styles.bottomBtnCont}>
              <Pressable 
              style={styles.surveyBtn}
              onPress={()=>completeSurvey()}
              >
                 <Text style={styles.surveyBtnText}>
                     Complete Survey
                </Text>
              </Pressable>
              <Pressable 
              style={styles.surveyBtn}
              onPress={()=>checkContactInfo()}
              >
                <Text style={styles.surveyBtnText}>
                  Save Survey
                </Text>
              </Pressable>
          </View>

          {/* ************************************** */}
          {/* PrOgress Dialoge */}
          {/* ************************************** */}
          <ProgressDialog
    visible={progress}
    activityIndicatorColor={Colors.parrotGreenColor}
    title={dialogeTitle}
    message="Please, wait..."
/>
<Toast {...toast} onDismiss={() => setToast({ message: "", type: "" })} />

  </SafeAreaView>
    )
}

const styles = StyleSheet.create({
  inputdesign: {
    justifyContent: 'space-between',
   
    backgroundColor: '#f1f1f1',
    height: 52,
    width:160,
    marginVertical: 10,
   marginTop:10,
   marginLeft:5
   
    
    
    
  },
  questionsCont:{
    flex:9, 
    width:'100%',
    marginBottom:50
  },
  touchableHeadingCont:{
    backgroundColor:Colors.kulfa,
    borderRadius:6,
    margin:10,elevation:5,
  },
  contactInfoCont:{
    padding:20
  },
  sectionACont:{
    padding:20
  },
  sectionBCont:{
    padding:20
  },
  sectionCCont:{
    padding:20
  },
  sectionDCont:{
    padding:20
  },
  sectionECont:{
    padding:20
  },
  sectionFCont:{
    padding:20
  },
  sectionGCont:{
    padding:20
  },
  sectionHCont:{
    padding:20
  },
  sectionICont:{
    padding:20
  },
  headerCont:{
    flex:1,
    height:'10%', 
    flexDirection:'row', 
    padding:10
  },
  headingTxtCont:{
    flex:4, 
    flexDirection:'row'
  },
  headingTxt:{
    flex:2, 
    flexDirection:'row',
    padding:2,
    color:Colors.white
  },
  plusTouchBox:{
    alignItems:'flex-end', 
    marginRight:20
  },
  row2: {
    marginTop: 0,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  plusBtnCont:{
    flex:1,
    alignItems:'flex-end'
  },
  plusText:{
    fontWeight:'bold', 
    fontSize:20
  },
  question:{
    marginTop:10
  },
  
  bottomBtnCont:{
    flexDirection:'row', 
    width:'100%', 
    position:'absolute', 
    height:50, 
    bottom:0, 
    justifyContent:'space-between', 
    },
    surveyBtn:{
      flex:0.5, 
      elevation:10,
      alignItems:'center', 
      flexDirection:'column', 
      justifyContent:'center', 
      alignItems:'center', 
      backgroundColor:Colors.kulfa, 
      borderWidth:2, 
      margin:5, 
      borderColor:'white', 
      borderRadius:10
    },
    surveyBtnText:{
      color:Colors.white, 
      fontSize:15, 
      fontWeight:'bold'
    },
    textnote: {
      color: '#7d7d7d',
      fontSize: 14,
  marginTop:10,
      marginLeft: 20,
    },
    paragraph: {
      marginHorizontal: 20,
      marginTop: 20,
      fontSize: 13,
      lineHeight: 24,
      color: '#333',
      textAlign: 'justify',
      backgroundColor: '#f9f9f9',
      padding: 10,
      borderRadius: 8,
    },
});

export default EmployeeSurveyForm;