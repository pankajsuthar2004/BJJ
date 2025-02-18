import React, {useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  Modal,
  TextInput,
  ScrollView,
} from 'react-native';
import CalendarStrip from 'react-native-calendar-strip';
import Colors from '../../theme/color';
import SVG from '../../assets/svg';
import {Fonts} from '../../assets/fonts';
import moment from 'moment';

const classes = [
  {id: '1', name: 'Gi class', color: Colors.green},
  {id: '2', name: 'No Gi class', color: Colors.yellow},
  {id: '3', name: 'Open Mat class', color: Colors.red},
  {id: '4', name: 'Competition class', color: Colors.white},
];

const TimeTableScreen = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [addClassModalVisible, setAddClassModalVisible] = useState(false);
  const [className, setClassName] = useState('');
  const [selectedClass, setSelectedClass] = useState(null);
  const [showClassDropdown, setShowClassDropdown] = useState(false);
  const [recurringDays, setRecurringDays] = useState([
    'Every Monday',
    'Every Friday',
  ]);
  const [startTime, setStartTime] = useState('12:30 PM');
  const [endTime, setEndTime] = useState('4:30 PM');
  const [showStartTimePicker, setShowStartTimePicker] = useState(false);
  const [showEndTimePicker, setShowEndTimePicker] = useState(false);
  const [description, setDescription] = useState('');
  const [selectedDate, setSelectedDate] = useState(moment());
  const [currentMonth, setCurrentMonth] = useState(moment());

  const goToPreviousMonth = () => {
    const newMonth = moment(currentMonth).subtract(1, 'months');
    setCurrentMonth(newMonth);
    setSelectedDate(moment(newMonth).startOf('month'));
  };

  const goToNextMonth = () => {
    const newMonth = moment(currentMonth).add(1, 'months');
    setCurrentMonth(newMonth);
    setSelectedDate(moment(newMonth).startOf('month'));
  };

  return (
    <View style={styles.container}>
      <View>
        <CalendarStrip
          scrollable
          style={styles.calendarStrip}
          calendarColor={Colors.black}
          calendarHeaderStyle={{color: Colors.white, fontSize: 20}}
          dateNumberStyle={{color: Colors.white}}
          dateNameStyle={{color: Colors.white}}
          highlightDateContainerStyle={{
            backgroundColor: Colors.red,
            borderRadius: 8,
          }}
          selectedDate={selectedDate}
        />
        <TouchableOpacity
          style={{position: 'absolute', left: 8, top: 11}}
          onPress={goToPreviousMonth}>
          <SVG.IconRight />
        </TouchableOpacity>
        <TouchableOpacity
          style={{position: 'absolute', right: 8, top: 11}}
          onPress={goToNextMonth}>
          <SVG.IconLeft />
        </TouchableOpacity>

        <FlatList
          data={classes}
          keyExtractor={item => item.id}
          renderItem={({item}) => (
            <TouchableOpacity
              style={[styles.classItem, {backgroundColor: item.color}]}>
              <Text
                style={[
                  styles.classText,
                  {
                    color: item.id === '4' ? Colors.black : Colors.white,
                  },
                ]}>
                {item.name}
              </Text>
            </TouchableOpacity>
          )}
        />

        <TouchableOpacity
          style={styles.addClass}
          onPress={() => setModalVisible(true)}>
          <Text style={styles.addClassText}>Add New Class</Text>
        </TouchableOpacity>

        <Modal animationType="slide" transparent={true} visible={modalVisible}>
          <View style={styles.modalOverlay}>
            <View style={styles.modalContainer}>
              <ScrollView showsVerticalScrollIndicator={false}>
                <Text style={styles.label}>Class Name</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Enter class name"
                  placeholderTextColor="#aaa"
                  value={className}
                  onChangeText={setClassName}
                />

                <Text style={styles.label}>Select Class</Text>
                <TouchableOpacity
                  style={[
                    styles.dropdown,
                    showClassDropdown && styles.selectedDropdown,
                  ]}
                  onPress={() => setShowClassDropdown(!showClassDropdown)}>
                  <Text>{selectedClass || 'Class Type'}</Text>
                  <SVG.SmallArrow />
                </TouchableOpacity>
                {showClassDropdown && (
                  <View style={styles.dropdownList}>
                    {classes.map(item => (
                      <TouchableOpacity
                        key={item.id}
                        style={[
                          styles.dropdownItem,
                          selectedClass === item.name && styles.selectedItem,
                        ]}
                        onPress={() => {
                          setSelectedClass(item.name);
                          setShowClassDropdown(false);
                        }}>
                        <Text>{item.name}</Text>
                      </TouchableOpacity>
                    ))}
                    <TouchableOpacity
                      style={{
                        backgroundColor: Colors.red,
                        padding: 13,
                        borderRadius: 8,
                        alignItems: 'center',
                        margin: 8,
                      }}
                      onPress={() => setAddClassModalVisible(true)}>
                      <Text
                        style={{
                          fontSize: 16,
                          color: Colors.white,
                          fontFamily: Fonts.normal,
                        }}>
                        Add New Class
                      </Text>
                    </TouchableOpacity>
                  </View>
                )}

                <Text style={styles.label}>Class Recurring</Text>
                <View style={styles.recurringContainer}>
                  {recurringDays.map((day, index) => (
                    <TouchableOpacity
                      key={index}
                      style={styles.recurringButton}>
                      <Text style={styles.recurringText}>{day}</Text>
                    </TouchableOpacity>
                  ))}
                  <TouchableOpacity>
                    <SVG.SmallRed />
                  </TouchableOpacity>
                </View>

                <Text style={styles.label}>Select Timing</Text>
                <View style={styles.timeSelection}>
                  <TouchableOpacity
                    style={styles.timePicker}
                    onPress={() =>
                      setShowStartTimePicker(!showStartTimePicker)
                    }>
                    <SVG.Times />
                    <Text style={styles.timeText}>{startTime}</Text>
                  </TouchableOpacity>
                  <View style={{flex: 1, alignItems: 'center'}}>
                    <SVG.ArrowUp />
                  </View>
                  <TouchableOpacity
                    style={styles.timePicker}
                    onPress={() => setShowEndTimePicker(!showEndTimePicker)}>
                    <SVG.Times />
                    <Text style={styles.timeText}>{endTime}</Text>
                  </TouchableOpacity>
                </View>
                <View style={{flexDirection: 'row', gap: 20}}>
                  <View style={{flex: 1}}>
                    {showStartTimePicker && (
                      <View style={styles.timeDropdown}>
                        {[
                          '12:00 PM',
                          '12:30 PM',
                          '1:00 PM',
                          '1:30 PM',
                          '2:00 PM',
                          '2:30 PM',
                        ].map((time, index) => (
                          <TouchableOpacity
                            key={index}
                            style={styles.timeList}
                            onPress={() => {
                              setStartTime(time);
                              setShowStartTimePicker(false);
                            }}>
                            <Text>{time}</Text>
                          </TouchableOpacity>
                        ))}
                      </View>
                    )}
                  </View>
                  <View style={{flex: 1}}>
                    {showEndTimePicker && (
                      <View style={styles.timeDropdown}>
                        {[
                          '4:00 PM',
                          '4:30 PM',
                          '5:10 PM',
                          '5:45 PM',
                          '6:15 PM',
                          '8:08 PM',
                        ].map((time, index) => (
                          <TouchableOpacity
                            key={index}
                            style={styles.timeList}
                            onPress={() => {
                              setEndTime(time);
                              setShowEndTimePicker(false);
                            }}>
                            <Text>{time}</Text>
                          </TouchableOpacity>
                        ))}
                      </View>
                    )}
                  </View>
                </View>

                <Text style={styles.label}>Description</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Optional..."
                  placeholderTextColor="#aaa"
                  value={description}
                  onChangeText={setDescription}
                />

                <View style={styles.modalButtons}>
                  <TouchableOpacity
                    style={styles.cancelButton}
                    onPress={() => setModalVisible(false)}>
                    <Text style={styles.cancelText}>Cancel</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.addClassButton}
                    onPress={() => {
                      setModalVisible(false);
                    }}>
                    <Text style={styles.addClassButtonText}>Add Class</Text>
                  </TouchableOpacity>
                </View>
              </ScrollView>
            </View>
          </View>
        </Modal>

        <Modal
          animationType="slide"
          transparent={true}
          visible={addClassModalVisible}>
          <View style={styles.modalOverlay1}>
            <View style={styles.modalContainer}>
              <ScrollView showsVerticalScrollIndicator={false}>
                <Text style={styles.label}>New Class</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Enter new class details"
                  placeholderTextColor="#aaa"
                />
                <View style={styles.modalButtons}>
                  <TouchableOpacity
                    style={styles.cancelButton}
                    onPress={() => setAddClassModalVisible(false)}>
                    <Text style={styles.cancelText}>Cancel</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.addClassButton}
                    onPress={() => setAddClassModalVisible(false)}>
                    <Text style={styles.addClassButtonText}>Add Class</Text>
                  </TouchableOpacity>
                </View>
              </ScrollView>
            </View>
          </View>
        </Modal>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.black,
    padding: 16,
  },
  calendarStrip: {
    height: 100,
    paddingVertical: 10,
  },
  headerContainer: {
    alignItems: 'center',
    paddingVertical: 10,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  monthText: {
    fontSize: 18,
    color: Colors.white,
  },
  navButton: {
    fontSize: 30,
    color: Colors.white,
    marginHorizontal: 20,
  },
  classItem: {
    padding: 15,
    borderRadius: 8,
    marginVertical: 5,
  },
  classText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.black,
  },
  addClass: {
    borderWidth: 1,
    borderColor: Colors.white,
    borderStyle: 'dashed',
    padding: 15,
    alignItems: 'center',
    marginTop: 20,
    borderRadius: 8,
  },
  addClassText: {
    color: Colors.white,
    fontSize: 16,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.8)',
    justifyContent: 'flex-end',
  },
  modalOverlay1: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.8)',
    justifyContent: 'center',
    padding: 20,
  },
  modalContainer: {
    backgroundColor: Colors.white,
    padding: 20,
    borderRadius: 10,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginVertical: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: Colors.litegray,
    padding: 10,
    borderRadius: 8,
  },
  dropdown: {
    padding: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.litegray,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  selectedDropdown: {
    backgroundColor: Colors.litegray,
  },
  dropdownList: {
    backgroundColor: Colors.litegray,
    borderRadius: 8,
  },
  dropdownItem: {
    padding: 10,
    borderBottomWidth: 0.8,
    borderBottomColor: Colors.gray,
  },
  selectedItem: {
    backgroundColor: Colors.litegray,
  },
  recurringContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 10,
  },
  recurringButton: {
    backgroundColor: Colors.black,
    padding: 8,
    borderRadius: 50,
    marginRight: 10,
  },
  recurringText: {
    color: Colors.white,
    fontSize: 12,
    fontFamily: Fonts.normal,
  },
  modalButtons: {
    flexDirection: 'row',
    marginTop: 20,
    justifyContent: 'flex-end',
    gap: 8,
  },
  cancelButton: {
    borderWidth: 1,
    borderColor: Colors.red,
    padding: 10,
    borderRadius: 6,
  },
  cancelText: {
    color: Colors.red,
  },
  addClassButton: {
    backgroundColor: Colors.black,
    padding: 10,
    borderRadius: 6,
  },
  addClassButtonText: {
    color: Colors.white,
  },
  timeDropdown: {
    borderWidth: 1,
    borderRadius: 16,
    borderColor: Colors.litegray,
  },
  timeSelection: {
    flexDirection: 'row',
    gap: 5,
  },
  timePicker: {
    flexDirection: 'row',
    flex: 1,
  },
  timeText: {
    fontSize: 16,
  },
  timeList: {
    margin: 5,
  },
});

export default TimeTableScreen;
