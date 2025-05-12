import React, {useState} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Image,
  ImageBackground,
  StyleSheet,
} from 'react-native';
import {launchImageLibrary} from 'react-native-image-picker';
import MapView, {Marker} from 'react-native-maps';
import {useNavigation} from '@react-navigation/native';
import IMAGES from '../../assets/images';
import {Fonts} from '../../assets/fonts';
import Colors from '../../theme/color';
import makeRequest from '../../api/http';
import {EndPoints} from '../../api/config';
import {showToast} from '../../utility/Toast';
import AppLoader from '../../components/AppLoader';

const GymProfileScreen = () => {
  const navigation = useNavigation();
  const [gymName, setGymName] = useState('');
  const [gymDescription, setGymDescription] = useState('');
  const [address, setAddress] = useState('');
  const [country, setCountry] = useState('');
  const [state, setState] = useState('');
  const [city, setCity] = useState('');
  const [zipCode, setZipCode] = useState('');
  const [latitude, setLatitude] = useState('28.6139');
  const [longitude, setLongitude] = useState('77.2090');
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);

  const pickImage = async () => {
    const result = await launchImageLibrary({mediaType: 'photo'});
    if (!result.didCancel && result.assets?.length > 0) {
      const selectedImage = result.assets[0];
      if (selectedImage.fileSize && selectedImage.fileSize > 2 * 1024 * 1024) {
        showToast({message: 'Image size should be less than 2MB'});
        return;
      }
      setImage(selectedImage);
    }
  };

  const handleCreateProfile = async () => {
    try {
      const formData = new FormData();

      if (image) {
        if (image.fileSize && image.fileSize > 2 * 1024 * 1024) {
          showToast({message: 'Image size should be less than 2MB'});
          return;
        }

        formData.append('image', {
          uri: image.uri,
          type: image.type || 'image/jpeg',
          name: image.fileName || 'profile.jpg',
        });
      }

      formData.append('name', gymName.trim());
      formData.append('description', gymDescription.trim());
      formData.append('address', address.trim());
      formData.append('country', country.trim());
      formData.append('state', state.trim());
      formData.append('city', city.trim());
      formData.append('zip_code', zipCode.trim());
      formData.append('latitude', latitude?.toString());
      formData.append('longitude', longitude?.toString());

      setLoading(true);

      const response = await makeRequest({
        endPoint: EndPoints.ProfileStore,
        method: 'POST',
        body: formData,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      setLoading(false);

      showToast({message: 'Profile created successfully', type: 'success'});
      navigation.navigate('gym profile');
    } catch (error) {
      setLoading(false);
      console.log('Error while creating profile:', error?.response || error);
      showToast({message: 'Failed to create profile'});
    }
  };

  return (
    <ScrollView style={styles.container}>
      {loading && <AppLoader loading={loading} />}
      <ImageBackground style={styles.imageBackground} source={IMAGES.BgImage}>
        {image ? (
          <Image
            source={{uri: image.uri}}
            style={{width: 120, height: 120, borderRadius: 60}}
          />
        ) : (
          <TouchableOpacity onPress={pickImage}>
            <Image source={IMAGES.ProfileCam} />
          </TouchableOpacity>
        )}
      </ImageBackground>

      <View style={styles.contentContainer}>
        <Text style={styles.label}>Gym Name</Text>
        <TextInput
          style={[styles.input, {height: 40}]}
          placeholder="Name"
          value={gymName}
          onChangeText={setGymName}
        />

        <Text style={styles.label}>Gym Description</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          placeholder="About the Gym"
          multiline
          value={gymDescription}
          onChangeText={setGymDescription}
        />

        <Text style={styles.label}>Address & Location</Text>
        <TextInput
          style={[styles.input, {height: 40}]}
          placeholder="Address"
          value={address}
          onChangeText={setAddress}
        />
        <TextInput
          style={[styles.input, {height: 40}]}
          placeholder="Country"
          value={country}
          onChangeText={setCountry}
        />
        <TextInput
          style={[styles.input, {height: 40}]}
          placeholder="State/Province"
          value={state}
          onChangeText={setState}
        />
        <TextInput
          style={[styles.input, {height: 40}]}
          placeholder="City"
          value={city}
          onChangeText={setCity}
        />
        <TextInput
          style={[styles.input, {height: 40}]}
          placeholder="Postal/Zip Code"
          value={zipCode}
          onChangeText={setZipCode}
        />

        <View style={styles.mapContainer}>
          <MapView
            style={{flex: 1}}
            initialRegion={{
              latitude: parseFloat(latitude),
              longitude: parseFloat(longitude),
              latitudeDelta: 0.1,
              longitudeDelta: 0.1,
            }}>
            <Marker
              coordinate={{
                latitude: parseFloat(latitude),
                longitude: parseFloat(longitude),
              }}
              title="Gym Location"
              description="This is the gym's location"
            />
          </MapView>
        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.cancelFormButton}>
            <Text style={styles.cancelFormButtonText}>Cancel</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.createButton}
            onPress={handleCreateProfile}>
            <Text style={styles.createButtonText}>Create</Text>
          </TouchableOpacity>
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
  imageBackground: {
    alignItems: 'center',
    paddingTop: 30,
  },
  contentContainer: {
    margin: 15,
  },
  label: {
    color: Colors.white,
    marginBottom: 5,
  },
  input: {
    backgroundColor: Colors.white,
    borderRadius: 8,
    padding: 10,
    marginBottom: 10,
  },
  textArea: {
    height: 80,
    textAlignVertical: 'top',
  },
  planContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: Colors.white,
    borderRadius: 8,
    padding: 10,
    marginBottom: 10,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
  },
  modalContent: {
    width: '90%',
    backgroundColor: Colors.white,
    padding: 20,
    borderRadius: 10,
  },
  modalLabel: {
    fontSize: 16,
    fontFamily: Fonts.normal,
    marginBottom: 10,
  },
  modalInput: {
    borderWidth: 1,
    borderColor: Colors.litegray,
    borderRadius: 8,
    padding: 10,
    marginBottom: 10,
  },
  modalButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  cancelButton: {
    borderColor: 'red',
    borderWidth: 1,
    borderRadius: 8,
    padding: 10,
    marginRight: 10,
  },
  cancelButtonText: {
    color: Colors.red,
  },
  addButton: {
    backgroundColor: Colors.black,
    borderRadius: 8,
    padding: 10,
  },
  addButtonText: {
    color: Colors.white,
  },
  mapContainer: {
    height: 160,
    marginBottom: 20,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  cancelFormButton: {
    flex: 1,
    backgroundColor: Colors.black,
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.white,
    alignItems: 'center',
    marginRight: 10,
  },
  cancelFormButtonText: {
    color: Colors.white,
  },
  createButton: {
    flex: 1,
    backgroundColor: Colors.red,
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  createButtonText: {
    color: Colors.white,
    fontFamily: Fonts.normal,
  },
});

export default GymProfileScreen;
