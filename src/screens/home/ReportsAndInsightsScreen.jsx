import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  ScrollView,
} from 'react-native';
import Colors from '../../theme/color';
import SVG from '../../assets/svg';
import CustomLineChart from '../../components/CustomLineChart';
import {Fonts} from '../../assets/fonts';
import {useNavigation} from '@react-navigation/native';
import {hp, wp} from '../../utility/ResponseUI';

const ReportsAndInsightsScreen = () => {
  const navigation = useNavigation();

  const sessionData = [
    {
      session: 'Session',
      avg: 'Avg',
      min: 'Min',
      max: 'Max',
      current: 'Current',
    },
    {session: 'Gi', avg: 275, min: 570, max: 570, current: 570},
    {session: 'No-Gi', avg: 125, min: 75, max: 300, current: 300},
    {session: 'Open Mate', avg: 75, min: 145, max: 200, current: 230},
    {session: 'Competition', avg: 45, min: 55, max: 90, current: 100},
  ];

  const attendanceData = {
    giData: [0, 80, 0, 33, 51, 24, 10, 3, 63, 100, 8, 78, 43, 64],
  };
  const attendanceDatas = {
    giDatas: [
      0, 8180, 0, 1330, 5170, 2410, 1290, 200, 6300, 9000, 544, 7822, 10000,
      564, 8786,
    ],
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>Revenue</Text>
      <View style={styles.boxContainer}>
        <View
          style={{
            padding: 20,
            flexDirection: 'row',
            justifyContent: 'space-between',
          }}>
          <View>
            <Text style={styles.subHeader}>Monthly Revenue</Text>
          </View>
          <View style={{}}>
            <Text style={styles.revenue}>$2,654</Text>
            <Text style={styles.percentage}>+36%</Text>
          </View>
        </View>
        <CustomLineChart
          chartData={{
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
                data: attendanceData.giData,
                color: (opacity = 1) => `rgba(255, 0, 0, ${opacity})`,
              },
            ],
          }}
        />
      </View>

      <Text style={styles.header}>Attendance Trends</Text>
      <View style={styles.boxContainer}>
        <CustomLineChart
          chartData={{
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
                data: attendanceDatas.giDatas,
                color: (opacity = 1) => `rgba(255, 0, 0, ${opacity})`,
              },
            ],
          }}
        />
      </View>

      <View style={styles.memberContainer}>
        <TouchableOpacity style={styles.memberBox}>
          <View>
            <SVG.RedMan />
          </View>
          <View>
            <Text style={styles.memberCount}>1200</Text>
            <Text style={styles.memberLabel}>active members</Text>
          </View>
          <View style={{position: 'absolute', top: 8, right: 8}}>
            <SVG.RoundVector />
          </View>
        </TouchableOpacity>
        <TouchableOpacity style={styles.memberBox}>
          <View>
            <SVG.RedMan />
          </View>
          <View>
            <Text style={styles.memberCount}>350</Text>
            <Text style={styles.memberLabel}>non-active members</Text>
          </View>
          <View style={{position: 'absolute', top: 8, right: 8}}>
            <SVG.RoundVector />
          </View>
        </TouchableOpacity>
      </View>

      <Text style={styles.header}>Session Popularity</Text>
      <View style={styles.tableContainer}>
        <FlatList
          data={sessionData}
          keyExtractor={item => item.session}
          renderItem={({item, index}) => (
            <View
              style={[
                styles.row,
                index === 0 && styles.headerRow,
                index === 0 && {borderBottomWidth: 0},
              ]}>
              <Text style={[styles.cell, index === 0 && styles.headerCell]}>
                {item.session}
              </Text>
              <Text style={[styles.cell, index === 0 && styles.headerCell]}>
                {item.avg}
              </Text>
              <Text style={[styles.cell, index === 0 && styles.headerCell]}>
                {item.min}
              </Text>
              <Text style={[styles.cell, index === 0 && styles.headerCell]}>
                {item.max}
              </Text>
              <Text style={[styles.cell, index === 0 && styles.headerCell]}>
                {item.current}
              </Text>
            </View>
          )}
        />
      </View>

      <Text style={styles.header}>Export Options</Text>
      <View style={styles.exportContainer}>
        <TouchableOpacity
          style={styles.exportButton}
          onPress={() => navigation.navigate('Messages')}>
          <Text style={styles.exportText}>Export as CSV</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.exportButton}>
          <Text style={styles.exportText}>Export as PDF</Text>
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
  header: {
    color: Colors.white,
    fontSize: 20,
    fontFamily: Fonts.normal,
    marginVertical: 10,
  },
  subHeader: {
    color: Colors.gray,
    fontSize: 14,
  },
  revenue: {
    color: Colors.black,
    fontSize: 24,
    fontWeight: 'bold',
  },
  percentage: {
    color: 'green',
    fontSize: 16,
    textAlign: 'right',
  },
  boxContainer: {
    backgroundColor: Colors.white,
    borderRadius: 10,
    marginVertical: 10,
  },
  memberContainer: {
    flexDirection: 'row',
    marginVertical: 15,
    gap: 8,
  },
  memberBox: {
    backgroundColor: Colors.white,
    borderRadius: 8,
    paddingLeft: 5,
    alignItems: 'center',
    width: wp((195 / 430) * 100),
    height: hp((72 / 919) * 100),
    flexDirection: 'row',
    gap: 8,
  },
  memberCount: {
    color: Colors.black,
    fontSize: 20,
    fontWeight: 'bold',
  },
  memberLabel: {
    color: Colors.gray,
    fontSize: 12,
  },
  tableContainer: {
    padding: 10,
    marginVertical: 10,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 5,
    borderBottomWidth: 0.5,
    borderBottomColor: Colors.litegray,
  },
  headerRow: {
    backgroundColor: Colors.darkGray,
    borderRadius: 8,
    padding: 5,
  },
  headerCell: {
    color: Colors.white,
    textAlign: 'center',
  },
  cell: {
    color: Colors.white,
    fontSize: 12,
    width: '20%',
    textAlign: 'center',
  },
  exportContainer: {
    flexDirection: 'row',
    marginBottom: 50,
    gap: 10,
    flex: 1,
  },
  exportButton: {
    backgroundColor: 'red',
    width: wp((129 / 430) * 100),
    height: hp((36 / 919) * 100),
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 5,
  },
  exportText: {
    color: Colors.white,
    fontSize: 14,
  },
});

export default ReportsAndInsightsScreen;
