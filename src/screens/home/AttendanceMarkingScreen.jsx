import React, {useState} from 'react';
import {
  ScrollView,
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
  FlatList,
  Modal,
} from 'react-native';
import {Circle, Svg} from 'react-native-svg';
import CustomLineChart from '../../components/CustomLineChart';
import Colors from '../../theme/color';
import IMAGES from '../../assets/images';
import SVG from '../../assets/svg';
import {hp} from '../../utility/ResponseUI';
import {Fonts} from '../../assets/fonts';
import CalendarStrip from 'react-native-calendar-strip';
import moment from 'moment';
import makeRequest from '../../api/http';
import {EndPoints} from '../../api/config';
import {showToast} from '../../utility/Toast';
import {useSelector} from 'react-redux';

const CircularProgress = ({percentage, color, label}) => {
  const radius = 35;
  const strokeWidth = 10;
  const circumference = 2 * Math.PI * radius;
  const progress = (percentage / 30) * circumference;

  return (
    <View style={styles.progressContainer}>
      <Svg width={95} height={95} viewBox="0 0 85 85">
        <Circle
          cx="40"
          cy="40"
          r={radius}
          stroke="#E6E6E6"
          strokeWidth={strokeWidth}
          fill="none"
        />
        <Circle
          cx="40"
          cy="40"
          r={radius}
          stroke={color}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={circumference - progress}
          strokeLinecap="round"
          fill="none"
        />
      </Svg>
      <Text style={styles.progressText}>{percentage}</Text>
      <Text style={styles.progressLabel}>{label}</Text>
    </View>
  );
};

const AttendanceMarkingScreen = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState(null);
  const [isModalVisible, setModalVisible] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(moment());
  const [selectedDate, setSelectedDate] = useState(moment());
  const [selectedClass, setSelectedClass] = useState('Select Class');
  const user = useSelector(state => state.user?.user);

  const classes = [
    'Gi',
    'No Gi',
    'Beginners 12am kids',
    'Advanced Gi Class 9am',
  ];

  const markAttendance = async status => {
    console.log('Marking Attendance:', status);
    setSelectedStatus(status);

    if (!user) {
      showToast('User not found!');
      return;
    }

    if (!selectedClass) {
      showToast('Please select a class');
      return;
    }

    const body = {
      user_id: user.id,
      training_type_id: selectedClass,
      attendance: status,
      date: selectedDate.format('YYYY-MM-DD'),
    };

    try {
      const response = await makeRequest({
        endPoint: EndPoints.Attendance,
        method: 'POST',
        body,
      });

      showToast('Attendance marked successfully');
      console.log('Attendance Response:', response);
      setSelectedStatus(status);
    } catch (error) {
      showToast(error.message || 'Failed to mark attendance');
    }
  };

  const attendanceData = {
    present: 21,
    absent: 7,
    holidays: 3,
    giData: [60, 80, 75, 43, 70, 65, 95, 43, 34, 87, 100, 53, 32],
    noGiData: [50, 70, 65, 80, 60, 75, 100, 85, 45, 32, 65, 87, 25],
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

  const firstDayOfMonth = moment(currentMonth).startOf('month').day();
  const totalDaysInMonth = moment(currentMonth).daysInMonth();

  const emptySlots = Array.from({length: firstDayOfMonth}, (_, i) => ({
    id: `empty-${i}`,
    empty: true,
  }));

  const attendanceDatas = {
    1: 'Present',
    2: 'Present',
    3: 'Present',
    4: 'Present',
    5: 'Present',
    6: 'Present',
    7: 'Present',
    8: 'Present',
    9: 'Present',
    10: 'Present',
    11: 'Present',
    12: 'Present',
    13: 'Present',
    14: 'Present',
    15: 'Present',
    16: 'Present',
    17: 'Present',
    18: 'Holiday',
    19: 'Absent',
    20: 'Present',
    21: 'Present',
    22: 'Absent',
    23: 'Holiday',
    24: 'Holiday',
    25: 'Present',
    26: 'Present',
    27: 'Absent',
    28: 'Absent',
    29: 'Absent',
    30: 'Absent',
    31: 'Absent',
  };

  const getDateBackgroundColor = status => {
    switch (status) {
      case 'Present':
        return Colors.green;
      case 'Absent':
        return Colors.red;
      default:
        return Colors.white;
    }
  };

  const daysArray = Array.from({length: totalDaysInMonth}, (_, i) => ({
    id: i + 1,
    date: i + 1,
    status:
      attendanceDatas && attendanceDatas[i + 1]
        ? attendanceDatas[i + 1]
        : 'Unknown',
  }));

  const getStatusButtonStyle = status => ({
    backgroundColor:
      selectedStatus === status
        ? status === 'Present'
          ? Colors.green
          : Colors.red
        : 'transparent',
  });

  return (
    <ScrollView style={styles.container}>
      <TouchableOpacity
        style={{flex: 1, fontSize: 20}}
        onPress={() => setModalVisible(true)}>
        <CalendarStrip
          scrollable
          style={{height: 120, width: 410, right: 22}}
          calendarColor={'black'}
          calendarHeaderStyle={{color: 'white', fontSize: 20}}
          dateNumberStyle={{color: 'white'}}
          dateNameStyle={{color: 'white'}}
          highlightDateNumberStyle={{color: 'white'}}
          highlightDateContainerStyle={{
            backgroundColor: 'red',
            borderRadius: 8,
          }}
          selectedDate={selectedDate}
        />
      </TouchableOpacity>
      <TouchableOpacity
        style={{position: 'absolute'}}
        onPress={goToPreviousMonth}>
        <SVG.IconRight />
      </TouchableOpacity>
      <TouchableOpacity
        style={{position: 'absolute', right: 6}}
        onPress={goToNextMonth}>
        <SVG.IconLeft />
      </TouchableOpacity>

      <Modal visible={isModalVisible} transparent animationType="slide">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.headerContainer}>
              <TouchableOpacity onPress={goToPreviousMonth}>
                <SVG.LeftCal />
              </TouchableOpacity>
              <Text style={styles.modalHeader}>
                {currentMonth.format('MMMM YYYY')}
              </Text>
              <TouchableOpacity onPress={goToNextMonth}>
                <SVG.RightCal />
              </TouchableOpacity>
            </View>

            <View style={styles.weekDay}>
              {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(day => (
                <Text key={day} style={styles.weekdayText}>
                  {day}
                </Text>
              ))}
            </View>

            <FlatList
              data={[...emptySlots, ...daysArray]}
              numColumns={7}
              keyExtractor={item => item.id.toString()}
              renderItem={({item}) =>
                item.empty ? (
                  <View
                    style={[
                      styles.dateCircle,
                      {backgroundColor: 'transparent'},
                    ]}
                  />
                ) : (
                  <TouchableOpacity
                    style={[
                      styles.dateCircle,
                      {backgroundColor: getDateBackgroundColor(item.status)},
                    ]}
                    onPress={() => {
                      setSelectedDate(moment(currentMonth).date(item.date));
                      setModalVisible(false);
                    }}>
                    <Text style={styles.dateText}>{item.date}</Text>
                  </TouchableOpacity>
                )
              }
            />
          </View>
        </View>
      </Modal>

      <View style={{backgroundColor: 'white', borderRadius: 8}}>
        <TouchableOpacity
          style={styles.dropdown}
          onPress={() => setDropdownOpen(!dropdownOpen)}>
          <Text
            style={{
              fontSize: 16,
              fontFamily: Fonts.normal,
            }}>
            {selectedClass}
          </Text>
          <SVG.DropDown />
        </TouchableOpacity>

        {dropdownOpen && (
          <FlatList
            data={classes}
            keyExtractor={index => index.toString()}
            renderItem={({item, index}) => (
              <TouchableOpacity
                style={[
                  styles.dropdownItem,
                  index === classes.length - 1 && {borderBottomWidth: 0},
                ]}
                onPress={() => {
                  setSelectedClass(item);
                  setDropdownOpen(false);
                }}>
                <Text style={{fontSize: 16, fontFamily: Fonts.normal}}>
                  {item}
                </Text>
              </TouchableOpacity>
            )}
          />
        )}
      </View>
      <View style={styles.profileCard}>
        <View style={{flexDirection: 'row', gap: 15}}>
          <Image source={IMAGES.Photo1} />
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              flex: 1,
            }}>
            <View>
              <Text style={styles.profileName}>{user?.name}</Text>
              <Text style={styles.subText}>
                Class: {selectedClass || 'Not Selected'}
              </Text>
            </View>
            <TouchableOpacity>
              <SVG.Dots />
            </TouchableOpacity>
          </View>
        </View>
        <View style={{flexDirection: 'row', gap: 9}}>
          <TouchableOpacity
            style={[styles.statusButton, getStatusButtonStyle('Present')]}
            onPress={() => markAttendance('Present')}>
            <Text style={styles.statusText}>Present</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.statusButton, getStatusButtonStyle('Absent')]}
            onPress={() => markAttendance('Absent')}>
            <Text style={styles.statusText}>Absent</Text>
          </TouchableOpacity>
        </View>
      </View>

      <Text style={styles.labels}>Attendance Summary</Text>
      <View style={styles.attendanceSummary}>
        <CircularProgress
          percentage={attendanceData.present}
          color="green"
          label="Present"
        />
        <CircularProgress
          percentage={attendanceData.absent}
          color="red"
          label="Absent"
        />
      </View>
      <Text style={styles.labels}>Attendance</Text>
      <View style={styles.chartContainer}>
        <View style={styles.legendContainer}>
          <View style={styles.legendItem}>
            <SVG.Maskgroup />
            <Text style={{color: Colors.red}}>Gi</Text>
          </View>
          <View style={styles.legendItem}>
            <SVG.Nogi />
            <Text style={{color: Colors.darkGray}}>No Gi</Text>
          </View>
        </View>
        <CustomLineChart
          chartData={{
            labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
            datasets: [
              {
                data: attendanceData.giData,
                color: (opacity = 1) => `rgba(255, 0, 0, ${opacity})`,
              },
              {
                data: attendanceData.noGiData,
                color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
              },
            ],
          }}
        />
      </View>

      <Text style={styles.labels}>Alert</Text>
      <View style={styles.alertBox}>
        <Text style={styles.alertText}>John Smith missed 7 sessions</Text>
        <TouchableOpacity>
          <SVG.BigCross />
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: Colors.black,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.8)',
  },
  modalContent: {
    width: '95%',
    backgroundColor: 'white',
    borderRadius: 10,
    paddingVertical: 30,
    alignItems: 'center',
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '90%',
    alignItems: 'center',
  },
  modalHeader: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  weekDay: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '75%',
    marginTop: 10,
    // paddingLeft: 10,
  },
  weekdayText: {
    fontWeight: 'bold',
    color: Colors.black,
  },
  dropdown: {
    padding: 10,
    backgroundColor: Colors.white,
    borderRadius: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: Colors.litegray,
  },
  dropdownItem: {
    padding: 10,
    borderBottomWidth: 0.3,
    borderBottomColor: Colors.gray,
    backgroundColor: Colors.litegray,
    borderBottomLeftRadius: 8,
    borderBottomRightRadius: 8,
  },
  profileCard: {
    backgroundColor: Colors.darkGray,
    padding: 15,
    borderRadius: 16,
    marginTop: 15,
  },
  profileName: {
    color: Colors.white,
    fontSize: 18,
  },
  subText: {
    color: Colors.gray,
  },
  attendanceSummary: {
    flexDirection: 'row',
    marginTop: 20,
    gap: 15,
  },
  progressContainer: {
    alignItems: 'center',
  },
  progressText: {
    position: 'absolute',
    top: '30%',
    left: '39%',
    color: Colors.white,
    fontWeight: 'bold',
    fontSize: 20,
  },
  progressLabel: {
    position: 'absolute',
    top: '51%',
    left: '26%',
    color: Colors.white,
    fontFamily: Fonts.normal,
    fontSize: 12,
  },
  chartContainer: {
    backgroundColor: Colors.white,
    borderRadius: 10,
    marginBottom: 10,
  },
  legendContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 10,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 10,
    gap: 5,
  },
  alertBox: {
    backgroundColor: Colors.red,
    padding: 10,
    marginBottom: hp(8),
    borderRadius: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10,
  },
  alertText: {
    color: Colors.white,
  },
  statusButton: {
    padding: 7,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.litegray,
    marginTop: 15,
  },
  statusText: {
    color: Colors.white,
  },
  labels: {
    color: Colors.white,
    marginTop: 25,
    fontSize: 20,
    fontFamily: Fonts.normal,
  },
  dateCircle: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 20,
    backgroundColor: Colors.litegray,
    margin: 2,
  },
  dateText: {
    color: Colors.black,
  },
});

export default AttendanceMarkingScreen;
