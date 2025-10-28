import React, { memo } from 'react'
import { Text, View, SafeAreaView, StyleSheet, ScrollView } from 'react-native'
import { GlobalStyles, Colors } from '../theme'
import { 
    AppStatusBar, 
    HeaderwithoutDialoge, 
    TextView,
} from '../components';



const ReportTableComponent = ({item})=>{
    return(
        <View>
        <View style={styles.tableContainer}>
        <View style={styles.rowOne}>
            <View style={styles.columnOne}>
                <TextView style={styles.columnOneText} text={'Serial Number'} />
            </View>
            <View style={styles.columnTwo}>
                <TextView style={styles.columnTwoText} text={item.SrNo} />
            </View>
        </View>
        <View style={styles.rowTwo}>
            <View style={styles.columnOne}>
            <TextView style={styles.columnOneText} text={'Loan Id'} />
            </View>
            <View style={styles.columnTwo}>
            <TextView  style={styles.columnTwoText} text={item.LoanId} />
            </View>
        </View>
        <View style={styles.rowOne}>
            <View style={styles.columnOne}>
            <TextView style={styles.columnOneText} text={'Staff Name'} />
            </View>
            <View style={styles.columnTwo}>
            <TextView style={styles.columnTwoText} text={item.StaffName} />
            </View>
        </View>
        <View style={styles.rowTwo}>
            <View style={styles.columnOne}>
            <TextView style={styles.columnOneText} text={'Gender'} />
            </View>
            <View style={styles.columnTwo}>
            <TextView style={styles.columnTwoText} text={item.Gender} />
            </View>
        </View>
        <View style={styles.rowOne}>
            <View style={styles.columnOne}>
            <TextView style={styles.columnOneText} text={'Disbursement Date'} />
            </View>
            <View style={styles.columnTwo}>
            <TextView style={styles.columnTwoText} text={item.DisbursementDate} />
            </View>
        </View>
        <View style={styles.rowTwo}>
            <View style={styles.columnOne}>
            <TextView style={styles.columnOneText} text={'Recovery Date'} />
            </View>
            <View style={styles.columnTwo}>
            <TextView style={styles.columnTwoText} text={item.RecoveryDate} />
            </View>
        </View>
        <View style={styles.rowOne}>
            <View style={styles.columnOne}>
            <TextView style={styles.columnOneText} text={'Name of Borrower'} />
            </View>
            <View style={styles.columnTwo}>
            <TextView style={styles.columnTwoText} text={item.NameOfBorrower} />
            </View>
        </View>
        <View style={styles.rowTwo}>
            <View style={styles.columnOne}>
            <TextView style={styles.columnOneText} text={'Guardian Name'} />
            </View>
            <View style={styles.columnTwo}>
            <TextView style={styles.columnTwoText} text={item.GuardianName} />
            </View>
        </View>
        <View style={styles.rowOne}>
            <View style={styles.columnOne}>
            <TextView style={styles.columnOneText} text={'CNIC Number'} />
            </View>
            <View style={styles.columnTwo}>
            <TextView style={styles.columnTwoText} text={item.NICNumber} />
            </View>
        </View>
        <View style={styles.rowTwo}>
            <View style={styles.columnOne}>
            <TextView style={styles.columnOneText} text={'Region Name'} />
            </View>
            <View style={styles.columnTwo}>
            <TextView style={styles.columnTwoText} text={item.RegionName} />
            </View>
        </View>
        <View style={styles.rowOne}>
            <View style={styles.columnOne}>
            <TextView style={styles.columnOneText} text={'Loan Amount Principal'} />
            </View>
            <View style={styles.columnTwo}>
            <TextView style={styles.columnTwoText} text={item.LoanAmountPrincipal} />
            </View>
        </View>
        <View style={styles.rowTwo}>
            <View style={styles.columnOne}>
            <TextView style={styles.columnOneText} text={'Interest Rate'} />
            </View>
            <View style={styles.columnTwo}>
            <TextView style={styles.columnTwoText} text={item.InterestRate} />
            </View>
        </View>
        <View style={styles.rowOne}>
            <View style={styles.columnOne}>
            <TextView style={styles.columnOneText} text={'Loan Term'} />
            </View>
            <View style={styles.columnTwo}>
            <TextView style={styles.columnTwoText} text={item.LoanTerm} />
            </View>
        </View>
        <View style={styles.rowTwo}>
            <View style={styles.columnOne}>
            <TextView style={styles.columnOneText} text={'Total Loan Amount'} />
            </View>
            <View style={styles.columnTwo}>
            <TextView style={styles.columnTwoText} text={item.TotalLoanAmount} />
            </View>
        </View>
        <View style={styles.rowOne}>
            <View style={styles.columnOne}>
            <TextView style={styles.columnOneText} text={'Total Recovered Amount'} />
            </View>
            <View style={styles.columnTwo}>
            <TextView style={styles.columnTwoText} text={item.TotalRecoveredAmount} />
            </View>
        </View>
        <View style={styles.rowTwo}>
            <View style={styles.columnOne}>
            <TextView style={styles.columnOneText} text={'Balance'} />
            </View>
            <View style={styles.columnTwo}>
            <TextView style={styles.columnTwoText} text={item.Balance} />
            </View>
        </View>
        <View style={styles.rowOne}>
            <View style={styles.columnOne}>
            <TextView style={styles.columnOneText} text={'Last Payment Date'} />
            </View>
            <View style={styles.columnTwo}>
            <TextView style={styles.columnTwoText} text={item.LastPaymentDate} />
            </View>
        </View>
        <View style={styles.rowTwo}>
            <View style={styles.columnOne}>
            <TextView style={styles.columnOneText} text={'Due Installment'} />
            </View>
            <View style={styles.columnTwo}>
            <TextView style={styles.columnTwoText} text={item.DueInstallment} />
            </View>
        </View>
        <View style={styles.rowOne}>
            <View style={styles.columnOne}>
            <TextView style={styles.columnOneText} text={'Over Dues'} />
            </View>
            <View style={styles.columnTwo}>
            <TextView style={styles.columnTwoText} text={item.OverDues} />
            </View>
        </View>
        <View style={styles.rowTwo}>
            <View style={styles.columnOne}>
            <TextView style={styles.columnOneText} text={'Total Dues'} />
            </View>
            <View style={styles.columnTwo}>
            <TextView style={styles.columnTwoText} text={item.TotalDues} />
            </View>
        </View>
        <View style={styles.rowOne}>
            <View style={styles.columnOne}>
            <TextView style={styles.columnOneText} text={'Pre Payment'} />
            </View>
            <View style={styles.columnTwo}>
            <TextView style={styles.columnTwoText} text={item.PrePayment} />
            </View>
        </View>
        <View style={styles.rowTwo}>
            <View style={styles.columnOne}>
            <TextView style={styles.columnOneText} text={'Receipt No'} />
            </View>
            <View style={styles.columnTwo}>
            <TextView style={styles.columnTwoText} text={item.ReceiptNo} />
            </View>
        </View>
        <View style={styles.rowOne}>
            <View style={styles.columnOne}>
            <TextView style={styles.columnOneText} text={'Amount Recovered'} />
            </View>
            <View style={styles.columnTwo}>
            <TextView style={styles.columnTwoText} text={item.AmountRecovered} />
            </View>
        </View>
        <View style={styles.rowTwo}>
            <View style={styles.columnOne}>
            <TextView style={styles.columnOneText} text={'Remaining Dues'} />
            </View>
            <View style={styles.columnTwo}>
            <TextView style={styles.columnTwoText} text={item.RemainingDues} />
            </View>
        </View>
        <View style={styles.rowOne}>
            <View style={styles.columnOne}>
            <TextView style={styles.columnOneText} text={'Date'} />
            </View>
            <View style={styles.columnTwo}>
            <TextView style={styles.columnTwoText} text={item.Date} />
            </View>
        </View>
        <View style={styles.rowTwo}>
            <View style={styles.columnOne}>
            <TextView style={styles.columnOneText} text={'Contact Number'} />
            </View>
            <View style={styles.columnTwo}>
            <TextView style={styles.columnTwoText} text={item.ContactNumber} />
            </View>
        </View>
        <View style={{flexDirection:'row',borderBottomColor:'#cdcdcd'}}>
            <View style={styles.columnOne}>
            <TextView style={styles.columnOneText} text={'Loan Status'} />
            </View>
            <View style={styles.columnTwo}>
            <TextView style={styles.columnTwoText}  text={item.LoanStatus} />
           
            </View>
        </View>
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
    columnTwo:{
        flex:1,
        alignItems:'flex-start',
        padding:10
    },
    columnTwoText:{
        fontSize:12
    }
})

export default memo(ReportTableComponent)