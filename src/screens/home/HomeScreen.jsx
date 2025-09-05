import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  SafeAreaView,
  Modal,
  TouchableWithoutFeedback,
  Animated,
} from 'react-native';
import {LineChart, BarChart} from 'react-native-chart-kit';
import {Dimensions} from 'react-native';
import Colors from '../../theme/color';
import IMAGES from '../../assets/images';
import {Fonts} from '../../assets/fonts';
import {useNavigation} from '@react-navigation/native';
import {hp, wp} from '../../utility/ResponseUI';
import SVG from '../../assets/svg';
import {EndPoints} from '../../api/config';
import makeRequest from '../../api/http';
import AppLoader from '../../components/AppLoader';
import {showToast} from '../../utility/Toast';
import {useAppDispatch, useAppSelector} from '../../store/Hooks';
import {setUser} from '../../Slices/UserSlice';
import {Calendar} from 'react-native-calendars';
import messaging from '@react-native-firebase/messaging';

const screenWidth = Dimensions.get('window').width;

const HomeScreen = () => {
  const a = useAppSelector(b => b.user);
  const navigation = useNavigation();
  const [selectedToggle, setSelectedToggle] = useState('Monthly');
  const [isDrawerVisible, setIsDrawerVisible] = useState(false);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [dashboardData, setDashboardData] = useState(null);
  const [gymStatus, setGymStatus] = useState(0);
  const [fromDate, setFromDate] = useState(null);
  const [toDate, setToDate] = useState(null);
  const [calendarMode, setCalendarMode] = useState(null);
  const [calendarVisible, setCalendarVisible] = useState(false);

  const dispatch = useAppDispatch();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await makeRequest({
          endPoint: EndPoints.GetProfile,
          method: 'GET',
        });
        setUserData(response);
      } catch (error) {
        console.log('Profile Fetch Error:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    fetchUserDash();
  }, [selectedToggle, fromDate, toDate]);

  useEffect(() => {
    fetchData2();
  }, [isDrawerVisible]);

  useEffect(() => {
    sendDeviceToken();
  }, []);

  const sendDeviceToken = async () => {
    try {
      const fcmToken = await messaging().getToken();
      console.log('🔑 FCM Token:', fcmToken);

      const body = {
        token: fcmToken,
      };

      console.log('📤 Sending Device Token Body:', body);

      await makeRequest({
        endPoint: EndPoints.DeviceToken,
        method: 'POST',
        body,
      });

      console.log('✅ Device token sent successfully');
    } catch (error) {
      console.error('❌ Error sending device token:', error);
    }
  };

  const fetchData2 = async () => {
    try {
      const response = await makeRequest({
        endPoint: EndPoints.GetGym,
        method: 'GET',
      });

      setGymStatus(response?.status);
      dispatch(setUser({...a?.user, gym: response}));
    } catch (error) {
      console.log(error);
    }
  };

  const fetchUserDash = async () => {
    try {
      const response = await makeRequest({
        endPoint: EndPoints.UserDash,
        method: 'GET',
        params: {
          filter_type: selectedToggle.toLowerCase() || '',
          from_date: fromDate || '',
          to_date: toDate || '',
        },
      });
      console.log('response ==== ++++++', response);
      setDashboardData(response);
    } catch (error) {
      console.log('UserDash API Error:', error);
    }
  };

  const handleDateSelect = date => {
    if (calendarMode === 'from') {
      setFromDate(date.dateString);
    } else if (calendarMode === 'to') {
      setToDate(date.dateString);
    }
    setCalendarVisible(false);
    setCalendarMode(null);
    setSelectedToggle('');
  };

  const chartConfig = {
    backgroundColor: Colors.white,
    backgroundGradientFrom: Colors.white,
    backgroundGradientTo: Colors.white,
    decimalPlaces: 0,
    color: (opacity = 1) => `rgba(255, 0, 0, ${opacity})`,
    labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
    fillShadowGradient: 'transparent',
    fillShadowGradientOpacity: 0,
    propsForLabels: {
      fontSize: 11,
      textAlign: 'center',
    },
    propsForDots: {
      r: '0',
      strokeWidth: '5',
      stroke: Colors.red,
    },
  };

  const dailyData = dashboardData?.graphs?.daily_training_time?.data;
  const isValidDailyData =
    Array.isArray(dailyData) &&
    dailyData.length > 0 &&
    dailyData.some(item => item.total_training_time_minutes > 0);

  const lineData = {
    labels: isValidDailyData
      ? dailyData.map(item => {
          const date = new Date(item.date);
          return date.toLocaleDateString('en-GB');
        })
      : [],
    datasets: [
      {
        data: isValidDailyData
          ? dailyData.map(item => item.total_training_time_minutes)
          : [],
        color: () => Colors.red,
      },
    ],
  };

  const rawData =
    dashboardData?.graphs?.training_duration_by_type_detailed?.data;
  const isValidRawData = Array.isArray(rawData) && rawData.length > 0;

  const formattedData = isValidRawData
    ? rawData.map(item => ({
        ...item,
        formattedDate: new Date(item.date).toLocaleDateString('en-GB'),
      }))
    : [];

  // Step 2: Get all unique dates and sort them
  const uniqueDates = Array.from(
    new Set(formattedData.map(item => item.formattedDate)),
  ).sort((a, b) => {
    const [dayA, monthA, yearA] = a.split('/');
    const [dayB, monthB, yearB] = b.split('/');
    return (
      new Date(`${yearA}-${monthA}-${dayA}`) -
      new Date(`${yearB}-${monthB}-${dayB}`)
    );
  });

  // Step 3: Get all unique training types
  const uniqueTypes = Array.from(
    new Set(formattedData.map(item => item.training_type_name)),
  );

  // Step 4: Group data by training_type_name and fill 0s for missing dates
  const colorPalette = [
    '#FF6384',
    '#36A2EB',
    '#FFCE56',
    '#4BC0C0',
    '#9966FF',
    '#FF9F40',
  ];
  const datasets = uniqueTypes.map((typeName, index) => {
    const dataByDate = {};
    formattedData
      .filter(item => item.training_type_name === typeName)
      .forEach(item => {
        dataByDate[item.formattedDate] = item.duration_minutes;
      });

    return {
      data: uniqueDates.map(date => dataByDate[date] || 0),
      color: () => colorPalette[index % colorPalette.length],
      strokeWidth: 2,
      legend: typeName,
    };
  });

  // Step 5: Build TimeData object
  const TimeData = {
    labels: uniqueDates,
    datasets,
  };

  // const TimeData = {
  //   labels: [
  //     '7/12/24',
  //     '8/12/24',
  //     '9/12/24',
  //     '10/12/24',
  //     '11/12/24',
  //     '12/12/24',
  //     '13/12/24',
  //   ],
  //   datasets: [
  //     {
  //       data: [0, 25, 10, 38, 5, 33, 60, 3, 35, 29, 8, 29, 8, 5, 32, 2],
  //       color: () => Colors.red,
  //     },
  //     {
  //       data: [0, 6, 8, 1, 7, 14, 10, 4, 2, 9, 1, 9, 4, 6, 9, 0],
  //       color: () => 'rgb(14, 14, 16)',
  //       strokeWidth: 2,
  //     },
  //   ],
  //   // legend: ['Gi', 'No Gi'],
  // };

  const barData = {
    datasets: [
      {
        data: [40, 88, 80, 61, 49, 35, 73, 25],
      },
    ],
  };

  const sessionStats = [
    {
      svg: SVG.Count1,
      value: dashboardData?.analytics?.total_training_logs ?? 0,
      label: 'Sessions Count',
    },
    {
      svg: SVG.Count5,
      value: dashboardData?.analytics?.submissions?.achieved ?? 0,
      label: 'Sub Achieved',
    },
    {
      svg: SVG.Count6,
      value: dashboardData?.analytics?.submissions?.conceded ?? 0,
      label: 'Sub Conceded',
    },
    {
      svg: SVG.Count6,
      value: dashboardData?.analytics?.positions?.achieved ?? 0,
      label: 'Pos Achieved',
    },
    {
      svg: SVG.Count5,
      value: dashboardData?.analytics?.positions?.conceded ?? 0,
      label: 'Pos Conceded',
    },
  ];

  const toggleDrawer = () => {
    setIsDrawerVisible(prev => !prev);
  };

  const navigateToScreen = screen => {
    navigation.navigate(screen);
    toggleDrawer();
  };

  const onPressHandler = async () => {
    try {
      await fetchData2();

      if (gymStatus == 0) {
        showToast({message: 'Gym not approved by admin', type: 'error'});
      } else if (gymStatus == 1) {
        navigateToScreen('DashBoardScreen');
      } else {
        navigateToScreen('Gym Profile');
      }
    } catch (error) {
      console.error('Error checking gym status:', error);
      showToast({message: 'Something went wrong', type: 'error'});
    }
  };

  const getFullImageUri = () => {
    if (!userData?.image) return null;
    return userData.image.startsWith('http')
      ? userData.image
      : `https://bjj.beepr.us/${userData.image}`;
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <TouchableOpacity>
            <Image
              source={
                getFullImageUri() ? {uri: getFullImageUri()} : IMAGES.BigProfile
              }
              style={{height: hp(5), width: hp(5), borderRadius: hp(6)}}
            />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>
            {`Welcome ${userData?.name}\n`}
            <Text style={styles.headerText}>The Next Level Starts Now</Text>
          </Text>
          <View style={styles.iconStyle}>
            <TouchableOpacity>
              <SVG.Bell />
            </TouchableOpacity>
            <TouchableOpacity onPress={toggleDrawer}>
              <SVG.Line />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.toggle}>
          {['Weekly', 'Monthly', 'Quarterly', 'Yearly'].map(
            (toggle, index, array) => (
              <TouchableOpacity
                key={toggle}
                style={[
                  styles.toggleButton,
                  selectedToggle === toggle
                    ? {backgroundColor: Colors.red}
                    : index === 0 && {
                        borderTopLeftRadius: 8,
                        borderBottomLeftRadius: 8,
                      },
                  index === array.length - 1 && {
                    borderTopRightRadius: 8,
                    borderBottomRightRadius: 8,
                  },
                  index !== array.length - 1,
                ]}
                onPress={() => setSelectedToggle(toggle)}>
                <Text
                  style={[
                    styles.toggleText,
                    selectedToggle === toggle && {
                      color: Colors.white,
                      fontWeight: 'bold',
                    },
                  ]}>
                  {toggle}
                </Text>
              </TouchableOpacity>
            ),
          )}
        </View>

        <Modal
          visible={isDrawerVisible}
          transparent={true}
          animationType="fade"
          onRequestClose={toggleDrawer}>
          <TouchableWithoutFeedback onPress={toggleDrawer}>
            <Animated.View style={styles.drawerOverlay}></Animated.View>
          </TouchableWithoutFeedback>

          <View style={styles.drawer}>
            <TouchableOpacity onPress={toggleDrawer} style={styles.closeButton}>
              <SVG.Cancel />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.drawerItem1}
              // onPress={() => navigateToScreen('DashBoardScreen')}
            >
              <SVG.HomeIcon />
              <Text style={styles.drawerText}>Home</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.drawerItem}
              onPress={() => navigateToScreen('Training History')}>
              <SVG.History />
              <Text style={styles.drawerText}>Log History</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.drawerItem}
              onPress={() => navigateToScreen('LogScreen')}>
              <SVG.Entry />
              <Text style={styles.drawerText}>Add Entry</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.drawerItem}
              onPress={() => navigateToScreen('Feed')}>
              <SVG.Feed />
              <Text style={styles.drawerText}>Feed</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.drawerItem}
              onPress={() => navigateToScreen('Profile')}>
              <SVG.IconProfile />
              <Text style={styles.drawerText}>Profile</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.drawerItem}
              onPress={() => navigateToScreen('Attendance View')}>
              <SVG.IconProfile />
              <Text style={styles.drawerText}>Pupil Attendance</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.drawerItem}
              onPress={() => navigateToScreen('billing')}>
              <SVG.IconProfile />
              <Text style={styles.drawerText}>Billing/subscription</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.drawerItem}
              onPress={onPressHandler}>
              <SVG.IconProfile />
              <Text style={styles.drawerText}>
                {a?.user?.gym?.status
                  ? 'Switch to Gym Profile'
                  : 'Become Gym Owner'}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.drawerItem}
              onPress={() => navigateToScreen('Settings')}>
              <SVG.Setting />
              <Text style={styles.drawerText}>Settings</Text>
            </TouchableOpacity>
          </View>
        </Modal>

        <View style={styles.toggle1}>
          <TouchableOpacity
            onPress={() => {
              setCalendarMode('from');
              setCalendarVisible(true);
            }}
            style={styles.dateButton}>
            <Text style={styles.toggleText1}>{fromDate || 'From'}</Text>
            <SVG.SmallCal />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => {
              setCalendarMode('to');
              setCalendarVisible(true);
            }}
            style={styles.dateButton}>
            <Text style={styles.toggleText1}>{toDate || 'To'}</Text>
            <SVG.SmallCal />
          </TouchableOpacity>

          <Modal
            visible={calendarVisible}
            transparent
            animationType="fade"
            onRequestClose={() => setCalendarVisible(false)}>
            <TouchableWithoutFeedback onPress={() => setCalendarVisible(false)}>
              <View style={styles.calendarOverlay} />
            </TouchableWithoutFeedback>
            <View style={styles.calendarContainer}>
              <Calendar
                onDayPress={handleDateSelect}
                markedDates={
                  calendarMode === 'from' && fromDate
                    ? {[fromDate]: {selected: true, selectedColor: Colors.red}}
                    : calendarMode === 'to' && toDate
                    ? {[toDate]: {selected: true, selectedColor: Colors.red}}
                    : {}
                }
                theme={{
                  selectedDayBackgroundColor: Colors.red,
                  todayTextColor: Colors.red,
                }}
              />
            </View>
          </Modal>
          <TouchableOpacity
            style={{
              backgroundColor: Colors.white,
              borderRadius: 4,
              flexDirection: 'row',
            }}>
            <Text style={styles.toggleText1}>Type</Text>
            <View style={{top: 8, right: 4}}>
              <SVG.VectorArr />
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            style={{
              backgroundColor: Colors.white,
              borderRadius: 4,
              flexDirection: 'row',
            }}>
            <Text style={styles.toggleText1}>Position</Text>
            <View style={{top: 8, right: 4}}>
              <SVG.VectorArr />
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            style={{
              backgroundColor: Colors.white,
              borderRadius: 4,
              flexDirection: 'row',
            }}>
            <Text style={styles.toggleText1}>technique</Text>
            <View style={{top: 8, right: 4}}>
              <SVG.VectorArr />
            </View>
          </TouchableOpacity>
        </View>

        <Text style={styles.sectionTitle}>Training Frequency</Text>

        {isValidDailyData ? (
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <LineChart
              data={lineData}
              width={screenWidth * 1.5}
              height={hp((298.79 / 919) * 100)}
              chartConfig={chartConfig}
              bezier
              style={styles.chart}
              verticalLabelRotation={30}
            />
          </ScrollView>
        ) : (
          <Text style={{color: 'white'}}>No training data available yet</Text>
        )}

        <Text style={styles.sectionTitle}>Time Distribution</Text>
        {isValidRawData ? (
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View>
              <LineChart
                data={TimeData}
                width={screenWidth - 24}
                height={hp((298.79 / 919) * 100)}
                chartConfig={chartConfig}
                style={styles.chart}
                bezier
                verticalLabelRotation={30}
              />
              <View style={styles.legendContainer}>
                {uniqueTypes.map((type, index) => (
                  <View key={index} style={styles.legendItem}>
                    <View
                      style={[
                        styles.colorDot,
                        {
                          backgroundColor:
                            colorPalette[index % colorPalette.length],
                        },
                      ]}
                    />
                    <Text style={{color: Colors.black}}>{type}</Text>
                  </View>
                ))}
              </View>
            </View>
          </ScrollView>
        ) : (
          <Text style={{color: 'white'}}>No training data available yet</Text>
        )}

        <Text
          style={{
            color: Colors.white,
            fontSize: 20,
            fontFamily: Fonts.normal,
            marginVertical: 10,
          }}>
          Techniques Mastered
        </Text>
        <View style={{backgroundColor: 'white', borderRadius: 16}}>
          <View style={styles.techniqueRow1}>
            <Text style={styles.techniqueText1}>Technique 1</Text>
            <Text style={styles.techniqueText1}>Technique 2</Text>
            <Text style={styles.techniqueText1}>Technique 3</Text>
            <Text style={styles.techniqueText1}>Technique 4</Text>
          </View>

          <View style={styles.techniqueRow1}>
            <Text style={styles.techniqueText1}>Technique 5</Text>
            <Text style={styles.techniqueText1}>Technique 6</Text>
            <Text style={styles.techniqueText1}>Technique 7</Text>
            <Text style={styles.techniqueText1}>Technique 8</Text>
          </View>

          <BarChart
            data={barData}
            width={screenWidth - 24}
            height={hp((255.09 / 919) * 100)}
            chartConfig={chartConfig}
            style={styles.chart1}
            verticalLabelRotation={35}
            showValuesOnTopOfBars={true}
            withVerticalLabels={false}
          />
        </View>

        <View style={styles.statsContainer}>
          {sessionStats.map((stat, index) => (
            <TouchableOpacity key={index} style={styles.statCard}>
              <View
                style={{
                  backgroundColor: Colors.red,
                  height: 36,
                  width: 36,
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderRadius: 4,
                }}>
                <stat.svg />
              </View>
              <Text style={styles.statValue}>
                {stat.value}
                {'\n'}
                <Text style={styles.statLabel}>{stat.label}</Text>
              </Text>
              <SVG.RoundVector
                style={{position: 'absolute', right: 6, top: 10}}
              />
            </TouchableOpacity>
          ))}

          {dashboardData?.analytics?.training_types &&
            dashboardData?.analytics?.training_types?.map((stat, index) => (
              <TouchableOpacity key={index} style={styles.statCard}>
                <View
                  style={{
                    backgroundColor: Colors.red,
                    height: 36,
                    width: 36,
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderRadius: 4,
                  }}>
                  <SVG.Count1 />
                </View>
                <Text style={styles.statValue}>
                  {stat.count}
                  {'\n'}
                  <Text style={styles.statLabel}>{stat.name}</Text>
                </Text>
                <SVG.RoundVector
                  style={{position: 'absolute', right: 6, top: 10}}
                />
              </TouchableOpacity>
            ))}
          {/* </View> */}
        </View>
      </ScrollView>

      <TouchableOpacity
        style={styles.plusButton}
        onPress={() => navigation.navigate('LogScreen')}>
        <SVG.RedPlus />
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.black,
    padding: 2,
  },
  scrollContent: {
    paddingHorizontal: 10,
  },
  header: {
    marginBottom: 20,
    flexDirection: 'row',
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.white,
    alignSelf: 'center',
    marginStart: 8,
  },
  headerText: {
    fontSize: 12,
    color: Colors.gray,
    fontWeight: '500',
  },
  iconStyle: {
    flexDirection: 'row',
    position: 'absolute',
    right: 10,
    gap: 15,
    alignSelf: 'center',
  },
  toggle: {
    flexDirection: 'row',
    margin: 5,
    overflow: 'hidden',
    borderRadius: 8,
    gap: 2,
  },
  toggleButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    backgroundColor: Colors.white,
  },
  toggleText: {
    fontSize: 16,
    color: Colors.black,
    fontFamily: Fonts.normal,
    textAlign: 'center',
  },
  toggle1: {
    gap: 2.5,
    flexDirection: 'row',
    alignSelf: 'center',
  },
  toggleText1: {
    fontSize: 12,
    fontFamily: Fonts.normal,
    paddingHorizontal: 11,
    padding: 5,
    borderRadius: 4,
  },
  sectionTitle: {
    fontSize: 20,
    fontFamily: Fonts.normal,
    marginVertical: 10,
    color: Colors.white,
  },
  chart: {
    borderRadius: 16,
    marginBottom: 5,
    backgroundColor: 'transparent',
  },
  statsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginTop: 15,
  },
  statCard: {
    flexDirection: 'row',
    backgroundColor: Colors.white,
    padding: wp(4),
    marginBottom: hp(0.8),
    borderRadius: 8,
    alignItems: 'center',
    width: wp(46.5),
    height: hp(9.5),
  },
  statValue: {
    fontSize: 20,
    color: Colors.black,
    fontWeight: 'bold',
    marginLeft: wp(4),
  },
  statLabel: {
    fontSize: 14,
    color: Colors.gray,
    textAlign: 'center',
    fontWeight: Fonts.normal,
  },
  plusButton: {
    position: 'absolute',
    alignSelf: 'flex-end',
    bottom: 0,
  },
  sectionTitle1: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  techniqueRow1: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 10,
  },
  techniqueText1: {
    fontSize: 12,
    fontWeight: '400',
    marginTop: 5,
  },
  dateButton: {
    flexDirection: 'row',
    backgroundColor: Colors.white,
    borderRadius: 4,
    alignItems: 'center',
  },
  calendarOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.85)',
  },
  calendarContainer: {
    position: 'absolute',
    left: 0,
    right: 0,
    backgroundColor: Colors.white,
    borderRadius: 12,
    alignSelf: 'center',
    padding: 16,
    marginTop: '50%',
  },

  chart1: {
    marginTop: 20,
    borderRadius: 8,
  },
  drawerOverlay: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.85)',
  },
  drawer: {
    position: 'absolute',
    top: 0,
    right: 0,
    backgroundColor: Colors.white,
    borderRadius: 20,
    width: wp((250 / 430) * 100),
    height: hp((500 / 919) * 100),
    padding: 20,
    margin: 15,
  },
  drawerItem1: {
    flexDirection: 'row',
    marginTop: 35,
  },
  drawerItem: {
    flexDirection: 'row',
    marginTop: 15,
  },
  drawerText: {
    fontSize: 16,
    fontFamily: Fonts.normal,
    marginLeft: 10,
  },
  closeButton: {
    position: 'absolute',
    top: 30,
    right: 15,
  },
  legendContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-end',
    position: 'absolute',
    right: 10,
    top: 10,
    paddingHorizontal: 10,
  },

  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 12,
    marginBottom: 6,
    gap: 5,
  },

  colorDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: 'red',
  },
});

export default HomeScreen;
