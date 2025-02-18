import React, {useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  Image,
  Modal,
} from 'react-native';
import IMAGES from '../../assets/images';
import CustomLineChart from '../../components/CustomLineChart';
import Colors from '../../theme/color';
import SVG from '../../assets/svg';
import {hp, wp} from '../../utility/ResponseUI';
import {Fonts} from '../../assets/fonts';
import {useNavigation} from '@react-navigation/native';

const attendanceData = [
  {name: 'John Smith', classes: 21, image: IMAGES.Photo1},
  {name: 'Paul Watson', classes: 21, image: IMAGES.Photo2},
  {name: 'Bobby Begula', classes: 25, image: IMAGES.Photo3},
  {name: 'John Manora', classes: 18, image: IMAGES.Photo4},
  {name: 'Shen Watson', classes: 17, image: IMAGES.Photo5},
  {name: 'Smith Bewl', classes: 21, image: IMAGES.Photo6},
  {name: 'Shemas Yogu', classes: 25, image: IMAGES.Photo7},
  {name: 'Bouncer Batlar', classes: 25, image: IMAGES.Photo8},
  {name: 'Watson Wangola', classes: 25, image: IMAGES.Photo9},
];

const PupilsAttendanceScreen = () => {
  const navigation = useNavigation();
  const [selectedButton, setSelectedButton] = useState('Monthly');
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedFilters, setSelectedFilters] = useState({
    gi: true,
    noGi: true,
  });

  const toggleFilter = type => {
    setSelectedFilters(prev => ({...prev, [type]: !prev[type]}));
  };

  return (
    <View style={styles.container}>
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
        <TouchableOpacity onPress={() => setIsModalVisible(true)}>
          <SVG.VectorWhite />
        </TouchableOpacity>
      </View>

      <Text style={styles.sectionTitle}>Attendance</Text>
      <View style={styles.chartContainer}>
        <CustomLineChart
          chartData={{
            labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
            datasets: [
              {
                data: [50, 75, 60, 80, 55, 70, 100, 65, 96, 40, 54, 76, 23, 20],
                color: (opacity = 1) => `rgba(255, 0, 0, ${opacity})`,
              },
              {
                data: [60, 55, 70, 100, 67, 30, 58, 39, 65, 75, 50, 39, 46, 79],
                color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
              },
            ],
            legend: ['Gi', 'No Gi'],
          }}
        />
      </View>

      <FlatList
        data={attendanceData}
        keyExtractor={item => item.name}
        renderItem={({item}) => (
          <TouchableOpacity
            style={styles.card}
            onPress={() => {
              if (item.name === 'John Smith') {
                navigation.navigate('Attendance Marking');
              }
            }}>
            <Image source={item.image} style={styles.image} />
            <Text style={styles.name}>{item.name}</Text>
            <Text style={styles.classes}>
              {item.classes}
              {'\n'}
              <Text style={{color: Colors.white, fontSize: 12}}>classes</Text>
            </Text>
          </TouchableOpacity>
        )}
      />

      <Modal visible={isModalVisible} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <TouchableOpacity
              style={styles.filterOption}
              onPress={() => toggleFilter('gi')}>
              <Text style={styles.filterText}>Gi</Text>
              {selectedFilters.gi ? <SVG.Tick /> : <SVG.EmptyTick />}
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.filterOption}
              onPress={() => toggleFilter('noGi')}>
              <Text style={styles.filterText}>No Gi</Text>
              {selectedFilters.noGi ? <SVG.Tick /> : <SVG.EmptyTick />}
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.applyButton}
              onPress={() => setIsModalVisible(false)}>
              <Text style={styles.applyText}>Apply Filters</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.resetButton}
              onPress={() => {
                setSelectedFilters({gi: false, noGi: false});
              }}>
              <Text style={styles.resetText}>Reset All Filters</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

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
    backgroundColor: Colors.white,
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    color: Colors.white,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.darkGray,
    padding: 10,
    marginVertical: 5,
    gap: 10,
    borderRadius: 8,
  },
  image: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  name: {
    color: Colors.white,
    flex: 1,
    fontSize: 16,
  },
  classes: {
    color: Colors.green,
    fontSize: 16,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.8)',
    alignItems: 'flex-end',
    padding: 18,
    marginTop: '12%',
  },
  modalContainer: {
    backgroundColor: Colors.white,
    padding: 20,
    borderRadius: 10,
    width: wp((250 / 430) * 100),
    height: hp((250 / 919) * 100),
  },
  filterOption: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 10,
  },
  filterText: {
    fontSize: 18,
  },
  applyButton: {
    backgroundColor: Colors.red,
    padding: 10,
    alignItems: 'center',
    borderRadius: 8,
    marginTop: 10,
  },
  applyText: {
    color: Colors.white,
    fontSize: 16,
  },
  resetButton: {
    alignItems: 'center',
    marginTop: 10,
  },
  resetText: {
    color: Colors.red,
    fontSize: 16,
  },
});

export default PupilsAttendanceScreen;
