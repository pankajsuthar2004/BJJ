import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  Image,
  Modal,
  TouchableWithoutFeedback,
} from 'react-native';
import IMAGES from '../../assets/images';
import CustomLineChart from '../../components/CustomLineChart';
import Colors from '../../theme/color';
import SVG from '../../assets/svg';
import {hp, wp} from '../../utility/ResponseUI';
import {Fonts} from '../../assets/fonts';
import {useNavigation} from '@react-navigation/native';
import makeRequest from '../../api/http';
import {EndPoints} from '../../api/config';
import {showToast} from '../../utility/Toast';
import {useAppSelector} from '../../store/Hooks';

const PupilsAttendanceScreen = () => {
  const navigation = useNavigation();
  const [selectedButton, setSelectedButton] = useState('Monthly');
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedFilters, setSelectedFilters] = useState({
    gi: true,
    noGi: true,
  });
  const [attendanceData, setAttendanceData] = useState([]);
  const [graphData, setGraphData] = useState({});
  const [loading, setLoading] = useState(true);
  const user = useAppSelector(state => state.user?.user);
  const gymId = user?.gym?.id;

  const fetchMembers = async () => {
    try {
      setLoading(true);
      const filterParams = [];
      if (selectedFilters.gi) filterParams.push('gi=1');
      if (selectedFilters.noGi) filterParams.push('noGi=1');
      const queryString =
        filterParams.length > 0 ? `&${filterParams.join('&')}` : '';

      const data = await makeRequest({
        endPoint: `${
          EndPoints.Members
        }?filter=${selectedButton.toLowerCase()}${queryString}`,
        method: 'GET',
      });

      console.log('Members data:', data?.members);
      setAttendanceData(data?.members || []);
      setGraphData(data?.graph || {});
    } catch (error) {
      console.log('Fetch members error:', error);
      showToast({message: 'Failed to load members'});
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMembers();
  }, [selectedButton, selectedFilters]);

  const toggleFilter = type => {
    setSelectedFilters(prev => ({...prev, [type]: !prev[type]}));
  };

  const applyFilters = () => {
    fetchMembers();
    setIsModalVisible(false);
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
        <CustomLineChart
          chartData={{
            labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
            datasets: [
              {
                data: [
                  graphData.Monday || 0,
                  graphData.Tuesday || 0,
                  graphData.Wednesday || 0,
                  graphData.Thursday || 0,
                  graphData.Friday || 0,
                  graphData.Saturday || 0,
                  graphData.Sunday || 0,
                ],
                color: (opacity = 1) => `rgba(255, 0, 0, ${opacity})`,
              },
            ],
          }}
        />
      </View>

      <FlatList
        data={attendanceData}
        keyExtractor={(item, index) => item?.id?.toString() || index.toString()}
        renderItem={({item}) => {
          const imageUri = item?.user?.image?.startsWith('http')
            ? item.user.image
            : `https://bjj.beepr.us/${item?.user?.image}`;

          return (
            <TouchableOpacity
              style={styles.card}
              onPress={() => {
                navigation.navigate('Attendance Marking', {
                  user: item?.user,
                  gym_member: item?.id,
                  presentdays: item?.attendance_count || 0,
                  absentdays: 0,
                  gymId: item?.gym_id,
                });
              }}>
              <Image
                source={
                  item?.user?.image ? {uri: imageUri} : IMAGES.ProfilePic2
                }
                style={styles.image}
              />
              <View style={{flex: 1}}>
                <Text style={styles.name}>{item?.user?.name || 'Unnamed'}</Text>
              </View>
              <View style={{alignItems: 'flex-end'}}>
                <Text style={styles.classes}>
                  {item?.attendance_count || 0}
                </Text>
                <Text style={{color: Colors.white, fontSize: 12}}>classes</Text>
              </View>
            </TouchableOpacity>
          );
        }}
        ListEmptyComponent={
          !loading && (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>No Pupil's Available</Text>
            </View>
          )
        }
      />

      <Modal visible={isModalVisible} transparent animationType="slide">
        <TouchableWithoutFeedback onPress={() => setIsModalVisible(false)}>
          <View style={styles.modalOverlay}>
            <View style={styles.modalContainer}>
              <TouchableOpacity
                style={styles.filterOption}
                onPress={() => toggleFilter('gi')}>
                <Text style={styles.filterText}>Gi</Text>
                {selectedFilters.gi ? <SVG.FilterTick /> : <SVG.EmptyTick />}
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.filterOption}
                onPress={() => toggleFilter('noGi')}>
                <Text style={styles.filterText}>No Gi</Text>
                {selectedFilters.noGi ? <SVG.FilterTick /> : <SVG.EmptyTick />}
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.applyButton}
                onPress={applyFilters}>
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
        </TouchableWithoutFeedback>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.black,
    padding: 9,
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
  legendContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 10,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 10,
    gap: 5,
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
    top: 8,
  },
  classes: {
    color: Colors.green,
    fontSize: 16,
    textAlign: 'right',
  },
  emptyContainer: {
    paddingVertical: 20,
    alignItems: 'center',
  },
  emptyText: {
    color: Colors.white,
    fontSize: 16,
    fontStyle: 'italic',
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
