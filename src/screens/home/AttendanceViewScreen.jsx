import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Modal,
} from 'react-native';
import {Svg, Circle, Text as SvgText, Rect} from 'react-native-svg';
import {Calendar} from 'react-native-calendars';
import Colors from '../../theme/color';
import {Fonts} from '../../assets/fonts';
import SVG from '../../assets/svg';
import {hp} from '../../utility/ResponseUI';
import makeRequest from '../../api/http';
import {EndPoints} from '../../api/config';
import {showToast} from '../../utility/Toast';

const radius = 50;
const strokeWidth = 15;
const circumference = 2 * Math.PI * radius;

const AttendanceViewScreen = () => {
  const [selectedClass, setSelectedClass] = useState('All Classes');
  const [selectedDate, setSelectedDate] = useState('Last 30 days');
  const [classDropdownVisible, setClassDropdownVisible] = useState(false);
  const [calendarVisible, setCalendarVisible] = useState(false);
  const [markedDates, setMarkedDates] = useState({});
  const [attendanceData, setAttendanceData] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchAttendanceData = async () => {
    try {
      setLoading(true);
      const response = await makeRequest({
        endPoint: EndPoints.Pupil,
        method: 'POST',
        body: {},
        headers: {
          'Content-Type': 'application/json',
        },
      });
      setAttendanceData(response);
    } catch (error) {
      showToast({message: 'Failed to fetch attendance data'});
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAttendanceData();
  }, []);

  const filteredData =
    selectedClass === 'All Classes'
      ? attendanceData
      : attendanceData.filter(item => item.className === selectedClass);

  const totalPresent = filteredData.reduce(
    (sum, item) => sum + item.present,
    0,
  );
  const totalAbsent = filteredData.reduce((sum, item) => sum + item.absent, 0);
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
            {[
              'All Classes',
              'Gi Class',
              'No Gi Class',
              'Competition Class',
            ].map(cls => (
              <TouchableOpacity
                key={cls}
                onPress={() => {
                  setSelectedClass(cls);
                  setClassDropdownVisible(false);
                }}>
                <Text style={styles.dropdownItem}>{cls}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      )}

      {loading ? (
        <Text style={{color: Colors.white, textAlign: 'center'}}>
          Loading...
        </Text>
      ) : filteredData.length === 0 ? (
        <Text style={{color: Colors.white, textAlign: 'center'}}>
          No Data Found
        </Text>
      ) : (
        <FlatList
          data={filteredData}
          keyExtractor={item => item.id?.toString()}
          renderItem={({item}) => (
            <View style={styles.card}>
              <Text style={styles.className}>{item.className}</Text>
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
                  strokeLinecap="butt"
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
                  strokeLinecap="butt"
                />

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
        <View style={styles.modalContainer}>
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
            <TouchableOpacity onPress={() => setCalendarVisible(false)} />
          </View>
        </View>
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
});

export default AttendanceViewScreen;
