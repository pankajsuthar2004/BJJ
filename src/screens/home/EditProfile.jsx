import React, {useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  StyleSheet,
} from 'react-native';
import {launchImageLibrary} from 'react-native-image-picker';
import {showToast} from '../../utility/Toast';
import {EndPoints} from '../../api/config';
import makeRequest from '../../api/http';
import Colors from '../../theme/color';
import {Fonts} from '../../assets/fonts';
import IMAGES from '../../assets/images';
import CustomTextInput from '../../components/CustomTextInput';
import SVG from '../../assets/svg';
import {Validation} from '../../utility/Validation';

const EditProfile = ({navigation, AUTH_TOKEN}) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChangePicture = async () => {
    const options = {
      mediaType: 'photo',
      quality: 1,
    };

    launchImageLibrary(options, response => {
      if (response.didCancel) {
        showToast({message: 'Image selection cancelled', type: 'info'});
        return;
      }

      if (response.errorCode) {
        showToast({message: `Error: ${response.errorCode}`, type: 'error'});
        return;
      }

      if (!response.assets || response.assets.length === 0) {
        showToast({message: 'No image selected', type: 'error'});
        return;
      }

      setImage(response.assets[0].uri);
    });
  };

  const validateForm = () => {
    if (!name.trim()) {
      showToast({message: 'Name is required', type: 'error'});
      return false;
    }
    if (!Validation.name.test(name.trim())) {
      showToast({message: 'Name contains invalid characters', type: 'error'});
      return false;
    }

    if (!email.trim()) {
      showToast({message: 'Email is required', type: 'error'});
      return false;
    }
    if (!Validation.email.test(email.trim())) {
      showToast({message: 'Please enter a valid email address', type: 'error'});
      return false;
    }

    if (!phone.trim()) {
      showToast({message: 'Phone number is required', type: 'error'});
      return false;
    }
    if (!Validation.phone.test(phone.trim())) {
      showToast({message: 'Phone number must be 10 digits', type: 'error'});
      return false;
    }

    return true;
  };

  const handleUpdate = async () => {
    if (!validateForm()) return;

    setLoading(true);

    const formData = new FormData();
    formData.append('name', name);
    formData.append('email', email);
    formData.append('mobile', phone);

    if (image) {
      formData.append('image', {
        uri: image,
        name: 'profile.jpg',
        type: 'image/jpeg',
      });
    }

    console.log('Sending Data:', formData);

    try {
      const response = await makeRequest({
        endPoint: EndPoints.Profile,
        method: 'POST',
        body: formData,
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${AUTH_TOKEN}`,
        },
      });

      if (response) {
        showToast({message: 'Profile updated successfully', type: 'success'});
        navigation.goBack();
      } else {
        showToast({
          message: response?.message || 'Failed to update profile',
          type: 'error',
        });
      }
    } catch (error) {
      console.log('API Error:', error?.response?.data || error.message);
      showToast({message: 'Error updating profile', type: 'error'});
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.profileHeader}>
        <TouchableOpacity
          onPress={handleChangePicture}
          style={styles.profileContainer}>
          <Image
            source={image ? {uri: image} : IMAGES.BigProfile}
            style={styles.profileImage}
          />
          <TouchableOpacity style={{position: 'absolute', right: 150, top: 80}}>
            <SVG.Camera />
          </TouchableOpacity>
          <Text style={styles.editText}>Change Picture</Text>
        </TouchableOpacity>
        <Text style={styles.label}>Your Information</Text>

        <CustomTextInput
          placeholder="First Name"
          value={name}
          onChangeText={setName}
          icon={SVG.Name}
        />
        <CustomTextInput
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          icon={SVG.Email}
        />
        <CustomTextInput
          placeholder="Phone"
          value={phone}
          onChangeText={setPhone}
          keyboardType="phone-pad"
          icon={SVG.Phone}
        />

        <TouchableOpacity onPress={handleUpdate} style={styles.updateButton}>
          {loading ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text style={styles.updateText}>Update Now</Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.black,
    padding: 20,
  },
  profileContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  profileHeader: {
    gap: 10,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
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
    backgroundColor: Colors.red,
    alignItems: 'center',
    justifyContent: 'center',
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
