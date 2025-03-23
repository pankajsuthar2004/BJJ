import React, {useState} from 'react';
import {View, ScrollView, StyleSheet, ActivityIndicator} from 'react-native';
import Colors from '../../theme/color';
import SVG from '../../assets/svg';
import CustomTextInput from '../../components/CustomTextInput';
import {useNavigation} from '@react-navigation/native';
import CustomButton from '../../components/CustomButton';
import {EndPoints} from '../../api/config';
import {showToast} from '../../utility/Toast';
import makeRequest from '../../api/http';

const ChangeEmail = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation();

  const handleUpdate = async () => {
    if (!email.trim()) {
      showToast({message: 'Please enter a valid email', type: 'error'});
      return;
    }

    try {
      setLoading(true);
      const response = await makeRequest({
        endPoint: EndPoints.Email,
        method: 'PATCH',
        body: {email},
      });

      showToast({
        message: response?.message || 'Email updated successfully',
        type: 'success',
      });
      navigation.goBack();
    } catch (error) {
      showToast({
        message: error?.message || 'Failed to update email',
        type: 'error',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container} keyboardShouldPersistTaps="handled">
      <View style={styles.profileHeader}>
        <CustomTextInput
          value={email}
          onChangeText={setEmail}
          placeholder="Enter New Email"
          icon={SVG.EmailLite}
        />
        <CustomButton
          title="Update"
          onPress={handleUpdate}
          disabled={loading}
        />
        {loading && <ActivityIndicator size="large" color={Colors.white} />}
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

export default ChangeEmail;
