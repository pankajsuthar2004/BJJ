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
  Modal,
  TouchableWithoutFeedback,
  Animated,
  FlatList,
} from 'react-native';
import {Calendar} from 'react-native-calendars';
import IMAGES from '../../assets/images';
import Colors from '../../theme/color';
import {Fonts} from '../../assets/fonts';
import {Appearance} from 'react-native';
import {hp, wp} from '../../utility/ResponseUI';
import Slider from '@react-native-community/slider';
import {useNavigation} from '@react-navigation/native';
import SVG from '../../assets/svg';

const trainingTypes = [
  'Gi',
  'No Gi',
  'Beginners 12am kids',
  'Advanced gi Class 9am',
];

const LogScreen = () => {
  const navigation = useNavigation();
  const [date, setDate] = useState(new Date());
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const [selectedType, setSelectedType] = useState('Training Type');
  const [selectedAreas, setSelectedAreas] = useState([]);
  const [showCalendar, setShowCalendar] = useState(false);
  const [isDrawerVisible, setIsDrawerVisible] = useState(false);
  const [value, setValue] = useState('');

  const [learnings, setLearnings] = useState('');

  const isDarkMode = Appearance.getColorScheme() === 'dark';
  const placeholderColor = isDarkMode ? Colors.white : Colors.gray;

  const areas = ['Fitness', 'Belly Training', 'Knee', 'Love Handles'];

  const toggleSelection = area => {
    setSelectedAreas(prev =>
      prev.includes(area)
        ? prev.filter(item => item !== area)
        : [...prev, area],
    );
  };

  const onDayPress = day => {
    setDate(new Date(day.dateString));
    setShowCalendar(false);
  };

  const handleSelect = type => {
    setSelectedType(type);
    setDropdownOpen(false);
  };

  const handleLogOut = () => {
    navigation.reset({
      index: 0,
      routes: [{name: 'AuthStack', params: {screen: 'LoginScreen'}}],
    });
  };
  const toggleDrawer = () => {
    setIsDrawerVisible(!isDrawerVisible);
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
            <TouchableOpacity onPress={toggleDrawer}>
              <SVG.Line />
            </TouchableOpacity>
          </View>
        </View>

        <Modal
          visible={isDrawerVisible}
          transparent={true}
          animationType="fade"
          onRequestClose={toggleDrawer}>
          <TouchableWithoutFeedback onPress={toggleDrawer}>
            <Animated.View style={styles.drawerOverlay}></Animated.View>
          </TouchableWithoutFeedback>

          <View style={styles.drawer}>
            <TouchableOpacity onPress={toggleDrawer} style={styles.closeButton}>
              <SVG.CrossIcon />
            </TouchableOpacity>

            <TouchableOpacity style={styles.drawerItem} onPress={handleLogOut}>
              <SVG.LogOutIcon
                style={{backgroundColor: Colors.black, borderRadius: 5}}
              />
              <Text style={styles.drawerText}>Log Out</Text>
            </TouchableOpacity>
          </View>
        </Modal>

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

          <Modal
            animationType="fade"
            transparent={true}
            visible={showCalendar}
            onRequestClose={() => setShowCalendar(false)}>
            <View style={styles.modalBackground}>
              <View style={styles.modalContainer}>
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
                  }}
                  renderArrow={direction => (
                    <Text
                      style={{
                        left: 20,
                        textAlign: 'center',
                      }}>
                      {direction === 'left' ? (
                        <SVG.RedLeft />
                      ) : (
                        <SVG.RedRight />
                      )}
                    </Text>
                  )}
                  onDayPress={onDayPress}
                />
                <SVG.IconCalendar
                  style={{
                    position: 'absolute',
                    top: 38,
                    left: 10,
                  }}
                />
              </View>
            </View>
          </Modal>
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>Training Type</Text>
          <TouchableOpacity
            style={styles.dropdown}
            onPress={() => setDropdownOpen(!isDropdownOpen)}>
            <Text style={styles.dropdownText}>{selectedType}</Text>
            {isDropdownOpen ? <SVG.SmallArrow /> : <SVG.SmallRight />}
          </TouchableOpacity>
          {isDropdownOpen && (
            <View style={styles.dropdownList}>
              <FlatList
                data={trainingTypes}
                keyExtractor={item => item}
                renderItem={({item}) => (
                  <TouchableOpacity
                    style={styles.dropdownItem}
                    onPress={() => handleSelect(item)}>
                    <Text style={styles.itemText}>{item}</Text>
                  </TouchableOpacity>
                )}
              />
            </View>
          )}
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>
            Duration<Text style={{fontSize: 12}}> (Minutes)</Text>
          </Text>
          <View style={styles.sliderView}>
            <View
              style={[
                styles.valueContainer,
                {
                  left: wp(((value - 0) / (53.5 - 0)) * 70),
                },
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
          <View style={{backgroundColor: Colors.white, borderRadius: 8}}>
            <View style={styles.dropdown}>
              <Text style={styles.dropdownLabel1}>Areas Covered</Text>
              <SVG.SmallArrow />
            </View>
            {areas.map(area => (
              <TouchableOpacity
                key={area}
                style={styles.item1}
                onPress={() => toggleSelection(area)}>
                <Text style={styles.itemText1}>{area}</Text>
                {selectedAreas.includes(area) ? (
                  <SVG.FilterTicks />
                ) : (
                  <SVG.EmptyTick />
                )}
              </TouchableOpacity>
            ))}
          </View>
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
            flexDirection: 'row',
          }}>
          <View style={{flex: 0.9, marginBottom: 20}}>
            <Text style={styles.roundLabel}>Durations</Text>
            <Text style={styles.roundLabel}>Partner</Text>
            <Text style={styles.roundLabel}>Submissions Achieved</Text>
            <Text style={styles.roundLabel}>Submissions Conceded</Text>
            <Text style={styles.roundLabel}>Positions Achieved</Text>
            <Text style={styles.roundLabel}>Positions Conceded</Text>
            <Text style={styles.roundLabel2}>Notes</Text>
            <Text style={styles.roundLabel1}>Files Attached</Text>
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
            <Text style={styles.roundLabel2}>
              It is a long established fact that a reader will be more..
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
            flexDirection: 'row',
          }}>
          <View style={{flex: 0.9, marginBottom: 20}}>
            <Text style={styles.roundLabel}>Durations</Text>
            <Text style={styles.roundLabel}>Partner</Text>
            <Text style={styles.roundLabel}>Submissions Achieved</Text>
            <Text style={styles.roundLabel}>Submissions Conceded</Text>
            <Text style={styles.roundLabel}>Positions Achieved</Text>
            <Text style={styles.roundLabel}>Positions Conceded</Text>
            <Text style={styles.roundLabel2}>Notes</Text>
            <Text style={styles.roundLabel1}>Files Attached</Text>
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
            <Text style={styles.roundLabel2}>
              It is a long established fact that a reader will be more..
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
              {
                textAlignVertical: 'top',
                paddingTop: 15,
              },
            ]}
            multiline
            placeholder="Share Learnings....."
            value={learnings}
            placeholderTextColor={placeholderColor}
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
  modalBackground: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(10, 8, 8, 0.9)',
  },
  modalContainer: {
    backgroundColor: Colors.white,
    borderRadius: 16,
    padding: 20,
    width: wp((400 / 430) * 100),
    height: hp((410 / 919) * 100),
  },
  buttonText: {
    color: Colors.white,
    textAlign: 'center',
    fontSize: 16,
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
    flexDirection: 'row',
    gap: 8,
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
    marginRight: 15,
  },
  inputField: {
    borderWidth: 1,
    borderColor: Colors.gray,
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
  },
  addAreaButtons: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 8,
    gap: 8,
  },
  cancelButton: {
    justifyContent: 'center',
    borderRadius: 5,
    borderWidth: 1,
    borderColor: Colors.red,
    width: wp((69 / 430) * 100),
    height: hp((31 / 919) * 100),
  },
  addButton: {
    backgroundColor: Colors.black,
    borderRadius: 8,
    width: wp((54 / 430) * 100),
    height: hp((31 / 919) * 100),
    justifyContent: 'center',
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
    marginBottom: 15,
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
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
    fontSize: 9.6,
    borderBottomWidth: 0.5,
    borderBottomColor: Colors.litegray,
    paddingVertical: 5,
  },
  roundLabel1: {
    color: Colors.white,
    fontSize: 9.6,
    paddingVertical: 5,
  },
  roundLabel2: {
    color: Colors.white,
    fontSize: 9.6,
    paddingVertical: 5,
    borderBottomWidth: 0.5,
    borderBottomColor: Colors.litegray,
  },
  drawerOverlay: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.85)',
  },
  closeButton: {
    position: 'absolute',
    top: 10,
    right: 10,
  },
  drawerItem: {
    flexDirection: 'row',
    marginTop: 40,
  },
  drawerText: {
    fontSize: 18,
    fontFamily: Fonts.normal,
    marginLeft: 10,
    top: -2,
  },
  drawer: {
    position: 'absolute',
    top: 0,
    right: 0,
    backgroundColor: Colors.white,
    borderRadius: 20,
    width: wp((250 / 430) * 100),
    height: hp((200 / 919) * 100),
    padding: 20,
  },
  dropdown: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
    borderWidth: 1,
    borderRadius: 8,
    backgroundColor: 'white',
  },
  dropdownText: {
    fontSize: 16,
  },
  dropdownList: {
    marginTop: 4,
    backgroundColor: 'white',
    borderRadius: 8,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  dropdownItem: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  itemText: {
    fontSize: 16,
  },
  dropdown: {
    backgroundColor: 'white',
    padding: 12,
    borderRadius: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dropdownLabel1: {fontSize: 16, fontWeight: 'bold'},
  item1: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 12,
    borderBottomWidth: 1,
    borderColor: Colors.litegray,
  },
  itemText1: {fontSize: 16, color: Colors.black},
});

export default LogScreen;
