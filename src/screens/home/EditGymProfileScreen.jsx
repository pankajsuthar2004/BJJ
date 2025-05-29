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
import {launchImageLibrary} from 'react-native-image-picker';
import MapView, {Marker} from 'react-native-maps';
import makeRequest from '../../api/http';
import {EndPoints} from '../../api/config';
import {showToast} from '../../utility/Toast';
import {useAppDispatch, useAppSelector} from '../../store/Hooks';
import {setUser} from '../../Slices/UserSlice';

const EditGymProfileScreen = () => {
  const navigation = useNavigation();
  const user = useAppSelector(s => s.user);
  const dispatch = useAppDispatch();
  const [name, setName] = useState(user?.user?.gym?.name ?? '');
  const [gymDescription, setGymDescription] = useState(
    user?.user?.gym?.description ?? '',
  );
  const [address, setAddress] = useState(user?.user?.gym?.address ?? '');
  const [country, setCountry] = useState(user?.user?.gym?.country ?? '');
  const [state, setState] = useState(user?.user?.gym?.state ?? '');
  const [city, setCity] = useState(user?.user?.gym?.city ?? '');
  const [zipCode, setZipCode] = useState(user?.user?.gym?.zip_code ?? '');
  const [latitude, setLatitude] = useState(28.6139);
  const [longitude, setLongitude] = useState(77.209);
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);

  const pickImage = async () => {
    const result = await launchImageLibrary({mediaType: 'photo'});
    if (!result.didCancel && result.assets?.length > 0) {
      setImage(result.assets[0]);
    }
  };

  const handleCreateProfile = async () => {
    try {
      if (!image) {
        showToast({message: 'Please select an image'});
        return;
      }

      const formData = new FormData();
      formData.append('image', {
        uri:
          image.uri ??
          (!user?.user?.gym?.image
            ? 'storage/uploads/profile/pmShalGbXBPhio0hczkWwIIuzbmxt6rhMAzsjVXD.jpg'
            : null),
        type: image.type || 'image/jpeg',
        name: image.fileName || 'profile.jpg',
      });
      formData.append('name', name.trim());
      formData.append('description', gymDescription.trim());
      formData.append('address', address.trim());
      formData.append('country', country.trim());
      formData.append('state', state.trim());
      formData.append('city', city.trim());
      formData.append('zip_code', zipCode.trim());
      formData.append('latitude', latitude.toString());
      formData.append('longitude', longitude.toString());

      setLoading(true);

      const response = await makeRequest({
        endPoint: EndPoints.ProfileStore,
        method: 'POST',
        body: formData,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      dispatch(setUser({...user?.user, gym: response}));

      showToast({message: 'Profile updated successfully', type: 'success'});
      navigation.goBack();
    } catch (error) {
      console.log('Error while updating profile:', error?.response || error);
      showToast({message: 'Failed to update profile'});
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.image}>
        {image ? (
          <Image
            source={{uri: image.uri}}
            style={{width: 120, height: 120, borderRadius: 60}}
          />
        ) : user?.user?.gym?.image ? (
          <Image
            source={{
              uri: 'http://89.116.212.241:9083/' + user?.user?.gym?.image,
            }}
            style={{width: 120, height: 120, borderRadius: 60}}
          />
        ) : (
          <TouchableOpacity onPress={pickImage}>
            <Image source={IMAGES.ProfileCam} />
            {/* <SVG.ImageCam /> */}
          </TouchableOpacity>
        )}

        <TouchableOpacity onPress={pickImage}>
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
          color={Colors.white}
        />

        <TextInput
          style={[styles.input, styles.textArea]}
          placeholder="About the Gym"
          multiline
          value={gymDescription}
          onChangeText={setGymDescription}
          placeholderTextColor={Colors.gray}
          color={Colors.white}
        />

        <Text style={styles.label}>Address & Location</Text>

        <TextInput
          style={[styles.input, {height: 40}]}
          placeholder="Address"
          value={address}
          onChangeText={setAddress}
          placeholderTextColor={Colors.gray}
          color={Colors.white}
        />
        <TextInput
          style={[styles.input, {height: 40}]}
          placeholder="Country"
          value={country}
          onChangeText={setCountry}
          placeholderTextColor={Colors.gray}
          color={Colors.white}
        />
        <TextInput
          style={[styles.input, {height: 40}]}
          placeholder="State/Province"
          value={state}
          onChangeText={setState}
          placeholderTextColor={Colors.gray}
          color={Colors.white}
        />
        <TextInput
          style={[styles.input, {height: 40}]}
          placeholder="City"
          value={city}
          onChangeText={setCity}
          placeholderTextColor={Colors.gray}
          color={Colors.white}
        />
        <TextInput
          style={[styles.input, {height: 40}]}
          placeholder="Postal/Zip Code"
          value={zipCode}
          onChangeText={setZipCode}
          placeholderTextColor={Colors.gray}
          color={Colors.white}
        />

        <View style={styles.mapContainer}>
          <MapView
            style={{flex: 1}}
            initialRegion={{
              latitude,
              longitude,
              latitudeDelta: 0.1,
              longitudeDelta: 0.1,
            }}>
            <Marker
              coordinate={{latitude, longitude}}
              title="Gym Location"
              description="This is the gym's location"
            />
          </MapView>
        </View>

        <View style={{marginBottom: 20}}>
          <CustomButton
            title={loading ? 'Updating...' : 'Update Now'}
            onPress={handleCreateProfile}
            disabled={loading}
          />
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
