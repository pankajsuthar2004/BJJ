import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  ScrollView,
} from 'react-native';
import {Dimensions} from 'react-native';
import IMAGES from '../../assets/images';
import Colors from '../../theme/color';
import SVG from '../../assets/svg';
import {hp, wp} from '../../utility/ResponseUI';
import {Fonts} from '../../assets/fonts';
import {useNavigation} from '@react-navigation/native';
import {LineChart} from 'react-native-chart-kit';
import makeRequest from '../../api/http';
import {EndPoints} from '../../api/config';
import {showToast} from '../../utility/Toast';
import {useAppDispatch, useAppSelector} from '../../store/Hooks';
import moment from 'moment';
import AppLoader from '../../components/AppLoader';

const screenWidth = Dimensions.get('window').width;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.black,
    padding: 12,
  },
  main: {
    flexDirection: 'row',
    gap: 10,
  },
  btnView: {
    flexDirection: 'row',
    backgroundColor: Colors.white,
    padding: 12,
    flex: 1,
    borderRadius: 8,
    marginBottom: 20,
    justifyContent: 'space-between',
  },
  toggleButton: {
    padding: 7,
    alignItems: 'center',
  },
  activeButton: {
    backgroundColor: Colors.red,
    borderRadius: 8,
  },
  toggleText: {
    color: Colors.black,
    fontFamily: Fonts.normal,
  },
  activeText: {
    color: Colors.white,
    fontFamily: Fonts.normal,
  },
  chartContainer: {
    borderRadius: 20,
    marginBottom: 10,
    // marginRight: -8,
    backgroundColor: 'white',
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
  chart: {
    borderRadius: 16,
    marginBottom: 5,
    backgroundColor: 'transparent',
    marginRight: 5,
  },
  list: {
    fontSize: 16,
    color: Colors.white,
  },
  listMsg: {
    fontSize: 12,
    color: Colors.gray,
  },
  statusContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  status1: {
    color: Colors.green,
    fontSize: 16,
  },
  status2: {
    color: Colors.yellow,
    fontSize: 16,
  },
});

const PricingDashboardScreen = () => {
  const a = useAppSelector(b => b.user);
  const navigation = useNavigation();
  const [selectedButton, setSelectedButton] = useState('monthly');
  const [paymentData, setPaymentData] = useState([]);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(false);
  const dispatch = useAppDispatch();
  const [graphData, setGraphData] = useState([]);
  useEffect(() => {
    fetchGymPayments();
  }, [a]);

  useEffect(() => {
    if (paymentData?.filter_by_period) {
      setSelectedButton(paymentData.filter_by_period);
      setGraphData(paymentData?.graph_data);
    }
  }, [paymentData]);

  const fetchGymPayments = async filter => {
    console.log('filter types', filter);
    try {
      setLoading(true);
      const queryParams = new URLSearchParams({
        filter: filter || selectedButton, // fallback to selectedButton if filter is undefined
      }).toString();

      const response = await makeRequest({
        endPoint: `${EndPoints.GymPayment}?${queryParams}`,
        method: 'GET',
      });

      console.log('Gym Payment Response:', response);
      if (response) {
        setPaymentData(response || []);
      } else {
        showToast('Something went wrong');
      }
    } catch (error) {
      showToast('Network error');
      console.log('Gym Payment API Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilter = item => {
    const lowerCaseFilter = item.toLowerCase();
    setSelectedButton(lowerCaseFilter);
    fetchGymPayments(lowerCaseFilter || selectedButton);
  };

  const getRevenueLabel = () => {
    switch ((paymentData?.filter_by_period || '').toLowerCase()) {
      case 'weekly':
        return 'Weekly Revenue';
      case 'monthly':
        return 'Monthly Revenue';
      case 'quarterly':
        return 'Quarterly Revenue';
      case 'yearly':
        return 'Yearly Revenue';
      default:
        return 'Revenue';
    }
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
        data:
          graphData && graphData.length === 12
            ? graphData.map(item => item.revenue)
            : Array(12).fill(0),
        color: () => Colors.red,
      },
    ],
  };
  console.log('filter_types', selectedButton);

  return (
    <ScrollView style={styles.container}>
      {loading && <AppLoader />}
      <View style={styles.header}>
        <TouchableOpacity>
          <Image source={IMAGES.ProfilePic2} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>
          {`Welcome ${a?.user?.name}\n`}
          <Text style={styles.headerText}>Dashboard</Text>
        </Text>
        <View style={styles.iconStyle}>
          <TouchableOpacity>
            <SVG.Bell />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.main}>
        <View style={styles.btnView}>
          {['Weekly', 'Monthly', 'Quarterly', 'Yearly'].map((item, index) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.toggleButton,
                selectedButton.toUpperCase() === item.toUpperCase() &&
                  styles.activeButton,
              ]}
              onPress={() => handleFilter(item)}>
              <Text
                style={[
                  styles.toggleText,
                  selectedButton.toUpperCase() === item.toUpperCase() &&
                    styles.activeText,
                ]}>
                {item}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity>
          <SVG.VectorWhite />
        </TouchableOpacity>
      </View>

      <View style={styles.chartContainer}>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            paddingHorizontal: 20,
            marginTop: 10,
          }}>
          <Text
            style={{
              color: Colors.gray,
              fontSize: 16,
              fontFamily: Fonts.normal,
              paddingLeft: 20,
            }}>
            {getRevenueLabel()}
          </Text>

          <View>
            <Text
              style={{
                color: Colors.black,
                fontSize: 24,
                fontWeight: '700',
              }}>
              ${paymentData?.current_period_revenue}
            </Text>
            <Text
              style={{
                color:
                  paymentData?.revenue_change_percentage > 0
                    ? Colors.green
                    : Colors.red,
                fontSize: 16,
                fontFamily: Fonts.normal,
                textAlign: 'right',
                marginTop: 10,
              }}>
              {paymentData?.revenue_change_percentage > 0 ? '+' : '-'}
              {Math.abs(paymentData?.revenue_change_percentage || 0).toFixed(2)}
              %
            </Text>
          </View>
        </View>

        <LineChart
          data={lineData}
          width={screenWidth - 20}
          height={hp((290.79 / 919) * 100)}
          chartConfig={chartConfig}
          bezier
          style={styles.chart}
        />
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
              color: Colors.white,
              fontSize: 16,
              fontFamily: Fonts.normal,
            }}>
            See All
          </Text>
        </TouchableOpacity>
      </View>

      <View style={{gap: 10, marginBottom: 25}}>
        {paymentData?.members_list?.map((member, index) => (
          <TouchableOpacity
            onPress={() =>
              navigation.navigate('Pupil', {user_id: member?.user?.id})
            }
            key={index}
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              backgroundColor: Colors.darkGray,
              padding: 15,
              borderRadius: 8,
            }}>
            <View style={{flexDirection: 'row', gap: 10, alignItems: 'center'}}>
              <Image source={IMAGES.ProfilePic} />
              <Text style={styles.list}>
                {member?.user?.name || 'User'}
                {'\n'}
                <Text style={styles.listMsg}>
                  {member?.membership_status || 'N/A'}
                </Text>
              </Text>
            </View>
            <View style={styles.statusContainer}>
              <Text
                style={
                  member?.membership_status?.toLowerCase() === 'paid'
                    ? styles.status1
                    : styles.status2
                }>
                {member?.membership_status || 'Pending'}
              </Text>
              <Text style={styles.listMsg}>
                {member?.valid_till
                  ? moment(member?.valid_till).format('MMM DD, YYYY')
                  : 'No Date'}
              </Text>
            </View>
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );
};

export default PricingDashboardScreen;
