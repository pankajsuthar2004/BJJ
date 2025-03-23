import React, {useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  TextInput,
  Modal,
} from 'react-native';

import SVG from '../../assets/svg';
import {Fonts} from '../../assets/fonts';
import Colors from '../../theme/color';
import {useNavigation} from '@react-navigation/native';

const gymsData = [
  {id: '1', name: 'gym jumper'},
  {id: '2', name: 'gym for fitness'},
  {id: '3', name: 'gym wellness'},
  {id: '4', name: 'gym jackpot'},
  {id: '5', name: 'gym with josh'},
];

const historyData = [
  {id: '1', name: 'Gym with Josh', date: '02/01/2025', status: 'Active'},
  {id: '2', name: 'Fitness buster', date: '02/01/2025', status: 'Active'},
  {id: '3', name: 'Gym with mintoo', date: '02/01/2025', status: 'Rejected'},
  {id: '4', name: 'Body builder', date: '02/01/2025', status: 'Pending'},
];

const statusColors = {
  Active: '#4CAF50',
  Rejected: '#E53935',
  Pending: '#F4A026',
};

const GymHistoryScreen = () => {
  const [selectedTab, setSelectedTab] = useState('All Gyms');
  const [isModalVisible, setModalVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredGyms, setFilteredGyms] = useState(gymsData);
  const [confirmationModalVisible, setConfirmationModalVisible] =
    useState(false);
  const [selectedGym, setSelectedGym] = useState(null);
  const navigation = useNavigation();

  const toggleModal = () => {
    setModalVisible(!isModalVisible);
    setSearchQuery('');
    setFilteredGyms(gymsData);
  };

  const handleSearch = text => {
    setSearchQuery(text);
    if (text === '') {
      setFilteredGyms(gymsData);
    } else {
      setFilteredGyms(
        gymsData.filter(gym =>
          gym.name.toLowerCase().includes(text.toLowerCase()),
        ),
      );
    }
  };

  const filteredHistory =
    selectedTab === 'All Gyms'
      ? historyData
      : historyData.filter(gym => gym.status === selectedTab);

  const openConfirmationModal = gymName => {
    setSelectedGym(gymName);
    setConfirmationModalVisible(true);
  };

  const closeConfirmationModal = () => {
    setSelectedGym(null);
    setConfirmationModalVisible(false);
  };

  return (
    <View style={styles.container}>
      <View style={styles.tabsContainer}>
        {['All Gyms', 'Active', 'Pending', 'Rejected'].map(tab => (
          <TouchableOpacity
            key={tab}
            style={[
              styles.tabButton,
              selectedTab === tab ? styles.activeTab : null,
            ]}
            onPress={() => setSelectedTab(tab)}>
            <Text
              style={[
                styles.tabText,
                selectedTab === tab ? styles.activeTabText : null,
              ]}>
              {tab}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <FlatList
        data={filteredHistory}
        keyExtractor={item => item.id}
        renderItem={({item}) => (
          <TouchableOpacity style={styles.card}>
            <SVG.GymIcon />
            <View style={styles.gymInfo}>
              <View>
                <Text style={styles.gymName}>{item.name}</Text>
                <Text style={styles.date}>
                  {item.status === 'Active'
                    ? 'Joined'
                    : item.status === 'Rejected'
                    ? 'Rejected'
                    : 'Requested'}
                  : {item.date}
                </Text>
              </View>
              <View>
                <View
                  style={[
                    styles.statusBadge,
                    {backgroundColor: statusColors[item.status]},
                  ]}>
                  <Text style={styles.statusText}>{item.status}</Text>
                </View>
              </View>
            </View>
          </TouchableOpacity>
        )}
      />

      <TouchableOpacity style={styles.fab} onPress={toggleModal}>
        <SVG.RedPlus />
      </TouchableOpacity>

      <Modal
        visible={isModalVisible}
        transparent
        animationType="slide"
        onRequestClose={toggleModal}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.header}>
              <SVG.Dumbbell />
              <Text style={styles.modalTitle}>Search Gym</Text>
              <TouchableOpacity onPress={toggleModal}>
                <Text style={styles.cancelText}>Cancel</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.searchContainer}>
              <TextInput
                style={styles.searchInput}
                placeholder="Gym"
                placeholderTextColor="#999"
                value={searchQuery}
                onChangeText={handleSearch}
              />
              <View
                style={{
                  position: 'absolute',
                  top: 14,
                  right: 10,
                }}>
                <SVG.SearchIcon />
              </View>
            </View>

            <FlatList
              data={filteredGyms}
              keyExtractor={item => item.id}
              renderItem={({item}) => (
                <TouchableOpacity
                  style={styles.listItem}
                  onPress={() => openConfirmationModal(item.name)}>
                  <Text style={styles.listText}>{item.name}</Text>
                </TouchableOpacity>
              )}
            />
            <Modal
              visible={confirmationModalVisible}
              transparent
              animationType="fade">
              <View style={styles.modalOverlay1}>
                <View style={styles.confirmationModal}>
                  <View
                    style={{
                      borderBottomWidth: 1,
                      borderBottomColor: Colors.litegray,
                    }}>
                    <Text style={styles.confirmationTitle}>
                      Apply for {selectedGym}?
                    </Text>
                    <Text style={styles.confirmationMessage}>
                      If you want to apply for this gym, click Yes below.
                    </Text>
                  </View>
                  <View style={styles.buttonContainer}>
                    <TouchableOpacity
                      onPress={closeConfirmationModal}
                      style={styles.noButton}>
                      <Text style={styles.noText}>No</Text>
                    </TouchableOpacity>
                    <View style={styles.divider} />
                    <TouchableOpacity
                      onPress={() => navigation.goBack()}
                      style={styles.yesButton}>
                      <Text style={styles.yesText}>Yes</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </Modal>
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
    paddingTop: 20,
  },
  tabsContainer: {
    flexDirection: 'row',
    backgroundColor: Colors.white,
    paddingVertical: 10,
    borderRadius: 8,
    margin: 10,
    justifyContent: 'space-between',
    paddingHorizontal: 5,
  },
  tabButton: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    borderRadius: 8,
  },
  activeTab: {
    backgroundColor: Colors.red,
    borderRadius: 10,
  },
  tabText: {
    color: Colors.black,
    fontSize: 14,
  },
  activeTabText: {
    color: Colors.white,
    fontFamily: Fonts.normal,
  },
  card: {
    backgroundColor: Colors.darkGray,
    marginVertical: 6,
    marginHorizontal: 10,
    padding: 15,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  gymInfo: {
    flexDirection: 'row',
    flex: 1,
    justifyContent: 'space-between',
  },
  gymName: {
    color: Colors.white,
    fontSize: 16,
  },
  date: {
    color: Colors.gray,
    fontSize: 12,
    marginTop: 2,
  },
  statusBadge: {
    paddingVertical: 5,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  statusText: {
    color: Colors.white,
    fontSize: 12,
    fontFamily: Fonts.normal,
  },
  fab: {
    position: 'absolute',
    bottom: 20,
    right: 15,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.8)',
  },
  modalContent: {
    backgroundColor: Colors.white,
    padding: 20,
    borderRadius: 15,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  cancelText: {
    color: Colors.gray,
    fontSize: 16,
  },
  searchContainer: {
    backgroundColor: Colors.litegray,
    borderRadius: 10,
    paddingHorizontal: 10,
    marginTop: 20,
  },
  searchInput: {
    fontSize: 16,
    color: Colors.black,
  },
  listItem: {
    paddingVertical: 15,
  },
  listText: {
    fontSize: 16,
    color: Colors.gray,
  },
  modalOverlay1: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
    padding: 60,
  },
  confirmationModal: {
    backgroundColor: Colors.white,
    borderRadius: 14,
  },
  confirmationTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
    paddingTop: 10,
  },
  confirmationMessage: {
    fontSize: 12,
    color: Colors.black,
    textAlign: 'center',
    marginBottom: 20,
    paddingHorizontal: 15,
  },
  buttonContainer: {
    flexDirection: 'row',
  },
  noButton: {
    flex: 1,
    alignItems: 'center',
    padding: 10,
  },
  noText: {
    color: Colors.red,
    fontSize: 17,
    fontFamily: Fonts.normal,
  },
  yesButton: {
    flex: 1,
    alignItems: 'center',
    padding: 10,
  },
  yesText: {
    color: Colors.black,
    fontSize: 17,
    fontFamily: Fonts.normal,
  },
  divider: {
    width: 1,
    backgroundColor: Colors.litegray,
  },
});

export default GymHistoryScreen;
