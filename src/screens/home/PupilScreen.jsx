import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  ScrollView,
  Modal,
  TextInput,
} from 'react-native';
import {BarChart} from 'react-native-chart-kit';
import {Dimensions} from 'react-native';
import Colors from '../../theme/color';
import SVG from '../../assets/svg';
import IMAGES from '../../assets/images';
import {useNavigation, useRoute} from '@react-navigation/native';
import {Fonts} from '../../assets/fonts';
import makeRequest from '../../api/http';
import {EndPoints} from '../../api/config';

const screenWidth = Dimensions.get('window').width;

const PupilScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const userId = route.params?.user_id;

  const [userData, setUserData] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [membershipStatus, setMembershipStatus] = useState('');
  const [monthlyAttendance, setMonthlyAttendance] = useState([]);
  const [weeklyAverage, setWeeklyAverage] = useState(0);
  const [allMemberships, setAllMemberships] = useState([]);

  useEffect(() => {
    if (userId) {
      fetchPaymentUserData();
    }
  }, [userId]);

  const fetchPaymentUserData = async () => {
    try {
      const response = await makeRequest({
        endPoint: `${EndPoints.PaymentUser}?user_id=${userId}`,
        method: 'GET',
      });

      console.log('response-=-=-=', response);

      if (response) {
        const data = response;
        setUserData(data?.user);
        setMembershipStatus(data?.status);
        setMonthlyAttendance(data.monthly_attendance);
        setWeeklyAverage(data.weekly_average);
        setAllMemberships(data.all_memberships);
      }
    } catch (error) {
      console.error('Payment user fetch error:', error);
    }
  };

  const attendanceData = {
    labels: monthlyAttendance.map(item => item.month.slice(0, 3)),
    datasets: [{data: monthlyAttendance.map(item => item.count)}],
  };

  console.log('user information', membershipStatus);
  return (
    <ScrollView style={styles.container}>
      <View style={styles.profileContainer}>
        <TouchableOpacity onPress={() => navigation.navigate('Pupil Profile')}>
          <Image source={IMAGES.ProfilePic || userData?.image} />
        </TouchableOpacity>
        <View style={{flex: 1}}>
          <Text style={styles.name}>{userData?.name}</Text>
          <View style={styles.rankContainer}>
            <SVG.Belt />
            <Text style={styles.rank}>Blue Belt</Text>
          </View>
        </View>
        <TouchableOpacity
          style={[
            styles.statusBadge,
            {
              backgroundColor:
                membershipStatus === 'Paid' ? Colors.green : Colors.yellow,
            },
          ]}>
          <Text style={styles.statusText}>{membershipStatus}</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.infoSection}>
        <View style={styles.infoRow}>
          <Text style={styles.infoText}>Started</Text>
          <Text style={styles.infoText}>1/12/2023</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoText}>Time on Belt</Text>
          <Text style={styles.infoText}>8 Months</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoText}>Subscription Type</Text>
          <Text style={styles.infoText}>Monthly</Text>
        </View>
      </View>

      <View style={styles.infoSection}>
        <View style={styles.infoRow}>
          <Text style={styles.infoText}>Belt Timeline</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoText}>1/4/2023</Text>
          <Text style={styles.infoText}>Promoted to White Belt</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoText}>1/4/2024</Text>
          <Text style={styles.infoText}>Promoted to Blue Belt</Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Attendance</Text>
        <BarChart
          data={attendanceData}
          width={screenWidth - 40}
          height={220}
          chartConfig={{
            backgroundColor: Colors.black,
            backgroundGradientFrom: Colors.darkGray,
            backgroundGradientTo: Colors.darkGray,
            decimalPlaces: 0,
            color: (opacity = 1) => `rgba(255, 0, 0, ${opacity})`,
            labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
            barPercentage: 0.45,
          }}
          style={styles.chartStyle}
        />
        <Text style={styles.attendanceStats}>
          Weekly Avg: {weeklyAverage.toFixed(1)} / week
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Payment History</Text>
        <View style={styles.tableHeader}>
          <Text style={styles.tableHeaderText}>Date</Text>
          <Text style={styles.tableHeaderText}>Amount</Text>
          <Text style={styles.tableHeaderText}>Status</Text>
        </View>

        <FlatList
          data={allMemberships}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({item}) => (
            <View style={styles.paymentRow}>
              <Text style={styles.paymentDate}>
                {item?.payment_created_at
                  ? new Date(item.payment_created_at).toLocaleDateString()
                  : '-'}
              </Text>
              <Text style={styles.paymentText}>${item.price}</Text>
              <View
                style={[
                  styles.paymentStatus,
                  {
                    backgroundColor:
                      item.payment_status === 'success'
                        ? Colors.green
                        : Colors.yellow,
                  },
                ]}>
                <Text style={styles.paymentStatusText}>
                  {item.payment_status === 'success' ? 'Paid' : 'Pending'}
                </Text>
              </View>
            </View>
          )}
        />
      </View>

      <TouchableOpacity
        style={styles.addPaymentButton}
        onPress={() => setModalVisible(true)}>
        <Text style={styles.addPaymentText}>Add Payment</Text>
      </TouchableOpacity>

      <Modal visible={modalVisible} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.label}>Amount</Text>
            <TextInput
              style={[styles.input, {height: 40}]}
              placeholder="Enter amount"
              placeholderTextColor="gray"
              keyboardType="numeric"
              value={amount}
              onChangeText={setAmount}
            />
            <Text style={styles.label}>Description</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Description....."
              placeholderTextColor="gray"
              multiline
              numberOfLines={3}
              value={description}
              onChangeText={setDescription}
            />
            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => setModalVisible(false)}>
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.addButton}>
                <Text style={styles.addButtonText}>Add Payment</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.black,
    padding: 20,
  },
  profileContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: 12,
  },
  name: {
    color: Colors.white,
    fontSize: 18,
    fontWeight: 'bold',
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  rankContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  rank: {
    color: Colors.mediumGray,
    fontSize: 16,
  },
  statusBadge: {
    backgroundColor: Colors.green,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 6,
    justifyContent: 'center',
    alignItems: 'center',
  },
  statusText: {
    color: Colors.white,
    fontSize: 16,
    fontFamily: Fonts.normal,
  },
  infoSection: {
    marginBottom: 20,
    padding: 15,
    borderBottomWidth: 0.5,
    borderBottomColor: Colors.mediumGray,
  },
  infoText: {
    color: Colors.white,
    fontSize: 14,
  },
  section: {
    marginBottom: 20,
  },
  tableHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: Colors.darkGray,
    paddingVertical: 10,
    paddingHorizontal: 25,
  },
  tableHeaderText: {
    color: Colors.white,
    fontSize: 14,
    textAlign: 'center',
  },
  sectionTitle: {
    color: Colors.white,
    fontSize: 16,
    marginBottom: 5,
  },
  timelineText: {
    color: Colors.gray,
    fontSize: 14,
  },
  chartStyle: {
    marginVertical: 10,
    borderRadius: 10,
  },
  attendanceStats: {
    color: Colors.gray,
    fontSize: 14,
  },
  paymentRow: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: Colors.black,
    paddingVertical: 12,
    paddingHorizontal: 15,
    borderBottomWidth: 0.5,
    borderBottomColor: Colors.mediumGray,
  },
  paymentText: {
    flex: 1,
    color: Colors.white,
    fontSize: 16,
  },
  paymentDate: {
    flex: 1,
    color: Colors.white,
    fontSize: 16,
  },
  paymentStatus: {
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 5,
  },
  paymentStatusText: {
    flex: 1,

    color: Colors.white,
    fontSize: 12,
  },
  addPaymentButton: {
    backgroundColor: 'red',
    padding: 12,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 40,
  },
  addPaymentText: {
    color: Colors.white,
    fontSize: 16,
    fontWeight: 'bold',
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
  },
  modalContainer: {
    backgroundColor: Colors.white,
    padding: 15,
    borderRadius: 8,
    width: '90%',
  },
  label: {
    color: Colors.black,
    fontSize: 12,
    marginTop: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: Colors.litegray,
    borderRadius: 5,
    padding: 10,
    marginTop: 5,
  },
  textArea: {
    height: 63,
    textAlignVertical: 'top',
  },
  buttonContainer: {
    flexDirection: 'row',
    marginTop: 10,
    justifyContent: 'flex-end',
  },
  cancelButton: {
    borderWidth: 1,
    borderColor: Colors.red,
    borderRadius: 5,
    padding: 6,
    marginRight: 10,
  },
  cancelButtonText: {
    color: Colors.red,
    textAlign: 'center',
    fontSize: 12,
  },
  addButton: {
    backgroundColor: Colors.black,
    borderRadius: 5,
    padding: 6,
  },
  addButtonText: {
    color: Colors.white,
    textAlign: 'center',
    fontSize: 12,
  },
});

export default PupilScreen;
