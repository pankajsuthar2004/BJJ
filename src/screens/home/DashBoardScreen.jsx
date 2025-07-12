import React, {useCallback, useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Modal,
  TouchableWithoutFeedback,
  Animated,
  TextInput,
  SafeAreaView,
} from 'react-native';
import {LineChart, BarChart} from 'react-native-chart-kit';
import {Dimensions} from 'react-native';
import Colors from '../../theme/color';
import IMAGES from '../../assets/images';
import {Fonts} from '../../assets/fonts';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import {hp, wp} from '../../utility/ResponseUI';
import SVG from '../../assets/svg';
import {useAppSelector} from '../../store/Hooks';
import makeRequest from '../../api/http';
import {EndPoints} from '../../api/config';

const screenWidth = Dimensions.get('window').width;

const DashBoardScreen = () => {
  const a = useAppSelector(b => b.user);
  const navigation = useNavigation();
  const [isDrawerVisible, setIsDrawerVisible] = useState(false);
  const [search, setSearch] = useState('');
  const [dashboardData, setDashboardData] = useState({});
  const [loading, setLoading] = useState(false);
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

  useFocusEffect(
    useCallback(() => {
      fetchDashboardData();
    }, [filters]),
  );

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const queryParams = [];

      if (filters.paymentPending) queryParams.push('payment_status=pending');
      if (filters.paymentPaid) queryParams.push('payment_status=paid');
      if (filters.active) queryParams.push('status=active');
      if (filters.attendanceGreaterThan10) queryParams.push('attendance_gt=10');
      if (filters.monthlySubscription)
        queryParams.push('subscription_type=monthly');
      if (filters.yearlySubscription)
        queryParams.push('subscription_type=yearly');

      const queryString = queryParams.length ? `?${queryParams.join('&')}` : '';
      const fullEndpoint = `${EndPoints.GymDashboard}${queryString}`;

      console.log('FILTERS:', filters);
      console.log('API QUERY:', fullEndpoint);

      const res = await makeRequest({endPoint: fullEndpoint, method: 'GET'});

      const data = res || {};

      console.log('Response pupils_list:', res?.pupils_list);
      console.log(
        'Statuses:',
        res?.pupils_list?.map(p => p.payment_status),
      );

      setDashboardData({
        revenue: data.revenue ?? 0,
        pupils: data.pupils ?? 0,
        regular_pupils: data.regular_pupils ?? 0,
        pending: data.pending ?? 0,
        invited: data.invited ?? 0,
        new_pupils: data.new_pupils ?? 0,
        unpaid_users: data.unpaid_users ?? 0,
        monthly_revenue: Array.isArray(data.monthly_revenue)
          ? data.monthly_revenue
          : [],
        gym_members_month: data.gym_members_month ?? {},
        gym_paid_unpaid_monthly: data.gym_paid_unpaid_monthly ?? {},
        students_per_class: Array.isArray(data.students_per_class)
          ? data.students_per_class
          : [],
        plans: Array.isArray(data.plans) ? data.plans : [],
        pupils_list: Array.isArray(data.pupils_list) ? data.pupils_list : [],
      });
    } catch (error) {
      console.log('Failed to fetch dashboard data', error);
    } finally {
      setLoading(false);
    }
  };

  const chartConfig = {
    backgroundColor: Colors.white,
    backgroundGradientFrom: Colors.white,
    backgroundGradientTo: Colors.white,
    decimalPlaces: 0,
    color: (opacity = 1) => `rgba(255, 0, 0, ${opacity})`,
    labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
    fillShadowGradient: Colors.red,
    fillShadowGradientOpacity: 0,
    propsForLabels: {
      fontSize: 10,
      textAnchor: 'middle',
    },
    propsForVerticalLabels: {
      fontSize: 11,
      textAnchor: 'middle',
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
        data: Array.isArray(dashboardData?.monthly_revenue)
          ? dashboardData?.monthly_revenue.map(item => item.revenue ?? 0)
          : Array(12).fill(0),
        color: () => Colors.red,
      },
    ],
  };
  const months = [
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
    'Nov',
    'Dec',
  ];

  const monthIndexMap = {
    Jan: 0,
    Feb: 1,
    Mar: 2,
    Apr: 3,
    May: 4,
    Jun: 5,
    Jul: 6,
    Aug: 7,
    Sep: 8,
    Oct: 9,
    Nov: 10,
    Dec: 11,
  };

  const fullUsersArray = Array(12).fill(0);

  if (Array.isArray(dashboardData?.gym_members_month)) {
    dashboardData.gym_members_month.forEach(item => {
      const index = monthIndexMap[item.month];
      if (index !== undefined) {
        fullUsersArray[index] = item.users ?? 0;
      }
    });
  }

  const OverTime = {
    labels: months,
    datasets: [
      {
        data: fullUsersArray,
        color: () => Colors.red,
      },
    ],
  };
  const paidUnpaidMonths = [
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
    'Nov',
    'Dec',
  ];

  const monthMap = {
    Jan: 0,
    Feb: 1,
    Mar: 2,
    Apr: 3,
    May: 4,
    Jun: 5,
    Jul: 6,
    Aug: 7,
    Sep: 8,
    Oct: 9,
    Nov: 10,
    Dec: 11,
  };

  const paidArray = Array(12).fill(0);
  const unpaidArray = Array(12).fill(0);

  if (Array.isArray(dashboardData?.gym_paid_unpaid_monthly)) {
    dashboardData.gym_paid_unpaid_monthly.forEach(item => {
      const index = monthMap[item.month];
      if (index !== undefined) {
        paidArray[index] = parseInt(item.paid ?? 0);
        unpaidArray[index] = parseInt(item.unpaid ?? 0);
      }
    });
  }

  const TimeData = {
    labels: paidUnpaidMonths,
    datasets: [
      {
        data: paidArray,
        color: () => Colors.red,
      },
      {
        data: unpaidArray,
        color: () => Colors.darkGray,
        strokeWidth: 2,
      },
    ],
  };

  const data = {
    labels: ['cls', 'cls', 'cls', 'cls', 'cls', 'cls'],
    datasets: [{data: [80, 50, 75, 100]}],
  };
  const classLabels = Array.isArray(dashboardData?.students_per_class)
    ? dashboardData.students_per_class.map(item =>
        item.training_type.length > 8
          ? item.training_type.substring(0, 8) + '...'
          : item.training_type,
      )
    : [];

  const classData = Array.isArray(dashboardData?.students_per_class)
    ? dashboardData.students_per_class.map(item => item.students ?? 0)
    : [];

  const formattedBarChartData = {
    labels: classLabels,
    datasets: [
      {
        data: classData,
      },
    ],
  };

  const sessionStats = [
    {svg: SVG.Count11, value: dashboardData?.revenue, label: 'Revenue'},
    {svg: SVG.Count12, value: dashboardData?.pupils, label: 'Pupils'},
    {
      svg: SVG.Count12,
      value: dashboardData?.regular_pupils,
      label: 'Regular Pupils',
    },
    {svg: SVG.Count13, value: dashboardData?.pending, label: 'Pending'},
    {svg: SVG.Count14, value: dashboardData?.invited, label: 'Invited'},
    {svg: SVG.Count12, value: dashboardData?.new_pupils, label: 'New Pupil'},
    // {svg: SVG.Count13, value: '385', label: 'Sub Monthly'},
    // {svg: SVG.Count13, value: '15', label: 'Sub Yearly'},
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
    {name: 'Messages', icon: SVG.Invite},
    {name: 'Gym Profile', icon: SVG.Report},
    {name: 'Switch to User', icon: SVG.Report},
  ];

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
            <Image
              source={
                a?.user?.image ? {uri: a?.user?.image} : IMAGES.ProfilePic2
              }
              style={{height: hp(5), width: hp(5), borderRadius: hp(6)}}
            />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>
            {a?.user?.gym?.name}
            {'\n'}
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
                      break;

                    case 'Payments':
                      // handlePaymentsClick();
                      navigation.navigate('PricingDashboardScreen');
                      break;

                    case 'Attendance Tracking':
                      navigation.navigate('Pupils Attendance');
                      break;

                    case 'Pupil Management':
                      // navigation.navigate('Pupils Attendance');
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
                    case 'Gym Profile':
                      navigation.navigate('gym profile');
                      break;
                    case 'Switch to User':
                      navigation.navigate('HomeScreen');
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
              style={[styles.search1, {paddingRight: 60}]}
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
          <TouchableOpacity onPress={handlePaymentsClick}>
            <SVG.VectorLine />
          </TouchableOpacity>
        </View>
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
              {filters.paymentPending ? <SVG.FilterTick /> : <SVG.EmptyTick />}
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.filterOption}
              onPress={() => applyFilters('active')}>
              <Text style={styles.filterText}>Active</Text>
              {filters.active ? <SVG.FilterTick /> : <SVG.EmptyTick />}
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.filterOption}
              onPress={() => applyFilters('paymentPaid')}>
              <Text style={styles.filterText}>Payment Paid</Text>
              {filters.paymentPaid ? <SVG.FilterTick /> : <SVG.EmptyTick />}
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.filterOption}
              onPress={() => applyFilters('attendanceGreaterThan10')}>
              <Text style={styles.filterText}>Attendance {'>'} 10</Text>
              {filters.attendanceGreaterThan10 ? (
                <SVG.FilterTick />
              ) : (
                <SVG.EmptyTick />
              )}
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.filterOption}
              onPress={() => applyFilters('monthlySubscription')}>
              <Text style={styles.filterText}>Monthly Subscription</Text>
              {filters.monthlySubscription ? (
                <SVG.FilterTick />
              ) : (
                <SVG.EmptyTick />
              )}
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.filterOption}
              onPress={() => applyFilters('yearlySubscription')}>
              <Text style={styles.filterText}>Yearly Subscription</Text>
              {filters.yearlySubscription ? (
                <SVG.FilterTick />
              ) : (
                <SVG.EmptyTick />
              )}
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.applyButton}
              onPress={() => {
                setIsFiltersModalVisible(false);
                fetchDashboardData();
              }}>
              <Text style={styles.applyButtonText}>Apply Filters</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.resetButton} onPress={resetFilters}>
              <Text style={styles.resetButtonText}>Reset All Filters</Text>
            </TouchableOpacity>
          </View>
        </Modal>
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
          <View style={styles.legendContainer}>
            <View style={styles.legendItem}>
              <Text style={{color: Colors.red}}>Paid</Text>
            </View>
            <View style={styles.border} />
            <View style={styles.legendItem}>
              <Text style={{color: Colors.darkGray}}>Unpaid</Text>
            </View>
          </View>
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
          data={formattedBarChartData}
          width={screenWidth - 18}
          height={300}
          fromZero
          chartConfig={{
            ...chartConfig,
            propsForVerticalLabels: {
              ...chartConfig.propsForVerticalLabels,
              rotation: -45,
              fontSize: 10,
            },
          }}
          verticalLabelRotation={45}
          showValuesOnTopOfBars={true}
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
                {stat.label === 'Revenue' || stat.label === 'Pending'
                  ? `$${stat.value}`
                  : stat.value}
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
          {dashboardData &&
            dashboardData?.pupils_list?.map((subscription, index) => (
              <View
                key={index}
                style={[
                  styles.listView,
                  {flexDirection: 'row', justifyContent: 'space-between'},
                ]}>
                <View style={{flexDirection: 'row', gap: 10}}>
                  <Image
                    source={
                      subscription.user_image
                        ? {uri: subscription.user_image}
                        : IMAGES?.ProfilePic
                    }
                    style={{height: 45, width: 45, borderRadius: 20}}
                  />
                  <Text style={styles.list}>
                    {subscription.user_name}
                    {'\n'}
                    <Text style={styles.listMsg}>{subscription.plan_name}</Text>
                  </Text>
                </View>
                <View style={styles.statusContainer}>
                  <Text
                    style={
                      subscription.payment_status?.toLowerCase() === 'paid'
                        ? styles.status1
                        : styles.status2
                    }>
                    {subscription.payment_status}
                  </Text>
                  <Text style={styles.listMsg}>{subscription.valid_till}</Text>
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
    top: 25,
    right: 10,
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
    marginVertical: 8,
    paddingHorizontal: 15,
    justifyContent: 'center',
    alignSelf: 'center',
    fontSize: 13,
  },
  listView: {
    backgroundColor: Colors.darkGray,
    borderRadius: 8,
    alignItems: 'center',
    padding: 18,
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
    height: hp((415 / 919) * 100),
    borderRadius: 16,
    top: '9.7%',
    position: 'absolute',
    right: 15,
    padding: 15,
  },
  legendContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    position: 'absolute',
    right: 10,
    top: 55,
  },
  border: {
    width: 1,
    height: 20,
    backgroundColor: Colors.gray,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 10,
    gap: 5,
  },
});

export default DashBoardScreen;
