import React, {useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
  TextInput,
  Alert,
} from 'react-native';
import {Fonts} from '../../assets/fonts';
import Colors from '../../theme/color';
import makeRequest from '../../api/http';
import {EndPoints} from '../../api/config';
import {showToast} from '../../utility/Toast';

const SubscriptionPlanScreen = () => {
  const [plans, setPlans] = useState([
    {id: 1, price: 50, type: 'Monthly Plan', duration: 30},
    {id: 2, price: 550, type: 'Yearly Plan', duration: 365},
  ]);
  const [modalVisible, setModalVisible] = useState(false);
  const [newPlan, setNewPlan] = useState({name: '', price: '', duration: '7'});
  const [editPlanData, setEditPlanData] = useState(null);

  const addNewPlan = async () => {
    if (!newPlan.name || !newPlan.price) {
      showToast({message: 'Name and Price are required!', type: 'error'});
      return;
    }

    try {
      const response = await makeRequest({
        endPoint: EndPoints.CreatePlan,
        method: 'POST',
        body: newPlan,
      });
      showToast({message: 'Plan created successfully!', type: 'success'});
      setPlans(prev => [...prev, {...newPlan, id: prev.length + 1}]);
      setNewPlan({name: '', price: '', duration: '7'});
      setModalVisible(false);
    } catch (error) {
      console.error(error);
      showToast({message: 'Failed to create plan', type: 'error'});
    }
  };

  const editPlan = async () => {
    if (!editPlanData?.name || !editPlanData?.price) {
      showToast({message: 'Name and Price are required!', type: 'error'});
      return;
    }

    try {
      const response = await makeRequest({
        endPoint: `${EndPoints.UpdatePlan}?id=${editPlanData.id}&name=${editPlanData.name}&price=${editPlanData.price}&duration=${editPlanData.duration}`,
        method: 'PATCH',
      });

      showToast({message: 'Plan updated successfully!', type: 'success'});
      setPlans(prev =>
        prev.map(plan =>
          plan.id === editPlanData.id ? {...plan, ...editPlanData} : plan,
        ),
      );
      setModalVisible(false);
      setEditPlanData(null);
    } catch (error) {
      console.error(error);
      showToast({message: 'Failed to update plan', type: 'error'});
    }
  };

  const deletePlan = async id => {
    Alert.alert(
      'Confirm Delete',
      'Are you sure you want to delete this plan?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          onPress: async () => {
            try {
              const response = await makeRequest({
                endPoint: `${EndPoints.DeletePlan}?id=${id}`,
                method: 'DELETE',
              });
              showToast({
                message: 'Plan deleted successfully!',
                type: 'success',
              });
              setPlans(prev => prev.filter(plan => plan.id !== id));
            } catch (error) {
              console.error(error);
              showToast({message: 'Failed to delete plan', type: 'error'});
            }
          },
        },
      ],
    );
  };

  const openEditModal = plan => {
    setEditPlanData(plan);
    setModalVisible(true);
  };

  return (
    <View style={styles.container}>
      {plans.map(plan => (
        <View key={plan.id} style={styles.planCard}>
          <View style={styles.planInfo}>
            <Text style={styles.priceText}>${plan.price}</Text>
            <Text style={styles.planDetail}>{plan.type}</Text>
          </View>
          <View style={styles.buttonGroup}>
            <TouchableOpacity
              style={styles.deleteButton}
              onPress={() => deletePlan(plan.id)}>
              <Text style={styles.buttonText}>Delete</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.editButton}
              onPress={() => openEditModal(plan)}>
              <Text style={styles.buttonText}>Edit</Text>
            </TouchableOpacity>
          </View>
        </View>
      ))}

      <TouchableOpacity
        style={styles.addButton}
        onPress={() => {
          setNewPlan({name: '', price: '', duration: '7'});
          setModalVisible(true);
        }}>
        <Text style={styles.addButtonText}>Add New Membership Plan</Text>
      </TouchableOpacity>

      <Modal visible={modalVisible} animationType="fade" transparent={true}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Name</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter plan name"
              value={editPlanData ? editPlanData.name : newPlan.name}
              onChangeText={text =>
                editPlanData
                  ? setEditPlanData(prev => ({...prev, name: text}))
                  : setNewPlan(prev => ({...prev, name: text}))
              }
            />
            <Text style={styles.modalTitle}>Price</Text>
            <TextInput
              style={styles.input}
              placeholder="Amount here..."
              keyboardType="numeric"
              value={editPlanData ? editPlanData.price : newPlan.price}
              onChangeText={text =>
                editPlanData
                  ? setEditPlanData(prev => ({...prev, price: text}))
                  : setNewPlan(prev => ({...prev, price: text}))
              }
            />
            <View style={styles.buttonRow}>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => {
                  setModalVisible(false);
                  setEditPlanData(null);
                }}>
                <Text style={styles.cancelText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.addMembershipButton}
                onPress={editPlanData ? editPlan : addNewPlan}>
                <Text style={styles.addMembershipText}>
                  {editPlanData ? 'Update Membership' : 'Add Membership'}
                </Text>
              </TouchableOpacity>
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
    backgroundColor: Colors.black,
    padding: 20,
  },
  planCard: {
    backgroundColor: Colors.darkGray,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 20,
    borderRadius: 10,
    marginBottom: 15,
  },
  planInfo: {
    flexDirection: 'column',
  },
  priceText: {
    fontSize: 22,
    fontFamily: Fonts.normal,
    color: Colors.white,
  },
  planDetail: {
    fontSize: 14,
    color: Colors.white,
  },
  addButton: {
    backgroundColor: Colors.red,
    padding: 15,
    alignItems: 'center',
    borderRadius: 10,
    marginTop: 20,
  },
  addButtonText: {
    color: Colors.white,
    fontSize: 16,
    fontFamily: Fonts.normal,
  },
  buttonGroup: {
    flexDirection: 'row',
  },
  deleteButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: Colors.red,
    borderRadius: 8,
    marginRight: 10,
  },
  editButton: {
    backgroundColor: Colors.red,
    borderRadius: 8,
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  buttonText: {
    color: Colors.white,
    fontSize: 12,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.8)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: Colors.white,
    padding: 20,
    borderRadius: 10,
    width: '90%',
  },
  modalTitle: {
    fontSize: 16,
    fontFamily: Fonts.normal,
    marginBottom: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: Colors.litegray,
    padding: 10,
    borderRadius: 5,
    marginBottom: 15,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 8,
  },
  cancelButton: {
    padding: 8,
    borderWidth: 1,
    borderColor: Colors.red,
    borderRadius: 8,
  },
  cancelText: {
    color: Colors.red,
    fontSize: 14,
  },
  addMembershipButton: {
    backgroundColor: Colors.black,
    padding: 8,
    borderRadius: 8,
  },
  addMembershipText: {
    color: Colors.white,
    fontSize: 14,
  },
});

export default SubscriptionPlanScreen;
