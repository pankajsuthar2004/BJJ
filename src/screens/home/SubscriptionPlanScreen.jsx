import React, {useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
  TextInput,
} from 'react-native';
import {Fonts} from '../../assets/fonts';
import Colors from '../../theme/color';

const SubscriptionPlanScreen = () => {
  const [plans, setPlans] = useState([
    {id: 1, price: 50, type: 'Monthly Plan'},
    {id: 2, price: 550, type: 'Yearly Plan'},
  ]);
  const [modalVisible, setModalVisible] = useState(false);
  const [newPlan, setNewPlan] = useState({name: '', price: ''});

  const addNewPlan = () => {
    if (newPlan.name && newPlan.price) {
      setPlans([...plans, {id: plans.length + 1, ...newPlan}]);
      setNewPlan({name: '', price: ''});
      setModalVisible(false);
    }
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
            <TouchableOpacity style={styles.deleteButton}>
              <Text style={styles.buttonText}>Delete</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.editButton}>
              <Text style={styles.buttonText}>Edit</Text>
            </TouchableOpacity>
          </View>
        </View>
      ))}

      <TouchableOpacity
        style={styles.addButton}
        onPress={() => setModalVisible(true)}>
        <Text style={styles.addButtonText}>Add New Membership Plan</Text>
      </TouchableOpacity>

      <Modal visible={modalVisible} animationType="fade" transparent={true}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Name</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter plan name"
              value={newPlan.name}
              onChangeText={text => setNewPlan({...newPlan, name: text})}
            />
            <Text style={styles.modalTitle}>Price</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter price"
              keyboardType="numeric"
              value={newPlan.price}
              onChangeText={text => setNewPlan({...newPlan, price: text})}
            />
            <View style={styles.buttonRow}>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => setModalVisible(false)}>
                <Text style={styles.cancelText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.addMembershipButton}
                onPress={addNewPlan}>
                <Text style={styles.addMembershipText}>Add Membership</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: '#000', padding: 20},
  planCard: {
    backgroundColor: '#222',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 20,
    borderRadius: 10,
    marginBottom: 15,
  },
  planInfo: {flexDirection: 'column'},
  priceText: {fontSize: 22, fontFamily: Fonts.normal, color: '#fff'},
  planDetail: {fontSize: 14, color: '#ccc'},
  buttonGroup: {flexDirection: 'row'},
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
  buttonText: {color: '#fff', fontSize: 12},
  addButton: {
    backgroundColor: 'red',
    padding: 15,
    alignItems: 'center',
    borderRadius: 10,
    marginTop: 20,
  },
  addButtonText: {color: '#fff', fontSize: 16, fontFamily: Fonts.normal},

  // Modal Styles
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.8)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    width: '90%',
  },
  modalTitle: {fontSize: 16, fontFamily: Fonts.normal, marginBottom: 5},
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 10,
    borderRadius: 5,
    marginBottom: 15,
    backgroundColor: '#f9f9f9',
  },
  buttonRow: {flexDirection: 'row', justifyContent: 'flex-end', gap: 10},
  cancelButton: {
    padding: 8,
    borderWidth: 1,
    borderColor: 'red',
    borderRadius: 8,
  },
  cancelText: {color: 'red', fontSize: 14},
  addMembershipButton: {backgroundColor: 'black', padding: 8, borderRadius: 8},
  addMembershipText: {color: '#fff', fontSize: 14},
});

export default SubscriptionPlanScreen;
