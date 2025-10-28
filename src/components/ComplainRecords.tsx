import React, {memo, useRef, useState} from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Modal,
  Text,
  Platform,
  ScrollView,
  Dimensions,
  Animated,
  Pressable,
  Image,
} from 'react-native';
import {TextView} from '.';
import Fontisto from 'react-native-vector-icons/Fontisto';
import {Colors} from '../theme';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import * as Progress from 'react-native-progress';
import {TextInput} from 'react-native-paper';
import {updateComplain} from '../apis_auth/apis';
import Toast from './Toast';
import ComplainAdd from '../components/ComplainAdd';
import {Swipeable} from 'react-native-gesture-handler';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {useNavigation} from '@react-navigation/native';
import {useRoute} from '@react-navigation/native';
import {useSelector} from 'react-redux';
import ImagePicker from 'react-native-image-crop-picker';
interface ComplainRecordsProps {
  onPress: () => void;
  EmployeeComplainType: string;
  ComplainStatus: string;
  ResolveBy: string;
  EmployeeId: string;
  ComplainId: string;
  iconName: string;
  onResolved: () => void;
  progressVisible: boolean;
  complanedUsr: string;
  EmpName: string;
  ComplainDescription: string;
  handleEdit;
  ComplainImage;
}

const ComplainRecords: React.FC<ComplainRecordsProps> = ({
  onPress,
  EmployeeComplainType,
  ComplainStatus,
  ResolveBy,
  // EmployeeId,
  ComplainId,
  iconName,
  onResolved,
  progressVisible,
  complanedUsr,
  EmpName,
  ComplainDescription,
  handleEdit,
  ComplainImage,
}) => {
  const navigation = useNavigation();
  const [resolvedStatus, setResolvedStatus] = useState('Open');
  const [resolvedBy, setResolvedBy] = useState('');
  const [resolvedComment, setResolvedComment] = useState('');
  const [complainDate, setComplainDate] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [toast, setToast] = useState({value: '', type: ''});
  const [progress, setProgresss] = useState(false);
  const [complainViewDesignationData, setComplainViewDesignationData] =
    useState([]);
  const [openSwipeableId, setOpenSwipeableId] = useState(null);
  const swipeables = useRef({});
  const complainDesignationData = complainViewDesignationData
    .map(item => item.name)
    .join(',');
  const {height, width} = Dimensions.get('window');
  const route = useRoute();
  const getUserData = useSelector(state => state.UserData);
  const [EmployeeId, setEmployeeId] = useState(
    getUserData?.UserData?.EmployeeId,
  );
  const [selectedType, setSelectedType] = useState('');
  const [selectedImage, setSelectedImage] = useState('');
  console.log('img', selectedImage);
  const handleResolveComplaint = async () => {
    try {
      if (resolvedComment.trim() === '') {
        setToast({value: 'Please add a comment', type: 'error'});
        return;
      }
      const response = await updateComplain(
        EmployeeId,
        ComplainId,
        0,
        resolvedComment,
        selectedImage,
        setProgresss,
      );

      console.log('Idharr', selectedImage);
      if (response.statusCode === 200) {
        onResolved();
      }
      if (response.statusCode === 201) {
        setToast({value: 'Complain Already Updated', type: 'error'});
      } else {
        setToast({value: 'Complain Resolved Successfully', type: 'success'});
      }
    } catch (error) {
      setToast({value: 'Error resolving complain', type: 'error'});
      console.log('Error resolving complain:', error);
    }
  };
  const handlePress = () => {
    if (complanedUsr === EmployeeId) {
      if (ComplainStatus.trim() === 'Open') {
        setModalVisible(true);
      } else {
        Alert.alert('Complain is Closed', 'You cannot update close complains.');
      }
    } else {
    }
  };

  const closeModal = () => {
    setModalVisible(false);
  };
  const handleSwipeOpen = () => {
    if (openSwipeableId && swipeables.current[openSwipeableId]) {
      swipeables.current[openSwipeableId].close();
    }
    setOpenSwipeableId(ComplainId);
  };
  const handleSwipeClose = () => {
    setOpenSwipeableId(null);
  };

  const leftSwipe = (progress, dragX, swipeable) => {
    const scale = dragX.interpolate({
      inputRange: [0, 100],
      outputRange: [0, 1],
      extrapolate: 'clamp',
    });
    const opacity = dragX.interpolate({
      inputRange: [-50, 0],
      outputRange: [1, 0],
      extrapolate: 'clamp',
    });
    return (
      <View style={styles.swipeContainer}>
        <TouchableOpacity onPress={handleEdit}>
          <Animated.View style={{...styles.swipeButton}}>
            <MaterialCommunityIcons
              name="square-edit-outline"
              size={30}
              color={'green'}
              style={{alignSelf: 'flex-start'}}
            />
          </Animated.View>
        </TouchableOpacity>
      </View>
    );
  };
  const takePicture = () => {
    ImagePicker.openCamera({
      width: 300,
      height: 300,
      cropping: true,
    })
      .then(image => {
        setSelectedImage(image.path);
        setSelectedType('Image');
      })
      .catch(error => {
        console.log(error);
      });
  };
  return (
    <Swipeable
      key={ComplainId}
      renderLeftActions={(progress, dragX) =>
        leftSwipe(progress, dragX, swipeables.current[ComplainId])
      }
      onSwipeableOpen={handleSwipeOpen}
      onSwipeableClose={handleSwipeClose}
      ref={ref => (swipeables.current[ComplainId] = ref)}
      containerStyle={{flex: 1, justifyContent: 'center'}}
      enabled={ComplainStatus !== 'Close' && complanedUsr != EmployeeId}>
      <View style={{flex: 1}}>
        <View
          style={{
            flexDirection: 'row',
            padding: 20,
            margin: 10,
            alignItems: 'center',
            backgroundColor: '#fff',
            borderTopRightRadius: 10,
            borderBottomRightRadius: 10,
            borderTopLeftRadius: openSwipeableId ? 0 : 10,
            borderBottomLeftRadius: openSwipeableId ? 0 : 10,
            elevation: 5,
          }}>
          <View style={{flexDirection: 'row', flex: 1, alignItems: 'center'}}>
            <View style={{}}>
              <Pressable onPress={handlePress}>
                <View
                  style={{
                    width: 50,
                    height: 50,
                    borderRadius: 50,
                    borderColor: '#cdcdcd',
                    borderWidth: 1,
                    justifyContent: 'center',
                  }}>
                  <Fontisto
                    name={iconName}
                    color={Colors.parrotGreenColor}
                    size={20}
                    style={{alignSelf: 'center'}}
                  />
                </View>
              </Pressable>
            </View>

            <View style={{paddingLeft: 10, flex: 1}}>
              <View>
                <TextView
                  type={'Login'}
                  text={`Complain Status: ${ComplainStatus}`}
                  style={{fontSize: 16, color: '#3d3d3d'}}
                />
              </View>
              <TextView
                type={'Login'}
                text={`Complain From: ${EmpName}`}
                style={{fontSize: 16, color: '#3d3d3d'}}
              />
              <View>
                <TextView
                  type={'Login'}
                  text={`Resolved By: ${ResolveBy}`}
                  style={{fontSize: 14, color: '#3d3d3d'}}
                />
              </View>
            </View>
            <View style={{marginTop: 10}}>
              {progressVisible ? (
                <Progress.Circle
                  color={Colors.parrotGreenColor}
                  size={30}
                  indeterminate={true}
                />
              ) : (
                <TouchableOpacity onPress={onPress}>
                  <View
                    style={{
                      justifyContent: 'center',
                      padding: 10,
                      borderRadius: 20,
                    }}>
                    {ComplainStatus === 'Close' || ComplainStatus === 'Open' ? (
                      <Ionicons
                        name={'chevron-down-circle-outline'}
                        color={
                          ComplainStatus == 'Open'
                            ? '#cdcdcd'
                            : Colors.parrotGreenColor
                        }
                        size={30}
                        style={{alignSelf: 'center'}}
                      />
                    ) : (
                      <></>
                    )}
                  </View>
                </TouchableOpacity>
              )}
            </View>
          </View>
          {ComplainStatus == 'Close' ? (
            <View
              style={{
                position: 'absolute',
                top: -1,
                right: -2,
                borderBottomLeftRadius: 15,
                backgroundColor: Colors.parrotGreenColor,
              }}>
              <TextView
                style={{fontSize: 11, color: '#FFF', padding: 5}}
                text={'Closed'}></TextView>
            </View>
          ) : (
            <View
              style={{
                position: 'absolute',
                top: -1,
                right: -2,
                borderBottomLeftRadius: 15,
                backgroundColor: Colors.parrotGreenColor,
              }}>
              <TextView
                style={{fontSize: 11, color: '#FFF', padding: 5}}
                text={'Not Resolve yet!'}></TextView>
            </View>
          )}
          <Modal
            animationType={'slide'}
            transparent={true}
            visible={modalVisible}
            onRequestClose={closeModal}>
            <View style={styles.modalContainer}>
              <View style={styles.modalContent}>
                <TouchableOpacity onPress={closeModal} style={styles.closeBtn}>
                  <AntDesign
                    name="closecircleo"
                    size={30}
                    color={Colors.parrotGreenColor}
                  />
                </TouchableOpacity>
                <ScrollView contentContainerStyle={styles.scrollContent}>
                  <View style={styles.modalInnerContent}>
                    <TextView
                      type={'textSign'}
                      text={
                        <>
                          <Text style={{fontWeight: 'bold'}}>CompType:</Text>{' '}
                          {EmployeeComplainType}
                        </>
                      }
                      style={styles.modalText}
                    />
                    <TextView
                      type={'textSign'}
                      text={
                        <>
                          <Text style={{fontWeight: 'bold'}}>Status:</Text>{' '}
                          {ComplainStatus}
                        </>
                      }
                      style={styles.modalText}
                    />
                    <TextView
                      type={'textSign'}
                      text={
                        <>
                          <Text style={{fontWeight: 'bold'}}>Desc:</Text>{' '}
                          {ComplainDescription}
                        </>
                      }
                      style={styles.modalText}
                    />
                    {selectedType == 'Image' && selectedImage != '' && (
                      <Image
                        source={{uri: selectedImage}}
                        style={{width: 200, height: 200, borderRadius: 10}}
                      />
                    )}
                    <TouchableOpacity
                      style={styles.modalOption}
                      onPress={() => {
                        takePicture(selectedType);
                      }}>
                      <MaterialCommunityIcons
                        name="camera"
                        size={30}
                        color={Colors.parrotGreenColor}
                      />
                      <Text style={styles.modalIconText}>
                        {selectedType == 'Image' ? '' : 'Take Picture'}
                      </Text>
                    </TouchableOpacity>

                    <TextInput
                      placeholder="Add Comment"
                      value={resolvedComment}
                      onChangeText={text => setResolvedComment(text)}
                      style={[styles.input, {textAlignVertical: 'top'}]}
                      multiline={true}
                      numberOfLines={5}
                    />
                    <TouchableOpacity
                      onPress={() => {
                        handleResolveComplaint();
                        closeModal();
                      }}
                      style={styles.resolveBtn}>
                      <Text style={styles.resolveBtnText}>
                        Resolved Complain
                      </Text>
                    </TouchableOpacity>
                  </View>
                </ScrollView>
              </View>
            </View>
          </Modal>
        </View>
        <Toast
          type={toast.type}
          message={toast.value}
          onDismiss={() => setToast({value: '', type: ''})}
        />
      </View>
    </Swipeable>
  );
};

const styles = StyleSheet.create({
  SyncButton: {
    position: 'absolute',
    bottom: 10,
    right: 100,
    justifyContent: 'center',
  },
  row: {flexDirection: 'row', alignItems: 'center'},
  card: {
    height: 80,
    borderRadius: 5,
    elevation: 3,
    marginTop: 10,
    marginBottom: 10,
  },
  updateButton: {
    position: 'absolute',
    bottom: -1,
    right: 1,
    justifyContent: 'center',
    borderTopLeftRadius: 10,
    padding: 10,
    backgroundColor: Colors.parrotGreenColor,
  },
  bottomButton: {
    backgroundColor: '#fff',
    alignItems: 'center',
    borderRadius: 50,
    width: 70,
    height: 30,
    elevation: 5,
    flexDirection: 'column',
    justifyContent: 'center',
  },
  modalContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    elevation: 5,
    width: '80%',
    maxHeight: '80%',
  },
  scrollContent: {
    flexGrow: 1,
  },
  modalInnerContent: {
    paddingVertical: 50,
  },
  modalText: {
    fontSize: 16,
    marginBottom: 10,
  },
  scrollView: {
    flex: 1,
  },
  input: {
    height: 60,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    width: '100%',
    borderRadius: 5,
  },
  resolveBtn: {
    width: '100%',
    marginTop: 16,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 15,
    borderRadius: 10,
    backgroundColor: Colors.parrotGreenColor,
  },
  resolveBtnText: {
    color: '#fff',
    fontSize: 16,
  },
  closeBtn: {
    position: 'absolute',
    top: 10,
    right: 10,
    zIndex: 1,
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
  swipeContainer: {
    backgroundColor: '#fff',
    width: '25%',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderBottomLeftRadius: 10,
    borderTopLeftRadius: 10,
    marginVertical: 10,
    marginLeft: 10,
    shadowColor: '#000',
    elevation: 5,
  },
  swipeButton: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'flex-start',
    backgroundColor: '#fff',
  },
  modalOption: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fcfcfc',
    padding: 10,
    borderRadius: 5,
    marginVertical: 5,
  },
  modalIconText: {
    color: '#000',
    fontSize: 16,
    fontWeight: '400',
  },
});
export default memo(ComplainRecords);
