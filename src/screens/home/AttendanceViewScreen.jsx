import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Modal,
  TouchableWithoutFeedback,
} from 'react-native';
import {Svg, Circle, Text as SvgText, Rect, G} from 'react-native-svg';
import {Calendar} from 'react-native-calendars';
import Colors from '../../theme/color';
import SVG from '../../assets/svg';
import {hp} from '../../utility/ResponseUI';
import makeRequest from '../../api/http';
import {EndPoints} from '../../api/config';
import {showToast} from '../../utility/Toast';
import {useNavigation} from '@react-navigation/native';
import {useAppSelector} from '../../store/Hooks';
import {Fonts} from '../../assets/fonts';

const radius = 50;
const strokeWidth = 15;
const circumference = 2 * Math.PI * radius;

const AttendanceViewScreen = () => {
  const navigation = useNavigation();
  const [classList, setClassList] = useState([]);
  const [selectedClass, setSelectedClass] = useState('All Classes');
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split('T')[0],
  );
  const [classDropdownVisible, setClassDropdownVisible] = useState(false);
  const [calendarVisible, setCalendarVisible] = useState(false);
  const [markedDates, setMarkedDates] = useState({});
  const [attendanceData, setAttendanceData] = useState([]);
  const [totalSummary, setTotalSummary] = useState({present: 0, absent: 0});
  const [loading, setLoading] = useState(false);

  const user = useAppSelector(state => state.user?.user);
  const gymId = user?.gym?.id;

  const fetchClassList = async () => {
    try {
      const response = await makeRequest({
        endPoint: EndPoints.PupilClass,
        method: 'GET',
      });
      if (Array.isArray(response)) {
        setClassList(response);
      }
    } catch (error) {
      console.error('Error fetching classes:', error);
    }
  };

  const getTrainingTypeIdFromClass = className => {
    const cls = classList.find(c => c.type === className);
    return cls?.id || '';
  };

  const fetchAttendanceData = async () => {
    try {
      setLoading(true);

      if (!gymId) {
        showToast({
          message:
            'Your gym ID is missing. Please re-login or contact support.',
          type: 'error',
        });
        setAttendanceData([]);
        return;
      }

      const trainingTypeId =
        selectedClass !== 'All Classes'
          ? getTrainingTypeIdFromClass(selectedClass)
          : '';

      const selectedMonth = selectedDate.slice(0, 7);
      const queryParams = `?gym_id=${gymId}&training_type_id=${trainingTypeId}&month=${selectedMonth}`;
      const url = `${EndPoints.PupilAttendance}${queryParams}`;

      const response = await makeRequest({
        endPoint: url,
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response || !response.training_type_summary) {
        showToast({
          message: 'Unexpected response from server.',
          type: 'error',
        });
        setAttendanceData([]);
        return;
      }

      if (response.training_type_summary.length === 0) {
        showToast({
          message: 'No attendance records found. Please check your enrollment.',
          type: 'info',
        });
        setAttendanceData([]);
        return;
      }

      setAttendanceData(response.training_type_summary);
      setTotalSummary(response.summary || {present: 0, absent: 0});
    } catch (error) {
      console.error('Error fetching attendance:', error);
      showToast({
        message: 'Failed to fetch attendance data. Please try again.',
        type: 'error',
      });
      setAttendanceData([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClassList();
  }, []);

  useEffect(() => {
    if (classList.length > 0) {
      fetchAttendanceData();
    }
  }, [selectedClass, selectedDate, classList]);

  const totalPresent = totalSummary.present || 0;
  const totalAbsent = totalSummary.absent || 0;
  const total = totalPresent + totalAbsent;
  const presentPercentage = (totalPresent / total) * circumference || 0;
  const absentPercentage = (totalAbsent / total) * circumference || 0;

  const generateMarkedDates = () => {
    let dates = {};
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - 30);

    for (let i = 0; i <= 30; i++) {
      let date = new Date(startDate);
      date.setDate(startDate.getDate() + i);
      let formattedDate = date.toISOString().split('T')[0];
      dates[formattedDate] = {
        selected: true,
        selectedColor: i % 7 === 0 || i % 5 === 0 ? 'red' : 'green',
      };
    }

    setMarkedDates(dates);
  };

  const openCalendar = () => {
    generateMarkedDates();
    setCalendarVisible(true);
  };

  const onDayPress = day => {
    setSelectedDate(day.dateString);
    setCalendarVisible(false);
  };

  return (
    <View style={styles.container}>
      <View style={styles.filterRow}>
        <TouchableOpacity
          onPress={() => setClassDropdownVisible(!classDropdownVisible)}
          style={styles.dropdown}>
          <Text style={styles.dropdownText}>{selectedClass}</Text>
          <SVG.SmallArrow />
        </TouchableOpacity>
        <TouchableOpacity onPress={openCalendar} style={styles.dropdown}>
          <Text style={styles.dropdownText}>{selectedDate}</Text>
          <SVG.SmallArrow />
        </TouchableOpacity>
      </View>

      {classDropdownVisible && (
        <View style={styles.dropdownList}>
          <ScrollView>
            <TouchableOpacity
              onPress={() => {
                setSelectedClass('All Classes');
                setClassDropdownVisible(false);
              }}>
              <Text style={styles.dropdownItem}>All Classes</Text>
            </TouchableOpacity>
            {classList.map(cls => (
              <TouchableOpacity
                key={cls.id}
                onPress={() => {
                  setSelectedClass(cls.type);
                  setClassDropdownVisible(false);
                }}>
                <Text style={styles.dropdownItem}>{cls.type}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      )}

      {loading ? (
        <Text style={{color: Colors.white, textAlign: 'center'}}>
          Loading...
        </Text>
      ) : attendanceData.length === 0 ? (
        <Text style={{color: Colors.white, textAlign: 'center'}}>
          No Data Found
        </Text>
      ) : (
        <FlatList
          data={attendanceData}
          keyExtractor={(_, index) => index.toString()}
          renderItem={({item}) => (
            <View style={styles.card}>
              <Text style={styles.className}>{item.training_type_name}</Text>
              <View style={styles.attendanceRow}>
                <View style={styles.attendanceGroup}>
                  <Text style={styles.present}>{item.present}</Text>
                  <Text style={styles.label}>Present</Text>
                </View>
                <View style={styles.attendanceGroup}>
                  <Text style={styles.absent}>{item.absent}</Text>
                  <Text style={styles.label}>Absent</Text>
                </View>
              </View>
            </View>
          )}
          ListFooterComponent={
            <View style={styles.chartContainer}>
              <Svg width={250} height={250} viewBox="0 0 200 200">
                <Circle
                  cx="100"
                  cy="100"
                  r={radius}
                  stroke={Colors.darkGray}
                  strokeWidth={strokeWidth}
                  fill="none"
                />
                <Circle
                  cx="100"
                  cy="100"
                  r={radius}
                  stroke={Colors.green}
                  strokeWidth={strokeWidth}
                  fill="none"
                  strokeDasharray={`${presentPercentage}, ${circumference}`}
                />
                <Circle
                  cx="100"
                  cy="100"
                  r={radius}
                  stroke={Colors.red}
                  strokeWidth={strokeWidth}
                  fill="none"
                  strokeDasharray={`${absentPercentage}, ${circumference}`}
                  strokeDashoffset={-presentPercentage}
                />
                <G onPressIn={openCalendar}>
                  <Rect
                    x="135"
                    y="130"
                    width="42"
                    height="26"
                    fill="white"
                    rx="5"
                  />
                  <SvgText
                    x="160"
                    y="140"
                    fill="black"
                    fontSize="8"
                    fontWeight="bold"
                    textAnchor="end">
                    {totalPresent}
                  </SvgText>
                  <SvgText
                    x="175"
                    y="150"
                    fill="black"
                    fontSize="6"
                    textAnchor="end">
                    Total Present
                  </SvgText>
                </G>
                <Circle cx="90" cy="20" r="2" fill="green" />
                <SvgText
                  x="120"
                  y="24"
                  fill="white"
                  fontSize="12"
                  textAnchor="middle">
                  Present
                </SvgText>
                <Circle cx="150" cy="20" r="2" fill="red" />
                <SvgText
                  x="160"
                  y="24"
                  fill="white"
                  fontSize="12"
                  textAnchor="start">
                  Absent
                </SvgText>
              </Svg>
            </View>
          }
        />
      )}

      <Modal visible={calendarVisible} transparent animationType="slide">
        <TouchableWithoutFeedback onPress={() => setCalendarVisible(false)}>
          <View style={styles.modalContainer}>
            <TouchableWithoutFeedback>
              <View style={styles.modalContent}>
                <Calendar
                  onDayPress={onDayPress}
                  markedDates={markedDates}
                  theme={{
                    backgroundColor: '#333',
                    calendarBackground: '#333',
                    dayTextColor: '#FFF',
                    monthTextColor: '#FFF',
                    arrowColor: '#FFF',
                  }}
                />
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>

      <View style={styles.summaryContainer}>
        <View style={[styles.summaryCard, {backgroundColor: 'green'}]}>
          <Text style={styles.summaryNumber}>{totalPresent}</Text>
          <Text style={styles.summaryLabel}>Total Present</Text>
        </View>
        <View style={[styles.summaryCard, {backgroundColor: 'red'}]}>
          <Text style={styles.summaryNumber}>{totalAbsent}</Text>
          <Text style={styles.summaryLabel}>Total Absent</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.black,
    padding: 10,
  },
  filterRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  dropdown: {
    backgroundColor: Colors.white,
    padding: 10,
    borderRadius: 8,
    width: '48%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dropdownText: {
    color: Colors.black,
    fontSize: 16,
  },
  card: {
    backgroundColor: Colors.darkGray,
    padding: 20,
    borderRadius: 10,
    marginVertical: 5,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  className: {
    color: Colors.white,
    fontSize: 20,
    fontFamily: Fonts.normal,
  },
  attendanceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 15,
  },
  attendanceGroup: {
    alignItems: 'center',
  },
  present: {
    color: Colors.green,
    fontSize: 20,
    fontFamily: Fonts.normal,
  },
  absent: {
    color: Colors.red,
    fontSize: 20,
    fontFamily: Fonts.normal,
  },
  label: {
    color: Colors.gray,
    fontSize: 12,
  },
  chartContainer: {
    alignItems: 'center',
    backgroundColor: Colors.darkGray,
    borderRadius: 8,
    height: hp((245 / 919) * 100),
  },
  summaryContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  summaryCard: {
    flex: 1,
    padding: 15,
    borderRadius: 8,
    marginHorizontal: 5,
  },
  summaryNumber: {
    color: '#FFF',
    fontSize: 20,
    fontWeight: 'bold',
  },
  summaryLabel: {
    color: '#FFF',
    fontSize: 14,
  },
  dropdownList: {
    backgroundColor: Colors.white,
    padding: 10,
    borderRadius: 8,
    marginTop: 5,
  },
  dropdownItem: {
    fontSize: 16,
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: Colors.litegray,
    color: Colors.black,
    fontFamily: Fonts.normal,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.8)',
  },
  modalContent: {
    backgroundColor: Colors.darkGray,
    padding: 20,
    borderRadius: 10,
    width: '95%',
  },
  noDataModal: {
    backgroundColor: Colors.white,
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
    width: '80%',
  },
  noDataText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.black,
    marginBottom: 15,
    textAlign: 'center',
  },
  closeButton: {
    backgroundColor: Colors.primary,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  closeButtonText: {
    color: Colors.black,
    fontSize: 16,
  },
});

export default AttendanceViewScreen;
