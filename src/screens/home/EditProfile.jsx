import React, {useState} from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from 'react-native';
import IMAGES from '../../assets/images';
import Colors from '../../theme/color';
import {Fonts} from '../../assets/fonts';
import SVG from '../../assets/svg';
import CustomTextInput from '../../components/CustomTextInput';
import {useNavigation} from '@react-navigation/native';
import CustomButton from '../../components/CustomButton';

const EditProfile = () => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');

  const navigation = useNavigation();

  const handleUpdate = () => {
    navigation.goBack();
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.profileHeader}>
        <View style={styles.profileContainer}>
          <Image source={IMAGES.BigProfile} />
          <TouchableOpacity>
            <Text style={styles.editText}>Change Picture</Text>
          </TouchableOpacity>
        </View>
        <Text style={styles.label}>Your information</Text>

        <CustomTextInput
          value={firstName}
          onChangeText={setFirstName}
          placeholder="First Name"
          icon={SVG.Name}
        />
        <CustomTextInput
          value={lastName}
          onChangeText={setLastName}
          placeholder="Last Name"
          icon={SVG.Name}
        />
        <CustomTextInput
          value={email}
          onChangeText={setEmail}
          placeholder="Email"
          icon={SVG.Email}
        />
        <CustomTextInput
          value={phone}
          onChangeText={setPhone}
          placeholder="Phone No"
          icon={SVG.Phone}
        />
        <CustomButton title="Update Now" onPress={handleUpdate} />
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

export default EditProfile;
