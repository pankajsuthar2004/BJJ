import React, {useState} from 'react';
import {View, StyleSheet, ScrollView} from 'react-native';
import Colors from '../../theme/color';
import {Fonts} from '../../assets/fonts';
import SVG from '../../assets/svg';
import CustomTextInput from '../../components/CustomTextInput';
import {useNavigation} from '@react-navigation/native';
import CustomButton from '../../components/CustomButton';

const ChangePassword = () => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const navigation = useNavigation();

  const handleUpdate = () => {
    navigation.goBack();
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.profileHeader}>
        <CustomTextInput
          value={currentPassword}
          onChangeText={setCurrentPassword}
          placeholder="current password"
          icon={SVG.CarbonPassword}
        />
        <CustomTextInput
          value={newPassword}
          onChangeText={setNewPassword}
          placeholder="new password"
          icon={SVG.LockPassword}
        />
        <CustomTextInput
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          placeholder="confirm password"
          icon={SVG.LockPassword}
        />
        <CustomButton title="Update" onPress={handleUpdate} />
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
  profileContainer: {
    marginBottom: 10,
    alignItems: 'center',
  },
  editText: {
    fontSize: 16,
    color: Colors.gray,
    fontFamily: Fonts.normal,
    marginTop: 5,
  },
  label: {
    fontSize: 20,
    color: Colors.white,
    fontFamily: Fonts.normal,
    marginTop: 20,
  },
  updateButton: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.red,
    paddingVertical: 16,
    borderRadius: 8,
    marginTop: 10,
  },
  updateText: {
    color: Colors.white,
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default ChangePassword;
