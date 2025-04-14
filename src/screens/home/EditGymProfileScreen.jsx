import React, {useState} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Image,
  StyleSheet,
} from 'react-native';
import IMAGES from '../../assets/images';
import {Fonts} from '../../assets/fonts';
import Colors from '../../theme/color';
import {useNavigation} from '@react-navigation/native';
import CustomButton from '../../components/CustomButton';
import * as ImagePicker from 'react-native-image-picker';
import {EndPoints} from '../../api/config';
import makeRequest from '../../api/http';
import {showToast} from '../../utility/Toast';
import MapView, {Marker} from 'react-native-maps';
import SVG from '../../assets/svg';

const EditGymProfileScreen = () => {
  const [name, setName] = useState('');
  const [gymDescription, setGymDescription] = useState('');
  const [address, setAddress] = useState('');
  const [country, setCountry] = useState('');
  const [state, setState] = useState('');
  const [city, setCity] = useState('');
  const [zipCode, setZipCode] = useState('');
  const [latitude, setLatitude] = useState('28.6139');
  const [longitude, setLongitude] = useState('77.209');
  const [image, setImage] = useState(null);
  const navigation = useNavigation();

  const handleImagePick = async () => {
    const options = {mediaType: 'photo', quality: 1};

    ImagePicker.launchImageLibrary(options, response => {
      if (response.didCancel) {
        showToast({message: 'Image selection cancelled', type: 'info'});
        return;
      }

      if (response.errorCode) {
        showToast({message: `Error: ${response.errorCode}`, type: 'error'});
        return;
      }

      if (response.assets && response.assets.length > 0) {
        const selectedImage = response.assets[0];

        console.log('Selected Image URI:', selectedImage.uri);

        if (selectedImage.uri) {
          setImage(selectedImage);
        } else {
          showToast({message: 'Invalid Image URI', type: 'error'});
        }
      } else {
        showToast({message: 'No image selected', type: 'error'});
      }
    });
  };

  const handleUpdate = async () => {
    if (
      !name?.trim() ||
      !gymDescription?.trim() ||
      !address?.trim() ||
      !country?.trim() ||
      !state?.trim() ||
      !city?.trim() ||
      !zipCode?.trim() ||
      !latitude?.trim() ||
      !longitude?.trim()
    ) {
      showToast({message: 'All fields are required', type: 'error'});
      return;
    }

    const formData = new FormData();
    formData.append('name', name);
    formData.append('description', gymDescription);
    formData.append('address', address);
    formData.append('country', country);
    formData.append('state', state);
    formData.append('city', city);
    formData.append('zip_code', zipCode);
    formData.append('latitude', latitude);
    formData.append('longitude', longitude);

    if (image) {
      formData.append('image', {
        uri: image.uri,
        name: image.fileName || 'profile.jpg',
        type: image.type || 'image/jpeg',
      });
    }

    try {
      const response = await makeRequest({
        endPoint: EndPoints.ProfileStore,
        method: 'POST',
        body: formData,
        headers: {'Content-Type': 'multipart/form-data'},
      });
      showToast({
        message: response.message || 'Profile updated successfully',
        type: 'success',
      });
      navigation.goBack();
    } catch (error) {
      console.error('Profile update failed:', error);
      showToast({
        message: error.message || 'Profile update failed',
        type: 'error',
      });
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.image}>
        <Image
          source={image?.uri ? {uri: image.uri} : IMAGES.BigProfile}
          style={styles.image}
          onError={e => console.log('Image Load Error:', e.nativeEvent.error)}
        />
        <TouchableOpacity style={{position: 'absolute', right: 155, top: 140}}>
          <SVG.Camera />
        </TouchableOpacity>

        <TouchableOpacity onPress={handleImagePick}>
          <Text style={styles.imageText}>Change Picture</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.contentContainer}>
        <Text style={styles.labels}>Basic Information</Text>
        <TextInput
          style={[styles.input, {height: 40}]}
          placeholder="Name"
          value={name}
          onChangeText={setName}
          placeholderTextColor={Colors.gray}
          color={Colors.gray}
        />

        <TextInput
          style={[styles.input, styles.textArea]}
          placeholder="About the Gym"
          multiline
          value={gymDescription}
          onChangeText={setGymDescription}
          placeholderTextColor={Colors.gray}
          color={Colors.gray}
        />
        <Text style={styles.label}>Address & Location</Text>
        <TextInput
          style={[styles.input, {height: 40}]}
          placeholder="Address"
          value={address}
          onChangeText={setAddress}
          placeholderTextColor={Colors.gray}
          color={Colors.gray}
        />
        <TextInput
          style={[styles.input, {height: 40}]}
          placeholder="Country"
          value={country}
          onChangeText={setCountry}
          placeholderTextColor={Colors.gray}
          color={Colors.gray}
        />
        <TextInput
          style={[styles.input, {height: 40}]}
          placeholder="State/Province"
          value={state}
          onChangeText={setState}
          placeholderTextColor={Colors.gray}
          color={Colors.gray}
        />
        <TextInput
          style={[styles.input, {height: 40}]}
          placeholder="City"
          value={city}
          onChangeText={setCity}
          placeholderTextColor={Colors.gray}
          color={Colors.gray}
        />
        <TextInput
          style={[styles.input, {height: 40}]}
          placeholder="Postal/Zip Code"
          value={zipCode}
          onChangeText={setZipCode}
          placeholderTextColor={Colors.gray}
          color={Colors.gray}
        />
        <View style={styles.mapContainer}>
          <MapView
            style={{flex: 1}}
            initialRegion={{
              latitude: 28.6139,
              longitude: 77.209,
              latitudeDelta: 0.1,
              longitudeDelta: 0.1,
            }}>
            <Marker
              coordinate={{latitude: 28.6139, longitude: 77.209}}
              title="Gym Location"
              description="This is the gym's location"
            />
          </MapView>
        </View>

        <View style={{marginBottom: 20}}>
          <CustomButton title="Update Now" onPress={handleUpdate} />
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.black,
  },
  image: {
    alignItems: 'center',
    paddingTop: 30,
  },
  imageText: {
    color: Colors.litegray,
    fontSize: 16,
    fontFamily: Fonts.normal,
  },
  contentContainer: {
    margin: 15,
  },
  label: {
    color: Colors.white,
    marginBottom: 5,
  },
  labels: {
    color: Colors.white,
    marginBottom: 5,
    fontSize: 20,
  },
  input: {
    backgroundColor: Colors.darkGray,
    borderRadius: 8,
    padding: 10,
    marginBottom: 10,
  },
  textArea: {
    height: 169,
    textAlignVertical: 'top',
  },
  mapContainer: {
    height: 160,
    marginBottom: 20,
  },
});

export default EditGymProfileScreen;
