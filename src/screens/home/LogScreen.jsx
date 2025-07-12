import React, {useEffect, useState} from 'react';
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
import CustomButton from '../../components/CustomButton';
import makeRequest from '../../api/http';
import {EndPoints} from '../../api/config';
import {showToast} from '../../utility/Toast';
import {launchImageLibrary} from 'react-native-image-picker';
import {useAppDispatch, useAppSelector} from '../../store/Hooks';
import AppLoader from '../../components/AppLoader';

const trainingTypes = [
  {id: 1, name: 'Gi'},
  {id: 2, name: 'No Gi'},
  {id: 3, name: 'Beginners 12am kids'},
  {id: 4, name: 'Advanced gi Class 9am'},
];

const LogScreen = () => {
  const a = useAppSelector(b => b.user);
  const navigation = useNavigation();
  const [date, setDate] = useState(new Date());
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const [selectedType, setSelectedType] = useState(null);
  const [selectedAreas, setSelectedAreas] = useState();
  const [isAreasDropdownOpen, setAreasDropdownOpen] = useState(false);
  const [showCalendar, setShowCalendar] = useState(false);
  const [isDrawerVisible, setIsDrawerVisible] = useState(false);
  const [value, setValue] = useState(0);
  const [learnings, setLearnings] = useState('');
  const [gymAreas, setGymAreas] = useState([]);
  const [selectedImages, setSelectedImages] = useState([]);
  const [rounds, setRounds] = useState([]);
  const [isRoundModalVisible, setRoundModalVisible] = useState(false);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(false);
  const dispatch = useAppDispatch();
  const user = useAppSelector(state => state.user?.user);
  const gymId = user?.gym?.id;

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await makeRequest({
          endPoint: EndPoints.GetProfile,
          method: 'GET',
        });
        setUserData(response);
      } catch (error) {
        showToast({message: error.message, type: 'error'});
      } finally {
        setLoading(false);
      }
    };
    fetchData();
    fetchData2();
  }, []);

  const fetchData2 = async () => {
    try {
      const response = await makeRequest({
        endPoint: EndPoints.GetGym,
        method: 'GET',
      });
      dispatch(setUser({...user?.user, gym: response[0]}));
    } catch (error) {
    } finally {
    }
  };

  const isDarkMode = Appearance.getColorScheme() === 'dark';
  const placeholderColor = isDarkMode ? Colors.white : Colors.gray;

  useEffect(() => {
    fetchGymAreas();
  }, []);

  const openImagePicker = () => {
    launchImageLibrary({mediaType: 'photo', quality: 1}, response => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.errorCode) {
        console.log('ImagePicker Error: ', response.errorMessage);
      } else {
        console.log('Image Picker Response:', response);

        const selectedFiles = response.assets.map(asset => ({
          uri: asset.uri,
          name: asset.fileName,
          type: asset.type,
        }));

        setSelectedImages(prevImages => [...prevImages, ...selectedFiles]);
      }
    });
  };

  const onSubmit = async () => {
    if (!value || value <= 0) {
      showToast({
        message: 'Please select a valid session duration.',
        type: 'error',
      });
      return;
    }

    const formData = new FormData();
    formData.append('gym_id', gymId);
    formData.append('date', date.toISOString().split('T')[0]);

    if (selectedType) {
      formData.append('training_type_id', parseInt(selectedType.id));
    }

    formData.append('duration', value.toString());

    if (selectedAreas !== undefined && selectedAreas !== null) {
      formData.append('gym_area_id', selectedAreas);
    }

    formData.append('learnings', learnings || '');

    rounds.forEach((round, roundIndex) => {
      formData.append(
        `rounds[${roundIndex}][duration]`,
        String(round.duration),
      );
      formData.append(`rounds[${roundIndex}][notes]`, round.notes);

      // round.sparringPartners.forEach((partnerId, partnerIndex) => {
      //   formData.append(
      //     `rounds[${roundIndex}][sparring_partners][${partnerIndex}]`,
      //     String(partnerId),
      //   );
      // });

      let submissionIndex = 0;
      round.submissionsAchieved
        .filter(item => item.count > 0)
        .forEach(item => {
          formData.append(
            `rounds[${roundIndex}][submissions][${submissionIndex}][training_option_id]`,
            String(item.id),
          );
          formData.append(
            `rounds[${roundIndex}][submissions][${submissionIndex}][type]`,
            'achieved',
          );
          formData.append(
            `rounds[${roundIndex}][submissions][${submissionIndex}][quantity]`,
            String(item.count),
          );
          submissionIndex++;
        });
      round.submissionsConceded
        .filter(item => item.count > 0)
        .forEach(item => {
          formData.append(
            `rounds[${roundIndex}][submissions][${submissionIndex}][training_option_id]`,
            String(item.id),
          );
          formData.append(
            `rounds[${roundIndex}][submissions][${submissionIndex}][type]`,
            'conceded',
          );
          formData.append(
            `rounds[${roundIndex}][submissions][${submissionIndex}][quantity]`,
            String(item.count),
          );
          submissionIndex++;
        });

      let positionIndex = 0;
      round.positionsAchieved
        .filter(item => item.count > 0)
        .forEach(item => {
          formData.append(
            `rounds[${roundIndex}][positions][${positionIndex}][training_option_id]`,
            String(item.id),
          );
          formData.append(
            `rounds[${roundIndex}][positions][${positionIndex}][type]`,
            'achieved',
          );
          formData.append(
            `rounds[${roundIndex}][positions][${positionIndex}][quantity]`,
            String(item.count),
          );
          positionIndex++;
        });
      round.positionsConceded
        .filter(item => item.count > 0)
        .forEach(item => {
          formData.append(
            `rounds[${roundIndex}][positions][${positionIndex}][training_option_id]`,
            String(item.id),
          );
          formData.append(
            `rounds[${roundIndex}][positions][${positionIndex}][type]`,
            'conceded',
          );
          formData.append(
            `rounds[${roundIndex}][positions][${positionIndex}][quantity]`,
            String(item.count),
          );
          positionIndex++;
        });

      round.files?.forEach((file, fileIndex) => {
        formData.append(`rounds[${roundIndex}][files][${fileIndex}]`, {
          uri: file.uri,
          name: file.name,
          type: file.type,
        });
      });
    });

    selectedImages.forEach((file, index) => {
      formData.append(`training_files[]`, file);
    });

    try {
      const response = await makeRequest({
        endPoint: EndPoints.TrainingLog,
        method: 'POST',
        body: formData,
        headers: {'Content-Type': 'multipart/form-data'},
      });

      if (response) {
        showToast({
          message: 'Training log created successfully!',
          type: 'success',
        });
        navigation.goBack();
      } else {
        throw new Error('Failed to upload training log');
      }
    } catch (error) {
      console.error('Error:', error);
      // showToast('Error', error.message);
    }
  };

  const handleSubmitRound = async data => {
    console.log('data', data);
    setRounds([data, ...rounds]);
    setRoundModalVisible(false);
    return;
    const formData = new FormData();

    formData.append('gym_id', gymId);
    formData.append('date', date);
    formData.append('training_type_id', selectedType);
    formData.append('duration', value.toString());
    formData.append('gym_area_id', JSON.stringify(selectedAreas));
    formData.append('learnings', learnings);
    formData.append('rounds[0][duration]', value);

    trainingFiles.forEach((file, index) => {
      formData.append('training_files[]', {
        uri: file.uri,
        name: file.name,
        type: file.type,
      });
    });

    try {
      const res = await makeRequest(EndPoints.TrainingLog, 'POST', formData, {
        'Content-Type': 'multipart/form-data',
      });
      showToast('Training submitted successfully');
    } catch (error) {
      showToast('Submission failed');
    }
  };

  const fetchGymAreas = async () => {
    try {
      const data = await makeRequest({
        endPoint: EndPoints.GetGymArea,
        method: 'GET',
      });
      setGymAreas(data || []);
    } catch (error) {
      console.error('Error fetching gym areas:', error);
      showToast({message: 'There was a problem loading Gym Area.'});
    }
  };

  const toggleSelection = area => {
    setSelectedAreas(area);
  };

  const onDayPress = day => {
    setDate(new Date(day.dateString));
    setShowCalendar(false);
  };

  const handleSelect = type => {
    setSelectedType(type);
    setDropdownOpen(false);
  };

  const handleDeleteImage = index => {
    const newImages = [...selectedImages];
    newImages.splice(index, 1);
    setSelectedImages(newImages);
  };

  const toggleDrawer = () => {
    setIsDrawerVisible(!isDrawerVisible);
  };
  const navigateToScreen = screen => {
    navigation.navigate(screen);
    toggleDrawer();
  };

  const onPressHandler = async () => {
    if (a?.user?.gym?.status == 0) {
      showToast({message: 'Gym not approved by admin', type: 'error'});
    } else if (a?.user?.gym) {
      navigateToScreen('DashBoardScreen');
    } else {
      navigateToScreen('Gym Profile');
    }
  };

  const getFullImageUri = () => {
    if (!userData?.image) return null;
    return userData.image.startsWith('http')
      ? userData.image
      : `https://bjj.beepr.us/${userData.image}`;
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {loading && <AppLoader loading={loading} />}
        <View style={styles.header}>
          <TouchableOpacity>
            <Image
              source={
                getFullImageUri() ? {uri: getFullImageUri()} : IMAGES.BigProfile
              }
              style={{height: hp(5), width: hp(5), borderRadius: hp(6)}}
            />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>
            {`Welcome ${userData?.name}\n`}
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
              <SVG.IconCross />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.drawerItem}
              onPress={() => navigateToScreen('HomeScreen')}>
              <SVG.HomeIcon />
              <Text style={styles.drawerText}>Home</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.drawerItem}
              onPress={() => navigateToScreen('Training History')}>
              <SVG.History />
              <Text style={styles.drawerText}>Log History</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.drawerItem}
              onPress={() => navigateToScreen('LogScreen')}>
              <SVG.Entry />
              <Text style={styles.drawerText}>Add Entry</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.drawerItem}
              onPress={() => navigateToScreen('Feed')}>
              <SVG.Feed />
              <Text style={styles.drawerText}>Feed</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.drawerItem}
              onPress={() => navigateToScreen('Profile')}>
              <SVG.IconProfile />
              <Text style={styles.drawerText}>Profile</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.drawerItem}
              onPress={() => navigateToScreen('Attendance View')}>
              <SVG.IconProfile />
              <Text style={styles.drawerText}>Pupil Attendance</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.drawerItem}
              onPress={() => navigateToScreen('billing')}>
              <SVG.IconProfile />
              <Text style={styles.drawerText}>Billing/subscription</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.drawerItem}
              onPress={onPressHandler}>
              <SVG.IconProfile />
              <Text style={styles.drawerText}>
                {a?.user?.gym ? 'Switch to Gym Profile' : 'Become Gym Owner'}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.drawerItem}
              onPress={() => navigateToScreen('Settings')}>
              <SVG.Setting />
              <Text style={styles.drawerText}>Settings</Text>
            </TouchableOpacity>
          </View>
        </Modal>
        <View style={styles.section}>
          <Text style={styles.label}>Select Date</Text>
          <TouchableOpacity
            onPress={() => setShowCalendar(!showCalendar)}
            style={styles.datePicker}>
            <SVG.VectorCal />
            <Text style={styles.dateText}>
              {date.toISOString().split('T')[0]}{' '}
            </Text>

            <View style={{justifyContent: 'center'}}>
              <SVG.VectorArr />
            </View>
          </TouchableOpacity>

          <Modal
            animationType="fade"
            transparent={true}
            visible={showCalendar}
            onRequestClose={() => setShowCalendar(false)}>
            <TouchableWithoutFeedback onPress={() => setShowCalendar(false)}>
              <View style={styles.modalBackground}>
                <TouchableWithoutFeedback>
                  <View style={styles.modalContainer}>
                    <Calendar
                      markedDates={{
                        [date.toISOString().split('T')[0]]: {
                          selected: true,
                          selectedColor: Colors.red,
                          selectedTextColor: Colors.white,
                        },
                      }}
                      theme={{
                        backgroundColor: Colors.white,
                        calendarBackground: Colors.white,
                        textSectionTitleColor: Colors.black,
                        selectedDayBackgroundColor: Colors.red,
                        monthTextColor: Colors.black,
                        selectedDayTextColor: Colors.white,
                        todayTextColor: Colors.black,
                      }}
                      renderArrow={direction => (
                        <Text
                          style={{
                            position: 'absolute',
                            right: direction === 'left' ? -250 : 1,
                          }}>
                          {direction === 'left' ? (
                            <SVG.LeftFill />
                          ) : (
                            <SVG.RightFill />
                          )}
                        </Text>
                      )}
                      onDayPress={onDayPress}
                    />
                    <SVG.IconCalendar
                      style={{
                        position: 'absolute',
                        top: 15,
                        left: 10,
                      }}
                    />
                  </View>
                </TouchableWithoutFeedback>
              </View>
            </TouchableWithoutFeedback>
          </Modal>
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>Training Type</Text>
          <TouchableOpacity
            style={[
              styles.dropdown11,
              isDropdownOpen && {
                borderTopLeftRadius: 8,
                borderTopRightRadius: 8,
                borderBottomLeftRadius: 0,
                borderBottomRightRadius: 0,
              },
            ]}
            onPress={() => setDropdownOpen(!isDropdownOpen)}>
            <Text style={styles.dropdownText}>
              {selectedType?.name || 'Select Training Type'}
            </Text>{' '}
            {isDropdownOpen ? <SVG.SmallArrow /> : <SVG.SmallRight />}
          </TouchableOpacity>
          {isDropdownOpen && (
            <View style={styles.dropdownList}>
              <FlatList
                data={trainingTypes}
                keyExtractor={item => item.id.toString()}
                renderItem={({item, index}) => (
                  <TouchableOpacity
                    style={[
                      styles.dropdownItem,
                      index !== trainingTypes.length - 1 && styles.border,
                    ]}
                    onPress={() => handleSelect(item)}>
                    <Text style={styles.itemText}>{item.name}</Text>
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
          <TouchableOpacity
            style={[
              styles.dropdown11,
              isAreasDropdownOpen && {
                borderTopLeftRadius: 8,
                borderTopRightRadius: 8,
                borderBottomLeftRadius: 0,
                borderBottomRightRadius: 0,
              },
            ]}
            onPress={() => setAreasDropdownOpen(!isAreasDropdownOpen)}>
            <Text style={styles.dropdownText}>Areas Covered</Text>
            {isAreasDropdownOpen ? <SVG.SmallArrow /> : <SVG.SmallRight />}
          </TouchableOpacity>
          {isAreasDropdownOpen && (
            <View
              style={{
                backgroundColor: Colors.white,
                borderBottomLeftRadius: 8,
                borderBottomRightRadius: 8,
              }}>
              <FlatList
                data={gymAreas}
                keyExtractor={item => item?.id.toString()}
                renderItem={({item, index}) => (
                  <TouchableOpacity
                    style={[
                      styles.item1,
                      index !== gymAreas.length - 1 && styles.border,
                    ]}
                    onPress={() => toggleSelection(item?.id)}>
                    <Text style={styles.itemText1}>{item?.name}</Text>
                    {selectedAreas == item?.id ? (
                      <SVG.FilterTicks />
                    ) : (
                      <SVG.EmptyTick />
                    )}
                  </TouchableOpacity>
                )}
              />
            </View>
          )}
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>Sparring Rounds</Text>
        </View>
        {rounds?.map((item, index) => {
          return (
            <View key={index}>
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
                  ROUND {index + 1}
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
                  <Text style={styles.roundLabel}>
                    {item?.duration} Minutes
                  </Text>
                  <Text style={styles.roundLabel}>
                    {item?.sparring_Partners}
                  </Text>
                  <Text style={styles.roundLabel}>
                    {item?.submissionsAchieved.map(sub => sub?.name).join(', ')}
                  </Text>
                  <Text style={styles.roundLabel}>
                    {item?.submissionsConceded
                      .map(sub => `${sub?.name} ${sub?.count}`)
                      .join(', ')}
                  </Text>
                  <Text style={styles.roundLabel}>
                    {item?.positionsAchieved.map(sub => sub?.name).join(', ')}
                  </Text>
                  <Text style={styles.roundLabel}>
                    {item?.positionsConceded
                      .map(sub => `${sub?.name} ${sub?.count}`)
                      .join(', ')}
                  </Text>
                  <Text style={styles.roundLabel2}>
                    {item?.notes || 'No notes provided'}
                  </Text>
                  <Text style={styles.roundLabel1}>
                    {item?.files?.length > 0 ? 'Yes' : 'No'}
                  </Text>
                </View>
              </View>
            </View>
          );
        })}

        <CustomButton
          title="Add New Round"
          onPress={() => setRoundModalVisible(true)}
          style={{marginTop: 10}}
        />
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
          <View style={{flexDirection: 'row', gap: 8}}>
            <TouchableOpacity onPress={openImagePicker}>
              <SVG.AttachFiles />
            </TouchableOpacity>
            {selectedImages.length > 0 && (
              <ScrollView horizontal>
                {selectedImages.map((image, index) => (
                  <View key={index} style={{marginRight: 10}}>
                    <Image
                      source={{uri: image.uri}}
                      style={{width: 68, height: 68, borderRadius: 8}}
                    />
                    <TouchableOpacity
                      onPress={() => handleDeleteImage(index)}
                      style={{position: 'absolute', right: 25, top: 25}}>
                      <SVG.DeletePic />
                    </TouchableOpacity>
                  </View>
                ))}
              </ScrollView>
            )}
          </View>
        </View>
        <CustomButton title="Submit Now" onPress={onSubmit} />
      </ScrollView>

      <RoundScreen
        visible={isRoundModalVisible}
        onClose={() => setRoundModalVisible(false)}
        onSubmitRound={handleSubmitRound}
      />
    </SafeAreaView>
  );
};

const RoundScreen = ({visible, onClose, onSubmitRound}) => {
  const [notes, setNotes] = useState('');
  const [value, setValue] = useState(0);
  const [listVisible, setListVisible] = useState('');
  const [selectedType, setSelectedType] = useState('');
  const [itemCounts, setItemCounts] = useState({});
  const [showSparringInput, setShowSparringInput] = useState(false);
  const [sparringPartner, setSparringPartner] = useState('');
  const [sparringPartnersList, setSparringPartnersList] = useState([]);
  const [selectedImages, setSelectedImages] = useState([]);
  const [options, setOptions] = useState({
    'Submissions Achieved': [],
    'Submissions Conceded': [],
    'Positions Achieved': [],
    'Positions Conceded': [],
  });
  const [partnerList, setPartnerList] = useState([]);
  const [selectedPartnerIds, setSelectedPartnerIds] = useState([]);
  const [isPartnerDropdownVisible, setPartnerDropdownVisible] = useState(false);

  useEffect(() => {
    fetchTrainingOptions();
    fetchPartnerList();
  }, []);

  const openImagePicker = () => {
    launchImageLibrary({mediaType: 'photo', quality: 1}, response => {
      if (response.assets) {
        const selectedFiles = response.assets.map(asset => ({
          uri: asset.uri,
          name: asset.fileName,
          type: asset.type,
        }));
        setSelectedImages(prevImages => [...prevImages, ...selectedFiles]);
      }
    });
  };

  const fetchPartnerList = async () => {
    try {
      const res = await makeRequest({
        endPoint: EndPoints.GetPartners,
        method: 'GET',
      });
      if (res) {
        setPartnerList(res);
      }
    } catch (error) {
      showToast({message: 'Failed to fetch partners'});
    }
  };

  const fetchTrainingOptions = async type => {
    try {
      const data = await makeRequest({
        endPoint: `${EndPoints.GetTrainingOptions}?type=${encodeURIComponent(
          type,
        )}`,
        method: 'GET',
      });
      return data;
    } catch (error) {
      showToast({
        message: 'Failed to load training options. Please try again.',
      });
    }
  };

  const incrementCount = item => {
    setItemCounts(prev => ({
      ...prev,
      [item]: (prev[item] || 0) + 1,
    }));
  };

  const decrementCount = item => {
    setItemCounts(prev => ({
      ...prev,
      [item]: Math.max((prev[item] || 0) - 1, 0),
    }));
  };

  const toggleDropdown = async type => {
    setListVisible(prev => (prev === type ? '' : type));
    setSelectedType(type);

    if (listVisible !== type) {
      const trainingOptions = await fetchTrainingOptions(type);
      if (trainingOptions) {
        setOptions(prev => ({
          ...prev,
          [type]: trainingOptions,
        }));
      }
    }
  };

  const handleAddSparringPartner = () => {
    const trimmedPartner = String(sparringPartner).trim();
    if (trimmedPartner.length > 0) {
      setSparringPartnersList(prev => [...prev, trimmedPartner]);
      setSparringPartner('');
      setShowSparringInput(false);
    } else {
      showToast({message: 'Please enter a valid sparring partner name.'});
    }
  };

  const removeSparringPartner = index => {
    setSparringPartnersList(prev => prev.filter((_, i) => i !== index));
  };

  const handleDeleteImage = index => {
    const newImages = [...selectedImages];
    newImages.splice(index, 1);
    setSelectedImages(newImages);
  };

  const togglePartnerSelection = id => {
    setSelectedPartnerIds(prev =>
      prev.includes(id) ? prev.filter(pid => pid !== id) : [...prev, id],
    );
  };

  return (
    <Modal visible={visible} animationType="slide" onRequestClose={onClose}>
      <View style={styles.container}>
        <TouchableOpacity style={styles.crossIcon} onPress={onClose}>
          <SVG.CrossIcon />
        </TouchableOpacity>

        <ScrollView
          style={styles.scrollView}
          showsVerticalScrollIndicator={false}>
          <View style={styles.section}>
            <Text style={styles.label1}>
              Round Duration<Text style={{fontSize: 12}}> (Minutes)</Text>
            </Text>
            <View style={styles.sliderView}>
              <View
                style={[
                  styles.valueContainer,
                  {left: wp(((value - 0) / (60 - 0)) * 72.5)},
                ]}>
                <View style={styles.valueBox}>
                  <Text style={styles.valueText1}>{value}</Text>
                </View>
              </View>
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

          <Text style={styles.label1}>Sparring Partners</Text>
          <TouchableOpacity
            onPress={() => setPartnerDropdownVisible(!isPartnerDropdownVisible)}
            style={styles.sparringButton}>
            <Text style={{color: Colors.black}}>
              {selectedPartnerIds.length > 0
                ? `${selectedPartnerIds.length} selected`
                : 'Select Partners'}
            </Text>
          </TouchableOpacity>

          {isPartnerDropdownVisible && (
            <View style={styles.partnerListContainer}>
              <FlatList
                data={partnerList}
                keyExtractor={item => item.id.toString()}
                renderItem={({item}) => {
                  const selected = selectedPartnerIds.includes(item.id);
                  return (
                    <TouchableOpacity
                      onPress={() => togglePartnerSelection(item.id)}
                      style={[
                        styles.partnerItem,
                        selected && {backgroundColor: Colors.red},
                      ]}>
                      <Text style={{color: selected ? 'white' : 'black'}}>
                        {item.name}
                      </Text>
                    </TouchableOpacity>
                  );
                }}
              />
            </View>
          )}

          {sparringPartnersList.length > 0 && (
            <FlatList
              data={sparringPartnersList}
              horizontal
              keyExtractor={(_, i) => i.toString()}
              renderItem={({item, index}) => (
                <View
                  style={{
                    flexDirection: 'row',
                    backgroundColor: Colors.red,
                    borderRadius: 20,
                    paddingHorizontal: 12,
                    paddingVertical: 6,
                    marginTop: 10,
                    alignItems: 'center',
                    marginRight: 10,
                    marginBottom: 10,
                  }}>
                  <Text style={{color: Colors.white, marginRight: 8}}>
                    {item}
                  </Text>
                  <TouchableOpacity
                    onPress={() => removeSparringPartner(index)}>
                    <SVG.WhiteCross width={10} height={10} />
                  </TouchableOpacity>
                </View>
              )}
            />
          )}

          {Object.keys(options).map(type => (
            <View key={type}>
              <TouchableOpacity
                style={styles.selectionButton}
                onPress={() => toggleDropdown(type)}>
                <SVG.HugeIcons />
                <Text style={styles.selectionText}>Select {type}</Text>
                <View style={{position: 'absolute', right: 15}}>
                  {listVisible === type ? (
                    <SVG.ArrowIcons />
                  ) : (
                    <SVG.ArrowIcon />
                  )}
                </View>
              </TouchableOpacity>

              {listVisible === type && (
                <View>
                  {options[type].map((item, index) => (
                    <View key={index} style={styles.listOption}>
                      <SVG.ArrowRight />
                      <Text style={styles.listOptionText}>{item.name}</Text>
                      <View style={styles.counterContainer}>
                        <TouchableOpacity
                          onPress={() => decrementCount(item.id)}>
                          <SVG.Delete1 />
                        </TouchableOpacity>
                        <Text style={styles.counterValue}>
                          {itemCounts[item.id] || 0}
                        </Text>
                        <TouchableOpacity
                          onPress={() => incrementCount(item.id)}>
                          <SVG.PlusIcon />
                        </TouchableOpacity>
                      </View>
                    </View>
                  ))}
                </View>
              )}
            </View>
          ))}

          <Text style={styles.label1}>Notes</Text>
          <TextInput
            style={[styles.notesInput, styles.textAreas]}
            placeholder="notes here...."
            placeholderTextColor={Colors.gray}
            multiline
            value={notes}
            onChangeText={setNotes}
          />

          <View style={styles.section}>
            <Text style={styles.label1}>Attach Files</Text>
            <View style={{flexDirection: 'row', gap: 8}}>
              <TouchableOpacity onPress={openImagePicker}>
                <SVG.AttachFiles />
              </TouchableOpacity>
              <ScrollView horizontal>
                {selectedImages.map((image, index) => (
                  <View key={index} style={{marginRight: 10}}>
                    <Image
                      source={{uri: image.uri}}
                      style={{width: 68, height: 68, borderRadius: 8}}
                    />
                    <TouchableOpacity
                      onPress={() => handleDeleteImage(index)}
                      style={{position: 'absolute', right: 25, top: 25}}>
                      <SVG.DeletePic />
                    </TouchableOpacity>
                  </View>
                ))}
              </ScrollView>
            </View>
          </View>

          <TouchableOpacity
            style={styles.submitButton}
            onPress={() => {
              const roundData = {
                duration: value,
                notes,
                sparringPartners: selectedPartnerIds,
                submissionsAchieved: options['Submissions Achieved']
                  .map(i => ({
                    id: i.id,
                    count: itemCounts[i.id] || 0,
                    name: i.name,
                  }))
                  .filter(item => item.count > 0),

                submissionsConceded: options['Submissions Conceded']
                  .map(i => ({
                    id: i.id,
                    count: itemCounts[i.id] || 0,
                    name: i.name,
                  }))
                  .filter(item => item.count > 0),

                positionsAchieved: options['Positions Achieved']
                  .map(i => ({
                    id: i.id,
                    count: itemCounts[i.id] || 0,
                    name: i.name,
                  }))
                  .filter(item => item.count > 0),

                positionsConceded: options['Positions Conceded']
                  .map(i => ({
                    id: i.id,
                    count: itemCounts[i.id] || 0,
                    name: i.name,
                  }))
                  .filter(item => item.count > 0),
                files: selectedImages,
              };
              if (!value || value <= 0) {
                showToast({
                  message: 'Please select a valid round duration.',
                  type: 'error',
                });
                return;
              }

              if (onSubmitRound) {
                onSubmitRound(roundData);
              }
            }}>
            <Text style={styles.submitButtonText}>Submit Now</Text>
          </TouchableOpacity>
        </ScrollView>
      </View>
    </Modal>
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
    borderRadius: 16,
    overflow: 'hidden',
    borderColor: Colors.white,
    width: wp((390 / 430) * 100),
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
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderRadius: 8,
    backgroundColor: Colors.white,
    gap: 10,
  },
  dateText: {
    fontSize: 16,
    fontFamily: Fonts.normal,
    flex: 1,
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
    fontSize: 16,
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
    // marginTop: -13,
  },
  valueText1: {
    fontSize: 12,
    backgroundColor: Colors.black,
    paddingHorizontal: 6,
    borderRadius: 3,
    marginTop: -13,
    color: Colors.white,
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
    marginTop: 15,
  },
  drawerText: {
    fontSize: 16,
    fontFamily: Fonts.normal,
    marginLeft: 10,
  },
  drawer: {
    position: 'absolute',
    top: 0,
    right: 0,
    backgroundColor: Colors.white,
    borderRadius: 20,
    width: wp((250 / 430) * 100),
    height: hp((430 / 919) * 100),
    padding: 20,
    margin: 15,
  },
  dropdown11: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.litegray,
    borderRadius: 8,
    backgroundColor: 'white',
  },
  dropdownText: {
    fontSize: 16,
  },
  dropdownList: {
    backgroundColor: 'white',
    borderBottomLeftRadius: 8,
    borderBottomRightRadius: 8,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  dropdownItem: {
    padding: 12,
  },
  border: {
    borderBottomWidth: 1,
    borderBottomColor: Colors.litegray,
  },
  itemText: {
    fontSize: 16,
  },
  // dropdownLabel1: {
  //   fontSize: 16,
  //   fontWeight: 'bold',
  // },
  item1: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 12,
  },
  itemText1: {
    fontSize: 16,
    color: Colors.black,
  },
  // dropdown1: {
  //   backgroundColor: 'white',
  //   padding: 12,
  //   borderRadius: 8,
  //   flexDirection: 'row',
  //   justifyContent: 'space-between',
  //   alignItems: 'center',
  //   borderBottomWidth: 1,
  //   borderBottomColor: Colors.litegray,
  // },
  container: {
    padding: 12,
    backgroundColor: Colors.black,
    flex: 1,
  },
  crossIcon: {
    position: 'absolute',
    top: 32,
    right: 20,
    zIndex: 1,
  },
  scrollView: {
    backgroundColor: Colors.white,
    flex: 1,
    borderRadius: 16,
    padding: 10,
  },
  label1: {
    color: Colors.black,
    fontSize: 20,
    marginBottom: 5,
    fontFamily: Fonts.normal,
  },
  sparringPartnerItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 8,
    marginBottom: 10,
  },
  sparringPartnerText: {
    fontSize: 12,
    color: Colors.white,
    fontFamily: Fonts.normal,
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 5,
    textAlign: 'center',
    alignItems: 'center',
  },
  // removeButton: {
  //   justifyContent: 'center',
  //   paddingRight: 6,
  // },
  // valueText: {
  //   fontSize: 12,
  //   color: Colors.white,
  //   paddingHorizontal: 6,
  //   borderRadius: 3,
  // },
  // valueContainer: {
  //   position: 'absolute',
  //   paddingHorizontal: 15,
  //   margin: 10,
  // },
  selectionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderWidth: 1,
    borderColor: Colors.gray,
    borderRadius: 8,
    marginBottom: 16,
  },
  // sliderView: {
  //   borderRadius: 15,
  //   padding: 14,
  // },
  selectionText: {
    fontSize: 17,
    fontFamily: Fonts.normal,
    paddingLeft: 10,
    color: Colors.black,
  },
  listOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderColor: Colors.litegray,
  },
  listOptionText: {
    fontSize: 20,
    fontFamily: Fonts.normal,
    flex: 1,
    marginLeft: 5,
  },
  counterContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  // counterButton: {
  //   width: 30,
  //   height: 30,
  //   justifyContent: 'center',
  //   alignItems: 'center',
  //   backgroundColor: Colors.gray,
  //   borderRadius: 5,
  //   marginHorizontal: 5,
  // },
  counterValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.black,
    marginHorizontal: 10,
  },
  section: {
    marginVertical: 22,
  },
  notesInput: {
    height: 120,
    borderRadius: 16,
    padding: 12,
    fontSize: 16,
    backgroundColor: Colors.litegray,
    marginBottom: 20,
  },
  // fileButton1: {
  //   backgroundColor: Colors.gray,
  //   borderRadius: 5,
  //   width: wp((145 / 430) * 100),
  //   height: hp((40 / 919) * 100),
  //   flexDirection: 'row',
  //   justifyContent: 'center',
  //   alignItems: 'center',
  //   margin: 5,
  // },
  // fileButtonText: {
  //   color: Colors.white,
  //   fontSize: 16,
  //   fontFamily: Fonts.normal,
  //   marginLeft: 10,
  // },
  submitButton: {
    backgroundColor: Colors.red,
    height: 48,
    justifyContent: 'center',
    borderRadius: 8,
    margin: 5,
    marginBottom: 25,
  },
  submitButtonText: {
    fontWeight: '700',
    color: Colors.white,
    fontSize: 16,
    textAlign: 'center',
  },
  // selectLabel: {
  //   fontFamily: Fonts.normal,
  //   fontSize: 20,
  //   marginVertical: 10,
  //   color: Colors.black,
  // },
  addNewItemContainer: {
    margin: 3,
    borderWidth: 0.6,
    borderColor: Colors.gray,
    padding: 20,
    borderRadius: 8,
    marginTop: 10,
  },
  newItemInput: {
    height: 40,
    borderColor: Colors.litegray,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    marginBottom: 10,
  },
  addItemButtons: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 8,
  },
  // cancelButton: {
  //   borderColor: Colors.red,
  //   borderWidth: 1,
  //   marginRight: 5,
  //   borderRadius: 8,
  //   width: wp((69 / 430) * 100),
  //   height: hp((31 / 919) * 100),
  //   justifyContent: 'center',
  // },
  cancelButtonText: {
    textAlign: 'center',
    color: Colors.red,
  },
  // addButton: {
  //   backgroundColor: Colors.black,
  //   marginLeft: 5,
  //   borderRadius: 8,
  //   width: wp((54 / 430) * 100),
  //   height: hp((31 / 919) * 100),
  //   justifyContent: 'center',
  // },
  addButtonText: {
    textAlign: 'center',
    color: Colors.white,
  },
  sparringButton: {
    alignSelf: 'flex-start',
    paddingVertical: 10,
    paddingHorizontal: 10,
  },
  valueBox: {},
  textAreas: {
    textAlignVertical: 'top',
  },
});

export default LogScreen;
