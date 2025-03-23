import React, {useState} from 'react';
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
    marginRight: -8,
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
    alignItems: 'flex-end',
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
const PricingDashboardScreen = () => {
  const navigation = useNavigation();
  const [selectedButton, setSelectedButton] = useState('Monthly');

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

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity>
          <Image source={IMAGES.ProfilePic2} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>
          Welcome Josh{'\n'}
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
                selectedButton === item && styles.activeButton,
              ]}
              onPress={() => setSelectedButton(item)}>
              <Text
                style={[
                  styles.toggleText,
                  selectedButton === item && styles.activeText,
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
              // marginBottom: 10,
            }}>
            Monthly Revenue
          </Text>
          <View>
            <Text
              style={{
                color: Colors.black,
                fontSize: 24,
                fontWeight: '700',
              }}>
              $2,654
            </Text>
            <Text
              style={{
                color: Colors.green,
                fontSize: 16,
                fontFamily: Fonts.normal,
                textAlign: 'right',
                marginTop: 10,
              }}>
              +36%
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
        {subscriptions.map((subscription, index) => (
          <TouchableOpacity
            onPress={() => navigation.navigate('Pupil')}
            key={index}
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              backgroundColor: Colors.darkGray,
              padding: 15,
              borderRadius: 8,
            }}>
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
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );
};

export default PricingDashboardScreen;
