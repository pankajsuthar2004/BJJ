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

  const classes = [
    'Gi',
    'No Gi',
    'Beginners 12am kids',
    'Advanced Gi Class 9am',
  ];

  const attendanceData = {
    present: 21,
    absent: 7,
    holidays: 3,
    giData: [60, 80, 75, 43, 70, 65, 95, 43, 34, 87, 100, 53, 32],
    noGiData: [50, 70, 65, 80, 60, 75, 100, 85, 45, 32, 65, 87, 25],
  };

  const toggleModal = () => {
    setModalVisible(!isModalVisible);
  };
  const goToPreviousMonth = () => {
    const newMonth = moment(currentMonth).subtract(1, 'months');
    setCurrentMonth(newMonth);
    setSelectedDate(moment(newMonth).startOf('month')); // Set the first day of the new month
  };

  const goToNextMonth = () => {
    const newMonth = moment(currentMonth).add(1, 'months');
    setCurrentMonth(newMonth);
    setSelectedDate(moment(newMonth).startOf('month')); // Set the first day of the new month
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
      case 'Holiday':
        return Colors.yellow;
      default:
        return Colors.gray;
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

  const getStatusButtonStyle = status => {
    switch (status) {
      case 'Present':
        return {
          backgroundColor:
            selectedStatus === 'Present' ? Colors.green : 'transparent',
        };
      case 'Absent':
        return {
          backgroundColor:
            selectedStatus === 'Absent' ? Colors.red : 'transparent',
        };
      case 'Holiday':
        return {
          backgroundColor:
            selectedStatus === 'Holiday' ? Colors.yellow : 'transparent',
        };
      default:
        return {};
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={{flex: 1, flexDirection: 'row'}}>
        <TouchableOpacity onPress={goToPreviousMonth}>
          <SVG.IconRight />
        </TouchableOpacity>
        <TouchableOpacity
          style={{flex: 1, fontSize: 20}}
          onPress={() => setModalVisible(true)}>
          <CalendarStrip
            scrollable
            style={{height: 120}}
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
        <TouchableOpacity onPress={goToNextMonth}>
          <SVG.IconLeft />
        </TouchableOpacity>
      </View>

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
            Select Class
          </Text>
          <SVG.DropDown />
        </TouchableOpacity>
        {dropdownOpen && (
          <FlatList
            data={classes}
            keyExtractor={index => index.toString()}
            renderItem={({item}) => (
              <TouchableOpacity
                style={styles.dropdownItem}
                onPress={() => {
                  setSelectedStatus(item);
                  setDropdownOpen(false);
                }}>
                <Text style={{fontSize: 16, fontFamily: Fonts.normal}} t>
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
              <Text style={styles.profileName}>John Smith</Text>
              <Text style={styles.subText}>Gi</Text>
            </View>
            <TouchableOpacity>
              <SVG.Dots />
            </TouchableOpacity>
          </View>
        </View>
        <View style={{flexDirection: 'row', gap: 9}}>
          <TouchableOpacity
            style={[styles.statusButton, getStatusButtonStyle('Present')]}
            onPress={() => setSelectedStatus('Present')}>
            <Text style={styles.statusText}>Present</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.statusButton, getStatusButtonStyle('Absent')]}
            onPress={() => setSelectedStatus('Absent')}>
            <Text style={styles.statusText}>Absent</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.statusButton, getStatusButtonStyle('Holiday')]}
            onPress={() => setSelectedStatus('Holiday')}>
            <Text style={styles.statusText}>Holiday</Text>
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
        <CircularProgress
          percentage={attendanceData.holidays}
          color="orange"
          label="Holidays"
        />
      </View>
      <Text style={styles.labels}>Attendance</Text>
      <View style={styles.chartContainer}>
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
            legend: ['Gi', 'No Gi'],
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
  calendarStrip: {
    height: 100,
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
  arrow: {
    fontSize: 24,
    fontWeight: 'bold',
    padding: 10,
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
  closeButton: {
    marginTop: 20,
    padding: 10,
    backgroundColor: 'red',
    borderRadius: 5,
  },
  closeText: {
    color: 'white',
    fontWeight: 'bold',
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
    borderBottomWidth: 1,
    borderBottomColor: Colors.litegray,
  },
  profileCard: {
    backgroundColor: Colors.darkGray,
    padding: 15,
    borderRadius: 16,
    marginTop: 15,
  },
  profileImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10,
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
    justifyContent: 'space-around',
    marginTop: 20,
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
    paddingTop: 15,
    borderRadius: 8,
    marginBottom: 10,
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
