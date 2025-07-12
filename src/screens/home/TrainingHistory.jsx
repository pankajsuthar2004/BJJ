import React, {useEffect, useState} from 'react';
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
import {Calendar} from 'react-native-calendars';
import moment from 'moment';
import makeRequest from '../../api/http';
import {EndPoints} from '../../api/config';
import {showToast} from '../../utility/Toast';

const TrainingScreen = () => {
  const [sessions, setSessions] = useState([]);
  const [selectedSession, setSelectedSession] = useState(null);
  const [selectedDate, setSelectedDate] = useState('2025-01-01');
  const [selectedEndDate, setSelectedEndDate] = useState('2025-01-01');
  const [calendarVisible, setCalendarVisible] = useState(false);
  const [calendarEndVisible, setCalendarEndVisible] = useState(false);
  const [searchText, setSearchText] = useState('');

  useEffect(() => {
    fetchTrainingLogs();
  }, [selectedDate, selectedEndDate, searchText]);

  const fetchTrainingLogs = async () => {
    try {
      const formattedDate = moment(selectedDate).format('YYYY-MM-DD');
      const formatedEndDate = moment(selectedEndDate).format('YYYY-MM-DD');
      const response = await makeRequest({
        endPoint: `${EndPoints.UserTrainingLogs}?start_date=${formattedDate}&end_date=${formatedEndDate}`,
        method: 'GET',
      });
      console.log('Training logs response:', response);

      setSessions(response);
    } catch (error) {
      console.error('Training logs fetch error:', error);
      showToast('Error fetching training logs');
    }
  };

  const handleDateSelect = (day, isEndDate = false) => {
    if (isEndDate) {
      setSelectedEndDate(day.dateString);
      setCalendarEndVisible(false);
    } else {
      setSelectedDate(day.dateString);
      setCalendarVisible(false);
    }
  };

  const openModal = session => setSelectedSession(session);
  const closeModal = () => setSelectedSession(null);

  const renderItem = ({item}) => {
    const uniquePartners =
      item.rounds
        ?.flatMap(round => round.sparring_partners || [])
        .filter(
          (v, i, arr) => v?.id && arr.findIndex(p => p?.id === v?.id) === i,
        ) || [];

    return (
      <TouchableOpacity
        style={styles.sessionContainer}
        onPress={() => openModal(item)}>
        <View style={styles.sessionHeader}>
          <View style={styles.iconWrapper}>
            <View style={styles.main}>
              <View style={styles.main1}>
                <SVG.Count2 />
              </View>
              <Text style={styles.sessionTitle}>
                {item.training_type?.type || 'Gi'}
              </Text>
            </View>
            <View style={styles.titleView}>
              <SVG.SolarNotes />
              <Text style={styles.title}>{item.learnings || 'No notes'}</Text>
            </View>
          </View>
          <View style={styles.sessionDetails}>
            <View style={styles.titleView}>
              <SVG.UilCalender />
              <Text style={styles.detailText}>{item.date || 'N/A'}</Text>
            </View>
            <View style={styles.titleView}>
              <SVG.Time />
              <Text style={styles.detailText}>
                {item.duration ? `${item.duration} mins` : 'N/A'}
              </Text>
            </View>
            <View style={styles.titleView}>
              <SVG.Rounds />
              <Text style={styles.detailText}>
                Rounds {item.rounds?.length || 0}
              </Text>
            </View>
            <View style={styles.titleView}>
              <SVG.Exchange />
              <Text style={styles.detailText}>
                Partners {uniquePartners.length}
              </Text>
            </View>
            <View style={styles.titleView}>
              <SVG.Gym1 />
              <Text style={styles.statusText}>{item.gym?.name || 'N/A'}</Text>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.filterBar}>
        <View style={styles.filterItem}>
          <TouchableOpacity
            style={styles.filterButton}
            onPress={() => setCalendarVisible(true)}>
            <Text style={styles.filterText}>{selectedDate}</Text>
            <SVG.MiniCalendar />
          </TouchableOpacity>
        </View>

        <View style={styles.filterItem}>
          <TouchableOpacity
            style={styles.filterButton}
            onPress={() => setCalendarEndVisible(true)}>
            <Text style={styles.filterText}>{selectedEndDate}</Text>
            <SVG.MiniCalendar />
          </TouchableOpacity>
        </View>

        <View style={styles.filterItem}>
          <TouchableOpacity style={styles.filterButton}>
            <Text style={styles.filterText}>Gym</Text>
            <SVG.ArrowIcon />
          </TouchableOpacity>
        </View>
      </View>

      <View>
        <TextInput
          style={styles.searchBar}
          placeholder="Search"
          placeholderTextColor="gray"
          multiline={false}
          value={searchText}
          onChangeText={text => setSearchText(text)}
        />
        <SVG.SearchIcon style={{position: 'absolute', right: 10, top: 11}} />
      </View>
      <Modal visible={calendarVisible} transparent animationType="slide">
        <View style={styles.modalOverlay1}>
          <View style={styles.calendarContainer1}>
            <Calendar
              onDayPress={day => handleDateSelect(day)}
              markedDates={{[selectedDate]: {selected: true}}}
              theme={{selectedDayBackgroundColor: Colors.black}}
            />
          </View>
        </View>
      </Modal>
      <Modal visible={calendarEndVisible} transparent animationType="slide">
        <View style={styles.modalOverlay1}>
          <View style={styles.calendarContainer1}>
            <Calendar
              onDayPress={day => handleDateSelect(day, true)}
              markedDates={{[selectedEndDate]: {selected: true}}}
              theme={{selectedDayBackgroundColor: Colors.black}}
            />
          </View>
        </View>
      </Modal>

      <FlatList
        data={sessions.filter(item =>
          item.training_type?.type
            ?.toLowerCase()
            .includes(searchText.toLowerCase()),
        )}
        keyExtractor={item => item.id?.toString()}
        renderItem={renderItem}
        ListEmptyComponent={
          <Text
            style={{
              color: Colors.white,
              textAlign: 'center',
              marginTop: 20,
              fontSize: 16,
            }}>
            No training sessions found...
          </Text>
        }
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
                  <SVG.Count2 />
                </View>
                <Text style={styles.modalTitle}>
                  {selectedSession.training_type?.type || 'Training'}
                </Text>
              </View>

              <View style={styles.sessionList}>
                <View style={styles.sessionList1}>
                  <SVG.UilCalender />
                  <Text style={styles.modalText}>
                    {selectedSession.date || 'N/A'}
                  </Text>
                </View>
                <View style={styles.sessionList1}>
                  <SVG.Time />
                  <Text style={styles.modalText}>
                    {selectedSession.duration
                      ? `${selectedSession.duration} mins`
                      : 'N/A'}
                  </Text>
                </View>
                <View style={styles.sessionList1}>
                  <SVG.Rounds />
                  <Text style={styles.modalText}>
                    Rounds {selectedSession.rounds?.length || 0}
                  </Text>
                </View>
              </View>

              <View style={styles.sessionList1}>
                <SVG.Exchange />
                <Text style={styles.modalText}>
                  Partners:{' '}
                  {selectedSession.rounds
                    ?.flatMap(round => round.sparring_partners || [])
                    .map(partner => partner?.name)
                    .filter(
                      (name, index, arr) =>
                        !!name && arr.indexOf(name) === index,
                    )
                    .join(', ') || 'N/A'}
                </Text>
              </View>

              <View style={styles.sessionList1}>
                <SVG.SolarNotes />
                <Text style={styles.modalText}>
                  {selectedSession.learnings || 'No notes'}
                </Text>
              </View>
              <View style={styles.sessionList1}>
                <SVG.Gym1 />
                <Text style={styles.modalText}>
                  {selectedSession.gym?.name || 'N/A'}
                </Text>
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
    alignItems: 'center',
    gap: wp(2),
    marginBottom: -10,
  },

  filterItem: {
    flex: 1,
  },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Colors.white,
    paddingVertical: hp(1),
    paddingHorizontal: wp(3),
    borderRadius: 5,
    width: '100%',
  },
  title: {
    fontSize: 12,
    color: Colors.gray,
  },
  filterText: {
    color: Colors.black,
    fontSize: 14,
  },
  searchBar: {
    backgroundColor: Colors.white,
    paddingRight: 25,
    paddingLeft: 10,
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
    left: 40,
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
  modalOverlay1: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.8)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  calendarContainer1: {
    backgroundColor: Colors.white,
    padding: 20,
    borderRadius: 16,
    width: '90%',
  },
});

export default TrainingScreen;
