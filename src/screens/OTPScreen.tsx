import React, {useState, useEffect} from 'react';
import {
  SafeAreaView,
  View,
  StyleSheet,
  TouchableOpacity,
  Text,
} from 'react-native';
import {
  CodeField,
  Cursor,
  useBlurOnFulfill,
  useClearByFocusCell,
} from 'react-native-confirmation-code-field';
import Colors from '../theme/Colors';
import {RouteProp} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import oTpSyncUp from '../apis_auth/apis';

interface VerifyCodeProps {
  navigation: StackNavigationProp<any>;
  route: RouteProp<any, {item: any}>;
}
const CELL_COUNT = 6;
const RESEND_OTP_TIME_LIMIT = 90;

const OTPScreen: React.FC<VerifyCodeProps> = ({navigation, route}) => {
  let resendOtpTimerInterval: any;
  const [resendButtonDisabledTime, setResendButtonDisabledTime] = useState(
    RESEND_OTP_TIME_LIMIT,
  );
  const [isFilled, setIsFilled] = useState(false);
  const [value, setValue] = useState('');
  const ref = useBlurOnFulfill({value, cellCount: CELL_COUNT});
  const [props, getCellOnLayoutHandler] = useClearByFocusCell({
    value,
    setValue,
  });


  //to start resend otp option
  const startResendOtpTimer = () => {
    if (resendOtpTimerInterval) {
      clearInterval(resendOtpTimerInterval);
    }
    resendOtpTimerInterval = setInterval(() => {
      if (resendButtonDisabledTime <= 0) {
        clearInterval(resendOtpTimerInterval);
      } else {
        setResendButtonDisabledTime(resendButtonDisabledTime - 1);
      }
    }, 1000);
  };
  
  const onResendOtpButtonPress = () => {
    setValue('');
    setResendButtonDisabledTime(RESEND_OTP_TIME_LIMIT);
    startResendOtpTimer();
    console.log('todo: Resend OTP');
  };

  //start timer on screen on launch
  useEffect(() => {
    startResendOtpTimer();
    return () => {
      if (resendOtpTimerInterval) {
        clearInterval(resendOtpTimerInterval);
      }
    };
  }, [resendButtonDisabledTime]);

  // Check if all cells are filled
  useEffect(() => {
    setIsFilled(value.length === CELL_COUNT);
  }, [value]);
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Verify the Authorisation Code</Text>
        <Text style={styles.subTitle}>
          Sent to: {route?.params?.item?.user_contactNumber}
        </Text>
      </View>
      <View style={styles.codeContainer}>
        <CodeField
          ref={ref}
          {...props}
          value={value}
          onChangeText={setValue}
          cellCount={CELL_COUNT}
          rootStyle={styles.codeFieldRoot}
          keyboardType="number-pad"
          textContentType="oneTimeCode"
          renderCell={({index, symbol, isFocused}) => (
            <View
              onLayout={getCellOnLayoutHandler(index)}
              key={index}
              style={[styles.cellRoot, isFocused && styles.focusCell]}>
              <Text style={styles.cellText}>
                {symbol || (isFocused ? <Cursor /> : null)}
              </Text>
            </View>
          )}
        />
      </View>
      <View style={styles.resendContainer}>
        <TouchableOpacity onPress={onResendOtpButtonPress}>
          <View style={styles.resendBtnContainer}>
            <Text style={styles.resendBtn}> Resend Code</Text>
            {resendButtonDisabledTime > 0 && (
              <Text style={styles.resendTimerText}>
                in {resendButtonDisabledTime} sec
              </Text>
            )}
          </View>
        </TouchableOpacity>
      </View>
      <TouchableOpacity
        style={[
          styles.submitBtn,
          isFilled ? { backgroundColor: '#007AFF' } : { backgroundColor: '#EEEDEB' },
        ]}
        onPress={() => console.log('OTP is', value)}
        disabled={!isFilled}>
        <Text
          style={[
            styles.submitBtnText,
            isFilled ? { color: 'white' } : { color: '#F9F9F9' },
          ]}>
          Submit
        </Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};
      {/* <View style={styles.resendContainer}>
      {resendButtonDisabledTime > 0 ? (
        <Text style={styles.resendText}>
          Resend Code in {resendButtonDisabledTime} sec
        </Text>
      ) : (
        <TouchableOpacity onPress={onResendOtpButtonPress}>
          <View style={styles.resendBtnContainer}>
            <Text style={styles.resendBtn}> Resend Code</Text>
            <Text style={styles.resendTimerText}>
              in {resendButtonDisabledTime} sec
            </Text>
          </View>
        </TouchableOpacity>
      )}
      <TouchableOpacity
        style={[
          styles.submitBtn,
          isFilled
            ? {backgroundColor: '#007AFF'}
            : {backgroundColor: '#EEEDEB'},
        ]}
        onPress={() => console.log('otp is', value)}
        disabled={!isFilled}>
        <Text
          style={[
            styles.submitBtnText,
            isFilled ? {color: 'white'} : {color: '#F9F9F9'},
          ]}>
          Verify
        </Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}; */}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9F9F9',
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    marginBottom: 20,
    alignItems:'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  subTitle: {
    fontSize: 16,
    // marginBottom: 20,
    color: '#666',
  },
  codeContainer: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  codeFieldRoot: {
    justifyContent: 'space-evenly',
  },
  cellRoot: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderBottomColor: '#ccc',
    borderBottomWidth: 1,
    marginHorizontal: 5,
  },
  cellText: {
    fontSize: 24,
    textAlign: 'center',
    color: '#333',
  },
  focusCell: {
    borderBottomColor: '#007AFF',
    borderBottomWidth: 2,
  },
resendContainer:{
  marginBottom: 20,
},
resendBtnContainer: {
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'center',
},
resendBtn: {
  color: '#007AFF',
  fontSize: 16,
  marginRight: 5,
},
resendTimerText: {
  fontSize: 16,
  color: '#666',
},
  resendText: {
    marginBottom: 20,
    fontSize: 16,
    textAlign: 'center',
    color: '#666',
  },
  submitBtn: {
    paddingVertical: 15,
    paddingHorizontal: 50,
    borderRadius: 10,
    // marginTop: 10,
  },
  submitBtnText: {
    fontSize: 18,
    textAlign: 'center',
    fontWeight: 'bold',
  },
});
export default OTPScreen;
