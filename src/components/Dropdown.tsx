import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Modal, FlatList, StyleSheet, TextInput, ActivityIndicator, Dimensions, Pressable } from 'react-native';
import axios from 'axios';
import { BlurView } from '@react-native-community/blur';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import EvilIcons from 'react-native-vector-icons/EvilIcons';

const { height, width } = Dimensions.get('window');

const Dropdown = ({ value, onChangeText, onSelect }) => {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [searchText, setSearchText] = useState('');
  const [dropdownWidth, setDropdownWidth] = useState(width * 0.8); // Initial width

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (selectedItem) {
      // Calculate the width dynamically based on the length of the selected item text
      const textWidth = selectedItem.FirstName.length * 10 + selectedItem.LastName.length * 10 +
                        selectedItem.EmployeeDesignationName.length * 10 + selectedItem.StationName.length * 10;
      const newWidth = textWidth > width * 0.8 ? width * 0.8 : textWidth; // Limit width to 80% of screen width
      setDropdownWidth(newWidth);
    }
  }, [selectedItem]);

  const fetchData = async () => {
    try {
      const response = await axios.get('http://hr.safcomicrofinance.com.pk/hr/employees/staff_complains_api.php?action=GetEmployeeComplains');
      if (response.status === 200) {
        setData(response.data.data);
        setFilteredData(response.data.data);
        setIsLoading(false);
      } else {
        console.error('Error fetching data. Status:', response.status);
        setIsLoading(false);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      setIsLoading(false);
    }
  };

  const openModal = () => {
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
    setSearchText('');
  };

  const handleSelectItem = (item) => {
    setSelectedItem(item);
    setModalVisible(false);
    setSearchText('');
    onSelect(item.EmployeeId);
   
  };

  const handleSearch = (text) => {
    setSearchText(text);
    const filtered = data.filter((item) =>
      item.FirstName.toLowerCase().includes(text.toLowerCase()) ||
      item.LastName.toLowerCase().includes(text.toLowerCase())
    );
    setFilteredData(filtered);
  };

  return (
    <View>
      
      <TouchableOpacity style={[styles.dropdownButton, { width: dropdownWidth }]} onPress={openModal}>
        <Text style={styles.dropdownButtonText}>
          {selectedItem ? `${selectedItem.FirstName} ${selectedItem.LastName} - ${selectedItem.EmployeeDesignationName} - ${selectedItem.StationName}` : 'Select Employee'}
        </Text>
        <MaterialCommunityIcons name="menu-down" color="#000" size={26} />
      </TouchableOpacity>
      {modalVisible && (
        <Modal
          animationType="fade"
          transparent={true}
          visible={modalVisible}
          onRequestClose={closeModal}
        >
          <View style={styles.modalContainer}>
            <BlurView
              style={styles.absolute}
              blurType="light"
              blurAmount={10}
              reducedTransparencyFallbackColor="white"
            />
            <View style={styles.modalContent}>
              <Pressable onPress={closeModal} style={{ alignSelf: 'flex-end' }}>
                <MaterialCommunityIcons name="close" color="#FF0000" size={26} />
              </Pressable>
              <View style={styles.searchContainer}>
                <TextInput
                  style={styles.searchInput}
                  placeholder="Search..."
                  value={searchText}
                  onChangeText={handleSearch}
                />
                <Pressable style={styles.circle} onPress={closeModal}>
                  <EvilIcons name="close" color="#32CD32" size={14} />
                </Pressable>
              </View>
              {isLoading ? (
                <ActivityIndicator size="large" color="#0000ff" />
              ) : (
                <FlatList
                  data={filteredData}
                  renderItem={({ item }) => {
                    const fullName = `${item.FirstName} ${item.LastName}`;
                    const designation = item.EmployeeDesignationName;
                    const station = item.StationName;
                    return (
                      <Pressable style={styles.option} onPress={() => handleSelectItem(item)}>
                        <Text style={styles.optionText}>{fullName} - {designation} - {station}</Text>
                      </Pressable>
                    );
                  }}
                  keyExtractor={(item) => item.EmployeeId.toString()}
                  ItemSeparatorComponent={() => <View style={styles.separator} />}
                />
              )}
            </View>
          </View>
        </Modal>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  label: {
    color: '#737373',
    marginLeft: 10,
    marginBottom: 5,
  },
  dropdownButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#f1f1f1',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
  },
  dropdownButtonText: {
    fontSize: 15,
    color: '#737373',
  },
  modalContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  absolute: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
  },
  modalContent: {
    width: '90%',
    maxHeight: '80%',
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 5,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 0.7,
    borderBottomColor: '#228B22',
    marginBottom: 30,
    width: '85%',
    alignSelf: 'center',
  },
  searchInput: {
    flex: 1,
    backgroundColor: '#FFF',
    color: '#7d7d7d',
    padding: 10,
  },
  circle: {
    height: 20,
    width: 20,
    borderRadius: 100,
    justifyContent: 'center',
    backgroundColor: '#f1f1f1',
    marginLeft: 10,
  },
  option: {
    paddingVertical: 10,
  },
  optionText: {
    fontSize: 13,
  },
  separator: {
    height: 1,
    backgroundColor: '#ccc',
  }
});

export default Dropdown;
