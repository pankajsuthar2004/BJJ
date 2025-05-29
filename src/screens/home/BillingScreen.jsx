import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  StyleSheet,
} from 'react-native';
import SVG from '../../assets/svg';
import Colors from '../../theme/color';
import {Fonts} from '../../assets/fonts';
import makeRequest from '../../api/http';
import {EndPoints} from '../../api/config';
import {showToast} from '../../utility/Toast';

const filters = ['All', 'Paid', 'Pending'];

const BillingScreen = ({navigation}) => {
  const [gyms, setGyms] = useState([]);
  const [selectedGym, setSelectedGym] = useState(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState('All');
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGyms = async () => {
      try {
        setLoading(true);
        const response = await makeRequest({
          endPoint: EndPoints.UserGyms,
          method: 'GET',
        });

        if (Array.isArray(response) && response.length > 0) {
          setGyms(response);
          setSelectedGym(response[0]);
        } else {
          showToast({message: 'No gyms found'});
        }
      } catch (error) {
        console.error('Failed to fetch gyms:', error);
        showToast({message: 'Failed to fetch gyms'});
      } finally {
        setLoading(false);
      }
    };

    fetchGyms();
  }, []);

  const getStatus = selectedItem => {
    switch (selectedItem) {
      case 'All':
        return 0;
      case 'Paid':
        return 1;
      case 'Pending':
        return 0;
      default:
        return 0;
    }
  };

  useEffect(() => {
    const fetchBillingHistory = async () => {
      console.log('called');
      if (!selectedGym) return;
      try {
        setLoading(true);
        const body = {
          gym_id: selectedGym.id,
          status: getStatus(selectedFilter),
        };
        // if (selectedFilter !== 'All') {
        // body.status = getStatus(selectedFilter);
        // }

        const response = await makeRequest({
          endPoint: EndPoints.BillingHistory,
          method: 'POST',
          body,
        });
        console.log('Billing History Response:', response);
        if (Array.isArray(response)) {
          setInvoices(response);
        } else {
          setInvoices([]);
          showToast({message: 'No billing records found'});
        }
      } catch (error) {
        showToast({message: 'Failed to fetch billing history'});
      } finally {
        setLoading(false);
      }
    };

    fetchBillingHistory();
  }, [selectedGym, selectedFilter]);

  const renderHeader = () => (
    <View>
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
          <Text style={styles.dropdownText}>
            {selectedGym?.name || 'Select Gym'}
          </Text>
          <SVG.SmallArrow />
        </TouchableOpacity>

        {isDropdownOpen && (
          <View style={styles.dropdownList}>
            {gyms.map((item, index) => (
              <TouchableOpacity
                key={index}
                onPress={() => {
                  setSelectedGym(item);
                  setIsDropdownOpen(false);
                }}
                style={[
                  styles.dropdownItem,
                  index === gyms.length - 1 && {borderBottomWidth: 0},
                ]}>
                <Text>{item.name}</Text>
              </TouchableOpacity>
            ))}
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
    </View>
  );

  const renderItem = ({item: invoice}) => (
    <View style={styles.invoiceCard}>
      <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
        <Text style={styles.invoiceTitle}>{invoice.title}</Text>
        <Text style={styles.invoiceAmount}>{invoice.amount}</Text>
      </View>
      <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
        <Text style={styles.invoiceId}>#{invoice.invoice_id || 'N/A'}</Text>
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
    </View>
  );

  if (loading) {
    return (
      <View
        style={[
          styles.container,
          {justifyContent: 'center', alignItems: 'center'},
        ]}>
        <ActivityIndicator size="large" color={Colors.red} />
      </View>
    );
  }

  return (
    <FlatList
      style={styles.container}
      data={invoices}
      keyExtractor={item => item.id?.toString()}
      ListHeaderComponent={renderHeader}
      renderItem={renderItem}
      ListEmptyComponent={
        <Text style={{color: Colors.white, textAlign: 'center', marginTop: 20}}>
          No invoices found
        </Text>
      }
      ListFooterComponent={<View style={{height: 16}} />}
    />
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
  invoiceId: {
    color: Colors.gray,
    fontSize: 16,
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
