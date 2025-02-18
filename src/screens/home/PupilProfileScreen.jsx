import React, {useState} from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  TextInput,
} from 'react-native';
import {BarChart} from 'react-native-chart-kit';
import {useNavigation} from '@react-navigation/native';
import {Dimensions} from 'react-native';
import Colors from '../../theme/color';
import IMAGES from '../../assets/images';
import SVG from '../../assets/svg';

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
      data: [30, 50, 70, 40, 90, 60, 80, 70, 95, 85, 60, 40],
    },
  ],
};

const PupilProfileScreen = () => {
  const navigation = useNavigation();
  const [notes, setNotes] = useState('');

  return (
    <ScrollView style={styles.container}>
      <View style={styles.profileSection}>
        <Image source={IMAGES.ProfilePic} style={styles.profileImage} />
        <View style={styles.profileInfo}>
          <Text style={styles.name}>Paul Watson</Text>
          <Text style={styles.email}>paul.watson@example.com</Text>
          <Text style={styles.phone}>+123 456 7890</Text>
        </View>
        <View style={styles.contactIcons}>
          <SVG.Email />
          <SVG.Phone />
        </View>
      </View>

      <Text style={styles.sectionTitle}>Attendance History</Text>
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
          barPercentage: 0.5,
        }}
        style={styles.chartStyle}
      />
      <Text style={styles.attendanceStats}>
        Classes Attended: 45 | Average: 3/week
      </Text>

      <Text style={styles.sectionTitle}>Training Activity</Text>
      <View style={styles.infoSection}>
        <View style={styles.infoRow}>
          <Text style={styles.label}>Session Type</Text>
          <Text style={styles.value}>Gi</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.label}>Date</Text>
          <Text style={styles.value}>1/12/2023</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.label}>Goal Logged</Text>
          <Text style={styles.valueHighlight}>Improve Guard Passing</Text>
        </View>
      </View>
      <View style={styles.infoSection}>
        <View style={styles.infoRow}>
          <Text style={styles.label}>Session Type</Text>
          <Text style={styles.value}>No Gi</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.label}>Date</Text>
          <Text style={styles.value}>1/8/2023</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.label}>Goal Logged</Text>
          <Text style={styles.valueHighlight}>Work on Submissions</Text>
        </View>
      </View>

      <Text style={styles.sectionTitle}>Payment Records</Text>
      <View style={styles.infoSection}>
        <View style={styles.infoRow}>
          <Text style={styles.label}>Payment Date</Text>
          <Text style={styles.value}>11/12/2024</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.label}>Amount</Text>
          <Text style={styles.value}>$78</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.label}>Next Due Date</Text>
          <Text style={styles.value}>11/1/2025</Text>
        </View>
      </View>

      <Text style={styles.sectionTitle}>Notes</Text>
      <TextInput
        style={[styles.notesInput, {textAlignVertical: 'top', paddingTop: 10}]}
        placeholder="Add notes for the pupil..."
        placeholderTextColor="gray"
        multiline
        value={notes}
        onChangeText={setNotes}
      />

      <View
        style={{
          flexDirection: 'row',
          margin: 1,
          justifyContent: 'space-between',
          marginTop: 20,
        }}>
        <Text style={styles.sectionTitle}>Status</Text>
        <TouchableOpacity style={styles.inviteButton}>
          <Text style={styles.inviteButtonText}>Invite</Text>
        </TouchableOpacity>
      </View>
      <View
        style={{
          flexDirection: 'row',
          margin: 1,
          justifyContent: 'space-between',
          marginTop: 10,
        }}>
        <Text style={styles.sectionTitle}>Invite Pupil</Text>
        <TouchableOpacity
          style={styles.sendInviteButton}
          onPress={() => navigation.navigate('Pricing Management')}>
          <Text style={styles.sendInviteButtonText}>Send Invitation</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.black,
    padding: 20,
  },
  profileSection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    borderBottomWidth: 1,
  },
  profileImage: {
    width: 70,
    height: 70,
    borderRadius: 35,
  },
  profileInfo: {
    flex: 1,
    marginLeft: 10,
  },
  name: {
    color: Colors.white,
    fontSize: 18,
    fontWeight: 'bold',
  },
  email: {
    color: Colors.gray,
    fontSize: 14,
  },
  phone: {
    color: Colors.gray,
    fontSize: 14,
  },
  contactIcons: {
    gap: 10,
  },
  sectionTitle: {
    color: Colors.white,
    fontSize: 16,
    fontWeight: 'bold',
    marginVertical: 10,
  },
  chartStyle: {
    marginVertical: 10,
    borderRadius: 10,
  },
  attendanceStats: {
    color: Colors.gray,
    fontSize: 14,
  },
  infoSection: {
    marginBottom: 15,
    padding: 10,
    borderRadius: 8,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 5,
  },
  label: {
    color: Colors.litegray,
    fontSize: 14,
  },
  value: {
    color: Colors.white,
    fontSize: 14,
  },
  valueHighlight: {
    color: Colors.white,
    fontSize: 14,
  },
  notesInput: {
    backgroundColor: Colors.white,
    borderRadius: 8,
    padding: 10,
    color: Colors.black,
    height: 80,
  },
  inviteButton: {
    backgroundColor: 'green',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginBottom: 10,
  },
  inviteButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  sendInviteButton: {
    backgroundColor: 'red',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginBottom: 40,
  },
  sendInviteButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});

export default PupilProfileScreen;
