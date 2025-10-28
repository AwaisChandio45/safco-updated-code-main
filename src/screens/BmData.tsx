import React from "react";
import { Alert, FlatList, View } from "react-native";
import { AppStatusBar, HeaderwithoutDialoge, Nodata, Tabsitems, TextView } from "../components";
import { Colors, GlobalStyles } from "../theme";
import { connect, useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import { getBmData, getObjectbyBranchManager } from "../apis_auth/apis";
import BMCustomersRecord from "../components/BMCustomersRecord";
import { GroupSyncdown, SingleCustomerSyncdown } from "../process/CommonProcess";
import { ActivityIndicator } from "react-native-paper";
import { checkingCustomerByCnic, checkingGroupsbyCompositekey } from "../sqlite/sqlitedb";
import Toast from "../components/Toast";
import ModalListComponent from "../components/ModalListComponent";

const BmData = (props) => {

    const { item, verfication } = props.route.params;

    const navigation = useNavigation();
    const [index, setIndex] = React.useState(1);
    const [customers, setCustomer] = React.useState(undefined);
    const [groups, setGroups] = React.useState(undefined);
    const [progressVisible, setProgressVisible] = React.useState(false);
    const [noData, setNoData] = React.useState(false)
    const [toast, setToast] = React.useState({ value: "", type: "" });
    const [loader, setLoader] = React.useState(false)
    const getUserData = useSelector((state) => state.UserData);
    const [getStation, setStation] = React.useState([])
    const [selectedStation, setSelectedStation] = React.useState(undefined);
    //const []
    const gettingStations = getUserData.UserData.EmployeeStation
    // console.log('customers ===>>>',customers)

    let temp = []
    React.useEffect(() => {
            

        
        gettingStations.map((item, index)=>{
            
            temp.push({label: item.StationName, stationId:item.StationId})
        
        })
       
        setStation([...temp])
        
        // const unsubscribe = props.navigation.addListener('focus', () => {
            

        // });

        // Return the function to unsubscribe from the event so it gets removed on unmount
        //return unsubscribe;
    }, [navigation]);

    const makingCollection = async (res) => {
        let grp = [];
        let cus = [];
        
        const promise = new Promise((resolve, reject) => {
            res?.Customers.map((item) => {
                checkingCustomerByCnic(item.CNIC).then((count) => {
                    if (count == 0) {
                        cus.push({ ...item, loading: false, alreadySynced: false })
                    } else {
                        cus.push({ ...item, loading: false, alreadySynced: true })

                    }
                }).catch((err) => { })
            });

            res?.Groups.map((item) => {
               
                checkingGroupsbyCompositekey(item.CompositKey)
                    .then((count) => {
                        if (count == 0) {
                            grp.push({ ...item,loading: false, alreadySynced: false })
                        } else {
                            grp.push({ ...item , loading: false, alreadySynced: true })

                        }
                    })
                    .catch((err) => { })
            });
            
            resolve({ grp, cus })
        })
        return promise;
    }
    const gettingStationwiseData = async (stationId, verfication) => {

        setCustomer([])

        setProgressVisible(true);
        console.log("gettingStationwiseData====>", stationId);
        
        getBmData(stationId, verfication)
            .then((res) => {
                if (res) {
                    if (res === "No data Found") {
                        setToast({ message: "Sorry! data not found on this station.", type: "error" });
                        setProgressVisible(false);
                        setNoData(true);
                        return
                    } else {
                        setNoData(false);
                    }
                    // let parser=JSON.parse(res);
                    console.log('<=====================customers Objet==========================>')
                    console.log('customers Objet==>', res)
                    console.log('<=====================customers Objet==========================>')

                    makingCollection(res).then((res) => {


                        setTimeout(() => {
                            setCustomer(res.cus);
                            setGroups(res.grp);
                            setProgressVisible(false);

                        }, 500);



                    })



                } else {
                    console.log("Result is null");
                    setProgressVisible(false);

                }

            })
            .catch((error) => {
                console.log("catch works=>" + error);
                setProgressVisible(false);
            });

    }

    const renderItemCustomers = ({ item, index }) => (
        <BMCustomersRecord
            FirstName={item.CustomerName}
            NICNumber={item.CNIC}
            iconName={"person"}
            onPress={() => { onPressSyncdown(item.CompositKey,item.GroupId,1, index, item.alreadySynced) }}
            type={"1"}
            progressVisible={item.loading}
            alreadySynced={item.alreadySynced}

        >

        </BMCustomersRecord>

    );

    const renderItemGroups = ({ item, index }) => (
        <BMCustomersRecord
            FirstName={item.GroupName}
            NICNumber={""}
            iconName={"account-group"}
            onPress={() => { onPressSyncdown(item.CompositKey,item.GroupId, 2, index, item.alreadySynced) }}
            type={"2"}
            progressVisible={item.loading}
            alreadySynced={item.alreadySynced}


        >

        </BMCustomersRecord>

    );


    const onPressSyncdown = (compositeKey,GroupId, action, index, alreadySynced) => {

        if (alreadySynced) {
            return
        }
        else if (loader) {
            Alert.alert("Please wait", "Sync is in progress")
            return
        }
        if (action == 2) {
            checkingGroupsbyCompositekey(compositeKey)
                .then((count) => {

                    if (count == 0) {
                        processMoreData(action, compositeKey,index,GroupId)
                    } else if (count > 0) {
                        Alert.alert("Stop!", "This Group is already synced")
                    }
                })
        }

        if (action == 1) {
            checkingCustomerByCnic(compositeKey)
                .then((count) => {
                    if (count == 0) {
                        processMoreData(action, compositeKey,index,GroupId)
                    } else if (count > 0) {
                        Alert.alert("Stop!", "This User is already synced")

                    }
                })
        }


    }
    const processMoreData = (action, compositeKey,index,GroupId ) => {
        
        

       if (action == 1) {
            let get = customers;
            get[index].loading = true;
            setCustomer([...get])

        }
            else if (action == 2) {
            let get = groups;
            get[index].loading = true;
            setGroups([...get])
        }
        setLoader(true)
        
        getObjectbyBranchManager(compositeKey)
            .then((res) => {
                if (res != undefined && res.length > 0) {
                    if (action == 1) {
                        SingleCustomerSyncdown(res, res.length, index, setCustomer, customers, setLoader, compositeKey,getUserData.UserData.EmployeeTypeName == "Branch Manager"?1:2,selectedStation?.stationId,selectedStation.label,GroupId)
                            .then((res) => {
                                gettingStationwiseData(selectedStation?.stationId, verfication);
                            })
                    } else if (action == 2) {
                        GroupSyncdown(res, index, setGroups, groups, compositeKey, GroupId,setLoader,getUserData.UserData.EmployeeTypeName == "Branch Manager"?1:2,selectedStation?.stationId,selectedStation.label,GroupId)
                            .then((res) => {
                                gettingStationwiseData(selectedStation?.stationId, verfication);
                            })
                    }

                } else {
                    Alert.alert("Sorry", "No Data Found on");
                }
            })
            .catch((error) => {
                console.log("BMDATA-->" + error)
                setProgressVisible(false);
                setLoader(false)
            });
    }


    return (
        <>
            <AppStatusBar></AppStatusBar>
            <View style={GlobalStyles.row}>
                <HeaderwithoutDialoge Theme={Colors} back={true}></HeaderwithoutDialoge>

                <TextView
                    type={'mini_heading22'}
                    style={{ paddingHorizontal: 30, marginTop: 55, fontSize: 15 }}
                    text="Pending Users"></TextView>
            </View>

            <View style={{margin:20, alignItems:'center', borderTopRightRadius:10,  }}>

                    
            <ModalListComponent
                text={""}
                required={false}
                type={2}
                tempdata={getStation}
                label={selectedStation==undefined?"Select Station":selectedStation.label}
                onSelect={
                    async (value, underindex) => {
                        
                        gettingStationwiseData(value.stationId, verfication);
                        setSelectedStation(value)
                    
                    }}

            />

            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                
                <Tabsitems
                    text={"Customers"}
                    active={index == 1 ? true : false}
                    onPress={() => { setIndex(1) }}

                />


                <Tabsitems
                    text={"Groups"}
                    active={index == 2 ? true : false}
                    onPress={() => { setIndex(2) }}

                />






            </View>

            {progressVisible && <ActivityIndicator style={{ margin: 20 }} size="large" color={Colors.parrotGreenColor} />}
            {noData && <Nodata></Nodata>}

            <Toast {...toast} onDismiss={() => setToast({ message: "", type: "" })} />
            {index == 1 && <View style={{ flex: 1 }}>
                {customers != undefined && <FlatList
                    data={customers}
                    renderItem={renderItemCustomers}
                    keyExtractor={item => item.id}
                />}

            </View>}

            {index == 2 && <View style={{ flex: 1 }}>
                {groups != undefined && <FlatList
                    data={groups}
                    renderItem={renderItemGroups}
                    keyExtractor={item => item.id}
                />}


            </View>}


        </>

    )
}
export default BmData;