import React from 'react';
import {
  Text,
  View,
  SafeAreaView,
  StyleSheet,
  ScrollView,
  TextInput,
  Alert,
} from 'react-native';
import {GlobalStyles, Colors} from '../../theme';
import RNFS from 'react-native-fs';

import ReportTableComponent from '../../components/ReportTableComponent';
import {AppStatusBar, HeaderwithoutDialoge, TextView} from '../../components';
import {FlatList, TouchableOpacity} from 'react-native-gesture-handler';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import RNHTMLtoPDF from 'react-native-html-to-pdf';
import {ProgressDialog} from 'react-native-simple-dialogs';

const GeneratedReport = ({route}) => {
  const [report, setReports] = React.useState(route.params.report.LoanDetails);
  const [orignal, setOrignal] = React.useState(route.params.report.LoanDetails);
  const [progress, setProgress] = React.useState(false);
  const AppFolder = 'Safco_reactapp';

  React.useEffect(() => {
    // console.log("report==>"+report)
  }, []);
  //console.log(route.params.report.LoanDetails)
  const handleSearch = text => {
    try {
      if (text) {
        const newData = orignal.filter(
          item => {
            return (
              item.LoanId.toLowerCase().indexOf(text.toLowerCase()) >= 0 ||
              item.StaffName.toLowerCase().indexOf(text.toLowerCase()) >= 0 ||
              item.NICNumber.toLowerCase().indexOf(text.toLowerCase()) >= 0
            );
          },

          //  var itemData   = item
          //   ? item.LoanId.toUpperCase()
          //   : ''.toUpperCase();

          // const textData = text.toUpperCase();
          // return itemData.indexOf(textData) > -1;
        );
        setReports(newData);
        // setSearch(text);
      } else {
        setReports(orignal);
        // setSearch(text);
      }
    } catch (error) {
      //console.log(error)
    }
  };
  const handleHtml = html => {
    setProgress(true);
    var maker1 = Object.keys(html[0]);
    var maker = `<HTML><style>table {font-family: arial, sans-serif;font-size:8px;border-collapse: collapse;width: 100%;}td, th {border: 1px solid #dddddd;text-align: left;padding: 8px;}tr:nth-child(even) {background-color: #dddddd;}</style> <table> <tr>  ${maker1.map(
      item => {
        return `<th>${item}</th>`;
      },
    )}</tr>  ${html.map(item => {
      let temp = '';
      for (const [key, value] of Object.entries(item))
        temp += `<td>${value}</td>`;
      return `<tr>${temp}</tr>`;
    })} </table></HTML>`;
    convertToPdf(maker);
  };
  const convertToPdf = async html => {
    let options = {
      html: html,
      fileName: `GeneratedReport${new Date().getTime()}`,
      directory: AppFolder,
      width: 992,
      height: 512,
      padding: 2,
    };

    let file = await RNHTMLtoPDF.convert(options);
    console.log(file.filePath);

    const DirectoryPath =
      RNFS.DownloadDirectoryPath + '/' + `GeneratedDetailReport.pdf`;

    await RNFS.moveFile(file.filePath, DirectoryPath)
      .then(e => console.log('===>successfully moved file'))
      .catch(err => console.log('===>moved file error', err));

    setProgress(false);
    Alert.alert(
      'Report Generated',
      'Report Generated Successfully in Download Folder',
      [{text: 'OK', onPress: () => {}}],
    );
  };
  return (
    <>
      <AppStatusBar></AppStatusBar>
      <View style={GlobalStyles.row}>
        <HeaderwithoutDialoge Theme={Colors} back={true}></HeaderwithoutDialoge>
        <TextView
          type={'mini_heading22'}
          style={{
            paddingHorizontal: 30,
            marginTop: 55,
            fontSize: 15,
            marginBottom: 10,
          }}
          text="Generated Report"></TextView>
      </View>
      <SafeAreaView style={{flex: 1, backgroundColor: '#fff', padding: 20}}>
        <View
          style={{
            flexDirection: 'row',
            borderBottomWidth: 1,
            borderColor: '#cdcdcd',
          }}>
          <View style={{flex: 1}}>
            <TextInput
              placeholder="Search by LoanID or CNIC"
              style={{paddingLeft: 20, color: '#000'}}
              onChangeText={text => {
                handleSearch(text);
              }}
              keyboardType="default"
            />
          </View>
          <View
            style={{
              paddingRight: 20,
              flexDirection: 'column',
              justifyContent: 'center',
            }}>
            <MaterialCommunityIcons
              name="magnify"
              size={26}></MaterialCommunityIcons>
          </View>
          <TouchableOpacity
            onPress={() => {
              handleHtml(orignal);
            }}
            style={{
              padding: 10,
              borderRadius: 10,
              elevation: 10,
              backgroundColor: '#f1f1f1',
            }}>
            <TextView
              style={{color: '#000', fontSize: 12}}
              text={'Download Report'}></TextView>
          </TouchableOpacity>
        </View>

        <FlatList
          data={report}
          renderItem={({item}) => <ReportTableComponent item={item} />}
          keyExtractor={item => item.SrNo}
        />
      </SafeAreaView>

      <ProgressDialog
        visible={progress}
        title="Downloading Report..."
        message="Please, wait..."
        activityIndicatorColor={Colors.parrotGreenColor}
      />
    </>
  );
};

export default GeneratedReport;
