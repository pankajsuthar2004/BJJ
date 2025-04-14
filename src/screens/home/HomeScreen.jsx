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
} from 'react-native';
import {LineChart, BarChart} from 'react-native-chart-kit';
import {Dimensions} from 'react-native';
import Colors from '../../theme/color';
import IMAGES from '../../assets/images';
import {Fonts} from '../../assets/fonts';
import {useNavigation} from '@react-navigation/native';
import {hp, wp} from '../../utility/ResponseUI';
import SVG from '../../assets/svg';
import {store} from '../../store/Store';

const screenWidth = Dimensions.get('window').width;

const HomeScreen = () => {
  const navigation = useNavigation();
  const [selectedToggle, setSelectedToggle] = useState('');
  const [isDrawerVisible, setIsDrawerVisible] = useState(false);

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
    // legend: ['Gi', 'No Gi'],
  };

  const barData = {
    datasets: [
      {
        data: [40, 88, 80, 61, 49, 35, 73, 25],
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

  const toggleDrawer = () => {
    setIsDrawerVisible(prev => !prev);
  };

  const navigateToScreen = screen => {
    navigation.navigate(screen);
    toggleDrawer();
  };

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
              onPress={() => navigateToScreen('DashBoardScreen')}>
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
              onPress={() => navigateToScreen('RoundScreen')}>
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
              onPress={() => navigateToScreen('Gym Profile')}>
              <SVG.IconProfile />
              <Text style={styles.drawerText}>Become Gym Owner</Text>
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
            style={{
              flexDirection: 'row',
              backgroundColor: Colors.white,
              borderRadius: 4,
            }}>
            <Text style={styles.toggleText1}>from</Text>
            <SVG.SmallCal style={{alignSelf: 'center', right: 6}} />
          </TouchableOpacity>
          <TouchableOpacity
            style={{
              flexDirection: 'row',
              backgroundColor: Colors.white,
              borderRadius: 4,
            }}>
            <Text style={styles.toggleText1}>to</Text>
            <SVG.SmallCal style={{alignSelf: 'center', right: 6}} />
          </TouchableOpacity>
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

        <View>
          <Text style={styles.sectionTitle}>Training Frequency</Text>
          <LineChart
            data={lineData}
            width={screenWidth - 24}
            height={hp((298.79 / 919) * 100)}
            chartConfig={chartConfig}
            bezier
            style={styles.chart}
            verticalLabelRotation={30}
          />
        </View>

        <Text style={styles.sectionTitle}>Time Distribution (Gi vs No Gi)</Text>
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
            <View style={styles.legendItem}>
              <SVG.Maskgroup />
              <Text style={{color: Colors.red}}>Gi</Text>
            </View>
            <View style={styles.legendItem}>
              <SVG.Nogi />
              <Text style={{color: Colors.darkGray}}>No Gi</Text>
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
    height: hp((465 / 919) * 100),
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
    justifyContent: 'flex-end',
    position: 'absolute',
    right: 10,
    top: 10,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 10,
    gap: 5,
  },
});

export default HomeScreen;
