import { openDatabase } from 'react-native-sqlite-storage';
import { Alert } from 'react-native';
import moment from 'moment'
const { FingerModule } = NativeModules;
import { NativeModules } from 'react-native';

// var db = openDatabase({ name: 'safcoapp.db' });
import SQLite from 'react-native-sqlite-storage';
import { resolvePreset } from '@babel/core';
SQLite.enablePromise(true);
// SQLite.DEBUG(true);

const database_name = 'safcoapp.db';
const database_version = '1.3';
const database_displayname = 'safcoapp.db';
const database_size = 2000000;



export const initDatabase = async () => {
  let db = await SQLite.openDatabase(
    database_name,
    database_version,
    database_displayname,
    database_size,
  );
  db.transaction(
    tx => {
      tx.executeSql(
        'CREATE TABLE IF NOT EXISTS CustomerLogin (Login_Id INTEGER PRIMARY KEY AUTOINCREMENT, Employee_Id TEXT, EmployeeTypeId TEXT,EmployeeTypeName TEXT,Employee_F_Name TEXT,Employee_L_Name TEXT,Employee_NIC TEXT,Employee_Username TEXT,Employee_Password TEXT,LoginData TEXT,Employee_fprint TEXT)',
      );
    },
    (_, error) => {
      //console.log('db error CustomerLogin tables');
      //console.log(error);
    },
    (_, success) => {
      //console.log('db sucess CustomerLogin tables');
    },
  );
  //CustomerForms
  db.transaction(
    tx => {
      tx.executeSql(
        'CREATE TABLE IF NOT EXISTS CustomerForms (id INTEGER PRIMARY KEY AUTOINCREMENT, forms TEXT, date TEXT,user_cnic TEXT,user_name TEXT,user_businessAddress TEXT,user_contactNumber TEXT,user_address TEXT,user_jobtype TEXT,isGroupMember TEXT,CustomerAnswers TEXT,Comments TEXT,Latitude TEXT,Longitudes TEXT,CompositeKey TEXT,BMCheck TEXT)',
      );
    },
    (_, error) => {
      //console.log('db error CustomerForms tables');
      //console.log(error);
    },
    (_, success) => {
      //console.log('db sucess CustomerForms tables');
    },
  );

  //AllArray
  db.transaction(
    tx => {
      tx.executeSql(
        'CREATE TABLE IF NOT EXISTS AllArray (id INTEGER PRIMARY KEY AUTOINCREMENT, questionsArray TEXT, jobsArray TEXT, LoanTypesArray TEXT, StationArray TEXT,EmployeesArray TEXT, EmployeesRegionArray TEXT, ForbiddenPersonArray TEXT,TopUpTypesArray TEXT,Tags TEXT )',
      );
    },
    (_, error) => {
      //console.log('db error AllArray tables');
      //console.log(error);
    },
    (_, success) => {
      //console.log('db sucess AllArray tables');
    },
  );
  
  // Creating Satisfication Survey Form Table
  db.transaction(
    tx => {
      tx.executeSql(
        'CREATE TABLE IF NOT EXISTS SatisficatonSurvey (survey_id INTEGER PRIMARY KEY AUTOINCREMENT, user_id TEXT, user_cnic TEXT, username TEXT, survey_form TEXT)',
      );
    },
    (_, error) => {
      //console.log('db error Satisfication_survey tables');
      //console.log(error);
    },
    (_, success) => {
      //console.log('db sucess Satisfication_survey tables');
    },
  );



  // Creating Employee Satisfication Survey Form Table
  db.transaction(
    tx => {
      tx.executeSql(
        'CREATE TABLE IF NOT EXISTS EmployeeSatisficatonSurvey (survey_id INTEGER PRIMARY KEY AUTOINCREMENT, user_id INTEGER, employee_Designation TEXT, username TEXT, survey_form TEXT)',
      );
    },
    (_, error) => {
      //console.log('db error Satisfication_survey tables');
      //console.log(error);
    },
    (_, success) => {
      //console.log('db sucess Satisfication_survey tables');
    },
  );


  // Creating Group Form Table
  db.transaction(
    tx => {
      tx.executeSql(
        'CREATE TABLE IF NOT EXISTS Groups (group_id INTEGER PRIMARY KEY AUTOINCREMENT, user_id TEXT, group_name TEXT, groupForm TEXT,date TEXT,composite_key TEXT)',
      );
    },
    (_, error) => {
      //console.log('db error Groups tables');
      //console.log(error);
    },
    (_, success) => {
      //console.log('db sucess Groups tables');
    },
  );

  // Creating Loan_Documents Form Table
  db.transaction(
    tx => {
      tx.executeSql(
        'CREATE TABLE IF NOT EXISTS Loan_Documents (loan_doc_id INTEGER PRIMARY KEY AUTOINCREMENT, user_cnic TEXT, imgName TEXT, imgValue TEXT,date TEXT,docs_array BLOB)',
      );
    },
    (_, error) => {
      //console.log('db error Loan_Documents tables');
      //console.log(error);
    },
    (_, success) => {
      //console.log('db sucess Loan_Documents tables');
    },
  );

  // Creating assets_Documents Form Table
  db.transaction(
    tx => {
      tx.executeSql(
        'CREATE TABLE IF NOT EXISTS Assets_Documents (assets_doc_id INTEGER PRIMARY KEY AUTOINCREMENT, user_cnic TEXT,assets_id TEXT, imgName TEXT, imgValue TEXT,date TEXT,docs_array BLOB)',
      );
    },
    (_, error) => {
      //console.log('db error Assets_Documents tables');
      //console.log(error);
    },
    (_, success) => {
      //console.log('db sucess Assets_Documents tables');
    },
  );

  // Creating assets_Documents Form Table
  db.transaction(
    tx => {
      tx.executeSql(
        'CREATE TABLE IF NOT EXISTS Group_Gurantors (groupgurantor_id INTEGER PRIMARY KEY AUTOINCREMENT,group_id TEXT, activeTab TEXT,guarantor_fullname TEXT,guarantor_businessNote TEXT,guarantor_jobType TEXT,guarantor_businessStatus TEXT, guarantor_cnic TEXT, guarantor_address TEXT,guarantor_contactno TEXT,guarantor_jobDescription TEXT,guarantor_businessAddress TEXT)',
      );
    },
    (_, error) => {
      //console.log('db error Group_Gurantors tables');
      //console.log(error);
    },
    (_, success) => {
      //console.log('db sucess Group_Gurantors tables');
    },
  );


  // Creating CustomersFormsTemp Form Table
  db.transaction(
    tx => {
      tx.executeSql(
        'CREATE TABLE IF NOT EXISTS CustomersFormsTemp (tempformsId INTEGER PRIMARY KEY AUTOINCREMENT,user_cnic TEXT, tempForms TEXT)',
      );
    },
    (_, error) => {
      //console.log('db error Group_Gurantors tables');
      //console.log(error);
    },
    (_, success) => {
      // console.log('db sucess CustomersFormsTemp tables');
    },
  );

 // Creating CustomerforVisits
 db.transaction(
  tx => {
    tx.executeSql(
      'CREATE TABLE IF NOT EXISTS CustomerforVisits (visitformsId INTEGER PRIMARY KEY AUTOINCREMENT,GroupName TEXT, GroupData TEXT,CustomerGroupId TEXT,StationName TEXT,StationId TEXT,Comments TEXT)',
    );
  },
  (_, error) => {
    //console.log('db error Group_Gurantors tables');
    //console.log(error);
  },
  (_, success) => {
    // console.log('db sucess CustomersFormsTemp tables');
  },
);

//Create table for storing the user's images
  // db.transaction(
  //   tx => {
  //     tx.executeSql(
  //       'CREATE TABLE IF NOT EXISTS CustomersImages (imagesId INTEGER PRIMARY KEY AUTOINCREMENT,user_cnic TEXT, customer_img TEXT,biomatic_img TEXT,supporting_img TEXT,eversis_img TEXT,jobcard_img TEXT)',
  //     );
  //   },
  //   (_, error) => {
  //     //console.log('db error Group_Gurantors tables');
  //     //console.log(error);
  //   },
  //   (_, success) => {
  //     // console.log('db sucess CustomersFormsTemp tables');
  //   },
  // );

  






};
export const alterTables=async()=>{
  let db = await SQLite.openDatabase(
    database_name,
    database_version,
    database_displayname,
    database_size,
  );
  const promise=new Promise((resolve,reject)=>{
  // ======================================================================================
  //------------------------------ALTERS--------------------------------------------->
  // =========================================================================================
  db.transaction(
    tx => {
      tx.executeSql(
        'ALTER TABLE CustomerForms ADD COLUMN CustomerCib TEXT;',
      );
      tx.executeSql(
        'ALTER TABLE CustomerForms ADD COLUMN group_id TEXT;',
      );
      tx.executeSql(
        'ALTER TABLE AllArray ADD COLUMN OrganizationRegion TEXT;',
      );
      tx.executeSql(
        'ALTER TABLE AllArray ADD COLUMN LoanCalculatorProducts TEXT;',
      );
      tx.executeSql(
        'ALTER TABLE AllArray ADD COLUMN AutofinanceCalculatorProducts TEXT;',
      );
      tx.executeSql(
        'ALTER TABLE AllArray ADD COLUMN DonorDetails TEXT;',
      );
      tx.executeSql(
        'ALTER TABLE Groups ADD COLUMN BMCheck TEXT;',
      );
    
    
      
      
      
    },
    (_, error) => {
      //console.log('db error TopUpLoanTypes tables');
      //console.log(error);
      // reject(error);
    },
    (_, success) => {
      // resolve(success)
    },
  );
  db.transaction(
    tx => {
      
      tx.executeSql(
        'ALTER TABLE Groups ADD COLUMN BMCheck TEXT;',
      );
    },
    (_, error) => {
      //console.log('db error TopUpLoanTypes tables');
      //console.log(error);
      reject(error);
    },
    (_, success) => {
      resolve(success)
    },
  );

  })
  return promise;

}

//------------------------------INSERTERS--------------------------------------------->
// =========================================================================================
export const insertCustomerLoginData = async (values, username, password) => {
  let db = await SQLite.openDatabase(
    database_name,
    database_version,
    database_displayname,
    database_size,
  );
  const promise = new Promise((resolve, reject) => {
    db.transaction(
      txxx => {
        txxx.executeSql(
          'insert into CustomerLogin (Employee_Id,EmployeeTypeId,EmployeeTypeName,Employee_F_Name,Employee_L_Name,Employee_NIC,Employee_Username,Employee_Password,LoginData) values (?,?,?,?,?,?,?,?,?)',
          [values.EmployeeId, values.EmployeeTypeId, values.EmployeeTypeName, values.FirstName,
          values.LastName, values.NICNumber, username, password,
          JSON.stringify(values)],
        );
      },
      (t, error) => {
        //console.log('db error insertUser');
        //console.log(error);
        reject(error)
      },
      (t, success) => {
        //console.log('db sucess insertUser');
        resolve(true)
      },
    );
  })
  return promise;

};

export const insertCustomerFromData = async (get, date, cnic, name, user_businessAddress, user_contactNumber, user_address, user_jobtype, isGroupMember, CustomerAnswers, Latitude, Longitudes, CompositeKey, BMCheck) => {
  console.log("---->ab<===" + user_jobtype)

  let db = await SQLite.openDatabase(
    database_name,
    database_version,
    database_displayname,
    database_size,
  );
  db.transaction(
    txxx => {
      txxx.executeSql(
        'insert into CustomerForms (group_id,forms,date,user_cnic,user_name,user_businessAddress,user_contactNumber,user_address,user_jobtype,isGroupMember,CustomerAnswers,Latitude,Longitudes,CompositeKey,BMCheck) values (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)',
        ['',get, date, cnic, name, user_businessAddress, user_contactNumber, user_address, user_jobtype, isGroupMember, CustomerAnswers, Latitude, Longitudes, CompositeKey, BMCheck],
      );
    },
    (t, error) => {
      //console.log('db error insertUser');
      //console.log(error);
    },
    (t, success) => {
      //console.log('db sucess insertUser');
    },
  );
};
//------------------------------INSERTERS--------------------------------------------->
export const insertCustomerFromDataWithRow = async (get, date, cnic, name, user_businessAddress, user_contactNumber, user_address, user_jobtype, isGroupMember, CustomerAnswers, Latitude, Longitudes, CompositeKey, BMCheck) => {
  //console.log("---->ab<===" + CustomerAnswers)

  let db = await SQLite.openDatabase(
    database_name,
    database_version,
    database_displayname,
    database_size,
  );
  var filedata = [];
  const promise = new Promise((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql('SELECT user_cnic FROM CustomerForms where user_cnic = ?', [cnic], (tx, results) => {
        var len = results.rows.length;
        // { len == 0 ? setNoData(true) : setNoData(false) }
        // setLoading(false)
        for (let i = 0; i < len; i++) {
          let row = results.rows.item(i);
          filedata.push(row);
        }
        console.log("" + JSON.stringify(len));
        if (len == 0) {
          db.transaction(
            txxx => {
              txxx.executeSql(
                'insert into CustomerForms (forms,date,user_cnic,user_name,user_businessAddress,user_contactNumber,user_address,user_jobtype,isGroupMember,CustomerAnswers,Latitude,Longitudes,CompositeKey,BMCheck) values (?,?,?,?,?,?,?,?,?,?,?,?,?,?)',
                [get, date, cnic, name, user_businessAddress, user_contactNumber, user_address, user_jobtype, isGroupMember, CustomerAnswers, Latitude, Longitudes, CompositeKey, BMCheck],
              );
            },
            (t, error) => {
              //console.log('db error insertUser');
              //console.log(error);
              reject(error)
            },
            (t, success) => {
              db.transaction(tx => {
                tx.executeSql('SELECT id FROM CustomerForms ORDER BY id DESC LIMIT 1;', [], (tx, results) => {
                  var len = results.rows.length;
                  //console.log("===>len", JSON.stringify(len))

                  for (let i = 0; i < len; i++) {

                    let row = results.rows.item(i);
                    console.log("===>row", JSON.stringify(row))
                    resolve(row)
                  }


                });
              });
            },
          );
        } else {
          Alert.alert("Sorry!", "This Cnic already exist");
          reject(false)
        }
      });
    });

  });
  return promise;

};
export const updateCustomerFromDataWithRow= async (get, user_name, user_contactNumber, user_address, Latitude, Longitudes, id ) => {
  console.log("---->ab<===" + id)
  let db = await SQLite.openDatabase(
    database_name,
    database_version,
    database_displayname,
    database_size,
  );
  db.transaction((tx) => {
    tx.executeSql(
      "UPDATE CustomerForms SET forms = ?,user_name = ?,user_contactNumber = ? ,user_address = ?,Latitude = ?,Longitudes = ? where id = ?",
      [get, user_name, user_contactNumber, user_address, Latitude, Longitudes, id],
      async (_, result) => {
        console.log("updated");


      },
      (_, error) => {
        console.log("updating issue" + error);
      }
    );
  });
}
export const updateCustomerFromDataWithRowAndCustomerAwnsers = async (get, user_name, user_contactNumber, user_address, Latitude, Longitudes, id, customerAnswers ) => {
  console.log("---->ab<===" + id)
  let db = await SQLite.openDatabase(
    database_name,
    database_version,
    database_displayname,
    database_size,
  );
  db.transaction((tx) => {
    tx.executeSql(
      "UPDATE CustomerForms SET forms = ?,user_name = ?,user_contactNumber = ? ,user_address = ?,Latitude = ?,Longitudes = ?,CustomerAnswers = ?  where id = ?",
      [get, user_name, user_contactNumber, user_address, Latitude, Longitudes, customerAnswers, id],
      async (_, result) => {
        console.log("updated");


      },
      (_, error) => {
        console.log("updating issue" + error);
      }
    );
  });
}
export const getCustomerFromsAndAnswers = async (cnic) => {
  let db = await SQLite.openDatabase(
    database_name,
    database_version,
    database_displayname,
    database_size,
  );
  console.log("checkingCustomerByCnic===>", cnic)
  let filedata = [];
  const promise = new Promise((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql('SELECT forms, CustomerAnswers, id FROM CustomerForms where user_cnic = ?', [cnic], (tx, results) => {
        var len = results.rows.length;
        for (let i = 0; i < len; i++) {
          let row = results.rows.item(i);
          filedata.push(row);
        }
        // console.log("--->sql methode" + JSON.stringify(filedata));
        resolve(filedata)
      });
    });
  })

  return promise;
};

export const gettingCibReport = async (userCnic, setNoData) => {
  // console.log('nic===>',userCnic)
  
  let db = await SQLite.openDatabase(
    database_name,
    database_version,
    database_displayname,
    database_size,
  );

  const promise = new Promise((resolve, reject) => {
    db.transaction(tx => {
      let parser = [];
      // first we gettig data of selected user-----------------------
      tx.executeSql('SELECT CustomerCib FROM CustomerForms where user_cnic = ?', [userCnic], (tx, results) => {
        
        
        var len = results.rows.length;
        for (let i = 0; i < len; i++) {
          let row = results.rows.item(i);
          parser.push(row);
        }
        // console.log("--->sql methode" + JSON.stringify(filedata));
        resolve(parser)
      });
    });
  })
  
  return promise;
};

export const updateCustomerFromDatawithLoanForm = async (get, user_jobtype, id) => {
  console.log("---->ab<===" + id)
  let db = await SQLite.openDatabase(
    database_name,
    database_version,
    database_displayname,
    database_size,
  );
  db.transaction((tx) => {
    tx.executeSql(
      "UPDATE CustomerForms SET forms = ?,user_jobtype = ?  where id = ?",
      [get, user_jobtype, id],
      async (_, result) => {
        console.log("updated from Loanform");


      },
      (_, error) => {
        console.log("updating issue" + error);
      }
    );
  });

}

export const insertCustomerImages=async(user_cnic,customer_img,biomatic_img,supporting_img,eversis_img,jobcard_img)=>{
  let db = await SQLite.openDatabase(
    database_name,
    database_version,
    database_displayname,
    database_size,
  );
  const promise = new Promise((resolve, reject) => {
    db.transaction(
      txxx => {
        txxx.executeSql(
          'insert into CustomersImages (user_cnic,customer_img,biomatic_img,supporting_img,eversis_img,jobcard_img) values (?,?,?,?,?,?)',
          [user_cnic,customer_img,biomatic_img,supporting_img,eversis_img,jobcard_img],
        );
      },
      (t, error) => {
        //console.log('db error insertUser');
        //console.log(error);
        reject(error)
      },
      (t, success) => {
        //console.log('db sucess insertUser');
        resolve(true)
      },
    );
  })
  return promise;
}
export const updateCustomerImagesfromCustomersPage=async(user_cnic,customer_img,biomatic_img,supporting_img,jobcard_img)=>{
  let db = await SQLite.openDatabase(
    database_name,
    database_version,
    database_displayname,
    database_size,
  );
  const promise = new Promise((resolve, reject) => {
    db.transaction(
      txxx => {
        txxx.executeSql(
          'UPDATE CustomersImages SET customer_img = ?,biomatic_img = ?,supporting_img = ?,jobcard_img = ? where user_cnic = ?',
          [customer_img,biomatic_img,supporting_img,jobcard_img,user_cnic],
        );
      },
      (t, error) => {
        //console.log('db error insertUser');
        //console.log(error);
        reject(error)
      },
      (t, success) => {
        //console.log('db sucess insertUser');
        resolve(true)
      },
    );
  })
  return promise;
}

export const updateCustomerImagesfromLoanFormPage=async(user_cnic,eversis_img)=>{
  let db = await SQLite.openDatabase(
    database_name,
    database_version,
    database_displayname,
    database_size,
  );
  const promise = new Promise((resolve, reject) => {
    db.transaction(
      txxx => {
        txxx.executeSql(
          'UPDATE CustomersImages SET eversis_img = ? where user_cnic = ?',
          [eversis_img,user_cnic],
        );
      },
      (t, error) => {
        //console.log('db error insertUser');
        //console.log(error);
        reject(error)
      },
      (t, success) => {
        //console.log('db sucess insertUser');
        resolve(true)
      },
    );
  })
  return promise;
}

export const getCustomerImages = async (user_cnic, allDataobj, setAlldataobj) => {
  let db = await SQLite.openDatabase(
    database_name,
    database_version,
    database_displayname,
    database_size,
  );
  console.log("-->" + user_cnic);
  const promise = new Promise(async (resolve, reject) => {
    
    try {
      db.transaction(tx => {
        tx.executeSql('SELECT * FROM CustomersImages where user_cnic=?', [user_cnic], (tx, results) => {
          var len = results.rows.length;
          //console.log("===>len", JSON.stringify(len))

          for (let i = 0; i < len; i++) {

            let row = results.rows.item(i);
            let get=allDataobj;
            
            if(row.customer_img != null ){ get.customerInfo[0].customer_img = row.customer_img;}
            if(row.biomatic_img != null ){ get.customerInfo[0].customer_biomatric = row.customer_biomatric;}
            if(row.supporting_img != null ){ get.customerInfo[0].customer_supportingPerson_fingerprint = row.supporting_img;}
            if(row.eversis_img != null ){ get.customerInfo[0].evrisys_customerImage = row.eversis_img;}
            if(row.jobcard_img != null ){ get.customerInfo[0].customer_jobCard = row.jobcard_img;}
            setAlldataobj({ ...get });
            
          }

          resolve(true);
         
        });
      });


    } catch (msg) { reject(msg); }

  });

  return promise;
}
export const returnCustomerImages = async (user_cnic, allDataobj) => {
  let db = await SQLite.openDatabase(
    database_name,
    database_version,
    database_displayname,
    database_size,
  );
  console.log("-->" + user_cnic);
  let get=allDataobj;
  const promise = new Promise(async (resolve, reject) => {
    
    try {
      db.transaction(tx => {
        tx.executeSql('SELECT * FROM CustomersImages where user_cnic=?', [user_cnic], (tx, results) => {
          var len = results.rows.length;
          console.log("===>CustomersImages", JSON.stringify(len))

          for (let i = 0; i < len; i++) {

            let row = results.rows.item(i);
            
            
            if(row.customer_img != null ){ get.customerInfo[0].customer_img = row.customer_img;}
            if(row.biomatic_img != null ){ get.customerInfo[0].customer_biomatric = row.customer_biomatric;}
            if(row.supporting_img != null ){ get.customerInfo[0].customer_supportingPerson_fingerprint = row.supporting_img;}
            if(row.eversis_img != null ){ get.customerInfo[0].evrisys_customerImage = row.eversis_img;}
            if(row.jobcard_img != null ){ get.customerInfo[0].customer_jobCard = row.jobcard_img;}
            
            
          }

          resolve(get);
         
        });
      });


    } catch (msg) { reject(msg); }

  });

  return promise;
}

export const insertCustomerVisits=async(GroupName,GroupData,CustomerGroupId,StationId,StationName)=>{
  let db = await SQLite.openDatabase(
    database_name,
    database_version,
    database_displayname,
    database_size,
  );
  const promise = new Promise((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql('SELECT CustomerGroupId FROM CustomerforVisits where CustomerGroupId = ?', [CustomerGroupId], (tx, results) => {
        var len = results.rows.length;

        if (len > 0) {
          resolve(true)
          console.log('already exists')
        } else {
        
          db.transaction(
            txxx => {
              txxx.executeSql(
                'insert into CustomerforVisits (GroupName,GroupData,CustomerGroupId,StationId,StationName) values (?,?,?,?,?)',
                [GroupName,GroupData,CustomerGroupId,StationId,StationName],
              );
            },
            (t, error) => {
              //console.log('db error insertUser');
              //console.log(error);
              reject(error)
            },
            (t, success) => {
              console.log('db sucess insertUser');
              resolve(true)
            },
          );
        }

      });
    });
   
  })
  return promise;
}

const deleteCustomer=async(user_cnic)=>{
    let db = await SQLite.openDatabase(
      database_name,
      database_version,
      database_displayname,
      database_size,
    );
    const promise = new Promise((resolve, reject) => {
      db.transaction((tx) => {
        tx.executeSql(
          "DELETE  from CustomersImages where user_cnic = ?",
          [user_cnic],
          async (_, result) => {
            resolve("Successfully delete!")
  
          },
          (_, error) => {
            reject(error)
            //console.log("error dropping users table");
          }
        );
      });
    })
    return promise;
  
}
// **********************************************************************************
// ************************ these all methode are inserting data for BM ******************** START
// **********************************************************************************

export const insertCustomerFromDatawithPromise = async (get, date, cnic, name, user_businessAddress, user_contactNumber, user_address, user_jobtype, isGroupMember, CustomerAnswers, Latitude, Longitudes, Comments, CompositeKey, BMCheck,CustomerCib,GroupId) => {
  //console.log("---->ab<===" + CustomerAnswers)
  let db = await SQLite.openDatabase(
    database_name,
    database_version,
    database_displayname,
    database_size,
  );
  const promise = new Promise((resolve, reject) => {
    db.transaction(
      txxx => {
        txxx.executeSql(
          'insert into CustomerForms (forms,date,user_cnic,user_name,user_businessAddress,user_contactNumber,user_address,user_jobtype,isGroupMember,CustomerAnswers,Latitude,Longitudes,Comments,CompositeKey,BMCheck,CustomerCib,group_id) values (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)',
          [get, date, cnic, name, user_businessAddress, user_contactNumber, user_address, user_jobtype, isGroupMember, CustomerAnswers, Latitude, Longitudes, Comments, CompositeKey, BMCheck,CustomerCib,GroupId],
        );
      },
      (t, error) => {
        reject(error)
        //console.log('db error insertUser');
        //console.log(error);
      },
      (t, success) => {
        resolve(true)
        //console.log('db sucess insertUser');
      },
    );
  })

  return promise;
};


export const insertGroupCustomerFromDatawithPromise = async (get, date, cnic, name, user_businessAddress, user_contactNumber, user_address, user_jobtype, isGroupMember, CustomerAnswers, Latitude, Longitudes, Comments, CompositeKey, BMCheck,CustomerCib) => {
  //console.log("---->ab<===" + CustomerAnswers)
  let db = await SQLite.openDatabase(
    database_name,
    database_version,
    database_displayname,
    database_size,
  );
  const promise = new Promise((resolve, reject) => {
    db.transaction(
      txxx => {
        txxx.executeSql(
          'insert into CustomerForms (forms,date,user_cnic,user_name,user_businessAddress,user_contactNumber,user_address,user_jobtype,isGroupMember,CustomerAnswers,Latitude,Longitudes,Comments,CompositeKey,BMCheck,CustomerCib,group_id) values (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)',
          [get, date, cnic, name, user_businessAddress, user_contactNumber, user_address, user_jobtype, isGroupMember, CustomerAnswers, Latitude, Longitudes, Comments, CompositeKey, BMCheck,CustomerCib,''],
        );
      },
      (t, error) => {
        reject(error)
        //console.log('db error insertUser');
        //console.log(error);
      },
      (t, success) => {
        resolve(true)
        //console.log('db sucess insertUser');
      },
    );
  })

  return promise;
};

export const insertMultipleDocumentsImages = async (user_cnic, imgName, imgValue) => {
  let db = await SQLite.openDatabase(
    database_name,
    database_version,
    database_displayname,
    database_size,
  );
  const promise = new Promise((resolve, reject) => {
    db.transaction(
      txxx => {
        txxx.executeSql(
          'insert into Loan_Documents (user_cnic , imgName , imgValue) values (?,?,?)',
          [user_cnic, imgName, imgValue],
        );
      },
      (t, error) => {
        //console.log('db error Loan_Documents');
        //console.log(error);
        reject(error)
      },
      (t, success) => {
        //console.log('db sucess Loan_Documents');
        resolve(success)
      },
    );
  })
  return promise;
};

export const insertAndDeleteTempForms = async (user_cnic, tempForms) => {
  let db = await SQLite.openDatabase(
    database_name,
    database_version,
    database_displayname,
    database_size,
  );
  const promise = new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        "Delete from CustomersFormsTemp",
        [],
        async (_, result) => {
          db.transaction(
            txxx => {
              txxx.executeSql(
                'insert into CustomersFormsTemp (user_cnic , tempForms) values (?,?)',
                [user_cnic, tempForms],
              );
            },
            (t, error) => {
              //console.log('db error Loan_Documents');
              //console.log(error);
              reject(error)
            },
            (t, success) => {
              //console.log('db sucess Loan_Documents');
              resolve(success)
            },
          );


        },
        (_, error) => {
          reject(error)
          //console.log("error dropping users table");
        }
      );
    });

  })
  return promise;
};


export const insertMultipleAssetsImages = async (user_cnic, assets_id, imgName, imgValue) => {
  let db = await SQLite.openDatabase(
    database_name,
    database_version,
    database_displayname,
    database_size,
  );
  const promise = new Promise((resolve, reject) => {
    db.transaction(
      txxx => {
        txxx.executeSql(
          'insert into Assets_Documents (user_cnic ,assets_id,imgName , imgValue) values (?,?,?,?)',
          [user_cnic, assets_id, imgName, imgValue],
        );
      },
      (t, error) => {
        //console.log('db error Loan_Documents');
        //console.log(error);
        reject(error)
      },
      (t, success) => {
        //console.log('db sucess insertGroup');
        resolve(success)
      },
    );
  })
  return promise;
};


// **********************************************************************************
// ************************ these all methode are inserting data for BM ******************** ENDS
// **********************************************************************************
// export const insertCustomerFromDatawithPromise = (get, date, cnic, name, user_businessAddress, user_contactNumber, user_address, user_jobtype, isGroupMember, CustomerAnswers,Latitude,Longitudes,Comments) => {
//   //console.log("---->ab<===" + CustomerAnswers)

// const promise=new Promise((resolve,reject)=>{
//   db.transaction(
//     txxx => {
//       txxx.executeSql(
//         'insert into CustomerForms (forms,date,user_cnic,user_name,user_businessAddress,user_contactNumber,user_address,user_jobtype,isGroupMember,CustomerAnswers,Latitude,Longitudes,Comments) values (?,?,?,?,?,?,?,?,?,?,?,?,?) WHERE NOT EXISTS (SELECT user_cnic FROM CustomerForms WHERE user_cnic = ?) values(?)',
//         [get, date, cnic, name, user_businessAddress, user_contactNumber, user_address, user_jobtype, isGroupMember, CustomerAnswers,Latitude,Longitudes,Comments,cnic],
//       );
//     },
//     (t, error) => {
//       reject(error)
//       //console.log('db error insertUser');
//       //console.log(error);
//     },
//     (t, success) => {
//       resolve(true)
//       //console.log('db sucess insertUser');
//     },
//   );
// })

//  return promise;
// };


// previouse code for creating group 

export const insertGroupFromData = async (GroupId,user_id, group_name, groupForm, date, composite_key,BMCheck) => {
  console.log("insert group ID ------->",GroupId)
  let db = await SQLite.openDatabase( database_name, database_version, database_displayname, database_size,  );
  const promise = new Promise((resolve, reject) => {
    db.transaction(
      txxx => {
        txxx.executeSql(
          'insert into Groups (group_id,user_id , group_name , groupForm,date,composite_key,BMCheck) values (?,?,?,?,?,?,?)',
          [GroupId,user_id, group_name, groupForm, date, composite_key,BMCheck],
        );
      },
      (t, error) => {
        console.log('db error insertGroup');
        console.log(error);
        reject(error)
      },
      (t, success) => {
        console.log('db sucess insertGroup');
        db.transaction(tx => {
          tx.executeSql('SELECT group_id FROM Groups ORDER BY group_id DESC LIMIT 1', [], (tx, results) => {
            // var len = results.rows.length;
            let row = results.rows.item(0);
            resolve(row)
          });
        });
      },
    );
  })
  return promise;
};



// this code old only work on credit/loan officer . not bm or greater rank
// export const insertGroupFromData = async (user_id, group_name, groupForm, date, composite_key,BMCheck) => {
//   let db = await SQLite.openDatabase(database_name,database_version,database_displayname,database_size,);
//   const promise = new Promise((resolve, reject) => {
//     db.transaction(
//       txxx => {
//         txxx.executeSql(
//           'insert into Groups (user_id , group_name , groupForm,date,composite_key,BMCheck) values (?,?,?,?,?,?)',
//           [user_id, group_name, groupForm, date, composite_key,BMCheck],
//         );
//       },
//       (t, error) => {
//         reject(error)
//       },
//       (t, success) => {
//         db.transaction(tx => {
//           tx.executeSql('SELECT group_id FROM Groups ORDER BY group_id DESC LIMIT 1', [], (tx, results) => {
//             let row = results.rows.item(0);
//             resolve(row)
//           });
//         });
//       },
//     );
//   })
//   return promise;
// };
// my code end

export const insertDocumentsImages = async (user_cnic, imgName, imgValue, date) => {
  let db = await SQLite.openDatabase(
    database_name,
    database_version,
    database_displayname,
    database_size,
  );
  const promise = new Promise((resolve, reject) => {
    db.transaction(
      txxx => {
        txxx.executeSql(
          'insert into Loan_Documents (user_cnic , imgName , imgValue,date) values (?,?,?,?)',
          [user_cnic, imgName, imgValue, date],
        );
      },
      (t, error) => {
        //console.log('db error Loan_Documents');
        //console.log(error);
        reject(error)
      },
      (t, success) => {
        //console.log('db sucess Loan_Documents');
        resolve(success)
      },
    );
  })
  return promise;
};
export const insertDocumentsImagesArray = async (user_cnic, docs_array) => {
  let db = await SQLite.openDatabase(
    database_name,
    database_version,
    database_displayname,
    database_size,
  );
  const promise = new Promise((resolve, reject) => {
    db.transaction(
      txxx => {
        txxx.executeSql(
          'insert into Loan_Documents (user_cnic , docs_array) values (?,?)',
          [user_cnic, docs_array],
        );
      },
      (t, error) => {
        //console.log('db error Loan_Documents');
        //console.log(error);
        reject(error)
      },
      (t, success) => {
        //console.log('db sucess Loan_Documents');
        resolve(success)
      },
    );
  })
  return promise;
};
export const insertAssetsImagesArray = async (user_cnic, docs_array) => {
  let db = await SQLite.openDatabase(
    database_name,
    database_version,
    database_displayname,
    database_size,
  );
  const promise = new Promise((resolve, reject) => {
    db.transaction(
      txxx => {
        txxx.executeSql(
          'insert into Assets_Documents (user_cnic , docs_array) values (?,?)',
          [user_cnic, docs_array],
        );
      },
      (t, error) => {
        //console.log('db error Assets_Documents');
        //console.log(error);
        reject(error)
      },
      (t, success) => {
        //console.log('db sucess Assets_Documents');
        resolve(success)
      },
    );
  })
  return promise;
};
export const insertAssetsDocumentsImages = async (user_cnic, assets_id, imgName, imgValue, date) => {
  let db = await SQLite.openDatabase(
    database_name,
    database_version,
    database_displayname,
    database_size,
  );
  const promise = new Promise((resolve, reject) => {
    db.transaction(
      txxx => {
        txxx.executeSql(
          'insert into Assets_Documents (user_cnic ,assets_id,imgName , imgValue,date) values (?,?,?,?,?)',
          [user_cnic, assets_id, imgName, imgValue, date],
        );
      },
      (t, error) => {
        //console.log('db error Loan_Documents');
        //console.log(error);
        reject(error)
      },
      (t, success) => {
        //console.log('db sucess insertGroup');
        resolve(success)
      },
    );
  })
  return promise;
};

export const insertQuestions = async (QUES_ID, QUESTION, Awnser_type, Awnser1, Awnser2, Awnser3, Awnser4, Awnser5, Awnser6, Awnser7, Awnser8, Awnser9, Awnser10,) => {
  let db = await SQLite.openDatabase(
    database_name,
    database_version,
    database_displayname,
    database_size,
  );
  return new Promise((resolve, reject) => {

    db.transaction(tx => {
      tx.executeSql('SELECT QUES_ID FROM Customers_Questionnaire where QUES_ID = ?', [QUES_ID], (tx, results) => {
        var len = results.rows.length;

        if (len > 0) {
          resolve(true)
        } else {
          db.transaction(
            txxx => {
              txxx.executeSql(
                'insert into Customers_Questionnaire (QUES_ID,QUESTION,Awnser_type,Awnser1,Awnser2,Awnser3,Awnser4,Awnser5,Awnser6,Awnser7,Awnser8,Awnser9,Awnser10) values (?,?,?,?,?,?,?,?,?,?,?,?,?)',
                [QUES_ID, QUESTION, Awnser_type, Awnser1, Awnser2, Awnser3, Awnser4, Awnser5, Awnser6, Awnser7, Awnser8, Awnser9, Awnser10],
              );
            },
            (t, error) => {
              //console.log('db error insertUser');
              //console.log(error);
              reject(false)
            },
            (t, success) => {
              resolve(true)

              //console.log('db sucess insertUser');
            },
          )

        }

      });
    });


  })

};
export const insertJobs = async (JobId, JobTitle, JobTypeId) => {
  let db = await SQLite.openDatabase(
    database_name,
    database_version,
    database_displayname,
    database_size,
  );
  return new Promise((resolve, reject) => {

    db.transaction(tx => {
      tx.executeSql('SELECT * FROM Jobs where JobId = ?', [JobId], (tx, results) => {
        var len = results.rows.length;

        if (len > 0) {
          resolve(true)
        } else {
          db.transaction(
            txxx => {
              txxx.executeSql(
                'insert into Jobs (JobId,JobTitle,JobTypeId) values (?,?,?)',
                [JobId, JobTitle, JobTypeId],
              );
            },
            (t, error) => {
              //console.log('db error Jobs');
              //console.log(error);
              reject(false)
            },
            (t, success) => {
              resolve(true)
              //console.log('db sucess Jobs');
            },
          )

        }

      });
    });


  })

};
export const insertLoanType = async (LoanTypeId, LoanParentId, LoanTypeName) => {
  let db = await SQLite.openDatabase(
    database_name,
    database_version,
    database_displayname,
    database_size,
  );
  return new Promise((resolve, reject) => {

    db.transaction(tx => {
      tx.executeSql('SELECT * FROM LoanTypes where ln_type_id = ?', [LoanTypeId], (tx, results) => {
        var len = results.rows.length;

        if (len > 0) {
          resolve(true)
        } else {
          db.transaction(
            txxx => {
              txxx.executeSql(
                'insert into LoanTypes (ln_type_id,ln_parent_id,ln_type_name) values (?,?,?)',
                [LoanTypeId, LoanParentId, LoanTypeName],
              );
            },
            (t, error) => {
              //console.log('db error LoanTypes');
              //console.log(error);
              reject(false)
            },
            (t, success) => {
              resolve(true)
              //console.log('db sucess LoanTypes');
            },
          )

        }

      });
    });


  })

};

export const insertStation = async (StationId, StationName) => {
  let db = await SQLite.openDatabase(
    database_name,
    database_version,
    database_displayname,
    database_size,
  );
  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql('SELECT * FROM Stations where StationId = ?', [StationId], (tx, results) => {
        var len = results.rows.length;
        if (len > 0) {
          resolve(true)
        } else {
          db.transaction(
            txxx => {
              txxx.executeSql(
                'insert into Stations (StationId,StationName) values (?,?)',
                [StationId, StationName],
              );
            },
            (t, error) => {
              //console.log('db error Stations');
              //console.log(error);
              reject(false)
            },
            (t, success) => {
              resolve(true)
              //console.log('db sucess Stations');
            },
          )
        }
      });
    });
  })
};

export const insertEmployee = async (EmployeeId, StationId, EmployeeTypeId, StaffName) => {
  let db = await SQLite.openDatabase(
    database_name,
    database_version,
    database_displayname,
    database_size,
  );
  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql('SELECT EmployeeId FROM staff_namesList where EmployeeId = ?', [EmployeeId], (tx, results) => {
        var len = results.rows.length;

        if (len > 0) {
          //console.log('db already')
          resolve(true)
        } else {

          db.transaction(
            txxx => {
              txxx.executeSql(
                'insert into staff_namesList (StationId,EmployeeId,EmployeeTypeId,StaffName) values (?,?,?,?)',
                [StationId, EmployeeId, EmployeeTypeId, StaffName],
              );
            },
            (t, error) => {
              //console.log('db error Employees');
              //console.log(error);
              reject(false)
            },
            (t, success) => {
              resolve(true)
              //console.log('db sucess');
            },
          )

        }

      });
    });


  })
};

export const insertEmployeesRegion = async (EmployeeRegionId, StationId, EmployeeId, RegionId, RegionName) => {
  let db = await SQLite.openDatabase(
    database_name,
    database_version,
    database_displayname,
    database_size,
  );
  return new Promise((resolve, reject) => {

    db.transaction(tx => {
      tx.executeSql('SELECT * FROM emp_regions where EmployeeRegionId = ?', [EmployeeRegionId], (tx, results) => {
        var len = results.rows.length;

        if (len > 0) {
          resolve(true)
        } else {
          db.transaction(
            txxx => {
              txxx.executeSql(
                'insert into emp_regions (EmployeeRegionId,StationId,EmployeeId,RegionId,RegionName) values (?,?,?,?,?)',
                [EmployeeRegionId, StationId, EmployeeId, RegionId, RegionName],
              );
            },
            (t, error) => {
              //console.log('db error EmployeesRegion');
              //console.log(error);
              reject(false)
            },
            (t, success) => {
              resolve(true)
              //console.log('db sucess EmployeesRegion');
            },
          )

        }

      });
    });


  })
};

export const insertForbiddenPerson = async (Name, CNIC) => {
  let db = await SQLite.openDatabase(
    database_name,
    database_version,
    database_displayname,
    database_size,
  );
  return new Promise((resolve, reject) => {

    db.transaction(
      txxx => {
        txxx.executeSql(
          'insert into ForbiddenTable (PersonName,CNIC) values (?,?)',
          [Name, CNIC],
        );
      },
      (t, error) => {
        //console.log('db error ForbiddenTable');
        //console.log(error);
        reject(false)
      },
      (t, success) => {
        resolve(true)
        //console.log('db sucess ForbiddenTable');
      },
    )


  })
};

export const insert_Group_Gurantors = async (group_id, activeTab, guarantor_fullname, guarantor_businessNote, guarantor_jobType, guarantor_businessStatus, guarantor_cnic, guarantor_address, guarantor_contactno, guarantor_jobDescription, guarantor_businessAddress) => {
  let db = await SQLite.openDatabase(
    database_name,
    database_version,
    database_displayname,
    database_size,
  );
  return new Promise((resolve, reject) => {

    db.transaction(
      txxx => {
        txxx.executeSql(
          'insert into Group_Gurantors (group_id,activeTab,guarantor_fullname,guarantor_businessNote,guarantor_jobType,guarantor_businessStatus,guarantor_cnic,guarantor_address,guarantor_contactno,guarantor_jobDescription,guarantor_businessAddress) values (?,?,?,?,?,?,?,?,?,?,?)',
          [group_id, activeTab, guarantor_fullname, guarantor_businessNote, guarantor_jobType, guarantor_businessStatus, guarantor_cnic, guarantor_address, guarantor_contactno, guarantor_jobDescription, guarantor_businessAddress],
        );
      },
      (t, error) => {
        //console.log('db error Group_Gurantors');
        //console.log(error);
        reject(false)
      },
      (t, success) => {
        db.transaction((tx) => {
          ////////UPDATE USER FROMS
          tx.executeSql(
            "UPDATE CustomerForms SET isGroupMember = ? where user_cnic = ?",
            ["1", guarantor_cnic],
            async (_, result) => {
              resolve(true)
            },
            (_, error) => {
              reject("error delete")
            }
          );
        });
        //console.log('db sucess Group_Gurantors');
      },
    )


  })
};

export const insertTopUpLoanTypes = async (TopupTypeId, TopupLoanType, TopupLoanTypeAmount) => {
  let db = await SQLite.openDatabase(
    database_name,
    database_version,
    database_displayname,
    database_size,
  );
  return new Promise((resolve, reject) => {

    db.transaction(tx => {
      tx.executeSql('SELECT * FROM TopUpLoanTypes where topup_loan_type_id = ?', [TopupTypeId], (tx, results) => {
        var len = results.rows.length;

        if (len > 0) {
          resolve(true)
        } else {
          db.transaction(
            txxx => {
              txxx.executeSql(
                'insert into TopUpLoanTypes (topup_loan_type_id,topup_loan_type,topup_loan_amount) values (?,?,?)',
                [TopupTypeId, TopupLoanType, TopupLoanTypeAmount],
              );
            },
            (t, error) => {
              //console.log('db error TopUpLoanTypes');
              //console.log(error);
              reject(false)
            },
            (t, success) => {
              resolve(true)
              //console.log('db sucess TopUpLoanTypes');
            },
          )

        }

      });
    });


  })
};


export const insertAllArray = async(StationArray, jobsArray, LoanTypesArray, questionsArray, EmployeesArray, EmployeesRegionArray, ForbiddenPersonArray, TopUpTypesArray, OrganizationRegion,LoanCalculatorProducts,AutofinanceCalculatorProducts,DonorDetails, setProgressVisible) => {
 
  let db = await SQLite.openDatabase(
    database_name,
    database_version,
    database_displayname,
    database_size,
  );
  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql('DELETE FROM AllArray;', [], (tx, results) => {
        db.transaction(
          txxx => {
            txxx.executeSql(
              'insert into AllArray (StationArray, jobsArray, LoanTypesArray,questionsArray ,EmployeesArray, EmployeesRegionArray, ForbiddenPersonArray,TopUpTypesArray, OrganizationRegion,LoanCalculatorProducts,AutofinanceCalculatorProducts,DonorDetails) values (?,?,?,?,?,?,?,?,?,?,?,?)',
              [StationArray, jobsArray, LoanTypesArray, questionsArray, EmployeesArray, EmployeesRegionArray, ForbiddenPersonArray, TopUpTypesArray, OrganizationRegion,LoanCalculatorProducts,AutofinanceCalculatorProducts,DonorDetails],
            );
          },
          (t, error) => {
            console.log('db error AllArray');
            console.log(error);
            reject(false)
            setProgressVisible(false)
            alert("Syncdown Failed!");
          },
          (t, success) => {
            resolve(true)
            console.log('db sucess AllArray');
            setProgressVisible(false)

            alert("Syncdown Successfully");
          },
        )
      });
    });




  })
};
//Insert satisfication survey form 
export const insertSurveyData = async (UserId, customerCnicNumber, customerName, surveyForm) => {
  let db = await SQLite.openDatabase(
    database_name,
    database_version,
    database_displayname,
    database_size,
  );
  const promise = new Promise((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql('SELECT user_id FROM SatisficatonSurvey where user_cnic = ?', [customerCnicNumber], (tx, results) => {
        var len = results.rows.length;

        if (len > 0) {
          resolve(true)
          //console.log('already inerted');
        } else {
          db.transaction(
            txxx => {
              txxx.executeSql(
                'insert into SatisficatonSurvey (user_id, user_cnic, username, survey_form) values (?,?,?,?)',
                [UserId, customerCnicNumber, customerName, surveyForm],
              );
            },
            (t, error) => {
              //console.log('db error SatisficatonSurvey insert');
              //console.log(error);
              reject(false)
            },
            (t, success) => {
              resolve(true)
              //console.log('db sucess SatisficatonSurvey inserted');
            },
          )

        }

      });
    });


  })
  return promise;
}

//Insert EmployeeSatisfication survey form 
// export const insertEmployeeSurveyData = async (HRId, employeeDesignation, employeeName, surveyForm) => {
//   let db = await SQLite.openDatabase(
//     database_name,
//     database_version,
//     database_displayname,
//     database_size,
//   );
// console.log('faiiiiiz hrid',HRId)
//   const promise = new Promise((resolve, reject) => {
//     db.transaction(tx => {
//       tx.executeSql(
//         'SELECT user_id FROM EmployeeSatisficatonSurvey WHERE user_id = ? ',
//         [HRId],
//         (tx, results) => {
          
//           var len = results.rows.length;
          
//           if (len > 0) {
//             console.log('Record already exists for UserId:', HRId);
//             resolve(true);
//           } else {
            

//             db.transaction(
//               txxx => {
//                 txxx.executeSql(
//                   'INSERT INTO EmployeeSatisficatonSurvey (user_id, employee_Designation, username,survey_form) VALUES (?,?,?,?)',
//                   [HRId, employeeDesignation, employeeName, surveyForm],

//                 );
            
//               },
//               (t, error) => {
//                 //console.log('db error SatisficatonSurvey insert');
//                 //console.log(error);
//                 reject(false)
//               },
//               (t, success) => {
//                 resolve(true)
//                 //console.log('db sucess SatisficatonSurvey inserted');
//               },
//             )
  
//           }
//         }
//       );
//     });
//   });

//   return promise;
// }
export const insertEmployeeSurveyData = async (HRId, employeeDesignation, employeeName, surveyForm) => {
  let db = await SQLite.openDatabase(
    database_name,
    database_version,
    database_displayname,
    database_size,
  );

  console.log('HRId:', HRId);

  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        'SELECT user_id FROM EmployeeSatisficatonSurvey WHERE user_id = ?',
        [HRId],
        (tx, results) => {
          var len = results.rows.length;

          if (len > 0) {
            alert('Record already exists for UserId: ' + HRId);
            resolve(true);
          } else {
            tx.executeSql(
              'INSERT INTO EmployeeSatisficatonSurvey (user_id, username, survey_form) VALUES (?, ?, ?)',
              [HRId, employeeName, surveyForm],
              (tx, results) => {
                console.log('Insert success:', results);
                resolve(true);
              },
              (tx, error) => {
                console.log('Insert error:', error);
                reject(false);
              }
            );
          }
        },
        (tx, error) => {
          console.log('Select error:', error);
          reject(false);
        }
      );
    });
  });
};



//Update EmployeeSurvey form data
export const updateEmployeeSurveyForm = async (username, surveyForm, HRId) => {
  let db = await SQLite.openDatabase(
    database_name,
    database_version,
    database_displayname,
    database_size,
  );
  const promise = new Promise((resolve, reject) => {

    // console.log('hamszaaaaaaa',username, HRId)
    db.transaction((tx) => {
      tx.executeSql(
        "UPDATE EmployeeSatisficatonSurvey SET username = ?, survey_form = ? WHERE user_id= ?",
        [username, surveyForm, HRId],
       
        async (_, result) => {
         
          resolve("Successfully Survey Data updated!")
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






export const insertAllTags = async (Tags) => {
  let db = await SQLite.openDatabase(
    database_name,
    database_version,
    database_displayname,
    database_size,
  );
  //console.log("---working length")
  var promise = new Promise((resolve, reject) => {
    db.transaction(
      txxx => {
        txxx.executeSql(
          'Update AllArray set Tags = ?', [Tags]
        );
      },
      (t, error) => {
        //console.log('db error in update AllArray');
        //console.log(error);
        reject(false)
        alert("Syncdown Failed!");
      },
      (t, success) => {
        resolve(true)
        //console.log('db sucess AllArray');
        // alert("Syncdown Successfully");
      },
    )


  })
  return promise;

};

export const insertCibReport = async (cibReport, cnic) => {


  let db = await SQLite.openDatabase(
    database_name,
    database_version,
    database_displayname,
    database_size,
  );
  let filedata = [];
  const promise = new Promise((resolve, reject) => {
    console.log('===>',cibReport)
    db.transaction(tx => {
      tx.executeSql('Update CustomerForms SET CustomerCib=? where user_cnic = ?',[cibReport, cnic], (tx, results) => {
        resolve(true);
      });
    },(_, error) => {
      console.log('db error CustomerForms tables');
      //console.log(error);
    },
    (_, success) => {
      console.log('db sucess CustomerForms tables');
    },
    );
  })

  return promise;
}

// ====================================================================
//-----------------------------------------------------getters 
// ====================================================================


export const getCustomerLoginInfo = async (username, password) => {
  let db = await SQLite.openDatabase(
    database_name,
    database_version,
    database_displayname,
    database_size,
  );
  const promise = new Promise((resolve) => {
    let filedata = [];

    db.transaction(tx => {
      tx.executeSql('SELECT LoginData FROM CustomerLogin where Employee_Username=? and Employee_Password=?', [username, password], (tx, results) => {
        var len = results.rows.length;
        if (len > 0) {
          for (let i = 0; i < len; i++) {
            let row = results.rows.item(i);
            filedata.push(row);
          }

          resolve(filedata)

        } else {
          resolve([])
        }
      });
    });
  })

  return promise;
};

export const checkCustomerInfo = async (username) => {
  let db = await SQLite.openDatabase(
    database_name,
    database_version,
    database_displayname,
    database_size,
  );
  const promise = new Promise((resolve) => {
    let filedata = [];

    db.transaction(tx => {
      tx.executeSql('SELECT LoginData FROM CustomerLogin where Employee_Username=?', [username], (tx, results) => {
        var len = results.rows.length;
        if (len > 0) {
          for (let i = 0; i < len; i++) {
            let row = results.rows.item(i);
            filedata.push(row);
          }

          resolve(filedata)

        } else {
          resolve([])
        }
      });
    });
  })

  return promise;
};



export const getCustomerFromsOnly = async (cnic) => {
  let db = await SQLite.openDatabase(
    database_name,
    database_version,
    database_displayname,
    database_size,
  );
  console.log("=====sqlite", cnic)
  let filedata = [];
  const promise = new Promise((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql('SELECT forms FROM CustomerForms where user_cnic = ?', [cnic], (tx, results) => {
        var len = results.rows.length;
        for (let i = 0; i < len; i++) {
          let row = results.rows.item(i);
          filedata.push(row);
        }
        // console.log("--->sql methode" + JSON.stringify(filedata));
        resolve(filedata)
      });
    });
  })

  return promise;
};

export const getCustomerFroms = async (setArray, setFromsOrignal, setNoData, setLoading) => {
  let db = await SQLite.openDatabase(
    database_name,
    database_version,
    database_displayname,
    database_size,
  );
  let filedata = [];
  db.transaction(tx => {
    tx.executeSql('SELECT id,date,user_cnic,user_name,user_businessAddress,user_contactNumber,user_address,user_jobtype,isGroupMember,CustomerAnswers,Latitude,Longitudes,CompositeKey,BMCheck,Comments,CustomerCib FROM CustomerForms where BMCheck = 0', [], (tx, results) => {
      var len = results.rows.length;
      { len == 0 ? setNoData(true) : setNoData(false) }
      setLoading(false)
      for (let i = 0; i < len; i++) {
        let row = results.rows.item(i);
        // if(row.CompositeKey==""){
          filedata.push(row);

        // }
      }
      setArray(filedata);
      setFromsOrignal(filedata);

    });
  });
  return filedata;
};
export const getCustomerFromsForBM = async (setArray, setFromsOrignal, setNoData, setLoading) => {
  let db = await SQLite.openDatabase(
    database_name,
    database_version,
    database_displayname,
    database_size,
  );
  let filedata = [];
  db.transaction(tx => {
    tx.executeSql('SELECT id,date,user_cnic,user_name,user_businessAddress,user_contactNumber,user_address,user_jobtype,isGroupMember,CustomerAnswers,Latitude,Longitudes,CompositeKey,BMCheck,Comments,CustomerCib,group_id FROM CustomerForms where BMCheck = 1', [], (tx, results) => {
      var len = results.rows.length;
      { len == 0 ? setNoData(true) : setNoData(false) }
      setLoading(false)
      for (let i = 0; i < len; i++) {
        let row = results.rows.item(i);
        // if(row.CompositeKey != "" || row.isGroupMember==1){
        filedata.push(row);
        // }
      }
      setArray(filedata);
      setFromsOrignal(filedata);

    });
  });
  return filedata;
};
export const getCustomerFromsForLoanVerfiy = async (setArray, setFromsOrignal, setNoData, setLoading) => {
  let db = await SQLite.openDatabase(
    database_name,
    database_version,
    database_displayname,
    database_size,
  );
  let filedata = [];
  db.transaction(tx => {
    tx.executeSql('SELECT id,date,user_cnic,user_name,user_businessAddress,user_contactNumber,user_address,user_jobtype,isGroupMember,CustomerAnswers,Latitude,Longitudes,CompositeKey,BMCheck,Comments,CustomerCib,group_id FROM CustomerForms where BMCheck = 2', [], (tx, results) => {
      var len = results.rows.length;
      { len == 0 ? setNoData(true) : setNoData(false) }
      setLoading(false)
      for (let i = 0; i < len; i++) {
        let row = results.rows.item(i);
        filedata.push(row);
      }
      setArray(filedata);
      setFromsOrignal(filedata);

    });
  });
  return filedata;
};
//just for testing not using in app properly
export const getSelectedCustomerFrom = async (userCnic) => {
  let db = await SQLite.openDatabase(
    database_name,
    database_version,
    database_displayname,
    database_size,
  );
  let filedata = [];
  db.transaction(tx => {
    tx.executeSql('SELECT forms FROM CustomerForms where user_cnic = ?', [userCnic], (tx, results) => {
      var len = results.rows.length;
      for (let i = 0; i < len; i++) {
        let row = results.rows.item(i);
        console.log(row)
      }


    });
  });
  return filedata;
};


export const getDownloadedDataforRegional = async (id) => {
  let db = await SQLite.openDatabase(
    database_name,
    database_version,
    database_displayname,
    database_size,
  );
  // console.log("--->",id)
  const promise = new Promise((resolve, reject) => {

  db.transaction(tx => {
    tx.executeSql('SELECT CustomerGroupId FROM CustomerforVisits where CustomerGroupId=?', [id], (tx, results) => {
      resolve( results.rows.length);
      


    });
  });
});
  return promise;
};

export const getDownloadedDataforRegionalById = async (CustomerGroupId) => {
  let db = await SQLite.openDatabase(
    database_name,
    database_version,
    database_displayname,
    database_size,
  );
  console.log("CustomerGroupId===>", CustomerGroupId)
  let filedata = [];
  const promise = new Promise((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql('SELECT * FROM CustomerforVisits where CustomerGroupId = ?', [CustomerGroupId], (tx, results) => {
        var len = results.rows.length;
        for (let i = 0; i < len; i++) {
          let row = results.rows.item(i);
          filedata.push(row);
        }
        // console.log("--->sql methode" + JSON.stringify(filedata));
        resolve(filedata)
      });
    });
  })

  return promise;
};
export const getCommentsforRegionalById = async (CustomerGroupId) => {
  let db = await SQLite.openDatabase(
    database_name,
    database_version,
    database_displayname,
    database_size,
  );
  console.log("CustomerGroupId===>", CustomerGroupId)
  let filedata = [];
  const promise = new Promise((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql('SELECT Comments FROM CustomerforVisits where CustomerGroupId = ?', [CustomerGroupId], (tx, results) => {
        var len = results.rows.length;
        for (let i = 0; i < len; i++) {
          let row = results.rows.item(i);
          filedata.push(row);
        }
        // console.log("--->sql methode" + JSON.stringify(filedata));
        resolve(filedata)
      });
    });
  })

  return promise;
};

export const getAllDownloadedDataforRegional = async (stationId) => {
  let db = await SQLite.openDatabase(
    database_name,
    database_version,
    database_displayname,
    database_size,
  );
  console.log("stationId===>", stationId)
  let filedata = [];
  const promise = new Promise((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql('SELECT * FROM CustomerforVisits where StationId = ?', [stationId], (tx, results) => {
        var len = results.rows.length;
        for (let i = 0; i < len; i++) {
          let row = results.rows.item(i);
          filedata.push({...row,alreadySynced:true});
        }
        // console.log("--->sql methode" + JSON.stringify(filedata));
        resolve(filedata)
      });
    });
  })

  return promise;
};


export const checkExportSffDatabase = async () => {
  //let filedata = [];
  let db = await SQLite.openDatabase(
    database_name,
    database_version,
    database_displayname,
    database_size,
  );
  const promise = new Promise((resolve, reject) => {

    db.transaction(tx => {
      tx.executeSql('SELECT id FROM CustomerForms', [], (tx, results) => {
        var len = results.rows.length;

        resolve(len)
        reject('no data')
      });
    });

  })
  return promise
};


export const getCustomerFromsbyCnic = async (setArray, setNoData, setLoading, cnic,BMCheck) => {
  let db = await SQLite.openDatabase(
    database_name,
    database_version,
    database_displayname,
    database_size,
  );
  let filedata = [];
  db.transaction(tx => {
    tx.executeSql('SELECT id,date,user_cnic,user_name,user_businessAddress,user_contactNumber,user_address,user_jobtype,isGroupMember,CustomerAnswers,Latitude,Longitudes,CompositeKey,BMCheck,Comments FROM CustomerForms where user_cnic = ? and BMCheck = ?', [cnic,BMCheck], (tx, results) => {
      var len = results.rows.length;
      { len == 0 ? setNoData(true) : setNoData(false) }
      setLoading(false)
      for (let i = 0; i < len; i++) {
        let row = results.rows.item(i);
        filedata.push(row);
      }
      // //console.log(""+JSON.stringify(filedata));
      setArray(filedata);
    });
  });
  return filedata;
};
export const getCustomerFromsbyCnicforchecking = async (setLoading, cnic) => {
  let db = await SQLite.openDatabase(
    database_name,
    database_version,
    database_displayname,
    database_size,
  );
  let filedata = [];
  const promise = new Promise((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql('SELECT user_cnic FROM CustomerForms where user_cnic = ?', [cnic], (tx, results) => {
        var len = results.rows.length;
        // { len == 0 ? setNoData(true) : setNoData(false) }
        setLoading(false)
        for (let i = 0; i < len; i++) {
          let row = results.rows.item(i);
          filedata.push(row);
        }
        // //console.log(""+JSON.stringify(filedata));
        resolve(filedata.length)
      });
    });
  })

  return promise;
};

export const checkingCustomerByCnic = async (cnic) => {
 
  let db = await SQLite.openDatabase(
    database_name,
    database_version,
    database_displayname,
    database_size,
  );
  console.log("checkingCustomerByCnic--lol===>", cnic)
  let filedata = [];
  const promise = new Promise((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql('SELECT user_cnic FROM CustomerForms where user_cnic = ?', [cnic], (tx, results) => {
        var len = results.rows.length;
        for (let i = 0; i < len; i++) {
          let row = results.rows.item(i);
          filedata.push(row);
        }
        // console.log("--->sql methode" + JSON.stringify(filedata));
        resolve(filedata.length)
      });
    });
  })

  return promise;
};

export const checkingGroupsbyCompositekey = async (composite_key) => {
  let db = await SQLite.openDatabase(
    database_name,
    database_version,
    database_displayname,
    database_size,
  );
  console.log("checkingGroupsbyCompositekey===>", composite_key)
  let filedata = [];
  const promise = new Promise((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql('SELECT composite_key FROM Groups where composite_key = ?', [composite_key], (tx, results) => {
        var len = results.rows.length;
        for (let i = 0; i < len; i++) {
          let row = results.rows.item(i);
          filedata.push(row);
        }
        console.log("--->composite_key" + JSON.stringify(filedata));
        resolve(filedata.length)
      });
    });
  })

  return promise;
};
export const getCustomerFromsbyDateLoanOfficer = async (setArray, setNoData, setLoading, startDate, endDate) => {
  let db = await SQLite.openDatabase(
    database_name,
    database_version,
    database_displayname,
    database_size,
  );
  let filedata = [];
  var one = moment(startDate).format('l');
  var two = moment(endDate).format('l');
  console.log("" + one + " " + two);

  db.transaction(tx => {
    tx.executeSql(`SELECT id,date,user_cnic,user_name,user_businessAddress,user_contactNumber,user_address,user_jobtype,isGroupMember,CustomerAnswers,Latitude,Longitudes,CompositeKey,BMCheck,Comments FROM CustomerForms WHERE date BETWEEN '${one}' AND '${two}' AND BMCheck = 0`, [], (tx, results) => {

      var len = results.rows.length;

      { len == 0 ? setNoData(true) : setNoData(false) }
      { len == 0 && setArray([]) }

      setLoading(false)
      for (let i = 0; i < len; i++) {
        let row = results.rows.item(i);
        filedata.push(row);
      }
      setArray(filedata);
    });
  });
  return filedata;
};
export const getCustomerFromsbyDateVerificationOfficer = async (setArray, setNoData, setLoading, startDate, endDate) => {
  let db = await SQLite.openDatabase(
    database_name,
    database_version,
    database_displayname,
    database_size,
  );
  let filedata = [];
  var one = moment(startDate).format('l');
  var two = moment(endDate).format('l');
  console.log("" + one + " " + two);

  db.transaction(tx => {
    tx.executeSql(`SELECT id,date,user_cnic,user_name,user_businessAddress,user_contactNumber,user_address,user_jobtype,isGroupMember,CustomerAnswers,Latitude,Longitudes,CompositeKey,BMCheck,Comments FROM CustomerForms WHERE date BETWEEN '${one}' AND '${two}' AND BMCheck = 2`, [], (tx, results) => {

      var len = results.rows.length;

      { len == 0 ? setNoData(true) : setNoData(false) }
      { len == 0 && setArray([]) }

      setLoading(false)
      for (let i = 0; i < len; i++) {
        let row = results.rows.item(i);
        filedata.push(row);
      }
      setArray(filedata);
    });
  });
  return filedata;
};
export const getCustomerFromsbyDate = async (setArray, setNoData, setLoading, startDate, endDate) => {
  let db = await SQLite.openDatabase(
    database_name,
    database_version,
    database_displayname,
    database_size,
  );
  let filedata = [];
  var one = moment(startDate).format('l');
  var two = moment(endDate).format('l');
  console.log("" + one + " " + two);

  db.transaction(tx => {
    tx.executeSql(`SELECT id,date,user_cnic,user_name,user_businessAddress,user_contactNumber,user_address,user_jobtype,isGroupMember,CustomerAnswers,Latitude,Longitudes,CompositeKey,BMCheck,Comments FROM CustomerForms WHERE date BETWEEN '${one}' AND '${two}' AND BMCheck = 1`, [], (tx, results) => {

      var len = results.rows.length;

      { len == 0 ? setNoData(true) : setNoData(false) }
      { len == 0 && setArray([]) }

      setLoading(false)
      for (let i = 0; i < len; i++) {
        let row = results.rows.item(i);
        filedata.push(row);
      }
      setArray(filedata);
    });
  });
  return filedata;
};
//This methode getting customer by id or update and add gurantor also

export const getCustomerFromsbyId = async (setArray, setNoData, userId, underitem, updateUser) => {
  let db = await SQLite.openDatabase(
    database_name,
    database_version,
    database_displayname,
    database_size,
  );
  const promise = new Promise((resolve, reject) => {
    db.transaction(tx => {
      let parser;
      // first we gettig data of selected user-----------------------
      tx.executeSql('SELECT forms FROM CustomerForms where user_cnic = ?', [updateUser], (tx, results) => {
        var len = results.rows.length;
        { len == 0 ? setNoData(true) : setNoData(false) }
        parser = results.rows.item(0);

        let wet = parser.forms;
        let get = JSON.parse(wet);

        get.guarantorInfo.push(
          {
            key: 1,
            activeTab: false,
            guarantor_fullname: { value: underitem.Fullname, error: false },
            guarantor_cnic: { value: underitem.NicNumber, error: false },
            guarantor_address: { value: underitem.user_address, error: false },
            guarantor_contactno: { value: underitem.user_contactNumber, error: false },
            guarantor_jobDescription: { value: '', error: false },
            guarantor_businessAddress: { value: underitem.user_businessAddress, error: false },
            guarantor_jobType: { value: "private", index: 2 },
            guarantor_businessNote: { value: '', error: false },
            guarantor_businessStatus: true,
          },
        )

        let covert = JSON.stringify(get);
        db.transaction((tx) => {
          ////////UPDATE USER FROMS
          tx.executeSql(
            "UPDATE CustomerForms SET forms = ?,isGroupMember = ? where user_cnic = ?",
            [covert, "1", updateUser],
            async (_, result) => {
              resolve("Successfully updated!")
            },
            (_, error) => {
              reject("error updating")
            }
          );
        });
      });
    });
  })

  return promise;
};

export const getCustomerFromsByidforGroupSyncup = async (setLoading, cnic) => {
  let db = await SQLite.openDatabase(
    database_name,
    database_version,
    database_displayname,
    database_size,
  );
  let filedata = [];
  const promise = new Promise((resolve, reject) => {
    try {
      db.transaction(tx => {
        tx.executeSql('SELECT * FROM CustomerForms where user_cnic = ?', [cnic], (tx, results) => {
          var len = results.rows.length;
          // { len == 0 ? setNoData(true) : setNoData(false) }
          for (let i = 0; i < len; i++) {
            let row = results.rows.item(i);
            filedata.push(row);
          }
          // //console.log(""+JSON.stringify(filedata));
          // setArray(filedata);
          resolve(filedata)
        });
      });


    }
    catch (error) {
      reject(error)
    }


  })
  return promise;

};
export const getGroupsFroms = async (setArray, setFromsOrignal, setNoData, setLoading) => {
  let db = await SQLite.openDatabase(
    database_name,
    database_version,
    database_displayname,
    database_size,
  );
  let filedata = [];
  db.transaction(tx => {
    tx.executeSql('SELECT * FROM Groups where composite_key == "" ', [], (tx, results) => {
      var len = results.rows.length;
      setLoading(false)

      { len == 0 ? setNoData(true) : setNoData(false) }
      for (let i = 0; i < len; i++) {
        let row = results.rows.item(i);
        filedata.push(row);
      }
      // //console.log(""+JSON.stringify(filedata));
      setArray(filedata);
      setFromsOrignal(filedata);

    });
  });
  return filedata;
};
export const getGroupsFromsforBM = async (setArray, setFromsOrignal, setNoData, setLoading,BMcheck) => {
  let db = await SQLite.openDatabase(
    database_name,
    database_version,
    database_displayname,
    database_size,
  );
  let filedata = [];
  db.transaction(tx => {
    tx.executeSql(`SELECT * FROM Groups where composite_key != "" and BMCheck = ${BMcheck}`, [], (tx, results) => {
      var len = results.rows.length;
      setLoading(false)

      { len == 0 ? setNoData(true) : setNoData(false) }
      for (let i = 0; i < len; i++) {
        let row = results.rows.item(i);
        filedata.push(row);
      }
      // //console.log(""+JSON.stringify(filedata));
      setArray(filedata);
      setFromsOrignal(filedata);

    });
  });
  return filedata;
};
export const getGroupsFromsbyDateforBM = async (setArray, setNoData, setLoading, startDate, endDate,BMcheck) => {
  let db = await SQLite.openDatabase(
    database_name,
    database_version,
    database_displayname,
    database_size,
  );
  let filedata = [];
  var one = moment(startDate).format('l');
  var two = moment(endDate).format('l');
  console.log("" + one + " " + two);
  db.transaction(tx => {
    tx.executeSql(`SELECT * FROM Groups WHERE date BETWEEN '${one}' AND '${two}' and composite_key != "" and BMCheck = ${BMcheck}`, [], (tx, results) => {

      var len = results.rows.length;

      { len == 0 ? setNoData(true) : setNoData(false) }
      { len == 0 && setArray([]) }

      setLoading(false)
      for (let i = 0; i < len; i++) {
        let row = results.rows.item(i);
        filedata.push(row);
      }
      setArray(filedata);
    });
  });
  return filedata;
};
export const getGroupsFromsbyDate = async (setArray, setNoData, setLoading, startDate, endDate) => {
  let db = await SQLite.openDatabase(
    database_name,
    database_version,
    database_displayname,
    database_size,
  );
  let filedata = [];
  var one = moment(startDate).format('l');
  var two = moment(endDate).format('l');
  console.log("" + one + " " + two);
  db.transaction(tx => {
    tx.executeSql(`SELECT * FROM Groups WHERE date BETWEEN '${one}' AND '${two}' and composite_key = ""`, [], (tx, results) => {

      var len = results.rows.length;

      { len == 0 ? setNoData(true) : setNoData(false) }
      { len == 0 && setArray([]) }

      setLoading(false)
      for (let i = 0; i < len; i++) {
        let row = results.rows.item(i);
        filedata.push(row);
      }
      setArray(filedata);
    });
  });
  return filedata;
};
export const getCustomerFromsforSelection = async (setArray, setNoData, setLoading,BMCheck) => {
  let db = await SQLite.openDatabase(
    database_name,
    database_version,
    database_displayname,
    database_size,
  );
  let filedata = [];
  db.transaction(tx => {
    tx.executeSql('SELECT user_cnic,user_name,user_businessAddress,user_contactNumber,user_address,user_jobtype FROM CustomerForms where isGroupMember != 1 and user_jobtype == 0 and BMCheck = ?', [BMCheck], (tx, results) => {
      var len = results.rows.length;
      setLoading(false)
      { len == 0 ? setNoData(true) : setNoData(false) }      
      for (let i = 0; i < len; i++) {
        let row = results.rows.item(i);
        row["isCheck"] = false
        row["IsGroupLeader"] = false
        // console.log("in sql ==----==>"+JSON.stringify(row));
        filedata.push(row);
      }
      setArray(filedata);

    });
  });
  return filedata;
};
export const onquestionsArray = async () => {
  let db = await SQLite.openDatabase(
    database_name,
    database_version,
    database_displayname,
    database_size,
  );
  const promise = new Promise(async (resolve, reject) => {
    let filedata = [];
    let answers = [];
    try {
      db.transaction(tx => {
        tx.executeSql('SELECT questionsArray FROM AllArray', [], (tx, results) => {
          var len = results.rows.length;
          // {len==0?setNoData(true):setNoData(false)}

          let row = results.rows.item(0);
          var parser = JSON.parse(row.questionsArray)
          parser.map((item) => {
            if (item.QuestionnaireId == 1) {
              var temp = ["1. 1", "2. 2", "3. 3", "4. 4", "5. 5", "6. 6", "7. 7", "8. 8", "9. 9", "10. 10", "11. 11", "12. 12", "13. 13", "14. 14", "15. 15", "16. 16", "17. 17", "18. 18", "19. 19", "20. 20"]
              answers = [...temp];

            } else {
              if (item.Answer1 != null) {
                answers.push(item.Answer1)
              }
              if (item.Answer2 != null) {
                answers.push(item.Answer2)
              }
              if (item.Answer3 != null) {
                answers.push(item.Answer3)
              }
              if (item.Answer4 != null) {
                answers.push(item.Answer4)
              }
              if (item.Answer5 != null) {
                answers.push(item.Answer5)
              } if (item.Answer6 != null) {
                answers.push(item.Answer6)
              } if (item.Answer7 != null) {
                answers.push(item.Answer7)
              } if (item.Answer8 != null) {
                answers.push(item.Answer8)
              } if (item.Answer9 != null) {
                answers.push(item.Answer9)
              } if (item.Answer10 != null) {
                answers.push(item.Answer10)
              }
            }

            filedata.push({
              QuestionnaireId: item.QuestionnaireId,
              Question: item.Question,
              AnswerType: item.AnswerType,
              AnswersList: answers
            })
            answers = [];
          })



          // //console.log("" + JSON.stringify(filedata));
          // setArray(filedata);
        });
      });
      resolve(filedata);

    } catch (msg) { reject(msg); }

  });

  return promise;
}
export const getLoanTopupLoanArray = async () => {
  let db = await SQLite.openDatabase(
    database_name,
    database_version,
    database_displayname,
    database_size,
  );
  const promise = new Promise(async (resolve, reject) => {
    let filedata = [];
    try {
      db.transaction(tx => {
        tx.executeSql('SELECT TopUpTypesArray FROM AllArray', [], (tx, results) => {
          var len = results.rows.length;

          let row = results.rows.item(0);
          var parser = JSON.parse(row.TopUpTypesArray)
          parser.map((item) => {
            // if (item.LoanParentId == 0) {
            filedata.push({ name: item.TopupLoanType, value: item.TopupLoanTypeAmount, id: item.TopupTypeId });

            // }
          })
          // //console.log("-->" + JSON.stringify(filedata));
          // setTopUpLoantype([...filedata]);
        });
      });
      resolve(filedata);

    } catch (msg) { reject(msg); }

  });

  return promise;
}
export const getCalculatorProducts = async () => {
  let db = await SQLite.openDatabase(
    database_name,
    database_version,
    database_displayname,
    database_size,
  );
  const promise = new Promise(async (resolve, reject) => {
    let filedata = [];
    try {
      db.transaction(tx => {
        tx.executeSql('SELECT LoanCalculatorProducts FROM AllArray', [], (tx, results) => {
          var len = results.rows.length;

          let row = results.rows.item(0);
          var parser = JSON.parse(row.LoanCalculatorProducts)
          // console.log("-->",JSON.stringify(parser))
          parser.map((item,index) => {

            filedata.push({...item,name:item.ProductName});
            if(index==parser.length-1){
              resolve(filedata);
            }
            // if (item.LoanParentId == 0) {
            

            // }
          })
          // //console.log("-->" + JSON.stringify(filedata));
          // setTopUpLoantype([...filedata]);
        });
      });
     

    } catch (msg) { reject(msg); }

  });

  return promise;
}

export const getAutofinanceCalculatorProducts = async () => {
  let db = await SQLite.openDatabase(
    database_name,
    database_version,
    database_displayname,
    database_size,
  );
  const promise = new Promise(async (resolve, reject) => {
    let filedata = [];
    try {
      db.transaction(tx => {
        tx.executeSql('SELECT AutofinanceCalculatorProducts FROM AllArray', [], (tx, results) => {
          var len = results.rows.length;

          let row = results.rows.item(0);
          var parser = JSON.parse(row.AutofinanceCalculatorProducts)
          // console.log("-->",JSON.stringify(parser))
          parser.map((item,index) => {

            filedata.push({...item,name:item.ProductName});
            if(index==parser.length-1){
              resolve(filedata);
            }
            // if (item.LoanParentId == 0) {
            

            // }
          })
          // //console.log("-->" + JSON.stringify(filedata));
          // setTopUpLoantype([...filedata]);
        });
      });
     

    } catch (msg) { reject(msg); }

  });

  return promise;
}

export const getLoanDocuments = async (user_cnic, allDataobj, setAlldataobj) => {
  let db = await SQLite.openDatabase(
    database_name,
    database_version,
    database_displayname,
    database_size,
  );
  console.log("-->" + user_cnic);
  const promise = new Promise(async (resolve, reject) => {
    let filedata = [];
    try {
      db.transaction(tx => {
        tx.executeSql('SELECT * FROM Loan_Documents where user_cnic=?', [user_cnic], (tx, results) => {
          var len = results.rows.length;
          //console.log("===>len", JSON.stringify(len))

          for (let i = 0; i < len; i++) {

            let row = results.rows.item(i);
            filedata.push({
              key: i,
              activeTab: false,
              imgName: JSON.parse(row.imgName),
              imgValue: JSON.parse(row.imgValue),
              addedBy:"addedBy" in  row ? row.addedBy:"",
            });
          }

          resolve(filedata);
          if (filedata.length > 0) {
            let get = allDataobj;
            get.loanInfo[0].loan_customerImage = filedata;
            setAlldataobj({ ...get });
          }
        });
      });


    } catch (msg) { reject(msg); }

  });

  return promise;
}
export const getAssetsDocuments = async (user_cnic, allDataobj, setAlldataobj) => {
  let db = await SQLite.openDatabase(
    database_name,
    database_version,
    database_displayname,
    database_size,
  );
  //console.log("-->user_cnic" + user_cnic);
  const promise = new Promise(async (resolve, reject) => {
    let filedata = [];
    let temp = [];
    try {
      await db.transaction(async (tx) => {
        await tx.executeSql('SELECT * FROM Assets_Documents where user_cnic = ?', [user_cnic], (tx, results) => {
          var len = results.rows.length;
          for (let i = 0; i < len; i++) {
            let row = results.rows.item(i);
            filedata.push(row)

          }
          let get = allDataobj;


          allDataobj.assestsInfo.map((item, index) => {
            // temp = allDataobj.assestsInfo[index].assets_Image.length>1?allDataobj.assestsInfo[index].assets_Image:[];
            console.log("--->filedata",filedata.length)
            temp = [];
            filedata.map((underItem, underindex) => {
              
              if ((index + 1) == underItem.assets_id) {
                console.log((index + 1) + "==" + underItem.assets_id)
                temp.push({
                  key: underindex,
                  activeTab: false,
                  imgName: JSON.parse(underItem.imgName),
                  imgValue: JSON.parse(underItem.imgValue)
                })
              }
              if(underindex==filedata.length-1){
                get.assestsInfo[index].assets_Image = temp;
              }
            })
            

          })

          if (temp.length > 0) {
            resolve(temp);
            setAlldataobj({ ...get });
          } else {
            get.assestsInfo[0].assets_Image = [{
              key: 1,
              activeTab: false,
              imgName: { value: '', error: false },
              imgValue: undefined
            }]
          }

        });
      });

    } catch (msg) { reject(msg); }

  });

  return promise;
}
export const getAssetsDocumentsforSyncup = async (user_cnic) => {
  let db = await SQLite.openDatabase(
    database_name,
    database_version,
    database_displayname,
    database_size,
  );
  //console.log("-->user_cnic" + user_cnic);
  const promise = new Promise(async (resolve, reject) => {
    let filedata = [];
    try {
      await db.transaction(async (tx) => {
        await tx.executeSql('SELECT * FROM Assets_Documents where user_cnic = ?', [user_cnic], (tx, results) => {
          var len = results.rows.length;
          for (let i = 0; i < len; i++) {
            let row = results.rows.item(i);
            filedata.push(row)

          }


          if (filedata.length > 0) {
            resolve(filedata);

          } else {
            resolve([]);
          }

        });
      });

    } catch (msg) { reject(msg); }

  });

  return promise;
}
export const getAllemployees = async (setArray, setNoData) => {
  let db = await SQLite.openDatabase(
    database_name,
    database_version,
    database_displayname,
    database_size,
  );
  let filedata = [];
  db.transaction(tx => {
    tx.executeSql('SELECT EmployeesArray FROM AllArray', [], (tx, results) => {
      var len = results.rows.length;
      { len == 0 ? setNoData(true) : setNoData(false) }

      let row = results.rows.item(0);
      var parser = JSON.parse(row.EmployeesArray)
      filedata.push([...parser]);


      //console.log("" + JSON.stringify(filedata));
      setArray(filedata);
    });
  });
  return filedata;
};
export const getEmployeesRegionArray = async () => {
  let db = await SQLite.openDatabase(
    database_name,
    database_version,
    database_displayname,
    database_size,
  );
  let filedata = [];
  const promise = new Promise((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql('SELECT EmployeesRegionArray FROM AllArray', [], (tx, results) => {
        var len = results.rows.length;
        // { len == 0 ? setNoData(true) : setNoData(false) }
        if (len == 0) {
          resolve([])
          return
        }
        let row = results.rows.item(0);
        var parser = JSON.parse(row.EmployeesRegionArray)
        parser.map((item,indexe) => {

          filedata.push(item);
          if(indexe==parser.length-1){
            let list = filedata.filter(function (x, i, a) {
              return a.indexOf(x) == i;
            });
            ////console.log("RegionName" + JSON.stringify(list));
            resolve(list);
          }
        })

       
      });
    });
  })

  return promise;
};

export const updateEmplyeesRegionArray = async (regions) => {


  let db = await SQLite.openDatabase(
    database_name,
    database_version,
    database_displayname,
    database_size,
  );
  let filedata = [];
  const promise = new Promise((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql('Update AllArray SET EmployeesRegionArray=?', [regions], (tx, results) => {
        resolve(true);
      });
    });
  })

  return promise;
}

export const getLoanTypesArray = async (setArray, setNoData, setFlexArray) => {
  let db = await SQLite.openDatabase(
    database_name,
    database_version,
    database_displayname,
    database_size,
  );
  let filedata = [];
  let flexData = [];
  const promise = new Promise((resolve, reject) => {

    db.transaction(tx => {
      tx.executeSql('SELECT LoanTypesArray FROM AllArray', [], (tx, results) => {
        var len = results.rows.length;
        { len == 0 ? setNoData(true) : setNoData(false) }

        let row = results.rows.item(0);
        var parser = JSON.parse(row.LoanTypesArray)
        parser.map((item) => {
          if (item.LoanParentId == 0) {
            filedata.push(item.LoanTypeName);
            //filedata.push({label:item.LoanTypeName,value:item.LoanTypeName});

            flexData.push(item.LoanTypeId)
          }
        })


        //console.log("" + JSON.stringify(flexData));
        setArray([...filedata]);
        setFlexArray([...flexData])
        resolve(filedata)
      });
    });
  })

  return promise;
};

// export const getLoanTopupLoanArray = (setTopUpLoantype, setNoData) => {
//   let filedata = [];
//   // let flexData = [];
//   db.transaction(tx => {
//     tx.executeSql('SELECT TopUpTypesArray FROM AllArray', [], (tx, results) => {
//       var len = results.rows.length;
//       { len == 0 ? setNoData(true) : setNoData(false) }

//       let row = results.rows.item(0);
//       var parser = JSON.parse(row.TopUpTypesArray)
//       parser.map((item) => {
//         // if (item.LoanParentId == 0) {
//           filedata.push({ name: item.TopupLoanType, value: item.TopupLoanTypeAmount, id: item.TopupTypeId });

//         // }
//       })
//       //console.log("-->" + JSON.stringify(filedata));
//       setTopUpLoantype([...filedata]);
//     });
//   });
//   return filedata;
// };
export const getTags = async (setArray, setNoData, setFlexArray, TagType) => {
  let db = await SQLite.openDatabase(
    database_name,
    database_version,
    database_displayname,
    database_size,
  );
  let filedata = [];
  let flexData = [];
  db.transaction(tx => {
    tx.executeSql('SELECT Tags FROM AllArray', [], (tx, results) => {
      var len = results.rows.length;
      { len == 0 ? setNoData(true) : setNoData(false) }

      let row = results.rows.item(0);
      var parser = JSON.parse(row.Tags)
      parser.map((item) => {
        if (item.TagType == TagType) {
          filedata.push(item.name);
          flexData.push(item.value)
        }
      })


      //console.log("" + JSON.stringify(flexData));
      setArray([...filedata]);
      setFlexArray([...flexData])
    });
  });
  return filedata;
};

export const getCustomersFormsTemp = async () => {
  let db = await SQLite.openDatabase(
    database_name,
    database_version,
    database_displayname,
    database_size,
  );
  let filedata = [];
  const promise = new Promise((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql('SELECT tempForms FROM CustomersFormsTemp', [], (tx, results) => {
        var len = results.rows.length;
        for (let i = 0; i < len; i++) {
          let row = results.rows.item(i);
          filedata.push(row);
        }
        // //console.log(""+JSON.stringify(filedata));
        resolve(filedata)
      });
    });
  })
  return promise;



};

export const getSubLoanTypesArray = async (setArray, setNoData, LoanParentId, setPercentageArray) => {
  let db = await SQLite.openDatabase(
    database_name,
    database_version,
    database_displayname,
    database_size,
  );
  let filedata = [];
  let percentageArray = [];
  //console.log("" + JSON.stringify(LoanParentId));

  db.transaction(tx => {
    tx.executeSql('SELECT LoanTypesArray FROM AllArray', [], (tx, results) => {
      var len = results.rows.length;
      { len == 0 ? setNoData(true) : setNoData(false) }

      let row = results.rows.item(0);
      var parser = JSON.parse(row.LoanTypesArray)
      parser.map((item) => {

        if (item.LoanParentId == LoanParentId) {
          //console.log('--->', JSON.stringify(item))
          filedata.push(item);
          // filedata.push({name:item.LoanTypeName,value:item.LoanTypeName});
          percentageArray.push(item.LoanTypePercentage)
        }
      })


      //console.log("" + JSON.stringify(percentageArray));
      setArray([...filedata]);
      setPercentageArray([...percentageArray])
    });
  });
  return filedata;
};
export const getStationArray = async (setArray, setNoData) => {
  let db = await SQLite.openDatabase(
    database_name,
    database_version,
    database_displayname,
    database_size,
  );
  let filedata = [];

  db.transaction(tx => {
    tx.executeSql('SELECT StationArray FROM AllArray', [], (tx, results) => {
      var len = results.rows.length;

      { len == 0 ? setNoData(true) : setNoData(false) }

      let row = results.rows.item(0);
      var parser = JSON.parse(row.StationArray)
      parser.map(async (item) => {
        filedata.push({ label: item.StationName, value: item.StationName, id: item.StationId });
      })
      // alert(JSON.stringify(parser[3].StationName))


      //console.log("" + JSON.stringify(filedata[0].name));
      setArray(filedata);
    });
  });
  return filedata;
};

//Getting Survey data
export const getSurveyData = async (setArray, setNoData) => {
  let db = await SQLite.openDatabase(
    database_name,
    database_version,
    database_displayname,
    database_size,
  );
  let filedata = [];
  db.transaction(tx => {
    tx.executeSql('SELECT * FROM SatisficatonSurvey', [], (tx, results) => {
      var len = results.rows.length;
      { len == 0 ? setNoData(true) : setNoData(false) }
      for (let i = 0; i < len; i++) {
        let row = results.rows.item(i);
        filedata.push(row);
      }
      ////console.log("---hamza"+JSON.stringify(filedata));
      setArray(filedata);
    });
  });
  return filedata;
};






//Getting Employee Survey data
export const getEmployeeSurveyData = async (setArray, setNoData) => {
  let db = await SQLite.openDatabase(
    database_name,
    database_version,
    database_displayname,
    database_size,
  );
  let filedata = [];
  db.transaction(tx => {
    tx.executeSql('SELECT * FROM EmployeeSatisficatonSurvey', [], (tx, results) => {
      var len = results.rows.length;
      { len == 0 ? setNoData(true) : setNoData(false) }
      for (let i = 0; i < len; i++) {
        let row = results.rows.item(i);
        filedata.push(row);
      }
      // console.log("---faaiz"+JSON.stringify(filedata));
      setArray(filedata);
    });
  });
  return filedata;
};

//////////// Getting stations data

export const getStationData = async (setArray, setNoData) => {
  let db = await SQLite.openDatabase(
    database_name,
    database_version,
    database_displayname,
    database_size,
  );
  let filedata = [];

  db.transaction(tx => {
    tx.executeSql('SELECT StationArray FROM AllArray', [], (tx, results) => {
      var len = results.rows.length;

      { len == 0 ? setNoData(true) : setNoData(false) }

      let row = results.rows.item(0);
      var parser = JSON.parse(row.StationArray)
      parser.map(async (item) => {
        filedata.push({ label: item.StationName, value: item.StationName, id: item.StationId });
      })
      //alert(JSON.stringify(parser[3].StationName))

      //alert(""+JSON.stringify(filedata[0].StationName));
      setArray(filedata);
    });
  });
  return filedata;
};
///////////////////
//////////// Getting stations data

//////////// Getting Donor data "Process Flow"

// export const getDonoretails = async (setArray, setNoData, StationId) => {
//   let db = await SQLite.openDatabase(
//     database_name,
//     database_version,
//     database_displayname,
//     database_size,
//   );
//   let filedata = [];

//   db.transaction(tx => {
//     tx.executeSql('SELECT DonorDetails FROM AllArray', [], (tx, results) => {
//       var len = results.rows.length;

//       { len == 0 ? setNoData(true) : setNoData(false) }

//       let row = results.rows.item(0);
//       var Donor = JSON.parse(row.DonorDetails)
// console.log("Show me Data===>"+JSON.stringify(Donor) )
// return
//       parser.map(async (item) => {
//         // console.log(stationId+"===>>>>"+item.StationId)
//         // if (stationId == item.StationId) {
//           filedata.push({ label: item.DonorName, value: item.DonorName, id: item.DonorId });
//         // }
//       })
//       //alert(JSON.stringify(parser[3].StationName))

//       console.log(">>>>>>" + JSON.stringify(filedata.length));
//       setArray(filedata);
//     });
//   });
//   return filedata;
// };
///////////////////
//////////// Getting stations data

export const getStaffData = async (setArray, setNoData, stationId) => {
  let db = await SQLite.openDatabase(
    database_name,
    database_version,
    database_displayname,
    database_size,
  );
  let filedata = [];

  db.transaction(tx => {
    tx.executeSql('SELECT EmployeesArray FROM AllArray', [], (tx, results) => {
      var len = results.rows.length;

      { len == 0 ? setNoData(true) : setNoData(false) }

      let row = results.rows.item(0);
      var parser = JSON.parse(row.EmployeesArray)

      parser.map(async (item) => {
        // console.log(stationId+"==="+item.StationId)
        if (stationId == item.StationId) {
          filedata.push({ label: item.StaffName, value: item.StaffName, id: item.EmployeeId });
        }
      })
      //alert(JSON.stringify(parser[3].StationName))

      console.log("" + JSON.stringify(filedata.length));
      setArray(filedata);
    });
  });
  return filedata;
};
// ==================== GETTI AND UPATE GROUP MEMMBER ===================
export const getGroupsFromsforMembers = async (setLoading, user_cnic, cnic) => {
  let db = await SQLite.openDatabase(
    database_name,
    database_version,
    database_displayname,
    database_size,
  );
  let filedata = [];
  const promise = new Promise((resolve, reject) => {

    db.transaction(tx => {
      tx.executeSql('SELECT * FROM Groups', [], (tx, results) => {
        var len = results.rows.length;
        setLoading(false)

        for (let i = 0; i < len; i++) {
          let row = results.rows.item(i);
          filedata.push(row);
        }
        if (filedata.length <= 0) {
          resolve(true)
          return
        }
        filedata.map((memberItem, memberIndex) => {
          console.log("===>GroupId", memberItem.group_id)
          let groupForm = JSON.parse(memberItem.groupForm)
          // let ALL = JSON.parse(memberItem.groupForm)

          groupForm.groupMembers.map((underItem, underIndex) => {

            // console.log("================= MEMEBRS")
            // console.log("",JSON.stringify(underItem))
            // console.log("================= MEMEBRS")
            // console.log(underItem.NicNumber+" === "+user_cnic)

            if (underItem.NicNumber === user_cnic) {

              groupForm.groupMembers[underIndex] = {...underItem,NicNumber:cnic}
              //   CustomerGroupId: "",
              //   CustomerGroupMemberId: underIndex + 1,
              //   CustomerId: underItem.CustomerId,
              //   Fullname: underItem.Fullname,
              //   IsGroupLeader: underItem.IsGroupLeader,
              //   NicNumber: cnic,
              //   user_businessAddress: underItem.user_businessAddress,
              //   user_contactNumber: underItem.user_contactNumber,
              //   user_address: underItem.user_address,


              // }
              console.log("================= FINDED")
              console.log("",JSON.stringify(underItem))
              console.log("================= FINDED")
              let store = JSON.stringify(groupForm);
              db.transaction((tx) => {
                tx.executeSql(
                  "UPDATE Groups SET  groupForm = ? WHERE group_id = ?",
                  [store, memberItem.group_id],
                  async (_, result) => {
                    console.log("================= updated group memeber cnic")

                    resolve("Successfully groups Data updated!")
                    // alert("");

                  },
                  (_, error) => {
                    reject(error);
                  }
                );
              });
            } else {
              if (filedata.length - 1 === memberIndex) {
                resolve(true)
              }
            }
          })
        })
        // //console.log(""+JSON.stringify(filedata));
      });
    });
  })

  return promise;
};
///////////////////

export const getGroupGurantors = async (user_cnic, allDataobj, setAlldataobj) => {
  console.log("================= getGroupGurantors",user_cnic)
  let db = await SQLite.openDatabase(
    database_name,
    database_version,
    database_displayname,
    database_size,
  );
  let filedata = [];
  let get = allDataobj;

  const promise = new Promise((resolve, reject) => {

    db.transaction(tx => {
      tx.executeSql('SELECT group_id FROM Group_Gurantors where guarantor_cnic=?', [user_cnic], (tx, results) => {
        var len = results.rows.length;

        // { len == 0 ? setNoData(true) : setNoData(false) }

        let row = results.rows.item(0);
        console.log("---->row==>",row.group_id)
        console.log("---->row==>",row)

        console.log("---->row==>",len)


        if (len > 0) {

          db.transaction(tx => {
            tx.executeSql('SELECT * FROM Group_Gurantors where group_id=?', [row.group_id], (tx, results) => {
              var len = results.rows.length;

              // { len == 0 ? setNoData(true) : setNoData(false) }
              for (let i = 0; i < len; i++) {
                let row = results.rows.item(i);
                filedata.push(row);
              }

              if (len > 0) {
                //console.log("=--->",filedata)
                filedata?.map((item, index) => {
                  if (item.guarantor_cnic != user_cnic) {
                    get.guarantorInfo.push({
                      key: item.groupgurantor_id,
                      isGroupMember: true,
                      activeTab: false,
                      guarantor_fullname: { value: item.guarantor_fullname, error: false },
                      guarantor_cnic: { value: item.guarantor_cnic, error: false },
                      guarantor_address: { value: item.guarantor_address, error: false },
                      guarantor_contactno: { value: item.guarantor_contactno, error: false },
                      guarantor_jobDescription: { value: item.guarantor_jobDescription, error: false },
                      guarantor_businessAddress: { value: item.guarantor_businessAddress, error: false },
                      guarantor_jobType: { value: item.guarantor_jobType, index: item.guarantor_jobType },
                      guarantor_businessNote: { value: item.guarantor_businessNote, error: false },
                      guarantor_businessStatus: 1
                    })
                  }
                })
                setAlldataobj({ ...get })
              } else {
                resolve([])
              }
              // setArray(filedata);
            });
          });

        } else {
          resolve([])
        }
        // setArray(filedata);
      });
    });
  })

  return promise;
};

export const getAllGurantors = async (group_id) => {
  let db = await SQLite.openDatabase(
    database_name,
    database_version,
    database_displayname,
    database_size,
  );
  let filedata = [];
  const promise = new Promise((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql('SELECT * FROM Group_Gurantors where group_id=?', [group_id], (tx, results) => {
        var len = results.rows.length;

        // { len == 0 ? setNoData(true) : setNoData(false) }
        for (let i = 0; i < len; i++) {
          let row = results.rows.item(i);
          filedata.push(row);
        }

        if (len > 0) {

          resolve(filedata)
        } else {
          resolve([])
        }
        // setArray(filedata);
      });
    });
  })

  return promise;
};
export const getAllGroupGurantors = async (group_id) => {
  let db = await SQLite.openDatabase(
    database_name,
    database_version,
    database_displayname,
    database_size,
  );
  let filedata = [];
  let ArrayofGurantors = [];

  const promise = new Promise((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql('SELECT * FROM Group_Gurantors where group_id=?', [group_id], (tx, results) => {
        var len = results.rows.length;

        // { len == 0 ? setNoData(true) : setNoData(false) }
        for (let i = 0; i < len; i++) {
          let row = results.rows.item(i);
          filedata.push(row);
        }
        // console.log("filedata", filedata)
        // console.log("len", filedata)

        if (len > 0) {
          //console.log("=--->",filedata)
          filedata?.map((item, index) => {
            ArrayofGurantors.push({
              key: item.groupgurantor_id,
              isGroupMember: true,
              activeTab: false,
              guarantor_fullname: { value: item.guarantor_fullname, error: false },
              guarantor_cnic: { value: item.guarantor_cnic, error: false },
              guarantor_address: { value: item.guarantor_address, error: false },
              guarantor_contactno: { value: item.guarantor_contactno, error: false },
              guarantor_jobDescription: { value: item.guarantor_jobDescription, error: false },
              guarantor_businessAddress: { value: item.guarantor_businessAddress, error: false },
              guarantor_jobType: { value: item.guarantor_jobType, index: item.guarantor_jobType },
              guarantor_businessNote: { value: item.guarantor_businessNote, error: false },
              guarantor_businessStatus: 1
            })
          })
          resolve(ArrayofGurantors)
        } else {
          resolve([])
        }
        // setArray(filedata);
      });
    });
  })

  return promise;
};
//Getting Organization region data
export const getOrganizationArray = async(setNoData) => {
  let db = await SQLite.openDatabase(
    database_name,
    database_version,
    database_displayname,
    database_size,
  );
  let filedata = [];
  const promise = new Promise((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql('SELECT OrganizationRegion FROM AllArray', [], (tx, results) => {
        var len = results.rows.length;
        { len == 0 ? setNoData(true) : setNoData(false) }
        if (len == 0) {
          resolve([])
          return
        }
         let row = results.rows.item(0);
        var parser = JSON.parse(row.OrganizationRegion)

        parser.map((item) => {
          filedata.push({
            name:item.RegionName, 
            RegionCode:item.RegionCode, 
            RegionId:item.RegionId, 
            RegionParentId:item.RegionParentId, 
            RegionTypeId:item.RegionTypeId
          });
        })

        resolve(filedata);
      });
    });
  })

  return promise;
};

export const getFingerPrintFromDevice = async(fingerPrintArray) => {
  let db = await SQLite.openDatabase(
    database_name,
    database_version,
    database_displayname,
    database_size,
  );
  let filedata = [];
  const promise = new Promise((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql('SELECT forms FROM CustomerForms', [], async(tx, results) => {
        var len = results.rows.length;
        
        if (len == 0) {
          reject("No data found")
          return
        }
        
        for(let x = 0; x < len; x++){
          
          let row = results.rows.item(x);
          var parser = JSON.parse(row.forms)
          var fingerPrint = parser.customerInfo[0]?.customer_biomatric?.imageTemp;
          var cnic = parser.customerInfo[0]?.customer_cnicNumber.value;

          if(fingerPrint != undefined){
            
            filedata.push({cnic: cnic, fingerPrint:fingerPrint})

          }

        }

         for(let y = 0; y < fingerPrintArray.length; y++){

          for(let z=0; z < filedata.length; z++){
            
            if(fingerPrintArray[y].customerCnic != filedata[z].cnic){
              try {
                const eventId = await FingerModule.matchPrintTwo(fingerPrintArray[y].customerFingerPrint, filedata[z].fingerPrint);
                
                  if(eventId == 1){
                    console.log("==>",eventId)
                    reject(`${filedata[z].cnic} These customers fingerprint match each other ${fingerPrintArray[y].customerCnic}`)
                    break
                  }
              } catch(error) {
                    console.log("==|>=>",error)                  
                }
            }
          }
          
        }
        
        // console.log("====================================")
        // console.log("====>",fingerPrintArray);
        // console.log("====================================")

        // parser.map((item) => {
        //   filedata.push({
        //     name:item.RegionName, 
        //     RegionCode:item.RegionCode, 
        //     RegionId:item.RegionId, 
        //     RegionParentId:item.RegionParentId, 
        //     RegionTypeId:item.RegionTypeId
        //   });
        // })

        resolve("");
      });
    });
  })

  return promise;
};
//-------------------------------------------------------Deleters
export const DeleteCustomerForms = async (id,user_cnic) => {
  let db = await SQLite.openDatabase(
    database_name,
    database_version,
    database_displayname,
    database_size,
  );
  const promise = new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        "delete from CustomerForms where id = ?",
        [id],
        async (_, result) => {


          // Alert.alert("Success","Successfully delete!",[{text:"ok",onPress:()=>{}}])
          // deleteCustomer(user_cnic)
          resolve(true)


        },
        (_, error) => {
          reject(false)
          //console.log("error dropping users table");
        }
      );
    });
  })
  return promise;
}
export const DeleteCustomerFormsbyCnic = async (cnic) => {
  let db = await SQLite.openDatabase(
    database_name,
    database_version,
    database_displayname,
    database_size,
  );
  const promise = new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        "delete from CustomerForms where user_cnic = ?",
        [cnic],
        async (_, result) => {

          // deleteCustomer(cnic)
          // Alert.alert("Success","Successfully delete!",[{text:"ok",onPress:()=>{}}])
          resolve(true)


        },
        (_, error) => {
          reject(false)
          //console.log("error dropping users table");
        }
      );
    });
  })
  return promise;
}
export const DeleteDocImages = async (userCnic) => {
  let db = await SQLite.openDatabase(
    database_name,
    database_version,
    database_displayname,
    database_size,
  );
  //console.log("--->", userCnic)
  const promise = new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        "delete from Loan_Documents where user_cnic = ?",
        [userCnic],
        async (_, result) => {

          resolve("success")
          // Alert.alert("Success","Successfully delete!",[{text:"ok",onPress:()=>{}}])


        },
        (_, error) => {
          reject(error)
          //console.log("error dropping users table");
        }
      );
    });
  })
  return promise

}
export const DeleteAssetsImages = async (userCnic) => {
  let db = await SQLite.openDatabase(
    database_name,
    database_version,
    database_displayname,
    database_size,
  );
  const promise = new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        "delete from Assets_Documents where user_cnic = ?",
        [userCnic],
        async (_, result) => {
          resolve("success")

          // Alert.alert("Success","Successfully delete!",[{text:"ok",onPress:()=>{}}])


        },
        (_, error) => {
          reject(error)
          //console.log("error dropping users table");
        }
      );
    });
  })
  return promise;
}

export const DeleteCustomersFormsTemp = async () => {
  let db = await SQLite.openDatabase(
    database_name,
    database_version,
    database_displayname,
    database_size,
  );
  const promise = new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        "Delete from CustomersFormsTemp",
        [],
        async (_, result) => {
          resolve("success")

          // Alert.alert("Success","Successfully delete!",[{text:"ok",onPress:()=>{}}])


        },
        (_, error) => {
          reject(error)
          //console.log("error dropping users table");
        }
      );
    });
  })
  return promise;
}

export const DeleteRegionalDownloadedData = async (id) => {
 
  let db = await SQLite.openDatabase(
    database_name,
    database_version,
    database_displayname,
    database_size,
  );
  const promise = new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        "Delete from CustomerforVisits where CustomerGroupId = ?",
        [id],
        async (_, result) => {
          resolve("success")

          // Alert.alert("Success","Successfully delete!",[{text:"ok",onPress:()=>{}}])


        },
        (_, error) => {
          reject(error)
          //console.log("error dropping users table");
        }
      );
    });
  })
  return promise;
}

export const DeleteGroupsForms = async (id) => {
  let db = await SQLite.openDatabase(
    database_name,
    database_version,
    database_displayname,
    database_size,
  );
  db.transaction((tx) => {
    tx.executeSql(
      "delete from Groups where group_id = ?",
      [id],
      async (_, result) => {

        // alert("Successfully delete!");
        // Alert.alert("Success", "Group Successfully delete!", [{ text: "ok", onPress: () => { } }])


      },
      (_, error) => {
        //console.log("error dropping Groups table");
      }
    );
  });
}



export const DeleteCustomerGurantorsbyId = async (underitem, updateUser) => {
  let db = await SQLite.openDatabase(
    database_name,
    database_version,
    database_displayname,
    database_size,
  );
  const promise = new Promise((resolve, reject) => {
    db.transaction(tx => {
      let parser;
      // first we gettig data of selected user-----------------------
      tx.executeSql('SELECT forms FROM CustomerForms where user_cnic = ?', [updateUser], (tx, results) => {
        var len = results.rows.length;


        parser = results.rows.item(0);


        let wet = parser.forms;
        let get = JSON.parse(wet);


        //remove  guarantor-------------------
        //  guarantor_cnic: {value: underitem.NicNumber,
        let index = 0;
        get.guarantorInfo.map((item, indexx) => {
          if (item.guarantor_cnic.value === underitem.NicNumber) {
            index = indexx;
            //console.log("finded index", item.guarantor_cnic.value + "---" + underitem.NicNumber)
          }
          //  (item.guarantor_cnic.value).indexOf(underitem.NicNumber)
        });
        if (index > -1) {
          get.guarantorInfo.splice(index, 1);
        }

        let covert = JSON.stringify(get);
        db.transaction((tx) => {
          ////////UPDATE USER FROMS
          tx.executeSql(
            "UPDATE CustomerForms SET forms = ?,isGroupMember = ? where user_cnic = ?",
            [covert, "0", updateUser],
            async (_, result) => {
              resolve("Successfully delete!")
            },
            (_, error) => {
              reject("error delete")
            }
          );
        });
      });
    });
  })

  return promise;
};
export const DeleteCustomerGurantorsbySelf = async (underitem, updateUser) => {
  let db = await SQLite.openDatabase(
    database_name,
    database_version,
    database_displayname,
    database_size,
  );
  const promise = new Promise((resolve, reject) => {
    db.transaction(tx => {
      var parser;
      // first we gettig data of selected user-----------------------
      tx.executeSql('SELECT forms FROM CustomerForms where user_cnic = ?', [updateUser], (tx, results) => {
        var len = results.rows.length;
        for (let i = 0; i < len; i++) {
          let row = results.rows.item(i);
          parser = row;

        }

        var wet = parser.forms;
        var get = JSON.parse(wet);

        let values = get.guarantorInfo;
        //remove  guarantor-------------------
        //  guarantor_cnic: {value: underitem.NicNumber,
        let index = 0;
        values.map((item, indexx) => {
          if (item.guarantor_cnic.value == underitem.NicNumber) {
            index = indexx;
            //console.log("finded index", item.guarantor_cnic.value + "---" + underitem.NicNumber)
          }
          //  (item.guarantor_cnic.value).indexOf(underitem.NicNumber)
        });
        if (index > -1) {
          values.splice(index, 1);
        }
        get.guarantorInfo = values
        var covert = JSON.stringify(get);
        db.transaction((tx) => {
          ////////UPDATE USER FROMS
          tx.executeSql(
            "UPDATE CustomerForms SET forms = ?,isGroupMember = ? where user_cnic = ?",
            [covert, "1", updateUser],
            async (_, result) => {
              resolve("Successfully delete!")
            },
            (_, error) => {
              reject("error delete")
            }
          );
        });
      });
    });
  })

  return promise;
};
export const DeleteClientForms = async (id) => {
  let db = await SQLite.openDatabase(
    database_name,
    database_version,
    database_displayname,
    database_size,
  );
  const promise = new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        "delete from SatisficatonSurvey where user_cnic = ?",
        [id],
        async (_, result) => {
          resolve("Successfully delete!")

        },
        (_, error) => {
          reject(error)
          //console.log("error dropping users table");
        }
      );
    });
  })
  return promise;

}


export const DeleteEmployeeForms = async (HRId) => {
  let db = await SQLite.openDatabase(
    database_name,
    database_version,
    database_displayname,
    database_size,
  );
  const promise = new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        "delete from EmployeeSatisficatonSurvey where user_id = ?",
        [HRId],
        async (_, result) => {
          resolve("Successfully delete!")

        },
        (_, error) => {
          reject(error)
          //console.log("error dropping users table");
        }
      );
    });
  })
  return promise;

}




export const DeleteGroup_Gurantors = async (id) => {
  let db = await SQLite.openDatabase(
    database_name,
    database_version,
    database_displayname,
    database_size,
  );
  const promise = new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        "delete from Group_Gurantors where group_id = ?",
        [id],
        async (_, result) => {
          resolve("Successfully delete!")

        },
        (_, error) => {
          reject(error)
          //console.log("error dropping Group_Gurantors table");
        }
      );
    });
  })
  return promise;

}

export const DeleteSelectedGurantors = async (group_id, guarantor_cnic) => {
  let db = await SQLite.openDatabase(
    database_name,
    database_version,
    database_displayname,
    database_size,
  );
  const promise = new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        "Delete from Group_Gurantors where guarantor_cnic = ?",
        [guarantor_cnic],
        async (_, result) => {
          db.transaction((tx) => {
            console.log("--->deleted");
            ////////UPDATE USER FROMS
            tx.executeSql(
              "UPDATE CustomerForms SET isGroupMember = ? where user_cnic = ?",
              ["0", guarantor_cnic],
              async (_, result) => {
                resolve("Successfully delete!")
            console.log("--->update");

              },
              (_, error) => {
                reject("error delete")
              }
            );
          });


        },
        (_, error) => {
          reject(error)
          console.log("error dropping Group_Gurantors table");
        }
      );
    });
  })
  return promise;

}
export const DeleteSelectedGurantorsbyBM = async (group_id, guarantor_cnic) => {
  let db = await SQLite.openDatabase(
    database_name,
    database_version,
    database_displayname,
    database_size,
  );
  const promise = new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        "Delete from Group_Gurantors where guarantor_cnic = ?",
        [guarantor_cnic],
        async (_, result) => {
          db.transaction((tx) => {
            console.log("--->Gurantors deleted");
            ////////UPDATE USER FROMS
            tx.executeSql(
              "delete from CustomerForms where user_cnic = ?",
              [guarantor_cnic],
              async (_, result) => {
                db.transaction((tx) => {
                  // deleteCustomer(guarantor_cnic)
                  console.log("--->form deleted");
                  ////////UPDATE USER FROMS
                  tx.executeSql(
                    "delete from Loan_Documents where user_cnic = ?",
                    [guarantor_cnic],
                    async (_, result) => {
                
                  console.log("--->Documents delte");
                   db.transaction((tx) => {
                  
                  ////////UPDATE USER FROMS
                  tx.executeSql(
                    "delete from Assets_Documents where user_cnic = ?",
                    [guarantor_cnic],
                    async (_, result) => {
                      resolve("Successfully delete!")
                  console.log("--->Assets delte");
      
                    },
                    (_, error) => {
                      reject("error delete")
                    }
                  );
                });
      
                    },
                    (_, error) => {
                      reject("error delete")
                    }
                  );
                });
           

              },
              (_, error) => {
                reject("error delete")
              }
            );
          });


        },
        (_, error) => {
          reject(error)
          console.log("error dropping Group_Gurantors table");
        }
      );
    });
  })
  return promise;

}
//-----------------------------------------------------Updaters
export const UpdateCustomerForms = async (get, id, cnic, name, user_businessAddress, user_contactNumber, user_address, user_jobtype) => {
  let db = await SQLite.openDatabase(
    database_name,
    database_version,
    database_displayname,
    database_size,
  );
  db.transaction((tx) => {
    tx.executeSql(
      "UPDATE CustomerForms SET forms = ?,user_cnic = ?,user_name = ?,user_businessAddress = ?,user_contactNumber = ?,user_address = ?,user_jobtype = ?  where id = ?",
      [get, cnic, name, user_businessAddress, user_contactNumber, user_address, user_jobtype, id],
      async (_, result) => {

        Alert.alert("Success", "Successfully updated!", [{ text: "ok", onPress: () => { } }])


      },
      (_, error) => {
        //console.log("error dropping users table");
      }
    );
  });
}
// Update Customer Forms and insert CustomerAnswers
export const UpdateCustomerFormsforComments = async (Comments, id) => {
  let db = await SQLite.openDatabase(
    database_name,
    database_version,
    database_displayname,
    database_size,
  );
  const promise = new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        "UPDATE CustomerForms SET Comments = ?  where id = ?",
        [Comments, id],
        async (_, result) => {

          resolve("success")

        },
        (_, error) => {
          //console.log("error dropping users table");
          reject(error)
        }
      );
    });
  })
  return promise;

}
//when user remove member from group
export const UpdateCustomerFormsforGroup = async (get, id) => {
  let db = await SQLite.openDatabase(
    database_name,
    database_version,
    database_displayname,
    database_size,
  );
  db.transaction((tx) => {
    tx.executeSql(
      "UPDATE CustomerForms SET isGroupMember = ? where id = ?",
      [get, id],
      async (_, result) => {

        Alert.alert("Success", "Successfully updated!", [{ text: "ok", onPress: () => { } }])


      },
      (_, error) => {
        //console.log("error dropping users table");
      }
    );
  });
}
//Update Groups form data
export const updateGroupsForm = async (group_name, groupForm, id) => {
  let db = await SQLite.openDatabase(
    database_name,
    database_version,
    database_displayname,
    database_size,
  );
  const promise = new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        "UPDATE Groups SET group_name = ?, groupForm = ? WHERE group_id = ?",
        [group_name, groupForm, id],
        async (_, result) => {
          resolve("Successfully groups Data updated!")
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
//Update Survey form data
export const updateSurveyForm = async (username, surveyForm, userCnic) => {
  let db = await SQLite.openDatabase(
    database_name,
    database_version,
    database_displayname,
    database_size,
  );
  const promise = new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        "UPDATE SatisficatonSurvey SET username = ?, survey_form = ? WHERE user_cnic= ?",
        [username, surveyForm, userCnic],
        async (_, result) => {
          resolve("Successfully Survey Data updated!")
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

export const UpdateAssetsImages = async (assetsArray, user_cnic) => {
  let db = await SQLite.openDatabase(
    database_name,
    database_version,
    database_displayname,
    database_size,
  );
  const promise = new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        "UPDATE Assets_Documents SET docs_array = ?  where user_cnic = ?",
        [assetsArray, user_cnic],
        async (_, result) => {

          resolve("success")

        },
        (_, error) => {
          //console.log("error update Assets_Documents table");
          reject(error)
        }
      );
    });
  })
  return promise;

}



export const UpdateDocsImages = async (group_id) => {
  let db = await SQLite.openDatabase(
    database_name,
    database_version,
    database_displayname,
    database_size,
  );
  const promise = new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        "UPDATE Loan_Documents SET docs_array = ?  where user_cnic = ?",
        [docsArray, user_cnic],
        async (_, result) => {

          resolve("success")

        },
        (_, error) => {
          //console.log("error update Loan_Documents table");
          reject(error)
        }
      );
    });
  })
  return promise;

}
export const UpdateGroupGurantors = async (guarantor_fullname, guarantor_businessNote, guarantor_jobType,
  guarantor_businessStatus, guarantor_cnic, guarantor_address, guarantor_contactno,
  guarantor_jobDescription, guarantor_businessAddress, groupgurantor_id) => {
  //console.log("==>guarantor_fullname",guarantor_fullname)
  //console.log("==>guarantor_businessNote",guarantor_businessNote)
  //console.log("==>guarantor_jobType",guarantor_jobType)
  //console.log("==>guarantor_businessStatus",guarantor_businessStatus)
  //console.log("==>guarantor_cnic",guarantor_cnic)
  //console.log("==>guarantor_address",guarantor_address)
  //console.log("==>guarantor_contactno",guarantor_contactno)
  //console.log("==>guarantor_jobDescription",guarantor_jobDescription)
  //console.log("==>guarantor_businessAddress",guarantor_businessAddress)
  //console.log("==>groupgurantor_id",groupgurantor_id)

  let db = await SQLite.openDatabase(
    database_name,
    database_version,
    database_displayname,
    database_size,
  );
  const promise = new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        "UPDATE Group_Gurantors SET guarantor_fullname = ?,guarantor_businessNote = ?, guarantor_jobType= ? , guarantor_businessStatus = ?,guarantor_cnic = ? ,guarantor_address = ? , guarantor_contactno=?,guarantor_jobDescription=?,guarantor_businessAddress=? where groupgurantor_id = ?",
        [guarantor_fullname, guarantor_businessNote, guarantor_jobType, guarantor_businessStatus, guarantor_cnic, guarantor_address, guarantor_contactno, guarantor_jobDescription, guarantor_businessAddress, groupgurantor_id],
        async (_, result) => {
          //console.log("update Group_Gurantors");
          resolve("success")

        },
        (_, error) => {
          //console.log("error update Group_Gurantors table");
          reject(error)
        }
      );
    });
  })
  return promise;

}


export const UpdateGroupGurantorsCNIC = async (new_guarantor_cnic, old_guarantor_cnic) => {
  let db = await SQLite.openDatabase(
    database_name,
    database_version,
    database_displayname,
    database_size,
  );
  const promise = new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        "UPDATE Group_Gurantors SET guarantor_cnic = ?  where guarantor_cnic = ?",
        [new_guarantor_cnic, old_guarantor_cnic],
        async (_, result) => {

          resolve("success")

        },
        (_, error) => {
          //console.log("error update Loan_Documents table");
          reject(error)
        }
      );
    });
  })
  return promise;

}

export const UpdateCustomerVisit = async ( maker,group_id) => {
  let db = await SQLite.openDatabase(
    database_name,
    database_version,
    database_displayname,
    database_size,
  );
  const promise = new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        "UPDATE CustomerforVisits SET Comments = ?  where CustomerGroupId = ?",
        [maker,group_id],
        async (_, result) => {

          resolve("success")

        },
        (_, error) => {
          //console.log("error update Loan_Documents table");
          reject(error)
        }
      );
    });
  })
  return promise;

}
export const UpdateLoginData= async ( LoginData,Employee_Id) => {
  let db = await SQLite.openDatabase(
    database_name,
    database_version,
    database_displayname,
    database_size,
  );
  const promise = new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        "UPDATE CustomerLogin SET LoginData = ?  where Employee_Id = ?",
        [LoginData,Employee_Id],
        async (_, result) => {

          resolve("success")

        },
        (_, error) => {
          //console.log("error update Loan_Documents table");
          reject(error)
        }
      );
    });
  })
  return promise;

}
export const getEmployeesAccordStationId = async (setArray, setNoData, stationId) => {
  let db = await SQLite.openDatabase(
    database_name,
    database_version,
    database_displayname,
    database_size,
  );
  let filedata = [];

  db.transaction(tx => {
    tx.executeSql('SELECT EmployeesArray FROM AllArray', [], (tx, results) => {
      var len = results.rows.length;

      { len == 0 ? setNoData(true) : setNoData(false) }

      let row = results.rows.item(0);
      var parser = JSON.parse(row.EmployeesArray)

      parser.map(async (item) => {
        // console.log(stationId+"==="+item.StationId)
        if (stationId == item.StationId) {
          filedata.push({ name: item.StaffName, value: item.StaffName, id: item.EmployeeId });
        }
      })
      //alert(JSON.stringify(parser[3].StationName))

      console.log("" + JSON.stringify(filedata.length));
      setArray(filedata);
    });
  });
  return filedata;
};
export const getCustomer = async (cnic) => {
  let db = await SQLite.openDatabase(
    database_name,
    database_version,
    database_displayname,
    database_size,
  );
  // console.log("checkingCustomerByCnic===>", cnic)
  let filedata = [];
  const promise = new Promise((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql('SELECT forms, CustomerAnswers, id FROM CustomerForms where user_cnic = ?', [cnic], (tx, results) => {
        var len = results.rows.length;
        for (let i = 0; i < len; i++) {
          let row = results.rows.item(i);
          filedata.push(row);
        }
        //console.log("--->sql methode........---->" + JSON.stringify(filedata));
        resolve(filedata)
      });
    });
  })

  return promise;
};
