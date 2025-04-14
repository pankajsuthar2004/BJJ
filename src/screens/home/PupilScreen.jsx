import React, {useState} from 'react';
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
import {useNavigation} from '@react-navigation/native';
import {Fonts} from '../../assets/fonts';

const screenWidth = Dimensions.get('window').width;

const attendanceData = {
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
    'Nov',
    'Dec',
  ],
  datasets: [
    {
      data: [70, 90, 60, 80, 75, 50, 85, 60, 95, 80, 70, 50],
    },
  ],
};

const paymentHistory = [
  {date: '2/8/24', amount: '$100', status: 'Pending'},
  {date: '3/7/24', amount: '$76', status: 'Paid'},
  {date: '4/6/24', amount: '$30', status: 'Paid'},
  {date: '5/5/24', amount: '$50', status: 'Paid'},
  {date: '6/4/24', amount: '$200', status: 'Paid'},
  {date: '7/3/24', amount: '$10', status: 'Paid'},
];

const PupilScreen = () => {
  const navigation = useNavigation();
  const [modalVisible, setModalVisible] = useState(false);
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  return (
    <ScrollView style={styles.container}>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          paddingVertical: 12,
          borderBottomWidth: 0.5,
          borderBottomColor: Colors.mediumGray,
        }}>
        <View style={styles.profileContainer}>
          <TouchableOpacity
            onPress={() => navigation.navigate('Pupil Profile')}>
            <Image source={IMAGES.ProfilePic} />
          </TouchableOpacity>

          <View style={{flex: 1}}>
            <Text style={styles.name}>Paul Watson</Text>
            <View style={styles.rankContainer}>
              <SVG.Belt />
              <Text style={styles.rank}>Blue Belt</Text>
            </View>
          </View>
        </View>

        <TouchableOpacity style={styles.statusBadge}>
          <Text style={styles.statusText}>Paid</Text>
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
          Classes Attended: 45 | Average: 3/week
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
          data={paymentHistory}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({item}) => (
            <View style={styles.paymentRow}>
              <Text style={styles.paymentDate}>{item.date}</Text>
              <Text style={styles.paymentText}>{item.amount}</Text>
              <View
                style={[
                  styles.paymentStatus,
                  {
                    backgroundColor:
                      item.status === 'Paid' ? Colors.green : Colors.yellow,
                  },
                ]}>
                <Text style={styles.paymentStatusText}>{item.status}</Text>
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
