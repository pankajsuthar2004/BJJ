import React, {useState} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import SVG from '../../assets/svg';
import Colors from '../../theme/color';
import {Fonts} from '../../assets/fonts';
import {useNavigation} from '@react-navigation/native';

const BillingDetailScreen = () => {
  const [savePayment, setSavePayment] = useState(false);
  const [cardNumber, setCardNumber] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [ccv, setCCV] = useState('');
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Card Holder Name</Text>
      <TextInput
        style={[styles.input, {height: 50}]}
        placeholder="name"
        placeholderTextColor={Colors.gray}
      />

      <Text style={styles.label}>Credit/Debit Card</Text>
      <View style={styles.cardInput}>
        <TextInput
          style={[styles.cardNumber, {height: 40}]}
          placeholder="XXXX XXXX XXXX XXXX"
          placeholderTextColor={Colors.gray}
          keyboardType="numeric"
          maxLength={19}
          value={cardNumber}
          onChangeText={text => {
            const numericText = text.replace(/\D/g, '');
            const formattedText = numericText.replace(/(\d{4})/g, '$1 ').trim();
            setCardNumber(formattedText);
          }}
        />
        <SVG.MasterCard />
      </View>
      <View style={styles.row}>
        <View style={styles.smallInputContainer}>
          <Text style={styles.label}>Expiry Date</Text>
          <TextInput
            style={[styles.smallInput, {height: 50}]}
            placeholder="MM/YY"
            placeholderTextColor={Colors.gray}
            keyboardType="numeric"
            maxLength={5}
            value={expiryDate}
            onChangeText={text => {
              let numericText = text.replace(/\D/g, '');

              if (numericText.length > 4) {
                numericText = numericText.slice(0, 4);
              }

              let formattedText = numericText.replace(
                /(\d{2})(\d{1,2})?/,
                (match, p1, p2) => (p2 ? `${p1}/${p2}` : p1),
              );

              setExpiryDate(formattedText);
            }}
          />
        </View>

        <View style={styles.smallInputContainer}>
          <Text style={styles.label}>CCV</Text>
          <TextInput
            style={[styles.smallInput, {height: 50}]}
            placeholder="XXX"
            placeholderTextColor={Colors.gray}
            keyboardType="numeric"
            maxLength={3}
            secureTextEntry
            value={ccv}
            onChangeText={text => {
              const numericText = text.replace(/\D/g, '');
              setCCV(numericText.slice(0, 3));
            }}
          />
        </View>
      </View>

      <TouchableOpacity
        style={styles.checkboxContainer}
        onPress={() => setSavePayment(!savePayment)}>
        {savePayment ? <SVG.FilterTicks /> : <SVG.EmptyTick />}
        <Text style={styles.checkboxText}>Save Payment Information</Text>
      </TouchableOpacity>

      <View style={styles.summaryBox}>
        <Text style={styles.summaryHeader}>Summary</Text>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryText}>Subtotal</Text>
          <Text style={styles.summaryAmount}>$50</Text>
        </View>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryText}>VAT (20%)</Text>
          <Text style={styles.summaryAmount}>$10</Text>
        </View>
        <View style={styles.separator} />
        <View style={styles.summaryRow}>
          <Text style={styles.summaryTotalText}>Total Amount</Text>
          <Text style={styles.summaryTotalAmount}>$60</Text>
        </View>
      </View>
      <TouchableOpacity
        style={styles.btn}
        onPress={() => navigation.navigate('Receipt')}>
        <Text style={styles.btnText}>Pay $60</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.black,
    padding: 20,
  },
  label: {
    color: Colors.white,
    fontSize: 16,
    fontFamily: Fonts.normal,
    marginBottom: 5,
  },
  input: {
    backgroundColor: Colors.darkGray,
    color: Colors.white,
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
  },
  cardInput: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.darkGray,
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
  },
  cardNumber: {
    flex: 1,
    color: Colors.white,
  },
  cardIcon: {
    width: 30,
    height: 20,
    marginLeft: 10,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  smallInputContainer: {
    flex: 1,
    marginRight: 10,
  },
  smallInput: {
    backgroundColor: Colors.darkGray,
    color: Colors.white,
    padding: 15,
    borderRadius: 10,
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 15,
  },
  checkboxText: {
    color: Colors.white,
    marginLeft: 10,
    fontSize: 16,
  },
  summaryBox: {
    backgroundColor: Colors.darkGray,
    padding: 20,
    borderRadius: 10,
    marginBottom: 20,
  },
  summaryHeader: {
    color: Colors.white,
    fontSize: 20,
    fontFamily: Fonts.normal,
    marginBottom: 10,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 5,
  },
  summaryText: {
    color: Colors.gray,
    fontSize: 16,
  },
  summaryAmount: {
    color: Colors.white,
    fontSize: 16,
  },
  separator: {
    borderBottomWidth: 1,
    borderBottomColor: Colors.gray,
    marginVertical: 10,
  },
  summaryTotalText: {
    color: Colors.white,
    fontSize: 16,
    fontFamily: Fonts.normal,
  },
  summaryTotalAmount: {
    color: Colors.white,
    fontSize: 16,
    fontFamily: Fonts.normal,
  },
  btn: {
    backgroundColor: Colors.red,
    alignItems: 'center',
    padding: 10,
    borderRadius: 8,
    marginTop: 10,
  },
  btnText: {
    color: Colors.white,
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default BillingDetailScreen;
