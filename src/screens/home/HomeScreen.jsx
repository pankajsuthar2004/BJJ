import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  SafeAreaView,
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

const HomeScreen = () => {
  const navigation = useNavigation();
  const [selectedToggle, setSelectedToggle] = useState('');

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
      '7/12/24',
      '8/12/24',
      '9/12/24',
      '10/12/24',
      '11/12/24',
      '12/12/24',
      '13/12/24',
    ],
    datasets: [
      {
        data: [0, 60, 55, 20, 8, 100, 60, 5, 30, 49, 57, 29, 2, 32, 13, 43],
        color: () => Colors.red,
      },
    ],
  };

  const TimeData = {
    labels: [
      '7/12/24',
      '8/12/24',
      '9/12/24',
      '10/12/24',
      '11/12/24',
      '12/12/24',
      '13/12/24',
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

  const barData = {
    datasets: [
      {
        data: [40, 88, 80, 61, 49, 35, 73, 25],
        backgroundColor: [
          'rgba(116, 8, 31, 0.94)',
          'rgba(54, 162, 235, 0.6)',
          'rgba(255, 206, 86, 0.6)',
          'rgba(75, 192, 192, 0.6)',
          'rgba(153, 102, 255, 0.6)',
          'rgba(255, 159, 64, 0.6)',
          'rgba(201, 203, 207, 0.6)',
          'rgba(54, 162, 235, 0.6)',
        ],
      },
    ],
  };

  const sessionStats = [
    {svg: SVG.Count1, value: 20, label: 'Sessions Count'},
    {svg: SVG.Count2, value: 10, label: 'Gi Count'},
    {svg: SVG.Count3, value: 8, label: 'No Gi Count'},
    {svg: SVG.Count4, value: 19, label: 'Tech Learned'},
    {svg: SVG.Count5, value: 3, label: 'Sub Achieved'},
    {svg: SVG.Count6, value: 6, label: 'Sub Conceded'},
    {svg: SVG.Count6, value: 7, label: 'Pos Achieved'},
    {svg: SVG.Count5, value: 12, label: 'Pos Conceded'},
  ];

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <TouchableOpacity>
            <Image source={IMAGES.ProfilePic} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>
            Welcome Josh{'\n'}
            <Text style={styles.headerText}>The Next Level Starts Now</Text>
          </Text>
          <View style={styles.iconStyle}>
            <TouchableOpacity>
              <SVG.Bell />
            </TouchableOpacity>
            <TouchableOpacity>
              <SVG.Line />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.toggle}>
          {['Weekly', 'Monthly', 'Quarterly'].map(toggle => (
            <TouchableOpacity
              key={toggle}
              style={[
                styles.toggleButton,
                selectedToggle === toggle && {backgroundColor: Colors.red},
              ]}
              onPress={() => setSelectedToggle(toggle)}>
              <Text
                style={[
                  styles.toggleText,
                  selectedToggle === toggle && {color: Colors.white},
                ]}>
                {toggle}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
        <View style={styles.toggle1}>
          <TouchableOpacity style={{flexDirection: 'row'}}>
            <Text style={styles.toggleText1}>from</Text>
          </TouchableOpacity>
          <TouchableOpacity>
            <Text style={styles.toggleText1}>to</Text>
          </TouchableOpacity>
          <TouchableOpacity>
            <Text style={styles.toggleText1}>
              Type <SVG.VectorArr />
            </Text>
          </TouchableOpacity>
          <TouchableOpacity>
            <Text style={styles.toggleText1}>
              Position <SVG.VectorArr />
            </Text>
          </TouchableOpacity>
          <TouchableOpacity>
            <Text style={styles.toggleText1}>
              technique <SVG.VectorArr />
            </Text>
          </TouchableOpacity>
        </View>

        <View>
          <Text style={styles.sectionTitle}>Training Frequency</Text>
          <LineChart
            data={lineData}
            width={screenWidth - 20}
            height={hp((273.79 / 919) * 100)}
            chartConfig={chartConfig}
            bezier
            style={styles.chart}
            verticalLabelRotation={30}
          />
        </View>

        <View>
          <Text style={styles.sectionTitle}>
            Time Distribution (Gi vs No Gi)
          </Text>
          <LineChart
            data={TimeData}
            width={screenWidth - 20}
            height={hp((298.79 / 919) * 100)}
            chartConfig={chartConfig}
            style={styles.chart}
            bezier
            verticalLabelRotation={30}
          />
        </View>

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
            width={screenWidth - 19}
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
              <stat.svg />
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
    backgroundColor: Colors.white,
    paddingHorizontal: 14,
    padding: 6,
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
    marginTop: 10,
  },
  statCard: {
    flexDirection: 'row',
    backgroundColor: Colors.white,
    width: '49%',
    padding: 15,
    marginBottom: 10,
    borderRadius: 8,
    alignItems: 'center',
    height: 77,
  },
  statValue: {
    fontSize: 20,
    color: Colors.black,
    fontWeight: 'bold',
    marginLeft: 15,
  },
  statLabel: {
    fontSize: 16,
    color: Colors.gray,
    textAlign: 'center',
    fontWeight: '400',
    justifyContent: 'flex-end',
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
});

export default HomeScreen;
