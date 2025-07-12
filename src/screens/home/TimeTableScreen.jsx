import React, {useEffect, useState} from 'react';
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
import {Fonts} from '../../assets/fonts';
import moment from 'moment';
import SVG from '../../assets/svg';
import makeRequest from '../../api/http';
import {EndPoints} from '../../api/config';
import {showToast} from '../../utility/Toast';

const capitalize = str =>
  str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();

const TimeTableScreen = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [addClassModalVisible, setAddClassModalVisible] = useState(false);
  const [className, setClassName] = useState('');
  const [selectedClass, setSelectedClass] = useState(null);
  const [newClassTypeName, setNewClassTypeName] = useState('');
  const [showClassDropdown, setShowClassDropdown] = useState(false);
  const [recurringDays, setRecurringDays] = useState([]);
  const [startTime, setStartTime] = useState('12:30 PM');
  const [endTime, setEndTime] = useState('4:30 PM');
  const [showStartTimePicker, setShowStartTimePicker] = useState(false);
  const [showEndTimePicker, setShowEndTimePicker] = useState(false);
  const [description, setDescription] = useState('');
  const [selectedDate, setSelectedDate] = useState(moment());
  const [currentMonth, setCurrentMonth] = useState(moment());
  const [selectedStartTime, setSelectedStartTime] = useState(null);
  const [selectedEndTime, setSelectedEndTime] = useState(null);
  const [classes, setClasses] = useState([]);
  const [editingClassId, setEditingClassId] = useState(null);
  const [trainingTypes, setTrainingTypes] = useState([]);
  const [currentDayIndex, setCurrentDayIndex] = useState(0);

  const daysOfWeek = [
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
    'Sunday',
  ];

  useEffect(() => {
    fetchClasses();
    fetchTrainingTypes();
  }, []);

  const handleSelectRecurringDay = day => {
    setRecurringDays(prev =>
      prev.includes(day) ? prev.filter(d => d !== day) : [...prev, day],
    );
  };

  const fetchClasses = async () => {
    try {
      const response = await makeRequest({
        endPoint: EndPoints.ClassList,
        method: 'GET',
      });

      const data = response;
      if (Array.isArray(data)) {
        if (data.length === 0) {
          setClasses([]);
        } else {
          const formatted = data.map(item => ({
            id: item?.id?.toString(),
            name: item?.class_name,
            time: `${item?.start_time} - ${item?.end_time}`,
            color: item?.color || Colors.green,
            start_time: item?.start_time,
            end_time: item?.end_time,
            training_type_id: item?.training_type_id,
            class_days: item?.days,
            description: item?.description || '',
          }));

          setClasses(formatted);
        }
      } else {
        showToast({message: 'Invalid class data format', type: 'error'});
      }
    } catch (error) {
      showToast({message: 'Failed to fetch class list', type: 'error'});
    }
  };

  const fetchTrainingTypes = async () => {
    try {
      const response = await makeRequest({
        endPoint: EndPoints.TrainingType,
        method: 'GET',
      });

      if (Array.isArray(response)) {
        const normalized = response.map(item => ({
          id: item.id,
          name: item.type,
        }));
        setTrainingTypes(normalized);
      } else {
        showToast({message: 'Invalid training types data', type: 'error'});
      }
    } catch (error) {
      console.log('fetchTrainingTypes error:', error);
      showToast({message: 'Error loading training types', type: 'error'});
    }
  };

  const renderClassDropdownItems = () => {
    if (!showClassDropdown) return null;
    return trainingTypes.map(item => (
      <TouchableOpacity
        key={item.id}
        style={[
          styles.dropdownItem,
          selectedClass?.id === item.id && styles.selectedItem,
        ]}
        onPress={() => {
          setSelectedClass({id: item?.id, name: item?.name});
          setShowClassDropdown(false);
        }}>
        <Text>{item?.name}</Text>
      </TouchableOpacity>
    ));
  };

  const resetForm = () => {
    setClassName('');
    setSelectedClass(null);
    setRecurringDays([]);
    setStartTime('12:30 PM');
    setEndTime('4:30 PM');
    setDescription('');
    setShowStartTimePicker(false);
    setShowEndTimePicker(false);
    setSelectedStartTime(null);
    setSelectedEndTime(null);
    setEditingClassId(null);
    setCurrentDayIndex(0);
    setShowClassDropdown(false);
  };

  const formatTime = timeStr => moment(timeStr, ['h:mm A']).format('HH:mm');

  const submitNewClassToAPI = async () => {
    try {
      const formattedDays = recurringDays.map(day =>
        day.replace('Every ', '').trim(),
      );

      const payload = {
        class_name: className,
        training_type_id: selectedClass?.id,
        class_days: formattedDays,
        start_time: formatTime(startTime),
        end_time: formatTime(endTime),
        description,
      };

      console.log('Payload:', payload);

      const response = await makeRequest({
        endPoint: EndPoints.ClassStore,
        method: 'POST',
        body: payload,
      });

      console.log('Response:', response);

      if (response && response.id) {
        showToast({message: 'Class added successfully', type: 'success'});
        setModalVisible(false);
        fetchClasses();
        resetForm();
      } else {
        showToast({
          message: response?.message || 'Failed to add class',
          type: 'error',
        });
      }
    } catch (error) {
      console.log('Error:', error);
      showToast({message: 'Error submitting class', type: 'error'});
    }
  };

  const updateClass = async () => {
    try {
      const formattedDays = recurringDays.map(day => day.replace('Every ', ''));

      const payload = {
        id: editingClassId,
        class_name: className,
        training_type_id: selectedClass?.id,
        class_days: formattedDays,
        start_time: formatTime(startTime),
        end_time: formatTime(endTime),
        description,
      };

      const response = await makeRequest({
        endPoint: EndPoints.ClassUpdate,
        method: 'POST',
        body: payload,
      });

      if (response?.id) {
        showToast({message: 'Class updated successfully', type: 'success'});
        setModalVisible(false);
        fetchClasses();
        resetForm();
      } else {
        showToast({
          message: response.message || 'Failed to update class',
          type: 'error',
        });
      }
    } catch (error) {
      showToast({message: 'Error updating class', type: 'error'});
    }
  };

  const handleAddNewClass = () => {
    if (!className.trim()) {
      showToast({message: 'Class name is required', type: 'error'});
      return;
    }
    if (!selectedClass) {
      showToast({message: 'Select a class type', type: 'error'});
      return;
    }
    if (recurringDays.length === 0) {
      showToast({
        message: 'Please select at least one recurring day',
        type: 'error',
      });
      return;
    }

    if (editingClassId) {
      updateClass();
    } else {
      submitNewClassToAPI();
    }
  };

  const handleEditClass = classItem => {
    resetForm();
    setEditingClassId(classItem.id);
    setClassName(classItem.name);

    const matchedType = trainingTypes.find(
      t => t.id === classItem.training_type_id,
    );
    if (matchedType) {
      setSelectedClass(matchedType);
    } else {
      setSelectedClass({id: classItem.training_type_id, name: 'Unknown Type'});
    }

    const formattedStart = moment(classItem.start_time, 'HH:mm').format(
      'h:mm A',
    );
    const formattedEnd = moment(classItem.end_time, 'HH:mm').format('h:mm A');
    setStartTime(formattedStart);
    setEndTime(formattedEnd);
    setSelectedStartTime(formattedStart);
    setSelectedEndTime(formattedEnd);

    if (classItem && Array.isArray(classItem.class_days)) {
      const formattedDays = daysOfWeek.filter(day =>
        classItem.class_days.some(
          d => d?.class_day && day.toLowerCase() === d.class_day.toLowerCase(),
        ),
      );
      setRecurringDays(formattedDays);
    } else {
      console.warn('classItem is not properly defined:', classItem);
    }

    // console.log('formattedDays', formattedDays);
    // setRecurringDays(formattedDays);
    // setRecurringDays(formattedDays);

    setDescription(classItem.description || '');
    setModalVisible(true);
  };

  const handleAddClassType = () => {
    if (!newClassTypeName.trim()) {
      showToast({message: 'Please enter class name', type: 'error'});
      return;
    }

    const newType = {
      id: Date.now(),
      name: newClassTypeName,
    };
    setSelectedClass(newType);
    setNewClassTypeName('');
    setAddClassModalVisible(false);
    showToast({message: 'Class type added and selected', type: 'success'});
  };

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

  const handleAddRecurringClass = () => {
    if (currentDayIndex < daysOfWeek.length) {
      setRecurringDays(prev => [...prev, daysOfWeek[currentDayIndex]]);
      setCurrentDayIndex(currentDayIndex + 1);
    }
  };

  return (
    <ScrollView style={styles.container}>
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
              style={[styles.classItem, {backgroundColor: item.color}]}
              onPress={() => handleEditClass(item)}>
              <Text
                style={[
                  styles.classText,
                  {color: item.id === '4' ? Colors.black : Colors.white},
                ]}>
                {item.name}
              </Text>
              <Text
                style={[
                  styles.classText1,
                  {color: item.id === '4' ? Colors.black : Colors.white},
                ]}>
                {item.time}
              </Text>
            </TouchableOpacity>
          )}
        />

        <TouchableOpacity
          style={styles.addClass}
          onPress={() => {
            resetForm(); // ✅ Clear any previous values
            setModalVisible(true);
          }}>
          <Text style={styles.addClassText}>Add New Class</Text>
        </TouchableOpacity>

        <Modal animationType="slide" transparent={true} visible={modalVisible}>
          <View style={styles.modalOverlay}>
            <View style={styles.modalContainer}>
              <ScrollView showsVerticalScrollIndicator={false}>
                <Text style={styles.label}>Class Name</Text>
                <TextInput
                  style={[styles.input, {height: 40}]}
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
                  onPress={() => {
                    setShowClassDropdown(prev => !prev);
                  }}>
                  <Text>{selectedClass?.name || 'Class Type'}</Text>
                  <SVG.SmallArrow />
                </TouchableOpacity>
                {renderClassDropdownItems()}
                {/* {trainingTypes.map(item => (
                  <TouchableOpacity
                    key={item?.id}
                    style={[
                      selectedClass?.id === item?.id && styles.selectedItem,
                    ]}
                    onPress={() => {
                      setSelectedClass({id: item?.id, name: item?.name});
                      setShowClassDropdown(false);
                    }}>
                    <Text>{item?.type}</Text>
                  </TouchableOpacity>
                ))} */}

                <Text style={styles.label}>Class Recurring</Text>
                <ScrollView
                  horizontal
                  contentContainerStyle={styles.recurringContainer}
                  showsHorizontalScrollIndicator={false}>
                  {daysOfWeek.map((day, index) => (
                    <TouchableOpacity
                      key={index}
                      style={[
                        styles.recurringButton,
                        recurringDays.includes(day)
                          ? {backgroundColor: Colors.black}
                          : {backgroundColor: Colors.gray},
                      ]}
                      onPress={() => handleSelectRecurringDay(day)}>
                      <Text style={styles.recurringText}>{day}</Text>
                    </TouchableOpacity>
                  ))}

                  <TouchableOpacity onPress={handleAddRecurringClass}>
                    <SVG.SmallRed />
                  </TouchableOpacity>
                </ScrollView>

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
                            style={[
                              styles.timeList,
                              selectedStartTime === time && {
                                backgroundColor: Colors.gray,
                                borderRadius: 4,
                                paddingHorizontal: 5,
                              },
                            ]}
                            onPress={() => {
                              setStartTime(time);
                              setSelectedStartTime(time);
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
                            style={[
                              styles.timeList,
                              selectedEndTime === time && {
                                backgroundColor: Colors.gray,
                                borderRadius: 4,
                                paddingHorizontal: 5,
                              },
                            ]}
                            onPress={() => {
                              setEndTime(time);
                              setSelectedEndTime(time);
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
                  style={[styles.input, {height: 40}]}
                  placeholder="Optional..."
                  placeholderTextColor="#aaa"
                  value={description}
                  onChangeText={setDescription}
                />

                <View style={styles.modalButtons}>
                  <TouchableOpacity
                    style={styles.cancelButton}
                    onPress={() => {
                      setModalVisible(false);
                      setShowStartTimePicker(false);
                      setShowEndTimePicker(false);
                    }}>
                    <Text style={styles.cancelText}>Cancel</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.addClassButton}
                    onPress={handleAddNewClass}>
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
                <Text style={styles.label}>Class Name</Text>
                <TextInput
                  style={[styles.input, {height: 40}]}
                  placeholder="class name"
                  placeholderTextColor="#aaa"
                  value={newClassTypeName}
                  onChangeText={setNewClassTypeName}
                />
                <View style={styles.modalButtons}>
                  <TouchableOpacity
                    style={styles.cancelButton}
                    onPress={() => setAddClassModalVisible(false)}>
                    <Text style={styles.cancelText}>Cancel</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.addClassButton}
                    onPress={handleAddClassType}>
                    <Text style={styles.addClassButtonText}>Add Class</Text>
                  </TouchableOpacity>
                </View>
              </ScrollView>
            </View>
          </View>
        </Modal>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.black,
    paddingHorizontal: 16,
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
    fontSize: 24,
    fontFamily: Fonts.normal,
    color: Colors.black,
  },
  classText1: {
    fontSize: 12,
    color: Colors.black,
    fontFamily: Fonts.normal,
  },
  addClass: {
    borderWidth: 1,
    borderColor: Colors.white,
    borderStyle: 'dashed',
    padding: 15,
    alignItems: 'center',
    marginTop: 20,
    borderRadius: 8,
    marginBottom: 40,
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
    fontFamily: Fonts.normal,
    marginVertical: 5,
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
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
  },
  dropdownList: {
    backgroundColor: Colors.dimgray,
    borderRadius: 8,
    borderTopLeftRadius: 0,
    borderTopRightRadius: 0,
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
    padding: 6,
    borderRadius: 8,
    justifyContent: 'center',
  },
  cancelText: {
    color: Colors.red,
  },
  addClassButton: {
    backgroundColor: Colors.black,
    borderRadius: 8,
    paddingHorizontal: 10,
    justifyContent: 'center',
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
    borderWidth: 1,
    borderColor: Colors.gray,
    padding: 8,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.white,
  },
  timeText: {
    fontSize: 16,
  },
  timeList: {
    margin: 5,
  },
});
export default TimeTableScreen;
