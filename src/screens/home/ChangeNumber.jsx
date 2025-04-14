import React, {useState} from 'react';
import {View, StyleSheet, ScrollView} from 'react-native';
import Colors from '../../theme/color';
import SVG from '../../assets/svg';
import CustomTextInput from '../../components/CustomTextInput';
import {useNavigation} from '@react-navigation/native';
import CustomButton from '../../components/CustomButton';
import {showToast} from '../../utility/Toast';
import makeRequest from '../../api/http';
import {EndPoints} from '../../api/config';
import {Validation} from '../../utility/Validation';

const ChangeNumber = () => {
  const [number, setNumber] = useState('');
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation();

  const handleUpdate = async () => {
    if (!number.trim()) {
      showToast({message: 'Please enter a valid number', type: 'error'});
      return;
    }
    if (!Validation.mobile.test(number)) {
      showToast({
        message: 'Please enter a valid 10-digit mobile number',
        type: 'error',
      });
      return;
    }

    try {
      setLoading(true);
      const response = await makeRequest({
        endPoint: EndPoints.Mobile,
        method: 'PATCH',
        body: {mobile: number},
      });

      showToast({message: 'Number updated successfully!', type: 'success'});
      navigation.goBack();
    } catch (error) {
      showToast({
        message: error.message || 'Failed to update number',
        type: 'error',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.profileHeader}>
        <CustomTextInput
          value={number}
          onChangeText={setNumber}
          placeholder="Enter New Number"
          icon={SVG.PhoneList}
          keyboardType="numeric"
        />
        <CustomButton
          title={loading ? 'Updating...' : 'Update'}
          onPress={handleUpdate}
          disabled={loading}
        />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.black,
  },
  profileHeader: {
    padding: 20,
    gap: 10,
  },
});

export default ChangeNumber;
