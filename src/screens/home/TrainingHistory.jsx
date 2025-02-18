import React, {useState} from 'react';
import {
  View,
  Text,
  FlatList,
  TextInput,
  TouchableOpacity,
  Modal,
  StyleSheet,
} from 'react-native';
import SVG from '../../assets/svg';
import Colors from '../../theme/color';
import {Fonts} from '../../assets/fonts';
import {hp, wp} from '../../utility/ResponseUI';

const sessions = [
  {
    id: '1',
    type: 'Gi',
    icon: <SVG.Count2 />,
    title: 'It is a long established fact that a reader will be more...',
    date: '12/17/2024',
    duration: '30 Minutes',
    rounds: 2,
    partners: 3,
    status: 'Active',
  },
  {
    id: '2',
    type: 'No Gi',
    icon: <SVG.Count10 />,
    title: 'It is a long established fact that a reader will be more...',
    date: '12/17/2024',
    duration: '30 Minutes',
    rounds: 2,
    partners: 3,
    status: 'Pending',
  },
  {
    id: '3',
    type: 'Gi',
    icon: <SVG.Count2 />,
    title: 'It is a long established fact that a reader will be more...',
    date: '12/17/2024',
    duration: '30 Minutes',
    rounds: 2,
    partners: 3,
    status: 'Rejected',
  },
];

const TrainingScreen = () => {
  const [selectedSession, setSelectedSession] = useState(null);

  const openModal = session => {
    setSelectedSession(session);
  };

  const closeModal = () => {
    setSelectedSession(null);
  };

  const renderItem = ({item}) => {
    return (
      <TouchableOpacity
        style={styles.sessionContainer}
        onPress={() => openModal(item)}>
        <View style={styles.sessionHeader}>
          <View style={styles.iconWrapper}>
            <View style={styles.main}>
              <View style={styles.main1}>
                <Text>{item.icon}</Text>
              </View>
              <Text style={styles.sessionTitle}>{item.type}</Text>
            </View>
            <View style={styles.titleView}>
              <SVG.SolarNotes />
              <Text style={styles.title}>{item.title}</Text>
            </View>
          </View>
          <View style={styles.sessionDetails}>
            <View style={styles.titleView}>
              <SVG.UilCalender />
              <Text style={styles.detailText}>{item.date}</Text>
            </View>
            <View style={styles.titleView}>
              <SVG.Time />
              <Text style={styles.detailText}>{item.duration}</Text>
            </View>
            <View style={styles.titleView}>
              <SVG.Rounds />
              <Text style={styles.detailText}>Rounds {item.rounds}</Text>
            </View>
            <View style={styles.titleView}>
              <SVG.Exchange />
              <Text style={styles.detailText}>Partners {item.partners}</Text>
            </View>
            <View style={styles.titleView}>
              <SVG.Gym1 />
              <Text style={styles.statusText}>{item.status}</Text>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.filterBar}>
        <TouchableOpacity style={styles.filterButton}>
          <Text style={styles.filterText}>12/17/2024</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.filterButton}>
          <Text style={styles.filterText}>12/17/2024</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.filterButton}>
          <Text style={styles.filterText}>Gym</Text>
        </TouchableOpacity>
        <TextInput
          style={styles.searchBar}
          placeholder="Search"
          placeholderTextColor="#ccc"
        />
      </View>

      <FlatList
        data={sessions}
        keyExtractor={item => item.id}
        renderItem={renderItem}
      />

      {selectedSession && (
        <Modal
          visible={!!selectedSession}
          animationType="slide"
          transparent={true}
          onRequestClose={closeModal}>
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <TouchableOpacity
                style={styles.closeIconContainer}
                onPress={closeModal}>
                <SVG.CrossIcon />
              </TouchableOpacity>
              <View style={styles.main}>
                <View style={styles.main1}>
                  <Text>{selectedSession.icon}</Text>
                </View>
                <Text style={styles.modalTitle}>{selectedSession.type}</Text>
              </View>
              <View style={styles.sessionList}>
                <View style={styles.sessionList1}>
                  <SVG.UilCalender />
                  <Text style={styles.modalText}>{selectedSession.date}</Text>
                </View>
                <View style={styles.sessionList1}>
                  <SVG.Time />
                  <Text style={styles.modalText}>
                    {selectedSession.duration}
                  </Text>
                </View>
                <View style={styles.sessionList1}>
                  <SVG.Rounds />
                  <Text style={styles.modalText}>
                    Rounds {selectedSession.rounds}
                  </Text>
                </View>
              </View>
              <View style={styles.sessionList1}>
                <SVG.Exchange />
                <Text style={styles.modalText}>
                  Partners: {selectedSession.partners}
                </Text>
              </View>
              <View style={styles.sessionList1}>
                <SVG.SolarNotes />
                <Text style={styles.modalText}>{selectedSession.title}</Text>
              </View>

              <View style={styles.btnView}>
                <TouchableOpacity
                  style={styles.closeButton}
                  onPress={closeModal}>
                  <Text style={styles.closeButtonText}>Close</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.editButton}
                  onPress={closeModal}>
                  <Text style={styles.editButtonText}>Edit</Text>
                  <SVG.IconEdit1 />
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.black,
    padding: 10,
    gap: 20,
  },
  filterBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 5,
  },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    padding: 10,
    borderRadius: 5,
  },
  title: {
    fontSize: 12,
    color: Colors.gray,
  },
  filterText: {
    color: Colors.black,
    marginLeft: 5,
  },
  searchBar: {
    flex: 1,
    backgroundColor: Colors.white,
    padding: 10,
    borderRadius: 5,
    color: Colors.darkGray,
  },
  sessionContainer: {
    backgroundColor: Colors.white,
    padding: 20,
    marginVertical: 5,
    borderRadius: 16,
  },
  sessionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  sessionList: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 10,
  },
  sessionList1: {
    flexDirection: 'row',
    gap: 5,
    alignItems: 'center',
  },
  iconWrapper: {
    flex: 1,
    gap: 15,
  },
  iconContainer: {
    padding: 5,
    borderRadius: 8,
    marginRight: 10,
  },
  sessionTitle: {
    fontSize: 16,
    color: Colors.black,
    fontFamily: Fonts.normal,
  },
  sessionDetails: {
    flex: 1,
    left: 80,
  },
  detailText: {
    color: Colors.gray,
    marginBottom: 5,
    fontSize: 12,
  },
  statusText: {
    marginBottom: 5,
    color: Colors.gray,
    fontSize: 12,
  },
  main: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  main1: {
    backgroundColor: 'red',
    height: 36,
    width: 36,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    borderRadius: 4,
  },
  titleView: {
    flexDirection: 'row',
    gap: 5,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.8)',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: Colors.white,
    padding: 20,
    borderRadius: 16,
  },
  modalTitle: {
    fontSize: 16,
    marginBottom: 10,
    color: Colors.black,
    fontFamily: Fonts.normal,
    marginTop: 7,
  },
  modalText: {
    fontSize: 14,
    color: Colors.gray,
    marginBottom: 5,
    marginVertical: 10,
  },
  btnView: {
    flexDirection: 'row',
    gap: 16,
    justifyContent: 'flex-end',
    marginTop: 30,
  },
  closeIconContainer: {
    position: 'absolute',
    top: 10,
    right: 10,
    padding: 5,
  },
  closeButton: {
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: Colors.red,
    width: wp((77 / 430) * 100),
    height: hp((40 / 919) * 100),
  },
  closeButtonText: {
    color: Colors.red,
    fontSize: 16,
  },
  editButton: {
    borderRadius: 8,
    alignItems: 'center',
    backgroundColor: Colors.black,
    width: wp((93 / 430) * 100),
    height: hp((40 / 919) * 100),
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 5,
  },
  editButtonText: {
    color: Colors.white,
    fontSize: 16,
  },
});

export default TrainingScreen;
