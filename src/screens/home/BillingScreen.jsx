import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  ScrollView,
  StyleSheet,
} from 'react-native';
import SVG from '../../assets/svg';
import Colors from '../../theme/color';
import {Fonts} from '../../assets/fonts';

const gyms = ['Gym with Josh', 'Body Builder', 'Fitness Fanda'];
const filters = ['All', 'Paid', 'Pending'];
const invoicesData = [
  {
    id: '1',
    title: 'Subscribe to Plan',
    gym: 'Body Builder',
    isSubscription: true,
  },
  {id: '2', title: 'Membership', amount: '$50.25', status: 'Pending'},
  {id: '3', title: 'Trainer Fee', amount: '$50.25', status: 'Paid'},
  {id: '4', title: 'July Invoice', amount: '$50.25', status: 'Pending'},
  {id: '5', title: 'Membership-2.0', amount: '$50.25', status: 'Pending'},
];

const BillingScreen = ({navigation}) => {
  const [selectedGym, setSelectedGym] = useState('Select Gym');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState('All');
  const [updatedInvoices, setUpdatedInvoices] = useState(invoicesData);

  useEffect(() => {
    const newInvoices = invoicesData.map(invoice =>
      invoice.isSubscription ? {...invoice, gym: selectedGym} : invoice,
    );
    setUpdatedInvoices(newInvoices);
  }, [selectedGym]);

  return (
    <ScrollView style={styles.container}>
      <View style={styles.dropdownContainer}>
        <TouchableOpacity
          onPress={() => setIsDropdownOpen(!isDropdownOpen)}
          style={[
            styles.dropdownButton,
            isDropdownOpen && {
              borderTopLeftRadius: 8,
              borderTopRightRadius: 8,
              borderBottomLeftRadius: 0,
              borderBottomRightRadius: 0,
            },
          ]}>
          <Text style={styles.dropdownText}>{selectedGym}</Text>
          <SVG.SmallArrow />
        </TouchableOpacity>

        {isDropdownOpen && (
          <View style={styles.dropdownList}>
            <FlatList
              data={gyms}
              keyExtractor={(_, index) => index.toString()}
              renderItem={({item, index}) => (
                <TouchableOpacity
                  onPress={() => {
                    setSelectedGym(item);
                    setIsDropdownOpen(false);
                  }}
                  style={[
                    styles.dropdownItem,
                    index === gyms.length - 1 && {borderBottomWidth: 0},
                  ]}>
                  <Text>{item}</Text>
                </TouchableOpacity>
              )}
            />
          </View>
        )}
      </View>

      <View style={styles.filterContainer}>
        {filters.map(filter => (
          <TouchableOpacity
            key={filter}
            onPress={() => setSelectedFilter(filter)}
            style={[
              styles.filterTab,
              selectedFilter === filter && styles.activeFilter,
            ]}>
            <Text
              style={[
                styles.filterText,
                selectedFilter === filter && styles.activeFilterText,
              ]}>
              {filter}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {updatedInvoices.map(invoice => {
        if (selectedFilter !== 'All' && invoice.status !== selectedFilter)
          return null;
        return (
          <View key={invoice.id} style={styles.invoiceCard}>
            <View
              style={{flexDirection: 'row', justifyContent: 'space-between'}}>
              <Text style={styles.invoiceTitle}>{invoice.title}</Text>
              <Text style={styles.invoiceAmount}>{invoice.amount}</Text>
            </View>
            <View
              style={{flexDirection: 'row', justifyContent: 'space-between'}}>
              {invoice.isSubscription ? (
                <Text style={styles.invoiceGym}>{invoice.gym}</Text>
              ) : (
                <Text style={styles.invoiceId}>#256758</Text>
              )}

              {invoice.isSubscription ? (
                <TouchableOpacity
                  style={styles.subscribeButton}
                  onPress={() => navigation.navigate('Gym Jumper')}>
                  <Text style={styles.subscribeText}>Subscribe</Text>
                </TouchableOpacity>
              ) : (
                <View>
                  <View
                    style={[
                      styles.invoiceStatus,
                      invoice.status === 'Paid'
                        ? styles.paidStatus
                        : styles.pendingStatus,
                    ]}>
                    <Text style={[styles.statusText, styles.paidText]}>
                      {invoice.status}
                    </Text>
                  </View>
                </View>
              )}
            </View>
          </View>
        );
      })}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.black,
    padding: 16,
  },
  dropdownContainer: {
    marginBottom: 16,
  },
  dropdownButton: {
    backgroundColor: Colors.litegray,
    padding: 12,
    borderRadius: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dropdownText: {
    fontSize: 16,
  },
  dropdownList: {
    backgroundColor: Colors.white,
    borderBottomLeftRadius: 8,
    borderBottomRightRadius: 8,
  },
  dropdownItem: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.litegray,
  },
  filterContainer: {
    flexDirection: 'row',
    backgroundColor: Colors.white,
    borderRadius: 8,
    justifyContent: 'space-between',
    padding: 4,
    marginBottom: 16,
  },
  filterTab: {
    flex: 1,
    alignItems: 'center',
    padding: 10,
    borderRadius: 8,
  },
  activeFilter: {
    backgroundColor: Colors.red,
  },
  filterText: {
    color: Colors.black,
    fontSize: 16,
  },
  activeFilterText: {
    color: Colors.white,
  },
  invoiceCard: {
    backgroundColor: Colors.darkGray,
    padding: 15,
    borderRadius: 8,
    marginBottom: 8,
    justifyContent: 'center',
  },
  invoiceTitle: {
    color: Colors.white,
    fontSize: 20,
    fontFamily: Fonts.normal,
  },
  invoiceGym: {
    color: Colors.gray,
    fontSize: 16,
  },
  invoiceId: {
    color: Colors.gray,
    fontSize: 16,
  },
  subscribeButton: {
    backgroundColor: Colors.white,
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 100,
    bottom: 10,
  },
  subscribeText: {
    color: Colors.black,
    fontSize: 12,
  },
  invoiceAmount: {
    color: Colors.white,
    fontSize: 20,
    textAlign: 'center',
    fontFamily: Fonts.normal,
  },
  invoiceStatus: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 16,
    borderWidth: 1,
  },
  paidStatus: {
    borderColor: Colors.green,
    paddingHorizontal: 17,
  },
  pendingStatus: {
    borderColor: Colors.yellow,
    paddingHorizontal: 15,
  },
  paidText: {
    color: Colors.white,
    fontSize: 12,
  },
});

export default BillingScreen;
