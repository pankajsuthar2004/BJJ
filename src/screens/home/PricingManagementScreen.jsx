import React, {useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Modal,
  TextInput,
  TouchableWithoutFeedback,
} from 'react-native';
import SVG from '../../assets/svg';
import Colors from '../../theme/color';
import {hp, wp} from '../../utility/ResponseUI';
import {Fonts} from '../../assets/fonts';

const PricingManagementScreen = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [amount, setAmount] = useState('');
  const [selectedTier, setSelectedTier] = useState('');
  const [description, setDescription] = useState('');
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const pricingOptions = [
    {id: 1, price: '$50', title: 'Monthly Membership'},
    {id: 2, price: '$1250', title: 'Yearly Membership'},
    {id: 3, price: '$20', title: 'Drop-In Class'},
  ];

  const discountCodes = [
    {id: 1, discount: '$50', code: '50BJJ', expires: '2024/12/31'},
  ];

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.sectionTitle}>Pricing Options</Text>
      {pricingOptions.map(option => (
        <View key={option.id} style={styles.card}>
          <SVG.Money />
          <View style={styles.cardContent}>
            <Text style={styles.price}>{option.price}</Text>
            <Text style={styles.subtitle}>{option.title}</Text>
          </View>
          <View style={styles.buttonContainer}>
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
        <Text style={styles.addButtonText}>Add New Membership Tier</Text>
        <SVG.MoneyPlus />
      </TouchableOpacity>

      <Text style={styles.sectionTitle}>Discount Codes</Text>
      {discountCodes.map(discount => (
        <View key={discount.id} style={styles.card}>
          <View style={styles.cardContent}>
            <View style={{flexDirection: 'row'}}>
              <Text style={{fontWeight: '700', fontSize: 24}}>
                {discount.discount}
              </Text>
              <Text
                style={{
                  fontSize: 12,
                  fontFamily: Fonts.normal,
                  color: Colors.darkGray,
                }}>
                off
              </Text>
            </View>

            <Text style={styles.subtitle}>
              Expires: {discount.expires} - Code:
              <Text style={{color: Colors.darkGray}}>{discount.code}</Text>
            </Text>
          </View>

          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.deleteButton}>
              <Text style={styles.buttonText}>Delete</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.editButton}>
              <Text style={styles.buttonText}>Edit</Text>
            </TouchableOpacity>
          </View>
        </View>
      ))}

      <TouchableOpacity style={styles.addButton}>
        <Text style={styles.addButtonText}>+ Add New Discount Code</Text>
      </TouchableOpacity>

      <Modal animationType="slide" transparent={true} visible={modalVisible}>
        <TouchableWithoutFeedback onPress={() => setModalVisible(false)}>
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Add Membership</Text>

              <Text style={styles.label}>Amount</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter amount"
                keyboardType="numeric"
                value={amount}
                onChangeText={text => {
                  if (/^\d{0,6}$/.test(text)) {
                    setAmount(text);
                  }
                }}
              />
              <Text style={styles.label}>Membership</Text>
              <TouchableOpacity
                style={styles.dropdown}
                onPress={() => setDropdownOpen(!dropdownOpen)}>
                <Text>{selectedTier || 'Select Tier'}</Text>
                <SVG.SmallArrow />
              </TouchableOpacity>
              {dropdownOpen && (
                <View style={styles.dropdownList}>
                  {['Monthly', 'Yearly', 'Drop-in'].map(
                    (tier, index, array) => (
                      <TouchableOpacity
                        key={tier}
                        style={[
                          styles.dropdownItem,
                          index === array.length - 1 && {borderBottomWidth: 0},
                        ]}
                        onPress={() => {
                          setSelectedTier(tier);
                          setDropdownOpen(false);
                        }}>
                        <Text>{tier}</Text>
                      </TouchableOpacity>
                    ),
                  )}
                </View>
              )}

              <Text style={styles.label}>Description</Text>
              <TextInput
                style={[styles.input, {height: 40}]}
                placeholder="Optional..."
                value={description}
                onChangeText={setDescription}
              />

              <View style={styles.modalButtonContainer}>
                <TouchableOpacity
                  style={styles.cancelButton}
                  onPress={() => setModalVisible(false)}>
                  <Text style={styles.cancelText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.addMembershipButton}>
                  <Text style={styles.addMembershipText}>Add Membership</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.black,
    padding: 20,
    flex: 1,
  },
  sectionTitle: {
    fontSize: 18,
    color: Colors.white,
    marginBottom: 10,
  },
  card: {
    backgroundColor: Colors.white,
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 10,
  },
  cardContent: {
    flex: 1,
  },
  price: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.black,
  },
  subtitle: {
    fontSize: 12,
    color: Colors.gray,
  },
  buttonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  deleteButton: {
    backgroundColor: Colors.red,
    width: wp((65 / 430) * 100),
    height: hp((30 / 919) * 100),
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
    marginRight: 5,
  },
  editButton: {
    backgroundColor: Colors.black,
    width: wp((54 / 430) * 100),
    height: hp((30 / 919) * 100),
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 4,
  },
  buttonText: {
    color: Colors.white,
  },
  addButton: {
    borderColor: Colors.red,
    borderWidth: 2,
    borderStyle: 'dashed',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 10,
  },
  addButtonText: {
    color: Colors.white,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.8)',
  },
  modalContent: {
    backgroundColor: Colors.white,
    padding: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
  },
  label: {
    fontSize: 14,
    marginBottom: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: Colors.litegray,
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
  },
  dropdown: {
    backgroundColor: Colors.gray,
    padding: 10,
    borderRadius: 5,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dropdownList: {
    backgroundColor: Colors.litegray,
    borderRadius: 5,
    marginBottom: 5,
  },
  dropdownItem: {
    padding: 10,
    borderBottomWidth: 0.5,
    borderBottomColor: Colors.gray,
  },
  modalButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 20,
    gap: 10,
  },
  cancelButton: {
    borderColor: Colors.red,
    borderWidth: 1,
    width: wp((69 / 430) * 100),
    height: hp((31 / 919) * 100),
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
  },
  cancelText: {
    color: Colors.red,
    fontSize: 12,
  },
  addMembershipButton: {
    backgroundColor: Colors.black,
    borderRadius: 8,
    width: wp((121 / 430) * 100),
    height: hp((31 / 919) * 100),
    justifyContent: 'center',
    alignItems: 'center',
  },
  addMembershipText: {
    color: Colors.white,
    fontSize: 12,
  },
});

export default PricingManagementScreen;
