import React, {useState} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  Image,
  Dimensions,
  ScrollView,
} from 'react-native';
import Slider from '@react-native-community/slider';
import Colors from '../../theme/color';
import {Fonts} from '../../assets/fonts';
import SVG from '../../assets/svg';
import IMAGES from '../../assets/images';
import {wp} from '../../utility/ResponseUI';
import makeRequest from '../../api/http';
import {EndPoints} from '../../api/config';
import {showToast} from '../../utility/Toast';

const {width} = Dimensions.get('window');

const recipientOptions = [
  'Paid',
  'Unpaid',
  'Manual Selection',
  'Last X Days Since Training',
];

const recipientTypeMap = {
  Paid: 'paid',
  Unpaid: 'unpaid',
  'Manual Selection': 'manual',
  'Last X Days Since Training': 'days',
};

const manualSelectionOptions = [
  {id: 1, name: 'Josh Jones', photo: IMAGES.Photo},
  {id: 2, name: 'Paul Walker', photo: IMAGES.Photo1},
  {id: 3, name: 'Keir Starmer', photo: IMAGES.Photo2},
  {id: 4, name: 'Joshy Watson', photo: IMAGES.Photo3},
  {id: 5, name: 'William', photo: IMAGES.Photo4},
  {id: 6, name: 'Richard Johnson', photo: IMAGES.Photo5},
  {id: 7, name: 'Sanjay', photo: IMAGES.Photo6},
  {id: 8, name: 'Piter', photo: IMAGES.Photo7},
];

const MessageScreen = () => {
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [manualListVisible, setManualListVisible] = useState(false);
  const [daysSliderVisible, setDaysSliderVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRecipient, setSelectedRecipient] = useState(
    'Select Recipient Type',
  );
  const [selectedManualRecipients, setSelectedManualRecipients] = useState([]);
  const [value, setValue] = useState(0);
  const [message, setMessage] = useState('');

  const toggleManualSelection = item => {
    setSelectedManualRecipients(prev =>
      prev.some(selected => selected.id === item.id)
        ? prev.filter(selected => selected.id !== item.id)
        : [...prev, item],
    );
  };

  const handleSendNotification = async () => {
    if (!message.trim()) {
      showToast({message: 'Please enter a message'});
      return;
    }

    if (selectedRecipient === 'Select Recipient Type') {
      showToast({message: 'Please select recipient type'});
      return;
    }

    const mappedType = recipientTypeMap[selectedRecipient];
    if (!mappedType) {
      showToast({message: 'Invalid recipient type selected'});
      return;
    }

    let body = {
      message,
      recipient_type: mappedType,
    };

    if (mappedType === 'manual') {
      const recipient_ids = selectedManualRecipients.map(r => r.id);
      if (recipient_ids.length === 0) {
        showToast({message: 'Please select at least one recipient'});
        return;
      }
      body.recipient_ids = recipient_ids;
    } else if (mappedType === 'days') {
      body.days = value;
    }

    try {
      await makeRequest({
        endPoint: EndPoints.SendNotification,
        method: 'POST',
        body,
      });

      showToast({message: 'Notification sent successfully'});
      setMessage('');
      setSelectedRecipient('Select Recipient Type');
      setManualListVisible(false);
      setDaysSliderVisible(false);
      setSelectedManualRecipients([]);
    } catch (err) {}
  };

  const filteredManualSelectionOptions = manualSelectionOptions.filter(item =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.label}>Write Message</Text>
      <TextInput
        style={styles.textInput}
        placeholder="message..."
        placeholderTextColor={Colors.gray}
        multiline
        value={message}
        onChangeText={setMessage}
      />

      <Text style={styles.label}>Recipients</Text>
      <View style={styles.dropdownContainer}>
        <TouchableOpacity
          style={styles.dropdown}
          onPress={() => setDropdownVisible(!dropdownVisible)}>
          <Text style={styles.dropdownText}>{selectedRecipient}</Text>
          {dropdownVisible ? <SVG.SmallArrow /> : <SVG.SmallRight />}
        </TouchableOpacity>
        {dropdownVisible && (
          <FlatList
            data={recipientOptions}
            keyExtractor={item => item}
            renderItem={({item, index}) => (
              <TouchableOpacity
                style={[
                  styles.dropdownItem,
                  index === recipientOptions.length - 1 && {
                    borderBottomWidth: 0,
                  },
                ]}
                onPress={() => {
                  setSelectedRecipient(item);
                  setDropdownVisible(false);

                  if (item === 'Manual Selection') {
                    setManualListVisible(true);
                    setDaysSliderVisible(false);
                  } else if (item === 'Last X Days Since Training') {
                    setDaysSliderVisible(true);
                    setManualListVisible(false);
                  } else {
                    setManualListVisible(false);
                    setDaysSliderVisible(false);
                  }
                }}>
                <Text style={styles.dropdownItemText}>{item}</Text>
              </TouchableOpacity>
            )}
          />
        )}
      </View>

      {manualListVisible && (
        <View style={styles.manualSelectionContainer}>
          <View style={styles.searchContainer}>
            <TextInput
              style={styles.searchInput}
              placeholder="Search pupil"
              placeholderTextColor={Colors.gray}
              value={searchQuery}
              onChangeText={text => setSearchQuery(text)}
            />
            <SVG.SearchIcon />
          </View>

          <FlatList
            data={filteredManualSelectionOptions}
            keyExtractor={item => item.id.toString()}
            renderItem={({item}) => (
              <TouchableOpacity
                style={styles.manualItem}
                onPress={() => toggleManualSelection(item)}>
                <View style={styles.manualItemContent}>
                  <Image source={item.photo} style={styles.profilePic} />
                  <Text style={styles.manualItemText}>{item.name}</Text>
                </View>
                {selectedManualRecipients.some(
                  selected => selected.id === item.id,
                ) ? (
                  <SVG.TickSelect />
                ) : (
                  <SVG.TickUnselect />
                )}
              </TouchableOpacity>
            )}
          />
        </View>
      )}

      {daysSliderVisible && (
        <View style={styles.sliderContainer}>
          <Text style={styles.sliderTitle}>Select Days</Text>
          <View style={styles.sliderView}>
            <View
              style={[
                styles.valueContainer,
                {
                  left: wp(((value - 0) / (40 - 0)) * 100),
                },
              ]}>
              <Text style={styles.valueText}>{value} days</Text>
            </View>
            <View style={{marginTop: 20}}>
              <Slider
                minimumValue={0}
                maximumValue={30}
                step={1}
                minimumTrackTintColor={Colors.red}
                maximumTrackTintColor={Colors.pink}
                thumbTintColor={Colors.red}
                onValueChange={setValue}
              />
            </View>
          </View>
        </View>
      )}

      <TouchableOpacity
        style={styles.sendButton}
        onPress={handleSendNotification}>
        <Text style={styles.sendButtonText}>Send Notification</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.black,
    padding: 20,
  },
  label: {
    color: Colors.white,
    fontSize: 16,
    fontFamily: Fonts.normal,
    marginBottom: 10,
  },
  textInput: {
    color: Colors.white,
    borderRadius: 5,
    padding: 10,
    height: 100,
    textAlignVertical: 'top',
    borderWidth: 1,
    borderColor: Colors.gray,
    marginBottom: 20,
  },
  dropdownContainer: {
    backgroundColor: Colors.white,
    borderRadius: 8,
  },
  dropdown: {
    padding: 15,
    borderRadius: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: Colors.litegray,
  },
  dropdownText: {
    color: Colors.black,
    fontSize: 16,
  },
  dropdownItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: Colors.litegray,
  },
  dropdownItemText: {
    color: Colors.black,
    fontSize: 16,
  },
  manualSelectionContainer: {
    backgroundColor: Colors.white,
    borderRadius: 8,
    marginTop: 20,
    paddingBottom: 10,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.litegray,
    paddingHorizontal: 10,
    borderRadius: 5,
    margin: 10,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 8,
    fontSize: 12,
    color: Colors.black,
  },
  manualItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    justifyContent: 'space-between',
  },
  manualItemContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  profilePic: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  manualItemText: {
    color: Colors.black,
    fontSize: 16,
  },
  sliderContainer: {
    marginTop: 20,
  },
  sendButton: {
    backgroundColor: Colors.red,
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    marginVertical: 30,
  },
  sendButtonText: {
    color: Colors.white,
    fontSize: 14,
    fontWeight: 'bold',
  },
  sliderTitle: {
    color: Colors.white,
    fontFamily: Fonts.normal,
    fontSize: 20,
  },
  sliderView: {
    borderRadius: 15,
    padding: 14,
  },
  valueContainer: {
    position: 'absolute',
    paddingHorizontal: 2,
    margin: 10,
    backgroundColor: Colors.white,
    borderRadius: 4,
  },
  valueText: {
    fontSize: 12,
    color: Colors.black,
    fontFamily: Fonts.normal,
  },
});

export default MessageScreen;
