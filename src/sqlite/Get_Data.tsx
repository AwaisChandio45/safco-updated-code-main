import SQLite from 'react-native-sqlite-storage';
// SQLite.enablePromise(true);
// SQLite.DEBUG(true);
const database_name = 'SafcoMicrofinance_Main_Database.db';
const database_version = '1.0';
const database_displayname = 'Safco Microfinance Database';
const database_size = 2000000;

const Get_All_Data = async (TabelName) => {
  const promise=new Promise(async(resolve,reject)=>{
    try {
      let temp = [];
      let Query = 'SELECT DISTINCT * FROM ' + TabelName;
      await SQLite.openDatabase(
        database_name,
        database_version,
        database_displayname,
        database_size,
      ).then(async (DB) => {
        await DB.transaction(async (tx) => {
          await tx.executeSql(Query, [], async (tx, results) => {
            for (let i = 0; i < results.rows.length; ++i)
              temp.push(results.rows.item(i));
          });
        });
      });
      resolve(temp)
    } catch (error) {
      //console.log(error);
      reject([])
    }
  })
  return promise
  
};

const Get_Data_With_Condition = async (TabelName, Condition) => {
  try {
    let temp = [];
    let Query = 'SELECT DISTINCT * FROM ' + TabelName + Condition;
    await SQLite.openDatabase(
      database_name,
      database_version,
      database_displayname,
      database_size,
    ).then(async (DB) => {
      await DB.transaction(async (tx) => {
        await tx.executeSql(Query, [], async (tx, results) => {
          for (let i = 0; i < results.rows.length; ++i)
            temp.push(results.rows.item(i));
        });
      });
    });
    return temp;
  } catch (error) {
    //console.log(error);
    return [];
  }
};

const delete_Single_Table = async (TabelName) => {
  try {
    let temp = [];
    let Query = 'DELETE FROM ' + TabelName;
    await SQLite.openDatabase(
      database_name,
      database_version,
      database_displayname,
      database_size,
    ).then(async (DB) => {
      await DB.transaction(async (tx) => {
        await tx.executeSql(Query, [], async (tx, results) => {
          for (let i = 0; i < results.rows.length; ++i)
            temp.push(results.rows.item(i));
        });
      });
    });
    return temp;
  } catch (error) {
    //console.log(error);
    return [];
  }
};

export default {
  Get_All_Data,
  Get_Data_With_Condition,
  delete_Single_Table,
};
