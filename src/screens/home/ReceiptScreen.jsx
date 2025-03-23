import React from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import SVG from '../../assets/svg';
import CustomButton from '../../components/CustomButton';
import Colors from '../../theme/color';
import {Fonts} from '../../assets/fonts';
import {useNavigation} from '@react-navigation/native';

const ReceiptScreen = () => {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <SVG.GreenTick style={styles.greenTick} />
        <Text style={styles.successText}>Payment Success</Text>
        <Text style={styles.subText}>
          Your payment has been successfully transferred
        </Text>
        <View style={[styles.cutout, styles.leftCutout]} />
        <View
          style={{
            borderBottomWidth: 1,
            borderBottomColor: Colors.gray,
            borderStyle: 'dashed',
            width: '100%',
            marginVertical: 30,
          }}></View>
        <View style={[styles.cutout, styles.rightCutout]} />

        <View style={styles.detailsContainer}>
          <View style={styles.row}>
            <Text style={styles.label}>Reference Number</Text>
            <Text style={styles.value}>26584452</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Date</Text>
            <Text style={styles.value}>12/02/2025</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Time</Text>
            <Text style={styles.value}>08:45 PM</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Payment Method</Text>
            <Text style={styles.value}>Credit Card</Text>
          </View>

          <View
            style={{
              borderBottomWidth: 1,
              borderBottomColor: Colors.gray,
              borderStyle: 'dashed',
              width: '100%',
              marginVertical: 25,
            }}></View>

          <View style={styles.row}>
            <Text style={styles.label}>Total Amount</Text>
            <Text style={styles.value}>$60</Text>
          </View>
        </View>

        <View
          style={{
            borderBottomWidth: 1,
            borderBottomColor: Colors.gray,
            borderStyle: 'dashed',
            width: '100%',
            marginTop: 40,
          }}></View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.shareButton}>
            <Text style={styles.buttonText}>Share</Text>
            <SVG.ShareIcon />
          </TouchableOpacity>
          <TouchableOpacity style={styles.downloadButton}>
            <Text style={styles.downloadText}>Download Receipt</Text>
            <SVG.DownloadIcon />
          </TouchableOpacity>
        </View>
      </View>

      <CustomButton
        title="Back to Home"
        style={{marginTop: 35}}
        onPress={() => navigation.goBack()}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.black,
    padding: 20,
  },
  card: {
    backgroundColor: Colors.darkGray,
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  greenTick: {
    marginBottom: 10,
  },
  successText: {
    fontSize: 20,
    color: Colors.white,
    fontFamily: Fonts.normal,
  },
  subText: {
    fontSize: 15,
    color: Colors.gray,
    textAlign: 'center',
    marginBottom: 10,
  },
  cutout: {
    position: 'absolute',
    width: 24,
    height: 24,
    backgroundColor: '#000',
    borderRadius: 13,
  },
  leftCutout: {
    left: -10,
    top: '32%',
    transform: [{translateY: -9}],
  },
  rightCutout: {
    right: -10,
    top: '32%',
    transform: [{translateY: -9}],
  },
  detailsContainer: {
    width: '100%',
    marginTop: 10,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 5,
  },
  label: {
    color: Colors.gray,
    fontSize: 14,
  },
  value: {
    color: Colors.white,
    fontSize: 14,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 40,
    width: '100%',
  },
  shareButton: {
    flex: 1,
    padding: 10,
    borderWidth: 1,
    borderColor: Colors.white,
    borderRadius: 5,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 5,
  },
  downloadButton: {
    flex: 1,
    paddingHorizontal: 21,
    backgroundColor: Colors.white,
    borderRadius: 8,
    alignItems: 'center',
    marginLeft: 10,
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 5,
  },
  buttonText: {
    color: Colors.white,
    fontSize: 16,
  },
  downloadText: {
    color: Colors.black,
    fontSize: 16,
  },
});

export default ReceiptScreen;
