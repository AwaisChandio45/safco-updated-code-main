import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Modal, Button } from 'react-native';
import { HeaderwithoutDialoge, TextView } from '../../components';
import { Colors } from '../../theme';
import { useSelector } from 'react-redux';
const LoanStatusDetails = ({ route }) => {
  const { reportData } = route.params;
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  const getUserData = useSelector(state => state.UserData);
  const OrganizationType = Number(getUserData?.UserData?.OrganizationType);
  const loanLabel = OrganizationType === 2 ? 'Finance Facility' : 'Loan';
  const renderTableHeader = () => (
    <View style={[styles.tableHeaderRow, { backgroundColor: Colors.primary }]}>
      <Text style={styles.tableHeaderText}>No#</Text>
      <Text style={styles.tableHeaderText}>{`${loanLabel} Officer`}</Text>
      <Text style={styles.tableHeaderText}>Total Syncup Cases</Text>
      <Text style={styles.tableHeaderText}>Syncup Date</Text>
      <Text style={styles.tableHeaderText}>View</Text>
    </View>
  );

  const renderTableRow = ({ item, index }) => (
    <View style={styles.tableRow}>
      <Text style={styles.tableCellText}>{index + 1}</Text>
      <Text style={styles.tableCellText}>{item.Loan_Officer}</Text>
      <Text style={styles.tableCellText}>{item.No_Cases_Syncup}</Text>
      <Text style={styles.tableCellText}>{item.Syncup_Date}</Text>
      <TouchableOpacity
        style={[styles.viewButton, { backgroundColor: Colors.primary }]}
        onPress={() => {
          setSelectedItem(item);
          setModalVisible(true);
        }}
      >
        <Text style={styles.viewButtonText}>View</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <HeaderwithoutDialoge Theme={Colors} back={true} />
        <TextView
          type="mini_heading22"
          style={styles.headerText}
          text={`${loanLabel} Status Report`}
        />
      </View>
     
      <FlatList
        data={reportData}
        ListHeaderComponent={renderTableHeader}
        renderItem={renderTableRow}
        keyExtractor={(item, index) => index.toString()}
      />

      {/* Modal for Detailed View */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            {selectedItem && (
            <>
            <Text style={styles.modalTitle}>Details for {selectedItem.Loan_Officer}</Text>
            <Text style={styles.modalText}>
              <Text style={styles.labelText}>Station: </Text>
              <Text>{selectedItem.Station_Name}</Text>
            </Text>
            <Text style={styles.modalText}>
              <Text style={styles.labelText}>No Cases Syncup: </Text>
              <Text>{selectedItem.No_Cases_Syncup}</Text>
            </Text>
            <Text style={styles.modalText}>
              <Text style={styles.labelText}>BM Cases: </Text>
              <Text>{selectedItem.BM_Cases}</Text>
            </Text>
            <Text style={styles.modalText}>
              <Text style={styles.labelText}>VO Cases: </Text>
              <Text>{selectedItem.VO_Cases}</Text>
            </Text>
            <Text style={styles.modalText}>
              <Text style={styles.labelText}>MIS Cases: </Text>
              <Text>{selectedItem.MIS_Cases}</Text>
            </Text>
            <Text style={styles.modalText}>
              <Text style={styles.labelText}>RM Cases: </Text>
              <Text>{selectedItem.RM_Cases}</Text>
            </Text>
            <Text style={styles.modalText}>
              <Text style={styles.labelText}>ZM Cases: </Text>
              <Text>{selectedItem.ZM_Cases}</Text>
            </Text>
            <Text style={styles.modalText}>
              <Text style={styles.labelText}>Ready for Disbursed: </Text>
              <Text>{selectedItem.Ready_for_Disbursed}</Text>
            </Text>
            <Text style={styles.modalText}>
              <Text style={styles.labelText}>Disbursed: </Text>
              <Text>{selectedItem.Disbursed}</Text>
            </Text>
            <Text style={styles.modalText}>
              <Text style={styles.labelText}>Syncup Date: </Text>
              <Text>{selectedItem.Syncup_Date}</Text>
            </Text>
          </>
            )}
            <View style={styles.buttonContainer}>
              <Button title="Close" onPress={() => setModalVisible(false)} color={Colors.primary} />
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f5f5f5',
  },
  modalText: {
    fontSize: 16,
    color: '#333',
    marginVertical: 4,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.primary,
    textAlign: 'center',
    marginVertical: 10,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    color: Colors.primary,
  },
  headerText: {
    paddingHorizontal: 30,
    marginTop: 55,
    fontSize: 15,
    color: Colors.primary,
  },
  tableHeaderRow: {
    flexDirection: 'row',
    paddingVertical: 12,
    borderRadius: 8,
    marginBottom: 6,
  },
  tableHeaderText: {
    flex: 1,
    fontWeight: 'bold',
    color: '#ffffff',
    fontSize: 15,
    textAlign: 'center',
  },
  tableRow: {
    flexDirection: 'row',
    backgroundColor: '#ffffff',
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderColor: '#e0e0e0',
    marginVertical: 4,
    borderRadius: 6,
    paddingRight:10
  },
  tableCellText: {
    flex: 1,
    fontSize: 14,
    color: '#333',
    textAlign: 'center',
  },
  viewButton: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    justifyContent: 'center',
    
  },
  viewButtonText: {
    color: '#ffffff',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '90%',
    padding: 20,
    backgroundColor: '#ffffff',
    borderRadius: 10,
    elevation: 10,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  labelText: {
    fontWeight: 'bold',
  },
  buttonContainer: {
    marginTop: 15,
  },
});

export default LoanStatusDetails;
