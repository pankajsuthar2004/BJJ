import React, {useState} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  FlatList,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import Slider from '@react-native-community/slider';
import Colors from '../../theme/color';
import {Fonts} from '../../assets/fonts';
import {hp, wp} from '../../utility/ResponseUI';
import SVG from '../../assets/svg';

const RoundScreen = () => {
  const [notes, setNotes] = useState(0);
  const [value, setValue] = useState(0);
  const navigation = useNavigation();
  const [listVisible, setListVisible] = useState('');
  const [selectedType, setSelectedType] = useState('');
  const [itemCounts, setItemCounts] = useState({});
  const [isAddingArea, setIsAddingArea] = useState(false);
  const [newItem, setNewItem] = useState('');
  const [showSparringInput, setShowSparringInput] = useState(false);
  const [sparringPartner, setSparringPartner] = useState('');
  const [sparringPartnersList, setSparringPartnersList] = useState([]);

  const options = {
    'Submissions Achieved': [
      'Guillotine',
      'Americana',
      'RNC',
      'Kimura',
      'Armbar',
      'Straight Foot Lock',
    ],
    'Submissions Conceded': [
      'Guillotine',
      'Americana',
      'RNC',
      'Kimura',
      'Armbar',
    ],
    'Positions Achieved': [
      'Back',
      'Mount',
      'Side',
      'Control',
      'Butterfly Control',
    ],
    'Positions Conceded': [
      'Back',
      'Mount',
      'Side',
      'Control',
      'Butterfly Control',
    ],
  };

  const incrementCount = item => {
    setItemCounts(prevCounts => ({
      ...prevCounts,
      [item]: (prevCounts[item] || 0) + 1,
    }));
  };

  const decrementCount = item => {
    setItemCounts(prevCounts => ({
      ...prevCounts,
      [item]: Math.max((prevCounts[item] || 0) - 1, 0),
    }));
  };

  const toggleDropdown = type => {
    setListVisible(prevType => (prevType === type ? '' : type));
    setSelectedType(type);
  };

  const handleAddNewItem = () => {
    if (newItem.trim()) {
      setItemCounts(prevCounts => ({
        ...prevCounts,
        [newItem]: 1,
      }));
      setNewItem('');
      setIsAddingArea(false);
    }
  };

  const handleAddSparringPartner = () => {
    if (sparringPartner.trim()) {
      setSparringPartnersList(prevList => [...prevList, sparringPartner]);
      setSparringPartner('');
      setShowSparringInput(false);
    }
  };

  const removeSparringPartner = index => {
    setSparringPartnersList(prevList => prevList.filter((_, i) => i !== index));
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.crossIcon}
        onPress={() => navigation.goBack()}>
        <SVG.CrossIcon />
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
                {
                  left: wp(((value - 0) / (58 - 0)) * 70),
                },
              ]}>
              <View
                style={{
                  alignItems: 'center',
                  justifyContent: 'center',
                  alignSelf: 'center',
                  backgroundColor: Colors.black,
                  borderRadius: 4,
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

        <Text style={{fontSize: 20, fontFamily: Fonts.normal}}>
          Sparring Partner
        </Text>
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
          <View style={styles.sparringPartnersList}>
            <FlatList
              data={sparringPartnersList}
              keyExtractor={index => index.toString()}
              horizontal
              renderItem={({item, index}) => (
                <View style={styles.sparringPartnerItem}>
                  <View style={styles.listView}>
                    <Text style={styles.sparringPartnerText}>{item}</Text>
                    <TouchableOpacity
                      style={styles.removeButton}
                      onPress={() => removeSparringPartner(index)}>
                      <SVG.WhiteCross />
                    </TouchableOpacity>
                  </View>
                </View>
              )}
            />
          </View>
        )}

        {Object.keys(options).map(type => (
          <View key={type}>
            <Text style={styles.selectLabel}>{type}</Text>
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
                <FlatList
                  data={options[type]}
                  keyExtractor={item => item}
                  renderItem={({item}) => (
                    <View style={styles.listOption}>
                      <SVG.ArrowRight />
                      <Text style={styles.listOptionText}>{item}</Text>
                      <View style={styles.counterContainer}>
                        <TouchableOpacity onPress={() => decrementCount(item)}>
                          <SVG.Delete1 />
                        </TouchableOpacity>
                        <Text style={styles.counterValue}>
                          {itemCounts[item] || 0}
                        </Text>
                        <TouchableOpacity onPress={() => incrementCount(item)}>
                          <SVG.PlusIcon style={styles.counterText} />
                        </TouchableOpacity>
                      </View>
                    </View>
                  )}
                />

                {!isAddingArea ? (
                  <TouchableOpacity
                    style={{
                      backgroundColor: Colors.black,
                      padding: 15,
                      margin: 5,
                      borderRadius: 8,
                      marginBottom: 15,
                    }}
                    onPress={() => setIsAddingArea(true)}>
                    <Text
                      style={{
                        fontSize: 12,
                        color: Colors.white,
                        textAlign: 'center',
                        fontFamily: Fonts.normal,
                      }}>
                      Add New
                    </Text>
                  </TouchableOpacity>
                ) : (
                  <View style={styles.addNewItemContainer}>
                    <TextInput
                      style={styles.newItemInput}
                      placeholder="Add New"
                      placeholderTextColor={Colors.gray}
                      value={newItem}
                      onChangeText={setNewItem}
                    />
                    <View style={styles.addItemButtons}>
                      <TouchableOpacity
                        style={styles.cancelButton}
                        onPress={() => setIsAddingArea(false)}>
                        <Text style={styles.cancelButtonText}>Cancel</Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={styles.addButton}
                        onPress={handleAddNewItem}>
                        <Text style={styles.addButtonText}>Add</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                )}
              </View>
            )}
          </View>
        ))}

        <Text style={styles.label}>Notes</Text>
        <TextInput
          style={[
            styles.notesInput,
            {textAlignVertical: 'top', paddingTop: 15},
          ]}
          placeholder="notes here...."
          placeholderTextColor={Colors.gray}
          multiline
          value={notes}
          onChangeText={setNotes}
        />

        <View style={styles.section1}>
          <Text style={styles.label}>Attach Files</Text>
          <TouchableOpacity style={styles.fileButton1}>
            <SVG.PaperClip />
            <Text style={styles.fileButtonText}>Choose File</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={styles.submitButton}
          onPress={() => navigation.navigate('DashBoardScreen')}>
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
    top: 20,
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
    marginBottom: 8,
  },
  notesInput: {
    height: 120,
    borderRadius: 16,
    padding: 12,
    fontSize: 16,
    backgroundColor: Colors.litegray,
    marginBottom: 20,
  },
  section1: {
    marginBottom: 8,
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
    marginBottom: 10,
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
