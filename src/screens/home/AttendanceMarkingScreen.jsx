// ✅ CODE START

import React, {useEffect, useState} from 'react';
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
import CalendarStrip from 'react-native-calendar-strip';
import moment from 'moment';
import CustomLineChart from '../../components/CustomLineChart';
import Colors from '../../theme/color';
import IMAGES from '../../assets/images';
import SVG from '../../assets/svg';
import {hp} from '../../utility/ResponseUI';
import {Fonts} from '../../assets/fonts';
import makeRequest from '../../api/http';
import {EndPoints} from '../../api/config';
import {showToast} from '../../utility/Toast';
import {useAppSelector} from '../../store/Hooks';
import {useRoute} from '@react-navigation/native';

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
  const route = useRoute();
  const passedUser = route.params?.user;
  const gymMember = route.params?.gym_member;
  const gymId = route.params?.gymId;
  const loggedInUser = useAppSelector(state => state.user?.user);
  const user = passedUser || loggedInUser;
  const gymMemberId = user?.gym_member?.id || gymMember;

  const [gymUserDetail, setGymUserDetail] = useState(null);
  const [presentDays, setPresentDays] = useState(0);
  const [absentDays, setAbsentDays] = useState(0);
  const [showAlert, setShowAlert] = useState(true);
  const [selectedStatus, setSelectedStatus] = useState(null);
  const [markedAttendance, setMarkedAttendance] = useState(null);

  const [isModalVisible, setModalVisible] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(moment());
  const [selectedDate, setSelectedDate] = useState(moment());

  const [classes, setClasses] = useState([]);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [selectedClass, setSelectedClass] = useState(null);
  const [statusByDate, setStatusByDate] = useState({});

  const [attendanceChartData, setAttendanceChartData] = useState({
    labels: [],
    datasets: [],
  });

  useEffect(() => {
    const init = async () => {
      await fetchGymUserDetail();
      await fetchGymSummeryDetail();
      await fetchLogTypes();
    };
    init();
  }, []);

  useEffect(() => {
    if (selectedClass && selectedDate && gymMemberId) {
      fetchMarkedAttendance();
    }
  }, [selectedClass, selectedDate]);

  const fetchGymUserDetail = async () => {
    if (!gymMemberId) {
      showToast('Gym member ID not found');
      return;
    }
    try {
      const response = await makeRequest({
        endPoint: `${EndPoints.GymUserDetail}?gym_member_id=${gymMemberId}`,
        method: 'GET',
      });
      if (response?.success) {
        setGymUserDetail(response);
        setPresentDays(0);
        setAbsentDays(0);
      }
    } catch (error) {
      showToast(error?.message || 'Failed to fetch user detail');
    }
  };

  const fetchGymSummeryDetail = async () => {
    if (!gymMemberId) return;
    try {
      const response = await makeRequest({
        endPoint: `${EndPoints.GymUserSummery}?gym_member_id=${gymMemberId}`,
        method: 'GET',
      });
      if (response) {
        const {present = 0, absent = 0, graph = []} = response;
        setPresentDays(present);
        setAbsentDays(absent);

        const labels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
        const datasets = graph.length
          ? graph.map((item, index) => ({
              data: [
                item?.weekdays?.Monday ?? 0,
                item?.weekdays?.Tuesday ?? 0,
                item?.weekdays?.Wednesday ?? 0,
                item?.weekdays?.Thursday ?? 0,
                item?.weekdays?.Friday ?? 0,
                item?.weekdays?.Saturday ?? 0,
                item?.weekdays?.Sunday ?? 0,
              ],
              color: () =>
                ['#FF0000', '#000000', '#008000', '#FFA500'][index % 4],
            }))
          : [{data: [0, 0, 0, 0, 0, 0, 0]}];

        setAttendanceChartData({labels, datasets});
      }
    } catch (error) {
      showToast(error?.message || 'Failed to fetch summary');
    }
  };

  const fetchLogTypes = async () => {
    if (!gymId) return showToast('Gym ID not found');
    try {
      const response = await makeRequest({
        endPoint: `${EndPoints.LogType}?gym_id=${gymId}`,
        method: 'GET',
      });
      if (response) {
        const formatted = response.map(item => ({
          id: item.id,
          name: item.type,
        }));
        setClasses(formatted);
      }
    } catch (error) {
      showToast(error?.message || 'Error fetching log types');
    }
  };

  const fetchMarkedAttendance = async () => {
    try {
      const date = selectedDate.format('YYYY-MM-DD');
      const response = await makeRequest({
        endPoint: `${EndPoints.ShowAttendance}?gym_member_id=${gymMemberId}&date=${date}&training_type_id=${selectedClass.id}`,
        method: 'GET',
      });
      if (response && response?.length > 0) {
        const status = response[0]?.status;
        const value = status === '1' ? 'Present' : 'Absent';
        setMarkedAttendance(value);
        setSelectedStatus(value);
      } else {
        setMarkedAttendance(null);
        setSelectedStatus(null);
      }
    } catch (error) {
      setMarkedAttendance(null);
    }
  };

  const markAttendance = async statusText => {
    const body = {
      gym_member_id: gymMemberId,
      training_type_id: selectedClass?.id,
      status: statusText === 'Present' ? 1 : 0,
      date: selectedDate.format('YYYY-MM-DD'),
    };
    try {
      await makeRequest({
        endPoint: EndPoints.Attendance,
        method: 'POST',
        body,
      });
      showToast({
        message: `Attendance marked as ${statusText}`,
        type: 'success',
      });
      setSelectedStatus(statusText);
      setMarkedAttendance(statusText);
      fetchGymSummeryDetail();
    } catch (error) {
      const errorMessage =
        error?.message ||
        error?.response?.data?.message ||
        'Error marking attendance';
      showToast({message: errorMessage});
    }
  };

  const getStatusButtonStyle = status => {
    return {
      backgroundColor:
        selectedStatus === status
          ? status === 'Present'
            ? Colors.green
            : Colors.red
          : 'transparent',
    };
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

  const userName = gymUserDetail?.user?.name || user?.name || 'Unnamed';
  const userImage = gymUserDetail?.user?.image;

  return (
    <ScrollView style={styles.container}>
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
        onDateSelected={date => setSelectedDate(moment(date))}
      />
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

      <View style={{backgroundColor: 'white', borderRadius: 8, marginTop: 10}}>
        <TouchableOpacity
          style={styles.dropdown}
          onPress={() => setDropdownOpen(!dropdownOpen)}>
          <Text style={{fontSize: 16, fontFamily: Fonts.normal}}>
            {selectedClass?.name || 'Select Class'}
          </Text>
          <SVG.DropDown />
        </TouchableOpacity>
        {dropdownOpen &&
          classes.map(item => (
            <TouchableOpacity
              key={item.id}
              style={styles.dropdownItem}
              onPress={() => {
                setSelectedClass(item);
                setDropdownOpen(false);
              }}>
              <Text>{item.name}</Text>
            </TouchableOpacity>
          ))}
      </View>

      <View style={styles.profileCard}>
        <View style={{flexDirection: 'row', gap: 15}}>
          <Image
            source={userImage ? {uri: userImage} : IMAGES.ProfilePic2}
            style={styles.image}
          />
          <View
            style={{
              flex: 1,
              flexDirection: 'row',
              justifyContent: 'space-between',
            }}>
            <View>
              <Text style={styles.profileName}>{userName}</Text>
              <Text style={styles.subText}>
                Class: {selectedClass?.name || 'Select Class'}
              </Text>
            </View>
            <TouchableOpacity>
              <SVG.Dots />
            </TouchableOpacity>
          </View>
        </View>
        <View style={{flexDirection: 'row', gap: 9}}>
          {['Present', 'Absent'].map(status => (
            <TouchableOpacity
              key={status}
              style={[
                styles.statusButton,
                getStatusButtonStyle(markedAttendance),
                status !== markedAttendance
                  ? {backgroundColor: Colors.gray}
                  : {},
              ]}
              onPress={() =>
                selectedClass && !markedAttendance && markAttendance(status)
              }
              disabled={!selectedClass || !!markedAttendance}>
              <Text style={styles.statusText}>{status}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <Text style={styles.labels}>Attendance Summary</Text>
      <View style={styles.attendanceSummary}>
        <CircularProgress
          percentage={presentDays}
          color="green"
          label="Present"
        />
        <CircularProgress percentage={absentDays} color="red" label="Absent" />
      </View>

      <Text style={styles.labels}>Attendance</Text>
      <CustomLineChart chartData={attendanceChartData} />

      {showAlert && (
        <>
          <Text style={styles.labels}>Alert</Text>
          <View style={styles.alertBox}>
            <Text style={styles.alertText}>
              {userName} missed {absentDays} sessions
            </Text>
            <TouchableOpacity onPress={() => setShowAlert(false)}>
              <SVG.BigCross />
            </TouchableOpacity>
          </View>
        </>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: Colors.black,
  },
  dropdown: {
    padding: 10,
    backgroundColor: Colors.white,
    borderRadius: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  dropdownItem: {
    padding: 10,
    backgroundColor: Colors.litegray,
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
  labels: {
    color: Colors.white,
    marginTop: 25,
    fontSize: 20,
    fontFamily: Fonts.normal,
  },
  alertBox: {
    backgroundColor: Colors.red,
    padding: 10,
    borderRadius: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 40,
  },
  alertText: {
    color: Colors.white,
  },
});

export default AttendanceMarkingScreen;
