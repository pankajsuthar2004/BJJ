import React, {useState} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Image,
} from 'react-native';
import {useNavigation} from '@react-navigation/native'; // Import useNavigation
import Slider from '@react-native-community/slider';
import Colors from '../../theme/color';
import {Fonts} from '../../assets/fonts';
import {hp, wp} from '../../utility/ResponseUI';
import IMAGES from '../../assets/images';

const RoundScreen = () => {
  const [roundDuration, setRoundDuration] = useState(30);
  const [notes, setNotes] = useState('');
  const navigation = useNavigation(); // Hook to get navigation object

  const handleSelect = type => {
    console.log(`Navigate to ${type} selection screen`);
  };

  return (
    <View style={styles.container}>
      {/* Cross Icon */}
      <TouchableOpacity
        style={styles.crossIcon}
        onPress={() => navigation.goBack()} // Navigate back on press
      >
        <Image source={IMAGES.Cross} style={{width: 20, height: 20}} />
      </TouchableOpacity>

      <ScrollView
        style={{
          backgroundColor: Colors.white,
          flex: 1,
          borderRadius: 16,
          padding: 5,
        }}>
        {/* Round Duration */}
        <Text style={styles.label}>
          Round Duration
          <Text style={{fontSize: 12}}> (Minutes)</Text>
        </Text>
        <Text style={styles.duration}>{roundDuration}</Text>
        <View style={styles.sliderContainer}>
          <Slider
            style={styles.slider}
            minimumValue={1}
            maximumValue={60}
            step={1}
            value={roundDuration}
            onValueChange={setRoundDuration}
            minimumTrackTintColor="#FF4D4D"
            maximumTrackTintColor="#FFCCCC"
            thumbTintColor="#FF4D4D"
          />
        </View>

        {/* Sparring Partner */}
        <View style={styles.section}>
          <Text style={styles.label}>Sparring Partner</Text>
          <TouchableOpacity>
            <Image source={IMAGES.BlackPlus} />
          </TouchableOpacity>
        </View>

        {/* Submissions Achieved */}
        <TouchableOpacity
          style={styles.selectionButton}
          onPress={() => handleSelect('Submissions Achieved')}>
          <Image source={IMAGES.HugeIcons} />
          <Text style={styles.selectionText}>Submissions Achieved</Text>
        </TouchableOpacity>

        {/* Submissions Conceded */}
        <TouchableOpacity
          style={styles.selectionButton}
          onPress={() => handleSelect('Submissions Conceded')}>
          <Image source={IMAGES.HugeIcons} />
          <Text style={styles.selectionText}>Submissions Conceded</Text>
        </TouchableOpacity>

        {/* Positions Achieved */}
        <TouchableOpacity
          style={styles.selectionButton}
          onPress={() => handleSelect('Positions Achieved')}>
          <Image source={IMAGES.HugeIcons} />
          <Text style={styles.selectionText}>Positions Achieved</Text>
        </TouchableOpacity>

        {/* Positions Conceded */}
        <TouchableOpacity
          style={styles.selectionButton}
          onPress={() => handleSelect('Positions Conceded')}>
          <Image source={IMAGES.HugeIcons} />
          <Text style={styles.selectionText}>Positions Conceded</Text>
        </TouchableOpacity>

        {/* Notes */}
        <Text style={styles.label}>Notes</Text>
        <TextInput
          style={[
            styles.notesInput,
            {textAlignVertical: 'top', paddingTop: 15},
          ]}
          placeholder="notes here...."
          placeholderTextColor={Colors.darkGray}
          multiline
          value={notes}
          onChangeText={setNotes}
        />
        <View style={styles.section1}>
          <Text style={styles.label1}>Attach Files</Text>
          <TouchableOpacity style={styles.fileButton1}>
            <Image source={IMAGES.PaperClip} />
            <Text
              style={{
                color: Colors.white,
                fontSize: 16,
                fontFamily: Fonts.normal,
              }}>
              Choose File
            </Text>
          </TouchableOpacity>
        </View>
        <TouchableOpacity
          style={{
            backgroundColor: Colors.red,
            height: 48,
            justifyContent: 'center',
            borderRadius: 8,
            margin: 5,
            marginBottom: 25,
          }}>
          <Text
            style={{
              fontWeight: '700',
              color: Colors.white,
              fontSize: 16,
              textAlign: 'center',
            }}>
            Submit Now
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 12,
    backgroundColor: Colors.black,
    flex: 1,
  },
  crossIcon: {
    position: 'absolute',
    top: 20,
    right: 20,
    zIndex: 1,
  },
  label: {
    fontSize: 20,
    fontFamily: Fonts.normal,
    marginVertical: 20,
  },
  sliderContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  slider: {
    flex: 1,
  },
  duration: {
    fontSize: 12,
    backgroundColor: Colors.black,
    color: Colors.white,
    width: 25,
    height: 18.92,
    borderRadius: 2.92,
    justifyContent: 'center',
    textAlign: 'center',
    alignSelf: 'center',
    fontFamily: Fonts.normal,
  },
  section: {
    marginBottom: 16,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
  },
  selectionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderWidth: 1,
    borderColor: Colors.gray,
    borderRadius: 8,
    marginBottom: 16,
  },
  selectionText: {
    fontSize: 20,
    paddingLeft: 10,
  },
  notesInput: {
    height: 120,
    borderRadius: 16,
    padding: 12,
    fontSize: 16,
    backgroundColor: Colors.gray,
  },
  section1: {
    marginBottom: 8,
  },
  label1: {
    color: Colors.black,
    fontSize: 20,
    margin: 5,
    fontWeight: '500',
    marginVertical: 15,
  },
  fileButton1: {
    backgroundColor: Colors.gray,
    borderRadius: 5,
    width: wp((145 / 430) * 100),
    height: hp((40 / 919) * 100),
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
    margin: 5,
  },
});

export default RoundScreen;
