import React from 'react';
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import CustomButton from '../../components/CustomButton';
import {Fonts} from '../../assets/fonts';
import Colors from '../../theme/color';
import {useNavigation} from '@react-navigation/native';

const InvoiceDetailScreen = () => {
  const navigation = useNavigation();
  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
          <View>
            <Text style={styles.price}>$50.25</Text>
            <Text style={styles.membership}>Membership</Text>
          </View>
          <View style={styles.invoiceContainer}>
            <Text style={styles.invoiceLabel}>Invoice</Text>
            <Text style={styles.invoiceNumber}>#2564854</Text>
          </View>
        </View>
        <View
          style={{
            borderBottomWidth: 1,
            borderBottomColor: Colors.gray,
            borderStyle: 'dashed',
            marginVertical: 10,
          }}></View>

        <View style={styles.dateContainer}>
          <Text style={styles.dateLabel}>Issue Date</Text>
          <Text style={styles.dateValue}>12/02/2025</Text>
        </View>

        <View style={styles.dateContainer}>
          <Text style={styles.dateLabel}>Due Date</Text>
          <Text style={styles.dateValue}>21/02/2025</Text>
        </View>
        <View
          style={{
            borderBottomWidth: 1,
            borderBottomColor: Colors.gray,
            borderStyle: 'dashed',
            marginVertical: 10,
          }}></View>

        <Text style={styles.summaryTitle}>Summary</Text>
        <View
          style={{
            borderBottomWidth: 1,
            borderBottomColor: Colors.gray,
            borderStyle: 'dashed',
            marginVertical: 10,
          }}></View>

        <View style={styles.summaryRow}>
          <Text style={styles.summaryText}>Membership</Text>
          <Text style={styles.summaryValue}>$50.25</Text>
        </View>

        <View style={styles.summaryRow}>
          <Text style={styles.summaryText}>VAT (21%)</Text>
          <Text style={styles.summaryValue}>$10</Text>
        </View>
        <View
          style={{
            borderBottomWidth: 1,
            borderBottomColor: Colors.gray,
            borderStyle: 'dashed',
            marginVertical: 10,
          }}></View>

        <View style={styles.summaryRow}>
          <Text style={styles.totalText}>Total Amount</Text>
          <Text style={styles.totalValue}>$60.25</Text>
        </View>
        <TouchableOpacity
          style={styles.btn}
          onPress={() => navigation.navigate('Billing')}>
          <Text style={styles.btnText}>Next</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.black,
  },
  card: {
    backgroundColor: Colors.darkGray,
    padding: 20,
    borderRadius: 8,
    margin: 15,
  },
  price: {
    fontSize: 36,
    fontFamily: Fonts.normal,
    color: Colors.white,
  },
  membership: {
    fontSize: 16,
    color: Colors.white,
    marginBottom: 10,
  },
  invoiceContainer: {
    justifyContent: 'center',
  },
  invoiceLabel: {
    color: Colors.gray,
    fontSize: 16,
    textAlign: 'right',
  },
  invoiceNumber: {
    color: Colors.white,
    fontSize: 16,
  },
  dateContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 5,
  },
  dateLabel: {
    color: Colors.gray,
    fontSize: 16,
  },
  dateValue: {
    color: Colors.white,
    fontSize: 16,
  },
  summaryTitle: {
    color: Colors.white,
    fontSize: 20,
    marginTop: 10,
    fontFamily: Fonts.normal,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 5,
  },
  summaryText: {
    color: Colors.gray,
    fontSize: 14,
  },
  summaryValue: {
    color: Colors.white,
    fontSize: 16,
  },
  totalText: {
    color: Colors.gray,
    fontSize: 16,
  },
  totalValue: {
    color: Colors.white,
    fontSize: 16,
    fontFamily: Fonts.normal,
  },
  btn: {
    backgroundColor: Colors.red,
    alignItems: 'center',
    padding: 10,
    borderRadius: 8,
    marginTop: 15,
  },
  btnText: {
    color: Colors.white,
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default InvoiceDetailScreen;
