import React, { memo } from 'react'
import { Text, View, SafeAreaView, StyleSheet, ScrollView } from 'react-native'
import { GlobalStyles, Colors } from '../theme'
import { FlatList, TouchableOpacity } from 'react-native-gesture-handler';
import QuestionAnswerscore from '../components/QuestionAnswerscore'
import CrediteScoreLoanDetail from '../components/CrediteScoreLoanDetail'
import { 
    AppStatusBar, 
    HeaderwithoutDialoge, 
    TextView,
} from '../components/';


const CreditScoringReports = ({report})=>{
    console.log('data={report.QuestionAnswerscore}'+JSON.stringify(report))
    return(
        <ScrollView>
        <View>
        <View style={styles.tableContainer}>
        <View style={styles.rowTwo}>
            <View style={styles.columnOne}>
            <TextView style={styles.columnOneText} text={'Customer Name'} />
            </View>
            <View style={styles.columnTwo}>
            <TextView  style={styles.columnTwoText} text={report.FirstName} />
            </View>
        </View>
        <View style={styles.rowOne}>
            <View style={styles.columnOne}>
            <TextView style={styles.columnOneText} text={'Nic Number'} />
            </View>
            <View style={styles.columnTwo}>
            <TextView style={styles.columnTwoText} text={report.NicNumber} />
            </View>
        </View>
        <View style={styles.rowTwo}>
            <View style={styles.columnOne}>
            <TextView style={styles.columnOneText} text={'All Score'} />
            </View>
            <View style={styles.columnTwo}>
            <TextView  style={styles.columnTwoText} text={report.allScore} />
            </View>
        </View>
        <View style={styles.rowTwo}>
            <View style={styles.columnOne}>
            <TextView style={styles.columnOneText} text={'Notes'} />
            </View>
            <View style={styles.columnTwo}>
            <TextView  style={styles.columnTwoText} text={report.Notes} />
            </View>
        </View>
        <View style={styles.rowOne}>
            <View style={styles.columnOne}>
            <TextView style={styles.columnOneText} text={'Current Loan Status'} />
            </View>
            <View style={styles.columnTwo}>
            <TextView style={styles.columnTwoText} text={report.CurrentLoanStatus} />
            </View>
        </View>
        <View style={styles.rowTwo}>
            <View style={styles.columnOne}>
            <TextView style={styles.columnOneText} text={'Address'} />
            </View>
            <View style={styles.columnTwo}>
            <TextView  style={styles.columnTwoText} text={report.address} />
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
                        <CrediteScoreLoanDetail item={item} />
                    )}
                    keyExtractor={item => item.SrNo}
                />
            </SafeAreaView> 
    {/* **************************************Question Answer Score'**************************************************** */}
        <View>
            <View >  
            <TextView type={'mini_heading22'}style={{fontSize: 20,color:'#7d7d7d',}} text={'Question Answer Score'} />
            </View>
        </View>
        <SafeAreaView style={{ flex: 1, backgroundColor: '#fff', padding: 10 }}>
        <FlatList
                    data={report.QuestionAnswerscore}
                    renderItem={({ item }) => (
                        <QuestionAnswerscore item={item} />
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

export default memo(CreditScoringReports)