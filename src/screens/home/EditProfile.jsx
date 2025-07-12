import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  StyleSheet,
  ScrollView,
} from 'react-native';
import {launchImageLibrary} from 'react-native-image-picker';
import {showToast} from '../../utility/Toast';
import {BASE_URL_FOR_IMAGE, EndPoints} from '../../api/config';
import makeRequest from '../../api/http';
import Colors from '../../theme/color';
import {Fonts} from '../../assets/fonts';
import IMAGES from '../../assets/images';
import CustomTextInput from '../../components/CustomTextInput';
import SVG from '../../assets/svg';
import {Validation} from '../../utility/Validation';
import AppLoader from '../../components/AppLoader';

const EditProfile = ({navigation, AUTH_TOKEN}) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [belt, setBelt] = useState('');
  const [beltDropdownVisible, setBeltDropdownVisible] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await makeRequest({
          endPoint: EndPoints.GetProfile,
          method: 'GET',
        });

        console.log('User Profile Response:', response);
        setEmail(response?.email || '');
        setName(response?.name || '');
        setPhone(response?.mobile || '');
        setImage(response?.image ? response.image : null);
        setUserData(response);
      } catch (error) {
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const beltOptions = [
    {label: 'Blue Belt', value: 1},
    {label: 'White Belt', value: 2},
    {label: 'Yellow Belt', value: 3},
    {label: 'Red Belt', value: 4},
    {label: 'Green Belt', value: 5},
  ];
  const beltIcons = {
    1: <SVG.Belt />,
    2: <SVG.Belt1 />,
    3: <SVG.Belt2 />,
    4: <SVG.Belt11 />,
    5: <SVG.Belt12 />,
  };

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
    if (!belt) {
      showToast({message: 'Please select a belt', type: 'error'});
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
    formData.append('belt', belt);

    if (image) {
      formData.append('image', {
        uri: image,
        name: 'profile.jpg',
        type: 'image/jpeg',
      });
    }

    try {
      const response = await makeRequest({
        endPoint: EndPoints.Profile,
        method: 'POST',
        body: formData,
        headers: {
          'Content-Type': 'multipart/form-data',
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
    <ScrollView style={styles.container}>
      <View style={styles.profileHeader}>
        {loading && <AppLoader loading={loading} />}
        <TouchableOpacity
          onPress={handleChangePicture}
          style={styles.profileContainer}>
          <Image
            source={
              image
                ? {
                    uri:
                      image.startsWith('http') || image.startsWith('file')
                        ? image
                        : `${BASE_URL_FOR_IMAGE}${image}`,
                  }
                : IMAGES.BigProfile
            }
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
          onChangeText={text => {
            const numericText = text.replace(/[^0-9]/g, '');
            setPhone(numericText);
          }}
          keyboardType="phone-pad"
          icon={SVG.Phone}
        />

        <Text style={styles.label}>Select Your Belt</Text>
        <TouchableOpacity
          onPress={() => setBeltDropdownVisible(!beltDropdownVisible)}
          style={styles.dropdownContainer}>
          <View style={styles.dropdownItemRow}>
            <View style={{flexDirection: 'row', gap: 10}}>
              {belt ? beltIcons[belt] : null}
              <Text style={styles.dropdownText}>
                {belt
                  ? beltOptions.find(opt => opt.value === belt)?.label
                  : 'Choose Belt'}
              </Text>
            </View>
            <View>
              {beltDropdownVisible ? <SVG.ArrowIcons /> : <SVG.ArrowIcon />}
            </View>
          </View>
        </TouchableOpacity>

        {beltDropdownVisible && (
          <View style={styles.dropdownList}>
            {beltOptions.map((item, index) => (
              <TouchableOpacity
                key={index}
                style={styles.dropdownItem}
                onPress={() => {
                  setBelt(item.value);
                  setBeltDropdownVisible(false);
                }}>
                <View style={styles.dropdownItemRow1}>
                  {beltIcons[item.value]}
                  <Text style={styles.dropdownItemText}>{item.label}</Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        )}

        <TouchableOpacity onPress={handleUpdate} style={styles.updateButton}>
          {loading ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text style={styles.updateText}>Update Now</Text>
          )}
        </TouchableOpacity>
      </View>
    </ScrollView>
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
    marginBottom: 50,
  },
  updateText: {
    color: Colors.white,
    fontSize: 16,
    fontWeight: 'bold',
  },
  dropdownContainer: {
    borderRadius: 8,
    padding: 12,
    backgroundColor: Colors.darkGray,
  },
  dropdownText: {
    fontSize: 16,
    color: Colors.gray,
    fontFamily: Fonts.normal,
  },
  dropdownList: {
    backgroundColor: Colors.darkGray,
    borderRadius: 8,
    marginTop: 4,
  },
  dropdownItem: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.black,
    backgroundColor: Colors.darkGray,
    borderRadius: 8,
  },
  dropdownItemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    justifyContent: 'space-between',
  },
  dropdownItemRow1: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  dropdownItemText: {
    fontSize: 16,
    color: Colors.gray,
  },
});

export default EditProfile;
