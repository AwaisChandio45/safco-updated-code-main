import React, {useEffect, useState} from 'react';
import {View, Text, SafeAreaView, StyleSheet, ScrollView} from 'react-native';
import {AppStatusBar, HeaderwithoutDialoge} from '../components';
import {getPaySlip} from '../apis_auth/apis';
import {useSelector} from 'react-redux';
import {Colors} from '../theme';
import {FONTS} from '../theme/Fonts';

export default function SalaryPaySlip() {
  // console.log('redux', useSelector);
  const [paySlipData, setPaySlipData] = useState('');
  console.log('log2', paySlipData);
  const getUserData = useSelector(state => state.UserData);
  const [EmployeeId, setEmployeeId] = useState(getUserData?.UserData?.HrId);
  console.log('HRID', getUserData?.UserData?.HrId);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPaySlipData = async () => {
      try {
        const response = await getPaySlip(EmployeeId);
        console.log('Response:', response);
        if (response && response.organization_salary_payslips) {
          const payslips = response.organization_salary_payslips;
          if (payslips.length > 0) {
            setPaySlipData(payslips[0]);
          } else {
            throw new Error('No payslips found for the employee');
          }
        } else {
          throw new Error('Invalid response format');
        }
      } catch (error) {
        console.error('Error fetching pay slip data:', error.message);
        setError('Error fetching pay slip data:' + error.message);
      }
    };
    if (EmployeeId) {
      fetchPaySlipData();
    }
    // Fetch data when component mounts or when EmployeeId changes
  }, [EmployeeId]);
  const renderPaySlipDetails = () => {
    if (!paySlipData)
      return (
        <View style={{alignItems: 'center', justifyContent: 'center'}}>
          <Text style={{textAlign: 'center', color: 'red'}}>
            NO PAY SLIP DATA AVAILABLE
          </Text>
        </View>
      );

    return (
      <>
        <View style={{left: -35, top: -25}}>
          <HeaderwithoutDialoge Theme={Colors} back={true} />
        </View>
        <View style={styles.detailContainer}>
          <Text
            style={
              styles.headingText
            }>{`Pay Slip of ${paySlipData.PaySlipOF}`}</Text>
          <View style={styles.row}>
            <Text style={styles.label}>Employee Name:</Text>
            <Text style={styles.value}>{paySlipData.EmployeeName}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Username:</Text>
            <Text style={styles.value}>{paySlipData.UserName}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Department:</Text>
            <Text style={styles.value}>{paySlipData.Department}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Designation:</Text>
            <Text style={styles.value}>{paySlipData.Designation}</Text>
          </View>
          <Text style={[styles.headingText, {marginTop: 15}]}>
            Salary Details
          </Text>
          <View style={styles.row}>
            <Text style={styles.label}>Basic Salary:</Text>
            <Text style={styles.value}>{paySlipData.BasicSalary}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Conveyance:</Text>
            <Text style={styles.value}>{paySlipData.Conveyance}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Utility Allowance:</Text>
            <Text style={styles.value}>{paySlipData.UtilityAllowance}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>House Rent:</Text>
            <Text style={styles.value}>{paySlipData.HouseRent}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>{paySlipData.LoanTitle}:</Text>
            <Text style={styles.value}>{paySlipData.LoanAmount}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Office Location:</Text>
            <Text style={styles.value}>{paySlipData.OfficeLocation}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Provident Fund:</Text>
            <Text style={styles.value}>{paySlipData.ProvidentFund}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>EOBI:</Text>
            <Text style={styles.value}>{paySlipData.EOBI}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Group Insurance:</Text>
            <Text style={styles.value}>{paySlipData.GroupInsaurance}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Health Insurance:</Text>
            <Text style={styles.value}>{paySlipData.HealthInsurance}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Tax Deductions:</Text>
            <Text style={styles.value}>{paySlipData.TaxDiduction}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Total Earnings:</Text>
            <Text style={styles.value}>{paySlipData.NetPayable}</Text>
          </View>
        </View>
      </>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <AppStatusBar />
      <ScrollView style={styles.contentContainer}>
        {renderPaySlipDetails()}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light_gray,
  },
  contentContainer: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  headingText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.black,
    fontFamily: FONTS.FONT_BOLD,
    textAlign: 'left',
    marginBottom: 10,
  },
  detailContainer: {
    backgroundColor: Colors.white,
    paddingHorizontal: 20,
    paddingVertical: 20,
    borderRadius: 10,
    marginBottom: 20,
    shadowColor: '#000',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 5,
  },
  label: {
    flex: 1,
    fontWeight: 'bold',
    color: Colors.black,
    fontSize: 16,
  },
  value: {
    flex: 1,
    color: Colors.black,
    fontSize: 16,
    marginLeft: 10,
  },
  line: {
    borderBottomWidth: 1,
    borderBottomColor: Colors.light_dark_gray,
    marginBottom: 10,
  },
});
