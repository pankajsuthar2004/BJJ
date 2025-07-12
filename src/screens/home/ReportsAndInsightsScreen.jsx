import React, {useEffect} from 'react';
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
import makeRequest from '../../api/http';
import {EndPoints} from '../../api/config';
// import RNHTMLtoPDF from 'react-native-html-to-pdf';
// import FileViewer from 'react-native-file-viewer';
import {showToast} from '../../utility/Toast';

const ReportsAndInsightsScreen = () => {
  const navigation = useNavigation();
  const [response, setResponse] = React.useState(null);
  const [revenueData, setRevenueData] = React.useState([
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
  ]);
  const [attendanceData, setAttendanceData] = React.useState([
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
  ]);

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

  useEffect(() => {
    getData();
  }, []);

  const getData = async () => {
    try {
      const response = await makeRequest({
        endPoint: EndPoints.Reports,
        method: 'GET',
      });
      const reportData = Object.values(response?.monthly_revenue || {});
      const revenueData = Object.values(response?.monthly_attendance || {});
      setRevenueData(reportData);
      setAttendanceData(revenueData);
      setResponse(response);
      //   if (!Array.isArray(data) || data.length === 0) {
      //     throw new Error('Invalid report data');
      //   }
      //   const tableRows = data
      //     .map(
      //       item => `
      //       <tr>
      //         <td>${item.month}</td>
      //         <td>${item.revenue}</td>
      //         <td>${item.attendance}</td>
      //       </tr>
      //     `,
      //     )
      //     .join('');

      //   const htmlContent = `
      //   <h1>Gym Report - ${new Date().toLocaleString('default', {
      //     month: 'long',
      //     year: 'numeric',
      //   })}</h1>
      //   <h3>Monthly Revenue & Attendance</h3>
      //   <table border="1" style="width:100%; border-collapse:collapse;">
      //     <tr>
      //       <th>Month</th>
      //       <th>Revenue</th>
      //       <th>Attendance</th>
      //     </tr>
      //     ${tableRows}
      //   </table>
      // `;

      //   const options = {
      //     html: htmlContent,
      //     fileName: 'gym_report',
      //     directory: 'Documents',
      //   };

      //   const pdf = await RNHTMLtoPDF.convert(options);
      //   await FileViewer.open(pdf.filePath);
    } catch (error) {
      console.error('PDF export error:', error);
      showToast({message: 'Failed to export PDF', type: 'error'});
    }
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
          <View>
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
                data: revenueData,
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
                data: attendanceData,
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
            <Text style={styles.memberCount}>{response?.paid_users ?? 0}</Text>
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
            <Text style={styles.memberCount}>
              {response?.pending_users ?? 0}
            </Text>
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
        <TouchableOpacity style={styles.exportButton}>
          <Text style={styles.exportText}>Export as CSV</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.exportButton} onPress={getData}>
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
    fontSize: 11.8,
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
