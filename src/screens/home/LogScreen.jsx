import React, {useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Image,
  SafeAreaView,
  TextInput,
} from 'react-native';
import {Calendar} from 'react-native-calendars';
import IMAGES from '../../assets/images';
import Colors from '../../theme/color';
import {Fonts} from '../../assets/fonts';
import {hp, wp} from '../../utility/ResponseUI';
import Slider from '@react-native-community/slider';
import {useNavigation} from '@react-navigation/native';
import SVG from '../../assets/svg';

const LogScreen = () => {
  const navigation = useNavigation();
  const [date, setDate] = useState(new Date());
  const [showCalendar, setShowCalendar] = useState(false);
  const [trainingTypes, setTrainingTypes] = useState([
    'No Gi x',
    'Drill x',
    'Sparring x',
  ]);
  const [value, setValue] = useState('');
  const [areasCovered, setAreasCovered] = useState([
    'Fitness x',
    'Zero Figure x',
    'Sleek x',
  ]);
  const [learnings, setLearnings] = useState('');
  const [newArea, setNewArea] = useState('');
  const [newTrainingType, setNewTrainingType] = useState('');
  const [isAddingArea, setIsAddingArea] = useState(false);
  const [isAddingTrainingType, setIsAddingTrainingType] = useState(false);

  const onDayPress = day => {
    setDate(new Date(day.dateString));
    setShowCalendar(false);
  };

  const addNewArea = () => {
    if (newArea.trim()) {
      setAreasCovered([...areasCovered, newArea]);
      setNewArea('');
      setIsAddingArea(false);
    }
  };

  const cancelAddArea = () => {
    setNewArea('');
    setIsAddingArea(false);
  };

  const addNewTrainingType = () => {
    if (newTrainingType.trim()) {
      setTrainingTypes([...trainingTypes, newTrainingType]);
      setNewTrainingType('');
      setIsAddingTrainingType(false);
    }
  };

  const cancelAddTrainingType = () => {
    setNewTrainingType('');
    setIsAddingTrainingType(false);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Image source={IMAGES.ProfilePic} />
          <Text style={styles.headerTitle}>
            Welcome Josh{'\n'}
            <Text style={styles.headerText}>The Next Level Starts Now</Text>
          </Text>
          <View style={styles.iconStyle}>
            <TouchableOpacity>
              <SVG.Bell />
            </TouchableOpacity>
            <TouchableOpacity>
              <SVG.Line />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>Select Date</Text>
          <TouchableOpacity
            onPress={() => setShowCalendar(!showCalendar)}
            style={styles.datePicker}>
            <SVG.VectorCal />
            <Text
              style={{
                fontSize: 16,
                fontFamily: Fonts.normal,
                alignSelf: 'center',
              }}>
              {date.toISOString().split('T')[0]}{' '}
            </Text>
          </TouchableOpacity>

          {showCalendar && (
            <View style={styles.calendarContainer}>
              <Calendar
                markedDates={{
                  [date.toISOString().split('T')[0]]: {
                    selected: true,
                    selectedColor: Colors.red,
                  },
                }}
                theme={{
                  backgroundColor: Colors.white,
                  calendarBackground: Colors.white,
                  textSectionTitleColor: Colors.black,
                  selectedDayBackgroundColor: Colors.red,
                  monthTextColor: Colors.black,
                  selectedDayTextColor: Colors.black,
                  todayTextColor: Colors.black,
                  arrowColor: Colors.black,
                }}
                renderArrow={direction => (
                  <Text
                    style={{
                      backgroundColor: Colors.red,
                      padding: 4,
                      width: 24,
                      borderRadius: 4,
                      left: 20,
                      textAlign: 'center',
                    }}>
                    {direction === 'left' ? <SVG.LeftCal /> : <SVG.RightCal />}
                  </Text>
                )}
                onDayPress={onDayPress}
              />
              <SVG.IconCalendar
                style={{
                  position: 'absolute',
                  top: 27,
                  left: 8,
                }}
              />
            </View>
          )}
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>Training Type</Text>
          <View style={styles.chipContainer}>
            {trainingTypes.map((type, index) => (
              <TouchableOpacity key={index} style={styles.chip}>
                <Text style={styles.chipText}>{type}</Text>
              </TouchableOpacity>
            ))}
            <TouchableOpacity
              style={styles.addChipButton}
              onPress={() => setIsAddingTrainingType(true)}>
              <SVG.WhitePlus />
            </TouchableOpacity>
          </View>

          {isAddingTrainingType && (
            <View style={styles.addAreaContainer}>
              <TextInput
                style={styles.inputField}
                placeholder="training type"
                value={newTrainingType}
                onChangeText={setNewTrainingType}
              />
              <View style={styles.addAreaButtons}>
                <TouchableOpacity
                  style={styles.cancelButton}
                  onPress={cancelAddTrainingType}>
                  <Text
                    style={{
                      color: Colors.red,
                      fontSize: 12,
                      textAlign: 'center',
                    }}>
                    Cancel
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.addButton}
                  onPress={addNewTrainingType}>
                  <Text style={styles.buttonText}>Add</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        </View>
        <View style={styles.section}>
          <Text style={styles.label}>
            Duration<Text style={{fontSize: 12}}> (Minutes) </Text>
          </Text>
          <View style={styles.sliderView}>
            <View
              style={[
                styles.valueContainer,
                {left: `${((value - 0) / (60 - 0)) * 320}`},
              ]}>
              <View
                style={{
                  alignItems: 'center',
                  justifyContent: 'center',
                  alignSelf: 'center',
                }}>
                <Text style={styles.valueText}>{value}</Text>
              </View>
            </View>
            <View style={{marginTop: 20}}>
              <Slider
                minimumValue={0}
                maximumValue={60}
                step={1}
                minimumTrackTintColor={Colors.red}
                maximumTrackTintColor={Colors.pink}
                thumbTintColor={Colors.red}
                onValueChange={setValue}
              />
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>Areas Covered</Text>
          <View style={styles.chipContainer}>
            {areasCovered.map((area, index) => (
              <TouchableOpacity key={index} style={styles.chip}>
                <Text style={styles.chipText}>{area}</Text>
              </TouchableOpacity>
            ))}
            <TouchableOpacity
              style={styles.addChipButton}
              onPress={() => setIsAddingArea(true)}>
              <SVG.WhitePlus />
            </TouchableOpacity>
          </View>

          {isAddingArea && (
            <View style={styles.addAreaContainer}>
              <TextInput
                style={styles.inputField}
                placeholder="training type"
                value={newArea}
                onChangeText={setNewArea}
              />
              <View style={styles.addAreaButtons}>
                <TouchableOpacity
                  style={styles.cancelButton}
                  onPress={cancelAddArea}>
                  <Text
                    style={{
                      color: Colors.red,
                      fontSize: 12,
                      textAlign: 'center',
                    }}>
                    Cancel
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.addButton} onPress={addNewArea}>
                  <Text style={styles.buttonText}>Add</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>Sparring Rounds</Text>
        </View>
        <View
          style={{
            backgroundColor: Colors.darkGray,
            height: 25,
            justifyContent: 'center',
            borderRadius: 4,
            marginBottom: 6,
          }}>
          <Text
            style={{
              textAlign: 'center',
              fontSize: 12,
              fontWeight: 'bold',
              color: Colors.white,
            }}>
            ROUND 1
          </Text>
        </View>
        <View
          style={{
            flex: 1,
            flexDirection: 'row',
          }}>
          <View style={{flex: 1, marginBottom: 20}}>
            <Text style={styles.roundLabel}>Durations</Text>
            <Text style={styles.roundLabel}>Partner</Text>
            <Text style={styles.roundLabel}>Submissions Achieved</Text>
            <Text style={styles.roundLabel}>Submissions Conceded</Text>
            <Text style={styles.roundLabel}>Positions Achieved</Text>
            <Text style={styles.roundLabel}>Positions Conceded</Text>
            <Text style={styles.roundLabel}>Notes</Text>
            <Text style={styles.roundLabel1}>Files Attrached</Text>
          </View>
          <View style={{flex: 2}}>
            <Text style={styles.roundLabel}>15 Minutes</Text>
            <Text style={styles.roundLabel}>Watson</Text>
            <Text style={styles.roundLabel}>
              Guillotine, Americana, RNC, Kimura
            </Text>
            <Text style={styles.roundLabel}>
              Guillotine 2, Americana 1, RNC 1, Kimura 1
            </Text>
            <Text style={styles.roundLabel}>Back, Mount, Side, Control</Text>
            <Text style={styles.roundLabel}>
              Back 2, Mount 1, Side 1, Control 1
            </Text>
            <Text style={styles.roundLabel}>
              It is a long established fact that a reader will be more...
            </Text>
            <Text style={styles.roundLabel1}>Yes</Text>
          </View>
        </View>

        <View
          style={{
            backgroundColor: Colors.darkGray,
            height: 25,
            justifyContent: 'center',
            borderRadius: 4,
            marginBottom: 6,
          }}>
          <Text
            style={{
              textAlign: 'center',
              fontSize: 12,
              fontWeight: 'bold',
              color: Colors.white,
            }}>
            ROUND 2
          </Text>
        </View>

        <View
          style={{
            flex: 1,
            flexDirection: 'row',
          }}>
          <View style={{flex: 1, marginBottom: 20}}>
            <Text style={styles.roundLabel}>Durations</Text>
            <Text style={styles.roundLabel}>Partner</Text>
            <Text style={styles.roundLabel}>Submissions Achieved</Text>
            <Text style={styles.roundLabel}>Submissions Conceded</Text>
            <Text style={styles.roundLabel}>Positions Achieved</Text>
            <Text style={styles.roundLabel}>Positions Conceded</Text>
            <Text style={styles.roundLabel}>Notes</Text>
            <Text style={styles.roundLabel1}>Files Attrached</Text>
          </View>
          <View style={{flex: 2}}>
            <Text style={styles.roundLabel}>15 Minutes</Text>
            <Text style={styles.roundLabel}>Watson</Text>
            <Text style={styles.roundLabel}>
              Guillotine, Americana, RNC, Kimura
            </Text>
            <Text style={styles.roundLabel}>
              Guillotine 2, Americana 1, RNC 1, Kimura 1
            </Text>
            <Text style={styles.roundLabel}>Back, Mount, Side, Control</Text>
            <Text style={styles.roundLabel}>
              Back 2, Mount 1, Side 1, Control 1
            </Text>
            <Text style={styles.roundLabel}>
              It is a long established fact that a reader will be more...
            </Text>
            <Text style={styles.roundLabel1}>Yes</Text>
          </View>
        </View>

        <TouchableOpacity
          style={styles.addRoundButton}
          onPress={() => navigation.navigate('RoundScreen')}>
          <SVG.PinkPlus />
        </TouchableOpacity>

        <View style={styles.section}>
          <Text style={styles.label}>Learnings</Text>
          <TextInput
            style={[
              styles.textArea,
              {textAlignVertical: 'top', paddingTop: 15},
            ]}
            multiline
            placeholder="Share Learnings....."
            value={learnings}
            placeholderTextColor={Colors.gray}
            onChangeText={text => setLearnings(text)}
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>Attach Files</Text>
          <TouchableOpacity style={styles.fileButton}>
            <SVG.PaperClip />
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
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.black,
  },
  scrollContent: {
    padding: 10,
  },
  header: {
    marginBottom: 20,
    flexDirection: 'row',
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.white,
    alignSelf: 'center',
    marginStart: 8,
  },
  headerText: {
    fontSize: 12,
    color: Colors.gray,
    fontFamily: Fonts.medium,
  },
  iconStyle: {
    flexDirection: 'row',
    position: 'absolute',
    right: 10,
    gap: 15,
    alignSelf: 'center',
  },
  section: {
    marginBottom: 8,
  },
  label: {
    color: Colors.white,
    fontSize: 20,
    marginBottom: 5,
    fontFamily: Fonts.normal,
  },
  datePicker: {
    backgroundColor: Colors.white,
    padding: 10,
    borderRadius: 5,
    flexDirection: 'row',
    gap: 5,
  },
  calendarContainer: {
    marginTop: 10,
    backgroundColor: Colors.white,
    borderRadius: 10,
    padding: 10,
  },
  chipContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
  },
  chip: {
    backgroundColor: Colors.red,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
    marginRight: 10,
    marginBottom: 10,
    justifyContent: 'center',
  },
  chipText: {
    color: Colors.white,
    fontSize: 16,
    fontFamily: Fonts.normal,
  },
  addChipButton: {
    paddingVertical: 5,
    borderRadius: 15,
  },
  addAreaContainer: {
    marginTop: 10,
    padding: 10,
    backgroundColor: Colors.white,
    borderRadius: 8,
    margin: 15,
  },
  inputField: {
    height: 40,
    borderColor: Colors.litegray,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    marginBottom: 10,
  },

  addAreaButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  cancelButton: {
    padding: 6,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: Colors.red,
    left: 215,
    height: 31,
    width: 69,
  },
  addButton: {
    backgroundColor: Colors.black,
    padding: 8,
    borderRadius: 8,
    height: 31,
    width: 54,
  },
  buttonText: {
    color: Colors.white,
    fontSize: 12,
    textAlign: 'center',
  },
  roundCard: {
    backgroundColor: Colors.black,
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
  },
  roundHeader: {
    color: Colors.white,
    fontWeight: 'bold',
    marginBottom: 5,
    backgroundColor: Colors.darkGray,
    textAlign: 'center',
  },
  springText: {
    color: Colors.white,
  },
  addRoundButton: {
    marginLeft: 5,
    marginBottom: 15,
  },
  textArea: {
    backgroundColor: Colors.white,
    borderRadius: 16,
    width: wp((399 / 430) * 100),
    height: hp((198 / 919) * 100),
    alignSelf: 'center',
    padding: 20,
  },
  fileButton: {
    backgroundColor: Colors.gray,
    borderRadius: 5,
    width: wp((145 / 430) * 100),
    height: hp((40 / 919) * 100),
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
  },
  sliderView: {
    borderRadius: 15,
    padding: 14,
  },
  valueContainer: {
    position: 'absolute',
    paddingHorizontal: 15,
    margin: 10,
  },
  valueText: {
    fontSize: 12,
    backgroundColor: Colors.pink,
    paddingHorizontal: 6,
    borderRadius: 3,
  },
  roundLabel: {
    color: Colors.white,
    fontSize: 10,
    borderBottomWidth: 0.5,
    borderBottomColor: Colors.litegray,
    paddingVertical: 5,
  },
  roundLabel1: {
    color: Colors.white,
    fontSize: 10,
    paddingVertical: 5,
  },
});

export default LogScreen;
