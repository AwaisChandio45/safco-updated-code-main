import SQLite from 'react-native-sqlite-storage';
SQLite.enablePromise(true);
// SQLite.DEBUG(true);

const database_name = 'SafcoMicrofinance_Main_Database.db';
const database_version = '1.0';
const database_displayname = 'Safco Microfinance Database';
const database_size = 2000000;

// ********************* CREATE DATABASE *********************
export const CreateDatabaseauto = async (response) => {

  const promise =  new  Promise(async (resolve, reject) => {

    try {
    //do something and return result on success
    const keys = Object.keys(response);
    let DB = await SQLite.openDatabase(
      database_name,
      database_version,
      database_displayname,
      database_size,
    );
    for (const item of keys) {
      if (response[item] && response[item].length > 0) {
        const reducer = (accumulator, currentValue) =>
          accumulator + currentValue + ' VARCHAR(200),';
        let a = Object.keys(response[item][0]).reduce(
          reducer,
          `CREATE TABLE IF NOT EXISTS ${item} (`,
        );
        // let stringAfterFilter = a.replace(/[&\/\\#+$~%.':*?<>{}]/g, '');
        a = a.substring(0, a.length - 1) + ')';
        DB.transaction((txn) => {
          txn.executeSql(a, []);
        })
          .then((res) => {
            //console.log(`Tabel Created Successfully ${item}`);
          })
          .catch((err) => {
            reject(err);
            //console.log(`------------>>> error in ${item}`, err);
          });
      } else {
        //console.log(
          // 'Error Table Cant be Created due to its has Null Or empty array',
        // );
      }
    }
   resolve("Success")

   }catch(msg) { reject(msg);}

   });

  return promise;
}
export const CreateDatabaseManually=async()=>{
  // Creating Group Form RepaymentInfo
  let DB = await SQLite.openDatabase(
    database_name,
    database_version,
    database_displayname,
    database_size,
  );
  DB.transaction(
    tx => {
      tx.executeSql(
        'CREATE TABLE IF NOT EXISTS RepaymentInfo (LoanId TEXT, CutomerId TEXT, custFullName TEXT,EmployeeId TEXT,NICNumber TEXT, StatoinName TEXT,ChequeNumber TEXT, iOtherFees TEXT,dRegistrationFees TEXT,dEmergencyFund TEXT, dTotalLoanAmount TEXT,Approve_amount TEXT, dServiceChargesRate TEXT,RepaymentStartDate TEXT, FPImageTemp TEXT,CustomerGroupId TEXT,Totalpaid TEXT, StaionId TEXT,LastRepaymentAmount TEXT,LastRepaymentDateTime TEXT,CurrentRepaymentAmount TEXT, CurrentRepaymentDateTime TEXT)',
      );
    },
    (_, error) => { 
      //console.log('db error RepaymentInfo tables');
      //console.log(error);
    },
    (_, success) => {
      //console.log('db sucess RepaymentInfo tables');
    },
  );
}

export const CreateRepaymentLogTable=async()=>{
  // Creating Group Form RepaymentInfo
  let DB = await SQLite.openDatabase(
    database_name,
    database_version,
    database_displayname,
    database_size,
  );
  DB.transaction(
    tx => {
      tx.executeSql(
        'CREATE TABLE IF NOT EXISTS RepaymentLog (repaymentLog_id INTEGER PRIMARY KEY AUTOINCREMENT, loanId TEXT, customerGroupId TEXT,StationId TEXT,NICNumber TEXT, customerName TEXT,RepaymentAmount TEXT, RepaymentDateTime TEXT,Penalty TEXT,ProccessingFees TEXT, IsSyncedUp TEXT)',
      );
    },
    (_, error) => { 
      //console.log('db error RepaymentLog tables');
      //console.log(error);
    },
    (_, success) => {
      //console.log('db sucess RepaymentLog tables');
    },
  );
}
// ********************* CREATE DATABASE *********************



// ********************* INSERT DATABASE *********************

export const InsertIntoTables = async (response) => {
  const promise =  new  Promise(async (resolve, reject) => {

    try {
    //do something and return result on success
    const keys = Object.keys(response);

    const reducer = (accumulator, currentValue) =>
      accumulator +
      '(' +
      Object.values(currentValue).map((e) => {
        return '"' + e + '"';
      }) +
      '),';
  
    for (const item of keys) {
      if (response[item] && response[item].length > 0) {
        if (response[item].length < 100) {
          let a = response[item].reduce(reducer, `INSERT INTO ${item} VALUES`);
          a = a.substring(0, a.length - 1);
  
          SQLite.openDatabase(
            database_name,
            database_version,
            database_displayname,
            database_size,
          ).then((DB) => {
            DB.transaction((tx) => {
              tx.executeSql(a, [], (tx, results) => {
                if (results.rowsAffected > 0) {
                  //console.log(`Insert success into ${item} `);
                } else {
                  //console.log('Insert failed into ProgramActivity');
                }
              });
            });
          });
        } else {
          for (let i = 0; i < response[item].length; i = i + 100) {
            let a = response[item]
              .slice(i, i + 100)
              .reduce(reducer, `INSERT INTO ${item} VALUES`);
            a = a.substring(0, a.length - 1);
  
            SQLite.openDatabase(
              database_name,
              database_version,
              database_displayname,
              database_size,
            ).then((DB) => {
              DB.transaction((tx) => {
                tx.executeSql(a, [], (tx, results) => {
                  if (results.rowsAffected > 0) {
                    //console.log(
                      // `Insert success into ${item} from ${i} to ${
                        // i + response[item].slice(i, i + 100).length
                      // } `,
                    // );
                  } else {
                    //console.log('Insert failed into ProgramActivity');
                  }
                });
              });
            });
          }
        }
      }
    }
   resolve("Success")

   }catch(msg) { reject(msg);}

   });

  return promise;
 

};

//Insert satisfication survey form 
export const insertRepaymentLogData = async(LoanId,CustomerGroupId,customerName,NICNumber,RepaymentAmount,Penalty,ProccessingFees,RepaymentDateTime,StaionId,IsSyncedUp) => {
  let DB = await SQLite.openDatabase(
    database_name,
    database_version,
    database_displayname,
    database_size,
  );
  const promise=new Promise((resolve,reject)=>{
    
          DB.transaction(
            txxx => {
              txxx.executeSql(
                'insert into RepaymentLog (loanId,customerGroupId,customerName,NICNumber,RepaymentAmount,Penalty,ProccessingFees,RepaymentDateTime,StationId,IsSyncedUp) values (?,?,?,?,?,?,?,?,?,?)',
                [LoanId,CustomerGroupId,customerName,NICNumber,RepaymentAmount,Penalty,ProccessingFees,RepaymentDateTime,StaionId,IsSyncedUp],
              );
            },
            (t, error) => {
              //console.log('db error RepaymentLog insert');
              //console.log(error);
              reject(false)
            },
            (t, success) => {
              resolve(true)
              //console.log('db sucess RepaymentLog inserted');
            },
          )




  })
  return promise;
}
// ********************* INSERT DATABASE *********************



// ********************* GET DATABASE *********************

export const getRepaymentData = async() => {
  let filedata = [];
  let DB = await SQLite.openDatabase(
    database_name,
    database_version,
    database_displayname,
    database_size,
  );
  DB.transaction(tx => {
    tx.executeSql('SELECT * FROM RepaymentInfo', [], (tx, results) => {
      var len = results.rows.length;
  
      for (let i = 0; i < len; i++) {
        let row = results.rows.item(i);
        filedata.push(row);
      }
    
    });
  });
  return filedata;
};

export const checkExportRepaymentDatabase = () => {
  
  const promise  = new Promise(async (resolve, reject)=>{
    
    let DB = await SQLite.openDatabase(
      database_name,
      database_version,
      database_displayname,
      database_size,
    );

    DB.transaction(tx => {
      tx.executeSql('SELECT LoanId FROM RepaymentInfo ', [], (tx, results) => {
        var len = results.rows.length;
        
          resolve(len)
          reject('no data')    
      });
    });
  
  })
  return promise
};

export const getRepaymentDataForFP = async() => {
  let filedata = [];
  let DB = await SQLite.openDatabase(
    database_name,
    database_version,
    database_displayname,
    database_size,
  );
  const promise=new Promise((resolve,reject)=>{
   
    DB.transaction(tx => {
      tx.executeSql('SELECT LoanId, FPImageTemp FROM RepaymentInfo', [], (tx, results) => {
        var len = results.rows.length;
    
        for (let i = 0; i < len; i++) {
          let row = results.rows.item(i);
          if(row.FPImageTemp!=""){
            filedata.push(row);
          }
        }
        // //console.log(filedata)
      resolve(filedata)
      });
    });
  })
  
  return promise;
};

export const getRepaymentDataByLoanId = async(setNoData,setLoading,loanId) => {
  let filedata = [];
  let DB = await SQLite.openDatabase(
    database_name,
    database_version,
    database_displayname,
    database_size,
  );
  const promise=new Promise((resolve)=>{
    DB.transaction(tx => {
      tx.executeSql('SELECT * FROM RepaymentInfo where loanId = ?',
       [loanId], (tx, results) => {
        var len = results.rows.length;
        setLoading(false)
        
        { len == 0 ? setNoData(true) : setNoData(false) }
        for (let i = 0; i < len; i++) {
          let row = results.rows.item(i);
          filedata.push(row);
        }
        //console.log(""+JSON.stringify(filedata));
        // setArray(filedata);
        resolve(filedata)
      });
    });
  })

  return promise;
};
export const getRepaymentDataByCnic = async(setNoData,setLoading,cnic) => {
  let filedata = [];
  let DB = await SQLite.openDatabase(
    database_name,
    database_version,
    database_displayname,
    database_size,
  );
  const promise=new Promise((resolve)=>{
  
  DB.transaction(tx => {
    tx.executeSql('SELECT * FROM RepaymentInfo where NICNumber = ?',
     [cnic], (tx, results) => {
      var len = results.rows.length;
      setLoading(false)
      
      { len == 0 ? setNoData(true) : setNoData(false) }
      for (let i = 0; i < len; i++) {
        let row = results.rows.item(i);
        filedata.push(row);
      }
      resolve(filedata)
      // //console.log(""+JSON.stringify(filedata));
      // setArray(filedata);
    });
  });
});
  return promise;
};


// ******************* LOGS TABLE ***************************************

export const getRepaymentLogsDataByLoanId = async(setNoData,setLoading,loanId) => {
  let filedata = [];
  let DB = await SQLite.openDatabase(
    database_name,
    database_version,
    database_displayname,
    database_size,
  );
  const promise=new Promise((resolve)=>{
    DB.transaction(tx => {
      tx.executeSql('SELECT * FROM RepaymentLog where loanId = ?',
       [loanId], (tx, results) => {
        var len = results.rows.length;
        setLoading(false)
        
        { len == 0 ? setNoData(true) : setNoData(false) }
        for (let i = 0; i < len; i++) {
          let row = results.rows.item(i);
          filedata.push(row);
        }
        //console.log(""+JSON.stringify(filedata));
        // setArray(filedata);
        resolve(filedata)
      });
    });
  })

  return promise;
};
export const getRepaymentLogsDataByCnic = async(setNoData,setLoading,cnic) => {
  let filedata = [];
  let DB = await SQLite.openDatabase(
    database_name,
    database_version,
    database_displayname,
    database_size,
  );
  const promise=new Promise((resolve)=>{
  
  DB.transaction(tx => {
    tx.executeSql('SELECT * FROM RepaymentLog where NICNumber = ?',
     [cnic], (tx, results) => {
      var len = results.rows.length;
      setLoading(false)
      
      { len == 0 ? setNoData(true) : setNoData(false) }
      for (let i = 0; i < len; i++) {
        let row = results.rows.item(i);
        filedata.push(row);
      }
      resolve(filedata)
      // //console.log(""+JSON.stringify(filedata));
      // setArray(filedata);
    });
  });
});
  return promise;
};

export const getRepaymentLogsDataByDate = async(setNoData,setLoading,date) => {
  let filedata = [];
  let DB = await SQLite.openDatabase(
    database_name,
    database_version,
    database_displayname,
    database_size,
  );
  const promise=new Promise((resolve,reject)=>{
  
  DB.transaction(tx => {
    tx.executeSql('SELECT * FROM RepaymentLog where RepaymentDateTime = ?',
     [date], (tx, results) => {
      console.log("date"+date)
      var len = results.rows.length;
      setLoading(false)
      console.log("len"+len)
      { len == 0 ? setNoData(true) : setNoData(false) }
      if(len<=0){
        reject("No Data")
      }
      for (let i = 0; i < len; i++) {
        let row = results.rows.item(i);
        filedata.push(row);
      }
      resolve(filedata)
      // //console.log(""+JSON.stringify(filedata));
      // setArray(filedata);
    });
  });
});
  return promise;
};

export const getRepaymentLogs = async(setNoData,setLoading) => {
  let filedata = [];
  let DB = await SQLite.openDatabase(
    database_name,
    database_version,
    database_displayname,
    database_size,
  );
  const promise=new Promise((resolve)=>{
  
  DB.transaction(tx => {
    tx.executeSql('SELECT * FROM RepaymentLog where IsSyncedUp=0',
     [], (tx, results) => {
      var len = results.rows.length;
      setLoading(false)
      
      { len == 0 ? setNoData(true) : setNoData(false) }
      for (let i = 0; i < len; i++) {
        let row = results.rows.item(i);
        filedata.push(row);
      }
      resolve(filedata)
      // //console.log(""+JSON.stringify(filedata));
      // setArray(filedata);
    });
  });
});
  return promise;
};


// ******************* LOGS TABLE ***************************************

export const getTotalRepaymentPaid = async(loanId) => {
  var getValue=0;
  let DB = await SQLite.openDatabase(
    database_name,
    database_version,
    database_displayname,
    database_size,
  );
  const promise=new Promise((resolve)=>{
    DB.transaction(tx => {
      tx.executeSql('SELECT RepaymentAmount FROM RepaymentLog where loanId = ?',
       [loanId], (tx, results) => {
        var len = results.rows.length;
        // setLoading(false)
        
        // { len == 0 ? setNoData(true) : setNoData(false) }
        for (let i = 0; i < len; i++) {
          let row = results.rows.item(i);
          
            getValue+=Number(row.RepaymentAmount);
          
        }
        resolve(getValue)
      });
    });
  })


  return promise;
};

// ********************* GET DATABASE *********************



// ********************* DELETE DATABASE *********************

export const DeletRepayment = async() => {
  const promise = new Promise(async (resolve, reject) => { 
  try{
    let DB = await SQLite.openDatabase(
      database_name,
      database_version,
      database_displayname,
      database_size,
    );
    DB.transaction(tx => {
      tx.executeSql('DELETE FROM RepaymentInfo;', [], (tx, results) => {
        resolve("DELETE SUCCESSFULL")
      });
    });
  }catch(err){
    reject(err)
  }
 
});
return promise;

};

export const DeletRepaymentLogsRow = async(id) => {
  const promise = new Promise(async (resolve, reject) => { 
  try{
    let DB = await SQLite.openDatabase(
      database_name,
      database_version,
      database_displayname,
      database_size,
    );
    DB.transaction(tx => {
      tx.executeSql('DELETE FROM RepaymentLog where repaymentLog_id=? ;', [id], (tx, results) => {
        resolve("DELETE SUCCESSFULL")
      });
    });
  }catch(err){
    reject(err)
  }
 
});
return promise;

};
// ********************* DELETE DATABASE *********************

// *********************** UPDATE DATABASE *************************
//update Repayment Amount
export const updateRepaymentAmount = async (id,Amount) => {
  const promise=new Promise(async(resolve,reject)=>{
    let DB = await SQLite.openDatabase(
      database_name,
      database_version,
      database_displayname,
      database_size,
    );
    DB.transaction((tx) => {
      tx.executeSql(
        "UPDATE RepaymentLog SET RepaymentAmount = ? WHERE repaymentLog_id= ?",
        [Amount,id],
        async (_, result) => {
          resolve("Successfully Repayment Amount updated!")
          // alert("");
  
        },
        (_, error) => {
         reject(error);
        }
      );
    });
  })
 return promise;
}

export const updateSyncup = async (id) => {
  const promise=new Promise(async(resolve,reject)=>{
    let DB = await SQLite.openDatabase(
      database_name,
      database_version,
      database_displayname,
      database_size,
    );
    DB.transaction((tx) => {
      tx.executeSql(
        "UPDATE RepaymentLog SET IsSyncedUp = 1 WHERE repaymentLog_id= ?",
        [id],
        async (_, result) => {
          resolve("Successfully IsSyncedUp updated!"+id)
          //console.log("Successfully IsSyncedUp updated!"+id)
          // alert("");
  
        },
        (_, error) => {
         reject(error);
        }
      );
    });
  })
 return promise;
}
// *********************** UPDATE DATABASE *************************
