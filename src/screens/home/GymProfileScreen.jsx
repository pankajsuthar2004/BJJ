import React, {useState} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Image,
  ImageBackground,
  Modal,
  StyleSheet,
} from 'react-native';
import IMAGES from '../../assets/images';
import MapView, {Marker} from 'react-native-maps';
import {Fonts} from '../../assets/fonts';
import Colors from '../../theme/color';
import {useNavigation} from '@react-navigation/native';

const GymProfileScreen = () => {
  const [gymName, setGymName] = useState('');
  const [gymDescription, setGymDescription] = useState('');
  const navigation = useNavigation();

  return (
    <ScrollView style={styles.container}>
      <ImageBackground style={styles.imageBackground} source={IMAGES.BgImage}>
        <Image source={IMAGES.BigProfile} />
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
        <TextInput style={styles.input} placeholder="Address" />
        <TextInput style={styles.input} placeholder="Country" />
        <TextInput style={styles.input} placeholder="State/Province" />
        <TextInput style={styles.input} placeholder="City" />
        <TextInput style={styles.input} placeholder="Postal/Zip Code" />

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

        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.cancelFormButton}>
            <Text style={styles.cancelFormButtonText}>Cancel</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.createButton}
            onPress={() => navigation.navigate('gym profile')}>
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
