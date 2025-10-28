import { Alert, PermissionsAndroid } from "react-native";
import { CallforTags, CheckingTags, uploadingAssetsImage, uploadingCustomerdata, uploadingDocs } from "../apis_auth/apis";
import { checkingCustomerByCnic, DeleteAssetsImages, DeleteCustomerFormsbyCnic, DeleteDocImages, DeleteGroupsForms, DeleteSelectedGurantors, getAllGroupGurantors, getAllGurantors, getAssetsDocumentsforSyncup, getCustomerFromsbyId, getCustomerFromsByidforGroupSyncup, getLoanDocuments, insertGroupCustomerFromDatawithPromise,insertCustomerFromDatawithPromise, insertGroupFromData, insertMultipleAssetsImages, insertMultipleDocumentsImages, insert_Group_Gurantors } from "../sqlite/sqlitedb";
import RNFS from 'react-native-fs';

export const SingleCustomerSyncdown = async (getAllData,getIndexer,index,setter,getter,setLoader,compositeKey,BMCheck,stationId,stationName,GroupId) => {
    var NewCustomers = [];
    var NewCustomerCnic = [];
    const promise=new Promise((resolve,reject)=>{

    const stopLoading = () => {
        let get=getter;
        get[index].loading=false;
        setter([...get])
        setLoader(false)
        resolve(true)
    }

    const recursion_checkingCustomer = async (allData, indexer) => {

        checkingCustomerByCnic(allData[indexer - 1].CustomerDataObject[0].user_cnic)
            .then(async (res) => {
                // console.log("CustomerDocImages", allData[indexer - 1].CustomerDocImages)
                if (res == 0) {
                    let rechecker = NewCustomers.findIndex(x => x.CustomerDataObject[0].user_cnic === allData[indexer - 1].CustomerDataObject[0].user_cnic);
                    console.log("rechecker", rechecker)
                    if (rechecker == -1) {
                        console.log("--->" + allData[indexer - 1].CustomerDataObject[0].user_cnic + "-->NEED TO INSERTED")
                        NewCustomers.push(allData[indexer - 1])
                    } else {
                        console.log("not finded in database but already pushed in array")
                    }
                    } else {
                        // alert('skiped')
                        console.log("--->" + allData[indexer - 1].CustomerDataObject[0].user_cnic + "-->ALREADY INSERTED")

                        // console.log("--->"+allData[indexer-1].CustomerDataObject[0].user_cnic+"-->SKIPPED")

                    }

                let nextNumber = indexer - 1;

                if (nextNumber > 0) {
                    recursion_checkingCustomer(allData, nextNumber);
                } else {
                    recursion_insertingCustomerForms(NewCustomers, NewCustomers.length,compositeKey)
                }
                      })
                      .catch(async (err) => { 
                          stopLoading();
                      })
              }


          const recursion_insertingCustomerForms = async (allData, indexer,compositeKey) => {
              // console.log("--->Length-->", allData)
              if (allData.length <= 0) {
                  NewCustomers = [];// ----> this is for again making null 
                  alert("Customer Data Synced Successfully")
                  stopLoading();


        } else {
            // console.log("--->working recursion-->",allData[indexer-1].CustomerDataObject[0])
            var CustomerDataObject = allData[indexer - 1].CustomerDataObject[0];
            CustomerDataObject.forms["StationId"] = stationId;
            CustomerDataObject.forms["StationName"] = stationName;

            var answerArray = { answerArray: CustomerDataObject.CustomerAnswers }

            insertCustomerFromDatawithPromise(JSON.stringify(CustomerDataObject.forms), CustomerDataObject.date, CustomerDataObject.user_cnic, CustomerDataObject.user_name, CustomerDataObject.user_businessAddress, CustomerDataObject.user_contactNumber, CustomerDataObject.user_address, CustomerDataObject.user_jobtype, "", JSON.stringify(answerArray), CustomerDataObject.Latitude, CustomerDataObject.Longitudes, JSON.stringify(CustomerDataObject.Comments),compositeKey,BMCheck,"CustomerCib" in CustomerDataObject?JSON.stringify(CustomerDataObject.CustomerCib):"",GroupId)
                .then((res) => {
                    console.log("--->inserted-->")
                    NewCustomerCnic.push(CustomerDataObject)
                    let nextNumber = indexer - 1;
                    if (nextNumber > 0) {
                        recursion_insertingCustomerForms(allData, nextNumber,compositeKey);
                    } else {
                        // NewCustomers = [];// ----> this is for again making null
                        console.log("--->NewCustomerCnic Length-->" + NewCustomerCnic.length)
                        recursion_insertedCustomers(NewCustomerCnic, NewCustomerCnic.length, allData, allData.length)

                    }

                })
                .catch((error) => {
                    console.log("--->error in inserting customer forms" + error)
                    stopLoading();

                })
        }


    }


    const recursion_insertingCustomerDocImages = async (allData, underIndexer) => {
        const promise = new Promise((resolve, reject) => {
            let maker = allData[underIndexer - 1];
            let makerValueObject = { value: maker.ImageName, error: false }
            insertMultipleDocumentsImages(maker.NicNumber, JSON.stringify(makerValueObject), JSON.stringify(maker.Image))
                .then((res) => {
                    // console.log("--->inserted doc image-->"+underIndexer)
                    let nextNumber = underIndexer - 1;
                    if (nextNumber > 0) {
                        recursion_insertingCustomerDocImages(allData, nextNumber);
                    }
                    else {
                        resolve(true)
                        // NewCustomerCnic = [];// ----> this is for again making null
                        // recursion_insertingCustomerAssetsImages(allData, allData.length)
                    }
                })
            return promise
        })
    }
    const recursion_insertingCustomerAssetsImages = async (allData, indexer) => {
        let maker = allData[indexer - 1];
        let makerValueObject = { value: maker.ImageName.value, error: false }
        insertMultipleAssetsImages(maker.NicNumber, maker.Assets_Id, JSON.stringify(makerValueObject), JSON.stringify(maker.Image), "")
            .then((res) => {
                let nextNumber = indexer - 1;
                if (nextNumber > 0) {
                    recursion_insertingCustomerAssetsImages(allData, nextNumber);
                }
                // else {
                // NewCustomerCnic = [];// ----> this is for again making null
                // alert("Customer Data Synced Successfully")
                // }
            })
    }
    const recursion_insertedCustomers = (allData, indexer, topItem, topIndex) => {
        // let maker=[];
        // topItem[topIndex-1].CustomerDocImages.map((item,index)=>{
        //   if(allData[indexer-1].user_cnic==item.NicNumber){
        //   console.log(allData[indexer-1].user_cnic+"<---Docs---finded>"+index+"-->"+item.NicNumber)
        //     maker.push(item)
        //   }
        // })
        // let maker2=[];
        // topItem[topIndex-1].CustomerAssetsImages.map((item,index)=>{
        //   if(allData[indexer-1].user_cnic==item.NicNumber){
        //   console.log(allData[indexer-1].user_cnic+"<---Assets---finded>"+index+"-->"+item.NicNumber)

        //     maker2.push(item)
        //   }
        // })
        let allDocImages = topItem[topIndex - 1].CustomerDocImages;
        recursion_insertingCustomerDocImages(allDocImages, allDocImages.length).then(() => {

            let allAssetsImages = topItem[topIndex - 1].CustomerAssetsImages;
            recursion_insertingCustomerAssetsImages(allAssetsImages, allAssetsImages.length)

            let nextNumber = topIndex - 1;
            if (nextNumber > 0) {
                console.log("--->" + allData[indexer - 1].user_cnic + "-->again")
                recursion_insertedCustomers(allData, indexer, topItem, nextNumber);
            } else {
                NewCustomerCnic = [];// ----> this is for again making null
                Alert.alert("Success","Customer Data Synced Successfully")
                stopLoading();
            }
        })
    }
    recursion_checkingCustomer(getAllData, getAllData.length);
    })
    return promise;
}

export const GroupSyncdown = async (res,index,setter,getter,composite_key,GroupId,setLoader,BMCheck,stationId,stationName) => {
    let allCustomers = [];
    let allCustomersDocs = [];
    let allCustomersAssets = [];
    let allGroups = [];
    let allCustomersGurantor = [];
    let NewCustomers=[];
    const promise=new Promise((resolve,reject)=>{
    const stopLoading = () => {
        let get=getter;
        get[index].loading=false;
        setter([...get])
        setLoader(false)
        resolve(true)
    }
      // *********************************************************
  const recursion_allCustomerInGroups = (allData, indexer) => {
    allData[indexer - 1].CustomerDataObject.map((item, index) => {
      allCustomers.push(item)
    })
    let nextIndexer = indexer - 1;
    if (nextIndexer > 0) {
      recursion_allCustomerInGroups(allData, nextIndexer)
    } else {
      console.log("allCustomers", allCustomers.length)
      recursion_checkingCustomer(allCustomers,allCustomers.length,allData,allData.length)
    }
  }

  const recursion_allDocsInGroups = (allData, indexer) => {
    allData[indexer - 1].CustomerDocImages.map((item, index) => {
      allCustomersDocs.push(item)
    })
    let nextIndexer = indexer - 1;
    if (nextIndexer > 0) {
      recursion_allDocsInGroups(allData, nextIndexer)
    } else {
      console.log("allCustomersDocs", allCustomersDocs.length)
      recursion_insertingCustomerDocImages(allCustomersDocs, allCustomersDocs.length)
    }
  }

  const recursion_allAssetsInGroups = (allData, indexer) => {
    allData[indexer - 1].CustomerAssetsImages.map((item, index) => {
      allCustomersAssets.push(item)
    })
    let nextIndexer = indexer - 1;
    if (nextIndexer > 0) {
      recursion_allAssetsInGroups(allData, nextIndexer)
    } else {
      console.log("allCustomersAssets", allCustomersAssets.length)
      recursion_insertingCustomerAssetsImages(allCustomersAssets, allCustomersAssets.length)

    }
  }

  const recursion_allGurantorInGroups = (allData, indexer,composite_key) => {
    allData[indexer - 1].GroupGurantors.map((item, index) => {
      allCustomersGurantor.push(item)
    })
    let nextIndexer = indexer - 1;
    if (nextIndexer > 0) {
      recursion_allGurantorInGroups(allData, nextIndexer,composite_key)
    } else {
      console.log("allCustomersGurantor", allCustomersGurantor.length)
      console.log("composite_key", composite_key)

      recursion_insertGurantorGroup(allCustomersGurantor,allCustomersGurantor.length,composite_key)
      // recursion_checkingCustomer(allCustomers,allCustomers.length,allData,allData.length)
    }
  }

  const recursion_allGroups = (allData, indexer) => {
     allData[indexer - 1]["CompKey"]=allData[indexer - 1].CompKey
    allGroups.push(allData[indexer - 1].Group)
   
    let nextIndexer = indexer - 1;
    if (nextIndexer > 0) {
      recursion_allGroups(allData, nextIndexer)
    } else {
      console.log("allGroups", allGroups.length)
      recursion_insertGroup(allGroups,allGroups.length)
      // recursion_checkingCustomer(allCustomers,allCustomers.length,allData,allData.length)
    }
  }


  const recursion_checkingCustomer = async (allData, indexer, topItem, topIndex) => {
    checkingCustomerByCnic(allData[indexer - 1].user_cnic)
      .then(async (res) => {
        // console.log("CustomerDocImages", allData[indexer - 1].CustomerDocImages)
        if (res == 0) {
          let rechecker=NewCustomers.findIndex(x => x.user_cnic === allData[indexer - 1].user_cnic);
          console.log("rechecker",rechecker)
          if(rechecker==-1){
          console.log("--->" + allData[indexer - 1].user_cnic + "-->NEED TO INSERTED")
          NewCustomers.push(allData[indexer - 1])
          }else{
            console.log("not finded in database but already pushed in array")
          }
        } else {
          // alert('skiped')
          console.log("--->" + allData[indexer - 1].user_cnic + "-->ALREADY INSERTED")
          // console.log("--->"+allData[indexer-1].CustomerDataObject[0].user_cnic+"-->SKIPPED")
        }
        let nextNumber = indexer - 1;
        if (nextNumber > 0) {
          recursion_checkingCustomer(allData, nextNumber, topItem, topIndex);
        } else {
          allCustomers = [];
          recursion_insertingCustomerForms(NewCustomers, NewCustomers.length, topItem, topIndex)
        }
      })
      .catch(async (err) => { })
  }
  const recursion_insertingCustomerForms = async (allData, indexer, topItem, topIndex) => {
    // console.log("--->Length-->", allData)
    if (allData.length <= 0) {
      NewCustomers = [];// ----> this is for again making null 
      alert("Customer Data Synced Successfully")
      stopLoading();
    } else {
      // console.log("--->working recursion-->",allData[indexer-1].CustomerDataObject[0])
      var CustomerDataObject = allData[indexer - 1];
      var answerArray = { answerArray: CustomerDataObject.CustomerAnswers }
      CustomerDataObject.forms["StationId"] = stationId;
      CustomerDataObject.forms["StationName"] = stationName;
      insertGroupCustomerFromDatawithPromise(JSON.stringify(CustomerDataObject.forms), CustomerDataObject.date, CustomerDataObject.user_cnic, CustomerDataObject.user_name, CustomerDataObject.user_businessAddress, CustomerDataObject.user_contactNumber, CustomerDataObject.user_address, CustomerDataObject.user_jobtype,CustomerDataObject.isGroupMember, JSON.stringify(answerArray), CustomerDataObject.Latitude, CustomerDataObject.Longitudes, JSON.stringify(CustomerDataObject.Comments),"",BMCheck,"CustomerCib" in CustomerDataObject?JSON.stringify(CustomerDataObject.CustomerCib):"")
        .then((res) => {
          console.log("--->inserted-->")
          // NewCustomerCnic.push(CustomerDataObject.user_C)
          let nextNumber = indexer - 1;
          if (nextNumber > 0) {
            recursion_insertingCustomerForms(allData, nextNumber, topItem, topIndex);
          } 
        })
        .catch((error) => {
          console.log("--->error in inserting customer forms" + error)
          stopLoading();
        })
    }
  }
  const recursion_insertingCustomerDocImages = async (allData, underIndexer) => {
    const promise = new Promise((resolve, reject) => {
      let maker = allData[underIndexer - 1];
      let makerValueObject = { value: maker.ImageName, error: false }
      insertMultipleDocumentsImages(maker.NicNumber, JSON.stringify(makerValueObject), JSON.stringify(maker.Image))
        .then((res) => {
          // console.log("--->inserted doc image-->"+underIndexer)
          let nextNumber = underIndexer - 1;
          if (nextNumber > 0) {
            recursion_insertingCustomerDocImages(allData, nextNumber);
          }
          else {
            resolve(true)
            // NewCustomerCnic = [];// ----> this is for again making null
            // recursion_insertingCustomerAssetsImages(allData, allData.length)
          }
        }).catch((error) => {
          console.log("--->error in inserting customer doc images" + error)
        })
      return promise
    })
  }

  const recursion_insertingCustomerAssetsImages = async (allData, indexer) => {
    let maker = allData[indexer - 1];
    let makerValueObject = { value: maker.ImageName.value, error: false }
    insertMultipleAssetsImages(maker.NicNumber, maker.Assets_Id, JSON.stringify(makerValueObject), JSON.stringify(maker.Image), "",)
      .then((res) => {
        let nextNumber = indexer - 1;
        if (nextNumber > 0) {
          recursion_insertingCustomerAssetsImages(allData, nextNumber);
        }
        // else {
        // NewCustomerCnic = [];// ----> this is for again making null
        // alert("Customer Data Synced Successfully")
        // }
      }).catch((error) => {
        console.log("--->error in inserting customer assets images" + error)
      })
  }

  const recursion_insertGroup = (allData, indexer) => {
    allData[indexer-1].groupForm["StationId"]=stationId;
    allData[indexer-1].groupForm["StationName"]=stationName;
    
    insertGroupFromData(GroupId,allData[indexer - 1].user_id, allData[indexer-1].group_name, JSON.stringify(allData[indexer-1].groupForm), allData[indexer-1].date,composite_key,BMCheck).then((vales) => {
      // alert("" + JSON.stringify(vales.group_id))
      // countDownOne(members.length, members)
      let nextNumber = indexer - 1;
      if (nextNumber > 0) {
        recursion_insertGroup(allData, nextNumber);
      } else {
        recursion_allGurantorInGroups(res, res.length,composite_key)
      }
      // props.navigation.goBack();
    }).catch((error) => {
        console.log("error in inserting group" + error)
        stopLoading();
    }) 
  }

  const recursion_insertGurantorGroup = (allData, indexer,composite_key) => {
    insert_Group_Gurantors(
      composite_key,
      allData[indexer-1].activeTab,
      allData[indexer-1].guarantor_fullname.value,
        allData[indexer-1].guarantor_businessNote.value,
          allData[indexer-1].guarantor_jobType.value,
            JSON.stringify(allData[indexer-1].guarantor_businessStatus),
              allData[indexer-1].guarantor_cnic.value,
                allData[indexer-1].guarantor_address.value,
                  allData[indexer-1].guarantor_contactno.value,
                    allData[indexer-1].guarantor_jobDescription.value,
                      allData[indexer-1].guarantor_businessAddress.value
    ).then((vales) => {
      // alert("" + JSON.stringify(vales.group_id))
      // countDownOne(members.length, members)
  
      let nextNumber = indexer - 1;
      if (nextNumber > 0) {
        recursion_insertGurantorGroup(allData, nextNumber,composite_key);
      } else {
          stopLoading();
      }
      // props.navigation.goBack();
    }).catch((error) => {
        console.log("--->error in inserting gurantor group" + error)
        stopLoading();
    })
  }

  // ========================== SYNC DOWN Process End ==============================
  // *********************************************************************  
    recursion_allGroups(res, res.length)
    recursion_allCustomerInGroups(res, res.length)
    recursion_allDocsInGroups(res, res.length)
    recursion_allAssetsInGroups(res, res.length)  
})
return promise;
}
