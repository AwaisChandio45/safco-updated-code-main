import React from 'react';
import {
  SafeAreaView,
  Text,
  View,
  StyleSheet,
  Image,
  Pressable,
  Dimensions,
  Alert
}
  from 'react-native';
const { FingerModule } = NativeModules;
import { NativeModules } from 'react-native';

import { ScrollView } from 'react-native-gesture-handler';
import { AppStatusBar, CustomProgressDialoge } from '../../components';
import { HeaderwithoutDialoge } from '../../components';
import { TextView } from '../../components';
import { Colors, GlobalStyles } from '../../theme';
import { connect, useSelector } from 'react-redux';
import RadioButton from '../../components/RadioButton';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { useDispatch } from "react-redux";
import { getCurrentLocation } from '../../utilis/Locationgetter';
import { Checkbox } from 'react-native-paper';
const HalafNama = ({ navigation, route }) => {

  const {item, user_cnic} = route.params

  const dispatch = useDispatch();

  const answerArray = useSelector(state => state.CustomerAnsReducer.answerArray);
  // console.log('answerArray from Redux:', answerArray);

  const [allDataobj, setAlldataobj] = React.useState(answerArray);

  const [isLoading, setLoading] = React.useState(false);
  // console.log("E Verisys yes/no ----->", allDataobj && allDataobj.answerArray ? allDataobj.answerArray[19]?.checkedone : "No answerArray[19]");

// console.log("E Verisys yes no ----->",allDataobj.answerArray[19].checkedone)
  const addStateData = () => {

    dispatch({ type: 'ANSWERARRAY', payload: allDataobj, })
    

    navigation.replace('AddForm', { fingerPrint:allDataobj.fingerPrint, item:item, user_cnic:user_cnic } )
 
  }

  const checkForPermentAddress = () => {
    setCheckedAddress(!checkedforAddress);
    if (!checkedforAddress) {
      let get = allDataobj;
      get.customerInfo[array_index].customer_per_country.value =
      
      setAlldataobj({ ...get });
    } else {
      let get = allDataobj;
      get.customerInfo[array_index].customer_per_country.value = '';
    
      setAlldataobj({ ...get });
    }
  };


  const handleLocation = () => {
    let get = allDataobj;

    if (allDataobj.answerArray[19]?.checkedone === 0 || allDataobj.answerArray[19]?.checkedone === 1) {
      return Alert.alert("Kindly Agree on Nadra E Verisys consent form to proceed");
    }
    
// for fingerprint code
    if(get.fingerPrint==undefined){
    return Alert.alert("Stop!",'Please take FingerPrint');
    }


    
    setLoading(true);

    getCurrentLocation(async (position, mocked) => {
      if (position) {
        var lat = position.coords.latitude;
        var lon = position.coords.longitude;
        var loc = lat + "," + lon;
        console.log(loc);
        
        dispatch({ type: 'UserLocation', payload: loc, })
        addStateData()

      } else {
        setLoading(false);
        Alert.alert(
          'Sorry!',
          'Could not get your location, you cannot proceed',
        );

      }
      //   alert(JSON.stringify(position.coords.latitude))
    });
  };

  // **********************************************************************
  ////////// FNINGER PRINT WORK         START
  // **********************************************************************
  const _fingerPrint = async () => {

    try {

      const eventId = await FingerModule.showToast();

      var parser = JSON.parse(eventId);

      //console.log(`Created a new event with id ${eventId}`);
      // var data = await RNFS.readFile(eventId, 'base64')
      // var temp=`data:image/gif;base64,${encodedBase64}`
      //-----------
      //   setFingerImage(parser.imageValue);

      let get = allDataobj;

      get.fingerPrint = parser;

      setAlldataobj({ ...get });
      //---------------
      // setTemp(parser.imageTemp)
    } catch (e) {
      // console.error(e);
    }
  };
  const _resetDevices = async () => {

    await FingerModule.resetDevice();
  };

  // **********************************************************************
  ////////// FNINGER PRINT WORK         END
  // **********************************************************************

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#FFF' }}>

      <AppStatusBar></AppStatusBar>

      <View style={GlobalStyles.row}>

        <HeaderwithoutDialoge Theme={Colors} back={true}></HeaderwithoutDialoge>

        <TextView

          type={'mini_heading22'}

          style={{ paddingHorizontal: 30, marginTop: 55, fontSize: 18 }}

          text="رخواست گذارجو حلفیہ اقرار نامو"></TextView>
      </View>

      <ScrollView style={{}}>

        <View style={{ padding: 10 }}>

          {/* ///////////////////////////////////////////////// */}
          {/* ////////////////////TOP HEADING////////////////// */}
          {/* ///////////////////////////////////////////// */}
          <View style={{ padding: 20, }}>
            <Text style={{ marginTop: 10 }}>1. آئون حلفیہ ان گالھ جو اقرار کریان توائي ته آئون پنهنجي سچي معلومات صحیح و درست فراهمر كندس. جيكهن كا بہ معلومات غلط ثابت تي ته سافكو منهنجي درخواست رد نامنظور کرن جو اختیار رکي تو
            </Text>
            <Text style={{ marginTop: 10 }}>2. آئون ان گالھ جو اقرار کریان تو ته منهنجي ذاتي و كاروباري حوالي سان جيكهن سافكو كنهن پئي مالياتي یا
              غیر مالياتي بونر Regulator یا كنهن پئي اداري کي كا بہ معلومات دئي يا وئي ته ان لاء مون کي اداري سان اعتراض یا شکایت نہ
              هوندي</Text>
            <Text style={{ marginTop: 10 }}>3. آئون ان گالھ جو يقين دیاریان ثو ته آئون سافكو كان حاصل كيل رقر كنهن به ممنوع سرگرمي، منی لانڈرنگ، تیریر ست فنانسنگ بر
              استعمال ن كندس و نه ئي اهي كنهن سرگرمي بر پان ملوث تیندس، ا
            </Text>
            <Text style={{ marginTop: 10 }}>4. مونکي سافكو جي
              Social & Environmental Management System جي پاليسي جي باري بر آگاهي فراهر كئي وئي آهي، آئون ماحولياتي ؟ معاشرتي بندوبست جي بنيادي نقطن جي پاسداري كندي كنهن به اهري ممنوع سرگرمي بر مبتلا نہ نیندس جيكا ماحولیات لاء نقصانده
              هجي.</Text>
          </View>

          {/* ///////////////////////////////////////////////// */}
          {/* ////////////////////TOP HEADER TITLE////////////////// */}
          {/* ///////////////////////////////////////////// */}

          <View style={{ flexDirection: 'row', borderWidth: 1 }}>
            <View style={{ flex: 1, padding: 5, flexDirection: 'column', justifyContent: 'center' }}>
              <TextView
                type={'mini_heading22'}
                style={{ fontSize: 15 }}
                text="نه">
              </TextView>
            </View>
            <View style={{ flex: 1, borderLeftWidth: 1, padding: 5, flexDirection: 'column', justifyContent: 'center' }}>
              <TextView
                type={'mini_heading22'}
                style={{ fontSize: 15 }}
                text="ها">
              </TextView></View>
            <View style={{ flex: 9, borderLeftWidth: 1, flexDirection: 'column', justifyContent: 'center' }}>
              <TextView
                type={'mini_heading22'}
                style={{ fontSize: 15 }}
                text="چند جان وارا سوال">
              </TextView>
            </View>
            <View style={{ flex: 1, borderLeftWidth: 1, padding: 5 }}>
              <TextView
                type={'mini_heading22'}
                style={{ fontSize: 15 }}
                text="سیریل نمبر">
              </TextView>
            </View>
          </View>

          {/* ///////////////////////////////////////////////// */}
          {/* ////////////////////HALF NAMAAAA START////////////////// */}
          {/* ///////////////////////////////////////////// */}
          {allDataobj.answerArray.map((item, index) => {
            return (
              <View style={styles.questionCont} key={index}>
                <View style={styles.questionBoxOne}>
                  <RadioButton
                    onPress={() => {
                      let get = allDataobj;
                      get.answerArray[index].checkedone = true
                      get.answerArray[index].checkedtwo = false
                      get.answerArray[index].value = 0//no
                      setAlldataobj({ ...get })
                      ////console.log('----?',get)

                    }}
                    selected={item.checkedone}
                  // key={item.id}
                  >
                  </RadioButton>

                </View>

                <View style={styles.questionBoxTwo}>
                  <RadioButton
                    onPress={() => {
                      let get = allDataobj;
                      get.answerArray[index].checkedone = false
                      get.answerArray[index].checkedtwo = true
                      get.answerArray[index].value = 1//yes
                      setAlldataobj({ ...get })
                    }}
                    selected={item.checkedtwo}

                  // key={item.id}
                  >
                  </RadioButton>

                </View>
                <View style={styles.questionBoxThree}>
                  <TextView
                    type={'mini_heading22'}
                    style={{ fontSize: 15 }}
                    text={item.question}>
                  </TextView>
                </View>
                <View style={styles.questionBoxFour}>
                  <TextView
                    type={'mini_heading22'}
                    style={{ fontSize: 15 }}
                    text={index + 1}>
                  </TextView>
                </View>
              </View>
            )
          })}
          {/* ///////////////////////////////////////////////// */}
          {/* ////////////////////FINGER PRINT HEADING////////////////// */}
          {/* ///////////////////////////////////////////// */}
          {/* <View style={styles.questionCont} >
          <View style={styles.questionBoxOne}>
          <View
                      style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        marginTop: 10,
                        marginBottom: 10,
                        marginLeft: 10,
                      }}>
                      <Checkbox
                        color={Colors.parrotGreenColor}
                        // status={isSelected ? 'checked' : 'unchecked'}
                        onPress={checkForPermentAddress}
                      />
                          
                  <Text style={{flex: 1, padding: 2.5, flexDirection: 'column', justifyContent: 'center' ,fontWeight:'bold'}}>
                  ڇا توهان کي اعتراض آهي ته اسان توهان جي قرض جي عمل لاءِ توهان جي نادرا جي اي-ويرسيس(E verisys) ڪريون؟
                  </Text>
              
                    </View>
                    
          </View></View> */}
          <View style={{ marginTop: 10, padding: 20 }}>
            <View>
              <Text style={{ fontSize: 15, textAlign: 'center' }}>
                مئي جاثايل سوال مون کان پهن کانپوء پر كيا ويا آهن آئون اقرار کریان ثو تر مني چاٹائل كنهن بر ممنوع سرگرمي بر ملوث نه آهيان و ني  وري قرض جي رقر كنهن به اهر ص ممنوع سرگرمي بر استعمال نه کندس
              </Text>
            </View>
            {/* ///////////////////////////////////////////////// */}
            {/* ////////////////////GET FINGER PRINT////////////////// */}
            {/* ///////////////////////////////////////////// */}

            <View style={{ flexDirection: 'row', justifyContent: 'center', margin: 10 }}>
              {/* <MaterialCommunityIcons
        name="fingerprint"
        size={100}/> */}
              {allDataobj.fingerPrint ==
                undefined ? (
                <MaterialCommunityIcons
                  style={{ alignSelf: 'center' }}
                  name="fingerprint"
                  size={100}></MaterialCommunityIcons>
              ) : (
                <Image
                  style={{
                    height: 150,
                    width: 150,
                    resizeMode: 'cover',
                    alignSelf: 'center',
                  }}
                  source={{
                    uri: `data:image/gif;base64,${allDataobj.fingerPrint.imageValue}`,
                  }}></Image>
              )}
            </View>
            <View style={{ flexDirection: 'row', justifyContent: 'center', marginTop: 10 }}>
              <Text>
                درخواست گذار جي صحيح آنگوئي جو نشان
              </Text>
            </View>
          </View>
          {/* ///////////////////////////////////////////////// */}
          {/* ////////////////////BOTTOM BUTTONS////////////////// */}
          {/* ///////////////////////////////////////////// */}
          <View style={{ flexDirection: 'row', marginTop: 20, height: 50 }}>
            <Pressable
              onPressIn={_fingerPrint}

              style={styles.captureBtn}>
              <TextView
                type={'mini_heading22'}
                style={{ fontSize: 13, color: Colors.white }}
                text="Capture">
              </TextView>
            </Pressable>
            <Pressable
              onPressIn={_resetDevices}
              style={styles.retryBtn}>
              <TextView
                type={'mini_heading22'}
                style={{ fontSize: 13, color: Colors.white }}
                text="Retry">
              </TextView>
            </Pressable>
            <Pressable
              onPress={() => handleLocation()}
              style={styles.agreeBtn}>
              <TextView
                type={'mini_heading22'}
                style={{ fontSize: 13, color: Colors.white }}
                text="I Agree">
              </TextView>
            </Pressable>
          </View>

        </View>
      </ScrollView>
      <CustomProgressDialoge
        dialogVisible={isLoading}
        setDialogVisible={setLoading}
        title={"Getting Location..."}
      />
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  questionCont: {
    flexDirection: 'row',
    borderWidth: 1,
    marginTop: 5
  },
  questionBoxOne: { flex: 1 },
  questionBoxTwo: { flex: 1, borderLeftWidth: 1 },
  questionBoxThree: { flex: 7, textAlign: 'justify', borderLeftWidth: 1 },
  questionBoxFour: { flex: 1, borderLeftWidth: 1 },
  captureBtn: {
    flex: 1,
    backgroundColor: Colors.kulfa,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
    borderRightWidth: 1,
    borderColor: 'white',
    elevation: 10,
    margin: 3
  },
  retryBtn: {
    flex: 1,
    backgroundColor: Colors.kulfa,
    flexDirection: 'column',
    justifyContent: 'center',
    borderRadius: 5,
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderColor: 'white',
    margin: 3,
    elevation: 10
  },
  agreeBtn: {
    flex: 1,
    backgroundColor: Colors.kulfa,
    flexDirection: 'column',
    justifyContent: 'center',
    borderRadius: 5,
    borderLeftWidth: 1,
    borderColor: 'white',
    margin: 3,
    elevation: 10

  }
})

export default HalafNama;
