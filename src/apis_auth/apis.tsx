import React from 'react';
import {baseUrl, baseUrlLiveold, baseUrlTemp, cibb_url, temp} from './baseUrl';
import {Alert} from 'react-native';
import axios from 'axios';
import {openDatabase} from 'react-native-sqlite-storage';
var db = openDatabase({name: 'safcoapp.db'});
import NetInfo from '@react-native-community/netinfo';
import {connect, useSelector} from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  insertAllArray,
  insertEmployee,
  insertEmployeesRegion,
  insertForbiddenPerson,
  insertJobs,
  insertLoanType,
  insertQuestions,
  insertStation,
  insertTopUpLoanTypes,
  DeleteGroupsForms,
} from '../sqlite/sqlitedb';
import {JOBTypes} from '../utilis/RequiredArrays';
import moment from 'moment';
const {FingerModule} = NativeModules;
import {NativeModules} from 'react-native';
import {ApplicationVersion, releaseDate} from '.././utilis/ContsValues';
import deleteRow from '../screens/BottomTabs/LoanVerficationGroup';

// const [UserData, setUserData] = React.useState(undefined);
export const onSignIn = async (
  username: string,
  password: string,
  deviceId: string,
  deviceName: string,
  setUserData: (arg0: undefined) => void,
) => {
  const promise = new Promise(async (resolve, reject) => {
    try {
      //do something and return result on success
      var user = undefined;
      NetInfo.fetch().then(state => {
        //console.log('Connection type', state.type);
        //console.log('Is connected?', state.isConnected);
        if (!state.isConnected) {
          reject('Please Check your internet');
          // alert('Please Check your internet');
          return;
        }
        //console.log('---ALL', state);
      });
      var FormData = require('form-data');
      var data = new FormData();
      data.append('Username', username);
      data.append('Password', password);
      // Support both promise-like deviceId objects and plain strings
      // @ts-ignore
      const resolvedDeviceId = (deviceId as any)?. _W ?? deviceId;
      data.append('deviceId', resolvedDeviceId);
      data.append('deviceName', deviceName);
      data.append('Version', ApplicationVersion);
      console.log('Login API-=-=>>' + JSON.stringify(data));
      // return
      var config: any = {
        method: 'post',
        url: baseUrl + 'tabletlogin.php',
        // timeout: 1000,
        headers: {
          Cookie: 'PHPSESSID=m6fi48kv4ongd6lbvh694e7ju9',
        },
        data: data,
      };

      axios(config)
        .then(function (response) {
          console.log(JSON.stringify("User MIS my===>", response.data));
          if (response.data === 'no Data Found') {
            alert('Sorry!! Invalid Details');
            setUserData(undefined);
            reject('invalid');
            return 'Sorry!! Invalid Details';
          } else {
            setUserData(response.data);
            user = {...response.data};
            AsyncStorage.setItem('@userData', JSON.stringify(response.data));
            console.log(JSON.stringify(response.data.StatusCode));
            if (response.data.StatusCode == 201  || response.data.StatusCode == 403) {
              Alert.alert('  ' + JSON.stringify(response.data.message));
            } else {
              console.log('ok ok ok ok =br=======>>', response.data);
              resolve(user);
            }
            // navigation.replace('Drawer');
          }
        })
        .catch(function (error) {
          //console.log(error);
          reject(error);
        });
    } catch (msg) {
      reject(msg);
    }
  });
  return promise;
};
const recuriveQuestion = (couter: number, array: {[x: string]: any}) => {
  var item = array[couter];
  //console.log('Questionnaire-->', item.QuestionnaireId);
  //console.log('Questionnaire-->', item.Question);
  //console.log('Questionnaire-->', item.AnswerType);
  insertQuestions(
    item.QuestionnaireId,
    '' + item.Question,
    '' + item.AnswerType,
    item.Answer1 == null ? '' : item.Answer1,
    item.Answer2 == null ? '' : item.Answer2,
    item.Answer3 == null ? '' : item.Answer3,
    item.Answer4 == null ? '' : item.Answer4,
    item.Answer5 == null ? '' : item.Answer5,
    item.Answer6 == null ? '' : item.Answer6,
    item.Answer7 == null ? '' : item.Answer7,
    item.Answer8 == null ? '' : item.Answer8,
    item.Answer9 == null ? '' : item.Answer9,
    item.Answer10 == null ? '' : item.Answer10,
  );
  if (couter === 0) {
    return;
  }
  recuriveQuestion(couter - 1, array);
};
const recuriveJob = (couter: number, array: {[x: string]: any}) => {
  var item = array[couter];
  //console.log('jobsss-->', item.JobId);
  //console.log('jobsss-->', item.JobTypeId);
  //console.log('jobsss-->', item.JobTitle);
  insertJobs('' + item.JobId, '' + item.JobTypeId, '' + item.JobTitle);
  if (couter === 0) {
    return;
  }
  recuriveJob(couter - 1, array);
};
const recuriveStations = (couter: number, array: {[x: string]: any}) => {
  var item = array[couter];
  //console.log('station-->', item.StationId);
  //console.log('station length-->', array.length);
  //console.log('station-->', item.StationName);
  insertStation('' + item.StationId, '' + item.StationName);
  if (couter === 0) {
    return;
  }
  recuriveStations(couter - 1, array);
};
const recuriveLoanTypes = (couter: number, array: {[x: string]: any}) => {
  var item = array[couter];
  //console.log('Loan-->', item.LoanTypeId);
  //console.log('Loan length-->', array.length);
  //console.log('Loan-->', item.StationName);
  insertLoanType(
    '' + item.LoanTypeId,
    '' + item.LoanParentId,
    '' + item.LoanTypeName,
  );
  if (couter === 0) {
    return;
  }
  recuriveLoanTypes(couter - 1, array);
};
const recuriveEmployees = (couter: number, array: {[x: string]: any}) => {
  var bigqery = '';
  var parameters = [];
  var item = array[couter];
  // insertEmployee("1","1","1","wow")
  //console.log('Employee-->', item.EmployeeId);
  //console.log('Employee length-->', item.StationId);
  //console.log('Employee length-->', item.EmployeeTypeId);
  //console.log('Employee-->', item.StaffName);
  db.transaction(
    (tx: {
      executeSql: (
        arg0: string,
        arg1: any[],
        arg2: (tx: any, results: any) => void,
      ) => void;
    }) => {
      tx.executeSql(
        'SELECT EmployeeId FROM staff_namesList where EmployeeId = ?',
        [item.EmployeeId],
        (tx: any, results: {rows: string | any[]}) => {
          var len = results.rows.length;
          if (len > 0) {
            //console.log('db already');
          } else {
            bigqery += '(?,?,?,?)';
            parameters.push(
              item.StationId,
              item.EmployeeId,
              item.EmployeeTypeId,
              item.StaffName,
            );
          }
        },
      );
    },
  );
  // insertEmployee(""+item.EmployeeId,""+item.StationId,""+item.EmployeeTypeId,""+item.StaffName)
  if (couter === 0) {
    db.transaction(
      (txxx: {executeSql: (arg0: string, arg1: never[]) => void}) => {
        txxx.executeSql(
          'insert into staff_namesList (StationId,EmployeeId,EmployeeTypeId,StaffName)  VALUES ' +
            bigqery +
            ';',
          parameters,
        );
      },
      (t: any, error: any) => {
        //console.log('db error Employees');
        //console.log(error);
      },
      (t: any, success: any) => {
        //console.log('db sucess');
      },
    );
    return;
  }
  bigqery += ',';
  recuriveEmployees(couter - 1, array);
};
export const SyncDown = (
  mobileToken: string,
  StationId,
  setProgressVisible: (arg0: boolean) => void,
) => {
  const promis = new Promise<void>((resolve, reject) => {
    NetInfo.fetch().then(state => {
      // console.log('Connection type', state);
      //console.log('Is connected?', state.isConnected);
      if (!state.isConnected) {
        Alert.alert('Please Check your internet', 'Try Again!', [
          {text: 'ok', onPress: () => {}},
        ]);
        reject();
        return;
      }
      setProgressVisible(true);
      var FormData = require('form-data');
      var data = new FormData();
      data.append('MobileToken', mobileToken);
      data.append('StationId', StationId);

      var config: any = {
        method: 'post',
        // timeout: 3000,
        url: baseUrl + 'getData.php',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          Cookie: 'PHPSESSID=aqgg18sb6mta5s37ifp0fvq4g6',
        },
        data: data,
      };

      axios(config)
        .then(async function (response) {
          // console.log("DonorDetails=====>",response.data.DonorDetails)

          let questions = response.data.Questionaire;
          let jobs = response.data.Jobs;
          let LoanTypes = response.data.LoanTypes;
          // let Station = response.data.Station;
          let Employees = response.data.Employees;
          let EmployeesRegion = response.data.EmployeesRegion;
          let ForbiddenPerson = response.data.ForbiddenPerson;
          let TopUpTypes = response.data.TopUpTypes;
          let OrganizationRegion = response.data.OrganizationRegion;
          let LoanCalculatorProducts = response.data.LoanCalculatorProducts;
          let AutofinanceCalculatorProducts =
            response.data.AutofinanceCalculatorProducts;
          let DonorDetails = response.data.DonorDetails;
          //console.log("---->", response.data.Station)
          try {
            insertAllArray(
              // JSON.stringify(Station),
              '',
              JSON.stringify(jobs),
              JSON.stringify(LoanTypes),
              JSON.stringify(questions),
              JSON.stringify(Employees),
              JSON.stringify(EmployeesRegion),
              JSON.stringify(ForbiddenPerson),
              JSON.stringify(TopUpTypes),
              JSON.stringify(OrganizationRegion),
              JSON.stringify(LoanCalculatorProducts),
              JSON.stringify(AutofinanceCalculatorProducts),
              JSON.stringify(DonorDetails),
              setProgressVisible,
            );

            let filedata = [];
            let stationId = [];
            let empRegions = [];
            let TopupLoanType = [];
            let filedata2 = [];
            let answers = [];

            // Station.map(async (item) => {
            //   if (item.StationName != "Head Office") {
            //     filedata.push({ label: item.StationName, value: item.StationName, id: item.StationId });
            //     stationId.push({ id: item.StationId })
            //   }
            // })
            // EmployeesRegion.map(async (item) => {
            //   empRegions.push(item.RegionName)
            // })
            TopUpTypes.map(
              async (item: {
                TopupLoanType: any;
                TopupLoanTypeAmount: any;
                TopupTypeId: any;
              }) => {
                TopupLoanType.push({
                  name: item.TopupLoanType,
                  value: item.TopupLoanTypeAmount,
                  id: item.TopupTypeId,
                });
              },
            );

            questions.map(
              (item: {
                QuestionnaireId: number;
                Answer1: null;
                Answer2: null;
                Answer3: null;
                Answer4: null;
                Answer5: null;
                Answer6: null;
                Answer7: null;
                Answer8: null;
                Answer9: null;
                Answer10: null;
                Question: any;
                AnswerType: any;
              }) => {
                if (item.QuestionnaireId == 1) {
                  var temp = [
                    '1. 1',
                    '2. 2',
                    '3. 3',
                    '4. 4',
                    '5. 5',
                    '6. 6',
                    '7. 7',
                    '8. 8',
                    '9. 9',
                    '10. 10',
                    '11. 11',
                    '12. 12',
                    '13. 13',
                    '14. 14',
                    '15. 15',
                    '16. 16',
                    '17. 17',
                    '18. 18',
                    '19. 19',
                    '20. 20',
                  ];
                  answers = [...temp];
                } else {
                  if (item.Answer1 != null) {
                    answers.push(item.Answer1);
                  }
                  if (item.Answer2 != null) {
                    answers.push(item.Answer2);
                  }
                  if (item.Answer3 != null) {
                    answers.push(item.Answer3);
                  }
                  if (item.Answer4 != null) {
                    answers.push(item.Answer4);
                  }
                  if (item.Answer5 != null) {
                    answers.push(item.Answer5);
                  }
                  if (item.Answer6 != null) {
                    answers.push(item.Answer6);
                  }
                  if (item.Answer7 != null) {
                    answers.push(item.Answer7);
                  }
                  if (item.Answer8 != null) {
                    answers.push(item.Answer8);
                  }
                  if (item.Answer9 != null) {
                    answers.push(item.Answer9);
                  }
                  if (item.Answer10 != null) {
                    answers.push(item.Answer10);
                  }
                }

                filedata2.push({
                  QuestionnaireId: item.QuestionnaireId,
                  Question: item.Question,
                  AnswerType: item.AnswerType,
                  AnswersList: answers,
                });
                answers = [];
              },
            );

            var obj: any = {
              filedata: filedata,
              stationId: stationId,
              EmployeesRegion: EmployeesRegion,
              TopUpTypes: TopupLoanType,
              Questions: filedata2,
            };
            resolve(obj);
          } catch (e) {
            //console.log(e);
            setProgressVisible(false);
            Alert.alert('Please Check your internet', 'Try Again! \n ' + e, [
              {text: 'ok', onPress: () => {}},
            ]);
            reject();
          }
          // insertEmployee("1","1","1","wow")
          // recuriveEmployees(Employees.length-1,Employees)
          // recuriveJob(jobs.length-1,jobs)
          // recuriveQuestion(questions.length-1,questions)
          // recuriveStations(Station.length-1,Station)
          // recuriveLoanTypes(LoanTypes.length-1,LoanTypes)

          // jobs.map((item)=>{
          //   insertJobs(item.JobId,item.JobTypeId,item.JobTitle).then((res)=>{
          //     //console.log("job"+JSON.stringify(res))
          //     promisess.push(res)}).catch((err)=>{promisess.push(err)})
          // })
          // LoanTypes.map((item)=>{
          //   insertLoanType(item.LoanTypeId,item.LoanParentId,""+item.LoanTypeName).then((res)=>{
          //     //console.log("loantypes"+JSON.stringify(res))
          //     promisess.push(res)}).catch((err)=>{promisess.push(err)})
          // })
          // Station.map((item)=>{
          //   insertStation(item.StationId,item.StationName).then((res)=>{
          //     //console.log("Station"+JSON.stringify(res))
          //     promisess.push(res)}).catch((err)=>{promisess.push(err)})
          // })

          // Employees.map((item)=>{
          //   insertEmployee(""+item.EmployeeId,""+item.StationId,""+item.EmployeeTypeId,""+item.StaffName).then((res)=>{
          //     //console.log("Employee"+JSON.stringify(res))
          //     promisess.push(res)}).catch((err)=>{promisess.push(err)})
          // })
          // EmployeesRegion.map((item)=>{
          //   insertEmployeesRegion(""+item.EmployeeRegionId,""+item.StationId,""+item.EmployeeId,""+item.RegionId,""+item.RegionName).then((res)=>{
          //     //console.log("EmployeesRegion"+JSON.stringify(res))
          //     promisess.push(res)}).catch((err)=>{promisess.push(err)})
          // })
          // ForbiddenPerson.map((item)=>{
          //   insertForbiddenPerson(""+item.Name,""+item.CNIC).then((res)=>{
          //     //console.log("ForbiddenPerson"+JSON.stringify(res))
          //     promisess.push(res)}).catch((err)=>{promisess.push(err)})
          // })
          // TopUpTypes.map((item)=>{
          //   insertTopUpLoanTypes(item.TopupTypeId,""+item.TopupLoanType,""+item.TopupLoanTypeAmount).then((res)=>{
          //     //console.log("TopUpLoanTypes"+JSON.stringify(res))
          //     promisess.push(res)}).catch((err)=>{promisess.push(err)})
          // })
          // questions.map((item,index)=>{
          //   insertQuestions(item.QuestionnaireId,""+item.Question,""+item.AnswerType,
          //   item.Answer1==null?"":item.Answer1,
          //   item.Answer2==null?"":item.Answer2,
          //   item.Answer3==null?"":item.Answer3,
          //   item.Answer4==null?"":item.Answer4,
          //   item.Answer5==null?"":item.Answer5,
          //   item.Answer6==null?"":item.Answer6,
          //   item.Answer7==null?"":item.Answer7,
          //   item.Answer8==null?"":item.Answer8,
          //   item.Answer9==null?"":item.Answer9,
          //   item.Answer10==null?"":item.Answer10
          //   ).then((res)=>{
          //     //console.log("ques"+JSON.stringify(res))
          //     promisess.push(res
          //   )}).catch((err)=>{promisess.push(err)})

          // })
          // jobs.map((item)=>{
          //   insertJobs(item.JobId,item.JobTypeId,item.JobTitle).then((res)=>{
          //     //console.log("job"+JSON.stringify(res))
          //     promisess.push(res)}).catch((err)=>{promisess.push(err)})
          // })
          // LoanTypes.map((item)=>{
          //   insertLoanType(item.LoanTypeId,item.LoanParentId,""+item.LoanTypeName).then((res)=>{
          //     //console.log("loantypes"+JSON.stringify(res))
          //     promisess.push(res)}).catch((err)=>{promisess.push(err)})
          // })
          // Station.map((item)=>{
          //   insertStation(item.StationId,item.StationName).then((res)=>{
          //     //console.log("Station"+JSON.stringify(res))
          //     promisess.push(res)}).catch((err)=>{promisess.push(err)})
          // })
          // let a = promisess.map(async (e, i) => {
          //   const resolved = await Promise.all(promisess[i].flat());
          //   return resolved;
          // });
          // await Promise.all(a);
          // if (a.includes(false)) {
          //   alert('Some Thing Went Wrong,Please Check You Network and Try again');
          //     setProgressVisible(false)
          // } else {
          //     setProgressVisible(false)
          //     alert("Successfully Syncdown");

          // }
        })
        .catch(function (error) {
          //console.log(error);
          setProgressVisible(false);
          Alert.alert('Please Check your internet', 'Try Again! \n' + error, [
            {text: 'ok', onPress: () => {}},
          ]);
          reject();
        });
    });
  });
  return promis;
};
export const CallforTags = (
  station_id: any,
  setProgressVisible: {
    (value: React.SetStateAction<boolean>): void;
    (value: React.SetStateAction<boolean>): void;
    (value: React.SetStateAction<boolean>): void;
    (value: React.SetStateAction<boolean>): void;
    (arg0: boolean): void;
  },
) => {
  const promise = new Promise((resolve, reject) => {
    NetInfo.fetch()
      .then(state => {
        //console.log('Connection type', state.type);
        //console.log('Is connected?', state.isConnected);
        if (!state.isConnected) {
          Alert.alert('Please Check your internet', 'Try Again!', [
            {text: 'ok', onPress: () => {}},
          ]);
          reject();
          return;
        }
        if (station_id == undefined) {
          resolve(true);
          return;
        }
        //console.log('---ALL', state);
        setProgressVisible(true);
        var config: any = {
          method: 'get',
          url: baseUrl + 'get_assets_tags.php?StationId=' + station_id,
          headers: {},
        };

        axios(config)
          .then(async function (response) {
            //   insertLoanType("1","1","1")
            //   insertStation("1","2")
            // insertEmployee("1","1","1","wow")
            //   insertEmployeesRegion("1","1","!","!","item.RegionName")
            //   insertForbiddenPerson("+item.Name","item.CNIC")
            //   insertTopUpLoanTypes("1","item.TopupLoanType","item.TopupLoanTypeAmount")
            //   setProgressVisible(false)
            // return

            if (response.data.AssetsTags == null) {
              resolve(null);
            } else {
              let questions = response.data.AssetsTags[0].StationTags;
              resolve(questions);
            }
            // let questions = response.data.AssetsTags[0].StationTags;
            // resolve(questions);
          })
          .catch(e => {
            //console.log(e);
            setProgressVisible(false);
            Alert.alert(
              'Please Check your internet',
              'Syncdown Failed! Try Again! \n' + e,
              [{text: 'ok', onPress: () => {}}],
            );
            reject();
          });
      })
      .catch(function (error) {
        //console.log(error);
        setProgressVisible(false);
        Alert.alert(
          'Please Check your internet',
          'Syncdown Failed! Try Again! \n' + error,
          [{text: 'ok', onPress: () => {}}],
        );
        reject();
      });
  });
  return promise;
};
export const CheckingTags = (
  item: never[],
  setProgressVisible: {
    (value: React.SetStateAction<boolean>): void;
    (value: React.SetStateAction<boolean>): void;
    (arg0: boolean): void;
  },
) => {
  const promise = new Promise((resolve, reject) => {
    NetInfo.fetch()
      .then(state => {
        console.log('Connection type', state.type);
        console.log('Is connected?', state.isConnected);
        if (!state.isConnected) {
          Alert.alert('Please Check your internet', 'Try Again!', [
            {text: 'ok', onPress: () => {}},
          ]);
          reject();
          return;
        }
        // console.log('---ALL', state);
        setProgressVisible(true);
        //console.log('---ALL', item);
        var data = new FormData();
        data.append('AssetTags', JSON.stringify(item));
        var config: any = {
          method: 'post',
          url: baseUrl + 'check_asset_tag.php',
          headers: {
            Cookie: 'PHPSESSID=3fk5416nqaq5k85ltdjb0no4s5',
          },
          data: data,
        };

        axios(config)
          .then(async function (response) {
            // console.log("Tags=======respose>", response.data)
            if (response) {
              if (response.data) {
                resolve(response.data.data);
              } else {
                //console.log("---response of getting tags>", "something went wrong with getting tags")
              }
            } else {
              //console.log("---response of getting tags>", "something went wrong with getting tags")
            }
            resolve(response.data.data);
            setProgressVisible(false);
          })
          .catch(e => {
            //console.log(e);
            setProgressVisible(false);
            Alert.alert(
              'Please Check your internet',
              'Syncdown Failed! Try Again! \n' + e,
              [{text: 'ok', onPress: () => {}}],
            );
            reject();
          });
      })
      .catch(function (error) {
        //console.log(error);
        setProgressVisible(false);
        Alert.alert(
          'Please Check your internet',
          'Syncdown Failed! Try Again! \n' + error,
          [{text: 'ok', onPress: () => {}}],
        );
        reject();
      });
  });
  return promise;
};
export const uploadingDocs = (
  item: any,
  count: string | number,
  setProgressVisible: {
    (value: React.SetStateAction<boolean>): void;
    (arg0: boolean): void;
  },
) => {
  const promise = new Promise((resolve, reject) => {
    NetInfo.fetch()
      .then(state => {
        //console.log('Connection type', state.type);
        //console.log('Is connected?', state.isConnected);
        if (!state.isConnected) {
          Alert.alert('Please Check your internet', 'Try Again!', [
            {text: 'ok', onPress: () => {}},
          ]);
          reject();
          setProgressVisible(false);
          return;
        }
        // //console.log('---ALL', item);
        setProgressVisible(true);
        // //console.log('---ALL', item);
        var data = new FormData();

        // console.log('document_count----->>>', "" + count)
        // console.log('document_data------>>>', JSON.stringify(item))

        data.append('document_count', '' + count);
        data.append('document_data', JSON.stringify(item));

        var config: any = {
          method: 'post',
          url: baseUrl + 'ImageSyncDown.php',
          headers: {
            Cookie: 'PHPSESSID=3fk5416nqaq5k85ltdjb0no4s5',
          },
          data: data,
        };

        axios(config)
          .then(async function (response) {
            // console.log('============= response ==================');
            // console.log('==> ', response.data);
            // console.log('============= response ===================');
            resolve(JSON.stringify(response.data));
            // setProgressVisible(false)
          })
          .catch(e => {
            console.log(e);
            setProgressVisible(false);
            Alert.alert(
              'Please Check your internet',
              'Syncdown Failed! Try Again! \n' + e,
              [{text: 'ok', onPress: () => {}}],
            );
            reject();
          });
      })
      .catch(function (error) {
        //console.log(error);
        setProgressVisible(false);
        Alert.alert(
          'Please Check your internet',
          'Syncdown Failed! Try Again! \n' + error,
          [{text: 'ok', onPress: () => {}}],
        );
        reject();
      });
  });
  return promise;
};
export const uploadingAssetsImage = (
  item: any,
  count: string,
  setProgressVisible: {
    (value: React.SetStateAction<boolean>): void;
    (arg0: boolean): void;
  },
) => {
  const promise = new Promise((resolve, reject) => {
    NetInfo.fetch()
      .then(state => {
        //console.log('Connection type', state.type);
        //console.log('Is connected?', state.isConnected);
        if (!state.isConnected) {
          Alert.alert('Please Check your internet', ' Try Again!', [
            {text: 'ok', onPress: () => {}},
          ]);
          reject();
          return;
        }
        // //console.log('---ALL', item);
        setProgressVisible(true);
        // //console.log('---ALL', item);

        var data = new FormData();
        data.append('document_count', '' + count);
        data.append('document_data', JSON.stringify(item));

        var config: any = {
          method: 'post',
          url: baseUrl + 'AssetImageSyncDown.php',
          headers: {
            Cookie: 'PHPSESSID=3fk5416nqaq5k85ltdjb0no4s5',
          },
          data: data,
        };

        axios(config)
          .then(async function (response) {
            resolve(JSON.stringify(response.data));
            // setProgressVisible(false)
          })
          .catch(e => {
            //console.log(e);
            setProgressVisible(false);
            Alert.alert(
              'Please Check your internet',
              'Syncdown Failed! Try Again! \n' + e,
              [{text: 'ok', onPress: () => {}}],
            );
            reject();
          });
      })
      .catch(function (error) {
        //console.log(error);
        setProgressVisible(false);
        Alert.alert(
          'Please Check your internet',
          'Syncdown Failed! Try Again! \n' + error,
          [{text: 'ok', onPress: () => {}}],
        );
        reject();
      });
  });
  return promise;
};

//syncdownbyVOofficer
export const uploadingCustomerdata = (
  item: any,
  setProgressVisible: {
    (value: React.SetStateAction<boolean>): void;
    (arg0: boolean): void;
  },
) => {
  const promise = new Promise((resolve, reject) => {
    NetInfo.fetch()
      .then(state => {
        //console.log('Connection type', state.type);
        //console.log('Is connected?', state.isConnected);
        if (!state.isConnected) {
          Alert.alert('Please Check your internet', ' Try Again!', [
            {text: 'ok', onPress: () => {}},
          ]);
          reject();
          return;
        }
        // //console.log('---ALL', item);
        setProgressVisible(true);
        //console.log('---ALL', item);
        // console.log('========---->', JSON.stringify(item));
        // return
        var data = new FormData();

        console.log('group_data-----vo------->', JSON.stringify(item));
        data.append('group_data', JSON.stringify(item));
        var config: any = {
          method: 'post',
          url: baseUrl + 'syncdown.php',
          headers: {
            Cookie: 'PHPSESSID=3fk5416nqaq5k85ltdjb0no4s5',
          },
          data: data,
        };
        //console.log("----dataa---->",JSON.stringify( data))
        axios(config)
          .then(async function (response) {
            resolve(response.data);
            console.log('Employee data===>', response.data);
            setProgressVisible(false);
          })
          .catch(e => {
            console.log('Employe ==>', e);
            setProgressVisible(false);
            Alert.alert(
              'Please Check your internet',
              'Syncdown Failed! Try Again! \n' + e,
              [{text: 'ok', onPress: () => {}}],
            );

            reject();
          });
      })
      .catch(function (error) {
        //console.log(error);
        setProgressVisible(false);
        Alert.alert(
          'Please Check your internet',
          'Syncdown Failed! Try Again! \n' + error,
          [{text: 'ok', onPress: () => {}}],
        );

        reject();
      });
  });
  return promise;
};

export const RejectuploadingCustomerdata = (group_id, comment) => {
  console.log('==<<<<<>', comment);
  const promise = new Promise((resolve, reject) => {
    NetInfo.fetch()
      .then(async state => {
        if (!state.isConnected) {
          Alert.alert('Please Check your internet', ' Try Again!', [
            {text: 'ok', onPress: () => {}},
          ]);
          reject();
          return;
        }
        var data = new FormData();
        data.append('GroupId', group_id);
        data.append('RejectComment', comment);

        // Append reject metadata from logged-in user if available
        try {
          const stored = await AsyncStorage.getItem('@userData');
          if (stored) {
            const user = JSON.parse(stored);
            if (user && user.EmployeeId) {
              data.append('RejectedById', '' + user.EmployeeId);
            }
            if (user && user.EmployeeTypeId) {
              data.append('RejectedByTypeId', '' + user.EmployeeTypeId);
            }
          }
        } catch (e) {
          // proceed without reject metadata if storage fails
        }

        var config: any = {
          method: 'post',
          url: baseUrl + 'cancelledLoanByBm.php',
          headers: {
            Cookie: 'PHPSESSID=3fk5416nqaq5k85ltdjb0no4s5',
          },
          data: data,
        };
         console.log("===datattaattatata my code---->",JSON.stringify( data))
        axios(config)
          .then(async function (response) {
            // console.log("Employee data founddd===>",JSON.stringify(response.data));

            // if(response.data.StatusCode == 200){
            //   // DeleteGroupsForms(response.data.GroupId)
            //   deleteRow()
            //   alert("Group has been Rejected Successfully")
            // }else{
            //   alert("Network error")
            // }
            resolve(response);
          })
          .catch(e => {
            console.log('Employe ==>', e);

            Alert.alert(
              'Please Check your internet',
              'Syncdown Failed! Try Again! \n' + e,
              [{text: 'ok', onPress: () => {}}],
            );

            reject();
          });
      })
      .catch(function (error) {
        //console.log(error);
        setProgressVisible(false);
        Alert.alert(
          'Please Check your internet',
          'Syncdown Failed! Try Again! \n' + error,
          [{text: 'ok', onPress: () => {}}],
        );

        reject();
      });
  });
  return promise;
};

// RM/ZM group rejection
export const RejectuploadingCustomerdataRMZM = (group_id, comment) => {
  const promise = new Promise((resolve, reject) => {
    NetInfo.fetch()
      .then(async state => {
        if (!state.isConnected) {
          Alert.alert('Please Check your internet', ' Try Again!', [
            {text: 'ok', onPress: () => {}},
          ]);
          reject();
          return;
        }
        var data = new FormData();
        data.append('GroupId', group_id);
        data.append('RejectComment', comment);

        try {
          const stored = await AsyncStorage.getItem('@userData');
          if (stored) {
            const user = JSON.parse(stored);
            if (user && user.EmployeeId) {
              data.append('RejectedById', '' + user.EmployeeId);
            }
            if (user && user.EmployeeTypeId) {
              data.append('RejectedByTypeId', '' + user.EmployeeTypeId);
            }
          }
        } catch (e) {}

        var config: any = {
          method: 'post',
          url: baseUrl + 'cancelledLoanRMZM.php',
          headers: {
            Cookie: 'PHPSESSID=3fk5416nqaq5k85ltdjb0no4s5',
          },
          data: data,
        };
        console.log("===datattaattatata my code-RM ZM--->",JSON.stringify( data))
        axios(config)
          .then(async function (response) {
            resolve(response);
          })
          .catch(e => {
            Alert.alert(
              'Please Check your internet',
              'Syncdown Failed! Try Again! \n' + e,
              [{text: 'ok', onPress: () => {}}],
            );
            reject();
          });
      })
      .catch(function (error) {
        Alert.alert(
          'Please Check your internet',
          'Syncdown Failed! Try Again! \n' + error,
          [{text: 'ok', onPress: () => {}}],
        );
        reject();
      });
  });
  return promise;
};


export const GettingDataforsurvey = (
  cninc: string | Blob,
  setProgressVisible: (arg0: boolean) => void,
) => {
  const promise = new Promise((resolve, reject) => {
    NetInfo.fetch()
      .then(state => {
        //console.log('Connection type', state.type);
        //console.log('Is connected?', state.isConnected);
        if (!state.isConnected) {
          Alert.alert('Please Check your internet', 'Try Again! \n', [
            {text: 'ok', onPress: () => {}},
          ]);
          reject();
          return;
        }
        //console.log('---ALL', state);
        setProgressVisible(true);

        var data = new FormData();
        data.append('NIC', cninc);

        var config: any = {
          method: 'post',
          url: baseUrl + 'getServeyData.php',
          headers: {
            Cookie: 'PHPSESSID=8lptrr2dhtkl91mbic5pfnhn8t',
          },
          data: data,
        };

        axios(config)
          .then(async function (response) {
            //console.log("Tags=======respose>", response.data.SurveyFormData)

            //    if(response){
            // if(response.data){
            // resolve(resolve(response.data.data))
            // }else{
            //   //console.log("---response of getting tags>","something went wrong with getting tags")

            // }
            //    }else{
            //      //console.log("---response of getting tags>","something went wrong with getting tags")
            //    }
            resolve(response.data.SurveyFormData);
            setProgressVisible(false);
          })
          .catch(e => {
            //console.log(e);
            setProgressVisible(false);
            Alert.alert('Please Check your internet', 'Try Again! \n' + e, [
              {text: 'ok', onPress: () => {}},
            ]);

            reject();
          });
      })
      .catch(function (error) {
        //console.log(error);
        setProgressVisible(false);
        Alert.alert('Please Check your internet', 'Try Again! \n' + error, [
          {text: 'ok', onPress: () => {}},
        ]);

        reject();
      });
  });
  return promise;
};

// employee survey data
export const GettingDataforEmployeesurvey = (
  HRId: string | Blob,
  setProgressVisible: (arg0: boolean) => void,
) => {
  const promise = new Promise((resolve, reject) => {
    NetInfo.fetch()
      .then(state => {
        //console.log('Connection type', state.type);
        //console.log('Is connected?', state.isConnected);
        if (!state.isConnected) {
          Alert.alert('Please Check your internet', 'Try Again! \n', [
            {text: 'ok', onPress: () => {}},
          ]);
          reject();
          return;
        }
        //console.log('---ALL', state);
        setProgressVisible(true);

        var data = new FormData();
        data.append('HRId', HRId);

        var config: any = {
          method: 'post',
          url: baseUrl + 'getServeyData.php',
          headers: {
            Cookie: 'PHPSESSID=8lptrr2dhtkl91mbic5pfnhn8t',
          },
          data: data,
        };

        axios(config)
          .then(async function (response) {
            //console.log("Tags=======respose>", response.data.SurveyFormData)

            //    if(response){
            // if(response.data){
            // resolve(resolve(response.data.data))
            // }else{
            //   //console.log("---response of getting tags>","something went wrong with getting tags")

            // }
            //    }else{
            //      //console.log("---response of getting tags>","something went wrong with getting tags")
            //    }
            resolve(response.data.SurveyFormData);
            setProgressVisible(false);
          })
          .catch(e => {
            //console.log(e);
            setProgressVisible(false);
            Alert.alert('Please Check your internet', 'Try Again! \n' + e, [
              {text: 'ok', onPress: () => {}},
            ]);

            reject();
          });
      })
      .catch(function (error) {
        //console.log(error);
        setProgressVisible(false);
        Alert.alert('Please Check your internet', 'Try Again! \n' + error, [
          {text: 'ok', onPress: () => {}},
        ]);

        reject();
      });
  });
  return promise;
};


export const RepaymentSyncup = (
  item: any,
  setProgressVisible: (arg0: boolean) => void,
) => {
  const promise = new Promise((resolve, reject) => {
    NetInfo.fetch()
      .then(state => {
        //console.log('Connection type', state.type);
        //console.log('Is connected?', state.isConnected);
        if (!state.isConnected) {
          Alert.alert('Please Check your internet', 'Try Again!', [
            {text: 'ok', onPress: () => {}},
          ]);
          reject();
          return;
        }
        // //console.log('---ALL', item);
        setProgressVisible(true);
        // //console.log('---ALL', item);

        var data = new FormData();
        data.append('RepaymentInfo', JSON.stringify(item));

        var config: any = {
          method: 'post',
          url: baseUrl + 'SyncUpRepayment.php',
          headers: {
            Cookie: 'PHPSESSID=3fk5416nqaq5k85ltdjb0no4s5',
          },
          data: data,
        };

        axios(config)
          .then(async function (response) {
            //console.log(response.data)
            resolve(response.data);
            setProgressVisible(false);
          })
          .catch(e => {
            //console.log(e);
            setProgressVisible(false);
            Alert.alert(
              'Please Check your internet',
              'Syncdown Failed! Try Again! \n' + e,
              [{text: 'ok', onPress: () => {}}],
            );

            reject();
          });
      })
      .catch(function (error) {
        //console.log(error);
        setProgressVisible(false);
        Alert.alert(
          'Please Check your internet',
          'Syncdown Failed! Try Again! \n' + error,
          [{text: 'ok', onPress: () => {}}],
        );

        reject();
      });
  });
  return promise;
};

export const UploadDataforsurvey = (
  userData: {
    customerName: {value: string | Blob};
    customerId: {value: string | Blob};
    customerLoanId: {value: string | Blob};
    customerTypeOfLoan: {value: string | Blob};
    customerLoanCycle: {value: string | Blob};
    customerDateOfDisburse: {value: string | Blob};
    customerPhoneNumber: {value: string | Blob};
    customerLoanOfficer: {value: string | Blob};
    customerDateOfSurvey: {value: string | Blob};
    customerCnicNumber: {value: string | Blob};
    impactBusiness: {value: string | Blob};
    planningReviveIncome: {value: string | Blob};
    safcoLoanProduct: {value: string | Blob};
    recomendProductDesign: {
      product: string | Blob;
      loanAmount: string | Blob;
      paymentTerms: string | Blob;
    };
    whoKeptUpdateInfo: {value: string | Blob};
    whoProvideSocDistance: {value: string | Blob};
    appliedForLoanResch: {value: string | Blob};
    applyForReschedule: {value: string | Blob};
    employeeMfoInfo: {value: string | Blob};
    appExpClear: {value: string | Blob};
    proceDisbuseAtBranch: {value: string | Blob};
    disburseTakeTime: {value: string | Blob};
    arriveTakeTime: {value: string | Blob};
    branchReception: {value: string | Blob};
    didYouWait: {value: string | Blob};
    repayLoan: {value: string | Blob};
    provConvOpenHours: {value: string | Blob};
    howLongYouWait: {value: string | Blob};
    processQuickExptWaitTime: {value: string | Blob};
    staffServeYouWell: {value: string | Blob};
    contactTheEmployee: {value: string | Blob};
    EmpDoesEffort: {value: string | Blob};
    youSatisfiedWithLoan: {value: string | Blob};
    reasonsOfSatisfaction: {value: string | Blob};
    characOfCredit: {value: string | Blob};
    dealingFinancialInstitute: {value: string | Blob};
    forWhatReason: {value: string | Blob};
    productMeetYourNeed: {value: string | Blob};
    houseFinanceLoan: {value: string | Blob};
    autoFinanceLoan: {value: string | Blob};
    ifNoReason: {
      anyOther: {value: string | any[] | Blob};
      value: string | Blob;
    };
    ifYesPurpose: {value: string | Blob};
    whichVehcleWantPurchase: {value: string | Blob};
    forConstructNewHouse: {value: string | Blob};
    modeOfFinance: {value: string | Blob};
  },
  setProgressVisible: (arg0: boolean) => void,
) => {
  const promise = new Promise((resolve, reject) => {
    NetInfo.fetch()
      .then(state => {
        //console.log('Connection type', state.type);
        //console.log('Is connected?', state.isConnected);
        if (!state.isConnected) {
          Alert.alert('Please Check your internet', 'Try Again!', [
            {text: 'ok', onPress: () => {}},
          ]);
          reject();
          return;
        }
        //console.log('---ALL', state);
        setProgressVisible(true);
        var data = new FormData();
        data.append('Name', userData.customerName.value);
        data.append('CustomerId', userData.customerId.value);
        data.append('LoanId', userData.customerLoanId.value);
        data.append('LoanType', userData.customerTypeOfLoan.value);
        data.append('loanCycle', userData.customerLoanCycle.value);
        data.append('DisburseDate', userData.customerDateOfDisburse.value);
        data.append('PhoneNumber', userData.customerPhoneNumber.value);
        data.append('LoanOfficer', userData.customerLoanOfficer.value);
        data.append('SurveyDate', userData.customerDateOfSurvey.value);
        data.append('SurveyNIC', userData.customerCnicNumber.value);
        data.append('LockdownImpactID', userData.impactBusiness.value);
        data.append('RevivePlanID', userData.planningReviveIncome.value);
        data.append('RecommendSAFCOID', userData.safcoLoanProduct.value);
        data.append('NoAboveAnswerID', userData.recomendProductDesign.product);
        data.append('LoanAmountID', userData.recomendProductDesign.loanAmount);
        data.append(
          'PaymentTermsID',
          userData.recomendProductDesign.paymentTerms,
        );
        data.append('COVIDUpdateID', userData.whoKeptUpdateInfo.value);
        data.append(
          'OrientationAndPrecautionsID',
          userData.whoProvideSocDistance.value,
        );
        data.append(
          'ApplyLoanReshedulingID',
          userData.appliedForLoanResch.value,
        );
        data.append('LoanReshedulingID', userData.applyForReschedule.value);
        data.append('ClearAndSufficientInfoID', userData.employeeMfoInfo.value);
        data.append('FillingApplicationID', userData.appExpClear.value);
        data.append('DisburseProcedureID', userData.proceDisbuseAtBranch.value);
        data.append('DisburseWithTime', userData.disburseTakeTime.value);
        data.append('TakeMinutesID', userData.arriveTakeTime.value);
        data.append('ReceptionID', userData.branchReception.value);
        data.append('WaitID', userData.didYouWait.value);
        data.append('RepayLoanID', userData.repayLoan.value);
        data.append('RepayOutletID', userData.provConvOpenHours.value);
        data.append('DidUWait', userData.howLongYouWait.value);
        data.append('RepaymentProc', userData.processQuickExptWaitTime.value);
        data.append('ADCRepresentativeID', userData.staffServeYouWell.value);
        data.append('FrequentEmployeeID', userData.employeeMfoInfo.value);
        data.append('ContactMFOID', userData.contactTheEmployee.value);
        data.append('SolveProblemsID', userData.EmpDoesEffort.value);
        data.append('GroupLoanID', userData.youSatisfiedWithLoan.value);
        data.append('GroupLoanReasonsID', userData.reasonsOfSatisfaction.value);
        data.append('CreditID', userData.characOfCredit.value);
        data.append('DealingWithID', userData.dealingFinancialInstitute.value);
        data.append('ForWhatReasonsID', userData.forWhatReason.value);
        data.append('question20_answer', userData.productMeetYourNeed.value);
        data.append('question21_answer', userData.houseFinanceLoan.value);
        data.append('question22_answer', userData.autoFinanceLoan.value);

        if (userData.ifNoReason.anyOther.value.length > 0) {
          data.append('question20_reason', userData.ifNoReason.anyOther.value);
        } else {
          data.append('question20_reason', userData.ifNoReason.value);
        }
        data.append('question21_reason', userData.ifYesPurpose.value);
        data.append(
          'question22_reason',
          userData.whichVehcleWantPurchase.value,
        );

        data.append(
          'question21_construction',
          userData.forConstructNewHouse.value,
        );
        data.append('question22_construction', userData.modeOfFinance.value);

        var config: any = {
          method: 'post',
          url: baseUrl + 'surveydata.php',
          headers: {
            Cookie: 'PHPSESSID=8lptrr2dhtkl91mbic5pfnhn8t',
          },
          data: data,
        };

        axios(config)
          .then(async function (response) {
            //console.log("Tags=======respose>", response.data.SurveyFormData)

            //    if(response){
            // if(response.data){
            // resolve(resolve(response.data.data))
            // }else{
            //   //console.log("---response of getting tags>","something went wrong with getting tags")

            // }
            //    }else{
            //      //console.log("---response of getting tags>","something went wrong with getting tags")
            //    }
            resolve(response.data.SurveyFormData);
            setProgressVisible(false);
          })
          .catch(e => {
            //console.log(e);
            setProgressVisible(false);
            Alert.alert('Please Check your internet', ' Try Again! \n' + e, [
              {text: 'ok', onPress: () => {}},
            ]);

            reject();
          });
      })
      .catch(function (error) {
        //console.log(error);
        setProgressVisible(false);
        Alert.alert('Please Check your internet', ' Try Again! \n' + error, [
          {text: 'ok', onPress: () => {}},
        ]);

        reject();
      });
  });
  return promise;
};




// export const UploadDataforEmployeesurvey = (
//   userData: {
//     customerName: { value: string | Blob };
//     customerId: { value: string | Blob };
//     customerLoanId: { value: string | Blob };
//     customerTypeOfLoan: { value: string | Blob };
//     customerLoanCycle: { value: string | Blob };
//     customerDateOfDisburse: { value: string | Blob };
//     customerPhoneNumber: { value: string | Blob };
//     customerLoanOfficer: { value: string | Blob };
//     customerDateOfSurvey: { value: string | Blob };
//     customerCnicNumber: { value: string | Blob };
//     safcoMicrofinancePart: {
//       comment: { value: string | any[] | Blob };
//       value: string | Blob;
//     };
//     TopManagementpays: {
//       comment: { value: string | any[] | Blob };
//       value: string | Blob;
//     };
//     AboutWork: {
//       comment: { value: string | any[] | Blob };
//       value: string | Blob;
//     };
//     satisfiedJob: {
//       comment: { value: string | any[] | Blob };
//       value: string | Blob;
//     };
//     challengingJob: {
//       comment: { value: string | any[] | Blob };
//       value: string | Blob;
//     };
//     presentJob: {
//       comment: { value: string | any[] | Blob };
//       value: string | Blob;
//     };
//     satisfiedOpportunities: {
//       comment: { value: string | any[] | Blob };
//       value: string | Blob;
//     };
//     fillVacancies: {
//       comment: { value: string | any[] | Blob };
//       value: string | Blob;
//     };
//     Promotion: {
//       comment: { value: string | any[] | Blob };
//       value: string | Blob;
//     };
//     developSkills: {
//       comment: { value: string | any[] | Blob };
//       value: string | Blob;
//     };
//     talkOpenly: {
//       comment: { value: string | any[] | Blob };
//       value: string | Blob;
//     };
//     managerPraises: {
//       comment: { value: string | any[] | Blob };
//       value: string | Blob;
//     };
//     improveMyself: {
//       comment: { value: string | any[] | Blob };
//       value: string | Blob;
//     };
//     effectiveLeader: {
//       comment: { value: string | any[] | Blob };
//       value: string | Blob;
//     };
//     officeMember: {
//       comment: { value: string | any[] | Blob };
//       value: string | Blob;
//     };
//     workPerformance: {
//       comment: { value: string | any[] | Blob };
//       value: string | Blob;
//     };
//     linkedPromotions: {
//       comment: { value: string | any[] | Blob };
//       value: string | Blob;
//     };
//     lastPerformance: {
//       comment: { value: string | any[] | Blob };
//       value: string | Blob;
//     };
//     myOffice: {
//       comment: { value: string | any[] | Blob };
//       value: string | Blob;
//     };
//     jobSecure: {
//       comment: { value: string | any[] | Blob };
//       value: string | Blob;
//     };
//     reasonableWork: {
//       comment: { value: string | any[] | Blob };
//       value: string | Blob;
//     };
//     balanceWork: {
//       comment: { value: string | any[] | Blob };
//       value: string | Blob;
//     };
//     satisfiedPay: {
//       comment: { value: string | any[] | Blob };
//       value: string | Blob;
//     };
//     employeePrograms: {
//       comment: { value: string | any[] | Blob };
//       value: string | Blob;
//     };
//     safcoActivities: {
//       comment: { value: string | any[] | Blob };
//       value: string | Blob;
//     };
//     jobRight: {
//       Answer: { value: string | any[] | Blob };
//       value: string | Blob;
//     };
//     Comfortable: {
//       Answer: { value: string | any[] | Blob };
//       value: string | Blob;
//     };
//     Productivity: {
//       Answer: { value: string | any[] | Blob };
//       value: string | Blob;
//     };
//     threeSuggestion: {
//       Answer1: { value: string | any[] | Blob };
//       Answer2: { value: string | any[] | Blob };
//       Answer3: { value: string | any[] | Blob };
//       value: string | Blob;
//     };
//   },
//   setProgressVisible: (arg0: boolean) => void,
// ) => {
//   const promise = new Promise((resolve, reject) => {
//     NetInfo.fetch()
//       .then(state => {
//         if (!state.isConnected) {
//           Alert.alert('Please Check your internet', 'Try Again!', [
//             { text: 'ok', onPress: () => { } },
//           ]);
//           reject();
//           return;
//         }
//         setProgressVisible(true);
//         var data = new FormData();
//         data.append('Name', userData.customerName.value);
//         data.append('CustomerId', userData.customerId.value);
//         data.append('LoanId', userData.customerLoanId.value);
//         data.append('LoanType', userData.customerTypeOfLoan.value);
//         data.append('loanCycle', userData.customerLoanCycle.value);
//         data.append('DisburseDate', userData.customerDateOfDisburse.value);
//         data.append('PhoneNumber', userData.customerPhoneNumber.value);
//         data.append('LoanOfficer', userData.customerLoanOfficer.value);
//         data.append('SurveyDate', userData.customerDateOfSurvey.value);
//         data.append('SurveyNIC', userData.customerCnicNumber.value);

//         data.append('safcoMicrofinancePart', userData.safcoMicrofinancePart.value);
//         data.append('safcoMicrofinancePart_comment', userData.safcoMicrofinancePart.comment.value);
        
//         data.append('TopManagementpays', userData.TopManagementpays.value);
//         data.append('TopManagementpays_comment', userData.TopManagementpays.comment.value);

//         data.append('AboutWork', userData.AboutWork.value);
//         data.append('AboutWork_comment', userData.AboutWork.comment.value);

//         data.append('satisfiedJob', userData.satisfiedJob.value);
//         data.append('satisfiedJob_comment', userData.satisfiedJob.comment.value);

//         data.append('challengingJob', userData.challengingJob.value);
//         data.append('challengingJob_comment', userData.challengingJob.comment.value);

//         data.append('presentJob', userData.presentJob.value);
//         data.append('presentJob_comment', userData.presentJob.comment.value);

//         data.append('satisfiedOpportunities', userData.satisfiedOpportunities.value);
//         data.append('satisfiedOpportunities_comment', userData.satisfiedOpportunities.comment.value);

//         data.append('fillVacancies', userData.fillVacancies.value);
//         data.append('fillVacancies_comment', userData.fillVacancies.comment.value);

//         data.append('Promotion', userData.Promotion.value);
//         data.append('Promotion_comment', userData.Promotion.comment.value);

//         data.append('developSkills', userData.developSkills.value);
//         data.append('developSkills_comment', userData.developSkills.comment.value);

//         data.append('talkOpenly', userData.talkOpenly.value);
//         data.append('talkOpenly_comment', userData.talkOpenly.comment.value);

//         data.append('managerPraises', userData.managerPraises.value);
//         data.append('managerPraises_comment', userData.managerPraises.comment.value);

//         data.append('improveMyself', userData.improveMyself.value);
//         data.append('improveMyself_comment', userData.improveMyself.comment.value);

//         data.append('effectiveLeader', userData.effectiveLeader.value);
//         data.append('effectiveLeader_comment', userData.effectiveLeader.comment.value);

//         data.append('officeMember', userData.officeMember.value);
//         data.append('officeMember_comment', userData.officeMember.comment.value);

//         data.append('workPerformance', userData.workPerformance.value);
//         data.append('workPerformance_comment', userData.workPerformance.comment.value);

//         data.append('linkedPromotions', userData.linkedPromotions.value);
//         data.append('linkedPromotions_comment', userData.linkedPromotions.comment.value);

//         data.append('lastPerformance', userData.lastPerformance.value);
//         data.append('lastPerformance_comment', userData.lastPerformance.comment.value);

//         data.append('myOffice', userData.myOffice.value);
//         data.append('myOffice_comment', userData.myOffice.comment.value);

//         data.append('jobSecure', userData.jobSecure.value);
//         data.append('jobSecure_comment', userData.jobSecure.comment.value);

//         data.append('reasonableWork', userData.reasonableWork.value);
//         data.append('reasonableWork_comment', userData.reasonableWork.comment.value);

//         data.append('balanceWork', userData.balanceWork.value);
//         data.append('balanceWork_comment', userData.balanceWork.comment.value);

//         data.append('satisfiedPay', userData.satisfiedPay.value);
//         data.append('satisfiedPay_comment', userData.satisfiedPay.comment.value);

//         data.append('employeePrograms', userData.employeePrograms.value);
//         data.append('employeePrograms_comment', userData.employeePrograms.comment.value);

//         data.append('safcoActivities', userData.safcoActivities.value);
//         data.append('safcoActivities_comment', userData.safcoActivities.comment.value);

//         data.append('jobRight', userData.jobRight.value);
//         data.append('jobRight_Answer', userData.jobRight.Answer.value);

//         data.append('Comfortable', userData.Comfortable.value);
//         data.append('Comfortable_Answer', userData.Comfortable.Answer.value);

//         data.append('Productivity', userData.Productivity.value);
//         data.append('Productivity_Answer', userData.Productivity.Answer.value);

//         data.append('threeSuggestion', userData.threeSuggestion.value);
//         data.append('threeSuggestion_Answer1', userData.threeSuggestion.Answer1.value);
//         data.append('threeSuggestion_Answer2', userData.threeSuggestion.Answer2.value);
//         data.append('threeSuggestion_Answer3', userData.threeSuggestion.Answer3.value);

//         console.log('faaiz',data);

//         var config: any = {
//           method: 'post',
//           url: 'http://192.168.100.50/safco-hrms/hr/employee_survey/surveydata.php',
//           headers: {
//             Cookie: 'PHPSESSID=8lptrr2dhtkl91mbic5pfnhn8t',
//           },
//           data: data,
//         };

//         axios(config)
//           .then(async function (response) {
//             resolve(response.data.SurveyFormData);
//             setProgressVisible(false);
//           })
//           .catch(e => {
//             setProgressVisible(false);
//             Alert.alert('Please Check your internet', ' Try Again! \n' + e, [
//               { text: 'ok', onPress: () => { } },
//             ]);
//             reject();
//           });
//       })
//       .catch(function (error) {
//         setProgressVisible(false);
//         Alert.alert('Please Check your internet', ' Try Again! \n' + error, [
//           { text: 'ok', onPress: () => { } },
//         ]);
//         reject();
//       });
//   });
//   return promise;
// };




export const UploadDataforEmployeesurvey = (
  userData: {
    HRId: { value: string | Blob };
    StationId: { value: string | Blob };
    employeeName: { value: string | Blob };
    
    employeeDateOfSurvey: { value: string | Blob };
    employeeDesignation: { value: string | Blob };
    safcoMicrofinancePart: {
      comment: { value: string | any[] | Blob };
      value: string | Blob;
    };
    TopManagementpays: {
      comment: { value: string | any[] | Blob };
      value: string | Blob;
    };
    AboutWork: {
      comment: { value: string | any[] | Blob };
      value: string | Blob;
    };
    satisfiedJob: {
      comment: { value: string | any[] | Blob };
      value: string | Blob;
    };
    challengingJob: {
      comment: { value: string | any[] | Blob };
      value: string | Blob;
    };
    presentJob: {
      comment: { value: string | any[] | Blob };
      value: string | Blob;
    };
    satisfiedOpportunities: {
      comment: { value: string | any[] | Blob };
      value: string | Blob;
    };
    fillVacancies: {
      comment: { value: string | any[] | Blob };
      value: string | Blob;
    };
    Promotion: {
      comment: { value: string | any[] | Blob };
      value: string | Blob;
    };
    developSkills: {
      comment: { value: string | any[] | Blob };
      value: string | Blob;
    };
    talkOpenly: {
      comment: { value: string | any[] | Blob };
      value: string | Blob;
    };
    managerPraises: {
      comment: { value: string | any[] | Blob };
      value: string | Blob;
    };
    improveMyself: {
      comment: { value: string | any[] | Blob };
      value: string | Blob;
    };
    effectiveLeader: {
      comment: { value: string | any[] | Blob };
      value: string | Blob;
    };
    officeMember: {
      comment: { value: string | any[] | Blob };
      value: string | Blob;
    };
    workPerformance: {
      comment: { value: string | any[] | Blob };
      value: string | Blob;
    };
    linkedPromotions: {
      comment: { value: string | any[] | Blob };
      value: string | Blob;
    };
    lastPerformance: {
      comment: { value: string | any[] | Blob };
      value: string | Blob;
    };
    myOffice: {
      comment: { value: string | any[] | Blob };
      value: string | Blob;
    };
    jobSecure: {
      comment: { value: string | any[] | Blob };
      value: string | Blob;
    };
    reasonableWork: {
      comment: { value: string | any[] | Blob };
      value: string | Blob;
    };
    balanceWork: {
      comment: { value: string | any[] | Blob };
      value: string | Blob;
    };
    satisfiedPay: {
      comment: { value: string | any[] | Blob };
      value: string | Blob;
    };
    employeePrograms: {
      comment: { value: string | any[] | Blob };
      value: string | Blob;
    };
    safcoActivities: {
      comment: { value: string | any[] | Blob };
      value: string | Blob;
    };
    jobRight: {
      Answer: { value: string | any[] | Blob };
      value: string | Blob;
    };
    Comfortable: {
      Answer: { value: string | any[] | Blob };
      value: string | Blob;
    };
    Productivity: {
      Answer: { value: string | any[] | Blob };
      value: string | Blob;
    };
    threeSuggestion: {
      Answer1: { value: string | any[] | Blob };
      Answer2: { value: string | any[] | Blob };
      Answer3: { value: string | any[] | Blob };
      value: string | Blob;
    };
  },
  setProgressVisible: (arg0: boolean) => void,
) => {
  const promise = new Promise((resolve, reject) => {
    NetInfo.fetch()
      .then(state => {
        if (!state.isConnected) {
          Alert.alert('Please Check your internet', 'Try Again!', [
            { text: 'ok', onPress: () => { } },
          ]);
          reject();
          return;
        }
        setProgressVisible(true);
        const data = {
          HRId: userData.HRId.value,
          StationId: userData.StationId.value,
          employeeName: userData.employeeName.value,
          
          SurveyDate: userData.employeeDateOfSurvey.value,
          employeeDesignaton: userData.employeeDesignation.value,
          safcoMicrofinancePart: userData.safcoMicrofinancePart.value,
          safcoMicrofinancePart_comment: userData.safcoMicrofinancePart.comment.value,
          TopManagementpays: userData.TopManagementpays.value,
          TopManagementpays_comment: userData.TopManagementpays.comment.value,
          AboutWork: userData.AboutWork.value,
          AboutWork_comment: userData.AboutWork.comment.value,
          satisfiedJob: userData.satisfiedJob.value,
          satisfiedJob_comment: userData.satisfiedJob.comment.value,
          challengingJob: userData.challengingJob.value,
          challengingJob_comment: userData.challengingJob.comment.value,
          presentJob: userData.presentJob.value,
          presentJob_comment: userData.presentJob.comment.value,
          satisfiedOpportunities: userData.satisfiedOpportunities.value,
          satisfiedOpportunities_comment: userData.satisfiedOpportunities.comment.value,
          fillVacancies: userData.fillVacancies.value,
          fillVacancies_comment: userData.fillVacancies.comment.value,
          Promotion: userData.Promotion.value,
          Promotion_comment: userData.Promotion.comment.value,
          developSkills: userData.developSkills.value,
          developSkills_comment: userData.developSkills.comment.value,
          talkOpenly: userData.talkOpenly.value,
          talkOpenly_comment: userData.talkOpenly.comment.value,
          managerPraises: userData.managerPraises.value,
          managerPraises_comment: userData.managerPraises.comment.value,
          improveMyself: userData.improveMyself.value,
          improveMyself_comment: userData.improveMyself.comment.value,
          effectiveLeader: userData.effectiveLeader.value,
          effectiveLeader_comment: userData.effectiveLeader.comment.value,
          officeMember: userData.officeMember.value,
          officeMember_comment: userData.officeMember.comment.value,
          workPerformance: userData.workPerformance.value,
          workPerformance_comment: userData.workPerformance.comment.value,
          linkedPromotions: userData.linkedPromotions.value,
          linkedPromotions_comment: userData.linkedPromotions.comment.value,
          lastPerformance: userData.lastPerformance.value,
          lastPerformance_comment: userData.lastPerformance.comment.value,
          myOffice: userData.myOffice.value,
          myOffice_comment: userData.myOffice.comment.value,
          jobSecure: userData.jobSecure.value,
          jobSecure_comment: userData.jobSecure.comment.value,
          reasonableWork: userData.reasonableWork.value,
          reasonableWork_comment: userData.reasonableWork.comment.value,
          balanceWork: userData.balanceWork.value,
          balanceWork_comment: userData.balanceWork.comment.value,
          satisfiedPay: userData.satisfiedPay.value,
          satisfiedPay_comment: userData.satisfiedPay.comment.value,
          employeePrograms: userData.employeePrograms.value,
          employeePrograms_comment: userData.employeePrograms.comment.value,
          safcoActivities: userData.safcoActivities.value,
          safcoActivities_comment: userData.safcoActivities.comment.value,
          jobRight: userData.jobRight.value,
          jobRight_Answer: userData.jobRight.Answer.value,
          Comfortable: userData.Comfortable.value,
          Comfortable_Answer: userData.Comfortable.Answer.value,
          Productivity: userData.Productivity.value,
          Productivity_Answer: userData.Productivity.Answer.value,
          threeSuggestion: userData.threeSuggestion.value,
          threeSuggestion_Answer1: userData.threeSuggestion.Answer1.value,
          threeSuggestion_Answer2: userData.threeSuggestion.Answer2.value,
          threeSuggestion_Answer3: userData.threeSuggestion.Answer3.value
        };

        console.log('faaiz data', data);

        var config: any = {
          method: 'post',
          url: 'http://hr.safcomicrofinance.com.pk/hr/employee_survey/surveydata.php',
          // url: 'http://192.168.100.107/safco-hrms/hr/employee_survey/surveydata.php',
          headers: {
            'Content-Type': 'application/json',
          },
          data: data,
        };

        axios(config)
          .then((response: { data: any }) => {
            setProgressVisible(false);
            resolve(response.data);
          })
          .catch((error: any) => {
            if (error.response.status === 409) {

                console.log(error.response.data.message);
            }
            
            setProgressVisible(false);
            resolve(error.response.data.message);
            
            // reject();
          });
      })
      .catch((error: any) => {
        // console.log('Error Aazan Chapri:', error.response.status);
        // if (error.response.status === 409) {
        //     console.log('Faaiz uddin here');
        // }
        console.log(error);
        reject();
      });
  });
  return promise;
};


//Get Safco Customers data
export const getSafcoCustomer = (
  setProgressVisible: (arg0: boolean) => void,
  stationId: any,
  gender: any,
) => {
  // console.log("---->",Gender+"---->"+StationId);
  const promise = new Promise((resolve, reject) => {
    NetInfo.fetch()
      .then(state => {
        //console.log('Connection type', state.type);
        //console.log('Is connected?', state.isConnected);
        if (!state.isConnected) {
          alert('Please Check your internet');
          reject();
          return;
        }
        //console.log('---ALL', state);
        setProgressVisible(true);

        var config = {
          method: 'get',
          url: `${baseUrl}cibCustomers.php?Gender=${gender}&StationId=${stationId}`,
          headers: {
            Cookie: 'PHPSESSID=06km9lkfu0dkor1sn7brkqieed',
          },
        };
        console.log('---->API-->cibCustomers.php', config);
        axios(config)
          .then(async function (response) {
            if (response) {
              // console.log("SafcoCustomer=======respose>", response.data)
              // customerData.records.length == 0 ? setNoData(true) : setNoData(false);
              if (response.data.records.length > 0) {
                var customerData = response.data.records;
                // console.log("SafcoCustomer=======respose>", customerData)

                resolve(customerData);
              } else {
                resolve([]);
              }
            }

            setProgressVisible(false);
          })
          .catch(e => {
            //console.log(e);
            setProgressVisible(false);

            reject();
          });
      })
      .catch(function (error) {
        //console.log(error);
        setProgressVisible(false);
        alert('Syncup Failed!');
        reject();
      });
  });
  return promise;
};

//Get Safco Customers data
export const getDashboardData = (employeeId: string) => {
  const promise = new Promise((resolve, reject) => {
    NetInfo.fetch()
      .then(state => {
        //console.log('Connection type', state.type);
        //console.log('Is connected?', state.isConnected);
        if (!state.isConnected) {
          alert('Please Check your internet');
          reject();
          return;
        }
        var data = new FormData();
        data.append('EmployeedId', '' + employeeId);
        var config: any = {
          method: 'post',
          url: baseUrl + 'getDashboardData.php',
          headers: {
            Cookie: 'PHPSESSID=3lb477pd35rgcrkkipk6l81k87',
          },
          data: data,
        };
        axios(config)
          .then(async function (response) {
            if (response) {
              resolve(response.data);
            }
          })
          .catch(e => {
            //console.log(e);
            reject(e);
          });
      })
      .catch(function (error) {
        //console.log(error);
        reject(error);
      });
  });
  return promise;
};

export const repaymentSyncdown = (
  StationId: string | Blob,
  MobileToken: string | Blob,
  setProgressVisible: (arg0: boolean) => void,
) => {
  const promise = new Promise((resolve, reject) => {
    NetInfo.fetch()
      .then(state => {
        //console.log('Connection type', state.type);
        //console.log('Is connected?', state.isConnected);
        if (!state.isConnected) {
          Alert.alert('Please Check your internet', 'Try Again! \n', [
            {text: 'ok', onPress: () => {}},
          ]);
          reject();
          return;
        }
        //console.log('---ALL', state);
        setProgressVisible(true);

        var data = new FormData();
        data.append('StationId', StationId);
        data.append('MobileToken', MobileToken);

        var config: any = {
          method: 'post',
          url: baseUrl + 'CustomersSyncDownStationwise.php',
          headers: {
            Cookie: 'PHPSESSID=8lptrr2dhtkl91mbic5pfnhn8t',
          },
          data: data,
        };

        axios(config)
          .then(async function (response) {
            //console.log("Tags=======respose>", response.data)
            resolve(response.data);
          })
          .catch(e => {
            //console.log(e);
            setProgressVisible(false);
            Alert.alert('Please Check your internet', 'Try Again! \n' + e, [
              {text: 'ok', onPress: () => {}},
            ]);

            reject();
          });
      })
      .catch(function (error) {
        //console.log(error);
        setProgressVisible(false);
        Alert.alert('Please Check your internet', 'Try Again! \n' + error, [
          {text: 'ok', onPress: () => {}},
        ]);

        reject();
      });
  });
  return promise;
};
//Get Due Detail report date
export const getDueDetailReport = (
  StationId: string,
  clientWisedue: {
    disburseDateFrom: moment.MomentInput;
    disburseDateTo: moment.MomentInput;
    recoveryDateFrom: moment.MomentInput;
    recoveryDateTo: moment.MomentInput;
    staffId: string;
  },
  setDueDetailReport: (arg0: any) => void,
  setNoDueDetialData: (arg0: boolean) => any,
  setProgressVisible: (arg0: boolean) => void,
) => {
  const promise = new Promise((resolve, reject) => {
    NetInfo.fetch()
      .then(state => {
        //console.log('Connection type', state.type);
        //console.log('Is connected?', state.isConnected);
        if (!state.isConnected) {
          alert('Please Check your internet');
          reject();
          return;
        }
        setProgressVisible(true);

        var data = new FormData();
        data.append('stationId', '' + StationId);
        data.append(
          'disburseStartDate',
          '' + moment(clientWisedue.disburseDateFrom).format('YYYY-MM-DD'),
        );
        data.append(
          'disburseEndDate',
          '' + moment(clientWisedue.disburseDateTo).format('YYYY-MM-DD'),
        );
        data.append(
          'recoveryStartDate',
          '' + moment(clientWisedue.recoveryDateFrom).format('YYYY-MM-DD'),
        );
        data.append(
          'recoveryEndDate',
          '' + moment(clientWisedue.recoveryDateTo).format('YYYY-MM-DD'),
        );
        data.append('staffNameID', '' + clientWisedue.staffId);
        //console.log('---ALL', data);

        var config: any = {
          method: 'post',
          url: baseUrl + 'tablet_reports.php',
          headers: {
            Cookie: 'PHPSESSID=8lptrr2dhtkl91mbic5pfnhn8t',
          },
          data: data,
        };

        axios(config)
          .then(async function (response) {
            if (response) {
              var DueDetailData = response.data;
              DueDetailData
                ? setNoDueDetialData(true)
                : setNoDueDetialData(false);
              setDueDetailReport(response.data);
              resolve(response.data);
              // console.log("---?",response.data)
            }

            setProgressVisible(false);
          })
          .catch(e => {
            //console.log(e);
            setProgressVisible(false);
            alert('Due Datail Report Fetch data Failed!');
            reject();
          });
      })
      .catch(function (error) {
        //console.log(error);
        setProgressVisible(false);
        alert('Due Datail Report Fetch data Failed!');
        reject();
      });
  });
  return promise;
};
//Get Remaining Due Detail report data
export const getRemainingDetailReport = (
  StationId: string,
  clientWiseRemaining: {
    disburseDateFrom: moment.MomentInput;
    disburseDateTo: moment.MomentInput;
    recoveryDateFrom: moment.MomentInput;
    recoveryDateTo: moment.MomentInput;
    staffId: string;
  },
  setRemDetailReport: any,
  setNoRemDetialData: any,
  setRemProgressVisible: (arg0: boolean) => void,
  MobileToken: string,
) => {
  //console.log("----?>", JSON.stringify(clientWiseRemaining))
  //console.log("----?>", JSON.stringify(MobileToken))

  //  return
  const promise = new Promise((resolve, reject) => {
    NetInfo.fetch()
      .then(state => {
        //console.log('Connection type', state.type);
        //console.log('Is connected?', state.isConnected);
        if (!state.isConnected) {
          alert('Please Check your internet');
          reject();
          return;
        }
        setRemProgressVisible(true);

        var data = new FormData();
        data.append('stationId', '' + StationId);
        data.append(
          'disburseStartDate',
          '' +
            moment(clientWiseRemaining.disburseDateFrom).format('YYYY-MM-DD'),
        );
        data.append(
          'disburseEndDate',
          '' + moment(clientWiseRemaining.disburseDateTo).format('YYYY-MM-DD'),
        );
        data.append(
          'recoveryStartDate',
          '' +
            moment(clientWiseRemaining.recoveryDateFrom).format('YYYY-MM-DD'),
        );
        data.append(
          'recoveryEndDate',
          '' + moment(clientWiseRemaining.recoveryDateTo).format('YYYY-MM-DD'),
        );
        data.append('staffNameID', '' + clientWiseRemaining.staffId);
        data.append('MobileToken', '' + MobileToken);
        //console.log('---ALL', data);

        var config: any = {
          method: 'post',
          url: baseUrl + 'tablet_remainging_reports.php',
          headers: {
            Cookie: 'PHPSESSID=8lptrr2dhtkl91mbic5pfnhn8t',
          },
          data: data,
        };

        axios(config)
          .then(async function (response) {
            console.log(response.data);
            if (response) {
              var DueDetailData = response.data;
              //console.log(DueDetailData)
              resolve(response.data);
              // DueDetailData? setNoRemDetialData(true):setNoRemDetialData(false);
              // setRemDetailReport(response.data)
              // resolve(response.data);
              // //console.log("---?RemainingDetial ",response.data)
            }

            setRemProgressVisible(false);
          })
          .catch(e => {
            //console.log(e);
            setRemProgressVisible(false);
            alert('Remaining Datail Report Fetch data Failed!');
            reject();
          });
      })
      .catch(function (error) {
        //console.log(error);
        setRemProgressVisible(false);
        alert('Remaining Datail Report Fetch data Failed!');
        reject();
      });
  });
  return promise;
};

//Get Daily Collection  report by loanOfficer
export const getDailyCollectionReport = (
  StationId: any,
  EmployeeId: string,
  EmployeeTypeId: any,
  setDailyCollectionReport: (arg0: any) => void,
  setNoDailyCollectionData: (arg0: boolean) => any,
  setProgressVisible: (arg0: boolean) => void,
) => {
  const promise = new Promise((resolve, reject) => {
    NetInfo.fetch()
      .then(state => {
        if (!state.isConnected) {
          alert('Please Check your internet');
          reject();
          return;
        }

        setProgressVisible(true);
        var data = new FormData();
        data.append('emplpoyeeId', '' + EmployeeId);
        var config: any = {
          method: 'post',
          url: baseUrl + 'GetDailyCollectionReportLoanOfficer.php',
          headers: {
            Cookie: 'PHPSESSID=8lptrr2dhtkl91mbic5pfnhn8t',
          },
          data: data,
        };

        // console.log("DAily collection report ====>",JSON.stringify(data))
        axios(config)
          .then(async function (response) {
            if (response.data.statusCode == 201) {
              alert('No Data Found');
              return;
            } else {
              var DueDetailData = response.data;
              console.log('---?', DueDetailData);
              DueDetailData
                ? setNoDailyCollectionData(true)
                : setNoDailyCollectionData(false);
              setDailyCollectionReport(response.data);
              resolve(response.data);
            }
            setProgressVisible(false);
          })
          .catch(e => {
            // console.log(e);
            setProgressVisible(false);
            alert('Daily Collection Report Fetch data Failed!');
            reject();
          });
      })
      .catch(function (error) {
        // console.log(error);
        setProgressVisible(false);
        alert('Daily Collection Report Fetch data Failed!');
        reject();
      });
  });
  return promise;
};

//Get Daily Collection  report for BM
export const getDailyCollectionReportBm = (
  StationId: string,
  EmployeeId: any,
  EmployeeTypeId: any,
  setDailyCollectionReport: (arg0: any) => void,
  setNoDailyCollectionData: (arg0: boolean) => any,
  setProgressVisible: (arg0: boolean) => void,
) => {
  const promise = new Promise((resolve, reject) => {
    NetInfo.fetch()
      .then(state => {
        if (!state.isConnected) {
          alert('Please Check your internet');
          reject();
          return;
        }
        setProgressVisible(true);

        var data = new FormData();
        data.append('stationId', '' + StationId);

        var config: any = {
          method: 'post',
          url: baseUrl + 'GetDailyCollectionReportBranchWise.php',
          headers: {
            Cookie: 'PHPSESSID=8lptrr2dhtkl91mbic5pfnhn8t',
          },
          data: data,
        };

        axios(config)
          .then(async function (response) {
            if (response.data.statusCode == 201) {
              alert('No Data Found');
              return;
            } else {
              var DueDetailData = response.data;
              DueDetailData
                ? setNoDailyCollectionData(true)
                : setNoDailyCollectionData(false);
              setDailyCollectionReport(response.data);
              resolve(response.data);
              // console.log("---?", response.data)
            }
            setProgressVisible(false);
          })
          .catch(e => {
            // console.log(e);

            alert('Daily Collection Report Fetch data Failed!');
            reject();
          });
      })
      .catch(function (error) {
        // console.log(error);
        alert('Daily Collection Report Fetch data Failed!');
        reject();
      });
  });
  return promise;
};
//Get Daily Collection  report for RM
export const getDailyCollectionReportRm = (
  StationId: string,
  EmployeeId: any,
  EmployeeTypeId: any,
  setDailyCollectionReport: (arg0: any) => void,
  setNoDailyCollectionData: (arg0: boolean) => any,
  setProgressVisible: (arg0: boolean) => void,
) => {
  const promise = new Promise((resolve, reject) => {
    NetInfo.fetch()
      .then(state => {
        if (!state.isConnected) {
          alert('Please Check your internet');
          reject();
          return;
        }
        setProgressVisible(true);

        var data = new FormData();
        data.append('stationid', '' + StationId);

        var config: any = {
          method: 'post',
          url: baseUrl + 'dailycollectionRM.php',
          headers: {
            Cookie: 'PHPSESSID=8lptrr2dhtkl91mbic5pfnhn8t',
          },
          data: data,
        };

        axios(config)
          .then(async function (response) {
            if (response.data.statusCode == 201) {
              alert('No Data Found');
              return;
            } else {
              var DueDetailData = response.data;
              DueDetailData
                ? setNoDailyCollectionData(true)
                : setNoDailyCollectionData(false);
              setDailyCollectionReport(response.data);
              resolve(response.data);
              // console.log("---?", response.data)
            }
            setProgressVisible(false);
          })
          .catch(e => {
            // console.log(e);

            alert('Daily Collection Report Fetch data Failed!');
            reject();
          });
      })
      .catch(function (error) {
        // console.log(error);
        alert('Daily Collection Report Fetch data Failed!');
        reject();
      });
  });
  return promise;
};
//Get Daily Collection  report for ZM
export const getDailyCollectionReportZm = (
  StationId: string,
  EmployeeId: any,
  EmployeeTypeId: any,
  setDailyCollectionReport: (arg0: any) => void,
  setNoDailyCollectionData: (arg0: boolean) => any,
  setProgressVisible: (arg0: boolean) => void,
) => {
  const promise = new Promise((resolve, reject) => {
    NetInfo.fetch()
      .then(state => {
        if (!state.isConnected) {
          alert('Please Check your internet');
          reject();
          return;
        }
        setProgressVisible(true);

        var data = new FormData();
        data.append('employeeid', '' + '1611');

        var config: any = {
          method: 'post',
          url: baseUrl + 'dailycollectionZM.php',
          headers: {
            Cookie: 'PHPSESSID=8lptrr2dhtkl91mbic5pfnhn8t',
          },
          data: data,
        };

        axios(config)
          .then(async function (response) {
            if (response.data.statusCode == 201) {
              alert('No Data Found');
              return;
            } else {
              var DueDetailData = response.data;
              DueDetailData
                ? setNoDailyCollectionData(true)
                : setNoDailyCollectionData(false);
              setDailyCollectionReport(response.data);
              resolve(response.data);
              console.log('---?', response.data);
            }
            setProgressVisible(false);
          })
          .catch(e => {
            // console.log(e);

            alert('Daily Collection Report Fetch data Failed!');
            reject();
          });
      })
      .catch(function (error) {
        // console.log(error);
        alert('Daily Collection Report Fetch data Failed!');
        reject();
      });
  });
  return promise;
};

//Sending object to server
export const sendObjectbyLoanOfficer = (
  obj: any,
  status: any,
  compositeKey: any,
  stationId: undefined,
  otp: number,
) => {
  const promise = new Promise((resolve, reject) => {
    NetInfo.fetch()
      .then(state => {
        //console.log('Connection type', state.type);
        //console.log('Is connected?', state.isConnected);
        if (stationId == undefined) {
          Alert.alert('Please Select Station');
          reject();
          return;
        }
        if (!state.isConnected) {
          Alert.alert('Please Check your internet', 'Try Again!', [
            {text: 'ok', onPress: () => {}},
          ]);

          reject();
          return;
        }
        var FormData = require('form-data');
        var data = new FormData();

        // console.log("---group_data----",JSON.stringify(obj))
        // console.log("---group_Status----",status)
        // console.log("---user_cnic----",compositeKey)
        // console.log("---station_id----",stationId)

        data.append('group_data', JSON.stringify(obj));
        data.append('group_Status', status);
        data.append('user_cnic', compositeKey);
        data.append('station_id', stationId);
        // data.append('otp',otp);

        console.log(
          'E-Credit===>>>',
          `{group_Status:${status}, user_cnic:${compositeKey}, station_id:${stationId}`,
        );
        // return

        var config: any = {
          method: 'post',
          url: `${baseUrlTemp}syncupbyloanofficer.php`,
          headers: {
            Cookie: 'PHPSESSID=4i7orotrgn9ke0dbbh4cg4geja',
          },
          data: data,
        };

        axios(config)
          .then(async function (response) {
            console.log(
              'uploadObject by loanOffficer==================>',
              response.data,
            );

            resolve(response.data);
          })
          .catch(e => {
            //console.log(e);

            Alert.alert(
              'Please Check your internet',
              'Syncdown Failed! Try Again! \n' + e,
              [{text: 'ok', onPress: () => {}}],
            );

            reject();
          });
      })
      .catch(function (error) {
        //console.log(error);
        Alert.alert(
          'Please Check your internet',
          'Syncdown Failed! Try Again! \n' + error,
          [{text: 'ok', onPress: () => {}}],
        );

        reject();
      });
  });
  return promise;
};

//Sending object to server
export const sendObjectbyBM = (
  obj: {CustomerId: any; CustomerDataObject: never[]; LoanOfficer: any},
  status: number,
  compositeKey: any,
  stationId: undefined,
) => {
  const promise = new Promise((resolve, reject) => {
    NetInfo.fetch()
      .then(state => {
        //console.log('Connection type', state.type);
        //console.log('Is connected?', state.isConnected);
        if (stationId == undefined) {
          Alert.alert('Please Select Station');
          reject();
          return;
        }
        if (!state.isConnected) {
          Alert.alert('Please Check your internet', 'Try Again!', [
            {text: 'ok', onPress: () => {}},
          ]);

          reject();
          return;
        }

        var FormData = require('form-data');
        var data = new FormData();

        // console.log('bmgroup------>>>>',JSON.stringify(obj))
        // console.log('bmgroupnic------>>>>',compositeKey)

        data.append('group_data', JSON.stringify(obj));
        data.append('user_cnic', compositeKey);

        var config: any = {
          method: 'post',
          url: `${baseUrlTemp}updateByBM.php`,
          headers: {
            Cookie: 'PHPSESSID=4i7orotrgn9ke0dbbh4cg4geja',
          },
          data: data,
        };

        axios(config)
          .then(async function (response) {
            console.log('BmuploadObject==>', response.data);

            resolve(response.data);
          })
          .catch(e => {
            //console.log(e);

            Alert.alert(
              'Please Check your internet',
              'Syncdown Failed! Try Again! \n' + e,
              [{text: 'ok', onPress: () => {}}],
            );

            reject();
          });
      })
      .catch(function (error) {
        //console.log(error);
        Alert.alert(
          'Please Check your internet',
          'Syncdown Failed! Try Again! \n' + error,
          [{text: 'ok', onPress: () => {}}],
        );

        reject();
      });
  });
  return promise;
};
export const updateTempCustomerDocsimagesbyBm = (
  docs_data: any,
  user_cnic: any,
) => {
  // console.log('updateTempCustomerDocsimagesbyBm', docs_data)
  const promise = new Promise((resolve, reject) => {
    NetInfo.fetch()
      .then(state => {
        //console.log('Connection type', state.type);
        //console.log('Is connected?', state.isConnected);
        if (!state.isConnected) {
          Alert.alert('Please Check your internet', 'Try Again!', [
            {text: 'ok', onPress: () => {}},
          ]);

          reject();
          return;
        }
        var FormData = require('form-data');
        var data = new FormData();
        data.append('group_data', JSON.stringify(docs_data));
        data.append('user_cnic', user_cnic);

        var config: any = {
          method: 'post',
          url: baseUrlTemp + 'updateByBmDocImg.php',
          headers: {
            Cookie: 'PHPSESSID=4i7orotrgn9ke0dbbh4cg4geja',
          },
          data: data,
        };

        axios(config)
          .then(async function (response) {
            if (response.data) {
              console.log('uploadObject1==>', response.data);

              resolve(response.data);
            } else {
              reject(response);
            }
          })
          .catch(e => {
            //console.log(e);

            Alert.alert(
              'Please Check your internet',
              'Syncdown Failed! Try Again! \n' + JSON.stringify(e),
              [{text: 'ok', onPress: () => {}}],
            );

            reject();
          });
      })
      .catch(function (error) {
        //console.log(error);
        Alert.alert(
          'Please Check your internet',
          'Syncdown Failed! Try Again! \n' + JSON.stringify(error),
          [{text: 'ok', onPress: () => {}}],
        );

        reject();
      });
  });
  return promise;
};

export const sendTempCustomerAssetsImagesbyBm = (
  image_data: any,
  user_cnic: any,
) => {
  const promise = new Promise((resolve, reject) => {
    NetInfo.fetch()
      .then(state => {
        //console.log('Connection type', state.type);
        //console.log('Is connected?', state.isConnected);
        if (!state.isConnected) {
          Alert.alert('Please Check your internet', 'Try Again!', [
            {text: 'ok', onPress: () => {}},
          ]);

          reject();
          return;
        }
        var FormData = require('form-data');
        var data = new FormData();
        data.append('group_data', JSON.stringify(image_data));
        data.append('user_cnic', user_cnic);

        var config: any = {
          method: 'post',
          url: baseUrlTemp + 'updateByBmAssetImg.php',
          headers: {
            Cookie: 'PHPSESSID=4i7orotrgn9ke0dbbh4cg4geja',
          },
          data: data,
        };

        axios(config)
          .then(async function (response) {
            console.log('uploadObject2==>', response.data);

            resolve(response.data);
          })
          .catch(e => {
            //console.log(e);

            Alert.alert(
              'Please Check your internet',
              'Syncdown Failed! Try Again! \n' + e,
              [{text: 'ok', onPress: () => {}}],
            );

            reject();
          });
      })
      .catch(function (error) {
        //console.log(error);
        Alert.alert(
          'Please Check your internet',
          'Syncdown Failed! Try Again! \n' + error,
          [{text: 'ok', onPress: () => {}}],
        );

        reject();
      });
  });
  return promise;
};

//Sending object to server
export const sendTempCustomerDocsimages = (docs_data: any, user_cnic: any) => {
  const promise = new Promise((resolve, reject) => {
    NetInfo.fetch()
      .then(state => {
        //console.log('Connection type', state.type);
        //console.log('Is connected?', state.isConnected);
        if (!state.isConnected) {
          Alert.alert('Please Check your internet', 'Try Again!', [
            {text: 'ok', onPress: () => {}},
          ]);

          reject();
          return;
        }
        var FormData = require('form-data');
        var data = new FormData();

        data.append('docs_data', JSON.stringify(docs_data));
        data.append('user_cnic', user_cnic);
        data.append('action', 0);

        console.log('docs_data-------->', JSON.stringify(docs_data));
        console.log('user_cnic--------->', user_cnic);
        console.log('action--->', 0);

        var config: any = {
          method: 'post',
          url: baseUrlTemp + 'syncupcustomerdocs.php',
          headers: {
            Cookie: 'PHPSESSID=4i7orotrgn9ke0dbbh4cg4geja',
          },
          data: data,
        };

        axios(config)
          .then(async function (response) {
            if (response.data) {
              console.log('uploadObject3==>', response.data);

              resolve(response.data);
            } else {
              reject(response);
            }
          })
          .catch(e => {
            //console.log(e);

            Alert.alert(
              'Please Check your internet',
              'Syncdown Failed! Try Again! \n' + e,
              [{text: 'ok', onPress: () => {}}],
            );

            reject();
          });
      })
      .catch(function (error) {
        //console.log(error);
        Alert.alert(
          'Please Check your internet',
          'Syncdown Failed! Try Again! \n' + error,
          [{text: 'ok', onPress: () => {}}],
        );

        reject();
      });
  });
  return promise;
};

export const sendTempCustomerAssetsImages = (
  image_data: any,
  user_cnic: any,
) => {
  // console.log('image_data==>', image_data)
  const promise = new Promise((resolve, reject) => {
    NetInfo.fetch()
      .then(state => {
        //console.log('Connection type', state.type);
        //console.log('Is connected?', state.isConnected);
        if (!state.isConnected) {
          Alert.alert('Please Check your internet', 'Try Again!', [
            {text: 'ok', onPress: () => {}},
          ]);

          reject();
          return;
        }
        var FormData = require('form-data');
        var data = new FormData();
        data.append('image_data', JSON.stringify(image_data));
        data.append('user_cnic', user_cnic);
        data.append('action', 0);

        var config: any = {
          method: 'post',
          url: baseUrlTemp + 'syncupassetimages.php',
          headers: {
            Cookie: 'PHPSESSID=4i7orotrgn9ke0dbbh4cg4geja',
          },
          data: data,
        };

        axios(config)
          .then(async function (response) {
            console.log('uploadObject asets images==>', response.data);

            resolve(response.data);
          })
          .catch(e => {
            //console.log(e);

            Alert.alert(
              'Please Check your internet',
              'Syncdown Failed! Try Again! \n' + e,
              [{text: 'ok', onPress: () => {}}],
            );

            reject();
          });
      })
      .catch(function (error) {
        //console.log(error);
        Alert.alert(
          'Please Check your internet',
          'Syncdown Failed! Try Again! \n' + error,
          [{text: 'ok', onPress: () => {}}],
        );

        reject();
      });
  });
  return promise;
};

//getting Object
export const getObjectbyBranchManager = (compositeKey: any) => {
  const promise = new Promise((resolve, reject) => {
    NetInfo.fetch()
      .then(state => {
        //console.log('Connection type', state.type);
        //console.log('Is connected?', state.isConnected);
        if (!state.isConnected) {
          Alert.alert('Please Check your internet', 'Try Again!', [
            {text: 'ok', onPress: () => {}},
          ]);

          reject();
          return;
        }
        var FormData = require('form-data');
        var data = new FormData();
        console.log('compositkey=======>', compositeKey);
        data.append('compositkey', compositeKey);

        var config: any = {
          method: 'post',
          url: baseUrlTemp + 'GetData.php',
          headers: {
            Cookie: 'PHPSESSID=6cdvtu73t769ov0dge111hekhi',
          },
          data: data,
        };

        axios(config)
          .then(async function (response) {
            console.log(
              '<=====================sended Objet==========================>',
            );
            console.log('sended Objet==>', response.data);
            console.log(
              '<=====================sended Objet==========================>',
            );

            resolve(response.data);
          })
          .catch(e => {
            //console.log(e);

            Alert.alert(
              'Please Check your internet',
              'Syncdown Failed! Try Again! \n' + e,
              [{text: 'ok', onPress: () => {}}],
            );

            reject();
          });
      })
      .catch(function (error) {
        //console.log(error);
        Alert.alert(
          'Please Check your internet',
          'Syncdown Failed! Try Again! \n' + error,
          [{text: 'ok', onPress: () => {}}],
        );

        reject();
      });
  });
  return promise;
};

//getting BM Data station wise
export const getBmData = (stationId: any, verfication: any) => {
  const promise = new Promise((resolve, reject) => {
    NetInfo.fetch()
      .then(state => {
        console.log('Connection type', state.type);
        console.log('Is connected?', state.isConnected);
        if (!state.isConnected) {
          Alert.alert('Please Check your internet', 'Try Again!', [
            {text: 'ok', onPress: () => {}},
          ]);

          reject();
          return;
        }
        var FormData = require('form-data');
        var data = new FormData();
        console.log('object data========vv====>>>>>', data);

        data.append('station_id', stationId);
        if (verfication) {
          data.append('status', 1);
        }
        console.log('object data=======station_id=====>>>>>', stationId);
        var config: any = {
          method: 'post',
          url: baseUrlTemp + 'GetBmData.php',
          headers: {
            Cookie: 'PHPSESSID=6cdvtu73t769ov0dge111hekhi',
          },
          data: data,
        };

        axios(config)
          .then(async function (response) {
            // console.log('<=====================BMData Objet==========================>')
            console.log('BMData Objet=vv=>', response.data);
            // console.log('<=====================BMData Objet==========================>')
            // return
            resolve(response.data);
          })
          .catch(e => {
            //console.log(e);

            Alert.alert(
              'Please Check your internet',
              'Syncdown Failed! Try Again! \n' + e,
              [{text: 'ok', onPress: () => {}}],
            );

            reject();
          });
      })
      .catch(function (error) {
        //console.log(error);
        Alert.alert(
          'Please Check your internet',
          'Syncdown Failed! Try Again! \n' + error,
          [{text: 'ok', onPress: () => {}}],
        );

        reject();
      });
  });
  return promise;
};
export const deleteLoanOfficerdata = (compositkey: any) => {
  console.log('compositkey==>', compositkey);
  const promise = new Promise((resolve, reject) => {
    NetInfo.fetch()
      .then(state => {
        console.log('Connection type', state.type);
        console.log('Is connected?', state.isConnected);
        if (!state.isConnected) {
          Alert.alert('Please Check your internet', 'Try Again!', [
            {text: 'ok', onPress: () => {}},
          ]);

          reject();
          return;
        }
        var FormData = require('form-data');
        var data = new FormData();
        data.append('compositkey', compositkey);

        var config: any = {
          method: 'post',
          url: baseUrlTemp + 'DeleteData.php',
          headers: {
            Cookie: 'PHPSESSID=6cdvtu73t769ov0dge111hekhi',
          },
          data: data,
        };

        axios(config)
          .then(async function (response) {
            // console.log('<=====================BMData Objet==========================>')
            console.log('BMData Objet==>', response.data);
            // console.log('<=====================BMData Objet==========================>')
            resolve(response.data);
          })
          .catch(e => {
            //console.log(e);

            Alert.alert(
              'Please Check your internet',
              'Syncdown Failed! Try Again! \n' + e,
              [{text: 'ok', onPress: () => {}}],
            );

            reject();
          });
      })
      .catch(function (error) {
        //console.log(error);
        Alert.alert(
          'Please Check your internet',
          'Syncdown Failed! Try Again! \n' + error,
          [{text: 'ok', onPress: () => {}}],
        );

        reject();
      });
  });
  return promise;
};

export const VerifyUser = (user_cnic: string) => {
  console.log('user_cnic==>', user_cnic);
  const promise = new Promise((resolve, reject) => {
    NetInfo.fetch()
      .then(state => {
        console.log('Connection type', state.type);
        console.log('Is connected?', state.isConnected);
        if (!state.isConnected) {
          Alert.alert('Please Check your internet', 'Try Again!', [
            {text: 'ok', onPress: () => {}},
          ]);

          reject();
          return;
        }
        var FormData = require('form-data');
        var data = new FormData();
        data.append('data', user_cnic);

        var config: any = {
          method: 'post',
          url: baseUrl + 'userVerification.php',
          headers: {
            Cookie: 'PHPSESSID=6cdvtu73t769ov0dge111hekhi',
          },
          data: data,
        };

        axios(config)
          .then(async function (response) {
            // console.log('<=====================BMData Objet==========================>')
            console.log('verification==>', response.data);
            // console.log('<=====================BMData Objet==========================>')
            resolve(response.data);
          })
          .catch(e => {
            //console.log(e);

            Alert.alert(
              'Please Check your internet',
              'Syncdown Failed! Try Again! \n' + e,
              [{text: 'ok', onPress: () => {}}],
            );

            reject();
          });
      })
      .catch(function (error) {
        //console.log(error);
        Alert.alert(
          'Please Check your internet',
          'Syncdown Failed! Try Again! \n' + error,
          [{text: 'ok', onPress: () => {}}],
        );

        reject();
      });
  });
  return promise;
};

export const getUserDetailForZM = (userNic: string | Blob) => {
  const promise = new Promise((resolve, reject) => {
    NetInfo.fetch()
      .then(state => {
        console.log('Connection type', state.type);
        console.log('Is connected?', state.isConnected);
        if (!state.isConnected) {
          Alert.alert('Please Check your internet', 'Try Again!', [
            {text: 'ok', onPress: () => {}},
          ]);

          reject();
          return;
        }

        var data = new FormData();

        data.append('cnic', userNic);

        var config: any = {
          method: 'post',
          url: baseUrl + 'getUserData.php',
          headers: {
            Cookie: 'PHPSESSID=6cdvtu73t769ov0dge111hekhi',
          },
          data: data,
        };

        axios(config)
          .then(async function (response) {
            // console.log('<=====================BMData Objet==========================>')
            console.log('userDatailZM==>', response.data)
            // console.log('<=====================BMData Objet==========================>')
            resolve(response.data);
          })
          .catch(e => {
            //console.log(e);

            Alert.alert(
              'Please Check your internet',
              'Syncdown Failed! Try Again! \n' + e,
              [{text: 'ok', onPress: () => {}}],
            );

            reject();
          });
      })
      .catch(function (error) {
        //console.log(error);
        Alert.alert(
          'Please Check your internet',
          'Syncdown Failed! Try Again! \n' + error,
          [{text: 'ok', onPress: () => {}}],
        );

        reject();
      });
  });
  return promise;
};

export const downloadRegioalZonalData = (
  groupIds: any,
  customerLength: number,
  customerNic: any,
) => {
  const promise = new Promise((resolve, reject) => {
    NetInfo.fetch()
      .then(state => {
        console.log('Connection type', state.type);
        console.log('Is connected?', state.isConnected);
        if (!state.isConnected) {
          Alert.alert('Please Check your internet', 'Try Again!', [
            {text: 'ok', onPress: () => {}},
          ]);

          reject();
          return;
        }
        console.log('==>', groupIds);
        var FormData = require('form-data');
        var data = new FormData();

        customerLength > 1
          ? data.append('groupIds', JSON.stringify(groupIds))
          : data.append('cnic', customerNic);

        //data.append('groupIds', JSON.stringify(groupIds));
        console.log('==>', data);

        var config: any = {
          method: 'post',
          url: baseUrl + 'getGroupsData.php',

          data: data,
        };

        axios(config)
          .then(async function (response) {
            //  console.log('<=====================RegioalZonalData Download Objet==========================>')
            //  console.log('RegioalZonalData Objet -------==>',JSON.stringify(response.data) )
            //  console.log('<=====================RegioalZonalData Download Objet==========================>')
            //  return
            if (response.data.length > 0) {
              resolve(response.data);
            } else {
              reject();
            }
            // resolve(response.data);
          })
          .catch(e => {
            //console.log(e);

            Alert.alert(
              'Please Check your internet',
              'Syncdown Failed! Try Again! \n' + e,
              [{text: 'ok', onPress: () => {}}],
            );

            reject();
          });
      })
      .catch(function (error) {
        //console.log(error);
        Alert.alert(
          'Please Check your internet',
          'Syncdown Failed! Try Again! \n' + error,
          [{text: 'ok', onPress: () => {}}],
        );

        reject();
      });
  });
  return promise;
};
export const getRegioalZonalData = (stationId: any) => {
  const promise = new Promise((resolve, reject) => {
    NetInfo.fetch()
      .then(state => {
        console.log('Connection type', state.type);
        console.log('Is connected?', state.isConnected);
        if (!state.isConnected) {
          Alert.alert('Please Check your internet', 'Try Again!', [
            {text: 'ok', onPress: () => {}},
          ]);

          reject();
          return;
        }
        var FormData = require('form-data');
        var data = new FormData();
        data.append('stationid', stationId);

        var config: any = {
          method: 'post',
          url: baseUrl + 'getGroupDataforRMZM.php',

          data: data,
        };

        axios(config)
          .then(async function (response) {
            console.log(
              '<=====================RegioalZonalData Objet==========================>',
            );
            console.log('RegioalZonalData Objet==>', response.data);
            console.log(
              '<=====================RegioalZonalData Objet==========================>',
            );
            if (response?.data?.length > 0) {
              let maker = [];
              response?.data?.map((item: any, index: number) => {
                maker.push({...item, alreadySynced: false});
                if (index == response.data.length - 1) {
                  resolve(maker);
                }
              });
            } else {
              resolve('No data Found');
            }
          })
          .catch(e => {
            //console.log(e);

            Alert.alert(
              'Please Check your internet',
              'Syncdown Failed! Try Again! \n' + e,
              [{text: 'ok', onPress: () => {}}],
            );

            reject();
          });
      })
      .catch(function (error) {
        //console.log(error);
        Alert.alert(
          'Please Check your internet',
          'Syncdown Failed! Try Again! \n' + error,
          [{text: 'ok', onPress: () => {}}],
        );

        reject();
      });
  });
  return promise;
};

export const postCommentbyManagerOperation = (data: {
  employee_id: string;
  employee_typeid: string;
  group_id: string;
  group_comments: string;
  moComment: string;
  groupImage: string;
  visitType: string;
}) => {
  console.log('employee_id==>', data.employee_id);
  console.log('employee_typeid==>', data.employee_typeid);
  console.log('group_comments==>', data.group_id);

  // return

  const promise = new Promise((resolve, reject) => {
    NetInfo.fetch()
      .then(state => {
        console.log('Connection type', state.type);
        console.log('Is connected?', state.isConnected);
        if (!state.isConnected) {
          Alert.alert('Please Check your internet', 'Try Again!', [
            {text: 'ok', onPress: () => {}},
          ]);

          reject();
          return;
        }
        var FormData = require('form-data');
        var makedata = new FormData();
        makedata.append('employee_id', '' + data.employee_id);
        makedata.append('employee_typeid', '' + data.employee_typeid);
        makedata.append('group_id', '' + data.group_id);
        makedata.append('comments_by', 'MO');
        makedata.append('group_comments', '' + data.group_comments);
        makedata.append('group_commentsMO', '' + data.moComment);
        makedata.append('group_Image', '' + data.groupImage);
        makedata.append('visited', '' + data.visitType);
        //  console.log("Group SyncupBy R.M ====>"+JSON.stringify (makedata ))
        //  return
        var config: any = {
          method: 'post',
          url: baseUrl + 'Insert_Comments.php',
          headers: {
            Cookie: 'PHPSESSID=j94rhjfeoqi9ep37ng7kb67inu',
          },
          data: makedata,
        };

        axios(config)
          .then(async function (response) {
            // console.log('<=====================BMData Objet==========================>')
            console.log('verification=-=>', response.data);
            // console.log('<=====================BMData Objet==========================>')

            // return
            resolve(response.data);
          })
          .catch(e => {
            //console.log(e);

            Alert.alert(
              'Please Check your internet',
              'Syncdown Failed! Try Again! \n' + e,
              [{text: 'ok', onPress: () => {}}],
            );

            reject();
          });
      })
      .catch(function (error) {
        //console.log(error);
        Alert.alert(
          'Please Check your internet',
          'Syncdown Failed! Try Again! \n' + error,
          [{text: 'ok', onPress: () => {}}],
        );

        reject();
      });
  });
  return promise;
};

export const UpdateLoanAmount = (data: {
  LoanId: any;
  ApprovedLoanAmount: any;
}) => {
  const {LoanId, ApprovedLoanAmount} = data;
  const promise = new Promise((resolve, reject) => {
    NetInfo.fetch()
      .then(state => {
        console.log('Connection type', state.type);
        console.log('Is connected?', state.isConnected);
        if (!state.isConnected) {
          Alert.alert('Please Check your internet', 'Try Again!', [
            {text: 'ok', onPress: () => {}},
          ]);

          reject();
          return;
        }
        var FormData = require('form-data');
        var makedata = new FormData();
        makedata.append('loan_amount', '' + ApprovedLoanAmount);
        makedata.append('loan_id', '' + LoanId);

        var config: any = {
          method: 'post',
          url: baseUrl + 'UpdateLoanAmount.php',
          headers: {
            Cookie: 'PHPSESSID=j94rhjfeoqi9ep37ng7kb67inu',
          },
          data: makedata,
        };

        axios(config)
          .then(async function (response) {
            // console.log('<=====================BMData Objet==========================>')
            console.log('UpdateLoanAmount==>', response.data);
            // console.log('<=====================BMData Objet==========================>')
            resolve(response.data);
          })
          .catch(e => {
            //console.log(e);

            Alert.alert(
              'Please Check your internet',
              'Syncdown Failed! Try Again! \n' + e,
              [{text: 'ok', onPress: () => {}}],
            );

            reject();
          });
      })
      .catch(function (error) {
        //console.log(error);
        Alert.alert(
          'Please Check your internet',
          'Syncdown Failed! Try Again! \n' + error,
          [{text: 'ok', onPress: () => {}}],
        );

        reject();
      });
  });
  return promise;
};

export const getAllRegion = () => {
  const promise = new Promise((resolve, reject) => {
    NetInfo.fetch()
      .then(state => {
        console.log('Connection type', state.type);
        console.log('Is connected?', state.isConnected);
        if (!state.isConnected) {
          Alert.alert('Please Check your internet', 'Try Again!', [
            {text: 'ok', onPress: () => {}},
          ]);
          reject();
          return;
        }
        var config: any = {
          method: 'post',
          url: baseUrl + 'getRegions.php',
        };
        axios(config)
          .then(async function (response) {
            // console.log('Region==>', response.data)
            resolve(response.data);
          })
          .catch(e => {
            //console.log(e);
            reject();
          });
      })
      .catch(function (error) {
        console.log(error);
        reject();
      });
  });
  return promise;
};

export const getAllDistrict = () => {
  const promise = new Promise((resolve, reject) => {
    NetInfo.fetch()
      .then(state => {
        console.log('Connection type', state.type);
        console.log('Is connected?', state.isConnected);
        if (!state.isConnected) {
          Alert.alert('Please Check your internet', 'Try Again!', [
            {text: 'ok', onPress: () => {}},
          ]);

          reject();
          return;
        }

        var config: any = {
          method: 'post',
          url: baseUrlTemp + 'getDistricts.php',
        };

        axios(config)
          .then(async function (response) {
            // console.log('Region==>', response.data)

            resolve(response.data);
          })
          .catch(e => {
            //console.log(e);

            reject();
          });
      })
      .catch(function (error) {
        console.log(error);

        reject();
      });
  });
  return promise;
};
export const checkingCIBCustomerbyCnic = (getdata: {CNICNumber: any}) => {
  const promsie = new Promise((resolve, reject) => {
    NetInfo.fetch().then(state => {
      console.log('Connection type', state.type);
      console.log('Is connected?', state.isConnected);
      if (!state.isConnected) {
        Alert.alert('Please Check your internet', 'Try Again!', [
          {text: 'ok', onPress: () => {}},
        ]);

        reject(false);
        return;
      }
    });
    var FormData = require('form-data');
    var data = new FormData();
    data.append('action', 'CheckCustomerCNICAvailability');
    data.append('CNICNumber', getdata.CNICNumber);
    data.append('IsApp', '1');
    data.append('Type', 'Customer');

    var config: any = {
      method: 'post',
      url: cibb_url,
      data: data,
    };
    axios(config)
      .then(function (response) {
        console.log(JSON.stringify('=====>', response.data));
        resolve(response.data);
      })
      .catch(function (error) {
        console.log(error);
      });
  });

  return promsie;
};
export const LoanVerificationByCnic = (
  manage_cincNumber: any,
  setProgressVisible: (arg0: boolean) => void,
) => {
  const promsie = new Promise((resolve, reject) => {
    NetInfo.fetch().then(state => {
      console.log('Connection type', state.type);
      console.log('Is connected?', state.isConnected);
      if (!state.isConnected) {
        Alert.alert('Please Check your internet', 'Try Again!', [
          {text: 'ok', onPress: () => {}},
        ]);

        reject(false);
        return;
      }
    });
    setProgressVisible(true);

    var FormData = require('form-data');
    var data = new FormData();
    data.append('cnic', manage_cincNumber);
    var config: any = {
      method: 'post',
      url: baseUrl + 'getCustomerSummary.php',
      data: data,
    };

    axios(config)
      .then(function (response) {
        if (response.data.StatusCode == 201) {
          alert(response.data.Data);
          setProgressVisible(false);
          // setProgressVisible(false)
        } else {
          resolve(response.data);
        }
      })
      .catch(function (error) {
        console.log(error);
      });
  });

  return promsie;
};

export const CreditScoringReport = (
  manage_cincNumber: any,
  setProgressVisible: (arg0: boolean) => void,
) => {
  const promsie = new Promise((resolve, reject) => {
    NetInfo.fetch().then(state => {
      console.log('Connection type', state.type);
      console.log('Is connected?', state.isConnected);
      if (!state.isConnected) {
        Alert.alert('Please Check your internet', 'Try Again!', [
          {text: 'ok', onPress: () => {}},
        ]);

        reject(false);
        return;
      }
    });
    setProgressVisible(true);

    var FormData = require('form-data');
    var data = new FormData();
    data.append('cnic', manage_cincNumber);
    var config: any = {
      method: 'post',
      url: baseUrl + 'CreditScoringReport.php',
      data: data,
    };

    axios(config)
      .then(function (response) {
        console.log('CreditScoringReport==>' + JSON.stringify(response.data));
        if (response.data.StatusCode == 201) {
          alert(response.data.Data);
          setProgressVisible(false);
          // setProgressVisible(false)
        } else {
          resolve(response.data);
        }
      })
      .catch(function (error) {
        console.log(error);
      });
  });

  return promsie;
};
export const CustomerCreditScoringReport = (userCnic: any) => {
  const promsie = new Promise((resolve, reject) => {
    NetInfo.fetch().then(state => {
      console.log('Connection type', state.type);
      console.log('Is connected?', state.isConnected);
      if (!state.isConnected) {
        Alert.alert('Please Check your internet', 'Try Again!', [
          {text: 'ok', onPress: () => {}},
        ]);
        reject(false);
        return;
      }
    });

    var FormData = require('form-data');
    var data = new FormData();
    data.append('cnic', userCnic);
    var config: any = {
      method: 'post',
      url: baseUrl + 'CreditScoringReport.php',
      data: data,
    };

    axios(config)
      .then(function (response) {
        console.log(JSON.stringify('in the end=========>', response.data));

        resolve(response.data);
      })
      .catch(function (error) {
        console.log(error);
      });
  });

  return promsie;
};

export const checkingLoanDataCnic = (getdata: any) => {
  console.log('getdata==>', getdata);
  const promise = new Promise((resolve, reject) => {
    NetInfo.fetch()
      .then(state => {
        console.log('Connection type', state.type);
        console.log('Is connected?', state.isConnected);
        if (!state.isConnected) {
          Alert.alert('Please Check your internet', 'Try Again!', [
            {text: 'ok', onPress: () => {}},
          ]);

          reject();
          return;
        }

        var FormData = require('form-data');
        var data = new FormData();
        data.append('cnic', JSON.stringify(getdata));
        var config: any = {
          method: 'post',
          url: baseUrl + 'getOfficeDataNIC.php',
          headers: {
            Cookie: 'PHPSESSID=u9d5idp8v7fd6hl045jck516fe',
          },
          data: data,
        };

        axios(config)
          .then(async function (response) {
            // console.log('Region==>', response.data)

            resolve(response.data);
          })
          .catch(e => {
            //console.log(e);

            reject();
          });
      })
      .catch(function (error) {
        console.log(error);

        reject();
      });
  });
  return promise;
};

export const generatingCIB = async (
  getdata: {
    txtFirstName: string;
    txtLastName: string;
    txtNICNumber1: string;
    txtNICNumber2: string;
    txtNICNumber3: string;
    txtApplicationDate: string;
    txtRequestedAmount: string;
    selStation: string;
    selStatus: string;
    txtNotes: string;
    selRegion: string;
    selCustomerType: string;
    selGuardianType: string;
    txtGuardian: string;
    selGender: string;
    txtDateOfBirth: string;
    txtFamilyNumber: string;
    txtNICExpiryDate: string;
    txtAddress: string;
    txtCity: string;
    selDistrict: string;
    selAccountType: string;
    selAssociationType: string;
    txtGroupId: string;
    txtMobileNumber: string;
    txtPhoneNumber: string;
    txtEmailAddress: string;
    txtAddedBy: string;
    CO_CNIC_1: string;
    CO_FIRST_NAME_1: string;
    CO_MID_NAME_1: string;
    CO_LAST_NAME_1: string;
    CO_CNIC_2: string;
    CO_FIRST_NAME_2: string;
    CO_MID_NAME_2: string;
    CO_LAST_NAME_2: string;
    CO_CNIC_3: string;
    CO_FIRST_NAME_3: string;
    CO_MID_NAME_3: string;
    CO_LAST_NAME_3: string;
    CO_CNIC_4: string;
    CO_FIRST_NAME_4: string;
    CO_MID_NAME_4: string;
    CO_LAST_NAME_4: string;
  },
  organizationType: string,
) => {
  const promsie = new Promise((resolve, reject) => {
    NetInfo.fetch().then(state => {
      console.log('Connection type', state.type);
      console.log('Is connected?', state.isConnected);
      if (!state.isConnected) {
        Alert.alert('Please Check your internet', 'Try Again!', [
          {text: 'ok', onPress: () => {}},
        ]);

        reject(false);
        return;
      }
    });

    var FormData = require('form-data');
    var data = new FormData();
    data.append('action', 'AddNewCustomer');
    data.append('txtFirstName', '' + getdata?.txtFirstName);
    data.append('txtLastName', '' + getdata?.txtLastName);
    data.append('txtNICNumber1', '' + getdata?.txtNICNumber1);
    data.append('txtNICNumber2', '' + getdata?.txtNICNumber2);
    data.append('txtNICNumber3', '' + getdata?.txtNICNumber3);
    data.append('txtApplicationDate', '' + getdata?.txtApplicationDate);
    data.append('txtRequestedAmount', '' + getdata?.txtRequestedAmount);
    data.append('selStation', '' + getdata?.selStation);
    data.append('selStatus', '' + getdata?.selStatus);
    data.append('txtNotes', '' + getdata?.txtNotes);
    data.append('selRegion', '' + getdata?.selRegion);
    data.append('selCustomerType', '' + getdata?.selCustomerType);
    data.append('selGuardianType', '' + getdata?.selGuardianType);
    data.append('txtGuardian', '' + getdata?.txtGuardian);
    data.append('selGender', '' + getdata?.selGender);
    data.append('txtDateOfBirth', '' + getdata?.txtDateOfBirth);
    data.append('txtFamilyNumber', '' + getdata?.txtFamilyNumber);
    data.append('txtNICExpiryDate', '' + getdata?.txtNICExpiryDate);
    data.append('txtAddress', '' + getdata?.txtAddress);
    data.append('txtCity', '' + getdata?.txtCity);
    data.append('selDistrict', '' + getdata?.selDistrict);
    data.append('selAccountType', '' + getdata?.selAccountType);
    data.append('selAssociationType', '' + getdata?.selAssociationType);
    data.append('txtGroupId', '' + getdata?.txtGroupId);
    data.append('txtMobileNumber', '' + getdata?.txtMobileNumber);
    data.append('txtPhoneNumber', '' + getdata?.txtPhoneNumber);
    data.append('txtEmailAddress', '' + getdata?.txtEmailAddress);
    data.append('txtAddedBy', '' + getdata?.txtAddedBy);
    data.append('OrganizationType', '' + organizationType);

    //data.append('CO_CNIC_1', '1234567891234');
    data.append('CO_CNIC_1', '' + getdata?.CO_CNIC_1);
    data.append('CO_FIRST_NAME_1', '' + getdata?.CO_FIRST_NAME_1);
    data.append('CO_MID_NAME_1', '' + getdata?.CO_MID_NAME_1);
    data.append('CO_LAST_NAME_1', '' + getdata?.CO_LAST_NAME_1);

    data.append('CO_CNIC_2', '' + getdata?.CO_CNIC_2);
    data.append('CO_FIRST_NAME_2', '' + getdata?.CO_FIRST_NAME_2);
    data.append('CO_MID_NAME_2', '' + getdata?.CO_MID_NAME_2);
    data.append('CO_LAST_NAME_2', '' + getdata?.CO_LAST_NAME_2);

    data.append('CO_CNIC_3', '' + getdata?.CO_CNIC_3);
    data.append('CO_FIRST_NAME_3', '' + getdata?.CO_FIRST_NAME_3);
    data.append('CO_MID_NAME_3', '' + getdata?.CO_MID_NAME_3);
    data.append('CO_LAST_NAME_3', '' + getdata?.CO_LAST_NAME_3);

    data.append('CO_CNIC_4', '' + getdata?.CO_CNIC_4);
    data.append('CO_FIRST_NAME_4', '' + getdata?.CO_FIRST_NAME_4);
    data.append('CO_MID_NAME_4', '' + getdata?.CO_MID_NAME_4);
    data.append('CO_LAST_NAME_4', '' + getdata?.CO_LAST_NAME_4);

    console.log('here CIB FOrm Data-=============>' + JSON.stringify(data));
    // return
    var config: any = {
      method: 'post',
      url: cibb_url,
      data: data,
    };
    axios(config)
      .then(function (response) {
        console.log(
          'test cib response==========>>>>>' + JSON.stringify(response.data),
        );
        // return
        resolve(response.data);
      })
      .catch(function (error) {
        reject(error);
      });
  });
  return promsie;
};

export const fetchCIBReport = async (customerNic: any) => {
  const promsie = new Promise((resolve, reject) => {
    NetInfo.fetch().then(state => {
      console.log('Connection type', state.type);
      console.log('Is connected?', state.isConnected);
      if (!state.isConnected) {
        Alert.alert('Please Check your internet', 'Try Again!', [
          {text: 'ok', onPress: () => {}},
        ]);

        reject(false);
        return;
      }
    });
    var FormData = require('form-data');
    var data = new FormData();
    data.append('action', 'GetCIBReportByCNIC');
    data.append('txtCNIC', customerNic);

    // return

    var config: any = {
      method: 'post',
      url: cibb_url,
      data: data,
    };

    axios(config)
      .then(function (response) {
        resolve(response.data);
      })
      .catch(function (error) {
        reject(error);
      });
  });
  return promsie;
};
//Start
export const getCustomerNextKin = async (customerNic: string | Blob) => {
  const promsie = new Promise((resolve, reject) => {
    var data = new FormData();
    data.append('cnic', customerNic);
    var config: any = {
      method: 'post',
      url: baseUrl + 'getCustomerNextKin.php',
      data: data,
    };

    axios(config)
      .then(function (response) {
        resolve(response.data);
      })
      .catch(function (error) {
        reject(error);
      });
  });
  return promsie;
};
//End

export const generatingCIR = async (
  getdata: {
    txtFirstName: string;
    txtLastName: string;
    txtNICNumber1: string;
    txtNICNumber2: string;
    txtNICNumber3: string;
    txtApplicationDate: string;
    txtRequestedAmount: string;
    selStation: string;
    selStatus: string;
    txtNotes: string;
    selRegion: string;
    selCustomerType: string;
    selGuardianType: string;
    txtGuardian: string;
    selGender: string;
    txtDateOfBirth: string;
    txtFamilyNumber: string;
    txtNICExpiryDate: string;
    txtAddress: string;
    txtCity: string;
    selDistrict: string;
    selAccountType: string;
    selAssociationType: string;
    txtGroupId: string;
    txtMobileNumber: string;
    txtPhoneNumber: string;
    txtEmailAddress: string;
    txtAddedBy: string;
  },
  organizationType: string,
) => {
  const promsie = new Promise((resolve, reject) => {
    NetInfo.fetch().then(state => {
      console.log('Connection type', state.type);
      console.log('Is connected?', state.isConnected);
      if (!state.isConnected) {
        Alert.alert('Please Check your internet', 'Try Again!', [
          {text: 'ok', onPress: () => {}},
        ]);

        reject(false);
        return;
      }
    });
    var FormData = require('form-data');
    var data = new FormData();
    data.append('action', 'AddNewCustomer');
    data.append('txtFirstName', '' + getdata?.txtFirstName);
    data.append('txtLastName', '' + getdata?.txtLastName);
    data.append('txtNICNumber1', '' + getdata?.txtNICNumber1);
    data.append('txtNICNumber2', '' + getdata?.txtNICNumber2);
    data.append('txtNICNumber3', '' + getdata?.txtNICNumber3);
    data.append('txtApplicationDate', '' + getdata?.txtApplicationDate);
    data.append('txtRequestedAmount', '' + getdata?.txtRequestedAmount);
    data.append('selStation', '' + getdata?.selStation);
    data.append('selStatus', '' + getdata?.selStatus);
    data.append('txtNotes', '' + getdata?.txtNotes);
    data.append('selRegion', '' + getdata?.selRegion);
    data.append('selCustomerType', '' + getdata?.selCustomerType);
    data.append('selGuardianType', '' + getdata?.selGuardianType);
    data.append('txtGuardian', '' + getdata?.txtGuardian);
    data.append('selGender', '' + getdata?.selGender);
    data.append('txtDateOfBirth', '' + getdata?.txtDateOfBirth);
    data.append('txtFamilyNumber', '' + getdata?.txtFamilyNumber);
    data.append('txtNICExpiryDate', '' + getdata?.txtNICExpiryDate);
    data.append('txtAddress', '' + getdata?.txtAddress);
    data.append('txtCity', '' + getdata?.txtCity);
    data.append('selDistrict', '' + getdata?.selDistrict);
    data.append('selAccountType', '' + getdata?.selAccountType);
    data.append('selAssociationType', '' + getdata?.selAssociationType);
    data.append('txtGroupId', '' + getdata?.txtGroupId);
    data.append('txtMobileNumber', '' + getdata?.txtMobileNumber);
    data.append('txtPhoneNumber', '' + getdata?.txtPhoneNumber);
    data.append('txtEmailAddress', '' + getdata?.txtEmailAddress);
    data.append('txtAddedBy', '' + getdata?.txtAddedBy);
    data.append('OrganizationType', '' + organizationType);

    var config: any = {
      method: 'post',
      url: temp,
      data: data,
    };

    axios(config)
      .then(function (response) {
        console.log('here appi -->', JSON.stringify(response.data));
        resolve(response.data);
      })
      .catch(function (error) {
        reject(error);
      });
  });
  return promsie;
};

export const fetchCIRReport = async (customerNic: any) => {
  const promsie = new Promise((resolve, reject) => {
    NetInfo.fetch().then(state => {
      console.log('Connection type', state.type);
      console.log('Is connected?', state.isConnected);
      if (!state.isConnected) {
        Alert.alert('Please Check your internet', 'Try Again!', [
          {text: 'ok', onPress: () => {}},
        ]);

        reject(false);
        return;
      }
    });
    var FormData = require('form-data');
    var data = new FormData();
    data.append('action', 'GetCIRReportByCNIC');
    data.append('txtCNIC', customerNic);
    var config: any = {
      method: 'post',
      url: temp,
      data: data,
    };
    axios(config)
      .then(function (response) {
        resolve(response.data);
      })
      .catch(function (error) {
        reject(error);
      });
  });
  return promsie;
};

export const checkingCIRCustomerbyCnic = (getdata: {CNICNumber: string}) => {
  console.log(
    'checkingCIRCustomerbyCnic',
    getdata.CNICNumber.replace('-', '').replace('-', ''),
  );
  const promsie = new Promise((resolve, reject) => {
    NetInfo.fetch().then(state => {
      console.log('Connection type', state.type);
      console.log('Is connected?', state.isConnected);
      if (!state.isConnected) {
        Alert.alert('Please Check your internet', 'Try Again!', [
          {text: 'ok', onPress: () => {}},
        ]);

        reject(false);
        return;
      }
    });
    var FormData = require('form-data');
    var data = new FormData();
    data.append('action', 'CheckCustomerCNICAvailability');
    data.append(
      'CNICNumber',
      getdata.CNICNumber.replace('-', '').replace('-', ''),
    );
    data.append('IsApp', '1');
    data.append('Type', 'Customer');

    var config: any = {
      method: 'post',
      url: temp,
      data: data,
    };
    axios(config)
      .then(function (response) {
        resolve(response.data);
      })
      .catch(function (error) {
        console.log(error);
      });
  });

  return promsie;
};

export const registerClientConsent = (clientData: any) => {
  console.log('clint ===>', clientData);

  const promsie = new Promise((resolve, reject) => {
    NetInfo.fetch().then(state => {
      console.log('Connection type', state.type);
      console.log('Is connected?', state.isConnected);
      if (!state.isConnected) {
        Alert.alert('Please Check your internet', 'Try Again!', [
          {text: 'ok', onPress: () => {}},
        ]);

        reject(false);
        return;
      }
    });
    var FormData = require('form-data');
    var data = new FormData();
    data.append('data', JSON.stringify(clientData));
    var config: any = {
      method: 'post',
      url: baseUrl + 'customer_consentForm.php',
      data: data,
    };
    axios(config)
      .then(function (response) {
        if (response.data == 'customer did not found!') {
          reject('customer did not found!');
        } else if (response.data == 'something went wrong try again later') {
          reject('something went wrong try again later');
        } else if (response.data == 'Customer Already Exist') {
          reject('Customer Already Exist');
        } else {
          resolve(response.data);
        }
      })
      .catch(function (error) {
        console.log('customer_consentForm Error==>' + error);
        reject('Network Error');
      });
  });

  return promsie;
};

export const getCustomerForConsent = (customerCnic: any) => {
  const promsie = new Promise((resolve, reject) => {
    NetInfo.fetch().then(state => {
      console.log('Connection type', state.type);
      console.log('Is connected?', state.isConnected);
      if (!state.isConnected) {
        Alert.alert('Please Check your internet', 'Try Again!', [
          {text: 'ok', onPress: () => {}},
        ]);

        reject(false);
        return;
      }
    });
    var FormData = require('form-data');
    var data = new FormData();
    data.append('customerCNIC', customerCnic);
    var config: any = {
      method: 'post',
      url: baseUrl + 'customer_consenFormDetails.php',
      data: data,
    };
    axios(config)
      .then(function (response) {
        if (response.data == 'customer do not found') {
          reject('customer do not found');
        } else {
          resolve(response.data);
        }
      })
      .catch(function (error) {
        console.log('getCustomerForConsent Error==>' + error);
        reject('Network Error');
      });
  });

  return promsie;
};

export const customerMatchedFromLiveDb = (fingerPrintArray: string | any[]) => {
  var fingerPrint = JSON.stringify({fingerPrint: fingerPrintArray});
  const promsie = new Promise((resolve, reject) => {
    NetInfo.fetch().then(state => {
      console.log('Connection type', state.type);
      console.log('Is connected?', state.isConnected);
      if (!state.isConnected) {
        Alert.alert('Please Check your internet', 'Try Again!', [
          {text: 'ok', onPress: () => {}},
        ]);

        reject(false);
        return;
      }
    });
    var FormData = require('form-data');
    var data = new FormData();
    data.append('cusFingerPrint', fingerPrint);
    var config: any = {
      method: 'post',
      url: baseUrl + 'verifyCustomerAndStatus.php',
      data: data,
    };
    axios(config)
      .then(async function (response) {
        let getData = response?.data;
        if (getData?.StatusCode == 400) {
          resolve('customer do not found');
        } else {
          let filedata = getData?.Data;
          for (let y = 0; y < fingerPrintArray.length; y++) {
            for (let z = 0; z < filedata.length; z++) {
              if (filedata[z].FPImageTemp != '') {
                try {
                  const eventId = await FingerModule.matchPrintTwo(
                    fingerPrintArray[y].customerFingerPrint,
                    filedata[z].FPImageTemp,
                  );
                  if (eventId == 1) {
                    console.log('==>', eventId);
                    resolve('fingerprint matched');
                    break;
                  }
                } catch (error) {
                  reject('Fingerprint not matched from live customers');
                }
              }
            }
          }
        }
      })
      .catch(function (error) {
        console.log('getCustomerByThumbPrint Error==>' + error);
        reject('Network Error');
      });
  });
  return promsie;
};

export const checkCustomerByThumbPrint = (customerCnic: any) => {
  var fingerPrint = JSON.stringify({
    fingerPrint: [{customerCnic: customerCnic}],
  });

  console.log(fingerPrint);
  const promsie = new Promise((resolve, reject) => {
    NetInfo.fetch().then(state => {
      console.log('Connection type', state.type);
      console.log('Is connected?', state.isConnected);
      if (!state.isConnected) {
        Alert.alert('Please Check your internet', 'Try Again!', [
          {text: 'ok', onPress: () => {}},
        ]);

        reject(false);
        return;
      }
    });
    var FormData = require('form-data');
    var data = new FormData();
    data.append('cusFingerPrint', fingerPrint);
    var config: any = {
      method: 'post',
      url: baseUrl + 'verifyCustomerAndStatus.php',
      data: data,
    };
    axios(config)
      .then(function (response) {
        if (response?.data?.StatusCode == 400) {
          resolve('Fingerprint not matched');
        } else {
          reject('Fingerprint matched!');
        }
      })
      .catch(function (error) {
        console.log('checkCustomerByThumbPrint Error==>' + error);
        reject('Network Error');
      });
  });
  return promsie;
};

export const checkApplicationVersion = () => {
  const promsie = new Promise((resolve, reject) => {
    NetInfo.fetch().then(state => {
      console.log('Connection type', state.type);
      console.log('Is connected?', state.isConnected);
      if (!state.isConnected) {
        Alert.alert('Please Check your internet', 'Try Again!', [
          {text: 'ok', onPress: () => {}},
        ]);
        reject(false);
        return;
      }
    });
    var config: any = {
      method: 'post',
      url: baseUrl + 'checkAppVersion.php',
    };
    axios(config)
      .then(function (response) {
        if (response.data.StatusCode == 200) {
          console.log('Version ===>', response.data);
          resolve(response.data);
        } else {
          reject('Not any restriction on application version');
        }
      })
      .catch(function (error) {
        console.log('checkingApplicationVersion  Error==>' + error);
        reject('Network Error');
      });
  });
  return promsie;
};
export const getDonorData = async StationId => {
  const promsie = new Promise((resolve, reject) => {
    var data = new FormData();
    data.append('stationId', StationId);
    var config: any = {
      method: 'post',
      url: baseUrl + 'getDonorData.php',
      data: data,
    };

    axios(config)
      .then(function (res) {
        return;
      })
      .catch(function (error) {
        reject(error);
      });
  });
  return promsie;
};
export const getUserComplain = async () => {
  const promsie = new Promise((resolve, reject) => {
    NetInfo.fetch()
      .then(state => {
        if (!state.isConnected) {
          Alert.alert('Please Check your internet', 'Try Again!', [
            {text: 'ok', onPress: () => {}},
          ]);
          reject();
          return;
        }
        var data = new FormData();
        data.append('action', 'GetEmployeeComplainTypes');
        var config: any = {
          method: 'post',
          url: baseUrl + 'Employee_Complains.php',
          data: data,
        };
        axios(config).then(function (res) {
          resolve(res.data);
        });
      })
      .catch(function (error) {
        reject(error);
      });
  });
  return promsie;
};
export const ComplainMis = async (
  ComplainTypesId,
  status,
  prio,
  name,
  Description,
  EmployeeId,
  setProgresss,
  compDesignation,
) => {
  setProgresss(true);
  const promsie = new Promise((resolve, reject) => {
    NetInfo.fetch()
      .then(state => {
        if (!state.isConnected) {
          Alert.alert('Please Check your internet', 'Try Again!', [
            {text: 'ok', onPress: () => {}},
          ]);
          reject();
          return;
        }
        const misDAta = {
          CompTypes: ComplainTypesId,
          status: 1,
          priority: prio,
          added_by: EmployeeId,
          Description: Description,
          compDesignation: compDesignation,
        };
        var data = new FormData();
        data.append('action', 'AddEmployeeComplain');
        data.append('data', JSON.stringify(misDAta));
        console.log('dATE TIME', misDAta);
        var config: any = {
          method: 'post',
          url: baseUrl + 'Employee_Complains.php',
          data: data,
        };
        axios(config).then(function (res) {
          console.log('API response:', res.data);
          setProgresss(false);
          resolve(res.data);
        });
      })
      .catch(function (error) {
        console.log('Axios error:', error);
        setProgresss(false);
        reject(error);
      });
  });
  return promsie;
};

export const fetchLoanStatusReport = async (
  EmployeeId,
  StationId,
  startDate,
  endDate,
  setProgresss,
) => {
  setProgresss(true);

  const promise = new Promise((resolve, reject) => {
    NetInfo.fetch()
      .then(state => {
        if (!state.isConnected) {
          Alert.alert('No internet connection', 'Please check your internet and try again!', [
            { text: 'OK', onPress: () => {} },
          ]);
          setProgresss(false);
          reject();
          return;
        }
        const formattedStartDate = startDate ? startDate.toISOString().split('T')[0] : null;
        const formattedEndDate = endDate ? endDate.toISOString().split('T')[0] : null;
        // Preparing the report data
        const formData = new FormData();
        formData.append('EmployeeId', EmployeeId);
        formData.append('StationId', StationId);
        formData.append('startDate', formattedStartDate);
        formData.append('endDate', formattedEndDate);

        console.log('Form Data:', formData);

        const config = {
          method: 'post',
          url: baseUrl + 'loan_officer_case_report.php', 
          headers: {
            'Content-Type': 'multipart/form-data',
          },
          data: formData,  
        };

        // Make the API request
        axios(config)
          .then(res => {

            if (res.data == '') {
              console.log('No data found between selected dates');
   
             Alert.alert('No Cases Found', 'There is no case between these dates that you selected.');  // Show specific message
             setProgresss(false);
            }

            else
            {     
             console.log('Response Data:', res.data);
           
            console.log('Full API Response:', JSON.stringify(res.data, null, 2));
            setProgresss(false);
            resolve(res.data);  
            }
          })
          .catch(error => {
            console.log('Axios error:', error);
            setProgresss(false);
            reject(error);  // Reject on error
          });
      })
      .catch(error => {
        console.log('Network error:', error);
        setProgresss(false);
        reject(error);  // Reject on network failure
      });
  });

  return promise;
};

export const getComplainDesignation = async () => {
  try {
    const response = await axios.get(`${baseUrl}complaindesignation.php`);
    if (response.data && response.data.message) {
      const complainDesignationOptions = [];
      response.data.message.map(item => {
        complainDesignationOptions.push({id: item[0], name: item[1]});
      });
      console.log('complain designation', complainDesignationOptions);
      const sortedOptions = complainDesignationOptions
        .filter(option => option.name)
        .sort((a, b) => (a.name || '').localeCompare(b.name || ''));
      return sortedOptions;
    } else {
      console.log(
        'Error fetching complain designation1:',
        'Invalid response structure',
      );
      throw new Error('Invalid response structure');
    }
  } catch (error) {
    console.log('error fetching complain designation:', error.message);
    throw error;
  }
};
export const getComplain = async (EmployeeId, setProgresss) => {
  setProgresss(true);
  const promsie = new Promise((resolve, reject) => {
    NetInfo.fetch()
      .then(state => {
        if (!state.isConnected) {
          Alert.alert('Please Check your internet', 'Try Again!', [
            {text: 'ok', onPress: () => {}},
          ]);
          reject();
          return;
        }
        var data = new FormData();
        data.append('action', 'GetEmployeeComplains');
        data.append('EmployeeId', EmployeeId);
        var config: any = {
          method: 'post',
          url: baseUrl + 'Employee_Complains.php',
          data: data,
        };
        axios(config).then(function (res) {
          console.log('getEMployeeCOmplains', res.data);
          setProgresss(false);
          resolve(res);
        });
      })
      .catch(function (error) {
        setProgresss(false);
        reject(error);
      });
  });
  return promsie;
};
export const updateComplain = async (
  complainid,
  employeeid,
  status,
  comments,
  ComplainImage,
  setProgress,
) => {
  setProgress(true);
  try {
    const state = await NetInfo.fetch();
    if (!state.isConnected) {
      Alert.alert('Please check your internet', 'Try Again!', [
        {text: 'ok', onPress: () => {}},
      ]);
      throw new Error('No internet connection');
    }
    const data = new FormData();

    data.append('action', 'UpdateEmployeeComplain');
    data.append('complainid', employeeid);
    data.append('employeeid', complainid);
    data.append('status', status);
    data.append('comments', comments);
    data.append('ComplainImage', ComplainImage);
    console.log('ComplainImage', ComplainImage);
    const config = {
      method: 'post',
      url: baseUrl + 'updatecomplain.php',
      data: data,
    };
    const response = await axios(config);
    console.log('Update Complain Response:', response.data);
    setProgress(false);
    return response.data;
  } catch (error) {
    setProgress(false);
    console.error('Error:', error);
    throw error;
  }
};

export const EditComplain = async (
  ComplainTypesId,
  status,
  prio,
  name,
  Description,
  EmployeeId,
  setProgresss,
  compDesignation,
  ComplainedId,
) => {
  setProgresss(true);
  const promise = new Promise((resolve, reject) => {
    NetInfo.fetch()
      .then(state => {
        if (!state.isConnected) {
          Alert.alert('Please Check your internet', 'Try Again!', [
            {text: 'ok', onPress: () => {}},
          ]);
          reject();
          return;
        }
        const editData = {
          CompTypes: ComplainTypesId,
          status: 1,
          priority: prio,
          added_by: EmployeeId,
          Description: Description,
          compDesignation: compDesignation,
          ComplainId: ComplainedId,
        };
        var data = new FormData();
        data.append('action', 'EditEmployeeComplainWithMobile');
        data.append('data', JSON.stringify(editData));
        console.log('EDIT DATA', editData);
        var config: any = {
          method: 'post',
          url: baseUrl + 'Employee_Complains.php',
          data: data,
        };
        axios(config).then(function (res) {
          console.log('API response:', res.data);
          setProgresss(false);
          resolve(res.data);
        });
      })
      .catch(function (error) {
        console.log('Axios error:', error);
        setProgresss(false);
        reject(error);
      });
  });
  return promise;
};

//my savingbusiness amout code
const SavingAmount = async () => {
  var data = new FormData();
  data.append('savingbusiness', 'Business Saving Amount');
  try {
    const response = await post(data);
    if (response.statusCode === 200) {
      return response.message;
    } else {
      throw new Error(response.message);
    }
  } catch (error) {
    throw error;
  }
};

const post = async userData => {
  var config = {
    method: 'POST',
    url: 'http://119.160.107.37/employees/ReactData/savingbusiness.php',
    headers: {'Content-Type': 'multipart/form-data'},
    data: userData,
  };
  let responce;
  try {
    await axios(config).then(res => {
      responce = res.data;
    });
  } catch (error) {
    alert('Please connect your Internet');
  }
  return responce;
};

const postRequest = async data => {
  const config = {
    method: 'POST',
    url: 'http://119.160.107.37/employees/ReactData/savingbusinessoption.php',
    headers: {'Content-Type': 'multipart/form-data'},
    data: data,
  };

  try {
    const response = await axios(config);
    return response.data;
  } catch (error) {
    console.error('Error:', error);
    return null;
  }
};

const SavingBusinessoptions = async () => {
  const dataParams = [
    'BusinessSavingNormal',
    'BusinessSavingPersonal',
    'BusinessSavingIndividualandIslamic',
  ];

  const responses = [];

  for (const param of dataParams) {
    const data = new FormData();
    data.append('SavingBusinessoptions', param);

    const response = await postRequest(data);
    if (response) {
      responses.push({[param]: response.message});
    } else {
      responses.push({[param]: 'Error'});
    }
  }

  return responses;
};

export {SavingAmount, SavingBusinessoptions};

// HRMS getPaySlip added by M.O
export const getPaySlip = async (EmployeeId, retryCount = 0) => {
  try {
    const state = await NetInfo.fetch();
    if (!state.isConnected) {
      throw new Error('No internet connection');
    }
   
    const response = await axios.get(
      `http://hr.safcomicrofinance.com.pk/hr/Services/PaySlipService.php?EmployeeId=${EmployeeId}`,
    );
    console.log('response', response.data);
    return response.data;
  } catch (error) {
    const maxRetries = 1;
    if (retryCount < maxRetries && error.message != 'No internet connection') {
      const delay = 2000;
      await new Promise(resolve => setTimeout(resolve, delay));
      return getPaySlip(EmployeeId, retryCount + 1);
    }
    throw error;
  }
};

// OTP SYNC UP added by M.O
// export const oTpSyncUp = async( cnicnumber, mobilenumber) =>{
//   try{
//     const state = await NetInfo.fetch();
//     if(!state.isConnected){
//       Alert.alert('Please check your internet', 'Try Again!',[
//         {text: 'ok', onPress: ()=>{}},
//       ]);
//       throw new Error('No internet connection');
//     }
//     const data = new FormData();
//     data.append('cnicnumber', cnicnumber);
//     data.append('mobilenumber', mobilenumber);
//     const config = {
//       method: 'post',
//       url: baseUrl + 'otpsyncup.php',
//       data: data,
//     };
//     const response = await axios(config);
//     console.log('response:', response.data);
//     return response.data;
//   } catch (error){
//     console.error('Error:', error);
//     throw error;
//   }
// };

// hrms getEmployeeComplain



export const getEmployeeComplain = async () => {
  try {
    const state = await NetInfo.fetch();
    if (!state.isConnected) {
      Alert.alert('Please Check your internet', 'Try Again!', [
        { text: 'ok', onPress: () => {} },
      ]);
      throw new Error('No internet connection');
    }

    const response = await axios.get('http://hr.safcomicrofinance.com.pk/hr/employees/staff_complains_api.php?action=GetEmployeeComplains'
    );

   
    return response.data;
  } catch (error) {
    console.error('Error fetching data:', error); // Log any errors
    throw error;
  }
};


// export const checkLoanActive = (customer_nextKinCnic) => {
//   console.log('Checking Loan for Next Kin CNIC:', customer_nextKinCnic);

//   return new Promise((resolve, reject) => {
//     NetInfo.fetch()
//       .then(state => {
//         if (!state.isConnected) {
//           reject(new Error('No internet connection'));
//           return;
//         }

//         const data = new FormData();
//         data.append('customer_nextKinCnic', customer_nextKinCnic);
//         console.log('Checking Loan for Next Kin CNICssss:', customer_nextKinCnic);


//         const config = {
//           method: 'post',
//           url: baseUrl + 'checkloanactive.php',
          
//           headers: {
//             Cookie: 'PHPSESSID=3fk5416nqaq5k85ltdjb0no4s5',
//           },
//           data,
//         };

//         axios(config)
//           .then(response => {
//             console.log('Response:', response);
//             console.log('API Response:', response.data);
//             resolve(response.data);
//           })
//           .catch(error => {
//             console.error('API Request Error:', error);
//             reject(error);
//           });
//       })
//       .catch(error => {
//         console.error('Connectivity Check Error:', error);
//         reject(error);
//       });
//   });
// };