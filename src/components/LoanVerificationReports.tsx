import React, { memo } from 'react'
import { Text, View, SafeAreaView, StyleSheet, ScrollView } from 'react-native'
import { GlobalStyles, Colors } from '../theme'
import { FlatList, TouchableOpacity } from 'react-native-gesture-handler';
import LoanDetails from '../components/LoanDetails'
import { 
    AppStatusBar, 
    HeaderwithoutDialoge, 
    TextView,
} from '../components/';


const LoanVerificationReports = ({report})=>{
    return(
        <ScrollView>
        <View>
        <View style={styles.tableContainer}>
        <View style={styles.rowTwo}>
            <View style={styles.columnOne}>
            <TextView style={styles.columnOneText} text={'Customer Name'} />
            </View>
            <View style={styles.columnTwo}>
            <TextView  style={styles.columnTwoText} text={report.CustomerFullName} />
            </View>
        </View>
        <View style={styles.rowOne}>
            <View style={styles.columnOne}>
            <TextView style={styles.columnOneText} text={'Surname'} />
            </View>
            <View style={styles.columnTwo}>
            <TextView style={styles.columnTwoText} text={report.Surname} />
            </View>
        </View>
        <View style={styles.rowTwo}>
            <View style={styles.columnOne}>
            <TextView style={styles.columnOneText} text={'NIC Number'} />
            </View>
            <View style={styles.columnTwo}>
            <TextView style={styles.columnTwoText} text={report.NICNumber} />
            </View>
        </View>
        <View style={styles.rowOne}>
            <View style={styles.columnOne}>
            <TextView style={styles.columnOneText} text={'Date Of Birth'} />
            </View>
            <View style={styles.columnTwo}>
            <TextView style={styles.columnTwoText} text={report.DateOfBirth} />
            </View>
        </View>
        <View style={styles.rowTwo}>
            <View style={styles.columnOne}>
            <TextView style={styles.columnOneText} text={'Status'} />
            </View>
            <View style={styles.columnTwo}>
            <TextView style={styles.columnTwoText} text={report.Status} />
            </View>
        </View>
        <View style={styles.rowOne}>
            <View style={styles.columnOne}>
            <TextView style={styles.columnOneText} text={'Guardian Name'} />
            </View>
            <View style={styles.columnTwo}>
            <TextView style={styles.columnTwoText} text={report.GuardianName} />
            </View>
        </View>
        <View style={styles.rowTwo}>
            <View style={styles.columnOne}>
            <TextView style={styles.columnOneText} text={'Station Name'} />
            </View>
            <View style={styles.columnTwo}>
            <TextView style={styles.columnTwoText} text={report.StationName} />
            </View>
        </View>
        <View style={styles.rowOne}>
            <View style={styles.columnOne}>
            <TextView style={styles.columnOneText} text={'Family Number'} />
            </View>
            <View style={styles.columnTwo}>
            <TextView style={styles.columnTwoText} text={report.FamilyNumber} />
            </View>
        </View>
        <View style={styles.rowTwo}>
            <View style={styles.columnOne}>
            <TextView style={styles.columnOneText} text={'Region Name'} />
            </View>
            <View style={styles.columnTwo}>
            <TextView style={styles.columnTwoText} text={report.RegionName} />
            </View>
        </View>
        <View style={styles.rowOne}>
            <View style={styles.columnOne}>
            <TextView style={styles.columnOneText} text={'Marital Status'} />
            </View>
            <View style={styles.columnTwo}>
            <TextView style={styles.columnTwoText} text={report.MaritalStatus} />
            </View>
        </View>
        <View style={styles.rowTwo}>
            <View style={styles.columnOne}>
            <TextView style={styles.columnOneText} text={'Religion'} />
            </View>
            <View style={styles.columnTwo}>
            <TextView style={styles.columnTwoText} text={report.Religion} />
            </View>
        </View>
        <View style={styles.rowOne}>
            <View style={styles.columnOne}>
            <TextView style={styles.columnOneText} text={'Education'} />
            </View>
            <View style={styles.columnTwo}>
            <TextView style={styles.columnTwoText} text={report.Education} />
            </View>
        </View>
        <View style={styles.rowTwo}>
            <View style={styles.columnOne}>
            <TextView style={styles.columnOneText} text={'House Status'} />
            </View>
            <View style={styles.columnTwo}>
            <TextView style={styles.columnTwoText} text={report.HouseStatus} />
            </View>
        </View>
        <View style={styles.rowOne}>
            <View style={styles.columnOne}>
            <TextView style={styles.columnOneText} text={'House Type'} />
            </View>
            <View style={styles.columnTwo}>
            <TextView style={styles.columnTwoText} text={report.HouseType} />
            </View>
        </View>
        <View style={styles.rowTwo}>
            <View style={styles.columnOne}>
            <TextView style={styles.columnOneText} text={'Education Details'} />
            </View>
            <View style={styles.columnTwo}>
            <TextView style={styles.columnTwoText} text={report.EducationDetails} />
            </View>
        </View>
        <View style={styles.rowOne}>
            <View style={styles.columnOne}>
            <TextView style={styles.columnOneText} text={'Number Of Children'} />
            </View>
            <View style={styles.columnTwo}>
            <TextView style={styles.columnTwoText} text={report.NumberOfChildren} />
            </View>
        </View>
        <View style={styles.rowTwo}>
            <View style={styles.columnOne}>
            <TextView style={styles.columnOneText} text={'Number Of School Going Children'} />
            </View>
            <View style={styles.columnTwo}>
            <TextView style={styles.columnTwoText} text={report.NumberOfSchoolGoingChildren} />
            </View>
        </View>
        <View style={styles.rowOne}>
            <View style={styles.columnOne}>
            <TextView style={styles.columnOneText} text={'Address Permanent Address'} />
            </View>
            <View style={styles.columnTwo}>
            <TextView style={styles.columnTwoText} text={report.Address_Permanent_Address} />
            </View>
        </View>
        <View style={styles.rowTwo}>
            <View style={styles.columnOne}>
            <TextView style={styles.columnOneText} text={'Address Permanent City'} />
            </View>
            <View style={styles.columnTwo}>
            <TextView style={styles.columnTwoText} text={report.Address_Permanent_City} />
            </View>
        </View>
        <View style={styles.rowOne}>
            <View style={styles.columnOne}>
            <TextView style={styles.columnOneText} text={'Address Permanent State'} />
            </View>
            <View style={styles.columnTwo}>
            <TextView style={styles.columnTwoText} text={report.Address_Permanent_State} />
            </View>
        </View>
        <View style={styles.rowTwo}>
            <View style={styles.columnOne}>
            <TextView style={styles.columnOneText} text={'Address Permanent ZipCode'} />
            </View>
            <View style={styles.columnTwo}>
            <TextView style={styles.columnTwoText} text={report.Address_Permanent_ZipCode} />
            </View>
        </View>
        <View style={styles.rowOne}>
            <View style={styles.columnOne}>
            <TextView style={styles.columnOneText} text={'Address Present Country'} />
            </View>
            <View style={styles.columnTwo}>
            <TextView style={styles.columnTwoText} text={report.Address_Present_Country} />
            </View>
        </View>
        <View style={styles.rowTwo}>
            <View style={styles.columnOne}>
            <TextView style={styles.columnOneText} text={'Address Present Number Of Years'} />
            </View>
            <View style={styles.columnTwo}>
            <TextView style={styles.columnTwoText} text={report.Address_Present_NumberOfYears} />
            </View>
        </View>
        <View style={styles.rowOne}>
            <View style={styles.columnOne}>
            <TextView style={styles.columnOneText} text={'Phone Number'} />
            </View>
            <View style={styles.columnTwo}>
            <TextView style={styles.columnTwoText} text={report.PhoneNumber} />
            </View>
        </View>
        <View style={styles.rowTwo}>
            <View style={styles.columnOne}>
            <TextView style={styles.columnOneText} text={'Mobile Number'} />
            </View>
            <View style={styles.columnTwo}>
            <TextView style={styles.columnTwoText} text={report.MobileNumber} />
            </View>
        </View>
        <View style={styles.rowOne}>
            <View style={styles.columnOne}>
            <TextView style={styles.columnOneText} text={'Email Address'} />
            </View>
            <View style={styles.columnTwo}>
            <TextView style={styles.columnTwoText} text={report.EmailAddress} />
            </View>
        </View>
        <View style={styles.rowTwo}>
            <View style={styles.columnOne}>
            <TextView style={styles.columnOneText} text={'Notes'} />
            </View>
            <View style={styles.columnTwo}>
            <TextView style={styles.columnTwoText} text={report.Notes} />
            </View>
        </View>
        <View style={styles.rowOne}>
            <View style={styles.columnOne}>
            <TextView style={styles.columnOneText} text={'Customer Added DateTime'} />
            </View>
            <View style={styles.columnTwo}>
            <TextView style={styles.columnTwoText} text={report.CustomerAddedDateTime} />
            </View>
        </View>
        <View>
            <View >
                
            <TextView type={'mini_heading22'}style={{fontSize: 20,color:'#7d7d7d',}} text={'Loan Details'} />
            </View>
          
        </View>
        <SafeAreaView style={{ flex: 1, backgroundColor: '#fff', padding: 10 }}>
        <FlatList
                    data={report.LoanDetails}
                    renderItem={({ item }) => (
                        <LoanDetails item={item} />
                    )}
                    keyExtractor={item => item.SrNo}
                />
            </SafeAreaView> 
      
      
    </View>
   <View style={{flexDirection:'row',alignItems:'center'}}>
       <TriangleDown/>
       <TriangleDown/>
       <TriangleDown/>
       <TriangleDown/>
       <TriangleDown/>
       <TriangleDown/>
       <TriangleDown/>
       <TriangleDown/>
       <TriangleDown/>
       <TriangleDown/>
       <TriangleDown/>
       <TriangleDown/>
       <TriangleDown/>
       <TriangleDown/>
       <TriangleDown/>
       <TriangleDown/>
       <TriangleDown/>
       <TriangleDown/>
       <TriangleDown/>
       <TriangleDown/>
       <TriangleDown/>
       <TriangleDown/>


   </View>
    </View>
    </ScrollView>
    )
}
const Triangle = ({style}) => {
    return <View style={[styles.triangle,style]} />;
  };
  const TriangleDown = () => {
    return <Triangle style={styles.triangleDown} />;
  };
const styles = StyleSheet.create({
    triangle: {
        width: 0,
        height: 0,
        backgroundColor: "transparent",
        borderStyle: "solid",
        borderLeftWidth: 20,
        borderRightWidth: 20,
        borderBottomWidth: 20,//elevation:10,
        borderLeftColor: "transparent",
        borderRightColor: "transparent",
        borderBottomColor: "#f1f1f1",
      },
      triangleDown: {
        transform: [{ rotate: "180deg" }],
      },
    tableContainer:{
        marginTop:30,
        borderWidth:1,
        backgroundColor:'#FFF',
        borderColor:"#cdcdcd",
        borderRadius:5
    },
    rowOne:{
        flexDirection:'row',
        //borderBottomColor:'#cdcdcd',borderBottomWidth:1
        
    },
    rowTwo:{
        flexDirection:'row',
        //borderBottomColor:'#cdcdcd',borderBottomWidth:1,
        backgroundColor:'#f1f1f1'
    },
    columnOne:{
        padding:10,
        flex:1,

        //borderRightWidth:1,borderRightColor:'#cdcdcd',
        alignItems:'flex-start'
    },
    columnOneText:{
        fontSize:12,color:'#7d7d7d',
        fontWeight:'bold',
    },
    columnOneText2:{
        fontSize:25,color:'#000000',
        fontWeight:'bold',
        position:'relative',
        justifyContent:'center',
        alignItems:'center'
    },
    columnTwo:{
        flex:1,
        alignItems:'flex-start',
        padding:10
    },
    columnTwoText:{
        fontSize:12
    }
})

export default memo(LoanVerificationReports)