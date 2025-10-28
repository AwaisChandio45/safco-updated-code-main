import React,{useState} from 'react';
import {
  Text, 
  View , 
  SafeAreaView, 
  StyleSheet, 
  ScrollView, 
  Alert,
  Pressable
} from 'react-native';
import { FormInputs, DateSelector } from '../../components';
import { ClientSurvey } from '../../utilis/ClientSurvey';
import {AppStatusBar, Header, TextView} from '../../components';
import {Colors, GlobalStyles} from '../../theme';
import RadioButton from '../../components/RadioButton';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {connect, useSelector} from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {insertSurveyData, updateSurveyForm} from '../../sqlite/sqlitedb';
import { GettingDataforsurvey, UploadDataforsurvey } from '../../apis_auth/apis';
import { ProgressDialog } from 'react-native-simple-dialogs';
import Toast from '../../components/Toast';

const ClientSurveyForm = ({route, navigation})=>{
  
  const [haveData, setHaveData] = useState(null);
  const surveyData = useSelector((state) => state.SurveyData);
  const array_index = 0;
  const[progress,setProgress]=useState(false);
  const [UserId, setUserId] = React.useState(undefined);
  const [allDataobj, setAlldataobj] = React.useState();
  const [dialogeTitle, setDialogeTitle] = React.useState("Fetching user data!");

  const [toast, setToast] = React.useState({ value: "", type: "" });
  
  React.useEffect(() => {
    let{item}=route.params;
    setHaveData(item)

    if(item){
      var parse=JSON.parse(item.survey_form)
      setAlldataobj({clientInfo:[...parse]})
    }else{
      setAlldataobj({...surveyData.SurveyData})
    }
  }, []);

  
  React.useEffect(async () => {
    let get = await AsyncStorage.getItem('@userData');
    let parser = JSON.parse(get);
    setUserId(parser.EmployeeId);
  }, [])


// *******************************************************
// Handle Save Complete Survey
// ***************************************************
  const checkContactInfo = ()=>{
    const userData = allDataobj.clientInfo[array_index];
   
    
    if(userData.customerCnicNumber.value == ""){
      let get = userData.customerCnicNumber;
      get.error = true
      setAlldataobj({...allDataobj, get});
    }else if(userData.customerId.value == ""){
      let get = userData.customerId;
      get.error = true
      setAlldataobj({...allDataobj, get});
    }else if(userData.customerLoanId.value == ""){
      let get = userData.customerLoanId;
      get.error = true
      setAlldataobj({...allDataobj, get});
    }
    else if(userData.customerTypeOfLoan.value == ""){
      let get = userData.customerTypeOfLoan;
      get.error = true
      setAlldataobj({...allDataobj, get});
    }
    else if(userData.customerLoanCycle.value == ""){
      let get = userData.customerLoanCycle;
      get.error = true
      setAlldataobj({...allDataobj, get});
    }else if(userData.customerDateOfDisburse.value == ""){
      let get = userData.customerDateOfDisburse;
      get.error = true
      setAlldataobj({...allDataobj, get});
    }
    else if(userData.customerPhoneNumber.value == ""){
      let get = userData.customerPhoneNumber;
      get.error = true
      setAlldataobj({...allDataobj, get});
    }
    else if(userData.customerLoanOfficer.value == ""){
      let get = userData.customerLoanOfficer;
      get.error = true
      setAlldataobj({...allDataobj, get});
    }
    else if(userData.customerDateOfSurvey.value == ""){
      let get = userData.customerDateOfSurvey;
      get.error = true
      setAlldataobj({...allDataobj, get});
    }
    else if(userData.customerName.value == ""){
      let get = userData.customerName;
      get.error = true
      setAlldataobj({...allDataobj, get});
    }else{
      const surveyForm = JSON.stringify(allDataobj.clientInfo);
      if(haveData != null){
        //console.log(userData.customerCnicNumber.value +" "+ userData.customerName.value);
        updateSurveyForm(userData.customerName.value,surveyForm,userData.customerCnicNumber.value)
        .then((value)=>{
          alert(value)
        navigation.goBack();
        }).catch((erroe)=>{alert(erroe)});
      }else{
        insertSurveyData(UserId,userData.customerCnicNumber.value,userData.customerName.value,surveyForm)
        .then((value)=>{
          // alert(value)
        navigation.goBack();
        }).catch((erroe)=>{alert(erroe)});
      }
      
    }
  }
  
  // Radio Button Methods start
  //section A start
  const lockdownImpactBusiness = (item,index) => {    
    let arr=allDataobj;
    let temp=[];
    arr.clientInfo[0].impactBusiness.options.map((isLikedItem)=>{
      isLikedItem.id==item.id
      ?
      temp.push({...isLikedItem, selected: true,})
      :
      temp.push({...isLikedItem, selected: false,})
    })

    let impactBusiness = arr.clientInfo[0]['impactBusiness']['options'] = temp;
    impactBusiness = arr.clientInfo[0]['impactBusiness']['value'] = index;
     setAlldataobj({...allDataobj, impactBusiness});
  };
  const planningReviveIncome = (item,index) => {    
    let arr=allDataobj;
    let temp=[];
    arr.clientInfo[0].planningReviveIncome.options.map((isLikedItem)=>{
      isLikedItem.id==item.id
      ?
      temp.push({...isLikedItem, selected: true,})
      :
      temp.push({...isLikedItem, selected: false,})
    })

    let planningRevive = arr.clientInfo[0]['planningReviveIncome']['options'] = temp;
    planningRevive = arr.clientInfo[0]['planningReviveIncome']['value'] = index;
     setAlldataobj({...allDataobj, planningReviveIncome});
  };
  const sameLoanProduct = (item,index) => {    
    let arr=allDataobj;
    let temp=[];
    arr.clientInfo[0].safcoLoanProduct.options.map((isLikedItem)=>{
      isLikedItem.id==item.id
      ?
      temp.push({...isLikedItem, selected: true,})
      :
      temp.push({...isLikedItem, selected: false,})
    })

    let safcoLoanProduct = arr.clientInfo[0]['safcoLoanProduct']['options'] = temp;
    safcoLoanProduct = arr.clientInfo[0]['safcoLoanProduct']['value'] = index;
     setAlldataobj({...allDataobj, safcoLoanProduct});
  };
  const whoKeptUpdated = (item,index) => {    
    let arr=allDataobj;
    let temp=[];
    arr.clientInfo[0].whoKeptUpdateInfo.options.map((isLikedItem)=>{
      isLikedItem.id==item.id
      ?
      temp.push({...isLikedItem, selected: true,})
      :
      temp.push({...isLikedItem, selected: false,})
    })

    let whoKeptUpdateInfo = arr.clientInfo[0]['whoKeptUpdateInfo']['options'] = temp;
    whoKeptUpdateInfo = arr.clientInfo[0]['whoKeptUpdateInfo']['value'] = index;
     setAlldataobj({...allDataobj, whoKeptUpdateInfo});
  };
  const whoProvideSocDist = (item,index) => {    
    let arr=allDataobj;
    let temp=[];
    arr.clientInfo[0].whoProvideSocDistance.options.map((isLikedItem)=>{
      isLikedItem.id==item.id
      ?
      temp.push({...isLikedItem, selected: true,})
      :
      temp.push({...isLikedItem, selected: false,})
    })

    let whoProvideSocDistance = arr.clientInfo[0]['whoProvideSocDistance']['options'] = temp;
    whoProvideSocDistance = arr.clientInfo[0]['whoProvideSocDistance']['value'] = index;
     setAlldataobj({...allDataobj, whoProvideSocDist});
  };
  const didYouApply = (item,index) => {    
    let arr=allDataobj;
    let temp=[];
    arr.clientInfo[0].appliedForLoanResch.options.map((isLikedItem)=>{
      isLikedItem.id==item.id
      ?
      temp.push({...isLikedItem, selected: true,})
      :
      temp.push({...isLikedItem, selected: false,})
    })

    let appliedForLoanResch = arr.clientInfo[0]['appliedForLoanResch']['options'] = temp;
    appliedForLoanResch = arr.clientInfo[0]['appliedForLoanResch']['value'] = index;
     setAlldataobj({...allDataobj, appliedForLoanResch});
  };
  const whatMadeYouApply = (item,index) => {    
    let arr=allDataobj;
    let temp=[];
    arr.clientInfo[0].applyForReschedule.options.map((isLikedItem)=>{
      isLikedItem.id==item.id
      ?
      temp.push({...isLikedItem, selected: true,})
      :
      temp.push({...isLikedItem, selected: false,})
    })

    let applyForReschedule = arr.clientInfo[0]['applyForReschedule']['options'] = temp;
    applyForReschedule = arr.clientInfo[0]['applyForReschedule']['value'] = index;
     setAlldataobj({...allDataobj, applyForReschedule});
  };

  //Radio Button Section B Start
  const employeeMfoInfo = (item,index) => {    
    let arr=allDataobj;
    let temp=[];
    arr.clientInfo[0].employeeMfoInfo.options.map((isLikedItem)=>{
      isLikedItem.id==item.id
      ?
      temp.push({...isLikedItem, selected: true,})
      :
      temp.push({...isLikedItem, selected: false,})
    })

    let employeeMfoInfo = arr.clientInfo[0]['employeeMfoInfo']['options'] = temp;
    employeeMfoInfo = arr.clientInfo[0]['employeeMfoInfo']['value'] = index;
     setAlldataobj({...allDataobj, employeeMfoInfo});
  };
  const appExpClear = (item,index) => {    
    let arr=allDataobj;
    let temp=[];
    arr.clientInfo[0].appExpClear.options.map((isLikedItem)=>{
      isLikedItem.id==item.id
      ?
      temp.push({...isLikedItem, selected: true,})
      :
      temp.push({...isLikedItem, selected: false,})
    })

    let appExpClear = arr.clientInfo[0]['appExpClear']['options'] = temp;
    appExpClear = arr.clientInfo[0]['appExpClear']['value'] = index;
     setAlldataobj({...allDataobj, appExpClear});
  };
  const disburseTakeTime = (item,index) => {    
    let arr=allDataobj;
    let temp=[];
    arr.clientInfo[0].disburseTakeTime.options.map((isLikedItem)=>{
      isLikedItem.id==item.id
      ?
      temp.push({...isLikedItem, selected: true,})
      :
      temp.push({...isLikedItem, selected: false,})
    })

    let disburseTakeTime = arr.clientInfo[0]['disburseTakeTime']['options'] = temp;
    disburseTakeTime = arr.clientInfo[0]['disburseTakeTime']['value'] = index;
     setAlldataobj({...allDataobj, disburseTakeTime});
  };
  const arriveTakeTime = (item,index) => {    
    let arr=allDataobj;
    let temp=[];
    arr.clientInfo[0].arriveTakeTime.options.map((isLikedItem)=>{
      isLikedItem.id==item.id
      ?
      temp.push({...isLikedItem, selected: true,})
      :
      temp.push({...isLikedItem, selected: false,})
    })

    let arriveTakeTime = arr.clientInfo[0]['arriveTakeTime']['options'] = temp;
    arriveTakeTime = arr.clientInfo[0]['arriveTakeTime']['value'] = index;
     setAlldataobj({...allDataobj, arriveTakeTime});
  };
  const proceDisbuseAtBranch = (item,index) => {    
    let arr=allDataobj;
    let temp=[];
    arr.clientInfo[0].proceDisbuseAtBranch.options.map((isLikedItem)=>{
      isLikedItem.id==item.id
      ?
      temp.push({...isLikedItem, selected: true,})
      :
      temp.push({...isLikedItem, selected: false,})
    })

    let proceDisbuseAtBranch = arr.clientInfo[0]['proceDisbuseAtBranch']['options'] = temp;
    proceDisbuseAtBranch = arr.clientInfo[0]['proceDisbuseAtBranch']['value'] = index;
     setAlldataobj({...allDataobj, proceDisbuseAtBranch});
  };
  const branchReception = (item,index) => {    
    let arr=allDataobj;
    let temp=[];
    arr.clientInfo[0].branchReception.options.map((isLikedItem)=>{
      isLikedItem.id==item.id
      ?
      temp.push({...isLikedItem, selected: true,})
      :
      temp.push({...isLikedItem, selected: false,})
    })

    let branchReception = arr.clientInfo[0]['branchReception']['options'] = temp;
    branchReception = arr.clientInfo[0]['branchReception']['value'] = index;
     setAlldataobj({...allDataobj, branchReception});
  };
  const didYouWait = (item,index) => {    
    let arr=allDataobj;
    let temp=[];
    arr.clientInfo[0].didYouWait.options.map((isLikedItem)=>{
      isLikedItem.id==item.id
      ?
      temp.push({...isLikedItem, selected: true,})
      :
      temp.push({...isLikedItem, selected: false,})
    })

    let didYouWait = arr.clientInfo[0]['didYouWait']['options'] = temp;
    didYouWait = arr.clientInfo[0]['didYouWait']['value'] = index;
     setAlldataobj({...allDataobj, didYouWait});
  };
  const repayLoan = (item,index) => {    
    let arr=allDataobj;
    let temp=[];
    arr.clientInfo[0].repayLoan.options.map((isLikedItem)=>{
      isLikedItem.id==item.id
      ?
      temp.push({...isLikedItem, selected: true,})
      :
      temp.push({...isLikedItem, selected: false,})
    })

    let repayLoan = arr.clientInfo[0]['repayLoan']['options'] = temp;
    repayLoan = arr.clientInfo[0]['repayLoan']['value'] = index;
     setAlldataobj({...allDataobj, repayLoan});
  };
  const provConvOpenHours = (item,index) => {    
    let arr=allDataobj;
    let temp=[];
    arr.clientInfo[0].provConvOpenHours.options.map((isLikedItem)=>{
      isLikedItem.id==item.id
      ?
      temp.push({...isLikedItem, selected: true,})
      :
      temp.push({...isLikedItem, selected: false,})
    })

    let provConvOpenHours = arr.clientInfo[0]['provConvOpenHours']['options'] = temp;
    provConvOpenHours = arr.clientInfo[0]['provConvOpenHours']['value'] = index;
     setAlldataobj({...allDataobj, provConvOpenHours});
  };
  const howLongYouWait = (item,index) => {    
    let arr=allDataobj;
    let temp=[];
    arr.clientInfo[0].howLongYouWait.options.map((isLikedItem)=>{
      isLikedItem.id==item.id
      ?
      temp.push({...isLikedItem, selected: true,})
      :
      temp.push({...isLikedItem, selected: false,})
    })

    let howLongYouWait = arr.clientInfo[0]['howLongYouWait']['options'] = temp;
    howLongYouWait = arr.clientInfo[0]['howLongYouWait']['value'] = index;
     setAlldataobj({...allDataobj, howLongYouWait});
  };
  const processQuickExptWaitTime = (item,index) => {    
    let arr=allDataobj;
    let temp=[];
    arr.clientInfo[0].processQuickExptWaitTime.options.map((isLikedItem)=>{
      isLikedItem.id==item.id
      ?
      temp.push({...isLikedItem, selected: true,})
      :
      temp.push({...isLikedItem, selected: false,})
    })

    let processQuickExptWaitTime = arr.clientInfo[0]['processQuickExptWaitTime']['options'] = temp;
    processQuickExptWaitTime = arr.clientInfo[0]['processQuickExptWaitTime']['value'] = index;
     setAlldataobj({...allDataobj, processQuickExptWaitTime});
  };
  const staffServeYouWell = (item,index) => {    
    let arr=allDataobj;
    let temp=[];
    arr.clientInfo[0].staffServeYouWell.options.map((isLikedItem)=>{
      isLikedItem.id==item.id
      ?
      temp.push({...isLikedItem, selected: true,})
      :
      temp.push({...isLikedItem, selected: false,})
    })

    let staffServeYouWell = arr.clientInfo[0]['staffServeYouWell']['options'] = temp;
    staffServeYouWell = arr.clientInfo[0]['staffServeYouWell']['value'] = index;
     setAlldataobj({...allDataobj, staffServeYouWell});
  };
  const frequentEmpVisitYou = (item,index) => {    
    let arr=allDataobj;
    let temp=[];
    arr.clientInfo[0].frequentEmpVisitYou.options.map((isLikedItem)=>{
      isLikedItem.id==item.id
      ?
      temp.push({...isLikedItem, selected: true,})
      :
      temp.push({...isLikedItem, selected: false,})
    })

    let frequentEmpVisitYou = arr.clientInfo[0]['frequentEmpVisitYou']['options'] = temp;
    frequentEmpVisitYou = arr.clientInfo[0]['frequentEmpVisitYou']['value'] = index;
     setAlldataobj({...allDataobj, frequentEmpVisitYou});
  };
  const contactTheEmployee = (item,index) => {    
    let arr=allDataobj;
    let temp=[];
    arr.clientInfo[0].contactTheEmployee.options.map((isLikedItem)=>{
      isLikedItem.id==item.id
      ?
      temp.push({...isLikedItem, selected: true,})
      :
      temp.push({...isLikedItem, selected: false,})
    })

    let contactTheEmployee = arr.clientInfo[0]['contactTheEmployee']['options'] = temp;
    contactTheEmployee = arr.clientInfo[0]['contactTheEmployee']['value'] = index;
     setAlldataobj({...allDataobj, contactTheEmployee});
  };
  const EmpDoesEffort = (item,index) => {    
    let arr=allDataobj;
    let temp=[];
    arr.clientInfo[0].EmpDoesEffort.options.map((isLikedItem)=>{
      isLikedItem.id==item.id
      ?
      temp.push({...isLikedItem, selected: true,})
      :
      temp.push({...isLikedItem, selected: false,})
    })

    let EmpDoesEffort = arr.clientInfo[0]['EmpDoesEffort']['options'] = temp;
    EmpDoesEffort = arr.clientInfo[0]['EmpDoesEffort']['value'] = index;
     setAlldataobj({...allDataobj, EmpDoesEffort});
  };
  const youSatisfiedWithLoan = (item,index) => {    
    let arr=allDataobj;
    let temp=[];
    arr.clientInfo[0].youSatisfiedWithLoan.options.map((isLikedItem)=>{
      isLikedItem.id==item.id
      ?
      temp.push({...isLikedItem, selected: true,})
      :
      temp.push({...isLikedItem, selected: false,})
    })

    let youSatisfiedWithLoan = arr.clientInfo[0]['youSatisfiedWithLoan']['options'] = temp;
    youSatisfiedWithLoan = arr.clientInfo[0]['youSatisfiedWithLoan']['value'] = index;
     setAlldataobj({...allDataobj, youSatisfiedWithLoan});
  };
  const reasonsOfSatisfaction = (item,index) => {    
    let arr=allDataobj;
    let temp=[];
    arr.clientInfo[0].reasonsOfSatisfaction.options.map((isLikedItem)=>{
      isLikedItem.id==item.id
      ?
      temp.push({...isLikedItem, selected: true,})
      :
      temp.push({...isLikedItem, selected: false,})
      let reasonsOfSatisfaction = arr.clientInfo[0]['reasonsOfSatisfaction']['options'] = temp;
      reasonsOfSatisfaction = arr.clientInfo[0]['reasonsOfSatisfaction']['value'] = index;
      setAlldataobj({...allDataobj, reasonsOfSatisfaction});
    })
   };
    const characOfCredit = (item,index) => {    
    let arr=allDataobj;
    let temp=[];
    arr.clientInfo[0].characOfCredit.options.map((isLikedItem)=>{
      isLikedItem.id==item.id
      ?
      temp.push({...isLikedItem, selected: true,})
      :
      temp.push({...isLikedItem, selected: false,})
    })

  //   let reasonsOfSatisfaction = arr.clientInfo[0]['reasonsOfSatisfaction']['options'] = temp;
  //   reasonsOfSatisfaction = arr.clientInfo[0]['reasonsOfSatisfaction']['value'] = index;
  //    setAlldataobj({...allDataobj, reasonsOfSatisfaction});
  let characOfCredit = arr.clientInfo[0]['characOfCredit']['options'] = temp;
  characOfCredit = arr.clientInfo[0]['characOfCredit']['value'] = index;
  setAlldataobj({...allDataobj, characOfCredit});
  };
  const handleCnic=(value) => { 
  
     if (value.length < 16) {
      if (value.length == 5 || value.length == 13) {
        let get = allDataobj;
        get.clientInfo[array_index].customerCnicNumber.value = value + '-';
        get.clientInfo[array_index].customerCnicNumber.error = false;
        setAlldataobj({...get});
      } else {
        let get = allDataobj;
        get.clientInfo[array_index].customerCnicNumber.value = value;
        get.clientInfo[array_index].customerCnicNumber.error = false;
        setAlldataobj({...get});
      }
      // ****************************************************************
      // GETTING USER DATA BY <CNINC></CNINC>
      // ***************************************************************
      if(value.length==15){
        GettingDataforsurvey(value,setProgress).then((value)=>{
          if(value){
            if(value[0].Result=='True'){
              console.log("True--works==>",value)
              let get = allDataobj;
              get.clientInfo[array_index].customerId.value =value[0].CustomerId
              get.clientInfo[array_index].customerLoanId.value =value[0].LoanId
              get.clientInfo[array_index].customerTypeOfLoan.value =value[0].LoanTypeName
              get.clientInfo[array_index].customerLoanCycle.value =value[0].LoanCycle
              get.clientInfo[array_index].customerDateOfDisburse.value =value[0].DisbursementDate
              get.clientInfo[array_index].customerPhoneNumber.value =value[0].PhoneNumber
              get.clientInfo[array_index].customerLoanOfficer.value =value[0].LoanOfficer
              get.clientInfo[array_index].customerDateOfSurvey.value =value[0].Today             
              get.clientInfo[array_index].customerName.value =value[0].CutomerName
              setAlldataobj({...get})
            }else{
              setToast({
                type: "error",
                message: "Sorry! User data not found.",
              });
            }
          }else{
          console.log("else--works==>",value)

          }
          console.log("then--works==>",value)
        }).catch((value)=>{

        })        
            }
    }
  }
  
const dealingFinancialInstitute = (item,index) => {    
let arr=allDataobj;
let temp=[];
arr.clientInfo[0].dealingFinancialInstitute.options.map((isLikedItem)=>{
  isLikedItem.id==item.id
  ?
  temp.push({...isLikedItem, selected: true,})
  :
  temp.push({...isLikedItem, selected: false,})
})

let dealingFinancialInstitute = arr.clientInfo[0]['dealingFinancialInstitute']['options'] = temp;
dealingFinancialInstitute = arr.clientInfo[0]['dealingFinancialInstitute']['value'] = index;
setAlldataobj({...allDataobj, dealingFinancialInstitute});
}
const forWhatReason = (item,index) => {    
let arr=allDataobj;
let temp=[];
arr.clientInfo[0].forWhatReason.options.map((isLikedItem)=>{
  isLikedItem.id==item.id
  ?
  temp.push({...isLikedItem, selected: true,})
  :
  temp.push({...isLikedItem, selected: false,})
})

let forWhatReason = arr.clientInfo[0]['forWhatReason']['options'] = temp;
forWhatReason = arr.clientInfo[0]['forWhatReason']['value'] = index;
setAlldataobj({...allDataobj, forWhatReason});
}
const productMeetYourNeed = (item,index) => {    
let arr=allDataobj;
let temp=[];
arr.clientInfo[0].productMeetYourNeed.options.map((isLikedItem)=>{
  isLikedItem.id==item.id
  ?
  temp.push({...isLikedItem, selected: true,})
  :
  temp.push({...isLikedItem, selected: false,})
})

let productMeetYourNeed = arr.clientInfo[0]['productMeetYourNeed']['options'] = temp;
productMeetYourNeed = arr.clientInfo[0]['productMeetYourNeed']['value'] = index;
setAlldataobj({...allDataobj, productMeetYourNeed});
}
const ifNoReason = (item,index) => {    
let arr=allDataobj;
let temp=[];
arr.clientInfo[0].ifNoReason.options.map((isLikedItem)=>{
  isLikedItem.id==item.id
  ?
  temp.push({...isLikedItem, selected: true,})
  :
  temp.push({...isLikedItem, selected: false,})
})

let ifNoReason = arr.clientInfo[0]['ifNoReason']['options'] = temp;
ifNoReason = arr.clientInfo[0]['ifNoReason']['value'] = index;
setAlldataobj({...allDataobj, ifNoReason});
}
const houseFinanceLoan = (item,index) => {    
let arr=allDataobj;
let temp=[];
arr.clientInfo[0].houseFinanceLoan.options.map((isLikedItem)=>{
  isLikedItem.id==item.id
  ?
  temp.push({...isLikedItem, selected: true,})
  :
  temp.push({...isLikedItem, selected: false,})
})

let houseFinanceLoan = arr.clientInfo[0]['houseFinanceLoan']['options'] = temp;
houseFinanceLoan = arr.clientInfo[0]['houseFinanceLoan']['value'] = index;
setAlldataobj({...allDataobj, houseFinanceLoan});
}
const ifYesPurpose = (item,index) => {    
let arr=allDataobj;
let temp=[];
arr.clientInfo[0].ifYesPurpose.options.map((isLikedItem)=>{
  isLikedItem.id==item.id
  ?
  temp.push({...isLikedItem, selected: true,})
  :
  temp.push({...isLikedItem, selected: false,})
})

let ifYesPurpose = arr.clientInfo[0]['ifYesPurpose']['options'] = temp;
ifYesPurpose = arr.clientInfo[0]['ifYesPurpose']['value'] = index;
setAlldataobj({...allDataobj, ifYesPurpose});
}
const forConstructNewHouse = (item,index) => {    
let arr=allDataobj;
let temp=[];
arr.clientInfo[0].forConstructNewHouse.options.map((isLikedItem)=>{
  isLikedItem.id==item.id
  ?
  temp.push({...isLikedItem, selected: true,})
  :
  temp.push({...isLikedItem, selected: false,})
})

let forConstructNewHouse = arr.clientInfo[0]['forConstructNewHouse']['options'] = temp;
forConstructNewHouse = arr.clientInfo[0]['forConstructNewHouse']['value'] = index;
setAlldataobj({...allDataobj, forConstructNewHouse});
}
const autoFinanceLoan = (item,index) => {    
let arr=allDataobj;
let temp=[];
arr.clientInfo[0].autoFinanceLoan.options.map((isLikedItem)=>{
  isLikedItem.id==item.id
  ?
  temp.push({...isLikedItem, selected: true,})
  :
  temp.push({...isLikedItem, selected: false,})
})

let autoFinanceLoan = arr.clientInfo[0]['autoFinanceLoan']['options'] = temp;
autoFinanceLoan = arr.clientInfo[0]['autoFinanceLoan']['value'] = index;
setAlldataobj({...allDataobj, autoFinanceLoan});
}
const whichVehcleWantPurchase = (item,index) => {    
let arr=allDataobj;
let temp=[];
arr.clientInfo[0].whichVehcleWantPurchase.options.map((isLikedItem)=>{
  isLikedItem.id==item.id
  ?
  temp.push({...isLikedItem, selected: true,})
  :
  temp.push({...isLikedItem, selected: false,})
})

let whichVehcleWantPurchase = arr.clientInfo[0]['whichVehcleWantPurchase']['options'] = temp;
whichVehcleWantPurchase = arr.clientInfo[0]['whichVehcleWantPurchase']['value'] = index;
setAlldataobj({...allDataobj, whichVehcleWantPurchase});
}
const modeOfFinance = (item,index) => {    
let arr=allDataobj;
let temp=[];
arr.clientInfo[0].modeOfFinance.options.map((isLikedItem)=>{
  isLikedItem.id==item.id
  ?
  temp.push({...isLikedItem, selected: true,})
  :
  temp.push({...isLikedItem, selected: false,})
})

let modeOfFinance = arr.clientInfo[0]['modeOfFinance']['options'] = temp;
modeOfFinance = arr.clientInfo[0]['modeOfFinance']['value'] = index;
setAlldataobj({...allDataobj, modeOfFinance});
}
////////Complete Survey ////////////////////////////
const completeSurvey = ()=>{
  const userData = allDataobj.clientInfo[array_index];
    
  if(userData.customerCnicNumber.value == ""){
    let get = userData.customerCnicNumber;
    get.error = true
    setAlldataobj({...allDataobj, get});
  }else if(userData.customerId.value == ""){
    let get = userData.customerId;
    get.error = true
    setAlldataobj({...allDataobj, get});
  }else if(userData.customerLoanId.value == ""){
    let get = userData.customerLoanId;
    get.error = true
    setAlldataobj({...allDataobj, get});
  }
  else if(userData.customerTypeOfLoan.value == ""){
    let get = userData.customerTypeOfLoan;
    get.error = true
    setAlldataobj({...allDataobj, get});
  }
  else if(userData.customerLoanCycle.value == ""){
    let get = userData.customerLoanCycle;
    get.error = true
    setAlldataobj({...allDataobj, get});
  }else if(userData.customerDateOfDisburse.value == ""){
    let get = userData.customerDateOfDisburse;
    get.error = true
    setAlldataobj({...allDataobj, get});
  }
  else if(userData.customerPhoneNumber.value == ""){
    let get = userData.customerPhoneNumber;
    get.error = true
    setAlldataobj({...allDataobj, get});
  }
  else if(userData.customerLoanOfficer.value == ""){
    let get = userData.customerLoanOfficer;
    get.error = true
    setAlldataobj({...allDataobj, get});
  }
  else if(userData.customerDateOfSurvey.value == ""){
    let get = userData.customerDateOfSurvey;
    get.error = true
    setAlldataobj({...allDataobj, get});
  }
  else if(userData.customerName.value == ""){
    let get = userData.customerName;
    get.error = true
    setAlldataobj({...allDataobj, get});
  }else{
    setDialogeTitle("Submitting Survey Data!")
  UploadDataforsurvey(userData,setProgress).
  then((value)=>{
    // setToast({
    //   type: "error",
    //   message: "Successfully submitted!",
    // });
    Alert.alert(
      "Submitted!",
      "Client Satisfication Form Successfully Submitted.",
      [
      
        { text: "OK", onPress: () => console.log("OK Pressed") }
      ]
    );
    navigation.goBack();

  }).
  catch((error)=>{
    setToast({
      type: "error",
      message: error,
    });
  })
  }

}
//////////////////Complete Survey Form End/////////////

  //Radio Button Methods end 
  const [contactInfo, setHideContact] = React.useState(false);
  const [sectionA, setSectionAhide] = React.useState(false);
  const [sectionB, setSectionBHide] = React.useState(false);

  return (
      <SafeAreaView style={{flex:1, backgroundColor:'#fff',}}>
        <AppStatusBar></AppStatusBar>
        <View style={GlobalStyles.row}>
        <Header Theme={Colors} back={true} screenNo={3}></Header>
            <TextView
            type={'mini_heading22'}
            style={{paddingHorizontal: 0, marginTop: 55, fontSize:15,marginRight:20}}
            text="Client Satisfication Survey Form"></TextView>
        </View>
        <View style={styles.questionsCont}>
          <ScrollView>
          <Pressable style={styles.touchableHeadingCont} 
          activeOpacity={0.7} 
          onPress={()=>setHideContact(!contactInfo)}>
            <View style={styles.headerCont}>
              <View style={styles.headingTxtCont}>
              <TextView style={styles.headingTxt} 
              type={'Light'} 
              text="Customer Conctact Information">
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
                keyboardtype={'decimal-pad'}
                text={'Customer CNIC'}
                required={true}
                error={
                allDataobj.clientInfo[array_index].customerCnicNumber.error
                }
                value={allDataobj.clientInfo[array_index].customerCnicNumber.value}
                onChangeText={(value)=>handleCnic(value)}></FormInputs>

                <FormInputs
                keyboardtype={'decimal-pad'}
                text={'Customer ID'}
                required={true}
                error={
                  allDataobj.clientInfo[array_index].customerId.error
                }
                value={
                  allDataobj.clientInfo[array_index].customerId.value
                }
                onChangeText={(value) => {
                  let get = allDataobj;
                  get.clientInfo[array_index].customerId.value =
                    value;
                  get.clientInfo[array_index].customerId.error = false;

                  setAlldataobj({...get});
                }}></FormInputs>
                </View>
                <View style= {styles.row2}>
                <FormInputs
                keyboardtype={'decimal-pad'}
                text={'Loan Id'}
                required={true}
                error={
                  allDataobj.clientInfo[array_index].customerLoanId.error
                }
                value={
                  allDataobj.clientInfo[array_index].customerLoanId.value
                }
                onChangeText={(value) => {
                  let get = allDataobj;
                  get.clientInfo[array_index].customerLoanId.value =
                    value;
                  get.clientInfo[array_index].customerLoanId.error = false;

                  setAlldataobj({...get});
                }}></FormInputs>
                <FormInputs
                text={'Type Of Loan'}
                required={true}
                error={
                  allDataobj.clientInfo[array_index].customerTypeOfLoan.error
                }
                value={
                  allDataobj.clientInfo[array_index].customerTypeOfLoan.value
                }
              
                onChangeText={(value) => {
                  let get = allDataobj;
                  get.clientInfo[array_index].customerTypeOfLoan.value =
                    value;
                  get.clientInfo[array_index].customerTypeOfLoan.error = false;

                  setAlldataobj({...get});
                }}></FormInputs>
              </View>
              <View style= {styles.row2}>
                <FormInputs
                keyboardtype={'decimal-pad'}
                text={'Loan Cycle'}
                required={true}
                error={
                  allDataobj.clientInfo[array_index].customerLoanCycle.error
                }
                value={
                  allDataobj.clientInfo[array_index].customerLoanCycle.value
                }
               
                onChangeText={(value) => {
                  let get = allDataobj;
                  get.clientInfo[array_index].customerLoanCycle.value =
                    value;
                  get.clientInfo[array_index].customerLoanCycle.error = false;

                  setAlldataobj({...get});
                }}></FormInputs>
                <FormInputs
                keyboardtype={'decimal-pad'}
                text={'Date Of Disbursement'}
                required={true}
               
                error={
                  allDataobj.clientInfo[array_index].customerDateOfDisburse.error
                }
                value={
                  allDataobj.clientInfo[array_index].customerDateOfDisburse.value
                }
                onChangeText={(value) => {
                  let get = allDataobj;
                  get.clientInfo[array_index].customerDateOfDisburse.value =
                    value;
                  get.clientInfo[array_index].customerDateOfDisburse.error = false;

                  setAlldataobj({...get});
                }}></FormInputs>
                </View>
                <View style= {styles.row2}>
                <FormInputs
                keyboardtype={'decimal-pad'}
                text={'Phone Number'}
                required={true}
                error={
                  
                  allDataobj.clientInfo[array_index].customerPhoneNumber.error
                }
                value={
                  allDataobj.clientInfo[array_index].customerPhoneNumber.value
                }
                onChangeText={(value) => {
                  let get = allDataobj;
                  get.clientInfo[array_index].customerPhoneNumber.value =
                    value;
                  get.clientInfo[array_index].customerPhoneNumber.error = false;

                  setAlldataobj({...get});
                }}></FormInputs>
                <FormInputs
                keyboardtype={'decimal-pad'}
                text={'Loan Officer'}
                required={true}
                error={
                 
                  allDataobj.clientInfo[array_index].customerLoanOfficer.error
                }
                value={
                  allDataobj.clientInfo[array_index].customerLoanOfficer.value
                }
                onChangeText={(value) => {
                  let get = allDataobj;
                  get.clientInfo[array_index].customerLoanOfficer.value =
                    value;
                  get.clientInfo[array_index].customerLoanOfficer.error = false;

                  setAlldataobj({...get});
                }}></FormInputs>
                </View>
                <View style= {styles.row2}>
                <FormInputs
                keyboardtype={'decimal-pad'}
                text={'Date Of Survey'}
                required={true}
                error={
                
                  allDataobj.clientInfo[array_index].customerDateOfSurvey.error
                }
                value={
                  allDataobj.clientInfo[array_index].customerDateOfSurvey.value
                }
                onChangeText={(value) => {
                  let get = allDataobj;
                  get.clientInfo[array_index].customerDateOfSurvey.value =
                    value;
                  get.clientInfo[array_index].customerDateOfSurvey.error = false;

                  setAlldataobj({...get});
                }}></FormInputs>
                <FormInputs
                text={'Customer Name'}
                required={true}
                error={
                 
                  allDataobj.clientInfo[array_index].customerName.error
                }
                value={
                  allDataobj.clientInfo[array_index].customerName.value
                }
                onChangeText={(value) => {
                  let get = allDataobj;
                  get.clientInfo[array_index].customerName.value =
                    value;
                  get.clientInfo[array_index].customerName.error = false;

                  setAlldataobj({...get});
                }}></FormInputs>
                </View>
            </View>
        }
            <Pressable style={styles.touchableHeadingCont} onPress={()=>setSectionAhide(!sectionA)}>
                <View style={styles.headerCont}>
                  <View style={styles.headingTxtCont}>
                  <TextView style={styles.headingTxt} type={'Light'} text="Section A) Covid-19"></TextView>
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
                    <Text style={styles.question}>Did lockdown impact your business and cashflow?</Text>
                  </View>
                    <View style={{marginTop:10}}>
                      {allDataobj.clientInfo[0].impactBusiness.options.map((item,index) => (
                        <RadioButton
                        onPress={() => lockdownImpactBusiness(item,index)}
                        selected={item.selected}
                        key={item.id}
                      >
                        {item.label}
                      </RadioButton>
                      ))}
                    </View>
                   </View>
                  <View style={{marginTop:10}}>
                    <View >
                      <Text style={styles.question}>Have you are planning to revive your income again? </Text>
                    </View>
                      <View style={{marginTop:10}}>
                        {allDataobj.clientInfo[0].planningReviveIncome.options.map((item,index) => (
                          <RadioButton
                            onPress={() => planningReviveIncome(item,index)}
                            selected={item.selected}
                            key={item.id}
                          >
                            {item.label}
                          </RadioButton>
                        ))}
                      </View>
                    </View>
                    <View style={{marginTop:10}}>
                    <View >
                      <Text style={styles.question}>Do you recommend SAFCO to go with same loan product? </Text>
                    </View>
                      <View style={{marginTop:10}}>
                        {allDataobj.clientInfo[0].safcoLoanProduct.options.map((item,index) => (
                          <RadioButton
                            onPress={() => sameLoanProduct(item,index)}
                            selected={item.selected}
                            key={item.id}
                          >
                            {item.label}
                          </RadioButton>
                        ))}
                      </View>
                    </View>
                    <View style={{marginTop:10, flexDirection:'column'}}>
                    <View style={{flex:1}}>
                      <Text style={{fontSize:15, padding:10, textAlign:'justify'}}>If Answered is no above which product you recommend to designed? </Text>
                    </View>
                      <View style={{marginTop:10, flex:1, flexDirection:'row', justifyContent:'space-between'}}>
                      <FormInputs
                          text={'Product'}
                          required={false}
                          error={
                            allDataobj.clientInfo[array_index].recomendProductDesign.error
                          }
                          value={
                            allDataobj.clientInfo[array_index].recomendProductDesign.product
                          }
                          onChangeText={(value) => {
                            let get = allDataobj;
                            get.clientInfo[array_index].recomendProductDesign.product =
                              value;
                            get.clientInfo[array_index].recomendProductDesign.error = false;

                            setAlldataobj({...get});
                          }}></FormInputs>
                          <FormInputs
                          keyboardtype={'decimal-pad'}
                          text={'Loan Amount'}
                          required={false}
                          error={
                            allDataobj.clientInfo[array_index].recomendProductDesign.error
                          }
                          value={
                            allDataobj.clientInfo[array_index].recomendProductDesign.loanAmount
                          }
                          onChangeText={(value) => {
                            let get = allDataobj;
                            get.clientInfo[array_index].recomendProductDesign.loanAmount =
                              value;
                            get.clientInfo[array_index].recomendProductDesign.error = false;

                            setAlldataobj({...get});
                          }}></FormInputs>
                          
                        </View>
                        <View>
                          <FormInputs
                              text={'Terms of amount'}
                              required={false}
                              error={
                                allDataobj.clientInfo[array_index].recomendProductDesign.error
                              }
                              value={
                                allDataobj.clientInfo[array_index].recomendProductDesign.paymentTerms
                              }
                              onChangeText={(value) => {
                                let get = allDataobj;
                                get.clientInfo[array_index].recomendProductDesign.paymentTerms =
                                  value;
                                get.clientInfo[array_index].recomendProductDesign.error = false;

                                setAlldataobj({...get});
                              }}></FormInputs>
                        </View>
                    </View>
                    <View style={{marginTop:10}}>
                    <View >
                      <Text style={styles.question}>What kept you updated with COVID 19 accurate information? </Text>
                    </View>
                      <View style={{marginTop:10}}>
                        {allDataobj.clientInfo[0].whoKeptUpdateInfo.options.map((item,index) => (
                          <RadioButton
                            onPress={() => whoKeptUpdated(item,index)}
                            selected={item.selected}
                            key={item.id}
                          >
                            {item.label}
                          </RadioButton>
                        ))}
                      </View>
                    </View>
                    <View style={{marginTop:10}}>
                    <View >
                      <Text style={styles.question}>Who provided you orientation about precautions while maintianing social distance? </Text>
                    </View>
                      <View style={{marginTop:10}}>
                        {allDataobj.clientInfo[0].whoProvideSocDistance.options.map((item,index) => (
                          <RadioButton
                            onPress={() => whoProvideSocDist(item,index)}
                            selected={item.selected}
                            key={item.id}
                          >
                            {item.label}
                          </RadioButton>
                        ))}
                      </View>
                    </View>
                    <View style={{marginTop:10}}>
                    <View >
                      <Text style={styles.question}>Did you applied for loan rescheduling? </Text>
                    </View>
                      <View style={{marginTop:10}}>
                        {allDataobj.clientInfo[0].appliedForLoanResch.options.map((item,index) => (
                          <RadioButton
                            onPress={() => didYouApply(item,index)}
                            selected={item.selected}
                            key={item.id}
                          >
                            {item.label}
                          </RadioButton>
                        ))}
                      </View>
                    </View>
                    <View style={{marginTop:10}}>
                    <View >
                      <Text style={styles.question}>What made you apply for rescheduling? </Text>
                    </View>
                      <View style={{marginTop:10}}>
                        {allDataobj.clientInfo[0].applyForReschedule.options.map((item,index) => (
                          <RadioButton
                            onPress={() => whatMadeYouApply(item,index)}
                            selected={item.selected}
                            key={item.id}
                          >
                            {item.label}
                          </RadioButton>
                        ))}
                      </View>
                    </View>
                </View>
}
                {/* Section B start */}
                <Pressable style={styles.touchableHeadingCont} onPress={()=>setSectionBHide(!sectionB)}>
                <View style={styles.headerCont}>
                  <View style={styles.headingTxtCont}>
                  <TextView style={styles.headingTxt} type={'Light'} text="Section b) Client Satisfaction"></TextView>
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
                          Q 1. Did the employee MFO give you clear and sufficient information on
                          the process and the credit?
                        </Text>
                      </View>
                      <View style={{marginTop:10}}>
                        {allDataobj.clientInfo[0].employeeMfoInfo.options.map((item,index) => (
                          <RadioButton
                          onPress={() => employeeMfoInfo(item,index)}
                          selected={item.selected}
                          key={item.id}
                        >
                          {item.label}
                        </RadioButton>
                        ))}
                      </View>
                   </View>
                   <View>
                      <View>
                        <Text style={styles.question}>
                        Q 2. When the filling application form, were the explanation clear? Did it
                        take time to fill it?
                        </Text>
                      </View>
                      <View style={{marginTop:10}}>
                        {allDataobj.clientInfo[0].appExpClear.options.map((item,index) => (
                          <RadioButton
                          onPress={() => appExpClear(item,index)}
                          selected={item.selected}
                          key={item.id}
                        >
                          {item.label}
                        </RadioButton>
                        ))}
                      </View>
                   </View>
                   <View>
                      <View>
                        <Text style={styles.question}>
                        Q 3. How did you find the procedure of disbursement at the Branch?
                        </Text>
                      </View>
                      <View style={{marginTop:10}}>
                        {allDataobj.clientInfo[0].proceDisbuseAtBranch.options.map((item,index) => (
                          <RadioButton
                          onPress={() => proceDisbuseAtBranch(item,index)}
                          selected={item.selected}
                          key={item.id}
                        >
                          {item.label}
                        </RadioButton>
                        ))}
                      </View>
                   </View>
                   <View>
                      <View>
                        <Text style={styles.question}>
                        Q.4. How did you find the procedure of disbursement at the Branch? Did it take time?
                        </Text>
                      </View>
                      <View style={{marginTop:10}}>
                        {allDataobj.clientInfo[0].disburseTakeTime.options.map((item,index) => (
                          <RadioButton
                          onPress={() => disburseTakeTime(item,index)}
                          selected={item.selected}
                          key={item.id}
                        >
                          {item.label}
                        </RadioButton>
                        ))}
                      </View>
                   </View>
                   <View>
                      <View>
                        <Text style={styles.question}>
                        Q 5. How many minutes did it take to arrive to the branch?
                        </Text>
                      </View>
                      <View style={{marginTop:10}}>
                        {allDataobj.clientInfo[0].arriveTakeTime.options.map((item,index) => (
                          <RadioButton
                          onPress={() => arriveTakeTime(item,index)}
                          selected={item.selected}
                          key={item.id}
                        >
                          {item.label}
                        </RadioButton>
                        ))}
                      </View>
                   </View>
                   <View>
                      <View>
                        <Text style={styles.question}>
                        Q6. How was the reception when you entered to the branch?
                        </Text>
                      </View>
                      <View style={{marginTop:10,}}>
                        {allDataobj.clientInfo[0].branchReception.options.map((item,index) => (
                          <RadioButton
                          onPress={() => branchReception(item,index)}
                          selected={item.selected}
                          key={item.id}
                        >
                          {item.label}
                        </RadioButton>
                        ))}
                      </View>
                   </View>
                   <View>
                      <View>
                        <Text style={styles.question}>
                        Q 7.Did you wait? How long did you wait before someone/staff assisted you?
                        </Text>
                      </View>
                      <View style={{marginTop:10,}}>
                        {allDataobj.clientInfo[0].didYouWait.options.map((item,index) => (
                          <RadioButton
                          onPress={() => didYouWait(item,index)}
                          selected={item.selected}
                          key={item.id}
                        >
                          {item.label}
                        </RadioButton>
                        ))}
                      </View>
                   </View>
                   <View>
                      <View>
                        <Text style={styles.question}>
                        Q 8.Where did you repay your loan?
                        </Text>
                      </View>
                      <View style={{marginTop:10,}}>
                        {allDataobj.clientInfo[0].repayLoan.options.map((item,index) => (
                          <RadioButton
                          onPress={() => repayLoan(item,index)}
                          selected={item.selected}
                          key={item.id}
                        >
                          {item.label}
                        </RadioButton>
                        ))}
                      </View>
                   </View>

                   <View>
                      <View>
                        <Text style={styles.question}>
                        Q 9.Does the repayment outlet provide convenient opening hours to you?
                        </Text>
                      </View>
                      <View style={{marginTop:10,}}>
                        {allDataobj.clientInfo[0].provConvOpenHours.options.map((item,index) => (
                          <RadioButton
                          onPress={() => provConvOpenHours(item,index)}
                          selected={item.selected}
                          key={item.id}
                        >
                          {item.label}
                        </RadioButton>
                        ))}
                      </View>
                   </View>
                   <View>
                      <View>
                        <Text style={styles.question}>
                        Q10.Did you wait? How long did you wait before someone/staff assisted you?                      
                        </Text>
                      </View>
                      <View style={{marginTop:10,}}>
                        {allDataobj.clientInfo[0].howLongYouWait.options.map((item,index) => (
                          <RadioButton
                          onPress={() => howLongYouWait(item,index)}
                          selected={item.selected}
                          key={item.id}
                        >
                          {item.label}
                        </RadioButton>
                        ))}
                      </View>
                   </View>
                   <View>
                      <View>
                        <Text style={styles.question}>
                        Q 11.Was the repayment process quick except waiting time?
                        </Text>
                      </View>
                      <View style={{marginTop:10,}}>
                        {allDataobj.clientInfo[0].processQuickExptWaitTime.options.map((item,index) => (
                          <RadioButton
                          onPress={() => processQuickExptWaitTime(item,index)}
                          selected={item.selected}
                          key={item.id}
                        >
                          {item.label}
                        </RadioButton>
                        ))}
                      </View>
                   </View>
                   <View>
                      <View>
                        <Text style={styles.question}>
                        Q 12.Did the SAFCO staff and ADC representative serve you well there?
                        </Text>
                      </View>
                      <View style={{marginTop:10,}}>
                        {allDataobj.clientInfo[0].staffServeYouWell.options.map((item,index) => (
                          <RadioButton
                          onPress={() => staffServeYouWell(item,index)}
                          selected={item.selected}
                          key={item.id}
                        >
                          {item.label}
                        </RadioButton>
                        ))}
                      </View>
                   </View>
                   <View>
                      <View>
                        <Text style={styles.question}>
                        Q 13.How frequent does our employee (MFO) visit you?
                        </Text>
                      </View>
                      <View style={{marginTop:10,}}>
                        {allDataobj.clientInfo[0].frequentEmpVisitYou.options.map((item,index) => (
                          <RadioButton
                          onPress={() => frequentEmpVisitYou(item,index)}
                          selected={item.selected}
                          key={item.id}
                        >
                          {item.label}
                        </RadioButton>
                        ))}
                      </View>
                   </View>
                   <View>
                      <View>
                        <Text style={styles.question}>
                        Q 14.Do you face difficulty in contacting the employee (MFO) Unreachable?
                        </Text>
                      </View>
                      <View style={{marginTop:10,}}>
                        {allDataobj.clientInfo[0].contactTheEmployee.options.map((item,index) => (
                          <RadioButton
                          onPress={() => contactTheEmployee(item,index)}
                          selected={item.selected}
                          key={item.id}
                        >
                          {item.label}
                        </RadioButton>
                        ))}
                      </View>
                   </View>
                   <View>
                      <View>
                        <Text style={styles.question}>
                        Q 15.Does employee (MFO) do an effort to respond to your needs and solve your problems?
                        </Text>
                      </View>
                      <View style={{marginTop:10,}}>
                        {allDataobj.clientInfo[0].EmpDoesEffort.options.map((item,index) => (
                          <RadioButton
                          onPress={() => EmpDoesEffort(item,index)}
                          selected={item.selected}
                          key={item.id}
                        >
                          {item.label}
                        </RadioButton>
                        ))}
                      </View>
                   </View>
                   <View>
                      <View>
                        <Text style={styles.question}>
                        Q 16. To what extend are you satisfied with characteristics of your group loan?
                        </Text>
                      </View>
                      <View style={{marginTop:10,}}>
                        {allDataobj.clientInfo[0].youSatisfiedWithLoan.options.map((item,index) => (
                          <RadioButton
                          onPress={() => youSatisfiedWithLoan(item,index)}
                          selected={item.selected}
                          key={item.id}
                        >
                          {item.label}
                        </RadioButton>
                        ))}
                      </View>
                   </View>
                   <View>
                      <View>
                        <Text style={styles.question}>
                        Q 17.For group loan only: what are the reasons of satisfaction and dissatisfaction?
                        </Text>
                      </View>
                      <View style={{marginTop:10,}}>
                        {allDataobj.clientInfo[0].reasonsOfSatisfaction.options.map((item,index) => (
                          <RadioButton
                          onPress={() => reasonsOfSatisfaction(item,index)}
                          selected={item.selected}
                          key={item.id}
                        >
                          {item.label}
                        </RadioButton>
                        ))}
                      </View>
                   </View>
                   <View>
                      <View>
                        <Text style={styles.question}>
                        Q 18.To what extend are you satisfied with characteristics of your credit? Does it serve your needs?
                        </Text>
                      </View>
                      <View style={{marginTop:10,}}>
                        {allDataobj.clientInfo[0].characOfCredit.options.map((item,index) => (
                          <RadioButton
                          onPress={() => characOfCredit(item,index)}
                          selected={item.selected}
                          key={item.id}
                        >
                          {item.label}
                        </RadioButton>
                        ))}
                      </View>
                   </View>
                   <View>
                      <View>
                        <Text style={styles.question}>
                        Q 19.Are you dealing with or thinking of dealing with another financial institution?
                        </Text>
                      </View>
                      <View style={{marginTop:10,}}>
                        {allDataobj.clientInfo[0].dealingFinancialInstitute.options.map((item,index) => (
                          <RadioButton
                          onPress={() => dealingFinancialInstitute(item,index)}
                          selected={item.selected}
                          key={item.id}
                        >
                          {item.label}
                        </RadioButton>
                        ))}
                      </View>
                   </View>
                   <View>
                      <View>
                        <Text style={styles.question}>
                        For what reasons
                        </Text>
                      </View>
                      <View style={{marginTop:10,}}>
                        {allDataobj.clientInfo[0].forWhatReason.options.map((item,index) => (
                          <RadioButton
                          onPress={() => forWhatReason(item,index)}
                          selected={item.selected}
                          key={item.id}
                        >
                          {item.label}
                        </RadioButton>
                        ))}
                      </View>
                   </View>
                   <View>
                      <View>
                        <Text style={styles.question}>
                        Q 20.Do our existing loan products meets your need?
                        </Text>
                      </View>
                      <View style={{marginTop:10,}}>
                        {allDataobj.clientInfo[0].productMeetYourNeed.options.map((item,index) => (
                          <RadioButton
                          onPress={() => productMeetYourNeed(item,index)}
                          selected={item.selected}
                          key={item.id}
                        >
                          {item.label}
                        </RadioButton>
                        ))}
                      </View>
                   </View>
                   <View>
                      <View>
                        <Text style={styles.question}>
                        If No then what reasons?
                        </Text>
                      </View>
                      <View style={{marginTop:10,}}>
                        {allDataobj.clientInfo[0].ifNoReason.options.map((item,index) => (
                          <RadioButton
                          onPress={() => ifNoReason(item,index)}
                          selected={item.selected}
                          key={item.id}
                        >
                          {item.label}
                        </RadioButton>
                        ))}
                      </View>
                      <FormInputs
                        text={'Any Other'}
                        required={false}
                        error={
                          allDataobj.clientInfo[array_index].ifNoReason.anyOther.error
                        }
                        value={
                          allDataobj.clientInfo[array_index].ifNoReason.anyOther.value
                        }
                        onChangeText={(value) => {
                          let get = allDataobj;
                          get.clientInfo[array_index].ifNoReason.anyOther.value =
                            value;
                          get.clientInfo[array_index].ifNoReason.anyOther.error = false;

                          setAlldataobj({...get});
                        }}></FormInputs>
                   </View>
                   <View>
                      <View>
                        <Text style={styles.question}>
                        Q 21 Are you interested to borrow our House Finance Loan from Safco?
                        </Text>
                      </View>
                      <View style={{marginTop:10,}}>
                        {allDataobj.clientInfo[0].houseFinanceLoan.options.map((item,index) => (
                          <RadioButton
                          onPress={() => houseFinanceLoan(item,index)}
                          selected={item.selected}
                          key={item.id}
                        >
                          {item.label}
                        </RadioButton>
                        ))}
                      </View>
                   </View>
                   <View>
                      <View>
                        <Text style={styles.question}>
                        If Yes,then for what purpose?
                        </Text>
                      </View>
                      <View style={{marginTop:10,}}>
                        {allDataobj.clientInfo[0].ifYesPurpose.options.map((item,index) => (
                          <RadioButton
                          onPress={() => ifYesPurpose(item,index)}
                          selected={item.selected}
                          key={item.id}
                        >
                          {item.label}
                        </RadioButton>
                        ))}
                      </View>
                   </View>
                   <View>
                      <View>
                        <Text style={styles.question}>
                        For Construction of new house,what would be your preference for loan from Safco?
                        </Text>
                      </View>
                      <View style={{marginTop:10,}}>
                        {allDataobj.clientInfo[0].forConstructNewHouse.options.map((item,index) => (
                          <RadioButton
                          onPress={() => forConstructNewHouse(item,index)}
                          selected={item.selected}
                          key={item.id}
                        >
                          {item.label}
                        </RadioButton>
                        ))}
                      </View>
                   </View>
                   <View>
                      <View>
                        <Text style={styles.question}>
                        Q 22.Are you interested to borrow out Auto Finance Loan i,e. for Motor Cycle, Rickshaw, Qingqi or Loader?
                        </Text>
                      </View>
                      <View style={{marginTop:10,}}>
                        {allDataobj.clientInfo[0].autoFinanceLoan.options.map((item,index) => (
                          <RadioButton
                          onPress={() => autoFinanceLoan(item,index)}
                          selected={item.selected}
                          key={item.id}
                        >
                          {item.label}
                        </RadioButton>
                        ))}
                      </View>
                   </View>
                   <View>
                      <View>
                        <Text style={styles.question}>
                        If Yes,then which vehicle you want to purchase from Safco?
                        </Text>
                      </View>
                      <View style={{marginTop:10,}}>
                        {allDataobj.clientInfo[0].whichVehcleWantPurchase.options.map((item,index) => (
                          <RadioButton
                          onPress={() => whichVehcleWantPurchase(item,index)}
                          selected={item.selected}
                          key={item.id}
                        >
                          {item.label}
                        </RadioButton>
                        ))}
                      </View>
                   </View>
                   <View>
                      <View>
                        <Text style={styles.question}>
                        Which mode of finance do you prefer?
                        </Text>
                      </View>
                      <View style={{marginTop:10,}}>
                        {allDataobj.clientInfo[0].modeOfFinance.options.map((item,index) => (
                          <RadioButton
                          onPress={() => modeOfFinance(item,index)}
                          selected={item.selected}
                          key={item.id}
                        >
                          {item.label}
                        </RadioButton>
                        ))}
                      </View>
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
});

export default ClientSurveyForm;