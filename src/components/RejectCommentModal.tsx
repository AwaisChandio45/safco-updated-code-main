import React, { useState } from 'react';
import { View, TextInput, Modal, Text, TouchableOpacity, StyleSheet } from 'react-native';

const RejectCommentModal = ({ onPress, modalVisiblereject, setModalVisibleReject, setCommentRecject, comment }) => {

  const handleSubmit = () => {
    setModalVisibleReject(false);
    onPress();
  };

  const handleCloseModal = () => {
    setModalVisibleReject(false);
  };

  return (
    <Modal visible={modalVisiblereject} animationType="slide" transparent>
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <TouchableOpacity onPress={handleCloseModal} style={styles.closeButton}>
            <Text style={styles.closeButtonText}>x</Text>
          </TouchableOpacity>

          <Text style={styles.rejecttitle}>Why you Reject this Customer ?</Text>
          <TextInput
            placeholder="Enter your comment"
            onChangeText={setCommentRecject}
            value={comment}
            style={[styles.input, { textAlignVertical: 'top' }]}
            multiline={true}
            numberOfLines={10} // Specify the number of lines to display
          />

          <TouchableOpacity style={styles.button} onPress={handleSubmit}>
            <Text style={styles.buttonText}>Submit</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Semi-transparent background
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    width: '80%',
  },
  input: {
    height: 100,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
    borderRadius: 5,
    marginTop:15
  },
  button: {
    backgroundColor: '#130C52',
    padding: 10,
    borderRadius: 5,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    textAlign: 'center',
  },
  closeButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    zIndex: 1,
    
  },
  closeButtonText: {
    fontSize: 30,
    fontWeight: '600',
    color:'red'
  },
  rejecttitle:{
    top:10,
    padding:0,
    fontSize:14,
    fontWeight:'600'
  }
});

export default RejectCommentModal;






