import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  FlatList,
  Image,
} from 'react-native';
import Slider from '@react-native-community/slider';
import Colors from '../../theme/color';
import {Fonts} from '../../assets/fonts';
import {hp, wp} from '../../utility/ResponseUI';
import SVG from '../../assets/svg';
import makeRequest from '../../api/http';
import {EndPoints} from '../../api/config';
import {showToast} from '../../utility/Toast';
import {launchImageLibrary} from 'react-native-image-picker';

const RoundScreen = ({onClose}) => {
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

  useEffect(() => {
    fetchTrainingOptions();
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
    if (sparringPartner.trim()) {
      setSparringPartnersList(prev => [...prev, sparringPartner]);
      setSparringPartner('');
      setShowSparringInput(false);
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

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.crossIcon} onPress={onClose}>
        <SVG.IconCross />
      </TouchableOpacity>

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}>
        <View style={styles.section}>
          <Text style={styles.label}>
            Round Duration<Text style={{fontSize: 12}}> (Minutes)</Text>
          </Text>
          <View style={styles.sliderView}>
            <View
              style={[
                styles.valueContainer,
                {left: wp(((value - 0) / (60 - 0)) * 70)},
              ]}>
              <View style={styles.valueBox}>
                <Text style={styles.valueText}>{value}</Text>
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

        <Text style={styles.label}>Sparring Partner</Text>
        {!showSparringInput ? (
          <TouchableOpacity
            style={styles.sparringButton}
            onPress={() => setShowSparringInput(true)}>
            <SVG.BlackIcon />
          </TouchableOpacity>
        ) : (
          <View style={styles.addNewItemContainer}>
            <TextInput
              style={styles.newItemInput}
              placeholder="Enter sparring partner..."
              placeholderTextColor={Colors.gray}
              value={sparringPartner}
              onChangeText={setSparringPartner}
            />
            <View style={styles.addItemButtons}>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => setShowSparringInput(false)}>
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.addButton}
                onPress={handleAddSparringPartner}>
                <Text style={styles.addButtonText}>Add</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {sparringPartnersList.length > 0 && (
          <FlatList
            data={sparringPartnersList}
            horizontal
            keyExtractor={(_, i) => i.toString()}
            renderItem={({item, index}) => (
              <View style={styles.sparringPartnerItem}>
                <Text style={styles.sparringPartnerText}>{item}</Text>
                <TouchableOpacity onPress={() => removeSparringPartner(index)}>
                  <SVG.WhiteCross />
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
                {listVisible === type ? <SVG.ArrowIcons /> : <SVG.ArrowIcon />}
              </View>
            </TouchableOpacity>

            {listVisible === type && (
              <View>
                {options[type].map(item => (
                  <View key={item.id || item.name} style={styles.listOption}>
                    <SVG.ArrowRight />
                    <Text style={styles.listOptionText}>{item.name}</Text>
                    <View style={styles.counterContainer}>
                      <TouchableOpacity
                        onPress={() => decrementCount(item.name)}>
                        <SVG.Delete1 />
                      </TouchableOpacity>
                      <Text style={styles.counterValue}>
                        {itemCounts[item.name] || 0}
                      </Text>
                      <TouchableOpacity
                        onPress={() => incrementCount(item.name)}>
                        <SVG.PlusIcon />
                      </TouchableOpacity>
                    </View>
                  </View>
                ))}
              </View>
            )}
          </View>
        ))}

        <Text style={styles.label}>Notes</Text>
        <TextInput
          style={styles.notesInput}
          placeholder="notes here...."
          placeholderTextColor={Colors.gray}
          multiline
          value={notes}
          onChangeText={setNotes}
        />

        <View style={styles.section}>
          <Text style={styles.label}>Attach Files</Text>
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

        <TouchableOpacity style={styles.submitButton} onPress={onClose}>
          <Text style={styles.submitButtonText}>Submit Now</Text>
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
  label: {
    color: Colors.black,
    fontSize: 20,
    marginBottom: 5,
    fontFamily: Fonts.normal,
  },
  sparringPartnersList: {
    marginVertical: 10,
    flexDirection: 'row',
    alignItems: 'center',
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
  removeButton: {
    justifyContent: 'center',
    paddingRight: 6,
  },
  valueText: {
    fontSize: 12,
    color: Colors.white,
    paddingHorizontal: 6,
    borderRadius: 3,
  },
  valueContainer: {
    position: 'absolute',
    paddingHorizontal: 15,
    margin: 10,
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
  sliderView: {
    borderRadius: 15,
    padding: 14,
  },
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
  counterButton: {
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.gray,
    borderRadius: 5,
    marginHorizontal: 5,
  },
  counterText: {
    fontSize: 20,
  },
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
  fileButton1: {
    backgroundColor: Colors.gray,
    borderRadius: 5,
    width: wp((145 / 430) * 100),
    height: hp((40 / 919) * 100),
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    margin: 5,
  },
  fileButtonText: {
    color: Colors.white,
    fontSize: 16,
    fontFamily: Fonts.normal,
    marginLeft: 10,
  },
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
  selectLabel: {
    fontFamily: Fonts.normal,
    fontSize: 20,
    marginVertical: 10,
    color: Colors.black,
  },
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
  },
  cancelButton: {
    borderColor: Colors.red,
    borderWidth: 1,
    marginRight: 5,
    borderRadius: 8,
    width: wp((69 / 430) * 100),
    height: hp((31 / 919) * 100),
    justifyContent: 'center',
  },
  cancelButtonText: {
    textAlign: 'center',
    color: Colors.red,
  },
  addButton: {
    backgroundColor: Colors.black,
    marginLeft: 5,
    borderRadius: 8,
    width: wp((54 / 430) * 100),
    height: hp((31 / 919) * 100),
    justifyContent: 'center',
  },
  addButtonText: {
    textAlign: 'center',
    color: Colors.white,
  },
  sparringButton: {
    alignSelf: 'flex-start',
    paddingVertical: 10,
    paddingHorizontal: 10,
  },
  listView: {
    backgroundColor: Colors.red,
    flexDirection: 'row',
    paddingHorizontal: 5,
    borderRadius: 8,
  },
});

export default RoundScreen;
