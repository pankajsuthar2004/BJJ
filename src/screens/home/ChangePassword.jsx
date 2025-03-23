import React, {useState} from 'react';
import {View, StyleSheet, ScrollView} from 'react-native';
import Colors from '../../theme/color';
import SVG from '../../assets/svg';
import CustomTextInput from '../../components/CustomTextInput';
import {useNavigation} from '@react-navigation/native';
import CustomButton from '../../components/CustomButton';
import {EndPoints} from '../../api/config';
import makeRequest from '../../api/http';
import {showToast} from '../../utility/Toast';

const ChangePassword = () => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation();

  const handleUpdate = async () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      showToast({message: 'All fields are required', type: 'error'});
      return;
    }

    if (newPassword !== confirmPassword) {
      showToast({
        message: 'New password and confirm password not match',
        type: 'error',
      });
      return;
    }

    try {
      setLoading(true);
      const response = await makeRequest({
        endPoint: EndPoints.Password,
        method: 'PATCH',
        body: {
          old_password: currentPassword,
          password: newPassword,
          password_confirmation: confirmPassword,
        },
      });

      showToast({message: 'Password updated successfully!', type: 'success'});
      navigation.goBack();
    } catch (error) {
      showToast({
        message: error.message || 'Failed to update password',
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
          value={currentPassword}
          onChangeText={setCurrentPassword}
          placeholder="Current Password"
          icon={SVG.CarbonPassword}
          secureTextEntry
        />
        <CustomTextInput
          value={newPassword}
          onChangeText={setNewPassword}
          placeholder="New Password"
          icon={SVG.LockPassword}
          secureTextEntry
        />
        <CustomTextInput
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          placeholder="Confirm Password"
          icon={SVG.LockPassword}
          secureTextEntry
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

export default ChangePassword;
