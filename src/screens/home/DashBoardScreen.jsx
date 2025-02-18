import React, {useState} from 'react';
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
  TextInput,
} from 'react-native';
import {LineChart, BarChart} from 'react-native-chart-kit';
import {Dimensions} from 'react-native';
import Colors from '../../theme/color';
import IMAGES from '../../assets/images';
import {Fonts} from '../../assets/fonts';
import {useNavigation} from '@react-navigation/native';
import {hp, wp} from '../../utility/ResponseUI';
import SVG from '../../assets/svg';

const screenWidth = Dimensions.get('window').width;

const DashBoardScreen = () => {
  const navigation = useNavigation();
  const [isDrawerVisible, setIsDrawerVisible] = useState(false);
  const [search, setSearch] = useState('');
  const [filters, setFilters] = useState({
    paymentPending: false,
    active: false,
    paymentPaid: false,
    attendanceGreaterThan10: false,
    monthlySubscription: false,
    yearlySubscription: false,
  });
  const [isFiltersModalVisible, setIsFiltersModalVisible] = useState(false);
  const [isPreviousModalVisible, setIsPreviousModalVisible] = useState(false);

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

  const lineData = {
    labels: [
      'Jan',
      'Feb',
      'Mar',
      'Apr',
      'May',
      'Jun',
      'Jul',
      'Aug',
      'Sep',
      'Oct',
      'No',
      'Dec',
    ],
    datasets: [
      {
        data: [
          0, 34, 60, 23, 55, 20, 8, 100, 60, 40, 60, 5, 30, 49, 57, 29, 2, 32,
          13, 43,
        ],
        color: () => Colors.red,
      },
    ],
  };
  const OverTime = {
    labels: [
      'Jan',
      'Feb',
      'Mar',
      'Apr',
      'May',
      'Jun',
      'Jul',
      'Aug',
      'Sep',
      'Oct',
      'No',
      'Dec',
    ],
    datasets: [
      {
        data: [
          34, 8, 60, 23, 55, 20, 8, 100, 60, 40, 60, 5, 30, 49, 57, 29, 2, 32,
          13, 43,
        ],
        color: () => Colors.red,
      },
    ],
  };

  const TimeData = {
    labels: [
      'Jan',
      'Feb',
      'Mar',
      'Apr',
      'May',
      'Jun',
      'Jul',
      'Aug',
      'Sep',
      'Oct',
      'No',
      'Dec',
    ],
    datasets: [
      {
        data: [0, 25, 10, 38, 5, 33, 60, 3, 35, 29, 8, 29, 8, 5, 32, 2],
        color: () => Colors.red,
      },
      {
        data: [0, 6, 8, 1, 7, 14, 10, 4, 2, 9, 1, 9, 4, 6, 9, 0],
        color: () => `rgb(14, 14, 16)`,
        strokeWidth: 2,
      },
    ],
  };

  const data = {
    labels: [
      'cls',
      'cls',
      'cls',
      'cls',
      'cls',
      'cls',
      'cls',
      'cls',
      'cls',
      'cls',
      'cls',
      'cls',
    ],
    datasets: [
      {
        data: [80, 50, 75, 100, 60, 85, 75, 90, 23],
      },
    ],
  };

  const sessionStats = [
    {svg: SVG.Count11, value: '$750', label: 'Revenue'},
    {svg: SVG.Count12, value: '400', label: 'Pupils'},
    {svg: SVG.Count12, value: '350', label: 'Regular Pupils'},
    {svg: SVG.Count13, value: '$1200', label: 'Pending'},
    {svg: SVG.Count14, value: '29', label: 'Invited'},
    {svg: SVG.Count12, value: '28', label: 'New Pupil'},
    {svg: SVG.Count13, value: '385', label: 'Sub Monthly'},
    {svg: SVG.Count13, value: '15', label: 'Sub Yearly'},
  ];

  const subscriptions = [
    {
      name: 'Paul Watson',
      subscriptionType: 'Monthly Subscription',
      status: 'Paid',
      statusStyle: styles.status1,
      date: '17/12/24',
      image: IMAGES.Paul,
    },
    {
      name: 'John Manora',
      subscriptionType: 'Yearly Subscription',
      status: 'Pending',
      statusStyle: styles.status2,
      date: '17/12/24',
      image: IMAGES.Jhon,
    },
    {
      name: 'Shen Watson',
      subscriptionType: 'Yearly Subscription',
      status: 'Paid',
      statusStyle: styles.status1,
      date: '17/12/24',
      image: IMAGES.Shen,
    },
    {
      name: 'Smith Bewl',
      subscriptionType: 'Yearly Subscription',
      status: 'Pending',
      statusStyle: styles.status2,
      date: '17/12/24',
      image: IMAGES.Smith,
    },
    {
      name: 'Shen Watson',
      subscriptionType: 'Yearly Subscription',
      status: 'Paid',
      statusStyle: styles.status1,
      date: '17/12/24',
      image: IMAGES.ShenWat,
    },
  ];
  const menuItems = [
    {name: 'Home', icon: SVG.HomeIcon},
    {name: 'Pupil Management', icon: SVG.RiLine},
    {name: 'Payments', icon: SVG.Pay, onPress: toggleFiltersModal},
    {name: 'Attendance Tracking', icon: SVG.HugeIcons},
    {name: 'Prices', icon: SVG.Prices},
    {name: 'Timetable', icon: SVG.TimeEntry},
    {name: 'Invitations', icon: SVG.Invite},
    {name: 'Reports', icon: SVG.Report},
    {name: 'Log Out', icon: SVG.LogOutIcon},
  ];

  const handleLogOut = () => {
    navigation.reset({
      index: 0,
      routes: [{name: 'AuthStack', params: {screen: 'LoginScreen'}}],
    });
  };

  const toggleDrawer = () => {
    setIsDrawerVisible(!isDrawerVisible);
  };

  const handlePaymentsClick = () => {
    if (isDrawerVisible) {
      setIsDrawerVisible(false);
    }

    if (isPreviousModalVisible) {
      setIsPreviousModalVisible(false);
    }

    toggleFiltersModal();
  };

  const applyFilters = filterName => {
    setFilters(prevFilters => {
      const newFilters = {
        ...prevFilters,
        [filterName]: !prevFilters[filterName],
      };
      return newFilters;
    });
  };

  const resetFilters = () => {
    setFilters({
      paymentPending: false,
      active: false,
      paymentPaid: false,
      attendanceGreaterThan10: false,
      monthlySubscription: false,
      yearlySubscription: false,
    });
  };

  const toggleFiltersModal = () => {
    setIsFiltersModalVisible(!isFiltersModalVisible);
  };
  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <TouchableOpacity>
            <Image source={IMAGES.ProfilePic2} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>
            Welcome Back, Josh{'\n'}
            <Text style={styles.headerText}>Update are there</Text>
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
            {menuItems.map((item, index) => (
              <TouchableOpacity
                key={index}
                style={styles.drawerItem}
                onPress={() => {
                  switch (item.name) {
                    case 'Home':
                      navigation.navigate('HomeScreen');
                      break;

                    case 'Log Out':
                      handleLogOut();
                      break;

                    case 'Payments':
                      handlePaymentsClick();
                      break;

                    case 'Attendance Tracking':
                      navigation.navigate('Pupils Attendance');
                      break;

                    case 'Pupil Management':
                      navigation.navigate('Pupils Attendance');
                      break;

                    case 'Prices':
                      navigation.navigate('PricingDashboardScreen');
                      break;

                    case 'Timetable':
                      navigation.navigate('Timetable Management');
                      break;

                    case 'Invitations':
                      navigation.navigate('Invitation & Approval');
                      break;

                    case 'Reports':
                      navigation.navigate('Reports and Insights');
                      break;

                    default:
                      navigation.navigate(item.name);
                      break;
                  }
                }}>
                <item.icon />
                <Text style={styles.drawerText}>{item.name}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </Modal>

        <Modal
          visible={isFiltersModalVisible}
          transparent={true}
          animationType="fade"
          onRequestClose={() => setIsFiltersModalVisible(false)}>
          <TouchableWithoutFeedback
            onPress={() => setIsFiltersModalVisible(false)}>
            <Animated.View style={styles.drawerOverlay1}></Animated.View>
          </TouchableWithoutFeedback>
          <View style={styles.filterModal}>
            <TouchableOpacity
              style={styles.filterOption}
              onPress={() => applyFilters('paymentPending')}>
              <Text style={styles.filterText}>Payment Pending</Text>
              {filters.paymentPending ? <SVG.Tick /> : <SVG.EmptyTick />}
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.filterOption}
              onPress={() => applyFilters('active')}>
              <Text style={styles.filterText}>Active</Text>
              {filters.active ? <SVG.Tick /> : <SVG.EmptyTick />}
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.filterOption}
              onPress={() => applyFilters('paymentPaid')}>
              <Text style={styles.filterText}>Payment Paid</Text>
              {filters.paymentPaid ? <SVG.Tick /> : <SVG.EmptyTick />}
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.filterOption}
              onPress={() => applyFilters('attendanceGreaterThan10')}>
              <Text style={styles.filterText}>Attendance {'>'} 10</Text>
              {filters.attendanceGreaterThan10 ? (
                <SVG.Tick />
              ) : (
                <SVG.EmptyTick />
              )}
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.filterOption}
              onPress={() => applyFilters('monthlySubscription')}>
              <Text style={styles.filterText}>Monthly Subscription</Text>
              {filters.monthlySubscription ? <SVG.Tick /> : <SVG.EmptyTick />}
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.filterOption}
              onPress={() => applyFilters('yearlySubscription')}>
              <Text style={styles.filterText}>Yearly Subscription</Text>
              {filters.yearlySubscription ? <SVG.Tick /> : <SVG.EmptyTick />}
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.applyButton}
              onPress={() => setIsFiltersModalVisible(false)}>
              <Text style={styles.applyButtonText}>Apply Filters</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.resetButton} onPress={resetFilters}>
              <Text style={styles.resetButtonText}>Reset All Filters</Text>
            </TouchableOpacity>
          </View>
        </Modal>
        <View
          style={{
            flexDirection: 'row',
            gap: 15,
            alignSelf: 'center',
            alignItems: 'center',
          }}>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              position: 'relative',
            }}>
            <TextInput
              value={search}
              placeholder="search"
              onChangeText={setSearch}
              style={styles.search1}
            />
            <TouchableOpacity
              style={{
                position: 'absolute',
                right: 35,
                top: '50%',
                transform: [{translateY: -7}],
              }}>
              <SVG.Voice />
            </TouchableOpacity>
            <TouchableOpacity
              style={{
                position: 'absolute',
                right: 15,
                top: '50%',
                transform: [{translateY: -7}],
              }}>
              <SVG.Search />
            </TouchableOpacity>
          </View>
          <TouchableOpacity>
            <SVG.VectorLine />
          </TouchableOpacity>
        </View>
        <View>
          <Text style={styles.sectionTitle}>Monthly Revenue over time</Text>
          <LineChart
            data={lineData}
            width={screenWidth - 18}
            height={hp((298.79 / 919) * 100)}
            chartConfig={chartConfig}
            bezier
            style={styles.chart}
          />
        </View>
        <View>
          <Text style={styles.sectionTitle}>Students over time</Text>
          <LineChart
            data={OverTime}
            width={screenWidth - 18}
            height={hp((298.79 / 919) * 100)}
            chartConfig={chartConfig}
            style={styles.chart}
          />
        </View>

        <View>
          <Text style={styles.sectionTitle}>Paid and Unpaid Over time</Text>
          <LineChart
            data={TimeData}
            width={screenWidth - 18}
            height={hp((298.79 / 919) * 100)}
            chartConfig={chartConfig}
            style={styles.chart}
            bezier
          />
        </View>

        <Text
          style={{
            color: Colors.white,
            fontSize: 20,
            fontFamily: Fonts.normal,
            marginVertical: 10,
          }}>
          Students per class Over Time
        </Text>

        <BarChart
          data={data}
          width={screenWidth - 18}
          height={250}
          fromZero={true}
          chartConfig={chartConfig}
          style={styles.chart}
        />

        <Text style={styles.sectionTitle}>Students over time</Text>
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
        </View>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginVertical: 10,
          }}>
          <Text
            style={{
              color: Colors.white,
              fontSize: 20,
              fontFamily: Fonts.normal,
            }}>
            Pupils
          </Text>
          <TouchableOpacity>
            <Text
              style={{
                color: Colors.red,
                fontSize: 16,
                fontFamily: Fonts.normal,
              }}>
              See All
            </Text>
          </TouchableOpacity>
        </View>
        <View style={{gap: 10}}>
          {subscriptions.map((subscription, index) => (
            <View
              key={index}
              style={[
                styles.listView,
                {flexDirection: 'row', justifyContent: 'space-between'},
              ]}>
              <View style={{flexDirection: 'row', gap: 10}}>
                <Image source={subscription.image} />
                <Text style={styles.list}>
                  {subscription.name}
                  {'\n'}
                  <Text style={styles.listMsg}>
                    {subscription.subscriptionType}
                  </Text>
                </Text>
              </View>
              <View style={styles.statusContainer}>
                <Text style={subscription.statusStyle}>
                  {subscription.status}
                </Text>
                <Text style={styles.listMsg}>{subscription.date}</Text>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.black,
  },
  scrollContent: {
    padding: 10,
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
    flex: 1,
    flexDirection: 'row',
    margin: 5,
    gap: 2,
  },
  toggleButton: {
    borderRadius: 8,
    alignSelf: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.pink,
    width: wp((131 / 430) * 100),
    height: hp((40 / 919) * 100),
  },
  toggleText: {
    fontSize: 16,
    color: Colors.black,
    fontFamily: Fonts.normal,
    textAlign: 'center',
  },
  toggle1: {
    gap: 5,
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
  drawerOverlay1: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.85)',
    marginTop: '20%',
  },
  drawer: {
    position: 'absolute',
    top: 0,
    right: 20,
    backgroundColor: Colors.white,
    borderRadius: 20,
    padding: 20,
  },
  drawerItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
  },
  drawerText: {
    fontSize: 16,
    fontFamily: Fonts.normal,
    marginLeft: 15,
    color: Colors.black,
  },
  closeButton: {
    position: 'absolute',
    top: 4,
    right: 10,
    paddingBottom: 10,
  },
  search1: {
    backgroundColor: Colors.white,
    borderRadius: 8,
    width: wp((340 / 430) * 100),
    height: hp((42 / 919) * 100),
    marginVertical: 4,
    paddingHorizontal: 15,
    justifyContent: 'center',
    alignSelf: 'center',
  },
  listView: {
    backgroundColor: Colors.darkGray,
    borderRadius: 8,
    alignItems: 'center',
    padding: 5,
  },
  list: {
    fontSize: 16,
    color: Colors.white,
  },
  listMsg: {
    fontSize: 12,
    color: Colors.gray,
  },
  status1: {
    color: Colors.green,
    fontSize: 16,
  },
  status2: {
    color: Colors.yellow,
    fontSize: 16,
  },
  statusContainer: {
    alignItems: 'flex-end',
  },
  filterOption: {
    padding: 8,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  filterText: {
    color: Colors.black,
    fontFamily: Fonts.normal,
    flex: 1,
  },
  applyButton: {
    backgroundColor: Colors.red,
    justifyContent: 'center',
    alignSelf: 'center',
    borderRadius: 8,
    width: wp((218 / 430) * 100),
    height: hp((36 / 919) * 100),
    marginTop: 10,
  },
  resetButton: {
    paddingVertical: 15,
  },
  applyButtonText: {
    color: Colors.white,
    fontSize: 16,
    textAlign: 'center',
  },
  resetButtonText: {
    color: Colors.red,
    fontSize: 16,
    textAlign: 'center',
  },
  filterModal: {
    backgroundColor: Colors.white,
    width: wp((250 / 430) * 100),
    height: hp((410 / 919) * 100),
    borderRadius: 16,
    top: '10%',
    position: 'absolute',
    right: 20,
    padding: 20,
  },
});

export default DashBoardScreen;
