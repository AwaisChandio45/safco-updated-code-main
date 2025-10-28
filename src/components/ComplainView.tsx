import React, {useEffect, useState, useRef} from 'react';
import {
  FlatList,
  View,
  Text,
  Dimensions,
  ScrollView,
  StyleSheet,
  Image,
  TouchableOpacity,
} from 'react-native';
import {getComplain} from '../apis_auth/apis';
import {connect, useSelector} from 'react-redux';
import ComplainRecords from './ComplainRecords';
import {Modalize} from 'react-native-modalize';
import TextView from './TextView';
import CustomProgressDialoge from './CustomProgressDialoge';
import Colors from '../theme/Colors';
import {getComplainDesignation} from '../apis_auth/apis';
import Toast from './Toast';
import Feather from 'react-native-vector-icons/Feather';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Nodata from './Nodata';
import {useRoute} from '@react-navigation/native';
import {useNavigation} from '@react-navigation/native';

export default function ComplainView() {
  const navigation = useNavigation();
  const [title, setTitle] = React.useState('Fetching..');
  const getUserData = useSelector(state => state.UserData);
  const [name, setName] = useState(getUserData?.UserData?.FirstName);
  const [EmployeeId, setEmployeeId] = useState(
    getUserData?.UserData?.EmployeeId,
  );
  const [noData, setNoData] = useState(false);
  const [complainViewDesignationData, setComplainViewDesignationData] =
    useState([]);
  const [selectedData, setSelectedData] = React.useState();
  const [Complain, setComplain] = React.useState([]);
  const [toast, setToast] = useState({value: '', type: ''});
  const modalizeRef = useRef<Modalize>(null);
  const {height, width} = Dimensions.get('window');
  const [progress, setProgresss] = useState(false);
  const [selectedImage, setSelectedImage] = useState('');
  const route = useRoute();

  const onOpen = () => {
    modalizeRef.current?.open();
  };

  useEffect(() => {
    getComplain(EmployeeId, setProgresss)
      .then(response => {
        if (response.data.statusCode == 200) {
          const sortedComplains = response.data.message.sort((a, b) => {
            const dateA = new Date(a.ComplainDate);
            const dateB = new Date(b.ComplainDate);
            return dateB - dateA;
          });
          setComplain(sortedComplains);
          setTitle('Complains');
        } else {
          setNoData(true);
          setTitle('No Complains');
        }
      })
      .catch(function (error) {
        console.log(error);
        setTitle('Error Fetching Complains');
      });
  }, [EmployeeId]);

  const handleEdit = item => {
    console.log('CLICK on handleEdit');
    console.log('COMPLAIN DATA:', item);
    navigation.navigate('ComplainAdd', {editMode: true, complainData: item});
  };

  const renderItemGroups = ({item, index}) => {
    return (
      <>
        <ComplainRecords
          key={item.ComplainId}
          iconName={'person'}
          EmployeeComplainType={item?.EmployeeComplainType}
          ComplainStatus={item?.ComplainStatus}
          EmpName={item?.EmpName}
          ComplainDescription={item?.ComplainDescription}
          ComplainId={item?.ComplainId}
          ResolveBy={item?.ResolveBy}
          EmployeeId={item?.EmployeeId}
          complanedUsr={item?.ComDesignation}
          handleEdit={() => handleEdit(item)}
          onResolved={() =>
            getComplain(EmployeeId, setProgresss)
              .then(response => {
                if (response.data.statusCode == 200) {
                  setComplain(response.data.message);
                  console.log('complainView', response.data.message);
                } else {
                  alert(response.data.message);
                }
              })
              .catch(function (error) {
                console.log(error);
              })
          }
          onPress={() => {
            setSelectedData(item);
            setSelectedImage(item?.ComplainImage);
            onOpen();
          }}
        />
      </>
    );
  };
  return (
    <>
      {Complain != undefined && Complain.length > 0 && (
        <FlatList
          data={Complain}
          renderItem={renderItemGroups}
          keyExtractor={item => item.ComplainId}
          ListEmptyComponent={<Nodata />}
        />
      )}

      <CustomProgressDialoge
        dialogVisible={progress}
        setDialogVisible={setProgresss}
        title={title}
      />

      {selectedData != undefined &&
      (selectedData.ComplainStatus == 'Close' ||
        selectedData.ComplainStatus == 'Open') ? (
        <Modalize ref={modalizeRef} snapPoint={height / 1.8}>
          <ScrollView showsVerticalScrollIndicator={false}>
            <View style={{padding: 20}}>
              <TextView
                text={
                  selectedData.ComplainStatus == 'Close'
                    ? 'Resolved Complain Details'
                    : 'Complain Details'
                }
                style={{
                  color: Colors.black,
                  fontWeight: 'bold',
                  fontSize: 20,
                  textAlign: 'center',
                  marginBottom: 10,
                }}></TextView>
              <View
                style={{
                  backgroundColor: '#f1f1f1',
                  paddingHorizontal: 15,
                  paddingVertical: 20,
                  borderRadius: 10,
                }}>
                <View style={styles.row}>
                  <TextView text="Complain Type" style={styles.leftTextView} />
                  <TextView
                    text={selectedData.EmployeeComplainType}
                    style={styles.rightTextView}
                  />
                </View>
                <View style={styles.row}>
                  <TextView text="Station Name" style={styles.leftTextView} />
                  <TextView
                    text={selectedData.StationName}
                    style={styles.rightTextView}
                  />
                </View>
                <View style={styles.row}>
                  <TextView text="Description" style={styles.leftTextView} />
                  <TextView
                    text={selectedData.ComplainDescription}
                    style={styles.rightTextView}
                  />
                </View>
                <View style={styles.row}>
                  <TextView
                    text="Resolve Comment"
                    style={styles.leftTextView}
                  />
                  <TextView
                    text={selectedData.ResolveComment}
                    style={styles.rightTextView}
                  />
                </View>
                <View style={styles.row}>
                  <TextView
                    text="Complain Added By"
                    style={styles.leftTextView}
                  />
                  <TextView
                    text={selectedData.EmpName}
                    style={styles.rightTextView}
                  />
                </View>
                <View style={styles.row}>
                  <TextView text="Complain Date" style={styles.leftTextView} />
                  <TextView
                    text={selectedData.ComplainDate}
                    style={styles.rightTextView}
                  />
                </View>
                <View style={styles.row}>
                  <TextView text="Resolved By" style={styles.leftTextView} />
                  <TextView
                    text={selectedData.ResolveBy}
                    style={styles.rightTextView}
                  />
                </View>
                <View style={styles.row}>
                  <TextView text="Resolved On " style={styles.leftTextView} />
                  <TextView
                    text={selectedData.ResolveOn}
                    style={styles.rightTextView}
                  />
                </View>
                <View style={styles.row}>
                  <TextView text="Captured Image" style={styles.leftTextView} />
                  <Image
                    source={{uri: selectedData?.ComplainImage}}
                    style={{width: 100, height: 100, borderRadius: 10}}
                  />
                </View>
              </View>
            </View>
          </ScrollView>
        </Modalize>
      ) : (
        <></>
      )}
    </>
  );
}

const styles = StyleSheet.create({
  closeBtn: {
    width: '80%',
    marginTop: 16,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 15,
    borderRadius: 10,
    backgroundColor: Colors.parrotGreenColor,
  },
  closeBtnText: {
    color: '#fff',
    fontSize: 16,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    textAlign: 'center',
    marginBottom: 10,
    backgroundColor: '#f9f9f9',
    paddingLeft: 10,
    padding: 10,
    borderRadius: 5,
  },
  leftTextView: {
    flex: 1,
    fontSize: 16,
    fontWeight: '700',
    color: Colors.black,
  },
  rightTextView: {
    flex: 1,
    fontSize: 15,
    color: Colors.black,
    paddingLeft: 5,
  },
  rowBack: {
    alignItems: 'center',
    backgroundColor: '#DDD',
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingLeft: 15,
  },
  backRightBtn: {
    alignItems: 'center',
    bottom: 0,
    justifyContent: 'center',
    position: 'absolute',
    top: 0,
    width: 75,
  },
  backRightBtnLeft: {
    backgroundColor: '#1f65ff',
    right: 75,
  },
  backRightBtnRight: {
    backgroundColor: '#ff2e63',
    right: 0,
  },
  backTextWhite: {
    color: '#FFF',
  },
});
